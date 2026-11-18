// Checks that a grammar item only uses allowed vocabulary.
// Used by the content validator (scripts/check-grammar.mjs) and to filter
// AI-generated items. The word matching itself lives in src/lib/vocab-check.ts.

import type { GrammarItem } from "@/types/grammar";

export { lemmaCandidates, findUnknownWords, allowedWordsFor } from "@/lib/vocab-check";

/** All English text a student sees in an item (except write_own, which is open). */
export function itemEnglishText(item: GrammarItem): string[] {
  const t: string[] = [];
  if (item.context) t.push(item.context);
  switch (item.type) {
    case "mcq":
      t.push(item.sentence, ...item.options);
      break;
    case "gap_bank":
      t.push(item.sentence, ...item.wordBank);
      break;
    case "gap_type":
      t.push(item.sentence, item.baseForm, ...item.answers);
      break;
    case "unscramble":
      t.push(...item.words);
      break;
    case "find_fix":
      t.push(...item.tokens, ...item.answers);
      break;
    case "transform":
      t.push(item.source, ...item.answers);
      break;
    case "sort":
      t.push(...item.entries.map((e) => e.text));
      break;
    case "match_halves":
      t.push(...item.pairs.flatMap((p) => [p.left, p.right]));
      break;
    case "cloze_text":
      t.push(item.title ?? "", item.text.replace(/\{\d+\}/g, " "));
      t.push(...item.blanks.flatMap((b) => [b.baseForm, ...b.answers]));
      break;
    case "write_own":
      break;
  }
  return t;
}
