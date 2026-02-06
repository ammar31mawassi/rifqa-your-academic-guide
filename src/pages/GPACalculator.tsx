import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calculator, RotateCcw, Home, Save, Loader2 } from "lucide-react";
import { Course, defaultComponents, calculatePercentageGPA } from "@/components/gpa/types";
import { CourseCard } from "@/components/gpa/CourseCard";
import { GPAResult } from "@/components/gpa/GPAResult";
import { useCourses, useSaveCourses } from "@/hooks/useCourses";

const createNewCourse = (): Course => ({
  id: crypto.randomUUID(),
  name: "",
  credits: 3,
  components: defaultComponents.map((c, i) => ({
    ...c,
    id: `${crypto.randomUUID()}`,
  })),
});

export default function GPACalculator() {
  const navigate = useNavigate();
  const { data: savedCourses, isLoading } = useCourses();
  const { mutate: saveCourses, isPending: isSaving } = useSaveCourses();
  
  const [courses, setCourses] = useState<Course[]>([createNewCourse()]);
  const [result, setResult] = useState<{
    averageScore: number;
    overallProgress: number;
    totalCredits: number;
    completedCredits: number;
  } | null>(null);

  // Load saved courses when data is available
  useEffect(() => {
    if (savedCourses && savedCourses.length > 0) {
      setCourses(savedCourses);
      // Auto-calculate on load
      const result = calculatePercentageGPA(savedCourses);
      if (result.totalCredits > 0) {
        setResult(result);
      }
    }
  }, [savedCourses]);

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
    const result = calculatePercentageGPA(courses);
    if (result.totalCredits === 0) {
      setResult(null);
      return;
    }
    setResult(result);
  };

  const handleSave = () => {
    saveCourses(courses);
  };

  const resetCalculator = () => {
    setCourses([createNewCourse()]);
    setResult(null);
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="p-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">حاسبة المعدل</h1>
              <p className="text-sm text-muted-foreground">احسب معدلك بنظام النسبة المئوية</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-10 w-10"
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>

        {/* Result Card */}
        {result && (
          <div className="mb-6">
            <GPAResult
              averageScore={result.averageScore}
              overallProgress={result.overallProgress}
              totalCredits={result.totalCredits}
              completedCredits={result.completedCredits}
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
        
        {/* Save Button */}
        <div className="pb-6">
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 ml-2" />
            )}
            حفظ الدرجات
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
