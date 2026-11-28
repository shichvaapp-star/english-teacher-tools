import React from "react";
import { EXAM_KIND_HE, EXAM_PART_LABEL_HE } from "@/types/exam";
import type { SubmissionItem } from "@/types/submission";

/** Released test / quiz result: score per part (no answer key). */
export function ExamResultSummaryView({ sub }: { sub: SubmissionItem }) {
  const s = sub.examSummary;
  if (!s) return null;
  return (
    <div dir="rtl" className="space-y-2 text-sm">
      <div className="font-bold">
        {EXAM_KIND_HE[s.kind]} · ציון {sub.grade ?? sub.score ?? "—"}
      </div>
      <ul className="space-y-1">
        {s.parts.map((p, i) => (
          <li key={i} className="flex justify-between gap-2 rounded-lg border border-border px-3 py-1.5">
            <span>{p.title || EXAM_PART_LABEL_HE[p.type]}</span>
            <span className="font-mono tabular-nums">
              {Math.round(p.earned)}/{p.points}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
