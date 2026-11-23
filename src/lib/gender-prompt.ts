// How the AI routes address the student in Hebrew. Hebrew is gendered and
// student names are stored in English, so the model must never guess:
// the teacher sets the gender on the student profile, and unset means plural.
// Server-safe (no React, no Firebase).

import { isStudentGender, type StudentGender } from "@/types/auth";

/** Reads `gender` from a request body; null when absent or invalid. */
export function genderFromBody(body: { gender?: unknown } | null | undefined): StudentGender | null {
  const g = body?.gender;
  return isStudentGender(g) ? g : null;
}

const FORMS: Record<StudentGender | "neutral", string> = {
  male: 'Hebrew MASCULINE SINGULAR (e.g. "אתה", "כתבת", "הצלחת", "שים לב", "נסה", "תוכל", "כל הכבוד לך").',
  female: 'Hebrew FEMININE SINGULAR (e.g. "את", "כתבת", "הצלחת", "שימי לב", "נסי", "תוכלי", "כל הכבוד לך").',
  neutral:
    'Hebrew PLURAL form, which reads as neutral (e.g. "שימו לב", "נסו", "כתבתם", "תוכלו"). Do NOT use masculine or feminine singular forms, and never guess the gender from the student\'s name.',
};

/** Prompt block telling the model which grammatical gender to address the student in. */
export function hebrewAddressPrompt(gender: StudentGender | null): string {
  return `
HEBREW FORM OF ADDRESS (mandatory):
Whenever you address the student directly in Hebrew, use ${FORMS[gender ?? "neutral"]}
This applies to EVERY Hebrew string you write: encouragement, teacher notes, rubric comments, explanations, corrections and tips. Keep it consistent from start to finish.
`;
}
