// Grammar question generators: fresh items for every practice round.

import type { ClassGrade, LevelNumber } from "@/lib/levels";
import type { GrammarExerciseType, GrammarItem } from "@/types/grammar";
import { Rng } from "@/lib/grammar-gen/random";
import { TOPIC_GENERATORS } from "@/lib/grammar-gen/topics";
import { withWrongWords } from "@/lib/grammar-gen/items";
import { allowedWordsFor, findUnknownWords, itemEnglishText } from "@/lib/grammar-vocab";

export { Rng };

/** Exercise types used at level 1 (the harder formats start at level 2). */
export const LEVEL1_TYPES: GrammarExerciseType[] = ["mcq", "gap_bank", "unscramble", "match_halves", "sort", "gap_type"];

export function hasGenerator(topicId: string): boolean {
  return topicId in TOPIC_GENERATORS;
}

/** Exercise types a topic can generate (at a level, when given). */
export function generatorTypes(topicId: string, level?: LevelNumber): GrammarExerciseType[] {
  const types = TOPIC_GENERATORS[topicId]?.types ?? [];
  return level === 1 ? types.filter((t) => LEVEL1_TYPES.includes(t)) : types;
}

/** Text that identifies an item's content, to avoid near-duplicates in a round. */
export function itemKey(item: GrammarItem): string {
  switch (item.type) {
    case "mcq":
    case "gap_bank":
      return `${item.sentence} → ${item.answer}`;
    case "gap_type":
      return `${item.sentence} → ${item.answers[0]}`;
    case "unscramble":
      return item.words.join(" ");
    case "find_fix":
      return item.tokens.join(" ");
    case "transform":
      return item.source;
    case "cloze_text":
      return item.text;
    default:
      return item.id;
  }
}

/**
 * Up to `count` new items for a topic. `types` limits the exercise types
 * (empty = all the topic's types); `avoid` holds item keys already used.
 */
export function generateItems(
  topicId: string,
  grade: ClassGrade,
  level: LevelNumber,
  count: number,
  opts: { types?: GrammarExerciseType[]; rng?: Rng; avoid?: Set<string> } = {}
): GrammarItem[] {
  const gen = TOPIC_GENERATORS[topicId];
  if (!gen || count <= 0) return [];
  const rng = opts.rng ?? new Rng();
  const own = generatorTypes(topicId, level);
  const types = opts.types?.length ? own.filter((t) => opts.types!.includes(t)) : own;
  if (!types.length) return [];
  const seen = new Set(opts.avoid ?? []);
  const out: GrammarItem[] = [];
  const ctx = { topicId, grade, level, rng };
  for (let tries = 0; out.length < count && tries < count * 25; tries++) {
    const item = withWrongWords(gen.make(ctx, rng.pick(types)));
    if (!item) continue;
    const key = itemKey(item);
    if (seen.has(key)) continue;
    // Levels 1–2 stay inside the grade's vocabulary (wrong forms in the options are allowed).
    if (level <= 2 && findUnknownWords(itemEnglishText(item), allowedWordsFor(grade, item.allowWords ?? [])).length) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
