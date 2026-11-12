"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, AlertCircle, X } from "lucide-react";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";

export function WritingHistoryModal({ c }: { c: WritingPracticeController }) {
  const {
    setShowHistoryModal,
    showHistoryModal,
    submissionsList,
    user,
  } = c;
  return (
    <>
      {/* Submissions History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-black text-lg text-foreground">
                  {user && user.role === "teacher" ? "הגשות תלמידים לבדיקה" : "היסטוריית החיבורים שהוגשו"}
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {submissionsList.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground/60" />
                  <p>עדיין לא נרשמו הגשות במכשיר זה.</p>
                </div>
              ) : (
                submissionsList.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-border/80 bg-muted/30 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{sub.studentName}</span>
                        {sub.studentClass && (
                          <Badge variant="outline" className="text-[10px]">
                            {sub.studentClass}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px]">
                          {sub.level || "Level 2"}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{sub.submittedAt}</span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>
                        נושא: <strong className="text-foreground">{sub.hebrewTitle}</strong> ({sub.taskTitle})
                      </span>
                      <span>{sub.wordCount} מילים</span>
                    </div>

                    <div
                      className="p-3 rounded-lg bg-background border border-border/50 font-sans text-xs text-foreground/90 whitespace-pre-wrap max-h-36 overflow-y-auto"
                      dir="ltr"
                    >
                      {sub.essayText}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                      <span>מורה יעד: {sub.teacherName}</span>
                      <span className="font-mono text-[10px]">קוד: {sub.receiptCode}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border pt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistoryModal(false)}
                className="text-xs cursor-pointer"
              >
                סגור
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
