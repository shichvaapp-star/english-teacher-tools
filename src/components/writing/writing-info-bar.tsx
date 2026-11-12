"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  GraduationCap,
  X,
  Sliders,
} from "lucide-react";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";

export function WritingInfoBar({ c }: { c: WritingPracticeController }) {
  const {
    activeMode,
    assignedNotice,
    currentTask,
    handleBackToSettings,
    selectedLevel,
    setActiveMode,
    setAssignedNotice,
  } = c;
  return (
    <>
      {/* Top Info Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-border/60 bg-card text-xs shadow-xs"
        dir="rtl"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-bold border-primary/30 text-primary">
            {selectedLevel}
          </Badge>

          {/* Mode Switcher Pill */}
          <div className="inline-flex items-center rounded-lg bg-muted/80 p-0.5 text-xs font-semibold border border-border/50">
            <button
              type="button"
              onClick={() => setActiveMode("practice")}
              className={`px-2.5 py-1 rounded-md text-[11px] transition cursor-pointer flex items-center gap-1.5 ${
                activeMode === "practice"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="אימון חופשי עם משוב AI"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              <span>אימון חופשי</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("submit")}
              className={`px-2.5 py-1 rounded-md text-[11px] transition cursor-pointer flex items-center gap-1.5 ${
                activeMode === "submit"
                  ? "bg-purple-600 text-white shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="מטלה להגשה ישירה למורה"
            >
              <GraduationCap className="h-3 w-3" />
              <span>מטלה להגשה למורה</span>
            </button>
          </div>

          <span className="text-muted-foreground hidden sm:inline">&bull;</span>
          <span className="font-bold text-foreground">
            {currentTask.hebrewTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 mr-auto" dir="ltr">
          {/* Back to Settings */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBackToSettings}
            className="h-7 text-xs gap-1.5 cursor-pointer border-border"
          >
            <Sliders className="h-3.5 w-3.5 text-primary" />
            <span>שינוי הגדרות</span>
          </Button>
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
    </>
  );
}
