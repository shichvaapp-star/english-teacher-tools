"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ActiveUser, StudentProfile, TeacherProfile, StudentGroup } from "@/types/auth";
import type { PublicStudent, PublicTeacher, RosterEntry, StudentAuthResponse } from "@/types/student-auth";
import { isBuiltInAdminEmail } from "@/config/admins";
import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
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

type Result = { success: boolean; error?: string };

interface AuthContextType {
  user: ActiveUser | null;
  /** Teacher directory. Public entries have no email; admins get the full records. */
  teachers: TeacherProfile[];
  loginTeacher: (email: string, password?: string) => Promise<Result>;
  registerTeacher: (data: { name: string; email: string; schoolName: string; password?: string }) => Promise<{ success: boolean; teacher?: TeacherProfile; error?: string }>;
  registerStudent: (data: {
    teacherId: string;
    studentName: string;
    classGrade: string;
    classNumber: number;
    group?: StudentGroup;
    pin: string;
  }) => Promise<Result>;
  loginStudent: (data: { teacherId: string; studentName: string; pin: string }) => Promise<Result>;
  /** Names for the student sign-in picker (no PINs). Works without being signed in. */
  getRoster: (teacherId: string) => Promise<RosterEntry[]>;
  /** Full student records. Only the owning teacher or an admin may read these. */
  getStudentsByTeacher: (teacherId: string) => Promise<StudentProfile[]>;
  addStudentByTeacher: (data: {
    studentName: string;
    classGrade: string;
    classNumber: number;
    group?: StudentGroup;
    pin: string;
  }) => Promise<{ success: boolean; student?: StudentProfile; error?: string }>;
  updateStudent: (studentId: string, updates: Partial<StudentProfile>) => Promise<Result>;
  deleteStudent: (studentId: string) => Promise<Result>;
  deleteTeacherAccount: (teacherId: string, options?: { transferToTeacherId?: string }) => Promise<Result>;
  updateTeacherAccount: (teacherId: string, updates: Partial<TeacherProfile>) => Promise<Result>;
  setTeacherAdminStatus: (teacherId: string, isAdmin: boolean) => Promise<Result>;
  logout: () => void;
  /** True until Firebase has told us who (if anyone) is signed in. */
  isLoading: boolean;
}

const emptySubscribe = () => () => {};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Keys from the old client-side login. They held the session (editable via DevTools)
 * and copies of student records with PINs, so they are wiped on load.
 */
const LEGACY_STORAGE_KEYS = ["ett_active_user", "ett_teachers_list", "ett_students_list"];

const isMockTeacher = (t: Partial<TeacherProfile>): boolean =>
  t.id === "teacher-1" ||
  t.id === "teacher-2" ||
  t.id === "teacher-3" ||
  (t.email ? t.email.toLowerCase().endsWith("@school.edu.il") : false);

function teacherFromDoc(id: string, d: Record<string, unknown>, fallbackEmail = ""): TeacherProfile {
  const email = String(d.email || fallbackEmail).toLowerCase().trim();
  return {
    id,
    name: String(d.name || "Teacher"),
    email,
    schoolName: String(d.schoolName || ""),
    teacherCode: String(d.teacherCode || ""),
    createdAt: String(d.createdAt || new Date().toISOString()),
    isAdmin: isBuiltInAdminEmail(email) || d.isAdmin === true,
  };
}

function teacherToActiveUser(t: TeacherProfile): ActiveUser {
  return {
    id: t.id,
    name: t.name,
    role: "teacher",
    email: t.email,
    schoolName: t.schoolName,
    teacherCode: t.teacherCode,
    isAdmin: !!t.isAdmin,
  };
}

function studentToActiveUser(s: PublicStudent): ActiveUser {
  return {
    id: s.id,
    name: s.name,
    role: "student",
    teacherId: s.teacherId,
    teacherName: s.teacherName,
    schoolName: s.schoolName,
    classGrade: s.classGrade,
    classNumber: s.classNumber,
    fullClass: s.fullClass,
    group: s.group,
  };
}

function publicToTeacherProfile(t: PublicTeacher): TeacherProfile {
  return { ...t, email: "" };
}

function errorMessage(err: unknown, fallback: string): string {
  const code = (err as { code?: string }).code;
  if (code === "permission-denied") return "You don't have permission to do that.";
  return (err as Error)?.message || fallback;
}

/** Builds the signed-in user from Firebase Auth + Firestore. The only source of truth. */
async function resolveUser(fbUser: FirebaseUser): Promise<ActiveUser | null> {
  if (!db) return null;
  const token = await fbUser.getIdTokenResult();

  if (token.claims.role === "student") {
    const snap = await getDoc(doc(db, "students", fbUser.uid));
    if (!snap.exists()) return null; // removed by the teacher
    const d = snap.data() as StudentProfile;
    return studentToActiveUser({
      id: snap.id,
      name: d.name,
      teacherId: d.teacherId,
      teacherName: d.teacherName,
      schoolName: typeof token.claims.schoolName === "string" ? token.claims.schoolName : "",
      classGrade: d.classGrade,
      classNumber: d.classNumber,
      fullClass: d.fullClass,
      group: d.group,
    });
  }

  if (!fbUser.email) return null;
  const snap = await getDoc(doc(db, "teachers", fbUser.uid));
  const profile = snap.exists()
    ? teacherFromDoc(snap.id, snap.data(), fbUser.email)
    : teacherFromDoc(fbUser.uid, { name: fbUser.displayName || fbUser.email.split("@")[0] }, fbUser.email);
  return teacherToActiveUser(profile);
}

async function callStudentAuth(path: string, body: object): Promise<StudentAuthResponse> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await res.json()) as StudentAuthResponse;
  } catch {
    return { error: "Could not reach the server. Check your internet connection." };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ActiveUser | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  // While a login/sign-up call is setting the user itself, the auth listener stands aside.
  const busyRef = useRef(false);

  useEffect(() => {
    try {
      LEGACY_STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Firebase Auth decides who is signed in.
  // Firebase failed to start in this browser: nothing to wait for. (Server render: keep loading.)
  const authUnavailable = useSyncExternalStore(emptySubscribe, () => auth === null, () => false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (busyRef.current) return;
      if (!fbUser) {
        setUser(null);
        setAuthResolved(true);
        return;
      }
      try {
        const resolved = await resolveUser(fbUser);
        if (!resolved && auth) await fbSignOut(auth);
        setUser(resolved);
      } catch (err) {
        console.warn("Could not restore session:", err);
        setUser(null);
      } finally {
        setAuthResolved(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Teacher directory: public fields for everyone, full records for admins.
  const isAdmin = !!user?.isAdmin;
  useEffect(() => {
    let isMounted = true;
    async function loadTeachers() {
      if (isAdmin && db) {
        try {
          const snap = await getDocs(collection(db, "teachers"));
          const list = snap.docs
            .map((d) => teacherFromDoc(d.id, d.data()))
            .filter((t) => !isMockTeacher(t));
          if (isMounted) setTeachers(list);
          return;
        } catch (err) {
          console.warn("Admin teacher list notice:", err);
        }
      }
      try {
        const res = await fetch("/api/public/teachers");
        const list = (await res.json()) as PublicTeacher[];
        if (isMounted && Array.isArray(list)) setTeachers(list.map(publicToTeacherProfile));
      } catch (err) {
        console.warn("Teacher directory notice:", err);
      }
    }
    loadTeachers();
    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const loginTeacher = async (email: string, password?: string): Promise<Result> => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!trimmedEmail) return { success: false, error: "Please enter your teacher email." };
    if (!cleanPassword) return { success: false, error: "Please enter your password." };
    if (!auth) return { success: false, error: "Sign-in is unavailable right now." };

    busyRef.current = true;
    try {
      const cred = await signInWithEmailAndPassword(auth, trimmedEmail, cleanPassword);
      const resolved = await resolveUser(cred.user);
      setUser(resolved);
      setAuthResolved(true);
      return resolved ? { success: true } : { success: false, error: "No teacher profile found for this account." };
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
      console.error("Firebase Auth signIn error:", authErr);
      return { success: false, error: errorMessage(authErr, "Failed to sign in.") };
    } finally {
      busyRef.current = false;
    }
  };

  const registerTeacher = async (data: {
    name: string;
    email: string;
    schoolName: string;
    password?: string;
  }): Promise<{ success: boolean; teacher?: TeacherProfile; error?: string }> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const cleanPassword = (data.password || "").trim();

    if (!data.name.trim()) return { success: false, error: "Please enter your full name." };
    if (!trimmedEmail) return { success: false, error: "Please enter your teacher email." };
    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }
    if (!auth || !db) return { success: false, error: "Sign-up is unavailable right now." };

    busyRef.current = true;
    try {
      let uid: string;
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
        console.error("Firebase Auth createUser error:", authErr);
        return { success: false, error: errorMessage(authErr, "Failed to create account.") };
      }

      const codeBase = data.name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "") || "TEACHER";
      const newTeacher: TeacherProfile = {
        id: uid,
        name: data.name.trim(),
        email: trimmedEmail,
        schoolName: data.schoolName.trim() || "Ben Gurion Middle School",
        teacherCode: `${codeBase}-${Math.floor(10 + Math.random() * 90)}`,
        createdAt: new Date().toISOString(),
        isAdmin: isBuiltInAdminEmail(trimmedEmail),
      };

      try {
        await setDoc(doc(db, "teachers", uid), newTeacher);
      } catch (dbErr) {
        console.warn("Firestore save teacher notice:", dbErr);
      }

      setTeachers((prev) => [publicToTeacherProfile(newTeacher), ...prev.filter((t) => t.id !== uid)]);
      setUser(teacherToActiveUser(newTeacher));
      setAuthResolved(true);
      return { success: true, teacher: newTeacher };
    } finally {
      busyRef.current = false;
    }
  };

  /** Shared tail of student login / sign-up: trade the server's token for a Firebase session. */
  const finishStudentAuth = async (res: StudentAuthResponse): Promise<Result> => {
    if (!res.token || !res.student) {
      return { success: false, error: res.error || "Something went wrong. Please try again." };
    }
    if (!auth) return { success: false, error: "Sign-in is unavailable right now." };
    busyRef.current = true;
    try {
      await signInWithCustomToken(auth, res.token);
      setUser(studentToActiveUser(res.student));
      setAuthResolved(true);
      return { success: true };
    } catch (err) {
      console.error("Student sign-in error:", err);
      return { success: false, error: errorMessage(err, "Sign-in failed. Please try again.") };
    } finally {
      busyRef.current = false;
    }
  };

  const registerStudent = async (data: {
    teacherId: string;
    studentName: string;
    classGrade: string;
    classNumber: number;
    group?: StudentGroup;
    pin: string;
  }): Promise<Result> => {
    const trimmedName = data.studentName.trim();
    if (!trimmedName || !/^[A-Za-z\s'-]+$/.test(trimmedName)) {
      return { success: false, error: "Please enter your full name in English letters only (A-Z)." };
    }
    if (data.pin.trim().length < 4) return { success: false, error: "PIN must be at least 4 digits." };
    return finishStudentAuth(
      await callStudentAuth("/api/student-auth/register", { ...data, studentName: trimmedName, pin: data.pin.trim() })
    );
  };

  const loginStudent = async (data: { teacherId: string; studentName: string; pin: string }): Promise<Result> => {
    if (!data.studentName.trim()) return { success: false, error: "Please enter or select your name." };
    if (data.pin.trim().length < 4) return { success: false, error: "PIN must be at least 4 digits." };
    return finishStudentAuth(
      await callStudentAuth("/api/student-auth/login", {
        teacherId: data.teacherId,
        studentName: data.studentName.trim(),
        pin: data.pin.trim(),
      })
    );
  };

  const getRoster = useCallback(async (teacherId: string): Promise<RosterEntry[]> => {
    if (!teacherId) return [];
    try {
      const res = await fetch(`/api/public/roster?teacherId=${encodeURIComponent(teacherId)}`);
      const list = (await res.json()) as RosterEntry[];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }, []);

  const getStudentsByTeacher = useCallback(async (teacherId: string): Promise<StudentProfile[]> => {
    if (!teacherId || !db) return [];
    try {
      const snap = await getDocs(query(collection(db, "students"), where("teacherId", "==", teacherId)));
      const students = snap.docs.map((d) => ({ ...(d.data() as StudentProfile), id: d.id }));
      students.sort((a, b) => a.name.localeCompare(b.name));
      return students;
    } catch (err) {
      console.warn("Firestore getStudentsByTeacher error:", err);
      return [];
    }
  }, []);

  const addStudentByTeacher = async (data: {
    studentName: string;
    classGrade: string;
    classNumber: number;
    group?: StudentGroup;
    pin: string;
  }): Promise<{ success: boolean; student?: StudentProfile; error?: string }> => {
    if (!user || user.role !== "teacher") {
      return { success: false, error: "Only teachers can add students to their roster." };
    }
    if (!db) return { success: false, error: "Database unavailable." };

    const trimmedName = data.studentName.trim();
    const cleanPin = data.pin.trim();
    if (!trimmedName || !/^[A-Za-z\s'-]+$/.test(trimmedName)) {
      return { success: false, error: "Please enter the student's full name in English letters only (A-Z)." };
    }
    if (cleanPin.length < 4) return { success: false, error: "PIN must be at least 4 digits." };

    const studentId = `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newStudent: StudentProfile = {
      id: studentId,
      name: trimmedName,
      pin: cleanPin,
      teacherId: user.id,
      teacherName: user.name,
      classGrade: data.classGrade,
      classNumber: data.classNumber,
      fullClass: `${data.classGrade}׳${data.classNumber}`,
      ...(data.group ? { group: data.group } : {}),
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "students", studentId), newStudent);
      return { success: true, student: newStudent };
    } catch (dbErr) {
      console.warn("Firestore save student error:", dbErr);
      return { success: false, error: errorMessage(dbErr, "Could not save the student.") };
    }
  };

  const updateStudent = async (studentId: string, updates: Partial<StudentProfile>): Promise<Result> => {
    if (!studentId) return { success: false, error: "Missing student ID." };
    if (!db) return { success: false, error: "Database unavailable." };
    try {
      await updateDoc(doc(db, "students", studentId), updates);
      return { success: true };
    } catch (dbErr) {
      console.warn("Firestore update student error:", dbErr);
      return { success: false, error: errorMessage(dbErr, "Could not update the student.") };
    }
  };

  const deleteStudent = async (studentId: string): Promise<Result> => {
    if (!studentId) return { success: false, error: "Missing student ID." };
    if (!db) return { success: false, error: "Database unavailable." };
    try {
      await deleteDoc(doc(db, "students", studentId));
      return { success: true };
    } catch (dbErr) {
      console.warn("Firestore delete student error:", dbErr);
      return { success: false, error: errorMessage(dbErr, "Could not delete the student.") };
    }
  };

  const updateTeacherAccount = async (teacherId: string, updates: Partial<TeacherProfile>): Promise<Result> => {
    if (!teacherId) return { success: false, error: "Missing teacher ID." };
    if (!db) return { success: false, error: "Database unavailable." };

    try {
      await updateDoc(doc(db, "teachers", teacherId), updates);
    } catch (dbErr) {
      console.warn("Firestore update teacher error:", dbErr);
      return { success: false, error: errorMessage(dbErr, "Could not update the teacher.") };
    }

    setTeachers((prev) => prev.map((t) => (t.id === teacherId ? { ...t, ...updates } : t)));
    if (user && user.id === teacherId) {
      setUser({
        ...user,
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.email ? { email: updates.email } : {}),
        ...(updates.schoolName ? { schoolName: updates.schoolName } : {}),
        ...(updates.teacherCode ? { teacherCode: updates.teacherCode } : {}),
        ...(typeof updates.isAdmin === "boolean" ? { isAdmin: updates.isAdmin } : {}),
      });
    }
    return { success: true };
  };

  const setTeacherAdminStatus = async (teacherId: string, isAdminValue: boolean): Promise<Result> =>
    updateTeacherAccount(teacherId, { isAdmin: isAdminValue });

  const deleteTeacherAccount = async (
    teacherId: string,
    options?: { transferToTeacherId?: string }
  ): Promise<Result> => {
    if (!teacherId) return { success: false, error: "Missing teacher ID." };
    if (user && user.id === teacherId) {
      return { success: false, error: "Cannot delete your own active admin account." };
    }
    if (!db) return { success: false, error: "Database unavailable." };
    const firestore = db;

    try {
      if (options?.transferToTeacherId) {
        const targetTeacher = teachers.find((t) => t.id === options.transferToTeacherId);
        if (!targetTeacher) {
          return { success: false, error: "Target teacher to transfer records to was not found." };
        }
        const moveTo = { teacherId: targetTeacher.id, teacherName: targetTeacher.name };

        for (const col of ["students", "assignments", "submissions"] as const) {
          try {
            const snap = await getDocs(query(collection(firestore, col), where("teacherId", "==", teacherId)));
            for (const d of snap.docs) {
              await updateDoc(doc(firestore, col, d.id), moveTo);
            }
          } catch (err) {
            console.warn(`Error transferring ${col} in Firestore:`, err);
          }
        }
      }

      await deleteDoc(doc(firestore, "teachers", teacherId));
      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      return { success: true };
    } catch (err: unknown) {
      console.error("deleteTeacherAccount error:", err);
      return { success: false, error: errorMessage(err, "Failed to delete teacher account.") };
    }
  };

  const logout = () => {
    setUser(null);
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
        getRoster,
        getStudentsByTeacher,
        addStudentByTeacher,
        updateStudent,
        deleteStudent,
        deleteTeacherAccount,
        updateTeacherAccount,
        setTeacherAdminStatus,
        logout,
        isLoading: !authResolved && !authUnavailable,
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
