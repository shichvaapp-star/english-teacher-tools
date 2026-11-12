"use client";

import React from "react";
import { randomizeQuestionsOptions } from "@/data/unseen-middle-school";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  RotateCcw,
  Send,
  Sliders,
} from "lucide-react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenPracticeCompleteModal({ c }: { c: UnseenPracticeController }) {
  const {
    answeredCount,
    correctMcqCount,
    currentStory,
    setActiveQuestionIndex,
    setCheckedQuestions,
    setHasCelebratedPractice,
    setIsChangingTeacher,
    setSelectedTeacherId,
    setShowPracticeCompleteModal,
    setShowPracticeConfetti,
    setShowSubmitModal,
    setStage,
    setStories,
    setUserAnswers,
    showPracticeCompleteModal,
    totalMcqs,
    totalOpenOrCopy,
    user,
  } = c;
  return (
    <>
      {/* Practice Mode Completion Modal */}
      {showPracticeCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 print:hidden">
          <div className="bg-card border-2 border-emerald-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 text-center" dir="rtl">
            <div className="flex justify-end -mt-2 -mr-2">
              <button
                type="button"
                onClick={() => setShowPracticeCompleteModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-lg hover:bg-muted"
                aria-label="סגור"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-xs">
                🎉
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Well Done! כל הכבוד!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                סיימת את כל {currentStory.questions.length} השאלות בתרגול קטע הקריאה &ldquo;{currentStory.title}&rdquo;!
              </p>
            </div>

            {/* Practice summary card */}
            <div className="bg-muted/40 border border-border/80 rounded-xl p-3.5 space-y-2.5 text-right">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">שאלות שהושלמו:</span>
                <span className="text-foreground font-bold">{currentStory.questions.length} מתוך {currentStory.questions.length}</span>
              </div>
              {totalMcqs > 0 && (
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">תשובות נכונות (רב-ברירה):</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold text-xs">
                    {correctMcqCount} מתוך {totalMcqs} נכונות
                  </Badge>
                </div>
              )}
              {totalOpenOrCopy > 0 && (
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">שאלות פתוחות / ציטוט שהוזנו:</span>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30 font-bold text-xs">
                    {totalOpenOrCopy} שאלות נבדקו
                  </Badge>
                </div>
              )}
              <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
                💡 תרגול מעולה! תוכל כעת לסקור את התשובות וההסברים בעברית, לתרגל קטע נוסף, או להתחיל מחדש.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowPracticeCompleteModal(false);
                  setIsChangingTeacher(false);
                  if (user?.teacherId) {
                    setSelectedTeacherId(user.teacherId);
                  }
                  setShowSubmitModal(true);
                }}
                className="cursor-pointer text-xs font-bold gap-1.5 h-9 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 sm:col-span-2"
              >
                <Send className="h-4 w-4" />
                <span>הגש תוצאות למורה בכיתה ({answeredCount}/10)</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPracticeCompleteModal(false)}
                className="cursor-pointer text-xs font-semibold h-9"
              >
                <span>סקור תשובות</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setShowPracticeCompleteModal(false);
                  setShowPracticeConfetti(false);
                  setHasCelebratedPractice(false);
                  setUserAnswers({});
                  setCheckedQuestions({});
                  setActiveQuestionIndex(0);
                  setStories((prev) =>
                    prev.map((s) =>
                      s.id === currentStory.id
                        ? { ...s, questions: randomizeQuestionsOptions(s.questions) }
                        : s
                    )
                  );
                }}
                className="cursor-pointer text-xs font-bold gap-1.5 h-9"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>התחל תרגול מחדש</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowPracticeCompleteModal(false);
                  setShowPracticeConfetti(false);
                  setStage("settings");
                }}
                className="cursor-pointer text-xs font-semibold h-9 col-span-1 sm:col-span-2"
              >
                <Sliders className="h-3.5 w-3.5 mr-1" />
                <span>בחר קטע קריאה נוסף</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
