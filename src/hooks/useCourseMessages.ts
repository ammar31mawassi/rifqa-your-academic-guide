import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export interface CourseMessage {
  id: string;
  catalog_course_id: string;
  user_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
}

export function useCourseMessages(catalogCourseId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["course_messages", catalogCourseId],
    queryFn: async (): Promise<CourseMessage[]> => {
      if (!user || !catalogCourseId) return [];

      const { data, error } = await supabase
        .from("course_messages")
        .select("*")
        .eq("catalog_course_id", catalogCourseId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch sender names
      const userIds = [...new Set((data || []).map((m) => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const nameMap = new Map(
        (profiles || []).map((p) => [p.user_id, p.full_name])
      );

      return (data || []).map((msg) => ({
        ...msg,
        sender_name: nameMap.get(msg.user_id) || "مستخدم",
      }));
    },
    enabled: !!user && !!catalogCourseId,
  });

  // Subscribe to realtime messages
  useEffect(() => {
    if (!catalogCourseId) return;

    const channel = supabase
      .channel(`course-messages-${catalogCourseId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "course_messages",
          filter: `catalog_course_id=eq.${catalogCourseId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["course_messages", catalogCourseId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [catalogCourseId, queryClient]);

  return query;
}

export function useSendCourseMessage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      catalogCourseId,
      content,
    }: {
      catalogCourseId: string;
      content: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("course_messages").insert({
        catalog_course_id: catalogCourseId,
        user_id: user.id,
        content: content.trim(),
      });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course_messages", variables.catalogCourseId],
      });
    },
  });
}
