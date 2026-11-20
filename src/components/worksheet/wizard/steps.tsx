"use client";

import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { GRADE_LABELS, LEVEL_DESCRIPTION_HE, LEVEL_NAME_HE, LEVELS, CLASS_GRADES, type LevelNumber } from "@/lib/levels";
import { GRAMMAR_GROUPS } from "@/data/grammar";
import { gradeUnits } from "@/data/vocab/cards";
import { CONVERSATION_CATEGORIES } from "@/data/conversations";
import { grammarCapacity, grammarTopicsFor, grammarTypesFor } from "@/lib/worksheet/grammar";
import { vocabPool } from "@/lib/worksheet/vocab";
import { questionCapacity, scenariosFor, storiesFor, writingTasksFor } from "@/lib/worksheet/reading";
import {
  BOOK_NAME,
  GRAMMAR_TYPE_LABEL,
  PART_LABEL,
  READING_KIND_LABEL,
  VOCAB_KIND_LABEL,
} from "@/lib/worksheet/labels";
import { CONVERSATION_KINDS, PART_ORDER, READING_KINDS, VOCAB_KINDS, type PartKind, type WorksheetSettings } from "@/lib/worksheet/types";
import type { GrammarExerciseType } from "@/types/grammar";
import type { WritingTask } from "@/types/writing";
import type { StepId, WorksheetWizard } from "@/components/worksheet/wizard/use-worksheet-wizard";
import { BigCounter, ChoiceCard, SectionLabel, ToggleRow } from "@/components/shared/wizard/wizard-ui";

export const PART_ICON: Record<PartKind, string> = {
  vocab: "🔤",
  grammar: "🧩",
  reading: "📖",
  conversation: "💬",
  writing: "✏️",
};

const toggle = <T,>(list: T[], x: T): T[] => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);

/** The question at the top of each step, and a short helper line. */
export function stepText(step: StepId, s: WorksheetSettings): { title: string; helper: string } {
  switch (step) {
    case "grade":
      return { title: "לאיזו שכבה הדף?", helper: "המילים והתרגילים יתאימו לאוצר המילים של השכבה." };
    case "level":
      return { title: "באיזו רמה?", helper: "רמה 1 היא הבסיסית ביותר. אפשר להכין דף נפרד לכל רמה בכיתה." };
    case "parts":
      return { title: "מה יהיה בדף?", helper: "אפשר לבחור כמה חלקים – כל חלק יופיע בדף בנפרד (חלק A, חלק B…)." };
    case "topics-vocab":
      return { title: "מאילו יחידות בספר?", helper: `הספר של השכבה: ${BOOK_NAME[s.grade]}. אפשר לבחור כמה יחידות, או את כל הספר.` };
    case "amount-vocab":
      return { title: "כמה מילים, ואיזה תרגילים?", helper: "המילים יתחלקו בין סוגי התרגילים שתבחרו." };
    case "topics-grammar":
      return { title: "אילו נושאי דקדוק?", helper: "אפשר לבחור כמה נושאים. מוצגים רק נושאים שנלמדים בשכבה הזו." };
    case "amount-grammar":
      return { title: "כמה שאלות דקדוק, ואיזה סוגים?", helper: "השאלות יתחלקו שווה בשווה בין הנושאים שבחרתם." };
    case "topics-reading":
      return { title: "איזה קטע קריאה?", helper: "בחרו קטע, או תנו לנו לבחור בשבילכם." };
    case "amount-reading":
      return { title: "כמה שאלות על הקטע, ואיזה סוגים?", helper: "לכל קטע יש עד 10 שאלות." };
    case "topics-conversation":
      return { title: "איזו שיחה?", helper: "בחרו שיחה, או תנו לנו לבחור בשבילכם." };
    case "amount-conversation":
      return { title: "כמה שאלות על השיחה, ואיזה סוגים?", helper: "לכל שיחה יש עד 10 שאלות." };
    case "topics-writing":
      return { title: "איזו משימת כתיבה?", helper: "בחרו משימה, או תנו לנו לבחור בשבילכם." };
    case "amount-writing":
      return { title: "מה לצרף למשימת הכתיבה?", helper: "עזרים שיופיעו בדף לצד המשימה." };
    case "layout":
      return { title: "איך הדף ייראה?", helper: "אפשר להשאיר הכול כמו שהוא וללחוץ \"הבא\"." };
    case "preview":
      return { title: "הדף מוכן!", helper: "בדקו את הדף. אפשר להחליף או למחוק כל שאלה, ואז להדפיס או לשלוח להדפסה." };
  }
}

// ── Steps ─────────────────────────────────────────────────────────────

function GradeStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {CLASS_GRADES.map((g) => (
        <ChoiceCard
          key={g}
          selected={settings.grade === g}
          onClick={() => w.dispatch({ type: "grade", grade: g })}
          title={<span className="text-xl">{GRADE_LABELS[g].he}</span>}
          subtitle={`ספר: ${BOOK_NAME[g]}`}
        />
      ))}
    </div>
  );
}

function LevelStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {LEVELS.map((l: LevelNumber) => (
        <ChoiceCard
          key={l}
          selected={settings.level === l}
          onClick={() => w.dispatch({ type: "level", level: l })}
          title={<span className="text-xl">{LEVEL_NAME_HE[l]}</span>}
          subtitle={LEVEL_DESCRIPTION_HE[l]}
        />
      ))}
    </div>
  );
}

function PartsStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PART_ORDER.map((p) => (
        <ChoiceCard
          key={p}
          multi
          selected={settings.parts.includes(p)}
          onClick={() => w.dispatch({ type: "togglePart", part: p })}
          icon={PART_ICON[p]}
          title={PART_LABEL[p].he}
          subtitle={PART_LABEL[p].exampleHe}
        />
      ))}
    </div>
  );
}

function VocabTopicsStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  const units = gradeUnits(settings.grade);
  const chosen = settings.vocab.units;
  const set = (u: number[]) => w.dispatch({ type: "patchPart", part: "vocab", patch: { units: u } });
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <ChoiceCard
        multi
        selected={chosen.length === 0}
        onClick={() => set([])}
        title="כל הספר"
        subtitle={`${vocabPool(settings.grade, []).length} מילים`}
      />
      {units.map((u) => (
        <ChoiceCard
          key={u}
          multi
          selected={chosen.includes(u)}
          onClick={() => set(toggle(chosen, u))}
          title={`יחידה ${u}`}
          subtitle={`${vocabPool(settings.grade, [u]).length} מילים`}
        />
      ))}
    </div>
  );
}

function VocabAmountStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  const cfg = settings.vocab;
  const max = Math.min(40, vocabPool(settings.grade, cfg.units).length);
  return (
    <div className="space-y-5">
      <BigCounter
        value={cfg.count}
        max={max}
        unit="מילים"
        onChange={(count) => w.dispatch({ type: "patchPart", part: "vocab", patch: { count } })}
      />
      <SectionLabel>איזה תרגילים? (אפשר כמה)</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        {VOCAB_KINDS.map((k) => (
          <ChoiceCard
            key={k}
            multi
            selected={cfg.types.includes(k)}
            onClick={() => w.dispatch({ type: "patchPart", part: "vocab", patch: { types: VOCAB_KINDS.filter((x) => toggle(cfg.types, k).includes(x)) } })}
            title={VOCAB_KIND_LABEL[k].he}
            subtitle={<span dir="auto">{VOCAB_KIND_LABEL[k].exampleHe}</span>}
          />
        ))}
      </div>
    </div>
  );
}

function GrammarTopicsStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  const topics = useMemo(() => grammarTopicsFor(settings.grade, settings.level), [settings.grade, settings.level]);
  const chosen = settings.grammar.topicIds;
  return (
    <div className="space-y-4">
      {chosen.length > 0 && <p className="text-sm font-semibold text-primary">נבחרו {chosen.length} נושאים</p>}
      {GRAMMAR_GROUPS.map((g) => {
        const list = topics.filter((t) => t.group === g.id);
        if (!list.length) return null;
        return (
          <div key={g.id} className="space-y-2">
            <SectionLabel>{g.titleHe}</SectionLabel>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((t) => (
                <ChoiceCard
                  key={t.id}
                  multi
                  className="p-3"
                  selected={chosen.includes(t.id)}
                  onClick={() => w.dispatch({ type: "patchPart", part: "grammar", patch: { topicIds: toggle(chosen, t.id) } })}
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

function GrammarAmountStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  const cfg = settings.grammar;
  const available = grammarTypesFor(cfg.topicIds, settings.grade, settings.level);
  const selected: GrammarExerciseType[] = cfg.types.length ? cfg.types : available;
  const max = Math.max(1, grammarCapacity(cfg, settings.grade, settings.level));
  const setTypes = (next: GrammarExerciseType[]) => {
    if (!next.length) return; // keep at least one
    w.dispatch({ type: "patchPart", part: "grammar", patch: { types: next.length === available.length ? [] : next } });
  };
  return (
    <div className="space-y-5">
      <BigCounter
        value={cfg.count}
        max={max}
        quick={[5, 10, 15, 20, 30]}
        unit="שאלות"
        onChange={(count) => w.dispatch({ type: "patchPart", part: "grammar", patch: { count } })}
      />
      <SectionLabel>איזה סוגי תרגילים? (אפשר כמה)</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        {available.map((t) => (
          <ChoiceCard
            key={t}
            multi
            className="p-3"
            selected={selected.includes(t)}
            onClick={() => setTypes(available.filter((x) => toggle(selected, t).includes(x)))}
            title={GRAMMAR_TYPE_LABEL[t].he}
            subtitle={<span dir="auto">{GRAMMAR_TYPE_LABEL[t].exampleHe}</span>}
          />
        ))}
      </div>
    </div>
  );
}

function PickForMe({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return <ChoiceCard selected={selected} onClick={onClick} icon="🎲" title="תבחרו בשבילי" subtitle="נבחר אחד מתאים באקראי" />;
}

function ReadingTopicsStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  const stories = storiesFor(settings.grade, settings.level);
  const set = (storyId: string | null) => w.dispatch({ type: "patchPart", part: "reading", patch: { storyId } });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <PickForMe selected={settings.reading.storyId === null} onClick={() => set(null)} />
      {stories.map((s) => (
        <ChoiceCard
          key={s.id}
          selected={settings.reading.storyId === s.id}
          onClick={() => set(s.id)}
          title={<span dir="ltr">{s.title}</span>}
          subtitle={`${s.hebrewTitle} · ${s.paragraphs.length} פסקאות`}
        />
      ))}
    </div>
  );
}

function ConversationTopicsStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  const list = scenariosFor(settings.grade, settings.level);
  const set = (scenarioId: string | null) => w.dispatch({ type: "patchPart", part: "conversation", patch: { scenarioId } });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <PickForMe selected={settings.conversation.scenarioId === null} onClick={() => set(null)} />
      {list.map((s) => (
        <ChoiceCard
          key={s.id}
          selected={settings.conversation.scenarioId === s.id}
          onClick={() => set(s.id)}
          icon={CONVERSATION_CATEGORIES.find((c) => c.id === s.category)?.emoji}
          title={<span dir="ltr">{s.title}</span>}
          subtitle={s.hebrewTitle}
        />
      ))}
    </div>
  );
}

const WRITING_CATEGORY_HE: Record<WritingTask["category"], string> = {
  letter: "מכתב",
  opinion: "הבעת דעה",
  description: "תיאור",
  creative: "כתיבה יוצרת",
};

function WritingTopicsStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  const tasks = writingTasksFor(settings.grade, settings.level);
  const set = (taskId: string | null) => w.dispatch({ type: "patchPart", part: "writing", patch: { taskId } });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <PickForMe selected={settings.writing.taskId === null} onClick={() => set(null)} />
      {tasks.map((t) => (
        <ChoiceCard
          key={t.id}
          selected={settings.writing.taskId === t.id}
          onClick={() => set(t.id)}
          icon={t.emoji}
          title={<span dir="ltr">{t.title}</span>}
          subtitle={`${t.hebrewTitle} · ${WRITING_CATEGORY_HE[t.category]}`}
        />
      ))}
    </div>
  );
}

function TextAmountStep({ w, part }: { w: WorksheetWizard; part: "reading" | "conversation" }) {
  const { settings } = w.state;
  const cfg = settings[part];
  const kinds = part === "reading" ? READING_KINDS : CONVERSATION_KINDS;
  const chosenId = part === "reading" ? settings.reading.storyId : settings.conversation.scenarioId;
  const texts = part === "reading" ? storiesFor(settings.grade, settings.level) : scenariosFor(settings.grade, settings.level);
  const pool = chosenId ? texts.filter((t) => t.id === chosenId) : texts;
  // "Pick for me" may pick any text, so cap at what every text can offer.
  const max = Math.max(1, Math.min(10, ...pool.map((t) => questionCapacity(t.questions, cfg.types))));
  return (
    <div className="space-y-5">
      <BigCounter
        value={cfg.count}
        max={max}
        quick={[3, 5, 8, 10]}
        unit="שאלות"
        onChange={(count) => w.dispatch({ type: "patchPart", part, patch: { count } })}
      />
      <SectionLabel>איזה סוגי שאלות? (אפשר כמה)</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        {kinds.map((k) => (
          <ChoiceCard
            key={k}
            multi
            className="p-3"
            selected={(cfg.types as string[]).includes(k)}
            onClick={() =>
              w.dispatch({
                type: "patchPart",
                part,
                patch: { types: kinds.filter((x) => toggle(cfg.types as string[], k).includes(x)) as typeof cfg.types },
              })
            }
            title={READING_KIND_LABEL[k].he}
          />
        ))}
      </div>
    </div>
  );
}

function WritingAmountStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  const cfg = settings.writing;
  const patch = (p: Partial<typeof cfg>) => w.dispatch({ type: "patchPart", part: "writing", patch: p });
  return (
    <div className="space-y-3">
      <ToggleRow checked={cfg.wordBank} onChange={(v) => patch({ wordBank: v })} title="בנק מילים" description="מילים שימושיות למשימה (עם תרגום כשהעזרה בעברית פעילה)" />
      <ToggleRow checked={cfg.starters} onChange={(v) => patch({ starters: v })} title="פתיחי משפטים" description="משפטים לדוגמה שעוזרים להתחיל לכתוב" />
      {settings.level === 1 && (
        <ToggleRow checked={cfg.guided} onChange={(v) => patch({ guided: v })} title="כתיבה צעד אחר צעד" description="חלוקת המשימה לשלבים קטנים" />
      )}
      <SectionLabel>כמה שורות לכתיבה?</SectionLabel>
      <BigCounter value={cfg.lines} min={4} max={30} quick={[6, 10, 15, 20]} unit="שורות" onChange={(lines) => patch({ lines })} />
    </div>
  );
}

function LayoutStep({ w }: { w: WorksheetWizard }) {
  const { settings } = w.state;
  const l = settings.layout;
  const patch = (p: Partial<typeof l>) => w.dispatch({ type: "layout", patch: p });
  const hasTexts = settings.parts.includes("reading") || settings.parts.includes("conversation");
  return (
    <div className="space-y-3">
      <label className="block space-y-1.5">
        <span className="text-base font-semibold">כותרת הדף (באנגלית)</span>
        <Input
          dir="ltr"
          value={l.title}
          maxLength={80}
          onChange={(e) => patch({ title: e.target.value })}
          className="h-12 text-lg"
          placeholder="English Worksheet"
        />
      </label>
      <ToggleRow checked={l.header} onChange={(v) => patch({ header: v })} title="שורות לשם, כיתה ותאריך" description="בראש הדף" />
      <ToggleRow checked={l.answerKey} onChange={(v) => patch({ answerKey: v })} title="דף תשובות למורה" description="מודפס בעמוד נפרד בסוף (לא נשלח לצילום לתלמידים)" />
      <ToggleRow checked={l.hebrewHelp} onChange={(v) => patch({ hebrewHelp: v })} title="הוראות גם בעברית" description="שורה בעברית מתחת לכל הוראה באנגלית" />
      {hasTexts && (
        <ToggleRow
          checked={l.wordBankHebrew}
          onChange={(v) => patch({ wordBankHebrew: v })}
          title="מילים עם תרגום ליד הקטע"
          description="מסגרת של מילים קשות מהקטע עם תרגום לעברית"
        />
      )}
      <ToggleRow checked={l.easyRead} onChange={(v) => patch({ easyRead: v })} title="דף מותאם (אותיות גדולות)" description="אותיות גדולות יותר ויותר מקום לכתיבה – לתלמידים עם התאמות" />
      <ToggleRow checked={l.versions} onChange={(v) => patch({ versions: v })} title="שתי גרסאות (א׳ וב׳)" description="אותן שאלות בסדר אחר – כדי שתלמידים שיושבים יחד לא יעתיקו" />
    </div>
  );
}

export function StepBody({ w }: { w: WorksheetWizard }) {
  switch (w.state.step) {
    case "grade":
      return <GradeStep w={w} />;
    case "level":
      return <LevelStep w={w} />;
    case "parts":
      return <PartsStep w={w} />;
    case "topics-vocab":
      return <VocabTopicsStep w={w} />;
    case "amount-vocab":
      return <VocabAmountStep w={w} />;
    case "topics-grammar":
      return <GrammarTopicsStep w={w} />;
    case "amount-grammar":
      return <GrammarAmountStep w={w} />;
    case "topics-reading":
      return <ReadingTopicsStep w={w} />;
    case "amount-reading":
      return <TextAmountStep w={w} part="reading" />;
    case "topics-conversation":
      return <ConversationTopicsStep w={w} />;
    case "amount-conversation":
      return <TextAmountStep w={w} part="conversation" />;
    case "topics-writing":
      return <WritingTopicsStep w={w} />;
    case "amount-writing":
      return <WritingAmountStep w={w} />;
    case "layout":
      return <LayoutStep w={w} />;
    case "preview":
      return null;
  }
}

/** One line per answer for the "your worksheet so far" summary. */
export function summaryLines(s: WorksheetSettings): { step: StepId; label: string; value: string }[] {
  const lines: { step: StepId; label: string; value: string }[] = [
    { step: "grade", label: "שכבה", value: GRADE_LABELS[s.grade].he },
    { step: "level", label: "רמה", value: `${LEVEL_NAME_HE[s.level]} – ${LEVEL_DESCRIPTION_HE[s.level]}` },
    { step: "parts", label: "חלקים", value: s.parts.length ? s.parts.map((p) => PART_LABEL[p].he).join(", ") : "—" },
  ];
  for (const p of s.parts) {
    switch (p) {
      case "vocab":
        lines.push({
          step: "topics-vocab",
          label: PART_LABEL.vocab.he,
          value: `${s.vocab.units.length ? `יחידות ${s.vocab.units.join(", ")}` : "כל הספר"} · ${s.vocab.count} מילים`,
        });
        break;
      case "grammar":
        lines.push({ step: "topics-grammar", label: PART_LABEL.grammar.he, value: `${s.grammar.topicIds.length} נושאים · ${s.grammar.count} שאלות` });
        break;
      case "reading": {
        const title = storiesFor(s.grade, s.level).find((x) => x.id === s.reading.storyId)?.title;
        lines.push({ step: "topics-reading", label: PART_LABEL.reading.he, value: `${title ?? "נבחר בשבילכם"} · ${s.reading.count} שאלות` });
        break;
      }
      case "conversation": {
        const title = scenariosFor(s.grade, s.level).find((x) => x.id === s.conversation.scenarioId)?.title;
        lines.push({ step: "topics-conversation", label: PART_LABEL.conversation.he, value: `${title ?? "נבחרה בשבילכם"} · ${s.conversation.count} שאלות` });
        break;
      }
      case "writing": {
        const title = writingTasksFor(s.grade, s.level).find((x) => x.id === s.writing.taskId)?.title;
        lines.push({ step: "topics-writing", label: PART_LABEL.writing.he, value: title ?? "נבחרת בשבילכם" });
        break;
      }
    }
  }
  return lines;
}
