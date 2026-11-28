"use client";

// Create / edit a lab test or quiz: step by step (default) or everything on
// one screen – the same switch as the other setup screens, remembered per browser.

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewModeToggle } from "@/components/shared/wizard/view-mode-toggle";
import { useViewMode } from "@/components/shared/wizard/view-mode";
import { useExamForm } from "./use-exam-form";
import { ExamFormClassic } from "./exam-form-classic";
import { ExamFormWizard } from "./exam-form-wizard";

export function ExamForm({ examId }: { examId?: string }) {
  const f = useExamForm(examId);
  const [mode, setMode] = useViewMode("examSetup");

  if (f.loading) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (f.existing && f.existing.status !== "draft") {
    return <p className="text-sm text-muted-foreground">אפשר לערוך רק לפני הפתיחה.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end" dir="rtl">
        <ViewModeToggle mode={mode} onChange={setMode} />
      </div>
      {mode === "wizard" ? <ExamFormWizard f={f} /> : <ExamFormClassic f={f} />}
    </div>
  );
}
