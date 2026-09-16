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
  classGrade?: string; // e.g. "ז" | "ח" | "ט"
  classNumber?: number; // 1-6
  fullClass?: string; // e.g. "ז׳2"
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
}
