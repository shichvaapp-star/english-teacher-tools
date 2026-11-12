"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";

export function ConversationPlayerDock({ c }: { c: ConversationPracticeController }) {
  const {
    currentScenario,
    dialoguePlayer,
    stage,
  } = c;
  return (
    <>
      {/* Multi-Voice Dialogue Player Dock */}
      {stage === "exercise" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur-md py-2.5 px-3 sm:px-6 shadow-xl print:hidden">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={dialoguePlayer.skipBack}
                className="h-8 w-8 cursor-pointer"
                title="שורה קודמת"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (!dialoguePlayer.isActive) {
                    dialoguePlayer.startDialogue();
                  } else {
                    dialoguePlayer.togglePlayPause();
                  }
                }}
                className="h-8 px-3 text-xs font-bold gap-1.5 cursor-pointer"
              >
                {dialoguePlayer.isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>השהה</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>נגן שיחה</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={dialoguePlayer.skipForward}
                className="h-8 w-8 cursor-pointer"
                title="שורה הבאה"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </Button>

              <span className="text-xs text-muted-foreground font-medium ml-2">
                Line {dialoguePlayer.currentTurnIndex + 1} / {dialoguePlayer.totalTurns}
              </span>

              {dialoguePlayer.isActive && (() => {
                const currentTurn = currentScenario.turns[dialoguePlayer.currentTurnIndex];
                const currentSpk = currentTurn
                  ? currentScenario.speakers.find((s) => s.id === currentTurn.speakerId) ||
                    currentScenario.speakers[dialoguePlayer.currentTurnIndex % 2]
                  : null;
                const isSpkA = currentSpk?.id === currentScenario.speakers[0]?.id;
                return currentSpk ? (
                  <div
                    className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-2xs font-bold border transition-colors ${
                      isSpkA
                        ? "bg-sky-500/15 text-sky-800 dark:text-sky-200 border-sky-500/35"
                        : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-500/35"
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSpkA ? "bg-sky-400" : "bg-emerald-400"}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isSpkA ? "bg-sky-500" : "bg-emerald-500"}`} />
                    </span>
                    <span>{isSpkA ? "🔵 Side A:" : "🟢 Side B:"}</span>
                    <span>{currentSpk.name}</span>
                    <span className="text-muted-foreground font-normal">({currentSpk.role})</span>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Speed & Dual Speaker Voice Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5 bg-muted/30">
                {[0.5, 0.8, 0.92, 1.0, 1.15].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => dialoguePlayer.changeRate(r)}
                    className={`px-2 py-0.5 text-2xs rounded-md transition cursor-pointer ${
                      Math.abs(dialoguePlayer.rate - r) < 0.03
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === 0.92 ? "0.9x" : `${r}x`}
                  </button>
                ))}
              </div>

              {dialoguePlayer.voices.length > 1 && (
                <div className="hidden md:flex items-center gap-2 text-2xs">
                  <select
                    value={dialoguePlayer.speakerAVoiceURI}
                    onChange={(e) => dialoguePlayer.changeSpeakerAVoice(e.target.value)}
                    className="h-7 rounded-md border border-border/60 bg-background px-2 text-2xs"
                    title={`Voice for ${currentScenario.speakers[0]?.name}`}
                  >
                    {dialoguePlayer.voices.slice(0, 8).map((v) => (
                      <option key={v.voice.voiceURI} value={v.voice.voiceURI}>
                        {currentScenario.speakers[0]?.avatarEmoji} {currentScenario.speakers[0]?.name}:{" "}
                        {v.displayName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={dialoguePlayer.speakerBVoiceURI}
                    onChange={(e) => dialoguePlayer.changeSpeakerBVoice(e.target.value)}
                    className="h-7 rounded-md border border-border/60 bg-background px-2 text-2xs"
                    title={`Voice for ${currentScenario.speakers[1]?.name}`}
                  >
                    {dialoguePlayer.voices.slice(0, 8).map((v) => (
                      <option key={v.voice.voiceURI} value={v.voice.voiceURI}>
                        {currentScenario.speakers[1]?.avatarEmoji} {currentScenario.speakers[1]?.name}:{" "}
                        {v.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
