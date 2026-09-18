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
  query,
  where,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  user: ActiveUser | null;
  teachers: TeacherProfile[];
  loginTeacher: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerTeacher: (data: { name: string; email: string; schoolName: string; password?: string }) => Promise<{ success: boolean; teacher?: TeacherProfile; error?: string }>;
  registerStudent: (data: {
    teacherId: string;
    studentName: string;
    classGrade: string;
    classNumber: number;
    pin: string;
  }) => Promise<{ success: boolean; error?: string }>;
  loginStudent: (data: { teacherId: string; studentName: string; pin: string }) => Promise<{ success: boolean; error?: string }>;
  getStudentsByTeacher: (teacherId: string) => Promise<StudentProfile[]>;
  addStudentByTeacher: (data: {
    studentName: string;
    classGrade: string;
    classNumber: number;
    pin: string;
  }) => Promise<{ success: boolean; student?: StudentProfile; error?: string }>;
  updateStudent: (studentId: string, updates: Partial<StudentProfile>) => Promise<{ success: boolean; error?: string }>;
  deleteStudent: (studentId: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const isMockTeacher = (t: Partial<TeacherProfile>): boolean => {
  if (!t) return true;
  return (
    t.id === "teacher-1" ||
    t.id === "teacher-2" ||
    t.id === "teacher-3" ||
    t.email === "sarah.cohen@school.edu.il" ||
    t.email === "david.levi@school.edu.il" ||
    t.email === "rachel.stern@school.edu.il" ||
    (t.email ? t.email.endsWith("@school.edu.il") : false)
  );
};

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
    if (typeof window === "undefined") return [];
    try {
      const storedTeachers = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      if (storedTeachers) {
        const parsed = JSON.parse(storedTeachers);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter((t) => !isMockTeacher(t));
          localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(clean));
          return clean;
        }
      }
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify([]));
      return [];
    } catch {
      return [];
    }
  });

  const [isLoading] = useState(false);

  // Sync real teachers from Firestore if available
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
            const candidate: TeacherProfile = {
              id: docSnap.id,
              name: data.name || "Teacher",
              email: data.email || "",
              schoolName: data.schoolName || "Ben Gurion Middle School",
              teacherCode: data.teacherCode || "",
              createdAt: data.createdAt || new Date().toISOString(),
            };
            if (!isMockTeacher(candidate)) {
              list.push(candidate);
            }
          });

          if (isMounted) {
            setTeachers(list);
            try {
              localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(list));
            } catch {
              // Ignore storage quota
            }
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
        const errCode = (authErr as { code?: string; message?: string }).code;
        const errMsg = (authErr as { message?: string }).message;
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
        if (errCode === "auth/operation-not-allowed") {
          return {
            success: false,
            error:
              "Email/Password provider is disabled in Firebase! Go to Firebase Console -> Authentication -> Sign-in method, click 'Email/Password' and toggle 'Enable'.",
          };
        }
        console.error("Firebase Auth signIn error:", authErr);
        return {
          success: false,
          error: errMsg || "Failed to sign in with Firebase.",
        };
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
        const errCode = (authErr as { code?: string; message?: string }).code;
        const errMsg = (authErr as { message?: string }).message;
        if (errCode === "auth/email-already-in-use") {
          return { success: false, error: "An account with this email already exists. Please log in instead." };
        }
        if (errCode === "auth/weak-password") {
          return { success: false, error: "Password is too weak. Please use at least 6 characters." };
        }
        if (errCode === "auth/invalid-email") {
          return { success: false, error: "Please enter a valid email address." };
        }
        if (errCode === "auth/operation-not-allowed") {
          return {
            success: false,
            error:
              "Email/Password provider is disabled in Firebase! Go to Firebase Console -> Authentication -> Sign-in method, click 'Email/Password' and toggle 'Enable'.",
          };
        }
        console.error("Firebase Auth createUser error:", authErr);
        return {
          success: false,
          error: errMsg || "Failed to create account in Firebase.",
        };
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

  const registerStudent = async (data: {
    teacherId: string;
    studentName: string;
    classGrade: string;
    classNumber: number;
    pin: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = data.studentName.trim();
    const cleanPin = data.pin.trim();

    // Validate name is in English
    const englishNameRegex = /^[A-Za-z\s'-]+$/;
    if (!trimmedName || !englishNameRegex.test(trimmedName)) {
      return {
        success: false,
        error: "Please enter your full name in English letters only (A-Z).",
      };
    }
    if (cleanPin.length < 4) {
      return { success: false, error: "PIN must be at least 4 digits." };
    }

    const teacher = teachers.find(
      (t) => t.id === data.teacherId || t.teacherCode.toLowerCase() === data.teacherId.toLowerCase()
    );
    if (!teacher) {
      return { success: false, error: "Selected teacher not found. Please pick your teacher." };
    }

    const fullClass = `${data.classGrade}׳${data.classNumber}`;
    const studentId = `student-${Date.now()}`;
    const newStudent: StudentProfile = {
      id: studentId,
      name: trimmedName,
      pin: cleanPin,
      teacherId: teacher.id,
      teacherName: teacher.name,
      classGrade: data.classGrade,
      classNumber: data.classNumber,
      fullClass: fullClass,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Firestore for cross-device persistence
    if (db) {
      try {
        await setDoc(doc(db, "students", studentId), newStudent);
      } catch (dbErr) {
        console.warn("Firestore save student error:", dbErr);
      }
    }

    // 2. Save to local storage
    let studentsList: StudentProfile[] = [];
    try {
      const storedStudentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      studentsList = storedStudentsRaw ? JSON.parse(storedStudentsRaw) : [];
    } catch {
      studentsList = [];
    }
    studentsList.push(newStudent);
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(studentsList));
    } catch {
      // Ignore
    }

    // 3. Set active user session
    const activeUser: ActiveUser = {
      id: newStudent.id,
      name: newStudent.name,
      role: "student",
      teacherId: teacher.id,
      teacherName: teacher.name,
      schoolName: teacher.schoolName,
      classGrade: data.classGrade,
      classNumber: data.classNumber,
      fullClass: fullClass,
    };

    setUser(activeUser);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
    } catch {
      // Ignore
    }
    return { success: true };
  };

  const loginStudent = async (data: {
    teacherId: string;
    studentName: string;
    pin: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = data.studentName.trim().toLowerCase();
    const cleanPin = data.pin.trim();

    if (!trimmedName) {
      return { success: false, error: "Please enter or select your name." };
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

    let foundStudent: StudentProfile | null = null;

    // 1. Check Firestore for cross-device support
    if (db) {
      try {
        const q = query(
          collection(db, "students"),
          where("teacherId", "==", teacher.id)
        );
        const snap = await getDocs(q);
        snap.forEach((docSnap) => {
          const s = docSnap.data() as StudentProfile;
          if (s.name.toLowerCase().trim() === trimmedName) {
            foundStudent = { ...s, id: docSnap.id };
          }
        });
      } catch (err) {
        console.warn("Firestore student login lookup error:", err);
      }
    }

    // 2. Fallback to local storage
    if (!foundStudent) {
      try {
        const storedStudentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
        const studentsList: StudentProfile[] = storedStudentsRaw ? JSON.parse(storedStudentsRaw) : [];
        const match = studentsList.find(
          (s) => s.teacherId === teacher.id && s.name.toLowerCase().trim() === trimmedName
        );
        if (match) {
          foundStudent = match;
        }
      } catch {
        // Ignore
      }
    }

    if (!foundStudent) {
      return {
        success: false,
        error: "Student account not found for this teacher. Please use the Sign Up tab first.",
      };
    }

    if (foundStudent.pin !== cleanPin) {
      return { success: false, error: "Incorrect 4-digit PIN. Please try again." };
    }

    const activeUser: ActiveUser = {
      id: foundStudent.id,
      name: foundStudent.name,
      role: "student",
      teacherId: teacher.id,
      teacherName: teacher.name,
      schoolName: teacher.schoolName,
      classGrade: foundStudent.classGrade,
      classNumber: foundStudent.classNumber,
      fullClass: foundStudent.fullClass,
    };

    setUser(activeUser);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
    } catch {
      // Ignore
    }
    return { success: true };
  };

  const getStudentsByTeacher = async (teacherId: string): Promise<StudentProfile[]> => {
    if (!teacherId) return [];
    const teacher = teachers.find(
      (t) => t.id === teacherId || t.teacherCode.toLowerCase() === teacherId.toLowerCase()
    );
    const targetId = teacher ? teacher.id : teacherId;
    const listMap = new Map<string, StudentProfile>();

    // 1. From local storage
    try {
      const storedStudentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (storedStudentsRaw) {
        const localList: StudentProfile[] = JSON.parse(storedStudentsRaw);
        localList
          .filter((s) => s.teacherId === targetId)
          .forEach((s) => listMap.set(s.id || s.name.toLowerCase(), s));
      }
    } catch {
      // Ignore
    }

    // 2. From Firestore
    if (db) {
      try {
        const q = query(
          collection(db, "students"),
          where("teacherId", "==", targetId)
        );
        const snap = await getDocs(q);
        snap.forEach((docSnap) => {
          const s = docSnap.data() as StudentProfile;
          listMap.set(docSnap.id, { ...s, id: docSnap.id });
        });
      } catch (err) {
        console.warn("Firestore getStudentsByTeacher error:", err);
      }
    }

    const students = Array.from(listMap.values());
    students.sort((a, b) => a.name.localeCompare(b.name));
    return students;
  };

  const addStudentByTeacher = async (data: {
    studentName: string;
    classGrade: string;
    classNumber: number;
    pin: string;
  }): Promise<{ success: boolean; student?: StudentProfile; error?: string }> => {
    if (!user || user.role !== "teacher") {
      return { success: false, error: "Only teachers can add students to their roster." };
    }

    const trimmedName = data.studentName.trim();
    const cleanPin = data.pin.trim();

    const englishNameRegex = /^[A-Za-z\s'-]+$/;
    if (!trimmedName || !englishNameRegex.test(trimmedName)) {
      return {
        success: false,
        error: "Please enter the student's full name in English letters only (A-Z).",
      };
    }
    if (cleanPin.length < 4) {
      return { success: false, error: "PIN must be at least 4 digits." };
    }

    const fullClass = `${data.classGrade}׳${data.classNumber}`;
    const studentId = `student-${Date.now()}`;
    const newStudent: StudentProfile = {
      id: studentId,
      name: trimmedName,
      pin: cleanPin,
      teacherId: user.id,
      teacherName: user.name,
      classGrade: data.classGrade,
      classNumber: data.classNumber,
      fullClass: fullClass,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Firestore
    if (db) {
      try {
        await setDoc(doc(db, "students", studentId), newStudent);
      } catch (dbErr) {
        console.warn("Firestore save student error:", dbErr);
      }
    }

    // 2. Save to local storage
    try {
      const storedStudentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      const studentsList: StudentProfile[] = storedStudentsRaw ? JSON.parse(storedStudentsRaw) : [];
      studentsList.push(newStudent);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(studentsList));
    } catch {
      // Ignore
    }

    return { success: true, student: newStudent };
  };

  const updateStudent = async (
    studentId: string,
    updates: Partial<StudentProfile>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!studentId) {
      return { success: false, error: "Missing student ID." };
    }

    // 1. Update in Firestore
    if (db) {
      try {
        await updateDoc(doc(db, "students", studentId), updates);
      } catch (dbErr) {
        console.warn("Firestore update student error:", dbErr);
      }
    }

    // 2. Update in localStorage
    try {
      const storedStudentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (storedStudentsRaw) {
        const studentsList: StudentProfile[] = storedStudentsRaw ? JSON.parse(storedStudentsRaw) : [];
        const updatedList = studentsList.map((s) =>
          s.id === studentId ? { ...s, ...updates } : s
        );
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedList));
      }
    } catch {
      // Ignore
    }

    return { success: true };
  };

  const deleteStudent = async (studentId: string): Promise<{ success: boolean; error?: string }> => {
    if (!studentId) {
      return { success: false, error: "Missing student ID." };
    }

    // 1. Delete from Firestore
    if (db) {
      try {
        await deleteDoc(doc(db, "students", studentId));
      } catch (dbErr) {
        console.warn("Firestore delete student error:", dbErr);
      }
    }

    // 2. Delete from localStorage
    try {
      const storedStudentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (storedStudentsRaw) {
        const studentsList: StudentProfile[] = storedStudentsRaw ? JSON.parse(storedStudentsRaw) : [];
        const updatedList = studentsList.filter((s) => s.id !== studentId);
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedList));
      }
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
        registerStudent,
        loginStudent,
        getStudentsByTeacher,
        addStudentByTeacher,
        updateStudent,
        deleteStudent,
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
