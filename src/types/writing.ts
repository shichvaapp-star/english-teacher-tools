export type WritingTaskType = "opinion" | "formal_letter" | "description";
export type WritingLevel = "Level 1" | "Level 2" | "Level 3";
export type TaskCategory = "letter" | "opinion" | "description" | "creative";

export interface WordBankItem {
  word: string;
  hebrew: string;
  emoji?: string;
}

export interface GuidedStep {
  stepNumber: number;
  titleHebrew: string;
  starterPhrase: string;
  placeholder: string;
  helperHintHebrew: string;
}

export interface WritingTask {
  id: string;
  level: WritingLevel;
  /** Content grade (7/8/9): the textbook vocabulary it is written in. Missing on legacy content. */
  grade?: 7 | 8 | 9;
  /** Words outside the grade vocabulary that are deliberately used (names, glossed words). */
  allowWords?: string[];
  category: TaskCategory;
  title: string;
  hebrewTitle: string;
  prompt: string;
  hebrewInstructions: string;
  targetWords: string;
  minWords: number;
  maxWords: number;
  starterTips: string[];
  wordBank: WordBankItem[];
  sentenceStarters: string[];
  guidedSteps?: GuidedStep[];
  emoji?: string;
}

export interface WritingPrompt {
  id: string;
  title: string;
  module: "Module C" | "Module G";
  level: string; // e.g. "4 Points" or "5 Points"
  taskType: WritingTaskType;
  promptText: string;
  bulletPoints: string[];
  minWords: number;
  maxWords: number;
  tips: string[];
}

export interface WritingRubricScore {
  criterion: string;
  hebrewName: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface WritingEvaluationResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  wordCount: number;
  withinLimit: boolean;
  rubric: WritingRubricScore[];
  strengths: string[];
  grammarAlerts: string[];
  vocabularyUpgrades: {
    original: string;
    suggested: string;
    explanation: string;
  }[];
}
