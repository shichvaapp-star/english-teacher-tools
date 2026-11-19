// Per-topic question generators. Each topic says which exercise types it can
// generate and builds one item at a time from the shared sentence engine
// (tense topics) or from small sentence patterns (everything else).

import type { GrammarExerciseType, GrammarItem } from "@/types/grammar";
import {
  be,
  beNeg,
  customClause,
  makeClause,
  verbChunk,
  wasWere,
  type Clause,
  type Polarity,
  type Tense,
} from "@/lib/grammar-gen/clause";
import { clauseItem, clozeItem, transformItem, type GenContext } from "@/lib/grammar-gen/items";
import {
  ADJECTIVES,
  COUNT_NOUNS,
  NOUN_SUBJECTS,
  OBJECT_PRONOUN,
  POSSESSIVE_ADJ,
  POSSESSIVE_PRON,
  PRONOUN_SUBJECTS,
  TIME,
  articleOf,
  ing,
  pastOf,
  regularPast,
  third,
  wrongComparatives,
  wrongSuperlatives,
  type Pron,
  type Subject,
} from "@/lib/grammar-gen/lexicon";

export interface TopicGenerator {
  types: GrammarExerciseType[];
  make: (ctx: GenContext, type: GrammarExerciseType) => GrammarItem | null;
}

const CLAUSE_TYPES: GrammarExerciseType[] = ["mcq", "gap_bank", "gap_type", "find_fix", "unscramble", "transform", "cloze_text"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const is3 = (p: Pron) => p === "he" || p === "she";

function pickPol(ctx: GenContext, allowed: Polarity[]): Polarity {
  const w: Record<Polarity, number> = ctx.level === 1 ? { aff: 0.6, neg: 0.25, q: 0.15 } : { aff: 0.4, neg: 0.3, q: 0.3 };
  const total = allowed.reduce((s, p) => s + w[p], 0);
  let r = ctx.rng.next() * total;
  for (const p of allowed) {
    r -= w[p];
    if (r <= 0) return p;
  }
  return allowed[0];
}

interface TenseSpec {
  tenses: Tense[];
  types?: GrammarExerciseType[];
  contrast?: Tense[];
  pols?: Polarity[];
  polFor?: Partial<Record<Tense, Polarity[]>>;
}

function tenseTopic(spec: TenseSpec): TopicGenerator {
  return {
    types: spec.types ?? CLAUSE_TYPES,
    make(ctx, type) {
      const { rng } = ctx;
      const tense = rng.pick(spec.tenses);
      const pols = spec.polFor?.[tense] ?? spec.pols ?? ["aff", "neg", "q"];
      if (type === "transform") {
        const targets = pols.filter((p) => p !== "aff") as ("neg" | "q")[];
        const target = targets.length ? rng.pick(targets) : rng.pick(["neg", "q"] as const);
        if (tense === "presentPerfect" || tense === "must") return transformItem(ctx, tense, rng, "neg");
        return transformItem(ctx, tense, rng, target);
      }
      if (type === "cloze_text") return clozeItem(ctx, spec.tenses, pols, rng);
      const pol = pickPol(ctx, pols);
      return clauseItem(ctx, type, makeClause(tense, pol, rng), spec.contrast ?? spec.tenses);
    },
  };
}

function custom(types: GrammarExerciseType[], build: (ctx: GenContext, type: GrammarExerciseType) => Clause | null): TopicGenerator {
  return {
    types,
    make(ctx, type) {
      const c = build(ctx, type);
      return c ? clauseItem(ctx, type, c) : null;
    },
  };
}

const anySubject = (ctx: GenContext): Subject => ctx.rng.pick(ctx.rng.chance(0.5) ? PRONOUN_SUBJECTS : NOUN_SUBJECTS);

// ── to be ──────────────────────────────────────────────────────

const BE_COMPLEMENTS = ["happy", "tired", "hungry", "at home", "at school", "in the park", "late", "ready", "busy", "sick", "angry", "cold", "in the garden"];

const toBe = custom(["mcq", "gap_bank", "gap_type", "find_fix", "unscramble", "transform"], (ctx) => {
  const { rng } = ctx;
  const s = anySubject(ctx);
  const past = ctx.level > 1 && rng.chance(0.4);
  const comp = rng.pick(BE_COMPLEMENTS);
  const time = past ? rng.pick(["yesterday", "last night", "last week"]) : rng.pick(["today", "now", ""]);
  const right = past ? wasWere(s.pron) : be(s.pron);
  const wrong = past ? [right === "was" ? "were" : "was", be(s.pron)] : ["am", "is", "are"].filter((x) => x !== right);
  const neg = past ? `${right}n't` : beNeg(s.pron).join(" ");
  const tail = `${comp}${time ? ` ${time}` : ""}`;
  return customClause(
    `${s.text} [${right}] ${tail}.`,
    {
      wrong,
      he: past ? `עבר של to be: I / he / she → was, you / we / they → were.` : `${s.text} = ${s.pron}, ולכן ${right}.`,
      en: past ? `Past of be: I / he / she was, you / we / they were.` : `${s.text} = ${s.pron} → ${right}.`,
      hint: `הנושא: ${s.text}`,
      baseForm: "be",
      neg: `${cap(s.text)} ${neg} ${tail}.`,
      q: `${cap(right)} ${s.text} ${tail}?`,
    },
    [[right, wrong[0]]]
  );
});

// ── there is / there are ──────────────────────────────────────

const PLACE_NOUNS: Record<string, { count: string[]; uncount: string[] }> = {
  "in the kitchen": { count: ["apple", "egg", "knife", "glass", "tomato", "potato", "chair", "window"], uncount: ["bread", "milk", "water", "juice", "sugar", "cheese"] },
  "in the garden": { count: ["tree", "bird", "dog", "chair"], uncount: [] },
  "on the table": { count: ["book", "apple", "pen", "bag", "glass", "egg", "orange", "watch", "photo", "sandwich"], uncount: ["bread", "cheese", "milk"] },
  "in my bag": { count: ["book", "pen", "apple", "orange", "sandwich", "umbrella", "watch"], uncount: ["money"] },
  "in the classroom": { count: ["chair", "window", "book", "pen", "child", "boy"], uncount: [] },
  "in the park": { count: ["tree", "bird", "dog", "child", "boy", "man", "woman", "family"], uncount: [] },
};
const NUM = ["two", "three", "four", "five", "six"];
const nounBy = (sg: string) => COUNT_NOUNS.find((n) => n.sg === sg)!;

const thereIsAre = custom(["mcq", "gap_bank", "find_fix", "unscramble", "transform"], (ctx) => {
  const { rng } = ctx;
  const place = rng.pick(Object.keys(PLACE_NOUNS));
  const { count, uncount } = PLACE_NOUNS[place];
  const past = ctx.level > 1 && rng.chance(0.3);
  const kind = uncount.length && rng.chance(0.25) ? "u" : rng.chance(0.5) ? "sg" : "pl";
  const he = past ? "עבר: There was + יחיד, There were + רבים." : "There is + יחיד / לא ספיר, There are + רבים.";
  const en = past ? "Past: There was + singular, There were + plural." : "There is + singular / uncountable, There are + plural.";
  if (kind === "u") {
    const u = rng.pick(uncount);
    const v = past ? "was" : "is";
    return customClause(`There [${v}] some ${u} ${place}.`, {
      wrong: past ? ["were", "is", "had"] : ["are", "has", "have"],
      he: `${u} – לא ספיר → ${v}. ${he}`,
      en: `${u} is uncountable → ${v}. ${en}`,
      neg: `There ${v}n't any ${u} ${place}.`,
      q: `${cap(v)} there any ${u} ${place}?`,
    }, [[v, past ? "were" : "are"]]);
  }
  const n = nounBy(rng.pick(count));
  if (kind === "sg") {
    const v = past ? "was" : "is";
    const a = articleOf(n);
    return customClause(`There [${v}] ${a} ${n.sg} ${place}.`, {
      wrong: past ? ["were", "is", "had"] : ["are", "has", "have"],
      he: `${a} ${n.sg} – יחיד → ${v}.`,
      en: `${a} ${n.sg} is singular → ${v}.`,
      neg: `There ${v}n't ${a} ${n.sg} ${place}.`,
      q: `${cap(v)} there ${a} ${n.sg} ${place}?`,
    }, [[v, past ? "were" : "are"]]);
  }
  const v = past ? "were" : "are";
  return customClause(`There [${v}] ${rng.pick(NUM)} ${n.pl} ${place}.`, {
    wrong: past ? ["was", "are", "had"] : ["is", "has", "have"],
    he: `${n.pl} – רבים → ${v}.`,
    en: `${n.pl} is plural → ${v}.`,
  }, [[v, past ? "was" : "is"]]);
});

// ── past simple vs past progressive (when …) ─────────────────

const INTERRUPTS: { s: string; p: Pron; base: string; past: string; tail: string }[] = [
  { s: "the phone", p: "he", base: "ring", past: "rang", tail: "" },
  { s: "my mom", p: "she", base: "come", past: "came", tail: "home" },
  { s: "it", p: "he", base: "start", past: "started", tail: "to rain" },
  { s: "Dan", p: "he", base: "call", past: "called", tail: "" },
  { s: "the teacher", p: "she", base: "walk", past: "walked", tail: "in" },
  { s: "the bell", p: "he", base: "ring", past: "rang", tail: "" },
  { s: "we", p: "we", base: "hear", past: "heard", tail: "a noise" },
];

const pastVsProgressive = custom(["mcq", "gap_bank", "gap_type", "find_fix"], (ctx, type) => {
  const { rng } = ctx;
  const main = makeClause("pastProgressive", "aff", rng, { time: null });
  const it = rng.pick(INTERRUPTS);
  const subj = main.subject.text;
  const chunk = main.tokens.slice(main.blank[0], main.blank[1]).join(" ");
  const rest = main.tokens.slice(main.blank[1]).join(" ");
  const tail = it.tail ? ` ${it.tail}` : "";
  const he = "פעולה ארוכה שהייתה באמצע – was / were + ing; פעולה קצרה שקטעה אותה – עבר פשוט.";
  const en = "Long action in progress: was / were + -ing; the short action that interrupts it: past simple.";
  if (type !== "find_fix" && rng.chance(0.5)) {
    return customClause(`${subj} [${chunk}] ${rest} when ${it.s} ${it.past}${tail}.`, {
      wrong: [pastOf(main.verb), `${wasWere(main.subject.pron)} ${main.verb.base}`, `${wasWere(main.subject.pron) === "was" ? "were" : "was"} ${ing(main.verb.base)}`],
      he,
      en,
      hint: `הפעולה הארוכה: ${main.verb.base}`,
      baseForm: main.verb.base,
    });
  }
  return customClause(`${subj} ${chunk} ${rest} when ${it.s} [${it.past}]${tail}.`, {
    wrong: [`${wasWere(it.p)} ${ing(it.base)}`, is3(it.p) ? third(it.base) : it.base, it.past === regularPast(it.base) ? `${wasWere(it.p)} ${it.base}` : regularPast(it.base)],
    he,
    en,
    hint: "הפעולה הקצרה שקטעה",
    baseForm: it.base,
  }, [[it.past, is3(it.p) ? third(it.base) : it.base]]);
});

// ── will vs going to ──────────────────────────────────────────

const PLANS: ((P: Subject) => string)[] = [
  (P) => `${P.text} told everyone about the trip. ${cap(subjPron(P))} [${be(P.pron)} going to] travel to Eilat next week.`,
  (P) => `${P.text} found a recipe. ${cap(subjPron(P))} [${be(P.pron)} going to] make a cake this evening.`,
  (P) => `${P.text} called the doctor. ${cap(subjPron(P))} [${be(P.pron)} going to] see her tomorrow.`,
  (P) => `${P.text} bought a new ball. ${cap(subjPron(P))} [${be(P.pron)} going to] play football after school.`,
  (P) => `${P.text} saved money for months. ${cap(subjPron(P))} [${be(P.pron)} going to] buy a new bike.`,
  (P) => `${P.text} have the tickets. ${cap(subjPron(P))} [${be(P.pron)} going to] see the game tonight.`,
  (P) => `${P.text} finished school today. ${cap(subjPron(P))} [${be(P.pron)} going to] visit ${POSSESSIVE_ADJ[P.pron]} grandparents tomorrow.`,
];
const EVIDENCE = ["Look at those clouds! It [is going to] rain.", "Watch out! You [are going to] fall!", "Our team is winning 3–0. We [are going to] win!"];
const DECISIONS = [
  "I'm hungry. I [will] make a sandwich.",
  "We don't have any milk. I [will] buy some.",
  "The dog is hungry. I [will] give it some food.",
  "Thank you! I [will] call you tomorrow.",
  "The phone is ringing. I [will] answer it.",
  "It's cold in here. I [will] close the window.",
  "You look thirsty. Wait, I [will] get you some water.",
  "Don't worry, I [will] help you with your homework.",
  "I promise I [will] call you tonight.",
  "The door is open. I [will] close it.",
];
const subjPron = (P: Subject) => (P.pron === "I" ? "I" : P.pron);

const willVsGoingTo = custom(["mcq", "gap_bank"], (ctx) => {
  const { rng } = ctx;
  const roll = rng.next();
  if (roll < 0.45) {
    const P = rng.pick(PRONOUN_SUBJECTS.filter((s) => s.pron !== "you"));
    const s = rng.pick(PLANS)({ text: cap(P.text), pron: P.pron }).replace(/^(\w)/, (m) => m.toUpperCase());
    // "have" after he / she in the ticket sentence
    const fixed = is3(P.pron) ? s.replace(" have the tickets", " has the tickets") : s;
    return customClause(fixed, {
      wrong: ["will", `${be(P.pron)} going`, "going to"],
      he: "תוכנית שכבר החלטנו עליה (יש סימן מוקדם) → be going to.",
      en: "A plan decided before → be going to.",
      hint: "האם זו תוכנית שכבר הוחלטה?",
    });
  }
  if (roll < 0.6) {
    const s = rng.pick(EVIDENCE);
    const right = s.match(/\[(.*)\]/)![1];
    return customClause(s, {
      wrong: ["will", right.replace(" going to", " going"), "going to"].filter((w) => w !== right),
      he: "רואים סימן עכשיו שמשהו עומד לקרות → be going to.",
      en: "We can see it is about to happen → be going to.",
    });
  }
  return customClause(rng.pick(DECISIONS), {
    wrong: ["am going to", "will to", "going to"],
    he: "החלטה ברגע הדיבור, הצעה או הבטחה → will.",
    en: "A decision at the moment of speaking, an offer or a promise → will.",
    hint: "האם ההחלטה נעשית עכשיו?",
  });
});

// ── first conditional / time clauses ──────────────────────────

interface Pair {
  c: [string, Pron, string, string]; // subject, pron, verb, rest
  r: [string, Pron, string, string];
  neg?: boolean;
}
const IF_PAIRS: Pair[] = [
  { c: ["the weather", "he", "be", "nice"], r: ["we", "we", "go", "to the beach"] },
  { c: ["I", "I", "see", "Dan"], r: ["I", "I", "give", "him the book"] },
  { c: ["they", "they", "win", "the game"], r: ["they", "they", "play", "in the final"] },
  { c: ["you", "you", "eat", "too much"], r: ["you", "you", "feel", "sick"] },
  { c: ["she", "she", "practice", "every day"], r: ["she", "she", "play", "better"] },
  { c: ["it", "he", "snow", "tonight"], r: ["the kids", "they", "build", "a snowman"] },
  { c: ["you", "you", "go", "to bed late"], r: ["you", "you", "be", "tired"] },
  { c: ["my parents", "they", "say", "yes"], r: ["I", "I", "buy", "a dog"] },
  { c: ["it", "he", "rain", "tomorrow"], r: ["we", "we", "stay", "at home"] },
  { c: ["it", "he", "rain", "on Friday"], r: ["they", "they", "play", "inside"] },
  { c: ["you", "you", "study", "hard"], r: ["you", "you", "pass", "the test"] },
  { c: ["I", "I", "finish", "my homework"], r: ["I", "I", "watch", "TV"] },
  { c: ["she", "she", "miss", "the bus"], r: ["she", "she", "walk", "to school"] },
  { c: ["we", "we", "have", "time"], r: ["we", "we", "visit", "the museum"] },
  { c: ["he", "he", "eat", "all the cake"], r: ["he", "he", "feel", "sick"] },
  { c: ["you", "you", "call", "me"], r: ["I", "I", "help", "you"] },
  { c: ["Dan", "he", "come", "to the party"], r: ["Noa", "she", "be", "happy"] },
  { c: ["you", "you", "hurry", "up"], r: ["you", "you", "miss", "the bus"], neg: true },
  { c: ["we", "we", "leave", "now"], r: ["we", "we", "be", "late"], neg: true },
];
const WHEN_PAIRS: Pair[] = [
  { c: ["Noa", "she", "arrive", "tomorrow"], r: ["we", "we", "go", "to the beach"] },
  { c: ["it", "he", "stop", "raining"], r: ["the kids", "they", "play", "outside"] },
  { c: ["I", "I", "finish", "this book"], r: ["I", "I", "give", "it to you"] },
  { c: ["you", "you", "see", "Tom"], r: ["you", "you", "know", "him"] },
  { c: ["we", "we", "get", "to the hotel"], r: ["we", "we", "call", "Grandma"] },
  { c: ["he", "he", "wake", "up"], r: ["he", "he", "eat", "breakfast"] },
  { c: ["I", "I", "get", "home"], r: ["I", "I", "call", "you"] },
  { c: ["we", "we", "finish", "lunch"], r: ["we", "we", "go", "to the park"] },
  { c: ["she", "she", "get", "to school"], r: ["she", "she", "send", "you a message"] },
  { c: ["the movie", "he", "end", "tonight"], r: ["we", "we", "eat", "dinner"] },
  { c: ["you", "you", "finish", "your homework"], r: ["you", "you", "play", "computer games"] },
  { c: ["they", "they", "come", "back"], r: ["they", "they", "call", "us"] },
];
const presentForm = (p: Pron, v: string, neg = false) =>
  neg ? `${is3(p) ? "doesn't" : "don't"} ${v}` : v === "be" ? be(p) : is3(p) ? third(v) : v;

function conditional(ctx: GenContext, type: GrammarExerciseType, conjs: string[], pairs: Pair[]): Clause {
  const { rng } = ctx;
  const pr = rng.pick(pairs);
  const conj = rng.pick(conjs);
  const [cs, cp, cv, crest] = pr.c;
  const [rs, , rv, rrest] = pr.r;
  const cForm = presentForm(cp, cv, pr.neg);
  const rForm = `will ${rv}`;
  const cr = crest ? ` ${crest}` : "";
  const rr = rrest ? ` ${rrest}` : "";
  const he = `${conj} + הווה פשוט, ובחלק השני will + צורת הבסיס. אחרי ${conj} לא כותבים will!`;
  const en = `${conj} + present simple, then will + base verb. No will after ${conj}!`;
  const blankCond = type === "find_fix" || rng.chance(0.5);
  if (blankCond) {
    const wrong =
      cv === "be"
        ? ["will be", "be", cForm === "is" ? "are" : "is"]
        : [`will ${cv}`, pr.neg ? `won't ${cv}` : is3(cp) ? cv : third(cv), pr.neg ? `didn't ${cv}` : regularPast(cv)];
    return customClause(`${cap(conj)} ${cs} [${cForm}]${cr}, ${rs} ${rForm}${rr}.`, {
      wrong,
      he,
      en,
      hint: `אחרי ${conj} – הווה פשוט`,
      baseForm: pr.neg ? `not ${cv}` : cv,
    }, pr.neg ? [] : [[cForm, is3(cp) ? cv : third(cv)]]);
  }
  return customClause(`${cap(conj)} ${cs} ${cForm}${cr}, ${rs} [${rForm}]${rr}.`, {
    wrong: [presentForm(pr.r[1], rv), `will ${rv === "be" ? "is" : third(rv)}`, `would ${rv}`],
    he,
    en,
    hint: "התוצאה בעתיד",
    baseForm: rv,
  }, rv === "be" ? [] : [[rv, third(rv)]]);
}

const firstConditional = custom(["mcq", "gap_bank", "gap_type", "find_fix"], (ctx, type) => conditional(ctx, type, ["if"], IF_PAIRS));
const timeClauses = custom(["mcq", "gap_bank", "gap_type", "find_fix"], (ctx, type) => conditional(ctx, type, ["when", "after", "as soon as"], WHEN_PAIRS));

// ── plurals / countable ───────────────────────────────────────

function wrongPlurals(sg: string, pl: string): string[] {
  const out = new Set([`${sg}s`, `${sg}es`, sg]);
  if (pl.endsWith("ies")) out.add(`${sg}s`);
  if (pl === "children") out.add("childs").add("childrens");
  if (pl === "people") out.add("persons").add("peoples");
  if (pl === "men") out.add("mans");
  if (pl === "women") out.add("womans");
  if (pl === "feet") out.add("foots");
  if (pl === "teeth") out.add("tooths");
  if (pl === "mice") out.add("mouses");
  if (pl.endsWith("ves")) out.add(`${sg}s`);
  out.delete(pl);
  return [...out];
}

const plurals = custom(["mcq", "gap_bank", "gap_type", "find_fix"], (ctx) => {
  const { rng } = ctx;
  if (rng.chance(0.2)) {
    const u = rng.pick(["water", "milk", "bread", "money", "rice", "juice", "homework", "music", "cheese", "sugar"]);
    return customClause(`We need some [${u}].`, {
      wrong: [`${u}s`, `a ${u}`, `many ${u}s`],
      he: `${u} – שם עצם לא ספיר: אין לו רבים ולא אומרים a.`,
      en: `${u} is uncountable: no plural, no a.`,
      baseForm: u,
    }, [[u, `${u}s`]]);
  }
  const n = rng.pick(COUNT_NOUNS);
  const tpl = rng.pick([
    (x: string) => `I can see ${rng.pick(NUM)} [${x}].`,
    (x: string) => `There are ${rng.pick(NUM)} [${x}] here.`,
    (x: string) => `We have ${rng.pick(NUM)} [${x}].`,
  ]);
  const irregular = !/^(.*)(s|es)$/.test(n.pl) || n.pl === `${n.sg.slice(0, -1)}ves`;
  return customClause(tpl(n.pl), {
    wrong: wrongPlurals(n.sg, n.pl),
    he: irregular ? `${n.sg} → ${n.pl} (רבים יוצא דופן).` : `רבים: ${n.sg} → ${n.pl}.`,
    en: `${n.sg} → ${n.pl}.`,
    hint: "יותר מאחד – רבים",
    baseForm: n.sg,
  }, [[n.pl, wrongPlurals(n.sg, n.pl)[0]]]);
});

// ── articles a / an ───────────────────────────────────────────

const ART_THINGS = ["book", "apple", "box", "watch", "toy", "knife", "egg", "orange", "umbrella", "photo", "glass", "sandwich", "bag", "pen", "tomato", "potato"];
const ART_SPECIAL: [string, string][] = [
  ["elephant", "I saw [X] elephant at the zoo."],
  ["idea", "I have [X] idea!"],
  ["hour", "We waited for [X] hour."],
  ["uniform", "She wears [X] uniform to school."],
  ["bird", "There is [X] bird in the tree."],
  ["dog", "I saw [X] dog in the park."],
];

const articles = custom(["mcq", "gap_bank", "find_fix"], (ctx) => {
  const { rng } = ctx;
  let sg: string;
  let tpl: string;
  if (rng.chance(0.35)) {
    [sg, tpl] = rng.pick(ART_SPECIAL);
  } else {
    sg = rng.pick(ART_THINGS);
    tpl = rng.pick([`This is [X] ${sg}.`, `I want [X] ${sg}.`, `She bought [X] ${sg} yesterday.`, `There is [X] ${sg} on the table.`]);
  }
  const n = nounBy(sg);
  const a = articleOf(n);
  const other = a === "a" ? "an" : "a";
  const special = n.article ? ` (${n.sg} – ${a === "an" ? "ה-h לא נשמעת" : "נשמע כמו you"})` : "";
  return customClause(tpl.replace("X", a), {
    wrong: [other, "some"],
    he: `${a} לפני ${a === "an" ? "צליל תנועה" : "צליל עיצור"}: ${a} ${n.sg}${special}.`,
    en: `${a} before a ${a === "an" ? "vowel" : "consonant"} sound: ${a} ${n.sg}.`,
    hint: `איך מתחילה המילה ${n.sg}?`,
  }, [[a, other]]);
});

// ── comparatives / superlatives ───────────────────────────────

const comparatives = custom(["mcq", "gap_bank", "gap_type", "find_fix"], (ctx) => {
  const { rng } = ctx;
  const a = rng.pick(ADJECTIVES);
  const noun = rng.pick(a.about);
  const s = `This ${noun} is [${a.comp}] than that one.`;
  return customClause(s, {
    wrong: [...wrongComparatives(a), a.base],
    he: a.comp.startsWith("more") ? `שם תואר ארוך: more + ${a.base}.` : a.base === "good" || a.base === "bad" ? `${a.base} → ${a.comp} (יוצא דופן).` : `שם תואר קצר: ${a.base} → ${a.comp}.`,
    en: a.comp.startsWith("more") ? `Long adjective: more ${a.base}.` : `${a.base} → ${a.comp}.`,
    hint: "than = השוואה בין שניים",
    baseForm: a.base,
  }, a.comp.includes(" ") ? [] : [[a.comp, a.base]]);
});

const superlatives = custom(["mcq", "gap_bank", "gap_type", "find_fix"], (ctx) => {
  const { rng } = ctx;
  const a = rng.pick(ADJECTIVES);
  const noun = rng.pick(a.about);
  const where = ["day", "summer", "winter"].includes(noun) ? "of the year" : rng.pick(["in the world", "I know"]);
  return customClause(`This is the [${a.sup}] ${noun} ${where}.`, {
    wrong: wrongSuperlatives(a),
    he: a.sup.startsWith("most") ? `שם תואר ארוך: the most + ${a.base}.` : a.base === "good" || a.base === "bad" ? `${a.base} → the ${a.sup} (יוצא דופן).` : `שם תואר קצר: the + ${a.sup}.`,
    en: a.sup.startsWith("most") ? `Long adjective: the most ${a.base}.` : `${a.base} → the ${a.sup}.`,
    hint: "the …-est = הכי",
    baseForm: a.base,
  }, a.sup.includes(" ") ? [] : [[a.sup, a.comp]]);
});

// ── pronouns / possessives ────────────────────────────────────

const OBJ_TEMPLATES: { s: string; not?: Pron }[] = [
  { s: "Please call [X] tonight." },
  { s: "Can you help [X] with this?" },
  { s: "I saw [X] in the park yesterday.", not: "I" },
  { s: "Noa sent [X] a message." },
  { s: "We waited for [X] after school.", not: "we" },
  { s: "My mom made a cake for [X]." },
  { s: "The teacher gave [X] a book." },
  { s: "Dan wants to play with [X]." },
  { s: "I bought a present for [X].", not: "I" },
  { s: "Do you remember [X]?" },
  { s: "Tom sat next to [X] in class." },
  { s: "Our grandma loves [X] very much.", not: "we" },
  { s: "Can you see [X]?" },
  { s: "Maya told [X] a funny story." },
]

const pronouns = custom(["mcq", "gap_bank", "gap_type", "find_fix"], (ctx) => {
  const { rng } = ctx;
  const t = rng.pick(OBJ_TEMPLATES);
  const p = rng.pick(PRONOUN_SUBJECTS.filter((x) => x.pron !== t.not && x.pron !== "you")).pron;
  const obj = OBJECT_PRONOUN[p];
  return customClause(t.s.replace("X", obj), {
    wrong: [p === "I" ? "I" : p, POSSESSIVE_ADJ[p], POSSESSIVE_PRON[p]].filter((w) => w !== obj),
    he: `אחרי פועל או מילת יחס משתמשים בכינוי מושא: ${p} → ${obj}.`,
    en: `After a verb or preposition use the object pronoun: ${p} → ${obj}.`,
    baseForm: p === "I" ? "I" : p,
  }, [[obj, p === "I" ? "I" : p]]);
});

const POSS_THINGS = ["bag", "book", "phone", "bike", "pen", "room", "dog", "ball", "house", "car", "cat", "hat", "computer", "desk", "pencil", "seat", "shirt", "watch"];
const possessives = custom(["mcq", "gap_bank", "gap_type", "find_fix"], (ctx) => {
  const { rng } = ctx;
  const p = rng.pick(PRONOUN_SUBJECTS).pron;
  const thing = rng.pick(POSS_THINGS);
  const adj = POSSESSIVE_ADJ[p];
  const pron = POSSESSIVE_PRON[p];
  const roll = rng.next();
  if (roll < 0.4) {
    return customClause(`This is [${adj}] ${thing}.`, {
      wrong: [pron, OBJECT_PRONOUN[p], p === "I" ? "I" : p].filter((w) => w !== adj),
      he: `לפני שם עצם: ${adj} ${thing}.`,
      en: `Before a noun: ${adj} ${thing}.`,
      baseForm: p === "I" ? "I" : p,
    }, [[adj, pron === adj ? OBJECT_PRONOUN[p] : pron]]);
  }
  if (roll < 0.8) {
    return customClause(`This ${thing} is [${pron}].`, {
      wrong: [adj, OBJECT_PRONOUN[p], `${adj}s`].filter((w) => w !== pron),
      he: `בלי שם עצם אחריו: ${pron} (= ${adj} ${thing}).`,
      en: `With no noun after it: ${pron} (= ${adj} ${thing}).`,
      baseForm: p === "I" ? "I" : p,
    }, [[pron, adj === pron ? OBJECT_PRONOUN[p] : adj]]);
  }
  const name = rng.pick(["Dan", "Noa", "Maya", "Tom", "Yael"]);
  return customClause(`This is [${name}'s] ${thing}.`, {
    wrong: [`${name}s`, name, `${name}s'`],
    he: `שייכות לאדם: ${name}'s ${thing}.`,
    en: `Possessive 's: ${name}'s ${thing}.`,
  }, [[`${name}'s`, `${name}s`]]);
});

// ── quantity ──────────────────────────────────────────────────

const QTY_THINGS = ["apple", "egg", "book", "pen", "orange", "tomato", "potato", "sandwich", "toy", "box", "photo"];
const QTY_UNCOUNT = ["water", "milk", "bread", "money", "time", "rice", "juice", "cheese", "sugar"];
const countPl = () => COUNT_NOUNS.filter((n) => QTY_THINGS.includes(n.sg));
const quantity = custom(["mcq", "gap_bank", "find_fix"], (ctx) => {
  const { rng } = ctx;
  const n = rng.pick(countPl());
  const u = rng.pick(QTY_UNCOUNT);
  const forms: (() => Clause)[] = [
    () => customClause(`How [many] ${n.pl} do you have?`, { wrong: ["much", "a lot", "any"], he: `${n.pl} – ספיר ברבים → How many.`, en: `${n.pl} is countable → How many.` }, [["many", "much"]]),
    () => customClause(`How [much] ${u} do you need?`, { wrong: ["many", "a few", "any"], he: `${u} – לא ספיר → How much.`, en: `${u} is uncountable → How much.` }, [["much", "many"]]),
    () => customClause(`There isn't [much] ${u} in the kitchen.`, { wrong: ["many", "a few", "some"], he: `${u} – לא ספיר → much.`, en: `${u} is uncountable → much.` }, [["much", "many"]]),
    () => customClause(`Are there [any] ${n.pl} in the box?`, { wrong: ["some", "much", "a"], he: "בשאלה ובשלילה → any.", en: "Questions and negatives → any." }, [["any", "some"]]),
    () => customClause(`We have [some] ${n.pl} at home.`, { wrong: ["any", "much", "a"], he: "במשפט חיובי → some.", en: "Affirmative → some." }, [["some", "any"]]),
    () => customClause(`I have [a few] ${n.pl}.`, { wrong: ["a little", "much", "a"], he: `${n.pl} – ספיר → a few.`, en: `${n.pl} is countable → a few.` }),
    () => customClause(`We need [a little] ${u}.`, { wrong: ["a few", "many", "a"], he: `${u} – לא ספיר → a little.`, en: `${u} is uncountable → a little.` }),
  ];
  return rng.pick(forms)();
});

// ── imperatives / would like ──────────────────────────────────

const IMP: [string, string][] = [
  ["open", "the window"],
  ["turn", "off the light"],
  ["sit", "down"],
  ["write", "your name"],
  ["read", "the story"],
  ["wait", "for me"],
  ["bring", "your books"],
  ["close", "the door"],
  ["wash", "the dishes"],
  ["clean", "your room"],
  ["help", "your brother"],
  ["call", "your grandma"],
  ["finish", "your homework"],
  ["listen", "to the teacher"],
  ["take", "the bus"],
  ["eat", "your lunch"],
];
const IMP_NEG: [string, string][] = [
  ["run", "in the classroom"],
  ["touch", "the dog"],
  ["shout", "in the house"],
  ["forget", "your homework"],
  ["be", "late"],
  ["use", "your phone in class"],
  ["eat", "in the library"],
  ["play", "near the road"],
  ["open", "the window"],
  ["swim", "in the sea alone"],
  ["talk", "during the test"],
];

const imperatives = custom(["mcq", "gap_bank", "gap_type", "find_fix", "unscramble", "transform"], (ctx, type) => {
  const { rng } = ctx;
  if (type !== "transform" && rng.chance(0.45)) {
    const [v, rest] = rng.pick(IMP_NEG);
    return customClause(`Please [don't ${v}] ${rest}.`, {
      wrong: [`not ${v}`, `doesn't ${v}`, `don't ${ing(v)}`],
      he: `ציווי שלילי: Don't + צורת הבסיס.`,
      en: `Negative imperative: Don't + base verb.`,
      baseForm: `not ${v}`,
    }, [[v, ing(v)]]);
  }
  const [v, rest] = rng.pick(IMP);
  return customClause(`[${cap(v)}] ${rest}, please.`, {
    wrong: [cap(third(v)), `To ${v}`, cap(ing(v))],
    he: "ציווי: צורת הבסיס בתחילת המשפט, בלי נושא.",
    en: "Imperative: base verb at the start, no subject.",
    baseForm: v,
    neg: `Don't ${v} ${rest}, please.`,
  }, [[cap(v), cap(third(v))]]);
});

const FOODS = ["some tea", "a sandwich", "some water", "some cake", "some orange juice", "an apple", "some pizza", "some milk", "a banana", "some soup", "a cup of coffee", "some ice cream", "some bread", "a salad"];
const ACTIVITIES = ["go to the park", "play chess", "watch a movie", "come to my party", "eat with us", "play football", "go to the beach", "see my new room", "read this book", "drink something"];
const wouldLike = custom(["mcq", "gap_bank", "find_fix"], (ctx) => {
  const { rng } = ctx;
  const roll = rng.next();
  if (roll < 0.35) {
    return customClause(`[Would] you like ${rng.pick(FOODS)}?`, {
      wrong: ["Do", "Are", "Will"],
      he: "הצעה מנומסת: Would you like …?",
      en: "Polite offer: Would you like …?",
    }, [["would", "do"]]);
  }
  if (roll < 0.7) {
    const s = rng.pick(PRONOUN_SUBJECTS.filter((x) => x.pron !== "you"));
    return customClause(`${s.text} [would like] ${rng.pick(FOODS)}, please.`, {
      wrong: [is3(s.pron) ? "likes" : "like", "would likes", "would to like"],
      he: "בקשה מנומסת: would like (= רוצה) – אותה צורה לכל הנושאים.",
      en: "Polite request: would like – the same for every subject.",
    }, [["like", "likes"]]);
  }
  const act = rng.pick(ACTIVITIES).split(" ");
  return customClause(`Would you like [to ${act[0]}] ${act.slice(1).join(" ")}?`, {
    wrong: [act[0], ing(act[0]), `${third(act[0])}`],
    he: "Would you like + to + צורת הבסיס.",
    en: "Would you like + to + base verb.",
  }, [["to", "for"]]);
});

// ── passive ───────────────────────────────────────────────────

const PASSIVE: { v: string; pp: string; past: string; objs: [string, boolean][]; routine?: boolean }[] = [
  { routine: true, v: "wash", pp: "washed", past: "washed", objs: [["car", false], ["dishes", true], ["windows", true]] },
  { routine: true, v: "clean", pp: "cleaned", past: "cleaned", objs: [["room", false], ["kitchen", false], ["rooms", true]] },
  { v: "paint", pp: "painted", past: "painted", objs: [["fence", false], ["house", false], ["walls", true]] },
  { v: "make", pp: "made", past: "made", objs: [["cake", false], ["sandwiches", true]] },
  { v: "write", pp: "written", past: "wrote", objs: [["letter", false], ["story", false], ["songs", true]] },
  { v: "send", pp: "sent", past: "sent", objs: [["letter", false], ["emails", true], ["message", false]] },
  { v: "take", pp: "taken", past: "took", objs: [["photo", false], ["photos", true]] },
  { routine: true, v: "cook", pp: "cooked", past: "cooked", objs: [["dinner", false], ["rice", false]] },
  { v: "fix", pp: "fixed", past: "fixed", objs: [["bike", false], ["computer", false]] },
];

const passive = custom(["mcq", "gap_bank", "gap_type", "find_fix"], (ctx) => {
  const { rng } = ctx;
  const e = rng.pick(PASSIVE);
  const [obj, pl] = rng.pick(e.objs);
  const isPast = !e.routine || rng.chance(0.5);
  const auxv = isPast ? (pl ? "were" : "was") : pl ? "are" : "is";
  const other = { was: "were", were: "was", is: "are", are: "is" }[auxv]!;
  const tail = isPast ? rng.pick(["yesterday", "last week", "by my brother", "by Noa"]) : rng.pick(["every day", "every week", "by my dad"]);
  return customClause(`The ${obj} [${auxv} ${e.pp}] ${tail}.`, {
    wrong: [`${other} ${e.pp}`, isPast ? e.past : third(e.v), `${auxv} ${e.pp === e.past ? e.v : e.past}`],
    he: `סביל: ${isPast ? "was / were" : "am / is / are"} + V3 (${e.pp}). ה${obj} לא עושה את הפעולה – עושים לו.`,
    en: `Passive: ${isPast ? "was / were" : "is / are"} + past participle (${e.pp}).`,
    hint: `${obj} – ${pl ? "רבים" : "יחיד"}`,
    baseForm: e.v,
  }, [[auxv, other]]);
});

// ── relative clauses ──────────────────────────────────────────

const REL: { rel: "who" | "which" | "where"; nouns: [string, string[]][] }[] = [
  { rel: "who", nouns: [["boy", ["lives next door", "won the game", "helped me", "sits behind me"]], ["girl", ["plays the guitar", "sits next to me", "found my phone"]], ["man", ["fixed our car", "works in the shop", "sold us the bikes"]], ["woman", ["teaches us English", "called you", "lives upstairs"]], ["doctor", ["helped my grandpa"]], ["player", ["scored the goal"]]] },
  { rel: "which", nouns: [["book", ["I read last week", "you gave me", "has a red cover"]], ["movie", ["we watched yesterday", "won the prize"]], ["song", ["she sang at the party", "we love"]], ["bike", ["my dad fixed", "I want"]], ["cake", ["my mom made"]], ["bag", ["I lost"]], ["game", ["we played last night"]], ["phone", ["you bought"]]] },
  { rel: "where", nouns: [["park", ["we play football", "we had a picnic"]], ["shop", ["my mom works", "I bought my shoes"]], ["school", ["my brother studies"]], ["beach", ["we met", "we swim every summer"]], ["house", ["my grandparents live"]], ["city", ["my dad was born"]], ["room", ["we eat dinner"]]] },
];

const relativeClauses = custom(["mcq", "gap_bank", "find_fix"], (ctx) => {
  const { rng } = ctx;
  const g = rng.pick(REL);
  const [noun, clauses] = rng.pick(g.nouns);
  const clause = rng.pick(clauses);
  const wrong = (["who", "which", "where", "what"] as const).filter((x) => x !== g.rel);
  const he = { who: "אנשים → who", which: "דברים / חיות → which", where: "מקום → where" }[g.rel];
  return customClause(`This is the ${noun} [${g.rel}] ${clause}.`, {
    wrong: [...wrong],
    alsoRight: g.rel === "where" ? [] : ["that"],
    he: `${he} (${noun}).`,
    en: `${{ who: "People → who", which: "Things → which", where: "Places → where" }[g.rel]} (${noun}).`,
    hint: `${noun} – אדם, דבר או מקום?`,
  }, [[g.rel, wrong[0]]]);
});

// ── linking words ─────────────────────────────────────────────

const CAUSE: [string, string][] = [
  ["I was tired", "I went to bed early"],
  ["the bus was late", "we walked to school"],
  ["I was thirsty", "I drank some water"],
  ["she lost her key", "she called her mom"],
  ["the room was dark", "he opened the window"],
  ["we were hungry", "we ordered a pizza"],
  ["my phone was broken", "I couldn't call you"],
  ["it was raining", "we stayed at home"],
  ["she was hungry", "she made a sandwich"],
  ["the test was easy", "everyone passed"],
  ["he missed the bus", "he was late for school"],
  ["it was hot", "we went to the beach"],
];
const CONTRAST: [string, string][] = [
  ["I like tea", "I don't like coffee"],
  ["the game was hard", "we won"],
  ["my brother is young", "he is very tall"],
  ["the shop was open", "it was empty"],
  ["she was tired", "she finished her homework"],
  ["she studied hard", "she didn't pass the test"],
  ["we ran fast", "we missed the bus"],
  ["the movie was long", "it was very interesting"],
  ["it was cold", "he didn't take a coat"],
];
const ADD: [string, string][] = [
  ["I have a dog", "I have a cat"],
  ["he plays football", "he plays basketball"],
  ["we ate pizza", "we watched a movie"],
  ["she can sing", "she can dance"],
  ["we went to the park", "we played football"],
];

const linkingWords = custom(["mcq", "gap_bank"], (ctx) => {
  const { rng } = ctx;
  const roll = rng.next();
  if (roll < 0.3) {
    const [a, b] = rng.pick(CAUSE);
    return customClause(`${cap(a)}, [so] ${b}.`, { wrong: ["because", "but"], he: "so = ולכן (תוצאה).", en: "so = result." });
  }
  if (roll < 0.6) {
    const [a, b] = rng.pick(CAUSE);
    return customClause(`${cap(b)} [because] ${a}.`, { wrong: ["so", "but"], he: "because = כי (סיבה).", en: "because = reason." });
  }
  if (roll < 0.85) {
    const [a, b] = rng.pick(CONTRAST);
    return customClause(`${cap(a)}, [but] ${b}.`, { wrong: ["because", "so"], he: "but = אבל (ניגוד).", en: "but = contrast." });
  }
  const [a, b] = rng.pick(ADD);
  return customClause(`${cap(a)} [and] ${b}.`, { wrong: ["because", "but"], he: "and = ו… (הוספה).", en: "and = adding." });
});

// ── reported speech ───────────────────────────────────────────

const BACKSHIFT: Partial<Record<Tense, Tense>> = { presentSimple: "past", presentProgressive: "pastProgressive", can: "could" };

const reportedSpeech: TopicGenerator = {
  types: ["mcq", "gap_bank", "gap_type", "transform"],
  make(ctx, type) {
    const { rng } = ctx;
    const speaker = rng.pick(NOUN_SUBJECTS.filter((s) => s.pron === "he" || s.pron === "she") as Subject[]);
    const tense = rng.pick(["presentSimple", "presentProgressive", "will", "can"] as Tense[]);
    const direct = makeClause(tense, "aff", rng, {
      subjects: [{ text: "I", pron: "I" }],
      time: tense === "presentSimple" ? rng.pick(TIME.presentSimple) : null,
    });
    const restWords = direct.tokens.slice(direct.blank[1]).map((w) => (w === "my" ? POSSESSIVE_ADJ[speaker.pron] : w));
    const rest = restWords.join(" ");
    const reportedChunk = tense === "will" ? ["would", direct.verb.base] : verbChunk(BACKSHIFT[tense]!, "aff", speaker.pron, direct.verb);
    const directText = `"${direct.tokens.join(" ")}."`;
    const he = "בדיבור עקיף הזמן זז אחורה: הווה → עבר, am / is → was, will → would, can → could, ו-I → he / she.";
    const en = "Reported speech moves the tense back: present → past, is → was, will → would, can → could; I → he / she.";
    if (type === "transform") {
      const ans = `${speaker.text} said that ${speaker.pron} ${reportedChunk.join(" ")} ${rest}.`.replace(/\s+/g, " ").replace(/^(\w)/, (m) => m.toUpperCase());
      return {
        id: `gen-${ctx.topicId}-${ctx.grade}-${ctx.level}-${rng.tag()}`,
        topicId: ctx.topicId,
        level: ctx.level,
        grade: ctx.grade,
        explanationHe: he,
        explanationEn: en,
        instructionHe: "העבירו לדיבור עקיף",
        type: "transform",
        source: `${speaker.text} said, ${directText}`,
        taskEn: `Report it: ${speaker.text} said that…`,
        taskHe: "העבירו לדיבור עקיף",
        answers: [ans, ans.replace(" said that ", " said ")],
      };
    }
    const directChunk = direct.tokens.slice(direct.blank[0], direct.blank[1]).join(" ");
    const wrong = [directChunk === "am" ? "is" : directChunk, verbChunk(tense, "aff", speaker.pron, direct.verb).join(" "), tense === "will" ? `would ${third(direct.verb.base)}` : direct.verb.base];
    const c = customClause(`${speaker.text} said that ${speaker.pron} [${reportedChunk.join(" ")}] ${rest}.`, {
      wrong,
      he,
      en,
      hint: `הוא / היא אמר/ה: ${directText}`,
      baseForm: direct.verb.base,
    });
    const item = clauseItem(ctx, type, c);
    return item ? { ...item, context: directText } : null;
  },
};

// ── adjective order ───────────────────────────────────────────

const OPINION = ["beautiful", "nice", "funny", "ugly"];
const SIZE = ["big", "small", "little", "tall"];
const AGE_THING = ["old", "new"];
const AGE_LIVING = ["old", "young"];
const COLOR = ["red", "black", "white", "blue", "green", "brown"];
const THINGS_ADJ: [string, ("o" | "s" | "a" | "c")[], boolean][] = [
  ["car", ["o", "s", "a", "c"], false],
  ["house", ["o", "s", "a", "c"], false],
  ["dog", ["o", "s", "a", "c"], true],
  ["bag", ["o", "s", "a", "c"], false],
  ["hat", ["o", "s", "a", "c"], false],
  ["man", ["o", "s", "a"], true],
];

const adjectiveOrder = custom(["mcq", "gap_bank"], (ctx) => {
  const { rng } = ctx;
  const [thing, kinds, living] = rng.pick(THINGS_ADJ);
  const n = 3;
  const chosen = rng.sample(kinds, n).sort((a, b) => "osac".indexOf(a) - "osac".indexOf(b));
  const words = chosen.map((k) => rng.pick({ o: OPINION, s: SIZE, a: living ? AGE_LIVING : AGE_THING, c: COLOR }[k]));
  const withArt = (ws: string[]) => `${/^[aeiou]/.test(ws[0]) ? "an" : "a"} ${ws.join(" ")}`;
  const right = withArt(words);
  const perms = new Set<string>();
  for (let i = 0; i < 12; i++) perms.add(withArt(rng.shuffle(words)));
  perms.delete(right);
  return customClause(`I saw [${right}] ${thing} yesterday.`, {
    wrong: [...perms],
    he: "סדר שמות תואר: דעה → גודל → גיל → צבע (beautiful big old red).",
    en: "Adjective order: opinion → size → age → colour.",
    hint: "דעה, גודל, גיל, צבע",
  });
});

// ── registry ──────────────────────────────────────────────────

export const TOPIC_GENERATORS: Record<string, TopicGenerator> = {
  "to-be": toBe,
  "there-is-are": thereIsAre,
  "present-simple": tenseTopic({ tenses: ["presentSimple"], contrast: ["presentProgressive", "past"] }),
  "present-progressive": tenseTopic({ tenses: ["presentProgressive"], contrast: ["presentSimple"] }),
  "simple-vs-progressive": tenseTopic({ tenses: ["presentSimple", "presentProgressive"] }),
  "past-simple": tenseTopic({ tenses: ["past"], contrast: ["presentSimple"] }),
  "past-progressive": tenseTopic({ tenses: ["pastProgressive"], contrast: ["presentProgressive"] }),
  "past-simple-vs-progressive": pastVsProgressive,
  "future-will": tenseTopic({ tenses: ["will"], contrast: ["past"] }),
  "going-to": tenseTopic({ tenses: ["goingTo"], contrast: ["past"] }),
  "will-vs-going-to": willVsGoingTo,
  "present-perfect": tenseTopic({ tenses: ["presentPerfect"], contrast: [] }),
  "perfect-vs-past": tenseTopic({ tenses: ["presentPerfect", "past"], contrast: [], polFor: { presentPerfect: ["neg", "q"] } }),
  "used-to": tenseTopic({ tenses: ["usedTo"], contrast: [] }),
  "can-could": tenseTopic({ tenses: ["can", "could"] }),
  "must-should": tenseTopic({ tenses: ["must", "should"], contrast: [], polFor: { must: ["aff", "neg"] } }),
  negatives: tenseTopic({ tenses: ["presentSimple", "past", "presentProgressive", "will", "can"], contrast: [], pols: ["neg"] }),
  questions: tenseTopic({ tenses: ["presentSimple", "past", "presentProgressive", "will", "can"], contrast: [], pols: ["q"], types: ["mcq", "gap_bank", "find_fix", "unscramble", "transform"] }),
  "first-conditional": firstConditional,
  "time-clauses": timeClauses,
  "plurals-countable": plurals,
  articles,
  comparatives,
  superlatives,
  pronouns,
  possessives,
  quantity,
  imperatives,
  "would-like": wouldLike,
  passive,
  "relative-clauses": relativeClauses,
  "linking-words": linkingWords,
  "reported-speech": reportedSpeech,
  "adjective-order": adjectiveOrder,
};
