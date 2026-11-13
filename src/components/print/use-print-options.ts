"use client";

import { useState } from "react";

export type PrintScope = "full" | "text_only" | "questions_only";
export type PrintLineSpacing = "normal" | "comfortable" | "double" | "spacious";

/**
 * Shared state for the "print worksheet / exam" options dialog.
 * Used by Unseen and Conversation practice pages.
 */
export function usePrintOptions() {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printScope, setPrintScope] = useState<PrintScope>("full");
  const [printLineSpacing, setPrintLineSpacing] = useState<PrintLineSpacing>("normal");
  const [printIncludeHeader, setPrintIncludeHeader] = useState(true);
  const [printIncludeVocab, setPrintIncludeVocab] = useState(true);
  const [printIncludeAnswers, setPrintIncludeAnswers] = useState(false);
  const [printSeparatePages, setPrintSeparatePages] = useState(true);

  const handlePrintNow = () => {
    setShowPrintModal(false);
    // Give the modal a moment to unmount before the browser snapshots the page.
    setTimeout(() => {
      window.print();
    }, 180);
  };

  return {
    showPrintModal,
    setShowPrintModal,
    printScope,
    setPrintScope,
    printLineSpacing,
    setPrintLineSpacing,
    printIncludeHeader,
    setPrintIncludeHeader,
    printIncludeVocab,
    setPrintIncludeVocab,
    printIncludeAnswers,
    setPrintIncludeAnswers,
    printSeparatePages,
    setPrintSeparatePages,
    handlePrintNow,
  };
}

export type PrintOptionsState = ReturnType<typeof usePrintOptions>;

/** Tailwind/utility classes for the chosen line spacing of the printed text. */
export function printLineSpacingClass(spacing: PrintLineSpacing, hasVocabGloss: boolean): string {
  switch (spacing) {
    case "spacious":
      return "print-line-spacing-spacious space-y-7";
    case "double":
      return "print-line-spacing-double space-y-6";
    case "comfortable":
      return "print-line-spacing-comfortable space-y-5";
    default:
      return hasVocabGloss
        ? "print-line-spacing-comfortable space-y-4"
        : "print-line-spacing-normal space-y-4";
  }
}
