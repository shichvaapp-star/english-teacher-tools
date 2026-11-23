"use client";

import React, { useMemo, useState } from "react";
import { BookOpen, Copy, Download, Eye, Search, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/teacher-dashboard/shared-ui/segmented-control";
import { CLASS_GRADES, GRADE_LABELS, type ClassGrade } from "@/lib/levels";
import { textbookBanks } from "@/lib/textbook-vocab-banks";
import { exportBankToCSV } from "@/lib/vocab-bank-storage";
import { BOOK_NAME } from "@/lib/worksheet/labels";
import type { TeacherVocabBank } from "@/types/vocab-bank";
import { VocabBankWordsDialog } from "./vocab-bank-words-dialog";

interface TextbookVocabBanksViewProps {
  onAssignFromBank: (bank: TeacherVocabBank) => void;
  onCopyBank: (bank: TeacherVocabBank) => void;
}

/** The built-in textbook vocabulary, one card per unit, grouped by grade. */
export function TextbookVocabBanksView({ onAssignFromBank, onCopyBank }: TextbookVocabBanksViewProps) {
  const [grade, setGrade] = useState<ClassGrade>(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingBank, setViewingBank] = useState<TeacherVocabBank | null>(null);

  const banks = textbookBanks(grade);
  const q = searchQuery.toLowerCase().trim();
  const filtered = useMemo(
    () =>
      q
        ? banks.filter((b) => b.words.some((w) => w.english.toLowerCase().includes(q) || w.hebrew.includes(q)))
        : banks,
    [banks, q]
  );
  const totalWords = banks.reduce((n, b) => n + b.words.length, 0);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <SegmentedControl
          aria-label="שכבה"
          value={String(grade)}
          onChange={(v) => setGrade(Number(v) as ClassGrade)}
          options={CLASS_GRADES.map((g) => ({ value: String(g), label: GRADE_LABELS[g].he }))}
        />
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="באיזו יחידה מופיעה המילה..."
            className="h-8 pr-8 text-xs"
          />
        </div>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <BookOpen className="size-3.5" />
          <span dir="ltr" className="font-semibold text-foreground">
            {BOOK_NAME[grade]}
          </span>
          <span>
            · {banks.length} יחידות · {totalWords} מילים
          </span>
        </span>
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-xs text-muted-foreground">
          המילה לא מופיעה באף יחידה של {GRADE_LABELS[grade].he}.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((bank, i) => {
          const matches = q
            ? bank.words.filter((w) => w.english.toLowerCase().includes(q) || w.hebrew.includes(q))
            : [];
          const preview = q ? matches : bank.words;
          const unitNo = Number(bank.id.replace(/.*-u/, "")) || i + 1;
          return (
            <Card
              key={bank.id}
              className="border border-border/80 bg-card hover:border-primary/40 transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs"
            >
              <CardHeader className="p-4 pb-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-bold text-foreground">יחידה {unitNo}</CardTitle>
                    <CardDescription className="text-2xs" dir="ltr">
                      {BOOK_NAME[grade]} · Unit {unitNo}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-3xs shrink-0 font-bold">
                    {q ? `${matches.length} מתוך ${bank.words.length}` : `${bank.words.length} מילים`}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1 space-y-3">
                <div className="flex flex-wrap gap-1 min-h-12 content-start">
                  {preview.slice(0, 6).map((w) => (
                    <span
                      key={w.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-2xs text-foreground font-medium"
                    >
                      <span className="font-bold" dir="ltr">
                        {w.english}
                      </span>
                      <span className="text-muted-foreground text-3xs">({w.hebrew})</span>
                    </span>
                  ))}
                  {preview.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setViewingBank(bank)}
                      className="text-3xs text-primary hover:underline font-bold px-1 py-0.5 cursor-pointer self-center"
                    >
                      +{preview.length - 6} נוספות...
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onAssignFromBank(bank)}
                    className="text-xs h-7.5 font-bold gap-1 cursor-pointer bg-success hover:bg-success text-white shadow-2xs flex-1"
                  >
                    <Send className="h-3 w-3" />
                    <span>הקצה משימה</span>
                  </Button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewingBank(bank)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="הצג את כל המילים ביחידה"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onCopyBank(bank)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="העתק למאגרים שלי (לעריכה)"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => exportBankToCSV(bank)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="ייצוא לקובץ CSV / Excel"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <VocabBankWordsDialog
        bank={viewingBank}
        onClose={() => setViewingBank(null)}
        onAssign={onAssignFromBank}
        subtitle={viewingBank ? `${GRADE_LABELS[grade].he} · ספר הלימוד` : undefined}
      />
    </div>
  );
}
