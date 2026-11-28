"use client";

// Grading a lab test / quiz: automatic scores from the answer key, the
// teacher's overrides for anything a computer can't judge (open answers,
// free writing), then "Release" – students only see their grade after that.

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "cn";
import { useTeacherSession } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { useConfirm } from "@/components/teacher-dashboard/shared-ui/confirm-dialog";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { DASHBOARD_BASE, examHref } from "@/components/teacher-dashboard/shell/nav-items";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  loadTeacherExam,
  receiptCode,
  releaseExamResults,
  saveExamResult,
  subscribeExam,
  subscribeExamResults,
  subscribeExamSessions,
  tsMillis,
  type TeacherExamBundle,
} from "@/lib/exam/exam-storage";
import { examKind, examParts } from "@/lib/exam/exam-parts";
import { gradeExam, type ExamGradeResult, type ItemResult } from "@/lib/exam/grade-exam";
import { EXAM_KIND_HE, type ExamDoc, type ExamPartFull, type ExamResultDoc, type ExamSessionDoc } from "@/types/exam";
import type { SubmissionItem } from "@/types/submission";
import type { WritingEvaluationResult } from "@/app/api/evaluate-writing/route";
import { AlertTriangle, Check, Loader2, RotateCcw, Send, Sparkles, X } from "lucide-react";

const LEGACY_PARTS: ExamPartFull[] = [{ id: "writing", type: "writing" }];

function emptyResult(studentId: string): ExamResultDoc {
  return { studentId, overrides: {}, updatedAt: "" };
}

export function ExamResults({ examId }: { examId: string }) {
  const { c, user } = useTeacherSession();
  const confirm = useConfirm();
  const [bundle, setBundle] = useState<TeacherExamBundle | null | undefined>(undefined);
  const [exam, setExam] = useState<ExamDoc | null>(null);
  const [sessions, setSessions] = useState<ExamSessionDoc[] | null>(null);
  const [results, setResults] = useState<ExamResultDoc[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadTeacherExam(examId).then(setBundle).catch(() => setBundle(null));
    return subscribeExam(examId, setExam);
  }, [examId]);
  useEffect(() => subscribeExamSessions(examId, user.id, setSessions), [examId, user.id]);
  useEffect(() => subscribeExamResults(examId, setResults), [examId]);

  const live = exam ?? bundle?.exam ?? null;
  const metas = live ? examParts(live) : [];
  const resultOf = useMemo(() => new Map(results.map((r) => [r.studentId, r])), [results]);

  const graded = useMemo(() => {
    if (!sessions || !bundle) return [];
    return [...sessions]
      .sort((a, b) => a.studentName.localeCompare(b.studentName, "he"))
      .map((s) => {
        const full = bundle.priv?.variants?.[s.variantKey] ?? LEGACY_PARTS;
        return { s, g: gradeExam(metas, full, s.answers ?? {}, resultOf.get(s.studentId)) };
      });
    // metas derives from `live`, which changes with `exam`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, bundle, resultOf, live]);

  if (bundle === undefined || sessions === null) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (!bundle || !live) return <p className="text-sm text-muted-foreground">המבחן לא נמצא.</p>;

  const kindHe = EXAM_KIND_HE[examKind(live)];
  const toReview = graded.reduce((t, x) => t + x.g.needsReview, 0);
  const opened = graded.find((x) => x.s.studentId === openId) ?? null;

  const updateResult = async (studentId: string, patch: Partial<ExamResultDoc>) => {
    const next = { ...(resultOf.get(studentId) ?? emptyResult(studentId)), ...patch, studentId };
    setResults((rs) => [...rs.filter((r) => r.studentId !== studentId), next]);
    try {
      await saveExamResult(examId, next);
    } catch {
      toast.error("השמירה נכשלה");
    }
  };

  const handleRelease = async () => {
    const yes = await confirm({
      title: `לשחרר את הציונים של ה${kindHe}?`,
      description:
        (toReview > 0 ? `יש עדיין ${toReview} תשובות שמחכות לבדיקה שלך – הן ייחשבו לפי הציון האוטומטי. ` : "") +
        "כל תלמיד/ה יראה/תראה את הציון שלו/ה ואת הניקוד בכל חלק (בלי התשובות הנכונות). אפשר לעדכן ולשחרר שוב.",
      confirmLabel: "שחרור ציונים",
    });
    if (!yes) return;
    setBusy(true);
    try {
      const nowIso = new Date().toISOString();
      const items: SubmissionItem[] = graded.map(({ s, g }) => ({
        id: `exam-${live.id}-${s.studentId}`,
        type: "exam",
        studentId: s.studentId,
        studentName: s.studentName,
        studentClass: s.studentClass,
        teacherId: live.teacherId,
        teacherName: user.name,
        taskId: `exam:${live.id}`,
        taskTitle: live.title,
        hebrewTitle: `${kindHe}: ${live.title}`,
        submittedAt: new Date(tsMillis(s.submittedAt) ?? Date.now()).toISOString(),
        receiptCode: s.receiptCode ?? receiptCode(),
        status: "reviewed",
        mode: "graded",
        score: g.total,
        grade: g.total,
        teacherFeedback: resultOf.get(s.studentId)?.feedback,
        reviewedAt: nowIso,
        examSummary: {
          examId: live.id,
          kind: examKind(live),
          parts: g.parts.map((p) => ({ title: p.title, type: p.type, earned: Math.round(p.earned * 10) / 10, points: p.points })),
        },
      }));
      await releaseExamResults(live.id, items);
      await c.fetchSubmissions();
      toast.success(`הציונים שוחררו ל-${items.length} תלמידים`);
    } catch (err) {
      console.warn("release", err);
      toast.error("השחרור נכשל");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={
          <>
            <Link href={`${DASHBOARD_BASE}/exams`}>מבחנים</Link> / <Link href={examHref(live.id)}>{live.title}</Link>
          </>
        }
        title={`ציונים – ${kindHe}: ${live.title}`}
        description="הציון האוטומטי מחושב לפי מפתח התשובות. תשובות פתוחות וכתיבה מסומנות לבדיקה שלך – הציון שלך תמיד גובר. התלמידים רואים ציון רק אחרי שחרור."
        actions={
          <Button onClick={() => void handleRelease()} disabled={busy || graded.length === 0}>
            {busy ? <Loader2 className="animate-spin" /> : <Send />}
            {live.resultsReleasedAt ? "עדכון ושחרור מחדש" : "שחרור ציונים לתלמידים"}
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2 text-sm">
        {live.resultsReleasedAt ? (
          <Badge variant="outline" className="border-success/40 bg-success/10 text-success">
            שוחרר {new Date(live.resultsReleasedAt).toLocaleString("he-IL")}
          </Badge>
        ) : (
          <Badge variant="outline">טרם שוחרר – התלמידים לא רואים ציון</Badge>
        )}
        {toReview > 0 && (
          <Badge variant="outline" className="gap-1 border-warning/50 bg-warning/10">
            <AlertTriangle className="h-3 w-3" />
            {toReview} תשובות מחכות לבדיקה
          </Badge>
        )}
      </div>

      {graded.length === 0 ? (
        <p className="text-sm text-muted-foreground">עוד אין הגשות.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם</TableHead>
              <TableHead>גרסה</TableHead>
              {metas.map((m) => (
                <TableHead key={m.id}>
                  {m.title} <span className="text-muted-foreground">({m.points})</span>
                </TableHead>
              ))}
              <TableHead>ציון</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {graded.map(({ s, g }) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">
                  {s.studentName}
                  {s.state !== "submitted" && <span className="ms-1 text-3xs text-warning">(לא הוגש)</span>}
                </TableCell>
                <TableCell>{s.variantKey}</TableCell>
                {g.parts.map((p) => (
                  <TableCell key={p.id} className="tabular-nums">
                    {Math.round(p.earned)}
                    {p.needsReview > 0 && (
                      <span className="ms-1 rounded-full bg-warning/15 px-1.5 text-3xs text-foreground">{p.needsReview} לבדיקה</span>
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-base font-bold tabular-nums">{g.total}</TableCell>
                <TableCell>
                  <Button size="sm" variant={g.needsReview ? "default" : "outline"} onClick={() => setOpenId(s.studentId)}>
                    {g.needsReview ? "לבדיקה" : "פירוט"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={Boolean(opened)} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent dir="rtl" className="max-h-svh overflow-y-auto sm:max-w-4xl">
          {opened && (
            <StudentGrading
              key={opened.s.studentId}
              session={opened.s}
              grade={opened.g}
              result={resultOf.get(opened.s.studentId) ?? emptyResult(opened.s.studentId)}
              exam={live}
              prompt={bundle.variants.find((v) => v.key === opened.s.variantKey)?.prompt ?? ""}
              onUpdate={(patch) => void updateResult(opened.s.studentId, patch)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ItemRow({ item, onSet }: { item: ItemResult; onSet: (v: number | null) => void }) {
  const tone =
    item.needsReview ? "border-warning/50 bg-warning/5" : item.score >= 1 ? "border-success/30" : item.score > 0 ? "border-info/30" : "border-destructive/30";
  return (
    <li className={cn("space-y-1 rounded-lg border p-2.5 text-sm", tone)}>
      <div dir="ltr" className="text-start">
        <span className="font-bold">{item.number}. </span>
        {item.prompt}
      </div>
      <div dir="ltr" className="grid gap-1 text-start text-xs sm:grid-cols-2">
        <div>
          <span className="text-muted-foreground">Student: </span>
          <span className="font-medium">{item.studentAnswer || "—"}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Key: </span>
          {item.expected}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs tabular-nums text-muted-foreground">
          {Math.round(item.score * 100)}%{item.overridden ? " (שלך)" : " (אוטומטי)"}
          {item.needsReview && " · לבדיקה"}
        </span>
        <Button size="xs" variant={item.overridden && item.score === 1 ? "default" : "outline"} onClick={() => onSet(1)}>
          <Check />
          נכון
        </Button>
        <Button size="xs" variant={item.overridden && item.score === 0.5 ? "default" : "outline"} onClick={() => onSet(0.5)}>
          חצי
        </Button>
        <Button size="xs" variant={item.overridden && item.score === 0 ? "default" : "outline"} onClick={() => onSet(0)}>
          <X />
          שגוי
        </Button>
        {item.overridden && (
          <Button size="xs" variant="ghost" onClick={() => onSet(null)}>
            <RotateCcw />
            אוטומטי
          </Button>
        )}
      </div>
    </li>
  );
}

function StudentGrading({
  session,
  grade,
  result,
  exam,
  prompt,
  onUpdate,
}: {
  session: ExamSessionDoc;
  grade: ExamGradeResult;
  result: ExamResultDoc;
  exam: ExamDoc;
  prompt: string;
  onUpdate: (patch: Partial<ExamResultDoc>) => void;
}) {
  const [feedback, setFeedback] = useState(result.feedback ?? "");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);

  const setOverride = (key: string, v: number | null) => {
    const overrides = { ...result.overrides };
    if (v === null) delete overrides[key];
    else overrides[key] = v;
    onUpdate({ overrides });
  };

  const runAiWriting = async () => {
    setAiBusy(true);
    setAiNote(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      for (const [k, h] of [
        ["ett_groq_api_key", "x-groq-api-key"],
        ["ett_gemini_api_key", "x-gemini-api-key"],
        ["ett_openai_api_key", "x-openai-api-key"],
      ]) {
        const v = localStorage.getItem(k);
        if (v) headers[h] = v;
      }
      const res = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers,
        body: JSON.stringify({
          essayText: session.text.trim(),
          taskTitle: exam.title,
          prompt,
          category: "opinion",
          level: "Level 2",
          minWords: exam.minWords,
          maxWords: exam.maxWords,
        }),
      });
      const data = (await res.json()) as { success?: boolean; evaluation?: WritingEvaluationResult; error?: string };
      if (data.success && data.evaluation) {
        onUpdate({ writingScore: Math.max(0, Math.min(1, data.evaluation.score / 100)) });
        setAiNote(data.evaluation.teacherNote ?? data.evaluation.encouragement);
      } else {
        toast.error(data.error ?? "בדיקת ה-AI נכשלה");
      }
    } catch {
      toast.error("לא ניתן להתחבר לבדיקת ה-AI");
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {session.studentName} · גרסה {session.variantKey} · ציון {grade.total}
        </DialogTitle>
      </DialogHeader>
      {grade.parts.map((p) => (
        <section key={p.id} className="space-y-2">
          <h3 className="flex items-center justify-between text-sm font-bold">
            <span>{p.title}</span>
            <span className="tabular-nums text-muted-foreground">
              {Math.round(p.earned * 10) / 10}/{p.points}
            </span>
          </h3>
          {p.type === "writing" ? (
            <div className="space-y-2">
              <div dir="ltr" className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-3 text-start text-sm">
                {session.text || "(empty)"}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span>ציון לחיבור (%):</span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  className="w-24"
                  value={result.writingScore === undefined ? "" : Math.round(result.writingScore * 100)}
                  onChange={(e) =>
                    onUpdate({ writingScore: e.target.value === "" ? undefined : Math.max(0, Math.min(100, Number(e.target.value))) / 100 })
                  }
                />
                <span className="text-xs text-muted-foreground">
                  {session.wordCount} מילים · {session.vocabUsedIds?.length ?? 0}/{exam.minVocabUsed} מהרשימה
                </span>
                <Button size="sm" variant="outline" onClick={() => void runAiWriting()} disabled={aiBusy || !session.text.trim()}>
                  {aiBusy ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  הצעת ציון AI
                </Button>
              </div>
              {aiNote && <p className="rounded-lg bg-muted p-2 text-xs">{aiNote}</p>}
            </div>
          ) : (
            <ul className="space-y-1.5">
              {p.items.map((it) => (
                <ItemRow key={it.key} item={it} onSet={(v) => setOverride(`${p.id}|${it.baseId}`, v)} />
              ))}
            </ul>
          )}
        </section>
      ))}
      <section className="space-y-1">
        <h3 className="text-sm font-bold">משוב לתלמיד/ה (יופיע עם הציון)</h3>
        <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} onBlur={() => onUpdate({ feedback })} rows={2} />
      </section>
    </div>
  );
}
