"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// The look shared by every step-by-step wizard: a progress bar, one question
// per screen, Back / Next at the bottom and a "your choices so far" box.

export function WizardProgress({ index, total }: { index: number; total: number }) {
  const pct = Math.round(((index + 1) / Math.max(1, total)) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span className="font-semibold">
          שלב {index + 1} מתוך {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export interface SummaryLine<Id extends string> {
  step: Id;
  label: string;
  value: React.ReactNode;
}

export function WizardSummary<Id extends string>({
  title,
  lines,
  current,
  onGoto,
  className,
}: {
  title: string;
  lines: SummaryLine<Id>[];
  current: Id;
  onGoto: (step: Id) => void;
  className?: string;
}) {
  if (!lines.length) return null;
  return (
    <aside className={cn("space-y-2 rounded-2xl border border-border bg-card p-4", className)}>
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      <ul className="space-y-1.5">
        {lines.map((line) => (
          <li key={line.step + line.label} className="flex items-start gap-2 text-sm">
            <span className="w-20 shrink-0 text-muted-foreground">{line.label}</span>
            <span className="min-w-0 flex-1 font-medium text-foreground" dir="auto">
              {line.value}
            </span>
            {current !== line.step && (
              <button
                type="button"
                onClick={() => onGoto(line.step)}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Pencil className="size-3" />
                שינוי
              </button>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** Back on the right, the Hebrew reason Next is blocked, and Next (or a custom final button) on the left. */
export function WizardNav({
  showBack,
  onBack,
  problem,
  nextLabel = "הבא",
  onNext,
  finalAction,
  extra,
}: {
  showBack: boolean;
  onBack: () => void;
  problem?: string | null;
  nextLabel?: string;
  onNext?: () => void;
  /** Replaces the Next button on the last step. */
  finalAction?: React.ReactNode;
  /** Shown between Back and Next (e.g. a link). */
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
      {showBack && (
        <Button type="button" variant="outline" className="h-12 gap-1.5 px-5 text-base" onClick={onBack}>
          <ChevronRight className="size-5" />
          הקודם
        </Button>
      )}
      <span className="flex-1" />
      {extra}
      {finalAction ?? (
        <>
          {problem && <span className="text-sm font-semibold text-warning">{problem}</span>}
          {onNext && (
            <Button type="button" className="h-12 gap-1.5 px-6 text-base" onClick={onNext} disabled={!!problem}>
              {nextLabel}
              <ChevronLeft className="size-5" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}

/**
 * One wizard screen: the question, a helper line, the answers and the nav,
 * with the summary beside it on wide screens (or below it when `compact`,
 * e.g. inside a dialog).
 */
export function WizardLayout({
  topRef,
  index,
  total,
  title,
  helper,
  children,
  nav,
  summary,
  compact = false,
  className,
}: {
  topRef?: React.Ref<HTMLDivElement>;
  index: number;
  total: number;
  title: React.ReactNode;
  helper?: React.ReactNode;
  children: React.ReactNode;
  nav: React.ReactNode;
  summary?: React.ReactNode;
  compact?: boolean;
  className?: string;
}) {
  const side = !compact && !!summary;
  return (
    <div ref={topRef} dir="rtl" className={cn("scroll-mt-4 space-y-5 font-hebrew", className)}>
      <WizardProgress index={index} total={total} />
      <div className={cn("grid gap-5", side && "lg:grid-cols-3")}>
        <section className={cn("min-w-0 space-y-5 rounded-2xl border border-border bg-card/50 p-4 sm:p-6", side && "lg:col-span-2")}>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            {helper && <p className="text-base text-muted-foreground">{helper}</p>}
          </div>
          {children}
          {nav}
        </section>
        {summary}
      </div>
    </div>
  );
}
