import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: ADVERBS: sequencing (first, then, next, after that, finally).

export const sequencingAdverbsTopic: GrammarTopic = {
  id: "sequencing-adverbs",
  group: "adjectives",
  title: "Sequencing words (first, then, finally)",
  titleHe: "מילות רצף – first, then, finally",
  bandRefs: ["ADVERBS: Sequencing (first, then, next, finally)"],
  grades: { 7: "accurate", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "מילות רצף מסדרות את הפעולות לפי הסדר", en: "Sequencing words put actions in order", examples: ["**First**, I wake up. **Then** I eat breakfast. **Finally**, I go to school."] },
        { he: "התחלה: First", en: "Start: First", examples: ["**First**, open the box."] },
        { he: "באמצע: then / next / after that", en: "Middle: then / next / after that", examples: ["**Then** take out the book.", "**Next**, read the first page."] },
        { he: "סוף: Finally", en: "End: Finally", examples: ["**Finally**, close the box."] },
      ],
      form: [
        { kind: "affirmative", pattern: "First, … Then … Next, … Finally, …", example: "First, wash your hands. Then cut the bread." },
      ],
      timeWords: ["first", "then", "next", "after that", "finally"],
    },
    2: {
      points: [
        { he: "בדרך כלל בתחילת המשפט, עם פסיק", en: "Usually at the start, with a comma", examples: ["**Next,** we went to the beach.", "**After that,** we had lunch."] },
        { he: "after that = אחרי זה (לא after לבד)", en: "after that, not after alone", examples: ["**After that**, we went home.", "✗ After, we went home."] },
        { he: "later = מאוחר יותר", en: "later = at a later time", examples: ["**Later**, we watched a film."] },
        { he: "Finally = לבסוף, בשלב האחרון", en: "Finally = the last step", examples: ["**Finally**, we went to bed."] },
      ],
      form: [
        { kind: "affirmative", pattern: "Sequencing word + , + sentence", example: "After that, we took a taxi." },
        { kind: "affirmative", pattern: "after + noun / after + V-ing", example: "After lunch, we went out." },
      ],
      timeWords: ["after that", "later", "afterwards", "in the end"],
    },
    3: {
      points: [
        { he: "בחיבור: Firstly, Secondly, Lastly", en: "In essays: Firstly, Secondly, Lastly", examples: ["**Firstly**, phones are useful. **Secondly**, they are fun. **Lastly**, …"] },
        { he: "after + שם עצם / V-ing, after that בלי שם עצם", en: "after + noun / V-ing; after that alone", examples: ["**After eating**, we left.", "We ate. **After that**, we left."] },
        { he: "eventually = בסוף, אחרי זמן רב", en: "eventually = after a long time", examples: ["We waited for hours. **Eventually**, the bus came."] },
        { he: "in the end = בסופו של דבר / at the end of = בסוף של", en: "in the end vs at the end of", examples: ["**In the end**, we won.", "**at the end of** the film"] },
      ],
      form: [
        { kind: "affirmative", pattern: "Firstly, … Secondly, … Lastly, …", example: "Firstly, it is cheap. Secondly, it is fast." },
        { kind: "affirmative", pattern: "After + V-ing, …", example: "After finishing the test, I went home." },
      ],
      timeWords: ["firstly", "secondly", "lastly", "eventually", "in the end", "at the end of"],
    },
  },
  traps: [
    { id: "sq-after", wrong: "After, we went home.", right: "After that, we went home.", whyHe: "after לבד צריך שם עצם; לבד אומרים after that.", whyEn: "Use after that when there is no noun." },
    { id: "sq-finally-first", wrong: "Finally, open the box. First, close it.", right: "First, open the box. Finally, close it.", whyHe: "First בהתחלה, Finally בסוף.", whyEn: "First at the start, Finally at the end." },
    { id: "sq-end", wrong: "At the end, we won the game.", right: "In the end, we won the game.", whyHe: "בסופו של דבר = in the end.", whyEn: "In the end = finally." },
    { id: "sq-then-comma", wrong: "First I wake up, then, I eat.", right: "First, I wake up. Then I eat.", whyHe: "כל שלב במשפט נפרד, מילת הרצף בהתחלה.", whyEn: "Each step in its own sentence, word at the start." },
  ],
};

const T = "sequencing-adverbs";
const S = ["Start", "Middle", "End"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "sq", 1, 7);
g7a.mcq("___, I wake up at seven o'clock.", ["First", "Finally", "After that"], "הפעולה הראשונה → First.", "First step → First.", { trap: "sq-finally-first" });
g7a.mcq("I wash my face. ___ I eat breakfast.", ["Then", "First", "Finally"], "שלב באמצע → Then.", "Middle step → Then.");
g7a.mcq("I eat breakfast and get dressed. ___, I go to school.", ["Finally", "First", "Next"], "שלב אחרון → Finally.", "Last step → Finally.", { trap: "sq-finally-first" });
g7a.mcq("First, open your book. ___, read the story.", ["Next", "Finally", "First"], "שלב שני → Next.", "Second step → Next.");
g7a.mcq("We played football. ___, we went home.", ["After that", "After", "First"], "אחרי זה → After that.", "After that.", { trap: "sq-after" });
g7a.bank("___, take two pieces of bread.", ["First", "Finally", "After that"], "התחלה → First.", "Start → First.");
g7a.bank("Put cheese on the bread. ___ put the tomato on it.", ["Then", "First", "Finally"], "באמצע → Then.", "Middle → Then.", { allow: ["tomato"] });
g7a.bank("___, eat your sandwich!", ["Finally", "First", "Next"], "סוף → Finally.", "End → Finally.", { allow: ["sandwich"] });
g7a.order("First, I wake up early.", "First + פסיק + משפט.", "First, + sentence.");
g7a.order("After that, we went to the park.", "After that + פסיק + משפט.", "After that, + sentence.");
g7a.sort(S, [["First", "Start"], ["Then", "Middle"], ["Finally", "End"], ["Next", "Middle"], ["After that", "Middle"], ["To start", "Start"]], "First = התחלה, then / next / after that = אמצע, Finally = סוף.", "Start / middle / end.");
g7a.match([["First,", "open the door."], ["Then", "go into the room."], ["Next,", "turn on the light."], ["Finally,", "close the door."]], "סדר הגיוני: פותחים, נכנסים, מדליקים, סוגרים.", "A logical order.", { instr: "התאימו כל מילת רצף לשלב המתאים" });

const g7b = itemSet(T, "sq", 2, 7);
g7b.type("___, I go to the bathroom. Then I brush my teeth.", "the first step", "First", "התחלה → First.", "First.");
g7b.type("I do my homework. ___ that, I watch TV.", "after", "After", "after that = אחרי זה.", "After that.", { trap: "sq-after", allow: ["tv"] });
g7b.type("We swam in the sea all day. ___, we went home.", "the last step", "Finally", "סוף → Finally.", "Finally.");
g7b.mcq("We had lunch. ___, we played a game.", ["After that", "After", "Before"], "אחרי זה → After that.", "After that.", { trap: "sq-after" });
g7b.mcq("We left at six. ___ we got to the beach.", ["Later", "First", "Before"], "מאוחר יותר → Later.", "Later.");
g7b.fix("We ate dinner. *After, we watched a film.", ["After that"], "after לבד צריך שם עצם → After that.", "After that.", { trap: "sq-after" });
g7b.fix("*Finally, open your bag. Then take out your book.", ["First"], "שלב ראשון → First.", "First step → First.", { trap: "sq-finally-first" });
g7b.fix("First, wash the apple. Then cut it. *First, eat it!", ["Finally"], "שלב אחרון → Finally.", "Last step → Finally.");
g7b.transform("I get up. I eat breakfast. I go to school.", "Join them with First, Then and Finally.", "חברו אותם עם First, Then ו-Finally", ["First, I get up. Then I eat breakfast. Finally, I go to school.", "First, I get up. Then, I eat breakfast. Finally, I go to school.", "First I get up. Then I eat breakfast. Finally I go to school."], "הסדר: First, אחר כך Then, ובסוף Finally.", "First … Then … Finally.");
g7b.transform("We went to the zoo. We had ice cream.", "Join them with 'After that'.", "חברו אותם עם After that", ["We went to the zoo. After that, we had ice cream.", "We went to the zoo. After that we had ice cream."], "After that, + המשפט השני.", "After that, + second sentence.");
g7b.order("Next, we visited my grandmother.", "Next + פסיק + משפט.", "Next, + sentence.");
g7b.cloze("A day at the beach", "{1}, we got up early and made sandwiches. {2} we took the bus to the beach. {3}, we swam in the sea. After {4}, we played on the sand. {5}, we went home.", [["start", "First"], ["middle", "Then"], ["middle", "Next"], ["that / this", "that"], ["end", "Finally"]], "הסדר: First, Then, Next, After that ובסוף Finally.", "First → Then → Next → After that → Finally.", { allow: ["sandwiches", "sand"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "sq", 1, 8);
g8a.mcq("___, we packed our suitcases.", ["First", "Finally", "After that"], "התחלה → First.", "Start → First.", { trap: "sq-finally-first", allow: ["suitcases"] });
g8a.mcq("We took a taxi to the airport. ___ we got on the plane.", ["Then", "First", "Before"], "באמצע → Then.", "Middle → Then.");
g8a.mcq("After a long flight, we ___ arrived in London.", ["finally", "first", "next"], "בסוף → finally.", "At the end → finally.", { allow: ["london"] });
g8a.mcq("We checked in at the hotel. ___, we went to the market.", ["Next", "First", "Finally"], "שלב באמצע → Next.", "Middle step → Next.");
g8a.mcq("We visited the museum. ___, we went to a café.", ["After that", "After", "Before that"], "אחרי זה → After that.", "After that.", { trap: "sq-after" });
g8a.bank("___, cut the onions.", ["First", "Finally", "Then"], "התחלה → First.", "Start → First.", { allow: ["onions"] });
g8a.bank("Cut the vegetables. ___ put them in a pan.", ["Then", "First", "Finally"], "באמצע → Then.", "Middle → Then.", { allow: ["pan"] });
g8a.bank("___, serve the soup hot.", ["Finally", "First", "Next"], "סוף → Finally.", "End → Finally.", { allow: ["serve"] });
g8a.order("After that, we took a taxi to the hotel.", "After that + פסיק + משפט.", "After that, + sentence.");
g8a.order("Finally, we arrived at the airport.", "Finally + פסיק + משפט.", "Finally, + sentence.");
g8a.sort(S, [["First", "Start"], ["Then", "Middle"], ["Finally", "End"], ["Next", "Middle"], ["After that", "Middle"], ["To begin with", "Start"]], "התחלה / אמצע / סוף.", "Start / middle / end.");
g8a.match([["First,", "buy a ticket."], ["Then", "wait for the train."], ["Next,", "find a seat."], ["Finally,", "get off at your station."]], "סדר הגיוני של נסיעה ברכבת.", "A logical train trip.", { instr: "התאימו כל מילת רצף לשלב המתאים" });

const g8b = itemSet(T, "sq", 2, 8);
g8b.type("___, we booked a hotel online.", "the first step", "First", "התחלה → First.", "First.", { allow: ["booked", "online"] });
g8b.type("We had dinner. ___ that, we went for a walk.", "after", "After", "after that = אחרי זה.", "After that.", { trap: "sq-after" });
g8b.type("We waited for an hour. ___, the bus came.", "the last step", "Finally", "בסוף → Finally.", "Finally.");
g8b.mcq("___ dinner, we went for a walk.", ["After", "After that", "Then"], "after + שם עצם (dinner).", "after + noun.", { trap: "sq-after" });
g8b.mcq("We got home at six. ___ that evening, we watched a film.", ["Later", "First", "Before"], "מאוחר יותר → Later.", "Later.");
g8b.fix("We visited the museum. *After, we had lunch.", ["After that"], "after לבד צריך שם עצם → After that.", "After that.", { trap: "sq-after" });
g8b.fix("*Finally, buy a ticket. Then get on the train.", ["First"], "שלב ראשון → First.", "First step → First.", { trap: "sq-finally-first" });
g8b.mcq("___, we won the game 3–2!", ["In the end", "At the end", "At first"], "בסופו של דבר → In the end.", "In the end.", { trap: "sq-end" });
g8b.transform("We packed our bags. We took a taxi. We flew to Rome.", "Join them with First, Then and Finally.", "חברו אותם עם First, Then ו-Finally", ["First, we packed our bags. Then we took a taxi. Finally, we flew to Rome.", "First, we packed our bags. Then, we took a taxi. Finally, we flew to Rome.", "First we packed our bags. Then we took a taxi. Finally we flew to Rome."], "הסדר: First, אחר כך Then, ובסוף Finally.", "First … Then … Finally.", { allow: ["rome"] });
g8b.transform("We had breakfast. We went to the market.", "Join them with 'After that'.", "חברו אותם עם After that", ["We had breakfast. After that, we went to the market.", "We had breakfast. After that we went to the market."], "After that, + המשפט השני.", "After that, + second sentence.");
g8b.order("After breakfast, we went to the old city.", "after + שם עצם + פסיק.", "After + noun, + sentence.");
g8b.cloze("Making pasta", "{1}, boil some water in a big pot. {2} put the pasta in. {3}, cut a tomato and an onion. After {4}, mix everything together. {5}, eat it while it's hot!", [["start", "First"], ["middle", "Then"], ["middle", "Next"], ["that / this", "that"], ["end", "Finally"]], "הסדר: First, Then, Next, After that ובסוף Finally.", "First → Then → Next → After that → Finally.", { allow: ["boil", "pot", "pasta", "tomato"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "sq", 1, 9);
g9a.mcq("___, read the instructions carefully.", ["First", "Finally", "After that"], "התחלה → First.", "Start → First.", { trap: "sq-finally-first", allow: ["instructions"] });
g9a.mcq("Fill in the form. ___ sign your name at the bottom.", ["Then", "First", "Before"], "באמצע → Then.", "Middle → Then.", { allow: ["sign", "bottom"] });
g9a.mcq("___, hand in your paper to the teacher.", ["Finally", "First", "Next"], "סוף → Finally.", "End → Finally.");
g9a.mcq("First, choose a topic. ___, find some information online.", ["Next", "Finally", "First"], "שלב שני → Next.", "Second step → Next.", { allow: ["online"] });
g9a.mcq("We trained for months. ___, we ran the marathon.", ["After that", "After", "Before"], "אחרי זה → After that.", "After that.", { trap: "sq-after" });
g9a.bank("___, preheat the oven.", ["First", "Finally", "After that"], "התחלה → First.", "Start → First.", { allow: ["preheat"] });
g9a.bank("Mix the flour and the eggs. ___ add the sugar.", ["Then", "First", "Finally"], "באמצע → Then.", "Middle → Then.");
g9a.bank("___, bake the cake for forty minutes.", ["Finally", "First", "Next"], "סוף → Finally.", "End → Finally.", { allow: ["bake"] });
g9a.order("First, we cleaned the whole apartment.", "First + פסיק + משפט.", "First, + sentence.");
g9a.order("After that, we painted the walls.", "After that + פסיק + משפט.", "After that, + sentence.", { allow: ["painted", "walls"] });
g9a.sort(S, [["First", "Start"], ["Then", "Middle"], ["Finally", "End"], ["Next", "Middle"], ["After that", "Middle"], ["In the end", "End"]], "התחלה / אמצע / סוף.", "Start / middle / end.");
g9a.match([["First,", "plan your trip."], ["Then", "book a hotel."], ["Next,", "pack your bags."], ["Finally,", "enjoy your holiday!"]], "סדר הגיוני של תכנון טיול.", "A logical trip plan.", { instr: "התאימו כל מילת רצף לשלב המתאים", allow: ["book"] });

const g9b = itemSet(T, "sq", 2, 9);
g9b.type("___, I planned the route on my phone.", "the first step", "First", "התחלה → First.", "First.", { allow: ["route"] });
g9b.type("We visited the gallery. ___ that, we had coffee.", "after", "After", "after that = אחרי זה.", "After that.", { trap: "sq-after" });
g9b.type("We looked for the key for an hour. ___, we found it.", "the last step", "Finally", "בסוף → Finally.", "Finally.");
g9b.mcq("___ the concert, we went out for pizza.", ["After", "After that", "Then"], "after + שם עצם (the concert).", "after + noun.", { trap: "sq-after" });
g9b.mcq("We arrived at noon. ___ that day, it started to rain.", ["Later", "First", "Before"], "מאוחר יותר → Later.", "Later.", { allow: ["noon"] });
g9b.fix("We finished the project. *After, we presented it to the class.", ["After that"], "after לבד צריך שם עצם → After that.", "After that.", { trap: "sq-after", allow: ["presented"] });
g9b.fix("*Finally, choose a topic. Then write a plan.", ["First"], "שלב ראשון → First.", "First step → First.", { trap: "sq-finally-first" });
g9b.mcq("It was a hard game, but ___ we won.", ["in the end", "at the end", "at first"], "בסופו של דבר → in the end.", "in the end.", { trap: "sq-end" });
g9b.transform("We cleaned the apartment. We painted the walls. We moved in.", "Join them with First, Then and Finally.", "חברו אותם עם First, Then ו-Finally", ["First, we cleaned the apartment. Then we painted the walls. Finally, we moved in.", "First, we cleaned the apartment. Then, we painted the walls. Finally, we moved in.", "First we cleaned the apartment. Then we painted the walls. Finally we moved in."], "הסדר: First, אחר כך Then, ובסוף Finally.", "First … Then … Finally.", { allow: ["painted", "walls"] });
g9b.transform("We went to the stadium. We watched the game.", "Join them with 'After that'.", "חברו אותם עם After that", ["We went to the stadium. After that, we watched the game.", "We went to the stadium. After that we watched the game."], "After that, + המשפט השני.", "After that, + second sentence.");
g9b.order("After the marathon, we celebrated with our friends.", "after + שם עצם + פסיק.", "After + noun, + sentence.", { allow: ["celebrated"] });
g9b.cloze("Moving apartment", "{1}, we packed everything in boxes. {2} a big truck came to take them. {3}, we cleaned the old apartment. After {4}, we drove to our new home. {5}, we were tired but happy!", [["start", "First"], ["middle", "Then"], ["middle", "Next"], ["that / this", "that"], ["end", "Finally"]], "הסדר: First, Then, Next, After that ובסוף Finally.", "First → Then → Next → After that → Finally.", { allow: ["truck", "boxes"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "sq", 3);
l3.mcq("___, school uniforms are cheap. Secondly, they are easy to wear.", ["Firstly", "Lastly", "Eventually"], "בחיבור, הטיעון הראשון → Firstly.", "First argument → Firstly.", { allow: ["uniforms", "firstly", "secondly", "lastly", "eventually"] });
l3.mcq("We waited for three hours. ___, the plane took off.", ["Eventually", "Firstly", "At the end"], "אחרי זמן רב → Eventually.", "After a long time → Eventually.", { allow: ["eventually", "firstly"] });
l3.mcq("___ finishing the test, I checked my answers.", ["After", "After that", "Then"], "אחרי after בא פועל עם ing.", "after + V-ing.", { trap: "sq-after" });
l3.mcq("The hero dies ___ the film.", ["at the end of", "in the end of", "finally"], "בסוף של משהו → at the end of.", "at the end of + noun.", { trap: "sq-end" });
l3.type("I lost the first game. ___ the end, I won the match.", "in / at", "In", "בסופו של דבר → In the end.", "In the end.", { trap: "sq-end" });
l3.type("___, phones help us learn. Lastly, they keep us safe.", "second argument", "Secondly", "הטיעון השני → Secondly.", "Second argument → Secondly.", { allow: ["secondly", "lastly"] });
l3.fix("After *to eat, we went for a walk.", ["eating"], "אחרי after בא פועל עם ing: after eating.", "after + V-ing.");
l3.fix("*At the end, we decided to stay home.", ["In"], "בסופו של דבר → In the end.", "In the end.", { trap: "sq-end" });
l3.transform("I finished my homework. Then I went out.", "Use 'After + V-ing'.", "השתמשו ב-After + V-ing", ["After finishing my homework, I went out.", "After finishing my homework I went out.", "After doing my homework, I went out."], "מתחילים ב-After ופועל עם ing: After finishing …", "After finishing …, I went out.");
l3.sort(["Essay", "Story"], [["Firstly", "Essay"], ["Secondly", "Essay"], ["Lastly", "Essay"], ["Then", "Story"], ["After that", "Story"], ["Eventually", "Story"]], "בחיבור טיעון: Firstly / Secondly / Lastly. בסיפור: Then / After that / Eventually.", "Essay: Firstly… Story: Then…", { allow: ["firstly", "secondly", "lastly", "eventually"] });
l3.cloze("A lost dog", "Yesterday our dog ran away. {1}, we looked in the garden. {2} that, we asked our neighbors. We searched for hours. {3}, at night, we heard a noise. {4} the end, we found him behind the house, at the {5} of our street!", [["start", "First"], ["after / before", "After"], ["after a long time", "Eventually"], ["in / at", "In"], ["start / end", "end"]], "התחלה First, אחר כך After that, אחרי זמן רב Eventually, בסופו של דבר In the end, ובסוף של מקום at the end of.", "First / After that / Eventually / In the end / at the end of.", { allow: ["eventually", "searched", "neighbors"] });
l3.write("Write a short story or a recipe (4–5 sentences). Use First, Then, After that, Eventually / In the end.", "כתבו סיפור קצר או מתכון (4–5 משפטים). השתמשו ב-First, Then, After that, Eventually / In the end.", "First, we packed our bags. Then we drove to the north. After that, we got lost for an hour. Eventually, we found the hotel. In the end, it was a great trip!", "הסדר: First, Then, After that ובסוף In the end.", "First → Then → After that → In the end.", { allow: ["eventually"] });

export const sequencingAdverbsItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
