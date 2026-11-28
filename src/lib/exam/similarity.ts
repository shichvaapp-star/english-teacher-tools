// Copy detection after a lab exam: compares every pair of essays by shared
// 4-word sequences ("shingles") and by the longest run of identical words.
// Sequences taken from the topic text and sequences made only of small function
// words ("i think that it") are ignored, since everyone uses them.

import { FUNCTION_WORDS } from "@/data/vocab";
import { tokenize } from "@/lib/exam/vocab-match";

const SHINGLE = 4;

const FUNCTION_SET = new Set(FUNCTION_WORDS.map((w) => w.toLowerCase()));

export interface EssayInput {
  studentId: string;
  text: string;
}

export interface SimilarityPair {
  a: string;
  b: string;
  /** Shared shingles ÷ shingles of the shorter essay, 0..1. */
  score: number;
  sharedShingles: number;
  /** Longest run of identical consecutive words. */
  longestRun: number;
}

function shingles(tokens: string[], ignore: Set<string>): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i + SHINGLE <= tokens.length; i++) {
    const slice = tokens.slice(i, i + SHINGLE);
    if (slice.every((w) => FUNCTION_SET.has(w))) continue;
    const key = slice.join(" ");
    if (!ignore.has(key)) out.add(key);
  }
  return out;
}

/** Shingles of the topic texts – never counted as copying. */
export function ignoredShingles(promptTexts: string[]): Set<string> {
  const out = new Set<string>();
  for (const p of promptTexts) {
    const t = tokenize(p);
    for (let i = 0; i + SHINGLE <= t.length; i++) out.add(t.slice(i, i + SHINGLE).join(" "));
  }
  return out;
}

export function longestCommonRun(a: string[], b: string[]): number {
  let best = 0;
  let prev = new Array<number>(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const cur = new Array<number>(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        cur[j] = prev[j - 1] + 1;
        if (cur[j] > best) best = cur[j];
      }
    }
    prev = cur;
  }
  return best;
}

export function comparePair(
  a: EssayInput,
  b: EssayInput,
  ignore: Set<string> = new Set()
): SimilarityPair {
  const ta = tokenize(a.text);
  const tb = tokenize(b.text);
  const sa = shingles(ta, ignore);
  const sb = shingles(tb, ignore);
  let shared = 0;
  sa.forEach((s) => sb.has(s) && shared++);
  const denom = Math.min(sa.size, sb.size);
  return {
    a: a.studentId,
    b: b.studentId,
    score: denom ? shared / denom : 0,
    sharedShingles: shared,
    longestRun: longestCommonRun(ta, tb),
  };
}

/** All pairs, most similar first. */
export function compareAll(essays: EssayInput[], promptTexts: string[] = []): SimilarityPair[] {
  const ignore = ignoredShingles(promptTexts);
  const out: SimilarityPair[] = [];
  const usable = essays.filter((e) => e.text.trim());
  for (let i = 0; i < usable.length; i++) {
    for (let j = i + 1; j < usable.length; j++) out.push(comparePair(usable[i], usable[j], ignore));
  }
  return out.sort((x, y) => y.score - x.score || y.longestRun - x.longestRun);
}

/** A level for the table: high = look at it, medium = maybe. */
export function similarityLevel(p: Pick<SimilarityPair, "score" | "longestRun">): "high" | "medium" | "low" {
  if (p.score >= 0.3 || p.longestRun >= 10) return "high";
  if (p.score >= 0.12 || p.longestRun >= 6) return "medium";
  return "low";
}

/** Word indices of `text` that are part of a shingle shared with `other` (for highlighting). */
export function sharedWordMask(text: string, other: string, ignore: Set<string> = new Set()): boolean[] {
  const t = tokenize(text);
  const otherSet = shingles(tokenize(other), ignore);
  const mask = new Array<boolean>(t.length).fill(false);
  for (let i = 0; i + SHINGLE <= t.length; i++) {
    if (otherSet.has(t.slice(i, i + SHINGLE).join(" "))) {
      for (let k = i; k < i + SHINGLE; k++) mask[k] = true;
    }
  }
  return mask;
}
