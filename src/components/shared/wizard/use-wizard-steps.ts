"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Step navigation for a wizard whose step list can change as the user answers
 * (e.g. picking "vocabulary" swaps in vocabulary steps). If the current step
 * drops out of the list, the wizard stays at the same position.
 */
export function useWizardSteps<Id extends string>(steps: readonly Id[], problemFor: (id: Id) => string | null, initial?: Id) {
  const [pos, setPos] = useState<{ id: Id; index: number }>(() => {
    const id = initial && steps.includes(initial) ? initial : steps[0];
    return { id, index: Math.max(0, steps.indexOf(id)) };
  });

  const found = steps.indexOf(pos.id);
  const index = found >= 0 ? found : Math.min(pos.index, steps.length - 1);
  const step = steps[index];
  const problem = problemFor(step);
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  const goto = useCallback(
    (id: Id) => {
      const i = steps.indexOf(id);
      if (i >= 0) setPos({ id, index: i });
    },
    [steps]
  );

  const next = useCallback(() => {
    if (problem || isLast) return;
    setPos({ id: steps[index + 1], index: index + 1 });
  }, [problem, isLast, steps, index]);

  const back = useCallback(() => {
    if (isFirst) return;
    setPos({ id: steps[index - 1], index: index - 1 });
  }, [isFirst, steps, index]);

  // Bring the new question into view (matters on phones and in long dialogs).
  const topRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step]);

  return { step, index, total: steps.length, problem, isFirst, isLast, next, back, goto, topRef };
}

export type WizardSteps<Id extends string> = ReturnType<typeof useWizardSteps<Id>>;
