import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Calculator, GraduationCap, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const gradePoints: Record<string, number> = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "D-": 0.7,
  "F": 0.0,
};

const gradeLabels: Record<string, string> = {
  "A+": "ممتاز+",
  "A": "ممتاز",
  "A-": "ممتاز-",
  "B+": "جيد جداً+",
  "B": "جيد جداً",
  "B-": "جيد جداً-",
  "C+": "جيد+",
  "C": "جيد",
  "C-": "جيد-",
  "D+": "مقبول+",
  "D": "مقبول",
  "D-": "مقبول-",
  "F": "راسب",
};

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "", credits: 3, grade: "" },
  ]);
  const [calculatedGPA, setCalculatedGPA] = useState<number | null>(null);

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Date.now().toString(), name: "", credits: 3, grade: "" },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const calculateGPA = () => {
    const validCourses = courses.filter((course) => course.grade && course.credits > 0);
    
    if (validCourses.length === 0) {
      setCalculatedGPA(null);
      return;
    }

    let totalPoints = 0;
    let totalCredits = 0;

    validCourses.forEach((course) => {
      const points = gradePoints[course.grade] || 0;
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setCalculatedGPA(Math.round(gpa * 100) / 100);
  };

  const resetCalculator = () => {
    setCourses([{ id: "1", name: "", credits: 3, grade: "" }]);
    setCalculatedGPA(null);
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-600";
    if (gpa >= 3.0) return "text-primary";
    if (gpa >= 2.0) return "text-amber-600";
    return "text-destructive";
  };

  const getGPALabel = (gpa: number) => {
    if (gpa >= 3.7) return "ممتاز";
    if (gpa >= 3.3) return "جيد جداً";
    if (gpa >= 2.7) return "جيد";
    if (gpa >= 2.0) return "مقبول";
    return "ضعيف";
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
            <p className="text-sm text-muted-foreground">احسب معدلك التراكمي GPA</p>
          </div>
        </div>

        {/* Result Card */}
        {calculatedGPA !== null && (
          <Card className="mb-6 border-0 shadow-medium bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-6 text-center">
              <div className="w-24 h-24 rounded-full bg-card shadow-soft flex items-center justify-center mx-auto mb-4">
                <GraduationCap className={cn("w-10 h-10", getGPAColor(calculatedGPA))} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">معدلك التراكمي</p>
              <p className={cn("text-4xl font-bold", getGPAColor(calculatedGPA))}>
                {calculatedGPA.toFixed(2)}
              </p>
              <p className={cn("text-lg font-medium mt-1", getGPAColor(calculatedGPA))}>
                {getGPALabel(calculatedGPA)}
              </p>
            </CardContent>
          </Card>
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
              <div
                key={course.id}
                className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    المقرر {index + 1}
                  </span>
                  {courses.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeCourse(course.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">اسم المقرر (اختياري)</Label>
                  <Input
                    placeholder="مثال: الرياضيات"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">الساعات المعتمدة</Label>
                    <Select
                      value={course.credits.toString()}
                      onValueChange={(value) => updateCourse(course.id, "credits", parseInt(value))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((credit) => (
                          <SelectItem key={credit} value={credit.toString()}>
                            {credit} ساعات
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">الدرجة</Label>
                    <Select
                      value={course.grade}
                      onValueChange={(value) => updateCourse(course.id, "grade", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(gradeLabels).map(([grade, label]) => (
                          <SelectItem key={grade} value={grade}>
                            {grade} - {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
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
          <Button
            variant="outline"
            className="flex-1"
            onClick={resetCalculator}
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
          <Button
            className="flex-1"
            onClick={calculateGPA}
          >
            <Calculator className="w-4 h-4 ml-2" />
            احسب المعدل
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
