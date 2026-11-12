"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, Send } from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularyTurnInModal({ c }: { c: VocabularyPracticeController }) {
  const {
    activeAssignment,
    assignmentWords,
    handleTurnInAssignment,
    isSubmittingTurnIn,
    masteredIds,
    quizScore,
    setTurnInModalOpen,
    turnInModalOpen,
  } = c;
  return (
    <>
      {/* Turn In Assignment Modal */}
      {turnInModalOpen && activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-foreground">
                    הגשת משימת אוצר מילים למורה
                  </h3>
                  <p className="text-2xs text-muted-foreground">
                    {activeAssignment.hebrewTitle} &bull; המורה {activeAssignment.teacherName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTurnInModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-2">
              <span className="font-bold text-foreground block">סיכום התרגול שלך:</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-background border border-border/60">
                  <span className="text-2xs text-muted-foreground block">מילים בשליטה מלאה</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {masteredIds.size} / {assignmentWords.length}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-background border border-border/60">
                  <span className="text-2xs text-muted-foreground block">ציון בוחן (Quiz)</span>
                  <span className="text-base font-black text-foreground">
                    {quizScore > 0 ? `${quizScore} / 100` : "טרם בוצע"}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-2xs text-muted-foreground leading-relaxed">
              בלחיצה על &ldquo;אשר והגש למורה&rdquo;, תוצאות התרגול ורשימת המילים שנלמדו יישלחו ישירות ללוח הבקרה של המורה {activeAssignment.teacherName}.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTurnInModalOpen(false)}
                className="cursor-pointer text-xs"
              >
                המשך לתרגל
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleTurnInAssignment}
                disabled={isSubmittingTurnIn}
                className="cursor-pointer text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmittingTurnIn ? "מגיש..." : "אשר והגש למורה"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
