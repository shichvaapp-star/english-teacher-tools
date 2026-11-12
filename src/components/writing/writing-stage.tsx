"use client";

import React from "react";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";
import { WritingSuggestionChips } from "@/components/writing/writing-suggestion-chips";
import { WritingInfoBar } from "@/components/writing/writing-info-bar";
import { WritingTaskCard } from "@/components/writing/writing-task-card";
import { WritingAssignmentSubmit } from "@/components/writing/writing-assignment-submit";
import { WritingFeedback } from "@/components/writing/writing-feedback";
import { WritingEditor } from "@/components/writing/writing-editor";

export function WritingStage({ c }: { c: WritingPracticeController }) {
  const {
    stage,
  } = c;
  return (
    <>
      {/* =========================================================================
          STAGE 2: WRITING STUDIO (SIMPLIFIED, SINGLE TEXTAREA, NO OVERWHELMING BOXES)
          ========================================================================= */}
      {stage === "writing" && (
        <main className="flex-1 container mx-auto px-3 sm:px-8 py-4 sm:py-6 max-w-4xl space-y-4">
          <WritingInfoBar c={c} />


          <WritingTaskCard c={c} />

          <WritingSuggestionChips c={c} />

          <WritingEditor c={c} />

          <WritingFeedback c={c} />

          <WritingAssignmentSubmit c={c} />
        </main>
      )}
    </>
  );
}
