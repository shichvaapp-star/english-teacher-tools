"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, ClipboardList, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SubmissionItem } from "@/types/submission";
import type { TeacherAssignment } from "@/types/assignment";
import type { WritingCorrection } from "@/app/api/evaluate-writing/route";
import { formatCompactTime } from "@/lib/submission-time";
import { cleanClass } from "@/lib/class-names";
import { StudentAvatar } from "../shared-ui/student-avatar";
import { TypeBadge } from "../shared-ui/type-badge";
import { StatusBadge } from "../shared-ui/status-badge";
import { SubmissionContent } from "../submission-content/submission-content";
import { assignmentHref } from "../shell/nav-items";
import { LateBadge } from "../shared-ui/late-badge";

interface ReviewWorkHeaderProps {
  sub: SubmissionItem;
  assignment?: TeacherAssignment;
  late: boolean;
  position: { index: number; total: number };
  now: number;
  onPrev?: () => void;
  onNext?: () => void;
  onBack: () => void;
  onDelete: () => void;
}

/** Slim header: who, what, when, plus navigation. */
export function ReviewWorkHeader({ sub, assignment, late, position, now, onPrev, onNext, onBack, onDelete }: ReviewWorkHeaderProps) {
  const isReviewed = sub.status === "reviewed";
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3">
      <Button variant="ghost" size="icon-sm" onClick={onBack} className="lg:hidden" aria-label="חזרה לרשימה">
        <ArrowRight />
      </Button>
      <StudentAvatar name={sub.studentName} className="size-9 text-xs" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <h2 className="truncate text-base font-semibold text-foreground" dir="ltr">
            {sub.studentName}
          </h2>
          <span className="text-xs text-muted-foreground">
            {sub.studentClass && cleanClass(sub.studentClass)}
            {sub.studentGroup && ` · ${sub.studentGroup}`}
          </span>
          <StatusBadge status={isReviewed ? "reviewed" : "pending"} />
          {late && <LateBadge />}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <TypeBadge type={sub.type} />
          {assignment ? (
            <Link href={assignmentHref(assignment.id)} className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline">
              <ClipboardList className="size-3.5 text-muted-foreground" />
              {assignment.hebrewTitle}
            </Link>
          ) : (
            <span className="text-foreground">{sub.hebrewTitle}</span>
          )}
          <span>· {formatCompactTime(sub.submittedAt, now)}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
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
            {sub.receiptCode && (
              <div className="px-2 py-1.5 font-mono text-2xs text-muted-foreground" dir="ltr">
                {sub.receiptCode}
              </div>
            )}
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 />
              מחק הגשה
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/** The student's work in a comfortable reading column. */
export function ReviewWorkBody({ sub, corrections }: { sub: SubmissionItem; corrections?: WritingCorrection[] }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <SubmissionContent sub={sub} corrections={corrections} />
    </div>
  );
}
