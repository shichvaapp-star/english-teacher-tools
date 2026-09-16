"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ActiveUser, StudentProfile, TeacherProfile } from "@/types/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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

  // Sync teachers from Firestore if available
  useEffect(() => {
    let isMounted = true;
    async function syncTeachersFromFirestore() {
      if (!db) return;
      try {
        const snap = await getDocs(collection(db, "teachers"));
        if (!snap.empty && isMounted) {
          const list: TeacherProfile[] = [];
          snap.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              name: data.name || "Teacher",
              email: data.email || "",
              schoolName: data.schoolName || "Ben Gurion Middle School",
              teacherCode: data.teacherCode || "",
              createdAt: data.createdAt || new Date().toISOString(),
            });
          });

          if (list.length > 0) {
            setTeachers((prev) => {
              const map = new Map<string, TeacherProfile>();
              prev.forEach((t) => map.set(t.id, t));
              list.forEach((t) => map.set(t.id, t));
              const merged = Array.from(map.values());
              try {
                localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(merged));
              } catch {
                // Ignore storage quota
              }
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn("Firestore fetch teachers notice:", err);
      }
    }
    syncTeachersFromFirestore();
    return () => {
      isMounted = false;
    };
  }, []);

  const loginTeacher = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!trimmedEmail) {
      return { success: false, error: "Please enter your teacher email." };
    }
    if (!cleanPassword) {
      return { success: false, error: "Please enter your password." };
    }

    let uid: string | null = null;

    if (auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, trimmedEmail, cleanPassword);
        uid = cred.user.uid;
      } catch (authErr: unknown) {
        const errCode = (authErr as { code?: string }).code;
        if (
          errCode === "auth/invalid-credential" ||
          errCode === "auth/wrong-password" ||
          errCode === "auth/user-not-found"
        ) {
          return { success: false, error: "Incorrect email or password. Please verify your credentials." };
        }
        if (errCode === "auth/too-many-requests") {
          return { success: false, error: "Too many failed attempts. Please try again in a few moments." };
        }
        if (errCode === "auth/invalid-email") {
          return { success: false, error: "Invalid email address format." };
        }
        console.warn("Firebase Auth signIn notice:", authErr);
      }
    }

    // Try finding teacher profile in existing list or Firestore
    let teacherProfile = teachers.find((t) => t.email.toLowerCase() === trimmedEmail || (uid && t.id === uid));

    if (!teacherProfile && db && uid) {
      try {
        const docSnap = await getDoc(doc(db, "teachers", uid));
        if (docSnap.exists()) {
          const d = docSnap.data();
          teacherProfile = {
            id: docSnap.id,
            name: d.name || "Teacher",
            email: d.email || trimmedEmail,
            schoolName: d.schoolName || "Ben Gurion Middle School",
            teacherCode: d.teacherCode || "TEACHER-01",
            createdAt: d.createdAt || new Date().toISOString(),
          };
        }
      } catch (dbErr) {
        console.warn("Firestore fetch teacher notice:", dbErr);
      }
    }

    if (!teacherProfile) {
      teacherProfile = {
        id: uid || `teacher-${Date.now()}`,
        name: trimmedEmail.split("@")[0],
        email: trimmedEmail,
        schoolName: "Ben Gurion Middle School",
        teacherCode: `TEACHER-${Math.floor(10 + Math.random() * 90)}`,
        createdAt: new Date().toISOString(),
      };
    }

    const activeUser: ActiveUser = {
      id: teacherProfile.id,
      name: teacherProfile.name,
      role: "teacher",
      email: teacherProfile.email,
      schoolName: teacherProfile.schoolName,
      teacherCode: teacherProfile.teacherCode,
    };

    setUser(activeUser);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
    } catch {
      // Ignore storage errors
    }
    return { success: true };
  };

  const registerTeacher = async (data: {
    name: string;
    email: string;
    schoolName: string;
    password?: string;
  }): Promise<{ success: boolean; teacher?: TeacherProfile; error?: string }> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const cleanPassword = (data.password || "").trim();

    if (!data.name.trim()) {
      return { success: false, error: "Please enter your full name." };
    }
    if (!trimmedEmail) {
      return { success: false, error: "Please enter your teacher email." };
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    let uid = `teacher-${Date.now()}`;

    if (auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, cleanPassword);
        uid = cred.user.uid;
        await updateProfile(cred.user, { displayName: data.name.trim() });
      } catch (authErr: unknown) {
        const errCode = (authErr as { code?: string }).code;
        if (errCode === "auth/email-already-in-use") {
          return { success: false, error: "An account with this email already exists. Please log in instead." };
        }
        if (errCode === "auth/weak-password") {
          return { success: false, error: "Password is too weak. Please use at least 6 characters." };
        }
        if (errCode === "auth/invalid-email") {
          return { success: false, error: "Please enter a valid email address." };
        }
        console.warn("Firebase Auth createUser notice:", authErr);
      }
    }

    const codeBase = data.name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "") || "TEACHER";
    const newTeacher: TeacherProfile = {
      id: uid,
      name: data.name.trim(),
      email: trimmedEmail,
      schoolName: data.schoolName.trim() || "Ben Gurion Middle School",
      teacherCode: `${codeBase}-${Math.floor(10 + Math.random() * 90)}`,
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await setDoc(doc(db, "teachers", uid), newTeacher);
      } catch (dbErr) {
        console.warn("Firestore save teacher notice:", dbErr);
      }
    }

    const updated = [newTeacher, ...teachers.filter((t) => t.email.toLowerCase() !== trimmedEmail)];
    setTeachers(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    const activeUser: ActiveUser = {
      id: newTeacher.id,
      name: newTeacher.name,
      role: "teacher",
      email: newTeacher.email,
      schoolName: newTeacher.schoolName,
      teacherCode: newTeacher.teacherCode,
    };

    setUser(activeUser);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
    } catch {
      // Ignore
    }
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

    const teacher = teachers.find(
      (t) => t.id === data.teacherId || t.teacherCode.toLowerCase() === data.teacherId.toLowerCase()
    );
    if (!teacher) {
      return { success: false, error: "Selected teacher not found. Please pick your teacher or check the code." };
    }

    // Retrieve or save student profile
    let studentsList: StudentProfile[] = [];
    try {
      const storedStudentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      studentsList = storedStudentsRaw ? JSON.parse(storedStudentsRaw) : [];
    } catch {
      studentsList = [];
    }

    let student = studentsList.find(
      (s) => s.teacherId === teacher.id && s.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (student) {
      if (student.pin !== cleanPin) {
        return { success: false, error: "Incorrect PIN for this student name. Please try again." };
      }
    } else {
      student = {
        id: `student-${Date.now()}`,
        name: trimmedName,
        pin: cleanPin,
        teacherId: teacher.id,
        teacherName: teacher.name,
        createdAt: new Date().toISOString(),
      };
      studentsList.push(student);
      try {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(studentsList));
      } catch {
        // Ignore
      }
    }

    const activeUser: ActiveUser = {
      id: student.id,
      name: student.name,
      role: "student",
      teacherId: teacher.id,
      teacherName: teacher.name,
    };

    setUser(activeUser);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
    } catch {
      // Ignore
    }
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {
      // Ignore
    }
    if (auth) {
      fbSignOut(auth).catch((err) => console.warn("Firebase signout notice:", err));
    }
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
