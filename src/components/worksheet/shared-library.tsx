"use client";

import React, { useState } from "react";
import { CopyPlus, Library, Loader2, Mail, Printer, Undo2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/teacher-dashboard/shared-ui/empty-state";
import { CLASS_GRADES, GRADE_LABELS, LEVEL_NAME_HE, type ClassGrade } from "@/lib/levels";
import { PART_LABEL } from "@/lib/worksheet/labels";
import { sectionSize } from "@/lib/worksheet/build";
import type { SharedWorksheet } from "@/lib/worksheet-sharing";
import { PART_ICON } from "@/components/worksheet/wizard/steps";
import { cn } from "@/lib/utils";

const dateHe = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("he-IL", { day: "numeric", month: "numeric", year: "numeric" });
  } catch {
    return "";
  }
};

function SharedCard({
  w,
  mine,
  onPrint,
  onSend,
  onCopy,
  onUnshare,
}: {
  w: SharedWorksheet;
  mine: boolean;
  onPrint: () => void;
  onSend: () => void;
  onCopy: () => Promise<void>;
  onUnshare: () => void;
}) {
  const [copying, setCopying] = useState(false);
  const questions = w.sections.reduce((n, s) => n + sectionSize(s), 0);
  const copy = async () => {
    setCopying(true);
    try {
      await onCopy();
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-foreground" dir="auto">
            {w.title}
          </h3>
          {mine && <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">שלי</span>}
        </div>
        <p className="text-sm font-semibold text-foreground">
          שותף על ידי <span dir="auto">{w.ownerName}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {GRADE_LABELS[w.settings.grade].he} · {LEVEL_NAME_HE[w.settings.level]} · {questions} שאלות · {dateHe(w.sharedAt)}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {w.sections.map((s, i) => (
            <span key={i} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
              {PART_ICON[s.kind]} {PART_LABEL[s.kind].he}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-2">
        <Button className="col-span-2 h-10 gap-1.5" onClick={copy} disabled={copying}>
          {copying ? <Loader2 className="size-4 animate-spin" /> : <CopyPlus className="size-4" />}
          העתקה לדפים שלי
        </Button>
        <Button className="h-10 gap-1.5" variant="outline" onClick={onPrint}>
          <Printer className="size-4" />
          הדפסה
        </Button>
        <Button className="h-10 gap-1.5" variant="outline" onClick={onSend}>
          <Mail className="size-4" />
          שליחה להדפסה
        </Button>
      </div>
      {mine && (
        <button
          type="button"
          onClick={onUnshare}
          className="inline-flex cursor-pointer items-center gap-1 self-start text-xs font-semibold text-muted-foreground hover:text-destructive"
        >
          <Undo2 className="size-3.5" />
          הפסקת השיתוף
        </button>
      )}
    </div>
  );
}

/** "Shared by teachers" tab: every worksheet a teacher in the school has shared. */
export function SharedLibrary({
  list,
  teacherId,
  onPrint,
  onSend,
  onCopy,
  onUnshare,
  onRetry,
}: {
  /** undefined = loading, null = couldn't connect. */
  list: SharedWorksheet[] | null | undefined;
  teacherId: string;
  onPrint: (w: SharedWorksheet) => void;
  onSend: (w: SharedWorksheet) => void;
  onCopy: (w: SharedWorksheet) => Promise<void>;
  onUnshare: (w: SharedWorksheet) => void;
  onRetry: () => void;
}) {
  const [grade, setGrade] = useState<ClassGrade | "all">("all");

  if (list === undefined) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    );
  }
  if (list === null) {
    return (
      <EmptyState
        icon={WifiOff}
        title="אין חיבור לספרייה כרגע"
        description="בדקו את החיבור לאינטרנט ונסו שוב."
        action={
          <Button variant="outline" onClick={onRetry}>
            לנסות שוב
          </Button>
        }
      />
    );
  }
  if (list.length === 0) {
    return (
      <EmptyState
        icon={Library}
        title="עדיין אין דפים משותפים"
        description='כדי לשתף דף, לחצו "שיתוף עם כל המורים" באחד הדפים שלכם.'
      />
    );
  }

  const shown = grade === "all" ? list : list.filter((w) => w.settings.grade === grade);
  const chip = (active: boolean) =>
    cn(
      "h-9 cursor-pointer rounded-full border px-4 text-sm font-semibold",
      active ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:bg-muted",
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={chip(grade === "all")} onClick={() => setGrade("all")}>
          כל השכבות
        </button>
        {CLASS_GRADES.map((g) => (
          <button key={g} type="button" className={chip(grade === g)} onClick={() => setGrade(g)}>
            {GRADE_LABELS[g].he}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="text-sm text-muted-foreground">אין עדיין דפים משותפים לשכבה הזו.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((w) => (
            <SharedCard
              key={w.id}
              w={w}
              mine={w.ownerId === teacherId}
              onPrint={() => onPrint(w)}
              onSend={() => onSend(w)}
              onCopy={() => onCopy(w)}
              onUnshare={() => onUnshare(w)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
