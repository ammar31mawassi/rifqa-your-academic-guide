import { MobileLayout } from "@/components/layout/MobileLayout";
import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { MotivationalBanner } from "@/components/dashboard/MotivationalBanner";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";

const Index = () => {
  return (
    <MobileLayout>
      <GreetingHeader 
        name="أحمد" 
        notificationCount={3}
      />
      
      <MotivationalBanner />
      
      <div className="mt-4">
        <ProgressCard 
          semesterProgress={42}
          coursesCompleted={3}
          totalCourses={7}
          gpa={3.45}
        />
      </div>
      
      <QuickActions />
      
      <TodaySchedule />
      
      <UpcomingEvents />
    </MobileLayout>
  );
};

export default Index;
