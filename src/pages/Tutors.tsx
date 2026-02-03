import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Search, Star, MessageCircle, BookOpen, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  subjects: string[];
  rating: number;
  reviews: number;
  hourlyRate?: string;
  bio: string;
  isVerified: boolean;
  availability: "available" | "busy" | "offline";
}

const tutors: Tutor[] = [
  {
    id: "1",
    name: "سارة أبو حسين",
    subjects: ["رياضيات", "إحصاء"],
    rating: 4.9,
    reviews: 47,
    bio: "طالبة ماجستير في الرياضيات التطبيقية. أحب تبسيط المفاهيم المعقدة.",
    isVerified: true,
    availability: "available",
  },
  {
    id: "2",
    name: "محمد خليل",
    subjects: ["برمجة", "هياكل بيانات"],
    rating: 4.8,
    reviews: 32,
    bio: "مهندس برمجيات سابق. خبرة 3 سنوات في تدريس البرمجة للمبتدئين.",
    isVerified: true,
    availability: "busy",
  },
  {
    id: "3",
    name: "لينا حداد",
    subjects: ["فيزياء", "كيمياء"],
    rating: 4.7,
    reviews: 28,
    bio: "طالبة دكتوراه في الفيزياء. متخصصة في شرح المفاهيم الأساسية.",
    isVerified: true,
    availability: "available",
  },
  {
    id: "4",
    name: "عمر ناصر",
    subjects: ["كتابة أكاديمية", "عبرية"],
    rating: 4.6,
    reviews: 19,
    bio: "خريج لغات. أساعد في كتابة الأبحاث والتحسين اللغوي.",
    isVerified: false,
    availability: "offline",
  },
  {
    id: "5",
    name: "نور الدين",
    subjects: ["اقتصاد", "محاسبة"],
    rating: 4.9,
    reviews: 41,
    bio: "محاسب معتمد. أقدم دروساً عملية مع أمثلة من الواقع.",
    isVerified: true,
    availability: "available",
  },
];

const availabilityLabels = {
  available: { label: "متاح", color: "bg-success text-success-foreground" },
  busy: { label: "مشغول", color: "bg-secondary text-secondary-foreground" },
  offline: { label: "غير متصل", color: "bg-muted text-muted-foreground" },
};

export default function Tutors() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTutors = tutors.filter(
    (tutor) =>
      tutor.name.includes(searchQuery) ||
      tutor.subjects.some((s) => s.includes(searchQuery))
  );

  return (
    <MobileLayout>
      <header className="p-4 pt-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">الموجّهون</h1>
        <p className="text-muted-foreground text-sm">تواصل مع طلاب متفوقين للمساعدة</p>
      </header>

      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن موجّه أو مادة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-card border-border/50"
          />
        </div>
      </div>

      {/* Tutors List */}
      <div className="px-4 space-y-4 pb-6">
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.id}
            className="p-4 rounded-2xl bg-card shadow-soft border border-border/50 card-interactive"
          >
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="w-14 h-14">
                <AvatarImage src={tutor.avatar} alt={tutor.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {tutor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground">{tutor.name}</h3>
                  {tutor.isVerified && (
                    <Award className="w-4 h-4 text-primary" />
                  )}
                </div>
                <Badge
                  className={cn("text-xs", availabilityLabels[tutor.availability].color)}
                >
                  {availabilityLabels[tutor.availability].label}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <span className="font-semibold text-foreground">{tutor.rating}</span>
                <span className="text-muted-foreground">({tutor.reviews})</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {tutor.bio}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {tutor.subjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="text-xs">
                  <BookOpen className="w-3 h-3 ml-1" />
                  {subject}
                </Badge>
              ))}
            </div>

            <Button
              className="w-full gap-2"
              disabled={tutor.availability === "offline"}
            >
              <MessageCircle className="w-4 h-4" />
              تواصل مع {tutor.name.split(" ")[0]}
            </Button>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
}
