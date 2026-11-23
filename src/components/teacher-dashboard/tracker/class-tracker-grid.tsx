"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Clock, Download, LayoutGrid, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { sameClass } from "@/lib/class-names";
import { formatShortDate } from "@/lib/submission-time";
import { useDashboard } from "../teacher-dashboard-context";
import { buildClassTracker, type TrackerCell, type TrackerColumn, type TrackerRow } from "../dashboard-selectors";
import { FilterSelect, type FilterOption } from "../shared-ui/filter-select";
import { SegmentedControl } from "../shared-ui/segmented-control";
import { EmptyState } from "../shared-ui/empty-state";
import { TypeIcon } from "../shared-ui/type-badge";
import { gradeTone } from "../shared-ui/status-badge";
import { assignmentHref, turnInHref } from "../shell/nav-items";

const GROUP_OPTIONS: FilterOption[] = [
  { value: "all", label: "כל ההקבצות" },
  { value: "א1", label: "הקבצה א1" },
  { value: "א2", label: "הקבצה א2" },
  { value: "ב", label: "הקבצה ב" },
];

type Range = "recent" | "all";
const RECENT_COUNT = 10;

/** Students × assignments grid: who turned in what, at a glance. */
export function ClassTrackerGrid() {
  const c = useDashboard();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Only classes that actually have students
  const classes = useMemo(
    () => c.availableClasses.filter((cls) => c.students.some((s) => sameClass(s.fullClass, cls))),
    [c.availableClasses, c.students]
  );
  const requested = searchParams.get("class");
  const cls = requested && classes.includes(requested) ? requested : classes[0] ?? "";
  const group = searchParams.get("group") || "all";
  const range: Range = searchParams.get("range") === "all" ? "all" : "recent";

  const setParam = (key: string, value: string, isDefault: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (isDefault) params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const classStudents = useMemo(
    () => c.students.filter((s) => sameClass(s.fullClass, cls) && (group === "all" || s.group === group)),
    [c.students, cls, group]
  );
  const tracker = useMemo(
    () => buildClassTracker(classStudents, c.assignments, c.assignmentProgress, c.now),
    [classStudents, c.assignments, c.assignmentProgress, c.now]
  );
  const visibleCount = range === "all" ? tracker.columns.length : Math.min(RECENT_COUNT, tracker.columns.length);
  const columns = tracker.columns.slice(0, visibleCount);
  const rows = tracker.rows.map((r) => {
    const cells = r.cells.slice(0, visibleCount);
    const assigned = cells.filter((cell) => cell.status !== "not-assigned");
    return { ...r, cells, done: assigned.filter((cell) => cell.submission).length, eligible: assigned.length };
  });

  const classOptions: FilterOption[] = classes.map((value) => ({ value, label: `כיתה ${value}` }));

  if (classes.length === 0) {
    return <EmptyState icon={LayoutGrid} title="אין עדיין תלמידים" description="הוסיפו תלמידים לכיתה כדי לעקוב אחרי ההגשות שלהם." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect aria-label="כיתה" value={cls} onChange={(v) => setParam("class", v, v === classes[0])} options={classOptions} />
        <FilterSelect aria-label="הקבצה" value={group} onChange={(v) => setParam("group", v, v === "all")} options={GROUP_OPTIONS} />
        {tracker.columns.length > RECENT_COUNT && (
          <SegmentedControl<Range>
            aria-label="טווח משימות"
            value={range}
            onChange={(v) => setParam("range", v, v === "recent")}
            options={[
              { value: "recent", label: `${RECENT_COUNT} אחרונות` },
              { value: "all", label: "כל המשימות", count: tracker.columns.length },
            ]}
          />
        )}
        <div className="flex-1" />
        <Legend />
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={columns.length === 0}
          onClick={() => downloadCsv(`${cls}${group !== "all" ? `-${group}` : ""}`, columns, rows)}
        >
          <Download />
          ייצוא CSV
        </Button>
      </div>

      {columns.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="אין משימות לכיתה הזו" description="משימות שתקצו לכיתה, להקבצה או לתלמידים ממנה יופיעו כאן." />
      ) : rows.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="אין תלמידים בסינון הזה" description="נסו הקבצה אחרת." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky right-0 z-20 min-w-44 border-b border-l border-border bg-card px-3 py-2 text-right text-xs font-medium text-muted-foreground">
                  תלמיד/ה
                </th>
                <th className="border-b border-l border-border bg-card px-2 py-2 text-center text-xs font-medium text-muted-foreground">הגיש/ה</th>
                {columns.map((col) => (
                  <ColumnHeader key={col.assignment.id} col={col} now={c.now} />
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.student.id} className="group">
                  <th
                    scope="row"
                    className="sticky right-0 z-10 border-b border-l border-border bg-card px-3 py-1.5 text-right font-normal group-hover:bg-muted"
                  >
                    <span className="block max-w-48 truncate text-sm text-foreground" dir="ltr">
                      {row.student.name}
                    </span>
                  </th>
                  <td className="border-b border-l border-border px-2 py-1.5 text-center text-xs tabular-nums text-muted-foreground group-hover:bg-muted/50">
                    <span className={cn(row.eligible > 0 && row.done === row.eligible && "font-semibold text-success")}>
                      {row.done}/{row.eligible}
                    </span>
                  </td>
                  {row.cells.map((cell, i) => (
                    <td key={columns[i].assignment.id} className="border-b border-l border-border p-1 text-center group-hover:bg-muted/50">
                      <Cell cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ColumnHeader({ col, now }: { col: TrackerColumn; now: number }) {
  const pct = col.eligible > 0 ? Math.round((col.done / col.eligible) * 100) : 0;
  const due = col.progress.dueTs ? formatShortDate(col.progress.dueTs) : null;
  const overdue = col.progress.dueTs > 0 && now > col.progress.dueTs + 24 * 3600 * 1000 - 1;
  return (
    <th className="w-24 border-b border-l border-border bg-card px-1.5 py-2 align-bottom font-normal">
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={assignmentHref(col.assignment.id)}
              className="flex flex-col items-center gap-1 rounded-md p-1 text-center transition-colors hover:bg-muted"
            />
          }
        >
          <TypeIcon type={col.assignment.type} className="size-6" />
          <span className="line-clamp-2 max-w-24 text-2xs leading-tight font-medium text-foreground">{col.assignment.hebrewTitle}</span>
          <span className={cn("text-3xs tabular-nums", pct === 100 ? "text-success" : "text-muted-foreground")}>
            {col.done}/{col.eligible} · {pct}%
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div>{col.assignment.hebrewTitle}</div>
          {due && <div className={cn(overdue && "text-destructive")}>להגשה עד {due}</div>}
        </TooltipContent>
      </Tooltip>
    </th>
  );
}

function Cell({ cell }: { cell: TrackerCell }) {
  if (cell.status === "not-assigned") {
    return <span className="text-muted-foreground/30">·</span>;
  }
  if (!cell.submission) {
    const overdue = cell.status === "missing-overdue";
    return (
      <span
        className={cn(
          "mx-auto flex size-8 items-center justify-center rounded-md",
          overdue ? "bg-destructive/10 text-destructive" : "text-muted-foreground/60"
        )}
        title={overdue ? "לא הוגש (עבר המועד)" : "עדיין לא הוגש"}
      >
        <X className="size-4" />
      </span>
    );
  }
  const graded = cell.status === "graded";
  return (
    <Link
      href={turnInHref(cell.submission.id)}
      className={cn(
        "relative mx-auto flex h-8 min-w-12 items-center justify-center gap-1 rounded-md px-1.5 text-xs font-semibold tabular-nums transition-opacity hover:opacity-80",
        graded && cell.grade !== undefined ? gradeTone(cell.grade) : "bg-success/10 text-success"
      )}
      title={graded ? "נבדק" : "הוגש · ממתין לבדיקה"}
    >
      {graded ? cell.grade ?? <Check className="size-4" /> : <Check className="size-4" />}
      {!graded && <Clock className="size-3 text-muted-foreground" />}
      {cell.late && <span className="absolute -top-0.5 -left-0.5 size-2 rounded-full bg-destructive ring-2 ring-card" aria-label="באיחור" />}
    </Link>
  );
}

function Legend() {
  return (
    <div className="hidden items-center gap-3 text-2xs text-muted-foreground md:flex">
      <span className="flex items-center gap-1">
        <Check className="size-3.5 text-success" />
        הוגש
      </span>
      <span className="flex items-center gap-1">
        <Clock className="size-3" />
        ממתין לבדיקה
      </span>
      <span className="flex items-center gap-1">
        <X className="size-3.5 text-destructive" />
        חסר
      </span>
      <span className="flex items-center gap-1">
        <span className="size-2 rounded-full bg-destructive" />
        באיחור
      </span>
    </div>
  );
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function cellText(cell: TrackerCell): string {
  switch (cell.status) {
    case "not-assigned":
      return "";
    case "missing":
    case "missing-overdue":
      return "לא הוגש";
    case "pending":
      return `הוגש${cell.late ? " (באיחור)" : ""} - לא נבדק`;
    case "graded":
      return `${cell.grade ?? "נבדק"}${cell.late ? " (באיחור)" : ""}`;
  }
}

function downloadCsv(name: string, columns: TrackerColumn[], rows: TrackerRow[]) {
  const header = ["תלמיד/ה", "הגיש/ה", ...columns.map((c) => c.assignment.hebrewTitle)];
  const lines = [
    header,
    ...rows.map((r) => [r.student.name, `${r.done}/${r.eligible}`, ...r.cells.map(cellText)]),
  ].map((cols) => cols.map((v) => csvEscape(v)).join(","));
  // BOM so Excel opens Hebrew correctly
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `מעקב-${name}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
