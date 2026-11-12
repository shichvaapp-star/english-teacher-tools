"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, User, X } from "lucide-react";


import { type TeacherDashboardController } from "@/components/teacher-dashboard/use-teacher-dashboard";

export function TeacherDashboardStudentHistory({ c }: { c: TeacherDashboardController }) {
  const {
    getStudentStats,
    handleOpenReview,
    historyStudent,
    setHistoryStudent,
  } = c;
  return (
    <>
      {/* -------------------------------------------------------------------
          MODAL: STUDENT SUBMISSION HISTORY
          ------------------------------------------------------------------- */}
      {historyStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto flex flex-col" dir="rtl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-foreground" dir="ltr">
                    {historyStudent.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {historyStudent.fullClass || "כיתה"}
                    {historyStudent.group && ` • הקבצה ${historyStudent.group}`} &bull; קוד PIN: <strong className="font-mono">{historyStudent.pin}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistoryStudent(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {(() => {
                const stats = getStudentStats(historyStudent);
                if (stats.submissions.length === 0) {
                  return (
                    <div className="py-12 text-center space-y-2 rounded-xl border border-dashed border-border bg-muted/20">
                      <FileText className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                      <p className="font-bold text-sm text-foreground">טרם הוגשו משימות</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5">
                    {stats.submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-xl border border-border bg-muted/30 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-foreground block">{sub.hebrewTitle}</strong>
                          <span className="text-muted-foreground text-[11px]">{sub.submittedAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={sub.status === "reviewed" ? "default" : "outline"} className="text-[10px]">
                            {sub.status === "reviewed" ? `ציון: ${sub.grade ?? sub.score}` : "ממתין"}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => {
                              setHistoryStudent(null);
                              handleOpenReview(sub);
                            }}
                            className="h-7 text-xs font-bold px-2.5"
                          >
                            בדוק
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end pt-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setHistoryStudent(null)} className="text-xs">
                סגור
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
