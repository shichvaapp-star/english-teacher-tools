"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenDraftBanner({ c }: { c: UnseenPracticeController }) {
  const {
    activeDraftPrompt,
    handleDiscardDraft,
    handleRestoreDraft,
    setActiveDraftPrompt,
    stage,
  } = c;
  return (
    <>
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
              {stage === "settings" ? (
                <Button
                  size="sm"
                  onClick={() => handleRestoreDraft(activeDraftPrompt)}
                  className="h-7 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer gap-1"
                >
                  <span>המשך לתרגול</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveDraftPrompt(null)}
                  className="h-7 text-xs cursor-pointer"
                >
                  הסתר הודעה
                </Button>
              )}
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
