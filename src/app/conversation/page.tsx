"use client";

import React from "react";
import { DraggableTranslationPopup } from "@/components/unseen/draggable-translation-popup";
import { Confetti } from "@/components/confetti";
import { useConversationPractice } from "@/components/conversation/use-conversation-practice";
import { ConversationAssignedNotice } from "@/components/conversation/conversation-assigned-notice";
import { ConversationSelectionBar } from "@/components/conversation/conversation-selection-bar";
import { ConversationWordBankDrawer } from "@/components/conversation/conversation-word-bank-drawer";
import { ConversationSubmitModal } from "@/components/conversation/conversation-submit-modal";
import { ConversationHeader } from "@/components/conversation/conversation-header";
import { ConversationPlayerDock } from "@/components/conversation/conversation-player-dock";
import { ConversationSettingsStage } from "@/components/conversation/conversation-settings-stage";
import { ConversationExerciseStage } from "@/components/conversation/conversation-exercise-stage";

export default function ConversationPracticePage() {
  const c = useConversationPractice();
  const {
    clickedWord,
    handleSaveClickedWord,
    handleSpeak,
    setClickedWord,
    setShowVocabDrawer,
    showPracticeConfetti,
    stage,
  } = c;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black">
      {showPracticeConfetti && <Confetti />}

      <ConversationHeader c={c} />

      <ConversationAssignedNotice c={c} />

      <ConversationSelectionBar c={c} />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-3 sm:px-8 py-6 pb-28">
        {stage === "settings" ? (
          <ConversationSettingsStage c={c} />
        ) : (
          /* =====================================================================
             STAGE 2: EXERCISE SPLIT-PANE VIEW (Dialogue on Left, Questions on Right)
             ===================================================================== */
          <ConversationExerciseStage c={c} />
        )}
      </main>

      <ConversationPlayerDock c={c} />

      {/* Draggable Translation Popup */}
      <DraggableTranslationPopup
        clickedWord={clickedWord}
        isSpeechActive={stage === "exercise"}
        onSpeak={handleSpeak}
        onSaveWord={handleSaveClickedWord}
        onClose={() => setClickedWord(null)}
        onOpenDrawer={() => setShowVocabDrawer(true)}
      />

      <ConversationWordBankDrawer c={c} />

      <ConversationSubmitModal c={c} />
    </div>
  );
}
