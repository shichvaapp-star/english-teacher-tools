import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: ADJECTIVES: Superlative (to compare and contrast).

export const superlativesTopic: GrammarTopic = {
  id: "superlatives",
  group: "adjectives",
  title: "Superlatives (the biggest / the most interesting)",
  titleHe: "ההכי – the biggest, the most interesting",
  bandRefs: ["ADJECTIVES: Superlative"],
  grades: { 7: "evolving", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "the + תואר קצר + est = ההכי", en: "the + short adjective + -est", examples: ["Dan is **the tallest** in the class.", "It's **the biggest** city in Israel."] },
        { he: "תואר ארוך: the most + תואר", en: "Long adjective: the most + adjective", examples: ["It's **the most beautiful** place in the world."] },
        { he: "תמיד the לפני ההכי", en: "Always the before a superlative", examples: ["**the** best", "✗ She is best student."] },
        { he: "יוצאי דופן: good → the best, bad → the worst", en: "Irregular: good → the best, bad → the worst", examples: ["good → **the best**", "bad → **the worst**", "far → **the farthest**"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "the + short adj + -est (+ in / of …)", example: "It's the coldest day of the year." },
        { kind: "affirmative", pattern: "the most + long adj", example: "It's the most expensive phone in the shop." },
      ],
      timeWords: ["the …-est", "the most", "the best", "the worst", "in the world"],
    },
    2: {
      points: [
        { he: "כתיב: big → biggest, happy → happiest, nice → nicest", en: "Spelling: big → biggest, happy → happiest, nice → nicest", examples: ["bi**ggest**", "happ**iest**", "nic**est**", "ho**ttest**"], chips: true },
        { he: "לא אומרים most + est", en: "Never most + -est", examples: ["**the biggest**", "✗ the most biggest"] },
        { he: "in + מקום / קבוצה, of + זמן / מספר", en: "in + place / group, of + time / number", examples: ["the best player **in** the team", "the best day **of** my life"] },
        { he: "השוואה (2) לעומת ההכי (3 ומעלה)", en: "Comparative (2) vs superlative (3+)", examples: ["Dan is **taller than** Tom.", "Dan is **the tallest** in the class."] },
      ],
      form: [
        { kind: "affirmative", pattern: "the + superlative + in + place / group", example: "the fastest runner in the school" },
        { kind: "affirmative", pattern: "the + superlative + of + time / number", example: "the happiest day of the year" },
      ],
      timeWords: ["in the class", "in the world", "of all", "of the year"],
    },
    3: {
      points: [
        { he: "the least + תואר = הכי פחות", en: "the least + adjective", examples: ["It's **the least expensive** room."] },
        { he: "ההכי + I've ever …", en: "superlative + I've ever …", examples: ["It's **the best** film **I've ever seen**."] },
        { he: "one of the + ההכי + רבים", en: "one of the + superlative + plural", examples: ["She's **one of the best players** in the team."] },
        { he: "מילים בשתי הברות שמסתיימות ב-y: the easiest", en: "Two-syllable -y: the easiest, the busiest", examples: ["eas**iest**", "busi**est**", "funn**iest**"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "the + superlative + noun + I've ever + V3", example: "the funniest show I've ever watched" },
        { kind: "affirmative", pattern: "one of the + superlative + plural noun", example: "one of the oldest cities in the world" },
      ],
      timeWords: ["the least", "ever", "one of the", "by far"],
    },
  },
  traps: [
    { id: "su-no-the", wrong: "She is best student in the class.", right: "She is the best student in the class.", whyHe: "תמיד the לפני ההכי.", whyEn: "Always the before a superlative." },
    { id: "su-most-est", wrong: "It's the most biggest city.", right: "It's the biggest city.", whyHe: "או most או est, לא שניהם.", whyEn: "Either most or -est, not both." },
    { id: "su-good", wrong: "He is the goodest player.", right: "He is the best player.", whyHe: "יוצא דופן: good → the best.", whyEn: "good → the best." },
    { id: "su-of-in", wrong: "the tallest boy of the class", right: "the tallest boy in the class", whyHe: "מקום או קבוצה → in.", whyEn: "Place or group → in." },
    { id: "su-than", wrong: "Dan is the tallest than Tom.", right: "Dan is taller than Tom.", whyHe: "עם than משתמשים בהשוואה (er), לא בהכי.", whyEn: "With than use the comparative." },
  ],
};

const T = "superlatives";
const S = ["the …-est", "the most …"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "su", 1, 7);
g7a.mcq("Dan is ___ boy in the class.", ["the tallest", "tallest", "the most tall"], "ההכי → the tallest.", "the tallest.", { trap: "su-no-the" });
g7a.mcq("This is ___ village in the country.", ["the smallest", "the most small", "the smaller"], "small, ולכן the smallest.", "small → the smallest.", { trap: "su-most-est" });
g7a.mcq("It's ___ place in the world!", ["the most beautiful", "the beautifulest", "the most beautifulest"], "תואר ארוך → the most beautiful.", "Long → the most beautiful.");
g7a.mcq("She is ___ player in the team.", ["the best", "the goodest", "the most good"], "good, ולכן the best.", "good → the best.", { trap: "su-good" });
g7a.mcq("Yesterday was ___ day of my life.", ["the worst", "the baddest", "the most bad"], "bad, ולכן the worst.", "bad → the worst.");
g7a.bank("Summer is ___ season in Israel.", ["the hottest", "the hotest", "the most hot"], "hot, ולכן the hottest.", "hot → the hottest.", { allow: ["season", "hotest"] });
g7a.bank("This is ___ room in the house.", ["the coldest", "the most cold", "coldest"], "cold, ולכן the coldest.", "cold → the coldest.");
g7a.bank("The river is ___ part of the trip.", ["the most dangerous", "the dangerousest", "the more dangerous"], "תואר ארוך → the most dangerous.", "Long → the most dangerous.");
g7a.order("My grandfather is the oldest person in our family.", "the + תואר + est + in.", "the + -est + in.");
g7a.order("This is the most interesting book in the shop.", "the most + תואר ארוך.", "the most + long adjective.");
g7a.sort(S, [["tall", "the …-est"], ["beautiful", "the most …"], ["small", "the …-est"], ["dangerous", "the most …"], ["cold", "the …-est"], ["interesting", "the most …"]], "תואר קצר → est. תואר ארוך → the most.", "Short → -est. Long → the most.");
g7a.match([["big", "the biggest"], ["good", "the best"], ["happy", "the happiest"], ["bad", "the worst"]], "צורות ההכי.", "Superlative forms.", { instr: "התאימו כל תואר לצורת ההכי שלו" });

const g7b = itemSet(T, "su", 2, 7);
g7b.type("The elephant is ___ animal in the zoo.", "big", "the biggest", "big → the biggest (מכפילים g).", "big → the biggest.", { allow: ["elephant"] });
g7b.type("It was ___ day of the year.", "happy", "the happiest", "y בסוף הופך ל-iest: the happiest.", "happy → the happiest.");
g7b.type("This is ___ road in the village.", "long", "the longest", "long, ולכן the longest.", "long → the longest.", { allow: ["road"] });
g7b.type("This is ___ game in the shop.", "interesting", "the most interesting", "תואר ארוך → the most interesting.", "Long → the most interesting.");
g7b.mcq("He is the fastest runner ___ the school.", ["in", "of", "than"], "מקום או קבוצה → in.", "Place or group → in.", { trap: "su-of-in", allow: ["runner"] });
g7b.fix("Tom is *best student in the class.", ["the best"], "תמיד the לפני ההכי.", "Always the.", { trap: "su-no-the" });
g7b.fix("She is the *goodest singer in the school.", ["best"], "good, ולכן the best.", "good → the best.", { trap: "su-good", allow: ["goodest"] });
g7b.mcq("This is ___ cake in the shop.", ["the biggest", "the most biggest", "the most big"], "או most או est – רק the biggest.", "Just the biggest.", { trap: "su-most-est" });
g7b.transform("Dan is 1.50 m. Tom is 1.60 m. Ben is 1.70 m.", "Who is the tallest? Ben is …", "מי הכי גבוה? Ben is …", ["Ben is the tallest.", "Ben is the tallest boy."], "המבנה: the + tall + est.", "Ben is the tallest.", { allow: ["m"] });
g7b.transform("All the rooms are small, but my room is very small.", "Use 'the smallest'.", "השתמשו ב-the smallest", ["My room is the smallest room.", "My room is the smallest."], "שימו לב: the smallest.", "the smallest.");
g7b.order("It was the best day of my life.", "המבנה: the best + of.", "the best + of.");
g7b.cloze("My family", "My grandmother is {1} person in my family. My brother is {2}, but my sister is {3} in the house. My father is {4} cook, and my mother is {5}!", [["old", "the oldest"], ["tall", "the tallest"], ["noisy", "the noisiest"], ["good", "the best"], ["funny", "the funniest"]], "שימו לב: est / iest / the best.", "-est / -iest / the best.", { allow: ["noisy", "noisiest", "funny", "funniest", "cook"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "su", 1, 8);
g8a.mcq("This is ___ building in the city.", ["the tallest", "tallest", "the most tall"], "ההכי → the tallest.", "the tallest.", { trap: "su-no-the", allow: ["building"] });
g8a.mcq("It's ___ café in town.", ["the cheapest", "the most cheap", "the cheaper"], "cheap, ולכן the cheapest.", "cheap → the cheapest.", { trap: "su-most-est", allow: ["cheap", "cheapest", "cheaper"] });
g8a.mcq("Paris is ___ city I know.", ["the most expensive", "the expensivest", "the most expensivest"], "תואר ארוך → the most expensive.", "Long → the most expensive.", { allow: ["paris", "expensivest"] });
g8a.mcq("That was ___ concert of the year.", ["the best", "the goodest", "the most good"], "good, ולכן the best.", "good → the best.", { trap: "su-good" });
g8a.mcq("The traffic is ___ on Sunday morning.", ["the worst", "the baddest", "the most bad"], "bad, ולכן the worst.", "bad → the worst.");
g8a.bank("August is ___ month of the year.", ["the hottest", "the hotest", "the most hot"], "hot, ולכן the hottest.", "hot → the hottest.", { allow: ["hotest"] });
g8a.bank("The train is ___ way to get there.", ["the fastest", "the most fast", "fastest"], "fast, ולכן the fastest.", "fast → the fastest.");
g8a.bank("This is ___ dish on the menu.", ["the most traditional", "the traditionalest", "the more traditional"], "תואר ארוך → the most traditional.", "Long → the most traditional.", { allow: ["menu", "traditionalest"] });
g8a.order("This is the loudest concert in the country.", "the + תואר + est + in.", "the + -est + in.");
g8a.order("He is the most famous actor in the world.", "the most + תואר ארוך.", "the most + long adjective.", { allow: ["famous"] });
g8a.sort(S, [["loud", "the …-est"], ["expensive", "the most …"], ["cheap", "the …-est"], ["traditional", "the most …"], ["fast", "the …-est"], ["famous", "the most …"]], "תואר קצר → est. תואר ארוך → the most.", "Short → -est. Long → the most.", { allow: ["cheap", "famous"] });
g8a.match([["hot", "the hottest"], ["good", "the best"], ["busy", "the busiest"], ["bad", "the worst"]], "צורות ההכי.", "Superlative forms.", { instr: "התאימו כל תואר לצורת ההכי שלו", allow: ["busy", "busiest"] });

const g8b = itemSet(T, "su", 2, 8);
g8b.type("Eilat is ___ city in Israel.", "hot", "the hottest", "hot → the hottest (מכפילים t).", "hot → the hottest.");
g8b.type("Friday is ___ day at the market.", "busy", "the busiest", "y בסוף הופך ל-iest: the busiest.", "busy → the busiest.", { allow: ["busy", "busiest"] });
g8b.type("This is ___ flight of the day.", "short", "the shortest", "short, ולכן the shortest.", "short → the shortest.");
g8b.type("It was ___ concert of the summer.", "exciting", "the most exciting", "תואר ארוך → the most exciting.", "Long → the most exciting.", { allow: ["exciting"] });
g8b.mcq("It's the most popular café ___ the city.", ["in", "of", "than"], "מקום → in.", "Place → in.", { trap: "su-of-in" });
g8b.fix("This is *cheapest camera in the shop.", ["the cheapest"], "תמיד the לפני ההכי.", "Always the.", { trap: "su-no-the", allow: ["cheapest"] });
g8b.fix("It was the *baddest flight of my life.", ["worst"], "bad, ולכן the worst.", "bad → the worst.", { allow: ["baddest"] });
g8b.mcq("This is ___ restaurant in town.", ["the most expensive", "the most expensivest", "the expensivest"], "או most או est – תואר ארוך → the most expensive.", "Long → the most expensive.", { trap: "su-most-est", allow: ["expensivest"] });
g8b.transform("The bus takes 3 hours. The train takes 2 hours. The plane takes 1 hour.", "Which is the fastest? The plane is …", "מה הכי מהיר? The plane is …", ["The plane is the fastest.", "The plane is the fastest way.", "The plane is the quickest.", "The plane is the quickest way."], "המבנה: the + fast + est.", "The plane is the fastest.");
g8b.transform("All the dishes are delicious, but this one is very delicious.", "Use 'the most …'.", "השתמשו ב-the most", ["This one is the most delicious.", "This dish is the most delicious.", "This one is the most delicious dish."], "שימו לב: the most delicious.", "the most delicious.", { allow: ["delicious", "dishes"] });
g8b.order("It is the most popular show on television.", "the most + תואר ארוך.", "the most + long adjective.");
g8b.cloze("Our trip abroad", "Our trip to London was {1} trip of my life. We saw {2} buildings and ate in {3} restaurants. The weather was {4} part, it rained every day! But the museums were {5}.", [["good", "the best"], ["tall", "the tallest"], ["expensive", "the most expensive"], ["bad", "the worst"], ["interesting", "the most interesting"]], "שימו לב: est / the most / the best / the worst.", "-est / the most / best / worst.", { allow: ["london", "buildings", "rained"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "su", 1, 9);
g9a.mcq("This is ___ tower in the city.", ["the tallest", "tallest", "the most tall"], "ההכי → the tallest.", "the tallest.", { trap: "su-no-the" });
g9a.mcq("It's ___ apartment in the building.", ["the largest", "the most large", "the larger"], "large, ולכן the largest.", "large → the largest.", { trap: "su-most-est", allow: ["largest", "large", "larger", "building"] });
g9a.mcq("This is ___ gallery in the country.", ["the most modern", "the modernest", "the most modernest"], "תואר ארוך → the most modern.", "Long → the most modern.", { allow: ["modernest"] });
g9a.mcq("It was ___ novel I read this year.", ["the best", "the goodest", "the most good"], "good, ולכן the best.", "good → the best.", { trap: "su-good" });
g9a.mcq("The noise is ___ at night.", ["the worst", "the baddest", "the most bad"], "bad, ולכן the worst.", "bad → the worst.");
g9a.bank("This is ___ part of the marathon.", ["the hardest", "the most hard", "hardest"], "hard, ולכן the hardest.", "hard → the hardest.");
g9a.bank("This is ___ street in the neighborhood.", ["the quietest", "the most quiet", "the quieter"], "quiet, ולכן the quietest.", "quiet → the quietest.");
g9a.bank("It was ___ documentary on television.", ["the most emotional", "the emotionalest", "the more emotional"], "תואר ארוך → the most emotional.", "Long → the most emotional.", { allow: ["emotionalest"] });
g9a.order("This is the oldest tower in the city.", "the + תואר + est + in.", "the + -est + in.");
g9a.order("It is the most comfortable sofa in the shop.", "the most + תואר ארוך.", "the most + long adjective.", { allow: ["comfortable", "sofa"] });
g9a.sort(S, [["old", "the …-est"], ["modern", "the most …"], ["quiet", "the …-est"], ["comfortable", "the most …"], ["hard", "the …-est"], ["emotional", "the most …"]], "תואר קצר → est. תואר ארוך → the most.", "Short → -est. Long → the most.", { allow: ["comfortable"] });
g9a.match([["thin", "the thinnest"], ["good", "the best"], ["easy", "the easiest"], ["bad", "the worst"]], "צורות ההכי.", "Superlative forms.", { instr: "התאימו כל תואר לצורת ההכי שלו", allow: ["easy", "easiest", "thinnest"] });

const g9b = itemSet(T, "su", 2, 9);
g9b.type("It's ___ phone in the shop.", "thin", "the thinnest", "thin → the thinnest (מכפילים n).", "thin → the thinnest.", { allow: ["thinnest"] });
g9b.type("This is ___ app to use.", "easy", "the easiest", "y בסוף הופך ל-iest: the easiest.", "easy → the easiest.", { allow: ["easy", "easiest"] });
g9b.type("This is ___ stadium in Israel.", "old", "the oldest", "old, ולכן the oldest.", "old → the oldest.");
g9b.type("This is ___ sofa in the apartment.", "comfortable", "the most comfortable", "תואר ארוך → the most comfortable.", "Long → the most comfortable.", { allow: ["sofa", "comfortable"] });
g9b.mcq("It was the hottest day ___ the year.", ["of", "in", "than"], "זמן → of the year.", "Time → of the year.", { trap: "su-of-in" });
g9b.fix("This is *highest tower in the city.", ["the highest"], "תמיד the לפני ההכי.", "Always the.", { trap: "su-no-the", allow: ["highest"] });
g9b.fix("He is the *goodest player in the league.", ["best"], "good, ולכן the best.", "good → the best.", { trap: "su-good", allow: ["goodest", "league"] });
g9b.mcq("It's ___ neighborhood in the city.", ["the noisiest", "the most noisiest", "the most noisy"], "או most או est – רק the noisiest.", "Just the noisiest.", { trap: "su-most-est", allow: ["noisiest", "noisy"] });
g9b.transform("The old tower is 50 m. The bridge is 80 m. The new tower is 120 m.", "Which is the tallest? The new tower is …", "מה הכי גבוה? The new tower is …", ["The new tower is the tallest.", "The new tower is the highest."], "המבנה: the + tall + est.", "The new tower is the tallest.", { allow: ["m", "highest"] });
g9b.transform("All the novels are long, but this one is very long.", "Use 'the longest'.", "השתמשו ב-the longest", ["This one is the longest.", "This novel is the longest.", "This one is the longest novel."], "שימו לב: the longest.", "the longest.", { allow: ["novels"] });
g9b.order("She is the youngest player in the league.", "the + תואר + est + in.", "the + -est + in.", { allow: ["league"] });
g9b.cloze("Our neighborhood", "Our neighborhood is {1} part of the city. It has {2} parks and {3} streets. The bakery has {4} bread in town, but the rent is {5}!", [["quiet", "the quietest"], ["beautiful", "the most beautiful"], ["wide", "the widest"], ["good", "the best"], ["high", "the highest"]], "שימו לב: est / the most / the best.", "-est / the most / the best.", { allow: ["streets", "bakery", "rent", "widest", "highest"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "su", 3);
l3.mcq("This is the ___ expensive room in the hotel.", ["least", "less", "littlest"], "הכי פחות → the least.", "the least.");
l3.mcq("It's the funniest film I've ___ seen.", ["ever", "never", "yet"], "ההכי + I've ever …", "superlative + I've ever.", { allow: ["funniest"] });
l3.mcq("She is one of the best ___ in the team.", ["players", "player", "playing"], "one of the + ההכי + רבים.", "one of the + plural.");
l3.mcq("Dan is ___ than Tom.", ["taller", "the tallest", "tallest"], "שניים עם than → השוואה (er).", "Two with than → comparative.", { trap: "su-than" });
l3.type("It's the ___ city I've ever visited.", "beautiful", "most beautiful", "the most + תואר ארוך.", "the most beautiful.");
l3.type("This is the ___ exam of the year.", "easy", "easiest", "y בסוף הופך ל-iest: easiest.", "easy → easiest.", { allow: ["easy", "easiest", "exam"] });
l3.fix("Dan is the *tallest than his brother.", ["taller"], "עם than → השוואה: taller.", "With than → taller.", { trap: "su-than" });
l3.fix("It's one of the oldest *city in the world.", ["cities"], "one of the + רבים: cities.", "one of the + plural: cities.");
l3.transform("I have seen many films. This film is better than all of them.", "Use 'the best … I've ever …'.", "השתמשו ב-the best … I've ever …", ["This is the best film I've ever seen.", "This film is the best film I've ever seen.", "It's the best film I've ever seen."], "המבנה: the best + I've ever seen.", "the best film I've ever seen.");
l3.sort(["✓ Correct", "✗ Wrong"], [["She's the best student.", "✓ Correct"], ["She's best student.", "✗ Wrong"], ["It's the least expensive room.", "✓ Correct"], ["It's the most biggest room.", "✗ Wrong"], ["one of the oldest cities", "✓ Correct"], ["the tallest boy of the class", "✗ Wrong"]], "התיקונים: the best · the biggest · in the class.", "Fixes: the best · the biggest · in the class.");
l3.cloze("A great holiday", "It was {1} holiday I've {2} had. We stayed in one of the oldest {3} in Rome. The food was {4} I've ever eaten, and the hotel was {5} expensive one in the area.", [["good", "the best"], ["ever / never", "ever"], ["city", "cities"], ["delicious", "the most delicious"], ["little", "the least"]], "the best / ever / רבים / the most / the least.", "best / ever / cities / most / least.", { allow: ["rome", "delicious", "eaten"] });
l3.write("Write about the best, the worst and the most interesting things in your life (a trip, a film, a day). Use -est, the most and I've ever.", "כתבו על הדברים הכי טובים, הכי גרועים והכי מעניינים בחייכם (טיול, סרט, יום). השתמשו ב-est, the most ו-I've ever.", "The best trip I've ever had was to Eilat. It was the hottest week of the year! The most interesting thing was the coral beach. The worst part was the long drive home.", "שימו לב: est / the most / the best / I've ever.", "-est / the most / I've ever.");

export const superlativesItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
