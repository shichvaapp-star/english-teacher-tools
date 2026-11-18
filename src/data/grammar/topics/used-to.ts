import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG, QUE } from "@/data/grammar/build";

// Band II: MODALITY: Used to – past states / habits that are no longer true (grades 8–9).

export const usedToTopic: GrammarTopic = {
  id: "used-to",
  group: "modals",
  title: "used to",
  titleHe: "used to – הרגלים מהעבר",
  bandRefs: ["MODALITY: Used to"],
  grades: { 8: "emerging", 9: "evolving" },
  rule: {
    1: {
      points: [
        { he: "used to + פועל = פעם (ועכשיו כבר לא)", en: "used to + verb = in the past (not now)", examples: ["I **used to play** football.", "She **used to live** in Haifa."] },
        { he: "used to זהה לכולם", en: "used to is the same for everyone", examples: ["He **used to** be shy.", "They **used to** walk to school."] },
        { he: "שלילה: didn't use to", en: "Negative: didn't use to", examples: ["I **didn't use to** like fish."] },
        { he: "שאלה: Did … use to…?", en: "Question: Did … use to…?", examples: ["**Did** you **use to** have long hair?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "subject + used to + base verb", example: "We used to live here." },
        { kind: "negative", pattern: "subject + didn't use to + base verb", example: "He didn't use to cook." },
        { kind: "question", pattern: "Did + subject + use to + base verb?", example: "Did she use to dance?" },
      ],
      timeWords: ["when I was a child", "in the past", "before", "but now"],
    },
    2: {
      points: [
        { he: "הרגלים ומצבים שהיו בעבר", en: "Past habits and states", examples: ["My grandpa **used to** work in a factory.", "There **used to** be a cinema here."] },
        { he: "אחרי did / didn't – use to (בלי d)", en: "After did / didn't – use to (no d)", examples: ["Did you **use to**…?", "✗ Did you used to…?"] },
        { he: "used to + צורת בסיס", en: "used to + base verb", examples: ["She used to **play**.", "✗ She used to played."] },
        { he: "used to מול עבר פשוט: הרגל מול פעם אחת", en: "used to (habit) vs past simple (once)", examples: ["I **used to** visit Eilat every summer.", "I **visited** Eilat last summer."] },
      ],
      form: [
        { kind: "affirmative", pattern: "There used to be + noun", example: "There used to be a park here." },
        { kind: "question", pattern: "Wh- + did + subject + use to + base verb?", example: "Where did you use to live?" },
      ],
      timeWords: ["every summer", "when I was young", "years ago", "anymore"],
    },
    3: {
      points: [
        { he: "used to – רק בעבר. בהווה: usually", en: "used to is only past; present → usually", examples: ["I **usually** get up at 7.", "✗ I use to get up at 7."] },
        { he: "be used to + ing = רגיל ל…", en: "be used to + -ing = accustomed to", examples: ["I'**m used to waking** up early."] },
        { he: "would – גם הרגל בעבר (לא מצבים)", en: "would – past habits (not states)", examples: ["Every Friday we **would** eat at Grandma's."] },
        { he: "not … anymore – כבר לא", en: "not … anymore = no longer", examples: ["I used to smoke, but I **don't** anymore."] },
      ],
      form: [
        { kind: "affirmative", pattern: "be / get used to + verb-ing / noun", example: "She got used to the noise." },
        { kind: "affirmative", pattern: "would + base verb (repeated past action)", example: "He would tell us stories." },
      ],
      timeWords: ["anymore", "no longer", "these days", "back then"],
    },
  },
  traps: [
    { id: "ut-did-used", wrong: "Did you used to play?", right: "Did you use to play?", whyHe: "אחרי did – use to (בלי d).", whyEn: "After did → use to." },
    { id: "ut-verb", wrong: "She used to played tennis.", right: "She used to play tennis.", whyHe: "אחרי used to – צורת בסיס.", whyEn: "After used to → base verb." },
    { id: "ut-present", wrong: "I use to get up at seven every day.", right: "I usually get up at seven every day.", whyHe: "בהווה לא אומרים use to – אומרים usually.", whyEn: "Present habit → usually." },
    { id: "ut-no-to", wrong: "We used play here.", right: "We used to play here.", whyHe: "חסר to: used to play.", whyEn: "Missing to: used to play." },
  ],
};

const T = "used-to";

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "ut", 1, 8);
g8a.mcq("My grandfather ___ work in a factory.", ["used to", "use to", "used"], "פעם, ועכשיו כבר לא → used to.", "In the past, not now → used to.", { trap: "ut-no-to" });
g8a.mcq("I used to ___ the drums, but I stopped.", ["play", "played", "playing"], "אחרי used to – צורת בסיס: play.", "After used to → play.", { trap: "ut-verb" });
g8a.mcq("We ___ use to travel abroad. Now we do.", ["didn't", "don't", "weren't"], "שלילה בעבר → didn't use to.", "Negative → didn't use to.");
g8a.mcq("Did you ___ live in Tel Aviv?", ["use to", "used to", "using to"], "אחרי did – use to (בלי d).", "After did → use to.", { trap: "ut-did-used" });
g8a.mcq("There ___ be a café on this corner.", ["used to", "use to", "is used to"], "There used to be = פעם היה.", "There used to be = there was before.");
g8a.bank("My mom used to ___ in a business.", ["work", "worked", "works"], "אחרי used to – צורת בסיס.", "After used to → base verb.", { trap: "ut-verb" });
g8a.bank("She ___ to be shy, but now she's an actor.", ["used", "use", "uses"], "חיובי בעבר → used to.", "Positive → used to.");
g8a.bank("I didn't ___ to like cooking.", ["use", "used", "uses"], "אחרי didn't – use to.", "After didn't → use to.", { trap: "ut-did-used" });
g8a.order("I used to download a lot of games.", "I + used to + פועל.", "I + used to + verb.");
g8a.order("Did your parents use to travel abroad?", "Did + נושא + use to + פועל?", "Did + subject + use to + verb?");
g8a.sort(["Now", "In the past (used to)"], [["I play the guitar.", "Now"], ["I used to play the drums.", "In the past (used to)"], ["She works in a café.", "Now"], ["She used to work in a factory.", "In the past (used to)"], ["We live abroad.", "Now"], ["We used to live in Haifa.", "In the past (used to)"]], "used to = פעם, ועכשיו לא. בלי used to = עכשיו.", "used to = past only; without it = now.");
g8a.match([["When I was a child, I", "used to be afraid of the dark."], ["Before he had a car, he", "used to take the bus."], ["Years ago, people", "used to write letters."], ["Before the supermarket, there", "used to be a small shop here."]], "used to + פועל – הרגל או מצב בעבר.", "used to + verb – a past habit or state.", { allow: ["child", "letters"] });

const g8b = itemSet(T, "ut", 2, 8);
g8b.type("When I was young, I ___ cartoons every morning.", "watch", "used to watch", "הרגל בעבר → used to watch.", "Past habit → used to watch.", { allow: ["cartoons"] });
g8b.type("My dad ___ like coffee, but now he drinks it every day.", "not / use to", ["didn't use to", "did not use to"], "שלילה → didn't use to.", "Negative → didn't use to.", { trap: "ut-did-used" });
g8b.type("Where did you ___ live?", "use to", "use to", "אחרי did – use to.", "After did → use to.", { trap: "ut-did-used" });
g8b.type("There ___ a cinema in our town, but it closed.", "be", "used to be", "פעם היה → There used to be.", "There used to be.", { allow: ["cinema"] });
g8b.mcq("I ___ my grandmother last weekend.", ["visited", "used to visit", "use to visit"], "פעם אחת (last weekend) → עבר פשוט: visited.", "Once, last weekend → visited.");
g8b.fix("Did she *used to sing in a band?", ["use"], "אחרי Did – use to (בלי d).", "After Did → use to.", { trap: "ut-did-used" });
g8b.fix("My brother used to *played the drums.", ["play"], "אחרי used to – צורת בסיס: play.", "After used to → play.", { trap: "ut-verb" });
g8b.fix("I *use to get up at six every day now.", ["usually"], "בהווה – usually, לא use to.", "Present habit → usually.", { trap: "ut-present" });
g8b.transform("He used to chat online a lot.", ...NEG, ["He didn't use to chat online a lot.", "He did not use to chat online a lot."], "שלילה: didn't use to + chat.", "didn't use to chat.");
g8b.transform("They used to travel by train.", ...QUE, "Did they use to travel by train?", "שאלה: Did + they + use to + travel?", "Did they use to travel…?", { trap: "ut-did-used" });
g8b.order("What did you use to do on Saturdays?", "המבנה: What + did + you + use to + do?", "What did you use to do?");
g8b.cloze("My town in the past", "My grandma told me: \"There {1} a big factory here. People {2} work there all day. Children {3} have phones – they {4} play outside. And there {5} any traffic!\"", [["be", "used to be"], ["use to", "used to"], ["not / use to", ["didn't use to", "did not use to"]], ["use to", "used to"], ["not / use to + be", ["didn't use to be", "did not use to be"]]], "used to – פעם. didn't use to – פעם לא.", "used to / didn't use to.", { allow: ["grandma", "children", "phones", "outside"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "ut", 1, 9);
g9a.mcq("My neighbor ___ be a firefighter.", ["used to", "use to", "used"], "פעם, ועכשיו כבר לא → used to.", "In the past, not now → used to.", { trap: "ut-no-to" });
g9a.mcq("I used to ___ a lot of selfies.", ["take", "took", "taking"], "אחרי used to – צורת בסיס: take.", "After used to → take.", { trap: "ut-verb" });
g9a.mcq("We ___ use to have an elevator. Now we do.", ["didn't", "don't", "weren't"], "שלילה בעבר → didn't use to.", "Negative → didn't use to.");
g9a.mcq("Did your grandparents ___ live in this neighborhood?", ["use to", "used to", "using to"], "אחרי did – use to (בלי d).", "After did → use to.", { trap: "ut-did-used" });
g9a.mcq("There ___ be a stadium here.", ["used to", "use to", "is used to"], "There used to be = פעם היה.", "There used to be.");
g9a.bank("My grandmother used to ___ her own clothes.", ["sew", "sewed", "sews"], "אחרי used to – צורת בסיס.", "After used to → base verb.", { trap: "ut-verb" });
g9a.bank("He ___ to be a vegetarian, but now he eats meat.", ["used", "use", "uses"], "חיובי בעבר → used to.", "Positive → used to.");
g9a.bank("I didn't ___ to like documentaries.", ["use", "used", "uses"], "אחרי didn't – use to.", "After didn't → use to.", { trap: "ut-did-used" });
g9a.order("We used to sail every summer.", "We + used to + פועל.", "We + used to + verb.");
g9a.order("Did your town use to have a tower?", "Did + נושא + use to + פועל?", "Did + subject + use to + verb?");
g9a.sort(["Now", "In the past (used to)"], [["I post on social media.", "Now"], ["I used to write letters.", "In the past (used to)"], ["She works as an architect.", "Now"], ["She used to be a secretary.", "In the past (used to)"], ["We live in a quiet neighborhood.", "Now"], ["We used to live near the stadium.", "In the past (used to)"]], "used to = פעם, ועכשיו לא. בלי used to = עכשיו.", "used to = past only; without it = now.", { allow: ["social", "media", "letters"] });
g9a.match([["Before smartphones, people", "used to use maps."], ["Before the elevator, we", "used to take the stairs."], ["Years ago, my parents", "used to read newspapers."], ["Before the tower, there", "used to be a market here."]], "used to + פועל – הרגל או מצב בעבר.", "used to + verb – a past habit or state.", { allow: ["smartphones", "maps", "stairs", "market", "newspapers"] });

const g9b = itemSet(T, "ut", 2, 9);
g9b.type("When I was young, I ___ in the sea every weekend.", "swim", "used to swim", "הרגל בעבר → used to swim.", "Past habit → used to swim.");
g9b.type("My dad ___ complain about the noise, but now he does.", "not / use to", ["didn't use to", "did not use to"], "שלילה → didn't use to.", "Negative → didn't use to.", { trap: "ut-did-used" });
g9b.type("What did you ___ do in your free time?", "use to", "use to", "אחרי did – use to.", "After did → use to.", { trap: "ut-did-used" });
g9b.type("There ___ a gallery on this street, but it closed.", "be", "used to be", "פעם היה → There used to be.", "There used to be.");
g9b.mcq("I ___ a great documentary last night.", ["watched", "used to watch", "use to watch"], "פעם אחת (last night) → עבר פשוט: watched.", "Once, last night → watched.");
g9b.fix("Did he *used to translate novels?", ["use"], "אחרי Did – use to (בלי d).", "After Did → use to.", { trap: "ut-did-used" });
g9b.fix("My aunt used to *sewed wedding dresses.", ["sew"], "אחרי used to – צורת בסיס: sew.", "After used to → sew.", { trap: "ut-verb", allow: ["aunt", "dresses"] });
g9b.fix("I *use to drink coffee every morning these days.", ["usually"], "בהווה – usually, לא use to.", "Present habit → usually.", { trap: "ut-present" });
g9b.transform("She used to post a lot of tweets.", ...NEG, ["She didn't use to post a lot of tweets.", "She did not use to post a lot of tweets."], "שלילה: didn't use to + post.", "didn't use to post.");
g9b.transform("They used to live near the stadium.", ...QUE, "Did they use to live near the stadium?", "שאלה: Did + they + use to + live?", "Did they use to live…?", { trap: "ut-did-used" });
g9b.order("Where did your family use to go on vacation?", "המבנה: Where + did + your family + use to + go?", "Where did your family use to go?");
g9b.cloze("Life before the internet", "My dad says: \"We {1} read newspapers. We {2} send emails – we {3} write letters. And we {4} binge-watch series – there {5} only one TV channel!\"", [["use to", "used to"], ["not / use to", ["didn't use to", "did not use to"]], ["use to", "used to"], ["not / use to", ["didn't use to", "did not use to"]], ["be", "used to be"]], "used to – פעם. didn't use to – פעם לא.", "used to / didn't use to.", { allow: ["newspapers", "emails", "letters", "tv", "internet"] });

// ───────────── Level 3 (grades 8–9) ─────────────
const l3 = itemSet(T, "ut", 3);
l3.mcq("I ___ get up at seven these days.", ["usually", "use to", "used to"], "הרגל בהווה → usually.", "Present habit → usually.", { trap: "ut-present" });
l3.mcq("After a year in London, she's used to ___ on the left.", ["driving", "drive", "drove"], "be used to + ing = רגיל ל…", "be used to + -ing.", { allow: ["london", "left"] });
l3.type("Every Friday my grandma ___ tell us stories.", "would", "would", "הרגל חוזר בעבר → would / used to.", "Repeated past habit → would.", { allow: ["grandma", "stories"] });
l3.type("I used to bite my nails, but I don't ___.", "anymore", "anymore", "not … anymore = כבר לא.", "not … anymore.", { allow: ["bite", "nails"] });
l3.fix("I'm used to *wake up early.", ["waking"], "המבנה: be used to + ing: waking.", "be used to + -ing.", {});
l3.fix("We *use to go to Eilat every summer when I was a kid.", ["used"], "עבר → used to.", "Past → used to.", { allow: ["kid"] });
l3.fix("Did you *used to have long hair?", ["use"], "אחרי Did – use to.", "After Did → use to.", { trap: "ut-did-used", allow: ["hair"] });
l3.transform("I don't play football now. I played it when I was a kid.", "Say it in one sentence with 'used to'.", "אמרו את זה במשפט אחד עם used to", ["I used to play football.", "I used to play football when I was a kid."], "used to play = פעם שיחקתי.", "used to play.", { allow: ["kid"] });
l3.transform("She lived in Paris.", "Ask with 'Where … use to …?'", "שאלו עם Where … use to …?", ["Where did she use to live?"], "המבנה: Where + did + she + use to + live?", "Where did she use to live?", { allow: ["paris"] });
l3.sort(["✓ Correct", "✗ Wrong"], [["I used to live here.", "✓ Correct"], ["Did you used to swim?", "✗ Wrong"], ["She's used to working late.", "✓ Correct"], ["I use to wake up early.", "✗ Wrong"], ["We didn't use to have a car.", "✓ Correct"], ["He used to played tennis.", "✗ Wrong"]], "התיקונים: Did you use to · I usually wake up · He used to play.", "Fixes: Did you use to · I usually wake up · He used to play.");
l3.cloze("Then and now", "When I was little, I {1} hate vegetables. My mom {2} hide them in my food! Now I'm a vegetarian, and I'm used to {3} salads every day. I don't eat meat {4}.", [["use to", "used to"], ["would / used to", ["would", "used to"]], ["eat", "eating"], ["anymore", "anymore"]], "used to / would – עבר. be used to + ing. not … anymore.", "used to / would / be used to + -ing / anymore.", { allow: ["vegetables", "hide", "salads", "little"] });
l3.write("Write about how your life was different when you were six. Use used to, didn't use to and one sentence with 'anymore'.", "כתבו איך החיים שלכם היו שונים כשהייתם בני שש. השתמשו ב-used to, didn't use to ובמשפט אחד עם anymore.", "When I was six, I used to sleep with a teddy bear. I didn't use to like vegetables. I used to watch cartoons every morning, but I don't anymore.", "used to / didn't use to + צורת בסיס.", "used to / didn't use to + base verb.");

export const usedToItems: GrammarItem[] = [...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items];
