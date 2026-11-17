import type { ClassGrade, LevelNumber } from "@/lib/levels";

/** Curriculum 2020 levels of progression (Grammar Band II key). */
export type ProgressionStage =
  | "receptive" // Mostly receptive
  | "emerging" // Emerging usage and production
  | "evolving" // Evolving usage and accuracy
  | "accurate"; // Mostly correct usage and accuracy

export type GrammarGroupId =
  | "tenses"
  | "questions"
  | "modals"
  | "passive"
  | "clauses"
  | "nouns"
  | "adjectives";

export interface GrammarGroup {
  id: GrammarGroupId;
  title: string;
  titleHe: string;
}

export type GrammarExerciseType =
  | "mcq"
  | "gap_type"
  | "gap_bank"
  | "unscramble"
  | "find_fix"
  | "transform"
  | "sort"
  | "match_halves"
  | "cloze_text"
  | "write_own";

export interface FormRow {
  /** e.g. "+", "−", "?" */
  kind: "affirmative" | "negative" | "question" | "short_answer";
  pattern: string; // e.g. "I / you / we / they + verb"
  example: string; // e.g. "They play football."
}

/**
 * One rule box. Title is a short line in Hebrew / English (keep English inside
 * the Hebrew to a minimum). Examples are English only, one per line:
 *  - wrap the key part in **double stars** to highlight it
 *  - start with "✗ " to show a wrong example (struck through)
 */
export interface RulePoint {
  he: string;
  en: string;
  examples: string[];
  /** Show examples as small chips in a row (good for spelling lists). */
  chips?: boolean;
}

/** A short rule card – must be readable in ~20 seconds. */
export interface RuleCard {
  /** 2–4 boxes. */
  points: RulePoint[];
  form: FormRow[];
  /** Signal / time words, e.g. "every day", "usually". */
  timeWords?: string[];
}

export interface GrammarTrap {
  id: string;
  wrong: string;
  right: string;
  whyHe: string;
  whyEn: string;
}

export interface GrammarTopic {
  id: string;
  group: GrammarGroupId;
  title: string;
  titleHe: string;
  /** Band II structure names this topic covers. */
  bandRefs: string[];
  /** Progression stage expected per grade (absent = not in that grade). */
  grades: Partial<Record<ClassGrade, ProgressionStage>>;
  rule: Record<LevelNumber, RuleCard>;
  traps: GrammarTrap[];
}

interface GrammarItemBase {
  id: string;
  topicId: string;
  level: LevelNumber;
  /** Situation shown above the task (curriculum's "[added context]"). */
  context?: string;
  /** Short task line (Hebrew) shown above the item, e.g. "בחרו את הצורה הנכונה". */
  instructionHe?: string;
  explanationHe: string;
  explanationEn: string;
  /** First hint (usually a signal word / meaning nudge). */
  hintHe?: string;
  trapId?: string;
  vocabTags?: string[];
}

/** Sentence with a single blank written as "___". */
export interface McqItem extends GrammarItemBase {
  type: "mcq";
  sentence: string;
  options: string[];
  answer: string;
}

export interface GapBankItem extends GrammarItemBase {
  type: "gap_bank";
  sentence: string;
  wordBank: string[];
  answer: string;
}

export interface GapTypeItem extends GrammarItemBase {
  type: "gap_type";
  sentence: string;
  /** Base form shown in brackets, e.g. "play". */
  baseForm: string;
  answers: string[];
}

export interface UnscrambleItem extends GrammarItemBase {
  type: "unscramble";
  /** Correct order. The UI shuffles. */
  words: string[];
  /** Other accepted full sentences (rare). */
  altAnswers?: string[];
  /** Final punctuation, e.g. "?" */
  ending: "." | "?" | "!";
}

export interface FindFixItem extends GrammarItemBase {
  type: "find_fix";
  /** Sentence split into tokens; exactly one is wrong. */
  tokens: string[];
  wrongIndex: number;
  /** Accepted corrections for the wrong token (may be multi-word). */
  answers: string[];
}

export interface TransformItem extends GrammarItemBase {
  type: "transform";
  source: string;
  /** What to do, e.g. "Make it negative". */
  taskEn: string;
  taskHe: string;
  answers: string[];
}

export interface SortItem extends GrammarItemBase {
  type: "sort";
  buckets: string[];
  entries: { text: string; bucket: string }[];
}

export interface MatchHalvesItem extends GrammarItemBase {
  type: "match_halves";
  pairs: { left: string; right: string }[];
}

/** Text with numbered blanks "{1}", "{2}" … */
export interface ClozeTextItem extends GrammarItemBase {
  type: "cloze_text";
  title?: string;
  text: string;
  blanks: { baseForm: string; answers: string[] }[];
}

export interface WriteOwnItem extends GrammarItemBase {
  type: "write_own";
  taskEn: string;
  taskHe: string;
  /** Model answers for the teacher / AI grader. */
  modelAnswers: string[];
}

export type GrammarItem =
  | McqItem
  | GapBankItem
  | GapTypeItem
  | UnscrambleItem
  | FindFixItem
  | TransformItem
  | SortItem
  | MatchHalvesItem
  | ClozeTextItem
  | WriteOwnItem;

/** Student response, one shape per exercise type. */
export type GrammarResponse =
  | { type: "mcq" | "gap_bank"; value: string }
  | { type: "gap_type" | "transform" | "write_own"; value: string }
  | { type: "unscramble"; order: string[] }
  | { type: "find_fix"; index: number | null; value: string }
  | { type: "sort"; placement: Record<string, string> }
  | { type: "match_halves"; matches: Record<string, string> }
  | { type: "cloze_text"; values: string[] };

export interface GrammarGrade {
  /** 0..1 */
  score: number;
  isCorrect: boolean;
  /** Deterministic grading could not decide (typed answer not in the key). */
  needsReview: boolean;
  /** Per-part correctness for multi-part items (sort / match / cloze). */
  parts?: boolean[];
  /** The expected answer to show after checking. */
  expected: string;
}
