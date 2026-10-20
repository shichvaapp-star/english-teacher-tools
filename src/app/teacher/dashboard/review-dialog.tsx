"use client";

import React, { useState, useEffect } from "react";
import { SubmissionItem } from "@/types/submission";
import type { WritingEvaluationResult } from "@/app/api/evaluate-writing/route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  BookA,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  Loader2,
  Check,
  Send,
  Printer,
  X,
} from "lucide-react";

interface ReviewDialogProps {
  reviewItem: SubmissionItem | null;
  onClose: () => void;
  onSaveGrade: (updatedItem: SubmissionItem) => Promise<void>;
  onAiReview: (sub: SubmissionItem) => Promise<void>;
  isEvaluatingAi: boolean;
  writingAiResult: WritingEvaluationResult | null;
}

export function ReviewDialog({
  reviewItem,
  onClose,
  onSaveGrade,
  onAiReview,
  isEvaluatingAi,
  writingAiResult,
}: ReviewDialogProps) {
  const [gradeInput, setGradeInput] = useState<string>("");
  const [feedbackInput, setFeedbackInput] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (reviewItem) {
      setGradeInput(
        reviewItem.grade !== undefined
          ? String(reviewItem.grade)
          : reviewItem.score !== undefined
          ? String(reviewItem.score)
          : ""
      );
      setFeedbackInput(reviewItem.teacherFeedback || reviewItem.teacherNote || "");
      setSaveSuccess(false);
    }
  }, [reviewItem]);

  if (!reviewItem) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const numericGrade = gradeInput.trim() !== "" ? Number(gradeInput.trim()) : undefined;

    const updated: SubmissionItem = {
      ...reviewItem,
      grade: numericGrade,
      teacherFeedback: feedbackInput.trim(),
      status: "reviewed",
      reviewedAt: new Date().toLocaleString("he-IL"),
      ...(writingAiResult
        ? {
            score: writingAiResult.score,
            encouragement: writingAiResult.encouragement,
            teacherNote: writingAiResult.teacherNote,
            strengths: writingAiResult.strengths,
            tips: writingAiResult.tips,
            writingRubric: writingAiResult.rubric,
            corrections: writingAiResult.corrections,
            vocabularyUpgrades: writingAiResult.vocabularyUpgrades,
          }
        : {}),
    };

    await onSaveGrade(updated);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto flex flex-col"
        dir="rtl"
      >
        {/* Modal Header */}
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
                {reviewItem.hebrewTitle} &bull; {reviewItem.studentClass || "חטיבת ביניים"}
                {reviewItem.studentGroup && ` • הקבצה ${reviewItem.studentGroup}`} (
                {reviewItem.type === "vocab" ? "אימון אוצר מילים" : reviewItem.type === "unseen" ? "מבחן אנסין" : "חיבור כתיבה"})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {reviewItem.type !== "vocab" && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onAiReview(reviewItem)}
                disabled={isEvaluatingAi}
                className="h-8 text-xs font-bold gap-1.5 border-purple-500/40 text-purple-700 dark:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 cursor-pointer shadow-xs"
                title="הפעל בדיקת AI מקיפה"
              >
                {isEvaluatingAi ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-600 dark:text-purple-400" />
                    <span>בודק ב-AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{writingAiResult ? "בדיקת AI מחדש" : "בדיקת AI"}</span>
                  </>
                )}
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="space-y-3 flex-1 text-xs">
          {reviewItem.type === "vocab" ? (
            <div className="space-y-4">
              {/* Top Vocab Stats Banner */}
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <BookA className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      אימון אוצר מילים ממוקד
                    </h4>
                    <p className="text-2xs text-muted-foreground">
                      {reviewItem.vocabSummary
                        ? `${reviewItem.vocabSummary.totalWords} מילים הוקצו לתרגול • ${reviewItem.vocabSummary.masteredCount} בשליטה מלאה`
                        : "התלמיד השלים את תרגול המילים בהצלחה"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="text-sm px-2.5 py-0.5 font-bold bg-emerald-600 text-white">
                    ציון תרגול: {reviewItem.score ?? 100} / 100
                  </Badge>
                </div>
              </div>

              {/* Practiced Words Grid */}
              <div className="space-y-2">
                <span className="font-bold text-foreground block">
                  פירוט המילים ותרגול התלמיד/ה ({reviewItem.vocabSummary?.wordsPracticed?.length || 0} מילים):
                </span>

                {reviewItem.vocabSummary?.wordsPracticed && reviewItem.vocabSummary.wordsPracticed.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {reviewItem.vocabSummary.wordsPracticed.map((w, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                          w.mastered
                            ? "border-emerald-500/40 bg-emerald-500/5"
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-black text-foreground text-sm" dir="ltr">{w.english}</span>
                          <span className="text-muted-foreground truncate">— {w.hebrew}</span>
                        </div>
                        <Badge
                          variant={w.mastered ? "default" : "outline"}
                          className={`text-3xs font-bold shrink-0 ${
                            w.mastered ? "bg-emerald-600 text-white" : "text-muted-foreground"
                          }`}
                        >
                          {w.mastered ? "✓ שליטה מלאה" : "בתהליך"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-border text-center text-muted-foreground text-xs">
                    כל המילים הוקצו ותרגולן הושלם במערכת.
                  </div>
                )}
              </div>
            </div>
          ) : reviewItem.type === "unseen" ? (
            <>
              {reviewItem.generationPrompt ? (
                <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
                      <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
                      <span>פרומפט התלמיד/ה ליצירת הטקסט ב-AI:</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 font-bold">
                      ✨ נוצר ב-AI
                    </Badge>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background/80 border border-border/60 text-foreground font-medium leading-relaxed font-sans" dir="auto">
                    "{reviewItem.generationPrompt}"
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/40 text-[11px] text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  <span>טקסט ממאגר הסיפורים המובנה</span>
                </div>
              )}

              {/* Passage Viewer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-muted-foreground">
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

              {/* Question Breakdown */}
              {reviewItem.questionsBreakdown && reviewItem.questionsBreakdown.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-foreground block">
                    פירוט תשובות התלמיד/ה ({reviewItem.questionsBreakdown.length} שאלות):
                  </span>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {reviewItem.questionsBreakdown.map((q) => {
                      const pts = typeof q.points === "number" ? q.points : q.isCorrect ? 10 : 0;
                      return (
                        <div
                          key={q.id}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                            pts >= 8
                              ? "border-emerald-500/40 bg-emerald-500/5"
                              : pts >= 5
                              ? "border-amber-500/40 bg-amber-500/5"
                              : "border-destructive/40 bg-destructive/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground">
                              שאלה {q.number}: {q.prompt}
                            </span>
                            <Badge
                              variant={pts >= 8 ? "default" : pts >= 5 ? "secondary" : "destructive"}
                              className="text-[10px] font-bold"
                            >
                              {pts}/10 נק׳
                            </Badge>
                          </div>
                          <div className="text-muted-foreground" dir="ltr">
                            <span>תשובת התלמיד/ה: </span>
                            <strong className={pts >= 8 ? "text-emerald-700 dark:text-emerald-300" : pts >= 5 ? "text-amber-700 dark:text-amber-300" : "text-destructive"}>
                              {q.type === "mcq" && q.options && typeof q.userAnswer === "number"
                                ? q.options[q.userAnswer] || q.userAnswer
                                : String(q.userAnswer || "לא נענה")}
                            </strong>
                          </div>
                          {pts < 10 && (
                            <div className="text-muted-foreground" dir="ltr">
                              <span>תשובה נכונה: </span>
                              <strong className="text-foreground">
                                {q.type === "mcq" && q.options && typeof q.correctAnswer === "number"
                                  ? q.options[q.correctAnswer]
                                  : String(q.correctAnswer || q.targetSentence || q.modelAnswer || "")}
                              </strong>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Writing Task Text */}
              <div className="flex items-center justify-between text-muted-foreground">
                <span>טקסט החיבור שהוגש על ידי התלמיד/ה:</span>
                {reviewItem.wordCount !== undefined && (
                  <Badge variant="outline" className="text-[11px]">
                    {reviewItem.wordCount} מילים
                  </Badge>
                )}
              </div>

              <div
                className="p-4 rounded-xl border border-border bg-muted/20 text-sm font-sans leading-relaxed text-foreground whitespace-pre-wrap max-h-56 overflow-y-auto"
                dir="ltr"
              >
                {reviewItem.essayText || "אין טקסט זמין"}
              </div>

              {/* AI Evaluation Result for Writing */}
              {isEvaluatingAi && (
                <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-center gap-2.5 text-purple-700 dark:text-purple-300 font-bold animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-600 dark:text-purple-400" />
                  <span>מבצע בדיקת AI מלאה (מחוון משרד החינוך, דקדוק, אוצר מילים ומשוב)...</span>
                </div>
              )}

              {writingAiResult && !isEvaluatingAi && (
                <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-3 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                    <div>
                      <Badge variant="outline" className="text-[10px] gap-1 border-purple-500/40 text-purple-700 dark:text-purple-300 font-bold">
                        <Sparkles className="h-3 w-3 text-purple-500" />
                        <span>בדיקת AI פדגוגית (מחוון משרד החינוך)</span>
                      </Badge>
                      <h4 className="text-sm font-black text-foreground mt-1">
                        "{writingAiResult.encouragement}"
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className="text-base px-3 py-0.5 font-black text-white bg-emerald-600">
                        {writingAiResult.score} / 100
                      </Badge>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setGradeInput(String(writingAiResult.score));
                          if (writingAiResult.teacherNote) setFeedbackInput(writingAiResult.teacherNote);
                        }}
                        className="h-8 text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>החל על הטופס</span>
                      </Button>
                    </div>
                  </div>

                  {/* Rubric Breakdown */}
                  {writingAiResult.rubric && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded-xl border border-border/70 bg-card space-y-1">
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span>תוכן וארגון</span>
                          <span className="text-primary font-mono">{writingAiResult.rubric.contentAndOrganization.score}/35</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                          {writingAiResult.rubric.contentAndOrganization.commentHebrew}
                        </p>
                      </div>

                      <div className="p-2 rounded-xl border border-border/70 bg-card space-y-1">
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span>אוצר מילים</span>
                          <span className="text-primary font-mono">{writingAiResult.rubric.vocabulary.score}/25</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                          {writingAiResult.rubric.vocabulary.commentHebrew}
                        </p>
                      </div>

                      <div className="p-2 rounded-xl border border-border/70 bg-card space-y-1">
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span>דקדוק ומבנה</span>
                          <span className="text-primary font-mono">{writingAiResult.rubric.languageAndGrammar.score}/25</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                          {writingAiResult.rubric.languageAndGrammar.commentHebrew}
                        </p>
                      </div>

                      <div className="p-2 rounded-xl border border-border/70 bg-card space-y-1">
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span>איות ופיסוק</span>
                          <span className="text-primary font-mono">{writingAiResult.rubric.mechanicsAndSpelling.score}/15</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                          {writingAiResult.rubric.mechanicsAndSpelling.commentHebrew}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Strengths & Tips */}
                  {((writingAiResult.strengths && writingAiResult.strengths.length > 0) ||
                    (writingAiResult.tips && writingAiResult.tips.length > 0)) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {writingAiResult.strengths && writingAiResult.strengths.length > 0 && (
                        <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-card space-y-1">
                          <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            <span>נקודות חוזק:</span>
                          </span>
                          <ul className="text-foreground/90 pr-2 list-disc list-inside text-[11px]">
                            {writingAiResult.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {writingAiResult.tips && writingAiResult.tips.length > 0 && (
                        <div className="p-2.5 rounded-xl border border-amber-500/30 bg-card space-y-1">
                          <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 text-[11px]">
                            <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                            <span>דגשים לשיפור:</span>
                          </span>
                          <ul className="text-foreground/90 pr-2 list-disc list-inside text-[11px]">
                            {writingAiResult.tips.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Corrections diff */}
                  {writingAiResult.corrections && writingAiResult.corrections.length > 0 && (
                    <div className="p-3 rounded-xl border border-border/80 bg-card space-y-1.5">
                      <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                        <span>תיקוני לשון ואיות שה-AI זיהה ({writingAiResult.corrections.length}):</span>
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {writingAiResult.corrections.map((corr, i) => (
                          <div key={i} className="p-2 rounded-lg bg-muted/30 border border-border/50 text-[11px]">
                            <div className="flex items-center gap-2" dir="ltr">
                              <span className="line-through text-rose-600 dark:text-rose-400 font-mono">
                                {corr.original}
                              </span>
                              <span className="text-muted-foreground">&rarr;</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                                {corr.suggestion}
                              </span>
                            </div>
                            <p className="text-muted-foreground mt-0.5">{corr.explanationHebrew}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {reviewItem.studentNote && (
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
              <span className="font-bold text-foreground">הערה אישית מהתלמיד/ה: </span>
              <span className="text-muted-foreground">{reviewItem.studentNote}</span>
            </div>
          )}
        </div>

        {/* Grading Form Footer */}
        <form onSubmit={handleSubmit} className="border-t border-border pt-3 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">ציון מספרי (0–100):</label>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="ציון"
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                className="h-9 text-xs font-bold"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-foreground">משוב לתלמיד/ה:</label>
              <Input
                type="text"
                placeholder="הערה או משוב אישי..."
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {saveSuccess && (
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>הציון והמשוב נשמרו בהצלחה!</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>הדפס</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs cursor-pointer">
                סגור
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSaving}
                className="text-xs font-bold gap-1.5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSaving ? "שומר..." : "שמור בדיקה"}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
