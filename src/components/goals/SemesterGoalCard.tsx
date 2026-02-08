import { useState } from "react";
import { Target, Check, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getGradeLabel, getLetterGrade } from "@/components/gpa/types";

interface SemesterGoalCardProps {
  type: "semester" | "degree";
  currentAverage: number;
  targetScore: number | null;
  onSetGoal: (target: number) => void;
  isSaving: boolean;
}

const labels: Record<string, { title: string; icon: string }> = {
  semester: { title: "هدف الفصل الدراسي", icon: "📚" },
  degree: { title: "هدف التخرج", icon: "🎓" },
};

export function SemesterGoalCard({
  type,
  currentAverage,
  targetScore,
  onSetGoal,
  isSaving,
}: SemesterGoalCardProps) {
  const [editTarget, setEditTarget] = useState(targetScore?.toString() || "");
  const [isEditing, setIsEditing] = useState(!targetScore);
  const config = labels[type];

  const handleSave = () => {
    const val = parseFloat(editTarget);
    if (isNaN(val) || val < 0 || val > 100) return;
    onSetGoal(val);
    setIsEditing(false);
  };

  const diff = targetScore ? targetScore - currentAverage : 0;
  const onTrack = targetScore ? currentAverage >= targetScore : false;

  return (
    <div className="rounded-xl bg-card shadow-soft border border-border/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{config.icon}</span>
        <h3 className="font-semibold text-foreground">{config.title}</h3>
      </div>

      {/* Current average */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>المعدل الحالي</span>
          <span>
            {currentAverage.toFixed(1)} ({getLetterGrade(currentAverage)} - {getGradeLabel(currentAverage)})
          </span>
        </div>
        <Progress value={currentAverage} className="h-2" />
      </div>

      {/* Target */}
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            max={100}
            placeholder="المعدل المطلوب (0-100)"
            value={editTarget}
            onChange={(e) => setEditTarget(e.target.value)}
            className="h-9 text-sm bg-muted/50"
          />
          <Button size="sm" className="h-9 px-3" onClick={handleSave} disabled={isSaving}>
            <Check className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">الهدف: {targetScore}</span>
              <span className="text-xs text-muted-foreground">
                ({getLetterGrade(targetScore!)} - {getGradeLabel(targetScore!)})
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => setIsEditing(true)}
            >
              تعديل
            </Button>
          </div>

          <div
            className={cn(
              "mt-3 p-3 rounded-lg border flex items-center gap-2",
              onTrack
                ? "bg-success/5 border-success/20"
                : "bg-primary/5 border-primary/20"
            )}
          >
            <TrendingUp className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm">
              {onTrack ? (
                <span className="text-success font-medium">
                  🎉 أنت على المسار الصحيح! معدلك أعلى من هدفك
                </span>
              ) : (
                <>
                  تحتاج رفع معدلك{" "}
                  <span className="font-bold text-primary">{diff.toFixed(1)}</span> نقطة
                </>
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
