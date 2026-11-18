import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: DETERMINERS: Possessives (my / your … , mine / yours …, 's).

export const possessivesTopic: GrammarTopic = {
  id: "possessives",
  group: "nouns",
  title: "my / mine / 's",
  titleHe: "שייכות – my, mine, 's",
  bandRefs: ["DETERMINERS: Possessives"],
  grades: { 7: "accurate", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "my, your, his, her, its, our, their + שם עצם", en: "my / your / his / her / its / our / their + noun", examples: ["**my** bag", "**her** brother", "**their** house"] },
        { he: "his = שלו, her = שלה", en: "his = belongs to a man; her = to a woman", examples: ["Dan loves **his** dog.", "Maya loves **her** dog."] },
        { he: "'s = של (לאנשים)", en: "'s for people's things", examples: ["**Dan's** bike", "my **mom's** car"] },
        { he: "Whose…? = של מי?", en: "Whose…? = belonging to whom?", examples: ["**Whose** bag is this? – It's **Noa's**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "my / your / his / her / our / their + noun", example: "This is our classroom." },
        { kind: "affirmative", pattern: "name + 's + noun", example: "Maya's phone" },
        { kind: "question", pattern: "Whose + noun + is this?", example: "Whose jacket is this?" },
      ],
      timeWords: ["my", "your", "his", "her", "our", "their", "'s"],
    },
    2: {
      points: [
        { he: "mine / yours / his / hers / ours / theirs – בלי שם עצם", en: "mine / yours / his / hers / ours / theirs – no noun after", examples: ["This bag is **mine**.", "Is this pen **yours**?"] },
        { he: "רבים עם s: s' (the boys')", en: "Plural nouns with s: s'", examples: ["my **parents'** car", "the **girls'** room"] },
        { he: "its (שלו / שלה של דבר) ≠ it's (it is)", en: "its (possession) ≠ it's (it is)", examples: ["The dog wagged **its** tail.", "**It's** cold today."] },
        { he: "their (שלהם) ≠ there (שם) ≠ they're (they are)", en: "their / there / they're", examples: ["**Their** house is big.", "**They're** at home."] },
      ],
      form: [
        { kind: "affirmative", pattern: "noun + is + mine / yours / hers / ours / theirs", example: "The red car is ours." },
        { kind: "affirmative", pattern: "plural noun + ' + noun", example: "the students' books" },
      ],
      timeWords: ["mine", "yours", "hers", "ours", "theirs", "its"],
    },
    3: {
      points: [
        { he: "חבר שלי = a friend of mine", en: "a friend of mine / of hers", examples: ["She's **a friend of mine**."] },
        { he: "own – משלי", en: "my own / on my own", examples: ["I have **my own** room.", "She lives **on her own**."] },
        { he: "'s גם לזמן: today's, a week's", en: "'s with time: today's, a week's", examples: ["**today's** news", "a **week's** vacation"] },
        { he: "'s של כמה אנשים: Dan and Maya's", en: "Shared possession: Dan and Maya's", examples: ["**Dan and Maya's** house (they share it)"] },
      ],
      form: [
        { kind: "affirmative", pattern: "a / an + noun + of + mine / yours / hers …", example: "a cousin of ours" },
        { kind: "affirmative", pattern: "my / your … + own + noun", example: "He has his own car." },
      ],
      timeWords: ["of mine", "my own", "on my own", "today's"],
    },
  },
  traps: [
    { id: "po-his-her", wrong: "Maya called his mother.", right: "Maya called her mother.", whyHe: "Maya היא אישה → her.", whyEn: "Maya is female → her." },
    { id: "po-mine-noun", wrong: "This is mine book.", right: "This is my book.", whyHe: "לפני שם עצם – my, לא mine.", whyEn: "Before a noun → my." },
    { id: "po-of", wrong: "the car of my dad", right: "my dad's car", whyHe: "לאנשים משתמשים ב-'s.", whyEn: "For people → 's." },
    { id: "po-its", wrong: "The cat licked it's paw.", right: "The cat licked its paw.", whyHe: "its = שלו (של דבר / חיה). it's = it is.", whyEn: "its (possession) vs it's (it is)." },
    { id: "po-their", wrong: "There house is big.", right: "Their house is big.", whyHe: "שלהם = their. there = שם.", whyEn: "their = belonging to them." },
  ],
};

const T = "possessives";

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "po", 1, 7);
g7a.mcq("Dan loves ___ team.", ["his", "her", "their"], "Dan = he, ולכן his.", "Dan = he → his.", { trap: "po-his-her" });
g7a.mcq("Noa is helping ___ mom.", ["her", "his", "its"], "Noa = she, ולכן her.", "Noa = she → her.", { trap: "po-his-her" });
g7a.mcq("We love ___ village.", ["our", "their", "your"], "we, ולכן our.", "we → our.");
g7a.mcq("This is ___ bike. (Dan)", ["Dan's", "Dans", "of Dan"], "של דן → Dan's.", "Dan's.", { trap: "po-of", allow: ["bike"] });
g7a.mcq("The kids took ___ bags.", ["their", "there", "they"], "the kids = they, ולכן their.", "they → their.", { trap: "po-their" });
g7a.bank("I can't find ___ list.", ["my", "mine", "me"], "לפני שם עצם → my.", "Before a noun → my.", { trap: "po-mine-noun" });
g7a.bank("___ bag is this? – It's Maya's.", ["Whose", "Who", "Who's"], "של מי → Whose.", "Belonging to whom → Whose.");
g7a.bank("Is this ___ brush, Tom?", ["your", "yours", "you"], "לפני שם עצם → your.", "Before a noun → your.");
g7a.order("This is my brother's guide.", "my brother's + שם עצם.", "my brother's + noun.");
g7a.order("Our team won the game.", "המבנה: our + team.", "our + team.");
g7a.sort(["his", "her", "their"], [["Dan … bag", "his"], ["Maya … bag", "her"], ["the kids … bags", "their"], ["my dad … car", "his"], ["my sister … room", "her"], ["my parents … house", "their"]], "he, ולכן his, she → her, they → their.", "he → his, she → her, they → their.");
g7a.match([["I", "my"], ["she", "her"], ["we", "our"], ["they", "their"]], "כל כינוי והשייכות שלו.", "Each pronoun and its possessive.", { instr: "התאימו כל כינוי לצורת השייכות שלו" });

const g7b = itemSet(T, "po", 2, 7);
g7b.type("This brush isn't ___. It's my sister's.", "I", "mine", "בלי שם עצם אחרי → mine.", "No noun after → mine.");
g7b.type("Is this pen ___? – Yes, it's mine.", "you", "yours", "בלי שם עצם → yours.", "No noun after → yours.");
g7b.type("My ___ car is new. (two parents)", "parents", "parents'", "רבים עם s → parents'.", "Plural with s → parents'.");
g7b.type("The dog is wagging ___ tail.", "it", "its", "של הכלב → its (בלי ').", "its (no apostrophe).", { trap: "po-its", allow: ["wagging", "tail"] });
g7b.mcq("These lemons are ___.", ["ours", "our", "us"], "בלי שם עצם → ours.", "No noun after → ours.");
g7b.fix("Maya is cleaning *his room.", ["her"], "Maya = she, ולכן her.", "Maya = she → her.", { trap: "po-his-her" });
g7b.fix("That is *mine bowl.", ["my"], "לפני שם עצם → my.", "Before a noun → my.", { trap: "po-mine-noun" });
g7b.fix("*There team is very good.", ["Their"], "שלהם → Their.", "Their = belonging to them.", { trap: "po-their" });
g7b.transform("This is the bike of my brother.", "Say it with 's.", "אמרו את זה עם 's", ["This is my brother's bike."], "שימו לב: my brother's bike.", "my brother's bike.", { trap: "po-of", allow: ["bike"] });
g7b.transform("This is my guide.", "End the sentence with 'mine'.", "סיימו את המשפט ב-mine", ["This guide is mine."], "בלי שם עצם → mine.", "No noun after → mine.");
g7b.order("Whose list is this?", "Whose + שם עצם + is this?", "Whose + noun + is this?");
g7b.cloze("Our club", "This is {1} club. {2} name is \"Mountain Team\". Dan is {3} guide, and Noa is {4} sister. The yellow bags are {5}!", [["we", "our"], ["it", "Its"], ["we", "our"], ["he", "his"], ["we", "ours"]], "our / Its / our / his + שם עצם, ours לבד.", "our / Its / our / his / ours.", { allow: ["yellow"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "po", 1, 8);
g8a.mcq("The actor forgot ___ lines. (a man)", ["his", "her", "their"], "the actor (גבר) → his.", "A man → his.", { trap: "po-his-her" });
g8a.mcq("My aunt sold ___ business.", ["her", "his", "its"], "my aunt = she, ולכן her.", "she → her.", { trap: "po-his-her", allow: ["aunt"] });
g8a.mcq("We decorated ___ house.", ["our", "their", "your"], "we, ולכן our.", "we → our.");
g8a.mcq("This is ___ camera. (my dad)", ["my dad's", "my dads", "of my dad"], "של אבא שלי → my dad's.", "my dad's.", { trap: "po-of" });
g8a.mcq("The actors took ___ places on the stage.", ["their", "there", "they"], "the actors = they, ולכן their.", "they → their.", { trap: "po-their", allow: ["places"] });
g8a.bank("I lost ___ ticket.", ["my", "mine", "me"], "לפני שם עצם → my.", "Before a noun → my.", { trap: "po-mine-noun" });
g8a.bank("___ gloves are these? – They're Omer's.", ["Whose", "Who", "Who's"], "של מי → Whose.", "Whose.");
g8a.bank("Is this ___ camera, Shira?", ["your", "yours", "you"], "לפני שם עצם → your.", "Before a noun → your.");
g8a.order("This is my uncle's café.", "my uncle's + שם עצם.", "my uncle's + noun.");
g8a.order("Their flight was late.", "המבנה: their + flight.", "their + flight.");
g8a.sort(["his", "her", "their"], [["the actor … role", "his"], ["the chef (a woman) … dish", "her"], ["the passengers … bags", "their"], ["my uncle … business", "his"], ["my aunt … café", "her"], ["the players … team", "their"]], "he, ולכן his, she → her, they → their.", "he → his, she → her, they → their.", { allow: ["chef", "woman", "aunt"] });
g8a.match([["he", "his"], ["it", "its"], ["you", "your"], ["they", "their"]], "כל כינוי והשייכות שלו.", "Each pronoun and its possessive.", { instr: "התאימו כל כינוי לצורת השייכות שלו" });

const g8b = itemSet(T, "po", 2, 8);
g8b.type("This camera isn't ___. It's my brother's.", "I", "mine", "בלי שם עצם → mine.", "No noun after → mine.");
g8b.type("Are these tickets ___? – Yes, they're ours.", "you", "yours", "בלי שם עצם → yours.", "No noun after → yours.");
g8b.type("The ___ room is upstairs. (two girls)", "girls", "girls'", "רבים עם s → girls'.", "Plural with s → girls'.", { allow: ["upstairs"] });
g8b.type("The café changed ___ menu.", "it", "its", "של בית הקפה → its.", "its (no apostrophe).", { trap: "po-its", allow: ["menu"] });
g8b.mcq("Those seats are ___.", ["theirs", "their", "them"], "בלי שם עצם → theirs.", "No noun after → theirs.", { allow: ["seats"] });
g8b.fix("My aunt loves *his new car.", ["her"], "my aunt = she, ולכן her.", "she → her.", { trap: "po-his-her", allow: ["aunt"] });
g8b.fix("That is *mine camera.", ["my"], "לפני שם עצם → my.", "Before a noun → my.", { trap: "po-mine-noun" });
g8b.fix("The café is famous for *it's cakes.", ["its"], "its = שלו (בלי ').", "its = possession.", { trap: "po-its", allow: ["famous"] });
g8b.transform("This is the restaurant of my uncle.", "Say it with 's.", "אמרו את זה עם 's", ["This is my uncle's restaurant."], "שימו לב: my uncle's restaurant.", "my uncle's restaurant.", { trap: "po-of", allow: ["restaurant"] });
g8b.transform("This is your ticket.", "End the sentence with 'yours'.", "סיימו את המשפט ב-yours", ["This ticket is yours."], "בלי שם עצם → yours.", "No noun after → yours.");
g8b.order("Whose camera is on the table?", "Whose + שם עצם + is…?", "Whose + noun + is…?");
g8b.cloze("Lost and found", "\"Is this {1} jacket?\" \"No, it's not {2}. I think it's Omer's.\" \"And these gloves – are they {3}?\" \"Yes, they're {4}! Thanks!\" \"And whose phone is this?\" \"It's my {5}.\"", [["you", "your"], ["I", "mine"], ["you", "yours"], ["I", "mine"], ["sister", "sister's"]], "your + שם עצם, mine / yours לבד, sister's – של אחותי.", "your / mine / yours / mine / sister's.");

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "po", 1, 9);
g9a.mcq("The firefighter took off ___ helmet. (a man)", ["his", "her", "their"], "a man, ולכן his.", "A man → his.", { trap: "po-his-her", allow: ["helmet"] });
g9a.mcq("The architect showed us ___ plan. (a woman)", ["her", "his", "its"], "a woman, ולכן her.", "A woman → her.", { trap: "po-his-her", allow: ["woman"] });
g9a.mcq("We repaired ___ oven.", ["our", "their", "your"], "we, ולכן our.", "we → our.");
g9a.mcq("This is ___ novel. (my sister)", ["my sister's", "my sisters", "of my sister"], "של אחותי → my sister's.", "my sister's.", { trap: "po-of" });
g9a.mcq("The neighbors sold ___ apartment.", ["their", "there", "they"], "the neighbors = they, ולכן their.", "they → their.", { trap: "po-their" });
g9a.bank("I can't find ___ charger.", ["my", "mine", "me"], "לפני שם עצם → my.", "Before a noun → my.", { trap: "po-mine-noun", allow: ["charger"] });
g9a.bank("___ ladder is this? – It's the neighbor's.", ["Whose", "Who", "Who's"], "של מי → Whose.", "Whose.");
g9a.bank("Is this ___ selfie, Itay?", ["your", "yours", "you"], "לפני שם עצם → your.", "Before a noun → your.");
g9a.order("This is my cousin's wedding.", "my cousin's + שם עצם.", "my cousin's + noun.", { allow: ["cousin"] });
g9a.order("Their apartment is near the stadium.", "המבנה: their + apartment.", "their + apartment.");
g9a.sort(["his", "her", "their"], [["the firefighter (a man) … helmet", "his"], ["the architect (a woman) … plan", "her"], ["the neighbors … garden", "their"], ["my grandfather … novel", "his"], ["my colleague (a woman) … office", "her"], ["the dolphins … babies", "their"]], "he, ולכן his, she → her, they → their.", "he → his, she → her, they → their.", { allow: ["helmet", "woman", "babies"] });
g9a.match([["she", "hers"], ["we", "ours"], ["I", "mine"], ["they", "theirs"]], "כל כינוי וכינוי השייכות שבא לבד.", "Each pronoun and its possessive pronoun.", { instr: "התאימו כל כינוי לכינוי השייכות שלו" });

const g9b = itemSet(T, "po", 2, 9);
g9b.type("This charger isn't ___. It's my colleague's.", "I", "mine", "בלי שם עצם → mine.", "No noun after → mine.", { allow: ["charger"] });
g9b.type("Is this novel ___? – Yes, it's hers.", "she", "hers", "בלי שם עצם → hers.", "No noun after → hers.");
g9b.type("My ___ apartment is near the sea. (two grandparents)", "grandparents", "grandparents'", "רבים עם s → grandparents'.", "Plural with s → grandparents'.");
g9b.type("The tower lost ___ top in the storm.", "it", "its", "של המגדל → its.", "its (no apostrophe).", { trap: "po-its", allow: ["storm"] });
g9b.mcq("Those selfies are ___.", ["ours", "our", "us"], "בלי שם עצם → ours.", "No noun after → ours.");
g9b.fix("My grandmother sews *his own clothes.", ["her"], "my grandmother = she, ולכן her.", "she → her.", { trap: "po-his-her" });
g9b.fix("That is *mine ladder.", ["my"], "לפני שם עצם → my.", "Before a noun → my.", { trap: "po-mine-noun" });
g9b.fix("The neighbors left *there door open.", ["their"], "שלהם → their.", "their = belonging to them.", { trap: "po-their" });
g9b.transform("This is the apartment of my colleague.", "Say it with 's.", "אמרו את זה עם 's", ["This is my colleague's apartment."], "שימו לב: my colleague's apartment.", "my colleague's apartment.", { trap: "po-of" });
g9b.transform("These are their selfies.", "End the sentence with 'theirs'.", "סיימו את המשפט ב-theirs", ["These selfies are theirs."], "בלי שם עצם → theirs.", "No noun after → theirs.");
g9b.order("Whose ladder is in the garage?", "Whose + שם עצם + is…?", "Whose + noun + is…?");
g9b.cloze("At the wedding", "\"Is this {1} seat?\" \"No, {2} is next to my cousin.\" \"Whose bag is this?\" \"It's {3} – my brother's.\" \"And the gift?\" \"It's {4}. We bought it together. Dan and {5} wife chose it.\"", [["you", "your"], ["I", "mine"], ["he", "his"], ["we", "ours"], ["he", "his"]], "your + שם עצם, mine / his / ours לבד, his wife.", "your / mine / his / ours / his.", { allow: ["seat", "cousin", "gift", "wife"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "po", 3);
l3.mcq("She's a good friend of ___.", ["mine", "my", "me"], "שימו לב: a friend of mine.", "a friend of mine.");
l3.mcq("I want to have my ___ room.", ["own", "self", "alone"], "my own = משלי.", "my own.");
l3.type("Have you read ___ news? (today)", "today", "today's", "today's news – 's גם לזמן.", "today's news.");
l3.type("We stayed at Dan and ___ house. (Maya – they share it)", "Maya", "Maya's", "שייכות משותפת → Dan and Maya's.", "Shared → Dan and Maya's.");
l3.fix("The cat licked *it's paw.", ["its"], "its = שלו (בלי ').", "its = possession.", { trap: "po-its", allow: ["licked", "paw"] });
l3.fix("*There going to be late.", ["They're"], "they are, ולכן They're.", "they are → They're.", { trap: "po-their" });
l3.mcq("This is ___ room.", ["my brother's", "the of my brother", "my brothers"], "לאנשים – 's: my brother's room.", "For people → my brother's room.", { trap: "po-of" });
l3.transform("She lives alone.", "Say it with 'on her own'.", "אמרו את זה עם on her own", ["She lives on her own."], "on her own = לבד.", "on her own = alone.");
l3.transform("He is one of my friends.", "Say it with 'a friend of mine'.", "אמרו את זה עם a friend of mine", ["He is a friend of mine.", "He's a friend of mine."], "שימו לב: a friend of mine.", "a friend of mine.");
l3.sort(["✓ Correct", "✗ Wrong"], [["The dog wagged its tail.", "✓ Correct"], ["The dog wagged it's tail.", "✗ Wrong"], ["She's a friend of mine.", "✓ Correct"], ["This is mine bag.", "✗ Wrong"], ["Their house is big.", "✓ Correct"], ["Maya called his mom.", "✗ Wrong"]], "התיקונים: its tail · my bag · her mom.", "Fixes: its tail · my bag · her mom.", { allow: ["wagged", "tail"] });
l3.cloze("A family business", "My grandparents opened {1} bakery fifty years ago. Now it's my {2} business – Mom runs it on {3} own. The bakery is famous for {4} bread. A friend of {5} works there on weekends.", [["they", "their"], ["mom", "mom's"], ["she", "her"], ["it", "its"], ["I", "mine"]], "שימו לב: their / mom's / on her own / its / a friend of mine.", "their / mom's / her own / its / mine.", { allow: ["bakery", "runs", "famous", "bread", "fifty"] });
l3.write("Describe some things in your home and who they belong to. Use my, mine, 's, their and its.", "תארו כמה דברים בבית שלכם ולמי הם שייכים. השתמשו ב-my, mine, 's, their ו-its.", "The big room is my parents'. The blue bike is mine, and the red one is my sister's. Our dog has its own bed, and the neighbors left their cat with us.", "my + שם עצם, mine לבד, 's לאנשים, its לדבר / חיה.", "my / mine / 's / its / their.");

export const possessivesItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
