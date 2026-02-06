import { TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  semesterProgress: number;
  coursesCompleted: number;
  totalCourses: number;
  gpa?: number;
}

export function ProgressCard({ 
  semesterProgress, 
  coursesCompleted, 
  totalCourses,
  gpa 
}: ProgressCardProps) {
  return (
    <div className="mx-4 p-5 rounded-2xl gradient-primary text-primary-foreground shadow-medium">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-primary-foreground/80 text-sm mb-1">تقدم الفصل الدراسي</p>
          <p className="text-3xl font-bold">{semesterProgress}%</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
      
      <Progress 
        value={semesterProgress} 
        className="h-2 bg-primary-foreground/20 mb-4"
      />
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-primary-foreground/70">الساعات:</span>
          <span className="font-semibold">{coursesCompleted}/{totalCourses}</span>
        </div>
        {gpa !== undefined && gpa > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-primary-foreground/70">المعدل:</span>
            <span className="font-semibold">{gpa.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
