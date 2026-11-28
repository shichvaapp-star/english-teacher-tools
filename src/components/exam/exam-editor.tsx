"use client";

// The exam's writing box: a plain textarea with every browser helper turned
// off. The page-wide guard (use-exam-lockdown) stops pasting, spell-check
// replacements, large insertions and non-English characters; this adds a
// safety net for browsers that skip `beforeinput`. Every change is handed to `onEdit` for the keystroke log.

import React, { useEffect, useRef } from "react";
import { ALLOWED_TEXT, MAX_INSERT, type ViolationHandler } from "@/lib/exam/use-exam-lockdown";

/** Allowed characters in the safety net below (same rule as the page-wide guard). */
const ALLOWED = ALLOWED_TEXT;

interface ExamEditorProps {
  value: string;
  onChange: (next: string, prev: string) => void;
  onViolation: ViolationHandler;
  disabled?: boolean;
}

export function ExamEditor({ value, onChange, onViolation, disabled }: ExamEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    const prev = valueRef.current;
    // Safety net for browsers that skip beforeinput: a big jump in one event.
    const inserted = next.length - prev.length;
    if (inserted > MAX_INSERT + 1) {
      onViolation("bulk_insert", "lock", `${inserted} תווים`);
      return;
    }
    if (!ALLOWED.test(next)) {
      const cleaned = next.replace(/[^\x20-\x7E\n\r\t’‘“”–—…]/g, "");
      if (cleaned !== prev) onChange(cleaned, prev);
      return;
    }
    onChange(next, prev);
  };

  return (
    <textarea
      ref={ref}
      dir="ltr"
      lang="en"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      autoFocus
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      translate="no"
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      data-lt-active="false"
      data-ms-editor="false"
      aria-label="Your essay"
      placeholder="Start writing here…"
      className="min-h-96 w-full flex-1 resize-none rounded-xl border border-border bg-card p-5 font-sans text-lg leading-loose text-card-foreground shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
    />
  );
}
