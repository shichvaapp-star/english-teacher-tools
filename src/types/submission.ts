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
}

export interface SubmissionItem {
  id: string;
  type: "writing" | "unseen";
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  studentClass?: string;
  studentNote?: string;
  taskId: string;
  taskTitle: string;
  hebrewTitle: string;
  // Writing specific
  category?: string;
  essayText?: string;
  wordCount?: number;
  // Unseen specific
  storyLevel?: string;
  passageText?: string;
  questionsBreakdown?: SubmissionQuestionBreakdown[];
  // Grading & Feedback
  score?: number; // Auto-calculated score (e.g. 0-100)
  grade?: number; // Final teacher grade (0-100)
  teacherFeedback?: string;
  submittedAt: string;
  receiptCode: string;
  status: "submitted" | "reviewed";
  reviewedAt?: string;
}
