import React from "react";
import { cn } from "cn";

/** Stacked bar: reviewed (green) · waiting to grade (amber) · not submitted (track). */
export function StackedProgress({
  reviewed,
  pending,
  total,
  className,
}: {
  reviewed: number;
  pending: number;
  total: number;
  className?: string;
}) {
  const pct = (n: number) => (total > 0 ? Math.min(100, (n / total) * 100) : 0);
  return (
    <div
      className={cn("flex h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      role="img"
      aria-label={`${reviewed} נבדקו, ${pending} ממתינים, ${Math.max(total - reviewed - pending, 0)} לא הגישו`}
    >
      <div className="h-full bg-success transition-all" style={{ width: `${pct(reviewed)}%` }} />
      <div className="h-full bg-warning transition-all" style={{ width: `${pct(pending)}%` }} />
    </div>
  );
}

export function ProgressLegend({ reviewed, pending, missing }: { reviewed: number; pending: number; missing: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <span className="size-2 rounded-full bg-success" />
        {reviewed} נבדקו
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="size-2 rounded-full bg-warning" />
        {pending} לבדיקה
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="size-2 rounded-full bg-muted-foreground/30" />
        {missing} לא הגישו
      </span>
    </div>
  );
}
