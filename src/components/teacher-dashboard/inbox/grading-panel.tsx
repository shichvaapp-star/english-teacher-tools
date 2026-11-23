"use client";

import React, { useEffect, useState } from "react";
import { BookmarkPlus, Check, CheckCheck, Cpu, Loader2, Sparkles, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SubmissionItem } from "@/types/submission";
import type { WritingEvaluationResult } from "@/app/api/evaluate-writing/route";
import { AiEvaluationPanel } from "../submission-content/submission-content";
import { gradeTone } from "../shared-ui/status-badge";
import { BUILT_IN_QUICK_COMMENTS } from "./quick-comments";

const QUICK_GRADES = [100, 90, 80, 70, 60];
const COLLAPSED_BUILT_INS = 3;

const isTypingTarget = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

export interface GradingPanelProps {
  sub: SubmissionItem;
  aiResult: WritingEvaluationResult | null;
  isEvaluatingAi: boolean;
  onRunAi: () => void;
  /** grade undefined = mark as checked without a grade. */
  onSave: (grade: number | undefined, feedback: string, advance: boolean) => Promise<void>;
  hasNext: boolean;
  quickComments: string[];
  onAddQuickComment: (text: string) => void;
  onRemoveQuickComment: (text: string) => void;
  gradeInputRef: React.RefObject<HTMLInputElement | null>;
  className?: string;
}

export function GradingPanel({
  sub,
  aiResult,
  isEvaluatingAi,
  onRunAi,
  onSave,
  hasNext,
  quickComments,
  onAddQuickComment,
  onRemoveQuickComment,
  gradeInputRef,
  className,
}: GradingPanelProps) {
  // Draft starts from the saved grade/feedback; the parent remounts this component per submission
  const initialGrade = sub.grade ?? sub.score;
  const [grade, setGrade] = useState(initialGrade !== undefined ? String(initialGrade) : "");
  const [feedback, setFeedback] = useState(sub.teacherFeedback || sub.teacherNote || "");
  const [saving, setSaving] = useState<"save" | "next" | "accept" | "seen" | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);

  const isReviewed = sub.status === "reviewed";
  const autoScore = sub.type === "writing" ? aiResult?.score ?? sub.score : sub.score;
  const gradeNumber = grade.trim() === "" ? undefined : Number(grade.trim());
  const gradeInvalid = gradeNumber !== undefined && (Number.isNaN(gradeNumber) || gradeNumber < 0 || gradeNumber > 100);
  const busy = Boolean(saving);

  const run = async (kind: NonNullable<typeof saving>, g: number | undefined, advance: boolean) => {
    if (busy) return;
    setSaving(kind);
    try {
      await onSave(g, feedback.trim(), advance);
    } finally {
      setSaving(null);
    }
  };

  const save = (advance: boolean) => {
    if (gradeInvalid) return;
    run(advance ? "next" : "save", gradeNumber, advance);
  };
  const acceptAuto = () => {
    if (autoScore === undefined) return;
    run("accept", autoScore, true);
  };

  // S = accept the computer score and move on
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      if (document.querySelector("[role=dialog]")) return;
      if (e.key.toLowerCase() === "s" && autoScore !== undefined) {
        e.preventDefault();
        acceptAuto();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const appendComment = (text: string) => {
    setFeedback((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
  };

  const trimmedFeedback = feedback.trim();
  const canSaveComment =
    trimmedFeedback.length > 0 &&
    trimmedFeedback.length <= 200 &&
    !quickComments.includes(trimmedFeedback) &&
    !BUILT_IN_QUICK_COMMENTS.includes(trimmedFeedback);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          save(true);
        }
      }}
      className={cn("flex flex-col gap-4", className)}
    >
      {/* Computer score (writing shows its AI suggestion below instead) */}
      {autoScore !== undefined && sub.type !== "writing" && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Cpu className="size-3.5" />
              ציון אוטומטי
            </span>
            <span className={cn("rounded-md px-2 py-0.5 text-lg font-semibold tabular-nums", gradeTone(autoScore))}>{autoScore}</span>
          </div>
          {!isReviewed && (
            <Button type="button" size="sm" variant="secondary" onClick={acceptAuto} disabled={busy} className="w-full gap-1.5">
              {saving === "accept" ? <Loader2 className="animate-spin" /> : <CheckCheck />}
              {hasNext ? "אשר ציון והמשך" : "אשר ציון"}
              <Kbd>S</Kbd>
            </Button>
          )}
        </div>
      )}

      {/* Writing AI check */}
      {sub.type === "writing" && (
        <div className="space-y-2">
          {!aiResult && !isEvaluatingAi && (
            <Button type="button" size="sm" variant="outline" onClick={onRunAi} className="w-full gap-1.5">
              <Sparkles className="text-admin" />
              בדיקת AI לפי המחוון
              <Kbd>A</Kbd>
            </Button>
          )}
          <AiEvaluationPanel
            result={aiResult}
            isEvaluating={isEvaluatingAi}
            onApply={(score, note) => {
              setGrade(String(score));
              if (note) setFeedback(note);
              gradeInputRef.current?.focus();
            }}
          />
          {aiResult && !isEvaluatingAi && (
            <Button type="button" variant="link" size="xs" onClick={onRunAi} className="px-0 text-2xs">
              הרץ בדיקת AI מחדש
            </Button>
          )}
        </div>
      )}

      {/* Grade */}
      <div className="space-y-1.5">
        <label htmlFor="review-grade" className="text-xs font-medium text-foreground">
          ציון
        </label>
        <div className="flex items-center gap-2">
          <Input
            id="review-grade"
            ref={gradeInputRef}
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            aria-invalid={gradeInvalid || undefined}
            placeholder="—"
            className="h-11 w-20 text-center text-xl font-semibold tabular-nums"
          />
          <div className="flex flex-1 flex-wrap gap-1">
            {QUICK_GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(String(g))}
                className={cn(
                  "h-7 min-w-9 cursor-pointer rounded-md border px-1.5 text-xs tabular-nums transition-colors",
                  gradeNumber === g ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-muted"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        {gradeInvalid && <p className="text-2xs text-destructive">ציון בין 0 ל-100</p>}
      </div>

      {/* Feedback */}
      <div className="space-y-1.5">
        <label htmlFor="review-feedback" className="text-xs font-medium text-foreground">
          משוב לתלמיד/ה
        </label>
        <Textarea
          id="review-feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="כתבו משוב אישי או בחרו תגובה מהירה…"
          rows={3}
          className="resize-y text-sm"
        />
        <div className="flex flex-wrap gap-1">
          {/* The teacher's own comments first, then the built-in ones */}
          {quickComments.map((text) => (
            <CommentChip key={`own-${text}`} text={text} onPick={appendComment} onRemove={() => onRemoveQuickComment(text)} own />
          ))}
          {(showAllComments ? BUILT_IN_QUICK_COMMENTS : BUILT_IN_QUICK_COMMENTS.slice(0, COLLAPSED_BUILT_INS)).map((text) => (
            <CommentChip key={text} text={text} onPick={appendComment} />
          ))}
          {BUILT_IN_QUICK_COMMENTS.length > COLLAPSED_BUILT_INS && (
            <button
              type="button"
              onClick={() => setShowAllComments((v) => !v)}
              className="cursor-pointer rounded-full px-2 py-1 text-2xs text-muted-foreground hover:text-foreground"
            >
              {showAllComments ? "פחות" : `+ עוד ${BUILT_IN_QUICK_COMMENTS.length - COLLAPSED_BUILT_INS}`}
            </button>
          )}
        </div>
        {canSaveComment && (
          <Button type="button" variant="link" size="xs" onClick={() => onAddQuickComment(trimmedFeedback)} className="gap-1 px-0 text-2xs">
            <BookmarkPlus className="size-3" />
            שמור כתגובה מהירה
          </Button>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-2 border-t border-border pt-3">
        <Button type="submit" disabled={busy || gradeInvalid} className="w-full gap-1.5">
          {saving === "next" ? <Loader2 className="animate-spin" /> : <Check />}
          {hasNext ? "שמור והמשך" : "שמור וסיים"}
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => save(false)} disabled={busy || gradeInvalid} className="flex-1">
            {saving === "save" && <Loader2 className="animate-spin" />}
            שמור
          </Button>
          {!isReviewed && (
            <Button type="button" variant="ghost" size="sm" onClick={() => run("seen", undefined, true)} disabled={busy} className="flex-1 text-xs">
              {saving === "seen" && <Loader2 className="animate-spin" />}
              סמן כנבדק ללא ציון
            </Button>
          )}
        </div>
        <p className="hidden text-center text-3xs text-muted-foreground lg:block">
          <Kbd>J</Kbd>/<Kbd>K</Kbd> ניווט · <Kbd>G</Kbd> ציון · <Kbd>⌘</Kbd>+<Kbd>Enter</Kbd> שמור והמשך
        </p>
      </div>
    </form>
  );
}

function CommentChip({ text, onPick, onRemove, own }: { text: string; onPick: (t: string) => void; onRemove?: () => void; own?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full border text-2xs transition-colors",
        own ? "border-primary/30 bg-primary/5" : "border-border bg-background"
      )}
    >
      <button type="button" onClick={() => onPick(text)} className="cursor-pointer truncate px-2 py-1 text-foreground hover:text-primary" title={text}>
        {text}
      </button>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label="הסר תגובה" className="cursor-pointer pe-1.5 text-muted-foreground hover:text-destructive">
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-background px-1 font-mono text-3xs text-muted-foreground" dir="ltr">
      {children}
    </kbd>
  );
}
