// Shared between the grammar AI grading route and the client:
// request/response shapes and a plain-text description of an answer.

import type { GrammarItem, GrammarResponse } from "@/types/grammar";
import { expectedAnswer } from "@/lib/grammar-grading";

/** Types whose typed answers the AI grader re-checks. */
export const AI_GRADED_TYPES = ["gap_type", "transform", "find_fix", "cloze_text", "write_own"] as const;

export interface GrammarAiRequestEntry {
  itemId: string;
  response: GrammarResponse;
}

export interface GrammarAiRequest {
  topicId: string;
  level: 1 | 2 | 3;
  entries: GrammarAiRequestEntry[];
}

export interface GrammarAiItemResult {
  itemId: string;
  /** 0..1 */
  score: number;
  feedbackHe: string;
  feedbackEn: string;
}

export interface GrammarAiResponse {
  success: boolean;
  results: GrammarAiItemResult[];
  reason?: string;
}

/** Task / key / student answer as plain text for the grading prompt. */
export function describeForGrader(
  item: GrammarItem,
  response: GrammarResponse
): { task: string; key: string; student: string } | null {
  switch (item.type) {
    case "gap_type":
      if (response.type !== "gap_type") return null;
      return {
        task: `Fill the blank with the correct form of "${item.baseForm}": ${item.sentence}`,
        key: item.answers.join(" | "),
        student: response.value,
      };
    case "transform":
      if (response.type !== "transform") return null;
      return {
        task: `${item.taskEn} Sentence: "${item.source}"`,
        key: item.answers.join(" | "),
        student: response.value,
      };
    case "find_fix":
      if (response.type !== "find_fix" || response.index === null) return null;
      return {
        task: `Find the wrong word and correct it: "${item.tokens.join(" ")}"`,
        key: `"${item.tokens[item.wrongIndex]}" → ${item.answers.join(" | ")}`,
        student: `"${item.tokens[response.index]}" → ${response.value}`,
      };
    case "cloze_text":
      if (response.type !== "cloze_text") return null;
      return {
        task: `Complete the text (verb in brackets for each blank): ${item.text}`,
        key: item.blanks.map((b, i) => `{${i + 1}} (${b.baseForm}): ${b.answers.join(" | ")}`).join("; "),
        student: item.blanks.map((_, i) => `{${i + 1}}: ${response.values[i] ?? ""}`).join("; "),
      };
    case "write_own":
      if (response.type !== "write_own") return null;
      return {
        task: `${item.taskEn}`,
        key: `Model answer (any correct answer that does the task is fine): ${expectedAnswer(item)}`,
        student: response.value,
      };
    default:
      return null;
  }
}

/** Runtime check for the response object sent by the client. */
export function isGrammarResponse(v: unknown): v is GrammarResponse {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  switch (r.type) {
    case "gap_type":
    case "transform":
    case "write_own":
    case "mcq":
    case "gap_bank":
      return typeof r.value === "string" && r.value.length <= 600;
    case "find_fix":
      return (r.index === null || typeof r.index === "number") && typeof r.value === "string" && r.value.length <= 100;
    case "cloze_text":
      return Array.isArray(r.values) && r.values.length <= 20 && r.values.every((x) => typeof x === "string" && x.length <= 100);
    case "unscramble":
      return Array.isArray(r.order) && r.order.every((x) => typeof x === "string");
    case "sort":
    case "match_halves":
      return typeof r.placement === "object" || typeof r.matches === "object";
    default:
      return false;
  }
}
