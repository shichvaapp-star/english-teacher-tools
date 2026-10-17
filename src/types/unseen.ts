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

export interface MSUnseenQuestion {
  id: string;
  number: number;
  paragraphIndex: number;
  linesHint?: string;
  type: "mcq" | "open" | "copy";
  prompt: string;
  options?: string[];
  correctIndex?: number;
  targetSentence?: string;
  modelAnswer?: string;
  keywords?: string[];
  explanationHebrew: string;
  points: number;
}

export interface MSUnseenStory {
  id: string;
  title: string;
  hebrewTitle: string;
  level: "Level 1" | "Level 2" | "Level 3";
  levelLabel: string;
  levelDescription: string;
  paragraphs: string[];
  vocabularyHints: { word: string; translation: string }[];
  questions: MSUnseenQuestion[];
  totalPoints: number;
  generationPrompt?: string;
  isAiGenerated?: boolean;
}

export interface UnseenRubricCategory {
  score: number;
  max: number;
  commentHebrew: string;
}

export interface UnseenRubric {
  explicitDetails: UnseenRubricCategory; // max 35 (איתור פרטים מפורשים בטקסט)
  inferenceAndContext: UnseenRubricCategory; // max 25 (הסקת מסקנות ורמזי הקשר)
  globalUnderstanding: UnseenRubricCategory; // max 25 (הבנה כוללת ורעיון מרכזי)
  languageAndAccuracy: UnseenRubricCategory; // max 15 (דיוק בהעתקת משפטים וניסוח)
}

export interface UnseenQuestionEvaluation {
  id: string;
  number: number;
  type: "mcq" | "open" | "copy";
  prompt: string;
  userAnswer?: string | number;
  correctAnswer?: string | number;
  isCorrect: boolean;
  points: number; // 0 to 10
  maxPoints: number; // 10
  feedbackHebrew?: string; // Specific AI teacher feedback on student's answer
  explanationHebrew?: string;
  targetSentence?: string;
  modelAnswer?: string;
  options?: string[];
}

export interface UnseenEvaluationResult {
  score: number;
  maxScore?: number;
  percentage?: number;
  encouragement: string;
  teacherNote?: string;
  strengths: string[];
  tips: string[];
  rubric: UnseenRubric;
  breakdown: UnseenQuestionEvaluation[];
}

