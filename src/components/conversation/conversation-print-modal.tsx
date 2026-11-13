"use client";

import React from "react";
import { PrintOptionsModal } from "@/components/print/print-options-modal";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";

export function ConversationPrintModal({ c }: { c: ConversationPracticeController }) {
  const { currentScenario, dialogueSavedVocabWords, printOptions } = c;
  return (
    <PrintOptionsModal
      options={printOptions}
      title="הדפסת שיחה / דף עבודה"
      subtitle={`${currentScenario.title} • ${currentScenario.hebrewTitle}`}
      labels={{
        textOnlyLabel: "תמליל השיחה",
        textOnlyDesc: "השיחה המלאה ללא שאלות",
        fullDesc: `תמליל השיחה + ${currentScenario.questions.length} שאלות מלאות`,
        questionsOnlyDesc: `${currentScenario.questions.length} שאלות לתרגול או מבחן`,
        vocabContextLabel: "בשיחה זו",
      }}
      savedVocabCount={dialogueSavedVocabWords.length}
    />
  );
}
