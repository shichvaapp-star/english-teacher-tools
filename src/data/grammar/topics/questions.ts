import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: CLAUSES: Interrogative + the question forms of all tenses and modals.

export const questionsTopic: GrammarTopic = {
  id: "questions",
  group: "questions",
  title: "Questions (Yes/No & Wh-)",
  titleHe: "שאלות – כן/לא ומילות שאלה",
  bandRefs: ["CLAUSES: Interrogative", "VERBS: Present simple - questions", "VERBS: Past simple - questions"],
  grades: { 7: "evolving", 8: "evolving", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "שאלת כן/לא: פועל העזר בהתחלה", en: "Yes/No questions: helping verb first", examples: ["**Do** you like it?", "**Is** she here?", "**Can** you swim?"] },
        { he: "מילות שאלה", en: "Question words", examples: ["What", "Where", "When", "Who", "Why", "How"], chips: true },
        { he: "מילת שאלה + פועל עזר + נושא + פועל", en: "Question word + helper + subject + verb", examples: ["Where **do** you live?", "What **is** he doing?"] },
        { he: "תשובות קצרות", en: "Short answers", examples: ["Yes, I **do**.", "No, she **isn't**."] },
      ],
      form: [
        { kind: "question", pattern: "Do / Does / Did + subject + verb?", example: "Did you see it?" },
        { kind: "question", pattern: "Am / Is / Are / Was / Were + subject …?", example: "Are they ready?" },
        { kind: "question", pattern: "Wh- + helper + subject + verb?", example: "Why are you late?" },
        { kind: "short_answer", pattern: "Yes, … do / is / can. No, … don't / isn't / can't.", example: "No, I can't." },
      ],
      timeWords: ["What", "Where", "When", "Who", "Why", "How"],
    },
    2: {
      points: [
        { he: "בוחרים פועל עזר לפי הזמן", en: "Choose the helper by tense", examples: ["do / does – present", "did – past", "am / is / are + -ing", "will – future"], chips: true },
        { he: "How + מילה: How many / much / often / long", en: "How many / much / often / long", examples: ["**How many** brothers do you have?", "**How often** do you swim?"] },
        { he: "Whose = של מי, Which = איזה (מתוך כמה)", en: "Whose = belonging to whom, Which = from a choice", examples: ["**Whose** bag is this?", "**Which** color do you want?"] },
        { he: "עם be ו-can לא משתמשים ב-do", en: "No do with be or can", examples: ["**Can** you help?", "✗ Do you can help?"] },
      ],
      form: [
        { kind: "question", pattern: "How many + plural / How much + uncountable", example: "How much water do you drink?" },
        { kind: "question", pattern: "Whose + noun + be …?", example: "Whose phone is ringing?" },
        { kind: "short_answer", pattern: "Yes, … did / will / was. No, … didn't / won't / wasn't.", example: "Yes, it was." },
      ],
      timeWords: ["How many", "How much", "How often", "How long", "Whose", "Which"],
    },
    3: {
      points: [
        { he: "שאלה על הנושא (מי עשה?) – בלי do / did", en: "Subject questions – no do / did", examples: ["**Who** called you?", "What **happened**?"] },
        { he: "מילת יחס בסוף השאלה", en: "Prepositions at the end", examples: ["Who are you talking **to**?", "What are you looking **at**?"] },
        { he: "שאלות שליליות – הפתעה", en: "Negative questions – surprise", examples: ["**Don't** you like it?", "**Isn't** she coming?"] },
        { he: "שאלה עקיפה – סדר רגיל, בלי do", en: "Indirect questions – normal word order", examples: ["Do you know where **he lives**?", "✗ Do you know where does he live?"] },
      ],
      form: [
        { kind: "question", pattern: "Who / What + verb … ? (subject)", example: "Who broke the window?" },
        { kind: "question", pattern: "Can you tell me / Do you know + wh- + subject + verb?", example: "Can you tell me what time it is?" },
      ],
      timeWords: ["Who …?", "What …?", "Do you know …?", "Can you tell me …?"],
    },
  },
  traps: [
    { id: "q-no-aux", wrong: "You like pizza?", right: "Do you like pizza?", whyHe: "בעברית שאלה היא רק טון. באנגלית צריך פועל עזר בהתחלה.", whyEn: "English questions need a helping verb first." },
    { id: "q-order", wrong: "Where you live?", right: "Where do you live?", whyHe: "אחרי מילת השאלה – פועל עזר ואז הנושא.", whyEn: "After the question word: helper, then subject." },
    { id: "q-double", wrong: "Does she likes it?", right: "Does she like it?", whyHe: "אחרי does / did – הפועל בצורת בסיס.", whyEn: "After does / did → base verb." },
    { id: "q-do-be", wrong: "Do you are happy?", right: "Are you happy?", whyHe: "עם be לא שמים do.", whyEn: "No do with be." },
    { id: "q-subject", wrong: "Who did call you?", right: "Who called you?", whyHe: "כששואלים מי עשה – בלי did.", whyEn: "Subject questions – no did." },
    { id: "q-indirect", wrong: "Do you know where does he live?", right: "Do you know where he lives?", whyHe: "בשאלה עקיפה – סדר של משפט רגיל.", whyEn: "Indirect question → normal order." },
  ],
};

const T = "questions";
const QW = ["What", "Where", "When", "Who"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "qu", 1, 7);
g7a.mcq("___ you like math?", ["Do", "Does", "Are"], "you + פועל רגיל בהווה → Do.", "you + normal verb, present → Do.", { trap: "q-no-aux" });
g7a.mcq("___ your brother play in a band?", ["Does", "Do", "Is"], "your brother = he, ולכן Does.", "he → Does.");
g7a.mcq("___ the river dangerous?", ["Is", "Does", "Do"], "עם be (תואר): Is the river…? בלי does.", "With be → Is…?", { trap: "q-do-be" });
g7a.mcq("___ you go to the club yesterday?", ["Did", "Do", "Were"], "yesterday = עבר → Did.", "yesterday → Did.");
g7a.mcq("___ do you live? – In a small village.", ["Where", "When", "Who"], "התשובה היא מקום → Where.", "The answer is a place → Where.");
g7a.bank("___ is your guide? – Dan.", ["Who", "What", "Where"], "התשובה היא אדם → Who.", "The answer is a person → Who.");
g7a.bank("___ is the meal? – At seven.", ["When", "Who", "Where"], "התשובה היא זמן → When.", "The answer is a time → When.");
g7a.bank("___ you swim across the river?", ["Can", "Do", "Are"], "יכולת → Can you…?", "Ability → Can you…?");
g7a.order("Where do you go after school?", "מילת שאלה + do + you + פועל?", "Wh- + do + you + verb?", { trap: "q-order" });
g7a.order("Is your sister in the team?", "שאלה עם be: Is + נושא…?", "With be: Is + subject…?");
g7a.sort(QW, [["a place", "Where"], ["a person", "Who"], ["a time", "When"], ["a thing", "What"], ["at home", "Where"], ["my uncle", "Who"]], "מקום → Where, אדם → Who, זמן → When, דבר → What.", "Place → Where, person → Who, time → When, thing → What.", { instr: "לאיזו מילת שאלה מתאימה כל תשובה?" });
g7a.match([["Do you like lemons?", "No, I don't."], ["Is he your brother?", "Yes, he is."], ["Can she drive?", "No, she can't."], ["Did they win?", "Yes, they did."]], "התשובה הקצרה משתמשת באותו פועל עזר כמו השאלה.", "The short answer uses the same helper as the question.");

const g7b = itemSet(T, "qu", 2, 7);
g7b.type("___ many players are on your team?", "how", "How", "How many + רבים.", "How many + plural.");
g7b.type("How ___ do you travel to the mountains? – Twice a year.", "often", "often", "תדירות → How often.", "Frequency → How often.");
g7b.type("___ bag is this? – It's mine.", "whose", "Whose", "של מי? → Whose.", "Belonging to whom → Whose.");
g7b.type("What ___ you doing now?", "be", "are", "עכשיו + ing → are.", "now + -ing → are.");
g7b.mcq("How ___ does the ticket cost?", ["much", "many", "often"], "מחיר / כסף → How much.", "Price → How much.");
g7b.fix("Where *you live?", ["do you"], "חסר do: Where do you live?", "Missing do.", { trap: "q-order" });
g7b.fix("Does she *likes history?", ["like"], "אחרי Does – צורת בסיס: like.", "After Does → like.", { trap: "q-double" });
g7b.fix("*Is you hungry?", ["Are"], "עם you – Are: Are you hungry?", "you → Are.", { trap: "q-do-be" });
g7b.transform("She plays in the school band.", "Make it a yes/no question.", "הפכו לשאלת כן/לא", "Does she play in the school band?", "she → Does + play (בלי s).", "Does she play…?");
g7b.transform("They went to the theater.", "Ask a question with 'Where'.", "שאלו שאלה עם Where", ["Where did they go?"], "עבר → Where + did + they + go?", "Where did they go?");
g7b.order("How often do you help your mom?", "How often + do + you + פועל?", "How often + do + you + verb?");
g7b.cloze("Meeting a new student", "\"{1} is your name?\" \"Maya.\" \"{2} you new here?\" \"Yes, I am.\" \"{3} do you come from?\" \"From Haifa.\" \"{4} you like it here?\" \"Yes! Everyone is nice.\"", [["what", "What"], ["be", "Are"], ["where", "Where"], ["do", "Do"]], "What = מה, Where = מאיפה. be → Are. פועל רגיל → Do.", "What, Where; be → Are; normal verb → Do.");

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "qu", 1, 8);
g8a.mcq("___ you like cooking?", ["Do", "Does", "Are"], "you + פועל רגיל בהווה → Do.", "you, present → Do.", { trap: "q-no-aux" });
g8a.mcq("___ your uncle work in a factory?", ["Does", "Do", "Is"], "your uncle = he, ולכן Does.", "he → Does.");
g8a.mcq("___ the café open on Saturday?", ["Is", "Does", "Do"], "עם be (open): Is the café…?", "With be → Is…?", { trap: "q-do-be" });
g8a.mcq("___ you enjoy the concert last night?", ["Did", "Do", "Were"], "last night = עבר → Did.", "last night → Did.");
g8a.mcq("___ is the airport? – Twenty minutes from here.", ["Where", "Who", "What"], "התשובה היא מקום → Where.", "Place → Where.");
g8a.bank("___ is your favorite actor? – Gal Gadot.", ["Who", "What", "Where"], "התשובה היא אדם → Who.", "Person → Who.", { allow: ["gal", "gadot", "favorite"] });
g8a.bank("___ does the concert start? – At eight.", ["When", "Who", "Where"], "התשובה היא זמן → When.", "Time → When.");
g8a.bank("___ you play the drums?", ["Can", "Do", "Are"], "יכולת → Can you…?", "Ability → Can you…?");
g8a.order("Where does your brother work?", "מילת שאלה + does + נושא + פועל?", "Wh- + does + subject + verb?", { trap: "q-order" });
g8a.order("Was the traffic terrible?", "שאלה עם be בעבר: Was + נושא…?", "With be, past: Was + subject…?");
g8a.sort(QW, [["at the airport", "Where"], ["the director", "Who"], ["on Monday", "When"], ["a camera", "What"], ["in the café", "Where"], ["my cousin", "Who"]], "מקום → Where, אדם → Who, זמן → When, דבר → What.", "Place → Where, person → Who, time → When, thing → What.", { instr: "לאיזו מילת שאלה מתאימה כל תשובה?", allow: ["cousin"] });
g8a.match([["Do you like traffic jams?", "No, I don't."], ["Is she an actor?", "Yes, she is."], ["Can he cook?", "No, he can't."], ["Did they travel abroad?", "Yes, they did."]], "התשובה הקצרה משתמשת באותו פועל עזר כמו השאלה.", "The short answer uses the same helper.");

const g8b = itemSet(T, "qu", 2, 8);
g8b.type("How ___ ingredients do we need?", "many", "many", "ingredients = רבים → How many.", "Plural → How many.");
g8b.type("How ___ flour do we need?", "much", "much", "flour לא סופרים → How much.", "Uncountable → How much.");
g8b.type("___ camera is this? – It's my dad's.", "whose", "Whose", "של מי? → Whose.", "Belonging to whom → Whose.");
g8b.type("___ will the plane land?", "when", "When", "התשובה היא זמן → When.", "Time → When.");
g8b.mcq("How ___ does it take to get to the airport?", ["long", "many", "much"], "משך זמן → How long.", "Duration → How long.");
g8b.fix("What time *do the concert start?", ["does"], "the concert = it, ולכן does.", "the concert = it → does.", { trap: "q-double" });
g8b.fix("Did you *bought a new camera?", ["buy"], "אחרי Did – צורת בסיס: buy.", "After Did → buy.", { trap: "q-double" });
g8b.mcq("___ you come to the party on Friday?", ["Can", "Do you can", "Are can"], "עם can לא שמים do: Can you come?", "No do with can: Can you come?", { trap: "q-do-be" });
g8b.transform("He chats with his friends online.", "Make it a yes/no question.", "הפכו לשאלת כן/לא", "Does he chat with his friends online?", "he → Does + chat (בלי s).", "Does he chat…?");
g8b.transform("They traveled abroad last summer.", "Ask a question with 'Where'.", "שאלו שאלה עם Where", ["Where did they travel last summer?", "Where did they travel?"], "עבר → Where + did + they + travel?", "Where did they travel?");
g8b.order("Which dish do you want to cook?", "Which + שם עצם + do + you + פועל?", "Which + noun + do + you + verb?");
g8b.cloze("At the café", "\"{1} would you like to drink?\" \"Coffee, please.\" \"{2} you want milk?\" \"Yes, please.\" \"{3} sugar?\" \"Just a little.\" \"{4} you pay by credit card?\" \"Yes, of course.\"", [["what", "What"], ["do", "Do"], ["how much", "How much"], ["can", "Can"]], "What = מה. פועל רגיל → Do. sugar לא סופרים → How much. בקשה → Can.", "What; normal verb → Do; uncountable → How much; request → Can.", { allow: ["sugar"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "qu", 1, 9);
g9a.mcq("___ you post selfies every day?", ["Do", "Does", "Are"], "you + פועל רגיל בהווה → Do.", "you, present → Do.", { trap: "q-no-aux" });
g9a.mcq("___ your neighbor have a ladder?", ["Does", "Do", "Is"], "your neighbor = he / she, ולכן Does.", "he / she → Does.");
g9a.mcq("___ the gallery far from here?", ["Is", "Does", "Do"], "עם be (far): Is the gallery…?", "With be → Is…?", { trap: "q-do-be" });
g9a.mcq("___ you watch the documentary last night?", ["Did", "Do", "Were"], "last night = עבר → Did.", "last night → Did.");
g9a.mcq("___ is the stadium? – Near the old tower.", ["Where", "Who", "What"], "התשובה היא מקום → Where.", "Place → Where.");
g9a.bank("___ wrote this novel? – A famous author.", ["Who", "What", "Where"], "התשובה היא אדם → Who.", "Person → Who.", { allow: ["author", "famous"] });
g9a.bank("___ is the wedding? – Next Thursday.", ["When", "Who", "Where"], "התשובה היא זמן → When.", "Time → When.");
g9a.bank("___ you lend me your charger?", ["Can", "Do", "Are"], "בקשה → Can you…?", "Request → Can you…?", { allow: ["charger"] });
g9a.order("Where does your colleague live?", "מילת שאלה + does + נושא + פועל?", "Wh- + does + subject + verb?", { trap: "q-order" });
g9a.order("Was the elevator broken again?", "שאלה עם be בעבר: Was + נושא…?", "With be, past: Was + subject…?");
g9a.sort(QW, [["in the gallery", "Where"], ["the architect", "Who"], ["at sunrise", "When"], ["an oven", "What"], ["near the stadium", "Where"], ["my neighbor", "Who"]], "מקום → Where, אדם → Who, זמן → When, דבר → What.", "Place → Where, person → Who, time → When, thing → What.", { instr: "לאיזו מילת שאלה מתאימה כל תשובה?" });
g9a.match([["Do you like documentaries?", "Yes, I do."], ["Is he a firefighter?", "No, he isn't."], ["Can she sail?", "Yes, she can."], ["Did they complain?", "No, they didn't."]], "התשובה הקצרה משתמשת באותו פועל עזר כמו השאלה.", "The short answer uses the same helper.");

const g9b = itemSet(T, "qu", 2, 9);
g9b.type("How ___ floors does the tower have?", "many", "many", "floors = רבים → How many.", "Plural → How many.", { allow: ["floors"] });
g9b.type("How ___ furniture did you buy?", "much", "much", "furniture לא סופרים → How much.", "Uncountable → How much.");
g9b.type("___ ladder is this? – It's the neighbor's.", "whose", "Whose", "של מי? → Whose.", "Belonging to whom → Whose.");
g9b.type("___ did you choose this novel? – Because it's funny.", "why", "Why", "התשובה מתחילה ב-because → Why.", "Because → Why.");
g9b.mcq("How ___ have you lived in this neighborhood?", ["long", "many", "much"], "משך זמן → How long.", "Duration → How long.");
g9b.fix("Why *is the neighbors complaining?", ["are"], "the neighbors = they, ולכן are.", "the neighbors = they → are.");
g9b.fix("Does he *translates articles?", ["translate"], "אחרי Does – צורת בסיס: translate.", "After Does → translate.", { trap: "q-double" });
g9b.fix("*Is you a vegetarian?", ["Are"], "עם you – Are: Are you a vegetarian?", "you → Are.", { trap: "q-do-be" });
g9b.transform("She borrows books from the library.", "Make it a yes/no question.", "הפכו לשאלת כן/לא", "Does she borrow books from the library?", "she → Does + borrow (בלי s).", "Does she borrow…?", { allow: ["library"] });
g9b.transform("They sailed to the island.", "Ask a question with 'When'.", "שאלו שאלה עם When", ["When did they sail to the island?"], "עבר → When + did + they + sail?", "When did they sail…?");
g9b.order("Which app do you use most?", "Which + שם עצם + do + you + פועל?", "Which + noun + do + you + verb?");
g9b.cloze("An interview", "\"{1} did you become a firefighter?\" \"Ten years ago.\" \"{2} did you choose this job?\" \"Because I like to help.\" \"{3} it dangerous?\" \"Sometimes.\" \"{4} you ever been afraid?\" \"Of course!\"", [["when", "When"], ["why", "Why"], ["be", "Is"], ["have", "Have"]], "When = מתי, Why = למה. be → Is. הווה מושלם → Have.", "When, Why; be → Is; present perfect → Have.");

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "qu", 3);
l3.mcq("Who ___ the window?", ["broke", "did break", "breaked"], "שאלה על הנושא (מי?) – בלי did.", "Subject question – no did.", { trap: "q-subject" });
l3.mcq("Do you know where ___?", ["she lives", "does she live", "lives she"], "שאלה עקיפה – סדר רגיל: she lives.", "Indirect question → she lives.", { trap: "q-indirect" });
l3.type("Who are you talking ___?", "to", "to", "מילת היחס באה בסוף: talking to.", "The preposition goes at the end.");
l3.type("___ you like the movie? I thought you loved it!", "do – negative", "Don't", "שאלה שלילית – הפתעה: Don't you like…?", "Negative question → Don't you…?");
l3.fix("What *happen at school yesterday?", ["happened"], "שאלה על הנושא בעבר – בלי did: What happened?", "Subject question, past → What happened?", { trap: "q-subject" });
l3.fix("Do you know where she *live?", ["lives"], "שאלה עקיפה – סדר של משפט רגיל: she lives (עם s).", "Indirect question → she lives.", { trap: "q-indirect" });
l3.fix("Does your sister *speaks Arabic?", ["speak"], "אחרי Does – צורת בסיס: speak.", "After Does → speak.", { trap: "q-double" });
l3.transform("Someone called you.", "Ask about the person (Who).", "שאלו על האדם (Who)", ["Who called you?", "Who called me?"], "שאלה על הנושא – בלי did: Who called?", "Who called you?", { trap: "q-subject" });
l3.transform("Where is the station?", "Make it polite: start with 'Can you tell me…'.", "הפכו למנומס: התחילו ב-Can you tell me…", ["Can you tell me where the station is?"], "שאלה עקיפה – סדר רגיל: where the station is.", "Indirect → where the station is.", { trap: "q-indirect" });
l3.sort(["✓ Correct", "✗ Wrong"], [["Who won the game?", "✓ Correct"], ["Where you are going?", "✗ Wrong"], ["What are you looking at?", "✓ Correct"], ["Do you know where is he?", "✗ Wrong"], ["Isn't she coming?", "✓ Correct"], ["Does he likes it?", "✗ Wrong"]], "התיקונים: Where are you going · where he is · Does he like.", "Fixes: Where are you going · where he is · Does he like.");
l3.cloze("Lost in the city", "\"Excuse me, can you tell me where the museum {1}?\" \"Sure. {2} you walking or driving?\" \"Walking.\" \"OK. {3} told you to go this way? It's the other direction!\" \"Really? {4} way is it, then?\"", [["be", "is"], ["be", "Are"], ["who", "Who"], ["which", "Which"]], "שאלה עקיפה → is בסוף. be → Are. Who בלי did. Which way.", "Indirect → is; be → Are; Who (no did); Which way.", { allow: ["excuse", "direction", "really"] });
l3.write("Write five questions you would ask a famous person in an interview. Use at least four different question words.", "כתבו חמש שאלות שהייתם שואלים אדם מפורסם בראיון. השתמשו לפחות בארבע מילות שאלה שונות.", "Where did you grow up? When did you start acting? Who helped you most? Why do you love your job? How do you relax?", "מילת שאלה + פועל עזר + נושא + פועל.", "Wh- + helper + subject + verb.");

export const questionsItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
