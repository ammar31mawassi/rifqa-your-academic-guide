import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Goal {
  id: string;
  user_id: string;
  course_id: string | null;
  goal_type: "course" | "semester" | "degree";
  target_score: number;
}

export function useGoals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async (): Promise<Goal[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return (data || []) as Goal[];
    },
    enabled: !!user,
  });
}

export function useUpsertGoal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goal: {
      course_id?: string | null;
      goal_type: "course" | "semester" | "degree";
      target_score: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("goals")
        .upsert(
          {
            user_id: user.id,
            course_id: goal.course_id || null,
            goal_type: goal.goal_type,
            target_score: goal.target_score,
          } as never,
          { onConflict: "user_id,course_id,goal_type" }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("تم حفظ الهدف بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حفظ الهدف");
    },
  });
}

export function useDeleteGoal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("تم حذف الهدف");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الهدف");
    },
  });
}
