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
} from "firebase/firestore";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { TeacherAuthModal } from "@/components/auth/teacher-auth-modal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  BookOpen,
  User,
  Copy,
  Check,
  RefreshCw,
  Printer,
  Trash2,
  X,
  AlertCircle,
  Eye,
  Send,
  Sparkles,
  School,
  Lock,
} from "lucide-react";

import { SubmissionItem } from "@/types/submission";

const LOCAL_SUBMISSIONS_KEY = "ett_writing_submissions";

export default function TeacherDashboardPage() {
  const { user } = useAuth();

  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "submitted" | "reviewed">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "writing" | "unseen">("all");
  const [classFilter, setClassFilter] = useState<string>("all");

  // Selected submission for review modal
  const [reviewItem, setReviewItem] = useState<SubmissionItem | null>(null);
  const [gradeInput, setGradeInput] = useState<string>("");
  const [feedbackInput, setFeedbackInput] = useState<string>("");
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Copied code toast
  const [copiedCode, setCopiedCode] = useState(false);

  // Auth modal for non-teachers
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch submissions from Firestore and localStorage
  const fetchSubmissions = async () => {
    setIsLoading(true);
    let items: SubmissionItem[] = [];

    // 1. Read from local storage
    try {
      const localRaw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (localRaw) {
        const parsed: SubmissionItem[] = JSON.parse(localRaw);
        items = parsed;
      }
    } catch {
      items = [];
    }

    // 2. Fetch from Firestore if user is a teacher and db exists
    if (db && user && user.role === "teacher") {
      try {
        // Query submissions where teacherId equals this teacher's UID
        const q = query(
          collection(db, "submissions"),
          where("teacherId", "==", user.id)
        );
        const snap = await getDocs(q);
        const fbItems: SubmissionItem[] = [];
        snap.forEach((docSnap) => {
          fbItems.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<SubmissionItem, "id">),
          });
        });

        // Merge: prefer Firestore records over local duplicates
        if (fbItems.length > 0) {
          const map = new Map<string, SubmissionItem>();
          items.forEach((item) => map.set(item.id, item));
          fbItems.forEach((item) => map.set(item.id, item));
          items = Array.from(map.values());
        }
      } catch (err) {
        console.warn("Firestore fetch submissions notice:", err);
      }
    }

    // Sort newest first
    items.sort((a, b) => {
      const timeA = new Date(a.submittedAt).getTime() || 0;
      const timeB = new Date(b.submittedAt).getTime() || 0;
      return timeB - timeA;
    });

    setSubmissions(items);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  // Copy teacher code
  const handleCopyCode = () => {
    if (!user?.teacherCode) return;
    navigator.clipboard.writeText(user.teacherCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Open review modal
  const handleOpenReview = (item: SubmissionItem) => {
    setReviewItem(item);
    setGradeInput(item.grade !== undefined ? String(item.grade) : item.score !== undefined ? String(item.score) : "");
    setFeedbackInput(item.teacherFeedback || "");
    setSaveSuccess(false);
  };

  // Save grade and teacher feedback
  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewItem) return;

    setIsSavingGrade(true);

    const numericGrade = gradeInput.trim() !== "" ? Number(gradeInput.trim()) : undefined;
    const reviewedItem: SubmissionItem = {
      ...reviewItem,
      grade: numericGrade,
      teacherFeedback: feedbackInput.trim(),
      status: "reviewed",
      reviewedAt: new Date().toLocaleString("he-IL"),
    };

    // 1. Update in Firestore
    if (db) {
      try {
        const ref = doc(db, "submissions", reviewItem.id);
        await updateDoc(ref, {
          grade: numericGrade,
          teacherFeedback: feedbackInput.trim(),
          status: "reviewed",
          reviewedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Firestore update notice:", err);
      }
    }

    // 2. Update in localStorage
    try {
      const existingRaw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (existingRaw) {
        const list: SubmissionItem[] = JSON.parse(existingRaw);
        const updatedList = list.map((item) =>
          item.id === reviewItem.id ? reviewedItem : item
        );
        localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(updatedList));
      }
    } catch {
      // Ignore
    }

    // 3. Update local state
    setSubmissions((prev) =>
      prev.map((item) => (item.id === reviewItem.id ? reviewedItem : item))
    );
    setReviewItem(reviewedItem);
    setIsSavingGrade(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Delete submission
  const handleDeleteSubmission = async (id: string, studentName: string) => {
    if (!confirm(`האם למחוק את ההגשה של התלמיד/ה "${studentName}"?`)) {
      return;
    }

    // 1. Delete from Firestore
    if (db) {
      try {
        await deleteDoc(doc(db, "submissions", id));
      } catch (err) {
        console.warn("Firestore delete notice:", err);
      }
    }

    // 2. Delete from localStorage
    try {
      const existingRaw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (existingRaw) {
        const list: SubmissionItem[] = JSON.parse(existingRaw);
        const updatedList = list.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(updatedList));
      }
    } catch {
      // Ignore
    }

    // 3. Update local state
    setSubmissions((prev) => prev.filter((item) => item.id !== id));
    if (reviewItem?.id === id) {
      setReviewItem(null);
    }
  };

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesStudent = item.studentName.toLowerCase().includes(q);
        const matchesTitle = item.hebrewTitle.toLowerCase().includes(q) || item.taskTitle.toLowerCase().includes(q);
        const matchesCode = item.receiptCode?.toLowerCase().includes(q);
        if (!matchesStudent && !matchesTitle && !matchesCode) return false;
      }

      // Status filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== "all" && item.type !== typeFilter) {
        return false;
      }

      // Class filter
      if (classFilter !== "all" && item.studentClass !== classFilter) {
        return false;
      }

      return true;
    });
  }, [submissions, searchQuery, statusFilter, typeFilter, classFilter]);

  // Stats calculation
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === "submitted").length;
  const reviewedCount = submissions.filter((s) => s.status === "reviewed").length;
  const uniqueStudents = new Set(submissions.map((s) => s.studentName.trim().toLowerCase())).size;

  // -------------------------------------------------------------
  // ACCESS CONTROL: Strictly visible only for logged in teachers
  // -------------------------------------------------------------
  if (!user || user.role !== "teacher") {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>חזרה לדף הראשי</span>
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="h-4 w-[1px] bg-border" />
              <UserNav />
            </div>
          </div>
        </header>

        {/* Access Restricted Screen */}
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
                לוח הבקרה מיועד למורי אנגלית בלבד לצורך צפייה וניהול של הגשות תלמידים, מתן ציונים והערות.
                {user?.role === "student" && (
                  <span className="block mt-2 font-bold text-foreground">
                    כרגע הנך מחובר/ת כחשבון תלמיד/ה ({user.name}).
                  </span>
                )}
              </CardDescription>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="w-full gap-2 text-xs font-bold cursor-pointer bg-primary hover:bg-primary/90"
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

  // -------------------------------------------------------------
  // TEACHER DASHBOARD VIEW (Authorized Teacher)
  // -------------------------------------------------------------
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
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-bold text-xs sm:text-base truncate">
                <span>לוח מורה</span>
                <span className="hidden sm:inline"> &bull; חטיבת ביניים בן גוריון</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSubmissions}
              disabled={isLoading}
              className="h-8 text-xs gap-1 cursor-pointer border-border/80 px-2 sm:px-3"
              title="רענן רשימת הגשות"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-primary" : ""}`} />
              <span className="hidden sm:inline">רענן</span>
            </Button>

            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-3 sm:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6">
        {/* Welcome & Teacher Class Code Card */}
        <div className="p-4 sm:p-6 rounded-2xl border border-primary/20 bg-card shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4" dir="rtl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                סגל הוראה &bull; {user.schoolName || "חטיבת ביניים בן גוריון"}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-foreground">
              שלום, {user.name}! 👋
            </h1>
            <p className="text-xs text-muted-foreground">
              כאן תוכל/י לראות את כל המשימות שהוגשו לבדיקה, לתת ציונים ולשלוח משוב אישי לתלמידים.
            </p>
          </div>

          {/* Class Code Box */}
          {user.teacherCode && (
            <div className="p-3 sm:p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between gap-3 w-full md:w-auto min-w-0 sm:min-w-[260px]">
              <div>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground block font-semibold">קוד המורה שלך לתלמידים:</span>
                <span className="font-mono text-base sm:text-lg font-black tracking-wider text-primary">
                  {user.teacherCode}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="h-8 text-xs gap-1.5 cursor-pointer shrink-0"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCode ? "הועתק!" : "העתק קוד"}</span>
              </Button>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" dir="rtl">
          <Card className="border-border/80 shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">סה״כ הגשות:</span>
                <span className="text-2xl font-black text-foreground">{totalCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">ממתינות לבדיקה:</span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">נבדקו וניתן ציון:</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{reviewedCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">תלמידים פעילים:</span>
                <span className="text-2xl font-black text-foreground">{uniqueStudents}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/50 pb-4" dir="rtl">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Tabs */}
            <div className="inline-flex rounded-lg p-1 bg-muted/60 border border-border/80 text-xs overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer text-xs shrink-0 ${
                  statusFilter === "all" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                הכל ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("submitted")}
                className={`px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer text-xs shrink-0 ${
                  statusFilter === "submitted" ? "bg-amber-500/20 text-amber-800 dark:text-amber-200" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ממתין ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("reviewed")}
                className={`px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer text-xs shrink-0 ${
                  statusFilter === "reviewed" ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-200" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                נבדקו ({reviewedCount})
              </button>
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "writing" | "unseen")}
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <option value="all">כל המשימות</option>
              <option value="writing">✍️ כתיבה</option>
              <option value="unseen">📖 אנסין</option>
            </select>

            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <option value="all">כל הכיתות</option>
              <option value="ז'1">כיתה ז'1</option>
              <option value="ז'2">כיתה ז'2</option>
              <option value="ז'3">כיתה ז'3</option>
              <option value="ח'1">כיתה ח'1</option>
              <option value="ח'2">כיתה ח'2</option>
              <option value="ח'3">כיתה ח'3</option>
              <option value="ט'1">כיתה ט'1</option>
              <option value="ט'2">כיתה ט'2</option>
              <option value="ט'3">כיתה ט'3</option>
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

        {/* Submissions List */}
        <div className="space-y-3" dir="rtl">
          {filteredSubmissions.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-border/80 bg-muted/20">
              <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-foreground">
                  לא נמצאו הגשות תואמות
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  כאשר תלמידים יגישו משימות כתיבה או מבחני אנסין ויבחרו בך כמורה, ההגשות יופיעו כאן באופן אוטומטי.
                </p>
              </div>
            </div>
          ) : (
            filteredSubmissions.map((sub) => {
              const isReviewed = sub.status === "reviewed";
              return (
                <div
                  key={sub.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-colors shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border/40 pb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-black text-sm sm:text-base text-foreground">
                        {sub.studentName}
                      </span>

                      {sub.studentClass && (
                        <Badge variant="outline" className="text-[10px]">
                          {sub.studentClass}
                        </Badge>
                      )}

                      <Badge variant="secondary" className="text-[10px]">
                        {sub.type === "writing" ? "✍️ כתיבה" : "📖 אנסין"}
                      </Badge>

                      {isReviewed ? (
                        <Badge variant="default" className="text-[10px] bg-emerald-600 text-white font-bold">
                          ✓ נבדק {sub.grade !== undefined ? `(${sub.grade})` : sub.score !== undefined ? `(${sub.score})` : ""}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/40 bg-amber-500/10 font-bold">
                          ⏳ ממתין
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 text-xs text-muted-foreground w-full sm:w-auto">
                      <span className="text-[11px] sm:text-xs">{sub.submittedAt}</span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleOpenReview(sub)}
                          className="h-7 text-xs font-bold gap-1 cursor-pointer bg-primary hover:bg-primary/90 px-2.5"
                        >
                          <Eye className="h-3 w-3" />
                          <span>{isReviewed ? "צפה / ערוך" : "בדוק מטלה"}</span>
                        </Button>

                        <button
                          onClick={() => handleDeleteSubmission(sub.id, sub.studentName)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          title="מחק הגשה"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span>משימה: </span>
                      <strong className="text-foreground">{sub.hebrewTitle}</strong> ({sub.taskTitle})
                    </div>
                    {sub.type === "unseen" ? (
                      <div>
                        <span>רמת אנסין: </span>
                        <strong className="text-foreground">{sub.storyLevel || "חטיבת ביניים"}</strong>
                        {sub.score !== undefined && (
                          <span className="mr-2"> &bull; ציון: <strong>{sub.grade ?? sub.score}/100</strong></span>
                        )}
                      </div>
                    ) : (
                      sub.wordCount !== undefined && (
                        <div>
                          <span>ספירת מילים: </span>
                          <strong className="text-foreground">{sub.wordCount} מילים</strong>
                        </div>
                      )
                    )}
                    {sub.receiptCode && (
                      <div>
                        <span>קוד אישור: </span>
                        <span className="font-mono font-bold text-foreground">{sub.receiptCode}</span>
                      </div>
                    )}
                  </div>

                  {/* Essay or Unseen snippet */}
                  {sub.type === "unseen" ? (
                    sub.passageText && (
                      <div className="p-3 rounded-lg bg-muted/40 border border-border/40 font-sans text-xs text-foreground/90 line-clamp-2" dir="ltr">
                        📖 {sub.passageText}
                      </div>
                    )
                  ) : (
                    sub.essayText && (
                      <div className="p-3 rounded-lg bg-muted/40 border border-border/40 font-sans text-xs text-foreground/90 line-clamp-2" dir="ltr">
                        {sub.essayText}
                      </div>
                    )
                  )}

                  {/* Teacher Feedback snippet if reviewed */}
                  {sub.teacherFeedback && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200">
                      <span className="font-bold block">הערת המורה לתלמיד/ה:</span>
                      <p className="mt-0.5">{sub.teacherFeedback}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Review & Grading Drawer / Modal */}
      {reviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto flex flex-col"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-foreground">
                    בדיקת הגשה &bull; {reviewItem.studentName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {reviewItem.hebrewTitle} &bull; {reviewItem.studentClass || "חטיבת ביניים"} ({reviewItem.type === "unseen" ? "מבחן אנסין" : "חיבור כתיבה"})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReviewItem(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Student Work Content */}
            <div className="space-y-3 flex-1">
              {reviewItem.type === "unseen" ? (
                <>
                  {/* Unseen Passage Viewer */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-bold text-foreground">קטע הקריאה (Reading Passage):</span>
                      <Badge variant="outline" className="text-[11px]">
                        {reviewItem.storyLevel || "Unseen"} &bull; ציון ממוחשב: {reviewItem.score ?? 0}/100
                      </Badge>
                    </div>
                    <div
                      className="p-3.5 rounded-xl border border-border bg-muted/20 text-xs font-sans leading-relaxed text-foreground whitespace-pre-wrap max-h-44 overflow-y-auto"
                      dir="ltr"
                    >
                      {reviewItem.passageText || "קטע קריאה לא זמין"}
                    </div>
                  </div>

                  {/* 10 Questions Breakdown */}
                  <div className="space-y-2">
                    <span className="font-bold text-xs text-foreground block">
                      פירוט תשובות התלמיד/ה ({reviewItem.questionsBreakdown?.length || 0} שאלות):
                    </span>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {reviewItem.questionsBreakdown && reviewItem.questionsBreakdown.length > 0 ? (
                        reviewItem.questionsBreakdown.map((q) => (
                          <div
                            key={q.id}
                            className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                              q.isCorrect
                                ? "border-emerald-500/40 bg-emerald-500/5"
                                : "border-destructive/40 bg-destructive/5"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground">
                                שאלה {q.number}: {q.prompt}
                              </span>
                              <Badge
                                variant={q.isCorrect ? "default" : "destructive"}
                                className="text-[10px] font-bold"
                              >
                                {q.isCorrect ? `✓ ${q.points || 10} נק'` : "✗ 0 נק'"}
                              </Badge>
                            </div>

                            <div className="text-muted-foreground" dir="ltr">
                              <span>תשובת התלמיד/ה: </span>
                              <strong className={q.isCorrect ? "text-emerald-700 dark:text-emerald-300 font-bold" : "text-destructive font-bold"}>
                                {q.type === "mcq" && q.options && typeof q.userAnswer === "number"
                                  ? q.options[q.userAnswer] || q.userAnswer
                                  : String(q.userAnswer || "לא נענה")}
                              </strong>
                            </div>

                            {!q.isCorrect && (
                              <div className="text-muted-foreground" dir="ltr">
                                <span>תשובה נכונה: </span>
                                <strong className="text-foreground">
                                  {q.type === "mcq" && q.options && typeof q.correctAnswer === "number"
                                    ? q.options[q.correctAnswer]
                                    : String(q.correctAnswer || q.targetSentence || q.modelAnswer || "")}
                                </strong>
                              </div>
                            )}

                            {q.explanationHebrew && (
                              <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/30" dir="rtl">
                                💡 {q.explanationHebrew}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground text-center">
                          ציון ממוחשב: {reviewItem.score ?? 0} מתוך 100
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>טקסט החיבור שהוגש על ידי התלמיד/ה:</span>
                    {reviewItem.wordCount !== undefined && (
                      <Badge variant="outline" className="text-[11px]">
                        {reviewItem.wordCount} מילים
                      </Badge>
                    )}
                  </div>

                  <div
                    className="p-4 rounded-xl border border-border bg-muted/20 text-sm font-sans leading-relaxed text-foreground whitespace-pre-wrap max-h-60 overflow-y-auto"
                    dir="ltr"
                  >
                    {reviewItem.essayText || "אין טקסט זמין"}
                  </div>
                </>
              )}

              {reviewItem.studentNote && (
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs">
                  <span className="font-bold text-foreground">הערה אישית מהתלמיד/ה: </span>
                  <span className="text-muted-foreground">{reviewItem.studentNote}</span>
                </div>
              )}
            </div>

            {/* Grading Form */}
            <form onSubmit={handleSaveGrade} className="border-t border-border pt-4 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>הזנת ציון ומשוב מורה</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">ציון מספרי (0–100):</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="למשל: 92"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="h-9 text-xs font-bold"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-foreground">משוב והערות בונות לתלמיד/ה:</label>
                  <Input
                    type="text"
                    placeholder="למשל: עבודה מצוינת! שימוש נהדר במילות קישור ואוצר מילים עשיר."
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 text-xs font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>הציון והמשוב נשמרו בהצלחה!</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-xs gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>הדפס עבודה</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReviewItem(null)}
                    className="text-xs cursor-pointer"
                  >
                    סגור
                  </Button>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSavingGrade}
                    className="text-xs font-bold gap-1.5 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSavingGrade ? "שומר..." : "שמור בדיקה ועדכן ציון"}</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
