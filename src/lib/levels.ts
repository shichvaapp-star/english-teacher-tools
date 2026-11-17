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
