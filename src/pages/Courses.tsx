import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Search,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useCourseCatalog,
  useMyEnrolledCourses,
  useCreateCatalogCourse,
  useEnrollInCourse,
  useUnenrollFromCourse,
  CatalogCourse,
} from "@/hooks/useCourseCatalog";
import { CourseListCard } from "@/components/courses/CourseListCard";
import { CourseChatRoom } from "@/components/courses/CourseChatRoom";

export default function Courses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [chatCourse, setChatCourse] = useState<CatalogCourse | null>(null);

  const { data: allCourses, isLoading: loadingAll } = useCourseCatalog(searchQuery);
  const { data: myCourses, isLoading: loadingMy } = useMyEnrolledCourses();
  const { mutate: createCourse, isPending: creating } = useCreateCatalogCourse();
  const { mutate: enroll, isPending: enrolling } = useEnrollInCourse();
  const { mutate: unenroll, isPending: unenrolling } = useUnenrollFromCourse();

  const handleCreate = () => {
    if (!newCourseName.trim()) return;
    createCourse(newCourseName, {
      onSuccess: () => {
        setNewCourseName("");
        setShowCreateDialog(false);
      },
    });
  };

  const isLoading = enrolling || unenrolling;

  return (
    <MobileLayout>
      <div className="p-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">المقررات الدراسية</h1>
              <p className="text-sm text-muted-foreground">انضم لمقرراتك وتواصل مع زملائك</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="h-10 w-10"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Search + Create */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن مقرر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9"
            />
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="icon" className="shrink-0">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my" dir="rtl">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="my" className="flex-1">مقرراتي</TabsTrigger>
            <TabsTrigger value="all" className="flex-1">جميع المقررات</TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="space-y-3">
            {loadingMy ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : !myCourses || myCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">لم تنضم لأي مقرر بعد</p>
                <p className="text-sm text-muted-foreground mt-1">
                  ابحث عن مقرراتك أو أنشئ واحداً جديداً
                </p>
              </div>
            ) : (
              myCourses.map((course) => (
                <CourseListCard
                  key={course.id}
                  course={course}
                  onEnroll={(id) => enroll(id)}
                  onUnenroll={(id) => unenroll(id)}
                  onOpenChat={(c) => setChatCourse(c)}
                  isLoading={isLoading}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-3">
            {loadingAll ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : !allCourses || allCourses.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">
                  {searchQuery ? "لا توجد نتائج" : "لا توجد مقررات بعد"}
                </p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => setShowCreateDialog(true)}
                >
                  أنشئ مقرراً جديداً
                </Button>
              </div>
            ) : (
              allCourses.map((course) => (
                <CourseListCard
                  key={course.id}
                  course={course}
                  onEnroll={(id) => enroll(id)}
                  onUnenroll={(id) => unenroll(id)}
                  onOpenChat={(c) => setChatCourse(c)}
                  isLoading={isLoading}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Course Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle>إنشاء مقرر جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="اسم المقرر (مثال: مقدمة في البرمجة)"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <p className="text-xs text-muted-foreground">
              إذا كان المقرر موجوداً بالفعل، يمكنك الانضمام إليه من قائمة المقررات
            </p>
            <Button
              className="w-full"
              onClick={handleCreate}
              disabled={!newCourseName.trim() || creating}
            >
              {creating ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 ml-2" />
              )}
              إنشاء المقرر
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={!!chatCourse} onOpenChange={() => setChatCourse(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden" dir="rtl">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {chatCourse?.name}
            </DialogTitle>
          </DialogHeader>
          {chatCourse && (
            <CourseChatRoom
              catalogCourseId={chatCourse.id}
              courseName={chatCourse.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
