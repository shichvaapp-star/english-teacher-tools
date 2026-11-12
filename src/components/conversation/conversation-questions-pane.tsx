"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Volume2,
  Pause,
  Sparkles,
  X,
  HelpCircle,
  Send,
  Languages,
  Loader2,
} from "lucide-react";
import { InteractiveEnglishText } from "@/components/conversation/conversation-helpers";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";

export function ConversationQuestionsPane({ c }: { c: ConversationPracticeController }) {
  const {
    activeQuestion,
    activeQuestionIndex,
    answeredCount,
    checkedQuestions,
    currentScenario,
    evaluationDetail,
    handleCheckPracticeAnswer,
    handlePassageSelectionUp,
    handleSpeakText,
    handleToggleQuestionTranslation,
    handleTranslateSelection,
    handleTurnInToDavid,
    handleWordClick,
    isAllPracticeAnswered,
    isSpeakingQuestion,
    isSubmitted,
    isTurningInToDavid,
    mobileTab,
    mode,
    practiceEvaluation,
    questionTranslations,
    questionsContainerRef,
    setActiveQuestionIndex,
    setCheckedQuestions,
    setQuestionTranslations,
    setShowSubmitModal,
    setUserAnswers,
    speakingQuestionId,
    submissionRecord,
    userAnswers,
  } = c;
  return (
    <>
      {/* RIGHT PANE: 10 QUESTIONS & AI EVALUATION (5 cols) */}
      <div
        ref={questionsContainerRef}
        onMouseUp={handlePassageSelectionUp}
        onTouchEnd={handlePassageSelectionUp}
        onKeyUp={handlePassageSelectionUp}
        className={`lg:col-span-5 lg:self-stretch print:hidden ${
          mobileTab === "questions" ? "block" : "hidden lg:block"
        }`}
      >
        <div className="lg:sticky lg:top-20 space-y-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
          {/* Question Pills (1-10) */}
          <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between mb-2" dir="rtl">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                <span>שאלות הבנה ותגובה מהחיים (10)</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {answeredCount}/10 נענו
              </span>
            </div>

            <div className="grid grid-cols-10 gap-1.5">
              {currentScenario.questions.map((q, idx) => {
                const isActive = idx === activeQuestionIndex;
                const isAnswered =
                  userAnswers[q.id] !== undefined && userAnswers[q.id] !== "";
                const isReplyType = q.type === "reply_mcq" || q.type === "reply_open";

                let pillColor = "border-border/60 bg-muted/30 text-muted-foreground";
                if (isActive) {
                  pillColor =
                    "border-primary bg-primary text-primary-foreground font-bold shadow-xs";
                } else if (isAnswered) {
                  pillColor =
                    "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 font-semibold";
                } else if (isReplyType) {
                  pillColor =
                    "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400";
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`h-8 rounded-lg border text-xs flex items-center justify-center transition cursor-pointer relative ${pillColor}`}
                    title={isReplyType ? "שאלת 'מה היית אומר/ת?'" : `שאלה ${idx + 1}`}
                  >
                    <span>{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Practice Completed Banner */}
          {mode === "practice" && isAllPracticeAnswered && (
            <div
              className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-100 flex items-center justify-between gap-3 shadow-xs"
              dir="rtl"
            >
              <div>
                <h4 className="text-xs sm:text-sm font-bold">
                  🎉 כל הכבוד! השלמת את כל 10 השאלות בשיחה!
                </h4>
                <p className="text-2xs text-muted-foreground">
                  תוכלו להגיש את התרגול למורה או למאמן ה-AI דיוויד לקבלת משוב מלא.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowSubmitModal(true)}
                  className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>הגש למורה</span>
                </Button>
              </div>
            </div>
          )}

          {/* Active Question Card */}
          {activeQuestion && (
            <Card className="border-border/60 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between" dir="rtl">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      שאלה {activeQuestion.number}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-2xs ${
                        activeQuestion.type === "reply_mcq" ||
                        activeQuestion.type === "reply_open"
                          ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                          : ""
                      }`}
                    >
                      {activeQuestion.type === "mcq"
                        ? "הבנת השיחה (בחירה)"
                        : activeQuestion.type === "copy"
                        ? "ציטוט שורה מהשיחה"
                        : activeQuestion.type === "open"
                        ? "הבנה פתוחה"
                        : activeQuestion.type === "reply_mcq"
                        ? "💬 מה היית אומר/ת? (בחירה)"
                        : "💬 מה היית אומר/ת? (תגובה אישית)"}
                    </Badge>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {activeQuestion.points} נקודות
                  </span>
                </div>

                {activeQuestion.linesHint && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeQuestion.turnRefIndex >= 0) {
                        const el = document.getElementById(
                          `dialogue-turn-${activeQuestion.turnRefIndex}`
                        );
                        el?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                    className="text-2xs text-primary hover:underline mt-1 flex items-center gap-1 cursor-pointer"
                    dir="rtl"
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>מיקום בשיחה: {activeQuestion.linesHint}</span>
                  </button>
                )}

                {/* Situation Context Callout for "What Would You Say?" questions */}
                {activeQuestion.situationContext && (
                  <div
                    className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-foreground space-y-1"
                    dir="ltr"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                        🎭 Real-Life Situation
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleTranslateSelection(activeQuestion.situationContext!)
                        }
                        className="text-2xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Languages className="h-3 w-3" />
                        <span dir="rtl">תרגם סיטואציה</span>
                      </button>
                    </div>
                    <p className="leading-relaxed font-medium">
                      <InteractiveEnglishText
                        text={activeQuestion.situationContext}
                        onWordClick={handleWordClick}
                      />
                    </p>
                  </div>
                )}

                {/* Question Prompt + Translate & Speak Buttons */}
                <div className="flex items-start justify-between gap-2 mt-2.5" dir="ltr">
                  <h3 className="text-sm font-semibold text-foreground leading-relaxed flex-1">
                    <InteractiveEnglishText
                      text={activeQuestion.prompt}
                      onWordClick={handleWordClick}
                    />
                  </h3>

                  <div className="flex items-center gap-1.5 shrink-0" dir="rtl">
                    <Button
                      type="button"
                      variant={
                        questionTranslations[activeQuestion.id]?.visible
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleToggleQuestionTranslation(
                          activeQuestion.id,
                          activeQuestion.prompt
                        )
                      }
                      className="h-8 px-2.5 text-xs font-bold gap-1.5 cursor-pointer"
                    >
                      <Languages className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">
                        {questionTranslations[activeQuestion.id]?.visible
                          ? "הסתר תרגום"
                          : "תרגם שאלה"}
                      </span>
                    </Button>

                    <Button
                      type="button"
                      variant={
                        isSpeakingQuestion && speakingQuestionId === activeQuestion.id
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleSpeakText(activeQuestion.prompt, activeQuestion.id)
                      }
                      className="h-8 px-2.5 text-xs font-bold gap-1.5 cursor-pointer"
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
                    className="mt-2.5 p-2.5 rounded-lg bg-primary/10 border border-primary/25 text-xs text-foreground flex items-start justify-between gap-2"
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
                          [activeQuestion.id]: {
                            ...prev[activeQuestion.id],
                            visible: false,
                          },
                        }))
                      }
                      className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-4 space-y-3" dir="ltr">
                {/* Multiple Choice ('mcq' or 'reply_mcq') */}
                {(activeQuestion.type === "mcq" || activeQuestion.type === "reply_mcq") &&
                  activeQuestion.options && (
                    <div className="space-y-2">
                      <div
                        className="flex items-center justify-between text-2xs text-muted-foreground px-0.5"
                        dir="rtl"
                      >
                        <span>
                          {activeQuestion.type === "reply_mcq"
                            ? "בחרו את התגובה הטבעית והמנומסת ביותר:"
                            : "בחרו את התשובה הנכונה לפי השיחה:"}
                        </span>
                        <span className="text-primary">💡 לחצו על מילה או אייקון לתרגום</span>
                      </div>
                      {activeQuestion.options.map((option, optIdx) => {
                        const isSelected = userAnswers[activeQuestion.id] === optIdx;
                        const isChecked = checkedQuestions[activeQuestion.id];
                        const isCorrectOption = optIdx === activeQuestion.correctIndex;

                        let optStyle =
                          "border-border/60 hover:bg-muted/40 hover:border-border";
                        if (mode === "practice" && isChecked) {
                          if (isCorrectOption) {
                            optStyle =
                              "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold";
                          } else if (isSelected && !isCorrectOption) {
                            optStyle =
                              "border-destructive bg-destructive/10 text-destructive font-medium";
                          }
                        } else if (isSelected) {
                          optStyle =
                            "border-primary bg-primary/10 text-foreground font-semibold shadow-xs";
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              setUserAnswers((prev) => ({
                                ...prev,
                                [activeQuestion.id]: optIdx,
                              }));
                              if (mode === "practice") {
                                setCheckedQuestions((prev) => ({
                                  ...prev,
                                  [activeQuestion.id]: true,
                                }));
                              }
                            }}
                            className={`w-full p-3 rounded-lg border text-left text-xs transition cursor-pointer flex items-start gap-2.5 ${optStyle}`}
                          >
                            <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center shrink-0 text-2xs font-bold mt-0.5">
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
                                className="p-1 rounded-md text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition cursor-pointer"
                                title="תרגם אפשרות זו לעברית"
                              >
                                <Languages className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpeakText(
                                    option,
                                    `${activeQuestion.id}-opt-${optIdx}`
                                  );
                                }}
                                className="p-1 rounded-md text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition cursor-pointer"
                                title="האזן לאפשרות זו באנגלית"
                              >
                                <Volume2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                {/* Copy Line Question */}
                {activeQuestion.type === "copy" && (
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground block" dir="rtl">
                      העתיקו את המשפט המדויק מתוך השורה המתאימה בשיחה:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Type or copy the exact sentence from the conversation..."
                      value={(userAnswers[activeQuestion.id] as string) || ""}
                      onChange={(e) =>
                        setUserAnswers((prev) => ({
                          ...prev,
                          [activeQuestion.id]: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                    />
                  </div>
                )}

                {/* Open Comprehension or Open Real-Life Reply */}
                {(activeQuestion.type === "open" ||
                  activeQuestion.type === "reply_open") && (
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground block" dir="rtl">
                      {activeQuestion.type === "reply_open"
                        ? "כתבו באנגלית מה הייתם אומרים בסיטואציה זו (1–2 משפטים טבעיים ומנומסים):"
                        : "ענו באנגלית במילים שלכם על פי המידע בשיחה:"}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={
                        activeQuestion.type === "reply_open"
                          ? 'e.g., "Excuse me, could I please have..."'
                          : "Write your answer in English..."
                      }
                      value={(userAnswers[activeQuestion.id] as string) || ""}
                      onChange={(e) =>
                        setUserAnswers((prev) => ({
                          ...prev,
                          [activeQuestion.id]: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                )}

                {/* Practice Mode Check Button & Feedback */}
                {mode === "practice" && (
                  <div className="space-y-2 pt-1" dir="rtl">
                    {(activeQuestion.type === "copy" ||
                      activeQuestion.type === "open" ||
                      activeQuestion.type === "reply_open") && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleCheckPracticeAnswer(activeQuestion.id)}
                        disabled={
                          !userAnswers[activeQuestion.id] ||
                          practiceEvaluation[activeQuestion.id]?.loading
                        }
                        className="w-full text-xs font-bold gap-1.5 cursor-pointer"
                      >
                        {practiceEvaluation[activeQuestion.id]?.loading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>בודק תשובה ב-AI...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>בדוק תשובה ב-AI</span>
                          </>
                        )}
                      </Button>
                    )}

                    {checkedQuestions[activeQuestion.id] && (
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/25 text-xs space-y-1.5">
                        <div className="font-bold text-primary flex items-center justify-between">
                          <span>הסבר ומשוב:</span>
                          {practiceEvaluation[activeQuestion.id] && (
                            <Badge variant="secondary" className="text-2xs">
                              {practiceEvaluation[activeQuestion.id].points}/10 נק׳
                            </Badge>
                          )}
                        </div>
                        <p className="text-foreground leading-relaxed">
                          {practiceEvaluation[activeQuestion.id]?.feedback ||
                            activeQuestion.explanationHebrew}
                        </p>
                        {activeQuestion.modelAnswer && (
                          <p className="text-2xs text-muted-foreground pt-1" dir="ltr">
                            <strong>Sample Answer:</strong> &ldquo;{activeQuestion.modelAnswer}&rdquo;
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter
                className="border-t border-border/50 pt-3 flex items-center justify-between gap-2"
                dir="rtl"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={activeQuestionIndex === 0}
                  onClick={() => setActiveQuestionIndex((i) => Math.max(0, i - 1))}
                  className="text-xs cursor-pointer"
                >
                  הקודם
                </Button>

                {activeQuestionIndex < currentScenario.questions.length - 1 ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      setActiveQuestionIndex((i) =>
                        Math.min(currentScenario.questions.length - 1, i + 1)
                      )
                    }
                    className="text-xs font-bold cursor-pointer"
                  >
                    השאלה הבאה ←
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowSubmitModal(true)}
                    className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>סיים והגש לבדיקת AI</span>
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          {/* Full AI Evaluation Result Card (After Graded Submission) */}
          {isSubmitted && evaluationDetail && (
            <Card className="border-emerald-500/40 bg-card shadow-md p-4 space-y-4" dir="rtl">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <Badge className="bg-emerald-600 text-white text-2xs mb-1">
                    ✓ הערכת AI הושלמה
                  </Badge>
                  <h3 className="font-bold text-base text-foreground">
                    ציון סופי בשיחה: {evaluationDetail.score}/100
                  </h3>
                  {submissionRecord?.receiptCode && (
                    <p className="text-2xs text-muted-foreground">
                      אסמכתא: {submissionRecord.receiptCode}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleTurnInToDavid}
                  disabled={isTurningInToDavid}
                  className="text-xs font-bold gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>המשך אימון עם דיוויד</span>
                </Button>
              </div>

              <p className="text-xs font-medium text-foreground">
                {evaluationDetail.encouragement}
              </p>

              {/* 4-Category Conversation Rubric */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                  <div className="flex justify-between font-bold">
                    <span>הבנת פרטי השיחה</span>
                    <span className="text-primary">
                      {evaluationDetail.rubric.explicitDetails.score}/30
                    </span>
                  </div>
                  <p className="text-2xs text-muted-foreground mt-1">
                    {evaluationDetail.rubric.explicitDetails.commentHebrew}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                  <div className="flex justify-between font-bold">
                    <span>כוונת הדובר וביטויים</span>
                    <span className="text-primary">
                      {evaluationDetail.rubric.inferenceAndPragmatics.score}/25
                    </span>
                  </div>
                  <p className="text-2xs text-muted-foreground mt-1">
                    {evaluationDetail.rubric.inferenceAndPragmatics.commentHebrew}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                  <div className="flex justify-between font-bold">
                    <span>תגובה למצבים מהחיים</span>
                    <span className="text-primary">
                      {evaluationDetail.rubric.realLifeResponse.score}/30
                    </span>
                  </div>
                  <p className="text-2xs text-muted-foreground mt-1">
                    {evaluationDetail.rubric.realLifeResponse.commentHebrew}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                  <div className="flex justify-between font-bold">
                    <span>דיוק לשוני והעתקה</span>
                    <span className="text-primary">
                      {evaluationDetail.rubric.languageAndAccuracy.score}/15
                    </span>
                  </div>
                  <p className="text-2xs text-muted-foreground mt-1">
                    {evaluationDetail.rubric.languageAndAccuracy.commentHebrew}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
