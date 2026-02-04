import { MobileLayout } from "@/components/layout/MobileLayout";
import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { MotivationalBanner } from "@/components/dashboard/MotivationalBanner";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  const { data: profile, isLoading } = useProfile();

  const displayName = profile?.full_name || "طالب";
  const gpa = profile?.gpa ? Number(profile.gpa) : 3.45;

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
          semesterProgress={42}
          coursesCompleted={3}
          totalCourses={7}
          gpa={gpa}
        />
      </div>
      
      <QuickActions />
      
      <TodaySchedule />
      
      <UpcomingEvents />
    </MobileLayout>
  );
};

export default Index;
