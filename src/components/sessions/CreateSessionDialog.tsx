import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { useCreateSession } from "@/hooks/useStudySessions";

const categoryOptions = [
  { value: "study", label: "دراسة" },
  { value: "social", label: "اجتماعي" },
  { value: "tutoring", label: "تدريس" },
];

export function CreateSessionDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: createSession, isPending } = useCreateSession();

  const [form, setForm] = useState({
    title: "",
    description: "",
    course_name: "",
    session_date: "",
    start_time: "",
    end_time: "",
    location: "",
    max_participants: 20,
    category: "study",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.session_date || !form.start_time) return;

    createSession(
      {
        title: form.title,
        description: form.description || undefined,
        course_name: form.course_name || undefined,
        session_date: form.session_date,
        start_time: form.start_time,
        end_time: form.end_time || undefined,
        location: form.location || undefined,
        max_participants: form.max_participants,
        category: form.category,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setForm({
            title: "",
            description: "",
            course_name: "",
            session_date: "",
            start_time: "",
            end_time: "",
            location: "",
            max_participants: 20,
            category: "study",
          });
        },
      }
    );
  };

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="rounded-full w-10 h-10">
          <Plus className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إنشاء جلسة دراسة جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الجلسة *</Label>
            <Input
              id="title"
              placeholder="مثال: مراجعة الرياضيات"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course_name">اسم المادة</Label>
            <Input
              id="course_name"
              placeholder="مثال: رياضيات 101"
              value={form.course_name}
              onChange={(e) => updateField("course_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الجلسة</Label>
            <Textarea
              id="description"
              placeholder="صف ما ستتناوله الجلسة..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="session_date">التاريخ *</Label>
              <Input
                id="session_date"
                type="date"
                value={form.session_date}
                onChange={(e) => updateField("session_date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">الفئة</Label>
              <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start_time">من الساعة *</Label>
              <Input
                id="start_time"
                type="time"
                value={form.start_time}
                onChange={(e) => updateField("start_time", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">إلى الساعة</Label>
              <Input
                id="end_time"
                type="time"
                value={form.end_time}
                onChange={(e) => updateField("end_time", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="location">المكان</Label>
              <Input
                id="location"
                placeholder="مثال: المكتبة"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_participants">الحد الأقصى</Label>
              <Input
                id="max_participants"
                type="number"
                min={2}
                max={100}
                value={form.max_participants}
                onChange={(e) => updateField("max_participants", parseInt(e.target.value) || 20)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                جاري الإنشاء...
              </>
            ) : (
              "إنشاء الجلسة"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
