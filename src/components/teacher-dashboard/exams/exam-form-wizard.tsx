"use client";

// The test / quiz builder one question per screen (the site's usual wizard look).

import React from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SetupWizard, type SetupStep } from "@/components/shared/wizard/setup-wizard";
import { BigCounter, ChoiceCard, SectionLabel } from "@/components/shared/wizard/wizard-ui";
import { SeatPlanEditor } from "./seat-plan-editor";
import { PartBody } from "./exam-part-bodies";
import { EXAM_GROUPS, PART_ORDER, partName, type ExamFormController } from "./use-exam-form";
import { PART_ICON } from "./exam-form-classic";
import { EXAM_PART_LABEL_HE, type ExamPartType } from "@/types/exam";
import { sameClass } from "@/lib/class-names";
import { Loader2, Save, Scale } from "lucide-react";

const PART_DESC_HE: Record<ExamPartType, string> = {
  unseen: "קטע קריאה מהמאגר ושאלות עליו (אמריקאיות, פתוחות והעתקה).",
  vocab: "מילים מספר הלימוד או מהמאגר שלך – כתיבת המילה באנגלית או בחירת הפירוש.",
  grammar: "שאלות דקדוק לפי נושאים, נוצרות מראש ונשמרות עם המבחן.",
  writing: "חיבור על נושא, עם רשימת מילים בעברית שצריך לשלב.",
};

export function ExamFormWizard({ f }: { f: ExamFormController }) {
  const classCount = (cl: string) => f.students.filter((s) => sameClass(s.fullClass, cl)).length;

  const steps: SetupStep<string>[] = [
    {
      id: "kind",
      title: "מבחן או בוחן?",
      helper: "אותם כללי נעילה בשניהם. בוחן קצר יותר ומסומן כ״בוחן״ אצל התלמידים ובציונים.",
      summary: { label: "סוג", value: f.kindHe },
      body: (
        <div className="grid gap-3 sm:grid-cols-2">
          <ChoiceCard
            selected={f.kind === "test"}
            onClick={() => f.setKindAndDefaults("test")}
            icon="📝"
            title="מבחן"
            subtitle="ברירת מחדל 45 דקות"
          />
          <ChoiceCard
            selected={f.kind === "quiz"}
            onClick={() => f.setKindAndDefaults("quiz")}
            icon="⏱️"
            title="בוחן"
            subtitle="קצר יותר – ברירת מחדל 15 דקות"
          />
        </div>
      ),
    },
    {
      id: "class",
      title: "לאיזו כיתה?",
      helper: "רק תלמידי הכיתה (וההקבצה) שתבחרו יראו את ה" + f.kindHe + ".",
      problem: f.classProblem,
      summary: {
        label: "כיתה",
        value: `${f.targetClass}${f.targetGroup !== "all" ? ` · ${f.targetGroup}` : ""} (${f.eligible.length} תלמידים)`,
      },
      body: (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {f.availableClasses.map((cl) => (
              <ChoiceCard
                key={cl}
                selected={f.targetClass === cl}
                onClick={() => f.setPickedClass(cl)}
                title={<span className="text-xl">{cl}</span>}
                subtitle={`${classCount(cl)} תלמידים`}
              />
            ))}
          </div>
          <SectionLabel>הקבצה</SectionLabel>
          <div className="grid gap-3 sm:grid-cols-4">
            {[{ v: "all", t: "כל הכיתה" }, ...EXAM_GROUPS.map((g) => ({ v: g, t: g }))].map((o) => (
              <ChoiceCard key={o.v} selected={f.targetGroup === o.v} onClick={() => f.setTargetGroup(o.v)} title={o.t} />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "details",
      title: `שם וזמן ה${f.kindHe}`,
      helper: "השם מופיע לתלמידים ובציונים. הזמן מתחיל לרוץ כשפותחים את ה" + f.kindHe + ".",
      problem: f.titleProblem,
      summary: { label: "פרטים", value: `${f.title || "—"} · ${f.durationMin} דק׳` },
      body: (
        <div className="space-y-5">
          <Input
            value={f.title}
            onChange={(e) => f.setTitle(e.target.value)}
            placeholder={`${f.kindHe} – יחידה 3`}
            className="h-12 text-lg"
            aria-label="שם"
          />
          <SectionLabel>כמה זמן?</SectionLabel>
          <BigCounter
            value={f.durationMin}
            onChange={f.setDurationMin}
            min={5}
            max={180}
            quick={[10, 15, 20, 30, 45, 60, 90]}
            unit="דקות"
          />
        </div>
      ),
    },
    {
      id: "parts",
      title: "מה יהיה ב" + f.kindHe + "?",
      helper: "אפשר לבחור כמה חלקים. בשלבים הבאים תגדירו כל אחד מהם.",
      problem: f.partsProblem,
      summary: { label: "חלקים", value: f.drafts.map((d) => EXAM_PART_LABEL_HE[d.type]).join(" + ") || "—" },
      body: (
        <div className="grid gap-3 sm:grid-cols-2">
          {PART_ORDER.map((t) => {
            const Icon = PART_ICON[t];
            return (
              <ChoiceCard
                key={t}
                multi
                selected={f.drafts.some((d) => d.type === t)}
                onClick={() => f.togglePartType(t)}
                icon={<Icon className="size-6 text-primary" />}
                title={EXAM_PART_LABEL_HE[t]}
                subtitle={PART_DESC_HE[t]}
              />
            );
          })}
        </div>
      ),
    },
    ...f.drafts.map(
      (d, i): SetupStep<string> => ({
        id: `part:${d.id}`,
        title: `${partName(i)} · ${EXAM_PART_LABEL_HE[d.type]}`,
        helper: PART_DESC_HE[d.type],
        problem: f.partProblem(d),
        summary: { label: partName(i), value: f.partProblem(d) ? "עוד לא הושלם" : `${EXAM_PART_LABEL_HE[d.type]} ✓` },
        body: (
          <div className="space-y-4">
            <Input
              value={d.title}
              onChange={(e) => f.updateDraft(d.id, { ...d, title: e.target.value })}
              placeholder="כותרת לחלק (רשות)"
              className="max-w-xs"
              aria-label="כותרת לחלק"
            />
            <PartBody f={f} draft={d} />
          </div>
        ),
      })
    ),
    {
      id: "points",
      title: "כמה נקודות לכל חלק?",
      helper: "סך הכול 100. אפשר להשאיר חלוקה שווה.",
      problem: f.pointsProblem,
      summary: { label: "נקודות", value: f.drafts.map((d) => d.points).join(" + ") },
      body: (
        <div className="space-y-3">
          {f.drafts.map((d, i) => (
            <div key={d.id} className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3">
              <span className="flex-1 text-base font-semibold">
                {partName(i)} · {d.title || EXAM_PART_LABEL_HE[d.type]}
              </span>
              <Input
                type="number"
                min={0}
                max={100}
                value={d.points}
                onChange={(e) => f.updateDraft(d.id, { ...d, points: Number(e.target.value) || 0 })}
                className="h-11 w-24 text-center text-lg"
                aria-label={`נקודות ל${partName(i)}`}
              />
              <span className="text-sm text-muted-foreground">נק׳</span>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <span className={cn("text-lg font-bold tabular-nums", f.totalPoints === 100 ? "text-success" : "text-destructive")}>
              סה״כ {f.totalPoints}/100
            </span>
            <Button variant="outline" onClick={f.splitEvenly}>
              <Scale />
              חלוקה שווה
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "versions",
      title: "כמה גרסאות לשכנים?",
      helper:
        "תלמידים שיושבים זה ליד זה יקבלו גרסה אחרת: בשאלות – אותן שאלות בסדר אחר ועם תשובות מעורבבות; בכתיבה – נושא אחר.",
      summary: { label: "גרסאות", value: String(f.variants.length) },
      body: (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { n: 1, t: "גרסה אחת", s: "כולם מקבלים אותו דבר" },
            { n: 2, t: "2 גרסאות", s: "שכנים מימין, משמאל, מלפנים ומאחור שונים (מומלץ)" },
            { n: 3, t: "3 גרסאות", s: "פיזור רחב יותר" },
          ].map((o) => (
            <ChoiceCard key={o.n} selected={f.variants.length === o.n} onClick={() => f.setVariantCount(o.n)} title={o.t} subtitle={o.s} />
          ))}
        </div>
      ),
    },
    {
      id: "seats",
      title: "מפת ישיבה (רשות)",
      helper: "הושיבו את התלמידים כמו במעבדה, והמערכת תחלק את הגרסאות. אפשר לדלג – אז הגרסאות מתחלקות לסירוגין.",
      summary: { label: "ישיבה", value: f.seatPlan.seats.length ? `${f.seatPlan.seats.length} תלמידים הושבו` : "בלי מפה" },
      body: (
        <SeatPlanEditor
          plan={f.seatPlan}
          onChange={f.setSeatPlan}
          students={f.eligible.map((s) => ({ id: s.id, name: s.name }))}
          variantKeys={f.variantKeys}
        />
      ),
    },
  ];

  return (
    <SetupWizard
      steps={steps}
      readyTitle={`ה${f.kindHe} מוכן!`}
      readyHelper={`בדקו את הבחירות ושמרו. אחרי השמירה אפשר לראות את ה${f.kindHe} כמו שהתלמידים יראו אותו, ולפתוח אותו בזמן המבחן.`}
      readyBody={
        f.problems.length > 0 ? (
          <ul className="space-y-1 rounded-2xl border border-warning/50 bg-warning/10 p-3 text-sm">
            {f.problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : null
      }
      readyActions={
        <Button className="h-12 gap-1.5 px-6 text-base" onClick={() => void f.handleSave()} disabled={f.saving || f.problems.length > 0}>
          {f.saving ? <Loader2 className="animate-spin" /> : <Save />}
          שמירת ה{f.kindHe}
        </Button>
      }
    />
  );
}
