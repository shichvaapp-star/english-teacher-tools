"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PenTool,
  Sparkles,
  CheckCircle2,
  Copy,
  Send,
  GraduationCap,
  Printer,
  BookOpen,
} from "lucide-react";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";

export function WritingAssignmentSubmit({ c }: { c: WritingPracticeController }) {
  const {
    activeMode,
    feedback,
    handleSubmitToTeacher,
    isSubmitting,
    selectedLevel,
    selectedTeacherId,
    setActiveMode,
    setEssayText,
    setSelectedTeacherId,
    setStudentClass,
    setStudentName,
    setStudentNote,
    setSubmissionSuccess,
    studentClass,
    studentName,
    studentNote,
    submissionSuccess,
    teachers,
    wordCount,
  } = c;
  return (
    <>
      {/* ASSIGNMENT MODE: SUBMIT TO TEACHER */}
      {activeMode === "submit" && (
        <div className="space-y-4 pt-1">
          {/* Optional banner if already evaluated with AI */}
          {feedback && !submissionSuccess && (
            <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs" dir="rtl">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span className="text-foreground">
                  ציון AI מקדים שקיבלת באימון: <strong className="font-bold text-primary">{feedback.score} / 100</strong>
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
                החיבור ייבדק רשמית ע&quot;י המורה
              </Badge>
            </div>
          )}

          {!submissionSuccess ? (
            <Card className="border border-purple-500/40 bg-card p-4 sm:p-5 space-y-3.5 shadow-xs" dir="rtl">
              <div className="border-b border-border/50 pb-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    <GraduationCap className="h-4 w-4" />
                    <span>הגשת המשימה למורה לבדיקה ולמתן ציון</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMode("practice")}
                    className="text-primary hover:underline text-[11px] font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>חזרה לאימון חופשי</span>
                  </button>
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
    </>
  );
}
