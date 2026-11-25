"use client";

import React from "react";
import { cn } from "cn";
import type { StudentGender } from "@/types/auth";
import type { FeedbackLanguage } from "@/lib/feedback-language";

/** Small segmented button group with 2 or 3 options (one pressed at a time). */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  disabled,
  ariaLabel,
  className,
}: {
  options: { value: T; label: string; dir?: "ltr" | "rtl" }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("grid gap-1 rounded-lg bg-muted p-1", options.length === 2 ? "grid-cols-2" : "grid-cols-3", className)}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          dir={o.dir}
          disabled={disabled}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            "h-7 cursor-pointer rounded-md text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
            value === o.value ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export type GenderChoice = StudentGender | "none";

const GENDER_OPTIONS: { value: GenderChoice; label: string }[] = [
  { value: "male", label: "בן" },
  { value: "female", label: "בת" },
  { value: "none", label: "לא צוין" },
];

/** בן / בת / לא צוין: how Hebrew AI feedback addresses the student. */
export function GenderToggle(props: { value: GenderChoice; onChange: (value: GenderChoice) => void; disabled?: boolean; className?: string }) {
  return <SegmentedToggle options={GENDER_OPTIONS} ariaLabel="פנייה במשוב" {...props} />;
}

const LANGUAGE_OPTIONS: { value: FeedbackLanguage; label: string; dir?: "ltr" }[] = [
  { value: "he", label: "עברית" },
  { value: "en", label: "English", dir: "ltr" },
];

/** עברית / English: which language the AI writes its feedback in. */
export function FeedbackLanguageToggle(props: {
  value: FeedbackLanguage;
  onChange: (value: FeedbackLanguage) => void;
  disabled?: boolean;
  className?: string;
}) {
  return <SegmentedToggle options={LANGUAGE_OPTIONS} ariaLabel="שפת המשוב" {...props} />;
}
