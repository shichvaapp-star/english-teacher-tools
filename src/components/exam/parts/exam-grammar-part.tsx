"use client";

// Grammar in an exam: the practice exercise components with no grade (so no
// marks), and none of the practice screen around them – no rule sheet, hints,
// "Check" button, explanations or read-aloud. One item at a time.

import React, { useState } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { GrammarExercise } from "@/components/grammar/exercises";
import { answerKey, isAnswered } from "@/lib/exam/exam-parts";
import type { ExamAnswer, GrammarPartStudent } from "@/types/exam";
import type { GrammarResponse } from "@/types/grammar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  part: GrammarPartStudent;
  answers: Record<string, ExamAnswer>;
  onAnswer: (key: string, value: ExamAnswer) => void;
}

const asResponse = (a: ExamAnswer | undefined): GrammarResponse | null =>
  typeof a === "object" && a !== null ? a : null;

export function ExamGrammarPart({ part, answers, onAnswer }: Props) {
  const [index, setIndex] = useState(0);
  const i = Math.min(index, part.items.length - 1);
  const item = part.items[i];
  if (!item) return null;
  const key = answerKey(part.id, item.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5" aria-label="שאלות">
        {part.items.map((it, n) => {
          const done = isAnswered(answers[answerKey(part.id, it.id)]);
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => setIndex(n)}
              className={cn(
                "size-8 rounded-lg border text-sm font-medium tabular-nums",
                n === i
                  ? "border-primary bg-primary text-primary-foreground"
                  : done
                    ? "border-success/50 bg-success/10"
                    : "border-border hover:bg-muted"
              )}
              aria-label={`שאלה ${n + 1}${done ? " (נענתה)" : ""}`}
            >
              {n + 1}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-5" spellCheck={false}>
        <div className="mb-3 text-xs text-muted-foreground">
          שאלה {i + 1} מתוך {part.items.length}
        </div>
        <GrammarExercise
          key={item.id}
          item={item}
          response={asResponse(answers[key])}
          onChange={(r) => onAnswer(key, r)}
          grade={null}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" disabled={i === 0} onClick={() => setIndex(i - 1)}>
          <ChevronRight />
          הקודמת
        </Button>
        <Button variant="outline" disabled={i >= part.items.length - 1} onClick={() => setIndex(i + 1)}>
          הבאה
          <ChevronLeft />
        </Button>
      </div>
    </div>
  );
}
