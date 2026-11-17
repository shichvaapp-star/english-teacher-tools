import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: NOUNS: Countable (plurals, more than one of the same) + uncountable nouns.

export const pluralsCountableTopic: GrammarTopic = {
  id: "plurals-countable",
  group: "nouns",
  title: "Plurals & Countable / Uncountable",
  titleHe: "רבים, ספיר ולא ספיר",
  bandRefs: ["NOUNS: Countable"],
  grades: { 7: "accurate", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "רבים: מוסיפים s", en: "Plural: add -s", examples: ["one book → two book**s**", "a dog → three dog**s**"] },
        { he: "אחרי s, sh, ch, x מוסיפים es", en: "After s, sh, ch, x add -es", examples: ["bus → bus**es**", "box → box**es**", "watch → watch**es**"], chips: true },
        { he: "עיצור + y → ies", en: "Consonant + y → -ies", examples: ["city → cit**ies**", "baby → bab**ies**", "but: boy → boy**s**"], chips: true },
        { he: "רבים יוצאי דופן", en: "Irregular plurals", examples: ["man → **men**", "child → **children**", "foot → **feet**", "person → **people**"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "a / one + singular noun", example: "a chair, one apple" },
        { kind: "affirmative", pattern: "two / many + plural noun", example: "two chairs, many apples" },
      ],
      timeWords: ["one", "two", "many", "a lot of"],
    },
    2: {
      points: [
        { he: "יש שמות שלא סופרים: water, money, bread", en: "Uncountable nouns: water, money, bread", examples: ["some **water**", "✗ two waters", "✗ a money"] },
        { he: "לא סופרים → פועל ביחיד", en: "Uncountable → singular verb", examples: ["The money **is** on the table.", "Information **is** important."] },
        { he: "כדי לספור: a glass of, a piece of", en: "To count them: a glass of, a piece of", examples: ["a glass **of** water", "a piece **of** cake", "two bottles **of** milk"] },
        { he: "בסוף f / fe → ves", en: "f / fe → -ves", examples: ["knife → kni**ves**", "leaf → lea**ves**", "life → li**ves**"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "uncountable + is / was (no -s)", example: "The furniture is new." },
        { kind: "affirmative", pattern: "a glass / piece / bottle + of + uncountable", example: "a piece of advice" },
      ],
      timeWords: ["water", "money", "bread", "furniture", "information", "advice"],
    },
    3: {
      points: [
        { he: "שמות שתמיד ברבים: jeans, glasses, people", en: "Always plural: jeans, glasses, people", examples: ["My jeans **are** new.", "People **are** nice here."] },
        { he: "שם עצם קבוצתי: team, family", en: "Group nouns: team, family", examples: ["My family **is** big.", "The team **is** winning."] },
        { he: "news, advice, homework – תמיד ביחיד", en: "news, advice, homework – always singular", examples: ["The news **is** good.", "✗ two homeworks"] },
        { he: "אותו שם – ספיר ולא ספיר", en: "Same noun, countable and uncountable", examples: ["I'd like **a coffee**. (a cup)", "I like **coffee**. (in general)"] },
      ],
      form: [
        { kind: "affirmative", pattern: "plural-only noun + are", example: "These scissors are sharp." },
        { kind: "affirmative", pattern: "news / advice / homework + is", example: "Your advice is useful." },
      ],
      timeWords: ["news", "advice", "homework", "jeans", "people"],
    },
  },
  traps: [
    { id: "pc-no-s", wrong: "I have two brother.", right: "I have two brothers.", whyHe: "אחרי two / many – רבים עם s.", whyEn: "After two / many → plural." },
    { id: "pc-un-s", wrong: "I need some informations.", right: "I need some information.", whyHe: "information לא סופרים – בלי s.", whyEn: "information is uncountable." },
    { id: "pc-irregular", wrong: "There are three childs.", right: "There are three children.", whyHe: "child → children (יוצא דופן).", whyEn: "child → children." },
    { id: "pc-a-un", wrong: "I have a homework.", right: "I have some homework.", whyHe: "homework לא סופרים – לא a.", whyEn: "homework is uncountable – no a." },
    { id: "pc-people-is", wrong: "The people is friendly.", right: "The people are friendly.", whyHe: "people = רבים → are.", whyEn: "people is plural → are." },
  ],
};

const T = "plurals-countable";
const S = ["+ s", "+ es", "y → ies"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "pc", 1, 7);
g7a.mcq("There are two ___ near the village.", ["rivers", "river", "riveres"], "two → רבים: rivers.", "two → rivers.", { trap: "pc-no-s" });
g7a.mcq("I bought three ___.", ["lemons", "lemon", "lemones"], "three → רבים: lemons.", "three → lemons.", { trap: "pc-no-s" });
g7a.mcq("We washed all the ___.", ["bowls", "bowles", "bowl"], "המבנה: bowl + s: bowls.", "bowl → bowls.");
g7a.mcq("There are many ___ in our town.", ["churches", "churchs", "church"], "אחרי ch → es: churches.", "ch → churches.");
g7a.mcq("Our team has five ___.", ["players", "playeres", "player"], "five → רבים: players.", "five → players.", { trap: "pc-no-s" });
g7a.bank("The three ___ are playing in the park.", ["children", "childs", "childrens"], "הרבים של child הוא children.", "child → children.", { trap: "pc-irregular", allow: ["childrens"] });
g7a.bank("There were a lot of ___ at the theater.", ["people", "peoples", "persons"], "הרבים של person הוא people.", "person → people.", { trap: "pc-irregular" });
g7a.bank("I visited two ___ last summer.", ["cities", "citys", "city"], "עיצור + y → ies: cities.", "city → cities.", { allow: ["cities", "citys", "city"] });
g7a.order("There are three mountains near the village.", "There are + מספר + רבים.", "There are + number + plural.");
g7a.order("My brother has two dogs.", "two + רבים: dogs.", "two + plural.");
g7a.sort(S, [["team", "+ s"], ["bus", "+ es"], ["baby", "y → ies"], ["river", "+ s"], ["box", "+ es"], ["city", "y → ies"]], "רוב השמות + s. s / sh / ch / x → es. עיצור + y → ies.", "Most + s; s / sh / ch / x → es; consonant + y → ies.", { allow: ["box", "city"] });
g7a.match([["man", "men"], ["child", "children"], ["foot", "feet"], ["person", "people"]], "רבים יוצאי דופן.", "Irregular plurals.", { instr: "התאימו כל מילה לצורת הרבים שלה", allow: ["foot", "feet"] });

const g7b = itemSet(T, "pc", 2, 7);
g7b.type("I need some ___ for my journey.", "money", "money", "money לא סופרים – בלי s.", "money is uncountable.", { trap: "pc-un-s" });
g7b.type("The guide gave us two ___ of bread.", "piece", "pieces", "ביחיד a piece of, ברבים two pieces of.", "two pieces of.");
g7b.type("There are many ___ in the forest.", "leaf", "leaves", "f הופך ל-ves: leaves.", "leaf → leaves.", { allow: ["leaf"] });
g7b.type("All the ___ in our class are ready.", "student", "students", "רבים: students.", "Plural → students.");
g7b.mcq("The water in the river ___ cold.", ["is", "are", "were"], "water לא סופרים → is.", "Uncountable → is.");
g7b.fix("I have two *brother.", ["brothers"], "two → רבים: brothers.", "two → brothers.", { trap: "pc-no-s" });
g7b.fix("There were five *childs at the club.", ["children"], "הרבים של child הוא children.", "child → children.", { trap: "pc-irregular", allow: ["childrens"] });
g7b.fix("Can you give me some *salts?", ["salt"], "salt לא סופרים – בלי s.", "salt is uncountable.", { trap: "pc-un-s" });
g7b.transform("I have a dog.", "Change 'a' to 'three'.", "החליפו את a ב-three", ["I have three dogs."], "three + רבים: dogs.", "three dogs.");
g7b.transform("There is a bus at the station.", "Change it to 'two buses'.", "שנו ל-two buses", ["There are two buses at the station."], "המבנה: There are + two buses (es).", "There are two buses.");
g7b.order("Would you like a glass of water?", "המבנה: a glass of + water.", "a glass of + water.", { allow: ["glass"] });
g7b.cloze("At the market", "We bought two {1} of milk, a {2} of bread and three {3}. Mom also bought some {4}. It was a lot of {5}!", [["bottle", "bottles"], ["loaf / piece", ["loaf", "piece"]], ["lemon", "lemons"], ["salt", "salt"], ["money", "money"]], "ספירים ברבים: bottles, lemons. לא ספירים בלי s: salt, money.", "Countable plurals; uncountables no -s.", { allow: ["market", "bottle", "bottles", "loaf"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "pc", 1, 8);
g8a.mcq("There are three ___ in the dish.", ["ingredients", "ingredient", "ingredientes"], "three → רבים.", "three → plural.", { trap: "pc-no-s" });
g8a.mcq("I bought two ___ for the concert.", ["tickets", "ticket", "ticketes"], "two → רבים: tickets.", "two → tickets.", { trap: "pc-no-s" });
g8a.mcq("The ___ were delicious.", ["dishes", "dishs", "dish"], "אחרי sh → es: dishes.", "sh → dishes.", { allow: ["delicious"] });
g8a.mcq("There are many ___ on this island.", ["beaches", "beachs", "beach"], "אחרי ch → es: beaches.", "ch → beaches.", { allow: ["beaches", "beachs", "beach"] });
g8a.mcq("Two ___ won the competition.", ["actors", "actores", "actor"], "two → רבים: actors.", "two → actors.", { trap: "pc-no-s" });
g8a.bank("The ___ in the factory work hard.", ["men", "mans", "mens"], "הרבים של man הוא men.", "man → men.", { trap: "pc-irregular", allow: ["mans", "mens"] });
g8a.bank("A lot of ___ came to the concert.", ["people", "peoples", "persons"], "הרבים של person הוא people.", "person → people.", { trap: "pc-irregular" });
g8a.bank("We visited three ___ in Europe.", ["countries", "countrys", "country"], "עיצור + y → ies: countries.", "country → countries.", { allow: ["europe", "countries", "countrys"] });
g8a.order("The chef used five eggs.", "five + רבים: eggs.", "five + plural.", { allow: ["chef", "eggs"] });
g8a.order("We need two bottles of milk.", "המבנה: two bottles of + milk.", "two bottles of + milk.", { allow: ["bottles"] });
g8a.sort(S, [["camera", "+ s"], ["dish", "+ es"], ["country", "y → ies"], ["actor", "+ s"], ["glass", "+ es"], ["party", "y → ies"]], "רוב השמות + s. s / sh / ch / x → es. עיצור + y → ies.", "Most + s; s / sh / ch / x → es; consonant + y → ies.", { allow: ["glass"] });
g8a.match([["woman", "women"], ["tooth", "teeth"], ["mouse", "mice"], ["child", "children"]], "רבים יוצאי דופן.", "Irregular plurals.", { instr: "התאימו כל מילה לצורת הרבים שלה", allow: ["tooth", "teeth", "mouse", "mice", "woman", "women"] });

const g8b = itemSet(T, "pc", 2, 8);
g8b.type("We need some ___ for the cake.", "flour", "flour", "flour לא סופרים – בלי s.", "flour is uncountable.", { trap: "pc-un-s" });
g8b.type("Can I have two ___ of cake, please?", "piece", "pieces", "שימו לב: two pieces of cake.", "two pieces of.");
g8b.type("Be careful with the ___.", "knife", "knives", "fe הופך ל-ves: knives.", "knife → knives.", { allow: ["knife", "knives"] });
g8b.type("The ___ on the stage were amazing.", "actor", "actors", "רבים: actors.", "Plural → actors.");
g8b.mcq("The information on the website ___ wrong.", ["is", "are", "were"], "information לא סופרים → is.", "Uncountable → is.", { allow: ["website"] });
g8b.fix("I bought three *ticket for the concert.", ["tickets"], "three → רבים: tickets.", "three → tickets.", { trap: "pc-no-s" });
g8b.fix("Two *womans work in the café.", ["women"], "הרבים של woman הוא women.", "woman → women.", { trap: "pc-irregular" });
g8b.fix("I need some *informations about the flight.", ["information"], "information לא סופרים.", "information is uncountable.", { trap: "pc-un-s" });
g8b.transform("I bought a dish.", "Change 'a' to 'four'.", "החליפו את a ב-four", ["I bought four dishes."], "המבנה: four + dishes (es).", "four dishes.");
g8b.transform("There is a child in the café.", "Change it to 'three children'.", "שנו ל-three children", ["There are three children in the café."], "המבנה: There are + three children.", "There are three children.");
g8b.order("Can I have a cup of coffee, please?", "המבנה: a cup of + coffee.", "a cup of + coffee.", { allow: ["cup"] });
g8b.cloze("Shopping for a party", "For the party we need five {1} of juice, two {2} of bread and lots of {3}. We also need some {4} and a few {5} for the cake.", [["bottle", "bottles"], ["loaf / bag", ["loaves", "bags"]], ["cream", "cream"], ["sugar", "sugar"], ["egg", "eggs"]], "ספירים ברבים: bottles, eggs. לא ספירים: cream, sugar.", "Countable plurals; uncountables no -s.", { allow: ["juice", "bottle", "bottles", "loaves", "loaf", "bags", "bag", "sugar", "egg", "eggs"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "pc", 1, 9);
g9a.mcq("I read three ___ last month.", ["novels", "novel", "noveles"], "three → רבים: novels.", "three → novels.", { trap: "pc-no-s" });
g9a.mcq("The firefighters saved two ___.", ["families", "familys", "family"], "עיצור + y → ies: families.", "family → families.");
g9a.mcq("There are many ___ in this neighborhood.", ["stadiums", "stadium", "stadiumes"], "many → רבים.", "many → plural.", { trap: "pc-no-s" });
g9a.mcq("The ___ are in the kitchen.", ["boxes", "boxs", "box"], "אחרי x → es: boxes.", "x → boxes.", { allow: ["boxes", "boxs", "box"] });
g9a.mcq("Five ___ took part in the interview.", ["candidates", "candidate", "candidatees"], "five → רבים.", "five → plural.", { trap: "pc-no-s" });
g9a.bank("The ___ at the wedding were dancing.", ["people", "peoples", "persons"], "הרבים של person הוא people.", "person → people.", { trap: "pc-irregular", allow: ["dancing"] });
g9a.bank("Three ___ repaired the tower.", ["men", "mans", "mens"], "הרבים של man הוא men.", "man → men.", { trap: "pc-irregular", allow: ["mans", "mens"] });
g9a.bank("All the ___ in the gallery are beautiful.", ["statues", "statuees", "statue"], "רבים: statues.", "Plural → statues.");
g9a.order("We bought new furniture for the apartment.", "furniture לא סופרים – בלי s.", "furniture is uncountable.");
g9a.order("She posted three selfies today.", "three + רבים: selfies.", "three + plural.");
g9a.sort(S, [["novel", "+ s"], ["dress", "+ es"], ["family", "y → ies"], ["tower", "+ s"], ["match", "+ es"], ["candy", "y → ies"]], "רוב השמות + s. s / sh / ch / x → es. עיצור + y → ies.", "Most + s; s / sh / ch / x → es; consonant + y → ies.", { allow: ["dress", "candy"] });
g9a.match([["shelf", "shelves"], ["life", "lives"], ["foot", "feet"], ["person", "people"]], "רבים יוצאי דופן ו-f → ves.", "Irregular plurals and f → ves.", { instr: "התאימו כל מילה לצורת הרבים שלה", allow: ["shelf", "shelves", "foot", "feet"] });

const g9b = itemSet(T, "pc", 2, 9);
g9b.type("We bought some new ___ for the living room.", "furniture", "furniture", "furniture לא סופרים – בלי s.", "furniture is uncountable.", { trap: "pc-un-s" });
g9b.type("Can I give you a piece ___ advice?", "of", "of", "שימו לב: a piece of advice.", "a piece of advice.");
g9b.type("The firefighters saved many ___.", "life", "lives", "fe הופך ל-ves: lives.", "life → lives.");
g9b.type("The ___ of the novel are very real.", "character", "characters", "רבים: characters.", "Plural → characters.");
g9b.mcq("The equipment in the lab ___ very expensive.", ["is", "are", "were"], "equipment לא סופרים → is.", "Uncountable → is.");
g9b.fix("I translated three *article this week.", ["articles"], "three → רבים: articles.", "three → articles.", { trap: "pc-no-s" });
g9b.fix("The *peoples in my neighborhood are friendly.", ["people"], "person → people (כבר רבים).", "people is already plural.", { trap: "pc-irregular" });
g9b.fix("My teacher gave me some good *advices.", ["advice"], "advice לא סופרים – בלי s.", "advice is uncountable.", { trap: "pc-un-s" });
g9b.transform("I read a novel.", "Change 'a' to 'two'.", "החליפו את a ב-two", ["I read two novels."], "המבנה: two + novels.", "two novels.");
g9b.transform("There is a firefighter at the door.", "Change it to 'two firefighters'.", "שנו ל-two firefighters", ["There are two firefighters at the door."], "המבנה: There are + two firefighters.", "There are two firefighters.");
g9b.order("She gave me a piece of good advice.", "המבנה: a piece of + advice.", "a piece of + advice.");
g9b.cloze("Moving in", "We moved into our new apartment with all our {1}. We had twenty {2}, three {3} of books and a lot of {4}. My dad lost two {5} on the way!", [["furniture", "furniture"], ["box", "boxes"], ["shelf", "shelves"], ["equipment", "equipment"], ["key", "keys"]], "לא ספירים: furniture, equipment. רבים: boxes, shelves (f → ves), keys.", "Uncountables; plurals boxes, shelves, keys.", { allow: ["box", "boxes", "shelf", "shelves", "twenty"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "pc", 3);
l3.mcq("The news ___ very good today.", ["is", "are", "were"], "news – תמיד ביחיד → is.", "news is singular → is.");
l3.mcq("My jeans ___ too long.", ["are", "is", "be"], "jeans – תמיד ברבים → are.", "jeans is plural → are.", { allow: ["jeans"] });
l3.type("I'd like ___ coffee, please. (one cup)", "a / some", "a", "כוס אחת → a coffee.", "One cup → a coffee.");
l3.type("We have a lot of ___ tonight.", "homework", "homework", "homework לא סופרים – בלי s.", "homework is uncountable.", { trap: "pc-a-un" });
l3.fix("The people in this city *is very kind.", ["are"], "people = רבים → are.", "people is plural → are.", { trap: "pc-people-is", allow: ["kind"] });
l3.fix("I have *a homework for tomorrow.", ["some"], "homework לא סופרים – some, לא a.", "homework → some, not a.", { trap: "pc-a-un" });
l3.fix("She gave me three *advices.", ["tips"], "advice לא סופרים – three pieces of advice / tips.", "advice is uncountable.", { trap: "pc-un-s", allow: ["tips"] });
l3.transform("I drink coffee every morning.", "Make it about ordering one cup now: 'I'd like…'.", "הפכו להזמנה של כוס אחת: I'd like…", ["I'd like a coffee.", "I'd like a coffee, please.", "I would like a coffee."], "כוס אחת → a coffee.", "One cup → a coffee.");
l3.transform("The furnitures are new.", "Correct the sentence.", "תקנו את המשפט", ["The furniture is new."], "furniture לא סופרים + is.", "Uncountable + is.");
l3.sort(["✓ Correct", "✗ Wrong"], [["The news is good.", "✓ Correct"], ["I need some informations.", "✗ Wrong"], ["My family is big.", "✓ Correct"], ["There are three childs.", "✗ Wrong"], ["My jeans are new.", "✓ Correct"], ["I have a homework.", "✗ Wrong"]], "התיקונים: information · children · some homework.", "Fixes: information · children · some homework.", { allow: ["jeans"] });
l3.cloze("A busy week", "This week I have a lot of {1}. My teacher gave us useful {2}, and the {3} was that the test is easy. My {4} are worried, but the {5} in my class are calm.", [["homework", "homework"], ["advice", "advice"], ["news", "news"], ["parent", "parents"], ["person", "people"]], "לא ספירים: homework, advice, news. רבים: parents, people.", "Uncountables; plurals parents / people.", { allow: ["useful", "calm"] });
l3.write("Describe what's in your kitchen. Use at least three plurals and three uncountable nouns (with some / a lot of / a piece of).", "תארו מה יש במטבח שלכם. השתמשו לפחות בשלושה שמות ברבים ובשלושה שמות לא ספירים (עם some / a lot of / a piece of).", "In my kitchen there are two chairs and many cups. There is some bread, a lot of rice and a bottle of water.", "ספירים → רבים. לא ספירים → בלי s, עם some / a lot of.", "Countable plurals; uncountables with some / a lot of.");

export const pluralsCountableItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
