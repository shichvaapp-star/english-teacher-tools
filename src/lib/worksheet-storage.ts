// "My worksheets": saved in Firestore under teachers/{teacherId}/worksheets,
// mirrored in localStorage so the list still works offline (and in local
// testing without Firebase). The content is stored as one JSON string,
// because Firestore can't hold some item shapes (arrays inside arrays).
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Worksheet, WorksheetContent } from "@/lib/worksheet/types";

const LOCAL_KEY = (teacherId: string) => `ett.worksheets.${teacherId}`;
const REMOTE_TIMEOUT_MS = 8000;

interface StoredWorksheet {
  id: string;
  teacherId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  grade: number;
  level: number;
  parts: string[];
  /** JSON of WorksheetContent. */
  content: string;
}

function toStored(w: Worksheet): StoredWorksheet {
  const content: WorksheetContent = { settings: w.settings, sections: w.sections, seed: w.seed };
  return {
    id: w.id,
    teacherId: w.teacherId,
    title: w.title,
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
    grade: w.settings.grade,
    level: w.settings.level,
    parts: w.settings.parts,
    content: JSON.stringify(content),
  };
}

function fromStored(s: StoredWorksheet): Worksheet | null {
  try {
    const content = JSON.parse(s.content) as WorksheetContent;
    if (!content?.settings || !Array.isArray(content.sections)) return null;
    return { id: s.id, teacherId: s.teacherId, title: s.title, createdAt: s.createdAt, updatedAt: s.updatedAt, ...content };
  } catch {
    return null;
  }
}

function readLocal(teacherId: string): StoredWorksheet[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY(teacherId));
    const list: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? (list as StoredWorksheet[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(teacherId: string, list: StoredWorksheet[]) {
  try {
    localStorage.setItem(LOCAL_KEY(teacherId), JSON.stringify(list));
  } catch {
    /* storage full or blocked – Firestore still has it */
  }
}

/** Firestore calls can hang without a connection; give up after a while. */
function withTimeout<T>(p: Promise<T>): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), REMOTE_TIMEOUT_MS)),
  ]);
}

const byNewest = (a: { updatedAt: string }, b: { updatedAt: string }) => b.updatedAt.localeCompare(a.updatedAt);

export async function loadWorksheets(teacherId: string): Promise<Worksheet[]> {
  const merged = new Map(readLocal(teacherId).map((s) => [s.id, s]));
  if (db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, "teachers", teacherId, "worksheets")));
      snap.forEach((d) => {
        const remote = { ...(d.data() as StoredWorksheet), id: d.id };
        const local = merged.get(d.id);
        if (!local || remote.updatedAt >= local.updatedAt) merged.set(d.id, remote);
      });
      writeLocal(teacherId, [...merged.values()]);
    } catch (err) {
      console.warn("Could not load worksheets from Firestore, using this computer's copy:", err);
    }
  }
  return [...merged.values()]
    .sort(byNewest)
    .map(fromStored)
    .filter((w): w is Worksheet => w !== null);
}

/** Saves locally right away; returns whether the cloud copy was saved too. */
export async function saveWorksheet(w: Worksheet): Promise<{ cloud: boolean }> {
  const stored = toStored(w);
  writeLocal(w.teacherId, [stored, ...readLocal(w.teacherId).filter((s) => s.id !== w.id)]);
  if (!db) return { cloud: false };
  try {
    await withTimeout(setDoc(doc(db, "teachers", w.teacherId, "worksheets", w.id), stored));
    return { cloud: true };
  } catch (err) {
    console.warn("Could not save worksheet to Firestore:", err);
    return { cloud: false };
  }
}

export async function deleteWorksheet(teacherId: string, id: string): Promise<void> {
  writeLocal(teacherId, readLocal(teacherId).filter((s) => s.id !== id));
  if (!db) return;
  try {
    await withTimeout(deleteDoc(doc(db, "teachers", teacherId, "worksheets", id)));
  } catch (err) {
    console.warn("Could not delete worksheet from Firestore:", err);
  }
}

export function newWorksheetId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `ws-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }
}
