"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Loader2,
  MoreHorizontal,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SubmissionItem } from "@/types/submission";
import type { TeacherAssignment } from "@/types/assignment";
import type { WritingEvaluationResult } from "@/app/api/evaluate-writing/route";
import { formatCompactTime } from "@/lib/submission-time";
import { StudentAvatar } from "../shared-ui/student-avatar";
import { TypeBadge } from "../shared-ui/type-badge";
import { StatusBadge } from "../shared-ui/status-badge";
import { AiEvaluationPanel, SubmissionContent } from "../submission-content/submission-content";
import { assignmentHref } from "../shell/nav-items";

export interface SubmissionDetailProps {
  sub: SubmissionItem;
  assignment?: TeacherAssignment;
  position: { index: number; total: number };
  now: number;
  aiResult: WritingEvaluationResult | null;
  isEvaluatingAi: boolean;
  onRunAi: () => void;
  onSave: (grade: number | undefined, feedback: string, advance: boolean) => Promise<void>;
  onDelete: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onBack: () => void;
  gradeInputRef: React.RefObject<HTMLInputElement | null>;
}

export function SubmissionDetail({
  sub,
  assignment,
  position,
  now,
  aiResult,
  isEvaluatingAi,
  onRunAi,
  onSave,
  onDelete,
  onPrev,
  onNext,
  onBack,
  gradeInputRef,
}: SubmissionDetailProps) {
  // Draft starts from the saved grade/feedback; the parent remounts this component per submission
  const initialGrade = sub.grade ?? sub.score;
  const [grade, setGrade] = useState(initialGrade !== undefined ? String(initialGrade) : "");
  const [feedback, setFeedback] = useState(sub.teacherFeedback || sub.teacherNote || "");
  const [saving, setSaving] = useState<"save" | "next" | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const isReviewed = sub.status === "reviewed";
  const gradeNumber = grade.trim() === "" ? undefined : Number(grade.trim());
  const gradeInvalid = gradeNumber !== undefined && (Number.isNaN(gradeNumber) || gradeNumber < 0 || gradeNumber > 100);

  const save = async (advance: boolean) => {
    if (gradeInvalid || saving) return;
    setSaving(advance ? "next" : "save");
    try {
      await onSave(gradeNumber, feedback.trim(), advance);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-border p-4">
        <Button variant="ghost" size="icon-sm" onClick={onBack} className="lg:hidden" aria-label="חזרה לרשימה">
          <ArrowRight />
        </Button>
        <StudentAvatar name={sub.studentName} className="size-10 text-xs" />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold text-foreground" dir="ltr">
              {sub.studentName}
            </h2>
            <StatusBadge status={isReviewed ? "reviewed" : "pending"} />
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {sub.studentClass && <span>כיתה {sub.studentClass}</span>}
            {sub.studentGroup && <span>· הקבצה {sub.studentGroup}</span>}
            <span>· {formatCompactTime(sub.submittedAt, now)}</span>
            {sub.receiptCode && (
              <span className="font-mono" dir="ltr">
                · {sub.receiptCode}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <TypeBadge type={sub.type} />
            {assignment ? (
              <Link
                href={assignmentHref(assignment.id)}
                className="inline-flex items-center gap-1 text-xs text-foreground underline-offset-4 hover:underline"
              >
                <ClipboardList className="size-3.5 text-muted-foreground" />
                {assignment.hebrewTitle}
              </Link>
            ) : (
              <span className="text-xs text-foreground">{sub.hebrewTitle}</span>
            )}
            {sub.taskTitle && sub.taskTitle !== sub.hebrewTitle && (
              <span className="truncate text-xs text-muted-foreground" dir="ltr">
                {sub.taskTitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span className="hidden px-1 text-2xs tabular-nums text-muted-foreground sm:inline">
            {position.index + 1} / {position.total}
          </span>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon-sm" onClick={onPrev} disabled={!onPrev} aria-label="הקודם" />}>
              <ChevronUp />
            </TooltipTrigger>
            <TooltipContent side="bottom">הקודם (K)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" size="icon-sm" onClick={onNext} disabled={!onNext} aria-label="הבא" />}>
              <ChevronDown />
            </TooltipTrigger>
            <TooltipContent side="bottom">הבא (J)</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="פעולות נוספות" />}>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Trash2 />
                מחק הגשה
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
        <SubmissionContent sub={sub} />

        {sub.type === "writing" && (
          <div className="space-y-3">
            {!aiResult && !isEvaluatingAi && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-admin/40 bg-admin/5 p-3">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">הערכת AI</span> לפי מחוון משרד החינוך: ציון מוצע, נקודות חוזק ותיקונים.
                </div>
                <Button size="sm" variant="outline" onClick={onRunAi} className="gap-1.5">
                  <Sparkles className="text-admin" />
                  הפעל בדיקת AI
                </Button>
              </div>
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
              <Button variant="link" size="xs" onClick={onRunAi} className="px-0 text-2xs">
                הרץ בדיקת AI מחדש
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Grading footer */}
      <form
        ref={formRef}
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
        className="space-y-3 border-t border-border bg-muted/30 p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="space-y-1 sm:w-28">
            <label htmlFor="inbox-grade" className="text-2xs font-medium text-muted-foreground">
              ציון (0–100)
            </label>
            <Input
              id="inbox-grade"
              ref={gradeInputRef}
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              aria-invalid={gradeInvalid || undefined}
              placeholder="—"
              className="h-10 text-center text-lg font-semibold tabular-nums"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label htmlFor="inbox-feedback" className="text-2xs font-medium text-muted-foreground">
              משוב לתלמיד/ה
            </label>
            <Textarea
              id="inbox-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="כתבו משוב אישי…"
              rows={2}
              className="min-h-10 resize-none text-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="hidden text-3xs text-muted-foreground md:block">
            <Kbd>J</Kbd>/<Kbd>K</Kbd> ניווט · <Kbd>G</Kbd> ציון · <Kbd>A</Kbd> בדיקת AI · <Kbd>⌘</Kbd>+<Kbd>Enter</Kbd> שמור והמשך
          </p>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => save(false)} disabled={Boolean(saving) || gradeInvalid}>
              {saving === "save" && <Loader2 className="animate-spin" />}
              שמור
            </Button>
            <Button type="submit" disabled={Boolean(saving) || gradeInvalid} className="gap-1.5">
              {saving === "next" && <Loader2 className="animate-spin" />}
              {onNext ? "שמור והמשך" : "שמור וסיים"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-background px-1 font-mono text-3xs" dir="ltr">
      {children}
    </kbd>
  );
}
