import { Users, MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StudySession } from "@/hooks/useStudySessions";
import { allCategoryLabels } from "./sessionTypes";

interface SessionCardProps {
  session: StudySession;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
  isJoining: boolean;
  isLeaving: boolean;
}

export function SessionCard({ session, onJoin, onLeave, isJoining, isLeaving }: SessionCardProps) {
  const isFull = session.max_participants
    ? session.participant_count >= session.max_participants
    : false;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("ar-EG", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  return (
    <div className="p-4 rounded-xl bg-card shadow-soft border border-border/50 card-interactive">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground">{session.title}</h3>
              {session.course_name && (
                <p className="text-sm text-muted-foreground">{session.course_name}</p>
              )}
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs shrink-0",
                (session.category === "study" || session.category === "review") && "bg-success/10 text-success",
                session.category === "tutoring" && "bg-primary/10 text-primary",
                session.category === "game_night" && "bg-secondary/50 text-secondary-foreground",
                session.category === "sports" && "bg-success/10 text-success",
                session.category === "hangout" && "bg-primary/10 text-primary",
                session.category === "outdoor" && "bg-lecture/10 text-lecture"
              )}
            >
              {allCategoryLabels[session.category] || session.category}
            </Badge>
          </div>

          {session.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {session.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(session.session_date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(session.start_time)}
              {session.end_time && ` - ${formatTime(session.end_time)}`}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            {session.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {session.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {session.participant_count}
              {session.max_participants && `/${session.max_participants}`} مشارك
            </span>
          </div>

          <div className="mt-3">
            {session.is_joined ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onLeave(session.id)}
                disabled={isLeaving}
              >
                {isLeaving ? "جاري الإلغاء..." : "إلغاء الاشتراك"}
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={() => onJoin(session.id)}
                disabled={isFull || isJoining}
              >
                {isJoining ? "جاري الانضمام..." : isFull ? "الجلسة ممتلئة" : "انضم الآن"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
