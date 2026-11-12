"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadSavedWords, saveWordToBuilder, normalizeVocabWord } from "@/lib/vocab-storage";
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  X,
  BookMarked,
  Volume2,
  Search,
  Plus,
  LifeBuoy,
  Loader2,
} from "lucide-react";
import { renderBiDiText } from "@/components/writing/writing-helpers";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";

export function WritingEditor({ c }: { c: WritingPracticeController }) {
  const {
    copied,
    currentTask,
    dictQuery,
    dictResult,
    essayText,
    fontSize,
    handleCopy,
    handleDictionarySearch,
    handleInsertScaffoldedSentence,
    handleInsertText,
    handleScaffoldSubmit,
    handleSpeak,
    isPlayingAudio,
    isScaffolding,
    isSearchingDict,
    isWordCountGood,
    isWordCountMinReached,
    savedWords,
    scaffoldError,
    scaffoldInput,
    scaffoldInserted,
    scaffoldResult,
    setDictQuery,
    setEssayText,
    setFontSize,
    setSavedWords,
    setScaffoldInput,
    setScaffoldResult,
    setShowScaffold,
    setSubmissionSuccess,
    showScaffold,
    user,
    wordCount,
  } = c;
  return (
    <>
      {/* Core Writing Area: SINGLE TEXT BOX */}
      <div className="space-y-2">
        {/* Word Count Header Strip */}
        <div
          className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-card text-xs shadow-2xs"
          dir="rtl"
        >
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-semibold">ספירת מילים:</span>
            <span
              className={`font-black text-sm ${
                isWordCountGood
                  ? "text-emerald-600 dark:text-emerald-400"
                  : isWordCountMinReached
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-foreground"
              }`}
            >
              {wordCount}
            </span>
            <span className="text-muted-foreground">/ {currentTask.targetWords}</span>
            {isWordCountGood && (
              <Badge variant="default" className="text-[10px] bg-emerald-600 text-white font-bold">
                ✓ יעד הושג! 🎉
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mr-auto" dir="ltr">
            <Button
              type="button"
              variant={showScaffold ? "default" : "outline"}
              size="sm"
              onClick={() => setShowScaffold((prev) => !prev)}
              className={`h-7 text-xs gap-1.5 cursor-pointer font-bold transition-all ${
                showScaffold
                  ? "bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                  : "border-amber-500/50 text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
              }`}
              title="קשה לי? בוא נבנה משפט צעד אחר צעד מעברית לאנגלית"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              <span>קשה לי</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSpeak(essayText)}
              disabled={!essayText.trim() || isPlayingAudio}
              className="h-7 text-xs gap-1 cursor-pointer"
              title="הקשיבו לחיבור שלכם בקול באנגלית"
            >
              <Volume2 className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">הקרא טקסט</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!essayText.trim()}
              className="h-7 text-xs gap-1 cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copied ? "הועתק" : "העתק"}</span>
            </Button>

            {/* Font Size Selector */}
            <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/30">
              <button
                type="button"
                onClick={() => setFontSize("sm")}
                className={`px-1.5 py-0.5 text-[10px] rounded transition cursor-pointer ${
                  fontSize === "sm" ? "bg-background font-bold shadow-2xs" : "text-muted-foreground"
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize("base")}
                className={`px-1.5 py-0.5 text-[10px] rounded transition cursor-pointer ${
                  fontSize === "base" ? "bg-background font-bold shadow-2xs" : "text-muted-foreground"
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("lg")}
                className={`px-1.5 py-0.5 text-[10px] rounded transition cursor-pointer ${
                  fontSize === "lg" ? "bg-background font-bold shadow-2xs" : "text-muted-foreground"
                }`}
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* SCAFFOLDING ASSISTANT CARD ("קשה לי") */}
        {showScaffold && (
          <div
            className="rounded-2xl border-2 border-amber-500/40 bg-card p-4 sm:p-5 shadow-sm space-y-4 animate-in fade-in"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                  <LifeBuoy className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                      עוזר כתיבה אישי: איך לנסח משפט באנגלית
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-amber-500/40 text-amber-700 dark:text-amber-400 font-semibold"
                    >
                      מעברית לאנגלית
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    תקועים? כתבו מה שרציתם לומר בעברית, ונראה לכם איך להרכיב את המשפט באנגלית שלב אחר שלב.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowScaffold(false)}
                className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Input Field */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={scaffoldInput}
                  onChange={(e) => setScaffoldInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScaffoldSubmit()}
                  placeholder="לדוגמה: אני מעדיף גלידה כי אני אוהב מתוק..."
                  className="text-sm bg-background h-10"
                  dir="rtl"
                />
                <Button
                  type="button"
                  onClick={handleScaffoldSubmit}
                  disabled={isScaffolding || !scaffoldInput.trim()}
                  className="h-10 px-4 text-xs font-bold gap-1.5 cursor-pointer bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                >
                  {isScaffolding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>בונה משפט...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>בנה לי משפט ✨</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                המלצה: התמקדו במשפט או רעיון אחד בכל פעם כדי להבין היטב את המבנה.
              </p>
              {scaffoldError && (
                <div className="text-xs text-destructive flex items-center gap-1.5 pt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{scaffoldError}</span>
                </div>
              )}
            </div>

            {/* Scaffolding Results */}
            {scaffoldResult && (
              <div className="space-y-4 pt-1 animate-in fade-in">
                {/* Section 1: Assembled English Sentence */}
                <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <span>✨ המשפט המוכן באנגלית:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSpeak(scaffoldResult.fullSentence)}
                        disabled={isPlayingAudio}
                        className="h-7 text-xs px-2 gap-1 cursor-pointer"
                        title="הקרא את המשפט באנגלית"
                      >
                        <Volume2 className="h-3.5 w-3.5 text-primary" />
                        <span>הקשב</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleInsertScaffoldedSentence(scaffoldResult.fullSentence)}
                        className="h-7 text-xs px-3 gap-1 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                      >
                        {scaffoldInserted ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>התווסף לחיבור!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            <span>הוסף לחיבור</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-base sm:text-lg font-bold text-foreground ltr text-left p-3 rounded-lg bg-card border border-border/80 shadow-2xs select-all">
                    {scaffoldResult.fullSentence}
                  </div>

                  {scaffoldResult.alternativeSentence && (
                    <div className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-border/50">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-foreground shrink-0">דרך נוספת:</span>
                        <span className="ltr text-left font-medium text-foreground/90 truncate">
                          &quot;{scaffoldResult.alternativeSentence}&quot;
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInsertScaffoldedSentence(scaffoldResult.alternativeSentence!)}
                        className="text-[11px] text-primary hover:underline font-bold cursor-pointer shrink-0 self-end sm:self-auto"
                      >
                        הוסף זו במקום
                      </button>
                    </div>
                  )}
                </div>

                {/* Section 2: Step-by-Step Breakdown */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground">
                    איך בנינו את המשפט? (פירוק צעד אחר צעד):
                  </span>
                  <div className="space-y-2">
                    {scaffoldResult.chunks.map((chunk, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-border/70 bg-card/90 space-y-2 text-right shadow-2xs"
                        dir="rtl"
                      >
                        {/* Line 1: Clear Translation Mapping */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-black shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {chunk.hebrew}
                          </span>
                          <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-base font-black text-primary ltr">
                            <bdi dir="ltr">{chunk.english}</bdi>
                          </span>
                        </div>

                        {/* Line 2: Dedicated Full-Width Pedagogical Tip */}
                        {chunk.explanation && (
                          <div
                            className="p-2.5 rounded-lg bg-muted/40 border border-border/50 text-xs leading-relaxed text-foreground/90 flex items-start gap-2 text-right"
                            dir="rtl"
                          >
                            <span className="text-amber-500 shrink-0 text-sm mt-0.5">💡</span>
                            <div className="text-right leading-relaxed min-w-0 flex-1">
                              <strong className="text-foreground ml-1">הסבר:</strong>
                              {renderBiDiText(chunk.explanation)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Built-In Inline Dictionary */}
                <div className="p-3 rounded-xl bg-card border border-border/80 space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-primary" />
                    <span>מילון מהיר מובנה: רוצים לבדוק או להחליף מילה בודדת?</span>
                  </span>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={dictQuery}
                      onChange={(e) => setDictQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleDictionarySearch()}
                      placeholder="הקלידו מילה בעברית או באנגלית (למשל: גלידה או sweet)..."
                      className="h-8 text-xs bg-background"
                      dir="rtl"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleDictionarySearch}
                      disabled={isSearchingDict || !dictQuery.trim()}
                      className="h-8 text-xs px-3 cursor-pointer shrink-0"
                    >
                      {isSearchingDict ? "מחפש..." : "תרגם מילה"}
                    </Button>
                  </div>
                  {dictResult && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
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

                {/* Section 4: Golden Rule */}
                {scaffoldResult.goldenRule && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2" dir="rtl">
                    <span className="shrink-0 text-base mt-0.5">📌</span>
                    <div className="leading-relaxed text-right min-w-0 flex-1">
                      <strong className="ml-1">כלל זהב של המורה:</strong>
                      {renderBiDiText(scaffoldResult.goldenRule)}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setScaffoldInput("");
                      setScaffoldResult(null);
                    }}
                    className="h-7 text-xs px-2.5 cursor-pointer"
                  >
                    משפט חדש
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowScaffold(false)}
                    className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    סגור עוזר
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SINGLE CLEAN TEXTAREA */}
        <textarea
          rows={12}
          placeholder="Start typing your writing here in English..."
          value={essayText}
          onChange={(e) => {
            setEssayText(e.target.value);
            setSubmissionSuccess(null);
          }}
          dir="ltr"
          translate="no"
          lang="en"
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          className={`w-full rounded-2xl border border-input bg-card p-4 leading-relaxed font-sans shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary notranslate ${
            fontSize === "sm" ? "text-sm" : fontSize === "lg" ? "text-lg" : "text-base"
          }`}
        />
      </div>
    </>
  );
}
