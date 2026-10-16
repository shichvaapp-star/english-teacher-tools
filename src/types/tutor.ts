export type TutorLevel = "Level 1" | "Level 2" | "Level 3";
export type VocabBandLevel = "Band I" | "Band II" | "Band III";

export interface SkillMastery {
  reading: number; // 0 - 100
  vocabulary: number; // 0 - 100
  writing: number; // 0 - 100
}

export interface TaskTopicOption {
  id: string;
  nameHebrew: string;
  nameEnglish: string;
  emoji: string;
  taskId: string;
  titleHebrew: string;
  titleEnglish: string;
  descriptionHebrew?: string;
  targetUrl: string;
}

export interface TutorTaskRecommendation {
  id: string;
  type: "unseen" | "vocab" | "writing";
  title: string;
  hebrewTitle: string;
  descriptionHebrew: string;
  level: TutorLevel;
  taskId?: string;
  targetUrl: string;
  estimatedMinutes: number;
  selectedTopicId?: string;
  selectedTopicNameHebrew?: string;
  availableTopics?: TaskTopicOption[];
}

export interface StudentTutorProfile {
  studentId: string;
  studentName: string;
  level: TutorLevel;
  vocabBand: VocabBandLevel;
  skills: SkillMastery;
  streakDays: number;
  totalTasksCompleted: number;
  lastActiveDate: string;
  diagnosticCompleted: boolean;
  strengths: string[];
  weaknesses: string[];
  currentMission?: TutorTaskRecommendation;
  historySummary?: {
    unseensCompleted: number;
    avgUnseenScore: number;
    wordsLearned: number;
    essaysWritten: number;
    avgWritingScore: number;
  };
}

export interface TutorMessage {
  id: string;
  sender: "tutor" | "student" | "system";
  text: string;
  timestamp: string;
  quickReplies?: string[];
  taskRecommendation?: TutorTaskRecommendation;
  diagnosticQuestion?: {
    step: number;
    totalSteps: number;
    question: string;
    questionHebrew?: string;
    options: { text: string; textHebrew?: string; value: string }[];
  };
}

export interface DiagnosticAnswer {
  questionIndex: number;
  selectedOption: string;
}
