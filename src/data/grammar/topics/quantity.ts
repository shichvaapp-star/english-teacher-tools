import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: DETERMINERS: Quantity (some / any / much / many / a lot of / a few / a little).

export const quantityTopic: GrammarTopic = {
  id: "quantity",
  group: "nouns",
  title: "some / any / much / many",
  titleHe: "כמויות – some, any, much, many",
  bandRefs: ["DETERMINERS: Quantity"],
  grades: { 7: "evolving", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "some – במשפט חיובי", en: "some – in positive sentences", examples: ["I have **some** apples.", "There is **some** milk."] },
        { he: "any – בשלילה ובשאלה", en: "any – in negatives and questions", examples: ["I don't have **any** money.", "Do you have **any** pets?"] },
        { he: "many + רבים (ספירים)", en: "many + plural (countable)", examples: ["**many** friends", "**many** books"] },
        { he: "much + לא ספירים", en: "much + uncountable", examples: ["**much** water", "**much** time"] },
      ],
      form: [
        { kind: "affirmative", pattern: "some + plural / uncountable", example: "We need some eggs." },
        { kind: "negative", pattern: "not … any + plural / uncountable", example: "There isn't any bread." },
        { kind: "question", pattern: "How many + plural? / How much + uncountable?", example: "How much milk do we have?" },
      ],
      timeWords: ["some", "any", "many", "much", "a lot of"],
    },
    2: {
      points: [
        { he: "a lot of / lots of – לשניהם", en: "a lot of / lots of – with both", examples: ["**a lot of** friends", "**a lot of** water"] },
        { he: "a few + רבים, a little + לא ספירים", en: "a few + plural, a little + uncountable", examples: ["**a few** apples", "**a little** sugar"] },
        { he: "Would you like some…? – הצעה עם some", en: "Offers use some: Would you like some…?", examples: ["Would you like **some** tea?"] },
        { he: "במשפט חיובי – a lot of עדיף על much", en: "In positives, a lot of sounds better than much", examples: ["I have **a lot of** time.", "✗ I have much time. (less natural)"] },
      ],
      form: [
        { kind: "affirmative", pattern: "a few + plural / a little + uncountable", example: "I have a few friends and a little money." },
        { kind: "question", pattern: "Would you like some …?", example: "Would you like some cake?" },
      ],
      timeWords: ["a lot of", "lots of", "a few", "a little", "How many", "How much"],
    },
    3: {
      points: [
        { he: "few / little (בלי a) = מעט מדי", en: "few / little (no a) = not enough", examples: ["**Few** people came. (sad)", "**A few** people came. (some)"] },
        { he: "יותר מדי: too much / too many. מספיק: enough", en: "too much / too many / enough", examples: ["**too much** sugar", "**too many** cars", "**enough** time"] },
        { he: "no / none = אף לא", en: "no / none", examples: ["There's **no** milk.", "**None** of my friends came."] },
        { he: "משהו / כלום: something, anything, nothing", en: "something / anything / nothing", examples: ["I want **something** to eat.", "I didn't buy **anything**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "too much + uncountable / too many + plural", example: "There's too much noise." },
        { kind: "affirmative", pattern: "(not) enough + noun", example: "We don't have enough chairs." },
      ],
      timeWords: ["too much", "too many", "enough", "few", "little", "none"],
    },
  },
  traps: [
    { id: "qt-many-much", wrong: "How much brothers do you have?", right: "How many brothers do you have?", whyHe: "brothers – ספירים → many.", whyEn: "Countable → many." },
    { id: "qt-much-many", wrong: "There isn't many water.", right: "There isn't much water.", whyHe: "water לא סופרים → much.", whyEn: "Uncountable → much." },
    { id: "qt-some-neg", wrong: "I don't have some money.", right: "I don't have any money.", whyHe: "בשלילה – any.", whyEn: "In negatives → any." },
    { id: "qt-few-little", wrong: "I have a little friends.", right: "I have a few friends.", whyHe: "friends ספירים → a few.", whyEn: "Countable → a few." },
  ],
};

const T = "quantity";

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "qt", 1, 7);
g7a.mcq("I have ___ lemons in my bag.", ["some", "any", "much"], "חיובי → some.", "Positive → some.");
g7a.mcq("There isn't ___ salt in the soup.", ["any", "some", "many"], "שלילה → any.", "Negative → any.", { trap: "qt-some-neg" });
g7a.mcq("How ___ players are on your team?", ["many", "much", "any"], "players – ספירים → many.", "Countable → many.", { trap: "qt-many-much" });
g7a.mcq("How ___ money do you need?", ["much", "many", "some"], "money – לא סופרים → much.", "Uncountable → much.");
g7a.mcq("Do you have ___ brothers or sisters?", ["any", "some", "much"], "שאלה → any.", "Question → any.");
g7a.bank("There are ___ mountains near the village.", ["many", "much", "any"], "mountains – ספירים → many.", "Countable → many.");
g7a.bank("We don't have ___ time. Hurry!", ["much", "many", "some"], "time – לא סופרים, שלילה → much.", "Uncountable → much.", { trap: "qt-much-many", allow: ["hurry"] });
g7a.bank("There are ___ of people at the theater.", ["a lot", "much", "any"], "המבנה: a lot of + people.", "a lot of + people.");
g7a.order("I need some help with my homework.", "חיובי → some.", "Positive → some.");
g7a.order("Is there any oil in the kitchen?", "שאלה → any.", "Question → any.");
g7a.sort(["many", "much"], [["friends", "many"], ["water", "much"], ["bridges", "many"], ["salt", "much"], ["players", "many"], ["money", "much"]], "ספירים → many. לא ספירים → much.", "Countable → many. Uncountable → much.");
g7a.match([["I have some", "lemons."], ["We don't have any", "salt."], ["How many", "teams are there?"], ["How much", "oil do we need?"]], "some בחיוב, any בשלילה, many + ספירים, much + לא ספירים.", "some / any / many / much.");

const g7b = itemSet(T, "qt", 2, 7);
g7b.type("There are only a ___ players on the bus.", "few / little", "few", "players – ספירים → a few.", "Countable → a few.", { trap: "qt-few-little" });
g7b.type("Can I have a ___ pepper, please?", "few / little", "little", "pepper – לא סופרים → a little.", "Uncountable → a little.");
g7b.type("Would you like ___ water?", "some / any", "some", "הצעה → some.", "Offer → some.");
g7b.type("I didn't see ___ guides at the mountain.", "some / any", "any", "שלילה → any.", "Negative → any.", { trap: "qt-some-neg" });
g7b.mcq("How ___ meals do you eat every day?", ["many", "much", "any"], "meals – ספירים → many.", "Countable → many.");
g7b.fix("How *much brothers do you have?", ["many"], "brothers – ספירים → many.", "Countable → many.", { trap: "qt-many-much" });
g7b.fix("There isn't *many water in the river.", ["much"], "water – לא סופרים → much.", "Uncountable → much.", { trap: "qt-much-many" });
g7b.fix("I don't have *some friends in this village.", ["any"], "שלילה → any.", "Negative → any.", { trap: "qt-some-neg" });
g7b.transform("I have some lemons.", "Make it negative.", "הפכו לשלילה", ["I don't have any lemons.", "I do not have any lemons."], "שלילה: some → any.", "Negative: some → any.");
g7b.transform("There are many people here.", "Use 'a lot of'.", "השתמשו ב-a lot of", ["There are a lot of people here.", "There are lots of people here."], "המבנה: a lot of + people.", "a lot of people.");
g7b.order("How much salt do you need?", "How much + לא ספיר.", "How much + uncountable.");
g7b.cloze("Before the journey", "\"Do we have {1} water?\" \"Yes, there's {2} water, but not {3}. Let's buy {4} bottles.\" \"OK. And do we have {5} food?\" \"Only a little.\"", [["some / any", "any"], ["some / any", "some"], ["much / many", "much"], ["a few / a little", ["a few", "some"]], ["some / any", "any"]], "any בשאלה, some בחיוב, much + water, a few + bottles.", "any / some / much / a few / any.", { allow: ["bottles"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "qt", 1, 8);
g8a.mcq("I bought ___ ingredients for the cake.", ["some", "any", "much"], "חיובי → some.", "Positive → some.");
g8a.mcq("There isn't ___ flour in the cupboard.", ["any", "some", "many"], "שלילה → any.", "Negative → any.", { trap: "qt-some-neg", allow: ["cupboard"] });
g8a.mcq("How ___ tickets did you buy?", ["many", "much", "any"], "tickets – ספירים → many.", "Countable → many.", { trap: "qt-many-much" });
g8a.mcq("How ___ cream do we need?", ["much", "many", "some"], "cream – לא סופרים → much.", "Uncountable → much.");
g8a.mcq("Are there ___ cafés near the airport?", ["any", "some", "much"], "שאלה → any.", "Question → any.");
g8a.bank("There were ___ cars in the traffic jam.", ["many", "much", "any"], "cars – ספירים → many.", "Countable → many.");
g8a.bank("We don't have ___ time before the flight.", ["much", "many", "some"], "time – לא סופרים → much.", "Uncountable → much.", { trap: "qt-much-many" });
g8a.bank("There were ___ of actors on the stage.", ["a lot", "much", "any"], "המבנה: a lot of + actors.", "a lot of + actors.");
g8a.order("I'd like some cream in my coffee.", "חיובי → some.", "Positive → some.");
g8a.order("Is there any traffic on the road?", "שאלה → any.", "Question → any.");
g8a.sort(["many", "much"], [["tickets", "many"], ["flour", "much"], ["actors", "many"], ["traffic", "much"], ["coins", "many"], ["cream", "much"]], "ספירים → many. לא ספירים → much.", "Countable → many. Uncountable → much.");
g8a.match([["I bought some", "tickets."], ["There isn't any", "traffic."], ["How many", "concerts did you see?"], ["How much", "flour do we need?"]], "שימו לב: some / any / many / much.", "some / any / many / much.");

const g8b = itemSet(T, "qt", 2, 8);
g8b.type("There were only a ___ people at the concert.", "few / little", "few", "people – ספירים → a few.", "Countable → a few.", { trap: "qt-few-little" });
g8b.type("Add a ___ sugar to the cake.", "few / little", "little", "sugar – לא סופרים → a little.", "Uncountable → a little.", { allow: ["sugar"] });
g8b.type("Would you like ___ cake?", "some / any", "some", "הצעה → some.", "Offer → some.");
g8b.type("We didn't buy ___ souvenirs abroad.", "some / any", "any", "שלילה → any.", "Negative → any.", { trap: "qt-some-neg", allow: ["souvenirs"] });
g8b.mcq("How ___ coffee do you drink every day?", ["much", "many", "any"], "coffee – לא סופרים → much.", "Uncountable → much.");
g8b.fix("How *much tickets do you need?", ["many"], "tickets – ספירים → many.", "Countable → many.", { trap: "qt-many-much" });
g8b.fix("There isn't *many traffic today.", ["much"], "traffic – לא סופרים → much.", "Uncountable → much.", { trap: "qt-much-many" });
g8b.fix("We don't have *some flour left.", ["any"], "שלילה → any.", "Negative → any.", { trap: "qt-some-neg", allow: ["left"] });
g8b.transform("We have some ingredients.", "Make it negative.", "הפכו לשלילה", ["We don't have any ingredients.", "We do not have any ingredients."], "שלילה: some → any.", "Negative: some → any.");
g8b.transform("There are many tourists here.", "Use 'a lot of'.", "השתמשו ב-a lot of", ["There are a lot of tourists here.", "There are lots of tourists here."], "המבנה: a lot of + tourists.", "a lot of tourists.", { allow: ["tourists"] });
g8b.order("How many people came to the party?", "How many + ספירים ברבים.", "How many + plural.");
g8b.cloze("Baking a cake", "\"Do we have {1} eggs?\" \"Yes, but only {2}. We need {3} more.\" \"And sugar?\" \"There's a {4} sugar, but not {5}.\"", [["some / any", "any"], ["a few / a little", "a few"], ["some / any", "some"], ["few / little", "little"], ["much / many", "much"]], "any בשאלה, a few + eggs, some בחיוב, a little + sugar, much + sugar.", "any / a few / some / little / much.", { allow: ["eggs", "sugar", "baking"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "qt", 1, 9);
g9a.mcq("I posted ___ selfies from the wedding.", ["some", "any", "much"], "חיובי → some.", "Positive → some.");
g9a.mcq("There isn't ___ furniture in the new apartment.", ["any", "some", "many"], "שלילה → any.", "Negative → any.", { trap: "qt-some-neg" });
g9a.mcq("How ___ novels have you read this year?", ["many", "much", "any"], "novels – ספירים → many.", "Countable → many.", { trap: "qt-many-much" });
g9a.mcq("How ___ equipment do the firefighters carry?", ["much", "many", "some"], "equipment – לא סופרים → much.", "Uncountable → much.");
g9a.mcq("Are there ___ dolphins near the island?", ["any", "some", "much"], "שאלה → any.", "Question → any.");
g9a.bank("There are ___ towers in the old city.", ["many", "much", "any"], "towers – ספירים → many.", "Countable → many.");
g9a.bank("We don't have ___ space in the elevator.", ["much", "many", "some"], "space – לא סופרים → much.", "Uncountable → much.", { trap: "qt-much-many" });
g9a.bank("There were ___ of runners in the marathon.", ["a lot", "much", "any"], "המבנה: a lot of + runners.", "a lot of + runners.", { allow: ["runners"] });
g9a.order("I need some advice about the interview.", "חיובי → some.", "Positive → some.");
g9a.order("Is there any space for my bag?", "שאלה → any.", "Question → any.");
g9a.sort(["many", "much"], [["novels", "many"], ["furniture", "much"], ["towers", "many"], ["equipment", "much"], ["selfies", "many"], ["advice", "much"]], "ספירים → many. לא ספירים → much.", "Countable → many. Uncountable → much.");
g9a.match([["I read some", "articles."], ["There isn't any", "furniture."], ["How many", "floors does it have?"], ["How much", "advice did she give?"]], "שימו לב: some / any / many / much.", "some / any / many / much.", { allow: ["floors"] });

const g9b = itemSet(T, "qt", 2, 9);
g9b.type("Only a ___ neighbors came to the meeting.", "few / little", "few", "neighbors – ספירים → a few.", "Countable → a few.", { trap: "qt-few-little", allow: ["meeting"] });
g9b.type("Can you give me a ___ advice?", "few / little", "little", "advice – לא סופרים → a little.", "Uncountable → a little.");
g9b.type("Would you like ___ help with the housework?", "some / any", "some", "הצעה → some.", "Offer → some.");
g9b.type("I didn't find ___ mistakes in your article.", "some / any", "any", "שלילה → any.", "Negative → any.", { trap: "qt-some-neg", allow: ["mistakes"] });
g9b.mcq("How ___ furniture did you buy?", ["much", "many", "any"], "furniture – לא סופרים → much.", "Uncountable → much.");
g9b.fix("How *much floors does the tower have?", ["many"], "floors – ספירים → many.", "Countable → many.", { trap: "qt-many-much", allow: ["floors"] });
g9b.fix("There isn't *many equipment in the lab.", ["much"], "equipment – לא סופרים → much.", "Uncountable → much.", { trap: "qt-much-many" });
g9b.fix("I don't have *some selfies with her.", ["any"], "שלילה → any.", "Negative → any.", { trap: "qt-some-neg" });
g9b.transform("We bought some furniture.", "Make it negative.", "הפכו לשלילה", ["We didn't buy any furniture.", "We did not buy any furniture."], "שלילה: some → any.", "Negative: some → any.");
g9b.transform("There were many guests at the wedding.", "Use 'a lot of'.", "השתמשו ב-a lot of", ["There were a lot of guests at the wedding.", "There were lots of guests at the wedding."], "המבנה: a lot of + guests.", "a lot of guests.", { allow: ["guests"] });
g9b.order("How much time do we have before the interview?", "How much + לא ספיר.", "How much + uncountable.");
g9b.cloze("Moving day", "\"Do we have {1} boxes left?\" \"Only {2}. We need {3} more.\" \"And is there {4} space in the truck?\" \"Not {5}. Let's make two trips.\"", [["some / any", "any"], ["a few / a little", "a few"], ["some / any", "some"], ["some / any", "any"], ["much / many", "much"]], "any בשאלה, a few + boxes, some בחיוב, much + space.", "any / a few / some / any / much.", { allow: ["boxes", "truck", "trips"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "qt", 3);
l3.mcq("___ people came to the party, so it was a bit boring.", ["Few", "A few", "Many"], "few (בלי a) = מעט מדי, משהו שלילי.", "few = not enough.", { allow: ["boring"] });
l3.mcq("There's ___ noise here. I can't think!", ["too much", "too many", "enough"], "noise – לא סופרים, יותר מדי → too much.", "Uncountable, excess → too much.");
l3.type("We don't have ___ chairs for everyone.", "enough", "enough", "לא מספיק → not enough.", "not enough.");
l3.type("___ of my friends came. Nobody!", "none / no", "None", "None of = אף אחד מ…", "None of.");
l3.fix("There are too *much cars in the city.", ["many"], "cars – ספירים → too many.", "Countable → too many.", { trap: "qt-many-much" });
l3.fix("I have a *little friends here, so I'm not lonely.", ["few"], "friends ספירים → a few.", "Countable → a few.", { trap: "qt-few-little", allow: ["lonely"] });
l3.fix("I didn't buy *nothing at the market.", ["anything"], "שלילה אחת: didn't + anything.", "One negative: didn't + anything.", { allow: ["market"] });
l3.transform("There isn't any milk.", "Say it with 'no'.", "אמרו את זה עם no", ["There is no milk.", "There's no milk."], "שימו לב: not any = no.", "not any = no.");
l3.transform("There is a lot of sugar in this cake. It's not healthy.", "Say it with 'too much'.", "אמרו את זה עם too much", ["There is too much sugar in this cake.", "There's too much sugar in this cake."], "יותר מדי + לא ספיר → too much.", "too much sugar.", { allow: ["sugar"] });
l3.sort(["✓ Correct", "✗ Wrong"], [["How many friends do you have?", "✓ Correct"], ["How much friends do you have?", "✗ Wrong"], ["There's too much traffic.", "✓ Correct"], ["I don't have some time.", "✗ Wrong"], ["A few students came.", "✓ Correct"], ["There isn't many water.", "✗ Wrong"]], "התיקונים: How many · any time · much water.", "Fixes: How many · any time · much water.");
l3.cloze("A crowded city", "There are {1} cars in my city and {2} noise. There aren't {3} parks, and there's {4} space for kids to play. We need {5} green places!", [["too much / too many", "too many"], ["too much / too many", "too much"], ["enough / much", ["enough", "many"]], ["little / few", "little"], ["much / more", "more"]], "המבנה: too many + cars, too much + noise, enough parks, little + space.", "too many / too much / enough / little / more.", { allow: ["crowded", "green", "places"] });
l3.write("Describe your fridge or school bag. Use some, any, a lot of, a few, a little and How much / How many.", "תארו את המקרר או את התיק שלכם. השתמשו ב-some, any, a lot of, a few, a little ו-How much / How many.", "In my bag there are a few books and some pens. There isn't any food, but there's a little water in my bottle. How many pens do I need? Not too many!", "שימו לב: some / any / a lot of / a few / a little.", "some / any / a lot of / a few / a little.");

export const quantityItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
