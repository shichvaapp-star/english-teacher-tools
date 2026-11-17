import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG } from "@/data/grammar/build";

// Band II: negative forms across tenses and modals (CLAUSES: Declarative + verb sections).

export const negativesTopic: GrammarTopic = {
  id: "negatives",
  group: "questions",
  title: "Negatives",
  titleHe: "שלילה",
  bandRefs: ["CLAUSES: Declarative", "VERBS: Present simple", "VERBS: Past simple"],
  grades: { 7: "evolving", 8: "evolving", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "הווה: don't / doesn't + פועל", en: "Present: don't / doesn't + verb", examples: ["I **don't** like fish.", "She **doesn't** play."] },
        { he: "עבר: didn't + פועל", en: "Past: didn't + verb", examples: ["We **didn't** go.", "He **didn't** call."] },
        { he: "עם be / can / will – רק not", en: "With be / can / will – just add not", examples: ["I'**m not** tired.", "She **can't** swim.", "It **won't** rain."] },
        { he: "באנגלית לא אומרים I not like", en: "Never 'I not like'", examples: ["I **don't** like it.", "✗ I not like it."] },
      ],
      form: [
        { kind: "negative", pattern: "don't / doesn't / didn't + base verb", example: "They didn't come." },
        { kind: "negative", pattern: "am not / isn't / aren't / wasn't / weren't", example: "We weren't late." },
        { kind: "negative", pattern: "can't / won't + base verb", example: "I can't hear you." },
      ],
      timeWords: ["don't", "doesn't", "didn't", "isn't", "can't", "won't"],
    },
    2: {
      points: [
        { he: "בוחרים לפי הזמן והנושא", en: "Choose by tense and subject", examples: ["he / she / it → doesn't", "past → didn't", "-ing → isn't / aren't"], chips: true },
        { he: "אחרי don't / doesn't / didn't – צורת בסיס", en: "After don't / doesn't / didn't – base verb", examples: ["She **doesn't like** it.", "✗ She doesn't likes it."] },
        { he: "בשלילה: any, anything, anyone", en: "In negatives: any / anything / anyone", examples: ["I **don't** have **any** money.", "She **didn't** say **anything**."] },
        { he: "never כבר שלילה – בלי not", en: "never is already negative", examples: ["I **never** eat meat.", "✗ I don't never eat meat."] },
      ],
      form: [
        { kind: "negative", pattern: "subject + helper + not + base verb", example: "He doesn't know." },
        { kind: "negative", pattern: "don't / didn't + any / anything / anyone", example: "We didn't see anyone." },
      ],
      timeWords: ["any", "anything", "anyone", "never", "yet"],
    },
    3: {
      points: [
        { he: "שלילה אחת במשפט", en: "Only one negative per sentence", examples: ["I **don't** know **anything**.", "I know **nothing**.", "✗ I don't know nothing."] },
        { he: "no / nothing / nobody במקום not any / anything / anyone", en: "no / nothing / nobody = not any / anything / anyone", examples: ["There's **no** time. = There **isn't any** time."] },
        { he: "I don't think + חיובי", en: "I don't think + positive verb", examples: ["I **don't think** he's right.", "✗ I think he isn't right. (less natural)"] },
        { he: "not … either = גם לא", en: "not … either = also not", examples: ["I can't swim, and my brother **can't either**."] },
      ],
      form: [
        { kind: "negative", pattern: "not + any- / no- words (not both)", example: "Nobody called. / No one called." },
        { kind: "negative", pattern: "I don't think + subject + verb", example: "I don't think it will work." },
      ],
      timeWords: ["nobody", "nothing", "nowhere", "either", "neither"],
    },
  },
  traps: [
    { id: "n-no-aux", wrong: "I not like pizza.", right: "I don't like pizza.", whyHe: "בעברית 'לא' לבד מספיק. באנגלית צריך don't / doesn't / didn't.", whyEn: "English needs don't / doesn't / didn't." },
    { id: "n-he", wrong: "He don't know.", right: "He doesn't know.", whyHe: "עם he / she / it – doesn't.", whyEn: "he / she / it → doesn't." },
    { id: "n-base", wrong: "She didn't went.", right: "She didn't go.", whyHe: "אחרי didn't / doesn't – צורת בסיס.", whyEn: "After didn't / doesn't → base verb." },
    { id: "n-double", wrong: "I don't know nothing.", right: "I don't know anything.", whyHe: "באנגלית רק שלילה אחת – don't + anything.", whyEn: "Only one negative: don't + anything." },
    { id: "n-be-do", wrong: "I don't happy.", right: "I'm not happy.", whyHe: "עם be – am / is / are + not, בלי don't.", whyEn: "With be → am / is / are + not." },
  ],
};

const T = "negatives";

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "ng", 1, 7);
g7a.mcq("I ___ like cold soup.", ["don't", "not", "doesn't"], "עם I בהווה → don't.", "I, present → don't.", { trap: "n-no-aux" });
g7a.mcq("My brother ___ play in the band.", ["doesn't", "don't", "isn't"], "My brother = he, ולכן doesn't.", "he → doesn't.", { trap: "n-he" });
g7a.mcq("We ___ go to the club yesterday.", ["didn't", "don't", "weren't"], "yesterday = עבר → didn't.", "yesterday → didn't.");
g7a.mcq("I ___ hungry now.", ["'m not", "don't", "not"], "hungry = תואר → am not.", "With be → I'm not.", { trap: "n-be-do" });
g7a.mcq("She ___ swim across the river. It's too wide.", ["can't", "doesn't can", "not can"], "יכולת בשלילה → can't.", "Ability, negative → can't.");
g7a.bank("The lemons ___ in the bowl.", ["aren't", "isn't", "don't"], "the lemons = they, ולכן aren't.", "they → aren't.");
g7a.bank("It ___ be cold tomorrow.", ["won't", "doesn't", "isn't"], "עתיד בשלילה → won't.", "Future negative → won't.");
g7a.bank("My parents ___ drive to work.", ["don't", "doesn't", "aren't"], "My parents = they, ולכן don't.", "they → don't.");
g7a.order("I didn't see the guide.", "I + didn't + פועל בסיס.", "I + didn't + base verb.");
g7a.order("The village isn't far from here.", "be בשלילה: isn't.", "be, negative → isn't.");
g7a.sort(["don't", "doesn't", "didn't"], [["I … like it (now)", "don't"], ["She … play (now)", "doesn't"], ["We … go (yesterday)", "didn't"], ["They … know (now)", "don't"], ["He … help (now)", "doesn't"], ["You … call (last night)", "didn't"]], "הווה: don't / doesn't (he, she, it). עבר: didn't לכולם.", "Present: don't / doesn't. Past: didn't for all.");
g7a.match([["I don't", "like math."], ["She doesn't", "have a dog."], ["We didn't", "see the river."], ["They aren't", "at home."]], "don't / doesn't / didn't + פועל. aren't + מקום / תואר.", "don't / doesn't / didn't + verb; aren't + place / adjective.");

const g7b = itemSet(T, "ng", 2, 7);
g7b.type("My sister ___ in a band.", "not / sing", ["doesn't sing", "does not sing"], "עם she – doesn't + sing.", "she → doesn't sing.", { trap: "n-he" });
g7b.type("We ___ the meal. It was too salty.", "not / eat", ["didn't eat", "did not eat"], "עבר → didn't eat.", "Past → didn't eat.", { allow: ["salty"] });
g7b.type("The guide ___ here today.", "not / be", ["isn't", "is not"], "be בשלילה → isn't.", "be, negative → isn't.", { trap: "n-be-do" });
g7b.type("I ___ any lemons in the kitchen.", "not / have", ["don't have", "do not have"], "שלילה עם any: don't have any.", "Negative + any → don't have.");
g7b.mcq("I ___ eat meat. I'm a vegetarian.", ["never", "don't never", "not never"], "never כבר שלילה – בלי don't.", "never is already negative.", { trap: "n-double", allow: ["vegetarian"] });
g7b.fix("I *not understand the question.", ["don't"], "צריך don't: I don't understand.", "Need don't.", { trap: "n-no-aux" });
g7b.fix("He doesn't *likes the club.", ["like"], "אחרי don't / doesn't – צורת בסיס: like.", "After doesn't → like.", { trap: "n-base" });
g7b.fix("My dad *don't drive on Saturdays.", ["doesn't"], "My dad = he, ולכן doesn't.", "he → doesn't.", { trap: "n-he" });
g7b.transform("They traveled to the mountains.", ...NEG, ["They didn't travel to the mountains.", "They did not travel to the mountains."], "עבר: didn't + travel (בלי ed).", "didn't travel.", { trap: "n-base" });
g7b.transform("She is careful.", ...NEG, ["She isn't careful.", "She is not careful.", "She's not careful."], "עם be: is + not.", "is not.", { trap: "n-be-do" });
g7b.order("We don't have any salt.", "המבנה: don't + have + any.", "don't have any.");
g7b.cloze("A bad day", "Yesterday was a bad day. I {1} my homework, and my teacher {2} happy. My friends {3} at school, so I {4} anyone to talk to. Today I {5} want to think about it!", [["not / do", ["didn't do", "did not do"]], ["not / be", ["wasn't", "was not"]], ["not / be", ["weren't", "were not"]], ["not / have", ["didn't have", "did not have"]], ["not", ["don't", "do not"]]], "עבר: didn't / wasn't / weren't. הווה: don't.", "Past: didn't / wasn't / weren't. Present: don't.");

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "ng", 1, 8);
g8a.mcq("I ___ like loud music.", ["don't", "not", "doesn't"], "עם I בהווה → don't.", "I, present → don't.", { trap: "n-no-aux" });
g8a.mcq("My uncle ___ work in a factory.", ["doesn't", "don't", "isn't"], "My uncle = he, ולכן doesn't.", "he → doesn't.", { trap: "n-he" });
g8a.mcq("We ___ enjoy the concert last night.", ["didn't", "don't", "weren't"], "last night = עבר → didn't.", "last night → didn't.");
g8a.mcq("I ___ afraid of the dark.", ["'m not", "don't", "not"], "afraid = תואר → am not.", "With be → I'm not.", { trap: "n-be-do" });
g8a.mcq("She ___ cook. She always burns the food.", ["can't", "doesn't can", "not can"], "יכולת בשלילה → can't.", "Ability, negative → can't.", { allow: ["burns"] });
g8a.bank("The ingredients ___ in the fridge.", ["aren't", "isn't", "don't"], "the ingredients = they, ולכן aren't.", "they → aren't.");
g8a.bank("The plane ___ land on time.", ["won't", "doesn't", "isn't"], "עתיד בשלילה → won't.", "Future negative → won't.");
g8a.bank("My parents ___ download games.", ["don't", "doesn't", "aren't"], "My parents = they, ולכן don't.", "they → don't.");
g8a.order("I didn't buy a new camera.", "I + didn't + פועל בסיס.", "I + didn't + base verb.");
g8a.order("The café isn't open on Saturday.", "be בשלילה: isn't.", "be, negative → isn't.");
g8a.sort(["don't", "doesn't", "didn't"], [["I … cook (now)", "don't"], ["The chef … smile (now)", "doesn't"], ["We … travel (last year)", "didn't"], ["They … know (now)", "don't"], ["My mom … drive (now)", "doesn't"], ["You … call (yesterday)", "didn't"]], "הווה: don't / doesn't (he, she, it). עבר: didn't לכולם.", "Present: don't / doesn't. Past: didn't for all.", { allow: ["chef", "smile"] });
g8a.match([["I don't", "drink coffee."], ["He doesn't", "have a camera."], ["We didn't", "travel abroad."], ["They aren't", "at the airport."]], "don't / doesn't / didn't + פועל. aren't + מקום.", "don't / doesn't / didn't + verb; aren't + place.");

const g8b = itemSet(T, "ng", 2, 8);
g8b.type("My brother ___ his room.", "not / clean", ["doesn't clean", "does not clean"], "עם he – doesn't + clean.", "he → doesn't clean.", { trap: "n-he" });
g8b.type("We ___ the movie. It was boring.", "not / enjoy", ["didn't enjoy", "did not enjoy"], "עבר → didn't enjoy.", "Past → didn't enjoy.", { allow: ["boring"] });
g8b.type("The museum ___ crowded today.", "not / be", ["isn't", "is not"], "be בשלילה → isn't.", "be, negative → isn't.", { trap: "n-be-do", allow: ["crowded"] });
g8b.type("I ___ any flour for the cake.", "not / have", ["don't have", "do not have"], "שלילה עם any: don't have any.", "Negative + any → don't have.");
g8b.mcq("He ___ apologizes. He's so proud!", ["never", "doesn't never", "not never"], "never כבר שלילה – בלי doesn't.", "never is already negative.", { trap: "n-double" });
g8b.fix("I *not remember the address.", ["don't"], "צריך don't: I don't remember.", "Need don't.", { trap: "n-no-aux" });
g8b.fix("She didn't *bought the jacket.", ["buy"], "אחרי didn't – צורת בסיס: buy.", "After didn't → buy.", { trap: "n-base" });
g8b.fix("The actor *don't know his lines.", ["doesn't"], "The actor = he / she, ולכן doesn't.", "he / she → doesn't.", { trap: "n-he" });
g8b.transform("They cooked a traditional dish.", ...NEG, ["They didn't cook a traditional dish.", "They did not cook a traditional dish."], "עבר: didn't + cook (בלי ed).", "didn't cook.", { trap: "n-base" });
g8b.transform("The traffic is terrible.", ...NEG, ["The traffic isn't terrible.", "The traffic is not terrible.", "The traffic's not terrible."], "עם be: is + not.", "is not.", { trap: "n-be-do" });
g8b.order("She didn't say anything to the director.", "המבנה: didn't + say + anything.", "didn't say anything.");
g8b.cloze("A terrible trip", "Our trip abroad was terrible. The hotel {1} clean, and the food {2} good. We {3} any famous places because it rained. My sister {4} her camera, so we {5} any photos!", [["not / be", ["wasn't", "was not"]], ["not / be", ["wasn't", "was not"]], ["not / visit", ["didn't visit", "did not visit"]], ["not / bring", ["didn't bring", "did not bring"]], ["not / have", ["don't have", "do not have"]]], "עבר: wasn't / didn't. הווה (עכשיו אין): don't have.", "Past: wasn't / didn't. Present: don't have.", { allow: ["hotel", "famous", "places", "rained", "bring"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "ng", 1, 9);
g9a.mcq("I ___ post selfies.", ["don't", "not", "doesn't"], "עם I בהווה → don't.", "I, present → don't.", { trap: "n-no-aux" });
g9a.mcq("My neighbor ___ have a ladder.", ["doesn't", "don't", "isn't"], "My neighbor = he / she, ולכן doesn't.", "he / she → doesn't.", { trap: "n-he" });
g9a.mcq("We ___ watch the documentary last night.", ["didn't", "don't", "weren't"], "last night = עבר → didn't.", "last night → didn't.");
g9a.mcq("I ___ a vegetarian.", ["'m not", "don't", "not"], "a vegetarian = שם עצם עם be → am not.", "With be → I'm not.", { trap: "n-be-do" });
g9a.mcq("She ___ dive. She's afraid of the water.", ["can't", "doesn't can", "not can"], "יכולת בשלילה → can't.", "Ability, negative → can't.");
g9a.bank("The elevators ___ working today.", ["aren't", "isn't", "don't"], "the elevators = they, ולכן aren't.", "they → aren't.");
g9a.bank("The gallery ___ open tomorrow.", ["won't be", "doesn't be", "isn't be"], "עתיד בשלילה → won't be.", "Future negative → won't be.");
g9a.bank("My parents ___ binge-watch series.", ["don't", "doesn't", "aren't"], "My parents = they, ולכן don't.", "they → don't.");
g9a.order("I didn't borrow your charger.", "I + didn't + פועל בסיס.", "I + didn't + base verb.", { allow: ["charger"] });
g9a.order("The stadium isn't far from here.", "be בשלילה: isn't.", "be, negative → isn't.");
g9a.sort(["don't", "doesn't", "didn't"], [["I … tweet (now)", "don't"], ["The firefighter … smoke (now)", "doesn't"], ["We … sail (last summer)", "didn't"], ["They … complain (now)", "don't"], ["My neighbor … cook (now)", "doesn't"], ["You … reply (yesterday)", "didn't"]], "הווה: don't / doesn't (he, she, it). עבר: didn't לכולם.", "Present: don't / doesn't. Past: didn't for all.");
g9a.match([["I don't", "use that app."], ["She doesn't", "eat meat."], ["We didn't", "go to the wedding."], ["They aren't", "at the stadium."]], "don't / doesn't / didn't + פועל. aren't + מקום.", "don't / doesn't / didn't + verb; aren't + place.");

const g9b = itemSet(T, "ng", 2, 9);
g9b.type("My colleague ___ coffee.", "not / drink", ["doesn't drink", "does not drink"], "עם he / she – doesn't + drink.", "he / she → doesn't drink.", { trap: "n-he" });
g9b.type("We ___ the marathon. It was too hot.", "not / finish", ["didn't finish", "did not finish"], "עבר → didn't finish.", "Past → didn't finish.");
g9b.type("The neighborhood ___ quiet these days.", "not / be", ["isn't", "is not"], "be בשלילה → isn't.", "be, negative → isn't.", { trap: "n-be-do" });
g9b.type("I ___ any furniture yet.", "not / buy", ["haven't bought", "have not bought"], "שלילה בהווה מושלם עם any … yet: haven't bought.", "Negative + yet → haven't bought.");
g9b.mcq("He ___ complains. He's very patient.", ["never", "doesn't never", "not never"], "never כבר שלילה – בלי doesn't.", "never is already negative.", { trap: "n-double" });
g9b.fix("I *not agree with you.", ["don't"], "צריך don't: I don't agree.", "Need don't.", { trap: "n-no-aux" });
g9b.fix("She didn't *translated the article.", ["translate"], "אחרי didn't – צורת בסיס: translate.", "After didn't → translate.", { trap: "n-base" });
g9b.fix("The architect *don't like the plan.", ["doesn't"], "The architect = he / she, ולכן doesn't.", "he / she → doesn't.", { trap: "n-he" });
g9b.transform("They repaired the oven.", ...NEG, ["They didn't repair the oven.", "They did not repair the oven."], "עבר: didn't + repair (בלי ed).", "didn't repair.", { trap: "n-base" });
g9b.transform("The stranger was friendly.", ...NEG, ["The stranger wasn't friendly.", "The stranger was not friendly."], "be בעבר: was + not.", "was not.", { trap: "n-be-do" });
g9b.order("Nobody complained about the noise.", "nobody כבר שלילה – פועל חיובי.", "nobody is negative → positive verb.");
g9b.cloze("No luck", "Last week I {1} lucky. The elevator {2} working, so I {3} to work late. My boss {4} happy. And today my phone {5} turn on!", [["not / be", ["wasn't", "was not"]], ["not / be", ["wasn't", "was not"]], ["get", "got"], ["not / be", ["wasn't", "was not"]], ["not", ["doesn't", "does not", "won't"]]], "עבר: wasn't. היום: doesn't / won't.", "Past: wasn't. Today: doesn't / won't.", { allow: ["lucky", "boss", "turn"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "ng", 3);
l3.mcq("I don't know ___ about it.", ["anything", "nothing", "something"], "שלילה אחת: don't + anything.", "One negative: don't + anything.", { trap: "n-double" });
l3.mcq("___ called while you were out.", ["Nobody", "Anybody", "Not anybody"], "Nobody בתחילת משפט = אף אחד.", "Nobody at the start = no person.");
l3.type("I can't swim, and my sister can't ___.", "either", "either", "not … either = גם לא.", "not … either = also not.");
l3.type("I ___ he'll come. He's always late.", "not / think", ["don't think", "do not think"], "I don't think + פועל חיובי.", "I don't think + positive verb.");
l3.fix("We didn't see *nobody at the beach.", ["anybody", "anyone"], "שלילה אחת: didn't + anybody.", "One negative: didn't + anybody.", { trap: "n-double", allow: ["beach"] });
l3.fix("There is *any milk left.", ["no"], "בחיוב: There is + no = אין.", "There is no milk left.", { allow: ["left"] });
l3.mcq("She ___ listens to me!", ["never", "doesn't never", "don't never"], "never כבר שלילה – לא מוסיפים doesn't.", "never is already negative.", { trap: "n-double" });
l3.transform("There isn't any time.", "Say it with 'no'.", "אמרו את זה עם no", ["There's no time.", "There is no time."], "not any אפשר להחליף ב-no.", "not any = no.");
l3.transform("I think he isn't right.", "Make it more natural with 'I don't think'.", "הפכו לטבעי יותר עם I don't think", ["I don't think he's right.", "I don't think he is right.", "I do not think he is right."], "I don't think + פועל חיובי.", "I don't think + positive verb.");
l3.sort(["✓ Correct", "✗ Wrong"], [["I don't know anything.", "✓ Correct"], ["I don't know nothing.", "✗ Wrong"], ["Nobody came.", "✓ Correct"], ["He doesn't never smile.", "✗ Wrong"], ["She can't come either.", "✓ Correct"], ["I not like it.", "✗ Wrong"]], "התיקונים: I don't know anything · He never smiles · I don't like it.", "Fixes: I don't know anything · He never smiles · I don't like it.", { allow: ["smile"] });
l3.cloze("An empty fridge", "When I opened the fridge, there was {1} food inside. I didn't find {2} to eat. My brother didn't buy {3} either. I don't think we {4} eat tonight. {5} told me to go shopping!", [["no / any", "no"], ["something / anything", "anything"], ["some / any", "any"], ["will / won't", "will"], ["Nobody / Anybody", "Nobody"]], "there was no. didn't + anything / any. I don't think + חיובי. Nobody בתחילת משפט.", "there was no; didn't + anything / any; I don't think + positive; Nobody.", { allow: ["fridge", "empty", "inside"] });
l3.write("Write five true sentences about things you don't do, didn't do, or can't do. Use 'never' or 'anything' at least once.", "כתבו חמישה משפטים נכונים על דברים שאתם לא עושים, לא עשיתם או לא יכולים לעשות. השתמשו לפחות פעם אחת ב-never או anything.", "I don't drink coffee. I didn't go out last night. I can't play the piano. I never eat fish. I didn't buy anything yesterday.", "don't / doesn't / didn't / can't + פועל. never / anything – שלילה אחת.", "don't / didn't / can't + verb; only one negative.");

export const negativesItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
