// Word cards for the Vocabulary section: one per textbook-list entry, with an
// example sentence written in that grade's vocabulary. Cards are built from
// the lists (src/data/vocab/grade-*.ts) plus the examples files here, which
// follow the same order as the lists.
import type { ClassGrade } from "@/lib/levels";
import type { PartOfSpeech } from "@/types/vocabulary";
import { GRADE_VOCAB } from "@/data/vocab";
import type { VocabEntry } from "@/data/vocab/types";
import { GRADE_7_EXAMPLES } from "@/data/vocab/cards/examples-7";
import { GRADE_8_EXAMPLES } from "@/data/vocab/cards/examples-8";
import { GRADE_9_EXAMPLES } from "@/data/vocab/cards/examples-9";

export interface VocabCard {
  id: string;
  grade: ClassGrade;
  unit: number;
  word: string;
  hebrew: string;
  partOfSpeech: PartOfSpeech;
  example: string;
  allowWords?: string[];
}

/** One example per list entry, in list order: "sentence" or ["sentence", pos?, extra allowed words?]. */
export type ExampleSpec = string | [example: string, pos?: PartOfSpeech | null, allow?: string[]];

const POS: Record<string, PartOfSpeech> = {
  n: "noun",
  v: "verb",
  adj: "adjective",
  adv: "adverb",
  prep: "preposition",
  "adj, adv": "adjective",
};

const slug = (w: string) =>
  w
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function buildCards(grade: ClassGrade, list: VocabEntry[], examples: ExampleSpec[]): VocabCard[] {
  return list.map((e, i) => {
    const spec = examples[i];
    const [example, pos, allow] = typeof spec === "string" ? [spec] : spec ?? [""];
    const guessed: PartOfSpeech = e.pos ? POS[e.pos] ?? "phrase" : e.word.includes(" ") ? "phrase" : "adverb";
    return {
      id: `vc${grade}-u${e.unit ?? 0}-${slug(e.word)}-${i}`,
      grade,
      unit: e.unit ?? 1,
      word: e.word,
      hebrew: e.he ?? "",
      partOfSpeech: pos ?? guessed,
      example: example ?? "",
      ...(allow?.length ? { allowWords: allow } : {}),
    };
  });
}

const EXAMPLES: Record<ClassGrade, ExampleSpec[]> = { 7: GRADE_7_EXAMPLES, 8: GRADE_8_EXAMPLES, 9: GRADE_9_EXAMPLES };

export const VOCAB_CARDS: VocabCard[] = ([7, 8, 9] as const).flatMap((g) =>
  EXAMPLES[g].length ? buildCards(g, GRADE_VOCAB[g], EXAMPLES[g]) : []
);

export function getVocabCards(grade: ClassGrade, unit?: number): VocabCard[] {
  return VOCAB_CARDS.filter((c) => c.grade === grade && (unit === undefined || c.unit === unit));
}

/** Units that have cards for a grade, in order. */
export function gradeUnits(grade: ClassGrade): number[] {
  return [...new Set(VOCAB_CARDS.filter((c) => c.grade === grade).map((c) => c.unit))].sort((a, b) => a - b);
}
