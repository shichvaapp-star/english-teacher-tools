"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { BookMarked, Plus } from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularyEmptyState({ c }: { c: VocabularyPracticeController }) {
  const {
    activeCategory,
    exerciseFilter,
    filterOption,
    filteredWords,
    setExerciseFilter,
    setFilterOption,
    setFormError,
    setShowAddModal,
    setSourceFilter,
    sourceFilter,
    wordStats,
  } = c;
  return (
    <>
      {/* EMPTY STATE (When category or filter has no words) */}
      {filteredWords.length === 0 && (
        <div className="max-w-md mx-auto py-12 text-center space-y-4" dir="rtl">
          <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-16 h-16 mx-auto flex items-center justify-center">
            <BookMarked className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-foreground">
              {filterOption !== "all" || sourceFilter !== "all" || exerciseFilter !== "all"
                ? filterOption === "starred"
                  ? "אין עדיין מילים שסומנו במועדפים ⭐"
                  : filterOption === "unlearned"
                  ? "כל הכבוד! אין כרגע מילים הדורשות תרגול"
                  : filterOption === "learned"
                  ? "עדיין לא סומנו מילים כנלמדו"
                  : "אין מילים מהתרגיל או המקור שנבחר"
                : activeCategory === "saved"
                ? "עדיין לא הוספת מילים לאוצר המילים שלך"
                : "לא נמצאו מילים התואמות לחיפוש"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {filterOption !== "all" || sourceFilter !== "all" || exerciseFilter !== "all"
                ? "תוכל להציג את כל המילים או לשנות את סינון הסטטוס והתרגיל."
                : activeCategory === "saved"
                ? "תוכל להזין מילים חדשות ידנית בעצמך (עם מילה, תרגום ומשפט לדוגמה) או לשמור מילים מתורגמות מתוך קריאת אנסין וסדנת הכתיבה."
                : "נסו לחפש מילה אחרת או נקו את שורת החיפוש."}
            </p>
          </div>

          {filterOption !== "all" || sourceFilter !== "all" || exerciseFilter !== "all" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterOption("all");
                setSourceFilter("all");
                setExerciseFilter("all");
              }}
              className="text-xs cursor-pointer font-medium"
            >
              הצג את כל המילים ({wordStats.total})
            </Button>
          ) : activeCategory === "saved" ? (
            <Button
              onClick={() => {
                setShowAddModal(true);
                setFormError(null);
              }}
              className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>הוסף את המילה הראשונה שלך עכשיו</span>
            </Button>
          ) : null}
        </div>
      )}
    </>
  );
}
