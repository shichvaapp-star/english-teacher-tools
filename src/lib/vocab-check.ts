// Checks that English text only uses the vocabulary a grade is allowed:
// Band I + that grade's textbook list + earlier grades' lists + function words.
// Shared by every section's content validator and by the AI generation routes.

import type { ClassGrade } from "@/lib/levels";
import {
  FUNCTION_WORDS,
  ITEM_NAMES,
  GRADE_VOCAB,
  gradeVocabulary,
  vocabularyTokens,
} from "@/data/vocab";

const IRREGULAR: Record<string, string> = {
  went: "go", gone: "go", goes: "go", ate: "eat", eaten: "eat", saw: "see", seen: "see",
  came: "come", made: "make", took: "take", taken: "take", gave: "give", given: "give",
  said: "say", told: "tell", knew: "know", known: "know", thought: "think", got: "get",
  gotten: "get", bought: "buy", brought: "bring", caught: "catch", taught: "teach",
  wrote: "write", written: "write", ran: "run", swam: "swim", sang: "sing", sung: "sing",
  drank: "drink", drunk: "drink", began: "begin", begun: "begin", found: "find",
  left: "leave", felt: "feel", kept: "keep", slept: "sleep", met: "meet", sat: "sit",
  stood: "stand", understood: "understand", spoke: "speak", spoken: "speak", broke: "break",
  broken: "break", chose: "choose", chosen: "choose", drove: "drive", driven: "drive",
  rode: "ride", ridden: "ride", flew: "fly", flown: "fly", grew: "grow", grown: "grow",
  threw: "throw", thrown: "throw", wore: "wear", worn: "wear", won: "win", lost: "lose",
  paid: "pay", sold: "sell", sent: "send", spent: "spend", built: "build", heard: "hear",
  held: "hold", led: "lead", meant: "mean", fell: "fall", fallen: "fall", forgot: "forget",
  forgotten: "forget", hid: "hide", hidden: "hide", lay: "lie", lent: "lend", rang: "ring",
  rose: "rise", risen: "rise", shook: "shake", shot: "shoot", stole: "steal", woke: "wake",
  children: "child", men: "man", women: "woman", people: "person", feet: "foot",
  teeth: "tooth", mice: "mouse", better: "good", best: "good", worse: "bad", worst: "bad",
  further: "far", farther: "far", has: "have", had: "have", does: "do", did: "do",
  lying: "lie", dying: "die", tying: "tie",
  fought: "fight", drew: "draw", drawn: "draw", became: "become", bit: "bite", bitten: "bite",
  fed: "feed", lit: "light", dug: "dig", forgave: "forgive", forgiven: "forgive", swum: "swim",
  shone: "shine", sank: "sink", sunk: "sink", spun: "spin", stuck: "stick", struck: "strike",
  hung: "hang", bent: "bend", blew: "blow", blown: "blow", froze: "freeze", frozen: "freeze",
  stung: "sting", swung: "swing", tore: "tear", torn: "tear", wept: "weep", wound: "wind",
  stolen: "steal", shown: "show", sewn: "sew",   done: "do", been: "be", put: "put", cut: "cut", hit: "hit", set: "set",
};

/** Possible base forms for an inflected word (the word itself first). */
export function lemmaCandidates(word: string): string[] {
  const w = word.toLowerCase().replace(/[’']s$/, "");
  const out = new Set<string>([w]);
  if (IRREGULAR[w]) out.add(IRREGULAR[w]);
  const add = (s: string) => s.length > 1 && out.add(s);
  if (w.endsWith("ies")) add(w.slice(0, -3) + "y");
  if (w.endsWith("es")) add(w.slice(0, -2));
  if (w.endsWith("s")) add(w.slice(0, -1));
  if (w.endsWith("ied")) add(w.slice(0, -3) + "y");
  if (w.endsWith("ed")) {
    add(w.slice(0, -2));
    add(w.slice(0, -1));
    if (/(.)\1ed$/.test(w)) add(w.slice(0, -3)); // stopped → stop
  }
  if (w.endsWith("ing")) {
    add(w.slice(0, -3));
    add(w.slice(0, -3) + "e");
    if (/(.)\1ing$/.test(w)) add(w.slice(0, -4)); // running → run
  }
  if (w.endsWith("ier")) add(w.slice(0, -3) + "y");
  if (w.endsWith("iest")) add(w.slice(0, -4) + "y");
  if (w.endsWith("er")) {
    add(w.slice(0, -2));
    add(w.slice(0, -1));
    if (/(.)\1er$/.test(w)) add(w.slice(0, -3)); // bigger → big
  }
  if (w.endsWith("est")) {
    add(w.slice(0, -3));
    add(w.slice(0, -2));
    if (/(.)\1est$/.test(w)) add(w.slice(0, -4));
  }
  if (w.endsWith("ly")) add(w.slice(0, -2));
  return [...out];
}

/**
 * Returns the words in `texts` that are not covered by `allowed`
 * (a Set of lowercase base forms). Empty array = all good.
 */
export function findUnknownWords(texts: string[], allowed: Set<string>): string[] {
  const unknown = new Set<string>();
  for (const text of texts) {
    const words = text
      .replace(/\bwon[’']t\b/gi, "will not")
      .replace(/\bcan[’']t\b/gi, "can not")
      .replace(/n[’']t\b/gi, " not")
      .replace(/(^|\s)[’'](s|m|re|ve|ll|d)\b/gi, " ")
      .replace(/[’'](m|re|ve|ll|d)\b/gi, " ")
      .match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ’'-]*/g);
    for (const raw of words ?? []) {
      for (const piece of raw.split("-")) {
        const part = piece.replace(/^[’']+|[’']+$/g, "");
        if (!part) continue;
        if (lemmaCandidates(part).some((c) => allowed.has(c))) continue;
        unknown.add(part.toLowerCase());
      }
    }
  }
  return [...unknown];
}

const allowedCache = new Map<ClassGrade, string[]>();

/** Lowercase base forms a grade may use, plus optional extra words (names, item-specific exceptions). */
export function allowedWordsFor(grade: ClassGrade, extra: string[] = []): Set<string> {
  let base = allowedCache.get(grade);
  if (!base) {
    base = [
      ...[...FUNCTION_WORDS, ...ITEM_NAMES].map((x) => x.toLowerCase()),
      ...vocabularyTokens(gradeVocabulary(grade)),
    ];
    allowedCache.set(grade, base);
  }
  return new Set([...base, ...extra.map((x) => x.toLowerCase())]);
}

/**
 * A compact word list for AI prompts: the grade's textbook words (by unit, up to
 * `upToUnit` when given). Band I is assumed known and only mentioned by name.
 */
export function gradeWordListForPrompt(grade: ClassGrade, upToUnit?: number, max = 400): string {
  const words = GRADE_VOCAB[grade]
    .filter((e) => upToUnit === undefined || (e.unit ?? 1) <= upToUnit)
    .map((e) => e.word);
  return words.slice(0, max).join(", ");
}
