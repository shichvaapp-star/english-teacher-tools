// Sentence engine: builds a correct clause for a tense + polarity, plus the
// typical wrong forms learners produce, so every exercise type can be made
// from one clause (blank the verb, corrupt one word, scramble, transform…).

import type { Rng } from "@/lib/grammar-gen/random";
import {
  ACTION_VERBS,
  NOUN_SUBJECTS,
  POSSESSIVE_ADJ,
  PRONOUN_SUBJECTS,
  TIME,
  VERBS,
  ing,
  isIrregular,
  pastOf,
  ppOf,
  regularPast,
  third,
  type Pron,
  type Subject,
  type Verb,
} from "@/lib/grammar-gen/lexicon";

export type Tense =
  | "presentSimple"
  | "presentProgressive"
  | "past"
  | "pastProgressive"
  | "will"
  | "goingTo"
  | "presentPerfect"
  | "usedTo"
  | "can"
  | "could"
  | "must"
  | "should";

export type Polarity = "aff" | "neg" | "q";

export interface Clause {
  tense: Tense;
  pol: Polarity;
  subject: Subject;
  verb: Verb;
  /** Full sentence tokens (no final punctuation). */
  tokens: string[];
  ending: "." | "?";
  /** Token range of the part a gap item blanks: [start, end). */
  blank: [number, number];
  time?: string;
  /** Wrong single-token swaps for find-and-fix: index → wrong word. */
  fixes: { index: number; wrong: string }[];
  /** Hand-made clause (non-tense topics): its own options and explanations. */
  custom?: Custom;
}

export interface Custom {
  wrong: string[];
  he: string;
  en: string;
  hint?: string;
  /** Word shown in brackets for typed gaps, e.g. "(big)". */
  baseForm?: string;
  /** Accepted answers for "make it negative / a question" (sentence is the source). */
  neg?: string;
  q?: string;
  /** Extra accepted answers for the gap (e.g. "that" next to "which"). */
  alsoRight?: string[];
}

/**
 * A clause from a sentence with the gap in [brackets]:
 * customClause("She [is] happy today.", { wrong: ["are", "am"], … }, [["is", "are"]]).
 */
export function customClause(sentence: string, custom: Custom, fixes: [string, string][] = []): Clause {
  const m = sentence.trim().match(/^(.*?)([.?!])$/);
  const body = m ? m[1] : sentence.trim();
  const ending = (m?.[2] === "?" ? "?" : ".") as "." | "?";
  const open = body.indexOf("[");
  const close = body.indexOf("]");
  const before = body.slice(0, open).trim();
  const inside = body.slice(open + 1, close).trim();
  const after = body.slice(close + 1).trim();
  const bTok = before ? before.split(/\s+/) : [];
  const iTok = inside.split(/\s+/);
  const aTok = after ? after.split(/\s+/) : [];
  const tokens = [...bTok, ...iTok, ...aTok];
  tokens[0] = tokens[0].charAt(0).toUpperCase() + tokens[0].slice(1);
  const fx: Clause["fixes"] = [];
  for (const [right, wrong] of fixes) {
    const i = tokens.findIndex((t, k) => k >= bTok.length && k < bTok.length + iTok.length && t.toLowerCase() === right.toLowerCase());
    const j = i >= 0 ? i : tokens.findIndex((t) => t.toLowerCase() === right.toLowerCase());
    if (j >= 0) fx.push({ index: j, wrong: j === 0 ? wrong.charAt(0).toUpperCase() + wrong.slice(1) : wrong });
  }
  return {
    tense: "presentSimple",
    pol: "aff",
    subject: PRONOUN_SUBJECTS[0],
    verb: VERBS[0],
    tokens,
    ending,
    blank: [bTok.length, bTok.length + iTok.length],
    fixes: fx,
    custom,
  };
}

const is3 = (p: Pron) => p === "he" || p === "she";
const isPl = (p: Pron) => p === "we" || p === "they" || p === "you";

export function be(p: Pron): string {
  return p === "I" ? "am" : is3(p) ? "is" : "are";
}
export function beNeg(p: Pron): string[] {
  return p === "I" ? ["am", "not"] : [is3(p) ? "isn't" : "aren't"];
}
export function wasWere(p: Pron): string {
  return p === "I" || is3(p) ? "was" : "were";
}
const flipBe = (b: string) => ({ am: "is", is: "are", are: "is", was: "were", were: "was" })[b] ?? b;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Tense needs a time phrase so a wrong-tense option is clearly wrong. */
function timeFor(tense: Tense, pol: Polarity, subject: Subject, rng: Rng): string | undefined {
  switch (tense) {
    case "presentSimple":
      return rng.pick(TIME.presentSimple);
    case "presentProgressive":
      return rng.pick(TIME.presentProgressive);
    case "past":
      return rng.pick(TIME.past);
    case "pastProgressive":
      return rng.pick(TIME.pastProgressive);
    case "will":
    case "goingTo":
      return rng.pick(TIME.future);
    case "presentPerfect":
      return pol === "aff" ? rng.pick(["", "this week", "today"]) || undefined : "yet";
    case "usedTo":
      return rng.pick(TIME.usedTo);
    case "could":
      return `when ${subject.pron === "I" ? "I" : subject.pron === "you" ? "you" : subject.pron} ${wasWere(subject.pron)} young`;
    default:
      return undefined;
  }
}

/** Statement verb chunk (affirmative / negative). */
export function verbChunk(tense: Tense, pol: "aff" | "neg", p: Pron, v: Verb): string[] {
  const b = v.base;
  const neg = pol === "neg";
  switch (tense) {
    case "presentSimple":
      return neg ? [is3(p) ? "doesn't" : "don't", b] : [is3(p) ? third(b) : b];
    case "presentProgressive":
      return neg ? [...beNeg(p), ing(b)] : [be(p), ing(b)];
    case "past":
      return neg ? ["didn't", b] : [pastOf(v)];
    case "pastProgressive":
      return [neg ? `${wasWere(p)}n't` : wasWere(p), ing(b)];
    case "will":
      return [neg ? "won't" : "will", b];
    case "goingTo":
      return [...(neg ? beNeg(p) : [be(p)]), "going", "to", b];
    case "presentPerfect":
      return [neg ? (is3(p) ? "hasn't" : "haven't") : is3(p) ? "has" : "have", ppOf(v)];
    case "usedTo":
      return neg ? ["didn't", "use", "to", b] : ["used", "to", b];
    case "can":
      return [neg ? "can't" : "can", b];
    case "could":
      return [neg ? "couldn't" : "could", b];
    case "must":
      return [neg ? "mustn't" : "must", b];
    case "should":
      return [neg ? "shouldn't" : "should", b];
  }
}

/** Question: auxiliary + the verb part after the subject. */
function questionParts(tense: Tense, p: Pron, v: Verb): [string, string[]] {
  const b = v.base;
  switch (tense) {
    case "presentSimple":
      return [is3(p) ? "does" : "do", [b]];
    case "presentProgressive":
      return [be(p), [ing(b)]];
    case "past":
      return ["did", [b]];
    case "pastProgressive":
      return [wasWere(p), [ing(b)]];
    case "will":
      return ["will", [b]];
    case "goingTo":
      return [be(p), ["going", "to", b]];
    case "presentPerfect":
      return [is3(p) ? "has" : "have", [ppOf(v)]];
    case "usedTo":
      return ["did", ["use", "to", b]];
    case "can":
    case "could":
    case "must":
    case "should":
      return [tense, [b]];
  }
}

/** Wrong auxiliaries for a question (Does / Do / Is …). */
export function wrongAux(tense: Tense, p: Pron): string[] {
  const right = questionParts(tense, p, VERBS[0])[0];
  const pool: Record<Tense, string[]> = {
    presentSimple: ["do", "does", "is", "are"],
    presentProgressive: ["is", "are", "am", "does", "do"],
    past: ["was", "were", "does", "do"],
    pastProgressive: ["was", "were", "did", "is"],
    will: ["does", "is", "are", "did"],
    goingTo: ["is", "are", "am", "will", "does"],
    presentPerfect: ["has", "have", "did", "is"],
    usedTo: ["does", "was", "were", "is"],
    can: ["does", "is", "do"],
    could: ["did", "was", "does"],
    must: ["does", "is"],
    should: ["does", "is", "do"],
  };
  return pool[tense].filter((a) => a !== right && !(p === "I" && a === "am" && right === "am"));
}

/** Typical wrong verb chunks for statements (agreement, form, tense errors). */
export function wrongChunks(c: Clause, contrast: Tense[] = []): string[] {
  const { tense, pol, subject, verb: v } = c;
  if (pol === "q") return [];
  const p = subject.pron;
  const b = v.base;
  const right = verbChunk(tense, pol, p, v).join(" ");
  const out: string[] = [];
  // Agreement: the same tense with the "other" subject form.
  const other: Pron = is3(p) ? "they" : p === "I" ? "he" : "she";
  out.push(verbChunk(tense, pol, other, v).join(" "));
  // Form errors.
  const neg = pol === "neg";
  switch (tense) {
    case "presentSimple":
      out.push(neg ? `${is3(p) ? "doesn't" : "don't"} ${third(b)}` : `${be(p)} ${ing(b)}`, ing(b));
      if (neg) out.push(`${is3(p) ? "isn't" : "aren't"} ${b}`);
      break;
    case "presentProgressive":
      out.push(neg ? `don't ${ing(b)}` : `${be(p)} ${b}`, ing(b));
      break;
    case "past":
      if (neg) out.push(`didn't ${pastOf(v)}`, `don't ${b}`);
      else {
        out.push(b);
        if (isIrregular(v)) out.push(regularPast(b));
        else out.push(`${wasWere(p)} ${b}`);
      }
      break;
    case "pastProgressive":
      out.push(neg ? `didn't ${ing(b)}` : `${wasWere(p)} ${b}`, `${neg ? "don't" : be(p)} ${ing(b)}`);
      break;
    case "will":
      out.push(`${neg ? "won't" : "will"} ${third(b)}`, `${neg ? "won't" : "will"} to ${b}`);
      break;
    case "goingTo":
      out.push(`going to ${b}`, `${neg ? beNeg(p).join(" ") : be(p)} going ${b}`, `${neg ? beNeg(p).join(" ") : be(p)} going to ${ing(b)}`);
      break;
    case "presentPerfect": {
      const h = neg ? (is3(p) ? "hasn't" : "haven't") : is3(p) ? "has" : "have";
      out.push(`${h} ${b}`);
      if (pastOf(v) !== ppOf(v)) out.push(`${h} ${pastOf(v)}`);
      else out.push(`${h} ${ing(b)}`);
      break;
    }
    case "usedTo":
      out.push(neg ? `didn't used to ${b}` : `use to ${b}`, neg ? `don't use to ${b}` : `used to ${ing(b)}`);
      break;
    case "can":
    case "could":
    case "must":
    case "should":
      out.push(`${neg ? `${tense === "can" ? "can't" : `${tense}n't`}` : tense} ${third(b)}`, `${neg ? `${tense === "can" ? "can't" : `${tense}n't`}` : tense} to ${b}`);
      break;
  }
  // Tense errors – only meaningful when a time phrase pins the tense.
  if (c.time) for (const t of contrast) if (t !== tense) out.push(verbChunk(t, pol, p, v).join(" "));
  return [...new Set(out)].filter((w) => w !== right);
}

function fixesFor(tense: Tense, pol: Polarity, p: Pron, v: Verb, tokens: string[], start: number, time?: string): Clause["fixes"] {
  const b = v.base;
  const f: Clause["fixes"] = [];
  const at = (i: number, wrong: string) => {
    if (wrong && wrong.toLowerCase() !== tokens[i].toLowerCase()) f.push({ index: i, wrong });
  };
  if (pol === "q") {
    const aux = tokens[0].toLowerCase();
    const swap: Record<string, string> = { does: "do", do: "does", is: "are", are: "is", was: "were", were: "was", has: "have", have: "has", am: "is" };
    if (swap[aux]) at(0, cap(swap[aux]));
    // "Did you saw…?" – past form after did.
    const mainIdx = tokens.findIndex((t, i) => i > 0 && t === b);
    if (aux === "did" && mainIdx > 0 && pastOf(v) !== b) at(mainIdx, pastOf(v));
    if (aux === "does" && mainIdx > 0) at(mainIdx, third(b));
    return f;
  }
  const s = start;
  switch (tense) {
    case "presentSimple":
      if (pol === "aff") at(s, is3(p) ? b : third(b));
      else {
        at(s, is3(p) ? "don't" : "doesn't");
        if (is3(p)) at(s + 1, third(b));
      }
      break;
    case "presentProgressive":
      if (pol === "aff") {
        at(s, flipBe(tokens[s]));
        at(s + 1, b);
      } else at(tokens.length > s + 2 && tokens[s + 1] === "not" ? s + 2 : s + 1, b);
      break;
    case "past":
      if (pol === "aff") {
        if (isIrregular(v) && regularPast(b) !== pastOf(v)) at(s, regularPast(b));
        if (time) at(s, is3(p) ? third(b) : b);
      } else if (pastOf(v) !== b) at(s + 1, pastOf(v));
      break;
    case "pastProgressive":
      if (pol === "aff") at(s, flipBe(tokens[s]));
      else at(s, tokens[s] === "wasn't" ? "weren't" : "wasn't");
      break;
    case "will":
    case "can":
    case "could":
    case "must":
    case "should":
      at(s + 1, third(b));
      break;
    case "goingTo":
      if (pol === "aff") at(s, flipBe(tokens[s]));
      break;
    case "presentPerfect":
      at(s, { has: "have", have: "has", "hasn't": "haven't", "haven't": "hasn't" }[tokens[s]] ?? "");
      if (pastOf(v) !== ppOf(v)) at(s + 1, pastOf(v));
      break;
    case "usedTo":
      if (pol === "aff") at(s, "use");
      else at(s + 1, "used");
      break;
  }
  return f;
}

export interface ClauseOptions {
  subjects?: Subject[];
  verbs?: Verb[];
  /** Force (or forbid, with null) a time phrase. */
  time?: string | null;
}

export function makeClause(tense: Tense, pol: Polarity, rng: Rng, opts: ClauseOptions = {}): Clause {
  // State verbs (like, need…) only read naturally in simple present / past / used to.
  const stativeOk = tense === "presentSimple" || tense === "past" || tense === "usedTo";
  const verbs = opts.verbs ?? (stativeOk ? VERBS : ACTION_VERBS);
  const verb = rng.pick(verbs);
  // "Did I …?" reads oddly – questions use the other subjects.
  const pool = opts.subjects ?? (rng.chance(0.5) ? PRONOUN_SUBJECTS : NOUN_SUBJECTS);
  const subject = rng.pick(pol === "q" && pool.length > 1 ? pool.filter((s) => s.text !== "I" && s.text !== "Maya and I") : pool);
  // "my homework" follows the subject: Dana finished her homework.
  const poss = POSSESSIVE_ADJ[subject.pron];
  const rest = rng
    .pick(verb.rest)
    .split(" ")
    .map((w) => (w === "my" ? poss : w));
  const time = opts.time === null ? undefined : opts.time ?? timeFor(tense, pol, subject, rng);
  const subj = subject.text.split(" ");
  const timeTokens = time ? time.split(" ") : [];

  let tokens: string[];
  let blank: [number, number];
  if (pol === "q") {
    const [aux, main] = questionParts(tense, subject.pron, verb);
    tokens = [cap(aux), ...subj, ...main, ...rest, ...timeTokens];
    blank = [0, 1];
  } else {
    const chunk = verbChunk(tense, pol, subject.pron, verb);
    tokens = [...subj, ...chunk, ...rest, ...timeTokens];
    tokens[0] = cap(tokens[0]);
    blank = [subj.length, subj.length + chunk.length];
  }
  const ending = pol === "q" ? "?" : ".";
  return {
    tense,
    pol,
    subject,
    verb,
    tokens,
    ending,
    blank,
    time,
    fixes: fixesFor(tense, pol, subject.pron, verb, tokens, blank[0], time),
  };
}

export const sentenceOf = (c: Clause) => `${c.tokens.join(" ")}${c.ending}`;

/** Sentence with the blank range replaced by "___". */
export function gapped(c: Clause): string {
  const t = [...c.tokens.slice(0, c.blank[0]), "___", ...c.tokens.slice(c.blank[1])];
  return `${t.join(" ")}${c.ending}`;
}

export const blankAnswer = (c: Clause) => c.tokens.slice(c.blank[0], c.blank[1]).join(" ");

export { is3, isPl };
