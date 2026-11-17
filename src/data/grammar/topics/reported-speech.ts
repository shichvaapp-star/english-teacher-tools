import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: CLAUSES: Reported speech – to report something said (said that / told me that).

export const reportedSpeechTopic: GrammarTopic = {
  id: "reported-speech",
  group: "clauses",
  title: "Reported Speech (said / told)",
  titleHe: "דיבור עקיף – said / told",
  bandRefs: ["CLAUSES: Reported speech"],
  grades: { 7: "emerging", 8: "evolving", 9: "evolving" },
  rule: {
    1: {
      points: [
        { he: "מספרים מה מישהו אמר: said (that)…", en: "Report what someone said: said (that)…", examples: ["\"I'm tired.\" → She **said** (that) she was tired."] },
        { he: "told + אדם + (that)…", en: "told + person + (that)…", examples: ["He **told me** (that) he was sick.", "✗ He said me…"] },
        { he: "אני / אתה משתנה: I → he / she", en: "Pronouns change: I → he / she", examples: ["\"**I** like it.\" → She said **she** liked it."] },
        { he: "בלי מירכאות בדיבור עקיף", en: "No quotation marks in reported speech", examples: ["Dan said he was hungry."] },
      ],
      form: [
        { kind: "affirmative", pattern: "subject + said (that) + clause", example: "Maya said that she was busy." },
        { kind: "affirmative", pattern: "subject + told + person + (that) + clause", example: "Maya told me that she was busy." },
      ],
      timeWords: ["said", "told me", "that"],
    },
    2: {
      points: [
        { he: "הזמן זז אחורה: am / is → was, like → liked", en: "Tense moves back: am / is → was, like → liked", examples: ["\"I **am** happy.\" → He said he **was** happy.", "\"I **like** pizza.\" → She said she **liked** pizza."] },
        { he: "will הופך ל-would, can הופך ל-could", en: "will → would, can → could", examples: ["\"I **will** help.\" → He said he **would** help.", "\"I **can** swim.\" → She said she **could** swim."] },
        { he: "say בלי אדם, tell עם אדם", en: "say without a person, tell with a person", examples: ["She **said** that…", "She **told** **him** that…"] },
        { he: "גם my הופך ל-his / her, ו-here ל-there", en: "my → his / her, here → there", examples: ["\"**My** bag is **here**.\" → She said **her** bag was **there**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "present → past, will → would, can → could", example: "\"I can come.\" → He said he could come." },
      ],
      timeWords: ["said", "told", "explained", "added"],
    },
    3: {
      points: [
        { he: "שאלות בדיבור עקיף: asked if / asked + Wh-", en: "Reported questions: asked if / asked + wh-", examples: ["\"Are you OK?\" → She **asked if** I was OK.", "\"Where do you live?\" → He asked **where I lived**."] },
        { he: "ציוויים: told + אדם + to + פועל", en: "Commands: told + person + to + verb", examples: ["\"Sit down!\" → The teacher **told us to sit** down."] },
        { he: "בקשות: asked + אדם + to + פועל", en: "Requests: asked + person + to + verb", examples: ["\"Please help me.\" → She **asked me to help** her."] },
        { he: "עבר → past perfect", en: "past → past perfect", examples: ["\"I **saw** it.\" → He said he **had seen** it."] },
      ],
      form: [
        { kind: "question", pattern: "asked if / whether + subject + verb", example: "He asked if I was ready." },
        { kind: "affirmative", pattern: "told / asked + person + (not) to + verb", example: "She told me not to worry." },
      ],
      timeWords: ["asked if", "wanted to know", "told me to", "the day before"],
    },
  },
  traps: [
    { id: "rs-said-me", wrong: "She said me that she was tired.", right: "She told me that she was tired.", whyHe: "עם אדם (me) – told, לא said.", whyEn: "With a person → told." },
    { id: "rs-tense", wrong: "He said he is hungry.", right: "He said he was hungry.", whyHe: "אחרי said – הזמן זז אחורה: is → was.", whyEn: "After said → move the tense back." },
    { id: "rs-pronoun", wrong: "Maya said I was tired.", right: "Maya said she was tired.", whyHe: "I של מאיה הופך ל-she.", whyEn: "Maya's 'I' becomes 'she'." },
    { id: "rs-question", wrong: "She asked where did I live.", right: "She asked where I lived.", whyHe: "בשאלה עקיפה – סדר רגיל, בלי did.", whyEn: "Reported question → normal order." },
  ],
};

const T = "reported-speech";
const B = ["said", "told"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "rs", 1, 7);
g7a.mcq("\"I'm hungry.\" → Dan ___ he was hungry.", ["said", "told", "said me"], "בלי אדם אחרי הפועל → said.", "No person after → said.", { trap: "rs-said-me" });
g7a.mcq("\"I'm tired.\" → She told ___ that she was tired.", ["me", "to me", "that me"], "told + אדם: told me.", "told + person: told me.");
g7a.mcq("\"I like the river.\" → Noa said ___ liked the river.", ["she", "I", "you"], "I של נועה → she.", "Noa's 'I' → she.", { trap: "rs-pronoun" });
g7a.mcq("The guide ___ us that the mountain was dangerous.", ["told", "said", "say"], "עם אדם (us) → told.", "With a person → told.", { trap: "rs-said-me" });
g7a.mcq("\"I am happy.\" → My brother said he ___ happy.", ["was", "is", "am"], "am → was (הזמן זז אחורה).", "am → was.", { trap: "rs-tense" });
g7a.bank("My mom ___ that dinner was ready.", ["said", "told", "says me"], "בלי אדם → said.", "No person → said.");
g7a.bank("Dad ___ me to be careful.", ["told", "said", "say"], "told + אדם + to.", "told + person + to.");
g7a.bank("\"We are late.\" → They said ___ were late.", ["they", "we", "you"], "we של הדוברים → they.", "Their 'we' → they.", { trap: "rs-pronoun" });
g7a.order("She told me that she was busy.", "told + אדם + that + משפט.", "told + person + that + clause.");
g7a.order("Dan said that he liked math.", "said + that + משפט.", "said + that + clause.");
g7a.sort(B, [["She … me she was busy.", "told"], ["He … he was hungry.", "said"], ["They … us they were late.", "told"], ["Mom … dinner was ready.", "said"], ["I … my friend the news.", "told"], ["The guide … it was far.", "said"]], "יש אדם אחרי הפועל → told. אין → said.", "Person after → told. No person → said.", { allow: ["news"] });
g7a.match([["\"I'm cold.\"", "She said she was cold."], ["\"I like music.\"", "He said he liked music."], ["\"We are ready.\"", "They said they were ready."], ["\"I can swim.\"", "She said she could swim."]], "I, ולכן he / she, am → was, like → liked, can → could.", "Pronouns and tenses shift.");

const g7b = itemSet(T, "rs", 2, 7);
g7b.type("\"I am at the club.\" → She said she ___ at the club.", "be", "was", "am, ולכן was.", "am → was.", { trap: "rs-tense" });
g7b.type("\"I will help you.\" → He said he ___ help me.", "will", "would", "will, ולכן would.", "will → would.");
g7b.type("\"I can drive.\" → My sister said she ___ drive.", "can", "could", "can, ולכן could.", "can → could.");
g7b.type("\"I love history.\" → Maya said she ___ history.", "love", "loved", "love, ולכן loved.", "love → loved.", { trap: "rs-tense" });
g7b.mcq("\"My bag is here.\" → She said ___ bag was there.", ["her", "my", "his"], "my של הדוברת → her.", "Her 'my' → her.", { trap: "rs-pronoun" });
g7b.fix("He *said me that the river was dangerous.", ["told"], "עם אדם (me) → told.", "With a person → told.", { trap: "rs-said-me" });
g7b.fix("Noa said that *I was tired.", ["she"], "I של נועה → she.", "Noa's 'I' → she.", { trap: "rs-pronoun" });
g7b.fix("Dan said he *is hungry.", ["was"], "אחרי said – is → was.", "After said → was.", { trap: "rs-tense" });
g7b.transform("\"I am busy,\" said Tom.", "Report it: Tom said that…", "דווחו: Tom said that…", ["Tom said that he was busy.", "Tom said he was busy."], "I, ולכן he, am → was.", "I → he, am → was.");
g7b.transform("\"We like the village,\" my parents said.", "Report it: My parents said that…", "דווחו: My parents said that…", ["My parents said that they liked the village.", "My parents said they liked the village."], "we, ולכן they, like → liked.", "we → they, like → liked.");
g7b.order("The teacher told us that the test was easy.", "told + us + that + משפט.", "told + us + that + clause.");
g7b.cloze("A message from Grandma", "Grandma called and {1} that she {2} sick. She {3} me that she {4} come on Friday. She said she {5} us very much.", [["say", "said"], ["be", "was"], ["tell", "told"], ["can – not", ["couldn't", "could not"]], ["love", "loved"]], "said / told me. הזמן זז אחורה: is → was, can't → couldn't, love → loved.", "said / told; tenses shift back.", { allow: ["grandma", "sick"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "rs", 1, 8);
g8a.mcq("\"I'm nervous.\" → The actor ___ he was nervous.", ["said", "told", "said me"], "בלי אדם אחרי הפועל → said.", "No person after → said.", { trap: "rs-said-me", allow: ["nervous"] });
g8a.mcq("\"The concert is great.\" → She told ___ that the concert was great.", ["us", "to us", "that us"], "told + אדם: told us.", "told + person: told us.");
g8a.mcq("\"I love cooking.\" → My uncle said ___ loved cooking.", ["he", "I", "you"], "I של הדוד → he.", "His 'I' → he.", { trap: "rs-pronoun" });
g8a.mcq("The pilot ___ the passengers that the flight was late.", ["told", "said", "say"], "עם אדם (the passengers) → told.", "With a person → told.", { trap: "rs-said-me" });
g8a.mcq("\"I am at the airport.\" → Dad said he ___ at the airport.", ["was", "is", "am"], "am, ולכן was.", "am → was.", { trap: "rs-tense" });
g8a.bank("The waiter ___ that the café was closing.", ["said", "told", "says me"], "בלי אדם → said.", "No person → said.", { allow: ["waiter", "closing"] });
g8a.bank("Mom ___ me to buy some flour.", ["told", "said", "say"], "told + אדם + to.", "told + person + to.");
g8a.bank("\"We are hungry.\" → The kids said ___ were hungry.", ["they", "we", "you"], "we של הילדים → they.", "Their 'we' → they.", { trap: "rs-pronoun" });
g8a.order("He told me that he wanted to be an actor.", "told + אדם + that + משפט.", "told + person + that + clause.");
g8a.order("She said that the dish was spicy.", "said + that + משפט.", "said + that + clause.", { allow: ["spicy"] });
g8a.sort(B, [["She … us the news.", "told"], ["He … he was late.", "said"], ["They … me about the trip.", "told"], ["The pilot … we would land soon.", "said"], ["I … my parents the truth.", "told"], ["The chef … the dish was ready.", "said"]], "יש אדם אחרי הפועל → told. אין → said.", "Person after → told. No person → said.", { allow: ["news", "trip", "chef"] });
g8a.match([["\"I'm bored.\"", "He said he was bored."], ["\"I want a camera.\"", "She said she wanted a camera."], ["\"We will come.\"", "They said they would come."], ["\"I can cook.\"", "He said he could cook."]], "I, ולכן he / she, am → was, want → wanted, will → would, can → could.", "Pronouns and tenses shift.", { allow: ["bored"] });

const g8b = itemSet(T, "rs", 2, 8);
g8b.type("\"I am in a traffic jam.\" → Dad said he ___ in a traffic jam.", "be", "was", "am, ולכן was.", "am → was.", { trap: "rs-tense" });
g8b.type("\"I will call you.\" → She said she ___ call me.", "will", "would", "will, ולכן would.", "will → would.");
g8b.type("\"I can't come.\" → My friend said he ___ come.", "can – not", ["couldn't", "could not"], "can't, ולכן couldn't.", "can't → couldn't.");
g8b.type("\"I want to travel abroad.\" → Maya said she ___ to travel abroad.", "want", "wanted", "want, ולכן wanted.", "want → wanted.", { trap: "rs-tense" });
g8b.mcq("\"My camera is broken.\" → He said ___ camera was broken.", ["his", "my", "her"], "my של הדובר → his.", "His 'my' → his.", { trap: "rs-pronoun" });
g8b.fix("The director *said us that the play was ready.", ["told"], "עם אדם (us) → told.", "With a person → told.", { trap: "rs-said-me" });
g8b.fix("My mom said that *I was busy at work.", ["she"], "I של אמא → she.", "Mom's 'I' → she.", { trap: "rs-pronoun" });
g8b.fix("The pilot said the weather *is bad.", ["was"], "אחרי said – is → was.", "After said → was.", { trap: "rs-tense" });
g8b.transform("\"I am a chef,\" said my uncle.", "Report it: My uncle said that…", "דווחו: My uncle said that…", ["My uncle said that he was a chef.", "My uncle said he was a chef."], "I, ולכן he, am → was.", "I → he, am → was.", { allow: ["chef"] });
g8b.transform("\"We will be late,\" they said.", "Report it: They said that…", "דווחו: They said that…", ["They said that they would be late.", "They said they would be late."], "we, ולכן they, will → would.", "we → they, will → would.");
g8b.order("The waiter told us that the kitchen was closed.", "told + us + that + משפט.", "told + us + that + clause.", { allow: ["waiter"] });
g8b.cloze("A phone call", "My cousin called and {1} that she {2} abroad. She {3} me that the food {4} amazing. She said she {5} back next week.", [["say", "said"], ["be", "was"], ["tell", "told"], ["be", "was"], ["will / come", "would come"]], "said / told me. הזמן זז אחורה: is → was, will → would.", "said / told; tenses shift back.", { allow: ["cousin"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "rs", 1, 9);
g9a.mcq("\"I'm a vegetarian.\" → My neighbor ___ she was a vegetarian.", ["said", "told", "said me"], "בלי אדם אחרי הפועל → said.", "No person after → said.", { trap: "rs-said-me" });
g9a.mcq("\"The elevator is broken.\" → He told ___ that the elevator was broken.", ["us", "to us", "that us"], "told + אדם: told us.", "told + person: told us.");
g9a.mcq("\"I love this novel.\" → The author said ___ loved the novel.", ["she", "I", "you"], "I של הסופרת → she.", "Her 'I' → she.", { trap: "rs-pronoun", allow: ["author"] });
g9a.mcq("The firefighter ___ the reporters that everyone was safe.", ["told", "said", "say"], "עם אדם (the reporters) → told.", "With a person → told.", { trap: "rs-said-me", allow: ["reporters", "safe"] });
g9a.mcq("\"I am stressed.\" → My sister said she ___ stressed.", ["was", "is", "am"], "am, ולכן was.", "am → was.", { trap: "rs-tense", allow: ["stressed"] });
g9a.bank("The architect ___ that the tower was almost finished.", ["said", "told", "says me"], "בלי אדם → said.", "No person → said.", { allow: ["almost"] });
g9a.bank("My dad ___ me to switch off the oven.", ["told", "said", "say"], "told + אדם + to.", "told + person + to.");
g9a.bank("\"We are moving.\" → The neighbors said ___ were moving.", ["they", "we", "you"], "we של השכנים → they.", "Their 'we' → they.", { trap: "rs-pronoun" });
g9a.order("She told me that she wanted to study architecture.", "told + אדם + that + משפט.", "told + person + that + clause.", { allow: ["architecture"] });
g9a.order("He said that the documentary was boring.", "said + that + משפט.", "said + that + clause.", { allow: ["boring"] });
g9a.sort(B, [["She … me the truth.", "told"], ["He … he was tired.", "said"], ["They … us about the wedding.", "told"], ["The reporter … the fire was out.", "said"], ["I … my colleague the plan.", "told"], ["The architect … it was ready.", "said"]], "יש אדם אחרי הפועל → told. אין → said.", "Person after → told. No person → said.", { allow: ["reporter"] });
g9a.match([["\"I'm busy.\"", "He said he was busy."], ["\"I need help.\"", "She said she needed help."], ["\"We will sail.\"", "They said they would sail."], ["\"I can't hear you.\"", "He said he couldn't hear me."]], "I, ולכן he / she, am → was, need → needed, will → would, can't → couldn't.", "Pronouns and tenses shift.");

const g9b = itemSet(T, "rs", 2, 9);
g9b.type("\"I am at the gallery.\" → Mom said she ___ at the gallery.", "be", "was", "am, ולכן was.", "am → was.", { trap: "rs-tense" });
g9b.type("\"I will repair the oven.\" → Dad said he ___ repair the oven.", "will", "would", "will, ולכן would.", "will → would.");
g9b.type("\"I can't find my wallet.\" → She said she ___ find her wallet.", "can – not", ["couldn't", "could not"], "can't, ולכן couldn't.", "can't → couldn't.");
g9b.type("\"I need a break.\" → My colleague said he ___ a break.", "need", "needed", "need, ולכן needed.", "need → needed.", { trap: "rs-tense", allow: ["break"] });
g9b.mcq("\"My novel is finished.\" → The author said ___ novel was finished.", ["her", "my", "your"], "my של הסופרת → her.", "Her 'my' → her.", { trap: "rs-pronoun", allow: ["author"] });
g9b.fix("The firefighter *said me that the building was safe.", ["told"], "עם אדם (me) → told.", "With a person → told.", { trap: "rs-said-me", allow: ["building", "safe"] });
g9b.fix("My neighbor said that *I was moving next month.", ["she", "he"], "I של השכן → he / she.", "The neighbor's 'I' → he / she.", { trap: "rs-pronoun" });
g9b.fix("The architect said the tower *is safe.", ["was"], "אחרי said – is → was.", "After said → was.", { trap: "rs-tense", allow: ["safe"] });
g9b.transform("\"I am a translator,\" said Dana.", "Report it: Dana said that…", "דווחו: Dana said that…", ["Dana said that she was a translator.", "Dana said she was a translator."], "I, ולכן she, am → was.", "I → she, am → was.", { allow: ["translator"] });
g9b.transform("\"We can sail tomorrow,\" they said.", "Report it: They said that…", "דווחו: They said that…", ["They said that they could sail the next day.", "They said they could sail the next day.", "They said that they could sail tomorrow.", "They said they could sail tomorrow."], "we, ולכן they, can → could.", "we → they, can → could.");
g9b.order("The reporter told us that two people were rescued.", "told + us + that + משפט.", "told + us + that + clause.", { allow: ["reporter", "rescued"] });
g9b.cloze("News from abroad", "My cousin texted me. She {1} that she {2} in Paris. She {3} me that the museums {4} amazing and that she {5} home soon.", [["say", "said"], ["be", "was"], ["tell", "told"], ["be", "were"], ["will / come", "would come"]], "said / told me. הזמן זז אחורה: is → was, are → were, will → would.", "said / told; tenses shift back.", { allow: ["cousin", "texted", "paris"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "rs", 3);
l3.mcq("\"Are you OK?\" → She asked ___ I was OK.", ["if", "that", "do"], "שאלת כן / לא עקיפה → asked if.", "Yes/no question → asked if.");
l3.mcq("\"Where do you live?\" → He asked where ___.", ["I lived", "did I live", "do I live"], "שאלה עקיפה – סדר רגיל: I lived.", "Reported question → I lived.", { trap: "rs-question" });
l3.type("\"Sit down!\" → The teacher told us ___ down.", "sit", "to sit", "ציווי → told + אדם + to + פועל.", "Command → told + person + to.");
l3.type("\"I saw the movie.\" → He said he ___ the movie.", "see", "had seen", "עבר → past perfect: had seen.", "Past → had seen.");
l3.mcq("She asked me where ___.", ["I went", "did I go", "I did go"], "שאלה עקיפה – סדר רגיל, בלי did: where I went.", "Reported question → where I went.", { trap: "rs-question" });
l3.mcq("Mom told me ___.", ["not to worry", "don't worry", "to not worrying"], "ציווי שלילי → told + אדם + not to + פועל.", "told me not to worry.");
l3.fix("He asked *that I was ready.", ["if", "whether"], "שאלת כן / לא → asked if.", "Yes/no question → asked if.");
l3.transform("\"Please help me,\" she said to me.", "Report it with 'asked me to'.", "דווחו עם asked me to", ["She asked me to help her."], "בקשה → asked + אדם + to + פועל.", "Request → asked + person + to.");
l3.transform("\"Do you like pizza?\" he asked me.", "Report the question.", "דווחו את השאלה", ["He asked me if I liked pizza.", "He asked if I liked pizza.", "He asked me whether I liked pizza."], "asked if + סדר רגיל + זמן אחורה.", "asked if + normal order + past.", { allow: ["pizza"] });
l3.sort(["✓ Correct", "✗ Wrong"], [["She told me she was tired.", "✓ Correct"], ["She said me she was tired.", "✗ Wrong"], ["He asked if I was OK.", "✓ Correct"], ["He asked where did I live.", "✗ Wrong"], ["They told us to wait.", "✓ Correct"], ["He said he is hungry.", "✗ Wrong"]], "התיקונים: She told me · where I lived · he was hungry.", "Fixes: She told me · where I lived · he was hungry.");
l3.cloze("At the doctor's", "The doctor asked me {1} I felt. I told her that I {2} a headache. She asked {3} I had a fever. Then she told me {4} drink a lot of water and {5} to school for two days.", [["how", "how"], ["have", "had"], ["if / whether", ["if", "whether"]], ["to", "to"], ["not / go", "not to go"]], "asked how / if. had (have, ולכן had). told me to / not to.", "asked how / if; had; told me to / not to.", { allow: ["doctor", "headache", "fever"] });
l3.write("Report a short conversation you had with a friend or family member yesterday. Use said, told, asked if and told me to.", "דווחו על שיחה קצרה שהייתה לכם אתמול עם חבר או בן משפחה. השתמשו ב-said, told, asked if ו-told me to.", "Yesterday my mom asked if I had finished my homework. I said that I was almost done. She told me to finish it before dinner, and she said she would help me if I needed it.", "said / told / asked if / told me to + הזמן זז אחורה.", "said / told / asked if / told me to; tenses shift back.");

export const reportedSpeechItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
