import { MobileLayout } from "@/components/layout/MobileLayout";
import { Target, Loader2, BookOpen } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useGoals, useUpsertGoal } from "@/hooks/useGoals";
import { CourseGoalCard } from "@/components/goals/CourseGoalCard";
import { SemesterGoalCard } from "@/components/goals/SemesterGoalCard";
import { analyzeCourseGoal } from "@/lib/goalCalculations";
import { calculatePercentageGPA } from "@/components/gpa/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Goals() {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { mutate: upsertGoal, isPending: isSaving } = useUpsertGoal();

  const isLoading = coursesLoading || goalsLoading;

  // Build goal lookup
  const courseGoals: Record<string, number> = {};
  let semesterTarget: number | null = null;
  let degreeTarget: number | null = null;

  (goals || []).forEach((g) => {
    if (g.goal_type === "course" && g.course_id) {
      courseGoals[g.course_id] = g.target_score;
    } else if (g.goal_type === "semester") {
      semesterTarget = g.target_score;
    } else if (g.goal_type === "degree") {
      degreeTarget = g.target_score;
    }
  });

  const gpaStats = courses ? calculatePercentageGPA(courses) : null;
  const currentAverage = gpaStats?.averageScore ?? 0;

  const handleSetCourseGoal = (courseId: string, target: number) => {
    upsertGoal({ course_id: courseId, goal_type: "course", target_score: target });
  };

  const handleSetSemesterGoal = (target: number) => {
    upsertGoal({ course_id: null, goal_type: "semester", target_score: target });
  };

  const handleSetDegreeGoal = (target: number) => {
    upsertGoal({ course_id: null, goal_type: "degree", target_score: target });
  };

  return (
    <MobileLayout>
      <header className="p-4 pt-6">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">أهدافي</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          حدد أهدافك الأكاديمية وتعرّف على ما تحتاجه لتحقيقها
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !courses || courses.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">لا توجد مقررات بعد</p>
          <p className="text-sm text-muted-foreground mt-1">
            أضف مقرراتك من حاسبة المعدل أولاً
          </p>
          <Link to="/gpa">
            <Button className="mt-4" size="sm">
              اذهب لحاسبة المعدل
            </Button>
          </Link>
        </div>
      ) : (
        <div className="px-4 space-y-4 pb-6">
          {/* Semester & Degree Goals */}
          <SemesterGoalCard
            type="semester"
            currentAverage={currentAverage}
            targetScore={semesterTarget}
            onSetGoal={handleSetSemesterGoal}
            isSaving={isSaving}
          />
          <SemesterGoalCard
            type="degree"
            currentAverage={currentAverage}
            targetScore={degreeTarget}
            onSetGoal={handleSetDegreeGoal}
            isSaving={isSaving}
          />

          {/* Section header */}
          <div className="pt-2">
            <h2 className="text-lg font-bold text-foreground">أهداف المقررات</h2>
            <p className="text-xs text-muted-foreground">
              حدد الدرجة المطلوبة لكل مقرر واعرف ما تحتاجه بالضبط
            </p>
          </div>

          {/* Course Goals */}
          {courses.map((course) => {
            const target = courseGoals[course.id] ?? null;
            const analysis = target !== null ? analyzeCourseGoal(course, target) : null;

            return (
              <CourseGoalCard
                key={course.id}
                course={course}
                analysis={analysis}
                currentTarget={target}
                onSetGoal={handleSetCourseGoal}
                isSaving={isSaving}
              />
            );
          })}
        </div>
      )}
    </MobileLayout>
  );
}
