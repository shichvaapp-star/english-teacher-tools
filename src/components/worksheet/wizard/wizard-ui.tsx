"use client";

import React from "react";
import { Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Big, friendly controls for the worksheet wizard: large tap targets, a clear
// "selected" state with a check mark, and plain Hebrew text.

export function ChoiceCard({
  selected,
  onClick,
  title,
  subtitle,
  icon,
  multi = false,
  className,
  disabled = false,
}: {
  selected: boolean;
  onClick: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  /** Multi-select cards show a check box; single-select ones a round dot. */
  multi?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 bg-card p-4 text-start transition-colors",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-muted/50",
        className
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center border-2",
          multi ? "rounded-md" : "rounded-full",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
        )}
        aria-hidden
      >
        {selected && <Check className="size-4" strokeWidth={3} />}
      </span>
      {icon && <span className="shrink-0 text-2xl" aria-hidden>{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-foreground">{title}</span>
        {subtitle && <span className="block text-sm text-muted-foreground">{subtitle}</span>}
      </span>
    </button>
  );
}

export function BigCounter({
  value,
  onChange,
  min = 1,
  max,
  quick = [5, 10, 15, 20],
  unit,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max: number;
  quick?: number[];
  unit: string;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const v = clamp(value);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(clamp(v + 1))}
          disabled={v >= max}
          className="flex size-14 cursor-pointer items-center justify-center rounded-2xl border-2 border-border bg-card hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="עוד אחד"
        >
          <Plus className="size-6" />
        </button>
        <div className="min-w-24 text-center">
          <div className="text-4xl font-bold tabular-nums text-foreground">{v}</div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
        <button
          type="button"
          onClick={() => onChange(clamp(v - 1))}
          disabled={v <= min}
          className="flex size-14 cursor-pointer items-center justify-center rounded-2xl border-2 border-border bg-card hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="אחד פחות"
        >
          <Minus className="size-6" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {quick
          .filter((q) => q <= max && q >= min)
          .map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onChange(q)}
              className={cn(
                "cursor-pointer rounded-xl border-2 px-4 py-1.5 text-base font-semibold",
                q === v ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {q}
            </button>
          ))}
      </div>
      <p className="text-sm text-muted-foreground">אפשר עד {max}.</p>
    </div>
  );
}

/** An on/off row with a big switch, a title and a one-line explanation. */
export function ToggleRow({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full cursor-pointer items-center gap-4 rounded-2xl border-2 bg-card p-4 text-start transition-colors",
        checked ? "border-primary/60" : "border-border hover:bg-muted/50"
      )}
    >
      <span
        className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", checked ? "bg-primary" : "bg-muted-foreground/30")}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-1 size-5 rounded-full bg-background shadow transition-all",
            checked ? "start-6" : "start-1"
          )}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-foreground">{title}</span>
        {description && <span className="block text-sm text-muted-foreground">{description}</span>}
      </span>
      <span className={cn("shrink-0 text-sm font-semibold", checked ? "text-primary" : "text-muted-foreground")}>
        {checked ? "כן" : "לא"}
      </span>
    </button>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="pt-2 text-sm font-bold text-muted-foreground">{children}</h3>;
}
