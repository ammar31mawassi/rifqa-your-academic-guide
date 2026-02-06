import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Plus, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Course, GradeComponent, componentPresets, defaultComponents, getLetterGrade, getGradeLabel } from "./types";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  index: number;
  onUpdate: (course: Course) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function CourseCard({ course, index, onUpdate, onRemove, canRemove }: CourseCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showComponentSettings, setShowComponentSettings] = useState(false);

  const totalWeight = course.components.reduce((sum, c) => sum + c.weight, 0);
  const isValidWeight = totalWeight === 100;

  // Calculate course score and progress
  const completedComponents = course.components.filter(c => c.score !== null);
  const completedWeight = completedComponents.reduce((sum, c) => sum + c.weight, 0);
  const progress = completedWeight;

  // Calculate weighted score from completed components only
  const weightedScore = completedComponents.reduce((sum, c) => {
    const normalizedScore = (c.score! / c.maxScore) * 100;
    return sum + (normalizedScore * c.weight / 100);
  }, 0);

  // Project final grade based on completed work
  const projectedGrade = completedWeight > 0 ? (weightedScore / completedWeight) * 100 : 0;

  const updateComponent = (componentId: string, field: keyof GradeComponent, value: number | string | null) => {
    const updatedComponents = course.components.map(c =>
      c.id === componentId ? { ...c, [field]: value } : c
    );
    onUpdate({ ...course, components: updatedComponents });
  };

  const addComponent = () => {
    const newComponent: GradeComponent = {
      id: crypto.randomUUID(),
      name: "مكون جديد",
      weight: 0,
      score: null,
      maxScore: 100,
    };
    onUpdate({ ...course, components: [...course.components, newComponent] });
  };

  const removeComponent = (componentId: string) => {
    if (course.components.length > 1) {
      onUpdate({ ...course, components: course.components.filter(c => c.id !== componentId) });
    }
  };

  const applyPreset = (presetIndex: string) => {
    const preset = componentPresets[parseInt(presetIndex)];
    if (preset) {
      const newComponents = preset.components.map((c) => ({
        ...c,
        id: crypto.randomUUID(),
      }));
      onUpdate({ ...course, components: newComponents });
    }
  };

  return (
    <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>المقرر {index + 1}</span>
            {course.name && <span className="text-muted-foreground">- {course.name}</span>}
          </CollapsibleTrigger>
          <div className="flex items-center gap-2">
            {progress > 0 && (
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                projectedGrade >= 60 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {projectedGrade.toFixed(0)}% ({getLetterGrade(projectedGrade)})
              </span>
            )}
            {canRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onRemove}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <CollapsibleContent className="space-y-4 pt-3">
          {/* Course info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">اسم المقرر</Label>
              <Input
                placeholder="مثال: الرياضيات"
                value={course.name}
                onChange={(e) => onUpdate({ ...course, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">الساعات المعتمدة</Label>
              <Input
                type="number"
                min={0.5}
                max={12}
                step={0.5}
                value={course.credits}
                onChange={(e) => onUpdate({ ...course, credits: parseFloat(e.target.value) || 0 })}
                className="mt-1"
                placeholder="مثال: 3"
              />
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">التقدم في المقرر</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Component settings toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComponentSettings(!showComponentSettings)}
              className="text-xs gap-1"
            >
              <Settings2 className="w-3 h-3" />
              {showComponentSettings ? "إخفاء الإعدادات" : "تخصيص التقسيم"}
            </Button>

            {showComponentSettings && (
              <Select onValueChange={applyPreset}>
                <SelectTrigger className="w-auto h-8 text-xs">
                  <SelectValue placeholder="قوالب جاهزة" />
                </SelectTrigger>
                <SelectContent>
                  {componentPresets.map((preset, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Grade components */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">مكونات الدرجة</Label>
              {!isValidWeight && (
                <span className="text-xs text-destructive">
                  المجموع: {totalWeight}% (يجب أن يكون 100%)
                </span>
              )}
            </div>

            {course.components.map((component) => (
              <div key={component.id} className="flex items-center gap-2 p-2 bg-background rounded-lg">
                {showComponentSettings ? (
                  <>
                    <Input
                      value={component.name}
                      onChange={(e) => updateComponent(component.id, "name", e.target.value)}
                      className="flex-1 h-8 text-sm"
                      placeholder="اسم المكون"
                    />
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={component.weight}
                        onChange={(e) => updateComponent(component.id, "weight", parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-sm text-center"
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                    {course.components.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive/70 hover:text-destructive"
                        onClick={() => removeComponent(component.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{component.name} ({component.weight}%)</span>
                    <Input
                      type="number"
                      min={0}
                      max={component.maxScore}
                      value={component.score ?? ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? null : parseInt(e.target.value);
                        updateComponent(component.id, "score", val);
                      }}
                      className="w-20 h-8 text-sm text-center"
                      placeholder="الدرجة"
                    />
                    <span className="text-xs text-muted-foreground">/ {component.maxScore}</span>
                  </>
                )}
              </div>
            ))}

            {showComponentSettings && (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-dashed text-xs"
                onClick={addComponent}
              >
                <Plus className="w-3 h-3 ml-1" />
                إضافة مكون
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
