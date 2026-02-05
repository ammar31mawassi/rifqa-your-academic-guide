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
  credits: number;
  components: GradeComponent[];
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
