// Compact builders for grammar items, so topic files stay readable.
// Conventions:
//  - mcq / bank: the FIRST option is the answer (the UI and print sheet shuffle).
//  - order: give the correct sentence; it is split into words + final . ? !
//  - fix: mark the wrong word with * ("My dad *drive to work.").
//  - IDs are generated in order: `${prefix}${grade}-${level}-NN` – append new
//    items at the end of a set instead of reordering, so IDs stay stable.

import type { ClassGrade, LevelNumber } from "@/lib/levels";
import type { GrammarItem } from "@/types/grammar";

export interface Extra {
  context?: string;
  hint?: string;
  trap?: string;
  instr?: string;
  allow?: string[];
}

type Pair = [string, string];

export function itemSet(topicId: string, prefix: string, level: LevelNumber, grade?: ClassGrade) {
  const items: GrammarItem[] = [];
  let n = 0;

  const base = (he: string, en: string, x: Extra = {}) => ({
    id: `${prefix}${grade ?? ""}-${level}-${String(++n).padStart(2, "0")}`,
    topicId,
    level,
    grade,
    explanationHe: he,
    explanationEn: en,
    context: x.context,
    hintHe: x.hint,
    trapId: x.trap,
    instructionHe: x.instr,
    allowWords: x.allow,
  });

  return {
    items,
    mcq(sentence: string, options: string[], he: string, en: string, x?: Extra) {
      items.push({ ...base(he, en, x), type: "mcq", sentence, options, answer: options[0] });
    },
    bank(sentence: string, options: string[], he: string, en: string, x?: Extra) {
      items.push({ ...base(he, en, x), type: "gap_bank", sentence, wordBank: options, answer: options[0] });
    },
    type(sentence: string, baseForm: string, answers: string | string[], he: string, en: string, x?: Extra) {
      items.push({
        ...base(he, en, x),
        type: "gap_type",
        sentence,
        baseForm,
        answers: Array.isArray(answers) ? answers : [answers],
      });
    },
    order(sentence: string, he: string, en: string, x?: Extra) {
      const m = sentence.trim().match(/^(.*?)([.?!])$/);
      const body = m ? m[1] : sentence.trim();
      const ending = (m ? m[2] : ".") as "." | "?" | "!";
      items.push({ ...base(he, en, x), type: "unscramble", words: body.split(/\s+/), ending });
    },
    fix(sentence: string, answers: string | string[], he: string, en: string, x?: Extra) {
      const raw = sentence.trim().split(/\s+/);
      const wrongIndex = raw.findIndex((t) => t.startsWith("*"));
      if (wrongIndex < 0) throw new Error(`fix item without *: ${sentence}`);
      const tokens = raw.map((t) => t.replace(/^\*/, ""));
      items.push({
        ...base(he, en, x),
        type: "find_fix",
        tokens,
        wrongIndex,
        answers: Array.isArray(answers) ? answers : [answers],
      });
    },
    transform(source: string, taskEn: string, taskHe: string, answers: string | string[], he: string, en: string, x?: Extra) {
      items.push({
        ...base(he, en, x),
        type: "transform",
        source,
        taskEn,
        taskHe,
        answers: Array.isArray(answers) ? answers : [answers],
      });
    },
    sort(buckets: string[], entries: Pair[], he: string, en: string, x?: Extra) {
      items.push({
        ...base(he, en, x),
        type: "sort",
        buckets,
        entries: entries.map(([text, bucket]) => ({ text, bucket })),
      });
    },
    match(pairs: Pair[], he: string, en: string, x?: Extra) {
      items.push({ ...base(he, en, x), type: "match_halves", pairs: pairs.map(([left, right]) => ({ left, right })) });
    },
    cloze(title: string, text: string, blanks: [string, string | string[]][], he: string, en: string, x?: Extra) {
      items.push({
        ...base(he, en, x),
        type: "cloze_text",
        title,
        text,
        blanks: blanks.map(([baseForm, a]) => ({ baseForm, answers: Array.isArray(a) ? a : [a] })),
      });
    },
    write(taskEn: string, taskHe: string, model: string, he: string, en: string, x?: Extra) {
      items.push({ ...base(he, en, x), type: "write_own", taskEn, taskHe, modelAnswers: [model] });
    },
  };
}

/** Common task lines. */
export const NEG = ["Make it negative.", "הפכו לשלילה"] as const;
export const QUE = ["Make it a question.", "הפכו לשאלה"] as const;
