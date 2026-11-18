import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: CONDITIONAL: Real conditions (First conditional) – grade 9.

export const firstConditionalTopic: GrammarTopic = {
  id: "first-conditional",
  group: "clauses",
  title: "First Conditional (if … will)",
  titleHe: "משפט תנאי – if … will",
  bandRefs: ["CONDITIONAL: Real conditions (First conditional)"],
  grades: { 9: "emerging" },
  rule: {
    1: {
      points: [
        { he: "תנאי אמיתי לעתיד: if + הווה, will + פועל", en: "Real future condition: if + present, will + verb", examples: ["**If** it **rains**, we**'ll stay** home."] },
        { he: "אחרי if – הווה, לא will", en: "After if – present, not will", examples: ["If you **study**, you'll pass.", "✗ If you will study"] },
        { he: "אפשר להתחיל בכל חלק", en: "Either part can come first", examples: ["**If** I'm late, I'll call.", "I'll call **if** I'm late."] },
        { he: "פסיק רק כש-if בהתחלה", en: "Comma only when if comes first", examples: ["If it's sunny, we'll swim.", "We'll swim if it's sunny."] },
      ],
      form: [
        { kind: "affirmative", pattern: "If + present simple, will + base verb", example: "If he calls, I'll answer." },
        { kind: "negative", pattern: "If + don't / doesn't …, won't + base verb", example: "If you don't hurry, you won't catch it." },
        { kind: "question", pattern: "What will you do if …?", example: "What will you do if it rains?" },
      ],
      timeWords: ["if", "unless", "will", "won't"],
    },
    2: {
      points: [
        { he: "תוצאה אפשרית ומציאותית", en: "A real, possible result", examples: ["If I save money, I'll buy a bike."] },
        { he: "if + not / unless = אם לא", en: "unless = if not", examples: ["I won't go **unless** you come.", "= I won't go **if** you **don't** come."] },
        { he: "אפשר גם can / may / might במקום will", en: "can / may / might instead of will", examples: ["If you finish, you **can** go.", "If it snows, school **might** close."] },
        { he: "ציווי בחלק השני", en: "Imperative in the result", examples: ["If you see Dan, **tell** him to call me."] },
      ],
      form: [
        { kind: "affirmative", pattern: "If + present, can / might / imperative", example: "If you're cold, close the window." },
        { kind: "negative", pattern: "unless + present (= if not)", example: "Unless we hurry, we'll miss the bus." },
      ],
      timeWords: ["unless", "as long as", "might", "can"],
    },
    3: {
      points: [
        { he: "תנאי אפס – עובדה: if + הווה, הווה", en: "Zero conditional – facts: if + present, present", examples: ["If you heat ice, it melts."] },
        { he: "as long as / provided that = בתנאי ש…", en: "as long as / provided that", examples: ["You can go **as long as** you're back by ten."] },
        { he: "when (בטוח) מול if (אולי)", en: "when (sure) vs if (maybe)", examples: ["**When** I get home, I'll eat. (sure)", "**If** I get home early, I'll call. (maybe)"] },
        { he: "תנאי בעבר דמיוני – רמה גבוהה יותר", en: "Unreal conditionals come later (if I were…)", examples: ["If I **were** rich, I **would** travel."] },
      ],
      form: [
        { kind: "affirmative", pattern: "If + present, present (general truth)", example: "If you mix red and blue, you get purple." },
        { kind: "affirmative", pattern: "as long as / provided that + present", example: "I'll help as long as you try." },
      ],
      timeWords: ["as long as", "provided that", "in case", "when"],
    },
  },
  traps: [
    { id: "fc-will-if", wrong: "If it will rain, we'll stay home.", right: "If it rains, we'll stay home.", whyHe: "אחרי if – הווה, לא will.", whyEn: "After if → present, not will." },
    { id: "fc-no-will", wrong: "If you study, you pass the test tomorrow.", right: "If you study, you'll pass the test tomorrow.", whyHe: "התוצאה בעתיד → will.", whyEn: "Future result → will." },
    { id: "fc-s", wrong: "If she come, I'll be happy.", right: "If she comes, I'll be happy.", whyHe: "she בהווה – מוסיפים s.", whyEn: "she → comes." },
    { id: "fc-unless", wrong: "Unless you don't hurry, you'll be late.", right: "Unless you hurry, you'll be late.", whyHe: "unless כבר אומר 'אם לא' – בלי don't.", whyEn: "unless already means 'if not'." },
  ],
};

const T = "first-conditional";

// ───────────── Grade 9 ─────────────
const a = itemSet(T, "fc", 1, 9);
a.mcq("If it ___ tomorrow, we'll stay at home.", ["rains", "will rain", "rain"], "אחרי if – הווה פשוט, it → rains.", "After if → present: rains.", { trap: "fc-will-if", allow: ["rains", "rain"] });
a.mcq("If you study hard, you ___ the test.", ["will pass", "pass", "passed"], "תוצאה בעתיד → will pass.", "Future result → will pass.", { trap: "fc-no-will" });
a.mcq("If she ___, I'll be very happy.", ["comes", "come", "will come"], "she בהווה → comes.", "she → comes.", { trap: "fc-s" });
a.mcq("We ___ the bus if we don't hurry.", ["'ll miss", "miss", "missed"], "תוצאה בעתיד → will miss.", "Future result → 'll miss.");
a.mcq("What will you do if the elevator ___ work?", ["doesn't", "won't", "didn't"], "אחרי if – הווה: doesn't.", "After if → doesn't.", { trap: "fc-will-if" });
a.bank("If the neighbors complain, we ___ the music down.", ["'ll turn", "turn", "turned"], "תוצאה בעתיד → 'll turn.", "Future result → 'll turn.", { allow: ["turn"] });
a.bank("If you ___ my charger, please give it back.", ["borrow", "will borrow", "borrowed"], "אחרי if – הווה: borrow.", "After if → borrow.", { allow: ["charger"] });
a.bank("I'll buy the novel if it ___ cheap.", ["is", "will be", "was"], "אחרי if – הווה: is.", "After if → is.");
a.order("If it is sunny, we will sail to the island.", "If + הווה, will + פועל.", "If + present, will + verb.", { allow: ["sunny"] });
a.order("What will you do if you lose your phone?", "What will you do + if + הווה?", "What will you do if + present?");
a.sort(["after if (present)", "result (will)"], [["it rains", "after if (present)"], ["we'll stay home", "result (will)"], ["you hurry", "after if (present)"], ["you'll catch the bus", "result (will)"], ["she calls", "after if (present)"], ["I'll answer", "result (will)"]], "אחרי if – הווה. בתוצאה – will.", "if + present; result → will.", { allow: ["rains", "hurry", "catch"] });
a.match([["If you're hungry,", "I'll make a sandwich."], ["If it rains,", "we won't go to the beach."], ["If the oven breaks,", "Dad will repair it."], ["If you see a fire,", "call the firefighters."]], "if + הווה, will / ציווי בתוצאה.", "if + present, will / imperative.", { allow: ["sandwich", "rains", "beach", "breaks"] });

const b = itemSet(T, "fc", 2, 9);
b.type("If I ___ enough money, I'll buy a new phone.", "save", "save", "אחרי if – הווה: save.", "After if → save.", { trap: "fc-will-if" });
b.type("If the firefighters arrive quickly, they ___ the building.", "save", ["will save", "'ll save"], "תוצאה בעתיד → will save.", "Future result → will save.", { trap: "fc-no-will", allow: ["arrive", "building"] });
b.type("If my sister ___ the interview, she'll start next week.", "pass", "passes", "she בהווה → passes.", "she → passes.", { trap: "fc-s" });
b.type("You won't pass ___ you study.", "unless", "unless", "אם לא → unless.", "if not → unless.");
b.mcq("If you finish your homework, you ___ watch the documentary.", ["can", "will can", "could to"], "רשות בתוצאה → can.", "Permission in the result → can.");
b.fix("If it *snow tomorrow, the marathon will be cancelled.", ["snows"], "אחרי if – הווה: snows.", "After if → snows.", { trap: "fc-will-if", allow: ["snow", "snows", "cancelled"] });
b.fix("If he *come late again, the boss will be angry.", ["comes"], "he בהווה → comes.", "he → comes.", { trap: "fc-s", allow: ["boss"] });
b.fix("If you don't hurry, you *miss the wedding.", ["'ll miss", "will miss"], "תוצאה בעתיד → will miss.", "Future result → will miss.", { trap: "fc-no-will" });
b.transform("It rains. We stay home.", "Join with 'If … will'.", "חברו עם If … will", ["If it rains, we'll stay home.", "If it rains, we will stay home.", "We'll stay home if it rains.", "We will stay home if it rains."], "If + הווה, will + פועל.", "If + present, will + verb.", { allow: ["rains"] });
b.transform("You will be late if you don't hurry.", "Say it with 'unless'.", "אמרו את זה עם unless", ["You will be late unless you hurry.", "You'll be late unless you hurry.", "Unless you hurry, you'll be late.", "Unless you hurry, you will be late."], "unless = if not – בלי don't.", "unless = if not.", { trap: "fc-unless" });
b.order("If you see the architect, tell her to call me.", "If + הווה, ציווי.", "If + present, imperative.");
b.cloze("Planning the trip", "If the weather {1} good, we {2} to the island. If we {3} early, we {4} the dolphins. But if it {5}, we'll go to the gallery instead.", [["be", "is"], ["sail", ["will sail", "'ll sail"]], ["leave", "leave"], ["see", ["will see", "'ll see", "might see"]], ["rain", "rains"]], "אחרי if – הווה. בתוצאה – will.", "if + present; result → will.", { allow: ["rain", "rains", "instead"] });

// ───────────── Level 3 (grade 9) ─────────────
const l3 = itemSet(T, "fc", 3);
l3.mcq("If you heat ice, it ___.", ["melts", "will melts", "melted"], "עובדה כללית (תנאי אפס) → הווה: melts.", "General fact → present: melts.", { allow: ["heat", "ice", "melts", "melted"] });
l3.mcq("You can borrow my car ___ you drive carefully.", ["as long as", "unless", "until"], "בתנאי ש… → as long as.", "On condition that → as long as.");
l3.type("___ I get home, I'll eat dinner. (I'm sure I'll get home.)", "when / if", "When", "בטוח שיקרה → When.", "Sure to happen → When.");
l3.type("Unless we ___, we'll miss the train.", "hurry", "hurry", "unless + הווה, בלי don't.", "unless + present.", { trap: "fc-unless" });
l3.mcq("Unless you ___, I'll worry.", ["call", "don't call", "will call"], "unless כבר 'אם לא' – בלי don't.", "unless already means if not.", { trap: "fc-unless" });
l3.mcq("If you mix red and blue, you ___ purple.", ["get", "will got", "got"], "עובדה כללית → הווה בשני החלקים.", "General truth → present in both parts.", { allow: ["mix", "red", "purple"] });
l3.mcq("I'll lend you the money provided that you ___ me back.", ["pay", "will pay", "paid"], "אחרי provided that – הווה: pay.", "After provided that → pay.", { allow: ["lend", "provided"] });
l3.transform("If you don't practice, you won't improve.", "Say it with 'unless'.", "אמרו את זה עם unless", ["Unless you practice, you won't improve.", "You won't improve unless you practice."], "unless + חיובי.", "unless + positive verb.");
l3.transform("It's possible that it will rain. Then we'll stay home.", "Write one first-conditional sentence.", "כתבו משפט תנאי אחד", ["If it rains, we'll stay home.", "If it rains, we will stay home.", "We'll stay home if it rains."], "If + הווה, will + פועל.", "If + present, will + verb.", { allow: ["rains", "rain"] });
l3.sort(["✓ Correct", "✗ Wrong"], [["If it rains, we'll stay in.", "✓ Correct"], ["If it will rain, we'll stay in.", "✗ Wrong"], ["Unless you hurry, you'll be late.", "✓ Correct"], ["Unless you don't hurry, you'll be late.", "✗ Wrong"], ["If you heat ice, it melts.", "✓ Correct"], ["If she come, I'll be glad.", "✗ Wrong"]], "התיקונים: If it rains · Unless you hurry · If she comes.", "Fixes: If it rains · Unless you hurry · If she comes.", { allow: ["rains", "rain", "heat", "ice", "melts"] });
l3.cloze("A deal with Mom", "\"You can go to the party as long as you {1} home by eleven. If you {2} late, I {3} worried. And unless you {4}, you won't go out next week!\"", [["be", "are"], ["be", "are"], ["be", ["will be", "'ll be"]], ["call", "call"]], "as long as / if / unless + הווה. בתוצאה – will.", "as long as / if / unless + present; result → will.");
l3.write("Write four first-conditional sentences about your plans for the weekend. Use if, unless and as long as.", "כתבו ארבעה משפטי תנאי על התוכניות שלכם לסוף השבוע. השתמשו ב-if, unless ו-as long as.", "If it's sunny, I'll go to the beach. If it rains, I'll watch a movie. I won't go out unless my friends come. I'll stay out late as long as my parents agree.", "if / unless / as long as + הווה, will + פועל.", "if / unless / as long as + present, will + verb.");

export const firstConditionalItems: GrammarItem[] = [...a.items, ...b.items, ...l3.items];
