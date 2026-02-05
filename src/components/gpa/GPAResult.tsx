import { GraduationCap, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getGradeLabel, getLetterGrade } from "./types";

interface GPAResultProps {
  averageScore: number;
  overallProgress: number;
  totalCredits: number;
  completedCredits: number;
}

export function GPAResult({ averageScore, overallProgress, totalCredits, completedCredits }: GPAResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-primary";
    if (score >= 60) return "text-secondary";
    return "text-destructive";
  };

  return (
    <Card className="border-0 shadow-medium bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-6">
          {/* Score Circle */}
          <div className="w-24 h-24 rounded-full bg-card shadow-soft flex flex-col items-center justify-center">
            <GraduationCap className={cn("w-6 h-6 mb-1", getScoreColor(averageScore))} />
            <p className={cn("text-2xl font-bold", getScoreColor(averageScore))}>
              {averageScore.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">{getLetterGrade(averageScore)}</p>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">التقدير</span>
                <span className={cn("font-bold", getScoreColor(averageScore))}>
                  {getGradeLabel(averageScore)}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">التقدم الكلي</span>
                <span className="font-medium">{overallProgress.toFixed(0)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>الساعات المكتملة: <span className="font-medium text-foreground">{completedCredits.toFixed(1)}</span> / {totalCredits.toFixed(1)} ساعة</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
