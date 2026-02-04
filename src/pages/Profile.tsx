import { MobileLayout } from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { 
  Settings, 
  BookOpen, 
  Award, 
  Calendar, 
  Users, 
  HelpCircle,
  ChevronLeft,
  TrendingUp,
  Target,
  Star,
  LogOut,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const stats = [
  { label: "أيام الدراسة", value: "23", icon: Calendar },
  { label: "المجموعات", value: "4", icon: Users },
  { label: "الإنجازات", value: "7", icon: Award },
];

const menuItems = [
  { icon: BookOpen, label: "المقررات الدراسية", path: "/courses" },
  { icon: Target, label: "أهدافي", path: "/goals" },
  { icon: TrendingUp, label: "الإحصائيات", path: "/stats" },
  { icon: Award, label: "الإنجازات", path: "/achievements" },
  { icon: Star, label: "الخصومات والعروض", path: "/benefits" },
  { icon: HelpCircle, label: "المساعدة والدعم", path: "/help" },
  { icon: Settings, label: "الإعدادات", path: "/settings" },
];

export default function Profile() {
  const { signOut, user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
    });
    navigate("/auth");
  };

  const displayName = profile?.full_name || "طالب";
  const faculty = profile?.faculty || "علوم الحاسوب";
  const university = profile?.university || "جامعة تل أبيب";
  const academicYear = profile?.academic_year || 2;
  const gpa = profile?.gpa || 3.45;

  return (
    <MobileLayout>
      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 gradient-primary" />
        <div className="px-4 -mt-16 relative z-10">
          <div className="bg-card rounded-2xl shadow-medium p-5 border border-border/50">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 border-4 border-card -mt-12 shadow-medium">
                <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pt-1">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : (
                  <>
                    <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
                    <p className="text-sm text-muted-foreground">{faculty} - السنة {academicYear === 1 ? "الأولى" : academicYear === 2 ? "الثانية" : academicYear === 3 ? "الثالثة" : "الرابعة"}</p>
                    <p className="text-xs text-primary mt-1">{university}</p>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Semester Progress */}
      <div className="px-4 mt-6">
        <div className="bg-card rounded-xl p-4 shadow-soft border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">تقدم الفصل الدراسي</h3>
            <span className="text-sm text-primary font-medium">42%</span>
          </div>
          <Progress value={42} className="h-2" />
          <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
            <span>3 مقررات مكتملة</span>
            <span>4 مقررات متبقية</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 mt-6">
        <div className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 p-4 transition-colors hover:bg-muted/50",
                index !== menuItems.length - 1 && "border-b border-border/50"
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="flex-1 font-medium text-foreground">{item.label}</span>
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="px-4 mt-6 pb-6">
        <Button 
          variant="outline" 
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 ml-2" />
          تسجيل الخروج
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          {user?.email}
        </p>
      </div>
    </MobileLayout>
  );
}
