"use client";

import React from "react";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";
import { ConversationDialoguePane } from "@/components/conversation/conversation-dialogue-pane";
import { ConversationQuestionsPane } from "@/components/conversation/conversation-questions-pane";

export function ConversationExerciseStage({ c }: { c: ConversationPracticeController }) {
  const {
    answeredCount,
    currentScenario,
    mobileTab,
    setMobileTab,
  } = c;
  return (
    <>
      <div className="space-y-4">
        {/* Mobile Switcher Tabs */}
        <div className="lg:hidden grid grid-cols-2 gap-2 bg-muted/40 p-1 rounded-xl border border-border/60 print:hidden">
          <button
            type="button"
            onClick={() => setMobileTab("text")}
            className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              mobileTab === "text"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground"
            }`}
          >
            💬 תמליל השיחה ({currentScenario.turns.length} שורות)
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("questions")}
            className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              mobileTab === "questions"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground"
            }`}
          >
            ❓ שאלות ({answeredCount}/10)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <ConversationDialoguePane c={c} />

          <ConversationQuestionsPane c={c} />
        </div>
      </div>
    </>
  );
}
