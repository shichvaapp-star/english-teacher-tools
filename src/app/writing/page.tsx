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
import {
  MIDDLE_SCHOOL_TASKS,
  MS_CONNECTORS,
  WritingTask,
  TaskCategory,
} from "@/data/writing-tasks";
import {
  PenTool,
  ArrowLeft,
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
  ChevronDown,
  ChevronUp,
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
  essayText: string;
  wordCount: number;
  submittedAt: string;
  receiptCode: string;
  status: "submitted" | "reviewed";
}

const LOCAL_SUBMISSIONS_KEY = "ett_writing_submissions";

export default function WritingPracticePage() {
  const { user, teachers } = useAuth();

  // Mode: Practice with AI or Submit to Teacher
  const [activeMode, setActiveMode] = useState<"practice" | "submit">("practice");

  // Category filter for tasks
  const [selectedCategory, setSelectedCategory] = useState<"all" | TaskCategory>("all");

  // Selected Task
  const [selectedTaskId, setSelectedTaskId] = useState<string>(MIDDLE_SCHOOL_TASKS[0].id);
  const [isRolling, setIsRolling] = useState(false);
  const [randomNotice, setRandomNotice] = useState<string | null>(null);
  // Mobile accordion toggle for guidance and connectors
  const [mobileGuidanceOpen, setMobileGuidanceOpen] = useState(false);

  // Writing text & copy status
  const [essayText, setEssayText] = useState("");
  const [copied, setCopied] = useState(false);

  // AI Feedback state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    encouragement: string;
    strengths: string[];
    tips: string[];
  } | null>(null);

  // Submit to teacher form state
  const [studentName, setStudentName] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [studentClass, setStudentClass] = useState("ז'1");
  const [studentNote, setStudentNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<SubmissionRecord | null>(null);

  // Submissions history dialog
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [submissionsList, setSubmissionsList] = useState<SubmissionRecord[]>([]);

  // Initialize student name & teacher selection based on auth user
  useEffect(() => {
    if (user) {
      if (user.role === "student") {
        setStudentName(user.name);
        if (user.teacherId) {
          setSelectedTeacherId(user.teacherId);
        }
      } else if (user.role === "teacher") {
        setStudentName(`מורה: ${user.name}`);
        setSelectedTeacherId(user.id);
      }
    } else {
      if (!studentName) {
        setStudentName("");
      }
    }
  }, [user]);

  // Set default teacher if not set
  useEffect(() => {
    if (!selectedTeacherId && teachers.length > 0) {
      setSelectedTeacherId(teachers[0].id);
    }
  }, [teachers, selectedTeacherId]);

  // Filtered task catalog
  const filteredTasks = useMemo(() => {
    if (selectedCategory === "all") return MIDDLE_SCHOOL_TASKS;
    return MIDDLE_SCHOOL_TASKS.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  const currentTask =
    MIDDLE_SCHOOL_TASKS.find((t) => t.id === selectedTaskId) || MIDDLE_SCHOOL_TASKS[0];

  // Word count calculation
  const wordList = useMemo(() => {
    return essayText.trim() ? essayText.trim().split(/\s+/).filter(Boolean) : [];
  }, [essayText]);
  const wordCount = wordList.length;

  const isWordCountGood = wordCount >= currentTask.minWords && wordCount <= currentTask.maxWords;

  // Insert connector into text
  const handleAddConnector = (connText: string) => {
    setEssayText((prev) => (prev ? `${prev} ${connText} ` : `${connText} `));
  };

  // Roll random topic
  const handleRollRandom = () => {
    setIsRolling(true);
    setRandomNotice(null);

    // Pick from current filtered list or all tasks
    const pool = filteredTasks.length > 1 ? filteredTasks : MIDDLE_SCHOOL_TASKS;
    const available = pool.filter((t) => t.id !== selectedTaskId);
    const chosen = available[Math.floor(Math.random() * available.length)] || pool[0];

    setTimeout(() => {
      setSelectedTaskId(chosen.id);
      setIsRolling(false);
      setFeedback(null);
      setRandomNotice(`🎲 נבחר עבורך באקראי: "${chosen.hebrewTitle}"`);
      setTimeout(() => setRandomNotice(null), 4000);
    }, 450);
  };

  // Run AI evaluation
  const handleEvaluate = () => {
    if (wordCount < 10) {
      alert("אנא כתבו לפחות משפט או שניים באנגלית (10 מילים ומעלה) לפני בדיקת החיבור.");
      return;
    }

    setIsEvaluating(true);

    setTimeout(() => {
      const lower = essayText.toLowerCase();
      const strengths: string[] = [];
      const tips: string[] = [];

      // Check task fulfillment
      if (wordCount >= currentTask.minWords) {
        strengths.push(`אורך מעולה! כתבת ${wordCount} מילים, בדיוק בטווח המבוקש לחטיבת הביניים (${currentTask.targetWords}).`);
      } else {
        tips.push(`החיבור קצר מעט (${wordCount} מילים). מומלץ להוסיף עוד משפט או שניים להשלמת יעד המילים (${currentTask.targetWords}).`);
      }

      // Check connectors
      if (
        lower.includes("in addition") ||
        lower.includes("first") ||
        lower.includes("however") ||
        lower.includes("because") ||
        lower.includes("for example") ||
        lower.includes("therefore")
      ) {
        strengths.push("שימוש נכון ומעשיר במילות קישור שמחברות את המשפטים לרצף קריא והגיוני!");
      } else {
        tips.push("נסו לשלב מילת קישור אחת לפחות (כגון 'In addition', 'Because' או 'For example') להעשרת הטיעונים.");
      }

      // Check capitalization of 'I'
      if (/\bi\b/.test(essayText)) {
        tips.push("שימו לב: את מילת הגוף 'I' (אני) כותבים תמיד באות גדולה (Capital I) באנגלית!");
      } else {
        strengths.push("הקפדה יפה על אותיות גדולות בתחילת משפטים ובמילת הגוף 'I'.");
      }

      // Check category specific guidance
      if (currentTask.category === "letter") {
        if (lower.includes("dear") || lower.includes("hi ")) {
          strengths.push("פתיחת מכתב מדויקת ומנומסת ('Dear' / 'Hi')!");
        } else {
          tips.push("במכתב מומלץ לפתוח בפנייה ישירה: 'Dear [Name],' או 'Hi [Name],'.");
        }
      } else if (currentTask.category === "opinion") {
        if (lower.includes("in my opinion") || lower.includes("i believe") || lower.includes("in conclusion")) {
          strengths.push("מבנה פסקת דעה מצוין הכולל הבעת עמדה מנומקת!");
        } else {
          tips.push("בפסקת דעה כדאי לפתוח בהצהרה: 'In my opinion,...' ולסיים ב: 'In conclusion,...'.");
        }
      }

      // Encouraging friendly score
      const calcScore = Math.min(100, Math.max(75, 80 + (isWordCountGood ? 10 : 0) + strengths.length * 3));

      setFeedback({
        score: calcScore,
        encouragement: "עבודה נהדרת! המשך/י כך — תרגול כתיבה רציף הוא הדרך המהירה להגיע לשליטה באנגלית!",
        strengths,
        tips,
      });

      setIsEvaluating(false);
    }, 850);
  };

  // Submit essay to teacher
  const handleSubmitToTeacher = async () => {
    const trimmedName = studentName.trim();
    if (!trimmedName) {
      alert("אנא הזינו את שמכם המלא לצורך הגשה למורה.");
      return;
    }

    if (wordCount < 15) {
      alert("החיבור קצר מדי להגשה (פחות מ-15 מילים). אנא כתבו לפחות פסקה קצרה באנגלית לפני ההגשה.");
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
      essayText: essayText.trim(),
      wordCount: wordCount,
      submittedAt: new Date().toLocaleString("he-IL"),
      receiptCode: receiptCode,
      status: "submitted",
    };

    setIsSubmitting(true);

    try {
      // 1. Save to localStorage
      const existingJson = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      const list: SubmissionRecord[] = existingJson ? JSON.parse(existingJson) : [];
      list.unshift(newSubmission);
      localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(list));

      // 2. Save to Firestore if available
      if (db) {
        try {
          await addDoc(collection(db, "submissions"), {
            ...newSubmission,
            timestamp: new Date().toISOString(),
          });
        } catch (fbErr) {
          console.warn("Firestore submission fallback to local storage:", fbErr);
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

  // Load submissions history
  const handleOpenHistory = async () => {
    let localList: SubmissionRecord[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (stored) {
        localList = JSON.parse(stored);
      }
    } catch {
      localList = [];
    }

    // If Firestore is available and teacher is logged in, attempt to fetch teacher submissions
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
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground p-1.5 px-2 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors shrink-0"
              title="חזרה לראשי"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">ראשי</span>
            </Link>
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                <PenTool className="h-4 w-4" />
              </div>
              <span className="font-bold text-xs sm:text-base truncate">
                <span>אימון כתיבה</span>
                <span className="hidden sm:inline"> &bull; חטיבת ביניים בן גוריון</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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
              <span>Guide</span>
            </Link>
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-3 sm:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6">
        {/* Random notice banner */}
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

        {/* Section 1: Mode Switcher & Category Selection Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4" dir="rtl">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground ml-1 shrink-0">מצב עבודה:</span>
            <div className="inline-flex rounded-xl p-1 bg-muted/60 border border-border/80 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveMode("practice");
                  setSubmissionSuccess(null);
                }}
                className={`flex-1 sm:flex-none px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeMode === "practice"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                <span className="hidden sm:inline">אימון חופשי ומשוב AI</span>
                <span className="sm:hidden">אימון AI</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode("submit");
                  setFeedback(null);
                }}
                className={`flex-1 sm:flex-none px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeMode === "submit"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">הגשה למורה לבדיקה</span>
                <span className="sm:hidden">הגשה למורה</span>
              </button>
            </div>
          </div>

          {/* Random Prompt Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRollRandom}
              disabled={isRolling}
              variant="outline"
              size="sm"
              className="h-9 px-3 sm:px-4 text-xs font-bold gap-2 cursor-pointer border-purple-500/40 hover:bg-purple-500/10 hover:border-purple-500/60 transition-all text-purple-700 dark:text-purple-300 shadow-xs w-full sm:w-auto"
              dir="rtl"
            >
              <Dice5 className={`h-4 w-4 text-purple-600 dark:text-purple-400 ${isRolling ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">🎲 הצע נושא רנדומלי (הפתע אותי!)</span>
              <span className="sm:hidden">🎲 הפתע אותי עם נושא!</span>
            </Button>
          </div>
        </div>

        {/* Section 2: Task Filter Tabs & Selector Dropdown */}
        <div className="space-y-3" dir="rtl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none w-full sm:w-auto">
              <span className="text-xs text-muted-foreground font-semibold ml-1 shrink-0">סינון:</span>
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/80"
                }`}
              >
                הכל ({MIDDLE_SCHOOL_TASKS.length})
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory("letter")}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                  selectedCategory === "letter"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/80"
                }`}
              >
                <Mail className="h-3 w-3" />
                <span>מכתבים (8)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory("opinion")}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                  selectedCategory === "opinion"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/80"
                }`}
              >
                <FileText className="h-3 w-3" />
                <span>דעה (8)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory("creative")}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                  selectedCategory === "creative"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/80"
                }`}
              >
                <Compass className="h-3 w-3" />
                <span>סיפורים (8)</span>
              </button>
            </div>

            {/* Target Words Badge */}
            <Badge variant="secondary" className="text-xs font-bold self-start sm:self-auto">
              יעד כתיבה: {currentTask.targetWords}
            </Badge>
          </div>

          {/* Task Dropdown Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-semibold text-muted-foreground shrink-0">בחרו נושא מתוך הרשימה:</span>
            <select
              value={selectedTaskId}
              onChange={(e) => {
                setSelectedTaskId(e.target.value);
                setFeedback(null);
                setSubmissionSuccess(null);
              }}
              className="h-9 w-full sm:max-w-md rounded-lg border border-input bg-background px-3 text-xs font-medium shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              {filteredTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.category === "letter" ? "מכתב" : t.category === "opinion" ? "פסקת דעה" : "סיפור יצירתי"}]{" "}
                  {t.hebrewTitle} &bull; {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 3: Two-Column Grid (Guidance on Left, Writing Area on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Task Guidance & Connectors Palette */}
          <div className="lg:col-span-5 space-y-4">
            {/* Task Guidance Card */}
            <Card className="border border-border shadow-xs">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold">
                    {currentTask.category === "letter" ? (
                      <Mail className="h-4 w-4" />
                    ) : currentTask.category === "opinion" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Compass className="h-4 w-4" />
                    )}
                    <span>
                      {currentTask.category === "letter"
                        ? "כתיבת מכתב / אימייל אישי"
                        : currentTask.category === "opinion"
                        ? "כתיבת פסקת דעה וטיעון"
                        : "כתיבת סיפור יצירתי"}
                    </span>
                  </div>

                  <Badge variant="outline" className="text-[11px]">
                    {currentTask.targetWords}
                  </Badge>
                </div>

                <CardTitle className="text-base sm:text-lg font-bold pt-1.5 text-right" dir="rtl">
                  {currentTask.hebrewTitle}
                </CardTitle>
                <CardDescription
                  className="text-xs text-foreground/90 leading-relaxed font-sans pt-1"
                  dir="ltr"
                >
                  {currentTask.prompt}
                </CardDescription>
              </CardHeader>

              {/* Mobile Accordion Toggle for instructions and connectors */}
              <div className="lg:hidden p-3 bg-muted/30 border-b border-border/40 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5" dir="rtl">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span>הנחיות, טיפים ומילות קישור</span>
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileGuidanceOpen((prev) => !prev)}
                  className="h-7 text-xs gap-1 cursor-pointer"
                >
                  <span>{mobileGuidanceOpen ? "הסתר" : "הצג טיפים ומילים"}</span>
                  {mobileGuidanceOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </Button>
              </div>

              <CardContent className={`pt-3.5 space-y-3 text-xs ${mobileGuidanceOpen ? "block" : "hidden lg:block"}`}>
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1" dir="rtl">
                  <span className="font-bold text-foreground">הנחיות לביצוע המשימה:</span>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentTask.hebrewInstructions}
                  </p>
                </div>

                <div className="space-y-1.5" dir="rtl">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span>טיפים מובילים לכתיבה מעולה:</span>
                  </span>
                  <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 pr-1">
                    {currentTask.starterTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Connectors Palette - Collapsible on mobile, always visible on desktop */}
            <Card className={`border border-primary/20 bg-card ${mobileGuidanceOpen ? "block" : "hidden lg:block"}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5" dir="rtl">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>מילות קישור וחיבור (לחצו כדי לשלב בחיבור):</span>
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-1">
                {MS_CONNECTORS.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground block text-right" dir="rtl">
                      {cat.category}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddConnector(item.text)}
                          className="px-2.5 py-1 rounded-md border border-border bg-muted/40 hover:bg-primary/10 hover:border-primary/30 text-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="font-semibold text-foreground">{item.text}</span>
                          <span className="text-[10px] text-muted-foreground">({item.heb})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Writing Pad, Evaluation & Submit to Teacher Form */}
          <div className="lg:col-span-7 space-y-4">
            {/* Word Count & Controls Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">ספירת מילים:</span>
                <span
                  className={`font-extrabold text-base ${
                    isWordCountGood ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                  }`}
                >
                  {wordCount}
                </span>
                <span className="text-muted-foreground">/ {currentTask.targetWords}</span>
                {isWordCountGood && (
                  <Badge variant="default" className="text-[10px] bg-emerald-600 text-white">
                    ✓ אורך מצוין
                  </Badge>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-7 text-xs gap-1 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "הועתק" : "העתק טקסט"}</span>
              </Button>
            </div>

            {/* Writing Textarea */}
            <textarea
              rows={13}
              placeholder="Start typing your paragraph, letter, or creative story in English here..."
              value={essayText}
              onChange={(e) => {
                setEssayText(e.target.value);
                setSubmissionSuccess(null);
              }}
              dir="ltr"
              className="w-full rounded-xl border border-input bg-card p-4 text-sm md:text-base leading-relaxed font-sans shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />

            {/* MODE 1: PRACTICE & AI FEEDBACK */}
            {activeMode === "practice" && (
              <div className="space-y-4">
                <Button
                  onClick={handleEvaluate}
                  disabled={isEvaluating}
                  className="w-full h-11 text-sm font-bold cursor-pointer gap-2 bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                  <span>{isEvaluating ? "בודק את החיבור עם מורה AI..." : "בדיקת חיבור וקבלת משוב מעודד"}</span>
                </Button>

                {/* AI Feedback Box */}
                {feedback && (
                  <div
                    className="p-5 rounded-2xl border border-primary/30 bg-card space-y-4 shadow-sm animate-in fade-in"
                    dir="rtl"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <span className="text-xs text-muted-foreground block font-semibold">משוב מורה AI:</span>
                        <h4 className="text-lg font-black text-foreground">{feedback.encouragement}</h4>
                      </div>
                      <Badge variant="default" className="text-sm px-3 py-1 font-bold">
                        ציון משוער: {feedback.score}
                      </Badge>
                    </div>

                    {/* Strengths */}
                    {feedback.strengths.length > 0 && (
                      <div className="space-y-1.5 text-xs">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>נקודות חוזק בחיבור שלך:</span>
                        </span>
                        <ul className="space-y-1 text-foreground/90 pl-5 pr-2 list-disc">
                          {feedback.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tips */}
                    {feedback.tips.length > 0 && (
                      <div className="space-y-1.5 text-xs pt-1">
                        <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                          <Lightbulb className="h-4 w-4 shrink-0" />
                          <span>הצעות לשיפור לפעם הבאה:</span>
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

            {/* MODE 2: SUBMIT TO TEACHER */}
            {activeMode === "submit" && (
              <div className="space-y-4">
                {/* Submission Form Card */}
                {!submissionSuccess ? (
                  <Card className="border border-purple-500/40 bg-card p-5 space-y-4 shadow-xs" dir="rtl">
                    <div className="border-b border-border/50 pb-3">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                        <GraduationCap className="h-4 w-4" />
                        <span>פרטי הגשה למורה לבדיקה ומתן ציון</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        החיבור יישלח ישירות למורה שלך ויישמר במערכת לבדיקה.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Student Name */}
                      <div className="space-y-1">
                        <label className="font-semibold text-foreground">שם מלא של התלמיד/ה:</label>
                        <input
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="למשל: נועם כהן"
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>

                      {/* Class */}
                      <div className="space-y-1">
                        <label className="font-semibold text-foreground">כיתה:</label>
                        <select
                          value={studentClass}
                          onChange={(e) => setStudentClass(e.target.value)}
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                        >
                          <option value="ז'1">שכבת ז׳ - כיתה ז'1</option>
                          <option value="ז'2">שכבת ז׳ - כיתה ז'2</option>
                          <option value="ז'3">שכבת ז׳ - כיתה ז'3</option>
                          <option value="ח'1">שכבת ח׳ - כיתה ח'1</option>
                          <option value="ח'2">שכבת ח׳ - כיתה ח'2</option>
                          <option value="ח'3">שכבת ח׳ - כיתה ח'3</option>
                          <option value="ט'1">שכבת ט׳ - כיתה ט'1</option>
                          <option value="ט'2">שכבת ט׳ - כיתה ט'2</option>
                          <option value="ט'3">שכבת ט׳ - כיתה ט'3</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Teacher Selection */}
                      <div className="space-y-1">
                        <label className="font-semibold text-foreground">בחירת מורה לבדיקה:</label>
                        {teachers.length > 0 ? (
                          <select
                            value={selectedTeacherId}
                            onChange={(e) => setSelectedTeacherId(e.target.value)}
                            className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                          >
                            {teachers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.schoolName || "חטיבת ביניים בן גוריון"})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="שם המורה לבדיקה"
                            value={selectedTeacherId}
                            onChange={(e) => setSelectedTeacherId(e.target.value)}
                            className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                        )}
                      </div>

                      {/* Student Note */}
                      <div className="space-y-1">
                        <label className="font-semibold text-foreground">הערה אישית למורה (אופציונלי):</label>
                        <input
                          type="text"
                          value={studentNote}
                          onChange={(e) => setStudentNote(e.target.value)}
                          placeholder="למשל: שאלה או בקשת דגש מיוחד"
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmitToTeacher}
                      disabled={isSubmitting || wordCount < 10}
                      className="w-full h-11 text-sm font-bold cursor-pointer gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmitting ? "שולח חיבור למורה..." : "הגש חיבור למורה לבדיקה"}</span>
                    </Button>
                  </Card>
                ) : (
                  /* Submission Success Receipt */
                  <div
                    className="p-6 rounded-2xl border-2 border-emerald-500/40 bg-card space-y-4 shadow-sm animate-in fade-in"
                    dir="rtl"
                  >
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <div className="p-2.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-foreground">
                          החיבור הוגש בהצלחה למורה לבדיקה!
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          קוד אישור הגשה: <span className="font-mono font-bold text-foreground">{submissionSuccess.receiptCode}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-muted/40 p-3.5 rounded-xl border border-border/60">
                      <div>
                        <span className="text-muted-foreground block">שם התלמיד/ה:</span>
                        <span className="font-bold text-foreground">{submissionSuccess.studentName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">מורה בודק/ת:</span>
                        <span className="font-bold text-foreground">{submissionSuccess.teacherName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">כיתה:</span>
                        <span className="font-bold text-foreground">{submissionSuccess.studentClass}</span>
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

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const receipt = `אישור הגשת חיבור באנגלית - חטיבת ביניים בן גוריון\nתלמיד/ה: ${submissionSuccess.studentName}\nכיתה: ${submissionSuccess.studentClass}\nמורה: ${submissionSuccess.teacherName}\nמשימה: ${submissionSuccess.hebrewTitle}\nמילים: ${submissionSuccess.wordCount}\nמועד: ${submissionSuccess.submittedAt}\nקוד הגשה: ${submissionSuccess.receiptCode}`;
                          navigator.clipboard.writeText(receipt);
                          alert("אישור ההגשה הועתק ללוח!");
                        }}
                        className="text-xs gap-1.5 cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>העתק אישור הגשה</span>
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
                        <span>כתיבת חיבור נוסף</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

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
                  <p>עדיין לא נרשמו הגשות חיבורים במכשיר זה.</p>
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
                          {sub.category === "letter" ? "מכתב" : sub.category === "opinion" ? "פסקת דעה" : "יצירתי"}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{sub.submittedAt}</span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>נושא: <strong className="text-foreground">{sub.hebrewTitle}</strong> ({sub.taskTitle})</span>
                      <span>{sub.wordCount} מילים</span>
                    </div>

                    <div className="p-3 rounded-lg bg-background border border-border/50 font-sans text-xs text-foreground/90 whitespace-pre-wrap max-h-36 overflow-y-auto" dir="ltr">
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
    </div>
  );
}
