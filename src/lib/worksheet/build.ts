// Builds a worksheet's content from the wizard settings, plus the edit
// helpers used in the preview (replace / delete) and Version B.
import type { ClassGrade, LevelNumber } from "@/lib/levels";
import { Rng } from "@/lib/grammar-gen/random";
import { UNSEEN_STORIES } from "@/data/unseen";
import { CONVERSATION_SCENARIOS } from "@/data/conversations/scenarios";
import type { MSUnseenQuestion } from "@/types/unseen";
import type { ConversationQuestion } from "@/types/conversation";
import {
  PART_ORDER,
  type PartKind,
  type VocabWorksheetItem,
  type WorksheetContent,
  type WorksheetSection,
  type WorksheetSettings,
} from "@/lib/worksheet/types";
import { buildVocabItems, replaceVocabItem } from "@/lib/worksheet/vocab";
import { buildGrammarItems, replaceGrammarItem } from "@/lib/worksheet/grammar";
import {
  buildConversationSection,
  buildReadingSection,
  buildWritingSection,
  replaceTextQuestion,
} from "@/lib/worksheet/reading";

export function defaultSettings(grade: ClassGrade = 7, level: LevelNumber = 1): WorksheetSettings {
  return {
    grade,
    level,
    parts: [],
    vocab: { units: [], count: 10, types: defaultVocabTypes(level) },
    grammar: { topicIds: [], count: 10, types: [] },
    reading: { storyId: null, count: 10, types: ["mcq", "open", "copy"] },
    conversation: { scenarioId: null, count: 10, types: ["mcq", "open", "copy", "reply_mcq", "reply_open"] },
    writing: { taskId: null, wordBank: true, starters: level <= 2, guided: level === 1, lines: level === 1 ? 8 : level === 2 ? 10 : 14 },
    layout: {
      title: "English Worksheet",
      header: true,
      answerKey: true,
      hebrewHelp: level <= 2,
      wordBankHebrew: false,
      easyRead: false,
      versions: false,
    },
  };
}

export function defaultVocabTypes(level: LevelNumber): WorksheetSettings["vocab"]["types"] {
  if (level === 1) return ["match", "choose_meaning"];
  if (level === 2) return ["match", "gap_sentence", "to_hebrew"];
  return ["gap_sentence", "to_english", "to_hebrew"];
}

/** Parts in sheet order. */
export const orderedParts = (parts: PartKind[]): PartKind[] => PART_ORDER.filter((p) => parts.includes(p));

export function buildSection(s: WorksheetSettings, part: PartKind, rng: Rng): WorksheetSection | null {
  switch (part) {
    case "vocab": {
      const items = buildVocabItems(s.vocab, s.grade, s.level, rng);
      return items.length ? { kind: "vocab", items } : null;
    }
    case "grammar": {
      const items = buildGrammarItems(s.grammar, s.grade, s.level, rng);
      return items.length ? { kind: "grammar", items } : null;
    }
    case "reading":
      return buildReadingSection(s.reading, s.grade, s.level, rng);
    case "conversation":
      return buildConversationSection(s.conversation, s.grade, s.level, rng);
    case "writing":
      return buildWritingSection(s.writing, s.grade, s.level, rng);
  }
}

export function buildWorksheet(settings: WorksheetSettings, seed: number = Math.floor(Math.random() * 2 ** 31)): WorksheetContent {
  const rng = new Rng(seed);
  const sections = orderedParts(settings.parts)
    .map((p) => buildSection(settings, p, rng))
    .filter((x): x is WorksheetSection => x !== null);
  return { settings, sections, seed };
}

/** Number of numbered questions in a section (writing counts as one). */
export function sectionSize(section: WorksheetSection): number {
  switch (section.kind) {
    case "vocab":
    case "grammar":
      return section.items.length;
    case "reading":
    case "conversation":
      return section.questions.length;
    case "writing":
      return 1;
  }
}

/** Swaps one question for a new one. Returns the sections unchanged when nothing else is available. */
export function replaceItem(content: WorksheetContent, sectionIndex: number, itemIndex: number): WorksheetSection[] {
  const { settings: s } = content;
  const rng = new Rng();
  return content.sections.map((section, i) => {
    if (i !== sectionIndex) return section;
    switch (section.kind) {
      case "vocab": {
        const next = replaceVocabItem(section.items[itemIndex], section.items, s.vocab, s.grade, s.level, rng);
        return next ? { ...section, items: section.items.map((x, k) => (k === itemIndex ? next : x)) } : section;
      }
      case "grammar": {
        const next = replaceGrammarItem(section.items[itemIndex], section.items, s.grammar.types, s.grade, s.level, rng);
        return next ? { ...section, items: section.items.map((x, k) => (k === itemIndex ? next : x)) } : section;
      }
      case "reading": {
        const all = UNSEEN_STORIES.find((x) => x.id === section.story.storyId)?.questions ?? [];
        const next = replaceTextQuestion<MSUnseenQuestion>(section.questions[itemIndex], section.questions, all, s.reading.types, rng);
        if (!next) return section;
        const questions = section.questions.map((x, k) => (k === itemIndex ? next : x)).sort((a, b) => a.number - b.number);
        return { ...section, questions };
      }
      case "conversation": {
        const all = CONVERSATION_SCENARIOS.find((x) => x.id === section.dialogue.scenarioId)?.questions ?? [];
        const next = replaceTextQuestion<ConversationQuestion>(section.questions[itemIndex], section.questions, all, s.conversation.types, rng);
        if (!next) return section;
        const questions = section.questions.map((x, k) => (k === itemIndex ? next : x)).sort((a, b) => a.number - b.number);
        return { ...section, questions };
      }
      case "writing": {
        const next = buildWritingSection({ ...s.writing, taskId: null }, s.grade, s.level, rng);
        return next && next.task.taskId !== section.task.taskId ? next : section;
      }
    }
  });
}

/** Removes one question; a part left empty is removed too. */
export function deleteItem(sections: WorksheetSection[], sectionIndex: number, itemIndex: number): WorksheetSection[] {
  return sections
    .map((section, i): WorksheetSection | null => {
      if (i !== sectionIndex) return section;
      switch (section.kind) {
        case "vocab":
          return { ...section, items: section.items.filter((_, k) => k !== itemIndex) };
        case "grammar":
          return { ...section, items: section.items.filter((_, k) => k !== itemIndex) };
        case "reading":
          return { ...section, questions: section.questions.filter((_, k) => k !== itemIndex) };
        case "conversation":
          return { ...section, questions: section.questions.filter((_, k) => k !== itemIndex) };
        case "writing":
          return null;
      }
    })
    .filter((x): x is WorksheetSection => x !== null && sectionSize(x) > 0);
}

/** Rebuilds one part with new questions (same settings). */
export function reshuffleSection(content: WorksheetContent, sectionIndex: number): WorksheetSection[] {
  const rng = new Rng();
  return content.sections.map((section, i) => (i === sectionIndex ? buildSection(content.settings, section.kind, rng) ?? section : section));
}

/** Shuffles items inside runs of the same `groupOf` value, so instructions stay grouped. */
function shuffleWithinGroups<T>(items: T[], groupOf: (x: T) => string, rng: Rng): T[] {
  const out: T[] = [];
  let run: T[] = [];
  items.forEach((item, i) => {
    run.push(item);
    const next = items[i + 1];
    if (!next || groupOf(next) !== groupOf(item)) {
      out.push(...rng.shuffle(run));
      run = [];
    }
  });
  return out;
}

function shuffleOptions<Q extends { type: string; options?: string[]; correctIndex?: number }>(q: Q, rng: Rng): Q {
  if (!q.options || q.options.length < 2 || typeof q.correctIndex !== "number") return q;
  const correct = q.options[q.correctIndex];
  const options = rng.shuffle(q.options);
  return { ...q, options, correctIndex: options.indexOf(correct) };
}

function shuffleVocabOptions(item: VocabWorksheetItem, rng: Rng): VocabWorksheetItem {
  if (!item.options || typeof item.answerIndex !== "number") return item;
  const correct = item.options[item.answerIndex];
  const options = rng.shuffle(item.options);
  return { ...item, options, answerIndex: options.indexOf(correct) };
}

/**
 * Version B: the same questions in a different order, with the answer options
 * reshuffled. Reading/conversation questions keep the text's order (only
 * their options move). Deterministic for a given seed.
 */
export function makeVersionB(sections: WorksheetSection[], seed: number): WorksheetSection[] {
  const rng = new Rng(seed ^ 0x5bd1e995);
  return sections.map((section): WorksheetSection => {
    switch (section.kind) {
      case "vocab":
        return {
          ...section,
          items: shuffleWithinGroups(section.items, (x) => x.kind, rng).map((x) => shuffleVocabOptions(x, rng)),
        };
      case "grammar":
        return { ...section, items: shuffleWithinGroups(section.items, (x) => x.type, rng) };
      case "reading":
        return { ...section, questions: section.questions.map((q) => shuffleOptions(q, rng)) };
      case "conversation":
        return { ...section, questions: section.questions.map((q) => shuffleOptions(q, rng)) };
      case "writing":
        return section;
    }
  });
}
