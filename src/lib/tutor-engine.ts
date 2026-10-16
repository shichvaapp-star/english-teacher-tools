import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  StudentTutorProfile,
  TutorLevel,
  VocabBandLevel,
  TutorTaskRecommendation,
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
 * Dynamically picks the next best assignment from the site's rich library
 */
export function generateNextMission(profile: StudentTutorProfile): TutorTaskRecommendation {
  const { reading, vocabulary, writing } = profile.skills;
  const level = profile.level;

  // Find lowest skill
  if (reading <= vocabulary && reading <= writing) {
    // Recommend Unseen
    const candidateUnseens = MIDDLE_SCHOOL_UNSEENS.filter((u) => u.level === level);
    const chosen = candidateUnseens.length > 0
      ? candidateUnseens[Math.floor(Math.random() * candidateUnseens.length)]
      : MIDDLE_SCHOOL_UNSEENS[0];

    return {
      id: `mission-unseen-${chosen.id}`,
      type: "unseen",
      title: chosen.title,
      hebrewTitle: chosen.hebrewTitle,
      descriptionHebrew: `קראו את קטע הקריאה "${chosen.hebrewTitle}" וענו על השאלות. דוד יעקוב אחר התשובות שלכם ויעניק לכם משוב!`,
      level: level,
      taskId: chosen.id,
      targetUrl: `/unseen?story=${chosen.id}`,
      estimatedMinutes: 12,
    };
  } else if (vocabulary <= writing) {
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
    const candidateTasks = ALL_WRITING_TASKS.filter((t) => t.level === level);
    const chosen = candidateTasks.length > 0
      ? candidateTasks[Math.floor(Math.random() * candidateTasks.length)]
      : ALL_WRITING_TASKS[0];

    return {
      id: `mission-writing-${chosen.id}`,
      type: "writing",
      title: chosen.title,
      hebrewTitle: chosen.hebrewTitle,
      descriptionHebrew: `כתבו פסקה קצרה בנושא "${chosen.hebrewTitle}". השתמשו במילות הקישור ובבנק המילים המובנה בסדנה!`,
      level: level,
      taskId: chosen.id,
      targetUrl: `/writing?task=${chosen.id}`,
      estimatedMinutes: 15,
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
