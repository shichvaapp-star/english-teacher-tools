"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ExamResultSummaryView } from "@/components/exam/exam-result-summary";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Lightbulb,
  Loader2,
  MessageSquareQuote,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SubmissionItem, SubmissionQuestionBreakdown } from "@/types/submission";
import type { WritingCorrection, WritingEvaluationResult } from "@/app/api/evaluate-writing/route";
import { findWritingTaskById } from "@/data/writing-tasks";
import { SegmentedControl } from "../shared-ui/segmented-control";

function Section({ title, aside, children }: { title: React.ReactNode; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {aside && <div className="text-xs text-muted-foreground">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

type AnswerFilter = "all" | "wrong";

function AnswerFilterToggle({ value, onChange, total, wrong }: { value: AnswerFilter; onChange: (v: AnswerFilter) => void; total: number; wrong: number }) {
  if (wrong === 0 || wrong === total) return null;
  return (
    <SegmentedControl<AnswerFilter>
      aria-label="סינון תשובות"
      value={value}
      onChange={onChange}
      options={[
        { value: "all", label: "הכל", count: total },
        { value: "wrong", label: "לטיפול", count: wrong },
      ]}
    />
  );
}

const ratioTone = (ratio: number) =>
  ratio >= 0.8
    ? { text: "text-success", icon: "bg-success/15 text-success" }
    : ratio >= 0.5
    ? { text: "text-warning-foreground dark:text-warning", icon: "bg-warning/15 text-warning-foreground dark:text-warning" }
    : { text: "text-destructive", icon: "bg-destructive/10 text-destructive" };

function formatAnswer(q: SubmissionQuestionBreakdown, which: "user" | "correct"): string {
  const val = which === "user" ? q.userAnswer : q.correctAnswer;
  if (q.type === "mcq" && q.options && typeof val === "number") return q.options[val] ?? String(val);
  if (which === "user") return String(val ?? "") || "לא נענה";
  return String(val ?? q.targetSentence ?? q.modelAnswer ?? "");
}

/** One answer row: status mark, prompt, student answer, expected answer when wrong. */
function AnswerRow({
  index,
  label,
  prompt,
  studentAnswer,
  expected,
  scoreLabel,
  ratio,
  flagged,
  note,
}: {
  index: number;
  label?: string;
  prompt: string;
  studentAnswer: string;
  expected?: string;
  scoreLabel: string;
  ratio: number;
  flagged?: boolean;
  note?: string;
}) {
  const tone = flagged
    ? { text: "text-warning-foreground dark:text-warning", icon: "bg-warning/15 text-warning-foreground dark:text-warning" }
    : ratioTone(ratio);
  const Icon = flagged ? CircleAlert : ratio >= 1 ? Check : ratio > 0 ? CircleAlert : X;
  return (
    <li className="flex gap-3 border-b border-border/60 py-3 last:border-b-0">
      <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full", tone.icon)}>
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-foreground" dir="auto">
            <span className="text-muted-foreground">{index}. </span>
            {prompt}
          </p>
          <span className={cn("shrink-0 text-xs font-semibold tabular-nums", tone.text)}>{scoreLabel}</span>
        </div>
        {label && <p className="text-2xs text-muted-foreground">{label}</p>}
        <div className="space-y-0.5 text-sm" dir="ltr">
          <p className={cn("font-medium", ratio >= 1 && !flagged ? "text-foreground" : tone.text)}>{studentAnswer || "—"}</p>
          {expected && (
            <p className="text-xs text-muted-foreground">
              <span className="text-2xs">Expected: </span>
              <span className="text-foreground">{expected}</span>
            </p>
          )}
        </div>
        {note && <p className="text-xs text-muted-foreground">{note}</p>}
      </div>
    </li>
  );
}

function QuestionsBreakdown({ questions }: { questions: SubmissionQuestionBreakdown[] }) {
  const [filter, setFilter] = useState<AnswerFilter>("all");
  const rows = questions.map((q) => {
    const pts = typeof q.points === "number" ? q.points : q.isCorrect ? 10 : 0;
    const max = q.maxPoints ?? 10;
    return { q, pts, max, ratio: max > 0 ? pts / max : 0 };
  });
  const wrong = rows.filter((r) => r.ratio < 1).length;
  const shown = filter === "wrong" ? rows.filter((r) => r.ratio < 1) : rows;
  return (
    <Section
      title={`תשובות (${questions.length - wrong}/${questions.length} מלאות)`}
      aside={<AnswerFilterToggle value={filter} onChange={setFilter} total={rows.length} wrong={wrong} />}
    >
      <ul className="rounded-xl border border-border bg-card px-4">
        {shown.map(({ q, pts, max, ratio }) => {
          const expected = ratio < 1 ? formatAnswer(q, "correct") : "";
          return (
            <AnswerRow
              key={q.id}
              index={q.number}
              prompt={q.prompt}
              studentAnswer={formatAnswer(q, "user")}
              expected={expected || undefined}
              scoreLabel={`${pts}/${max}`}
              ratio={ratio}
              note={q.feedbackHebrew}
            />
          );
        })}
      </ul>
    </Section>
  );
}

function VocabContent({ sub }: { sub: SubmissionItem }) {
  const summary = sub.vocabSummary;
  const words = summary?.wordsPracticed ?? [];
  const notMastered = words.filter((w) => !w.mastered);
  const mastered = words.filter((w) => w.mastered);
  const pct = summary ? Math.round((summary.masteredCount / Math.max(summary.totalWords, 1)) * 100) : null;
  const chip = (w: (typeof words)[number], idx: number) => (
    <span
      key={`${w.english}-${idx}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm",
        w.mastered ? "border-success/30 bg-success/10 text-foreground" : "border-warning/40 bg-warning/5 text-foreground"
      )}
    >
      <span dir="ltr" className="font-medium">
        {w.english}
      </span>
      <span className="text-xs text-muted-foreground">{w.hebrew}</span>
    </span>
  );
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        <Metric label="מילים בתרגול" value={summary?.totalWords ?? "—"} />
        <Metric label="בשליטה מלאה" value={summary ? `${summary.masteredCount} (${pct}%)` : "—"} />
        <Metric label="ציון תרגול" value={summary?.quizScore ?? sub.score ?? "—"} />
      </div>
      {words.length > 0 ? (
        <>
          {notMastered.length > 0 && (
            <Section title={`עדיין לא בשליטה (${notMastered.length})`}>
              <div className="flex flex-wrap gap-1.5">{notMastered.map(chip)}</div>
            </Section>
          )}
          {mastered.length > 0 && (
            <Section title={`בשליטה (${mastered.length})`}>
              <div className="flex flex-wrap gap-1.5">{mastered.map(chip)}</div>
            </Section>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">התרגול הושלם במערכת.</p>
      )}
    </div>
  );
}

const GRAMMAR_TYPE_HE: Record<string, string> = {
  mcq: "בחירה",
  gap_bank: "בנק מילים",
  gap_type: "הקלדת הצורה",
  unscramble: "בניית משפט",
  find_fix: "מצאו ותקנו",
  transform: "שינוי משפט",
  sort: "מיון",
  match_halves: "התאמת חצאים",
  cloze_text: "טקסט קצר",
  write_own: "כתיבה חופשית",
};

function GrammarContent({ sub }: { sub: SubmissionItem }) {
  const [filter, setFilter] = useState<AnswerFilter>("all");
  const summary = sub.grammarSummary;
  // Items waiting for the teacher come first, then the original order
  const entries = useMemo(
    () =>
      (summary?.entries ?? [])
        .map((e, idx) => ({ e, idx }))
        .sort((a, b) => Number(b.e.needsReview) - Number(a.e.needsReview) || a.idx - b.idx),
    [summary]
  );
  const review = entries.filter(({ e }) => e.needsReview).length;
  const hints = entries.filter(({ e }) => e.usedHint).length;
  const toHandle = entries.filter(({ e }) => e.needsReview || !e.isCorrect).length;
  const shown = filter === "wrong" ? entries.filter(({ e }) => e.needsReview || !e.isCorrect) : entries;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        <Metric label="נכונים" value={summary ? `${summary.correctItems}/${summary.totalItems}` : "—"} />
        <Metric label="ציון" value={sub.score ?? "—"} />
        <Metric label="רמה" value={summary ? `${summary.level}${summary.grade ? ` · כיתה ${summary.grade}` : ""}` : "—"} />
      </div>
      {(review > 0 || hints > 0) && (
        <p className="text-xs text-muted-foreground">
          {review > 0 && <span className="font-semibold text-warning-foreground dark:text-warning">{review} תשובות ממתינות לבדיקה שלך (מופיעות ראשונות). </span>}
          {hints > 0 && <span>{hints} תרגילים נפתרו בעזרת רמז.</span>}
        </p>
      )}
      <Section
        title={`תשובות (${entries.length} תרגילים)`}
        aside={<AnswerFilterToggle value={filter} onChange={setFilter} total={entries.length} wrong={toHandle} />}
      >
        <ul className="rounded-xl border border-border bg-card px-4">
          {shown.map(({ e, idx }) => (
            <AnswerRow
              key={`${e.itemId}-${idx}`}
              index={idx + 1}
              prompt={e.prompt}
              label={[GRAMMAR_TYPE_HE[e.exerciseType] ?? e.exerciseType, e.usedHint && "רמז", e.aiGraded && "נבדק ב-AI"].filter(Boolean).join(" · ")}
              studentAnswer={e.studentAnswer}
              expected={!e.isCorrect && e.expected ? e.expected : undefined}
              scoreLabel={e.needsReview ? "לבדיקה" : `${Math.round(e.points * 10)}/10`}
              ratio={e.points}
              flagged={e.needsReview}
              note={!e.isCorrect ? e.feedbackHebrew : undefined}
            />
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="text-2xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}

function PassageContent({ sub }: { sub: SubmissionItem }) {
  const isConversation = sub.type === "conversation";
  const hasQuestions = Boolean(sub.questionsBreakdown && sub.questionsBreakdown.length > 0);
  return (
    <div className="space-y-6">
      {sub.generationPrompt && (
        <div className="space-y-1 rounded-lg border border-admin/30 bg-admin/5 p-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-admin">
            <Sparkles className="size-3.5" />
            {isConversation ? "הפרומפט שהתלמיד/ה כתב/ה ליצירת השיחה" : "הפרומפט שהתלמיד/ה כתב/ה ליצירת הטקסט"}
          </div>
          <p className="text-foreground" dir="auto">
            “{sub.generationPrompt}”
          </p>
        </div>
      )}
      {sub.passageText && (
        <Collapsible defaultOpen={!hasQuestions} className="rounded-xl border border-border bg-muted/20">
          <CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between gap-2 p-3 text-sm font-medium text-foreground">
            <span className="flex items-center gap-2">
              <BookOpen className="size-4 text-muted-foreground" />
              {isConversation ? "תמליל השיחה" : "קטע הקריאה"}
              {sub.storyLevel && !isConversation && <span className="text-xs font-normal text-muted-foreground">· {sub.storyLevel}</span>}
            </span>
            <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {isConversation ? (
              <div className="max-h-96 space-y-1.5 overflow-y-auto border-t border-border p-3" dir="ltr">
                {sub.passageText.split("\n").filter(Boolean).map((line, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-1.5 text-sm leading-relaxed",
                      idx % 2 === 0 ? "bg-info/10 text-foreground" : "ml-auto bg-success/10 text-foreground"
                    )}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto border-t border-border p-4 text-base leading-relaxed whitespace-pre-wrap text-foreground" dir="ltr">
                {sub.passageText}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
      {hasQuestions && <QuestionsBreakdown questions={sub.questionsBreakdown ?? []} />}
      {!sub.passageText && !hasQuestions && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="size-4" />
          אין פרטים נוספים להגשה זו.
        </div>
      )}
    </div>
  );
}

type Segment = { text: string; correction?: WritingCorrection };

/** Splits the essay into plain text and the first match of each correction (non-overlapping). */
function segmentEssay(text: string, corrections: WritingCorrection[]): Segment[] {
  const ranges: { start: number; end: number; correction: WritingCorrection }[] = [];
  for (const correction of corrections) {
    const needle = correction.original?.trim();
    if (!needle) continue;
    let from = 0;
    while (from <= text.length) {
      const start = text.indexOf(needle, from);
      if (start < 0) break;
      const end = start + needle.length;
      if (!ranges.some((r) => start < r.end && end > r.start)) {
        ranges.push({ start, end, correction });
        break;
      }
      from = start + 1;
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  const out: Segment[] = [];
  let pos = 0;
  for (const r of ranges) {
    if (r.start > pos) out.push({ text: text.slice(pos, r.start) });
    out.push({ text: text.slice(r.start, r.end), correction: r.correction });
    pos = r.end;
  }
  if (pos < text.length) out.push({ text: text.slice(pos) });
  return out;
}

function ExamInfoStrip({ exam }: { exam: NonNullable<SubmissionItem["examInfo"]> }) {
  const vocabOk = exam.vocabUsed.length >= exam.minVocabUsed;
  return (
    <div className="space-y-2 rounded-lg border border-border p-3 text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-medium">מבחן במעבדה</span>
        <span className={cn("tabular-nums", vocabOk ? "text-success" : "text-destructive")}>
          מילים מהרשימה: {exam.vocabUsed.length}/{exam.vocabTotal} (נדרש {exam.minVocabUsed}) {vocabOk ? "✓" : "✗"}
        </span>
        <span className={cn("tabular-nums", exam.locks > 0 && "font-medium text-destructive")}>נעילות: {exam.locks}</span>
        <span className="tabular-nums text-muted-foreground">התראות: {exam.flags}</span>
        <Link
          href={`/teacher/dashboard/exams/${encodeURIComponent(exam.examId)}/integrity`}
          className="text-primary underline-offset-4 hover:underline"
        >
          בדיקת העתקות והקלטה
        </Link>
      </div>
      {exam.vocabUsed.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {exam.vocabUsed.map((w) => (
            <span key={w.english} className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-2xs">
              <span dir="ltr">{w.english}</span> · {w.hebrew}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function WritingContent({ sub, corrections }: { sub: SubmissionItem; corrections?: WritingCorrection[] }) {
  const [showCorrections, setShowCorrections] = useState(true);
  const exam = sub.examInfo;
  const found = findWritingTaskById(sub.taskId);
  const task = exam ? { prompt: exam.prompt, minWords: exam.minWords, maxWords: exam.maxWords } : found;
  const text = sub.essayText || "";
  const words = sub.wordCount ?? (text.trim() ? text.trim().split(/\s+/).length : 0);
  const outOfRange = task ? words < task.minWords || words > task.maxWords : false;
  const segments = useMemo(
    () => (showCorrections && corrections?.length ? segmentEssay(text, corrections) : [{ text }]),
    [text, corrections, showCorrections]
  );
  const marked = segments.filter((s) => s.correction).length;

  return (
    <div className="space-y-4">
      {task && (
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm" dir="ltr">
          <div className="text-2xs text-muted-foreground" dir="rtl">
            המשימה
          </div>
          <p className="text-foreground">{task.prompt}</p>
        </div>
      )}
      {exam && <ExamInfoStrip exam={exam} />}
      <Section
        title="החיבור"
        aside={
          <span className="flex items-center gap-3">
            <span className={cn("tabular-nums", outOfRange && "font-medium text-warning-foreground dark:text-warning")}>
              {words} מילים{task ? ` (נדרש ${task.minWords}–${task.maxWords})` : ""}
            </span>
            {corrections && corrections.length > 0 && (
              <Button variant="ghost" size="xs" onClick={() => setShowCorrections((v) => !v)} className="gap-1 text-xs">
                <span className={cn("size-2 rounded-full", showCorrections ? "bg-destructive" : "bg-muted-foreground")} />
                {showCorrections ? `הסתר תיקונים (${marked})` : `הצג תיקונים (${corrections.length})`}
              </Button>
            )}
          </span>
        }
      >
        <div className="rounded-xl border border-border bg-card px-6 py-5 text-lg leading-9 whitespace-pre-wrap text-foreground" dir="ltr">
          {text
            ? segments.map((s, i) =>
                s.correction ? (
                  <Tooltip key={i}>
                    <TooltipTrigger
                      render={
                        <mark className="cursor-help rounded-sm bg-destructive/15 text-foreground underline decoration-destructive decoration-wavy underline-offset-4" />
                      }
                    >
                      {s.text}
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-0.5">
                        <div dir="ltr" className="font-medium">
                          → {s.correction.suggestion}
                        </div>
                        {s.correction.explanationHebrew && <div dir="auto">{s.correction.explanationHebrew}</div>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <React.Fragment key={i}>{s.text}</React.Fragment>
                )
              )
            : <span className="text-base text-muted-foreground">אין טקסט זמין</span>}
        </div>
      </Section>
    </div>
  );
}

const RUBRIC_ROWS = [
  { key: "contentAndOrganization", label: "תוכן וארגון", max: 35 },
  { key: "vocabulary", label: "אוצר מילים", max: 25 },
  { key: "languageAndGrammar", label: "דקדוק ומבנה", max: 25 },
  { key: "mechanicsAndSpelling", label: "איות ופיסוק", max: 15 },
] as const;

/** Compact AI evaluation for the grading panel: score + apply, with the rubric details collapsible. */
export function AiEvaluationPanel({
  result,
  isEvaluating,
  onApply,
}: {
  result: WritingEvaluationResult | null;
  isEvaluating: boolean;
  onApply?: (score: number, note?: string) => void;
}) {
  if (isEvaluating) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-admin/30 bg-admin/5 p-3 text-xs text-admin">
        <Loader2 className="size-4 shrink-0 animate-spin" />
        בודק לפי מחוון משרד החינוך…
      </div>
    );
  }
  if (!result) return null;

  return (
    <section className="space-y-3 rounded-lg border border-admin/30 bg-admin/5 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-admin">
          <Sparkles className="size-3.5" />
          הצעת AI
        </div>
        <span className="text-lg font-semibold tabular-nums text-foreground">
          {result.score}
          <span className="text-xs text-muted-foreground">/100</span>
        </span>
      </div>
      {onApply && (
        <Button size="sm" variant="outline" onClick={() => onApply(result.score, result.teacherNote)} className="w-full gap-1">
          <Check />
          החל ציון ומשוב
        </Button>
      )}
      <Collapsible>
        <CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between text-xs text-muted-foreground hover:text-foreground">
          פירוט לפי המחוון
          <ChevronDown className="size-3.5 transition-transform group-data-[panel-open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          {result.rubric && (
            <div className="space-y-2">
              {RUBRIC_ROWS.map((row) => {
                const r = result.rubric[row.key];
                if (!r) return null;
                return (
                  <div key={row.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{row.label}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {r.score}/{row.max}
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-admin" style={{ width: `${Math.min(100, (r.score / row.max) * 100)}%` }} />
                    </div>
                    {r.commentHebrew && <p dir="auto" className="text-2xs text-muted-foreground">{r.commentHebrew}</p>}
                  </div>
                );
              })}
            </div>
          )}
          {result.strengths?.length > 0 && (
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-success">
                <CheckCircle2 className="size-3.5" />
                נקודות חוזק
              </div>
              <ul className="list-inside list-disc space-y-0.5 text-foreground/90">
                {result.strengths.map((s, i) => (
                  <li key={i} dir="auto">{s}</li>
                ))}
              </ul>
            </div>
          )}
          {result.tips?.length > 0 && (
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-warning-foreground dark:text-warning">
                <Lightbulb className="size-3.5" />
                דגשים לשיפור
              </div>
              <ul className="list-inside list-disc space-y-0.5 text-foreground/90">
                {result.tips.map((t, i) => (
                  <li key={i} dir="auto">{t}</li>
                ))}
              </ul>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}

/** Type-specific body of a submission (essay, passage + answers, vocab words) plus the student's note. */
export function SubmissionContent({ sub, corrections }: { sub: SubmissionItem; corrections?: WritingCorrection[] }) {
  return (
    <div className="space-y-6">
      {sub.studentNote && (
        <div className="flex gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
          <MessageSquareQuote className="size-4 shrink-0 text-muted-foreground" />
          <div>
            <div className="text-xs font-medium text-foreground">הערת התלמיד/ה</div>
            <p className="text-muted-foreground">{sub.studentNote}</p>
          </div>
        </div>
      )}
      {sub.type === "exam" ? (
        <ExamResultSummaryView sub={sub} />
      ) : sub.type === "grammar" ? (
        <GrammarContent sub={sub} />
      ) : sub.type === "vocab" ? (
        <VocabContent sub={sub} />
      ) : sub.type === "writing" ? (
        <WritingContent sub={sub} corrections={corrections} />
      ) : (
        <PassageContent sub={sub} />
      )}
    </div>
  );
}
