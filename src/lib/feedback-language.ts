// Which language the AI writes its feedback in. Hebrew is the default; the
// teacher can ask for English feedback when grading.
// Server-safe (no React, no Firebase).

export type FeedbackLanguage = "he" | "en";

export function isFeedbackLanguage(value: unknown): value is FeedbackLanguage {
  return value === "he" || value === "en";
}

/** Reads `language` from a request body; Hebrew when absent or invalid. */
export function feedbackLanguageFromBody(body: { language?: unknown } | null | undefined): FeedbackLanguage {
  return isFeedbackLanguage(body?.language) ? body.language : "he";
}

/**
 * Prompt block that switches every feedback string to English. Goes at the very
 * end of the prompt so it overrides the Hebrew wording and examples above it.
 */
export function englishFeedbackPrompt(level: string): string {
  const style =
    level === "Level 1"
      ? "very short, very simple English (CEFR A1: short sentences, everyday words)"
      : level === "Level 3"
        ? "clear English a strong junior-high learner can follow (CEFR B1)"
        : "simple, clear English a junior-high learner can follow (CEFR A2: short sentences, common words)";
  return `
LANGUAGE OVERRIDE (highest priority, overrides everything above):
Write ALL feedback text in ${style}, NOT in Hebrew. This covers encouragement, teacherNote, strengths, tips, every "commentHebrew", every "explanationHebrew" and every "hebrewInterferenceNotes" item.
Keep the JSON keys exactly as named in the schema (a key such as "commentHebrew" still holds the English text).
Ignore any instruction or example above that asks for Hebrew. Address the student as "you". Do not use any Hebrew letters.`;
}
