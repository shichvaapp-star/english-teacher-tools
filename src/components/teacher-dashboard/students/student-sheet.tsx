"use client";

import React from "react";
import Link from "next/link";
import { Check, Copy, Edit2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { StudentProfile } from "@/types/auth";
import { formatCompactTime } from "@/lib/submission-time";
import { useDashboard } from "../teacher-dashboard-context";
import { StudentAvatar } from "../shared-ui/student-avatar";
import { TypeIcon } from "../shared-ui/type-badge";
import { GradePill, StatusBadge } from "../shared-ui/status-badge";
import { getSubmissionGrade } from "../dashboard-selectors";
import { turnInHref } from "../shell/nav-items";

export function StudentSheet({ student, onOpenChange }: { student: StudentProfile | null; onOpenChange: (open: boolean) => void }) {
  const c = useDashboard();
  const stats = student ? c.getStudentStats(student) : null;
  const copied = student && c.copiedPinStudentId === student.id;

  return (
    <Sheet open={Boolean(student)} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full gap-0 p-0 sm:max-w-md [&>[data-slot=sheet-close]]:right-auto [&>[data-slot=sheet-close]]:left-3"
        dir="rtl"
      >
        {student && stats && (
          <>
            <SheetHeader className="gap-3 border-b border-border p-5 text-right">
              <div className="flex items-center gap-3">
                <StudentAvatar name={student.name} className="size-11 text-sm" />
                <div className="min-w-0">
                  <SheetTitle className="truncate text-lg" dir="ltr">
                    {student.name}
                  </SheetTitle>
                  <SheetDescription>
                    {student.fullClass || "ללא כיתה"} · {student.group ? `הקבצה ${student.group}` : "ללא הקבצה"}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    c.openAssignModal({ studentId: student.id });
                  }}
                  className="gap-1"
                >
                  <Send />
                  הקצה משימה
                </Button>
                <Button size="sm" variant="outline" onClick={() => c.handleOpenEditStudent(student)} className="gap-1">
                  <Edit2 />
                  עריכה
                </Button>
                <Button size="sm" variant="outline" onClick={() => c.handleCopyPin(student)} className="gap-1 font-mono" dir="ltr">
                  {copied ? <Check className="text-success" /> : <Copy />}
                  PIN {student.pin}
                </Button>
              </div>
            </SheetHeader>

            <div className="grid grid-cols-3 gap-2 border-b border-border p-5">
              <Stat label="הגשות" value={stats.total} />
              <Stat label="ממוצע" value={stats.average ?? "—"} />
              <Stat label="לבדיקה" value={stats.pending} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <h3 className="px-2 pb-2 text-xs font-semibold text-muted-foreground">היסטוריית הגשות</h3>
              {stats.submissions.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">עדיין לא הוגשו משימות.</p>
              ) : (
                <ul className="space-y-1">
                  {stats.submissions.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`${turnInHref(sub.id)}&status=all`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
                      >
                        <TypeIcon type={sub.type} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm text-foreground">{sub.hebrewTitle}</div>
                          <div className="text-2xs text-muted-foreground">{formatCompactTime(sub.submittedAt, c.now)}</div>
                        </div>
                        {sub.status === "reviewed" ? <GradePill grade={getSubmissionGrade(sub)} /> : <StatusBadge status="pending" label="ממתין" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/40 p-3 text-center">
      <div className="text-xl font-semibold tabular-nums text-foreground">{value}</div>
      <div className="text-2xs text-muted-foreground">{label}</div>
    </div>
  );
}
