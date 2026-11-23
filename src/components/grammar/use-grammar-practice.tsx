"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { readRaw, useStoredRaw, writeRaw } from "@/lib/use-stored-value";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { cleanForFirestore } from "@/lib/utils";
import { useClassGrade } from "@/components/shared/use-class-grade";
import { useHistoryStage } from "@/components/shared/use-history-stage";
import { hebrewGradeToNumber, labelToLevel, type ClassGrade, type LevelNumber } from "@/lib/levels";
import { gradeGrammarItem, isResponseComplete, matchesAny } from "@/lib/grammar-grading";
import { AI_GRADED_TYPES, type GrammarAiResponse } from "@/lib/grammar-ai";
import { itemPromptText, responseText } from "@/lib/grammar-format";
import { GRAMMAR_GROUPS, GRAMMAR_TOPICS, getGrammarItems, getGrammarTopic } from "@/data/grammar";
import { generateItems, generatorTypes, itemKey } from "@/lib/grammar-gen";
import type { TeacherAssignment } from "@/types/assignment";
import type { GrammarSubmissionEntry, SubmissionItem } from "@/types/submission";
import type {
  GrammarExerciseType,
  GrammarGrade,
  GrammarItem,
  GrammarResponse,
  GrammarTopic,
} from "@/types/grammar";
import type { RuleLang } from "@/components/grammar/grammar-rule-sheet";
import type { ClickedWordData } from "@/components/unseen/draggable-translation-popup";
import { translateToHebrew, cleanSingleWord } from "@/lib/translate-to-hebrew";
import { isWordSaved, removeWordByEnglish, saveWordToBuilder } from "@/lib/vocab-storage";
import { toPartOfSpeech } from "@/types/vocabulary";
import { optionalClass } from "@/lib/class-names";

const LEVEL_KEY = "ett_grammar_level";
const PROGRESS_KEY = "ett_grammar_progress";
const HINT_PENALTY = 0.75;
const AI_TIMEOUT_MS = 15000;

export type GrammarScreen = "topics" | "practice" | "results";
const GRAMMAR_SCREENS: readonly GrammarScreen[] = ["topics", "practice", "results"];

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

function aiKeyHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const groq = localStorage.getItem("ett_groq_api_key");
    const gemini = localStorage.getItem("ett_gemini_api_key");
    const openai = localStorage.getItem("ett_openai_api_key");
    if (groq) headers["x-groq-api-key"] = groq;
    if (gemini) headers["x-gemini-api-key"] = gemini;
    if (openai) headers["x-openai-api-key"] = openai;
  } catch {
    /* no personal keys */
  }
  return headers;
}

function cancelSpeech() {
  try {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  } catch {
    /* speech unavailable */
  }
}

const LATE_TYPES: GrammarExerciseType[] = ["cloze_text", "write_own"];

/** Questions in a practice round (assignments use the teacher's count). */
export const ROUND_SIZE = 20;
/** Hand-written items per topic in a round; the rest are freshly generated. */
const FIXED_PER_TOPIC = 5;
const SEEN_KEY = "ett.grammarSeen";
const SEEN_MAX = 400;

function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function rememberSeen(ids: string[]) {
  try {
    const next = [...readSeen().filter((x) => !ids.includes(x)), ...ids].slice(-SEEN_MAX);
    localStorage.setItem(SEEN_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}

/**
 * A practice round: per topic, a few hand-written items (ones not seen
 * recently first) and freshly generated items for the rest, so every round
 * is different. Topics without a generator use their hand-written items only.
 */
function buildRound(
  topicIds: string[],
  lvl: LevelNumber,
  grade: ClassGrade,
  types: GrammarExerciseType[],
  count: number
): GrammarItem[] {
  const seen = new Set(readSeen());
  const perTopic = Math.max(1, Math.ceil(count / topicIds.length));
  const out: GrammarItem[] = [];
  for (const tid of topicIds) {
    const all = getGrammarItems(tid, lvl, grade);
    if (!all.length) continue; // topic not taught at this grade / level
    const byType = types.length ? all.filter((i) => types.includes(i.type)) : all;
    const genTypes = generatorTypes(tid, lvl).filter((t) => !types.length || types.includes(t));
    const pool = byType.length || genTypes.length ? byType : all;
    const fresh = shuffle(pool.filter((i) => !seen.has(i.id)));
    const old = shuffle(pool.filter((i) => seen.has(i.id)));
    const fixedTarget = genTypes.length ? Math.min(FIXED_PER_TOPIC, perTopic) : perTopic;
    const fixed = [...fresh, ...old].slice(0, fixedTarget);
    const avoid = new Set(fixed.map(itemKey));
    const generated = genTypes.length
      ? generateItems(tid, grade, lvl, perTopic - fixed.length, { types: genTypes, avoid })
      : [];
    out.push(...fixed, ...generated);
  }
  rememberSeen(out.filter((i) => !i.id.startsWith("gen-")).map((i) => i.id));
  return orderItems(out).slice(0, count);
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function orderItems(items: GrammarItem[]): GrammarItem[] {
  const early = items.filter((i) => !LATE_TYPES.includes(i.type));
  const late = items.filter((i) => LATE_TYPES.includes(i.type));
  for (let i = early.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [early[i], early[j]] = [early[j], early[i]];
  }
  return [...early, ...late];
}

/** Does this answer deserve a second look by the AI grader? */
function wantsAi(item: GrammarItem, response: GrammarResponse, g: GrammarGrade): boolean {
  if (g.isCorrect) return false;
  if (!(AI_GRADED_TYPES as readonly string[]).includes(item.type)) return false;
  if (item.type === "find_fix") {
    // Only when the right word was picked but the correction isn't in the key.
    return response.type === "find_fix" && response.index === item.wrongIndex && response.value.trim() !== "";
  }
  if (item.type === "cloze_text" && response.type === "cloze_text") {
    return item.blanks.some((b, i) => (response.values[i] ?? "").trim() && !matchesAny(response.values[i], b.answers));
  }
  return response.type !== "unscramble" && "value" in response && response.value.trim() !== "";
}

export function useGrammarPractice() {
  const { user } = useAuth();
  const uid = user?.id ?? null;
  const isTeacher = user?.role === "teacher";
  const studentGrade: ClassGrade | null = hebrewGradeToNumber(user?.classGrade);

  const storedLevel = parseLevel(useStoredRaw(LEVEL_KEY));
  const progressRaw = useStoredRaw(PROGRESS_KEY);
  const progress = useMemo(() => parseProgress(progressRaw), [progressRaw]);
  const [langOverride, setLangOverride] = useState<RuleLang | null>(null);
  const [typeFilter, setTypeFilter] = useState<GrammarExerciseType[]>([]);

  // Teacher assignment (opened via ?assignmentId=…)
  const [assignment, setAssignment] = useState<TeacherAssignment | null>(null);
  const [assignmentError, setAssignmentError] = useState(false);
  const assignmentLevel = labelToLevel(assignment?.level);
  const level: LevelNumber = assignmentLevel ?? storedLevel;
  // Everyone may switch grade (default: own class); an assignment can fix it.
  const { grade, setGrade: setClassGrade } = useClassGrade(assignment?.grade ?? null);

  const [screen, setScreen] = useHistoryStage<GrammarScreen>("screen", "topics", GRAMMAR_SCREENS);
  const [sessionTopicIds, setSessionTopicIds] = useState<string[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<GrammarResponse | null>(null);
  const [grade_, setGrade] = useState<GrammarGrade | null>(null);
  const [aiChecking, setAiChecking] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  /** Whether the running session is a "practice the mistakes" follow-up. */
  const [isFollowUp, setIsFollowUp] = useState(false);
  /** First full attempt of the set – this is what gets submitted to the teacher. */
  const [officialAttempts, setOfficialAttempts] = useState<AttemptRecord[] | null>(null);
  const [ruleOpen, setRuleOpen] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);

  // Translation + read-aloud (same behaviour as Unseen / Conversation)
  const [clickedWord, setClickedWord] = useState<ClickedWordData | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  // Turn-in
  const [submitting, setSubmitting] = useState(false);
  const [receiptCode, setReceiptCode] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState(false);

  const current: QueueEntry | null = queue[index] ?? null;
  /** Topic of the current item (sessions may mix topics). */
  const topic: GrammarTopic | null =
    (current && getGrammarTopic(current.item.topicId)) ||
    (sessionTopicIds[0] ? getGrammarTopic(sessionTopicIds[0]) ?? null : null);

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
    for (const t of GRAMMAR_TOPICS) {
      const items = getGrammarItems(t.id, level, grade);
      for (const i of items) set.add(i.type);
      if (items.length) for (const g of generatorTypes(t.id, level)) set.add(g);
    }
    return [...set];
  }, [level, grade]);

  const toggleType = useCallback((t: GrammarExerciseType) => {
    setTypeFilter((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }, []);

  const resetItemState = () => {
    setResponse(null);
    setGrade(null);
    setHintShown(false);
    setAiChecking(false);
    setClickedWord(null);
    setSelectedText(null);
    setSpeakingKey(null);
    cancelSpeech();
  };

  const startWithItems = useCallback((topicIds: string[], items: GrammarItem[], followUp = false) => {
    setIsFollowUp(followUp);
    if (!followUp) setOfficialAttempts(null);
    setSessionTopicIds(topicIds);
    setQueue(items.map((item) => ({ key: item.id, item, isRetry: false })));
    setIndex(0);
    setAttempts([]);
    setReceiptCode(null);
    setSubmitError(false);
    resetItemState();
    setScreen("practice");
  }, []);

  const buildSet = useCallback(
    (topicIds: string[], lvl: LevelNumber, types: GrammarExerciseType[], count?: number) => {
      return buildRound(topicIds, lvl, grade, types, count && count > 0 ? count : ROUND_SIZE);
    },
    [grade]
  );

  const startTopic = useCallback(
    (tid: string) => startWithItems([tid], buildSet([tid], level, typeFilter)),
    [level, typeFilter, buildSet, startWithItems]
  );

  // Load an assignment from the URL once, then start it.
  const assignmentStarted = useRef(false);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("assignmentId");
    if (!id) return;
    let cancelled = false;
    const load = async (): Promise<TeacherAssignment | null> => {
      try {
        const raw = localStorage.getItem("ett_teacher_assignments");
        const local = raw ? (JSON.parse(raw) as TeacherAssignment[]).find((a) => a.id === id) : undefined;
        if (local) return local;
      } catch {
        /* ignore */
      }
      if (!db) return null;
      const snap = await getDoc(doc(db, "assignments", id));
      return snap.exists() ? { ...(snap.data() as TeacherAssignment), id: snap.id } : null;
    };
    load()
      .then((a) => {
        if (cancelled) return;
        if (a && a.type === "grammar" && a.grammarConfig?.topicIds.length) setAssignment(a);
        else setAssignmentError(true);
      })
      .catch(() => !cancelled && setAssignmentError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!assignment || assignmentStarted.current) return;
    const cfg = assignment.grammarConfig;
    if (!cfg) return;
    assignmentStarted.current = true;
    const lvl = labelToLevel(assignment.level) ?? storedLevel;
    const topicIds = cfg.topicIds.filter((t) => getGrammarTopic(t));
    if (!topicIds.length) return;
    // Starting the assignment reacts to the assignment arriving from Firestore (an external system).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startWithItems(topicIds, buildSet(topicIds, lvl, cfg.exerciseTypes ?? [], cfg.itemCount));
  }, [assignment, storedLevel, buildSet, startWithItems]);

  // Pull progress saved on other devices into this browser.
  useEffect(() => {
    if (!uid || !db) return;
    const database = db;
    let cancelled = false;
    getDoc(doc(database, "users", uid, "grammarProgress", "summary"))
      .then((snap) => {
        if (cancelled || !snap.exists()) return;
        const remote = (snap.data().best ?? {}) as Record<string, number>;
        const local = parseProgress(readRaw(PROGRESS_KEY));
        const merged: Record<string, number> = { ...local };
        for (const [k, v] of Object.entries(remote)) {
          if (typeof v === "number") merged[k] = Math.max(merged[k] ?? 0, v);
        }
        writeRaw(PROGRESS_KEY, JSON.stringify(merged));
      })
      .catch(() => {
        /* offline / no access – local progress still works */
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const canCheck = current ? isResponseComplete(current.item, response) && !aiChecking : false;

  const askAi = useCallback(
    async (item: GrammarItem, r: GrammarResponse): Promise<GrammarAiResponse | null> => {
      try {
        const res = await fetch("/api/evaluate-grammar", {
          method: "POST",
          headers: aiKeyHeaders(),
          body: JSON.stringify({ topicId: item.topicId, level, entries: [{ itemId: item.id, response: r }] }),
          signal: AbortSignal.timeout(AI_TIMEOUT_MS),
        });
        const data = (await res.json()) as GrammarAiResponse;
        return data.success ? data : null;
      } catch {
        return null;
      }
    },
    [level]
  );

  const check = useCallback(async () => {
    if (!current || !response || grade_ || aiChecking) return;
    const entry = current;
    const r = response;
    const usedHint = hintShown;
    let g = gradeGrammarItem(entry.item, r);

    if (wantsAi(entry.item, r, g)) {
      setAiChecking(true);
      const ai = await askAi(entry.item, r);
      const hit = ai?.results.find((x) => x.itemId === entry.item.id);
      if (hit) {
        const score = Math.max(g.score, hit.score);
        g = {
          ...g,
          score,
          isCorrect: score >= 0.999,
          // If the AI accepted everything, don't leave red marks on individual parts.
          parts: score >= 0.999 && g.parts ? g.parts.map(() => true) : g.parts,
          needsReview: false,
          feedbackHe: hit.feedbackHe || undefined,
          feedbackEn: hit.feedbackEn || undefined,
          aiGraded: true,
        };
      }
      setAiChecking(false);
    }

    setGrade(g);
    if (!entry.isRetry) {
      const points = usedHint ? g.score * HINT_PENALTY : g.score;
      setAttempts((prev) => [...prev, { item: entry.item, response: r, grade: g, usedHint, points }]);
    }
    // Wrong answers come back once at the end of the set.
    if (!g.isCorrect && !g.needsReview && !entry.isRetry && entry.item.type !== "write_own") {
      setQueue((prev) => [...prev, { key: `${entry.item.id}:retry`, item: entry.item, isRetry: true }]);
    }
  }, [current, response, grade_, aiChecking, hintShown, askAi]);

  const saveProgress = useCallback(
    (finalAttempts: AttemptRecord[]) => {
      if (!finalAttempts.length) return;
      const byTopic = new Map<string, AttemptRecord[]>();
      for (const a of finalAttempts) byTopic.set(a.item.topicId, [...(byTopic.get(a.item.topicId) ?? []), a]);
      const prev = parseProgress(readRaw(PROGRESS_KEY));
      const next = { ...prev };
      for (const [tid, list] of byTopic) {
        const pct = Math.round((list.reduce((s, a) => s + a.points, 0) / list.length) * 100);
        const key = `${tid}:${level}`;
        next[key] = Math.max(next[key] ?? 0, pct);
      }
      writeRaw(PROGRESS_KEY, JSON.stringify(next));
      if (uid && db) {
        setDoc(
          doc(db, "users", uid, "grammarProgress", "summary"),
          { best: next, updatedAt: new Date().toISOString() },
          { merge: true }
        ).catch(() => {
          /* local progress is enough if this fails */
        });
        // Grammar skill for the tutor (David): average best score across practised topics.
        const values = Object.values(next);
        const skill = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
        // updateDoc (not setDoc) so a missing tutor profile is never created half-empty.
        updateDoc(doc(db, "users", uid, "tutorProfile", "profile"), { "skills.grammar": skill }).catch(() => {
          /* no tutor profile yet */
        });
      }
    },
    [level, uid]
  );

  const next = useCallback(() => {
    if (aiChecking) return;
    if (index + 1 < queue.length) {
      setIndex(index + 1);
      resetItemState();
    } else {
      if (!isFollowUp) {
        saveProgress(attempts);
        setOfficialAttempts(attempts);
      }
      setScreen("results");
    }
  }, [aiChecking, index, queue.length, attempts, isFollowUp, saveProgress]);

  const practiceMissed = useCallback(() => {
    const missed = attempts.filter((a) => !a.grade.isCorrect).map((a) => a.item);
    if (missed.length) startWithItems(sessionTopicIds, missed, true);
  }, [attempts, sessionTopicIds, startWithItems]);

  const backToTopics = useCallback(() => {
    setScreen("topics");
    setRuleOpen(false);
    resetItemState();
  }, []);

  // ── Translation & read-aloud ──
  /** Reads English text aloud; pressing again on the same key stops it. */
  const handleSpeak = useCallback(
    (text: string, key?: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const id = key ?? text;
      try {
        const synth = window.speechSynthesis;
        if (synth.paused) synth.resume();
        const wasThis = speakingKey === id && (synth.speaking || synth.pending);
        synth.cancel();
        if (wasThis) {
          setSpeakingKey(null);
          return;
        }
        const clean = text.replace(/_+/g, " blank ").replace(/\s+/g, " ").trim();
        if (!clean) return;
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        const voice = synth.getVoices().find((v) => v.lang.startsWith("en"));
        if (voice) utterance.voice = voice;
        const done = () => setSpeakingKey((k) => (k === id ? null : k));
        utterance.onend = done;
        utterance.onerror = done;
        setSpeakingKey(id);
        synth.speak(utterance);
      } catch {
        setSpeakingKey(null);
      }
    },
    [speakingKey]
  );

  const handleSelectionUp = useCallback((e?: { target: EventTarget | null }) => {
    // Clicking a chip / typing in a box is answering, not highlighting.
    if (e?.target instanceof Element && e.target.closest("button, input, textarea")) {
      setSelectedText(null);
      return;
    }
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setSelectedText(null);
      return;
    }
    const text = sel.toString().trim().replace(/\s+/g, " ");
    setSelectedText(text.length >= 2 && /[a-zA-Z]/.test(text) ? text : null);
  }, []);

  const handleTranslateSelection = useCallback(
    async (raw: string) => {
      const isPhrase = /\s/.test(raw.trim());
      const word = isPhrase ? raw.trim().replace(/\s+/g, " ") : cleanSingleWord(raw);
      setSelectedText(null);
      if (!word || word.length < 2) return;
      const saved = isWordSaved(word, user?.id);
      setClickedWord({
        word,
        hebrew: isPhrase ? "מתרגם ביטוי/משפט..." : "מתרגם...",
        loading: true,
        saved,
        isSelection: isPhrase,
      });
      const res = await translateToHebrew(word);
      setClickedWord((prev) => {
        if (!prev || prev.word !== word) return prev; // a newer request replaced it
        return res
          ? { ...prev, hebrew: res.hebrew, partOfSpeech: res.partOfSpeech, example: res.example, loading: false }
          : { ...prev, hebrew: "לא נמצא תרגום", loading: false, saved: false };
      });
    },
    [user?.id]
  );

  const handleSaveClickedWord = useCallback(() => {
    if (!clickedWord || clickedWord.loading || clickedWord.hebrew === "לא נמצא תרגום") return;
    const title = topic?.title ?? "Grammar";
    saveWordToBuilder(
      {
        english: clickedWord.word,
        hebrew: clickedWord.hebrew,
        partOfSpeech: toPartOfSpeech(clickedWord.partOfSpeech) || "phrase",
        example: clickedWord.example || `From "${title}"`,
        level: "Personal Word",
        sourceType: "grammar",
        sourceTitle: title,
        sourceCategory: `Grammar (Level ${level})`,
      },
      user?.id
    );
    setClickedWord((prev) => (prev ? { ...prev, saved: true } : null));
  }, [clickedWord, topic?.title, level, user?.id]);

  const handleRemoveClickedWord = useCallback(() => {
    if (!clickedWord) return;
    removeWordByEnglish(clickedWord.word, user?.id);
    setClickedWord((prev) => (prev ? { ...prev, saved: false } : null));
  }, [clickedWord, user?.id]);

  const scorePct = attempts.length
    ? Math.round((attempts.reduce((s, a) => s + a.points, 0) / attempts.length) * 100)
    : 0;

  const submitToTeacher = useCallback(async () => {
    const attempts = officialAttempts;
    if (!assignment || !user || submitting || !attempts?.length) return;
    const scorePct = Math.round((attempts.reduce((s, a) => s + a.points, 0) / attempts.length) * 100);
    setSubmitting(true);
    setSubmitError(false);
    const entries: GrammarSubmissionEntry[] = attempts.map((a) => ({
      itemId: a.item.id,
      topicId: a.item.topicId,
      exerciseType: a.item.type,
      prompt: itemPromptText(a.item),
      studentAnswer: responseText(a.item, a.response),
      expected: a.grade.expected,
      points: Math.round(a.points * 100) / 100,
      isCorrect: a.grade.isCorrect,
      usedHint: a.usedHint,
      needsReview: a.grade.needsReview,
      feedbackHebrew: a.grade.feedbackHe || a.item.explanationHe,
      aiGraded: a.grade.aiGraded,
    }));
    const code = `ETT-GR-${Math.floor(100000 + Math.random() * 900000)}`;
    const topicTitles = sessionTopicIds.map((t) => getGrammarTopic(t)?.title ?? t).join(" + ");
    const submission: SubmissionItem = {
      id: `sub-grammar-${Date.now()}`,
      type: "grammar",
      studentId: user.id,
      studentName: user.name,
      studentClass: optionalClass(user.fullClass || user.classGrade || assignment.targetClass),
      studentGroup: user.group || assignment.targetGroup,
      teacherId: assignment.teacherId,
      teacherName: assignment.teacherName,
      assignmentId: assignment.id,
      taskId: sessionTopicIds[0] ?? assignment.id,
      taskTitle: assignment.title || topicTitles,
      hebrewTitle: assignment.hebrewTitle || topicTitles,
      grammarSummary: {
        topicIds: sessionTopicIds,
        level,
        grade,
        totalItems: attempts.length,
        correctItems: attempts.filter((a) => a.grade.isCorrect).length,
        entries,
      },
      score: scorePct,
      submittedAt: new Date().toLocaleString("he-IL"),
      receiptCode: code,
      status: "submitted",
      mode: "graded",
    };

    try {
      const raw = localStorage.getItem("ett_writing_submissions");
      const list: SubmissionItem[] = raw ? JSON.parse(raw) : [];
      list.unshift(submission);
      localStorage.setItem("ett_writing_submissions", JSON.stringify(list));
    } catch {
      /* local copy is a convenience only */
    }

    let ok = !db;
    if (db) {
      try {
        await setDoc(
          doc(db, "submissions", submission.id),
          cleanForFirestore({ ...submission, timestamp: new Date().toISOString() })
        );
        ok = true;
      } catch (err) {
        console.warn("Grammar submission failed:", err);
      }
    }
    setSubmitting(false);
    if (ok) setReceiptCode(code);
    else setSubmitError(true);
  }, [assignment, user, submitting, officialAttempts, sessionTopicIds, level, grade]);

  return {
    // profile
    isTeacher,
    studentGrade,
    classGrade: grade,
    setClassGrade,
    gradeLocked: Boolean(assignment?.grade),
    level,
    setLevel,
    levelLocked: assignmentLevel !== null,
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
    // assignment
    assignment,
    assignmentError,
    // practice
    screen,
    topic,
    queue,
    index,
    current,
    response,
    setResponse,
    grade: grade_,
    aiChecking,
    canCheck,
    check,
    next,
    hintShown,
    setHintShown,
    ruleOpen,
    setRuleOpen,
    aiSettingsOpen,
    setAiSettingsOpen,
    // translation + read-aloud
    clickedWord,
    setClickedWord,
    selectedText,
    setSelectedText,
    speakingKey,
    handleSpeak,
    handleSelectionUp,
    handleTranslateSelection,
    handleSaveClickedWord,
    handleRemoveClickedWord,
    // results
    attempts,
    isFollowUp,
    canSubmit: Boolean(officialAttempts?.length),
    scorePct,
    practiceMissed,
    backToTopics,
    submitToTeacher,
    submitting,
    receiptCode,
    submitError,
  };
}

export type GrammarPracticeController = ReturnType<typeof useGrammarPractice>;
