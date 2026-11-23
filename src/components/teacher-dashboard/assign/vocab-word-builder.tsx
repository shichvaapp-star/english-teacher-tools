"use client";

import React from "react";
import { gradeUnits } from "@/data/vocab/cards";
import { curriculumWords } from "@/lib/vocab-storage";
import { GRADE_LABELS as CLASS_GRADE_LABELS } from "@/lib/levels";
import { GRADE_LABELS, STANDARD_LEVEL_LABELS, VOCAB_GRADES } from "@/types/vocab-bank";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookA, Plus, Search, X } from "lucide-react";
import type { AssignTaskForm } from "@/components/teacher-dashboard/assign/use-assign-task-form";

/** Word list builder for a vocabulary assignment: banks / textbook units, chosen words, search, own words, title. */
/** `showSource={false}` hides the bank / textbook-unit chooser (the wizard asks that in earlier steps). */
export function VocabWordBuilder({ f, showSource = true }: { f: AssignTaskForm; showSource?: boolean }) {
  const {
    vocabGrade,
    vocabSourceMode,
    setVocabSourceMode,
    selectedBankGradeFilter,
    setSelectedBankGradeFilter,
    effectiveCustomBanks,
    filteredCustomBanks,
    selectedVocabWords,
    setSelectedVocabWords,
    vocabSearchQuery,
    setVocabSearchQuery,
    filteredVocabWordPool,
    customVocabEng,
    setCustomVocabEng,
    customVocabHeb,
    setCustomVocabHeb,
    customVocabExample,
    setCustomVocabExample,
    showAddCustomWord,
    setShowAddCustomWord,
    applyVocabPreset,
    applyCustomBank,
    handleToggleVocabWord,
    handleRemoveVocabWord,
    handleAddCustomWord,
    customTitle,
    setCustomTitle,
    customHebrewTitle,
    setCustomHebrewTitle,
  } = f;

  return (
    <div className="space-y-3 p-3.5 rounded-xl border border-success/30 bg-success/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <BookA className="h-4 w-4 text-success" />
          <span>אוצר מילים מוקצה למשימה:</span>
        </div>
        <Badge
          variant="outline"
          className={`text-2xs font-bold border-success/40 text-success bg-success/10 ${
            selectedVocabWords.length >= 4 ? "ring-1 ring-success/30" : ""
          }`}
        >
          {selectedVocabWords.length} מילים נבחרו
        </Badge>
      </div>

      {/* Bank Source Switch: Custom Banks vs Ministry Presets */}
      {showSource && (
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setVocabSourceMode("custom")}
                className={`px-2.5 py-1 rounded-lg text-2xs font-bold cursor-pointer transition-colors ${
                  vocabSourceMode === "custom"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                מאגרי המילים שלי ({effectiveCustomBanks.length})
              </button>
              <button
                type="button"
                onClick={() => setVocabSourceMode("ministry")}
                className={`px-2.5 py-1 rounded-lg text-2xs font-bold cursor-pointer transition-colors ${
                  vocabSourceMode === "ministry"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                ערכות משרד החינוך (Bands I-III)
              </button>
            </div>
          </div>

          {vocabSourceMode === "custom" ? (
            <div className="space-y-2 bg-card/60 p-2.5 rounded-xl border border-border/60">
              <div className="flex flex-wrap items-center justify-between gap-2 text-3xs">
                <span className="font-bold text-muted-foreground">
                  בחר מאגר מילים מותאם אישית:
                </span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedBankGradeFilter}
                    onChange={(e) => setSelectedBankGradeFilter(e.target.value)}
                    className="h-6 px-1.5 rounded border border-border bg-background text-3xs cursor-pointer font-medium"
                  >
                    <option value="all">כל השכבות</option>
                    {VOCAB_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {GRADE_LABELS[g]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredCustomBanks.length === 0 ? (
                <div className="p-3 text-center text-3xs text-muted-foreground border border-dashed border-border rounded-lg">
                  {effectiveCustomBanks.length === 0 ? (
                    <span>עדיין לא יצרת מאגרי מילים. תוכל ליצור מאגר בלשונית &quot;מאגרי מילים שלי&quot; בלוח הבקרה.</span>
                  ) : (
                    <span>אין מאגרים התואמים לשכבה שנבחרה.</span>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                  {filteredCustomBanks.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => applyCustomBank(b)}
                      className="p-2 rounded-lg border border-border bg-background hover:border-primary/50 text-right cursor-pointer transition-all flex items-center justify-between gap-1.5 group"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-2xs block truncate text-foreground group-hover:text-primary">
                          {b.name}
                        </span>
                        <span className="text-3xs text-muted-foreground block truncate">
                          {GRADE_LABELS[b.grade] || b.grade} •{" "}
                          {b.levelType === "custom"
                            ? b.customLevelName
                            : STANDARD_LEVEL_LABELS[b.standardLevel || ""] || b.standardLevel}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-3xs shrink-0 font-bold">
                        {b.words.length} מילים
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Textbook unit presets for the chosen grade */
            <div className="space-y-1.5">
              <span className="text-2xs font-bold text-muted-foreground block">
                יחידות מספר הלימוד ({CLASS_GRADE_LABELS[vocabGrade].he}) – לחיצה בוחרת את כל מילות היחידה:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {gradeUnits(vocabGrade).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => applyVocabPreset(`u${u}`)}
                    className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-center cursor-pointer text-2xs font-medium transition-colors"
                  >
                    יחידה {u} ({curriculumWords(vocabGrade, u).length})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Words Chips Tray */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-2xs font-bold text-muted-foreground">
            מילים שנבחרו לתרגול ({selectedVocabWords.length}):
          </span>
          {selectedVocabWords.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedVocabWords([])}
              className="text-3xs text-destructive hover:underline cursor-pointer"
            >
              נקה הכל
            </button>
          )}
        </div>

        {selectedVocabWords.length === 0 ? (
          <div className="p-3 text-center rounded-lg border border-dashed border-border text-muted-foreground text-2xs">
            טרם נבחרו מילים. בחרו ערכה מוכנה או חפשו מילים להוספה מטה.
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg bg-background/80 border border-border/80">
            {selectedVocabWords.map((w) => (
              <Badge
                key={w.id || w.english}
                variant="secondary"
                className="gap-1.5 text-2xs py-1 px-2 font-medium bg-secondary/80 hover:bg-secondary flex items-center"
              >
                <span className="font-bold text-foreground" dir="ltr">{w.english}</span>
                <span className="text-muted-foreground">({w.hebrew})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveVocabWord(w.english)}
                  className="hover:text-destructive cursor-pointer shrink-0 transition-colors"
                  aria-label={`הסר את ${w.english}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Search to add from dictionary */}
      <div className="space-y-1.5">
        <div className="relative">
          <Search className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={vocabSearchQuery}
            onChange={(e) => setVocabSearchQuery(e.target.value)}
            placeholder="חיפוש מילה באנגלית או בעברית להוספה למשימה..."
            className="pr-8 text-xs h-8 bg-background"
          />
          {vocabSearchQuery && (
            <button
              type="button"
              onClick={() => setVocabSearchQuery("")}
              className="absolute left-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {vocabSearchQuery.trim() && (
          <div className="p-1.5 rounded-lg bg-background border border-border max-h-36 overflow-y-auto space-y-1">
            {filteredVocabWordPool.length === 0 ? (
              <div className="p-2 text-center text-3xs text-muted-foreground">
                לא נמצאה מילה מתאימה במאגר. ניתן להוסיפה ידנית מטה.
              </div>
            ) : (
              filteredVocabWordPool.map((w) => {
                const isSelected = selectedVocabWords.some(
                  (sw) => sw.english.toLowerCase() === w.english.toLowerCase()
                );
                return (
                  <div
                    key={w.id || w.english}
                    className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/50 text-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground" dir="ltr">{w.english}</span>
                      <span className="text-muted-foreground">— {w.hebrew}</span>
                      {w.partOfSpeech && (
                        <span className="text-3xs text-muted-foreground/80 italic">({w.partOfSpeech})</span>
                      )}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={isSelected ? "outline" : "default"}
                      onClick={() => handleToggleVocabWord(w)}
                      className={`h-6 px-2 text-3xs gap-1 cursor-pointer ${
                        isSelected
                          ? "border-destructive/50 text-destructive hover:bg-destructive/10"
                          : "bg-success hover:bg-success text-white"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <X className="h-2.5 w-2.5" />
                          <span>הסר</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-2.5 w-2.5" />
                          <span>הוסף</span>
                        </>
                      )}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Add Custom Word Accordion */}
      <div className="pt-1">
        {!showAddCustomWord ? (
          <button
            type="button"
            onClick={() => setShowAddCustomWord(true)}
            className="flex items-center gap-1.5 text-2xs text-success font-bold hover:underline cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>הוסף מילה מותאמת אישית לרשימה</span>
          </button>
        ) : (
          <div className="p-2.5 rounded-lg border border-border bg-background space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-2xs text-foreground">הוספת מילה אישית:</span>
              <button
                type="button"
                onClick={() => setShowAddCustomWord(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={customVocabEng}
                onChange={(e) => setCustomVocabEng(e.target.value)}
                placeholder="Word in English (e.g. challenge)"
                className="text-xs h-7"
                dir="ltr"
              />
              <Input
                value={customVocabHeb}
                onChange={(e) => setCustomVocabHeb(e.target.value)}
                placeholder="תרגום בעברית (למשל: אתגר)"
                className="text-xs h-7"
                dir="rtl"
              />
            </div>
            <Input
              value={customVocabExample}
              onChange={(e) => setCustomVocabExample(e.target.value)}
              placeholder="משפט דוגמה אופציונלי (English sentence)"
              className="text-xs h-7"
              dir="ltr"
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowAddCustomWord(false)}
                className="h-6 text-2xs"
              >
                ביטול
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleAddCustomWord}
                disabled={!customVocabEng.trim() || !customVocabHeb.trim()}
                className="h-6 text-2xs bg-success hover:bg-success text-white"
              >
                הוסף לרשימה
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Title (Editable) */}
      <div className="space-y-1 pt-1">
        <label className="text-2xs font-bold text-muted-foreground block">
          שם המשימה לתלמידים:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            value={customHebrewTitle}
            onChange={(e) => setCustomHebrewTitle(e.target.value)}
            placeholder="שם בעברית (למשל: אוצר מילים ליחידה 2)"
            className="text-xs h-8 bg-background"
            dir="rtl"
          />
          <Input
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Title in English (e.g. Unit 2 Vocabulary)"
            className="text-xs h-8 bg-background"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
}
