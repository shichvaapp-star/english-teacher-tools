"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Volume2,
  Gauge,
  Sparkles,
} from "lucide-react";
import { CuratedVoice } from "@/lib/use-speech-player";

interface UnseenAudioDockProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  rate: number;
  voices: CuratedVoice[];
  selectedVoiceURI: string;
  onTogglePlayPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onChangeRate: (rate: number) => void;
  onChangeVoice: (uri: string) => void;
  onClose: () => void;
}

const SPEED_OPTIONS = [
  { label: "0.75x", value: 0.75 },
  { label: "0.9x", value: 0.9 },
  { label: "1.0x", value: 1.0 },
  { label: "1.25x", value: 1.25 },
];

export function UnseenAudioDock({
  isPlaying,
  isPaused,
  currentSentenceIndex,
  totalSentences,
  rate,
  voices,
  selectedVoiceURI,
  onTogglePlayPause,
  onSkipBack,
  onSkipForward,
  onChangeRate,
  onChangeVoice,
  onClose,
}: UnseenAudioDockProps) {
  const progressPercent = totalSentences > 0 ? ((currentSentenceIndex + 1) / totalSentences) * 100 : 0;

  return (
    <div className="sticky top-16 z-30 mb-3 print:hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
      <div className="bg-card/95 backdrop-blur-md border-2 border-primary/30 rounded-2xl p-2.5 sm:p-3 shadow-lg flex flex-col gap-2">
        {/* Top row: Transport Controls + Progress */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Transport buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5" dir="ltr">
            {/* Skip Back */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onSkipBack}
              disabled={currentSentenceIndex === 0 && !isPlaying}
              className="h-8 w-8 rounded-full border-border/70 hover:border-primary/50 cursor-pointer"
              title="Previous sentence (חזור משפט אחורה)"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            {/* Play / Pause */}
            <Button
              type="button"
              size="icon"
              onClick={onTogglePlayPause}
              className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer"
              title={isPlaying ? "Pause (השהה הקראה)" : "Play (המשך הקראה)"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5" />
              )}
            </Button>

            {/* Skip Forward */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onSkipForward}
              disabled={currentSentenceIndex >= totalSentences - 1}
              className="h-8 w-8 rounded-full border-border/70 hover:border-primary/50 cursor-pointer"
              title="Next sentence (עבור למשפט הבא)"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            {/* Status indicator */}
            <div className="flex items-center gap-1.5 ml-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : isPaused ? "bg-amber-500" : "bg-muted-foreground"}`} />
              <span className="text-xs font-semibold text-foreground font-mono">
                {currentSentenceIndex + 1} / {totalSentences}
              </span>
            </div>
          </div>

          {/* Right: Speed pills + Voice + Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Speed Pills */}
            <div className="flex items-center border border-border/80 bg-muted/30 rounded-lg p-0.5 text-[11px]" dir="ltr">
              <span className="px-1 text-muted-foreground hidden sm:inline">
                <Gauge className="h-3 w-3" />
              </span>
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeRate(opt.value)}
                  className={`px-1.5 py-0.5 rounded font-medium transition cursor-pointer ${
                    Math.abs(rate - opt.value) < 0.01
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={`Speed ${opt.label}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Voice Selector */}
            {voices.length > 0 && (
              <div className="relative">
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => onChangeVoice(e.target.value)}
                  className="h-7 rounded-lg border border-input bg-background/90 px-2 text-[11px] font-medium shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer max-w-[130px] sm:max-w-[170px] truncate"
                  title="בחר קול דיבור (Natural Voice)"
                  dir="ltr"
                >
                  {voices.map((v) => (
                    <option key={v.voice.voiceURI} value={v.voice.voiceURI}>
                      {v.displayName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Stop & Close button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              title="סגור נגן (Stop & Close)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bottom row: Mini scrubbable progress bar */}
        <div className="w-full bg-muted/60 rounded-full h-1 overflow-hidden">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
