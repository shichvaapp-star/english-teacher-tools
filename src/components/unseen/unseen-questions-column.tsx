"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  HelpCircle,
  Send,
  BookOpen,
} from "lucide-react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";
import { UnseenActiveQuestionCard } from "@/components/unseen/unseen-active-question-card";
import { UnseenGradedSummary } from "@/components/unseen/unseen-graded-summary";

export function UnseenQuestionsColumn({ c }: { c: UnseenPracticeController }) {
  const {
    activeQuestion,
    activeQuestionIndex,
    answeredCount,
    currentStory,
    handlePassageSelectionUp,
    isAllPracticeAnswered,
    mobileTab,
    mode,
    questionsContainerRef,
    setActiveQuestionIndex,
    setIsChangingTeacher,
    setMobileTab,
    setSelectedTeacherId,
    setShowPracticeCompleteModal,
    setShowPracticeConfetti,
    setShowSubmitModal,
    user,
    userAnswers,
  } = c;
  return (
    <>
      {/* 10 Questions Column (5 Cols on desktop, conditioned on mobile) */}
      <div
        ref={questionsContainerRef}
        onMouseUp={handlePassageSelectionUp}
        onTouchEnd={handlePassageSelectionUp}
        onKeyUp={handlePassageSelectionUp}
        className={`lg:col-span-5 print:hidden ${mobileTab === "questions" ? "block" : "hidden lg:block"}`}
      >
        <div className="lg:sticky lg:top-20 space-y-4 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1">
        {/* Mobile quick link to return to text */}
        <div className="lg:hidden flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setMobileTab("text")}
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>← חזרה לקטע הקריאה</span>
          </button>
          {activeQuestion?.linesHint && (
            <span className="text-[11px] text-muted-foreground">
              {activeQuestion.linesHint}
            </span>
          )}
        </div>

        {/* Question Tabs Header (1 to 10) */}
        <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              <span>Questions ({currentStory.questions.length})</span>
            </span>
            <span className="text-xs text-muted-foreground">
              {mode === "graded" ? `${answeredCount}/10 נענו` : `שאלה ${activeQuestionIndex + 1} מתוך 10`}
            </span>
          </div>

          {/* 10 Question Pills - Touch-friendly on mobile */}
          <div className="flex overflow-x-auto sm:grid sm:grid-cols-10 gap-1.5 pb-1 sm:pb-0 scrollbar-none">
            {currentStory.questions.map((q, idx) => {
              const isActive = idx === activeQuestionIndex;
              const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== "";

              let pillColor = "border-border/60 bg-muted/30 text-muted-foreground";
              if (isActive) {
                pillColor = "border-primary bg-primary text-primary-foreground font-bold shadow-xs";
              } else if (isAnswered) {
                pillColor = "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 font-semibold";
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setActiveQuestionIndex(idx)}
                  className={`h-9 min-w-[34px] sm:min-w-0 sm:h-8 rounded-lg border text-xs flex items-center justify-center transition cursor-pointer relative shrink-0 ${pillColor}`}
                >
                  <span>{idx + 1}</span>
                  {isAnswered && !isActive && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Practice Completed Celebration Banner */}
        {mode === "practice" && isAllPracticeAnswered && (
          <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3 animate-in fade-in-0 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl sm:text-2xl shrink-0">🎉</span>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  <span>Well Done! כל הכבוד!</span>
                  <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-1.5 font-bold">הושלם</Badge>
                </h4>
                <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/90 truncate">
                  סיימת את כל {currentStory.questions.length} השאלות בתרגול.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setIsChangingTeacher(false);
                  if (user?.teacherId) {
                    setSelectedTeacherId(user.teacherId);
                  }
                  setShowSubmitModal(true);
                }}
                className="h-7 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 cursor-pointer gap-1"
              >
                <Send className="h-3 w-3" />
                <span>הגש למורה</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowPracticeConfetti(true);
                  setShowPracticeCompleteModal(true);
                }}
                className="h-7 text-[11px] font-bold border-emerald-500/40 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0 cursor-pointer"
              >
                <Sparkles className="h-3 w-3 text-amber-500 mr-1" />
                <span>סיכום</span>
              </Button>
            </div>
          </div>
        )}

        <UnseenActiveQuestionCard c={c} />

        <UnseenGradedSummary c={c} />
        </div>
      </div>
    </>
  );
}
