// Turns generated clauses into grammar items of every exercise type.

import type { ClassGrade, LevelNumber } from "@/lib/levels";
import type { GrammarExerciseType, GrammarItem } from "@/types/grammar";
import type { Rng } from "@/lib/grammar-gen/random";
import {
  blankAnswer,
  gapped,
  makeClause,
  sentenceOf,
  verbChunk,
  wrongAux,
  wrongChunks,
  type Clause,
  type ClauseOptions,
  type Polarity,
  type Tense,
} from "@/lib/grammar-gen/clause";
import { third, ppOf } from "@/lib/grammar-gen/lexicon";

export interface GenContext {
  topicId: string;
  grade: ClassGrade;
  level: LevelNumber;
  rng: Rng;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function baseFields(ctx: GenContext, he: string, en: string, extra: Partial<GrammarItem> = {}) {
  return {
    id: `gen-${ctx.topicId}-${ctx.grade}-${ctx.level}-${ctx.rng.tag()}`,
    topicId: ctx.topicId,
    level: ctx.level,
    grade: ctx.grade,
    explanationHe: he,
    explanationEn: en,
    ...extra,
  };
}

/** Options for mcq / bank: the answer plus 2 (level 1) or 3 wrong ones. */
export function optionsWith(ctx: GenContext, answer: string, wrong: string[]): string[] | null {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const seen = new Set([norm(answer)]);
  const uniq = ctx.rng.shuffle(wrong).filter((w) => {
    const n = norm(w);
    if (!w || seen.has(n)) return false;
    seen.add(n);
    return true;
  });
  const n = ctx.level === 1 ? 2 : 3;
  if (uniq.length < 2) return null;
  return [answer, ...uniq.slice(0, n)];
}

/** The deliberately wrong words in an item (options, the find-and-fix word). */
export function wrongWords(item: GrammarItem): string[] | undefined {
  let wrong: string[] = [];
  if (item.type === "mcq") wrong = item.options.filter((o) => o !== item.answer);
  else if (item.type === "gap_bank") wrong = item.wordBank.filter((o) => o !== item.answer);
  else if (item.type === "find_fix") wrong = [item.tokens[item.wrongIndex]];
  const words = wrong.flatMap((w) => w.toLowerCase().replace(/[.,!?]/g, "").split(/\s+/)).filter(Boolean);
  return words.length ? [...new Set(words)] : undefined;
}

export function withWrongWords(item: GrammarItem | null): GrammarItem | null {
  if (!item) return null;
  const allow = wrongWords(item);
  return allow ? { ...item, allowWords: allow } : item;
}

// ── Explanations ───────────────────────────────────────────────

const TENSE_HE: Record<Tense, string> = {
  presentSimple: "הווה פשוט",
  presentProgressive: "הווה מתמשך",
  past: "עבר פשוט",
  pastProgressive: "עבר מתמשך",
  will: "עתיד (will)",
  goingTo: "עתיד (going to)",
  presentPerfect: "Present Perfect",
  usedTo: "used to",
  can: "can",
  could: "could",
  must: "must",
  should: "should",
};

const TENSE_EN: Record<Tense, string> = {
  presentSimple: "Present simple",
  presentProgressive: "Present progressive",
  past: "Past simple",
  pastProgressive: "Past progressive",
  will: "Future with will",
  goingTo: "Future with going to",
  presentPerfect: "Present perfect",
  usedTo: "used to",
  can: "can",
  could: "could",
  must: "must",
  should: "should",
};

export function explain(c: Clause): { he: string; en: string; hint?: string } {
  const ans = c.pol === "q" ? `${c.tokens[0]} … ${c.tokens.slice(1 + c.subject.text.split(" ").length).slice(0, 1).join(" ")}` : blankAnswer(c);
  const s = c.subject.text;
  const timeHe = c.time ? `"${c.time}" ← ` : "";
  const hint = c.time ? `שימו לב למילת הזמן: ${c.time}` : `הנושא: ${s} (${c.subject.pron})`;
  const v = c.verb;
  let he = "";
  let en = "";
  switch (c.tense) {
    case "presentSimple":
      if (c.pol === "aff") {
        const three = c.subject.pron === "he" || c.subject.pron === "she";
        he = three ? `${s} = ${c.subject.pron}, ולכן מוסיפים s לפועל: ${ans}.` : `עם ${s} לא מוסיפים s: ${ans}.`;
        en = three ? `${s} = ${c.subject.pron} → add -s: ${ans}.` : `With ${s} there is no -s: ${ans}.`;
      } else if (c.pol === "neg") {
        he = `שלילה בהווה פשוט: ${ans.split(" ")[0]} + צורת הבסיס (${v.base}).`;
        en = `Present simple negative: ${ans.split(" ")[0]} + base verb (${v.base}).`;
      } else {
        he = `שאלה בהווה פשוט: ${c.tokens[0]} + נושא + צורת הבסיס (${v.base}).`;
        en = `Present simple question: ${c.tokens[0]} + subject + base verb.`;
      }
      break;
    case "presentProgressive":
      he = `${timeHe}פעולה שקורית עכשיו: am / is / are + ing (${ans}).`;
      en = `Happening now: am / is / are + -ing (${ans}).`;
      break;
    case "past":
      if (c.pol === "aff") {
        he = v.past ? `${timeHe}עבר. ${v.base} הוא פועל יוצא דופן: ${ans}.` : `${timeHe}עבר: ${v.base} + ed → ${ans}.`;
        en = v.past ? `Past: ${v.base} is irregular → ${ans}.` : `Past: ${v.base} + -ed → ${ans}.`;
      } else if (c.pol === "neg") {
        he = `שלילה בעבר: didn't + צורת הבסיס (${v.base}).`;
        en = `Past negative: didn't + base verb (${v.base}).`;
      } else {
        he = `שאלה בעבר: Did + נושא + צורת הבסיס (${v.base}).`;
        en = `Past question: Did + subject + base verb.`;
      }
      break;
    case "pastProgressive":
      he = `${timeHe}פעולה שהייתה באמצע בזמן מסוים בעבר: was / were + ing (${ans}).`;
      en = `In progress at a past moment: was / were + -ing (${ans}).`;
      break;
    case "will":
      he = `${timeHe}עתיד: will / won't + צורת הבסיס (${v.base}).`;
      en = `Future: will / won't + base verb (${v.base}).`;
      break;
    case "goingTo":
      he = `${timeHe}תוכנית לעתיד: am / is / are + going to + צורת הבסיס (${v.base}).`;
      en = `Plan: am / is / are + going to + base verb.`;
      break;
    case "presentPerfect":
      he = `Present Perfect: have / has + צורת V3 (${ppOf(v)}). עם ${s} – ${c.subject.pron === "he" || c.subject.pron === "she" ? "has" : "have"}.`;
      en = `Present perfect: have / has + past participle (${ppOf(v)}).`;
      break;
    case "usedTo":
      he = c.pol === "aff" ? `הרגל בעבר: used to + צורת הבסיס (${v.base}).` : `שלילה / שאלה: did + use to (בלי d) + צורת הבסיס.`;
      en = c.pol === "aff" ? `Past habit: used to + base verb.` : `With did: use to (no -d) + base verb.`;
      break;
    default:
      he = `${c.tense} + צורת הבסיס (${v.base}) – בלי s ובלי to.`;
      en = `${c.tense} + base verb (${v.base}) – no -s, no to.`;
  }
  return { he, en, hint };
}

// ── Makers ─────────────────────────────────────────────────────

const INSTR: Partial<Record<GrammarExerciseType, string>> = {
  mcq: "בחרו את הצורה הנכונה",
  gap_bank: "בחרו מהבנק את המילים המתאימות",
  gap_type: "כתבו את הצורה הנכונה של הפועל בסוגריים",
  find_fix: "מצאו את המילה השגויה ותקנו אותה",
  transform: "שנו את המשפט לפי ההוראה",
  unscramble: "סדרו את המילים למשפט",
};

export function clauseItem(ctx: GenContext, type: GrammarExerciseType, c: Clause, contrast: Tense[] = []): GrammarItem | null {
  if (c.custom) return customItem(ctx, type, c);
  const ex = explain(c);
  const base = baseFields(ctx, ex.he, ex.en, { hintHe: ex.hint, instructionHe: INSTR[type] });
  switch (type) {
    case "mcq":
    case "gap_bank": {
      const answer = blankAnswer(c);
      const wrong = c.pol === "q" ? wrongAux(c.tense, c.subject.pron).map(cap) : wrongChunks(c, contrast);
      const options = optionsWith(ctx, answer, wrong);
      if (!options) return null;
      return type === "mcq"
        ? { ...base, type, sentence: gapped(c), options, answer }
        : { ...base, type, sentence: gapped(c), wordBank: options, answer };
    }
    case "gap_type": {
      if (c.pol === "q") return null;
      const negHint = c.pol === "neg" ? " (שלילה)" : "";
      return {
        ...base,
        hintHe: `${ex.hint ?? ""}${negHint}`.trim(),
        type,
        sentence: gapped(c),
        baseForm: c.pol === "neg" ? `not ${c.verb.base}` : c.verb.base,
        answers: [blankAnswer(c)],
      };
    }
    case "find_fix": {
      if (!c.fixes.length) return null;
      const fx = ctx.rng.pick(c.fixes);
      const tokens = [...c.tokens];
      const right = tokens[fx.index];
      tokens[fx.index] = fx.wrong;
      tokens[tokens.length - 1] += c.ending;
      const rightTok = fx.index === tokens.length - 1 ? `${right}${c.ending}` : right;
      return { ...base, type, tokens, wrongIndex: fx.index, answers: [rightTok.replace(/[.?!]$/, "")] };
    }
    case "unscramble": {
      if (c.tokens.length > 10) return null;
      const alt: string[] = [];
      if (c.pol !== "q" && c.time && c.tokens.join(" ").endsWith(c.time)) {
        const body = c.tokens.join(" ").slice(0, -c.time.length).trim();
        alt.push(`${c.time} ${body}`);
      }
      return { ...base, type, words: c.tokens, ending: c.ending, altAnswers: alt.length ? alt : undefined };
    }
    case "transform":
      return null; // built by transformItem (needs two clauses)
    default:
      return null;
  }
}

function customItem(ctx: GenContext, type: GrammarExerciseType, c: Clause): GrammarItem | null {
  const k = c.custom!;
  const base = baseFields(ctx, k.he, k.en, { hintHe: k.hint, instructionHe: INSTR[type] });
  const answer = blankAnswer(c);
  switch (type) {
    case "mcq":
    case "gap_bank": {
      const options = optionsWith(ctx, answer, k.wrong.filter((w) => !(k.alsoRight ?? []).includes(w)));
      if (!options) return null;
      return type === "mcq"
        ? { ...base, type, sentence: gapped(c), options, answer }
        : { ...base, type, sentence: gapped(c), wordBank: options, answer };
    }
    case "gap_type":
      if (!k.baseForm) return null;
      return { ...base, type, sentence: gapped(c), baseForm: k.baseForm, answers: [answer, ...(k.alsoRight ?? [])] };
    case "find_fix": {
      if (!c.fixes.length) return null;
      const fx = ctx.rng.pick(c.fixes);
      const tokens = [...c.tokens];
      const right = tokens[fx.index];
      tokens[fx.index] = fx.wrong;
      tokens[tokens.length - 1] += c.ending;
      return { ...base, type, tokens, wrongIndex: fx.index, answers: [right] };
    }
    case "unscramble":
      if (c.tokens.length > 10) return null;
      return { ...base, type, words: c.tokens, ending: c.ending };
    case "transform": {
      const target = k.neg && k.q ? (ctx.rng.chance(0.5) ? "neg" : "q") : k.neg ? "neg" : k.q ? "q" : null;
      if (!target) return null;
      const [taskEn, taskHe] = target === "neg" ? ["Make it negative.", "הפכו לשלילה"] : ["Make it a question.", "הפכו לשאלה"];
      return { ...base, type, source: sentenceOf(c), taskEn, taskHe, answers: [target === "neg" ? k.neg! : k.q!] };
    }
    default:
      return null;
  }
}

/** "Make it negative / a question" from an affirmative clause. */
export function transformItem(ctx: GenContext, tense: Tense, rng: Rng, target: "neg" | "q", opts: ClauseOptions = {}): GrammarItem | null {
  const src = makeClause(tense, "aff", rng, opts);
  // Same subject / verb / object / time in the target form.
  const restAndTime = src.tokens.slice(src.blank[1]);
  const subj = src.subject.text.split(" ");
  let answer: string;
  if (target === "neg") {
    const chunk = verbChunk(tense, "neg", src.subject.pron, src.verb);
    const t = [...subj, ...chunk, ...restAndTime];
    t[0] = cap(t[0]);
    answer = `${t.join(" ")}.`;
  } else {
    answer = questionFrom(src);
  }
  const source = sentenceOf(src);
  const ex = explain({ ...src, pol: target });
  const [taskEn, taskHe] = target === "neg" ? ["Make it negative.", "הפכו לשלילה"] : ["Make it a question.", "הפכו לשאלה"];
  // Contractions (doesn't = does not) are accepted by normalizeAnswer.
  const answers = [answer];
  return {
    ...baseFields(ctx, ex.he, ex.en, { instructionHe: INSTR.transform }),
    type: "transform",
    source,
    taskEn,
    taskHe,
    answers,
  };
}

function questionFrom(src: Clause): string {
  const p = src.subject.pron;
  const v = src.verb;
  const restAndTime = src.tokens.slice(src.blank[1]);
  const subj = src.subject.text.split(" ");
  subj[0] = src.subject.text === "I" || /^[A-Z]/.test(src.subject.text) ? subj[0] : subj[0].toLowerCase();
  const three = p === "he" || p === "she";
  const map: Record<Tense, [string, string[]]> = {
    presentSimple: [three ? "Does" : "Do", [v.base]],
    presentProgressive: [p === "I" ? "Am" : three ? "Is" : "Are", [src.tokens[src.blank[1] - 1]]],
    past: ["Did", [v.base]],
    pastProgressive: [p === "I" || three ? "Was" : "Were", [src.tokens[src.blank[1] - 1]]],
    will: ["Will", [v.base]],
    goingTo: [p === "I" ? "Am" : three ? "Is" : "Are", ["going", "to", v.base]],
    presentPerfect: [three ? "Has" : "Have", [ppOf(v)]],
    usedTo: ["Did", ["use", "to", v.base]],
    can: ["Can", [v.base]],
    could: ["Could", [v.base]],
    must: ["Must", [v.base]],
    should: ["Should", [v.base]],
  };
  const [aux, main] = map[src.tense];
  return `${[aux, ...subj, ...main, ...restAndTime].join(" ")}?`;
}

export { third };

/** Cloze text: several gapped sentences with (base form) blanks. */
export function clozeItem(ctx: GenContext, tenses: Tense[], pols: Polarity[], rng: Rng, opts: ClauseOptions = {}): GrammarItem | null {
  const parts: string[] = [];
  const blanks: { baseForm: string; answers: string[] }[] = [];
  const usedVerbs = new Set<string>();
  for (let i = 0; i < 4; i++) {
    let c: Clause | null = null;
    for (let tries = 0; tries < 10 && !c; tries++) {
      const cand = makeClause(rng.pick(tenses), rng.pick(pols.filter((p) => p !== "q")) as "aff" | "neg", rng, opts);
      if (!usedVerbs.has(cand.verb.base)) c = cand;
    }
    if (!c) return null;
    usedVerbs.add(c.verb.base);
    const before = c.tokens.slice(0, c.blank[0]).join(" ");
    const after = c.tokens.slice(c.blank[1]).join(" ");
    parts.push(`${before} {${i + 1}} ${after}${c.ending}`.replace(/\s+/g, " "));
    blanks.push({ baseForm: c.pol === "neg" ? `not ${c.verb.base}` : c.verb.base, answers: [blankAnswer(c)] });
  }
  const t = tenses.map((x) => TENSE_HE[x]).join(" / ");
  return {
    ...baseFields(ctx, `השלימו כל פועל ב${t} לפי מילות הזמן והנושא.`, `Use ${tenses.map((x) => TENSE_EN[x]).join(" / ")}: look at the time words and subjects.`, {
      instructionHe: "השלימו את הפעלים בצורה הנכונה",
    }),
    type: "cloze_text",
    title: "Fill in the verbs",
    text: parts.join(" "),
    blanks,
  };
}
