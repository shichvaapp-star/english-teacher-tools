import React from "react";
import { WritingLevel, TaskCategory } from "@/data/writing-tasks";
import type { WritingEvaluationResult } from "@/app/api/evaluate-writing/route";

export interface SubmissionRecord {
  id: string;
  type: "writing";
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  studentClass?: string;
  studentGroup?: string;
  studentNote?: string;
  assignmentId?: string;
  taskId: string;
  taskTitle: string;
  hebrewTitle: string;
  category: TaskCategory;
  level: WritingLevel;
  essayText: string;
  wordCount: number;
  score?: number;
  grade?: number;
  submittedAt: string;
  receiptCode: string;
  status: "submitted" | "reviewed" | "completed";
  mode?: "practice" | "graded";
  writingRubric?: WritingEvaluationResult["rubric"];
}

export const LOCAL_SUBMISSIONS_KEY = "ett_writing_submissions";

// BiDi Isolation Helper: isolates English words and terms inside Hebrew text to prevent punctuation and sentence order scramble
export function renderBiDiText(text: string) {
  if (!text) return null;
  // Match English words/phrases, including quotes or symbols around them
  const tokens = text.split(/(["'״׳]?[a-zA-Z0-9_\-+/():]+(?:\s+[a-zA-Z0-9_\-+/():]+)*["'״׳]?)/g);

  return tokens.map((token, i) => {
    if (/[a-zA-Z]/.test(token)) {
      return (
        <bdi
          key={i}
          dir="ltr"
          className="inline-block font-bold text-foreground bg-muted/60 border border-border/40 px-1.5 py-0.5 rounded mx-1 text-[11px] align-baseline select-all"
        >
          {token}
        </bdi>
      );
    }
    return <span key={i}>{token}</span>;
  });
}
