import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calculator, RotateCcw, Save } from "lucide-react";
import { Course, GradeComponent, defaultComponents, scoreToGPA } from "@/components/gpa/types";
import { CourseCard } from "@/components/gpa/CourseCard";
import { GPAResult } from "@/components/gpa/GPAResult";

const createNewCourse = (): Course => ({
  id: Date.now().toString(),
  name: "",
  credits: 3,
  components: defaultComponents.map((c, i) => ({
    ...c,
    id: `${Date.now()}-${i}`,
  })),
});

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([createNewCourse()]);
  const [result, setResult] = useState<{
    gpa: number;
    averageScore: number;
    overallProgress: number;
    totalCredits: number;
  } | null>(null);

  const addCourse = () => {
    setCourses([...courses, createNewCourse()]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses(courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
  };

  const calculateGPA = () => {
    let totalWeightedScore = 0;
    let totalCredits = 0;
    let totalProgress = 0;
    let validCourseCount = 0;

    courses.forEach((course) => {
      const completedComponents = course.components.filter((c) => c.score !== null);
      if (completedComponents.length === 0) return;

      const completedWeight = completedComponents.reduce((sum, c) => sum + c.weight, 0);
      const weightedScore = completedComponents.reduce((sum, c) => {
        const normalizedScore = (c.score! / c.maxScore) * 100;
        return sum + (normalizedScore * c.weight) / 100;
      }, 0);

      // Project final grade based on completed work
      const courseScore = completedWeight > 0 ? (weightedScore / completedWeight) * 100 : 0;
      
      totalWeightedScore += courseScore * course.credits;
      totalCredits += course.credits;
      totalProgress += completedWeight;
      validCourseCount++;
    });

    if (validCourseCount === 0) {
      setResult(null);
      return;
    }

    const averageScore = totalWeightedScore / totalCredits;
    const overallProgress = totalProgress / validCourseCount;
    const gpa = scoreToGPA(averageScore);

    setResult({
      gpa,
      averageScore,
      overallProgress,
      totalCredits,
    });
  };

  const resetCalculator = () => {
    setCourses([createNewCourse()]);
    setResult(null);
  };

  return (
    <MobileLayout>
      <div className="p-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">حاسبة المعدل</h1>
            <p className="text-sm text-muted-foreground">احسب معدلك بنظام النسبة المئوية</p>
          </div>
        </div>

        {/* Result Card */}
        {result && (
          <div className="mb-6">
            <GPAResult
              gpa={result.gpa}
              averageScore={result.averageScore}
              overallProgress={result.overallProgress}
              totalCredits={result.totalCredits}
            />
          </div>
        )}

        {/* Courses */}
        <Card className="border-0 shadow-soft mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>المقررات الدراسية</span>
              <span className="text-sm font-normal text-muted-foreground">
                {courses.length} مقرر
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                onUpdate={updateCourse}
                onRemove={() => removeCourse(course.id)}
                canRemove={courses.length > 1}
              />
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={addCourse}
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة مقرر
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <Button variant="outline" className="flex-1" onClick={resetCalculator}>
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
          <Button className="flex-1" onClick={calculateGPA}>
            <Calculator className="w-4 h-4 ml-2" />
            احسب المعدل
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
