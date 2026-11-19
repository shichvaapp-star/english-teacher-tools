// Vocabulary exercises for printed worksheets, built from the grade's word cards.
import type { ClassGrade, LevelNumber } from "@/lib/levels";
import { getVocabCards, type VocabCard } from "@/data/vocab/cards";
import type { Rng } from "@/lib/grammar-gen/random";
import type { VocabExerciseKind, VocabPartConfig, VocabWorksheetItem } from "@/lib/worksheet/types";

export const BLANK = "_____";

/** The word without list notes: "interested (in)" → "interested". */
export function cleanWord(word: string): string {
  return word
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The example with the word blanked out, or null when the word isn't found exactly once. */
export function blankSentence(card: Pick<VocabCard, "word" | "example">): { sentence: string; answer: string } | null {
  const word = cleanWord(card.word);
  if (!word || /[/]/.test(word) || !card.example) return null;
  const re = new RegExp(`(?<![A-Za-z'])${escapeRegExp(word)}(?![A-Za-z'])`, "gi");
  const hits = card.example.match(re);
  if (!hits || hits.length !== 1) return null;
  return { sentence: card.example.replace(re, BLANK), answer: hits[0] };
}

/** Cards available for the chosen units (all units when none are chosen). */
export function vocabPool(grade: ClassGrade, units: number[]): VocabCard[] {
  const cards = units.length ? units.flatMap((u) => getVocabCards(grade, u)) : getVocabCards(grade);
  const seen = new Set<string>();
  return cards.filter((c) => {
    const key = c.word.toLowerCase();
    if (!c.hebrew.trim() || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function canMake(kind: VocabExerciseKind, card: VocabCard): boolean {
  return kind === "gap_sentence" ? blankSentence(card) !== null : true;
}

function makeItem(
  kind: VocabExerciseKind,
  card: VocabCard,
  grade: ClassGrade,
  level: LevelNumber,
  rng: Rng
): VocabWorksheetItem | null {
  const base = { id: `${card.id}-${kind}-${rng.tag()}`, kind, word: card.word, hebrew: card.hebrew };
  switch (kind) {
    case "gap_sentence": {
      const b = blankSentence(card);
      return b ? { ...base, sentence: b.sentence, answer: b.answer } : null;
    }
    case "choose_meaning": {
      const all = getVocabCards(grade).filter((c) => c.hebrew.trim() && c.hebrew !== card.hebrew);
      const samePos = all.filter((c) => c.partOfSpeech === card.partOfSpeech);
      const picks: string[] = [];
      for (const c of [...rng.shuffle(samePos), ...rng.shuffle(all)]) {
        if (picks.length >= 3) break;
        if (!picks.includes(c.hebrew)) picks.push(c.hebrew);
      }
      if (picks.length < 3) return null;
      const options = rng.shuffle([card.hebrew, ...picks]);
      return { ...base, options, answerIndex: options.indexOf(card.hebrew) };
    }
    case "to_english": {
      const w = cleanWord(card.word);
      return level <= 2 ? { ...base, hint: `${w.charAt(0)}${"_".repeat(Math.max(3, w.length - 1))}` } : base;
    }
    default:
      return base;
  }
}

/** Splits `count` across the kinds as evenly as possible (earlier kinds get the extra). */
export function splitCount(count: number, parts: number): number[] {
  const base = Math.floor(count / parts);
  return Array.from({ length: parts }, (_, i) => base + (i < count % parts ? 1 : 0));
}

export function buildVocabItems(
  cfg: VocabPartConfig,
  grade: ClassGrade,
  level: LevelNumber,
  rng: Rng
): VocabWorksheetItem[] {
  const pool = rng.shuffle(vocabPool(grade, cfg.units));
  const kinds = cfg.types.length ? cfg.types : (["match", "to_hebrew"] as VocabExerciseKind[]);
  const quotas = splitCount(Math.min(cfg.count, pool.length), kinds.length);
  const used = new Set<string>();
  const out: VocabWorksheetItem[] = [];
  kinds.forEach((kind, k) => {
    let made = 0;
    for (const card of pool) {
      if (made >= quotas[k]) break;
      if (used.has(card.id) || !canMake(kind, card)) continue;
      const item = makeItem(kind, card, grade, level, rng);
      if (!item) continue;
      used.add(card.id);
      out.push(item);
      made++;
    }
  });
  return out;
}

/** A fresh item of the same kind with a word not already on the sheet. */
export function replaceVocabItem(
  item: VocabWorksheetItem,
  current: VocabWorksheetItem[],
  cfg: VocabPartConfig,
  grade: ClassGrade,
  level: LevelNumber,
  rng: Rng
): VocabWorksheetItem | null {
  const taken = new Set(current.map((i) => i.word.toLowerCase()));
  for (const card of rng.shuffle(vocabPool(grade, cfg.units))) {
    if (taken.has(card.word.toLowerCase()) || !canMake(item.kind, card)) continue;
    const next = makeItem(item.kind, card, grade, level, rng);
    if (next) return next;
  }
  return null;
}
