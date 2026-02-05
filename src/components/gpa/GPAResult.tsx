import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getGradeLabel, getLetterGrade } from "./types";

interface GPAResultProps {
  gpa: number;
  averageScore: number;
  overallProgress: number;
  totalCredits: number;
}

export function GPAResult({ gpa, averageScore, overallProgress, totalCredits }: GPAResultProps) {
  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-success";
    if (gpa >= 3.0) return "text-primary";
    if (gpa >= 2.0) return "text-secondary";
    return "text-destructive";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-success";
    if (progress >= 50) return "bg-primary";
    if (progress >= 25) return "bg-secondary";
    return "bg-muted";
  };

  return (
    <Card className="border-0 shadow-medium bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-6">
          {/* GPA Circle */}
          <div className="w-24 h-24 rounded-full bg-card shadow-soft flex flex-col items-center justify-center">
            <GraduationCap className={cn("w-6 h-6 mb-1", getGPAColor(gpa))} />
            <p className={cn("text-2xl font-bold", getGPAColor(gpa))}>
              {gpa.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">GPA</p>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">المعدل المئوي</span>
                <span className={cn("font-bold", getGPAColor(gpa))}>
                  {averageScore.toFixed(1)}% ({getLetterGrade(averageScore)})
                </span>
              </div>
              <p className={cn("text-sm font-medium", getGPAColor(gpa))}>
                {getGradeLabel(averageScore)}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">التقدم الكلي</span>
                <span className="font-medium">{overallProgress.toFixed(0)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>إجمالي الساعات</span>
              <span className="font-medium">{totalCredits} ساعة</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
