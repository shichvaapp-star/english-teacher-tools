// The school's shared worksheet library: shared_worksheets/{worksheetId}.
// A teacher shares one of their saved worksheets; every teacher can see it,
// print it, or copy it into their own list. Only teachers can read it
// (sheets include answer keys), and only the owner can change or remove it.
// The doc id is the owner's worksheet id, so sharing again just updates it.
import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { newWorksheetId, saveWorksheet } from "@/lib/worksheet-storage";
import type { Worksheet, WorksheetContent } from "@/lib/worksheet/types";

const COLLECTION = "shared_worksheets";
/** Plenty for one school; keeps reads (free-plan quota) bounded. */
const MAX_SHARED = 150;
const TIMEOUT_MS = 8000;

export interface SharedWorksheet extends WorksheetContent {
  /** Same as the owner's worksheet id. */
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  sharedAt: string;
  updatedAt: string;
}

interface StoredShared {
  ownerId: string;
  ownerName: string;
  title: string;
  sharedAt: string;
  updatedAt: string;
  grade: number;
  level: number;
  parts: string[];
  /** JSON of WorksheetContent (Firestore can't hold some item shapes). */
  content: string;
}

function withTimeout<T>(p: Promise<T>): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS)),
  ]);
}

function toStored(w: Worksheet, ownerName: string, sharedAt: string): StoredShared {
  const content: WorksheetContent = { settings: w.settings, sections: w.sections, seed: w.seed };
  return {
    ownerId: w.teacherId,
    ownerName,
    title: w.title,
    sharedAt,
    updatedAt: new Date().toISOString(),
    grade: w.settings.grade,
    level: w.settings.level,
    parts: w.settings.parts,
    content: JSON.stringify(content),
  };
}

function fromStored(id: string, s: StoredShared): SharedWorksheet | null {
  try {
    const content = JSON.parse(s.content) as WorksheetContent;
    if (!content?.settings || !Array.isArray(content.sections)) return null;
    return { id, ownerId: s.ownerId, ownerName: s.ownerName, title: s.title, sharedAt: s.sharedAt, updatedAt: s.updatedAt, ...content };
  } catch {
    return null;
  }
}

/** Newest first. Returns null when the library can't be reached. */
export async function loadSharedWorksheets(): Promise<SharedWorksheet[] | null> {
  if (!db) return null;
  try {
    const snap = await withTimeout(getDocs(query(collection(db, COLLECTION), orderBy("sharedAt", "desc"), limit(MAX_SHARED))));
    return snap.docs.map((d) => fromStored(d.id, d.data() as StoredShared)).filter((w): w is SharedWorksheet => w !== null);
  } catch (err) {
    console.warn("Could not load the shared worksheets:", err);
    return null;
  }
}

/** Adds the worksheet to the library (or refreshes it if already there). Returns whether it worked. */
export async function shareWorksheet(w: Worksheet, ownerName: string, sharedAt = new Date().toISOString()): Promise<boolean> {
  if (!db) return false;
  try {
    await withTimeout(setDoc(doc(db, COLLECTION, w.id), toStored(w, ownerName, sharedAt)));
    return true;
  } catch (err) {
    console.warn("Could not share the worksheet:", err);
    return false;
  }
}

export async function unshareWorksheet(id: string): Promise<boolean> {
  if (!db) return false;
  try {
    await withTimeout(deleteDoc(doc(db, COLLECTION, id)));
    return true;
  } catch (err) {
    console.warn("Could not remove the worksheet from the library:", err);
    return false;
  }
}

/**
 * After the owner edits or renames a worksheet: if it is in the library,
 * update the shared copy too, so colleagues get the latest version.
 */
export async function refreshSharedCopy(w: Worksheet): Promise<void> {
  if (!db) return;
  try {
    const snap = await withTimeout(getDoc(doc(db, COLLECTION, w.id)));
    if (!snap.exists()) return;
    const s = snap.data() as StoredShared;
    if (s.ownerId !== w.teacherId) return;
    await shareWorksheet(w, s.ownerName, s.sharedAt);
  } catch (err) {
    console.warn("Could not update the shared copy:", err);
  }
}

/** Saves a colleague's shared sheet as a new worksheet in the teacher's own list. */
export async function copySharedToMine(s: SharedWorksheet, teacherId: string): Promise<{ cloud: boolean }> {
  const now = new Date().toISOString();
  const copy: Worksheet = {
    id: newWorksheetId(),
    teacherId,
    title: s.title,
    createdAt: now,
    updatedAt: now,
    settings: s.settings,
    sections: s.sections,
    seed: s.seed,
  };
  return saveWorksheet(copy);
}
