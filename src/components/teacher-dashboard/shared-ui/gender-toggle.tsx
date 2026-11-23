"use client";

import React from "react";
import { cn } from "cn";
import type { StudentGender } from "@/types/auth";

export type GenderChoice = StudentGender | "none";

const OPTIONS: { value: GenderChoice; label: string }[] = [
  { value: "male", label: "בן" },
  { value: "female", label: "בת" },
  { value: "none", label: "לא צוין" },
];

/** בן / בת / לא צוין segmented control: how Hebrew AI feedback addresses the student. */
export function GenderToggle({
  value,
  onChange,
  disabled,
  className,
}: {
  value: GenderChoice;
  onChange: (value: GenderChoice) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div role="group" aria-label="פנייה במשוב" className={cn("grid grid-cols-3 gap-1 rounded-lg bg-muted p-1", className)}>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
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
