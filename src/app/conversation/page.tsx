"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/lib/utils";
import { SubmissionItem, SubmissionQuestionBreakdown } from "@/types/submission";
import {
  ConversationScenario,
  ConversationCategory,
  ConversationEvaluationResult,
} from "@/types/conversation";
import {
  REAL_LIFE_CONVERSATIONS,
  CONVERSATION_CATEGORIES,
  randomizeConversationQuestionsOptions,
} from "@/data/conversations";
import { lookupBuiltInTranslation } from "@/data/built-in-dictionary";
import {
  saveWordToBuilder,
  VocabItem,
  loadSavedWords,
  isWordSaved,
  normalizeVocabWord,
} from "@/lib/vocab-storage";
import {
  recordTaskCompletion,
  submitTaskToDavid,
  resolveFocusWordToReviewItem,
} from "@/lib/tutor-engine";
import { TutorVocabReviewItem } from "@/types/tutor";
import { TeacherAssignment } from "@/types/assignment";
import { useDialoguePlayer } from "@/lib/use-dialogue-player";
import {
  DraggableTranslationPopup,
  ClickedWordData,
} from "@/components/unseen/draggable-translation-popup";
import { Confetti } from "@/components/confetti";
import { saveDraft, deleteDraft, getDraftById } from "@/lib/drafts-storage";
import type { InProgressWorkItem } from "@/types/draft";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  BookMarked,
  Dice5,
  Volume2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  CheckCircle2,
  Sparkles,
  Info,
  Printer,
  X,
  Award,
  HelpCircle,
  RotateCcw,
  Check,
  Target,
  Send,
  Sliders,
  BookOpen,
  AlertCircle,
  GraduationCap,
  Save,
  Clock,
  Languages,
  Loader2,
  UserCheck,
} from "lucide-react";

const LOCAL_SUBMISSIONS_KEY = "ett_writing_submissions";

function InteractiveEnglishText({
  text,
  onWordClick,
  className = "",
  stopEventPropagation = false,
}: {
  text: string;
  onWordClick: (word: string) => void;
  className?: string;
  stopEventPropagation?: boolean;
}) {
  if (!text) return null;
  const tokens = text.split(/(\s+)/);

  return (
    <span className={className}>
      {tokens.map((token, idx) => {
        const isSpace = /^\s+$/.test(token);
        if (isSpace) return <span key={idx}>{token}</span>;

        const hasEnglish = /[a-zA-Z]/.test(token);
        if (!hasEnglish) return <span key={idx}>{token}</span>;

        return (
          <span
            key={idx}
            onClick={(e) => {
              if (typeof window !== "undefined") {
                const sel = window.getSelection();
                if (sel && !sel.isCollapsed && sel.toString().trim().length > 1) {
                  return;
                }
              }
              if (stopEventPropagation) {
                e.stopPropagation();
              }
              onWordClick(token);
            }}
            className="cursor-pointer hover:bg-primary/20 hover:text-primary rounded px-0.5 transition-colors underline decoration-dotted decoration-muted-foreground/30 hover:decoration-primary"
            title={`Click to translate "${token.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "")}"`}
          >
            {token}
          </span>
        );
      })}
    </span>
  );
}

export default function ConversationPracticePage() {
  const { user, teachers } = useAuth();
  const [scenarios, setScenarios] = useState<ConversationScenario[]>(REAL_LIFE_CONVERSATIONS);

  const [stage, setStage] = useState<"settings" | "exercise">("settings");
  const [mobileTab, setMobileTab] = useState<"text" | "questions">("text");

  const [selectedLevel, setSelectedLevel] = useState<"Level 1" | "Level 2" | "Level 3">("Level 2");
  const [selectedCategory, setSelectedCategory] = useState<ConversationCategory | "all">("all");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    REAL_LIFE_CONVERSATIONS.find((c) => c.level === "Level 2")?.id || REAL_LIFE_CONVERSATIONS[0].id
  );
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
  const [showPracticeCompleteModal, setShowPracticeCompleteModal] = useState(false);
  const [hasCelebratedPractice, setHasCelebratedPractice] = useState(false);

  // Draft State
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSavedTimeText, setLastSavedTimeText] = useState<string | null>(null);
  const [activeDraftPrompt, setActiveDraftPrompt] = useState<InProgressWorkItem | null>(null);

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
      const payload = matched.payload as any;
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
        setActiveDraftPrompt(matched);
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
        partOfSpeech: (clickedWord.partOfSpeech as any) || "phrase",
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
      window.location.href = "/tutor?turnIn=1";
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
      setShowPracticeCompleteModal(true);
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
      window.location.href = "/vocabulary?from=conversation";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black">
      {showPracticeConfetti && <Confetti />}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {stage === "exercise" ? (
              <HeaderTooltip label="שינוי הגדרות / בחירת שיחה אחרת">
                <button
                  type="button"
                  onClick={() => {
                    dialoguePlayer.stop();
                    setStage("settings");
                  }}
                  className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition cursor-pointer shrink-0"
                  aria-label="הגדרות"
                >
                  <Sliders className="h-4 w-4" />
                </button>
              </HeaderTooltip>
            ) : (
              <HeaderTooltip label="חזרה לדף הראשי">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition-colors shrink-0"
                  aria-label="ראשי"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </HeaderTooltip>
            )}

            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs sm:text-sm font-medium tracking-tight text-foreground truncate font-sans">
                    Conversation Practice
                  </h1>
                  <span className="text-2xs text-muted-foreground hidden sm:inline">
                    • שיחות מהחיים
                  </span>
                </div>
                <p className="text-2xs text-muted-foreground truncate hidden sm:block">
                  {stage === "settings"
                    ? "בחירת תרחיש שיחה מהחיים האמיתיים"
                    : `${currentScenario.title} • 10 שאלות`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {stage === "exercise" && (
              <>
                {draftStatus === "saving" ? (
                  <span className="text-2xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 animate-spin text-amber-500" />
                    <span className="hidden sm:inline">שומר טיוטה...</span>
                  </span>
                ) : draftStatus === "saved" ? (
                  <span className="text-2xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span className="hidden sm:inline">נשמר {lastSavedTimeText || ""}</span>
                  </span>
                ) : null}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAndExit}
                  className="h-8 text-xs font-bold gap-1 cursor-pointer border-border/80"
                >
                  <Save className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">שמור וצא</span>
                </Button>
              </>
            )}

            <HeaderTooltip label="פנקס מילים אישי">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowVocabDrawer(true)}
                className="relative h-9 w-9 cursor-pointer"
                aria-label="פנקס מילים"
              >
                <BookMarked className="h-4 w-4 text-primary" />
                {savedWords.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-primary text-primary-foreground text-3xs font-bold flex items-center justify-center">
                    {savedWords.length}
                  </span>
                )}
              </Button>
            </HeaderTooltip>

            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Assigned Notice Banner */}
      {assignedNotice && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 text-xs" dir="rtl">
          <div className="container mx-auto flex items-center justify-between gap-2">
            <span className="font-medium text-foreground">{assignedNotice}</span>
            <button
              type="button"
              onClick={() => setAssignedNotice(null)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Selection Translate / Speak Bar */}
      {selectedPassageText && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card/95 backdrop-blur border border-primary/40 shadow-xl rounded-full px-3.5 py-1.5 flex items-center gap-2 animate-in fade-in-0 zoom-in-95 print:hidden"
          dir="rtl"
        >
          <span className="text-xs font-semibold text-foreground max-w-[180px] truncate" dir="ltr">
            &ldquo;{selectedPassageText}&rdquo;
          </span>
          <Button
            type="button"
            size="sm"
            onClick={() => handleTranslateSelection(selectedPassageText)}
            className="h-7 px-2.5 text-xs font-bold gap-1 cursor-pointer rounded-full"
          >
            <Languages className="h-3.5 w-3.5" />
            <span>תרגם קטע</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleSpeak(selectedPassageText)}
            className="h-7 px-2.5 text-xs font-bold gap-1 cursor-pointer rounded-full"
          >
            <Volume2 className="h-3.5 w-3.5 text-primary" />
            <span>הקרא</span>
          </Button>
          <button
            type="button"
            onClick={() => setSelectedPassageText(null)}
            className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-3 sm:px-8 py-6 pb-28">
        {stage === "settings" ? (
          <div className="max-w-5xl mx-auto space-y-6" dir="rtl">
            {/* Hero Intro */}
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-xs px-3 py-1 gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                <span>Real-Life English Conversations • שיחות מהחיים האמיתיים</span>
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                תרגול שיחות ומצבים מהחיים באנגלית
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
                האזינו לשיחות מציאותיות בין שני דוברים (במסעדה, בשדה התעופה, בחנות, במרפאה או עם חברים), לחצו על כל מילה לתרגום מיידי, ותרגלו גם הבנה וגם שאלות <strong>&ldquo;מה הייתם אומרים?&rdquo;</strong> בזמן אמת!
              </p>
            </div>

            {/* Step 1: Level & Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-border/70 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-primary" />
                    <span>1. בחרו רמת קושי (Level)</span>
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["Level 1", "Level 2", "Level 3"] as const).map((lvl) => {
                    const isSelected = selectedLevel === lvl;
                    const labelHe =
                      lvl === "Level 1"
                        ? "רמה 1 • בסיסי"
                        : lvl === "Level 2"
                        ? "רמה 2 • שוטף"
                        : "רמה 3 • מתקדם";
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setSelectedLevel(lvl);
                          const firstInLevel = scenarios.find(
                            (s) =>
                              s.level === lvl &&
                              (selectedCategory === "all" || s.category === selectedCategory)
                          );
                          if (firstInLevel) setSelectedScenarioId(firstInLevel.id);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground font-bold shadow-xs"
                            : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <div className="text-xs font-sans" dir="ltr">
                          {lvl}
                        </div>
                        <div className="text-2xs text-primary mt-0.5">{labelHe}</div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-4 border-border/70 bg-card space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary" />
                  <span>2. בחרו מצב תרגול (Mode)</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("practice")}
                    className={`p-2.5 rounded-xl border text-right transition cursor-pointer ${
                      mode === "practice"
                        ? "border-emerald-500 bg-emerald-500/10 text-foreground font-bold shadow-xs"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <div className="text-xs font-bold">אימון חופשי (Practice)</div>
                    <div className="text-2xs text-muted-foreground mt-0.5">
                      בדיקה מיידית והסבר לכל שאלה בנפרד
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("graded")}
                    className={`p-2.5 rounded-xl border text-right transition cursor-pointer ${
                      mode === "graded"
                        ? "border-purple-500 bg-purple-500/10 text-foreground font-bold shadow-xs"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <div className="text-xs font-bold">מבחן והגשה (Graded)</div>
                    <div className="text-2xs text-muted-foreground mt-0.5">
                      ציון מלא עם הערכת AI מפורטת והגשה למורה
                    </div>
                  </button>
                </div>
              </Card>
            </div>

            {/* Step 2: Real-World Category Filter */}
            <Card className="p-4 border-border/70 bg-card space-y-3">
              <h3 className="text-sm font-bold text-foreground">
                3. סננו לפי תחום מהחיים האמיתיים:
              </h3>
              <div className="flex flex-wrap gap-2">
                {CONVERSATION_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        const match = scenarios.find(
                          (s) =>
                            s.level === selectedLevel &&
                            (cat.id === "all" || s.category === cat.id)
                        );
                        if (match) setSelectedScenarioId(match.id);
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs flex items-center gap-1.5 transition cursor-pointer ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                          : "border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground"
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.labelHebrew}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Step 3: Custom AI Real-Life Scenario Generator */}
            <Card className="p-4 border-amber-500/30 bg-amber-500/5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-foreground">
                    מחולל שיחות AI מותאם אישית (בעברית או באנגלית)
                  </h3>
                </div>
                <Badge variant="outline" className="text-2xs border-amber-500/40 text-amber-600 dark:text-amber-400">
                  10 שאלות + הקראה בשני קולות
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  placeholder='לדוגמה: "קניית כרטיס סים בלונדון", "בקשת הארכת זמן מהמורה", "הזמנת גלידה"...'
                  className="flex-1 text-xs"
                />
                <Button
                  type="button"
                  disabled={isGeneratingAi}
                  onClick={() => handleGenerateAiScenario()}
                  className="gap-1.5 text-xs font-bold cursor-pointer shrink-0"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>יוצר שיחה מהחיים...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>צור שיחה חדשה ב-AI</span>
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isGeneratingAi}
                  onClick={() =>
                    handleGenerateAiScenario(
                      "a surprising and practical everyday conversation for middle school travelers"
                    )
                  }
                  className="gap-1.5 text-xs cursor-pointer shrink-0"
                >
                  <Dice5 className="h-4 w-4 text-primary" />
                  <span>הפתע אותי</span>
                </Button>
              </div>
              {aiNotice && (
                <p
                  className={`text-xs font-medium ${
                    aiNoticeType === "error"
                      ? "text-destructive"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {aiNotice}
                </p>
              )}
            </Card>

            {/* Step 4: Scenario Cards Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  4. בחרו תרחיש שיחה ({filteredScenarios.length} זמינים ב-{selectedLevel}):
                </h3>
                <Button
                  type="button"
                  onClick={() => {
                    setStage("exercise");
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                  className="gap-2 font-bold text-xs cursor-pointer"
                >
                  <span>התחל תרגול שיחה</span>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredScenarios.map((scen) => {
                  const isSelected = scen.id === currentScenario.id;
                  return (
                    <div
                      key={scen.id}
                      onClick={() => setSelectedScenarioId(scen.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-sm"
                          : "border-border/70 bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="secondary" className="text-2xs">
                            {scen.categoryLabelHebrew}
                          </Badge>
                          <div className="flex items-center gap-1.5">
                            {scen.isAiGenerated && (
                              <Badge className="bg-amber-500 text-white text-3xs">AI</Badge>
                            )}
                            <Badge variant="outline" className="text-2xs" dir="ltr">
                              {scen.level}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-foreground font-sans" dir="ltr">
                            {scen.title}
                          </h4>
                          <p className="text-xs font-medium text-primary">{scen.hebrewTitle}</p>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2" dir="ltr">
                          {scen.settingDescription}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-2xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>
                            {scen.speakers[0]?.avatarEmoji} {scen.speakers[0]?.name} &bull;{" "}
                            {scen.speakers[1]?.avatarEmoji} {scen.speakers[1]?.name}
                          </span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScenarioId(scen.id);
                            setStage("exercise");
                            window.scrollTo({ top: 0, behavior: "instant" });
                          }}
                          className="h-7 text-xs font-bold gap-1 cursor-pointer"
                        >
                          <span>תרגל עכשיו</span>
                          <ArrowLeft className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* =====================================================================
             STAGE 2: EXERCISE SPLIT-PANE VIEW (Dialogue on Left, Questions on Right)
             ===================================================================== */
          <div className="space-y-4">
            {/* Mobile Switcher Tabs */}
            <div className="lg:hidden grid grid-cols-2 gap-2 bg-muted/40 p-1 rounded-xl border border-border/60 print:hidden">
              <button
                type="button"
                onClick={() => setMobileTab("text")}
                className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mobileTab === "text"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground"
                }`}
              >
                💬 תמליל השיחה ({currentScenario.turns.length} שורות)
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("questions")}
                className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mobileTab === "questions"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground"
                }`}
              >
                ❓ שאלות ({answeredCount}/10)
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT PANE: INTERACTIVE DIALOGUE TRANSCRIPT (7 cols) */}
              <div
                className={`lg:col-span-7 space-y-4 ${
                  mobileTab === "text" ? "block" : "hidden lg:block"
                }`}
              >
                <Card className="border-border/60 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/50">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {currentScenario.level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {currentScenario.categoryLabelHebrew}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1.5 print:hidden">
                        {/* Font size controls */}
                        <div className="flex items-center rounded-lg border border-border/60 p-0.5 bg-muted/30">
                          {(["sm", "base", "lg"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setFontSize(sz)}
                              className={`px-2 py-0.5 text-2xs rounded-md transition cursor-pointer ${
                                fontSize === sz
                                  ? "bg-primary text-primary-foreground font-bold"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {sz === "sm" ? "A-" : sz === "base" ? "A" : "A+"}
                            </button>
                          ))}
                        </div>

                        <Button
                          type="button"
                          size="sm"
                          variant={dialoguePlayer.isPlaying ? "default" : "outline"}
                          onClick={() => {
                            if (!dialoguePlayer.isActive) {
                              dialoguePlayer.startDialogue();
                            } else {
                              dialoguePlayer.togglePlayPause();
                            }
                          }}
                          className="h-8 text-xs font-bold gap-1.5 cursor-pointer"
                        >
                          {dialoguePlayer.isPlaying ? (
                            <>
                              <Pause className="h-3.5 w-3.5" />
                              <span>השהה שיחה</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3.5 w-3.5 text-primary" />
                              <span>האזן לשיחה (2 קולות)</span>
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => window.print()}
                          className="h-8 text-xs gap-1 cursor-pointer"
                        >
                          <Printer className="h-3.5 w-3.5 text-primary" />
                          <span className="hidden sm:inline">Print</span>
                        </Button>
                      </div>
                    </div>

                    <div className="mt-2">
                      <CardTitle className="text-xl font-bold tracking-tight" dir="ltr">
                        <InteractiveEnglishText
                          text={currentScenario.title}
                          onWordClick={handleWordClick}
                        />
                      </CardTitle>
                      <p className="text-sm text-primary font-medium mt-0.5" dir="rtl">
                        {currentScenario.hebrewTitle}
                      </p>
                    </div>

                    {/* Scenario Setting & Sides of Conversation Banner */}
                    <div
                      className="mt-3 p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs text-foreground space-y-2.5"
                      dir="ltr"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2">
                        <span className="font-bold text-muted-foreground uppercase tracking-wider text-2xs flex items-center gap-1.5">
                          <span>📍 Setting:</span>
                          <span className="normal-case font-normal text-foreground">
                            <InteractiveEnglishText
                              text={currentScenario.settingDescription}
                              onWordClick={handleWordClick}
                            />
                          </span>
                        </span>
                      </div>

                      {/* Sides of the Conversation Legend */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-2xs font-extrabold uppercase tracking-wider text-muted-foreground">
                          Sides of the dialogue:
                        </span>
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          {/* Side A Chip */}
                          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/40 text-sky-900 dark:text-sky-100 font-medium shadow-2xs">
                            <span className="text-base">{currentScenario.speakers[0]?.avatarEmoji || "🗣️"}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded text-3xs font-black uppercase tracking-wide bg-sky-500/25 text-sky-800 dark:text-sky-200">
                                🔵 Side A
                              </span>
                              <strong className="font-bold text-xs">{currentScenario.speakers[0]?.name}</strong>
                              <span className="text-3xs text-muted-foreground">({currentScenario.speakers[0]?.role})</span>
                            </div>
                          </div>

                          <span className="text-muted-foreground text-xs font-bold">↔️</span>

                          {/* Side B Chip */}
                          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-100 font-medium shadow-2xs">
                            <span className="text-base">{currentScenario.speakers[1]?.avatarEmoji || "🗣️"}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded text-3xs font-black uppercase tracking-wide bg-emerald-500/25 text-emerald-800 dark:text-emerald-200">
                                🟢 Side B
                              </span>
                              <strong className="font-bold text-xs">{currentScenario.speakers[1]?.name}</strong>
                              <span className="text-3xs text-muted-foreground">({currentScenario.speakers[1]?.role})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="p-2 rounded-lg bg-muted/40 text-2xs text-muted-foreground flex items-center gap-2 mt-2 print:hidden"
                      dir="rtl"
                    >
                      <Info className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>
                        💡 <strong>טיפ שיחה:</strong> לחצו על <strong>כל מילה</strong> לתרגום מיידי,{" "}
                        <strong>סמנו ביטוי או משפט</strong> לתרגום מלא, או לחצו על רמקול ליד כל שורה כדי לשמוע איך הוגים אותה!
                      </span>
                    </div>
                  </CardHeader>

                  {/* Dialogue Turns (Chat Bubbles) */}
                  <CardContent
                    ref={dialogueContainerRef}
                    onMouseUp={handlePassageSelectionUp}
                    onTouchEnd={handlePassageSelectionUp}
                    onKeyUp={handlePassageSelectionUp}
                    className="pt-4 space-y-3 notranslate"
                    translate="no"
                    lang="en"
                  >
                    {currentScenario.turns.map((turn, tIdx) => {
                      const speaker =
                        currentScenario.speakers.find((s) => s.id === turn.speakerId) ||
                        currentScenario.speakers[tIdx % 2];
                      const isSpeakerA = speaker?.id === currentScenario.speakers[0]?.id;
                      const isSpokenNow =
                        dialoguePlayer.isActive && dialoguePlayer.currentTurnIndex === tIdx;
                      const isQuestionTarget =
                        activeQuestion && activeQuestion.turnRefIndex === tIdx;

                      const textSizeClass =
                        fontSize === "sm"
                          ? "text-sm leading-relaxed"
                          : fontSize === "lg"
                          ? "text-lg leading-loose"
                          : "text-base leading-relaxed";

                      return (
                        <div
                          key={tIdx}
                          id={`dialogue-turn-${tIdx}`}
                          className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                            /* Left/Right indentation to create an authentic chat messenger zigzag */
                            isSpeakerA
                              ? "mr-3 sm:mr-10 md:mr-14 rounded-tl-xs border-l-4 border-l-sky-500"
                              : "ml-3 sm:ml-10 md:ml-14 rounded-tr-xs border-r-4 border-r-emerald-500"
                          } ${
                            isSpokenNow
                              ? isSpeakerA
                                ? "border-sky-500 bg-sky-500/20 ring-2 ring-sky-500/50 shadow-md"
                                : "border-emerald-500 bg-emerald-500/20 ring-2 ring-emerald-500/50 shadow-md"
                              : isQuestionTarget
                              ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/40 shadow-xs"
                              : isSpeakerA
                              ? "border-sky-500/30 dark:border-sky-500/35 bg-sky-500/[0.05] dark:bg-sky-500/[0.10] hover:border-sky-500/50 shadow-2xs"
                              : "border-emerald-500/30 dark:border-emerald-500/35 bg-emerald-500/[0.05] dark:bg-emerald-500/[0.10] hover:border-emerald-500/50 shadow-2xs"
                          }`}
                        >
                          {/* Avatar & Line Indicator */}
                          <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                            <div
                              className={`h-10 w-10 rounded-2xl flex items-center justify-center text-xl shadow-xs transition-transform ${
                                isSpeakerA
                                  ? "bg-sky-500/15 text-sky-800 dark:text-sky-200 ring-2 ring-sky-500/30 border border-sky-500/40"
                                  : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/30 border border-emerald-500/40"
                              } ${isSpokenNow ? "scale-110 animate-pulse" : ""}`}
                            >
                              {speaker?.avatarEmoji || (isSpeakerA ? "👤" : "👥")}
                            </div>
                            <span
                              className={`px-1.5 py-0.5 rounded text-3xs font-black uppercase tracking-wider border ${
                                isSpeakerA
                                  ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30"
                                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                              }`}
                            >
                              Line {tIdx + 1}
                            </span>
                          </div>

                          {/* Bubble Content */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              {/* Prominent Side & Speaker Badge */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-2xs font-bold border ${
                                    isSpeakerA
                                      ? "bg-sky-500/15 text-sky-900 dark:text-sky-100 border-sky-500/35"
                                      : "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100 border-emerald-500/35"
                                  }`}
                                >
                                  <span className="font-extrabold">
                                    {isSpeakerA ? "🔵 Side A" : "🟢 Side B"}
                                  </span>
                                  <span>&bull;</span>
                                  <span className="font-black">{speaker?.name}</span>
                                </span>

                                <span className="text-2xs text-muted-foreground font-medium">
                                  ({speaker?.role})
                                </span>

                                {turn.stageDirection && (
                                  <span className="text-2xs italic text-muted-foreground px-2 py-0.5 rounded-md bg-background/70 border border-border/50">
                                    {turn.stageDirection}
                                  </span>
                                )}
                              </div>

                              {/* Action Buttons: Translate & Audio */}
                              <div className="flex items-center gap-1 shrink-0 print:hidden">
                                <button
                                  type="button"
                                  onClick={() => handleTranslateSelection(turn.text)}
                                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    isSpeakerA
                                      ? "text-sky-700 dark:text-sky-300 hover:bg-sky-500/15"
                                      : "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15"
                                  }`}
                                  title="תרגם שורה זו לעברית"
                                  aria-label="תרגם שורה זו"
                                >
                                  <Languages className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => dialoguePlayer.playSingleTurn(tIdx)}
                                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    isSpokenNow && dialoguePlayer.isPlaying
                                      ? isSpeakerA
                                        ? "bg-sky-600 text-white shadow-xs"
                                        : "bg-emerald-600 text-white shadow-xs"
                                      : isSpeakerA
                                      ? "text-sky-700 dark:text-sky-300 hover:bg-sky-500/15"
                                      : "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15"
                                  }`}
                                  title="האזן לשורה זו"
                                  aria-label="האזן לשורה זו"
                                >
                                  <Volume2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Spoken Text */}
                            <p className={`${textSizeClass} text-foreground font-sans pt-0.5 leading-relaxed`}>
                              <InteractiveEnglishText
                                text={turn.text}
                                onWordClick={handleWordClick}
                              />
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Useful Real-Life Phrases Box */}
                    {currentScenario.usefulPhrases && currentScenario.usefulPhrases.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-border/50" dir="rtl">
                        <p className="text-xs font-bold text-foreground mb-2.5 flex items-center gap-1.5">
                          <BookMarked className="h-4 w-4 text-amber-500" />
                          <span>Useful Real-Life Phrases (ביטויים שימושיים מהשיחה - לחצו לתרגום ושמירה):</span>
                        </p>
                        <div className="flex flex-wrap gap-2" dir="ltr">
                          {currentScenario.usefulPhrases.map((item, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => handleTranslateSelection(item.phrase)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs hover:bg-amber-500/20 transition cursor-pointer"
                            >
                              <span className="font-bold text-foreground">{item.phrase}</span>
                              <span className="text-muted-foreground">&bull;</span>
                              <span className="text-primary font-medium" dir="rtl">
                                {item.translation}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Mobile button to jump to questions */}
                <div className="lg:hidden">
                  <Button
                    onClick={() => setMobileTab("questions")}
                    className="w-full gap-2 font-bold text-xs h-10 cursor-pointer"
                  >
                    <span>מעבר לשאלות ({activeQuestionIndex + 1}/10)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* RIGHT PANE: 10 QUESTIONS & AI EVALUATION (5 cols) */}
              <div
                ref={questionsContainerRef}
                onMouseUp={handlePassageSelectionUp}
                onTouchEnd={handlePassageSelectionUp}
                onKeyUp={handlePassageSelectionUp}
                className={`lg:col-span-5 print:hidden ${
                  mobileTab === "questions" ? "block" : "hidden lg:block"
                }`}
              >
                <div className="lg:sticky lg:top-20 space-y-4">
                  {/* Question Pills (1-10) */}
                  <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
                    <div className="flex items-center justify-between mb-2" dir="rtl">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-primary" />
                        <span>שאלות הבנה ותגובה מהחיים (10)</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {answeredCount}/10 נענו
                      </span>
                    </div>

                    <div className="grid grid-cols-10 gap-1.5">
                      {currentScenario.questions.map((q, idx) => {
                        const isActive = idx === activeQuestionIndex;
                        const isAnswered =
                          userAnswers[q.id] !== undefined && userAnswers[q.id] !== "";
                        const isReplyType = q.type === "reply_mcq" || q.type === "reply_open";

                        let pillColor = "border-border/60 bg-muted/30 text-muted-foreground";
                        if (isActive) {
                          pillColor =
                            "border-primary bg-primary text-primary-foreground font-bold shadow-xs";
                        } else if (isAnswered) {
                          pillColor =
                            "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 font-semibold";
                        } else if (isReplyType) {
                          pillColor =
                            "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400";
                        }

                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setActiveQuestionIndex(idx)}
                            className={`h-8 rounded-lg border text-xs flex items-center justify-center transition cursor-pointer relative ${pillColor}`}
                            title={isReplyType ? "שאלת 'מה היית אומר/ת?'" : `שאלה ${idx + 1}`}
                          >
                            <span>{idx + 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Practice Completed Banner */}
                  {mode === "practice" && isAllPracticeAnswered && (
                    <div
                      className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-100 flex items-center justify-between gap-3 shadow-xs"
                      dir="rtl"
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold">
                          🎉 כל הכבוד! השלמת את כל 10 השאלות בשיחה!
                        </h4>
                        <p className="text-2xs text-muted-foreground">
                          תוכלו להגיש את התרגול למורה או למאמן ה-AI דיוויד לקבלת משוב מלא.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setShowSubmitModal(true)}
                          className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>הגש למורה</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Active Question Card */}
                  {activeQuestion && (
                    <Card className="border-border/60 shadow-xs">
                      <CardHeader className="pb-3 border-b border-border/50">
                        <div className="flex items-center justify-between" dir="rtl">
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="text-xs">
                              שאלה {activeQuestion.number}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-2xs ${
                                activeQuestion.type === "reply_mcq" ||
                                activeQuestion.type === "reply_open"
                                  ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                                  : ""
                              }`}
                            >
                              {activeQuestion.type === "mcq"
                                ? "הבנת השיחה (בחירה)"
                                : activeQuestion.type === "copy"
                                ? "ציטוט שורה מהשיחה"
                                : activeQuestion.type === "open"
                                ? "הבנה פתוחה"
                                : activeQuestion.type === "reply_mcq"
                                ? "💬 מה היית אומר/ת? (בחירה)"
                                : "💬 מה היית אומר/ת? (תגובה אישית)"}
                            </Badge>
                          </div>
                          <span className="text-xs font-semibold text-primary">
                            {activeQuestion.points} נקודות
                          </span>
                        </div>

                        {activeQuestion.linesHint && (
                          <button
                            type="button"
                            onClick={() => {
                              if (activeQuestion.turnRefIndex >= 0) {
                                const el = document.getElementById(
                                  `dialogue-turn-${activeQuestion.turnRefIndex}`
                                );
                                el?.scrollIntoView({ behavior: "smooth", block: "center" });
                              }
                            }}
                            className="text-2xs text-primary hover:underline mt-1 flex items-center gap-1 cursor-pointer"
                            dir="rtl"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>מיקום בשיחה: {activeQuestion.linesHint}</span>
                          </button>
                        )}

                        {/* Situation Context Callout for "What Would You Say?" questions */}
                        {activeQuestion.situationContext && (
                          <div
                            className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-foreground space-y-1"
                            dir="ltr"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-2xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                                🎭 Real-Life Situation
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleTranslateSelection(activeQuestion.situationContext!)
                                }
                                className="text-2xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Languages className="h-3 w-3" />
                                <span dir="rtl">תרגם סיטואציה</span>
                              </button>
                            </div>
                            <p className="leading-relaxed font-medium">
                              <InteractiveEnglishText
                                text={activeQuestion.situationContext}
                                onWordClick={handleWordClick}
                              />
                            </p>
                          </div>
                        )}

                        {/* Question Prompt + Translate & Speak Buttons */}
                        <div className="flex items-start justify-between gap-2 mt-2.5" dir="ltr">
                          <h3 className="text-sm font-semibold text-foreground leading-relaxed flex-1">
                            <InteractiveEnglishText
                              text={activeQuestion.prompt}
                              onWordClick={handleWordClick}
                            />
                          </h3>

                          <div className="flex items-center gap-1.5 shrink-0" dir="rtl">
                            <Button
                              type="button"
                              variant={
                                questionTranslations[activeQuestion.id]?.visible
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                handleToggleQuestionTranslation(
                                  activeQuestion.id,
                                  activeQuestion.prompt
                                )
                              }
                              className="h-8 px-2.5 text-xs font-bold gap-1.5 cursor-pointer"
                            >
                              <Languages className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">
                                {questionTranslations[activeQuestion.id]?.visible
                                  ? "הסתר תרגום"
                                  : "תרגם שאלה"}
                              </span>
                            </Button>

                            <Button
                              type="button"
                              variant={
                                isSpeakingQuestion && speakingQuestionId === activeQuestion.id
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                handleSpeakText(activeQuestion.prompt, activeQuestion.id)
                              }
                              className="h-8 px-2.5 text-xs font-bold gap-1.5 cursor-pointer"
                            >
                              {isSpeakingQuestion && speakingQuestionId === activeQuestion.id ? (
                                <>
                                  <Pause className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">עצור</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-3.5 w-3.5 text-primary" />
                                  <span className="hidden sm:inline">האזן לשאלה</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {questionTranslations[activeQuestion.id]?.visible && (
                          <div
                            className="mt-2.5 p-2.5 rounded-lg bg-primary/10 border border-primary/25 text-xs text-foreground flex items-start justify-between gap-2"
                            dir="rtl"
                          >
                            <div className="flex items-start gap-1.5">
                              <Languages className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-primary ml-1">תרגום השאלה:</span>
                                <span className="font-semibold text-foreground leading-relaxed">
                                  {questionTranslations[activeQuestion.id]?.hebrew}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setQuestionTranslations((prev) => ({
                                  ...prev,
                                  [activeQuestion.id]: {
                                    ...prev[activeQuestion.id],
                                    visible: false,
                                  },
                                }))
                              }
                              className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer shrink-0"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </CardHeader>

                      <CardContent className="pt-4 space-y-3" dir="ltr">
                        {/* Multiple Choice ('mcq' or 'reply_mcq') */}
                        {(activeQuestion.type === "mcq" || activeQuestion.type === "reply_mcq") &&
                          activeQuestion.options && (
                            <div className="space-y-2">
                              <div
                                className="flex items-center justify-between text-2xs text-muted-foreground px-0.5"
                                dir="rtl"
                              >
                                <span>
                                  {activeQuestion.type === "reply_mcq"
                                    ? "בחרו את התגובה הטבעית והמנומסת ביותר:"
                                    : "בחרו את התשובה הנכונה לפי השיחה:"}
                                </span>
                                <span className="text-primary">💡 לחצו על מילה או אייקון לתרגום</span>
                              </div>
                              {activeQuestion.options.map((option, optIdx) => {
                                const isSelected = userAnswers[activeQuestion.id] === optIdx;
                                const isChecked = checkedQuestions[activeQuestion.id];
                                const isCorrectOption = optIdx === activeQuestion.correctIndex;

                                let optStyle =
                                  "border-border/60 hover:bg-muted/40 hover:border-border";
                                if (mode === "practice" && isChecked) {
                                  if (isCorrectOption) {
                                    optStyle =
                                      "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold";
                                  } else if (isSelected && !isCorrectOption) {
                                    optStyle =
                                      "border-destructive bg-destructive/10 text-destructive font-medium";
                                  }
                                } else if (isSelected) {
                                  optStyle =
                                    "border-primary bg-primary/10 text-foreground font-semibold shadow-xs";
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => {
                                      setUserAnswers((prev) => ({
                                        ...prev,
                                        [activeQuestion.id]: optIdx,
                                      }));
                                      if (mode === "practice") {
                                        setCheckedQuestions((prev) => ({
                                          ...prev,
                                          [activeQuestion.id]: true,
                                        }));
                                      }
                                    }}
                                    className={`w-full p-3 rounded-lg border text-left text-xs transition cursor-pointer flex items-start gap-2.5 ${optStyle}`}
                                  >
                                    <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center shrink-0 text-2xs font-bold mt-0.5">
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="flex-1 leading-relaxed">
                                      <InteractiveEnglishText
                                        text={option}
                                        onWordClick={handleWordClick}
                                        stopEventPropagation
                                      />
                                    </span>
                                    <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleTranslateSelection(option);
                                        }}
                                        className="p-1 rounded-md text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition cursor-pointer"
                                        title="תרגם אפשרות זו לעברית"
                                      >
                                        <Languages className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSpeakText(
                                            option,
                                            `${activeQuestion.id}-opt-${optIdx}`
                                          );
                                        }}
                                        className="p-1 rounded-md text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition cursor-pointer"
                                        title="האזן לאפשרות זו באנגלית"
                                      >
                                        <Volume2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                        {/* Copy Line Question */}
                        {activeQuestion.type === "copy" && (
                          <div className="space-y-2">
                            <label className="text-xs text-muted-foreground block" dir="rtl">
                              העתיקו את המשפט המדויק מתוך השורה המתאימה בשיחה:
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Type or copy the exact sentence from the conversation..."
                              value={(userAnswers[activeQuestion.id] as string) || ""}
                              onChange={(e) =>
                                setUserAnswers((prev) => ({
                                  ...prev,
                                  [activeQuestion.id]: e.target.value,
                                }))
                              }
                              className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                            />
                          </div>
                        )}

                        {/* Open Comprehension or Open Real-Life Reply */}
                        {(activeQuestion.type === "open" ||
                          activeQuestion.type === "reply_open") && (
                          <div className="space-y-2">
                            <label className="text-xs text-muted-foreground block" dir="rtl">
                              {activeQuestion.type === "reply_open"
                                ? "כתבו באנגלית מה הייתם אומרים בסיטואציה זו (1–2 משפטים טבעיים ומנומסים):"
                                : "ענו באנגלית במילים שלכם על פי המידע בשיחה:"}
                            </label>
                            <textarea
                              rows={3}
                              placeholder={
                                activeQuestion.type === "reply_open"
                                  ? 'e.g., "Excuse me, could I please have..."'
                                  : "Write your answer in English..."
                              }
                              value={(userAnswers[activeQuestion.id] as string) || ""}
                              onChange={(e) =>
                                setUserAnswers((prev) => ({
                                  ...prev,
                                  [activeQuestion.id]: e.target.value,
                                }))
                              }
                              className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                          </div>
                        )}

                        {/* Practice Mode Check Button & Feedback */}
                        {mode === "practice" && (
                          <div className="space-y-2 pt-1" dir="rtl">
                            {(activeQuestion.type === "copy" ||
                              activeQuestion.type === "open" ||
                              activeQuestion.type === "reply_open") && (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleCheckPracticeAnswer(activeQuestion.id)}
                                disabled={
                                  !userAnswers[activeQuestion.id] ||
                                  practiceEvaluation[activeQuestion.id]?.loading
                                }
                                className="w-full text-xs font-bold gap-1.5 cursor-pointer"
                              >
                                {practiceEvaluation[activeQuestion.id]?.loading ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>בודק תשובה ב-AI...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>בדוק תשובה ב-AI</span>
                                  </>
                                )}
                              </Button>
                            )}

                            {checkedQuestions[activeQuestion.id] && (
                              <div className="p-3 rounded-xl bg-primary/10 border border-primary/25 text-xs space-y-1.5">
                                <div className="font-bold text-primary flex items-center justify-between">
                                  <span>הסבר ומשוב:</span>
                                  {practiceEvaluation[activeQuestion.id] && (
                                    <Badge variant="secondary" className="text-2xs">
                                      {practiceEvaluation[activeQuestion.id].points}/10 נק׳
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-foreground leading-relaxed">
                                  {practiceEvaluation[activeQuestion.id]?.feedback ||
                                    activeQuestion.explanationHebrew}
                                </p>
                                {activeQuestion.modelAnswer && (
                                  <p className="text-2xs text-muted-foreground pt-1" dir="ltr">
                                    <strong>Sample Answer:</strong> &ldquo;{activeQuestion.modelAnswer}&rdquo;
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>

                      <CardFooter
                        className="border-t border-border/50 pt-3 flex items-center justify-between gap-2"
                        dir="rtl"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={activeQuestionIndex === 0}
                          onClick={() => setActiveQuestionIndex((i) => Math.max(0, i - 1))}
                          className="text-xs cursor-pointer"
                        >
                          הקודם
                        </Button>

                        {activeQuestionIndex < currentScenario.questions.length - 1 ? (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              setActiveQuestionIndex((i) =>
                                Math.min(currentScenario.questions.length - 1, i + 1)
                              )
                            }
                            className="text-xs font-bold cursor-pointer"
                          >
                            השאלה הבאה ←
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setShowSubmitModal(true)}
                            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>סיים והגש לבדיקת AI</span>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  )}

                  {/* Full AI Evaluation Result Card (After Graded Submission) */}
                  {isSubmitted && evaluationDetail && (
                    <Card className="border-emerald-500/40 bg-card shadow-md p-4 space-y-4" dir="rtl">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <div>
                          <Badge className="bg-emerald-600 text-white text-2xs mb-1">
                            ✓ הערכת AI הושלמה
                          </Badge>
                          <h3 className="font-bold text-base text-foreground">
                            ציון סופי בשיחה: {evaluationDetail.score}/100
                          </h3>
                          {submissionRecord?.receiptCode && (
                            <p className="text-2xs text-muted-foreground">
                              אסמכתא: {submissionRecord.receiptCode}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={handleTurnInToDavid}
                          disabled={isTurningInToDavid}
                          className="text-xs font-bold gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          <span>המשך אימון עם דיוויד</span>
                        </Button>
                      </div>

                      <p className="text-xs font-medium text-foreground">
                        {evaluationDetail.encouragement}
                      </p>

                      {/* 4-Category Conversation Rubric */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                          <div className="flex justify-between font-bold">
                            <span>הבנת פרטי השיחה</span>
                            <span className="text-primary">
                              {evaluationDetail.rubric.explicitDetails.score}/30
                            </span>
                          </div>
                          <p className="text-2xs text-muted-foreground mt-1">
                            {evaluationDetail.rubric.explicitDetails.commentHebrew}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                          <div className="flex justify-between font-bold">
                            <span>כוונת הדובר וביטויים</span>
                            <span className="text-primary">
                              {evaluationDetail.rubric.inferenceAndPragmatics.score}/25
                            </span>
                          </div>
                          <p className="text-2xs text-muted-foreground mt-1">
                            {evaluationDetail.rubric.inferenceAndPragmatics.commentHebrew}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                          <div className="flex justify-between font-bold">
                            <span>תגובה למצבים מהחיים</span>
                            <span className="text-primary">
                              {evaluationDetail.rubric.realLifeResponse.score}/30
                            </span>
                          </div>
                          <p className="text-2xs text-muted-foreground mt-1">
                            {evaluationDetail.rubric.realLifeResponse.commentHebrew}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                          <div className="flex justify-between font-bold">
                            <span>דיוק לשוני והעתקה</span>
                            <span className="text-primary">
                              {evaluationDetail.rubric.languageAndAccuracy.score}/15
                            </span>
                          </div>
                          <p className="text-2xs text-muted-foreground mt-1">
                            {evaluationDetail.rubric.languageAndAccuracy.commentHebrew}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Multi-Voice Dialogue Player Dock */}
      {stage === "exercise" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur-md py-2.5 px-3 sm:px-6 shadow-xl print:hidden">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={dialoguePlayer.skipBack}
                className="h-8 w-8 cursor-pointer"
                title="שורה קודמת"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (!dialoguePlayer.isActive) {
                    dialoguePlayer.startDialogue();
                  } else {
                    dialoguePlayer.togglePlayPause();
                  }
                }}
                className="h-8 px-3 text-xs font-bold gap-1.5 cursor-pointer"
              >
                {dialoguePlayer.isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>השהה</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>נגן שיחה</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={dialoguePlayer.skipForward}
                className="h-8 w-8 cursor-pointer"
                title="שורה הבאה"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </Button>

              <span className="text-xs text-muted-foreground font-medium ml-2">
                Line {dialoguePlayer.currentTurnIndex + 1} / {dialoguePlayer.totalTurns}
              </span>

              {dialoguePlayer.isActive && (() => {
                const currentTurn = currentScenario.turns[dialoguePlayer.currentTurnIndex];
                const currentSpk = currentTurn
                  ? currentScenario.speakers.find((s) => s.id === currentTurn.speakerId) ||
                    currentScenario.speakers[dialoguePlayer.currentTurnIndex % 2]
                  : null;
                const isSpkA = currentSpk?.id === currentScenario.speakers[0]?.id;
                return currentSpk ? (
                  <div
                    className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-2xs font-bold border transition-colors ${
                      isSpkA
                        ? "bg-sky-500/15 text-sky-800 dark:text-sky-200 border-sky-500/35"
                        : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-500/35"
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSpkA ? "bg-sky-400" : "bg-emerald-400"}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isSpkA ? "bg-sky-500" : "bg-emerald-500"}`} />
                    </span>
                    <span>{isSpkA ? "🔵 Side A:" : "🟢 Side B:"}</span>
                    <span>{currentSpk.name}</span>
                    <span className="text-muted-foreground font-normal">({currentSpk.role})</span>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Speed & Dual Speaker Voice Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5 bg-muted/30">
                {[0.8, 0.92, 1.0, 1.15].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => dialoguePlayer.changeRate(r)}
                    className={`px-2 py-0.5 text-2xs rounded-md transition cursor-pointer ${
                      Math.abs(dialoguePlayer.rate - r) < 0.03
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === 0.92 ? "0.9x" : `${r}x`}
                  </button>
                ))}
              </div>

              {dialoguePlayer.voices.length > 1 && (
                <div className="hidden md:flex items-center gap-2 text-2xs">
                  <select
                    value={dialoguePlayer.speakerAVoiceURI}
                    onChange={(e) => dialoguePlayer.changeSpeakerAVoice(e.target.value)}
                    className="h-7 rounded-md border border-border/60 bg-background px-2 text-2xs"
                    title={`Voice for ${currentScenario.speakers[0]?.name}`}
                  >
                    {dialoguePlayer.voices.slice(0, 8).map((v) => (
                      <option key={v.voice.voiceURI} value={v.voice.voiceURI}>
                        {currentScenario.speakers[0]?.avatarEmoji} {currentScenario.speakers[0]?.name}:{" "}
                        {v.displayName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={dialoguePlayer.speakerBVoiceURI}
                    onChange={(e) => dialoguePlayer.changeSpeakerBVoice(e.target.value)}
                    className="h-7 rounded-md border border-border/60 bg-background px-2 text-2xs"
                    title={`Voice for ${currentScenario.speakers[1]?.name}`}
                  >
                    {dialoguePlayer.voices.slice(0, 8).map((v) => (
                      <option key={v.voice.voiceURI} value={v.voice.voiceURI}>
                        {currentScenario.speakers[1]?.avatarEmoji} {currentScenario.speakers[1]?.name}:{" "}
                        {v.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Draggable Translation Popup */}
      <DraggableTranslationPopup
        clickedWord={clickedWord}
        isSpeechActive={stage === "exercise"}
        onSpeak={handleSpeak}
        onSaveWord={handleSaveClickedWord}
        onClose={() => setClickedWord(null)}
        onOpenDrawer={() => setShowVocabDrawer(true)}
      />

      {/* Personal Word Bank Drawer Modal */}
      {showVocabDrawer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <Card className="w-full max-w-md p-5 space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base">פנקס המילים האישי ({savedWords.length})</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVocabDrawer(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {savedWords.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  לחצו על כל מילה או ביטוי בשיחה כדי לתרגם ולהוסיף לפנקס המילים שלכם!
                </p>
              ) : (
                savedWords.slice(0, 20).map((w) => (
                  <div
                    key={w.id}
                    className="p-2.5 rounded-lg border border-border/60 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold font-sans" dir="ltr">
                      {w.english}
                    </span>
                    <span className="text-primary font-medium">{w.hebrew}</span>
                  </div>
                ))
              )}
            </div>
            <div className="pt-2 border-t border-border flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowVocabDrawer(false)}
                className="text-xs cursor-pointer"
              >
                המשך בשיחה
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleOpenVocabPractice}
                className="text-xs font-bold cursor-pointer"
              >
                תרגול בפנקס המילים ←
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Submit Exam to Teacher Modal */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <Card className="w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" />
                <span>הגשת תרגול שיחה לבדיקת AI ומורה</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">שם התלמיד/ה:</label>
                <Input
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  placeholder="הזינו שם מלא..."
                  className="text-xs"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">כיתה:</label>
                <Input
                  value={studentClassInput}
                  onChange={(e) => setStudentClassInput(e.target.value)}
                  placeholder="לדוגמה: ח׳2"
                  className="text-xs"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">הערה למורה (רשות):</label>
                <Input
                  value={studentNoteInput}
                  onChange={(e) => setStudentNoteInput(e.target.value)}
                  placeholder="איך הרגשתם בתרגול השיחה?"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSubmitModal(false)}
                className="text-xs cursor-pointer"
              >
                ביטול
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={handleSubmitGradedExam}
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>מבצע הערכת AI...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>בדוק ב-AI ושלח למורה</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
