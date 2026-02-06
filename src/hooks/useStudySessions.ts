import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface StudySession {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  course_name: string | null;
  session_date: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  max_participants: number | null;
  category: string;
  created_at: string;
  participant_count: number;
  is_joined: boolean;
}

export function useStudySessions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["study-sessions", user?.id],
    queryFn: async (): Promise<StudySession[]> => {
      if (!user) return [];

      // Fetch sessions
      const { data: sessions, error } = await supabase
        .from("study_sessions")
        .select("*")
        .order("session_date", { ascending: true });

      if (error) throw error;

      // Fetch all participants counts
      const { data: participants, error: pError } = await supabase
        .from("session_participants")
        .select("session_id, user_id");

      if (pError) throw pError;

      return (sessions || []).map((s) => {
        const sessionParticipants = (participants || []).filter(
          (p) => p.session_id === s.id
        );
        return {
          ...s,
          participant_count: sessionParticipants.length,
          is_joined: sessionParticipants.some((p) => p.user_id === user.id),
        };
      });
    },
    enabled: !!user,
  });
}

export function useCreateSession() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: {
      title: string;
      description?: string;
      course_name?: string;
      session_date: string;
      start_time: string;
      end_time?: string;
      location?: string;
      max_participants?: number;
      category: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("study_sessions").insert({
        ...session,
        creator_id: user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
      toast.success("تم إنشاء الجلسة بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إنشاء الجلسة");
    },
  });
}

export function useJoinSession() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("session_participants").insert({
        session_id: sessionId,
        user_id: user.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
      toast.success("تم الانضمام للجلسة بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء الانضمام");
    },
  });
}

export function useLeaveSession() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("session_participants")
        .delete()
        .eq("session_id", sessionId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
      toast.success("تم إلغاء الاشتراك");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إلغاء الاشتراك");
    },
  });
}
