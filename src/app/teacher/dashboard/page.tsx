"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { cleanForFirestore } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import { TeacherAuthModal } from "@/components/auth/teacher-auth-modal";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  User,
  Users,
  UserPlus,
  KeyRound,
  Edit2,
  Copy,
  Check,
  RefreshCw,
  Printer,
  Trash2,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Send,
  Sparkles,
  Lock,
  Shuffle,
  Layers,
  Plus,
  MessageSquarePlus,
} from "lucide-react";

import { SubmissionItem } from "@/types/submission";
import { StudentProfile, StudentGroup } from "@/types/auth";
import { TeacherAssignment } from "@/types/assignment";
import { SiteSuggestion } from "@/types/suggestion";
import { ALL_WRITING_TASKS } from "@/data/writing-tasks";
import type { WritingEvaluationResult } from "@/app/api/evaluate-writing/route";

import { TurnInsTable, parseSubmissionTimestamp } from "./turn-ins-table";
import { ReviewDialog } from "./review-dialog";
import { AssignTaskModal } from "./assign-task-modal";
import { AssignedTasksView } from "./assigned-tasks-view";
import { AdminSuggestionsView } from "./admin-suggestions-view";

const LOCAL_SUBMISSIONS_KEY = "ett_writing_submissions";
const LOCAL_ASSIGNMENTS_KEY = "ett_teacher_assignments";
const LOCAL_SUGGESTIONS_KEY = "ett_site_suggestions";

export default function TeacherDashboardPage() {
  const {
    user,
    getStudentsByTeacher,
    addStudentByTeacher,
    updateStudent,
    deleteStudent,
  } = useAuth();

  // Active navigation view tab
  const [activeTab, setActiveTab] = useState<"submissions" | "assignments" | "students" | "suggestions">("submissions");

  // Site Suggestions State (Admin)
  const [suggestions, setSuggestions] = useState<SiteSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  // Submissions State
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "submitted" | "reviewed">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "writing" | "unseen">("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  // Assignments State
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignPreselectedStudentId, setAssignPreselectedStudentId] = useState<string | null>(null);

  // Students Roster State
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [studentClassFilter, setStudentClassFilter] = useState<string>("all");
  const [studentGroupFilter, setStudentGroupFilter] = useState<string>("all");
  const [showPins, setShowPins] = useState(false);
  const [copiedPinStudentId, setCopiedPinStudentId] = useState<string | null>(null);

  // Add / Edit Student Modal State
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [studentNameInput, setStudentNameInput] = useState("");
  const [studentGradeInput, setStudentGradeInput] = useState("ז");
  const [studentNumberInput, setStudentNumberInput] = useState<number>(1);
  const [studentGroupInput, setStudentGroupInput] = useState<StudentGroup | "none">("א1");
  const [studentPinInput, setStudentPinInput] = useState("");
  const [studentFormError, setStudentFormError] = useState<string | null>(null);
  const [isSavingStudent, setIsSavingStudent] = useState(false);

  // Student Submissions History Modal
  const [historyStudent, setHistoryStudent] = useState<StudentProfile | null>(null);

  // Selected submission for full modal review
  const [reviewItem, setReviewItem] = useState<SubmissionItem | null>(null);
  const [loadingAiSubId, setLoadingAiSubId] = useState<string | null>(null);
  const [isEvaluatingAi, setIsEvaluatingAi] = useState(false);
  const [writingAiResult, setWritingAiResult] = useState<WritingEvaluationResult | null>(null);

  // Auth modal for unauthorized users
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // FETCH SUBMISSIONS
  // ---------------------------------------------------------------------------
  const fetchSubmissions = async () => {
    setIsLoadingSubmissions(true);
    let items: SubmissionItem[] = [];

    // 1. Read local storage
    try {
      const localRaw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (localRaw) {
        items = JSON.parse(localRaw);
      }
    } catch {
      items = [];
    }

    // 2. Fetch from Firestore
    if (db && user && user.role === "teacher") {
      try {
        const snap = await getDocs(collection(db, "submissions"));
        const fbItems: SubmissionItem[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() as SubmissionItem;
          const belongsToMe =
            data.teacherId === user.id ||
            (user.teacherCode && data.teacherId?.toLowerCase() === user.teacherCode.toLowerCase()) ||
            (user.name && data.teacherName?.toLowerCase() === user.name.toLowerCase());

          if (belongsToMe) {
            fbItems.push({
              ...data,
              id: docSnap.id,
            });
          }
        });

        if (fbItems.length > 0) {
          const map = new Map<string, SubmissionItem>();
          items.forEach((item) => map.set(item.receiptCode || item.id, item));
          fbItems.forEach((item) => map.set(item.receiptCode || item.id, item));
          items = Array.from(map.values());
        }
      } catch (err) {
        console.warn("Firestore fetch submissions notice:", err);
      }
    }

    // Strictly sort newest turn-ins first
    items.sort((a, b) => {
      const timeA = parseSubmissionTimestamp(a.submittedAt);
      const timeB = parseSubmissionTimestamp(b.submittedAt);
      return timeB - timeA;
    });

    setSubmissions(items);
    setIsLoadingSubmissions(false);
  };

  // ---------------------------------------------------------------------------
  // FETCH STUDENTS
  // ---------------------------------------------------------------------------
  const fetchStudents = async () => {
    if (!user || user.role !== "teacher") return;
    setIsLoadingStudents(true);
    try {
      const list = await getStudentsByTeacher(user.id);
      setStudents(list);
    } catch (err) {
      console.warn("Error fetching students:", err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // ---------------------------------------------------------------------------
  // FETCH ASSIGNMENTS
  // ---------------------------------------------------------------------------
  const fetchAssignments = async () => {
    let list: TeacherAssignment[] = [];
    try {
      const localRaw = localStorage.getItem(LOCAL_ASSIGNMENTS_KEY);
      if (localRaw) {
        list = JSON.parse(localRaw);
      }
    } catch {
      list = [];
    }

    if (db && user && user.role === "teacher") {
      try {
        const snap = await getDocs(
          query(collection(db, "assignments"), where("teacherId", "==", user.id))
        );
        const fbItems: TeacherAssignment[] = [];
        snap.forEach((docSnap) => {
          fbItems.push({
            ...(docSnap.data() as TeacherAssignment),
            id: docSnap.id,
          });
        });
        if (fbItems.length > 0) {
          const map = new Map<string, TeacherAssignment>();
          list.forEach((a) => map.set(a.id, a));
          fbItems.forEach((a) => map.set(a.id, a));
          list = Array.from(map.values());
        }
      } catch (err) {
        console.warn("Firestore fetch assignments notice:", err);
      }
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAssignments(list);
  };

  // Fetch Site Suggestions (Admin)
  const fetchSuggestions = async () => {
    setIsLoadingSuggestions(true);
    let list: SiteSuggestion[] = [];

    // 1. From local storage
    try {
      const localRaw = localStorage.getItem(LOCAL_SUGGESTIONS_KEY);
      if (localRaw) {
        list = JSON.parse(localRaw);
      }
    } catch {
      list = [];
    }

    // 2. From Firestore
    if (db) {
      try {
        const snap = await getDocs(collection(db, "site_suggestions"));
        const fbItems: SiteSuggestion[] = [];
        snap.forEach((docSnap) => {
          fbItems.push({
            ...(docSnap.data() as Omit<SiteSuggestion, "id">),
            id: docSnap.id,
          });
        });
        if (fbItems.length > 0) {
          const map = new Map<string, SiteSuggestion>();
          list.forEach((i) => map.set(i.id, i));
          fbItems.forEach((i) => map.set(i.id, i));
          list = Array.from(map.values());
        }
      } catch (err) {
        console.warn("Firestore fetch suggestions notice:", err);
      }
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setSuggestions(list);
    setIsLoadingSuggestions(false);
  };

  const handleUpdateSuggestion = async (id: string, updates: Partial<SiteSuggestion>) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );

    // Local storage
    try {
      const localRaw = localStorage.getItem(LOCAL_SUGGESTIONS_KEY);
      if (localRaw) {
        const list: SiteSuggestion[] = JSON.parse(localRaw);
        const updated = list.map((s) => (s.id === id ? { ...s, ...updates } : s));
        localStorage.setItem(LOCAL_SUGGESTIONS_KEY, JSON.stringify(updated));
      }
    } catch {}

    // Firestore
    if (db) {
      try {
        await updateDoc(doc(db, "site_suggestions", id), updates);
      } catch (err) {
        console.warn("Firestore update suggestion notice:", err);
      }
    }
  };

  const handleDeleteSuggestion = async (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));

    // Local storage
    try {
      const localRaw = localStorage.getItem(LOCAL_SUGGESTIONS_KEY);
      if (localRaw) {
        const list: SiteSuggestion[] = JSON.parse(localRaw);
        const updated = list.filter((s) => s.id !== id);
        localStorage.setItem(LOCAL_SUGGESTIONS_KEY, JSON.stringify(updated));
      }
    } catch {}

    // Firestore
    if (db) {
      try {
        await deleteDoc(doc(db, "site_suggestions", id));
      } catch (err) {
        console.warn("Firestore delete suggestion notice:", err);
      }
    }
  };

  // Initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "suggestions") {
        setActiveTab("suggestions");
      }
    }

    if (user && user.role === "teacher") {
      fetchSubmissions();
      fetchStudents();
      fetchAssignments();
      fetchSuggestions();
    }
  }, [user]);

  // Real-time listener for suggestions
  useEffect(() => {
    if (!db || !user || user.role !== "teacher") return;

    const unsub = onSnapshot(
      collection(db, "site_suggestions"),
      (snap) => {
        const fbItems: SiteSuggestion[] = [];
        snap.forEach((docSnap) => {
          fbItems.push({
            ...(docSnap.data() as Omit<SiteSuggestion, "id">),
            id: docSnap.id,
          });
        });

        if (fbItems.length > 0) {
          setSuggestions((prev) => {
            const map = new Map<string, SiteSuggestion>();
            prev.forEach((i) => map.set(i.id, i));
            fbItems.forEach((i) => map.set(i.id, i));
            const merged = Array.from(map.values());
            merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return merged;
          });
        }
      },
      (err) => {
        console.warn("Real-time suggestions listener notice:", err);
      }
    );

    return () => unsub();
  }, [user]);

  // Real-time listener for incoming submissions
  useEffect(() => {
    if (!db || !user || user.role !== "teacher") return;

    const unsub = onSnapshot(
      collection(db, "submissions"),
      (snap) => {
        const fbItems: SubmissionItem[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() as SubmissionItem;
          const belongsToMe =
            data.teacherId === user.id ||
            (user.teacherCode && data.teacherId?.toLowerCase() === user.teacherCode.toLowerCase()) ||
            (user.name && data.teacherName?.toLowerCase() === user.name.toLowerCase());

          if (belongsToMe) {
            fbItems.push({
              ...data,
              id: docSnap.id,
            });
          }
        });

        if (fbItems.length > 0) {
          setSubmissions((prev) => {
            const map = new Map<string, SubmissionItem>();
            prev.forEach((item) => map.set(item.receiptCode || item.id, item));
            fbItems.forEach((item) => map.set(item.receiptCode || item.id, item));
            const merged = Array.from(map.values());
            merged.sort((a, b) => {
              const timeA = parseSubmissionTimestamp(a.submittedAt);
              const timeB = parseSubmissionTimestamp(b.submittedAt);
              return timeB - timeA;
            });
            return merged;
          });
        }
      },
      (err) => {
        console.warn("Real-time submissions listener notice:", err);
      }
    );

    return () => unsub();
  }, [user]);

  // Refresh all
  const handleRefreshAll = async () => {
    await Promise.all([fetchSubmissions(), fetchStudents(), fetchAssignments()]);
  };


  // Copy student PIN
  const handleCopyPin = (student: StudentProfile) => {
    navigator.clipboard.writeText(student.pin);
    setCopiedPinStudentId(student.id);
    setTimeout(() => setCopiedPinStudentId(null), 2000);
  };

  // ---------------------------------------------------------------------------
  // TASK ASSIGNMENT ACTIONS
  // ---------------------------------------------------------------------------
  const handleTaskAssigned = async (newAssignment: TeacherAssignment) => {
    // 1. Save to local storage
    const updated = [newAssignment, ...assignments];
    setAssignments(updated);
    try {
      localStorage.setItem(LOCAL_ASSIGNMENTS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // 2. Save to Firestore
    if (db) {
      try {
        await setDoc(doc(db, "assignments", newAssignment.id), cleanForFirestore(newAssignment));
      } catch (err) {
        console.warn("Could not save assignment to Firestore:", err);
      }
    }
  };

  const handleArchiveAssignment = async (id: string) => {
    if (!confirm("האם לארכב / למחוק משימה זו?")) return;

    const filtered = assignments.filter((a) => a.id !== id);
    setAssignments(filtered);
    try {
      localStorage.setItem(LOCAL_ASSIGNMENTS_KEY, JSON.stringify(filtered));
    } catch {
      // Ignore
    }

    if (db) {
      try {
        await deleteDoc(doc(db, "assignments", id));
      } catch (err) {
        console.warn("Firestore delete assignment error:", err);
      }
    }
  };

  const handleToggleAssignmentDavid = async (id: string, enabled: boolean) => {
    const updated = assignments.map((a) =>
      a.id === id
        ? {
            ...a,
            coachWithDavid: enabled,
            // If disabling David on an adaptive_david task, fall back to free_choice so the student can still pick a task
            isAdaptiveDavid: enabled ? a.isAdaptiveDavid : false,
          }
        : a
    );
    setAssignments(updated);
    try {
      localStorage.setItem(LOCAL_ASSIGNMENTS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    if (db) {
      try {
        await updateDoc(doc(db, "assignments", id), {
          coachWithDavid: enabled,
          ...(enabled ? {} : { isAdaptiveDavid: false }),
        });
      } catch (err) {
        console.warn("Firestore toggle assignment David notice:", err);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // REVIEW & GRADING ACTIONS
  // ---------------------------------------------------------------------------
  const handleOpenReview = (item: SubmissionItem) => {
    setReviewItem(item);
    if (item.writingRubric) {
      setWritingAiResult({
        score: item.grade ?? item.score ?? 0,
        encouragement: item.encouragement || "",
        teacherNote: item.teacherNote,
        isSpamOrGibberish: false,
        strengths: item.strengths || [],
        tips: item.tips || [],
        rubric: item.writingRubric,
        corrections: item.corrections,
        vocabularyUpgrades: item.vocabularyUpgrades,
      });
    } else {
      setWritingAiResult(null);
    }
  };

  // Quick Inline Save Grade
  const handleQuickSaveGrade = async (sub: SubmissionItem, grade?: number, feedback?: string) => {
    const reviewedItem: SubmissionItem = {
      ...sub,
      grade,
      teacherFeedback: feedback,
      status: "reviewed",
      reviewedAt: new Date().toLocaleString("he-IL"),
    };

    // 1. Update Firestore
    if (db) {
      try {
        await updateDoc(doc(db, "submissions", sub.id), cleanForFirestore({
          grade,
          teacherFeedback: feedback,
          status: "reviewed",
          reviewedAt: new Date().toISOString(),
        }));
      } catch (err) {
        console.warn("Firestore quick grade update notice:", err);
      }
    }

    // 2. Update localStorage
    try {
      const existingRaw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (existingRaw) {
        const list: SubmissionItem[] = JSON.parse(existingRaw);
        const updatedList = list.map((it) => (it.id === sub.id ? reviewedItem : it));
        localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(updatedList));
      }
    } catch {
      // Ignore
    }

    // 3. Update local state
    setSubmissions((prev) => prev.map((it) => (it.id === sub.id ? reviewedItem : it)));
    if (reviewItem?.id === sub.id) {
      setReviewItem(reviewedItem);
    }
  };

  // Full Modal Save Grade
  const handleSaveGradeModal = async (updatedItem: SubmissionItem) => {
    if (db) {
      try {
        await updateDoc(doc(db, "submissions", updatedItem.id), cleanForFirestore({
          grade: updatedItem.grade,
          teacherFeedback: updatedItem.teacherFeedback,
          status: "reviewed",
          reviewedAt: new Date().toISOString(),
          ...(writingAiResult ? {
            score: writingAiResult.score,
            encouragement: writingAiResult.encouragement,
            teacherNote: writingAiResult.teacherNote,
            strengths: writingAiResult.strengths,
            tips: writingAiResult.tips,
            writingRubric: writingAiResult.rubric,
            corrections: writingAiResult.corrections,
            vocabularyUpgrades: writingAiResult.vocabularyUpgrades,
          } : {}),
        }));
      } catch (err) {
        console.warn("Firestore update grade notice:", err);
      }
    }

    try {
      const existingRaw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (existingRaw) {
        const list: SubmissionItem[] = JSON.parse(existingRaw);
        const updatedList = list.map((it) => (it.id === updatedItem.id ? updatedItem : it));
        localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(updatedList));
      }
    } catch {
      // Ignore
    }

    setSubmissions((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    setReviewItem(updatedItem);
  };

  // AI Review Action
  const handleAiReview = async (sub: SubmissionItem) => {
    setLoadingAiSubId(sub.id);
    handleOpenReview(sub);

    if (sub.type === "writing") {
      setIsEvaluatingAi(true);
      setWritingAiResult(null);

      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (typeof window !== "undefined") {
          const groq = localStorage.getItem("ett_groq_api_key");
          const gemini = localStorage.getItem("ett_gemini_api_key");
          const openai = localStorage.getItem("ett_openai_api_key");
          if (groq) headers["x-groq-api-key"] = groq;
          if (gemini) headers["x-gemini-api-key"] = gemini;
          if (openai) headers["x-openai-api-key"] = openai;
        }

        const matchedTask = ALL_WRITING_TASKS.find(
          (t) => t.id === sub.taskId || t.title.toLowerCase() === (sub.taskTitle || "").toLowerCase()
        );

        const res = await fetch("/api/evaluate-writing", {
          method: "POST",
          headers,
          body: JSON.stringify({
            essayText: (sub.essayText || "").trim(),
            taskTitle: matchedTask?.title || sub.taskTitle || sub.hebrewTitle,
            prompt: matchedTask?.prompt || sub.hebrewTitle || sub.taskTitle,
            category: matchedTask?.category || sub.category || "opinion",
            level: matchedTask?.level || (sub.storyLevel as any) || "Level 2",
            minWords: matchedTask?.minWords || 15,
            maxWords: matchedTask?.maxWords || 120,
          }),
        });

        const data = await res.json();
        if (data.success && data.evaluation) {
          const evalRes: WritingEvaluationResult = data.evaluation;
          setWritingAiResult(evalRes);
        } else {
          alert(data.error || "אירעה שגיאה בבדיקת ה-AI. אנא נסו שוב.");
        }
      } catch (err) {
        console.error("AI Review error:", err);
        alert("לא ניתן היה להתחבר לשירות בדיקת ה-AI.");
      } finally {
        setIsEvaluatingAi(false);
        setLoadingAiSubId(null);
      }
    } else {
      setLoadingAiSubId(null);
    }
  };

  // Delete submission
  const handleDeleteSubmission = async (id: string, studentName: string) => {
    if (!confirm(`האם למחוק את ההגשה של התלמיד/ה "${studentName}"?`)) return;

    if (db) {
      try {
        await deleteDoc(doc(db, "submissions", id));
      } catch (err) {
        console.warn("Firestore delete notice:", err);
      }
    }

    try {
      const existingRaw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (existingRaw) {
        const list: SubmissionItem[] = JSON.parse(existingRaw);
        localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(list.filter((it) => it.id !== id)));
      }
    } catch {
      // Ignore
    }

    setSubmissions((prev) => prev.filter((it) => it.id !== id));
    if (reviewItem?.id === id) setReviewItem(null);
  };

  // ---------------------------------------------------------------------------
  // STUDENT ROSTER ACTIONS (Including Manual Grouping Editing)
  // ---------------------------------------------------------------------------
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setStudentNameInput("");
    setStudentGradeInput("ז");
    setStudentNumberInput(1);
    setStudentGroupInput("א1");
    setStudentPinInput(String(Math.floor(1000 + Math.random() * 9000)));
    setStudentFormError(null);
    setStudentModalOpen(true);
  };

  const handleOpenEditStudent = (student: StudentProfile) => {
    setEditingStudent(student);
    setStudentNameInput(student.name);
    setStudentGradeInput(student.classGrade || "ז");
    setStudentNumberInput(student.classNumber || 1);
    setStudentGroupInput(student.group || "א1");
    setStudentPinInput(student.pin || "");
    setStudentFormError(null);
    setStudentModalOpen(true);
  };

  const handleGenerateRandomPin = () => {
    setStudentPinInput(String(Math.floor(1000 + Math.random() * 9000)));
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentFormError(null);

    const cleanName = studentNameInput.trim();
    const cleanPin = studentPinInput.trim();

    const englishNameRegex = /^[A-Za-z\s'-]+$/;
    if (!cleanName || !englishNameRegex.test(cleanName)) {
      setStudentFormError("יש להזין שם מלא באותיות אנגלית בלבד (A-Z).");
      return;
    }

    if (cleanPin.length < 4 || !/^\d{4}$/.test(cleanPin)) {
      setStudentFormError("קוד ה-PIN חייב להכיל בדיוק 4 ספרות (לדוגמה: 1234).");
      return;
    }

    setIsSavingStudent(true);
    const chosenGroup: StudentGroup | undefined =
      studentGroupInput === "none" ? undefined : (studentGroupInput as StudentGroup);

    if (editingStudent) {
      const fullClass = `${studentGradeInput}׳${studentNumberInput}`;
      const res = await updateStudent(editingStudent.id, {
        name: cleanName,
        classGrade: studentGradeInput,
        classNumber: studentNumberInput,
        fullClass,
        group: chosenGroup,
        pin: cleanPin,
      });
      setIsSavingStudent(false);

      if (res.success) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === editingStudent.id
              ? {
                  ...s,
                  name: cleanName,
                  classGrade: studentGradeInput,
                  classNumber: studentNumberInput,
                  fullClass,
                  group: chosenGroup,
                  pin: cleanPin,
                }
              : s
          )
        );
        setStudentModalOpen(false);
        setEditingStudent(null);
      } else {
        setStudentFormError(res.error || "שגיאה בעדכון פרטי התלמיד/ה.");
      }
    } else {
      const res = await addStudentByTeacher({
        studentName: cleanName,
        classGrade: studentGradeInput,
        classNumber: studentNumberInput,
        group: chosenGroup,
        pin: cleanPin,
      });
      setIsSavingStudent(false);

      if (res.success && res.student) {
        setStudents((prev) =>
          [...prev, res.student!].sort((a, b) => a.name.localeCompare(b.name))
        );
        setStudentModalOpen(false);
      } else {
        setStudentFormError(res.error || "שגיאה בהוספת התלמיד/ה.");
      }
    }
  };

  const handleDeleteStudent = async (student: StudentProfile) => {
    if (!confirm(`האם להסיר את התלמיד/ה "${student.name}" (${student.fullClass || "כיתה"})?`)) return;

    const res = await deleteStudent(student.id);
    if (res.success) {
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
      if (historyStudent?.id === student.id) setHistoryStudent(null);
    } else {
      alert(res.error || "שגיאה בהסרת התלמיד/ה.");
    }
  };

  // ---------------------------------------------------------------------------
  // FILTERING & STATS
  // ---------------------------------------------------------------------------
  // Available classes for filters
  const availableClasses = useMemo(() => {
    const classSet = new Set<string>(["ז'1", "ז'2", "ז'3", "ח'1", "ח'2", "ח'3", "ט'1", "ט'2", "ט'3"]);
    students.forEach((s) => {
      if (s.fullClass) classSet.add(s.fullClass);
    });
    submissions.forEach((sub) => {
      if (sub.studentClass) classSet.add(sub.studentClass);
    });
    return Array.from(classSet).sort();
  }, [students, submissions]);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesStudent = item.studentName.toLowerCase().includes(q);
        const matchesTitle = item.hebrewTitle.toLowerCase().includes(q) || item.taskTitle.toLowerCase().includes(q);
        const matchesCode = item.receiptCode?.toLowerCase().includes(q);
        if (!matchesStudent && !matchesTitle && !matchesCode) return false;
      }
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (classFilter !== "all" && item.studentClass !== classFilter) return false;
      if (groupFilter !== "all" && item.studentGroup !== groupFilter) return false;
      return true;
    });
  }, [submissions, searchQuery, statusFilter, typeFilter, classFilter, groupFilter]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (studentSearchQuery.trim()) {
        const q = studentSearchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesClass = (s.fullClass || "").toLowerCase().includes(q);
        if (!matchesName && !matchesClass) return false;
      }
      if (studentClassFilter !== "all") {
        if (s.fullClass !== studentClassFilter && s.classGrade !== studentClassFilter) return false;
      }
      if (studentGroupFilter !== "all") {
        if (s.group !== studentGroupFilter) return false;
      }
      return true;
    });
  }, [students, studentSearchQuery, studentClassFilter, studentGroupFilter]);

  // Metrics
  const totalSubmissionsCount = submissions.length;
  const pendingSubmissionsCount = submissions.filter((s) => s.status === "submitted").length;
  const reviewedSubmissionsCount = submissions.filter((s) => s.status === "reviewed").length;
  const activeAssignmentsCount = assignments.filter((a) => a.status === "active").length;

  // Student stats helper
  const getStudentStats = (student: StudentProfile) => {
    const studentSubs = submissions.filter(
      (sub) =>
        sub.studentId === student.id ||
        sub.studentName.toLowerCase().trim() === student.name.toLowerCase().trim()
    );
    const gradedSubs = studentSubs.filter((sub) => sub.grade !== undefined || sub.score !== undefined);
    const avgScore =
      gradedSubs.length > 0
        ? Math.round(
            gradedSubs.reduce((acc, curr) => acc + (curr.grade ?? curr.score ?? 0), 0) /
              gradedSubs.length
          )
        : null;

    return {
      total: studentSubs.length,
      average: avgScore,
      submissions: studentSubs,
    };
  };

  // ---------------------------------------------------------------------------
  // AUTH GUARD
  // ---------------------------------------------------------------------------
  if (!user || user.role !== "teacher") {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
            <HeaderTooltip label="חזרה לדף הראשי">
              <Link
                href="/"
                className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition-colors"
                aria-label="חזרה לדף הראשי"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </HeaderTooltip>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="h-4 w-[1px] bg-border" />
              <UserNav />
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-border/80 shadow-lg text-center p-6 space-y-5" dir="rtl">
            <div className="p-3.5 rounded-2xl bg-destructive/10 text-destructive w-16 h-16 mx-auto flex items-center justify-center">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-xl font-black text-foreground">
                אזור מורים בלבד (Teacher Portal)
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                לוח הבקרה מיועד למורי אנגלית לצורך צפייה וניהול של הגשות תלמידים, הקצאת משימות ומתן משוב.
              </CardDescription>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="w-full gap-2 text-xs font-bold cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <GraduationCap className="h-4 w-4" />
                <span>התחברות כמורה מורשה</span>
              </Button>

              <Link href="/" className="block">
                <Button variant="outline" className="w-full text-xs cursor-pointer">
                  חזרה לדף הבית
                </Button>
              </Link>
            </div>
          </Card>
        </main>

        <TeacherAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN DASHBOARD VIEW
  // ---------------------------------------------------------------------------
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <HeaderTooltip label="חזרה לדף הראשי">
              <Link
                href="/"
                className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition-colors shrink-0"
                aria-label="ראשי"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </HeaderTooltip>
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-bold text-xs sm:text-base truncate">
                <span>לוח מורה</span>
                <span className="hidden sm:inline"> &bull; {user.schoolName || "חטיבת ביניים"}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            <HeaderTooltip label="רענון נתונים">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefreshAll}
                disabled={isLoadingSubmissions || isLoadingStudents}
                className="h-9 w-9 cursor-pointer border-border/80 shrink-0"
                aria-label="רענן"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isLoadingSubmissions || isLoadingStudents ? "animate-spin text-primary" : ""
                  }`}
                />
              </Button>
            </HeaderTooltip>

            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-3 sm:px-8 py-5 sm:py-7 space-y-5">
        {/* Minimalist Greeting & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden" dir="rtl">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-foreground">
              שלום, {user.name}! 👋
            </h1>
            <p className="text-xs text-muted-foreground">
              לוח הבקרה המרכזי למעקב אחר הגשות, מתן ציונים והקצאת משימות לתלמידים.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setAssignModalOpen(true)}
              className="h-9 text-xs font-bold gap-1.5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs px-4"
            >
              <Send className="h-3.5 w-3.5" />
              <span>הקצה משימה חדשה</span>
            </Button>
          </div>
        </div>

        {/* Minimalist KPI Metrics Strip - Compact Single Row */}
        <div className="grid grid-cols-4 gap-2 print:hidden" dir="rtl">
          <button
            type="button"
            onClick={() => {
              setActiveTab("submissions");
              setStatusFilter("all");
            }}
            className={`py-1.5 px-3 rounded-lg border text-right transition-all cursor-pointer shadow-2xs flex items-center justify-between ${
              activeTab === "submissions" && statusFilter === "all"
                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
                : "border-border/70 bg-card hover:border-primary/30 hover:bg-muted/30"
            }`}
          >
            <span className="text-[11px] text-muted-foreground font-medium">סה״כ הגשות</span>
            <span className="text-sm font-black text-foreground">{totalSubmissionsCount}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("submissions");
              setStatusFilter("submitted");
            }}
            className={`py-1.5 px-3 rounded-lg border text-right transition-all cursor-pointer shadow-2xs flex items-center justify-between ${
              activeTab === "submissions" && statusFilter === "submitted"
                ? "border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/30"
                : "border-border/70 bg-card hover:border-amber-500/30 hover:bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground font-medium">ממתינות לבדיקה</span>
              {pendingSubmissionsCount > 0 && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </div>
            <span className="text-sm font-black text-amber-600 dark:text-amber-400">
              {pendingSubmissionsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("submissions");
              setStatusFilter("reviewed");
            }}
            className={`py-1.5 px-3 rounded-lg border text-right transition-all cursor-pointer shadow-2xs flex items-center justify-between ${
              activeTab === "submissions" && statusFilter === "reviewed"
                ? "border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/30"
                : "border-border/70 bg-card hover:border-emerald-500/30 hover:bg-muted/30"
            }`}
          >
            <span className="text-[11px] text-muted-foreground font-medium">נבדקו וניתן ציון</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {reviewedSubmissionsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("assignments")}
            className={`py-1.5 px-3 rounded-lg border text-right transition-all cursor-pointer shadow-2xs flex items-center justify-between ${
              activeTab === "assignments"
                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
                : "border-border/70 bg-card hover:border-primary/30 hover:bg-muted/30"
            }`}
          >
            <span className="text-[11px] text-muted-foreground font-medium">משימות שהוקצו</span>
            <span className="text-sm font-black text-foreground">
              {activeAssignmentsCount}
            </span>
          </button>
        </div>

        {/* Segmented Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-2.5 print:hidden" dir="rtl">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("submissions")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "submissions"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>טבלת הגשות ובדיקה</span>
              <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
                activeTab === "submissions" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {totalSubmissionsCount}
              </span>
              {pendingSubmissionsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white">
                  {pendingSubmissionsCount} להערכה
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("assignments")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "assignments"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>משימות שהוקצו</span>
              <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
                activeTab === "assignments" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {assignments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("students")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "students"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>ניהול תלמידים רשומים</span>
              <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
                activeTab === "students" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {students.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("suggestions")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "suggestions"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>הצעות ומשוב (Admin)</span>
              <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
                activeTab === "suggestions" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {suggestions.length}
              </span>
              {suggestions.filter((s) => s.status === "new").length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white">
                  {suggestions.filter((s) => s.status === "new").length} חדשות
                </span>
              )}
            </button>
          </div>

          {activeTab === "students" && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handleOpenAddStudent}
                className="h-8 text-xs font-bold gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>הוסף תלמיד/ה</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="h-8 text-xs gap-1.5 cursor-pointer border-border/80"
                title="הדפס כרטיסי תלמידים"
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">הדפס רשימת כיתה</span>
              </Button>
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------------
            TAB 1: SUBMISSIONS TABLE VIEW
            ------------------------------------------------------------------- */}
        {activeTab === "submissions" && (
          <div className="space-y-4 print:hidden" dir="rtl">
            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Status Segmented Tabs */}
                <div className="inline-flex rounded-lg p-0.5 bg-muted/60 border border-border/80 text-xs">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer text-xs ${
                      statusFilter === "all" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    הכל ({totalSubmissionsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("submitted")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer text-xs ${
                      statusFilter === "submitted" ? "bg-amber-500/20 text-amber-800 dark:text-amber-200" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ממתין ({pendingSubmissionsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("reviewed")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer text-xs ${
                      statusFilter === "reviewed" ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-200" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    נבדקו ({reviewedSubmissionsCount})
                  </button>
                </div>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as "all" | "writing" | "unseen")}
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="all">כל המשימות</option>
                  <option value="writing">✍️ כתיבה</option>
                  <option value="unseen">📖 אנסין</option>
                </select>

                {/* Class Filter */}
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="all">כל הכיתות</option>
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      כיתה {cls}
                    </option>
                  ))}
                </select>

                {/* Grouping Filter */}
                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="all">כל ההקבצות</option>
                  <option value="א1">הקבצה א1</option>
                  <option value="א2">הקבצה א2</option>
                  <option value="ב">הקבצה ב</option>
                </select>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="h-3.5 w-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="חיפוש לפי תלמיד, משימה או קוד..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pr-8 pl-3 text-xs w-full"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Turn-ins Data Table */}
            <TurnInsTable
              submissions={filteredSubmissions}
              onOpenFullReview={handleOpenReview}
              onAiReview={handleAiReview}
              onDeleteSubmission={handleDeleteSubmission}
              onQuickSaveGrade={handleQuickSaveGrade}
              loadingAiSubId={loadingAiSubId}
            />
          </div>
        )}

        {/* -------------------------------------------------------------------
            TAB 2: ASSIGNED TASKS VIEW
            ------------------------------------------------------------------- */}
        {activeTab === "assignments" && (
          <div className="print:hidden">
            <AssignedTasksView
              assignments={assignments}
              submissions={submissions}
              students={students}
              onArchiveAssignment={handleArchiveAssignment}
              onToggleDavid={handleToggleAssignmentDavid}
              onOpenAssignModal={() => setAssignModalOpen(true)}
            />
          </div>
        )}

        {/* -------------------------------------------------------------------
            TAB 3: STUDENTS ROSTER VIEW
            ------------------------------------------------------------------- */}
        {activeTab === "students" && (
          <div className="space-y-4 print:hidden" dir="rtl">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Class Filter */}
                <select
                  value={studentClassFilter}
                  onChange={(e) => setStudentClassFilter(e.target.value)}
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-2xs cursor-pointer"
                >
                  <option value="all">כל הכיתות ({students.length})</option>
                  {availableClasses.map((cls) => {
                    const countInClass = students.filter(
                      (s) => s.fullClass === cls || s.classGrade === cls
                    ).length;
                    return (
                      <option key={cls} value={cls}>
                        כיתה {cls} ({countInClass})
                      </option>
                    );
                  })}
                </select>

                {/* Grouping Filter */}
                <select
                  value={studentGroupFilter}
                  onChange={(e) => setStudentGroupFilter(e.target.value)}
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-2xs cursor-pointer"
                >
                  <option value="all">כל ההקבצות</option>
                  <option value="א1">הקבצה א1</option>
                  <option value="א2">הקבצה א2</option>
                  <option value="ב">הקבצה ב</option>
                </select>

                {/* Show PINs Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPins(!showPins)}
                  className="h-8 text-xs gap-1.5 cursor-pointer border-border/80"
                >
                  {showPins ? <EyeOff className="h-3.5 w-3.5 text-primary" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>{showPins ? "הסתר קודי PIN" : "הצג קודי PIN"}</span>
                </Button>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="h-3.5 w-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="חיפוש לפי שם או כיתה..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="h-8 pr-8 pl-3 text-xs w-full"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Students List */}
            {filteredStudents.length === 0 ? (
              <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-border/80 bg-muted/20">
                <Users className="h-10 w-10 text-muted-foreground/50 mx-auto" />
                <h3 className="font-bold text-sm text-foreground">
                  {students.length === 0 ? "טרם נרשמו תלמידים" : "לא נמצאו תלמידים תואמים"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  תוכל/י להוסיף תלמידים ידנית או שהם יתחברו ויבחרו בך כמורה שלהם.
                </p>
                {students.length === 0 && (
                  <Button
                    size="sm"
                    onClick={handleOpenAddStudent}
                    className="gap-2 text-xs font-bold cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>הוסף תלמיד/ה ראשונ/ה</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredStudents.map((student) => {
                  const stats = getStudentStats(student);
                  const isCopied = copiedPinStudentId === student.id;

                  return (
                    <div
                      key={student.id}
                      className="p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all shadow-2xs flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-2">
                        {/* Top: Name, Class, Group & Actions */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-black text-sm text-foreground truncate" dir="ltr">
                              {student.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <Badge variant="outline" className="text-[10px] font-bold">
                                {student.fullClass || "כיתה"}
                              </Badge>

                              {student.group ? (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] font-bold border-purple-500/40 text-purple-700 dark:text-purple-300 bg-purple-500/10"
                                >
                                  הקבצה {student.group}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                                  ללא הקבצה
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditStudent(student)}
                              className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                              title="ערוך פרטי תלמיד/ה והקבצה"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStudent(student)}
                              className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-destructive"
                              title="הסר תלמיד/ה"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* PIN Box */}
                        <div className="p-2 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground text-[11px]">קוד PIN:</span>
                            <span className="font-mono font-black text-foreground">
                              {showPins ? student.pin : "••••"}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyPin(student)}
                            className="h-6 px-2 text-[11px] gap-1 cursor-pointer"
                          >
                            {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                            <span>{isCopied ? "הועתק!" : "העתק"}</span>
                          </Button>
                        </div>
                      </div>

                      {/* Submissions Count, Average & 1-Click Assign via David */}
                      <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setHistoryStudent(student)}
                            className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer font-bold text-[11px]"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>{stats.total > 0 ? `${stats.total} הגשות` : "אין הגשות"}</span>
                          </button>

                          {stats.average !== null ? (
                            <Badge className="text-[10px] bg-emerald-600 text-white font-black">
                              ממוצע: {stats.average}
                            </Badge>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">טרם הוזן ציון</span>
                          )}
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAssignPreselectedStudentId(student.id);
                            setAssignModalOpen(true);
                          }}
                          className="h-7 px-2.5 text-[11px] font-bold gap-1 border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 cursor-pointer"
                          title={`הקצה משימה אישית עבור ${student.name}`}
                        >
                          <Send className="h-3 w-3 text-purple-500" />
                          <span>הקצה משימה</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
            TAB 4: SITE SUGGESTIONS & EDITS (ADMIN VIEW)
            ------------------------------------------------------------------- */}
        {activeTab === "suggestions" && (
          <div className="print:hidden">
            <AdminSuggestionsView
              suggestions={suggestions}
              onRefresh={fetchSuggestions}
              isLoading={isLoadingSuggestions}
              onUpdateSuggestion={handleUpdateSuggestion}
              onDeleteSuggestion={handleDeleteSuggestion}
            />
          </div>
        )}
      </main>

      {/* -------------------------------------------------------------------
          MODAL: ADD / EDIT STUDENT (With Grouping Input)
          ------------------------------------------------------------------- */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  {editingStudent ? <Edit2 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-black text-base text-foreground">
                    {editingStudent ? `עריכת פרטי תלמיד/ה: ${editingStudent.name}` : "הוספת תלמיד/ה חדש/ה"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    הגדירו שם, כיתה, הקבצה באנגלית וקוד PIN לכניסה.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStudentModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3.5 text-xs">
              {studentFormError && (
                <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{studentFormError}</span>
                </div>
              )}

              {/* English Name */}
              <div className="space-y-1">
                <label className="font-bold text-foreground block">
                  שם מלא באנגלית (English Name) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Maya Cohen"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  className="h-9 text-xs"
                  dir="ltr"
                  required
                />
              </div>

              {/* Class Grade & Number */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground block">שכבה:</label>
                  <select
                    value={studentGradeInput}
                    onChange={(e) => setStudentGradeInput(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs cursor-pointer"
                  >
                    <option value="ז">שכבה ז׳</option>
                    <option value="ח">שכבה ח׳</option>
                    <option value="ט">שכבה ט׳</option>
                    <option value="י">שכבה י׳</option>
                    <option value="יא">שכבה י״א</option>
                    <option value="יב">שכבה י״ב</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground block">מספר כיתה:</label>
                  <select
                    value={studentNumberInput}
                    onChange={(e) => setStudentNumberInput(Number(e.target.value))}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs cursor-pointer"
                  >
                    <option value={1}>כיתה 1</option>
                    <option value={2}>כיתה 2</option>
                    <option value={3}>כיתה 3</option>
                    <option value={4}>כיתה 4</option>
                    <option value={5}>כיתה 5</option>
                    <option value={6}>כיתה 6</option>
                  </select>
                </div>
              </div>

              {/* English Grouping (הקבצה) */}
              <div className="space-y-1">
                <label className="font-bold text-foreground block">
                  הקבצה באנגלית (English Grouping):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["א1", "א2", "ב"] as StudentGroup[]).map((grp) => (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setStudentGroupInput(grp)}
                      className={`p-2 rounded-lg border text-center font-bold text-xs cursor-pointer transition-all ${
                        studentGroupInput === grp
                          ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300"
                          : "border-border hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      הקבצה {grp}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStudentGroupInput("none")}
                    className={`p-2 rounded-lg border text-center text-xs cursor-pointer transition-all ${
                      studentGroupInput === "none"
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    ללא
                  </button>
                </div>
              </div>

              {/* PIN Code */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground">
                    קוד PIN אישי (4 ספרות) <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPin}
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    <Shuffle className="h-3 w-3" />
                    <span>הגרל קוד</span>
                  </button>
                </div>
                <Input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={studentPinInput}
                  onChange={(e) => setStudentPinInput(e.target.value.replace(/\D/g, ""))}
                  className="h-9 text-xs font-mono tracking-widest text-center"
                  dir="ltr"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStudentModalOpen(false)}
                  className="text-xs cursor-pointer"
                >
                  ביטול
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSavingStudent}
                  className="text-xs font-bold gap-1.5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{isSavingStudent ? "שומר..." : editingStudent ? "שמור שינויים" : "הוסף תלמיד/ה"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------
          MODAL: STUDENT SUBMISSION HISTORY
          ------------------------------------------------------------------- */}
      {historyStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto flex flex-col" dir="rtl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-foreground" dir="ltr">
                    {historyStudent.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {historyStudent.fullClass || "כיתה"}
                    {historyStudent.group && ` • הקבצה ${historyStudent.group}`} &bull; קוד PIN: <strong className="font-mono">{historyStudent.pin}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistoryStudent(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {(() => {
                const stats = getStudentStats(historyStudent);
                if (stats.submissions.length === 0) {
                  return (
                    <div className="py-12 text-center space-y-2 rounded-xl border border-dashed border-border bg-muted/20">
                      <FileText className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                      <p className="font-bold text-sm text-foreground">טרם הוגשו משימות</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5">
                    {stats.submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-xl border border-border bg-muted/30 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-foreground block">{sub.hebrewTitle}</strong>
                          <span className="text-muted-foreground text-[11px]">{sub.submittedAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={sub.status === "reviewed" ? "default" : "outline"} className="text-[10px]">
                            {sub.status === "reviewed" ? `ציון: ${sub.grade ?? sub.score}` : "ממתין"}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => {
                              setHistoryStudent(null);
                              handleOpenReview(sub);
                            }}
                            className="h-7 text-xs font-bold px-2.5"
                          >
                            בדוק
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end pt-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setHistoryStudent(null)} className="text-xs">
                סגור
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------
          MODAL: FULL REVIEW & RUBRIC DIALOG
          ------------------------------------------------------------------- */}
      <ReviewDialog
        reviewItem={reviewItem}
        onClose={() => setReviewItem(null)}
        onSaveGrade={handleSaveGradeModal}
        onAiReview={handleAiReview}
        isEvaluatingAi={isEvaluatingAi}
        writingAiResult={writingAiResult}
      />

      {/* -------------------------------------------------------------------
          MODAL: ASSIGN TASK TO STUDENTS
          ------------------------------------------------------------------- */}
      <AssignTaskModal
        open={assignModalOpen}
        onOpenChange={(open) => {
          setAssignModalOpen(open);
          if (!open) setAssignPreselectedStudentId(null);
        }}
        teacherId={user.id}
        teacherName={user.name}
        students={students}
        availableClasses={availableClasses}
        onTaskAssigned={handleTaskAssigned}
        preselectedStudentId={assignPreselectedStudentId}
      />

      {/* -------------------------------------------------------------------
          PRINTABLE CLASS ROSTER VIEW (window.print())
          ------------------------------------------------------------------- */}
      <div className="hidden print:block p-8 space-y-6 bg-white text-black font-sans" dir="rtl">
        <div className="border-b-2 border-black pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black">רשימת תלמידים וקודי כניסה למערכת</h1>
            <p className="text-sm mt-1 text-gray-700">
              {user.schoolName || "חטיבת ביניים"} &bull; מורה: <strong>{user.name}</strong>
            </p>
          </div>
          <div className="text-left" dir="ltr">
            <span className="text-xs text-gray-500 block">Class Roster</span>
            <span className="text-sm font-semibold text-gray-700">English Dept.</span>
          </div>
        </div>

        <table className="w-full border-collapse text-xs mt-4">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-400">
              <th className="p-2 text-right">#</th>
              <th className="p-2 text-right">שם התלמיד/ה (באנגלית)</th>
              <th className="p-2 text-right">כיתה</th>
              <th className="p-2 text-right">הקבצה</th>
              <th className="p-2 text-right">קוד PIN</th>
              <th className="p-2 text-right">חתימת תלמיד / הערות</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, idx) => (
              <tr key={s.id} className="border-b border-gray-200">
                <td className="p-2 text-gray-500">{idx + 1}</td>
                <td className="p-2 font-bold font-sans" dir="ltr">
                  {s.name}
                </td>
                <td className="p-2">{s.fullClass || "—"}</td>
                <td className="p-2">{s.group ? `הקבצה ${s.group}` : "—"}</td>
                <td className="p-2 font-mono font-bold text-sm tracking-wider" dir="ltr">
                  {s.pin}
                </td>
                <td className="p-2 border-b border-gray-200 w-44"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
