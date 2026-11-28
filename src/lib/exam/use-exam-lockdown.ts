"use client";

// Exam "lockdown" for a normal browser: the page can't stop a student from
// leaving, but it can notice. Leaving fullscreen, switching tab/app, pasting,
// spell-check replacements and writing extensions are reported to `onViolation`
// (the exam page then locks until the teacher unlocks). Copy/paste, the context
// menu and a few shortcuts are blocked outright.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExamEventSeverity, ExamEventType } from "@/types/exam";

export type ViolationHandler = (type: ExamEventType, severity: ExamEventSeverity, detail?: string) => void;

/** Writing-assistant extensions leave these in the page. */
const EXTENSION_SELECTOR = [
  "grammarly-desktop-integration",
  "grammarly-extension",
  "grammarly-popups",
  "[data-grammarly-shadow-root]",
  "lt-toolbar",
  "lt-mirror",
  "lt-highlighter",
  "quillbot-extension-portal",
].join(",");

const EXTENSION_BODY_ATTRS = ["data-gr-ext-installed", "data-new-gr-c-s-check-loaded", "data-lt-installed"];

/** Is any writing-assistant extension visible in the page right now? */
export function detectWritingExtension(): string | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector(EXTENSION_SELECTOR);
  if (el) return el.tagName.toLowerCase();
  const attr = EXTENSION_BODY_ATTRS.find(
    (a) => document.body?.hasAttribute(a) || document.documentElement.hasAttribute(a)
  );
  return attr ?? null;
}

const BLOCKED_KEYS = new Set(["c", "v", "x", "p", "s", "f", "g", "u", "z", "y", "o", "j", "i"]);

function isBlockedShortcut(e: KeyboardEvent): boolean {
  if (e.key === "F12" || e.key === "F7" || e.key === "F3") return true;
  if (!(e.ctrlKey || e.metaKey)) return false;
  return BLOCKED_KEYS.has(e.key.toLowerCase());
}

interface Options {
  /** Watch only while the student is writing (not on the intro / locked / done screens). */
  active: boolean;
  onViolation: ViolationHandler;
}

export function useExamLockdown({ active, onViolation }: Options) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const ignoreUntil = useRef(0);
  const handlerRef = useRef(onViolation);
  const activeRef = useRef(active);

  useEffect(() => {
    handlerRef.current = onViolation;
    activeRef.current = active;
  }, [onViolation, active]);

  const report = useCallback((type: ExamEventType, severity: ExamEventSeverity, detail?: string) => {
    if (!activeRef.current) return;
    if (severity === "lock" && Date.now() < ignoreUntil.current) return;
    handlerRef.current(type, severity, detail);
  }, []);

  const fullscreenSupported =
    typeof document !== "undefined" && typeof document.documentElement.requestFullscreen === "function";

  /** Must be called from a click (browser rule). */
  const enterFullscreen = useCallback(async (): Promise<boolean> => {
    // Entering fullscreen fires focus/resize events – don't count them.
    ignoreUntil.current = Date.now() + 2000;
    if (!fullscreenSupported) return false;
    if (document.fullscreenElement) return true;
    // Some embedded browsers never settle the promise – don't let the exam hang on it.
    const timeout = new Promise<boolean>((resolve) => window.setTimeout(() => resolve(false), 2500));
    const request = document.documentElement
      .requestFullscreen({ navigationUI: "hide" })
      .then(() => true)
      .catch(() => false);
    const ok = await Promise.race([request, timeout]);
    return ok || Boolean(document.fullscreenElement);
  }, [fullscreenSupported]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {
      /* already out */
    }
  }, []);

  // Fullscreen state + leaving it
  useEffect(() => {
    const onChange = () => {
      const fs = Boolean(document.fullscreenElement);
      setIsFullscreen(fs);
      if (!fs) report("exit_fullscreen", "lock");
    };
    onChange();
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [report]);

  // Leaving the page, blocked actions, extensions
  useEffect(() => {
    if (!active) return;

    const onVisibility = () => {
      if (document.visibilityState === "hidden") report("tab_hidden", "lock");
    };
    const onBlur = () => report("window_blur", "lock");
    const block = (type: ExamEventType) => (e: Event) => {
      e.preventDefault();
      if (type === "paste" || type === "drop") report(type, "lock");
    };
    const onPaste = block("paste");
    const onDrop = block("drop");
    const onCopy = block("blocked_key");
    const onContext = (e: Event) => e.preventDefault();
    const onDragStart = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (!isBlockedShortcut(e)) return;
      e.preventDefault();
      e.stopPropagation();
      const combo = `${e.ctrlKey || e.metaKey ? "Ctrl+" : ""}${e.key.length === 1 ? e.key.toUpperCase() : e.key}`;
      report("blocked_key", "flag", combo);
    };

    // DevTools docked inside a fullscreen window shrinks the page noticeably.
    let lastResizeReport = 0;
    const onResize = () => {
      if (!document.fullscreenElement) return;
      const dw = window.screen.width - window.innerWidth;
      const dh = window.screen.height - window.innerHeight;
      if ((dw > 160 || dh > 160) && Date.now() - lastResizeReport > 10_000) {
        lastResizeReport = Date.now();
        report("resize", "flag", `${window.innerWidth}×${window.innerHeight}`);
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if (node instanceof Element && (node.matches(EXTENSION_SELECTOR) || node.querySelector(EXTENSION_SELECTOR))) {
            report("extension", "lock", node.tagName.toLowerCase());
            return;
          }
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    document.addEventListener("paste", onPaste, true);
    document.addEventListener("drop", onDrop, true);
    document.addEventListener("copy", onCopy, true);
    document.addEventListener("cut", onCopy, true);
    document.addEventListener("contextmenu", onContext, true);
    document.addEventListener("dragstart", onDragStart, true);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("paste", onPaste, true);
      document.removeEventListener("drop", onDrop, true);
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("cut", onCopy, true);
      document.removeEventListener("contextmenu", onContext, true);
      document.removeEventListener("dragstart", onDragStart, true);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", onResize);
    };
  }, [active, report]);

  // Ask before leaving the page
  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [active]);

  return { isFullscreen, fullscreenSupported, enterFullscreen, exitFullscreen };
}
