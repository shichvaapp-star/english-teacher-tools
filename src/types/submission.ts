import type { UnseenRubric } from "./unseen";

export interface SubmissionQuestionBreakdown {
  id: string;
  number: number;
  type: "mcq" | "open" | "copy";
  prompt: string;
  promptHebrew?: string;
  options?: string[];
  userAnswer?: string | number;
  correctAnswer?: string | number;
  isCorrect: boolean;
  targetSentence?: string;
  modelAnswer?: string;
  explanationHebrew?: string;
  points: number;
  maxPoints?: number;
  feedbackHebrew?: string; // Nuanced teacher feedback specifically on student's answer
}

export type SubmissionType = "writing" | "unseen" | "vocab";

export interface VocabPracticedWord {
  english: string;
  hebrew: string;
  partOfSpeech?: string;
  mastered: boolean;
}

export interface VocabPracticeSummary {
  totalWords: number;
  masteredCount: number;
  quizScore?: number;
  completedModes: string[];
  wordsPracticed: VocabPracticedWord[];
}

export interface SubmissionItem {
  id: string;
  type: SubmissionType;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  studentClass?: string;
  studentGroup?: string; // e.g. "א1" | "א2" | "ב"
  studentNote?: string;
  assignmentId?: string; // ID of the TeacherAssignment if submitted as part of one
  taskId: string;
  taskTitle: string;
  hebrewTitle: string;
  // Vocabulary specific
  vocabSummary?: VocabPracticeSummary;
  // Writing specific
  category?: string;
  essayText?: string;
  wordCount?: number;
  // Unseen specific
  storyLevel?: string;
  passageText?: string;
  generationPrompt?: string; // Prompt/topic used by the student to generate the unseen passage
  isAiGenerated?: boolean;
  questionsBreakdown?: SubmissionQuestionBreakdown[];
  // Unseen AI Evaluation Feedback
  encouragement?: string;
  teacherNote?: string;
  strengths?: string[];
  tips?: string[];
  unseenRubric?: UnseenRubric;
  // Writing AI Evaluation Feedback
  writingRubric?: any;
  corrections?: any[];
  vocabularyUpgrades?: any[];
  // Grading & Feedback
  score?: number; // Auto-calculated score (e.g. 0-100)
  grade?: number; // Final teacher grade (0-100)
  teacherFeedback?: string;
  submittedAt: string;
  receiptCode: string;
  status: "submitted" | "reviewed";
  reviewedAt?: string;
}

