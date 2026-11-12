"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Sparkles,
  X,
  HelpCircle,
  Target,
  Send,
  Sliders,
  BookOpen,
} from "lucide-react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenExerciseTopBar({ c }: { c: UnseenPracticeController }) {
  const {
    activeQuestion,
    activeQuestionIndex,
    answeredCount,
    assignedNotice,
    isSubmitted,
    mobileTab,
    mode,
    selectedLevel,
    setAssignedNotice,
    setIsChangingTeacher,
    setMobileTab,
    setMode,
    setSelectedTeacherId,
    setShowSubmitModal,
    setStage,
    user,
    userAnswers,
  } = c;
  return (
    <>
      {/* Active Context Ribbon */}
      <div className="flex flex-wrap items-center justify-between bg-card border border-border/60 rounded-xl p-2.5 sm:p-3 shadow-xs print:hidden gap-2.5">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => {
              setStage("settings");
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              }
            }}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">שנה הגדרות / בחר קטע אחר</span>
            <span className="sm:hidden">הגדרות</span>
          </button>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-xs text-muted-foreground font-medium shrink-0">{selectedLevel}</span>
          <span className="text-muted-foreground">&bull;</span>

          {/* Mode Switcher */}
          <div className="inline-flex items-center rounded-lg bg-muted/80 p-0.5 text-xs font-semibold border border-border/50">
            <button
              type="button"
              onClick={() => setMode("practice")}
              className={`px-2 py-1 rounded-md text-[11px] transition cursor-pointer flex items-center gap-1 ${
                mode === "practice"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="בדיקת תשובות מיידית תוך כדי פתרון"
            >
              <Target className="h-3 w-3 text-primary" />
              <span>אימון חופשי</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("graded")}
              className={`px-2 py-1 rounded-md text-[11px] transition cursor-pointer flex items-center gap-1 ${
                mode === "graded"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="מטלה להגשה למורה וחישוב ציון רשמי"
            >
              <Send className="h-3 w-3" />
              <span>מטלה להגשה למורה</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mr-auto sm:mr-0 shrink-0">
          {mode === "practice" && !isSubmitted && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setIsChangingTeacher(false);
                if (user?.teacherId) {
                  setSelectedTeacherId(user.teacherId);
                }
                setShowSubmitModal(true);
              }}
              className="h-7 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 cursor-pointer gap-1"
            >
              <Send className="h-3 w-3 text-emerald-600" />
              <span>הגש למורה ({answeredCount}/10)</span>
            </Button>
          )}
          {isSubmitted ? (
            <Badge className="bg-emerald-600 text-white text-[11px] font-bold gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>הוגש למורה</span>
            </Badge>
          ) : mode === "graded" ? (
            <span className="font-semibold text-xs text-primary">{answeredCount}/10 נענו</span>
          ) : (
            <span className="text-[11px] sm:text-xs text-muted-foreground">שאלה {activeQuestionIndex + 1}/10</span>
          )}
        </div>
      </div>


      {/* Teacher Assignment Notification Banner */}
      {assignedNotice && (
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-3 text-xs text-purple-900 dark:text-purple-200" dir="rtl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-semibold">{assignedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setAssignedNotice(null)}
            className="text-purple-600 hover:text-purple-800 dark:hover:text-purple-100 p-1 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Mobile View Switcher (Passage vs. Questions) - Only visible on mobile (< lg) */}
      <div className="lg:hidden flex items-center p-1 rounded-xl bg-card border border-border/80 sticky top-16 z-30 shadow-xs backdrop-blur-md">
        <button
          type="button"
          onClick={() => setMobileTab("text")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === "text"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>📖 קטע הקריאה</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("questions")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === "questions"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>❓ שאלות ({answeredCount}/10)</span>
          {userAnswers[activeQuestion?.id || ""] !== undefined && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>
    </>
  );
}
