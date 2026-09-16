"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import {
  MIDDLE_SCHOOL_EASY,
  MIDDLE_SCHOOL_MEDIUM,
  MIDDLE_SCHOOL_HARD,
  loadSavedWords,
  saveWordToBuilder,
  removeWordFromBuilder,
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
  Plus,
  Trash2,
  X,
  AlertCircle,
  Sparkles,
  Check,
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

  // Load words saved from reading unseens & manual inputs
  const [savedUnseenWords, setSavedUnseenWords] = useState<VocabItem[]>(() =>
    loadSavedWords(user?.id)
  );

  // Sync saved words whenever active user changes
  useEffect(() => {
    setSavedUnseenWords(loadSavedWords(user?.id));
  }, [user?.id]);

  const [activeCategory, setActiveCategory] = useState<"saved" | "grade7" | "grade8" | "grade9">(
    "saved"
  );
  const [studyMode, setStudyMode] = useState<"flashcards" | "match" | "quiz" | "bank">("flashcards");
  const [searchQuery, setSearchQuery] = useState("");

  // Manual Word Input Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWordEng, setNewWordEng] = useState("");
  const [newWordHeb, setNewWordHeb] = useState("");
  const [newWordSentence, setNewWordSentence] = useState("");
  const [newWordPos, setNewWordPos] = useState<"noun" | "verb" | "adjective" | "adverb" | "phrase">("noun");
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

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
      return savedUnseenWords;
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

  const currentCard = filteredWords[cardIndex % (filteredWords.length || 1)] || null;

  // Real-time check if English word appears in the example sentence
  const isWordInSentence = useMemo(() => {
    const cleanWord = newWordEng.trim().toLowerCase();
    const cleanSentence = newWordSentence.trim().toLowerCase();
    if (!cleanWord || !cleanSentence) return false;
    return cleanSentence.includes(cleanWord);
  }, [newWordEng, newWordSentence]);

  // Handle saving manually entered word
  const handleSaveCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEng = newWordEng.trim().toLowerCase();
    const cleanHeb = newWordHeb.trim();
    const cleanSent = newWordSentence.trim();

    if (!cleanEng) {
      setFormError("אנא הזינו את המילה באנגלית.");
      return;
    }

    if (!/^[a-zA-Z\s\-']+$/.test(cleanEng)) {
      setFormError("המילה באנגלית צריכה להכיל אותיות באנגלית בלבד.");
      return;
    }

    if (!cleanHeb) {
      setFormError("אנא הזינו תרגום לעברית.");
      return;
    }

    if (!cleanSent) {
      setFormError("חובה להציב את המילה בתוך משפט לדוגמה באנגלית.");
      return;
    }

    if (!cleanSent.toLowerCase().includes(cleanEng)) {
      setFormError(`המשפט חייב להכיל את המילה באנגלית: "${cleanEng}".`);
      return;
    }

    const res = saveWordToBuilder(
      {
        english: cleanEng,
        hebrew: cleanHeb,
        example: cleanSent,
        partOfSpeech: newWordPos,
        level: "Personal Word",
      },
      user?.id
    );

    if (!res.added) {
      setFormError("המילה כבר קיימת באוצר המילים שלך!");
      return;
    }

    const updated = loadSavedWords(user?.id);
    setSavedUnseenWords(updated);
    setActiveCategory("saved");
    setShowAddModal(false);
    setNewWordEng("");
    setNewWordHeb("");
    setNewWordSentence("");
    setFormError(null);
    setSuccessToast(`✓ המילה "${cleanEng}" נוספה בהצלחה לאוצר המילים האישי שלך!`);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  // Remove word from personal collection
  const handleDeleteWord = (wordId: string, englishWord: string) => {
    if (confirm(`האם למחוק את המילה "${englishWord}" מאוצר המילים האישי שלך?`)) {
      removeWordFromBuilder(wordId, user?.id);
      const updated = loadSavedWords(user?.id);
      setSavedUnseenWords(updated);
    }
  };

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
    if (filteredWords.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    if (filteredWords.length === 0) return;
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

  // Quiz Pool & Options
  const currentQuizWord = filteredWords[quizIndex % (filteredWords.length || 1)] || null;

  const quizOptions = useMemo(() => {
    if (!currentQuizWord) return [];
    const pool = activePool.length >= 4 ? activePool : MIDDLE_SCHOOL_EASY;
    const others = pool.filter((w) => w.id !== currentQuizWord.id);
    const shuffledOthers = deterministicShuffle(others, (quizIndex + 1) * 7).slice(0, 3);
    const combined = [...shuffledOthers, currentQuizWord];
    return deterministicShuffle(combined, (quizIndex + 1) * 11);
  }, [activePool, currentQuizWord, quizIndex]);

  const handleQuizAnswer = (hebrewChoice: string) => {
    if (!currentQuizWord) return;
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
            {/* Quick Add Word Button in Navbar */}
            <Button
              onClick={() => {
                setShowAddModal(true);
                setFormError(null);
              }}
              size="sm"
              className="h-8 text-xs font-bold gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              dir="rtl"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>הוספת מילה חדשה</span>
            </Button>

            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 print:p-0 print:m-0">
        {/* Success Toast Banner */}
        {successToast && (
          <div
            className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in"
            dir="rtl"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Category Picker & Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4 print:hidden">
          <div className="flex flex-wrap items-center gap-2" dir="rtl">
            <span className="text-xs font-semibold text-muted-foreground ml-1">מאגר מילים:</span>

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
              <span>אוצר המילים שלי ({savedUnseenWords.length})</span>
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
              רמה 1 (בסיסי)
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
              רמה 2 (שוטף)
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
              רמה 3 (מתקדם)
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="חיפוש מילה או תרגום..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>

            <Button
              onClick={() => {
                setShowAddModal(true);
                setFormError(null);
              }}
              variant="outline"
              size="sm"
              className="h-8 text-xs font-bold gap-1 cursor-pointer border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
              dir="rtl"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>הוסף מילה</span>
            </Button>
          </div>
        </div>

        {/* Study Mode Tabs */}
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Tabs
            value={studyMode}
            onValueChange={(v) => setStudyMode(v as "flashcards" | "match" | "quiz" | "bank")}
          >
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

        {/* EMPTY STATE (When category has no words) */}
        {filteredWords.length === 0 && (
          <div className="max-w-md mx-auto py-12 text-center space-y-4" dir="rtl">
            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-16 h-16 mx-auto flex items-center justify-center">
              <BookMarked className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">
                {activeCategory === "saved"
                  ? "עדיין לא הוספת מילים לאוצר המילים שלך"
                  : "לא נמצאו מילים התואמות לחיפוש"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeCategory === "saved"
                  ? "תוכל להזין מילים חדשות ידנית בעצמך (עם מילה, תרגום ומשפט לדוגמה) או ללחוץ על מילים בזמן קריאת אנסין כדי לשמור אותן כאן."
                  : "נסו לחפש מילה אחרת או נקו את שורת החיפוש."}
              </p>
            </div>

            {activeCategory === "saved" && (
              <Button
                onClick={() => {
                  setShowAddModal(true);
                  setFormError(null);
                }}
                className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>הוסף את המילה הראשונה שלך עכשיו</span>
              </Button>
            )}
          </div>
        )}

        {/* MODE 1: FLASHCARDS */}
        {studyMode === "flashcards" && currentCard && filteredWords.length > 0 && (
          <div className="max-w-lg mx-auto space-y-6 pt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                כרטיס {(cardIndex % filteredWords.length) + 1} מתוך {filteredWords.length}
              </span>
              <Badge variant="outline" className="text-[11px]">
                {currentCard.level === "Personal Word"
                  ? "מילה אישית שהזנת"
                  : currentCard.level === "Saved from Unseen"
                  ? "נשמר מהאנסין"
                  : currentCard.level || "חטיבת ביניים"}
              </Badge>
            </div>

            {/* Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[260px] w-full rounded-2xl border-2 border-primary/20 bg-card p-6 flex flex-col items-center justify-between cursor-pointer shadow-md hover:border-primary/40 transition-all select-none text-center"
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
                    <p className="text-xs sm:text-sm text-muted-foreground italic max-w-sm mx-auto font-sans" dir="ltr">
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
        {studyMode === "match" && filteredWords.length > 0 && (
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

            {matchedPairs.size === matchPool.length && matchPool.length > 0 ? (
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
                  <span className="text-xs font-semibold text-muted-foreground block text-left">
                    באנגלית (English)
                  </span>
                  {matchPool.map((item) => {
                    const isMatched = matchedPairs.has(item.id);
                    const isSelected = selectedEng === item.id;

                    let btnClass = "border-border bg-card hover:border-primary/50 text-foreground";
                    if (isMatched) btnClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 opacity-50";
                    else if (isSelected) {
                      btnClass = matchError
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-primary bg-primary/10 text-primary font-bold";
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleMatchClickEng(item.id)}
                        className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all text-left cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>{item.english}</span>
                        {isMatched && <CheckCircle2 className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>

                {/* Hebrew Column */}
                <div className="space-y-2" dir="rtl">
                  <span className="text-xs font-semibold text-muted-foreground block text-right">
                    בעברית (תרגום)
                  </span>
                  {shuffledHebrew.map((item) => {
                    const isMatched = matchedPairs.has(item.id);
                    const isSelected = selectedHeb === item.id;

                    let btnClass = "border-border bg-card hover:border-primary/50 text-foreground";
                    if (isMatched) btnClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 opacity-50";
                    else if (isSelected) {
                      btnClass = matchError
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-primary bg-primary/10 text-primary font-bold";
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleMatchClickHeb(item.id)}
                        className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all text-right cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>{item.hebrew}</span>
                        {isMatched && <CheckCircle2 className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

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
                <CardTitle className="text-3xl font-extrabold text-foreground pt-1">
                  {currentQuizWord.english}
                </CardTitle>
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

        {/* MODE 4: WORD BANK TABLE */}
        {studyMode === "bank" && filteredWords.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold">
                  {activeCategory === "saved" ? "מילון אוצר המילים האישי שלי" : "מילון המילים למאגר זה"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  סה״כ {filteredWords.length} מילים להרחבת אוצר המילים.
                </p>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <Button
                  onClick={() => {
                    setShowAddModal(true);
                    setFormError(null);
                  }}
                  size="sm"
                  className="gap-1 text-xs cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  dir="rtl"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>הוסף מילה חדשה</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="gap-1.5 text-xs cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>הדפסת דף עבודה</span>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border overflow-hidden bg-card shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <th className="p-3 w-1/4">באנגלית (English)</th>
                    <th className="p-3 w-1/4 text-right">בעברית (תרגום)</th>
                    <th className="p-3 w-2/5">משפט לדוגמה (Sentence)</th>
                    <th className="p-3 w-20 text-center print:hidden">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredWords.map((w) => (
                    <tr key={w.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-bold text-foreground">
                        <div className="flex items-center gap-2">
                          <span>{w.english}</span>
                          <button
                            type="button"
                            onClick={() => handleSpeak(w.english)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer print:hidden"
                            title="האזנה להגייה"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                          {w.level === "Personal Word" && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hidden sm:inline">
                              הזנה ידנית
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-primary text-right" dir="rtl">
                        {w.hebrew}
                      </td>
                      <td className="p-3 text-muted-foreground italic font-sans" dir="ltr">
                        {w.example ? `"${w.example}"` : "—"}
                      </td>
                      <td className="p-3 text-center print:hidden">
                        {activeCategory === "saved" ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteWord(w.id, w.english)}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer rounded-md hover:bg-destructive/10"
                            title="מחק מילה מאוצר המילים שלי"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span className="text-muted-foreground/50 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Manual Word Input Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-foreground">
                    הוספת מילה חדשה לאוצר המילים
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    הזינו את המילה באנגלית, תרגומה לעברית, והציבו אותה בתוך משפט לדוגמה.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormError(null);
                }}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCustomWord} className="space-y-4 text-xs">
              {/* Field 1: English Word */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  1. המילה באנגלית (English Word) <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="למשל: discover או curious"
                  value={newWordEng}
                  onChange={(e) => {
                    setNewWordEng(e.target.value);
                    setFormError(null);
                  }}
                  dir="ltr"
                  className="h-10 text-sm font-sans"
                  autoFocus
                />
              </div>

              {/* Field 2: Hebrew Translation */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  2. תרגום המילה לעברית <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="למשל: לגלות או סקרן"
                  value={newWordHeb}
                  onChange={(e) => {
                    setNewWordHeb(e.target.value);
                    setFormError(null);
                  }}
                  dir="rtl"
                  className="h-10 text-sm"
                />
              </div>

              {/* Field 3: Part of Speech */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  3. חלק דיבר (Part of Speech)
                </label>
                <select
                  value={newWordPos}
                  onChange={(e) =>
                    setNewWordPos(
                      e.target.value as "noun" | "verb" | "adjective" | "adverb" | "phrase"
                    )
                  }
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="noun">שם עצם (Noun)</option>
                  <option value="verb">פועל (Verb)</option>
                  <option value="adjective">שם תואר (Adjective)</option>
                  <option value="adverb">תואר הפועל (Adverb)</option>
                  <option value="phrase">ביטוי / צירוף מילים (Phrase)</option>
                </select>
              </div>

              {/* Field 4: Example Sentence containing the word */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground block">
                    4. הצבת המילה בתוך משפט באנגלית (Example Sentence) <span className="text-destructive">*</span>
                  </label>
                  {newWordEng.trim() && (
                    <span className="text-[10px] text-muted-foreground font-sans" dir="ltr">
                      Must include: <strong>{newWordEng.trim()}</strong>
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  placeholder={`למשל: We wanted to ${newWordEng.trim() || "discover"} new places during the trip.`}
                  value={newWordSentence}
                  onChange={(e) => {
                    setNewWordSentence(e.target.value);
                    setFormError(null);
                  }}
                  dir="ltr"
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm font-sans shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />

                {/* Real-time sentence inclusion indicator */}
                {newWordSentence.trim() && newWordEng.trim() && (
                  <div className="pt-0.5">
                    {isWordInSentence ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>מעולה! המילה &quot;{newWordEng.trim()}&quot; מופיעה כנדרש בתוך המשפט.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>שימו לב: המשפט חייב להכיל את המילה באנגלית (&quot;{newWordEng.trim()}&quot;).</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormError(null);
                  }}
                  className="cursor-pointer text-xs"
                >
                  ביטול
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={!newWordEng.trim() || !newWordHeb.trim() || !newWordSentence.trim() || !isWordInSentence}
                  className="cursor-pointer text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  <Check className="h-4 w-4" />
                  <span>שמור מילה לאוצר המילים</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
