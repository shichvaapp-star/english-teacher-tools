"use client";

import React from "react";
import Link from "next/link";
import { randomizeQuestionsOptions } from "@/data/unseen-middle-school";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Volume2,
  CheckCircle2,
  Sparkles,
  Copy,
  HelpCircle,
  RotateCcw,
  Check,
  Sliders,
  BookOpen,
  GraduationCap,
  ChevronDown,
  Languages,
} from "lucide-react";
import { InteractiveEnglishText } from "@/components/unseen/unseen-helpers";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenGradedSummary({ c }: { c: UnseenPracticeController }) {
  const {
    copiedReceipt,
    currentStory,
    gradedScore,
    handleSpeakText,
    handleTranslateSelection,
    handleWordClick,
    isSpeakingQuestion,
    isSubmitted,
    setActiveQuestionIndex,
    setCheckedQuestions,
    setCopiedReceipt,
    setGradedScore,
    setIsSubmitted,
    setShowDetailedUnseenRubric,
    setShowReviewAnswers,
    setStage,
    setStories,
    setSubmissionRecord,
    setUserAnswers,
    showDetailedUnseenRubric,
    showReviewAnswers,
    speakingQuestionId,
    submissionRecord,
  } = c;
  return (
    <>
      {/* Graded Mode Summary Card */}
      {isSubmitted && gradedScore !== null && (
        <Card className="border-emerald-500/40 bg-emerald-500/5 shadow-md animate-in fade-in-0 space-y-4 p-5" dir="rtl">
          <CardHeader className="p-0 text-center space-y-2">
            <span className="text-4xl">🏆</span>
            <CardTitle className="text-xl text-emerald-700 dark:text-emerald-300 font-black">
              {submissionRecord?.encouragement || `ציון המבחן שלך: ${gradedScore} / 100`}
            </CardTitle>
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant="default"
                className={`text-base px-3.5 py-1 font-black ${
                  gradedScore >= 85
                    ? "bg-emerald-600 text-white"
                    : gradedScore >= 70
                    ? "bg-blue-600 text-white"
                    : gradedScore >= 55
                    ? "bg-amber-600 text-white"
                    : "bg-rose-600 text-white"
                }`}
              >
                {gradedScore} / 100
              </Badge>
            </div>
          </CardHeader>

          {/* Teacher Personal Note */}
          {submissionRecord?.teacherNote && (
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1.5 text-right">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <GraduationCap className="h-4 w-4" />
                <span>משוב פדגוגי אישי מהמורה:</span>
              </div>
              <p className="text-foreground/90 leading-relaxed text-[12px]">
                {submissionRecord.teacherNote}
              </p>
            </div>
          )}

          {/* Strengths & Tips */}
          {((submissionRecord?.strengths && submissionRecord.strengths.length > 0) ||
            (submissionRecord?.tips && submissionRecord.tips.length > 0)) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-right">
              {submissionRecord.strengths && submissionRecord.strengths.length > 0 && (
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>נקודות חוזק בבדיקה:</span>
                  </div>
                  <ul className="space-y-1 text-foreground/90 pr-1 list-disc list-inside text-[11px]">
                    {submissionRecord.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {submissionRecord.tips && submissionRecord.tips.length > 0 && (
                <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span>טיפים לשיפור במבחן הבא:</span>
                  </div>
                  <ul className="space-y-1 text-foreground/90 pr-1 list-disc list-inside text-[11px]">
                    {submissionRecord.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 4-Pillar Reading Comprehension Rubric Cards with Progressive Disclosure */}
          {submissionRecord?.unseenRubric && (
            <div className="space-y-2 pt-1 border-t border-border/60 text-right">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDetailedUnseenRubric(!showDetailedUnseenRubric)}
                className="w-full text-xs font-bold gap-2 text-muted-foreground hover:text-foreground h-9 cursor-pointer"
              >
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDetailedUnseenRubric ? "rotate-180" : ""}`} />
                <span>{showDetailedUnseenRubric ? "הסתר מחוון מעמיק ▴" : "צפה בפירוט 4 עמודי התווך של משרד החינוך בהבנת הנקרא ▾"}</span>
              </Button>

              {showDetailedUnseenRubric && (
                <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>פירוט ציונים לפי 4 עמודי התווך של משרד החינוך בהבנת הנקרא:</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {/* 1. Explicit Details */}
                    <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-foreground">איתור מידע מפורש (Explicit Details)</span>
                        <span className="text-primary font-mono text-[11px]">
                          {submissionRecord.unseenRubric.explicitDetails.score} / {submissionRecord.unseenRubric.explicitDetails.max}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (submissionRecord.unseenRubric.explicitDetails.score / submissionRecord.unseenRubric.explicitDetails.max) * 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {submissionRecord.unseenRubric.explicitDetails.commentHebrew}
                      </p>
                    </div>

                    {/* 2. Inference & Context */}
                    <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-foreground">הסקת מסקנות ורמזי הקשר (Inference)</span>
                        <span className="text-primary font-mono text-[11px]">
                          {submissionRecord.unseenRubric.inferenceAndContext.score} / {submissionRecord.unseenRubric.inferenceAndContext.max}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (submissionRecord.unseenRubric.inferenceAndContext.score / submissionRecord.unseenRubric.inferenceAndContext.max) * 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {submissionRecord.unseenRubric.inferenceAndContext.commentHebrew}
                      </p>
                    </div>

                    {/* 3. Global Understanding */}
                    <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-foreground">הבנה כוללת ורעיון מרכזי (Global)</span>
                        <span className="text-primary font-mono text-[11px]">
                          {submissionRecord.unseenRubric.globalUnderstanding.score} / {submissionRecord.unseenRubric.globalUnderstanding.max}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (submissionRecord.unseenRubric.globalUnderstanding.score / submissionRecord.unseenRubric.globalUnderstanding.max) * 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {submissionRecord.unseenRubric.globalUnderstanding.commentHebrew}
                      </p>
                    </div>

                    {/* 4. Language & Accuracy */}
                    <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-foreground">דיוק בניסוח ובהעתקת משפטים (Accuracy)</span>
                        <span className="text-primary font-mono text-[11px]">
                          {submissionRecord.unseenRubric.languageAndAccuracy.score} / {submissionRecord.unseenRubric.languageAndAccuracy.max}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (submissionRecord.unseenRubric.languageAndAccuracy.score / submissionRecord.unseenRubric.languageAndAccuracy.max) * 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {submissionRecord.unseenRubric.languageAndAccuracy.commentHebrew}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submission Receipt Box */}
          {submissionRecord && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-card text-xs space-y-2.5 text-right">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>המבחן נבדק והוגש בהצלחה למורה!</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                  ✓ הגשה מאושרת
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div>
                  <span>תלמיד/ה: </span>
                  <strong className="text-foreground">{submissionRecord.studentName}</strong> ({submissionRecord.studentClass})
                </div>
                <div>
                  <span>מורה מקבל/ת: </span>
                  <strong className="text-foreground">{submissionRecord.teacherName}</strong>
                </div>
                <div className="col-span-2 flex items-center justify-between pt-1">
                  <span>
                    קוד אישור הגשה: <code className="font-mono font-bold text-foreground px-1.5 py-0.5 bg-muted rounded">{submissionRecord.receiptCode}</code>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(submissionRecord.receiptCode);
                      setCopiedReceipt(true);
                      setTimeout(() => setCopiedReceipt(false), 2000);
                    }}
                    className="h-7 text-xs gap-1 cursor-pointer"
                  >
                    {copiedReceipt ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedReceipt ? "הועתק!" : "העתק קוד"}</span>
                  </Button>
                </div>
                {submissionRecord.generationPrompt && (
                  <div className="col-span-2 flex items-start gap-1.5 pt-2 border-t border-border/40 text-xs text-muted-foreground" dir="rtl">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span>פרומפט ששימש ליצירת הטקסט: </span>
                      <strong className="text-foreground font-sans" dir="auto">&quot;{submissionRecord.generationPrompt}&quot;</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewAnswers(!showReviewAnswers)}
              className="cursor-pointer text-xs gap-1.5"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{showReviewAnswers ? "הסתר פירוט תשובות" : "בדוק פירוט שאלות ותשובות נכונות"}</span>
            </Button>

            <Link href="/student">
              <Button
                variant="secondary"
                size="sm"
                className="cursor-pointer text-xs gap-1.5 font-bold"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>לדף העבודות והציונים שלי &rarr;</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsSubmitted(false);
                setGradedScore(null);
                setUserAnswers({});
                setCheckedQuestions({});
                setSubmissionRecord(null);
                setShowReviewAnswers(false);
                setActiveQuestionIndex(0);
                setStories((prev) =>
                  prev.map((s) =>
                    s.id === currentStory.id
                      ? { ...s, questions: randomizeQuestionsOptions(s.questions) }
                      : s
                  )
                );
              }}
              className="cursor-pointer text-xs gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>התחל מבחן מחדש</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setIsSubmitted(false);
                setGradedScore(null);
                setUserAnswers({});
                setSubmissionRecord(null);
                setShowReviewAnswers(false);
                setStage("settings");
              }}
              className="cursor-pointer text-xs gap-1.5"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>בחר קטע קריאה נוסף</span>
            </Button>
          </div>

          {/* Detailed Question Review Breakdown */}
          {showReviewAnswers && submissionRecord?.questionsBreakdown && (
            <div className="mt-4 border-t border-border/50 pt-4 space-y-3 text-right">
              <h4 className="font-bold text-sm text-foreground">פירוט התשובות שלך במבחן:</h4>
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {submissionRecord.questionsBreakdown.map((q) => (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      q.points >= 8
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : q.points >= 5
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-destructive/30 bg-destructive/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleSpeakText(q.prompt, `review-${q.id}`)}
                          className={`p-1 rounded-md transition-colors cursor-pointer shrink-0 ${
                            isSpeakingQuestion && speakingQuestionId === `review-${q.id}`
                              ? "bg-primary text-primary-foreground animate-pulse"
                              : "text-muted-foreground hover:text-primary hover:bg-muted"
                          }`}
                          title="האזנה לשאלה באנגלית"
                          aria-label="האזנה לשאלה"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTranslateSelection(q.prompt)}
                          className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors cursor-pointer shrink-0"
                          title="תרגם את השאלה לעברית"
                          aria-label="תרגום שאלה"
                        >
                          <Languages className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-bold text-foreground truncate">
                          שאלה {q.number}:{" "}
                          <InteractiveEnglishText text={q.prompt} onWordClick={handleWordClick} />
                        </span>
                      </div>
                      <Badge
                        variant={q.points >= 8 ? "default" : q.points >= 5 ? "secondary" : "destructive"}
                        className="text-[10px] shrink-0"
                      >
                        {q.points}/10 נק׳
                      </Badge>
                    </div>

                    <div className="text-muted-foreground" dir="ltr">
                      <span>התשובה שלך: </span>
                      <strong className={q.points >= 8 ? "text-emerald-600 dark:text-emerald-400" : q.points >= 5 ? "text-amber-600 dark:text-amber-400" : "text-destructive"}>
                        {q.type === "mcq" && q.options && typeof q.userAnswer === "number"
                          ? q.options[q.userAnswer] || q.userAnswer
                          : String(q.userAnswer || "לא נענה")}
                      </strong>
                    </div>

                    {q.points < 10 && (
                      <div className="text-muted-foreground" dir="ltr">
                        <span>תשובה נכונה: </span>
                        <strong className="text-foreground">
                          {q.type === "mcq" && q.options && typeof q.correctAnswer === "number"
                            ? q.options[q.correctAnswer]
                            : String(q.correctAnswer || q.targetSentence || q.modelAnswer || "")}
                        </strong>
                      </div>
                    )}

                    {q.feedbackHebrew && (
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-[11px] text-foreground space-y-0.5" dir="rtl">
                        <span className="font-bold text-primary flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          <span>משוב פדגוגי על התשובה:</span>
                        </span>
                        <p className="leading-relaxed">{q.feedbackHebrew}</p>
                      </div>
                    )}

                    {q.explanationHebrew && !q.feedbackHebrew && (
                      <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/30" dir="rtl">
                        💡 {q.explanationHebrew}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
