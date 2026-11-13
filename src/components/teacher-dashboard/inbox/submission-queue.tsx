"use client";

import React, { useEffect, useRef } from "react";
import { Inbox, Search, X } from "lucide-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SubmissionItem } from "@/types/submission";
import type { TeacherAssignment } from "@/types/assignment";
import { DAY_BUCKET_LABELS, formatCompactTime, getDayBucket, type DayBucket } from "@/lib/submission-time";
import { SegmentedControl } from "../shared-ui/segmented-control";
import { FilterSelect, type FilterOption } from "../shared-ui/filter-select";
import { StudentAvatar } from "../shared-ui/student-avatar";
import { TypeIcon } from "../shared-ui/type-badge";
import { GradePill } from "../shared-ui/status-badge";
import { EmptyState } from "../shared-ui/empty-state";
import { findAssignmentForSubmission, getSubmissionGrade } from "../dashboard-selectors";
import type { InboxFilters, InboxStatus } from "./inbox-filters";

interface SubmissionQueueProps {
  items: SubmissionItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  filters: InboxFilters;
  onFiltersChange: (patch: Partial<InboxFilters>) => void;
  statusCounts: Record<InboxStatus, number>;
  classes: string[];
  assignments: TeacherAssignment[];
  now: number;
  className?: string;
}

const TYPE_OPTIONS: FilterOption[] = [
  { value: "all", label: "כל הסוגים" },
  { value: "writing", label: "כתיבה" },
  { value: "unseen", label: "אנסין" },
  { value: "vocab", label: "אוצר מילים" },
  { value: "conversation", label: "שיחה" },
];

const GROUP_OPTIONS: FilterOption[] = [
  { value: "all", label: "כל ההקבצות" },
  { value: "א1", label: "הקבצה א1" },
  { value: "א2", label: "הקבצה א2" },
  { value: "ב", label: "הקבצה ב" },
];

export function SubmissionQueue({
  items,
  selectedId,
  onSelect,
  filters,
  onFiltersChange,
  statusCounts,
  classes,
  assignments,
  now,
  className,
}: SubmissionQueueProps) {
  const selectedRef = useRef<HTMLButtonElement | null>(null);

  // Keep the selected row visible when moving with the keyboard
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  const classOptions: FilterOption[] = [{ value: "all", label: "כל הכיתות" }, ...classes.map((c) => ({ value: c, label: `כיתה ${c}` }))];
  const assignmentOptions: FilterOption[] = [
    { value: "all", label: "כל המשימות" },
    { value: "free", label: "תרגול חופשי (ללא משימה)" },
    ...assignments.map((a) => ({ value: a.id, label: a.hebrewTitle })),
  ];

  const activeChips = [
    filters.type !== "all" && { key: "type", label: TYPE_OPTIONS.find((o) => o.value === filters.type)?.label ?? filters.type },
    filters.cls !== "all" && { key: "cls", label: `כיתה ${filters.cls}` },
    filters.group !== "all" && { key: "group", label: `הקבצה ${filters.group}` },
    filters.assignment !== "all" && {
      key: "assignment",
      label: assignmentOptions.find((o) => o.value === filters.assignment)?.label ?? "משימה",
    },
  ].filter(Boolean) as { key: keyof InboxFilters; label: string }[];

  let lastBucket: DayBucket | null = null;

  return (
    <div className={cn("flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="space-y-2.5 border-b border-border p-3">
        <SegmentedControl<InboxStatus>
          aria-label="סטטוס"
          value={filters.status}
          onChange={(status) => onFiltersChange({ status })}
          className="w-full [&>button]:flex-1 [&>button]:justify-center"
          options={[
            { value: "pending", label: "לבדיקה", count: statusCounts.pending },
            { value: "reviewed", label: "נבדקו", count: statusCounts.reviewed },
            { value: "all", label: "הכל", count: statusCounts.all },
          ]}
        />
        <div className="relative">
          <Search className="absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.q}
            onChange={(e) => onFiltersChange({ q: e.target.value })}
            placeholder="חיפוש תלמיד, משימה או קוד…"
            className="h-8 pr-8 text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FilterSelect aria-label="סוג" value={filters.type} onChange={(type) => onFiltersChange({ type })} options={TYPE_OPTIONS} className="w-full" />
          <FilterSelect aria-label="כיתה" value={filters.cls} onChange={(cls) => onFiltersChange({ cls })} options={classOptions} className="w-full" />
          <FilterSelect aria-label="הקבצה" value={filters.group} onChange={(group) => onFiltersChange({ group })} options={GROUP_OPTIONS} className="w-full" />
          <FilterSelect
            aria-label="משימה"
            value={filters.assignment}
            onChange={(assignment) => onFiltersChange({ assignment })}
            options={assignmentOptions}
            className="w-full"
          />
        </div>
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => onFiltersChange({ [chip.key]: "all" })}
                className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-full bg-muted px-2 text-2xs text-foreground hover:bg-muted/70"
              >
                {chip.label}
                <X className="size-3 text-muted-foreground" />
              </button>
            ))}
            <Button
              variant="link"
              size="xs"
              className="h-6 px-1 text-2xs"
              onClick={() => onFiltersChange({ type: "all", cls: "all", group: "all", assignment: "all" })}
            >
              נקה הכל
            </Button>
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto" role="listbox" aria-label="הגשות">
        {items.length === 0 ? (
          <EmptyState
            icon={Inbox}
            className="m-3 border-0 bg-transparent"
            title={filters.status === "pending" ? "אין הגשות שממתינות לבדיקה" : "לא נמצאו הגשות"}
            description={filters.status === "pending" ? "כל הכבוד! הכל נבדק. הגשות חדשות יופיעו כאן אוטומטית." : "נסו לשנות את הסינון."}
          />
        ) : (
          items.map((sub) => {
            const bucket = getDayBucket(sub.submittedAt, now);
            const showHeader = bucket !== lastBucket;
            lastBucket = bucket;
            const selected = sub.id === selectedId;
            const assignment = findAssignmentForSubmission(sub, assignments);
            const pending = sub.status === "submitted";
            return (
              <React.Fragment key={sub.id}>
                {showHeader && (
                  <div className="sticky top-0 z-10 border-b border-border bg-card/95 px-3 py-1.5 text-3xs font-semibold text-muted-foreground backdrop-blur">
                    {DAY_BUCKET_LABELS[bucket]}
                  </div>
                )}
                <button
                  ref={selected ? selectedRef : undefined}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelect(sub.id)}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center gap-3 border-b border-border/60 px-3 py-2.5 text-right transition-colors",
                    selected ? "bg-accent" : "hover:bg-muted/50"
                  )}
                >
                  {selected && <span className="absolute inset-y-0 right-0 w-0.5 bg-primary" />}
                  <StudentAvatar name={sub.studentName} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {pending && <span className="size-1.5 shrink-0 rounded-full bg-warning" aria-label="ממתין" />}
                      <span className={cn("truncate text-sm", pending ? "font-semibold text-foreground" : "text-foreground/90")} dir="ltr">
                        {sub.studentName}
                      </span>
                      {sub.studentClass && <span className="shrink-0 text-2xs text-muted-foreground">{sub.studentClass}</span>}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-2xs text-muted-foreground">
                      <span className="truncate">{assignment?.hebrewTitle ?? sub.hebrewTitle}</span>
                      <span aria-hidden>·</span>
                      <span className="shrink-0">{formatCompactTime(sub.submittedAt, now)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {!pending && <GradePill grade={getSubmissionGrade(sub)} />}
                    <TypeIcon type={sub.type} className="size-6" />
                  </div>
                </button>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}
