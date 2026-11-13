"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { BookMarked, Printer, X } from "lucide-react";
import {
  type PrintLineSpacing,
  type PrintOptionsState,
  type PrintScope,
} from "@/components/print/use-print-options";

export interface PrintScopeLabels {
  /** Short name of the "text" part, e.g. "קטע קריאה" or "תמליל השיחה". */
  textOnlyLabel: string;
  textOnlyDesc: string;
  fullDesc: string;
  questionsOnlyDesc: string;
  /** Hint shown in the vocabulary-detected notice, e.g. "בקטע זה" / "בשיחה זו". */
  vocabContextLabel: string;
}

const LINE_SPACING_OPTIONS: { id: PrintLineSpacing; label: string; badge: string; desc: string }[] = [
  { id: "normal", label: "רגיל", badge: "1.0x", desc: "צפוף וחסכוני בנייר" },
  { id: "comfortable", label: "מרווח", badge: "1.5x", desc: "מקום לתרגום מילים" },
  { id: "double", label: "כפול", badge: "2.0x", desc: "נוח להערות בכתב יד" },
  { id: "spacious", label: "רחב מאוד", badge: "2.5x", desc: "מרווח מקסימלי לניתוח" },
];

const optionCardClass = (selected: boolean) =>
  `rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
    selected
      ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30"
      : "border-border/60 hover:bg-muted/40"
  }`;

/**
 * Shared "print worksheet / exam" options dialog (scope, line spacing, header,
 * vocabulary glosses, page split, answer key). Used by Unseen and Conversation.
 */
export function PrintOptionsModal({
  options,
  title,
  subtitle,
  labels,
  savedVocabCount,
}: {
  options: PrintOptionsState;
  title: string;
  subtitle: string;
  labels: PrintScopeLabels;
  savedVocabCount: number;
}) {
  const {
    handlePrintNow,
    printIncludeAnswers,
    printIncludeHeader,
    printIncludeVocab,
    printLineSpacing,
    printScope,
    printSeparatePages,
    setPrintIncludeAnswers,
    setPrintIncludeHeader,
    setPrintIncludeVocab,
    setPrintLineSpacing,
    setPrintScope,
    setPrintSeparatePages,
    setShowPrintModal,
    showPrintModal,
  } = options;

  if (!showPrintModal) return null;

  const scopeOptions: { id: PrintScope; label: string; desc: string; recommended?: boolean }[] = [
    { id: "full", label: "מבחן מלא", desc: labels.fullDesc, recommended: true },
    { id: "text_only", label: `${labels.textOnlyLabel} בלבד`, desc: labels.textOnlyDesc },
    { id: "questions_only", label: "שאלות בלבד", desc: labels.questionsOnlyDesc },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 print:hidden">
      <div
        className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2 text-primary">
            <Printer className="h-5 w-5" />
            <div>
              <h3 className="font-bold text-base text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPrintModal(false)}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="סגור"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scope Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground">מה ברצונך להדפיס?</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {scopeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPrintScope(opt.id)}
                className={`p-3 ${optionCardClass(printScope === opt.id)}`}
              >
                {opt.recommended ? (
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold text-foreground">{opt.label}</span>
                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">מומלץ</span>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-foreground mb-1">{opt.label}</span>
                )}
                <p className="text-[11px] text-muted-foreground leading-tight">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Line Spacing / Margins Between Lines for Handwritten Notes */}
        {printScope !== "questions_only" && (
          <div className="space-y-2 pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                מרווח בין השורות בטקסט (לכתיבת הערות ותרגומים ביד):
              </label>
              <span className="text-[10px] font-medium text-muted-foreground">Line Spacing</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LINE_SPACING_OPTIONS.map((option) => {
                const isSelected = printLineSpacing === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPrintLineSpacing(option.id)}
                    className={`p-2.5 ${optionCardClass(isSelected)}`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-foreground">{option.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {option.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">{option.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Print Options */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <label className="text-xs font-bold text-foreground">התאמות דף הבחינה:</label>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={printIncludeHeader}
                onChange={(e) => setPrintIncludeHeader(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <span>כלול כותרת מבחן רשמית (שורת שם תלמיד, כיתה, תאריך וציון)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={printIncludeVocab}
                onChange={(e) => setPrintIncludeVocab(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <span>כלול מילים מאוצר המילים שלי ותרגום קטן בעברית מעל המילים ב{labels.textOnlyLabel}</span>
            </label>

            {savedVocabCount > 0 && (
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/25 text-[11px] text-foreground flex items-center gap-2">
                <BookMarked className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>
                  זוהו <strong>{savedVocabCount} מילים</strong> שהוספת לאוצר המילים {labels.vocabContextLabel} — בהדפסה יופיע תרגום קטן בעברית מעל כל מופע שלהן בטקסט.
                </span>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={printSeparatePages}
                onChange={(e) => setPrintSeparatePages(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <span>התחל שאלות בעמוד נפרד (חלוקה קשיחה ל-2 עמודים)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={printIncludeAnswers}
                onChange={(e) => setPrintIncludeAnswers(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <span className="font-semibold text-foreground">כלול דף פתרונות ומחוון למורה בסוף הדפים</span>
            </label>
          </div>

          {/* Print Tip */}
          <div className="p-2.5 rounded-lg bg-muted/50 border border-border/40 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">💡 טיפ להדפסה מושלמת:</span> בחלון ההדפסה של הדפדפן, ודא שהשוליים (Margins) מוגדרים כ-<strong>ברירת מחדל (Default)</strong> כדי שכל העמודים ישמרו על שוליים אחידים.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPrintModal(false)}
            className="cursor-pointer text-xs"
          >
            ביטול
          </Button>
          <Button
            size="sm"
            onClick={handlePrintNow}
            className="cursor-pointer text-xs font-bold shadow-xs gap-1.5 bg-primary text-primary-foreground px-5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>הדפס עכשיו / שמור כ-PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
