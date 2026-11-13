import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "cn";

export type TurnInStatus = "reviewed" | "pending" | "missing";

const STATUS_STYLES: Record<TurnInStatus, { label: string; className: string; icon: typeof Clock }> = {
  reviewed: { label: "נבדק", className: "bg-success/10 text-success", icon: CheckCircle2 },
  pending: { label: "ממתין לבדיקה", className: "bg-warning/15 text-warning-foreground dark:text-warning", icon: Clock },
  missing: { label: "לא הוגש", className: "bg-muted text-muted-foreground", icon: Circle },
};

export function StatusBadge({ status, className, label }: { status: TurnInStatus; className?: string; label?: string }) {
  const s = STATUS_STYLES[status];
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex h-5 items-center gap-1 rounded-full px-2 text-2xs font-medium whitespace-nowrap", s.className, className)}>
      <Icon className="size-3" />
      {label ?? s.label}
    </span>
  );
}

export function gradeTone(grade: number): string {
  if (grade >= 85) return "bg-success/10 text-success";
  if (grade >= 60) return "bg-warning/15 text-warning-foreground dark:text-warning";
  return "bg-destructive/10 text-destructive";
}

export function GradePill({ grade, className }: { grade: number | undefined | null; className?: string }) {
  if (grade === undefined || grade === null) {
    return <span className={cn("text-2xs text-muted-foreground", className)}>—</span>;
  }
  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-9 items-center justify-center rounded-md px-1.5 text-xs font-semibold tabular-nums",
        gradeTone(grade),
        className
      )}
    >
      {grade}
    </span>
  );
}
