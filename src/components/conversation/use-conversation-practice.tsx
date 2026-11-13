"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { toPartOfSpeech } from "@/types/vocabulary";
import type { ConversationDraftPayload } from "@/types/draft";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/lib/utils";
import { SubmissionItem, SubmissionQuestionBreakdown } from "@/types/submission";
import { ConversationScenario, ConversationCategory, ConversationEvaluationResult } from "@/types/conversation";
import { REAL_LIFE_CONVERSATIONS, randomizeConversationQuestionsOptions } from "@/data/conversations";
import { lookupBuiltInTranslation } from "@/data/built-in-dictionary";
import {
  saveWordToBuilder,
  VocabItem,
  loadSavedWords,
  isWordSaved,
  normalizeVocabWord,
} from "@/lib/vocab-storage";
import { recordTaskCompletion, submitTaskToDavid, resolveFocusWordToReviewItem } from "@/lib/tutor-engine";
import { TutorVocabReviewItem } from "@/types/tutor";
import { TeacherAssignment } from "@/types/assignment";
import { useDialoguePlayer } from "@/lib/use-dialogue-player";
import { ClickedWordData } from "@/components/unseen/draggable-translation-popup";
import { saveDraft, deleteDraft, getDraftById } from "@/lib/drafts-storage";
import { LOCAL_SUBMISSIONS_KEY } from "@/components/conversation/conversation-helpers";
import { usePrintOptions } from "@/components/print/use-print-options";
import { segmentTextWithSavedVocab } from "@/components/unseen/unseen-helpers";

export function useConversationPractice() {
  const router = useRouter();
  const { user, teachers } = useAuth();
  const [scenarios, setScenarios] = useState<ConversationScenario[]>(REAL_LIFE_CONVERSATIONS);

  const [stage, setStage] = useState<"settings" | "exercise">("settings");
  const [mobileTab, setMobileTab] = useState<"text" | "questions">("text");

  const [selectedLevel, setSelectedLevel] = useState<"Level 1" | "Level 2" | "Level 3">("Level 2");
  const [selectedCategory, setSelectedCategory] = useState<ConversationCategory | "all">("all");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    REAL_LIFE_CONVERSATIONS.find((c) => c.level === "Level 2")?.id || REAL_LIFE_CONVERSATIONS[0].id
  );
  const [expandedScenarioId, setExpandedScenarioId] = useState<string | null>(null);
  const [mode, setMode] = useState<"practice" | "graded">("practice");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

  // Assignment & Tutor State
  const [assignedNotice, setAssignedNotice] = useState<string | null>(null);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<string | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<TeacherAssignment | null>(null);
  const [isFromDavid, setIsFromDavid] = useState(false);
  const [isTurningInToDavid, setIsTurningInToDavid] = useState(false);

  // Answers & Checking State
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [practiceEvaluation, setPracticeEvaluation] = useState<
    Record<string, { points: number; feedback: string; loading?: boolean }>
  >({});

  // Translation & Word Bank State
  const [clickedWord, setClickedWord] = useState<ClickedWordData | null>(null);
  const [savedWords, setSavedWords] = useState<VocabItem[]>([]);
  const [showVocabDrawer, setShowVocabDrawer] = useState(false);
  const [selectedPassageText, setSelectedPassageText] = useState<string | null>(null);
  const [questionTranslations, setQuestionTranslations] = useState<
    Record<string, { hebrew: string; loading: boolean; visible: boolean }>
  >({});

  // AI Scenario Generation State
  const [aiTopicInput, setAiTopicInput] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [aiNoticeType, setAiNoticeType] = useState<"success" | "error">("success");

  // Submission & Grading State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [studentNameInput, setStudentNameInput] = useState("");
  const [studentClassInput, setStudentClassInput] = useState("");
  const [studentNoteInput, setStudentNoteInput] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gradedScore, setGradedScore] = useState<number | null>(null);
  const [submissionRecord, setSubmissionRecord] = useState<SubmissionItem | null>(null);
  const [evaluationDetail, setEvaluationDetail] = useState<ConversationEvaluationResult | null>(null);

  // Celebration & Print State
  const [showPracticeConfetti, setShowPracticeConfetti] = useState(false);
  const [hasCelebratedPractice, setHasCelebratedPractice] = useState(false);

  // Draft State
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSavedTimeText, setLastSavedTimeText] = useState<string | null>(null);

  // Question TTS State
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [speakingQuestionId, setSpeakingQuestionId] = useState<string | null>(null);

  const dialogueContainerRef = useRef<HTMLDivElement | null>(null);
  const questionsContainerRef = useRef<HTMLDivElement | null>(null);

  // Current scenario
  const currentScenario = useMemo(() => {
    return (
      scenarios.find((s) => s.id === selectedScenarioId) ||
      scenarios.find((s) => s.level === selectedLevel) ||
      scenarios[0]
    );
  }, [scenarios, selectedScenarioId, selectedLevel]);

  const activeQuestion = currentScenario.questions[activeQuestionIndex] || currentScenario.questions[0];

  // Multi-Voice Dialogue Player
  const dialoguePlayer = useDialoguePlayer(currentScenario.turns, currentScenario.speakers);

  const savedVocabMap = useMemo(() => {
    const map = new Map<string, VocabItem>();
    for (const item of savedWords) {
      const key = normalizeVocabWord(item.english);
      if (key) map.set(key, item);
    }
    return map;
  }, [savedWords]);

  // Unique saved vocabulary words that appear in the dialogue (title or turns) — used for printing
  const dialogueSavedVocabWords = useMemo(() => {
    if (savedVocabMap.size === 0) return [];
    const seenIds = new Set<string>();
    const result: VocabItem[] = [];
    const allTexts = [currentScenario.title, ...currentScenario.turns.map((t) => t.text)];
    for (const txt of allTexts) {
      for (const seg of segmentTextWithSavedVocab(txt, savedVocabMap)) {
        if (seg.savedItem && !seenIds.has(seg.savedItem.id)) {
          seenIds.add(seg.savedItem.id);
          result.push(seg.savedItem);
        }
      }
    }
    return result;
  }, [currentScenario.title, currentScenario.turns, savedVocabMap]);

  // Print worksheet / exam options (shared with Unseen)
  const printOptions = usePrintOptions();

  // Initial mount & URL query params restoration
  useEffect(() => {
    setSavedWords(loadSavedWords(user?.id));
  }, [user?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    if (params.get("resumeFromVocab") === "1") {
      try {
        const rawSnap = sessionStorage.getItem("ett_conversation_return_snapshot");
        if (rawSnap) {
          const snap = JSON.parse(rawSnap);
          if (snap.currentScenario) {
            const restored = snap.currentScenario as ConversationScenario;
            setScenarios((prev) => [restored, ...prev.filter((s) => s.id !== restored.id)]);
            setSelectedLevel(snap.selectedLevel || restored.level || "Level 2");
            setSelectedScenarioId(restored.id);
          }
          setStage(snap.stage || "exercise");
          if (snap.mode) setMode(snap.mode);
          if (snap.userAnswers) setUserAnswers(snap.userAnswers);
          if (snap.checkedQuestions) setCheckedQuestions(snap.checkedQuestions);
          if (snap.practiceEvaluation) setPracticeEvaluation(snap.practiceEvaluation);
          if (typeof snap.activeQuestionIndex === "number") {
            setActiveQuestionIndex(snap.activeQuestionIndex);
          }
          return;
        }
      } catch {}
    }

    setScenarios((prev) =>
      prev.map((s) => ({
        ...s,
        questions: randomizeConversationQuestionsOptions(s.questions),
      }))
    );

    if (params.get("from") === "david") {
      setIsFromDavid(true);
    }
    if (params.get("stage") === "exercise") {
      setStage("exercise");
    }
    const levelParam = params.get("level") as "Level 1" | "Level 2" | "Level 3" | null;
    if (levelParam && ["Level 1", "Level 2", "Level 3"].includes(levelParam)) {
      setSelectedLevel(levelParam);
    }
    const scenarioParam = params.get("scenarioId") || params.get("passageId") || params.get("story");
    const assignIdParam = params.get("assignmentId");
    if (scenarioParam && scenarioParam !== "free_choice" && scenarioParam !== "adaptive_david") {
      const found = REAL_LIFE_CONVERSATIONS.find((s) => s.id === scenarioParam);
      if (found) {
        setSelectedLevel(found.level);
        setSelectedScenarioId(found.id);
        setStage("exercise");
        setMode(params.get("from") === "david" ? "practice" : "graded");
      }
    }
    if (assignIdParam) {
      setCurrentAssignmentId(assignIdParam);
      try {
        const rawAssigns = localStorage.getItem("ett_teacher_assignments");
        if (rawAssigns) {
          const parsed = JSON.parse(rawAssigns) as TeacherAssignment[];
          const matchedAssign = parsed.find((a) => a.id === assignIdParam);
          if (matchedAssign) {
            setActiveAssignment(matchedAssign);
            if (matchedAssign.level) setSelectedLevel(matchedAssign.level);
          }
        }
      } catch {}
      setAssignedNotice("💬 משימת תרגול שיחה מהמורה שלך: קראו והאזינו לשיחה, ענו על השאלות והגישו לבדיקה!");
    }
  }, []);

  // Pre-fill student & teacher info
  useEffect(() => {
    if (user) {
      if (user.name) setStudentNameInput(user.name);
      if (user.fullClass) setStudentClassInput(user.fullClass);
      if (user.teacherId) setSelectedTeacherId(user.teacherId);
    }
  }, [user]);

  useEffect(() => {
    if (!selectedTeacherId && teachers.length > 0) {
      setSelectedTeacherId(user?.teacherId || teachers[0].id);
    }
  }, [teachers, selectedTeacherId, user?.teacherId]);

  // Filtered scenarios for Settings Stage
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((s) => {
      if (s.level !== selectedLevel) return false;
      if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
      return true;
    });
  }, [scenarios, selectedLevel, selectedCategory]);

  // Draft Restoration & Auto-Save
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const draftIdParam = params.get("draftId");
    const targetDraftId =
      draftIdParam ||
      (currentAssignmentId
        ? `draft_conversation_assign_${currentAssignmentId}`
        : `draft_conversation_${currentScenario.id}`);

    const matched = getDraftById(targetDraftId);
    if (matched && matched.type === "conversation") {
      const payload = matched.payload as ConversationDraftPayload;
      if (payload?.userAnswers && Object.keys(payload.userAnswers).length > 0 && !isSubmitted) {
        if (payload.scenarioData) {
          const restored = payload.scenarioData as ConversationScenario;
          setScenarios((prev) => [restored, ...prev.filter((s) => s.id !== restored.id)]);
          setSelectedScenarioId(restored.id);
        }
        setUserAnswers(payload.userAnswers);
        if (payload.checkedQuestions) setCheckedQuestions(payload.checkedQuestions);
        if (typeof payload.activeQuestionIndex === "number") {
          setActiveQuestionIndex(payload.activeQuestionIndex);
        }
        if (payload.mode) setMode(payload.mode);
        if (draftIdParam) setStage("exercise");
      }
    }
  }, [currentScenario.id, currentAssignmentId, isSubmitted]);

  useEffect(() => {
    const answeredCount = Object.keys(userAnswers).filter(
      (k) => userAnswers[k] !== undefined && userAnswers[k] !== ""
    ).length;
    if (stage !== "exercise" || answeredCount === 0 || isSubmitted) return;

    setDraftStatus("saving");
    const timer = setTimeout(async () => {
      const draftId = currentAssignmentId
        ? `draft_conversation_assign_${currentAssignmentId}`
        : `draft_conversation_${currentScenario.id}`;
      const totalQ = currentScenario.questions.length || 10;
      const progressPercent = Math.min(100, Math.round((answeredCount / totalQ) * 100));

      await saveDraft({
        id: draftId,
        type: "conversation",
        studentId: user?.id || "guest",
        studentName: user?.name,
        title: currentScenario.title,
        hebrewTitle: currentScenario.hebrewTitle,
        progressPercent,
        summaryText: `${answeredCount} מתוך ${totalQ} שאלות נענו`,
        resumeUrl: `/conversation?scenarioId=${currentScenario.id}&mode=${mode}&draftId=${draftId}${
          currentAssignmentId ? `&assignmentId=${currentAssignmentId}` : ""
        }`,
        assignmentId: currentAssignmentId || undefined,
        payload: {
          scenarioId: currentScenario.id,
          level: selectedLevel,
          mode,
          userAnswers,
          checkedQuestions,
          activeQuestionIndex,
          scenarioData: currentScenario,
        },
      });
      setDraftStatus("saved");
      setLastSavedTimeText(
        new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })
      );
    }, 1200);

    return () => clearTimeout(timer);
  }, [
    userAnswers,
    checkedQuestions,
    activeQuestionIndex,
    stage,
    currentScenario,
    selectedLevel,
    mode,
    currentAssignmentId,
    isSubmitted,
    user?.id,
    user?.name,
  ]);

  const handleSaveAndExit = async () => {
    if (typeof window !== "undefined") {
      window.location.href = user?.role === "student" ? "/student" : "/";
    }
  };

  // ===========================================================================
  // TRANSLATION & SPEECH SUITE (100% Parity with Unseen)
  // ===========================================================================
  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      if (dialoguePlayer.isPlaying) {
        dialoguePlayer.pause();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      if (dialoguePlayer.speakerAVoiceURI) {
        const v = dialoguePlayer.voices.find(
          (item) => item.voice.voiceURI === dialoguePlayer.speakerAVoiceURI
        );
        if (v) utterance.voice = v.voice;
      }
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const handleSpeakText = (text: string, id?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      if (isSpeakingQuestion && speakingQuestionId === id) {
        window.speechSynthesis.cancel();
        setIsSpeakingQuestion(false);
        setSpeakingQuestionId(null);
        return;
      }
      window.speechSynthesis.cancel();
      if (dialoguePlayer.isPlaying) dialoguePlayer.pause();

      const clean = text.replace(/_+/g, " blank ").trim();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      if (dialoguePlayer.speakerAVoiceURI) {
        const v = dialoguePlayer.voices.find(
          (item) => item.voice.voiceURI === dialoguePlayer.speakerAVoiceURI
        );
        if (v) utterance.voice = v.voice;
      }

      setIsSpeakingQuestion(true);
      setSpeakingQuestionId(id || text);
      utterance.onend = () => {
        setIsSpeakingQuestion(false);
        setSpeakingQuestionId(null);
      };
      utterance.onerror = () => {
        setIsSpeakingQuestion(false);
        setSpeakingQuestionId(null);
      };
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeakingQuestion(false);
      setSpeakingQuestionId(null);
    }
  };

  const handleWordClick = async (rawWord: string) => {
    const clean = rawWord.trim().toLowerCase().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
    if (!clean || clean.length < 2) return;

    const alreadySaved = isWordSaved(clean, user?.id);

    setClickedWord({
      word: clean,
      hebrew: "מתרגם...",
      loading: true,
      saved: alreadySaved,
    });

    // 1. Check current scenario usefulPhrases
    const phraseMatch = currentScenario.usefulPhrases?.find(
      (p) => p.phrase.toLowerCase().replace(/[^a-zA-Z\s]/g, "").trim() === clean
    );
    if (phraseMatch) {
      setClickedWord({
        word: clean,
        hebrew: phraseMatch.translation,
        loading: false,
        example: `From "${currentScenario.title}"`,
        saved: alreadySaved,
      });
      return;
    }

    // 2. Check built-in offline dictionary
    const builtIn = lookupBuiltInTranslation(clean);
    if (builtIn) {
      setClickedWord({
        word: clean,
        hebrew: builtIn,
        loading: false,
        example: `From "${currentScenario.title}"`,
        saved: alreadySaved,
      });
      return;
    }

    // 3. Check localStorage cache
    const cacheKey = `trans_cache_${clean}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.hebrew) {
          setClickedWord({
            word: clean,
            hebrew: parsed.hebrew,
            partOfSpeech: parsed.partOfSpeech,
            loading: false,
            example: parsed.example || `From "${currentScenario.title}"`,
            saved: alreadySaved,
          });
          return;
        }
      }
    } catch {}

    // 4. Call server /api/translate-word
    try {
      const transHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (typeof window !== "undefined") {
        const groq = localStorage.getItem("ett_groq_api_key");
        const gemini = localStorage.getItem("ett_gemini_api_key");
        if (groq) transHeaders["x-groq-api-key"] = groq;
        if (gemini) transHeaders["x-gemini-api-key"] = gemini;
      }

      const res = await fetch("/api/translate-word", {
        method: "POST",
        headers: transHeaders,
        body: JSON.stringify({ word: clean }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.hebrew) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(data.data));
          } catch {}
          setClickedWord({
            word: clean,
            hebrew: data.data.hebrew,
            partOfSpeech: data.data.partOfSpeech,
            example: data.data.example || `From "${currentScenario.title}"`,
            loading: false,
            saved: alreadySaved,
          });
          return;
        }
      }
    } catch {}

    // 5. MyMemory fallback
    try {
      const fbUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|he`;
      const fbRes = await fetch(fbUrl);
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        const tr = fbData?.responseData?.translatedText;
        if (tr && typeof tr === "string" && !tr.includes("MYMEMORY WARNING")) {
          setClickedWord({
            word: clean,
            hebrew: tr.trim(),
            loading: false,
            example: `From "${currentScenario.title}"`,
            saved: alreadySaved,
          });
          return;
        }
      }
    } catch {}

    setClickedWord({
      word: clean,
      hebrew: "לא נמצא תרגום",
      loading: false,
      saved: false,
    });
  };

  const handleSaveClickedWord = () => {
    if (!clickedWord || clickedWord.loading || clickedWord.hebrew === "לא נמצא תרגום") return;
    saveWordToBuilder(
      {
        english: clickedWord.word,
        hebrew: clickedWord.hebrew,
        partOfSpeech: toPartOfSpeech(clickedWord.partOfSpeech) || "phrase",
        example: clickedWord.example || `From "${currentScenario.title}"`,
        level: "Personal Word",
        sourceType: "conversation",
        sourceTitle: currentScenario.title,
        sourceCategory: `Conversation (${currentScenario.level})`,
      },
      user?.id
    );
    setClickedWord((prev) => (prev ? { ...prev, saved: true } : null));
    setSavedWords(loadSavedWords(user?.id));
  };

  const handlePassageSelectionUp = () => {
    if (typeof window === "undefined") return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setSelectedPassageText(null);
      return;
    }
    const text = sel.toString().trim().replace(/\s+/g, " ");
    if (text.length >= 2 && /[a-zA-Z]/.test(text)) {
      setSelectedPassageText(text);
    } else {
      setSelectedPassageText(null);
    }
  };

  const handleTranslateSelection = async (selectedText: string) => {
    const clean = selectedText.trim().replace(/\s+/g, " ");
    if (!clean) return;

    if (!/\s/.test(clean)) {
      setSelectedPassageText(null);
      await handleWordClick(clean);
      return;
    }

    const normPhrase = normalizeVocabWord(clean);
    const savedMatch = normPhrase ? savedVocabMap.get(normPhrase) : undefined;
    const alreadySaved = Boolean(savedMatch) || isWordSaved(clean, user?.id);
    setSelectedPassageText(null);

    const phraseHint = currentScenario.usefulPhrases?.find(
      (p) => normalizeVocabWord(p.phrase) === normPhrase
    );
    if (phraseHint) {
      setClickedWord({
        word: clean,
        hebrew: phraseHint.translation,
        loading: false,
        example: `From "${currentScenario.title}"`,
        saved: alreadySaved,
        isSelection: true,
      });
      return;
    }

    setClickedWord({
      word: clean,
      hebrew: "מתרגם ביטוי/משפט...",
      loading: true,
      saved: alreadySaved,
      isSelection: true,
    });

    const cacheKey = `trans_sel_cache_${clean.toLowerCase()}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.hebrew) {
          setClickedWord({
            word: clean,
            hebrew: parsed.hebrew,
            loading: false,
            example: `From "${currentScenario.title}"`,
            saved: alreadySaved,
            isSelection: true,
          });
          return;
        }
      }
    } catch {}

    try {
      const transHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (typeof window !== "undefined") {
        const groq = localStorage.getItem("ett_groq_api_key");
        const gemini = localStorage.getItem("ett_gemini_api_key");
        if (groq) transHeaders["x-groq-api-key"] = groq;
        if (gemini) transHeaders["x-gemini-api-key"] = gemini;
      }

      const res = await fetch("/api/translate-word", {
        method: "POST",
        headers: transHeaders,
        body: JSON.stringify({ word: clean }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.hebrew) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(data.data));
          } catch {}
          setClickedWord({
            word: clean,
            hebrew: data.data.hebrew,
            loading: false,
            example: `From "${currentScenario.title}"`,
            saved: alreadySaved,
            isSelection: true,
          });
          return;
        }
      }
    } catch {}

    try {
      const fbUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|he`;
      const fbRes = await fetch(fbUrl);
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        const tr = fbData?.responseData?.translatedText;
        if (tr && typeof tr === "string" && !tr.includes("MYMEMORY WARNING")) {
          setClickedWord({
            word: clean,
            hebrew: tr.trim(),
            loading: false,
            example: `From "${currentScenario.title}"`,
            saved: alreadySaved,
            isSelection: true,
          });
          return;
        }
      }
    } catch {}

    setClickedWord({
      word: clean,
      hebrew: "לא נמצא תרגום",
      loading: false,
      saved: false,
      isSelection: true,
    });
  };

  const handleToggleQuestionTranslation = async (questionId: string, promptText: string) => {
    const existing = questionTranslations[questionId];
    if (existing && !existing.loading && existing.hebrew && existing.hebrew !== "לא נמצא תרגום") {
      setQuestionTranslations((prev) => ({
        ...prev,
        [questionId]: { ...existing, visible: !existing.visible },
      }));
      return;
    }

    const clean = promptText.trim().replace(/\s+/g, " ");
    if (!clean) return;

    setQuestionTranslations((prev) => ({
      ...prev,
      [questionId]: { hebrew: "מתרגם את השאלה...", loading: true, visible: true },
    }));

    const cacheKey = `trans_sel_cache_${clean.toLowerCase()}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.hebrew) {
          setQuestionTranslations((prev) => ({
            ...prev,
            [questionId]: { hebrew: parsed.hebrew, loading: false, visible: true },
          }));
          return;
        }
      }
    } catch {}

    try {
      const transHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (typeof window !== "undefined") {
        const groq = localStorage.getItem("ett_groq_api_key");
        const gemini = localStorage.getItem("ett_gemini_api_key");
        if (groq) transHeaders["x-groq-api-key"] = groq;
        if (gemini) transHeaders["x-gemini-api-key"] = gemini;
      }

      const res = await fetch("/api/translate-word", {
        method: "POST",
        headers: transHeaders,
        body: JSON.stringify({ word: clean }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.hebrew) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(data.data));
          } catch {}
          setQuestionTranslations((prev) => ({
            ...prev,
            [questionId]: { hebrew: data.data.hebrew, loading: false, visible: true },
          }));
          return;
        }
      }
    } catch {}

    try {
      const fbUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|he`;
      const fbRes = await fetch(fbUrl);
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        const tr = fbData?.responseData?.translatedText;
        if (tr && typeof tr === "string" && !tr.includes("MYMEMORY WARNING")) {
          setQuestionTranslations((prev) => ({
            ...prev,
            [questionId]: { hebrew: tr.trim(), loading: false, visible: true },
          }));
          return;
        }
      }
    } catch {}

    setQuestionTranslations((prev) => ({
      ...prev,
      [questionId]: { hebrew: "לא נמצא תרגום", loading: false, visible: true },
    }));
  };

  // ===========================================================================
  // AI SCENARIO GENERATION
  // ===========================================================================
  const handleGenerateAiScenario = async (customTopicOverride?: string) => {
    setIsGeneratingAi(true);
    setAiNotice(null);

    const topicToUse =
      customTopicOverride !== undefined
        ? customTopicOverride
        : aiTopicInput.trim() || "ordering food, traveling, or solving a problem with a friend";

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (typeof window !== "undefined") {
        const groq = localStorage.getItem("ett_groq_api_key");
        const gemini = localStorage.getItem("ett_gemini_api_key");
        const openai = localStorage.getItem("ett_openai_api_key");
        if (groq) headers["x-groq-api-key"] = groq;
        if (gemini) headers["x-gemini-api-key"] = gemini;
        if (openai) headers["x-openai-api-key"] = openai;
      }

      const res = await fetch("/api/generate-conversation", {
        method: "POST",
        headers,
        body: JSON.stringify({
          level: selectedLevel,
          topic: topicToUse,
          category: selectedCategory,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.scenario) {
        const newScenario: ConversationScenario = {
          ...data.scenario,
          generationPrompt: topicToUse,
          isAiGenerated: true,
          questions: randomizeConversationQuestionsOptions(data.scenario.questions),
        };
        setScenarios((prev) => [newScenario, ...prev.filter((s) => s.id !== newScenario.id)]);
        setSelectedScenarioId(newScenario.id);
        setExpandedScenarioId(newScenario.id);
        setActiveQuestionIndex(0);
        setUserAnswers({});
        setCheckedQuestions({});
        setPracticeEvaluation({});
        setIsSubmitted(false);
        setGradedScore(null);
        setEvaluationDetail(null);
        setHasCelebratedPractice(false);
        setAiNoticeType("success");
        setAiNotice(
          `✨ השיחה "${newScenario.title}" נוצרה בהצלחה עם 10 שאלות! לחצו על "התחל תרגול שיחה" כדי להתחיל.`
        );
      } else {
        setAiNoticeType("error");
        setAiNotice(
          data?.message || "לא ניתן היה ליצור שיחה חדשה כרגע. בדקו את מפתחות ה-AI או נסו שוב."
        );
      }
    } catch {
      setAiNoticeType("error");
      setAiNotice("שגיאת תקשורת עם שרת ה-AI. אנא נסו שוב.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // ===========================================================================
  // PRACTICE & GRADED AI EVALUATION
  // ===========================================================================
  const handleCheckPracticeAnswer = async (qId: string) => {
    setCheckedQuestions((prev) => ({ ...prev, [qId]: true }));
    const q = currentScenario.questions.find((item) => item.id === qId);
    if (!q) return;

    const rawAns = String(userAnswers[qId] || "").trim();

    if (q.type === "copy") {
      const cleanUser = rawAns.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
      const cleanTarget = (q.targetSentence || "")
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");
      if (cleanUser === cleanTarget) {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: { points: 10, feedback: "העתקה מושלמת ומדויקת של השורה מתוך השיחה! כל הכבוד!" },
        }));
      } else if (cleanTarget.includes(cleanUser) && cleanUser.length > 8) {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: {
            points: 8,
            feedback: "העתקת חלק נכון מהמשפט. מומלץ להעתיק את המשפט המלא מתחילתו ועד סופו.",
          },
        }));
      } else {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: {
            points: 0,
            feedback: `המשפט הנכון מהשיחה הוא: "${q.targetSentence}".`,
          },
        }));
      }
      return;
    }

    if (q.type === "open" || q.type === "reply_open") {
      setPracticeEvaluation((prev) => ({
        ...prev,
        [qId]: { points: 8, feedback: "בודק את תשובתך באמצעות ה-AI...", loading: true },
      }));

      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (typeof window !== "undefined") {
          const groq = localStorage.getItem("ett_groq_api_key");
          const gemini = localStorage.getItem("ett_gemini_api_key");
          const openai = localStorage.getItem("ett_openai_api_key");
          if (groq) headers["x-groq-api-key"] = groq;
          if (gemini) headers["x-gemini-api-key"] = gemini;
          if (openai) headers["x-openai-api-key"] = openai;
        }

        const res = await fetch("/api/evaluate-conversation", {
          method: "POST",
          headers,
          body: JSON.stringify({
            scenarioId: currentScenario.id,
            scenarioTitle: currentScenario.title,
            turns: currentScenario.turns,
            questions: [q],
            userAnswers: { [qId]: rawAns },
            studentName: user?.name || "תלמיד/ה",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const qEval = data?.evaluation?.breakdown?.[0];
          if (qEval) {
            setPracticeEvaluation((prev) => ({
              ...prev,
              [qId]: {
                points: qEval.points,
                feedback: qEval.feedbackHebrew || q.explanationHebrew,
                loading: false,
              },
            }));
            return;
          }
        }
      } catch {}

      // Fallback heuristic
      const lower = rawAns.toLowerCase();
      const expectedKws = (q.keywords || []).map((k) => k.toLowerCase());
      const matched = expectedKws.filter((kw) => lower.includes(kw));
      if (matched.length >= 2 || (rawAns.split(/\s+/).length >= 5 && matched.length >= 1)) {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: {
            points: 10,
            feedback:
              q.type === "reply_open"
                ? "תגובה מצוינת, מנומסת וטבעית לסיטואציה!"
                : "תשובה מצוינת ומדויקת לפי השיחה!",
            loading: false,
          },
        }));
      } else if (rawAns.length > 10) {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: {
            points: 7,
            feedback: `תשובה טובה! דוגמה לניסוח מלא: "${q.modelAnswer}".`,
            loading: false,
          },
        }));
      } else {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: {
            points: 2,
            feedback: q.explanationHebrew || `תשובה מומלצת: "${q.modelAnswer}".`,
            loading: false,
          },
        }));
      }
    }
  };

  const handleSubmitGradedExam = async () => {
    setIsSubmitting(true);

    const teacherObj = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
    const receiptCode = `ETT-CV-${Math.floor(100000 + Math.random() * 900000)}`;

    let evaluationResult: ConversationEvaluationResult | null = null;

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (typeof window !== "undefined") {
        const groq = localStorage.getItem("ett_groq_api_key");
        const gemini = localStorage.getItem("ett_gemini_api_key");
        const openai = localStorage.getItem("ett_openai_api_key");
        if (groq) headers["x-groq-api-key"] = groq;
        if (gemini) headers["x-gemini-api-key"] = gemini;
        if (openai) headers["x-openai-api-key"] = openai;
      }

      const res = await fetch("/api/evaluate-conversation", {
        method: "POST",
        headers,
        body: JSON.stringify({
          scenarioId: currentScenario.id,
          scenarioTitle: currentScenario.title,
          turns: currentScenario.turns,
          questions: currentScenario.questions,
          userAnswers,
          studentName: (studentNameInput.trim() || user?.name || "תלמיד/ה").trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.evaluation) {
          evaluationResult = data.evaluation;
        }
      }
    } catch {}

    let earned = 0;
    let breakdown: SubmissionQuestionBreakdown[] = [];

    if (evaluationResult) {
      earned = evaluationResult.score;
      setEvaluationDetail(evaluationResult);
      breakdown = evaluationResult.breakdown.map((item) => ({
        id: item.id,
        number: item.number,
        type: item.type,
        prompt: item.prompt,
        situationContext: item.situationContext,
        options: item.options || [],
        userAnswer: item.userAnswer,
        correctAnswer: item.correctAnswer,
        isCorrect: item.isCorrect,
        targetSentence: item.targetSentence || "",
        modelAnswer: item.modelAnswer || "",
        explanationHebrew: item.explanationHebrew || "",
        points: item.points,
        maxPoints: 10,
        feedbackHebrew: item.feedbackHebrew || "",
      }));
    } else {
      breakdown = currentScenario.questions.map((q) => {
        const ans = userAnswers[q.id];
        let isCorrect = false;
        let points = 0;
        if (q.type === "mcq" || q.type === "reply_mcq") {
          isCorrect = ans === q.correctIndex;
          points = isCorrect ? 10 : 0;
        } else {
          isCorrect = String(ans || "").trim().length > 6;
          points = isCorrect ? 8 : 0;
        }
        earned += points;
        return {
          id: q.id,
          number: q.number,
          type: q.type,
          prompt: q.prompt,
          situationContext: q.situationContext,
          options: q.options || [],
          userAnswer: ans,
          correctAnswer:
            q.type === "mcq" || q.type === "reply_mcq"
              ? q.correctIndex
              : q.targetSentence || q.modelAnswer,
          isCorrect,
          targetSentence: q.targetSentence || "",
          modelAnswer: q.modelAnswer || "",
          explanationHebrew: q.explanationHebrew || "",
          points,
          maxPoints: 10,
          feedbackHebrew: q.explanationHebrew || "",
        };
      });
    }

    const dialogueTranscript = currentScenario.turns
      .map((t) => {
        const spk =
          currentScenario.speakers.find((s) => s.id === t.speakerId)?.name || t.speakerId;
        return `[Line ${t.index + 1}] ${spk}: ${t.text}`;
      })
      .join("\n");

    const newSubmission: SubmissionItem = {
      id: `sub-conv-${Date.now()}`,
      type: "conversation",
      studentId: user?.id || `guest-${Date.now()}`,
      studentName: (studentNameInput.trim() || user?.name || "תלמיד/ה").trim(),
      teacherId: teacherObj ? teacherObj.id : teachers[0]?.id || "",
      teacherName: teacherObj ? teacherObj.name : teachers[0]?.name || "מורה לאנגלית",
      studentClass: studentClassInput || user?.fullClass || "חטיבת ביניים",
      studentGroup: user?.group || undefined,
      studentNote: studentNoteInput.trim(),
      assignmentId: currentAssignmentId || undefined,
      taskId: currentScenario.id,
      taskTitle: currentScenario.title,
      hebrewTitle: currentScenario.hebrewTitle,
      storyLevel: currentScenario.level,
      passageText: dialogueTranscript,
      generationPrompt: currentScenario.generationPrompt || "",
      isAiGenerated: Boolean(currentScenario.isAiGenerated),
      questionsBreakdown: breakdown,
      score: earned,
      grade: earned,
      encouragement:
        evaluationResult?.encouragement || "סיימת בהצלחה את תרגול השיחה מהחיים!",
      teacherNote: evaluationResult?.teacherNote,
      strengths: evaluationResult?.strengths,
      tips: evaluationResult?.tips,
      conversationRubric: evaluationResult?.rubric,
      submittedAt: new Date().toLocaleString("he-IL"),
      receiptCode,
      status: "submitted",
      mode: "graded",
    };

    try {
      const existingJson = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      const list: SubmissionItem[] = existingJson ? JSON.parse(existingJson) : [];
      list.unshift(newSubmission);
      localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(list));
    } catch {}

    if (db) {
      try {
        const payload = cleanForFirestore({
          ...newSubmission,
          timestamp: new Date().toISOString(),
        });
        await setDoc(doc(db, "submissions", newSubmission.id), payload, { merge: true });
      } catch {}
    }

    try {
      recordTaskCompletion(user?.id || "guest", "unseen", earned, newSubmission.taskTitle);
    } catch {}

    const draftId = currentAssignmentId
      ? `draft_conversation_assign_${currentAssignmentId}`
      : `draft_conversation_${currentScenario.id}`;
    deleteDraft(draftId, user?.id);

    setIsSubmitting(false);
    setGradedScore(earned);
    setIsSubmitted(true);
    setMode("graded");
    setSubmissionRecord(newSubmission);
    setShowSubmitModal(false);
    if (earned >= 80) {
      setShowPracticeConfetti(true);
      setTimeout(() => setShowPracticeConfetti(false), 3500);
    }
  };

  const handleTurnInToDavid = async () => {
    setIsTurningInToDavid(true);
    const finalScore = isSubmitted && gradedScore !== null ? gradedScore : 85;
    const vocabToReview: TutorVocabReviewItem[] = (currentScenario.usefulPhrases || [])
      .slice(0, 5)
      .map((p) => ({
        word: p.phrase,
        hebrew: p.translation,
      }));

    if (activeAssignment?.focusWords) {
      for (const fw of activeAssignment.focusWords) {
        const resolved = resolveFocusWordToReviewItem(fw);
        vocabToReview.push(resolved);
      }
    }

    await submitTaskToDavid(user?.id || "guest", {
      id: `turnin-conv-${Date.now()}`,
      type: "conversation",
      taskId: currentScenario.id,
      taskTitle: currentScenario.title,
      taskTitleHebrew: currentScenario.hebrewTitle,
      score: finalScore,
      completedAt: new Date().toISOString(),
      strengths: [
        "הבנה מצוינת של שיחה יומיומית באנגלית וניסוח תגובות מנומסות למצבי אמת!",
      ],
      improvements: [
        {
          suggestion: "Practice speaking the dialogue turns aloud!",
          explanationHebrew: "מומלץ להאזין לשיחה ולהקריא את התפקידים בקול רם לחיזוק שטף הדיבור.",
        },
      ],
      vocabToReview,
      assignmentId: currentAssignmentId || undefined,
      teacherName: activeAssignment?.teacherName,
      encouragement: "כל הכבוד על השלמת תרגול השיחה מהחיים!",
      teacherNote: `סיימת את השיחה "${currentScenario.hebrewTitle}" עם ציון ${finalScore}.`,
    });

    if (typeof window !== "undefined") {
      router.push("/tutor?turnIn=1");
    }
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] !== undefined && userAnswers[k] !== ""
  ).length;

  const isAllPracticeAnswered =
    mode === "practice" &&
    currentScenario.questions.length > 0 &&
    currentScenario.questions.every(
      (q) => userAnswers[q.id] !== undefined && userAnswers[q.id] !== ""
    );

  useEffect(() => {
    if (mode === "practice" && stage === "exercise" && isAllPracticeAnswered && !hasCelebratedPractice) {
      setShowPracticeConfetti(true);
      setHasCelebratedPractice(true);
    }
  }, [isAllPracticeAnswered, mode, stage, hasCelebratedPractice]);

  const handleOpenVocabPractice = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "ett_conversation_return_snapshot",
          JSON.stringify({
            currentScenario,
            selectedLevel,
            selectedScenarioId,
            stage,
            mode,
            userAnswers,
            checkedQuestions,
            practiceEvaluation,
            activeQuestionIndex,
          })
        );
      } catch {}
      router.push("/vocabulary?from=conversation");
    }
  };


  return {
    router,
    user,
    teachers,
    scenarios,
    setScenarios,
    stage,
    setStage,
    mobileTab,
    setMobileTab,
    selectedLevel,
    setSelectedLevel,
    selectedCategory,
    setSelectedCategory,
    selectedScenarioId,
    setSelectedScenarioId,
    expandedScenarioId,
    setExpandedScenarioId,
    mode,
    setMode,
    fontSize,
    setFontSize,
    assignedNotice,
    setAssignedNotice,
    currentAssignmentId,
    setCurrentAssignmentId,
    activeAssignment,
    setActiveAssignment,
    isFromDavid,
    setIsFromDavid,
    isTurningInToDavid,
    setIsTurningInToDavid,
    activeQuestionIndex,
    setActiveQuestionIndex,
    userAnswers,
    setUserAnswers,
    checkedQuestions,
    setCheckedQuestions,
    practiceEvaluation,
    setPracticeEvaluation,
    clickedWord,
    setClickedWord,
    savedWords,
    setSavedWords,
    showVocabDrawer,
    setShowVocabDrawer,
    selectedPassageText,
    setSelectedPassageText,
    questionTranslations,
    setQuestionTranslations,
    aiTopicInput,
    setAiTopicInput,
    isGeneratingAi,
    setIsGeneratingAi,
    aiNotice,
    setAiNotice,
    aiNoticeType,
    setAiNoticeType,
    showSubmitModal,
    setShowSubmitModal,
    studentNameInput,
    setStudentNameInput,
    studentClassInput,
    setStudentClassInput,
    studentNoteInput,
    setStudentNoteInput,
    selectedTeacherId,
    setSelectedTeacherId,
    isSubmitting,
    setIsSubmitting,
    isSubmitted,
    setIsSubmitted,
    gradedScore,
    setGradedScore,
    submissionRecord,
    setSubmissionRecord,
    evaluationDetail,
    setEvaluationDetail,
    showPracticeConfetti,
    setShowPracticeConfetti,
    hasCelebratedPractice,
    setHasCelebratedPractice,
    draftStatus,
    setDraftStatus,
    lastSavedTimeText,
    setLastSavedTimeText,
    isSpeakingQuestion,
    setIsSpeakingQuestion,
    speakingQuestionId,
    setSpeakingQuestionId,
    dialogueContainerRef,
    questionsContainerRef,
    currentScenario,
    activeQuestion,
    dialoguePlayer,
    savedVocabMap,
    dialogueSavedVocabWords,
    printOptions,
    filteredScenarios,
    handleSaveAndExit,
    handleSpeak,
    handleSpeakText,
    handleWordClick,
    handleSaveClickedWord,
    handlePassageSelectionUp,
    handleTranslateSelection,
    handleToggleQuestionTranslation,
    handleGenerateAiScenario,
    handleCheckPracticeAnswer,
    handleSubmitGradedExam,
    handleTurnInToDavid,
    answeredCount,
    isAllPracticeAnswered,
    handleOpenVocabPractice,
  };
}

export type ConversationPracticeController = ReturnType<typeof useConversationPractice>;
