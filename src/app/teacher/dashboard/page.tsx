"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BookA,
  CalendarClock,
  Check,
  ClipboardList,
  Inbox,
  KeyRound,
  Plus,
  UserPlus,
  UserX,
} from "lucide-react";
import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/teacher-dashboard/shared-ui/stat-card";
import { StudentAvatar } from "@/components/teacher-dashboard/shared-ui/student-avatar";
import { TypeIcon } from "@/components/teacher-dashboard/shared-ui/type-badge";
import { GradePill } from "@/components/teacher-dashboard/shared-ui/status-badge";
import { AssignmentProgressCard } from "@/components/teacher-dashboard/assignments/assignment-progress-card";
import { useTeacherSession } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { getSubmissionGrade } from "@/components/teacher-dashboard/dashboard-selectors";
import { DASHBOARD_BASE, turnInHref } from "@/components/teacher-dashboard/shell/nav-items";
import { formatCompactTime, parseSubmissionTimestamp } from "@/lib/submission-time";

const LEGACY_TABS: Record<string, string> = {
  submissions: `${DASHBOARD_BASE}/turn-ins`,
  assignments: `${DASHBOARD_BASE}/assignments`,
  students: `${DASHBOARD_BASE}/students`,
  banks: `${DASHBOARD_BASE}/banks`,
  shared: `${DASHBOARD_BASE}/shared`,
  adminTeachers: `${DASHBOARD_BASE}/admin/teachers`,
  suggestions: `${DASHBOARD_BASE}/admin/suggestions`,
};

/** Old links used ?tab=…; send them to the matching route. */
function LegacyTabRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab");
  useEffect(() => {
    if (tab && LEGACY_TABS[tab]) router.replace(LEGACY_TABS[tab]);
  }, [tab, router]);
  return null;
}

const DAY = 24 * 3600 * 1000;

function greeting(now: number) {
  const h = new Date(now).getHours();
  if (h < 12) return "בוקר טוב";
  if (h < 18) return "צהריים טובים";
  return "ערב טוב";
}

export default function TeacherHomePage() {
  const { c, user } = useTeacherSession();
  const { now } = c;

  const pending = useMemo(() => c.submissions.filter((s) => s.status === "submitted"), [c.submissions]);
  const oldestPendingTs = pending.reduce((min, s) => {
    const ts = parseSubmissionTimestamp(s.submittedAt);
    return ts && ts < min ? ts : min;
  }, Infinity);
  const oldestDays = Number.isFinite(oldestPendingTs) ? Math.floor((now - oldestPendingTs) / DAY) : 0;

  const active = c.assignments.filter((a) => a.status === "active");
  const progressList = active
    .map((a) => ({ a, p: c.assignmentProgress.get(a.id) }))
    .filter((x): x is { a: (typeof active)[number]; p: NonNullable<typeof x.p> } => Boolean(x.p));
  const dueSoon = progressList.filter(({ p }) => p.dueTs > 0 && p.dueTs >= now - DAY && p.dueTs - now <= 7 * DAY);
  const overdueMissing = progressList.filter(({ p }) => p.isOverdue).reduce((n, { p }) => n + p.missing, 0);

  // Assignments that most need attention first: pending turn-ins, then nearest due date, then newest
  const spotlight = [...progressList]
    .sort((x, y) => {
      if ((y.p.pending > 0 ? 1 : 0) !== (x.p.pending > 0 ? 1 : 0)) return (y.p.pending > 0 ? 1 : 0) - (x.p.pending > 0 ? 1 : 0);
      const dx = x.p.dueTs || Infinity;
      const dy = y.p.dueTs || Infinity;
      return dx - dy;
    })
    .slice(0, 3);
  const recent = c.submissions.slice(0, 8);

  const onboarding = [
    { done: c.students.length > 0, label: "הוספת תלמידים לכיתה", action: () => c.handleOpenAddStudent(), icon: UserPlus },
    { done: c.assignments.length > 0, label: "הקצאת משימה ראשונה", action: () => c.openAssignModal(), icon: ClipboardList },
    {
      done: c.submissions.length > 0,
      label: "שיתוף קודי PIN עם התלמידים",
      href: `${DASHBOARD_BASE}/students`,
      icon: KeyRound,
    },
  ];
  const showOnboarding = !c.isLoadingStudents && onboarding.some((s) => !s.done);

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <LegacyTabRedirect />
      </Suspense>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {greeting(now)}, {user.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {pending.length > 0 ? `יש ${pending.length} הגשות שמחכות לך.` : "אין הגשות שממתינות לבדיקה."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => c.handleOpenAddStudent()} className="gap-1.5">
            <UserPlus className="size-4" />
            תלמיד/ה חדש/ה
          </Button>
          <Button variant="outline" onClick={() => c.openBankModal()} className="gap-1.5">
            <BookA className="size-4" />
            מאגר מילים
          </Button>
        </div>
      </div>

      {showOnboarding && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">מתחילים</h2>
          <p className="mb-4 text-xs text-muted-foreground">שלושה צעדים כדי שהתלמידים יתחילו להגיש.</p>
          <ol className="grid gap-2 sm:grid-cols-3">
            {onboarding.map((step, i) => {
              const Icon = step.icon;
              const content = (
                <>
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      step.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.done ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  <span className={cn("flex-1 text-sm", step.done ? "text-muted-foreground line-through" : "text-foreground")}>
                    {step.label}
                  </span>
                  {!step.done && <Icon className="size-4 text-muted-foreground" />}
                </>
              );
              const cls = "flex w-full items-center gap-3 rounded-lg border border-border p-3 text-right transition-colors hover:bg-muted/50";
              return (
                <li key={step.label}>
                  {step.href ? (
                    <Link href={step.href} className={cls}>
                      {content}
                    </Link>
                  ) : (
                    <button type="button" onClick={step.action} disabled={step.done} className={cn(cls, "cursor-pointer disabled:cursor-default")}>
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        {c.isLoadingSubmissions ? (
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)
        ) : (
          <>
            <StatCard
              label="לבדיקה"
              value={pending.length}
              icon={Inbox}
              tone={pending.length > 0 ? "warning" : "success"}
              hint={pending.length > 0 ? (oldestDays > 0 ? `הוותיקה ממתינה ${oldestDays} ימים` : "כולן מהיום") : "הכל נבדק"}
              href={`${DASHBOARD_BASE}/turn-ins`}
            />
            <StatCard
              label="להגשה השבוע"
              value={dueSoon.length}
              icon={CalendarClock}
              tone="info"
              hint={
                dueSoon.length > 0
                  ? `${dueSoon.reduce((n, { p }) => n + p.turnedIn, 0)}/${dueSoon.reduce((n, { p }) => n + p.totalEligible, 0)} הגישו`
                  : "אין מועדי הגשה קרובים"
              }
              href={`${DASHBOARD_BASE}/assignments`}
            />
            <StatCard
              label="חסרות באיחור"
              value={overdueMissing}
              icon={UserX}
              tone={overdueMissing > 0 ? "destructive" : "default"}
              hint={overdueMissing > 0 ? "תלמידים שלא הגישו משימה שמועדה עבר" : "אין הגשות באיחור"}
              href={`${DASHBOARD_BASE}/assignments`}
            />
          </>
        )}
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_24rem]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">משימות פעילות</h2>
            <Link href={`${DASHBOARD_BASE}/assignments`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              לכל המשימות
              <ArrowLeft className="size-3.5" />
            </Link>
          </div>
          {spotlight.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">אין משימות פעילות כרגע.</p>
              <Button onClick={() => c.openAssignModal()} className="gap-1.5">
                <Plus className="size-4" />
                משימה חדשה
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {spotlight.map(({ a, p }) => (
                <AssignmentProgressCard key={a.id} assignment={a} progress={p} students={c.students} now={now} compact />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">הגשות אחרונות</h2>
            <Link
              href={`${DASHBOARD_BASE}/turn-ins?status=all`}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              לכל ההגשות
              <ArrowLeft className="size-3.5" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {c.isLoadingSubmissions ? (
              <div className="space-y-2 p-3">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">עדיין אין הגשות.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      href={`${turnInHref(sub.id)}&status=all`}
                      className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50"
                    >
                      <StudentAvatar name={sub.studentName} className="size-7" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {sub.status === "submitted" && <span className="size-1.5 rounded-full bg-warning" />}
                          <span className="truncate text-sm text-foreground" dir="ltr">
                            {sub.studentName}
                          </span>
                        </div>
                        <div className="truncate text-2xs text-muted-foreground">
                          {sub.hebrewTitle} · {formatCompactTime(sub.submittedAt, now)}
                        </div>
                      </div>
                      {sub.status === "reviewed" ? <GradePill grade={getSubmissionGrade(sub)} /> : <TypeIcon type={sub.type} className="size-6" />}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {pending.length > 0 && (
            <Link href={`${DASHBOARD_BASE}/turn-ins`} className={buttonVariants({ className: "w-full gap-1.5" })}>
              <Inbox className="size-4" />
              התחילו לבדוק ({pending.length})
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}
