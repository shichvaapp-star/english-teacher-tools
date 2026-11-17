"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/lib/auth-context";
import { hebrewGradeToNumber, type ClassGrade, type LevelNumber } from "@/lib/levels";
import { gradeGrammarItem, isResponseComplete } from "@/lib/grammar-grading";
import { GRAMMAR_GROUPS, GRAMMAR_TOPICS, getGrammarItems, getGrammarTopic } from "@/data/grammar";
import type {
  GrammarExerciseType,
  GrammarGrade,
  GrammarItem,
  GrammarResponse,
  GrammarTopic,
} from "@/types/grammar";
import type { RuleLang } from "@/components/grammar/grammar-rule-sheet";

const LEVEL_KEY = "ett_grammar_level";
const PROGRESS_KEY = "ett_grammar_progress";
const HINT_PENALTY = 0.75;

export type GrammarScreen = "topics" | "practice" | "results";

export interface QueueEntry {
  key: string;
  item: GrammarItem;
  isRetry: boolean;
}

export interface AttemptRecord {
  item: GrammarItem;
  response: GrammarResponse;
  grade: GrammarGrade;
  usedHint: boolean;
  /** Score after the hint penalty (0..1). */
  points: number;
}

// localStorage-backed values, read via useSyncExternalStore so the server
// render and first client render agree (no hydration mismatch).
const STORAGE_EVENT = "ett-grammar-storage";

function subscribeStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(STORAGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(STORAGE_EVENT, cb);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable – value just won't persist */
  }
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function useStoredRaw(key: string): string | null {
  return useSyncExternalStore(
    subscribeStorage,
    () => readRaw(key),
    () => null
  );
}

function parseLevel(raw: string | null): LevelNumber {
  const n = Number(raw);
  return n === 1 || n === 2 || n === 3 ? n : 2;
}

function parseProgress(raw: string | null): Record<string, number> {
  if (!raw) return {};
  try {
    const v: unknown = JSON.parse(raw);
    return v && typeof v === "object" ? (v as Record<string, number>) : {};
  } catch {
    return {};
  }
}

const LATE_TYPES: GrammarExerciseType[] = ["cloze_text", "write_own"];

function orderItems(items: GrammarItem[]): GrammarItem[] {
  const early = items.filter((i) => !LATE_TYPES.includes(i.type));
  const late = items.filter((i) => LATE_TYPES.includes(i.type));
  for (let i = early.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [early[i], early[j]] = [early[j], early[i]];
  }
  return [...early, ...late];
}

export function useGrammarPractice() {
  const { user } = useAuth();
  const studentGrade: ClassGrade | null = hebrewGradeToNumber(user?.classGrade);

  const level = parseLevel(useStoredRaw(LEVEL_KEY));
  const progressRaw = useStoredRaw(PROGRESS_KEY);
  const progress = useMemo(() => parseProgress(progressRaw), [progressRaw]);
  const [langOverride, setLangOverride] = useState<RuleLang | null>(null);
  const [typeFilter, setTypeFilter] = useState<GrammarExerciseType[]>([]);

  const [screen, setScreen] = useState<GrammarScreen>("topics");
  const [topicId, setTopicId] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<GrammarResponse | null>(null);
  const [grade, setGrade] = useState<GrammarGrade | null>(null);
  const [hintShown, setHintShown] = useState(false);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [ruleOpen, setRuleOpen] = useState(false);

  const topic: GrammarTopic | null = topicId ? getGrammarTopic(topicId) ?? null : null;
  const current: QueueEntry | null = queue[index] ?? null;

  /** Rule/explanation language: L1 Hebrew, L3 English, L2 Hebrew (both shown in feedback). */
  const ruleLang: RuleLang = langOverride ?? (level === 3 ? "en" : "he");
  const showBothLangs = langOverride === null && level === 2;

  const setLevel = useCallback((l: LevelNumber) => writeRaw(LEVEL_KEY, String(l)), []);

  const groups = useMemo(
    () =>
      GRAMMAR_GROUPS.map((g) => ({
        group: g,
        topics: GRAMMAR_TOPICS.filter((t) => t.group === g.id),
      })).filter((g) => g.topics.length > 0),
    []
  );

  const availableTypes = useMemo(() => {
    const set = new Set<GrammarExerciseType>();
    for (const t of GRAMMAR_TOPICS) for (const i of getGrammarItems(t.id, level)) set.add(i.type);
    return [...set];
  }, [level]);

  const toggleType = useCallback((t: GrammarExerciseType) => {
    setTypeFilter((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }, []);

  const resetItemState = () => {
    setResponse(null);
    setGrade(null);
    setHintShown(false);
  };

  const startWithItems = useCallback((tid: string, items: GrammarItem[]) => {
    setTopicId(tid);
    setQueue(items.map((item) => ({ key: item.id, item, isRetry: false })));
    setIndex(0);
    setAttempts([]);
    resetItemState();
    setScreen("practice");
  }, []);

  const startTopic = useCallback(
    (tid: string) => {
      const all = getGrammarItems(tid, level);
      const filtered = typeFilter.length ? all.filter((i) => typeFilter.includes(i.type)) : all;
      startWithItems(tid, orderItems(filtered.length ? filtered : all));
    },
    [level, typeFilter, startWithItems]
  );

  const canCheck = current ? isResponseComplete(current.item, response) : false;

  const check = useCallback(() => {
    if (!current || !response || grade) return;
    const g = gradeGrammarItem(current.item, response);
    setGrade(g);
    if (!current.isRetry) {
      const points = hintShown ? g.score * HINT_PENALTY : g.score;
      setAttempts((prev) => [...prev, { item: current.item, response, grade: g, usedHint: hintShown, points }]);
    }
    // Wrong answers come back once at the end of the set.
    if (!g.isCorrect && !g.needsReview && !current.isRetry && current.item.type !== "write_own") {
      setQueue((prev) => [...prev, { key: `${current.item.id}:retry`, item: current.item, isRetry: true }]);
    }
  }, [current, response, grade, hintShown]);

  const finish = useCallback(
    (finalAttempts: AttemptRecord[]) => {
      if (topicId && finalAttempts.length) {
        const pct = Math.round(
          (finalAttempts.reduce((s, a) => s + a.points, 0) / finalAttempts.length) * 100
        );
        const key = `${topicId}:${level}`;
        const prev = parseProgress(readRaw(PROGRESS_KEY));
        writeRaw(PROGRESS_KEY, JSON.stringify({ ...prev, [key]: Math.max(prev[key] ?? 0, pct) }));
      }
      setScreen("results");
    },
    [topicId, level]
  );

  const next = useCallback(() => {
    if (index + 1 < queue.length) {
      setIndex(index + 1);
      resetItemState();
    } else {
      finish(attempts);
    }
  }, [index, queue.length, attempts, finish]);

  const practiceMissed = useCallback(() => {
    if (!topicId) return;
    const missed = attempts.filter((a) => !a.grade.isCorrect).map((a) => a.item);
    if (missed.length) startWithItems(topicId, missed);
  }, [attempts, topicId, startWithItems]);

  const backToTopics = useCallback(() => {
    setScreen("topics");
    setRuleOpen(false);
    resetItemState();
  }, []);

  const scorePct = attempts.length
    ? Math.round((attempts.reduce((s, a) => s + a.points, 0) / attempts.length) * 100)
    : 0;

  return {
    // profile
    studentGrade,
    level,
    setLevel,
    // language
    ruleLang,
    showBothLangs,
    setLangOverride,
    // topics screen
    groups,
    progress,
    availableTypes,
    typeFilter,
    toggleType,
    startTopic,
    // practice
    screen,
    topic,
    queue,
    index,
    current,
    response,
    setResponse,
    grade,
    canCheck,
    check,
    next,
    hintShown,
    setHintShown,
    ruleOpen,
    setRuleOpen,
    // results
    attempts,
    scorePct,
    practiceMissed,
    backToTopics,
  };
}

export type GrammarPracticeController = ReturnType<typeof useGrammarPractice>;
