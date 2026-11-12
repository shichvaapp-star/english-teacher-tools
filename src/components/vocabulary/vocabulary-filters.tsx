"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Star,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCheck,
} from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularyFilters({ c }: { c: VocabularyPracticeController }) {
  const {
    activeCategory,
    availableExercises,
    exerciseFilter,
    exercisesForCurrentSource,
    filterOption,
    setCardIndex,
    setExerciseFilter,
    setFilterOption,
    setSortOption,
    setSourceFilter,
    sortOption,
    sourceFilter,
    wordStats,
  } = c;
  return (
    <>
      {/* Sorting & Status Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 print:hidden bg-card/60 backdrop-blur-xs p-2.5 rounded-xl border border-border/70" dir="rtl">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 text-xs">
          <span className="text-[11px] font-medium text-muted-foreground ml-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            <span>סינון:</span>
          </span>

          <button
            type="button"
            onClick={() => {
              setFilterOption("all");
              setCardIndex(0);
            }}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0",
              filterOption === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            הכל ({wordStats.total})
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterOption("starred");
              setCardIndex(0);
            }}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1",
              filterOption === "starred"
                ? "bg-amber-500 text-white font-semibold shadow-2xs"
                : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Star className={cn("h-3 w-3", filterOption === "starred" ? "fill-white" : "fill-amber-400 text-amber-500")} />
            <span>מועדפים ({wordStats.starred})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterOption("unlearned");
              setCardIndex(0);
            }}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1",
              filterOption === "unlearned"
                ? "bg-orange-500 text-white font-semibold shadow-2xs"
                : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <span>⏳ לתרגול ({wordStats.unlearned})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterOption("learned");
              setCardIndex(0);
            }}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1",
              filterOption === "learned"
                ? "bg-emerald-600 text-white font-semibold shadow-2xs"
                : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>נלמדו ({wordStats.learned})</span>
          </button>
        </div>

        {/* Source Filter, Specific Exercise Filter & Sort Selector */}
        <div className="flex flex-wrap items-center gap-2 text-xs mr-auto">
          {activeCategory === "saved" && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-muted-foreground">מקור:</span>
                <select
                  value={exerciseFilter !== "all" ? `exercise::${exerciseFilter}` : sourceFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.startsWith("exercise::")) {
                      const exKey = val.replace(/^exercise::/, "");
                      const matchedEx = availableExercises.find((ex) => ex.key === exKey);
                      setSourceFilter(matchedEx ? matchedEx.sourceType : "all");
                      setExerciseFilter(exKey);
                    } else {
                      setSourceFilter(val);
                      setExerciseFilter("all");
                    }
                    setCardIndex(0);
                  }}
                  className="h-8 px-2.5 py-1 rounded-lg border border-border bg-background text-xs text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary font-medium max-w-[230px]"
                >
                  <option value="all">כל המקורות</option>
                  <option value="unseen">📖 כל קטעי הקריאה (אנסין)</option>
                  <option value="writing">✍️ כל סדנת הכתיבה</option>
                  <option value="tutor">🤖 המורה דוד</option>
                  <option value="manual">✏️ הזנה ידנית</option>
                  {availableExercises.some((ex) => ex.sourceType === "unseen") && (
                    <optgroup label="📖 בחירת תרגיל אנסין ספציפי">
                      {availableExercises
                        .filter((ex) => ex.sourceType === "unseen")
                        .map((ex) => (
                          <option key={ex.key} value={`exercise::${ex.key}`}>
                            📖 {ex.shortLabel} ({ex.count} מילים)
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {availableExercises.some((ex) => ex.sourceType === "writing") && (
                    <optgroup label="✍️ בחירת משימת כתיבה ספציפית">
                      {availableExercises
                        .filter((ex) => ex.sourceType === "writing")
                        .map((ex) => (
                          <option key={ex.key} value={`exercise::${ex.key}`}>
                            ✍️ {ex.shortLabel} ({ex.count} מילים)
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {availableExercises.some((ex) => ex.sourceType === "conversation") && (
                    <optgroup label="💬 בחירת שיחה מהחיים ספציפית">
                      {availableExercises
                        .filter((ex) => ex.sourceType === "conversation")
                        .map((ex) => (
                          <option key={ex.key} value={`exercise::${ex.key}`}>
                            💬 {ex.shortLabel} ({ex.count} מילים)
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {availableExercises.some((ex) => ex.sourceType === "tutor") && (
                    <optgroup label="🤖 בחירת תרגול עם המורה דוד">
                      {availableExercises
                        .filter((ex) => ex.sourceType === "tutor")
                        .map((ex) => (
                          <option key={ex.key} value={`exercise::${ex.key}`}>
                            🤖 {ex.shortLabel} ({ex.count} מילים)
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {exercisesForCurrentSource.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">תרגיל:</span>
                  <select
                    value={exerciseFilter}
                    onChange={(e) => {
                      setExerciseFilter(e.target.value);
                      setCardIndex(0);
                    }}
                    className="h-8 px-2.5 py-1 rounded-lg border border-primary/40 bg-primary/5 text-xs text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary font-semibold max-w-[240px]"
                  >
                    <option value="all">
                      כל התרגילים ({exercisesForCurrentSource.length})
                    </option>
                    {exercisesForCurrentSource.map((ex) => (
                      <option key={ex.key} value={ex.key}>
                        {ex.displayLabel} ({ex.count} מילים)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" />
              <span>מיון:</span>
            </span>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value as typeof sortOption);
                setCardIndex(0);
              }}
              className="h-8 px-2.5 py-1 rounded-lg border border-border bg-background text-xs text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              <option value="starred_first">⭐ מועדפים תחילה</option>
              <option value="source_type">📂 לפי מקור (סוג טקסט / כלי)</option>
              <option value="source_title">📖 לפי שם הטקסט / משימה</option>
              <option value="alpha_asc">🔤 באנגלית (A-Z)</option>
              <option value="alpha_desc">🔤 באנגלית (Z-A)</option>
              <option value="hebrew_asc">🇮🇱 בעברית (א-ת)</option>
              <option value="unlearned_first">⏳ דורש תרגול תחילה</option>
              <option value="learned_first">✓ נלמדו תחילה</option>
              <option value="newest">🕒 נוספו לאחרונה</option>
            </select>
          </div>
        </div>
      </div>

      {/* Specific Exercise Quick-Filter Pills Bar */}
      {activeCategory === "saved" && exercisesForCurrentSource.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-1.5 print:hidden bg-primary/5 px-3 py-2 rounded-xl border border-primary/20 text-xs"
          dir="rtl"
        >
          <span className="text-[11px] font-bold text-primary ml-1 shrink-0">
            🎯 תרגול מילים מתוך תרגיל ספציפי:
          </span>
          <button
            type="button"
            onClick={() => {
              setExerciseFilter("all");
              setCardIndex(0);
            }}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer shrink-0",
              exerciseFilter === "all"
                ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
            )}
          >
            כל התרגילים ({exercisesForCurrentSource.reduce((acc, ex) => acc + ex.count, 0)})
          </button>
          {exercisesForCurrentSource.map((ex) => (
            <button
              key={ex.key}
              type="button"
              onClick={() => {
                setExerciseFilter(exerciseFilter === ex.key ? "all" : ex.key);
                setCardIndex(0);
              }}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1 max-w-[260px]",
                exerciseFilter === ex.key
                  ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                  : "bg-background hover:bg-muted text-foreground/90 border border-border/60"
              )}
              title={`${ex.displayLabel} (${ex.count} מילים)`}
            >
              <span className="truncate">{ex.displayLabel}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0 rounded-full shrink-0",
                  exerciseFilter === ex.key
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {ex.count}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
