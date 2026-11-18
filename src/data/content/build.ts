// Compact builders for the grade × level content of Unseen and Conversation.
// Content files stay short and readable; these expand them into the full
// types the sections already render. In every multiple-choice helper the
// FIRST option is the correct one; the builder moves it to a fixed slot that
// varies from question to question so the key is not predictable.

import type { ClassGrade, LevelNumber } from "@/lib/levels";
import type { MSUnseenQuestion, MSUnseenStory } from "@/types/unseen";
import type { TaskCategory, WritingTask } from "@/types/writing";
import type {
  ConversationCategory,
  ConversationQuestion,
  ConversationScenario,
  DialogueSpeaker,
  UsefulConversationPhrase,
} from "@/types/conversation";

type LevelLabel = "Level 1" | "Level 2" | "Level 3";
const label = (l: LevelNumber): LevelLabel => `Level ${l}` as LevelLabel;

/** Places the first option (the answer) at slot `n % 4` without changing the others' order. */
function placeAnswer(options: string[], n: number): { options: string[]; correctIndex: number } {
  const [answer, ...rest] = options;
  const slot = n % Math.min(4, options.length);
  const out = [...rest];
  out.splice(slot, 0, answer);
  return { options: out, correctIndex: slot };
}

/** "word=תרגום; phrasal verb=…" → hint objects. */
function parseHints(hints: string): { word: string; translation: string }[] {
  return hints
    .split(";")
    .map((h) => h.trim())
    .filter(Boolean)
    .map((h) => {
      const [word, translation] = h.split("=").map((x) => x.trim());
      return { word, translation };
    });
}

// ── Unseen ─────────────────────────────────────────────────────────────

const UNSEEN_LEVEL_META: Record<LevelNumber, { label: string; description: string }> = {
  1: { label: "רמה 1 - קוראים מתחילים", description: "Short, clear texts for students who are building their basic reading." },
  2: { label: "רמה 2 - רמה שוטפת", description: "Texts at the class's textbook level, with detail and some inference questions." },
  3: { label: "רמה 3 - מתקדמים", description: "Longer, richer texts for strong readers, with inference and main-idea questions." },
};

export type UnseenQ =
  | { kind: "mcq"; p: number; prompt: string; options: string[]; he: string }
  | { kind: "open"; p: number; prompt: string; model: string; keywords: string[]; he: string }
  | { kind: "copy"; p: number; prompt: string; sentence: string; he: string };

/** Multiple choice: paragraph index (0-based), prompt, [answer, …distractors], Hebrew explanation. */
export const mc = (p: number, prompt: string, options: string[], he: string): UnseenQ => ({ kind: "mcq", p, prompt, options, he });
/** Open answer: model answer and comma-separated keywords. */
export const op = (p: number, prompt: string, model: string, keywords: string, he: string): UnseenQ => ({
  kind: "open",
  p,
  prompt,
  model,
  keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
  he,
});
/** Copy the sentence: `sentence` must appear word for word in paragraph `p`. */
export const cp = (p: number, prompt: string, sentence: string, he: string): UnseenQ => ({ kind: "copy", p, prompt, sentence, he });

export interface UnseenSpec {
  title: string;
  he: string;
  /** "word=תרגום; …" – glossed words (they may be outside the grade list). */
  hints: string;
  text: string[];
  q: UnseenQ[];
  allow?: string[];
}

export function unseen(grade: ClassGrade, level: LevelNumber, n: number, s: UnseenSpec): MSUnseenStory {
  const id = `unseen-g${grade}-l${level}-${String(n).padStart(2, "0")}`;
  const points = Math.round(100 / s.q.length);
  const questions: MSUnseenQuestion[] = s.q.map((q, i) => {
    const base = {
      id: `${id}-q${i + 1}`,
      number: i + 1,
      paragraphIndex: q.p,
      linesHint: `Paragraph ${q.p + 1}`,
      prompt: q.prompt,
      explanationHebrew: q.he,
      points,
    };
    if (q.kind === "mcq") return { ...base, type: "mcq", ...placeAnswer(q.options, i + n) };
    if (q.kind === "open") return { ...base, type: "open", modelAnswer: q.model, keywords: q.keywords };
    return { ...base, type: "copy", targetSentence: q.sentence };
  });
  return {
    id,
    grade,
    level: label(level),
    levelLabel: UNSEEN_LEVEL_META[level].label,
    levelDescription: UNSEEN_LEVEL_META[level].description,
    title: s.title,
    hebrewTitle: s.he,
    paragraphs: s.text,
    vocabularyHints: parseHints(s.hints),
    questions,
    totalPoints: points * questions.length,
    allowWords: s.allow,
  };
}

// ── Conversation ───────────────────────────────────────────────────────

const CONVERSATION_LEVEL_META: Record<LevelNumber, { label: string; description: string }> = {
  1: { label: "רמה 1 - שיחות בסיסיות מהחיים", description: "Short, clear everyday exchanges with simple questions and answers." },
  2: { label: "רמה 2 - שיחות שוטפות מהחיים", description: "Everyday conversations at the class's textbook level, with a small problem to solve." },
  3: { label: "רמה 3 - תקשורת מתקדמת", description: "Longer conversations with opinions, polite disagreement and problem-solving." },
};

const CATEGORY_HE: Record<ConversationCategory, string> = {
  travel: "טיולים והתמצאות",
  food: "מסעדות ובתי קפה",
  shopping: "קניות וכסף",
  school_social: "חברים ובית ספר",
  health: "בריאות",
  tech_daily: "טכנולוגיה ויומיום",
};

export type ConvQ =
  | { kind: "mcq" | "reply_mcq"; line: number; prompt: string; options: string[]; he: string; situation?: string }
  | { kind: "open" | "reply_open"; line: number; prompt: string; model: string; keywords: string[]; he: string; situation?: string }
  | { kind: "copy"; line: number; prompt: string; sentence: string; he: string };

/** line = 1-based dialogue line, or 0 for the whole conversation. */
export const cmc = (line: number, prompt: string, options: string[], he: string): ConvQ => ({ kind: "mcq", line, prompt, options, he });
export const cop = (line: number, prompt: string, model: string, keywords: string, he: string): ConvQ => ({
  kind: "open",
  line,
  prompt,
  model,
  keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
  he,
});
export const ccp = (line: number, prompt: string, sentence: string, he: string): ConvQ => ({ kind: "copy", line, prompt, sentence, he });
/** "What would you say?" – choose the best reply. */
export const rmc = (situation: string, prompt: string, options: string[], he: string): ConvQ => ({
  kind: "reply_mcq",
  line: 0,
  situation,
  prompt,
  options,
  he,
});
/** "What would you say?" – write a short reply. */
export const rop = (situation: string, prompt: string, model: string, keywords: string, he: string): ConvQ => ({
  kind: "reply_open",
  line: 0,
  situation,
  prompt,
  model,
  keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
  he,
});

/** Speaker shorthand: [name, role, emoji, "f" | "m"]. Colours are assigned in order. */
export type SpeakerSpec = [name: string, role: string, emoji: string, gender: "f" | "m"];

export interface ConversationSpec {
  title: string;
  he: string;
  category: ConversationCategory;
  setting: string;
  speakers: SpeakerSpec[];
  /** "A: text" / "B: text (stage direction)" – the letter picks the speaker. */
  lines: string[];
  /** "phrase=תרגום" or "phrase=תרגום=הערה" */
  phrases: string[];
  q: ConvQ[];
  allow?: string[];
}

const COLORS: DialogueSpeaker["colorTheme"][] = ["sky", "amber", "emerald", "purple"];

export function conversation(grade: ClassGrade, level: LevelNumber, n: number, s: ConversationSpec): ConversationScenario {
  const id = `conv-g${grade}-l${level}-${String(n).padStart(2, "0")}`;
  const speakers: DialogueSpeaker[] = s.speakers.map(([name, role, avatarEmoji, g], i) => ({
    id: `speaker_${String.fromCharCode(97 + i)}`,
    name,
    role,
    avatarEmoji,
    genderHint: g === "f" ? "female" : "male",
    colorTheme: COLORS[i % COLORS.length],
  }));
  const turns = s.lines.map((raw, index) => {
    const m = raw.match(/^([A-D]):\s*(.*)$/);
    if (!m) throw new Error(`${id}: bad line "${raw}"`);
    const letter = m[1].toLowerCase();
    let text = m[2].trim();
    let stageDirection: string | undefined;
    const sd = text.match(/^\(([^)]*)\)\s*(.*)$/);
    if (sd) {
      stageDirection = `(${sd[1]})`;
      text = sd[2];
    }
    return { index, speakerId: `speaker_${letter}`, text, ...(stageDirection ? { stageDirection } : {}) };
  });
  const usefulPhrases: UsefulConversationPhrase[] = s.phrases.map((p) => {
    const [phrase, translation, usageNoteHebrew] = p.split("=").map((x) => x.trim());
    return { phrase, translation, ...(usageNoteHebrew ? { usageNoteHebrew } : {}) };
  });
  const points = Math.round(100 / s.q.length);
  const questions: ConversationQuestion[] = s.q.map((q, i) => {
    const base = {
      id: `${id}-q${i + 1}`,
      number: i + 1,
      turnRefIndex: q.line > 0 ? q.line - 1 : -1,
      linesHint: q.line > 0 ? `Line ${q.line}` : "Whole Conversation",
      prompt: q.prompt,
      explanationHebrew: q.he,
      points,
    };
    if (q.kind === "mcq" || q.kind === "reply_mcq") {
      return { ...base, type: q.kind, ...(q.situation ? { situationContext: q.situation } : {}), ...placeAnswer(q.options, i + n) };
    }
    if (q.kind === "copy") return { ...base, type: "copy", targetSentence: q.sentence };
    const o = q as Extract<ConvQ, { model: string }>;
    return { ...base, type: o.kind, ...(o.situation ? { situationContext: o.situation } : {}), modelAnswer: o.model, keywords: o.keywords };
  });
  return {
    id,
    grade,
    level: label(level),
    levelLabel: CONVERSATION_LEVEL_META[level].label,
    levelDescription: CONVERSATION_LEVEL_META[level].description,
    title: s.title,
    hebrewTitle: s.he,
    category: s.category,
    categoryLabelHebrew: CATEGORY_HE[s.category],
    settingDescription: s.setting,
    speakers,
    turns,
    usefulPhrases,
    questions,
    totalPoints: points * questions.length,
    allowWords: s.allow,
  };
}

// ── Writing ────────────────────────────────────────────────────────────


export interface WritingSpec {
  category: TaskCategory;
  emoji: string;
  title: string;
  he: string;
  prompt: string;
  /** Hebrew instructions shown under the prompt. */
  heInstr: string;
  /** Target length in words: [min, max]. */
  words: [number, number];
  /** Short Hebrew tips. */
  tips: string[];
  /** "word=תרגום=emoji; …" (emoji optional) – words from the grade's textbook list. */
  bank: string;
  starters: string[];
  /** Level 1 guided steps: [titleHe, starter, placeholder, hintHe]. */
  steps?: [string, string, string, string][];
  allow?: string[];
}

export function writingTask(grade: ClassGrade, level: LevelNumber, n: number, s: WritingSpec): WritingTask {
  const [min, max] = s.words;
  return {
    id: `writing-g${grade}-l${level}-${String(n).padStart(2, "0")}`,
    grade,
    level: label(level),
    category: s.category,
    emoji: s.emoji,
    title: s.title,
    hebrewTitle: s.he,
    prompt: s.prompt,
    hebrewInstructions: s.heInstr,
    targetWords: `${min}–${max} מילים`,
    minWords: min,
    maxWords: max,
    starterTips: s.tips,
    wordBank: s.bank
      .split(";")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => {
        const [word, hebrew, emoji] = x.split("=").map((p) => p.trim());
        return { word, hebrew, ...(emoji ? { emoji } : {}) };
      }),
    sentenceStarters: s.starters,
    ...(s.steps
      ? {
          guidedSteps: s.steps.map(([titleHebrew, starterPhrase, placeholder, helperHintHebrew], i) => ({
            stepNumber: i + 1,
            titleHebrew,
            starterPhrase,
            placeholder,
            helperHintHebrew,
          })),
        }
      : {}),
    allowWords: s.allow,
  };
}
