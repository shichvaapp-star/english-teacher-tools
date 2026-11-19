// Grammar exercises for printed worksheets: hand-written bank items first,
// topped up with freshly generated items (src/lib/grammar-gen).
import type { ClassGrade, LevelNumber } from "@/lib/levels";
import type { GrammarExerciseType, GrammarItem } from "@/types/grammar";
import { GRAMMAR_TOPICS, getGrammarItems } from "@/data/grammar";
import { generateItems, generatorTypes, itemKey } from "@/lib/grammar-gen";
import type { Rng } from "@/lib/grammar-gen/random";
import type { GrammarPartConfig } from "@/lib/worksheet/types";
import { splitCount } from "@/lib/worksheet/vocab";

/** Order exercise types appear on paper (easy formats first, longer ones last). */
export const GRAMMAR_TYPE_ORDER: readonly GrammarExerciseType[] = [
  "mcq",
  "gap_bank",
  "gap_type",
  "match_halves",
  "sort",
  "unscramble",
  "find_fix",
  "transform",
  "cloze_text",
  "write_own",
];

/** Most items a grammar part may ask for when a topic can generate more. */
export const GRAMMAR_MAX = 40;

/** Topics taught at this grade that have something to print at this level. */
export function grammarTopicsFor(grade: ClassGrade, level: LevelNumber) {
  return GRAMMAR_TOPICS.filter(
    (t) => t.grades[grade] !== undefined && (getGrammarItems(t.id, level, grade).length > 0 || generatorTypes(t.id, level).length > 0)
  );
}

/** Exercise types the chosen topics can produce at this grade and level. */
export function grammarTypesFor(topicIds: string[], grade: ClassGrade, level: LevelNumber): GrammarExerciseType[] {
  const set = new Set<GrammarExerciseType>();
  for (const tid of topicIds) {
    getGrammarItems(tid, level, grade).forEach((i) => set.add(i.type));
    generatorTypes(tid, level).forEach((t) => set.add(t));
  }
  return GRAMMAR_TYPE_ORDER.filter((t) => set.has(t));
}

/** How many items the chosen topics can supply (GRAMMAR_MAX when a generator can make more). */
export function grammarCapacity(cfg: GrammarPartConfig, grade: ClassGrade, level: LevelNumber): number {
  let total = 0;
  for (const tid of cfg.topicIds) {
    const gen = generatorTypes(tid, level).filter((t) => !cfg.types.length || cfg.types.includes(t));
    if (gen.length) return GRAMMAR_MAX;
    total += getGrammarItems(tid, level, grade).filter((i) => !cfg.types.length || cfg.types.includes(i.type)).length;
  }
  return Math.min(total, GRAMMAR_MAX);
}

function bankFor(tid: string, grade: ClassGrade, level: LevelNumber, types: GrammarExerciseType[]): GrammarItem[] {
  return getGrammarItems(tid, level, grade).filter((i) => !types.length || types.includes(i.type));
}

function genTypesFor(tid: string, level: LevelNumber, types: GrammarExerciseType[]): GrammarExerciseType[] {
  return generatorTypes(tid, level).filter((t) => !types.length || types.includes(t));
}

function topicItems(
  tid: string,
  want: number,
  grade: ClassGrade,
  level: LevelNumber,
  types: GrammarExerciseType[],
  rng: Rng,
  avoid: Set<string>
): GrammarItem[] {
  if (want <= 0) return [];
  const bank = rng.shuffle(bankFor(tid, grade, level, types)).filter((i) => !avoid.has(itemKey(i)));
  const genTypes = genTypesFor(tid, level, types);
  // Half hand-written (checked) items, half freshly generated, when a generator exists.
  const fixed = bank.slice(0, genTypes.length ? Math.ceil(want / 2) : want);
  fixed.forEach((i) => avoid.add(itemKey(i)));
  const generated = genTypes.length
    ? generateItems(tid, grade, level, want - fixed.length, { types: genTypes, rng, avoid })
    : [];
  generated.forEach((i) => avoid.add(itemKey(i)));
  const out = [...fixed, ...generated];
  // A generator may come up short: fill from the rest of the bank.
  for (const i of bank) {
    if (out.length >= want) break;
    if (avoid.has(itemKey(i))) continue;
    avoid.add(itemKey(i));
    out.push(i);
  }
  return out;
}

/** Groups items by exercise type (in GRAMMAR_TYPE_ORDER), keeping each group's order. */
export function orderGrammarItems(items: GrammarItem[]): GrammarItem[] {
  return GRAMMAR_TYPE_ORDER.flatMap((t) => items.filter((i) => i.type === t));
}

export function buildGrammarItems(cfg: GrammarPartConfig, grade: ClassGrade, level: LevelNumber, rng: Rng): GrammarItem[] {
  const topics = cfg.topicIds.filter((tid) => GRAMMAR_TOPICS.some((t) => t.id === tid));
  if (!topics.length || cfg.count <= 0) return [];
  const avoid = new Set<string>();
  const quotas = splitCount(cfg.count, topics.length);
  const out: GrammarItem[] = [];
  topics.forEach((tid, k) => out.push(...topicItems(tid, quotas[k], grade, level, cfg.types, rng, avoid)));
  // Topics that ran out leave a gap: let the others fill it.
  for (const tid of topics) {
    if (out.length >= cfg.count) break;
    out.push(...topicItems(tid, cfg.count - out.length, grade, level, cfg.types, rng, avoid));
  }
  return orderGrammarItems(out.slice(0, cfg.count));
}

/** Another item from the same topic and type (falls back to the other chosen types). */
export function replaceGrammarItem(
  item: GrammarItem,
  current: GrammarItem[],
  chosenTypes: GrammarExerciseType[],
  grade: ClassGrade,
  level: LevelNumber,
  rng: Rng
): GrammarItem | null {
  const avoid = new Set(current.map(itemKey));
  for (const types of [[item.type], chosenTypes]) {
    const generated = genTypesFor(item.topicId, level, types).length
      ? generateItems(item.topicId, grade, level, 1, { types: genTypesFor(item.topicId, level, types), rng, avoid })
      : [];
    if (generated[0]) return generated[0];
    const bank = rng.shuffle(bankFor(item.topicId, grade, level, types)).find((i) => !avoid.has(itemKey(i)));
    if (bank) return bank;
  }
  return null;
}
