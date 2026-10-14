export type UserRole = "teacher" | "student" | null;
export type StudentGroup = "א1" | "א2" | "ב";

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  schoolName: string;
  teacherCode: string; // e.g. "COHEN-26"
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  pin: string; // 4-digit PIN
  teacherId: string;
  teacherName: string;
  classGrade?: string; // e.g. "ז" | "ח" | "ט"
  classNumber?: number; // 1-6
  fullClass?: string; // e.g. "ז׳2"
  group?: StudentGroup; // e.g. "א1" | "א2" | "ב"
  createdAt: string;
}

export interface ActiveUser {
  id: string;
  name: string;
  role: "teacher" | "student";
  email?: string;
  schoolName?: string;
  teacherCode?: string;
  teacherId?: string;
  teacherName?: string;
  classGrade?: string;
  classNumber?: number;
  fullClass?: string;
  group?: StudentGroup;
}

export function formatTeacherDisplayName(
  teacher: { name: string; schoolName?: string; teacherCode?: string },
  allTeachers: { name: string; schoolName?: string; teacherCode?: string }[] = []
): string {
  const teacherName = (teacher.name || "").trim();
  const sameNameCount = allTeachers.filter(
    (t) => (t.name || "").trim().toLowerCase() === teacherName.toLowerCase()
  ).length;

  if (sameNameCount <= 1) {
    return teacher.schoolName ? `${teacherName} • ${teacher.schoolName}` : teacherName;
  }

  const teacherSchool = (teacher.schoolName || "").trim();
  const sameNameAndSchoolCount = allTeachers.filter(
    (t) =>
      (t.name || "").trim().toLowerCase() === teacherName.toLowerCase() &&
      (t.schoolName || "").trim().toLowerCase() === teacherSchool.toLowerCase()
  ).length;

  if (sameNameAndSchoolCount > 1 && teacher.teacherCode) {
    return `${teacherName}${teacherSchool ? ` • ${teacherSchool}` : ""} (${teacher.teacherCode})`;
  }

  return teacherSchool ? `${teacherName} • ${teacherSchool}` : `${teacherName}${teacher.teacherCode ? ` (${teacher.teacherCode})` : ""}`;
}
