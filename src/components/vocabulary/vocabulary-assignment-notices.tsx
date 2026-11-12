"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookA,
  CheckCircle2,
  X,
  Send,
} from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularyAssignmentNotices({ c }: { c: VocabularyPracticeController }) {
  const {
    activeAssignment,
    assignmentWords,
    masteredIds,
    setSuccessToast,
    setTurnInModalOpen,
    successToast,
  } = c;
  return (
    <>
      {/* Active Class Assignment Banner */}
      {activeAssignment && (
        <div
          className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 text-foreground shadow-md animate-in slide-in-from-top duration-300"
          dir="rtl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5 animate-bounce">
                <BookA className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                    🔔 משימת כיתה פעילה מהמורה {activeAssignment.teacherName || "לאנגלית"}
                  </span>
                  <Badge variant="outline" className="text-3xs font-bold border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10">
                    {assignmentWords.length} מילים לתרגול
                  </Badge>
                  {activeAssignment.dueDate && (
                    <Badge variant="outline" className="text-3xs font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10">
                      יעד להגשה: {activeAssignment.dueDate}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-3xs font-bold">
                    {masteredIds.size} / {assignmentWords.length} מילים בשליטה
                  </Badge>
                </div>
                <h2 className="text-base sm:text-lg font-black text-foreground">
                  {activeAssignment.hebrewTitle} <span className="font-normal text-xs text-muted-foreground" dir="ltr">({activeAssignment.title})</span>
                </h2>
                {activeAssignment.instructions && (
                  <p className="text-xs text-foreground/90 font-medium bg-background/60 p-2.5 rounded-xl border border-border/50 max-w-2xl leading-relaxed">
                    💬 הנחיית המורה: &ldquo;{activeAssignment.instructions}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <Button
                size="sm"
                onClick={() => setTurnInModalOpen(true)}
                className="text-xs font-black gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs px-4 h-9"
              >
                <Send className="h-3.5 w-3.5" />
                <span>הגש משימה למורה</span>
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* Success Toast Banner */}
      {successToast && (
        <div
          className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in"
          dir="rtl"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
