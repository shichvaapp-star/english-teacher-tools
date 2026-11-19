"use client";

import React from "react";
import { RefreshCw, Shuffle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderBody as renderGrammarBody, keyText as grammarKeyText, TASK_LINE as GRAMMAR_TASK_LINE } from "@/components/grammar/grammar-print-sheet";
import { seededShuffle } from "@/components/grammar/exercises/shared";
import { GRADE_LABELS, levelToLabel } from "@/lib/levels";
import { BLANK, cleanWord } from "@/lib/worksheet/vocab";
import {
  CONVERSATION_TASK_LINE,
  GRAMMAR_TASK_LINE_HE,
  OPTION_LETTERS,
  PART_LABEL,
  PART_LETTERS,
  READING_TASK_LINE,
  VOCAB_TASK_LINE,
} from "@/lib/worksheet/labels";
import { makeVersionB } from "@/lib/worksheet/build";
import type { VocabWorksheetItem, WorksheetContent, WorksheetLayout, WorksheetSection } from "@/lib/worksheet/types";
import type { GrammarItem } from "@/types/grammar";
import type { MSUnseenQuestion } from "@/types/unseen";
import type { ConversationQuestion } from "@/types/conversation";

// The printed worksheet. One component serves the on-screen preview (with
// replace/delete buttons), the browser print and the emailed PDF. Paper is
// always white, so like the other print sheets it uses fixed print colours.
//
// Every element marked `data-ws-block` is a unit the PDF maker keeps whole on
// a page; `data-ws-keep-next` keeps a heading with the block after it, and
// `data-ws-break` starts a new page. Blocks are never nested.

export type SheetVersion = "A" | "B";

export interface SheetEditHandlers {
  onReplace: (sectionIndex: number, itemIndex: number) => void;
  onDelete: (sectionIndex: number, itemIndex: number) => void;
  onReshuffle: (sectionIndex: number) => void;
}

interface Ctx {
  layout: WorksheetLayout;
  salt: string;
  edit?: SheetEditHandlers;
}

const MATCH_CHUNK = 8;

const He = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="rtl" lang="he" className={cn("font-hebrew", className)}>
    {children}
  </span>
);

function AnswerLines({ count, easy }: { count: number; easy: boolean }) {
  return (
    <div className="space-y-1 pt-1">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={cn("border-b border-slate-400", easy ? "h-9" : "h-6")} />
      ))}
    </div>
  );
}

function ItemTools({ ctx, s, i, canReplace = true }: { ctx: Ctx; s: number; i: number; canReplace?: boolean }) {
  if (!ctx.edit) return null;
  const { onReplace, onDelete } = ctx.edit;
  return (
    <span className="ws-tools print:hidden ms-2 inline-flex shrink-0 gap-1 align-middle" dir="rtl">
      {canReplace && (
        <button
          type="button"
          onClick={() => onReplace(s, i)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-300 bg-white px-1.5 py-0.5 font-hebrew text-xs text-slate-600 hover:border-slate-500 hover:text-slate-900"
          title="להחליף את השאלה הזו בשאלה אחרת"
        >
          <RefreshCw className="size-3" />
          החלפה
        </button>
      )}
      <button
        type="button"
        onClick={() => onDelete(s, i)}
        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-300 bg-white px-1.5 py-0.5 font-hebrew text-xs text-slate-600 hover:border-red-400 hover:text-red-700"
        title="למחוק את השאלה הזו מהדף"
      >
        <Trash2 className="size-3" />
        מחיקה
      </button>
    </span>
  );
}

function Instruction({ en, he, ctx }: { en: string; he: string; ctx: Ctx }) {
  return (
    <div data-ws-block="" data-ws-keep-next="" className="pt-2 pb-1">
      <p className="font-semibold italic text-slate-700">{en}</p>
      {ctx.layout.hebrewHelp && (
        <p className="text-slate-500" dir="rtl">
          <He>{he}</He>
        </p>
      )}
    </div>
  );
}

/** Splits a list into runs of items that share `groupOf`. */
function runs<T>(items: T[], groupOf: (x: T) => string): { key: string; start: number; items: T[] }[] {
  const out: { key: string; start: number; items: T[] }[] = [];
  items.forEach((item, i) => {
    const key = groupOf(item);
    const last = out[out.length - 1];
    if (last && last.key === key) last.items.push(item);
    else out.push({ key, start: i, items: [item] });
  });
  return out;
}

/** Hebrew column order for a match chunk (also used by the answer key). */
function matchOrder(chunk: VocabWorksheetItem[], salt: string): VocabWorksheetItem[] {
  return seededShuffle(chunk, chunk.map((x) => x.id).join("|") + salt);
}

function chunks<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

// ── Parts ─────────────────────────────────────────────────────────────

function VocabPart({ section, s, ctx }: { section: Extract<WorksheetSection, { kind: "vocab" }>; s: number; ctx: Ctx }) {
  const easy = ctx.layout.easyRead;
  return (
    <>
      {runs(section.items, (x) => x.kind).map((run) => {
        const line = VOCAB_TASK_LINE[run.key as VocabWorksheetItem["kind"]];
        const n = (k: number) => run.start + k + 1;
        if (run.key === "match") {
          return (
            <React.Fragment key={run.start}>
              <Instruction en={line.en} he={line.he} ctx={ctx} />
              {chunks(run.items, MATCH_CHUNK).map((chunk, c) => {
                const rights = matchOrder(chunk, ctx.salt);
                const offset = c * MATCH_CHUNK;
                return (
                  <div key={c} data-ws-block="" className="grid grid-cols-2 gap-x-8 py-2">
                    <ol className="space-y-2">
                      {chunk.map((it, k) => (
                        <li key={it.id} className="flex items-center">
                          <span className="w-7 text-slate-500">{n(offset + k)}.</span>
                          <span className="flex-1">{it.word}</span>
                          <span className="text-slate-400">____</span>
                          <ItemTools ctx={ctx} s={s} i={run.start + offset + k} />
                        </li>
                      ))}
                    </ol>
                    <ol className="space-y-2" dir="rtl">
                      {rights.map((it, k) => (
                        <li key={it.id} className="flex items-center gap-2">
                          <span className="w-6 text-slate-500" dir="ltr">
                            {OPTION_LETTERS[k]}.
                          </span>
                          <He>{it.hebrew}</He>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </React.Fragment>
          );
        }
        if (run.key === "to_hebrew" || run.key === "to_english") {
          return (
            <React.Fragment key={run.start}>
              <Instruction en={line.en} he={line.he} ctx={ctx} />
              <div data-ws-block="" className="grid grid-cols-2 gap-x-8 gap-y-3 py-2">
                {run.items.map((it, k) => (
                  <div key={it.id} className="flex items-end gap-2">
                    <span className="text-slate-500">{n(k)}.</span>
                    {run.key === "to_hebrew" ? <span>{it.word}</span> : <He>{it.hebrew}</He>}
                    <span className="flex-1 border-b border-slate-400 text-slate-500">
                      {run.key === "to_english" && it.hint ? it.hint.charAt(0) : " "}
                    </span>
                    <ItemTools ctx={ctx} s={s} i={run.start + k} />
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        }
        if (run.key === "gap_sentence") {
          const bank = seededShuffle(
            run.items.map((it) => cleanWord(it.word)),
            run.items.map((x) => x.id).join("|") + ctx.salt
          );
          return (
            <React.Fragment key={run.start}>
              <Instruction en={line.en} he={line.he} ctx={ctx} />
              <div data-ws-block="" data-ws-keep-next="" className="py-1">
                <p className="inline-flex flex-wrap gap-x-4 gap-y-1 rounded border border-slate-400 px-3 py-1 font-semibold">
                  {bank.map((w, k) => (
                    <span key={k}>{w}</span>
                  ))}
                </p>
              </div>
              {run.items.map((it, k) => (
                <div key={it.id} data-ws-block="" className={cn("flex items-start", easy ? "py-2" : "py-1")}>
                  <span className="w-7 shrink-0 text-slate-500">{n(k)}.</span>
                  <span className="flex-1">{(it.sentence ?? "").replace(BLANK, "__________")}</span>
                  <ItemTools ctx={ctx} s={s} i={run.start + k} />
                </div>
              ))}
            </React.Fragment>
          );
        }
        // choose_meaning
        return (
          <React.Fragment key={run.start}>
            <Instruction en={line.en} he={line.he} ctx={ctx} />
            {run.items.map((it, k) => (
              <div key={it.id} data-ws-block="" className={cn(easy ? "py-2" : "py-1")}>
                <div className="flex items-start">
                  <span className="w-7 shrink-0 text-slate-500">{n(k)}.</span>
                  <span className="flex-1 font-semibold">{it.word}</span>
                  <ItemTools ctx={ctx} s={s} i={run.start + k} />
                </div>
                <div className="grid grid-cols-4 gap-2 ps-7 pt-1" dir="rtl">
                  {(it.options ?? []).map((o, oi) => (
                    <span key={oi} className="flex items-baseline gap-1">
                      <span className="text-slate-500" dir="ltr">
                        ({OPTION_LETTERS[oi].toLowerCase()})
                      </span>
                      <He>{o}</He>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
}

function GrammarPart({ section, s, ctx }: { section: Extract<WorksheetSection, { kind: "grammar" }>; s: number; ctx: Ctx }) {
  return (
    <>
      {runs(section.items, (x) => x.type).map((run) => (
        <React.Fragment key={run.start}>
          <Instruction en={GRAMMAR_TASK_LINE[run.key as GrammarItem["type"]]} he={GRAMMAR_TASK_LINE_HE[run.key as GrammarItem["type"]]} ctx={ctx} />
          {run.items.map((item, k) => (
            <div key={item.id} data-ws-block="" className={cn("flex items-start", ctx.layout.easyRead ? "py-2.5" : "py-1.5")}>
              <span className="w-7 shrink-0 text-slate-500">{run.start + k + 1}.</span>
              <div className="min-w-0 flex-1">
                {item.context && <p className="italic text-slate-500">{item.context}</p>}
                {renderGrammarBody(item, ctx.salt)}
              </div>
              <ItemTools ctx={ctx} s={s} i={run.start + k} />
            </div>
          ))}
        </React.Fragment>
      ))}
    </>
  );
}

function QuestionBlock({
  q,
  n,
  s,
  i,
  ctx,
}: {
  q: MSUnseenQuestion | ConversationQuestion;
  n: number;
  s: number;
  i: number;
  ctx: Ctx;
}) {
  const choice = !!q.options?.length;
  return (
    <div data-ws-block="" className={cn(ctx.layout.easyRead ? "py-2.5" : "py-1.5")}>
      <div className="flex items-start">
        <span className="w-7 shrink-0 text-slate-500">{n}.</span>
        <p className="flex-1 font-semibold">
          {q.prompt}
          {q.linesHint && <span className="ms-1.5 font-normal italic text-slate-500">({q.linesHint})</span>}
        </p>
        <ItemTools ctx={ctx} s={s} i={i} />
      </div>
      {"situationContext" in q && q.situationContext && <p className="ps-7 italic text-slate-600">{q.situationContext}</p>}
      {choice ? (
        <div className="grid grid-cols-1 gap-1 ps-7 pt-1">
          {q.options!.map((o, oi) => (
            <p key={oi} className="flex items-start gap-2">
              <span className="text-slate-500">({OPTION_LETTERS[oi].toLowerCase()})</span>
              <span>{o}</span>
            </p>
          ))}
        </div>
      ) : (
        <div className="ps-7">
          <AnswerLines count={q.type === "copy" ? 2 : ctx.layout.easyRead ? 3 : 2} easy={ctx.layout.easyRead} />
        </div>
      )}
    </div>
  );
}

function Glossary({ words, ctx }: { words: { en: string; he: string }[]; ctx: Ctx }) {
  if (!ctx.layout.wordBankHebrew || !words.length) return null;
  return (
    <div data-ws-block="" className="my-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-600">
        Helpful words · <He>מילים שיעזרו לכם</He>
      </p>
      <div className="grid grid-cols-3 gap-x-4 gap-y-1">
        {words.map((w, k) => (
          <p key={k} className="flex items-baseline justify-between gap-2 border-b border-dotted border-slate-300">
            <span className="font-semibold">{w.en}</span>
            <He className="text-slate-600">{w.he}</He>
          </p>
        ))}
      </div>
    </div>
  );
}

function ReadingPart({ section, s, ctx }: { section: Extract<WorksheetSection, { kind: "reading" }>; s: number; ctx: Ctx }) {
  const { story } = section;
  return (
    <>
      <Instruction en={READING_TASK_LINE.en} he={READING_TASK_LINE.he} ctx={ctx} />
      <div data-ws-block="" data-ws-keep-next="" className="pt-1 text-center">
        <p className="text-lg font-bold">{story.title}</p>
      </div>
      {story.paragraphs.map((p, k) => (
        <div key={k} data-ws-block="" className="flex gap-3 py-1">
          <span className="w-5 shrink-0 text-xs font-bold text-slate-400">{k + 1}</span>
          <p className={cn("flex-1", ctx.layout.easyRead ? "leading-loose" : "leading-relaxed")}>{p}</p>
        </div>
      ))}
      <Glossary words={story.vocabularyHints.map((h) => ({ en: h.word, he: h.translation }))} ctx={ctx} />
      <div data-ws-block="" data-ws-keep-next="" className="pt-3">
        <p className="font-bold">Questions</p>
      </div>
      {section.questions.map((q, k) => (
        <QuestionBlock key={q.id} q={q} n={k + 1} s={s} i={k} ctx={ctx} />
      ))}
    </>
  );
}

function ConversationPart({ section, s, ctx }: { section: Extract<WorksheetSection, { kind: "conversation" }>; s: number; ctx: Ctx }) {
  const { dialogue } = section;
  const nameOf = (id: string) => dialogue.speakers.find((p) => p.id === id)?.name ?? "";
  return (
    <>
      <Instruction en={CONVERSATION_TASK_LINE.en} he={CONVERSATION_TASK_LINE.he} ctx={ctx} />
      <div data-ws-block="" data-ws-keep-next="" className="pt-1">
        <p className="text-center text-lg font-bold">{dialogue.title}</p>
        <p className="text-center italic text-slate-600">{dialogue.settingDescription}</p>
      </div>
      {dialogue.turns.map((t) => (
        <div key={t.index} data-ws-block="" className="flex gap-2 py-0.5">
          <span className="w-5 shrink-0 text-xs font-bold text-slate-400">{t.index + 1}</span>
          <p className={cn("flex-1", ctx.layout.easyRead ? "leading-loose" : "leading-relaxed")}>
            <span className="font-bold">{nameOf(t.speakerId)}:</span>{" "}
            {t.stageDirection && <span className="italic text-slate-500">{t.stageDirection} </span>}
            {t.text}
          </p>
        </div>
      ))}
      <Glossary words={dialogue.usefulPhrases.map((p) => ({ en: p.phrase, he: p.translation }))} ctx={ctx} />
      <div data-ws-block="" data-ws-keep-next="" className="pt-3">
        <p className="font-bold">Questions</p>
      </div>
      {section.questions.map((q, k) => (
        <QuestionBlock key={q.id} q={q} n={k + 1} s={s} i={k} ctx={ctx} />
      ))}
    </>
  );
}

function WritingPart({ section, ctx }: { section: Extract<WorksheetSection, { kind: "writing" }>; ctx: Ctx }) {
  const { task } = section;
  return (
    <>
      <div data-ws-block="" className="pt-2">
        <p className="font-bold">{task.title}</p>
        <p className="whitespace-pre-line">{task.prompt}</p>
        <p className="pt-1 text-slate-600">
          Write {task.minWords}–{task.maxWords} words.
        </p>
        {ctx.layout.hebrewHelp && task.hebrewInstructions && (
          <p className="pt-1 text-slate-600" dir="rtl">
            <He>{task.hebrewInstructions}</He>
          </p>
        )}
      </div>
      {task.wordBank.length > 0 && (
        <div data-ws-block="" className="my-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-600">Word bank</p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
            {task.wordBank.map((w, k) => (
              <p key={k} className="flex items-baseline justify-between gap-2">
                <span className="font-semibold">{w.word}</span>
                {ctx.layout.hebrewHelp && <He className="text-slate-600">{w.hebrew}</He>}
              </p>
            ))}
          </div>
        </div>
      )}
      {task.sentenceStarters.length > 0 && (
        <div data-ws-block="" className="py-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Sentence starters</p>
          <ul className="list-disc ps-5">
            {task.sentenceStarters.map((x, k) => (
              <li key={k}>{x}</li>
            ))}
          </ul>
        </div>
      )}
      {task.guidedSteps.length > 0 && (
        <div data-ws-block="" className="py-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Step by step</p>
          <ol className="list-decimal ps-5">
            {task.guidedSteps.map((g, k) => (
              <li key={k}>
                {ctx.layout.hebrewHelp && <He className="text-slate-600">{g.titleHebrew}: </He>}
                <span className="italic">{g.starterPhrase}…</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {chunks(Array.from({ length: task.lines }), 5).map((c, k) => (
        <div key={k} data-ws-block="">
          <AnswerLines count={c.length} easy={ctx.layout.easyRead} />
        </div>
      ))}
    </>
  );
}

// ── Answer key ────────────────────────────────────────────────────────

function vocabKey(section: Extract<WorksheetSection, { kind: "vocab" }>, salt: string): string[] {
  const out: string[] = [];
  for (const run of runs(section.items, (x) => x.kind)) {
    chunks(run.items, run.key === "match" ? MATCH_CHUNK : run.items.length).forEach((chunk) => {
      const rights = run.key === "match" ? matchOrder(chunk, salt) : [];
      chunk.forEach((it) => {
        switch (it.kind) {
          case "match":
            out.push(OPTION_LETTERS[rights.indexOf(it)]);
            break;
          case "choose_meaning":
            out.push(`(${OPTION_LETTERS[it.answerIndex ?? 0].toLowerCase()}) ${it.hebrew}`);
            break;
          case "gap_sentence":
            out.push(it.answer ?? cleanWord(it.word));
            break;
          case "to_hebrew":
            out.push(it.hebrew);
            break;
          case "to_english":
            out.push(it.word);
            break;
        }
      });
    });
  }
  return out;
}

function questionKey(q: MSUnseenQuestion | ConversationQuestion): string {
  if (q.options?.length && typeof q.correctIndex === "number") {
    return `(${OPTION_LETTERS[q.correctIndex].toLowerCase()}) ${q.options[q.correctIndex]}`;
  }
  if (q.type === "copy") return `“${q.targetSentence ?? ""}”`;
  return q.modelAnswer ? `e.g. ${q.modelAnswer}` : "Answers will vary.";
}

function sectionKey(section: WorksheetSection, salt: string): string[] {
  switch (section.kind) {
    case "vocab":
      return vocabKey(section, salt);
    case "grammar":
      return section.items.map((i) => grammarKeyText(i, salt));
    case "reading":
    case "conversation":
      return section.questions.map(questionKey);
    case "writing":
      return [`Answers will vary (${section.task.minWords}–${section.task.maxWords} words).`];
  }
}

function AnswerKey({ sections, ctx, version }: { sections: WorksheetSection[]; ctx: Ctx; version?: SheetVersion }) {
  return (
    <>
      <div data-ws-block="" data-ws-break="" data-ws-keep-next="" className="print-break-before pb-2">
        <p className="text-lg font-bold">
          Answer Key{version ? ` · Version ${version}` : ""} · <He>דף תשובות למורה</He>
        </p>
        <p className="text-slate-600">{ctx.layout.title}</p>
      </div>
      {sections.map((section, s) => (
        <div key={s} data-ws-block="" className="py-1.5">
          <p className="font-bold">
            Part {PART_LETTERS[s]} – {PART_LABEL[section.kind].en}
          </p>
          <ol className="list-decimal ps-6">
            {sectionKey(section, ctx.salt).map((line, k) => (
              <li key={k} dir="auto">
                {line}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </>
  );
}

// ── The sheet ─────────────────────────────────────────────────────────

export function WorksheetSheet({
  content,
  version = "A",
  withKey,
  edit,
  breakBefore = false,
}: {
  content: WorksheetContent;
  version?: SheetVersion;
  withKey: boolean;
  edit?: SheetEditHandlers;
  /** Start this version on a new page (Version B after Version A). */
  breakBefore?: boolean;
}) {
  const { settings } = content;
  const { layout } = settings;
  const sections = version === "B" ? makeVersionB(content.sections, content.seed) : content.sections;
  const ctx: Ctx = { layout, salt: version === "B" ? "B" : "", edit };
  const showVersion = layout.versions;

  return (
    <div className={cn("text-slate-900", layout.easyRead ? "text-lg" : "text-sm")} lang="en" dir="ltr">
      <div data-ws-block="" {...(breakBefore ? { "data-ws-break": "" } : {})} className={cn("pb-3", breakBefore && "print-break-before")}>
        <div className="flex items-baseline justify-between gap-4 border-b-2 border-slate-800 pb-1">
          <p className="text-xl font-bold">{layout.title || "English Worksheet"}</p>
          <p className="shrink-0 text-xs text-slate-600">
            {GRADE_LABELS[settings.grade].en} · {levelToLabel(settings.level)}
            {showVersion && <span className="ms-2 rounded border border-slate-500 px-1.5 font-bold text-slate-800">Version {version}</span>}
          </p>
        </div>
        {layout.header && (
          <div className="flex gap-6 pt-4 text-sm">
            {(["Name", "Class", "Date"] as const).map((label) => (
              <span key={label} className={cn("flex items-end gap-1.5", label === "Name" ? "flex-[2]" : "flex-1")}>
                <span className="shrink-0">{label}:</span>
                <span className="h-4 flex-1 border-b border-slate-500" />
              </span>
            ))}
          </div>
        )}
      </div>

      {sections.map((section, s) => (
        <React.Fragment key={s}>
          <div data-ws-block="" data-ws-keep-next="" className="mt-4 flex items-center justify-between border-b border-slate-300 pb-1">
            <p className="text-base font-extrabold uppercase tracking-wide">
              Part {PART_LETTERS[s]} – {PART_LABEL[section.kind].en}
            </p>
            {edit && (
              <button
                type="button"
                onClick={() => edit.onReshuffle(s)}
                className="ws-tools print:hidden inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-0.5 font-hebrew text-xs text-slate-600 hover:border-slate-500 hover:text-slate-900"
                dir="rtl"
                title="ליצור שאלות חדשות לחלק הזה"
              >
                <Shuffle className="size-3" />
                {section.kind === "writing" ? "משימה אחרת" : "שאלות חדשות לחלק הזה"}
              </button>
            )}
          </div>
          {section.kind === "vocab" && <VocabPart section={section} s={s} ctx={ctx} />}
          {section.kind === "grammar" && <GrammarPart section={section} s={s} ctx={ctx} />}
          {section.kind === "reading" && <ReadingPart section={section} s={s} ctx={ctx} />}
          {section.kind === "conversation" && <ConversationPart section={section} s={s} ctx={ctx} />}
          {section.kind === "writing" && <WritingPart section={section} ctx={ctx} />}
        </React.Fragment>
      ))}

      {withKey && <AnswerKey sections={sections} ctx={ctx} version={showVersion ? version : undefined} />}
    </div>
  );
}

/** Every version of the sheet in print order (A [+ key], then B [+ key]). */
export function WorksheetAllVersions({ content, withKey }: { content: WorksheetContent; withKey: boolean }) {
  return (
    <>
      <WorksheetSheet content={content} version="A" withKey={withKey} />
      {content.settings.layout.versions && <WorksheetSheet content={content} version="B" withKey={withKey} breakBefore />}
    </>
  );
}
