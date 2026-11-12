"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Volume2,
  Pause,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  Check,
  Send,
  Languages,
} from "lucide-react";
import { InteractiveEnglishText } from "@/components/unseen/unseen-helpers";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenActiveQuestionCard({ c }: { c: UnseenPracticeController }) {
  const {
    activeQuestion,
    activeQuestionIndex,
    answeredCount,
    checkedQuestions,
    currentStory,
    handleCheckPracticeAnswer,
    handleSpeakText,
    handleToggleQuestionTranslation,
    handleTranslateSelection,
    handleWordClick,
    isSpeakingQuestion,
    mode,
    practiceEvaluation,
    questionTranslations,
    setActiveQuestionIndex,
    setCheckedQuestions,
    setIsChangingTeacher,
    setQuestionTranslations,
    setSelectedTeacherId,
    setShowSubmitModal,
    setUserAnswers,
    speakingQuestionId,
    user,
    userAnswers,
  } = c;
  return (
    <>
      {/* Active Question Card */}
      {activeQuestion && (
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs">
                  שאלה {activeQuestion.number}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {activeQuestion.type === "mcq"
                    ? "בחירה מרובה"
                    : activeQuestion.type === "copy"
                    ? "העתקת משפט"
                    : "הבנה פתוחה"}
                </Badge>
              </div>
              <span className="text-xs font-semibold text-primary">{activeQuestion.points} נקודות</span>
            </div>

            {activeQuestion.linesHint && (
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <Search className="h-3 w-3 text-primary" />
                <span>מיקום בטקסט: {activeQuestion.linesHint}</span>
              </p>
            )}

            <div className="flex items-start justify-between gap-2 mt-2">
              <h3 className="text-sm font-semibold text-foreground leading-relaxed notranslate flex-1" translate="no" lang="en">
                <InteractiveEnglishText
                  text={activeQuestion.prompt}
                  onWordClick={handleWordClick}
                />
              </h3>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  type="button"
                  variant={questionTranslations[activeQuestion.id]?.visible ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleQuestionTranslation(activeQuestion.id, activeQuestion.prompt)}
                  className={`h-8 px-2.5 text-xs font-bold gap-1.5 cursor-pointer shrink-0 transition-all ${
                    questionTranslations[activeQuestion.id]?.visible
                      ? "bg-primary text-primary-foreground"
                      : "border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={
                    questionTranslations[activeQuestion.id]?.visible
                      ? "הסתר תרגום שאלה"
                      : "תרגם את השאלה לעברית"
                  }
                  aria-label="תרגום שאלה"
                >
                  <Languages className="h-3.5 w-3.5 text-current" />
                  <span className="hidden sm:inline">
                    {questionTranslations[activeQuestion.id]?.visible ? "הסתר תרגום" : "תרגם שאלה"}
                  </span>
                </Button>

                <Button
                  type="button"
                  variant={isSpeakingQuestion && speakingQuestionId === activeQuestion.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSpeakText(activeQuestion.prompt, activeQuestion.id)}
                  className={`h-8 px-2.5 text-xs font-bold gap-1.5 cursor-pointer shrink-0 transition-all ${
                    isSpeakingQuestion && speakingQuestionId === activeQuestion.id
                      ? "bg-primary text-primary-foreground animate-pulse"
                      : "border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={
                    isSpeakingQuestion && speakingQuestionId === activeQuestion.id
                      ? "עצור הקראת שאלה"
                      : "האזנה לשאלה באנגלית"
                  }
                  aria-label="האזנה לשאלה"
                >
                  {isSpeakingQuestion && speakingQuestionId === activeQuestion.id ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">עצור</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-primary" />
                      <span className="hidden sm:inline">האזן לשאלה</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {questionTranslations[activeQuestion.id]?.visible && (
              <div
                className="mt-2.5 p-2.5 rounded-lg bg-primary/10 border border-primary/25 text-xs text-foreground flex items-start justify-between gap-2 animate-in fade-in-0 duration-150"
                dir="rtl"
              >
                <div className="flex items-start gap-1.5">
                  <Languages className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-primary ml-1">תרגום השאלה:</span>
                    <span className="font-semibold text-foreground leading-relaxed">
                      {questionTranslations[activeQuestion.id]?.hebrew}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setQuestionTranslations((prev) => ({
                      ...prev,
                      [activeQuestion.id]: { ...prev[activeQuestion.id], visible: false },
                    }))
                  }
                  className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer shrink-0"
                  title="סגור תרגום"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-4 space-y-3 notranslate" translate="no" lang="en">
            {/* Multiple Choice Question */}
            {activeQuestion.type === "mcq" && activeQuestion.options && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
                  <span>בחר את התשובה הנכונה:</span>
                  <span className="text-[10px] text-primary/80 flex items-center gap-1">
                    <span>💡 לחצו על מילה לתרגום</span>
                  </span>
                </div>
                {activeQuestion.options.map((option, optIdx) => {
                  const isSelected = userAnswers[activeQuestion.id] === optIdx;
                  const isChecked = checkedQuestions[activeQuestion.id];
                  const isCorrectOption = optIdx === activeQuestion.correctIndex;

                  let optStyle = "border-border/60 hover:bg-muted/40 hover:border-border";
                  if (mode === "practice" && isChecked) {
                    if (isCorrectOption) {
                      optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold";
                    } else if (isSelected && !isCorrectOption) {
                      optStyle = "border-destructive bg-destructive/10 text-destructive font-medium";
                    }
                  } else if (isSelected) {
                    optStyle = "border-primary bg-primary/10 text-foreground font-semibold shadow-xs";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => {
                        setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: optIdx }));
                        if (mode === "practice") {
                          setCheckedQuestions((prev) => ({ ...prev, [activeQuestion.id]: true }));
                        } else {
                          setCheckedQuestions((prev) => ({ ...prev, [activeQuestion.id]: false }));
                        }
                      }}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition cursor-pointer flex items-start gap-2.5 ${optStyle}`}
                    >
                      <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">
                        <InteractiveEnglishText
                          text={option}
                          onWordClick={handleWordClick}
                          stopEventPropagation
                        />
                      </span>
                      <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTranslateSelection(option);
                          }}
                          className="p-1 rounded-md text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          title="תרגם אפשרות זו לעברית"
                          aria-label="תרגם אפשרות"
                        >
                          <Languages className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeakText(option, `${activeQuestion.id}-opt-${optIdx}`);
                          }}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            isSpeakingQuestion && speakingQuestionId === `${activeQuestion.id}-opt-${optIdx}`
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground/60 hover:text-primary hover:bg-primary/10"
                          }`}
                          title="האזנה לאפשרות זו באנגלית"
                          aria-label="האזנה לאפשרות"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {mode === "practice" && isChecked && isCorrectOption && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Copy Sentence Question */}
            {activeQuestion.type === "copy" && (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">
                  הקלד את המשפט המדויק מתוך הפסקה:
                </label>
                <textarea
                  rows={3}
                  placeholder="Type the exact sentence from the story..."
                  value={(userAnswers[activeQuestion.id] as string) || ""}
                  onChange={(e) =>
                    setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: e.target.value }))
                  }
                  spellCheck={false}
                  autoCorrect="off"
                  autoComplete="off"
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                />
              </div>
            )}

            {/* Open Ended Question */}
            {activeQuestion.type === "open" && (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">
                  ענה באנגלית על פי המידע בטקסט:
                </label>
                <textarea
                  rows={3}
                  placeholder="Write your answer in English..."
                  value={(userAnswers[activeQuestion.id] as string) || ""}
                  onChange={(e) =>
                    setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: e.target.value }))
                  }
                  spellCheck={false}
                  autoCorrect="off"
                  autoComplete="off"
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            )}

            {/* Practice Mode Feedback Box */}
            {mode === "practice" && checkedQuestions[activeQuestion.id] && (
              <div className="p-3 rounded-lg bg-muted/60 border border-border/80 text-xs space-y-1.5 animate-in fade-in-0">
                <div className="flex items-center gap-1.5 font-bold">
                  {activeQuestion.type === "mcq" && userAnswers[activeQuestion.id] === activeQuestion.correctIndex ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> תשובה נכונה! כל הכבוד! (+10 נקודות)
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Info className="h-4 w-4" /> הסבר לתשובה:
                    </span>
                  )}
                </div>

                {activeQuestion.targetSentence && (
                  <p className="text-muted-foreground font-mono text-[11px]">
                    משפט היעד:{" "}
                    <span className="font-normal font-sans">
                      &ldquo;
                      <InteractiveEnglishText
                        text={activeQuestion.targetSentence}
                        onWordClick={handleWordClick}
                      />
                      &rdquo;
                    </span>
                  </p>
                )}

                {activeQuestion.modelAnswer && (
                  <p className="text-muted-foreground text-[11px]">
                    תשובה לדוגמה:{" "}
                    <span className="font-normal font-sans">
                      &ldquo;
                      <InteractiveEnglishText
                        text={activeQuestion.modelAnswer}
                        onWordClick={handleWordClick}
                      />
                      &rdquo;
                    </span>
                  </p>
                )}

                {practiceEvaluation[activeQuestion.id] && (
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-foreground space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1 text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>הערכת התשובה שכתבת:</span>
                      </span>
                      <Badge variant={practiceEvaluation[activeQuestion.id].points >= 7 ? "default" : "secondary"} className="text-[10px]">
                        {practiceEvaluation[activeQuestion.id].points} / 10 נק׳
                      </Badge>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {practiceEvaluation[activeQuestion.id].feedback}
                    </p>
                  </div>
                )}

                <p className="text-foreground/90 text-[11px] leading-relaxed text-right rtl">
                  {activeQuestion.explanationHebrew}
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={activeQuestionIndex === 0}
                onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="cursor-pointer text-xs"
              >
                שאלה קודמת
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={activeQuestionIndex === currentStory.questions.length - 1}
                onClick={() =>
                  setActiveQuestionIndex((prev) => Math.min(currentStory.questions.length - 1, prev + 1))
                }
                className="cursor-pointer text-xs"
              >
                שאלה הבאה
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {mode === "practice" ? (
                activeQuestion.type !== "mcq" && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleCheckPracticeAnswer(activeQuestion.id)}
                    className="cursor-pointer gap-1.5 text-xs"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>בדוק תשובה</span>
                  </Button>
                )
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setIsChangingTeacher(false);
                    if (user?.teacherId) {
                      setSelectedTeacherId(user.teacherId);
                    }
                    setShowSubmitModal(true);
                  }}
                  className="cursor-pointer gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>הגש מבחן ({answeredCount}/10)</span>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
