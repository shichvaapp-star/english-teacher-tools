import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: ADJECTIVES: Noun phrases – describing multiple qualities of a person, place or thing.

export const adjectiveOrderTopic: GrammarTopic = {
  id: "adjective-order",
  group: "adjectives",
  title: "Adjectives (position & order)",
  titleHe: "תארים – מיקום וסדר",
  bandRefs: ["ADJECTIVES: Noun phrases", "NOUNS: Phrases"],
  grades: { 7: "evolving", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "התואר בא לפני שם העצם (הפוך מעברית)", en: "The adjective comes before the noun", examples: ["a **big** house", "✗ a house big"] },
        { he: "לתואר אין רבים – בלי s", en: "Adjectives have no plural", examples: ["two **big** dogs", "✗ two bigs dogs"] },
        { he: "אחרי be – התואר בא לבד", en: "After be – the adjective alone", examples: ["The house is **big**.", "My dogs are **friendly**."] },
        { he: "a / an לפי התואר", en: "a / an goes with the adjective's sound", examples: ["**an** old car", "**a** new car"] },
      ],
      form: [
        { kind: "affirmative", pattern: "a / an + adjective + noun", example: "an interesting book" },
        { kind: "affirmative", pattern: "noun + be + adjective", example: "The book is interesting." },
      ],
      timeWords: ["big", "small", "old", "new", "beautiful"],
    },
    2: {
      points: [
        { he: "כמה תארים: דעה → גודל → גיל → צבע", en: "Several adjectives: opinion → size → age → color", examples: ["a **beautiful big old** house", "a **small red** car"] },
        { he: "ed – מה אני מרגיש, ing – מה הדבר גורם", en: "-ed = how I feel; -ing = what causes it", examples: ["I'm **bored**.", "The movie is **boring**."] },
        { he: "שם עצם כתואר – בלי s", en: "A noun used as an adjective – no s", examples: ["a **ten-year-old** boy", "a **bus** station"] },
        { he: "and בין שני תארים אחרי be", en: "and between two adjectives after be", examples: ["The room is **big and bright**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "opinion + size + age + color + noun", example: "a lovely little old house" },
        { kind: "affirmative", pattern: "I'm + -ed / it's + -ing", example: "I'm excited. It's exciting." },
      ],
      timeWords: ["interesting / interested", "boring / bored", "exciting / excited"],
    },
    3: {
      points: [
        { he: "סדר: דעה, גודל, גיל, צורה, צבע, מקור, חומר", en: "Order: opinion, size, age, shape, color, material", examples: ["a **nice small round Italian wooden** table"] },
        { he: "תואר + פועל: look, feel, sound, taste", en: "Adjectives after look / feel / sound / taste", examples: ["You **look tired**.", "It **tastes good**."] },
        { he: "so + תואר / such a + תואר + שם", en: "so + adjective / such a + adjective + noun", examples: ["It's **so** hot.", "It's **such a** hot day."] },
        { he: "תואר + enough / too + תואר", en: "too + adjective / adjective + enough", examples: ["It's **too** big.", "It's not big **enough**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "such a / an + adjective + noun", example: "She's such a kind person." },
        { kind: "affirmative", pattern: "adjective + enough / too + adjective", example: "He's old enough to drive." },
      ],
      timeWords: ["so", "such", "too", "enough", "look", "sound"],
    },
  },
  traps: [
    { id: "ao-after", wrong: "I have a car red.", right: "I have a red car.", whyHe: "באנגלית התואר לפני שם העצם (בעברית אחרי).", whyEn: "Adjective before the noun." },
    { id: "ao-plural", wrong: "They are goods friends.", right: "They are good friends.", whyHe: "לתואר אין רבים.", whyEn: "Adjectives have no plural." },
    { id: "ao-ed-ing", wrong: "I'm boring in class.", right: "I'm bored in class.", whyHe: "מה אני מרגיש → ed (bored).", whyEn: "How I feel → -ed." },
    { id: "ao-order", wrong: "a red big ball", right: "a big red ball", whyHe: "גודל לפני צבע.", whyEn: "Size before color." },
    { id: "ao-years", wrong: "a ten-years-old boy", right: "a ten-year-old boy", whyHe: "בתוך תואר – year בלי s.", whyEn: "No s inside a compound adjective." },
  ],
};

const T = "adjective-order";

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "ao", 1, 7);
g7a.mcq("We live in a ___.", ["small village", "village small", "smalls village"], "התואר לפני שם העצם.", "Adjective before the noun.", { trap: "ao-after" });
g7a.mcq("They are ___ friends.", ["good", "goods", "a good"], "לתואר אין רבים.", "No plural on adjectives.", { trap: "ao-plural" });
g7a.mcq("The river is ___.", ["dangerous", "a dangerous", "dangerouses"], "אחרי be – התואר לבד.", "After be → adjective alone.");
g7a.mcq("It's ___ old bridge.", ["an", "a", "—"], "old מתחיל בתנועה → an.", "Vowel sound → an.");
g7a.mcq("I have two ___.", ["new bowls", "news bowls", "bowls new"], "תואר לפני שם עצם, בלי s.", "Adjective first, no s.", { trap: "ao-plural" });
g7a.bank("She has a ___ voice.", ["lovely", "lovelies", "voice lovely"], "התואר לפני voice.", "Adjective before voice.");
g7a.bank("The mountains are very ___.", ["high", "highs", "a high"], "אחרי be – התואר לבד.", "After be → adjective alone.", { allow: ["high"] });
g7a.bank("It was a ___ journey.", ["long", "longs", "journey long"], "התואר לפני journey.", "Adjective before journey.");
g7a.order("We saw a beautiful river.", "a + תואר + שם עצם.", "a + adjective + noun.");
g7a.order("My brother has a big black dog.", "גודל (big) לפני צבע (black).", "size before color.", { trap: "ao-order" });
g7a.sort(["✓ Correct", "✗ Wrong"], [["a big team", "✓ Correct"], ["a team big", "✗ Wrong"], ["two old bridges", "✓ Correct"], ["two olds bridges", "✗ Wrong"], ["The river is wide.", "✓ Correct"], ["The river is a wide.", "✗ Wrong"]], "תואר לפני שם עצם, בלי s, ואחרי be לבד.", "Adjective first, no s; alone after be.");
g7a.match([["a cold", "meal"], ["an amazing", "journey"], ["a wide", "river"], ["a dangerous", "mountain"]], "תואר + שם עצם.", "Adjective + noun.");

const g7b = itemSet(T, "ao", 2, 7);
g7b.type("The movie was very ___. I fell asleep.", "bore", "boring", "מה הסרט גורם → ing: boring.", "What causes it → boring.", { trap: "ao-ed-ing", allow: ["asleep", "bore"] });
g7b.type("I was very ___ after the journey.", "tire", "tired", "מה אני מרגיש → ed: tired.", "How I feel → tired.", { trap: "ao-ed-ing", allow: ["tire"] });
g7b.type("He's a ___ boy. (he is 12)", "12 / year / old", ["twelve-year-old", "12-year-old"], "בתוך תואר – year בלי s.", "No s: twelve-year-old.", { trap: "ao-years" });
g7b.type("The guide is ___ and helpful.", "friend", "friendly", "תואר: friendly.", "Adjective: friendly.", { allow: ["helpful"] });
g7b.mcq("I have a ___ ball.", ["big red", "red big", "reds big"], "גודל לפני צבע: big red.", "Size before color.", { trap: "ao-order" });
g7b.mcq("We stayed in ___ near the river.", ["a small house", "a house small", "a smalls house"], "התואר לפני house – a small house.", "The adjective goes before the noun.", { trap: "ao-after" });
g7b.fix("They are *nices people.", ["nice"], "לתואר אין רבים.", "No plural on adjectives.", { trap: "ao-plural" });
g7b.fix("I'm *interesting in history.", ["interested"], "מה אני מרגיש → interested.", "How I feel → interested.", { trap: "ao-ed-ing" });
g7b.transform("The village is small.", "Put the adjective before the noun: 'It's a …'", "שימו את התואר לפני שם העצם: It's a …", ["It's a small village.", "It is a small village."], "המבנה: a + small + village.", "a small village.");
g7b.transform("I have a dog. It is big and black.", "Say it in one sentence.", "אמרו את זה במשפט אחד", ["I have a big black dog."], "גודל לפני צבע: big black dog.", "big black dog.", { trap: "ao-order" });
g7b.order("It was an amazing and dangerous journey.", "an + תואר + and + תואר + שם עצם.", "an + adj + and + adj + noun.");
g7b.cloze("My village", "I live in a {1} village. There's a {2} river and a {3} bridge. The people are {4} and the food is {5}!", [["small", "small"], ["wide", "wide"], ["old / an", "old"], ["friendly", "friendly"], ["amazing", "amazing"]], "תואר לפני שם עצם, ואחרי be – לבד.", "Adjective before the noun; alone after be.");

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "ao", 1, 8);
g8a.mcq("We ate at a ___.", ["small café", "café small", "smalls café"], "התואר לפני שם העצם.", "Adjective before the noun.", { trap: "ao-after" });
g8a.mcq("They are ___ actors.", ["famous", "famouses", "a famous"], "לתואר אין רבים.", "No plural on adjectives.", { trap: "ao-plural", allow: ["famous", "famouses"] });
g8a.mcq("The concert was ___.", ["amazing", "an amazing", "amazings"], "אחרי be – התואר לבד.", "After be → adjective alone.");
g8a.mcq("It's ___ expensive camera.", ["an", "a", "—"], "expensive מתחיל בתנועה → an.", "Vowel sound → an.");
g8a.mcq("I bought two ___.", ["warm jackets", "warms jackets", "jackets warm"], "תואר לפני שם עצם, בלי s.", "Adjective first, no s.", { trap: "ao-plural" });
g8a.bank("She cooked a ___ dish.", ["traditional", "traditionals", "dish traditional"], "התואר לפני dish.", "Adjective before dish.");
g8a.bank("The traffic was ___.", ["terrible", "terribles", "a terrible"], "אחרי be – התואר לבד.", "After be → adjective alone.");
g8a.bank("It was a ___ adventure.", ["great", "greats", "adventure great"], "התואר לפני adventure.", "Adjective before adventure.");
g8a.order("We visited a beautiful island.", "a + תואר + שם עצם.", "a + adjective + noun.");
g8a.order("She bought a lovely little camera.", "דעה (lovely) לפני גודל (little).", "opinion before size.", { trap: "ao-order" });
g8a.sort(["✓ Correct", "✗ Wrong"], [["a loud concert", "✓ Correct"], ["a concert loud", "✗ Wrong"], ["two rich businessmen", "✓ Correct"], ["two richs businessmen", "✗ Wrong"], ["The dish is spicy.", "✓ Correct"], ["The dish is a spicy.", "✗ Wrong"]], "תואר לפני שם עצם, בלי s, ואחרי be לבד.", "Adjective first, no s; alone after be.", { allow: ["businessmen", "richs", "spicy"] });
g8a.match([["a traditional", "dish"], ["an expensive", "ticket"], ["a loud", "concert"], ["a huge", "factory"]], "תואר + שם עצם.", "Adjective + noun.");

const g8b = itemSet(T, "ao", 2, 8);
g8b.type("The game was really ___. Everyone was screaming!", "excite", "exciting", "מה המשחק גורם → exciting.", "What causes it → exciting.", { trap: "ao-ed-ing", allow: ["screaming", "excite"] });
g8b.type("We were so ___ about the trip.", "excite", "excited", "מה אנחנו מרגישים → excited.", "How we feel → excited.", { trap: "ao-ed-ing", allow: ["trip", "excite"] });
g8b.type("It was a ___ flight. (it took 5 hours)", "5 / hour / long", ["five-hour", "5-hour"], "בתוך תואר – hour בלי s.", "No s: five-hour flight.", { trap: "ao-years" });
g8b.type("The waiter was polite and ___.", "help", "helpful", "תואר: helpful.", "Adjective: helpful.", { allow: ["waiter", "polite", "helpful"] });
g8b.mcq("She wore a ___ dress.", ["beautiful long", "long beautiful", "beautifuls long"], "דעה לפני גודל: beautiful long.", "Opinion before size.", { trap: "ao-order", allow: ["dress", "wore"] });
g8b.mcq("We visited ___ last summer.", ["a beautiful island", "a island beautiful", "an island beautiful"], "התואר לפני island – a beautiful island.", "The adjective goes before the noun.", { trap: "ao-after" });
g8b.fix("They are *riches businessmen.", ["rich"], "לתואר אין רבים.", "No plural on adjectives.", { trap: "ao-plural", allow: ["businessmen", "riches"] });
g8b.fix("The lecture was so long. I was *boring.", ["bored"], "מה אני מרגיש → bored.", "How I feel → bored.", { trap: "ao-ed-ing", allow: ["lecture", "boring", "bored"] });
g8b.transform("The café is new.", "Put the adjective before the noun: 'It's a …'", "שימו את התואר לפני שם העצם: It's a …", ["It's a new café.", "It is a new café."], "המבנה: a + new + café.", "a new café.");
g8b.transform("I have a camera. It is small and black.", "Say it in one sentence.", "אמרו את זה במשפט אחד", ["I have a small black camera."], "גודל לפני צבע: small black camera.", "small black camera.", { trap: "ao-order" });
g8b.order("It was an exciting and expensive trip.", "an + תואר + and + תואר + שם עצם.", "an + adj + and + adj + noun.", { allow: ["exciting", "trip"] });
g8b.cloze("A trip abroad", "We stayed in a {1} hotel near a {2} beach. The food was {3}, and the people were {4}. We were {5} when we had to go home.", [["lovely", "lovely"], ["quiet", "quiet"], ["delicious", "delicious"], ["friendly", "friendly"], ["sad", "sad"]], "תואר לפני שם עצם, ואחרי be – לבד.", "Adjective before the noun; alone after be.", { allow: ["hotel", "beach", "delicious", "sad"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "ao", 1, 9);
g9a.mcq("We moved to a ___.", ["quiet neighborhood", "neighborhood quiet", "quiets neighborhood"], "התואר לפני שם העצם.", "Adjective before the noun.", { trap: "ao-after" });
g9a.mcq("They are ___ firefighters.", ["brave", "braves", "a brave"], "לתואר אין רבים.", "No plural on adjectives.", { trap: "ao-plural" });
g9a.mcq("The novel was ___.", ["exciting", "an exciting", "excitings"], "אחרי be – התואר לבד.", "After be → adjective alone.", { allow: ["exciting", "excitings"] });
g9a.mcq("It's ___ ancient tower.", ["an", "a", "—"], "ancient מתחיל בתנועה → an.", "Vowel sound → an.");
g9a.mcq("I read two ___.", ["long novels", "longs novels", "novels long"], "תואר לפני שם עצם, בלי s.", "Adjective first, no s.", { trap: "ao-plural" });
g9a.bank("She lives in a ___ apartment.", ["modern", "moderns", "apartment modern"], "התואר לפני apartment.", "Adjective before apartment.");
g9a.bank("The elevator is ___ again.", ["broken", "brokens", "a broken"], "אחרי be – התואר לבד.", "After be → adjective alone.");
g9a.bank("It was a ___ documentary.", ["fascinating", "fascinatings", "documentary fascinating"], "התואר לפני documentary.", "Adjective before documentary.", { allow: ["fascinating", "fascinatings"] });
g9a.order("We watched a funny documentary.", "a + תואר + שם עצם.", "a + adjective + noun.", { allow: ["funny"] });
g9a.order("She has a beautiful old ladder.", "דעה (beautiful) לפני גיל (old).", "opinion before age.", { trap: "ao-order" });
g9a.sort(["✓ Correct", "✗ Wrong"], [["an ancient statue", "✓ Correct"], ["a statue ancient", "✗ Wrong"], ["two brave firefighters", "✓ Correct"], ["two braves firefighters", "✗ Wrong"], ["The oven is hot.", "✓ Correct"], ["The oven is a hot.", "✗ Wrong"]], "תואר לפני שם עצם, בלי s, ואחרי be לבד.", "Adjective first, no s; alone after be.");
g9a.match([["an ancient", "tower"], ["a modern", "stadium"], ["a quiet", "neighborhood"], ["a brave", "firefighter"]], "תואר + שם עצם.", "Adjective + noun.");

const g9b = itemSet(T, "ao", 2, 9);
g9b.type("The documentary was really ___.", "interest", "interesting", "מה הסרט גורם → interesting.", "What causes it → interesting.", { trap: "ao-ed-ing", allow: ["interest"] });
g9b.type("I'm ___ in architecture.", "interest", "interested", "מה אני מרגיש → interested.", "How I feel → interested.", { trap: "ao-ed-ing", allow: ["architecture", "interest"] });
g9b.type("They live in a ___ building. (it has 10 floors)", "10 / floor", ["ten-floor", "10-floor", "ten-story", "ten-storey"], "בתוך תואר – floor בלי s.", "No s inside: ten-floor.", { trap: "ao-years", allow: ["building", "floor", "story", "storey"] });
g9b.type("The firefighters were brave and ___.", "care", "careful", "תואר: careful.", "Adjective: careful.", { allow: ["care"] });
g9b.mcq("She wore a ___ dress to the wedding.", ["lovely long white", "white long lovely", "long white lovely"], "דעה → גודל → צבע.", "Opinion → size → color.", { trap: "ao-order", allow: ["dress", "wore", "white"] });
g9b.mcq("We visited ___ in the city center.", ["a modern gallery", "a gallery modern", "a moderns gallery"], "התואר לפני gallery – a modern gallery.", "The adjective goes before the noun.", { trap: "ao-after", allow: ["center", "moderns"] });
g9b.fix("They are *kinds neighbors.", ["kind"], "לתואר אין רבים.", "No plural on adjectives.", { trap: "ao-plural", allow: ["kinds"] });
g9b.fix("The interview was long and I was *tiring.", ["tired"], "מה אני מרגיש → tired.", "How I feel → tired.", { trap: "ao-ed-ing", allow: ["tiring"] });
g9b.transform("The stadium is huge.", "Put the adjective before the noun: 'It's a …'", "שימו את התואר לפני שם העצם: It's a …", ["It's a huge stadium.", "It is a huge stadium."], "המבנה: a + huge + stadium.", "a huge stadium.");
g9b.transform("I have a ladder. It is long and old.", "Say it in one sentence.", "אמרו את זה במשפט אחד", ["I have a long old ladder."], "גודל לפני גיל: long old ladder.", "long old ladder.", { trap: "ao-order" });
g9b.order("It was a fascinating and emotional documentary.", "a + תואר + and + תואר + שם עצם.", "a + adj + and + adj + noun.", { allow: ["fascinating"] });
g9b.cloze("Our new neighborhood", "We moved to a {1} neighborhood. There's a {2} gallery and an {3} tower. Our neighbors are {4}, and the streets are {5} at night.", [["quiet", "quiet"], ["modern", "modern"], ["ancient", "ancient"], ["friendly", "friendly"], ["safe", "safe"]], "תואר לפני שם עצם, ואחרי be – לבד.", "Adjective before the noun; alone after be.", { allow: ["streets", "safe"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "ao", 3);
l3.mcq("She bought a ___ table.", ["beautiful round wooden", "wooden round beautiful", "round wooden beautiful"], "דעה → צורה → חומר.", "Opinion → shape → material.", { trap: "ao-order", allow: ["round", "wooden"] });
l3.mcq("It's ___ hot day!", ["such a", "so", "so a"], "such a + תואר + שם עצם.", "such a + adjective + noun.");
l3.type("You look ___. Did you sleep well?", "tire", "tired", "look + תואר: look tired.", "look + adjective.", { allow: ["tire"] });
l3.type("He isn't old ___ to drive.", "enough", "enough", "תואר + enough.", "adjective + enough.");
l3.fix("This soup tastes *well.", ["good"], "taste + תואר: tastes good.", "taste + adjective → good.");
l3.fix("It was *so a long day.", ["such"], "such a + תואר + שם עצם.", "such a + adjective + noun.");
l3.mcq("The box is ___ for all the books.", ["big enough", "enough big", "too enough big"], "תואר + enough: big enough.", "adjective + enough.", { allow: ["box"] });
l3.transform("The bag is too small. I can't put my books in it.", "Say it with 'not big enough'.", "אמרו את זה עם not big enough", ["The bag isn't big enough.", "The bag is not big enough."], "not + תואר + enough.", "not big enough.");
l3.transform("The day was so hot.", "Say it with 'such a'.", "אמרו את זה עם such a", ["It was such a hot day."], "המבנה: such a + hot + day.", "such a hot day.");
l3.sort(["✓ Correct", "✗ Wrong"], [["a big red ball", "✓ Correct"], ["a red big ball", "✗ Wrong"], ["I'm bored.", "✓ Correct"], ["I'm boring in class.", "✗ Wrong"], ["It smells nice.", "✓ Correct"], ["a ten-years-old girl", "✗ Wrong"]], "התיקונים: big red ball · I'm bored · ten-year-old.", "Fixes: big red ball · I'm bored · ten-year-old.", { allow: ["smells"] });
l3.cloze("A special gift", "For my birthday I got a {1} {2} watch. It was {3} a nice surprise! The box was {4} small to hide anything else, but I was really {5}.", [["opinion", ["beautiful", "lovely"]], ["material / color", ["silver", "gold", "black"]], ["so / such", "such"], ["too", "too"], ["excite", "excited"]], "דעה לפני צבע / חומר. such a + שם. too + תואר. excited – מה אני מרגיש.", "opinion before color; such a; too; excited.", { allow: ["silver", "gold", "box", "hide", "else", "excite", "watch"] });
l3.write("Describe your favorite place in detail. Use at least two nouns with two adjectives each, and one sentence with -ed / -ing.", "תארו בפירוט את המקום האהוב עליכם. השתמשו לפחות בשני שמות עצם עם שני תארים כל אחד, ובמשפט אחד עם ed / ing.", "My favorite place is a small old café near the sea. It has big blue windows and comfortable wooden chairs. It's never boring there, and I always feel relaxed.", "תארים לפני שם העצם בסדר הנכון. ed – הרגשה, ing – מה שגורם.", "Adjectives in order; -ed / -ing.");

export const adjectiveOrderItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
