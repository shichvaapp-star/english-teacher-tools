"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCheck, ChevronsLeft, ChevronsRight, Inbox, ListChecks, Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SubmissionItem } from "@/types/submission";
import type { TeacherAssignment } from "@/types/assignment";
import { DAY_BUCKET_LABELS, formatCompactTime, getDayBucket, type DayBucket } from "@/lib/submission-time";
import { SegmentedControl } from "../shared-ui/segmented-control";
import { FilterSelect, type FilterOption } from "../shared-ui/filter-select";
import { StudentAvatar } from "../shared-ui/student-avatar";
import { TypeIcon } from "../shared-ui/type-badge";
import { GradePill } from "../shared-ui/status-badge";
import { EmptyState } from "../shared-ui/empty-state";
import { LateBadge } from "../shared-ui/late-badge";
import { canBulkAccept, findAssignmentForSubmission, getSubmissionGrade, isAutoScored, isPending } from "../dashboard-selectors";
import type { InboxFilters, InboxStatus } from "./inbox-filters";
import { cleanClass } from "@/lib/class-names";

export interface AssignmentFocus {
  pending: number;
  turnedIn: number;
  total: number;
}

interface SubmissionQueueProps {
  items: SubmissionItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  filters: InboxFilters;
  onFiltersChange: (patch: Partial<InboxFilters>) => void;
  statusCounts: Record<InboxStatus, number>;
  classes: string[];
  assignments: TeacherAssignment[];
  isLate: (sub: SubmissionItem) => boolean;
  assignmentFocus?: AssignmentFocus;
  collapsed: boolean;
  onCollapsedChange: (next: boolean) => void;
  checked: Set<string>;
  selectionMode: boolean;
  onSelectionModeChange: (next: boolean) => void;
  onToggleChecked: (id: string) => void;
  onSetChecked: (ids: string[]) => void;
  onBulkAccept: () => Promise<void>;
  now: number;
  className?: string;
}

const TYPE_OPTIONS: FilterOption[] = [
  { value: "all", label: "כל הסוגים" },
  { value: "writing", label: "כתיבה" },
  { value: "unseen", label: "אנסין" },
  { value: "vocab", label: "אוצר מילים" },
  { value: "conversation", label: "שיחה" },
  { value: "grammar", label: "דקדוק" },
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
  isLate,
  assignmentFocus,
  collapsed,
  onCollapsedChange,
  checked,
  selectionMode,
  onSelectionModeChange,
  onToggleChecked,
  onSetChecked,
  onBulkAccept,
  now,
  className,
}: SubmissionQueueProps) {
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const [accepting, setAccepting] = useState(false);

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
    filters.assignment !== "all" && {
      key: "assignment",
      label: assignmentOptions.find((o) => o.value === filters.assignment)?.label ?? "משימה",
    },
    filters.type !== "all" && { key: "type", label: TYPE_OPTIONS.find((o) => o.value === filters.type)?.label ?? filters.type },
    filters.cls !== "all" && { key: "cls", label: `כיתה ${filters.cls}` },
    filters.group !== "all" && { key: "group", label: `הקבצה ${filters.group}` },
  ].filter(Boolean) as { key: keyof InboxFilters; label: string }[];

  // The shortcut picks computer-scored work only; AI-checked essays can still be ticked by hand
  const autoScoredPending = items.filter((s) => isPending(s) && isAutoScored(s));
  const checkedAcceptable = items.filter((s) => checked.has(s.id) && canBulkAccept(s)).length;

  const runBulk = async () => {
    setAccepting(true);
    try {
      await onBulkAccept();
    } finally {
      setAccepting(false);
    }
  };

  if (collapsed) {
    return (
      <div className={cn("flex min-h-0 flex-col items-center overflow-hidden rounded-xl border border-border bg-card", className)}>
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon-sm" className="my-2" onClick={() => onCollapsedChange(false)} aria-label="הרחב רשימה" />}>
            <ChevronsLeft />
          </TooltipTrigger>
          <TooltipContent side="left">הרחב רשימה</TooltipContent>
        </Tooltip>
        <div className="text-3xs tabular-nums text-muted-foreground">{items.length}</div>
        <div className="mt-1 min-h-0 w-full flex-1 space-y-1 overflow-y-auto px-1.5 pb-2" role="listbox" aria-label="הגשות">
          {items.map((sub) => {
            const selected = sub.id === selectedId;
            return (
              <Tooltip key={sub.id}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => onSelect(sub.id)}
                      className={cn(
                        "relative flex w-full cursor-pointer justify-center rounded-lg py-1.5 transition-colors",
                        selected ? "bg-accent ring-1 ring-primary" : "hover:bg-muted/60"
                      )}
                    />
                  }
                >
                  <StudentAvatar name={sub.studentName} className="size-8" />
                  {sub.status === "submitted" && <span className="absolute top-1 right-1.5 size-2 rounded-full bg-warning ring-2 ring-card" />}
                </TooltipTrigger>
                <TooltipContent side="left">{sub.studentName}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  }

  let lastBucket: DayBucket | null = null;

  return (
    <div className={cn("flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="space-y-2 border-b border-border p-3">
        <div className="flex items-center gap-1.5">
          <SegmentedControl<InboxStatus>
            aria-label="סטטוס"
            value={filters.status}
            onChange={(status) => onFiltersChange({ status })}
            className="flex-1 [&>button]:flex-1 [&>button]:justify-center [&>button]:px-1.5"
            options={[
              { value: "pending", label: "לבדיקה", count: statusCounts.pending },
              { value: "reviewed", label: "נבדקו", count: statusCounts.reviewed },
              { value: "all", label: "הכל" },
            ]}
          />
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon-sm" className="hidden lg:inline-flex" onClick={() => onCollapsedChange(true)} aria-label="כווץ רשימה" />}
            >
              <ChevronsRight />
            </TooltipTrigger>
            <TooltipContent side="bottom">כווץ רשימה</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.q}
              onChange={(e) => onFiltersChange({ q: e.target.value })}
              placeholder="חיפוש תלמיד או משימה…"
              className="h-8 pr-8 text-xs"
            />
          </div>
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline" size="sm" className="relative h-8 gap-1 px-2 text-xs" aria-label="סינון">
                  <SlidersHorizontal className="size-3.5" />
                  סינון
                  {activeChips.length > 0 && (
                    <span className="rounded-full bg-primary px-1.5 text-3xs text-primary-foreground tabular-nums">{activeChips.length}</span>
                  )}
                </Button>
              }
            />
            <PopoverContent align="end" className="w-64 gap-2">
              <FilterSelect aria-label="משימה" value={filters.assignment} onChange={(assignment) => onFiltersChange({ assignment })} options={assignmentOptions} className="w-full" />
              <FilterSelect aria-label="סוג" value={filters.type} onChange={(type) => onFiltersChange({ type })} options={TYPE_OPTIONS} className="w-full" />
              <FilterSelect aria-label="כיתה" value={filters.cls} onChange={(cls) => onFiltersChange({ cls })} options={classOptions} className="w-full" />
              <FilterSelect aria-label="הקבצה" value={filters.group} onChange={(group) => onFiltersChange({ group })} options={GROUP_OPTIONS} className="w-full" />
              {activeChips.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => onFiltersChange({ type: "all", cls: "all", group: "all", assignment: "all" })}>
                  נקה סינון
                </Button>
              )}
            </PopoverContent>
          </Popover>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant={selectionMode ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => onSelectionModeChange(!selectionMode)}
                  aria-pressed={selectionMode}
                  aria-label="בחירה מרובה"
                />
              }
            >
              <ListChecks />
            </TooltipTrigger>
            <TooltipContent side="bottom">בחירה מרובה (X)</TooltipContent>
          </Tooltip>
        </div>
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => onFiltersChange({ [chip.key]: "all" })}
                className="inline-flex h-6 max-w-full cursor-pointer items-center gap-1 rounded-full bg-muted px-2 text-2xs text-foreground hover:bg-muted/70"
              >
                <span className="truncate">{chip.label}</span>
                <X className="size-3 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
        {assignmentFocus && (
          <div className="rounded-md bg-muted/50 px-2.5 py-1.5 text-2xs text-muted-foreground">
            <span className="font-semibold text-foreground">{assignmentFocus.pending}</span> לבדיקה ·{" "}
            <span className="tabular-nums">
              {assignmentFocus.turnedIn}/{assignmentFocus.total}
            </span>{" "}
            הגישו
          </div>
        )}
      </div>

      {selectionMode && items.length > 0 && (
        <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-3 py-1.5 text-2xs">
          <span className="text-muted-foreground">{checked.size} נבחרו</span>
          <div className="flex items-center gap-1">
            {autoScoredPending.length > 0 && (
              <Button variant="link" size="xs" className="h-6 px-1 text-2xs" onClick={() => onSetChecked(autoScoredPending.map((s) => s.id))}>
                בחר עם ציון אוטומטי ({autoScoredPending.length})
              </Button>
            )}
            {checked.size > 0 && (
              <Button variant="link" size="xs" className="h-6 px-1 text-2xs text-muted-foreground" onClick={() => onSetChecked([])}>
                נקה
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto" role="listbox" aria-label="הגשות" aria-multiselectable={selectionMode || undefined}>
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
            const late = isLate(sub);
            return (
              <React.Fragment key={sub.id}>
                {showHeader && (
                  <div className="sticky top-0 z-10 border-b border-border bg-card/95 px-3 py-1 text-3xs font-semibold text-muted-foreground backdrop-blur">
                    {DAY_BUCKET_LABELS[bucket]}
                  </div>
                )}
                <div
                  ref={selected ? selectedRef : undefined}
                  className={cn(
                    "relative flex items-center gap-2.5 border-b border-border/60 px-3 py-2 transition-colors",
                    selected ? "bg-accent" : "hover:bg-muted/50"
                  )}
                >
                  {selected && <span className="absolute inset-y-0 right-0 w-0.5 bg-primary" />}
                  {selectionMode && (
                    <Checkbox
                      checked={checked.has(sub.id)}
                      onCheckedChange={() => onToggleChecked(sub.id)}
                      aria-label={`בחר את ${sub.studentName}`}
                      className="relative z-10"
                    />
                  )}
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => onSelect(sub.id)}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-right"
                  >
                    <StudentAvatar name={sub.studentName} className="size-8" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {pending && <span className="size-1.5 shrink-0 rounded-full bg-warning" aria-label="ממתין" />}
                        <span className={cn("truncate text-sm", pending ? "font-semibold text-foreground" : "text-foreground/90")} dir="ltr">
                          {sub.studentName}
                        </span>
                        {sub.studentClass && <span className="shrink-0 text-2xs text-muted-foreground">{cleanClass(sub.studentClass)}</span>}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-2xs text-muted-foreground">
                        <span className="truncate">{assignment?.hebrewTitle ?? sub.hebrewTitle}</span>
                        <span aria-hidden>·</span>
                        <span className="shrink-0">{formatCompactTime(sub.submittedAt, now)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {late && <LateBadge compact />}
                      {pending ? (
                        typeof sub.score === "number" ? (
                          <span className="rounded-md border border-dashed border-border px-1.5 py-0.5 text-2xs tabular-nums text-muted-foreground" title="ציון אוטומטי">
                            {sub.score}
                          </span>
                        ) : null
                      ) : (
                        <GradePill grade={getSubmissionGrade(sub)} />
                      )}
                      <TypeIcon type={sub.type} className="size-6" />
                    </div>
                  </button>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {selectionMode && checked.size > 0 && (
        <div className="space-y-1.5 border-t border-border bg-muted/30 p-3">
          <Button onClick={runBulk} disabled={accepting || checkedAcceptable === 0} className="w-full gap-1.5">
            {accepting ? <Loader2 className="animate-spin" /> : <CheckCheck />}
            אשר ציונים אוטומטיים ({checkedAcceptable})
          </Button>
          {checkedAcceptable < checked.size && (
            <p className="text-center text-3xs text-muted-foreground">{checked.size - checkedAcceptable} מהנבחרות ללא ציון אוטומטי או שכבר נבדקו – ידלגו</p>
          )}
        </div>
      )}
    </div>
  );
}
