"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, ChevronLeft, ClipboardCopy, ClipboardList, Copy, Inbox, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { EmptyState } from "@/components/teacher-dashboard/shared-ui/empty-state";
import { SegmentedControl } from "@/components/teacher-dashboard/shared-ui/segmented-control";
import { StudentAvatar } from "@/components/teacher-dashboard/shared-ui/student-avatar";
import { StatusBadge, GradePill } from "@/components/teacher-dashboard/shared-ui/status-badge";
import { TypeBadge } from "@/components/teacher-dashboard/shared-ui/type-badge";
import { useDashboard } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { getSubmissionGrade, type RosterStatus } from "@/components/teacher-dashboard/dashboard-selectors";
import { DASHBOARD_BASE, turnInHref } from "@/components/teacher-dashboard/shell/nav-items";
import { describeAssignmentTarget, formatDueDate } from "@/components/teacher-dashboard/assignments/assignment-meta";
import { ProgressLegend, StackedProgress } from "@/components/teacher-dashboard/assignments/progress-bar";
import { formatCompactTime } from "@/lib/submission-time";

type Filter = "all" | RosterStatus;

export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const c = useDashboard();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");

  const assignment = c.assignments.find((a) => a.id === decodeURIComponent(id));
  const progress = assignment ? c.assignmentProgress.get(assignment.id) : undefined;

  if (!assignment || !progress) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="המשימה לא נמצאה"
        description="ייתכן שהמשימה נמחקה."
        action={
          <Link href={`${DASHBOARD_BASE}/assignments`} className={buttonVariants({ variant: "outline" })}>
            לכל המשימות
          </Link>
        }
      />
    );
  }

  const rows = progress.roster
    .filter((r) => filter === "all" || r.status === filter)
    .sort((a, b) => {
      const order: Record<RosterStatus, number> = { pending: 0, missing: 1, reviewed: 2 };
      return order[a.status] - order[b.status] || a.student.name.localeCompare(b.student.name);
    });
  const missingNames = progress.roster.filter((r) => r.status === "missing").map((r) => r.student.name);
  const due = formatDueDate(progress.dueTs, c.now);

  const copyMissing = async () => {
    try {
      await navigator.clipboard.writeText(missingNames.join("\n"));
      toast.success(`הועתקו ${missingNames.length} שמות`);
    } catch {
      toast.error("לא ניתן היה להעתיק");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={
          <Link href={`${DASHBOARD_BASE}/assignments`} className="inline-flex items-center gap-1 hover:text-foreground">
            משימות
            <ChevronLeft className="size-3" />
          </Link>
        }
        title={assignment.hebrewTitle}
        description={
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <TypeBadge type={assignment.type} />
            <span>{describeAssignmentTarget(assignment, c.students)}</span>
            {assignment.level && <span>· {assignment.level}</span>}
            {due && (
              <span className={cn("inline-flex items-center gap-1", progress.isOverdue && "text-destructive")}>
                · <CalendarClock className="size-3.5" /> {due}
              </span>
            )}
          </span>
        }
        actions={
          <>
            {progress.pending > 0 && (
              <Link
                href={`${DASHBOARD_BASE}/turn-ins?assignment=${encodeURIComponent(assignment.id)}`}
                className={buttonVariants({ className: "gap-1.5" })}
              >
                <Inbox className="size-4" />
                בדיקת {progress.pending} הגשות
              </Link>
            )}
            <Button variant="outline" onClick={() => c.openAssignModal({ template: assignment })} className="gap-1.5">
              <Copy className="size-4" />
              שכפל
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="מחק משימה"
              onClick={async () => {
                const deleted = await c.handleArchiveAssignment(assignment.id);
                if (deleted) router.push(`${DASHBOARD_BASE}/assignments`);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SegmentedControl<Filter>
              aria-label="סינון לפי סטטוס"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "הכל", count: progress.totalEligible },
                { value: "pending", label: "לבדיקה", count: progress.pending },
                { value: "missing", label: "לא הגישו", count: progress.missing },
                { value: "reviewed", label: "נבדקו", count: progress.reviewed },
              ]}
            />
            {missingNames.length > 0 && (
              <Button variant="outline" size="sm" onClick={copyMissing} className="gap-1.5">
                <ClipboardCopy />
                העתק רשימת חסרים
              </Button>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {rows.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                {progress.totalEligible === 0 ? "אין תלמידים רשומים שמשויכים למשימה זו." : "אין תלמידים בסטטוס הזה."}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-right">תלמיד/ה</TableHead>
                    <TableHead className="text-right">סטטוס</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">הוגש</TableHead>
                    <TableHead className="text-right">ציון</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(({ student, submission, status }) => (
                    <TableRow
                      key={student.id}
                      className={cn(submission && "cursor-pointer")}
                      onClick={submission ? () => router.push(turnInHref(submission.id)) : undefined}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <StudentAvatar name={student.name} className="size-7" />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-foreground" dir="ltr">
                              {student.name}
                            </div>
                            <div className="text-2xs text-muted-foreground">
                              {student.fullClass}
                              {student.group && ` · ${student.group}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={status} />
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                        {submission ? formatCompactTime(submission.submittedAt, c.now) : "—"}
                      </TableCell>
                      <TableCell>
                        {status === "reviewed" && submission ? <GradePill grade={getSubmissionGrade(submission)} /> : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <div className="text-sm font-medium text-foreground">התקדמות</div>
            <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums text-foreground">
              <span>{progress.percent}%</span>
              <span className="text-sm font-normal text-muted-foreground">
                {progress.turnedIn}/{progress.totalEligible} הגישו
              </span>
            </div>
            <StackedProgress reviewed={progress.reviewed} pending={progress.pending} total={progress.totalEligible} className="h-2" />
            <ProgressLegend reviewed={progress.reviewed} pending={progress.pending} missing={progress.missing} />
          </div>

          {(assignment.instructions || (assignment.vocabWords && assignment.vocabWords.length > 0)) && (
            <div className="space-y-3 rounded-xl border border-border bg-card p-4 text-sm">
              {assignment.instructions && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">הנחיות לתלמידים</div>
                  <p className="text-foreground">{assignment.instructions}</p>
                </div>
              )}
              {assignment.vocabWords && assignment.vocabWords.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-muted-foreground">מילים ({assignment.vocabWords.length})</div>
                  <div className="flex flex-wrap gap-1">
                    {assignment.vocabWords.map((w) => (
                      <span key={w.id || w.english} className="rounded-md bg-muted px-1.5 py-0.5 text-2xs text-foreground" dir="ltr">
                        {w.english}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="text-2xs text-muted-foreground" dir="ltr">
            {assignment.title}
          </div>
        </aside>
      </div>
    </div>
  );
}
