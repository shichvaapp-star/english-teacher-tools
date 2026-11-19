"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Eye, Mail, Pencil, Printer, RotateCcw, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/teacher-dashboard/shared-ui/confirm-dialog";
import { PrintBooklet } from "@/components/print/print-sheet-parts";
import { deleteItem, replaceItem, reshuffleSection } from "@/lib/worksheet/build";
import { newWorksheetId, saveWorksheet } from "@/lib/worksheet-storage";
import type { Worksheet } from "@/lib/worksheet/types";
import { WorksheetAllVersions, WorksheetSheet, type SheetEditHandlers, type SheetVersion } from "@/components/worksheet/worksheet-document";
import { SendToPrintDialog } from "@/components/worksheet/send-to-print-dialog";
import { BodyPortal } from "@/components/worksheet/print-portal";
import { DASHBOARD_BASE } from "@/components/teacher-dashboard/shell/nav-items";
import { useWorksheetWizard, type WizardState, type WorksheetWizard } from "@/components/worksheet/wizard/use-worksheet-wizard";
import { StepBody, stepText, summaryLines } from "@/components/worksheet/wizard/steps";

export const WORKSHEETS_HREF = `${DASHBOARD_BASE}/worksheets`;

function Progress({ index, total }: { index: number; total: number }) {
  const pct = Math.round(((index + 1) / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span className="font-semibold">
          שלב {index + 1} מתוך {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Summary({ w }: { w: WorksheetWizard }) {
  return (
    <aside className="space-y-2 rounded-2xl border border-border bg-card p-4">
      <h2 className="text-sm font-bold text-foreground">הדף שלכם עד עכשיו</h2>
      <ul className="space-y-1.5">
        {summaryLines(w.state.settings).map((line) => (
          <li key={line.step + line.label} className="flex items-start gap-2 text-sm">
            <span className="w-20 shrink-0 text-muted-foreground">{line.label}</span>
            <span className="min-w-0 flex-1 font-medium text-foreground" dir="auto">
              {line.value}
            </span>
            {w.state.step !== line.step && (
              <button
                type="button"
                onClick={() => w.dispatch({ type: "goto", step: line.step })}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Pencil className="size-3" />
                שינוי
              </button>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Preview({ w, teacherId }: { w: WorksheetWizard; teacherId: string }) {
  const confirm = useConfirm();
  const [version, setVersion] = useState<SheetVersion>("A");
  const [showKey, setShowKey] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const content = w.content;
  if (!content) return null;
  const { layout } = content.settings;

  const save = async (quiet = false) => {
    setSaving(true);
    const now = new Date().toISOString();
    const id = w.state.id ?? newWorksheetId();
    const createdAt = w.state.createdAt ?? now;
    const sheet: Worksheet = { id, teacherId, title: layout.title || "English Worksheet", createdAt, updatedAt: now, ...content };
    w.dispatch({ type: "saved", id, createdAt });
    const { cloud } = await saveWorksheet(sheet);
    setSaving(false);
    if (!quiet) {
      if (cloud) toast.success("הדף נשמר ב\"דפי העבודה שלי\"");
      else toast.warning("הדף נשמר במחשב הזה בלבד (אין חיבור לשרת כרגע)");
    }
  };

  const print = async () => {
    await save(true);
    // Give the print copy a moment to render.
    setTimeout(() => window.print(), 150);
  };

  const rebuildAll = async () => {
    const ok = await confirm({
      title: "ליצור דף חדש עם שאלות אחרות?",
      description: "כל השינויים שעשיתם בשאלות (החלפה ומחיקה) יימחקו.",
      confirmLabel: "כן, שאלות חדשות",
    });
    if (ok) w.dispatch({ type: "build" });
  };

  const edit: SheetEditHandlers = {
    onReplace: (s, i) => {
      const next = replaceItem(content, s, i);
      if (next[s] === content.sections[s]) toast.info("אין עוד שאלות מתאימות להחלפה");
      w.dispatch({ type: "sections", sections: next });
    },
    onDelete: (s, i) => w.dispatch({ type: "sections", sections: deleteItem(content.sections, s, i) }),
    onReshuffle: (s) => w.dispatch({ type: "sections", sections: reshuffleSection(content, s) }),
  };

  return (
    <div className="space-y-4">
      {/* Main actions */}
      <div className="grid gap-2 sm:grid-cols-3">
        <Button className="h-14 gap-2 text-base" onClick={print}>
          <Printer className="size-5" />
          הדפסה
        </Button>
        <Button className="h-14 gap-2 text-base" variant="secondary" onClick={() => setSendOpen(true)}>
          <Mail className="size-5" />
          שליחה להדפסה (צילום)
        </Button>
        <Button className="h-14 gap-2 text-base" variant="outline" onClick={() => save()} disabled={saving}>
          <Save className="size-5" />
          {w.state.id ? "שמירת השינויים" : "שמירה"}
        </Button>
      </div>

      {/* View options */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3 text-sm">
        <Eye className="size-4 text-muted-foreground" />
        <span className="text-muted-foreground">תצוגה:</span>
        {layout.versions && (
          <div className="inline-flex rounded-lg border border-border p-0.5">
            {(["A", "B"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVersion(v)}
                className={cn(
                  "cursor-pointer rounded-md px-3 py-1 font-semibold",
                  version === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {v === "A" ? "גרסה א׳" : "גרסה ב׳"}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowKey((x) => !x)}
          className={cn(
            "cursor-pointer rounded-lg border px-3 py-1 font-semibold",
            showKey ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"
          )}
        >
          {showKey ? "להסתיר את דף התשובות" : "להציג את דף התשובות"}
        </button>
        <span className="flex-1" />
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={rebuildAll}>
          <RotateCcw className="size-4" />
          שאלות חדשות לכל הדף
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        ליד כל שאלה יש כפתור <b>החלפה</b> (שאלה אחרת באותו נושא) וכפתור <b>מחיקה</b>. הכפתורים לא מודפסים.
      </p>

      {/* The paper */}
      {/* On phones the paper keeps a readable width and scrolls sideways (from the left, where English starts). */}
      <div dir="ltr" className="overflow-x-auto rounded-2xl bg-muted/40 p-2 sm:p-6">
        <div className="mx-auto min-w-xl max-w-3xl rounded-lg bg-white p-6 shadow-lg ring-1 ring-border sm:p-12">
          {content.sections.length ? (
            <WorksheetSheet content={content} version={version} withKey={showKey} edit={edit} />
          ) : (
            <p className="py-10 text-center font-hebrew text-slate-600" dir="rtl">
              הדף ריק – כל השאלות נמחקו. לחצו &quot;שאלות חדשות לכל הדף&quot;.
            </p>
          )}
        </div>
      </div>

      <SendToPrintDialog open={sendOpen} onOpenChange={setSendOpen} content={content} onBeforeSend={() => save(true)} />

      {/* What the browser prints */}
      <BodyPortal>
        <PrintBooklet>
          <WorksheetAllVersions content={content} withKey={layout.answerKey} />
        </PrintBooklet>
      </BodyPortal>
    </div>
  );
}

export function WorksheetWizardView({ teacherId, initial, resumed }: { teacherId: string; initial: WizardState; resumed: boolean }) {
  const w = useWorksheetWizard(teacherId, initial);
  const topRef = useRef<HTMLDivElement>(null);
  const { title, helper } = stepText(w.state.step, w.state.settings);
  const isPreview = w.state.step === "preview";
  const isFirst = w.index === 0;
  const nextLabel = w.steps[w.index + 1] === "preview" ? "לראות את הדף" : "הבא";

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [w.state.step]);

  return (
    <div ref={topRef} className="space-y-5 print:hidden">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">יצירת דף עבודה</h1>
        <Link
          href={WORKSHEETS_HREF}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
          יציאה
        </Link>
      </div>

      {resumed && w.index > 0 && !isPreview && (
        <p className="rounded-xl bg-info/10 px-3 py-2 text-sm text-foreground">ממשיכים מאיפה שעצרתם. הבחירות שלכם נשמרות אוטומטית.</p>
      )}

      <Progress index={w.index} total={w.steps.length} />

      <div className={cn("grid gap-5", !isPreview && "lg:grid-cols-3")}>
        <section className={cn("min-w-0 space-y-5 rounded-2xl border border-border bg-card/50 p-4 sm:p-6", !isPreview && "lg:col-span-2")}>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-base text-muted-foreground">{helper}</p>
          </div>

          {isPreview ? <Preview w={w} teacherId={teacherId} /> : <StepBody w={w} />}

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            {!isFirst && (
              <Button variant="outline" className="h-12 gap-1.5 px-5 text-base" onClick={w.back}>
                <ChevronRight className="size-5" />
                הקודם
              </Button>
            )}
            <span className="flex-1" />
            {!isPreview && (
              <>
                {w.problem && <span className="text-sm font-semibold text-warning">{w.problem}</span>}
                <Button className="h-12 gap-1.5 px-6 text-base" onClick={w.next} disabled={!!w.problem}>
                  {nextLabel}
                  <ChevronLeft className="size-5" />
                </Button>
              </>
            )}
            {isPreview && (
              <Link href={WORKSHEETS_HREF} className="text-sm font-semibold text-primary hover:underline">
                סיום – לדפי העבודה שלי
              </Link>
            )}
          </div>
        </section>

        {!isPreview && <Summary w={w} />}
      </div>
    </div>
  );
}
