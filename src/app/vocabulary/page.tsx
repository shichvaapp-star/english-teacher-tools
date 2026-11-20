"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useVocabularyPractice } from "@/components/vocabulary/use-vocabulary-practice";
import { VocabularyEmptyState } from "@/components/vocabulary/vocabulary-empty-state";
import { VocabularyBanners } from "@/components/vocabulary/vocabulary-banners";
import { VocabularySuccessDialog } from "@/components/vocabulary/vocabulary-success-dialog";
import { VocabularyAssignmentNotices } from "@/components/vocabulary/vocabulary-assignment-notices";
import { VocabularyTurnInModal } from "@/components/vocabulary/vocabulary-turn-in-modal";
import { VocabularyQuiz } from "@/components/vocabulary/vocabulary-quiz";
import { VocabularyHeader } from "@/components/vocabulary/vocabulary-header";
import { VocabularyFlashcards } from "@/components/vocabulary/vocabulary-flashcards";
import { VocabularyToolbar } from "@/components/vocabulary/vocabulary-toolbar";
import { VocabularySpeedMatch } from "@/components/vocabulary/vocabulary-speed-match";
import { VocabularyAddWordModal } from "@/components/vocabulary/vocabulary-add-word-modal";
import { VocabularyWordBank } from "@/components/vocabulary/vocabulary-word-bank";
import { VocabularyFilters } from "@/components/vocabulary/vocabulary-filters";
import { VocabularySetupWizard } from "@/components/vocabulary/vocabulary-setup-wizard";
import { SetupViewModeBar, useSetupWizardMode } from "@/components/shared/wizard/setup-wizard";

export default function VocabularyPage() {
  const c = useVocabularyPractice();
  const wizard = useSetupWizardMode();
  // In step-by-step mode the page opens with a short "what to practise" wizard
  // (skipped when the teacher assigned words).
  const [started, setStarted] = useState(false);
  const showSetup = wizard && !started && !c.activeAssignment;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black overflow-x-hidden">
      <VocabularyHeader c={c} />

      <VocabularyBanners c={c} />

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-3 sm:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6 print:p-0 print:m-0">
        <VocabularyAssignmentNotices c={c} />

        {showSetup ? (
          <div className="mx-auto max-w-4xl space-y-5 print:hidden">
            <SetupViewModeBar />
            <VocabularySetupWizard c={c} onDone={() => setStarted(true)} />
          </div>
        ) : (
          <>
            {wizard && !c.activeAssignment && (
              <div className="flex justify-end print:hidden" dir="rtl">
                <button
                  type="button"
                  onClick={() => setStarted(false)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary hover:bg-muted"
                >
                  <RotateCcw className="size-4" />
                  לבחור מחדש שלב אחר שלב
                </button>
              </div>
            )}
            {!wizard && !c.activeAssignment && <SetupViewModeBar />}

            <VocabularyToolbar c={c} />

            <VocabularyFilters c={c} />

            <VocabularyEmptyState c={c} />

            <VocabularyFlashcards c={c} />

            <VocabularySpeedMatch c={c} />

            <VocabularyQuiz c={c} />

            <VocabularyWordBank c={c} />
          </>
        )}
      </main>

      <VocabularyAddWordModal c={c} />

      <VocabularyTurnInModal c={c} />

      <VocabularySuccessDialog c={c} />
    </div>
  );
}
