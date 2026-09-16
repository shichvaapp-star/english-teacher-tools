export type BagrutModule =
  | "Module A"
  | "Module B"
  | "Module C"
  | "Module D"
  | "Module E"
  | "Module F"
  | "Module G";

export type QuestionType = "multiple_choice" | "open_ended" | "sentence_completion";

export interface UnseenQuestion {
  id: string;
  number: number;
  paragraphRef?: number; // e.g. "According to paragraph 2..."
  type: QuestionType;
  prompt: string;
  options?: string[]; // 4 options for multiple choice
  correctOptionIndex?: number; // 0-3
  modelAnswer?: string; // For open-ended questions
  keywordsRequired?: string[]; // Important keywords for automated grading
  points: number;
}

export interface UnseenPassage {
  id: string;
  title: string;
  module: BagrutModule;
  levelDescription: string; // e.g. "4-5 Points (CEFR B2)"
  paragraphs: string[];
  wordCount: number;
  questions: UnseenQuestion[];
  totalPoints: number;
  targetBands?: ("Band I" | "Band II" | "Band III")[];
}

export interface StudentAnswers {
  [questionId: string]: string | number;
}

export interface UnseenEvaluationResult {
  score: number;
  maxScore: number;
  percentage: number;
  breakdown: {
    questionId: string;
    questionNumber: number;
    isCorrect: boolean;
    earnedPoints: number;
    maxPoints: number;
    feedback: string;
    studentAnswer: string | number;
    correctAnswer: string;
  }[];
}
