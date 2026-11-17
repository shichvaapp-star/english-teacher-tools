// Plain-text views of grammar items and answers – for teacher turn-ins,
// printed worksheets and the AI grader.

import type { GrammarItem, GrammarResponse } from "@/types/grammar";

/** The task as one line of text (blank shown as ____). */
export function itemPromptText(item: GrammarItem): string {
  const blank = (s: string) => s.replace("___", "______");
  switch (item.type) {
    case "mcq":
      return `${blank(item.sentence)}  (${item.options.join(" / ")})`;
    case "gap_bank":
      return `${blank(item.sentence)}  [${item.wordBank.join(" / ")}]`;
    case "gap_type":
      return `${blank(item.sentence)}  (${item.baseForm})`;
    case "unscramble":
      return `${[...item.words].sort((a, b) => a.localeCompare(b)).join(" / ")}  →  ${item.ending}`;
    case "find_fix":
      return item.tokens.join(" ");
    case "transform":
      return `${item.source}  →  ${item.taskEn}`;
    case "sort":
      return `${item.buckets.join(" | ")}: ${item.entries.map((e) => e.text).join(", ")}`;
    case "match_halves":
      return item.pairs.map((p) => p.left).join(" / ");
    case "cloze_text":
      return item.text.replace(/\{(\d+)\}/g, (_, n: string) => {
        const b = item.blanks[Number(n) - 1];
        return `(${n}) ______ (${b?.baseForm ?? ""})`;
      });
    case "write_own":
      return item.taskEn;
  }
}

/** The student's answer as text. */
export function responseText(item: GrammarItem, r: GrammarResponse | null): string {
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
      return item.type === "find_fix" && r.index !== null ? `${item.tokens[r.index]} → ${r.value}` : r.value;
    case "sort":
      return Object.entries(r.placement)
        .map(([k, v]) => `${k} → ${v}`)
        .join(" · ");
    case "match_halves":
      return Object.entries(r.matches)
        .map(([k, v]) => `${k} ${v}`)
        .join(" · ");
    case "cloze_text":
      return r.values.map((v, i) => `${i + 1}. ${v}`).join("  ");
  }
}
