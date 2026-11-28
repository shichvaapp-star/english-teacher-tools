"use client";

// Replays how an essay was typed, from the keystroke log. Lock events and
// "long pause, then a fast burst" moments are marked on the timeline.

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SegmentedControl } from "@/components/teacher-dashboard/shared-ui/segmented-control";
import { loadKeylog } from "@/lib/exam/exam-storage";
import { replay, typingStats } from "@/lib/exam/keylog";
import { EXAM_EVENT_LABEL_HE, type ExamSessionDoc, type KeylogOp } from "@/types/exam";
import { Pause, Play, RotateCcw } from "lucide-react";

const SPEEDS = ["1", "5", "20"] as const;
type Speed = (typeof SPEEDS)[number];

export function KeystrokeReplay({ session, teacherId }: { session: ExamSessionDoc; teacherId: string }) {
  const [ops, setOps] = useState<KeylogOp[] | null>(null);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>("5");

  useEffect(() => {
    let alive = true;
    loadKeylog(session.id, teacherId)
      .then((o) => {
        if (!alive) return;
        setOps(o);
        setPos(o.length);
      })
      .catch(() => alive && setOps([]));
    return () => {
      alive = false;
    };
  }, [session.id, teacherId]);

  // Play in real time × speed (gaps over 3 s are shortened so playback doesn't stall).
  useEffect(() => {
    if (!playing || !ops || pos >= ops.length) return;
    const gap = pos > 0 ? Math.min(ops[pos][0] - ops[pos - 1][0], 3000) : 0;
    const id = window.setTimeout(() => {
      const next = pos + 1;
      setPos(next);
      if (next >= ops.length) setPlaying(false);
    }, Math.max(5, gap / Number(speed)));
    return () => window.clearTimeout(id);
  }, [playing, pos, ops, speed]);

  const text = useMemo(() => (ops ? replay(ops, pos) : ""), [ops, pos]);
  const stats = useMemo(() => (ops ? typingStats(ops, session.text) : null), [ops, session.text]);

  if (!ops || !stats) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (ops.length === 0) return <p className="text-sm text-muted-foreground">אין תיעוד הקלדה לתלמיד/ה הזה/ו.</p>;

  const start = ops[0][0];
  const end = ops[ops.length - 1][0];
  const span = Math.max(1, end - start);
  const at = (t: number) => `${(((t - start) / span) * 100).toFixed(2)}%`;
  const markers = (session.events ?? []).filter((e) => e.severity === "lock" && e.t >= start && e.t <= end);
  const currentT = pos > 0 ? ops[pos - 1][0] : start;
  const mismatch = replay(ops) !== session.text;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Stat label="זמן הקלדה פעיל" value={`${stats.activeMinutes.toFixed(1)} דק׳`} />
        <Stat label="מהירות" value={stats.wpm ? `${Math.round(stats.wpm)} מילים/דק׳` : "—"} warn={stats.wpm > 35} />
        <Stat label="נמחק בדרך" value={`${Math.round(stats.deletedShare * 100)}%`} warn={stats.deletedShare < 0.03 && stats.charsTyped > 300} />
        <Stat label="ההפסקה הארוכה" value={`${stats.longestPauseSec} שנ׳`} />
      </div>
      <p className="text-2xs text-muted-foreground">
        כתיבה אמיתית כוללת עצירות ותיקונים. הקלדה מהירה ואחידה כמעט בלי מחיקות, או פרץ מהיר אחרי הפסקה ארוכה, יכולים להעיד
        על העתקה ממקור אחר.
      </p>

      <div dir="ltr" className="space-y-1">
      <div className="relative h-6 rounded-md bg-muted">
        <div className="absolute inset-y-0 left-0 rounded-md bg-primary/25" style={{ width: at(currentT) }} />
        {markers.map((m, i) => (
          <span
            key={`l${i}`}
            title={EXAM_EVENT_LABEL_HE[m.type]}
            className="absolute inset-y-0 w-1 bg-destructive"
            style={{ left: at(m.t) }}
          />
        ))}
        {stats.burstsAfterPause.map((i) => (
          <span
            key={`b${i}`}
            title="פרץ הקלדה אחרי הפסקה ארוכה"
            className="absolute inset-y-0 w-1 bg-warning"
            style={{ left: at(ops[i][0]) }}
          />
        ))}
      </div>
      <input
        type="range"
        min={0}
        max={ops.length}
        value={pos}
        onChange={(e) => {
          setPlaying(false);
          setPos(Number(e.target.value));
        }}
        className="w-full accent-primary"
        aria-label="ציר זמן"
      />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          onClick={() => {
            if (pos >= ops.length) setPos(0);
            setPlaying((p) => !p);
          }}
        >
          {playing ? <Pause /> : <Play />}
          {playing ? "עצירה" : "הפעלה"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setPlaying(false); setPos(0); }}>
          <RotateCcw />
          מההתחלה
        </Button>
        <SegmentedControl
          value={speed}
          onChange={setSpeed}
          options={SPEEDS.map((s) => ({ value: s, label: `×${s}` }))}
          aria-label="מהירות"
        />
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {new Date(currentT).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>
      </div>
      <div dir="ltr" className="min-h-40 whitespace-pre-wrap rounded-lg border border-border bg-card p-3 text-start text-sm leading-relaxed">
        {text}
        <span className="animate-pulse text-primary">▍</span>
      </div>
      {mismatch && (
        <p className="text-2xs text-muted-foreground">
          חלק קטן מהתיעוד חסר (למשל רגע לפני רענון), ולכן הטקסט בסוף ההקלטה שונה מעט מהחיבור שהוגש.
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={cn("rounded-lg border px-2.5 py-1.5", warn ? "border-warning/50 bg-warning/10" : "border-border")}>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-bold tabular-nums">{value}</div>
    </div>
  );
}
