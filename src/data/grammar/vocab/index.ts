import type { ClassGrade } from "@/lib/levels";
import { GRADE_7_WORDS } from "@/data/grammar/vocab/grade-7";
import { GRADE_8_WORDS } from "@/data/grammar/vocab/grade-8";
import { GRADE_9_WORDS } from "@/data/grammar/vocab/grade-9";

export { FUNCTION_WORDS, ITEM_NAMES } from "@/data/grammar/vocab/function-words";

export const GRADE_WORDS: Record<ClassGrade, string[]> = {
  7: GRADE_7_WORDS,
  8: GRADE_8_WORDS,
  9: GRADE_9_WORDS,
};

/** Words a grade may use: its own list plus all earlier grades' lists. */
export function gradeVocabulary(grade: ClassGrade): string[] {
  const out: string[] = [];
  for (const g of [7, 8, 9] as const) {
    if (g <= grade) out.push(...GRADE_WORDS[g]);
  }
  return out;
}

export function hasGradeVocabulary(grade: ClassGrade): boolean {
  return GRADE_WORDS[grade].length > 0;
}
