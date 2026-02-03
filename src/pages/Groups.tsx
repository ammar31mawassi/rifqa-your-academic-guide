import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Users, Search, Plus, MessageCircle, Star, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface StudyGroup {
  id: string;
  name: string;
  course: string;
  members: number;
  maxMembers: number;
  nextMeeting?: string;
  isMember: boolean;
  avatar?: string;
  unreadMessages?: number;
}

const groups: StudyGroup[] = [
  {
    id: "1",
    name: "حساب التفاضل والتكامل",
    course: "رياضيات 101",
    members: 8,
    maxMembers: 12,
    nextMeeting: "اليوم، 18:00",
    isMember: true,
    unreadMessages: 3,
  },
  {
    id: "2",
    name: "أساسيات البرمجة",
    course: "علوم حاسوب 101",
    members: 15,
    maxMembers: 20,
    nextMeeting: "غداً، 14:00",
    isMember: true,
  },
  {
    id: "3",
    name: "الفيزياء العامة",
    course: "فيزياء 101",
    members: 6,
    maxMembers: 10,
    nextMeeting: "السبت، 10:00",
    isMember: false,
  },
  {
    id: "4",
    name: "مقدمة في علم النفس",
    course: "علم نفس 101",
    members: 12,
    maxMembers: 15,
    nextMeeting: "الأحد، 16:00",
    isMember: false,
  },
  {
    id: "5",
    name: "الكتابة الأكاديمية",
    course: "مهارات أكاديمية",
    members: 10,
    maxMembers: 12,
    isMember: true,
  },
];

export default function Groups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "my">("all");

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.includes(searchQuery) || group.course.includes(searchQuery);
    const matchesFilter = filter === "all" || (filter === "my" && group.isMember);
    return matchesSearch && matchesFilter;
  });

  const myGroups = groups.filter((g) => g.isMember);

  return (
    <MobileLayout>
      <header className="p-4 pt-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-foreground">مجموعات الدراسة</h1>
          <Button size="icon" className="rounded-full w-10 h-10">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">تعلّم مع زملائك</p>
      </header>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن مجموعة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-card border-border/50"
          />
        </div>
      </div>

      {/* Filter */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border/50"
            )}
          >
            جميع المجموعات
          </button>
          <button
            onClick={() => setFilter("my")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              filter === "my"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border/50"
            )}
          >
            مجموعاتي ({myGroups.length})
          </button>
        </div>
      </div>

      {/* Groups List */}
      <div className="px-4 space-y-3 pb-6">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="p-4 rounded-xl bg-card shadow-soft border border-border/50 card-interactive"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">{group.course}</p>
                  </div>
                  {group.unreadMessages && group.unreadMessages > 0 && (
                    <Badge className="bg-accent text-accent-foreground">
                      {group.unreadMessages}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {group.members}/{group.maxMembers}
                  </span>
                  {group.nextMeeting && (
                    <span className="text-primary font-medium">
                      {group.nextMeeting}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  {group.isMember ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <MessageCircle className="w-4 h-4" />
                        محادثة
                      </Button>
                      <Button variant="default" size="sm" className="flex-1">
                        فتح المجموعة
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full" size="sm">
                      انضم للمجموعة
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
}
