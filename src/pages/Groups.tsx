import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStudySessions, useJoinSession, useLeaveSession } from "@/hooks/useStudySessions";
import { CreateSessionDialog } from "@/components/sessions/CreateSessionDialog";
import { SessionCard } from "@/components/sessions/SessionCard";
import { useAuth } from "@/contexts/AuthContext";

type Filter = "all" | "my" | "joined";

const filterLabels: Record<Filter, string> = {
  all: "جميع الجلسات",
  my: "جلساتي",
  joined: "مشترك فيها",
};

export default function Groups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { user } = useAuth();

  const { data: sessions, isLoading } = useStudySessions();
  const { mutate: joinSession, isPending: isJoining, variables: joiningId } = useJoinSession();
  const { mutate: leaveSession, isPending: isLeaving, variables: leavingId } = useLeaveSession();

  const filteredSessions = (sessions || []).filter((session) => {
    const matchesSearch =
      session.title.includes(searchQuery) ||
      (session.course_name || "").includes(searchQuery) ||
      (session.description || "").includes(searchQuery);

    if (filter === "my") return matchesSearch && session.creator_id === user?.id;
    if (filter === "joined") return matchesSearch && session.is_joined;
    return matchesSearch;
  });

  const myCount = (sessions || []).filter((s) => s.creator_id === user?.id).length;
  const joinedCount = (sessions || []).filter((s) => s.is_joined).length;

  return (
    <MobileLayout>
      <header className="p-4 pt-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-foreground">جلسات الدراسة</h1>
          <CreateSessionDialog />
        </div>
        <p className="text-muted-foreground text-sm">تعلّم مع زملائك</p>
      </header>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن جلسة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-card border-border/50"
          />
        </div>
      </div>

      {/* Filter */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(Object.keys(filterLabels) as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border/50"
              )}
            >
              {filterLabels[f]}
              {f === "my" && myCount > 0 && ` (${myCount})`}
              {f === "joined" && joinedCount > 0 && ` (${joinedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div className="px-4 space-y-3 pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لا توجد جلسات حالياً</p>
            <p className="text-sm text-muted-foreground mt-1">أنشئ جلسة جديدة باستخدام زر +</p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onJoin={joinSession}
              onLeave={leaveSession}
              isJoining={isJoining && joiningId === session.id}
              isLeaving={isLeaving && leavingId === session.id}
            />
          ))
        )}
      </div>
    </MobileLayout>
  );
}
