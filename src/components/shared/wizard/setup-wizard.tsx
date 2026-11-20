"use client";

import React from "react";
import { CLASS_GRADES, GRADE_LABELS, type ClassGrade } from "@/lib/levels";
import { ChoiceCard } from "@/components/shared/wizard/wizard-ui";
import { WizardLayout, WizardNav, WizardSummary, type SummaryLine } from "@/components/shared/wizard/wizard-frame";
import { useWizardSteps } from "@/components/shared/wizard/use-wizard-steps";
import { ViewModeToggle } from "@/components/shared/wizard/view-mode-toggle";
import { useViewMode } from "@/components/shared/wizard/view-mode";

// Step-by-step setup for the activity screens (Unseen, Writing, Conversations,
// Grammar, Vocabulary). Each activity lists its questions; this component adds
// the progress bar, Back / Next, the summary and a final "Ready?" screen.

export interface SetupStep<Id extends string> {
  id: Id;
  title: string;
  helper?: string;
  body: React.ReactNode;
  /** A line in the "your choices" summary (omit to leave the step out). */
  summary?: { label: string; value: React.ReactNode };
  /** Hebrew reason Next is blocked, or null. */
  problem?: string | null;
}

const READY = "ready";

export function SetupWizard<Id extends string>({
  steps,
  readyTitle = "הכול מוכן!",
  readyHelper = "בדקו את הבחירות שלכם ולחצו על הכפתור כדי להתחיל.",
  readyBody,
  readyActions,
}: {
  steps: SetupStep<Id>[];
  readyTitle?: string;
  readyHelper?: string;
  /** Shown above the summary on the last screen (e.g. the chosen story). */
  readyBody?: React.ReactNode;
  /**
   * The start (and print…) buttons on the "Ready?" screen. Leave out when the
   * last question itself starts the activity (no "Ready?" screen then).
   */
  readyActions?: React.ReactNode;
}) {
  type All = Id | typeof READY;
  const ids: All[] = readyActions ? [...steps.map((s) => s.id), READY] : steps.map((s) => s.id);
  const w = useWizardSteps<All>(ids, (id) => steps.find((s) => s.id === id)?.problem ?? null);
  const current = steps.find((s) => s.id === w.step);
  const lines: SummaryLine<All>[] = steps
    .filter((s) => s.summary)
    .map((s) => ({ step: s.id, label: s.summary!.label, value: s.summary!.value }));

  return (
    <WizardLayout
      topRef={w.topRef}
      index={w.index}
      total={w.total}
      title={current ? current.title : readyTitle}
      helper={current ? current.helper : readyHelper}
      nav={
        <WizardNav
          showBack={!w.isFirst}
          onBack={w.back}
          problem={w.problem}
          nextLabel={ids[w.index + 1] === READY ? "לסיכום" : "הבא"}
          onNext={w.isLast ? undefined : w.next}
          finalAction={current ? undefined : <div className="flex flex-wrap items-center gap-2">{readyActions}</div>}
        />
      }
      summary={current ? <WizardSummary title="הבחירות שלך" lines={lines} current={w.step} onGoto={w.goto} /> : null}
    >
      {current ? (
        current.body
      ) : (
        <div className="space-y-4">
          {readyBody}
          <WizardSummary title="הבחירות שלך" lines={lines} current={READY} onGoto={w.goto} />
        </div>
      )}
    </WizardLayout>
  );
}

/** The step-by-step / one-screen switch at the top of an activity's setup screen. */
export function SetupViewModeBar() {
  const [mode, setMode] = useViewMode("activitySetup");
  return (
    <div className="flex justify-end" dir="rtl">
      <ViewModeToggle mode={mode} onChange={setMode} />
    </div>
  );
}

/** Whether the activity setup screens show the wizard. */
export function useSetupWizardMode(): boolean {
  return useViewMode("activitySetup")[0] === "wizard";
}

/** Big 7 / 8 / 9 cards, marking the student's own class. */
export function GradeChoices({
  grade,
  onChange,
  classGrade,
}: {
  grade: ClassGrade;
  onChange: (g: ClassGrade) => void;
  classGrade?: ClassGrade | null;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {CLASS_GRADES.map((g) => (
        <ChoiceCard
          key={g}
          selected={grade === g}
          onClick={() => onChange(g)}
          title={<span className="text-xl">{GRADE_LABELS[g].he}</span>}
          subtitle={classGrade === g ? "הכיתה שלי" : GRADE_LABELS[g].en}
        />
      ))}
    </div>
  );
}

export const GRADE_STEP_TEXT = {
  title: "באיזו כיתה את/ה?",
  helper: "התוכן יתאים לאוצר המילים של ספר הלימוד בכיתה שלך.",
} as const;

export const MODE_STEP_TEXT = {
  title: "איך תרצו לעבוד?",
  helper: "אימון – לבד, עם עזרה ובדיקה מיד. הגשה – העבודה נשלחת למורה.",
} as const;
