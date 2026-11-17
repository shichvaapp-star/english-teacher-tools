import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: MODALITY: Would like (invitations, wishes / preferences).

export const wouldLikeTopic: GrammarTopic = {
  id: "would-like",
  group: "modals",
  title: "would like",
  titleHe: "would like – רוצה (בנימוס)",
  bandRefs: ["MODALITY: Would like"],
  grades: { 7: "evolving", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "would like = רוצה (מנומס יותר מ-want)", en: "would like = want (more polite)", examples: ["I **would like** a glass of water.", "I'**d like** a sandwich, please."] },
        { he: "would like + to + פועל", en: "would like + to + verb", examples: ["I'd like **to go** home.", "She'd like **to be** a pilot."] },
        { he: "הזמנה: Would you like…?", en: "Invitation: Would you like…?", examples: ["**Would you like** some tea?", "**Would you like to** come?"] },
        { he: "I'd הוא קיצור של I would", en: "I'd = I would", examples: ["I'd", "you'd", "she'd", "we'd"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "subject + would ('d) like + noun", example: "We'd like two tickets." },
        { kind: "affirmative", pattern: "subject + would ('d) like + to + verb", example: "I'd like to help." },
        { kind: "question", pattern: "Would you like + noun / to + verb?", example: "Would you like to dance?" },
        { kind: "short_answer", pattern: "Yes, please. / No, thank you.", example: "Yes, I'd love to." },
      ],
      timeWords: ["please", "thank you", "Would you like…?"],
    },
    2: {
      points: [
        { he: "like = אוהב (תמיד), would like = רוצה (עכשיו)", en: "like = enjoy (in general); would like = want (now)", examples: ["I **like** pizza. (always)", "I'**d like** a pizza. (now)"] },
        { he: "would לא משתנה – בלי s ובלי do", en: "would doesn't change – no -s, no do", examples: ["She **would like**…", "✗ She woulds like…", "✗ Do you would like…?"] },
        { he: "תשובות מנומסות", en: "Polite answers", examples: ["Yes, please.", "I'd love to!", "No, thank you."] },
        { he: "שלילה: wouldn't like", en: "Negative: wouldn't like", examples: ["I **wouldn't like** to live there."] },
      ],
      form: [
        { kind: "question", pattern: "What would you like (to + verb)?", example: "What would you like to eat?" },
        { kind: "negative", pattern: "wouldn't like + to + verb", example: "He wouldn't like that." },
      ],
      timeWords: ["What would you like…?", "Where would you like to…?", "I'd love to"],
    },
    3: {
      points: [
        { he: "would rather = מעדיף", en: "would rather = prefer", examples: ["I'**d rather** stay home.", "I'd rather walk **than** drive."] },
        { he: "would you mind + ing – בקשה מנומסת מאוד", en: "Would you mind + -ing – very polite request", examples: ["**Would you mind opening** the window?"] },
        { he: "would like + someone + to + פועל", en: "would like + someone + to + verb", examples: ["I'd like **you to** meet my friend."] },
        { he: "would love = אשמח, would prefer = אעדיף", en: "would love / would prefer", examples: ["I'**d love** to come!", "I'**d prefer** tea, please."] },
      ],
      form: [
        { kind: "affirmative", pattern: "would rather + base verb (than …)", example: "We'd rather wait." },
        { kind: "question", pattern: "Would you mind + verb-ing?", example: "Would you mind closing the door?" },
      ],
      timeWords: ["would rather", "would prefer", "would you mind", "would love"],
    },
  },
  traps: [
    { id: "wl2-to", wrong: "I'd like go home.", right: "I'd like to go home.", whyHe: "would like + to + פועל.", whyEn: "would like + to + verb." },
    { id: "wl2-like", wrong: "I like a coffee, please.", right: "I'd like a coffee, please.", whyHe: "כשמבקשים עכשיו – I'd like, לא I like.", whyEn: "When asking now → I'd like." },
    { id: "wl2-do", wrong: "Do you would like some tea?", right: "Would you like some tea?", whyHe: "עם would לא שמים do.", whyEn: "No do with would." },
    { id: "wl2-s", wrong: "She woulds like a cake.", right: "She would like a cake.", whyHe: "would לא מקבל s.", whyEn: "would never takes -s." },
  ],
};

const T = "would-like";

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "wd", 1, 7);
g7a.mcq("I ___ a glass of water, please.", ["'d like", "like", "would"], "בקשה מנומסת עכשיו → I'd like.", "Polite request now → I'd like.", { trap: "wl2-like" });
g7a.mcq("___ you like to join our team?", ["Would", "Do", "Are"], "הזמנה → Would you like…?", "Invitation → Would you like…?", { trap: "wl2-do" });
g7a.mcq("She would like ___ a guide one day.", ["to be", "be", "being"], "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to" });
g7a.mcq("\"Would you like some lemon?\" \"Yes, ___.\"", ["please", "I like", "I would"], "תשובה מנומסת → Yes, please.", "Polite answer → Yes, please.");
g7a.mcq("My brother ___ like a new bike.", ["would", "woulds", "do"], "would לא מקבל s.", "would – no -s.", { trap: "wl2-s", allow: ["bike"] });
g7a.bank("We'd like ___ the mountain.", ["to visit", "visit", "visits"], "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to" });
g7a.bank("Would you like ___ tea?", ["some", "a some", "any of"], "שימו לב: Would you like some…?", "Would you like some…?", { allow: ["tea"] });
g7a.bank("\"Would you like to come?\" \"I'd ___ to!\"", ["love", "loves", "loving"], "תשובה נלהבת → I'd love to!", "Enthusiastic answer → I'd love to!");
g7a.order("I would like to travel to London.", "I + would like + to + פועל.", "I + would like + to + verb.", { allow: ["london"] });
g7a.order("Would you like to see the theater?", "שאלה: Would + you + like + to + פועל?", "Would you like to + verb?");
g7a.sort(["like (always)", "would like (now)"], [["I … chocolate. It's my favorite.", "like (always)"], ["I … a sandwich, please.", "would like (now)"], ["She … music.", "like (always)"], ["We … two tickets, please.", "would like (now)"], ["They … sports.", "like (always)"], ["He … some water now.", "would like (now)"]], "אוהב תמיד → like. רוצה עכשיו (בנימוס) → would like.", "Enjoy in general → like. Want now → would like.", { allow: ["chocolate", "favorite", "sandwich", "sports"] });
g7a.match([["Would you like some water?", "Yes, please."], ["Would you like to dance?", "I'd love to!"], ["What would you like?", "A sandwich, please."], ["Would you like more soup?", "No, thank you."]], "הזמנה / הצעה ותשובה מנומסת.", "Invitation / offer and a polite answer.", { allow: ["dance", "sandwich", "thank"] });

const g7b = itemSet(T, "wd", 2, 7);
g7b.type("I ___ to be a science teacher.", "would like", ["would like", "'d like"], "רצון → would like to be.", "Wish → would like to be.");
g7b.type("What ___ you like to eat?", "would", "would", "שימו לב: What would you like…?", "What would you like…?");
g7b.type("I ___ like to live in a big city. I love my village.", "would – not", ["wouldn't", "would not"], "שלילה → wouldn't like.", "Negative → wouldn't like.", { allow: ["city"] });
g7b.type("Would you like ___ to the club with me?", "come", "to come", "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to" });
g7b.mcq("\"___ would you like to go?\" \"To the river.\"", ["Where", "What", "Who"], "התשובה היא מקום → Where.", "A place → Where.");
g7b.fix("I *like a glass of water, please.", ["'d like", "would like"], "בקשה עכשיו → I'd like.", "Request now → I'd like.", { trap: "wl2-like" });
g7b.fix("She *woulds like a new color.", ["would"], "would לא מקבל s.", "would – no -s.", { trap: "wl2-s" });
g7b.fix("We'd like *go to the theater.", ["to go"], "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to" });
g7b.transform("I want a lemon.", "Say it politely with 'would like'.", "אמרו את זה בנימוס עם would like", ["I would like a lemon.", "I'd like a lemon.", "I would like a lemon, please.", "I'd like a lemon, please."], "בנימוס: I'd like…", "Polite → I'd like…");
g7b.transform("You want to join the club.", "Make it an invitation (Would you…?).", "הפכו להזמנה (Would you…?)", ["Would you like to join the club?"], "הזמנה: Would you like to join…?", "Would you like to join…?");
g7b.order("What would you like to do this weekend?", "What + would + you + like + to + פועל?", "What would you like to do?");
g7b.cloze("Lunch time", "Waiter: \"What {1} you like?\" Maya: \"I'd like {2} pizza, please.\" Waiter: \"Would you like {3} drink?\" Maya: \"Yes, I'd like {4} water, please.\"", [["would", "would"], ["a", "a"], ["something to", ["something to", "a"]], ["some", ["some", "a glass of"]]], "שאלות והזמנות: What would you like? I'd like a… Would you like something to drink?", "What would you like? I'd like a… / some…", { allow: ["waiter", "pizza", "glass"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "wd", 1, 8);
g8a.mcq("I ___ two tickets for the concert, please.", ["'d like", "like", "would"], "בקשה מנומסת עכשיו → I'd like.", "Polite request now → I'd like.", { trap: "wl2-like" });
g8a.mcq("___ you like to come to the café?", ["Would", "Do", "Are"], "הזמנה → Would you like…?", "Invitation → Would you like…?", { trap: "wl2-do" });
g8a.mcq("My sister would like ___ an actor.", ["to become", "become", "becoming"], "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to" });
g8a.mcq("\"Would you like more cream?\" \"No, ___.\"", ["thank you", "I don't like", "I wouldn't"], "סירוב מנומס → No, thank you.", "Polite refusal → No, thank you.", { allow: ["thank"] });
g8a.mcq("My uncle ___ like to open a café.", ["would", "woulds", "does"], "would לא מקבל s.", "would – no -s.", { trap: "wl2-s" });
g8a.bank("We'd like ___ abroad next year.", ["to travel", "travel", "travels"], "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to" });
g8a.bank("Would you like ___ cake?", ["some", "a some", "any of"], "שימו לב: Would you like some…?", "Would you like some…?");
g8a.bank("\"Would you like to see the show?\" \"I'd ___ to!\"", ["love", "loves", "loving"], "תשובה נלהבת → I'd love to!", "Enthusiastic → I'd love to!", { allow: ["show"] });
g8a.order("I would like to learn to cook.", "I + would like + to + פועל.", "I + would like + to + verb.");
g8a.order("Would you like to play the drums?", "שאלה: Would + you + like + to + פועל?", "Would you like to + verb?");
g8a.sort(["like (always)", "would like (now)"], [["I … cooking. It's my hobby.", "like (always)"], ["I … a coffee, please.", "would like (now)"], ["He … concerts.", "like (always)"], ["We … a table for four.", "would like (now)"], ["They … traveling.", "like (always)"], ["She … the menu, please.", "would like (now)"]], "אוהב תמיד → like. רוצה עכשיו (בנימוס) → would like.", "Enjoy in general → like. Want now → would like.", { allow: ["hobby", "menu"] });
g8a.match([["Would you like a drink?", "Yes, please."], ["Would you like to come to the concert?", "I'd love to!"], ["What would you like to eat?", "The traditional dish, please."], ["Would you like dessert?", "No, thank you."]], "הזמנה / הצעה ותשובה מנומסת.", "Invitation / offer and a polite answer.", { allow: ["dessert", "thank"] });

const g8b = itemSet(T, "wd", 2, 8);
g8b.type("I ___ to work in a big company one day.", "would like", ["would like", "'d like"], "רצון → would like to work.", "Wish → would like to work.");
g8b.type("Where ___ you like to travel?", "would", "would", "שימו לב: Where would you like…?", "Where would you like…?");
g8b.type("I ___ like to be famous. It's too stressful.", "would – not", ["wouldn't", "would not"], "שלילה → wouldn't like.", "Negative → wouldn't like.", { allow: ["famous", "stressful"] });
g8b.type("Would you like ___ the movie with us?", "watch", "to watch", "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to" });
g8b.mcq("\"___ would you like to drink?\" \"Orange juice.\"", ["What", "Where", "Who"], "התשובה היא דבר → What.", "A thing → What.", { allow: ["orange", "juice"] });
g8b.fix("I *like the chicken, please.", ["'d like", "would like"], "הזמנה במסעדה → I'd like.", "Ordering now → I'd like.", { trap: "wl2-like", allow: ["chicken"] });
g8b.fix("He *woulds like to record a song.", ["would"], "would לא מקבל s.", "would – no -s.", { trap: "wl2-s" });
g8b.fix("We'd like *visit the museum.", ["to visit"], "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to" });
g8b.transform("I want the menu.", "Say it politely with 'would like'.", "אמרו את זה בנימוס עם would like", ["I would like the menu.", "I'd like the menu.", "I would like the menu, please.", "I'd like the menu, please."], "בנימוס: I'd like…", "Polite → I'd like…", { allow: ["menu"] });
g8b.transform("You want to come to my concert.", "Make it an invitation (Would you…?).", "הפכו להזמנה (Would you…?)", ["Would you like to come to my concert?"], "הזמנה: Would you like to come…?", "Would you like to come…?");
g8b.order("Which dish would you like to try?", "Which + שם עצם + would + you + like + to + פועל?", "Which dish would you like to try?");
g8b.cloze("Planning a party", "\"{1} you like to come to my party on Friday?\" \"I'd {2} to! What would you like me {3} bring?\" \"{4} you like to bring some drinks?\" \"Sure!\"", [["would", "Would"], ["love", "love"], ["to", "to"], ["would", "Would"]], "המבנה: Would you like…? I'd love to. would like + someone + to.", "Would you like…? / I'd love to / would like me to.", { allow: ["sure", "drinks"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "wd", 1, 9);
g9a.mcq("I ___ a vegetarian meal, please.", ["'d like", "like", "would"], "בקשה מנומסת עכשיו → I'd like.", "Polite request now → I'd like.", { trap: "wl2-like" });
g9a.mcq("___ you like to come to the wedding?", ["Would", "Do", "Are"], "הזמנה → Would you like…?", "Invitation → Would you like…?", { trap: "wl2-do" });
g9a.mcq("My cousin would like ___ an architect.", ["to become", "become", "becoming"], "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to", allow: ["cousin"] });
g9a.mcq("\"Would you like a selfie with me?\" \"Yes, ___!\"", ["please", "I like", "I would"], "תשובה מנומסת → Yes, please.", "Polite answer → Yes, please.");
g9a.mcq("My neighbor ___ like a quieter street.", ["would", "woulds", "does"], "would לא מקבל s.", "would – no -s.", { trap: "wl2-s", allow: ["quieter"] });
g9a.bank("We'd like ___ to the island.", ["to sail", "sail", "sails"], "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to" });
g9a.bank("Would you like ___ help with the housework?", ["some", "a some", "any of"], "שימו לב: Would you like some…?", "Would you like some…?");
g9a.bank("\"Would you like to see the exhibition?\" \"I'd ___ to!\"", ["love", "loves", "loving"], "תשובה נלהבת → I'd love to!", "Enthusiastic → I'd love to!");
g9a.order("I would like to interview the firefighter.", "I + would like + to + פועל.", "I + would like + to + verb.");
g9a.order("Would you like to borrow my novel?", "שאלה: Would + you + like + to + פועל?", "Would you like to + verb?");
g9a.sort(["like (always)", "would like (now)"], [["I … documentaries.", "like (always)"], ["I … the vegetarian dish, please.", "would like (now)"], ["She … jokes.", "like (always)"], ["We … a room with a view.", "would like (now)"], ["They … sailing.", "like (always)"], ["He … a receipt, please.", "would like (now)"]], "אוהב תמיד → like. רוצה עכשיו (בנימוס) → would like.", "Enjoy in general → like. Want now → would like.", { allow: ["view"] });
g9a.match([["Would you like a ride home?", "Yes, please."], ["Would you like to come to the gallery?", "I'd love to!"], ["What would you like to order?", "The soup, please."], ["Would you like another slice?", "No, thank you."]], "הזמנה / הצעה ותשובה מנומסת.", "Invitation / offer and a polite answer.", { allow: ["order", "slice", "thank"] });

const g9b = itemSet(T, "wd", 2, 9);
g9b.type("I ___ to study architecture.", "would like", ["would like", "'d like"], "רצון → would like to study.", "Wish → would like to study.", { allow: ["architecture"] });
g9b.type("Who ___ you like to invite to the wedding?", "would", "would", "שימו לב: Who would you like to invite?", "Who would you like…?", { allow: ["invite"] });
g9b.type("I ___ like to live next to a stadium. It's too noisy.", "would – not", ["wouldn't", "would not"], "שלילה → wouldn't like.", "Negative → wouldn't like.");
g9b.type("Would you like ___ the documentary with us?", "watch", "to watch", "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to" });
g9b.mcq("\"___ would you like to sit?\" \"Near the window.\"", ["Where", "What", "Who"], "התשובה היא מקום → Where.", "A place → Where.", { allow: ["sit", "window"] });
g9b.fix("I *like the vegetarian dish, please.", ["'d like", "would like"], "הזמנה עכשיו → I'd like.", "Ordering now → I'd like.", { trap: "wl2-like" });
g9b.fix("She *woulds like to translate novels.", ["would"], "would לא מקבל s.", "would – no -s.", { trap: "wl2-s" });
g9b.fix("We'd like *sail around the island.", ["to sail"], "would like + to + פועל.", "would like + to + verb.", { trap: "wl2-to" });
g9b.transform("I want a receipt.", "Say it politely with 'would like'.", "אמרו את זה בנימוס עם would like", ["I would like a receipt.", "I'd like a receipt.", "I would like a receipt, please.", "I'd like a receipt, please."], "בנימוס: I'd like…", "Polite → I'd like…");
g9b.transform("You want to see the exhibition.", "Make it an invitation (Would you…?).", "הפכו להזמנה (Would you…?)", ["Would you like to see the exhibition?"], "הזמנה: Would you like to see…?", "Would you like to see…?");
g9b.order("Which novel would you like to borrow?", "Which + שם עצם + would + you + like + to + פועל?", "Which novel would you like to borrow?");
g9b.cloze("At the hotel", "Receptionist: \"{1} would you like?\" Guest: \"I'd {2} a room for two nights.\" Receptionist: \"Would you like a room {3} a view?\" Guest: \"Yes, I'd {4} that!\"", [["what", "What"], ["like", "like"], ["with", "with"], ["love", "love"]], "שימו לב: What would you like? I'd like… / I'd love…", "What would you like? I'd like… / I'd love…", { allow: ["receptionist", "guest", "hotel", "nights", "view"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "wd", 3);
l3.mcq("I'd ___ stay home than go out tonight.", ["rather", "like", "prefer"], "would rather … than = מעדיף.", "would rather … than.");
l3.mcq("Would you mind ___ the door?", ["closing", "to close", "close"], "המבנה: Would you mind + ing.", "Would you mind + -ing.");
l3.type("I'd like ___ to meet my best friend.", "you", "you", "would like + someone + to + פועל.", "would like + someone + to + verb.");
l3.type("\"Tea or coffee?\" \"I'd ___ tea, please.\"", "prefer", "prefer", "would prefer = מעדיף.", "would prefer.", { allow: ["tea"] });
l3.mcq("I'd rather ___ than take the bus.", ["walk", "to walk", "walking"], "אחרי would rather – צורת בסיס, בלי to.", "After would rather → base verb.");
l3.fix("Would you mind *to open the window?", ["opening"], "המבנה: Would you mind + ing: opening.", "Would you mind + -ing.", { allow: ["window"] });
l3.fix("*Do you would like some help?", ["Would"], "עם would לא שמים do: Would you like…?", "No do with would.", { trap: "wl2-do" });
l3.transform("Close the window.", "Make it very polite with 'Would you mind…?'.", "הפכו למנומס מאוד עם Would you mind…?", ["Would you mind closing the window?"], "המבנה: Would you mind + closing…?", "Would you mind closing…?", { allow: ["window"] });
l3.transform("I prefer to stay home.", "Say it with 'would rather'.", "אמרו את זה עם would rather", ["I'd rather stay home.", "I would rather stay home."], "would rather + צורת בסיס.", "would rather + base verb.");
l3.sort(["✓ Correct", "✗ Wrong"], [["I'd rather walk.", "✓ Correct"], ["I'd like go home.", "✗ Wrong"], ["Would you mind waiting?", "✓ Correct"], ["Would you mind to wait?", "✗ Wrong"], ["I'd like you to come.", "✓ Correct"], ["Do you would like tea?", "✗ Wrong"]], "התיקונים: I'd like to go · Would you mind waiting · Would you like tea.", "Fixes: I'd like to go · Would you mind waiting · Would you like tea.", { allow: ["tea"] });
l3.cloze("Choosing a restaurant", "\"Would you like {1} out tonight?\" \"Sure! But I'd {2} stay in the neighborhood.\" \"OK. Would you mind {3} the restaurant?\" \"Not at all. I'd like you {4} try the new Italian place.\"", [["go", "to go"], ["rather", "rather"], ["choose", "choosing"], ["to", "to"]], "would like to + פועל. would rather. would you mind + ing. would like you to.", "would like to / would rather / would you mind + -ing / would like you to.", { allow: ["restaurant", "italian", "place", "sure"] });
l3.write("Write a short invitation to a friend and their polite answer. Use would like, I'd love to and would rather.", "כתבו הזמנה קצרה לחבר ותשובה מנומסת שלו. השתמשו ב-would like, I'd love to ו-would rather.", "Would you like to come to the beach on Saturday? – I'd love to! But I'd rather go in the afternoon, because it's too hot in the morning.", "שימו לב: Would you like to…? / I'd love to / I'd rather.", "Would you like to…? / I'd love to / I'd rather.");

export const wouldLikeItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
