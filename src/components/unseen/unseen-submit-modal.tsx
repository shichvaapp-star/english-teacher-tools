"use client";

import React from "react";
import { formatTeacherDisplayName } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Award,
  Send,
  UserCheck,
  Edit3,
} from "lucide-react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenSubmitModal({ c }: { c: UnseenPracticeController }) {
  const {
    answeredCount,
    currentStory,
    handleSubmitGradedExam,
    isChangingTeacher,
    isSubmitting,
    selectedTeacher,
    selectedTeacherId,
    setIsChangingTeacher,
    setSelectedTeacherId,
    setShowSubmitModal,
    setStudentClassInput,
    setStudentNameInput,
    setStudentNoteInput,
    showSubmitModal,
    studentClassInput,
    studentNameInput,
    studentNoteInput,
    teachers,
  } = c;
  return (
    <>
      {/* Confirmation Modal for Graded Exam Submission */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 print:hidden">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" dir="rtl">
              <div className="flex items-center gap-2.5 text-primary border-b border-border/50 pb-3">
                <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-black text-lg text-foreground">הגשת מבחן אנסין לבדיקה וציון</h3>
                  <p className="text-xs text-muted-foreground">{currentStory.hebrewTitle} &bull; {currentStory.title}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">מענה על שאלות:</span>
                <span className={`font-bold ${answeredCount === 10 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {answeredCount} מתוך 10 שאלות נענו
                </span>
              </div>
              {answeredCount < 10 && (
                <p className="text-[11px] text-amber-700 dark:text-amber-300 pt-1">
                  ⚠️ שים לב: ישנן שאלות ללא מענה. כל שאלה שלא נענתה תקבל 0 נקודות.
                </p>
              )}
            </div>

            {currentStory.generationPrompt && (
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-start gap-2 text-xs">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <span className="font-bold text-purple-900 dark:text-purple-200 block">
                    פרומפט ששימש ליצירת הטקסט:
                  </span>
                  <p className="text-foreground/90 font-medium font-sans" dir="auto">
                    &quot;{currentStory.generationPrompt}&quot;
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-1">
              {/* Student Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">שם התלמיד/ה:</label>
                <Input
                  type="text"
                  placeholder="שם מלא באנגלית או בעברית"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  className="h-9 text-xs font-bold"
                  required
                />
              </div>

              {/* Class & Teacher */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">כיתה:</label>
                  <Input
                    type="text"
                    placeholder="למשל: ז׳2"
                    value={studentClassInput}
                    onChange={(e) => setStudentClassInput(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">מורה בודק/ת:</label>
                    {selectedTeacher && !isChangingTeacher && (
                      <button
                        type="button"
                        onClick={() => setIsChangingTeacher(true)}
                        className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>החלף מורה</span>
                      </button>
                    )}
                    {isChangingTeacher && (
                      <button
                        type="button"
                        onClick={() => setIsChangingTeacher(false)}
                        className="text-[11px] text-muted-foreground hover:underline cursor-pointer"
                      >
                        ביטול
                      </button>
                    )}
                  </div>

                  {!isChangingTeacher && selectedTeacher ? (
                    <div className="h-9 px-2.5 rounded-md border border-primary/30 bg-primary/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <UserCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-bold text-foreground truncate">
                          {selectedTeacher.name}
                        </span>
                        {selectedTeacher.schoolName && (
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            &bull; {selectedTeacher.schoolName}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsChangingTeacher(true)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-foreground hover:bg-muted font-medium transition cursor-pointer shrink-0"
                        title="החלף מורה"
                      >
                        החלף
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedTeacherId}
                      onChange={(e) => {
                        setSelectedTeacherId(e.target.value);
                        setIsChangingTeacher(false);
                      }}
                      className="w-full h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                      autoFocus={isChangingTeacher}
                    >
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {formatTeacherDisplayName(t, teachers)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Optional note */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">הערה אישית למורה (אופציונלי):</label>
                <Input
                  type="text"
                  placeholder="למשל: היה לי מאתגר עם שאלה 5"
                  value={studentNoteInput}
                  onChange={(e) => setStudentNoteInput(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => setShowSubmitModal(false)}
                className="cursor-pointer text-xs"
              >
                חזור למבחן
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmitGradedExam}
                disabled={isSubmitting}
                className="cursor-pointer text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? "מעריך תשובות ומפיק משוב AI..." : "שלח למורה וחשב ציון"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
