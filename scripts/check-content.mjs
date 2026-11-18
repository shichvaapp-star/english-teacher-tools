// Validates the grade × level content of Vocabulary, Unseen, Conversation and
// Writing: ids, structure, counts, Hebrew fields and the grade-vocabulary rule
// (Levels 1–2 may only use Band I + the grade's textbook list + earlier grades'
// lists + function words; Level 3 may go beyond – reported as info only).
import { pathToFileURL } from "node:url";
import path from "node:path";
import { root } from "./ts-loader.mjs";

const load = (p) => import(pathToFileURL(path.join(root, p)).href);
const { findUnknownWords, allowedWordsFor, lemmaCandidates } = await load("src/lib/vocab-check.ts");
const vocab = await load("src/data/vocab/index.ts");
const { VOCAB_CARDS } = await load("src/data/vocab/cards/index.ts");
const { UNSEEN_STORIES } = await load("src/data/unseen/index.ts");
const { CONVERSATION_SCENARIOS } = await load("src/data/conversations/scenarios.ts");
const { WRITING_TASKS } = await load("src/data/writing/index.ts");

// Targets per grade × level. While a section is being written, shortfalls are
// warnings; once `strict` is on they fail the check.
const TARGETS = {
  unseen: { min: 10, strict: true },
  conversation: { min: 8, strict: true },
  writing: { min: 8, strict: false },
};

const errors = [];
const warnings = [];
const info = new Map(); // L3 words beyond the grade list, per section
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);
const hasHebrew = (s) => typeof s === "string" && /[֐-׿]/.test(s);
const GRADES = [7, 8, 9];
const LEVELS = ["Level 1", "Level 2", "Level 3"];

function checkVocabulary(section, where, grade, level, texts, extra = []) {
  if (!GRADES.includes(grade)) return err(where, `grade must be 7, 8 or 9 (got ${grade})`);
  const unknown = findUnknownWords(texts.filter(Boolean), allowedWordsFor(grade, extra));
  if (!unknown.length) return;
  if (level === "Level 3") {
    const m = info.get(section) ?? new Set();
    unknown.forEach((u) => m.add(u));
    info.set(section, m);
  } else {
    err(where, `words not in grade ${grade} vocabulary: ${unknown.join(", ")}`);
  }
}

function checkCounts(section, items) {
  const t = TARGETS[section];
  if (!items.length) return warn(section, "no content yet");
  for (const g of GRADES) {
    for (const l of LEVELS) {
      const n = items.filter((i) => i.grade === g && i.level === l).length;
      if (n < t.min) (t.strict ? err : warn)(section, `grade ${g} ${l}: ${n}/${t.min}`);
    }
  }
}

function uniqueIds(section, items) {
  const seen = new Set();
  for (const i of items) {
    if (seen.has(i.id)) err(section, `duplicate id ${i.id}`);
    seen.add(i.id);
  }
}

// Words of the task instructions themselves (always allowed in prompts).
const INSTRUCTION_WORDS = ["copy", "paragraph", "line", "lines", "sentence", "sentences", "text", "story", "title", "conversation", "dialogue", "answer"];

const norm = (s) => s.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, " ").trim();

function checkMcq(where, q) {
  if (!Array.isArray(q.options) || q.options.length < 3) return err(where, "mcq needs 3+ options");
  if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
    err(where, "bad correctIndex");
  }
  if (new Set(q.options.map(norm)).size !== q.options.length) err(where, "duplicate options");
}

// ── Vocabulary cards ──
uniqueIds("vocab", VOCAB_CARDS);
for (const g of GRADES) {
  const list = vocab.GRADE_VOCAB[g];
  const cards = VOCAB_CARDS.filter((c) => c.grade === g);
  if (!cards.length) {
    warn("vocab", `grade ${g}: no cards yet`);
    continue;
  }
  if (cards.length !== list.length) err("vocab", `grade ${g}: ${cards.length} cards for ${list.length} list words`);
}
for (const c of VOCAB_CARDS) {
  const w = `vocab ${c.id}`;
  if (!hasHebrew(c.hebrew)) err(w, "hebrew missing");
  if (!c.partOfSpeech) err(w, "partOfSpeech missing");
  if (!c.example?.trim()) {
    err(w, "example missing");
    continue;
  }
  if (hasHebrew(c.example)) err(w, "example contains Hebrew");
  if (!/[.!?]["”']?$/.test(c.example.trim())) err(w, `example should end with . ! or ? — ${c.example}`);
  // The example must actually use the word (any inflection; for phrases, their content words).
  const exTokens = new Set(
    (c.example.toLowerCase().replace(/[’]/g, "'").match(/[a-zà-ÿ][a-zà-ÿ'-]*/g) ?? []).flatMap((t) => [
      ...lemmaCandidates(t),
      ...t.split(/[-']/).flatMap((p) => lemmaCandidates(p)),
    ])
  );
  const headWords = vocab
    .vocabularyTokens([c.word.replace(/\([^)]*\)/g, " ").replace(/\.\.\./g, " ").split("/")[0]])
    .filter((t) => !["one's", "oneself", "someone", "something", "someone's", "yourself", "your", "the", "a", "an", "be", "to"].includes(t));
  const firstWord = headWords[0];
  if (firstWord && !lemmaCandidates(firstWord).some((x) => exTokens.has(x)) && !exTokens.has(firstWord)) {
    err(w, `example doesn't use "${c.word}": ${c.example}`);
  }
  checkVocabulary("vocab", w, c.grade, "Level 2", [c.example], [...vocab.vocabularyTokens([c.word]), ...(c.allowWords ?? [])]);
}

// ── Unseen ──
uniqueIds("unseen", UNSEEN_STORIES);
checkCounts("unseen", UNSEEN_STORIES);
for (const s of UNSEEN_STORIES) {
  const w = `unseen ${s.id}`;
  if (!LEVELS.includes(s.level)) err(w, "bad level");
  if (!hasHebrew(s.hebrewTitle)) err(w, "hebrewTitle missing Hebrew");
  if (s.paragraphs.length < 3) err(w, "needs at least 3 paragraphs");
  const minQ = 8;
  if (s.questions.length < minQ) err(w, `needs ${minQ}+ questions`);
  if (s.totalPoints !== 100) err(w, `totalPoints ${s.totalPoints} ≠ 100`);
  for (const h of s.vocabularyHints) if (!hasHebrew(h.translation)) err(w, `hint ${h.word} has no Hebrew`);
  const types = new Set(s.questions.map((q) => q.type));
  if (!types.has("copy")) warn(w, "no copy question");
  const paraNorm = s.paragraphs.map(norm);
  for (const q of s.questions) {
    const qw = `${w} q${q.number}`;
    if (!hasHebrew(q.explanationHebrew)) err(qw, "explanationHebrew missing Hebrew");
    if (q.paragraphIndex < 0 || q.paragraphIndex >= s.paragraphs.length) err(qw, "paragraphIndex out of range");
    if (q.type === "mcq") checkMcq(qw, q);
    if (q.type === "copy") {
      if (!q.targetSentence) err(qw, "copy without targetSentence");
      else if (!paraNorm[q.paragraphIndex]?.includes(norm(q.targetSentence))) {
        err(qw, `targetSentence not in paragraph ${q.paragraphIndex + 1}: ${q.targetSentence}`);
      }
    }
    if (q.type === "open" && (!q.modelAnswer || !q.keywords?.length)) err(qw, "open needs modelAnswer + keywords");
  }
  const text = [
    s.title,
    ...s.paragraphs,
    ...s.questions.flatMap((q) => [q.prompt, ...(q.options ?? []), q.modelAnswer, q.targetSentence]),
  ];
  const glossed = vocab.vocabularyTokens(s.vocabularyHints.map((h) => h.word)).flatMap(lemmaCandidates);
  checkVocabulary("unseen", w, s.grade, s.level, text, [...glossed, ...INSTRUCTION_WORDS, ...(s.allowWords ?? [])]);
}

// ── Conversation ──
uniqueIds("conversation", CONVERSATION_SCENARIOS);
checkCounts("conversation", CONVERSATION_SCENARIOS);
for (const s of CONVERSATION_SCENARIOS) {
  const w = `conversation ${s.id}`;
  if (!hasHebrew(s.hebrewTitle)) err(w, "hebrewTitle missing Hebrew");
  if (s.questions.length !== 10) err(w, `needs 10 questions (has ${s.questions.length})`);
  if (s.totalPoints !== 100) err(w, `totalPoints ${s.totalPoints} ≠ 100`);
  if (s.turns.length < 6) err(w, "needs 6+ dialogue lines");
  const ids = new Set(s.speakers.map((sp) => sp.id));
  for (const t of s.turns) if (!ids.has(t.speakerId)) err(w, `line ${t.index + 1}: unknown speaker ${t.speakerId}`);
  for (const p of s.usefulPhrases) if (!hasHebrew(p.translation)) err(w, `phrase "${p.phrase}" has no Hebrew`);
  const turnText = s.turns.map((t) => norm(t.text));
  for (const q of s.questions) {
    const qw = `${w} q${q.number}`;
    if (!hasHebrew(q.explanationHebrew)) err(qw, "explanationHebrew missing Hebrew");
    if (q.turnRefIndex >= s.turns.length) err(qw, "line reference out of range");
    if (q.type === "mcq" || q.type === "reply_mcq") checkMcq(qw, q);
    if (q.type === "copy") {
      const target = norm(q.targetSentence ?? "");
      const where = q.turnRefIndex >= 0 ? [turnText[q.turnRefIndex]] : turnText;
      if (!target || !where.some((t) => t?.includes(target))) err(qw, `targetSentence not in line: ${q.targetSentence}`);
    }
    if ((q.type === "open" || q.type === "reply_open") && (!q.modelAnswer || !q.keywords?.length)) {
      err(qw, "open needs modelAnswer + keywords");
    }
  }
  const text = [
    s.title,
    s.settingDescription,
    ...s.turns.map((t) => t.text),
    ...s.usefulPhrases.map((p) => p.phrase),
    ...s.questions.flatMap((q) => [q.prompt, q.situationContext, ...(q.options ?? []), q.modelAnswer]),
  ];
  const names = s.speakers.flatMap((sp) => sp.name.split(/[\s()]+/));
  // Useful phrases come with a Hebrew translation, so their words count as taught (like Unseen hints).
  const glossed = vocab.vocabularyTokens(s.usefulPhrases.map((p) => p.phrase)).flatMap(lemmaCandidates);
  checkVocabulary("conversation", w, s.grade, s.level, text, [...names, ...glossed, ...INSTRUCTION_WORDS, ...(s.allowWords ?? [])]);
}

// ── Writing ──
uniqueIds("writing", WRITING_TASKS);
checkCounts("writing", WRITING_TASKS);
for (const t of WRITING_TASKS) {
  const w = `writing ${t.id}`;
  if (!hasHebrew(t.hebrewTitle)) err(w, "hebrewTitle missing Hebrew");
  if (!hasHebrew(t.hebrewInstructions)) err(w, "hebrewInstructions missing Hebrew");
  if (!(t.minWords <= t.maxWords)) err(w, "minWords > maxWords");
  if (t.wordBank.length < 6) err(w, "wordBank needs 6+ words");
  for (const b of t.wordBank) if (!hasHebrew(b.hebrew)) err(w, `word bank "${b.word}" has no Hebrew`);
  if (t.sentenceStarters.length < 3) err(w, "needs 3+ sentence starters");
  for (const step of t.guidedSteps ?? []) {
    if (!hasHebrew(step.titleHebrew) || !hasHebrew(step.helperHintHebrew)) err(w, `step ${step.stepNumber} missing Hebrew`);
  }
  const text = [
    t.title,
    t.prompt,
    ...t.wordBank.map((b) => b.word),
    ...t.sentenceStarters,
    ...(t.guidedSteps ?? []).flatMap((s) => [s.starterPhrase, s.placeholder]),
  ];
  // Word-bank words come with a Hebrew translation, so they count as taught.
  const glossed = vocab.vocabularyTokens(t.wordBank.map((b) => b.word)).flatMap(lemmaCandidates);
  checkVocabulary("writing", w, t.grade, t.level, text, [...glossed, ...INSTRUCTION_WORDS, ...(t.allowWords ?? [])]);
}

// ── Report ──
for (const [section, words] of info) {
  console.log(`info: ${section} Level 3 uses ${words.size} word(s) beyond the grade lists`);
}
if (warnings.length) {
  console.log(`${warnings.length} warning(s):`);
  for (const w of warnings.slice(0, 40)) console.log(`  ⚠ ${w}`);
}
if (errors.length) {
  console.error(`check-content: ${errors.length} error(s)`);
  for (const e of errors.slice(0, 200)) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(
  `check-content: OK – ${VOCAB_CARDS.length} vocab card(s), ${UNSEEN_STORIES.length} unseen, ` +
    `${CONVERSATION_SCENARIOS.length} conversation(s), ${WRITING_TASKS.length} writing task(s).`
);
