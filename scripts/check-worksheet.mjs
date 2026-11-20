// Validates the worksheet maker's builders (src/lib/worksheet): builds many
// random worksheets for every grade × level × part and checks the content.
import { pathToFileURL } from "node:url";
import path from "node:path";
import { root } from "./ts-loader.mjs";

const load = (p) => import(pathToFileURL(path.join(root, p)).href);
const { buildWorksheet, defaultSettings, makeVersionB, replaceItem, deleteItem, sectionSize } = await load("src/lib/worksheet/build.ts");
const { grammarTopicsFor, grammarTypesFor } = await load("src/lib/worksheet/grammar.ts");
const { BLANK } = await load("src/lib/worksheet/vocab.ts");
const { gradeUnits } = await load("src/data/vocab/cards/index.ts");
const { itemKey } = await load("src/lib/grammar-gen/index.ts");
const { allowedWordsFor, findUnknownWords, itemEnglishText } = await load("src/lib/grammar-vocab.ts");
const { Rng } = await load("src/lib/grammar-gen/random.ts");

const errors = [];
const err = (where, msg) => errors.length < 60 && errors.push(`${where}: ${msg}`);
const RUNS = Number(process.env.WORKSHEET_RUNS ?? 6);
let sheets = 0;

const ALL_PARTS = ["vocab", "grammar", "reading", "conversation", "writing"];

function idsOf(section) {
  if (section.kind === "vocab" || section.kind === "grammar") return section.items.map((i) => i.id).sort();
  if (section.kind === "reading" || section.kind === "conversation") return section.questions.map((q) => q.id).sort();
  return [section.task.taskId];
}

function checkSection(where, section, settings) {
  const { grade, level } = settings;
  if (section.kind === "vocab") {
    const want = Math.min(settings.vocab.count, section.items.length + 1000);
    if (section.items.length > want) err(where, "too many vocab items");
    const words = new Set();
    const hebrew = new Set();
    for (const it of section.items) {
      if (words.has(it.word.toLowerCase())) err(where, `duplicate word ${it.word}`);
      words.add(it.word.toLowerCase());
      if (hebrew.has(it.hebrew.trim())) err(where, `two words share the meaning ${it.hebrew}`);
      hebrew.add(it.hebrew.trim());
      if (!it.hebrew) err(where, `no Hebrew for ${it.word}`);
      if (it.kind === "gap_sentence") {
        const n = (it.sentence ?? "").split(BLANK).length - 1;
        if (n !== 1) err(where, `blank appears ${n} times: ${it.sentence}`);
        if (!it.answer) err(where, `gap without answer: ${it.word}`);
      }
      if (it.kind === "choose_meaning") {
        if (!it.options || it.options.length !== 4) err(where, `choose_meaning needs 4 options: ${it.word}`);
        else if (it.options[it.answerIndex] !== it.hebrew) err(where, `wrong answer index: ${it.word}`);
        else if (new Set(it.options).size !== 4) err(where, `duplicate options: ${it.word}`);
      }
    }
  }
  if (section.kind === "grammar") {
    if (section.items.length > settings.grammar.count) err(where, "too many grammar items");
    const keys = new Set();
    for (const it of section.items) {
      const k = itemKey(it);
      if (keys.has(k)) err(where, `duplicate grammar item ${k}`);
      keys.add(k);
      if (!settings.grammar.topicIds.includes(it.topicId)) err(where, `item from unchosen topic ${it.topicId}`);
      if (settings.grammar.types.length && !settings.grammar.types.includes(it.type)) err(where, `unchosen type ${it.type}`);
      if (it.type === "mcq" && !it.options.includes(it.answer)) err(where, `mcq answer not in options: ${it.id}`);
      if (level <= 2 && it.id.startsWith("gen-")) {
        const unknown = findUnknownWords(itemEnglishText(it), allowedWordsFor(grade, it.allowWords ?? []));
        if (unknown.length) err(where, `generated item outside grade list (${unknown.join(", ")}): ${it.id}`);
      }
    }
  }
  if (section.kind === "reading" || section.kind === "conversation") {
    const cfg = settings[section.kind];
    if (section.questions.length > cfg.count) err(where, "too many questions");
    if (new Set(section.questions.map((q) => q.id)).size !== section.questions.length) err(where, "duplicate question");
    for (const q of section.questions) {
      if (cfg.types.length && !cfg.types.includes(q.type)) err(where, `unchosen type ${q.type}`);
      if (q.options && (typeof q.correctIndex !== "number" || !q.options[q.correctIndex])) err(where, `bad correctIndex ${q.id}`);
    }
  }
}

for (const grade of [7, 8, 9]) {
  for (const level of [1, 2, 3]) {
    const topics = grammarTopicsFor(grade, level).map((t) => t.id);
    if (!topics.length) err(`g${grade} L${level}`, "no grammar topics");
    const units = gradeUnits(grade);
    for (let run = 0; run < RUNS; run++) {
      const rng = new Rng(grade * 1000 + level * 100 + run);
      const s = defaultSettings(grade, level);
      s.parts = rng.sample(ALL_PARTS, 1 + rng.int(ALL_PARTS.length));
      s.vocab = { ...s.vocab, units: rng.sample(units, 1 + rng.int(2)), count: 4 + rng.int(20), types: rng.sample(["match", "to_hebrew", "to_english", "gap_sentence", "choose_meaning"], 1 + rng.int(5)) };
      const chosenTopics = rng.sample(topics, 1 + rng.int(3));
      const types = grammarTypesFor(chosenTopics, grade, level);
      s.grammar = { topicIds: chosenTopics, count: 5 + rng.int(25), types: run % 2 ? rng.sample(types, 1 + rng.int(types.length)) : [] };
      s.reading = { ...s.reading, count: 3 + rng.int(8), types: rng.sample(["mcq", "open", "copy"], 1 + rng.int(3)) };
      s.conversation = { ...s.conversation, count: 3 + rng.int(8) };
      const content = buildWorksheet(s, grade * 7919 + level * 104729 + run);
      sheets++;
      const where = `g${grade} L${level} run ${run}`;
      if (content.sections.length !== s.parts.length) err(where, `expected ${s.parts.length} parts, got ${content.sections.map((x) => x.kind).join(",")}`);
      content.sections.forEach((sec) => {
        checkSection(`${where} ${sec.kind}`, sec, s);
        if (sectionSize(sec) === 0) err(`${where} ${sec.kind}`, "empty part");
      });
      // Version B: same items, valid answers.
      const b = makeVersionB(content.sections, content.seed);
      content.sections.forEach((sec, i) => {
        if (JSON.stringify(idsOf(sec)) !== JSON.stringify(idsOf(b[i]))) err(`${where} ${sec.kind}`, "version B has different items");
        checkSection(`${where} ${sec.kind} (B)`, b[i], s);
      });
      // Replace + delete keep the part valid.
      content.sections.forEach((sec, i) => {
        const after = replaceItem(content, i, 0)[i];
        checkSection(`${where} ${sec.kind} (replaced)`, after, s);
        if (sectionSize(after) !== sectionSize(sec)) err(`${where} ${sec.kind}`, "replace changed the size");
        const del = deleteItem(content.sections, i, 0);
        if (sec.kind !== "writing" && sectionSize(sec) > 1 && sectionSize(del[i]) !== sectionSize(sec) - 1) err(`${where} ${sec.kind}`, "delete failed");
      });
    }
  }
}

if (errors.length) {
  console.error(`check:worksheet – ${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`check:worksheet – ${sheets} worksheets OK`);
