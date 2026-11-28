// Deterministic grading of Unseen answers (no AI). Used by lab exams; open
// answers only get a suggestion and always go to the teacher for review.

import { gradeCopyAnswer } from "@/lib/copy-grading";
import type { MSUnseenQuestion } from "@/types/unseen";

export interface UnseenItemGrade {
  /** 0..1 */
  score: number;
  needsReview: boolean;
}

const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();

/** Open answer: share of the key words found (2 or more = full marks). Always marked for review. */
export function gradeOpenAnswer(answer: string, keywords: string[] = []): UnseenItemGrade {
  const text = clean(answer);
  if (!text) return { score: 0, needsReview: false };
  const hits = keywords.filter((k) => text.includes(clean(k))).length;
  const need = Math.min(2, Math.max(1, keywords.length));
  return { score: keywords.length ? Math.min(1, hits / need) : 0, needsReview: true };
}

export function gradeUnseenQuestion(q: MSUnseenQuestion, answer: number | string | undefined): UnseenItemGrade {
  if (answer === undefined || answer === "") return { score: 0, needsReview: false };
  switch (q.type) {
    case "mcq":
      return { score: typeof answer === "number" && answer === q.correctIndex ? 1 : 0, needsReview: false };
    case "copy": {
      const g = gradeCopyAnswer(String(answer), q.targetSentence);
      const score = Math.max(0, Math.min(1, g.points / 10));
      return { score, needsReview: score > 0 && score < 1 };
    }
    case "open":
      return gradeOpenAnswer(String(answer), q.keywords);
  }
}
