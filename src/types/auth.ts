export type UserRole = "teacher" | "student" | null;

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
  classGrade?: string;
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
}
