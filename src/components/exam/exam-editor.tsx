"use client";

// The exam's writing box: a plain textarea with every browser helper turned
// off. Pasting, spell-check replacements and large insertions (dictation,
// text expanders, keyboard suggestions) are stopped and reported; non-English
// characters are refused. Every change is handed to `onEdit` for the keystroke log.

import React, { useEffect, useRef } from "react";
import type { ViolationHandler } from "@/lib/exam/use-exam-lockdown";

/** Characters a student may type: printable ASCII, new lines and typographic quotes/dashes. */
const ALLOWED = /^[\x20-\x7E\n\r\t’‘“”–—…]*$/;
/** More than this many characters in one input event is not normal typing. */
const MAX_INSERT = 3;

const LOCK_INPUT_TYPES: Record<string, "paste" | "drop" | "replacement"> = {
  insertFromPaste: "paste",
  insertFromPasteAsQuotation: "paste",
  insertFromYank: "paste",
  insertFromDrop: "drop",
  insertReplacementText: "replacement",
};

interface ExamEditorProps {
  value: string;
  onChange: (next: string, prev: string) => void;
  onViolation: ViolationHandler;
  disabled?: boolean;
}

export function ExamEditor({ value, onChange, onViolation, disabled }: ExamEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const valueRef = useRef(value);
  const violationRef = useRef(onViolation);
  const lastNonEnglish = useRef(0);

  useEffect(() => {
    valueRef.current = value;
    violationRef.current = onViolation;
  }, [value, onViolation]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onBeforeInput = (ev: Event) => {
      const e = ev as InputEvent;
      const lockType = LOCK_INPUT_TYPES[e.inputType];
      if (lockType) {
        e.preventDefault();
        violationRef.current(lockType, "lock", e.inputType);
        return;
      }
      // Undo/redo could bring back a whole deleted paragraph at once.
      if (e.inputType === "historyUndo" || e.inputType === "historyRedo") {
        e.preventDefault();
        return;
      }
      const data = e.data ?? "";
      if (data && !ALLOWED.test(data)) {
        e.preventDefault();
        if (Date.now() - lastNonEnglish.current > 15_000) {
          lastNonEnglish.current = Date.now();
          violationRef.current("non_english", "flag", data.slice(0, 20));
        }
        return;
      }
      if (e.inputType === "insertText" && data.length > MAX_INSERT) {
        e.preventDefault();
        violationRef.current("bulk_insert", "lock", `${data.length} תווים`);
      }
    };
    el.addEventListener("beforeinput", onBeforeInput);
    return () => el.removeEventListener("beforeinput", onBeforeInput);
  }, []);

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
