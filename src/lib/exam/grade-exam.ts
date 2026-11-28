// Automatic grading of lab exams (teacher side, from the answer key).
// Every item gets a score 0..1; items a computer can't judge fairly (open
// answers, free writing) are marked "needs review" for the teacher, whose
// overrides always win.

import { gradeGrammarItem, expectedAnswer } from "@/lib/grammar-grading";
import { gradeUnseenQuestion } from "@/lib/unseen-grading";
import { lemmaCandidates } from "@/lib/vocab-check";
import { answerForms, normalizeEnglish } from "@/lib/exam/vocab-match";
import { answerKey, baseItemId } from "@/lib/exam/exam-parts";
import type { GrammarItem, GrammarResponse } from "@/types/grammar";
import type { ExamAnswer, ExamPartFull, ExamPartMeta, ExamResultDoc, VocabQuestionFull } from "@/types/exam";

export interface ItemResult {
  key: string;
  itemId: string;
  baseId: string;
  number: number;
  prompt: string;
  studentAnswer: string;
  expected: string;
  /** 0..1, after the teacher's override */
  score: number;
  autoScore: number;
  weight: number;
  needsReview: boolean;
  overridden: boolean;
}

export interface PartResult {
  id: string;
  type: ExamPartMeta["type"];
  title: string;
  points: number;
  /** Points earned out of `points`. */
  earned: number;
  items: ItemResult[];
  needsReview: number;
}

export interface ExamGradeResult {
  parts: PartResult[];
  total: number;
  needsReview: number;
}

/** Typed vocabulary answer: base form, inflections and "to …" are fine. */
export function vocabTypedCorrect(typed: string, expected: string): boolean {
  const t = normalizeEnglish(typed).replace(/^to /, "");
  if (!t) return false;
  const forms = new Set(answerForms(expected));
  if (forms.has(t)) return true;
  return !t.includes(" ") && lemmaCandidates(t).some((c) => forms.has(c));
}

function gradeVocab(q: VocabQuestionFull, a: ExamAnswer | undefined): number {
  if (typeof a !== "string" || !a.trim()) return 0;
  if (q.format === "he_to_en_type") return vocabTypedCorrect(a, q.answer) ? 1 : 0;
  return a === q.answer ? 1 : 0;
}

/** A grammar response as readable text (for the results table and copy check). */
export function describeResponse(item: GrammarItem, r: GrammarResponse | undefined): string {
  if (!r) return "";
  switch (r.type) {
    case "mcq":
    case "gap_bank":
    case "gap_type":
    case "transform":
    case "write_own":
      return r.value;
    case "unscramble":
      return r.order.join(" ");
    case "find_fix":
      return r.index === null || item.type !== "find_fix" ? "" : `${item.tokens[r.index] ?? "?"} → ${r.value}`;
    case "sort":
      return Object.entries(r.placement)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" · ");
    case "match_halves":
      return Object.entries(r.matches)
        .map(([k, v]) => `${k} … ${v}`)
        .join(" · ");
    case "cloze_text":
      return r.values.map((v, i) => `(${i + 1}) ${v}`).join(" ");
  }
}

export function grammarPrompt(item: GrammarItem): string {
  switch (item.type) {
    case "mcq":
    case "gap_bank":
    case "gap_type":
      return item.sentence;
    case "unscramble":
      return `Build: ${[...item.words].sort().join(" / ")}`;
    case "find_fix":
      return item.tokens.join(" ");
    case "transform":
      return `${item.taskEn}: ${item.source}`;
    case "sort":
      return `Sort into: ${item.buckets.join(" / ")}`;
    case "match_halves":
      return "Match the halves";
    case "cloze_text":
      return item.text;
    case "write_own":
      return item.taskEn;
  }
}

const isGrammarResponse = (a: ExamAnswer | undefined): a is GrammarResponse =>
  typeof a === "object" && a !== null && "type" in a;

function itemResults(
  part: ExamPartFull,
  answers: Record<string, ExamAnswer>,
  overrides: Record<string, number>
): ItemResult[] {
  const make = (
    itemId: string,
    number: number,
    prompt: string,
    studentAnswer: string,
    expected: string,
    autoScore: number,
    weight: number,
    needsReview: boolean
  ): ItemResult => {
    const key = answerKey(part.id, itemId);
    const o = overrides[answerKey(part.id, baseItemId(itemId))];
    return {
      key,
      itemId,
      baseId: baseItemId(itemId),
      number,
      prompt,
      studentAnswer,
      expected,
      autoScore,
      score: o ?? autoScore,
      weight,
      needsReview: needsReview && o === undefined,
      overridden: o !== undefined,
    };
  };

  switch (part.type) {
    case "writing":
      return [];
    case "unseen":
      return part.questions.map((q, i) => {
        const a = answers[answerKey(part.id, q.id)];
        const raw = typeof a === "number" || typeof a === "string" ? a : undefined;
        const g = gradeUnseenQuestion(q, raw);
        const shown =
          q.type === "mcq" ? (typeof raw === "number" ? q.options?.[raw] ?? "" : "") : String(raw ?? "");
        const expected =
          q.type === "mcq"
            ? q.options?.[q.correctIndex ?? -1] ?? ""
            : q.type === "copy"
              ? q.targetSentence ?? ""
              : q.modelAnswer ?? (q.keywords ?? []).join(", ");
        return make(q.id, i + 1, q.prompt, shown, expected, g.score, q.points || 10, g.needsReview);
      });
    case "vocab":
      return part.questions.map((q, i) => {
        const a = answers[answerKey(part.id, q.id)];
        return make(q.id, i + 1, q.prompt, typeof a === "string" ? a : "", q.answer, gradeVocab(q, a), 1, false);
      });
    case "grammar":
      return part.items.map((item, i) => {
        const a = answers[answerKey(part.id, item.id)];
        const r = isGrammarResponse(a) ? a : undefined;
        const g = r ? gradeGrammarItem(item, r) : null;
        return make(
          item.id,
          i + 1,
          grammarPrompt(item),
          describeResponse(item, r),
          expectedAnswer(item),
          g?.score ?? 0,
          1,
          Boolean(g?.needsReview) || (item.type === "write_own" && Boolean(r))
        );
      });
  }
}

export function gradeExam(
  metas: ExamPartMeta[],
  fullParts: ExamPartFull[],
  answers: Record<string, ExamAnswer>,
  result?: Pick<ExamResultDoc, "overrides" | "writingScore"> | null
): ExamGradeResult {
  const overrides = result?.overrides ?? {};
  const parts = metas.map((meta): PartResult => {
    const full = fullParts.find((p) => p.id === meta.id);
    if (meta.type === "writing" || !full) {
      const s = result?.writingScore;
      return {
        id: meta.id,
        type: meta.type,
        title: meta.title,
        points: meta.points,
        earned: s === undefined ? 0 : s * meta.points,
        items: [],
        needsReview: s === undefined ? 1 : 0,
      };
    }
    const items = itemResults(full, answers, overrides);
    const weight = items.reduce((t, it) => t + it.weight, 0);
    const got = items.reduce((t, it) => t + it.score * it.weight, 0);
    return {
      id: meta.id,
      type: meta.type,
      title: meta.title,
      points: meta.points,
      earned: weight ? (got / weight) * meta.points : 0,
      items,
      needsReview: items.filter((i) => i.needsReview).length,
    };
  });
  return {
    parts,
    total: Math.round(parts.reduce((t, p) => t + p.earned, 0)),
    needsReview: parts.reduce((t, p) => t + p.needsReview, 0),
  };
}
