// Topic variants for neighbours: with a seat plan, students sitting side by side
// or one behind the other never get the same topic.

import type { ExamSeatPlan } from "@/types/exam";

/** Variant index of a seat: (row + col) mod k – neighbours left/right/front/back always differ. */
export function seatVariantIndex(row: number, col: number, variantCount: number): number {
  if (variantCount <= 1) return 0;
  return (row + col) % variantCount;
}

/**
 * Topic per student. Seated students follow the seat pattern; everyone else
 * (no seat plan, or not seated) alternates in roster order.
 */
export function assignVariants(
  studentIds: string[],
  variantKeys: string[],
  plan?: ExamSeatPlan
): Record<string, string> {
  const out: Record<string, string> = {};
  if (variantKeys.length === 0) return out;
  plan?.seats.forEach((s) => {
    out[s.studentId] = variantKeys[seatVariantIndex(s.row, s.col, variantKeys.length)];
  });
  let i = 0;
  for (const id of studentIds) {
    if (out[id]) continue;
    out[id] = variantKeys[i % variantKeys.length];
    i++;
  }
  return out;
}

/** Pairs of students who sit next to each other (incl. diagonally), as "a|b" keys with a < b. */
export function neighbourPairs(plan?: ExamSeatPlan): Set<string> {
  const out = new Set<string>();
  if (!plan) return out;
  const at = new Map<string, string>();
  plan.seats.forEach((s) => at.set(`${s.row},${s.col}`, s.studentId));
  plan.seats.forEach((s) => {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const other = at.get(`${s.row + dr},${s.col + dc}`);
        if (other) out.add(pairKey(s.studentId, other));
      }
    }
  });
  return out;
}

export function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}
