"use client";

// Vocabulary in an exam: no audio, no example sentences, no answer reveal.

import React from "react";
import { cn } from "cn";
import { ExamTextField } from "@/components/exam/exam-text-field";
import { answerKey } from "@/lib/exam/exam-parts";
import type { ExamAnswer, VocabPartStudent } from "@/types/exam";

interface Props {
  part: VocabPartStudent;
  answers: Record<string, ExamAnswer>;
  onAnswer: (key: string, value: ExamAnswer) => void;
}

const INSTRUCTION: Record<VocabPartStudent["questions"][number]["format"], string> = {
  he_to_en_type: "כתבו את המילה באנגלית",
  en_to_he_choice: "בחרו את הפירוש בעברית",
  he_to_en_choice: "בחרו את המילה באנגלית",
};

export function ExamVocabPart({ part, answers, onAnswer }: Props) {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {part.questions.map((q, i) => {
        const key = answerKey(part.id, q.id);
        const a = answers[key];
        const promptIsHebrew = q.format !== "en_to_he_choice";
        return (
          <li key={q.id} className="space-y-2 rounded-xl border border-border bg-card p-4">
            <div className="flex select-none items-baseline justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                {i + 1}. {INSTRUCTION[q.format]}
              </span>
              <span dir={promptIsHebrew ? "rtl" : "ltr"} className="text-lg font-bold">
                {q.prompt}
              </span>
            </div>
            {q.options ? (
              <div className="grid grid-cols-2 gap-1.5" dir={promptIsHebrew ? "ltr" : "rtl"}>
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onAnswer(key, opt)}
                    className={cn(
                      "select-none rounded-lg border px-3 py-2 text-sm transition-colors",
                      a === opt ? "border-primary bg-primary/10 font-medium" : "border-border hover:bg-muted"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <ExamTextField
                value={typeof a === "string" ? a : ""}
                onChange={(v) => onAnswer(key, v)}
                placeholder="English"
                aria-label={`Answer ${i + 1}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
