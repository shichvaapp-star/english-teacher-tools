import type { Timestamp } from "firebase/firestore";
import type { StudentGroup } from "./auth";
import type { AssignmentTargetType } from "./assignment";
import type { GrammarItem, GrammarResponse } from "./grammar";
import type { MSUnseenQuestion } from "./unseen";

// ===============================================================
// Lab exams (writing). Firestore layout:
//   exams/{examId}                       teacher-owned exam (students read it)
//   exams/{examId}/variants/{key}        the topic – students read it only while open
//   exams/{examId}/private/answers       answer keys + builder settings – teacher only
//   exams/{examId}/results/{studentId}   teacher's grading (overrides, writing points) – teacher only
//   exam_sessions/{examId}__{studentId}  one per student (text, state, events)
//   exam_sessions/{id}/keylog/{chunkId}  keystroke batches for the replay
// ===============================================================

export type ExamStatus = "draft" | "open" | "closed";

/** One word of the exam list as students see it (Hebrew only). */
export interface ExamVocabHebrew {
  id: string;
  he: string;
}

/** Hashes of the English word and its inflections, so students can't read the answers. */
export interface ExamVocabHashes {
  id: string;
  hashes: string[];
}

export interface ExamVocabAnswer {
  id: string;
  english: string;
  hebrew: string;
}

/** Test (מבחן) or quiz (בוחן): same lockdown, different label and defaults. */
export type ExamKind = "test" | "quiz";

export const EXAM_KIND_HE: Record<ExamKind, string> = { test: "מבחן", quiz: "בוחן" };

export type ExamPartType = "writing" | "unseen" | "vocab" | "grammar";

export const EXAM_PART_LABEL_HE: Record<ExamPartType, string> = {
  writing: "כתיבה",
  unseen: "הבנת הנקרא (Unseen)",
  vocab: "אוצר מילים",
  grammar: "דקדוק",
};

/** What everyone (students too) may know about a part. */
export interface ExamPartMeta {
  id: string;
  type: ExamPartType;
  title: string;
  /** Share of the final grade (all parts add up to 100). */
  points: number;
  /** Number of questions / items (writing: 1). */
  itemCount: number;
}

export type VocabQuestionFormat = "he_to_en_type" | "en_to_he_choice" | "he_to_en_choice";

export const VOCAB_FORMAT_HE: Record<VocabQuestionFormat, string> = {
  he_to_en_type: "עברית ← כתיבת המילה באנגלית",
  en_to_he_choice: "אנגלית ← בחירת הפירוש בעברית",
  he_to_en_choice: "עברית ← בחירת המילה באנגלית",
};

// ---- Full parts (teacher only, with answers) ----------------------------------

export interface WritingPartFull {
  id: string;
  type: "writing";
}

export interface UnseenPartFull {
  id: string;
  type: "unseen";
  title: string;
  paragraphs: string[];
  questions: MSUnseenQuestion[];
}

export interface VocabQuestionFull {
  id: string;
  format: VocabQuestionFormat;
  /** The word shown (Hebrew or English, by format). */
  prompt: string;
  /** Choice formats only. */
  options?: string[];
  /** The correct answer (English or Hebrew, by format). */
  answer: string;
}

export interface VocabPartFull {
  id: string;
  type: "vocab";
  questions: VocabQuestionFull[];
}

export interface GrammarPartFull {
  id: string;
  type: "grammar";
  items: GrammarItem[];
}

export type ExamPartFull = WritingPartFull | UnseenPartFull | VocabPartFull | GrammarPartFull;

// ---- Student parts (no answers) -------------------------------------------------

export type StudentUnseenQuestion = Pick<
  MSUnseenQuestion,
  "id" | "number" | "paragraphIndex" | "linesHint" | "type" | "prompt" | "options" | "points"
>;

export interface UnseenPartStudent extends Omit<UnseenPartFull, "questions"> {
  questions: StudentUnseenQuestion[];
}

export type StudentVocabQuestion = Omit<VocabQuestionFull, "answer">;

export interface VocabPartStudent extends Omit<VocabPartFull, "questions"> {
  questions: StudentVocabQuestion[];
}

/** Grammar items keep their shape (the exercise components need it) but every answer field is emptied. */
export type GrammarPartStudent = GrammarPartFull;

export type ExamPartStudent = WritingPartFull | UnseenPartStudent | VocabPartStudent | GrammarPartStudent;

/** A student's answer to one item: choice index / text / grammar response. */
export type ExamAnswer = number | string | GrammarResponse;

export interface ExamVariant {
  key: string; // "A" | "B" | "C"
  /** Writing topic for this version ("" when the exam has no writing part). */
  title: string;
  prompt: string;
  /** Missing on exams made before parts existed (= writing only). */
  parts?: ExamPartStudent[];
}

/** Builder settings, kept so the teacher can edit the exam (teacher only). */
export type ExamPartDraft =
  | { id: string; type: "writing"; title: string; points: number }
  | {
      id: string;
      type: "unseen";
      title: string;
      points: number;
      grade: 7 | 8 | 9;
      level: 1 | 2 | 3;
      storyId: string;
      questionIds: string[];
    }
  | {
      id: string;
      type: "vocab";
      title: string;
      points: number;
      words: ExamVocabAnswer[];
      formats: VocabQuestionFormat[];
      count: number;
      seed: number;
    }
  | {
      id: string;
      type: "grammar";
      title: string;
      points: number;
      grade: 7 | 8 | 9;
      level: 1 | 2 | 3;
      topicIds: string[];
      types: GrammarItem["type"][];
      count: number;
      items: GrammarItem[];
    };

/** exams/{id}/private/answers */
export interface ExamPrivateAnswers {
  /** Writing word list (English + Hebrew). */
  words: ExamVocabAnswer[];
  /** Full parts per version key, used for grading. */
  variants?: Record<string, ExamPartFull[]>;
  drafts?: ExamPartDraft[];
}

/** exams/{id}/results/{studentId} – the teacher's grading. */
export interface ExamResultDoc {
  studentId: string;
  /** "partId|itemId" → fraction 0..1 set by the teacher (overrides the automatic score). */
  overrides: Record<string, number>;
  /** Writing part score 0..1 (teacher / AI check). */
  writingScore?: number;
  feedback?: string;
  updatedAt: string;
}

export interface ExamSeat {
  row: number;
  col: number;
  studentId: string;
}

export interface ExamSeatPlan {
  rows: number;
  cols: number;
  seats: ExamSeat[];
}

export interface ExamDoc {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  grade?: 7 | 8 | 9;
  targetType: AssignmentTargetType;
  targetClass?: string;
  targetGroup?: StudentGroup;
  targetStudentIds?: string[];
  status: ExamStatus;
  /** Missing on older exams (= test). */
  kind?: ExamKind;
  /** Missing on older exams (= one writing part). */
  parts?: ExamPartMeta[];
  durationMin: number;
  minWords: number;
  maxWords: number;
  minVocabUsed: number;
  vocabHebrew: ExamVocabHebrew[];
  vocabHashes: ExamVocabHashes[];
  /** Salt for the vocab hashes (random per exam). */
  vocabSalt: string;
  variantKeys: string[];
  /** Which topic each student gets. Missing student → first variant. */
  variantByStudent: Record<string, string>;
  seatPlan?: ExamSeatPlan;
  openedAt?: Timestamp | null;
  closesAt?: Timestamp | null;
  closedAt?: Timestamp | null;
  /** Set once the essays were copied into the grading inbox. */
  sentToGradingAt?: string;
  /** Results released to students (exam submissions written). */
  resultsReleasedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExamSessionState = "active" | "locked" | "submitted";

/** "lock" events freeze the exam; "flag" events are only logged. */
export type ExamEventSeverity = "lock" | "flag" | "info";

export type ExamEventType =
  | "start"
  | "resume"
  | "exit_fullscreen"
  | "no_fullscreen"
  | "tab_hidden"
  | "window_blur"
  | "paste"
  | "drop"
  | "replacement"
  | "bulk_insert"
  | "extension"
  | "resize"
  | "blocked_key"
  | "non_english"
  | "unlock"
  | "submit"
  | "force_submit";

export interface ExamEvent {
  /** Epoch ms (client clock). */
  t: number;
  type: ExamEventType;
  severity: ExamEventSeverity;
  detail?: string;
}

export interface ExamSessionDoc {
  id: string; // `${examId}__${studentId}`
  examId: string;
  studentId: string;
  studentName: string;
  studentClass?: string;
  teacherId: string;
  variantKey: string;
  state: ExamSessionState;
  lockReason?: ExamEventType | null;
  text: string;
  wordCount: number;
  vocabUsedIds: string[];
  /** "partId|itemId" → answer (non-writing parts). */
  answers?: Record<string, ExamAnswer>;
  events: ExamEvent[];
  startedAt?: Timestamp | null;
  lastSeenAt?: Timestamp | null;
  submittedAt?: Timestamp | null;
  receiptCode?: string;
}

/** One keystroke batch. `ops` is JSON of KeylogOp[] (Firestore can't nest arrays). */
export interface ExamKeylogChunk {
  teacherId: string;
  studentId: string;
  ops: string;
  createdAt: number;
}

/** [epoch ms, position, deleted chars, inserted text] */
export type KeylogOp = [number, number, number, string];

export const EXAM_EVENT_LABEL_HE: Record<ExamEventType, string> = {
  start: "התחיל/ה את המבחן",
  resume: "חזר/ה למבחן (רענון / כניסה מחדש)",
  exit_fullscreen: "יצא/ה ממסך מלא",
  no_fullscreen: "מסך מלא לא זמין במחשב הזה – המבחן רץ בלעדיו",
  tab_hidden: "עבר/ה ללשונית או חלון אחר",
  window_blur: "החלון איבד מיקוד (מעבר לתוכנה אחרת)",
  paste: "ניסיון הדבקה",
  drop: "ניסיון גרירת טקסט",
  replacement: "החלפת מילה אוטומטית (בודק איות / הצעת מקלדת)",
  bulk_insert: "הוכנס טקסט רב בבת אחת (הכתבה / השלמה אוטומטית)",
  extension: "זוהה תוסף כתיבה (Grammarly וכד׳)",
  resize: "שינוי גודל חלון (ייתכן כלי מפתחים)",
  blocked_key: "קיצור מקלדת חסום",
  non_english: "הקלדה בעברית / תווים לא באנגלית",
  unlock: "המורה שחרר/ה את הנעילה",
  submit: "הגיש/ה",
  force_submit: "הוגש על ידי המורה / בסיום הזמן",
};
