import { LEVEL_1_UNSEENS } from "./unseen/level-1";
import { LEVEL_2_UNSEENS } from "./unseen/level-2";
import { LEVEL_3_UNSEENS } from "./unseen/level-3";

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

/**
 * Shuffles multiple-choice question options and balances correct answer positions across A (0), B (1), C (2), and D (3)
 * so questions don't have predictable answer keys or repetitive correct options.
 */
export function randomizeQuestionsOptions<T extends { type?: string; options?: string[]; correctIndex?: number }>(
  questions: T[]
): T[] {
  const mcqIndices: number[] = [];
  questions.forEach((q, idx) => {
    if (q.type === "mcq" && Array.isArray(q.options) && q.options.length >= 2) {
      mcqIndices.push(idx);
    }
  });

  if (mcqIndices.length === 0) return questions;

  // Create balanced target slots across 0..3 (A, B, C, D)
  const slots: number[] = [];
  for (let i = 0; i < mcqIndices.length; i++) {
    slots.push(i % 4);
  }
  // Shuffle the target slots using Fisher-Yates
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  let slotCounter = 0;
  return questions.map((q) => {
    if (q.type !== "mcq" || !Array.isArray(q.options) || q.options.length < 2) {
      return q;
    }

    const originalCorrectIndex =
      typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < q.options.length
        ? q.correctIndex
        : 0;

    const correctOptionText = q.options[originalCorrectIndex];
    // Filter distractors while preserving exact contents
    const distractors = q.options.filter((_, idx) => idx !== originalCorrectIndex);

    // Shuffle distractors
    for (let i = distractors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
    }

    // Assign target slot
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

export const MIDDLE_SCHOOL_UNSEENS: MSUnseenStory[] = [
  ...LEVEL_1_UNSEENS,
  ...LEVEL_2_UNSEENS,
  ...LEVEL_3_UNSEENS,
];

export { LEVEL_1_UNSEENS, LEVEL_2_UNSEENS, LEVEL_3_UNSEENS };
