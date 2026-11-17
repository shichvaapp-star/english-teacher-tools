import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG, QUE } from "@/data/grammar/build";

// Band II: VERBS: Past simple - lexical verbs (regular), Past simple (irregular), Past simple, Past simple - questions.

export const pastSimpleTopic: GrammarTopic = {
  id: "past-simple",
  group: "tenses",
  title: "Past Simple",
  titleHe: "עבר פשוט",
  bandRefs: ["VERBS: Past simple - lexical verbs (regular)", "VERBS: Past simple (irregular)", "VERBS: Past simple", "VERBS: Past simple - questions"],
  grades: { 7: "evolving", 8: "evolving", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "עבר: מוסיפים ed לפועל", en: "Past: verb + ed", examples: ["I **played** football yesterday.", "We **watched** a movie."] },
        { he: "יש פעלים יוצאי דופן – צריך לזכור", en: "Irregular verbs – learn them", examples: ["go → **went**", "have → **had**", "see → **saw**", "eat → **ate**"], chips: true },
        { he: "שלילה: didn't + הפועל הרגיל", en: "Negative: didn't + base verb", examples: ["She **didn't go** to school.", "We **didn't play**."] },
        { he: "שאלה: Did + נושא + הפועל הרגיל", en: "Question: Did + subject + base verb", examples: ["**Did** you **see** it?", "**Did** they **win**?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "verb + ed / irregular past (all subjects)", example: "He walked. She went." },
        { kind: "negative", pattern: "didn't + base verb", example: "They didn't come." },
        { kind: "question", pattern: "Did + subject + base verb?", example: "Did he call?" },
      ],
      timeWords: ["yesterday", "last night", "last week", "two days ago", "in 2020"],
    },
    2: {
      points: [
        { he: "כתיב: like → liked, stop → stopped, study → studied", en: "Spelling: like → liked, stop → stopped, study → studied", examples: ["like**d**", "stop**ped**", "stud**ied**", "play**ed**"], chips: true },
        { he: "פעלים יוצאי דופן נפוצים", en: "Common irregular verbs", examples: ["buy → **bought**", "come → **came**", "take → **took**", "write → **wrote**", "win → **won**", "make → **made**"], chips: true },
        { he: "אחרי did / didn't – צורת הבסיס", en: "After did / didn't – base form", examples: ["**Did** he **go**?", "✗ Did he went?"] },
        { he: "מילות זמן של עבר", en: "Past time words", examples: ["yesterday", "last week", "two days ago", "when I was young"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "verb-ed / irregular", example: "I bought a new phone." },
        { kind: "negative", pattern: "didn't + base verb", example: "We didn't buy it." },
        { kind: "question", pattern: "(Wh-) + did + subject + base verb?", example: "Where did you go?" },
        { kind: "short_answer", pattern: "Yes, … did. No, … didn't.", example: "No, I didn't." },
      ],
      timeWords: ["yesterday", "last year", "ago", "in the past", "then"],
    },
    3: {
      points: [
        { he: "פעולה שהסתיימה בזמן מוגדר בעבר", en: "Finished actions at a definite past time", examples: ["I **met** him two years **ago**.", "The war **ended** in 1945."] },
        { he: "רצף פעולות בסיפור", en: "A sequence of actions in a story", examples: ["She **opened** the door, **looked** around and **left**."] },
        { he: "שאלה על הנושא – בלי did", en: "Subject questions – no did", examples: ["**Who** broke the window?", "What **happened**?"] },
        { he: "פעלים יוצאי דופן פחות נפוצים", en: "Less common irregular verbs", examples: ["catch → **caught**", "teach → **taught**", "fall → **fell**", "steal → **stole**"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "past form + time in the past", example: "They moved here in 2015." },
        { kind: "question", pattern: "Who / What + past verb? (subject question)", example: "Who won the game?" },
        { kind: "question", pattern: "Wh- + did + subject + base verb? (object question)", example: "Who did you see?" },
      ],
      timeWords: ["ago", "in 1999", "last century", "first … then … finally"],
    },
  },
  traps: [
    { id: "pst-irregular", wrong: "I goed home.", right: "I went home.", whyHe: "go הוא פועל יוצא דופן: went.", whyEn: "go is irregular: went." },
    { id: "pst-did-past", wrong: "Did you saw it?", right: "Did you see it?", whyHe: "אחרי Did הפועל בצורת הבסיס (see).", whyEn: "After Did → base form (see)." },
    { id: "pst-didnt-past", wrong: "She didn't went.", right: "She didn't go.", whyHe: "אחרי didn't הפועל בצורת הבסיס.", whyEn: "After didn't → base form." },
    { id: "pst-present", wrong: "Yesterday I play football.", right: "Yesterday I played football.", whyHe: "yesterday = עבר – צריך played.", whyEn: "yesterday → played." },
    { id: "pst-spelling", wrong: "He stoped the car.", right: "He stopped the car.", whyHe: "עיצור-תנועה-עיצור: מכפילים (stop → stopped).", whyEn: "Double the last letter: stopped." },
    { id: "pst-who", wrong: "Who did call you?", right: "Who called you?", whyHe: "כששואלים על הנושא (מי עשה) – בלי did.", whyEn: "Subject questions – no did." },
  ],
};

const T = "past-simple";
const B = ["+ ed", "irregular"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "pst", 1, 7);
g7a.mcq("Yesterday our team ___ the game.", ["won", "win", "winned"], "win הוא יוצא דופן: won.", "win is irregular: won.", { trap: "pst-irregular" });
g7a.mcq("We ___ a movie last night.", ["watched", "watch", "watches"], "last night = עבר: watch + ed.", "last night → watched.", { trap: "pst-present" });
g7a.mcq("I ___ to the mountains last summer.", ["went", "goed", "go"], "go הוא יוצא דופן: went.", "go is irregular: went.", { trap: "pst-irregular" });
g7a.mcq("She ___ come to the club yesterday.", ["didn't", "doesn't", "wasn't"], "שלילה בעבר: didn't + פועל בסיס.", "Past negative: didn't + base verb.");
g7a.mcq("___ you help your mom yesterday?", ["Did", "Do", "Were"], "שאלה בעבר: Did + you + פועל בסיס?", "Past question: Did you…?");
g7a.bank("My dad ___ us to the river last week.", ["drove", "drive", "drived"], "drive הוא יוצא דופן: drove.", "drive is irregular: drove.", { trap: "pst-irregular" });
g7a.bank("They ___ the bridge two days ago.", ["crossed", "cross", "crosses"], "two days ago = עבר: cross + ed.", "two days ago → crossed.");
g7a.bank("Did you ___ the lemons?", ["buy", "bought", "buys"], "אחרי Did – צורת הבסיס: buy.", "After Did → buy.", { trap: "pst-did-past" });
g7a.order("We traveled to a small village.", "מי + פועל בעבר + לאן.", "Who + past verb + where.");
g7a.order("Did she join the science club?", "שאלה: Did + she + פועל בסיס?", "Question: Did + she + base verb?");
g7a.sort(B, [["play", "+ ed"], ["go", "irregular"], ["help", "+ ed"], ["eat", "irregular"], ["travel", "+ ed"], ["see", "irregular"]], "רוב הפעלים: + ed. go → went, eat → ate, see → saw.", "Most verbs: + ed. go → went, eat → ate, see → saw.");
g7a.match([["go", "went"], ["have", "had"], ["eat", "ate"], ["see", "saw"]], "צורות עבר של פעלים יוצאי דופן.", "Past forms of irregular verbs.", { instr: "התאימו כל פועל לצורת העבר שלו" });

const g7b = itemSet(T, "pst", 2, 7);
g7b.type("Last year my brother ___ a great job.", "find", "found", "find הוא יוצא דופן: found.", "find is irregular: found.", { trap: "pst-irregular" });
g7b.type("The guide ___ at the top of the mountain.", "stop", "stopped", "stop → stopped (מכפילים p).", "stop → stopped (double p).", { trap: "pst-spelling" });
g7b.type("We ___ math at school yesterday.", "study", "studied", "study → studied (y הופך ל-ied).", "study → studied.");
g7b.type("I ___ my homework. Sorry!", "not / do", ["didn't do", "did not do"], "שלילה בעבר: didn't + do.", "Past negative: didn't do.", { trap: "pst-didnt-past" });
g7b.mcq("Where ___ you go on your journey?", ["did", "do", "were"], "שאלה בעבר: Where + did + you + go?", "Past question: Where did you go?");
g7b.fix("Yesterday I *play with my team.", ["played"], "yesterday = עבר: played.", "yesterday → played.", { trap: "pst-present" });
g7b.fix("Did you *saw the river?", ["see"], "אחרי Did – צורת בסיס: see.", "After Did → see.", { trap: "pst-did-past" });
g7b.fix("She didn't *came to the theater.", ["come"], "אחרי didn't – צורת בסיס: come.", "After didn't → come.", { trap: "pst-didnt-past" });
g7b.transform("They joined the club.", ...NEG, ["They didn't join the club.", "They did not join the club."], "שלילה: didn't + join (בלי ed).", "didn't + join (no -ed).");
g7b.transform("He paid for the meal.", ...QUE, "Did he pay for the meal?", "שאלה: Did + he + pay (צורת בסיס).", "Did + he + pay?", { trap: "pst-did-past" });
g7b.order("What did you eat for dinner?", "מילת שאלה + did + you + פועל בסיס?", "Wh- + did + you + base verb?");
g7b.cloze("A school trip", "Last week our class {1} a trip to the north. We {2} by bus and {3} near a river. We {4} a lot of fun, but we {5} the mountain because it was dangerous.", [["take", "took"], ["travel", ["traveled", "travelled"]], ["sleep", "slept"], ["have", "had"], ["not / climb", ["didn't climb", "did not climb"]]], "Last week = עבר. take → took, sleep → slept, have → had. שלילה: didn't climb.", "Past: took, traveled, slept, had, didn't climb.", { allow: ["trip", "north", "climb"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "pst", 1, 8);
g8a.mcq("Last night we ___ to a great concert.", ["went", "go", "goed"], "go הוא יוצא דופן: went.", "go is irregular: went.", { trap: "pst-irregular" });
g8a.mcq("She ___ the cake for the party yesterday.", ["decorated", "decorates", "decorate"], "yesterday = עבר: decorate + d.", "yesterday → decorated.", { trap: "pst-present" });
g8a.mcq("I ___ a new camera last month.", ["bought", "buyed", "buy"], "buy הוא יוצא דופן: bought.", "buy is irregular: bought.", { trap: "pst-irregular" });
g8a.mcq("We ___ visit the museum. It was closed.", ["didn't", "don't", "weren't"], "שלילה בעבר: didn't + פועל בסיס.", "Past negative: didn't + base verb.");
g8a.mcq("___ you download the song yesterday?", ["Did", "Do", "Were"], "שאלה בעבר: Did + you + פועל בסיס?", "Past question: Did you…?");
g8a.bank("The plane ___ at the airport an hour ago.", ["landed", "land", "lands"], "an hour ago = עבר: land + ed.", "an hour ago → landed.");
g8a.bank("My grandfather ___ in a factory.", ["worked", "work", "works"], "בעבר (הוא כבר לא עובד): worked.", "past → worked.");
g8a.bank("Did they ___ the competition?", ["win", "won", "wins"], "אחרי Did – צורת הבסיס: win.", "After Did → win.", { trap: "pst-did-past" });
g8a.order("They traveled abroad last summer.", "מי + פועל בעבר + לאן + מתי.", "Who + past verb + where + when.");
g8a.order("Did you enjoy the concert?", "שאלה: Did + you + פועל בסיס?", "Question: Did + you + base verb?");
g8a.sort(B, [["cook", "+ ed"], ["buy", "irregular"], ["decorate", "+ ed"], ["make", "irregular"], ["invent", "+ ed"], ["take", "irregular"]], "רוב הפעלים: + ed. buy → bought, make → made, take → took.", "Most verbs: + ed. buy → bought, make → made, take → took.");
g8a.match([["buy", "bought"], ["make", "made"], ["take", "took"], ["come", "came"]], "צורות עבר של פעלים יוצאי דופן.", "Past forms of irregular verbs.", { instr: "התאימו כל פועל לצורת העבר שלו" });

const g8b = itemSet(T, "pst", 2, 8);
g8b.type("Last year my uncle ___ his own business.", "begin", "began", "begin הוא יוצא דופן: began.", "begin is irregular: began.", { trap: "pst-irregular" });
g8b.type("The car ___ at the traffic lights.", "stop", "stopped", "stop → stopped (מכפילים p).", "stop → stopped (double p).", { trap: "pst-spelling", allow: ["lights"] });
g8b.type("She ___ for the competition for months.", "practice", "practiced", "practice → practiced (מוסיפים רק d).", "practice → practiced (+ d).");
g8b.type("We ___ the movie. It was boring.", "not / enjoy", ["didn't enjoy", "did not enjoy"], "שלילה בעבר: didn't + enjoy.", "Past negative: didn't enjoy.", { trap: "pst-didnt-past", allow: ["boring"] });
g8b.mcq("How much ___ the tickets cost?", ["did", "do", "were"], "שאלה בעבר: How much + did + the tickets + cost?", "Past question: How much did … cost?");
g8b.fix("Last weekend we *cook a traditional dish.", ["cooked"], "Last weekend = עבר: cooked.", "Last weekend → cooked.", { trap: "pst-present" });
g8b.fix("Did she *bought a new jacket?", ["buy"], "אחרי Did – צורת בסיס: buy.", "After Did → buy.", { trap: "pst-did-past" });
g8b.fix("The actors didn't *knew their lines.", ["know"], "אחרי didn't – צורת בסיס: know.", "After didn't → know.", { trap: "pst-didnt-past" });
g8b.transform("He apologized to his friend.", ...NEG, ["He didn't apologize to his friend.", "He did not apologize to his friend."], "שלילה: didn't + apologize (בלי d).", "didn't + apologize (no -d).");
g8b.transform("They took the train to the airport.", ...QUE, "Did they take the train to the airport?", "שאלה: Did + they + take (צורת בסיס).", "Did + they + take?", { trap: "pst-did-past" });
g8b.order("Why did you leave the party early?", "מילת שאלה + did + you + פועל בסיס?", "Wh- + did + you + base verb?");
g8b.cloze("A day at the seaside", "Last Saturday we {1} to the seaside. My dad {2} the car near the café, and we {3} sandwiches on the beach. My sister {4} her camera, so she {5} any photos.", [["drive", "drove"], ["park", "parked"], ["eat", "ate"], ["forget", "forgot"], ["not / take", ["didn't take", "did not take"]]], "Last Saturday = עבר. drive → drove, eat → ate, forget → forgot. שלילה: didn't take.", "Past: drove, parked, ate, forgot, didn't take.", { allow: ["sandwiches", "beach", "forget", "forgot"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "pst", 1, 9);
g9a.mcq("Yesterday I ___ a funny selfie.", ["took", "taked", "take"], "take הוא יוצא דופן: took.", "take is irregular: took.", { trap: "pst-irregular" });
g9a.mcq("She ___ the article into Hebrew last week.", ["translated", "translates", "translate"], "last week = עבר: translate + d.", "last week → translated.", { trap: "pst-present" });
g9a.mcq("We ___ a stranger at the station.", ["met", "meeted", "meet"], "meet הוא יוצא דופן: met.", "meet is irregular: met.", { trap: "pst-irregular" });
g9a.mcq("My parents ___ come to the wedding.", ["didn't", "don't", "weren't"], "שלילה בעבר: didn't + פועל בסיס.", "Past negative: didn't + base verb.");
g9a.mcq("___ you borrow my charger yesterday?", ["Did", "Do", "Were"], "שאלה בעבר: Did + you + פועל בסיס?", "Past question: Did you…?", { allow: ["charger"] });
g9a.bank("The firefighters ___ the fire last night.", ["fought", "fighted", "fight"], "fight הוא יוצא דופן: fought.", "fight is irregular: fought.", { trap: "pst-irregular" });
g9a.bank("I ___ the oven an hour ago.", ["cleaned", "clean", "cleans"], "an hour ago = עבר: clean + ed.", "an hour ago → cleaned.");
g9a.bank("Did you ___ the documentary?", ["watch", "watched", "watches"], "אחרי Did – צורת הבסיס: watch.", "After Did → watch.", { trap: "pst-did-past" });
g9a.order("We sailed to the island last summer.", "מי + פועל בעבר + לאן + מתי.", "Who + past verb + where + when.");
g9a.order("Did he repair the elevator?", "שאלה: Did + he + פועל בסיס?", "Question: Did + he + base verb?");
g9a.sort(B, [["borrow", "+ ed"], ["fight", "irregular"], ["translate", "+ ed"], ["meet", "irregular"], ["complain", "+ ed"], ["lose", "irregular"]], "רוב הפעלים: + ed. fight → fought, meet → met, lose → lost.", "Most verbs: + ed. fight → fought, meet → met, lose → lost.");
g9a.match([["fight", "fought"], ["meet", "met"], ["lose", "lost"], ["write", "wrote"]], "צורות עבר של פעלים יוצאי דופן.", "Past forms of irregular verbs.", { instr: "התאימו כל פועל לצורת העבר שלו" });

const g9b = itemSet(T, "pst", 2, 9);
g9b.type("Last year my cousin ___ a novel.", "write", "wrote", "write הוא יוצא דופן: wrote.", "write is irregular: wrote.", { trap: "pst-irregular", allow: ["cousin"] });
g9b.type("The dolphin ___ next to our boat.", "swim", "swam", "swim הוא יוצא דופן: swam.", "swim is irregular: swam.", { trap: "pst-irregular" });
g9b.type("He ___ to the manager about the noise.", "complain", "complained", "מוסיפים ed: complained.", "complain → complained.", { allow: ["manager"] });
g9b.type("We ___ the marathon. It was too hot.", "not / finish", ["didn't finish", "did not finish"], "שלילה בעבר: didn't + finish.", "Past negative: didn't finish.", { trap: "pst-didnt-past" });
g9b.mcq("When ___ your grandparents move to Israel?", ["did", "do", "were"], "שאלה בעבר: When + did + your grandparents + move?", "Past question: When did … move?");
g9b.fix("Last night my brother *binge-watch a whole series.", ["binge-watched"], "Last night = עבר: binge-watched.", "Last night → binge-watched.", { trap: "pst-present", allow: ["whole"] });
g9b.fix("Did she *wrote the article herself?", ["write"], "אחרי Did – צורת בסיס: write.", "After Did → write.", { trap: "pst-did-past" });
g9b.fix("The neighbors didn't *heard the noise.", ["hear"], "אחרי didn't – צורת בסיס: hear.", "After didn't → hear.", { trap: "pst-didnt-past" });
g9b.transform("She borrowed my jacket.", ...NEG, ["She didn't borrow my jacket.", "She did not borrow my jacket."], "שלילה: didn't + borrow (בלי ed).", "didn't + borrow (no -ed).");
g9b.transform("They lost the match.", ...QUE, "Did they lose the match?", "שאלה: Did + they + lose (צורת בסיס).", "Did + they + lose?", { trap: "pst-did-past" });
g9b.order("Where did you buy your furniture?", "מילת שאלה + did + you + פועל בסיס?", "Wh- + did + you + base verb?");
g9b.cloze("A strange morning", "This morning I {1} up late. The elevator {2} working, so I {3} down the stairs. At the station I {4} my wallet, and I {5} my bus!", [["wake", "woke"], ["not / be", ["wasn't", "was not"]], ["run", "ran"], ["lose", "lost"], ["miss", "missed"]], "עבר: wake → woke, run → ran, lose → lost. שלילה של be: wasn't.", "Past: woke, wasn't, ran, lost, missed.", { allow: ["stairs", "wake", "woke"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "pst", 3);
l3.mcq("Who ___ the window?", ["broke", "did break", "breaked"], "שאלה על הנושא (מי?) – בלי did: Who broke…?", "Subject question – no did: Who broke…?", { trap: "pst-who" });
l3.mcq("What ___ you tell your parents?", ["did", "do", "was"], "שאלה על המושא – עם did: What did you tell…?", "Object question → What did you tell…?");
l3.type("The thief ___ my bike from the garden.", "steal", "stole", "steal הוא יוצא דופן: stole.", "steal is irregular: stole.", { trap: "pst-irregular", allow: ["thief"] });
l3.type("Our teacher ___ us a new song yesterday.", "teach", "taught", "teach הוא יוצא דופן: taught.", "teach is irregular: taught.", { trap: "pst-irregular" });
l3.fix("Who *did call you last night?", ["called"], "שאלה על הנושא – בלי did: Who called you?", "Subject question: Who called you?", { trap: "pst-who" });
l3.fix("She *catched the ball with one hand.", ["caught"], "catch הוא יוצא דופן: caught.", "catch is irregular: caught.", { trap: "pst-irregular" });
l3.fix("Did the war *ended in 1945?", ["end"], "אחרי Did – צורת בסיס: end.", "After Did → end.", { trap: "pst-did-past", allow: ["war"] });
l3.transform("Somebody took my phone.", "Ask a question with 'Who'.", "שאלו שאלה עם Who", ["Who took your phone?", "Who took my phone?"], "שאלה על הנושא: Who + took…? (בלי did)", "Subject question: Who took…?", { trap: "pst-who" });
l3.transform("They moved to Haifa in 2015.", "Ask a question with 'When'.", "שאלו שאלה עם When", ["When did they move to Haifa?"], "שאלה בעבר: When + did + they + move?", "When did they move…?");
l3.sort(["✓ Correct", "✗ Wrong"], [["What happened?", "✓ Correct"], ["Who did win the game?", "✗ Wrong"], ["I met her two years ago.", "✓ Correct"], ["Did you went there?", "✗ Wrong"], ["She fell off her bike.", "✓ Correct"], ["They didn't bought it.", "✗ Wrong"]], "התיקונים: Who won · Did you go · They didn't buy.", "Fixes: Who won · Did you go · They didn't buy.");
l3.cloze("A lucky escape", "Last winter my uncle {1} in the mountains. Suddenly the weather {2}, and he {3} his way. He {4} his phone, but it {5} work. Finally a guide {6} him.", [["hike", "hiked"], ["change", "changed"], ["lose", "lost"], ["try", "tried"], ["not", ["didn't", "did not"]], ["find", "found"]], "עבר: hike → hiked, lose → lost, try → tried, find → found. שלילה: didn't work.", "Past: hiked, changed, lost, tried, didn't, found.", { allow: ["hike", "hiked", "suddenly", "winter", "escape", "lucky"] });
l3.write("Write about something interesting that happened to you or your family. Use at least two irregular verbs.", "כתבו על משהו מעניין שקרה לכם או למשפחה שלכם. השתמשו לפחות בשני פעלים יוצאי דופן.", "Last summer we went to Eilat. We swam with dolphins and I took a lot of photos. I didn't want to go home!", "עבר: ed או צורה יוצאת דופן. שלילה ושאלה עם did.", "Past: -ed or irregular. Negatives and questions with did.");

export const pastSimpleItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
