import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, QUE } from "@/data/grammar/build";

// Band II: Present perfect simple vs Past simple (grade 9).

export const perfectVsPastTopic: GrammarTopic = {
  id: "perfect-vs-past",
  group: "tenses",
  title: "Present Perfect vs Past Simple",
  titleHe: "הווה מושלם מול עבר פשוט",
  bandRefs: ["VERB: Present perfect simple", "VERBS: Past simple"],
  grades: { 9: "emerging" },
  rule: {
    1: {
      points: [
        { he: "עבר פשוט – כשאומרים מתי", en: "Past simple – when we say when", examples: ["I **visited** Eilat **last year**."] },
        { he: "הווה מושלם – בלי לומר מתי (ניסיון)", en: "Present perfect – no time given (experience)", examples: ["I**'ve visited** Eilat."] },
        { he: "מילות זמן של עבר: yesterday, ago, last…", en: "Past simple words: yesterday, ago, last…", examples: ["yesterday", "two days ago", "last week", "in 2020"], chips: true },
        { he: "מילות הווה מושלם: ever, never, just, yet", en: "Present perfect words: ever, never, just, yet", examples: ["ever", "never", "just", "already", "yet"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "Past simple: V2 + finished time", example: "She called yesterday." },
        { kind: "affirmative", pattern: "Present perfect: have / has + V3", example: "She has called." },
      ],
      timeWords: ["yesterday", "ago", "last", "ever", "never", "just"],
    },
    2: {
      points: [
        { he: "שאלה כללית בהווה מושלם, פרטים בעבר פשוט", en: "General question in present perfect, details in past simple", examples: ["**Have** you ever **been** to Rome?", "Yes. I **went** there in 2022."] },
        { he: "for / since עד היום → הווה מושלם", en: "for / since up to now → present perfect", examples: ["I**'ve lived** here **for** ten years. (I still live here)"] },
        { he: "סיפור שהסתיים → עבר פשוט", en: "A finished period → past simple", examples: ["I **lived** in Haifa **for** ten years. (Now I don't)"] },
        { he: "When…? תמיד עבר פשוט", en: "When…? is always past simple", examples: ["**When did** you **arrive**?", "✗ When have you arrived?"] },
      ],
      form: [
        { kind: "question", pattern: "Have you ever + V3? → Yes, I + V2 + when", example: "Have you met him? Yes, I met him last week." },
        { kind: "question", pattern: "When + did + subject + base verb?", example: "When did it happen?" },
      ],
      timeWords: ["ever", "for / since", "when?", "last", "ago"],
    },
    3: {
      points: [
        { he: "תוצאה שרלוונטית עכשיו → הווה מושלם", en: "A result that matters now → present perfect", examples: ["I**'ve lost** my keys. (I can't get in!)"] },
        { he: "אדם שכבר לא חי / תקופה שנגמרה → עבר פשוט", en: "Finished periods or people no longer alive → past simple", examples: ["Shakespeare **wrote** many plays."] },
        { he: "this week / today: עדיין נמשך → הווה מושלם", en: "this week / today (not finished) → present perfect", examples: ["I**'ve drunk** three coffees today."] },
        { he: "חדשות: הווה מושלם בהתחלה, פרטים בעבר", en: "News: present perfect first, then past details", examples: ["A fire **has destroyed** a shop. It **started** at 2 a.m."] },
      ],
      form: [
        { kind: "affirmative", pattern: "present perfect (news / result) → past simple (details)", example: "They've won! They scored in the last minute." },
      ],
      timeWords: ["today", "this week", "recently", "in the 1990s", "when I was a child"],
    },
  },
  traps: [
    { id: "pvp-time", wrong: "I have seen him yesterday.", right: "I saw him yesterday.", whyHe: "עם yesterday / ago / last – עבר פשוט.", whyEn: "With yesterday / ago / last → past simple." },
    { id: "pvp-when", wrong: "When have you arrived?", right: "When did you arrive?", whyHe: "When…? תמיד בעבר פשוט.", whyEn: "When…? → past simple." },
    { id: "pvp-ever", wrong: "Did you ever see snow? – Yes, I have saw it.", right: "Have you ever seen snow? – Yes, I saw it in 2021.", whyHe: "ניסיון כללי → הווה מושלם. פרט עם זמן → עבר.", whyEn: "General experience → present perfect; detail with time → past." },
    { id: "pvp-still", wrong: "I live here since 2015.", right: "I have lived here since 2015.", whyHe: "מצב שנמשך עד היום + since → הווה מושלם.", whyEn: "Up to now + since → present perfect." },
  ],
};

const T = "perfect-vs-past";
const B = ["Past Simple", "Present Perfect"];

// ───────────── Grade 9 ─────────────
const a = itemSet(T, "pvp", 1, 9);
a.mcq("I ___ my grandparents last weekend.", ["visited", "have visited", "have visit"], "last weekend = זמן מוגדר → עבר פשוט: visited.", "last weekend → visited.", { trap: "pvp-time" });
a.mcq("I ___ to London twice. I love it!", ["have been", "was", "have went"], "ניסיון בלי זמן → have been.", "Experience, no time → have been.", { allow: ["london"] });
a.mcq("She ___ her phone two days ago.", ["lost", "has lost", "has lose"], "two days ago → עבר פשוט: lost.", "two days ago → lost.", { trap: "pvp-time" });
a.mcq("___ you ever tried vegetarian food?", ["Have", "Did", "Do"], "ever + ניסיון → Have you ever…?", "ever → Have you ever…?");
a.mcq("When ___ you move to this neighborhood?", ["did", "have", "has"], "When…? → עבר פשוט: did.", "When…? → did.", { trap: "pvp-when" });
a.bank("We ___ just finished the housework.", ["have", "did", "had"], "just → הווה מושלם: have just finished.", "just → have just finished.");
a.bank("The firefighters ___ the fire at 3 a.m.", ["put out", "have put out", "puts out"], "at 3 a.m. = זמן מוגדר → עבר פשוט.", "A finished time → past simple.");
a.bank("My grandparents ___ in this city since 1985.", ["have lived", "lived", "live"], "since + עדיין גרים → have lived.", "since + still now → have lived.", { trap: "pvp-still" });
a.order("I have never been on a plane.", "never → הווה מושלם.", "never → present perfect.");
a.order("Did you watch the documentary last night?", "last night → שאלה בעבר פשוט: Did…?", "last night → Did…?");
a.sort(B, [["yesterday", "Past Simple"], ["ever", "Present Perfect"], ["two years ago", "Past Simple"], ["just", "Present Perfect"], ["in 2019", "Past Simple"], ["yet", "Present Perfect"]], "זמן מוגדר בעבר → עבר פשוט. ever / just / yet → הווה מושלם.", "Finished time → past simple. ever / just / yet → present perfect.");
a.match([["Have you ever been to Eilat?", "Yes, I went there last summer."], ["Has Dan called you?", "Yes, he called an hour ago."], ["Have you seen my keys?", "Yes, I saw them on the table."], ["Have they finished?", "No, they haven't finished yet."]], "שאלה כללית בהווה מושלם, תשובה עם זמן בעבר פשוט.", "General question in present perfect, answer with a time in past simple.");

const b = itemSet(T, "pvp", 2, 9);
b.type("I ___ this movie three times. It's my favorite.", "see", ["have seen", "'ve seen"], "ניסיון בלי זמן → have seen.", "Experience → have seen.");
b.type("I ___ it for the first time in 2018.", "see", "saw", "in 2018 = זמן מוגדר → saw.", "in 2018 → saw.", { trap: "pvp-time" });
b.type("We ___ each other since first grade.", "know", ["have known", "'ve known"], "since + עד היום → have known.", "since + up to now → have known.", { trap: "pvp-still" });
b.type("When ___ the marathon start?", "do", "did", "When…? → עבר פשוט: did.", "When…? → did.", { trap: "pvp-when" });
b.mcq("My grandfather ___ in a factory for 40 years. Now he's retired.", ["worked", "has worked", "works"], "תקופה שנגמרה (הוא כבר בפנסיה) → worked.", "A finished period → worked.", { allow: ["retired"] });
b.fix("I *have met her at the wedding last month.", ["met"], "last month → עבר פשוט: met.", "last month → met.", { trap: "pvp-time" });
b.fix("When *have you finished the project?", ["did"], "When…? → עבר פשוט: When did you finish?", "When did you finish?", { trap: "pvp-when" });
b.fix("We *live in this apartment since 2015.", ["have lived", "'ve lived"], "since + עד היום → have lived.", "since → have lived.", { trap: "pvp-still" });
b.transform("She has been to Paris.", "Add a time: 'last year'.", "הוסיפו זמן: last year", ["She went to Paris last year.", "She was in Paris last year."], "עם last year → עבר פשוט: went.", "last year → went.", { allow: ["paris"] });
b.transform("You visited the new gallery.", "Ask about the experience with 'ever'.", "שאלו על ניסיון עם ever", ["Have you ever visited the new gallery?", "Have you visited the new gallery?"], "ניסיון → Have you ever visited…?", "Experience → Have you ever visited…?");
b.order("Have you ever borrowed money from a friend?", "ever → Have you ever + צורה שלישית?", "ever → Have you ever + V3?");
b.cloze("A famous athlete", "My cousin {1} three marathons so far. She {2} her first one in 2019. Last year she {3} second. She {4} a marathon yet, but she {5} very hard this year.", [["run", ["has run", "'s run"]], ["run", "ran"], ["finish", "finished"], ["not / win", ["hasn't won", "has not won"]], ["train", ["has trained", "'s trained"]]], "so far / yet / this year → הווה מושלם. in 2019 / last year → עבר פשוט.", "so far / yet / this year → present perfect. in 2019 / last year → past simple.", { allow: ["cousin", "athlete", "famous", "trained", "train"] });

// ───────────── Level 3 (grade 9) ─────────────
const l3 = itemSet(T, "pvp", 3);
l3.mcq("Oh no! I ___ my keys. I can't get into the house.", ["have lost", "lost", "lose"], "תוצאה שרלוונטית עכשיו → have lost.", "A result that matters now → have lost.");
l3.mcq("Shakespeare ___ more than 30 plays.", ["wrote", "has written", "writes"], "אדם שכבר לא חי → עבר פשוט: wrote.", "Not alive anymore → wrote.", { allow: ["shakespeare", "plays"] });
l3.type("I ___ three cups of coffee today.", "drink", ["have drunk", "'ve drunk"], "today עדיין לא נגמר → have drunk.", "today (not finished) → have drunk.");
l3.type("A fire ___ a shop in Tel Aviv. It started at 2 a.m.", "destroy", ["has destroyed", "'s destroyed"], "חדשות – משפט ראשון בהווה מושלם.", "News – first sentence in present perfect.");
l3.fix("I *have broken my arm when I was ten.", ["broke"], "when I was ten = זמן מוגדר → broke.", "when I was ten → broke.", { trap: "pvp-time" });
l3.fix("Have you ever *saw a whale?", ["seen"], "אחרי have – צורה שלישית: Have you ever seen…?", "After have → seen.", { trap: "pvp-ever", allow: ["whale"] });
l3.fix("He *works here since 2020.", ["has worked", "'s worked"], "since + עד היום → has worked.", "since → has worked.", { trap: "pvp-still" });
l3.transform("They have won the league.", "Add a detail in the past: they scored in the last minute.", "הוסיפו פרט בעבר: they scored in the last minute", ["They have won the league. They scored in the last minute.", "They've won the league. They scored in the last minute."], "חדשות בהווה מושלם, פרט בעבר פשוט.", "News in present perfect, detail in past simple.", { allow: ["scored"] });
l3.transform("I have read this novel.", ...QUE, "Have you read this novel?", "שאלה: Have + you + read?", "Have you read…?");
l3.sort(["✓ Correct", "✗ Wrong"], [["I've just eaten.", "✓ Correct"], ["I've eaten an hour ago.", "✗ Wrong"], ["When did you arrive?", "✓ Correct"], ["When have you arrived?", "✗ Wrong"], ["She lived in Rome for a year.", "✓ Correct"], ["I know her since 2010.", "✗ Wrong"]], "התיקונים: I ate an hour ago · When did you arrive · I have known her.", "Fixes: I ate an hour ago · When did you arrive · I have known her.", { allow: ["rome", "arrive"] });
l3.cloze("Breaking news", "A dolphin {1} in the harbor of Haifa! Fishermen {2} it early this morning. Since then, hundreds of people {3} to see it. The dolphin {4} a few times, and everyone {5} a selfie with it.", [["appear", ["has appeared", "'s appeared"]], ["see", "saw"], ["come", ["have come", "'ve come"]], ["jump", ["has jumped", "'s jumped"]], ["take", ["has taken", "'s taken"]]], "חדשות ומה שקרה עד עכשיו → הווה מושלם. this morning (פרט) → saw.", "News and up to now → present perfect. this morning → saw.", { allow: ["harbor", "fishermen", "breaking"] });
l3.write("Write about something you have done that you're proud of, then give details about when and how it happened.", "כתבו על משהו שעשיתם ואתם גאים בו, ואז פרטו מתי ואיך זה קרה.", "I have run a marathon. I ran it last year in Jerusalem. It took me five hours, and I finished it with my dad.", "הווה מושלם לניסיון, עבר פשוט לפרטים.", "Present perfect for the experience, past simple for the details.");

export const perfectVsPastItems: GrammarItem[] = [...a.items, ...b.items, ...l3.items];
