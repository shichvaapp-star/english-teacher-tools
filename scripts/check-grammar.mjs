// Validates the grammar content bank (src/data/grammar).
// Runs the TypeScript data directly (Node strips types); "@/..." and
// extensionless imports are resolved by the small hook below.
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

registerHooks({
  resolve(specifier, context, nextResolve) {
    let target = null;
    if (specifier.startsWith("@/")) target = path.join(root, "src", specifier.slice(2));
    else if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) {
      target = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }
    if (target) {
      for (const cand of [target, `${target}.ts`, `${target}.tsx`, path.join(target, "index.ts")]) {
        if (existsSync(cand) && !cand.endsWith(path.sep)) {
          try {
            if (path.extname(cand)) return nextResolve(pathToFileURL(cand).href, context);
          } catch {
            /* try next */
          }
        }
      }
    }
    return nextResolve(specifier, context);
  },
});

const { GRAMMAR_TOPICS, GRAMMAR_ITEMS } = await import(pathToFileURL(path.join(root, "src/data/grammar/index.ts")).href);
const vocab = await import(pathToFileURL(path.join(root, "src/data/grammar/vocab/index.ts")).href);
const { findUnknownWords } = await import(pathToFileURL(path.join(root, "src/lib/grammar-vocab.ts")).href);
const { gradeGrammarItem, normalizeAnswer } = await import(
  pathToFileURL(path.join(root, "src/lib/grammar-grading.ts")).href
);

// Minimum items per topic per level (raise as content grows).
const MIN_ITEMS_PER_LEVEL = 12;
const LEVEL1_ALLOWED = new Set(["mcq", "gap_bank", "unscramble", "match_halves", "sort", "gap_type"]);

const errors = [];
const warn = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const hasHebrew = (s) => typeof s === "string" && /[֐-׿]/.test(s);

// ── Topics ──
const topicIds = new Set();
for (const t of GRAMMAR_TOPICS) {
  if (topicIds.has(t.id)) err(t.id, "duplicate topic id");
  topicIds.add(t.id);
  if (!hasHebrew(t.titleHe)) err(t.id, "titleHe missing Hebrew");
  if (!t.bandRefs?.length) err(t.id, "no bandRefs");
  if (!Object.keys(t.grades ?? {}).length) err(t.id, "no grades");
  for (const lvl of [1, 2, 3]) {
    const card = t.rule?.[lvl];
    if (!card) { err(t.id, `missing rule card for level ${lvl}`); continue; }
    if (!card.points?.length) err(t.id, `L${lvl} no rule points`);
    if (card.points?.length > 4) err(t.id, `L${lvl} too many rule boxes (max 4)`);
    for (const [k, pt] of (card.points ?? []).entries()) {
      const where = `${t.id} L${lvl} box ${k + 1}`;
      if (!hasHebrew(pt.he)) err(where, "he title missing Hebrew");
      if (!pt.en?.trim()) err(where, "en title missing");
      if (pt.he.length > 60 || pt.en.length > 60) err(where, "title too long (max 60 chars)");
      if (!pt.examples?.length) err(where, "no examples");
      for (const ex of pt.examples ?? []) {
        if (hasHebrew(ex)) err(where, `example contains Hebrew: ${ex}`);
        if ((ex.match(/\*\*/g) ?? []).length % 2) err(where, `unbalanced ** in: ${ex}`);
      }
    }
    if (!card.form?.length) err(t.id, `L${lvl} form table empty`);
  }
  const trapIds = new Set();
  for (const tr of t.traps ?? []) {
    if (trapIds.has(tr.id)) err(t.id, `duplicate trap ${tr.id}`);
    trapIds.add(tr.id);
    if (!hasHebrew(tr.whyHe)) err(t.id, `trap ${tr.id} whyHe not Hebrew`);
  }
  t._trapIds = trapIds;
}

// ── Vocabulary helpers ──
const { itemEnglishText: itemEnglishTextOf } = await import(pathToFileURL(path.join(root, "src/lib/grammar-vocab.ts")).href);
const baseAllowed = [...vocab.FUNCTION_WORDS, ...vocab.ITEM_NAMES].map((x) => x.toLowerCase());
const allowedCache = new Map();
function allowedFor(grade, extra = []) {
  if (!allowedCache.has(grade)) {
    allowedCache.set(grade, [...baseAllowed, ...vocab.vocabularyTokens(vocab.gradeVocabulary(grade))]);
  }
  return new Set([...allowedCache.get(grade), ...extra.map((x) => x.toLowerCase())]);
}
let missingGrade = 0;
const ungradedUnknown = new Map();
const gradesWithoutList = new Set();

// ── Items ──
const itemIds = new Set();
const counts = {};
const bodyOf = (i) => JSON.stringify({ ...i, id: undefined });
const seenBodies = new Map();

function correctResponse(i) {
  switch (i.type) {
    case "mcq": case "gap_bank": return { type: i.type, value: i.answer };
    case "gap_type": case "transform": return { type: i.type, value: i.answers[0] };
    case "write_own": return null;
    case "unscramble": return { type: "unscramble", order: [...i.words] };
    case "find_fix": return { type: "find_fix", index: i.wrongIndex, value: i.answers[0] };
    case "sort": return { type: "sort", placement: Object.fromEntries(i.entries.map((e) => [e.text, e.bucket])) };
    case "match_halves": return { type: "match_halves", matches: Object.fromEntries(i.pairs.map((p) => [p.left, p.right])) };
    case "cloze_text": return { type: "cloze_text", values: i.blanks.map((b) => b.answers[0]) };
    default: return null;
  }
}

for (const i of GRAMMAR_ITEMS) {
  const w = i.id ?? "(no id)";
  if (itemIds.has(i.id)) err(w, "duplicate item id");
  itemIds.add(i.id);
  const topic = GRAMMAR_TOPICS.find((t) => t.id === i.topicId);
  if (!topic) err(w, `unknown topicId ${i.topicId}`);
  if (![1, 2, 3].includes(i.level)) err(w, "bad level");
  if (!hasHebrew(i.explanationHe)) err(w, "explanationHe missing Hebrew");
  if (!i.explanationEn?.trim()) err(w, "explanationEn missing");
  if (i.trapId && topic && !topic._trapIds.has(i.trapId)) err(w, `unknown trapId ${i.trapId}`);
  if (i.level === 1 && !LEVEL1_ALLOWED.has(i.type)) err(w, `type ${i.type} not allowed at level 1`);
  if (i.type === "write_own" && i.level !== 3) err(w, "write_own is level 3 only");

  const body = bodyOf(i);
  if (seenBodies.has(body)) err(w, `duplicate content of ${seenBodies.get(body)}`);
  seenBodies.set(body, w);

  switch (i.type) {
    case "mcq":
    case "gap_bank": {
      const opts = i.type === "mcq" ? i.options : i.wordBank;
      if ((i.sentence.match(/___/g) ?? []).length !== 1) err(w, "sentence needs exactly one ___");
      if (opts.filter((o) => o === i.answer).length !== 1) err(w, "answer must appear exactly once in options");
      if (new Set(opts.map(normalizeAnswer)).size !== opts.length) err(w, "options not distinct after normalizing");
      if (opts.length < 2) err(w, "need at least 2 options");
      break;
    }
    case "gap_type":
      if ((i.sentence.match(/___/g) ?? []).length !== 1) err(w, "sentence needs exactly one ___");
      if (!i.answers.length) err(w, "no answers");
      if (!i.baseForm) err(w, "no baseForm");
      break;
    case "unscramble":
      if (i.words.length < 3) err(w, "too few words");
      break;
    case "find_fix":
      if (i.wrongIndex < 0 || i.wrongIndex >= i.tokens.length) err(w, "wrongIndex out of range");
      if (!i.answers.length) err(w, "no answers");
      if (i.answers.some((a) => normalizeAnswer(a) === normalizeAnswer(i.tokens[i.wrongIndex]))) err(w, "correction equals the wrong token");
      // The correction replaces only the clicked word – the result must not repeat a word
      // ("going to to", "There is has").
      for (const ans of i.answers) {
        const words = i.tokens
          .map((t, k) => (k === i.wrongIndex ? ans : t))
          .join(" ")
          .toLowerCase()
          .replace(/[^a-z' ]/g, " ")
          .split(/\s+/)
          .filter(Boolean);
        const dup = words.find((x, k) => k > 0 && x === words[k - 1]);
        if (dup) err(w, `correction "${ans}" gives a repeated word: ${dup}`);
      }
      break;
    case "transform":
      if (!i.answers.length) err(w, "no answers");
      if (!hasHebrew(i.taskHe)) err(w, "taskHe missing Hebrew");
      break;
    case "sort":
      for (const e of i.entries) if (!i.buckets.includes(e.bucket)) err(w, `entry "${e.text}" has unknown bucket`);
      if (new Set(i.entries.map((e) => e.text)).size !== i.entries.length) err(w, "duplicate sort entries");
      break;
    case "match_halves":
      if (new Set(i.pairs.map((p) => p.left)).size !== i.pairs.length) err(w, "duplicate left halves");
      if (new Set(i.pairs.map((p) => p.right)).size !== i.pairs.length) err(w, "duplicate right halves");
      break;
    case "cloze_text": {
      const nums = [...i.text.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1]));
      if (nums.length !== i.blanks.length || nums.some((n, k) => n !== k + 1)) err(w, "blanks {1}..{n} don't match blanks[]");
      for (const b of i.blanks) if (!b.answers.length) err(w, "blank with no answers");
      break;
    }
    case "write_own":
      if (!i.modelAnswers.length) err(w, "no modelAnswers");
      if (!hasHebrew(i.taskHe)) err(w, "taskHe missing Hebrew");
      break;
    default:
      err(w, `unknown type ${i.type}`);
  }

  // The key must grade as correct.
  const r = correctResponse(i);
  if (r) {
    const g = gradeGrammarItem(i, r);
    if (!g.isCorrect) err(w, "answer key does not grade as correct");
  }

  // Vocabulary (option B: levels 1–2 are written per grade from that grade's textbook list).
  if (i.level <= 2) {
    if (i.grade === undefined) {
      // Not yet rewritten per grade: warn, and show which words would fail even for grade 7.
      missingGrade++;
      for (const u of findUnknownWords(itemEnglishTextOf(i), allowedFor(7, i.allowWords))) {
        ungradedUnknown.set(u, [...(ungradedUnknown.get(u) ?? []), i.id]);
      }
    } else if (vocab.hasGradeVocabulary(i.grade)) {
      const allowed = allowedFor(i.grade, i.allowWords);
      const unknown = findUnknownWords(itemEnglishTextOf(i), allowed);
      if (unknown.length) err(w, `words not in grade ${i.grade} vocabulary: ${unknown.join(", ")}`);
    } else {
      gradesWithoutList.add(i.grade);
    }
  }

  // Count per topic:level:grade ("all" = shared items).
  const k = `${i.topicId}:${i.level}:${i.grade ?? "all"}`;
  counts[k] = (counts[k] ?? 0) + 1;
  if (topic && i.grade !== undefined && topic.grades[i.grade] === undefined) {
    err(w, `grade ${i.grade} is not one of this topic's curriculum grades`);
  }
}

// Every curriculum grade of a topic needs its own levels 1–2 set (shared items count too);
// level 3 is shared.
for (const t of GRAMMAR_TOPICS) {
  const grades = Object.keys(t.grades).map(Number);
  for (const lvl of [1, 2]) {
    for (const g of grades) {
      const n = (counts[`${t.id}:${lvl}:${g}`] ?? 0) + (counts[`${t.id}:${lvl}:all`] ?? 0);
      if (n < MIN_ITEMS_PER_LEVEL) err(t.id, `level ${lvl} grade ${g} has ${n} items (min ${MIN_ITEMS_PER_LEVEL})`);
    }
  }
  const n3 = Object.entries(counts)
    .filter(([k]) => k.startsWith(`${t.id}:3:`))
    .reduce((a, [, v]) => a + v, 0);
  if (n3 < MIN_ITEMS_PER_LEVEL) err(t.id, `level 3 has ${n3} items (min ${MIN_ITEMS_PER_LEVEL})`);
}

if (missingGrade) {
  warn.push(`${missingGrade} level 1–2 item(s) are not written per grade yet (no "grade" field)`);
  if (ungradedUnknown.size) {
    const list = [...ungradedUnknown].map(([w, ids]) => `${w} (${ids.join(", ")})`).join("; ");
    warn.push(`words outside grade 7 vocabulary in those items: ${list}`);
  }
}
for (const g of gradesWithoutList) warn.push(`grade ${g} vocabulary list is empty – its items were not vocabulary-checked`);

for (const m of warn) console.warn(`warn  ${m}`);
if (errors.length) {
  for (const e of errors) console.error(`error ${e}`);
  console.error(`\ncheck-grammar: ${errors.length} problem(s).`);
  process.exit(1);
}
console.log(`check-grammar: OK – ${GRAMMAR_TOPICS.length} topic(s), ${GRAMMAR_ITEMS.length} item(s).`);
