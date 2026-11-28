"use client";

import React, { useMemo } from "react";
import { Check } from "lucide-react";
import { seededShuffle } from "@/components/grammar/exercises/shared";
import type { ExamVocabHebrew } from "@/types/exam";

interface ExamWordListProps {
  words: ExamVocabHebrew[];
  usedIds: string[];
  minUsed: number;
  /** Each student sees the list in a different order (harder to compare with a neighbour). */
  shuffleSeed: string;
}

export function ExamWordList({ words, usedIds, minUsed, shuffleSeed }: ExamWordListProps) {
  const ordered = useMemo(() => seededShuffle(words, shuffleSeed), [words, shuffleSeed]);
  const used = new Set(usedIds);
  const done = usedIds.length >= minUsed;
  return (
    <div dir="rtl" className="sticky top-20 space-y-2 rounded-xl border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">מילים לשימוש</span>
        <span
          className={`rounded-md px-2 py-0.5 font-mono text-sm font-bold tabular-nums ${
            done ? "bg-success/15 text-success" : "bg-muted text-foreground"
          }`}
        >
          {usedIds.length}/{minUsed}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        כתבו באנגלית לפחות {minUsed} מהמילים. מילה שכתבתם נכון תסומן ✓.
      </p>
      <ul className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
        {ordered.map((w) => {
          const isUsed = used.has(w.id);
          return (
            <li
              key={w.id}
              className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-sm ${
                isUsed ? "border-success/40 bg-success/10 font-bold" : "border-border"
              }`}
            >
              <span>{w.he}</span>
              {isUsed && <Check className="h-4 w-4 text-success" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
