"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { GRADE_LABELS, LEVELS, LEVEL_DESCRIPTION_HE, LEVEL_NAME_HE } from "@/lib/levels";
import { EXERCISE_TYPE_LABEL } from "@/components/grammar/exercises";
import { ChoiceCard, SectionLabel } from "@/components/shared/wizard/wizard-ui";
import { GRADE_STEP_TEXT, GradeChoices, SetupWizard, type SetupStep } from "@/components/shared/wizard/setup-wizard";
import type { GrammarPracticeController } from "@/components/grammar/use-grammar-practice";

type Step = "grade" | "level" | "types" | "topic";

function TopicStep({ c }: { c: GrammarPracticeController }) {
  return (
    <div className="space-y-5">
      {c.groups.map(({ group, topics }) => (
        <section key={group.id} className="space-y-2">
          <SectionLabel>{group.titleHe}</SectionLabel>
          <div className="grid gap-2 sm:grid-cols-2">
            {topics.map((t) => {
              const best = c.progress[`${t.id}:${c.level}`];
              const inGrade = t.grades[c.classGrade] !== undefined;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => c.startTopic(t.id)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 border-border bg-card p-4 text-start transition-colors",
                    "hover:border-primary/50 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    !inGrade && "opacity-60"
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-foreground" dir="ltr">
                      <span className="block text-right">{t.title}</span>
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {t.titleHe}
                      {best !== undefined && ` · ${best}%`}
                    </span>
                  </span>
                  <ChevronLeft className="size-5 shrink-0 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Step-by-step version of the Grammar start screen. Picking a topic starts the round. */
export function GrammarSetupWizard({ c }: { c: GrammarPracticeController }) {
  const steps: SetupStep<Step>[] = [];
  if (!c.gradeLocked) {
    steps.push({
      id: "grade",
      ...GRADE_STEP_TEXT,
      body: <GradeChoices grade={c.classGrade} onChange={c.setClassGrade} classGrade={c.studentGrade} />,
      summary: { label: "כיתה", value: GRADE_LABELS[c.classGrade].he },
    });
  }
  steps.push({
    id: "level",
    title: c.isTeacher ? "באיזו רמה?" : "מה הרמה שלך?",
    helper: "לא בטוחים? התחילו ברמה 1.",
    body: (
      <div className="grid gap-3 sm:grid-cols-3">
        {LEVELS.map((l) => (
          <ChoiceCard
            key={l}
            selected={c.level === l}
            onClick={() => c.setLevel(l)}
            title={<span className="text-xl">{LEVEL_NAME_HE[l]}</span>}
            subtitle={LEVEL_DESCRIPTION_HE[l]}
          />
        ))}
      </div>
    ),
    summary: { label: "רמה", value: LEVEL_NAME_HE[c.level] },
  });
  if (c.availableTypes.length > 1) {
    steps.push({
      id: "types",
      title: "איזה סוגי תרגילים? (לא חובה)",
      helper: "אפשר לדלג – בלי בחירה מקבלים שילוב של כל הסוגים.",
      body: (
        <div className="grid gap-3 sm:grid-cols-2">
          {c.availableTypes.map((t) => (
            <ChoiceCard
              key={t}
              multi
              selected={c.typeFilter.includes(t)}
              onClick={() => c.toggleType(t)}
              title={EXERCISE_TYPE_LABEL[t].he}
              subtitle={EXERCISE_TYPE_LABEL[t].descHe}
            />
          ))}
        </div>
      ),
      summary: {
        label: "תרגילים",
        value: c.typeFilter.length ? c.typeFilter.map((t) => EXERCISE_TYPE_LABEL[t].he).join(", ") : "שילוב של הכול",
      },
    });
  }
  steps.push({
    id: "topic",
    title: "איזה נושא לתרגל?",
    helper: "לחצו על נושא – התרגול יתחיל מיד.",
    body: <TopicStep c={c} />,
  });

  return <SetupWizard steps={steps} />;
}
