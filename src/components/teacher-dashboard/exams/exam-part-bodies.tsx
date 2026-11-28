"use client";

// The settings of one part (writing / unseen / vocab / grammar), shared by the
// wizard and the one-screen layout.

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExamWordPicker } from "./exam-word-picker";
import { GrammarPartBuilder, UnseenPartBuilder, VocabPartBuilder } from "./part-builders";
import type { ExamFormController } from "./use-exam-form";
import type { ExamPartDraft } from "@/types/exam";

export function ExamField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="block text-2xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function WritingPartBody({ f }: { f: ExamFormController }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <ExamField label="מינימום מילים בחיבור">
          <Input type="number" min={10} value={f.minWords} onChange={(e) => f.setMinWords(Number(e.target.value) || 0)} />
        </ExamField>
        <ExamField label="מקסימום מילים">
          <Input type="number" min={10} value={f.maxWords} onChange={(e) => f.setMaxWords(Number(e.target.value) || 0)} />
        </ExamField>
        <ExamField label="מינימום מילים מהרשימה">
          <Input type="number" min={1} value={f.minVocabUsed} onChange={(e) => f.setMinVocabUsed(Number(e.target.value) || 1)} />
        </ExamField>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {f.variants.map((v, vi) => (
          <div key={v.key} className="space-y-2 rounded-lg border border-border p-3">
            <div className="text-sm font-bold">{f.variants.length > 1 ? `נושא לגרסה ${v.key}` : "נושא הכתיבה"}</div>
            <Input
              dir="ltr"
              placeholder="Title, e.g. My best day"
              value={v.title}
              onChange={(e) => f.setVariants((prev) => prev.map((x, j) => (j === vi ? { ...x, title: e.target.value } : x)))}
            />
            <Textarea
              dir="ltr"
              rows={4}
              placeholder="Instructions for the student (in English)"
              value={v.prompt}
              onChange={(e) => f.setVariants((prev) => prev.map((x, j) => (j === vi ? { ...x, prompt: e.target.value } : x)))}
            />
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <div className="text-sm font-bold">רשימת המילים לחיבור</div>
        <p className="text-xs text-muted-foreground">
          התלמידים רואים את המילים בעברית בלבד, וכל מילה מסומנת ✓ כשהיא מופיעה באנגלית בחיבור.
        </p>
        <ExamWordPicker words={f.words} onChange={f.setWords} grade={f.grade} teacherBanks={f.vocabBanks} />
      </div>
    </div>
  );
}

export function PartBody({ f, draft }: { f: ExamFormController; draft: ExamPartDraft }) {
  switch (draft.type) {
    case "writing":
      return <WritingPartBody f={f} />;
    case "unseen":
      return <UnseenPartBuilder draft={draft} onChange={(n) => f.updateDraft(draft.id, n)} />;
    case "vocab":
      return (
        <VocabPartBuilder draft={draft} onChange={(n) => f.updateDraft(draft.id, n)} grade={f.grade} teacherBanks={f.vocabBanks} />
      );
    case "grammar":
      return <GrammarPartBuilder draft={draft} onChange={(n) => f.updateDraft(draft.id, n)} />;
  }
}
