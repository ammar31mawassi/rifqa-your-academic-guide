import { Users, BookOpen, Award, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const actions = [
  { 
    icon: Users, 
    label: "مجموعات", 
    path: "/groups",
    color: "bg-primary/10 text-primary"
  },
  { 
    icon: BookOpen, 
    label: "موجّهين", 
    path: "/tutors",
    color: "bg-secondary/30 text-secondary-foreground"
  },
  { 
    icon: Award, 
    label: "بطاقات", 
    path: "/flashcards",
    color: "bg-success/10 text-success"
  },
  { 
    icon: Calculator, 
    label: "المعدل", 
    path: "/gpa",
    color: "bg-accent/20 text-accent-foreground"
  },
];

export function QuickActions() {
  return (
    <section className="px-4 mt-6">
      <h2 className="text-lg font-bold text-foreground mb-4">أدوات سريعة</h2>
      
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card shadow-soft card-interactive"
          >
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", action.color)}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
