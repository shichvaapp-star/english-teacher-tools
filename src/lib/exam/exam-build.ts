// Builds exam parts from the teacher's settings (teacher side only – pulls in
// the Unseen story data).

import { Rng } from "@/lib/grammar-gen/random";
import { UNSEEN_STORIES } from "@/data/unseen";
import type {
  ExamPartDraft,
  ExamPartFull,
  ExamVocabAnswer,
  GrammarPartFull,
  UnseenPartFull,
  VocabPartFull,
  VocabQuestionFormat,
  VocabQuestionFull,
} from "@/types/exam";

export function buildUnseenPart(id: string, storyId: string, questionIds: string[]): UnseenPartFull | null {
  const story = UNSEEN_STORIES.find((s) => s.id === storyId);
  if (!story) return null;
  const chosen = new Set(questionIds);
  const questions = story.questions.filter((q) => chosen.size === 0 || chosen.has(q.id));
  return { id, type: "unseen", title: story.title, paragraphs: story.paragraphs, questions };
}

const FORMATS: VocabQuestionFormat[] = ["he_to_en_type", "en_to_he_choice", "he_to_en_choice"];

export function buildVocabPart(
  id: string,
  words: ExamVocabAnswer[],
  formats: VocabQuestionFormat[],
  count: number,
  seed: number
): VocabPartFull {
  const rng = new Rng(seed);
  const use = formats.length ? formats : FORMATS;
  const picked = rng.shuffle(words).slice(0, Math.max(0, Math.min(count, words.length)));
  const questions: VocabQuestionFull[] = picked.map((w, i) => {
    const format = use[i % use.length];
    const others = words.filter((o) => o.id !== w.id);
    const distractors = rng.shuffle(others).slice(0, 3);
    if (format === "he_to_en_type") {
      return { id: `v${i + 1}`, format, prompt: w.hebrew, answer: w.english };
    }
    if (format === "en_to_he_choice") {
      return {
        id: `v${i + 1}`,
        format,
        prompt: w.english,
        options: rng.shuffle([w.hebrew, ...distractors.map((d) => d.hebrew)]),
        answer: w.hebrew,
      };
    }
    return {
      id: `v${i + 1}`,
      format,
      prompt: w.hebrew,
      options: rng.shuffle([w.english, ...distractors.map((d) => d.english)]),
      answer: w.english,
    };
  });
  return { id, type: "vocab", questions };
}

export function fullPartFromDraft(d: ExamPartDraft): ExamPartFull | null {
  switch (d.type) {
    case "writing":
      return { id: d.id, type: "writing" };
    case "unseen":
      return buildUnseenPart(d.id, d.storyId, d.questionIds);
    case "vocab":
      return buildVocabPart(d.id, d.words, d.formats, d.count, d.seed);
    case "grammar":
      return { id: d.id, type: "grammar", items: d.items } satisfies GrammarPartFull;
  }
}

export function partItemCount(p: ExamPartFull): number {
  switch (p.type) {
    case "writing":
      return 1;
    case "unseen":
      return p.questions.length;
    case "vocab":
      return p.questions.length;
    case "grammar":
      return p.items.length;
  }
}

