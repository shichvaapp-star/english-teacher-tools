"use client";

// Settings cards for the non-writing exam parts: Unseen (story + questions),
// Vocabulary (words + question formats) and Grammar (topics → frozen items).

import React, { useMemo } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterSelect } from "@/components/teacher-dashboard/shared-ui/filter-select";
import { SegmentedControl } from "@/components/teacher-dashboard/shared-ui/segmented-control";
import { GrammarAssignPicker } from "@/components/grammar/grammar-assign-picker";
import { EXERCISE_TYPE_LABEL } from "@/components/grammar/exercises";
import { ExamWordPicker } from "./exam-word-picker";
import { getUnseenStories } from "@/data/unseen";
import { buildGrammarItems, replaceGrammarItem } from "@/lib/worksheet/grammar";
import { Rng } from "@/lib/grammar-gen/random";
import { grammarPrompt } from "@/lib/exam/grade-exam";
import { VOCAB_FORMAT_HE, type ExamPartDraft, type VocabQuestionFormat } from "@/types/exam";
import type { TeacherVocabBank } from "@/types/vocab-bank";
import type { ExerciseLevel } from "@/types/assignment";
import { RefreshCw, Sparkles, Trash2 } from "lucide-react";

type UnseenDraft = Extract<ExamPartDraft, { type: "unseen" }>;
type VocabDraft = Extract<ExamPartDraft, { type: "vocab" }>;
type GrammarDraft = Extract<ExamPartDraft, { type: "grammar" }>;

const GRADES = [
  { value: "7", label: "כיתה ז׳" },
  { value: "8", label: "כיתה ח׳" },
  { value: "9", label: "כיתה ט׳" },
];
const LEVELS = [
  { value: "1", label: "רמה 1" },
  { value: "2", label: "רמה 2" },
  { value: "3", label: "רמה 3" },
];

const QTYPE_HE = { mcq: "אמריקאית", open: "פתוחה", copy: "העתקה" } as const;

// ---------------------------------------------------------------------------

export function UnseenPartBuilder({ draft, onChange }: { draft: UnseenDraft; onChange: (d: UnseenDraft) => void }) {
  const stories = useMemo(() => getUnseenStories(draft.grade, `Level ${draft.level}`), [draft.grade, draft.level]);
  const story = stories.find((s) => s.id === draft.storyId);
  const chosen = new Set(draft.questionIds);

  const pickStory = (id: string) => {
    const s = stories.find((x) => x.id === id);
    onChange({ ...draft, storyId: id, questionIds: s ? s.questions.map((q) => q.id) : [], title: draft.title });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <FilterSelect
          value={String(draft.grade)}
          onChange={(v) => onChange({ ...draft, grade: Number(v) as 7 | 8 | 9, storyId: "", questionIds: [] })}
          options={GRADES}
          aria-label="כיתה"
        />
        <FilterSelect
          value={String(draft.level)}
          onChange={(v) => onChange({ ...draft, level: Number(v) as 1 | 2 | 3, storyId: "", questionIds: [] })}
          options={LEVELS}
          aria-label="רמה"
        />
        <FilterSelect
          value={draft.storyId}
          onChange={pickStory}
          options={[{ value: "", label: "בחרו קטע…" }, ...stories.map((s) => ({ value: s.id, label: s.title }))]}
          className="min-w-64"
          aria-label="קטע"
        />
      </div>
      {story && (
        <div className="grid gap-3 lg:grid-cols-2">
          <div dir="ltr" className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-border bg-muted/30 p-3 text-start text-sm">
            <div className="font-bold">{story.title}</div>
            {story.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {chosen.size}/{story.questions.length} שאלות נבחרו
              </span>
              <Button size="xs" variant="ghost" onClick={() => onChange({ ...draft, questionIds: story.questions.map((q) => q.id) })}>
                כולן
              </Button>
            </div>
            <ul className="max-h-60 space-y-1 overflow-y-auto">
              {story.questions.map((q) => (
                <li key={q.id}>
                  <label className="flex cursor-pointer items-start gap-2 rounded-md border border-border px-2 py-1.5 text-xs">
                    <Checkbox
                      checked={chosen.has(q.id)}
                      onCheckedChange={(on) =>
                        onChange({
                          ...draft,
                          questionIds: on
                            ? story.questions.filter((x) => chosen.has(x.id) || x.id === q.id).map((x) => x.id)
                            : draft.questionIds.filter((id) => id !== q.id),
                        })
                      }
                    />
                    <span className="shrink-0 rounded bg-muted px-1.5 text-3xs">{QTYPE_HE[q.type]}</span>
                    <span dir="ltr" className="text-start">
                      {q.prompt}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

const ALL_FORMATS: VocabQuestionFormat[] = ["he_to_en_type", "en_to_he_choice", "he_to_en_choice"];

export function VocabPartBuilder({
  draft,
  onChange,
  grade,
  teacherBanks,
}: {
  draft: VocabDraft;
  onChange: (d: VocabDraft) => void;
  grade?: 7 | 8 | 9;
  teacherBanks: TeacherVocabBank[];
}) {
  const toggle = (f: VocabQuestionFormat) =>
    onChange({ ...draft, formats: draft.formats.includes(f) ? draft.formats.filter((x) => x !== f) : [...draft.formats, f] });
  return (
    <div className="space-y-3">
      <ExamWordPicker
        words={draft.words}
        onChange={(words) => onChange({ ...draft, words })}
        grade={grade}
        teacherBanks={teacherBanks}
      />
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">סוגי שאלות (מתחלפים לסירוגין)</div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_FORMATS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggle(f)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  draft.formats.includes(f) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"
                )}
              >
                {VOCAB_FORMAT_HE[f]}
              </button>
            ))}
          </div>
        </div>
        <label className="space-y-1 text-xs">
          <span className="text-muted-foreground">
            מספר שאלות{draft.words.length < draft.count ? ` (יהיו ${draft.words.length} – כמספר המילים)` : ""}
          </span>
          <Input
            type="number"
            min={1}
            max={60}
            value={draft.count}
            onChange={(e) => onChange({ ...draft, count: Math.max(1, Math.min(Number(e.target.value) || 1, 60)) })}
            className="w-24"
          />
        </label>
      </div>
      <p className="text-2xs text-muted-foreground">
        מסיחים בשאלות הבחירה נלקחים מאותה רשימה. נדרשות לפחות 4 מילים.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function GrammarPartBuilder({ draft, onChange }: { draft: GrammarDraft; onChange: (d: GrammarDraft) => void }) {
  const generate = () => {
    const items = buildGrammarItems(
      { topicIds: draft.topicIds, count: draft.count, types: draft.types },
      draft.grade,
      draft.level,
      new Rng()
    );
    onChange({ ...draft, items });
  };

  const replace = (i: number) => {
    const next = replaceGrammarItem(draft.items[i], draft.items, draft.types, draft.grade, draft.level, new Rng());
    if (!next) return;
    onChange({ ...draft, items: draft.items.map((it, k) => (k === i ? next : it)) });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          value={String(draft.grade)}
          onChange={(v) => onChange({ ...draft, grade: Number(v) as 7 | 8 | 9, items: [] })}
          options={GRADES}
          aria-label="כיתה"
        />
        <SegmentedControl
          value={String(draft.level)}
          onChange={(v) => onChange({ ...draft, level: Number(v) as 1 | 2 | 3, items: [] })}
          options={LEVELS}
          aria-label="רמה"
        />
      </div>
      <GrammarAssignPicker
        topicIds={draft.topicIds}
        onTopicIdsChange={(topicIds) => onChange({ ...draft, topicIds, items: [] })}
        types={draft.types}
        onTypesChange={(types) => onChange({ ...draft, types, items: [] })}
        itemCount={draft.count}
        onItemCountChange={(n) => onChange({ ...draft, count: Math.max(1, Math.min(n ?? 10, 40)) })}
        level={`Level ${draft.level}` as ExerciseLevel}
        onLevelChange={(l) => l !== "all" && onChange({ ...draft, level: Number(l.slice(-1)) as 1 | 2 | 3, items: [] })}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={generate} disabled={draft.topicIds.length === 0}>
          <Sparkles />
          {draft.items.length ? "יצירה מחדש" : "יצירת שאלות"}
        </Button>
        <span className="text-xs text-muted-foreground">
          השאלות נקבעות עכשיו ונשמרות עם המבחן – כל התלמידים מקבלים אותן (בסדר אחר לפי גרסה).
        </span>
      </div>
      {draft.items.length > 0 && (
        <ol className="max-h-80 space-y-1 overflow-y-auto">
          {draft.items.map((it, i) => (
            <li key={it.id} className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 text-xs">
              <span className="w-6 shrink-0 tabular-nums text-muted-foreground">{i + 1}.</span>
              <span className="shrink-0 rounded bg-muted px-1.5 text-3xs">{EXERCISE_TYPE_LABEL[it.type].he}</span>
              <span dir="ltr" className="min-w-0 flex-1 truncate text-start">
                {grammarPrompt(it)}
              </span>
              {it.type === "write_own" && <span className="shrink-0 text-3xs text-warning">בדיקת מורה</span>}
              <Button size="icon-xs" variant="ghost" onClick={() => replace(i)} aria-label="החלפת שאלה">
                <RefreshCw />
              </Button>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => onChange({ ...draft, items: draft.items.filter((_, k) => k !== i) })}
                aria-label="מחיקת שאלה"
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
