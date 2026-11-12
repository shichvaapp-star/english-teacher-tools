"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularyBanners({ c }: { c: VocabularyPracticeController }) {
  const {
    activeDraftPrompt,
    handleDiscardDraft,
    returnToUnseen,
    setActiveDraftPrompt,
  } = c;
  return (
    <>
      {/* Return to Unseen Practice Banner */}
      {returnToUnseen && (
        <div
          className="bg-sky-500/10 border-b border-sky-500/25 px-3 sm:px-8 py-2.5 print:hidden animate-in fade-in duration-200"
          dir="rtl"
        >
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400 shrink-0">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-foreground truncate">
                {returnToUnseen.hebrewTitle || returnToUnseen.storyTitle
                  ? `עברת לכאן מתוך תרגול אנסין: "${returnToUnseen.hebrewTitle || returnToUnseen.storyTitle}"`
                  : "עברת לכאן מתוך תרגול אנסין"}
              </span>
              <span className="text-muted-foreground hidden sm:inline">
                • ההתקדמות והתשובות שלך שמורות
              </span>
            </div>
            <Link
              href="/unseen?resumeFromVocab=1"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer shrink-0"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              <span>חזור לתרגול האנסין שהיית בו</span>
            </Link>
          </div>
        </div>
      )}

      {/* Active In-Progress Draft Banner */}
      {activeDraftPrompt && (
        <div className="bg-primary/10 border-b border-primary/25 px-4 py-3 print:hidden" dir="rtl">
          <div className="container mx-auto max-w-4xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span className="font-bold text-foreground">
                נטענה אוטומטית הטיוטה השמורה שלך ({activeDraftPrompt.summaryText}):
              </span>
              <span className="text-muted-foreground font-medium">{activeDraftPrompt.hebrewTitle || activeDraftPrompt.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveDraftPrompt(null)}
                className="h-7 text-xs cursor-pointer"
              >
                <span>הסתר הודעה</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDiscardDraft(activeDraftPrompt)}
                className="h-7 text-xs text-muted-foreground hover:text-destructive cursor-pointer gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>אפס והתחל מחדש</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
