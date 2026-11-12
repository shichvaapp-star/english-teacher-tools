"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookMarked,
  Sparkles,
  Printer,
  X,
  Award,
  Target,
  FileCheck,
} from "lucide-react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";
import { UnseenAiGenerator } from "@/components/unseen/unseen-ai-generator";
import { UnseenLibraryGrid } from "@/components/unseen/unseen-library-grid";

export function UnseenSettingsStage({ c }: { c: UnseenPracticeController }) {
  const {
    assignedNotice,
    currentStory,
    handleLevelSelect,
    handleStartExercise,
    levelStories,
    mode,
    selectedLevel,
    setAssignedNotice,
    setMode,
    setShowPrintModal,
    setStorySourceTab,
    stage,
    storySourceTab,
  } = c;
  return (
    <>
      {/* =========================================================================
          STAGE 1: SETTINGS / SETUP VIEW
          ========================================================================= */}
      {stage === "settings" && (
        <main className="container mx-auto flex-1 px-3 sm:px-8 py-4 sm:py-6 max-w-4xl space-y-4 sm:space-y-5 print:hidden" dir="rtl">
          {/* Teacher Assignment Notification Banner */}
          {assignedNotice && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between gap-3 text-xs text-purple-900 dark:text-purple-200" dir="rtl">
              <div className="flex items-center gap-2 font-medium font-hebrew">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>{assignedNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setAssignedNotice(null)}
                className="text-purple-600 hover:text-purple-800 dark:hover:text-purple-100 p-1 cursor-pointer rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Settings Compact Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1 border-b border-border/50" dir="rtl">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-foreground font-hebrew">
                  הגדרות תרגול אנסין
                </h2>
                <Badge variant="secondary" className="text-[11px] font-sans">
                  10 Questions
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                Reading Comprehension Setup • {currentStory.title}
              </p>
            </div>

            <Button
              size="default"
              onClick={handleStartExercise}
              className="cursor-pointer gap-2 text-xs sm:text-sm font-normal px-5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 font-hebrew"
            >
              <span>התחלת תרגול</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Setting 1: Level Selection */}
          <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-2.5" dir="rtl">
            <div className="flex items-center justify-between" dir="rtl">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5 font-hebrew">
                <Target className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>1. רמת קריאה</span>
                <span className="text-muted-foreground font-normal font-sans" dir="ltr">(Reading Level)</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {[
                { id: "Level 1" as const, hebrew: "מתחילים", sub: "Beginner" },
                { id: "Level 2" as const, hebrew: "שוטף", sub: "Intermediate" },
                { id: "Level 3" as const, hebrew: "מתקדמים", sub: "Advanced" },
              ].map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleLevelSelect(lvl.id)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-2xs ring-1 ring-primary/40"
                        : "border-border/60 hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <span className="text-sm font-medium font-sans">{lvl.id}</span>
                    <span className="text-xs text-muted-foreground font-hebrew">{lvl.hebrew}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Setting 2: Practice Mode vs. Graded Mode */}
          <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-2.5" dir="rtl">
            <div className="flex items-center justify-between" dir="rtl">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5 font-hebrew">
                <FileCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>2. מצב פעילות</span>
                <span className="text-muted-foreground font-normal font-sans" dir="ltr">(Mode)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMode("practice")}
                className={`p-3 sm:p-3.5 rounded-xl border text-right transition cursor-pointer flex items-center gap-3 ${
                  mode === "practice"
                    ? "border-primary bg-primary/10 shadow-2xs ring-1 ring-primary/40"
                    : "border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Target className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-medium text-foreground font-hebrew">אימון חופשי</h4>
                    <span className="text-[11px] text-muted-foreground font-sans" dir="ltr">Practice</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-hebrew">
                    תרגול עצמאי עם בדיקה מיידית ורמזים
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("graded")}
                className={`p-3 sm:p-3.5 rounded-xl border text-right transition cursor-pointer flex items-center gap-3 ${
                  mode === "graded"
                    ? "border-emerald-600 bg-emerald-500/10 shadow-2xs ring-1 ring-emerald-500/40"
                    : "border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-medium text-foreground font-hebrew">מטלה להגשה למורה</h4>
                    <span className="text-[11px] text-muted-foreground font-sans" dir="ltr">Assignment</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-hebrew">
                    מבחן לציון עם משוב רשמי מהמורה
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Setting 3: Choose Story or Generate with AI */}
          <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-3" dir="rtl">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5" dir="rtl">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5 font-hebrew">
                <BookMarked className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>3. בחירת קטע קריאה</span>
              </span>

              <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg" dir="rtl">
                <button
                  type="button"
                  onClick={() => setStorySourceTab("library")}
                  className={`px-3 py-1 rounded-md text-xs font-normal transition cursor-pointer font-hebrew ${
                    storySourceTab === "library"
                      ? "bg-card text-foreground shadow-2xs font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ספרייה ({levelStories.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStorySourceTab("ai_generator")}
                  className={`px-3 py-1 rounded-md text-xs font-normal transition cursor-pointer flex items-center gap-1 font-hebrew ${
                    storySourceTab === "ai_generator"
                      ? "bg-card text-foreground shadow-2xs font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>יצירה עם AI</span>
                </button>
              </div>
            </div>

            <UnseenLibraryGrid c={c} />

            <UnseenAiGenerator c={c} />
          </div>

          {/* Bottom Action Bar: Sticky on Mobile so it is NEVER lost */}
          <div className="sticky bottom-0 z-30 -mx-3 sm:mx-0 p-3 sm:p-4 bg-background/95 backdrop-blur-md border-t sm:border sm:rounded-2xl border-border/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3" dir="rtl">
            <div className="text-right rtl space-y-0.5 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-start">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-foreground font-sans truncate max-w-[150px] sm:max-w-none">{currentStory.title}</span>
                <span className="text-[11px] sm:text-xs text-muted-foreground truncate hidden sm:inline font-hebrew">({currentStory.hebrewTitle})</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] sm:text-xs text-muted-foreground font-hebrew">
                  <span className="font-sans">{selectedLevel}</span> &bull; 10 שאלות &bull;{" "}
                  <span className={mode === "graded" ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-primary font-medium"}>
                    {mode === "graded" ? "מטלה להגשה" : "אימון חופשי"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="default"
                onClick={() => setShowPrintModal(true)}
                className="hidden sm:inline-flex cursor-pointer gap-2 text-xs font-normal px-4 border-border/80 font-hebrew"
              >
                <Printer className="h-4 w-4 text-primary" />
                <span>הדפסת דף עבודה</span>
              </Button>
              <Button
                size="default"
                onClick={handleStartExercise}
                className={`flex-1 sm:flex-none cursor-pointer gap-2 text-xs sm:text-sm font-normal h-10 px-6 shadow-2xs font-hebrew ${
                  mode === "graded"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                <span>{mode === "graded" ? "התחלת מטלה להגשה" : "התחלת אימון חופשי"}</span>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
