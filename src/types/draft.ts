import type { ConversationScenario } from "./conversation";
import type { MSUnseenStory } from "@/data/unseen-middle-school";
import type { WritingTask } from "./writing";

export type WorkType = "unseen" | "writing" | "vocab" | "conversation";

export interface ConversationDraftPayload {
  scenarioId: string;
  level: "Level 1" | "Level 2" | "Level 3";
  mode: "practice" | "graded";
  userAnswers: Record<string, string | number>;
  checkedQuestions?: Record<string, boolean>;
  activeQuestionIndex?: number;
  scenarioData?: ConversationScenario;
  aiScenarioData?: ConversationScenario;
}

export interface UnseenDraftPayload {
  storyId: string;
  level: "Level 1" | "Level 2" | "Level 3";
  mode: "practice" | "graded";
  userAnswers: Record<string, string | number>;
  checkedQuestions?: Record<string, boolean>;
  activeQuestionIndex?: number;
  storyData?: MSUnseenStory;
  aiStoryData?: MSUnseenStory;
}

export interface WritingDraftPayload {
  taskId: string;
  writingLevel: string;
  essayText: string;
  taskData?: WritingTask;
  customTopic?: {
    prompt: string;
    hebrewPrompt?: string;
  };
}

export type VocabCategory = "saved" | "grade7" | "grade8" | "grade9" | "assignment";
export type VocabStudyMode = "match" | "flashcards" | "quiz" | "bank";

export interface VocabDraftPayload {
  category: VocabCategory;
  studyMode: VocabStudyMode;
  cardIndex?: number;
  masteredIds?: string[];
  quizIndex?: number;
  quizScore?: number;
  completedModes?: string[];
}

export interface InProgressWorkItem {
  id: string; // e.g. "draft_unseen_story-1" or "draft_writing_task-3"
  type: WorkType;
  studentId: string; // user id or "guest"
  studentName?: string;
  title: string;
  hebrewTitle: string;
  lastUpdated?: string; // ISO date string
  progressPercent: number; // 0 - 100
  summaryText: string; // e.g., "3 מתוך 5 שאלות נענו" or "140 מילים נכתבו"
  resumeUrl: string; // e.g., "/unseen?story=story-1&draft=true"
  assignmentId?: string; // Optional link to a teacher assignment
  payload: UnseenDraftPayload | WritingDraftPayload | VocabDraftPayload | ConversationDraftPayload;
}
