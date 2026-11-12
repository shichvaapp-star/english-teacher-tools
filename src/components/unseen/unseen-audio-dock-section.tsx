"use client";

import React from "react";
import { UnseenAudioDock } from "@/components/unseen/unseen-audio-dock";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenAudioDockSection({ c }: { c: UnseenPracticeController }) {
  const {
    speech,
    stage,
  } = c;
  return (
    <>
      {/* Floating Audio Controls Dock for Reading Passage (scrolls along with user) */}
      {stage === "exercise" && speech.isActive && (
        <UnseenAudioDock
          isPlaying={speech.isPlaying}
          isPaused={speech.isPaused}
          currentSentenceIndex={speech.currentSentenceIndex}
          totalSentences={speech.totalSentences}
          rate={speech.rate}
          voices={speech.voices}
          selectedVoiceURI={speech.selectedVoiceURI}
          onTogglePlayPause={speech.togglePlayPause}
          onSkipBack={speech.skipBack}
          onSkipForward={speech.skipForward}
          onChangeRate={speech.changeRate}
          onChangeVoice={speech.changeVoice}
          onClose={speech.stop}
        />
      )}
    </>
  );
}
