"use client";

import React from "react";
import { formatVocabSourceLabel } from "@/lib/vocab-storage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Volume2,
  Printer,
  Plus,
  Trash2,
  Star,
  CheckCheck,
} from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularyWordBank({ c }: { c: VocabularyPracticeController }) {
  const {
    activeCategory,
    filteredWords,
    handleDeleteWord,
    handleSpeak,
    handleToggleMastered,
    handleToggleStar,
    setFormError,
    setShowAddModal,
    studyMode,
  } = c;
  return (
    <>
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

          {/* Mobile Card List (sm:hidden) */}
          <div className="sm:hidden space-y-2.5">
            {filteredWords.map((w) => (
              <div
                key={w.id}
                className="p-3.5 rounded-xl border border-border/80 bg-card shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStar(w.id, w.starred)}
                      className={cn(
                        "p-1 rounded-md transition-colors cursor-pointer",
                        w.starred
                          ? "text-amber-500 bg-amber-500/10"
                          : "text-muted-foreground/30 hover:text-amber-500"
                      )}
                      title={w.starred ? "הסר ממועדפים" : "סמן בכוכב ⭐"}
                    >
                      <Star className={cn("h-4 w-4", w.starred ? "fill-amber-400 text-amber-500" : "")} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSpeak(w.english)}
                      className="p-1 rounded-md bg-muted/60 text-muted-foreground hover:text-primary cursor-pointer"
                      title="האזנה להגייה"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-bold text-sm text-foreground capitalize">{w.english}</span>
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1.5 py-0 text-muted-foreground border-border/70 max-w-[140px] truncate"
                      dir="rtl"
                    >
                      {formatVocabSourceLabel(w)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-primary" dir="rtl">{w.hebrew}</span>
                    {activeCategory === "saved" && (
                      <button
                        type="button"
                        onClick={() => handleDeleteWord(w.id, w.english)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer rounded-md hover:bg-destructive/10"
                        title="מחק מילה מאוצר המילים שלי"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {w.example && (
                  <p className="text-xs text-muted-foreground italic font-sans bg-muted/30 p-2 rounded-lg" dir="ltr">
                    &ldquo;{w.example}&rdquo;
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleMastered(w.id, w.mastered)}
                    className="cursor-pointer"
                    title="לחץ לשינוי סטטוס שליטה"
                  >
                    {w.mastered ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors">
                        <CheckCheck className="h-3 w-3" /> נלמד
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition-colors">
                        ⏳ לתרגול
                      </span>
                    )}
                  </button>
                  {w.starred && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-amber-400" /> מועדף
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (hidden sm:block) */}
          <div className="hidden sm:block rounded-xl border border-border overflow-hidden bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <th className="p-3 w-10 text-center print:hidden">⭐</th>
                    <th className="p-3 w-1/4">באנגלית (English)</th>
                    <th className="p-3 w-1/4 text-right">בעברית (תרגום)</th>
                    <th className="p-3 w-1/3">משפט לדוגמה (Sentence)</th>
                    <th className="p-3 w-28 text-center">סטטוס</th>
                    <th className="p-3 w-16 text-center print:hidden">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredWords.map((w) => (
                    <tr key={w.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 text-center print:hidden">
                        <button
                          type="button"
                          onClick={() => handleToggleStar(w.id, w.starred)}
                          className={cn(
                            "p-1 rounded-md transition-colors cursor-pointer",
                            w.starred
                              ? "text-amber-500 hover:text-amber-600"
                              : "text-muted-foreground/30 hover:text-amber-500"
                          )}
                          title={w.starred ? "הסר ממועדפים" : "סמן בכוכב ⭐"}
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              w.starred ? "fill-amber-400 text-amber-500" : ""
                            )}
                          />
                        </button>
                      </td>
                      <td className="p-3 font-bold text-foreground">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>{w.english}</span>
                          <button
                            type="button"
                            onClick={() => handleSpeak(w.english)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer print:hidden"
                            title="האזנה להגייה"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 text-muted-foreground border-border/70 hidden sm:inline-flex max-w-[180px] truncate font-normal"
                            dir="rtl"
                            title={formatVocabSourceLabel(w)}
                          >
                            {formatVocabSourceLabel(w)}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-primary text-right" dir="rtl">
                        {w.hebrew}
                      </td>
                      <td className="p-3 text-muted-foreground italic font-sans" dir="ltr">
                        {w.example ? `"${w.example}"` : "—"}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleMastered(w.id, w.mastered)}
                          className="cursor-pointer"
                          title="לחץ לשינוי סטטוס שליטה"
                        >
                          {w.mastered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors">
                              <CheckCheck className="h-3 w-3" /> נלמד
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition-colors">
                              ⏳ לתרגול
                            </span>
                          )}
                        </button>
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
        </div>
      )}
    </>
  );
}
