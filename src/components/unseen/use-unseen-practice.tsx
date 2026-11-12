"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/lib/utils";
import { SubmissionItem, SubmissionQuestionBreakdown } from "@/types/submission";
import { UnseenEvaluationResult } from "@/types/unseen";
import { MIDDLE_SCHOOL_UNSEENS, MSUnseenStory, MSUnseenQuestion, randomizeQuestionsOptions } from "@/data/unseen-middle-school";
import { lookupBuiltInTranslation } from "@/data/built-in-dictionary";
import {
  saveWordToBuilder,
  VocabItem,
  loadSavedWords,
  syncSavedWordsFromFirestore,
  isWordSaved,
  normalizeVocabWord,
} from "@/lib/vocab-storage";
import { recordTaskCompletion, submitTaskToDavid, resolveFocusWordToReviewItem } from "@/lib/tutor-engine";
import { TutorVocabReviewItem } from "@/types/tutor";
import { TeacherAssignment } from "@/types/assignment";
import { useSpeechPlayer } from "@/lib/use-speech-player";
import { saveDraft, deleteDraft, getDraftById } from "@/lib/drafts-storage";
import type { InProgressWorkItem, UnseenDraftPayload } from "@/types/draft";
import { LOCAL_SUBMISSIONS_KEY, lookupSavedVocabForWord, segmentTextWithSavedVocab } from "@/components/unseen/unseen-helpers";

export function useUnseenPractice() {
  const router = useRouter();
  const { user, teachers } = useAuth();
  const [stories, setStories] = useState<MSUnseenStory[]>(MIDDLE_SCHOOL_UNSEENS);

  // App Stage: "settings" (select level, mode, and story) vs. "exercise" (active reading & questions)
  const [stage, setStage] = useState<"settings" | "exercise">("settings");
  // Mobile active tab when in "exercise" stage: "text" (reading passage) vs. "questions"
  const [mobileTab, setMobileTab] = useState<"text" | "questions">("text");

  const [assignedNotice, setAssignedNotice] = useState<string | null>(null);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<string | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<TeacherAssignment | null>(null);
  const [isFromDavid, setIsFromDavid] = useState(false);
  const [isTurningInToDavid, setIsTurningInToDavid] = useState(false);
  // Core exercise state. Declared before the snapshot-restore effect below, which sets it.
  // Level Selection (No grade references)
  const [selectedLevel, setSelectedLevel] = useState<"Level 1" | "Level 2" | "Level 3">("Level 2");
  // Mode Selection: Practice (immediate feedback) vs. Graded (submit for score)
  const [mode, setMode] = useState<"practice" | "graded">("practice");
  // Active Story (starts on the first story of the default level)
  const [selectedStoryId, setSelectedStoryId] = useState<string>(
    () => MIDDLE_SCHOOL_UNSEENS.find((s) => s.level === "Level 2")?.id || MIDDLE_SCHOOL_UNSEENS[0].id
  );
  // Active Question in 10-Question navigation
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  // Answers & Checking
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [practiceEvaluation, setPracticeEvaluation] = useState<
    Record<string, { points: number; feedback: string }>
  >({});
  // Graded Mode Submission State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gradedScore, setGradedScore] = useState<number | null>(null);
  const [submissionRecord, setSubmissionRecord] = useState<SubmissionItem | null>(null);
  // Saved Words in Notebook Drawer
  const [savedWords, setSavedWords] = useState<VocabItem[]>(() => loadSavedWords(user?.id));
  // Font Size
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

  const isHydratedSnapshotRef = React.useRef(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      // If returning from Vocabulary practice, restore the exact Unseen session snapshot
      if (params.get("resumeFromVocab") === "1") {
        try {
          const rawSnap = sessionStorage.getItem("ett_unseen_return_snapshot");
          if (rawSnap) {
            const snap = JSON.parse(rawSnap);
            if (snap.currentStory) {
              const restoredStory = snap.currentStory as MSUnseenStory;
              setStories((prev) => {
                const randomizedOthers = prev
                  .filter((s) => s.id !== restoredStory.id)
                  .map((s) => ({
                    ...s,
                    questions: randomizeQuestionsOptions(s.questions),
                  }));
                return [restoredStory, ...randomizedOthers];
              });
              setSelectedLevel(snap.selectedLevel || restoredStory.level || "Level 2");
              setSelectedStoryId(restoredStory.id);
            } else {
              setStories((prev) =>
                prev.map((s) => ({
                  ...s,
                  questions: randomizeQuestionsOptions(s.questions),
                }))
              );
              if (snap.selectedLevel) setSelectedLevel(snap.selectedLevel);
              if (snap.selectedStoryId) setSelectedStoryId(snap.selectedStoryId);
            }
            setStage(snap.stage || "exercise");
            if (snap.mode) setMode(snap.mode);
            if (snap.userAnswers) setUserAnswers(snap.userAnswers);
            if (snap.checkedQuestions) setCheckedQuestions(snap.checkedQuestions);
            if (snap.practiceEvaluation) setPracticeEvaluation(snap.practiceEvaluation);
            if (typeof snap.activeQuestionIndex === "number") {
              setActiveQuestionIndex(snap.activeQuestionIndex);
            }
            if (snap.currentAssignmentId) setCurrentAssignmentId(snap.currentAssignmentId);
            if (snap.activeAssignment) setActiveAssignment(snap.activeAssignment);
            if (snap.assignedNotice) setAssignedNotice(snap.assignedNotice);
            if (snap.isFromDavid) setIsFromDavid(true);
            if (snap.isSubmitted) setIsSubmitted(true);
            if (snap.gradedScore !== undefined) setGradedScore(snap.gradedScore);
            if (snap.submissionRecord) setSubmissionRecord(snap.submissionRecord);
            if (snap.mobileTab) setMobileTab(snap.mobileTab);
            if (snap.fontSize) setFontSize(snap.fontSize);
            setSavedWords(loadSavedWords(user?.id));
            isHydratedSnapshotRef.current = true;
            return;
          }
        } catch {}
      }

      // Standard mount: randomize library story MCQ options
      setStories((prev) =>
        prev.map((s) => ({
          ...s,
          questions: randomizeQuestionsOptions(s.questions),
        }))
      );

      const fromDavid = params.get("from") === "david";
      if (fromDavid) {
        setIsFromDavid(true);
      }
      if (params.get("stage") === "exercise") {
        setStage("exercise");
      }
      const levelQueryParam = params.get("level") as "Level 1" | "Level 2" | "Level 3" | null;
      if (levelQueryParam && (levelQueryParam === "Level 1" || levelQueryParam === "Level 2" || levelQueryParam === "Level 3")) {
        setSelectedLevel(levelQueryParam);
      }
      const passageParam = params.get("passageId") || params.get("story");
      const assignIdParam = params.get("assignmentId");
      if (passageParam && passageParam !== "free_choice" && passageParam !== "adaptive_david") {
        const found = MIDDLE_SCHOOL_UNSEENS.find((s) => s.id === passageParam);
        if (found) {
          setSelectedLevel(found.level);
          setSelectedStoryId(found.id);
          setStage("exercise");
          setMode(fromDavid ? "practice" : "graded");
        }
      }
      if (assignIdParam) {
        setCurrentAssignmentId(assignIdParam);
        let matchedAssign: TeacherAssignment | undefined;
        try {
          const rawAssigns = localStorage.getItem("ett_teacher_assignments");
          if (rawAssigns) {
            const parsed = JSON.parse(rawAssigns) as TeacherAssignment[];
            matchedAssign = parsed.find((a) => a.id === assignIdParam);
            if (matchedAssign) {
              setActiveAssignment(matchedAssign);
              if (matchedAssign.level) {
                setSelectedLevel(matchedAssign.level);
              }
            }
          }
        } catch {}
        const lvlText = matchedAssign?.level ? ` (${matchedAssign.level})` : "";
        if (!passageParam || passageParam === "free_choice" || passageParam === "adaptive_david") {
          setAssignedNotice(`✨ משימת אנסין בבחירה חופשית מהמורה שלך${lvlText}: בחרו קטע קריאה מתאים, ענו על השאלות והגישו לבדיקה!`);
        } else {
          setAssignedNotice(`מבחן אנסין זה${lvlText} הוקצה על ידי המורה שלך. בסיום המענה, הגישו לבדיקה.`);
        }
      }
      isHydratedSnapshotRef.current = true;
    }
  }, []);

  // Filtered stories for selected level
  const levelStories = stories.filter((s) => s.level === selectedLevel);

  // Active Story
  const currentStory: MSUnseenStory =
    stories.find((s) => s.id === selectedStoryId) || levelStories[0] || MIDDLE_SCHOOL_UNSEENS[0];

  // Natural Voice Speech Dictation Player (includes passage title)
  const speech = useSpeechPlayer(currentStory.paragraphs, currentStory.title);

  // Stop playback on story change
  useEffect(() => {
    speech.stop();
  }, [currentStory.id]);

  // Auto-scroll active speech sentence into view smoothly as the user reads / listens
  useEffect(() => {
    if (!speech.isActive || !speech.isPlaying) return;
    const el = document.getElementById(`unseen-speech-sentence-${speech.currentSentenceIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [speech.currentSentenceIndex, speech.isActive, speech.isPlaying]);

  // Story selector tabs: "library" vs "ai_generator" (default to AI generator)
  const [storySourceTab, setStorySourceTab] = useState<"library" | "ai_generator">("ai_generator");

  // Library Search Filter
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");

  const filteredLibraryStories = useMemo(() => {
    if (!librarySearchQuery.trim()) return levelStories;
    const q = librarySearchQuery.toLowerCase().trim();
    return levelStories.filter((s) => {
      const matchEn = s.title.toLowerCase().includes(q);
      const matchHe = s.hebrewTitle.includes(q);
      const matchVocab = s.vocabularyHints.some(
        (v) => v.word.toLowerCase().includes(q) || v.translation.includes(q)
      );
      return matchEn || matchHe || matchVocab;
    });
  }, [levelStories, librarySearchQuery]);

  const handleRandomStorySelect = () => {
    if (levelStories.length === 0) return;
    const pool = filteredLibraryStories.length > 0 ? filteredLibraryStories : levelStories;
    // eslint-disable-next-line react-hooks/purity -- runs only in the click handler, not during render
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    if (chosen) {
      handleStorySelect(chosen.id);
    }
  };

  // AI Story Generation State
  const [aiTopicInput, setAiTopicInput] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [aiNoticeType, setAiNoticeType] = useState<"success" | "error" | "info">("info");
  const [showAiSettingsModal, setShowAiSettingsModal] = useState(false);
  const [customGroqKey, setCustomGroqKey] = useState("");
  const [customGeminiKey, setCustomGeminiKey] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCustomGroqKey(localStorage.getItem("ett_groq_api_key") || "");
      setCustomGeminiKey(localStorage.getItem("ett_gemini_api_key") || "");
    }
  }, []);

  // Print Exam Booklet Options
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printScope, setPrintScope] = useState<"full" | "text_only" | "questions_only">("full");
  const [printLineSpacing, setPrintLineSpacing] = useState<
    "normal" | "comfortable" | "double" | "spacious"
  >("normal");
  const [printIncludeHeader, setPrintIncludeHeader] = useState(true);
  const [printIncludeVocab, setPrintIncludeVocab] = useState(true);
  const [printIncludeAnswers, setPrintIncludeAnswers] = useState(false);
  const [printSeparatePages, setPrintSeparatePages] = useState(true);

  const handlePrintNow = () => {
    setShowPrintModal(false);
    setTimeout(() => {
      window.print();
    }, 180);
  };

  // Active Question in 10-Question navigation
  const activeQuestion: MSUnseenQuestion = currentStory.questions[activeQuestionIndex] || currentStory.questions[0];

  // Graded Mode Submission State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [studentNameInput, setStudentNameInput] = useState("");
  const [studentClassInput, setStudentClassInput] = useState("ז׳1");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [studentNoteInput, setStudentNoteInput] = useState("");
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [showReviewAnswers, setShowReviewAnswers] = useState(false);
  const [showDetailedUnseenRubric, setShowDetailedUnseenRubric] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Practice Completion Celebration State
  const [showPracticeConfetti, setShowPracticeConfetti] = useState(false);
  const [showPracticeCompleteModal, setShowPracticeCompleteModal] = useState(false);
  const [hasCelebratedPractice, setHasCelebratedPractice] = useState(false);

  const [isChangingTeacher, setIsChangingTeacher] = useState(false);

  // Question Audio Reading State
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [speakingQuestionId, setSpeakingQuestionId] = useState<string | null>(null);

  const handleSpeakText = (text: string, id?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      if (isSpeakingQuestion && speakingQuestionId === id) {
        window.speechSynthesis.cancel();
        setIsSpeakingQuestion(false);
        setSpeakingQuestionId(null);
        return;
      }
      window.speechSynthesis.cancel();
      // If passage speech player is playing, pause it to prevent conflicting sounds
      if (speech.isPlaying) {
        speech.pause();
      }
    } catch {}

    try {
      // Clean up multiple underscores or ellipses so speech synthesis pronounces "blank" or reads smoothly
      const clean = text
        .replace(/_+/g, " blank ")
        .replace(/\(\d+\)/g, "")
        .trim();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = "en-US";
      utterance.rate = 0.88;

      const allVoices = window.speechSynthesis.getVoices();
      const preferred = allVoices.find(
        (v) =>
          (v.lang.startsWith("en") || v.lang.startsWith("EN")) &&
          !v.name.toLowerCase().includes("siri") &&
          (v.name.toLowerCase().includes("natural") ||
            v.name.toLowerCase().includes("enhanced") ||
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("google"))
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      const w = window;
      w.__questionUtterance = utterance;
      setIsSpeakingQuestion(true);
      setSpeakingQuestionId(id || text);

      utterance.onend = () => {
        w.__questionUtterance = null;
        setIsSpeakingQuestion(false);
        setSpeakingQuestionId(null);
      };
      utterance.onerror = () => {
        w.__questionUtterance = null;
        setIsSpeakingQuestion(false);
        setSpeakingQuestionId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("[unseen] handleSpeakText error:", err);
      setIsSpeakingQuestion(false);
      setSpeakingQuestionId(null);
    }
  };

  // Stop speaking when user changes question
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isSpeakingQuestion) {
        window.speechSynthesis.cancel();
        setIsSpeakingQuestion(false);
        setSpeakingQuestionId(null);
      }
    }
  }, [activeQuestionIndex]);

  // Resolved selected teacher
  const selectedTeacher =
    teachers.find((t) => t.id === selectedTeacherId) ||
    teachers.find((t) => t.id === user?.teacherId) ||
    teachers[0];

  // Pre-fill student info and associated teacher if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setStudentNameInput(user.name);
      if (user.fullClass) {
        setStudentClassInput(user.fullClass);
      } else if (user.classGrade) {
        setStudentClassInput(`${user.classGrade}׳${user.classNumber || 1}`);
      }
      if (user.teacherId) {
        setSelectedTeacherId(user.teacherId);
      } else if (user.teacherName && teachers.length > 0) {
        const found = teachers.find(
          (t) => t.name === user.teacherName || t.id === user.teacherId
        );
        if (found) setSelectedTeacherId(found.id);
      }
    }
  }, [user, teachers]);

  useEffect(() => {
    if (!selectedTeacherId && teachers.length > 0) {
      if (user?.teacherId && teachers.some((t) => t.id === user.teacherId)) {
        setSelectedTeacherId(user.teacherId);
      } else {
        setSelectedTeacherId(teachers[0].id);
      }
    }
  }, [teachers, selectedTeacherId, user]);

  // Auto-sync any unsynced submissions from localStorage to Firestore
  useEffect(() => {
    const firestore = db;
    if (!firestore) return;
    try {
      const existingJson = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      if (!existingJson) return;
      const list: SubmissionItem[] = JSON.parse(existingJson);
      if (Array.isArray(list) && list.length > 0) {
        list.forEach(async (sub) => {
          if (sub && sub.id) {
            try {
              const payload = cleanForFirestore({
                ...sub,
                timestamp: sub.submittedAt || new Date().toISOString(),
              });
              await setDoc(doc(firestore, "submissions", sub.id), payload, { merge: true });
            } catch {
              // Ignore background sync errors
            }
          }
        });
      }
    } catch {
      // Ignore
    }
  }, []);

  // In-Progress Draft Auto-Save & Resumption State
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSavedTimeText, setLastSavedTimeText] = useState<string | null>(null);
  const [activeDraftPrompt, setActiveDraftPrompt] = useState<InProgressWorkItem | null>(null);

  // Check for saved draft for the current story or assignment and auto-restore by default
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("resumeFromVocab") === "1") return;
    const draftIdParam = params.get("draftId");
    let matched: InProgressWorkItem | null = null;

    if (draftIdParam) {
      matched = getDraftById(draftIdParam);
    } else {
      const targetDraftId = currentAssignmentId
        ? `draft_unseen_assign_${currentAssignmentId}`
        : `draft_unseen_${currentStory.id}`;
      matched = getDraftById(targetDraftId);
    }

    if (matched && matched.type === "unseen") {
      const payload = matched.payload as UnseenDraftPayload;
      const ans = payload?.userAnswers;
      if (ans && Object.keys(ans).length > 0 && !isSubmitted) {
        const savedStory: MSUnseenStory | undefined = payload.storyData || payload.aiStoryData;
        if (savedStory) {
          setStories((prev) => [savedStory, ...prev.filter((s) => s.id !== savedStory.id)]);
          setSelectedLevel(savedStory.level || payload.level || "Level 2");
          setSelectedStoryId(savedStory.id);
        } else if (payload.storyId && payload.storyId !== currentStory.id) {
          const found = MIDDLE_SCHOOL_UNSEENS.find((s) => s.id === payload.storyId);
          if (found) {
            setSelectedLevel(found.level);
            setSelectedStoryId(found.id);
          }
        }
        setUserAnswers(ans);
        if (payload.checkedQuestions) setCheckedQuestions(payload.checkedQuestions);
        if (payload.activeQuestionIndex !== undefined) setActiveQuestionIndex(payload.activeQuestionIndex);
        if (payload.mode) setMode(payload.mode);
        if (draftIdParam || params.get("passageId") || params.get("story") || params.get("assignmentId")) {
          setStage("exercise");
        }
        setActiveDraftPrompt(matched);
      } else {
        setActiveDraftPrompt(null);
      }
    } else {
      setActiveDraftPrompt(null);
    }
  }, [currentStory.id, currentAssignmentId]);

  // Restore draft handler
  const handleRestoreDraft = (draft: InProgressWorkItem) => {
    const payload = draft.payload as UnseenDraftPayload;
    if (payload?.userAnswers) {
      setUserAnswers(payload.userAnswers);
      if (payload.checkedQuestions) setCheckedQuestions(payload.checkedQuestions);
      if (payload.activeQuestionIndex !== undefined) setActiveQuestionIndex(payload.activeQuestionIndex);
      if (payload.mode) setMode(payload.mode);
      setStage("exercise");
      setActiveDraftPrompt(null);
    }
  };

  // Discard draft and reset task to start fresh
  const handleDiscardDraft = (draft: InProgressWorkItem) => {
    deleteDraft(draft.id, user?.id);
    setUserAnswers({});
    setCheckedQuestions({});
    setPracticeEvaluation({});
    setActiveQuestionIndex(0);
    setIsSubmitted(false);
    setGradedScore(null);
    setHasCelebratedPractice(false);
    setShowPracticeCompleteModal(false);
    setShowPracticeConfetti(false);
    setStories((prev) =>
      prev.map((s) =>
        s.id === currentStory.id
          ? { ...s, questions: randomizeQuestionsOptions(s.questions) }
          : s
      )
    );
    setActiveDraftPrompt(null);
  };

  // Debounced auto-save hook for unseen answers
  useEffect(() => {
    const answeredCount = Object.keys(userAnswers).filter(
      (k) => userAnswers[k] !== undefined && userAnswers[k] !== ""
    ).length;
    if (stage !== "exercise" || answeredCount === 0 || isSubmitted) {
      return;
    }
    setDraftStatus("saving");
    const timer = setTimeout(async () => {
      const draftId = currentAssignmentId
        ? `draft_unseen_assign_${currentAssignmentId}`
        : `draft_unseen_${currentStory.id}`;
      const totalQ = currentStory.questions.length || 5;
      const progressPercent = Math.min(100, Math.round((answeredCount / totalQ) * 100));

      await saveDraft({
        id: draftId,
        type: "unseen",
        studentId: user?.id || "guest",
        studentName: user?.name,
        title: currentStory.title,
        hebrewTitle: currentStory.hebrewTitle,
        progressPercent,
        summaryText: `${answeredCount} מתוך ${totalQ} שאלות נענו`,
        resumeUrl: `/unseen?passageId=${currentStory.id}&mode=${mode}&draftId=${draftId}${
          currentAssignmentId ? `&assignmentId=${currentAssignmentId}` : ""
        }`,
        assignmentId: currentAssignmentId || undefined,
        payload: {
          storyId: currentStory.id,
          level: selectedLevel,
          mode,
          userAnswers,
          checkedQuestions,
          activeQuestionIndex,
          storyData: currentStory,
          aiStoryData: currentStory.isAiGenerated ? currentStory : undefined,
        },
      });
      setDraftStatus("saved");
      setLastSavedTimeText(new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }));
    }, 1200);

    return () => clearTimeout(timer);
  }, [userAnswers, checkedQuestions, activeQuestionIndex, stage, currentStory, selectedLevel, mode, currentAssignmentId, isSubmitted, user?.id, user?.name]);

  // Save and exit back to student portal
  const handleSaveAndExit = async () => {
    const answeredCount = Object.keys(userAnswers).filter(
      (k) => userAnswers[k] !== undefined && userAnswers[k] !== ""
    ).length;
    if (answeredCount > 0) {
      const draftId = currentAssignmentId
        ? `draft_unseen_assign_${currentAssignmentId}`
        : `draft_unseen_${currentStory.id}`;
      const totalQ = currentStory.questions.length || 5;
      const progressPercent = Math.min(100, Math.round((answeredCount / totalQ) * 100));

      await saveDraft({
        id: draftId,
        type: "unseen",
        studentId: user?.id || "guest",
        studentName: user?.name,
        title: currentStory.title,
        hebrewTitle: currentStory.hebrewTitle,
        progressPercent,
        summaryText: `${answeredCount} מתוך ${totalQ} שאלות נענו`,
        resumeUrl: `/unseen?passageId=${currentStory.id}&mode=${mode}&draftId=${draftId}${
          currentAssignmentId ? `&assignmentId=${currentAssignmentId}` : ""
        }`,
        assignmentId: currentAssignmentId || undefined,
        payload: {
          storyId: currentStory.id,
          level: selectedLevel,
          mode,
          userAnswers,
          checkedQuestions,
          activeQuestionIndex,
          storyData: currentStory,
          aiStoryData: currentStory.isAiGenerated ? currentStory : undefined,
        },
      });
    }
    router.push("/student");
  };

  // Word Click & Translation Popup
  const [clickedWord, setClickedWord] = useState<{
    word: string;
    hebrew: string;
    partOfSpeech?: string;
    example?: string;
    loading?: boolean;
    saved?: boolean;
    isSelection?: boolean;
  } | null>(null);

  // Highlighted Sentence / Phrase Selection Toolbar State
  const [selectedPassageText, setSelectedPassageText] = useState<{
    text: string;
    x: number;
    y: number;
    below?: boolean;
  } | null>(null);
  const passageContainerRef = React.useRef<HTMLDivElement | null>(null);
  const questionsContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Question Prompt Inline Translation State
  const [questionTranslations, setQuestionTranslations] = useState<
    Record<string, { hebrew: string; loading?: boolean; visible?: boolean }>
  >({});

  // Clear selection toolbar when browser selection is collapsed
  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        setSelectedPassageText(null);
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const handlePassageSelectionUp = () => {
    if (typeof window === "undefined") return;
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setSelectedPassageText(null);
        return;
      }

      const raw = sel.toString().trim().replace(/\s+/g, " ");
      // Trigger selection toolbar when user highlights a phrase/sentence (or > 2 chars)
      if (!raw || !/[a-zA-Z]/.test(raw) || raw.length < 3) {
        setSelectedPassageText(null);
        return;
      }

      const range = sel.getRangeAt(0);
      const passageEl = passageContainerRef.current;
      const questionsEl = questionsContainerRef.current;
      const inPassage = passageEl && passageEl.contains(range.commonAncestorContainer);
      const inQuestions = questionsEl && questionsEl.contains(range.commonAncestorContainer);
      if (!inPassage && !inQuestions) {
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      const viewportW = window.innerWidth;
      const clampedX = Math.min(Math.max(145, rect.left + rect.width / 2), viewportW - 145);
      const showBelow = rect.top < 72;
      const targetY = showBelow ? rect.bottom + 8 : rect.top - 10;

      setSelectedPassageText({
        text: raw,
        x: clampedX,
        y: targetY,
        below: showBelow,
      });
    }, 15);
  };

  // Notebook drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync saved words whenever active user changes or hydrates, and merge from Firestore
  useEffect(() => {
    setSavedWords(loadSavedWords(user?.id));
    if (user?.id) {
      syncSavedWordsFromFirestore(user.id).then((merged) => {
        setSavedWords(merged);
      });
    }
  }, [user?.id]);

  // Lookup map of normalized English word/phrase -> saved VocabItem
  const savedVocabMap = useMemo(() => {
    const map = new Map<string, VocabItem>();
    for (const item of savedWords) {
      const norm = normalizeVocabWord(item.english);
      if (norm && !map.has(norm)) {
        map.set(norm, item);
      }
    }
    return map;
  }, [savedWords]);

  // Unique saved vocabulary words that appear in the current story (title or paragraphs)
  const passageSavedVocabWords = useMemo(() => {
    if (savedVocabMap.size === 0) return [];
    const seenIds = new Set<string>();
    const result: VocabItem[] = [];
    const allTexts = [currentStory.title, ...currentStory.paragraphs];
    for (const txt of allTexts) {
      const segments = segmentTextWithSavedVocab(txt, savedVocabMap);
      for (const seg of segments) {
        if (seg.savedItem && !seenIds.has(seg.savedItem.id)) {
          seenIds.add(seg.savedItem.id);
          result.push(seg.savedItem);
        }
      }
    }
    return result;
  }, [currentStory.title, currentStory.paragraphs, savedVocabMap]);

  // Save current Unseen session snapshot so the user can return seamlessly from Vocabulary practice
  const saveUnseenReturnSnapshot = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const snapshot = {
        stage,
        selectedLevel,
        selectedStoryId: currentStory.id,
        currentStory,
        mode,
        userAnswers,
        checkedQuestions,
        practiceEvaluation,
        activeQuestionIndex,
        currentAssignmentId,
        activeAssignment,
        assignedNotice,
        isFromDavid,
        isSubmitted,
        gradedScore,
        submissionRecord,
        mobileTab,
        fontSize,
        savedAt: Date.now(),
      };
      sessionStorage.setItem("ett_unseen_return_snapshot", JSON.stringify(snapshot));
    } catch {}
  }, [
    stage,
    selectedLevel,
    currentStory,
    mode,
    userAnswers,
    checkedQuestions,
    practiceEvaluation,
    activeQuestionIndex,
    currentAssignmentId,
    activeAssignment,
    assignedNotice,
    isFromDavid,
    isSubmitted,
    gradedScore,
    submissionRecord,
    mobileTab,
    fontSize,
  ]);

  useEffect(() => {
    if (!isHydratedSnapshotRef.current) return;
    saveUnseenReturnSnapshot();
  }, [saveUnseenReturnSnapshot]);

  // Pre-set suggested AI topics
  const SUGGESTED_TOPICS = [
    { label: "🎮 Gaming & Esports", value: "Video games, competitive esports, and game design" },
    { label: "🚀 Deep Space Exploration", value: "NASA missions, Mars exploration, and astronaut life" },
    { label: "⚽ Football & Sports", value: "Football history, legendary matches, and teamwork" },
    { label: "🐾 Wildlife & Animal Rescue", value: "Amazing wild animals, oceans, and rescue centers" },
    { label: "🤖 AI & Future Inventions", value: "Robots, futuristic tech, and smart gadgets" },
    { label: "🍕 Food & Culinary Arts", value: "Origins of pizza, world street foods, and baking" },
    { label: "🏛️ Ancient Mysteries", value: "Pyramids of Egypt, lost treasures, and archaeology" },
  ];

  // Handle switching level
  const handleLevelSelect = (lvl: "Level 1" | "Level 2" | "Level 3") => {
    setSelectedLevel(lvl);
    const matching = stories.filter((s) => s.level === lvl);
    if (matching.length > 0) {
      const chosenId = matching[0].id;
      setSelectedStoryId(chosenId);
      setActiveQuestionIndex(0);
      setUserAnswers({});
      setCheckedQuestions({});
      setIsSubmitted(false);
      setGradedScore(null);
      setHasCelebratedPractice(false);
      setShowPracticeCompleteModal(false);
      setShowPracticeConfetti(false);
      setStories((prev) =>
        prev.map((s) =>
          s.id === chosenId ? { ...s, questions: randomizeQuestionsOptions(s.questions) } : s
        )
      );
    }
  };

  // Switch Story
  const handleStorySelect = (id: string) => {
    setSelectedStoryId(id);
    setActiveQuestionIndex(0);
    setUserAnswers({});
    setCheckedQuestions({});
    setIsSubmitted(false);
    setGradedScore(null);
    setHasCelebratedPractice(false);
    setShowPracticeCompleteModal(false);
    setShowPracticeConfetti(false);
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, questions: randomizeQuestionsOptions(s.questions) } : s))
    );
  };

  // Start Exercise (continues from saved draft by default if one exists for the current story)
  const handleStartExercise = () => {
    const targetDraftId = currentAssignmentId
      ? `draft_unseen_assign_${currentAssignmentId}`
      : `draft_unseen_${currentStory.id}`;
    const existingDraft = getDraftById(targetDraftId);
    const hasDraftAnswers =
      existingDraft &&
      existingDraft.type === "unseen" &&
      (existingDraft.payload as UnseenDraftPayload).userAnswers &&
      Object.keys((existingDraft.payload as UnseenDraftPayload).userAnswers).length > 0;

    if (hasDraftAnswers) {
      const payload = existingDraft.payload as UnseenDraftPayload;
      setUserAnswers(payload.userAnswers);
      if (payload.checkedQuestions) setCheckedQuestions(payload.checkedQuestions);
      if (payload.activeQuestionIndex !== undefined) setActiveQuestionIndex(payload.activeQuestionIndex);
      if (payload.mode) setMode(payload.mode);
      const savedStory: MSUnseenStory | undefined = payload.storyData || payload.aiStoryData;
      if (savedStory) {
        setStories((prev) => [savedStory, ...prev.filter((s) => s.id !== savedStory.id)]);
      }
      setActiveDraftPrompt(existingDraft);
    } else if (Object.keys(userAnswers).length === 0) {
      setUserAnswers({});
      setCheckedQuestions({});
      setIsSubmitted(false);
      setGradedScore(null);
      setHasCelebratedPractice(false);
      setShowPracticeCompleteModal(false);
      setShowPracticeConfetti(false);
      setActiveQuestionIndex(0);
      setStories((prev) =>
        prev.map((s) =>
          s.id === currentStory.id
            ? { ...s, questions: randomizeQuestionsOptions(s.questions) }
            : s
        )
      );
    }
    setMobileTab("text");
    setStage("exercise");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  };

  // Generate with AI
  const handleGenerateAiStory = async (customTopic?: string) => {
    const topicToUse = customTopic || aiTopicInput.trim();
    if (!topicToUse) return;

    setIsGeneratingAi(true);
    setAiNotice(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (typeof window !== "undefined") {
        const groq = localStorage.getItem("ett_groq_api_key");
        const gemini = localStorage.getItem("ett_gemini_api_key");
        if (groq) headers["x-groq-api-key"] = groq;
        if (gemini) headers["x-gemini-api-key"] = gemini;
      }

      const res = await fetch("/api/generate-unseen", {
        method: "POST",
        headers,
        body: JSON.stringify({ level: selectedLevel, topic: topicToUse }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.story) {
        // Defensive check: Ensure the reading passage and title are in English
        const hasHebrewParagraphs =
          Array.isArray(data.story.paragraphs) &&
          data.story.paragraphs.some((p: string) => /[\u0590-\u05FF]/.test(p));
        const hasHebrewInTitle =
          typeof data.story.title === "string" && /[\u0590-\u05FF]/.test(data.story.title);

        if (hasHebrewParagraphs || hasHebrewInTitle) {
          setAiNoticeType("error");
          setAiNotice("שגיאה: קטע הקריאה נוצר בשפה שגויה (עברית במקום אנגלית). אנא נסו שוב.");
          return;
        }

        const newStory: MSUnseenStory = {
          ...data.story,
          generationPrompt: topicToUse,
          isAiGenerated: true,
          questions: randomizeQuestionsOptions(data.story.questions),
        };
        setStories((prev) => [newStory, ...prev.filter((s) => s.id !== newStory.id)]);
        setSelectedStoryId(newStory.id);
        setActiveQuestionIndex(0);
        setUserAnswers({});
        setCheckedQuestions({});
        setIsSubmitted(false);
        setGradedScore(null);
        setHasCelebratedPractice(false);
        setShowPracticeCompleteModal(false);
        setShowPracticeConfetti(false);

        setAiNoticeType("success");
        const modelNote = data.modelUsed ? ` (מודל: ${data.modelUsed})` : "";
        setAiNotice(`✨ קטע הקריאה "${newStory.title}" נוצר בהצלחה עם 10 שאלות${modelNote}! ניתן להתחיל בתרגול.`);
      } else {
        setAiNoticeType("error");
        setAiNotice(data?.message || "לא ניתן היה ליצור קטע קריאה כרגע. אנא נסה שוב או בדוק את מפתחות ה-AI בהגדרות.");
      }
    } catch {
      setAiNoticeType("error");
      setAiNotice("שגיאה בתקשורת עם שרת ה-AI. אנא נסה שוב בעוד מספר שניות.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Word Click Translation (translates without auto-saving; user can save via button)
  const handleWordClick = async (rawWord: string) => {
    const clean = rawWord.trim().toLowerCase().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
    if (!clean || clean.length < 2) return;

    const savedMatch = lookupSavedVocabForWord(clean, savedVocabMap);
    const alreadySaved = Boolean(savedMatch) || isWordSaved(clean, user?.id);

    // 0. If the word was already translated and added to vocabulary, recall it immediately
    if (savedMatch) {
      setClickedWord({
        word: clean,
        hebrew: savedMatch.hebrew,
        partOfSpeech: savedMatch.partOfSpeech,
        loading: false,
        example: savedMatch.example || `From "${currentStory.title}"`,
        saved: true,
      });
      return;
    }

    setClickedWord({
      word: clean,
      hebrew: "מתרגם...",
      loading: true,
      saved: alreadySaved,
    });

    // 1. Check current story vocabulary hints
    const hint = currentStory.vocabularyHints?.find(
      (h) => h.word.toLowerCase().replace(/[^a-zA-Z]/g, "") === clean
    );

    if (hint) {
      setClickedWord({
        word: clean,
        hebrew: hint.translation,
        loading: false,
        example: `From "${currentStory.title}"`,
        saved: alreadySaved,
      });
      return;
    }

    // 2. Check instant offline dictionary (0 ms latency)
    const builtIn = lookupBuiltInTranslation(clean);
    if (builtIn) {
      setClickedWord({
        word: clean,
        hebrew: builtIn,
        loading: false,
        example: `From "${currentStory.title}"`,
        saved: alreadySaved,
      });
      return;
    }

    // 3. Check browser cache
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
            example: parsed.example || `From "${currentStory.title}"`,
            saved: alreadySaved,
          });
          return;
        }
      }
    } catch {
      // Ignore
    }

    // 4. Call server translation route
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
          } catch {
            // Ignore
          }
          setClickedWord({
            word: clean,
            hebrew: data.data.hebrew,
            partOfSpeech: data.data.partOfSpeech,
            example: data.data.example || `From "${currentStory.title}"`,
            loading: false,
            saved: alreadySaved,
          });
          return;
        }
      }
    } catch {
      // Client fallback
    }

    // 5. Direct client-side MyMemory fallback
    try {
      const fbUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|he`;
      const fbRes = await fetch(fbUrl);
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        const tr = fbData?.responseData?.translatedText;
        if (tr && typeof tr === "string" && !tr.includes("MYMEMORY WARNING")) {
          const cleanTr = tr.trim();
          setClickedWord({
            word: clean,
            hebrew: cleanTr,
            loading: false,
            example: `From "${currentStory.title}"`,
            saved: alreadySaved,
          });
          return;
        }
      }
    } catch {
      // Ignore
    }

    setClickedWord({
      word: clean,
      hebrew: "לא נמצא תרגום",
      loading: false,
      saved: false,
    });
  };

  // Explicitly save the currently translated word to the Personal Dictionary
  const handleSaveClickedWord = () => {
    if (!clickedWord || clickedWord.loading || clickedWord.hebrew === "לא נמצא תרגום") return;
    saveWordToBuilder(
      {
        english: clickedWord.word,
        hebrew: clickedWord.hebrew,
        partOfSpeech: clickedWord.partOfSpeech,
        example: clickedWord.example || `From "${currentStory.title}"`,
        level: "Saved from Unseen",
        sourceType: "unseen",
        sourceTitle: currentStory.title,
        sourceCategory: currentStory.isAiGenerated
          ? `Unseen (${currentStory.level} - AI)`
          : `Unseen (${currentStory.level})`,
      },
      user?.id
    );
    setClickedWord((prev) => (prev ? { ...prev, saved: true } : null));
    setSavedWords(loadSavedWords(user?.id));
  };

  // Dictate (read aloud) only the user-highlighted text selection
  const handleDictateSelection = (selectedText: string) => {
    const clean = selectedText.trim().replace(/\s+/g, " ");
    if (!clean) return;
    if (speech.isActive && speech.isPlaying) {
      speech.pause();
    }
    handleSpeak(clean);
  };

  // Translate only the user-highlighted text selection
  const handleTranslateSelection = async (selectedText: string) => {
    const clean = selectedText.trim().replace(/\s+/g, " ");
    if (!clean) return;

    // If selection is a single word, delegate to standard word click handler
    if (!/\s/.test(clean)) {
      setSelectedPassageText(null);
      await handleWordClick(clean);
      return;
    }

    const normPhrase = normalizeVocabWord(clean);
    const savedPhraseMatch = normPhrase ? savedVocabMap.get(normPhrase) : undefined;
    const alreadySaved = Boolean(savedPhraseMatch) || isWordSaved(clean, user?.id);
    setSelectedPassageText(null);

    if (savedPhraseMatch) {
      setClickedWord({
        word: clean,
        hebrew: savedPhraseMatch.hebrew,
        partOfSpeech: savedPhraseMatch.partOfSpeech,
        loading: false,
        example: savedPhraseMatch.example || `From "${currentStory.title}"`,
        saved: true,
        isSelection: true,
      });
      return;
    }

    setClickedWord({
      word: clean,
      hebrew: "מתרגם קטע נבחר...",
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
            example: `From "${currentStory.title}"`,
            saved: alreadySaved,
            isSelection: true,
          });
          return;
        }
      }
    } catch {
      // Ignore
    }

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
            example: `From "${currentStory.title}"`,
            saved: alreadySaved,
            isSelection: true,
          });
          return;
        }
      }
    } catch {
      // Fallback below
    }

    try {
      const fbUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|he`;
      const fbRes = await fetch(fbUrl);
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        const tr = fbData?.responseData?.translatedText;
        if (tr && typeof tr === "string" && !tr.includes("MYMEMORY WARNING")) {
          const cleanTr = tr.trim();
          setClickedWord({
            word: clean,
            hebrew: cleanTr,
            loading: false,
            example: `From "${currentStory.title}"`,
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

  // Toggle and fetch Hebrew translation for a question prompt
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

  // Text-to-Speech (single word / phrase with selected natural voice)
  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
    } catch {}

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      if (speech.selectedVoiceURI) {
        const v = speech.voices.find((item) => item.voice.voiceURI === speech.selectedVoiceURI);
        if (v && !v.voice.name.toLowerCase().includes("siri")) {
          utterance.voice = v.voice;
        }
      }

      // Prevent GC in Chrome/Safari
      const w = window;
      w.__unseenWordUtterance = utterance;

      utterance.onend = () => {
        w.__unseenWordUtterance = null;
      };
      utterance.onerror = (e) => {
        w.__unseenWordUtterance = null;
        // If custom voice failed, retry once with system default voice
        if (e.error !== "canceled" && e.error !== "interrupted" && utterance.voice) {
          const fallback = new SpeechSynthesisUtterance(text);
          fallback.lang = "en-US";
          fallback.rate = 0.9;
          window.speechSynthesis.speak(fallback);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("[unseen] handleSpeak error:", err);
    }
  };


  // Practice mode: check single answer
  const handleCheckPracticeAnswer = (qId: string) => {
    setCheckedQuestions((prev) => ({ ...prev, [qId]: true }));
    const q = currentStory.questions.find((item) => item.id === qId);
    if (!q) return;

    if (q.type === "copy") {
      const ans = String(userAnswers[qId] || "");
      const cleanUser = ans.trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
      const cleanTarget = (q.targetSentence || "").trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
      if (cleanUser === cleanTarget) {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: { points: 10, feedback: "העתקה מושלמת ומדויקת של המשפט מתוך הפסקה! כל הכבוד!" },
        }));
      } else if (cleanTarget.includes(cleanUser) && cleanUser.length > 8) {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: { points: 8, feedback: "הועתק חלק נכון מהמשפט. מומלץ להעתיק את המשפט השלם מההתחלה ועד הנקודה." },
        }));
      } else {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: { points: 0, feedback: `המשפט הנכון מהפסקה הוא: "${q.targetSentence}".` },
        }));
      }
    } else if (q.type === "open") {
      const ans = String(userAnswers[qId] || "").toLowerCase();
      const expectedKws = (q.keywords || []).map((k) => k.toLowerCase());
      const matched = expectedKws.filter((kw) => ans.includes(kw));
      if (matched.length >= 2 || (expectedKws.length === 1 && matched.length === 1)) {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: { points: 10, feedback: "תשובה מצוינת! כללת את פרטי המפתח הנכונים מתוך הטקסט." },
        }));
      } else if (matched.length === 1 || ans.length > 15) {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: { points: 7, feedback: "תשובה טובה! זיהית את הרעיון הכללי. כדאי להרחיב ולהסביר באופן מפורט יותר." },
        }));
      } else {
        setPracticeEvaluation((prev) => ({
          ...prev,
          [qId]: { points: 2, feedback: q.explanationHebrew || "יש להסתמך על המידע המופיע בפסקה." },
        }));
      }
    }
  };

  // Graded mode: Submit all answers
  const handleSubmitGradedExam = async () => {
    setIsSubmitting(true);

    const teacherObj = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
    const receiptCode = `ETT-UN-${Math.floor(100000 + Math.random() * 900000)}`;

    let evaluationResult: UnseenEvaluationResult | null = null;

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

      const res = await fetch("/api/evaluate-unseen", {
        method: "POST",
        headers,
        body: JSON.stringify({
          storyId: currentStory.id,
          storyTitle: currentStory.title,
          hebrewTitle: currentStory.hebrewTitle,
          storyLevel: currentStory.level,
          paragraphs: currentStory.paragraphs,
          questions: currentStory.questions,
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
    } catch (err) {
      console.warn("Error calling evaluate-unseen API:", err);
    }

    let earned = 0;
    let breakdown: SubmissionQuestionBreakdown[] = [];

    if (evaluationResult) {
      earned = evaluationResult.score;
      breakdown = evaluationResult.breakdown.map((item) => ({
        id: item.id,
        number: item.number,
        type: item.type,
        prompt: item.prompt,
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
      // Local fallback calculation if API was unreachable
      breakdown = currentStory.questions.map((q) => {
        const ans = userAnswers[q.id];
        let isCorrect = false;
        let points = 0;
        let feedbackHebrew = "";

        if (q.type === "mcq") {
          isCorrect = ans === q.correctIndex;
          points = isCorrect ? 10 : 0;
          feedbackHebrew = isCorrect ? "תשובה נכונה! איתור מדויק של המידע בפסקה." : (q.explanationHebrew || "");
        } else if (q.type === "copy") {
          const cleanUser = String(ans || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
          const cleanTarget = (q.targetSentence || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
          if (cleanUser === cleanTarget) {
            isCorrect = true;
            points = 10;
            feedbackHebrew = "העתקה מושלמת ומדויקת של המשפט!";
          } else if (cleanTarget.includes(cleanUser) && cleanUser.length > 8) {
            isCorrect = true;
            points = 8;
            feedbackHebrew = "הועתק חלק עיקרי ונכון מהמשפט.";
          } else {
            feedbackHebrew = `המשפט הנכון הוא: "${q.targetSentence}".`;
          }
        } else if (q.type === "open") {
          const cleanUser = String(ans || "").toLowerCase();
          const matches = (q.keywords || []).filter((kw) => cleanUser.includes(kw.toLowerCase()));
          if (matches.length >= 2) {
            isCorrect = true;
            points = 10;
            feedbackHebrew = "תשובה מצוינת! כללת את פרטי המפתח הנכונים מתוך הטקסט.";
          } else if (matches.length === 1 || cleanUser.length > 15) {
            isCorrect = true;
            points = 7;
            feedbackHebrew = "רעיון נכון. ניתן להרחיב ולהסביר באופן מפורט יותר.";
          } else {
            feedbackHebrew = q.explanationHebrew || "יש להסתמך על המידע המופיע בפסקה.";
          }
        }

        earned += points;

        return {
          id: q.id,
          number: q.number,
          type: q.type,
          prompt: q.prompt,
          options: q.options || [],
          userAnswer: ans,
          correctAnswer: q.type === "mcq" ? q.correctIndex : q.targetSentence || q.modelAnswer,
          isCorrect,
          targetSentence: q.targetSentence || "",
          modelAnswer: q.modelAnswer || "",
          explanationHebrew: q.explanationHebrew || "",
          points,
          maxPoints: 10,
          feedbackHebrew,
        };
      });
    }

    const newSubmission: SubmissionItem = {
      id: `sub-${Date.now()}`,
      type: "unseen",
      studentId: user?.id || `guest-${Date.now()}`,
      studentName: (studentNameInput.trim() || user?.name || "תלמיד/ה").trim(),
      teacherId: teacherObj ? teacherObj.id : (teachers[0]?.id || ""),
      teacherName: teacherObj ? teacherObj.name : (teachers[0]?.name || "מורה לאנגלית"),
      studentClass: studentClassInput || user?.fullClass || "חטיבת ביניים",
      studentGroup: user?.group || undefined,
      studentNote: studentNoteInput.trim(),
      assignmentId: currentAssignmentId || undefined,
      taskId: currentStory.id,
      taskTitle: currentStory.title,
      hebrewTitle: currentStory.hebrewTitle,
      storyLevel: currentStory.level,
      passageText: currentStory.paragraphs.join("\n\n"),
      generationPrompt: currentStory.generationPrompt || (currentStory.isAiGenerated || currentStory.id.startsWith("ai-") ? aiTopicInput.trim() || "" : ""),
      isAiGenerated: Boolean(currentStory.isAiGenerated || currentStory.generationPrompt || currentStory.id.startsWith("ai-")),
      questionsBreakdown: breakdown,
      score: earned,
      grade: earned,
      encouragement: evaluationResult?.encouragement || "סיימת בהצלחה את מבחן האנסין!",
      teacherNote: evaluationResult?.teacherNote,
      strengths: evaluationResult?.strengths,
      tips: evaluationResult?.tips,
      unseenRubric: evaluationResult?.rubric,
      submittedAt: new Date().toLocaleString("he-IL"),
      receiptCode: receiptCode,
      status: "submitted",
    };

    // 1. Save to localStorage
    try {
      const existingJson = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
      const list: SubmissionItem[] = existingJson ? JSON.parse(existingJson) : [];
      list.unshift(newSubmission);
      localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(list));
    } catch (localErr) {
      console.warn("Could not save unseen submission to local storage:", localErr);
    }

    // 2. Save to Firestore with sanitization
    if (db) {
      try {
        const payload = cleanForFirestore({
          ...newSubmission,
          timestamp: new Date().toISOString(),
        });
        await setDoc(doc(db, "submissions", newSubmission.id), payload, { merge: true });
      } catch (fbErr) {
        console.warn("Firestore unseen submission fallback to local storage:", fbErr);
      }
    }

    // Update AI Tutor David's Progress Tracking
    try {
      recordTaskCompletion(user?.id || "guest", "unseen", earned, newSubmission.taskTitle);
    } catch (e) {
      console.warn("Tutor task completion tracking notice:", e);
    }

    // Clean up in-progress draft
    const draftId = currentAssignmentId
      ? `draft_unseen_assign_${currentAssignmentId}`
      : `draft_unseen_${currentStory.id}`;
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

    let earned = 0;
    const missedQuestions: { prompt: string; correctText: string; explanation: string }[] = [];

    currentStory.questions.forEach((q) => {
      const ans = userAnswers[q.id];
      let isCorrect = false;
      let points = 0;

      if (q.type === "mcq") {
        isCorrect = ans === q.correctIndex;
        points = isCorrect ? 10 : 0;
        if (!isCorrect) {
          const correctOpt = q.options?.[q.correctIndex ?? 0] || "";
          missedQuestions.push({
            prompt: q.prompt,
            correctText: correctOpt,
            explanation: q.explanationHebrew || `התשובה הנכונה מתוך הפסקה היא: "${correctOpt}".`,
          });
        }
      } else if (q.type === "copy") {
        const cleanUser = String(ans || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        const cleanTarget = (q.targetSentence || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleanUser === cleanTarget || (cleanTarget.includes(cleanUser) && cleanUser.length > 8)) {
          isCorrect = true;
          points = 10;
        } else {
          missedQuestions.push({
            prompt: q.prompt,
            correctText: q.targetSentence || "",
            explanation: q.explanationHebrew || `המשפט שיש להעתיק מהטקסט הוא: "${q.targetSentence}".`,
          });
        }
      } else if (q.type === "open") {
        const cleanUser = String(ans || "").toLowerCase();
        const matches = (q.keywords || []).filter((kw) => cleanUser.includes(kw.toLowerCase()));
        if (matches.length >= 1 || cleanUser.length > 12) {
          isCorrect = true;
          points = matches.length >= 2 ? 10 : 8;
        } else {
          missedQuestions.push({
            prompt: q.prompt,
            correctText: q.modelAnswer || "",
            explanation: q.explanationHebrew || `תשובה מומלצת: "${q.modelAnswer}".`,
          });
        }
      }

      earned += points;
    });

    const finalScore = isSubmitted && gradedScore !== null ? gradedScore : earned;

    const strengths: string[] = [];
    if (finalScore >= 80) {
      strengths.push("הבנת הנקרא מצוינת! איתרת מידע מפורש והסקת מסקנות בצורה מדויקת.");
    } else if (finalScore >= 60) {
      strengths.push("הבנת את הרעיון המרכזי של הקטע וענית נכון על רוב השאלות.");
    } else {
      strengths.push("כל הכבוד על ההתמדה בקריאת הטקסט והמענה על השאלות באנגלית!");
    }

    const improvements: { original?: string; suggestion: string; explanationHebrew: string }[] =
      missedQuestions.slice(0, 3).map((m) => ({
        original: m.prompt,
        suggestion: m.correctText,
        explanationHebrew: m.explanation,
      }));
    if (improvements.length === 0) {
      improvements.push({
        suggestion: "Great comprehension!",
        explanationHebrew: "עבודה נקייה ומדויקת! המשך לשים לב למילות קישור ורמזי הקשר בפסקאות.",
      });
    }

    const vocabToReview: TutorVocabReviewItem[] = [];
    if (activeAssignment?.focusWords && activeAssignment.focusWords.length > 0) {
      for (const fw of activeAssignment.focusWords) {
        const resolved = resolveFocusWordToReviewItem(fw);
        if (!vocabToReview.some((v) => v.word.toLowerCase() === resolved.word.toLowerCase())) {
          vocabToReview.push(resolved);
        }
      }
    }
    if (currentStory.vocabularyHints) {
      for (const h of currentStory.vocabularyHints) {
        if (!vocabToReview.some((v) => v.word.toLowerCase() === h.word.toLowerCase())) {
          vocabToReview.push({
            word: h.word,
            hebrew: h.translation,
          });
        }
      }
    }
    for (const sw of savedWords.slice(0, 4)) {
      if (!vocabToReview.some((v) => v.word.toLowerCase() === sw.english.toLowerCase())) {
        vocabToReview.push({
          word: sw.english,
          hebrew: sw.hebrew,
          exampleSentence: sw.example,
        });
      }
    }

    // Save completed unseen practice or assignment
    if (!isSubmitted) {
      const isGradedAssignment = Boolean(currentAssignmentId);
      const teacherObj = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
      const receiptCode = `${isGradedAssignment ? "ETT-UN" : "PRACTICE-UN"}-${Math.floor(100000 + Math.random() * 900000)}`;
      const autoSub: SubmissionItem = {
        id: `sub-${Date.now()}`,
        type: "unseen",
        mode: isGradedAssignment ? "graded" : "practice",
        status: isGradedAssignment ? "submitted" : "completed",
        studentId: user?.id || `guest-${Date.now()}`,
        studentName: (studentNameInput.trim() || user?.name || "תלמיד/ה").trim(),
        teacherId: activeAssignment?.teacherId || (teacherObj ? teacherObj.id : teachers[0]?.id || ""),
        teacherName: activeAssignment?.teacherName || (teacherObj ? teacherObj.name : teachers[0]?.name || "מורה לאנגלית"),
        studentClass: studentClassInput || user?.fullClass || "חטיבת ביניים",
        studentGroup: user?.group || undefined,
        studentNote: isGradedAssignment ? "הוגש באופן עצמאי" : "תרגול אנסין עצמאי שהושלם",
        assignmentId: currentAssignmentId || undefined,
        taskId: currentStory.id,
        taskTitle: currentStory.title,
        hebrewTitle: currentStory.hebrewTitle,
        storyLevel: currentStory.level,
        passageText: currentStory.paragraphs.join("\n\n"),
        score: finalScore,
        grade: finalScore,
        encouragement: "סיימת בהצלחה את תרגול האנסין!",
        strengths,
        submittedAt: new Date().toLocaleString("he-IL"),
        receiptCode,
      };
      try {
        const existingJson = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
        const list: SubmissionItem[] = existingJson ? JSON.parse(existingJson) : [];
        list.unshift(autoSub);
        localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(list));
      } catch {}
      if (db) {
        try {
          const payload = cleanForFirestore({
            ...autoSub,
            timestamp: new Date().toISOString(),
          });
          await setDoc(doc(db, "submissions", autoSub.id), payload, { merge: true });
        } catch {}
      }

      // Clean up in-progress draft
      const draftId = currentAssignmentId
        ? `draft_unseen_assign_${currentAssignmentId}`
        : `draft_unseen_${currentStory.id}`;
      deleteDraft(draftId, user?.id);
    }

    await submitTaskToDavid(user?.id || "guest", {
      id: `turnin-unseen-${Date.now()}`,
      type: "unseen",
      taskId: currentStory.id,
      taskTitle: currentStory.title,
      taskTitleHebrew: currentStory.hebrewTitle,
      score: finalScore,
      completedAt: new Date().toISOString(),
      strengths,
      improvements,
      vocabToReview,
      assignmentId: currentAssignmentId || undefined,
      teacherName: activeAssignment?.teacherName,
      encouragement: "סיימת בהצלחה את משימת האנסין!",
      teacherNote: `כל הכבוד! סיימת את קטע הקריאה "${currentStory.hebrewTitle}" בהצלחה עם ציון ${finalScore}.`,
    });

    if (typeof window !== "undefined") {
      router.push("/tutor?turnIn=1");
    }
  };

  // Total answered questions count
  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] !== undefined && userAnswers[k] !== ""
  ).length;

  // Practice mode completion & evaluation
  const isAllPracticeAnswered =
    mode === "practice" &&
    currentStory.questions.length > 0 &&
    currentStory.questions.every((q) => userAnswers[q.id] !== undefined && userAnswers[q.id] !== "");

  const correctMcqCount = currentStory.questions.filter(
    (q) => q.type === "mcq" && userAnswers[q.id] === q.correctIndex
  ).length;
  const totalMcqs = currentStory.questions.filter((q) => q.type === "mcq").length;
  const totalOpenOrCopy = currentStory.questions.filter((q) => q.type === "copy" || q.type === "open").length;

  // Auto-trigger celebration when completing all questions in practice mode
  useEffect(() => {
    if (mode === "practice" && stage === "exercise" && currentStory.questions.length > 0) {
      const allDone = currentStory.questions.every(
        (q) => userAnswers[q.id] !== undefined && userAnswers[q.id] !== ""
      );
      if (allDone && !hasCelebratedPractice) {
        setShowPracticeConfetti(true);
        setShowPracticeCompleteModal(true);
        setHasCelebratedPractice(true);
      }
    }
  }, [userAnswers, mode, stage, currentStory.questions, hasCelebratedPractice]);

  // Ensure page scrolls to top whenever switching stages (settings <-> exercise)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [stage]);


  return {
    router,
    user,
    teachers,
    stories,
    setStories,
    stage,
    setStage,
    mobileTab,
    setMobileTab,
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
    selectedLevel,
    setSelectedLevel,
    mode,
    setMode,
    selectedStoryId,
    setSelectedStoryId,
    activeQuestionIndex,
    setActiveQuestionIndex,
    userAnswers,
    setUserAnswers,
    checkedQuestions,
    setCheckedQuestions,
    practiceEvaluation,
    setPracticeEvaluation,
    isSubmitted,
    setIsSubmitted,
    gradedScore,
    setGradedScore,
    submissionRecord,
    setSubmissionRecord,
    savedWords,
    setSavedWords,
    fontSize,
    setFontSize,
    isHydratedSnapshotRef,
    levelStories,
    currentStory,
    speech,
    storySourceTab,
    setStorySourceTab,
    librarySearchQuery,
    setLibrarySearchQuery,
    filteredLibraryStories,
    handleRandomStorySelect,
    aiTopicInput,
    setAiTopicInput,
    isGeneratingAi,
    setIsGeneratingAi,
    aiNotice,
    setAiNotice,
    aiNoticeType,
    setAiNoticeType,
    showAiSettingsModal,
    setShowAiSettingsModal,
    customGroqKey,
    setCustomGroqKey,
    customGeminiKey,
    setCustomGeminiKey,
    showPrintModal,
    setShowPrintModal,
    printScope,
    setPrintScope,
    printLineSpacing,
    setPrintLineSpacing,
    printIncludeHeader,
    setPrintIncludeHeader,
    printIncludeVocab,
    setPrintIncludeVocab,
    printIncludeAnswers,
    setPrintIncludeAnswers,
    printSeparatePages,
    setPrintSeparatePages,
    handlePrintNow,
    activeQuestion,
    showSubmitModal,
    setShowSubmitModal,
    studentNameInput,
    setStudentNameInput,
    studentClassInput,
    setStudentClassInput,
    selectedTeacherId,
    setSelectedTeacherId,
    studentNoteInput,
    setStudentNoteInput,
    copiedReceipt,
    setCopiedReceipt,
    showReviewAnswers,
    setShowReviewAnswers,
    showDetailedUnseenRubric,
    setShowDetailedUnseenRubric,
    isSubmitting,
    setIsSubmitting,
    showPracticeConfetti,
    setShowPracticeConfetti,
    showPracticeCompleteModal,
    setShowPracticeCompleteModal,
    hasCelebratedPractice,
    setHasCelebratedPractice,
    isChangingTeacher,
    setIsChangingTeacher,
    isSpeakingQuestion,
    setIsSpeakingQuestion,
    speakingQuestionId,
    setSpeakingQuestionId,
    handleSpeakText,
    selectedTeacher,
    draftStatus,
    setDraftStatus,
    lastSavedTimeText,
    setLastSavedTimeText,
    activeDraftPrompt,
    setActiveDraftPrompt,
    handleRestoreDraft,
    handleDiscardDraft,
    handleSaveAndExit,
    clickedWord,
    setClickedWord,
    selectedPassageText,
    setSelectedPassageText,
    passageContainerRef,
    questionsContainerRef,
    questionTranslations,
    setQuestionTranslations,
    handlePassageSelectionUp,
    drawerOpen,
    setDrawerOpen,
    savedVocabMap,
    passageSavedVocabWords,
    saveUnseenReturnSnapshot,
    SUGGESTED_TOPICS,
    handleLevelSelect,
    handleStorySelect,
    handleStartExercise,
    handleGenerateAiStory,
    handleWordClick,
    handleSaveClickedWord,
    handleDictateSelection,
    handleTranslateSelection,
    handleToggleQuestionTranslation,
    handleSpeak,
    handleCheckPracticeAnswer,
    handleSubmitGradedExam,
    handleTurnInToDavid,
    answeredCount,
    isAllPracticeAnswered,
    correctMcqCount,
    totalMcqs,
    totalOpenOrCopy,
  };
}

export type UnseenPracticeController = ReturnType<typeof useUnseenPractice>;
