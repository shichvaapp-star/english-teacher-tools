import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { listPublicTeachers } from "@/lib/student-auth-server";
import type { PublicTeacher } from "@/types/student-auth";

export const dynamic = "force-dynamic";

/** Teacher directory for the student sign-in picker: names, schools and codes only. */
export async function GET() {
  const admin = getFirebaseAdmin();
  if (!admin) return NextResponse.json<PublicTeacher[]>([], { status: 503 });
  try {
    return NextResponse.json<PublicTeacher[]>(await listPublicTeachers(admin.db));
  } catch (err) {
    console.error("public teachers error:", err);
    return NextResponse.json<PublicTeacher[]>([], { status: 500 });
  }
}
