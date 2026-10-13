"use client";

import React, { useState } from "react";
import { SubmissionItem } from "@/types/submission";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  Sparkles,
  Trash2,
  Check,
  Send,
  Loader2,
  BookOpen,
  PenTool,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

interface TurnInsTableProps {
  submissions: SubmissionItem[];
  onOpenFullReview: (sub: SubmissionItem) => void;
  onAiReview: (sub: SubmissionItem) => Promise<void>;
  onDeleteSubmission: (id: string, studentName: string) => Promise<void>;
  onQuickSaveGrade: (sub: SubmissionItem, grade?: number, feedback?: string) => Promise<void>;
  loadingAiSubId: string | null;
}

// Robust timestamp parser supporting ISO, timestamps, or Israeli date format (DD/MM/YYYY, HH:MM:SS)
export function parseSubmissionTimestamp(val?: string | number | null): number {
  if (!val) return 0;
  if (typeof val === "number") return val;
  const parsed = Date.parse(val);
  if (!isNaN(parsed)) return parsed;

  const match = val.match(/(\d{1,2})[./](\d{1,2})[./](\d{4})(?:,\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (match) {
    const [, day, month, year, hours = "0", minutes = "0", seconds = "0"] = match;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds)
    ).getTime();
  }
  return 0;
}

// Format relative/compact time
function formatCompactTime(timestampStr: string): string {
  const ts = parseSubmissionTimestamp(timestampStr);
  if (!ts) return timestampStr || "—";

  const diffMs = Date.now() - ts;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "ממש עכשיו";
  if (diffMinutes < 60) return `לפני ${diffMinutes} דק׳`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays === 1) return "אתמול";
  if (diffDays < 7) return `לפני ${diffDays} ימים`;

  const d = new Date(ts);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export function TurnInsTable({
  submissions,
  onOpenFullReview,
  onAiReview,
  onDeleteSubmission,
  onQuickSaveGrade,
  loadingAiSubId,
}: TurnInsTableProps) {
  // Set of currently expanded row IDs
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Local draft inputs for quick inline grading per submission ID
  const [quickGrades, setQuickGrades] = useState<Record<string, string>>({});
  const [quickFeedbacks, setQuickFeedbacks] = useState<Record<string, string>>({});
  const [savingRowId, setSavingRowId] = useState<string | null>(null);
  const [savedRowId, setSavedRowId] = useState<string | null>(null);

  const toggleRow = (id: string, sub: SubmissionItem) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Prepopulate draft inputs
        if (quickGrades[id] === undefined) {
          setQuickGrades((q) => ({
            ...q,
            [id]: sub.grade !== undefined ? String(sub.grade) : sub.score !== undefined ? String(sub.score) : "",
          }));
        }
        if (quickFeedbacks[id] === undefined) {
          setQuickFeedbacks((f) => ({
            ...f,
            [id]: sub.teacherFeedback || sub.teacherNote || "",
          }));
        }
      }
      return next;
    });
  };

  const handleInlineSave = async (sub: SubmissionItem) => {
    setSavingRowId(sub.id);
    const rawGrade = quickGrades[sub.id] !== undefined ? quickGrades[sub.id] : String(sub.grade ?? sub.score ?? "");
    const rawFeedback = quickFeedbacks[sub.id] !== undefined ? quickFeedbacks[sub.id] : sub.teacherFeedback || "";

    const numGrade = rawGrade.trim() !== "" ? Number(rawGrade.trim()) : undefined;
    await onQuickSaveGrade(sub, numGrade, rawFeedback.trim());

    setSavingRowId(null);
    setSavedRowId(sub.id);
    setTimeout(() => setSavedRowId(null), 2500);
  };

  if (submissions.length === 0) {
    return (
      <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-border/80 bg-muted/20">
        <BookOpen className="h-10 w-10 text-muted-foreground/50 mx-auto" />
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-foreground">לא נמצאו הגשות תואמות</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            כאשר תלמידים יגישו משימות כתיבה או מבחני אנסין, ההגשות יופיעו כאן בטבלה באופן מיידי, כאשר החדשות ביותר מוצגות ראשונות.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[28%] font-black text-xs text-foreground">תלמיד/ה (לחץ/י לפתיחה)</TableHead>
            <TableHead className="w-[24%] font-black text-xs text-foreground">משימה וסוג</TableHead>
            <TableHead className="w-[16%] font-black text-xs text-foreground">מועד הגשה</TableHead>
            <TableHead className="w-[16%] font-black text-xs text-foreground">סטטוס וציון</TableHead>
            <TableHead className="w-[16%] text-left font-black text-xs text-foreground pl-4">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((sub) => {
            const isExpanded = expandedIds.has(sub.id);
            const isReviewed = sub.status === "reviewed";
            const isAiLoading = loadingAiSubId === sub.id;
            const isSavingThis = savingRowId === sub.id;
            const isSavedThis = savedRowId === sub.id;

            // Student initials for minimal avatar
            const initials = sub.studentName
              ? sub.studentName
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : "ST";

            // Relative time and raw time
            const compactTime = formatCompactTime(sub.submittedAt);
            const isRecent = Date.now() - parseSubmissionTimestamp(sub.submittedAt) < 24 * 3600 * 1000;

            return (
              <React.Fragment key={sub.id}>
                {/* Main Table Row */}
                <TableRow
                  className={`transition-colors cursor-pointer select-none ${
                    isExpanded ? "bg-muted/40 border-b-transparent" : "hover:bg-muted/30"
                  }`}
                  onClick={() => toggleRow(sub.id, sub)}
                >
                  {/* Student Column as Expandable Button */}
                  <TableCell className="py-3 font-medium">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(sub.id, sub);
                      }}
                      className="flex items-center gap-2.5 text-right w-full cursor-pointer group focus:outline-hidden"
                      aria-expanded={isExpanded}
                    >
                      <div className="text-muted-foreground transition-transform group-hover:text-foreground">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-primary" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0">
                        {initials}
                      </div>

                      {/* Student Name & Badges */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors truncate"
                            dir="ltr"
                          >
                            {sub.studentName}
                          </span>
                          {!isReviewed && isRecent && (
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" title="הגשה חדשה" />
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-0.5">
                          {sub.studentClass && (
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              {sub.studentClass}
                            </span>
                          )}
                          {sub.studentGroup && (
                            <Badge variant="outline" className="text-[9px] py-0 px-1 font-bold border-purple-500/40 text-purple-700 dark:text-purple-300 bg-purple-500/10">
                              הקבצה {sub.studentGroup}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  </TableCell>

                  {/* Task & Type */}
                  <TableCell className="py-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          variant="secondary"
                          className="text-[10px] py-0 px-1.5 gap-1 shrink-0 font-medium"
                        >
                          {sub.type === "writing" ? (
                            <>
                              <PenTool className="h-2.5 w-2.5 text-purple-500" />
                              <span>כתיבה</span>
                            </>
                          ) : (
                            <>
                              <BookOpen className="h-2.5 w-2.5 text-sky-500" />
                              <span>אנסין</span>
                            </>
                          )}
                        </Badge>
                        <span className="font-bold text-xs text-foreground truncate">
                          {sub.hebrewTitle}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground block truncate" dir="ltr">
                        {sub.taskTitle}
                      </span>
                    </div>
                  </TableCell>

                  {/* Submission Time */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    <div className="space-y-0.5" title={sub.submittedAt}>
                      <span className="font-semibold text-foreground text-[11px] block">
                        {compactTime}
                      </span>
                      <span className="text-[10px] text-muted-foreground hidden sm:block truncate">
                        {sub.submittedAt}
                      </span>
                    </div>
                  </TableCell>

                  {/* Status & Grade */}
                  <TableCell className="py-3">
                    {isReviewed ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" />
                        <span>נבדק: {sub.grade ?? sub.score ?? "—"}/100</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-500/20">
                        <Clock className="h-3 w-3 shrink-0 text-amber-600" />
                        <span>ממתין לבדיקה</span>
                      </div>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 text-left pl-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {/* AI Review Quick Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onAiReview(sub)}
                        disabled={isAiLoading}
                        className="h-7 px-2 text-xs font-bold gap-1 cursor-pointer text-purple-700 dark:text-purple-300 hover:bg-purple-500/15"
                        title="בדיקת AI מקיפה"
                      >
                        {isAiLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        )}
                        <span className="hidden xl:inline">AI</span>
                      </Button>

                      {/* Full Modal Review */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenFullReview(sub)}
                        className="h-7 px-2.5 text-xs font-bold gap-1 cursor-pointer border-border/80 hover:bg-muted"
                        title="פתח מסך בדיקה מלא"
                      >
                        <Eye className="h-3 w-3" />
                        <span className="hidden sm:inline">{isReviewed ? "צפה" : "בדוק"}</span>
                      </Button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDeleteSubmission(sub.id, sub.studentName)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer rounded-md"
                        title="מחק הגשה"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* EXPANDED ACCORDION ROW: Inline Assignment Details & Fast Review */}
                {isExpanded && (
                  <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-border/80 animate-in fade-in">
                    <TableCell colSpan={5} className="p-4 sm:p-5">
                      <div className="rounded-xl border border-border/80 bg-card p-4 space-y-4 shadow-2xs">
                        {/* Top bar in expanded panel */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="font-bold text-foreground">
                              פרטי הגשת עבודה &bull; {sub.studentName}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {sub.hebrewTitle} ({sub.taskTitle})
                            </Badge>
                            {sub.receiptCode && (
                              <span className="text-[10px] font-mono text-muted-foreground">
                                קוד אישור: {sub.receiptCode}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onOpenFullReview(sub)}
                              className="h-7 text-xs font-bold gap-1.5 cursor-pointer border-border/80"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>פתח מסך מחוון ו-AI מלא</span>
                            </Button>
                          </div>
                        </div>

                        {/* Submission Content */}
                        <div className="space-y-2 text-xs">
                          {sub.type === "writing" ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span className="font-semibold text-foreground">טקסט החיבור שהוגש:</span>
                                {sub.wordCount !== undefined && (
                                  <span className="text-[11px]">{sub.wordCount} מילים</span>
                                )}
                              </div>
                              <div
                                className="p-3.5 rounded-xl border border-border/70 bg-muted/20 text-xs sm:text-sm font-sans leading-relaxed text-foreground whitespace-pre-wrap max-h-48 overflow-y-auto"
                                dir="ltr"
                              >
                                {sub.essayText || "אין תוכן חיבור זמין"}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {sub.passageText && (
                                <div className="space-y-1">
                                  <span className="font-semibold text-foreground block">קטע הקריאה (Unseen):</span>
                                  <div
                                    className="p-3 rounded-lg border border-border/60 bg-muted/20 text-xs font-sans leading-relaxed text-foreground whitespace-pre-wrap max-h-32 overflow-y-auto"
                                    dir="ltr"
                                  >
                                    {sub.passageText}
                                  </div>
                                </div>
                              )}

                              {/* Question summary pills */}
                              {sub.questionsBreakdown && sub.questionsBreakdown.length > 0 && (
                                <div className="space-y-1">
                                  <span className="font-semibold text-foreground block">
                                    תשובות התלמיד/ה ({sub.questionsBreakdown.length} שאלות):
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                                    {sub.questionsBreakdown.map((q) => {
                                      const pts = typeof q.points === "number" ? q.points : q.isCorrect ? 10 : 0;
                                      return (
                                        <div
                                          key={q.id}
                                          className={`p-2 rounded-lg border text-[11px] flex items-center justify-between gap-2 ${
                                            pts >= 8
                                              ? "border-emerald-500/30 bg-emerald-500/5"
                                              : pts >= 5
                                              ? "border-amber-500/30 bg-amber-500/5"
                                              : "border-destructive/30 bg-destructive/5"
                                          }`}
                                        >
                                          <span className="truncate">
                                            ש׳ {q.number}: {q.prompt}
                                          </span>
                                          <Badge
                                            variant={pts >= 8 ? "default" : pts >= 5 ? "secondary" : "destructive"}
                                            className="text-[9px] shrink-0 font-bold"
                                          >
                                            {pts}/10
                                          </Badge>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {sub.studentNote && (
                            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-[11px]">
                              <span className="font-bold text-foreground">הערת התלמיד/ה למורה: </span>
                              <span className="text-muted-foreground">{sub.studentNote}</span>
                            </div>
                          )}

                          {sub.teacherFeedback && (
                            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-900 dark:text-emerald-200">
                              <span className="font-bold block flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>המשוב שהוזן לתלמיד/ה:</span>
                              </span>
                              <p className="mt-0.5">{sub.teacherFeedback}</p>
                            </div>
                          )}
                        </div>

                        {/* Fast Inline Grading Controls */}
                        <div className="border-t border-border/60 pt-3 space-y-2">
                          <span className="font-bold text-xs text-foreground block">
                            הזנה מהירה של ציון ומשוב (Fast Review):
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-muted-foreground block">
                                ציון (0–100):
                              </label>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="למשל: 92"
                                value={quickGrades[sub.id] ?? ""}
                                onChange={(e) =>
                                  setQuickGrades((q) => ({ ...q, [sub.id]: e.target.value }))
                                }
                                className="h-8 text-xs font-bold"
                              />
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-[11px] font-semibold text-muted-foreground block">
                                משוב אישי:
                              </label>
                              <Input
                                type="text"
                                placeholder="כתוב/כתבי הערה אישית..."
                                value={quickFeedbacks[sub.id] ?? ""}
                                onChange={(e) =>
                                  setQuickFeedbacks((f) => ({ ...f, [sub.id]: e.target.value }))
                                }
                                className="h-8 text-xs"
                              />
                            </div>

                            <div className="flex items-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleInlineSave(sub)}
                                disabled={isSavingThis}
                                className="h-8 text-xs font-bold gap-1 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
                              >
                                {isSavingThis ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : isSavedThis ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Send className="h-3 w-3" />
                                )}
                                <span>{isSavedThis ? "נשמר!" : "שמור ציון"}</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onAiReview(sub)}
                                disabled={isAiLoading}
                                className="h-8 text-xs font-bold gap-1 cursor-pointer border-purple-500/40 text-purple-700 dark:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20"
                                title="הפעל בדיקת AI"
                              >
                                <Sparkles className="h-3 w-3 text-purple-500" />
                                <span>AI</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
