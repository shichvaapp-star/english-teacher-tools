import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, QUE } from "@/data/grammar/build";

// Band II: PASSIVES: Present simple (grades 8–9), Past simple (grade 9) – agent unknown / not important, + by agent.
// Grade 8 sets use the present simple passive only.

export const passiveTopic: GrammarTopic = {
  id: "passive",
  group: "passive",
  title: "Passive (is made / was made)",
  titleHe: "סביל – is made / was made",
  bandRefs: ["PASSIVES: Present simple", "PASSIVES: Past simple"],
  grades: { 8: "emerging", 9: "emerging" },
  rule: {
    1: {
      points: [
        { he: "סביל: חשוב מה קורה לדבר, לא מי עושה", en: "Passive: what happens to something, not who does it", examples: ["Cheese **is made** from milk.", "English **is spoken** here."] },
        { he: "is / are + צורה שלישית", en: "is / are + past participle", examples: ["The room **is cleaned** every day.", "The cars **are washed**."] },
        { he: "בעבר: was / were + צורה שלישית", en: "Past: was / were + past participle", examples: ["The bridge **was built** in 1990.", "The cakes **were eaten**."] },
        { he: "by + מי שעשה (אם חשוב)", en: "by + who did it (if important)", examples: ["The song **was written by** my uncle."] },
      ],
      form: [
        { kind: "affirmative", pattern: "is / are + V3 (present)", example: "The shop is closed on Sundays." },
        { kind: "affirmative", pattern: "was / were + V3 (past)", example: "The window was broken." },
        { kind: "negative", pattern: "isn't / wasn't + V3", example: "Dinner isn't served after ten." },
        { kind: "question", pattern: "Is / Was + subject + V3?", example: "Was it made in Israel?" },
      ],
      timeWords: ["by", "every day", "in 1990", "last year"],
    },
    2: {
      points: [
        { he: "פעיל → סביל: המושא הופך לנושא", en: "Active → passive: the object becomes the subject", examples: ["They **clean** the room. → The room **is cleaned**."] },
        { he: "is / are לפי הנושא החדש", en: "is / are agrees with the new subject", examples: ["The book **is** read.", "The books **are** read."] },
        { he: "צורה שלישית של פעלים יוצאי דופן", en: "Irregular past participles", examples: ["make → **made**", "write → **written**", "build → **built**", "speak → **spoken**", "steal → **stolen**"], chips: true },
        { he: "by רק כשחשוב לדעת מי", en: "Use by only when 'who' matters", examples: ["My bike **was stolen**. (we don't know who)", "It **was painted by** Picasso."] },
      ],
      form: [
        { kind: "affirmative", pattern: "object → subject + is / are / was / were + V3 (+ by …)", example: "The museum was opened by the mayor." },
        { kind: "question", pattern: "Where / When + is / was + subject + V3?", example: "Where is coffee grown?" },
      ],
      timeWords: ["by", "made of", "made in", "built in"],
    },
    3: {
      points: [
        { he: "סביל בזמנים אחרים", en: "Passive in other tenses", examples: ["The road **will be opened** next week.", "The house **is being painted**."] },
        { he: "סביל אחרי can / must / should", en: "Passive after modals", examples: ["Phones **must be switched** off.", "It **can be done**."] },
        { he: "חדשות ומדע – הרבה סביל", en: "News and science use the passive", examples: ["Two people **were injured** in the accident."] },
        { he: "צירופים קבועים: born, made of, known as", en: "Fixed passives: born, made of, known as", examples: ["I **was born** in Haifa.", "It's **made of** wood."] },
      ],
      form: [
        { kind: "affirmative", pattern: "will be / modal + be + V3", example: "It will be finished soon." },
        { kind: "affirmative", pattern: "is / are being + V3 (in progress)", example: "The road is being repaired." },
      ],
      timeWords: ["will be", "must be", "is being", "has been"],
    },
  },
  traps: [
    { id: "pv-no-be", wrong: "The room cleaned every day.", right: "The room is cleaned every day.", whyHe: "בסביל חייבים is / are / was / were.", whyEn: "The passive needs is / are / was / were." },
    { id: "pv-v2", wrong: "The cake was ate.", right: "The cake was eaten.", whyHe: "בסביל – צורה שלישית (eaten), לא עבר (ate).", whyEn: "Passive → past participle (eaten)." },
    { id: "pv-agree", wrong: "The cars is washed.", right: "The cars are washed.", whyHe: "The cars = רבים → are.", whyEn: "Plural → are." },
    { id: "pv-from", wrong: "The book was written from a teacher.", right: "The book was written by a teacher.", whyHe: "מי שעשה → by, לא from.", whyEn: "The doer → by." },
  ],
};

const T = "passive";

// ───────────── Grade 8 (present simple passive) ─────────────
const g8a = itemSet(T, "pv", 1, 8);
g8a.mcq("Cheese ___ from milk.", ["is made", "made", "is make"], "סביל בהווה: is + made.", "Present passive: is made.", { trap: "pv-no-be", allow: ["cheese"] });
g8a.mcq("English ___ in many countries.", ["is spoken", "speaks", "is speak"], "סביל: is + spoken.", "Passive: is spoken.", { allow: ["countries"] });
g8a.mcq("These cakes ___ every morning.", ["are baked", "is baked", "bake"], "These cakes = רבים → are baked.", "Plural → are baked.", { trap: "pv-agree", allow: ["baked", "bake"] });
g8a.mcq("The café ___ on Saturdays.", ["is closed", "closes is", "is close"], "סביל: is + closed.", "Passive: is closed.");
g8a.mcq("Many cars ___ in this factory.", ["are made", "is made", "make"], "Many cars = רבים → are made.", "Plural → are made.", { trap: "pv-agree" });
g8a.bank("Coffee ___ in Brazil.", ["is grown", "grows is", "is grow"], "סביל: is + grown (צורה שלישית).", "Passive: is grown.", { allow: ["brazil", "grown", "grow", "grows"] });
g8a.bank("The tickets ___ online.", ["are sold", "is sold", "sell"], "The tickets = רבים → are sold.", "Plural → are sold.", { trap: "pv-agree" });
g8a.bank("The museum ___ by thousands of people every year.", ["is visited", "visits", "is visit"], "סביל + by: is visited by…", "Passive + by: is visited by…", { allow: ["thousands"] });
g8a.order("The house is cleaned every week.", "נושא + is + צורה שלישית + מתי.", "Subject + is + V3 + when.");
g8a.order("Where are these phones made?", "Where + are + נושא + צורה שלישית?", "Where + are + subject + V3?", { allow: ["phones"] });
g8a.sort(["is", "are"], [["The cake … made.", "is"], ["The cars … washed.", "are"], ["The room … cleaned.", "is"], ["The windows … opened.", "are"], ["The music … played.", "is"], ["The tickets … sold.", "are"]], "יחיד או משהו שלא סופרים → is. רבים → are.", "Singular / uncountable → is. Plural → are.", { allow: ["windows"] });
g8a.match([["Bread", "is made from flour."], ["The floors", "are cleaned every day."], ["Arabic", "is spoken in many countries."], ["Concert tickets", "are sold online."]], "סביל: is / are + צורה שלישית.", "Passive: is / are + V3.", { allow: ["bread", "floors", "countries"] });

const g8b = itemSet(T, "pv", 2, 8);
g8b.type("The dishes ___ after every meal.", "wash", "are washed", "The dishes = רבים → are washed.", "Plural → are washed.", { trap: "pv-agree" });
g8b.type("This dish ___ with rice and beans.", "make", "is made", "make, ולכן made: is made.", "make → is made.", { allow: ["rice", "beans"] });
g8b.type("The museum ___ on Mondays.", "not / open", ["isn't opened", "is not opened"], "סביל בשלילה: isn't opened.", "Negative passive: isn't opened.");
g8b.type("Spanish ___ in Mexico.", "speak", "is spoken", "speak, ולכן spoken: is spoken.", "speak → is spoken.", { allow: ["spanish", "mexico"] });
g8b.mcq("These bags are made ___ hand.", ["by", "from", "with"], "by hand = בעבודת יד.", "by hand.", { trap: "pv-from" });
g8b.fix("The floor *cleaned every evening.", ["is cleaned"], "חסר is: The floor is cleaned.", "Missing is.", { trap: "pv-no-be", allow: ["floor"] });
g8b.fix("These cameras *is made in Japan.", ["are"], "These cameras = רבים → are.", "Plural → are.", { trap: "pv-agree", allow: ["japan"] });
g8b.fix("The concert is *record by a TV company.", ["recorded"], "סביל – צורה שלישית: recorded.", "Passive → recorded.", { allow: ["tv"] });
g8b.transform("They sell tickets at the door.", "Make it passive.", "הפכו לסביל", ["Tickets are sold at the door.", "The tickets are sold at the door."], "המבנה: Tickets + are + sold.", "Tickets are sold…");
g8b.transform("Rice is grown in China.", ...QUE, ["Is rice grown in China?"], "שאלה בסביל: Is + rice + grown?", "Is rice grown…?", { allow: ["rice", "grown", "china"] });
g8b.order("This cake is decorated by hand.", "נושא + is + צורה שלישית + by hand.", "Subject + is + V3 + by hand.");
g8b.cloze("How chocolate is made", "Chocolate {1} from cocoa beans. First, the beans {2} from the trees. Then they {3} in the sun. Finally, the chocolate {4} in a factory and {5} all over the world.", [["make", "is made"], ["pick", "are picked"], ["dry", "are dried"], ["produce", "is produced"], ["sell", "is sold"]], "סביל בהווה: is / are + צורה שלישית.", "Present passive: is / are + V3.", { allow: ["chocolate", "cocoa", "beans", "picked", "dried", "produced", "trees", "pick", "dry", "produce"] });

// ───────────── Grade 9 (present + past simple passive) ─────────────
const g9a = itemSet(T, "pv", 1, 9);
g9a.mcq("This tower ___ in 1920.", ["was built", "is built", "built"], "בעבר (1920): was + built.", "Past: was built.", { trap: "pv-no-be" });
g9a.mcq("The fire ___ by the firefighters.", ["was put out", "put out", "was put outed"], "סביל בעבר: was + put out.", "Past passive: was put out.");
g9a.mcq("These statues ___ by a famous artist.", ["were made", "was made", "made"], "These statues = רבים, עבר → were made.", "Plural, past → were made.", { trap: "pv-agree", allow: ["artist", "famous"] });
g9a.mcq("Tweets ___ by millions of people every day.", ["are posted", "is posted", "post"], "Tweets = רבים, הווה → are posted.", "Plural, present → are posted.", { trap: "pv-agree", allow: ["millions"] });
g9a.mcq("My wallet ___ yesterday.", ["was stolen", "was stole", "stole"], "steal, ולכן stolen: was stolen.", "steal → was stolen.", { trap: "pv-v2" });
g9a.bank("This novel ___ into ten languages.", ["was translated", "translated", "was translate"], "סביל בעבר: was translated.", "Past passive: was translated.", { allow: ["languages"] });
g9a.bank("The oven ___ last week.", ["was repaired", "repaired", "is repair"], "last week = עבר → was repaired.", "last week → was repaired.");
g9a.bank("The exhibition ___ by thousands of visitors.", ["was visited", "visited", "was visit"], "סביל + by: was visited by…", "Passive + by: was visited by…", { allow: ["thousands", "visitors"] });
g9a.order("The stadium was built ten years ago.", "נושא + was + צורה שלישית + מתי.", "Subject + was + V3 + when.");
g9a.order("When was this novel written?", "When + was + נושא + צורה שלישית?", "When + was + subject + V3?");
g9a.sort(["was", "were"], [["The tower … built.", "was"], ["The statues … made.", "were"], ["The article … translated.", "was"], ["The firefighters … called.", "were"], ["My wallet … stolen.", "was"], ["The photos … taken.", "were"]], "יחיד → was. רבים → were.", "Singular → was. Plural → were.");
g9a.match([["The Eiffel Tower", "was built in 1889."], ["Harry Potter", "was written by J.K. Rowling."], ["The windows", "were broken in the storm."], ["Two people", "were rescued by firefighters."]], "סביל בעבר: was / were + צורה שלישית.", "Past passive: was / were + V3.", { allow: ["eiffel", "harry", "potter", "rowling", "j", "k", "windows", "storm", "rescued"] });

const g9b = itemSet(T, "pv", 2, 9);
g9b.type("The photos ___ by a professional photographer.", "take", "were taken", "רבים, עבר: were + taken.", "Plural, past → were taken.", { trap: "pv-v2", allow: ["photographer"] });
g9b.type("This app ___ by two students.", "create", "was created", "עבר: was + created.", "Past → was created.");
g9b.type("The documentary ___ on TV yet.", "not / show", ["hasn't been shown", "has not been shown", "wasn't shown", "was not shown"], "סביל בשלילה: wasn't shown / hasn't been shown.", "Negative passive.", { allow: ["tv"] });
g9b.type("The wedding ___ in a beautiful garden.", "hold", "was held", "hold, ולכן held: was held.", "hold → was held.");
g9b.mcq("The novel was written ___ a young author.", ["by", "from", "with"], "מי שעשה → by.", "The doer → by.", { trap: "pv-from", allow: ["author"] });
g9b.fix("The bridge *built in 1990.", ["was built"], "חסר was: The bridge was built.", "Missing was.", { trap: "pv-no-be" });
g9b.fix("The candles *was lit by my grandmother.", ["were"], "The candles = רבים → were.", "Plural → were.", { trap: "pv-agree", allow: ["lit"] });
g9b.fix("The cake was *ate in five minutes.", ["eaten"], "סביל – צורה שלישית: eaten.", "Passive → eaten.", { trap: "pv-v2" });
g9b.transform("Someone stole my bike.", "Make it passive.", "הפכו לסביל", ["My bike was stolen.", "My bike was stolen by someone."], "המבנה: My bike + was + stolen.", "My bike was stolen.", { allow: ["bike"] });
g9b.transform("The firefighters rescued the cat.", "Make it passive (with by).", "הפכו לסביל (עם by)", ["The cat was rescued by the firefighters."], "המבנה: The cat + was rescued + by the firefighters.", "The cat was rescued by…", { allow: ["rescued"] });
g9b.order("Where was this photo taken?", "Where + was + נושא + צורה שלישית?", "Where + was + subject + V3?");
g9b.cloze("A famous statue", "The Statue of Liberty {1} by the people of France. It {2} to the USA in 1886. The statue {3} of copper. Today it {4} by millions of tourists every year.", [["give", "was given"], ["send", "was sent"], ["make", "is made"], ["visit", "is visited"]], "עבר: was given / sent. הווה: is made / visited.", "Past: was given / sent. Present: is made / visited.", { allow: ["liberty", "france", "usa", "copper", "millions", "tourists"] });

// ───────────── Level 3 (grades 8–9) ─────────────
const l3 = itemSet(T, "pv", 3);
l3.mcq("The new road ___ next month.", ["will be opened", "will open be", "is opened"], "סביל בעתיד: will be + opened.", "Future passive: will be opened.");
l3.mcq("Phones must ___ off during the test.", ["be switched", "switched", "switch"], "סביל אחרי must: must be + switched.", "Modal passive: must be switched.", { allow: ["phones", "switched"] });
l3.type("Our house ___ right now, so we're staying with Grandma.", "paint", "is being painted", "בתהליך עכשיו: is being + painted.", "In progress: is being painted.", { allow: ["grandma"] });
l3.type("Two people ___ in the accident.", "injure", "were injured", "חדשות, עבר: were injured.", "News, past → were injured.");
l3.fix("This table is made *from wood.", ["of"], "made of + חומר (שנשאר כמו שהוא).", "made of + material.", { allow: ["wood"] });
l3.mcq("The thief ___ by the police.", ["was caught", "catched", "was catch"], "סביל בעבר: was + caught.", "Past passive: was caught.", { trap: "pv-no-be", allow: ["thief", "catched"] });
l3.fix("The letters were written *from my grandfather.", ["by"], "מי שעשה → by.", "The doer → by.", { trap: "pv-from", allow: ["letters"] });
l3.transform("They will build a new school.", "Make it passive.", "הפכו לסביל", ["A new school will be built."], "המבנה: A new school + will be built.", "A new school will be built.");
l3.transform("You can do it online.", "Make it passive (It can…).", "הפכו לסביל (It can…)", ["It can be done online."], "המבנה: It + can be + done.", "It can be done online.");
l3.sort(["✓ Correct", "✗ Wrong"], [["It was made in Italy.", "✓ Correct"], ["The cake was ate.", "✗ Wrong"], ["Phones must be turned off.", "✓ Correct"], ["The room cleaned every day.", "✗ Wrong"], ["I was born in 2011.", "✓ Correct"], ["It was written from a doctor.", "✗ Wrong"]], "התיקונים: was eaten · is cleaned · written by.", "Fixes: was eaten · is cleaned · written by.", { allow: ["italy", "phones", "doctor"] });
l3.cloze("Breaking news", "A famous painting {1} from the city museum last night. The alarm {2} at 2 a.m., and the police {3} immediately. The painting {4} yet, but the museum says the thief {5} soon.", [["steal", "was stolen"], ["hear", "was heard"], ["call", "were called"], ["not / find", ["hasn't been found", "has not been found"]], ["catch", "will be caught"]], "סביל בזמנים שונים: was stolen, were called, hasn't been found, will be caught.", "Passive in different tenses.", { allow: ["painting", "alarm", "immediately", "thief", "breaking"] });
l3.write("Describe how something you use every day is made (food, clothes or a phone). Use at least four passive sentences.", "תארו איך מייצרים משהו שאתם משתמשים בו כל יום (אוכל, בגדים או טלפון). השתמשו לפחות בארבעה משפטים בסביל.", "Bread is made from flour, water and salt. First, the flour is mixed with water. Then the bread is baked in an oven. Finally, it is sold in shops.", "is / are / was / were + צורה שלישית.", "be + past participle.");

export const passiveItems: GrammarItem[] = [...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items];
