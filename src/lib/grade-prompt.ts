// Grade-aware text for the AI routes: which vocabulary the class knows, what
// to expect from a student in that grade, and a post-check for generated text.
// Server-safe (no React, no Firebase).

import { parseClassGrade, type ClassGrade } from "@/lib/levels";
import { allowedWordsFor, findUnknownWords, gradeWordListForPrompt } from "@/lib/vocab-check";

const BOOK: Record<ClassGrade, string> = {
  7: "Teamwork (grade 7)",
  8: "New Directions Plus (grade 8)",
  9: "Mindset Plus (grade 9)",
};

type LevelLike = string | number | null | undefined;
const levelNumber = (l: LevelLike): 1 | 2 | 3 => {
  const n = Number(String(l ?? "").replace(/\D/g, ""));
  return n === 1 || n === 3 ? n : 2;
};

/** Reads `grade` from a request body (7, "8", "ט"…); null when absent or invalid. */
export function gradeFromBody(body: { grade?: unknown } | null | undefined): ClassGrade | null {
  const g = body?.grade;
  return typeof g === "number" || typeof g === "string" ? parseClassGrade(g) : null;
}

/**
 * Prompt block for GENERATING content: the class's textbook words and how
 * strictly to stay inside them. Empty string when the grade is unknown.
 */
export function gradeVocabularyPrompt(grade: ClassGrade | null, level: LevelLike): string {
  if (!grade) return "";
  const lvl = levelNumber(level);
  const earlier = grade > 7 ? ` and the earlier grades' books` : "";
  const rule =
    lvl === 3
      ? "Prefer these words; you may add richer vocabulary, but gloss any rare word in vocabularyHints / usefulPhrases."
      : "Use ONLY: (a) basic elementary-school vocabulary (Israeli Ministry Lexical Band I), (b) the words below, (c) function words, numbers and names. If you need any other word, choose a simpler one.";
  return `
GRADE VOCABULARY (Israeli junior high, ${BOOK[grade]}):
The students are in grade ${grade}${lvl === 1 ? " and read below class level" : ""}. Their textbook is ${BOOK[grade]}${earlier}.
${rule}
Textbook words for this grade (use several of them naturally): ${gradeWordListForPrompt(grade, undefined, 350)}`;
}

/** Prompt block for EVALUATING a student: realistic expectations for the grade and level. */
export function gradeExpectationsPrompt(grade: ClassGrade | null, level: LevelLike): string {
  if (!grade) return "";
  const lvl = levelNumber(level);
  const strictness =
    lvl === 1
      ? "Be lenient: reward meaning and effort; correct only the most important mistakes."
      : lvl === 2
      ? "Expect accuracy in the basic tenses and word order taught so far."
      : "Expect accurate, varied language; point out style and precision issues.";
  return `
STUDENT GRADE: grade ${grade} (Israeli junior high, textbook ${BOOK[grade]}), ${`Level ${lvl}`}.
Judge vocabulary against what a grade-${grade} student has learned (Band I + the ${BOOK[grade]} word list), not against adult or Bagrut standards. ${strictness}`;
}

/** Words in generated text outside the grade vocabulary (Levels 1–2 only; Level 3 is free). */
export function wordsOutsideGrade(
  texts: (string | undefined | null)[],
  grade: ClassGrade | null,
  level: LevelLike,
  extra: string[] = []
): string[] {
  if (!grade || levelNumber(level) === 3) return [];
  return findUnknownWords(texts.filter((t): t is string => Boolean(t)), allowedWordsFor(grade, extra));
}
