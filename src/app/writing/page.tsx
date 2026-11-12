"use client";

import React from "react";
import { Confetti } from "@/components/confetti";
import { useWritingPractice } from "@/components/writing/use-writing-practice";
import { WritingDraftBanner } from "@/components/writing/writing-draft-banner";
import { WritingHistoryModal } from "@/components/writing/writing-history-modal";
import { WritingVocabDrawer } from "@/components/writing/writing-vocab-drawer";
import { WritingAiSettingsModal } from "@/components/writing/writing-ai-settings-modal";
import { WritingHeader } from "@/components/writing/writing-header";
import { WritingSettingsStage } from "@/components/writing/writing-settings-stage";
import { WritingStage } from "@/components/writing/writing-stage";

export default function WritingPracticePage() {
  const c = useWritingPractice();
  const {
    showPracticeConfetti,
  } = c;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black overflow-x-hidden">
      {showPracticeConfetti && <Confetti />}

      <WritingHeader c={c} />

      <WritingDraftBanner c={c} />

      <WritingSettingsStage c={c} />

      <WritingStage c={c} />

      <WritingHistoryModal c={c} />

      <WritingVocabDrawer c={c} />

      <WritingAiSettingsModal c={c} />
    </div>
  );
}
