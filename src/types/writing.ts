export type WritingTaskType = "opinion" | "formal_letter" | "description";

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
