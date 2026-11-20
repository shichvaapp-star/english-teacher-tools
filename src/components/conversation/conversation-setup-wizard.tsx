"use client";

import React, { useState } from "react";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONVERSATION_CATEGORIES } from "@/data/conversations";
import { GRADE_LABELS } from "@/lib/levels";
import { cn } from "@/lib/utils";
import { ChoiceCard } from "@/components/shared/wizard/wizard-ui";
import {
  GRADE_STEP_TEXT,
  GradeChoices,
  MODE_STEP_TEXT,
  SetupWizard,
  type SetupStep,
} from "@/components/shared/wizard/setup-wizard";
import type { ConversationPracticeController } from "@/components/conversation/use-conversation-practice";

type Step = "grade" | "level" | "mode" | "category" | "scenario";
type Level = "Level 1" | "Level 2" | "Level 3";
type CategoryId = (typeof CONVERSATION_CATEGORIES)[number]["id"];

// Shared by both setup layouts.

/** Choose a level and select the first conversation that fits it. */
export function selectConversationLevel(c: ConversationPracticeController, lvl: Level) {
  c.setSelectedLevel(lvl);
  c.setExpandedScenarioId(null);
  const first = c.gradeScenarios.find((s) => s.level === lvl && (c.selectedCategory === "all" || s.category === c.selectedCategory));
  if (first) c.setSelectedScenarioId(first.id);
}

/** Choose a category and select the first conversation that fits it. */
export function selectConversationCategory(c: ConversationPracticeController, id: CategoryId) {
  c.setSelectedCategory(id);
  c.setExpandedScenarioId(null);
  const match = c.gradeScenarios.find((s) => s.level === c.selectedLevel && (id === "all" || s.category === id));
  if (match) c.setSelectedScenarioId(match.id);
}

/** Open the exercise for this conversation. */
export function startConversation(c: ConversationPracticeController, scenarioId: string) {
  c.setSelectedScenarioId(scenarioId);
  c.setStage("exercise");
  window.scrollTo({ top: 0, behavior: "instant" });
}

const LEVELS: { id: Level; he: string; sub: string }[] = [
  { id: "Level 1", he: "בסיסי", sub: "שיחות קצרות ופשוטות" },
  { id: "Level 2", he: "שוטף", sub: "שיחות באורך בינוני" },
  { id: "Level 3", he: "מתקדם", sub: "שיחות ארוכות ומאתגרות" },
];

function ScenarioStep({ c }: { c: ConversationPracticeController }) {
  const [ai, setAi] = useState(false);
  if (ai) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={c.aiTopicInput}
            onChange={(e) => c.setAiTopicInput(e.target.value)}
            placeholder='על מה השיחה? (למשל: "הזמנת גלידה", "קניית כרטיס לרכבת")'
            className="h-12 flex-1 text-base"
          />
          <Button type="button" className="h-12 gap-2 px-5 text-base" disabled={c.isGeneratingAi} onClick={() => c.handleGenerateAiScenario()}>
            {c.isGeneratingAi ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
            {c.isGeneratingAi ? "יוצר שיחה…" : "ליצור שיחה"}
          </Button>
        </div>
        {c.aiNotice && (
          <p className={cn("text-base font-medium", c.aiNoticeType === "error" ? "text-destructive" : "text-success")}>{c.aiNotice}</p>
        )}
        <Button type="button" variant="ghost" onClick={() => setAi(false)}>
          חזרה לרשימת השיחות
        </Button>
      </div>
    );
  }
  const list = c.filteredScenarios;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <ChoiceCard
          selected={false}
          disabled={!list.length}
          onClick={() => {
            const pick = list[Math.floor(Math.random() * list.length)];
            if (pick) c.setSelectedScenarioId(pick.id);
          }}
          icon="🎲"
          title="תבחרו בשבילי"
          subtitle="שיחה אקראית מהרשימה"
        />
        <ChoiceCard selected={false} onClick={() => setAi(true)} icon="✨" title="שיחה חדשה בעזרת AI" subtitle="כותבים נושא, והמחשב יוצר שיחה" />
      </div>
      {list.length === 0 ? (
        <p className="rounded-xl bg-muted/50 p-4 text-center text-base text-muted-foreground">אין שיחות מהתחום הזה ברמה הזו. חזרו אחורה ובחרו תחום אחר.</p>
      ) : (
        <div className="grid max-h-[55vh] gap-2 overflow-y-auto p-0.5 sm:grid-cols-2">
          {list.map((s) => (
            <ChoiceCard
              key={s.id}
              className="p-3"
              selected={c.selectedScenarioId === s.id}
              onClick={() => c.setSelectedScenarioId(s.id)}
              icon={CONVERSATION_CATEGORIES.find((x) => x.id === s.category)?.emoji ?? "💬"}
              title={<span dir="ltr">{s.title}</span>}
              subtitle={s.hebrewTitle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Step-by-step version of the Conversations setup screen. */
export function ConversationSetupWizard({ c }: { c: ConversationPracticeController }) {
  const graded = c.mode === "graded";
  const chosen = c.filteredScenarios.find((s) => s.id === c.selectedScenarioId) ?? c.gradeScenarios.find((s) => s.id === c.selectedScenarioId);
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
      title: "באיזו רמה?",
      helper: "לא בטוחים? התחילו ברמה הבסיסית.",
      body: (
        <div className="grid gap-3 sm:grid-cols-3">
          {LEVELS.map((l) => (
            <ChoiceCard
              key={l.id}
              selected={c.selectedLevel === l.id}
              onClick={() => selectConversationLevel(c, l.id)}
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
            subtitle="בדיקה מיידית והסבר לכל שאלה"
          />
          <ChoiceCard
            selected={graded}
            onClick={() => c.setMode("graded")}
            icon="🏆"
            title="מבחן והגשה למורה"
            subtitle="ציון מלא, נשלח למורה"
          />
        </div>
      ),
      summary: { label: "מצב", value: graded ? "מבחן והגשה" : "אימון חופשי" },
    },
    {
      id: "category",
      title: "באיזה מקום מתרחשת השיחה?",
      helper: "בחרו תחום מהחיים, או \"הכול\".",
      body: (
        <div className="grid gap-3 sm:grid-cols-2">
          {CONVERSATION_CATEGORIES.map((cat) => (
            <ChoiceCard
              key={cat.id}
              selected={c.selectedCategory === cat.id}
              onClick={() => selectConversationCategory(c, cat.id)}
              icon={cat.emoji}
              title={cat.labelHebrew}
              subtitle={<span dir="ltr">{cat.labelEnglish}</span>}
            />
          ))}
        </div>
      ),
      summary: {
        label: "תחום",
        value: CONVERSATION_CATEGORIES.find((x) => x.id === c.selectedCategory)?.labelHebrew ?? "",
      },
    },
    {
      id: "scenario",
      title: "איזו שיחה?",
      helper: "לחצו על שיחה כדי לבחור אותה.",
      body: <ScenarioStep c={c} />,
      summary: { label: "שיחה", value: chosen ? <span dir="ltr">{chosen.title}</span> : "—" },
      problem: chosen ? null : "בחרו שיחה מהרשימה",
    }
  );

  return (
    <SetupWizard
      steps={steps}
      readyBody={
        chosen && (
          <div className="rounded-2xl bg-primary/10 p-4">
            <p className="text-lg font-bold text-foreground" dir="ltr">
              {chosen.title}
            </p>
            <p className="text-base text-muted-foreground">
              {chosen.hebrewTitle} · {chosen.speakers.map((s) => `${s.avatarEmoji} ${s.name.split(" ")[0]}`).join(" & ")} · 10 שאלות
            </p>
          </div>
        )
      }
      readyActions={
        <Button type="button" className="h-14 gap-2 px-8 text-lg" disabled={!chosen} onClick={() => chosen && startConversation(c, chosen.id)}>
          {graded ? "להתחיל את המבחן" : "להתחיל לתרגל"}
          <ArrowLeft className="size-5" />
        </Button>
      }
    />
  );
}
