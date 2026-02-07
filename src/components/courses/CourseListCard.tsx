import { CatalogCourse } from "@/hooks/useCourseCatalog";
import { Button } from "@/components/ui/button";
import { Users, LogIn, LogOut, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseListCardProps {
  course: CatalogCourse;
  onEnroll: (id: string) => void;
  onUnenroll: (id: string) => void;
  onOpenChat: (course: CatalogCourse) => void;
  isLoading?: boolean;
}

export function CourseListCard({
  course,
  onEnroll,
  onUnenroll,
  onOpenChat,
  isLoading,
}: CourseListCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border/50 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{course.name}</h3>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {course.enrollment_count} طالب
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {course.is_enrolled && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-primary"
              onClick={() => onOpenChat(course)}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}

          {course.is_enrolled ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUnenroll(course.id)}
              disabled={isLoading}
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <LogOut className="w-3.5 h-3.5 ml-1" />
              مغادرة
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onEnroll(course.id)}
              disabled={isLoading}
            >
              <LogIn className="w-3.5 h-3.5 ml-1" />
              انضمام
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
