import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG, QUE } from "@/data/grammar/build";

// Band II: VERBS: Past continuous (+ questions). Grade 7: ongoing past actions;
// background / simultaneous uses (when / while) are practised in past-simple-vs-progressive (grades 8–9).

export const pastProgressiveTopic: GrammarTopic = {
  id: "past-progressive",
  group: "tenses",
  title: "Past Progressive",
  titleHe: "עבר מתמשך",
  bandRefs: ["VERBS: Past continuous", "VERBS: Past continuous - questions"],
  grades: { 7: "emerging", 8: "evolving", 9: "evolving" },
  rule: {
    1: {
      points: [
        { he: "מה היה באמצע לקרות בזמן מסוים בעבר", en: "What was happening at a time in the past", examples: ["At 8 o'clock I **was eating** dinner.", "They **were playing** outside."] },
        { he: "עם I / he / she / it – was, עם we / you / they – were", en: "I / he / she / it → was; we / you / they → were", examples: ["She **was reading**.", "We **were waiting**."] },
        { he: "שלילה: wasn't / weren't + ing", en: "Negative: wasn't / weren't + -ing", examples: ["I **wasn't sleeping**.", "They **weren't listening**."] },
        { he: "שאלה: Was / Were בהתחלה", en: "Question: Was / Were first", examples: ["**Were** you **watching**?", "What **was** he **doing**?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "I, he, she, it was / we, you, they were + verb-ing", example: "He was running." },
        { kind: "negative", pattern: "wasn't / weren't + verb-ing", example: "We weren't talking." },
        { kind: "question", pattern: "Was / Were + subject + verb-ing?", example: "Was it raining?" },
      ],
      timeWords: ["at 8 o'clock yesterday", "at that moment", "all morning", "last night at ten"],
    },
    2: {
      points: [
        { he: "פעולה שנמשכה בנקודת זמן בעבר", en: "An action in progress at a past time", examples: ["What **were** you **doing** at nine last night?", "At noon we **were having** lunch."] },
        { he: "רקע לסיפור – מה קרה מסביב", en: "Background to a story", examples: ["The sun **was shining** and the birds **were singing**."] },
        { he: "כתיב ה-ing כמו בהווה מתמשך", en: "Same -ing spelling as the present progressive", examples: ["writ**ing**", "run**ning**", "ly**ing**"], chips: true },
        { he: "תשובות קצרות", en: "Short answers", examples: ["Yes, I **was**.", "No, they **weren't**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "was / were + verb-ing", example: "It was snowing all night." },
        { kind: "negative", pattern: "wasn't / weren't + verb-ing", example: "She wasn't working." },
        { kind: "question", pattern: "(Wh-) + was / were + subject + verb-ing?", example: "Where were you going?" },
        { kind: "short_answer", pattern: "Yes, … was / were. No, … wasn't / weren't.", example: "Yes, she was." },
      ],
      timeWords: ["at that time", "all day", "at midnight", "this time last week"],
    },
    3: {
      points: [
        { he: "פעולה ארוכה שנקטעה ע״י פעולה קצרה (when)", en: "A long action interrupted by a short one (when)", examples: ["I **was walking** home when it **started** to rain."] },
        { he: "שתי פעולות ארוכות במקביל (while)", en: "Two long actions at the same time (while)", examples: ["While I **was cooking**, Dad **was cleaning**."] },
        { he: "פעלי מצב – בלי ing גם בעבר", en: "State verbs – no -ing in the past either", examples: ["I **knew** the answer.", "✗ I was knowing the answer."] },
        { he: "שאלות עם מילת שאלה", en: "Wh- questions", examples: ["Why **were** you **laughing**?", "Who **was** she **talking** to?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "was / were + -ing (long) … when + past simple (short)", example: "We were eating when he called." },
        { kind: "affirmative", pattern: "While + was / were + -ing, … was / were + -ing", example: "While she was singing, he was dancing." },
      ],
      timeWords: ["when", "while", "as", "suddenly"],
    },
  },
  traps: [
    { id: "ppr-was-were", wrong: "They was playing.", right: "They were playing.", whyHe: "עם they / we / you – were.", whyEn: "they / we / you → were." },
    { id: "ppr-no-be", wrong: "I watching a movie at 8.", right: "I was watching a movie at 8.", whyHe: "חסר was / were לפני ה-ing.", whyEn: "You need was / were before -ing." },
    { id: "ppr-no-ing", wrong: "She was cook dinner.", right: "She was cooking dinner.", whyHe: "אחרי was / were הפועל עם ing.", whyEn: "After was / were → verb-ing." },
    { id: "ppr-state", wrong: "I was knowing the answer.", right: "I knew the answer.", whyHe: "know הוא פועל מצב – בלי ing.", whyEn: "know is a state verb – no -ing." },
    { id: "ppr-question", wrong: "You were sleeping?", right: "Were you sleeping?", whyHe: "בשאלה were עובר לפני הנושא.", whyEn: "In a question, were goes first." },
  ],
};

const T = "past-progressive";

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "ppr", 1, 7);
g7a.mcq("At 8 o'clock yesterday I ___ dinner.", ["was eating", "were eating", "eating"], "עם I – was + eating.", "I → was eating.", { trap: "ppr-no-be" });
g7a.mcq("The kids ___ in the river all afternoon.", ["were swimming", "was swimming", "swimming"], "The kids = they, ולכן were swimming.", "The kids = they → were swimming.", { trap: "ppr-was-were" });
g7a.mcq("At midnight my dad ___ home.", ["was driving", "were driving", "is driving"], "At midnight (אתמול) = עבר. Dad = he → was driving.", "At midnight → was driving.");
g7a.mcq("We ___ to music at that moment.", ["weren't listening", "wasn't listening", "didn't listening"], "we + שלילה → weren't listening.", "we, negative → weren't listening.");
g7a.mcq("___ you sleeping at ten last night?", ["Were", "Was", "Did"], "שאלה עם you: Were you…?", "Question with you: Were you…?", { trap: "ppr-question" });
g7a.bank("My sister ___ her hair at 7 this morning.", ["was brushing", "were brushing", "brushing"], "My sister = she, ולכן was brushing.", "My sister = she → was brushing.");
g7a.bank("The team ___ all morning.", ["was practicing", "were practice", "practicing"], "The team = it, ולכן was practicing.", "The team = it → was practicing.", { trap: "ppr-no-ing" });
g7a.bank("Grandpa ___ when we arrived. He was awake.", ["wasn't sleeping", "weren't sleeping", "didn't sleeping"], "Grandpa = he + שלילה → wasn't sleeping.", "he, negative → wasn't sleeping.", { allow: ["grandpa", "awake"] });
g7a.order("They were crossing the bridge at noon.", "מי + were + פועל-ing + מה + מתי.", "Who + were + verb-ing + what + when.");
g7a.order("Was she helping her mom?", "שאלה: Was + she + פועל-ing?", "Question: Was + she + verb-ing?", { trap: "ppr-question" });
g7a.sort(["was", "were"], [["I", "was"], ["my friends", "were"], ["the guide", "was"], ["we", "were"], ["the team", "was"], ["you", "were"]], "עם I / he / she / it – was, עם we / you / they – were.", "I / he / she / it → was. we / you / they → were.");
g7a.match([["At 6 o'clock Mom", "was cooking a meal."], ["At 7 o'clock the kids", "were doing their homework."], ["At 8 o'clock I", "was watching a movie."], ["At 9 o'clock we", "were sleeping."]], "was / were לפי הנושא + פועל-ing.", "was / were by subject + verb-ing.");

const g7b = itemSet(T, "ppr", 2, 7);
g7b.type("At noon the guide ___ about the history of the village.", "talk", "was talking", "the guide = he / she, ולכן was talking.", "the guide → was talking.");
g7b.type("We ___ across the river at that moment.", "swim", "were swimming", "עם we – were, ו-swim → swimming.", "we → were swimming.", { trap: "ppr-was-were" });
g7b.type("My dad ___ dinner at seven.", "make", "was making", "make → making (ה-e נופל).", "make → making.");
g7b.type("I ___ to the teacher. I was looking out of the window.", "not / listen", ["wasn't listening", "was not listening"], "I + שלילה → wasn't listening.", "I, negative → wasn't listening.", { allow: ["window"] });
g7b.mcq("What ___ you doing at eight last night?", ["were", "was", "did"], "שאלה עם you: What were you doing?", "What were you doing?");
g7b.fix("At five my friends *was playing in the park.", ["were"], "my friends = they, ולכן were.", "my friends = they → were.", { trap: "ppr-was-were" });
g7b.fix("Yesterday at noon I *eating a sandwich.", ["was eating"], "חסר was: I was eating.", "Missing was: I was eating.", { trap: "ppr-no-be", allow: ["sandwich"] });
g7b.fix("She was *drive to the village at nine.", ["driving"], "אחרי was – פועל עם ing: driving.", "After was → driving.", { trap: "ppr-no-ing" });
g7b.transform("They were traveling all day.", ...NEG, ["They weren't traveling all day.", "They were not traveling all day."], "שלילה: were + not = weren't.", "weren't traveling.");
g7b.transform("He was working in the office.", ...QUE, "Was he working in the office?", "בשאלה was עובר להתחלה.", "Was goes first.", { trap: "ppr-question" });
g7b.order("Where were you going at seven?", "מילת שאלה + were + you + פועל-ing?", "Wh- + were + you + verb-ing?");
g7b.cloze("Last night at nine", "Last night at nine everyone at home was busy. Mom {1} a book, and Dad {2} the kitchen. My brothers {3} a game. I {4} my homework, and the cat {5} on my bed.", [["read", "was reading"], ["clean", "was cleaning"], ["play", "were playing"], ["do", "was doing"], ["sleep", "was sleeping"]], "at nine = זמן מסוים בעבר → was / were + ing.", "At nine (past) → was / were + -ing.");

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "ppr", 1, 8);
g8a.mcq("At 8 o'clock yesterday I ___ online with my friends.", ["was chatting", "were chatting", "chatting"], "עם I – was + chatting.", "I → was chatting.", { trap: "ppr-no-be" });
g8a.mcq("The actors ___ on the stage all evening.", ["were performing", "was performing", "performing"], "The actors = they, ולכן were performing.", "The actors = they → were performing.", { trap: "ppr-was-were" });
g8a.mcq("At midnight the plane ___ over the sea.", ["was flying", "were flying", "is flying"], "At midnight (אתמול) = עבר. the plane = it → was flying.", "At midnight → was flying.");
g8a.mcq("We ___ attention in class.", ["weren't paying", "wasn't paying", "didn't paying"], "we + שלילה → weren't paying.", "we, negative → weren't paying.");
g8a.mcq("___ you recording the concert?", ["Were", "Was", "Did"], "שאלה עם you: Were you…?", "Question with you: Were you…?", { trap: "ppr-question" });
g8a.bank("My mom ___ the cake at 5 o'clock.", ["was decorating", "were decorating", "decorating"], "My mom = she, ולכן was decorating.", "My mom = she → was decorating.");
g8a.bank("The traffic ___ very slowly this morning.", ["was moving", "were move", "moving"], "The traffic = it, ולכן was moving.", "The traffic = it → was moving.", { trap: "ppr-no-ing" });
g8a.bank("The kids ___ well during the trip.", ["weren't behaving", "wasn't behaving", "didn't behaving"], "The kids = they + שלילה → weren't behaving.", "they, negative → weren't behaving.", { allow: ["trip"] });
g8a.order("They were waiting at the bus station at noon.", "מי + were + פועל-ing + איפה + מתי.", "Who + were + verb-ing + where + when.");
g8a.order("Was he cooking a traditional dish?", "שאלה: Was + he + פועל-ing?", "Question: Was + he + verb-ing?", { trap: "ppr-question" });
g8a.sort(["was", "were"], [["I", "was"], ["the actors", "were"], ["the chef", "was"], ["we", "were"], ["the factory", "was"], ["you", "were"]], "עם I / he / she / it – was, עם we / you / they – were.", "I / he / she / it → was. we / you / they → were.", { allow: ["chef"] });
g8a.match([["At 6 o'clock Dad", "was pouring the flour."], ["At 7 o'clock the guests", "were arriving."], ["At 8 o'clock I", "was decorating the table."], ["At 9 o'clock we", "were eating the cake."]], "was / were לפי הנושא + פועל-ing.", "was / were by subject + verb-ing.", { allow: ["guests", "arriving"] });

const g8b = itemSet(T, "ppr", 2, 8);
g8b.type("At ten the director ___ to the actors.", "talk", "was talking", "the director = he / she, ולכן was talking.", "the director → was talking.");
g8b.type("We ___ in the swimming pool all afternoon.", "swim", "were swimming", "עם we – were, ו-swim → swimming.", "we → were swimming.", { trap: "ppr-was-were" });
g8b.type("Dad ___ a cake for my birthday at that time.", "bake", "was baking", "bake → baking (ה-e נופל).", "bake → baking.", { allow: ["bake", "baking"] });
g8b.type("I ___ attention, so I missed the instructions.", "not / pay", ["wasn't paying", "was not paying"], "I + שלילה → wasn't paying.", "I, negative → wasn't paying.");
g8b.mcq("Who ___ you chatting with at midnight?", ["were", "was", "did"], "שאלה עם you: Who were you chatting with?", "Who were you chatting with?");
g8b.fix("At noon the tourists *was visiting the museum.", ["were"], "the tourists = they, ולכן were.", "the tourists = they → were.", { trap: "ppr-was-were", allow: ["tourists"] });
g8b.fix("Yesterday at six we *cooking dinner.", ["were cooking"], "חסר were: we were cooking.", "Missing were: we were cooking.", { trap: "ppr-no-be" });
g8b.fix("She was *download a movie at that moment.", ["downloading"], "אחרי was – פועל עם ing: downloading.", "After was → downloading.", { trap: "ppr-no-ing" });
g8b.transform("They were chatting during the lesson.", ...NEG, ["They weren't chatting during the lesson.", "They were not chatting during the lesson."], "שלילה: were + not = weren't.", "weren't chatting.");
g8b.transform("She was waiting at the airport.", ...QUE, "Was she waiting at the airport?", "בשאלה was עובר להתחלה.", "Was goes first.", { trap: "ppr-question" });
g8b.order("What were you doing at the café?", "מילת שאלה + were + you + פועל-ing?", "Wh- + were + you + verb-ing?");
g8b.cloze("A rainy evening", "It {1} all evening. Inside the café, two waiters {2} the tables and a man {3} the piano. Some teenagers {4} near the window, and I {5} for my friend.", [["rain", "was raining"], ["clean", "were cleaning"], ["play", "was playing"], ["chat", "were chatting"], ["wait", "was waiting"]], "רקע לסיפור בעבר → was / were + ing.", "Story background → was / were + -ing.", { allow: ["waiters", "piano", "window", "rainy", "rain"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "ppr", 1, 9);
g9a.mcq("At 8 o'clock yesterday I ___ a documentary.", ["was watching", "were watching", "watching"], "עם I – was + watching.", "I → was watching.", { trap: "ppr-no-be" });
g9a.mcq("The firefighters ___ the fire all night.", ["were fighting", "was fighting", "fighting"], "The firefighters = they, ולכן were fighting.", "The firefighters = they → were fighting.", { trap: "ppr-was-were" });
g9a.mcq("At midnight my neighbor ___ the drums.", ["was playing", "were playing", "is playing"], "At midnight (אתמול) = עבר. my neighbor = he / she → was playing.", "At midnight → was playing.");
g9a.mcq("We ___ the elevator. We took the stairs.", ["weren't using", "wasn't using", "didn't using"], "we + שלילה → weren't using.", "we, negative → weren't using.", { allow: ["stairs"] });
g9a.mcq("___ you binge-watching the series last night?", ["Were", "Was", "Did"], "שאלה עם you: Were you…?", "Question with you: Were you…?", { trap: "ppr-question" });
g9a.bank("My grandmother ___ a dress at 5 o'clock.", ["was sewing", "were sewing", "sewing"], "My grandmother = she, ולכן was sewing.", "My grandmother = she → was sewing.", { allow: ["dress"] });
g9a.bank("The oven ___ properly yesterday.", ["wasn't working", "weren't working", "didn't working"], "The oven = it + שלילה → wasn't working.", "it, negative → wasn't working.");
g9a.bank("The dolphins ___ next to the boat.", ["were swimming", "was swim", "swimming"], "The dolphins = they, ולכן were swimming.", "they → were swimming.", { trap: "ppr-no-ing" });
g9a.order("They were sailing to the island at sunrise.", "מי + were + פועל-ing + לאן + מתי.", "Who + were + verb-ing + where + when.");
g9a.order("Was she translating the article?", "שאלה: Was + she + פועל-ing?", "Question: Was + she + verb-ing?", { trap: "ppr-question" });
g9a.sort(["was", "were"], [["I", "was"], ["the firefighters", "were"], ["the architect", "was"], ["we", "were"], ["everyone", "was"], ["you", "were"]], "I / he / she / it (וגם everyone) → was. we / you / they → were.", "I / he / she / it (and everyone) → was. we / you / they → were.");
g9a.match([["At 6 o'clock Mom", "was wiping the table."], ["At 7 o'clock the guests", "were taking selfies."], ["At 8 o'clock I", "was giving a speech."], ["At 9 o'clock we", "were dancing."]], "was / were לפי הנושא + פועל-ing.", "was / were by subject + verb-ing.", { allow: ["guests", "dancing"] });

const g9b = itemSet(T, "ppr", 2, 9);
g9b.type("At ten the reporter ___ the firefighter.", "interview", "was interviewing", "the reporter = he / she, ולכן was interviewing.", "the reporter → was interviewing.", { allow: ["reporter"] });
g9b.type("We ___ in the sea when the sun came up.", "swim", "were swimming", "עם we – were, ו-swim → swimming.", "we → were swimming.", { trap: "ppr-was-were" });
g9b.type("My uncle ___ the old furniture all morning.", "repair", "was repairing", "my uncle = he, ולכן was repairing.", "my uncle → was repairing.");
g9b.type("I ___ my phone at the time, so I missed your call.", "not / use", ["wasn't using", "was not using"], "I + שלילה → wasn't using.", "I, negative → wasn't using.");
g9b.mcq("Why ___ the neighbors complaining last night?", ["were", "was", "did"], "שימו לב: the neighbors = they: Why were the neighbors complaining?", "Why were … complaining?");
g9b.fix("At noon the strangers *was standing outside our door.", ["were"], "the strangers = they, ולכן were.", "the strangers = they → were.", { trap: "ppr-was-were" });
g9b.fix("Yesterday at six I *translating a long article.", ["was translating"], "חסר was: I was translating.", "Missing was: I was translating.", { trap: "ppr-no-be" });
g9b.fix("She was *post selfies all evening.", ["posting"], "אחרי was – פועל עם ing: posting.", "After was → posting.", { trap: "ppr-no-ing" });
g9b.transform("They were complaining about the noise.", ...NEG, ["They weren't complaining about the noise.", "They were not complaining about the noise."], "שלילה: were + not = weren't.", "weren't complaining.");
g9b.transform("He was repairing the oven.", ...QUE, "Was he repairing the oven?", "בשאלה was עובר להתחלה.", "Was goes first.", { trap: "ppr-question" });
g9b.order("What were you binge-watching last night?", "מילת שאלה + were + you + פועל-ing?", "Wh- + were + you + verb-ing?");
g9b.cloze("The night of the fire", "It was midnight. The wind {1} hard, and smoke {2} from the building. The firefighters {3} the people out, and an officer {4} the street. We {5} from our window.", [["blow", "was blowing"], ["come", "was coming"], ["carry", "were carrying"], ["close", "was closing"], ["watch", "were watching"]], "רקע לסיפור בעבר → was / were + ing.", "Story background → was / were + -ing.", { allow: ["wind", "building", "window"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "ppr", 3);
l3.mcq("I ___ home when it started to rain.", ["was walking", "walked", "were walking"], "פעולה ארוכה שנקטעה → was walking.", "Long action interrupted → was walking.", { allow: ["rain"] });
l3.mcq("While I was cooking, my brother ___ the table.", ["was setting", "set", "sets"], "שתי פעולות ארוכות במקביל (while) → was setting.", "Two long actions (while) → was setting.");
l3.type("Who ___ to when I came in?", "you / talk", "were you talking", "שאלה: Who + were + you + talking?", "Who were you talking to?");
l3.type("I ___ the answer, but I was too shy to say it.", "know", "knew", "know הוא פועל מצב – עבר פשוט: knew.", "know is a state verb → knew.", { trap: "ppr-state" });
l3.fix("I *was knowing all the answers.", ["knew"], "know – פועל מצב, בלי ing.", "know is a state verb – no -ing.", { trap: "ppr-state" });
l3.fix("Why *you were laughing?", ["were you"], "בשאלה: Why + were + you…?", "Question order: Why were you…?", { trap: "ppr-question" });
l3.fix("The students *was working quietly when the bell rang.", ["were"], "The students = they, ולכן were.", "The students = they → were.", { trap: "ppr-was-were", allow: ["quietly", "bell"] });
l3.transform("She was talking to someone.", "Ask a question with 'Who'.", "שאלו שאלה עם Who", ["Who was she talking to?"], "המבנה: Who + was + she + talking to?", "Who was she talking to?");
l3.transform("We were sleeping at midnight.", ...NEG, ["We weren't sleeping at midnight.", "We were not sleeping at midnight."], "שלילה: weren't sleeping.", "weren't sleeping.");
l3.sort(["✓ Correct", "✗ Wrong"], [["It was raining all night.", "✓ Correct"], ["I was wanting a drink.", "✗ Wrong"], ["Were you listening?", "✓ Correct"], ["They was watching TV.", "✗ Wrong"], ["While he was driving, I was sleeping.", "✓ Correct"], ["She was cook dinner.", "✗ Wrong"]], "התיקונים: I wanted · They were watching · She was cooking.", "Fixes: I wanted · They were watching · She was cooking.", { allow: ["tv"] });
l3.cloze("A storm at sea", "The sun {1} and the passengers {2} the view. Suddenly the sky became dark. While the captain {3} on the radio, the sailors {4} the ropes. Nobody {5} about the danger anymore.", [["shine", "was shining"], ["enjoy", "were enjoying"], ["talk", "was talking"], ["pull", "were pulling"], ["think", "was thinking"]], "רקע ופעולות במקביל → was / were + ing.", "Background and parallel actions → was / were + -ing.", { allow: ["storm", "suddenly", "sailors", "ropes", "radio", "view", "sky"] });
l3.write("Describe what you and your family were doing at 8 o'clock yesterday evening.", "תארו מה אתם והמשפחה שלכם עשיתם אתמול בשעה 8 בערב.", "At 8 o'clock yesterday my mom was cooking, my dad was reading the news and I was talking to my friend on the phone.", "was / were + פועל-ing.", "was / were + verb-ing.");

export const pastProgressiveItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
