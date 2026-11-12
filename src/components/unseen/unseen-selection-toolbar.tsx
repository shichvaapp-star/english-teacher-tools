"use client";

import React from "react";
import { Volume2, Sparkles, X } from "lucide-react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenSelectionToolbar({ c }: { c: UnseenPracticeController }) {
  const {
    handleDictateSelection,
    handleTranslateSelection,
    selectedPassageText,
    setSelectedPassageText,
  } = c;
  return (
    <>
      {/* Floating Toolbar for Highlighted Sentence / Selection in Unseen Text */}
      {selectedPassageText && (
        <div
          style={{
            left: `${selectedPassageText.x}px`,
            top: `${selectedPassageText.y}px`,
          }}
          onMouseDown={(e) => {
            // Prevent clearing browser text selection when clicking toolbar buttons
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`fixed z-50 -translate-x-1/2 ${
            selectedPassageText.below ? "translate-y-0" : "-translate-y-full"
          } print:hidden animate-in fade-in-0 zoom-in-95 duration-150`}
        >
          <div
            className="flex items-center gap-1.5 bg-card/95 backdrop-blur-md border border-primary/40 shadow-2xl rounded-xl p-1.5 px-2.5"
            dir="rtl"
          >
            <button
              type="button"
              onClick={() => handleDictateSelection(selectedPassageText.text)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-colors cursor-pointer shadow-2xs shrink-0"
              title="הקרא בקול את הקטע המסומן בלבד"
            >
              <Volume2 className="h-3.5 w-3.5 shrink-0" />
              <span>הקרא קטע נבחר</span>
            </button>

            <button
              type="button"
              onClick={() => handleTranslateSelection(selectedPassageText.text)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 text-xs font-bold transition-colors cursor-pointer shrink-0"
              title="תרגם לעברית את הקטע המסומן בלבד"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>תרגם קטע נבחר</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPassageText(null);
                if (typeof window !== "undefined") {
                  window.getSelection()?.removeAllRanges();
                }
              }}
              className="p-1 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
              title="סגור"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
