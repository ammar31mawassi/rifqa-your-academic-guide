import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="mobile-container">
      <main className="pb-24 min-h-screen">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
