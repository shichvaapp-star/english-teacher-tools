"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeacherSession } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { loadWorksheets } from "@/lib/worksheet-storage";
import { WorksheetWizardView } from "@/components/worksheet/wizard/worksheet-wizard";
import {
  clearDraft,
  initialWizardState,
  readDraft,
  stateFromWorksheet,
  type WizardState,
} from "@/components/worksheet/wizard/use-worksheet-wizard";

/**
 * The worksheet wizard.
 *   ?fresh=1   start a new worksheet (drops any unfinished draft)
 *   ?edit=<id> open a saved worksheet to change it
 *   ?from=<id> start from a copy of a saved worksheet
 *   (none)     continue the unfinished draft, if there is one
 */
function NewWorksheet() {
  const { user } = useTeacherSession();
  const params = useSearchParams();
  const fresh = params.get("fresh") === "1";
  const editId = params.get("edit");
  const fromId = params.get("from");
  const [start, setStart] = useState<{ state: WizardState; resumed: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let next: { state: WizardState; resumed: boolean } = { state: initialWizardState(), resumed: false };
      const savedId = editId ?? fromId;
      if (savedId) {
        const saved = (await loadWorksheets(user.id)).find((x) => x.id === savedId);
        if (saved) next = { state: stateFromWorksheet(saved, !editId), resumed: false };
      } else if (fresh) {
        clearDraft(user.id);
      } else {
        const draft = readDraft(user.id);
        if (draft) next = { state: draft, resumed: true };
      }
      if (!cancelled) setStart(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [user.id, fresh, editId, fromId]);

  if (!start) return <Skeleton className="h-96 w-full rounded-2xl" />;
  return (
    <WorksheetWizardView
      key={`${editId ?? ""}|${fromId ?? ""}|${fresh}`}
      teacherId={user.id}
      initial={start.state}
      resumed={start.resumed}
    />
  );
}

export default function NewWorksheetPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <NewWorksheet />
    </Suspense>
  );
}
