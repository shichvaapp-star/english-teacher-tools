import type { ClassGrade } from "@/lib/levels";
import type { VocabEntry } from "@/data/grammar/vocab/types";
import { BAND_1_WORDS } from "@/data/grammar/vocab/band-1";
import { GRADE_7_VOCAB } from "@/data/grammar/vocab/grade-7";
import { GRADE_8_VOCAB } from "@/data/grammar/vocab/grade-8";
import { GRADE_9_VOCAB } from "@/data/grammar/vocab/grade-9";

export type { VocabEntry } from "@/data/grammar/vocab/types";
export { FUNCTION_WORDS, ITEM_NAMES } from "@/data/grammar/vocab/function-words";
export { BAND_1_WORDS };

/** Each grade's textbook list (Teamwork / New Directions Plus / Mindset Plus). */
export const GRADE_VOCAB: Record<ClassGrade, VocabEntry[]> = {
  7: GRADE_7_VOCAB,
  8: GRADE_8_VOCAB,
  9: GRADE_9_VOCAB,
};

/**
 * Vocabulary a grade may use (as written in the lists): Band I (elementary
 * school, the base for everyone) + that grade's textbook + all earlier grades'.
 */
export function gradeVocabulary(grade: ClassGrade): string[] {
  const out = [...BAND_1_WORDS];
  for (const g of [7, 8, 9] as const) {
    if (g <= grade) out.push(...GRADE_VOCAB[g].map((e) => e.word));
  }
  return out;
}

/** Splits list entries ("go out/outside", "take part (in)", "win, won") into single lowercase words. */
export function vocabularyTokens(entries: string[]): string[] {
  const out = new Set<string>();
  for (const e of entries) {
    for (const w of e.toLowerCase().replace(/[’]/g, "'").match(/[a-zà-ÿ][a-zà-ÿ'-]*/g) ?? []) {
      out.add(w.replace(/'$/, ""));
      // "o'clock", "it's" etc. – also allow the parts
      for (const p of w.split(/['-]/)) if (p.length > 1) out.add(p);
    }
  }
  return [...out];
}

export function hasGradeVocabulary(grade: ClassGrade): boolean {
  return GRADE_VOCAB[grade].length > 0;
}
