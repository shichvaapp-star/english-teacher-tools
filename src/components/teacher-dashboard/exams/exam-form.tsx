"use client";

// Create / edit a lab writing exam: details, topic variants, the vocabulary
// list (shown to students in Hebrew) and the seat plan.

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTeacherSession } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { FilterSelect } from "@/components/teacher-dashboard/shared-ui/filter-select";
import { SegmentedControl } from "@/components/teacher-dashboard/shared-ui/segmented-control";
import { examHref } from "@/components/teacher-dashboard/shell/nav-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ExamWordPicker } from "./exam-word-picker";
import { SeatPlanEditor } from "./seat-plan-editor";
import { hashAnswers, newSalt } from "@/lib/exam/vocab-match";
import { assignVariants } from "@/lib/exam/seat-plan";
import { isStudentTargeted } from "@/lib/exam/exam-targeting";
import { loadTeacherExam, newExamId, saveExam } from "@/lib/exam/exam-storage";
import { canonicalClass } from "@/lib/class-names";
import { hebrewGradeToNumber } from "@/lib/levels";
import type { StudentGroup } from "@/types/auth";
import type { ExamDoc, ExamSeatPlan, ExamVariant, ExamVocabAnswer } from "@/types/exam";
import { Loader2, Save } from "lucide-react";

const VARIANT_KEYS = ["A", "B", "C"];
const GROUPS: StudentGroup[] = ["א1", "א2", "ב"];

const emptyVariant = (key: string): ExamVariant => ({ key, title: "", prompt: "" });

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="block text-2xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function ExamForm({ examId }: { examId?: string }) {
  const { c, user } = useTeacherSession();
  const router = useRouter();
  const [loading, setLoading] = useState(Boolean(examId));
  const [saving, setSaving] = useState(false);
  const [existing, setExisting] = useState<ExamDoc | null>(null);

  const [title, setTitle] = useState("");
  const [pickedClass, setPickedClass] = useState<string>("");
  const [targetGroup, setTargetGroup] = useState<string>("all");
  const [durationMin, setDurationMin] = useState(45);
  const [minWords, setMinWords] = useState(80);
  const [maxWords, setMaxWords] = useState(150);
  const [minVocabUsed, setMinVocabUsed] = useState(10);
  const [variants, setVariants] = useState<ExamVariant[]>([emptyVariant("A"), emptyVariant("B")]);
  const [originalVariantKeys, setOriginalVariantKeys] = useState<string[]>([]);
  const [words, setWords] = useState<ExamVocabAnswer[]>([]);
  const [seatPlan, setSeatPlan] = useState<ExamSeatPlan>({ rows: 4, cols: 6, seats: [] });

  useEffect(() => {
    if (!examId) return;
    loadTeacherExam(examId)
      .then((bundle) => {
        if (!bundle) {
          toast.error("המבחן לא נמצא");
          return;
        }
        const { exam } = bundle;
        setExisting(exam);
        setTitle(exam.title);
        setPickedClass(exam.targetClass ?? "");
        setTargetGroup(exam.targetGroup ?? "all");
        setDurationMin(exam.durationMin);
        setMinWords(exam.minWords);
        setMaxWords(exam.maxWords);
        setMinVocabUsed(exam.minVocabUsed);
        setVariants(bundle.variants.length ? bundle.variants : [emptyVariant("A")]);
        setOriginalVariantKeys(bundle.variants.map((v) => v.key));
        setWords(bundle.answers);
        if (exam.seatPlan) setSeatPlan(exam.seatPlan);
      })
      .catch(() => toast.error("לא ניתן לטעון את המבחן"))
      .finally(() => setLoading(false));
  }, [examId]);

  // Until the teacher picks one: the first class that actually has students.
  const defaultClass =
    c.students.map((st) => canonicalClass(st.fullClass)).find((cl): cl is string => Boolean(cl)) ??
    c.availableClasses[0] ??
    "";
  const targetClass = pickedClass || defaultClass;

  const grade = useMemo(() => {
    const canon = canonicalClass(targetClass);
    return canon ? hebrewGradeToNumber(canon[0]) ?? undefined : undefined;
  }, [targetClass]);

  const target = {
    targetType: "class" as const,
    targetClass,
    targetGroup: targetGroup === "all" ? undefined : (targetGroup as StudentGroup),
  };
  const eligible = c.students
    .filter((s) => isStudentTargeted(target, s))
    .sort((a, b) => a.name.localeCompare(b.name, "he"));
  const variantKeys = variants.map((v) => v.key);

  const setVariantCount = (n: string) => {
    const count = Number(n);
    setVariants((prev) => VARIANT_KEYS.slice(0, count).map((k, i) => prev[i] ?? emptyVariant(k)));
  };

  const problems: string[] = [];
  if (!title.trim()) problems.push("חסרה כותרת למבחן");
  if (!targetClass) problems.push("לא נבחרה כיתה");
  if (variants.some((v) => !v.title.trim() || !v.prompt.trim())) problems.push("לכל נושא צריך כותרת והנחיה");
  if (words.length < minVocabUsed) problems.push(`ברשימה ${words.length} מילים – פחות מהמינימום לשימוש (${minVocabUsed})`);
  if (minWords > maxWords) problems.push("מינימום המילים גדול מהמקסימום");

  const handleSave = async () => {
    if (problems.length) {
      toast.error(problems[0]);
      return;
    }
    setSaving(true);
    try {
      const id = existing?.id ?? newExamId();
      const salt = newSalt();
      // Opaque ids: bank word ids often contain the English word (would leak via F12).
      const examWords = words.map((w, i) => ({ ...w, id: `w${i + 1}` }));
      const nowIso = new Date().toISOString();
      const studentIds = eligible.map((s) => s.id);
      const validSeats = seatPlan.seats.filter((s) => studentIds.includes(s.studentId));
      const plan = { ...seatPlan, seats: validSeats };
      const exam: ExamDoc = {
        id,
        teacherId: user.id,
        teacherName: user.name,
        title: title.trim(),
        grade,
        ...target,
        status: existing?.status ?? "draft",
        durationMin,
        minWords,
        maxWords,
        minVocabUsed,
        vocabHebrew: examWords.map((w) => ({ id: w.id, he: w.hebrew })),
        vocabHashes: hashAnswers(examWords, salt),
        vocabSalt: salt,
        variantKeys,
        variantByStudent: assignVariants(studentIds, variantKeys, plan),
        seatPlan: plan,
        createdAt: existing?.createdAt ?? nowIso,
        updatedAt: nowIso,
      };
      const trimmed = variants.map((v) => ({ key: v.key, title: v.title.trim(), prompt: v.prompt.trim() }));
      await saveExam(
        { exam, variants: trimmed, answers: examWords },
        originalVariantKeys.filter((k) => !variantKeys.includes(k))
      );
      toast.success("המבחן נשמר");
      router.push(examHref(id));
    } catch (err) {
      console.warn("save exam", err);
      toast.error("השמירה נכשלה");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (existing && existing.status !== "draft") {
    return <p className="text-sm text-muted-foreground">אפשר לערוך מבחן רק לפני שהוא נפתח.</p>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>פרטי המבחן</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Field label="כותרת">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="מבחן כתיבה – יחידה 3" />
            </Field>
          </div>
          <Field label="כיתה">
            <FilterSelect
              value={targetClass}
              onChange={setPickedClass}
              options={c.availableClasses.map((cl) => ({ value: cl, label: cl }))}
              className="w-full"
              aria-label="כיתה"
            />
          </Field>
          <Field label="הקבצה">
            <FilterSelect
              value={targetGroup}
              onChange={setTargetGroup}
              options={[{ value: "all", label: "כל הכיתה" }, ...GROUPS.map((g) => ({ value: g, label: g }))]}
              className="w-full"
              aria-label="הקבצה"
            />
          </Field>
          <Field label="זמן (דקות)">
            <Input type="number" min={5} max={180} value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value) || 45)} />
          </Field>
          <Field label="מינימום מילים בחיבור">
            <Input type="number" min={10} value={minWords} onChange={(e) => setMinWords(Number(e.target.value) || 0)} />
          </Field>
          <Field label="מקסימום מילים">
            <Input type="number" min={10} value={maxWords} onChange={(e) => setMaxWords(Number(e.target.value) || 0)} />
          </Field>
          <Field label="מינימום מילים מהרשימה">
            <Input type="number" min={1} value={minVocabUsed} onChange={(e) => setMinVocabUsed(Number(e.target.value) || 1)} />
          </Field>
          <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-4">
            {eligible.length} תלמידים בכיתה{targetGroup !== "all" ? ` ובהקבצה ${targetGroup}` : ""}.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>נושאי הכתיבה</CardTitle>
          <CardDescription>
            עם 2–3 נושאים, תלמידים שיושבים זה ליד זה (או אחד מאחורי השני) יקבלו נושא אחר. התלמידים רואים את הנושא רק כשהמבחן נפתח.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SegmentedControl
            value={String(variants.length)}
            onChange={setVariantCount}
            options={[
              { value: "1", label: "נושא אחד" },
              { value: "2", label: "2 נושאים" },
              { value: "3", label: "3 נושאים" },
            ]}
            aria-label="מספר נושאים"
          />
          <div className="grid gap-3 lg:grid-cols-3">
            {variants.map((v, i) => (
              <div key={v.key} className="space-y-2 rounded-lg border border-border p-3">
                <div className="text-sm font-bold">נושא {v.key}</div>
                <Input
                  dir="ltr"
                  placeholder="Title, e.g. My best day"
                  value={v.title}
                  onChange={(e) => setVariants((prev) => prev.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                />
                <Textarea
                  dir="ltr"
                  rows={4}
                  placeholder="Instructions for the student (in English)"
                  value={v.prompt}
                  onChange={(e) => setVariants((prev) => prev.map((x, j) => (j === i ? { ...x, prompt: e.target.value } : x)))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>רשימת המילים</CardTitle>
          <CardDescription>
            התלמידים רואים את המילים בעברית בלבד, וכל מילה מסומנת ✓ כשהיא מופיעה באנגלית בחיבור (גם בהטיה: borrowed, cities).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExamWordPicker words={words} onChange={setWords} grade={grade} teacherBanks={c.vocabBanks} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>מפת ישיבה (רשות)</CardTitle>
          <CardDescription>הושיבו את התלמידים כמו במעבדה, והמערכת תחלק נושאים כך ששכנים לא יקבלו אותו נושא.</CardDescription>
        </CardHeader>
        <CardContent>
          <SeatPlanEditor
            plan={seatPlan}
            onChange={setSeatPlan}
            students={eligible.map((s) => ({ id: s.id, name: s.name }))}
            variantKeys={variantKeys}
          />
        </CardContent>
      </Card>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-border bg-background/95 py-3 backdrop-blur">
        <Button onClick={() => void handleSave()} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          שמירת המבחן
        </Button>
        {problems.length > 0 && <span className="text-xs text-muted-foreground">{problems.join(" · ")}</span>}
      </div>
    </div>
  );
}
