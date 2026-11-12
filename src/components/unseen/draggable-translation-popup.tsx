"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, X, CheckCircle2, GripHorizontal, RotateCcw, Plus, BookMarked } from "lucide-react";

export interface ClickedWordData {
  word: string;
  hebrew: string;
  partOfSpeech?: string;
  example?: string;
  loading?: boolean;
  saved?: boolean;
  isSelection?: boolean;
}

interface DraggableTranslationPopupProps {
  clickedWord: ClickedWordData | null;
  isSpeechActive: boolean;
  onSpeak: (word: string) => void;
  onSaveWord?: () => void;
  onClose: () => void;
  onOpenDrawer: () => void;
}

const VIEWPORT_MARGIN = 8;

export function DraggableTranslationPopup({
  clickedWord,
  isSpeechActive,
  onSpeak,
  onSaveWord,
  onClose,
  onOpenDrawer,
}: DraggableTranslationPopupProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startLeft: number;
    startTop: number;
    width: number;
    height: number;
  } | null>(null);

  const clampPosition = useCallback((x: number, y: number, width: number, height: number) => {
    if (typeof window === "undefined") return { x, y };
    const maxX = Math.max(VIEWPORT_MARGIN, window.innerWidth - width - VIEWPORT_MARGIN);
    const maxY = Math.max(VIEWPORT_MARGIN, window.innerHeight - height - VIEWPORT_MARGIN);
    return {
      x: Math.min(maxX, Math.max(VIEWPORT_MARGIN, Math.round(x))),
      y: Math.min(maxY, Math.max(VIEWPORT_MARGIN, Math.round(y))),
    };
  }, []);

  // Keep custom position within viewport bounds on window resize
  useEffect(() => {
    if (!position || typeof window === "undefined") return;

    const handleResize = () => {
      const el = containerRef.current;
      const width = el?.offsetWidth ?? 300;
      const height = el?.offsetHeight ?? 130;
      setPosition((prev) => {
        if (!prev) return null;
        return clampPosition(prev.x, prev.y, width, height);
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position, clampPosition]);

  if (!clickedWord) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only allow primary button for mouse interactions
    if (e.pointerType === "mouse" && e.button !== 0) return;

    // Do not start dragging when clicking interactive action buttons
    const target = e.target as HTMLElement | null;
    if (target?.closest("button:not([data-drag-handle]), a")) {
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    dragStateRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      width: rect.width,
      height: rect.height,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture errors on synthetic events
    }

    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;

    const dx = e.clientX - state.startClientX;
    const dy = e.clientY - state.startClientY;

    // Only transition to custom position once pointer moves > 2px if not already positioned
    if (!position && Math.hypot(dx, dy) < 2) return;

    const next = clampPosition(
      state.startLeft + dx,
      state.startTop + dy,
      state.width,
      state.height
    );
    setPosition(next);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    dragStateRef.current = null;
    setIsDragging(false);
  };

  const defaultPositionClasses = `${
    isSpeechActive ? "bottom-24 sm:bottom-28" : "bottom-4"
  } left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 animate-in fade-in-0 slide-in-from-bottom-4`;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={
        position
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
            }
          : undefined
      }
      className={`fixed z-50 print:hidden touch-none select-none ${
        position ? "" : defaultPositionClasses
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      <div
        className={`bg-card/95 backdrop-blur border shadow-2xl rounded-2xl pt-2 pb-3.5 px-4 min-w-[280px] max-w-sm mx-auto flex flex-col gap-1.5 transition-shadow ${
          isDragging
            ? "border-primary/60 ring-2 ring-primary/25"
            : "border-border/80"
        }`}
      >
        {/* Drag Handle Bar */}
        <div
          onDoubleClick={() => setPosition(null)}
          title="גרור להזזת החלונית (לחיצה כפולה לאיפוס מיקום)"
          className="flex items-center justify-center relative py-0.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          <GripHorizontal className="h-4 w-4" />
          {position && (
            <button
              type="button"
              onClick={() => setPosition(null)}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-muted/60 cursor-pointer"
              title="איפוס מיקום החלונית"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>איפוס</span>
            </button>
          )}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0 flex-1" dir="ltr">
            <span
              className={`text-foreground ${
                clickedWord.isSelection || clickedWord.word.includes(" ")
                  ? "text-xs sm:text-sm font-semibold leading-snug max-h-24 overflow-y-auto text-left break-words"
                  : "font-bold text-base capitalize"
              }`}
            >
              {clickedWord.word}
            </span>
            <button
              type="button"
              onClick={() => onSpeak(clickedWord.word)}
              className="p-1 text-muted-foreground hover:text-primary rounded cursor-pointer shrink-0 flex items-center gap-1 bg-muted/50 hover:bg-primary/10 transition-colors"
              title="הקרא בקול (Read aloud)"
            >
              <Volume2 className="h-4 w-4 text-primary" />
              {(clickedWord.isSelection || clickedWord.word.includes(" ")) && (
                <span className="text-[10px] font-bold text-primary pr-0.5" dir="rtl">
                  הקרא
                </span>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 shrink-0"
            title="סגור"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="text-right rtl pt-0.5">
          <span
            className={`font-bold text-primary block leading-relaxed ${
              clickedWord.isSelection || clickedWord.word.includes(" ")
                ? "text-sm sm:text-base"
                : "text-base"
            }`}
          >
            {clickedWord.loading ? "מתרגם..." : clickedWord.hebrew}
          </span>
        </div>

        {!clickedWord.loading && clickedWord.hebrew !== "לא נמצא תרגום" && (
          <div
            className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground pt-1.5 border-t border-border/40 mt-1"
            dir="rtl"
          >
            {clickedWord.saved ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>נשמר בפנקס המילים שלך!</span>
              </span>
            ) : clickedWord.word.trim().split(/\s+/).length <= 5 ? (
              <button
                type="button"
                onClick={onSaveWord}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="h-3 w-3 shrink-0" />
                <BookMarked className="h-3 w-3 shrink-0" />
                <span>הוסף לפנקס המילים</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSpeak(clickedWord.word)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 font-bold text-[11px] transition-colors cursor-pointer"
              >
                <Volume2 className="h-3.5 w-3.5 shrink-0" />
                <span>הקרא משפט נבחר</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenDrawer}
              className="text-primary hover:underline cursor-pointer font-medium shrink-0"
            >
              {clickedWord.saved ? "תרגול בפנקס ←" : "פנקס המילים ←"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
