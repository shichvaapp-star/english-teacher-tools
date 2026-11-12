"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadSavedWords, saveWordToBuilder, normalizeVocabWord } from "@/lib/vocab-storage";
import {
  Check,
  Lightbulb,
  X,
  BookMarked,
  Volume2,
  Search,
  Plus,
  LifeBuoy,
} from "lucide-react";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";

export function WritingTaskCard({ c }: { c: WritingPracticeController }) {
  const {
    currentTask,
    dictQuery,
    dictResult,
    handleDictionarySearch,
    handleInsertText,
    handleSpeak,
    isPlayingAudio,
    isSearchingDict,
    savedWords,
    setDictQuery,
    setDrawerOpen,
    setSavedWords,
    setShowDictionary,
    setShowHint,
    setShowScaffold,
    showDictionary,
    showHint,
    showScaffold,
    user,
  } = c;
  return (
    <>
      {/* Clean Task Card */}
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary text-xs font-bold">
              <span className="text-base">{currentTask.emoji || "📝"}</span>
              <span>{currentTask.title}</span>
            </div>
            <Badge variant="outline" className="text-[11px] font-bold">
              יעד: {currentTask.targetWords}
            </Badge>
          </div>

          <CardTitle className="text-base sm:text-lg font-bold pt-1 text-right" dir="rtl">
            {currentTask.hebrewTitle}
          </CardTitle>

          <CardDescription
            className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans pt-1 notranslate"
            dir="ltr"
            translate="no"
            lang="en"
          >
            {currentTask.prompt}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-3 space-y-2.5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2" dir="rtl">
            <p className="text-muted-foreground leading-relaxed">
              <strong>הנחיה:</strong> {currentTask.hebrewInstructions}
            </p>

            {/* Quick Assistance Actions */}
            <div className="flex items-center gap-2 shrink-0" dir="ltr">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSpeak(`${currentTask.title}. ${currentTask.prompt}`)}
                className="h-7 text-xs gap-1.5 cursor-pointer border-border"
                title="Listen to instructions in English"
              >
                <Volume2 className={`h-3.5 w-3.5 ${isPlayingAudio ? "text-primary animate-pulse" : ""}`} />
                <span>Listen</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowHint((prev) => !prev)}
                className="h-7 text-xs gap-1 cursor-pointer text-amber-600 dark:text-amber-400"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span>רעיון</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDictionary((prev) => !prev)}
                className="h-7 text-xs gap-1 cursor-pointer text-primary"
              >
                <Search className="h-3.5 w-3.5" />
                <span>מילון</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSavedWords(loadSavedWords(user?.id));
                  setDrawerOpen(true);
                }}
                className="h-7 text-xs gap-1 cursor-pointer text-primary"
                title="פנקס מילים"
              >
                <BookMarked className="h-3.5 w-3.5" />
                <span>פנקס מילים</span>
                {savedWords.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-primary text-primary-foreground rounded-full text-[10px] font-bold">
                    {savedWords.length}
                  </span>
                )}
              </Button>

              <Button
                type="button"
                variant={showScaffold ? "default" : "outline"}
                size="sm"
                onClick={() => setShowScaffold((prev) => !prev)}
                className={`h-7 text-xs gap-1 cursor-pointer font-bold transition-all ${
                  showScaffold
                    ? "bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                    : "border-amber-500/50 text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                }`}
                title="קשה לי? בוא נבנה משפט יחד מעברית לאנגלית"
              >
                <LifeBuoy className="h-3.5 w-3.5" />
                <span>קשה לי</span>
              </Button>
            </div>
          </div>

          {/* Hint Box (if opened) */}
          {showHint && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between animate-in fade-in" dir="rtl">
              <span>💡 טיפ לרעיון: ענו על השאלה &quot;מה הדבר הראשון שאתם חושבים עליו בנושא זה?&quot;</span>
              <button onClick={() => setShowHint(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Quick Inline Dictionary (if opened) */}
          {showDictionary && (
            <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2 animate-in fade-in" dir="rtl">
              <div className="flex gap-1.5">
                <Input
                  type="text"
                  value={dictQuery}
                  onChange={(e) => setDictQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDictionarySearch()}
                  placeholder="הקלידו מילה לתרגום..."
                  className="h-8 text-xs bg-background"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleDictionarySearch}
                  disabled={isSearchingDict || !dictQuery.trim()}
                  className="h-8 text-xs px-3 cursor-pointer shrink-0"
                >
                  {isSearchingDict ? "מחפש..." : "תרגם"}
                </Button>
              </div>

              {dictResult && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="font-bold text-foreground ltr">{dictResult.english}</span>
                    <span className="text-muted-foreground mr-1">({dictResult.hebrew})</span>
                  </div>
                  {dictResult.hebrew !== "לא נמצא תרגום" && dictResult.hebrew !== "שגיאה בחיפוש" && (
                    <div className="flex items-center gap-1.5">
                      {savedWords.some(
                        (w) => normalizeVocabWord(w.english) === normalizeVocabWord(dictResult.english)
                      ) ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-1.5">
                          <Check className="h-3 w-3" />
                          <span>נשמר בפנקס</span>
                        </span>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            saveWordToBuilder(
                              {
                                english: dictResult.english,
                                hebrew: dictResult.hebrew,
                                level: "Personal Word",
                                sourceType: "writing",
                                sourceTitle: currentTask.title,
                                sourceCategory: currentTask.category,
                              },
                              user?.id
                            );
                            setSavedWords(loadSavedWords(user?.id));
                          }}
                          className="h-6 text-[11px] gap-1 cursor-pointer text-muted-foreground hover:text-foreground"
                          title="שמור לפנקס המילים"
                        >
                          <BookMarked className="h-3 w-3 text-primary" />
                          <span>שמור לפנקס</span>
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleInsertText(dictResult.english)}
                        className="h-6 text-[11px] gap-1 cursor-pointer text-primary"
                      >
                        <Plus className="h-3 w-3" />
                        <span>הוסף לחיבור</span>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
