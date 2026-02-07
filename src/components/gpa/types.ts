export interface GradeComponent {
  id: string;
  name: string;
  weight: number; // percentage (0-100)
  score: number | null; // student's score (0-100), null if not completed
  maxScore: number; // maximum possible score (default 100)
}

export interface Course {
  id: string;
  name: string;
  credits: number; // Can be decimal (e.g., 4.5, 0.5)
  components: GradeComponent[];
  catalogCourseId?: string | null;
}

// Calculate percentage-based GPA (0-100 scale)
export function calculatePercentageGPA(courses: Course[]): {
  averageScore: number;
  completedCredits: number;
  totalCredits: number;
  overallProgress: number;
} {
  let totalWeightedScore = 0;
  let completedCredits = 0;
  let totalCredits = 0;
  let totalProgress = 0;
  let validCourseCount = 0;

  courses.forEach((course) => {
    totalCredits += course.credits;
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
    completedCredits += course.credits * (completedWeight / 100);
    totalProgress += completedWeight;
    validCourseCount++;
  });

  return {
    averageScore: validCourseCount > 0 ? totalWeightedScore / totalCredits : 0,
    completedCredits,
    totalCredits,
    overallProgress: validCourseCount > 0 ? totalProgress / validCourseCount : 0,
  };
}

export const defaultComponents: Omit<GradeComponent, 'id'>[] = [
  { name: "واجبات", weight: 10, score: null, maxScore: 100 },
  { name: "اختبار نصفي", weight: 30, score: null, maxScore: 100 },
  { name: "اختبار نهائي", weight: 60, score: null, maxScore: 100 },
];

export const componentPresets: { name: string; components: Omit<GradeComponent, 'id'>[] }[] = [
  {
    name: "نظام تقليدي (10-30-60)",
    components: [
      { name: "واجبات", weight: 10, score: null, maxScore: 100 },
      { name: "اختبار نصفي", weight: 30, score: null, maxScore: 100 },
      { name: "اختبار نهائي", weight: 60, score: null, maxScore: 100 },
    ],
  },
  {
    name: "نظام متوازن (20-30-50)",
    components: [
      { name: "أعمال السنة", weight: 20, score: null, maxScore: 100 },
      { name: "اختبار نصفي", weight: 30, score: null, maxScore: 100 },
      { name: "اختبار نهائي", weight: 50, score: null, maxScore: 100 },
    ],
  },
  {
    name: "نظام عملي (30-20-50)",
    components: [
      { name: "مشاريع عملية", weight: 30, score: null, maxScore: 100 },
      { name: "اختبار نصفي", weight: 20, score: null, maxScore: 100 },
      { name: "اختبار نهائي", weight: 50, score: null, maxScore: 100 },
    ],
  },
  {
    name: "نظام مستمر",
    components: [
      { name: "واجبات", weight: 15, score: null, maxScore: 100 },
      { name: "حضور ومشاركة", weight: 10, score: null, maxScore: 100 },
      { name: "اختبار أول", weight: 15, score: null, maxScore: 100 },
      { name: "اختبار نصفي", weight: 20, score: null, maxScore: 100 },
      { name: "اختبار نهائي", weight: 40, score: null, maxScore: 100 },
    ],
  },
];

// Convert 0-100 score to GPA (4.0 scale)
export function scoreToGPA(score: number): number {
  if (score >= 95) return 4.0;
  if (score >= 90) return 3.75;
  if (score >= 85) return 3.5;
  if (score >= 80) return 3.0;
  if (score >= 75) return 2.5;
  if (score >= 70) return 2.0;
  if (score >= 65) return 1.5;
  if (score >= 60) return 1.0;
  return 0.0;
}

export function getGradeLabel(score: number): string {
  if (score >= 90) return "ممتاز";
  if (score >= 80) return "جيد جداً";
  if (score >= 70) return "جيد";
  if (score >= 60) return "مقبول";
  return "راسب";
}

export function getLetterGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "B+";
  if (score >= 80) return "B";
  if (score >= 75) return "C+";
  if (score >= 70) return "C";
  if (score >= 65) return "D+";
  if (score >= 60) return "D";
  return "F";
}
