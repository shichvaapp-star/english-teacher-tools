import React from "react";
import { cn } from "cn";

export function getInitials(name: string | undefined): string {
  if (!name) return "ST";
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST"
  );
}

export function StudentAvatar({ name, className }: { name: string | undefined; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xs font-semibold text-primary",
        className
      )}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}
