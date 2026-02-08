import { useState } from "react";
import { Target, ChevronDown, ChevronUp, Check, X, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Course, getGradeLabel, getLetterGrade } from "@/components/gpa/types";
import { CourseGoalAnalysis, getRequiredScoreColor } from "@/lib/goalCalculations";

interface CourseGoalCardProps {
  course: Course;
  analysis: CourseGoalAnalysis | null;
  currentTarget: number | null;
  onSetGoal: (courseId: string, target: number) => void;
  isSaving: boolean;
}

export function CourseGoalCard({
  course,
  analysis,
  currentTarget,
  onSetGoal,
  isSaving,
}: CourseGoalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editTarget, setEditTarget] = useState<string>(
    currentTarget?.toString() || ""
  );
  const [isEditing, setIsEditing] = useState(!currentTarget);

  const handleSave = () => {
    const val = parseFloat(editTarget);
    if (isNaN(val) || val < 0 || val > 100) return;
    onSetGoal(course.id, val);
    setIsEditing(false);
  };

  const completedComponents = course.components.filter((c) => c.score !== null);
  const currentEarned = analysis?.currentEarned ?? 0;

  return (
    <div className="rounded-xl bg-card shadow-soft border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{course.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {course.credits} ساعات معتمدة · {completedComponents.length}/{course.components.length} مكونات مكتملة
            </p>
          </div>
          {analysis && !analysis.isCompleted && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs shrink-0",
                analysis.isAchievable
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {analysis.isAchievable ? "ممكن" : "صعب"}
            </Badge>
          )}
        </div>

        {/* Current progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>النقاط المكتسبة</span>
            <span>{currentEarned.toFixed(1)} / 100</span>
          </div>
          <Progress value={currentEarned} className="h-1.5" />
        </div>

        {/* Target setting */}
        <div className="mt-3">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="الهدف (0-100)"
                value={editTarget}
                onChange={(e) => setEditTarget(e.target.value)}
                className="h-9 text-sm bg-muted/50"
              />
              <Button size="sm" className="h-9 px-3" onClick={handleSave} disabled={isSaving}>
                <Check className="w-4 h-4" />
              </Button>
              {currentTarget && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 px-3"
                  onClick={() => {
                    setIsEditing(false);
                    setEditTarget(currentTarget.toString());
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  الهدف: {currentTarget}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({getLetterGrade(currentTarget!)} - {getGradeLabel(currentTarget!)})
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
          )}
        </div>

        {/* Required score summary */}
        {analysis && !analysis.isCompleted && analysis.requiredAverage !== null && (
          <div
            className={cn(
              "mt-3 p-3 rounded-lg border",
              analysis.isAchievable
                ? "bg-primary/5 border-primary/20"
                : "bg-destructive/5 border-destructive/20"
            )}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm">
                {analysis.isAchievable ? (
                  <>
                    تحتاج{" "}
                    <span className={cn("font-bold", getRequiredScoreColor(analysis.requiredAverage))}>
                      {analysis.requiredAverage.toFixed(1)}
                    </span>{" "}
                    في المتبقي للوصول لهدفك
                  </>
                ) : (
                  <span className="text-destructive font-medium">
                    الهدف غير ممكن بالدرجات المتبقية — حاول تعديل الهدف
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {analysis && analysis.isCompleted && (
          <div
            className={cn(
              "mt-3 p-3 rounded-lg border",
              currentEarned >= (currentTarget || 0)
                ? "bg-success/5 border-success/20"
                : "bg-destructive/5 border-destructive/20"
            )}
          >
            <p className="text-sm">
              {currentEarned >= (currentTarget || 0) ? (
                <span className="text-success font-medium">🎉 حققت هدفك! معدلك {currentEarned.toFixed(1)}</span>
              ) : (
                <span className="text-destructive font-medium">
                  لم تحقق الهدف — معدلك {currentEarned.toFixed(1)}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Expandable component breakdown */}
      {analysis && currentTarget && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:bg-muted/50 border-t border-border/50 transition-colors"
          >
            {expanded ? "إخفاء التفاصيل" : "عرض التفاصيل"}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {expanded && (
            <div className="px-4 pb-4 space-y-2">
              {analysis.componentBreakdown.map((cb) => (
                <div
                  key={cb.component.id}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-lg text-sm",
                    cb.isCompleted ? "bg-muted/30" : "bg-primary/5"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-foreground">{cb.component.name}</span>
                    <span className="text-xs text-muted-foreground mr-2">({cb.component.weight}%)</span>
                  </div>
                  <div className="text-left">
                    {cb.isCompleted ? (
                      <span className="text-muted-foreground">
                        {cb.component.score}/{cb.component.maxScore}
                      </span>
                    ) : (
                      <span className={cn("font-bold", getRequiredScoreColor(cb.requiredScore))}>
                        {cb.requiredScore !== null
                          ? cb.requiredScore > 100
                            ? "غير ممكن"
                            : `تحتاج ${cb.requiredScore.toFixed(1)}`
                          : "—"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
