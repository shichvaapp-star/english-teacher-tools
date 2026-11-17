"use client";

import React from "react";
import { PrintBooklet } from "@/components/print/print-sheet-parts";
import { seededShuffle } from "@/components/grammar/exercises/shared";
import { expectedAnswer } from "@/lib/grammar-grading";
import type { GrammarItem, GrammarTopic } from "@/types/grammar";

// Print-only worksheet + answer key. Paper is always white, so (like the other
// printed booklets) it uses fixed print colours rather than theme tokens.

const TASK_LINE: Record<GrammarItem["type"], string> = {
  mcq: "Circle the correct answer.",
  gap_bank: "Complete with a word from the box.",
  gap_type: "Write the verb in the correct form.",
  unscramble: "Put the words in the correct order.",
  find_fix: "Find the mistake and correct it.",
  transform: "Rewrite the sentence.",
  sort: "Write each one in the correct group.",
  match_halves: "Match the beginnings and the endings.",
  cloze_text: "Complete the text with the verbs in the correct form.",
  write_own: "Write your own sentences.",
};

const Line = () => <div className="mt-3 border-b border-slate-400 h-5" />;
const blank = (s: string) => s.replace("___", "__________");

function PrintItem({ item, n }: { item: GrammarItem; n: number }) {
  return (
    <div className="print-avoid-break mb-5 text-[13px] leading-relaxed">
      <p className="font-semibold text-slate-800">
        {n}. <span className="font-normal italic text-slate-600">{TASK_LINE[item.type]}</span>
      </p>
      {item.context && <p className="italic text-slate-500">{item.context}</p>}
      {renderBody(item)}
    </div>
  );
}

function renderBody(item: GrammarItem) {
  switch (item.type) {
    case "mcq":
      return (
        <p>
          {blank(item.sentence)} &nbsp; ( {seededShuffle(item.options, item.id).join("  /  ")} )
        </p>
      );
    case "gap_bank":
      return (
        <>
          <p className="inline-block border border-slate-400 rounded px-2 my-1">{seededShuffle(item.wordBank, item.id).join("   ")}</p>
          <p>{blank(item.sentence)}</p>
        </>
      );
    case "gap_type":
      return <p>{item.sentence.replace("___", `__________ (${item.baseForm})`)}</p>;
    case "unscramble":
      return (
        <>
          <p>{seededShuffle(item.words, item.id).join("  /  ")}</p>
          <Line />
        </>
      );
    case "find_fix":
      return (
        <>
          <p>{item.tokens.join(" ")}</p>
          <p className="mt-2">Mistake: ____________ &nbsp; Correction: ____________</p>
        </>
      );
    case "transform":
      return (
        <>
          <p>
            {item.source} <span className="italic text-slate-600">({item.taskEn})</span>
          </p>
          <Line />
        </>
      );
    case "sort":
      return (
        <>
          <p className="my-1">Groups: {item.buckets.map((b) => `[ ${b} ]`).join("  ")}</p>
          <ul className="list-none pl-0">
            {seededShuffle(item.entries, item.id).map((e) => (
              <li key={e.text}>
                {e.text} → ____________
              </li>
            ))}
          </ul>
        </>
      );
    case "match_halves": {
      const rights = seededShuffle(
        item.pairs.map((p) => p.right),
        item.id
      );
      return (
        <div className="grid grid-cols-2 gap-x-6">
          <ol className="list-decimal pl-5">
            {item.pairs.map((p) => (
              <li key={p.left}>{p.left} ___</li>
            ))}
          </ol>
          <ol className="list-[upper-alpha] pl-5">
            {rights.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </div>
      );
    }
    case "cloze_text":
      return (
        <>
          {item.title && <p className="font-semibold">{item.title}</p>}
          <p>
            {item.text.replace(/\{(\d+)\}/g, (_, k: string) => `(${k}) __________ (${item.blanks[Number(k) - 1]?.baseForm ?? ""})`)}
          </p>
        </>
      );
    case "write_own":
      return (
        <>
          <p>{item.taskEn}</p>
          <Line />
          <Line />
          <Line />
        </>
      );
  }
}

function keyText(item: GrammarItem): string {
  if (item.type === "match_halves") {
    const rights = seededShuffle(
      item.pairs.map((p) => p.right),
      item.id
    );
    return item.pairs.map((p, i) => `${i + 1}-${String.fromCharCode(65 + rights.indexOf(p.right))}`).join(", ");
  }
  if (item.type === "find_fix") return `${item.tokens[item.wrongIndex]} → ${item.answers[0]}`;
  return expectedAnswer(item);
}

export function GrammarPrintSheet({
  topic,
  items,
  levelLabel,
  withKey,
}: {
  topic: GrammarTopic;
  items: GrammarItem[];
  levelLabel: string;
  withKey: boolean;
}) {
  return (
    <PrintBooklet>
      <div className="print-page-sheet">
        <div className="border border-slate-300 rounded-xl p-3 mb-5 bg-slate-50/50 text-xs">
          <div className="flex justify-between font-bold text-slate-800 mb-2">
            <span>Grammar Worksheet &bull; {topic.title}</span>
            <span>{levelLabel}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span>Name: ____________________</span>
            <span>Class: __________</span>
            <span>Date: __________</span>
          </div>
        </div>
        {items.map((item, i) => (
          <PrintItem key={item.id} item={item} n={i + 1} />
        ))}
      </div>
      {withKey && (
        <div className="print-page-sheet print-break-before text-[13px]">
          <h2 className="font-bold text-base mb-3">Answer Key &bull; {topic.title}</h2>
          <ol className="list-decimal pl-5 space-y-1">
            {items.map((item) => (
              <li key={item.id}>{keyText(item)}</li>
            ))}
          </ol>
        </div>
      )}
    </PrintBooklet>
  );
}
