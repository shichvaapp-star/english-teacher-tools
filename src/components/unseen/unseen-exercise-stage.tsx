"use client";

import React from "react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";
import { UnseenExerciseTopBar } from "@/components/unseen/unseen-exercise-top-bar";
import { UnseenPassageColumn } from "@/components/unseen/unseen-passage-column";
import { UnseenQuestionsColumn } from "@/components/unseen/unseen-questions-column";

export function UnseenExerciseStage({ c }: { c: UnseenPracticeController }) {
  const {
    speech,
    stage,
  } = c;
  return (
    <>
      {stage === "exercise" && (
        <main className={`container mx-auto flex-1 px-3 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-6xl print:hidden ${speech.isActive ? "pb-32 sm:pb-36" : ""}`}>
          <UnseenExerciseTopBar c={c} />

          {/* Reading Passage (Left) + 10 Questions (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <UnseenPassageColumn c={c} />

            <UnseenQuestionsColumn c={c} />
          </div>
        </main>
      )}
    </>
  );
}
