// Shared student-level constants for new sections (Grammar onward).
// Older sections still declare their own "Level 1" | "Level 2" | "Level 3" unions.

export type LevelNumber = 1 | 2 | 3;
export type LevelLabel = "Level 1" | "Level 2" | "Level 3";

export const LEVELS: readonly LevelNumber[] = [1, 2, 3] as const;

export const LEVEL_NAME_HE: Record<LevelNumber, string> = {
  1: "רמה 1",
  2: "רמה 2",
  3: "רמה 3",
};

export const LEVEL_DESCRIPTION_HE: Record<LevelNumber, string> = {
  1: "בסיס – צעד אחר צעד",
  2: "רגיל",
  3: "מתקדם",
};

export function levelToLabel(level: LevelNumber): LevelLabel {
  return `Level ${level}` as LevelLabel;
}

export function labelToLevel(label: string | null | undefined): LevelNumber | null {
  if (!label) return null;
  const n = Number(String(label).replace(/\D/g, ""));
  return n === 1 || n === 2 || n === 3 ? n : null;
}

export type ClassGrade = 7 | 8 | 9;

/** Maps Hebrew class letters (ז/ח/ט) to grade numbers. */
export function hebrewGradeToNumber(grade: string | null | undefined): ClassGrade | null {
  if (!grade) return null;
  const g = grade.trim().charAt(0);
  if (g === "ז") return 7;
  if (g === "ח") return 8;
  if (g === "ט") return 9;
  return null;
}

export const CLASS_GRADES: readonly ClassGrade[] = [7, 8, 9] as const;

/** "Level 1" | "Level 2" | "Level 3" – the label form older sections store. */
export type ExerciseLevel = LevelLabel;

export const GRADE_HE: Record<ClassGrade, string> = { 7: "ז", 8: "ח", 9: "ט" };

/** "כיתה ז׳ · 7th grade" style labels for pickers. */
export const GRADE_LABELS: Record<ClassGrade, { he: string; en: string }> = {
  7: { he: "כיתה ז׳", en: "Grade 7" },
  8: { he: "כיתה ח׳", en: "Grade 8" },
  9: { he: "כיתה ט׳", en: "Grade 9" },
};

/** Maps a grade number back to its Hebrew class letter (ז/ח/ט). */
export function gradeToHebrew(grade: ClassGrade): string {
  return GRADE_HE[grade];
}

/** Parses "7", 7, "ז", "ז׳2" → 7. */
export function parseClassGrade(value: string | number | null | undefined): ClassGrade | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (n === 7 || n === 8 || n === 9) return n;
  return hebrewGradeToNumber(String(value));
}
