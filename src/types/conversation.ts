export type ConversationCategory =
  | "travel"        // Airport, hotel, directions, public transit
  | "food"          // Ordering at a café/restaurant, dietary needs, bill
  | "shopping"      // Returning an item, asking for sizes/prices, tech store
  | "school_social" // Group projects, making plans, resolving misunderstandings
  | "health"        // Doctor's visit, pharmacy, explaining symptoms
  | "tech_daily";   // Customer support, Wi-Fi/phone trouble, everyday errands

export interface DialogueSpeaker {
  id: string;              // e.g. "speaker_a", "speaker_b"
  name: string;            // e.g. "Maya", "Liam"
  role: string;            // e.g. "Customer", "Barista"
  avatarEmoji: string;     // e.g. "🧳", "☕"
  genderHint?: "female" | "male";
  colorTheme: "sky" | "emerald" | "amber" | "purple";
}

export interface DialogueTurn {
  index: number;           // 0-based turn index (Line 1 = index 0)
  speakerId: string;
  text: string;            // 100% English spoken turn
  stageDirection?: string; // Optional brief context e.g. "(looking at the menu)"
}

export type ConversationQuestionType =
  | "mcq"         // Multiple-choice comprehension / tone / idiom meaning
  | "copy"        // Copy the exact line from a speaker that shows...
  | "open"        // Open-ended comprehension in student's own words
  | "reply_mcq"   // "What would you say?" — Choose the most natural/polite response
  | "reply_open"; // "What would you say?" — Write a natural 1–2 sentence spoken response

export interface ConversationQuestion {
  id: string;
  number: number;          // 1 to 10
  turnRefIndex: number;    // References specific dialogue line (0-based) or -1 for whole dialogue
  linesHint: string;       // e.g. "Line 2" or "Lines 3–4" or "Whole Conversation"
  type: ConversationQuestionType;
  prompt: string;          // English question prompt
  situationContext?: string; // For reply_mcq / reply_open: e.g. "Imagine you are Maya and the waiter brings the wrong drink."
  options?: string[];      // 4 options for mcq / reply_mcq
  correctIndex?: number;   // 0–3
  targetSentence?: string; // Exact line or sentence for 'copy'
  modelAnswer?: string;    // Sample answer or natural spoken reply
  keywords?: string[];     // Expected keywords or functional words
  explanationHebrew: string;
  points: number;          // 10 points each (total 100)
}

export interface UsefulConversationPhrase {
  phrase: string;
  translation: string;
  usageNoteHebrew?: string;
}

export interface ConversationScenario {
  id: string;
  title: string;
  hebrewTitle: string;
  category: ConversationCategory;
  categoryLabelHebrew: string;
  settingDescription: string; // e.g. "Maya is ordering lunch and a drink at a busy café in London."
  level: "Level 1" | "Level 2" | "Level 3";
  levelLabel: string;
  levelDescription: string;
  speakers: DialogueSpeaker[];
  turns: DialogueTurn[];
  usefulPhrases: UsefulConversationPhrase[];
  questions: ConversationQuestion[];
  totalPoints: number;
  generationPrompt?: string;
  isAiGenerated?: boolean;
}

export interface ConversationRubricCategory {
  score: number;
  max: number;
  commentHebrew: string;
}

export interface ConversationRubric {
  explicitDetails: ConversationRubricCategory;       // max 30 (הבנת פרטי השיחה והתרחיש)
  inferenceAndPragmatics: ConversationRubricCategory; // max 25 (הבנת כוונת הדובר, טון וביטויים מהחיים)
  realLifeResponse: ConversationRubricCategory;       // max 30 (תגובה טבעית, מנומסת ומתאימה לסיטואציה)
  languageAndAccuracy: ConversationRubricCategory;    // max 15 (דיוק לשוני והעתקת משפטים מהשיחה)
}

export interface ConversationQuestionEvaluation {
  id: string;
  number: number;
  type: ConversationQuestionType;
  prompt: string;
  situationContext?: string;
  userAnswer?: string | number;
  correctAnswer?: string | number;
  isCorrect: boolean;
  points: number;    // 0 to 10
  maxPoints: number; // 10
  feedbackHebrew?: string;
  explanationHebrew?: string;
  targetSentence?: string;
  modelAnswer?: string;
  options?: string[];
}

export interface ConversationEvaluationResult {
  score: number;
  maxScore?: number;
  percentage?: number;
  encouragement: string;
  teacherNote?: string;
  strengths: string[];
  tips: string[];
  rubric: ConversationRubric;
  breakdown: ConversationQuestionEvaluation[];
}
