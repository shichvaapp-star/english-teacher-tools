"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, Search, Send } from "lucide-react";
import type { StudentGroup, StudentProfile } from "@/types/auth";
import type { AssignmentType, ExerciseLevel } from "@/types/assignment";
import type { GrammarExerciseType } from "@/types/grammar";
import { GRAMMAR_GROUPS, GRAMMAR_ITEMS, GRAMMAR_TOPICS } from "@/data/grammar";
import { EXERCISE_TYPE_LABEL } from "@/components/grammar/exercises";
import { gradeUnits } from "@/data/vocab/cards";
import { curriculumWords } from "@/lib/vocab-storage";
import { CLASS_GRADES, GRADE_LABELS, type ClassGrade } from "@/lib/levels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BigCounter, ChoiceCard, SectionLabel, ToggleRow } from "@/components/shared/wizard/wizard-ui";
import { WizardLayout, WizardNav, WizardSummary, type SummaryLine } from "@/components/shared/wizard/wizard-frame";
import { useWizardSteps } from "@/components/shared/wizard/use-wizard-steps";
import type { AssignTaskForm } from "@/components/teacher-dashboard/assign/use-assign-task-form";
import { VocabWordBuilder } from "@/components/teacher-dashboard/assign/vocab-word-builder";

// The step-by-step layout of the "assign task" dialog: one plain question per
// screen. All answers live in the shared form hook, so switching to the
// classic layout (and back) keeps them.

export type AssignStep =
  | "type"
  | "grade"
  | "level"
  | "choiceMode"
  | "task"
  | "vocabSource"
  | "vocabPick"
  | "vocabWords"
  | "grammarTopics"
  | "grammarOptions"
  | "audience"
  | "class"
  | "scope"
  | "students"
  | "extras"
  | "review";

const TYPE_OPTIONS: { type: AssignmentType; icon: string; title: string; subtitle: string }[] = [
  { type: "writing", icon: "✍️", title: "כתיבה", subtitle: "חיבור, מכתב או תיאור באנגלית" },
  { type: "unseen", icon: "📖", title: "אנסין – הבנת הנקרא", subtitle: "קטע קריאה עם שאלות" },
  { type: "conversation", icon: "💬", title: "שיחות מהחיים", subtitle: "שיחה קצרה עם שאלות" },
  { type: "vocab", icon: "🔤", title: "אוצר מילים", subtitle: "תרגול רשימת מילים" },
  { type: "grammar", icon: "📐", title: "דקדוק", subtitle: "תרגילים לפי נושא דקדוק" },
];

const TYPE_LABEL = Object.fromEntries(TYPE_OPTIONS.map((o) => [o.type, o.title])) as Record<AssignmentType, string>;

const LEVEL_OPTIONS: { id: "all" | ExerciseLevel; title: string; subtitle: string }[] = [
  { id: "all", title: "כל הרמות", subtitle: "משימות מכל הרמות" },
  { id: "Level 1", title: "רמה 1", subtitle: "מתחילים" },
  { id: "Level 2", title: "רמה 2", subtitle: "מתקדמים" },
  { id: "Level 3", title: "רמה 3", subtitle: "מיומנים" },
];

const GROUPS: StudentGroup[] = ["א1", "א2", "ב"];

const ALL_GRAMMAR_TYPES = Object.keys(EXERCISE_TYPE_LABEL) as GrammarExerciseType[];

const toggle = <T,>(list: T[], x: T): T[] => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);

function gradeText(g: "all" | ClassGrade): string {
  return g === "all" ? "כל תלמיד/ה לפי הכיתה" : GRADE_LABELS[g].he;
}

function levelText(l: "all" | ExerciseLevel): string {
  return LEVEL_OPTIONS.find((o) => o.id === l)?.title ?? l;
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("he-IL", { day: "numeric", month: "long" });
}

/** The library items (writing tasks, stories or scenarios) the current filters allow. */
function taskPool(f: AssignTaskForm): { id: string; title: string; hebrewTitle: string; level: string }[] {
  if (f.taskType === "writing") return f.availableWritingTasks;
  if (f.taskType === "conversation") return f.availableConversations;
  return f.availableUnseens;
}

function audienceText(f: AssignTaskForm): string {
  if (f.targetType === "all") return `כל התלמידים שלי (${f.students.length})`;
  if (f.targetType === "students") return `${f.selectedStudentIds.length} תלמידים שבחרתם`;
  if (!f.selectedClass) return "—";
  const group = f.selectedGroup && f.selectedGroup !== "all" ? ` · הקבצה ${f.selectedGroup}` : f.selectedGroup === "all" ? " · כל ההקבצות" : "";
  const some = f.classTargetScope === "custom" ? ` · ${f.selectedStudentIds.length} תלמידים` : "";
  return `כיתה ${f.selectedClass}${group}${some}`;
}

function stepsFor(f: AssignTaskForm): AssignStep[] {
  const steps: AssignStep[] = ["type", "grade"];
  if (f.taskType === "vocab") steps.push("vocabSource", "vocabPick", "vocabWords");
  else if (f.taskType === "grammar") steps.push("grammarTopics", "grammarOptions");
  else {
    steps.push("level", "choiceMode");
    if (f.selectionMode === "specific") steps.push("task");
  }
  steps.push("audience");
  if (f.targetType === "class") {
    steps.push("class", "scope");
    if (f.classTargetScope === "custom") steps.push("students");
  } else if (f.targetType === "students") {
    steps.push("students");
  }
  steps.push("extras", "review");
  return steps;
}

function stepProblem(step: AssignStep, f: AssignTaskForm): string | null {
  switch (step) {
    case "task":
      return taskPool(f).some((t) => t.id === f.selectedTaskId) ? null : "בחרו משימה מהרשימה";
    case "vocabWords":
    case "grammarTopics":
      return f.contentProblem();
    case "class":
      if (!f.selectedClass) return "בחרו כיתה";
      return f.selectedGroup ? null : "בחרו הקבצה";
    case "students":
      return f.selectedStudentIds.length ? null : "בחרו לפחות תלמיד/ה אחד/ת";
    default:
      return null;
  }
}

function stepText(step: AssignStep, f: AssignTaskForm): { title: string; helper: string } {
  switch (step) {
    case "type":
      return { title: "איזו משימה תרצו לתת?", helper: "בחרו סוג אחד. את התוכן תבחרו בשלבים הבאים." };
    case "grade":
      return {
        title: "לאיזו שכבה?",
        helper: "התוכן יתאים לאוצר המילים של ספר הלימוד. לא בטוחים? השאירו \"כל תלמיד/ה לפי הכיתה\".",
      };
    case "level":
      return { title: "באיזו רמה?", helper: "\"כל הרמות\" מציג משימות מכל הרמות." };
    case "choiceMode":
      return { title: "מי בוחר את הנושא?", helper: "אתם בוחרים משימה אחת לכולם, או שכל תלמיד/ה בוחר/ת בעצמו/ה." };
    case "task":
      return {
        title: f.taskType === "writing" ? "איזו משימת כתיבה?" : f.taskType === "conversation" ? "איזו שיחה?" : "איזה קטע קריאה?",
        helper: "לחצו על משימה כדי לבחור אותה. אפשר לחפש לפי שם.",
      };
    case "vocabSource":
      return { title: "מאיפה המילים?", helper: "ממאגר מילים שהכנתם, או מיחידה בספר הלימוד." };
    case "vocabPick":
      return {
        title: f.vocabSourceMode === "custom" ? "איזה מאגר מילים?" : "איזו יחידה בספר?",
        helper: "לחיצה בוחרת את כל המילים. בשלב הבא אפשר להוסיף ולהוריד מילים.",
      };
    case "vocabWords":
      return { title: "אלה המילים במשימה", helper: "אפשר להוריד מילה (✕), לחפש ולהוסיף מילים, ולתת שם למשימה." };
    case "grammarTopics":
      return { title: "אילו נושאי דקדוק?", helper: "אפשר לבחור כמה נושאים לחזרה משולבת." };
    case "grammarOptions":
      return { title: "רמה, סוגי תרגילים וכמות", helper: "אפשר להשאיר הכול כמו שהוא וללחוץ \"הבא\"." };
    case "audience":
      return { title: "מי יקבל את המשימה?", helper: "כיתה שלמה, תלמידים מסוימים, או כל התלמידים שלכם." };
    case "class":
      return { title: "איזו כיתה והקבצה?", helper: "בחרו כיתה, ואז הקבצה." };
    case "scope":
      return { title: "כל ההקבצה, או רק חלק מהתלמידים?", helper: "ברוב המקרים – כל ההקבצה." };
    case "students":
      return { title: "אילו תלמידים?", helper: "סמנו את התלמידים שיקבלו את המשימה." };
    case "extras":
      return { title: "עוד משהו? (לא חובה)", helper: "אפשר לדלג – פשוט לחצו \"הבא\"." };
    case "review":
      return { title: "הכול מוכן לשליחה", helper: "בדקו את הפרטים. אפשר לשנות כל שורה לפני השליחה." };
  }
}

function summaryLines(f: AssignTaskForm): SummaryLine<AssignStep>[] {
  const lines: SummaryLine<AssignStep>[] = [
    { step: "type", label: "סוג", value: TYPE_LABEL[f.taskType] },
    { step: "grade", label: "שכבה", value: gradeText(f.selectedGrade) },
  ];
  if (f.taskType === "vocab") {
    lines.push({ step: "vocabWords", label: "מילים", value: `${f.selectedVocabWords.length} מילים` });
  } else if (f.taskType === "grammar") {
    const titles = f.grammarTopicIds
      .map((id) => GRAMMAR_TOPICS.find((t) => t.id === id)?.titleHe)
      .filter(Boolean)
      .join(", ");
    lines.push({ step: "grammarTopics", label: "נושאים", value: titles || "—" });
    lines.push({
      step: "grammarOptions",
      label: "רמה",
      value: `${f.selectedLevel === "all" ? "לפי רמת התלמיד" : levelText(f.selectedLevel)}${f.grammarItemCount ? ` · ${f.grammarItemCount} תרגילים` : ""}`,
    });
  } else {
    lines.push({ step: "level", label: "רמה", value: levelText(f.selectedLevel) });
    if (f.selectionMode === "specific") {
      const t = taskPool(f).find((x) => x.id === f.selectedTaskId);
      lines.push({ step: "task", label: "משימה", value: t ? `${t.hebrewTitle} – ${t.title}` : "—" });
    } else {
      lines.push({ step: "choiceMode", label: "משימה", value: "התלמידים בוחרים בעצמם" });
    }
  }
  lines.push({ step: "audience", label: "למי", value: audienceText(f) });
  if (f.dueDate) lines.push({ step: "extras", label: "הגשה עד", value: formatDate(f.dueDate) });
  return lines;
}

// ── Steps ─────────────────────────────────────────────────────────────

function TypeStep({ f }: { f: AssignTaskForm }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {TYPE_OPTIONS.map((o) => (
        <ChoiceCard
          key={o.type}
          selected={f.taskType === o.type}
          onClick={() => f.handleTypeChange(o.type)}
          icon={o.icon}
          title={o.title}
          subtitle={o.subtitle}
        />
      ))}
    </div>
  );
}

function GradeStep({ f }: { f: AssignTaskForm }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["all", ...CLASS_GRADES] as const).map((g) => (
        <ChoiceCard
          key={g}
          selected={f.selectedGrade === g}
          onClick={() => f.handleGradeChange(g)}
          title={<span className="text-lg">{gradeText(g)}</span>}
          subtitle={g === "all" ? "כל אחד לפי השכבה שלו" : GRADE_LABELS[g].en}
        />
      ))}
    </div>
  );
}

function LevelStep({ f }: { f: AssignTaskForm }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {LEVEL_OPTIONS.map((o) => (
        <ChoiceCard
          key={o.id}
          selected={f.selectedLevel === o.id}
          onClick={() => f.handleLevelChange(o.id)}
          title={<span className="text-lg">{o.title}</span>}
          subtitle={o.subtitle}
        />
      ))}
    </div>
  );
}

function ChoiceModeStep({ f }: { f: AssignTaskForm }) {
  const what = f.taskType === "writing" ? "נושא החיבור" : f.taskType === "conversation" ? "השיחה" : "קטע הקריאה";
  return (
    <div className="grid gap-3">
      <ChoiceCard
        selected={f.selectionMode === "specific"}
        onClick={() => f.setSelectionMode("specific")}
        icon="👩‍🏫"
        title={`אני בוחר/ת את ${what}`}
        subtitle="כל התלמידים יקבלו את אותה משימה"
      />
      <ChoiceCard
        selected={f.selectionMode === "free_choice"}
        onClick={() => f.setSelectionMode("free_choice")}
        icon="🎒"
        title="כל תלמיד/ה בוחר/ת בעצמו/ה"
        subtitle={f.selectedLevel !== "all" ? `מתוך המאגר ב${levelText(f.selectedLevel)}, או בעזרת AI` : "מתוך המאגר, או בעזרת AI"}
      />
    </div>
  );
}

function TaskStep({ f }: { f: AssignTaskForm }) {
  const [query, setQuery] = useState("");
  const pool = taskPool(f);
  const q = query.trim().toLowerCase();
  const shown = q ? pool.filter((t) => t.title.toLowerCase().includes(q) || t.hebrewTitle.includes(q)) : pool;
  if (!pool.length) {
    return (
      <p className="rounded-xl bg-warning/10 p-4 text-base text-foreground">
        אין משימות בשכבה וברמה שבחרתם. חזרו אחורה ובחרו רמה אחרת או &quot;כל הרמות&quot;.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-3 right-3 size-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש לפי שם…"
          className="h-12 pr-10 text-base"
        />
      </div>
      <p className="text-sm text-muted-foreground">{shown.length} משימות</p>
      <div className="grid max-h-[50vh] gap-2 overflow-y-auto p-0.5 sm:grid-cols-2">
        {shown.map((t) => (
          <ChoiceCard
            key={t.id}
            className="p-3"
            selected={f.selectedTaskId === t.id}
            onClick={() => f.setSelectedTaskId(t.id)}
            title={t.hebrewTitle}
            subtitle={
              <span dir="ltr">
                {t.title} · {t.level}
              </span>
            }
          />
        ))}
      </div>
    </div>
  );
}

function VocabSourceStep({ f }: { f: AssignTaskForm }) {
  return (
    <div className="grid gap-3">
      <ChoiceCard
        selected={f.vocabSourceMode === "ministry"}
        onClick={() => f.setVocabSourceMode("ministry")}
        icon="📚"
        title="יחידה מספר הלימוד"
        subtitle={`המילים של ${GRADE_LABELS[f.vocabGrade].he}, לפי יחידות`}
      />
      <ChoiceCard
        selected={f.vocabSourceMode === "custom"}
        onClick={() => f.setVocabSourceMode("custom")}
        icon="🗂️"
        title="מאגר מילים שהכנתי"
        subtitle={f.effectiveCustomBanks.length ? `יש לכם ${f.effectiveCustomBanks.length} מאגרים` : "עדיין אין לכם מאגרים"}
      />
    </div>
  );
}

function VocabPickStep({ f }: { f: AssignTaskForm }) {
  const [picked, setPicked] = useState<string | null>(null);
  if (f.vocabSourceMode === "custom") {
    if (!f.effectiveCustomBanks.length) {
      return (
        <p className="rounded-xl bg-muted/50 p-4 text-base text-foreground">
          עדיין לא יצרתם מאגרי מילים. חזרו אחורה ובחרו &quot;יחידה מספר הלימוד&quot;, או לחצו &quot;הבא&quot; ובחרו מילים בעצמכם.
        </p>
      );
    }
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {f.effectiveCustomBanks.map((b) => (
          <ChoiceCard
            key={b.id}
            className="p-3"
            selected={picked === b.id}
            onClick={() => {
              f.applyCustomBank(b);
              setPicked(b.id);
            }}
            title={b.name}
            subtitle={`${b.words.length} מילים`}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {gradeUnits(f.vocabGrade).map((u) => (
        <ChoiceCard
          key={u}
          className="p-3"
          selected={picked === `u${u}`}
          onClick={() => {
            f.applyVocabPreset(`u${u}`);
            setPicked(`u${u}`);
          }}
          title={`יחידה ${u}`}
          subtitle={`${curriculumWords(f.vocabGrade, u).length} מילים`}
        />
      ))}
    </div>
  );
}

function GrammarTopicsStep({ f }: { f: AssignTaskForm }) {
  const set = (ids: string[]) => {
    f.setGrammarTopicIds(ids);
    f.setSelectedTaskId(ids[0] ?? "");
  };
  return (
    <div className="space-y-4">
      {f.grammarTopicIds.length > 0 && <p className="text-sm font-semibold text-primary">נבחרו {f.grammarTopicIds.length} נושאים</p>}
      {GRAMMAR_GROUPS.map((g) => {
        const topics = GRAMMAR_TOPICS.filter((t) => t.group === g.id);
        if (!topics.length) return null;
        return (
          <div key={g.id} className="space-y-2">
            <SectionLabel>{g.titleHe}</SectionLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {topics.map((t) => (
                <ChoiceCard
                  key={t.id}
                  multi
                  className="p-3"
                  selected={f.grammarTopicIds.includes(t.id)}
                  onClick={() => set(toggle(f.grammarTopicIds, t.id))}
                  title={<span dir="ltr">{t.title}</span>}
                  subtitle={t.titleHe}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GrammarOptionsStep({ f }: { f: AssignTaskForm }) {
  const usedTypes = ALL_GRAMMAR_TYPES.filter((t) => GRAMMAR_ITEMS.some((i) => i.type === t && f.grammarTopicIds.includes(i.topicId)));
  const levels: { id: "all" | ExerciseLevel; title: string }[] = [
    { id: "all", title: "לפי רמת התלמיד" },
    { id: "Level 1", title: "רמה 1" },
    { id: "Level 2", title: "רמה 2" },
    { id: "Level 3", title: "רמה 3" },
  ];
  return (
    <div className="space-y-5">
      <SectionLabel>רמה</SectionLabel>
      <div className="grid gap-2 sm:grid-cols-2">
        {levels.map((l) => (
          <ChoiceCard key={l.id} className="p-3" selected={f.selectedLevel === l.id} onClick={() => f.setSelectedLevel(l.id)} title={l.title} />
        ))}
      </div>

      {usedTypes.length > 1 && (
        <>
          <SectionLabel>סוגי תרגילים (בלי בחירה – כל הסוגים)</SectionLabel>
          <div className="grid gap-2 sm:grid-cols-2">
            {usedTypes.map((t) => (
              <ChoiceCard
                key={t}
                multi
                className="p-3"
                selected={f.grammarTypes.includes(t)}
                onClick={() => f.setGrammarTypes(toggle(f.grammarTypes, t))}
                title={EXERCISE_TYPE_LABEL[t].he}
                subtitle={EXERCISE_TYPE_LABEL[t].descHe}
              />
            ))}
          </div>
        </>
      )}

      <ToggleRow
        checked={f.grammarItemCount !== null}
        onChange={(on) => f.setGrammarItemCount(on ? 10 : null)}
        title="להגביל את מספר התרגילים?"
        description="בלי הגבלה – התלמידים יתרגלו את כל התרגילים בנושאים שבחרתם."
      />
      {f.grammarItemCount !== null && (
        <BigCounter value={f.grammarItemCount} min={3} max={60} quick={[5, 10, 15, 20, 30]} unit="תרגילים" onChange={f.setGrammarItemCount} />
      )}
    </div>
  );
}

function AudienceStep({ f }: { f: AssignTaskForm }) {
  return (
    <div className="grid gap-3">
      <ChoiceCard
        selected={f.targetType === "class"}
        onClick={() => f.setTargetType("class")}
        icon="🏫"
        title="כיתה והקבצה"
        subtitle="למשל: כיתה ח׳2, הקבצה א1"
      />
      <ChoiceCard
        selected={f.targetType === "students"}
        onClick={() => f.setTargetType("students")}
        icon="🙋"
        title="תלמידים מסוימים"
        subtitle="בוחרים תלמידים מתוך רשימה"
      />
      <ChoiceCard
        selected={f.targetType === "all"}
        onClick={() => f.setTargetType("all")}
        icon="👥"
        title="כל התלמידים שלי"
        subtitle={`${f.students.length} תלמידים`}
      />
    </div>
  );
}

function ClassStep({ f }: { f: AssignTaskForm }) {
  return (
    <div className="space-y-5">
      <SectionLabel>כיתה</SectionLabel>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {f.classList.map((cls) => (
          <ChoiceCard
            key={cls}
            className="p-3"
            selected={f.selectedClass === cls}
            onClick={() => f.setSelectedClass(cls)}
            title={<span className="text-lg">{cls}</span>}
          />
        ))}
      </div>
      {f.selectedClass && (
        <>
          <SectionLabel>הקבצה באנגלית</SectionLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GROUPS.map((g) => (
              <ChoiceCard
                key={g}
                className="p-3"
                selected={f.selectedGroup === g}
                onClick={() => f.setSelectedGroup(g)}
                title={<span className="text-lg">{g}</span>}
              />
            ))}
            <ChoiceCard
              className="p-3"
              selected={f.selectedGroup === "all"}
              onClick={() => f.setSelectedGroup("all")}
              title="כל ההקבצות"
            />
          </div>
        </>
      )}
    </div>
  );
}

function ScopeStep({ f }: { f: AssignTaskForm }) {
  return (
    <div className="grid gap-3">
      <ChoiceCard
        selected={f.classTargetScope === "all"}
        onClick={() => {
          f.setClassTargetScope("all");
          f.setSelectedStudentIds([]);
        }}
        icon="👥"
        title="כל התלמידים בהקבצה"
        subtitle={`${f.classStudentsList.length} תלמידים`}
      />
      <ChoiceCard
        selected={f.classTargetScope === "custom"}
        onClick={() => f.setClassTargetScope("custom")}
        icon="✅"
        title="רק חלק מהתלמידים"
        subtitle="בשלב הבא תסמנו את התלמידים"
      />
    </div>
  );
}

function StudentsStep({ f }: { f: AssignTaskForm }) {
  const inClass = f.targetType === "class";
  const list: StudentProfile[] = inClass ? f.classStudentsList : f.filteredIndividualStudents;
  return (
    <div className="space-y-3">
      {!inClass && (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-3 right-3 size-5 text-muted-foreground" />
            <Input
              value={f.studentSearchQuery}
              onChange={(e) => f.setStudentSearchQuery(e.target.value)}
              placeholder="חיפוש לפי שם…"
              className="h-12 pr-10 text-base"
            />
          </div>
          <select
            value={f.studentFilterClass}
            onChange={(e) => f.setStudentFilterClass(e.target.value)}
            className="h-12 w-full cursor-pointer rounded-lg border border-input bg-background px-3 text-base"
          >
            <option value="all">כל הכיתות</option>
            {f.classList.map((cls) => (
              <option key={cls} value={cls}>
                כיתה {cls}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-semibold text-primary">נבחרו {f.selectedStudentIds.length}</span>
        <span className="flex-1" />
        <Button type="button" variant="outline" size="sm" onClick={() => f.handleSelectAllFilteredStudents(list)}>
          לסמן את כולם ({list.length})
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => f.handleDeselectAllFilteredStudents(list)}>
          לנקות
        </Button>
      </div>
      {list.length === 0 ? (
        <p className="rounded-xl bg-muted/50 p-4 text-center text-base text-muted-foreground">לא נמצאו תלמידים.</p>
      ) : (
        <div className="grid max-h-[45vh] gap-2 overflow-y-auto p-0.5 sm:grid-cols-2">
          {list.map((st) => (
            <ChoiceCard
              key={st.id}
              multi
              className="p-3"
              selected={f.selectedStudentIds.includes(st.id)}
              onClick={() => f.handleStudentToggle(st.id)}
              title={<span dir="ltr">{st.name}</span>}
              subtitle={[st.fullClass, st.group].filter(Boolean).join(" · ") || undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ExtrasStep({ f }: { f: AssignTaskForm }) {
  return (
    <div className="space-y-5">
      <label className="block space-y-2">
        <span className="text-base font-semibold text-foreground">הנחיות לתלמידים</span>
        <Textarea
          value={f.instructions}
          onChange={(e) => f.setInstructions(e.target.value)}
          placeholder="למשל: נא לכתוב לפחות 60 מילים ולהשתמש במילות הקישור שלמדנו השבוע."
          className="min-h-24 text-base"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-base font-semibold text-foreground">עד מתי להגיש?</span>
        <Input type="date" value={f.dueDate} onChange={(e) => f.setDueDate(e.target.value)} className="h-12 max-w-60 cursor-pointer text-base" />
      </label>
      <ToggleRow
        checked={f.isShared}
        onChange={f.setIsShared}
        title="לשתף את המשימה עם מורים אחרים"
        description="מורים עמיתים יוכלו לראות את המשימה במאגר המשותף ולתת אותה לכיתות שלהם."
      />
    </div>
  );
}

function ReviewStep({ f, goto }: { f: AssignTaskForm; goto: (s: AssignStep) => void }) {
  const { hebrewTitle } = f.assignmentTitles();
  return (
    <div className="space-y-4">
      <p className="rounded-2xl bg-primary/10 p-4 text-lg text-foreground">
        <b>{TYPE_LABEL[f.taskType]}</b>: &quot;{hebrewTitle}&quot;
        <br />
        יישלח ל{audienceText(f)} – <b>{f.matchingStudentsCount} תלמידים</b>
        {f.dueDate && <>, להגשה עד {formatDate(f.dueDate)}</>}.
      </p>
      <WizardSummary title="הפרטים" lines={summaryLines(f)} current="review" onGoto={goto} />
    </div>
  );
}

// ── Wizard ────────────────────────────────────────────────────────────

export function AssignTaskWizard({ f, startAt = "type" }: { f: AssignTaskForm; startAt?: AssignStep }) {
  const steps = useMemo(
    () => stepsFor(f),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the list depends only on these answers
    [f.taskType, f.selectionMode, f.targetType, f.classTargetScope]
  );
  const w = useWizardSteps<AssignStep>(steps, (s) => stepProblem(s, f), startAt);
  const { title, helper } = stepText(w.step, f);
  const isReview = w.step === "review";
  const nextLabel = steps[w.index + 1] === "review" ? "לסיכום" : "הבא";

  const body = (() => {
    switch (w.step) {
      case "type":
        return <TypeStep f={f} />;
      case "grade":
        return <GradeStep f={f} />;
      case "level":
        return <LevelStep f={f} />;
      case "choiceMode":
        return <ChoiceModeStep f={f} />;
      case "task":
        return <TaskStep f={f} />;
      case "vocabSource":
        return <VocabSourceStep f={f} />;
      case "vocabPick":
        return <VocabPickStep f={f} />;
      case "vocabWords":
        return <VocabWordBuilder f={f} showSource={false} />;
      case "grammarTopics":
        return <GrammarTopicsStep f={f} />;
      case "grammarOptions":
        return <GrammarOptionsStep f={f} />;
      case "audience":
        return <AudienceStep f={f} />;
      case "class":
        return <ClassStep f={f} />;
      case "scope":
        return <ScopeStep f={f} />;
      case "students":
        return <StudentsStep f={f} />;
      case "extras":
        return <ExtrasStep f={f} />;
      case "review":
        return <ReviewStep f={f} goto={w.goto} />;
    }
  })();

  return (
    <WizardLayout
      topRef={w.topRef}
      compact
      index={w.index}
      total={w.total}
      title={title}
      helper={helper}
      nav={
        <>
          {f.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-base font-medium text-destructive">
              <AlertCircle className="size-5 shrink-0" />
              <span>{f.error}</span>
            </div>
          )}
          <WizardNav
            showBack={!w.isFirst}
            onBack={w.back}
            problem={w.problem}
            nextLabel={nextLabel}
            onNext={w.next}
            finalAction={
              isReview ? (
                <Button type="button" className="h-14 gap-2 px-8 text-lg" onClick={() => f.submit()} disabled={f.isSubmitting}>
                  <Send className="size-5" />
                  {f.isSubmitting ? "שולחים…" : "הקצאת המשימה"}
                </Button>
              ) : undefined
            }
          />
        </>
      }
      summary={
        isReview ? null : (
          <WizardSummary title="המשימה עד עכשיו" lines={summaryLines(f)} current={w.step} onGoto={w.goto} />
        )
      }
    >
      {body}
    </WizardLayout>
  );
}
