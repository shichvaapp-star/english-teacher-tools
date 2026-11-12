"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, CheckCircle2, RotateCcw } from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularySpeedMatch({ c }: { c: VocabularyPracticeController }) {
  const {
    filteredWords,
    handleMatchClickEng,
    handleMatchClickHeb,
    handleSpeak,
    matchError,
    matchPool,
    matchedPairs,
    selectedEng,
    selectedHeb,
    setMatchRound,
    setMatchedPairs,
    setSelectedEng,
    setSelectedHeb,
    shuffledHebrew,
    speakingWord,
    studyMode,
  } = c;
  return (
    <>
      {/* MODE 2: SPEED MATCH */}
      {studyMode === "match" && filteredWords.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">משחק התאמה מהיר (Speed Match)</h3>
              <p className="text-xs text-muted-foreground">
                לחצו על מילה באנגלית (או על סמל הרמקול להאזנה להגייה), ולאחר מכן לחצו על התרגום התואם שלה בעברית.
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
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              {/* English Column */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground block text-left">
                  באנגלית (English)
                </span>
                {matchPool.map((item) => {
                  const isMatched = matchedPairs.has(item.id);
                  const isSelected = selectedEng === item.id;
                  const isSpeaking = speakingWord === item.english;

                  let btnClass = "border-border bg-card hover:border-primary/50 text-foreground";
                  if (isMatched) btnClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 opacity-60";
                  else if (isSelected) {
                    btnClass = matchError
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-primary bg-primary/10 text-primary font-bold";
                  }

                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={isMatched ? -1 : 0}
                      aria-disabled={isMatched}
                      onClick={() => {
                        if (!isMatched) handleMatchClickEng(item.id);
                      }}
                      onKeyDown={(e) => {
                        if (!isMatched && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          handleMatchClickEng(item.id);
                        }
                      }}
                      className={`w-full p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-left flex items-center justify-between gap-2 break-words ${
                        isMatched ? "cursor-default" : "cursor-pointer"
                      } ${btnClass}`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak(item.english);
                          }}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer",
                            isSpeaking
                              ? "bg-primary text-primary-foreground shadow-2xs"
                              : "bg-muted/60 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          )}
                          title={`האזן להגייה: ${item.english}`}
                          aria-label={`האזן להגייה של ${item.english}`}
                        >
                          <Volume2 className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", isSpeaking && "animate-pulse")} />
                        </button>
                        <span className="break-words leading-tight notranslate" translate="no" lang="en">
                          {item.english}
                        </span>
                      </div>
                      {isMatched && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                    </div>
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
                      className={`w-full p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-right cursor-pointer flex items-center justify-between gap-1 break-words ${btnClass}`}
                    >
                      <span className="break-words leading-tight">{item.hebrew}</span>
                      {isMatched && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
