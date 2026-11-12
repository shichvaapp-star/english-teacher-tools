"use client";

import React from "react";
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

export default function VocabularyPage() {
  const c = useVocabularyPractice();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black overflow-x-hidden">
      <VocabularyHeader c={c} />

      <VocabularyBanners c={c} />

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-3 sm:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6 print:p-0 print:m-0">
        <VocabularyAssignmentNotices c={c} />

        <VocabularyToolbar c={c} />

        <VocabularyFilters c={c} />

        <VocabularyEmptyState c={c} />

        <VocabularyFlashcards c={c} />

        <VocabularySpeedMatch c={c} />

        <VocabularyQuiz c={c} />

        <VocabularyWordBank c={c} />
      </main>

      <VocabularyAddWordModal c={c} />

      <VocabularyTurnInModal c={c} />

      <VocabularySuccessDialog c={c} />
    </div>
  );
}
