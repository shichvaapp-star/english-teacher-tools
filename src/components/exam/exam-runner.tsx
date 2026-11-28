"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExamEditor } from "@/components/exam/exam-editor";
import { ExamWordList } from "@/components/exam/exam-word-list";
import { ExamUnseenPart } from "@/components/exam/parts/exam-unseen-part";
import { ExamVocabPart } from "@/components/exam/parts/exam-vocab-part";
import { ExamGrammarPart } from "@/components/exam/parts/exam-grammar-part";
import { answeredCount, examKind, examParts, partItemIds } from "@/lib/exam/exam-parts";
import { useExamLockdown, detectWritingExtension } from "@/lib/exam/use-exam-lockdown";
import { countWords, matchVocab } from "@/lib/exam/vocab-match";
import { diffOp } from "@/lib/exam/keylog";
import {
  appendKeylog,
  createSession,
  getSession,
  loadVariant,
  patchSession,
  receiptCode,
  sessionIdFor,
  subscribeExam,
  subscribeSession,
  tsMillis,
  type SessionPatch,
} from "@/lib/exam/exam-storage";
import { isStudentTargeted } from "@/lib/exam/exam-targeting";
import { EXAM_KIND_HE, EXAM_PART_LABEL_HE } from "@/types/exam";
import type {
  ExamAnswer,
  ExamDoc,
  ExamPartStudent,
  ExamEvent,
  ExamEventSeverity,
  ExamEventType,
  ExamSessionDoc,
  ExamVariant,
  KeylogOp,
} from "@/types/exam";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Expand,
  Loader2,
  Lock,
  Send,
  ShieldCheck,
} from "lucide-react";

const SAVE_EVERY_MS = 6_000;
const HEARTBEAT_MS = 30_000;
const KEYLOG_EVERY_MS = 15_000;
const MAX_LOGGED_EVENTS = 150;

interface LocalCopy {
  text: string;
  answers?: Record<string, ExamAnswer>;
  t: number;
}

const WRITING_ONLY: ExamPartStudent[] = [{ id: "writing", type: "writing" }];
const HEB_LETTERS = ["א", "ב", "ג", "ד", "ה", "ו"];

const localKey = (sessionId: string) => `ett_exam_${sessionId}`;

function readLocal(sessionId: string): LocalCopy | null {
  try {
    const raw = localStorage.getItem(localKey(sessionId));
    return raw ? (JSON.parse(raw) as LocalCopy) : null;
  } catch {
    return null;
  }
}

function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * The student's exam page. With `preview` (exam owner only) it shows exactly
 * what students see – no session, no lockdown, nothing saved.
 */
export function ExamRunner({ examId, preview = false }: { examId: string; preview?: boolean }) {
  const { user } = useAuth();
  const isPreview = preview && user?.role === "teacher";
  const studentId = user?.role === "student" ? user.id : null;
  const sessionId = studentId ? sessionIdFor(examId, studentId) : "";

  const [exam, setExam] = useState<ExamDoc | null | undefined>(undefined);
  const [session, setSession] = useState<ExamSessionDoc | null | undefined>(undefined);
  const [variant, setVariant] = useState<ExamVariant | null>(null);
  const [text, setText] = useState("");
  const [answers, setAnswers] = useState<Record<string, ExamAnswer>>({});
  const [partIndex, setPartIndex] = useState(0);
  const [previewKey, setPreviewKey] = useState("A");
  const [localLock, setLocalLock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [serverOffset, setServerOffset] = useState(0);
  const [submitError, setSubmitError] = useState(false);
  /** Fullscreen failed on this computer – the exam runs without it (flagged to the teacher). */
  const [noFullscreen, setNoFullscreen] = useState(false);
  const [extension] = useState<string | null>(() => detectWritingExtension());

  const textRef = useRef("");
  const answersRef = useRef<Record<string, ExamAnswer>>({});
  const dirty = useRef(false);
  const pendingEvents = useRef<ExamEvent[]>([]);
  const eventCount = useRef(0);
  const keylog = useRef<KeylogOp[]>([]);
  const lockingRef = useRef(false);
  const lockReasonRef = useRef<ExamEventType>("exit_fullscreen");
  const submittingRef = useRef(false);
  const initialised = useRef(false);
  const sessionUnsub = useRef<(() => void) | null>(null);

  // --- Data -----------------------------------------------------------------
  useEffect(() => subscribeExam(examId, setExam), [examId]);

  /** Every snapshot of the student's own session. */
  const onSessionSnapshot = useCallback((s: ExamSessionDoc | null) => {
    setSession(s);
    // Server clock: lastSeenAt is a server timestamp written moments ago.
    const seen = tsMillis(s?.lastSeenAt);
    if (seen !== null) {
      const offset = seen - Date.now();
      if (Math.abs(offset) < 10 * 60_000) setServerOffset(offset);
    }
    // Server confirmed the lock → the snapshot drives the screen from now on.
    if (s?.state === "locked" || s?.state === "submitted") {
      setLocalLock(false);
      lockingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!studentId || initialised.current) return;
    initialised.current = true;
    (async () => {
      try {
        const existing = await getSession(examId, studentId);
        if (existing) {
          const local = readLocal(existing.id);
          const serverT = tsMillis(existing.lastSeenAt) ?? 0;
          const useLocal = Boolean(local && local.t > serverT && existing.state === "active");
          const restored = useLocal && local ? local.text : existing.text;
          const restoredAnswers = (useLocal && local?.answers) || existing.answers || {};
          textRef.current = restored;
          setText(restored);
          answersRef.current = restoredAnswers;
          setAnswers(restoredAnswers);
          eventCount.current = existing.events?.length ?? 0;
          setSession(existing);
          // Coming back mid-exam (refresh, crash, closed tab) locks until the teacher looks.
          if (existing.state === "active") {
            setLocalLock(true);
            try {
              await patchSession(existing.id, {
                state: "locked",
                lockReason: "resume",
                text: restored,
                wordCount: countWords(restored),
                answers: restoredAnswers,
                events: [{ t: Date.now(), type: "resume", severity: "lock" }],
              });
            } catch {
              // Time is up / exam closed – the teacher's "End exam" hands it in.
              setLocalLock(false);
            }
          }
          sessionUnsub.current = subscribeSession(existing.id, onSessionSnapshot);
        } else {
          setSession(null);
        }
      } catch (err) {
        console.warn("exam session load", err);
        setError("לא ניתן לטעון את המבחן. בדקו את החיבור לאינטרנט ונסו שוב.");
      }
    })();
  }, [examId, studentId, onSessionSnapshot]);

  useEffect(() => () => sessionUnsub.current?.(), []);

  const variantKey = isPreview
    ? previewKey
    : (session?.variantKey ?? (studentId ? exam?.variantByStudent?.[studentId] : undefined) ?? exam?.variantKeys?.[0]);
  const examOpen = exam?.status === "open";

  useEffect(() => {
    if ((!examOpen && !isPreview) || !variantKey || variant?.key === variantKey) return;
    loadVariant(examId, variantKey)
      .then(setVariant)
      .catch(() => setError("לא ניתן לטעון את נושא המבחן."));
  }, [examId, examOpen, isPreview, variantKey, variant?.key]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // --- Derived ----------------------------------------------------------------
  const vocabUsedIds = useMemo(
    () => (exam ? matchVocab(text, exam.vocabHashes ?? [], exam.vocabSalt ?? "") : []),
    [text, exam]
  );
  const wordCount = countWords(text);
  const closesAt = tsMillis(exam?.closesAt);
  const remainingMs = closesAt === null ? null : closesAt - (now + serverOffset);
  const timeUp = remainingMs !== null && remainingMs <= 0;
  const isLocked = localLock || session?.state === "locked";
  const targeted = exam && user ? isStudentTargeted(exam, user) : false;

  // --- Saving -----------------------------------------------------------------
  const flushKeylog = useCallback(async () => {
    if (!session || !exam || keylog.current.length === 0) return;
    const ops = keylog.current;
    keylog.current = [];
    try {
      await appendKeylog(session.id, exam.teacherId, session.studentId, ops);
    } catch {
      keylog.current = [...ops, ...keylog.current];
    }
  }, [session, exam]);

  const takeEvents = () => {
    const ev = pendingEvents.current;
    pendingEvents.current = [];
    return ev;
  };

  const save = useCallback(
    async (extra: SessionPatch = {}) => {
      if (!session) return;
      const events = [...takeEvents(), ...(extra.events ?? [])];
      const patch: SessionPatch = {
        text: textRef.current,
        wordCount: countWords(textRef.current),
        vocabUsedIds: exam ? matchVocab(textRef.current, exam.vocabHashes ?? [], exam.vocabSalt ?? "") : [],
        answers: answersRef.current,
        ...extra,
        events,
      };
      dirty.current = false;
      try {
        await patchSession(session.id, patch);
        const copy: LocalCopy = { text: textRef.current, answers: answersRef.current, t: Date.now() };
        localStorage.setItem(localKey(session.id), JSON.stringify(copy));
        return true;
      } catch (err) {
        console.warn("exam save", err);
        dirty.current = true;
        pendingEvents.current = [...events, ...pendingEvents.current];
        return false;
      }
    },
    [session, exam]
  );

  const writing = Boolean(session && session.state === "active" && !isLocked && examOpen && !timeUp);

  useEffect(() => {
    if (!writing) return;
    const saveId = window.setInterval(() => {
      if (dirty.current || pendingEvents.current.length) void save();
    }, SAVE_EVERY_MS);
    const beatId = window.setInterval(() => void save(), HEARTBEAT_MS);
    const keylogId = window.setInterval(() => void flushKeylog(), KEYLOG_EVERY_MS);
    return () => {
      window.clearInterval(saveId);
      window.clearInterval(beatId);
      window.clearInterval(keylogId);
    };
  }, [writing, save, flushKeylog]);

  // --- Violations ---------------------------------------------------------------
  const onViolation = useCallback(
    (type: ExamEventType, severity: ExamEventSeverity, detail?: string) => {
      if (!session || session.state !== "active" || submittingRef.current) return;
      const event: ExamEvent = { t: Date.now(), type, severity, ...(detail ? { detail } : {}) };
      if (severity === "lock") {
        if (lockingRef.current) return;
        lockingRef.current = true;
        lockReasonRef.current = type;
        setLocalLock(true);
        eventCount.current++;
        void flushKeylog();
        void save({ state: "locked", lockReason: type, events: [event] });
        return;
      }
      if (eventCount.current >= MAX_LOGGED_EVENTS) return;
      eventCount.current++;
      pendingEvents.current.push(event);
    },
    [session, save, flushKeylog]
  );

  // A lock that didn't reach the server (offline) is retried until it does,
  // so the teacher sees it and can unlock.
  useEffect(() => {
    if (!localLock || session?.state !== "active") return;
    const id = window.setInterval(() => void save({ state: "locked", lockReason: lockReasonRef.current }), 5000);
    return () => window.clearInterval(id);
  }, [localLock, session?.state, save]);

  // The teacher ended the exam: one last save of the latest text.
  useEffect(() => {
    if (exam?.status === "closed" && session?.state === "active" && dirty.current) void save();
  }, [exam?.status, session?.state, save]);

  const { isFullscreen, fullscreenSupported, enterFullscreen, exitFullscreen } = useExamLockdown({
    active: writing,
    onViolation,
  });

  const needsFullscreen = fullscreenSupported && !noFullscreen && !isFullscreen;
  const showEditor = writing && !needsFullscreen;

  const handleAnswer = (key: string, value: ExamAnswer) => {
    answersRef.current = { ...answersRef.current, [key]: value };
    dirty.current = true;
    setAnswers(answersRef.current);
  };

  const handleEdit = (next: string, prev: string) => {
    const op = diffOp(prev, next, Date.now());
    if (op) keylog.current.push(op);
    textRef.current = next;
    dirty.current = true;
    setText(next);
  };

  // --- Actions --------------------------------------------------------------------
  const handleStart = async () => {
    if (!exam || !user || !studentId || !variantKey) return;
    setStarting(true);
    setError(null);
    const fs = await enterFullscreen();
    if (!fs) setNoFullscreen(true);
    try {
      const events: ExamEvent[] = [{ t: Date.now(), type: "start", severity: "info" }];
      if (!fs) events.push({ t: Date.now(), type: "no_fullscreen", severity: "flag" });
      if (extension) events.push({ t: Date.now(), type: "extension", severity: "flag", detail: extension });
      const fresh: Omit<ExamSessionDoc, "startedAt" | "lastSeenAt"> = {
        id: sessionId,
        examId,
        studentId,
        studentName: user.name,
        studentClass: user.fullClass,
        teacherId: exam.teacherId,
        variantKey,
        state: "active",
        lockReason: null,
        text: "",
        wordCount: 0,
        vocabUsedIds: [],
        events,
      };
      await createSession(fresh);
      eventCount.current = events.length;
      sessionUnsub.current?.();
      sessionUnsub.current = subscribeSession(sessionId, onSessionSnapshot);
    } catch (err) {
      console.warn("exam start", err);
      setError("לא ניתן להתחיל את המבחן. ייתכן שהזמן הסתיים או שהמבחן נסגר.");
      void exitFullscreen();
    } finally {
      setStarting(false);
    }
  };

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (!session || submittingRef.current) return;
      submittingRef.current = true;
      await flushKeylog();
      const event: ExamEvent = auto
        ? { t: Date.now(), type: "force_submit", severity: "info", detail: "הזמן הסתיים" }
        : { t: Date.now(), type: "submit", severity: "info" };
      const ok = await save({ state: "submitted", receiptCode: receiptCode(), events: [event] });
      if (!ok) {
        submittingRef.current = false;
        setSubmitError(true);
        return;
      }
      localStorage.removeItem(localKey(session.id));
      void exitFullscreen();
    },
    [session, save, flushKeylog, exitFullscreen]
  );

  // Time is up → hand in what is there.
  useEffect(() => {
    if (timeUp && session?.state === "active" && !isLocked) void handleSubmit(true);
  }, [timeUp, session?.state, isLocked, handleSubmit]);

  // --- Screens -----------------------------------------------------------------------
  if (!user || (user.role !== "student" && !isPreview)) {
    return <CenterMessage title="המבחן מיועד לתלמידים" body="יש להתחבר כתלמיד/ה כדי לגשת למבחן." />;
  }
  if (error) return <CenterMessage title="משהו השתבש" body={error} tone="error" />;
  if (exam === undefined || (!isPreview && session === undefined)) return <Loading />;
  if (exam === null) return <CenterMessage title="המבחן לא נמצא" body="ייתכן שהקישור שגוי או שהמבחן נמחק." tone="error" />;
  const kindHe = EXAM_KIND_HE[examKind(exam)];

  if (isPreview) {
    // Skip every session screen: straight to what students see while writing.
  } else {

  if (session?.state === "submitted") {
    return (
      <CenterMessage
        icon={<CheckCircle2 className="h-10 w-10 text-success" />}
        title={`ה${kindHe} הוגש בהצלחה`}
        body={`קוד אישור: ${session.receiptCode ?? "—"}. אפשר לסגור את המחשב בשקט.`}
        action={<Link href="/" className={buttonVariants()}>חזרה לדף הבית</Link>}
      />
    );
  }

  if (!examOpen) {
    return (
      <CenterMessage
        icon={<Clock className="h-10 w-10 text-muted-foreground" />}
        title={exam.status === "closed" ? `ה${kindHe} הסתיים` : `ה${kindHe} עוד לא נפתח`}
        body={
          exam.status === "closed"
            ? "הזמן נגמר והמבחן נסגר על ידי המורה."
            : "המתינו להוראת המורה. הדף יתעדכן לבד ברגע שהמבחן ייפתח."
        }
      />
    );
  }

  if (!session) {
    return (
      <ExamIntro
        exam={exam}
        targeted={targeted}
        extension={extension}
        starting={starting}
        canStart={Boolean(variantKey) && !timeUp}
        onStart={handleStart}
      />
    );
  }

  if (isLocked) {
    return (
      <CenterMessage
        icon={<Lock className="h-10 w-10 text-destructive" />}
        title={`ה${kindHe} ננעל – קרא/י למורה`}
        body="המערכת זיהתה יציאה ממסך המבחן או פעולה אסורה. המורה צריך/ה לשחרר את הנעילה מהמחשב שלו/ה. הזמן ממשיך לרוץ."
        tone="error"
        footer={remainingMs !== null ? `זמן שנותר: ${formatClock(remainingMs)}` : undefined}
      />
    );
  }

  if (timeUp) {
    return <CenterMessage icon={<Loader2 className="h-10 w-10 animate-spin text-primary" />} title="הזמן נגמר" body="המבחן מוגש…" />;
  }

  if (needsFullscreen) {
    return (
      <CenterMessage
        icon={<Expand className="h-10 w-10 text-primary" />}
        title={`חזרה ל${kindHe}`}
        body={`ה${kindHe} נפתח במסך מלא בלבד.`}
        action={
          <Button
            size="lg"
            onClick={async () => {
              if (await enterFullscreen()) return;
              setNoFullscreen(true);
              onViolation("no_fullscreen", "flag");
            }}
          >
            <Expand />
            המשך במסך מלא
          </Button>
        }
      />
    );
  }

  }

  const metas = examParts(exam);
  const studentParts = variant?.parts?.length ? variant.parts : WRITING_ONLY;
  const current = studentParts[Math.min(partIndex, studentParts.length - 1)];
  const currentMeta = metas.find((m) => m.id === current?.id);
  const hasWriting = studentParts.some((p) => p.type === "writing");
  const onWriting = current?.type === "writing";
  const minVocab = exam.minVocabUsed;
  const vocabOk = vocabUsedIds.length >= minVocab;
  const wordsOk = wordCount >= exam.minWords;
  const lowTime = remainingMs !== null && remainingMs < 5 * 60_000;
  const unanswered = studentParts
    .filter((p) => p.type !== "writing")
    .map((p, i) => ({ p, i, missing: partItemIds(p).length - answeredCount(p, answers) }))
    .filter((x) => x.missing > 0);
  const partLabel = (p: ExamPartStudent, i: number) =>
    `חלק ${HEB_LETTERS[i] ?? i + 1}׳ · ${metas.find((m) => m.id === p.id)?.title || EXAM_PART_LABEL_HE[p.type]}`;
  const editorVisible = isPreview || showEditor;

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-border bg-background/95 px-4 py-2 backdrop-blur">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">
            {kindHe}: {exam.title}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {user.name}
            {user.fullClass ? ` · ${user.fullClass}` : ""}
          </div>
        </div>
        {onWriting && (
          <>
            <Stat label="מילים" value={`${wordCount}`} ok={wordsOk} hint={`מינימום ${exam.minWords}`} />
            <Stat label="מילים מהרשימה" value={`${vocabUsedIds.length}/${minVocab}`} ok={vocabOk} />
          </>
        )}
        <div
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-lg font-bold tabular-nums ${
            lowTime ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"
          }`}
          aria-label="זמן שנותר"
        >
          <Clock className="h-4 w-4" />
          {remainingMs !== null ? formatClock(remainingMs) : "--:--"}
        </div>
        <ThemeToggle />
        {submitError && <span className="text-xs font-medium text-destructive">ההגשה נכשלה – בדקו חיבור ונסו שוב</span>}
        {!isPreview && (
          <Button onClick={() => setConfirmOpen(true)}>
            <Send />
            הגשה
          </Button>
        )}
      </header>

      {isPreview && (
        <div className="flex flex-wrap items-center gap-2 border-b border-warning/40 bg-warning/10 px-4 py-2 text-sm">
          <span className="font-bold">תצוגה מקדימה למורה</span>
          <span className="text-muted-foreground">כך התלמידים רואים את ה{kindHe}. שום דבר לא נשמר, ואין נעילה.</span>
          {exam.variantKeys.length > 1 && (
            <span className="flex items-center gap-1">
              גרסה:
              {exam.variantKeys.map((k) => (
                <Button key={k} size="xs" variant={k === previewKey ? "default" : "outline"} onClick={() => setPreviewKey(k)}>
                  {k}
                </Button>
              ))}
            </span>
          )}
        </div>
      )}

      {studentParts.length > 1 && (
        <nav className="flex flex-wrap gap-2 border-b border-border px-4 py-2" aria-label="חלקי המבחן">
          {studentParts.map((p, i) => {
            const total = partItemIds(p).length;
            const done = p.type === "writing" ? null : answeredCount(p, answers);
            return (
              <Button
                key={p.id}
                size="sm"
                variant={p.id === current?.id ? "default" : "outline"}
                onClick={() => setPartIndex(i)}
              >
                {partLabel(p, i)}
                {done !== null && (
                  <span className="font-mono text-xs tabular-nums opacity-80">
                    {done}/{total}
                  </span>
                )}
              </Button>
            );
          })}
        </nav>
      )}

      {!onWriting && current && (
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-3 p-4">
          {currentMeta && studentParts.length > 1 && (
            <h2 className="text-sm font-bold text-muted-foreground">
              {partLabel(current, studentParts.indexOf(current))} · {currentMeta.points} נק׳
            </h2>
          )}
          {current.type === "unseen" && <ExamUnseenPart part={current} answers={answers} onAnswer={handleAnswer} />}
          {current.type === "vocab" && <ExamVocabPart part={current} answers={answers} onAnswer={handleAnswer} />}
          {current.type === "grammar" && <ExamGrammarPart part={current} answers={answers} onAnswer={handleAnswer} />}
        </main>
      )}

      {onWriting && (
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 lg:flex-row">
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <Card size="sm">
            <CardContent>
              <button
                type="button"
                onClick={() => setTopicOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-2 text-start"
              >
                <span className="text-sm font-bold">נושא הכתיבה</span>
                {topicOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {topicOpen && variant && (
                <div dir="ltr" className="mt-2 space-y-1 text-start">
                  <div className="font-bold">{variant.title}</div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{variant.prompt}</p>
                  <p className="text-xs text-muted-foreground">
                    Write {exam.minWords}–{exam.maxWords} words. Use at least {minVocab} words from the list.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          {editorVisible && <ExamEditor value={text} onChange={handleEdit} onViolation={onViolation} />}
        </section>
        <aside className="w-full shrink-0 lg:w-72">
          <ExamWordList
            words={exam.vocabHebrew ?? []}
            usedIds={vocabUsedIds}
            minUsed={minVocab}
            shuffleSeed={`${exam.id}:${studentId ?? "preview"}`}
          />
        </aside>
      </main>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader className="sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-right">
            <AlertDialogTitle>להגיש את ה{kindHe}?</AlertDialogTitle>
            <AlertDialogDescription>
              אחרי ההגשה לא ניתן לשנות תשובות.
              {unanswered.map((u) => ` ב${partLabel(u.p, studentParts.indexOf(u.p))} יש ${u.missing} שאלות בלי תשובה.`).join("")}
              {hasWriting && !wordsOk && ` בחיבור כתבת ${wordCount} מילים – פחות מהמינימום (${exam.minWords}).`}
              {hasWriting && !vocabOk && ` השתמשת ב-${vocabUsedIds.length} מילים מהרשימה – פחות מ-${minVocab}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>המשך לכתוב</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setSubmitError(false);
                void handleSubmit(false);
              }}
            >הגש עכשיו</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Stat({ label, value, ok, hint }: { label: string; value: string; ok: boolean; hint?: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-muted px-3 py-1" title={hint}>
      <span className="text-2xs text-muted-foreground">{label}</span>
      <span className={`font-mono text-sm font-bold tabular-nums ${ok ? "text-success" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function ExamIntro({
  exam,
  targeted,
  extension,
  starting,
  canStart,
  onStart,
}: {
  exam: ExamDoc;
  targeted: boolean;
  extension: string | null;
  starting: boolean;
  canStart: boolean;
  onStart: () => void;
}) {
  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-xl">
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">
              {EXAM_KIND_HE[examKind(exam)]}: {exam.title}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">{exam.durationMin} דקות</p>
          <ul className="space-y-1 text-sm">
            {examParts(exam).map((p, i) => (
              <li key={p.id} className="flex justify-between gap-2 rounded-lg border border-border px-3 py-1.5">
                <span>
                  חלק {HEB_LETTERS[i] ?? i + 1}׳ · {p.title || EXAM_PART_LABEL_HE[p.type]}
                  {p.type === "writing"
                    ? ` (${exam.minWords}–${exam.maxWords} מילים, לפחות ${exam.minVocabUsed} מילים מהרשימה)`
                    : ` (${p.itemCount} שאלות)`}
                </span>
                <span className="tabular-nums text-muted-foreground">{p.points} נק׳</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 rounded-xl border border-border bg-muted/50 p-4 text-sm">
            <div className="font-bold">כללי המבחן</div>
            <ul className="list-disc space-y-1 ps-5">
              <li>המבחן נפתח במסך מלא. יציאה ממסך מלא (כולל מקש Esc) נועלת את המבחן.</li>
              <li>מעבר ללשונית, לחלון או לתוכנה אחרת נועל את המבחן.</li>
              <li>אין אפשרות להעתיק, להדביק או להשתמש בבודק איות, בתרגום, ברמזים או בהשלמה אוטומטית.</li>
              <li>כותבים באנגלית בלבד.</li>
              <li>אפשר לעבור בין החלקים בכל זמן. התשובות נשמרות לבד.</li>
              <li>כל הפעולות במבחן נשמרות. רענון הדף נועל את המבחן עד שהמורה משחרר/ת.</li>
              <li>אם המבחן ננעל – קראו למורה. הזמן ממשיך לרוץ.</li>
            </ul>
          </div>
          {extension && (
            <div className="flex gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-foreground">
              <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
              <span>זוהה תוסף כתיבה בדפדפן (למשל Grammarly). המורה יקבל/תקבל התראה על כך.</span>
            </div>
          )}
          {!targeted && (
            <div className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm">
              המבחן הזה לא שובץ לכיתה שלך. אם זו טעות – פנו למורה לפני שמתחילים.
            </div>
          )}
          <Button size="lg" className="w-full" disabled={starting || !canStart} onClick={onStart}>
            {starting ? <Loader2 className="animate-spin" /> : <Expand />}
            התחלה במסך מלא
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      טוען מבחן…
    </div>
  );
}

function CenterMessage({
  icon,
  title,
  body,
  action,
  footer,
  tone,
}: {
  icon?: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
  footer?: string;
  tone?: "error";
}) {
  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <Card className={`w-full max-w-md text-center ${tone === "error" ? "border-destructive/40" : ""}`}>
        <CardContent className="flex flex-col items-center gap-3 py-4">
          {icon}
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{body}</p>
          {footer && <p className="font-mono text-sm font-bold tabular-nums">{footer}</p>}
          {action}
        </CardContent>
      </Card>
    </div>
  );
}
