import { MobileLayout } from "@/components/layout/MobileLayout";
import { Bell, Calendar, Users, BookOpen, Award, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationType = "reminder" | "event" | "group" | "achievement" | "tip";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  reminder: <Calendar className="w-5 h-5" />,
  event: <Users className="w-5 h-5" />,
  group: <BookOpen className="w-5 h-5" />,
  achievement: <Award className="w-5 h-5" />,
  tip: <Bell className="w-5 h-5" />,
};

const notificationStyles: Record<NotificationType, string> = {
  reminder: "bg-destructive/10 text-destructive",
  event: "bg-secondary/30 text-secondary-foreground",
  group: "bg-primary/10 text-primary",
  achievement: "bg-success/10 text-success",
  tip: "bg-accent/20 text-accent-foreground",
};

const notifications: Notification[] = [
  {
    id: "1",
    type: "reminder",
    title: "تذكير: امتحان الرياضيات",
    message: "امتحانك في مادة حساب التفاضل والتكامل بعد يومين. لا تنسى المراجعة!",
    time: "منذ ساعة",
    isRead: false,
  },
  {
    id: "2",
    type: "event",
    title: "حدث جديد قريب منك",
    message: "ليلة سينما - فيلم عربي يوم الجمعة. 30 طالب مشترك حتى الآن!",
    time: "منذ 3 ساعات",
    isRead: false,
  },
  {
    id: "3",
    type: "group",
    title: "رسالة جديدة في مجموعتك",
    message: "سارة كتبت في مجموعة 'البرمجة للمبتدئين': 'هل أحد يقدر يشرحلي...'",
    time: "منذ 5 ساعات",
    isRead: true,
  },
  {
    id: "4",
    type: "achievement",
    title: "🎉 إنجاز جديد!",
    message: "أكملت 5 أيام متتالية من الدراسة! استمر على هذا النحو الممتاز.",
    time: "أمس",
    isRead: true,
  },
  {
    id: "5",
    type: "tip",
    title: "نصيحة اليوم",
    message: "الدراسة في فترات قصيرة (25 دقيقة) مع استراحات قصيرة تزيد من التركيز والإنتاجية.",
    time: "أمس",
    isRead: true,
  },
  {
    id: "6",
    type: "reminder",
    title: "موعد تسليم الواجب",
    message: "واجب مادة مقدمة في علم الحاسوب - التسليم خلال 3 أيام.",
    time: "منذ يومين",
    isRead: true,
  },
];

export default function Notifications() {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <MobileLayout>
      <header className="p-4 pt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">الإشعارات</h1>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0 ? `${unreadCount} إشعارات جديدة` : "لا توجد إشعارات جديدة"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="text-sm text-primary font-medium">
            تحديد الكل كمقروء
          </button>
        )}
      </header>

      <div className="px-4 space-y-3 pb-6">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "p-4 rounded-xl border transition-all",
              notification.isRead
                ? "bg-card border-border/50"
                : "bg-primary/5 border-primary/20"
            )}
          >
            <div className="flex gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  notificationStyles[notification.type]
                )}
              >
                {notificationIcons[notification.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={cn(
                    "font-semibold text-foreground",
                    !notification.isRead && "text-primary"
                  )}>
                    {notification.title}
                  </h3>
                  {!notification.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {notification.message}
                </p>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
}
