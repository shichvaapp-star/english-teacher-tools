import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { findTeacher, issueStudentToken, verifyStudentLogin } from "@/lib/student-auth-server";
import type { StudentAuthResponse } from "@/types/student-auth";

interface LoginBody {
  teacherId?: unknown;
  studentName?: unknown;
  pin?: unknown;
}

function fail(status: number, error: string) {
  return NextResponse.json<StudentAuthResponse>({ error }, { status });
}

export async function POST(request: Request) {
  const admin = getFirebaseAdmin();
  if (!admin) return fail(503, "Student sign-in is not configured on the server.");

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return fail(400, "Invalid request.");
  }

  const teacherId = typeof body.teacherId === "string" ? body.teacherId : "";
  const studentName = typeof body.studentName === "string" ? body.studentName.trim() : "";
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";

  if (!studentName) return fail(400, "Please enter or select your name.");
  if (pin.length < 4) return fail(400, "PIN must be at least 4 digits.");

  try {
    const teacher = await findTeacher(admin.db, teacherId);
    if (!teacher) return fail(404, "Selected teacher not found. Please pick your teacher or check the code.");

    const result = await verifyStudentLogin(admin.db, teacher, studentName, pin);
    if (!result.ok) return fail(result.status, result.error);

    const token = await issueStudentToken(admin.auth, result.student);
    return NextResponse.json<StudentAuthResponse>({ token, student: result.student });
  } catch (err) {
    console.error("student login error:", err);
    return fail(500, "Sign-in failed. Please try again.");
  }
}
