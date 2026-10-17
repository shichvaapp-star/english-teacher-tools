"use client";

import React, { useState, useEffect } from "react";
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
  Keyboard,
  ChevronDown,
  ChevronUp,
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
  const [showShortcuts, setShowShortcuts] = useState(true);

  // Keyboard shortcuts listener for play/pause, backward, forward
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs, textareas, or editable elements
      const target = e.target as HTMLElement | null;
      const activeEl = document.activeElement as HTMLElement | null;
      const isInput =
        (target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.tagName === "SELECT" ||
            target.isContentEditable)) ||
        (activeEl &&
          (activeEl.tagName === "INPUT" ||
            activeEl.tagName === "TEXTAREA" ||
            activeEl.tagName === "SELECT" ||
            activeEl.isContentEditable));

      if (isInput) return;

      // Play / Pause: Space or K
      if (e.code === "Space" || e.key === " " || e.code === "KeyK") {
        e.preventDefault();
        onTogglePlayPause();
        return;
      }

      // Backward (rewind to previous sentence / restart sentence): Left Arrow or J
      if (e.key === "ArrowLeft" || e.code === "ArrowLeft" || e.code === "KeyJ") {
        e.preventDefault();
        onSkipBack();
        return;
      }

      // Forward (jump to next sentence): Right Arrow or L
      if (e.key === "ArrowRight" || e.code === "ArrowRight" || e.code === "KeyL") {
        e.preventDefault();
        onSkipForward();
        return;
      }

      // Close player: Escape
      if (e.key === "Escape" || e.code === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onTogglePlayPause, onSkipBack, onSkipForward, onClose]);

  const progressPercent = totalSentences > 0 ? ((currentSentenceIndex + 1) / totalSentences) * 100 : 0;

  return (
    <div
      className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.25rem)] sm:w-[92%] max-w-2xl print:hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-300 pointer-events-auto"
      role="region"
      aria-label="Audio reader controls"
    >
      <div className="bg-card/95 dark:bg-card/90 backdrop-blur-xl border-2 border-primary/40 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col gap-2 ring-1 ring-black/5 dark:ring-white/10">
        {/* Top row: Transport Controls + Speed + Voice + Close */}
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
              title="Previous sentence [← / J] (משפט קודם)"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            {/* Play / Pause */}
            <Button
              type="button"
              size="icon"
              onClick={onTogglePlayPause}
              className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer"
              title={isPlaying ? "Pause [Space] (השהה)" : "Play [Space] (המשך)"}
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
              title="Next sentence [→ / L] (משפט הבא)"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            {/* Status indicator */}
            <div className="flex items-center gap-1.5 ml-1 sm:ml-1.5">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  isPlaying
                    ? "bg-emerald-500 animate-pulse"
                    : isPaused
                    ? "bg-amber-500"
                    : "bg-muted-foreground"
                }`}
              />
              <span className="text-xs font-semibold text-foreground font-mono">
                {currentSentenceIndex + 1} / {totalSentences}
              </span>
            </div>
          </div>

          {/* Right: Speed pills + Voice + Shortcuts Toggle + Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Speed Pills */}
            <div
              className="flex items-center border border-border/80 bg-muted/30 rounded-lg p-0.5 text-[11px]"
              dir="ltr"
            >
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
                      ? "bg-primary text-primary-foreground font-bold shadow-2xs"
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
                  className="h-7 rounded-lg border border-input bg-background/90 px-2 text-[11px] font-medium shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer max-w-[110px] sm:max-w-[160px] truncate"
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

            {/* Toggle Shortcuts Info Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowShortcuts((prev) => !prev)}
              className={`h-7 w-7 rounded-full cursor-pointer transition ${
                showShortcuts
                  ? "text-primary bg-primary/10 hover:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={showShortcuts ? "הסתר קיצורי מקלדת" : "הצג קיצורי מקלדת (Keyboard Shortcuts)"}
            >
              <Keyboard className="h-3.5 w-3.5" />
            </Button>

            {/* Stop & Close button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              title="סגור נגן [Esc] (Stop & Close)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Middle row: Mini progress bar */}
        <div className="w-full bg-muted/60 rounded-full h-1 overflow-hidden">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        {/* Bottom row: Keyboard Shortcuts Directions */}
        {showShortcuts && (
          <div
            className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-border/40 text-[11px] text-muted-foreground select-none"
            dir="rtl"
          >
            <div className="flex items-center gap-1.5 font-medium font-hebrew text-foreground/85">
              <Keyboard className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-semibold">קיצורי מקלדת:</span>
            </div>

            <div
              className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[11px]"
              dir="ltr"
            >
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 font-mono font-bold text-[10px] rounded bg-muted border border-border/80 shadow-2xs text-foreground">
                  Space
                </kbd>
                <span className="font-hebrew text-muted-foreground">הפעלה / השהיה</span>
              </span>
              <span className="text-border hidden xs:inline">•</span>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 font-mono font-bold text-[10px] rounded bg-muted border border-border/80 shadow-2xs text-foreground">
                  ←
                </kbd>
                <span className="font-hebrew text-muted-foreground">משפט קודם</span>
              </span>
              <span className="text-border hidden xs:inline">•</span>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 font-mono font-bold text-[10px] rounded bg-muted border border-border/80 shadow-2xs text-foreground">
                  →
                </kbd>
                <span className="font-hebrew text-muted-foreground">משפט הבא</span>
              </span>
              <span className="text-border hidden sm:inline">•</span>
              <span className="hidden sm:inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 font-mono font-bold text-[10px] rounded bg-muted border border-border/80 shadow-2xs text-foreground">
                  Esc
                </kbd>
                <span className="font-hebrew text-muted-foreground">סגירה</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
