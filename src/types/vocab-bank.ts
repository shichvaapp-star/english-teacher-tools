export type VocabGrade = "ז" | "ח" | "ט" | "י" | "יא" | "יב" | "all";

export type VocabStandardLevel = "א1" | "א2" | "ב" | "3" | "4" | "5" | "all";

export interface TeacherVocabWord {
  id: string;
  english: string;
  hebrew: string;
  partOfSpeech?: "noun" | "verb" | "adjective" | "adverb" | "phrase";
  example?: string;
}

export interface TeacherVocabBank {
  id: string;
  teacherId: string;
  name: string;
  description?: string;
  grade: VocabGrade | string;
  levelType: "standard" | "custom";
  standardLevel?: VocabStandardLevel;
  customLevelName?: string; // e.g. "דוברי אנגלית כיתה ז׳" / "7th grade English speakers"
  words: TeacherVocabWord[];
  createdAt: string;
  updatedAt: string;
}

export const GRADE_LABELS: Record<string, string> = {
  all: "כללי / כל השכבות",
  ז: "כיתה ז׳",
  ח: "כיתה ח׳",
  ט: "כיתה ט׳",
  י: "כיתה י׳",
  יא: "כיתה י״א",
  יב: "כיתה י״ב",
};

export const STANDARD_LEVEL_LABELS: Record<string, string> = {
  all: "כל הרמות / הקבצות",
  א1: "הקבצה א1 (מואץ/גבוה)",
  א2: "הקבצה א2 (רגיל)",
  ב: "הקבצה ב (בסיסי)",
  "3": "3 יח״ל",
  "4": "4 יח״ל",
  "5": "5 יח״ל",
};

export const COMMON_CUSTOM_LEVEL_PRESETS = [
  "דוברי אנגלית (Native / Advanced Speakers)",
  "דוברי אנגלית כיתה ז׳",
  "דוברי אנגלית כיתה ח׳",
  "דוברי אנגלית כיתה ט׳",
  "עולים חדשים (Olim Chadashim)",
  "מצטיינים ומחוננים",
  "הכנה למבחן מפמ״ר",
  "חיזוק קריאה ואוצר מילים",
  "אנגלית טכנולוגית / עסקית",
];
