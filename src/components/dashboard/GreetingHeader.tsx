import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GreetingHeaderProps {
  name: string;
  avatarUrl?: string;
  notificationCount?: number;
}

export function GreetingHeader({ name, avatarUrl, notificationCount = 0 }: GreetingHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "صباح الخير";
    if (hour < 17) return "مساء الخير";
    return "مساء النور";
  };

  return (
    <header className="flex items-center justify-between p-4 pt-6">
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12 border-2 border-primary/20">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-muted-foreground">{getGreeting()}</p>
          <h1 className="text-xl font-bold text-foreground">{name}</h1>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full bg-card shadow-soft"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </Button>
    </header>
  );
}
