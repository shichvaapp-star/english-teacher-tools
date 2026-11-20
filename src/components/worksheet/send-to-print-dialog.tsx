"use client";

import React, { useRef, useState } from "react";
import { CheckCircle2, Download, Loader2, Mail, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/firebase";
import { MAX_PRINT_COPIES, PRINT_EMAIL, PRINT_PREFERENCES_HE } from "@/config/print-email";
import { blobToBase64, PDF_SHEET_WIDTH_PX, sheetToPdf } from "@/lib/worksheet/pdf";
import type { WorksheetContent } from "@/lib/worksheet/types";
import type { SendWorksheetReason, SendWorksheetRequest, SendWorksheetResponse } from "@/types/send-worksheet";
import { WorksheetAllVersions } from "@/components/worksheet/worksheet-document";
import { BigCounter } from "@/components/shared/wizard/wizard-ui";
import { BodyPortal } from "@/components/worksheet/print-portal";

type Status = "idle" | "making" | "sending" | "done" | "error";

const REASON_HE: Record<SendWorksheetReason | "network" | "pdf", string> = {
  not_signed_in: "נראה שהחיבור לאתר פג. התחברו מחדש ונסו שוב.",
  not_teacher: "רק מורים יכולים לשלוח דפים להדפסה.",
  email_not_configured: "שליחת מיילים עדיין לא הוגדרה באתר. אפשר להוריד את הקובץ ולשלוח אותו ידנית.",
  server_not_configured: "השרת עדיין לא מוגדר לשליחה. אפשר להוריד את הקובץ ולשלוח אותו ידנית.",
  bad_request: "משהו בבקשה לא היה תקין. נסו שוב.",
  too_large: "הקובץ גדול מדי לשליחה במייל. נסו לחלק את הדף לשני דפים.",
  rate_limited: "שלחתם הרבה דפים בשעה האחרונה. נסו שוב מאוחר יותר.",
  send_failed: "המייל לא נשלח. נסו שוב בעוד רגע.",
  network: "אין חיבור לשרת. בדקו את האינטרנט ונסו שוב.",
  pdf: "לא הצלחנו להכין את קובץ ה-PDF. נסו שוב.",
};

const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return isoDate(d);
}

/**
 * "Send to print": the teacher fills in copies / date / note and the sheet is
 * turned into a PDF (students' copies only – no answer key) and emailed to
 * the school's print technician.
 */
export function SendToPrintDialog({
  open,
  onOpenChange,
  content,
  onBeforeSend,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: WorksheetContent;
  /** e.g. save the worksheet first. */
  onBeforeSend?: () => Promise<void> | void;
}) {
  const [copies, setCopies] = useState(30);
  const [neededBy, setNeededBy] = useState(tomorrow);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const versions = content.settings.layout.versions;
  const title = content.settings.layout.title || "English Worksheet";
  const busy = status === "making" || status === "sending";

  const close = (next: boolean) => {
    if (busy) return;
    onOpenChange(next);
    if (!next) {
      setStatus("idle");
      setError(null);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const send = async () => {
    setError(null);
    setStatus("making");
    try {
      await onBeforeSend?.();
    } catch {
      /* saving is best-effort */
    }

    let blob: Blob;
    try {
      // Let the hidden sheet finish rendering before capturing it.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (!sheetRef.current) throw new Error("no sheet");
      blob = await sheetToPdf(sheetRef.current);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("worksheet PDF failed", err);
      setStatus("error");
      setError(REASON_HE.pdf);
      return;
    }

    setStatus("sending");
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        setStatus("error");
        setError(REASON_HE.not_signed_in);
        return;
      }
      const body: SendWorksheetRequest = {
        pdfBase64: await blobToBase64(blob),
        title,
        copies,
        neededBy: neededBy || undefined,
        note: note.trim() || undefined,
        versions,
        grade: content.settings.grade,
        level: content.settings.level,
      };
      const res = await fetch("/api/send-worksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({ success: false }))) as SendWorksheetResponse;
      if (res.ok && data.success) {
        setTestMode(data.testMode === true);
        setStatus("done");
        return;
      }
      setStatus("error");
      setError(REASON_HE[data.reason ?? "send_failed"]);
    } catch {
      setStatus("error");
      setError(REASON_HE.network);
    }
  };

  const fileName = `${title.replace(/[^\p{L}\p{N} _-]+/gu, "").trim() || "worksheet"}.pdf`;

  return (
    <>
      <Dialog open={open} onOpenChange={close}>
        <DialogContent
          dir="rtl"
          // The close button sits top-right by default, on top of the title icon in RTL.
          className="sm:max-w-lg [&>[data-slot=dialog-close]]:right-auto [&>[data-slot=dialog-close]]:left-2"
          showCloseButton={!busy}
        >
          <DialogHeader className="text-start">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Mail className="size-5" />
              שליחת הדף להדפסה
            </DialogTitle>
            <DialogDescription>
              הדף יישלח כקובץ PDF במייל אל <span dir="ltr" className="font-semibold">{PRINT_EMAIL}</span> ({PRINT_PREFERENCES_HE}). דף התשובות לא נשלח.
            </DialogDescription>
          </DialogHeader>

          {status === "done" ? (
            <div className="space-y-4 py-2 text-center">
              <CheckCircle2 className="mx-auto size-14 text-success" />
              <p className="text-lg font-bold">הדף נשלח להדפסה!</p>
              {testMode && (
                <p className="rounded-lg bg-warning/15 px-3 py-2 text-sm font-semibold text-foreground">
                  מצב בדיקה: המייל נשלח לכתובת הבדיקה, לא לטכנאי.
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {copies}
                {versions ? " עותקים מכל גרסה" : " עותקים"}
                {neededBy ? ` · עד ${neededBy.split("-").reverse().join("/")}` : ""}
              </p>
              <Button className="h-11 w-full text-base" onClick={() => close(false)}>
                סגירה
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-base font-semibold">כמה עותקים{versions ? " מכל גרסה" : ""}?</p>
                <BigCounter value={copies} onChange={setCopies} max={MAX_PRINT_COPIES} quick={[25, 30, 35, 40]} unit="עותקים" />
              </div>
              <label className="block space-y-1.5">
                <span className="text-base font-semibold">עד מתי צריך את הדפים?</span>
                <Input type="date" value={neededBy} min={isoDate(new Date())} onChange={(e) => setNeededBy(e.target.value)} className="h-11 text-base" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-base font-semibold">הערה לטכנאי (לא חובה)</span>
                <Textarea
                  value={note}
                  maxLength={1000}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="למשל: להשאיר בתא שלי בחדר המורים"
                  className="min-h-20 text-base"
                />
              </label>

              {error && (
                <div className="space-y-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">
                  <p className="font-semibold text-destructive">{error}</p>
                  {pdfUrl && (
                    <a href={pdfUrl} download={fileName} className="inline-flex items-center gap-1.5 font-semibold text-primary underline">
                      <Download className="size-4" />
                      הורדת קובץ ה-PDF
                    </a>
                  )}
                </div>
              )}

              <Button className="h-12 w-full gap-2 text-base" onClick={send} disabled={busy}>
                {busy ? <Loader2 className="size-5 animate-spin" /> : <Printer className="size-5" />}
                {status === "making" ? "מכינים את הקובץ…" : status === "sending" ? "שולחים…" : "שליחה להדפסה"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* The sheet the PDF is made from: rendered off-screen at A4 width while the dialog is open. */}
      {open && (
        <BodyPortal>
          <div aria-hidden className="pointer-events-none fixed top-0 -z-10 overflow-hidden opacity-0" style={{ left: -20000 }}>
            <div ref={sheetRef} className="bg-white" style={{ width: PDF_SHEET_WIDTH_PX }}>
              <WorksheetAllVersions content={content} withKey={false} />
            </div>
          </div>
        </BodyPortal>
      )}
    </>
  );
}
