import { Course, GradeComponent, getGradeLabel, getLetterGrade } from "@/components/gpa/types";

export interface CourseGoalAnalysis {
  courseId: string;
  courseName: string;
  targetScore: number;
  currentEarned: number; // points already earned (weighted)
  completedWeight: number; // total weight of completed components
  remainingWeight: number; // total weight of remaining components
  requiredAverage: number | null; // average needed on remaining components (null = impossible or all done)
  isAchievable: boolean;
  isCompleted: boolean; // all components graded
  projectedScore: number; // projected final score if target met
  componentBreakdown: ComponentAnalysis[];
}

export interface ComponentAnalysis {
  component: GradeComponent;
  isCompleted: boolean;
  earnedPoints: number; // weighted contribution
  requiredScore: number | null; // score needed on this component (null if completed)
}

export interface SemesterGoalAnalysis {
  targetAverage: number;
  currentWeightedAverage: number;
  courses: CourseGoalAnalysis[];
  isAchievable: boolean;
}

/**
 * Analyze a single course against a target score.
 * Calculates what grades are needed on remaining components.
 */
export function analyzeCourseGoal(course: Course, targetScore: number): CourseGoalAnalysis {
  let currentEarned = 0;
  let completedWeight = 0;
  let remainingWeight = 0;
  const componentBreakdown: ComponentAnalysis[] = [];

  course.components.forEach((comp) => {
    const isCompleted = comp.score !== null;
    const earnedPoints = isCompleted
      ? (comp.score! / comp.maxScore) * comp.weight
      : 0;

    if (isCompleted) {
      completedWeight += comp.weight;
    } else {
      remainingWeight += comp.weight;
    }
    currentEarned += earnedPoints;

    componentBreakdown.push({
      component: comp,
      isCompleted,
      earnedPoints,
      requiredScore: null, // will be calculated below
    });
  });

  const isCompleted = remainingWeight === 0;
  let requiredAverage: number | null = null;
  let isAchievable = true;

  if (isCompleted) {
    // All done - just check if target was met
    isAchievable = currentEarned >= targetScore;
    requiredAverage = null;
  } else if (remainingWeight > 0) {
    // Calculate required average on remaining components
    const needed = targetScore - currentEarned;
    requiredAverage = (needed / remainingWeight) * 100;
    isAchievable = requiredAverage <= 100 && requiredAverage >= 0;

    // Set required score for each remaining component (same average needed)
    componentBreakdown.forEach((cb) => {
      if (!cb.isCompleted) {
        cb.requiredScore = Math.max(0, Math.min(100, requiredAverage!));
      }
    });
  }

  return {
    courseId: course.id,
    courseName: course.name,
    targetScore,
    currentEarned,
    completedWeight,
    remainingWeight,
    requiredAverage,
    isAchievable,
    isCompleted,
    projectedScore: isCompleted ? currentEarned : targetScore,
    componentBreakdown,
  };
}

/**
 * Analyze semester goal - what's needed across all courses to hit a target average
 */
export function analyzeSemesterGoal(
  courses: Course[],
  targetAverage: number,
  courseGoals: Record<string, number>
): SemesterGoalAnalysis {
  const analyses = courses.map((course) => {
    const courseTarget = courseGoals[course.id] ?? targetAverage;
    return analyzeCourseGoal(course, courseTarget);
  });

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const currentWeightedAverage =
    totalCredits > 0
      ? courses.reduce((sum, c, i) => sum + analyses[i].currentEarned * c.credits, 0) / totalCredits
      : 0;

  const isAchievable = analyses.every((a) => a.isAchievable);

  return {
    targetAverage,
    currentWeightedAverage,
    courses: analyses,
    isAchievable,
  };
}

export function getRequiredScoreColor(score: number | null): string {
  if (score === null) return "";
  if (score > 100) return "text-destructive";
  if (score > 90) return "text-destructive";
  if (score > 75) return "text-orange-500";
  if (score > 60) return "text-yellow-600";
  return "text-success";
}

export function getRequiredScoreLabel(score: number | null): string {
  if (score === null) return "—";
  if (score > 100) return "غير ممكن";
  return `${score.toFixed(1)}`;
}
