"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { MINISTRY_VOCAB_WORDS } from "@/data/vocabulary-bands";
import { VocabWord, VocabBand, VocabStudyMode } from "@/types/vocabulary";
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
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Flame,
  Printer,
} from "lucide-react";

// Deterministic pure shuffle helper to satisfy React 19 compiler
function deterministicShuffle<T extends { id: string }>(items: T[], seed: number): T[] {
  return [...items].sort((a, b) => {
    const scoreA = (a.id.charCodeAt(a.id.length - 1) * 7 + seed) % 13;
    const scoreB = (b.id.charCodeAt(b.id.length - 1) * 7 + seed) % 13;
    return scoreA - scoreB;
  });
}

export default function VocabularyPage() {
  const [words] = useState<VocabWord[]>(MINISTRY_VOCAB_WORDS);
  const [selectedBand, setSelectedBand] = useState<"all" | VocabBand>("all");
  const [studyMode, setStudyMode] = useState<VocabStudyMode>("flashcards");
  const [searchQuery, setSearchQuery] = useState("");

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWordIds, setKnownWordIds] = useState<Set<string>>(new Set());

  // Speed Match state
  const [selectedEng, setSelectedEng] = useState<string | null>(null);
  const [selectedHeb, setSelectedHeb] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [matchError, setMatchError] = useState(false);
  const [matchRound, setMatchRound] = useState(1);

  // Fill in the blank state
  const [fillIndex, setFillIndex] = useState(0);
  const [fillSelectedWord, setFillSelectedWord] = useState<string | null>(null);
  const [fillScore, setFillScore] = useState(0);

  // Filtered word lists
  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      const matchesBand = selectedBand === "all" || w.band === selectedBand;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        w.word.toLowerCase().includes(q) ||
        w.hebrew.includes(q) ||
        w.exampleSentence.toLowerCase().includes(q);
      return matchesBand && matchesSearch;
    });
  }, [words, selectedBand, searchQuery]);

  const activeFlashcardList = filteredWords.length > 0 ? filteredWords : words;
  const currentCard = activeFlashcardList[cardIndex % activeFlashcardList.length];

  // Pronounce word
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
    setCardIndex((prev) => (prev + 1) % activeFlashcardList.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + activeFlashcardList.length) % activeFlashcardList.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 3) % activeFlashcardList.length);
  };

  const toggleKnown = (wordId: string) => {
    setKnownWordIds((prev) => {
      const next = new Set(prev);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      return next;
    });
    handleNextCard();
  };

  // Matching game logic
  const matchWordsPool = useMemo(() => {
    return activeFlashcardList.slice(0, 6);
  }, [activeFlashcardList]);

  const shuffledHebrew = useMemo(() => {
    return deterministicShuffle(matchWordsPool, matchRound * 17);
  }, [matchWordsPool, matchRound]);

  const handleEnglishClick = (wordId: string) => {
    if (matchedPairs.has(wordId)) return;
    setSelectedEng(wordId);
    if (selectedHeb) {
      checkMatch(wordId, selectedHeb);
    }
  };

  const handleHebrewClick = (wordId: string) => {
    if (matchedPairs.has(wordId)) return;
    setSelectedHeb(wordId);
    if (selectedEng) {
      checkMatch(selectedEng, wordId);
    }
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

  // Fill in blanks options
  const currentFillWord = activeFlashcardList[fillIndex % activeFlashcardList.length];
  const fillOptions = useMemo(() => {
    if (!currentFillWord) return [];
    const pool = words.filter((w) => w.id !== currentFillWord.id).slice(0, 3);
    return deterministicShuffle([currentFillWord, ...pool], fillIndex * 11);
  }, [currentFillWord, words, fillIndex]);

  const handleSelectFillOption = (word: string) => {
    if (fillSelectedWord) return;
    setFillSelectedWord(word);
    if (word === currentFillWord.word) {
      setFillScore((s) => s + 10);
    }
  };

  const handleNextFill = () => {
    setFillSelectedWord(null);
    setFillIndex((i) => i + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background print:bg-white print:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Hub</span>
            </Link>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <BookA className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm sm:text-base">Vocabulary Band Trainer</span>
              <Badge variant="outline" className="text-[10px] hidden md:inline-block">
                Ministry Bands I, II, III
              </Badge>
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
        {/* Band Selector & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Select Band:</span>
            {(["all", "Band I", "Band II", "Band III"] as const).map((b) => (
              <Button
                key={b}
                variant={selectedBand === b ? "default" : "outline"}
                size="sm"
                className="text-xs cursor-pointer h-7"
                onClick={() => {
                  setSelectedBand(b);
                  setCardIndex(0);
                }}
              >
                {b === "all" ? "All Bands" : b}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-64">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search word or תרגום..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Study Mode Navigation Tabs */}
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Tabs value={studyMode} onValueChange={(v) => setStudyMode(v as VocabStudyMode)}>
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="flashcards" className="text-xs">
                1. Flashcards
              </TabsTrigger>
              <TabsTrigger value="speed_match" className="text-xs">
                2. Speed Match
              </TabsTrigger>
              <TabsTrigger value="fill_in" className="text-xs">
                3. Fill-in Drill
              </TabsTrigger>
              <TabsTrigger value="wordbank" className="text-xs">
                4. Word Bank ({filteredWords.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <Flame className="h-3.5 w-3.5" />
              <span>{knownWordIds.size} Words Mastered</span>
            </span>
          </div>
        </div>

        {/* MODE 1: FLASHCARDS */}
        {studyMode === "flashcards" && currentCard && (
          <div className="max-w-xl mx-auto space-y-6 pt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Card {cardIndex + 1} of {activeFlashcardList.length}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[11px]">
                  {currentCard.band}
                </Badge>
                <Badge variant="secondary" className="text-[11px] capitalize">
                  {currentCard.partOfSpeech}
                </Badge>
              </div>
            </div>

            {/* Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[260px] sm:min-h-[300px] w-full rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card to-muted/40 p-6 sm:p-8 flex flex-col items-center justify-between cursor-pointer shadow-md hover:border-primary/40 transition-all select-none text-center"
            >
              <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                <span className="text-[11px] font-medium">Click card anywhere to flip ↺</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentCard.word);
                  }}
                  className="p-1.5 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>

              {!isFlipped ? (
                <div className="space-y-4 my-auto">
                  <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                    {currentCard.word}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground italic max-w-md mx-auto">
                    &quot;{currentCard.exampleSentence}&quot;
                  </p>
                </div>
              ) : (
                <div className="space-y-4 my-auto" dir="rtl">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                    {currentCard.hebrew}
                  </h2>
                  {currentCard.definitionEn && (
                    <p className="text-xs text-muted-foreground max-w-md mx-auto font-sans" dir="ltr">
                      <strong>Meaning:</strong> {currentCard.definitionEn}
                    </p>
                  )}
                  <p className="text-xs text-foreground/80 italic max-w-md mx-auto font-sans" dir="ltr">
                    &quot;{currentCard.exampleSentence}&quot;
                  </p>
                </div>
              )}

              <div className="w-full pt-2 flex items-center justify-center text-[11px] text-muted-foreground">
                {knownWordIds.has(currentCard.id) ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Marked as Mastered
                  </span>
                ) : (
                  <span>Ready to test recall</span>
                )}
              </div>
            </div>

            {/* Navigation & Spaced Repetition Buttons */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevCard}
                className="cursor-pointer gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleKnown(currentCard.id)}
                  className="cursor-pointer text-xs"
                >
                  Review Again
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => toggleKnown(currentCard.id)}
                  className="cursor-pointer text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>I Know This!</span>
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShuffle}
                  className="cursor-pointer"
                  title="Shuffle cards"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextCard}
                  className="cursor-pointer gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: SPEED MATCH */}
        {studyMode === "speed_match" && (
          <div className="max-w-2xl mx-auto space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Speed Match: English to Hebrew</h3>
                <p className="text-xs text-muted-foreground">
                  Click an English word on the left, then click its Hebrew meaning on the right.
                </p>
              </div>
              <Badge variant="outline">
                {matchedPairs.size} / {matchWordsPool.length} Matched
              </Badge>
            </div>

            {matchedPairs.size === matchWordsPool.length ? (
              <div className="p-8 text-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-xl font-bold">Awesome! All words matched!</h4>
                <p className="text-xs text-muted-foreground">You nailed this set of Band vocabulary.</p>
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
                  <span>Play Next Round</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* English Column */}
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-muted-foreground block">English Words</span>
                  {matchWordsPool.map((w) => {
                    const isMatched = matchedPairs.has(w.id);
                    const isSelected = selectedEng === w.id;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleEnglishClick(w.id)}
                        className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                          isMatched
                            ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 opacity-60 line-through"
                            : isSelected
                            ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30 text-foreground"
                            : matchError && isSelected
                            ? "border-destructive bg-destructive/15 text-destructive"
                            : "border-border hover:bg-muted/60 text-foreground"
                        }`}
                      >
                        <span>{w.word}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {w.band}
                        </Badge>
                      </button>
                    );
                  })}
                </div>

                {/* Hebrew Column */}
                <div className="space-y-2.5" dir="rtl">
                  <span className="text-xs font-semibold text-muted-foreground block text-right">
                    תרגום לעברית
                  </span>
                  {shuffledHebrew.map((w) => {
                    const isMatched = matchedPairs.has(w.id);
                    const isSelected = selectedHeb === w.id;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleHebrewClick(w.id)}
                        className={`w-full p-3 rounded-xl border text-sm font-bold transition-all text-right cursor-pointer ${
                          isMatched
                            ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 opacity-60 line-through"
                            : isSelected
                            ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30 text-foreground"
                            : matchError && isSelected
                            ? "border-destructive bg-destructive/15 text-destructive"
                            : "border-border hover:bg-muted/60 text-foreground"
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

        {/* MODE 3: CONTEXT FILL-IN DRILL */}
        {studyMode === "fill_in" && currentFillWord && (
          <div className="max-w-xl mx-auto space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Contextual Fill-in-the-Blank</h3>
                <p className="text-xs text-muted-foreground">
                  Select the correct target word that belongs in the context sentence.
                </p>
              </div>
              <Badge variant="secondary" className="gap-1 font-semibold">
                Score: {fillScore} pts
              </Badge>
            </div>

            <Card className="border border-border/80">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit text-[11px]">
                  {currentFillWord.band} &bull; {currentFillWord.partOfSpeech}
                </Badge>
                <CardTitle className="text-lg font-medium leading-relaxed pt-2">
                  {currentFillWord.exampleSentence.replace(
                    new RegExp(`\\b${currentFillWord.word}\\b`, "i"),
                    "________"
                  )}
                </CardTitle>
                <CardDescription className="text-xs">
                  Hint (Hebrew meaning): <strong>{currentFillWord.hebrew}</strong>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2.5 pt-2">
                <div className="grid grid-cols-2 gap-2.5">
                  {fillOptions.map((opt) => {
                    const isSelected = fillSelectedWord === opt.word;
                    const isCorrect = opt.word === currentFillWord.word;

                    let btnClass = "border-border hover:bg-muted/50 text-foreground";
                    if (fillSelectedWord) {
                      if (isCorrect) {
                        btnClass = "border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 font-bold";
                      } else if (isSelected) {
                        btnClass = "border-destructive bg-destructive/10 text-destructive";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectFillOption(opt.word)}
                        disabled={fillSelectedWord !== null}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all text-center cursor-pointer ${btnClass}`}
                      >
                        {opt.word}
                      </button>
                    );
                  })}
                </div>

                {fillSelectedWord && (
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-xs">
                      {fillSelectedWord === currentFillWord.word ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Correct answer! (+10 pts)
                        </span>
                      ) : (
                        <span className="text-destructive font-semibold">
                          Incorrect. Correct word was: <strong>{currentFillWord.word}</strong>
                        </span>
                      )}
                    </span>
                    <Button size="sm" onClick={handleNextFill} className="cursor-pointer gap-1">
                      <span>Next Question</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* MODE 4: WORDBANK TABLE & WORKSHEET PRINT */}
        {studyMode === "wordbank" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Ministry Wordbank Database</h3>
                <p className="text-xs text-muted-foreground">
                  Showing {filteredWords.length} vocabulary items with Hebrew definitions.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 text-xs cursor-pointer print:hidden"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Wordlist Worksheet</span>
              </Button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <th className="p-3 w-1/4">English Word</th>
                    <th className="p-3 w-1/4 text-right">תרגום לעברית</th>
                    <th className="p-3 w-1/6">Band & POS</th>
                    <th className="p-3 w-1/3">Example in Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredWords.map((w) => (
                    <tr key={w.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                        <span>{w.word}</span>
                        <button
                          type="button"
                          onClick={() => handleSpeak(w.word)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer print:hidden"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                      <td className="p-3 font-bold text-primary text-right" dir="rtl">
                        {w.hebrew}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px]">
                            {w.band}
                          </Badge>
                          <span className="text-muted-foreground capitalize text-[11px]">
                            {w.partOfSpeech}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground italic">
                        &quot;{w.exampleSentence}&quot;
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
