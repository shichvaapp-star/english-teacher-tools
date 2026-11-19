import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { MIDDLE_SCHOOL_UNSEENS, LEGACY_UNSEENS } from "@/data/unseen-middle-school";

// Saved words may come from current or older stories.
const ALL_KNOWN_UNSEENS = [...MIDDLE_SCHOOL_UNSEENS, ...LEGACY_UNSEENS];
import { ALL_WRITING_TASKS, LEGACY_WRITING_TASKS } from "@/data/writing-tasks";
import { REAL_LIFE_CONVERSATIONS, LEGACY_CONVERSATIONS } from "@/data/conversations";
import { getVocabCards } from "@/data/vocab/cards";
import { GRADE_HE, type ClassGrade } from "@/lib/levels";

export type VocabSourceType = "unseen" | "writing" | "tutor" | "manual" | "curriculum" | "conversation";

export interface VocabItem {
  id: string;
  english: string;
  hebrew: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb" | "phrase";
  example?: string;
  level?: "Easy" | "Medium" | "Hard" | "Saved from Unseen" | "Personal Word";
  sourceType?: VocabSourceType;
  sourceTitle?: string;
  sourceCategory?: string;
  mastered?: boolean;
  starred?: boolean; // Favorite / priority word marked by student
  addedAt: string;
}

/**
 * Normalizes an English vocabulary word or phrase for reliable duplicate detection.
 * Trims, lowercases, strips outer non-alphanumeric punctuation, and collapses inner spaces.
 */
export function normalizeVocabWord(word: string): string {
  if (!word) return "";
  return word
    .trim()
    .toLowerCase()
    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Attempts to match an English word to a known Unseen story when legacy items lack `sourceTitle`.
 */
function inferUnseenStoryForWord(englishWord: string): { title: string; category: string } | null {
  const norm = normalizeVocabWord(englishWord);
  if (!norm) return null;

  // 1. Check active unseen snapshot in sessionStorage first (covers AI-generated or active story)
  if (typeof window !== "undefined") {
    try {
      const rawSnap = sessionStorage.getItem("ett_unseen_return_snapshot");
      if (rawSnap) {
        const snap = JSON.parse(rawSnap);
        const cur = snap?.currentStory;
        if (cur && cur.title && Array.isArray(cur.paragraphs)) {
          const escaped = norm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(`\\b${escaped}\\b`, "i");
          const inHints =
            Array.isArray(cur.vocabularyHints) &&
            cur.vocabularyHints.some((h: { word?: string }) => normalizeVocabWord(h.word || "") === norm);
          const inText = cur.paragraphs.some((p: string) => regex.test(p)) || regex.test(cur.title);
          if (inHints || inText) {
            return {
              title: cur.title,
              category: cur.level ? `Unseen (${cur.level})` : "Unseen Passage",
            };
          }
        }
      }
    } catch {}
  }

  // 2. Check vocabularyHints in built-in MIDDLE_SCHOOL_UNSEENS
  for (const story of ALL_KNOWN_UNSEENS) {
    if (
      story.vocabularyHints?.some(
        (h) => normalizeVocabWord(h.word) === norm
      )
    ) {
      return {
        title: story.title,
        category: `Unseen (${story.level})`,
      };
    }
  }

  // 3. Check full text paragraphs in built-in MIDDLE_SCHOOL_UNSEENS
  const escaped = norm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const wordRegex = new RegExp(`\\b${escaped}\\b`, "i");
  for (const story of ALL_KNOWN_UNSEENS) {
    if (
      wordRegex.test(story.title) ||
      story.paragraphs.some((p) => wordRegex.test(p))
    ) {
      return {
        title: story.title,
        category: `Unseen (${story.level})`,
      };
    }
  }

  return null;
}

/**
 * Formats an exercise `sourceTitle` with its Hebrew + English title when it matches a built-in Unseen or Writing task.
 */
export function formatExerciseDisplayTitle(
  sourceType: VocabSourceType,
  sourceTitle?: string
): string {
  if (!sourceTitle) return "";
  const clean = sourceTitle.trim();

  if (sourceType === "unseen") {
    const matchedStory = ALL_KNOWN_UNSEENS.find(
      (s) =>
        s.title.toLowerCase() === clean.toLowerCase() ||
        s.hebrewTitle === clean
    );
    if (matchedStory) {
      return `${matchedStory.hebrewTitle} (${matchedStory.title})`;
    }
  }

  if (sourceType === "writing") {
    const matchedTask = [...ALL_WRITING_TASKS, ...LEGACY_WRITING_TASKS].find(
      (t) =>
        t.title.toLowerCase() === clean.toLowerCase() ||
        t.hebrewTitle === clean
    );
    if (matchedTask) {
      return `${matchedTask.hebrewTitle} (${matchedTask.title})`;
    }
  }

  if (sourceType === "conversation") {
    const matchedScenario = [...REAL_LIFE_CONVERSATIONS, ...LEGACY_CONVERSATIONS].find(
      (c) =>
        c.title.toLowerCase() === clean.toLowerCase() ||
        c.hebrewTitle === clean
    );
    if (matchedScenario) {
      return `${matchedScenario.hebrewTitle} (${matchedScenario.title})`;
    }
  }

  return clean;
}

/**
 * Infers structured source metadata for both new and legacy saved vocabulary items.
 */
export function inferVocabSource(item: VocabItem): {
  sourceType: VocabSourceType;
  sourceTitle?: string;
  sourceCategory?: string;
} {
  const example = item.example || "";
  const fromMatch = example.match(/^From\s+"([^"]+)"/i);

  if (item.sourceType) {
    if (item.sourceType === "unseen" && !item.sourceTitle) {
      const fromTitle = fromMatch ? fromMatch[1] : undefined;
      const matched = !fromTitle ? inferUnseenStoryForWord(item.english) : null;
      return {
        sourceType: "unseen",
        sourceTitle: fromTitle || matched?.title,
        sourceCategory: item.sourceCategory || matched?.category || "Unseen Passage",
      };
    }
    return {
      sourceType: item.sourceType,
      sourceTitle: item.sourceTitle,
      sourceCategory: item.sourceCategory,
    };
  }

  if (item.level === "Saved from Unseen" || fromMatch) {
    const fromTitle = item.sourceTitle || (fromMatch ? fromMatch[1] : undefined);
    const matched = !fromTitle ? inferUnseenStoryForWord(item.english) : null;
    return {
      sourceType: "unseen",
      sourceTitle: fromTitle || matched?.title,
      sourceCategory: item.sourceCategory || matched?.category || "Unseen Passage",
    };
  }

  if (example.toLowerCase().includes("lesson with david")) {
    return {
      sourceType: "tutor",
      sourceTitle: item.sourceTitle || "אימון עם המורה דוד",
      sourceCategory: item.sourceCategory || "AI Tutor",
    };
  }

  if (item.level === "Easy" || item.level === "Medium" || item.level === "Hard") {
    return {
      sourceType: "curriculum",
      sourceTitle: item.sourceTitle || `מאגר חטיבת ביניים (${item.level})`,
      sourceCategory: item.level,
    };
  }

  return {
    sourceType: "manual",
    sourceTitle: item.sourceTitle || "הזנה ידנית",
    sourceCategory: item.sourceCategory || "Personal Word",
  };
}

/**
 * Formats a concise Hebrew badge label describing the source of a vocabulary word.
 */
export function formatVocabSourceLabel(item: VocabItem): string {
  const { sourceType, sourceTitle, sourceCategory } = inferVocabSource(item);
  const displayTitle = formatExerciseDisplayTitle(sourceType, sourceTitle);
  switch (sourceType) {
    case "unseen":
      return displayTitle ? `📖 אנסין: ${displayTitle}` : "📖 קטע קריאה (אנסין)";
    case "writing":
      return displayTitle
        ? `✍️ כתיבה: ${displayTitle}`
        : sourceCategory
        ? `✍️ כתיבה (${sourceCategory})`
        : "✍️ סדנת כתיבה";
    case "tutor":
      return displayTitle ? `🤖 דוד: ${displayTitle}` : "🤖 אימון עם דוד";
    case "curriculum":
      return sourceCategory ? `📚 מאגר (${sourceCategory})` : "📚 מאגר בית ספרי";
    case "manual":
    default:
      return "✏️ הזנה ידנית";
  }
}

/** Textbook word cards as practice-deck items (grade's whole list, or one unit). */
export function curriculumWords(grade: ClassGrade, unit?: number): VocabItem[] {
  return getVocabCards(grade, unit).map((c) => ({
    id: c.id,
    english: c.word,
    hebrew: c.hebrew,
    partOfSpeech: toDeckPartOfSpeech(c.partOfSpeech),
    example: c.example,
    sourceType: "curriculum",
    sourceCategory: `כיתה ${GRADE_HE[grade]}׳ · יחידה ${c.unit}`,
    addedAt: "2026-11-18",
  }));
}

/** The deck shows five word classes; small function words are grouped as phrases. */
export function toDeckPartOfSpeech(pos: string | undefined): VocabItem["partOfSpeech"] {
  return pos === "noun" || pos === "verb" || pos === "adjective" || pos === "adverb" ? pos : "phrase";
}

// Whole-grade pools (kept under their old names for the tutor and older callers).
export const MIDDLE_SCHOOL_EASY: VocabItem[] = curriculumWords(7);
export const MIDDLE_SCHOOL_MEDIUM: VocabItem[] = curriculumWords(8);
export const MIDDLE_SCHOOL_HARD: VocabItem[] = curriculumWords(9);

const STORAGE_KEY = "bg_saved_vocab_words";

export function loadSavedWords(userId?: string): VocabItem[] {
  if (typeof window === "undefined") return [];
  try {
    const key = userId ? `${STORAGE_KEY}_${userId}` : `${STORAGE_KEY}_guest`;
    const raw = localStorage.getItem(key);
    const parsedUserList: VocabItem[] = raw ? JSON.parse(raw) : [];
    const combinedRaw: VocabItem[] = Array.isArray(parsedUserList) ? [...parsedUserList] : [];

    // Also include any words saved under guest session on this browser so nothing is lost on hydration/login
    if (userId) {
      try {
        const guestRaw = localStorage.getItem(`${STORAGE_KEY}_guest`);
        if (guestRaw) {
          const guestList = JSON.parse(guestRaw);
          if (Array.isArray(guestList) && guestList.length > 0) {
            combinedRaw.push(...guestList);
          }
        }
      } catch {
        // Ignore guest read errors
      }
    }

    if (combinedRaw.length === 0) return [];

    // Deduplicate by normalized English word and enrich legacy source fields
    const byWord = new Map<string, VocabItem>();
    let hadDuplicatesOrChanges = false;

    for (const rawItem of combinedRaw) {
      if (!rawItem || typeof rawItem.english !== "string") {
        hadDuplicatesOrChanges = true;
        continue;
      }
      const norm = normalizeVocabWord(rawItem.english);
      if (!norm) {
        hadDuplicatesOrChanges = true;
        continue;
      }

      const inferred = inferVocabSource(rawItem);
      const enriched: VocabItem = {
        ...rawItem,
        english: norm,
        sourceType: rawItem.sourceType || inferred.sourceType,
        sourceTitle: rawItem.sourceTitle || inferred.sourceTitle,
        sourceCategory: rawItem.sourceCategory || inferred.sourceCategory,
      };

      const existing = byWord.get(norm);
      if (!existing) {
        if (
          rawItem.english !== norm ||
          rawItem.sourceType !== enriched.sourceType ||
          rawItem.sourceTitle !== enriched.sourceTitle
        ) {
          hadDuplicatesOrChanges = true;
        }
        byWord.set(norm, enriched);
      } else {
        hadDuplicatesOrChanges = true;
        // Merge flags & missing fields into the retained item
        byWord.set(norm, {
          ...existing,
          starred: Boolean(existing.starred || enriched.starred),
          mastered: Boolean(existing.mastered || enriched.mastered),
          example: existing.example || enriched.example,
          sourceType: existing.sourceType || enriched.sourceType,
          sourceTitle: existing.sourceTitle || enriched.sourceTitle,
          sourceCategory: existing.sourceCategory || enriched.sourceCategory,
        });
      }
    }

    const deduped = Array.from(byWord.values());
    if (hadDuplicatesOrChanges || deduped.length !== parsedUserList.length) {
      try {
        localStorage.setItem(key, JSON.stringify(deduped));
      } catch {
        // Ignore storage quota errors
      }
    }

    return deduped;
  } catch {
    return [];
  }
}

export async function syncSavedWordsFromFirestore(userId?: string): Promise<VocabItem[]> {
  const localWords = loadSavedWords(userId);
  if (typeof window === "undefined" || !userId || !db) {
    return localWords;
  }

  try {
    const colRef = collection(db, "users", userId, "words");
    const snap = await getDocs(colRef);
    if (snap.empty) {
      return localWords;
    }

    const byWord = new Map<string, VocabItem>();
    for (const item of localWords) {
      const norm = normalizeVocabWord(item.english);
      if (norm) byWord.set(norm, item);
    }

    let changed = false;
    snap.forEach((docSnap) => {
      const data = docSnap.data() as VocabItem;
      if (!data || typeof data.english !== "string") return;
      const norm = normalizeVocabWord(data.english);
      if (!norm) return;
      if (!byWord.has(norm)) {
        const inferred = inferVocabSource(data);
        byWord.set(norm, {
          ...data,
          id: data.id || docSnap.id,
          english: norm,
          sourceType: data.sourceType || inferred.sourceType,
          sourceTitle: data.sourceTitle || inferred.sourceTitle,
          sourceCategory: data.sourceCategory || inferred.sourceCategory,
        });
        changed = true;
      }
    });

    if (changed) {
      const merged = Array.from(byWord.values());
      const key = `${STORAGE_KEY}_${userId}`;
      try {
        localStorage.setItem(key, JSON.stringify(merged));
      } catch {
        // Ignore storage quota errors
      }
      return merged;
    }
  } catch {
    // Ignore Firestore sync errors when offline
  }

  return localWords;
}

export function isWordSaved(english: string, userId?: string): boolean {
  const cleanEng = normalizeVocabWord(english);
  if (!cleanEng) return false;
  const current = loadSavedWords(userId);
  return current.some((w) => normalizeVocabWord(w.english) === cleanEng);
}

export function saveWordToBuilder(
  word: {
    english: string;
    hebrew: string;
    partOfSpeech?: string;
    example?: string;
    level?: "Easy" | "Medium" | "Hard" | "Saved from Unseen" | "Personal Word";
    sourceType?: VocabSourceType;
    sourceTitle?: string;
    sourceCategory?: string;
  },
  userId?: string
): { added: boolean; item: VocabItem } {
  const chosenLevel = word.level || "Saved from Unseen";
  const cleanEng = normalizeVocabWord(word.english);

  const pos = (
    word.partOfSpeech === "verb" ||
    word.partOfSpeech === "adjective" ||
    word.partOfSpeech === "adverb" ||
    word.partOfSpeech === "phrase"
  )
    ? word.partOfSpeech
    : "noun";

  const defaultSourceType: VocabSourceType =
    word.sourceType || (chosenLevel === "Saved from Unseen" ? "unseen" : "manual");

  if (typeof window === "undefined") {
    const item: VocabItem = {
      id: `w-${Date.now()}`,
      english: cleanEng,
      hebrew: word.hebrew.trim(),
      partOfSpeech: pos,
      example: word.example || "",
      level: chosenLevel,
      sourceType: defaultSourceType,
      sourceTitle: word.sourceTitle,
      sourceCategory: word.sourceCategory,
      mastered: false,
      addedAt: new Date().toISOString(),
    };
    return { added: true, item };
  }

  const key = userId ? `${STORAGE_KEY}_${userId}` : `${STORAGE_KEY}_guest`;
  const current = loadSavedWords(userId);

  const existingIndex = current.findIndex(
    (w) => normalizeVocabWord(w.english) === cleanEng
  );

  if (existingIndex !== -1) {
    const existing = current[existingIndex];
    // Enrich existing item with source metadata or example if missing, without creating a duplicate
    const needsEnrich =
      (!existing.sourceTitle && word.sourceTitle) ||
      (!existing.sourceCategory && word.sourceCategory) ||
      (!existing.example && word.example);

    if (needsEnrich) {
      const updatedExisting: VocabItem = {
        ...existing,
        example: existing.example || word.example || "",
        sourceType: existing.sourceType || defaultSourceType,
        sourceTitle: existing.sourceTitle || word.sourceTitle,
        sourceCategory: existing.sourceCategory || word.sourceCategory,
      };
      const nextList = [...current];
      nextList[existingIndex] = updatedExisting;
      try {
        localStorage.setItem(key, JSON.stringify(nextList));
      } catch {}
      return { added: false, item: updatedExisting };
    }

    return { added: false, item: existing };
  }

  const inferred = inferVocabSource({
    id: "",
    english: cleanEng,
    hebrew: word.hebrew.trim(),
    partOfSpeech: pos,
    example: word.example || "",
    level: chosenLevel,
    sourceType: word.sourceType,
    sourceTitle: word.sourceTitle,
    sourceCategory: word.sourceCategory,
    addedAt: "",
  });

  const newItem: VocabItem = {
    id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    english: cleanEng,
    hebrew: word.hebrew.trim(),
    partOfSpeech: pos,
    example: word.example || "",
    level: chosenLevel,
    sourceType: inferred.sourceType,
    sourceTitle: inferred.sourceTitle,
    sourceCategory: inferred.sourceCategory,
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

/** Remove a saved word by its English text (case/punctuation-insensitive). Returns true if one was removed. */
export function removeWordByEnglish(english: string, userId?: string): boolean {
  const cleanEng = normalizeVocabWord(english);
  if (!cleanEng) return false;
  const matches = loadSavedWords(userId).filter((w) => normalizeVocabWord(w.english) === cleanEng);
  for (const w of matches) removeWordFromBuilder(w.id, userId);
  return matches.length > 0;
}

const OVERRIDES_STORAGE_KEY = "bg_word_status_overrides";

export function loadWordStatusOverrides(
  userId?: string
): Record<string, { starred?: boolean; mastered?: boolean }> {
  if (typeof window === "undefined") return {};
  try {
    const key = userId ? `${OVERRIDES_STORAGE_KEY}_${userId}` : `${OVERRIDES_STORAGE_KEY}_guest`;
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveWordStatusOverride(
  wordId: string,
  override: { starred?: boolean; mastered?: boolean },
  userId?: string
): void {
  if (typeof window === "undefined") return;
  const key = userId ? `${OVERRIDES_STORAGE_KEY}_${userId}` : `${OVERRIDES_STORAGE_KEY}_guest`;
  const current = loadWordStatusOverrides(userId);
  const updated = {
    ...current,
    [wordId]: {
      ...current[wordId],
      ...override,
    },
  };

  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.warn("Error saving word status override locally:", e);
  }

  // Also update saved words list if word exists in personal collection
  const personalWords = loadSavedWords(userId);
  const existingIndex = personalWords.findIndex((w) => w.id === wordId);
  if (existingIndex !== -1) {
    const updatedPersonal = [...personalWords];
    updatedPersonal[existingIndex] = {
      ...updatedPersonal[existingIndex],
      ...override,
    };
    try {
      const pKey = userId ? `${STORAGE_KEY}_${userId}` : `${STORAGE_KEY}_guest`;
      localStorage.setItem(pKey, JSON.stringify(updatedPersonal));
    } catch {}
  }

  // Sync override to Firestore
  if (userId && db) {
    try {
      const ref = doc(db, "users", userId, "wordOverrides", wordId);
      setDoc(ref, updated[wordId], { merge: true }).catch(() => {});
    } catch {}
  }
}

export function toggleWordStarred(
  wordId: string,
  currentStatus: boolean,
  userId?: string
): boolean {
  const nextStatus = !currentStatus;
  saveWordStatusOverride(wordId, { starred: nextStatus }, userId);
  return nextStatus;
}

export function toggleWordMastered(
  wordId: string,
  currentStatus: boolean,
  userId?: string
): boolean {
  const nextStatus = !currentStatus;
  saveWordStatusOverride(wordId, { mastered: nextStatus }, userId);
  return nextStatus;
}

export function updateWordInBuilder(
  wordId: string,
  updates: Partial<VocabItem>,
  userId?: string
): void {
  if (typeof window === "undefined") return;
  const key = userId ? `${STORAGE_KEY}_${userId}` : `${STORAGE_KEY}_guest`;
  const current = loadSavedWords(userId);
  const index = current.findIndex((w) => w.id === wordId);
  if (index === -1) return;

  const updatedItem = { ...current[index], ...updates };
  const updatedList = [...current];
  updatedList[index] = updatedItem;

  try {
    localStorage.setItem(key, JSON.stringify(updatedList));
  } catch {}

  if (userId && db) {
    try {
      const ref = doc(db, "users", userId, "words", wordId);
      setDoc(ref, updatedItem, { merge: true }).catch(() => {});
    } catch {}
  }
}
