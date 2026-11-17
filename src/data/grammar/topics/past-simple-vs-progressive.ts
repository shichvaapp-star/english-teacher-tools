import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, QUE } from "@/data/grammar/build";

// Band II: VERBS: Past continuous – simultaneous / background uses (grades 8–9), with past simple.

export const pastSimpleVsProgressiveTopic: GrammarTopic = {
  id: "past-simple-vs-progressive",
  group: "tenses",
  title: "Past Simple vs Progressive (when / while)",
  titleHe: "עבר פשוט מול עבר מתמשך",
  bandRefs: ["VERBS: Past continuous", "VERBS: Past simple"],
  grades: { 8: "emerging", 9: "evolving" },
  rule: {
    1: {
      points: [
        { he: "פעולה ארוכה (היה באמצע) – עבר מתמשך", en: "Long action in progress – past progressive", examples: ["I **was watching** a movie…"] },
        { he: "פעולה קצרה שקטעה אותה – עבר פשוט", en: "Short action that interrupted it – past simple", examples: ["…when the phone **rang**."] },
        { he: "when + פעולה קצרה", en: "when + short action", examples: ["She **was cooking** when I **arrived**."] },
        { he: "while + פעולה ארוכה", en: "while + long action", examples: ["**While** we **were eating**, it **started** to rain."] },
      ],
      form: [
        { kind: "affirmative", pattern: "was / were + -ing … when + past simple", example: "I was sleeping when he called." },
        { kind: "affirmative", pattern: "While + was / were + -ing, … past simple", example: "While I was walking, I saw Dan." },
      ],
      timeWords: ["when", "while", "suddenly", "at that moment"],
    },
    2: {
      points: [
        { he: "רקע ארוך – מתמשך. אירוע קצר – פשוט", en: "Long background – progressive; short event – simple", examples: ["We **were playing** when the lights **went** out."] },
        { he: "שתי פעולות ארוכות במקביל – while + עבר מתמשך בשתיהן", en: "Two long actions together – while + progressive in both", examples: ["While Mom **was cooking**, Dad **was cleaning**."] },
        { he: "סדר אירועים קצרים – עבר פשוט בכולם", en: "A sequence of short events – past simple only", examples: ["He **opened** the door, **saw** us and **smiled**."] },
        { he: "אחרי when בדרך כלל עבר פשוט, אחרי while עבר מתמשך", en: "Usually: when + past simple, while + past progressive", examples: ["when it **started**", "while it **was raining**"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "past progressive + when + past simple", example: "It was raining when we left." },
        { kind: "affirmative", pattern: "While + past progressive, + past progressive / past simple", example: "While he was driving, he heard a noise." },
        { kind: "question", pattern: "What were you doing when …?", example: "What were you doing when I called?" },
      ],
      timeWords: ["when", "while", "as", "suddenly", "then"],
    },
    3: {
      points: [
        { he: "סיפור: רקע במתמשך, אירועים בפשוט", en: "Stories: background in progressive, events in simple", examples: ["The sun **was shining**. Suddenly a dog **ran** across the road."] },
        { he: "when יכול לבוא בהתחלה או באמצע", en: "when can start the sentence or come in the middle", examples: ["**When** he **called**, I **was sleeping**.", "I **was sleeping when** he **called**."] },
        { he: "שינוי משמעות: when I arrived, she left / was leaving", en: "Meaning changes with the tense", examples: ["When I arrived, she **left**. (after)", "When I arrived, she **was leaving**. (in the middle)"] },
        { he: "פעלי מצב – רק עבר פשוט", en: "State verbs – past simple only", examples: ["I **knew** he **was lying**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "When + past simple, past progressive", example: "When I woke up, it was snowing." },
        { kind: "affirmative", pattern: "When + past simple, past simple (one after the other)", example: "When he saw me, he waved." },
      ],
      timeWords: ["as soon as", "just as", "suddenly", "meanwhile"],
    },
  },
  traps: [
    { id: "spp-both-simple", wrong: "I watched TV when the phone rang.", right: "I was watching TV when the phone rang.", whyHe: "הפעולה הארוכה ברקע – עבר מתמשך.", whyEn: "The long background action → past progressive." },
    { id: "spp-short-prog", wrong: "I was cooking when he was arriving.", right: "I was cooking when he arrived.", whyHe: "הפעולה הקצרה שקטעה – עבר פשוט.", whyEn: "The short interrupting action → past simple." },
    { id: "spp-while-simple", wrong: "While I walked home, I saw Dan.", right: "While I was walking home, I saw Dan.", whyHe: "אחרי while – פעולה ארוכה: was walking.", whyEn: "After while → long action: was walking." },
    { id: "spp-was-were", wrong: "They was sleeping when I came.", right: "They were sleeping when I came.", whyHe: "עם they – were.", whyEn: "they → were." },
    { id: "spp-state", wrong: "I was knowing the answer when she asked.", right: "I knew the answer when she asked.", whyHe: "know – פועל מצב, עבר פשוט.", whyEn: "know is a state verb → past simple." },
  ],
};

const T = "past-simple-vs-progressive";
const B = ["long action (was / were + -ing)", "short action (past simple)"];

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "spp", 1, 8);
g8a.mcq("I ___ a movie when the phone rang.", ["was watching", "watched", "watch"], "הפעולה הארוכה ברקע → was watching.", "Long background action → was watching.", { trap: "spp-both-simple" });
g8a.mcq("We were eating dinner when Dad ___ home.", ["came", "was coming", "comes"], "הפעולה הקצרה שקטעה → came.", "Short interrupting action → came.", { trap: "spp-short-prog" });
g8a.mcq("While she ___ the cake, she burned her hand.", ["was decorating", "decorated", "decorates"], "אחרי while – פעולה ארוכה → was decorating.", "After while → was decorating.", { trap: "spp-while-simple", allow: ["burned"] });
g8a.mcq("The kids ___ in the pool when it started to rain.", ["were swimming", "was swimming", "swam"], "The kids = they, פעולה ארוכה → were swimming.", "they, long action → were swimming.", { trap: "spp-was-were", allow: ["rain"] });
g8a.mcq("The plane was landing when I ___ my mom.", ["called", "was calling", "call"], "פעולה קצרה → called.", "Short action → called.");
g8a.bank("I ___ my bike when I saw the accident.", ["was riding", "rode", "ride"], "פעולה ארוכה ברקע → was riding.", "Long action → was riding.", { allow: ["bike"] });
g8a.bank("We were waiting at the bus station when the bus ___ .", ["arrived", "was arriving", "arrives"], "פעולה קצרה → arrived.", "Short action → arrived.", { allow: ["arrived", "arriving", "arrives"] });
g8a.bank("___ I was cooking, my sister was chatting online.", ["While", "When", "During"], "שתי פעולות ארוכות במקביל → While.", "Two long actions → While.");
g8a.order("I was sleeping when the alarm rang.", "ארוכה (was sleeping) + when + קצרה (rang).", "long (was sleeping) + when + short (rang).", { allow: ["alarm"] });
g8a.order("While we were driving, we saw a fire.", "While + ארוכה, קצרה.", "While + long, short.");
g8a.sort(B, [["was cooking", "long action (was / were + -ing)"], ["arrived", "short action (past simple)"], ["were waiting", "long action (was / were + -ing)"], ["fell", "short action (past simple)"], ["was raining", "long action (was / were + -ing)"], ["broke", "short action (past simple)"]], "was / were + ing = פעולה ארוכה. עבר פשוט = פעולה קצרה.", "was / were + -ing = long. Past simple = short.");
g8a.match([["I was walking home", "when I met an old friend."], ["The actors were performing", "when the lights went out."], ["While Dad was cooking,", "Mom was decorating the table."], ["We were chatting online", "when my laptop stopped working."]], "ארוכה + when + קצרה; while + שתי ארוכות.", "long + when + short; while + two long actions.", { allow: ["lights", "laptop"] });

const g8b = itemSet(T, "spp", 2, 8);
g8b.type("I ___ to music when my dad came in.", "listen", "was listening", "פעולה ארוכה ברקע → was listening.", "Long action → was listening.", { trap: "spp-both-simple" });
g8b.type("We were sitting in a café when it ___ to rain.", "start", "started", "פעולה קצרה → started.", "Short action → started.", { trap: "spp-short-prog", allow: ["rain"] });
g8b.type("While the teacher ___, the students were taking notes.", "talk", "was talking", "אחרי while – פעולה ארוכה → was talking.", "After while → was talking.", { trap: "spp-while-simple" });
g8b.type("The car ___ when we were driving to the airport.", "break down", "broke down", "פעולה קצרה שקטעה → broke down.", "Short interrupting action → broke down.");
g8b.mcq("What ___ you doing when the accident happened?", ["were", "did", "was"], "What were you doing when…? – מה עשית באמצע.", "What were you doing when…?");
g8b.fix("I *watched the news when the lights went out.", ["was watching"], "פעולה ארוכה ברקע → was watching.", "Long background action → was watching.", { trap: "spp-both-simple", allow: ["lights"] });
g8b.mcq("She was taking a shower when the phone ___ .", ["rang", "was ringing", "rings"], "פעולה קצרה שקטעה → rang.", "Short interrupting action → rang.", { trap: "spp-short-prog", allow: ["shower"] });
g8b.fix("While I *cooked dinner, I cut my finger.", ["was cooking"], "אחרי while → was cooking.", "After while → was cooking.", { trap: "spp-while-simple" });
g8b.transform("They were playing football when it started to rain.", ...QUE, "Were they playing football when it started to rain?", "שאלה: Were + they + playing…?", "Were they playing…?", { allow: ["rain"] });
g8b.transform("I was reading. My brother came in.", "Join with 'when'.", "חברו עם when", ["I was reading when my brother came in.", "When my brother came in, I was reading."], "ארוכה + when + קצרה.", "long + when + short.");
g8b.order("What were you doing when I called?", "What + were + you + doing + when + עבר פשוט?", "What were you doing when + past simple?");
g8b.cloze("A strange evening", "We {1} dinner when the lights {2} out. While Dad {3} for a flashlight, my little brother {4} to cry. Then the lights {5} on again.", [["eat", "were eating"], ["go", "went"], ["look", "was looking"], ["start", "started"], ["come", "came"]], "רקע ארוך → were eating / was looking. אירועים קצרים → went, started, came.", "Long → were eating, was looking. Short → went, started, came.", { allow: ["lights", "flashlight", "cry"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "spp", 1, 9);
g9a.mcq("I ___ a documentary when the doorbell rang.", ["was watching", "watched", "watch"], "הפעולה הארוכה ברקע → was watching.", "Long background action → was watching.", { trap: "spp-both-simple", allow: ["doorbell"] });
g9a.mcq("We were taking selfies when a stranger ___ us.", ["stopped", "was stopping", "stops"], "הפעולה הקצרה שקטעה → stopped.", "Short interrupting action → stopped.", { trap: "spp-short-prog" });
g9a.mcq("While he ___ the oven, he found an old key.", ["was cleaning", "cleaned", "cleans"], "אחרי while – פעולה ארוכה → was cleaning.", "After while → was cleaning.", { trap: "spp-while-simple" });
g9a.mcq("The firefighters ___ lunch when the alarm went off.", ["were eating", "was eating", "ate"], "The firefighters = they, פעולה ארוכה → were eating.", "they, long action → were eating.", { trap: "spp-was-were", allow: ["alarm"] });
g9a.mcq("The elevator was going up when it suddenly ___ .", ["stopped", "was stopping", "stops"], "פעולה קצרה (suddenly) → stopped.", "Short action (suddenly) → stopped.", { allow: ["suddenly"] });
g9a.bank("I ___ an article when my laptop crashed.", ["was translating", "translated", "translate"], "פעולה ארוכה ברקע → was translating.", "Long action → was translating.", { allow: ["laptop", "crashed"] });
g9a.bank("We were sailing to the island when we ___ dolphins.", ["saw", "were seeing", "see"], "פעולה קצרה → saw.", "Short action → saw.");
g9a.bank("___ Mom was repairing the sink, Dad was wiping the floor.", ["While", "When", "During"], "שתי פעולות ארוכות במקביל → While.", "Two long actions → While.", { allow: ["floor"] });
g9a.order("She was posting a tweet when her phone died.", "ארוכה + when + קצרה.", "long + when + short.", { allow: ["died"] });
g9a.order("While we were waiting, it started to snow.", "While + ארוכה, קצרה.", "While + long, short.", { allow: ["snow"] });
g9a.sort(B, [["was sewing", "long action (was / were + -ing)"], ["fell", "short action (past simple)"], ["were sailing", "long action (was / were + -ing)"], ["knocked", "short action (past simple)"], ["was snowing", "long action (was / were + -ing)"], ["crashed", "short action (past simple)"]], "was / were + ing = פעולה ארוכה. עבר פשוט = פעולה קצרה.", "was / were + -ing = long. Past simple = short.", { allow: ["snowing", "crashed"] });
g9a.match([["I was walking to the stadium", "when I met my colleague."], ["The guests were dancing", "when the music stopped."], ["While Grandma was sewing,", "Grandpa was reading a novel."], ["We were binge-watching a series", "when the internet went down."]], "ארוכה + when + קצרה; while + שתי ארוכות.", "long + when + short; while + two long actions.", { allow: ["guests", "dancing", "grandma", "grandpa"] });

const g9b = itemSet(T, "spp", 2, 9);
g9b.type("I ___ in the garden when the storm began.", "work", "was working", "פעולה ארוכה ברקע → was working.", "Long action → was working.", { trap: "spp-both-simple", allow: ["storm"] });
g9b.type("We were having dinner when the neighbors ___ on the door.", "knock", "knocked", "פעולה קצרה → knocked.", "Short action → knocked.", { trap: "spp-short-prog" });
g9b.type("While the reporter ___ the firefighter, a fire truck arrived.", "interview", "was interviewing", "אחרי while – פעולה ארוכה → was interviewing.", "After while → was interviewing.", { trap: "spp-while-simple", allow: ["reporter", "truck", "arrived"] });
g9b.type("She ___ off the ladder while she was painting the wall.", "fall", "fell", "פעולה קצרה → fell.", "Short action → fell.", { allow: ["wall"] });
g9b.mcq("What ___ you doing when the elevator stopped?", ["were", "did", "was"], "What were you doing when…? – מה עשית באמצע.", "What were you doing when…?");
g9b.fix("I *binge-watched a series when my parents came home.", ["was binge-watching"], "פעולה ארוכה ברקע → was binge-watching.", "Long background action → was binge-watching.", { trap: "spp-both-simple" });
g9b.mcq("He was repairing the oven when he ___ his hand.", ["cut", "was cutting", "cuts"], "פעולה קצרה שקטעה → cut.", "Short interrupting action → cut.", { trap: "spp-short-prog" });
g9b.fix("While she *translated the article, the power went out.", ["was translating"], "אחרי while → was translating.", "After while → was translating.", { trap: "spp-while-simple", allow: ["power"] });
g9b.transform("They were sailing when the storm started.", ...QUE, "Were they sailing when the storm started?", "שאלה: Were + they + sailing…?", "Were they sailing…?", { allow: ["storm"] });
g9b.transform("We were jogging in the park. We saw a famous actor.", "Join with 'while'.", "חברו עם while", ["While we were jogging in the park, we saw a famous actor.", "We saw a famous actor while we were jogging in the park."], "while + ארוכה, קצרה.", "while + long, short.", { allow: ["jogging", "famous"] });
g9b.order("What were you doing when the fire started?", "What + were + you + doing + when + עבר פשוט?", "What were you doing when + past simple?");
g9b.cloze("The marathon", "Thousands of runners {1} through the city. While I {2} past the stadium, I {3} my shoe. I {4} to fix it when another runner {5} into me!", [["run", "were running"], ["run", "was running"], ["lose", "lost"], ["try", "was trying"], ["crash", "crashed"]], "רקע ארוך → were running / was running / was trying. אירועים קצרים → lost, crashed.", "Long → were / was running, was trying. Short → lost, crashed.", { allow: ["thousands", "runners", "runner", "shoe", "crash", "crashed"] });

// ───────────── Level 3 (grades 8–9) ─────────────
const l3 = itemSet(T, "spp", 3);
l3.mcq("When I arrived at the party, Dan ___ – I said goodbye at the door.", ["was leaving", "left", "leaves"], "באמצע לצאת כשהגעתי → was leaving.", "In the middle of leaving → was leaving.", { allow: ["arrived"] });
l3.mcq("When she saw the spider, she ___ .", ["screamed", "was screaming", "screams"], "אחת אחרי השנייה (ראתה ← צעקה) → screamed.", "One after the other → screamed.", { allow: ["spider", "screamed", "screaming", "screams"] });
l3.type("I ___ that he was lying.", "know", "knew", "know – פועל מצב → knew.", "know is a state verb → knew.", { trap: "spp-state" });
l3.type("Just as we ___ the house, it started to pour.", "leave", "were leaving", "באמצע לצאת (just as) → were leaving.", "In the middle of leaving → were leaving.", { allow: ["pour"] });
l3.fix("When the teacher came in, the students *talked loudly.", ["were talking"], "רקע ארוך → were talking.", "Background → were talking.", { trap: "spp-both-simple" });
l3.mcq("I ___ the answer, so I raised my hand.", ["knew", "was knowing", "know"], "know – פועל מצב, עבר פשוט: knew.", "know is a state verb → knew.", { trap: "spp-state", allow: ["raised"] });
l3.fix("While he *drove to work, he listened to the news.", ["was driving"], "אחרי while → was driving.", "After while → was driving.", { trap: "spp-while-simple" });
l3.transform("He was cooking. The fire alarm went off.", "Join with 'when'.", "חברו עם when", ["He was cooking when the fire alarm went off.", "When the fire alarm went off, he was cooking."], "ארוכה + when + קצרה.", "long + when + short.", { allow: ["alarm"] });
l3.transform("I saw the accident.", "Ask what the person was doing (What … when …?).", "שאלו מה האדם עשה כשזה קרה", ["What were you doing when you saw the accident?"], "שאלה: What were you doing when…?", "What were you doing when…?");
l3.sort(["✓ Correct", "✗ Wrong"], [["I was sleeping when he called.", "✓ Correct"], ["While I walked home, it rained.", "✗ Wrong"], ["When he saw me, he waved.", "✓ Correct"], ["I was knowing the way.", "✗ Wrong"], ["They were eating when we arrived.", "✓ Correct"], ["She was cooking when I was arriving.", "✗ Wrong"]], "התיקונים: While I was walking · I knew · when I arrived.", "Fixes: While I was walking · I knew · when I arrived.", { allow: ["waved", "arrived", "arriving"] });
l3.cloze("A night to remember", "It {1} heavily. My parents {2} TV and I {3} for a test. Suddenly we {4} a loud noise. When Dad {5} the door, a wet cat {6} in!", [["rain", "was raining"], ["watch", "were watching"], ["study", "was studying"], ["hear", "heard"], ["open", "opened"], ["run", "ran"]], "רקע → was / were + ing. אירועים → heard, opened, ran.", "Background → progressive. Events → heard, opened, ran.", { allow: ["heavily", "tv", "suddenly", "wet", "remember"] });
l3.write("Tell a short story: describe the background (what was happening) and then something that suddenly happened.", "ספרו סיפור קצר: תארו את הרקע (מה קרה באותו זמן) ואז משהו שקרה פתאום.", "It was a quiet evening. My brother was playing a game and I was reading. Suddenly the lights went out and we heard a strange noise.", "רקע במתמשך, אירועים בפשוט.", "Background in progressive, events in simple.");

export const pastSimpleVsProgressiveItems: GrammarItem[] = [
  ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
