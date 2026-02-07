export type SessionType = "study" | "activity";

export const sessionTypeConfig: Record<
  SessionType,
  {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    emptyMessage: string;
    emptyHint: string;
    categories: { value: string; label: string }[];
  }
> = {
  study: {
    title: "جلسات الدراسة",
    subtitle: "تعلّم مع زملائك",
    searchPlaceholder: "ابحث عن جلسة دراسية...",
    emptyMessage: "لا توجد جلسات دراسية حالياً",
    emptyHint: "أنشئ جلسة جديدة باستخدام زر +",
    categories: [
      { value: "study", label: "دراسة" },
      { value: "tutoring", label: "تدريس" },
      { value: "review", label: "مراجعة" },
    ],
  },
  activity: {
    title: "أنشطة ترفيهية",
    subtitle: "استمتع مع أصدقائك",
    searchPlaceholder: "ابحث عن نشاط...",
    emptyMessage: "لا توجد أنشطة حالياً",
    emptyHint: "أنشئ نشاطاً جديداً باستخدام زر +",
    categories: [
      { value: "game_night", label: "ليلة ألعاب" },
      { value: "sports", label: "رياضة" },
      { value: "hangout", label: "تجمّع" },
      { value: "outdoor", label: "نشاط خارجي" },
    ],
  },
};

/** All category values that belong to a given session type */
export function getCategoriesForType(type: SessionType): string[] {
  return sessionTypeConfig[type].categories.map((c) => c.value);
}

/** All category labels merged for display in SessionCard */
export const allCategoryLabels: Record<string, string> = Object.values(sessionTypeConfig)
  .flatMap((c) => c.categories)
  .reduce(
    (acc, c) => {
      acc[c.value] = c.label;
      return acc;
    },
    {} as Record<string, string>
  );
