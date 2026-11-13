"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookMarked,
  Volume2,
  Pause,
  Info,
  Printer,
  Check,
  ArrowRight,
} from "lucide-react";
import { lookupSavedVocabForWord, InteractiveEnglishText } from "@/components/unseen/unseen-helpers";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenPassageColumn({ c }: { c: UnseenPracticeController }) {
  const {
    activeQuestion,
    activeQuestionIndex,
    currentStory,
    fontSize,
    handlePassageSelectionUp,
    handleWordClick,
    mobileTab,
    mode,
    passageContainerRef,
    savedVocabMap,
    setFontSize,
    setMobileTab,
    setShowPrintModal,
    speech,
  } = c;
  return (
    <>
      {/* Reading Passage Column (7 Cols on desktop, conditioned on mobile) */}
      <div className={`lg:col-span-7 space-y-4 ${mobileTab === "text" ? "block" : "hidden lg:block"}`}>
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="border-b border-border/50 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {currentStory.level}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  10 Questions • 100 Pts
                </Badge>
                {mode === "graded" && (
                  <Badge variant="destructive" className="text-[10px] animate-pulse">
                    Exam Mode
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 print:hidden">
                {/* Font Scaling */}
                <div className="flex items-center border border-border rounded-md text-xs overflow-hidden">
                  <button
                    onClick={() => setFontSize("sm")}
                    className={`px-2 py-1 ${fontSize === "sm" ? "bg-accent font-bold" : "hover:bg-muted"}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize("base")}
                    className={`px-2 py-1 ${fontSize === "base" ? "bg-accent font-bold" : "hover:bg-muted"}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize("lg")}
                    className={`px-2 py-1 ${fontSize === "lg" ? "bg-accent font-bold" : "hover:bg-muted"}`}
                  >
                    A+
                  </button>
                </div>

                {/* Speech TTS */}
                <Button
                  variant={speech.isActive && speech.isPlaying ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (!speech.isActive) {
                      speech.startPlayer();
                    } else {
                      speech.togglePlayPause();
                    }
                  }}
                  className="cursor-pointer gap-1.5 text-xs font-semibold"
                  title={
                    speech.isActive
                      ? speech.isPlaying
                        ? "Pause dictation [Space] (השהה)"
                        : "Resume dictation [Space] (המשך)"
                      : "Listen to story with natural voice [Space] (האזן לקטע)"
                  }
                >
                  {speech.isActive && speech.isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5 fill-current animate-pulse" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-primary" />
                      <span className="hidden sm:inline">
                        {speech.isActive ? "Resume" : "Listen"}
                      </span>
                    </>
                  )}
                </Button>

                {/* Print Booklet */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrintModal(true)}
                  className="cursor-pointer gap-1 text-xs"
                  title="Print exam booklet"
                >
                  <Printer className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
              </div>
            </div>

            <div className="mt-2">
              {(() => {
                const titleSentence = speech.sentences.find((s) => s.paragraphIndex === -1);
                const isTitleSpoken =
                  titleSentence !== undefined &&
                  speech.isActive &&
                  speech.currentSentenceIndex === titleSentence.globalIndex;
                return (
                  <CardTitle
                    id={titleSentence ? `unseen-speech-sentence-${titleSentence.globalIndex}` : undefined}
                    onClick={() => {
                      if (speech.isActive && titleSentence) {
                        speech.seekSentence(titleSentence.globalIndex);
                      }
                    }}
                    className={`text-xl font-bold tracking-tight notranslate inline-block rounded transition-all duration-200 ${
                      isTitleSpoken
                        ? "bg-primary/20 text-foreground ring-2 ring-primary/50 px-1.5 py-0.5 shadow-xs"
                        : speech.isActive && titleSentence
                        ? "hover:bg-primary/10 px-1 cursor-pointer"
                        : ""
                    }`}
                    title={speech.isActive ? "Click title to play from the beginning" : undefined}
                    translate="no"
                    lang="en"
                  >
                    <InteractiveEnglishText
                      text={currentStory.title}
                      onWordClick={handleWordClick}
                      savedVocabMap={savedVocabMap}
                      stopEventPropagation
                    />
                  </CardTitle>
                );
              })()}
              <p className="text-sm text-muted-foreground mt-0.5">{currentStory.hebrewTitle}</p>
            </div>

            <div className="p-2 rounded-lg bg-muted/40 text-[11px] text-muted-foreground flex items-center gap-2 mt-2 print:hidden">
              <Info className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                💡 <strong>טיפ בלשים:</strong> לחצו על <strong>כל מילה</strong> לתרגום מיידי, או <strong>סמנו (הדגישו) משפט או קטע</strong> בטקסט כדי להקריא בקול או לתרגם רק את החלק שבחרתם!
              </span>
            </div>
          </CardHeader>

          {/* Story Paragraphs */}
          <CardContent
            ref={passageContainerRef}
            onMouseUp={handlePassageSelectionUp}
            onTouchEnd={handlePassageSelectionUp}
            onKeyUp={handlePassageSelectionUp}
            className="pt-4 space-y-4 notranslate"
            translate="no"
            lang="en"
          >
            {currentStory.paragraphs.map((para, pIdx) => {
              const isHighlighted =
                activeQuestion &&
                (activeQuestion.paragraphIndex === pIdx ||
                  activeQuestion.paragraphIndex === -1 ||
                  activeQuestion.paragraphIndex >= currentStory.paragraphs.length);

              const textSizeClass =
                fontSize === "sm"
                  ? "text-sm leading-relaxed"
                  : fontSize === "lg"
                  ? "text-lg leading-loose"
                  : "text-base leading-relaxed";

              const paraSentences = speech.sentences.filter((s) => s.paragraphIndex === pIdx);

              return (
                <div
                  key={pIdx}
                  className={`relative p-3.5 rounded-xl border transition-colors ${
                    isHighlighted
                      ? "border-primary/40 bg-primary/5 shadow-xs"
                      : "border-border/30 hover:border-border/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Paragraph [{pIdx + 1}]
                    </span>
                  </div>

                  <p className={`${textSizeClass} text-foreground/90 font-sans tracking-wide leading-relaxed`}>
                    {paraSentences.length > 0 ? (
                      paraSentences.map((sObj) => {
                        const isSpoken =
                          speech.isActive && speech.currentSentenceIndex === sObj.globalIndex;

                        return (
                          <span
                            key={sObj.id}
                            id={`unseen-speech-sentence-${sObj.globalIndex}`}
                            onClick={() => {
                              if (typeof window !== "undefined") {
                                const sel = window.getSelection();
                                if (sel && !sel.isCollapsed && sel.toString().trim().length > 1) {
                                  return;
                                }
                              }
                              if (speech.isActive) {
                                speech.seekSentence(sObj.globalIndex);
                              }
                            }}
                            className={`inline rounded transition-all duration-200 ${
                              isSpoken
                                ? "bg-primary/20 text-foreground font-semibold ring-2 ring-primary/50 px-1 py-0.5 rounded shadow-xs"
                                : speech.isActive
                                ? "hover:bg-primary/10 rounded px-0.5 cursor-pointer"
                                : ""
                            }`}
                            title={speech.isActive ? "Click sentence to play from here" : undefined}
                          >
                            <InteractiveEnglishText
                              text={sObj.text}
                              onWordClick={handleWordClick}
                              savedVocabMap={savedVocabMap}
                              stopEventPropagation
                            />
                            {" "}
                          </span>
                        );
                      })
                    ) : (
                      <InteractiveEnglishText
                        text={para}
                        onWordClick={handleWordClick}
                        savedVocabMap={savedVocabMap}
                      />
                    )}
                  </p>
                </div>
              );
            })}

            {/* Vocabulary Hints footer */}
            {currentStory.vocabularyHints && currentStory.vocabularyHints.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                  <BookMarked className="h-3.5 w-3.5 text-primary" />
                  <span>Vocabulary Helpers (אוצר מילים בטקסט):</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentStory.vocabularyHints.map((hint, hIdx) => {
                    const isHintSaved = Boolean(lookupSavedVocabForWord(hint.word, savedVocabMap));
                    return (
                      <button
                        key={hIdx}
                        type="button"
                        onClick={() => handleWordClick(hint.word)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition cursor-pointer ${
                          isHintSaved
                            ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                            : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        {isHintSaved && <Check className="h-3 w-3 text-primary shrink-0" />}
                        <span className="font-medium">{hint.word}</span>
                        <span className="text-muted-foreground">&bull;</span>
                        <span>{hint.translation}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mobile-only action button to jump to questions */}
        <div className="lg:hidden pt-1">
          <Button
            onClick={() => setMobileTab("questions")}
            className="w-full gap-2 font-bold text-xs h-10 cursor-pointer shadow-xs"
          >
            <span>מעבר לשאלות ({activeQuestionIndex + 1}/10)</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
