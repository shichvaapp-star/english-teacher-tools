"use client";

// Picks the exam's vocabulary list (usually 30 words) from the textbook units,
// the teacher's own word banks, or typed in by hand.

import React, { useMemo, useState } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSelect } from "@/components/teacher-dashboard/shared-ui/filter-select";
import { textbookBanks } from "@/lib/textbook-vocab-banks";
import { CLASS_GRADES, type ClassGrade } from "@/lib/levels";
import type { TeacherVocabBank } from "@/types/vocab-bank";
import type { ExamVocabAnswer } from "@/types/exam";
import { Plus, Shuffle, X } from "lucide-react";

export const TARGET_WORDS = 30;

interface ExamWordPickerProps {
  words: ExamVocabAnswer[];
  onChange: (words: ExamVocabAnswer[]) => void;
  grade?: ClassGrade;
  teacherBanks: TeacherVocabBank[];
}

export function ExamWordPicker({ words, onChange, grade, teacherBanks }: ExamWordPickerProps) {
  const banks = useMemo(() => {
    const grades = grade ? [grade] : [...CLASS_GRADES];
    return [...grades.flatMap((g) => textbookBanks(g)), ...teacherBanks.filter((b) => b.words.length > 0)];
  }, [grade, teacherBanks]);
  const [bankId, setBankId] = useState<string>("");
  const bank = banks.find((b) => b.id === bankId) ?? banks[0];
  const [english, setEnglish] = useState("");
  const [hebrew, setHebrew] = useState("");

  const chosenEnglish = new Set(words.map((w) => w.english.trim().toLowerCase()));
  const idFor = (b: TeacherVocabBank, wordId: string) => `${b.id}:${wordId}`;

  const toggle = (b: TeacherVocabBank, w: TeacherVocabBank["words"][number]) => {
    const key = w.english.trim().toLowerCase();
    if (chosenEnglish.has(key)) {
      onChange(words.filter((x) => x.english.trim().toLowerCase() !== key));
    } else {
      onChange([...words, { id: idFor(b, w.id), english: w.english.trim(), hebrew: w.hebrew.trim() }]);
    }
  };

  const fillRandom = () => {
    if (!bank) return;
    const pool = bank.words.filter((w) => w.hebrew && !chosenEnglish.has(w.english.trim().toLowerCase()));
    const need = Math.max(0, TARGET_WORDS - words.length);
    const picks = [...pool].sort(() => Math.random() - 0.5).slice(0, need);
    onChange([
      ...words,
      ...picks.map((w) => ({ id: idFor(bank, w.id), english: w.english.trim(), hebrew: w.hebrew.trim() })),
    ]);
  };

  const addManual = () => {
    const en = english.trim();
    const he = hebrew.trim();
    if (!en || !he || chosenEnglish.has(en.toLowerCase())) return;
    onChange([...words, { id: `manual:${Date.now().toString(36)}`, english: en, hebrew: he }]);
    setEnglish("");
    setHebrew("");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            value={bank?.id ?? ""}
            onChange={setBankId}
            options={banks.map((b) => ({ value: b.id, label: b.name }))}
            className="min-w-56"
            aria-label="מאגר מילים"
          />
          <Button variant="outline" size="sm" onClick={fillRandom} disabled={!bank || words.length >= TARGET_WORDS}>
            <Shuffle />
            השלמה אקראית ל-{TARGET_WORDS}
          </Button>
        </div>
        <div className="flex max-h-72 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-border p-2">
          {bank?.words.map((w) => {
            const on = chosenEnglish.has(w.english.trim().toLowerCase());
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => toggle(bank, w)}
                disabled={!w.hebrew}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs disabled:opacity-40",
                  on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"
                )}
              >
                <span dir="ltr">{w.english}</span> · {w.hebrew}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input dir="ltr" placeholder="English" value={english} onChange={(e) => setEnglish(e.target.value)} className="w-40" />
          <Input placeholder="עברית" value={hebrew} onChange={(e) => setHebrew(e.target.value)} className="w-40" />
          <Button variant="outline" size="sm" onClick={addManual} disabled={!english.trim() || !hebrew.trim()}>
            <Plus />
            הוספה ידנית
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">ברשימת המבחן</span>
          <span className={cn("font-mono tabular-nums", words.length === TARGET_WORDS ? "text-success" : "text-muted-foreground")}>
            {words.length}/{TARGET_WORDS}
          </span>
        </div>
        {words.length === 0 ? (
          <p className="text-xs text-muted-foreground">בחרו מילים מהמאגר. התלמידים יראו רק את העברית.</p>
        ) : (
          <ul className="grid max-h-80 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2">
            {words.map((w) => (
              <li key={w.id} className="flex items-center justify-between gap-2 rounded-md border border-border px-2 py-1 text-xs">
                <span className="truncate">
                  {w.hebrew} · <span dir="ltr">{w.english}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onChange(words.filter((x) => x.id !== w.id))}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`הסרת ${w.english}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
