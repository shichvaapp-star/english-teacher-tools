"use client";

import React from "react";
import { PrintOptionsModal } from "@/components/print/print-options-modal";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenPrintModal({ c }: { c: UnseenPracticeController }) {
  const { currentStory, passageSavedVocabWords, printOptions } = c;
  return (
    <PrintOptionsModal
      options={printOptions}
      title="הדפסת מבחן / דף עבודה"
      subtitle={`${currentStory.title} • ${currentStory.hebrewTitle}`}
      labels={{
        textOnlyLabel: "קטע קריאה",
        textOnlyDesc: "הטקסט והפסקאות ללא שאלות",
        fullDesc: `קטע קריאה + ${currentStory.questions.length} שאלות מלאות`,
        questionsOnlyDesc: `${currentStory.questions.length} שאלות לתרגול או מבחן`,
        vocabContextLabel: "בקטע זה",
      }}
      savedVocabCount={passageSavedVocabWords.length}
    />
  );
}
