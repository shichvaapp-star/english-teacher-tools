// Live "used X of 30 words" checklist for lab exams.
//
// Students only see the Hebrew. The English answers are stored as salted hashes
// of their base forms, so they can't be read from the page (F12). The student's
// text is split into words, every word is reduced to its possible base forms
// (lemmaCandidates), hashed the same way and compared.

import { lemmaCandidates } from "@/lib/vocab-check";
import type { ExamVocabHashes } from "@/types/exam";

/** cyrb53 – small, fast, synchronous string hash (not cryptographic; enough to hide answers). */
export function hashString(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export function hashForm(salt: string, form: string): string {
  return hashString(`${salt}|${form}`);
}

/** Lowercase, curly quotes → straight, single spaces, no surrounding punctuation. */
export function normalizeEnglish(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z' -]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Words of a text (lowercase, apostrophes kept inside words, hyphens split). */
export function tokenize(text: string): string[] {
  return (normalizeEnglish(text).match(/[a-z][a-z']*/g) ?? []).map((w) => w.replace(/'+$/, ""));
}

/** Base forms a teacher's word or phrase stands for. */
export function answerForms(english: string): string[] {
  const forms = new Set<string>();
  // "take off / take away" → both; "to borrow" → "borrow"; "a lot (of)" → "a lot of"
  for (const alt of english.split("/")) {
    const base = normalizeEnglish(alt.replace(/[()]/g, " ")).replace(/^to /, "");
    if (!base) continue;
    // Only the base form: the student's words are reduced to base forms instead
    // (expanding here would let "new" tick "news").
    forms.add(base);
  }
  return [...forms];
}

export function hashAnswers(
  words: { id: string; english: string }[],
  salt: string
): ExamVocabHashes[] {
  return words.map((w) => ({
    id: w.id,
    hashes: [...new Set(answerForms(w.english).map((f) => hashForm(salt, f)))],
  }));
}

const MAX_PHRASE = 4;

/** Every candidate form in the text: single words and short phrases (first/last word inflected). */
export function textForms(text: string): Set<string> {
  const tokens = tokenize(text);
  const forms = new Set<string>();
  for (let i = 0; i < tokens.length; i++) {
    for (let n = 1; n <= MAX_PHRASE && i + n <= tokens.length; n++) {
      const slice = tokens.slice(i, i + n);
      if (n === 1) {
        lemmaCandidates(slice[0]).forEach((c) => forms.add(c));
        continue;
      }
      const firsts = lemmaCandidates(slice[0]);
      const lasts = lemmaCandidates(slice[n - 1]);
      const middle = slice.slice(1, n - 1);
      for (const f of firsts) {
        forms.add([f, ...middle, slice[n - 1]].join(" "));
        for (const l of lasts) forms.add([f, ...middle, l].join(" "));
      }
      for (const l of lasts) forms.add([slice[0], ...middle, l].join(" "));
    }
  }
  return forms;
}

/** Ids of the exam words that appear in the text. */
export function matchVocab(text: string, vocab: ExamVocabHashes[], salt: string): string[] {
  const hashes = new Set<string>();
  textForms(text).forEach((f) => hashes.add(hashForm(salt, f)));
  return vocab.filter((v) => v.hashes.some((h) => hashes.has(h))).map((v) => v.id);
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/** Random salt for a new exam. */
export function newSalt(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
