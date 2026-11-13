"use client";

import React from "react";
import { AlertCircle, BookOpen, Check, CheckCircle2, Lightbulb, Loader2, MessageSquareQuote, Sparkles } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import type { SubmissionItem, SubmissionQuestionBreakdown } from "@/types/submission";
import type { WritingEvaluationResult } from "@/app/api/evaluate-writing/route";

function Section({ title, aside, children }: { title: React.ReactNode; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold text-muted-foreground">{title}</h3>
        {aside && <div className="text-2xs text-muted-foreground">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

const pointsTone = (pts: number) =>
  pts >= 8
    ? { border: "border-success/30", bg: "bg-success/5", text: "text-success" }
    : pts >= 5
    ? { border: "border-warning/40", bg: "bg-warning/5", text: "text-warning-foreground dark:text-warning" }
    : { border: "border-destructive/30", bg: "bg-destructive/5", text: "text-destructive" };

function formatAnswer(q: SubmissionQuestionBreakdown, which: "user" | "correct"): string {
  const val = which === "user" ? q.userAnswer : q.correctAnswer;
  if (q.type === "mcq" && q.options && typeof val === "number") return q.options[val] ?? String(val);
  if (which === "user") return String(val ?? "") || "לא נענה";
  return String(val ?? q.targetSentence ?? q.modelAnswer ?? "");
}

function QuestionsBreakdown({ questions }: { questions: SubmissionQuestionBreakdown[] }) {
  return (
    <Section title={`תשובות התלמיד/ה (${questions.length} שאלות)`}>
      <div className="space-y-2">
        {questions.map((q) => {
          const pts = typeof q.points === "number" ? q.points : q.isCorrect ? 10 : 0;
          const max = q.maxPoints ?? 10;
          const tone = pointsTone((pts / max) * 10);
          return (
            <div key={q.id} className={cn("space-y-1.5 rounded-lg border p-3 text-xs", tone.border, tone.bg)}>
              <div className="flex items-start justify-between gap-3">
                <span className="font-medium text-foreground" dir="auto">
                  {q.number}. {q.prompt}
                </span>
                <span className={cn("shrink-0 font-semibold tabular-nums", tone.text)}>
                  {pts}/{max}
                </span>
              </div>
              <div className="space-y-0.5 text-muted-foreground" dir="ltr">
                <div>
                  <span className="text-2xs">Student: </span>
                  <span className={cn("font-medium", tone.text)}>{formatAnswer(q, "user")}</span>
                </div>
                {pts < max && formatAnswer(q, "correct") && (
                  <div>
                    <span className="text-2xs">Expected: </span>
                    <span className="font-medium text-foreground">{formatAnswer(q, "correct")}</span>
                  </div>
                )}
              </div>
              {q.feedbackHebrew && <p className="text-2xs text-muted-foreground">{q.feedbackHebrew}</p>}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function VocabContent({ sub }: { sub: SubmissionItem }) {
  const summary = sub.vocabSummary;
  const words = summary?.wordsPracticed ?? [];
  const pct = summary ? Math.round((summary.masteredCount / Math.max(summary.totalWords, 1)) * 100) : null;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2">
        <Metric label="מילים בתרגול" value={summary?.totalWords ?? "—"} />
        <Metric label="בשליטה מלאה" value={summary ? `${summary.masteredCount} (${pct}%)` : "—"} />
        <Metric label="ציון תרגול" value={summary?.quizScore ?? sub.score ?? "—"} />
      </div>
      <Section title={`פירוט מילים (${words.length})`}>
        {words.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {words.map((w, idx) => (
              <span
                key={`${w.english}-${idx}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs",
                  w.mastered ? "border-success/30 bg-success/10 text-foreground" : "border-border bg-card text-foreground"
                )}
              >
                <span dir="ltr" className="font-medium">
                  {w.english}
                </span>
                <span className="text-muted-foreground">{w.hebrew}</span>
                {w.mastered && <Check className="size-3 text-success" />}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">התרגול הושלם במערכת.</p>
        )}
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
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Metric label="ציון ממוחשב" value={sub.score !== undefined ? `${sub.score}/100` : "—"} />
        <Metric label="רמה" value={isConversation ? "Conversation" : sub.storyLevel || "—"} />
        <Metric label="מקור" value={sub.generationPrompt ? "נוצר ב-AI" : "מאגר"} />
      </div>
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
        <Section title={isConversation ? "תמליל השיחה" : "קטע הקריאה"}>
          {isConversation ? (
            <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-lg border border-border bg-muted/20 p-3" dir="ltr">
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
            <div
              className="max-h-64 overflow-y-auto rounded-lg border border-border bg-muted/20 p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground"
              dir="ltr"
            >
              {sub.passageText}
            </div>
          )}
        </Section>
      )}
      {sub.questionsBreakdown && sub.questionsBreakdown.length > 0 && <QuestionsBreakdown questions={sub.questionsBreakdown} />}
      {!sub.passageText && !sub.questionsBreakdown?.length && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="size-4" />
          אין פרטים נוספים להגשה זו.
        </div>
      )}
    </div>
  );
}

function WritingContent({ sub }: { sub: SubmissionItem }) {
  return (
    <Section title="החיבור שהוגש" aside={sub.wordCount !== undefined ? `${sub.wordCount} מילים` : undefined}>
      <div
        className="rounded-lg border border-border bg-card p-5 font-sans text-[0.95rem] leading-7 whitespace-pre-wrap text-foreground"
        dir="ltr"
      >
        {sub.essayText || "אין טקסט זמין"}
      </div>
    </Section>
  );
}

const RUBRIC_ROWS = [
  { key: "contentAndOrganization", label: "תוכן וארגון", max: 35 },
  { key: "vocabulary", label: "אוצר מילים", max: 25 },
  { key: "languageAndGrammar", label: "דקדוק ומבנה", max: 25 },
  { key: "mechanicsAndSpelling", label: "איות ופיסוק", max: 15 },
] as const;

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
      <div className="flex items-center justify-center gap-2 rounded-lg border border-admin/30 bg-admin/5 p-5 text-sm text-admin">
        <Loader2 className="size-4 animate-spin" />
        בודק לפי מחוון משרד החינוך: תוכן, אוצר מילים, דקדוק ואיות…
      </div>
    );
  }
  if (!result) return null;

  return (
    <section className="space-y-4 rounded-xl border border-admin/30 bg-admin/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-admin">
            <Sparkles className="size-3.5" />
            הערכת AI (מחוון משרד החינוך)
          </div>
          {result.encouragement && <p className="text-sm text-foreground">“{result.encouragement}”</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-background px-2.5 py-1 text-lg font-semibold tabular-nums text-foreground">
            {result.score}
            <span className="text-xs text-muted-foreground">/100</span>
          </span>
          {onApply && (
            <Button size="sm" variant="outline" onClick={() => onApply(result.score, result.teacherNote)} className="gap-1">
              <Check />
              החל ציון ומשוב
            </Button>
          )}
        </div>
      </div>

      {result.rubric && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {RUBRIC_ROWS.map((row) => {
            const r = result.rubric[row.key];
            if (!r) return null;
            return (
              <div key={row.key} className="space-y-1.5 rounded-lg border border-border bg-card p-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{row.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {r.score}/{row.max}
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-admin" style={{ width: `${Math.min(100, (r.score / row.max) * 100)}%` }} />
                </div>
                {r.commentHebrew && <p className="text-2xs text-muted-foreground">{r.commentHebrew}</p>}
              </div>
            );
          })}
        </div>
      )}

      {(result.strengths?.length > 0 || result.tips?.length > 0) && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {result.strengths?.length > 0 && (
            <div className="space-y-1 rounded-lg border border-border bg-card p-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-success">
                <CheckCircle2 className="size-3.5" />
                נקודות חוזק
              </div>
              <ul className="list-inside list-disc space-y-0.5 text-foreground/90">
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {result.tips?.length > 0 && (
            <div className="space-y-1 rounded-lg border border-border bg-card p-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-warning-foreground dark:text-warning">
                <Lightbulb className="size-3.5" />
                דגשים לשיפור
              </div>
              <ul className="list-inside list-disc space-y-0.5 text-foreground/90">
                {result.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {result.corrections && result.corrections.length > 0 && (
        <div className="space-y-1.5 rounded-lg border border-border bg-card p-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <AlertCircle className="size-3.5 text-destructive" />
            תיקוני לשון ואיות ({result.corrections.length})
          </div>
          <div className="space-y-1.5">
            {result.corrections.map((corr, i) => (
              <div key={i} className="rounded-md bg-muted/40 p-2">
                <div className="flex flex-wrap items-center gap-2" dir="ltr">
                  <span className="font-mono text-destructive line-through">{corr.original}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono font-medium text-success">{corr.suggestion}</span>
                </div>
                {corr.explanationHebrew && <p className="mt-0.5 text-2xs text-muted-foreground">{corr.explanationHebrew}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/** Type-specific body of a submission (essay, passage + answers, vocab words) plus the student's note. */
export function SubmissionContent({ sub }: { sub: SubmissionItem }) {
  return (
    <div className="space-y-5">
      {sub.type === "vocab" ? (
        <VocabContent sub={sub} />
      ) : sub.type === "writing" ? (
        <WritingContent sub={sub} />
      ) : (
        <PassageContent sub={sub} />
      )}
      {sub.studentNote && (
        <div className="flex gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs">
          <MessageSquareQuote className="size-4 shrink-0 text-muted-foreground" />
          <div>
            <div className="font-medium text-foreground">הערת התלמיד/ה</div>
            <p className="text-muted-foreground">{sub.studentNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}
