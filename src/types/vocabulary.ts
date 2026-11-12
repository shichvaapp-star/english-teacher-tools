export type VocabBand = "Band I" | "Band II" | "Band III";

export const PARTS_OF_SPEECH = ["noun", "verb", "adjective", "adverb", "preposition", "phrase"] as const;
export type PartOfSpeech = (typeof PARTS_OF_SPEECH)[number];

/** The value as a PartOfSpeech if it is one (e.g. from a translation API), else undefined. */
export function toPartOfSpeech(value: string | undefined | null): PartOfSpeech | undefined {
  return PARTS_OF_SPEECH.find((pos) => pos === value);
}

export interface VocabWord {
  id: string;
  word: string;
  hebrew: string;
  partOfSpeech: PartOfSpeech;
  band: VocabBand;
  exampleSentence: string;
  hebrewSentence?: string;
  definitionEn?: string;
}

export type VocabStudyMode = "flashcards" | "speed_match" | "fill_in" | "wordbank";
