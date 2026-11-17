import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { findTeacher, listStudentsOfTeacher } from "@/lib/student-auth-server";
import type { RosterEntry } from "@/types/student-auth";

export const dynamic = "force-dynamic";

/** Names in a teacher's class for the student sign-in picker. Never returns PINs or ids. */
export async function GET(request: Request) {
  const admin = getFirebaseAdmin();
  if (!admin) return NextResponse.json<RosterEntry[]>([], { status: 503 });

  const teacherId = new URL(request.url).searchParams.get("teacherId") || "";
  try {
    const teacher = await findTeacher(admin.db, teacherId);
    if (!teacher) return NextResponse.json<RosterEntry[]>([]);
    const students = await listStudentsOfTeacher(admin.db, teacher.id);
    const roster: RosterEntry[] = students
      .filter((s) => s.data.name)
      .map((s) => ({ name: s.data.name as string, fullClass: s.data.fullClass }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json<RosterEntry[]>(roster);
  } catch (err) {
    console.error("public roster error:", err);
    return NextResponse.json<RosterEntry[]>([], { status: 500 });
  }
}
