import { MobileLayout } from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  return (
    <MobileLayout>
      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 gradient-primary" />
        <div className="px-4 -mt-16 relative z-10">
          <div className="bg-card rounded-2xl shadow-medium p-5 border border-border/50">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 border-4 border-card -mt-12 shadow-medium">
                <AvatarImage src="" alt="أحمد" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  أ
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pt-1">
                <h1 className="text-xl font-bold text-foreground">أحمد محمود</h1>
                <p className="text-sm text-muted-foreground">علوم الحاسوب - السنة الثانية</p>
                <p className="text-xs text-primary mt-1">جامعة تل أبيب</p>
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
      <div className="px-4 mt-6 pb-6">
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
    </MobileLayout>
  );
}
