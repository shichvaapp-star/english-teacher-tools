"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { SubmissionItem } from "@/types/submission";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { StudentLoginModal } from "@/components/auth/student-login-modal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  PenTool,
  Search,
  RefreshCw,
  Copy,
  Check,
  Eye,
  X,
  MessageSquare,
  GraduationCap,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

const LOCAL_SUBMISSIONS_KEY = "ett_writing_submissions";

export default function StudentPortalPage() {
  const { user } = useAuth();

  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "writing" | "unseen">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "submitted" | "reviewed">("all");

  // Selected item for details modal
  const [selectedItem, setSelectedItem] = useState<SubmissionItem | null>(null);

  // Copied receipt code toast
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Login modal trigger for guests
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Fetch student submissions
  const fetchStudentSubmissions = async () => {
    setIsLoading(true);
    let items: SubmissionItem[] = [];

    // 1. Read from local storage
    try {
      const localRaw = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (localRaw) {
        const parsed: SubmissionItem[] = JSON.parse(localRaw);
        if (user) {
          // Filter to this student's submissions
          items = parsed.filter(
            (item) =>
              item.studentId === user.id ||
              item.studentName.trim().toLowerCase() === user.name.trim().toLowerCase()
          );
        } else {
          items = parsed;
        }
      }
    } catch {
      items = [];
    }

    // 2. Fetch from Firestore if user is logged in
    if (db && user) {
      try {
        const snap = await getDocs(collection(db, "submissions"));
        const fbItems: SubmissionItem[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() as Omit<SubmissionItem, "id">;
          if (
            data.studentId === user.id ||
            data.studentName.trim().toLowerCase() === user.name.trim().toLowerCase()
          ) {
            fbItems.push({
              id: docSnap.id,
              ...data,
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
        console.warn("Firestore fetch student submissions notice:", err);
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
    fetchStudentSubmissions();
  }, [user]);

  // Copy receipt code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle =
          item.hebrewTitle.toLowerCase().includes(q) ||
          item.taskTitle.toLowerCase().includes(q);
        const matchesCode = item.receiptCode.toLowerCase().includes(q);
        const matchesTeacher = item.teacherName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCode && !matchesTeacher) return false;
      }

      if (typeFilter !== "all" && item.type !== typeFilter) {
        return false;
      }

      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [submissions, searchQuery, typeFilter, statusFilter]);

  // Stats
  const totalCount = submissions.length;
  const reviewedCount = submissions.filter((s) => s.status === "reviewed").length;
  const pendingCount = submissions.filter((s) => s.status === "submitted").length;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">חזרה לראשי</span>
            </Link>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm sm:text-base">
                העבודות והציונים שלי &bull; פורטל תלמידים
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStudentSubmissions}
              disabled={isLoading}
              className="h-8 text-xs gap-1.5 cursor-pointer border-border/80"
              title="רענן רשימה"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-primary" : ""}`}
              />
              <span className="hidden sm:inline">רענן</span>
            </Button>

            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Welcome Banner */}
        <div
          className="p-6 rounded-2xl border border-emerald-500/20 bg-card shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          dir="rtl"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-500/10">
                מרחב תלמיד/ה &bull; {user?.schoolName || "חטיבת ביניים בן גוריון"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              שלום, {user ? user.name : "אורח/ת"}! 👋
            </h1>
            <p className="text-xs text-muted-foreground">
              כאן תוכל/י לעקוב אחר כל המבחנים והחיבורים שהגשת, לראות אם המורה בדק/ה אותם, לצפות בציונים ובמשוב האישי.
            </p>
          </div>

          {user ? (
            <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border/60 text-xs">
              <GraduationCap className="h-5 w-5 text-primary shrink-0" />
              <div>
                <span className="text-muted-foreground block text-[11px]">כיתה ומורה מקבל/ת:</span>
                <span className="font-bold text-foreground">
                  כיתה {user.fullClass || user.classGrade || "חטיבת ביניים"} &bull; {user.teacherName || "מורה לאנגלית"}
                </span>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => setLoginModalOpen(true)}
              className="gap-1.5 text-xs font-bold cursor-pointer"
            >
              <span>התחבר כתלמיד/ה לשמירת עבודות</span>
            </Button>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" dir="rtl">
          <Card className="p-4 flex items-center justify-between border-border/70 shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground font-semibold">סה&quot;כ עבודות שהוגשו</span>
              <div className="text-2xl font-black text-foreground">{totalCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between border-border/70 shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground font-semibold">עבודות שנבדקו (עם ציון)</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {reviewedCount}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between border-border/70 shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground font-semibold">ממתין לבדיקת המורה</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {pendingCount}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </Card>
        </div>

        {/* Filter Controls */}
        <div
          className="p-4 rounded-xl border border-border/70 bg-card shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between"
          dir="rtl"
        >
          <div className="relative flex-1">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חיפוש לפי שם משימה, מורה או קוד אישור..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "writing" | "unseen")}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <option value="all">כל סוגי המשימות (הכל)</option>
              <option value="unseen">📖 מבחני אנסין (Unseen)</option>
              <option value="writing">✍️ מטלות כתיבה (Writing)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "submitted" | "reviewed")
              }
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="reviewed">✓ נבדקו עם ציון</option>
              <option value="submitted">⏳ ממתינים לבדיקה</option>
            </select>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-3" dir="rtl">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
              <p className="text-xs text-muted-foreground">טוען את ההגשות שלך...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-border/80 space-y-3">
              <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground/50" />
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground">לא נמצאו עבודות שהוגשו</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  כאשר תגיש/י מבחן אנסין או חיבור לבדיקת המורה, הם יופיעו כאן אוטומטית עם סטטוס הבדיקה והציון!
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <Link href="/unseen">
                  <Button size="sm" variant="default" className="text-xs gap-1.5 cursor-pointer font-bold">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>תרגל מבחן אנסין</span>
                  </Button>
                </Link>
                <Link href="/writing">
                  <Button size="sm" variant="outline" className="text-xs gap-1.5 cursor-pointer">
                    <PenTool className="h-3.5 w-3.5" />
                    <span>כתוב חיבור למורה</span>
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            filteredSubmissions.map((sub) => {
              const isReviewed = sub.status === "reviewed";
              const displayGrade = sub.grade !== undefined ? sub.grade : sub.score;

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-all shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {sub.type === "writing" ? "✍️ מטלת כתיבה" : "📖 מבחן אנסין"}
                      </Badge>

                      <span className="font-black text-sm sm:text-base text-foreground">
                        {sub.hebrewTitle}
                      </span>
                      <span className="text-xs text-muted-foreground hidden sm:inline" dir="ltr">
                        ({sub.taskTitle})
                      </span>

                      {/* Status Badge */}
                      {isReviewed ? (
                        <Badge className="text-[10px] bg-emerald-600 text-white font-bold gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>נבדק • ציון: {displayGrade} / 100</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-amber-600 border-amber-500/40 bg-amber-500/10 font-bold gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          <span>ממתין לבדיקת המורה</span>
                          {sub.type === "unseen" && sub.score !== undefined && (
                            <span className="text-muted-foreground font-normal">
                              (ציון ממוחשב: {sub.score})
                            </span>
                          )}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{sub.submittedAt}</span>
                      <Button
                        size="sm"
                        onClick={() => setSelectedItem(sub)}
                        className="h-7 text-xs font-bold gap-1 cursor-pointer bg-primary hover:bg-primary/90"
                      >
                        <Eye className="h-3 w-3" />
                        <span>צפה בעבודה</span>
                      </Button>
                    </div>
                  </div>

                  {/* Details row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span>מורה מקבל/ת: </span>
                      <strong className="text-foreground">{sub.teacherName || "מורה לאנגלית"}</strong>
                    </div>

                    <div>
                      {sub.type === "unseen" ? (
                        <span>רמה: <strong className="text-foreground">{sub.storyLevel || "חטיבת ביניים"}</strong></span>
                      ) : (
                        <span>ספירת מילים: <strong className="text-foreground">{sub.wordCount || 0} מילים</strong></span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span>קוד אישור: </span>
                      <code className="font-mono font-bold text-foreground bg-muted px-1.5 py-0.5 rounded">
                        {sub.receiptCode}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(sub.receiptCode)}
                        className="p-1 text-muted-foreground hover:text-foreground transition cursor-pointer"
                        title="העתק קוד"
                      >
                        {copiedCode === sub.receiptCode ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Teacher Feedback Quote if reviewed */}
                  {sub.teacherFeedback && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-950 dark:text-emerald-100 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-200">
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                        <span>משוב והערות המורה:</span>
                      </div>
                      <p className="leading-relaxed pr-5">{sub.teacherFeedback}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* View Work Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto flex flex-col"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  {selectedItem.type === "unseen" ? <BookOpen className="h-5 w-5" /> : <PenTool className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-black text-lg text-foreground">
                    {selectedItem.hebrewTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {selectedItem.taskTitle} &bull; {selectedItem.studentClass} &bull; מורה: {selectedItem.teacherName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status & Grade Banner in Modal */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                selectedItem.status === "reviewed"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {selectedItem.status === "reviewed" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Clock className="h-4 w-4 text-amber-600" />
                )}
                <span>
                  {selectedItem.status === "reviewed"
                    ? "העבודה נבדקה ע\"י המורה"
                    : "העבודה הוגשה ונמצאת בהמתנה לבדיקה"}
                </span>
              </div>
              <span className="text-sm font-black">
                ציון: {selectedItem.grade ?? selectedItem.score ?? "טרם הוזן"} / 100
              </span>
            </div>

            {/* Teacher Feedback */}
            {selectedItem.teacherFeedback && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-200 block">
                  💬 משוב אישי מהמורה:
                </span>
                <p className="leading-relaxed text-foreground">{selectedItem.teacherFeedback}</p>
              </div>
            )}

            {/* Submission Content: Unseen vs Writing */}
            {selectedItem.type === "unseen" ? (
              <div className="space-y-4">
                {/* Passage */}
                {selectedItem.passageText && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-xs text-foreground block">
                      טקסט קטע הקריאה:
                    </span>
                    <div
                      className="p-3.5 rounded-xl border border-border bg-muted/20 text-xs font-sans leading-relaxed text-foreground whitespace-pre-wrap max-h-40 overflow-y-auto"
                      dir="ltr"
                    >
                      {selectedItem.passageText}
                    </div>
                  </div>
                )}

                {/* Question Breakdown */}
                {selectedItem.questionsBreakdown && selectedItem.questionsBreakdown.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-xs text-foreground block">
                      פירוט כל השאלות והתשובות שלך:
                    </span>
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {selectedItem.questionsBreakdown.map((q) => (
                        <div
                          key={q.id}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                            q.isCorrect
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : "border-destructive/30 bg-destructive/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground">
                              שאלה {q.number}: {q.prompt}
                            </span>
                            <Badge
                              variant={q.isCorrect ? "default" : "destructive"}
                              className="text-[10px]"
                            >
                              {q.isCorrect ? "✓ 10 נק'" : "✗ 0 נק'"}
                            </Badge>
                          </div>

                          <div className="text-muted-foreground" dir="ltr">
                            <span>התשובה שלך: </span>
                            <strong
                              className={
                                q.isCorrect
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-destructive"
                              }
                            >
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
                                  : String(
                                      q.correctAnswer || q.targetSentence || q.modelAnswer || ""
                                    )}
                              </strong>
                            </div>
                          )}

                          {q.explanationHebrew && (
                            <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/30" dir="rtl">
                              💡 {q.explanationHebrew}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Writing Task */
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>טקסט החיבור שהגשת:</span>
                  {selectedItem.wordCount !== undefined && (
                    <Badge variant="outline" className="text-[11px]">
                      {selectedItem.wordCount} מילים
                    </Badge>
                  )}
                </div>

                <div
                  className="p-4 rounded-xl border border-border bg-muted/20 text-sm font-sans leading-relaxed text-foreground whitespace-pre-wrap max-h-60 overflow-y-auto"
                  dir="ltr"
                >
                  {selectedItem.essayText || "אין טקסט זמין"}
                </div>
              </div>
            )}

            {selectedItem.studentNote && (
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs">
                <span className="font-bold text-foreground">הערה ששלחת למורה: </span>
                <span className="text-muted-foreground">{selectedItem.studentNote}</span>
              </div>
            )}

            <div className="border-t border-border pt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
                className="text-xs cursor-pointer"
              >
                סגור
              </Button>
            </div>
          </div>
        </div>
      )}

      <StudentLoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
}
