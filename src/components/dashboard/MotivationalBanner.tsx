import { Sparkles, X } from "lucide-react";
import { useState } from "react";

const messages = [
  "أنت قادر على تحقيق أهدافك. خطوة بخطوة! ✨",
  "كل يوم هو فرصة جديدة للتعلم والنمو 🌱",
  "النجاح ليس نهاية الطريق، بل بداية رحلة جديدة 🚀",
  "ثق بنفسك، أنت أقوى مما تعتقد 💪",
  "الاستمرارية هي مفتاح النجاح 🔑",
];

export function MotivationalBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  if (!isVisible) return null;

  return (
    <div className="mx-4 mt-4 p-4 rounded-xl bg-gradient-to-l from-secondary/30 to-accent/20 border border-secondary/30 relative overflow-hidden">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 left-2 p-1 rounded-full hover:bg-foreground/10 transition-colors"
        aria-label="إغلاق"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
      
      <div className="flex items-start gap-3 pl-6">
        <div className="w-8 h-8 rounded-lg bg-secondary/30 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-secondary-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground leading-relaxed">
          {randomMessage}
        </p>
      </div>
    </div>
  );
}
