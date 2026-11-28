"use client";

// All state and logic of the test / quiz builder, shared by the step-by-step
// wizard and the everything-on-one-screen layout.

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTeacherSession } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { examHref } from "@/components/teacher-dashboard/shell/nav-items";
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

export const EXAM_GROUPS: StudentGroup[] = ["א1", "א2", "ב"];
export const DEFAULT_MINUTES: Record<ExamKind, number> = { test: 45, quiz: 15 };
const DEFAULT_COUNT: Record<ExamKind, number> = { test: 20, quiz: 10 };
export const HEB_LETTERS = ["א", "ב", "ג", "ד", "ה", "ו"];
/** Order parts are offered in (and added in, from the wizard). */
export const PART_ORDER: ExamPartType[] = ["unseen", "vocab", "grammar", "writing"];

const emptyVariant = (key: string): ExamVariant => ({ key, title: "", prompt: "" });
const newId = () => `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

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
export function evenPoints(n: number): number[] {
  if (n === 0) return [];
  const each = Math.floor(100 / n);
  return Array.from({ length: n }, (_, i) => (i === 0 ? 100 - each * (n - 1) : each));
}

const withEvenPoints = (ds: ExamPartDraft[]) => {
  const pts = evenPoints(ds.length);
  return ds.map((d, i) => ({ ...d, points: pts[i] }));
};

export const partName = (i: number) => `חלק ${HEB_LETTERS[i] ?? i + 1}׳`;

export function useExamForm(examId?: string) {
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
  const [drafts, setDrafts] = useState<ExamPartDraft[]>(() =>
    examId ? [] : [{ id: "writing", type: "writing", title: "", points: 100 }]
  );
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
          bundle.priv?.drafts?.length ? bundle.priv.drafts : [{ id: "writing", type: "writing", title: "", points: 100 }]
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

  const setVariantCount = (count: number) =>
    setVariants((prev) => VARIANT_KEYS.slice(0, count).map((k, i) => prev[i] ?? emptyVariant(k)));

  const setKindAndDefaults = (k: ExamKind) => {
    setKind(k);
    setDurationMin(DEFAULT_MINUTES[k]);
  };

  const updateDraft = (id: string, next: ExamPartDraft) => setDrafts((ds) => ds.map((d) => (d.id === id ? next : d)));
  const addPart = (type: ExamPartType) => setDrafts((ds) => withEvenPoints([...ds, newDraft(type, kind, grade ?? 7)]));
  const removePart = (id: string) => setDrafts((ds) => withEvenPoints(ds.filter((d) => d.id !== id)));
  /** Wizard: switch a part type on/off (kept in the usual order). */
  const togglePartType = (type: ExamPartType) =>
    setDrafts((ds) => {
      const has = ds.some((d) => d.type === type);
      const next = has ? ds.filter((d) => d.type !== type) : [...ds, newDraft(type, kind, grade ?? 7)];
      return withEvenPoints([...next].sort((a, b) => PART_ORDER.indexOf(a.type) - PART_ORDER.indexOf(b.type)));
    });
  const movePart = (i: number, dir: -1 | 1) =>
    setDrafts((ds) => {
      const j = i + dir;
      if (j < 0 || j >= ds.length) return ds;
      const next = [...ds];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const splitEvenly = () => setDrafts((ds) => withEvenPoints(ds));
  const totalPoints = drafts.reduce((t, d) => t + (Number(d.points) || 0), 0);

  /** What's missing in one part (null = ready). */
  const partProblem = (d: ExamPartDraft): string | null => {
    switch (d.type) {
      case "writing":
        if (variants.some((v) => !v.title.trim() || !v.prompt.trim())) return "לכל גרסה צריך נושא כתיבה עם כותרת והנחיה";
        if (words.length < minVocabUsed) return `ברשימה ${words.length} מילים – פחות מהמינימום (${minVocabUsed})`;
        if (minWords > maxWords) return "מינימום המילים גדול מהמקסימום";
        return null;
      case "unseen":
        return !d.storyId || d.questionIds.length === 0 ? "בחרו קטע ושאלות" : null;
      case "vocab":
        return d.words.length < 4 || d.formats.length === 0 ? "צריך לפחות 4 מילים וסוג שאלה אחד" : null;
      case "grammar":
        return d.items.length === 0 ? 'בחרו נושאים ולחצו "יצירת שאלות"' : null;
    }
  };

  const titleProblem = !title.trim() ? `חסרה כותרת ל${kindHe}` : null;
  const classProblem = !targetClass ? "לא נבחרה כיתה" : null;
  const partsProblem = drafts.length === 0 ? "צריך לפחות חלק אחד" : null;
  const pointsProblem = totalPoints !== 100 ? `סכום הנקודות ${totalPoints} – צריך להיות 100` : null;

  const problems: string[] = [
    titleProblem,
    classProblem,
    partsProblem,
    pointsProblem,
    ...drafts.map((d, i) => {
      const p = partProblem(d);
      return p ? `${partName(i)}: ${p}` : null;
    }),
  ].filter((p): p is string => Boolean(p));

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
        {
          exam,
          variants: studentVariants,
          answers: examWords,
          priv: { words: examWords, variants: fullByKey, drafts: cleanDrafts },
        },
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

  return {
    loading,
    saving,
    existing,
    kind,
    kindHe,
    setKindAndDefaults,
    title,
    setTitle,
    targetClass,
    setPickedClass,
    targetGroup,
    setTargetGroup,
    durationMin,
    setDurationMin,
    minWords,
    setMinWords,
    maxWords,
    setMaxWords,
    minVocabUsed,
    setMinVocabUsed,
    variants,
    setVariants,
    setVariantCount,
    variantKeys,
    words,
    setWords,
    drafts,
    updateDraft,
    addPart,
    removePart,
    togglePartType,
    movePart,
    splitEvenly,
    totalPoints,
    seatPlan,
    setSeatPlan,
    grade,
    eligible,
    hasWriting,
    availableClasses: c.availableClasses,
    students: c.students,
    vocabBanks: c.vocabBanks,
    partProblem,
    titleProblem,
    classProblem,
    partsProblem,
    pointsProblem,
    problems,
    handleSave,
  };
}

export type ExamFormController = ReturnType<typeof useExamForm>;
