import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG, QUE } from "@/data/grammar/build";

// Band II: VERBS: Present linking verbs (+ questions), Past linking verbs (+ questions).

export const toBeTopic: GrammarTopic = {
  id: "to-be",
  group: "tenses",
  title: "To Be (am / is / are, was / were)",
  titleHe: "הפועל to be – הווה ועבר",
  bandRefs: ["VERBS: Present linking verbs", "VERBS: Past linking verbs", "VERBS: Past linking verbs questions"],
  grades: { 7: "evolving", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "בהווה: am / is / are", en: "Present: am / is / are", examples: ["I **am** happy.", "She **is** at school.", "They **are** friends."] },
        { he: "בעבר: was / were", en: "Past: was / were", examples: ["I **was** tired yesterday.", "We **were** at home."] },
        { he: "באנגלית חייבים את הפועל – גם כשבעברית אין", en: "English always needs the verb", examples: ["She **is** happy.", "✗ She happy."] },
        { he: "שלילה: not. שאלה: הפועל עובר להתחלה", en: "Negative: + not. Question: verb first", examples: ["He **isn't** here.", "**Are** you ready?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "I am / he, she, it is / we, you, they are", example: "We are in class." },
        { kind: "affirmative", pattern: "I, he, she, it was / we, you, they were", example: "It was cold." },
        { kind: "negative", pattern: "isn't / aren't / wasn't / weren't", example: "They weren't late." },
        { kind: "question", pattern: "Am / Is / Are / Was / Were + subject …?", example: "Was it fun?" },
      ],
      timeWords: ["now", "today", "yesterday", "last week", "last night"],
    },
    2: {
      points: [
        { he: "הווה: am / is / are. עבר: was / were", en: "Present am / is / are – past was / were", examples: ["My room **is** small.", "The test **was** easy."] },
        { he: "עם I / he / she / it – was, עם we / you / they – were", en: "I / he / she / it → was; we / you / they → were", examples: ["He **was** sick.", "They **were** late."] },
        { he: "עם be לא משתמשים ב-do / did", en: "No do / did with be", examples: ["**Are** you tired?", "✗ Do you tired?"] },
        { he: "תשובות קצרות", en: "Short answers", examples: ["Yes, I **am**.", "No, they **weren't**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "subject + am / is / are / was / were", example: "The game was great." },
        { kind: "negative", pattern: "subject + isn't / aren't / wasn't / weren't", example: "It isn't far." },
        { kind: "question", pattern: "(Wh-) + be + subject …?", example: "Where were you?" },
        { kind: "short_answer", pattern: "Yes, … is / was. No, … isn't / wasn't.", example: "No, it wasn't." },
      ],
      timeWords: ["now", "at the moment", "yesterday", "last year", "two days ago"],
    },
    3: {
      points: [
        { he: "be + תואר / שם עצם / מקום", en: "be + adjective / noun / place", examples: ["The tickets **were** expensive.", "She **is** a pilot."] },
        { he: "שאלות ושלילה – בלי do / did", en: "Questions and negatives – no do / did", examples: ["**Wasn't** it amazing?", "Why **were** they angry?"] },
        { he: "everyone / nobody / each = יחיד", en: "everyone / nobody / each = singular", examples: ["Everyone **was** ready.", "Nobody **is** perfect."] },
        { he: "צירופים קבועים עם be", en: "Fixed phrases with be", examples: ["I **was born** in 2012.", "She **is afraid of** dogs."] },
      ],
      form: [
        { kind: "affirmative", pattern: "be + adjective / noun / place", example: "Everyone was proud." },
        { kind: "negative", pattern: "be + not", example: "Nobody was home." },
        { kind: "question", pattern: "Wh- + be + subject?", example: "How long was the flight?" },
      ],
      timeWords: ["at the moment", "these days", "in 2012", "when I was young"],
    },
  },
  traps: [
    { id: "tb-missing", wrong: "She happy.", right: "She is happy.", whyHe: "בעברית אפשר בלי פועל, באנגלית חייבים is.", whyEn: "English needs the verb: is." },
    { id: "tb-do", wrong: "Do you tired?", right: "Are you tired?", whyHe: "עם be לא שמים do – הפועל עצמו עובר להתחלה.", whyEn: "No do with be – put be first." },
    { id: "tb-was-were", wrong: "They was late.", right: "They were late.", whyHe: "עם they / we / you משתמשים ב-were.", whyEn: "they / we / you → were." },
    { id: "tb-agree", wrong: "My friends is nice.", right: "My friends are nice.", whyHe: "My friends = they, ולכן are.", whyEn: "My friends = they → are." },
    { id: "tb-born", wrong: "I born in Haifa.", right: "I was born in Haifa.", whyHe: "נולדתי = I was born.", whyEn: "Use was born." },
  ],
};

const T = "to-be";
const S = ["is / was", "are / were"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "tb", 1, 7);
g7a.mcq("My brother ___ in the school team.", ["is", "are", "am"], "My brother = he, ולכן is.", "My brother = he → is.", { trap: "tb-agree" });
g7a.mcq("I ___ hungry. Is there a meal?", ["am", "is", "are"], "עם I משתמשים ב-am.", "I → am.");
g7a.mcq("The river ___ very wide here.", ["is", "are", "be"], "The river = it, ולכן is.", "The river = it → is.");
g7a.mcq("We ___ at the theater last night.", ["were", "was", "are"], "last night = עבר, ו-we → were.", "last night = past; we → were.", { trap: "tb-was-were" });
g7a.mcq("___ you ready for the journey?", ["Are", "Do", "Is"], "שאלה עם be: Are you…? בלי do.", "Question with be: Are you…? No do.", { trap: "tb-do" });
g7a.bank("The mountain ___ dangerous in winter.", ["is", "are", "am"], "The mountain = it, ולכן is.", "The mountain = it → is.");
g7a.bank("Yesterday ___ my birthday.", ["was", "were", "is"], "yesterday = עבר. it → was.", "yesterday = past → was.");
g7a.bank("My parents ___ at home now.", ["aren't", "isn't", "wasn't"], "My parents = they, ולכן aren't.", "My parents = they → aren't.", { trap: "tb-agree" });
g7a.order("She is our guide today.", "מי + is + מה.", "Who + is + what.");
g7a.order("Were you at the club?", "שאלה בעבר: Were + you…?", "Past question: Were + you…?", { trap: "tb-do" });
g7a.sort(S, [["I", "is / was"], ["they", "are / were"], ["my team", "is / was"], ["we", "are / were"], ["the village", "is / was"], ["you", "are / were"]], "יחיד (he / she / it) → is / was. רבים, you → are / were. (I → am / was)", "Singular → is / was. Plural and you → are / were. (I → am / was)");
g7a.match([["My sister", "is a doctor."], ["The lemons", "are in the bowl."], ["I", "am ready."], ["The test", "was easy."]], "is / are / am לפי הנושא, was בעבר.", "is / are / am by subject; was for the past.");

const g7b = itemSet(T, "tb", 2, 7);
g7b.type("The bridge ___ very old.", "be – present", "is", "The bridge = it, ולכן is.", "The bridge = it → is.");
g7b.type("We ___ tired after the activity.", "be – past", "were", "we בעבר → were.", "we, past → were.", { trap: "tb-was-were" });
g7b.type("My math teacher ___ angry yesterday.", "be – past, not", ["wasn't", "was not"], "he / she + עבר + שלילה → wasn't.", "he / she, past, negative → wasn't.");
g7b.type("___ the lesson interesting?", "be – past", "Was", "שאלה בעבר: Was + the lesson…? בלי did.", "Past question: Was + the lesson…? No did.", { trap: "tb-do" });
g7b.mcq("Where ___ you yesterday?", ["were", "was", "did"], "you בעבר → were. בלי did.", "you, past → were. No did.");
g7b.fix("My friends *is in the same band.", ["are"], "My friends = they, ולכן are.", "My friends = they → are.", { trap: "tb-agree" });
g7b.fix("She *happy with her choice.", ["is happy"], "חסר הפועל: She is happy.", "The verb is missing: She is happy.", { trap: "tb-missing" });
g7b.fix("The meals *was great on the journey.", ["were"], "The meals = they, ולכן were.", "The meals = they → were.", { trap: "tb-was-were" });
g7b.transform("The village is near the river.", ...NEG, ["The village isn't near the river.", "The village is not near the river."], "שלילה: is + not = isn't.", "is + not = isn't.");
g7b.transform("They were at the office.", ...QUE, "Were they at the office?", "בשאלה were עובר להתחלה.", "In a question, were goes first.", { trap: "tb-do" });
g7b.order("Was the guide careful?", "שאלה: Was + the guide + careful?", "Question: Was + the guide + careful?");
g7b.cloze("My first day", "Last year I {1} new at this school. I {2} very shy, but the kids {3} nice to me. Now I {4} in the science club and my friends {5} great!", [["be", "was"], ["be", "was"], ["be", "were"], ["be", ["am", "'m"]], ["be", "are"]], "Last year = עבר (was / were). Now = הווה (am / are).", "Last year → was / were. Now → am / are.");

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "tb", 1, 8);
g8a.mcq("The café ___ open until ten.", ["is", "are", "am"], "The café = it, ולכן is.", "The café = it → is.");
g8a.mcq("I ___ afraid of the dark.", ["am", "is", "are"], "עם I משתמשים ב-am.", "I → am.");
g8a.mcq("The concert ___ amazing last night!", ["was", "were", "is"], "last night = עבר. it → was.", "last night = past → was.");
g8a.mcq("My cousins ___ at the airport yesterday.", ["were", "was", "are"], "My cousins = they, בעבר → were.", "My cousins = they, past → were.", { trap: "tb-was-were", allow: ["cousins"] });
g8a.mcq("___ your sister an actor?", ["Is", "Does", "Are"], "שאלה עם be: Is your sister…? בלי does.", "Question with be: Is your sister…? No does.", { trap: "tb-do" });
g8a.bank("The traffic ___ terrible yesterday morning.", ["was", "were", "is"], "yesterday morning = עבר, ולכן was.", "yesterday morning = past → was.");
g8a.bank("These gloves ___ too small for me.", ["are", "is", "am"], "These gloves = they, ולכן are.", "These gloves = they → are.", { trap: "tb-agree" });
g8a.bank("He ___ at school today. He is sick.", ["isn't", "aren't", "wasn't"], "he + הווה + שלילה → isn't.", "he, present, negative → isn't.");
g8a.order("The island is very beautiful.", "מי + is + איך.", "Who + is + what.");
g8a.order("Were the drums loud?", "שאלה בעבר: Were + the drums…?", "Past question: Were + the drums…?", { trap: "tb-do" });
g8a.sort(S, [["the business", "is / was"], ["my parents", "are / were"], ["the movie theater", "is / was"], ["the coins", "are / were"], ["she", "is / was"], ["we", "are / were"]], "יחיד → is / was. רבים → are / were.", "Singular → is / was. Plural → are / were.");
g8a.match([["The flag", "is blue and white."], ["The ingredients", "are on the table."], ["I", "am at the swimming pool."], ["The trip", "was a great adventure."]], "is / are / am לפי הנושא, was בעבר.", "is / are / am by subject; was for the past.");

const g8b = itemSet(T, "tb", 2, 8);
g8b.type("The factory ___ near the port.", "be – present", "is", "The factory = it, ולכן is.", "The factory = it → is.", { allow: ["port"] });
g8b.type("We ___ in a traffic jam for two hours.", "be – past", "were", "we בעבר → were.", "we, past → were.", { trap: "tb-was-were" });
g8b.type("The test ___ difficult at all.", "be – past, not", ["wasn't", "was not"], "it + עבר + שלילה → wasn't.", "it, past, negative → wasn't.");
g8b.type("___ the actors good in the play?", "be – past", "Were", "שאלה בעבר עם רבים: Were + the actors…?", "Plural past question: Were + the actors…?", { trap: "tb-do" });
g8b.mcq("How much ___ the tickets for last night's concert?", ["were", "was", "did"], "the tickets = they, ולכן were.", "the tickets = they → were.");
g8b.fix("The ingredients *is in the fridge.", ["are"], "The ingredients = they, ולכן are.", "The ingredients = they → are.", { trap: "tb-agree" });
g8b.fix("My brother *upset about the game.", ["is upset", "was upset"], "חסר הפועל: My brother is upset.", "The verb is missing: My brother is upset.", { trap: "tb-missing" });
g8b.fix("*Did you afraid of the storm?", ["Were"], "עם be לא משתמשים ב-did: Were you afraid?", "No did with be: Were you afraid?", { trap: "tb-do", allow: ["storm"] });
g8b.transform("The museum was crowded.", ...NEG, ["The museum wasn't crowded.", "The museum was not crowded."], "שלילה: was + not = wasn't.", "was + not = wasn't.", { allow: ["crowded"] });
g8b.transform("Your parents are at the concert.", ...QUE, "Are your parents at the concert?", "בשאלה are עובר להתחלה.", "In a question, are goes first.", { trap: "tb-do" });
g8b.order("Where were you on Saturday?", "מילת שאלה + were + you?", "Wh- + were + you?");
g8b.cloze("A trip abroad", "Last summer we {1} abroad for two weeks. The weather {2} hot, and the people {3} very friendly. Now we {4} back home, but I {5} still excited!", [["be", "were"], ["be", "was"], ["be", "were"], ["be", ["are", "'re"]], ["be", ["am", "'m"]]], "Last summer = עבר (was / were). Now = הווה (am / are).", "Last summer → was / were. Now → am / are.");

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "tb", 1, 9);
g9a.mcq("My neighbor ___ a firefighter.", ["is", "are", "am"], "My neighbor = he / she, ולכן is.", "My neighbor = he / she → is.");
g9a.mcq("I ___ honest with my friends.", ["am", "is", "are"], "עם I משתמשים ב-am.", "I → am.");
g9a.mcq("The wedding ___ beautiful last week.", ["was", "were", "is"], "last week = עבר. it → was.", "last week = past → was.");
g9a.mcq("The documents ___ on the desk yesterday.", ["were", "was", "are"], "The documents = they, בעבר → were.", "The documents = they, past → were.", { trap: "tb-was-were", allow: ["documents"] });
g9a.mcq("___ the stadium far from here?", ["Is", "Does", "Are"], "שאלה עם be: Is the stadium…? בלי does.", "Question with be: Is the stadium…? No does.", { trap: "tb-do" });
g9a.bank("The elevator ___ broken yesterday morning.", ["was", "were", "is"], "yesterday morning = עבר, ולכן was.", "yesterday morning = past → was.");
g9a.bank("My new jeans ___ really comfortable.", ["are", "is", "am"], "jeans = they, ולכן are.", "jeans = they → are.", { trap: "tb-agree", allow: ["jeans", "comfortable"] });
g9a.bank("The app ___ free. It costs money.", ["isn't", "aren't", "wasn't"], "it + הווה + שלילה → isn't.", "it, present, negative → isn't.");
g9a.order("The novel is very popular.", "מי + is + מה.", "Who + is + what.");
g9a.order("Were the strangers friendly?", "שאלה בעבר: Were + the strangers…?", "Past question: Were + the strangers…?", { trap: "tb-do" });
g9a.sort(S, [["the oven", "is / was"], ["my colleagues", "are / were"], ["the exhibition", "is / was"], ["the firefighters", "are / were"], ["everyone", "is / was"], ["you", "are / were"]], "יחיד (וגם everyone) → is / was. רבים, you → are / were.", "Singular (and everyone) → is / was. Plural and you → are / were.");
g9a.match([["The tower", "is very tall."], ["The statues", "are in the garden."], ["I", "am a vegetarian."], ["The joke", "was funny."]], "is / are / am לפי הנושא, was בעבר.", "is / are / am by subject; was for the past.");

const g9b = itemSet(T, "tb", 2, 9);
g9b.type("The gallery ___ open on Mondays.", "be – present, not", ["isn't", "is not"], "The gallery = it + שלילה → isn't.", "The gallery = it, negative → isn't.");
g9b.type("We ___ late for the interview.", "be – past", "were", "we בעבר → were.", "we, past → were.", { trap: "tb-was-were" });
g9b.type("The housework ___ easy at all.", "be – past, not", ["wasn't", "was not"], "it + עבר + שלילה → wasn't.", "it, past, negative → wasn't.");
g9b.type("___ your grandparents born in Israel?", "be – past", "Were", "נולדו = were born. שאלה: Were + your grandparents…?", "were born → Were + your grandparents…?", { trap: "tb-born" });
g9b.mcq("Why ___ the elevator so slow yesterday?", ["was", "were", "did"], "the elevator = it, בעבר → was.", "the elevator = it, past → was.");
g9b.fix("The selfies *is on my phone.", ["are"], "The selfies = they, ולכן are.", "The selfies = they → are.", { trap: "tb-agree" });
g9b.fix("My grandfather *born in 1950.", ["was born"], "נולד = was born: My grandfather was born…", "Use was born.", { trap: "tb-born" });
g9b.fix("*Do you nervous before the marathon?", ["Are", "Were"], "עם be לא משתמשים ב-do: Are you nervous?", "No do with be: Are you nervous?", { trap: "tb-do", allow: ["nervous"] });
g9b.transform("The firefighters were brave.", ...NEG, ["The firefighters weren't brave.", "The firefighters were not brave."], "שלילה: were + not = weren't.", "were + not = weren't.");
g9b.transform("The neighborhood is quiet.", ...QUE, "Is the neighborhood quiet?", "בשאלה is עובר להתחלה.", "In a question, is goes first.", { trap: "tb-do" });
g9b.order("How was the documentary?", "מילת שאלה + was + נושא?", "Wh- + was + subject?");
g9b.cloze("Our school trip", "Last month our class {1} in the north. The hotel {2} small, but the rooms {3} clean. Today I {4} home again, and my photos {5} online.", [["be", "was"], ["be", "was"], ["be", "were"], ["be", ["am", "'m"]], ["be", "are"]], "Last month = עבר (was / were). Today = הווה (am / are).", "Last month → was / were. Today → am / are.", { allow: ["hotel"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "tb", 3);
l3.mcq("Everyone in the room ___ silent.", ["was", "were", "be"], "Everyone נחשב יחיד → was.", "Everyone is singular → was.");
l3.mcq("Neither of my brothers ___ at home last night.", ["was", "were", "did"], "Neither of … = יחיד (בכתיבה פורמלית) → was.", "Neither of … takes a singular verb → was.");
l3.type("Where ___ you born?", "be – past", "were", "were born – בעבר עם you.", "were born – past with you.", { trap: "tb-born" });
l3.type("The news ___ very good today.", "be – present, not", ["isn't", "is not"], "news הוא שם עצם ביחיד → isn't.", "news is singular → isn't.");
l3.fix("Nobody *were ready for the test.", ["was"], "Nobody = יחיד → was.", "Nobody is singular → was.");
l3.fix("*Did the tickets expensive?", ["Were"], "עם be לא משתמשים ב-did: Were the tickets expensive?", "No did with be: Were the tickets expensive?", { trap: "tb-do" });
l3.fix("I *am born in Jerusalem.", ["was"], "born תמיד בעבר: I was born.", "born is always past: I was born.", { trap: "tb-born" });
l3.transform("The flight was on time.", "Ask a question with 'Why'.", "שאלו שאלה עם Why", ["Why was the flight on time?"], "שאלה: Why + was + the flight…?", "Why + was + the flight…?");
l3.transform("My friends were at the party.", "Ask about the place (Where).", "שאלו על המקום (Where)", ["Where were your friends?", "Where were my friends?", "Where were they?"], "Where + were + נושא?", "Where + were + subject?");
l3.sort(["✓ Correct", "✗ Wrong"], [["She is afraid of spiders.", "✓ Correct"], ["Do you hungry?", "✗ Wrong"], ["Everybody was there.", "✓ Correct"], ["They was in Eilat.", "✗ Wrong"], ["My sister a nurse.", "✗ Wrong"], ["Were you born in 2012?", "✓ Correct"]], "התיקונים: Are you hungry · They were · My sister is a nurse.", "Are you hungry · They were · My sister is a nurse.");
l3.cloze("A famous athlete", "Usain Bolt {1} born in Jamaica in 1986. As a child, he {2} interested in cricket. Later his coaches {3} sure he could run. Today he {4} retired, but his records {5} still famous.", [["be", "was"], ["be", "was"], ["be", "were"], ["be", "is"], ["be", "are"]], "עבר: was / were. היום: is / are.", "Past: was / were. Today: is / are.", { allow: ["usain", "bolt", "jamaica", "cricket", "coaches", "retired", "records"] });
l3.write("Describe a place you visited: where it was, what it was like, and how you feel about it now.", "תארו מקום שביקרתם בו: איפה הוא היה, איך הוא היה, ומה אתם מרגישים עליו עכשיו.", "Last summer I was in Eilat. The beach was beautiful and the water was warm. I am excited to go back.", "was / were בעבר, am / is / are בהווה.", "was / were for the past, am / is / are for the present.");

export const toBeItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
