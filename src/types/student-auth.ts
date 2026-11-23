import type { StudentGender, StudentGroup } from "@/types/auth";

/** Teacher fields that anyone may see (used by the student sign-in picker). No email. */
export interface PublicTeacher {
  id: string;
  name: string;
  schoolName: string;
  teacherCode: string;
  createdAt: string;
}

/** A roster entry for the student sign-in name picker. No PIN, no id. */
export interface RosterEntry {
  name: string;
  fullClass?: string;
}

/** Student profile returned after a successful sign-in. No PIN. */
export interface PublicStudent {
  id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  schoolName: string;
  classGrade?: string;
  classNumber?: number;
  fullClass?: string;
  group?: StudentGroup;
  gender?: StudentGender;
}

/** Custom claims placed on a student's Firebase token; Firestore rules read `role`. */
export interface StudentTokenClaims {
  role: "student";
  teacherId: string;
  schoolName: string;
}

export interface StudentAuthResponse {
  token?: string;
  student?: PublicStudent;
  error?: string;
}
