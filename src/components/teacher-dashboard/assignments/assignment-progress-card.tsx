"use client";

import React from "react";
import Link from "next/link";
import { CalendarClock, MoreHorizontal, Share2, Sparkles, Copy, Trash2, Inbox } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TeacherAssignment } from "@/types/assignment";
import type { StudentProfile } from "@/types/auth";
import { TypeIcon } from "../shared-ui/type-badge";
import type { AssignmentProgress } from "../dashboard-selectors";
import { isFreeChoiceAssignment } from "../dashboard-selectors";
import { DASHBOARD_BASE, assignmentHref } from "../shell/nav-items";
import { describeAssignmentTarget, formatDueDate } from "./assignment-meta";
import { ProgressLegend, StackedProgress } from "./progress-bar";

interface AssignmentProgressCardProps {
  assignment: TeacherAssignment;
  progress: AssignmentProgress;
  students: StudentProfile[];
  now: number;
  compact?: boolean;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export function AssignmentProgressCard({
  assignment,
  progress,
  students,
  now,
  compact = false,
  onDelete,
  onDuplicate,
}: AssignmentProgressCardProps) {
  const due = formatDueDate(progress.dueTs, now);
  const hasMenu = Boolean(onDelete || onDuplicate);

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/20">
      <div className="flex items-start gap-3">
        <TypeIcon type={assignment.type} className="size-9" />
        <div className="min-w-0 flex-1">
          <Link
            href={assignmentHref(assignment.id)}
            className="line-clamp-1 text-sm font-semibold text-foreground after:absolute after:inset-0 after:content-['']"
          >
            {assignment.hebrewTitle}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{describeAssignmentTarget(assignment, students)}</p>
        </div>
        {hasMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="relative z-10 -mt-1 -ml-1" aria-label="פעולות" />}>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {progress.pending > 0 && (
                <DropdownMenuItem
                  render={<Link href={`${DASHBOARD_BASE}/turn-ins?assignment=${encodeURIComponent(assignment.id)}&status=pending`} />}
                >
                  <Inbox />
                  בדיקת ההגשות ({progress.pending})
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy />
                  שכפל כמשימה חדשה
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    <Trash2 />
                    מחק משימה
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {!compact && (
        <div className="flex flex-wrap items-center gap-1.5">
          {assignment.level && <Chip>{assignment.level}</Chip>}
          {isFreeChoiceAssignment(assignment) && (
            <Chip>
              <Sparkles className="size-3" />
              בחירה חופשית
            </Chip>
          )}
          {assignment.isShared && (
            <Chip>
              <Share2 className="size-3" />
              משותף
            </Chip>
          )}
          {assignment.vocabWords && assignment.vocabWords.length > 0 && <Chip>{assignment.vocabWords.length} מילים</Chip>}
        </div>
      )}

      <div className="mt-auto space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            <span className="text-base font-semibold tabular-nums text-foreground">{progress.turnedIn}</span>/{progress.totalEligible} הגישו
          </span>
          {due && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-2xs",
                progress.isOverdue ? "font-medium text-destructive" : "text-muted-foreground"
              )}
            >
              <CalendarClock className="size-3" />
              {due}
            </span>
          )}
        </div>
        <StackedProgress reviewed={progress.reviewed} pending={progress.pending} total={progress.totalEligible} />
        {!compact && <ProgressLegend reviewed={progress.reviewed} pending={progress.pending} missing={progress.missing} />}
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-5 items-center gap-1 rounded-full bg-muted px-2 text-2xs text-muted-foreground">{children}</span>
  );
}
