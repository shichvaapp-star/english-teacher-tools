import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet } from "@/data/grammar/build";

// Band II: NOUNS: Articles (a / an / the – differentiate, previously mentioned), DETERMINERS/NOUNS: No article (things in general).

export const articlesTopic: GrammarTopic = {
  id: "articles",
  group: "nouns",
  title: "a / an / the",
  titleHe: "a / an / the – תוויות יידוע",
  bandRefs: ["NOUNS: Articles", "DETERMINERS/NOUNS: No article"],
  grades: { 7: "evolving", 8: "evolving", 9: "accurate" },
  rule: {
    1: {
      points: [
        { he: "a / an = אחד (לא מסוים)", en: "a / an = one (not a specific one)", examples: ["I have **a** dog.", "She ate **an** apple."] },
        { he: "an לפני צליל של תנועה (a, e, i, o, u)", en: "an before a vowel sound", examples: ["**an** egg", "**an** hour", "**a** university"], chips: true },
        { he: "the = ה- (מסוים, כבר דיברנו עליו)", en: "the = a specific / known one", examples: ["I have a dog. **The** dog is black.", "Close **the** door, please."] },
        { he: "בעברית אין a – באנגלית צריך", en: "Hebrew has no 'a' – English needs it", examples: ["She is **a** teacher.", "✗ She is teacher."] },
      ],
      form: [
        { kind: "affirmative", pattern: "a + consonant sound / an + vowel sound", example: "a car, an orange" },
        { kind: "affirmative", pattern: "the + specific noun", example: "the car in our garage" },
      ],
      timeWords: ["a", "an", "the"],
    },
    2: {
      points: [
        { he: "פעם ראשונה a, אחר כך the", en: "First mention a, then the", examples: ["I saw **a** movie. **The** movie was great."] },
        { he: "דברים יחידים מסוגם: the sun, the sea", en: "Unique things: the sun, the sea", examples: ["**the** sun", "**the** moon", "**the** world", "**the** sea"], chips: true },
        { he: "באופן כללי – בלי the", en: "Things in general – no article", examples: ["I like **music**.", "**Dogs** are friendly.", "✗ I like the music. (in general)"] },
        { he: "מקצוע עם a", en: "Jobs take a / an", examples: ["My mom is **a** doctor.", "He's **an** actor."] },
      ],
      form: [
        { kind: "affirmative", pattern: "no article + plural / uncountable (in general)", example: "Cats sleep a lot." },
        { kind: "affirmative", pattern: "the + unique / known thing", example: "The sun is hot." },
      ],
      timeWords: ["the sun", "the sea", "in general", "first time"],
    },
    3: {
      points: [
        { he: "בלי the: ארוחות, ספורט, שפות, ימים", en: "No article: meals, sports, languages, days", examples: ["have **breakfast**", "play **football**", "speak **English**", "on **Monday**"], chips: true },
        { he: "go to school (כתלמיד) מול the school (הבניין)", en: "go to school (as a student) vs the school (the building)", examples: ["I go to **school** by bus.", "Mom went to **the school** to see my teacher."] },
        { he: "the + שמות של נהרות, ימים, רבים של מדינות", en: "the + rivers, seas, plural countries", examples: ["**the** Jordan", "**the** Dead Sea", "**the** USA"], chips: true },
        { he: "the + סופרלטיב / מספר סודר", en: "the + superlative / ordinal", examples: ["**the** best", "**the** first time"] },
      ],
      form: [
        { kind: "affirmative", pattern: "no article + meal / sport / language / day", example: "We have lunch at one." },
        { kind: "affirmative", pattern: "the + rivers / seas / the USA", example: "We swam in the Red Sea." },
      ],
      timeWords: ["breakfast", "football", "English", "Monday", "the best"],
    },
  },
  traps: [
    { id: "ar-missing-a", wrong: "My mom is teacher.", right: "My mom is a teacher.", whyHe: "בעברית אין 'a', באנגלית חייבים לפני מקצוע / דבר אחד.", whyEn: "English needs a / an before a singular noun." },
    { id: "ar-a-an", wrong: "I ate a apple.", right: "I ate an apple.", whyHe: "לפני צליל תנועה – an.", whyEn: "Before a vowel sound → an." },
    { id: "ar-general", wrong: "I love the music.", right: "I love music.", whyHe: "באופן כללי – בלי the.", whyEn: "In general → no article." },
    { id: "ar-unique", wrong: "A sun is very hot.", right: "The sun is very hot.", whyHe: "יש רק שמש אחת → the.", whyEn: "Unique → the." },
    { id: "ar-meals", wrong: "We have the dinner at seven.", right: "We have dinner at seven.", whyHe: "ארוחות – בלי the.", whyEn: "Meals → no article." },
  ],
};

const T = "articles";
const S = ["a", "an"];

// ───────────── Grade 7 ─────────────
const g7a = itemSet(T, "ar", 1, 7);
g7a.mcq("I have ___ brother and two sisters.", ["a", "an", "the"], "brother מתחיל בעיצור → a.", "Consonant sound → a.");
g7a.mcq("She ate ___ apple.", ["an", "a", "the"], "apple מתחיל בתנועה → an.", "Vowel sound → an.", { trap: "ar-a-an" });
g7a.mcq("My dad is ___ guide.", ["a", "an", "—"], "מקצוע → a guide.", "Job → a guide.", { trap: "ar-missing-a" });
g7a.mcq("I saw a dog. ___ dog was very big.", ["The", "A", "An"], "בפעם השנייה → the.", "Second mention → the.");
g7a.mcq("___ sun is very hot today.", ["The", "A", "An"], "יש רק שמש אחת → the.", "Unique → the.", { trap: "ar-unique" });
g7a.bank("We live in ___ small village.", ["a", "an", "the"], "village – פעם ראשונה, עיצור → a.", "First mention, consonant → a.");
g7a.bank("It takes ___ hour to get there.", ["an", "a", "the"], "hour נשמע כמו our (תנועה) → an.", "hour has a vowel sound → an.", { trap: "ar-a-an" });
g7a.bank("Please close ___ door.", ["the", "a", "an"], "דלת מסוימת (של החדר) → the.", "A specific door → the.");
g7a.order("My sister is an athlete.", "an לפני athlete (תנועה).", "an before athlete.");
g7a.order("I have a dog and a cat.", "a לפני כל דבר אחד.", "a before each singular noun.");
g7a.sort(S, [["dog", "a"], ["egg", "an"], ["team", "a"], ["hour", "an"], ["river", "a"], ["apple", "an"]], "צליל עיצור → a. צליל תנועה → an.", "Consonant sound → a. Vowel sound → an.", { allow: ["egg", "apple"] });
g7a.match([["She is", "a teacher."], ["He is", "an athlete."], ["Close", "the window."], ["Look at", "the moon!"]], "a / an – אחד, the – מסוים או יחיד מסוגו.", "a / an = one; the = specific / unique.", { allow: ["window", "moon"] });

const g7b = itemSet(T, "ar", 2, 7);
g7b.type("I saw a bridge. ___ bridge was very old.", "a / the", "The", "בפעם השנייה → the.", "Second mention → the.");
g7b.mcq("I like ___ music. (in general)", ["—", "the", "a"], "באופן כללי – בלי the.", "In general → no article.", { trap: "ar-general" });
g7b.type("___ moon is beautiful tonight.", "a / the", "The", "יש רק ירח אחד → the.", "Unique → the.", { allow: ["moon"] });
g7b.type("She wants to be ___ engineer.", "a / an", "an", "engineer מתחיל בתנועה → an.", "Vowel sound → an.", { allow: ["engineer"] });
g7b.mcq("___ dogs are friendly animals. (all dogs)", ["—", "The", "A"], "באופן כללי, רבים – בלי the.", "In general, plural → no article.", { trap: "ar-general", allow: ["animals"] });
g7b.fix("My uncle is *doctor.", ["a doctor"], "מקצוע → a doctor.", "Job → a doctor.", { trap: "ar-missing-a", allow: ["doctor"] });
g7b.fix("I ate *a orange for breakfast.", ["an"], "orange מתחיל בתנועה → an.", "Vowel sound → an.", { trap: "ar-a-an", allow: ["orange"] });
g7b.fix("*A sun is very bright today.", ["The"], "יש רק שמש אחת → the.", "Unique → the.", { trap: "ar-unique", allow: ["bright"] });
g7b.transform("I have a cat.", "Add a second sentence about it: '… cat is black.'", "הוסיפו משפט שני: … cat is black", ["I have a cat. The cat is black.", "I have a cat. The cat's black."], "בפעם השנייה → the.", "Second mention → the.");
g7b.transform("She is a girl from my class.", "Change 'girl' to 'athlete'.", "החליפו את girl ב-athlete", ["She is an athlete from my class."], "athlete מתחיל בתנועה, ולכן an.", "athlete → an.");
g7b.order("The river in our village is very wide.", "the – נהר מסוים.", "the – a specific river.");
g7b.cloze("My village", "I live in {1} small village near {2} mountain. In {3} village there is {4} old bridge. Every morning {5} sun rises behind the mountain.", [["a / the", "a"], ["a / an", "a"], ["a / the", "the"], ["a / an", "an"], ["a / the", "the"]], "פעם ראשונה a, אחר כך the. an לפני old. the sun – יחיד מסוגו.", "a / the / an / the sun.", { allow: ["rises", "behind"] });

// ───────────── Grade 8 ─────────────
const g8a = itemSet(T, "ar", 1, 8);
g8a.mcq("I bought ___ new camera.", ["a", "an", "the"], "new מתחיל בעיצור → a.", "Consonant → a.");
g8a.mcq("He is ___ actor.", ["an", "a", "the"], "actor מתחיל בתנועה → an.", "Vowel → an.", { trap: "ar-a-an" });
g8a.mcq("My aunt is ___ chef.", ["a", "an", "—"], "מקצוע → a chef.", "Job → a chef.", { trap: "ar-missing-a", allow: ["aunt", "chef"] });
g8a.mcq("We went to a café. ___ café was full.", ["The", "A", "An"], "בפעם השנייה → the.", "Second mention → the.");
g8a.mcq("We swam in ___ sea.", ["the", "a", "an"], "the sea – יחיד מסוגו.", "the sea.", { trap: "ar-unique" });
g8a.bank("I'd like ___ coffee, please.", ["a", "an", "the"], "כוס אחת → a coffee.", "One cup → a coffee.");
g8a.bank("The flight takes ___ hour.", ["an", "a", "the"], "hour – צליל תנועה → an.", "hour → an.", { trap: "ar-a-an" });
g8a.bank("Can you pass ___ salt, please?", ["the", "a", "an"], "המלח שעל השולחן → the.", "The specific salt → the.");
g8a.order("My cousin is an engineer.", "an לפני engineer.", "an before engineer.", { allow: ["cousin", "engineer"] });
g8a.order("We stayed at a hotel near the airport.", "a hotel (פעם ראשונה), the airport (מוכר).", "a hotel, the airport.", { allow: ["hotel"] });
g8a.sort(S, [["camera", "a"], ["island", "an"], ["concert", "a"], ["actor", "an"], ["café", "a"], ["airport", "an"]], "צליל עיצור → a. צליל תנועה → an.", "Consonant → a. Vowel → an.");
g8a.match([["She is", "a director."], ["He works as", "an engineer."], ["Turn off", "the lights."], ["We swam in", "the sea."]], "a / an – אחד, the – מסוים או יחיד מסוגו.", "a / an = one; the = specific / unique.", { allow: ["engineer", "turn", "lights"] });

const g8b = itemSet(T, "ar", 2, 8);
g8b.type("I ordered a dish. ___ dish was spicy.", "a / the", "The", "בפעם השנייה → the.", "Second mention → the.", { allow: ["ordered", "spicy"] });
g8b.mcq("I love ___ cooking. (in general)", ["—", "the", "a"], "באופן כללי – בלי the.", "In general → no article.", { trap: "ar-general" });
g8b.type("___ Earth goes around the sun.", "a / the", "The", "יש רק כדור ארץ אחד → the.", "Unique → the.");
g8b.type("She wants to be ___ actor.", "a / an", "an", "actor – תנועה → an.", "Vowel sound → an.");
g8b.mcq("___ concerts are expensive these days. (in general)", ["—", "The", "A"], "באופן כללי, רבים – בלי the.", "In general, plural → no article.", { trap: "ar-general" });
g8b.fix("My brother is *pilot.", ["a pilot"], "מקצוע → a pilot.", "Job → a pilot.", { trap: "ar-missing-a" });
g8b.fix("We waited for *a hour at the airport.", ["an"], "hour – צליל תנועה → an.", "Vowel sound → an.", { trap: "ar-a-an" });
g8b.mcq("We have ___ lunch at one o'clock.", ["—", "the", "a"], "ארוחות – בלי the.", "Meals → no article.", { trap: "ar-meals", allow: ["lunch"] });
g8b.transform("I bought a jacket.", "Add a second sentence: '… jacket is blue.'", "הוסיפו משפט שני: … jacket is blue", ["I bought a jacket. The jacket is blue.", "I bought a jacket. The jacket's blue."], "בפעם השנייה → the.", "Second mention → the.");
g8b.transform("He is a man from the factory.", "Change 'man' to 'engineer'.", "החליפו את man ב-engineer", ["He is an engineer from the factory."], "engineer – תנועה → an.", "engineer → an.", { allow: ["engineer"] });
g8b.order("The concert in the park was amazing.", "the – קונצרט מסוים.", "the – a specific concert.");
g8b.cloze("A trip to the island", "Last summer we visited {1} island. We stayed in {2} old hotel near {3} sea. {4} hotel had a pool, and every evening we watched {5} sun go down.", [["a / an", "an"], ["a / an", "an"], ["a / the", "the"], ["a / the", "The"], ["a / the", "the"]], "an island / an old hotel. the sea, the sun – יחידים מסוגם. בפעם השנייה → The hotel.", "an / an / the / The / the.", { allow: ["hotel", "pool"] });

// ───────────── Grade 9 ─────────────
const g9a = itemSet(T, "ar", 1, 9);
g9a.mcq("I read ___ great novel last week.", ["a", "an", "the"], "great מתחיל בעיצור → a.", "Consonant → a.");
g9a.mcq("She's ___ architect.", ["an", "a", "the"], "architect מתחיל בתנועה → an.", "Vowel → an.", { trap: "ar-a-an" });
g9a.mcq("My neighbor is ___ firefighter.", ["a", "an", "—"], "מקצוע → a firefighter.", "Job → a firefighter.", { trap: "ar-missing-a" });
g9a.mcq("I saw a documentary. ___ documentary was about dolphins.", ["The", "A", "An"], "בפעם השנייה → the.", "Second mention → the.");
g9a.mcq("Dolphins live in ___ sea.", ["the", "a", "an"], "the sea – יחיד מסוגו.", "the sea.", { trap: "ar-unique" });
g9a.bank("I need ___ new charger.", ["a", "an", "the"], "פעם ראשונה, עיצור → a.", "First mention, consonant → a.", { allow: ["charger"] });
g9a.bank("The interview took ___ hour.", ["an", "a", "the"], "hour – צליל תנועה → an.", "hour → an.", { trap: "ar-a-an" });
g9a.bank("Can you switch off ___ oven?", ["the", "a", "an"], "התנור שלנו (מסוים) → the.", "The specific oven → the.");
g9a.order("My aunt is an architect.", "an לפני architect.", "an before architect.", { allow: ["aunt"] });
g9a.order("We visited a gallery near the stadium.", "a gallery (פעם ראשונה), the stadium (מוכר).", "a gallery, the stadium.");
g9a.sort(S, [["novel", "a"], ["oven", "an"], ["stadium", "a"], ["architect", "an"], ["tower", "a"], ["elevator", "an"]], "צליל עיצור → a. צליל תנועה → an.", "Consonant → a. Vowel → an.");
g9a.match([["She is", "a translator."], ["He works as", "an architect."], ["Switch off", "the oven."], ["Look at", "the stars!"]], "a / an – אחד, the – מסוים או יחיד מסוגו.", "a / an = one; the = specific / unique.", { allow: ["translator", "stars"] });

const g9b = itemSet(T, "ar", 2, 9);
g9b.type("I borrowed a novel. ___ novel was very long.", "a / the", "The", "בפעם השנייה → the.", "Second mention → the.");
g9b.mcq("I love ___ documentaries. (in general)", ["—", "the", "a"], "באופן כללי – בלי the.", "In general → no article.", { trap: "ar-general" });
g9b.type("___ moon looks huge tonight.", "a / the", "The", "יש רק ירח אחד → the.", "Unique → the.", { allow: ["moon"] });
g9b.type("He wants to be ___ engineer.", "a / an", "an", "engineer – תנועה → an.", "Vowel sound → an.", { allow: ["engineer"] });
g9b.mcq("___ firefighters are very brave. (in general)", ["—", "The", "A"], "באופן כללי, רבים – בלי the.", "In general, plural → no article.", { trap: "ar-general" });
g9b.fix("My cousin is *architect.", ["an architect"], "מקצוע → an architect.", "Job → an architect.", { trap: "ar-missing-a", allow: ["cousin"] });
g9b.fix("She waited *a hour for the elevator.", ["an"], "hour – צליל תנועה → an.", "Vowel sound → an.", { trap: "ar-a-an" });
g9b.mcq("We have ___ dinner at eight.", ["—", "the", "a"], "ארוחות – בלי the.", "Meals → no article.", { trap: "ar-meals" });
g9b.transform("I bought a ladder.", "Add a second sentence: '… ladder is very tall.'", "הוסיפו משפט שני: … ladder is very tall", ["I bought a ladder. The ladder is very tall.", "I bought a ladder. The ladder's very tall."], "בפעם השנייה → the.", "Second mention → the.", { allow: ["tall"] });
g9b.transform("She is a woman from the gallery.", "Change 'woman' to 'artist'.", "החליפו את woman ב-artist", ["She is an artist from the gallery."], "artist – תנועה → an.", "artist → an.", { allow: ["artist", "woman"] });
g9b.order("The tower in the old city is very famous.", "the – מגדל מסוים.", "the – a specific tower.", { allow: ["famous"] });
g9b.cloze("A day out", "On Saturday we went to {1} exhibition in {2} gallery near {3} sea. {4} exhibition was about {5} oceans of the world.", [["a / an", "an"], ["a / an", "a"], ["a / the", "the"], ["a / the", "The"], ["the / —", "the"]], "שימו לב: an exhibition / a gallery / the sea / The exhibition / the oceans.", "an / a / the / The / the.", { allow: ["oceans"] });

// ───────────── Level 3 (all grades) ─────────────
const l3 = itemSet(T, "ar", 3);
l3.mcq("I go to ___ school by bus.", ["—", "the", "a"], "go to school (כתלמיד) – בלי the.", "go to school → no article.");
l3.mcq("We swam in ___ Dead Sea.", ["the", "—", "a"], "שמות של ימים → the.", "Seas → the.", { allow: ["dead"] });
l3.mcq("She speaks ___ English and French.", ["—", "the", "an"], "שפות – בלי the.", "Languages → no article.", { allow: ["french"] });
l3.type("It was ___ best day of my life.", "a / the", "the", "סופרלטיב → the best.", "Superlative → the.");
l3.mcq("We play ___ football every Sunday.", ["—", "the", "a"], "ספורט – בלי the.", "Sports → no article.");
l3.fix("My grandparents visited *USA last year.", ["the USA"], "the USA (מדינה ברבים).", "the USA.", { allow: ["usa"] });
l3.fix("This is *a first time I've been here.", ["the"], "מספר סודר → the first.", "Ordinal → the.");
l3.transform("I have breakfast at seven.", "Correct if needed (add 'the'?).", "תקנו אם צריך (להוסיף the?)", ["I have breakfast at seven."], "ארוחות – בלי the, המשפט נכון.", "Meals → no article; the sentence is correct.");
l3.transform("Mom went to school to talk to my teacher.", "Correct it (she isn't a student).", "תקנו (היא לא תלמידה)", ["Mom went to the school to talk to my teacher."], "the school – הבניין, לא כתלמיד.", "the school = the building.");
l3.sort(["✓ Correct", "✗ Wrong"], [["She is a doctor.", "✓ Correct"], ["She is doctor.", "✗ Wrong"], ["I love music.", "✓ Correct"], ["We have the lunch at noon.", "✗ Wrong"], ["The sun is hot.", "✓ Correct"], ["I ate a egg.", "✗ Wrong"]], "התיקונים: a doctor · have lunch · an egg.", "Fixes: a doctor · have lunch · an egg.", { allow: ["doctor", "lunch", "egg"] });
l3.cloze("My best trip", "{1} best trip of my life was to {2} Red Sea. We had breakfast on {3} beach every morning, and I learned to dive. I want to become {4} diving instructor!", [["a / the", "The"], ["the / —", "the"], ["a / the", "the"], ["a / an", "a"]], "The best / the Red Sea / breakfast בלי the / the beach / a diving instructor.", "The / the / — / the / a.", { allow: ["red", "beach", "diving", "instructor"] });
l3.write("Describe your family members' jobs and one place you visited. Use a, an, the and no article correctly.", "תארו את העבודות של בני המשפחה ומקום אחד שביקרתם בו. השתמשו נכון ב-a, an, the ובלי תווית.", "My mom is an engineer and my dad is a teacher. Last year we visited the Sea of Galilee. We had lunch near the water and played football on the grass.", "a / an – אחד, the – מסוים, בלי – באופן כללי / ארוחות / ספורט.", "a / an / the / no article.");

export const articlesItems: GrammarItem[] = [
  ...g7a.items, ...g7b.items, ...g8a.items, ...g8b.items, ...g9a.items, ...g9b.items, ...l3.items,
];
