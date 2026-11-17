import type { GrammarItem, GrammarTopic } from "@/types/grammar";
import { itemSet, NEG, QUE } from "@/data/grammar/build";

// Band II: VERB: Present perfect simple (+ questions) – grade 9 only
// (past experiences, duration, recent past, unfinished states).

export const presentPerfectTopic: GrammarTopic = {
  id: "present-perfect",
  group: "tenses",
  title: "Present Perfect",
  titleHe: "הווה מושלם",
  bandRefs: ["VERB: Present perfect simple", "VERB: Present perfect simple - questions"],
  grades: { 9: "emerging" },
  rule: {
    1: {
      points: [
        { he: "have / has + צורה שלישית של הפועל", en: "have / has + past participle", examples: ["I **have visited** Eilat.", "She **has finished** her homework."] },
        { he: "עם he / she / it – has, עם השאר – have", en: "he / she / it → has; others → have", examples: ["He **has eaten**.", "They **have left**."] },
        { he: "ניסיון בחיים: ever / never", en: "Life experience: ever / never", examples: ["**Have** you **ever seen** snow?", "I**'ve never been** abroad."] },
        { he: "שלילה: haven't / hasn't", en: "Negative: haven't / hasn't", examples: ["We **haven't met**.", "It **hasn't started**."] },
      ],
      form: [
        { kind: "affirmative", pattern: "I / you / we / they have ('ve) + V3", example: "We've seen it." },
        { kind: "affirmative", pattern: "he / she / it has ('s) + V3", example: "She's gone home." },
        { kind: "negative", pattern: "haven't / hasn't + V3", example: "He hasn't called." },
        { kind: "question", pattern: "Have / Has + subject + V3?", example: "Have you finished?" },
      ],
      timeWords: ["ever", "never", "just", "already", "yet"],
    },
    2: {
      points: [
        { he: "ניסיון בחיים – לא חשוב מתי", en: "Experiences – when is not important", examples: ["I**'ve been** to London twice.", "**Has** she **ever tried** sushi?"] },
        { he: "for = במשך, since = מאז", en: "for (a period) / since (a starting point)", examples: ["I've lived here **for** five years.", "I've lived here **since** 2020."] },
        { he: "just / already / yet – משהו שקרה זה עתה", en: "just / already / yet – recent past", examples: ["I've **just** eaten.", "Have you finished **yet**?"] },
        { he: "צורה שלישית של פעלים יוצאי דופן", en: "Irregular past participles", examples: ["go → **gone / been**", "see → **seen**", "eat → **eaten**", "write → **written**", "do → **done**", "take → **taken**"], chips: true },
      ],
      form: [
        { kind: "affirmative", pattern: "have / has + V3 + for / since", example: "She has worked here since May." },
        { kind: "negative", pattern: "haven't / hasn't + V3 + yet", example: "I haven't decided yet." },
        { kind: "question", pattern: "How long + have / has + subject + V3?", example: "How long have you known him?" },
        { kind: "short_answer", pattern: "Yes, … have / has. No, … haven't / hasn't.", example: "No, I haven't." },
      ],
      timeWords: ["for", "since", "just", "already", "yet", "ever", "never"],
    },
    3: {
      points: [
        { he: "מצב שהתחיל בעבר ועדיין נמשך", en: "A state that started in the past and continues", examples: ["How long **have** you **known** her?", "We**'ve had** this car for years."] },
        { he: "been (היה וחזר) מול gone (הלך ועדיין שם)", en: "been (went and came back) vs gone (is still there)", examples: ["She**'s been** to Paris.", "She**'s gone** to Paris."] },
        { he: "already בחיוב, yet בשלילה ובשאלה", en: "already in positives, yet in negatives and questions", examples: ["I've **already** paid.", "I haven't paid **yet**."] },
        { he: "לא עם זמן מוגדר בעבר", en: "Not with a finished time", examples: ["I **saw** him yesterday.", "✗ I have seen him yesterday."] },
      ],
      form: [
        { kind: "affirmative", pattern: "have / has + V3 (unfinished state + for / since)", example: "I've known Dan since first grade." },
        { kind: "question", pattern: "Have you ever + V3?", example: "Have you ever broken a bone?" },
      ],
      timeWords: ["so far", "recently", "lately", "how long", "this week"],
    },
  },
  traps: [
    { id: "prf-v2", wrong: "I have saw that movie.", right: "I have seen that movie.", whyHe: "אחרי have / has – צורה שלישית (seen), לא צורת עבר (saw).", whyEn: "After have / has → past participle (seen), not past (saw)." },
    { id: "prf-has", wrong: "She have finished.", right: "She has finished.", whyHe: "עם she / he / it – has.", whyEn: "she / he / it → has." },
    { id: "prf-for-since", wrong: "I've lived here since five years.", right: "I've lived here for five years.", whyHe: "for + משך זמן, since + נקודת התחלה.", whyEn: "for + a period, since + a starting point." },
    { id: "prf-time", wrong: "I have visited Rome last year.", right: "I visited Rome last year.", whyHe: "עם זמן מוגדר בעבר (last year) – עבר פשוט.", whyEn: "With a finished time (last year) → past simple." },
    { id: "prf-present", wrong: "I live here for three years.", right: "I have lived here for three years.", whyHe: "מצב שנמשך עד עכשיו + for → have lived.", whyEn: "A state up to now + for → have lived." },
    { id: "prf-double-neg", wrong: "I haven't never been there.", right: "I have never been there.", whyHe: "never כבר שלילה – לא צריך not.", whyEn: "never is already negative." },
  ],
};

const T = "present-perfect";

// ───────────── Grade 9 ─────────────
const a = itemSet(T, "prf", 1, 9);
a.mcq("I have ___ that documentary.", ["seen", "saw", "see"], "אחרי have – צורה שלישית: seen.", "After have → seen.", { trap: "prf-v2" });
a.mcq("My sister ___ finished her homework.", ["has", "have", "is"], "My sister = she, ולכן has.", "My sister = she → has.", { trap: "prf-has" });
a.mcq("___ you ever been to a wedding abroad?", ["Have", "Has", "Did"], "שאלה על ניסיון: Have you ever been…?", "Experience question: Have you ever…?");
a.mcq("We ___ met our new neighbors yet.", ["haven't", "hasn't", "didn't"], "we + שלילה → haven't.", "we, negative → haven't.");
a.mcq("I've ___ eaten sushi. I want to try it!", ["never", "ever", "yet"], "אף פעם לא → never.", "never = not at any time.", { allow: ["sushi"] });
a.bank("The firefighters have ___ the fire.", ["put out", "putted out", "puts out"], "put – צורה שלישית: put.", "put → put (V3).");
a.bank("She has ___ three novels.", ["written", "wrote", "writes"], "write – צורה שלישית: written.", "write → written.", { trap: "prf-v2" });
a.bank("He ___ lived in this neighborhood for ten years.", ["has", "have", "is"], "עם He משתמשים ב-has: has lived.", "He → has lived.", { trap: "prf-has" });
a.order("I have just updated my apps.", "have + just + צורה שלישית.", "have + just + past participle.");
a.order("Has she ever tried vegetarian food?", "שאלה: Has + she + ever + צורה שלישית?", "Question: Has she ever + V3?");
a.sort(["have", "has"], [["I", "have"], ["my colleague", "has"], ["the neighbors", "have"], ["it", "has"], ["we", "have"], ["everyone", "has"]], "he / she / it (וגם everyone) → has. השאר → have.", "he / she / it (and everyone) → has. Others → have.");
a.match([["see", "seen"], ["write", "written"], ["take", "taken"], ["do", "done"]], "צורה שלישית של פעלים יוצאי דופן.", "Past participles of irregular verbs.", { instr: "התאימו כל פועל לצורה השלישית שלו" });

const b = itemSet(T, "prf", 2, 9);
b.type("I ___ this novel three times.", "read", ["have read", "'ve read"], "ניסיון → have + read (צורה שלישית).", "Experience → have read.");
b.type("My grandparents ___ in this neighborhood since 1990.", "live", ["have lived", "'ve lived"], "מצב שנמשך עד היום + since → have lived.", "Up to now + since → have lived.", { trap: "prf-present" });
b.type("She ___ her selfie yet.", "not / post", ["hasn't posted", "has not posted"], "שלילה + yet → hasn't posted.", "Negative + yet → hasn't posted.");
b.type("Have you ever ___ a marathon?", "run", "run", "אחרי have – צורה שלישית: run (run → ran → run).", "After have → run (V3).");
b.mcq("We have known each other ___ five years.", ["for", "since", "ago"], "משך זמן (five years) → for.", "A period → for.", { trap: "prf-for-since" });
b.fix("I have *went to Eilat many times.", ["been", "gone"], "צורה שלישית: been (היה וחזר).", "Past participle: been.", { trap: "prf-v2" });
b.fix("My colleague *have just left the office.", ["has"], "My colleague = he / she, ולכן has.", "My colleague → has.", { trap: "prf-has" });
b.fix("I've had this phone *since two years.", ["for"], "two years = משך זמן → for.", "A period → for.", { trap: "prf-for-since" });
b.transform("He has repaired the oven.", ...NEG, ["He hasn't repaired the oven.", "He has not repaired the oven.", "He hasn't repaired the oven yet."], "שלילה: has + not = hasn't.", "hasn't repaired.");
b.transform("They have sailed to the island.", ...QUE, "Have they sailed to the island?", "בשאלה Have עובר להתחלה.", "Have goes first.");
b.order("How long have you lived in this neighborhood?", "How long + have + you + צורה שלישית?", "How long + have + you + V3?");
b.cloze("My life so far", "I {1} in Haifa since I was born. I {2} to many countries, but I {3} to Japan yet. My brother {4} three times! He {5} a lot of photos there.", [["live", ["have lived", "'ve lived"]], ["be", ["have been", "'ve been"]], ["not / be", ["haven't been", "have not been"]], ["be", ["has been", "'s been"]], ["take", "has taken"]], "have / has + צורה שלישית. been = היה וחזר.", "have / has + V3. been = went and came back.", { allow: ["born", "countries", "japan"] });

// ───────────── Level 3 (grade 9) ─────────────
const l3 = itemSet(T, "prf", 3);
l3.mcq("\"Where's Dana?\" \"She's ___ to the supermarket. She'll be back soon.\"", ["gone", "been", "went"], "הלכה ועדיין שם → gone.", "She's still there → gone.");
l3.mcq("I ___ him yesterday at the stadium.", ["saw", "have seen", "have saw"], "yesterday = זמן מוגדר בעבר → עבר פשוט: saw.", "yesterday → past simple: saw.", { trap: "prf-time" });
l3.type("How long have you ___ your best friend?", "know", "known", "How long + have + you + known (צורה שלישית).", "How long have you known…?");
l3.type("I've ___ paid for the tickets, so you don't need to.", "already", "already", "already בחיוב – כבר.", "already in a positive sentence.");
l3.fix("I *have visited Rome last summer.", ["visited"], "last summer = זמן מוגדר → עבר פשוט: visited.", "last summer → visited.", { trap: "prf-time", allow: ["rome"] });
l3.fix("I haven't *never been on a plane.", ["ever"], "never כבר שלילה: I have never / I haven't ever.", "I haven't ever been.", { trap: "prf-double-neg" });
l3.fix("We *know each other since first grade.", ["have known", "'ve known"], "מצב שנמשך עד היום + since → have known.", "Up to now + since → have known.", { trap: "prf-present" });
l3.transform("I have finished my project.", "Make it negative and add 'yet'.", "הפכו לשלילה והוסיפו yet", ["I haven't finished my project yet.", "I have not finished my project yet."], "שלילה + yet: haven't … yet.", "haven't … yet.");
l3.transform("She has worked here for six months.", "Ask a question with 'How long'.", "שאלו שאלה עם How long", ["How long has she worked here?"], "שאלה: How long + has + she + worked?", "How long has she worked here?");
l3.sort(["✓ Correct", "✗ Wrong"], [["I've lived here for ten years.", "✓ Correct"], ["She have finished.", "✗ Wrong"], ["Have you ever been to Paris?", "✓ Correct"], ["I have seen him yesterday.", "✗ Wrong"], ["He's gone to the bank.", "✓ Correct"], ["We've known them since five years.", "✗ Wrong"]], "התיקונים: She has finished · I saw him yesterday · for five years.", "Fixes: She has finished · I saw him yesterday · for five years.", { allow: ["paris", "bank"] });
l3.cloze("A great volunteer", "Noa {1} at the animal shelter since 2022. She {2} more than fifty dogs a new home. She {3} a single day this year, and she {4} already {5} a prize for her work.", [["volunteer", ["has volunteered", "'s volunteered"]], ["help", "has helped"], ["not / miss", ["hasn't missed", "has not missed"]], ["have", "has"], ["win", "won"]], "מצב מתמשך וניסיון → has + צורה שלישית. win → won.", "Ongoing and experience → has + V3. win → won.", { allow: ["animal", "shelter", "prize", "fifty", "volunteer"] });
l3.write("Write about three things you have done in your life, one thing you have never done, and how long you have lived in your home.", "כתבו על שלושה דברים שעשיתם בחיים, דבר אחד שמעולם לא עשיתם, וכמה זמן אתם גרים בבית שלכם.", "I have been to Eilat many times. I have met a famous singer and I have won a prize. I have never flown in a plane. I have lived in my home for eight years.", "have / has + צורה שלישית. for / since.", "have / has + V3. for / since.");

export const presentPerfectItems: GrammarItem[] = [...a.items, ...b.items, ...l3.items];
