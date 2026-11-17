import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG, QUE } from "@/data/grammar/build";

// Band II: VERBS: There is / There are (+ past: there was / there were).

export const thereIsAreTopic: GrammarTopic = {
  id: "there-is-are",
  group: "tenses",
  title: "There is / There are",
  titleHe: "יש / היה – there is, there are",
  bandRefs: ["VERBS: There is/There are"],
  grades: { 7: "evolving", 8: "accurate", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "יש = there is (אחד) / there are (הרבה)", en: "there is (one) / there are (many)", examples: ["There **is** a park near my house.", "There **are** two cats in the garden."] },
        { he: "היה = there was / there were", en: "Past: there was / there were", examples: ["There **was** a party yesterday.", "There **were** many people."] },
        { he: "אין = there isn't / there aren't", en: "Negative: there isn't / there aren't", examples: ["There **isn't** any milk.", "There **aren't** any chairs."] },
        { he: "שאלה: Is there…? / Are there…?", en: "Question: Is there…? / Are there…?", examples: ["**Is there** a bus stop here?", "**Are there** any apples?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "There is + one thing / There are + many", example: "There are three rooms." },
        { kind: "affirmative", pattern: "There was / There were (past)", example: "There was a storm." },
        { kind: "negative", pattern: "There isn't / aren't / wasn't / weren't", example: "There wasn't any time." },
        { kind: "question", pattern: "Is / Are / Was / Were + there …?", example: "Were there any problems?" },
      ],
      timeWords: ["now", "today", "yesterday", "last year"],
    },
    2: {
      points: [
        { he: "לפי מה שבא אחרי: אחד → is / was, הרבה → are / were", en: "Look at what comes next: one → is / was, many → are / were", examples: ["There **is** a key on the desk.", "There **were** ten players."] },
        { he: "לא אומרים It has / They have במובן 'יש'", en: "Don't say 'It has' to mean 'there is'", examples: ["There **is** a pool in the hotel.", "✗ It has a pool in the hotel."] },
        { he: "שמות שלא סופרים (water, money) → is / was", en: "Uncountable nouns → is / was", examples: ["There **is** some water.", "There **wasn't** much time."] },
        { he: "any בשלילה ובשאלה", en: "Use any in negatives and questions", examples: ["There **aren't any** tickets.", "**Is there any** milk?"] },
      ],
      form: [
        { kind: "affirmative", pattern: "There is / was + a / an / uncountable", example: "There is some cheese." },
        { kind: "affirmative", pattern: "There are / were + plural", example: "There were many cars." },
        { kind: "negative", pattern: "There isn't / aren't + any …", example: "There aren't any eggs." },
        { kind: "short_answer", pattern: "Yes, there is. / No, there aren't.", example: "No, there wasn't." },
      ],
      timeWords: ["some", "any", "many", "much", "a lot of"],
    },
    3: {
      points: [
        { he: "the / a / some קובעים: is מול are", en: "The noun right after there decides is / are", examples: ["There **is** a pen and two books.", "There **are** two books and a pen."] },
        { he: "עם How many שואלים: are there / were there", en: "How many …? → are there / were there", examples: ["How many students **are there**?", "How many people **were there**?"] },
        { he: "there + be בכל זמן", en: "there + be in other tenses", examples: ["There **will be** a test tomorrow.", "There **is going to be** a storm."] },
        { he: "לא there have / there has", en: "Never 'there have'", examples: ["There **are** many problems.", "✗ There have many problems."] },
      ],
      form: [
        { kind: "affirmative", pattern: "There is / are / was / were / will be …", example: "There will be snow." },
        { kind: "question", pattern: "How many + plural + are / were there?", example: "How many rooms are there?" },
      ],
      timeWords: ["tomorrow", "next week", "in the past", "nowadays"],
    },
  },
  traps: [
    { id: "ti-it-has", wrong: "It has a pool in the school.", right: "There is a pool in the school.", whyHe: "'יש' במובן 'קיים' = there is, לא it has.", whyEn: "'There is' means something exists; don't use 'it has'." },
    { id: "ti-agree", wrong: "There is many people here.", right: "There are many people here.", whyHe: "הרבה (many people) → are.", whyEn: "Many people → are." },
    { id: "ti-past", wrong: "There is a party yesterday.", right: "There was a party yesterday.", whyHe: "yesterday = עבר → there was.", whyEn: "yesterday → there was." },
    { id: "ti-question", wrong: "There is a bus stop here?", right: "Is there a bus stop here?", whyHe: "בשאלה is עובר לפני there.", whyEn: "In a question, is goes before there." },
    { id: "ti-have", wrong: "There have two parks.", right: "There are two parks.", whyHe: "אין there have – משתמשים ב-are.", whyEn: "Never 'there have' – use are." },
  ],
};

const T = "there-is-are";
const S = ["there is / was", "there are / were"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "ti", 1, 7);
g7a.mcq("There ___ a bridge over the river.", ["is", "are", "am"], "a bridge = אחד, ולכן there is.", "a bridge = one → there is.");
g7a.mcq("There ___ three mountains near the village.", ["are", "is", "has"], "three mountains = הרבה, ולכן there are.", "three mountains = many → there are.", { trap: "ti-agree" });
g7a.mcq("There ___ a lemon in the bowl yesterday.", ["was", "were", "is"], "yesterday = עבר, ואחד → there was.", "yesterday = past, one → there was.", { trap: "ti-past" });
g7a.mcq("There ___ many people at the theater last night.", ["were", "was", "are"], "last night = עבר, והרבה → there were.", "last night = past, many → there were.");
g7a.mcq("___ there a science club at your school?", ["Is", "Are", "Does"], "שאלה: Is there…?", "Question: Is there…?", { trap: "ti-question" });
g7a.bank("There ___ any salt on the table.", ["isn't", "aren't", "don't"], "salt לא סופרים → there isn't.", "salt is uncountable → there isn't.");
g7a.bank("There ___ two teams in the competition.", ["are", "is", "has"], "two teams = הרבה → there are.", "two teams → there are.", { trap: "ti-have" });
g7a.bank("___ there any danger in the river?", ["Is", "Are", "Has"], "danger לא סופרים → Is there…?", "danger is uncountable → Is there…?");
g7a.order("There is a list on the door.", "There is + מה + איפה.", "There is + what + where.");
g7a.order("Are there any lists in the office?", "שאלה: Are there + any…?", "Question: Are there + any…?", { trap: "ti-question" });
g7a.sort(S, [["a bowl", "there is / was"], ["two bridges", "there are / were"], ["some oil", "there is / was"], ["many villages", "there are / were"], ["a club", "there is / was"], ["three guides", "there are / were"]], "אחד או משהו שלא סופרים → is / was. הרבה → are / were.", "One thing or uncountable → is / was. Many → are / were.");
g7a.match([["There is", "a new office in town."], ["There are", "five players on the team."], ["There was", "a big storm last night."], ["There were", "lots of lemons on the tree."]], "is / was עם אחד, are / were עם הרבה.", "is / was with one, are / were with many.", { allow: ["storm", "tree"] });

const g7b = itemSet(T, "ti", 2, 7);
g7b.type("There ___ a great variety of meals here.", "be – present", "is", "a variety = אחד, ולכן there is.", "a variety = one thing → there is.");
g7b.type("There ___ many activities at the club last year.", "be – past", "were", "last year = עבר, many → there were.", "last year, many → there were.");
g7b.type("There ___ any pepper in the kitchen.", "be – present, not", ["isn't", "is not"], "pepper לא סופרים → there isn't.", "pepper is uncountable → there isn't.");
g7b.type("___ there any danger on the journey?", "be – past", "Was", "שאלה בעבר עם danger → Was there…?", "Past question, uncountable → Was there…?", { trap: "ti-question" });
g7b.mcq("How many players ___ on your team?", ["are there", "there are", "is there"], "אחרי How many שואלים: are there?", "How many → are there?");
g7b.fix("There *is two rivers near the village.", ["are"], "two rivers = הרבה → there are.", "two rivers → there are.", { trap: "ti-agree" });
g7b.fix("*It has a theater in our town.", ["There is", "There's"], "'יש' = There is, לא It has.", "Use There is, not It has.", { trap: "ti-it-has" });
g7b.fix("There *is a band at the party last night.", ["was"], "last night = עבר → there was.", "last night → there was.", { trap: "ti-past" });
g7b.transform("There is a guide on the bus.", ...QUE, "Is there a guide on the bus?", "בשאלה is עובר לפני there.", "In a question, is goes before there.", { trap: "ti-question" });
g7b.transform("There were many people on the bridge.", ...NEG, ["There weren't many people on the bridge.", "There were not many people on the bridge."], "שלילה: were + not = weren't.", "were + not = weren't.");
g7b.order("There was a lot of noise in the village.", "סדר המילים: There was + a lot of + noise.", "There was + a lot of + noise.");
g7b.cloze("Our village", "In our village there {1} a small river and there {2} two old bridges. Last year there {3} a big festival. There {4} a lot of music and there {5} many visitors.", [["be", "is"], ["be", "are"], ["be", "was"], ["be", "was"], ["be", "were"]], "הווה: is / are. Last year = עבר: was / were. music לא סופרים → was.", "Present: is / are. Last year: was / were. music is uncountable → was.", { allow: ["festival", "visitors"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "ti", 1, 8);
g8a.mcq("There ___ a café on the corner.", ["is", "are", "has"], "a café = אחד → there is.", "a café = one → there is.", { trap: "ti-it-has" });
g8a.mcq("There ___ many factories in this city.", ["are", "is", "am"], "many factories = הרבה → there are.", "many factories → there are.", { trap: "ti-agree" });
g8a.mcq("There ___ a concert in the park last night.", ["was", "were", "is"], "last night = עבר, אחד → there was.", "last night, one → there was.", { trap: "ti-past" });
g8a.mcq("There ___ a lot of cars in the traffic jam yesterday.", ["were", "was", "are"], "a lot of cars = הרבה, עבר → there were.", "a lot of cars, past → there were.");
g8a.mcq("___ there a swimming pool in the hotel?", ["Is", "Are", "Does"], "שאלה: Is there…?", "Question: Is there…?", { trap: "ti-question", allow: ["hotel"] });
g8a.bank("There ___ any flour in the cupboard.", ["isn't", "aren't", "don't"], "flour לא סופרים → there isn't.", "flour is uncountable → there isn't.", { allow: ["cupboard"] });
g8a.bank("There ___ two airports in the city.", ["are", "is", "has"], "two airports = הרבה, ולכן there are.", "two airports → there are.", { trap: "ti-have" });
g8a.bank("___ there any ingredients for the cake?", ["Are", "Is", "Has"], "ingredients = הרבה → Are there…?", "ingredients = plural → Are there…?");
g8a.order("There is a police station near the port.", "There is + מה + איפה.", "There is + what + where.", { allow: ["port"] });
g8a.order("Are there any coins in your bag?", "שאלה: Are there + any…?", "Question: Are there + any…?", { trap: "ti-question" });
g8a.sort(S, [["a factory", "there is / was"], ["two islands", "there are / were"], ["some cream", "there is / was"], ["many actors", "there are / were"], ["a flag", "there is / was"], ["three concerts", "there are / were"]], "אחד או משהו שלא סופרים → is / was. הרבה → are / were.", "One thing or uncountable → is / was. Many → are / were.");
g8a.match([["There is", "a camera on the desk."], ["There are", "ten ingredients in this dish."], ["There was", "an accident on the highway."], ["There were", "lots of soldiers at the border."]], "is / was עם אחד, are / were עם הרבה.", "is / was with one, are / were with many.");

const g8b = itemSet(T, "ti", 2, 8);
g8b.type("There ___ a discount on all the gloves today.", "be – present", "is", "a discount = אחד → there is.", "a discount = one → there is.");
g8b.type("There ___ many tourists on the island last summer.", "be – past", "were", "last summer = עבר, ו-many = הרבה, ולכן there were.", "last summer, many → there were.", { allow: ["tourists"] });
g8b.type("There ___ any traffic on the road this morning.", "be – past, not", ["wasn't", "was not"], "traffic לא סופרים, בעבר → there wasn't.", "traffic is uncountable, past → there wasn't.");
g8b.type("___ there a museum in your town?", "be – present", "Is", "שאלה עם אחד: Is there…?", "Question with one thing: Is there…?", { trap: "ti-question" });
g8b.mcq("How many people ___ at the concert last night?", ["were there", "there were", "was there"], "How many + עבר → were there?", "How many, past → were there?");
g8b.fix("There *is a lot of actors in the movie.", ["are"], "a lot of actors = הרבה → there are.", "a lot of actors → there are.", { trap: "ti-agree" });
g8b.fix("*It has a big supermarket near my house.", ["There is", "There's"], "'יש' = There is, לא It has.", "Use There is, not It has.", { trap: "ti-it-has" });
g8b.fix("There *are an accident on the highway yesterday.", ["was"], "an accident = אחד, ו-yesterday = עבר, ולכן there was.", "one accident, past → there was.", { trap: "ti-past" });
g8b.transform("There are drums in the music room.", ...QUE, "Are there drums in the music room?", "בשאלה are עובר לפני there.", "In a question, are goes before there.", { trap: "ti-question" });
g8b.transform("There was a lot of traffic.", ...NEG, ["There wasn't a lot of traffic.", "There was not a lot of traffic.", "There wasn't much traffic."], "שלילה: was + not = wasn't.", "was + not = wasn't.");
g8b.order("There were two actors on the stage.", "There were + כמה + מה + איפה.", "There were + how many + what + where.");
g8b.cloze("Our trip abroad", "In the city there {1} a famous museum and there {2} many cafés. On the first day there {3} a big concert in the park. There {4} thousands of people, and there {5} any rain!", [["be", "is"], ["be", "are"], ["be", "was"], ["be", "were"], ["be – not", ["wasn't", "was not"]]], "הווה: is / are. עבר: was / were. rain לא סופרים → wasn't.", "Present: is / are. Past: was / were. rain → wasn't.", { allow: ["famous", "thousands", "rain"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "ti", 1, 9);
g9a.mcq("There ___ an elevator in our building.", ["is", "are", "has"], "an elevator = אחד → there is.", "an elevator = one → there is.", { trap: "ti-it-has", allow: ["building"] });
g9a.mcq("There ___ many statues in the garden.", ["are", "is", "am"], "many statues = הרבה, ולכן there are.", "many statues → there are.", { trap: "ti-agree" });
g9a.mcq("There ___ a fire in the neighborhood last night.", ["was", "were", "is"], "last night, אחד → there was.", "last night, one → there was.", { trap: "ti-past" });
g9a.mcq("There ___ lots of firefighters at the scene.", ["were", "was", "is"], "lots of firefighters = הרבה, עבר → there were.", "many firefighters, past → there were.", { allow: ["scene"] });
g9a.mcq("___ there an oven in the new apartment?", ["Is", "Are", "Does"], "שאלה: Is there…?", "Question: Is there…?", { trap: "ti-question" });
g9a.bank("There ___ any sugar in this jar.", ["isn't", "aren't", "don't"], "sugar לא סופרים → there isn't.", "sugar is uncountable → there isn't.", { allow: ["sugar"] });
g9a.bank("There ___ two stadiums in our city.", ["are", "is", "has"], "two stadiums = הרבה, ולכן there are.", "two stadiums → there are.", { trap: "ti-have" });
g9a.bank("___ there any towers in the old city?", ["Are", "Is", "Has"], "towers = הרבה → Are there…?", "towers = plural → Are there…?");
g9a.order("There is a ladder in the garage.", "There is + מה + איפה.", "There is + what + where.");
g9a.order("Are there any tissues in your bag?", "שאלה: Are there + any…?", "Question: Are there + any…?", { trap: "ti-question" });
g9a.sort(S, [["an oven", "there is / was"], ["two towers", "there are / were"], ["some dust", "there is / was"], ["many strangers", "there are / were"], ["a statue", "there is / was"], ["three candles", "there are / were"]], "אחד או משהו שלא סופרים → is / was. הרבה → are / were.", "One thing or uncountable → is / was. Many → are / were.");
g9a.match([["There is", "a novel on my desk."], ["There are", "dolphins in the sea."], ["There was", "a wedding in the hall."], ["There were", "many guests at the party."]], "is / was עם אחד, are / were עם הרבה.", "is / was with one, are / were with many.", { allow: ["hall", "guests"] });

const g9b = itemSet(T, "ti", 2, 9);
g9b.type("There ___ a lot of furniture in the living room.", "be – present", "is", "furniture לא סופרים → there is.", "furniture is uncountable → there is.");
g9b.type("There ___ hundreds of people at the marathon yesterday.", "be – past", "were", "hundreds of people, עבר → there were.", "hundreds of people, past → there were.");
g9b.type("There ___ any equipment in the lab.", "be – past, not", ["wasn't", "was not"], "equipment לא סופרים, בעבר → there wasn't.", "equipment is uncountable, past → there wasn't.");
g9b.type("___ there any good documentaries on TV last night?", "be – past", "Were", "documentaries = הרבה, עבר → Were there…?", "plural, past → Were there…?", { trap: "ti-question", allow: ["tv"] });
g9b.mcq("How many floors ___ in the tower?", ["are there", "there are", "is there"], "אחרי How many שואלים: are there?", "How many → are there?", { allow: ["floors"] });
g9b.fix("There *is many apps on my phone.", ["are"], "many apps = הרבה, ולכן there are.", "many apps → there are.", { trap: "ti-agree" });
g9b.fix("*It has a gallery in the neighborhood.", ["There is", "There's"], "'יש' = There is, לא It has.", "Use There is, not It has.", { trap: "ti-it-has" });
g9b.fix("There *are a wedding in the garden last week.", ["was"], "a wedding = אחד, ו-last week = עבר, ולכן there was.", "one wedding, past → there was.", { trap: "ti-past" });
g9b.transform("There is a sink in the kitchen.", ...QUE, "Is there a sink in the kitchen?", "בשאלה is עובר לפני there.", "In a question, is goes before there.", { trap: "ti-question" });
g9b.transform("There were many strangers at the party.", ...NEG, ["There weren't many strangers at the party.", "There were not many strangers at the party."], "שלילה: were + not = weren't.", "were + not = weren't.");
g9b.order("There was a candle on the table.", "There was + מה + איפה.", "There was + what + where.");
g9b.cloze("A new neighborhood", "In our new neighborhood there {1} a big park and there {2} two stadiums. Last week there {3} a marathon. There {4} hundreds of runners, but there {5} any problems.", [["be", "is"], ["be", "are"], ["be", "was"], ["be", "were"], ["be – not", ["weren't", "were not"]]], "הווה: is / are. Last week = עבר: was / were. problems = הרבה → weren't.", "Present: is / are. Last week: was / were. problems → weren't.", { allow: ["runners"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "ti", 3);
l3.mcq("There ___ a pen and two notebooks on the desk.", ["is", "are", "be"], "השם הראשון אחרי there (a pen) קובע → is.", "The first noun (a pen) decides → is.");
l3.mcq("There ___ a test tomorrow, so study tonight!", ["will be", "will have", "is going"], "בעתיד: there will be.", "Future: there will be.", { trap: "ti-have" });
l3.type("How many countries ___ in Europe?", "be – present", "are there", "אחרי How many שואלים: are there?", "How many → are there?", { allow: ["europe"] });
l3.type("There ___ much traffic when we left.", "be – past, not", ["wasn't", "was not"], "traffic לא סופרים, עבר → wasn't.", "traffic is uncountable, past → wasn't.");
l3.fix("There *have many problems with this plan.", ["are"], "אין there have → there are.", "Never 'there have' → there are.", { trap: "ti-have" });
l3.fix("*It has a lot of noise in the street.", ["There is", "There's"], "There is, לא It has.", "Use There is, not It has.", { trap: "ti-it-has" });
l3.fix("There *was a lot of people at the meeting.", ["were"], "people = רבים → there were.", "people is plural → there were.", { trap: "ti-agree" });
l3.transform("There were 30 students in the room.", "Ask a question with 'How many'.", "שאלו שאלה עם How many", ["How many students were there in the room?", "How many students were there?"], "סדר המילים: How many + students + were there?", "How many + students + were there?");
l3.transform("There is going to be a storm.", ...NEG, ["There isn't going to be a storm.", "There is not going to be a storm."], "שלילה: isn't going to be.", "isn't going to be.", { allow: ["storm"] });
l3.sort(["✓ Correct", "✗ Wrong"], [["There is a lot of water.", "✓ Correct"], ["There have two doors.", "✗ Wrong"], ["Is there any milk?", "✓ Correct"], ["There is many cars.", "✗ Wrong"], ["There will be a party.", "✓ Correct"], ["It has a pool in my school.", "✗ Wrong"]], "התיקונים: There are two doors · There are many cars · There is a pool.", "Fixes: There are two doors · There are many cars · There is a pool.");
l3.cloze("A town in the past", "A hundred years ago there {1} no cars in our town, and there {2} only one school. Today there {3} three schools and there {4} a lot of traffic. In the future there {5} a train station too.", [["be", "were"], ["be", "was"], ["be", "are"], ["be", "is"], ["be – future", "will be"]], "עבר: was / were. הווה: is / are. עתיד: will be.", "Past: was / were. Present: is / are. Future: will be.");
l3.write("Describe your neighborhood: what there is, what there isn't, and what there was in the past.", "תארו את השכונה שלכם: מה יש, מה אין, ומה היה פעם.", "There is a big park and there are two schools. There isn't a cinema. In the past there was a market here.", "there is / are בהווה, there was / were בעבר.", "there is / are now, there was / were in the past.");

export const thereIsAreItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
