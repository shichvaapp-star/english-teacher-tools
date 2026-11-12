"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, CheckCircle2 } from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularyQuiz({ c }: { c: VocabularyPracticeController }) {
  const {
    currentQuizWord,
    filteredWords,
    handleQuizAnswer,
    handleSpeak,
    quizIndex,
    quizOptions,
    quizScore,
    selectedQuizOption,
    setQuizIndex,
    setSelectedQuizOption,
    speakingWord,
    studyMode,
  } = c;
  return (
    <>
      {/* MODE 3: QUIZ */}
      {studyMode === "quiz" && currentQuizWord && filteredWords.length > 0 && (
        <div className="max-w-lg mx-auto space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">שאלה {quizIndex + 1}:</span>
              <h3 className="text-base font-bold">מה התרגום הנכון של המילה?</h3>
            </div>
            <Badge variant="secondary">ניקוד: {quizScore} נק׳</Badge>
          </div>

          <Card className="border border-border/80">
            <CardHeader className="text-center pb-2">
              <span className="text-xs text-muted-foreground">מילה באנגלית:</span>
              <div className="flex items-center justify-center gap-2 pt-1">
                <CardTitle className="text-3xl font-extrabold text-foreground notranslate" translate="no" lang="en">
                  {currentQuizWord.english}
                </CardTitle>
                <button
                  type="button"
                  onClick={() => handleSpeak(currentQuizWord.english)}
                  className={cn(
                    "p-1.5 rounded-full transition-colors cursor-pointer",
                    speakingWord === currentQuizWord.english
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  )}
                  title={`האזן להגייה: ${currentQuizWord.english}`}
                  aria-label={`האזן להגייה של ${currentQuizWord.english}`}
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              {currentQuizWord.example && (
                <CardDescription className="text-xs italic font-sans" dir="ltr">
                  &quot;{currentQuizWord.example}&quot;
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-2 pt-3" dir="rtl">
              {quizOptions.map((opt) => {
                const isSelected = selectedQuizOption === opt.hebrew;
                const isCorrect = opt.hebrew === currentQuizWord.hebrew;

                let btnStyle = "border-border hover:bg-muted/50 text-foreground";
                if (selectedQuizOption) {
                  if (isCorrect) btnStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 font-bold";
                  else if (isSelected) btnStyle = "border-destructive bg-destructive/15 text-destructive";
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={selectedQuizOption !== null}
                    onClick={() => handleQuizAnswer(opt.hebrew)}
                    className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all text-right cursor-pointer ${btnStyle}`}
                  >
                    {opt.hebrew}
                  </button>
                );
              })}

              {selectedQuizOption && (
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-xs">
                    {selectedQuizOption === currentQuizWord.hebrew ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> תשובה נכונה! (+10 נק׳)
                      </span>
                    ) : (
                      <span className="text-destructive font-semibold">
                        התשובה הנכונה היא: <strong>{currentQuizWord.hebrew}</strong>
                      </span>
                    )}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedQuizOption(null);
                      setQuizIndex((i) => i + 1);
                    }}
                    className="cursor-pointer text-xs"
                  >
                    לשאלה הבאה &rarr;
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
