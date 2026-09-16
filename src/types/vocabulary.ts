export type VocabBand = "Band I" | "Band II" | "Band III";

export interface VocabWord {
  id: string;
  word: string;
  hebrew: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb" | "preposition" | "phrase";
  band: VocabBand;
  exampleSentence: string;
  hebrewSentence?: string;
  definitionEn?: string;
}

export type VocabStudyMode = "flashcards" | "speed_match" | "fill_in" | "wordbank";
