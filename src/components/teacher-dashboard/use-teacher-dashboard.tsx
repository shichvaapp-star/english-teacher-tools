"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
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

import { SubmissionItem } from "@/types/submission";
import { StudentProfile, StudentGroup } from "@/types/auth";
import { TeacherAssignment } from "@/types/assignment";
import { SiteSuggestion } from "@/types/suggestion";
import { TeacherVocabBank } from "@/types/vocab-bank";
import { ALL_WRITING_TASKS } from "@/data/writing-tasks";
import type { WritingEvaluationResult } from "@/app/api/evaluate-writing/route";
import {
  loadTeacherVocabBanks,
  saveTeacherVocabBank,
  deleteTeacherVocabBank,
  toggleShareVocabBank,
} from "@/lib/vocab-bank-storage";

import { parseSubmissionTimestamp } from "@/lib/submission-time";
import { useConfirm } from "@/components/teacher-dashboard/shared-ui/confirm-dialog";
import {
  getAssignmentProgress,
  getStudentStats as computeStudentStats,
  type AssignmentProgress,
} from "@/components/teacher-dashboard/dashboard-selectors";
import { LOCAL_SUBMISSIONS_KEY, LOCAL_ASSIGNMENTS_KEY, LOCAL_SUGGESTIONS_KEY, WRITING_LEVELS } from "@/components/teacher-dashboard/teacher-dashboard-helpers";

export function useTeacherDashboard() {
  const {
    user,
    teachers,
    getStudentsByTeacher,
    addStudentByTeacher,
    updateStudent,
    deleteStudent,
  } = useAuth();

  const confirmAction = useConfirm();

  // "Now" for relative times and due dates; refreshed every minute
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  // Custom Vocabulary Banks State
  const [vocabBanks, setVocabBanks] = useState<TeacherVocabBank[]>([]);
  const [vocabBankModalOpen, setVocabBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<TeacherVocabBank | null>(null);
  const [preselectedBankForAssign, setPreselectedBankForAssign] = useState<TeacherVocabBank | null>(null);
  const [sharedTemplateForAssign, setSharedTemplateForAssign] = useState<TeacherAssignment | null>(null);

  // Site Suggestions State (Admin)
  const [suggestions, setSuggestions] = useState<SiteSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  // Submissions State
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

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

  // AI evaluation state for the submission open in the inbox
  const [loadingAiSubId, setLoadingAiSubId] = useState<string | null>(null);
  const [isEvaluatingAi, setIsEvaluatingAi] = useState(false);
  const [writingAiResult, setWritingAiResult] = useState<WritingEvaluationResult | null>(null);
  // Which submission `writingAiResult` belongs to (the inbox and the review dialog share it)
  const [aiResultSubId, setAiResultSubId] = useState<string | null>(null);

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

  // Fetch Custom Vocab Banks
  const fetchVocabBanks = async () => {
    if (!user) return;
    const list = await loadTeacherVocabBanks(user.id);
    setVocabBanks(list);
  };

  const handleSaveVocabBank = async (bank: TeacherVocabBank) => {
    if (!user) return;
    const bankToSave: TeacherVocabBank = {
      ...bank,
      teacherName: user.name,
      schoolName: user.schoolName,
    };
    const saved = await saveTeacherVocabBank(bankToSave, user.id);
    setVocabBanks((prev) => {
      const idx = prev.findIndex((b) => b.id === saved.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    setEditingBank(null);
  };

  const handleToggleShareBank = async (bank: TeacherVocabBank) => {
    if (!user) return;
    const nextShared = !bank.isShared;
    const updated = await toggleShareVocabBank(bank, nextShared, {
      id: user.id,
      name: user.name,
      schoolName: user.schoolName,
    });
    setVocabBanks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleDeleteVocabBank = async (bankId: string, bankName: string) => {
    if (!user) return;
    const ok = await confirmAction({
      title: `למחוק את מאגר המילים "${bankName}"?`,
      description: "המאגר יימחק לצמיתות.",
      confirmLabel: "מחק",
      destructive: true,
    });
    if (ok) {
      await deleteTeacherVocabBank(bankId, user.id);
      setVocabBanks((prev) => prev.filter((b) => b.id !== bankId));
      toast.success("המאגר נמחק");
    }
  };

  // Initial load
  useEffect(() => {
    if (user && user.role === "teacher") {
      fetchSubmissions();
      fetchStudents();
      fetchAssignments();
      fetchSuggestions();
      fetchVocabBanks();
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
    await Promise.all([fetchSubmissions(), fetchStudents(), fetchAssignments(), fetchVocabBanks()]);
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
  const handleTaskAssigned = async (assignmentData: TeacherAssignment) => {
    const newAssignment: TeacherAssignment = {
      ...assignmentData,
      authorSchoolName: user?.schoolName || "",
    };

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
    setSharedTemplateForAssign(null);
  };

  const handleArchiveAssignment = async (id: string): Promise<boolean> => {
    const ok = await confirmAction({
      title: "למחוק משימה זו?",
      description: "המשימה תוסר מהתלמידים. הגשות שכבר התקבלו יישארו בתיבת ההגשות.",
      confirmLabel: "מחק משימה",
      destructive: true,
    });
    if (!ok) return false;

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
    toast.success("המשימה נמחקה");
    return true;
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
  // Load a submission's saved AI evaluation (if any) into `writingAiResult`
  const loadSavedAiResult = (item: SubmissionItem) => {
    setAiResultSubId(item.id);
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

  // Save a grade together with the current AI evaluation (when it belongs to this submission)
  const persistGradeWithAi = async (updatedItem: SubmissionItem) => {
    const ai = aiResultSubId === updatedItem.id ? writingAiResult : null;
    const itemToStore: SubmissionItem = ai
      ? {
          ...updatedItem,
          score: ai.score,
          encouragement: ai.encouragement,
          teacherNote: ai.teacherNote,
          strengths: ai.strengths,
          tips: ai.tips,
          writingRubric: ai.rubric,
          corrections: ai.corrections,
          vocabularyUpgrades: ai.vocabularyUpgrades,
        }
      : updatedItem;
    if (db) {
      try {
        await updateDoc(doc(db, "submissions", updatedItem.id), cleanForFirestore({
          grade: updatedItem.grade,
          teacherFeedback: updatedItem.teacherFeedback,
          status: "reviewed",
          reviewedAt: new Date().toISOString(),
          ...(ai ? {
            score: ai.score,
            encouragement: ai.encouragement,
            teacherNote: ai.teacherNote,
            strengths: ai.strengths,
            tips: ai.tips,
            writingRubric: ai.rubric,
            corrections: ai.corrections,
            vocabularyUpgrades: ai.vocabularyUpgrades,
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
        const updatedList = list.map((it) => (it.id === updatedItem.id ? itemToStore : it));
        localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(updatedList));
      }
    } catch {
      // Ignore
    }

    setSubmissions((prev) => prev.map((it) => (it.id === updatedItem.id ? itemToStore : it)));
    return itemToStore;
  };

  // Inbox save: grade + feedback, plus the AI evaluation if one was run for this submission
  const handleSaveGrade = async (sub: SubmissionItem, grade?: number, feedback?: string) => {
    const updatedItem: SubmissionItem = {
      ...sub,
      grade,
      teacherFeedback: feedback,
      status: "reviewed",
      reviewedAt: new Date().toLocaleString("he-IL"),
    };
    const stored = await persistGradeWithAi(updatedItem);
    toast.success(`הציון של ${sub.studentName} נשמר`);
    return stored;
  };

  // AI Review Action
  // Run the AI evaluation without opening the review dialog (used by the inbox)
  const runAiReview = async (sub: SubmissionItem) => {
    setLoadingAiSubId(sub.id);
    setAiResultSubId(sub.id);

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
            level: matchedTask?.level || WRITING_LEVELS.find((l) => l === sub.storyLevel) || "Level 2",
            minWords: matchedTask?.minWords || 15,
            maxWords: matchedTask?.maxWords || 120,
          }),
        });

        const data = await res.json();
        if (data.success && data.evaluation) {
          const evalRes: WritingEvaluationResult = data.evaluation;
          setWritingAiResult(evalRes);
        } else {
          toast.error(data.error || "אירעה שגיאה בבדיקת ה-AI. אנא נסו שוב.");
        }
      } catch (err) {
        console.error("AI Review error:", err);
        toast.error("לא ניתן היה להתחבר לשירות בדיקת ה-AI.");
      } finally {
        setIsEvaluatingAi(false);
        setLoadingAiSubId(null);
      }
    } else {
      setLoadingAiSubId(null);
    }
  };

  // Delete submission
  const handleDeleteSubmission = async (id: string, studentName: string): Promise<boolean> => {
    const ok = await confirmAction({
      title: `למחוק את ההגשה של ${studentName}?`,
      description: "לא ניתן לשחזר הגשה שנמחקה.",
      confirmLabel: "מחק הגשה",
      destructive: true,
    });
    if (!ok) return false;

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
    toast.success("ההגשה נמחקה");
    return true;
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
    const ok = await confirmAction({
      title: `להסיר את ${student.name}?`,
      description: `התלמיד/ה יוסר/תוסר מכיתה ${student.fullClass || ""} ולא יוכל/תוכל להתחבר עם קוד ה-PIN.`,
      confirmLabel: "הסר",
      destructive: true,
    });
    if (!ok) return;

    const res = await deleteStudent(student.id);
    if (res.success) {
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
    } else {
      toast.error(res.error || "שגיאה בהסרת התלמיד/ה.");
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
  const getStudentStats = (student: StudentProfile) => computeStudentStats(student, submissions);

  // Assignment progress (eligible students, turn-ins, missing) keyed by assignment id
  const assignmentProgress = useMemo(() => {
    const map = new Map<string, AssignmentProgress>();
    assignments.forEach((a) => map.set(a.id, getAssignmentProgress(a, students, submissions, now)));
    return map;
  }, [assignments, students, submissions, now]);

  // Modal openers usable from any route
  const openAssignModal = (opts: { studentId?: string; bank?: TeacherVocabBank; template?: TeacherAssignment } = {}) => {
    setAssignPreselectedStudentId(opts.studentId ?? null);
    setPreselectedBankForAssign(opts.bank ?? null);
    setSharedTemplateForAssign(opts.template ?? null);
    setAssignModalOpen(true);
  };

  const openBankModal = (bank?: TeacherVocabBank) => {
    setEditingBank(bank ?? null);
    setVocabBankModalOpen(true);
  };

  // ---------------------------------------------------------------------------
  // MAIN DASHBOARD VIEW
  // ---------------------------------------------------------------------------

  return {
    user,
    teachers,
    getStudentsByTeacher,
    addStudentByTeacher,
    updateStudent,
    deleteStudent,
    now,
    assignmentProgress,
    openAssignModal,
    openBankModal,
    vocabBanks,
    setVocabBanks,
    vocabBankModalOpen,
    setVocabBankModalOpen,
    editingBank,
    setEditingBank,
    preselectedBankForAssign,
    setPreselectedBankForAssign,
    sharedTemplateForAssign,
    setSharedTemplateForAssign,
    suggestions,
    setSuggestions,
    isLoadingSuggestions,
    setIsLoadingSuggestions,
    submissions,
    setSubmissions,
    isLoadingSubmissions,
    setIsLoadingSubmissions,
    assignments,
    setAssignments,
    assignModalOpen,
    setAssignModalOpen,
    assignPreselectedStudentId,
    setAssignPreselectedStudentId,
    students,
    setStudents,
    isLoadingStudents,
    setIsLoadingStudents,
    studentSearchQuery,
    setStudentSearchQuery,
    studentClassFilter,
    setStudentClassFilter,
    studentGroupFilter,
    setStudentGroupFilter,
    showPins,
    setShowPins,
    copiedPinStudentId,
    setCopiedPinStudentId,
    studentModalOpen,
    setStudentModalOpen,
    editingStudent,
    setEditingStudent,
    studentNameInput,
    setStudentNameInput,
    studentGradeInput,
    setStudentGradeInput,
    studentNumberInput,
    setStudentNumberInput,
    studentGroupInput,
    setStudentGroupInput,
    studentPinInput,
    setStudentPinInput,
    studentFormError,
    setStudentFormError,
    isSavingStudent,
    setIsSavingStudent,
    loadingAiSubId,
    setLoadingAiSubId,
    isEvaluatingAi,
    setIsEvaluatingAi,
    writingAiResult,
    setWritingAiResult,
    aiResultSubId,
    loadSavedAiResult,
    runAiReview,
    handleSaveGrade,
    authModalOpen,
    setAuthModalOpen,
    fetchSubmissions,
    fetchStudents,
    fetchAssignments,
    fetchSuggestions,
    handleUpdateSuggestion,
    handleDeleteSuggestion,
    fetchVocabBanks,
    handleSaveVocabBank,
    handleToggleShareBank,
    handleDeleteVocabBank,
    handleRefreshAll,
    handleCopyPin,
    handleTaskAssigned,
    handleArchiveAssignment,
    handleToggleAssignmentDavid,
    handleDeleteSubmission,
    handleOpenAddStudent,
    handleOpenEditStudent,
    handleGenerateRandomPin,
    handleSaveStudent,
    handleDeleteStudent,
    availableClasses,
    filteredStudents,
    totalSubmissionsCount,
    pendingSubmissionsCount,
    reviewedSubmissionsCount,
    activeAssignmentsCount,
    getStudentStats,
  };
}

export type TeacherDashboardController = ReturnType<typeof useTeacherDashboard>;
