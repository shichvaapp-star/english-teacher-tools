import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: CLAUSES: Subordinated – showing the order of regular and past events (when / before / after / until).

export const timeClausesTopic: GrammarTopic = {
  id: "time-clauses",
  group: "clauses",
  title: "when / before / after / until",
  titleHe: "משפטי זמן – when, before, after",
  bandRefs: ["CLAUSES: Subordinated"],
  grades: { 7: "evolving", 8: "evolving", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "when = כאשר", en: "when = at the time that", examples: ["**When** I get home, I eat.", "I was happy **when** I won."] },
        { he: "before = לפני, after = אחרי", en: "before / after show order", examples: ["I brush my teeth **before** I sleep.", "**After** school, I play football."] },
        { he: "until = עד ש…", en: "until = up to the time that", examples: ["Wait here **until** I come back."] },
        { he: "פסיק כשמשפט הזמן בא קודם", en: "Comma when the time clause comes first", examples: ["**When** it rains, I stay home.", "I stay home **when** it rains."] },
      ],
      form: [
        { kind: "affirmative", pattern: "When / Before / After + clause, main clause", example: "Before I eat, I wash my hands." },
        { kind: "affirmative", pattern: "main clause + when / before / after / until + clause", example: "I read until I fall asleep." },
      ],
      timeWords: ["when", "before", "after", "until", "while"],
    },
    2: {
      points: [
        { he: "סדר אירועים בעבר", en: "Order of past events", examples: ["**After** we ate, we watched a movie.", "She left **before** I arrived."] },
        { he: "על העתיד: אחרי when / before / after – הווה, לא will", en: "Future: present tense after when / before / after", examples: ["**When** I **finish**, I'll call you.", "✗ When I will finish"] },
        { he: "before / after + פועל עם ing", en: "before / after + -ing", examples: ["**Before leaving**, close the window.", "**After eating**, we rested."] },
        { he: "as soon as = מיד כש…", en: "as soon as = immediately when", examples: ["Call me **as soon as** you land."] },
      ],
      form: [
        { kind: "affirmative", pattern: "When + present, … will + verb (future)", example: "When she arrives, we'll start." },
        { kind: "affirmative", pattern: "before / after + verb-ing", example: "After finishing, he left." },
      ],
      timeWords: ["as soon as", "by the time", "once", "then"],
    },
    3: {
      points: [
        { he: "until = עד ש…, by the time = עד שכבר…", en: "until / by the time", examples: ["I'll wait **until** you're ready.", "**By the time** we arrived, the film had started."] },
        { he: "while + פעולה ארוכה", en: "while + long action", examples: ["**While** I was cooking, the phone rang."] },
        { he: "once = ברגע ש…", en: "once = as soon as", examples: ["**Once** you finish, you can go."] },
        { he: "since (מאז) בזמנים מושלמים", en: "since with perfect tenses", examples: ["I've lived here **since** I was born."] },
      ],
      form: [
        { kind: "affirmative", pattern: "By the time + past, past perfect", example: "By the time I got there, she had left." },
        { kind: "affirmative", pattern: "present perfect + since + past simple", example: "He has changed since he moved." },
      ],
      timeWords: ["by the time", "once", "since", "as long as"],
    },
  },
  traps: [
    { id: "tc-will", wrong: "When I will get home, I'll call you.", right: "When I get home, I'll call you.", whyHe: "אחרי when על העתיד – הווה פשוט, לא will.", whyEn: "After when (future) → present simple." },
    { id: "tc-order", wrong: "I eat dinner before I come home.", right: "I eat dinner after I come home.", whyHe: "בדקו את הסדר: קודם מגיעים הביתה, אחר כך אוכלים → after.", whyEn: "Check the order of events." },
    { id: "tc-to", wrong: "Before to leave, close the door.", right: "Before leaving, close the door.", whyHe: "before / after + ing (לא to).", whyEn: "before / after + -ing." },
    { id: "tc-until", wrong: "Wait here until I will come back.", right: "Wait here until I come back.", whyHe: "אחרי until על העתיד – הווה פשוט.", whyEn: "After until (future) → present." },
  ],
};

const T = "time-clauses";
const B = ["before", "after"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "tc", 1, 7);
g7a.mcq("I brush my teeth ___ I go to bed.", ["before", "after", "until"], "קודם מצחצחים, אחר כך הולכים לישון → before.", "First brush, then sleep → before.", { trap: "tc-order" });
g7a.mcq("___ school, I play football with my team.", ["After", "Before", "Until"], "קודם בית ספר, אחר כך כדורגל → After.", "School first → After.");
g7a.mcq("___ it rains, we stay inside.", ["When", "Until", "Before"], "כאשר יורד גשם → When.", "At the time it rains → When.", { allow: ["rains", "inside"] });
g7a.mcq("Wait here ___ I come back.", ["until", "after", "when"], "עד ש… → until.", "Up to the time → until.");
g7a.mcq("When I ___ home, I'll call you.", ["get", "will get", "got"], "אחרי when על העתיד – הווה פשוט: get.", "After when (future) → present: get.", { trap: "tc-will" });
g7a.bank("I always wash my hands ___ I eat a meal.", ["before", "after", "until"], "קודם שוטפים ידיים → before.", "First wash → before.");
g7a.bank("We went home ___ the activity finished.", ["after", "before", "until"], "קודם הפעילות נגמרה, אחר כך הלכנו → after.", "Activity ended first → after.");
g7a.bank("I was very happy ___ my team won.", ["when", "until", "before"], "כאשר ניצחנו → when.", "At the time → when.");
g7a.order("When I get home, I eat a meal.", "When + משפט, משפט ראשי.", "When + clause, main clause.");
g7a.order("We stayed at the river until it got dark.", "משפט ראשי + until + משפט.", "main clause + until + clause.");
g7a.sort(B, [["I eat … I go to school.", "before"], ["I rest … I finish my homework.", "after"], ["Put on your shoes … you go out.", "before"], ["We clean the table … we eat.", "after"], ["Look both ways … you cross the road.", "before"], ["I sleep well … I swim.", "after"]], "קודם → before. אחר כך → after.", "First → before. Then → after.", { allow: ["shoes", "ways", "road"] });
g7a.match([["When it's hot,", "we swim in the river."], ["Before I sleep,", "I read a book."], ["After the meal,", "we washed the bowls."], ["Wait for me", "until I finish my homework."]], "when / before / after / until מראים מתי.", "when / before / after / until show time.");

const g7b = itemSet(T, "tc", 2, 7);
g7b.type("___ I finish my homework, I'll call you.", "when / will", "When", "When + הווה, will בחלק השני.", "When + present, will in the main clause.", { trap: "tc-will" });
g7b.type("When the guide ___, we'll start the journey.", "come", "comes", "אחרי when על העתיד – הווה פשוט: comes.", "After when (future) → comes.", { trap: "tc-will" });
g7b.type("Wait at the bridge until I ___.", "arrive", "arrive", "אחרי until על העתיד – הווה פשוט.", "After until (future) → present.", { trap: "tc-until", allow: ["arrive"] });
g7b.type("___ eating, we went for a walk.", "after / before", "After", "המבנה: after + ing: After eating.", "After + -ing.", { allow: ["walk"] });
g7b.mcq("Close the windows ___ you leave the house.", ["before", "after", "until"], "קודם סוגרים, אחר כך יוצאים → before.", "First close → before.", { allow: ["windows"] });
g7b.mcq("When I ___ her, I'll tell her the news.", ["see", "will see", "saw"], "אחרי when על העתיד – הווה: see.", "After when (future) → see.", { trap: "tc-will", allow: ["news"] });
g7b.fix("I always eat breakfast *after I go to school.", ["before"], "קודם אוכלים, אחר כך הולכים לבית ספר → before.", "Eat first → before.", { trap: "tc-order" });
g7b.mcq("Wait here until the bus ___.", ["comes", "will come", "came"], "אחרי until – הווה: comes.", "After until → comes.", { trap: "tc-until" });
g7b.transform("I finish school. Then I go to the club.", "Join with 'After'.", "חברו עם After", ["After I finish school, I go to the club.", "I go to the club after I finish school."], "After + האירוע הראשון, האירוע השני.", "After + first event, second event.");
g7b.transform("Wash your hands. Then eat.", "Join with 'before'.", "חברו עם before", ["Wash your hands before you eat.", "Before you eat, wash your hands."], "before + האירוע השני.", "before + second event.");
g7b.order("As soon as I land, I will call my mom.", "As soon as + הווה, will + פועל.", "As soon as + present, will + verb.", { allow: ["land"] });
g7b.cloze("A school day", "{1} I wake up, I wash my face. I eat breakfast {2} I leave the house. {3} school, I go to the club. I stay there {4} it gets dark. When I {5} home, I'll do my homework.", [["when", "When"], ["before", "before"], ["after", "After"], ["until", "until"], ["get", "get"]], "When / before / after / until. אחרי when על העתיד – הווה: get.", "When / before / after / until; present after when.");

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "tc", 1, 8);
g8a.mcq("I check my phone ___ I go to sleep.", ["before", "after", "until"], "קודם בודקים, אחר כך ישנים → before.", "Check first → before.", { trap: "tc-order" });
g8a.mcq("___ the concert, we went to a café.", ["After", "Before", "Until"], "קודם הקונצרט, אחר כך בית קפה → After.", "Concert first → After.");
g8a.mcq("___ I'm bored, I play the drums.", ["When", "Until", "Before"], "כאשר משעמם לי → When.", "At the time → When.", { allow: ["bored"] });
g8a.mcq("We waited at the airport ___ the plane landed.", ["until", "after", "when"], "עד ש… → until.", "Up to the time → until.");
g8a.mcq("When the movie ___, we'll get pizza.", ["ends", "will end", "ended"], "אחרי when על העתיד – הווה פשוט: ends.", "After when (future) → ends.", { trap: "tc-will", allow: ["pizza"] });
g8a.bank("Read the instructions ___ you start cooking.", ["before", "after", "until"], "קודם קוראים → before.", "Read first → before.");
g8a.bank("We cleaned the kitchen ___ the guests left.", ["after", "before", "until"], "קודם האורחים הלכו → after.", "Guests left first → after.", { allow: ["guests"] });
g8a.bank("I was so excited ___ I got the tickets.", ["when", "until", "before"], "כאשר קיבלתי → when.", "At the time → when.", { allow: ["excited"] });
g8a.order("When I travel abroad, I take a lot of photos.", "When + משפט, משפט ראשי.", "When + clause, main clause.");
g8a.order("The actors practiced until they were perfect.", "משפט ראשי + until + משפט.", "main clause + until + clause.");
g8a.sort(B, [["I read the menu … I order.", "before"], ["I relax … the concert ends.", "after"], ["Check the door … you leave.", "before"], ["We dance … we eat dinner.", "after"], ["Buy tickets … you get on the train.", "before"], ["I feel great … I exercise.", "after"]], "קודם → before. אחר כך → after.", "First → before. Then → after.", { allow: ["menu", "order", "dance"] });
g8a.match([["When I'm hungry,", "I cook pasta."], ["Before the flight,", "we checked in online."], ["After the show,", "we met the actors."], ["We'll stay at the café", "until it closes."]], "when / before / after / until מראים מתי.", "when / before / after / until show time.", { allow: ["pasta", "show"] });

const g8b = itemSet(T, "tc", 2, 8);
g8b.type("___ I land, I'll send you a message.", "as soon as / will", "As soon as", "מיד כש… → As soon as + הווה.", "As soon as + present.", { trap: "tc-will" });
g8b.type("When my parents ___ home, we'll decorate the cake.", "come", "come", "אחרי when על העתיד – הווה פשוט.", "After when (future) → present.", { trap: "tc-will" });
g8b.type("Don't start the movie until I ___ back.", "be", ["am", "'m", "get"], "אחרי until על העתיד – הווה: I'm back.", "After until → present.", { trap: "tc-until" });
g8b.type("___ leaving the café, she paid the bill.", "before / after", "Before", "המבנה: before + ing: Before leaving.", "Before + -ing.", { allow: ["bill"] });
g8b.mcq("Turn off your phone ___ the concert starts.", ["before", "after", "until"], "קודם מכבים → before.", "Turn off first → before.", { allow: ["turn"] });
g8b.mcq("As soon as the plane ___, I'll call you.", ["lands", "will land", "landed"], "אחרי as soon as על העתיד – הווה: lands.", "After as soon as → lands.", { trap: "tc-will" });
g8b.fix("I always do my homework *after I watch TV, so I'm free later.", ["before"], "כדי להיות פנוי אחר כך – עושים קודם → before.", "Do it first → before.", { trap: "tc-order", allow: ["tv"] });
g8b.mcq("We'll wait here until the rain ___.", ["stops", "will stop", "stopped"], "אחרי until – הווה: stops.", "After until → stops.", { trap: "tc-until", allow: ["rain"] });
g8b.transform("We bought the tickets. Then we went to the concert.", "Join with 'After'.", "חברו עם After", ["After we bought the tickets, we went to the concert.", "We went to the concert after we bought the tickets."], "After + האירוע הראשון.", "After + first event.");
g8b.transform("Read the recipe. Then start cooking.", "Join with 'before'.", "חברו עם before", ["Read the recipe before you start cooking.", "Before you start cooking, read the recipe."], "before + האירוע השני.", "before + second event.", { allow: ["recipe"] });
g8b.order("Before leaving, she turned off the lights.", "Before + ing, משפט ראשי.", "Before + -ing, main clause.", { allow: ["lights", "turned"] });
g8b.cloze("Travel plans", "{1} we arrive at the airport, we'll check in. We'll have lunch {2} we get on the plane. {3} the plane lands, I'll call my grandma. We won't leave the airport {4} we find our bags.", [["when", "When"], ["before", "before"], ["as soon as", "As soon as"], ["until", "until"]], "When / before / As soon as / until – אחריהם הווה.", "When / before / As soon as / until + present.", { allow: ["grandma"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "tc", 1, 9);
g9a.mcq("I take off my shoes ___ I enter the apartment.", ["before", "after", "until"], "קודם מורידים נעליים → before.", "Shoes off first → before.", { trap: "tc-order", allow: ["shoes", "enter"] });
g9a.mcq("___ the wedding, everyone went to the beach.", ["After", "Before", "Until"], "קודם החתונה → After.", "Wedding first → After.", { allow: ["beach"] });
g9a.mcq("___ I'm stressed, I listen to music.", ["When", "Until", "Before"], "כאשר אני לחוץ → When.", "At the time → When.", { allow: ["stressed"] });
g9a.mcq("The firefighters worked ___ the fire was out.", ["until", "after", "when"], "עד ש… → until.", "Up to the time → until.");
g9a.mcq("When the elevator ___, we'll go up.", ["comes", "will come", "came"], "אחרי when על העתיד – הווה פשוט: comes.", "After when (future) → comes.", { trap: "tc-will" });
g9a.bank("Read the article ___ you post it.", ["before", "after", "until"], "קודם קוראים → before.", "Read first → before.");
g9a.bank("We repaired the oven ___ the guests left.", ["after", "before", "until"], "קודם האורחים הלכו → after.", "Guests left first → after.", { allow: ["guests"] });
g9a.bank("She was very proud ___ she finished the marathon.", ["when", "until", "before"], "כאשר סיימה → when.", "At the time → when.");
g9a.order("When I travel, I always take selfies.", "When + משפט, משפט ראשי.", "When + clause, main clause.");
g9a.order("We binge-watched the series until we fell asleep.", "משפט ראשי + until + משפט.", "main clause + until + clause.", { allow: ["asleep"] });
g9a.sort(B, [["I read reviews … I buy a novel.", "before"], ["I relax … the interview ends.", "after"], ["Check the stove … you leave.", "before"], ["We clean … the party ends.", "after"], ["Look at the map … you start the trip.", "before"], ["I feel calm … I sail.", "after"]], "קודם → before. אחר כך → after.", "First → before. Then → after.", { allow: ["reviews", "stove", "map", "trip", "calm"] });
g9a.match([["When I'm bored,", "I read a novel."], ["Before the interview,", "I prepared my answers."], ["After the fire,", "the firefighters checked the building."], ["We'll sail", "until the sun goes down."]], "when / before / after / until מראים מתי.", "when / before / after / until show time.", { allow: ["bored", "prepared", "building"] });

const g9b = itemSet(T, "tc", 2, 9);
g9b.type("___ the gallery opens, we'll go in.", "as soon as / will", "As soon as", "מיד כש… → As soon as + הווה.", "As soon as + present.", { trap: "tc-will" });
g9b.type("When the firefighter ___, we'll interview her.", "arrive", "arrives", "אחרי when על העתיד – הווה פשוט: arrives.", "After when (future) → arrives.", { trap: "tc-will", allow: ["arrive", "arrives"] });
g9b.type("Don't post the photos until the bride ___ them.", "see", "sees", "אחרי until על העתיד – הווה: sees.", "After until → sees.", { trap: "tc-until", allow: ["bride"] });
g9b.type("___ finishing the marathon, he drank a lot of water.", "before / after", "After", "המבנה: after + ing: After finishing.", "After + -ing.");
g9b.mcq("Switch off the oven ___ you leave the kitchen.", ["before", "after", "until"], "קודם מכבים → before.", "Switch off first → before.");
g9b.mcq("When the novel ___ out, I'll buy it.", ["comes", "will come", "came"], "אחרי when על העתיד – הווה: comes.", "After when (future) → comes.", { trap: "tc-will" });
g9b.fix("I always read the reviews *after I buy something, so I don't waste money.", ["before"], "כדי לא לבזבז – קוראים קודם → before.", "Read first → before.", { trap: "tc-order", allow: ["reviews"] });
g9b.mcq("We'll stay in the shelter until the storm ___.", ["passes", "will pass", "passed"], "אחרי until – הווה: passes.", "After until → passes.", { trap: "tc-until", allow: ["shelter", "storm"] });
g9b.transform("I updated my apps. Then I restarted my phone.", "Join with 'After'.", "חברו עם After", ["After I updated my apps, I restarted my phone.", "I restarted my phone after I updated my apps."], "After + האירוע הראשון.", "After + first event.", { allow: ["restarted"] });
g9b.transform("Check the ladder. Then climb it.", "Join with 'before'.", "חברו עם before", ["Check the ladder before you climb it.", "Before you climb it, check the ladder.", "Before you climb the ladder, check it."], "before + האירוע השני.", "before + second event.", { allow: ["climb"] });
g9b.order("After interviewing the firefighter, she wrote an article.", "After + ing, משפט ראשי.", "After + -ing, main clause.");
g9b.cloze("Moving day", "{1} the truck arrives, we'll load the furniture. We'll clean the old apartment {2} we leave. {3} we get to the new place, I'll set up my room. I won't sleep {4} everything is ready!", [["when", "When"], ["before", "before"], ["as soon as", "As soon as"], ["until", "until"]], "When / before / As soon as / until – אחריהם הווה.", "When / before / As soon as / until + present.", { allow: ["truck", "load", "place"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "tc", 3);
l3.mcq("By the time we arrived, the movie ___.", ["had started", "starts", "will start"], "By the time + עבר → past perfect: had started.", "By the time + past → had started.", { allow: ["arrived"] });
l3.mcq("I've lived here ___ I was born.", ["since", "until", "when"], "מאז ש… עם הווה מושלם → since.", "since + present perfect.", { allow: ["born"] });
l3.type("___ you finish, you can go home.", "once", "Once", "ברגע ש… → Once.", "Once = as soon as.");
l3.type("While I ___ dinner, the phone rang.", "cook", "was cooking", "while + פעולה ארוכה → was cooking.", "while + long action → was cooking.");
l3.mcq("Before ___, please close the door.", ["leaving", "to leave", "leave"], "המבנה: before + ing: Before leaving.", "before + -ing.", { trap: "tc-to" });
l3.mcq("I'll wait until you ___ ready.", ["are", "will be", "were"], "אחרי until על העתיד – הווה: are.", "After until → are.", { trap: "tc-until" });
l3.mcq("Once you ___ the results, tell me.", ["get", "will get", "got"], "אחרי once על העתיד – הווה: get.", "After once → get.", { trap: "tc-will", allow: ["results"] });
l3.transform("I'll call you. I'll get home first.", "Join with 'as soon as'.", "חברו עם as soon as", ["I'll call you as soon as I get home.", "As soon as I get home, I'll call you."], "as soon as + הווה.", "as soon as + present.");
l3.transform("He moved to Haifa. He has changed a lot.", "Join with 'since'.", "חברו עם since", ["He has changed a lot since he moved to Haifa.", "Since he moved to Haifa, he has changed a lot."], "הווה מושלם + since + עבר פשוט.", "present perfect + since + past simple.");
l3.sort(["✓ Correct", "✗ Wrong"], [["When I get home, I'll call.", "✓ Correct"], ["When I will get home, I'll call.", "✗ Wrong"], ["After eating, we rested.", "✓ Correct"], ["Before to go, check the door.", "✗ Wrong"], ["I've known her since 2015.", "✓ Correct"], ["Wait until I will come.", "✗ Wrong"]], "התיקונים: When I get · Before going · until I come.", "Fixes: When I get · Before going · until I come.");
l3.cloze("The exam", "{1} the exam started, I read all the questions. {2} I was writing, the teacher walked around the room. {3} the end, I had answered everything. I'll be nervous {4} I get the results.", [["before", "Before"], ["while", "While"], ["by", "By"], ["until", "until"]], "שימו לב: Before / While / By the end / until.", "Before / While / By / until.", { allow: ["exam", "nervous", "results", "walked", "answered"] });
l3.write("Describe your morning routine using before, after, when, as soon as and until.", "תארו את שגרת הבוקר שלכם עם before, after, when, as soon as ו-until.", "As soon as I wake up, I check my phone. I take a shower before I get dressed. After breakfast, I walk to school. When I get there, I talk with my friends until the lesson starts.", "מילות זמן מסדרות את האירועים.", "Time words order the events.");

export const timeClausesItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
