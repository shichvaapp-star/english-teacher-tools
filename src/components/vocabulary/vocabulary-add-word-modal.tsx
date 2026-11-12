"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Plus,
  X,
  AlertCircle,
  Check,
} from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularyAddWordModal({ c }: { c: VocabularyPracticeController }) {
  const {
    formError,
    handleSaveCustomWord,
    isWordInSentence,
    newWordEng,
    newWordHeb,
    newWordPos,
    newWordSentence,
    setFormError,
    setNewWordEng,
    setNewWordHeb,
    setNewWordPos,
    setNewWordSentence,
    setShowAddModal,
    showAddModal,
  } = c;
  return (
    <>
      {/* Manual Word Input Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div
            className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-foreground">
                    הוספת מילה חדשה לאוצר המילים
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    הזינו את המילה באנגלית, תרגומה לעברית, והציבו אותה בתוך משפט לדוגמה.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormError(null);
                }}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCustomWord} className="space-y-4 text-xs">
              {/* Field 1: English Word */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  1. המילה באנגלית (English Word) <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="למשל: discover או curious"
                  value={newWordEng}
                  onChange={(e) => {
                    setNewWordEng(e.target.value);
                    setFormError(null);
                  }}
                  dir="ltr"
                  className="h-10 text-sm font-sans"
                  autoFocus
                />
              </div>

              {/* Field 2: Hebrew Translation */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  2. תרגום המילה לעברית <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="למשל: לגלות או סקרן"
                  value={newWordHeb}
                  onChange={(e) => {
                    setNewWordHeb(e.target.value);
                    setFormError(null);
                  }}
                  dir="rtl"
                  className="h-10 text-sm"
                />
              </div>

              {/* Field 3: Part of Speech */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  3. חלק דיבר (Part of Speech)
                </label>
                <select
                  value={newWordPos}
                  onChange={(e) =>
                    setNewWordPos(
                      e.target.value as "noun" | "verb" | "adjective" | "adverb" | "phrase"
                    )
                  }
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="noun">שם עצם (Noun)</option>
                  <option value="verb">פועל (Verb)</option>
                  <option value="adjective">שם תואר (Adjective)</option>
                  <option value="adverb">תואר הפועל (Adverb)</option>
                  <option value="phrase">ביטוי / צירוף מילים (Phrase)</option>
                </select>
              </div>

              {/* Field 4: Example Sentence containing the word */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground block">
                    4. הצבת המילה בתוך משפט באנגלית (Example Sentence) <span className="text-destructive">*</span>
                  </label>
                  {newWordEng.trim() && (
                    <span className="text-[10px] text-muted-foreground font-sans" dir="ltr">
                      Must include: <strong>{newWordEng.trim()}</strong>
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  placeholder={`למשל: We wanted to ${newWordEng.trim() || "discover"} new places during the trip.`}
                  value={newWordSentence}
                  onChange={(e) => {
                    setNewWordSentence(e.target.value);
                    setFormError(null);
                  }}
                  dir="ltr"
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm font-sans shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />

                {/* Real-time sentence inclusion indicator */}
                {newWordSentence.trim() && newWordEng.trim() && (
                  <div className="pt-0.5">
                    {isWordInSentence ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>מעולה! המילה &quot;{newWordEng.trim()}&quot; מופיעה כנדרש בתוך המשפט.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>שימו לב: המשפט חייב להכיל את המילה באנגלית (&quot;{newWordEng.trim()}&quot;).</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormError(null);
                  }}
                  className="cursor-pointer text-xs"
                >
                  ביטול
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={!newWordEng.trim() || !newWordHeb.trim() || !newWordSentence.trim() || !isWordInSentence}
                  className="cursor-pointer text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  <Check className="h-4 w-4" />
                  <span>שמור מילה לאוצר המילים</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
