import React from "react";
import { Badge } from "@/components/ui/badge";
import type { ExamStatus } from "@/types/exam";

const LABEL: Record<ExamStatus, string> = { draft: "טיוטה", open: "פתוח עכשיו", closed: "הסתיים" };
const CLASS: Record<ExamStatus, string> = {
  draft: "border-border text-muted-foreground",
  open: "border-success/40 bg-success/10 text-success",
  closed: "border-info/40 bg-info/10 text-info",
};

export function ExamStatusBadge({ status }: { status: ExamStatus }) {
  return (
    <Badge variant="outline" className={CLASS[status]}>
      {LABEL[status]}
    </Badge>
  );
}
