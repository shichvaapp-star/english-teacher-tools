"use client";

import React from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GRADE_LABELS } from "@/lib/levels";
import type { TaskCategory } from "@/types/writing";
import { ChoiceCard } from "@/components/shared/wizard/wizard-ui";
import {
  GRADE_STEP_TEXT,
  GradeChoices,
  MODE_STEP_TEXT,
  SetupWizard,
  type SetupStep,
} from "@/components/shared/wizard/setup-wizard";
import type { WritingPracticeController } from "@/components/writing/use-writing-practice";

type Step = "grade" | "level" | "mode" | "category" | "topic";

const LEVELS = [
  { id: "Level 1" as const, he: "משפטים בסיסיים", sub: "כמה משפטים קצרים" },
  { id: "Level 2" as const, he: "פסקאות קצרות", sub: "פסקה אחת או שתיים" },
  { id: "Level 3" as const, he: "חיבור מלא", sub: "פתיחה, גוף וסיום" },
];

const CATEGORIES: { id: "all" | TaskCategory; icon: string; he: string; sub: string }[] = [
  { id: "all", icon: "📚", he: "כל הסוגים", sub: "לראות את כל הנושאים" },
  { id: "letter", icon: "✉️", he: "מכתב / אימייל", sub: "כותבים למישהו" },
  { id: "opinion", icon: "💭", he: "פסקת דעה", sub: "מה אני חושב/ת ולמה" },
  { id: "description", icon: "🧭", he: "תיאור ויומיום", sub: "מקום, אדם או יום" },
  { id: "creative", icon: "🪄", he: "סיפור יצירתי", sub: "ממציאים סיפור" },
];

function TopicStep({ c }: { c: WritingPracticeController }) {
  if (c.topicSourceTab === "ai_generator") {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={c.customTopicInput}
            onChange={(e) => c.setCustomTopicInput(e.target.value)}
            placeholder="על מה תרצו לכתוב? (למשל: ספורט, חברים, טיול בחלל…)"
            className="h-12 flex-1 text-base"
          />
          <Button
            type="button"
            className="h-12 gap-2 px-5 text-base"
            onClick={c.handleGenerateAiTask}
            disabled={c.isGeneratingAi || !c.customTopicInput.trim()}
          >
            <Sparkles className="size-5" />
            {c.isGeneratingAi ? "יוצר משימה…" : "ליצור משימה"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {c.SUGGESTED_TOPICS.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => c.setCustomTopicInput(t.label)}
              className="cursor-pointer rounded-full border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground hover:border-primary/40 hover:bg-primary/10"
            >
              {t.label}
            </button>
          ))}
        </div>
        {c.aiNotice && <p className="text-base font-medium text-success">{c.aiNotice}</p>}
        <Button type="button" variant="ghost" onClick={() => c.setTopicSourceTab("library")}>
          חזרה לרשימת הנושאים
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <ChoiceCard
          selected={false}
          disabled={c.isRolling}
          onClick={c.handleRollRandom}
          icon="🎲"
          title="תפתיעו אותי"
          subtitle="נושא אקראי מהרשימה"
        />
        <ChoiceCard
          selected={false}
          onClick={() => c.setTopicSourceTab("ai_generator")}
          icon="✨"
          title="נושא משלי בעזרת AI"
          subtitle="כותבים נושא, והמחשב יוצר משימה"
        />
      </div>
      {c.filteredTasks.length === 0 ? (
        <p className="rounded-xl bg-muted/50 p-4 text-center text-base text-muted-foreground">אין נושאים מהסוג הזה ברמה הזו. חזרו אחורה ובחרו סוג אחר.</p>
      ) : (
        <div className="grid max-h-[55vh] gap-2 overflow-y-auto p-0.5 sm:grid-cols-2">
          {c.filteredTasks.map((t) => (
            <ChoiceCard
              key={t.id}
              className="p-3"
              selected={c.selectedTaskId === t.id}
              onClick={() => c.setSelectedTaskId(t.id)}
              title={t.hebrewTitle}
              subtitle={
                <>
                  <span dir="ltr">{t.title}</span> · {t.targetWords}
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Step-by-step version of the Writing setup screen. */
export function WritingSetupWizard({ c }: { c: WritingPracticeController }) {
  const submit = c.activeMode === "submit";
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
      title: "כמה לכתוב?",
      helper: "לא בטוחים? התחילו במשפטים בסיסיים.",
      body: (
        <div className="grid gap-3 sm:grid-cols-3">
          {LEVELS.map((l) => (
            <ChoiceCard
              key={l.id}
              selected={c.selectedLevel === l.id}
              onClick={() => c.handleLevelSelect(l.id)}
              title={<span className="text-lg">{l.he}</span>}
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
            selected={!submit}
            onClick={() => c.setActiveMode("practice")}
            icon="🎯"
            title="אימון חופשי"
            subtitle="כותבים לבד ומקבלים בדיקה מיד"
          />
          <ChoiceCard
            selected={submit}
            onClick={() => c.setActiveMode("submit")}
            icon="🎓"
            title="מטלה להגשה למורה"
            subtitle="החיבור נשלח לבדיקת המורה"
          />
        </div>
      ),
      summary: { label: "מצב", value: submit ? "מטלה להגשה" : "אימון חופשי" },
    },
    {
      id: "category",
      title: "מה תרצו לכתוב?",
      helper: "בחרו סוג כתיבה, או \"כל הסוגים\".",
      body: (
        <div className="grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <ChoiceCard
              key={cat.id}
              selected={c.selectedCategory === cat.id}
              onClick={() => c.setSelectedCategory(cat.id)}
              icon={cat.icon}
              title={cat.he}
              subtitle={cat.sub}
            />
          ))}
        </div>
      ),
      summary: { label: "סוג", value: CATEGORIES.find((x) => x.id === c.selectedCategory)?.he ?? "" },
    },
    {
      id: "topic",
      title: "על מה לכתוב?",
      helper: "לחצו על נושא כדי לבחור אותו.",
      body: <TopicStep c={c} />,
      summary: { label: "נושא", value: c.currentTask.hebrewTitle },
    }
  );

  return (
    <SetupWizard
      steps={steps}
      readyBody={
        <div className="rounded-2xl bg-primary/10 p-4">
          <p className="text-lg font-bold text-foreground">{c.currentTask.hebrewTitle}</p>
          <p className="text-base text-muted-foreground">
            <span dir="ltr">{c.currentTask.title}</span> · {c.currentTask.targetWords}
          </p>
        </div>
      }
      readyActions={
        <Button type="button" className="h-14 gap-2 px-8 text-lg" onClick={c.handleStartWriting}>
          {submit ? "להתחיל את המטלה" : "להתחיל לכתוב"}
          <ArrowLeft className="size-5" />
        </Button>
      }
    />
  );
}
