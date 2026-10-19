import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import {
  StudentTutorProfile,
  TutorLevel,
  VocabBandLevel,
  TutorTaskRecommendation,
  TaskTopicOption,
  TutorMessage,
  TutorTurnInPayload,
  TutorVocabReviewItem,
} from "@/types/tutor";
import { TeacherAssignment } from "@/types/assignment";
import { ActiveUser } from "@/types/auth";
import { MIDDLE_SCHOOL_UNSEENS } from "@/data/unseen-middle-school";
import { ALL_WRITING_TASKS } from "@/data/writing-tasks";
import { BUILT_IN_DICTIONARY } from "@/data/built-in-dictionary";
import {
  loadSavedWords,
  MIDDLE_SCHOOL_EASY,
  MIDDLE_SCHOOL_MEDIUM,
  MIDDLE_SCHOOL_HARD,
} from "@/lib/vocab-storage";
import { SubmissionItem } from "@/types/submission";

export const TUTOR_NAME = "David";
export const TUTOR_TITLE_HE = "דוד - המורה הפרטי שלך לאנגלית";

const PROFILE_STORAGE_KEY_PREFIX = "ett_tutor_profile";
const CHAT_STORAGE_KEY_PREFIX = "ett_tutor_chat";
const TURNIN_STORAGE_KEY_PREFIX = "ett_tutor_pending_turnin";

export interface DiagnosticAnswer {
  questionIndex: number;
  selectedOption: string;
  writingScore?: number;
  vocabScore?: number;
  writingStrengths?: string[];
  writingTips?: string[];
  neededHelp?: boolean;
}

export interface DiagnosticQuestionDef {
  step: number;
  totalSteps: number;
  skill: "vocabulary" | "reading" | "writing" | "goal";
  question: string;
  questionHebrew: string;
  passage?: string;
  isFreeText?: boolean;
  placeholderHebrew?: string;
  options?: { text: string; textHebrew?: string; value: string; isCorrect?: boolean; levelWeight?: TutorLevel }[];
}

export const CONVERSATIONAL_ONBOARDING_TOTAL_TURNS = 4;

export const DIAGNOSTIC_STEPS: DiagnosticQuestionDef[] = [
  {
    step: 1,
    totalSteps: 4,
    skill: "vocabulary",
    isFreeText: true,
    question: "What do you like doing in your free time? Do you enjoy sports, video games, music, animals, or something else?",
    questionHebrew: "",
  },
  {
    step: 2,
    totalSteps: 4,
    skill: "reading",
    isFreeText: true,
    question: "Why did everyone's face turn red when they tasted Leo's cake, and what would you do if that happened at your party?",
    questionHebrew: "",
  },
  {
    step: 3,
    totalSteps: 4,
    skill: "writing",
    isFreeText: true,
    question: "If you could travel anywhere in the world tomorrow — or invent one cool gadget for your school — what would you choose and why?",
    questionHebrew: "",
  },
  {
    step: 4,
    totalSteps: 4,
    skill: "goal",
    isFreeText: true,
    question: "What would you like to practice most with me right now — reading stories, learning new words, or writing in English?",
    questionHebrew: "",
  },
];

/**
 * Generates David's warm initial greeting that starts a natural, non-intimidating conversation
 * with built-in Hebrew scaffolding for struggling / Level 1 learners.
 */
export function getInitialOnboardingGreeting(studentName: string): {
  text: string;
  quickReplies: string[];
} {
  return {
    text: `Hi ${studentName}! 👋 I'm David, your personal English tutor.
Let's chat for a minute so I can get to know you!
(בוא/י נשוחח דקה כדי שאכיר אותך – ואפשר לשאול או לענות גם בעברית! 😊)

**Question 1:**
What do you like doing in your free time?
(מה את/ה אוהב/ת לעשות בזמן הפנוי שלך?)

For example:
• **sports** — ספורט ⚽
• **video games** — משחקי מחשב 🎮
• **music** — מוזיקה 🎵
• **animals** — חיות 🐶

💡 **איך מתחילים?**
אפשר להתחיל ב:
👉 **"I like..."**
(אני אוהב/ת...)`,
    quickReplies: [
      "I like playing video games 🎮",
      "I like playing football with friends ⚽",
      "I love listening to music 🎵",
      "I love animals and dogs 🐶",
      "אני לא מבין, תסביר בעברית 🙏",
    ],
  };
}

export const ONBOARDING_WORD_GLOSSARY: Record<string, string> = {
  "free time": "זמן פנוי",
  "enjoy": "נהנה / אוהב",
  "cousin": "בן דוד",
  "bake": "לאפות",
  "baked": "אפה",
  "chocolate": "שוקולד",
  "cake": "עוגה",
  "birthday": "יום הולדת",
  "yesterday": "אתמול",
  "mom": "אמא",
  "mother": "אמא",
  "accidentally": "בטעות",
  "salt": "מלח",
  "salty": "מלוח",
  "sugar": "סוכר",
  "instead": "במקום",
  "instead of": "במקום",
  "jars": "צנצנות",
  "identical": "זהות (נראות אותו דבר)",
  "bite": "ביס / נגיסה",
  "took a bite": "נתנו ביס / טעמו",
  "tasted": "טעמו",
  "taste": "טעם / לטעום",
  "everyone": "כולם",
  "face": "פנים",
  "faces": "פנים",
  "turn red": "האדימו",
  "turned red": "האדימו",
  "turned bright red": "האדימו מאוד",
  "party": "מסיבה",
  "order": "להזמין",
  "ordered": "הזמינו",
  "ordering": "להזמין",
  "pizza": "פיצה",
  "ice cream": "גלידה",
  "laugh": "לצחוק",
  "imagination": "דמיון",
  "travel": "לטייל / לטוס",
  "anywhere": "לכל מקום",
  "world": "עולם",
  "tomorrow": "מחר",
  "invent": "להמציא",
  "gadget": "גאדג'ט / מכשיר חכם",
  "cool": "מגניב",
  "choose": "לבחור",
  "practice": "לתרגל",
  "improve": "לשפר",
  "rescued": "הציל / חילץ",
  "rescue": "להציל / לחלץ",
  "dog": "כלב",
  "dogs": "כלבים",
  "cat": "חתול",
  "cats": "חתולים",
  "animal": "חיה / בעל חיים",
  "animals": "בעלי חיים / חיות",
  "nature": "טבע",
  "music": "מוזיקה",
  "sports": "ספורט",
  "sport": "ספורט",
  "video games": "משחקי מחשב",
  "boy": "ילד / נער",
  "girl": "ילדה / נערה",
  "cute": "חמוד / חמודה",
  "robot": "רובוט",
  "homework": "שיעורי בית",
  "friends": "חברים",
  "friend": "חבר / חברה",
  "school": "בית ספר",
  "story": "סיפור",
  "stories": "סיפורים",
  "words": "מילים",
  "vocabulary": "אוצר מילים",
  "writing": "כתיבה",
  "reading": "קריאה",
  "boring": "משעמם",
  "easy": "קל",
  "hard": "קשה",
};

/**
 * Rich Hebrew-to-English phrase & vocabulary map for helping students who ask
 * "איך אומרים..." or answer in Hebrew/Heblish.
 */
export const HEBREW_TO_ENGLISH_PHRASE_BANK: Array<{
  hebrewPatterns: string[];
  english: string;
  hebrewLabel: string;
  grammarTip?: string;
  exampleSentence?: string;
}> = [
  {
    hebrewPatterns: ["כלב חמוד", "כלבלב חמוד"],
    english: "a cute dog",
    hebrewLabel: "כלב חמוד",
    grammarTip: "באנגלית שם התואר (cute = חמוד) מגיע לפני שם העצם (dog = כלב)!",
    exampleSentence: "I have a cute dog. (יש לי כלב חמוד.)",
  },
  {
    hebrewPatterns: ["חתול חמוד"],
    english: "a cute cat",
    hebrewLabel: "חתול חמוד",
    grammarTip: "באנגלית אומרים קודם חמוד (cute) ואז חתול (cat).",
    exampleSentence: "She has a cute cat. (יש לה חתול חמוד.)",
  },
  {
    hebrewPatterns: ["לטוס ליפן", "לטייל ביפן", "לנסוע ליפן"],
    english: "travel to Japan / fly to Japan",
    hebrewLabel: "לטוס / לטייל ליפן",
    exampleSentence: "I want to travel to Japan because it is cool! (אני רוצה לטוס ליפן כי זה מגניב!)",
  },
  {
    hebrewPatterns: ["יפן"],
    english: "Japan",
    hebrewLabel: "יפן",
    exampleSentence: "I want to travel to Japan! (אני רוצה לטוס ליפן!)",
  },
  {
    hebrewPatterns: ["לטוס לארצות הברית", "לטוס לארה\"ב", "לטוס לאמריקה", "לנסוע לארה\"ב", "ארצות הברית", "ארה\"ב"],
    english: "the USA / America",
    hebrewLabel: "ארה\"ב (ארצות הברית)",
    exampleSentence: "I want to travel to the USA! (אני רוצה לטוס לארה\"ב!)",
  },
  {
    hebrewPatterns: ["לשחק פיפא", "משחק פיפא", "פיפא", "פיפ\"א"],
    english: "playing FIFA",
    hebrewLabel: "לשחק פיפא",
    exampleSentence: "I like playing FIFA with my friends. (אני אוהב לשחק פיפא עם חברים.)",
  },
  {
    hebrewPatterns: ["עם חברים", "עם החברים", "חברים"],
    english: "with my friends / friends",
    hebrewLabel: "עם חברים",
    exampleSentence: "I play games with my friends. (אני משחק עם חברים שלי.)",
  },
  {
    hebrewPatterns: ["פוטבול", "כדורגל"],
    english: "football / soccer",
    hebrewLabel: "כדורגל / פוטבול",
    exampleSentence: "I like playing football! (אני אוהב לשחק כדורגל!)",
  },
  {
    hebrewPatterns: ["כדורסל"],
    english: "basketball",
    hebrewLabel: "כדורסל",
    exampleSentence: "I like playing basketball. (אני אוהב לשחק כדורסל.)",
  },
  {
    hebrewPatterns: ["ספורט"],
    english: "sports",
    hebrewLabel: "ספורט",
    exampleSentence: "I like playing sports. (אני אוהב לעשות ספורט.)",
  },
  {
    hebrewPatterns: ["משחקי מחשב", "משחקי וידאו", "גיימינג", "סוני", "פלייסטיישן", "פורטנייט", "מיינקראפט", "רובלוקס"],
    english: "video games",
    hebrewLabel: "משחקי מחשב",
    exampleSentence: "I like playing video games. (אני אוהב לשחק במשחקי מחשב.)",
  },
  {
    hebrewPatterns: ["רובוט שמכין שיעורים", "רובוט שעושה שיעורים", "רובוט לשיעורי בית", "רובוט שמכין שיעורי בית"],
    english: "a robot that does homework",
    hebrewLabel: "רובוט שמכין שיעורי בית",
    exampleSentence: "I would invent a robot that does homework! (הייתי ממציא רובוט שמכין שיעורי בית!)",
  },
  {
    hebrewPatterns: ["רובוט"],
    english: "a robot",
    hebrewLabel: "רובוט",
    exampleSentence: "I would invent a cool robot. (הייתי ממציא רובוט מגניב.)",
  },
  {
    hebrewPatterns: ["שיעורי בית", "שיעורים"],
    english: "homework",
    hebrewLabel: "שיעורי בית",
    exampleSentence: "The robot helps me with homework. (הרובוט עוזר לי עם שיעורי הבית.)",
  },
  {
    hebrewPatterns: ["בית ספר", "ביה\"ס"],
    english: "school",
    hebrewLabel: "בית ספר",
    exampleSentence: "I go to school every day. (אני הולך לבית הספר כל יום.)",
  },
  {
    hebrewPatterns: ["מלח במקום סוכר", "שם מלח"],
    english: "put salt instead of sugar",
    hebrewLabel: "שם מלח במקום סוכר",
    exampleSentence: "Because he put salt instead of sugar! (כי הוא שם מלח במקום סוכר!)",
  },
  {
    hebrewPatterns: ["מלח", "מלוח"],
    english: "salt / salty",
    hebrewLabel: "מלח / מלוח",
    exampleSentence: "Because he put salt in the cake! (כי הוא שם מלח בעוגה!)",
  },
  {
    hebrewPatterns: ["סוכר"],
    english: "sugar",
    hebrewLabel: "סוכר",
    exampleSentence: "He forgot to put sugar in the cake. (הוא שכח לשים סוכר בעוגה.)",
  },
  {
    hebrewPatterns: ["עוגה", "עוגת שוקולד"],
    english: "cake / chocolate cake",
    hebrewLabel: "עוגה / עוגת שוקולד",
    exampleSentence: "Leo baked a chocolate cake. (ליאו אפה עוגת שוקולד.)",
  },
  {
    hebrewPatterns: ["מזמין פיצה", "להזמין פיצה", "פיצה"],
    english: "order pizza",
    hebrewLabel: "להזמין פיצה",
    exampleSentence: "I would order pizza! (הייתי מזמין פיצה!)",
  },
  {
    hebrewPatterns: ["גלידה"],
    english: "ice cream",
    hebrewLabel: "גלידה",
    exampleSentence: "I would buy ice cream. (הייתי קונה גלידה.)",
  },
  {
    hebrewPatterns: ["מוזיקה", "לשמוע שירים", "שירים"],
    english: "listening to music",
    hebrewLabel: "לשמוע מוזיקה",
    exampleSentence: "I love listening to music. (אני אוהב לשמוע מוזיקה.)",
  },
  {
    hebrewPatterns: ["כלבים", "כלב"],
    english: "dogs / a dog",
    hebrewLabel: "כלבים / כלב",
    exampleSentence: "I love dogs! (אני אוהב כלבים!)",
  },
  {
    hebrewPatterns: ["חתולים", "חתול"],
    english: "cats / a cat",
    hebrewLabel: "חתולים / חתול",
    exampleSentence: "I love cats! (אני אוהב חתולים!)",
  },
  {
    hebrewPatterns: ["חיות", "בעלי חיים"],
    english: "animals",
    hebrewLabel: "בעלי חיים / חיות",
    exampleSentence: "I love animals! (אני אוהב חיות!)",
  },
  {
    hebrewPatterns: ["לישון"],
    english: "sleeping",
    hebrewLabel: "לישון",
    exampleSentence: "I like sleeping in my free time! (אני אוהב לישון בזמן הפנוי!)",
  },
  {
    hebrewPatterns: ["סרטים", "טלוויזיה", "נטפליקס"],
    english: "watching movies / TV",
    hebrewLabel: "לצפות בסרטים / טלוויזיה",
    exampleSentence: "I like watching movies. (אני אוהב לצפות בסרטים.)",
  },
  {
    hebrewPatterns: ["משעמם"],
    english: "boring",
    hebrewLabel: "משעמם",
    exampleSentence: "This game is not boring, it is fun! (המשחק הזה לא משעמם, הוא כיף!)",
  },
];

/**
 * Looks up English-to-Hebrew or Hebrew-to-English word/phrase translations from a student's query.
 */
export function lookupBilingualQuery(studentReply: string): {
  isTranslationQuestion: boolean;
  type?: "en_to_he" | "he_to_en";
  targetExpression?: string;
  translationHebrew?: string;
  wordBreakdown?: Array<{ word: string; hebrew: string }>;
  formattedAnswerHebrew?: string;
} {
  const trimmed = studentReply.trim();
  const lower = trimmed.toLowerCase();

  // 1. Check if student is asking "איך אומרים..." / "איך כותבים..." / "איך רושמים..." (Hebrew -> English)
  const isHowToSayPattern =
    lower.includes("איך אומרים") ||
    lower.includes("איך כותבים") ||
    lower.includes("איך רושמים") ||
    lower.includes("איך מאייתים") ||
    lower.includes("איך להגיד") ||
    lower.includes("תרגם לאנגלית") ||
    lower.includes("באנגלית זה");

  if (isHowToSayPattern) {
    const matchedPhrases = HEBREW_TO_ENGLISH_PHRASE_BANK.filter((item) =>
      item.hebrewPatterns.some((pat) => lower.includes(pat))
    );

    if (matchedPhrases.length > 0) {
      const primary = matchedPhrases[0];
      const grammarLine = primary.grammarTip ? `\n💡 **טיפ קטן:** ${primary.grammarTip}` : "";
      const exampleLine = primary.exampleSentence ? `\n✍️ **דוגמה במשפט:** *${primary.exampleSentence}*` : "";
      return {
        isTranslationQuestion: true,
        type: "he_to_en",
        targetExpression: primary.hebrewLabel,
        translationHebrew: primary.english,
        formattedAnswerHebrew: `כדי להגיד **"${primary.hebrewLabel}"** באנגלית אומרים: **"${primary.english}"** 🌟${grammarLine}${exampleLine}`,
      };
    }

    const cleanQuery = lower
      .replace(/איך אומרים|איך כותבים|איך רושמים|איך מאייתים|איך להגיד|תרגם לאנגלית|באנגלית זה|באנגלית|[?؟!.,"]/g, "")
      .trim();

    if (cleanQuery.length >= 2) {
      // Check reverse lookup in ONBOARDING_WORD_GLOSSARY
      for (const [eng, heb] of Object.entries(ONBOARDING_WORD_GLOSSARY)) {
        const hebParts = heb.split(/[/,()]/).map((s) => s.trim()).filter(Boolean);
        if (heb === cleanQuery || hebParts.includes(cleanQuery) || heb.includes(cleanQuery)) {
          return {
            isTranslationQuestion: true,
            type: "he_to_en",
            targetExpression: cleanQuery,
            translationHebrew: eng,
            formattedAnswerHebrew: `כדי להגיד **"${cleanQuery}"** באנגלית אומרים: **"${eng}"** 💡`,
          };
        }
      }

      // Check MIDDLE_SCHOOL vocab pools
      const allVocab = [...MIDDLE_SCHOOL_EASY, ...MIDDLE_SCHOOL_MEDIUM, ...MIDDLE_SCHOOL_HARD];
      const foundVocab = allVocab.find(
        (v) => v.hebrew.includes(cleanQuery) || cleanQuery.includes(v.hebrew)
      );
      if (foundVocab) {
        return {
          isTranslationQuestion: true,
          type: "he_to_en",
          targetExpression: cleanQuery,
          translationHebrew: foundVocab.english,
          formattedAnswerHebrew: `כדי להגיד **"${cleanQuery}"** באנגלית אומרים: **"${foundVocab.english}"** 💡${
            foundVocab.example ? `\n✍️ **למשל:** *${foundVocab.example}*` : ""
          }`,
        };
      }

      // Check reverse lookup in BUILT_IN_DICTIONARY
      for (const [eng, heb] of Object.entries(BUILT_IN_DICTIONARY)) {
        const hebParts = heb.split(/[/,()]/).map((s) => s.trim()).filter(Boolean);
        if (heb === cleanQuery || hebParts.includes(cleanQuery)) {
          return {
            isTranslationQuestion: true,
            type: "he_to_en",
            targetExpression: cleanQuery,
            translationHebrew: eng,
            formattedAnswerHebrew: `כדי להגיד **"${cleanQuery}"** באנגלית אומרים: **"${eng}"** 💡`,
          };
        }
      }
    }
  }

  // 2. Check if student is asking what an English word or sentence means ("מה זה...", "מה אומר...", "מה זה אומר...", "מה הפירוש...")
  const isWhatDoesItMeanPattern =
    lower.includes("מה זה") ||
    lower.includes("מה אומר") ||
    lower.includes("מה זאת אומרת") ||
    lower.includes("מה הפירוש") ||
    lower.includes("מה פירוש") ||
    lower.includes("מה המשמעות") ||
    lower.includes("תרגם") ||
    lower.includes("what is ") ||
    lower.includes("what does ");

  // Common irregular past-tense verbs for Level 1 / Band I stories
  const irregularVerbsGlossary: Record<string, string> = {
    went: "הלך / הלכו (עבר של go)",
    saw: "ראה / ראו (עבר של see)",
    bought: "קנה / קנו (עבר של buy)",
    took: "לקח / לקחו (עבר של take)",
    put: "שם / שמו (put)",
    made: "הכין / עשה (עבר של make)",
    ate: "אכל / אכלו (עבר של eat)",
    said: "אמר / אמרו (עבר של say)",
    got: "קיבל / השיג (עבר של get)",
    came: "בא / הגיע (עבר של come)",
    had: "היה לו / לה (עבר של have)",
    did: "עשה (עבר של do)",
    found: "מצא / מצאו (עבר של find)",
    told: "סיפר / אמר (עבר של tell)",
    thought: "חשב (עבר של think)",
    knew: "ידע (עבר של know)",
    ran: "רץ (עבר של run)",
    gave: "נתן (עבר של give)",
  };

  const combinedGlossary: Record<string, string> = {
    ...irregularVerbsGlossary,
    ...ONBOARDING_WORD_GLOSSARY,
  };

  // Direct match in combinedGlossary
  for (const [eng, heb] of Object.entries(combinedGlossary)) {
    if (
      lower === eng ||
      (isWhatDoesItMeanPattern &&
        new RegExp(`\\b${eng.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(lower))
    ) {
      // Check if the student asked about a multi-word English sentence (not just a single glossary word)
      const englishWordsInQuery = (lower.match(/[a-z]+/g) || []).filter(
        (w) => !["what", "is", "does", "mean", "translate", "in", "hebrew", "or"].includes(w)
      );
      if (englishWordsInQuery.length <= 1 || eng.includes(" ")) {
        return {
          isTranslationQuestion: true,
          type: "en_to_he",
          targetExpression: eng,
          translationHebrew: heb,
          formattedAnswerHebrew: `הפירוש של **${eng}** הוא: **${heb}** 💡`,
        };
      }
    }
  }

  // Multi-word or dictionary lookup when English words are present in a "מה זה אומר..." query
  const extractedEngTokens = (
    lower
      .replace(/what does|what is|mean|translate to hebrew/g, "")
      .match(/[a-z]+/g) || []
  ).filter((w) => w.length >= 2 && w !== "or");

  if (isWhatDoesItMeanPattern && extractedEngTokens.length > 0) {
    const allCurated = [...MIDDLE_SCHOOL_EASY, ...MIDDLE_SCHOOL_MEDIUM, ...MIDDLE_SCHOOL_HARD];
    const stopWords: Record<string, string> = {
      the: "ה-",
      a: "",
      an: "",
      to: "ל-",
      in: "ב-",
      on: "על",
      at: "ב-",
      of: "של",
      for: "בשביל / עבור",
      with: "עם",
      and: "ו-",
      but: "אבל",
      because: "כי / מפני ש-",
      he: "הוא",
      she: "היא",
      it: "זה",
      they: "הם",
      we: "אנחנו",
      you: "אתה / את / אתם",
      my: "שלי",
      his: "שלו",
      her: "שלה",
      was: "היה / הייתה",
      were: "היו",
    };

    const breakdown: Array<{ word: string; hebrew: string }> = [];
    for (const token of extractedEngTokens) {
      const candidates = [
        token,
        token.replace(/ed$/, ""),
        token.replace(/ed$/, "e"),
        token.replace(/ing$/, ""),
        token.replace(/s$/, ""),
      ];

      let matchedHeb: string | undefined;
      for (const cand of candidates) {
        if (combinedGlossary[cand]) {
          matchedHeb = combinedGlossary[cand];
          break;
        }
        const curated = allCurated.find((item) => item.english.toLowerCase() === cand);
        if (curated) {
          matchedHeb = curated.hebrew;
          break;
        }
        if (BUILT_IN_DICTIONARY[cand]) {
          matchedHeb = BUILT_IN_DICTIONARY[cand];
          break;
        }
      }

      if (matchedHeb) {
        breakdown.push({ word: token, hebrew: matchedHeb });
      } else if (stopWords[token] && stopWords[token].length > 0) {
        breakdown.push({ word: token, hebrew: stopWords[token] });
      }
    }

    if (breakdown.length > 0) {
      const englishPhrase = extractedEngTokens.join(" ");
      // Special natural sentence synthesis for common SVO structures
      let sentenceSummary = "";
      if (lower.includes("dog") && lower.includes("rescued") && lower.includes("boy")) {
        sentenceSummary = `משמעות המשפט כולו היא: **"הכלב הציל (חילץ) את הילד"** 🐕👦\n\n`;
      } else if (breakdown.length === 1) {
        return {
          isTranslationQuestion: true,
          type: "en_to_he",
          targetExpression: breakdown[0].word,
          translationHebrew: breakdown[0].hebrew,
          wordBreakdown: breakdown,
          formattedAnswerHebrew: `הפירוש של **${breakdown[0].word}** הוא: **${breakdown[0].hebrew}** 💡`,
        };
      }

      const bullets = breakdown
        .map((b) => `• **${b.word}** = ${b.hebrew}`)
        .join("\n");

      return {
        isTranslationQuestion: true,
        type: "en_to_he",
        targetExpression: englishPhrase,
        wordBreakdown: breakdown,
        formattedAnswerHebrew: `בוא נפרק יחד את המשפט **"${englishPhrase}"** לעברית פשוטה 💡:\n${sentenceSummary}**מילה במילה:**\n${bullets}`,
      };
    }
  }

  return { isTranslationQuestion: false };
}

/**
 * Synthesizes a personalized English sentence starter and vocabulary breakdown
 * based on what the student actually wrote in Hebrew during onboarding!
 */
function buildTailoredHebrewToEnglishScaffold(
  turnIndex: number,
  studentReply: string,
  studentName: string
): {
  acknowledgmentHebrew: string;
  tailoredEnglishSentence: string;
  vocabBreakdownHebrew: string[];
  quickReplies: string[];
} {
  const lower = studentReply.toLowerCase();

  if (turnIndex === 0) {
    const hasFifa = lower.includes("פיפא") || lower.includes("פיפ\"א") || lower.includes("fifa");
    const hasFootball = lower.includes("כדורגל") || lower.includes("פוטבול");
    const hasBasketball = lower.includes("כדורסל");
    const hasGames =
      lower.includes("משחק") ||
      lower.includes("מחשב") ||
      lower.includes("סוני") ||
      lower.includes("פורטנייט") ||
      lower.includes("רובלוקס") ||
      lower.includes("מיינקראפט") ||
      lower.includes("גיימינג");
    const hasFriends = lower.includes("חברים") || lower.includes("חבר");
    const hasMusic = lower.includes("מוזיקה") || lower.includes("שירים") || lower.includes("לשיר");
    const hasAnimals = lower.includes("כלב") || lower.includes("חתול") || lower.includes("חיות") || lower.includes("בעלי חיים");
    const hasSleep = lower.includes("לישון") || lower.includes("שינה");
    const hasMovies = lower.includes("סרט") || lower.includes("טלוויזיה") || lower.includes("נטפליקס") || lower.includes("טיקטוק");

    if (hasFifa) {
      const sentence = hasFriends
        ? "I like playing FIFA with my friends"
        : "I like playing FIFA";
      return {
        acknowledgmentHebrew: `איזה כיף, ${studentName}! לשחק פיפא${hasFriends ? " עם חברים" : ""} זה תחביב אדיר! 🎮⚽`,
        tailoredEnglishSentence: sentence,
        vocabBreakdownHebrew: [
          "**I like...** = אני אוהב/ת...",
          "**playing FIFA** = לשחק פיפא",
          ...(hasFriends ? ["**with my friends** = עם חברים שלי"] : []),
        ],
        quickReplies: [
          sentence,
          "I like playing video games and football",
          "I like playing with my friends",
        ],
      };
    }

    if (hasFootball || hasBasketball) {
      const sportEng = hasBasketball ? "basketball" : "football";
      const sportHeb = hasBasketball ? "כדורסל" : "כדורגל";
      const sentence = hasFriends
        ? `I like playing ${sportEng} with my friends`
        : `I like playing ${sportEng}`;
      return {
        acknowledgmentHebrew: `מעולה, ${studentName}! לשחק ${sportHeb}${hasFriends ? " עם חברים" : ""} זה ספורט נהדר! ⚽🏀`,
        tailoredEnglishSentence: sentence,
        vocabBreakdownHebrew: [
          "**I like playing...** = אני אוהב/ת לשחק...",
          `**${sportEng}** = ${sportHeb}`,
          ...(hasFriends ? ["**with my friends** = עם חברים שלי"] : []),
        ],
        quickReplies: [
          sentence,
          "I like playing sports",
          "I like playing video games",
        ],
      };
    }

    if (hasGames) {
      const sentence = hasFriends
        ? "I like playing video games with my friends"
        : "I like playing video games";
      return {
        acknowledgmentHebrew: `מגניב לגמרי, ${studentName}! משחקי מחשב${hasFriends ? " עם חברים" : ""} זו דרך מעולה להעביר את הזמן הפנוי! 🎮`,
        tailoredEnglishSentence: sentence,
        vocabBreakdownHebrew: [
          "**I like playing...** = אני אוהב/ת לשחק...",
          "**video games** = משחקי מחשב",
          ...(hasFriends ? ["**with my friends** = עם חברים שלי"] : []),
        ],
        quickReplies: [
          sentence,
          "I love gaming and sports",
          "I like hanging out with friends",
        ],
      };
    }

    if (hasMusic) {
      return {
        acknowledgmentHebrew: `איזה יופי, ${studentName}! מוזיקה תמיד עושה מצב רוח טוב! 🎵`,
        tailoredEnglishSentence: "I love listening to music",
        vocabBreakdownHebrew: [
          "**I love...** = אני אוהב/ת מאוד...",
          "**listening to music** = להקשיב למוזיקה",
        ],
        quickReplies: [
          "I love listening to music",
          "I like music and hanging out with friends",
          "I like singing and dancing",
        ],
      };
    }

    if (hasAnimals) {
      const isDog = lower.includes("כלב");
      const sentence = isDog ? "I love dogs and animals" : "I love animals and nature";
      return {
        acknowledgmentHebrew: `איזה כיף, ${studentName}! בעלי חיים הם החברים הכי טובים! 🐶🐾`,
        tailoredEnglishSentence: sentence,
        vocabBreakdownHebrew: [
          "**I love...** = אני אוהב/ת...",
          isDog ? "**dogs** = כלבים" : "**animals** = בעלי חיים",
        ],
        quickReplies: [
          sentence,
          "I have a cute dog",
          "I really enjoy animals",
        ],
      };
    }

    if (hasSleep || hasMovies) {
      const sentence = hasSleep
        ? "I like sleeping and relaxing"
        : "I like watching movies and TV";
      return {
        acknowledgmentHebrew: `אחלה דרך לנוח בזמן הפנוי, ${studentName}! 😄`,
        tailoredEnglishSentence: sentence,
        vocabBreakdownHebrew: [
          "**I like...** = אני אוהב/ת...",
          hasSleep ? "**sleeping** = לישון" : "**watching movies** = לצפות בסרטים",
        ],
        quickReplies: [
          sentence,
          "I like hanging out with friends",
          "I like playing video games",
        ],
      };
    }

    return {
      acknowledgmentHebrew: `איזה יופי, ${studentName}! נשמע תחביב מעולה 😊`,
      tailoredEnglishSentence: "I like hanging out with my friends",
      vocabBreakdownHebrew: [
        "**I like...** = אני אוהב/ת...",
        "**playing video games** = לשחק במשחקי מחשב",
        "**playing football** = לשחק כדורגל",
        "**with my friends** = עם חברים",
      ],
      quickReplies: [
        "I like playing video games with my friends",
        "I like playing football",
        "I love listening to music",
      ],
    };
  }

  if (turnIndex === 1) {
    const mentionsSalt = lower.includes("מלח") || lower.includes("מלוח");
    const mentionsSugar = lower.includes("סוכר");
    const mentionsPizza = lower.includes("פיצה");
    const mentionsIceCream = lower.includes("גלידה");

    const sentence = mentionsPizza
      ? "Because he put salt instead of sugar, and I would order pizza!"
      : mentionsIceCream
      ? "Because he put salt in the cake, and I would buy ice cream!"
      : "Because he put salt instead of sugar in the cake!";

    return {
      acknowledgmentHebrew: `כל הכבוד ${studentName}, הבנת בול את הסיפור! 🎯👏${
        mentionsSalt ? " ליאו באמת התבלבל ושם מלח במקום סוכר" : ""
      }${mentionsPizza ? " ולהזמין פיצה זה לגמרי הפתרון הכי טעים!" : "!"}`,
      tailoredEnglishSentence: sentence,
      vocabBreakdownHebrew: [
        "**Because** = כי / בגלל ש...",
        "**he put salt** = הוא שם מלח",
        ...(mentionsSugar ? ["**instead of sugar** = במקום סוכר"] : ["**in the cake** = בעוגה"]),
        ...(mentionsPizza ? ["**I would order pizza** = הייתי מזמין/ה פיצה 🍕"] : []),
        ...(mentionsIceCream ? ["**I would buy ice cream** = הייתי קונה גלידה 🍦"] : []),
      ],
      quickReplies: [
        sentence,
        "Because the cake had salt! I would order pizza.",
        "Because it was salty, so I would laugh!",
      ],
    };
  }

  // Turn 2 (Travel or Gadget Invention)
  const hasRobot = lower.includes("רובוט");
  const hasHomework = lower.includes("שיעור") || lower.includes("בית ספר") || lower.includes("מבחן");
  const hasJapan = lower.includes("יפן");
  const hasUsa = lower.includes("ארצות הברית") || lower.includes("ארה\"ב") || lower.includes("אמריקה") || lower.includes("ניו יורק");
  const hasTravel = lower.includes("לטוס") || lower.includes("לטייל") || lower.includes("לנסוע") || hasJapan || hasUsa;

  if (hasRobot || hasHomework) {
    const sentence = "I would invent a robot that does homework!";
    return {
      acknowledgmentHebrew: `וואו ${studentName}, הלוואי שהיה לי רובוט שמכין שיעורי בית כשהייתי תלמיד! 🤖📚 רעיון גאוני!`,
      tailoredEnglishSentence: sentence,
      vocabBreakdownHebrew: [
        "**I would invent...** = הייתי ממציא/ה...",
        "**a robot** = רובוט",
        "**that does homework** = שמכין שיעורי בית",
      ],
      quickReplies: [
        sentence,
        "I would invent a robot for school because homework is hard.",
        "I would invent a smart gadget that helps students.",
      ],
    };
  }

  if (hasTravel) {
    const destEng = hasJapan ? "Japan" : hasUsa ? "the USA" : "a cool country";
    const destHeb = hasJapan ? "ליפן" : hasUsa ? "לארה\"ב" : "למקום מגניב";
    const sentence = `I want to travel to ${destEng} because it is amazing!`;
    return {
      acknowledgmentHebrew: `איזה חלום, ${studentName}! לטוס ${destHeb} נשמע חוויה מדהימה! ✈️🌍`,
      tailoredEnglishSentence: sentence,
      vocabBreakdownHebrew: [
        "**I want to travel to...** = אני רוצה לטוס ל...",
        `**${destEng}** = ${destHeb.replace(/^ל/, "")}`,
        "**because it is amazing** = כי זה מדהים",
      ],
      quickReplies: [
        sentence,
        "I want to travel to Japan because it is cool.",
        "I want to visit the USA with my family.",
      ],
    };
  }

  return {
    acknowledgmentHebrew: `רעיון נהדר, ${studentName}! 🌟`,
    tailoredEnglishSentence: "I would invent a robot that helps students at school!",
    vocabBreakdownHebrew: [
      "**I would invent a...** = הייתי ממציא/ה...",
      "**I want to travel to...** = אני רוצה לטוס ל...",
      "**because it is cool** = כי זה מגניב",
    ],
    quickReplies: [
      "I would invent a robot that does homework!",
      "I want to travel to Japan because it is cool!",
      "I want to travel to the USA because it is fun!",
    ],
  };
}

/**
 * Checks if the student is saying they don't understand, asking for translation/help,
 * mixing Hebrew into English (Heblish), or replying in Hebrew during onboarding.
 */
export function checkOnboardingHelpOrHebrew(
  turnIndex: number,
  studentReply: string
): {
  isConfusionOrHelpRequest: boolean;
  isHebrewContentAnswer: boolean;
  isHeblishAnswer: boolean;
  heblishCoachingLine?: string;
  requestedWordTranslation?: { word: string; hebrew: string; formatted?: string };
} {
  const trimmed = studentReply.trim();
  const lower = trimmed.toLowerCase();

  // 1. Check bilingual lookup (catches "מה זה...", "מה אומר...", "איך אומרים...", etc.)
  const lookup = lookupBilingualQuery(studentReply);
  let requestedWordTranslation: { word: string; hebrew: string; formatted?: string } | undefined;
  if (lookup.isTranslationQuestion && lookup.targetExpression) {
    requestedWordTranslation = {
      word: lookup.targetExpression,
      hebrew: lookup.translationHebrew || "",
      formatted: lookup.formattedAnswerHebrew,
    };
  }

  const confusionPatterns = [
    "לא מבין",
    "לא מבינה",
    "לא הבנתי",
    "לא קולט",
    "הסתבכתי",
    "מה רוצים ממני",
    "אין לי מושג",
    "אין לי כוח",
    "לא יודע",
    "לא יודעת",
    "מה?",
    "אה?",
    "הא?",
    "מה זה",
    "מה אומר",
    "מה זאת אומרת",
    "מה שאלת",
    "מה כתבת",
    "מה אמרת",
    "מה הפירוש",
    "מה פירוש",
    "מה לבחור",
    "תסביר",
    "בעברית",
    "תרגם",
    "תרגום",
    "קשה לי",
    "עזרה",
    "איך אומרים",
    "איך כותבים",
    "איך רושמים",
    "איך מאייתים",
    "i don't understand",
    "i dont understand",
    "dont understand",
    "don't understand",
    "i don't get it",
    "what?",
    "wat",
    "huh",
    "idk",
    "what do you mean",
    "what does that mean",
    "translate",
    "in hebrew",
    "explain in hebrew",
    "i don't know",
    "i dont know",
    "too hard",
    "help",
  ];

  const isExplicitConfusion =
    trimmed === "?" ||
    trimmed === "??" ||
    Boolean(requestedWordTranslation) ||
    confusionPatterns.some((pat) => lower.includes(pat));

  // Count Hebrew vs English letters
  const hebrewChars = (trimmed.match(/[\u0590-\u05FF]/g) || []).length;
  const englishChars = (trimmed.match(/[a-zA-Z]/g) || []).length;

  // Pure Hebrew content answer on turns 0, 1, 2
  const isHebrewContentAnswer =
    !isExplicitConfusion &&
    turnIndex < 3 &&
    hebrewChars >= 2 &&
    englishChars < 3;

  // Heblish detection: Student mixed English and Hebrew words (e.g., "i like play פוטבול")
  const isHeblishAnswer =
    !isExplicitConfusion &&
    turnIndex < 3 &&
    hebrewChars >= 2 &&
    englishChars >= 3;

  let heblishCoachingLine: string | undefined;
  if (isHeblishAnswer) {
    const matchedHebPhrase = HEBREW_TO_ENGLISH_PHRASE_BANK.find((item) =>
      item.hebrewPatterns.some((pat) => lower.includes(pat))
    );
    const ingTip =
      lower.includes("i like play") && !lower.includes("playing")
        ? `\n💡 *טיפ דקדוק קטן:* אחרי **I like** מוסיפים **ing** לפועל (**I like playing...**)!`
        : "";
    if (matchedHebPhrase) {
      heblishCoachingLine = `👏 **איזה יופי ששילבת אנגלית!** אגב, המילה **"${matchedHebPhrase.hebrewLabel}"** באנגלית היא **"${matchedHebPhrase.english}"** – אז במשפט שלם באנגלית אומרים: *"${matchedHebPhrase.exampleSentence?.split("(")[0].trim() || `I like ${matchedHebPhrase.english}!`}"* 🌟${ingTip}`;
    } else {
      heblishCoachingLine = `👏 **כל הכבוד על הניסיון לשלב אנגלית!**${ingTip}`;
    }
  }

  return {
    isConfusionOrHelpRequest: isExplicitConfusion,
    isHebrewContentAnswer,
    isHeblishAnswer,
    heblishCoachingLine,
    requestedWordTranslation,
  };
}

/**
 * Generates David's natural response for each turn of the 4-turn onboarding conversation.
 * If the student doesn't understand or asks for help in Hebrew, David stays on the current turn
 * (`advanceTurn: false`), explains warmly in Hebrew + simple English, and lets them try again.
 */
export function generateOnboardingTurnResponse(
  completedTurnIndex: number,
  studentReply: string,
  studentName: string
): {
  text: string;
  quickReplies?: string[];
  advanceTurn: boolean;
  neededHelp?: boolean;
} {
  const lower = studentReply.toLowerCase();
  const {
    isConfusionOrHelpRequest,
    isHebrewContentAnswer,
    isHeblishAnswer,
    heblishCoachingLine,
    requestedWordTranslation,
  } = checkOnboardingHelpOrHebrew(completedTurnIndex, studentReply);

  const wordPrefix = requestedWordTranslation
    ? `${
        requestedWordTranslation.formatted ||
        `הפירוש של **${requestedWordTranslation.word}** הוא: **${requestedWordTranslation.hebrew}** 💡`
      }\n\n`
    : "";

  // 1. Handle when the student says "אני לא מבין" / asks for Hebrew / asks what a word means / "איך אומרים..."
  if (isConfusionOrHelpRequest) {
    if (completedTurnIndex === 0) {
      return {
        advanceTurn: false,
        neededHelp: true,
        text: `${wordPrefix}אין שום בעיה, ${studentName}! אני כאן איתך צעד-אחר-צעד 😊\n\nשאלתי באנגלית:\n**"What do you like doing in your free time?"**\n(מה את/ה אוהב/ת לעשות בזמן הפנוי שלך?)\n\nאוצר מילים שיעזור לך להרכיב תשובה:\n• **I like...** = אני אוהב/ת...\n• **playing video games** = לשחק במשחקי מחשב 🎮\n• **playing football** = לשחק כדורגל ⚽\n• **listening to music** = לשמוע מוזיקה 🎵\n• **dogs / animals** = כלבים / בעלי חיים 🐶\n\nנסה/י לכתוב משפט קצר באנגלית (או אפילו בעברית ואעזור לך לתרגם!), או לחצ/י על אחת התשובות למטה:`,
        quickReplies: [
          "I like playing video games 🎮",
          "I like playing football ⚽",
          "I love listening to music 🎵",
          "I love dogs and animals 🐶",
        ],
      };
    }

    if (completedTurnIndex === 1) {
      return {
        advanceTurn: false,
        neededHelp: true,
        text: `${wordPrefix}אין שום בעיה, ${studentName}, בוא נפרק את הסיפור הקצר בעברית פשוטה! 😊\n\n📖 **מה קרה בסיפור?**\nבן דוד שלי ליאו אפה עוגת שוקולד, אבל בטעות הוא שם מלח במקום סוכר!\nכשכולם טעמו מהעוגה הפנים שלהם האדימו, ולכן הם הזמינו פיצה 🍕.\n\n🔑 **מילים חשובות מהסיפור:**\n• **accidentally** = בטעות\n• **salt instead of sugar** = מלח במקום סוכר\n• **tasted** = טעמו\n• **ordered pizza** = הזמינו פיצה\n\n❓ **השאלה שלי:**\nלמה הפנים שלהם האדימו, ומה היית עושה במקומם?\n\nאפשר להיעזר בתבנית קצרה באנגלית:\n👉 **"Because he put salt!"**\n(כי הוא שם מלח!)\n👉 **"I would order pizza."**\n(הייתי מזמין/ה פיצה.)\n\nנסה/י לכתוב באנגלית או לבחור למטה:`,
        quickReplies: [
          "Because he put salt instead of sugar!",
          "Because the cake had salt! I would order pizza.",
          "I would laugh and buy ice cream!",
        ],
      };
    }

    if (completedTurnIndex === 2) {
      return {
        advanceTurn: false,
        neededHelp: true,
        text: `${wordPrefix}בשמחה, ${studentName}! בוא נפרק את השאלה בעברית פשוטה: 😊\n\n❓ **מה שאלתי?**\nאם היית יכול/ה לטוס מחר לכל מקום בעולם, או להמציא גאדג'ט/רובוט מגניב לבית הספר – מה היית בוחר/ת ולמה?\n\n🔑 **מילות מפתח:**\n• **travel anywhere** = לטוס לכל מקום בעולם ✈️\n• **invent a cool gadget** = להמציא מכשיר או רובוט מגניב 🤖\n\nאפשר להעתיק ולהשלים אחת מההתחלות האלו באנגלית:\n👉 **"I want to travel to... because it is cool!"**\n(אני רוצה לטוס ל... כי זה מגניב!)\n👉 **"I would invent a robot that..."**\n(הייתי ממציא/ה רובוט ש...)\n\nאו לחצ/י על אחת התשובות המוכנות למטה:`,
        quickReplies: [
          "I want to travel to Japan because it is cool!",
          "I would invent a robot that does homework!",
          "I want to travel to the USA because it is fun!",
        ],
      };
    }

    // Turn 3 confusion (e.g., "אני לא יודע אנגלית טוב, מה לבחור?")
    return {
      advanceTurn: false,
      neededHelp: true,
      text: `${wordPrefix}אל תדאג/י בכלל, ${studentName}! אם האנגלית מרגישה לך קצת קשה כרגע, הגעת בדיוק למקום הנכון – אנחנו נתקדם יחד לאט, צעד אחר צעד, עם הסברים בעברית! 💙💪\n\nשאלתי במה הכי בא לך שנתחיל עכשיו (הכול מותאם לרמת מתחילים **Level 1**):\n• 📚 **Learning new words** — אוצר מילים בסיסי (מומלץ מאוד להתחלה קלה ומהירה!)\n• 📖 **Reading short stories** — סיפורים קצרים עם תרגום לכל מילה\n• ✍️ **Writing simple sentences** — אימון כתיבה מודרך עם משפטים מוכנים\n\nפשוט לחצ/י על מה שמרגיש לך הכי נוח (אפשר גם בעברית!):`,
      quickReplies: [
        "מילים חדשות (Learning new words) 📚",
        "סיפורים קצרים (Reading stories) 📖",
        "כתיבה פשוטה (Writing) ✍️",
        "תבחר לי אתה משהו קל! 🎲",
      ],
    };
  }

  // 2. Handle when the student understood and answered the question, but wrote their answer in Hebrew on Turns 0-2
  if (isHebrewContentAnswer) {
    const tailored = buildTailoredHebrewToEnglishScaffold(
      completedTurnIndex,
      studentReply,
      studentName
    );
    const vocabBullets = tailored.vocabBreakdownHebrew.map((b) => `• ${b}`).join("\n");

    return {
      advanceTurn: false,
      neededHelp: true,
      text: `${tailored.acknowledgmentHebrew}\n\nעכשיו בוא/י נגיד את **התשובה שלך** במשפט קצר באנגלית! הנה המילים המדויקות למה שכתבת:\n${vocabBullets}\n\n✨ **המשפט שלך באנגלית:**\n👉 **"${tailored.tailoredEnglishSentence}"**\n\nנסה/י להקליד אותו באנגלית או פשוט לחצ/י עליו למטה כדי להמשיך:`,
      quickReplies: tailored.quickReplies,
    };
  }

  // 3. Normal English (or Heblish / Broken English) progression: Advance to the next turn with warm modeling!
  if (completedTurnIndex === 0) {
    let hobbyReaction = `Awesome, ${studentName}! 🎉\n(מעולה!)`;
    if (isHeblishAnswer && heblishCoachingLine) {
      hobbyReaction = heblishCoachingLine;
    } else if (lower === "i love dog" || lower === "i like dog") {
      hobbyReaction = `Dogs are the best, ${studentName}! 🐶\n(אגב, באנגלית אומרים: "I love dogs!" – כל הכבוד על התשובה!)`;
    } else if (lower.includes("play") && !lower.includes("playing") && (lower.includes("i like play") || lower.includes("i love play"))) {
      hobbyReaction = `Great answer, ${studentName}! 🎮⚽\n(טיפ קטן: אחרי I like מוסיפים ing, למשל: "I like playing..." – אלוף!)`;
    } else if (lower.includes("game") || lower.includes("gaming") || lower.includes("fifa") || lower.includes("play")) {
      hobbyReaction = `Nice! Gaming and sports are awesome ways to have fun, ${studentName}! 🎮⚽\n(איזה כיף!)`;
    } else if (lower.includes("music") || lower.includes("song") || lower.includes("sing") || lower.includes("dance")) {
      hobbyReaction = `I love music too, ${studentName}! 🎵\n(גם אני ממש אוהב מוזיקה!)`;
    } else if (lower.includes("animal") || lower.includes("dog") || lower.includes("cat") || lower.includes("nature")) {
      hobbyReaction = `Animals and nature are amazing, ${studentName}! 🐶🌿\n(בעלי חיים זה מדהים!)`;
    } else if (lower.includes("sport") || lower.includes("football") || lower.includes("soccer") || lower.includes("basketball")) {
      hobbyReaction = `Sports are fantastic for having fun, ${studentName}! ⚽🏀\n(ספורט זה מעולה!)`;
    }

    return {
      advanceTurn: true,
      text: `${hobbyReaction}\n\n📖 **Short Story:**\nYesterday, my cousin Leo baked a chocolate cake 🎂.\nHe accidentally put salt instead of sugar!\nWhen everyone tasted the cake, their faces turned red 🥵, so they ordered pizza 🍕!\n\n🔑 **מילים שיעזרו לך:**\n• **accidentally** = בטעות\n• **salt instead of sugar** = מלח במקום סוכר\n• **tasted** = טעמו\n• **turned red** = האדימו\n• **ordered pizza** = הזמינו פיצה\n\n**Question 2:**\nWhy did everyone's face turn red, and what would you do?\n(למה הפנים שלהם האדימו, ומה היית עושה במקומם?)\n\n💡 **איך מתחילים את התשובה?**\nאפשר להתחיל ב:\n• **"Because he put..."** (כי הוא שם...)\n• **"I would..."** (הייתי...)`,
      quickReplies: [
        "Because he put salt instead of sugar! I would order pizza.",
        "Because the cake was salty! I would buy ice cream.",
        "אני לא מבין, תסביר בעברית 🙏",
      ],
    };
  }

  // After Turn 1 (Student explained the salty cake story) -> Move to Turn 2
  if (completedTurnIndex === 1) {
    const mentionedSaltOrSugar =
      lower.includes("salt") ||
      lower.includes("sugar") ||
      lower.includes("salty") ||
      lower.includes("mistake") ||
      lower.includes("taste") ||
      lower.includes("bad");

    let storyReaction = mentionedSaltOrSugar
      ? `Spot on, ${studentName}! 🍕👏\n(בול! עוגת שוקולד מלוחה זו לגמרי הפתעה מצחיקה!)`
      : `Haha, totally! At least pizza saved the party! 🍕\n(לפחות הפיצה הצילה את המסיבה!)`;

    if (isHeblishAnswer && heblishCoachingLine) {
      storyReaction = `${heblishCoachingLine}\n${storyReaction}`;
    } else if (
      lower.includes("becoz") ||
      lower === "because salt" ||
      lower === "because salt in cake"
    ) {
      storyReaction = `Spot on, ${studentName}! 🎯 You understood the story!\n(הבנת מצוין! משפט מלא באנגלית: "Because he put salt in the cake!" 👏)`;
    }

    return {
      advanceTurn: true,
      text: `${storyReaction}\n\n**Question 3:**\nIf you could travel anywhere ✈️ or invent a cool gadget 🤖 for your school — what would you choose and why?\n(אם היית יכול/ה לטוס לכל מקום בעולם, או להמציא מכשיר מגניב לבית הספר – מה היית בוחר/ת ולמה?)\n\n💡 **איך כותבים את התשובה בקלות?**\nנסה/י להשלים אחד מהמשפטים:\n👉 **"I want to travel to... because..."**\n(אני רוצה לטוס ל... כי...)\n👉 **"I would invent a... because..."**\n(הייתי ממציא/ה... כי...)`,
      quickReplies: [
        "I would invent a robot that does homework!",
        "I want to travel to Japan because it is cool!",
        "אני לא מבין את השאלה, תסביר בעברית 🙏",
      ],
    };
  }

  // After Turn 2 (Student wrote about travel or an invention) -> Move to Turn 3 (Preferred focus)
  if (completedTurnIndex === 2) {
    let ideaReaction = `I really loved your idea, ${studentName}! 🌟\n(אהבתי מאוד את הרעיון שלך!)`;
    if (isHeblishAnswer && heblishCoachingLine) {
      ideaReaction = `${heblishCoachingLine}\n${ideaReaction}`;
    } else if (lower.includes("robot") && lower.includes("homework")) {
      ideaReaction = `Awesome invention, ${studentName}! 🤖📚\nA homework robot would be a bestseller!\n(המצאה אדירה! משפט מלא: "I would invent a robot that does homework!")`;
    } else if (lower.includes("japan") || lower.includes("usa") || lower.includes("travel")) {
      ideaReaction = `Great choice, ${studentName}! ✈️🌍\nTraveling is the best way to practice English!\n(בחירה מעולה!)`;
    }

    return {
      advanceTurn: true,
      text: `${ideaReaction}\n\n**Question 4 (Last question!):**\n(שאלה אחרונה לפני שמתחילים!)\n\nWhat would you like to practice first with me right now?\n(במה הכי בא לך שנתאמן עכשיו יחד?)\n\n• 📖 **Reading stories** — קריאת סיפורים קצרים (Unseen)\n• 📚 **Learning new words** — אוצר מילים בסיסי (Band I)\n• ✍️ **Writing in English** — כתיבת משפטים באנגלית`,
      quickReplies: [
        "I want to learn new vocabulary words 📚",
        "I'd like to practice reading stories 📖",
        "I want to improve my writing in English ✍️",
        "תבחר לי אתה משהו קל! 🎲",
      ],
    };
  }

  // After Turn 3 (Final Turn - Student selected their preferred practice focus!)
  const wantsVocab = lower.includes("word") || lower.includes("vocab") || lower.includes("מילים") || lower.includes("אוצר");
  const wantsReading = lower.includes("read") || lower.includes("stor") || lower.includes("קריאה") || lower.includes("סיפור");
  const wantsWriting = lower.includes("writ") || lower.includes("essay") || lower.includes("כתיבה");

  const focusHeb = wantsVocab
    ? "חיזוק אוצר מילים בסיסי (Band I) 📚"
    : wantsReading
    ? "קריאת סיפורים קצרים ומהנים (Unseen) 📖"
    : wantsWriting
    ? "כתיבת משפטים קצרים באנגלית (Writing) ✍️"
    : "תרגול מדורג וקל שמתאים בדיוק לך 🎯";

  return {
    advanceTurn: true,
    text: `Awesome choice, ${studentName}! 🎉\nמעולה! סיימנו את שיחת ההיכרות שלנו בהצלחה! 👏\nנתחיל עכשיו ב-**${focusHeb}** בקצב שלך, עם הסברים בעברית בכל שלב. הנה המשימה הראשונה שהכנתי במיוחד עבורך:`,
    quickReplies: [
      "בוא נתחיל עכשיו 🚀",
      "🎲 דוד, בחר עבורי משהו קל",
      "תסביר לי איך מתחילים",
    ],
  };
}

export function getProfileStorageKey(userId?: string): string {
  return userId ? `${PROFILE_STORAGE_KEY_PREFIX}_${userId}` : `${PROFILE_STORAGE_KEY_PREFIX}_guest`;
}

export function getChatStorageKey(userId?: string): string {
  return userId ? `${CHAT_STORAGE_KEY_PREFIX}_${userId}` : `${CHAT_STORAGE_KEY_PREFIX}_guest`;
}

/**
 * Initializes or loads the student tutor profile.
 * If the student already has completed unseens/essays, automatically infers their baseline!
 */
export async function getOrInitTutorProfile(
  userId?: string,
  userName?: string
): Promise<StudentTutorProfile> {
  const storageKey = getProfileStorageKey(userId);

  // 1. Try local storage
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(storageKey);
      if (local) {
        const prof: StudentTutorProfile = JSON.parse(local);
        if (prof.currentMission) {
          prof.currentMission = syncMissionWithDatabase(prof.currentMission, prof.level);
        }
        return prof;
      }
    } catch {}
  }

  // 2. Try Firestore if user is authenticated
  if (userId && db) {
    try {
      const ref = doc(db, "users", userId, "tutorProfile", "profile");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as StudentTutorProfile;
        if (data.currentMission) {
          data.currentMission = syncMissionWithDatabase(data.currentMission, data.level);
        }
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, JSON.stringify(data));
        }
        return data;
      }
    } catch (e) {
      console.warn("Firestore tutor profile fetch notice:", e);
    }
  }

  // 3. Scan existing submissions to pre-calculate baseline if student has prior work
  let initialLevel: TutorLevel = "Level 2";
  let initialBand: VocabBandLevel = "Band II";
  let readingScore = 65;
  let vocabScore = 60;
  let writingScore = 60;
  let unseensCount = 0;
  let essaysCount = 0;
  let hasHistory = false;

  if (typeof window !== "undefined") {
    try {
      const submissionsRaw = localStorage.getItem("ett_writing_submissions");
      if (submissionsRaw) {
        const subs: SubmissionItem[] = JSON.parse(submissionsRaw);
        const mySubs = userId
          ? subs.filter((s) => s.studentId === userId || s.studentName === userName)
          : subs;

        if (mySubs.length > 0) {
          hasHistory = true;
          const unseens = mySubs.filter((s) => s.type === "unseen");
          const writings = mySubs.filter((s) => s.type === "writing");
          unseensCount = unseens.length;
          essaysCount = writings.length;

          if (unseens.length > 0) {
            const avg = unseens.reduce((acc, s) => acc + (s.score || s.grade || 70), 0) / unseens.length;
            readingScore = Math.round(avg);
          }
          if (writings.length > 0) {
            const avg = writings.reduce((acc, s) => acc + (s.score || s.grade || 70), 0) / writings.length;
            writingScore = Math.round(avg);
          }
          const savedWords = loadSavedWords(userId);
          vocabScore = Math.min(95, 50 + savedWords.length * 3);

          if (readingScore >= 85 && writingScore >= 80) {
            initialLevel = "Level 3";
            initialBand = "Band III";
          } else if (readingScore <= 60 && writingScore <= 60) {
            initialLevel = "Level 1";
            initialBand = "Band I";
          }
        }
      }
    } catch {}
  }

  const newProfile: StudentTutorProfile = {
    studentId: userId || "guest",
    studentName: userName || "Student",
    level: initialLevel,
    vocabBand: initialBand,
    skills: {
      reading: readingScore,
      vocabulary: vocabScore,
      writing: writingScore,
    },
    streakDays: 1,
    totalTasksCompleted: unseensCount + essaysCount,
    lastActiveDate: new Date().toISOString().split("T")[0],
    diagnosticCompleted: hasHistory, // If student already has history on site, skip cold-start!
    strengths: hasHistory
      ? ["התמדה בתרגול משימות באתר", "נכונות ללמוד ולהתקדם"]
      : [],
    weaknesses: [],
    historySummary: {
      unseensCompleted: unseensCount,
      avgUnseenScore: readingScore,
      wordsLearned: 15,
      essaysWritten: essaysCount,
      avgWritingScore: writingScore,
    },
  };

  newProfile.currentMission = generateNextMission(newProfile);

  // Save initial
  await saveTutorProfile(newProfile);
  return newProfile;
}

/**
 * Persists tutor profile to localStorage and Firestore
 */
export async function saveTutorProfile(profile: StudentTutorProfile): Promise<void> {
  const storageKey = getProfileStorageKey(profile.studentId === "guest" ? undefined : profile.studentId);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch {}
  }

  if (profile.studentId && profile.studentId !== "guest" && db) {
    try {
      const ref = doc(db, "users", profile.studentId, "tutorProfile", "profile");
      await setDoc(ref, profile, { merge: true });
    } catch (e) {
      console.warn("Firestore tutor profile save notice:", e);
    }
  }
}

/**
 * Calculates placement from diagnostic answers including AI writing evaluation
 */
export function calculateDiagnosticPlacement(
  answers: DiagnosticAnswer[],
  currentProfile: StudentTutorProfile
): StudentTutorProfile {
  let selectedGoal = "all";
  let writingScore = 70;
  let writingStrengths: string[] = [];
  let writingTips: string[] = [];

  let vScore = 70;
  let rScore = 70;

  // Measure lexical richness across all student turns
  const allWords = answers
    .map((a) => a.selectedOption.toLowerCase())
    .join(" ")
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2);
  const uniqueWords = new Set(allWords);
  const longWords = Array.from(uniqueWords).filter((w) => w.length >= 6);

  if (uniqueWords.size >= 25 || longWords.length >= 6) {
    vScore = 86;
  } else if (uniqueWords.size >= 14 || longWords.length >= 3) {
    vScore = 74;
  } else {
    vScore = 60;
  }

  answers.forEach((ans) => {
    const q = DIAGNOSTIC_STEPS[ans.questionIndex];
    if (!q) return;

    if (q.skill === "goal" || ans.questionIndex === 3) {
      const lower = ans.selectedOption.toLowerCase();
      if (lower.includes("read") || lower.includes("stor") || lower.includes("קריאה") || lower.includes("סיפור")) {
        selectedGoal = "reading";
      } else if (lower.includes("word") || lower.includes("vocab") || lower.includes("מילים")) {
        selectedGoal = "vocabulary";
      } else if (lower.includes("writ") || lower.includes("essay") || lower.includes("כתיבה")) {
        selectedGoal = "writing";
      } else {
        selectedGoal = "all";
      }
    }

    if (q.skill === "reading" || ans.questionIndex === 1) {
      const lower = ans.selectedOption.toLowerCase();
      const mentionsSaltyStory =
        lower.includes("salt") ||
        lower.includes("sugar") ||
        lower.includes("mistake") ||
        lower.includes("bad") ||
        lower.includes("taste") ||
        lower.includes("pizza") ||
        lower.includes("order") ||
        lower.includes("buy") ||
        lower.includes("laugh") ||
        lower.includes("מלח") ||
        lower.includes("סוכר");
      const wordCount = lower.trim().split(/\s+/).filter(Boolean).length;
      if (mentionsSaltyStory && wordCount >= 7) {
        rScore = 88;
      } else if (mentionsSaltyStory || wordCount >= 5) {
        rScore = 75;
      } else {
        rScore = 58;
      }
    }

    if (typeof ans.vocabScore === "number") {
      vScore = Math.round((vScore + ans.vocabScore) / 2);
    }

    if (typeof ans.writingScore === "number") {
      writingScore = ans.writingScore;
    }
    if (ans.writingStrengths && ans.writingStrengths.length > 0) {
      writingStrengths = ans.writingStrengths;
    }
    if (ans.writingTips && ans.writingTips.length > 0) {
      writingTips = ans.writingTips;
    }
  });

  // If the student asked for Hebrew explanations ("אני לא מבין") during the conversation,
  // calibrate their reading and vocabulary scores gently downward so they start at a comfortable level.
  const helpTurnsCount = answers.filter((a) => a.neededHelp).length;
  if (helpTurnsCount > 0) {
    rScore = Math.max(50, rScore - helpTurnsCount * 10);
    vScore = Math.max(50, vScore - helpTurnsCount * 8);
  }

  // Calculate composite score from the three core pillars:
  // Reading 35%, Vocab 35%, AI Writing Rubric Evaluation 30%
  const compositeScore = Math.round(rScore * 0.35 + vScore * 0.35 + writingScore * 0.30);

  let placedLevel: TutorLevel = "Level 2";
  let placedBand: VocabBandLevel = "Band II";

  if (compositeScore >= 78) {
    placedLevel = "Level 3";
    placedBand = "Band III";
  } else if (compositeScore <= 60) {
    placedLevel = "Level 1";
    placedBand = "Band I";
  } else {
    placedLevel = "Level 2";
    placedBand = "Band II";
  }

  const strengthsList = [
    compositeScore >= 70 ? "יכולת הבעה טבעית בשיחה באנגלית" : "נכונות לשוחח ולהתבטא באנגלית",
    ...writingStrengths.slice(0, 2),
    "השלמת שיחת ההיכרות באנגלית בהצלחה!",
  ].filter(Boolean);

  const weaknessesList = [
    ...writingTips.slice(0, 2),
    selectedGoal === "reading" ? "שאלות הסקה ומבנה פסקאות באנסין" :
    selectedGoal === "writing" ? "אוצר מילים עשיר ומילות קישור בכתיבה" :
    selectedGoal === "vocabulary" ? "הטמעת מילים חדשות ב-Band II" :
    "דיוק בתשובות פתוחות והרחבת אוצר מילים",
  ].filter(Boolean);

  const updated: StudentTutorProfile = {
    ...currentProfile,
    level: placedLevel,
    vocabBand: placedBand,
    diagnosticCompleted: true,
    skills: {
      reading: rScore,
      vocabulary: vScore,
      writing: writingScore,
    },
    strengths: strengthsList,
    weaknesses: weaknessesList,
  };

  const preferredMissionType: "unseen" | "vocab" | "writing" | undefined =
    selectedGoal === "reading"
      ? "unseen"
      : selectedGoal === "vocabulary"
      ? "vocab"
      : selectedGoal === "writing"
      ? "writing"
      : undefined;

  updated.currentMission = generateNextMission(updated, preferredMissionType);
  return updated;
}

/**
 * Builds a validated Unseen topic option dynamically from the database
 */
function createUnseenTopicOption(
  storyId: string,
  topicId: string,
  nameHebrew: string,
  nameEnglish: string,
  emoji: string
): TaskTopicOption | null {
  const story = MIDDLE_SCHOOL_UNSEENS.find((s) => s.id === storyId);
  if (!story) return null;
  return {
    id: topicId,
    nameHebrew,
    nameEnglish,
    emoji,
    taskId: story.id,
    titleEnglish: story.title,
    titleHebrew: story.hebrewTitle,
    descriptionHebrew: `קראו את קטע הקריאה "${story.hebrewTitle}" וענו על השאלות. דוד יעקוב אחר התשובות שלכם ויעניק לכם משוב!`,
    targetUrl: `/unseen?passageId=${story.id}&from=david`,
  };
}

/**
 * Builds a validated Writing topic option dynamically from the database
 */
function createWritingTopicOption(
  taskId: string,
  topicId: string,
  nameHebrew?: string,
  nameEnglish?: string
): TaskTopicOption | null {
  const task = ALL_WRITING_TASKS.find((t) => t.id === taskId);
  if (!task) return null;
  return {
    id: topicId,
    nameHebrew: nameHebrew || task.hebrewTitle,
    nameEnglish: nameEnglish || task.title,
    emoji: task.emoji || "✍️",
    taskId: task.id,
    titleEnglish: task.title,
    titleHebrew: task.hebrewTitle,
    descriptionHebrew: task.hebrewInstructions,
    targetUrl: `/writing?task=${task.id}&from=david`,
  };
}

/**
 * Curated high-interest topics per level for Unseen (Reading Comprehension).
 * All titles, Hebrew translations, descriptions, and target URLs are dynamically
 * resolved directly from the single-source-of-truth MIDDLE_SCHOOL_UNSEENS database.
 */
export function getUnseenTopicsForLevel(level: TutorLevel): TaskTopicOption[] {
  if (level === "Level 1") {
    return [
      createUnseenTopicOption("story-level1-1", "animals", "בעלי חיים", "Animals & Pets", "🐶"),
      createUnseenTopicOption("story-level1-2", "space_robots", "רובוטים וחלל", "Space & Robots", "🚀"),
      createUnseenTopicOption("story-level1-3", "adventure_nature", "הרפתקאות וטבע", "Adventures in Nature", "🌲"),
      createUnseenTopicOption("story-level1-4", "baking_food", "אפייה ובישול", "Baking & Food", "🥐"),
      createUnseenTopicOption("story-level1-5", "ocean_marine", "עולם הים ודולפינים", "Marine Life & Reef", "🐬"),
    ].filter((t): t is TaskTopicOption => t !== null);
  } else if (level === "Level 2") {
    return [
      createUnseenTopicOption("story-level2-1", "desert_nature", "מדבר ועצי הנגב", "Desert & Ecology", "🏜️"),
      createUnseenTopicOption("story-level2-2", "history_mystery", "היסטוריה ותעלומות", "History & Mystery", "🏛️"),
      createUnseenTopicOption("story-level2-3", "bees_ecology", "דבורים ואקולוגיה", "Honeybees & Nature", "🐝"),
      createUnseenTopicOption("story-level2-4", "heroism_rescue", "גבורה וכלבי הצלה", "Rescue & Heroism", "🐕"),
      createUnseenTopicOption("story-level2-5", "solar_tech", "מכוניות סולאריות ומדע", "Solar Energy & Tech", "☀️"),
    ].filter((t): t is TaskTopicOption => t !== null);
  } else {
    // Level 3
    return [
      createUnseenTopicOption("story-level3-1", "whales_ocean", "לווייתנים ומעמקי הים", "Whales & Deep Ocean", "🐋"),
      createUnseenTopicOption("story-level3-2", "coral_science", "שוניות אלמוגים ומדע", "Coral Reefs & Science", "🪸"),
      createUnseenTopicOption("story-level3-3", "archaeology_rosetta", "ארכיאולוגיה וכתב עתיק", "Archaeology & Rosetta Stone", "📜"),
      createUnseenTopicOption("story-level3-4", "bionic_medicine", "רפואה ואיברים ביוניים", "Bionics & Medicine", "🦾"),
      createUnseenTopicOption("story-level3-5", "mars_space", "חקר מאדים ורובוטיקה", "Mars Exploration & AI", "🚀"),
    ].filter((t): t is TaskTopicOption => t !== null);
  }
}

/**
 * Curated high-interest topics per level for Writing Workshop.
 * All titles, Hebrew translations, descriptions, and target URLs are dynamically
 * resolved directly from the single-source-of-truth ALL_WRITING_TASKS database.
 */
export function getWritingTopicsForLevel(level: TutorLevel): TaskTopicOption[] {
  if (level === "Level 1") {
    return [
      createWritingTopicOption("task-letter-l1-1", "friends_letter", "מכתב לחבר/ה", "Note to a Friend"),
      createWritingTopicOption("task-opinion-l1-1", "food_opinion", "אוכל אהוב", "Pizza or Ice Cream"),
      createWritingTopicOption("task-desc-l1-1", "pets_desc", "חיות מחמד", "Favorite Pet"),
      createWritingTopicOption("task-desc-l1-3", "bedroom_desc", "החדר שלי", "My Bedroom"),
      createWritingTopicOption("task-letter-l1-2", "birthday_card", "כרטיס יום הולדת", "Birthday Card"),
    ].filter((t): t is TaskTopicOption => t !== null);
  } else if (level === "Level 2") {
    return [
      createWritingTopicOption("task-opinion-l2-1", "tech_phones", "סמארטפונים בכיתה", "Smartphones in School"),
      createWritingTopicOption("task-letter-l2-1", "summer_trip", "חופשת הקיץ", "Summer Vacation"),
      createWritingTopicOption("task-opinion-l2-2", "homework_debate", "שיעורי בית", "Is Homework Necessary"),
      createWritingTopicOption("task-desc-l2-1", "admired_person", "דמות להערצה", "Person I Admire"),
      createWritingTopicOption("task-creative-l2-1", "mystery_attic", "התיבה המסתורית", "Mystery in the Attic"),
    ].filter((t): t is TaskTopicOption => t !== null);
  } else {
    // Level 3
    return [
      createWritingTopicOption("task-opinion-l3-2", "ai_future", "בינה מלאכותית בלימודים", "AI in Education"),
      createWritingTopicOption("task-opinion-l3-1", "school_rules", "תקנון בית הספר ודמוקרטיה", "School Rules Debate"),
      createWritingTopicOption("task-letter-l3-1", "youth_community", "מכתב רשמי למרכז נוער", "Youth Community Center"),
      createWritingTopicOption("task-desc-l3-1", "future_invention", "המצאות העתיד", "Future Inventions"),
      createWritingTopicOption("task-letter-l3-3", "green_spaces", "הגנה על שטחים ירוקים", "Protecting Green Spaces"),
    ].filter((t): t is TaskTopicOption => t !== null);
  }
}

/**
 * Synchronizes any recommended mission (whether current, cached in local storage, or from chat history)
 * directly with the single source of truth in the database (ALL_WRITING_TASKS and MIDDLE_SCHOOL_UNSEENS).
 * Guarantees that the displayed title, Hebrew translation, description, topic label, and targetUrl
 * match 100% identically with zero discrepancy.
 */
export function syncMissionWithDatabase(
  mission?: TutorTaskRecommendation,
  level?: TutorLevel
): TutorTaskRecommendation | undefined {
  if (!mission) return undefined;

  const targetLevel = level || mission.level || "Level 2";

  if (mission.type === "writing") {
    const freshTopics = getWritingTopicsForLevel(targetLevel);

    // 1. If student previously picked a specific topic ID, match to that fresh topic
    let matchedTopic = mission.selectedTopicId
      ? freshTopics.find((t) => t.id === mission.selectedTopicId)
      : undefined;

    // 2. Resolve matching task from database
    let matchingTask = matchedTopic
      ? ALL_WRITING_TASKS.find((t) => t.id === matchedTopic!.taskId)
      : undefined;

    if (!matchingTask && mission.taskId) {
      matchingTask = ALL_WRITING_TASKS.find((t) => t.id === mission.taskId);
      if (matchingTask && !matchedTopic) {
        matchedTopic = freshTopics.find((t) => t.taskId === matchingTask!.id);
      }
    }

    // 3. Fallback: extract from targetUrl if needed
    if (!matchingTask && mission.targetUrl) {
      const match = mission.targetUrl.match(/[?&]task=([^&]+)/);
      if (match && match[1]) {
        matchingTask = ALL_WRITING_TASKS.find((t) => t.id === match[1]);
        if (matchingTask && !matchedTopic) {
          matchedTopic = freshTopics.find((t) => t.taskId === matchingTask!.id);
        }
      }
    }

    // 4. Default to first fresh topic if still not found
    if (!matchingTask && freshTopics.length > 0) {
      matchedTopic = freshTopics[0];
      matchingTask = ALL_WRITING_TASKS.find((t) => t.id === matchedTopic!.taskId);
    }

    if (matchingTask) {
      const assignParam = mission.assignmentId ? `&assignmentId=${mission.assignmentId}` : "";
      return {
        ...mission,
        id: mission.assignmentId ? `mission-assign-${mission.assignmentId}` : `mission-writing-${matchingTask.id}`,
        taskId: matchingTask.id,
        level: targetLevel,
        title: matchingTask.title,
        hebrewTitle: matchingTask.hebrewTitle,
        descriptionHebrew: matchingTask.hebrewInstructions,
        targetUrl: `/writing?task=${matchingTask.id}${assignParam}&from=david`,
        availableTopics: freshTopics.map((t) => ({
          ...t,
          targetUrl: `${t.targetUrl}${assignParam}`,
        })),
        selectedTopicId: matchedTopic ? matchedTopic.id : mission.selectedTopicId,
        selectedTopicNameHebrew: matchedTopic ? matchedTopic.nameHebrew : mission.selectedTopicNameHebrew,
      };
    }
  } else if (mission.type === "unseen") {
    const freshTopics = getUnseenTopicsForLevel(targetLevel);

    let matchedTopic = mission.selectedTopicId
      ? freshTopics.find((t) => t.id === mission.selectedTopicId)
      : undefined;

    let matchingStory = matchedTopic
      ? MIDDLE_SCHOOL_UNSEENS.find((s) => s.id === matchedTopic!.taskId)
      : undefined;

    if (!matchingStory && mission.taskId) {
      matchingStory = MIDDLE_SCHOOL_UNSEENS.find((s) => s.id === mission.taskId);
      if (matchingStory && !matchedTopic) {
        matchedTopic = freshTopics.find((t) => t.taskId === matchingStory!.id);
      }
    }

    if (!matchingStory && mission.targetUrl) {
      const match = mission.targetUrl.match(/[?&](?:passageId|story)=([^&]+)/);
      if (match && match[1]) {
        matchingStory = MIDDLE_SCHOOL_UNSEENS.find((s) => s.id === match[1]);
        if (matchingStory && !matchedTopic) {
          matchedTopic = freshTopics.find((t) => t.taskId === matchingStory!.id);
        }
      }
    }

    if (!matchingStory && freshTopics.length > 0) {
      matchedTopic = freshTopics[0];
      matchingStory = MIDDLE_SCHOOL_UNSEENS.find((s) => s.id === matchedTopic!.taskId);
    }

    if (matchingStory) {
      const assignParam = mission.assignmentId ? `&assignmentId=${mission.assignmentId}` : "";
      return {
        ...mission,
        id: mission.assignmentId ? `mission-assign-${mission.assignmentId}` : `mission-unseen-${matchingStory.id}`,
        taskId: matchingStory.id,
        level: targetLevel,
        title: matchingStory.title,
        hebrewTitle: matchingStory.hebrewTitle,
        descriptionHebrew: `קראו את קטע הקריאה "${matchingStory.hebrewTitle}" וענו על השאלות. דוד יעקוב אחר התשובות שלכם ויעניק לכם משוב!`,
        targetUrl: `/unseen?passageId=${matchingStory.id}${assignParam}&from=david`,
        availableTopics: freshTopics.map((t) => ({
          ...t,
          targetUrl: `${t.targetUrl}${assignParam}`,
        })),
        selectedTopicId: matchedTopic ? matchedTopic.id : mission.selectedTopicId,
        selectedTopicNameHebrew: matchedTopic ? matchedTopic.nameHebrew : mission.selectedTopicNameHebrew,
      };
    }
  } else if (mission.type === "vocab") {
    const band = targetLevel === "Level 3" ? "Band III" : targetLevel === "Level 1" ? "Band I" : "Band II";
    return {
      ...mission,
      level: targetLevel,
      targetUrl: `/vocabulary?band=${encodeURIComponent(band)}&from=david`,
    };
  }

  return mission;
}

/**
 * Updates a recommended mission to a newly selected topic
 */
export function updateMissionTopic(
  currentMission: TutorTaskRecommendation,
  topicId: string
): TutorTaskRecommendation {
  if (!currentMission.availableTopics || currentMission.availableTopics.length === 0) {
    return currentMission;
  }
  const found = currentMission.availableTopics.find((t) => t.id === topicId);
  if (!found) return currentMission;

  const assignParam =
    currentMission.assignmentId && !found.targetUrl.includes("assignmentId=")
      ? `&assignmentId=${currentMission.assignmentId}`
      : "";

  return {
    ...currentMission,
    id: currentMission.assignmentId
      ? `mission-assign-${currentMission.assignmentId}`
      : `mission-${currentMission.type}-${found.taskId}`,
    taskId: found.taskId,
    title: found.titleEnglish,
    hebrewTitle: found.titleHebrew,
    descriptionHebrew: found.descriptionHebrew || currentMission.descriptionHebrew,
    targetUrl: `${found.targetUrl}${assignParam}`,
    selectedTopicId: found.id,
    selectedTopicNameHebrew: found.nameHebrew,
    needsTopicSelection: false,
  };
}

/**
 * Dynamically picks the next best assignment from the site's rich library,
 * providing students with curated topic options for reading & writing.
 * By default, asks students to pick their favorite topic unless already selected.
 */
export function generateNextMission(
  profile: StudentTutorProfile,
  preferredType?: "unseen" | "vocab" | "writing",
  preferredTopicId?: string,
  isTopicChosen?: boolean
): TutorTaskRecommendation {
  const { reading, vocabulary, writing } = profile.skills;
  const level = profile.level;

  let selectedType = preferredType;
  if (!selectedType) {
    if (reading <= vocabulary && reading <= writing) {
      selectedType = "unseen";
    } else if (vocabulary <= writing) {
      selectedType = "vocab";
    } else {
      selectedType = "writing";
    }
  }

  if (selectedType === "unseen") {
    const topics = getUnseenTopicsForLevel(level);
    const chosenTopic = preferredTopicId
      ? topics.find((t) => t.id === preferredTopicId) || topics[0]
      : topics[0];

    return {
      id: `mission-unseen-${chosenTopic.taskId}`,
      type: "unseen",
      title: chosenTopic.titleEnglish,
      hebrewTitle: chosenTopic.titleHebrew,
      descriptionHebrew: `קראו את קטע הקריאה "${chosenTopic.titleHebrew}" וענו על השאלות. דוד יעקוב אחר התשובות שלכם ויעניק לכם משוב!`,
      level: level,
      taskId: chosenTopic.taskId,
      targetUrl: chosenTopic.targetUrl,
      estimatedMinutes: 12,
      selectedTopicId: preferredTopicId || (isTopicChosen ? chosenTopic.id : undefined),
      selectedTopicNameHebrew: preferredTopicId || isTopicChosen ? chosenTopic.nameHebrew : undefined,
      availableTopics: topics,
      needsTopicSelection: !preferredTopicId && !isTopicChosen,
    };
  } else if (selectedType === "vocab") {
    // Recommend Vocabulary
    return {
      id: `mission-vocab-${profile.vocabBand}`,
      type: "vocab",
      title: `${profile.vocabBand} Speed Drill`,
      hebrewTitle: `אימון אוצר מילים מהיר - ${profile.vocabBand}`,
      descriptionHebrew: `תרגלו 10 מילים מרכזיות בבנק המילים באמצעות משחק התאמה מהיר (Speed Match) או כרטיסיות.`,
      level: level,
      targetUrl: `/vocabulary?band=${encodeURIComponent(profile.vocabBand)}&from=david`,
      estimatedMinutes: 6,
      needsTopicSelection: false,
    };
  } else {
    // Recommend Writing
    const topics = getWritingTopicsForLevel(level);
    const chosenTopic = preferredTopicId
      ? topics.find((t) => t.id === preferredTopicId) || topics[0]
      : topics[0];

    return {
      id: `mission-writing-${chosenTopic.taskId}`,
      type: "writing",
      title: chosenTopic.titleEnglish,
      hebrewTitle: chosenTopic.titleHebrew,
      descriptionHebrew: chosenTopic.descriptionHebrew || `כתבו פסקה קצרה בנושא "${chosenTopic.titleHebrew}". השתמשו במילות הקישור ובבנק המילים המובנה בסדנה!`,
      level: level,
      taskId: chosenTopic.taskId,
      targetUrl: chosenTopic.targetUrl,
      estimatedMinutes: 15,
      selectedTopicId: preferredTopicId || (isTopicChosen ? chosenTopic.id : undefined),
      selectedTopicNameHebrew: preferredTopicId || isTopicChosen ? chosenTopic.nameHebrew : undefined,
      availableTopics: topics,
      needsTopicSelection: !preferredTopicId && !isTopicChosen,
    };
  }
}

/**
 * Ensures we always have between 5 and 8 rich vocabulary words to test after a task.
 * Deduplicates task-specific words and supplements from the level's core word bank if < 6.
 */
export function buildVocabPoolForTask(
  baseWords: TutorVocabReviewItem[],
  level: TutorLevel = "Level 2"
): TutorVocabReviewItem[] {
  const seen = new Set<string>();
  const result: TutorVocabReviewItem[] = [];

  for (const w of baseWords) {
    const clean = w.word.trim().toLowerCase();
    if (clean && w.hebrew.trim() && !seen.has(clean)) {
      seen.add(clean);
      result.push({
        word: w.word.trim(),
        hebrew: w.hebrew.trim(),
        pos: w.pos || "noun",
        exampleSentence: w.exampleSentence,
      });
    }
  }

  // Supplement from level pool if fewer than 6 words so we always test 5-8 words
  if (result.length < 6) {
    const fallbackPool =
      level === "Level 1"
        ? MIDDLE_SCHOOL_EASY
        : level === "Level 3"
        ? MIDDLE_SCHOOL_HARD
        : MIDDLE_SCHOOL_MEDIUM;

    for (const item of fallbackPool) {
      if (result.length >= 7) break;
      const clean = item.english.trim().toLowerCase();
      if (!seen.has(clean)) {
        seen.add(clean);
        result.push({
          word: item.english,
          hebrew: item.hebrew,
          pos: item.partOfSpeech,
          exampleSentence: item.example,
        });
      }
    }
  }

  return result.slice(0, 8);
}

/**
 * Called when an unseen or writing task is finished by the student.
 * Awards XP, updates skill mastery, updates streak, rotates to a complementary next mission,
 * and returns David's reaction message.
 */
export async function recordTaskCompletion(
  studentId: string,
  type: "unseen" | "writing" | "vocab",
  score: number,
  taskTitle: string
): Promise<{ updatedProfile: StudentTutorProfile; tutorNote: string }> {
  const profile = await getOrInitTutorProfile(studentId);

  // Update skills
  const newSkills = { ...profile.skills };
  if (type === "unseen") {
    newSkills.reading = Math.min(100, Math.round(newSkills.reading * 0.7 + score * 0.3));
  } else if (type === "writing") {
    newSkills.writing = Math.min(100, Math.round(newSkills.writing * 0.7 + score * 0.3));
  } else {
    newSkills.vocabulary = Math.min(100, newSkills.vocabulary + 5);
  }

  // Check level upgrade
  let newLevel = profile.level;
  let newBand = profile.vocabBand;
  const avgSkill = (newSkills.reading + newSkills.vocabulary + newSkills.writing) / 3;

  if (avgSkill >= 82 && profile.level === "Level 2") {
    newLevel = "Level 3";
    newBand = "Band III";
  } else if (avgSkill >= 68 && profile.level === "Level 1") {
    newLevel = "Level 2";
    newBand = "Band II";
  }

  const updated: StudentTutorProfile = {
    ...profile,
    level: newLevel,
    vocabBand: newBand,
    skills: newSkills,
    totalTasksCompleted: profile.totalTasksCompleted + 1,
    lastActiveDate: new Date().toISOString().split("T")[0],
  };

  // Pick complementary next practice type so the private lesson alternates naturally
  const nextPreferredType: "unseen" | "writing" | "vocab" =
    type === "unseen"
      ? "writing"
      : type === "writing"
      ? "unseen"
      : newSkills.reading <= newSkills.writing
      ? "unseen"
      : "writing";

  updated.currentMission = generateNextMission(updated, nextPreferredType);
  await saveTutorProfile(updated);

  let tutorNote = "";
  if (score >= 90) {
    tutorNote = `וואו, ציון מדהים של ${score}/100 ב-"${taskTitle}"! אני ממש גאה בהתקדמות שלך. רמת השליטה שלך עלתה!`;
  } else if (score >= 75) {
    tutorNote = `עבודה יפה מאוד ב-"${taskTitle}"! קיבלת ציון של ${score}/100. ראיתי את ההשקעה שלך בכל שאלה ושאלה.`;
  } else {
    tutorNote = `סיימת את המשימה "${taskTitle}" עם ציון ${score}/100. אל דאגה – כל תרגול מחזק אותך! בוא נתרגל את הנקודות שפחות הצליחו.`;
  }

  return { updatedProfile: updated, tutorNote };
}

/**
 * Turns in a completed assignment to David, storing the detailed evaluation and 5-8 vocabulary
 * words so David can review the student's work, test vocabulary, and continue the private lesson.
 */
export async function submitTaskToDavid(
  studentId: string,
  payload: TutorTurnInPayload
): Promise<StudentTutorProfile> {
  const { updatedProfile } = await recordTaskCompletion(
    studentId,
    payload.type,
    payload.score,
    payload.taskTitle
  );

  const enrichedPayload: TutorTurnInPayload = {
    ...payload,
    vocabToReview: buildVocabPoolForTask(payload.vocabToReview, updatedProfile.level),
  };

  if (typeof window !== "undefined") {
    try {
      const key = studentId && studentId !== "guest"
        ? `${TURNIN_STORAGE_KEY_PREFIX}_${studentId}`
        : `${TURNIN_STORAGE_KEY_PREFIX}_guest`;
      localStorage.setItem(key, JSON.stringify(enrichedPayload));
      // Also write to guest key as fallback in case auth resolves slightly after mount
      localStorage.setItem(`${TURNIN_STORAGE_KEY_PREFIX}_latest`, JSON.stringify(enrichedPayload));
    } catch {}
  }

  return updatedProfile;
}

/**
 * Consumes any pending turn-in assignment when the student returns to David's page (/tutor).
 */
export function consumePendingTurnIn(userId?: string): TutorTurnInPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const userKey = userId && userId !== "guest"
      ? `${TURNIN_STORAGE_KEY_PREFIX}_${userId}`
      : `${TURNIN_STORAGE_KEY_PREFIX}_guest`;
    const latestKey = `${TURNIN_STORAGE_KEY_PREFIX}_latest`;

    const raw = localStorage.getItem(userKey) || localStorage.getItem(latestKey);
    if (!raw) return null;

    localStorage.removeItem(userKey);
    localStorage.removeItem(latestKey);
    localStorage.removeItem(`${TURNIN_STORAGE_KEY_PREFIX}_guest`);
    return JSON.parse(raw) as TutorTurnInPayload;
  } catch {
    return null;
  }
}

/**
 * Loads previous tutor chat messages from local storage
 */
export function loadTutorChat(userId?: string): TutorMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getChatStorageKey(userId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Saves tutor chat messages to local storage
 */
export function saveTutorChat(messages: TutorMessage[], userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getChatStorageKey(userId), JSON.stringify(messages));
  } catch {}
}

/**
 * Resolves a teacher-specified English focus word into a TutorVocabReviewItem
 * with a Hebrew translation and optional example sentence.
 */
export function resolveFocusWordToReviewItem(rawWord: string): TutorVocabReviewItem {
  const cleanWord = rawWord.trim();
  const lower = cleanWord.toLowerCase();

  // 1. Check Middle School vocab pools first (includes example sentences)
  const allCurated = [...MIDDLE_SCHOOL_EASY, ...MIDDLE_SCHOOL_MEDIUM, ...MIDDLE_SCHOOL_HARD];
  const curatedMatch = allCurated.find((item) => item.english.toLowerCase() === lower);
  if (curatedMatch) {
    return {
      word: curatedMatch.english,
      hebrew: curatedMatch.hebrew,
      pos: curatedMatch.partOfSpeech,
      exampleSentence: curatedMatch.example,
    };
  }

  // 2. Check Unseen passages vocabulary lists
  for (const passage of MIDDLE_SCHOOL_UNSEENS) {
    if (passage.vocabularyHints) {
      const passageMatch = passage.vocabularyHints.find(
        (v) => v.word.toLowerCase() === lower
      );
      if (passageMatch) {
        return {
          word: passageMatch.word,
          hebrew: passageMatch.translation,
          pos: "noun",
        };
      }
    }
  }

  // 3. Check built-in dictionary
  const dictMeaning = BUILT_IN_DICTIONARY[lower];
  if (dictMeaning) {
    return {
      word: cleanWord,
      hebrew: dictMeaning,
      pos: "noun",
    };
  }

  // Fallback
  return {
    word: cleanWord,
    hebrew: "מילת מפתח מהמורה (בדוק במילון בטקסט)",
    pos: "noun",
  };
}

/**
 * Fetches active, unsubmitted TeacherAssignments targeted to the given student
 * and converts them into David's TutorTaskRecommendation cards.
 */
export async function getPendingTeacherAssignmentsForStudent(
  studentUser: ActiveUser | null | undefined,
  studentLevel: TutorLevel
): Promise<TutorTaskRecommendation[]> {
  if (typeof window === "undefined") return [];

  let allAssignments: TeacherAssignment[] = [];
  let submittedIds: string[] = [];
  let submittedTaskIds: string[] = [];

  // 1. Load from localStorage
  try {
    const raw = localStorage.getItem("ett_teacher_assignments");
    if (raw) {
      allAssignments = JSON.parse(raw) as TeacherAssignment[];
    }
    const rawSubs = localStorage.getItem("ett_writing_submissions");
    if (rawSubs && studentUser) {
      const subs = JSON.parse(rawSubs) as Array<{
        assignmentId?: string;
        taskId?: string;
        studentId?: string;
        studentName?: string;
      }>;
      const mySubs = subs.filter(
        (s) =>
          s.studentId === studentUser.id ||
          (s.studentName && s.studentName.toLowerCase() === studentUser.name.toLowerCase())
      );
      submittedIds = mySubs.filter((s) => s.assignmentId).map((s) => s.assignmentId!);
      submittedTaskIds = mySubs.filter((s) => s.taskId).map((s) => s.taskId!);
    }
  } catch {}

  // 2. Load from Firestore if configured
  if (db) {
    try {
      const snap = await getDocs(collection(db, "assignments"));
      const fsList: TeacherAssignment[] = [];
      snap.forEach((d) => fsList.push({ ...(d.data() as TeacherAssignment), id: d.id }));

      const merged = [...fsList];
      for (const loc of allAssignments) {
        if (!merged.some((m) => m.id === loc.id)) {
          merged.push(loc);
        }
      }
      allAssignments = merged;

      if (studentUser) {
        const subSnap = await getDocs(
          query(collection(db, "submissions"), where("studentId", "==", studentUser.id))
        );
        subSnap.forEach((d) => {
          const data = d.data() as { assignmentId?: string; taskId?: string };
          if (data.assignmentId && !submittedIds.includes(data.assignmentId)) {
            submittedIds.push(data.assignmentId);
          }
          if (data.taskId && !submittedTaskIds.includes(data.taskId)) {
            submittedTaskIds.push(data.taskId);
          }
        });
      }
    } catch {}
  }

  // Filter active and targeted to student (only assignments with David enabled)
  const relevant = allAssignments.filter((a) => {
    if (a.status === "archived") return false;
    if (!a.coachWithDavid && !a.isAdaptiveDavid) return false;
    if (submittedIds.includes(a.id)) return false;

    const isChoiceMode = Boolean(
      a.isFreeChoice || a.isAdaptiveDavid || a.taskId === "free_choice" || a.taskId === "adaptive_david"
    );
    if (!isChoiceMode && a.taskId && submittedTaskIds.includes(a.taskId)) {
      return false;
    }

    if (!studentUser) {
      return a.targetType === "all";
    }

    const teacherMatch =
      !a.teacherId ||
      !studentUser.teacherId ||
      a.teacherId === studentUser.teacherId ||
      (studentUser.teacherName &&
        a.teacherName.toLowerCase() === studentUser.teacherName.toLowerCase());
    if (!teacherMatch) return false;

    if (a.targetType === "all" || !a.targetType) return true;
    if (a.targetType === "class") {
      const classMatch =
        !a.targetClass ||
        a.targetClass === "all" ||
        a.targetClass === studentUser.fullClass ||
        a.targetClass === studentUser.classGrade ||
        (studentUser.fullClass &&
          a.targetClass &&
          studentUser.fullClass.replace(/[׳']/g, "'") === a.targetClass.replace(/[׳']/g, "'"));
      const groupMatch = !a.targetGroup || a.targetGroup === studentUser.group;
      return Boolean(classMatch && groupMatch);
    }
    if (a.targetType === "group") {
      return Boolean(studentUser.group && a.targetGroup === studentUser.group);
    }
    if (a.targetType === "students") {
      return Boolean(a.targetStudentIds?.includes(studentUser.id));
    }

    return false;
  });

  relevant.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Load any custom unseens or writings if needed
  let allUnseens = [...MIDDLE_SCHOOL_UNSEENS];
  let allWritings = [...ALL_WRITING_TASKS];
  try {
    const rawUnseens = localStorage.getItem("custom_unseen_passages");
    if (rawUnseens) {
      const parsed = JSON.parse(rawUnseens);
      if (Array.isArray(parsed)) allUnseens = [...parsed, ...allUnseens];
    }
    const rawWritings = localStorage.getItem("custom_writing_prompts");
    if (rawWritings) {
      const parsed = JSON.parse(rawWritings);
      if (Array.isArray(parsed)) allWritings = [...parsed, ...allWritings];
    }
  } catch {}

  const recommendations: TutorTaskRecommendation[] = [];

  for (const a of relevant) {
    const targetLevel: TutorLevel = a.level ? (a.level as TutorLevel) : studentLevel;

    if (a.type === "unseen") {
      const levelTopics = getUnseenTopicsForLevel(targetLevel).map((t) => ({
        ...t,
        targetUrl: `/unseen?passageId=${t.taskId}&assignmentId=${a.id}&from=david`,
      }));
      const levelPassages = allUnseens.filter((p) => p.level === targetLevel);
      const specificPassage =
        !a.isFreeChoice && !a.isAdaptiveDavid
          ? allUnseens.find((p) => p.id === a.taskId)
          : undefined;
      const chosenPassage =
        specificPassage || levelPassages[0] || allUnseens[0];

      const isChoiceMode = Boolean(a.isFreeChoice || a.isAdaptiveDavid);
      const defaultTopic = levelTopics[0];

      recommendations.push({
        id: `mission-assign-${a.id}`,
        type: "unseen",
        taskId: chosenPassage.id,
        title: chosenPassage.title,
        hebrewTitle: chosenPassage.hebrewTitle || a.title,
        descriptionHebrew:
          a.instructions ||
          (a.isAdaptiveDavid
            ? `המורה ${a.teacherName} שלח/ה לך משימת קריאה מותאמת לרמה שלך (${targetLevel}) בליווי דוד! בחר/י נושא שמעניין אותך ונתחיל.`
            : `קראו את הקטע "${chosenPassage.hebrewTitle}" וענו על השאלות בליווי דוד.`),
        level: chosenPassage.level || targetLevel,
        targetUrl: `/unseen?passageId=${chosenPassage.id}&assignmentId=${a.id}&from=david`,
        estimatedMinutes: 12,
        selectedTopicId: isChoiceMode ? defaultTopic?.id : undefined,
        selectedTopicNameHebrew: isChoiceMode ? defaultTopic?.nameHebrew : undefined,
        availableTopics: isChoiceMode ? levelTopics : undefined,
        needsTopicSelection: isChoiceMode,
        assignmentId: a.id,
        teacherName: a.teacherName,
        teacherInstructions: a.instructions,
        dueDate: a.dueDate,
        teacherFocusWords: a.focusWords,
      });
    } else if (a.type === "writing") {
      const levelTopics = getWritingTopicsForLevel(targetLevel).map((t) => ({
        ...t,
        targetUrl: `/writing?task=${t.taskId}&assignmentId=${a.id}&from=david`,
      }));
      const levelPrompts = allWritings.filter((p) => p.level === targetLevel);
      const specificPrompt =
        !a.isFreeChoice && !a.isAdaptiveDavid
          ? allWritings.find((p) => p.id === a.taskId)
          : undefined;
      const chosenPrompt =
        specificPrompt || levelPrompts[0] || allWritings[0];

      const isChoiceMode = Boolean(a.isFreeChoice || a.isAdaptiveDavid);
      const defaultTopic = levelTopics[0];

      recommendations.push({
        id: `mission-assign-${a.id}`,
        type: "writing",
        taskId: chosenPrompt.id,
        title: chosenPrompt.title,
        hebrewTitle: chosenPrompt.hebrewTitle || a.title,
        descriptionHebrew:
          a.instructions ||
          (a.isAdaptiveDavid
            ? `המורה ${a.teacherName} ביקש/ה ממני ללוות אותך במשימת כתיבה מותאמת לרמה שלך (${targetLevel})! בחר/י נושא לכתיבה ונתחיל.`
            : chosenPrompt.hebrewInstructions),
        level: chosenPrompt.level || targetLevel,
        targetUrl: `/writing?task=${chosenPrompt.id}&assignmentId=${a.id}&from=david`,
        estimatedMinutes: 15,
        selectedTopicId: isChoiceMode ? defaultTopic?.id : undefined,
        selectedTopicNameHebrew: isChoiceMode ? defaultTopic?.nameHebrew : undefined,
        availableTopics: isChoiceMode ? levelTopics : undefined,
        needsTopicSelection: isChoiceMode,
        assignmentId: a.id,
        teacherName: a.teacherName,
        teacherInstructions: a.instructions,
        dueDate: a.dueDate,
        teacherFocusWords: a.focusWords,
      });
    }
  }

  return recommendations;
}

/**
 * Generates David's pre-task coaching message (key vocabulary + strategic tips)
 * before the student starts a teacher-assigned mission.
 */
export function generateTeacherAssignmentPrepMessage(
  mission: TutorTaskRecommendation,
  studentName?: string
): string {
  const cleanName = studentName ? studentName.split(" ")[0] : "אלוף/ה";

  // Gather 4-6 vocabulary words to pre-teach
  const prepWords: TutorVocabReviewItem[] = [];
  const seen = new Set<string>();

  if (mission.teacherFocusWords && mission.teacherFocusWords.length > 0) {
    for (const fw of mission.teacherFocusWords) {
      const resolved = resolveFocusWordToReviewItem(fw);
      const key = resolved.word.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        prepWords.push(resolved);
      }
    }
  }

  if (prepWords.length < 4 && mission.type === "unseen") {
    const passage = MIDDLE_SCHOOL_UNSEENS.find((p) => p.id === mission.taskId);
    if (passage?.vocabularyHints) {
      for (const v of passage.vocabularyHints) {
        if (prepWords.length >= 5) break;
        const key = v.word.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          prepWords.push({ word: v.word, hebrew: v.translation, pos: "noun" });
        }
      }
    }
  }

  if (prepWords.length < 4) {
    const fallbackPool = buildVocabPoolForTask([], mission.level);
    for (const item of fallbackPool) {
      if (prepWords.length >= 5) break;
      const key = item.word.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        prepWords.push(item);
      }
    }
  }

  const wordsListText = prepWords
    .slice(0, 6)
    .map(
      (w, idx) =>
        `${idx + 1}. **${w.word}** — ${w.hebrew}${w.exampleSentence ? ` (*"${w.exampleSentence}"*)` : ""}`
    )
    .join("\n");

  const strategyTip =
    mission.type === "unseen"
      ? `💡 **טיפ של דוד לקריאה (Unseen):**\nלפני שקוראים את כל הטקסט, קרא/י קודם את הכותרת ואת השאלה הראשונה כדי להבין מה לחפש. אם מילה לא מוכרת לך בטקסט – אפשר ללחוץ עליה ולקבל תרגום מיידי!`
      : `💡 **טיפ של דוד לכתיבה (Writing):**\nנסה/י לשלב לפחות 2–3 מהמילים שלמעלה בתוך החיבור שלך, והשתמש/י במילות קישור כמו **First**, **In addition**, ו-**Finally** כדי שהכתיבה תהיה מסודרת וברורה.`;

  const teacherNote = mission.teacherInstructions
    ? `\n📌 **דגש חשוב מהמורה ${mission.teacherName || ""}:** "${mission.teacherInstructions}"\n`
    : "";

  return `בשמחה ${cleanName}! בוא/י נעשה הכנה קצרה של דקה לפני שאת/ה מתחיל/ה את המשימה:
👉 **${mission.title}**
(${mission.hebrewTitle}) 🎓${teacherNote}

🔑 **מילות מפתח שכדאי להכיר לפני שמתחילים (אבחן אותך עליהן בסיום!):**
${wordsListText}

${strategyTip}

כשאת/ה מוכן/ה – לחץ/י על **"התחל במשימת המורה עכשיו"** בכרטיס שלמעלה, ובסיום אל תשכח/י ללחוץ על **"הגש משימה לדוד"** כדי שנעבור יחד על הציון והמילים! 🚀`;
}


