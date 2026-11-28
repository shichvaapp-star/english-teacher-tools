// Exam parts: building them from the teacher's settings, making shuffled
// versions for neighbours (B, C) and stripping every answer before a part is
// stored where students can read it.

import { Rng } from "@/lib/grammar-gen/random";
import type { GrammarItem } from "@/types/grammar";
import type {
  ExamAnswer,
  ExamDoc,
  ExamKind,
  ExamPartFull,
  ExamPartMeta,
  ExamPartStudent,
  StudentUnseenQuestion,
} from "@/types/exam";

export const VARIANT_KEYS = ["A", "B", "C"] as const;

/** Exams made before parts existed are one writing part, and a test. */
export function examKind(exam: Pick<ExamDoc, "kind">): ExamKind {
  return exam.kind ?? "test";
}

export function examParts(exam: Pick<ExamDoc, "parts">): ExamPartMeta[] {
  return exam.parts?.length
    ? exam.parts
    : [{ id: "writing", type: "writing", title: "Writing", points: 100, itemCount: 1 }];
}

export const hasWritingPart = (exam: Pick<ExamDoc, "parts">) => examParts(exam).some((p) => p.type === "writing");

export const answerKey = (partId: string, itemId: string) => `${partId}|${itemId}`;

/** Item ids in versions B/C carry a suffix ("q3~B") so they shuffle differently. */
export const baseItemId = (id: string) => id.replace(/~[A-Z]$/, "");

export const seedFrom = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

// ---------------------------------------------------------------------------
// Versions for neighbours: same content, different order
// ---------------------------------------------------------------------------

export function versionOf(part: ExamPartFull, key: string): ExamPartFull {
  if (key === "A" || part.type === "writing") return part;
  const rng = new Rng(seedFrom(`${part.id}:${key}`));
  const tag = (id: string) => `${id}~${key}`;
  switch (part.type) {
    case "unseen":
      // Questions follow the passage, so keep their order; shuffle the options.
      return {
        ...part,
        questions: part.questions.map((q) => {
          if (q.type !== "mcq" || !q.options || q.correctIndex === undefined) return { ...q, id: tag(q.id) };
          const order = rng.shuffle(q.options.map((_, i) => i));
          return {
            ...q,
            id: tag(q.id),
            options: order.map((i) => q.options![i]),
            correctIndex: order.indexOf(q.correctIndex),
          };
        }),
      };
    case "vocab":
      return {
        ...part,
        questions: rng.shuffle(part.questions).map((q) => ({
          ...q,
          id: tag(q.id),
          ...(q.options ? { options: rng.shuffle(q.options) } : {}),
        })),
      };
    case "grammar":
      // New ids make the exercise components shuffle the options differently too.
      return { ...part, items: rng.shuffle(part.items).map((it) => ({ ...it, id: tag(it.id) }) as GrammarItem) };
  }
}

// ---------------------------------------------------------------------------
// Stripping answers (what students may read)
// ---------------------------------------------------------------------------

export function stripGrammarItem(item: GrammarItem): GrammarItem {
  const base = {
    ...item,
    explanationHe: "",
    explanationEn: "",
    hintHe: undefined,
    trapId: undefined,
    vocabTags: undefined,
    allowWords: undefined,
  };
  const rng = new Rng(seedFrom(item.id));
  switch (item.type) {
    case "mcq":
      return { ...base, type: "mcq", sentence: item.sentence, options: item.options, answer: "" };
    case "gap_bank":
      return { ...base, type: "gap_bank", sentence: item.sentence, wordBank: item.wordBank, answer: "" };
    case "gap_type":
      return { ...base, type: "gap_type", sentence: item.sentence, baseForm: item.baseForm, answers: [] };
    case "unscramble":
      // The words themselves are the task; only their order is the answer.
      return { ...base, type: "unscramble", words: rng.shuffle(item.words), ending: item.ending, altAnswers: undefined };
    case "find_fix":
      return { ...base, type: "find_fix", tokens: item.tokens, wrongIndex: -1, answers: [] };
    case "transform":
      return { ...base, type: "transform", source: item.source, taskEn: item.taskEn, taskHe: item.taskHe, answers: [] };
    case "sort":
      return {
        ...base,
        type: "sort",
        buckets: item.buckets,
        entries: rng.shuffle(item.entries).map((e) => ({ text: e.text, bucket: "" })),
      };
    case "match_halves": {
      const rights = rng.shuffle(item.pairs.map((p) => p.right));
      return { ...base, type: "match_halves", pairs: item.pairs.map((p, i) => ({ left: p.left, right: rights[i] })) };
    }
    case "cloze_text":
      return {
        ...base,
        type: "cloze_text",
        title: item.title,
        text: item.text,
        blanks: item.blanks.map((b) => ({ baseForm: b.baseForm, answers: [] })),
      };
    case "write_own":
      return { ...base, type: "write_own", taskEn: item.taskEn, taskHe: item.taskHe, modelAnswers: [] };
  }
}

export function stripPart(part: ExamPartFull): ExamPartStudent {
  switch (part.type) {
    case "writing":
      return part;
    case "unseen":
      return {
        ...part,
        questions: part.questions.map(
          (q): StudentUnseenQuestion => ({
            id: q.id,
            number: q.number,
            paragraphIndex: q.paragraphIndex,
            linesHint: q.linesHint,
            type: q.type,
            prompt: q.prompt,
            options: q.options,
            points: q.points,
          })
        ),
      };
    case "vocab":
      return {
        ...part,
        questions: part.questions.map((q) => ({
          id: q.id,
          format: q.format,
          prompt: q.prompt,
          ...(q.options ? { options: q.options } : {}),
        })),
      };
    case "grammar":
      return { ...part, items: part.items.map(stripGrammarItem) };
  }
}

// ---------------------------------------------------------------------------
// Answers
// ---------------------------------------------------------------------------

/** Item ids of a (student or full) part, in display order. */
export function partItemIds(part: ExamPartStudent | ExamPartFull): string[] {
  switch (part.type) {
    case "writing":
      return [];
    case "unseen":
    case "vocab":
      return part.questions.map((q) => q.id);
    case "grammar":
      return part.items.map((i) => i.id);
  }
}

export function isAnswered(a: ExamAnswer | undefined): boolean {
  if (a === undefined || a === null) return false;
  if (typeof a === "number") return a >= 0;
  if (typeof a === "string") return a.trim().length > 0;
  switch (a.type) {
    case "mcq":
    case "gap_bank":
    case "gap_type":
    case "transform":
    case "write_own":
      return a.value.trim().length > 0;
    case "unscramble":
      return a.order.length > 0;
    case "find_fix":
      return a.index !== null;
    case "sort":
      return Object.keys(a.placement).length > 0;
    case "match_halves":
      return Object.keys(a.matches).length > 0;
    case "cloze_text":
      return a.values.some((v) => v.trim());
  }
}

/** How many items of a part the student answered. */
export function answeredCount(part: ExamPartStudent, answers: Record<string, ExamAnswer>): number {
  return partItemIds(part).filter((id) => isAnswered(answers[answerKey(part.id, id)])).length;
}
