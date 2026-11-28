// Unit checks for the lab-exam helpers (src/lib/exam): vocab matching through
// hashes, keystroke log replay, essay similarity and seat-based topic variants.
import { pathToFileURL } from "node:url";
import path from "node:path";
import { root } from "./ts-loader.mjs";

const load = (p) => import(pathToFileURL(path.join(root, p)).href);
const { hashAnswers, matchVocab, countWords } = await load("src/lib/exam/vocab-match.ts");
const { diffOp, replay, typingStats } = await load("src/lib/exam/keylog.ts");
const { compareAll, comparePair, similarityLevel, sharedWordMask } = await load("src/lib/exam/similarity.ts");
const { assignVariants, neighbourPairs, seatVariantIndex } = await load("src/lib/exam/seat-plan.ts");
const { versionOf, stripPart, stripGrammarItem, examParts, examKind, answerKey, baseItemId, answeredCount } = await load("src/lib/exam/exam-parts.ts");
const { buildUnseenPart, buildVocabPart } = await load("src/lib/exam/exam-build.ts");
const { gradeExam, vocabTypedCorrect } = await load("src/lib/exam/grade-exam.ts");
const { answerPatternPairs, answerPatternLevel } = await load("src/lib/exam/similarity.ts");
const { gradeGrammarItem } = await load("src/lib/grammar-grading.ts");
const { GRAMMAR_ITEMS } = await load("src/data/grammar/index.ts");
const { UNSEEN_STORIES } = await load("src/data/unseen/index.ts");

const errors = [];
const check = (name, cond, extra = "") => cond || errors.push(`${name}${extra ? ` – ${extra}` : ""}`);
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

// --- Vocab matching -------------------------------------------------------
const salt = "test-salt";
const words = [
  { id: "w1", english: "borrow" },
  { id: "w2", english: "to run" },
  { id: "w3", english: "city" },
  { id: "w4", english: "look after" },
  { id: "w5", english: "news" },
  { id: "w6", english: "go" },
  { id: "w7", english: "stop" },
  { id: "w8", english: "take off / take away" },
];
const hashed = hashAnswers(words, salt);
check("hashes hide the English", !JSON.stringify(hashed).includes("borrow"));
const m = (text) => matchVocab(text, hashed, salt);
check("inflection -ed", same(m("I borrowed a book."), ["w1"]), JSON.stringify(m("I borrowed a book.")));
check("doubled -ing", same(m("She was running fast"), ["w2"]));
check("-ies plural", same(m("Big Cities are loud"), ["w3"]));
check("phrase with inflected verb", same(m("He looked after his dog"), ["w4"]));
check("no false match news←new", same(m("A new day"), []));
check("irregular past", same(m("We went home"), ["w6"]));
check("stopped → stop", same(m("It stopped."), ["w7"]));
check("slash alternatives", same(m("The plane took off"), ["w8"]) || same(m("The plane takes off"), ["w8"]), JSON.stringify(m("The plane takes off")));
check("alternative 2", same(m("take away the plates"), ["w8"]));
check("curly apostrophe + punctuation", same(m("“Borrow”, he said—"), ["w1"]));
check("different salt doesn't match", matchVocab("borrow", hashed, "other").length === 0);
check("countWords", countWords("  one two\nthree  ") === 3 && countWords("   ") === 0);

// --- Keylog -----------------------------------------------------------------
const steps = ["", "H", "He", "Hel", "Hello", "Hello world", "Hello, world", "Hi, world", "Hi, world!"];
const ops = [];
let t = 1000;
for (let i = 1; i < steps.length; i++) {
  const op = diffOp(steps[i - 1], steps[i], (t += 500));
  if (op) ops.push(op);
}
check("replay rebuilds text", replay(ops) === "Hi, world!", replay(ops));
check("replay partial", replay(ops, 4) === "Hello");
check("diff no-op", diffOp("abc", "abc", 0) === null);
check("diff repeated letters", replay([diffOp("", "aaa", 0), diffOp("aaa", "aaaa", 1)]) === "aaaa");
const stats = typingStats(ops, "Hi, world!");
check("stats biggest insert", stats.biggestInsert === 6, String(stats.biggestInsert));
check("stats deleted", stats.charsDeleted === 4, String(stats.charsDeleted));

// --- Similarity -------------------------------------------------------------
const essayA = "My favourite holiday is Passover because my whole family sits together and we eat matzah and sing songs until midnight.";
const essayB = "My favourite holiday is Passover because my whole family sits together and we eat matzah. It is fun.";
const essayC = "Last summer I travelled to Eilat with my friends. We swam in the Red Sea and saw colourful fish near the coral.";
const pAB = comparePair({ studentId: "a", text: essayA }, { studentId: "b", text: essayB });
const pAC = comparePair({ studentId: "a", text: essayA }, { studentId: "c", text: essayC });
check("copied pair is high", similarityLevel(pAB) === "high", JSON.stringify(pAB));
check("unrelated pair is low", similarityLevel(pAC) === "low", JSON.stringify(pAC));
const all = compareAll(
  [{ studentId: "a", text: essayA }, { studentId: "b", text: essayB }, { studentId: "c", text: essayC }, { studentId: "d", text: "" }],
  []
);
check("compareAll skips empty + sorts", all.length === 3 && all[0].a === "a" && all[0].b === "b");
const prompt = "Write about my favourite holiday is Passover because";
const withPrompt = compareAll([{ studentId: "x", text: "my favourite holiday is Passover because" }, { studentId: "y", text: "my favourite holiday is Passover because" }], [prompt]);
check("topic text is ignored", withPrompt[0].sharedShingles === 0, JSON.stringify(withPrompt[0]));
const mask = sharedWordMask(essayB, essayA);
check("mask marks shared words", mask[0] === true && mask[mask.length - 1] === false);

// --- Seat plan ----------------------------------------------------------------
const rows = 4, cols = 6;
for (const k of [2, 3]) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = seatVariantIndex(r, c, k);
      if (c + 1 < cols) check(`k=${k} left/right differ`, v !== seatVariantIndex(r, c + 1, k));
      if (r + 1 < rows) check(`k=${k} front/back differ`, v !== seatVariantIndex(r + 1, c, k));
    }
  }
}
const plan = { rows: 1, cols: 3, seats: [{ row: 0, col: 0, studentId: "s1" }, { row: 0, col: 1, studentId: "s2" }, { row: 0, col: 2, studentId: "s3" }] };
const assigned = assignVariants(["s1", "s2", "s3", "s4", "s5"], ["A", "B"], plan);
check("seated variants alternate", assigned.s1 === "A" && assigned.s2 === "B" && assigned.s3 === "A");
check("unseated get a variant", assigned.s4 === "A" && assigned.s5 === "B");
const pairs = neighbourPairs(plan);
check("neighbour pairs", pairs.has("s1|s2") && pairs.has("s2|s3") && !pairs.has("s1|s3"));


// --- Parts: legacy exams ----------------------------------------------------------
check("legacy exam = one writing part", examParts({}).length === 1 && examParts({}).at(0).type === "writing");
check("legacy exam = test", examKind({}) === "test" && examKind({ kind: "quiz" }) === "quiz");

// --- Grammar: stripping + grading round trip, every exercise type ------------------
const correctResponse = (it) => {
  switch (it.type) {
    case "mcq": case "gap_bank": return { type: it.type, value: it.answer };
    case "gap_type": case "transform": return { type: it.type, value: it.answers[0] };
    case "unscramble": return { type: "unscramble", order: [...it.words] };
    case "find_fix": return { type: "find_fix", index: it.wrongIndex, value: it.answers[0] };
    case "sort": return { type: "sort", placement: Object.fromEntries(it.entries.map((e) => [e.text, e.bucket])) };
    case "match_halves": return { type: "match_halves", matches: Object.fromEntries(it.pairs.map((p) => [p.left, p.right])) };
    case "cloze_text": return { type: "cloze_text", values: it.blanks.map((b) => b.answers[0]) };
    default: return null;
  }
};
const seenTypes = new Set();
for (const it of GRAMMAR_ITEMS) {
  seenTypes.add(it.type);
  const st = stripGrammarItem(it);
  const where = `grammar ${it.id} (${it.type})`;
  check(`${where}: explanation/hint removed`, !st.explanationHe && !st.explanationEn && !st.hintHe);
  switch (it.type) {
    case "mcq": case "gap_bank": check(`${where}: answer hidden`, st.answer === ""); break;
    case "gap_type": case "transform": case "find_fix": check(`${where}: answers hidden`, st.answers.length === 0 && (it.type !== "find_fix" || st.wrongIndex === -1)); break;
    case "unscramble": check(`${where}: same words`, [...st.words].sort().join("|") === [...it.words].sort().join("|") && !st.altAnswers); break;
    case "sort": check(`${where}: buckets hidden`, st.entries.every((e) => e.bucket === "") && st.entries.length === it.entries.length); break;
    case "match_halves": check(`${where}: same halves`, [...st.pairs.map((p) => p.right)].sort().join("|") === [...it.pairs.map((p) => p.right)].sort().join("|")); break;
    case "cloze_text": check(`${where}: blanks hidden`, st.blanks.every((b) => b.answers.length === 0)); break;
    case "write_own": check(`${where}: model hidden`, st.modelAnswers.length === 0); break;
  }
  const r = correctResponse(it);
  if (r) check(`${where}: key grades 1`, gradeGrammarItem(it, r).score === 1, JSON.stringify(gradeGrammarItem(it, r)));
}
check("every grammar type covered", seenTypes.size === 10, [...seenTypes].join(","));

// --- Unseen: build, strip, versions, grading ----------------------------------------
const story = UNSEEN_STORIES.find((s) => s.questions.some((q) => q.type === "mcq") && s.questions.some((q) => q.type === "copy") && s.questions.some((q) => q.type === "open"));
const uA = buildUnseenPart("p1", story.id, []);
check("unseen part has all questions", uA.questions.length === story.questions.length);
const uStudent = JSON.stringify(stripPart(uA));
check("unseen stripped: no keys", !/correctIndex|targetSentence|modelAnswer|keywords|explanationHebrew/.test(uStudent));
const uB = versionOf(uA, "B");
for (const q of uA.questions.filter((q) => q.type === "mcq")) {
  const b = uB.questions.find((x) => baseItemId(x.id) === q.id);
  check(`unseen B keeps the right answer (${q.id})`, b.options[b.correctIndex] === q.options[q.correctIndex] && b.id === `${q.id}~B`);
}
const mcq = uA.questions.find((q) => q.type === "mcq");
const copyQ = uA.questions.find((q) => q.type === "copy");
const openQ = uA.questions.find((q) => q.type === "open");
const uAnswers = {
  [answerKey("p1", mcq.id)]: mcq.correctIndex,
  [answerKey("p1", copyQ.id)]: copyQ.targetSentence,
  [answerKey("p1", openQ.id)]: (openQ.keywords ?? []).join(" "),
};
const uMeta = [{ id: "p1", type: "unseen", title: "U", points: 50, itemCount: uA.questions.length }];
let g = gradeExam(uMeta, [uA], uAnswers, null);
const items = Object.fromEntries(g.parts[0].items.map((i) => [i.itemId, i]));
check("unseen mcq right = 1", items[mcq.id].score === 1);
check("unseen copy exact = 1", items[copyQ.id].score === 1);
check("unseen open → needs review", items[openQ.id].needsReview === true);
g = gradeExam(uMeta, [uA], uAnswers, { overrides: { [answerKey("p1", openQ.id)]: 0.5 } });
check("teacher override wins + clears review", g.parts[0].items.find((i) => i.itemId === openQ.id).score === 0.5 && !g.parts[0].items.find((i) => i.itemId === openQ.id).needsReview);
const gB = gradeExam(uMeta, [uB], { [answerKey("p1", `${openQ.id}~B`)]: "x" }, { overrides: { [answerKey("p1", openQ.id)]: 1 } });
check("override applies to version B by base id", gB.parts[0].items.find((i) => i.baseId === openQ.id).score === 1);

// --- Vocab ----------------------------------------------------------------------------
const vw = [
  { id: "w1", english: "borrow", hebrew: "לשאול (חפץ)" },
  { id: "w2", english: "city", hebrew: "עיר" },
  { id: "w3", english: "look after", hebrew: "לטפל ב" },
  { id: "w4", english: "quiet", hebrew: "שקט" },
  { id: "w5", english: "river", hebrew: "נהר" },
];
const vA = buildVocabPart("p2", vw, ["he_to_en_type", "en_to_he_choice", "he_to_en_choice"], 5, 42);
check("vocab count + formats", vA.questions.length === 5 && new Set(vA.questions.map((q) => q.format)).size === 3);
check("vocab choices have 4 options incl. answer", vA.questions.filter((q) => q.options).every((q) => q.options.length === 4 && q.options.includes(q.answer)));
check("vocab stripped: no answer", !JSON.stringify(stripPart(vA)).includes('"answer"'));
check("vocab B: same questions shuffled", versionOf(vA, "B").questions.map((q) => baseItemId(q.id)).sort().join() === vA.questions.map((q) => q.id).sort().join());
check("typed: inflection ok", vocabTypedCorrect("Borrowed", "borrow") && vocabTypedCorrect("to borrow", "borrow") && vocabTypedCorrect("cities", "city"));
check("typed: phrase + wrong", vocabTypedCorrect("look after", "look after") && !vocabTypedCorrect("borow", "borrow") && !vocabTypedCorrect("", "city"));

// --- Whole exam total + writing -----------------------------------------------------------
const metas = [...uMeta, { id: "p2", type: "vocab", title: "V", points: 30, itemCount: 5 }, { id: "w", type: "writing", title: "W", points: 20, itemCount: 1 }];
const allRight = Object.fromEntries(vA.questions.map((q) => [answerKey("p2", q.id), q.answer]));
const total = gradeExam(metas, [uA, vA, { id: "w", type: "writing" }], allRight, { overrides: {}, writingScore: 0.5 });
check("vocab all right = full part", Math.abs(total.parts[1].earned - 30) < 1e-9);
check("writing score scales", total.parts[2].earned === 10 && total.parts[2].needsReview === 0);
check("writing ungraded → review", gradeExam(metas, [uA, vA], {}, null).parts[2].needsReview === 1);
check("answeredCount", answeredCount(stripPart(vA), allRight) === 5);

// --- Answer patterns -------------------------------------------------------------------------
const sheet = (id, wrongs) => ({ studentId: id, answers: Object.fromEntries(Object.entries(wrongs).map(([k, t]) => [k, { text: t, correct: t === "ok" }])) });
const pp = answerPatternPairs([
  sheet("a", { q1: "x", q2: "y", q3: "z", q4: "w", q5: "ok" }),
  sheet("b", { q1: "x", q2: "y", q3: "z", q4: "w", q5: "ok" }),
  sheet("c", { q1: "ok", q2: "q", q3: "ok", q4: "ok", q5: "ok" }),
]);
check("answer pattern: copiers high", pp[0].a === "a" && pp[0].b === "b" && pp[0].sameWrong === 4 && answerPatternLevel(pp[0]) === "high");
check("answer pattern: right answers don't count", !pp.some((p) => p.b === "c" && p.sameWrong > 0));

if (errors.length) {
  console.error(`check:exam – ${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log("check:exam – all exam helper checks passed");
