import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: VERBS: Imperative – instructions / directions, suggestions (Let's…).

export const imperativesTopic: GrammarTopic = {
  id: "imperatives",
  group: "clauses",
  title: "Imperatives & Let's",
  titleHe: "ציווי ו-Let's",
  bandRefs: ["VERBS: Imperative"],
  grades: { 7: "accurate", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "ציווי: הפועל בלבד, בלי you", en: "Imperative: just the verb, no you", examples: ["**Open** the door.", "**Sit** down, please."] },
        { he: "שלילה: Don't + פועל", en: "Negative: Don't + verb", examples: ["**Don't run**!", "**Don't touch** it."] },
        { he: "Let's + פועל = בואו נ…", en: "Let's + verb = a suggestion", examples: ["**Let's go** to the park!", "**Let's eat**."] },
        { he: "please הופך את זה למנומס", en: "please makes it polite", examples: ["**Please** close the window.", "Help me, **please**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "Base verb + …", example: "Turn left." },
        { kind: "negative", pattern: "Don't + base verb", example: "Don't be late." },
        { kind: "affirmative", pattern: "Let's + base verb", example: "Let's play." },
      ],
      timeWords: ["please", "Don't", "Let's", "never", "always"],
    },
    2: {
      points: [
        { he: "הוראות והכוונה בדרך", en: "Instructions and directions", examples: ["**Turn** left and **go** straight.", "**Mix** the flour and the eggs."] },
        { he: "Let's not = בואו לא", en: "Let's not = suggestion not to", examples: ["**Let's not** take the bus."] },
        { he: "Don't be + תואר", en: "Don't be + adjective", examples: ["**Don't be** sad.", "**Be** careful!"] },
        { he: "always / never לפני הפועל", en: "always / never before the verb", examples: ["**Always** wear a helmet.", "**Never** open the door to strangers."] },
      ],
      form: [
        { kind: "affirmative", pattern: "First / Then / Finally + base verb", example: "First, cut the bread. Then add cheese." },
        { kind: "negative", pattern: "Let's not + base verb", example: "Let's not argue." },
      ],
      timeWords: ["first", "then", "next", "finally", "Let's not"],
    },
    3: {
      points: [
        { he: "ציווי + and / or = תנאי", en: "Imperative + and / or = condition", examples: ["**Study** hard **and** you'll pass.", "**Hurry**, **or** you'll be late."] },
        { he: "Do + ציווי – הדגשה / נימוס", en: "Do + imperative – emphasis / warm invitation", examples: ["**Do** come in!", "**Do** sit down."] },
        { he: "הצעות: Why don't we…? / How about + ing", en: "Suggestions: Why don't we…? / How about + -ing", examples: ["**Why don't we** go out?", "**How about going** to the beach?"] },
        { he: "ציווי בכתב: מתכונים, הוראות, שלטים", en: "Written imperatives: recipes, rules, signs", examples: ["**Keep** off the grass.", "**Do not** enter."] },
      ],
      form: [
        { kind: "affirmative", pattern: "Imperative + and + will (result)", example: "Ask her and she'll help." },
        { kind: "question", pattern: "How about + verb-ing? / Why don't we + verb?", example: "How about watching a movie?" },
      ],
      timeWords: ["How about…?", "Why don't we…?", "or", "and"],
    },
  },
  traps: [
    { id: "im-you", wrong: "You open the window, please.", right: "Open the window, please.", whyHe: "בציווי לא אומרים you.", whyEn: "No you in an imperative." },
    { id: "im-not", wrong: "Not run in the hall!", right: "Don't run in the hall!", whyHe: "שלילה בציווי → Don't + פועל.", whyEn: "Negative → Don't + verb." },
    { id: "im-lets-to", wrong: "Let's to go home.", right: "Let's go home.", whyHe: "אחרי Let's – פועל בסיס, בלי to.", whyEn: "After Let's → base verb." },
    { id: "im-be", wrong: "Don't sad.", right: "Don't be sad.", whyHe: "לפני תואר צריך be: Don't be sad.", whyEn: "Before an adjective → be." },
    { id: "im-ing", wrong: "Don't running!", right: "Don't run!", whyHe: "אחרי Don't – פועל בסיס.", whyEn: "After Don't → base verb." },
  ],
};

const T = "imperatives";
const B = ["Do it", "Don't do it"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "im", 1, 7);
g7a.mcq("___ the door, please. It's cold.", ["Close", "You close", "Closing"], "ציווי – פועל בלבד: Close.", "Imperative → Close.", { trap: "im-you" });
g7a.mcq("___ in the river! It's dangerous.", ["Don't swim", "Not swim", "No swimming you"], "שלילה בציווי → Don't swim.", "Negative → Don't swim.", { trap: "im-not" });
g7a.mcq("Let's ___ to the club after school.", ["go", "to go", "going"], "Let's + פועל בסיס.", "Let's + base verb.", { trap: "im-lets-to" });
g7a.mcq("___ careful on the bridge!", ["Be", "Are", "You be"], "ציווי של be → Be careful.", "Be careful.");
g7a.mcq("Don't ___ late for the meal.", ["be", "are", "being"], "Don't be + תואר / מילה.", "Don't be + adjective.", { trap: "im-be" });
g7a.bank("___ your hands before you eat.", ["Wash", "Washing", "You wash"], "ציווי → Wash.", "Imperative → Wash.");
g7a.bank("___ forget your list!", ["Don't", "Not", "No"], "שלילה בציווי → Don't.", "Negative → Don't.", { trap: "im-not" });
g7a.bank("It's hot. ___ go to the river.", ["Let's", "Let", "Lets to"], "הצעה → Let's.", "Suggestion → Let's.");
g7a.order("Please sit down and open your books.", "please + ציווי + and + ציווי.", "please + imperative + and + imperative.");
g7a.order("Don't touch the oil.", "Don't + פועל + מה.", "Don't + verb + what.");
g7a.sort(B, [["Be careful.", "Do it"], ["Don't run.", "Don't do it"], ["Help your friends.", "Do it"], ["Don't shout.", "Don't do it"], ["Wash your hands.", "Do it"], ["Don't be late.", "Don't do it"]], "ציווי חיובי: פועל. שלילי: Don't + פועל.", "Positive: verb. Negative: Don't + verb.", { allow: ["shout"] });
g7a.match([["It's dark.", "Turn on the light."], ["The baby is sleeping.", "Don't make noise."], ["It's a nice day.", "Let's go to the park."], ["The river is dangerous.", "Don't swim there."]], "ציווי / שלילה / Let's לפי המצב.", "Imperative / Don't / Let's by situation.", { allow: ["turn"] });

const g7b = itemSet(T, "im", 2, 7);
g7b.type("First, ___ the bowl with water.", "fill", "fill", "הוראה → פועל בסיס: fill.", "Instruction → fill.");
g7b.type("___ open the door to strangers.", "never", "Never", "Never + פועל בציווי.", "Never + imperative.", { allow: ["strangers"] });
g7b.type("___ not take the bus. Let's walk.", "let's", "Let's", "Let's not = בואו לא.", "Let's not.");
g7b.type("___ sad. Everything will be OK.", "not / be", "Don't be", "לפני תואר → Don't be.", "Before an adjective → Don't be.", { trap: "im-be" });
g7b.mcq("___ left at the bridge, then go straight.", ["Turn", "You turn", "Turning"], "הכוונה בדרך → Turn.", "Directions → Turn.", { trap: "im-you" });
g7b.fix("*Not touch the bowl, it's hot!", ["Don't"], "שלילה בציווי → Don't.", "Negative → Don't.", { trap: "im-not" });
g7b.fix("Let's *going to the theater tonight.", ["go"], "אחרי Let's – פועל בסיס: go.", "After Let's → go.", { trap: "im-lets-to" });
g7b.fix("Don't *running in the office!", ["run"], "אחרי Don't – פועל בסיס: run.", "After Don't → run.", { trap: "im-ing" });
g7b.transform("You should help your friends.", "Make it an imperative.", "הפכו לציווי", ["Help your friends."], "ציווי – בלי you should.", "Imperative → Help your friends.");
g7b.transform("We can play football.", "Make it a suggestion with 'Let's'.", "הפכו להצעה עם Let's", ["Let's play football."], "Let's + פועל.", "Let's + verb.");
g7b.order("Turn right and go straight to the bridge.", "הכוונה: ציווי + and + ציווי.", "Directions: imperative + and + imperative.");
g7b.cloze("Club rules", "Welcome to the club! {1} on time. {2} your phone during activities. {3} the guide's instructions. {4} help your team, and {5} have fun!", [["be", "Be"], ["not / use", "Don't use"], ["follow", "Follow"], ["always", "Always"], ["let's / always", ["always", "let's"]]], "ציווי: Be / Follow. שלילה: Don't use. Always + פועל.", "Imperatives: Be / Don't use / Follow / Always.", { allow: ["welcome", "fun"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "im", 1, 8);
g8a.mcq("___ the flour into the bowl.", ["Pour", "You pour", "Pouring"], "ציווי – פועל בלבד: Pour.", "Imperative → Pour.", { trap: "im-you" });
g8a.mcq("___ your phone during the concert.", ["Don't use", "Not use", "No you use"], "שלילה בציווי → Don't use.", "Negative → Don't use.", { trap: "im-not" });
g8a.mcq("Let's ___ a cake for Mom.", ["bake", "to bake", "baking"], "Let's + פועל בסיס.", "Let's + base verb.", { trap: "im-lets-to", allow: ["bake", "baking"] });
g8a.mcq("___ quiet in the museum, please.", ["Be", "Are", "You be"], "ציווי של be → Be quiet.", "Be quiet.");
g8a.mcq("Don't ___ afraid. The dog is friendly.", ["be", "are", "being"], "Don't be + תואר.", "Don't be + adjective.", { trap: "im-be" });
g8a.bank("___ your seat belt.", ["Fasten", "Fastening", "You fasten"], "ציווי → Fasten.", "Imperative → Fasten.", { allow: ["seat", "belt", "fasten", "fastening"] });
g8a.bank("___ take photos here. It's not allowed.", ["Don't", "Not", "No"], "שלילה בציווי → Don't.", "Negative → Don't.", { trap: "im-not", allow: ["allowed"] });
g8a.bank("We're bored. ___ watch a movie.", ["Let's", "Let", "Lets to"], "הצעה → Let's.", "Suggestion → Let's.", { allow: ["bored"] });
g8a.order("Please turn off your phones before the show.", "please + ציווי.", "please + imperative.", { allow: ["turn", "phones", "show"] });
g8a.order("Don't forget your passport.", "Don't + פועל + מה.", "Don't + verb + what.", { allow: ["passport"] });
g8a.sort(B, [["Buy the tickets online.", "Do it"], ["Don't be late.", "Don't do it"], ["Try the local food.", "Do it"], ["Don't eat on the bus.", "Don't do it"], ["Book a table.", "Do it"], ["Don't forget your camera.", "Don't do it"]], "ציווי חיובי: פועל. שלילי: Don't + פועל.", "Positive: verb. Negative: Don't + verb.", { allow: ["local"] });
g8a.match([["The cake is too hot.", "Don't touch it yet."], ["We're hungry.", "Let's order pizza."], ["The concert starts soon.", "Hurry up!"], ["It's raining.", "Take an umbrella."]], "ציווי / שלילה / Let's לפי המצב.", "Imperative / Don't / Let's by situation.", { allow: ["order", "pizza", "hurry", "raining", "umbrella"] });

const g8b = itemSet(T, "im", 2, 8);
g8b.type("First, ___ the eggs and the sugar.", "mix", "mix", "הוראה במתכון → mix.", "Recipe instruction → mix.", { allow: ["eggs", "sugar"] });
g8b.type("___ leave your bag alone at the airport.", "never", "Never", "Never + פועל בציווי.", "Never + imperative.", { allow: ["alone"] });
g8b.type("___ not cook tonight. Let's go to a café.", "let's", "Let's", "Let's not = בואו לא.", "Let's not.");
g8b.type("___ nervous. You'll be great on stage!", "not / be", "Don't be", "לפני תואר → Don't be.", "Before an adjective → Don't be.", { trap: "im-be", allow: ["nervous"] });
g8b.mcq("___ straight and then turn left at the café.", ["Go", "You go", "Going"], "הכוונה בדרך → Go.", "Directions → Go.", { trap: "im-you" });
g8b.fix("*Not forget to book the tickets!", ["Don't"], "שלילה בציווי → Don't.", "Negative → Don't.", { trap: "im-not" });
g8b.mcq("Let's ___ abroad next summer.", ["travel", "to travel", "traveling"], "אחרי Let's – פועל בסיס, בלי to.", "After Let's → travel.", { trap: "im-lets-to" });
g8b.fix("Don't *talking during the movie!", ["talk"], "אחרי Don't – פועל בסיס: talk.", "After Don't → talk.", { trap: "im-ing" });
g8b.transform("You must show your ticket.", "Make it an imperative.", "הפכו לציווי", ["Show your ticket.", "Please show your ticket.", "Show your ticket, please."], "ציווי – בלי you must.", "Imperative → Show your ticket.");
g8b.transform("We could try the new café.", "Make it a suggestion with 'Let's'.", "הפכו להצעה עם Let's", ["Let's try the new café."], "Let's + פועל.", "Let's + verb.");
g8b.order("Mix the flour and pour in the milk.", "הוראות: ציווי + and + ציווי.", "Instructions: imperative + and + imperative.");
g8b.cloze("Pancake recipe", "{1} two eggs into a bowl. {2} the flour and the milk. {3} it too long. {4} a pan, and {5} burn the pancakes!", [["break", "Break"], ["add", "Add"], ["not / mix", "Don't mix"], ["heat", "Heat"], ["not", "don't"]], "מתכון = ציווי: Break / Add / Heat. שלילה: Don't.", "Recipe imperatives; negative: Don't.", { allow: ["pancake", "pancakes", "eggs", "pan", "burn", "recipe"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "im", 1, 9);
g9a.mcq("___ the stairs during a fire.", ["Use", "You use", "Using"], "ציווי – פועל בלבד: Use.", "Imperative → Use.", { trap: "im-you", allow: ["stairs"] });
g9a.mcq("___ the elevator during a fire!", ["Don't use", "Not use", "No you use"], "שלילה בציווי → Don't use.", "Negative → Don't use.", { trap: "im-not" });
g9a.mcq("Let's ___ to the island this weekend.", ["sail", "to sail", "sailing"], "Let's + פועל בסיס.", "Let's + base verb.", { trap: "im-lets-to" });
g9a.mcq("___ honest with your friends.", ["Be", "Are", "You be"], "ציווי של be → Be honest.", "Be honest.");
g9a.mcq("Don't ___ shy. Ask a question!", ["be", "are", "being"], "Don't be + תואר.", "Don't be + adjective.", { trap: "im-be" });
g9a.bank("___ the sink after you use it.", ["Wipe", "Wiping", "You wipe"], "ציווי → Wipe.", "Imperative → Wipe.");
g9a.bank("___ post photos of other people without asking.", ["Don't", "Not", "No"], "שלילה בציווי → Don't.", "Negative → Don't.", { trap: "im-not" });
g9a.bank("It's a beautiful day. ___ have lunch in the garden.", ["Let's", "Let", "Lets to"], "הצעה → Let's.", "Suggestion → Let's.");
g9a.order("Please switch off the oven when you finish.", "please + ציווי.", "please + imperative.");
g9a.order("Don't lend your password to anyone.", "Don't + פועל + מה.", "Don't + verb + what.", { allow: ["password"] });
g9a.sort(B, [["Update your apps.", "Do it"], ["Don't share your password.", "Don't do it"], ["Recycle bottles.", "Do it"], ["Don't feed the dolphins.", "Don't do it"], ["Respect your neighbors.", "Do it"], ["Don't be rude.", "Don't do it"]], "ציווי חיובי: פועל. שלילי: Don't + פועל.", "Positive: verb. Negative: Don't + verb.", { allow: ["password", "recycle", "bottles", "respect", "rude"] });
g9a.match([["There's smoke in the kitchen!", "Call the firefighters."], ["The neighbors are sleeping.", "Don't play loud music."], ["We have a free afternoon.", "Let's visit the gallery."], ["The floor is wet.", "Be careful!"]], "ציווי / שלילה / Let's לפי המצב.", "Imperative / Don't / Let's by situation.", { allow: ["floor", "wet"] });

const g9b = itemSet(T, "im", 2, 9);
g9b.type("First, ___ the ladder against the wall.", "lean", "lean", "הוראה → פועל בסיס: lean.", "Instruction → lean.", { allow: ["wall"] });
g9b.type("___ leave candles burning when you go out.", "never", "Never", "Never + פועל בציווי.", "Never + imperative.", { allow: ["burning"] });
g9b.type("___ not binge-watch tonight. We have a test.", "let's", "Let's", "Let's not = בואו לא.", "Let's not.");
g9b.type("___ rude to the neighbors.", "not / be", "Don't be", "לפני תואר → Don't be.", "Before an adjective → Don't be.", { trap: "im-be", allow: ["rude"] });
g9b.mcq("___ past the stadium and turn right at the tower.", ["Walk", "You walk", "Walking"], "הכוונה בדרך → Walk.", "Directions → Walk.", { trap: "im-you" });
g9b.fix("*Not use the elevator in an emergency!", ["Don't"], "שלילה בציווי → Don't.", "Negative → Don't.", { trap: "im-not" });
g9b.mcq("Let's ___ the firefighter tomorrow.", ["interview", "to interview", "interviewing"], "אחרי Let's – פועל בסיס, בלי to.", "After Let's → interview.", { trap: "im-lets-to" });
g9b.fix("Don't *complaining all the time!", ["complain"], "אחרי Don't – פועל בסיס: complain.", "After Don't → complain.", { trap: "im-ing" });
g9b.transform("You must switch off your phone.", "Make it an imperative.", "הפכו לציווי", ["Switch off your phone.", "Please switch off your phone.", "Switch off your phone, please."], "ציווי – בלי you must.", "Imperative → Switch off your phone.");
g9b.transform("We could visit the exhibition.", "Make it a suggestion with 'Let's'.", "הפכו להצעה עם Let's", ["Let's visit the exhibition."], "Let's + פועל.", "Let's + verb.");
g9b.order("Wipe the table and put the dishes in the sink.", "הוראות: ציווי + and + ציווי.", "Instructions: imperative + and + imperative.");
g9b.cloze("Fire safety", "If there's a fire: {1} calm. {2} the elevator – {3} the stairs. {4} the firefighters on 102, and {5} go back inside!", [["be", ["Be", "Stay"]], ["not / use", "Don't use"], ["use", "use"], ["call", "Call"], ["never", "never"]], "ציווי: Be / use / Call. שלילה: Don't use. never + פועל.", "Imperatives; Don't use; never.", { allow: ["calm", "stairs", "safety", "inside"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "im", 3);
l3.mcq("Study hard, ___ you'll pass the exam.", ["and", "or", "but"], "ציווי + and = אם תעשה… → and.", "Imperative + and = condition.", { allow: ["exam"] });
l3.mcq("Hurry up, ___ you'll miss the bus.", ["or", "and", "so"], "ציווי + or = אחרת… → or.", "Imperative + or = otherwise.", { allow: ["hurry"] });
l3.type("How about ___ to the beach?", "go", "going", "המבנה: How about + ing.", "How about + -ing.", { allow: ["beach"] });
l3.type("Why don't we ___ a movie tonight?", "watch", "watch", "Why don't we + פועל בסיס.", "Why don't we + base verb.");
l3.mcq("Let's not ___ about it.", ["argue", "to argue", "arguing"], "Let's not + פועל, בלי to.", "Let's not + verb.");
l3.mcq("How about ___ to the gallery?", ["going", "to go", "go"], "המבנה: How about + ing: going.", "How about + -ing.");
l3.mcq("___ late tomorrow!", ["Don't be", "You don't be", "Not be"], "בציווי לא אומרים you: Don't be late.", "No you in an imperative.", { trap: "im-you" });
l3.transform("Let's go to the park.", "Say it with 'How about…?'.", "אמרו את זה עם How about…?", ["How about going to the park?"], "המבנה: How about + ing.", "How about + -ing.");
l3.transform("If you ask her, she'll help you.", "Say it with an imperative + 'and'.", "אמרו את זה עם ציווי + and", ["Ask her and she'll help you.", "Ask her, and she'll help you.", "Ask her and she will help you."], "ציווי + and + תוצאה.", "Imperative + and + result.");
l3.sort(["✓ Correct", "✗ Wrong"], [["Don't be sad.", "✓ Correct"], ["Don't sad.", "✗ Wrong"], ["Let's go home.", "✓ Correct"], ["Let's to go home.", "✗ Wrong"], ["How about eating out?", "✓ Correct"], ["Not touch it!", "✗ Wrong"]], "התיקונים: Don't be sad · Let's go · Don't touch it.", "Fixes: Don't be sad · Let's go · Don't touch it.");
l3.cloze("Planning the weekend", "\"What shall we do? {1} going to the beach?\" \"It's too hot. {2} we go to the museum?\" \"OK, but {3} take the bus – it's always late. {4} walk, it's not far.\" \"Fine. {5} forget your water bottle!\"", [["how about", "How about"], ["why don't", "Why don't"], ["let's not", "let's not"], ["let's", "Let's"], ["don't", "Don't"]], "המבנה: How about + ing / Why don't we / Let's (not) / Don't.", "Suggestions and imperatives.", { allow: ["beach", "bottle", "fine"] });
l3.write("Write short instructions for a younger student: how to prepare for a test. Use imperatives, Don't and Let's.", "כתבו הוראות קצרות לתלמיד צעיר: איך להתכונן למבחן. השתמשו בציווי, ב-Don't וב-Let's.", "Start studying a week before. Make a list of topics. Don't study all night – sleep well. Ask your teacher for help. Let's study together on Sunday!", "ציווי: פועל בסיס. Don't + פועל. Let's + פועל.", "Base verb / Don't + verb / Let's + verb.");

export const imperativesItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
