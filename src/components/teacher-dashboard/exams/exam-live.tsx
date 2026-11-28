"use client";

// Live lab view for one exam: open / extend / end, every student's status as a
// seat map or grid, lock alerts with Unlock, and the event feed.

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "cn";
import { useTeacherSession } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { useConfirm } from "@/components/teacher-dashboard/shared-ui/confirm-dialog";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { DASHBOARD_BASE, examHref } from "@/components/teacher-dashboard/shell/nav-items";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExamStatusBadge } from "./exam-status-badge";
import {
  closeExam,
  extendExam,
  forceSubmitSession,
  loadTeacherExam,
  openExam,
  sendExamToGrading,
  subscribeExam,
  subscribeExamSessions,
  tsMillis,
  unlockSession,
  type TeacherExamBundle,
} from "@/lib/exam/exam-storage";
import { assignVariants } from "@/lib/exam/seat-plan";
import { isStudentTargeted } from "@/lib/exam/exam-targeting";
import { EXAM_EVENT_LABEL_HE, EXAM_KIND_HE, type ExamDoc, type ExamSessionDoc } from "@/types/exam";
import { examKind, examParts, hasWritingPart, isAnswered } from "@/lib/exam/exam-parts";
import {
  ClipboardList,
  Eye,
  Clock,
  Inbox,
  Loader2,
  Lock,
  LockOpen,
  Pencil,
  Play,
  Plus,
  SearchCheck,
  Send,
  Square,
} from "lucide-react";

const STALE_MS = 45_000;

type CardState = "not_started" | "active" | "locked" | "submitted" | "offline";

const STATE_STYLE: Record<CardState, string> = {
  not_started: "border-border bg-muted/40 text-muted-foreground",
  active: "border-success/50 bg-success/10",
  offline: "border-warning/50 bg-warning/10",
  locked: "border-destructive bg-destructive/15",
  submitted: "border-info/50 bg-info/10",
};

const STATE_LABEL: Record<CardState, string> = {
  not_started: "לא התחיל/ה",
  active: "כותב/ת",
  offline: "לא מחובר/ת",
  locked: "נעול",
  submitted: "הגיש/ה",
};

function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;
}

function timeAgo(ms: number | null, now: number): string {
  if (ms === null) return "—";
  const s = Math.max(0, Math.round((now - ms) / 1000));
  return s < 60 ? `לפני ${s} שנ׳` : `לפני ${Math.round(s / 60)} דק׳`;
}

function cardState(s: ExamSessionDoc | undefined, now: number): CardState {
  if (!s) return "not_started";
  if (s.state === "submitted") return "submitted";
  if (s.state === "locked") return "locked";
  const seen = tsMillis(s.lastSeenAt);
  return seen !== null && now - seen > STALE_MS ? "offline" : "active";
}

export function ExamLive({ examId }: { examId: string }) {
  const { c, user } = useTeacherSession();
  const confirm = useConfirm();
  const [bundle, setBundle] = useState<TeacherExamBundle | null | undefined>(undefined);
  const [exam, setExam] = useState<ExamDoc | null>(null);
  const [sessions, setSessions] = useState<ExamSessionDoc[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const knownLocks = useRef<Set<string>>(new Set());

  useEffect(() => {
    loadTeacherExam(examId).then(setBundle).catch(() => setBundle(null));
    return subscribeExam(examId, setExam);
  }, [examId]);

  useEffect(
    () =>
      subscribeExamSessions(examId, user.id, setSessions, () =>
        toast.error("החיבור למעקב החי נכשל – רעננו את הדף")
      ),
    [examId, user.id]
  );

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Alert on every new lock
  useEffect(() => {
    sessions.forEach((s) => {
      if (s.state === "locked" && !knownLocks.current.has(s.id)) {
        knownLocks.current.add(s.id);
        toast.error(`${s.studentName}: המבחן ננעל`, {
          description: s.lockReason ? EXAM_EVENT_LABEL_HE[s.lockReason] : undefined,
        });
      }
      if (s.state !== "locked") knownLocks.current.delete(s.id);
    });
  }, [sessions]);

  const live = exam ?? bundle?.exam ?? null;
  const byStudent = useMemo(() => new Map(sessions.map((s) => [s.studentId, s])), [sessions]);
  const eligible = useMemo(
    () =>
      live
        ? c.students.filter((s) => isStudentTargeted(live, s)).sort((a, b) => a.name.localeCompare(b.name, "he"))
        : [],
    [c.students, live]
  );
  const roster = useMemo(() => {
    const ids = new Map<string, string>(eligible.map((s) => [s.id, s.name]));
    sessions.forEach((s) => ids.has(s.studentId) || ids.set(s.studentId, s.studentName));
    return [...ids.entries()].map(([id, name]) => ({ id, name }));
  }, [eligible, sessions]);

  if (bundle === undefined) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (bundle === null || !live) return <p className="text-sm text-muted-foreground">המבחן לא נמצא.</p>;

  const metas = examParts(live);
  const writingPart = hasWritingPart(live);
  const itemTotal = metas.filter((m) => m.type !== "writing").reduce((t, m) => t + m.itemCount, 0);
  const closesAt = tsMillis(live.closesAt);
  const remaining = closesAt !== null ? closesAt - now : null;
  const counts = roster.reduce<Record<CardState, number>>(
    (acc, s) => {
      acc[cardState(byStudent.get(s.id), now)]++;
      return acc;
    },
    { not_started: 0, active: 0, offline: 0, locked: 0, submitted: 0 }
  );

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    try {
      await fn();
      toast.success(ok);
    } catch (err) {
      console.warn(err);
      toast.error("הפעולה נכשלה");
    } finally {
      setBusy(false);
    }
  };

  const handleOpen = async () => {
    const yes = await confirm({
      title: "לפתוח את המבחן עכשיו?",
      description: `התלמידים יוכלו להתחיל, והשעון (${live.durationMin} דקות) מתחיל לרוץ עכשיו.`,
      confirmLabel: "פתיחה",
    });
    if (!yes) return;
    const variants = assignVariants(
      eligible.map((s) => s.id),
      live.variantKeys,
      live.seatPlan
    );
    await run(() => openExam(live, variants), "המבחן נפתח");
  };

  const handleClose = async () => {
    const yes = await confirm({
      title: "לסיים את המבחן?",
      description: "כל מי שעדיין כותב/ת יוגש/תוגש אוטומטית עם הטקסט שנשמר.",
      confirmLabel: "סיום והגשה",
      destructive: true,
    });
    if (!yes) return;
    await run(() => closeExam(live, sessions), "המבחן הסתיים");
  };

  const handleSendToGrading = async () => {
    await run(async () => {
      const n = await sendExamToGrading({ ...bundle, exam: live }, sessions, user.name);
      await c.fetchSubmissions();
      return n;
    }, "החיבורים נשלחו לתיבת ההגשות");
  };

  const selectedSession = selected ? byStudent.get(selected) : undefined;
  const selectedName = roster.find((r) => r.id === selected)?.name ?? selectedSession?.studentName ?? "";

  const allEvents = sessions
    .flatMap((s) => (s.events ?? []).map((e) => ({ ...e, studentName: s.studentName, studentId: s.studentId })))
    .filter((e) => e.severity !== "info" || e.type === "unlock" || e.type === "submit")
    .sort((a, b) => b.t - a.t)
    .slice(0, 60);

  const renderCard = (studentId: string, name: string) => {
    const s = byStudent.get(studentId);
    const st = cardState(s, now);
    const locks = s?.events?.filter((e) => e.severity === "lock").length ?? 0;
    const flags = s?.events?.filter((e) => e.severity === "flag").length ?? 0;
    return (
      <button
        key={studentId}
        type="button"
        onClick={() => setSelected(studentId)}
        className={cn("flex min-h-24 flex-col gap-1 rounded-lg border p-2 text-start text-xs transition-colors", STATE_STYLE[st])}
      >
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-sm font-bold text-foreground">{name}</span>
          {st === "locked" && <Lock className="h-4 w-4 shrink-0 text-destructive" />}
        </div>
        <div className="flex items-center gap-1">
          <span>{STATE_LABEL[st]}</span>
          {s && live.variantKeys.length > 1 && (
            <Badge variant="outline" className="h-4 px-1 text-3xs">
              {s.variantKey}
            </Badge>
          )}
        </div>
        {s && (
          <div className="font-mono tabular-nums text-muted-foreground">
            {itemTotal > 0 && `${Object.values(s.answers ?? {}).filter(isAnswered).length}/${itemTotal} שאלות`}
            {itemTotal > 0 && writingPart && " · "}
            {writingPart && `${s.wordCount} מילים · ${s.vocabUsedIds?.length ?? 0}/${live.minVocabUsed}`}
          </div>
        )}
        {s && st !== "submitted" && <div className="text-3xs text-muted-foreground">{timeAgo(tsMillis(s.lastSeenAt), now)}</div>}
        {(locks > 0 || flags > 0) && (
          <div className="text-3xs font-medium text-destructive">
            {locks > 0 && `${locks} נעילות`} {flags > 0 && `· ${flags} התראות`}
          </div>
        )}
      </button>
    );
  };

  const plan = live.seatPlan;
  const kindHe = EXAM_KIND_HE[examKind(live)];
  // Empty back rows of the lab aren't worth the screen space.
  const usedRows = plan ? Math.max(0, ...plan.seats.map((s) => s.row + 1)) : 0;
  const seatedIds = new Set(plan?.seats.map((s) => s.studentId) ?? []);
  const unseated = roster.filter((r) => !seatedIds.has(r.id));
  const nameOf = new Map(roster.map((r) => [r.id, r.name]));

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={<Link href={`${DASHBOARD_BASE}/exams`}>מבחנים</Link>}
        title={
          <span className="flex flex-wrap items-center gap-2">
            {kindHe}: {live.title} <ExamStatusBadge status={live.status} />
          </span>
        }
        description={`${live.durationMin} דקות · ${metas.map((m) => `${m.title} (${m.points} נק׳)`).join(" · ")}`}
        actions={
          <>
            {live.status === "draft" && (
              <>
                <Link href={`${examHref(live.id)}/edit`} className={buttonVariants({ variant: "outline" })}>
                  <Pencil />
                  עריכה
                </Link>
                <a href={`/exam/${encodeURIComponent(live.id)}?preview=1`} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline" })}>
                  <Eye />
                  תצוגת תלמיד
                </a>
                <Button onClick={() => void handleOpen()} disabled={busy}>
                  <Play />
                  פתיחת ה{kindHe}
                </Button>
              </>
            )}
            {live.status === "open" && (
              <>
                <Button variant="outline" onClick={() => void run(() => extendExam(live, 5), "נוספו 5 דקות")} disabled={busy}>
                  <Plus />5 דק׳
                </Button>
                <Button variant="destructive" onClick={() => void handleClose()} disabled={busy}>
                  <Square />
                  סיום ה{kindHe}
                </Button>
              </>
            )}
            {live.status === "closed" && (
              <>
                <Link href={`${examHref(live.id)}/integrity`} className={buttonVariants({ variant: "outline" })}>
                  <SearchCheck />
                  בדיקת העתקות והקלדה
                </Link>
                {!live.parts?.length && (
                  <Button variant="outline" onClick={() => void handleSendToGrading()} disabled={busy}>
                    {busy ? <Loader2 className="animate-spin" /> : live.sentToGradingAt ? <Inbox /> : <Send />}
                    {live.sentToGradingAt ? "שליחה מחדש לתיבת ההגשות" : "שליחה לתיבת ההגשות"}
                  </Button>
                )}
                <Link href={`${examHref(live.id)}/results`} className={buttonVariants()}>
                  <ClipboardList />
                  ציונים ושחרור
                </Link>
              </>
            )}
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2 text-sm">
        {live.status === "open" && remaining !== null && (
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-lg font-bold tabular-nums",
              remaining < 5 * 60_000 ? "bg-destructive/10 text-destructive" : "bg-muted"
            )}
          >
            <Clock className="h-4 w-4" />
            {formatClock(remaining)}
          </span>
        )}
        {(Object.keys(STATE_LABEL) as CardState[]).map((k) => (
          <span key={k} className={cn("rounded-full border px-2.5 py-1 text-xs", STATE_STYLE[k])}>
            {STATE_LABEL[k]}: <b className="tabular-nums">{counts[k]}</b>
          </span>
        ))}
      </div>

      {live.status === "draft" && (
        <Card size="sm">
          <CardContent className="text-sm text-muted-foreground">
            לפני הפתיחה: ודאו שהתלמידים מחוברים לאתר. אחרי הפתיחה יופיע להם כפתור &quot;כניסה למבחן&quot; בדף הבית
            (או בכתובת <span dir="ltr" className="font-mono">/exam/{live.id}</span>). מומלץ לבצע ניסיון קצר במעבדה לפני המבחן הראשון.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-4">
        <div className="space-y-3 xl:col-span-3">
          {plan && plan.seats.length > 0 && (
            <div className="space-y-2">
              <div className="rounded-lg bg-muted py-1 text-center text-xs font-medium text-muted-foreground">לוח / עמדת המורה</div>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${plan.cols}, minmax(0, 1fr))` }}>
                {Array.from({ length: usedRows }).flatMap((_, row) =>
                  Array.from({ length: plan.cols }).map((__, col) => {
                    const seat = plan.seats.find((s) => s.row === row && s.col === col);
                    if (!seat) return <div key={`${row}-${col}`} className="min-h-24 rounded-lg border border-dashed border-border/50" />;
                    return renderCard(seat.studentId, nameOf.get(seat.studentId) ?? "?");
                  })
                )}
              </div>
            </div>
          )}
          {unseated.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {unseated.map((r) => renderCard(r.id, r.name))}
            </div>
          )}
        </div>

        <Card size="sm" className="h-fit">
          <CardHeader>
            <CardTitle>אירועים</CardTitle>
          </CardHeader>
          <CardContent>
            {allEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">עוד אין אירועים.</p>
            ) : (
              <ul className="max-h-96 space-y-1.5 overflow-y-auto text-xs">
                {allEvents.map((e, i) => (
                  <li key={`${e.studentId}-${e.t}-${i}`} className="flex gap-2">
                    <span className="shrink-0 font-mono text-muted-foreground tabular-nums">
                      {new Date(e.t).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <button type="button" className="text-start" onClick={() => setSelected(e.studentId)}>
                      <b>{e.studentName}</b>{" "}
                      <span className={e.severity === "lock" ? "text-destructive" : e.severity === "flag" ? "text-warning" : ""}>
                        {EXAM_EVENT_LABEL_HE[e.type]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent dir="rtl" className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedName}</DialogTitle>
          </DialogHeader>
          {!selectedSession ? (
            <p className="text-sm text-muted-foreground">התלמיד/ה עוד לא התחיל/ה את המבחן.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className={cn("rounded-full border px-2.5 py-1 text-xs", STATE_STYLE[cardState(selectedSession, now)])}>
                  {STATE_LABEL[cardState(selectedSession, now)]}
                </span>
                {selectedSession.state === "locked" && selectedSession.lockReason && (
                  <span className="text-destructive">{EXAM_EVENT_LABEL_HE[selectedSession.lockReason]}</span>
                )}
                <span className="text-muted-foreground">
                  נושא {selectedSession.variantKey} · {selectedSession.wordCount} מילים · {selectedSession.vocabUsedIds?.length ?? 0} מילים
                  מהרשימה
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSession.state === "locked" && (
                  <Button
                    onClick={() => void run(() => unlockSession(selectedSession.id), `הנעילה של ${selectedName} שוחררה`)}
                    disabled={busy}
                  >
                    <LockOpen />
                    שחרור נעילה
                  </Button>
                )}
                {selectedSession.state !== "submitted" && (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const yes = await confirm({
                        title: `להגיש עכשיו את המבחן של ${selectedName}?`,
                        description: "הטקסט האחרון שנשמר יוגש, והתלמיד/ה לא יוכל/תוכל להמשיך.",
                        confirmLabel: "הגשה",
                        destructive: true,
                      });
                      if (yes) await run(() => forceSubmitSession(selectedSession), "הוגש");
                    }}
                    disabled={busy}
                  >
                    <Send />
                    הגשה בשם התלמיד/ה
                  </Button>
                )}
              </div>
              <div dir="ltr" className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-start text-sm">
                {selectedSession.text || <span className="text-muted-foreground">(empty)</span>}
              </div>
              <ul className="max-h-48 space-y-1 overflow-y-auto text-xs">
                {[...(selectedSession.events ?? [])].reverse().map((e, i) => (
                  <li key={`${e.t}-${i}`} className="flex gap-2">
                    <span className="shrink-0 font-mono text-muted-foreground tabular-nums">
                      {new Date(e.t).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                    <span className={e.severity === "lock" ? "text-destructive" : e.severity === "flag" ? "text-warning" : ""}>
                      {EXAM_EVENT_LABEL_HE[e.type]}
                      {e.detail ? ` (${e.detail})` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
