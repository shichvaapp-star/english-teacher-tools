"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Inbox } from "lucide-react";
import { cn } from "cn";
import { useDashboard } from "../teacher-dashboard-context";
import { findAssignmentForSubmission } from "../dashboard-selectors";
import { EmptyState } from "../shared-ui/empty-state";
import { SubmissionQueue } from "./submission-queue";
import { SubmissionDetail } from "./submission-detail";
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
      } else if (e.key === "Escape" && selected) {
        select(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextItem, prevItem, selected, select, c]);

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

  if (c.submissions.length === 0 && !c.isLoadingSubmissions) {
    return (
      <EmptyState
        icon={Inbox}
        title="עדיין אין הגשות"
        description="כשתלמידים יגישו משימות כתיבה, אנסין, אוצר מילים או שיחה, הן יופיעו כאן מיד."
      />
    );
  }

  return (
    <div className="grid gap-4 lg:h-[calc(100dvh-11rem)] lg:min-h-[32rem] lg:grid-cols-[22rem_1fr]">
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
        now={c.now}
      />
      {selected ? (
        <SubmissionDetail
          key={selected.id}
          sub={selected}
          assignment={findAssignmentForSubmission(selected, c.assignments)}
          position={{ index: Math.max(index, 0), total: items.length }}
          now={c.now}
          aiResult={c.aiResultSubId === selected.id ? c.writingAiResult : null}
          isEvaluatingAi={c.isEvaluatingAi && c.loadingAiSubId === selected.id}
          onRunAi={() => c.runAiReview(selected)}
          onSave={handleSave}
          onDelete={handleDelete}
          onPrev={prevItem ? () => select(prevItem.id) : undefined}
          onNext={nextItem && nextItem.id !== selected.id ? () => select(nextItem.id) : undefined}
          onBack={() => select(null)}
          gradeInputRef={gradeInputRef}
        />
      ) : (
        <div className="hidden items-center justify-center rounded-xl border border-dashed border-border lg:flex">
          <p className="text-sm text-muted-foreground">בחרו הגשה מהרשימה</p>
        </div>
      )}
    </div>
  );
}
