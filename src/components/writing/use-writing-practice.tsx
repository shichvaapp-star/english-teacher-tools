"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/lib/utils";
import {
  ALL_WRITING_TASKS,
  WritingTask,
  WritingLevel,
  TaskCategory,
} from "@/data/writing-tasks";
import { lookupBuiltInTranslation } from "@/data/built-in-dictionary";
import { loadSavedWords, VocabItem } from "@/lib/vocab-storage";
import { recordTaskCompletion, submitTaskToDavid, resolveFocusWordToReviewItem } from "@/lib/tutor-engine";
import { TutorVocabReviewItem } from "@/types/tutor";
import { TeacherAssignment } from "@/types/assignment";
import type { WritingEvaluationResult } from "@/app/api/evaluate-writing/route";
import type { ScaffoldingResult } from "@/app/api/scaffold-writing/route";
import { saveDraft, deleteDraft, getDraftById } from "@/lib/drafts-storage";
import type { InProgressWorkItem, WritingDraftPayload } from "@/types/draft";
import { SubmissionRecord, LOCAL_SUBMISSIONS_KEY } from "@/components/writing/writing-helpers";

export function useWritingPractice() {
  const router = useRouter();
  const { user, teachers } = useAuth();

  // App Stage: "settings" vs "writing"
  const [stage, setStage] = useState<"settings" | "writing">("settings");

  // Level Selection: Level 1, Level 2, Level 3
  const [selectedLevel, setSelectedLevel] = useState<WritingLevel>("Level 2");

  // Mode Selection: "practice" vs "submit"
  const [activeMode, setActiveMode] = useState<"practice" | "submit">("practice");

  // Category filter for tasks
  const [selectedCategory, setSelectedCategory] = useState<"all" | TaskCategory>("all");

  // All Tasks Pool
  const [tasks, setTasks] = useState<WritingTask[]>(ALL_WRITING_TASKS);

  // Filter tasks by level and category
  const levelTasks = useMemo(() => {
    return tasks.filter((t) => t.level === selectedLevel);
  }, [tasks, selectedLevel]);

  const filteredTasks = useMemo(() => {
    if (selectedCategory === "all") return levelTasks;
    return levelTasks.filter((t) => t.category === selectedCategory);
  }, [levelTasks, selectedCategory]);

  // Selected Task
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    levelTasks[0]?.id || ALL_WRITING_TASKS[0].id
  );

  const currentTask: WritingTask = useMemo(() => {
    const found = tasks.find((t) => t.id === selectedTaskId);
    if (found) return found;
    return filteredTasks[0] || levelTasks[0] || ALL_WRITING_TASKS[0];
  }, [tasks, selectedTaskId, filteredTasks, levelTasks]);

  // Topic Source in Settings: "library" vs "ai_generator"
  const [topicSourceTab, setTopicSourceTab] = useState<"library" | "ai_generator">("library");

  // AI Topic Generator State
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  // Single Writing Text
  const [essayText, setEssayText] = useState("");
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

  // Random prompt rolling state
  const [isRolling, setIsRolling] = useState(false);
  const [randomNotice, setRandomNotice] = useState<string | null>(null);

  // Saved Words in Notebook Drawer
  const [savedWords, setSavedWords] = useState<VocabItem[]>(() => loadSavedWords(user?.id));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // AI API Keys (Shared with Unseen)
  const [showAiSettingsModal, setShowAiSettingsModal] = useState(false);
  const [customGroqKey, setCustomGroqKey] = useState("");
  const [customGeminiKey, setCustomGeminiKey] = useState("");
  const [hasAiKeys, setHasAiKeys] = useState(false);
  const [assignedNotice, setAssignedNotice] = useState<string | null>(null);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<string | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<TeacherAssignment | null>(null);
  const [isFromDavid, setIsFromDavid] = useState(false);
  const [isTurningInToDavid, setIsTurningInToDavid] = useState(false);

  useEffect(() => {
    setSavedWords(loadSavedWords(user?.id));
    if (typeof window !== "undefined") {
      const groq = localStorage.getItem("ett_groq_api_key") || "";
      const gemini = localStorage.getItem("ett_gemini_api_key") || "";
      setCustomGroqKey(groq);
      setCustomGeminiKey(gemini);
      setHasAiKeys(Boolean(groq || gemini));

      const params = new URLSearchParams(window.location.search);
      const taskIdParam = params.get("task");
      const assignIdParam = params.get("assignmentId");
      const levelQueryParam = params.get("level") as WritingLevel | null;
      if (levelQueryParam && (levelQueryParam === "Level 1" || levelQueryParam === "Level 2" || levelQueryParam === "Level 3")) {
        setSelectedLevel(levelQueryParam);
      }
      if (params.get("from") === "david") {
        setIsFromDavid(true);
      }
      if (taskIdParam && taskIdParam !== "free_choice" && taskIdParam !== "adaptive_david") {
        const found = ALL_WRITING_TASKS.find((t) => t.id === taskIdParam);
        if (found) {
          setSelectedLevel(found.level);
          setSelectedTaskId(found.id);
          setStage("writing");
        }
      }
      if (assignIdParam) {
        setCurrentAssignmentId(assignIdParam);
        let matchedAssign: TeacherAssignment | undefined;
        try {
          const rawAssigns = localStorage.getItem("ett_teacher_assignments");
          if (rawAssigns) {
            const parsed = JSON.parse(rawAssigns) as TeacherAssignment[];
            matchedAssign = parsed.find((a) => a.id === assignIdParam);
            if (matchedAssign) {
              setActiveAssignment(matchedAssign);
              if (matchedAssign.level) {
                setSelectedLevel(matchedAssign.level);
              }
            }
          }
        } catch {}
        const lvlText = matchedAssign?.level ? ` (${matchedAssign.level})` : "";
        if (!taskIdParam || taskIdParam === "free_choice" || taskIdParam === "adaptive_david") {
          setAssignedNotice(`✨ משימת בחירה חופשית מהמורה שלך${lvlText}: בחרו נושא מתאים, כתבו והגישו לבדיקה!`);
        } else {
          setAssignedNotice(`משימה זו${lvlText} הוקצתה על ידי המורה שלך. בסיום הכתיבה, הגישו את המשימה לבדיקה.`);
        }
      }
    }
  }, [user?.id]);

  // Helpers toggle states in writing view
  const [showDictionary, setShowDictionary] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showScaffold, setShowScaffold] = useState(false);

  // Scaffolding ("קשה לי") Assistant state
  const [scaffoldInput, setScaffoldInput] = useState("");
  const [isScaffolding, setIsScaffolding] = useState(false);
  const [scaffoldResult, setScaffoldResult] = useState<ScaffoldingResult | null>(null);
  const [scaffoldError, setScaffoldError] = useState<string | null>(null);
  const [scaffoldInserted, setScaffoldInserted] = useState(false);

  // Inline Dictionary
  const [dictQuery, setDictQuery] = useState("");
  const [dictResult, setDictResult] = useState<{ english: string; hebrew: string } | null>(null);
  const [isSearchingDict, setIsSearchingDict] = useState(false);

  // Audio / Text-To-Speech playing state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // AI Feedback state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<WritingEvaluationResult | null>(null);
  const [showDetailedRubric, setShowDetailedRubric] = useState(false);
  const [showPracticeConfetti, setShowPracticeConfetti] = useState(false);

  // Submit to teacher form state
  const [studentName, setStudentName] = useState(() => {
    if (user?.role === "student" && user.name) return user.name;
    if (user?.role === "teacher" && user.name) return `מורה: ${user.name}`;
    return "";
  });

  // Draft Auto-Save & Resumption State
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSavedTimeText, setLastSavedTimeText] = useState<string | null>(null);
  const [activeDraftPrompt, setActiveDraftPrompt] = useState<InProgressWorkItem | null>(null);

  // Check for saved draft for the current task and auto-restore by default
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const draftIdParam = params.get("draftId");
    let matched: InProgressWorkItem | null = null;

    if (draftIdParam) {
      matched = getDraftById(draftIdParam);
    } else {
      const targetDraftId = currentAssignmentId
        ? `draft_writing_assign_${currentAssignmentId}`
        : `draft_writing_${currentTask.id}`;
      matched = getDraftById(targetDraftId);
    }

    if (matched && matched.type === "writing") {
      const payload = matched.payload as WritingDraftPayload;
      if (payload && payload.essayText) {
        if (payload.taskData) {
          const savedTask = payload.taskData as WritingTask;
          setTasks((prev) => [savedTask, ...prev.filter((t) => t.id !== savedTask.id)]);
          setSelectedLevel(savedTask.level || payload.writingLevel || "Level 2");
          setSelectedTaskId(savedTask.id);
        } else if (payload.taskId && payload.taskId !== currentTask.id) {
          const found = ALL_WRITING_TASKS.find((t) => t.id === payload.taskId);
          if (found) {
            setSelectedLevel(found.level);
            setSelectedTaskId(found.id);
          }
        }
        setEssayText(payload.essayText);
        if (payload.customTopic?.prompt) {
          setCustomTopicInput(payload.customTopic.prompt);
        }
        if (draftIdParam || params.get("task") || params.get("assignmentId")) {
          setStage("writing");
        }
        setActiveDraftPrompt(matched);
      } else {
        setActiveDraftPrompt(null);
      }
    } else {
      setActiveDraftPrompt(null);
    }
  }, [currentTask.id, currentAssignmentId]);

  // Restore draft handler
  const handleRestoreDraft = (draft: InProgressWorkItem) => {
    const payload = draft.payload as WritingDraftPayload;
    if (payload?.essayText) {
      setEssayText(payload.essayText);
      if (payload.customTopic?.prompt) {
        setCustomTopicInput(payload.customTopic.prompt);
      }
      setStage("writing");
      setActiveDraftPrompt(null);
    }
  };

  // Discard draft and reset essay to start fresh
  const handleDiscardDraft = (draft: InProgressWorkItem) => {
    deleteDraft(draft.id, user?.id);
    setEssayText("");
    setCustomTopicInput("");
    setFeedback(null);
    setActiveDraftPrompt(null);
  };

  // Debounced auto-save hook
  useEffect(() => {
    if (stage !== "writing" || !essayText.trim() || essayText.trim().length < 5) {
      return;
    }
    setDraftStatus("saving");
    const timer = setTimeout(async () => {
      const draftId = currentAssignmentId
        ? `draft_writing_assign_${currentAssignmentId}`
        : `draft_writing_${currentTask.id}`;
      const words = essayText.trim().split(/\s+/).filter(Boolean).length;
      const targetMin = currentTask.minWords || 30;
      const progressPercent = Math.min(100, Math.round((words / targetMin) * 100));

      await saveDraft({
        id: draftId,
        type: "writing",
        studentId: user?.id || "guest",
        studentName: user?.name,
        title: currentTask.title,
        hebrewTitle: currentTask.hebrewTitle,
        progressPercent,
        summaryText: `${words} מילים נכתבו (יעד: ${targetMin})`,
        resumeUrl: `/writing?task=${currentTask.id}&draftId=${draftId}${
          currentAssignmentId ? `&assignmentId=${currentAssignmentId}` : ""
        }`,
        assignmentId: currentAssignmentId || undefined,
        payload: {
          taskId: currentTask.id,
          writingLevel: selectedLevel,
          essayText,
          taskData: currentTask,
          customTopic: customTopicInput ? { prompt: customTopicInput } : undefined,
        },
      });
      setDraftStatus("saved");
      setLastSavedTimeText(new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }));
    }, 1200);

    return () => clearTimeout(timer);
  }, [essayText, stage, currentTask, selectedLevel, currentAssignmentId, user?.id, user?.name, customTopicInput]);

  // Save and exit back to student portal
  const handleSaveAndExit = async () => {
    if (essayText.trim().length >= 3) {
      const draftId = currentAssignmentId
        ? `draft_writing_assign_${currentAssignmentId}`
        : `draft_writing_${currentTask.id}`;
      const words = essayText.trim().split(/\s+/).filter(Boolean).length;
      const targetMin = currentTask.minWords || 30;
      const progressPercent = Math.min(100, Math.round((words / targetMin) * 100));

      await saveDraft({
        id: draftId,
        type: "writing",
        studentId: user?.id || "guest",
        studentName: user?.name,
        title: currentTask.title,
        hebrewTitle: currentTask.hebrewTitle,
        progressPercent,
        summaryText: `${words} מילים נכתבו (יעד: ${targetMin})`,
        resumeUrl: `/writing?task=${currentTask.id}&draftId=${draftId}${
          currentAssignmentId ? `&assignmentId=${currentAssignmentId}` : ""
        }`,
        assignmentId: currentAssignmentId || undefined,
        payload: {
          taskId: currentTask.id,
          writingLevel: selectedLevel,
          essayText,
          taskData: currentTask,
          customTopic: customTopicInput ? { prompt: customTopicInput } : undefined,
        },
      });
    }
    router.push("/student");
  };
  const [selectedTeacherId, setSelectedTeacherId] = useState(() => {
    return user?.teacherId || "";
  });
  const [studentClass, setStudentClass] = useState(() => {
    if (user?.fullClass) return user.fullClass;
    if (user?.classGrade) return `${user.classGrade}׳${user.classNumber || 1}`;
    return "ז'1";
  });
  const [studentNote, setStudentNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<SubmissionRecord | null>(null);

  // Submissions history dialog
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [submissionsList, setSubmissionsList] = useState<SubmissionRecord[]>([]);

  // Suggested quick topics for AI generator
  const SUGGESTED_TOPICS = [
    { label: "🎮 Gaming & Minecraft", value: "Video games and favorite gaming adventures" },
    { label: "🚀 Space & Astronauts", value: "Space exploration, rockets, and alien planets" },
    { label: "🐾 Animals & Pets", value: "Wild animals, animal rescue, and cute pets" },
    { label: "🍕 Food & Cooking", value: "Favorite desserts, pizza night, and delicious snacks" },
    { label: "⚽ Sports & Teamwork", value: "Playing soccer, basketball, and staying active" },
    { label: "🦸 Superheroes & Magic", value: "Superpowers, magical portals, and saving the world" },
  ];

  // Sync teacher selection if empty and teachers list loads
  useEffect(() => {
    if (!selectedTeacherId && teachers.length > 0) {
      const fallback = user?.teacherId && teachers.some((t) => t.id === user.teacherId)
        ? user.teacherId
        : teachers[0].id;
      setSelectedTeacherId(fallback);
    }
  }, [teachers, user?.teacherId, selectedTeacherId]);

  // Auto-sync any unsynced submissions from localStorage to Firestore
  useEffect(() => {
    const firestore = db;
    if (!firestore) return;
    try {
      const existingJson = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (!existingJson) return;
      const list = JSON.parse(existingJson);
      if (Array.isArray(list) && list.length > 0) {
        list.forEach(async (sub) => {
          if (sub && sub.id) {
            try {
              const payload = cleanForFirestore({
                ...sub,
                timestamp: sub.submittedAt || new Date().toISOString(),
              });
              await setDoc(doc(firestore, "submissions", sub.id), payload, { merge: true });
            } catch {
              // Ignore background sync errors
            }
          }
        });
      }
    } catch {
      // Ignore
    }
  }, []);

  // Handle Level Selection
  const handleLevelSelect = (lvl: WritingLevel) => {
    setSelectedLevel(lvl);
    const matching = tasks.filter((t) => t.level === lvl);
    if (matching.length > 0) {
      setSelectedTaskId(matching[0].id);
    }
    setFeedback(null);
    setSubmissionSuccess(null);
  };

  // Word count calculation
  const wordList = useMemo(() => {
    return essayText.trim() ? essayText.trim().split(/\s+/).filter(Boolean) : [];
  }, [essayText]);
  const wordCount = wordList.length;

  const isWordCountMinReached = wordCount >= currentTask.minWords;
  const isWordCountGood = wordCount >= currentTask.minWords && wordCount <= currentTask.maxWords;

  // Insert text / connector / word into single essay box
  const handleInsertText = (textToInsert: string) => {
    setEssayText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return textToInsert;
      return `${trimmed} ${textToInsert}`;
    });
  };

  // Apply teacher correction or vocab upgrade directly into student's essay
  const handleApplyCorrection = (original: string, suggestion: string) => {
    setEssayText((prev) => {
      const cleanOrig = original.trim();
      if (!cleanOrig) return prev;
      // 1. Try exact word boundary replace
      try {
        const regex = new RegExp(`\\b${cleanOrig.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        if (regex.test(prev)) {
          return prev.replace(regex, suggestion);
        }
      } catch {
        // fallback to standard includes
      }
      // 2. Try substring replace
      if (prev.includes(cleanOrig)) {
        return prev.replace(cleanOrig, suggestion);
      }
      // 3. If original was already altered, append or notify
      return `${prev.trim()} ${suggestion}`;
    });
  };

  // Text-To-Speech
  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }
    if (!text.trim()) return;

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
    } catch {}

    setIsPlayingAudio(true);

    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = selectedLevel === "Level 1" ? 0.85 : 0.95;

        const w = window;
        w.__writingUtterance = utterance;

        utterance.onend = () => {
          w.__writingUtterance = null;
          setIsPlayingAudio(false);
        };
        utterance.onerror = () => {
          w.__writingUtterance = null;
          setIsPlayingAudio(false);
        };
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("[writing] handleSpeak error:", err);
        setIsPlayingAudio(false);
      }
    }, 25);
  };

  // Quick Dictionary Search
  const handleDictionarySearch = async () => {
    const q = dictQuery.trim();
    if (!q) return;

    const local = lookupBuiltInTranslation(q);
    if (local) {
      setDictResult({ english: q, hebrew: local });
      return;
    }

    setIsSearchingDict(true);
    try {
      const res = await fetch("/api/translate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: q }),
      });
      const data = await res.json();
      if (data.success && data.translation) {
        setDictResult({
          english: data.translation.english || q,
          hebrew: data.translation.hebrew || "",
        });
      } else {
        setDictResult({ english: q, hebrew: "לא נמצא תרגום" });
      }
    } catch {
      setDictResult({ english: q, hebrew: "שגיאה בחיפוש" });
    } finally {
      setIsSearchingDict(false);
    }
  };

  // Roll random topic
  const handleRollRandom = () => {
    setIsRolling(true);
    setRandomNotice(null);

    const pool = filteredTasks.length > 1 ? filteredTasks : levelTasks;
    const available = pool.filter((t) => t.id !== selectedTaskId);
    const chosen = available[Math.floor(Math.random() * available.length)] || pool[0];

    setTimeout(() => {
      setSelectedTaskId(chosen.id);
      setIsRolling(false);
      setFeedback(null);
      setRandomNotice(`🎲 נבחר עבורך באקראי: "${chosen.hebrewTitle}"`);
      setTimeout(() => setRandomNotice(null), 4000);
    }, 350);
  };

  // AI Task Generation
  const handleGenerateAiTask = async () => {
    const topic = customTopicInput.trim();
    if (!topic) {
      alert("אנא הזינו נושא ליצירת משימת כתיבה (למשל: מיינקראפט, חלל, פיצה).");
      return;
    }

    setIsGeneratingAi(true);
    setAiNotice(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (typeof window !== "undefined") {
        const groq = localStorage.getItem("ett_groq_api_key");
        const gemini = localStorage.getItem("ett_gemini_api_key");
        if (groq) headers["x-groq-api-key"] = groq;
        if (gemini) headers["x-gemini-api-key"] = gemini;
      }

      const res = await fetch("/api/generate-writing", {
        method: "POST",
        headers,
        body: JSON.stringify({
          topic,
          level: selectedLevel,
          category: selectedCategory === "all" ? "opinion" : selectedCategory,
        }),
      });

      const data = await res.json();
      if (data.success && data.task) {
        const newTask: WritingTask = data.task;
        setTasks((prev) => [newTask, ...prev]);
        setSelectedTaskId(newTask.id);
        setCustomTopicInput("");
        setTopicSourceTab("library");
        setAiNotice(`✨ המשימה "${newTask.hebrewTitle}" נוצרה בהצלחה!`);
        setTimeout(() => setAiNotice(null), 4000);
      } else {
        alert(data.error || "לא ניתן היה ליצור משימה. נסו שוב.");
      }
    } catch (err) {
      console.error("AI Generation error:", err);
      alert("אירעה שגיאה בחיבור לשירות ה-AI. נסו שוב.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Start Writing CTA: transition from Stage 1 to Stage 2
  const handleStartWriting = () => {
    setStage("writing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Return to Settings
  const handleBackToSettings = () => {
    setStage("settings");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Run AI evaluation via real API
  const handleEvaluate = async () => {
    const minThreshold = selectedLevel === "Level 1" ? 2 : 5;
    if (wordCount < minThreshold) {
      alert(
        selectedLevel === "Level 1"
          ? "אנא כתבו לפחות 2-3 מילים באנגלית כדי לקבל משוב."
          : "אנא כתבו לפחות כמה מילים באנגלית לפני בדיקת החיבור."
      );
      return;
    }

    setIsEvaluating(true);

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

      const res = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers,
        body: JSON.stringify({
          essayText: essayText.trim(),
          taskTitle: currentTask.title,
          prompt: currentTask.prompt,
          category: currentTask.category,
          level: currentTask.level,
          minWords: currentTask.minWords,
          maxWords: currentTask.maxWords,
        }),
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        setFeedback(data.evaluation);
        if (data.evaluation.score >= 80) {
          setShowPracticeConfetti(true);
          setTimeout(() => setShowPracticeConfetti(false), 3500);
        }

        // Save completed practice writing session in history
        try {
          const practiceRecord: SubmissionRecord = {
            id: `sub-practice-${Date.now()}`,
            type: "writing",
            studentId: user?.id || `guest-${Date.now()}`,
            studentName: user?.name || "תלמיד/ה",
            teacherId: teachers[0]?.id || "",
            teacherName: teachers[0]?.name || "מורה לאנגלית",
            studentClass: user?.fullClass || user?.classGrade || "חטיבת ביניים",
            studentGroup: user?.group || undefined,
            assignmentId: currentAssignmentId || undefined,
            taskId: currentTask.id,
            taskTitle: currentTask.title,
            hebrewTitle: currentTask.hebrewTitle,
            category: currentTask.category,
            level: currentTask.level,
            essayText: essayText.trim(),
            wordCount: wordCount,
            score: data.evaluation.score,
            grade: data.evaluation.score,
            submittedAt: new Date().toLocaleString("he-IL"),
            receiptCode: `PRACTICE-WR-${Math.floor(100000 + Math.random() * 900000)}`,
            status: "completed",
            mode: "practice",
            writingRubric: data.evaluation.rubric,
          };
          const existingJson = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
          const list: SubmissionRecord[] = existingJson ? JSON.parse(existingJson) : [];
          list.unshift(practiceRecord);
          localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(list));

          if (db) {
            const payload = cleanForFirestore({
              ...practiceRecord,
              timestamp: new Date().toISOString(),
            });
            setDoc(doc(db, "submissions", practiceRecord.id), payload, { merge: true }).catch(() => {});
          }
        } catch (e) {
          console.warn("Failed to save completed practice writing session:", e);
        }
      } else {
        alert(data.error || "אירעה שגיאה בבדיקת החיבור. אנא נסו שוב.");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      alert("לא ניתן היה להתחבר לשירות בדיקת החיבור. אנא בדקו את החיבור לאינטרנט ונסו שוב.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Turn in completed writing assignment directly to David (Private Tutor Flow)
  const handleTurnInToDavid = async (existingEval?: WritingEvaluationResult) => {
    const trimmed = essayText.trim();
    if (!trimmed || trimmed.split(/\s+/).filter(Boolean).length < 3) {
      alert("אנא כתבו לפחות משפט או שניים באנגלית לפני ההגשה.");
      return;
    }

    setIsTurningInToDavid(true);
    try {
      let evalData = existingEval || feedback;

      if (!evalData) {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (typeof window !== "undefined") {
          const groq = localStorage.getItem("ett_groq_api_key");
          const gemini = localStorage.getItem("ett_gemini_api_key");
          const openai = localStorage.getItem("ett_openai_api_key");
          if (groq) headers["x-groq-api-key"] = groq;
          if (gemini) headers["x-gemini-api-key"] = gemini;
          if (openai) headers["x-openai-api-key"] = openai;
        }

        const res = await fetch("/api/evaluate-writing", {
          method: "POST",
          headers,
          body: JSON.stringify({
            essayText: trimmed,
            taskTitle: currentTask.title,
            prompt: currentTask.prompt,
            category: currentTask.category,
            level: currentTask.level,
            minWords: currentTask.minWords,
            maxWords: currentTask.maxWords,
          }),
        });
        const data = await res.json();
        if (data.success && data.evaluation) {
          evalData = data.evaluation;
          setFeedback(data.evaluation);
        }
      }

      const vocabCandidates: TutorVocabReviewItem[] = [];
      if (activeAssignment?.focusWords && activeAssignment.focusWords.length > 0) {
        for (const fw of activeAssignment.focusWords) {
          const resolved = resolveFocusWordToReviewItem(fw);
          if (!vocabCandidates.some((v) => v.word.toLowerCase() === resolved.word.toLowerCase())) {
            vocabCandidates.push(resolved);
          }
        }
      }
      if (evalData?.vocabularyUpgrades) {
        for (const upg of evalData.vocabularyUpgrades) {
          if (upg.enriched && upg.explanationHebrew) {
            if (!vocabCandidates.some((v) => v.word.toLowerCase() === upg.enriched.toLowerCase())) {
              vocabCandidates.push({
                word: upg.enriched,
                hebrew: upg.explanationHebrew,
                exampleSentence: `Instead of "${upg.original}" → use "${upg.enriched}"`,
              });
            }
          }
        }
      }
      if (currentTask.wordBank) {
        for (const wb of currentTask.wordBank) {
          if (!vocabCandidates.some((v) => v.word.toLowerCase() === wb.word.toLowerCase())) {
            vocabCandidates.push({
              word: wb.word,
              hebrew: wb.hebrew,
            });
          }
        }
      }

      const finalScore = evalData?.score ?? 80;

      // If this was a teacher assignment and hasn't been submitted to the teacher yet, record it!
      if (currentAssignmentId && !submissionSuccess) {
        const teacherObj = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
        const receiptCode = `ETT-WR-${Math.floor(100000 + Math.random() * 900000)}`;
        const autoSub: SubmissionRecord = {
          id: `sub-${Date.now()}`,
          type: "writing",
          studentId: user?.id || `guest-${Date.now()}`,
          studentName: (studentName.trim() || user?.name || "תלמיד/ה").trim(),
          teacherId: activeAssignment?.teacherId || (teacherObj ? teacherObj.id : teachers[0]?.id || ""),
          teacherName: activeAssignment?.teacherName || (teacherObj ? teacherObj.name : teachers[0]?.name || "מורה לאנגלית"),
          studentClass: studentClass || user?.fullClass || "חטיבת ביניים",
          studentGroup: user?.group || undefined,
          studentNote: "הוגש באופן עצמאי 🎓",
          assignmentId: currentAssignmentId,
          taskId: currentTask.id,
          taskTitle: currentTask.title,
          hebrewTitle: currentTask.hebrewTitle,
          category: currentTask.category,
          level: currentTask.level,
          essayText: trimmed,
          wordCount,
          score: finalScore,
          grade: finalScore,
          submittedAt: new Date().toLocaleString("he-IL"),
          receiptCode,
          status: "submitted",
        };
        try {
          const existingJson = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
          const list: SubmissionRecord[] = existingJson ? JSON.parse(existingJson) : [];
          list.unshift(autoSub);
          localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(list));
        } catch {}
        if (db) {
          try {
            const payload = cleanForFirestore({
              ...autoSub,
              timestamp: new Date().toISOString(),
            });
            await setDoc(doc(db, "submissions", autoSub.id), payload, { merge: true });
          } catch {}
        }
      }

      await submitTaskToDavid(user?.id || "guest", {
        id: `turnin-writing-${Date.now()}`,
        type: "writing",
        taskId: currentTask.id,
        taskTitle: currentTask.title,
        taskTitleHebrew: currentTask.hebrewTitle,
        score: finalScore,
        completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        strengths:
          evalData?.strengths && evalData.strengths.length > 0
            ? evalData.strengths
            : ["השלמת את משימת הכתיבה בהצלחה והבעת את הרעיון באנגלית!"],
        improvements: (evalData?.corrections || []).slice(0, 3).map((c) => ({
          original: c.original,
          suggestion: c.suggestion,
          explanationHebrew: c.explanationHebrew || "שיפור הניסוח והדקדוק במשפט",
        })),
        vocabToReview: vocabCandidates,
        assignmentId: currentAssignmentId || undefined,
        teacherName: activeAssignment?.teacherName,
        encouragement: evalData?.encouragement,
        teacherNote: evalData?.teacherNote,
      });

      router.push("/tutor?turnIn=1");
    } catch (e) {
      console.error("Turn in to David error:", e);
      router.push("/tutor?turnIn=1");
    } finally {
      setIsTurningInToDavid(false);
    }
  };

  // Sentence Scaffolding ("קשה לי") Handlers
  const handleScaffoldSubmit = async () => {
    if (!scaffoldInput.trim()) return;
    setIsScaffolding(true);
    setScaffoldError(null);

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

      const res = await fetch("/api/scaffold-writing", {
        method: "POST",
        headers,
        body: JSON.stringify({
          hebrewText: scaffoldInput.trim(),
          level: selectedLevel,
          taskTitle: currentTask.title,
          currentEssay: essayText,
        }),
      });

      const data = await res.json();
      if (data.success && data.scaffolding) {
        setScaffoldResult(data.scaffolding);
      } else {
        setScaffoldError(data.error || "לא הצלחנו לייצר שלד למשפט כרגע. אנא נסו שוב.");
      }
    } catch (err) {
      console.error("Scaffold error:", err);
      setScaffoldError("אירעה שגיאה בחיבור לעוזר ה-AI. אנא בדקו את החיבור ונסו שוב.");
    } finally {
      setIsScaffolding(false);
    }
  };

  const handleInsertScaffoldedSentence = (sentence: string) => {
    setEssayText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return sentence;
      return `${trimmed} ${sentence}`;
    });
    setScaffoldInserted(true);
    setTimeout(() => setScaffoldInserted(false), 2500);
  };

  // Submit essay to teacher
  const handleSubmitToTeacher = async () => {
    const trimmedName = studentName.trim();
    if (!trimmedName) {
      alert("אנא הזינו את שמכם המלא לצורך הגשה למורה.");
      return;
    }

    const minSubmitWords = selectedLevel === "Level 1" ? 5 : 15;
    if (wordCount < minSubmitWords) {
      alert(`החיבור קצר מדי להגשה (פחות מ-${minSubmitWords} מילים).`);
      return;
    }

    const teacherObj = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
    const receiptCode = `ETT-WR-${Math.floor(100000 + Math.random() * 900000)}`;

    const newSubmission: SubmissionRecord = {
      id: `sub-${Date.now()}`,
      type: "writing",
      studentId: user?.id || `guest-${Date.now()}`,
      studentName: trimmedName,
      teacherId: teacherObj ? teacherObj.id : (teachers[0]?.id || ""),
      teacherName: teacherObj ? teacherObj.name : (teachers[0]?.name || "מורה לאנגלית"),
      studentClass: studentClass,
      studentGroup: user?.group || undefined,
      studentNote: studentNote.trim(),
      assignmentId: currentAssignmentId || undefined,
      taskId: currentTask.id,
      taskTitle: currentTask.title,
      hebrewTitle: currentTask.hebrewTitle,
      category: currentTask.category,
      level: currentTask.level,
      essayText: essayText.trim(),
      wordCount: wordCount,
      submittedAt: new Date().toLocaleString("he-IL"),
      receiptCode: receiptCode,
      status: "submitted",
    };

    setIsSubmitting(true);

    try {
      const existingJson = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      const list: SubmissionRecord[] = existingJson ? JSON.parse(existingJson) : [];
      list.unshift(newSubmission);
      localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(list));

      if (db) {
        try {
          const payload = cleanForFirestore({
            ...newSubmission,
            timestamp: new Date().toISOString(),
          });
          await setDoc(doc(db, "submissions", newSubmission.id), payload, { merge: true });
        } catch (fbErr) {
          console.warn("Firestore submission fallback:", fbErr);
        }
      }

      // Update AI Tutor David's Progress Tracking
      try {
        recordTaskCompletion(user?.id || "guest", "writing", 85, newSubmission.taskTitle);
      } catch (e) {
        console.warn("Tutor task completion tracking notice:", e);
      }

      // Clean up in-progress draft
      const draftId = currentAssignmentId
        ? `draft_writing_assign_${currentAssignmentId}`
        : `draft_writing_${currentTask.id}`;
      deleteDraft(draftId, user?.id);

      setSubmissionSuccess(newSubmission);
    } catch (err) {
      console.error("Submission error:", err);
      alert("אירעה שגיאה בעת שליחת החיבור. אנא העתיקו את הטקסט ונסו שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Submissions History
  const handleOpenHistory = async () => {
    let localList: SubmissionRecord[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (stored) localList = JSON.parse(stored);
    } catch {
      localList = [];
    }

    if (db && user && user.role === "teacher") {
      try {
        const q = query(collection(db, "submissions"), where("teacherId", "==", user.id));
        const snap = await getDocs(q);
        const fbList: SubmissionRecord[] = [];
        snap.forEach((docSnap) => {
          fbList.push({ id: docSnap.id, ...(docSnap.data() as Omit<SubmissionRecord, "id">) });
        });
        if (fbList.length > 0) {
          setSubmissionsList(fbList);
          setShowHistoryModal(true);
          return;
        }
      } catch (err) {
        console.warn("Could not fetch remote submissions:", err);
      }
    }

    setSubmissionsList(localList);
    setShowHistoryModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(essayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return {
    router,
    user,
    teachers,
    stage,
    setStage,
    selectedLevel,
    setSelectedLevel,
    activeMode,
    setActiveMode,
    selectedCategory,
    setSelectedCategory,
    tasks,
    setTasks,
    levelTasks,
    filteredTasks,
    selectedTaskId,
    setSelectedTaskId,
    currentTask,
    topicSourceTab,
    setTopicSourceTab,
    customTopicInput,
    setCustomTopicInput,
    isGeneratingAi,
    setIsGeneratingAi,
    aiNotice,
    setAiNotice,
    essayText,
    setEssayText,
    copied,
    setCopied,
    fontSize,
    setFontSize,
    isRolling,
    setIsRolling,
    randomNotice,
    setRandomNotice,
    savedWords,
    setSavedWords,
    drawerOpen,
    setDrawerOpen,
    showAiSettingsModal,
    setShowAiSettingsModal,
    customGroqKey,
    setCustomGroqKey,
    customGeminiKey,
    setCustomGeminiKey,
    hasAiKeys,
    setHasAiKeys,
    assignedNotice,
    setAssignedNotice,
    currentAssignmentId,
    setCurrentAssignmentId,
    activeAssignment,
    setActiveAssignment,
    isFromDavid,
    setIsFromDavid,
    isTurningInToDavid,
    setIsTurningInToDavid,
    showDictionary,
    setShowDictionary,
    showHint,
    setShowHint,
    showScaffold,
    setShowScaffold,
    scaffoldInput,
    setScaffoldInput,
    isScaffolding,
    setIsScaffolding,
    scaffoldResult,
    setScaffoldResult,
    scaffoldError,
    setScaffoldError,
    scaffoldInserted,
    setScaffoldInserted,
    dictQuery,
    setDictQuery,
    dictResult,
    setDictResult,
    isSearchingDict,
    setIsSearchingDict,
    isPlayingAudio,
    setIsPlayingAudio,
    isEvaluating,
    setIsEvaluating,
    feedback,
    setFeedback,
    showDetailedRubric,
    setShowDetailedRubric,
    showPracticeConfetti,
    setShowPracticeConfetti,
    studentName,
    setStudentName,
    draftStatus,
    setDraftStatus,
    lastSavedTimeText,
    setLastSavedTimeText,
    activeDraftPrompt,
    setActiveDraftPrompt,
    handleRestoreDraft,
    handleDiscardDraft,
    handleSaveAndExit,
    selectedTeacherId,
    setSelectedTeacherId,
    studentClass,
    setStudentClass,
    studentNote,
    setStudentNote,
    isSubmitting,
    setIsSubmitting,
    submissionSuccess,
    setSubmissionSuccess,
    showHistoryModal,
    setShowHistoryModal,
    submissionsList,
    setSubmissionsList,
    SUGGESTED_TOPICS,
    handleLevelSelect,
    wordList,
    wordCount,
    isWordCountMinReached,
    isWordCountGood,
    handleInsertText,
    handleApplyCorrection,
    handleSpeak,
    handleDictionarySearch,
    handleRollRandom,
    handleGenerateAiTask,
    handleStartWriting,
    handleBackToSettings,
    handleEvaluate,
    handleTurnInToDavid,
    handleScaffoldSubmit,
    handleInsertScaffoldedSentence,
    handleSubmitToTeacher,
    handleOpenHistory,
    handleCopy,
  };
}

export type WritingPracticeController = ReturnType<typeof useWritingPractice>;
