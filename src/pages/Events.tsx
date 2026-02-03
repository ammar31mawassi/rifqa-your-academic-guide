import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Calendar, Users, MapPin, Clock, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Category = "all" | "study" | "social" | "tutoring";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  category: "study" | "social" | "tutoring";
  isJoined?: boolean;
}

const categoryLabels: Record<Category, string> = {
  all: "الكل",
  study: "دراسة",
  social: "اجتماعي",
  tutoring: "تدريس",
};

const events: Event[] = [
  {
    id: "1",
    title: "ليلة دراسة - امتحان الرياضيات",
    description: "مراجعة شاملة لمادة حساب التفاضل والتكامل مع حل أسئلة سنوات سابقة",
    date: "الأربعاء، 5 فبراير",
    time: "18:00 - 22:00",
    location: "مكتبة الجامعة - الطابق 2",
    attendees: 12,
    maxAttendees: 20,
    category: "study",
    isJoined: true,
  },
  {
    id: "2",
    title: "لقاء الطلاب العرب الشهري",
    description: "تعارف وتواصل بين الطلاب العرب في الجامعة مع وجبة عشاء مشتركة",
    date: "الخميس، 6 فبراير",
    time: "19:30 - 22:00",
    location: "قاعة الطلاب الرئيسية",
    attendees: 45,
    maxAttendees: 80,
    category: "social",
  },
  {
    id: "3",
    title: "دروس خصوصية - أساسيات البرمجة",
    description: "جلسة تعليمية للمبتدئين في لغة Python مع تمارين عملية",
    date: "السبت، 8 فبراير",
    time: "10:00 - 12:00",
    location: "مختبر الحاسوب - غرفة 205",
    attendees: 6,
    maxAttendees: 10,
    category: "tutoring",
  },
  {
    id: "4",
    title: "ليلة سينما - فيلم عربي",
    description: "عرض فيلم عربي مع نقاش بعد الفيلم وفشار مجاني",
    date: "الجمعة، 7 فبراير",
    time: "20:00 - 23:00",
    location: "قاعة العروض",
    attendees: 30,
    maxAttendees: 50,
    category: "social",
  },
  {
    id: "5",
    title: "ورشة كتابة أكاديمية",
    description: "تعلم أسس كتابة الأبحاث والمقالات الأكاديمية بالعبرية والإنجليزية",
    date: "الأحد، 9 فبراير",
    time: "14:00 - 16:00",
    location: "مركز الكتابة الأكاديمية",
    attendees: 8,
    maxAttendees: 15,
    category: "tutoring",
  },
];

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesSearch = event.title.includes(searchQuery) || event.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <MobileLayout>
      <header className="p-4 pt-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">الأحداث</h1>
        <p className="text-muted-foreground text-sm">اكتشف الأحداث والنشاطات القادمة</p>
      </header>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن حدث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-card border-border/50"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(Object.keys(categoryLabels) as Category[]).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border/50"
              )}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="px-4 space-y-4 pb-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-2xl bg-card shadow-soft border border-border/50 card-interactive"
          >
            <div className="flex items-start justify-between mb-3">
              <Badge 
                variant="secondary"
                className={cn(
                  "text-xs",
                  event.category === "study" && "bg-success/10 text-success",
                  event.category === "social" && "bg-secondary/50 text-secondary-foreground",
                  event.category === "tutoring" && "bg-primary/10 text-primary"
                )}
              >
                {categoryLabels[event.category]}
              </Badge>
              {event.isJoined && (
                <Badge className="bg-primary text-primary-foreground text-xs">
                  مشترك
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">{event.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {event.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{event.attendees}/{event.maxAttendees} مشارك</span>
              </div>
            </div>

            <Button 
              className={cn(
                "w-full",
                event.isJoined && "bg-muted text-muted-foreground hover:bg-muted"
              )}
              variant={event.isJoined ? "secondary" : "default"}
            >
              {event.isJoined ? "إلغاء الاشتراك" : "انضم الآن"}
            </Button>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
}
