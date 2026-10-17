import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
import { MIDDLE_SCHOOL_UNSEENS } from "@/data/unseen-middle-school";
import { ALL_WRITING_TASKS } from "@/data/writing-tasks";
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
 * Generates David's warm initial English greeting that starts a natural conversation instead of a test.
 */
export function getInitialOnboardingGreeting(studentName: string): {
  text: string;
  quickReplies: string[];
} {
  return {
    text: `Hi ${studentName}! I'm David, your personal English tutor. Instead of a boring test, let's just chat in English for a minute so I can get to know you! First — what do you like doing in your free time? Do you enjoy sports, video games, music, animals, or something else?`,
    quickReplies: [
      "I like playing video games and sports",
      "I love listening to music and hanging out with friends",
      "I really enjoy animals and nature",
    ],
  };
}

/**
 * Generates David's natural English response for each turn of the 4-turn onboarding conversation.
 */
export function generateOnboardingTurnResponse(
  completedTurnIndex: number,
  studentReply: string,
  studentName: string
): {
  text: string;
  quickReplies?: string[];
} {
  const lower = studentReply.toLowerCase();

  // After Turn 0 (Student shared their hobbies/free time) -> Move to Turn 1 (Short story comprehension in conversation)
  if (completedTurnIndex === 0) {
    let hobbyReaction = `That sounds like a great way to spend your free time, ${studentName}!`;
    if (lower.includes("game") || lower.includes("gaming") || lower.includes("play")) {
      hobbyReaction = `Nice! Video games and sports are awesome ways to unwind, ${studentName}!`;
    } else if (lower.includes("music") || lower.includes("song") || lower.includes("sing") || lower.includes("dance")) {
      hobbyReaction = `I love music too, ${studentName}! It always puts me in a good mood.`;
    } else if (lower.includes("animal") || lower.includes("dog") || lower.includes("cat") || lower.includes("nature")) {
      hobbyReaction = `Animals and nature are amazing, ${studentName}!`;
    } else if (lower.includes("sport") || lower.includes("football") || lower.includes("soccer") || lower.includes("basketball")) {
      hobbyReaction = `Sports are fantastic for staying active and having fun, ${studentName}!`;
    }

    return {
      text: `${hobbyReaction}\n\nSpeaking of fun weekends, my cousin Leo tried to bake a chocolate cake for his mom's birthday yesterday. He accidentally used salt instead of sugar because the two jars looked identical! When everyone took a bite at the party, their faces turned bright red, and they ended up ordering pizza instead. 😄\n\nTell me in your own words — why did everyone's face turn red when they tasted Leo's cake, and what would you do if that happened at your party?`,
      quickReplies: [
        "Because he put salt instead of sugar! I would laugh and order pizza too.",
        "The cake tasted super salty! I would go buy ice cream instead.",
      ],
    };
  }

  // After Turn 1 (Student explained the salty cake story) -> Move to Turn 2 (Expressive 2-3 sentence prompt)
  if (completedTurnIndex === 1) {
    const mentionedSaltOrSugar =
      lower.includes("salt") ||
      lower.includes("sugar") ||
      lower.includes("salty") ||
      lower.includes("mistake") ||
      lower.includes("taste") ||
      lower.includes("bad");

    const storyReaction = mentionedSaltOrSugar
      ? `Haha, spot on! A mouthful of salty chocolate cake is definitely an unforgettable birthday surprise!`
      : `Haha, totally! At least pizza saved the birthday party in the end!`;

    return {
      text: `${storyReaction}\n\nNow I'm curious about your imagination, ${studentName}: if you could travel anywhere in the world tomorrow — or invent one cool gadget for your school — what would you choose and why? Write 2 or 3 sentences in English!`,
      quickReplies: [],
    };
  }

  // After Turn 2 (Student wrote 2-3 sentences about travel or an invention) -> Move to Turn 3 (Preferred focus)
  return {
    text: `I really enjoyed reading your idea, ${studentName}! One last question before we pick our first activity together: what do you feel you'd like to practice most with me right now — reading interesting stories, learning new vocabulary words, or writing in English?`,
    quickReplies: [
      "I'd like to practice reading stories",
      "I want to learn new vocabulary words",
      "I want to improve my writing in English",
      "Let's practice a bit of everything!",
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
      return {
        ...mission,
        id: `mission-writing-${matchingTask.id}`,
        taskId: matchingTask.id,
        level: targetLevel,
        title: matchingTask.title,
        hebrewTitle: matchingTask.hebrewTitle,
        descriptionHebrew: matchingTask.hebrewInstructions,
        targetUrl: `/writing?task=${matchingTask.id}&from=david`,
        availableTopics: freshTopics,
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
      return {
        ...mission,
        id: `mission-unseen-${matchingStory.id}`,
        taskId: matchingStory.id,
        level: targetLevel,
        title: matchingStory.title,
        hebrewTitle: matchingStory.hebrewTitle,
        descriptionHebrew: `קראו את קטע הקריאה "${matchingStory.hebrewTitle}" וענו על השאלות. דוד יעקוב אחר התשובות שלכם ויעניק לכם משוב!`,
        targetUrl: `/unseen?passageId=${matchingStory.id}&from=david`,
        availableTopics: freshTopics,
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

