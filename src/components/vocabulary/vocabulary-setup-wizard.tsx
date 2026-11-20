"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLASS_GRADES, GRADE_LABELS } from "@/lib/levels";
import { ChoiceCard } from "@/components/shared/wizard/wizard-ui";
import { SetupWizard, type SetupStep } from "@/components/shared/wizard/setup-wizard";
import type { VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

type Step = "words" | "unit" | "mode";
type StudyMode = "flashcards" | "match" | "quiz" | "bank";

const BOOK_NAME = { 7: "Teamwork", 8: "New Directions Plus", 9: "Mindset Plus" } as const;

const MODES: { id: StudyMode; icon: string; he: string; sub: string }[] = [
  { id: "flashcards", icon: "🃏", he: "כרטיסיות", sub: "רואים מילה והופכים לתרגום" },
  { id: "match", icon: "🧩", he: "משחק התאמה", sub: "מתאימים מילה לתרגום שלה" },
  { id: "quiz", icon: "✅", he: "בוחן עצמי", sub: "שאלות אמריקאיות על המילים" },
  { id: "bank", icon: "📖", he: "מילון", sub: "רשימת כל המילים, לקריאה וחיפוש" },
];

/** Step-by-step start screen for Vocabulary: which words, which unit, how to practise. */
export function VocabularySetupWizard({ c, onDone }: { c: VocabularyPracticeController; onDone: () => void }) {
  const steps: SetupStep<Step>[] = [
    {
      id: "words",
      title: "אילו מילים לתרגל?",
      helper: "מילים מספר הלימוד של הכיתה, או המילים ששמרת בעצמך.",
      body: (
        <div className="grid gap-3 sm:grid-cols-2">
          {CLASS_GRADES.map((g) => (
            <ChoiceCard
              key={g}
              selected={c.activeCategory === `grade${g}`}
              onClick={() => {
                c.setActiveCategory(`grade${g}`);
                c.setCardIndex(0);
              }}
              icon="📚"
              title={`ספר הלימוד – ${GRADE_LABELS[g].he}`}
              subtitle={`${BOOK_NAME[g]}${c.classGrade === g ? " · הכיתה שלי" : ""}`}
            />
          ))}
          <ChoiceCard
            selected={c.activeCategory === "saved"}
            onClick={() => {
              c.setActiveCategory("saved");
              c.setCardIndex(0);
            }}
            icon="⭐"
            title="המילים ששמרתי"
            subtitle={`${c.savedUnseenWords.length} מילים`}
          />
        </div>
      ),
      summary: {
        label: "מילים",
        value: c.activeGrade ? `ספר הלימוד – ${GRADE_LABELS[c.activeGrade].he}` : "המילים ששמרתי",
      },
    },
  ];
  if (c.activeGrade && c.units.length > 0) {
    steps.push({
      id: "unit",
      title: "איזו יחידה בספר?",
      helper: `הספר: ${BOOK_NAME[c.activeGrade]}.`,
      body: (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {c.units.map((u) => (
            <ChoiceCard
              key={u}
              className="p-3"
              selected={c.unit === u}
              onClick={() => c.setUnit(u)}
              title={<span className="text-lg">יחידה {u}</span>}
            />
          ))}
        </div>
      ),
      summary: { label: "יחידה", value: `יחידה ${c.unit}` },
    });
  }
  steps.push({
    id: "mode",
    title: "איך תרצו לתרגל?",
    helper: "אפשר להחליף בכל רגע בהמשך.",
    body: (
      <div className="grid gap-3 sm:grid-cols-2">
        {MODES.map((m) => (
          <ChoiceCard
            key={m.id}
            selected={c.studyMode === m.id}
            onClick={() => c.setStudyMode(m.id)}
            icon={m.icon}
            title={m.he}
            subtitle={m.sub}
          />
        ))}
      </div>
    ),
    summary: { label: "תרגול", value: MODES.find((m) => m.id === c.studyMode)?.he ?? "" },
  });

  return (
    <SetupWizard
      steps={steps}
      readyHelper="בדקו את הבחירות ולחצו כדי להתחיל."
      readyActions={
        <Button type="button" className="h-14 gap-2 px-8 text-lg" onClick={onDone}>
          להתחיל לתרגל
          <ArrowLeft className="size-5" />
        </Button>
      }
    />
  );
}
