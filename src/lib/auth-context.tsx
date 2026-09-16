"use client";

import React, { createContext, useContext, useState } from "react";
import { ActiveUser, StudentProfile, TeacherProfile } from "@/types/auth";

interface AuthContextType {
  user: ActiveUser | null;
  teachers: TeacherProfile[];
  loginTeacher: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerTeacher: (data: { name: string; email: string; schoolName: string; password?: string }) => Promise<{ success: boolean; teacher?: TeacherProfile; error?: string }>;
  loginStudent: (data: { teacherId: string; studentName: string; pin: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const DEFAULT_TEACHERS: TeacherProfile[] = [
  {
    id: "teacher-1",
    name: "Sarah Cohen (שרה כהן)",
    email: "sarah.cohen@school.edu.il",
    schoolName: "Ironi Alef Tel Aviv",
    teacherCode: "COHEN-26",
    createdAt: new Date().toISOString(),
  },
  {
    id: "teacher-2",
    name: "David Levi (דוד לוי)",
    email: "david.levi@school.edu.il",
    schoolName: "Rabin Comprehensive Jerusalem",
    teacherCode: "LEVI-26",
    createdAt: new Date().toISOString(),
  },
  {
    id: "teacher-3",
    name: "Rachel Stern (רחל שטרן)",
    email: "rachel.stern@school.edu.il",
    schoolName: "Haifa Science & Arts",
    teacherCode: "STERN-26",
    createdAt: new Date().toISOString(),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "ett_active_user",
  TEACHERS: "ett_teachers_list",
  STUDENTS: "ett_students_list",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ActiveUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => {
    if (typeof window === "undefined") return DEFAULT_TEACHERS;
    try {
      const storedTeachers = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      if (storedTeachers) {
        const parsed = JSON.parse(storedTeachers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(DEFAULT_TEACHERS));
      return DEFAULT_TEACHERS;
    } catch {
      return DEFAULT_TEACHERS;
    }
  });

  const [isLoading] = useState(false);

  const loginTeacher = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    const existing = teachers.find((t) => t.email.toLowerCase() === trimmed);
    if (!existing) {
      return { success: false, error: "Teacher account not found. Please register first." };
    }

    const activeUser: ActiveUser = {
      id: existing.id,
      name: existing.name,
      role: "teacher",
      email: existing.email,
      schoolName: existing.schoolName,
      teacherCode: existing.teacherCode,
    };

    setUser(activeUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
    return { success: true };
  };

  const registerTeacher = async (data: {
    name: string;
    email: string;
    schoolName: string;
  }): Promise<{ success: boolean; teacher?: TeacherProfile; error?: string }> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    if (teachers.some((t) => t.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: "A teacher account with this email already exists." };
    }

    const codeBase = data.name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "") || "TEACHER";
    const newTeacher: TeacherProfile = {
      id: `teacher-${Date.now()}`,
      name: data.name.trim(),
      email: trimmedEmail,
      schoolName: data.schoolName.trim() || "Independent / Tutor",
      teacherCode: `${codeBase}-${Math.floor(10 + Math.random() * 90)}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newTeacher, ...teachers];
    setTeachers(updated);
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(updated));

    const activeUser: ActiveUser = {
      id: newTeacher.id,
      name: newTeacher.name,
      role: "teacher",
      email: newTeacher.email,
      schoolName: newTeacher.schoolName,
      teacherCode: newTeacher.teacherCode,
    };

    setUser(activeUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
    return { success: true, teacher: newTeacher };
  };

  const loginStudent = async (data: {
    teacherId: string;
    studentName: string;
    pin: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = data.studentName.trim();
    const cleanPin = data.pin.trim();

    if (!trimmedName) {
      return { success: false, error: "Please enter your name." };
    }
    if (cleanPin.length < 4) {
      return { success: false, error: "PIN must be at least 4 digits." };
    }

    const teacher = teachers.find((t) => t.id === data.teacherId || t.teacherCode.toLowerCase() === data.teacherId.toLowerCase());
    if (!teacher) {
      return { success: false, error: "Selected teacher not found. Please pick your teacher or check the code." };
    }

    // Retrieve or save student profile
    const storedStudentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const studentsList: StudentProfile[] = storedStudentsRaw ? JSON.parse(storedStudentsRaw) : [];

    let student = studentsList.find(
      (s) => s.teacherId === teacher.id && s.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (student) {
      // Validate PIN
      if (student.pin !== cleanPin) {
        return { success: false, error: "Incorrect PIN for this student name. Please try again." };
      }
    } else {
      // Create new student entry under this teacher
      student = {
        id: `student-${Date.now()}`,
        name: trimmedName,
        pin: cleanPin,
        teacherId: teacher.id,
        teacherName: teacher.name,
        createdAt: new Date().toISOString(),
      };
      studentsList.push(student);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(studentsList));
    }

    const activeUser: ActiveUser = {
      id: student.id,
      name: student.name,
      role: "student",
      teacherId: teacher.id,
      teacherName: teacher.name,
    };

    setUser(activeUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        teachers,
        loginTeacher,
        registerTeacher,
        loginStudent,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
