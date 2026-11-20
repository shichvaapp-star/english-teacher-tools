"use client";

import React, { useState } from "react";
import { ArrowLeft, Printer, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GRADE_LABELS } from "@/lib/levels";
import { ChoiceCard } from "@/components/shared/wizard/wizard-ui";
import {
  GRADE_STEP_TEXT,
  GradeChoices,
  MODE_STEP_TEXT,
  SetupWizard,
  type SetupStep,
} from "@/components/shared/wizard/setup-wizard";
import { UnseenAiGenerator } from "@/components/unseen/unseen-ai-generator";
import type { UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

type Step = "grade" | "level" | "mode" | "story";

const LEVELS = [
  { id: "Level 1" as const, he: "מתחילים", sub: "קטעים קצרים ופשוטים" },
  { id: "Level 2" as const, he: "שוטף", sub: "קטעים באורך בינוני" },
  { id: "Level 3" as const, he: "מתקדמים", sub: "קטעים ארוכים ומאתגרים" },
];

function StoryStep({ c }: { c: UnseenPracticeController }) {
  // The AI box only shows after the student asks for it (the shared tab state starts on AI).
  const [ai, setAi] = useState(false);
  if (ai && c.storySourceTab === "ai_generator") {
    return (
      <div className="space-y-3">
        <UnseenAiGenerator c={c} />
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setAi(false);
            c.setStorySourceTab("library");
          }}
        >
          חזרה לרשימת הקטעים
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <ChoiceCard selected={false} onClick={c.handleRandomStorySelect} icon="🎲" title="תבחרו בשבילי" subtitle="קטע אקראי מהרשימה" />
        <ChoiceCard
          selected={false}
          onClick={() => {
            setAi(true);
            c.setStorySourceTab("ai_generator");
          }}
          icon="✨"
          title="קטע חדש בעזרת AI"
          subtitle="כותבים נושא, והמחשב יוצר קטע"
        />
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-3 right-3 size-5 text-muted-foreground" />
        <Input
          value={c.librarySearchQuery}
          onChange={(e) => c.setLibrarySearchQuery(e.target.value)}
          placeholder="חיפוש קטע לפי שם…"
          className="h-12 pr-10 text-base"
        />
      </div>
      {c.filteredLibraryStories.length === 0 ? (
        <p className="rounded-xl bg-muted/50 p-4 text-center text-base text-muted-foreground">לא נמצאו קטעים. נסו חיפוש אחר.</p>
      ) : (
        <div className="grid max-h-[55vh] gap-2 overflow-y-auto p-0.5 sm:grid-cols-2">
          {c.filteredLibraryStories.map((s) => (
            <ChoiceCard
              key={s.id}
              className="p-3"
              selected={s.id === c.currentStory.id}
              onClick={() => c.handleStorySelect(s.id)}
              title={<span dir="ltr">{s.title}</span>}
              subtitle={s.hebrewTitle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Step-by-step version of the Unseen setup screen. */
export function UnseenSetupWizard({ c }: { c: UnseenPracticeController }) {
  const graded = c.mode === "graded";
  const steps: SetupStep<Step>[] = [];
  if (!c.gradeLocked) {
    steps.push({
      id: "grade",
      ...GRADE_STEP_TEXT,
      body: <GradeChoices grade={c.grade} onChange={c.handleGradeSelect} classGrade={c.classGrade} />,
      summary: { label: "כיתה", value: GRADE_LABELS[c.grade].he },
    });
  }
  steps.push(
    {
      id: "level",
      title: "באיזו רמה לקרוא?",
      helper: "לא בטוחים? התחילו ברמה 1 ועלו כשקל לכם.",
      body: (
        <div className="grid gap-3 sm:grid-cols-3">
          {LEVELS.map((l) => (
            <ChoiceCard
              key={l.id}
              selected={c.selectedLevel === l.id}
              onClick={() => c.handleLevelSelect(l.id)}
              title={<span className="text-xl">{l.he}</span>}
              subtitle={`${l.id} · ${l.sub}`}
            />
          ))}
        </div>
      ),
      summary: { label: "רמה", value: LEVELS.find((l) => l.id === c.selectedLevel)?.he ?? c.selectedLevel },
    },
    {
      id: "mode",
      ...MODE_STEP_TEXT,
      body: (
        <div className="grid gap-3">
          <ChoiceCard
            selected={!graded}
            onClick={() => c.setMode("practice")}
            icon="🎯"
            title="אימון חופשי"
            subtitle="בדיקה מיידית ורמזים לכל שאלה"
          />
          <ChoiceCard
            selected={graded}
            onClick={() => c.setMode("graded")}
            icon="🏆"
            title="מטלה להגשה למורה"
            subtitle="מבחן לציון, נשלח למורה"
          />
        </div>
      ),
      summary: { label: "מצב", value: graded ? "מטלה להגשה" : "אימון חופשי" },
    },
    {
      id: "story",
      title: "איזה קטע לקרוא?",
      helper: "לחצו על קטע כדי לבחור אותו.",
      body: <StoryStep c={c} />,
      summary: { label: "קטע", value: <span dir="ltr">{c.currentStory.title}</span> },
    }
  );

  return (
    <SetupWizard
      steps={steps}
      readyBody={
        <div className="rounded-2xl bg-primary/10 p-4">
          <p className="text-lg font-bold text-foreground" dir="ltr">
            {c.currentStory.title}
          </p>
          <p className="text-base text-muted-foreground">{c.currentStory.hebrewTitle} · 10 שאלות</p>
        </div>
      }
      readyActions={
        <>
          <Button type="button" variant="outline" className="h-14 gap-2 px-5 text-base" onClick={() => c.setShowPrintModal(true)}>
            <Printer className="size-5" />
            הדפסה
          </Button>
          <Button type="button" className="h-14 gap-2 px-8 text-lg" onClick={c.handleStartExercise}>
            {graded ? "להתחיל את המטלה" : "להתחיל לתרגל"}
            <ArrowLeft className="size-5" />
          </Button>
        </>
      }
    />
  );
}
