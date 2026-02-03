import { MobileLayout } from "@/components/layout/MobileLayout";
import { 
  Calendar, 
  BookOpen, 
  Briefcase, 
  Coffee, 
  FileText, 
  Users,
  Clock,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const addOptions = [
  {
    icon: Calendar,
    title: "موعد في التقويم",
    description: "أضف محاضرة، موعد شخصي أو تذكير",
    path: "/add/event",
    color: "bg-lecture/10 text-lecture",
  },
  {
    icon: BookOpen,
    title: "وقت دراسة",
    description: "خصص وقتاً للدراسة والمراجعة",
    path: "/add/study",
    color: "bg-success/10 text-success",
  },
  {
    icon: Briefcase,
    title: "دوام عمل",
    description: "سجل ساعات العمل الجزئي",
    path: "/add/work",
    color: "bg-work/10 text-work",
  },
  {
    icon: FileText,
    title: "واجب أو امتحان",
    description: "أضف موعد تسليم أو امتحان قادم",
    path: "/add/assignment",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Users,
    title: "مجموعة دراسة",
    description: "أنشئ مجموعة دراسة جديدة",
    path: "/add/group",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Coffee,
    title: "نشاط شخصي",
    description: "وقت للراحة أو الهوايات",
    path: "/add/leisure",
    color: "bg-secondary/30 text-secondary-foreground",
  },
];

export default function Add() {
  return (
    <MobileLayout>
      <header className="p-4 pt-6 text-center">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-medium">
          <Plus className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">إضافة جديد</h1>
        <p className="text-muted-foreground text-sm">ماذا تريد أن تضيف اليوم؟</p>
      </header>

      <div className="px-4 space-y-3 pb-6 mt-4">
        {addOptions.map((option) => (
          <Link
            key={option.path}
            to={option.path}
            className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-soft border border-border/50 card-interactive"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", option.color)}>
              <option.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-0.5">{option.title}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </MobileLayout>
  );
}
