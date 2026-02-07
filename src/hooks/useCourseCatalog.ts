import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { defaultComponents } from "@/components/gpa/types";
import { toast } from "sonner";

export interface CatalogCourse {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  enrollment_count: number;
  is_enrolled: boolean;
}

export function useCourseCatalog(searchQuery?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["course_catalog", user?.id, searchQuery],
    queryFn: async (): Promise<CatalogCourse[]> => {
      if (!user) return [];

      // Fetch catalog courses
      let query = supabase
        .from("course_catalog")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery && searchQuery.trim()) {
        query = query.ilike("name", `%${searchQuery.trim()}%`);
      }

      const { data: courses, error } = await query;
      if (error) throw error;

      // Fetch all enrollments
      const { data: enrollments, error: enrollError } = await supabase
        .from("course_enrollments")
        .select("catalog_course_id, user_id");

      if (enrollError) throw enrollError;

      return (courses || []).map((course) => {
        const courseEnrollments = (enrollments || []).filter(
          (e) => e.catalog_course_id === course.id
        );
        return {
          id: course.id,
          name: course.name,
          created_by: course.created_by,
          created_at: course.created_at,
          enrollment_count: courseEnrollments.length,
          is_enrolled: courseEnrollments.some((e) => e.user_id === user.id),
        };
      });
    },
    enabled: !!user,
  });
}

export function useMyEnrolledCourses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my_enrolled_courses", user?.id],
    queryFn: async (): Promise<CatalogCourse[]> => {
      if (!user) return [];

      const { data: enrollments, error: enrollError } = await supabase
        .from("course_enrollments")
        .select("catalog_course_id")
        .eq("user_id", user.id);

      if (enrollError) throw enrollError;
      if (!enrollments || enrollments.length === 0) return [];

      const catalogIds = enrollments.map((e) => e.catalog_course_id);

      const { data: courses, error } = await supabase
        .from("course_catalog")
        .select("*")
        .in("id", catalogIds);

      if (error) throw error;

      // Get all enrollments for count
      const { data: allEnrollments } = await supabase
        .from("course_enrollments")
        .select("catalog_course_id, user_id")
        .in("catalog_course_id", catalogIds);

      return (courses || []).map((course) => {
        const courseEnrollments = (allEnrollments || []).filter(
          (e) => e.catalog_course_id === course.id
        );
        return {
          id: course.id,
          name: course.name,
          created_by: course.created_by,
          created_at: course.created_at,
          enrollment_count: courseEnrollments.length,
          is_enrolled: true,
        };
      });
    },
    enabled: !!user,
  });
}

export function useCreateCatalogCourse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("course_catalog")
        .insert({ name: name.trim(), created_by: user.id })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("هذا المقرر موجود بالفعل");
        }
        throw error;
      }

      // Auto-enroll the creator
      await supabase
        .from("course_enrollments")
        .insert({ user_id: user.id, catalog_course_id: data.id });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course_catalog"] });
      queryClient.invalidateQueries({ queryKey: ["my_enrolled_courses"] });
      toast.success("تم إنشاء المقرر بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء المقرر");
    },
  });
}

export function useEnrollInCourse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (catalogCourseId: string) => {
      if (!user) throw new Error("Not authenticated");

      // Enroll in the course
      const { error } = await supabase
        .from("course_enrollments")
        .insert({ user_id: user.id, catalog_course_id: catalogCourseId });

      if (error) throw error;

      // Also create a GPA course entry if not already exists
      const { data: existingGpa } = await supabase
        .from("courses")
        .select("id")
        .eq("user_id", user.id)
        .eq("catalog_course_id", catalogCourseId)
        .maybeSingle();

      if (!existingGpa) {
        // Get course name from catalog
        const { data: catalogCourse } = await supabase
          .from("course_catalog")
          .select("name")
          .eq("id", catalogCourseId)
          .single();

        if (catalogCourse) {
          const components = defaultComponents.map((c) => ({
            ...c,
            id: crypto.randomUUID(),
          }));

          await supabase.from("courses").insert({
            user_id: user.id,
            name: catalogCourse.name,
            credits: 3,
            components: components as unknown as Record<string, unknown>[],
            catalog_course_id: catalogCourseId,
          } as never);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course_catalog"] });
      queryClient.invalidateQueries({ queryKey: ["my_enrolled_courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("تم الانضمام للمقرر");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء الانضمام");
    },
  });
}

export function useUnenrollFromCourse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (catalogCourseId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("course_enrollments")
        .delete()
        .eq("user_id", user.id)
        .eq("catalog_course_id", catalogCourseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course_catalog"] });
      queryClient.invalidateQueries({ queryKey: ["my_enrolled_courses"] });
      toast.success("تم إلغاء الانضمام");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إلغاء الانضمام");
    },
  });
}
