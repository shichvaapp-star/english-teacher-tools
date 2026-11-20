"use client";

import React from "react";
import { LayoutList, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/components/shared/wizard/view-mode";

const OPTIONS: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  { mode: "wizard", label: "שלב אחר שלב", icon: <ListOrdered className="size-4" /> },
  { mode: "classic", label: "הכול במסך אחד", icon: <LayoutList className="size-4" /> },
];

/** Switch between the step-by-step wizard and the everything-on-one-screen layout. */
export function ViewModeToggle({
  mode,
  onChange,
  className,
}: {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="תצוגה"
      dir="rtl"
      className={cn("inline-flex rounded-xl border border-border bg-muted/40 p-0.5 font-hebrew", className)}
    >
      {OPTIONS.map((o) => (
        <button
          key={o.mode}
          type="button"
          role="radio"
          aria-checked={mode === o.mode}
          onClick={() => onChange(o.mode)}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
            "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            mode === o.mode ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}
