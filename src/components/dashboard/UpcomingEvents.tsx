import { Calendar, Users, MapPin, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: "study" | "social" | "tutoring";
}

const categoryLabels = {
  study: "دراسة",
  social: "اجتماعي",
  tutoring: "تدريس",
};

const sampleEvents: Event[] = [
  {
    id: "1",
    title: "ليلة دراسة - امتحان الرياضيات",
    date: "الأربعاء، 5 فبراير",
    time: "18:00",
    location: "مكتبة الجامعة",
    attendees: 12,
    category: "study",
  },
  {
    id: "2",
    title: "لقاء الطلاب العرب",
    date: "الخميس، 6 فبراير",
    time: "19:30",
    location: "قاعة الطلاب",
    attendees: 45,
    category: "social",
  },
  {
    id: "3",
    title: "دروس خصوصية - البرمجة",
    date: "السبت، 8 فبراير",
    time: "10:00",
    location: "غرفة 205",
    attendees: 6,
    category: "tutoring",
  },
];

export function UpcomingEvents() {
  return (
    <section className="px-4 mt-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">أحداث قادمة</h2>
        <Link to="/events" className="text-sm text-primary font-medium flex items-center gap-1">
          عرض الكل
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {sampleEvents.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="block p-4 rounded-xl bg-card shadow-soft border border-border/50 card-interactive"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{event.title}</h3>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {categoryLabels[event.category]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {event.date} • {event.time}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {event.attendees} مشارك
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
