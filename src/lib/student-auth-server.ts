// Server-only helpers for student sign-in. Students log in with name + PIN; the
// PIN is checked here (never in the browser) and a Firebase custom token is issued
// so Firestore rules can tell which student is asking.
import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";
import { isStudentGender, type StudentGroup } from "@/types/auth";
import type { PublicStudent, PublicTeacher, StudentTokenClaims } from "@/types/student-auth";

const MAX_FAILURES = 8;
const LOCK_MINUTES = 10;
const GUARD_COLLECTION = "student_login_guards";

export const STUDENT_GROUPS: readonly StudentGroup[] = ["א1", "א2", "ב"];

interface StudentDoc {
  name?: string;
  pin?: string;
  teacherId?: string;
  teacherName?: string;
  classGrade?: string;
  classNumber?: number;
  fullClass?: string;
  group?: StudentGroup;
  gender?: string;
  createdAt?: string;
}

interface TeacherDoc {
  name?: string;
  email?: string;
  schoolName?: string;
  teacherCode?: string;
  createdAt?: string;
}

/** Placeholder accounts from the early prototype that should never be listed. */
function isMockTeacher(id: string, email: string): boolean {
  return (
    id === "teacher-1" ||
    id === "teacher-2" ||
    id === "teacher-3" ||
    email.toLowerCase().endsWith("@school.edu.il")
  );
}

function toPublicTeacher(id: string, d: TeacherDoc): PublicTeacher {
  return {
    id,
    name: d.name || "Teacher",
    schoolName: d.schoolName || "",
    teacherCode: d.teacherCode || "",
    createdAt: d.createdAt || "",
  };
}

export async function listPublicTeachers(db: Firestore): Promise<PublicTeacher[]> {
  const snap = await db.collection("teachers").get();
  const list: PublicTeacher[] = [];
  snap.forEach((docSnap) => {
    const d = docSnap.data() as TeacherDoc;
    if (!isMockTeacher(docSnap.id, d.email || "")) {
      list.push(toPublicTeacher(docSnap.id, d));
    }
  });
  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

/** Finds a teacher by document id or by teacher code (case-insensitive). */
export async function findTeacher(db: Firestore, idOrCode: string): Promise<PublicTeacher | null> {
  const key = idOrCode.trim();
  if (!key) return null;
  const byId = await db.collection("teachers").doc(key).get();
  if (byId.exists) return toPublicTeacher(byId.id, byId.data() as TeacherDoc);

  const all = await listPublicTeachers(db);
  return all.find((t) => t.teacherCode.toLowerCase() === key.toLowerCase()) || null;
}

function toPublicStudent(id: string, d: StudentDoc, teacher: PublicTeacher): PublicStudent {
  return {
    id,
    name: d.name || "",
    teacherId: teacher.id,
    teacherName: d.teacherName || teacher.name,
    schoolName: teacher.schoolName,
    classGrade: d.classGrade,
    classNumber: d.classNumber,
    fullClass: d.fullClass,
    group: d.group,
    gender: isStudentGender(d.gender) ? d.gender : undefined,
  };
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function listStudentsOfTeacher(
  db: Firestore,
  teacherId: string
): Promise<{ id: string; data: StudentDoc }[]> {
  const snap = await db.collection("students").where("teacherId", "==", teacherId).get();
  return snap.docs.map((d) => ({ id: d.id, data: d.data() as StudentDoc }));
}

interface GuardDoc {
  failures?: number;
  lockedUntil?: number;
}

async function isLocked(db: Firestore, studentId: string): Promise<boolean> {
  const snap = await db.collection(GUARD_COLLECTION).doc(studentId).get();
  const g = (snap.data() || {}) as GuardDoc;
  return typeof g.lockedUntil === "number" && g.lockedUntil > Date.now();
}

async function recordFailure(db: Firestore, studentId: string): Promise<void> {
  const ref = db.collection(GUARD_COLLECTION).doc(studentId);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const g = (snap.data() || {}) as GuardDoc;
    const expired = typeof g.lockedUntil === "number" && g.lockedUntil <= Date.now();
    const failures = (expired ? 0 : g.failures || 0) + 1;
    tx.set(ref, {
      failures,
      lockedUntil: failures >= MAX_FAILURES ? Date.now() + LOCK_MINUTES * 60_000 : null,
    });
  });
}

async function clearFailures(db: Firestore, studentId: string): Promise<void> {
  await db.collection(GUARD_COLLECTION).doc(studentId).delete();
}

export type LoginResult =
  | { ok: true; student: PublicStudent }
  | { ok: false; status: number; error: string };

export async function verifyStudentLogin(
  db: Firestore,
  teacher: PublicTeacher,
  studentName: string,
  pin: string
): Promise<LoginResult> {
  const wanted = normalizeName(studentName);
  const matches = (await listStudentsOfTeacher(db, teacher.id)).filter(
    (s) => normalizeName(s.data.name || "") === wanted
  );

  if (matches.length === 0) {
    return {
      ok: false,
      status: 404,
      error: "Student account not found for this teacher. Please use the Sign Up tab first.",
    };
  }

  for (const m of matches) {
    if (await isLocked(db, m.id)) {
      return {
        ok: false,
        status: 429,
        error: `Too many wrong PINs. Please wait ${LOCK_MINUTES} minutes or ask your teacher.`,
      };
    }
  }

  const hit = matches.find((m) => (m.data.pin || "") === pin);
  if (!hit) {
    await Promise.all(matches.map((m) => recordFailure(db, m.id)));
    return { ok: false, status: 401, error: "Incorrect 4-digit PIN. Please try again." };
  }

  await clearFailures(db, hit.id);
  return { ok: true, student: toPublicStudent(hit.id, hit.data, teacher) };
}

export async function createStudent(
  db: Firestore,
  teacher: PublicTeacher,
  input: { name: string; pin: string; classGrade: string; classNumber: number; group?: StudentGroup }
): Promise<LoginResult> {
  const wanted = normalizeName(input.name);
  const existing = await listStudentsOfTeacher(db, teacher.id);
  if (existing.some((s) => normalizeName(s.data.name || "") === wanted)) {
    return {
      ok: false,
      status: 409,
      error: "A student with this name already exists for this teacher. Please log in instead.",
    };
  }

  const id = `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const data: StudentDoc = {
    name: input.name,
    pin: input.pin,
    teacherId: teacher.id,
    teacherName: teacher.name,
    classGrade: input.classGrade,
    classNumber: input.classNumber,
    fullClass: `${input.classGrade}׳${input.classNumber}`,
    ...(input.group ? { group: input.group } : {}),
    createdAt: new Date().toISOString(),
  };
  await db.collection("students").doc(id).set({ id, ...data });
  return { ok: true, student: toPublicStudent(id, data, teacher) };
}

export async function issueStudentToken(auth: Auth, student: PublicStudent): Promise<string> {
  const claims: StudentTokenClaims = {
    role: "student",
    teacherId: student.teacherId,
    schoolName: student.schoolName,
  };
  return auth.createCustomToken(student.id, { ...claims });
}
