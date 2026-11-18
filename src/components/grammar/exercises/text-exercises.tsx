"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { GapTypeItem, TransformItem, WriteOwnItem } from "@/types/grammar";
import { HeText } from "@/components/grammar/he-text";
import {
  inputBase,
  SentenceWithBlank,
  type ExerciseProps,
} from "@/components/grammar/exercises/shared";

function markInput(checked: boolean, correct: boolean | undefined, review: boolean | undefined) {
  if (!checked) return "";
  if (correct) return "border-success bg-success/10";
  if (review) return "border-warning bg-warning/10";
  return "border-destructive bg-destructive/10";
}

/** "Type the form": base form in brackets, one inline input. */
export function GapTypeExercise({ item, response, onChange, grade }: ExerciseProps<GapTypeItem>) {
  const value = response?.type === "gap_type" ? response.value : "";
  const checked = grade !== null;
  const slot = (
    <span className="inline-flex items-baseline gap-1 mx-1">
      <input
        aria-label="answer"
        value={value}
        disabled={checked}
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={(e) => onChange({ type: "gap_type", value: e.target.value })}
        className={cn(inputBase, "w-40 py-1 text-center", markInput(checked, grade?.isCorrect, grade?.needsReview))}
        style={{ width: `${Math.max(8, value.length + 2)}ch` }}
      />
      <span className="text-sm text-muted-foreground">({item.baseForm})</span>
    </span>
  );
  return <SentenceWithBlank sentence={item.sentence} slot={slot} />;
}

/** "Transform": rewrite a full sentence. */
export function TransformExercise({ item, response, onChange, grade }: ExerciseProps<TransformItem>) {
  const value = response?.type === "transform" ? response.value : "";
  const checked = grade !== null;
  return (
    <div className="space-y-4">
      <p className="text-lg sm:text-xl" dir="ltr">{item.source}</p>
      <p className="text-sm font-semibold" dir="ltr">
        {item.taskEn}{" "}
        <span className="font-normal text-muted-foreground font-hebrew" dir="rtl">· <HeText text={item.taskHe} /></span>
      </p>
      <input
        aria-label="answer"
        value={value}
        disabled={checked}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        dir="ltr"
        onChange={(e) => onChange({ type: "transform", value: e.target.value })}
        className={cn(inputBase, "w-full", markInput(checked, grade?.isCorrect, grade?.needsReview))}
      />
    </div>
  );
}

/** "Write your own": open sentences (AI-graded). */
export function WriteOwnExercise({ item, response, onChange, grade }: ExerciseProps<WriteOwnItem>) {
  const value = response?.type === "write_own" ? response.value : "";
  const checked = grade !== null;
  return (
    <div className="space-y-4">
      <p className="text-base sm:text-lg font-medium" dir="ltr">{item.taskEn}</p>
      <p className="text-sm text-muted-foreground font-hebrew" dir="rtl"><HeText text={item.taskHe} /></p>
      <textarea
        aria-label="answer"
        value={value}
        disabled={checked}
        rows={3}
        dir="ltr"
        onChange={(e) => onChange({ type: "write_own", value: e.target.value })}
        className={cn(inputBase, "w-full resize-none", markInput(checked, grade?.isCorrect, grade?.needsReview))}
      />
    </div>
  );
}
