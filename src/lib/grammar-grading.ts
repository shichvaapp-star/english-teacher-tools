// Deterministic grading for grammar items.
// Fast, offline and strict about form (grammar is the point), but forgiving
// about case, spacing, final punctuation and contractions (don't = do not).
// Wrong is wrong here: a one-letter difference (play / plays) is usually the
// very error being tested, so there is no fuzzy matching. Only `write_own`
// is flagged `needsReview`; the AI grader re-checks other typed answers.

import type {
  GrammarGrade,
  GrammarItem,
  GrammarResponse,
} from "@/types/grammar";

const CONTRACTIONS: [RegExp, string][] = [
  [/\bwon't\b/g, "will not"],
  [/\bcan't\b/g, "cannot"],
  [/\bshan't\b/g, "shall not"],
  [/\bain't\b/g, "is not"],
  [/n't\b/g, " not"],
  [/'m\b/g, " am"],
  [/'re\b/g, " are"],
  [/'ve\b/g, " have"],
  [/'ll\b/g, " will"],
  [/'d\b/g, " would"],
  // 's after pronouns / question words = "is" (possessive 's is left alone).
  [/\b(he|she|it|that|there|what|who|where|here|how|when)'s\b/g, "$1 is"],
];

export function normalizeAnswer(raw: string): string {
  let s = raw
    .toLowerCase()
    .replace(/[‘’ʼ`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  for (const [re, rep] of CONTRACTIONS) s = s.replace(re, rep);
  s = s
    .replace(/\bcan not\b/g, "cannot")
    .replace(/[.!?,;:"]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s;
}

export function matchesAny(typed: string, accepted: string[]): boolean {
  const t = normalizeAnswer(typed);
  if (!t) return false;
  return accepted.some((a) => normalizeAnswer(a) === t);
}

/** The answer to display after checking. */
export function expectedAnswer(item: GrammarItem): string {
  switch (item.type) {
    case "mcq":
    case "gap_bank":
      return item.answer;
    case "gap_type":
      return item.answers[0];
    case "unscramble":
      return `${item.words.join(" ")}${item.ending}`;
    case "find_fix":
      return item.tokens
        .map((t, i) => (i === item.wrongIndex ? item.answers[0] : t))
        .join(" ");
    case "transform":
      return item.answers[0];
    case "sort":
      return item.entries.map((e) => `${e.text} → ${e.bucket}`).join(" · ");
    case "match_halves":
      return item.pairs.map((p) => `${p.left} ${p.right}`).join(" · ");
    case "cloze_text":
      return item.blanks.map((b, i) => `${i + 1}. ${b.answers[0]}`).join("  ");
    case "write_own":
      return item.modelAnswers[0] ?? "";
  }
}

function result(
  item: GrammarItem,
  score: number,
  opts: { needsReview?: boolean; parts?: boolean[] } = {}
): GrammarGrade {
  return {
    score,
    isCorrect: score >= 0.999,
    needsReview: opts.needsReview ?? false,
    parts: opts.parts,
    expected: expectedAnswer(item),
  };
}

function fraction(parts: boolean[]): number {
  if (parts.length === 0) return 0;
  return parts.filter(Boolean).length / parts.length;
}

export function gradeGrammarItem(
  item: GrammarItem,
  response: GrammarResponse
): GrammarGrade {
  switch (item.type) {
    case "mcq":
    case "gap_bank": {
      if (response.type !== "mcq" && response.type !== "gap_bank") return result(item, 0);
      return result(item, response.value === item.answer ? 1 : 0);
    }

    case "gap_type": {
      if (response.type !== "gap_type") return result(item, 0);
      return result(item, matchesAny(response.value, item.answers) ? 1 : 0);
    }

    case "transform": {
      if (response.type !== "transform") return result(item, 0);
      return result(item, matchesAny(response.value, item.answers) ? 1 : 0);
    }

    case "unscramble": {
      if (response.type !== "unscramble") return result(item, 0);
      const typed = response.order.join(" ");
      const accepted = [item.words.join(" "), ...(item.altAnswers ?? [])];
      return result(item, matchesAny(typed, accepted) ? 1 : 0);
    }

    case "find_fix": {
      if (response.type !== "find_fix") return result(item, 0);
      const foundIt = response.index === item.wrongIndex;
      if (!foundIt) return result(item, 0, { parts: [false, false] });
      if (matchesAny(response.value, item.answers)) {
        return result(item, 1, { parts: [true, true] });
      }
      return result(item, 0.5, { parts: [true, false] });
    }

    case "sort": {
      if (response.type !== "sort") return result(item, 0);
      const parts = item.entries.map((e) => response.placement[e.text] === e.bucket);
      return result(item, fraction(parts), { parts });
    }

    case "match_halves": {
      if (response.type !== "match_halves") return result(item, 0);
      const parts = item.pairs.map((p) => response.matches[p.left] === p.right);
      return result(item, fraction(parts), { parts });
    }

    case "cloze_text": {
      if (response.type !== "cloze_text") return result(item, 0);
      const parts = item.blanks.map((b, i) => matchesAny(response.values[i] ?? "", b.answers));
      return result(item, fraction(parts), { parts });
    }

    case "write_own": {
      if (response.type !== "write_own") return result(item, 0);
      // Always needs the AI grader / teacher.
      return result(item, 0, { needsReview: normalizeAnswer(response.value).length > 0 });
    }
  }
}

/** Whether the student has given enough of an answer to press "Check". */
export function isResponseComplete(item: GrammarItem, response: GrammarResponse | null): boolean {
  if (!response) return false;
  switch (response.type) {
    case "mcq":
    case "gap_bank":
    case "gap_type":
    case "transform":
    case "write_own":
      return response.value.trim().length > 0;
    case "unscramble":
      return item.type === "unscramble" && response.order.length === item.words.length;
    case "find_fix":
      return response.index !== null && response.value.trim().length > 0;
    case "sort":
      return item.type === "sort" && item.entries.every((e) => response.placement[e.text]);
    case "match_halves":
      return item.type === "match_halves" && item.pairs.every((p) => response.matches[p.left]);
    case "cloze_text":
      return response.values.some((v) => v.trim().length > 0);
  }
}
