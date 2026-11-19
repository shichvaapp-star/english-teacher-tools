"use client";

import React from "react";
import { Volume2, X, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GrammarPracticeController } from "@/components/grammar/use-grammar-practice";

/** Floating bar shown when the student highlights English text: translate or read it aloud. */
export function GrammarSelectionBar({ c }: { c: GrammarPracticeController }) {
  const { selectedText, setSelectedText, handleTranslateSelection, handleSpeak } = c;
  if (!selectedText || c.screen !== "practice") return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card/95 backdrop-blur border border-primary/40 shadow-xl rounded-full px-3.5 py-1.5 flex items-center gap-2 animate-in fade-in-0 zoom-in-95 print:hidden max-w-[calc(100vw-2rem)]"
      dir="rtl"
      onMouseDown={(e) => e.preventDefault()}
    >
      <span className="text-xs font-semibold text-foreground max-w-[180px] truncate" dir="ltr">
        &ldquo;{selectedText}&rdquo;
      </span>
      <Button
        type="button"
        size="sm"
        onClick={() => handleTranslateSelection(selectedText)}
        className="h-7 px-2.5 text-xs font-bold gap-1 cursor-pointer rounded-full font-hebrew"
      >
        <Languages className="h-3.5 w-3.5" />
        <span>תרגם קטע</span>
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => handleSpeak(selectedText, "selection")}
        className="h-7 px-2.5 text-xs font-bold gap-1 cursor-pointer rounded-full font-hebrew"
      >
        <Volume2 className="h-3.5 w-3.5 text-primary" />
        <span>הקרא</span>
      </Button>
      <button
        type="button"
        onClick={() => {
          setSelectedText(null);
          window.getSelection()?.removeAllRanges();
        }}
        className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
        aria-label="סגור"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
