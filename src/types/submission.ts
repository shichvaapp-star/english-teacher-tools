import type { UnseenRubric } from "./unseen";
import type { ConversationRubric, ConversationQuestionType } from "./conversation";
import type { WritingEvaluationResult, WritingCorrection, VocabularyUpgrade } from "@/app/api/evaluate-writing/route";

export interface SubmissionQuestionBreakdown {
  id: string;
  number: number;
  type: "mcq" | "open" | "copy" | ConversationQuestionType;
  prompt: string;
  promptHebrew?: string;
  situationContext?: string;
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

export type SubmissionType = "writing" | "unseen" | "vocab" | "conversation" | "grammar" | "exam";

/** A lab test / quiz result released by the teacher (no answer key inside). */
export interface ExamResultSummary {
  examId: string;
  kind: "test" | "quiz";
  parts: { title: string; type: "writing" | "unseen" | "vocab" | "grammar"; earned: number; points: number }[];
}

export interface GrammarSubmissionEntry {
  itemId: string;
  topicId: string;
  exerciseType: string;
  /** The task as plain text (sentence with ___, source sentence, etc.). */
  prompt: string;
  studentAnswer: string;
  expected: string;
  /** 0..1 after hint penalty. */
  points: number;
  isCorrect: boolean;
  usedHint: boolean;
  /** Not decided automatically – the teacher should look. */
  needsReview: boolean;
  feedbackHebrew?: string;
  /** Graded (or re-graded) by the AI grading agent. */
  aiGraded?: boolean;
}

export interface GrammarSubmissionSummary {
  topicIds: string[];
  level: 1 | 2 | 3;
  grade?: 7 | 8 | 9;
  totalItems: number;
  correctItems: number;
  entries: GrammarSubmissionEntry[];
}

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

/** Set on writing submissions that came from a lab exam. */
export interface ExamSubmissionInfo {
  examId: string;
  variantKey: string;
  prompt: string;
  minWords: number;
  maxWords: number;
  minVocabUsed: number;
  vocabTotal: number;
  vocabUsed: { english: string; hebrew: string }[];
  /** Times the exam locked (left the screen, paste…) and other logged warnings. */
  locks: number;
  flags: number;
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
  // Grammar specific
  grammarSummary?: GrammarSubmissionSummary;
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
  conversationRubric?: ConversationRubric;
  // Writing AI Evaluation Feedback
  writingRubric?: WritingEvaluationResult["rubric"];
  corrections?: WritingCorrection[];
  vocabularyUpgrades?: VocabularyUpgrade[];
  // Grading & Feedback
  score?: number; // Auto-calculated score (e.g. 0-100)
  grade?: number; // Final teacher grade (0-100)
  teacherFeedback?: string;
  submittedAt: string;
  receiptCode: string;
  status: "submitted" | "reviewed" | "completed";
  mode?: "practice" | "graded";
  reviewedAt?: string;
  examInfo?: ExamSubmissionInfo;
  examSummary?: ExamResultSummary;
}

