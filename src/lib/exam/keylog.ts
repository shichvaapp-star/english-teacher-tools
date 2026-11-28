// Keystroke log for the exam replay: every change to the essay is stored as
// [time, position, deleted chars, inserted text]. Replaying the ops from an
// empty string rebuilds the essay at any moment.

import type { KeylogOp } from "@/types/exam";

/** The single edit that turns `prev` into `next` (common prefix/suffix diff). */
export function diffOp(prev: string, next: string, t: number): KeylogOp | null {
  if (prev === next) return null;
  let start = 0;
  const max = Math.min(prev.length, next.length);
  while (start < max && prev[start] === next[start]) start++;
  let endPrev = prev.length;
  let endNext = next.length;
  while (endPrev > start && endNext > start && prev[endPrev - 1] === next[endNext - 1]) {
    endPrev--;
    endNext--;
  }
  return [t, start, endPrev - start, next.slice(start, endNext)];
}

export function applyOp(text: string, op: KeylogOp): string {
  const [, pos, del, ins] = op;
  return text.slice(0, pos) + ins + text.slice(pos + del);
}

export function replay(ops: KeylogOp[], upTo = ops.length): string {
  let text = "";
  for (let i = 0; i < upTo && i < ops.length; i++) text = applyOp(text, ops[i]);
  return text;
}

export function parseOps(json: string): KeylogOp[] {
  try {
    const raw: unknown = JSON.parse(json);
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (o): o is KeylogOp =>
        Array.isArray(o) &&
        o.length === 4 &&
        typeof o[0] === "number" &&
        typeof o[1] === "number" &&
        typeof o[2] === "number" &&
        typeof o[3] === "string"
    );
  } catch {
    return [];
  }
}

export interface TypingStats {
  /** Minutes spent typing (gaps over 10 s don't count). */
  activeMinutes: number;
  totalMinutes: number;
  charsTyped: number;
  charsDeleted: number;
  /** Share of typed characters that were later deleted, 0..1. */
  deletedShare: number;
  /** Words per active minute of the final text. */
  wpm: number;
  longestPauseSec: number;
  /** Largest single insertion (chars) – big ones mean pasting/dictation. */
  biggestInsert: number;
  /** Op indices where a fast burst follows a long pause (worth a look in the replay). */
  burstsAfterPause: number[];
}

const ACTIVE_GAP_MS = 10_000;
const PAUSE_MS = 60_000;

export function typingStats(ops: KeylogOp[], finalText: string): TypingStats {
  let active = 0;
  let typed = 0;
  let deleted = 0;
  let longest = 0;
  let biggest = 0;
  const bursts: number[] = [];
  for (let i = 0; i < ops.length; i++) {
    const [t, , del, ins] = ops[i];
    typed += ins.length;
    deleted += del;
    biggest = Math.max(biggest, ins.length);
    if (i === 0) continue;
    const gap = t - ops[i - 1][0];
    if (gap < ACTIVE_GAP_MS) active += gap;
    longest = Math.max(longest, gap);
    if (gap >= PAUSE_MS) {
      // Burst: 60+ chars in the next 30 s
      let chars = 0;
      for (let j = i; j < ops.length && ops[j][0] - t < 30_000; j++) chars += ops[j][3].length;
      if (chars >= 60) bursts.push(i);
    }
  }
  const words = finalText.trim() ? finalText.trim().split(/\s+/).length : 0;
  const activeMinutes = active / 60_000;
  const totalMinutes = ops.length > 1 ? (ops[ops.length - 1][0] - ops[0][0]) / 60_000 : 0;
  return {
    activeMinutes,
    totalMinutes,
    charsTyped: typed,
    charsDeleted: deleted,
    deletedShare: typed ? deleted / typed : 0,
    wpm: activeMinutes > 0.25 ? words / activeMinutes : 0,
    longestPauseSec: Math.round(longest / 1000),
    biggestInsert: biggest,
    burstsAfterPause: bursts,
  };
}
