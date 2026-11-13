import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { cn } from "cn";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon: LucideIcon;
  tone?: "default" | "warning" | "success" | "info" | "destructive";
  href?: string;
}

const TONES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-muted text-foreground",
  warning: "bg-warning/15 text-warning-foreground dark:text-warning",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "default", href }: StatCardProps) {
  const body = (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors group-hover:border-foreground/20">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn("flex size-8 items-center justify-center rounded-lg", TONES[tone])}>
          <Icon className="size-4" />
        </span>
      </div>
      <div className="text-3xl font-bold tabular-nums text-foreground">{value}</div>
      {hint && (
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{hint}</span>
          {href && <ArrowLeft className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />}
        </div>
      )}
    </div>
  );
  if (!href) return body;
  return (
    <Link href={href} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      {body}
    </Link>
  );
}
