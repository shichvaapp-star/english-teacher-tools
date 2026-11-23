"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Inbox, MousePointerClick } from "lucide-react";
import { cn } from "cn";
import type { SubmissionItem } from "@/types/submission";
import { useDashboard } from "../teacher-dashboard-context";
import { findAssignmentForSubmission, isLateSubmission } from "../dashboard-selectors";
import { EmptyState } from "../shared-ui/empty-state";
import { usePersistedFlag } from "../shared-ui/use-persisted-flag";
import { SubmissionQueue, type AssignmentFocus } from "./submission-queue";
import { ReviewWorkBody, ReviewWorkHeader } from "./review-work-pane";
import { GradingPanel } from "./grading-panel";
import { applyFilters, readFilters, type InboxFilters } from "./inbox-filters";

const PARAM_KEYS: Record<keyof InboxFilters, string> = {
  status: "status",
  type: "type",
  cls: "class",
  group: "group",
  assignment: "assignment",
  q: "q",
};

const isTypingTarget = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

export function TurnInsInbox() {
  const c = useDashboard();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gradeInputRef = useRef<HTMLInputElement | null>(null);
  const [railCollapsed, setRailCollapsed] = usePersistedFlag("ett_review_rail_collapsed");
  const [selectionMode, setSelectionMode] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(() => new Set());

  const filters = useMemo(() => readFilters(new URLSearchParams(searchParams.toString())), [searchParams]);
  const selectedId = searchParams.get("id");

  const updateParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setFilters = (patch: Partial<InboxFilters>) =>
    updateParams((p) => {
      (Object.keys(patch) as (keyof InboxFilters)[]).forEach((key) => {
        const value = patch[key];
        const isDefault = key === "status" ? value === "pending" : value === "all" || value === "";
        if (isDefault || value === undefined) p.delete(PARAM_KEYS[key]);
        else p.set(PARAM_KEYS[key], value);
      });
    });

  const select = useCallback(
    (id: string | null) =>
      updateParams((p) => {
        if (id) p.set("id", id);
        else p.delete("id");
      }),
    [updateParams]
  );

  const baseFiltered = useMemo(
    () => applyFilters(c.submissions, filters, c.assignments, { ignoreStatus: true }),
    [c.submissions, filters, c.assignments]
  );
  const items = useMemo(() => applyFilters(c.submissions, filters, c.assignments), [c.submissions, filters, c.assignments]);
  const statusCounts = {
    pending: baseFiltered.filter((s) => s.status === "submitted").length,
    reviewed: baseFiltered.filter((s) => s.status === "reviewed").length,
    all: baseFiltered.length,
  };

  const isLate = useCallback(
    (sub: SubmissionItem) => {
      const assignment = findAssignmentForSubmission(sub, c.assignments);
      const dueTs = assignment ? c.assignmentProgress.get(assignment.id)?.dueTs ?? 0 : 0;
      return isLateSubmission(sub, dueTs);
    },
    [c.assignments, c.assignmentProgress]
  );

  const focusProgress = filters.assignment !== "all" && filters.assignment !== "free" ? c.assignmentProgress.get(filters.assignment) : undefined;
  const assignmentFocus: AssignmentFocus | undefined = focusProgress
    ? { pending: focusProgress.pending, turnedIn: focusProgress.turnedIn, total: focusProgress.totalEligible }
    : undefined;

  // The selected submission may sit outside the current filter (e.g. just graded, or deep-linked)
  const selected = selectedId ? c.submissions.find((s) => s.id === selectedId) ?? null : null;
  const index = selected ? items.findIndex((s) => s.id === selected.id) : -1;
  const prevItem = index > 0 ? items[index - 1] : undefined;
  const nextItem = index >= 0 ? items[index + 1] : items[0];

  // On wide screens, open the first item automatically
  useEffect(() => {
    if (!selectedId && items.length > 0 && window.matchMedia("(min-width: 1024px)").matches) {
      select(items[0].id);
    }
  }, [selectedId, items, select]);

  // When the selected AI result belongs to another submission, show the saved one for this submission
  const { aiResultSubId, loadSavedAiResult, isEvaluatingAi } = c;
  useEffect(() => {
    if (selected && aiResultSubId !== selected.id && !isEvaluatingAi) loadSavedAiResult(selected);
  }, [selected, aiResultSubId, isEvaluatingAi, loadSavedAiResult]);

  // Only count checked ids that are still in the list (graded or filtered-out ones drop away)
  const visibleChecked = useMemo(() => new Set(items.filter((s) => checked.has(s.id)).map((s) => s.id)), [items, checked]);

  const toggleChecked = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      if (document.querySelector("[role=dialog]")) return;
      const key = e.key.toLowerCase();
      if ((key === "j" || e.key === "ArrowDown") && nextItem) {
        e.preventDefault();
        select(nextItem.id);
      } else if ((key === "k" || e.key === "ArrowUp") && prevItem) {
        e.preventDefault();
        select(prevItem.id);
      } else if (key === "g" && selected) {
        e.preventDefault();
        gradeInputRef.current?.focus();
        gradeInputRef.current?.select();
      } else if (key === "a" && selected?.type === "writing" && !c.isEvaluatingAi) {
        e.preventDefault();
        c.runAiReview(selected);
      } else if (key === "x" && selected) {
        e.preventDefault();
        setSelectionMode(true);
        toggleChecked(selected.id);
      } else if (e.key === "Escape" && selected) {
        select(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextItem, prevItem, selected, select, toggleChecked, c]);

  const handleSave = async (grade: number | undefined, feedback: string, advance: boolean) => {
    if (!selected) return;
    // Decide the next item before saving: a graded item drops out of the "pending" list
    const following = index >= 0 ? items[index + 1] ?? items[index - 1] : items[0];
    await c.handleSaveGrade(selected, grade, feedback);
    if (advance) select(following && following.id !== selected.id ? following.id : null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    const following = index >= 0 ? items[index + 1] ?? items[index - 1] : undefined;
    const deleted = await c.handleDeleteSubmission(selected.id, selected.studentName);
    if (deleted) select(following?.id ?? null);
  };

  const handleBulkAccept = async () => {
    const subs = items.filter((s) => visibleChecked.has(s.id));
    const done = await c.handleBulkAccept(subs);
    if (done > 0) {
      setChecked(new Set());
      setSelectionMode(false);
    }
  };

  if (c.submissions.length === 0 && !c.isLoadingSubmissions) {
    return (
      <EmptyState
        icon={Inbox}
        title="עדיין אין הגשות"
        description="כשתלמידים יגישו משימות כתיבה, אנסין, אוצר מילים או שיחה, הן יופיעו כאן מיד."
      />
    );
  }

  const selectedAssignment = selected ? findAssignmentForSubmission(selected, c.assignments) : undefined;
  const aiResult = selected && c.aiResultSubId === selected.id ? c.writingAiResult : null;
  const corrections = aiResult?.corrections ?? selected?.corrections;

  return (
    <div
      className={cn(
        "grid gap-3 lg:h-[calc(100dvh-11rem)] lg:min-h-[32rem]",
        railCollapsed ? "lg:grid-cols-[4rem_1fr]" : "lg:grid-cols-[18rem_1fr]"
      )}
    >
      <SubmissionQueue
        className={cn("h-[calc(100dvh-11rem)] lg:h-auto", selected && "hidden lg:flex")}
        items={items}
        selectedId={selected?.id ?? null}
        onSelect={select}
        filters={filters}
        onFiltersChange={setFilters}
        statusCounts={statusCounts}
        classes={c.availableClasses}
        assignments={c.assignments}
        isLate={isLate}
        assignmentFocus={assignmentFocus}
        collapsed={railCollapsed}
        onCollapsedChange={setRailCollapsed}
        checked={visibleChecked}
        selectionMode={selectionMode}
        onSelectionModeChange={(next) => {
          setSelectionMode(next);
          if (!next) setChecked(new Set());
        }}
        onToggleChecked={toggleChecked}
        onSetChecked={(ids) => setChecked(new Set(ids))}
        onBulkAccept={handleBulkAccept}
        now={c.now}
      />
      {selected ? (
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <ReviewWorkHeader
            sub={selected}
            assignment={selectedAssignment}
            late={isLate(selected)}
            position={{ index: Math.max(index, 0), total: items.length }}
            now={c.now}
            onPrev={prevItem ? () => select(prevItem.id) : undefined}
            onNext={nextItem && nextItem.id !== selected.id ? () => select(nextItem.id) : undefined}
            onBack={() => select(null)}
            onDelete={handleDelete}
          />
          {/* Work and grading side by side on wide screens; stacked (work first) below xl */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto xl:flex-row xl:overflow-hidden">
            <div className="p-4 sm:p-6 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
              <ReviewWorkBody key={selected.id} sub={selected} corrections={corrections} />
            </div>
            <aside className="border-t border-border bg-muted/20 p-4 xl:w-80 xl:shrink-0 xl:overflow-y-auto xl:border-t-0 xl:border-r">
              <GradingPanel
                key={selected.id}
                className="xl:min-h-full"
                sub={selected}
                aiResult={aiResult}
                isEvaluatingAi={c.isEvaluatingAi && c.loadingAiSubId === selected.id}
                onRunAi={() => c.runAiReview(selected)}
                onSave={handleSave}
                hasNext={Boolean(items.find((s) => s.id !== selected.id))}
                quickComments={c.quickComments}
                onAddQuickComment={c.addQuickComment}
                onRemoveQuickComment={c.removeQuickComment}
                gradeInputRef={gradeInputRef}
              />
            </aside>
          </div>
        </div>
      ) : (
        <div className="hidden flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground lg:flex">
          <MousePointerClick className="size-6" />
          <p className="text-sm">בחרו הגשה מהרשימה</p>
        </div>
      )}
    </div>
  );
}
