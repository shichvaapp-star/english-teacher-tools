"use client";

import React from "react";
import { Plus } from "lucide-react";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";

export function WritingSuggestionChips({ c }: { c: WritingPracticeController }) {
  const {
    currentTask,
    handleInsertText,
  } = c;
  return (
    <>
      {/* Sentence Starters & Word Suggestions (Clean Chips Above Textbox) */}
      <div className="space-y-2" dir="ltr">
        {/* Sentence Starters Chips */}
        {currentTask.sentenceStarters && currentTask.sentenceStarters.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted-foreground text-[11px] font-semibold mr-1 rtl text-right" dir="rtl">
              הצעות למשפטי פתיחה:
            </span>
            {currentTask.sentenceStarters.map((starter, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleInsertText(starter)}
                className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-primary/10 hover:border-primary/40 text-xs text-foreground font-medium transition cursor-pointer flex items-center gap-1 shadow-2xs"
                title="Click to insert"
              >
                <Plus className="h-3 w-3 text-primary opacity-60" />
                <span>{starter}</span>
              </button>
            ))}
          </div>
        )}

        {/* Word Bank Chips */}
        {currentTask.wordBank && currentTask.wordBank.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted-foreground text-[11px] font-semibold mr-1 rtl text-right" dir="rtl">
              מילים מומלצות:
            </span>
            {currentTask.wordBank.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleInsertText(item.word)}
                className="px-2 py-0.5 rounded-md border border-border/80 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 text-xs text-foreground transition cursor-pointer flex items-center gap-1"
                title={`Click to insert ${item.word}`}
              >
                {item.emoji && <span className="text-xs">{item.emoji}</span>}
                <span className="font-semibold">{item.word}</span>
                <span className="text-[10px] text-muted-foreground">({item.hebrew})</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
