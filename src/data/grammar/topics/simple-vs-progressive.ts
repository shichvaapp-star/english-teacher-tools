import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, QUE } from "@/data/grammar/build";

// Band II: Present simple vs present continuous (meaning contrast – curriculum foreword example).

export const simpleVsProgressiveTopic: GrammarTopic = {
  id: "simple-vs-progressive",
  group: "tenses",
  title: "Present Simple vs Progressive",
  titleHe: "הווה פשוט מול הווה מתמשך",
  bandRefs: ["VERBS: Present simple", "VERBS: Present continuous", "VERBS: Present simple mental process"],
  grades: { 7: "emerging", 8: "evolving", 9: "evolving" },
  rule: {
    1: {
      points: [
        { he: "הווה פשוט: תמיד, בדרך כלל, כל יום", en: "Present Simple: always, usually, every day", examples: ["I **play** football every day.", "She **walks** to school."] },
        { he: "הווה מתמשך: עכשיו, ברגע זה", en: "Present Progressive: now, at this moment", examples: ["I **am playing** football now.", "She **is walking** to school now."] },
        { he: "מילות הזמן עוזרות לבחור", en: "Time words help you choose", examples: ["every day → simple", "usually → simple", "now → progressive", "Look! → progressive"], chips: true },
        { he: "שאלה: Do / Does מול Am / Is / Are", en: "Questions: Do / Does vs Am / Is / Are", examples: ["**Do** you **play** tennis?", "**Are** you **playing** now?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "Simple: verb / verb + s", example: "He reads every night." },
        { kind: "affirmative", pattern: "Progressive: am / is / are + verb-ing", example: "He is reading now." },
        { kind: "question", pattern: "Do / Does …? – Am / Is / Are … -ing?", example: "Does he read? Is he reading?" },
      ],
      timeWords: ["every day", "usually", "always", "now", "at the moment", "Look!"],
    },
    2: {
      points: [
        { he: "הרגל מול מה שקורה עכשיו", en: "Habit vs happening now", examples: ["Dad usually **drives** to work.", "Today he **is taking** the bus."] },
        { he: "קבוע מול זמני", en: "Permanent vs temporary", examples: ["We **live** in Haifa.", "This week we **are staying** in Eilat."] },
        { he: "פעלי מצב רק בהווה פשוט", en: "State verbs only in the simple", examples: ["I **know** him.", "✗ I am knowing him."] },
        { he: "מילות זמן: every / usually מול now / today / this week", en: "Signals: every / usually vs now / today / this week", examples: ["every Sunday", "usually", "right now", "this week"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "Simple: habits, facts, permanent", example: "Water boils at 100°C." },
        { kind: "affirmative", pattern: "Progressive: now, temporary", example: "The water is boiling!" },
        { kind: "negative", pattern: "don't / doesn't + verb – isn't / aren't + verb-ing", example: "She doesn't cook. She isn't cooking now." },
      ],
      timeWords: ["every Sunday", "usually", "often", "right now", "today", "this week"],
    },
    3: {
      points: [
        { he: "קבוע מול זמני", en: "Permanent vs temporary", examples: ["She **works** in a bank.", "She **is working** from home this month."] },
        { he: "פועל אחד – שתי משמעויות", en: "One verb, two meanings", examples: ["I **have** a dog. / I **am having** lunch.", "I **think** it's good. / I **am thinking** about it."] },
        { he: "לוח זמנים מול תוכנית אישית", en: "Timetable vs personal plan", examples: ["The train **leaves** at 8.", "We **are leaving** at 8."] },
        { he: "פעלי מצב: know, want, need, belong, seem", en: "State verbs: know, want, need, belong, seem", examples: ["This bag **belongs** to me.", "✗ This bag is belonging to me."] },
      ],
      form: [
        { kind: "affirmative", pattern: "Simple: general / permanent / timetable", example: "The film starts at 9." },
        { kind: "affirmative", pattern: "Progressive: now / temporary / arranged plan", example: "I'm seeing the doctor at 9." },
      ],
      timeWords: ["these days", "currently", "nowadays", "always", "at the moment"],
    },
  },
  traps: [
    { id: "sp-now-simple", wrong: "Look! It rains.", right: "Look! It is raining.", whyHe: "Look! = עכשיו – הווה מתמשך.", whyEn: "Look! = now → progressive." },
    { id: "sp-habit-prog", wrong: "I am going to school every day.", right: "I go to school every day.", whyHe: "every day = הרגל – הווה פשוט.", whyEn: "every day = habit → simple." },
    { id: "sp-state", wrong: "I am liking this song.", right: "I like this song.", whyHe: "like הוא פועל מצב – בלי ing.", whyEn: "like is a state verb – no -ing." },
    { id: "sp-have", wrong: "I am having a dog.", right: "I have a dog.", whyHe: "have במובן 'יש לי' – בלי ing.", whyEn: "have (= own) – no -ing." },
    { id: "sp-do-be", wrong: "Do you watching TV?", right: "Are you watching TV?", whyHe: "עם ing שואלים Are, לא Do.", whyEn: "With -ing, ask with Are, not Do." },
  ],
};

const T = "simple-vs-progressive";
const B = ["Present Simple", "Present Progressive"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "sp", 1, 7);
g7a.mcq("Look! The team ___ now.", ["is practicing", "practices", "practice"], "Look! = עכשיו, ולכן is practicing.", "Look! = now → is practicing.", { trap: "sp-now-simple" });
g7a.mcq("The team ___ every Monday.", ["practices", "is practicing", "practicing"], "every Monday = הרגל, ולכן practices.", "every Monday = habit → practices.", { trap: "sp-habit-prog" });
g7a.mcq("I ___ my teeth every morning.", ["brush", "am brushing", "brushes"], "every morning = הרגל, ועם I → brush.", "every morning → I brush.");
g7a.mcq("Shh! Grandpa ___ now.", ["is sleeping", "sleeps", "sleep"], "Shh! … now = עכשיו, ולכן is sleeping.", "now → is sleeping.", { allow: ["shh", "grandpa"] });
g7a.mcq("___ you like geography?", ["Do", "Are", "Is"], "like הוא פועל מצב → Do you like…?", "like is a state verb → Do you like…?", { trap: "sp-state" });
g7a.bank("My dad usually ___ to work.", ["drives", "is driving", "drive"], "usually = בדרך כלל, ולכן drives.", "usually → drives.");
g7a.bank("Listen! The band ___ our song.", ["is playing", "plays", "play"], "Listen! = עכשיו, ולכן is playing.", "Listen! → is playing.", { trap: "sp-now-simple" });
g7a.bank("I ___ a dog and a cat.", ["have", "am having", "has"], "have במובן 'יש לי' – הווה פשוט.", "have (= own) → simple.", { trap: "sp-have" });
g7a.order("She is helping her mom now.", "now = עכשיו: is + helping.", "now → is helping.");
g7a.order("We travel to the village every summer.", "every summer = הרגל: travel.", "every summer → travel.");
g7a.sort(B, [["every day", "Present Simple"], ["now", "Present Progressive"], ["usually", "Present Simple"], ["Look!", "Present Progressive"], ["on Mondays", "Present Simple"], ["at the moment", "Present Progressive"]], "הרגל → הווה פשוט. עכשיו → הווה מתמשך.", "Habit → simple. Now → progressive.");
g7a.match([["Every Friday we", "eat with my grandparents."], ["Right now we", "are eating lunch."], ["My sister always", "helps in the kitchen."], ["Look! My sister", "is cutting the lemons."]], "every / always → פשוט. now / Look! → מתמשך.", "every / always → simple. now / Look! → progressive.");

const g7b = itemSet(T, "sp", 2, 7);
g7b.type("My brother ___ math every evening.", "study", "studies", "every evening = הרגל, ולכן studies.", "every evening = habit → studies.", { trap: "sp-habit-prog" });
g7b.type("Be quiet! I ___ my history test.", "study", ["am studying", "'m studying"], "Be quiet! = עכשיו, ולכן am studying.", "Be quiet! = now → am studying.");
g7b.type("We usually take the bus, but today we ___ .", "walk", ["are walking", "'re walking"], "today = היום, משהו זמני, ולכן are walking.", "today = temporary → are walking.");
g7b.type("I ___ the answer to this question.", "know", "know", "know הוא פועל מצב – תמיד הווה פשוט.", "know is a state verb → simple.", { trap: "sp-state" });
g7b.mcq("What ___ you usually do after school?", ["do", "are", "is"], "usually = הרגל: What do you usually do?", "usually → What do you usually do?");
g7b.fix("Look! It *snows on the mountain.", ["is snowing"], "Look! = עכשיו: It is snowing.", "Look! → It is snowing.", { trap: "sp-now-simple" });
g7b.fix("I *am going to the club every Tuesday.", ["go"], "every Tuesday = הרגל: I go.", "every Tuesday → I go.", { trap: "sp-habit-prog" });
g7b.fix("*Do you listening to me?", ["Are"], "עם ing שואלים Are: Are you listening?", "With -ing: Are you listening?", { trap: "sp-do-be" });
g7b.transform("He plays in the band.", "Add 'now' – change the verb.", "הוסיפו now – שנו את הפועל", ["He is playing in the band now.", "He's playing in the band now."], "now = עכשיו, ולכן is playing.", "now → is playing.");
g7b.transform("She is cooking a meal now.", "Change 'now' to 'every day'.", "החליפו את now ב-every day", ["She cooks a meal every day."], "every day → הווה פשוט: cooks.", "every day → cooks.");
g7b.order("Are you traveling with your family this week?", "this week = זמני: Are + you + traveling?", "this week = temporary → Are you traveling?");
g7b.cloze("A different Saturday", "On Saturdays my family usually {1} to the beach. But today it {2}, so we {3} at home. My dad {4} a movie and I {5} this text!", [["go", "goes"], ["rain", ["is raining", "'s raining"]], ["stay", ["are staying", "'re staying"]], ["watch", ["is watching", "'s watching"]], ["write", ["am writing", "'m writing"]]], "usually → פשוט. today / עכשיו → מתמשך.", "usually → simple. today / now → progressive.", { allow: ["beach", "text"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "sp", 1, 8);
g8a.mcq("Look! The chef ___ the cake.", ["is decorating", "decorates", "decorate"], "Look! = עכשיו, ולכן is decorating.", "Look! = now → is decorating.", { trap: "sp-now-simple", allow: ["chef"] });
g8a.mcq("The chef ___ cakes every morning.", ["decorates", "is decorating", "decorate"], "every morning = הרגל, ולכן decorates.", "every morning = habit → decorates.", { trap: "sp-habit-prog", allow: ["chef"] });
g8a.mcq("I ___ online with my friends every evening.", ["chat", "am chatting", "chats"], "every evening = הרגל, ועם I → chat.", "every evening → I chat.");
g8a.mcq("Listen! Someone ___ the drums.", ["is playing", "plays", "play"], "Listen! = עכשיו, ולכן is playing.", "Listen! → is playing.");
g8a.mcq("___ you remember my address?", ["Do", "Are", "Is"], "remember הוא פועל מצב → Do you remember…?", "remember is a state verb → Do you remember…?", { trap: "sp-state" });
g8a.bank("My uncle usually ___ to the airport.", ["drives", "is driving", "drive"], "usually = בדרך כלל, ולכן drives.", "usually → drives.");
g8a.bank("Shh! The actors ___ now.", ["are performing", "perform", "performs"], "Shh! … now = עכשיו, ולכן are performing.", "now → are performing.", { allow: ["shh"] });
g8a.bank("We ___ a big family business.", ["have", "are having", "has"], "have במובן 'יש לנו' – הווה פשוט.", "have (= own) → simple.", { trap: "sp-have" });
g8a.order("They are waiting at the bus station now.", "now = עכשיו: are + waiting.", "now → are waiting.");
g8a.order("He records a podcast every week.", "every week = הרגל: records.", "every week → records.", { allow: ["podcast"] });
g8a.sort(B, [["every week", "Present Simple"], ["right now", "Present Progressive"], ["often", "Present Simple"], ["Listen!", "Present Progressive"], ["on Fridays", "Present Simple"], ["today", "Present Progressive"]], "הרגל → הווה פשוט. עכשיו / היום → הווה מתמשך.", "Habit → simple. Now / today → progressive.");
g8a.match([["Every summer we", "travel abroad."], ["This summer we", "are staying at home."], ["My mom often", "bakes bread."], ["Look! My mom", "is pouring the flour."]], "every / often → פשוט. this summer / Look! → מתמשך.", "every / often → simple. this summer / Look! → progressive.", { allow: ["bakes", "bread"] });

const g8b = itemSet(T, "sp", 2, 8);
g8b.type("The concert ___ at eight every evening.", "start", "starts", "לוח זמנים קבוע → הווה פשוט: starts.", "Fixed timetable → starts.");
g8b.type("Be quiet! The baby ___ .", "sleep", ["is sleeping", "'s sleeping"], "Be quiet! = עכשיו, ולכן is sleeping.", "Be quiet! = now → is sleeping.");
g8b.type("I usually eat a sandwich, but today I ___ pasta.", "have", ["am having", "'m having"], "today = היום. have במובן 'לאכול' – אפשר ing: am having.", "today → am having (have = eat).", { allow: ["sandwich", "pasta"] });
g8b.type("This bag ___ to my sister.", "belong", "belongs", "belong הוא פועל מצב – הווה פשוט: belongs.", "belong is a state verb → belongs.", { trap: "sp-state" });
g8b.mcq("How often ___ you download new songs?", ["do", "are", "is"], "How often = הרגל: How often do you…?", "How often → do you…?");
g8b.fix("Listen! My phone *rings in my bag.", ["is ringing"], "Listen! = עכשיו: is ringing.", "Listen! → is ringing.", { trap: "sp-now-simple" });
g8b.fix("We *are visiting our grandparents every weekend.", ["visit"], "every weekend = הרגל: we visit.", "every weekend → we visit.", { trap: "sp-habit-prog" });
g8b.fix("*Do they recording a new song now?", ["Are"], "עם ing שואלים Are: Are they recording?", "With -ing: Are they recording?", { trap: "sp-do-be" });
g8b.transform("She chats with her friends online.", "Add 'right now' – change the verb.", "הוסיפו right now – שנו את הפועל", ["She is chatting with her friends online right now.", "She's chatting with her friends online right now."], "right now = עכשיו, ולכן is chatting.", "right now → is chatting.");
g8b.transform("They are traveling abroad this month.", "Change 'this month' to 'every summer'.", "החליפו את this month ב-every summer", ["They travel abroad every summer."], "every summer → הווה פשוט: travel.", "every summer → travel.");
g8b.order("Is your dad working from home this week?", "this week = זמני: Is + your dad + working?", "this week = temporary → Is your dad working?");
g8b.cloze("A busy café", "Our café usually {1} at seven, but this week it {2} at six because of the holiday. Right now the cook {3} bread, and two waiters {4} the tables. I {5} the coffee here!", [["open", "opens"], ["open", ["is opening", "'s opening"]], ["bake", ["is baking", "'s baking"]], ["set", ["are setting", "'re setting"]], ["love", "love"]], "usually → פשוט. this week / right now → מתמשך. love – פועל מצב, פשוט.", "usually → simple. this week / right now → progressive. love → simple.", { allow: ["bread", "waiters", "bake", "baking"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "sp", 1, 9);
g9a.mcq("Look! My sister ___ a selfie.", ["is taking", "takes", "take"], "Look! = עכשיו, ולכן is taking.", "Look! = now → is taking.", { trap: "sp-now-simple" });
g9a.mcq("My sister ___ selfies every day.", ["takes", "is taking", "take"], "every day = הרגל, ולכן takes.", "every day = habit → takes.", { trap: "sp-habit-prog" });
g9a.mcq("I ___ the dishes every evening.", ["wash", "am washing", "washes"], "every evening = הרגל, ועם I → wash.", "every evening → I wash.");
g9a.mcq("Listen! The phone ___ .", ["is ringing", "rings", "ring"], "Listen! = עכשיו, ולכן is ringing.", "Listen! → is ringing.");
g9a.mcq("___ you need help with the housework?", ["Do", "Are", "Is"], "need הוא פועל מצב → Do you need…?", "need is a state verb → Do you need…?", { trap: "sp-state" });
g9a.bank("My grandfather usually ___ the elevator.", ["takes", "is taking", "take"], "usually = בדרך כלל, ולכן takes.", "usually → takes.");
g9a.bank("Shh! The firefighter ___ to the reporters.", ["is talking", "talks", "talk"], "Shh! = עכשיו, ולכן is talking.", "now → is talking.", { allow: ["shh", "reporters"] });
g9a.bank("We ___ a new oven.", ["have", "are having", "has"], "have במובן 'יש לנו' – הווה פשוט.", "have (= own) → simple.", { trap: "sp-have" });
g9a.order("They are sailing to the island now.", "now = עכשיו: are + sailing.", "now → are sailing.");
g9a.order("He posts a tweet every morning.", "every morning = הרגל: posts.", "every morning → posts.");
g9a.sort(B, [["every morning", "Present Simple"], ["right now", "Present Progressive"], ["hardly ever", "Present Simple"], ["Listen!", "Present Progressive"], ["nowadays", "Present Simple"], ["at the moment", "Present Progressive"]], "הרגל / כללי → הווה פשוט. עכשיו → הווה מתמשך.", "Habit / general → simple. Now → progressive.");
g9a.match([["Every year the city", "holds a marathon."], ["Look! The runners", "are crossing the line."], ["My dad hardly ever", "watches documentaries."], ["Right now my dad", "is watching a documentary."]], "every year / hardly ever → פשוט. Look! / right now → מתמשך.", "every year / hardly ever → simple. Look! / right now → progressive.", { allow: ["holds", "runners"] });

const g9b = itemSet(T, "sp", 2, 9);
g9b.type("The gallery ___ at ten every morning.", "open", "opens", "לוח זמנים קבוע → הווה פשוט: opens.", "Fixed timetable → opens.");
g9b.type("Don't call now – I ___ an interview.", "have", ["am having", "'m having"], "now = עכשיו. have במובן 'לקיים' – אפשר ing: am having.", "now → am having (have = take part in).");
g9b.type("We usually sleep at home, but this week we ___ in a hotel.", "sleep", ["are sleeping", "'re sleeping"], "this week = זמני, ולכן are sleeping.", "this week = temporary → are sleeping.", { allow: ["hotel"] });
g9b.type("I ___ you – you're right.", "believe", "believe", "believe הוא פועל מצב – הווה פשוט.", "believe is a state verb → simple.", { trap: "sp-state" });
g9b.mcq("How often ___ you update your apps?", ["do", "are", "is"], "How often = הרגל: How often do you…?", "How often → do you…?");
g9b.fix("Look! The dolphins *jump out of the water.", ["are jumping"], "Look! = עכשיו: are jumping.", "Look! → are jumping.", { trap: "sp-now-simple" });
g9b.fix("My parents *are binge-watching series every weekend.", ["binge-watch"], "every weekend = הרגל: binge-watch.", "every weekend → binge-watch.", { trap: "sp-habit-prog" });
g9b.fix("*Does she translating the article now?", ["Is"], "עם ing שואלים Is: Is she translating?", "With -ing: Is she translating?", { trap: "sp-do-be" });
g9b.transform("He repairs old furniture.", "Add 'at the moment' – change the verb.", "הוסיפו at the moment – שנו את הפועל", ["He is repairing old furniture at the moment.", "He's repairing old furniture at the moment."], "at the moment = עכשיו, ולכן is repairing.", "at the moment → is repairing.");
g9b.transform("She is working from home this month.", "Change 'this month' to 'every Friday'.", "החליפו את this month ב-every Friday", ["She works from home every Friday."], "every Friday → הווה פשוט: works.", "every Friday → works.");
g9b.order("Are you binge-watching a new series these days?", "these days = זמני: Are + you + binge-watching?", "these days = temporary → Are you binge-watching?");
g9b.cloze("Our neighborhood", "Our neighborhood is usually quiet. People {1} to work early and kids {2} in the park. But this week the city {3} the road, and the workers {4} a lot of noise. I {5} this situation!", [["go", "go"], ["play", "play"], ["repair", ["is repairing", "'s repairing"]], ["make", ["are making", "'re making"]], ["hate", "hate"]], "usually → פשוט. this week → מתמשך. hate – פועל מצב, פשוט.", "usually → simple. this week → progressive. hate → simple.", { allow: ["workers"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "sp", 3);
l3.mcq("I ___ it's a great idea.", ["think", "am thinking", "thinking"], "think במובן 'לדעתי' – פועל מצב, פשוט.", "think (= opinion) → simple.");
l3.mcq("Quiet, please! I ___ about the problem.", ["am thinking", "think", "thinks"], "think about = לחשוב עכשיו → מתמשך.", "think about (now) → progressive.");
l3.type("The train ___ at 7:45 tomorrow morning.", "leave", "leaves", "לוח זמנים רשמי → הווה פשוט גם לעתיד.", "Timetable → simple, even for the future.");
l3.type("We ___ our cousins at the airport at 6 tonight.", "meet", ["are meeting", "'re meeting"], "תוכנית אישית סגורה → הווה מתמשך.", "Personal arrangement → progressive.", { allow: ["cousins"] });
l3.fix("This bag *is belonging to my teacher.", ["belongs"], "belong – פועל מצב, בלי ing.", "belong is a state verb – no -ing.", { trap: "sp-state" });
l3.fix("We *are having two cars.", ["have"], "have במובן 'יש לנו' – בלי ing.", "have (= own) – no -ing.", { trap: "sp-have" });
l3.fix("Every morning he *is running in the park.", ["runs"], "every morning = הרגל → runs.", "every morning → runs.", { trap: "sp-habit-prog" });
l3.transform("She works in a bank.", "Say it's only temporary – use 'this month' and 'from home'.", "אמרו שזה זמני – השתמשו ב-this month ו-from home", ["She is working from home this month.", "She's working from home this month.", "This month she is working from home."], "מצב זמני → is working.", "Temporary → is working.");
l3.transform("I'm seeing the dentist on Monday.", ...QUE, ["Are you seeing the dentist on Monday?"], "שאלה בהווה מתמשך: Are you seeing…?", "Are you seeing…?", { allow: ["dentist"] });
l3.sort(["✓ Correct", "✗ Wrong"], [["I'm having lunch now.", "✓ Correct"], ["I'm having a brother.", "✗ Wrong"], ["The film starts at nine.", "✓ Correct"], ["She is wanting a new phone.", "✗ Wrong"], ["Look! It's snowing.", "✓ Correct"], ["He is going to the gym every day.", "✗ Wrong"]], "התיקונים: I have a brother · She wants · He goes … every day.", "Fixes: I have a brother · She wants · He goes … every day.");
l3.cloze("Working from home", "My mom usually {1} in an office downtown. But this month she {2} from home, because they {3} the office. Right now she {4} to her boss on the computer. She {5} it's a nice change.", [["work", "works"], ["work", ["is working", "'s working"]], ["repair", ["are repairing", "'re repairing"]], ["talk", ["is talking", "'s talking"]], ["think", "thinks"]], "usually → פשוט. this month / right now → מתמשך. think (דעה) → פשוט.", "usually → simple. this month / right now → progressive. think (opinion) → simple.", { allow: ["boss"] });
l3.write("Write about your usual weekend and about this weekend, which is different. Use both tenses.", "כתבו על סוף השבוע הרגיל שלכם ועל סוף השבוע הזה, שהוא שונה. השתמשו בשני הזמנים.", "On weekends I usually sleep late and play football. This weekend I am studying for a test and my friends are visiting me.", "הרגל → פשוט. זמני / עכשיו → מתמשך.", "Habit → simple. Temporary / now → progressive.");

export const simpleVsProgressiveItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
