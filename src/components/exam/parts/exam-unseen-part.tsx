"use client";

// Reading comprehension in an exam: the passage as plain text (no click-to-
// translate, glossary, audio or font tools) and the questions without any
// explanations or checking.

import React from "react";
import { cn } from "cn";
import { ExamTextArea } from "@/components/exam/exam-text-field";
import { answerKey } from "@/lib/exam/exam-parts";
import type { ExamAnswer, UnseenPartStudent } from "@/types/exam";

interface Props {
  part: UnseenPartStudent;
  answers: Record<string, ExamAnswer>;
  onAnswer: (key: string, value: ExamAnswer) => void;
}

export function ExamUnseenPart({ part, answers, onAnswer }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article
        dir="ltr"
        lang="en"
        className="h-fit select-none space-y-3 rounded-xl border border-border bg-card p-5 text-start leading-loose lg:sticky lg:top-20 lg:max-h-svh lg:overflow-y-auto lg:pb-24"
      >
        <h2 className="text-lg font-bold">{part.title}</h2>
        {part.paragraphs.map((p, i) => (
          <p key={i} className="text-base">
            <span className="me-2 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
              {i + 1}
            </span>
            {p}
          </p>
        ))}
      </article>

      <ol className="space-y-3">
        {part.questions.map((q, i) => {
          const key = answerKey(part.id, q.id);
          const a = answers[key];
          return (
            <li key={q.id} className="space-y-2 rounded-xl border border-border bg-card p-4">
              <div dir="ltr" className="flex select-none items-start gap-2 text-start">
                <span className="font-bold">{i + 1}.</span>
                <div className="flex-1">
                  <p className="font-medium">{q.prompt}</p>
                  <p className="text-xs text-muted-foreground">
                    {q.linesHint ? q.linesHint : `Paragraph ${q.paragraphIndex + 1}`}
                    {q.type === "copy" ? " · Copy the sentence from the text" : ""} · {q.points} pts
                  </p>
                </div>
              </div>
              {q.type === "mcq" && q.options ? (
                <div dir="ltr" className="grid gap-1.5">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => onAnswer(key, oi)}
                      className={cn(
                        "select-none rounded-lg border px-3 py-2 text-start text-sm transition-colors",
                        a === oi ? "border-primary bg-primary/10 font-medium" : "border-border hover:bg-muted"
                      )}
                    >
                      <span className="me-2 font-mono text-muted-foreground">{String.fromCharCode(97 + oi)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <ExamTextArea
                  rows={q.type === "copy" ? 2 : 3}
                  value={typeof a === "string" ? a : ""}
                  onChange={(v) => onAnswer(key, v)}
                  aria-label={`Answer ${i + 1}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
