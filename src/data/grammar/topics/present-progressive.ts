import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG, QUE } from "@/data/grammar/build";

// Band II: VERBS: Present continuous (+ questions).

export const presentProgressiveTopic: GrammarTopic = {
  id: "present-progressive",
  group: "tenses",
  title: "Present Progressive",
  titleHe: "הווה מתמשך",
  bandRefs: ["VERBS: Present continuous", "VERBS: Present continuous - questions"],
  grades: { 7: "evolving", 8: "evolving", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "מה קורה עכשיו: am / is / are + פועל עם ing", en: "Happening now: am / is / are + verb-ing", examples: ["I **am reading** now.", "She **is playing** outside.", "They **are eating** lunch."] },
        { he: "חייבים am / is / are לפני ה-ing", en: "Always am / is / are before -ing", examples: ["He **is sleeping**.", "✗ He sleeping."] },
        { he: "שלילה: am / is / are + not", en: "Negative: am / is / are + not", examples: ["We **aren't watching** a movie.", "I'**m not working**."] },
        { he: "שאלה: Am / Is / Are בהתחלה", en: "Question: Am / Is / Are first", examples: ["**Are** you **listening**?", "What **is** she **doing**?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "I am / he, she, it is / we, you, they are + verb-ing", example: "She is singing." },
        { kind: "negative", pattern: "am not / isn't / aren't + verb-ing", example: "They aren't working." },
        { kind: "question", pattern: "Am / Is / Are + subject + verb-ing?", example: "Is he sleeping?" },
      ],
      timeWords: ["now", "right now", "at the moment", "Look!", "Listen!"],
    },
    2: {
      points: [
        { he: "עכשיו, וגם דברים זמניים בתקופה הזאת", en: "Now, and temporary things these days", examples: ["Shh! The baby **is sleeping**.", "I **am learning** to drive this year."] },
        { he: "כללי כתיב: make → making, swim → swimming", en: "Spelling: make → making, swim → swimming", examples: ["mak**ing**", "swim**ming**", "ly**ing**"], chips: true },
        { he: "Look! ו-Listen! רומזים על הווה מתמשך", en: "Look! / Listen! signal the present progressive", examples: ["Look! It **is raining**.", "Listen! Someone **is knocking**."] },
        { he: "תשובות קצרות", en: "Short answers", examples: ["Yes, I **am**.", "No, she **isn't**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "subject + am / is / are + verb-ing", example: "We're making a cake." },
        { kind: "negative", pattern: "subject + am not / isn't / aren't + verb-ing", example: "He isn't listening." },
        { kind: "question", pattern: "(Wh-) + am / is / are + subject + verb-ing?", example: "Where are you going?" },
        { kind: "short_answer", pattern: "Yes, … am / is / are. No, … isn't / aren't.", example: "Yes, they are." },
      ],
      timeWords: ["now", "at the moment", "today", "this week", "these days"],
    },
    3: {
      points: [
        { he: "מצבים זמניים לעומת קבועים", en: "Temporary situations", examples: ["I **am staying** with my aunt this month.", "Prices **are rising** these days."] },
        { he: "תוכניות שכבר סגורות לעתיד הקרוב", en: "Fixed plans for the near future", examples: ["We **are flying** to Rome on Sunday.", "**Are** you **coming** to the party?"] },
        { he: "פעלי מצב (know, want, like) – בלי ing", en: "State verbs (know, want, like) – no -ing", examples: ["I **know** the answer.", "✗ I am knowing the answer."] },
        { he: "שאלות עם מילת שאלה", en: "Wh- questions", examples: ["What **are** you **doing**?", "Why **is** he **crying**?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "be + verb-ing (now / temporary / arranged future)", example: "I'm meeting Dan tonight." },
        { kind: "question", pattern: "Wh- + be + subject + verb-ing?", example: "Who are you talking to?" },
      ],
      timeWords: ["at the moment", "currently", "this month", "tonight", "on Sunday"],
    },
  },
  traps: [
    { id: "pp-no-be", wrong: "She reading a book.", right: "She is reading a book.", whyHe: "חייבים is / am / are לפני ה-ing.", whyEn: "You need is / am / are before -ing." },
    { id: "pp-no-ing", wrong: "I am read now.", right: "I am reading now.", whyHe: "אחרי am / is / are הפועל מקבל ing.", whyEn: "After am / is / are, the verb takes -ing." },
    { id: "pp-spelling", wrong: "He is runing.", right: "He is running.", whyHe: "עיצור-תנועה-עיצור בסוף מילה קצרה: מכפילים (run → running).", whyEn: "Short verbs ending consonant-vowel-consonant double the last letter." },
    { id: "pp-state", wrong: "I am wanting a drink.", right: "I want a drink.", whyHe: "want, know, like הם פעלי מצב – בלי ing.", whyEn: "want / know / like are state verbs – no -ing." },
    { id: "pp-question", wrong: "You are coming?", right: "Are you coming?", whyHe: "בשאלה are עובר לפני הנושא.", whyEn: "In a question, are goes before the subject." },
  ],
};

const T = "present-progressive";

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "pp", 1, 7);
g7a.mcq("Look! The team ___ now.", ["is playing", "plays", "playing"], "Look! = עכשיו, ולכן is playing.", "Look! = now → is playing.", { trap: "pp-no-be" });
g7a.mcq("I ___ my hair at the moment.", ["am brushing", "brush", "is brushing"], "at the moment = עכשיו. עם I → am brushing.", "at the moment → I am brushing.");
g7a.mcq("My parents ___ to the village right now.", ["are driving", "is driving", "drive"], "My parents = they, ולכן are driving.", "My parents = they → are driving.");
g7a.mcq("She ___ a picture now.", ["is coloring", "are coloring", "coloring"], "המבנה: She + is + coloring.", "She + is + coloring.", { trap: "pp-no-be" });
g7a.mcq("___ you helping your dad now?", ["Are", "Do", "Is"], "שאלה בהווה מתמשך: Are you…?", "Question: Are you…?", { trap: "pp-question" });
g7a.bank("Shh! The baby ___.", ["is sleeping", "sleeps", "sleeping"], "Shh! = עכשיו, ולכן is sleeping.", "Shh! = now → is sleeping.", { allow: ["shh"] });
g7a.bank("We ___ for the bus now.", ["are waiting", "is waiting", "wait"], "המבנה: We + are + waiting.", "We + are + waiting.");
g7a.bank("He ___ his homework now. He is playing.", ["isn't doing", "doesn't do", "aren't doing"], "שלילה בהווה מתמשך: isn't doing.", "Negative: isn't doing.");
g7a.order("They are crossing the bridge now.", "מי + are + פועל-ing + מה + מתי.", "Who + are + verb-ing + what + when.");
g7a.order("Is she combing her hair?", "שאלה: Is + she + פועל-ing?", "Question: Is + she + verb-ing?", { trap: "pp-question" });
g7a.sort(["am", "is", "are"], [["I", "am"], ["my team", "is"], ["they", "are"], ["the guide", "is"], ["we", "are"], ["you", "are"]], "I → am. יחיד → is. רבים ו-you → are.", "I → am. Singular → is. Plural and you → are.");
g7a.match([["Listen! The band", "is playing our song."], ["Look! The kids", "are swimming in the river."], ["I", "am writing a list."], ["Dad", "is cooking a meal."]], "is / are / am לפי הנושא + פועל-ing.", "is / are / am by subject + verb-ing.");

const g7b = itemSet(T, "pp", 2, 7);
g7b.type("Look! The guide ___ at the mountain.", "point", "is pointing", "Look! = עכשיו: is + pointing.", "Look! → is pointing.");
g7b.type("We ___ across the river right now.", "swim", ["are swimming", "'re swimming"], "swim → swimming (מכפילים m).", "swim → swimming (double m).", { trap: "pp-spelling" });
g7b.type("My sister ___ a cake at the moment.", "make", ["is making", "'s making"], "make → making (ה-e נופל).", "make → making (drop the e).", { trap: "pp-spelling" });
g7b.type("I ___ to music now. I'm studying.", "not / listen", ["am not listening", "'m not listening"], "שלילה עם I: am not + listening.", "Negative with I: am not listening.");
g7b.mcq("What ___ you doing in the office?", ["are", "do", "is"], "שאלה עם מילת שאלה: What + are + you + doing?", "Wh- question: What are you doing?");
g7b.fix("Look! The kids *running to the club.", ["are running"], "חסר are: The kids are running.", "Missing are: The kids are running.", { trap: "pp-no-be" });
g7b.fix("My dad is *drive to work now.", ["driving"], "אחרי is הפועל עם ing: driving.", "After is → driving.", { trap: "pp-no-ing" });
g7b.fix("She is *siting next to me.", ["sitting"], "sit → sitting (מכפילים t).", "sit → sitting (double t).", { trap: "pp-spelling" });
g7b.transform("The team is practicing now.", ...NEG, ["The team isn't practicing now.", "The team is not practicing now."], "שלילה: is + not + practicing.", "is not + practicing.");
g7b.transform("They are traveling to the mountains.", ...QUE, "Are they traveling to the mountains?", "בשאלה are עובר להתחלה.", "Are goes first.", { trap: "pp-question" });
g7b.order("Why are you crying?", "מילת שאלה + are + you + פועל-ing?", "Wh- + are + you + verb-ing?");
g7b.cloze("At the village", "It's Saturday morning. Grandma {1} in the garden, and Grandpa {2} the newspaper. My cousins {3} in the river. I {4} a photo, but my brother {5} – he's still asleep!", [["work", ["is working", "'s working"]], ["read", ["is reading", "'s reading"]], ["swim", ["are swimming", "'re swimming"]], ["take", ["am taking", "'m taking"]], ["not / help", ["isn't helping", "is not helping"]]], "עכשיו = am / is / are + ing. take → taking, swim → swimming.", "Now → am / is / are + -ing. take → taking, swim → swimming.", { allow: ["grandma", "grandpa", "cousins", "asleep", "newspaper"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "pp", 1, 8);
g8a.mcq("Look! The chef ___ the cream.", ["is pouring", "pours", "pouring"], "Look! = עכשיו, ולכן is pouring.", "Look! = now → is pouring.", { trap: "pp-no-be", allow: ["chef"] });
g8a.mcq("I ___ a new game right now.", ["am downloading", "download", "is downloading"], "right now = עכשיו. עם I → am downloading.", "right now → I am downloading.");
g8a.mcq("The actors ___ on the stage now.", ["are performing", "is performing", "perform"], "The actors = they, ולכן are performing.", "The actors = they → are performing.");
g8a.mcq("My mom ___ the house for the party.", ["is decorating", "are decorating", "decorating"], "המבנה: My mom + is + decorating.", "My mom + is + decorating.", { trap: "pp-no-be" });
g8a.mcq("___ your brother chatting online again?", ["Is", "Does", "Are"], "שאלה בהווה מתמשך: Is your brother…?", "Question: Is your brother…?", { trap: "pp-question" });
g8a.bank("Listen! Someone ___ the drums.", ["is playing", "plays", "playing"], "Listen! = עכשיו, ולכן is playing.", "Listen! = now → is playing.");
g8a.bank("We ___ in a traffic jam right now.", ["are sitting", "is sitting", "sit"], "המבנה: We + are + sitting.", "We + are + sitting.");
g8a.bank("The kids ___ well today. They're very noisy.", ["aren't behaving", "don't behave", "isn't behaving"], "שלילה בהווה מתמשך: aren't behaving.", "Negative: aren't behaving.");
g8a.order("She is recording a song now.", "מי + is + פועל-ing + מה + מתי.", "Who + is + verb-ing + what + when.");
g8a.order("Are they cooking dinner?", "שאלה: Are + they + פועל-ing?", "Question: Are + they + verb-ing?", { trap: "pp-question" });
g8a.sort(["am", "is", "are"], [["I", "am"], ["the chef", "is"], ["the actors", "are"], ["my uncle", "is"], ["we", "are"], ["you", "are"]], "I → am. יחיד → is. רבים ו-you → are.", "I → am. Singular → is. Plural and you → are.", { allow: ["chef"] });
g8a.match([["Look! The plane", "is landing at the airport."], ["Listen! The fans", "are cheering."], ["I", "am waiting at the bus station."], ["My sister", "is trying on a dress."]], "is / are / am לפי הנושא + פועל-ing.", "is / are / am by subject + verb-ing.", { allow: ["fans", "cheering", "dress"] });

const g8b = itemSet(T, "pp", 2, 8);
g8b.type("Look! The waiter ___ our food.", "bring", "is bringing", "Look! = עכשיו: is + bringing.", "Look! → is bringing.", { allow: ["waiter"] });
g8b.type("The kids ___ in the swimming pool.", "swim", ["are swimming", "'re swimming"], "swim → swimming (מכפילים m).", "swim → swimming (double m).", { trap: "pp-spelling" });
g8b.type("Dad ___ the kitchen right now.", "decorate", ["is decorating", "'s decorating"], "decorate → decorating (ה-e נופל).", "decorate → decorating (drop the e).", { trap: "pp-spelling" });
g8b.type("I ___ at the moment. I'm on vacation!", "not / work", ["am not working", "'m not working"], "שלילה עם I: am not + working.", "Negative with I: am not working.");
g8b.mcq("Who ___ you chatting with?", ["are", "do", "is"], "שאלה: Who + are + you + chatting?", "Wh- question: Who are you chatting with?");
g8b.fix("Listen! My neighbor *playing the drums.", ["is playing"], "חסר is: My neighbor is playing.", "Missing is: My neighbor is playing.", { trap: "pp-no-be" });
g8b.fix("They are *download the movie now.", ["downloading"], "אחרי are הפועל עם ing: downloading.", "After are → downloading.", { trap: "pp-no-ing" });
g8b.fix("The plane is *geting ready to land.", ["getting"], "get → getting (מכפילים t).", "get → getting (double t).", { trap: "pp-spelling" });
g8b.transform("The students are behaving well.", ...NEG, ["The students aren't behaving well.", "The students are not behaving well."], "שלילה: are + not + behaving.", "are not + behaving.");
g8b.transform("She is recording a podcast.", ...QUE, "Is she recording a podcast?", "בשאלה is עובר להתחלה.", "Is goes first.", { trap: "pp-question", allow: ["podcast"] });
g8b.order("What are you cooking for dinner?", "מילת שאלה + are + you + פועל-ing?", "Wh- + are + you + verb-ing?");
g8b.cloze("At the café", "It's Friday afternoon at our café. Two waiters {1} coffee, and a man {2} a cake. Some teenagers {3} at a table near the window. I {4} a photo for the menu, but the cook {5} – she's on a break.", [["serve", ["are serving", "'re serving"]], ["cut", ["is cutting", "'s cutting"]], ["chat", ["are chatting", "'re chatting"]], ["take", ["am taking", "'m taking"]], ["not / work", ["isn't working", "is not working"]]], "עכשיו = am / is / are + ing. cut → cutting, chat → chatting.", "Now → am / is / are + -ing. cut → cutting, chat → chatting.", { allow: ["waiters", "window", "menu", "break"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "pp", 1, 9);
g9a.mcq("Look! My brother ___ a selfie.", ["is taking", "takes", "taking"], "Look! = עכשיו, ולכן is taking.", "Look! = now → is taking.", { trap: "pp-no-be" });
g9a.mcq("I ___ an article for the school newspaper.", ["am translating", "translate", "is translating"], "עם I → am translating.", "I → am translating.", { allow: ["newspaper"] });
g9a.mcq("The firefighters ___ the fire right now.", ["are fighting", "is fighting", "fight"], "The firefighters = they, ולכן are fighting.", "The firefighters = they → are fighting.");
g9a.mcq("Dad ___ the oven at the moment.", ["is repairing", "are repairing", "repairing"], "המבנה: Dad + is + repairing.", "Dad + is + repairing.", { trap: "pp-no-be" });
g9a.mcq("___ you binge-watching that series again?", ["Are", "Do", "Is"], "שאלה בהווה מתמשך: Are you…?", "Question: Are you…?", { trap: "pp-question" });
g9a.bank("Listen! Someone ___ at the door.", ["is knocking", "knocks", "knocking"], "Listen! = עכשיו, ולכן is knocking.", "Listen! = now → is knocking.");
g9a.bank("My parents ___ the housework now.", ["are doing", "is doing", "do"], "My parents = they, ולכן are doing.", "My parents = they → are doing.");
g9a.bank("The elevator ___ today. Take the stairs.", ["isn't working", "doesn't work", "aren't working"], "שלילה בהווה מתמשך (היום): isn't working.", "Negative, today: isn't working.", { allow: ["stairs"] });
g9a.order("She is posting a tweet now.", "מי + is + פועל-ing + מה + מתי.", "Who + is + verb-ing + what + when.");
g9a.order("Are they sailing to the island?", "שאלה: Are + they + פועל-ing?", "Question: Are + they + verb-ing?", { trap: "pp-question" });
g9a.sort(["am", "is", "are"], [["I", "am"], ["the architect", "is"], ["the dolphins", "are"], ["my colleague", "is"], ["we", "are"], ["you", "are"]], "I → am. יחיד → is. רבים ו-you → are.", "I → am. Singular → is. Plural and you → are.");
g9a.match([["Look! The dolphins", "are jumping out of the water."], ["Listen! The phone", "is ringing."], ["I", "am wiping the table."], ["The architect", "is drawing a plan."]], "is / are / am לפי הנושא + פועל-ing.", "is / are / am by subject + verb-ing.");

const g9b = itemSet(T, "pp", 2, 9);
g9b.type("Look! The firefighter ___ the ladder.", "climb", "is climbing", "Look! = עכשיו: is + climbing.", "Look! → is climbing.");
g9b.type("The dolphins ___ near the boat.", "swim", ["are swimming", "'re swimming"], "swim → swimming (מכפילים m).", "swim → swimming (double m).", { trap: "pp-spelling" });
g9b.type("Grandma ___ a dress for the wedding.", "sew", ["is sewing", "'s sewing"], "המבנה: Grandma + is + sewing.", "Grandma + is + sewing.", { allow: ["grandma", "dress"] });
g9b.type("I ___ my phone this week. I want a break.", "not / use", ["am not using", "'m not using"], "שלילה עם I: am not + using. use → using (ה-e נופל).", "am not using (drop the e).");
g9b.mcq("Why ___ the neighbors complaining?", ["are", "do", "is"], "המבנה: the neighbors = they: Why + are + …?", "Why + are + the neighbors + -ing?");
g9b.fix("Look! The dog *running on the sand.", ["is running"], "חסר is: The dog is running.", "Missing is: The dog is running.", { trap: "pp-no-be" });
g9b.fix("She is *update her apps right now.", ["updating"], "אחרי is הפועל עם ing: updating.", "After is → updating.", { trap: "pp-no-ing" });
g9b.fix("The kids are *lieing on the grass.", ["lying"], "lie → lying (ie הופך ל-y).", "lie → lying.", { trap: "pp-spelling" });
g9b.transform("The architect is designing a tower.", ...NEG, ["The architect isn't designing a tower.", "The architect is not designing a tower."], "שלילה: is + not + designing.", "is not + designing.");
g9b.transform("They are interviewing the singer.", ...QUE, "Are they interviewing the singer?", "בשאלה are עובר להתחלה.", "Are goes first.", { trap: "pp-question", allow: ["singer"] });
g9b.order("What are you binge-watching these days?", "מילת שאלה + are + you + פועל-ing?", "Wh- + are + you + verb-ing?");
g9b.cloze("Getting ready for the wedding", "Everyone is busy today. Mom {1} the cake, and Dad {2} the candles on the tables. My cousins {3} the hall. I {4} my speech, and my sister {5} – she's on the phone!", [["decorate", ["is decorating", "'s decorating"]], ["put", ["is putting", "'s putting"]], ["clean", ["are cleaning", "'re cleaning"]], ["practice", ["am practicing", "'m practicing"]], ["not / help", ["isn't helping", "is not helping"]]], "עכשיו = am / is / are + ing. put → putting, practice → practicing.", "Now → am / is / are + -ing. put → putting, practice → practicing.", { allow: ["cousins", "hall"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "pp", 3);
l3.mcq("I ___ what you mean.", ["understand", "am understanding", "understanding"], "understand – פועל מצב, בלי ing.", "understand is a state verb – no -ing.", { trap: "pp-state" });
l3.mcq("We ___ to Rome on Sunday. The tickets are booked.", ["are flying", "fly", "flying"], "תוכנית סגורה לעתיד הקרוב → are flying.", "Fixed plan for the near future → are flying.", { allow: ["rome", "booked"] });
l3.type("Prices ___ these days.", "rise", ["are rising", "'re rising"], "these days = מצב זמני שמשתנה → are rising. rise → rising.", "these days = changing situation → are rising.", { allow: ["prices"] });
l3.type("Who ___ to on the phone?", "you / talk", "are you talking", "שאלה: Who + are + you + talking?", "Who + are + you + talking?");
l3.fix("I *am wanting a new phone.", ["want"], "want – פועל מצב, בלי ing.", "want is a state verb – no -ing.", { trap: "pp-state" });
l3.fix("Why *you are laughing?", ["are you"], "בשאלה: Why + are + you…?", "Question order: Why are you…?", { trap: "pp-question" });
l3.fix("She is *stoping the car.", ["stopping"], "stop → stopping (מכפילים p).", "stop → stopping (double p).", { trap: "pp-spelling" });
l3.transform("My cousin is living in London this year.", "Ask a question with 'Where'.", "שאלו שאלה עם Where", ["Where is your cousin living this year?", "Where is my cousin living this year?", "Where is he living this year?", "Where is she living this year?"], "Where + is + נושא + living?", "Where + is + subject + living?", { allow: ["london", "cousin"] });
l3.transform("We are meeting at the café tonight.", ...NEG, ["We aren't meeting at the café tonight.", "We are not meeting at the café tonight.", "We're not meeting at the café tonight."], "שלילה: are + not + meeting.", "are not + meeting.");
l3.sort(["✓ Correct", "✗ Wrong"], [["I'm staying with my aunt this week.", "✓ Correct"], ["She is knowing the answer.", "✗ Wrong"], ["Are you coming tonight?", "✓ Correct"], ["They watching a movie.", "✗ Wrong"], ["He's writing an email.", "✓ Correct"], ["I am swiming now.", "✗ Wrong"]], "התיקונים: She knows · They are watching · I am swimming.", "Fixes: She knows · They are watching · I am swimming.", { allow: ["email"] });
l3.cloze("A busy week", "This week is crazy. My parents {1} abroad, so I {2} with my grandparents. My grandma {3} me to cook, and I {4} a lot. On Friday we {5} a party for my cousin.", [["travel", ["are traveling", "'re traveling", "are travelling"]], ["stay", ["am staying", "'m staying"]], ["teach", ["is teaching", "'s teaching"]], ["learn", ["am learning", "'m learning"]], ["have", ["are having", "'re having"]]], "מצבים זמניים (this week) ותוכנית סגורה (on Friday) → הווה מתמשך.", "Temporary situations and a fixed plan → present progressive.", { allow: ["grandma", "cousin", "crazy"] });
l3.write("Write three sentences about what people around you are doing right now, and one plan you have for this weekend.", "כתבו שלושה משפטים על מה שאנשים סביבכם עושים עכשיו, ומשפט אחד על תוכנית לסוף השבוע.", "My teacher is writing on the board. Two students are talking. I am thinking about lunch. On Saturday I'm going to the beach.", "am / is / are + פועל-ing.", "am / is / are + verb-ing.");

export const presentProgressiveItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
