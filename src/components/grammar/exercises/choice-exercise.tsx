"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { GapBankItem, McqItem } from "@/types/grammar";
import {
  chipBase,
  markClass,
  seededShuffle,
  SentenceWithBlank,
  type ExerciseProps,
} from "@/components/grammar/exercises/shared";

/** Handles both "Choose" (mcq) and "Word bank gap" (gap_bank). */
export function ChoiceExercise({ item, response, onChange, grade }: ExerciseProps<McqItem | GapBankItem>) {
  const options = item.type === "mcq" ? item.options : item.wordBank;
  const shuffled = useMemo(() => seededShuffle(options, item.id), [options, item.id]);
  const selected = response && (response.type === "mcq" || response.type === "gap_bank") ? response.value : "";
  const checked = grade !== null;

  const slot = (
    <span
      className={cn(
        "inline-block min-w-20 mx-1 px-2 border-b-2 text-center font-semibold",
        !selected && "border-muted-foreground/40 text-muted-foreground/40",
        selected && !checked && "border-primary text-primary",
        checked && grade?.isCorrect && "border-success text-success",
        checked && !grade?.isCorrect && "border-destructive text-destructive line-through"
      )}
    >
      {selected || " "}
    </span>
  );

  return (
    <div className="space-y-6">
      <SentenceWithBlank sentence={item.sentence} slot={slot} />
      <div className="flex flex-wrap gap-2" dir="ltr">
        {shuffled.map((opt) => {
          const isSel = selected === opt;
          const isAnswer = opt === item.answer;
          const state = checked
            ? isAnswer
              ? "correct"
              : isSel
                ? "wrong"
                : "dim"
            : isSel
              ? "selected"
              : "idle";
          return (
            <button
              key={opt}
              type="button"
              disabled={checked}
              onClick={() => onChange({ type: item.type, value: opt })}
              className={cn(chipBase, "min-w-24", markClass(state))}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
