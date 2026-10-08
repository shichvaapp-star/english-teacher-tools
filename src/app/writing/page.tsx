"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Confetti } from "@/components/confetti";
import {
  ALL_WRITING_TASKS,
  MS_CONNECTORS,
  WritingTask,
  WritingLevel,
  TaskCategory,
} from "@/data/writing-tasks";
import { lookupBuiltInTranslation } from "@/data/built-in-dictionary";
import { loadSavedWords, saveWordToBuilder, VocabItem } from "@/lib/vocab-storage";
import type { WritingEvaluationResult } from "@/app/api/evaluate-writing/route";
import {
  PenTool,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Mail,
  FileText,
  Copy,
  Check,
  Send,
  Lightbulb,
  Dice5,
  GraduationCap,
  Printer,
  History,
  AlertCircle,
  X,
  Compass,
  BookOpen,
  BookMarked,
  Volume2,
  Target,
  FileCheck,
  Search,
  Plus,
  Sliders,
  Award,
} from "lucide-react";

interface SubmissionRecord {
  id: string;
  type: "writing";
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  studentClass?: string;
  studentNote?: string;
  taskId: string;
  taskTitle: string;
  hebrewTitle: string;
  category: TaskCategory;
  level: WritingLevel;
  essayText: string;
  wordCount: number;
  submittedAt: string;
  receiptCode: string;
  status: "submitted" | "reviewed";
}

const LOCAL_SUBMISSIONS_KEY = "ett_writing_submissions";

export default function WritingPracticePage() {
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

  useEffect(() => {
    setSavedWords(loadSavedWords(user?.id));
    if (typeof window !== "undefined") {
      const groq = localStorage.getItem("ett_groq_api_key") || "";
      const gemini = localStorage.getItem("ett_gemini_api_key") || "";
      setCustomGroqKey(groq);
      setCustomGeminiKey(gemini);
      setHasAiKeys(Boolean(groq || gemini));
    }
  }, [user?.id]);

  // Helpers toggle states in writing view
  const [showDictionary, setShowDictionary] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Inline Dictionary
  const [dictQuery, setDictQuery] = useState("");
  const [dictResult, setDictResult] = useState<{ english: string; hebrew: string } | null>(null);
  const [isSearchingDict, setIsSearchingDict] = useState(false);

  // Audio / Text-To-Speech playing state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // AI Feedback state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<WritingEvaluationResult | null>(null);
  const [showPracticeConfetti, setShowPracticeConfetti] = useState(false);

  // Submit to teacher form state
  const [studentName, setStudentName] = useState(() => {
    if (user?.role === "student" && user.name) return user.name;
    if (user?.role === "teacher" && user.name) return `מורה: ${user.name}`;
    return "";
  });
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
    window.speechSynthesis.cancel();
    if (!text.trim()) return;

    setIsPlayingAudio(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = selectedLevel === "Level 1" ? 0.85 : 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
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
      studentNote: studentNote.trim(),
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
          await addDoc(collection(db, "submissions"), {
            ...newSubmission,
            timestamp: new Date().toISOString(),
          });
        } catch (fbErr) {
          console.warn("Firestore submission fallback:", fbErr);
        }
      }

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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black overflow-x-hidden">
      {showPracticeConfetti && <Confetti />}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {stage === "writing" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToSettings}
                className="cursor-pointer gap-1.5 text-xs h-8 px-2.5 border-border/70"
                title="חזרה להגדרות המשימה"
              >
                <Sliders className="h-3.5 w-3.5 text-primary" />
                <span>שינוי הגדרות</span>
              </Button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground p-1.5 px-2 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors shrink-0"
                title="חזרה לראשי"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden sm:inline">ראשי</span>
              </Link>
            )}

            <div className="h-4 w-[1px] bg-border hidden sm:block" />

            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                <PenTool className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-xs sm:text-sm tracking-tight truncate">
                  סדנת הכתיבה באנגלית
                </h1>
                <p className="text-[10px] text-muted-foreground truncate hidden sm:block">
                  {stage === "settings"
                    ? "שלב 1: בחירת הגדרות ומשימת כתיבה"
                    : `${currentTask.hebrewTitle} • ${selectedLevel}`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {stage === "settings" && (
              <Button
                size="sm"
                onClick={handleStartWriting}
                className="cursor-pointer gap-1.5 font-bold shadow-xs text-xs h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <span>התחל לכתוב</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            )}

            {/* Vocab Notebook Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSavedWords(loadSavedWords(user?.id));
                setDrawerOpen(true);
              }}
              className="h-8 text-xs gap-1.5 cursor-pointer border-border/80 px-2 sm:px-3 relative"
              title="פנקס מילים"
            >
              <BookMarked className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">פנקס מילים</span>
              {savedWords.length > 0 && (
                <span className="px-1.5 py-0.2 bg-primary text-primary-foreground rounded-full text-[10px] font-bold">
                  {savedWords.length}
                </span>
              )}
            </Button>

            {/* AI Settings Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAiSettingsModal(true)}
              className="h-8 text-xs gap-1.5 cursor-pointer border-border/80 px-2 sm:px-3 relative"
              title="הגדרות מפתחות AI"
            >
              <Sliders className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">הגדרות AI</span>
              {hasAiKeys && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" title="AI מחובר" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenHistory}
              className="h-8 text-xs gap-1 cursor-pointer border-border/80 px-2 sm:px-3"
              title="הצג הגשות קודמות"
            >
              <History className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">הגשות קודמות</span>
            </Button>

            <Link
              href="/guide"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/70 hover:border-purple-500/40 bg-card hover:bg-accent/60 text-xs font-medium text-foreground transition"
            >
              <BookOpen className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>מדריך</span>
            </Link>

            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* =========================================================================
          STAGE 1: SETTINGS / SETUP VIEW
          ========================================================================= */}
      {stage === "settings" && (
        <main className="container mx-auto flex-1 px-3 sm:px-8 py-4 sm:py-8 max-w-4xl space-y-4 sm:space-y-6 print:hidden">
          {/* Settings Hero Card */}
          <div
            className="bg-card border-2 border-primary/20 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right"
            dir="rtl"
          >
            <div className="space-y-1 w-full sm:w-auto">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Badge
                  variant="outline"
                  className="text-xs px-2.5 py-0.5 border-primary/30 text-primary font-bold"
                >
                  הגדרות כתיבה
                </Badge>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  &bull; נושא נבחר: {currentTask.hebrewTitle} ({currentTask.targetWords})
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                מוכנים להתחיל לכתוב באנגלית?
              </h2>
              <p className="text-xs text-muted-foreground">
                בחרו רמה, מצב פעילות ונושא, ולחצו להתחלה עם דף כתיבה פשוט ונוח.
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleStartWriting}
              className="w-full sm:w-auto cursor-pointer gap-2 text-sm font-black px-6 shadow-md h-11 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              <span>התחל כתיבה</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Random notice banner if generated */}
          {randomNotice && (
            <div
              className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-between animate-in fade-in"
              dir="rtl"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-purple-500" />
                <span>{randomNotice}</span>
              </div>
              <button
                onClick={() => setRandomNotice(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Setting 1: Level Selection - ONLY Level 1, Level 2, Level 3 (NO DESCRIPTIONS) */}
          <div className="bg-card border border-border/60 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between" dir="rtl">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Target className="h-4 w-4 text-primary" />
                <span>1. רמת כתיבה (Writing Level)</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3" dir="ltr">
              {(["Level 1", "Level 2", "Level 3"] as WritingLevel[]).map((lvl) => {
                const isSelected = selectedLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleLevelSelect(lvl)}
                    className={`py-3.5 px-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-sm sm:text-base flex items-center justify-center gap-2 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-xs ring-2 ring-primary/40 font-black"
                        : "border-border/70 hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <span>{lvl}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Setting 2: Practice Mode vs. Assignment Mode */}
          <div className="bg-card border border-border/60 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between" dir="rtl">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <FileCheck className="h-4 w-4 text-primary" />
                <span>2. מצב פעילות (Practice vs. Assignment)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3" dir="rtl">
              <button
                type="button"
                onClick={() => setActiveMode("practice")}
                className={`p-3 sm:p-4 rounded-xl border text-right transition cursor-pointer flex items-start gap-3 ${
                  activeMode === "practice"
                    ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/30"
                    : "border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4 sm:h-5 w-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">אימון חופשי (Practice Mode)</h4>
                    {activeMode === "practice" && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-primary text-primary-foreground rounded-full font-bold">
                        נבחר
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    כתיבה עצמאית עם בדיקת AI מיידית, רמזים ומשוב מעודד ללא לחץ.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode("submit")}
                className={`p-3 sm:p-4 rounded-xl border text-right transition cursor-pointer flex items-start gap-3 ${
                  activeMode === "submit"
                    ? "border-purple-600 bg-purple-500/10 shadow-xs ring-2 ring-purple-500/30"
                    : "border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="p-2 sm:p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                  <GraduationCap className="h-4 w-4 sm:h-5 w-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">מטלה והגשה למורה (Assignment Mode)</h4>
                    {activeMode === "submit" && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-purple-600 text-white rounded-full font-bold">
                        נבחר
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    כתיבת משימה רשמית להגשה ישירה למורה, שמירה במאגר והפקת אישור הגשה ייחודי.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Setting 3: Assignment Category (Type) */}
          <div className="bg-card border border-border/60 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between" dir="rtl">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                <span>3. סוג המשימה (Assignment Type)</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" dir="rtl">
              {[
                { id: "all" as const, label: "כל הסוגים", icon: null },
                { id: "letter" as const, label: "מכתב / אימייל", icon: Mail },
                { id: "opinion" as const, label: "פסקת דעה", icon: FileText },
                { id: "description" as const, label: "תיאור ויומיום", icon: Compass },
                { id: "creative" as const, label: "סיפור יצירתי", icon: Sparkles },
              ].map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Setting 4: Topic Selection (With at least 10 pregenerated subjects per category) */}
          <div className="bg-card border border-border/60 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-3" dir="rtl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-primary" />
                <span>4. בחירת נושא (Topic Selection)</span>
              </span>

              {/* Tabs: Library vs AI Generator */}
              <div className="inline-flex rounded-lg p-0.5 bg-muted/60 border border-border self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTopicSourceTab("library")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    topicSourceTab === "library"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ספריית נושאים ({filteredTasks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTopicSourceTab("ai_generator")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    topicSourceTab === "ai_generator"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>מחולל נושאים חכם</span>
                </button>
              </div>
            </div>

            {/* TAB A: Task Library */}
            {topicSourceTab === "library" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    בחרו נושא מתוך הרשימה (לפחות 10 נושאים זמינים בכל קטגוריה):
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRollRandom}
                    disabled={isRolling}
                    className="h-7 text-xs gap-1.5 cursor-pointer border-purple-500/40 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10"
                  >
                    <Dice5 className={`h-3.5 w-3.5 ${isRolling ? "animate-spin" : ""}`} />
                    <span>הפתע אותי עם נושא!</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {filteredTasks.map((t) => {
                    const isSelected = selectedTaskId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTaskId(t.id)}
                        className={`p-3 rounded-xl border text-right transition cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30"
                            : "border-border/60 hover:bg-muted/40"
                        }`}
                      >
                        <span className="text-xl shrink-0 mt-0.5">{t.emoji || "📝"}</span>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="text-xs font-bold text-foreground truncate">
                              {t.hebrewTitle}
                            </h5>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {t.targetWords}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate ltr text-left">
                            {t.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB B: AI Generator for Custom Topics */}
            {topicSourceTab === "ai_generator" && (
              <div className="space-y-3 p-3.5 rounded-xl bg-primary/5 border border-primary/20">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-foreground block">
                    יצירת משימת כתיבה מותאמת אישית ל-{selectedLevel}:
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    הקלידו כל נושא שמעניין אתכם, וה-AI יכין עבורכם משימה מותאמת אישית!
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTED_TOPICS.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCustomTopicInput(item.label)}
                      className="px-2.5 py-1 rounded-md text-[11px] bg-background border border-border/80 hover:border-primary/50 text-foreground transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <Input
                    type="text"
                    value={customTopicInput}
                    onChange={(e) => setCustomTopicInput(e.target.value)}
                    placeholder="למשל: ספורט, טיול בחלל, חברים..."
                    className="h-9 text-xs bg-background"
                  />
                  <Button
                    type="button"
                    onClick={handleGenerateAiTask}
                    disabled={isGeneratingAi || !customTopicInput.trim()}
                    className="h-9 text-xs font-bold px-4 gap-1.5 cursor-pointer shrink-0 bg-primary text-primary-foreground"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isGeneratingAi ? "יוצר משימה..." : "צור משימה"}</span>
                  </Button>
                </div>

                {aiNotice && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-in fade-in">
                    {aiNotice}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Start Writing Button (Arrow pointing LEFT for RTL) */}
          <div className="pt-2 flex justify-center">
            <Button
              size="lg"
              onClick={handleStartWriting}
              className="w-full sm:w-80 cursor-pointer gap-2 text-base font-black h-12 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <span>התחל לכתוב עכשיו ✍️</span>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </main>
      )}

      {/* =========================================================================
          STAGE 2: WRITING STUDIO (SIMPLIFIED, SINGLE TEXTAREA, NO OVERWHELMING BOXES)
          ========================================================================= */}
      {stage === "writing" && (
        <main className="flex-1 container mx-auto px-3 sm:px-8 py-4 sm:py-6 max-w-4xl space-y-4">
          {/* Top Info Bar */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-border/60 bg-card text-xs shadow-xs"
            dir="rtl"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-bold border-primary/30 text-primary">
                {selectedLevel}
              </Badge>
              <Badge variant="secondary" className="font-bold">
                {activeMode === "practice" ? "אימון חופשי" : "מטלה להגשה למורה"}
              </Badge>
              <span className="text-muted-foreground hidden sm:inline">&bull;</span>
              <span className="font-bold text-foreground">
                {currentTask.hebrewTitle}
              </span>
            </div>

            <div className="flex items-center gap-2 mr-auto" dir="ltr">
              {/* Back to Settings */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBackToSettings}
                className="h-7 text-xs gap-1.5 cursor-pointer border-border"
              >
                <Sliders className="h-3.5 w-3.5 text-primary" />
                <span>שינוי הגדרות</span>
              </Button>
            </div>
          </div>

          {/* Clean Task Card */}
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary text-xs font-bold">
                  <span className="text-base">{currentTask.emoji || "📝"}</span>
                  <span>{currentTask.title}</span>
                </div>
                <Badge variant="outline" className="text-[11px] font-bold">
                  יעד: {currentTask.targetWords}
                </Badge>
              </div>

              <CardTitle className="text-base sm:text-lg font-bold pt-1 text-right" dir="rtl">
                {currentTask.hebrewTitle}
              </CardTitle>

              <CardDescription
                className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans pt-1"
                dir="ltr"
              >
                {currentTask.prompt}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-3 space-y-2.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2" dir="rtl">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>הנחיה:</strong> {currentTask.hebrewInstructions}
                </p>

                {/* Quick Assistance Actions */}
                <div className="flex items-center gap-2 shrink-0" dir="ltr">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSpeak(`${currentTask.title}. ${currentTask.prompt}`)}
                    className="h-7 text-xs gap-1.5 cursor-pointer border-border"
                    title="Listen to instructions in English"
                  >
                    <Volume2 className={`h-3.5 w-3.5 ${isPlayingAudio ? "text-primary animate-pulse" : ""}`} />
                    <span>Listen</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint((prev) => !prev)}
                    className="h-7 text-xs gap-1 cursor-pointer text-amber-600 dark:text-amber-400"
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>רעיון</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDictionary((prev) => !prev)}
                    className="h-7 text-xs gap-1 cursor-pointer text-primary"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>מילון</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSavedWords(loadSavedWords(user?.id));
                      setDrawerOpen(true);
                    }}
                    className="h-7 text-xs gap-1 cursor-pointer text-primary"
                    title="פנקס מילים"
                  >
                    <BookMarked className="h-3.5 w-3.5" />
                    <span>פנקס מילים</span>
                    {savedWords.length > 0 && (
                      <span className="px-1.5 py-0.2 bg-primary text-primary-foreground rounded-full text-[10px] font-bold">
                        {savedWords.length}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Hint Box (if opened) */}
              {showHint && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between animate-in fade-in" dir="rtl">
                  <span>💡 טיפ לרעיון: ענו על השאלה &quot;מה הדבר הראשון שאתם חושבים עליו בנושא זה?&quot;</span>
                  <button onClick={() => setShowHint(false)} className="p-1 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Quick Inline Dictionary (if opened) */}
              {showDictionary && (
                <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2 animate-in fade-in" dir="rtl">
                  <div className="flex gap-1.5">
                    <Input
                      type="text"
                      value={dictQuery}
                      onChange={(e) => setDictQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleDictionarySearch()}
                      placeholder="הקלידו מילה לתרגום..."
                      className="h-8 text-xs bg-background"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleDictionarySearch}
                      disabled={isSearchingDict || !dictQuery.trim()}
                      className="h-8 text-xs px-3 cursor-pointer shrink-0"
                    >
                      {isSearchingDict ? "מחפש..." : "תרגם"}
                    </Button>
                  </div>

                  {dictResult && (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <span className="font-bold text-foreground ltr">{dictResult.english}</span>
                        <span className="text-muted-foreground mr-1">({dictResult.hebrew})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            saveWordToBuilder(
                              {
                                english: dictResult.english,
                                hebrew: dictResult.hebrew,
                                level: "Personal Word",
                              },
                              user?.id
                            );
                            setSavedWords(loadSavedWords(user?.id));
                          }}
                          className="h-6 text-[11px] gap-1 cursor-pointer text-muted-foreground hover:text-foreground"
                          title="שמור לפנקס המילים"
                        >
                          <BookMarked className="h-3 w-3 text-primary" />
                          <span>שמור לפנקס</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleInsertText(dictResult.english)}
                          className="h-6 text-[11px] gap-1 cursor-pointer text-primary"
                        >
                          <Plus className="h-3 w-3" />
                          <span>הוסף לחיבור</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sentence Starters & Word Suggestions (Clean Chips Above Textbox) */}
          <div className="space-y-2" dir="ltr">
            {/* Sentence Starters Chips */}
            {currentTask.sentenceStarters && currentTask.sentenceStarters.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-muted-foreground text-[11px] font-semibold mr-1 rtl text-right" dir="rtl">
                  הצעות למשפטי פתיחה:
                </span>
                {currentTask.sentenceStarters.map((starter, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleInsertText(starter)}
                    className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-primary/10 hover:border-primary/40 text-xs text-foreground font-medium transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Click to insert"
                  >
                    <Plus className="h-3 w-3 text-primary opacity-60" />
                    <span>{starter}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Word Bank Chips */}
            {currentTask.wordBank && currentTask.wordBank.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-muted-foreground text-[11px] font-semibold mr-1 rtl text-right" dir="rtl">
                  מילים מומלצות:
                </span>
                {currentTask.wordBank.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleInsertText(item.word)}
                    className="px-2 py-0.5 rounded-md border border-border/80 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 text-xs text-foreground transition cursor-pointer flex items-center gap-1"
                    title={`Click to insert ${item.word}`}
                  >
                    {item.emoji && <span className="text-xs">{item.emoji}</span>}
                    <span className="font-semibold">{item.word}</span>
                    <span className="text-[10px] text-muted-foreground">({item.hebrew})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Writing Area: SINGLE TEXT BOX */}
          <div className="space-y-2">
            {/* Word Count Header Strip */}
            <div
              className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-card text-xs shadow-2xs"
              dir="rtl"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-semibold">ספירת מילים:</span>
                <span
                  className={`font-black text-sm ${
                    isWordCountGood
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isWordCountMinReached
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-foreground"
                  }`}
                >
                  {wordCount}
                </span>
                <span className="text-muted-foreground">/ {currentTask.targetWords}</span>
                {isWordCountGood && (
                  <Badge variant="default" className="text-[10px] bg-emerald-600 text-white font-bold">
                    ✓ יעד הושג! 🎉
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mr-auto" dir="ltr">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSpeak(essayText)}
                  disabled={!essayText.trim() || isPlayingAudio}
                  className="h-7 text-xs gap-1 cursor-pointer"
                  title="הקשיבו לחיבור שלכם בקול באנגלית"
                >
                  <Volume2 className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">הקרא טקסט</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!essayText.trim()}
                  className="h-7 text-xs gap-1 cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{copied ? "הועתק" : "העתק"}</span>
                </Button>

                {/* Font Size Selector */}
                <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/30">
                  <button
                    type="button"
                    onClick={() => setFontSize("sm")}
                    className={`px-1.5 py-0.5 text-[10px] rounded transition cursor-pointer ${
                      fontSize === "sm" ? "bg-background font-bold shadow-2xs" : "text-muted-foreground"
                    }`}
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize("base")}
                    className={`px-1.5 py-0.5 text-[10px] rounded transition cursor-pointer ${
                      fontSize === "base" ? "bg-background font-bold shadow-2xs" : "text-muted-foreground"
                    }`}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize("lg")}
                    className={`px-1.5 py-0.5 text-[10px] rounded transition cursor-pointer ${
                      fontSize === "lg" ? "bg-background font-bold shadow-2xs" : "text-muted-foreground"
                    }`}
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* SINGLE CLEAN TEXTAREA */}
            <textarea
              rows={12}
              placeholder="Start typing your writing here in English..."
              value={essayText}
              onChange={(e) => {
                setEssayText(e.target.value);
                setSubmissionSuccess(null);
              }}
              dir="ltr"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck={true}
              className={`w-full rounded-2xl border border-input bg-card p-4 leading-relaxed font-sans shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                fontSize === "sm" ? "text-sm" : fontSize === "lg" ? "text-lg" : "text-base"
              }`}
            />
          </div>

          {/* ACTION BUTTONS & FEEDBACK */}
          {activeMode === "practice" && (
            <div className="space-y-4 pt-1">
              <Button
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="w-full h-11 text-sm font-bold cursor-pointer gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Send className="h-4 w-4" />
                <span>
                  {isEvaluating ? "בודק את החיבור עם מורה AI..." : "בדיקת חיבור וקבלת משוב מעודד 🌟"}
                </span>
              </Button>

              {/* AI Feedback Card */}
              {feedback && (
                <div
                  className="p-5 sm:p-6 rounded-2xl border border-primary/30 bg-card space-y-5 shadow-sm animate-in fade-in"
                  dir="rtl"
                >
                  {/* Header: Score & Headline */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[11px] gap-1 border-primary/40 text-primary">
                          <Award className="h-3 w-3" />
                          <span>מחוון משרד החינוך (MOE Rubric)</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground font-semibold">
                          מותאם ל-{selectedLevel}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-foreground">
                        {feedback.encouragement}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right sm:text-left">
                        <span className="text-[11px] text-muted-foreground block font-medium">ציון משוקלל</span>
                        <Badge
                          variant="default"
                          className={`text-base px-3.5 py-1 font-black ${
                            feedback.score >= 85
                              ? "bg-emerald-600 text-white"
                              : feedback.score >= 70
                              ? "bg-blue-600 text-white"
                              : feedback.score >= 55
                              ? "bg-amber-600 text-white"
                              : "bg-rose-600 text-white"
                          }`}
                        >
                          {feedback.score} / 100
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Personal Note */}
                  {feedback.teacherNote && (
                    <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-primary">
                        <GraduationCap className="h-4 w-4" />
                        <span>מכתב אישי מהמורה:</span>
                      </div>
                      <p className="text-foreground/90 leading-relaxed text-[12px]">
                        {feedback.teacherNote}
                      </p>
                    </div>
                  )}

                  {/* Spam / Repetition warning */}
                  {feedback.isSpamOrGibberish && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>שימו לב: כדאי להוסיף עוד מילים ומשפטים</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        החיבור קצר מאוד או מכיל חזרות. נסו להשתמש במשפטי הפתיחה כדי לפתח רעיון שלם.
                      </p>
                    </div>
                  )}

                  {/* 4-Pillar Official MOE Rubric Cards */}
                  {feedback.rubric && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          <span>פירוט ציונים לפי 4 עמודי התווך של משרד החינוך:</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {/* 1. Content & Organization */}
                        <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-foreground">תוכן ומבנה (Content & Org.)</span>
                            <span className="text-primary font-mono text-[11px]">
                              {feedback.rubric.contentAndOrganization.score} / {feedback.rubric.contentAndOrganization.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (feedback.rubric.contentAndOrganization.score / feedback.rubric.contentAndOrganization.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {feedback.rubric.contentAndOrganization.commentHebrew}
                          </p>
                        </div>

                        {/* 2. Vocabulary */}
                        <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <div className="flex items-center gap-1.5">
                              <span className="text-foreground">אוצר מילים (Vocabulary)</span>
                              {feedback.rubric.vocabulary.bandLevelObserved && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                                  {feedback.rubric.vocabulary.bandLevelObserved}
                                </Badge>
                              )}
                            </div>
                            <span className="text-primary font-mono text-[11px]">
                              {feedback.rubric.vocabulary.score} / {feedback.rubric.vocabulary.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (feedback.rubric.vocabulary.score / feedback.rubric.vocabulary.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {feedback.rubric.vocabulary.commentHebrew}
                          </p>
                        </div>

                        {/* 3. Language & Grammar */}
                        <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-foreground">שפה ודקדוק (Language & Grammar)</span>
                            <span className="text-primary font-mono text-[11px]">
                              {feedback.rubric.languageAndGrammar.score} / {feedback.rubric.languageAndGrammar.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (feedback.rubric.languageAndGrammar.score / feedback.rubric.languageAndGrammar.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {feedback.rubric.languageAndGrammar.commentHebrew}
                          </p>
                        </div>

                        {/* 4. Mechanics & Spelling */}
                        <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-foreground">מכניקה ואיות (Mechanics & Spelling)</span>
                            <span className="text-primary font-mono text-[11px]">
                              {feedback.rubric.mechanicsAndSpelling.score} / {feedback.rubric.mechanicsAndSpelling.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (feedback.rubric.mechanicsAndSpelling.score / feedback.rubric.mechanicsAndSpelling.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {feedback.rubric.mechanicsAndSpelling.commentHebrew}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hebrew Interference Callout (if any) */}
                  {feedback.hebrewInterferenceNotes && feedback.hebrewInterferenceNotes.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
                        <Lightbulb className="h-4 w-4 shrink-0" />
                        <span>דגש לתלמידים דוברי עברית (Hebrew-English Transfer):</span>
                      </div>
                      <ul className="list-disc pl-5 pr-2 space-y-1 text-foreground/90 text-[11px]">
                        {feedback.hebrewInterferenceNotes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specific Grammatical & Phrasing Corrections */}
                  {feedback.corrections && feedback.corrections.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-border/60">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-600 dark:text-purple-400 text-xs flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>הערות המורה לתיקון וללמידה:</span>
                        </span>
                        <span className="text-[11px] text-muted-foreground">לחצו על &apos;החלף בחיבור&apos; לעדכון אוטומטי</span>
                      </div>

                      <div className="space-y-2">
                        {feedback.corrections.map((corr, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/5 text-xs space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] ltr text-left">
                                <span className="line-through text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                                  {corr.original}
                                </span>
                                <span className="text-muted-foreground">&rarr;</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                                  {corr.suggestion}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {corr.category && (
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] py-0 px-1.5 font-bold ${
                                      corr.category === "capitalization"
                                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                                        : corr.category === "hebrew_interference"
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                        : corr.category === "spelling"
                                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                                        : corr.category === "grammar"
                                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                                        : "bg-muted text-foreground/80 border-border"
                                    }`}
                                  >
                                    {corr.category === "capitalization"
                                      ? "אותיות גדולות (Capital)"
                                      : corr.category === "hebrew_interference"
                                      ? "תרגום מעברית"
                                      : corr.category === "grammar"
                                      ? "דקדוק"
                                      : corr.category === "spelling"
                                      ? "איות"
                                      : corr.category === "punctuation"
                                      ? "פיסוק"
                                      : "אוצר מילים"}
                                  </Badge>
                                )}
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleApplyCorrection(corr.original, corr.suggestion)}
                                  className="h-6 text-[10px] gap-1 cursor-pointer text-primary hover:bg-primary/10 px-2"
                                  title="החלף את התיקון בטקסט החיבור שלך"
                                >
                                  <Check className="h-3 w-3" />
                                  <span>החלף בחיבור</span>
                                </Button>
                              </div>
                            </div>

                            {corr.explanationHebrew && (
                              <p className="text-muted-foreground text-[11px] rtl text-right leading-relaxed">
                                💡 {corr.explanationHebrew}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vocabulary Upgrades (Band Elevation) */}
                  {feedback.vocabularyUpgrades && feedback.vocabularyUpgrades.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-border/60">
                      <span className="font-bold text-primary text-xs flex items-center gap-1.5">
                        <BookMarked className="h-3.5 w-3.5" />
                        <span>שדרוג אוצר מילים (Band Elevation) – מילים עשירות יותר:</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {feedback.vocabularyUpgrades.map((upg, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg border border-border/60 bg-muted/30 text-xs space-y-1.5">
                            <div className="flex items-center justify-between" dir="ltr">
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground line-through text-[11px]">{upg.original}</span>
                                <span>&rarr;</span>
                                <span className="font-bold text-primary text-xs">{upg.enriched}</span>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => handleApplyCorrection(upg.original, upg.enriched)}
                                className="h-5 text-[10px] gap-1 cursor-pointer text-primary hover:bg-primary/10 px-1.5 shrink-0"
                                title="החלף במילה עשירה יותר"
                              >
                                <Plus className="h-2.5 w-2.5" />
                                <span>שדרג</span>
                              </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground rtl text-right">
                              {upg.explanationHebrew}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths & Tips */}
                  {feedback.strengths && feedback.strengths.length > 0 && (
                    <div className="space-y-1 text-xs pt-1 border-t border-border/60">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>נקודות חוזק בחיבור:</span>
                      </span>
                      <ul className="space-y-1 text-foreground/90 pl-5 pr-2 list-disc">
                        {feedback.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedback.tips && feedback.tips.length > 0 && (
                    <div className="space-y-1 text-xs pt-1 border-t border-border/60">
                      <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <Lightbulb className="h-4 w-4 shrink-0" />
                        <span>טיפ לפעם הבאה:</span>
                      </span>
                      <ul className="space-y-1 text-foreground/90 pl-5 pr-2 list-disc">
                        {feedback.tips.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ASSIGNMENT MODE: SUBMIT TO TEACHER */}
          {activeMode === "submit" && (
            <div className="space-y-4 pt-1">
              {!submissionSuccess ? (
                <Card className="border border-purple-500/40 bg-card p-4 sm:p-5 space-y-3.5 shadow-xs" dir="rtl">
                  <div className="border-b border-border/50 pb-2.5">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                      <GraduationCap className="h-4 w-4" />
                      <span>הגשת המשימה למורה לבדיקה ולמתן ציון</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      החיבור יישלח ישירות למורה שלך ויישמר במערכת לבדיקה.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">שם התלמיד/ה:</label>
                      <Input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="למשל: דניאל כהן"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">כיתה:</label>
                      <Input
                        type="text"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        placeholder="למשל: ז'1"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">מורה לבדיקה:</label>
                      {teachers.length > 0 ? (
                        <select
                          value={selectedTeacherId}
                          onChange={(e) => setSelectedTeacherId(e.target.value)}
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                        >
                          {teachers.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.schoolName || "בית ספר"})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          type="text"
                          value={selectedTeacherId}
                          onChange={(e) => setSelectedTeacherId(e.target.value)}
                          placeholder="שם המורה"
                          className="h-9 text-xs"
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">הערה אישית (אופציונלי):</label>
                      <Input
                        type="text"
                        value={studentNote}
                        onChange={(e) => setStudentNote(e.target.value)}
                        placeholder="למשל: שאלה או דגש מיוחד"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmitToTeacher}
                    disabled={isSubmitting || wordCount < (selectedLevel === "Level 1" ? 5 : 12)}
                    className="w-full h-11 text-sm font-bold cursor-pointer gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? "שולח חיבור למורה..." : "הגש חיבור למורה לבדיקה"}</span>
                  </Button>
                </Card>
              ) : (
                /* Submission Receipt */
                <div
                  className="p-6 rounded-2xl border-2 border-emerald-500/40 bg-card space-y-4 shadow-sm animate-in fade-in"
                  dir="rtl"
                >
                  <div className="flex items-center gap-3 border-b border-border pb-3">
                    <div className="p-2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-foreground">
                        החיבור הוגש בהצלחה למורה לבדיקה!
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        קוד אישור הגשה: <span className="font-mono font-bold text-foreground">{submissionSuccess.receiptCode}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-muted/40 p-3 rounded-xl border border-border/60">
                    <div>
                      <span className="text-muted-foreground block">שם התלמיד/ה:</span>
                      <span className="font-bold text-foreground">{submissionSuccess.studentName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">מורה בודק/ת:</span>
                      <span className="font-bold text-foreground">{submissionSuccess.teacherName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">רמה וכיתה:</span>
                      <span className="font-bold text-foreground">
                        {submissionSuccess.level} ({submissionSuccess.studentClass})
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">משימה:</span>
                      <span className="font-bold text-foreground">{submissionSuccess.hebrewTitle}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">ספירת מילים:</span>
                      <span className="font-bold text-foreground">{submissionSuccess.wordCount} מילים</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">מועד הגשה:</span>
                      <span className="font-bold text-foreground">{submissionSuccess.submittedAt}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const receipt = `אישור הגשת משימת כתיבה באנגלית\nתלמיד/ה: ${submissionSuccess.studentName}\nכיתה: ${submissionSuccess.studentClass}\nרמה: ${submissionSuccess.level}\nמורה: ${submissionSuccess.teacherName}\nמשימה: ${submissionSuccess.hebrewTitle}\nמילים: ${submissionSuccess.wordCount}\nמועד: ${submissionSuccess.submittedAt}\nקוד הגשה: ${submissionSuccess.receiptCode}`;
                        navigator.clipboard.writeText(receipt);
                        alert("אישור ההגשה הועתק ללוח!");
                      }}
                      className="text-xs gap-1.5 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>העתק אישור</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="text-xs gap-1.5 cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>הדפס חיבור</span>
                    </Button>

                    <Link href="/student">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs gap-1.5 cursor-pointer font-bold"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>לדף העבודות שלי &rarr;</span>
                      </Button>
                    </Link>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setSubmissionSuccess(null);
                        setEssayText("");
                      }}
                      className="text-xs gap-1.5 cursor-pointer mr-auto"
                    >
                      <PenTool className="h-3.5 w-3.5" />
                      <span>כתיבת משימה נוספת</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Submissions History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-black text-lg text-foreground">
                  {user && user.role === "teacher" ? "הגשות תלמידים לבדיקה" : "היסטוריית החיבורים שהוגשו"}
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {submissionsList.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground/60" />
                  <p>עדיין לא נרשמו הגשות במכשיר זה.</p>
                </div>
              ) : (
                submissionsList.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-border/80 bg-muted/30 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{sub.studentName}</span>
                        {sub.studentClass && (
                          <Badge variant="outline" className="text-[10px]">
                            {sub.studentClass}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px]">
                          {sub.level || "Level 2"}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{sub.submittedAt}</span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>
                        נושא: <strong className="text-foreground">{sub.hebrewTitle}</strong> ({sub.taskTitle})
                      </span>
                      <span>{sub.wordCount} מילים</span>
                    </div>

                    <div
                      className="p-3 rounded-lg bg-background border border-border/50 font-sans text-xs text-foreground/90 whitespace-pre-wrap max-h-36 overflow-y-auto"
                      dir="ltr"
                    >
                      {sub.essayText}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                      <span>מורה יעד: {sub.teacherName}</span>
                      <span className="font-mono text-[10px]">קוד: {sub.receiptCode}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border pt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistoryModal(false)}
                className="text-xs cursor-pointer"
              >
                סגור
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Vocabulary Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs print:hidden animate-in fade-in-0">
          <div className="w-full max-w-md bg-card border-l border-border h-full p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200" dir="rtl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base text-foreground">פנקס המילים שלי</h3>
                  <Badge variant="secondary" className="text-xs">
                    {savedWords.length}
                  </Badge>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                מילים ששמרת לתרגול – תוכל להאזין להגייה שלהן או להכניס אותן ישירות לתוך החיבור שלך!
              </p>

              <div className="mt-4 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {savedWords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-xs space-y-2">
                    <BookMarked className="h-8 w-8 mx-auto text-muted-foreground/50" />
                    <p>עדיין לא נשמרו מילים בפנקס.</p>
                    <p className="text-[11px] text-muted-foreground/80">
                      ניתן לשמור מילים במהלך אימון האנסין ובמילון כדי להשתמש בהן כאן.
                    </p>
                  </div>
                ) : (
                  savedWords.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2" dir="ltr">
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.english)}
                          className="text-muted-foreground hover:text-primary cursor-pointer p-0.5"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-bold text-xs capitalize text-foreground">{item.english}</span>
                        <span className="text-xs font-semibold text-primary mr-1" dir="rtl">
                          ({item.hebrew})
                        </span>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          handleInsertText(item.english);
                        }}
                        className="h-6 text-[11px] gap-1 cursor-pointer text-primary hover:text-primary hover:bg-primary/10 px-2 shrink-0"
                        title="הוסף לחיבור"
                      >
                        <Plus className="h-3 w-3" />
                        <span>הוסף לחיבור</span>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link
                href="/vocabulary"
                className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg text-center hover:bg-primary/90 transition flex items-center justify-center gap-2"
              >
                <span>עבור לאימון מלא באוצר מילים (כרטיסיות ומשחקים)</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* AI API Keys Settings Modal */}
      {showAiSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 print:hidden">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" />
                <h3 className="font-black text-base text-foreground">הגדרות מפתחות AI (מורה חכם)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAiSettingsModal(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              המערכת משתמשת באותם מפתחות AI המוגדרים באנסין ובכתיבה (נשמרים מקומית במכשיר שלך). המפתחות מאפשרים בדיקת חיבור מדויקת לפי מחוון משרד החינוך ויצירת נושאים מקוריים.
            </p>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground">מפתח Groq (מומלץ - מהיר וחזק):</label>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-primary hover:underline"
                  >
                    קבלת מפתח חינם &larr;
                  </a>
                </div>
                <Input
                  type="password"
                  placeholder="gsk_..."
                  value={customGroqKey}
                  onChange={(e) => setCustomGroqKey(e.target.value)}
                  className="h-9 text-xs font-mono ltr text-left"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground">מפתח Google Gemini:</label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-primary hover:underline"
                  >
                    קבלת מפתח חינם &larr;
                  </a>
                </div>
                <Input
                  type="password"
                  placeholder="AIzaSy..."
                  value={customGeminiKey}
                  onChange={(e) => setCustomGeminiKey(e.target.value)}
                  className="h-9 text-xs font-mono ltr text-left"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/50 border border-border/50 text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>מנגנון מפל אוטומטי (Cascade)</span>
              </div>
              <p>
                אם מודל אחד מגיע למגבלת עומס, המערכת תעבור באופן אוטומטי למודל הבא (Groq 120B &rarr; Gemini 2.5 &rarr; Llama 70B &rarr; מחוון פדגוגי מקומי).
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAiSettingsModal(false)}
                className="cursor-pointer text-xs"
              >
                ביטול
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    if (customGroqKey.trim()) localStorage.setItem("ett_groq_api_key", customGroqKey.trim());
                    else localStorage.removeItem("ett_groq_api_key");

                    if (customGeminiKey.trim()) localStorage.setItem("ett_gemini_api_key", customGeminiKey.trim());
                    else localStorage.removeItem("ett_gemini_api_key");

                    setHasAiKeys(Boolean(customGroqKey.trim() || customGeminiKey.trim()));
                  }
                  setShowAiSettingsModal(false);
                }}
                className="cursor-pointer text-xs font-bold shadow-xs"
              >
                שמור הגדרות
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
