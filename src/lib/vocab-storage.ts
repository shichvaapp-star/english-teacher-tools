import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

export interface VocabItem {
  id: string;
  english: string;
  hebrew: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb" | "phrase";
  example?: string;
  level?: "Easy" | "Medium" | "Hard" | "Saved from Unseen";
  mastered?: boolean;
  addedAt: string;
}

export const MIDDLE_SCHOOL_EASY: VocabItem[] = [
  { id: "e-1", english: "choose", hebrew: "לבחור", partOfSpeech: "verb", example: "Please choose your favorite color.", level: "Easy", addedAt: "2026-01-01" },
  { id: "e-2", english: "simple", hebrew: "פשוט", partOfSpeech: "adjective", example: "The English homework was very simple.", level: "Easy", addedAt: "2026-01-01" },
  { id: "e-3", english: "understand", hebrew: "להבין", partOfSpeech: "verb", example: "Do you understand this question?", level: "Easy", addedAt: "2026-01-01" },
  { id: "e-4", english: "always", hebrew: "תמיד", partOfSpeech: "adverb", example: "She always reads books before bed.", level: "Easy", addedAt: "2026-01-01" },
  { id: "e-5", english: "garden", hebrew: "גינה", partOfSpeech: "noun", example: "There are beautiful flowers in the garden.", level: "Easy", addedAt: "2026-01-01" },
  { id: "e-6", english: "friend", hebrew: "חבר", partOfSpeech: "noun", example: "A good friend is always helpful.", level: "Easy", addedAt: "2026-01-01" },
  { id: "e-7", english: "learn", hebrew: "ללמוד", partOfSpeech: "verb", example: "It is fun to learn new words in English.", level: "Easy", addedAt: "2026-01-01" },
  { id: "e-8", english: "travel", hebrew: "לנסוע, לטייל", partOfSpeech: "verb", example: "They like to travel to new places.", level: "Easy", addedAt: "2026-01-01" },
  { id: "e-9", english: "practice", hebrew: "לתרגל, תרגול", partOfSpeech: "verb", example: "You must practice English every day to get better.", level: "Easy", addedAt: "2026-01-01" },
  { id: "e-10", english: "happy", hebrew: "שמח", partOfSpeech: "adjective", example: "He was very happy to see his friends.", level: "Easy", addedAt: "2026-01-01" },
];

export const MIDDLE_SCHOOL_MEDIUM: VocabItem[] = [
  { id: "m-1", english: "challenge", hebrew: "אתגר, לאתגר", partOfSpeech: "noun", example: "Learning English is a fun challenge.", level: "Medium", addedAt: "2026-01-01" },
  { id: "m-2", english: "opportunity", hebrew: "הזדמנות", partOfSpeech: "noun", example: "Every day is a new opportunity to learn.", level: "Medium", addedAt: "2026-01-01" },
  { id: "m-3", english: "improve", hebrew: "לשפר, להשתפר", partOfSpeech: "verb", example: "Reading books is the best way to improve.", level: "Medium", addedAt: "2026-01-01" },
  { id: "m-4", english: "discover", hebrew: "לגלות", partOfSpeech: "verb", example: "Scientists want to discover new planets.", level: "Medium", addedAt: "2026-01-01" },
  { id: "m-5", english: "connection", hebrew: "חיבור, קשר", partOfSpeech: "noun", example: "There is a strong connection between health and exercise.", level: "Medium", addedAt: "2026-01-01" },
  { id: "m-6", english: "describe", hebrew: "לתאר", partOfSpeech: "verb", example: "Can you describe the character in the story?", level: "Medium", addedAt: "2026-01-01" },
  { id: "m-7", english: "behavior", hebrew: "התנהגות", partOfSpeech: "noun", example: "Polite behavior is appreciated everywhere.", level: "Medium", addedAt: "2026-01-01" },
  { id: "m-8", english: "succeed", hebrew: "להצליח", partOfSpeech: "verb", example: "If you work hard, you will succeed.", level: "Medium", addedAt: "2026-01-01" },
];

export const MIDDLE_SCHOOL_HARD: VocabItem[] = [
  { id: "h-1", english: "accomplish", hebrew: "להשיג, להשלים בהצלחה", partOfSpeech: "verb", example: "You can accomplish great things with hard work.", level: "Hard", addedAt: "2026-01-01" },
  { id: "h-2", english: "determine", hebrew: "לקבוע, להחליט", partOfSpeech: "verb", example: "Your attitude determines your direction.", level: "Hard", addedAt: "2026-01-01" },
  { id: "h-3", english: "significant", hebrew: "משמעותי, בעל ערך", partOfSpeech: "adjective", example: "This is a significant discovery for the team.", level: "Hard", addedAt: "2026-01-01" },
  { id: "h-4", english: "influence", hebrew: "להשפיע; השפעה", partOfSpeech: "verb", example: "Good books can influence your thoughts.", level: "Hard", addedAt: "2026-01-01" },
  { id: "h-5", english: "essential", hebrew: "חיוני, הכרחי", partOfSpeech: "adjective", example: "Vocabulary is essential for communication.", level: "Hard", addedAt: "2026-01-01" },
  { id: "h-6", english: "acquire", hebrew: "לרכוש (ידע או מיומנות)", partOfSpeech: "verb", example: "It takes time to acquire a second language.", level: "Hard", addedAt: "2026-01-01" },
  { id: "h-7", english: "consequence", hebrew: "תוצאה, השלכה", partOfSpeech: "noun", example: "Every action has a natural consequence.", level: "Hard", addedAt: "2026-01-01" },
];

const STORAGE_KEY = "bg_saved_vocab_words";

export function loadSavedWords(userId?: string): VocabItem[] {
  if (typeof window === "undefined") return [];
  try {
    const key = userId ? `${STORAGE_KEY}_${userId}` : `${STORAGE_KEY}_guest`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWordToBuilder(
  word: { english: string; hebrew: string; partOfSpeech?: string; example?: string },
  userId?: string
): { added: boolean; item: VocabItem } {
  if (typeof window === "undefined") {
    const pos = (word.partOfSpeech === "verb" || word.partOfSpeech === "adjective" || word.partOfSpeech === "adverb" || word.partOfSpeech === "phrase")
      ? word.partOfSpeech
      : "noun";

    const item: VocabItem = {
      id: `w-${Date.now()}`,
      english: word.english.trim().toLowerCase(),
      hebrew: word.hebrew.trim(),
      partOfSpeech: pos,
      example: word.example || "",
      level: "Saved from Unseen",
      mastered: false,
      addedAt: new Date().toISOString(),
    };
    return { added: true, item };
  }

  const key = userId ? `${STORAGE_KEY}_${userId}` : `${STORAGE_KEY}_guest`;
  const current = loadSavedWords(userId);

  const cleanEng = word.english.trim().toLowerCase();
  const existing = current.find((w) => w.english.toLowerCase() === cleanEng);

  if (existing) {
    return { added: false, item: existing };
  }

  const pos = (word.partOfSpeech === "verb" || word.partOfSpeech === "adjective" || word.partOfSpeech === "adverb" || word.partOfSpeech === "phrase")
    ? word.partOfSpeech
    : "noun";

  const newItem: VocabItem = {
    id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    english: cleanEng,
    hebrew: word.hebrew.trim(),
    partOfSpeech: pos,
    example: word.example || "",
    level: "Saved from Unseen",
    mastered: false,
    addedAt: new Date().toISOString(),
  };

  const updated = [newItem, ...current];
  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.warn("Local storage write error:", e);
  }

  // Sync to Firestore if user is authenticated and db is available
  if (userId && db) {
    try {
      const ref = doc(db, "users", userId, "words", newItem.id);
      setDoc(ref, newItem).catch(() => {});
    } catch {}
  }

  return { added: true, item: newItem };
}

export function removeWordFromBuilder(wordId: string, userId?: string) {
  if (typeof window === "undefined") return;
  const key = userId ? `${STORAGE_KEY}_${userId}` : `${STORAGE_KEY}_guest`;
  const current = loadSavedWords(userId);
  const updated = current.filter((w) => w.id !== wordId);
  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {}

  if (userId && db) {
    try {
      const ref = doc(db, "users", userId, "words", wordId);
      deleteDoc(ref).catch(() => {});
    } catch {}
  }
}
