import { TeacherVocabBank } from "@/types/vocab-bank";
import { db } from "@/lib/firebase";
import { doc, getDocs, collection, setDoc, deleteDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/lib/utils";

const STORAGE_KEY_PREFIX = "ett_teacher_vocab_banks";

export function getLocalVocabBanks(teacherId?: string): TeacherVocabBank[] {
  if (typeof window === "undefined") return [];
  try {
    const key = teacherId ? `${STORAGE_KEY_PREFIX}_${teacherId}` : `${STORAGE_KEY_PREFIX}_guest`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalVocabBanks(banks: TeacherVocabBank[], teacherId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = teacherId ? `${STORAGE_KEY_PREFIX}_${teacherId}` : `${STORAGE_KEY_PREFIX}_guest`;
    localStorage.setItem(key, JSON.stringify(banks));
  } catch (err) {
    console.warn("Failed to save vocab banks to localStorage", err);
  }
}

export async function loadTeacherVocabBanks(teacherId?: string): Promise<TeacherVocabBank[]> {
  const local = getLocalVocabBanks(teacherId);

  if (!teacherId || !db) {
    return local;
  }

  try {
    const colRef = collection(db, "teachers", teacherId, "vocabBanks");
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const remoteList: TeacherVocabBank[] = [];
      snap.forEach((d) => {
        remoteList.push({ ...(d.data() as TeacherVocabBank), id: d.id });
      });

      // Merge remote into local by updatedAt
      const mergedMap = new Map<string, TeacherVocabBank>();
      local.forEach((b) => mergedMap.set(b.id, b));
      remoteList.forEach((b) => mergedMap.set(b.id, b));

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      saveLocalVocabBanks(merged, teacherId);
      return merged;
    }
  } catch (err) {
    console.warn("Error loading vocab banks from Firestore, using local:", err);
  }

  return local;
}

export async function saveTeacherVocabBank(
  bank: TeacherVocabBank,
  teacherId?: string
): Promise<TeacherVocabBank> {
  const current = getLocalVocabBanks(teacherId);
  const existingIdx = current.findIndex((b) => b.id === bank.id);

  const updatedBank: TeacherVocabBank = {
    ...bank,
    updatedAt: new Date().toISOString(),
    createdAt: bank.createdAt || new Date().toISOString(),
  };

  let newList: TeacherVocabBank[];
  if (existingIdx !== -1) {
    newList = [...current];
    newList[existingIdx] = updatedBank;
  } else {
    newList = [updatedBank, ...current];
  }

  saveLocalVocabBanks(newList, teacherId);

  if (teacherId && db) {
    try {
      const ref = doc(db, "teachers", teacherId, "vocabBanks", updatedBank.id);
      await setDoc(ref, cleanForFirestore(updatedBank), { merge: true });
    } catch (err) {
      console.warn("Error saving vocab bank to Firestore:", err);
    }
  }

  return updatedBank;
}

export async function deleteTeacherVocabBank(bankId: string, teacherId?: string): Promise<void> {
  const current = getLocalVocabBanks(teacherId);
  const filtered = current.filter((b) => b.id !== bankId);
  saveLocalVocabBanks(filtered, teacherId);

  if (teacherId && db) {
    try {
      const ref = doc(db, "teachers", teacherId, "vocabBanks", bankId);
      await deleteDoc(ref);
    } catch (err) {
      console.warn("Error deleting vocab bank from Firestore:", err);
    }
  }
}

/**
 * Export a vocabulary bank as a CSV file for download
 */
export function exportBankToCSV(bank: TeacherVocabBank): void {
  if (typeof window === "undefined") return;

  const headers = ["English Word", "Hebrew Translation", "Part of Speech", "Example Sentence"];
  const rows = bank.words.map((w) => [
    `"${w.english.replace(/"/g, '""')}"`,
    `"${w.hebrew.replace(/"/g, '""')}"`,
    `"${(w.partOfSpeech || "").replace(/"/g, '""')}"`,
    `"${(w.example || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${bank.name.replace(/\s+/g, "_")}_words.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
