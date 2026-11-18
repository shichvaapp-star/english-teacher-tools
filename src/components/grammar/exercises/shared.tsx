"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { GrammarGrade, GrammarItem, GrammarResponse } from "@/types/grammar";
import { HeText } from "@/components/grammar/he-text";

export interface ExerciseProps<I extends GrammarItem = GrammarItem> {
  item: I;
  response: GrammarResponse | null;
  onChange: (r: GrammarResponse) => void;
  /** Set after "Check" – the exercise becomes read-only and shows marks. */
  grade: GrammarGrade | null;
}

/** Deterministic shuffle so server/client renders match and order is stable per item. */
export function seededShuffle<T>(arr: readonly T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  // Avoid returning the original order when it can be avoided.
  if (out.length > 1 && out.every((v, i) => v === arr[i])) {
    out.push(out.shift() as T);
  }
  return out;
}

/** Renders a sentence whose single blank is written as "___". */
export function SentenceWithBlank({
  sentence,
  slot,
  className,
}: {
  sentence: string;
  slot: React.ReactNode;
  className?: string;
}) {
  const [before, after = ""] = sentence.split("___");
  return (
    <p className={cn("text-lg sm:text-xl leading-loose", className)} dir="ltr">
      {before}
      {slot}
      {after}
    </p>
  );
}

export function markClass(state: "idle" | "selected" | "correct" | "wrong" | "dim"): string {
  switch (state) {
    case "selected":
      return "border-primary bg-primary/5 ring-2 ring-primary/20";
    case "correct":
      return "border-success bg-success/15 text-success font-semibold";
    case "wrong":
      return "border-destructive bg-destructive/15 text-destructive line-through";
    case "dim":
      return "opacity-50";
    default:
      return "border-border hover:bg-muted/60";
  }
}

export const chipBase =
  "inline-flex items-center justify-center rounded-lg border px-3 py-2 text-base font-medium transition-colors cursor-pointer disabled:cursor-default select-none";

export const inputBase =
  "rounded-lg border border-input bg-background px-3 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-100";

export function InstructionLine({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="text-sm text-muted-foreground font-hebrew" dir="rtl">
      <HeText text={text} />
    </p>
  );
}

export function ContextLine({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="text-sm italic text-muted-foreground" dir="ltr">
      {text}
    </p>
  );
}
