"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ClipboardList, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "../teacher-dashboard-context";
import { submissionMatchesAssignment } from "../dashboard-selectors";
import { EmptyState } from "../shared-ui/empty-state";
import { DASHBOARD_BASE } from "../shell/nav-items";
import { AssignmentProgressCard } from "./assignment-progress-card";

/** Grid of assignment cards with turn-in progress, plus a "free practice" bucket. */
export function AssignmentsByProgress({ showActions = true }: { showActions?: boolean }) {
  const c = useDashboard();
  const freePractice = useMemo(
    () => c.submissions.filter((sub) => !c.assignments.some((a) => submissionMatchesAssignment(sub, a))),
    [c.submissions, c.assignments]
  );
  const freePending = freePractice.filter((s) => s.status === "submitted").length;

  if (c.assignments.length === 0 && freePractice.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="עדיין לא הוקצו משימות"
        description="הקצו משימת כתיבה, אנסין, אוצר מילים או שיחה לכיתה, להקבצה או לתלמידים בודדים."
        action={
          <Button onClick={() => c.openAssignModal()} className="gap-1.5">
            <Plus className="size-4" />
            משימה חדשה
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {c.assignments.map((a) => {
        const progress = c.assignmentProgress.get(a.id);
        if (!progress) return null;
        return (
          <AssignmentProgressCard
            key={a.id}
            assignment={a}
            progress={progress}
            students={c.students}
            now={c.now}
            onDelete={showActions ? () => c.handleArchiveAssignment(a.id) : undefined}
            onDuplicate={showActions ? () => c.openAssignModal({ template: a }) : undefined}
          />
        );
      })}
      {freePractice.length > 0 && (
        <Link
          href={`${DASHBOARD_BASE}/turn-ins?assignment=free&status=all`}
          className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-4 transition-colors hover:border-foreground/20"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Sparkles className="size-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-foreground">תרגול חופשי</div>
              <div className="text-xs text-muted-foreground">הגשות שאינן משויכות למשימה</div>
            </div>
          </div>
          <div className="mt-auto text-xs text-muted-foreground">
            <span className="text-base font-semibold tabular-nums text-foreground">{freePractice.length}</span> הגשות
            {freePending > 0 && <span> · {freePending} לבדיקה</span>}
          </div>
        </Link>
      )}
    </div>
  );
}
