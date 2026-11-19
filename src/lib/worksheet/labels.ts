// Labels and printed instructions for the worksheet maker (Hebrew for the
// wizard, English + optional Hebrew on paper).
import type { ClassGrade } from "@/lib/levels";
import type { GrammarExerciseType } from "@/types/grammar";
import type { ConversationQuestionType } from "@/types/conversation";
import type { PartKind, ReadingQuestionKind, VocabExerciseKind } from "@/lib/worksheet/types";

export const PART_LABEL: Record<PartKind, { he: string; en: string; exampleHe: string }> = {
  vocab: { he: "אוצר מילים", en: "Vocabulary", exampleHe: "התאמה, תרגום והשלמת משפטים ממילים של היחידה" },
  grammar: { he: "דקדוק", en: "Grammar", exampleHe: "תרגילים על זמנים, שאלות, שלילה ועוד" },
  reading: { he: "הבנת הנקרא", en: "Reading Comprehension", exampleHe: "קטע קריאה (אנסין) עם שאלות" },
  conversation: { he: "שיחה", en: "Conversation", exampleHe: "דיאלוג קצר מהחיים עם שאלות" },
  writing: { he: "כתיבה", en: "Writing", exampleHe: "משימת כתיבה עם בנק מילים ופתיחי משפטים" },
};

export const BOOK_NAME: Record<ClassGrade, string> = {
  7: "Teamwork",
  8: "New Directions Plus",
  9: "Mindset Plus",
};

export const VOCAB_KIND_LABEL: Record<VocabExerciseKind, { he: string; exampleHe: string }> = {
  match: { he: "התאמה בין מילה לתרגום", exampleHe: "apple ← → תפוח" },
  choose_meaning: { he: "בחירת הפירוש הנכון", exampleHe: "apple: (א) כלב (ב) תפוח (ג) בית" },
  gap_sentence: { he: "השלמת משפט ממסגרת מילים", exampleHe: "I eat an _____ every day." },
  to_hebrew: { he: "תרגום לעברית", exampleHe: "apple → ______" },
  to_english: { he: "תרגום לאנגלית", exampleHe: "תפוח → a______" },
};

export const VOCAB_TASK_LINE: Record<VocabExerciseKind, { en: string; he: string }> = {
  match: { en: "Match each word to its meaning. Write the letter.", he: "התאימו לכל מילה את הפירוש שלה. כתבו את האות." },
  choose_meaning: { en: "Circle the correct meaning.", he: "הקיפו את הפירוש הנכון." },
  gap_sentence: { en: "Complete the sentences with words from the box.", he: "השלימו את המשפטים במילים מהמסגרת." },
  to_hebrew: { en: "Write the word in Hebrew.", he: "כתבו את המילה בעברית." },
  to_english: { en: "Write the word in English.", he: "כתבו את המילה באנגלית." },
};

/** Hebrew help line for the printed grammar instructions. */
export const GRAMMAR_TASK_LINE_HE: Record<GrammarExerciseType, string> = {
  mcq: "הקיפו את התשובה הנכונה.",
  gap_bank: "השלימו במילה מהמסגרת.",
  gap_type: "כתבו את הפועל שבסוגריים בצורה הנכונה.",
  unscramble: "סדרו את המילים למשפט נכון.",
  find_fix: "מצאו את הטעות ותקנו אותה.",
  transform: "כתבו את המשפט מחדש לפי ההוראה.",
  sort: "כתבו כל אחד בקבוצה הנכונה.",
  match_halves: "התאימו בין תחילת המשפט לסופו.",
  cloze_text: "השלימו את הטקסט בפעלים בצורה הנכונה.",
  write_own: "כתבו משפטים משלכם.",
};

/** Paper-friendly Hebrew names of the grammar exercise types (for the wizard). */
export const GRAMMAR_TYPE_LABEL: Record<GrammarExerciseType, { he: string; exampleHe: string }> = {
  mcq: { he: "בחירת התשובה הנכונה", exampleHe: "She ___ to school. (go / goes)" },
  gap_bank: { he: "השלמה ממסגרת מילים", exampleHe: "[ is / are ]  They ___ happy." },
  gap_type: { he: "כתיבת הפועל בצורה הנכונה", exampleHe: "He ______ (play) football." },
  unscramble: { he: "סידור מילים למשפט", exampleHe: "school / I / to / go" },
  find_fix: { he: "מציאת טעות ותיקון", exampleHe: "She go to school." },
  transform: { he: "כתיבת משפט מחדש", exampleHe: "He plays. → (שלילה)" },
  sort: { he: "מיון לקבוצות", exampleHe: "[ a ] [ an ] ← apple, car" },
  match_halves: { he: "התאמת חצאי משפטים", exampleHe: "1. If it rains… / A. …we stay home." },
  cloze_text: { he: "השלמת טקסט קצר", exampleHe: "Yesterday I (1) ____ (go)…" },
  write_own: { he: "כתיבת משפטים משלכם", exampleHe: "כתבו 3 משפטים על…" },
};

export const READING_KIND_LABEL: Record<ReadingQuestionKind | ConversationQuestionType, { he: string; en: string }> = {
  mcq: { he: "שאלות אמריקאיות (בחירה)", en: "Multiple choice" },
  open: { he: "שאלות פתוחות", en: "Open questions" },
  copy: { he: "העתקת משפט מהטקסט", en: "Copy the sentence" },
  reply_mcq: { he: "מה הייתם עונים? (בחירה)", en: "What would you say? (choose)" },
  reply_open: { he: "מה הייתם עונים? (כתיבה)", en: "What would you say? (write)" },
};

export const READING_TASK_LINE = { en: "Read the text and answer the questions.", he: "קראו את הטקסט וענו על השאלות." };
export const CONVERSATION_TASK_LINE = {
  en: "Read the conversation and answer the questions.",
  he: "קראו את השיחה וענו על השאלות.",
};

export const PART_LETTERS = ["A", "B", "C", "D", "E"];
export const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
