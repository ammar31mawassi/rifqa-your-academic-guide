import { Clock, MapPin, BookOpen, Briefcase, Coffee, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityType = "lecture" | "study" | "work" | "leisure" | "exam";

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  location?: string;
  type: ActivityType;
}

const activityStyles: Record<ActivityType, { bg: string; icon: React.ReactNode }> = {
  lecture: { 
    bg: "bg-lecture/10 border-lecture/30", 
    icon: <BookOpen className="w-4 h-4 text-lecture" /> 
  },
  study: { 
    bg: "bg-success/10 border-success/30", 
    icon: <FileText className="w-4 h-4 text-success" /> 
  },
  work: { 
    bg: "bg-work/10 border-work/30", 
    icon: <Briefcase className="w-4 h-4 text-work" /> 
  },
  leisure: { 
    bg: "bg-secondary/30 border-secondary", 
    icon: <Coffee className="w-4 h-4 text-secondary-foreground" /> 
  },
  exam: { 
    bg: "bg-destructive/10 border-destructive/30", 
    icon: <FileText className="w-4 h-4 text-destructive" /> 
  },
};

const sampleSchedule: ScheduleItem[] = [
  { id: "1", title: "مقدمة في علم الحاسوب", time: "09:00 - 10:30", location: "قاعة 302", type: "lecture" },
  { id: "2", title: "وقت دراسة - الرياضيات", time: "11:00 - 12:30", location: "المكتبة", type: "study" },
  { id: "3", title: "دوام العمل", time: "14:00 - 18:00", location: "مقهى الحرم", type: "work" },
  { id: "4", title: "مجموعة دراسة - البرمجة", time: "19:00 - 20:30", location: "غرفة 101", type: "study" },
];

export function TodaySchedule() {
  const today = new Date().toLocaleDateString("ar-EG", { 
    weekday: "long", 
    day: "numeric", 
    month: "long" 
  });

  return (
    <section className="px-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">جدول اليوم</h2>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <button className="text-sm text-primary font-medium">عرض الأسبوع</button>
      </div>

      <div className="space-y-3 stagger-children">
        {sampleSchedule.map((item) => {
          const style = activityStyles[item.type];
          return (
            <div
              key={item.id}
              className={cn(
                "p-4 rounded-xl border-2 card-interactive",
                style.bg
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{style.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.time}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
