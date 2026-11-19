// Reading (Unseen), Conversation and Writing parts for printed worksheets.
import { levelToLabel, type ClassGrade, type LevelNumber } from "@/lib/levels";
import { getUnseenStories } from "@/data/unseen";
import { getConversationScenarios } from "@/data/conversations/scenarios";
import { getWritingTasks } from "@/data/writing";
import type { Rng } from "@/lib/grammar-gen/random";
import type { MSUnseenQuestion, MSUnseenStory } from "@/types/unseen";
import type { ConversationQuestion, ConversationScenario } from "@/types/conversation";
import type { WritingTask } from "@/types/writing";
import type {
  ConversationPartConfig,
  ConversationSnapshot,
  ReadingPartConfig,
  ReadingSnapshot,
  WorksheetSection,
  WritingPartConfig,
  WritingSnapshot,
} from "@/lib/worksheet/types";

export const storiesFor = (grade: ClassGrade, level: LevelNumber): MSUnseenStory[] =>
  getUnseenStories(grade, levelToLabel(level));

export const scenariosFor = (grade: ClassGrade, level: LevelNumber): ConversationScenario[] =>
  getConversationScenarios(grade, levelToLabel(level));

export const writingTasksFor = (grade: ClassGrade, level: LevelNumber): WritingTask[] =>
  getWritingTasks(grade, levelToLabel(level));

/** Picks `count` questions of the chosen types, keeping the text's order. */
function pickQuestions<Q extends { type: string; number: number }>(all: Q[], types: string[], count: number, rng: Rng): Q[] {
  const pool = types.length ? all.filter((q) => types.includes(q.type)) : all;
  return rng
    .sample(pool, Math.min(count, pool.length))
    .sort((a, b) => a.number - b.number);
}

/** Most questions a text offers for the chosen types. */
export function questionCapacity(questions: { type: string }[], types: string[]): number {
  return (types.length ? questions.filter((q) => types.includes(q.type)) : questions).length;
}

export function readingSnapshot(story: MSUnseenStory): ReadingSnapshot {
  return {
    storyId: story.id,
    title: story.title,
    hebrewTitle: story.hebrewTitle,
    paragraphs: story.paragraphs,
    vocabularyHints: story.vocabularyHints ?? [],
  };
}

export function conversationSnapshot(s: ConversationScenario): ConversationSnapshot {
  return {
    scenarioId: s.id,
    title: s.title,
    hebrewTitle: s.hebrewTitle,
    settingDescription: s.settingDescription,
    speakers: s.speakers.map((p) => ({ id: p.id, name: p.name, role: p.role })),
    turns: s.turns.map((t) => ({
      index: t.index,
      speakerId: t.speakerId,
      text: t.text,
      ...(t.stageDirection ? { stageDirection: t.stageDirection } : {}),
    })),
    usefulPhrases: s.usefulPhrases.map((p) => ({ phrase: p.phrase, translation: p.translation })),
  };
}

export function writingSnapshot(task: WritingTask, cfg: WritingPartConfig): WritingSnapshot {
  return {
    taskId: task.id,
    title: task.title,
    hebrewTitle: task.hebrewTitle,
    prompt: task.prompt,
    hebrewInstructions: task.hebrewInstructions,
    minWords: task.minWords,
    maxWords: task.maxWords,
    wordBank: cfg.wordBank ? task.wordBank.map((w) => ({ word: w.word, hebrew: w.hebrew })) : [],
    sentenceStarters: cfg.starters ? task.sentenceStarters : [],
    guidedSteps: cfg.guided ? (task.guidedSteps ?? []).map((g) => ({ titleHebrew: g.titleHebrew, starterPhrase: g.starterPhrase })) : [],
    lines: cfg.lines,
  };
}

export function buildReadingSection(
  cfg: ReadingPartConfig,
  grade: ClassGrade,
  level: LevelNumber,
  rng: Rng
): Extract<WorksheetSection, { kind: "reading" }> | null {
  const stories = storiesFor(grade, level);
  const story = stories.find((s) => s.id === cfg.storyId) ?? (stories.length ? rng.pick(stories) : undefined);
  if (!story) return null;
  return { kind: "reading", story: readingSnapshot(story), questions: pickQuestions(story.questions, cfg.types, cfg.count, rng) };
}

export function buildConversationSection(
  cfg: ConversationPartConfig,
  grade: ClassGrade,
  level: LevelNumber,
  rng: Rng
): Extract<WorksheetSection, { kind: "conversation" }> | null {
  const scenarios = scenariosFor(grade, level);
  const s = scenarios.find((x) => x.id === cfg.scenarioId) ?? (scenarios.length ? rng.pick(scenarios) : undefined);
  if (!s) return null;
  return { kind: "conversation", dialogue: conversationSnapshot(s), questions: pickQuestions(s.questions, cfg.types, cfg.count, rng) };
}

export function buildWritingSection(
  cfg: WritingPartConfig,
  grade: ClassGrade,
  level: LevelNumber,
  rng: Rng
): Extract<WorksheetSection, { kind: "writing" }> | null {
  const tasks = writingTasksFor(grade, level);
  const task = tasks.find((t) => t.id === cfg.taskId) ?? (tasks.length ? rng.pick(tasks) : undefined);
  return task ? { kind: "writing", task: writingSnapshot(task, cfg) } : null;
}

/** Another question from the same text that isn't on the sheet (same type first, then any chosen type). */
export function replaceTextQuestion<Q extends MSUnseenQuestion | ConversationQuestion>(
  q: Q,
  current: Q[],
  all: Q[],
  types: string[],
  rng: Rng
): Q | null {
  const used = new Set(current.map((x) => x.id));
  const free = all.filter((x) => !used.has(x.id) && (!types.length || types.includes(x.type)));
  const same = free.filter((x) => x.type === q.type);
  return (same.length ? rng.pick(same) : free.length ? rng.pick(free) : null) ?? null;
}
