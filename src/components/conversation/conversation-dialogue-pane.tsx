"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookMarked,
  Volume2,
  Pause,
  Info,
  Printer,
  Languages,
} from "lucide-react";
import { InteractiveEnglishText } from "@/components/conversation/conversation-helpers";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";

export function ConversationDialoguePane({ c }: { c: ConversationPracticeController }) {
  const {
    activeQuestion,
    activeQuestionIndex,
    currentScenario,
    dialogueContainerRef,
    dialoguePlayer,
    fontSize,
    handlePassageSelectionUp,
    handleTranslateSelection,
    handleWordClick,
    mobileTab,
    setFontSize,
    setMobileTab,
  } = c;
  return (
    <>
      {/* LEFT PANE: INTERACTIVE DIALOGUE TRANSCRIPT (7 cols) */}
      <div
        className={`lg:col-span-7 space-y-4 ${
          mobileTab === "text" ? "block" : "hidden lg:block"
        }`}
      >
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {currentScenario.level}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentScenario.categoryLabelHebrew}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 print:hidden">
                {/* Font size controls */}
                <div className="flex items-center rounded-lg border border-border/60 p-0.5 bg-muted/30">
                  {(["sm", "base", "lg"] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`px-2 py-0.5 text-2xs rounded-md transition cursor-pointer ${
                        fontSize === sz
                          ? "bg-primary text-primary-foreground font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {sz === "sm" ? "A-" : sz === "base" ? "A" : "A+"}
                    </button>
                  ))}
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant={dialoguePlayer.isPlaying ? "default" : "outline"}
                  onClick={() => {
                    if (!dialoguePlayer.isActive) {
                      dialoguePlayer.startDialogue();
                    } else {
                      dialoguePlayer.togglePlayPause();
                    }
                  }}
                  className="h-8 text-xs font-bold gap-1.5 cursor-pointer"
                >
                  {dialoguePlayer.isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>השהה שיחה</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-primary" />
                      <span>האזן לשיחה (2 קולות)</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="h-8 text-xs gap-1 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
              </div>
            </div>

            <div className="mt-2">
              <CardTitle className="text-xl font-bold tracking-tight" dir="ltr">
                <InteractiveEnglishText
                  text={currentScenario.title}
                  onWordClick={handleWordClick}
                />
              </CardTitle>
              <p className="text-sm text-primary font-medium mt-0.5" dir="rtl">
                {currentScenario.hebrewTitle}
              </p>
            </div>

            {/* Scenario Setting & Sides of Conversation Banner */}
            <div
              className="mt-3 p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs text-foreground space-y-2.5"
              dir="ltr"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2">
                <span className="font-bold text-muted-foreground uppercase tracking-wider text-2xs flex items-center gap-1.5">
                  <span>📍 Setting:</span>
                  <span className="normal-case font-normal text-foreground">
                    <InteractiveEnglishText
                      text={currentScenario.settingDescription}
                      onWordClick={handleWordClick}
                    />
                  </span>
                </span>
              </div>

              {/* Sides of the Conversation Legend */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-2xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Sides of the dialogue:
                </span>
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {/* Side A Chip */}
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/40 text-sky-900 dark:text-sky-100 font-medium shadow-2xs">
                    <span className="text-base">{currentScenario.speakers[0]?.avatarEmoji || "🗣️"}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-3xs font-black uppercase tracking-wide bg-sky-500/25 text-sky-800 dark:text-sky-200">
                        🔵 Side A
                      </span>
                      <strong className="font-bold text-xs">{currentScenario.speakers[0]?.name}</strong>
                      <span className="text-3xs text-muted-foreground">({currentScenario.speakers[0]?.role})</span>
                    </div>
                  </div>

                  <span className="text-muted-foreground text-xs font-bold">↔️</span>

                  {/* Side B Chip */}
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-100 font-medium shadow-2xs">
                    <span className="text-base">{currentScenario.speakers[1]?.avatarEmoji || "🗣️"}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-3xs font-black uppercase tracking-wide bg-emerald-500/25 text-emerald-800 dark:text-emerald-200">
                        🟢 Side B
                      </span>
                      <strong className="font-bold text-xs">{currentScenario.speakers[1]?.name}</strong>
                      <span className="text-3xs text-muted-foreground">({currentScenario.speakers[1]?.role})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-2 rounded-lg bg-muted/40 text-2xs text-muted-foreground flex items-center gap-2 mt-2 print:hidden"
              dir="rtl"
            >
              <Info className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                💡 <strong>טיפ שיחה:</strong> לחצו על <strong>כל מילה</strong> לתרגום מיידי,{" "}
                <strong>סמנו ביטוי או משפט</strong> לתרגום מלא, או לחצו על רמקול ליד כל שורה כדי לשמוע איך הוגים אותה!
              </span>
            </div>
          </CardHeader>

          {/* Dialogue Turns (Chat Bubbles) */}
          <CardContent
            ref={dialogueContainerRef}
            onMouseUp={handlePassageSelectionUp}
            onTouchEnd={handlePassageSelectionUp}
            onKeyUp={handlePassageSelectionUp}
            className="pt-4 space-y-3 notranslate"
            translate="no"
            lang="en"
          >
            {currentScenario.turns.map((turn, tIdx) => {
              const speaker =
                currentScenario.speakers.find((s) => s.id === turn.speakerId) ||
                currentScenario.speakers[tIdx % 2];
              const isSpeakerA = speaker?.id === currentScenario.speakers[0]?.id;
              const isSpokenNow =
                dialoguePlayer.isActive && dialoguePlayer.currentTurnIndex === tIdx;
              const isQuestionTarget =
                activeQuestion && activeQuestion.turnRefIndex === tIdx;

              const textSizeClass =
                fontSize === "sm"
                  ? "text-sm leading-relaxed"
                  : fontSize === "lg"
                  ? "text-lg leading-loose"
                  : "text-base leading-relaxed";

              return (
                <div
                  key={tIdx}
                  id={`dialogue-turn-${tIdx}`}
                  className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    /* Left/Right indentation to create an authentic chat messenger zigzag */
                    isSpeakerA
                      ? "mr-3 sm:mr-10 md:mr-14 rounded-tl-xs border-l-4 border-l-sky-500"
                      : "ml-3 sm:ml-10 md:ml-14 rounded-tr-xs border-r-4 border-r-emerald-500"
                  } ${
                    isSpokenNow
                      ? isSpeakerA
                        ? "border-sky-500 bg-sky-500/20 ring-2 ring-sky-500/50 shadow-md"
                        : "border-emerald-500 bg-emerald-500/20 ring-2 ring-emerald-500/50 shadow-md"
                      : isQuestionTarget
                      ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/40 shadow-xs"
                      : isSpeakerA
                      ? "border-sky-500/30 dark:border-sky-500/35 bg-sky-500/[0.05] dark:bg-sky-500/[0.10] hover:border-sky-500/50 shadow-2xs"
                      : "border-emerald-500/30 dark:border-emerald-500/35 bg-emerald-500/[0.05] dark:bg-emerald-500/[0.10] hover:border-emerald-500/50 shadow-2xs"
                  }`}
                >
                  {/* Avatar & Line Indicator */}
                  <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                    <div
                      className={`h-10 w-10 rounded-2xl flex items-center justify-center text-xl shadow-xs transition-transform ${
                        isSpeakerA
                          ? "bg-sky-500/15 text-sky-800 dark:text-sky-200 ring-2 ring-sky-500/30 border border-sky-500/40"
                          : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/30 border border-emerald-500/40"
                      } ${isSpokenNow ? "scale-110 animate-pulse" : ""}`}
                    >
                      {speaker?.avatarEmoji || (isSpeakerA ? "👤" : "👥")}
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-3xs font-black uppercase tracking-wider border ${
                        isSpeakerA
                          ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      Line {tIdx + 1}
                    </span>
                  </div>

                  {/* Bubble Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {/* Prominent Side & Speaker Badge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-2xs font-bold border ${
                            isSpeakerA
                              ? "bg-sky-500/15 text-sky-900 dark:text-sky-100 border-sky-500/35"
                              : "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100 border-emerald-500/35"
                          }`}
                        >
                          <span className="font-extrabold">
                            {isSpeakerA ? "🔵 Side A" : "🟢 Side B"}
                          </span>
                          <span>&bull;</span>
                          <span className="font-black">{speaker?.name}</span>
                        </span>

                        <span className="text-2xs text-muted-foreground font-medium">
                          ({speaker?.role})
                        </span>

                        {turn.stageDirection && (
                          <span className="text-2xs italic text-muted-foreground px-2 py-0.5 rounded-md bg-background/70 border border-border/50">
                            {turn.stageDirection}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons: Translate & Audio */}
                      <div className="flex items-center gap-1 shrink-0 print:hidden">
                        <button
                          type="button"
                          onClick={() => handleTranslateSelection(turn.text)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            isSpeakerA
                              ? "text-sky-700 dark:text-sky-300 hover:bg-sky-500/15"
                              : "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15"
                          }`}
                          title="תרגם שורה זו לעברית"
                          aria-label="תרגם שורה זו"
                        >
                          <Languages className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => dialoguePlayer.playSingleTurn(tIdx)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            isSpokenNow && dialoguePlayer.isPlaying
                              ? isSpeakerA
                                ? "bg-sky-600 text-white shadow-xs"
                                : "bg-emerald-600 text-white shadow-xs"
                              : isSpeakerA
                              ? "text-sky-700 dark:text-sky-300 hover:bg-sky-500/15"
                              : "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15"
                          }`}
                          title="האזן לשורה זו"
                          aria-label="האזן לשורה זו"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Spoken Text */}
                    <p className={`${textSizeClass} text-foreground font-sans pt-0.5 leading-relaxed`}>
                      <InteractiveEnglishText
                        text={turn.text}
                        onWordClick={handleWordClick}
                      />
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Useful Real-Life Phrases Box */}
            {currentScenario.usefulPhrases && currentScenario.usefulPhrases.length > 0 && (
              <div className="mt-5 pt-4 border-t border-border/50" dir="rtl">
                <p className="text-xs font-bold text-foreground mb-2.5 flex items-center gap-1.5">
                  <BookMarked className="h-4 w-4 text-amber-500" />
                  <span>Useful Real-Life Phrases (ביטויים שימושיים מהשיחה - לחצו לתרגום ושמירה):</span>
                </p>
                <div className="flex flex-wrap gap-2" dir="ltr">
                  {currentScenario.usefulPhrases.map((item, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleTranslateSelection(item.phrase)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs hover:bg-amber-500/20 transition cursor-pointer"
                    >
                      <span className="font-bold text-foreground">{item.phrase}</span>
                      <span className="text-muted-foreground">&bull;</span>
                      <span className="text-primary font-medium" dir="rtl">
                        {item.translation}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mobile button to jump to questions */}
        <div className="lg:hidden">
          <Button
            onClick={() => setMobileTab("questions")}
            className="w-full gap-2 font-bold text-xs h-10 cursor-pointer"
          >
            <span>מעבר לשאלות ({activeQuestionIndex + 1}/10)</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
