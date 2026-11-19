// Printable worksheets built by the teacher's worksheet wizard.
// A worksheet stores the settings the teacher chose AND a snapshot of the
// resolved content, so a saved sheet always reprints exactly the same.
import type { ClassGrade, LevelNumber } from "@/lib/levels";
import type { GrammarExerciseType, GrammarItem } from "@/types/grammar";
import type { MSUnseenQuestion } from "@/types/unseen";
import type { ConversationQuestion, ConversationQuestionType } from "@/types/conversation";

export type PartKind = "vocab" | "grammar" | "reading" | "conversation" | "writing";

/** Order the parts appear on the sheet (Part A, B, C…). */
export const PART_ORDER: readonly PartKind[] = ["vocab", "grammar", "reading", "conversation", "writing"];

export type VocabExerciseKind = "match" | "to_hebrew" | "to_english" | "gap_sentence" | "choose_meaning";
export const VOCAB_KINDS: readonly VocabExerciseKind[] = ["match", "choose_meaning", "gap_sentence", "to_hebrew", "to_english"];

export type ReadingQuestionKind = MSUnseenQuestion["type"];
export const READING_KINDS: readonly ReadingQuestionKind[] = ["mcq", "open", "copy"];
export const CONVERSATION_KINDS: readonly ConversationQuestionType[] = ["mcq", "open", "copy", "reply_mcq", "reply_open"];

export interface VocabPartConfig {
  /** Textbook units; empty = all units of the grade. */
  units: number[];
  count: number;
  types: VocabExerciseKind[];
}

export interface GrammarPartConfig {
  topicIds: string[];
  count: number;
  /** Empty = every type the chosen topics have. */
  types: GrammarExerciseType[];
}

export interface ReadingPartConfig {
  /** null = "pick for me". */
  storyId: string | null;
  count: number;
  types: ReadingQuestionKind[];
}

export interface ConversationPartConfig {
  scenarioId: string | null;
  count: number;
  types: ConversationQuestionType[];
}

export interface WritingPartConfig {
  taskId: string | null;
  wordBank: boolean;
  starters: boolean;
  guided: boolean;
  lines: number;
}

export interface WorksheetLayout {
  title: string;
  /** Name / class / date lines at the top. */
  header: boolean;
  answerKey: boolean;
  /** Hebrew line under each English instruction. */
  hebrewHelp: boolean;
  /** Word box with Hebrew translations at the end of the sheet. */
  wordBankHebrew: boolean;
  /** Bigger font and more writing space. */
  easyRead: boolean;
  /** Version A + Version B (same questions, different order). */
  versions: boolean;
}

export interface WorksheetSettings {
  grade: ClassGrade;
  level: LevelNumber;
  parts: PartKind[];
  vocab: VocabPartConfig;
  grammar: GrammarPartConfig;
  reading: ReadingPartConfig;
  conversation: ConversationPartConfig;
  writing: WritingPartConfig;
  layout: WorksheetLayout;
}

export interface VocabWorksheetItem {
  id: string;
  kind: VocabExerciseKind;
  /** The list entry as printed (may include notes such as "(in)"). */
  word: string;
  hebrew: string;
  /** gap_sentence: the example with the word replaced by "_____". */
  sentence?: string;
  /** gap_sentence: the exact text that fills the blank. */
  answer?: string;
  /** choose_meaning: Hebrew options and the correct index. */
  options?: string[];
  answerIndex?: number;
  /** to_english: first-letter hint for levels 1–2. */
  hint?: string;
}

export interface ReadingSnapshot {
  storyId: string;
  title: string;
  hebrewTitle: string;
  paragraphs: string[];
  vocabularyHints: { word: string; translation: string }[];
}

export interface ConversationSnapshot {
  scenarioId: string;
  title: string;
  hebrewTitle: string;
  settingDescription: string;
  speakers: { id: string; name: string; role: string }[];
  turns: { index: number; speakerId: string; text: string; stageDirection?: string }[];
  usefulPhrases: { phrase: string; translation: string }[];
}

export interface WritingSnapshot {
  taskId: string;
  title: string;
  hebrewTitle: string;
  prompt: string;
  hebrewInstructions: string;
  minWords: number;
  maxWords: number;
  wordBank: { word: string; hebrew: string }[];
  sentenceStarters: string[];
  guidedSteps: { titleHebrew: string; starterPhrase: string }[];
  lines: number;
}

export type WorksheetSection =
  | { kind: "vocab"; items: VocabWorksheetItem[] }
  | { kind: "grammar"; items: GrammarItem[] }
  | { kind: "reading"; story: ReadingSnapshot; questions: MSUnseenQuestion[] }
  | { kind: "conversation"; dialogue: ConversationSnapshot; questions: ConversationQuestion[] }
  | { kind: "writing"; task: WritingSnapshot };

/** What gets printed: settings + resolved content. */
export interface WorksheetContent {
  settings: WorksheetSettings;
  sections: WorksheetSection[];
  /** Seed for Version B's order. */
  seed: number;
}

export interface Worksheet extends WorksheetContent {
  id: string;
  teacherId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}
