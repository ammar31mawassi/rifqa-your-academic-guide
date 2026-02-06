import { MobileLayout } from "@/components/layout/MobileLayout";
import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { MotivationalBanner } from "@/components/dashboard/MotivationalBanner";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { useProfile } from "@/hooks/useProfile";
import { useCourses } from "@/hooks/useCourses";
import { calculatePercentageGPA } from "@/components/gpa/types";

const Index = () => {
  const { data: profile } = useProfile();
  const { data: courses } = useCourses();

  const displayName = profile?.full_name || "طالب";

  const stats = courses && courses.length > 0
    ? calculatePercentageGPA(courses)
    : null;

  return (
    <MobileLayout>
      <GreetingHeader 
        name={displayName} 
        avatarUrl={profile?.avatar_url || undefined}
        notificationCount={3}
      />
      
      <MotivationalBanner />
      
      <div className="mt-4">
        <ProgressCard 
          semesterProgress={stats ? Math.round(stats.overallProgress) : 0}
          coursesCompleted={stats ? Math.round(stats.completedCredits * 10) / 10 : 0}
          totalCourses={stats ? stats.totalCredits : 0}
          gpa={stats ? stats.averageScore : undefined}
        />
      </div>
      
      <QuickActions />
      
      <TodaySchedule />
      
      <UpcomingEvents />
    </MobileLayout>
  );
};

export default Index;
