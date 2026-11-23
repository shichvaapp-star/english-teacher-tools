import React from "react";
import { AlarmClock } from "lucide-react";
import { cn } from "cn";

/** Marks work that was turned in after the due date. */
export function LateBadge({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1 rounded-full bg-destructive/10 px-1.5 text-2xs font-medium whitespace-nowrap text-destructive",
        className
      )}
      title="הוגש אחרי מועד ההגשה"
    >
      <AlarmClock className="size-3" />
      {!compact && "באיחור"}
    </span>
  );
}
