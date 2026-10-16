import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  StudentTutorProfile,
  TutorLevel,
  VocabBandLevel,
  TutorTaskRecommendation,
  TaskTopicOption,
  TutorMessage,
} from "@/types/tutor";
import { MIDDLE_SCHOOL_UNSEENS } from "@/data/unseen-middle-school";
import { ALL_WRITING_TASKS } from "@/data/writing-tasks";
import { loadSavedWords } from "@/lib/vocab-storage";
import { SubmissionItem } from "@/types/submission";

export const TUTOR_NAME = "David";
export const TUTOR_TITLE_HE = "דוד - המורה הפרטי שלך לאנגלית";

const PROFILE_STORAGE_KEY_PREFIX = "ett_tutor_profile";
const CHAT_STORAGE_KEY_PREFIX = "ett_tutor_chat";

export interface DiagnosticQuestionDef {
  step: number;
  totalSteps: number;
  skill: "vocabulary" | "reading" | "writing" | "goal";
  question: string;
  questionHebrew: string;
  passage?: string;
  options: { text: string; textHebrew?: string; value: string; isCorrect?: boolean; levelWeight?: TutorLevel }[];
}

export const DIAGNOSTIC_STEPS: DiagnosticQuestionDef[] = [
  {
    step: 1,
    totalSteps: 4,
    skill: "vocabulary",
    question: "Choose the word that best completes the sentence:\n\"It is an amazing ______ to visit London this summer!\"",
    questionHebrew: "בחרו את המילה הנכונה ביותר להשלמת המשפט:",
    options: [
      { text: "opportunity", textHebrew: "הזדמנות (Band II)", value: "opportunity", isCorrect: true, levelWeight: "Level 2" },
      { text: "garden", textHebrew: "גינה (Band I)", value: "garden", isCorrect: false, levelWeight: "Level 1" },
      { text: "consequence", textHebrew: "השלכה (Band III)", value: "consequence", isCorrect: false, levelWeight: "Level 3" },
      { text: "simple", textHebrew: "פשוט (Band I)", value: "simple", isCorrect: false, levelWeight: "Level 1" },
    ],
  },
  {
    step: 2,
    totalSteps: 4,
    skill: "reading",
    passage: "\"Maya loved taking photographs of rare birds. Early every Saturday, she packed her camera and hiked quietly into the forest before sunrise so the birds wouldn't fly away.\"",
    question: "Why did Maya go into the forest before sunrise?",
    questionHebrew: "לפי הקטע הקצר, מדוע מיה הלכה ליער עוד לפני הזריחה?",
    options: [
      { text: "Because the forest was too hot in the afternoon.", textHebrew: "כי ביער היה חם מדי בצהריים.", value: "a", isCorrect: false },
      { text: "To avoid scaring the birds away with noise or movement.", textHebrew: "כדי לא להבריח את הציפורים ברעש ותנועה.", value: "b", isCorrect: true, levelWeight: "Level 2" },
      { text: "She wanted to meet her friends there.", textHebrew: "היא רצתה לפגוש שם את החברים שלה.", value: "c", isCorrect: false },
      { text: "She had to buy a new camera.", textHebrew: "היא הייתה צריכה לקנות מצלמה חדשה.", value: "d", isCorrect: false },
    ],
  },
  {
    step: 3,
    totalSteps: 4,
    skill: "writing",
    question: "Choose the best connector word:\n\"Eran wanted to play soccer in the yard, _______ it started to rain heavily.\"",
    questionHebrew: "בחרו את מילת הקישור המתאימה ביותר:",
    options: [
      { text: "because", textHebrew: "בגלל ש...", value: "because", isCorrect: false },
      { text: "but", textHebrew: "אבל / אך", value: "but", isCorrect: true, levelWeight: "Level 2" },
      { text: "so that", textHebrew: "כדי ש...", value: "so_that", isCorrect: false },
      { text: "therefore", textHebrew: "לפיכך / לכן (High level)", value: "therefore", isCorrect: false, levelWeight: "Level 3" },
    ],
  },
  {
    step: 4,
    totalSteps: 4,
    skill: "goal",
    question: "What is your main goal with David?",
    questionHebrew: "מהי המטרה העיקרית שלך בלמידה עם דוד?",
    options: [
      { text: "Reading Comprehension (Unseen & Bagrut)", textHebrew: "הבנת הנקרא ומבחני אנסין", value: "reading" },
      { text: "Expanding My Vocabulary (Word Bands)", textHebrew: "הרחבת אוצר המילים ובנק מילים", value: "vocabulary" },
      { text: "Writing Good Paragraphs & Essays", textHebrew: "כתיבת חיבורים, פסקאות ומכתבים", value: "writing" },
      { text: "All-Around English Booster", textHebrew: "שיפור כולל בכל המיומנויות", value: "all" },
    ],
  },
];

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
        return JSON.parse(local);
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
 * Calculates placement from diagnostic answers
 */
export function calculateDiagnosticPlacement(
  answers: { questionIndex: number; selectedOption: string }[],
  currentProfile: StudentTutorProfile
): StudentTutorProfile {
  let score = 0;
  let selectedGoal = "all";

  answers.forEach((ans) => {
    const q = DIAGNOSTIC_STEPS[ans.questionIndex];
    if (!q) return;
    if (q.skill === "goal") {
      selectedGoal = ans.selectedOption;
      return;
    }
    const opt = q.options.find((o) => o.value === ans.selectedOption);
    if (opt?.isCorrect) score += 1;
  });

  let placedLevel: TutorLevel = "Level 2";
  let placedBand: VocabBandLevel = "Band II";
  let rScore = 65;
  let vScore = 65;
  let wScore = 65;

  if (score === 3) {
    placedLevel = "Level 3";
    placedBand = "Band III";
    rScore = 85;
    vScore = 85;
    wScore = 80;
  } else if (score <= 1) {
    placedLevel = "Level 1";
    placedBand = "Band I";
    rScore = 55;
    vScore = 50;
    wScore = 55;
  }

  const updated: StudentTutorProfile = {
    ...currentProfile,
    level: placedLevel,
    vocabBand: placedBand,
    diagnosticCompleted: true,
    skills: {
      reading: rScore,
      vocabulary: vScore,
      writing: wScore,
    },
    strengths: [
      score >= 2 ? "בסיס טוב באוצר מילים ומשפטים" : "רצון להשתפר ותרגול יסודי",
      "השלמת מבדק האבחון הראשוני בהצלחה!",
    ],
    weaknesses: [
      selectedGoal === "reading" ? "שאלות הסקה ומבנה פסקאות באנסין" :
      selectedGoal === "writing" ? "אוצר מילים עשיר ומילות קישור בכתיבה" :
      selectedGoal === "vocabulary" ? "הטמעת מילים חדשות ב-Band II" :
      "דיוק בתשובות פתוחות והרחבת אוצר מילים",
    ],
  };

  updated.currentMission = generateNextMission(updated);
  return updated;
}

/**
 * Curated high-interest topics per level for Unseen (Reading Comprehension)
 */
export function getUnseenTopicsForLevel(level: TutorLevel): TaskTopicOption[] {
  if (level === "Level 1") {
    return [
      {
        id: "animals",
        nameHebrew: "בעלי חיים",
        nameEnglish: "Animals & Pets",
        emoji: "🐶",
        taskId: "story-level1-1",
        titleEnglish: "Max the Small Dog",
        titleHebrew: "מקס הכלב הקטן",
        descriptionHebrew: "קראו על מקס הכלב הקטן, שגרתו היומית ומשחקיו בגינה.",
        targetUrl: "/unseen?passageId=story-level1-1",
      },
      {
        id: "space_robots",
        nameHebrew: "רובוטים וחלל",
        nameEnglish: "Space & Robots",
        emoji: "🚀",
        taskId: "story-level1-2",
        titleEnglish: "Maya's Space Robot",
        titleHebrew: "רובוט החלל של מיה",
        descriptionHebrew: "קראו על מיה והרובוט החכם שהיא בנתה לתחרות החלל.",
        targetUrl: "/unseen?passageId=story-level1-2",
      },
      {
        id: "adventure_nature",
        nameHebrew: "הרפתקאות וטבע",
        nameEnglish: "Adventures in Nature",
        emoji: "🌲",
        taskId: "story-level1-3",
        titleEnglish: "The Secret Treehouse",
        titleHebrew: "בית העץ הסודי",
        descriptionHebrew: "קראו על החברים שמגלים בית עץ סודי עמוק בתוך היער.",
        targetUrl: "/unseen?passageId=story-level1-3",
      },
      {
        id: "baking_food",
        nameHebrew: "אפייה ובישול",
        nameEnglish: "Baking & Food",
        emoji: "🥐",
        taskId: "story-level1-4",
        titleEnglish: "Leo the Little Baker",
        titleHebrew: "ליאו האופה הצעיר",
        descriptionHebrew: "קראו על ליאו שלומד לאפות עוגיות טעימות ומאפים מיוחדים.",
        targetUrl: "/unseen?passageId=story-level1-4",
      },
      {
        id: "ocean_marine",
        nameHebrew: "עולם הים ודולפינים",
        nameEnglish: "Marine Life & Reef",
        emoji: "🐬",
        taskId: "story-level1-5",
        titleEnglish: "A Day at Dolphin Reef",
        titleHebrew: "יום בריף הדולפינים",
        descriptionHebrew: "קראו על יום קסום בריף הדולפינים באילת ושחייה לצד דולפינים.",
        targetUrl: "/unseen?passageId=story-level1-5",
      },
    ];
  } else if (level === "Level 2") {
    return [
      {
        id: "desert_nature",
        nameHebrew: "מדבר ועצי הנגב",
        nameEnglish: "Desert & Ecology",
        emoji: "🏜️",
        taskId: "story-level2-1",
        titleEnglish: "The Negev Desert Tree",
        titleHebrew: "עץ השיטה בנגב",
        descriptionHebrew: "קראו על עצי השיטה הייחודיים השורדים את תנאי המדבר הקשים.",
        targetUrl: "/unseen?passageId=story-level2-1",
      },
      {
        id: "history_mystery",
        nameHebrew: "היסטוריה ותעלומות",
        nameEnglish: "History & Mystery",
        emoji: "🏛️",
        taskId: "story-level2-2",
        titleEnglish: "The Mystery of the Roman Coin",
        titleHebrew: "תעלומת המטבע הרומי",
        descriptionHebrew: "קראו על תגלית ארכיאולוגית מסתורית של מטבע רומי עתיק.",
        targetUrl: "/unseen?passageId=story-level2-2",
      },
      {
        id: "bees_ecology",
        nameHebrew: "דבורים ואקולוגיה",
        nameEnglish: "Honeybees & Nature",
        emoji: "🐝",
        taskId: "story-level2-3",
        titleEnglish: "The Great Honeybee Rescue",
        titleHebrew: "מבצע הצלת דבורי הדבש",
        descriptionHebrew: "קראו על החשיבות האקולוגית של דבורי הדבש והמאמץ להצילן.",
        targetUrl: "/unseen?passageId=story-level2-3",
      },
      {
        id: "heroism_rescue",
        nameHebrew: "גבורה וכלבי הצלה",
        nameEnglish: "Rescue & Heroism",
        emoji: "🐕",
        taskId: "story-level2-4",
        titleEnglish: "The Young Mountain Rescue Dog",
        titleHebrew: "כלב ההצלה הצעיר בהרים",
        descriptionHebrew: "קראו על כלב הצלה אמיץ שסייע לחלץ מטיילים בשלג.",
        targetUrl: "/unseen?passageId=story-level2-4",
      },
      {
        id: "solar_tech",
        nameHebrew: "מכוניות סולאריות ומדע",
        nameEnglish: "Solar Energy & Tech",
        emoji: "☀️",
        taskId: "story-level2-5",
        titleEnglish: "The Solar Car Challenge",
        titleHebrew: "אתגר מכונית השמש",
        descriptionHebrew: "קראו על תחרות הנדסית מרתקת לפיתוח רכבים המונעים מאנרגיית השמש.",
        targetUrl: "/unseen?passageId=story-level2-5",
      },
    ];
  } else {
    // Level 3
    return [
      {
        id: "whales_ocean",
        nameHebrew: "לווייתנים ומעמקי הים",
        nameEnglish: "Whales & Deep Ocean",
        emoji: "🐋",
        taskId: "story-level3-1",
        titleEnglish: "The Voice of the Whales",
        titleHebrew: "שירת הלווייתנים במעמקים",
        descriptionHebrew: "קראו על שיטות התקשורת המתוחכמות של לווייתנים באוקיינוס.",
        targetUrl: "/unseen?passageId=story-level3-1",
      },
      {
        id: "coral_science",
        nameHebrew: "שוניות אלמוגים ומדע",
        nameEnglish: "Coral Reefs & Science",
        emoji: "🪸",
        taskId: "story-level3-2",
        titleEnglish: "The Secrets of the Deep Coral Reefs",
        titleHebrew: "סודות שוניות האלמוגים העמוקות",
        descriptionHebrew: "קראו על מחקרים חדשים החושפים שוניות אלמוגים נסתרות במעמקים.",
        targetUrl: "/unseen?passageId=story-level3-2",
      },
      {
        id: "archaeology_rosetta",
        nameHebrew: "ארכיאולוגיה וכתב עתיק",
        nameEnglish: "Archaeology & Rosetta Stone",
        emoji: "📜",
        taskId: "story-level3-3",
        titleEnglish: "The Rediscovery of the Rosetta Stone",
        titleHebrew: "גילוי אבן הרוזטה מחדש",
        descriptionHebrew: "קראו על פענוח כתב החרטומים המצרי באמצעות אבן הרוזטה.",
        targetUrl: "/unseen?passageId=story-level3-3",
      },
      {
        id: "bionic_medicine",
        nameHebrew: "רפואה ואיברים ביוניים",
        nameEnglish: "Bionics & Medicine",
        emoji: "🦾",
        taskId: "story-level3-4",
        titleEnglish: "The Revolution of Bionic Prosthetics",
        titleHebrew: "מהפכת האיברים הביוניים",
        descriptionHebrew: "קראו על פריצות דרך ביו-רפואיות המאפשרות תנועה מדויקת באמצעות מחשבה.",
        targetUrl: "/unseen?passageId=story-level3-4",
      },
      {
        id: "mars_space",
        nameHebrew: "חקר מאדים ורובוטיקה",
        nameEnglish: "Mars Exploration & AI",
        emoji: "🚀",
        taskId: "story-level3-5",
        titleEnglish: "Autonomous Exploration of Mars",
        titleHebrew: "חקר מאדים בעזרת רובוטים אוטונומיים",
        descriptionHebrew: "קראו על הרובוטים האוטונומיים הסורקים את פני מאדים ומחפשים עדויות למים.",
        targetUrl: "/unseen?passageId=story-level3-5",
      },
    ];
  }
}

/**
 * Curated high-interest topics per level for Writing Workshop
 */
export function getWritingTopicsForLevel(level: TutorLevel): TaskTopicOption[] {
  if (level === "Level 1") {
    return [
      {
        id: "friends_letter",
        nameHebrew: "מכתב לחבר/ה",
        nameEnglish: "Note to a Friend",
        emoji: "💌",
        taskId: "task-letter-l1-1",
        titleEnglish: "A Sweet Note to a Friend",
        titleHebrew: "פתק קצר לחבר/ה: בוא נשחק!",
        descriptionHebrew: "כתבו פתק קצרצר לחבר/ה המזמין אותם לבוא לשחק יחד.",
        targetUrl: "/writing?task=task-letter-l1-1",
      },
      {
        id: "pets_opinion",
        nameHebrew: "חיות מחמד",
        nameEnglish: "Dogs or Cats",
        emoji: "🐶",
        taskId: "task-opinion-l1-3",
        titleEnglish: "Dogs or Cats: Which is Better?",
        titleHebrew: "כלבים או חתולים: מי חיית מחמד טובה יותר?",
        descriptionHebrew: "הסבירו איזו חיה אתם מעדיפים בתור חיית מחמד ומדוע.",
        targetUrl: "/writing?task=task-opinion-l1-3",
      },
      {
        id: "food_opinion",
        nameHebrew: "אוכל אהוב",
        nameEnglish: "Pizza or Ice Cream",
        emoji: "🍕",
        taskId: "task-opinion-l1-1",
        titleEnglish: "Pizza or Ice Cream?",
        titleHebrew: "מה עדיף: פיצה או גלידה?",
        descriptionHebrew: "כתבו מה המאכל שאתם הכי אוהבים ולמה.",
        targetUrl: "/writing?task=task-opinion-l1-1",
      },
      {
        id: "home_desc",
        nameHebrew: "החדר שלי",
        nameEnglish: "My Bedroom",
        emoji: "🏠",
        taskId: "task-desc-l1-1",
        titleEnglish: "My Bedroom",
        titleHebrew: "החדר שלי: המקום האהוב בבית",
        descriptionHebrew: "תארו את החדר שלכם והדברים האהובים עליכם בו.",
        targetUrl: "/writing?task=task-desc-l1-1",
      },
      {
        id: "birthday_card",
        nameHebrew: "כרטיס יום הולדת",
        nameEnglish: "Birthday Card",
        emoji: "🎂",
        taskId: "task-letter-l1-2",
        titleEnglish: "Happy Birthday Card",
        titleHebrew: "כרטיס ברכה ליום הולדת",
        descriptionHebrew: "כתבו ברכת יום הולדת משמחת עם איחולים חמים.",
        targetUrl: "/writing?task=task-letter-l1-2",
      },
    ];
  } else if (level === "Level 2") {
    return [
      {
        id: "tech_phones",
        nameHebrew: "סמארטפונים בביה\"ס",
        nameEnglish: "Smartphones in School",
        emoji: "📱",
        taskId: "task-opinion-l2-1",
        titleEnglish: "Smartphones in the Classroom",
        titleHebrew: "האם יש לאפשר סמארטפונים במהלך השיעור?",
        descriptionHebrew: "הביעו את עמדתכם לגבי שימוש בטלפונים ניידים בזמן שיעורים.",
        targetUrl: "/writing?task=task-opinion-l2-1",
      },
      {
        id: "summer_trip",
        nameHebrew: "חופשת הקיץ ונסיעות",
        nameEnglish: "Summer Vacation",
        emoji: "🏖️",
        taskId: "task-letter-l2-1",
        titleEnglish: "Summer Vacation Letter",
        titleHebrew: "מכתב לחבר על חופשת הקיץ",
        descriptionHebrew: "ספרו לחבר/ה על חוויות מהחופש הגדול ופעילויות מיוחדות.",
        targetUrl: "/writing?task=task-letter-l2-1",
      },
      {
        id: "sports_health",
        nameHebrew: "ספורט ובריאות",
        nameEnglish: "Sports & Health",
        emoji: "⚽",
        taskId: "task-opinion-l2-2",
        titleEnglish: "Daily Physical Education",
        titleHebrew: "האם שיעורי ספורט צריכים להיות חובה יומית?",
        descriptionHebrew: "כתבו דעה מנומקת על חשיבות הפעילות הגופנית לתלמידים.",
        targetUrl: "/writing?task=task-opinion-l2-2",
      },
      {
        id: "adventure_story",
        nameHebrew: "סיפור אישי והרפתקה",
        nameEnglish: "Personal Adventure",
        emoji: "🎒",
        taskId: "task-story-l2-1",
        titleEnglish: "The Strangest Day This Year",
        titleHebrew: "היום המוזר ביותר שקרה לי השנה",
        descriptionHebrew: "שתפו בסיפור קצר על יום מפתיע ויוצא דופן שחוויתם.",
        targetUrl: "/writing?task=task-story-l2-1",
      },
      {
        id: "favorite_pet",
        nameHebrew: "בעלי חיים וחיות מחמד",
        nameEnglish: "Favorite Pet",
        emoji: "🐾",
        taskId: "task-desc-l2-1",
        titleEnglish: "My Favorite Pet",
        titleHebrew: "חיית המחמד האהובה עליי",
        descriptionHebrew: "תארו חיית מחמד וכיצד מטפלים בה באהבה ובאחריות.",
        targetUrl: "/writing?task=task-desc-l2-1",
      },
    ];
  } else {
    // Level 3
    return [
      {
        id: "ai_future",
        nameHebrew: "בינה מלאכותית ועתיד",
        nameEnglish: "AI & Future of Work",
        emoji: "🤖",
        taskId: "task-opinion-l3-1",
        titleEnglish: "AI and the Future of Careers",
        titleHebrew: "האם בינה מלאכותית תשנה את מקצועות העתיד?",
        descriptionHebrew: "נתחו את השפעת הבינה המלאכותית על שוק העבודה והחברה.",
        targetUrl: "/writing?task=task-opinion-l3-1",
      },
      {
        id: "youth_community",
        nameHebrew: "אזרחות ומרכז נוער",
        nameEnglish: "Youth Community Center",
        emoji: "🏛️",
        taskId: "task-letter-l3-1",
        titleEnglish: "Formal Letter for a Youth Center",
        titleHebrew: "מכתב רשמי לראש העיר להקמת מרכז נוער",
        descriptionHebrew: "כתבו מכתב רשמי משכנע ומנומק לראש העיר עם הצעות לפעילות נוער.",
        targetUrl: "/writing?task=task-letter-l3-1",
      },
      {
        id: "green_spaces",
        nameHebrew: "איכות הסביבה ושטחים ירוקים",
        nameEnglish: "Urban Green Spaces",
        emoji: "🌳",
        taskId: "task-letter-l3-3",
        titleEnglish: "Protecting Urban Green Spaces",
        titleHebrew: "הגנה על השטחים הירוקים בעיר",
        descriptionHebrew: "כתבו מכתב למערכת עיתון הקורא לשמירה על הפארקים והטבע העירוני.",
        targetUrl: "/writing?task=task-letter-l3-3",
      },
      {
        id: "mentor_role_model",
        nameHebrew: "דמות מופת והשראה",
        nameEnglish: "Inspirational Role Model",
        emoji: "🏆",
        taskId: "task-desc-l3-1",
        titleEnglish: "An Inspirational Mentor",
        titleHebrew: "דמות מופת שהשפיעה על חיי",
        descriptionHebrew: "תארו דמות מיוחדת שמהווה עבורכם מודל לחיקוי והשראה.",
        targetUrl: "/writing?task=task-desc-l3-1",
      },
      {
        id: "social_media",
        nameHebrew: "רשתות חברתיות ונוער",
        nameEnglish: "Social Media & Connection",
        emoji: "📲",
        taskId: "task-opinion-l3-2",
        titleEnglish: "Social Media: Connection or Isolation?",
        titleHebrew: "רשתות חברתיות: מקרבות או מבודדות?",
        descriptionHebrew: "בחנו את שני הצדדים של הרשתות החברתיות בחיי בני הנוער בימינו.",
        targetUrl: "/writing?task=task-opinion-l3-2",
      },
    ];
  }
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

  return {
    ...currentMission,
    id: `mission-${currentMission.type}-${found.taskId}`,
    taskId: found.taskId,
    title: found.titleEnglish,
    hebrewTitle: found.titleHebrew,
    descriptionHebrew: found.descriptionHebrew || currentMission.descriptionHebrew,
    targetUrl: found.targetUrl,
    selectedTopicId: found.id,
    selectedTopicNameHebrew: found.nameHebrew,
  };
}

/**
 * Dynamically picks the next best assignment from the site's rich library,
 * providing students with curated topic options for reading & writing.
 */
export function generateNextMission(
  profile: StudentTutorProfile,
  preferredType?: "unseen" | "vocab" | "writing",
  preferredTopicId?: string
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
      selectedTopicId: chosenTopic.id,
      selectedTopicNameHebrew: chosenTopic.nameHebrew,
      availableTopics: topics,
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
      targetUrl: `/vocabulary?band=${encodeURIComponent(profile.vocabBand)}`,
      estimatedMinutes: 6,
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
      descriptionHebrew: `כתבו פסקה קצרה בנושא "${chosenTopic.titleHebrew}". השתמשו במילות הקישור ובבנק המילים המובנה בסדנה!`,
      level: level,
      taskId: chosenTopic.taskId,
      targetUrl: chosenTopic.targetUrl,
      estimatedMinutes: 15,
      selectedTopicId: chosenTopic.id,
      selectedTopicNameHebrew: chosenTopic.nameHebrew,
      availableTopics: topics,
    };
  }
}

/**
 * Called when an unseen or writing task is finished by the student.
 * Awards XP, updates skill mastery, updates streak, and returns David's reaction message.
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

  updated.currentMission = generateNextMission(updated);
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
