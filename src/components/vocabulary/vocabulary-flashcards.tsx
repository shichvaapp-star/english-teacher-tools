"use client";

import React from "react";
import { formatVocabSourceLabel } from "@/lib/vocab-storage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Volume2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularyFlashcards({ c }: { c: VocabularyPracticeController }) {
  const {
    cardIndex,
    currentCard,
    filteredWords,
    handleNextCard,
    handlePrevCard,
    handleSpeak,
    handleToggleStar,
    isFlipped,
    markCardMastered,
    setIsFlipped,
    studyMode,
  } = c;
  return (
    <>
      {/* MODE 1: FLASHCARDS */}
      {studyMode === "flashcards" && currentCard && filteredWords.length > 0 && (
        <div className="max-w-lg mx-auto space-y-6 pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              כרטיס {(cardIndex % filteredWords.length) + 1} מתוך {filteredWords.length}
            </span>
            <Badge variant="outline" className="text-[11px] max-w-[240px] truncate" dir="rtl">
              {formatVocabSourceLabel(currentCard)}
            </Badge>
          </div>

          {/* Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[260px] w-full rounded-2xl border-2 border-primary/20 bg-card p-6 flex flex-col items-center justify-between cursor-pointer shadow-md hover:border-primary/40 transition-all select-none text-center"
          >
            <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStar(currentCard.id, currentCard.starred);
                  }}
                  className={cn(
                    "p-1.5 rounded-full transition-colors cursor-pointer",
                    currentCard.starred
                      ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
                      : "text-muted-foreground hover:text-amber-500 hover:bg-muted"
                  )}
                  title={currentCard.starred ? "הסר מכוכב / מועדפים" : "סמן בכוכב ⭐ לתרגול ממוקד"}
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      currentCard.starred ? "fill-amber-400 text-amber-500" : ""
                    )}
                  />
                </button>
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
              <span className="text-[11px]">לחצו בכל מקום בכרטיס כדי להפוך ↺</span>
            </div>

            {!isFlipped ? (
              <div className="space-y-3 my-auto notranslate" translate="no" lang="en">
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

            <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-2">
              {currentCard.mastered ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> סומן כנלמד בהצלחה!
                </span>
              ) : (
                <span className="text-muted-foreground">⏳ עדיין בתהליך למידה</span>
              )}
              {currentCard.starred && (
                <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
                  <Star className="h-3 w-3 fill-amber-400" /> מועדף
                </span>
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
                onClick={() => markCardMastered(currentCard.id, false)}
                className="cursor-pointer text-xs"
              >
                לתרגל שוב
              </Button>
              <Button
                size="sm"
                onClick={() => markCardMastered(currentCard.id, true)}
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
    </>
  );
}
