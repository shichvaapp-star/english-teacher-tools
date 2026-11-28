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

if (errors.length) {
  console.error(`check:exam – ${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log("check:exam – all exam helper checks passed");
