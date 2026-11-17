import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG, QUE } from "@/data/grammar/build";

// Band II: VERBS: Future 'WILL + VERB' (+ questions).

export const futureWillTopic: GrammarTopic = {
  id: "future-will",
  group: "tenses",
  title: "Future: will",
  titleHe: "עתיד עם will",
  bandRefs: ["VERBS: Future 'WILL + VERB'", "VERBS: Future 'WILL + VERB' - questions"],
  grades: { 7: "evolving", 8: "evolving", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "עתיד: will + פועל בצורת בסיס", en: "Future: will + base verb", examples: ["I **will help** you.", "It **will be** sunny tomorrow."] },
        { he: "will זהה לכולם – בלי s ובלי to", en: "will is the same for everyone – no -s, no to", examples: ["She **will come**.", "✗ She will comes."] },
        { he: "שלילה: won't = will not", en: "Negative: won't = will not", examples: ["We **won't be** late.", "He **won't** forget."] },
        { he: "שאלה: Will בהתחלה", en: "Question: Will first", examples: ["**Will** you **come** to my party?", "**Will** it **rain**?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "subject + will ('ll) + base verb", example: "They'll win." },
        { kind: "negative", pattern: "subject + won't + base verb", example: "I won't tell anyone." },
        { kind: "question", pattern: "Will + subject + base verb?", example: "Will she call?" },
      ],
      timeWords: ["tomorrow", "next week", "soon", "later", "in the future"],
    },
    2: {
      points: [
        { he: "תחזית – מה אני חושב שיקרה", en: "Predictions – what I think will happen", examples: ["I think it **will rain**.", "You **will love** this movie."] },
        { he: "החלטה של הרגע", en: "Decisions made at the moment of speaking", examples: ["The phone is ringing. I'**ll answer** it!"] },
        { he: "הבטחות והצעות עזרה", en: "Promises and offers", examples: ["I'**ll help** you with your homework.", "I **won't tell** anyone."] },
        { he: "קיצורים: I'll, she'll, won't", en: "Short forms: I'll, she'll, won't", examples: ["I'll", "you'll", "she'll", "won't"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "will / 'll + base verb", example: "I'll carry that for you." },
        { kind: "negative", pattern: "won't + base verb", example: "It won't take long." },
        { kind: "question", pattern: "(Wh-) + will + subject + base verb?", example: "When will you be ready?" },
        { kind: "short_answer", pattern: "Yes, … will. No, … won't.", example: "Yes, I will." },
      ],
      timeWords: ["tomorrow", "next year", "I think", "probably", "I promise"],
    },
    3: {
      points: [
        { he: "תחזית עם think / probably / maybe", en: "Predictions with think / probably / maybe", examples: ["She **will probably** win.", "I don't think it **will** work."] },
        { he: "אחרי when / if / as soon as – הווה, לא will", en: "After when / if / as soon as – present, not will", examples: ["When I **get** home, I'**ll call** you.", "✗ When I will get home"] },
        { he: "בקשות מנומסות: Will you…?", en: "Requests: Will you…?", examples: ["**Will** you **close** the door, please?"] },
        { he: "יהיה / יהיו = there will be", en: "there will be", examples: ["There **will be** a test on Monday."] },
      ],
      form: [
        { kind: "affirmative", pattern: "will + probably / definitely + base verb", example: "It will definitely snow." },
        { kind: "affirmative", pattern: "When / If + present, … will + base verb", example: "If it rains, we'll stay home." },
      ],
      timeWords: ["probably", "definitely", "as soon as", "in ten years"],
    },
  },
  traps: [
    { id: "wl-s", wrong: "She will comes tomorrow.", right: "She will come tomorrow.", whyHe: "אחרי will – צורת בסיס, בלי s.", whyEn: "After will → base verb, no -s." },
    { id: "wl-to", wrong: "I will to help you.", right: "I will help you.", whyHe: "אחרי will לא שמים to.", whyEn: "No to after will." },
    { id: "wl-present", wrong: "I promise I help you.", right: "I promise I'll help you.", whyHe: "הבטחה לעתיד → I'll help.", whyEn: "A promise about the future → I'll help." },
    { id: "wl-when", wrong: "When I will arrive, I'll call you.", right: "When I arrive, I'll call you.", whyHe: "אחרי when לעתיד – הווה פשוט.", whyEn: "After when (future) → present simple." },
    { id: "wl-wont", wrong: "I willn't go.", right: "I won't go.", whyHe: "את will not מקצרים ל-won't.", whyEn: "will not = won't." },
  ],
};

const T = "future-will";

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "wl", 1, 7);
g7a.mcq("Don't worry, I ___ you with your homework.", ["will help", "will helps", "will to help"], "will + צורת בסיס: will help.", "will + base verb: will help.", { trap: "wl-to" });
g7a.mcq("My team ___ the game tomorrow, I'm sure.", ["will win", "will wins", "wins"], "will + צורת בסיס, בלי s: will win.", "will + base verb, no -s.", { trap: "wl-s" });
g7a.mcq("It ___ cold in the mountains tonight.", ["will be", "will is", "be"], "עתיד של be: will be.", "Future of be: will be.");
g7a.mcq("I ___ be late. I promise!", ["won't", "not will", "don't"], "שלילה בעתיד: will not = won't.", "will not = won't.", { trap: "wl-wont" });
g7a.mcq("___ you join our club next year?", ["Will", "Do", "Are"], "שאלה בעתיד: Will + you + פועל?", "Future question: Will you…?");
g7a.bank("Next summer we ___ to a village in the north.", ["will travel", "traveled", "travels"], "Next summer = עתיד: will travel.", "Next summer → will travel.", { allow: ["north"] });
g7a.bank("The guide ___ meet us at the bridge.", ["will", "is", "does"], "עתיד: The guide will meet us.", "Future: will meet.");
g7a.bank("Will they ___ for the meal?", ["pay", "pays", "paid"], "אחרי Will – צורת בסיס: pay.", "After Will → pay.");
g7a.order("I will call you later.", "מי + will + פועל + מתי.", "Who + will + verb + when.");
g7a.order("Will the river be dangerous?", "שאלה: Will + the river + be…?", "Question: Will + the river + be…?");
g7a.sort(["✓ Correct", "✗ Wrong"], [["She will come.", "✓ Correct"], ["He will plays.", "✗ Wrong"], ["We won't go.", "✓ Correct"], ["I will to help.", "✗ Wrong"], ["Will you help?", "✓ Correct"], ["They willn't come.", "✗ Wrong"]], "will + צורת בסיס. שלילה: won't.", "will + base verb. Negative: won't.");
g7a.match([["Don't worry,", "I'll help you."], ["The phone is ringing!", "I'll answer it."], ["It's very dark.", "I'll turn on the light."], ["I'm hungry.", "I'll make a sandwich."]], "החלטה של הרגע → I'll + פועל.", "A decision now → I'll + verb.", { allow: ["sandwich", "turn"] });

const g7b = itemSet(T, "wl", 2, 7);
g7b.type("I think it ___ tomorrow.", "rain", ["will rain", "'ll rain"], "תחזית: will rain.", "Prediction → will rain.", { allow: ["rain"] });
g7b.type("Wait! I ___ you with that heavy bag.", "help", ["will help", "'ll help"], "הצעת עזרה של הרגע → I'll help.", "Offer now → I'll help.");
g7b.type("Don't tell Dad. He ___ happy about it.", "not / be", ["won't be", "will not be"], "שלילה בעתיד: won't be.", "Future negative: won't be.");
g7b.type("___ your parents drive us to the club?", "will", "Will", "שאלה בעתיד: Will + your parents + drive?", "Will your parents drive…?");
g7b.mcq("When ___ the journey start?", ["will", "does it", "is"], "שאלה בעתיד: When will the journey start?", "When will … start?");
g7b.fix("My sister will *comes to the theater with us.", ["come"], "אחרי will – צורת בסיס: come.", "After will → come.", { trap: "wl-s" });
g7b.fix("I will *sends you the list.", ["send"], "אחרי will – צורת בסיס, בלי s: send.", "After will → send.", { trap: "wl-s" });
g7b.fix("I promise I *pay you back tomorrow.", ["will pay", "'ll pay"], "הבטחה לעתיד → I will pay.", "Promise → I will pay.", { trap: "wl-present" });
g7b.transform("The team will practice on Friday.", ...NEG, ["The team won't practice on Friday.", "The team will not practice on Friday."], "שלילה: won't + practice.", "won't practice.");
g7b.transform("She will join the band.", ...QUE, "Will she join the band?", "בשאלה Will עובר להתחלה.", "Will goes first.");
g7b.order("What will you do after school?", "מילת שאלה + will + you + פועל?", "Wh- + will + you + verb?");
g7b.cloze("Next year", "Next year I {1} to a new school. I think I {2} new friends. My best friend {3} with me, but we {4} every weekend. I'm sure it {5} fine!", [["go", ["will go", "'ll go"]], ["make", ["will make", "'ll make"]], ["not / come", ["won't come", "will not come"]], ["meet", ["will meet", "'ll meet"]], ["be", ["will be", "'ll be"]]], "עתיד: will + צורת בסיס. שלילה: won't.", "Future: will + base verb. Negative: won't.");

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "wl", 1, 8);
g8a.mcq("Don't worry, I ___ you to the airport.", ["will drive", "will drives", "will to drive"], "will + צורת בסיס: will drive.", "will + base verb.", { trap: "wl-to" });
g8a.mcq("The concert ___ at eight, I think.", ["will start", "will starts", "starts will"], "will + צורת בסיס, בלי s: will start.", "will + base verb, no -s.", { trap: "wl-s" });
g8a.mcq("It ___ a great adventure!", ["will be", "will is", "be"], "עתיד של be: will be.", "Future of be: will be.");
g8a.mcq("I ___ forget your birthday this year. I promise!", ["won't", "not will", "don't"], "שלילה בעתיד: will not = won't.", "will not = won't.", { trap: "wl-wont" });
g8a.mcq("___ you come to my concert on Friday?", ["Will", "Do", "Are"], "שאלה בעתיד: Will you…?", "Future question: Will you…?");
g8a.bank("Next year my brother ___ at a big company.", ["will work", "worked", "works"], "Next year = עתיד: will work.", "Next year → will work.");
g8a.bank("The plane ___ land in an hour.", ["will", "is", "does"], "עתיד: The plane will land.", "Future: will land.");
g8a.bank("Will the tickets ___ a lot?", ["cost", "costs", "costed"], "אחרי Will – צורת בסיס: cost.", "After Will → cost.");
g8a.order("I will download the song tonight.", "מי + will + פועל + מה + מתי.", "Who + will + verb + what + when.");
g8a.order("Will the café be open on Saturday?", "שאלה: Will + the café + be…?", "Question: Will + the café + be…?");
g8a.sort(["✓ Correct", "✗ Wrong"], [["They will travel abroad.", "✓ Correct"], ["She will buys it.", "✗ Wrong"], ["I won't be late.", "✓ Correct"], ["We will to cook.", "✗ Wrong"], ["Will he call?", "✓ Correct"], ["He willn't come.", "✗ Wrong"]], "will + צורת בסיס. שלילה: won't.", "will + base verb. Negative: won't.");
g8a.match([["The doorbell is ringing!", "I'll open the door."], ["This box is heavy.", "I'll carry it for you."], ["I'm thirsty.", "I'll get some water."], ["The cake looks great!", "I'll take a photo."]], "החלטה של הרגע → I'll + פועל.", "A decision now → I'll + verb.", { allow: ["doorbell", "box", "thirsty"] });

const g8b = itemSet(T, "wl", 2, 8);
g8b.type("I think the traffic ___ terrible tomorrow.", "be", ["will be", "'ll be"], "תחזית: will be.", "Prediction → will be.");
g8b.type("You look tired. I ___ the dishes tonight.", "wash", ["will wash", "'ll wash"], "הצעת עזרה של הרגע → I'll wash.", "Offer now → I'll wash.");
g8b.type("Don't worry. It ___ long.", "not / take", ["won't take", "will not take"], "שלילה בעתיד: won't take.", "Future negative: won't take.");
g8b.type("___ the director choose me for the role?", "will", "Will", "שאלה בעתיד: Will + the director + choose?", "Will the director choose…?");
g8b.mcq("How long ___ the flight take?", ["will", "does it", "is"], "שאלה בעתיד: How long will the flight take?", "How long will … take?");
g8b.fix("I'm sure my sister will *loves the gift.", ["love"], "אחרי will – צורת בסיס: love.", "After will → love.", { trap: "wl-s", allow: ["gift"] });
g8b.fix("We will *decorated the room tomorrow.", ["decorate"], "אחרי will – צורת בסיס: decorate.", "After will → decorate.", { trap: "wl-s" });
g8b.fix("I promise I *call you when I land.", ["will call", "'ll call"], "הבטחה לעתיד → I will call.", "Promise → I will call.", { trap: "wl-present" });
g8b.transform("The museum will open on Sunday.", ...NEG, ["The museum won't open on Sunday.", "The museum will not open on Sunday."], "שלילה: won't + open.", "won't open.");
g8b.transform("They will win the competition.", ...QUE, "Will they win the competition?", "בשאלה Will עובר להתחלה.", "Will goes first.");
g8b.order("Where will you stay in Paris?", "מילת שאלה + will + you + פועל?", "Wh- + will + you + verb?", { allow: ["paris"] });
g8b.cloze("My plans", "After school I {1} the bus home. Then I {2} my mom with dinner. I {3} to cook pasta. I hope my family {4} it. I {5} any salt this time!", [["take", ["will take", "'ll take"]], ["help", ["will help", "'ll help"]], ["try", ["will try", "'ll try"]], ["like", "will like"], ["not / forget", ["won't forget", "will not forget"]]], "עתיד: will + צורת בסיס. שלילה: won't.", "Future: will + base verb. Negative: won't.", { allow: ["pasta", "hope", "forget"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "wl", 1, 9);
g9a.mcq("Don't worry, I ___ the oven later.", ["will repair", "will repairs", "will to repair"], "will + צורת בסיס: will repair.", "will + base verb.", { trap: "wl-to" });
g9a.mcq("The wedding ___ at seven, I think.", ["will start", "will starts", "starts will"], "will + צורת בסיס, בלי s: will start.", "will + base verb, no -s.", { trap: "wl-s" });
g9a.mcq("The marathon ___ very hard this year.", ["will be", "will is", "be"], "עתיד של be: will be.", "Future of be: will be.");
g9a.mcq("I ___ post that selfie. I promise!", ["won't", "not will", "don't"], "שלילה בעתיד: will not = won't.", "will not = won't.", { trap: "wl-wont" });
g9a.mcq("___ you lend me your charger?", ["Will", "Do", "Are"], "בקשה / שאלה בעתיד: Will you…?", "Request: Will you…?", { allow: ["charger"] });
g9a.bank("Next year my cousin ___ at the university.", ["will study", "studied", "studies"], "Next year = עתיד: will study.", "Next year → will study.", { allow: ["cousin"] });
g9a.bank("The firefighters ___ arrive in five minutes.", ["will", "are", "do"], "עתיד: The firefighters will arrive.", "Future: will arrive.", { allow: ["arrive"] });
g9a.bank("Will the elevator ___ today?", ["work", "works", "worked"], "אחרי Will – צורת בסיס: work.", "After Will → work.");
g9a.order("I will translate the article tonight.", "מי + will + פועל + מה + מתי.", "Who + will + verb + what + when.");
g9a.order("Will the gallery be open tomorrow?", "שאלה: Will + the gallery + be…?", "Question: Will + the gallery + be…?");
g9a.sort(["✓ Correct", "✗ Wrong"], [["They will sail tomorrow.", "✓ Correct"], ["She will borrows it.", "✗ Wrong"], ["I won't complain.", "✓ Correct"], ["We will to interview him.", "✗ Wrong"], ["Will he repair it?", "✓ Correct"], ["It willn't work.", "✗ Wrong"]], "will + צורת בסיס. שלילה: won't.", "will + base verb. Negative: won't.");
g9a.match([["Someone is knocking!", "I'll see who it is."], ["The sink is wet.", "I'll wipe it."], ["The phone is ringing.", "I'll answer it."], ["I can't find my wallet.", "I'll help you look."]], "החלטה של הרגע → I'll + פועל.", "A decision now → I'll + verb.");

const g9b = itemSet(T, "wl", 2, 9);
g9b.type("I think the new app ___ very popular.", "become", ["will become", "'ll become"], "תחזית: will become.", "Prediction → will become.");
g9b.type("You're busy. I ___ the housework today.", "do", ["will do", "'ll do"], "הצעת עזרה של הרגע → I'll do.", "Offer now → I'll do.");
g9b.type("Don't lend him money. He ___ it back.", "not / pay", ["won't pay", "will not pay"], "שלילה בעתיד: won't pay.", "Future negative: won't pay.");
g9b.type("___ the neighbors complain about the party?", "will", "Will", "שאלה בעתיד: Will + the neighbors + complain?", "Will the neighbors complain…?");
g9b.mcq("What time ___ the exhibition open?", ["will", "does it", "is"], "שאלה בעתיד: What time will the exhibition open?", "What time will … open?");
g9b.fix("I'm sure the firefighter will *saves the cat.", ["save"], "אחרי will – צורת בסיס: save.", "After will → save.", { trap: "wl-s" });
g9b.fix("We will *sailing to the island next week.", ["sail"], "אחרי will – צורת בסיס: sail.", "After will → sail.", { trap: "wl-s" });
g9b.fix("I promise I *return your novel on Monday.", ["will return", "'ll return"], "הבטחה לעתיד → I will return.", "Promise → I will return.", { trap: "wl-present" });
g9b.transform("The elevator will work tomorrow.", ...NEG, ["The elevator won't work tomorrow.", "The elevator will not work tomorrow."], "שלילה: won't + work.", "won't work.");
g9b.transform("She will translate the speech.", ...QUE, "Will she translate the speech?", "בשאלה Will עובר להתחלה.", "Will goes first.");
g9b.order("Who will you invite to the wedding?", "מילת שאלה + will + you + פועל?", "Wh- + will + you + verb?", { allow: ["invite"] });
g9b.cloze("Life in 2050", "In 2050 people {1} in smart homes. Robots {2} the housework, and cars {3} themselves. Maybe we {4} need phones at all. I hope the planet {5} cleaner!", [["live", ["will live", "'ll live"]], ["do", "will do"], ["drive", "will drive"], ["not", ["won't", "will not"]], ["be", "will be"]], "תחזית לעתיד: will + צורת בסיס. שלילה: won't.", "Predictions: will + base verb. Negative: won't.", { allow: ["smart", "robots", "themselves", "hope", "cleaner"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "wl", 3);
l3.mcq("When I ___ home, I'll call you.", ["get", "will get", "got"], "אחרי when לעתיד – הווה פשוט: get.", "After when (future) → present: get.", { trap: "wl-when" });
l3.mcq("She ___ win – she's the best player.", ["will probably", "probably will to", "will probable"], "will + probably + פועל.", "will + probably + verb.");
l3.type("If it rains, we ___ at home.", "stay", ["will stay", "'ll stay"], "If + הווה, will + פועל: will stay.", "If + present, will + verb.", { allow: ["rains"] });
l3.type("I don't think the plan ___ .", "work", "will work", "אחרי I don't think – will: will work.", "I don't think … will work.");
l3.fix("When she *arrive, we'll start the meeting.", ["arrives"], "אחרי when לעתיד – הווה פשוט: she arrives.", "After when (future) → present: arrives.", { trap: "wl-when", allow: ["arrive", "arrives", "meeting"] });
l3.fix("If it *rain tomorrow, we'll stay at home.", ["rains"], "אחרי if לעתיד – הווה פשוט, ועם it מוסיפים s: rains.", "After if (future) → present: rains.", { trap: "wl-when", allow: ["rain"] });
l3.fix("There will *have a test on Monday.", ["be"], "there will be (לא will have).", "there will be.");
l3.transform("You will close the door.", "Make it a polite request.", "הפכו לבקשה מנומסת", ["Will you close the door, please?", "Will you close the door?", "Will you please close the door?"], "בקשה: Will you…, please?", "Request: Will you…, please?");
l3.transform("I think it will snow tomorrow.", "Make it negative (I don't think…).", "הפכו לשלילה (I don't think…)", ["I don't think it will snow tomorrow.", "I do not think it will snow tomorrow."], "שלילה: I don't think + it will snow.", "I don't think it will snow.");
l3.sort(["✓ Correct", "✗ Wrong"], [["When she arrives, we'll start.", "✓ Correct"], ["If you will come, I'll be happy.", "✗ Wrong"], ["It will definitely rain.", "✓ Correct"], ["There will have a party.", "✗ Wrong"], ["Will you help me, please?", "✓ Correct"], ["He will to call you.", "✗ Wrong"]], "התיקונים: If you come · There will be · He will call.", "Fixes: If you come · There will be · He will call.", { allow: ["arrives", "rain"] });
l3.cloze("A fortune teller", "\"You {1} a lot of money,\" said the fortune teller. \"When you {2} 30, you {3} a famous actor. You {4} have any problems, and you {5} very happy.\"", [["make", "will make"], ["be", "are"], ["become", "will become"], ["not", ["won't", "will not"]], ["be", "will be"]], "תחזיות: will + פועל. אחרי when – הווה: are.", "Predictions: will + verb. After when → present: are.", { allow: ["fortune", "teller", "famous"] });
l3.write("Write four predictions about your life in ten years. Use will, won't and probably.", "כתבו ארבע תחזיות על החיים שלכם בעוד עשר שנים. השתמשו ב-will, won't ו-probably.", "In ten years I will probably live in Tel Aviv. I will work as a doctor. I won't live with my parents. I think I will travel a lot.", "will / won't + צורת בסיס.", "will / won't + base verb.");

export const futureWillItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
