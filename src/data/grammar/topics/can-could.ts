import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG, QUE } from "@/data/grammar/build";

// Band II: MODALITY: Can (ability, asking about ability, possibility, requests), Could (requests / invitations).

export const canCouldTopic: GrammarTopic = {
  id: "can-could",
  group: "modals",
  title: "can / could",
  titleHe: "can / could – יכולת ובקשות",
  bandRefs: ["MODALITY: Can", "MODALITY: Could"],
  grades: { 7: "accurate", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "can + פועל = יכול / יודע", en: "can + verb = ability", examples: ["I **can swim**.", "She **can play** the guitar."] },
        { he: "can זהה לכולם – בלי s ובלי to", en: "can is the same for everyone – no -s, no to", examples: ["He **can drive**.", "✗ He cans drive.", "✗ He can to drive."] },
        { he: "שלילה: can't = cannot", en: "Negative: can't = cannot", examples: ["I **can't** sing.", "We **can't** come."] },
        { he: "שאלה: Can בהתחלה", en: "Question: Can first", examples: ["**Can** you **help** me?", "**Can** he **cook**?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "subject + can + base verb", example: "They can run fast." },
        { kind: "negative", pattern: "subject + can't + base verb", example: "I can't hear you." },
        { kind: "question", pattern: "Can + subject + base verb?", example: "Can I go?" },
        { kind: "short_answer", pattern: "Yes, … can. No, … can't.", example: "Yes, I can." },
      ],
      timeWords: ["can", "can't", "Can you…?", "Can I…?"],
    },
    2: {
      points: [
        { he: "can – יכולת, רשות ובקשה", en: "can – ability, permission, request", examples: ["I **can** ride a bike.", "**Can** I open the window?", "**Can** you pass the salt?"] },
        { he: "could – בקשה מנומסת יותר", en: "could – a more polite request", examples: ["**Could** you help me, please?", "**Could** I use your phone?"] },
        { he: "could – יכולת בעבר", en: "could – ability in the past", examples: ["When I was five, I **could** swim.", "I **couldn't** sleep last night."] },
        { he: "אחרי can / could – צורת בסיס", en: "After can / could – base verb", examples: ["She can **speak** French.", "✗ She can speaks French."] },
      ],
      form: [
        { kind: "question", pattern: "Could you / Could I + base verb …, please?", example: "Could you repeat that, please?" },
        { kind: "negative", pattern: "couldn't + base verb (past)", example: "We couldn't find it." },
      ],
      timeWords: ["please", "When I was young", "last night", "now"],
    },
    3: {
      points: [
        { he: "can – אפשרות כללית", en: "can – general possibility", examples: ["It **can** be very hot in Eilat.", "Mistakes **can** happen."] },
        { he: "Could you…? / Would you…? – בקשות מנומסות", en: "Polite requests", examples: ["**Could** you tell me the way?", "Do you think you **could** help?"] },
        { he: "be able to – כשאי אפשר can (עתיד, אחרי will)", en: "be able to – where can doesn't fit", examples: ["I **will be able to** come tomorrow.", "✗ I will can come."] },
        { he: "הזמנה והצעה", en: "Invitations and suggestions", examples: ["We **could** go to the beach.", "**Could** you come to my party?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "will be able to + base verb (future ability)", example: "She'll be able to walk soon." },
        { kind: "affirmative", pattern: "could + base verb (suggestion)", example: "We could watch a movie." },
      ],
      timeWords: ["be able to", "managed to", "could you possibly"],
    },
  },
  traps: [
    { id: "cc-s", wrong: "He cans swim.", right: "He can swim.", whyHe: "can לא מקבל s.", whyEn: "can never takes -s." },
    { id: "cc-to", wrong: "I can to help you.", right: "I can help you.", whyHe: "אחרי can לא שמים to.", whyEn: "No to after can." },
    { id: "cc-verb-s", wrong: "She can speaks English.", right: "She can speak English.", whyHe: "אחרי can – צורת בסיס, בלי s.", whyEn: "After can → base verb." },
    { id: "cc-do", wrong: "Do you can help me?", right: "Can you help me?", whyHe: "עם can לא שמים do – can עובר להתחלה.", whyEn: "No do with can." },
    { id: "cc-will-can", wrong: "I will can come tomorrow.", right: "I will be able to come tomorrow.", whyHe: "אין will can – אומרים will be able to.", whyEn: "Use will be able to." },
  ],
};

const T = "can-could";

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "cc", 1, 7);
g7a.mcq("My brother ___ swim across the river.", ["can", "cans", "can to"], "can זהה לכולם – בלי s ובלי to.", "can – no -s, no to.", { trap: "cc-s" });
g7a.mcq("I can ___ the guitar.", ["play", "plays", "to play"], "אחרי can – צורת בסיס: play.", "After can → play.", { trap: "cc-verb-s" });
g7a.mcq("She ___ drive. She's only twelve.", ["can't", "doesn't can", "not can"], "שלילה: can't.", "Negative → can't.");
g7a.mcq("___ you help me with my math?", ["Can", "Do", "Are"], "בקשה: Can you…? בלי do.", "Request: Can you…?", { trap: "cc-do" });
g7a.mcq("\"Can your sister cook?\" \"Yes, she ___.\"", ["can", "does", "is"], "תשובה קצרה: Yes, she can.", "Short answer: Yes, she can.");
g7a.bank("Our team ___ win the game!", ["can", "cans", "can to"], "can + פועל, בלי s ובלי to.", "can + verb.");
g7a.bank("___ I join your club?", ["Can", "Do", "Am"], "רשות: Can I…?", "Permission: Can I…?");
g7a.bank("We can't ___ the mountain. It's too dangerous.", ["climb", "climbs", "to climb"], "אחרי can't – צורת בסיס.", "After can't → base verb.", { allow: ["climb", "climbs"] });
g7a.order("Can you see the bridge?", "שאלה: Can + you + פועל?", "Can + you + verb?");
g7a.order("My dad can't cook.", "מי + can't + פועל.", "Who + can't + verb.");
g7a.sort(["✓ Correct", "✗ Wrong"], [["She can swim.", "✓ Correct"], ["He cans run.", "✗ Wrong"], ["I can't come.", "✓ Correct"], ["We can to help.", "✗ Wrong"], ["Can you hear me?", "✓ Correct"], ["Do you can drive?", "✗ Wrong"]], "can + פועל בסיס. בלי s, בלי to, בלי do.", "can + base verb; no -s, to or do.");
g7a.match([["Can you help me?", "Yes, of course."], ["Can she sing?", "No, she can't."], ["Can I sit here?", "Sure, sit down."], ["Can they swim?", "Yes, they can."]], "שאלות עם can ותשובות מתאימות.", "Can questions and answers.", { allow: ["sit", "sure"] });

const g7b = itemSet(T, "cc", 2, 7);
g7b.type("When I was six, I ___ swim.", "can – past", "could", "יכולת בעבר → could.", "Past ability → could.");
g7b.type("___ you pass the salt, please?", "can / could", ["Could", "Can"], "בקשה מנומסת → Could you…, please?", "Polite request → Could you…?");
g7b.type("I ___ sleep last night. It was too hot.", "can – past, not", ["couldn't", "could not"], "יכולת בעבר בשלילה → couldn't.", "Past, negative → couldn't.");
g7b.type("My little sister can ___ to ten in English.", "count", "count", "אחרי can – צורת בסיס: count.", "After can → count.", { allow: ["count"] });
g7b.mcq("___ I use your pen, please?", ["Could", "Do", "Am"], "בקשת רשות מנומסת → Could I…?", "Polite permission → Could I…?");
g7b.fix("My friend *cans speak three languages.", ["can"], "can לא מקבל s.", "can – no -s.", { trap: "cc-s", allow: ["languages"] });
g7b.fix("She can *plays the piano.", ["play"], "אחרי can – צורת בסיס: play.", "After can → play.", { trap: "cc-verb-s", allow: ["piano"] });
g7b.mcq("We can't ___ to the theater tonight.", ["go", "to go", "goes"], "אחרי can't – צורת בסיס, בלי to.", "No to after can't.", { trap: "cc-to" });
g7b.transform("The guide can speak English.", ...NEG, ["The guide can't speak English.", "The guide cannot speak English.", "The guide can not speak English."], "שלילה: can't + speak.", "can't speak.");
g7b.transform("Your dad can fix the car.", ...QUE, "Can your dad fix the car?", "שאלה: Can + your dad + fix?", "Can your dad fix…?", { trap: "cc-do" });
g7b.order("Could you show me the way, please?", "בקשה מנומסת: Could + you + פועל…, please?", "Could you + verb…, please?");
g7b.cloze("At the club", "\"{1} you swim?\" \"Yes, I {2}. When I was five, I {3} swim, but now I'm good.\" \"Great! {4} you teach me?\" \"Sure!\"", [["can", "Can"], ["can", "can"], ["can – past, not", ["couldn't", "could not"]], ["can / could", ["Could", "Can"]]], "can – יכולת עכשיו. couldn't – לא יכולתי בעבר. Could you – בקשה מנומסת.", "can now; couldn't (past); Could you (polite).", { allow: ["sure"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "cc", 1, 8);
g8a.mcq("My uncle ___ cook traditional dishes.", ["can", "cans", "can to"], "can זהה לכולם – בלי s ובלי to.", "can – no -s, no to.", { trap: "cc-s" });
g8a.mcq("I can ___ the drums.", ["play", "plays", "to play"], "אחרי can – צורת בסיס: play.", "After can → play.", { trap: "cc-verb-s" });
g8a.mcq("She ___ come to the concert. She's sick.", ["can't", "doesn't can", "not can"], "שלילה: can't.", "Negative → can't.");
g8a.mcq("___ you download this app for me?", ["Can", "Do", "Are"], "בקשה: Can you…? בלי do.", "Request: Can you…?", { trap: "cc-do", allow: ["app"] });
g8a.mcq("\"Can the actors sing?\" \"Yes, they ___.\"", ["can", "do", "are"], "תשובה קצרה: Yes, they can.", "Short answer: Yes, they can.");
g8a.bank("The plane ___ fly very high.", ["can", "cans", "can to"], "can + פועל, בלי s ובלי to.", "can + verb.");
g8a.bank("___ I pay by credit card?", ["Can", "Do", "Am"], "רשות: Can I…?", "Permission: Can I…?");
g8a.bank("We can't ___ abroad this year.", ["travel", "travels", "to travel"], "אחרי can't – צורת בסיס.", "After can't → base verb.");
g8a.order("Can you record the concert?", "שאלה: Can + you + פועל?", "Can + you + verb?");
g8a.order("My grandma can't use a computer.", "מי + can't + פועל.", "Who + can't + verb.", { allow: ["grandma", "computer"] });
g8a.sort(["✓ Correct", "✗ Wrong"], [["He can cook.", "✓ Correct"], ["She cans dance.", "✗ Wrong"], ["We can't come.", "✓ Correct"], ["They can to win.", "✗ Wrong"], ["Can I pay now?", "✓ Correct"], ["Do you can help?", "✗ Wrong"]], "can + פועל בסיס. בלי s, בלי to, בלי do.", "can + base verb; no -s, to or do.", { allow: ["dance"] });
g8a.match([["Can you lend me a pen?", "Yes, here you are."], ["Can he play the drums?", "No, he can't."], ["Can I sit here?", "Sure, sit down."], ["Can they come tonight?", "Yes, they can."]], "שאלות עם can ותשובות מתאימות.", "Can questions and answers.", { allow: ["lend", "sit", "sure"] });

const g8b = itemSet(T, "cc", 2, 8);
g8b.type("When I was eight, I ___ speak Russian.", "can – past", "could", "יכולת בעבר → could.", "Past ability → could.");
g8b.type("___ you turn down the music, please?", "can / could", ["Could", "Can"], "בקשה מנומסת → Could you…, please?", "Polite request → Could you…?", { allow: ["turn"] });
g8b.type("We ___ find the café. We got lost.", "can – past, not", ["couldn't", "could not"], "יכולת בעבר בשלילה → couldn't.", "Past, negative → couldn't.", { allow: ["lost"] });
g8b.type("My sister can ___ any song on the guitar.", "play", "play", "אחרי can – צורת בסיס: play.", "After can → play.");
g8b.mcq("___ I use your camera, please?", ["Could", "Do", "Am"], "בקשת רשות מנומסת → Could I…?", "Polite permission → Could I…?");
g8b.fix("The chef *cans make amazing cakes.", ["can"], "can לא מקבל s.", "can – no -s.", { trap: "cc-s", allow: ["chef"] });
g8b.fix("He can *drives a truck.", ["drive"], "אחרי can – צורת בסיס: drive.", "After can → drive.", { trap: "cc-verb-s", allow: ["truck"] });
g8b.mcq("We can't ___ a new car.", ["afford", "to afford", "affords"], "אחרי can't – צורת בסיס, בלי to.", "No to after can't.", { trap: "cc-to" });
g8b.transform("The actor can dance.", ...NEG, ["The actor can't dance.", "The actor cannot dance.", "The actor can not dance."], "שלילה: can't + dance.", "can't dance.", { allow: ["dance"] });
g8b.transform("Your mom can drive us to the airport.", ...QUE, "Can your mom drive us to the airport?", "שאלה: Can + your mom + drive?", "Can your mom drive…?", { trap: "cc-do" });
g8b.order("Could you tell me where the station is?", "בקשה מנומסת: Could + you + tell me…?", "Could you tell me…?");
g8b.cloze("At the airport", "\"Excuse me, {1} you help me? I {2} find my gate.\" \"Of course. {3} I see your ticket?\" \"Here.\" \"Your flight is at gate 12. You {4} take the train there.\"", [["can / could", ["could", "can"]], ["can – not", ["can't", "cannot"]], ["can", ["Can", "Could"]], ["can", "can"]], "בקשה מנומסת: could. יכולת: can / can't.", "Polite request: could; ability: can / can't.", { allow: ["excuse", "gate"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "cc", 1, 9);
g9a.mcq("My neighbor ___ repair anything.", ["can", "cans", "can to"], "can זהה לכולם – בלי s ובלי to.", "can – no -s, no to.", { trap: "cc-s" });
g9a.mcq("I can ___ underwater for a minute.", ["swim", "swims", "to swim"], "אחרי can – צורת בסיס: swim.", "After can → swim.", { trap: "cc-verb-s", allow: ["underwater", "minute"] });
g9a.mcq("She ___ come to the wedding. She's abroad.", ["can't", "doesn't can", "not can"], "שלילה: can't.", "Negative → can't.");
g9a.mcq("___ you lend me your charger?", ["Can", "Do", "Are"], "בקשה: Can you…? בלי do.", "Request: Can you…?", { trap: "cc-do", allow: ["charger"] });
g9a.mcq("\"Can firefighters climb ladders fast?\" \"Yes, they ___.\"", ["can", "do", "are"], "תשובה קצרה: Yes, they can.", "Short answer: Yes, they can.", { allow: ["climb", "ladders"] });
g9a.bank("Dolphins ___ swim very fast.", ["can", "cans", "can to"], "can + פועל, בלי s ובלי to.", "can + verb.");
g9a.bank("___ I post this photo?", ["Can", "Do", "Am"], "רשות: Can I…?", "Permission: Can I…?");
g9a.bank("We can't ___ the elevator. It's broken.", ["use", "uses", "to use"], "אחרי can't – צורת בסיס.", "After can't → base verb.");
g9a.order("Can you translate this article?", "שאלה: Can + you + פועל?", "Can + you + verb?");
g9a.order("My grandfather can't hear well.", "מי + can't + פועל.", "Who + can't + verb.");
g9a.sort(["✓ Correct", "✗ Wrong"], [["She can dive.", "✓ Correct"], ["He cans sail.", "✗ Wrong"], ["I can't hear you.", "✓ Correct"], ["We can to borrow it.", "✗ Wrong"], ["Can I post it?", "✓ Correct"], ["Do you can sew?", "✗ Wrong"]], "can + פועל בסיס. בלי s, בלי to, בלי do.", "can + base verb; no -s, to or do.");
g9a.match([["Can you lend me your jacket?", "Sure, here you are."], ["Can she translate it?", "No, she can't."], ["Can I take a selfie with you?", "Of course!"], ["Can they sail?", "Yes, they can."]], "שאלות עם can ותשובות מתאימות.", "Can questions and answers.", { allow: ["sure", "lend"] });

const g9b = itemSet(T, "cc", 2, 9);
g9b.type("When I was ten, I ___ dive into the deep end.", "can – past", "could", "יכולת בעבר → could.", "Past ability → could.", { allow: ["deep"] });
g9b.type("___ you help me carry this ladder, please?", "can / could", ["Could", "Can"], "בקשה מנומסת → Could you…, please?", "Polite request → Could you…?");
g9b.type("We ___ see the stage. There were too many people.", "can – past, not", ["couldn't", "could not"], "יכולת בעבר בשלילה → couldn't.", "Past, negative → couldn't.");
g9b.type("My colleague can ___ five languages.", "speak", "speak", "אחרי can – צורת בסיס: speak.", "After can → speak.", { allow: ["languages"] });
g9b.mcq("___ I borrow your novel, please?", ["Could", "Do", "Am"], "בקשת רשות מנומסת → Could I…?", "Polite permission → Could I…?");
g9b.fix("The architect *cans design amazing towers.", ["can"], "can לא מקבל s.", "can – no -s.", { trap: "cc-s" });
g9b.fix("She can *sews her own clothes.", ["sew"], "אחרי can – צורת בסיס: sew.", "After can → sew.", { trap: "cc-verb-s" });
g9b.mcq("We can't ___ the speaker.", ["hear", "to hear", "hears"], "אחרי can't – צורת בסיס, בלי to.", "No to after can't.", { trap: "cc-to" });
g9b.transform("The firefighter can climb the ladder.", ...NEG, ["The firefighter can't climb the ladder.", "The firefighter cannot climb the ladder.", "The firefighter can not climb the ladder."], "שלילה: can't + climb.", "can't climb.", { allow: ["climb"] });
g9b.transform("Your cousin can translate the speech.", ...QUE, "Can your cousin translate the speech?", "שאלה: Can + your cousin + translate?", "Can your cousin translate…?", { trap: "cc-do", allow: ["cousin"] });
g9b.order("Could you lend me some money, please?", "בקשה מנומסת: Could + you + פועל…, please?", "Could you + verb…, please?", { allow: ["lend"] });
g9b.cloze("In the gallery", "\"Excuse me, {1} I take photos here?\" \"Sorry, you {2}. But you {3} buy postcards at the shop.\" \"OK. {4} you tell me where the exit is?\"", [["can", ["can", "could"]], ["can – not", ["can't", "cannot"]], ["can", "can"], ["can / could", ["Could", "Can"]]], "רשות: can. שלילה: can't. בקשה מנומסת: Could.", "Permission: can; negative: can't; polite: Could.", { allow: ["excuse", "postcards", "exit"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "cc", 3);
l3.mcq("I'll ___ come to the party next week.", ["be able to", "can", "could"], "אחרי will – be able to (אין will can).", "After will → be able to.", { trap: "cc-will-can" });
l3.mcq("It ___ be very cold in the desert at night.", ["can", "cans", "is can"], "אפשרות כללית → can.", "General possibility → can.");
l3.type("We ___ go to the beach tomorrow, if you like.", "suggestion", "could", "הצעה → We could…", "Suggestion → We could…", { allow: ["beach"] });
l3.type("I ___ find my keys this morning, so I was late.", "can – past, not", ["couldn't", "could not", "wasn't able to"], "יכולת בעבר בשלילה → couldn't.", "Past, negative → couldn't.");
l3.fix("I will *can help you tomorrow.", ["be able to"], "אין will can → will be able to.", "Use will be able to.", { trap: "cc-will-can" });
l3.mcq("He can ___ four languages.", ["speak", "to speak", "speaks"], "אחרי can – צורת בסיס, בלי to.", "No to after can.", { trap: "cc-to", allow: ["languages"] });
l3.fix("Could you *helping me with this box?", ["help"], "אחרי could – צורת בסיס: help.", "After could → help.", { allow: ["box"] });
l3.transform("Help me, please.", "Make it a polite request with 'Could'.", "הפכו לבקשה מנומסת עם Could", ["Could you help me, please?", "Could you please help me?", "Could you help me?"], "בקשה מנומסת: Could you + פועל, please?", "Could you + verb, please?");
l3.transform("When I was young, I was able to run fast.", "Say it with 'could'.", "אמרו את זה עם could", ["When I was young, I could run fast."], "יכולת בעבר → could.", "Past ability → could.");
l3.sort(["✓ Correct", "✗ Wrong"], [["I'll be able to come.", "✓ Correct"], ["I will can come.", "✗ Wrong"], ["Could you help me?", "✓ Correct"], ["She can speaks French.", "✗ Wrong"], ["We couldn't sleep.", "✓ Correct"], ["Do you can swim?", "✗ Wrong"]], "התיקונים: I'll be able to · She can speak · Can you swim.", "Fixes: I'll be able to · She can speak · Can you swim.", { allow: ["french"] });
l3.cloze("Learning to drive", "When I was a child, I {1} ride a bike, but I {2} drive, of course. Next year I'll {3} take driving lessons. My dad says we {4} practice together on Fridays.", [["can – past", "could"], ["can – past, not", ["couldn't", "could not"]], ["be able to", "be able to"], ["suggestion", ["could", "can"]]], "עבר: could / couldn't. אחרי will: be able to. הצעה: could.", "Past: could / couldn't; after will: be able to; suggestion: could.", { allow: ["child", "bike", "driving", "lessons", "together"] });
l3.write("Write about three things you can do now, one thing you could do as a child but can't now, and one polite request.", "כתבו על שלושה דברים שאתם יודעים לעשות עכשיו, דבר אחד שידעתם לעשות כילדים ועכשיו לא, ובקשה מנומסת אחת.", "I can swim, I can speak English and I can cook pasta. When I was a child, I could sleep for twelve hours, but now I can't. Could you help me with my homework, please?", "can / can't עכשיו, could / couldn't בעבר, Could you…? לבקשה.", "can now, could in the past, Could you…? for requests.");

export const canCouldItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
