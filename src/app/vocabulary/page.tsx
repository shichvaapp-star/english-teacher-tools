"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import {
  MIDDLE_SCHOOL_EASY,
  MIDDLE_SCHOOL_MEDIUM,
  MIDDLE_SCHOOL_HARD,
  loadSavedWords,
  VocabItem,
} from "@/lib/vocab-storage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookA,
  ArrowLeft,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  Printer,
  BookMarked,
} from "lucide-react";

// Pure deterministic shuffle helper
function deterministicShuffle<T extends { id: string }>(items: T[], seed: number): T[] {
  return [...items].sort((a, b) => {
    const scoreA = (a.id.charCodeAt(a.id.length - 1) * 7 + seed) % 13;
    const scoreB = (b.id.charCodeAt(b.id.length - 1) * 7 + seed) % 13;
    return scoreA - scoreB;
  });
}

export default function VocabularyPage() {
  const { user } = useAuth();

  // Load words saved from reading unseens
  const [savedUnseenWords] = useState<VocabItem[]>(() => loadSavedWords(user?.id));

  const [activeCategory, setActiveCategory] = useState<"saved" | "grade7" | "grade8" | "grade9">("grade7");
  const [studyMode, setStudyMode] = useState<"flashcards" | "match" | "quiz" | "bank">("flashcards");
  const [searchQuery, setSearchQuery] = useState("");

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  // Speed Match state
  const [selectedEng, setSelectedEng] = useState<string | null>(null);
  const [selectedHeb, setSelectedHeb] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [matchError, setMatchError] = useState(false);
  const [matchRound, setMatchRound] = useState(1);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Active word list based on category
  const activePool = useMemo(() => {
    if (activeCategory === "saved") {
      return savedUnseenWords.length > 0 ? savedUnseenWords : MIDDLE_SCHOOL_EASY;
    }
    if (activeCategory === "grade7") return MIDDLE_SCHOOL_EASY;
    if (activeCategory === "grade8") return MIDDLE_SCHOOL_MEDIUM;
    return MIDDLE_SCHOOL_HARD;
  }, [activeCategory, savedUnseenWords]);

  const filteredWords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return activePool;
    return activePool.filter(
      (w) =>
        w.english.toLowerCase().includes(q) ||
        w.hebrew.includes(q) ||
        (w.example && w.example.toLowerCase().includes(q))
    );
  }, [activePool, searchQuery]);

  const currentCard = filteredWords[cardIndex % (filteredWords.length || 1)] || activePool[0];

  // Speech pronunciation
  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Flashcard controls
  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    handleNextCard();
  };

  // Speed Match Pool
  const matchPool = useMemo(() => {
    return filteredWords.slice(0, 6);
  }, [filteredWords]);

  const shuffledHebrew = useMemo(() => {
    return deterministicShuffle(matchPool, matchRound * 13);
  }, [matchPool, matchRound]);

  const handleMatchClickEng = (id: string) => {
    if (matchedPairs.has(id)) return;
    setSelectedEng(id);
    if (selectedHeb) checkMatch(id, selectedHeb);
  };

  const handleMatchClickHeb = (id: string) => {
    if (matchedPairs.has(id)) return;
    setSelectedHeb(id);
    if (selectedEng) checkMatch(selectedEng, id);
  };

  const checkMatch = (engId: string, hebId: string) => {
    if (engId === hebId) {
      setMatchedPairs((prev) => new Set([...prev, engId]));
      setSelectedEng(null);
      setSelectedHeb(null);
      setMatchError(false);
    } else {
      setMatchError(true);
      setTimeout(() => {
        setSelectedEng(null);
        setSelectedHeb(null);
        setMatchError(false);
      }, 700);
    }
  };

  // Quiz logic
  const currentQuizWord = filteredWords[quizIndex % (filteredWords.length || 1)] || activePool[0];
  const quizOptions = useMemo(() => {
    if (!currentQuizWord) return [];
    const pool = activePool.filter((w) => w.id !== currentQuizWord.id).slice(0, 3);
    return deterministicShuffle([currentQuizWord, ...pool], quizIndex * 7);
  }, [currentQuizWord, activePool, quizIndex]);

  const handleQuizAnswer = (hebrewChoice: string) => {
    if (selectedQuizOption) return;
    setSelectedQuizOption(hebrewChoice);
    if (hebrewChoice === currentQuizWord.hebrew) {
      setQuizScore((s) => s + 10);
    }
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
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <BookA className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm sm:text-base">אימון אוצר מילים &bull; חטיבת ביניים בן גוריון</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 print:p-0 print:m-0">
        {/* Category Picker (Middle School Grades + Saved from Unseen) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">מאגר מילים:</span>

            <Button
              variant={activeCategory === "saved" ? "default" : "outline"}
              size="sm"
              className="text-xs h-8 cursor-pointer gap-1.5"
              onClick={() => {
                setActiveCategory("saved");
                setCardIndex(0);
              }}
            >
              <BookMarked className="h-3.5 w-3.5" />
              <span>המילים שלי מהאנסין ({savedUnseenWords.length})</span>
            </Button>

            <Button
              variant={activeCategory === "grade7" ? "default" : "outline"}
              size="sm"
              className="text-xs h-8 cursor-pointer"
              onClick={() => {
                setActiveCategory("grade7");
                setCardIndex(0);
              }}
            >
              כיתה ז׳ (רמה קלה)
            </Button>

            <Button
              variant={activeCategory === "grade8" ? "default" : "outline"}
              size="sm"
              className="text-xs h-8 cursor-pointer"
              onClick={() => {
                setActiveCategory("grade8");
                setCardIndex(0);
              }}
            >
              כיתה ח׳ (בינוני)
            </Button>

            <Button
              variant={activeCategory === "grade9" ? "default" : "outline"}
              size="sm"
              className="text-xs h-8 cursor-pointer"
              onClick={() => {
                setActiveCategory("grade9");
                setCardIndex(0);
              }}
            >
              כיתה ט׳ (מתקדם)
            </Button>
          </div>

          <div className="relative w-48 sm:w-60">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              placeholder="חיפוש מילה או תרגום..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        {/* Study Mode Tabs */}
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Tabs value={studyMode} onValueChange={(v) => setStudyMode(v as "flashcards" | "match" | "quiz" | "bank")}>
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="flashcards" className="text-xs">
                1. כרטיסיות
              </TabsTrigger>
              <TabsTrigger value="match" className="text-xs">
                2. משחק התאמה
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-xs">
                3. בחן את עצמך
              </TabsTrigger>
              <TabsTrigger value="bank" className="text-xs">
                4. מילון ({filteredWords.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <span className="text-xs text-muted-foreground hidden sm:inline">
            {masteredIds.size} מילים סומנו כנלמדו ✓
          </span>
        </div>

        {/* MODE 1: FLASHCARDS */}
        {studyMode === "flashcards" && currentCard && (
          <div className="max-w-lg mx-auto space-y-6 pt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                כרטיס {cardIndex + 1} מתוך {filteredWords.length}
              </span>
              <Badge variant="outline" className="text-[11px]">
                {currentCard.level || "חטיבת ביניים"}
              </Badge>
            </div>

            {/* Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[250px] w-full rounded-2xl border-2 border-primary/20 bg-card p-6 flex flex-col items-center justify-between cursor-pointer shadow-md hover:border-primary/40 transition-all select-none text-center"
            >
              <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-[11px]">לחצו בכל מקום בכרטיס כדי להפוך ↺</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentCard.english);
                  }}
                  className="p-1.5 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer"
                  title="האזן להגייה באנגלית"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>

              {!isFlipped ? (
                <div className="space-y-3 my-auto">
                  <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                    {currentCard.english}
                  </h2>
                  {currentCard.example && (
                    <p className="text-xs sm:text-sm text-muted-foreground italic max-w-sm mx-auto">
                      &quot;{currentCard.example}&quot;
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3 my-auto" dir="rtl">
                  <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                    {currentCard.hebrew}
                  </h2>
                  {currentCard.example && (
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto font-sans" dir="ltr">
                      &quot;{currentCard.example}&quot;
                    </p>
                  )}
                </div>
              )}

              <div className="text-[11px] text-muted-foreground">
                {masteredIds.has(currentCard.id) ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> מסומן כנשלט בהצלחה!
                  </span>
                ) : (
                  <span>האם ידעת את התרגום?</span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" size="sm" onClick={handlePrevCard} className="cursor-pointer gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>הקודם</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleMastered(currentCard.id)}
                  className="cursor-pointer text-xs"
                >
                  לתרגל שוב
                </Button>
                <Button
                  size="sm"
                  onClick={() => toggleMastered(currentCard.id)}
                  className="cursor-pointer text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>אני יודע/ת!</span>
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={handleNextCard} className="cursor-pointer gap-1">
                <span>הבא</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* MODE 2: SPEED MATCH */}
        {studyMode === "match" && (
          <div className="max-w-2xl mx-auto space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">משחק התאמה מהיר (Speed Match)</h3>
                <p className="text-xs text-muted-foreground">
                  לחצו על מילה באנגלית, ולאחר מכן לחצו על התרגום התואם שלה בעברית.
                </p>
              </div>
              <Badge variant="outline">
                {matchedPairs.size} / {matchPool.length} הותאמו
              </Badge>
            </div>

            {matchedPairs.size === matchPool.length ? (
              <div className="p-8 text-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-xl font-bold">כל הכבוד! התאמתם את כל המילים!</h4>
                <Button
                  onClick={() => {
                    setMatchedPairs(new Set());
                    setSelectedEng(null);
                    setSelectedHeb(null);
                    setMatchRound((r) => r + 1);
                  }}
                  className="cursor-pointer gap-1.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>שחק סיבוב נוסף</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* English Column */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground block">באנגלית</span>
                  {matchPool.map((w) => {
                    const isMatched = matchedPairs.has(w.id);
                    const isSelected = selectedEng === w.id;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleMatchClickEng(w.id)}
                        className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                          isMatched
                            ? "border-emerald-500/30 bg-emerald-500/10 opacity-50 line-through"
                            : isSelected && matchError
                            ? "border-destructive bg-destructive/15 text-destructive"
                            : isSelected
                            ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                            : "border-border hover:bg-muted/60"
                        }`}
                      >
                        <span>{w.english}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Hebrew Column */}
                <div className="space-y-2" dir="rtl">
                  <span className="text-xs font-semibold text-muted-foreground block text-right">בעברית</span>
                  {shuffledHebrew.map((w) => {
                    const isMatched = matchedPairs.has(w.id);
                    const isSelected = selectedHeb === w.id;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleMatchClickHeb(w.id)}
                        className={`w-full p-3 rounded-xl border text-sm font-bold transition-all text-right cursor-pointer ${
                          isMatched
                            ? "border-emerald-500/30 bg-emerald-500/10 opacity-50 line-through"
                            : isSelected && matchError
                            ? "border-destructive bg-destructive/15 text-destructive"
                            : isSelected
                            ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                            : "border-border hover:bg-muted/60"
                        }`}
                      >
                        <span>{w.hebrew}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: QUIZ */}
        {studyMode === "quiz" && currentQuizWord && (
          <div className="max-w-lg mx-auto space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">בחן את עצמך (Quiz)</h3>
                <p className="text-xs text-muted-foreground">מהו התרגום הנכון למילה הבאה?</p>
              </div>
              <Badge variant="secondary">ניקוד: {quizScore} נק׳</Badge>
            </div>

            <Card className="border border-border/80">
              <CardHeader className="text-center pb-2">
                <span className="text-xs text-muted-foreground">מילה באנגלית:</span>
                <CardTitle className="text-3xl font-extrabold text-foreground pt-1">
                  {currentQuizWord.english}
                </CardTitle>
                {currentQuizWord.example && (
                  <CardDescription className="text-xs italic">
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

        {/* MODE 4: WORD BANK TABLE */}
        {studyMode === "bank" && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">מילון המילים למאגר זה</h3>
                <p className="text-xs text-muted-foreground">
                  סה״כ {filteredWords.length} מילים להרחבת אוצר המילים.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 text-xs cursor-pointer print:hidden"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>הדפסת דף עבודה</span>
              </Button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <th className="p-3 w-1/3">באנגלית (English)</th>
                    <th className="p-3 w-1/3 text-right">בעברית (תרגום)</th>
                    <th className="p-3 w-1/3">משפט לדוגמה</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredWords.map((w) => (
                    <tr key={w.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-bold text-foreground flex items-center gap-2">
                        <span>{w.english}</span>
                        <button
                          type="button"
                          onClick={() => handleSpeak(w.english)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer print:hidden"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                      <td className="p-3 font-bold text-primary text-right" dir="rtl">
                        {w.hebrew}
                      </td>
                      <td className="p-3 text-muted-foreground italic">
                        {w.example ? `"${w.example}"` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
