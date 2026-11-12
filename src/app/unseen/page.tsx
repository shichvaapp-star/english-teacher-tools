"use client";

import React from "react";
import { DraggableTranslationPopup } from "@/components/unseen/draggable-translation-popup";
import { Confetti } from "@/components/confetti";
import { useUnseenPractice } from "@/components/unseen/use-unseen-practice";
import { UnseenAudioDockSection } from "@/components/unseen/unseen-audio-dock-section";
import { UnseenDraftBanner } from "@/components/unseen/unseen-draft-banner";
import { UnseenSelectionToolbar } from "@/components/unseen/unseen-selection-toolbar";
import { UnseenVocabDrawer } from "@/components/unseen/unseen-vocab-drawer";
import { UnseenAiSettingsModal } from "@/components/unseen/unseen-ai-settings-modal";
import { UnseenHeader } from "@/components/unseen/unseen-header";
import { UnseenPracticeCompleteModal } from "@/components/unseen/unseen-practice-complete-modal";
import { UnseenSubmitModal } from "@/components/unseen/unseen-submit-modal";
import { UnseenPrintModal } from "@/components/unseen/unseen-print-modal";
import { UnseenPrintSheets } from "@/components/unseen/unseen-print-sheets";
import { UnseenSettingsStage } from "@/components/unseen/unseen-settings-stage";
import { UnseenExerciseStage } from "@/components/unseen/unseen-exercise-stage";

export default function UnseenPracticePage() {
  const c = useUnseenPractice();
  const {
    clickedWord,
    handleSaveClickedWord,
    handleSpeak,
    setClickedWord,
    setDrawerOpen,
    setShowPracticeConfetti,
    showPracticeConfetti,
    speech,
  } = c;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black">
      <UnseenHeader c={c} />

      <UnseenDraftBanner c={c} />

      <UnseenSettingsStage c={c} />

      <UnseenExerciseStage c={c} />

      <UnseenAudioDockSection c={c} />

      <UnseenSelectionToolbar c={c} />

      {/* Instant Translation Toast / Popup */}
      <DraggableTranslationPopup
        clickedWord={clickedWord}
        isSpeechActive={speech.isActive}
        onSpeak={handleSpeak}
        onSaveWord={handleSaveClickedWord}
        onClose={() => setClickedWord(null)}
        onOpenDrawer={() => {
          setClickedWord(null);
          setDrawerOpen(true);
        }}
      />

      <UnseenVocabDrawer c={c} />

      <UnseenSubmitModal c={c} />

      <UnseenAiSettingsModal c={c} />

      <UnseenPrintModal c={c} />

      <UnseenPracticeCompleteModal c={c} />

      {/* Confetti Animation */}
      <Confetti active={showPracticeConfetti} onComplete={() => setShowPracticeConfetti(false)} />

      <UnseenPrintSheets c={c} />
    </div>
  );
}
