import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Course, GradeComponent } from "@/components/gpa/types";
import { toast } from "sonner";

interface DBCourse {
  id: string;
  user_id: string;
  name: string;
  credits: number;
  components: GradeComponent[];
  catalog_course_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useCourses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["courses", user?.id],
    queryFn: async (): Promise<Course[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return (data as unknown as DBCourse[]).map((course) => ({
        id: course.id,
        name: course.name,
        credits: course.credits,
        components: course.components,
        catalogCourseId: course.catalog_course_id,
      }));
    },
    enabled: !!user,
  });
}

export function useSaveCourses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courses: Course[]) => {
      if (!user) throw new Error("User not authenticated");

      // Get existing courses
      const { data: existingCourses, error: fetchError } = await supabase
        .from("courses")
        .select("id")
        .eq("user_id", user.id);

      if (fetchError) throw fetchError;

      const existingIds = new Set((existingCourses || []).map((c) => c.id));
      const newIds = new Set(courses.map((c) => c.id));

      // Delete removed courses
      const toDelete = [...existingIds].filter((id) => !newIds.has(id));
      if (toDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("courses")
          .delete()
          .in("id", toDelete);
        if (deleteError) throw deleteError;
      }

      // For each course, ensure it exists in the catalog and user is enrolled
      for (const course of courses) {
        if (course.name.trim()) {
          // Try to find or create catalog entry
          let catalogId: string | null = null;

          const { data: existing } = await supabase
            .from("course_catalog")
            .select("id")
            .eq("name", course.name.trim())
            .maybeSingle();

          if (existing) {
            catalogId = existing.id;
          } else {
            const { data: created } = await supabase
              .from("course_catalog")
              .insert({ name: course.name.trim(), created_by: user.id })
              .select("id")
              .single();

            if (created) catalogId = created.id;
          }

          // Auto-enroll if not already
          if (catalogId) {
            await supabase
              .from("course_enrollments")
              .upsert(
                { user_id: user.id, catalog_course_id: catalogId },
                { onConflict: "user_id,catalog_course_id" }
              );
          }

          // Upsert the GPA course
          const courseData = {
            id: course.id,
            user_id: user.id,
            name: course.name,
            credits: course.credits,
            components: course.components as unknown as Record<string, unknown>[],
            catalog_course_id: catalogId,
          };

          const { error } = await supabase
            .from("courses")
            .upsert(courseData as never);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course_catalog"] });
      queryClient.invalidateQueries({ queryKey: ["my_enrolled_courses"] });
      toast.success("تم حفظ الدرجات بنجاح");
    },
    onError: (error) => {
      console.error("Error saving courses:", error);
      toast.error("حدث خطأ أثناء حفظ الدرجات");
    },
  });
}
