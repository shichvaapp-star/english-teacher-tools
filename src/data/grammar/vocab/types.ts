/** One row of a textbook vocabulary list. */
export interface VocabEntry {
  /** Textbook unit the word is taught in. */
  unit?: number;
  /** As written in the list – may be a phrase ("take part (in)") or forms ("win, won"). */
  word: string;
  /** n / v / adj / adv … (empty for phrases). */
  pos?: string;
  he?: string;
}
