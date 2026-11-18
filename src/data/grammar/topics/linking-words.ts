import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: CLAUSES: Coordinated (and / but / or / so) + Subordinated (because).

export const linkingWordsTopic: GrammarTopic = {
  id: "linking-words",
  group: "clauses",
  title: "and / but / or / so / because",
  titleHe: "מילות קישור",
  bandRefs: ["CLAUSES: Coordinated", "CLAUSES: Subordinated"],
  grades: { 7: "evolving", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "and = וגם (מוסיף)", en: "and adds", examples: ["I like tea **and** coffee."] },
        { he: "but = אבל (ניגוד)", en: "but contrasts", examples: ["It's cold, **but** it's sunny."] },
        { he: "or = או (בחירה)", en: "or gives a choice", examples: ["Do you want tea **or** coffee?"] },
        { he: "because = כי (סיבה), so = אז / לכן (תוצאה)", en: "because = reason; so = result", examples: ["I'm tired **because** I worked.", "I worked, **so** I'm tired."] },
      ],
      form: [
        { kind: "affirmative", pattern: "sentence + and / but / or + sentence", example: "She sings and he plays." },
        { kind: "affirmative", pattern: "result + because + reason", example: "We stayed home because it rained." },
        { kind: "affirmative", pattern: "reason + so + result", example: "It rained, so we stayed home." },
      ],
      timeWords: ["and", "but", "or", "so", "because"],
    },
    2: {
      points: [
        { he: "because לפני הסיבה, so לפני התוצאה", en: "because before the reason, so before the result", examples: ["I ate **because** I was hungry.", "I was hungry, **so** I ate."] },
        { he: "בשלילה ובשאלה: or", en: "In negatives and questions: or", examples: ["I don't like tea **or** coffee.", "Is it big **or** small?"] },
        { he: "פסיק לפני so ולפני but", en: "Usually a comma before so and but", examples: ["It was late, **so** we left.", "He's rich, **but** he's not happy."] },
        { he: "because of + שם עצם", en: "because of + noun", examples: ["We stayed home **because of** the rain."] },
      ],
      form: [
        { kind: "affirmative", pattern: "because + subject + verb / because of + noun", example: "It was closed because of the holiday." },
        { kind: "negative", pattern: "not … or …", example: "She doesn't eat meat or fish." },
      ],
      timeWords: ["because of", "also", "too", "then"],
    },
    3: {
      points: [
        { he: "although / though = למרות ש…", en: "although / though = in spite of the fact that", examples: ["**Although** it was late, we kept working."] },
        { he: "however – אבל, בתחילת משפט חדש", en: "however – but, at the start of a new sentence", examples: ["The food was good. **However**, it was expensive."] },
        { he: "so that = כדי ש…", en: "so that = in order that", examples: ["I left early **so that** I wouldn't be late."] },
        { he: "both … and = גם … וגם, either … or = או … או", en: "both … and / either … or", examples: ["**Both** my mom **and** my dad work.", "You can **either** walk **or** take the bus."] },
      ],
      form: [
        { kind: "affirmative", pattern: "Although + clause, main clause", example: "Although he was tired, he finished." },
        { kind: "affirmative", pattern: "Sentence. However, sentence.", example: "It's small. However, it's cheap." },
      ],
      timeWords: ["although", "however", "therefore", "so that", "in addition"],
    },
  },
  traps: [
    { id: "lw-so-because", wrong: "I was hungry because I ate.", right: "I was hungry, so I ate.", whyHe: "because לפני הסיבה, so לפני התוצאה.", whyEn: "because + reason; so + result." },
    { id: "lw-but-and", wrong: "It's cold and I'm wearing a T-shirt.", right: "It's cold, but I'm wearing a T-shirt.", whyHe: "ניגוד → but.", whyEn: "Contrast → but." },
    { id: "lw-neg-and", wrong: "I don't like tea and coffee.", right: "I don't like tea or coffee.", whyHe: "בשלילה – or.", whyEn: "In negatives → or." },
    { id: "lw-because-of", wrong: "We stayed home because the rain.", right: "We stayed home because of the rain.", whyHe: "לפני שם עצם → because of.", whyEn: "Before a noun → because of." },
  ],
};

const T = "linking-words";
const W = ["and", "but", "or", "so", "because"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "lw", 1, 7);
g7a.mcq("I like math ___ science.", ["and", "but", "because"], "מוסיפים עוד דבר → and.", "Adding → and.");
g7a.mcq("The river is beautiful, ___ it's dangerous.", ["but", "and", "so"], "ניגוד → but.", "Contrast → but.", { trap: "lw-but-and" });
g7a.mcq("Do you want lemon ___ pepper?", ["or", "and", "but"], "בחירה → or.", "A choice → or.");
g7a.mcq("I'm hungry ___ I didn't eat lunch.", ["because", "so", "or"], "סיבה → because.", "Reason → because.", { trap: "lw-so-because" });
g7a.mcq("It was late, ___ we went home.", ["so", "because", "or"], "תוצאה → so.", "Result → so.", { trap: "lw-so-because" });
g7a.bank("My team won ___ we played well.", ["because", "so", "but"], "סיבה → because.", "Reason → because.");
g7a.bank("We have a test tomorrow, ___ I'm studying now.", ["so", "because", "or"], "תוצאה → so.", "Result → so.");
g7a.bank("She can sing, ___ she can't dance.", ["but", "and", "or"], "ניגוד → but.", "Contrast → but.", { allow: ["dance"] });
g7a.order("I stayed home because I was sick.", "תוצאה + because + סיבה.", "result + because + reason.", { allow: ["sick"] });
g7a.order("Is the meal hot or cold?", "בחירה → or.", "Choice → or.");
g7a.sort(W, [["I like tea … coffee.", "and"], ["It's small, … it's nice.", "but"], ["Tea … coffee?", "or"], ["It rained, … we stayed home.", "so"], ["I'm tired … I worked a lot.", "because"]], "and מוסיף, but ניגוד, or בחירה, so תוצאה, because סיבה.", "and adds, but contrasts, or chooses, so = result, because = reason.", { allow: ["tea", "rained"] });
g7a.match([["I'm cold", "because I forgot my coat."], ["It was dark,", "so we turned on the light."], ["He's tall,", "but his brother is short."], ["Would you like tea", "or coffee?"]], "because + סיבה, so + תוצאה, but + ניגוד, or + בחירה.", "because, so, but, or.", { allow: ["forgot", "coat", "turned", "tall", "short", "tea"] });

const g7b = itemSet(T, "lw", 2, 7);
g7b.type("I didn't go to the club ___ I was tired.", "because / so", "because", "סיבה (הייתי עייף) → because.", "Reason → because.", { trap: "lw-so-because" });
g7b.type("The test was easy, ___ everyone passed.", "because / so", "so", "תוצאה (כולם עברו) → so.", "Result → so.", { allow: ["passed"] });
g7b.type("I don't like salt ___ pepper.", "and / or", "or", "בשלילה → or.", "In negatives → or.", { trap: "lw-neg-and" });
g7b.type("We stayed inside because ___ the danger.", "of", "of", "לפני שם עצם → because of.", "Before a noun → because of.", { trap: "lw-because-of", allow: ["inside"] });
g7b.mcq("The theater is old, ___ it's very beautiful.", ["but", "so", "because"], "ניגוד → but.", "Contrast → but.");
g7b.fix("I was tired, *because I went to bed early.", ["so"], "תוצאה (הלכתי לישון) → so.", "Result → so.", { trap: "lw-so-because" });
g7b.fix("I don't eat meat *and fish.", ["or"], "בשלילה → or.", "In negatives → or.", { trap: "lw-neg-and" });
g7b.fix("It was sunny, *and it was cold.", ["but"], "ניגוד (שמש אבל קר) → but.", "Contrast → but.", { trap: "lw-but-and", allow: ["sunny"] });
g7b.transform("I was hungry. I made a sandwich.", "Join with 'so'.", "חברו עם so", ["I was hungry, so I made a sandwich.", "I was hungry so I made a sandwich."], "סיבה, so + תוצאה.", "reason, so + result.", { allow: ["sandwich"] });
g7b.transform("We didn't swim. The river was dangerous.", "Join with 'because'.", "חברו עם because", ["We didn't swim because the river was dangerous."], "תוצאה + because + סיבה.", "result + because + reason.");
g7b.order("It was raining, so we stayed home.", "סיבה, so + תוצאה.", "reason, so + result.", { allow: ["raining"] });
g7b.cloze("A day at the village", "We went to the village {1} we wanted to see the river. It was hot, {2} we swam. I wanted to climb the mountain, {3} it was dangerous. Do you want to come with us next time, {4} do you prefer to stay home?", [["because / so", "because"], ["because / so", "so"], ["but / and", "but"], ["or / and", "or"]], "because – סיבה, so – תוצאה, but – ניגוד, or – בחירה.", "because / so / but / or.", { allow: ["climb"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "lw", 1, 8);
g8a.mcq("I can play the drums ___ the guitar.", ["and", "but", "because"], "מוסיפים עוד דבר → and.", "Adding → and.");
g8a.mcq("The café is small, ___ the food is amazing.", ["but", "and", "so"], "ניגוד → but.", "Contrast → but.", { trap: "lw-but-and" });
g8a.mcq("Do you want to cook ___ order pizza?", ["or", "and", "but"], "בחירה → or.", "A choice → or.", { allow: ["order", "pizza"] });
g8a.mcq("We were late ___ there was a traffic jam.", ["because", "so", "or"], "סיבה → because.", "Reason → because.", { trap: "lw-so-because" });
g8a.mcq("The concert was sold out, ___ we watched it online.", ["so", "because", "or"], "תוצאה → so.", "Result → so.", { trap: "lw-so-because" });
g8a.bank("He apologized ___ he was rude.", ["because", "so", "but"], "סיבה → because.", "Reason → because.");
g8a.bank("The airport was closed, ___ our flight was late.", ["so", "because", "or"], "תוצאה → so.", "Result → so.");
g8a.bank("She's rich, ___ she isn't happy.", ["but", "and", "or"], "ניגוד → but.", "Contrast → but.");
g8a.order("I took a taxi because I was late.", "תוצאה + because + סיבה.", "result + because + reason.", { allow: ["taxi"] });
g8a.order("Is the museum open or closed?", "בחירה → or.", "Choice → or.");
g8a.sort(W, [["I cook … I bake.", "and"], ["It's old, … it works.", "but"], ["Bus … train?", "or"], ["It was cold, … I took a jacket.", "so"], ["I'm late … I missed the bus.", "because"]], "and מוסיף, but ניגוד, or בחירה, so תוצאה, because סיבה.", "and / but / or / so / because.", { allow: ["bake"] });
g8a.match([["We stayed at home", "because of the storm."], ["The tickets were cheap,", "so we bought four."], ["The movie was long,", "but it was interesting."], ["Do you want to go by bus", "or by train?"]], "because of + שם עצם, so + תוצאה, but + ניגוד, or + בחירה.", "because of / so / but / or.", { allow: ["storm"] });

const g8b = itemSet(T, "lw", 2, 8);
g8b.type("I missed the bus ___ I woke up late.", "because / so", "because", "סיבה → because.", "Reason → because.", { trap: "lw-so-because" });
g8b.type("The café was full, ___ we went somewhere else.", "because / so", "so", "תוצאה → so.", "Result → so.", { allow: ["somewhere"] });
g8b.type("He doesn't drink coffee ___ tea.", "and / or", "or", "בשלילה → or.", "In negatives → or.", { trap: "lw-neg-and", allow: ["tea"] });
g8b.type("The flight was late because ___ the weather.", "of", "of", "לפני שם עצם → because of.", "Before a noun → because of.", { trap: "lw-because-of" });
g8b.mcq("The dish was spicy, ___ I loved it.", ["but", "so", "because"], "ניגוד → but.", "Contrast → but.", { allow: ["spicy"] });
g8b.fix("The traffic was terrible, *because we were late.", ["so"], "תוצאה (איחרנו) → so.", "Result → so.", { trap: "lw-so-because" });
g8b.fix("I don't like horror movies *and action movies.", ["or"], "בשלילה → or.", "In negatives → or.", { trap: "lw-neg-and", allow: ["horror"] });
g8b.fix("We stayed inside because *the rain.", ["of the"], "לפני שם עצם → because of.", "Before a noun → because of.", { trap: "lw-because-of", allow: ["inside", "rain"] });
g8b.transform("The tickets were expensive. We didn't go.", "Join with 'so'.", "חברו עם so", ["The tickets were expensive, so we didn't go.", "The tickets were expensive so we didn't go."], "סיבה, so + תוצאה.", "reason, so + result.");
g8b.transform("She cried. She lost her phone.", "Join with 'because'.", "חברו עם because", ["She cried because she lost her phone."], "תוצאה + because + סיבה.", "result + because + reason.", { allow: ["cried", "lost"] });
g8b.order("The museum was closed, so we went to a café.", "סיבה, so + תוצאה.", "reason, so + result.");
g8b.cloze("A trip abroad", "We traveled abroad {1} my dad had a business meeting. The hotel was expensive, {2} it was very nice. It rained every day, {3} we visited museums. Next year we'll go to Rome {4} Paris – we haven't decided yet.", [["because / so", "because"], ["but / so", "but"], ["so / because", "so"], ["or / and", "or"]], "because – סיבה, but – ניגוד, so – תוצאה, or – בחירה.", "because / but / so / or.", { allow: ["meeting", "hotel", "rained", "rome", "paris"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "lw", 1, 9);
g9a.mcq("I post selfies ___ tweets every day.", ["and", "but", "because"], "מוסיפים עוד דבר → and.", "Adding → and.");
g9a.mcq("The apartment is small, ___ the view is amazing.", ["but", "and", "so"], "ניגוד → but.", "Contrast → but.", { trap: "lw-but-and", allow: ["view"] });
g9a.mcq("Should we take the elevator ___ the stairs?", ["or", "and", "but"], "בחירה → or.", "A choice → or.", { allow: ["stairs"] });
g9a.mcq("The neighbors complained ___ the music was too loud.", ["because", "so", "or"], "סיבה → because.", "Reason → because.", { trap: "lw-so-because" });
g9a.mcq("The elevator was broken, ___ we took the stairs.", ["so", "because", "or"], "תוצאה → so.", "Result → so.", { trap: "lw-so-because", allow: ["stairs"] });
g9a.bank("I borrowed his charger ___ mine was broken.", ["because", "so", "but"], "סיבה → because.", "Reason → because.", { allow: ["charger"] });
g9a.bank("It was a long marathon, ___ I was exhausted.", ["so", "because", "or"], "תוצאה → so.", "Result → so.", { allow: ["exhausted"] });
g9a.bank("She's a vegetarian, ___ she eats fish.", ["but", "and", "or"], "ניגוד → but.", "Contrast → but.");
g9a.order("We left early because the wedding was far away.", "תוצאה + because + סיבה.", "result + because + reason.");
g9a.order("Do you prefer novels or documentaries?", "בחירה → or.", "Choice → or.");
g9a.sort(W, [["I sew … I knit.", "and"], ["It's old, … it works.", "but"], ["Elevator … stairs?", "or"], ["It was late, … we left.", "so"], ["I'm tired … I worked a lot.", "because"]], "and מוסיף, but ניגוד, or בחירה, so תוצאה, because סיבה.", "and / but / or / so / because.", { allow: ["knit", "stairs"] });
g9a.match([["The match was cancelled", "because of the storm."], ["The oven was broken,", "so we ordered pizza."], ["The novel is long,", "but it's very exciting."], ["Do you want to sail", "or to dive?"]], "because of + שם עצם, so + תוצאה, but + ניגוד, or + בחירה.", "because of / so / but / or.", { allow: ["cancelled", "storm", "ordered", "pizza", "exciting"] });

const g9b = itemSet(T, "lw", 2, 9);
g9b.type("He couldn't sleep ___ the neighbors were noisy.", "because / so", "because", "סיבה → because.", "Reason → because.", { trap: "lw-so-because" });
g9b.type("The gallery was closed, ___ we went to the park.", "because / so", "so", "תוצאה → so.", "Result → so.");
g9b.type("I don't have a car ___ a bike.", "and / or", "or", "בשלילה → or.", "In negatives → or.", { trap: "lw-neg-and", allow: ["bike"] });
g9b.type("The marathon was cancelled because ___ the heat.", "of", "of", "לפני שם עצם → because of.", "Before a noun → because of.", { trap: "lw-because-of", allow: ["cancelled"] });
g9b.mcq("The documentary was long, ___ I watched all of it.", ["but", "so", "because"], "ניגוד → but.", "Contrast → but.");
g9b.fix("The oven was broken, *because we ate sandwiches.", ["so"], "תוצאה (אכלנו כריכים) → so.", "Result → so.", { trap: "lw-so-because", allow: ["sandwiches"] });
g9b.fix("She doesn't use Facebook *and Instagram.", ["or"], "בשלילה → or.", "In negatives → or.", { trap: "lw-neg-and", allow: ["facebook", "instagram"] });
g9b.fix("The flight was cancelled because *the fog.", ["of the"], "לפני שם עצם → because of.", "Before a noun → because of.", { trap: "lw-because-of", allow: ["cancelled"] });
g9b.transform("The neighbors were loud. We complained.", "Join with 'so'.", "חברו עם so", ["The neighbors were loud, so we complained.", "The neighbors were loud so we complained."], "סיבה, so + תוצאה.", "reason, so + result.");
g9b.transform("He left the party. He was bored.", "Join with 'because'.", "חברו עם because", ["He left the party because he was bored."], "תוצאה + because + סיבה.", "result + because + reason.", { allow: ["bored"] });
g9b.order("The elevator was broken, so we took the stairs.", "סיבה, so + תוצאה.", "reason, so + result.", { allow: ["stairs"] });
g9b.cloze("A firefighter's day", "Dana became a firefighter {1} she wanted to help people. The job is hard, {2} she loves it. Yesterday there was a big fire, {3} she worked twelve hours. Tomorrow she'll rest {4} visit her family.", [["because / so", "because"], ["but / so", "but"], ["so / because", "so"], ["or / but", "or"]], "because – סיבה, but – ניגוד, so – תוצאה, or – בחירה.", "because / but / so / or.");

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "lw", 3);
l3.mcq("___ it was raining, we went for a walk.", ["Although", "Because", "So"], "ניגוד בין חלקים → Although (למרות ש…).", "Contrast → Although.", { allow: ["raining", "walk"] });
l3.mcq("The hotel was nice. ___, it was very expensive.", ["However", "Because", "So"], "ניגוד בתחילת משפט חדש → However.", "Contrast, new sentence → However.", { allow: ["hotel"] });
l3.type("I left early ___ I wouldn't miss the train.", "so that", "so that", "כדי ש… → so that.", "Purpose → so that.");
l3.type("You can ___ take the bus or walk.", "either", "either", "שימו לב: either … or.", "either … or.");
l3.fix("*Because the rain, the game was cancelled.", ["Because of"], "שימו לב: לפני שם עצם → Because of.", "Before a noun → Because of.", { trap: "lw-because-of", allow: ["rain", "cancelled"] });
l3.fix("Both my brother *or my sister play the piano.", ["and"], "שימו לב: both … and.", "both … and.", { allow: ["piano"] });
l3.mcq("Although it was late, ___ working.", ["we kept", "but we kept", "so we kept"], "אחרי although לא מוסיפים but או so.", "No but / so after although.");
l3.transform("It was cold. We went swimming.", "Join with 'Although'.", "חברו עם Although", ["Although it was cold, we went swimming.", "We went swimming although it was cold."], "Although + ניגוד, משפט ראשי.", "Although + clause, main clause.");
l3.transform("The phone is cheap. It's very slow.", "Join with 'However' (two sentences).", "חברו עם However (שני משפטים)", ["The phone is cheap. However, it's very slow.", "The phone is cheap. However, it is very slow."], "משפט. However, משפט.", "Sentence. However, sentence.");
l3.sort(["✓ Correct", "✗ Wrong"], [["Although he was tired, he finished.", "✓ Correct"], ["Although he was tired, but he finished.", "✗ Wrong"], ["We stayed home because of the rain.", "✓ Correct"], ["We stayed home because the rain.", "✗ Wrong"], ["I don't like tea or coffee.", "✓ Correct"], ["I was hungry because I ate.", "✗ Wrong"]], "התיקונים: בלי but · because of · so I ate.", "Fixes: no but · because of · so I ate.", { allow: ["rain", "tea"] });
l3.cloze("A difficult decision", "{1} the job was far from home, Maya took it {2} the salary was good. {3}, after a month she was very tired. She talked to her boss {4} she could work from home on Fridays.", [["although", "Although"], ["because", "because"], ["however", "However"], ["so that", "so that"]], "Although – למרות, because – סיבה, However – אבל (משפט חדש), so that – כדי ש.", "Although / because / However / so that.", { allow: ["salary", "boss"] });
l3.write("Write about a choice you made recently. Use because, so, but and although.", "כתבו על החלטה שקיבלתם לאחרונה. השתמשו ב-because, so, but ו-although.", "I joined the drama club because I love acting. Although I was shy at first, I made friends quickly. The rehearsals are long, but they're fun, so I'm happy with my choice.", "because – סיבה, so – תוצאה, but / although – ניגוד.", "because / so / but / although.");

export const linkingWordsItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
