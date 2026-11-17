"use client";

import React, { useEffect } from "react";
import { Lightbulb, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GrammarExercise } from "@/components/grammar/exercises";
import { HeText } from "@/components/grammar/he-text";
import type { GrammarPracticeController } from "@/components/grammar/use-grammar-practice";
import type { GrammarItem, GrammarTopic } from "@/types/grammar";

function hintFor(item: GrammarItem, topic: GrammarTopic): string | null {
  if (item.hintHe) return item.hintHe;
  const trap = item.trapId ? topic.traps.find((t) => t.id === item.trapId) : undefined;
  return trap ? trap.whyHe : null;
}

export function GrammarPracticeScreen({ c }: { c: GrammarPracticeController }) {
  const active = c.screen === "practice" && !c.ruleOpen;
  const { grade, canCheck, check, next } = c;

  // Enter = Check, then Enter again = Next (except inside multi-line answers).
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.shiftKey || e.isComposing) return;
      if (e.target instanceof HTMLTextAreaElement) return;
      if (e.target instanceof HTMLButtonElement && !grade) return;
      if (grade) {
        e.preventDefault();
        next();
      } else if (canCheck) {
        e.preventDefault();
        check();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, grade, canCheck, check, next]);

  if (c.screen !== "practice" || !c.current || !c.topic) return null;
  const { item, isRetry } = c.current;
  const checked = c.grade !== null;
  const hint = hintFor(item, c.topic);
  const progressPct = Math.round((c.index / Math.max(1, c.queue.length)) * 100);

  const ai = c.grade?.aiGraded ? c.grade : null;
  const aiFeedback = ai && (ai.feedbackHe || ai.feedbackEn) && (
    <div className="space-y-1 rounded-lg bg-background/60 px-3 py-2">
      {ai.feedbackHe && (c.showBothLangs || c.ruleLang === "he") && (
        <p className="font-hebrew font-medium" dir="rtl"><HeText text={ai.feedbackHe} /></p>
      )}
      {ai.feedbackEn && (c.showBothLangs || c.ruleLang === "en" || !ai.feedbackHe) && (
        <p className={cn("font-medium", c.showBothLangs && "text-muted-foreground font-normal")} dir="ltr">{ai.feedbackEn}</p>
      )}
    </div>
  );

  const explanation = (
    <div className="space-y-1">
      {(c.showBothLangs || c.ruleLang === "he") && (
        <p className="font-hebrew" dir="rtl"><HeText text={item.explanationHe} /></p>
      )}
      {(c.showBothLangs || c.ruleLang === "en") && (
        <p className={cn(c.showBothLangs && "text-muted-foreground text-sm")} dir="ltr">{item.explanationEn}</p>
      )}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-type-grammar transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {c.index + 1}/{c.queue.length}
        </span>
      </div>

      {isRetry && (
        <p className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold font-hebrew" dir="rtl">
          <RotateCcw className="h-3 w-3" /> ניסיון נוסף
        </p>
      )}

      <div key={c.current.key} className="rounded-2xl border border-border bg-card p-5 sm:p-7">
        <GrammarExercise item={item} response={c.response} onChange={c.setResponse} grade={c.grade} />
      </div>

      {/* Hint */}
      {!checked && hint && (
        c.hintShown ? (
          <p className="rounded-lg bg-info/10 px-3 py-2 text-sm font-hebrew" dir="rtl">💡 <HeText text={hint} /></p>
        ) : (
          <button
            type="button"
            onClick={() => c.setHintShown(true)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer font-hebrew"
            dir="rtl"
          >
            <Lightbulb className="h-4 w-4" /> רמז
          </button>
        )
      )}

      {/* Feedback */}
      {checked && c.grade && (
        <div
          className={cn(
            "rounded-xl border px-4 py-3 space-y-2",
            c.grade.isCorrect
              ? "border-success/40 bg-success/10"
              : c.grade.needsReview
                ? "border-warning/40 bg-warning/10"
                : "border-destructive/40 bg-destructive/10"
          )}
        >
          <p className="font-bold font-hebrew" dir="rtl">
            {c.grade.isCorrect
              ? "✓ נכון!"
              : c.grade.needsReview
                ? item.type === "write_own"
                  ? "התשובה נשמרה לבדיקה"
                  : "כמעט – התשובה תיבדק שוב"
                : c.grade.score > 0
                  ? "חלקית נכון"
                  : "✗ לא בדיוק"}
          </p>
          {!c.grade.isCorrect && c.grade.expected && (
            <p className="text-sm" dir="ltr">
              <span className="text-muted-foreground">{item.type === "write_own" ? "Example: " : "Answer: "}</span>
              <span className="font-semibold">{c.grade.expected}</span>
            </p>
          )}
          {aiFeedback && <div className="text-sm">{aiFeedback}</div>}
          <div className="text-sm">{explanation}</div>
        </div>
      )}

      {/* Action */}
      <div className="flex justify-end">
        {checked ? (
          <Button size="lg" onClick={c.next} className="min-w-32 h-11 text-base font-bold cursor-pointer font-hebrew">
            {c.index + 1 < c.queue.length ? "הבא" : "לתוצאות"}
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={c.check}
            disabled={!c.canCheck}
            className="min-w-32 h-11 text-base font-bold cursor-pointer font-hebrew gap-2"
          >
            {c.aiChecking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> בודק…
              </>
            ) : (
              "בדיקה"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
