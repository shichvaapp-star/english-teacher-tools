"use client";

// Create / edit a lab test or quiz: kind, details, ordered parts (Writing,
// Unseen, Vocabulary, Grammar), versions for neighbours and the seat plan.

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "cn";
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
import { GrammarPartBuilder, UnseenPartBuilder, VocabPartBuilder } from "./part-builders";
import { hashAnswers, newSalt } from "@/lib/exam/vocab-match";
import { assignVariants } from "@/lib/exam/seat-plan";
import { isStudentTargeted } from "@/lib/exam/exam-targeting";
import { loadTeacherExam, newExamId, saveExam } from "@/lib/exam/exam-storage";
import { fullPartFromDraft, partItemCount } from "@/lib/exam/exam-build";
import { stripPart, VARIANT_KEYS, versionOf } from "@/lib/exam/exam-parts";
import { canonicalClass } from "@/lib/class-names";
import { hebrewGradeToNumber } from "@/lib/levels";
import type { StudentGroup } from "@/types/auth";
import {
  EXAM_KIND_HE,
  EXAM_PART_LABEL_HE,
  type ExamDoc,
  type ExamKind,
  type ExamPartDraft,
  type ExamPartFull,
  type ExamPartMeta,
  type ExamPartType,
  type ExamSeatPlan,
  type ExamVariant,
  type ExamVocabAnswer,
} from "@/types/exam";
import { ArrowDown, ArrowUp, BookA, BookOpen, BookOpenCheck, Loader2, PenTool, Plus, Save, Scale, Trash2 } from "lucide-react";

const GROUPS: StudentGroup[] = ["א1", "א2", "ב"];
const DEFAULT_MINUTES: Record<ExamKind, number> = { test: 45, quiz: 15 };
const DEFAULT_COUNT: Record<ExamKind, number> = { test: 20, quiz: 10 };
const PART_ICON: Record<ExamPartType, typeof PenTool> = {
  writing: PenTool,
  unseen: BookOpen,
  vocab: BookA,
  grammar: BookOpenCheck,
};
const HEB_LETTERS = ["א", "ב", "ג", "ד", "ה", "ו"];

const emptyVariant = (key: string): ExamVariant => ({ key, title: "", prompt: "" });
const newId = () => `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="block text-2xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function newDraft(type: ExamPartType, kind: ExamKind, grade: 7 | 8 | 9): ExamPartDraft {
  const base = { id: newId(), title: "", points: 0 };
  switch (type) {
    case "writing":
      return { ...base, type };
    case "unseen":
      return { ...base, type, grade, level: 2, storyId: "", questionIds: [] };
    case "vocab":
      return {
        ...base,
        type,
        words: [],
        formats: ["he_to_en_type", "en_to_he_choice", "he_to_en_choice"],
        count: DEFAULT_COUNT[kind],
        seed: Math.floor(Math.random() * 2 ** 31),
      };
    case "grammar":
      return { ...base, type, grade, level: 2, topicIds: [], types: [], count: DEFAULT_COUNT[kind], items: [] };
  }
}

/** Points split evenly, rounding fixed on the first part so the total is exactly 100. */
function evenPoints(n: number): number[] {
  if (n === 0) return [];
  const each = Math.floor(100 / n);
  return Array.from({ length: n }, (_, i) => (i === 0 ? 100 - each * (n - 1) : each));
}

export function ExamForm({ examId }: { examId?: string }) {
  const { c, user } = useTeacherSession();
  const router = useRouter();
  const [loading, setLoading] = useState(Boolean(examId));
  const [saving, setSaving] = useState(false);
  const [existing, setExisting] = useState<ExamDoc | null>(null);

  const [kind, setKind] = useState<ExamKind>("test");
  const [title, setTitle] = useState("");
  const [pickedClass, setPickedClass] = useState<string>("");
  const [targetGroup, setTargetGroup] = useState<string>("all");
  const [durationMin, setDurationMin] = useState(DEFAULT_MINUTES.test);
  const [minWords, setMinWords] = useState(80);
  const [maxWords, setMaxWords] = useState(150);
  const [minVocabUsed, setMinVocabUsed] = useState(10);
  /** One entry per version (A/B/C); holds the writing topic of that version. */
  const [variants, setVariants] = useState<ExamVariant[]>([emptyVariant("A"), emptyVariant("B")]);
  const [originalVariantKeys, setOriginalVariantKeys] = useState<string[]>([]);
  const [words, setWords] = useState<ExamVocabAnswer[]>([]);
  const [drafts, setDrafts] = useState<ExamPartDraft[]>(() => [{ id: "writing", type: "writing", title: "", points: 100 }]);
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
        setKind(exam.kind ?? "test");
        setTitle(exam.title);
        setPickedClass(exam.targetClass ?? "");
        setTargetGroup(exam.targetGroup ?? "all");
        setDurationMin(exam.durationMin);
        setMinWords(exam.minWords);
        setMaxWords(exam.maxWords);
        setMinVocabUsed(exam.minVocabUsed);
        setVariants(
          bundle.variants.length
            ? bundle.variants.map((v) => ({ key: v.key, title: v.title, prompt: v.prompt }))
            : [emptyVariant("A")]
        );
        setOriginalVariantKeys(bundle.variants.map((v) => v.key));
        setWords(bundle.answers);
        setDrafts(
          bundle.priv?.drafts?.length
            ? bundle.priv.drafts
            : [{ id: "writing", type: "writing", title: "", points: 100 }]
        );
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
    return canon ? (hebrewGradeToNumber(canon[0]) ?? undefined) : undefined;
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
  const hasWriting = drafts.some((d) => d.type === "writing");
  const kindHe = EXAM_KIND_HE[kind];

  const setVariantCount = (n: string) => {
    const count = Number(n);
    setVariants((prev) => VARIANT_KEYS.slice(0, count).map((k, i) => prev[i] ?? emptyVariant(k)));
  };

  const setKindAndDefaults = (k: ExamKind) => {
    setKind(k);
    setDurationMin(DEFAULT_MINUTES[k]);
  };

  const updateDraft = (id: string, next: ExamPartDraft) => setDrafts((ds) => ds.map((d) => (d.id === id ? next : d)));
  const addPart = (type: ExamPartType) =>
    setDrafts((ds) => {
      const added = [...ds, newDraft(type, kind, grade ?? 7)];
      const pts = evenPoints(added.length);
      return added.map((d, i) => ({ ...d, points: pts[i] }));
    });
  const removePart = (id: string) =>
    setDrafts((ds) => {
      const left = ds.filter((d) => d.id !== id);
      const pts = evenPoints(left.length);
      return left.map((d, i) => ({ ...d, points: pts[i] }));
    });
  const movePart = (i: number, dir: -1 | 1) =>
    setDrafts((ds) => {
      const j = i + dir;
      if (j < 0 || j >= ds.length) return ds;
      const next = [...ds];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const splitEvenly = () => setDrafts((ds) => ds.map((d, i) => ({ ...d, points: evenPoints(ds.length)[i] })));
  const totalPoints = drafts.reduce((t, d) => t + (Number(d.points) || 0), 0);

  const problems: string[] = [];
  if (!title.trim()) problems.push(`חסרה כותרת ל${kindHe}`);
  if (!targetClass) problems.push("לא נבחרה כיתה");
  if (drafts.length === 0) problems.push("צריך לפחות חלק אחד");
  if (totalPoints !== 100) problems.push(`סכום הנקודות ${totalPoints} – צריך להיות 100`);
  drafts.forEach((d, i) => {
    const name = `חלק ${HEB_LETTERS[i] ?? i + 1}׳`;
    if (d.type === "writing") {
      if (variants.some((v) => !v.title.trim() || !v.prompt.trim())) problems.push(`${name}: לכל גרסה צריך נושא כתיבה עם כותרת והנחיה`);
      if (words.length < minVocabUsed) problems.push(`${name}: ברשימה ${words.length} מילים – פחות מהמינימום (${minVocabUsed})`);
      if (minWords > maxWords) problems.push(`${name}: מינימום המילים גדול מהמקסימום`);
    }
    if (d.type === "unseen" && (!d.storyId || d.questionIds.length === 0)) problems.push(`${name}: בחרו קטע ושאלות`);
    if (d.type === "vocab" && (d.words.length < 4 || d.formats.length === 0)) problems.push(`${name}: צריך לפחות 4 מילים וסוג שאלה אחד`);
    if (d.type === "grammar" && d.items.length === 0) problems.push(`${name}: לחצו "יצירת שאלות"`);
  });

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
      const examWords = hasWriting ? words.map((w, i) => ({ ...w, id: `w${i + 1}` })) : [];
      const nowIso = new Date().toISOString();
      const studentIds = eligible.map((s) => s.id);
      const plan = { ...seatPlan, seats: seatPlan.seats.filter((s) => studentIds.includes(s.studentId)) };

      // Vocabulary parts are built from opaque word ids too.
      const cleanDrafts: ExamPartDraft[] = drafts.map((d) =>
        d.type === "vocab" ? { ...d, words: d.words.map((w, i) => ({ ...w, id: `${d.id}-w${i + 1}` })) } : d
      );
      const fullA = cleanDrafts.map(fullPartFromDraft);
      if (fullA.some((p) => p === null)) throw new Error("part could not be built");
      const partsA = fullA as ExamPartFull[];
      const fullByKey: Record<string, ExamPartFull[]> = Object.fromEntries(
        variantKeys.map((k) => [k, partsA.map((p) => versionOf(p, k))])
      );
      const metas: ExamPartMeta[] = cleanDrafts.map((d, i) => ({
        id: d.id,
        type: d.type,
        title: d.title.trim() || EXAM_PART_LABEL_HE[d.type],
        points: Number(d.points) || 0,
        itemCount: partItemCount(partsA[i]),
      }));

      const exam: ExamDoc = {
        id,
        teacherId: user.id,
        teacherName: user.name,
        title: title.trim(),
        grade,
        ...target,
        status: existing?.status ?? "draft",
        kind,
        parts: metas,
        durationMin,
        minWords: hasWriting ? minWords : 0,
        maxWords: hasWriting ? maxWords : 0,
        minVocabUsed: hasWriting ? minVocabUsed : 0,
        vocabHebrew: examWords.map((w) => ({ id: w.id, he: w.hebrew })),
        vocabHashes: hashAnswers(examWords, salt),
        vocabSalt: salt,
        variantKeys,
        variantByStudent: assignVariants(studentIds, variantKeys, plan),
        seatPlan: plan,
        createdAt: existing?.createdAt ?? nowIso,
        updatedAt: nowIso,
      };
      const studentVariants: ExamVariant[] = variants.map((v) => ({
        key: v.key,
        title: hasWriting ? v.title.trim() : "",
        prompt: hasWriting ? v.prompt.trim() : "",
        parts: fullByKey[v.key].map(stripPart),
      }));
      await saveExam(
        { exam, variants: studentVariants, answers: examWords, priv: { words: examWords, variants: fullByKey, drafts: cleanDrafts } },
        originalVariantKeys.filter((k) => !variantKeys.includes(k))
      );
      toast.success(`ה${kindHe} נשמר`);
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
    return <p className="text-sm text-muted-foreground">אפשר לערוך רק לפני הפתיחה.</p>;
  }

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
          <SegmentedControl
            value={kind}
            onChange={setKindAndDefaults}
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
            <Field label="כותרת">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`${kindHe} – יחידה 3`} />
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
            <Input type="number" min={5} max={180} value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value) || 15)} />
          </Field>
          <Field label="גרסאות לשכנים" hint="שכנים במפת הישיבה מקבלים גרסה אחרת">
            <SegmentedControl
              value={String(variants.length)}
              onChange={setVariantCount}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
              ]}
              aria-label="מספר גרסאות"
            />
          </Field>
          <p className="self-end text-xs text-muted-foreground sm:col-span-2">
            {eligible.length} תלמידים בכיתה{targetGroup !== "all" ? ` ובהקבצה ${targetGroup}` : ""}. בחלקי השאלות הגרסאות זהות בתוכן –
            הסדר והתשובות האפשריות מעורבבים. בכתיבה כל גרסה מקבלת נושא משלה.
          </p>
        </CardContent>
      </Card>

      {drafts.map((d, i) => {
        const Icon = PART_ICON[d.type];
        return (
          <Card key={d.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <CardTitle>
                  חלק {HEB_LETTERS[i] ?? i + 1}׳ · {EXAM_PART_LABEL_HE[d.type]}
                </CardTitle>
                <div className="ms-auto flex flex-wrap items-center gap-1.5">
                  <Input
                    value={d.title}
                    onChange={(e) => updateDraft(d.id, { ...d, title: e.target.value })}
                    placeholder="כותרת לחלק (רשות)"
                    className="h-7 w-44 text-xs"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={d.points}
                    onChange={(e) => updateDraft(d.id, { ...d, points: Number(e.target.value) || 0 })}
                    className="h-7 w-16 text-xs"
                    aria-label="נקודות"
                  />
                  <span className="text-xs text-muted-foreground">נק׳</span>
                  <Button size="icon-sm" variant="ghost" onClick={() => movePart(i, -1)} disabled={i === 0} aria-label="למעלה">
                    <ArrowUp />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => movePart(i, 1)} disabled={i === drafts.length - 1} aria-label="למטה">
                    <ArrowDown />
                  </Button>
                  <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => removePart(d.id)} aria-label="הסרת החלק">
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {d.type === "writing" && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="מינימום מילים בחיבור">
                      <Input type="number" min={10} value={minWords} onChange={(e) => setMinWords(Number(e.target.value) || 0)} />
                    </Field>
                    <Field label="מקסימום מילים">
                      <Input type="number" min={10} value={maxWords} onChange={(e) => setMaxWords(Number(e.target.value) || 0)} />
                    </Field>
                    <Field label="מינימום מילים מהרשימה">
                      <Input type="number" min={1} value={minVocabUsed} onChange={(e) => setMinVocabUsed(Number(e.target.value) || 1)} />
                    </Field>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {variants.map((v, vi) => (
                      <div key={v.key} className="space-y-2 rounded-lg border border-border p-3">
                        <div className="text-sm font-bold">נושא לגרסה {v.key}</div>
                        <Input
                          dir="ltr"
                          placeholder="Title, e.g. My best day"
                          value={v.title}
                          onChange={(e) => setVariants((prev) => prev.map((x, j) => (j === vi ? { ...x, title: e.target.value } : x)))}
                        />
                        <Textarea
                          dir="ltr"
                          rows={4}
                          placeholder="Instructions for the student (in English)"
                          value={v.prompt}
                          onChange={(e) => setVariants((prev) => prev.map((x, j) => (j === vi ? { ...x, prompt: e.target.value } : x)))}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold">רשימת המילים לחיבור</div>
                    <p className="text-xs text-muted-foreground">
                      התלמידים רואים את המילים בעברית בלבד, וכל מילה מסומנת ✓ כשהיא מופיעה באנגלית בחיבור.
                    </p>
                    <ExamWordPicker words={words} onChange={setWords} grade={grade} teacherBanks={c.vocabBanks} />
                  </div>
                </div>
              )}
              {d.type === "unseen" && <UnseenPartBuilder draft={d} onChange={(n) => updateDraft(d.id, n)} />}
              {d.type === "vocab" && (
                <VocabPartBuilder draft={d} onChange={(n) => updateDraft(d.id, n)} grade={grade} teacherBanks={c.vocabBanks} />
              )}
              {d.type === "grammar" && <GrammarPartBuilder draft={d} onChange={(n) => updateDraft(d.id, n)} />}
            </CardContent>
          </Card>
        );
      })}

      <Card size="sm">
        <CardContent className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold">הוספת חלק:</span>
          {(["unseen", "vocab", "grammar", "writing"] as ExamPartType[]).map((t) => {
            const Icon = PART_ICON[t];
            return (
              <Button
                key={t}
                variant="outline"
                size="sm"
                onClick={() => addPart(t)}
                disabled={t === "writing" && hasWriting}
                title={t === "writing" && hasWriting ? "אפשר חלק כתיבה אחד בלבד" : undefined}
              >
                <Plus />
                <Icon />
                {EXAM_PART_LABEL_HE[t]}
              </Button>
            );
          })}
          <span className={cn("ms-auto text-xs tabular-nums", totalPoints === 100 ? "text-success" : "text-destructive")}>
            סה״כ {totalPoints}/100 נק׳
          </span>
          <Button variant="ghost" size="sm" onClick={splitEvenly} disabled={drafts.length === 0}>
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
          שמירת ה{kindHe}
        </Button>
        {problems.length > 0 && <span className="text-xs text-muted-foreground">{problems.join(" · ")}</span>}
      </div>
    </div>
  );
}
