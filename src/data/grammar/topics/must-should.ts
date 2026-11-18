import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG, QUE } from "@/data/grammar/build";

// Band II: MODALITY: Must (obligation / necessity), Should (giving and asking for advice).

export const mustShouldTopic: GrammarTopic = {
  id: "must-should",
  group: "modals",
  title: "must / should",
  titleHe: "must / should – חובה ועצה",
  bandRefs: ["MODALITY: Must", "MODALITY: Should"],
  grades: { 7: "evolving", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "must = חייב (חוק, כלל)", en: "must = you have to (a rule)", examples: ["You **must wear** a uniform.", "We **must be** quiet."] },
        { he: "should = כדאי (עצה)", en: "should = it's a good idea (advice)", examples: ["You **should drink** water.", "He **should sleep** more."] },
        { he: "אחרי must / should – צורת בסיס, בלי to", en: "After must / should – base verb, no to", examples: ["She **must go**.", "✗ She must to go."] },
        { he: "mustn't = אסור, shouldn't = לא כדאי", en: "mustn't = not allowed; shouldn't = not a good idea", examples: ["You **mustn't** run here.", "You **shouldn't** eat so much sugar."] },
      ],
      form: [
        { kind: "affirmative", pattern: "subject + must / should + base verb", example: "You should try it." },
        { kind: "negative", pattern: "mustn't / shouldn't + base verb", example: "You mustn't touch it." },
        { kind: "question", pattern: "Should + subject + base verb?", example: "Should I call her?" },
      ],
      timeWords: ["must", "mustn't", "should", "shouldn't"],
    },
    2: {
      points: [
        { he: "must – חובה חזקה", en: "must – strong obligation", examples: ["All students **must** bring their books."] },
        { he: "should – עצה או דעה", en: "should – advice or opinion", examples: ["I think you **should** see a doctor."] },
        { he: "mustn't (אסור) ≠ don't have to (לא חייבים)", en: "mustn't (forbidden) ≠ don't have to (not necessary)", examples: ["You **mustn't** smoke here.", "You **don't have to** come – it's optional."] },
        { he: "Should I…? – בקשת עצה", en: "Should I…? – asking for advice", examples: ["**Should** I tell my mom?", "What **should** I do?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "I think + subject + should + base verb", example: "I think you should rest." },
        { kind: "negative", pattern: "don't / doesn't have to + base verb (not necessary)", example: "She doesn't have to pay." },
        { kind: "question", pattern: "Wh- + should + subject + base verb?", example: "Where should we meet?" },
      ],
      timeWords: ["I think", "rules", "signs", "advice"],
    },
    3: {
      points: [
        { he: "must – מסקנה הגיונית (בטח)", en: "must – a logical conclusion", examples: ["You've worked all day. You **must** be tired."] },
        { he: "have to – חובה מבחוץ, גם בעבר ובעתיד", en: "have to – obligation in other tenses", examples: ["I **had to** wake up early.", "We'**ll have to** wait."] },
        { he: "should have + V3 – חרטה (היה כדאי)", en: "should have + V3 – regret", examples: ["I **should have** studied more."] },
        { he: "ought to = should (רשמי יותר)", en: "ought to = should (more formal)", examples: ["You **ought to** apologize."] },
      ],
      form: [
        { kind: "affirmative", pattern: "had to / will have to + base verb", example: "She had to leave." },
        { kind: "affirmative", pattern: "should have + past participle", example: "We should have left earlier." },
      ],
      timeWords: ["had to", "will have to", "should have", "ought to"],
    },
  },
  traps: [
    { id: "ms-to", wrong: "You must to wear a helmet.", right: "You must wear a helmet.", whyHe: "אחרי must / should לא שמים to.", whyEn: "No to after must / should." },
    { id: "ms-s", wrong: "She shoulds rest.", right: "She should rest.", whyHe: "must / should לא מקבלים s.", whyEn: "must / should never take -s." },
    { id: "ms-verb-s", wrong: "He must goes now.", right: "He must go now.", whyHe: "אחרי must – צורת בסיס, בלי s.", whyEn: "After must → base verb." },
    { id: "ms-mustnt", wrong: "You mustn't come – it's optional.", right: "You don't have to come – it's optional.", whyHe: "mustn't = אסור. לא חייבים = don't have to.", whyEn: "mustn't = forbidden; don't have to = not necessary." },
    { id: "ms-past", wrong: "Yesterday I must study.", right: "Yesterday I had to study.", whyHe: "ל-must אין עבר – משתמשים ב-had to.", whyEn: "must has no past – use had to." },
  ],
};

const T = "must-should";
const B = ["must / mustn't (rule)", "should / shouldn't (advice)"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "ms", 1, 7);
g7a.mcq("You ___ wear a uniform at our school. It's a rule.", ["must", "should to", "musts"], "כלל → must.", "A rule → must.", { trap: "ms-s" });
g7a.mcq("You look tired. You ___ go to bed early.", ["should", "must to", "shoulds"], "עצה → should.", "Advice → should.");
g7a.mcq("We must ___ careful near the river.", ["be", "to be", "are"], "אחרי must – צורת בסיס: be.", "After must → be.", { trap: "ms-to" });
g7a.mcq("You ___ swim in the river. It's dangerous!", ["mustn't", "don't must", "not must"], "אסור → mustn't.", "Forbidden → mustn't.");
g7a.mcq("___ I bring a list to the club?", ["Should", "Do should", "Must I to"], "בקשת עצה → Should I…?", "Asking for advice → Should I…?");
g7a.bank("You ___ eat so much salt. It isn't healthy.", ["shouldn't", "mustn't to", "don't should"], "עצה בשלילה → shouldn't.", "Negative advice → shouldn't.");
g7a.bank("Players must ___ the guide's instructions.", ["follow", "to follow", "follows"], "אחרי must – צורת בסיס: follow.", "After must → follow.", { trap: "ms-verb-s" });
g7a.bank("My sister ___ study more for the test.", ["should", "shoulds", "should to"], "עצה → should, בלי s.", "Advice → should (no -s).", { trap: "ms-s" });
g7a.order("You should help your mom.", "מי + should + פועל.", "Who + should + verb.");
g7a.order("We mustn't run in the office.", "מי + mustn't + פועל.", "Who + mustn't + verb.");
g7a.sort(B, [["Stop at the red light.", "must / mustn't (rule)"], ["Drink more water.", "should / shouldn't (advice)"], ["No phones in the test.", "must / mustn't (rule)"], ["Go to bed early.", "should / shouldn't (advice)"], ["Wear a seat belt.", "must / mustn't (rule)"], ["Eat more fruit.", "should / shouldn't (advice)"]], "כלל / חוק → must. עצה → should.", "Rule → must. Advice → should.", { allow: ["red", "light", "phones", "seat", "belt", "fruit"] });
g7a.match([["I'm always tired.", "You should sleep more."], ["I have a headache.", "You should rest."], ["The sign says 'Quiet!'", "We mustn't make noise."], ["It's the school rule.", "You must wear a uniform."]], "עצה → should. כלל / שלט → must / mustn't.", "Advice → should; rule / sign → must / mustn't.", { allow: ["headache", "sign"] });

const g7b = itemSet(T, "ms", 2, 7);
g7b.type("I think you ___ say sorry to your friend.", "should", "should", "I think + עצה → should.", "I think + advice → should.");
g7b.type("Students ___ use phones during the test.", "must – not", ["mustn't", "must not"], "אסור → mustn't.", "Forbidden → mustn't.", { allow: ["phones"] });
g7b.type("You don't ___ come early. We start at ten.", "have to", "have to", "לא חייבים → don't have to.", "Not necessary → don't have to.", { trap: "ms-mustnt" });
g7b.type("What ___ I do? I lost my key.", "should", "should", "בקשת עצה → What should I do?", "Asking for advice → What should I do?", { allow: ["lost"] });
g7b.mcq("You ___ eat in the theater. It's not allowed.", ["mustn't", "don't have to", "shouldn't to"], "אסור → mustn't.", "Not allowed → mustn't.", { trap: "ms-mustnt", allow: ["allowed"] });
g7b.mcq("You must ___ a helmet on your bike.", ["wear", "to wear", "wears"], "אחרי must – צורת בסיס, בלי to.", "No to after must.", { trap: "ms-to", allow: ["helmet", "bike"] });
g7b.fix("He should *goes to the doctor.", ["go"], "אחרי should – צורת בסיס: go.", "After should → go.", { trap: "ms-verb-s", allow: ["doctor"] });
g7b.fix("My mom *shoulds work less.", ["should"], "should לא מקבל s.", "should – no -s.", { trap: "ms-s" });
g7b.transform("You should eat the meal now.", ...NEG, ["You shouldn't eat the meal now.", "You should not eat the meal now."], "שלילה: shouldn't + eat.", "shouldn't eat.");
g7b.transform("I should join the team.", ...QUE, "Should I join the team?", "שאלה: Should + I + join?", "Should I join…?");
g7b.order("You must be quiet in the theater.", "מי + must + be + …", "Who + must + be…");
g7b.cloze("Rules for the journey", "Before the journey, the guide told us the rules. \"You {1} bring water and a hat. You {2} walk near the river – it's dangerous. You {3} bring food – we have meals. And you {4} wear good shoes.\"", [["must", "must"], ["must – not", ["mustn't", "must not"]], ["not / have to", ["don't have to", "do not have to"]], ["should", ["should", "must"]]], "חובה → must. אסור → mustn't. לא חייבים → don't have to. עצה → should.", "must / mustn't / don't have to / should.", { allow: ["hat", "shoes", "rules"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "ms", 1, 8);
g8a.mcq("You ___ wear a seat belt in the car. It's the law.", ["must", "should to", "musts"], "חוק → must.", "The law → must.", { trap: "ms-s", allow: ["seat", "belt", "law"] });
g8a.mcq("You look pale. You ___ see a doctor.", ["should", "must to", "shoulds"], "עצה → should.", "Advice → should.", { allow: ["pale", "doctor"] });
g8a.mcq("Passengers must ___ their tickets.", ["show", "to show", "shows"], "אחרי must – צורת בסיס: show.", "After must → show.", { trap: "ms-to" });
g8a.mcq("You ___ use your phone on the plane during takeoff.", ["mustn't", "don't must", "not must"], "אסור → mustn't.", "Forbidden → mustn't.", { allow: ["takeoff"] });
g8a.mcq("___ I book the tickets online?", ["Should", "Do should", "Must I to"], "בקשת עצה → Should I…?", "Asking for advice → Should I…?");
g8a.bank("You ___ drink so much coffee.", ["shouldn't", "mustn't to", "don't should"], "עצה בשלילה → shouldn't.", "Negative advice → shouldn't.");
g8a.bank("Visitors must ___ quiet in the museum.", ["be", "to be", "are"], "אחרי must – צורת בסיס: be.", "After must → be.", { trap: "ms-verb-s", allow: ["visitors"] });
g8a.bank("My brother ___ apologize to his friend.", ["should", "shoulds", "should to"], "עצה → should, בלי s.", "Advice → should (no -s).", { trap: "ms-s" });
g8a.order("You should try the traditional dish.", "מי + should + פועל.", "Who + should + verb.");
g8a.order("We mustn't take photos in the museum.", "מי + mustn't + פועל.", "Who + mustn't + verb.");
g8a.sort(B, [["Show your passport.", "must / mustn't (rule)"], ["Try the local food.", "should / shouldn't (advice)"], ["No smoking on the plane.", "must / mustn't (rule)"], ["Take a jacket.", "should / shouldn't (advice)"], ["Wear a uniform at work.", "must / mustn't (rule)"], ["Relax more.", "should / shouldn't (advice)"]], "כלל / חוק → must. עצה → should.", "Rule → must. Advice → should.", { allow: ["passport", "local", "smoking"] });
g8a.match([["I can't sleep at night.", "You shouldn't drink coffee."], ["My English is weak.", "You should read more."], ["The sign says 'No Food'.", "We mustn't eat here."], ["It's the airport rule.", "You must show your ticket."]], "עצה → should. כלל / שלט → must / mustn't.", "Advice → should; rule / sign → must / mustn't.", { allow: ["sign", "rule"] });

const g8b = itemSet(T, "ms", 2, 8);
g8b.type("I think you ___ invite her to the party.", "should", "should", "I think + עצה → should.", "I think + advice → should.", { allow: ["invite"] });
g8b.type("Drivers ___ use their phones while driving.", "must – not", ["mustn't", "must not"], "אסור → mustn't.", "Forbidden → mustn't.", { allow: ["drivers", "phones", "driving"] });
g8b.type("You don't ___ pay. The concert is free.", "have to", "have to", "לא חייבים → don't have to.", "Not necessary → don't have to.", { trap: "ms-mustnt" });
g8b.type("What ___ I cook for the party?", "should", "should", "בקשת עצה → What should I cook?", "Asking for advice → What should I cook?");
g8b.mcq("You ___ bring food – there's a café there.", ["don't have to", "mustn't", "shouldn't to"], "לא חייבים (יש בית קפה) → don't have to.", "Not necessary → don't have to.", { trap: "ms-mustnt" });
g8b.fix("You *musts show your passport at the airport.", ["must"], "must לא מקבל s.", "must – no -s.", { trap: "ms-s", allow: ["passport"] });
g8b.fix("She should *takes a break.", ["take"], "אחרי should – צורת בסיס: take.", "After should → take.", { trap: "ms-verb-s", allow: ["break"] });
g8b.fix("Yesterday I *must stay at home.", ["had to"], "ל-must אין עבר → had to.", "Past → had to.", { trap: "ms-past" });
g8b.transform("You should download this app.", ...NEG, ["You shouldn't download this app.", "You should not download this app."], "שלילה: shouldn't + download.", "shouldn't download.", { allow: ["app"] });
g8b.transform("We should take the train.", ...QUE, "Should we take the train?", "שאלה: Should + we + take?", "Should we take…?");
g8b.order("Visitors must not touch the paintings.", "מי + must not + פועל.", "Who + must not + verb.", { allow: ["visitors", "paintings"] });
g8b.cloze("Advice for a new student", "\"You {1} worry – everyone is nice here. You {2} be late; the teachers are strict. You {3} bring lunch, because there's a café. And you {4} join a club – it's a great way to make friends!\"", [["should – not", ["shouldn't", "should not"]], ["must – not", ["mustn't", "must not"]], ["not / have to", ["don't have to", "do not have to"]], ["should", "should"]], "עצה: should / shouldn't. אסור: mustn't. לא חייבים: don't have to.", "should / shouldn't / mustn't / don't have to.", { allow: ["strict", "lunch"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "ms", 1, 9);
g9a.mcq("Firefighters ___ wear special equipment. It's the rule.", ["must", "should to", "musts"], "כלל → must.", "A rule → must.", { trap: "ms-s", allow: ["special"] });
g9a.mcq("You look stressed. You ___ take a break.", ["should", "must to", "shoulds"], "עצה → should.", "Advice → should.", { allow: ["stressed", "break"] });
g9a.mcq("Guests must ___ their shoes at the door.", ["take off", "to take off", "takes off"], "אחרי must – צורת בסיס: take off.", "After must → take off.", { trap: "ms-to", allow: ["guests", "shoes"] });
g9a.mcq("You ___ use the elevator during a fire.", ["mustn't", "don't must", "not must"], "אסור → mustn't.", "Forbidden → mustn't.");
g9a.mcq("___ I tell my parents about the problem?", ["Should", "Do should", "Must I to"], "בקשת עצה → Should I…?", "Asking for advice → Should I…?");
g9a.bank("You ___ binge-watch series all night.", ["shouldn't", "mustn't to", "don't should"], "עצה בשלילה → shouldn't.", "Negative advice → shouldn't.");
g9a.bank("All passengers must ___ their seat belts.", ["fasten", "to fasten", "fastens"], "אחרי must – צורת בסיס: fasten.", "After must → fasten.", { trap: "ms-verb-s", allow: ["seat", "belts", "fasten", "fastens"] });
g9a.bank("My neighbor ___ complain less.", ["should", "shoulds", "should to"], "עצה → should, בלי s.", "Advice → should (no -s).", { trap: "ms-s" });
g9a.order("You should apologize to your colleague.", "מי + should + פועל.", "Who + should + verb.");
g9a.order("We mustn't touch the statues.", "מי + mustn't + פועל.", "Who + mustn't + verb.");
g9a.sort(B, [["Fasten your seat belt.", "must / mustn't (rule)"], ["Try vegetarian food.", "should / shouldn't (advice)"], ["No photos in the gallery.", "must / mustn't (rule)"], ["Get more sleep.", "should / shouldn't (advice)"], ["Show your ID at the entrance.", "must / mustn't (rule)"], ["Call your grandma.", "should / shouldn't (advice)"]], "כלל / חוק → must. עצה → should.", "Rule → must. Advice → should.", { allow: ["seat", "belt", "fasten", "photos", "id", "grandma", "sleep"] });
g9a.match([["I'm always on my phone.", "You should put it away."], ["I feel stressed.", "You should talk to someone."], ["The sign says 'No Entry'.", "We mustn't go in."], ["It's the stadium rule.", "You must show your ticket."]], "עצה → should. כלל / שלט → must / mustn't.", "Advice → should; rule / sign → must / mustn't.", { allow: ["stressed", "sign", "entry", "rule"] });

const g9b = itemSet(T, "ms", 2, 9);
g9b.type("I think you ___ read this novel. It's great.", "should", "should", "I think + עצה → should.", "I think + advice → should.");
g9b.type("Visitors ___ feed the dolphins.", "must – not", ["mustn't", "must not"], "אסור → mustn't.", "Forbidden → mustn't.", { allow: ["visitors"] });
g9b.type("You don't ___ wear a suit to the wedding.", "have to", "have to", "לא חייבים → don't have to.", "Not necessary → don't have to.", { trap: "ms-mustnt", allow: ["suit"] });
g9b.type("What ___ I wear to the interview?", "should", "should", "בקשת עצה → What should I wear?", "Asking for advice → What should I wear?");
g9b.mcq("You ___ bring a gift – just come and enjoy!", ["don't have to", "mustn't", "shouldn't to"], "לא חייבים → don't have to.", "Not necessary → don't have to.", { trap: "ms-mustnt", allow: ["gift"] });
g9b.fix("Everyone *musts leave the building now.", ["must"], "must לא מקבל s.", "must – no -s.", { trap: "ms-s", allow: ["building"] });
g9b.fix("He should *repairs the oven before it's dangerous.", ["repair"], "אחרי should – צורת בסיס: repair.", "After should → repair.", { trap: "ms-verb-s" });
g9b.fix("Last week we *must work on Saturday.", ["had to"], "ל-must אין עבר → had to.", "Past → had to.", { trap: "ms-past" });
g9b.transform("You should post that photo.", ...NEG, ["You shouldn't post that photo.", "You should not post that photo."], "שלילה: shouldn't + post.", "shouldn't post.");
g9b.transform("I should call the firefighters.", ...QUE, "Should I call the firefighters?", "שאלה: Should + I + call?", "Should I call…?");
g9b.order("You must switch off your phone in the theater.", "מי + must + פועל.", "Who + must + verb.");
g9b.cloze("Gallery rules", "\"Welcome! A few rules: you {1} take photos with flash, and you {2} touch the paintings. You {3} pay for the audio guide – it's free. And you {4} visit the café on the top floor – the view is amazing!\"", [["must – not", ["mustn't", "must not"]], ["must – not", ["mustn't", "must not"]], ["not / have to", ["don't have to", "do not have to"]], ["should", "should"]], "אסור: mustn't. לא חייבים: don't have to. עצה: should.", "mustn't / don't have to / should.", { allow: ["photos", "flash", "paintings", "audio", "view"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "ms", 3);
l3.mcq("You've been walking all day. You ___ be exhausted.", ["must", "should", "have to"], "מסקנה הגיונית (בטח) → must.", "Logical conclusion → must.", { allow: ["exhausted"] });
l3.mcq("Last night I ___ finish my project.", ["had to", "must", "musted"], "חובה בעבר → had to.", "Past obligation → had to.", { trap: "ms-past" });
l3.type("I failed the test. I ___ studied more.", "should have", "should have", "חרטה → should have + צורה שלישית.", "Regret → should have + V3.", { allow: ["failed"] });
l3.type("We'll ___ wait for the next bus.", "have to", "have to", "חובה בעתיד → will have to.", "Future obligation → will have to.");
l3.fix("You *mustn't come if you're busy – it's optional.", ["needn't"], "לא חייבים (optional) – needn't / don't have to, לא mustn't.", "Not necessary → needn't, not mustn't.", { trap: "ms-mustnt", allow: ["optional", "busy"] });
l3.fix("Yesterday she *must leave early.", ["had to"], "ל-must אין עבר → had to.", "Past → had to.", { trap: "ms-past" });
l3.mcq("You ought ___ to him.", ["to apologize", "apologize", "apologizing"], "המבנה: ought + to: You ought to apologize.", "ought to + verb.");
l3.transform("It's a good idea for you to rest.", "Say it with 'should'.", "אמרו את זה עם should", ["You should rest."], "עצה → You should rest.", "Advice → You should rest.");
l3.transform("I didn't study, and I failed.", "Express regret with 'should have'.", "הביעו חרטה עם should have", ["I should have studied.", "I should have studied more."], "חרטה → should have + studied.", "Regret → should have studied.", { allow: ["failed"] });
l3.sort(["✓ Correct", "✗ Wrong"], [["You must be tired.", "✓ Correct"], ["Yesterday I must work.", "✗ Wrong"], ["You don't have to pay.", "✓ Correct"], ["He musts go.", "✗ Wrong"], ["I should have called.", "✓ Correct"], ["You should to rest.", "✗ Wrong"]], "התיקונים: I had to work · He must go · You should rest.", "Fixes: I had to work · He must go · You should rest.");
l3.cloze("A job interview", "Tomorrow I have a job interview. I {1} wear a suit – it's a bank. I {2} be late, of course. Last time I {3} wait for an hour! My mom says I {4} prepare some questions.", [["have to", ["have to", "must"]], ["must – not", ["mustn't", "must not"]], ["have to – past", "had to"], ["should", "should"]], "חובה: have to / must. אסור: mustn't. עבר: had to. עצה: should.", "have to / mustn't / had to / should.", { allow: ["suit", "bank", "prepare"] });
l3.write("Write rules for your classroom (must / mustn't) and three pieces of advice for a new student (should / shouldn't).", "כתבו כללים לכיתה שלכם (must / mustn't) ושלוש עצות לתלמיד חדש (should / shouldn't).", "Students must be on time. You mustn't use your phone in class. You should make friends quickly. You shouldn't be shy. You should ask questions.", "must / mustn't – כללים. should / shouldn't – עצות.", "must / mustn't for rules; should / shouldn't for advice.");

export const mustShouldItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
