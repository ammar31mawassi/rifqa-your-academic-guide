import { Home, Calendar, Plus, Bell, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: User, label: "الملف", path: "/profile" },
  { icon: Bell, label: "إشعارات", path: "/notifications" },
  { icon: Plus, label: "إضافة", path: "/add", isMain: true },
  { icon: Calendar, label: "أحداث", path: "/events" },
  { icon: Home, label: "الرئيسية", path: "/" },
];

export function BottomNavigation() {
  return (
    <nav className="bottom-nav safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200",
                item.isMain && "relative -mt-6"
              )
            }
          >
            {({ isActive }) => (
              <>
                {item.isMain ? (
                  <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-medium">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                ) : (
                  <>
                    <div
                      className={cn(
                        "p-2 rounded-xl transition-colors",
                        isActive ? "bg-primary/10" : "bg-transparent"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
