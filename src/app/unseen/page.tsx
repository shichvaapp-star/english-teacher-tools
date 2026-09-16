"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { MIDDLE_SCHOOL_UNSEENS, MSUnseenStory } from "@/data/unseen-middle-school";
import { saveWordToBuilder, VocabItem, loadSavedWords } from "@/lib/vocab-storage";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Search,
  BookMarked,
  Volume2,
  CheckCircle2,
  Sparkles,
  Info,
  Copy,
  Printer,
  ChevronRight,
  X,
} from "lucide-react";

export default function UnseenPracticePage() {
  const { user } = useAuth();
  const [stories] = useState<MSUnseenStory[]>(MIDDLE_SCHOOL_UNSEENS);
  const [selectedStoryId, setSelectedStoryId] = useState<string>(MIDDLE_SCHOOL_UNSEENS[0].id);
  const [selectedLevel, setSelectedLevel] = useState<"all" | "Easy" | "Medium" | "Hard">("all");

  // Active question in detective mode
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Student answers
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});

  // Word Click & Translation Popup
  const [clickedWord, setClickedWord] = useState<{
    word: string;
    hebrew: string;
    loading: boolean;
    partOfSpeech?: string;
    example?: string;
    saved?: boolean;
  } | null>(null);

  // Notebook drawer
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [savedWords, setSavedWords] = useState<VocabItem[]>(() => loadSavedWords(user?.id));

  const currentStory = stories.find((s) => s.id === selectedStoryId) || stories[0];
  const activeQuestion = currentStory.questions[activeQuestionIndex];

  const filteredStories = stories.filter((s) => {
    if (selectedLevel === "all") return true;
    return s.level === selectedLevel;
  });

  // Handle word click anywhere in the passage
  const handleWordClick = async (rawWord: string) => {
    const clean = rawWord.trim().toLowerCase().replace(/[^a-zA-Z'\-]/g, "");
    if (!clean || clean.length < 2) return;

    setClickedWord({
      word: clean,
      hebrew: "מתרגם...",
      loading: true,
    });

    // 1. Check if word is already in the story's vocabulary hints
    const hint = currentStory.vocabularyHints.find(
      (h) => h.word.toLowerCase().replace(/[^a-zA-Z]/g, "") === clean
    );

    if (hint) {
      saveWordToBuilder(
        { english: clean, hebrew: hint.translation, example: `From "${currentStory.title}"` },
        user?.id
      );
      setClickedWord({
        word: clean,
        hebrew: hint.translation,
        loading: false,
        example: `From "${currentStory.title}"`,
        saved: true,
      });
      setSavedWords(loadSavedWords(user?.id));
      return;
    }

    // 2. Call translation API
    try {
      const res = await fetch("/api/translate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: clean }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          saveWordToBuilder(
            {
              english: clean,
              hebrew: data.data.hebrew,
              partOfSpeech: data.data.partOfSpeech,
              example: data.data.example,
            },
            user?.id
          );
          setClickedWord({
            word: clean,
            hebrew: data.data.hebrew,
            partOfSpeech: data.data.partOfSpeech,
            example: data.data.example,
            loading: false,
            saved: true,
          });
          setSavedWords(loadSavedWords(user?.id));
          return;
        }
      }
    } catch {
      // fallback
    }

    setClickedWord({
      word: clean,
      hebrew: "לא נמצא תרגום",
      loading: false,
      saved: false,
    });
  };

  // Pronounce word
  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Answer checking
  const handleCheckAnswer = (qId: string) => {
    setCheckedQuestions((prev) => ({ ...prev, [qId]: true }));
  };

  const handleCopySentence = (sentence: string) => {
    if (!activeQuestion || activeQuestion.type !== "copy") return;
    setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: sentence.trim() }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">חזרה לראשי</span>
            </Link>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Search className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm sm:text-base">בלשי האנסין &bull; חטיבת ביניים בן גוריון</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Word Notebook Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNotebookOpen(true)}
              className="cursor-pointer gap-1.5 text-xs border-primary/30 text-primary"
            >
              <BookMarked className="h-4 w-4" />
              <span>פנקס מילים ({savedWords.length})</span>
            </Button>
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 print:p-0 print:m-0">
        {/* Level Filters & Story Picker */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">רמת כיתה:</span>
            {(["all", "Easy", "Medium", "Hard"] as const).map((lvl) => (
              <Button
                key={lvl}
                variant={selectedLevel === lvl ? "default" : "outline"}
                size="sm"
                className="text-xs h-7 cursor-pointer"
                onClick={() => setSelectedLevel(lvl)}
              >
                {lvl === "all" ? "כל הרמות" : lvl === "Easy" ? "כיתה ז׳ (קל)" : lvl === "Medium" ? "כיתה ח׳ (בינוני)" : "כיתה ט׳ (מתקדם)"}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStoryId}
              onChange={(e) => {
                setSelectedStoryId(e.target.value);
                setActiveQuestionIndex(0);
                setUserAnswers({});
                setCheckedQuestions({});
              }}
              className="h-8 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer max-w-[280px] truncate"
            >
              {filteredStories.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.gradeLabel}] {s.title} ({s.hebrewTitle})
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5 text-xs h-8 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">הדפסת דף עבודה</span>
            </Button>
          </div>
        </div>

        {/* Word Click Toast Popup */}
        {clickedWord && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl border border-primary/30 bg-card shadow-2xl max-w-sm w-full animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-extrabold text-foreground capitalize">
                  {clickedWord.word}
                </h4>
                <button
                  type="button"
                  onClick={() => handleSpeak(clickedWord.word)}
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setClickedWord(null)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 text-right" dir="rtl">
              <span className="text-xl font-black text-primary block">
                {clickedWord.hebrew}
              </span>
              {clickedWord.example && (
                <p className="text-xs text-muted-foreground mt-1 font-sans" dir="ltr">
                  &quot;{clickedWord.example}&quot;
                </p>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> נוסף לפנקס המילים שלך!
              </span>
              <Link
                href="/vocabulary"
                className="text-primary hover:underline font-medium cursor-pointer"
              >
                תרגול בפנקס &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Two Column Detective Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Passage with Clickable Words */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      {currentStory.gradeLabel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {currentStory.hebrewTitle}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    💡 לחצו על כל מילה לתרגום ושמירה
                  </span>
                </div>
                <CardTitle className="text-2xl font-black text-foreground pt-1.5">
                  {currentStory.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 font-serif">
                {currentStory.paragraphs.map((para, pIdx) => {
                  const isTargetPara = activeQuestion?.paragraphIndex === pIdx + 1;
                  const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];

                  return (
                    <div
                      key={pIdx}
                      className={`p-3 rounded-xl transition-all ${
                        isTargetPara
                          ? "bg-sky-500/10 border-2 border-sky-500/40 shadow-xs"
                          : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          Paragraph [{pIdx + 1}]
                        </span>
                        {isTargetPara && (
                          <Badge variant="secondary" className="text-[10px] text-sky-600 dark:text-sky-300">
                            🎯 התשובה לשאלה {activeQuestionIndex + 1} נמצאת כאן!
                          </Badge>
                        )}
                      </div>

                      <p className="text-base md:text-lg leading-relaxed text-foreground/90 select-text">
                        {sentences.map((sent, sIdx) => {
                          const wordsInSent = sent.split(/(\s+)/);
                          return (
                            <span
                              key={sIdx}
                              onClick={() => {
                                if (activeQuestion?.type === "copy") {
                                  handleCopySentence(sent);
                                }
                              }}
                              className={
                                activeQuestion?.type === "copy"
                                  ? "cursor-pointer hover:bg-sky-500/20 hover:text-sky-800 dark:hover:text-sky-200 rounded px-0.5"
                                  : ""
                              }
                              title={activeQuestion?.type === "copy" ? "לחצו כאן כדי להעתיק משפט זה לשדה התשובה" : undefined}
                            >
                              {wordsInSent.map((token, wIdx) => {
                                if (/^\s+$/.test(token)) return <span key={wIdx}>{token}</span>;
                                return (
                                  <span
                                    key={wIdx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleWordClick(token);
                                    }}
                                    className="cursor-pointer hover:underline hover:text-primary hover:bg-primary/10 rounded px-0.5 transition-colors"
                                    title="לחץ לתרגום המילה והוספה לפנקס"
                                  >
                                    {token}
                                  </span>
                                );
                              })}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  );
                })}

                {/* Vocabulary Hints Bank */}
                <div className="pt-3 border-t border-dashed border-border text-xs space-y-2">
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    <span>מילון עזר לטקסט (לחצו על מילה כדי לשמוע ולשמור):</span>
                  </span>
                  <div className="flex flex-wrap gap-2" dir="rtl">
                    {currentStory.vocabularyHints.map((h, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleWordClick(h.word)}
                        className="px-2.5 py-1 rounded-lg border border-border bg-muted/40 hover:bg-primary/10 hover:border-primary/30 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="font-bold text-foreground" dir="ltr">{h.word}</span>
                        <span className="opacity-40">=</span>
                        <span className="text-muted-foreground">{h.translation}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Detective Question Box */}
          <div className="lg:col-span-5 space-y-4">
            {/* Step Navigation Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card text-xs">
              <span className="font-bold text-foreground">
                שאלה {activeQuestionIndex + 1} מתוך {currentStory.questions.length}
              </span>
              <div className="flex items-center gap-1">
                {currentStory.questions.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveQuestionIndex(i)}
                    className={`h-7 w-7 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeQuestionIndex === i
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : checkedQuestions[currentStory.questions[i].id]
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Question Card */}
            {activeQuestion && (
              <Card className="border border-border shadow-xs">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      שאלה {activeQuestion.number} &bull; פסקה [{activeQuestion.paragraphIndex}]
                    </Badge>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {activeQuestion.points} נקודות
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground pt-1.5 leading-snug">
                    {activeQuestion.prompt}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  {/* Multiple Choice Question */}
                  {activeQuestion.type === "mcq" && activeQuestion.options && (
                    <div className="space-y-2">
                      {activeQuestion.options.map((opt, optIdx) => {
                        const isChosen = userAnswers[activeQuestion.id] === optIdx;
                        const isChecked = checkedQuestions[activeQuestion.id];
                        const isCorrect = optIdx === activeQuestion.correctIndex;

                        let style = "border-border hover:bg-muted/40 text-foreground";
                        if (isChecked) {
                          if (isCorrect) style = "border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 font-bold";
                          else if (isChosen) style = "border-destructive bg-destructive/15 text-destructive font-medium";
                        } else if (isChosen) {
                          style = "border-primary bg-primary/10 text-foreground font-semibold ring-2 ring-primary/20";
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: optIdx }))}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-2.5 ${style}`}
                          >
                            <span className="font-bold shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Sentence Copying Question */}
                  {activeQuestion.type === "copy" && (
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-700 dark:text-sky-300 flex items-center gap-2">
                        <Copy className="h-4 w-4 shrink-0" />
                        <span>לחצו על המשפט המתאים בפסקה [{activeQuestion.paragraphIndex}] בצד שמאל, והוא יועתק לכאן אוטומטית!</span>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="העתיקו את המשפט באנגלית כאן או לחצו עליו בפסקה..."
                        value={String(userAnswers[activeQuestion.id] || "")}
                        onChange={(e) => setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background p-2.5 text-xs sm:text-sm"
                      />
                    </div>
                  )}

                  {/* Open-ended Question */}
                  {activeQuestion.type === "open" && (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        placeholder="Write your answer in English..."
                        value={String(userAnswers[activeQuestion.id] || "")}
                        onChange={(e) => setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: e.target.value }))}
                        className="w-full rounded-md border border-input bg-background p-2.5 text-xs sm:text-sm"
                      />
                    </div>
                  )}

                  {/* Check Answer Button */}
                  {!checkedQuestions[activeQuestion.id] ? (
                    <Button
                      onClick={() => handleCheckAnswer(activeQuestion.id)}
                      className="w-full font-semibold cursor-pointer gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>בדיקת תשובה</span>
                    </Button>
                  ) : (
                    /* Explanation in Hebrew */
                    <div className="p-3.5 rounded-xl bg-muted/60 border border-border space-y-2 text-xs" dir="rtl">
                      <span className="font-bold text-foreground block">
                        הסבר התשובה בעברית:
                      </span>
                      <p className="text-muted-foreground leading-relaxed">
                        {activeQuestion.explanationHebrew}
                      </p>
                      {activeQuestion.type === "copy" && (
                        <p className="text-[11px] font-mono text-primary pt-1" dir="ltr">
                          <strong>Target Sentence:</strong> &quot;{activeQuestion.targetSentence}&quot;
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex((i) => Math.max(0, i - 1))}
                    className="cursor-pointer text-xs"
                  >
                    שאלה קודמת
                  </Button>

                  {activeQuestionIndex < currentStory.questions.length - 1 ? (
                    <Button
                      size="sm"
                      onClick={() => setActiveQuestionIndex((i) => i + 1)}
                      className="cursor-pointer text-xs gap-1"
                    >
                      <span>לשאלה הבאה</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => alert("כל הכבוד! סיימת את כל השאלות לקטע קריאה זה!")}
                      className="cursor-pointer text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>סיום בהצלחה!</span>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Slide-out Word Notebook Drawer */}
      {isNotebookOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-md bg-background h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">פנקס המילים שלי</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotebookOpen(false)}
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                כל מילה שתלחצו עליה במהלך קריאת האנסין נשמרת כאן אוטומטית לתרגול אישי!
              </p>

              {savedWords.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                  עדיין לא שמרתם מילים. לחצו על מילים בטקסט כדי להוסיף אותן לכאן!
                </div>
              ) : (
                <div className="space-y-2">
                  {savedWords.map((w) => (
                    <div
                      key={w.id}
                      className="p-3 rounded-xl border border-border bg-card flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">{w.english}</span>
                          <button
                            type="button"
                            onClick={() => handleSpeak(w.english)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {w.example && (
                          <p className="text-[11px] text-muted-foreground italic mt-0.5">{w.example}</p>
                        )}
                      </div>
                      <span className="font-bold text-primary text-sm" dir="rtl">{w.hebrew}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <Link
                href="/vocabulary"
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer shadow-xs"
              >
                <span>עבור לתרגול מלא בכרטיסיות ומשחקים</span>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
