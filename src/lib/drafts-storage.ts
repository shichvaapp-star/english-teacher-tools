"use client";

import { InProgressWorkItem } from "@/types/draft";
import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, getDocs, collection, query, where } from "firebase/firestore";
import { cleanForFirestore } from "@/lib/utils";

const DRAFTS_LOCAL_STORAGE_KEY = "ett_in_progress_drafts";
export const DRAFTS_CHANGED_EVENT = "ett_drafts_changed";

function notifyDraftsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DRAFTS_CHANGED_EVENT));
  }
}

/**
 * Loads all drafts stored in localStorage, sorted with the newest first.
 */
export function getStoredDrafts(studentId?: string): InProgressWorkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DRAFTS_LOCAL_STORAGE_KEY);
    if (!raw) return [];
    let list: InProgressWorkItem[] = JSON.parse(raw);
    if (!Array.isArray(list)) return [];

    if (studentId && studentId !== "guest") {
      list = list.filter((item) => !item.studentId || item.studentId === studentId || item.studentId === "guest");
    }

    return list.sort((a, b) => new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime());
  } catch (err) {
    console.warn("Failed to load drafts from local storage:", err);
    return [];
  }
}

/**
 * Retrieves a single draft by its ID.
 */
export function getDraftById(draftId: string): InProgressWorkItem | null {
  const all = getStoredDrafts();
  return all.find((d) => d.id === draftId) || null;
}

/**
 * Finds the first draft matching a predicate.
 */
export function findDraft(predicate: (d: InProgressWorkItem) => boolean): InProgressWorkItem | null {
  const all = getStoredDrafts();
  return all.find(predicate) || null;
}

/**
 * Saves or updates a draft in localStorage and Firestore (if student is logged in).
 */
export async function saveDraft(draft: InProgressWorkItem): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const all = getStoredDrafts();
    const existingIndex = all.findIndex((d) => d.id === draft.id);

    const updatedDraft: InProgressWorkItem = {
      ...draft,
      lastUpdated: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      all[existingIndex] = updatedDraft;
    } else {
      all.unshift(updatedDraft);
    }

    // Keep up to 20 most recent drafts locally to prevent memory bloat
    const trimmed = all.slice(0, 20);
    localStorage.setItem(DRAFTS_LOCAL_STORAGE_KEY, JSON.stringify(trimmed));
    notifyDraftsChanged();

    // Async sync to Firestore if user is not guest
    if (db && draft.studentId && draft.studentId !== "guest") {
      try {
        const payload = cleanForFirestore({
          ...updatedDraft,
          timestamp: updatedDraft.lastUpdated,
        });
        await setDoc(doc(db, "drafts", draft.id), payload, { merge: true });
      } catch (fbErr) {
        console.warn("Firestore draft save notice:", fbErr);
      }
    }
  } catch (err) {
    console.warn("Failed to save draft:", err);
  }
}

/**
 * Deletes a draft by ID from localStorage and Firestore.
 */
export async function deleteDraft(draftId: string, studentId?: string): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const all = getStoredDrafts();
    const filtered = all.filter((d) => d.id !== draftId);
    localStorage.setItem(DRAFTS_LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    notifyDraftsChanged();

    if (db && draftId) {
      try {
        await deleteDoc(doc(db, "drafts", draftId));
      } catch (fbErr) {
        console.warn("Firestore draft delete notice:", fbErr);
      }
    }
  } catch (err) {
    console.warn("Failed to delete draft:", err);
  }
}

/**
 * Syncs drafts from Firestore for a logged-in student and merges with local storage.
 */
export async function syncDraftsFromFirestore(studentId: string): Promise<InProgressWorkItem[]> {
  if (typeof window === "undefined" || !db || !studentId || studentId === "guest") {
    return getStoredDrafts(studentId);
  }

  try {
    const snap = await getDocs(query(collection(db, "drafts"), where("studentId", "==", studentId)));
    const remoteDrafts: InProgressWorkItem[] = [];
    snap.forEach((docSnap) => {
      remoteDrafts.push(docSnap.data() as InProgressWorkItem);
    });

    const localDrafts = getStoredDrafts(studentId);
    const map = new Map<string, InProgressWorkItem>();

    // Merge: pick newest if both exist
    [...localDrafts, ...remoteDrafts].forEach((item) => {
      const existing = map.get(item.id);
      if (!existing || new Date(item.lastUpdated || 0).getTime() > new Date(existing.lastUpdated || 0).getTime()) {
        map.set(item.id, item);
      }
    });

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime()
    );

    localStorage.setItem(DRAFTS_LOCAL_STORAGE_KEY, JSON.stringify(merged));
    notifyDraftsChanged();
    return merged;
  } catch (err) {
    console.warn("Firestore drafts sync notice:", err);
    return getStoredDrafts(studentId);
  }
}
