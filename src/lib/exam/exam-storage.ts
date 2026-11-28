// Firestore access for lab exams (see src/types/exam.ts for the layout).
// Every read is scoped (by teacher / exam / student) to stay inside the free quota.

import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cleanForFirestore } from "@/lib/utils";
import type {
  ExamAnswer,
  ExamDoc,
  ExamEvent,
  ExamKeylogChunk,
  ExamPrivateAnswers,
  ExamResultDoc,
  ExamSessionDoc,
  ExamVariant,
  ExamVocabAnswer,
  KeylogOp,
} from "@/types/exam";
import type { SubmissionItem } from "@/types/submission";
import { parseOps } from "@/lib/exam/keylog";

const EXAMS = "exams";
const SESSIONS = "exam_sessions";

function requireDb() {
  if (!db) throw new Error("Firestore is not available");
  return db;
}

export const sessionIdFor = (examId: string, studentId: string) => `${examId}__${studentId}`;

export function newExamId(): string {
  return `exam${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function receiptCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

/** Epoch ms of a Firestore timestamp (or null). */
export function tsMillis(ts: Timestamp | null | undefined): number | null {
  return ts && typeof ts.toMillis === "function" ? ts.toMillis() : null;
}

// ---------------------------------------------------------------------------
// Teacher
// ---------------------------------------------------------------------------

export async function listTeacherExams(teacherId: string): Promise<ExamDoc[]> {
  const snap = await getDocs(query(collection(requireDb(), EXAMS), where("teacherId", "==", teacherId)));
  return snap.docs
    .map((d) => ({ ...(d.data() as ExamDoc), id: d.id }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export interface TeacherExamBundle {
  exam: ExamDoc;
  variants: ExamVariant[];
  /** Writing word list (English + Hebrew). */
  answers: ExamVocabAnswer[];
  /** Answer keys per version + builder settings (missing on writing-only exams). */
  priv?: ExamPrivateAnswers;
}

export async function loadTeacherExam(examId: string): Promise<TeacherExamBundle | null> {
  const fdb = requireDb();
  const examSnap = await getDoc(doc(fdb, EXAMS, examId));
  if (!examSnap.exists()) return null;
  const exam = { ...(examSnap.data() as ExamDoc), id: examSnap.id };
  const [variantSnap, answersSnap] = await Promise.all([
    getDocs(collection(fdb, EXAMS, examId, "variants")),
    getDoc(doc(fdb, EXAMS, examId, "private", "answers")),
  ]);
  const variants = variantSnap.docs
    .map((d) => ({ ...(d.data() as ExamVariant), key: d.id }))
    .sort((a, b) => a.key.localeCompare(b.key));
  const priv = (answersSnap.data() as ExamPrivateAnswers | undefined) ?? { words: [] };
  return { exam, variants, answers: priv.words ?? [], priv };
}

export function subscribeExam(examId: string, cb: (exam: ExamDoc | null) => void): Unsubscribe {
  return onSnapshot(
    doc(requireDb(), EXAMS, examId),
    (snap) => cb(snap.exists() ? { ...(snap.data() as ExamDoc), id: snap.id } : null),
    () => cb(null)
  );
}

/** Exam doc first (the sub-collection rules read it), then the topics and answers. */
export async function saveExam(bundle: TeacherExamBundle, removedVariantKeys: string[] = []): Promise<void> {
  const fdb = requireDb();
  const { exam, variants, answers } = bundle;
  // Timestamps are only set by open/extend/close (cleanForFirestore would flatten them).
  const { openedAt, closesAt, closedAt, ...plain } = exam;
  await setDoc(
    doc(fdb, EXAMS, exam.id),
    cleanForFirestore({ ...plain, updatedAt: new Date().toISOString() }),
    { merge: true }
  );
  await Promise.all([
    ...variants.map((v) => setDoc(doc(fdb, EXAMS, exam.id, "variants", v.key), cleanForFirestore(v))),
    ...removedVariantKeys.map((k) => deleteDoc(doc(fdb, EXAMS, exam.id, "variants", k))),
    setDoc(
      doc(fdb, EXAMS, exam.id, "private", "answers"),
      cleanForFirestore({ ...(bundle.priv ?? {}), words: answers } satisfies ExamPrivateAnswers)
    ),
  ]);
}

export async function deleteExam(exam: ExamDoc): Promise<void> {
  const fdb = requireDb();
  await Promise.all([
    ...exam.variantKeys.map((k) => deleteDoc(doc(fdb, EXAMS, exam.id, "variants", k))),
    deleteDoc(doc(fdb, EXAMS, exam.id, "private", "answers")),
  ]);
  await deleteDoc(doc(fdb, EXAMS, exam.id));
}

export async function openExam(exam: ExamDoc, variantByStudent: Record<string, string>): Promise<void> {
  const closesAt = Timestamp.fromMillis(Date.now() + exam.durationMin * 60_000);
  await updateDoc(doc(requireDb(), EXAMS, exam.id), {
    status: "open",
    variantByStudent,
    openedAt: serverTimestamp(),
    closesAt,
    closedAt: null,
    updatedAt: new Date().toISOString(),
  });
}

export async function extendExam(exam: ExamDoc, minutes: number): Promise<void> {
  const current = tsMillis(exam.closesAt) ?? Date.now();
  await updateDoc(doc(requireDb(), EXAMS, exam.id), {
    closesAt: Timestamp.fromMillis(Math.max(current, Date.now()) + minutes * 60_000),
    updatedAt: new Date().toISOString(),
  });
}

/** Ends the exam now and submits every session that is still going. */
export async function closeExam(exam: ExamDoc, sessions: ExamSessionDoc[]): Promise<void> {
  const fdb = requireDb();
  await updateDoc(doc(fdb, EXAMS, exam.id), {
    status: "closed",
    closesAt: Timestamp.now(),
    closedAt: serverTimestamp(),
    updatedAt: new Date().toISOString(),
  });
  const open = sessions.filter((s) => s.state !== "submitted");
  if (open.length === 0) return;
  const batch = writeBatch(fdb);
  const event: ExamEvent = { t: Date.now(), type: "force_submit", severity: "info", detail: "המבחן הסתיים" };
  open.forEach((s) =>
    batch.update(doc(fdb, SESSIONS, s.id), {
      state: "submitted",
      submittedAt: serverTimestamp(),
      receiptCode: s.receiptCode ?? receiptCode(),
      events: arrayUnion(event),
    })
  );
  await batch.commit();
}

export function subscribeExamSessions(
  examId: string,
  teacherId: string,
  cb: (sessions: ExamSessionDoc[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(requireDb(), SESSIONS), where("examId", "==", examId), where("teacherId", "==", teacherId)),
    (snap) => cb(snap.docs.map((d) => ({ ...(d.data() as ExamSessionDoc), id: d.id }))),
    (err) => onError?.(err)
  );
}

export async function unlockSession(sessionId: string, note?: string): Promise<void> {
  const event: ExamEvent = { t: Date.now(), type: "unlock", severity: "info", ...(note ? { detail: note } : {}) };
  await updateDoc(doc(requireDb(), SESSIONS, sessionId), {
    state: "active",
    lockReason: null,
    events: arrayUnion(event),
  });
}

export async function forceSubmitSession(session: ExamSessionDoc): Promise<void> {
  const event: ExamEvent = { t: Date.now(), type: "force_submit", severity: "info", detail: "הוגש על ידי המורה" };
  await updateDoc(doc(requireDb(), SESSIONS, session.id), {
    state: "submitted",
    submittedAt: serverTimestamp(),
    receiptCode: session.receiptCode ?? receiptCode(),
    events: arrayUnion(event),
  });
}

/** All keystroke ops of a session, in time order. */
export async function loadKeylog(sessionId: string, teacherId: string): Promise<KeylogOp[]> {
  const snap = await getDocs(
    query(collection(requireDb(), SESSIONS, sessionId, "keylog"), where("teacherId", "==", teacherId))
  );
  return snap.docs
    .map((d) => d.data() as ExamKeylogChunk)
    .sort((a, b) => a.createdAt - b.createdAt)
    .flatMap((c) => parseOps(c.ops))
    .sort((a, b) => a[0] - b[0]);
}

/** Copies the essays into the grading inbox (one writing submission per student). */
export async function sendExamToGrading(
  bundle: TeacherExamBundle,
  sessions: ExamSessionDoc[],
  teacherName: string
): Promise<number> {
  const fdb = requireDb();
  const { exam, variants, answers } = bundle;
  const byKey = new Map(variants.map((v) => [v.key, v]));
  const hebrewById = new Map(answers.map((a) => [a.id, a]));
  const done = sessions.filter((s) => s.text.trim());
  const batch = writeBatch(fdb);
  done.forEach((s) => {
    const variant = byKey.get(s.variantKey) ?? variants[0];
    const locks = s.events.filter((e) => e.severity === "lock").length;
    const flags = s.events.filter((e) => e.severity === "flag").length;
    const submittedAt = tsMillis(s.submittedAt) ?? Date.now();
    const item: SubmissionItem = {
      id: `exam-${exam.id}-${s.studentId}`,
      type: "writing",
      studentId: s.studentId,
      studentName: s.studentName,
      teacherId: exam.teacherId,
      teacherName,
      studentClass: s.studentClass,
      taskId: `exam:${exam.id}:${s.variantKey}`,
      taskTitle: variant?.title ?? exam.title,
      hebrewTitle: `מבחן: ${exam.title}`,
      category: "exam",
      essayText: s.text,
      wordCount: s.wordCount,
      submittedAt: new Date(submittedAt).toISOString(),
      receiptCode: s.receiptCode ?? receiptCode(),
      status: "submitted",
      mode: "graded",
      examInfo: {
        examId: exam.id,
        variantKey: s.variantKey,
        prompt: variant?.prompt ?? "",
        minWords: exam.minWords,
        maxWords: exam.maxWords,
        minVocabUsed: exam.minVocabUsed,
        vocabTotal: exam.vocabHebrew.length,
        vocabUsed: s.vocabUsedIds
          .map((id) => hebrewById.get(id))
          .filter((w): w is ExamVocabAnswer => Boolean(w))
          .map((w) => ({ english: w.english, hebrew: w.hebrew })),
        locks,
        flags,
      },
    };
    batch.set(doc(fdb, "submissions", item.id), cleanForFirestore(item));
  });
  batch.update(doc(fdb, EXAMS, exam.id), { sentToGradingAt: new Date().toISOString() });
  await batch.commit();
  return done.length;
}

// ---------------------------------------------------------------------------
// Student
// ---------------------------------------------------------------------------

export async function findOpenExams(teacherId: string): Promise<ExamDoc[]> {
  const snap = await getDocs(
    query(collection(requireDb(), EXAMS), where("teacherId", "==", teacherId), where("status", "==", "open"))
  );
  return snap.docs.map((d) => ({ ...(d.data() as ExamDoc), id: d.id }));
}

export async function loadVariant(examId: string, key: string): Promise<ExamVariant | null> {
  const snap = await getDoc(doc(requireDb(), EXAMS, examId, "variants", key));
  return snap.exists() ? { ...(snap.data() as ExamVariant), key: snap.id } : null;
}

export async function getSession(examId: string, studentId: string): Promise<ExamSessionDoc | null> {
  const id = sessionIdFor(examId, studentId);
  const snap = await getDoc(doc(requireDb(), SESSIONS, id));
  return snap.exists() ? { ...(snap.data() as ExamSessionDoc), id } : null;
}

export async function createSession(session: Omit<ExamSessionDoc, "startedAt" | "lastSeenAt">): Promise<void> {
  await setDoc(doc(requireDb(), SESSIONS, session.id), {
    ...cleanForFirestore(session),
    startedAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
  });
}

export function subscribeSession(sessionId: string, cb: (s: ExamSessionDoc | null) => void): Unsubscribe {
  return onSnapshot(
    doc(requireDb(), SESSIONS, sessionId),
    (snap) => cb(snap.exists() ? { ...(snap.data() as ExamSessionDoc), id: snap.id } : null),
    () => undefined
  );
}

export interface SessionPatch {
  text?: string;
  wordCount?: number;
  vocabUsedIds?: string[];
  answers?: Record<string, ExamAnswer>;
  state?: "locked" | "submitted";
  lockReason?: string;
  receiptCode?: string;
  events?: ExamEvent[];
}

export async function patchSession(sessionId: string, patch: SessionPatch): Promise<void> {
  const { events, state, ...rest } = patch;
  const data: Record<string, unknown> = { ...rest, lastSeenAt: serverTimestamp() };
  if (state) data.state = state;
  if (state === "submitted") data.submittedAt = serverTimestamp();
  if (events && events.length) data.events = arrayUnion(...events);
  await updateDoc(doc(requireDb(), SESSIONS, sessionId), data);
}

export async function appendKeylog(
  sessionId: string,
  teacherId: string,
  studentId: string,
  ops: KeylogOp[]
): Promise<void> {
  if (ops.length === 0) return;
  const createdAt = Date.now();
  const chunk: ExamKeylogChunk = { teacherId, studentId, ops: JSON.stringify(ops), createdAt };
  await setDoc(
    doc(requireDb(), SESSIONS, sessionId, "keylog", `${createdAt}-${Math.random().toString(36).slice(2, 6)}`),
    chunk
  );
}

// ---------------------------------------------------------------------------
// Results (teacher grading) and release
// ---------------------------------------------------------------------------

export function subscribeExamResults(examId: string, cb: (results: ExamResultDoc[]) => void): Unsubscribe {
  return onSnapshot(
    collection(requireDb(), EXAMS, examId, "results"),
    (snap) => cb(snap.docs.map((d) => ({ ...(d.data() as ExamResultDoc), studentId: d.id }))),
    () => cb([])
  );
}

export async function saveExamResult(examId: string, result: ExamResultDoc): Promise<void> {
  await setDoc(
    doc(requireDb(), EXAMS, examId, "results", result.studentId),
    cleanForFirestore({ ...result, updatedAt: new Date().toISOString() })
  );
}

/** Writes the students' result submissions (no answer key inside) and marks the exam released. */
export async function releaseExamResults(examId: string, items: SubmissionItem[]): Promise<void> {
  const fdb = requireDb();
  // Firestore batches hold up to 500 writes.
  for (let i = 0; i < items.length; i += 400) {
    const batch = writeBatch(fdb);
    items.slice(i, i + 400).forEach((it) => batch.set(doc(fdb, "submissions", it.id), cleanForFirestore(it)));
    await batch.commit();
  }
  await updateDoc(doc(fdb, EXAMS, examId), { resultsReleasedAt: new Date().toISOString() });
}
