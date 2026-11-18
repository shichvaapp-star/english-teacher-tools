import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: CLAUSES: Relative – defining (who / which / that), non-defining (with commas).

export const relativeClausesTopic: GrammarTopic = {
  id: "relative-clauses",
  group: "clauses",
  title: "who / which / that",
  titleHe: "משפטי זיקה – who, which, that",
  bandRefs: ["CLAUSES: Relative - defining", "CLAUSES: Relative - non-defining"],
  grades: { 7: "emerging", 8: "evolving", 9: "evolving" },
  rule: {
    1: {
      points: [
        { he: "who – לאנשים", en: "who – for people", examples: ["The girl **who** sings is my sister."] },
        { he: "which – לדברים ולבעלי חיים", en: "which – for things and animals", examples: ["The bag **which** is on the table is mine."] },
        { he: "that – גם לאנשים וגם לדברים", en: "that – for people and things", examples: ["The man **that** helped me…", "The book **that** I read…"] },
        { he: "המשפט מסביר על מי / על מה מדברים", en: "The clause tells us which person / thing", examples: ["I have a friend **who** lives in Eilat."] },
      ],
      form: [
        { kind: "affirmative", pattern: "person + who / that + verb", example: "The boy who won is happy." },
        { kind: "affirmative", pattern: "thing + which / that + verb", example: "The phone which broke was new." },
      ],
      timeWords: ["who", "which", "that"],
    },
    2: {
      points: [
        { he: "בלי he / she / it אחרי who / which", en: "No extra pronoun after who / which", examples: ["The man who **lives** here…", "✗ The man who he lives here…"] },
        { he: "where – למקומות", en: "where – for places", examples: ["This is the café **where** we met."] },
        { he: "whose – של מי", en: "whose – for possession", examples: ["That's the boy **whose** dog is lost."] },
        { he: "אפשר להשמיט that / which כשאחריו בא נושא", en: "that / which can be left out before a subject", examples: ["The book (that) **I** read was great."] },
      ],
      form: [
        { kind: "affirmative", pattern: "place + where + subject + verb", example: "The town where I grew up is small." },
        { kind: "affirmative", pattern: "person + whose + noun + verb", example: "The girl whose bike was stolen cried." },
      ],
      timeWords: ["who", "which", "that", "where", "whose"],
    },
    3: {
      points: [
        { he: "משפט זיקה עם פסיקים – מידע נוסף", en: "Non-defining clause (with commas) – extra information", examples: ["My dad, **who** is a pilot, travels a lot."] },
        { he: "עם פסיקים – לא משתמשים ב-that", en: "No that in non-defining clauses", examples: ["Haifa, **which** is in the north, is beautiful.", "✗ Haifa, that is in the north…"] },
        { he: "מילת יחס בסוף", en: "Prepositions at the end", examples: ["The girl (who) I talked **to**…", "The house (that) I live **in**…"] },
        { he: "which על כל המשפט", en: "which referring to a whole idea", examples: ["He passed the test, **which** surprised everyone."] },
      ],
      form: [
        { kind: "affirmative", pattern: "noun, who / which + clause, …", example: "Tom, who lives next door, is a doctor." },
        { kind: "affirmative", pattern: "noun + (that) + subject + verb + preposition", example: "The song I was listening to…" },
      ],
      timeWords: ["who", "which", "whose", "where", "whom"],
    },
  },
  traps: [
    { id: "rc-which-person", wrong: "The girl which sings is my sister.", right: "The girl who sings is my sister.", whyHe: "לאנשים – who (לא which).", whyEn: "People → who." },
    { id: "rc-who-thing", wrong: "The bag who is on the table is mine.", right: "The bag which is on the table is mine.", whyHe: "לדברים – which / that (לא who).", whyEn: "Things → which / that." },
    { id: "rc-extra-pronoun", wrong: "The man who he lives here is a doctor.", right: "The man who lives here is a doctor.", whyHe: "אחרי who לא מוסיפים he / she.", whyEn: "No extra he / she after who." },
    { id: "rc-what", wrong: "The movie what I saw was good.", right: "The movie that I saw was good.", whyHe: "לא what – משתמשים ב-that / which.", whyEn: "Use that / which, not what." },
  ],
};

const T = "relative-clauses";
const B = ["who", "which"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "rc", 1, 7);
g7a.mcq("The girl ___ sings in the band is my sister.", ["who", "which", "what"], "girl = אדם → who.", "A person → who.", { trap: "rc-which-person" });
g7a.mcq("The bowl ___ is on the table is new.", ["which", "who", "what"], "bowl = דבר → which.", "A thing → which.", { trap: "rc-who-thing" });
g7a.mcq("I have a friend ___ lives in a village.", ["who", "which", "where"], "friend = אדם → who.", "A person → who.");
g7a.mcq("This is the river ___ we swim in every summer.", ["that", "who", "what"], "river = דבר → that / which.", "A thing → that.", { trap: "rc-what" });
g7a.mcq("The guide ___ helped us was very nice.", ["who", "which", "what"], "guide = אדם → who.", "A person → who.");
g7a.bank("The team ___ won the game is from Haifa.", ["which", "who", "what"], "team = קבוצה (דבר) → which / that.", "A team (thing) → which.");
g7a.bank("My uncle is the man ___ drives the bus.", ["who", "which", "what"], "man = אדם → who.", "A person → who.");
g7a.bank("The meal ___ we ate was great.", ["that", "who", "what"], "meal = דבר → that.", "A thing → that.", { trap: "rc-what" });
g7a.order("The boy who won the race is my brother.", "האדם + who + פעולה.", "person + who + action.");
g7a.order("The bridge which crosses the river is old.", "הדבר + which + פעולה.", "thing + which + action.");
g7a.sort(B, [["the teacher", "who"], ["the bowl", "which"], ["my cousin", "who"], ["the mountain", "which"], ["the players", "who"], ["the list", "which"]], "אנשים → who. דברים / בעלי חיים → which.", "People → who. Things / animals → which.", { allow: ["cousin"] });
g7a.match([["A doctor is a person", "who helps sick people."], ["A bridge is something", "which goes over a river."], ["A guide is a person", "who shows you the way."], ["A bowl is something", "which holds food."]], "who לאנשים, which לדברים.", "who for people, which for things.", { allow: ["doctor", "sick", "holds"] });

const g7b = itemSet(T, "rc", 2, 7);
g7b.type("The man ___ works in the office is my dad.", "who / which", "who", "man = אדם → who.", "A person → who.");
g7b.type("The mountain ___ we climbed was very high.", "who / which", ["which", "that"], "mountain = דבר → which / that.", "A thing → which / that.", { allow: ["climbed"] });
g7b.type("This is the village ___ my grandparents live.", "where / which", "where", "מקום → where.", "A place → where.");
g7b.type("She's the girl ___ brother plays in our team.", "whose / who", "whose", "של מי → whose.", "Possession → whose.");
g7b.mcq("The club ___ I joined meets on Mondays.", ["that", "who", "what"], "club = דבר → that.", "A thing → that.", { trap: "rc-what" });
g7b.fix("The teacher *which taught us history is very funny.", ["who", "that"], "teacher = אדם → who.", "A person → who.", { trap: "rc-which-person", allow: ["funny"] });
g7b.fix("The lemons *who are in the bowl are fresh.", ["which", "that"], "lemons = דברים → which.", "Things → which.", { trap: "rc-who-thing" });
g7b.fix("The movie *what we saw was great.", ["that", "which"], "לא what → that / which.", "Not what → that / which.", { trap: "rc-what" });
g7b.transform("I have a friend. She speaks three languages.", "Join with 'who'.", "חברו עם who", ["I have a friend who speaks three languages."], "who מחליף את she.", "who replaces she.", { trap: "rc-extra-pronoun", allow: ["languages"] });
g7b.transform("This is the bowl. It broke yesterday.", "Join with 'which'.", "חברו עם which", ["This is the bowl which broke yesterday.", "This is the bowl that broke yesterday."], "which מחליף את it.", "which replaces it.");
g7b.order("That's the theater where we saw the show.", "מקום + where + משפט.", "place + where + clause.", { allow: ["show"] });
g7b.cloze("My family", "My uncle is a man {1} loves to travel. He has a car {2} is very old. He lives in a village {3} there are many mountains. His daughter, {4} name is Noa, is my best friend.", [["who / which", "who"], ["who / which", ["which", "that"]], ["where / which", "where"], ["whose / who", "whose"]], "who – אדם, which – דבר, where – מקום, whose – של מי.", "who / which / where / whose.");

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "rc", 1, 8);
g8a.mcq("The actor ___ played the king was amazing.", ["who", "which", "what"], "actor = אדם → who.", "A person → who.", { trap: "rc-which-person" });
g8a.mcq("The camera ___ I bought is very small.", ["which", "who", "what"], "camera = דבר → which.", "A thing → which.", { trap: "rc-who-thing" });
g8a.mcq("I know a chef ___ cooks traditional food.", ["who", "which", "where"], "chef = אדם → who.", "A person → who.", { allow: ["chef"] });
g8a.mcq("This is the café ___ sells the best cakes.", ["that", "who", "what"], "café = מקום / עסק → that / which.", "A thing → that.", { trap: "rc-what" });
g8a.mcq("The director ___ made this movie is famous.", ["who", "which", "what"], "director = אדם → who.", "A person → who.", { allow: ["famous"] });
g8a.bank("The factory ___ makes these coins is in the north.", ["which", "who", "what"], "factory = דבר → which.", "A thing → which.", { allow: ["north"] });
g8a.bank("My cousin is the girl ___ plays the drums.", ["who", "which", "what"], "girl = אדם → who.", "A person → who.", { allow: ["cousin"] });
g8a.bank("The dish ___ we cooked was delicious.", ["that", "who", "what"], "dish = דבר → that.", "A thing → that.", { trap: "rc-what", allow: ["delicious"] });
g8a.order("The man who sold us the tickets was friendly.", "האדם + who + פעולה.", "person + who + action.");
g8a.order("The island which we visited was beautiful.", "הדבר + which + פעולה.", "thing + which + action.");
g8a.sort(B, [["the actor", "who"], ["the camera", "which"], ["the director", "who"], ["the concert", "which"], ["the passengers", "who"], ["the airport", "which"]], "אנשים → who. דברים → which.", "People → who. Things → which.");
g8a.match([["A chef is a person", "who cooks in a restaurant."], ["An airport is a place", "where planes land."], ["A camera is something", "which takes photos."], ["An actor is a person", "who performs in movies."]], "who לאנשים, which לדברים, where למקומות.", "who / which / where.", { allow: ["chef", "restaurant"] });

const g8b = itemSet(T, "rc", 2, 8);
g8b.type("The woman ___ owns this café is my aunt.", "who / which", "who", "woman = אדם → who.", "A person → who.", { allow: ["owns", "aunt"] });
g8b.type("The concert ___ we went to was amazing.", "who / which", ["which", "that"], "concert = דבר → which / that.", "A thing → which / that.");
g8b.type("This is the island ___ we spent our vacation.", "where / which", "where", "מקום → where.", "A place → where.");
g8b.type("That's the actor ___ movie won an award.", "whose / who", "whose", "של מי → whose.", "Possession → whose.", { allow: ["award"] });
g8b.mcq("The gloves ___ I lost were a gift.", ["that", "who", "what"], "gloves = דברים → that.", "Things → that.", { trap: "rc-what", allow: ["lost", "gift"] });
g8b.fix("The chef *which cooked our dinner is famous.", ["who", "that"], "chef = אדם → who.", "A person → who.", { trap: "rc-which-person", allow: ["chef", "famous"] });
g8b.fix("The camera *who I bought online is broken.", ["which", "that"], "camera = דבר → which.", "A thing → which.", { trap: "rc-who-thing" });
g8b.fix("The song *what she recorded is on the radio.", ["that", "which"], "לא what → that / which.", "Not what → that / which.", { trap: "rc-what", allow: ["radio"] });
g8b.transform("I met a man. He works at the airport.", "Join with 'who'.", "חברו עם who", ["I met a man who works at the airport."], "who מחליף את he.", "who replaces he.", { trap: "rc-extra-pronoun" });
g8b.transform("We ate a dish. It was very spicy.", "Join with 'which'.", "חברו עם which", ["We ate a dish which was very spicy.", "We ate a dish that was very spicy."], "which מחליף את it.", "which replaces it.", { allow: ["spicy"] });
g8b.order("This is the café where I met my best friend.", "מקום + where + משפט.", "place + where + clause.");
g8b.cloze("Our trip", "We stayed in a hotel {1} was near the sea. The man {2} worked at the desk was very kind. We visited a market {3} you can buy anything. A woman {4} shop was full of gloves gave us a discount!", [["who / which", ["which", "that"]], ["who / which", ["who", "that"]], ["where / which", "where"], ["whose / who", "whose"]], "which – דבר, who – אדם, where – מקום, whose – של מי.", "which / who / where / whose.", { allow: ["hotel", "desk", "kind", "market", "anything"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "rc", 1, 9);
g9a.mcq("The firefighter ___ saved the cat was on the news.", ["who", "which", "what"], "firefighter = אדם → who.", "A person → who.", { trap: "rc-which-person" });
g9a.mcq("The novel ___ I'm reading is very exciting.", ["which", "who", "what"], "novel = דבר → which.", "A thing → which.", { trap: "rc-who-thing", allow: ["exciting"] });
g9a.mcq("I have a colleague ___ speaks five languages.", ["who", "which", "where"], "colleague = אדם → who.", "A person → who.", { allow: ["languages"] });
g9a.mcq("This is the app ___ helps me study.", ["that", "who", "what"], "app = דבר → that.", "A thing → that.", { trap: "rc-what" });
g9a.mcq("The architect ___ designed the tower is from Haifa.", ["who", "which", "what"], "architect = אדם → who.", "A person → who.");
g9a.bank("The stadium ___ they built last year is huge.", ["which", "who", "what"], "stadium = דבר → which.", "A thing → which.");
g9a.bank("My neighbor is the woman ___ sews wedding dresses.", ["who", "which", "what"], "woman = אדם → who.", "A person → who.", { allow: ["dresses"] });
g9a.bank("The documentary ___ we watched was about dolphins.", ["that", "who", "what"], "documentary = דבר → that.", "A thing → that.", { trap: "rc-what" });
g9a.order("The man who repaired our oven was very fast.", "האדם + who + פעולה.", "person + who + action.");
g9a.order("The tower which stands in the center is very old.", "הדבר + which + פעולה.", "thing + which + action.", { allow: ["center"] });
g9a.sort(B, [["the architect", "who"], ["the oven", "which"], ["the firefighters", "who"], ["the novel", "which"], ["my colleague", "who"], ["the elevator", "which"]], "אנשים → who. דברים → which.", "People → who. Things → which.");
g9a.match([["A firefighter is a person", "who puts out fires."], ["A gallery is a place", "where you can see art."], ["An oven is something", "which cooks food."], ["An architect is a person", "who designs buildings."]], "who לאנשים, which לדברים, where למקומות.", "who / which / where.", { allow: ["art", "buildings"] });

const g9b = itemSet(T, "rc", 2, 9);
g9b.type("The stranger ___ helped me was very kind.", "who / which", "who", "stranger = אדם → who.", "A person → who.", { allow: ["kind"] });
g9b.type("The documentary ___ won the award is about the sea.", "who / which", ["which", "that"], "documentary = דבר → which / that.", "A thing → which / that.", { allow: ["award"] });
g9b.type("This is the stadium ___ the marathon starts.", "where / which", "where", "מקום → where.", "A place → where.");
g9b.type("That's the author ___ novel was translated into ten languages.", "whose / who", "whose", "של מי → whose.", "Possession → whose.", { allow: ["author", "languages"] });
g9b.mcq("The selfies ___ she posted got a lot of likes.", ["that", "who", "what"], "selfies = דברים → that.", "Things → that.", { trap: "rc-what", allow: ["likes"] });
g9b.fix("The architect *which designed this tower won a prize.", ["who", "that"], "architect = אדם → who.", "A person → who.", { trap: "rc-which-person", allow: ["prize"] });
g9b.fix("The oven *who we bought last week is already broken.", ["which", "that"], "oven = דבר → which.", "A thing → which.", { trap: "rc-who-thing" });
g9b.fix("The novel *what I borrowed is very long.", ["that", "which"], "לא what → that / which.", "Not what → that / which.", { trap: "rc-what" });
g9b.transform("I know a woman. She translates novels.", "Join with 'who'.", "חברו עם who", ["I know a woman who translates novels."], "who מחליף את she.", "who replaces she.", { trap: "rc-extra-pronoun" });
g9b.transform("We watched a documentary. It was about firefighters.", "Join with 'which'.", "חברו עם which", ["We watched a documentary which was about firefighters.", "We watched a documentary that was about firefighters."], "which מחליף את it.", "which replaces it.");
g9b.order("This is the neighborhood where I grew up.", "מקום + where + משפט.", "place + where + clause.");
g9b.cloze("A special wedding", "My cousin, {1} is an architect, got married last week. The wedding was in a gallery {2} she once worked. The cake, {3} was huge, was made by a chef {4} restaurant is famous. Everyone {5} came had a great time.", [["who / which", "who"], ["where / which", "where"], ["who / which", "which"], ["whose / who", "whose"], ["who / which", ["who", "that"]]], "who – אדם, where – מקום, which – דבר, whose – של מי.", "who / where / which / whose.", { allow: ["cousin", "married", "chef", "restaurant", "famous"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "rc", 3);
l3.mcq("My dad, ___ is a pilot, travels a lot.", ["who", "that", "which"], "משפט עם פסיקים על אדם → who (לא that).", "Non-defining, person → who (not that).");
l3.mcq("Haifa, ___ is in the north, has a beautiful port.", ["which", "that", "who"], "משפט עם פסיקים על מקום / דבר → which (לא that).", "Non-defining, thing → which.", { allow: ["north", "port"] });
l3.type("He passed the test, ___ surprised everyone.", "which / that", "which", "which על כל המשפט הקודם.", "which refers to the whole idea.", { allow: ["surprised"] });
l3.type("The girl I talked ___ is from Canada.", "preposition", "to", "talk to – מילת היחס בסוף.", "talk to – preposition at the end.", { allow: ["canada"] });
l3.fix("My brother, *that lives in Eilat, is a diver.", ["who"], "עם פסיקים – who, לא that.", "Non-defining → who.", { allow: ["diver"] });
l3.fix("The house *which I grew up is now a café.", ["where"], "מקום (גדלתי בו) → where.", "A place → where.");
l3.mcq("The man ___ you is my uncle.", ["who called", "who he called", "which called"], "אחרי who לא מוסיפים he.", "No extra he after who.", { trap: "rc-extra-pronoun" });
l3.transform("Tom lives next door. He is a doctor.", "Join with ', who … ,' (extra information).", "חברו עם , who … , (מידע נוסף)", ["Tom, who lives next door, is a doctor.", "Tom, who is a doctor, lives next door."], "שם, who + מידע נוסף, המשך.", "Name, who + extra info, rest.", { allow: ["doctor"] });
l3.transform("This is the song. I was listening to it.", "Join without 'it' (end with 'to').", "חברו בלי it (סיימו ב-to)", ["This is the song I was listening to.", "This is the song that I was listening to.", "This is the song which I was listening to."], "מילת היחס בסוף: listening to.", "Preposition at the end.");
l3.sort(["✓ Correct", "✗ Wrong"], [["The girl who sings is my sister.", "✓ Correct"], ["The girl which sings is my sister.", "✗ Wrong"], ["My mom, who is a nurse, works nights.", "✓ Correct"], ["My mom, that is a nurse, works nights.", "✗ Wrong"], ["The book I read was great.", "✓ Correct"], ["The book what I read was great.", "✗ Wrong"]], "התיקונים: who sings · , who is a nurse, · The book that I read.", "Fixes: who sings · , who is · that I read.", { allow: ["nurse", "nights"] });
l3.cloze("A famous scientist", "Marie Curie, {1} was born in Poland, was a scientist {2} work changed the world. She worked in Paris, {3} she met her husband. She won two Nobel prizes, {4} no woman had done before.", [["who / which", "who"], ["whose / who", "whose"], ["where / which", "where"], ["which / that", "which"]], "who – אדם, whose – של מי, where – מקום, which – על כל הרעיון.", "who / whose / where / which.", { allow: ["marie", "curie", "poland", "scientist", "paris", "husband", "nobel", "prizes", "famous", "woman"] });
l3.write("Describe three people or places that are important to you, using who, which, where and whose.", "תארו שלושה אנשים או מקומות שחשובים לכם, עם who, which, where ו-whose.", "My grandmother, who lives in Haifa, tells great stories. The park where I play football is near my house. My best friend is a girl whose dog is very funny.", "who – אנשים, which – דברים, where – מקומות, whose – של מי.", "who / which / where / whose.");

export const relativeClausesItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
