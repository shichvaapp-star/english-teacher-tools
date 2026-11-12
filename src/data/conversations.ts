import {
  ConversationScenario,
  ConversationCategory,
  ConversationQuestion,
} from "@/types/conversation";
import { LEVEL_1_CONVERSATIONS } from "./conversations/level-1";
import { LEVEL_2_CONVERSATIONS } from "./conversations/level-2";
import { LEVEL_3_CONVERSATIONS } from "./conversations/level-3";

export { LEVEL_1_CONVERSATIONS } from "./conversations/level-1";
export { LEVEL_2_CONVERSATIONS } from "./conversations/level-2";
export { LEVEL_3_CONVERSATIONS } from "./conversations/level-3";

export const CONVERSATION_CATEGORIES: {
  id: ConversationCategory | "all";
  labelEnglish: string;
  labelHebrew: string;
  emoji: string;
}[] = [
  { id: "all", labelEnglish: "All Scenarios", labelHebrew: "כל התרחישים", emoji: "🌍" },
  { id: "travel", labelEnglish: "Travel & Directions", labelHebrew: "טיולים, שדה תעופה והתמצאות", emoji: "✈️" },
  { id: "food", labelEnglish: "Food & Restaurants", labelHebrew: "מסעדות, בתי קפה והזמנת אוכל", emoji: "🍔" },
  { id: "shopping", labelEnglish: "Shopping & Money", labelHebrew: "קניות, החזרות וחנויות", emoji: "🛍️" },
  { id: "school_social", labelEnglish: "Friends & School", labelHebrew: "חברים, בית ספר ועבודת צוות", emoji: "🤝" },
  { id: "health", labelEnglish: "Health & Pharmacy", labelHebrew: "בריאות, מרפאה ובית מרקחת", emoji: "🩺" },
  { id: "tech_daily", labelEnglish: "Tech & Daily Life", labelHebrew: "טכנולוגיה, תמיכה ויומיום", emoji: "📱" },
];

/**
 * Shuffles multiple-choice options ('mcq' and 'reply_mcq') and balances correct answer slots across A, B, C, D.
 */
export function randomizeConversationQuestionsOptions(
  questions: ConversationQuestion[]
): ConversationQuestion[] {
  const mcqIndices: number[] = [];
  questions.forEach((q, idx) => {
    if ((q.type === "mcq" || q.type === "reply_mcq") && Array.isArray(q.options) && q.options.length >= 2) {
      mcqIndices.push(idx);
    }
  });

  if (mcqIndices.length === 0) return questions;

  const slots: number[] = [];
  for (let i = 0; i < mcqIndices.length; i++) {
    slots.push(i % 4);
  }
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  let slotCounter = 0;
  return questions.map((q) => {
    if ((q.type !== "mcq" && q.type !== "reply_mcq") || !Array.isArray(q.options) || q.options.length < 2) {
      return q;
    }

    const originalCorrectIndex =
      typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < q.options.length
        ? q.correctIndex
        : 0;

    const correctOptionText = q.options[originalCorrectIndex];
    const distractors = q.options.filter((_, idx) => idx !== originalCorrectIndex);

    for (let i = distractors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
    }

    const targetSlot = Math.min(slots[slotCounter++], q.options.length - 1);
    const newOptions: string[] = [];
    let distractorIdx = 0;
    for (let pos = 0; pos < q.options.length; pos++) {
      if (pos === targetSlot) {
        newOptions.push(correctOptionText);
      } else {
        newOptions.push(distractors[distractorIdx++] || "");
      }
    }

    return {
      ...q,
      options: newOptions,
      correctIndex: targetSlot,
    };
  });
}

export const REAL_LIFE_CONVERSATIONS: ConversationScenario[] = [
  ...LEVEL_1_CONVERSATIONS,
  ...LEVEL_2_CONVERSATIONS,
  ...LEVEL_3_CONVERSATIONS,
];
