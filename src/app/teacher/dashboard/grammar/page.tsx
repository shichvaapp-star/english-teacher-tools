"use client";

import React, { useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ClipboardList, ExternalLink, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { useDashboard } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { GRAMMAR_GROUPS, GRAMMAR_TOPICS, getGrammarItems } from "@/data/grammar";
import { RuleCardBody, type RuleLang } from "@/components/grammar/grammar-rule-sheet";
import { EXERCISE_TYPE_LABEL, ExerciseTypeTip } from "@/components/grammar/exercises";
import { GrammarPrintSheet } from "@/components/grammar/grammar-print-sheet";
import { HeText } from "@/components/grammar/he-text";
import { expectedAnswer } from "@/lib/grammar-grading";
import { itemPromptText } from "@/lib/grammar-format";
import { LEVELS, LEVEL_NAME_HE, levelToLabel, type ClassGrade, type LevelNumber } from "@/lib/levels";
import type { GrammarExerciseType } from "@/types/grammar";
import type { TeacherAssignment } from "@/types/assignment";

const GRADES: ClassGrade[] = [7, 8, 9];
const GRADE_HE: Record<ClassGrade, string> = { 7: "ז׳", 8: "ח׳", 9: "ט׳" };

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer",
        on ? "border-type-grammar bg-type-grammar/15 text-foreground" : "border-border text-muted-foreground hover:bg-muted/50"
      )}
    >
      {children}
    </button>
  );
}

const noopSubscribe = () => () => {};

/** The dashboard shell is hidden in print, so the worksheet renders straight into <body>. */
function PrintPortal({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return mounted ? createPortal(children, document.body) : null;
}

/** Teacher view of the grammar bank: rules + every item, assign and print. */
export default function GrammarBankPage() {
  const c = useDashboard();
  const [topicId, setTopicId] = useState(GRAMMAR_TOPICS[0]?.id ?? "");
  const [level, setLevel] = useState<LevelNumber>(2);
  const [grade, setGrade] = useState<ClassGrade>(7);
  const [types, setTypes] = useState<GrammarExerciseType[]>([]);
  const [lang, setLang] = useState<RuleLang>("he");
  const [withKey, setWithKey] = useState(true);

  const topic = GRAMMAR_TOPICS.find((t) => t.id === topicId);
  const levelItems = useMemo(() => getGrammarItems(topicId, level, grade), [topicId, level, grade]);
  const items = types.length ? levelItems.filter((i) => types.includes(i.type)) : levelItems;
  const usedTypes = [...new Set(levelItems.map((i) => i.type))];

  const assign = () => {
    if (!topic) return;
    const template: TeacherAssignment = {
      id: "",
      teacherId: c.user?.id ?? "",
      teacherName: c.user?.name ?? "",
      type: "grammar",
      title: "",
      hebrewTitle: "",
      taskId: topic.id,
      level: levelToLabel(level),
      grammarConfig: { topicIds: [topic.id], exerciseTypes: types.length ? types : undefined },
      targetType: "class",
      createdAt: new Date().toISOString(),
      status: "active",
      isShared: false,
    };
    c.openAssignModal({ template });
  };

  if (!topic) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-6 print:hidden">
        <PageHeader
          title="מאגר דקדוק"
          description={`${GRAMMAR_TOPICS.length} נושאים לפי תוכנית הלימודים (Band II). כאן רואים את הכללים ואת כל התרגילים, מקצים לכיתה ומדפיסים דף עבודה.`}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => window.print()} className="gap-1.5">
                <Printer className="size-4" />
                הדפסת דף עבודה
              </Button>
              <Button onClick={assign} className="gap-1.5">
                <ClipboardList className="size-4" />
                הקצאה לתלמידים
              </Button>
            </div>
          }
        />

        {/* Filters */}
        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          {GRAMMAR_GROUPS.map((g) => {
            const topics = GRAMMAR_TOPICS.filter((t) => t.group === g.id);
            if (!topics.length) return null;
            return (
              <div key={g.id} className="flex flex-wrap items-center gap-1.5">
                <span className="w-28 text-xs text-muted-foreground">{g.titleHe}</span>
                {topics.map((t) => (
                  <Chip key={t.id} on={t.id === topicId} onClick={() => setTopicId(t.id)}>
                    <span dir="ltr">{t.title}</span>
                  </Chip>
                ))}
              </div>
            );
          })}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="w-28 text-xs text-muted-foreground">רמה</span>
            {LEVELS.map((l) => (
              <Chip key={l} on={l === level} onClick={() => setLevel(l)}>
                {LEVEL_NAME_HE[l]}
              </Chip>
            ))}
            <span className="mx-2 h-4 w-px bg-border" />
            <span className="text-xs text-muted-foreground">שכבה</span>
            {GRADES.map((g) => (
              <Chip key={g} on={g === grade} onClick={() => setGrade(g)}>
                {GRADE_HE[g]}
              </Chip>
            ))}
          </div>
          {usedTypes.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-28 text-xs text-muted-foreground">סוגי תרגילים</span>
              {usedTypes.map((t) => (
                <ExerciseTypeTip key={t} type={t}>
                  <span className="inline-flex">
                    <Chip on={types.includes(t)} onClick={() => setTypes((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))}>
                      {EXERCISE_TYPE_LABEL[t].he}
                    </Chip>
                  </span>
                </ExerciseTypeTip>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={withKey} onChange={(e) => setWithKey(e.target.checked)} />
              להדפיס גם דף תשובות
            </label>
            <Link href="/grammar" target="_blank" className="inline-flex items-center gap-1 text-primary hover:underline">
              <ExternalLink className="size-3.5" /> לפתוח את מסך התלמיד
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Rule card */}
          <section className="space-y-3 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">הכלל ({LEVEL_NAME_HE[level]})</h2>
              <div className="inline-flex rounded-lg border border-border p-0.5 text-xs font-semibold">
                {(["he", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={cn(
                      "rounded-md px-2.5 py-0.5 cursor-pointer",
                      lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    )}
                  >
                    {l === "he" ? "עברית" : "English"}
                  </button>
                ))}
              </div>
            </div>
            <RuleCardBody topic={topic} level={level} lang={lang} />
          </section>

          {/* Items */}
          <section className="space-y-3 lg:col-span-3">
            <h2 className="text-sm font-bold">תרגילים ({items.length})</h2>
            {items.length === 0 && <p className="text-sm text-muted-foreground">אין תרגילים לבחירה הזו עדיין.</p>}
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={item.id} className="rounded-lg border border-border bg-card p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-2xs text-muted-foreground">
                    <span>
                      {i + 1}. {EXERCISE_TYPE_LABEL[item.type].he}
                      {item.grade ? ` · ${GRADE_HE[item.grade]}` : " · כל השכבות"}
                    </span>
                    <span className="font-mono" dir="ltr">{item.id}</span>
                  </div>
                  <p className="text-sm text-foreground" dir="ltr">
                    {item.context && <span className="italic text-muted-foreground">{item.context} </span>}
                    {itemPromptText(item)}
                  </p>
                  <p dir="ltr">
                    <span className="text-muted-foreground">Answer: </span>
                    <span className="font-semibold text-success">{expectedAnswer(item)}</span>
                  </p>
                  <p className="text-muted-foreground font-hebrew" dir="rtl">
                    <HeText text={item.explanationHe} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <PrintPortal>
        <GrammarPrintSheet topic={topic} items={items} levelLabel={levelToLabel(level)} withKey={withKey} />
      </PrintPortal>
    </div>
  );
}
