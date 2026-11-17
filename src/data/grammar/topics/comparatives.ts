import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: ADJECTIVES: Comparative (to compare and contrast).

export const comparativesTopic: GrammarTopic = {
  id: "comparatives",
  group: "adjectives",
  title: "Comparatives (bigger / more interesting)",
  titleHe: "השוואה – bigger, more interesting",
  bandRefs: ["ADJECTIVES: Comparative"],
  grades: { 7: "evolving", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "תואר קצר + er + than", en: "Short adjective + -er + than", examples: ["Dan is **taller than** Tom.", "My bag is **bigger than** yours."] },
        { he: "תואר ארוך: more + תואר + than", en: "Long adjective: more + adjective + than", examples: ["This book is **more interesting than** that one."] },
        { he: "than = מאשר", en: "than = compared with", examples: ["Haifa is smaller **than** Tel Aviv."] },
        { he: "יוצאי דופן: good → better, bad → worse", en: "Irregular: good → better, bad → worse", examples: ["good → **better**", "bad → **worse**", "far → **farther**"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "short adj + -er + than", example: "It's colder than yesterday." },
        { kind: "affirmative", pattern: "more + long adj + than", example: "It's more expensive than mine." },
      ],
      timeWords: ["than", "more", "-er", "better", "worse"],
    },
    2: {
      points: [
        { he: "כתיב: big → bigger, happy → happier, nice → nicer", en: "Spelling: big → bigger, happy → happier, nice → nicer", examples: ["bi**gger**", "happ**ier**", "nic**er**", "ho**tter**"], chips: true },
        { he: "לא אומרים more + er", en: "Never more + -er", examples: ["**bigger**", "✗ more bigger"] },
        { he: "less + תואר = פחות", en: "less + adjective = not as much", examples: ["This phone is **less expensive**."] },
        { he: "much / a lot + השוואה = הרבה יותר", en: "much / a lot + comparative", examples: ["She's **much taller** than me."] },
      ],
      form: [
        { kind: "affirmative", pattern: "much / a lot / a bit + comparative + than", example: "It's a bit warmer today." },
        { kind: "affirmative", pattern: "less + adjective + than", example: "It's less crowded than before." },
      ],
      timeWords: ["much", "a lot", "a bit", "less", "even"],
    },
    3: {
      points: [
        { he: "as … as = באותה מידה", en: "as … as = equal", examples: ["Dan is **as tall as** Tom.", "It's **not as hot as** yesterday."] },
        { he: "the … the – ככל ש… כך…", en: "the … the …", examples: ["**The more** you practice, **the better** you get."] },
        { he: "הולך ונעשה: colder and colder", en: "getting -er and -er", examples: ["It's getting **colder and colder**.", "**more and more** expensive"] },
        { he: "מילים בשתי הברות שמסתיימות ב-y: easier", en: "Two-syllable words in -y: easier, happier", examples: ["eas**ier**", "busi**er**", "narrow**er**"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "(not) as + adjective + as", example: "She's not as fast as her sister." },
        { kind: "affirmative", pattern: "The + comparative …, the + comparative …", example: "The sooner, the better." },
      ],
      timeWords: ["as … as", "not as … as", "the more …", "and more and more"],
    },
  },
  traps: [
    { id: "cm-more-er", wrong: "My house is more bigger than yours.", right: "My house is bigger than yours.", whyHe: "או more או er – לא שניהם.", whyEn: "Either more or -er, not both." },
    { id: "cm-then", wrong: "She is taller then me.", right: "She is taller than me.", whyHe: "מאשר = than (לא then).", whyEn: "than, not then." },
    { id: "cm-good", wrong: "This is gooder than that.", right: "This is better than that.", whyHe: "יוצא דופן: good → better.", whyEn: "good → better." },
    { id: "cm-long", wrong: "This book is interestinger.", right: "This book is more interesting.", whyHe: "תואר ארוך → more + תואר.", whyEn: "Long adjective → more." },
    { id: "cm-spelling", wrong: "It's hoter today.", right: "It's hotter today.", whyHe: "hot → hotter (מכפילים t).", whyEn: "Double the t: hotter." },
  ],
};

const T = "comparatives";
const S = ["-er", "more …"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "cm", 1, 7);
g7a.mcq("The river is ___ than the lake.", ["wider", "more wide", "widder"], "wide (קצר) → wider.", "Short → wider.", { trap: "cm-more-er", allow: ["lake", "widder"] });
g7a.mcq("This mountain is ___ than that one.", ["higher", "more high", "highest"], "high, ולכן higher.", "high → higher.", { allow: ["high", "higher", "highest"] });
g7a.mcq("History is ___ than math for me.", ["more interesting", "interestinger", "more interestinger"], "תואר ארוך → more interesting.", "Long → more interesting.", { trap: "cm-long" });
g7a.mcq("My team is ___ than your team.", ["better", "gooder", "more good"], "good, ולכן better.", "good → better.", { trap: "cm-good" });
g7a.mcq("Dan is taller ___ his brother.", ["than", "then", "that"], "מאשר → than.", "than.", { trap: "cm-then" });
g7a.bank("Today is ___ than yesterday.", ["colder", "more cold", "coldest"], "cold, ולכן colder.", "cold → colder.");
g7a.bank("The bridge is ___ than the road.", ["more dangerous", "dangerouser", "dangerous"], "תואר ארוך → more dangerous.", "Long → more dangerous.", { trap: "cm-long", allow: ["road"] });
g7a.bank("My meal was ___ than yours. It was terrible!", ["worse", "badder", "more bad"], "bad, ולכן worse.", "bad → worse.");
g7a.order("My sister is younger than me.", "תואר + er + than.", "adjective-er + than.");
g7a.order("This village is more beautiful than my town.", "more + תואר + than.", "more + adjective + than.");
g7a.sort(S, [["tall", "-er"], ["beautiful", "more …"], ["cold", "-er"], ["dangerous", "more …"], ["small", "-er"], ["interesting", "more …"]], "תואר קצר → er. תואר ארוך → more.", "Short → -er. Long → more.");
g7a.match([["big", "bigger"], ["good", "better"], ["happy", "happier"], ["bad", "worse"]], "צורות השוואה.", "Comparative forms.", { instr: "התאימו כל תואר לצורת ההשוואה שלו" });

const g7b = itemSet(T, "cm", 2, 7);
g7b.type("This bowl is ___ than that one.", "big", "bigger", "big → bigger (מכפילים g).", "big → bigger.", { trap: "cm-spelling" });
g7b.type("I'm ___ today than yesterday.", "happy", "happier", "y בסוף הופך ל-ier: happier.", "happy → happier.");
g7b.type("The journey was ___ than we expected.", "long", "longer", "long, ולכן longer.", "long → longer.");
g7b.type("This activity is ___ than the last one.", "exciting", "more exciting", "תואר ארוך → more exciting.", "Long → more exciting.", { trap: "cm-long", allow: ["exciting"] });
g7b.mcq("She's ___ taller than me.", ["much", "more", "very"], "הרבה יותר → much taller.", "much + comparative.");
g7b.mcq("My brother is ___ than me.", ["taller", "more taller", "more tall"], "או more או er – רק taller.", "Just taller.", { trap: "cm-more-er" });
g7b.fix("This team is *gooder than ours.", ["better"], "good, ולכן better.", "good → better.", { trap: "cm-good" });
g7b.fix("The village is smaller *then the city.", ["than"], "מאשר → than.", "than.", { trap: "cm-then" });
g7b.transform("Tom is 1.60 m. Dan is 1.70 m.", "Compare them: Dan is …", "השוו ביניהם: Dan is …", ["Dan is taller than Tom."], "המבנה: Dan + is + taller + than + Tom.", "Dan is taller than Tom.", { allow: ["m"] });
g7b.transform("The river is dangerous. The lake is not so dangerous.", "Compare with 'more … than'.", "השוו עם more … than", ["The river is more dangerous than the lake."], "שימו לב: more dangerous than.", "more dangerous than.", { allow: ["lake"] });
g7b.order("The journey was a lot longer than last year.", "a lot + השוואה + than.", "a lot + comparative + than.");
g7b.cloze("Two villages", "Our village is {1} than my friend's village, but his village is {2}. The river near his house is {3} than ours, and the food there is {4}. But I think my village is {5}!", [["small", "smaller"], ["beautiful", "more beautiful"], ["wide", "wider"], ["good", "better"], ["nice", "nicer"]], "קצר → er, ארוך → more, good → better.", "-er / more / better.");

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "cm", 1, 8);
g8a.mcq("The airport is ___ than the station.", ["bigger", "more big", "biger"], "big, ולכן bigger.", "big → bigger.", { trap: "cm-more-er" });
g8a.mcq("This camera is ___ than my old one.", ["cheaper", "more cheap", "cheapest"], "cheap, ולכן cheaper.", "cheap → cheaper.", { allow: ["cheaper", "cheap", "cheapest"] });
g8a.mcq("Paris is ___ than our city.", ["more expensive", "expensiver", "more expensiver"], "תואר ארוך → more expensive.", "Long → more expensive.", { trap: "cm-long", allow: ["paris"] });
g8a.mcq("Her cooking is ___ than mine.", ["better", "gooder", "more good"], "good, ולכן better.", "good → better.", { trap: "cm-good" });
g8a.mcq("The concert was louder ___ I expected.", ["than", "then", "that"], "מאשר → than.", "than.", { trap: "cm-then" });
g8a.bank("The traffic is ___ today than yesterday.", ["worse", "badder", "more bad"], "bad, ולכן worse.", "bad → worse.");
g8a.bank("This dish is ___ than that one.", ["more delicious", "deliciouser", "delicious"], "תואר ארוך → more delicious.", "Long → more delicious.", { trap: "cm-long", allow: ["delicious", "deliciouser"] });
g8a.bank("The music was ___ than last time.", ["louder", "more loud", "loudest"], "loud, ולכן louder.", "loud → louder.");
g8a.order("The train is faster than the bus.", "תואר + er + than.", "adjective-er + than.");
g8a.order("This actor is more famous than his brother.", "more + תואר + than.", "more + adjective + than.", { allow: ["famous"] });
g8a.sort(S, [["loud", "-er"], ["expensive", "more …"], ["cheap", "-er"], ["traditional", "more …"], ["fast", "-er"], ["famous", "more …"]], "תואר קצר → er. תואר ארוך → more.", "Short → -er. Long → more.", { allow: ["cheap", "famous"] });
g8a.match([["hot", "hotter"], ["good", "better"], ["busy", "busier"], ["bad", "worse"]], "צורות השוואה.", "Comparative forms.", { instr: "התאימו כל תואר לצורת ההשוואה שלו", allow: ["busy", "busier"] });

const g8b = itemSet(T, "cm", 2, 8);
g8b.type("It's ___ in Eilat than in Haifa.", "hot", "hotter", "hot → hotter (מכפילים t).", "hot → hotter.", { trap: "cm-spelling" });
g8b.type("The café is ___ on weekends.", "busy", "busier", "y בסוף הופך ל-ier: busier.", "busy → busier.", { allow: ["busy", "busier"] });
g8b.type("This flight is ___ than the last one.", "short", "shorter", "short, ולכן shorter.", "short → shorter.");
g8b.type("This concert was ___ than the last one.", "exciting", "more exciting", "תואר ארוך → more exciting.", "Long → more exciting.", { trap: "cm-long", allow: ["exciting"] });
g8b.mcq("The new camera is ___ better than the old one.", ["much", "more", "very"], "הרבה יותר → much better.", "much + comparative.");
g8b.mcq("This café is ___ than that one.", ["cheaper", "more cheaper", "more cheap"], "או more או er – רק cheaper.", "Just cheaper.", { trap: "cm-more-er", allow: ["cheaper"] });
g8b.fix("The traffic today is *badder than yesterday.", ["worse"], "bad, ולכן worse.", "bad → worse.", { allow: ["badder"] });
g8b.fix("The train is faster *then the bus.", ["than"], "מאשר → than.", "than.", { trap: "cm-then" });
g8b.transform("The bus takes 2 hours. The train takes 1 hour.", "Compare them: The train is …", "השוו: The train is …", ["The train is faster than the bus.", "The train is quicker than the bus."], "המבנה: faster + than.", "The train is faster than the bus.");
g8b.transform("This dish is traditional. That one is less traditional.", "Compare with 'more … than'.", "השוו עם more … than", ["This dish is more traditional than that one."], "שימו לב: more traditional than.", "more traditional than.");
g8b.order("The new café is a bit cheaper than the old one.", "a bit + השוואה + than.", "a bit + comparative + than.", { allow: ["cheaper"] });
g8b.cloze("City or village?", "Life in the city is {1} than in a village. The streets are {2} and the traffic is {3}. But the city is also {4}, and the cafés are {5}!", [["fast", "faster"], ["busy", "busier"], ["bad", "worse"], ["exciting", "more exciting"], ["good", "better"]], "קצר → er, busy → busier, bad → worse, ארוך → more.", "-er / busier / worse / more / better.", { allow: ["streets", "busy", "busier", "exciting", "life"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "cm", 1, 9);
g9a.mcq("The new tower is ___ than the old one.", ["taller", "more tall", "taler"], "tall, ולכן taller.", "tall → taller.", { trap: "cm-more-er", allow: ["taler"] });
g9a.mcq("This apartment is ___ than our old one.", ["larger", "more large", "largest"], "large, ולכן larger.", "large → larger.", { allow: ["larger", "large", "largest"] });
g9a.mcq("This novel is ___ than the movie.", ["more exciting", "excitinger", "more excitinger"], "תואר ארוך → more exciting.", "Long → more exciting.", { trap: "cm-long", allow: ["exciting", "excitinger"] });
g9a.mcq("My new oven is ___ than the old one.", ["better", "gooder", "more good"], "good, ולכן better.", "good → better.", { trap: "cm-good" });
g9a.mcq("The stadium is bigger ___ I thought.", ["than", "then", "that"], "מאשר → than.", "than.", { trap: "cm-then" });
g9a.bank("The noise is ___ at night.", ["worse", "badder", "more bad"], "bad, ולכן worse.", "bad → worse.");
g9a.bank("This gallery is ___ than the museum.", ["more modern", "moderner", "modern"], "תואר ארוך → more modern.", "Long → more modern.", { trap: "cm-long", allow: ["moderner"] });
g9a.bank("The marathon was ___ than last year.", ["harder", "more hard", "hardest"], "hard, ולכן harder.", "hard → harder.");
g9a.order("Our neighborhood is quieter than the city center.", "תואר + er + than.", "adjective-er + than.", { allow: ["center"] });
g9a.order("This documentary is more emotional than the last one.", "more + תואר + than.", "more + adjective + than.");
g9a.sort(S, [["tall", "-er"], ["modern", "more …"], ["quiet", "-er"], ["comfortable", "more …"], ["old", "-er"], ["dangerous", "more …"]], "תואר קצר → er. תואר ארוך → more.", "Short → -er. Long → more.", { allow: ["comfortable"] });
g9a.match([["thin", "thinner"], ["good", "better"], ["easy", "easier"], ["bad", "worse"]], "צורות השוואה.", "Comparative forms.", { instr: "התאימו כל תואר לצורת ההשוואה שלו", allow: ["easy", "easier", "thinner"] });

const g9b = itemSet(T, "cm", 2, 9);
g9b.type("This ladder is ___ than the old one.", "thin", "thinner", "thin → thinner (מכפילים n).", "thin → thinner.", { trap: "cm-spelling", allow: ["thinner"] });
g9b.type("The new app is ___ to use.", "easy", "easier", "y בסוף הופך ל-ier: easier.", "easy → easier.", { allow: ["easy", "easier"] });
g9b.type("The tower is ___ than the stadium.", "old", "older", "old, ולכן older.", "old → older.");
g9b.type("This sofa is ___ than the old one.", "comfortable", "more comfortable", "תואר ארוך → more comfortable.", "Long → more comfortable.", { trap: "cm-long", allow: ["sofa", "comfortable"] });
g9b.mcq("The new stadium is ___ bigger than the old one.", ["much", "more", "very"], "הרבה יותר → much bigger.", "much + comparative.");
g9b.mcq("The tower is ___ than the stadium.", ["higher", "more higher", "more high"], "או more או er – רק higher.", "Just higher.", { trap: "cm-more-er", allow: ["higher"] });
g9b.fix("This oven is *gooder than the old one.", ["better"], "good, ולכן better.", "good → better.", { trap: "cm-good", allow: ["gooder"] });
g9b.fix("The novel is longer *then the movie.", ["than"], "מאשר → than.", "than.", { trap: "cm-then" });
g9b.transform("The old tower is 50 m. The new tower is 120 m.", "Compare them: The new tower is …", "השוו: The new tower is …", ["The new tower is taller than the old tower.", "The new tower is taller than the old one.", "The new tower is higher than the old tower.", "The new tower is higher than the old one."], "המבנה: taller / higher + than.", "taller than.", { allow: ["m", "higher"] });
g9b.transform("The gallery is modern. The museum is less modern.", "Compare with 'more … than'.", "השוו עם more … than", ["The gallery is more modern than the museum."], "שימו לב: more modern than.", "more modern than.");
g9b.order("Our new apartment is a lot bigger than the old one.", "a lot + השוואה + than.", "a lot + comparative + than.");
g9b.cloze("Then and now", "Our new neighborhood is {1} than the old one. The apartments are {2}, the streets are {3}, and the parks are {4}. But the rent is {5}!", [["quiet", "quieter"], ["modern", "more modern"], ["wide", "wider"], ["nice", "nicer"], ["expensive", "more expensive"]], "קצר → er, ארוך → more.", "-er / more.", { allow: ["streets", "rent"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "cm", 3);
l3.mcq("Dan is ___ tall as his father now.", ["as", "so", "more"], "באותה מידה → as … as.", "Equal → as … as.");
l3.mcq("The more you read, ___ your English gets.", ["the better", "better", "the more good"], "שימו לב: the … the: the better.", "the more …, the better.");
l3.type("It's getting ___ every day.", "cold – and – cold", "colder and colder", "הולך ונעשה → colder and colder.", "getting colder and colder.");
l3.type("This test isn't as ___ as the last one.", "difficult", "difficult", "not as + תואר + as (בלי er).", "not as + adjective + as.", { allow: ["difficult"] });
l3.fix("She is as *taller as her sister.", ["tall"], "as + תואר רגיל + as: as tall as.", "as + plain adjective + as.");
l3.mcq("Prices are getting ___.", ["more and more expensive", "more expensive and expensive", "expensiver and expensiver"], "הולך ונעשה + תואר ארוך → more and more expensive.", "more and more + long adjective.", { allow: ["prices", "expensiver"] });
l3.fix("This exercise is *easyer than the last one.", ["easier"], "y בסוף הופך ל-ier: easier.", "easy → easier.", { allow: ["easyer", "easier"] });
l3.transform("Tom is 15. Dan is 15 too.", "Compare with 'as … as'.", "השוו עם as … as", ["Tom is as old as Dan.", "Dan is as old as Tom."], "שימו לב: as old as.", "as old as.");
l3.transform("If you practice more, you get better.", "Say it with 'The more …, the better …'.", "אמרו את זה עם The more …, the better …", ["The more you practice, the better you get."], "שימו לב: The more … the better.", "The more …, the better.");
l3.sort(["✓ Correct", "✗ Wrong"], [["She's taller than me.", "✓ Correct"], ["She's more taller than me.", "✗ Wrong"], ["It's not as hot as yesterday.", "✓ Correct"], ["It's as hotter as yesterday.", "✗ Wrong"], ["The sooner, the better.", "✓ Correct"], ["This is gooder.", "✗ Wrong"]], "התיקונים: taller · as hot as · better.", "Fixes: taller · as hot as · better.", { allow: ["sooner"] });
l3.cloze("Choosing a phone", "The new phone is {1} than the old one, but it's not {2} cheap. The camera is {3} better. The {4} you pay, the {5} phone you get.", [["fast", "faster"], ["as … as", "as"], ["much / more", "much"], ["more / most", "more"], ["good", "better"]], "שימו לב: er / not as … as / much better / the more …, the better.", "faster / as / much / more / better.", { allow: ["cheap"] });
l3.write("Compare two places you know (cities, schools or rooms). Use -er, more, as … as and not as … as.", "השוו בין שני מקומות שאתם מכירים (ערים, בתי ספר או חדרים). השתמשו ב-er, more, as … as ו-not as … as.", "Tel Aviv is bigger and busier than Haifa. Haifa is quieter and more beautiful. The beaches in Haifa are as nice as the beaches in Tel Aviv, but the nightlife isn't as exciting.", "קצר → er, ארוך → more, as … as = שווה.", "-er / more / as … as.");

export const comparativesItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
