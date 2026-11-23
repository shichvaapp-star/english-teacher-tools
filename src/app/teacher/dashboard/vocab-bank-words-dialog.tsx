"use client";

import React from "react";
import { Send } from "lucide-react";
import { TeacherVocabBank, GRADE_LABELS, STANDARD_LEVEL_LABELS } from "@/types/vocab-bank";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface VocabBankWordsDialogProps {
  bank: TeacherVocabBank | null;
  onClose: () => void;
  onAssign: (bank: TeacherVocabBank) => void;
  /** Replaces the grade/level line under the title. */
  subtitle?: string;
}

/** Full word list of a bank, with a shortcut to assign it. */
export function VocabBankWordsDialog({ bank, onClose, onAssign, subtitle }: VocabBankWordsDialogProps) {
  if (!bank) return null;
  const meta =
    subtitle ??
    `${GRADE_LABELS[bank.grade] || bank.grade} • ${
      bank.levelType === "custom" ? bank.customLevelName : STANDARD_LEVEL_LABELS[bank.standardLevel || ""]
    }`;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right">
          <div className="flex items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-base font-bold text-foreground">{bank.name}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {meta} • {bank.words.length} מילים
              </DialogDescription>
            </div>
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onAssign(bank);
              }}
              className="text-xs font-bold gap-1 cursor-pointer bg-success hover:bg-success text-white"
            >
              <Send className="h-3 w-3" />
              <span>הקצה משימה ממאגר זה</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="rounded-xl border border-border overflow-hidden bg-card mt-3">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                <th className="p-2.5 w-1/4">באנגלית</th>
                <th className="p-2.5 w-1/4">בעברית</th>
                <th className="p-2.5 w-1/6">חלק דיבר</th>
                <th className="p-2.5 w-1/3">משפט לדוגמה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {bank.words.map((w) => (
                <tr key={w.id} className="hover:bg-muted/20">
                  <td className="p-2.5 font-bold text-foreground" dir="ltr">
                    {w.english}
                  </td>
                  <td className="p-2.5 font-bold text-primary">{w.hebrew}</td>
                  <td className="p-2.5 text-muted-foreground text-2xs">{w.partOfSpeech || "noun"}</td>
                  <td className="p-2.5 text-muted-foreground italic text-2xs font-sans" dir="ltr">
                    {w.example ? `"${w.example}"` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
