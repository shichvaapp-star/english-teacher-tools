import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG, QUE } from "@/data/grammar/build";

// Band II: VERBS: Future 'BE GOING TO + VERB' (+ questions).

export const goingToTopic: GrammarTopic = {
  id: "going-to",
  group: "tenses",
  title: "Future: going to",
  titleHe: "עתיד עם going to",
  bandRefs: ["VERBS: Future 'BE GOING TO + VERB'", "VERBS: Future 'BE GOING TO + VERB' - questions"],
  grades: { 7: "evolving", 8: "evolving", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "תוכניות: am / is / are + going to + פועל", en: "Plans: am / is / are + going to + verb", examples: ["I **am going to visit** my grandma.", "They **are going to play** football."] },
        { he: "חייבים am / is / are לפני going to", en: "Always am / is / are before going to", examples: ["She **is going to** buy a bike.", "✗ She going to buy a bike."] },
        { he: "שלילה: am / is / are + not + going to", en: "Negative: am / is / are + not + going to", examples: ["We **aren't going to** watch TV.", "I'**m not going to** tell him."] },
        { he: "שאלה: Am / Is / Are בהתחלה", en: "Question: Am / Is / Are first", examples: ["**Are** you **going to** come?", "What **is** he **going to** do?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "am / is / are + going to + base verb", example: "He's going to call." },
        { kind: "negative", pattern: "am not / isn't / aren't + going to + base verb", example: "They aren't going to win." },
        { kind: "question", pattern: "Am / Is / Are + subject + going to + base verb?", example: "Is it going to rain?" },
      ],
      timeWords: ["tomorrow", "tonight", "next week", "this weekend", "soon"],
    },
    2: {
      points: [
        { he: "תוכנית שכבר החלטנו עליה", en: "A plan we have already decided on", examples: ["We**'re going to travel** abroad this summer."] },
        { he: "תחזית לפי מה שרואים עכשיו", en: "A prediction from what we can see now", examples: ["Look at those clouds! It**'s going to rain**."] },
        { he: "אחרי going to – צורת בסיס", en: "After going to – base verb", examples: ["She's going to **study**.", "✗ She's going to studies."] },
        { he: "תשובות קצרות", en: "Short answers", examples: ["Yes, I **am**.", "No, they **aren't**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "be + going to + base verb", example: "I'm going to learn to swim." },
        { kind: "negative", pattern: "be + not + going to + base verb", example: "It isn't going to be easy." },
        { kind: "question", pattern: "(Wh-) + be + subject + going to + base verb?", example: "When are you going to start?" },
        { kind: "short_answer", pattern: "Yes, … am / is / are. No, … isn't / aren't.", example: "Yes, she is." },
      ],
      timeWords: ["tonight", "next year", "Look!", "in a minute"],
    },
    3: {
      points: [
        { he: "כוונה שכבר קיימת לעומת החלטה של הרגע", en: "An existing intention (not a sudden decision)", examples: ["I**'m going to study** medicine. (decided long ago)"] },
        { he: "תחזית לפי סימנים ברורים", en: "Prediction based on clear evidence", examples: ["Watch out! You**'re going to fall**!"] },
        { he: "was / were going to – תוכנית שלא קרתה", en: "was / were going to – a plan that didn't happen", examples: ["I **was going to call** you, but I forgot."] },
        { he: "going to go – אפשר גם going to + go", en: "going to go is correct", examples: ["We're **going to go** to Eilat."] },
      ],
      form: [
        { kind: "affirmative", pattern: "be going to + base verb (intention / evidence)", example: "It's going to be a hot day." },
        { kind: "affirmative", pattern: "was / were going to + base verb (plan that changed)", example: "We were going to fly, but we drove." },
      ],
      timeWords: ["Watch out!", "already decided", "but then", "in the end"],
    },
  },
  traps: [
    { id: "gt-no-be", wrong: "She going to buy a bike.", right: "She is going to buy a bike.", whyHe: "חסר is / am / are לפני going to.", whyEn: "You need is / am / are before going to." },
    { id: "gt-no-to", wrong: "I am going visit Grandma.", right: "I am going to visit Grandma.", whyHe: "אל תשכחו את to: going to visit.", whyEn: "Don't forget to: going to visit." },
    { id: "gt-form", wrong: "He is going to plays.", right: "He is going to play.", whyHe: "אחרי going to – צורת בסיס, בלי s.", whyEn: "After going to → base verb." },
    { id: "gt-agree", wrong: "They is going to win.", right: "They are going to win.", whyHe: "עם They משתמשים ב-are going to.", whyEn: "They → are going to." },
    { id: "gt-question", wrong: "You are going to come?", right: "Are you going to come?", whyHe: "בשאלה are עובר לפני הנושא.", whyEn: "In a question, are goes first." },
  ],
};

const T = "going-to";
const S = ["am", "is", "are"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "gt", 1, 7);
g7a.mcq("I ___ join the science club next year.", ["am going to", "going to", "is going to"], "עם I → am going to.", "I → am going to.", { trap: "gt-no-be" });
g7a.mcq("We ___ travel to the mountains this summer.", ["are going to", "is going to", "are going"], "we → are going to (עם to!).", "we → are going to.", { trap: "gt-no-to" });
g7a.mcq("My sister is going to ___ the theater.", ["visit", "visits", "visiting"], "אחרי going to – צורת בסיס: visit.", "After going to → visit.", { trap: "gt-form" });
g7a.mcq("They ___ going to play today. It's too hot.", ["aren't", "isn't", "don't"], "They + שלילה → aren't going to.", "They, negative → aren't going to.");
g7a.mcq("___ you going to help with the meal?", ["Are", "Do", "Will"], "שאלה: Are + you + going to…?", "Question: Are you going to…?", { trap: "gt-question" });
g7a.bank("Look at those clouds! It ___ rain.", ["is going to", "are going to", "going to"], "תחזית לפי מה שרואים: It is going to rain.", "Evidence → It is going to rain.", { allow: ["clouds", "rain"] });
g7a.bank("Dad is going to ___ us to the river.", ["drive", "drives", "drove"], "אחרי going to – צורת בסיס: drive.", "After going to → drive.");
g7a.bank("The team ___ going to practice on Sunday.", ["is", "are", "am"], "The team = it – יחיד, ולכן is going to.", "The team = it → is going to.", { trap: "gt-agree" });
g7a.order("She is going to paint her room.", "מי + is going to + פועל + מה.", "Who + is going to + verb + what.");
g7a.order("Are you going to buy a ticket?", "שאלה: Are + you + going to + פועל?", "Question: Are you going to + verb?", { trap: "gt-question" });
g7a.sort(S, [["I", "am"], ["my brother", "is"], ["the kids", "are"], ["the guide", "is"], ["we", "are"], ["you", "are"]], "I → am. יחיד → is. רבים ו-you → are – ואז going to.", "I → am. Singular → is. Plural and you → are + going to.");
g7a.match([["It's my mom's birthday.", "I'm going to buy her flowers."], ["I'm hungry.", "I'm going to eat a sandwich."], ["We have a test tomorrow.", "We're going to study tonight."], ["The river is dangerous.", "We aren't going to swim."]], "תוכניות → am / is / are + going to.", "Plans → am / is / are + going to.", { allow: ["flowers", "sandwich"] });

const g7b = itemSet(T, "gt", 2, 7);
g7b.type("Next year I ___ English in London.", "study", ["am going to study", "'m going to study"], "תוכנית: am going to study.", "Plan → am going to study.", { allow: ["london"] });
g7b.type("Look! The baby ___ .", "fall", ["is going to fall", "'s going to fall"], "תחזית לפי מה שרואים → is going to fall.", "Evidence → is going to fall.");
g7b.type("We ___ the bus. We're going to walk.", "not / take", ["aren't going to take", "are not going to take", "'re not going to take"], "שלילה: aren't going to take.", "aren't going to take.");
g7b.type("___ your parents going to come to the show?", "be", "Are", "שאלה: Are + your parents + going to…?", "Are your parents going to…?", { allow: ["show"] });
g7b.mcq("What ___ you going to do this weekend?", ["are", "do", "will"], "שאלה: What + are + you + going to do?", "What are you going to do?");
g7b.fix("My brother *going to join the band.", ["is going to", "'s going to"], "חסר is: My brother is going to join.", "Missing is.", { trap: "gt-no-be" });
g7b.fix("We are going *travel to a new village.", ["to travel"], "חסר to: going to travel.", "Missing to: going to travel.", { trap: "gt-no-to" });
g7b.fix("She is going to *helps the guide.", ["help"], "אחרי going to – צורת בסיס: help.", "After going to → help.", { trap: "gt-form" });
g7b.transform("They are going to cross the bridge.", ...NEG, ["They aren't going to cross the bridge.", "They are not going to cross the bridge.", "They're not going to cross the bridge."], "שלילה: aren't going to.", "aren't going to.");
g7b.transform("He is going to drive to the office.", ...QUE, "Is he going to drive to the office?", "בשאלה is עובר להתחלה.", "Is goes first.", { trap: "gt-question" });
g7b.order("Where are you going to sleep tonight?", "מילת שאלה + are + you + going to + פועל?", "Wh- + are + you + going to + verb?");
g7b.cloze("Our plans for the holiday", "This holiday my family {1} a journey to the north. We {2} in a small village. My dad {3} us to a famous mountain. I {4} a lot of photos, but my little brother {5} – he's afraid of high places!", [["take", ["is going to take", "'s going to take"]], ["stay", ["are going to stay", "'re going to stay"]], ["take", ["is going to take", "'s going to take"]], ["take", ["am going to take", "'m going to take"]], ["not / climb", ["isn't going to climb", "is not going to climb"]]], "תוכניות: am / is / are + going to + פועל.", "Plans: am / is / are + going to + verb.", { allow: ["holiday", "north", "famous", "afraid", "climb", "places"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "gt", 1, 8);
g8a.mcq("I ___ download the new album tonight.", ["am going to", "going to", "is going to"], "עם I → am going to.", "I → am going to.", { trap: "gt-no-be", allow: ["album"] });
g8a.mcq("We ___ travel abroad this summer.", ["are going to", "is going to", "are going"], "we → are going to (עם to!).", "we → are going to.", { trap: "gt-no-to" });
g8a.mcq("My mom is going to ___ the cake.", ["decorate", "decorates", "decorating"], "אחרי going to – צורת בסיס: decorate.", "After going to → decorate.", { trap: "gt-form" });
g8a.mcq("They ___ going to cook tonight. They're tired.", ["aren't", "isn't", "don't"], "They + שלילה → aren't going to.", "They, negative → aren't going to.");
g8a.mcq("___ you going to come to the concert?", ["Are", "Do", "Will"], "שאלה: Are + you + going to…?", "Question: Are you going to…?", { trap: "gt-question" });
g8a.bank("Look at the traffic! We ___ be late.", ["are going to", "is going to", "going to"], "תחזית לפי מה שרואים: We are going to be late.", "Evidence → We are going to be late.");
g8a.bank("The chef is going to ___ a traditional dish.", ["cook", "cooks", "cooked"], "אחרי going to – צורת בסיס: cook.", "After going to → cook.", { allow: ["chef"] });
g8a.bank("The director ___ going to choose the actors.", ["is", "are", "am"], "The director = he / she, ולכן is going to.", "The director → is going to.", { trap: "gt-agree" });
g8a.order("He is going to record a new song.", "מי + is going to + פועל + מה.", "Who + is going to + verb + what.");
g8a.order("Are they going to open a café?", "שאלה: Are + they + going to + פועל?", "Question: Are they going to + verb?", { trap: "gt-question" });
g8a.sort(S, [["I", "am"], ["the chef", "is"], ["the actors", "are"], ["my uncle", "is"], ["we", "are"], ["you", "are"]], "I → am. יחיד → is. רבים ו-you → are – ואז going to.", "I → am. Singular → is. Plural and you → are + going to.", { allow: ["chef"] });
g8a.match([["I passed my driving test!", "I'm going to buy a car."], ["It's very hot today.", "We're going to swim in the pool."], ["My phone is broken.", "I'm going to get a new one."], ["The café is closed.", "We aren't going to eat there."]], "תוכניות → am / is / are + going to.", "Plans → am / is / are + going to.", { allow: ["passed", "driving"] });

const g8b = itemSet(T, "gt", 2, 8);
g8b.type("Next year my sister ___ at a big company.", "work", ["is going to work", "'s going to work"], "תוכנית: is going to work.", "Plan → is going to work.");
g8b.type("Look at that driver! He ___ an accident.", "have", ["is going to have", "'s going to have"], "תחזית לפי מה שרואים → is going to have.", "Evidence → is going to have.", { allow: ["driver"] });
g8b.type("I ___ the party. I have too much homework.", "not / go to", ["am not going to go to", "'m not going to go to"], "שלילה עם I: am not going to go to.", "I'm not going to go to.");
g8b.type("___ your friends going to perform at the concert?", "be", "Are", "שאלה: Are + your friends + going to…?", "Are your friends going to…?");
g8b.mcq("When ___ you going to start your project?", ["are", "do", "will"], "שאלה: When + are + you + going to start?", "When are you going to start?");
g8b.fix("The actors *going to rehearse tonight.", ["are going to", "'re going to"], "חסר are: The actors are going to…", "Missing are.", { trap: "gt-no-be", allow: ["rehearse"] });
g8b.fix("I am going *download the movie later.", ["to download"], "חסר to: going to download.", "Missing to: going to download.", { trap: "gt-no-to" });
g8b.fix("She is going to *decorates the room.", ["decorate"], "אחרי going to – צורת בסיס: decorate.", "After going to → decorate.", { trap: "gt-form" });
g8b.transform("We are going to fly to Rome.", ...NEG, ["We aren't going to fly to Rome.", "We are not going to fly to Rome.", "We're not going to fly to Rome."], "שלילה: aren't going to.", "aren't going to.", { allow: ["rome"] });
g8b.transform("He is going to apologize.", ...QUE, "Is he going to apologize?", "בשאלה is עובר להתחלה.", "Is goes first.", { trap: "gt-question" });
g8b.order("What are you going to cook for the party?", "מילת שאלה + are + you + going to + פועל?", "Wh- + are + you + going to + verb?");
g8b.cloze("Summer plans", "This summer my family {1} abroad. We {2} at a hotel near the sea. My brother {3} to dive, and I {4} the local food. My parents {5} – they just want to relax!", [["travel", ["is going to travel", "'s going to travel"]], ["stay", ["are going to stay", "'re going to stay"]], ["learn", ["is going to learn", "'s going to learn"]], ["try", ["am going to try", "'m going to try"]], ["not / work", ["aren't going to work", "are not going to work"]]], "תוכניות: am / is / are + going to + פועל.", "Plans: am / is / are + going to + verb.", { allow: ["hotel", "dive", "local"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "gt", 1, 9);
g9a.mcq("I ___ borrow a novel from my friend.", ["am going to", "going to", "is going to"], "עם I → am going to.", "I → am going to.", { trap: "gt-no-be" });
g9a.mcq("We ___ sail to the island next week.", ["are going to", "is going to", "are going"], "we → are going to (עם to!).", "we → are going to.", { trap: "gt-no-to" });
g9a.mcq("My dad is going to ___ the oven tomorrow.", ["repair", "repairs", "repairing"], "אחרי going to – צורת בסיס: repair.", "After going to → repair.", { trap: "gt-form" });
g9a.mcq("They ___ going to come to the wedding.", ["aren't", "isn't", "don't"], "They + שלילה → aren't going to.", "They, negative → aren't going to.");
g9a.mcq("___ you going to watch the marathon?", ["Are", "Do", "Will"], "שאלה: Are + you + going to…?", "Question: Are you going to…?", { trap: "gt-question" });
g9a.bank("Look at the smoke! There ___ be a fire.", ["is going to", "are going to", "going to"], "תחזית לפי מה שרואים: There is going to be a fire.", "Evidence → there is going to be a fire.");
g9a.bank("The reporter is going to ___ the firefighter.", ["interview", "interviews", "interviewed"], "אחרי going to – צורת בסיס: interview.", "After going to → interview.", { allow: ["reporter"] });
g9a.bank("The architect ___ going to design a new tower.", ["is", "are", "am"], "The architect = he / she, ולכן is going to.", "The architect → is going to.", { trap: "gt-agree" });
g9a.order("She is going to translate the novel.", "מי + is going to + פועל + מה.", "Who + is going to + verb + what.");
g9a.order("Are they going to binge-watch the series?", "שאלה: Are + they + going to + פועל?", "Question: Are they going to + verb?", { trap: "gt-question" });
g9a.sort(S, [["I", "am"], ["the architect", "is"], ["the firefighters", "are"], ["my colleague", "is"], ["we", "are"], ["you", "are"]], "I → am. יחיד → is. רבים ו-you → are – ואז going to.", "I → am. Singular → is. Plural and you → are + going to.");
g9a.match([["My sister is getting married.", "She's going to have a big wedding."], ["The elevator is broken.", "We're going to take the stairs."], ["I lost my wallet.", "I'm going to look for it."], ["It's late.", "We aren't going to watch the documentary."]], "תוכניות → am / is / are + going to.", "Plans → am / is / are + going to.", { allow: ["stairs", "married"] });

const g9b = itemSet(T, "gt", 2, 9);
g9b.type("Next year my cousin ___ at the university.", "study", ["is going to study", "'s going to study"], "תוכנית: is going to study.", "Plan → is going to study.", { allow: ["cousin"] });
g9b.type("Watch out! That ladder ___ .", "fall", ["is going to fall", "'s going to fall"], "תחזית לפי מה שרואים → is going to fall.", "Evidence → is going to fall.");
g9b.type("I ___ about the noise. It's not worth it.", "not / complain", ["am not going to complain", "'m not going to complain"], "שלילה עם I: am not going to complain.", "I'm not going to complain.", { allow: ["worth"] });
g9b.type("___ the neighbors going to come to the party?", "be", "Are", "שאלה: Are + the neighbors + going to…?", "Are the neighbors going to…?");
g9b.mcq("Who ___ you going to invite to the wedding?", ["are", "do", "will"], "שאלה: Who + are + you + going to invite?", "Who are you going to invite?", { allow: ["invite"] });
g9b.fix("The firefighters *going to check the building.", ["are going to", "'re going to"], "חסר are: The firefighters are going to…", "Missing are.", { trap: "gt-no-be", allow: ["building"] });
g9b.fix("I am going *update my apps tonight.", ["to update"], "חסר to: going to update.", "Missing to: going to update.", { trap: "gt-no-to" });
g9b.fix("She is going to *borrows my jacket.", ["borrow"], "אחרי going to – צורת בסיס: borrow.", "After going to → borrow.", { trap: "gt-form" });
g9b.transform("We are going to repair the sink.", ...NEG, ["We aren't going to repair the sink.", "We are not going to repair the sink.", "We're not going to repair the sink."], "שלילה: aren't going to.", "aren't going to.");
g9b.transform("He is going to post the photos.", ...QUE, "Is he going to post the photos?", "בשאלה is עובר להתחלה.", "Is goes first.", { trap: "gt-question" });
g9b.order("What are you going to wear to the wedding?", "מילת שאלה + are + you + going to + פועל?", "Wh- + are + you + going to + verb?");
g9b.cloze("A new home", "Next month we {1} to a new neighborhood. My parents {2} new furniture, and my dad {3} the old oven. I {4} my room blue. My little sister {5} to leave her friends – she's sad.", [["move", ["are going to move", "'re going to move"]], ["buy", ["are going to buy", "'re going to buy"]], ["repair", ["is going to repair", "'s going to repair"]], ["paint", ["am going to paint", "'m going to paint"]], ["not / want", ["isn't going to want", "is not going to want"]]], "תוכניות: am / is / are + going to + פועל.", "Plans: am / is / are + going to + verb.", { allow: ["sad"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "gt", 3);
l3.mcq("Watch out! You ___ that glass!", ["are going to break", "will break", "break"], "תחזית לפי סימן ברור → are going to break.", "Clear evidence → are going to break.", { allow: ["glass"] });
l3.mcq("I ___ call you, but my phone died.", ["was going to", "am going to", "will"], "תוכנית בעבר שלא קרתה → was going to.", "A past plan that didn't happen → was going to.", { allow: ["died"] });
l3.type("We ___ to Eilat this weekend. We booked the hotel.", "go", ["are going to go", "'re going to go", "are going"], "תוכנית שכבר סגורה → are going to go.", "Decided plan → are going to go.", { allow: ["booked", "hotel"] });
l3.type("They ___ fly, but in the end they drove.", "be going to", "were going to", "תוכנית שהשתנתה → were going to.", "A plan that changed → were going to.");
l3.fix("She *going to study medicine.", ["is going to", "'s going to"], "חסר is.", "Missing is.", { trap: "gt-no-be", allow: ["medicine"] });
l3.fix("I'm going *buy a new laptop.", ["to buy"], "חסר to: going to buy.", "Missing to.", { trap: "gt-no-to", allow: ["laptop"] });
l3.fix("Why *you are going to leave so early?", ["are you"], "בשאלה: Why + are + you + going to…?", "Question order: Why are you going to…?", { trap: "gt-question" });
l3.transform("I'm going to study medicine.", "Ask a question with 'What'.", "שאלו שאלה עם What", ["What are you going to study?"], "שאלה: What + are + you + going to study?", "What are you going to study?", { allow: ["medicine"] });
l3.transform("We were going to fly.", "Add what happened instead: 'but we drove'.", "הוסיפו מה קרה בפועל: but we drove", ["We were going to fly, but we drove.", "We were going to fly but we drove."], "was / were going to + but + מה שקרה.", "were going to …, but …");
l3.sort(["✓ Correct", "✗ Wrong"], [["It's going to rain.", "✓ Correct"], ["He going to win.", "✗ Wrong"], ["We're going to go home.", "✓ Correct"], ["She is going to plays.", "✗ Wrong"], ["I was going to call you.", "✓ Correct"], ["They is going to come.", "✗ Wrong"]], "התיקונים: He is going to · She is going to play · They are going to.", "Fixes: He is going to · She is going to play · They are going to.", { allow: ["rain"] });
l3.cloze("A change of plans", "We {1} to the beach on Saturday, but then we saw the weather report. \"It {2} all day,\" said Dad. So now we {3} a movie at home. My brother {4} popcorn. I {5} my homework first – boring!", [["go", ["were going to go", "were going"]], ["rain", ["is going to rain", "'s going to rain"]], ["watch", ["are going to watch", "'re going to watch"]], ["make", ["is going to make", "'s going to make"]], ["finish", ["am going to finish", "'m going to finish"]]], "תוכנית שהשתנתה → were going to. תחזית ותוכניות חדשות → is / are / am going to.", "Changed plan → were going to. Evidence and new plans → be going to.", { allow: ["beach", "report", "rain", "popcorn", "boring"] });
l3.write("Write about three plans you have for next year, and one plan you had that didn't happen.", "כתבו על שלוש תוכניות שיש לכם לשנה הבאה, ועל תוכנית אחת שהייתה לכם ולא קרתה.", "Next year I'm going to learn to play the guitar. I'm going to join a basketball team and I'm going to read more. Last summer I was going to visit my cousin, but I got sick.", "am / is / are going to + פועל. תוכנית שלא קרתה: was going to.", "be going to + verb. A plan that didn't happen: was going to.");

export const goingToItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
