import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { STUDENT_GROUPS, createStudent, findTeacher, issueStudentToken } from "@/lib/student-auth-server";
import type { StudentGroup } from "@/types/auth";
import type { StudentAuthResponse } from "@/types/student-auth";

interface RegisterBody {
  teacherId?: unknown;
  studentName?: unknown;
  classGrade?: unknown;
  classNumber?: unknown;
  group?: unknown;
  pin?: unknown;
}

const ENGLISH_NAME = /^[A-Za-z\s'-]+$/;

function fail(status: number, error: string) {
  return NextResponse.json<StudentAuthResponse>({ error }, { status });
}

export async function POST(request: Request) {
  const admin = getFirebaseAdmin();
  if (!admin) return fail(503, "Student sign-up is not configured on the server.");

  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return fail(400, "Invalid request.");
  }

  const teacherId = typeof body.teacherId === "string" ? body.teacherId : "";
  const name = typeof body.studentName === "string" ? body.studentName.trim().replace(/\s+/g, " ") : "";
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";
  const classGrade = typeof body.classGrade === "string" ? body.classGrade.trim() : "";
  const classNumber = typeof body.classNumber === "number" ? body.classNumber : NaN;
  const group = STUDENT_GROUPS.find((g) => g === body.group) as StudentGroup | undefined;

  if (!name || name.length > 60 || !ENGLISH_NAME.test(name)) {
    return fail(400, "Please enter your full name in English letters only (A-Z).");
  }
  if (!/^\d{4,8}$/.test(pin)) return fail(400, "PIN must be 4 to 8 digits.");
  if (!classGrade || classGrade.length > 4) return fail(400, "Please pick your grade.");
  if (!Number.isInteger(classNumber) || classNumber < 1 || classNumber > 20) {
    return fail(400, "Please pick your class number.");
  }

  try {
    const teacher = await findTeacher(admin.db, teacherId);
    if (!teacher) return fail(404, "Selected teacher not found. Please pick your teacher.");

    const result = await createStudent(admin.db, teacher, { name, pin, classGrade, classNumber, group });
    if (!result.ok) return fail(result.status, result.error);

    const token = await issueStudentToken(admin.auth, result.student);
    return NextResponse.json<StudentAuthResponse>({ token, student: result.student });
  } catch (err) {
    console.error("student register error:", err);
    return fail(500, "Sign-up failed. Please try again.");
  }
}
