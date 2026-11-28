"use client";

// The test / quiz builder with everything on one screen.

import React from "react";
import { cn } from "cn";
import { FilterSelect } from "@/components/teacher-dashboard/shared-ui/filter-select";
import { SegmentedControl } from "@/components/teacher-dashboard/shared-ui/segmented-control";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SeatPlanEditor } from "./seat-plan-editor";
import { ExamField, PartBody } from "./exam-part-bodies";
import { DEFAULT_MINUTES, EXAM_GROUPS, PART_ORDER, partName, type ExamFormController } from "./use-exam-form";
import { EXAM_PART_LABEL_HE, type ExamKind, type ExamPartType } from "@/types/exam";
import { ArrowDown, ArrowUp, BookA, BookOpen, BookOpenCheck, Loader2, PenTool, Plus, Save, Scale, Trash2 } from "lucide-react";

export const PART_ICON: Record<ExamPartType, typeof PenTool> = {
  writing: PenTool,
  unseen: BookOpen,
  vocab: BookA,
  grammar: BookOpenCheck,
};

export function ExamFormClassic({ f }: { f: ExamFormController }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>מבחן או בוחן?</CardTitle>
          <CardDescription>
            אותם כללי נעילה בשניהם. בוחן הוא קצר יותר (ברירת מחדל {DEFAULT_MINUTES.quiz} דקות) ומסומן כ״בוחן״ אצל התלמידים ובציונים.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SegmentedControl<ExamKind>
            value={f.kind}
            onChange={f.setKindAndDefaults}
            options={[
              { value: "test", label: "מבחן" },
              { value: "quiz", label: "בוחן" },
            ]}
            aria-label="סוג"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>פרטים</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <ExamField label="כותרת">
              <Input value={f.title} onChange={(e) => f.setTitle(e.target.value)} placeholder={`${f.kindHe} – יחידה 3`} />
            </ExamField>
          </div>
          <ExamField label="כיתה">
            <FilterSelect
              value={f.targetClass}
              onChange={f.setPickedClass}
              options={f.availableClasses.map((cl) => ({ value: cl, label: cl }))}
              className="w-full"
              aria-label="כיתה"
            />
          </ExamField>
          <ExamField label="הקבצה">
            <FilterSelect
              value={f.targetGroup}
              onChange={f.setTargetGroup}
              options={[{ value: "all", label: "כל הכיתה" }, ...EXAM_GROUPS.map((g) => ({ value: g, label: g }))]}
              className="w-full"
              aria-label="הקבצה"
            />
          </ExamField>
          <ExamField label="זמן (דקות)">
            <Input
              type="number"
              min={5}
              max={180}
              value={f.durationMin}
              onChange={(e) => f.setDurationMin(Number(e.target.value) || 15)}
            />
          </ExamField>
          <ExamField label="גרסאות לשכנים" hint="שכנים במפת הישיבה מקבלים גרסה אחרת">
            <SegmentedControl
              value={String(f.variants.length)}
              onChange={(v) => f.setVariantCount(Number(v))}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
              ]}
              aria-label="מספר גרסאות"
            />
          </ExamField>
          <p className="self-end text-xs text-muted-foreground sm:col-span-2">
            {f.eligible.length} תלמידים בכיתה{f.targetGroup !== "all" ? ` ובהקבצה ${f.targetGroup}` : ""}. בחלקי השאלות הגרסאות
            זהות בתוכן – הסדר והתשובות האפשריות מעורבבים. בכתיבה כל גרסה מקבלת נושא משלה.
          </p>
        </CardContent>
      </Card>

      {f.drafts.map((d, i) => {
        const Icon = PART_ICON[d.type];
        return (
          <Card key={d.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <CardTitle>
                  {partName(i)} · {EXAM_PART_LABEL_HE[d.type]}
                </CardTitle>
                <div className="ms-auto flex flex-wrap items-center gap-1.5">
                  <Input
                    value={d.title}
                    onChange={(e) => f.updateDraft(d.id, { ...d, title: e.target.value })}
                    placeholder="כותרת לחלק (רשות)"
                    className="h-7 w-44 text-xs"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={d.points}
                    onChange={(e) => f.updateDraft(d.id, { ...d, points: Number(e.target.value) || 0 })}
                    className="h-7 w-16 text-xs"
                    aria-label="נקודות"
                  />
                  <span className="text-xs text-muted-foreground">נק׳</span>
                  <Button size="icon-sm" variant="ghost" onClick={() => f.movePart(i, -1)} disabled={i === 0} aria-label="למעלה">
                    <ArrowUp />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => f.movePart(i, 1)}
                    disabled={i === f.drafts.length - 1}
                    aria-label="למטה"
                  >
                    <ArrowDown />
                  </Button>
                  <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => f.removePart(d.id)} aria-label="הסרת החלק">
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PartBody f={f} draft={d} />
            </CardContent>
          </Card>
        );
      })}

      <Card size="sm">
        <CardContent className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold">הוספת חלק:</span>
          {PART_ORDER.map((t) => {
            const Icon = PART_ICON[t];
            return (
              <Button
                key={t}
                variant="outline"
                size="sm"
                onClick={() => f.addPart(t)}
                disabled={t === "writing" && f.hasWriting}
                title={t === "writing" && f.hasWriting ? "אפשר חלק כתיבה אחד בלבד" : undefined}
              >
                <Plus />
                <Icon />
                {EXAM_PART_LABEL_HE[t]}
              </Button>
            );
          })}
          <span className={cn("ms-auto text-xs tabular-nums", f.totalPoints === 100 ? "text-success" : "text-destructive")}>
            סה״כ {f.totalPoints}/100 נק׳
          </span>
          <Button variant="ghost" size="sm" onClick={f.splitEvenly} disabled={f.drafts.length === 0}>
            <Scale />
            חלוקה שווה
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>מפת ישיבה (רשות)</CardTitle>
          <CardDescription>הושיבו את התלמידים כמו במעבדה, והמערכת תחלק גרסאות כך ששכנים לא יקבלו אותה גרסה.</CardDescription>
        </CardHeader>
        <CardContent>
          <SeatPlanEditor
            plan={f.seatPlan}
            onChange={f.setSeatPlan}
            students={f.eligible.map((s) => ({ id: s.id, name: s.name }))}
            variantKeys={f.variantKeys}
          />
        </CardContent>
      </Card>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-border bg-background/95 py-3 backdrop-blur">
        <Button onClick={() => void f.handleSave()} disabled={f.saving}>
          {f.saving ? <Loader2 className="animate-spin" /> : <Save />}
          שמירת ה{f.kindHe}
        </Button>
        {f.problems.length > 0 && <span className="text-xs text-muted-foreground">{f.problems.join(" · ")}</span>}
      </div>
    </div>
  );
}
