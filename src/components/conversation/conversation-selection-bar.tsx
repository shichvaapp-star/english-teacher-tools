"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Volume2, X, Languages } from "lucide-react";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";

export function ConversationSelectionBar({ c }: { c: ConversationPracticeController }) {
  const {
    handleSpeak,
    handleTranslateSelection,
    selectedPassageText,
    setSelectedPassageText,
  } = c;
  return (
    <>
      {/* Floating Selection Translate / Speak Bar */}
      {selectedPassageText && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card/95 backdrop-blur border border-primary/40 shadow-xl rounded-full px-3.5 py-1.5 flex items-center gap-2 animate-in fade-in-0 zoom-in-95 print:hidden"
          dir="rtl"
        >
          <span className="text-xs font-semibold text-foreground max-w-[180px] truncate" dir="ltr">
            &ldquo;{selectedPassageText}&rdquo;
          </span>
          <Button
            type="button"
            size="sm"
            onClick={() => handleTranslateSelection(selectedPassageText)}
            className="h-7 px-2.5 text-xs font-bold gap-1 cursor-pointer rounded-full"
          >
            <Languages className="h-3.5 w-3.5" />
            <span>תרגם קטע</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleSpeak(selectedPassageText)}
            className="h-7 px-2.5 text-xs font-bold gap-1 cursor-pointer rounded-full"
          >
            <Volume2 className="h-3.5 w-3.5 text-primary" />
            <span>הקרא</span>
          </Button>
          <button
            type="button"
            onClick={() => setSelectedPassageText(null)}
            className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
