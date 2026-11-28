"use client";

// Text inputs for exam answers: every browser helper (spell-check, auto-correct,
// auto-complete, writing extensions) turned off. Pasting, Hebrew and big
// insertions are handled by the page-wide guard in use-exam-lockdown.

import React from "react";
import { cn } from "cn";

export const NO_ASSIST_ATTRS = {
  autoComplete: "off",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  translate: "no",
  "data-gramm": "false",
  "data-gramm_editor": "false",
  "data-enable-grammarly": "false",
  "data-lt-active": "false",
  "data-ms-editor": "false",
} as const;

const base =
  "w-full rounded-lg border border-border bg-card px-3 py-2 font-sans text-base text-card-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ExamTextField({
  value,
  onChange,
  placeholder,
  className,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <input
      dir="ltr"
      lang="en"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cn(base, className)}
      {...NO_ASSIST_ATTRS}
    />
  );
}

export function ExamTextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  "aria-label"?: string;
}) {
  return (
    <textarea
      dir="ltr"
      lang="en"
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cn(base, "resize-y leading-relaxed")}
      {...NO_ASSIST_ATTRS}
    />
  );
}
