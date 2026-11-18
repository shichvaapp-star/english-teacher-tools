"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEVELS, LEVEL_DESCRIPTION_HE, LEVEL_NAME_HE } from "@/lib/levels";
import { GradePicker } from "@/components/shared/grade-picker";
import { EXERCISE_TYPE_LABEL, ExerciseTypeTip } from "@/components/grammar/exercises";
import type { GrammarPracticeController } from "@/components/grammar/use-grammar-practice";

export function GrammarTopicsScreen({ c }: { c: GrammarPracticeController }) {
  if (c.screen !== "topics") return null;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 font-hebrew" dir="rtl">
      {c.assignmentError && (
        <p className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          לא הצלחנו לפתוח את המשימה מהמורה. אפשר לתרגל חופשי בינתיים.
        </p>
      )}

      {/* Grade – everyone may switch; defaults to the student's class */}
      <GradePicker
        grade={c.classGrade}
        onChange={c.setClassGrade}
        classGrade={c.studentGrade}
        disabled={c.gradeLocked}
        accent="grammar"
      />

      {/* Level */}
      <section className="space-y-2">
        <p className="text-sm text-muted-foreground">{c.isTeacher ? "רמה" : "הרמה שלי"}</p>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => c.setLevel(l)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-center transition-colors cursor-pointer",
                c.level === l
                  ? "border-type-grammar bg-type-grammar/10"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <span className="block text-sm font-bold">{LEVEL_NAME_HE[l]}</span>
              <span className="block text-xs text-muted-foreground">{LEVEL_DESCRIPTION_HE[l]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Optional exercise types */}
      {c.availableTypes.length > 1 && (
        <section className="space-y-2">
          <p className="text-sm text-muted-foreground">
            סוגי תרגילים <span className="text-xs">(לא חובה – בלי בחירה מקבלים שילוב)</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {c.availableTypes.map((t) => {
              const on = c.typeFilter.includes(t);
              return (
                <ExerciseTypeTip key={t} type={t}>
                <button
                  type="button"
                  onClick={() => c.toggleType(t)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
                    on ? "border-type-grammar bg-type-grammar/10 text-foreground" : "border-border text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {EXERCISE_TYPE_LABEL[t].he}
                </button>
                </ExerciseTypeTip>
              );
            })}
          </div>
        </section>
      )}

      {/* Topics */}
      {c.groups.map(({ group, topics }) => (
        <section key={group.id} className="space-y-2">
          <h2 className="text-sm font-bold text-muted-foreground">{group.titleHe}</h2>
          <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden">
            {topics.map((t) => {
              const best = c.progress[`${t.id}:${c.level}`];
              const inGrade = t.grades[c.classGrade] !== undefined;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => c.startTopic(t.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-right transition-colors hover:bg-muted/50 cursor-pointer",
                    !inGrade && "opacity-60"
                  )}
                >
                  <span
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-full",
                      best === undefined ? "bg-muted" : best >= 80 ? "bg-success" : "bg-warning"
                    )}
                    aria-hidden
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold" dir="ltr">
                      <span className="block text-right">{t.title}</span>
                    </span>
                    <span className="block text-xs text-muted-foreground">{t.titleHe}</span>
                  </span>
                  {best !== undefined && <span className="text-xs text-muted-foreground">{best}%</span>}
                  <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
