import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: Future 'WILL + VERB' vs 'BE GOING TO + VERB' (meaning contrast).

export const willVsGoingToTopic: GrammarTopic = {
  id: "will-vs-going-to",
  group: "tenses",
  title: "will vs going to",
  titleHe: "will מול going to",
  bandRefs: ["VERBS: Future 'WILL + VERB'", "VERBS: Future 'BE GOING TO + VERB'"],
  grades: { 7: "emerging", 8: "evolving", 9: "evolving" },
  rule: {
    1: {
      points: [
        { he: "going to – תוכנית שכבר החלטנו עליה", en: "going to – a plan we already decided", examples: ["I**'m going to visit** Grandma on Saturday."] },
        { he: "will – החלטה של הרגע", en: "will – a decision made right now", examples: ["The phone is ringing. I**'ll answer** it!"] },
        { he: "will – הבטחה או הצעה לעזור", en: "will – promises and offers", examples: ["I**'ll help** you.", "I **won't tell** anyone."] },
        { he: "רמז: מילת זמן + תוכנית → going to", en: "Hint: plan + time word → going to", examples: ["tomorrow + plan → going to", "Wait! / OK! → will"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "will + base verb (decision now / promise)", example: "I'll call you back." },
        { kind: "affirmative", pattern: "am / is / are going to + base verb (plan)", example: "We're going to move next year." },
      ],
      timeWords: ["already decided", "Wait!", "OK, I'll…", "I promise", "next week"],
    },
    2: {
      points: [
        { he: "תוכנית מראש → going to. החלטה עכשיו → will", en: "Plan made before → going to. Decision now → will", examples: ["I**'m going to buy** a bike. (I saved money)", "Nice bike! I**'ll buy** it!"] },
        { he: "תחזית לפי מה שרואים → going to", en: "Prediction from evidence → going to", examples: ["Look at the sky! It**'s going to rain**."] },
        { he: "תחזית לפי דעה → will", en: "Prediction from opinion → will", examples: ["I think it **will rain** tomorrow."] },
        { he: "הבטחה, הצעה, בקשה → will", en: "Promise, offer, request → will", examples: ["**Will** you help me?", "I**'ll carry** it."] },
      ],
      form: [
        { kind: "affirmative", pattern: "going to: plan / evidence", example: "Watch out! You're going to fall!" },
        { kind: "affirmative", pattern: "will: decision now / opinion / promise / offer", example: "I think you'll like it." },
      ],
      timeWords: ["I think", "probably", "Look!", "I've decided", "I promise"],
    },
    3: {
      points: [
        { he: "אותה סיטואציה – משמעות שונה", en: "Same situation, different meaning", examples: ["I'**m going to call** her. (plan)", "I'**ll call** her. (decided now)"] },
        { he: "תחזית: סימן ברור → going to, הערכה → will", en: "Prediction: evidence → going to; opinion → will", examples: ["She's **going to win** – she's far ahead!", "I'm sure she**'ll win**."] },
        { he: "אחרי when / if לעתיד – הווה", en: "After when / if (future) – present tense", examples: ["When I **finish**, I'll call you."] },
        { he: "תוכנית מסודרת עם זמן → גם הווה מתמשך", en: "Fixed arrangement → present progressive also works", examples: ["We**'re flying** to Rome on Monday."] },
      ],
      form: [
        { kind: "affirmative", pattern: "intention → going to; spontaneous → will", example: "OK, I'll do it now." },
      ],
      timeWords: ["already", "suddenly", "on second thought", "for sure"],
    },
  },
  traps: [
    { id: "wg-plan-will", wrong: "I will visit Grandma tomorrow. I bought the bus ticket.", right: "I'm going to visit Grandma tomorrow.", whyHe: "תוכנית שכבר החלטנו עליה → going to.", whyEn: "A decided plan → going to." },
    { id: "wg-now-goingto", wrong: "The phone is ringing. I'm going to answer it.", right: "The phone is ringing. I'll answer it.", whyHe: "החלטה של הרגע → will.", whyEn: "A decision now → will." },
    { id: "wg-evidence", wrong: "Look at those clouds! It will rain.", right: "Look at those clouds! It's going to rain.", whyHe: "תחזית לפי מה שרואים → going to.", whyEn: "Evidence → going to." },
    { id: "wg-promise", wrong: "I promise I'm going to help you.", right: "I promise I'll help you.", whyHe: "הבטחה → will.", whyEn: "Promise → will." },
  ],
};

const T = "will-vs-going-to";
const B = ["will", "going to"];

function grade7() {
  const a = itemSet(T, "wg", 1, 7);
  a.mcq("The phone is ringing. I ___ it!", ["'ll answer", "'m going to answer", "answer"], "החלטה של הרגע → I'll answer.", "Decision now → I'll answer.", { trap: "wg-now-goingto" });
  a.mcq("We ___ the theater on Friday. We have tickets.", ["are going to visit", "will visit", "visit"], "תוכנית שכבר החלטנו (יש כרטיסים) → going to.", "Decided plan → going to.", { trap: "wg-plan-will" });
  a.mcq("Look at those clouds! It ___ rain.", ["is going to", "will", "is"], "רואים עננים → going to.", "Evidence → going to.", { trap: "wg-evidence", allow: ["clouds", "rain"] });
  a.mcq("I promise I ___ late again.", ["won't be", "am not going to be", "am not"], "הבטחה → will / won't.", "Promise → won't.", { trap: "wg-promise" });
  a.mcq("That bag looks heavy. I ___ you.", ["'ll help", "'m going to help", "help"], "הצעת עזרה של הרגע → I'll help.", "Offer now → I'll help.");
  a.bank("My brother ___ join the team. He decided last week.", ["is going to", "will", "is"], "החליט כבר → going to.", "Already decided → going to.");
  a.bank("\"I'm thirsty.\" \"Wait, I ___ get you some water.\"", ["will", "am going to", "am"], "Wait! = החלטה של הרגע → will.", "Wait! = decision now → will.", { allow: ["thirsty"] });
  a.bank("Be careful! You ___ fall!", ["are going to", "will", "are"], "רואים שזה עומד לקרות → going to.", "Evidence → going to.");
  a.order("I'm going to travel to the mountains next week.", "תוכנית → am going to.", "Plan → am going to.");
  a.order("OK, I'll pay for the meal.", "החלטה של הרגע → I'll.", "Decision now → I'll.");
  a.sort(B, [["The phone's ringing – I'll get it.", "will"], ["We've decided: we're moving.", "going to"], ["I promise I'll come.", "will"], ["Look out! It's falling!", "going to"], ["I think you'll like it.", "will"], ["She bought paint – she's painting her room.", "going to"]], "החלטה עכשיו / הבטחה / דעה → will. תוכנית / רואים סימן → going to.", "Decision now / promise / opinion → will. Plan / evidence → going to.");
  a.match([["It's very dark in here.", "I'll turn on the light."], ["We have tickets for Saturday.", "We're going to see a play."], ["Your bag looks heavy.", "I'll help you."], ["The sky is black.", "It's going to rain."]], "החלטה / הצעה → will. תוכנית / סימן → going to.", "Decision / offer → will. Plan / evidence → going to.", { allow: ["turn", "play", "sky", "rain"] });

  const b = itemSet(T, "wg", 2, 7);
  b.type("I've decided. I ___ the science club.", "join", ["am going to join", "'m going to join"], "החלטתי מראש → going to.", "Decided before → going to.", { trap: "wg-plan-will" });
  b.type("\"I can't find my pen.\" \"I ___ you mine.\"", "give", ["will give", "'ll give"], "הצעה של הרגע → will.", "Offer now → will.");
  b.type("Look at the river! It ___ the bridge.", "cover", ["is going to cover", "'s going to cover"], "רואים שהמים עולים → going to.", "Evidence → going to.");
  b.type("I think our team ___ tomorrow.", "win", ["will win", "'ll win"], "תחזית לפי דעה (I think) → will.", "Opinion → will.");
  b.mcq("\"We need milk.\" \"OK, I ___ some.\"", ["'ll buy", "'m going to buy", "buy"], "OK = החלטה של הרגע → will.", "OK → decision now → will.");
  b.mcq("I promise I ___ my room.", ["'ll clean", "'m going to clean", "clean"], "הבטחה → will.", "Promise → will.", { trap: "wg-promise" });
  b.mcq("The phone is ringing. I ___ it!", ["'ll answer", "'m going to answer", "answered"], "החלטה של הרגע → will.", "Decision now → will.", { trap: "wg-now-goingto" });
  b.fix("Look at those black clouds! It *will snow.", ["is going to", "'s going to"], "רואים סימן → going to.", "Evidence → going to.", { trap: "wg-evidence", allow: ["clouds", "snow"] });
  b.transform("We have a plan to visit the village.", "Say it with 'going to'.", "אמרו את זה עם going to", ["We are going to visit the village.", "We're going to visit the village."], "תוכנית → are going to visit.", "Plan → are going to visit.");
  b.transform("Do you want me to help you?", "Offer with 'will' (I'll…).", "הציעו עזרה עם will", ["I'll help you.", "I will help you."], "הצעה → I'll help you.", "Offer → I'll help you.");
  b.order("Are you going to take part in the competition?", "שאלה על תוכנית → Are you going to…?", "Asking about a plan → Are you going to…?");
  b.cloze("Saturday", "\"What {1} on Saturday?\" asked Mom. \"I {2} football with my team. We decided last week.\" \"OK. And it's very hot – I {3} you a bottle of water.\" \"Thanks! I promise I {4} it!\"", [["you / do", ["are you going to do"]], ["play", ["am going to play", "'m going to play"]], ["give", ["will give", "'ll give"]], ["not / forget", ["won't forget", "will not forget"]]], "תוכנית → going to. הצעה / הבטחה → will.", "Plan → going to. Offer / promise → will.", { allow: ["bottle", "forget"] });

  return [...a.items, ...b.items];
}

function grade8() {
  const a = itemSet(T, "wg", 1, 8);
  a.mcq("Someone is at the door. I ___ it!", ["'ll open", "'m going to open", "open"], "החלטה של הרגע → I'll open.", "Decision now → I'll open.", { trap: "wg-now-goingto" });
  a.mcq("We ___ abroad this summer. We booked a hotel.", ["are going to travel", "will travel", "travel"], "תוכנית שכבר החלטנו (הזמנו מלון) → going to.", "Decided plan → going to.", { trap: "wg-plan-will", allow: ["booked", "hotel"] });
  a.mcq("Look at the traffic! We ___ miss the plane.", ["are going to", "will", "are"], "רואים פקק → going to.", "Evidence → going to.", { trap: "wg-evidence" });
  a.mcq("I promise I ___ you every day.", ["'ll call", "'m going to call", "call"], "הבטחה → will.", "Promise → will.", { trap: "wg-promise" });
  a.mcq("The box looks heavy. I ___ it for you.", ["'ll carry", "'m going to carry", "carry"], "הצעת עזרה של הרגע → I'll carry.", "Offer now → I'll carry.", { allow: ["box"] });
  a.bank("My sister ___ study at college. She decided last year.", ["is going to", "will", "is"], "החליטה כבר → going to.", "Already decided → going to.");
  a.bank("\"I'm cold.\" \"Wait, I ___ close the window.\"", ["will", "am going to", "am"], "Wait! = החלטה של הרגע → will.", "Wait! = decision now → will.", { allow: ["window"] });
  a.bank("Watch out! That glass ___ fall!", ["is going to", "will", "is"], "רואים שזה עומד לקרות → going to.", "Evidence → going to.", { allow: ["glass"] });
  a.order("I'm going to record a song next week.", "תוכנית → am going to.", "Plan → am going to.");
  a.order("OK, I'll download it for you.", "החלטה של הרגע → I'll.", "Decision now → I'll.");
  a.sort(B, [["Someone's at the door – I'll get it.", "will"], ["We've decided: we're opening a café.", "going to"], ["I promise I'll write.", "will"], ["Look! The car's going to crash!", "going to"], ["I think you'll enjoy the concert.", "will"], ["He bought flour – he's baking a cake.", "going to"]], "החלטה עכשיו / הבטחה / דעה → will. תוכנית / סימן → going to.", "Decision now / promise / opinion → will. Plan / evidence → going to.", { allow: ["crash", "baking"] });
  a.match([["The doorbell is ringing.", "I'll get it."], ["We booked tickets for Friday.", "We're going to see a concert."], ["You look tired.", "I'll make you some tea."], ["The plane is very low.", "It's going to land."]], "החלטה / הצעה → will. תוכנית / סימן → going to.", "Decision / offer → will. Plan / evidence → going to.", { allow: ["doorbell", "booked", "tea"] });

  const b = itemSet(T, "wg", 2, 8);
  b.type("I've decided. I ___ a new camera.", "buy", ["am going to buy", "'m going to buy"], "החלטתי מראש → going to.", "Decided before → going to.", { trap: "wg-plan-will" });
  b.type("\"I don't understand this.\" \"Don't worry, I ___ it to you.\"", "explain", ["will explain", "'ll explain"], "הצעה של הרגע → will.", "Offer now → will.", { allow: ["explain"] });
  b.type("Look at that driver! He ___ the red light.", "miss", ["is going to miss", "'s going to miss"], "רואים סימן → going to.", "Evidence → going to.", { allow: ["driver", "red"] });
  b.type("I think the concert ___ amazing.", "be", ["will be", "'ll be"], "תחזית לפי דעה (I think) → will.", "Opinion → will.");
  b.mcq("\"There's no milk.\" \"OK, I ___ some at the supermarket.\"", ["'ll get", "'m going to get", "get"], "OK = החלטה של הרגע → will.", "OK → decision now → will.");
  b.mcq("I promise I ___ to her.", ["'ll apologize", "'m going to apologize", "apologized"], "הבטחה → will.", "Promise → will.", { trap: "wg-promise" });
  b.mcq("Someone's at the door. I ___ it!", ["'ll open", "'m going to open", "opened"], "החלטה של הרגע → will.", "Decision now → will.", { trap: "wg-now-goingto" });
  b.fix("Look at the sky! There *will be a storm.", ["is going to"], "רואים סימן → going to.", "Evidence → going to.", { trap: "wg-evidence", allow: ["sky", "storm"] });
  b.transform("Our plan is to travel abroad in July.", "Say it with 'going to'.", "אמרו את זה עם going to", ["We are going to travel abroad in July.", "We're going to travel abroad in July."], "תוכנית → are going to travel.", "Plan → are going to travel.");
  b.transform("Do you want me to drive you to the airport?", "Offer with 'will' (I'll…).", "הציעו עזרה עם will", ["I'll drive you to the airport.", "I will drive you to the airport."], "הצעה → I'll drive you.", "Offer → I'll drive you.");
  b.order("Are you going to perform at the concert?", "שאלה על תוכנית → Are you going to…?", "Asking about a plan → Are you going to…?");
  b.cloze("The party", "\"We {1} a party for Dad on Friday. We planned it last week.\" \"Great! I {2} a cake.\" \"Thanks! And I think he {3} really surprised. I promise I {4} anything!\"", [["have", ["are going to have", "'re going to have"]], ["bake", ["will bake", "'ll bake"]], ["be", ["will be", "'ll be"]], ["not / say", ["won't say", "will not say"]]], "תוכנית → going to. הצעה / דעה / הבטחה → will.", "Plan → going to. Offer / opinion / promise → will.", { allow: ["bake", "surprised"] });

  return [...a.items, ...b.items];
}

function grade9() {
  const a = itemSet(T, "wg", 1, 9);
  a.mcq("My phone is ringing. I ___ it!", ["'ll answer", "'m going to answer", "answer"], "החלטה של הרגע → I'll answer.", "Decision now → I'll answer.", { trap: "wg-now-goingto" });
  a.mcq("We ___ to the island next week. We rented a boat.", ["are going to sail", "will sail", "sail"], "תוכנית שכבר החלטנו → going to.", "Decided plan → going to.", { trap: "wg-plan-will", allow: ["rented"] });
  a.mcq("Look at the smoke! There ___ be a fire.", ["is going to", "will", "is"], "רואים עשן → going to.", "Evidence → going to.", { trap: "wg-evidence" });
  a.mcq("I promise I ___ your novel tomorrow.", ["'ll return", "'m going to return", "return"], "הבטחה → will.", "Promise → will.", { trap: "wg-promise" });
  a.mcq("The ladder looks heavy. I ___ it.", ["'ll carry", "'m going to carry", "carry"], "הצעת עזרה של הרגע → I'll carry.", "Offer now → I'll carry.");
  a.bank("My cousin ___ study architecture. She decided last year.", ["is going to", "will", "is"], "החליטה כבר → going to.", "Already decided → going to.", { allow: ["cousin", "architecture"] });
  a.bank("\"The sink is full.\" \"OK, I ___ do the dishes.\"", ["will", "am going to", "am"], "OK = החלטה של הרגע → will.", "OK → decision now → will.");
  a.bank("Watch out! The ladder ___ fall!", ["is going to", "will", "is"], "רואים שזה עומד לקרות → going to.", "Evidence → going to.");
  a.order("I'm going to translate the article tonight.", "תוכנית → am going to.", "Plan → am going to.");
  a.order("OK, I'll lend you my charger.", "החלטה של הרגע → I'll.", "Decision now → I'll.", { allow: ["charger"] });
  a.sort(B, [["The doorbell's ringing – I'll go.", "will"], ["We've decided: we're moving.", "going to"], ["I promise I'll text you.", "will"], ["Look! He's going to fall!", "going to"], ["I think you'll love this novel.", "will"], ["She rented a dress – she's going to the wedding.", "going to"]], "החלטה עכשיו / הבטחה / דעה → will. תוכנית / סימן → going to.", "Decision now / promise / opinion → will. Plan / evidence → going to.", { allow: ["doorbell", "text", "rented", "dress"] });
  a.match([["The elevator isn't working.", "I'll take the stairs."], ["We booked the stadium for June.", "We're going to have a marathon."], ["You look worried.", "I'll help you."], ["The oven is smoking!", "The cake is going to burn."]], "החלטה / הצעה → will. תוכנית / סימן → going to.", "Decision / offer → will. Plan / evidence → going to.", { allow: ["stairs", "booked", "smoking", "burn"] });

  const b = itemSet(T, "wg", 2, 9);
  b.type("I've decided. I ___ a vegetarian.", "become", ["am going to become", "'m going to become"], "החלטתי מראש → going to.", "Decided before → going to.", { trap: "wg-plan-will" });
  b.type("\"I can't open this jar.\" \"Give it to me. I ___ it.\"", "open", ["will open", "'ll open"], "הצעה של הרגע → will.", "Offer now → will.");
  b.type("Look at those runners! They ___ the record.", "break", ["are going to break", "'re going to break"], "רואים שהם מהירים מאוד → going to.", "Evidence → going to.", { allow: ["runners"] });
  b.type("I think the new app ___ popular.", "become", ["will become", "'ll become"], "תחזית לפי דעה (I think) → will.", "Opinion → will.");
  b.mcq("\"The neighbors are complaining.\" \"OK, I ___ the music down.\"", ["'ll turn", "'m going to turn", "turn"], "OK = החלטה של הרגע → will.", "OK → decision now → will.", { allow: ["turn"] });
  b.mcq("I promise I ___ the oven.", ["'ll repair", "'m going to repair", "repaired"], "הבטחה → will.", "Promise → will.", { trap: "wg-promise" });
  b.mcq("Someone's at the door. I ___ who it is.", ["'ll see", "'m going to see", "saw"], "החלטה של הרגע → will.", "Decision now → will.", { trap: "wg-now-goingto" });
  b.fix("Look at the dark sky! It *will snow.", ["is going to", "'s going to"], "רואים סימן → going to.", "Evidence → going to.", { trap: "wg-evidence", allow: ["sky", "snow"] });
  b.transform("Our plan is to sail to the island in August.", "Say it with 'going to'.", "אמרו את זה עם going to", ["We are going to sail to the island in August.", "We're going to sail to the island in August."], "תוכנית → are going to sail.", "Plan → are going to sail.");
  b.transform("Do you want me to wipe the table?", "Offer with 'will' (I'll…).", "הציעו עזרה עם will", ["I'll wipe the table.", "I will wipe the table.", "I'll wipe it."], "הצעה → I'll wipe the table.", "Offer → I'll wipe the table.");
  b.order("Are you going to interview the firefighter?", "שאלה על תוכנית → Are you going to…?", "Asking about a plan → Are you going to…?");
  b.cloze("Moving day", "\"We {1} to a new apartment next month. We signed the contract.\" \"Wow! I {2} you pack.\" \"Thanks! I think it {3} a lot of work. I promise I {4} you pizza!\"", [["move", ["are going to move", "'re going to move"]], ["help", ["will help", "'ll help"]], ["be", ["will be", "'ll be"]], ["buy", ["will buy", "'ll buy"]]], "תוכנית → going to. הצעה / דעה / הבטחה → will.", "Plan → going to. Offer / opinion / promise → will.", { allow: ["signed", "pack", "pizza", "wow"] });

  return [...a.items, ...b.items];
}

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "wg", 3);
l3.mcq("\"Have you decided about the summer?\" \"Yes, I ___ a job.\"", ["'m going to get", "'ll get", "get"], "החלטה שכבר קיימת → going to.", "An existing decision → going to.");
l3.mcq("She's ten meters ahead. She ___ the race!", ["'s going to win", "'ll win", "wins"], "סימן ברור → going to.", "Clear evidence → going to.", { allow: ["meters", "ahead"] });
l3.type("I'm sure you ___ the exam.", "pass", ["will pass", "'ll pass"], "הערכה / דעה (I'm sure) → will.", "Opinion (I'm sure) → will.", { allow: ["exam"] });
l3.type("When I ___ home, I'll call you.", "get", "get", "אחרי when לעתיד – הווה פשוט.", "After when (future) → present.");
l3.fix("Look out! The vase *will fall!", ["is going to", "'s going to"], "סימן ברור → going to.", "Evidence → going to.", { trap: "wg-evidence", allow: ["vase"] });
l3.mcq("\"Coffee or tea?\" \"I ___ tea, please.\"", ["'ll have", "'m going to have", "had"], "החלטה של הרגע → I'll have.", "Decision now → I'll have.", { trap: "wg-now-goingto", allow: ["tea"] });
l3.fix("I *will study medicine – I decided years ago.", ["am going to", "'m going to"], "החלטה ישנה → going to.", "Old decision → going to.", { trap: "wg-plan-will", allow: ["medicine"] });
l3.transform("I'll call her.", "Make it a plan you made earlier (going to).", "הפכו לתוכנית שהחלטתם מראש (going to)", ["I'm going to call her.", "I am going to call her."], "תוכנית → am going to call.", "Plan → am going to call.");
l3.transform("It is going to rain.", "Make it an opinion ('I think…').", "הפכו לדעה (I think…)", ["I think it will rain.", "I think it'll rain."], "דעה → I think + will.", "Opinion → I think + will.", { allow: ["rain"] });
l3.sort(B, [["I've bought the paint – I'm painting my room.", "going to"], ["Wait, I'll get a towel.", "will"], ["I'm sure you'll do well.", "will"], ["Watch out – you're going to hit the car!", "going to"], ["I promise I won't be late.", "will"], ["We've planned it: we're getting a dog.", "going to"]], "תוכנית / סימן → going to. החלטה עכשיו / דעה / הבטחה → will.", "Plan / evidence → going to. Decision now / opinion / promise → will.", { allow: ["towel", "planned"] });
l3.cloze("A busy weekend", "\"What {1} this weekend?\" \"I {2} my grandparents – it's all planned. And you?\" \"I'm not sure. Maybe I {3} at home. Oh, I know! I {4} you a cake for your trip!\" \"Thanks! I'm sure it {5} delicious.\"", [["you / do", ["are you going to do"]], ["visit", ["am going to visit", "'m going to visit"]], ["stay", ["will stay", "'ll stay"]], ["bake", ["will bake", "'ll bake"]], ["be", ["will be", "'ll be"]]], "תוכנית → going to. אולי / החלטה עכשיו / דעה → will.", "Plan → going to. Maybe / decision now / opinion → will.", { allow: ["bake", "trip", "delicious"] });
l3.write("Write a short dialogue: one person talks about a plan (going to), the other offers help or makes a promise (will).", "כתבו דיאלוג קצר: אדם אחד מספר על תוכנית (going to), והשני מציע עזרה או מבטיח (will).", "A: I'm going to paint my room on Sunday. B: Great! I'll help you. A: Thanks! B: I promise I'll be there at ten.", "תוכנית → going to. הצעה / הבטחה → will.", "Plan → going to. Offer / promise → will.");

export const willVsGoingToItems: GrammarItem[] = [...grade7(), ...grade8(), ...grade9(), ...l3.items];
