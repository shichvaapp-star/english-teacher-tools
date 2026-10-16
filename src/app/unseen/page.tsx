"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { cleanForFirestore } from "@/lib/utils";
import { SubmissionItem, SubmissionQuestionBreakdown } from "@/types/submission";
import { formatTeacherDisplayName } from "@/types/auth";
import { UnseenEvaluationResult } from "@/types/unseen";
import { MIDDLE_SCHOOL_UNSEENS, MSUnseenStory, MSUnseenQuestion, randomizeQuestionsOptions } from "@/data/unseen-middle-school";
import { lookupBuiltInTranslation } from "@/data/built-in-dictionary";
import { saveWordToBuilder, VocabItem, loadSavedWords } from "@/lib/vocab-storage";
import { recordTaskCompletion } from "@/lib/tutor-engine";
import { useSpeechPlayer } from "@/lib/use-speech-player";
import { UnseenAudioDock } from "@/components/unseen/unseen-audio-dock";
import { Confetti } from "@/components/confetti";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  BookMarked,
  Volume2,
  Pause,
  CheckCircle2,
  Sparkles,
  Info,
  Copy,
  Printer,
  X,
  Award,
  HelpCircle,
  RotateCcw,
  Check,
  Target,
  FileCheck,
  Send,
  Sliders,
  ArrowRight,
  BookOpen,
  Key,
  AlertCircle,
  UserCheck,
  Edit3,
  GraduationCap,
} from "lucide-react";

const LOCAL_SUBMISSIONS_KEY = "ett_writing_submissions";

/**
 * Renders English text where every word is an interactive clickable token that
 * triggers the instant translation toast and adds the word to the student's word bank.
 */
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

export default function UnseenPracticePage() {
  const { user, teachers } = useAuth();
  const [stories, setStories] = useState<MSUnseenStory[]>(MIDDLE_SCHOOL_UNSEENS);

  // App Stage: "settings" (select level, mode, and story) vs. "exercise" (active reading & questions)
  const [stage, setStage] = useState<"settings" | "exercise">("settings");
  // Mobile active tab when in "exercise" stage: "text" (reading passage) vs. "questions"
  const [mobileTab, setMobileTab] = useState<"text" | "questions">("text");

  const [assignedNotice, setAssignedNotice] = useState<string | null>(null);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("stage") === "exercise") {
        setStage("exercise");
      }
      const passageParam = params.get("passageId") || params.get("story");
      const assignIdParam = params.get("assignmentId");
      if (passageParam && passageParam !== "free_choice") {
        const found = MIDDLE_SCHOOL_UNSEENS.find((s) => s.id === passageParam);
        if (found) {
          setSelectedLevel(found.level);
          setSelectedStoryId(found.id);
          setStage("exercise");
          setMode("graded");
        }
      }
      if (assignIdParam) {
        setCurrentAssignmentId(assignIdParam);
        if (!passageParam || passageParam === "free_choice") {
          setAssignedNotice("✨ משימת אנסין בבחירה חופשית מהמורה שלך: בחרו כל קטע קריאה שתרצו (או צרו קטע עם ה-AI), ענו על השאלות והגישו לבדיקה!");
        } else {
          setAssignedNotice("מבחן אנסין זה הוקצה על ידי המורה שלך. בסיום המענה, הגישו לבדיקה.");
        }
      }
    }
  }, []);

  // Ensure library stories have their multiple-choice options randomized
  React.useEffect(() => {
    setStories((prev) =>
      prev.map((s) => ({
        ...s,
        questions: randomizeQuestionsOptions(s.questions),
      }))
    );
  }, []);

  // Level Selection (No grade references)
  const [selectedLevel, setSelectedLevel] = useState<"Level 1" | "Level 2" | "Level 3">("Level 2");

  // Mode Selection: Practice (immediate feedback) vs. Graded (submit for score)
  const [mode, setMode] = useState<"practice" | "graded">("practice");

  // Filtered stories for selected level
  const levelStories = stories.filter((s) => s.level === selectedLevel);

  // Active Story
  const [selectedStoryId, setSelectedStoryId] = useState<string>(levelStories[0]?.id || MIDDLE_SCHOOL_UNSEENS[0].id);
  const currentStory: MSUnseenStory =
    stories.find((s) => s.id === selectedStoryId) || levelStories[0] || MIDDLE_SCHOOL_UNSEENS[0];

  // Natural Voice Speech Dictation Player
  const speech = useSpeechPlayer(currentStory.paragraphs);

  // Stop playback on story change
  useEffect(() => {
    speech.stop();
  }, [currentStory.id]);

  // Story selector tabs: "library" vs "ai_generator" (default to AI generator)
  const [storySourceTab, setStorySourceTab] = useState<"library" | "ai_generator">("ai_generator");

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
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const activeQuestion: MSUnseenQuestion = currentStory.questions[activeQuestionIndex] || currentStory.questions[0];

  // Answers & Checking
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [practiceEvaluation, setPracticeEvaluation] = useState<
    Record<string, { points: number; feedback: string }>
  >({});

  // Graded Mode Submission State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gradedScore, setGradedScore] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [studentNameInput, setStudentNameInput] = useState("");
  const [studentClassInput, setStudentClassInput] = useState("ז׳1");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [studentNoteInput, setStudentNoteInput] = useState("");
  const [submissionRecord, setSubmissionRecord] = useState<SubmissionItem | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [showReviewAnswers, setShowReviewAnswers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Practice Completion Celebration State
  const [showPracticeConfetti, setShowPracticeConfetti] = useState(false);
  const [showPracticeCompleteModal, setShowPracticeCompleteModal] = useState(false);
  const [hasCelebratedPractice, setHasCelebratedPractice] = useState(false);

  const [isChangingTeacher, setIsChangingTeacher] = useState(false);

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

  // Word Click & Translation Popup
  const [clickedWord, setClickedWord] = useState<{
    word: string;
    hebrew: string;
    partOfSpeech?: string;
    example?: string;
    loading?: boolean;
    saved?: boolean;
  } | null>(null);

  // Saved Words in Notebook Drawer
  const [savedWords, setSavedWords] = useState<VocabItem[]>(() => loadSavedWords(user?.id));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Font Size
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

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

  // Start Exercise with freshly randomized options
  const handleStartExercise = () => {
    setUserAnswers({});
    setCheckedQuestions({});
    setIsSubmitted(false);
    setGradedScore(null);
    setHasCelebratedPractice(false);
    setShowPracticeCompleteModal(false);
    setShowPracticeConfetti(false);
    setActiveQuestionIndex(0);
    setMobileTab("text");
    setStories((prev) =>
      prev.map((s) =>
        s.id === currentStory.id
          ? { ...s, questions: randomizeQuestionsOptions(s.questions) }
          : s
      )
    );
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

  // Word Click Translation
  const handleWordClick = async (rawWord: string) => {
    const clean = rawWord.trim().toLowerCase().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
    if (!clean || clean.length < 2) return;

    setClickedWord({
      word: clean,
      hebrew: "מתרגם...",
      loading: true,
    });

    // 1. Check current story vocabulary hints
    const hint = currentStory.vocabularyHints?.find(
      (h) => h.word.toLowerCase().replace(/[^a-zA-Z]/g, "") === clean
    );

    if (hint) {
      saveWordToBuilder(
        { english: clean, hebrew: hint.translation, example: `From "${currentStory.title}"` },
        user?.id
      );
      setClickedWord({
        word: clean,
        hebrew: hint.translation,
        loading: false,
        example: `From "${currentStory.title}"`,
        saved: true,
      });
      setSavedWords(loadSavedWords(user?.id));
      return;
    }

    // 2. Check instant offline dictionary (0 ms latency)
    const builtIn = lookupBuiltInTranslation(clean);
    if (builtIn) {
      saveWordToBuilder(
        { english: clean, hebrew: builtIn, example: `From "${currentStory.title}"` },
        user?.id
      );
      setClickedWord({
        word: clean,
        hebrew: builtIn,
        loading: false,
        example: `From "${currentStory.title}"`,
        saved: true,
      });
      setSavedWords(loadSavedWords(user?.id));
      return;
    }

    // 3. Check browser cache
    const cacheKey = `trans_cache_${clean}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.hebrew) {
          saveWordToBuilder(
            { english: clean, hebrew: parsed.hebrew, example: parsed.example || `From "${currentStory.title}"` },
            user?.id
          );
          setClickedWord({
            word: clean,
            hebrew: parsed.hebrew,
            loading: false,
            example: parsed.example || `From "${currentStory.title}"`,
            saved: true,
          });
          setSavedWords(loadSavedWords(user?.id));
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
          saveWordToBuilder(
            {
              english: clean,
              hebrew: data.data.hebrew,
              partOfSpeech: data.data.partOfSpeech,
              example: data.data.example,
            },
            user?.id
          );
          setClickedWord({
            word: clean,
            hebrew: data.data.hebrew,
            partOfSpeech: data.data.partOfSpeech,
            example: data.data.example,
            loading: false,
            saved: true,
          });
          setSavedWords(loadSavedWords(user?.id));
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
          saveWordToBuilder(
            { english: clean, hebrew: cleanTr, example: `From "${currentStory.title}"` },
            user?.id
          );
          setClickedWord({
            word: clean,
            hebrew: cleanTr,
            loading: false,
            example: `From "${currentStory.title}"`,
            saved: true,
          });
          setSavedWords(loadSavedWords(user?.id));
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

  // Text-to-Speech (single word / phrase with selected natural voice)
  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    if (speech.selectedVoiceURI) {
      const v = speech.voices.find((item) => item.voice.voiceURI === speech.selectedVoiceURI);
      if (v) utterance.voice = v.voice;
    }
    window.speechSynthesis.speak(utterance);
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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {stage === "exercise" ? (
              <HeaderTooltip label="שינוי הגדרות / בחר קטע אחר">
                <button
                  type="button"
                  onClick={() => {
                    setStage("settings");
                    if (typeof window !== "undefined") {
                      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                    }
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
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">
                <Search className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs sm:text-sm font-medium tracking-tight text-foreground truncate font-sans">
                    Unseen Practice
                  </h1>
                  <span className="text-[10px] text-muted-foreground font-hebrew hidden sm:inline">
                    • בלשי האנסין
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate hidden sm:block font-hebrew">
                  {stage === "settings" ? "הגדרות תרגול ובחירת קטע" : `${currentStory.title} • 10 שאלות`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {stage === "settings" && (
              <HeaderTooltip label="התחלת תרגול">
                <Button
                  size="icon"
                  onClick={handleStartExercise}
                  className="cursor-pointer shadow-xs h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                  aria-label="התחל תרגול"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </HeaderTooltip>
            )}
            <HeaderTooltip label="פנקס מילים">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDrawerOpen(true)}
                className="cursor-pointer border-primary/20 hover:border-primary/40 relative h-9 w-9 shrink-0"
                aria-label="פנקס מילים"
              >
                <BookMarked className="h-4 w-4 text-primary" />
                {savedWords.length > 0 && (
                  <span className="absolute -top-1 -right-1 px-1 min-w-4 h-4 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-[10px] font-bold leading-none">
                    {savedWords.length}
                  </span>
                )}
              </Button>
            </HeaderTooltip>
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      {/* =========================================================================
          STAGE 1: SETTINGS / SETUP VIEW
          ========================================================================= */}
      {stage === "settings" && (
        <main className="container mx-auto flex-1 px-3 sm:px-8 py-4 sm:py-6 max-w-4xl space-y-4 sm:space-y-5 print:hidden" dir="rtl">
          {/* Teacher Assignment Notification Banner */}
          {assignedNotice && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between gap-3 text-xs text-purple-900 dark:text-purple-200" dir="rtl">
              <div className="flex items-center gap-2 font-medium font-hebrew">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>{assignedNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setAssignedNotice(null)}
                className="text-purple-600 hover:text-purple-800 dark:hover:text-purple-100 p-1 cursor-pointer rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Settings Compact Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1 border-b border-border/50" dir="rtl">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-foreground font-hebrew">
                  הגדרות תרגול אנסין
                </h2>
                <Badge variant="secondary" className="text-[11px] font-sans">
                  10 Questions
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                Reading Comprehension Setup • {currentStory.title}
              </p>
            </div>

            <Button
              size="default"
              onClick={handleStartExercise}
              className="cursor-pointer gap-2 text-xs sm:text-sm font-normal px-5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 font-hebrew"
            >
              <span>התחלת תרגול</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Setting 1: Level Selection */}
          <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-2.5" dir="rtl">
            <div className="flex items-center justify-between" dir="rtl">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5 font-hebrew">
                <Target className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>1. רמת קריאה</span>
                <span className="text-muted-foreground font-normal font-sans" dir="ltr">(Reading Level)</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {[
                { id: "Level 1" as const, hebrew: "מתחילים", sub: "Beginner" },
                { id: "Level 2" as const, hebrew: "שוטף", sub: "Intermediate" },
                { id: "Level 3" as const, hebrew: "מתקדמים", sub: "Advanced" },
              ].map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleLevelSelect(lvl.id)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-2xs ring-1 ring-primary/40"
                        : "border-border/60 hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <span className="text-sm font-medium font-sans">{lvl.id}</span>
                    <span className="text-xs text-muted-foreground font-hebrew">{lvl.hebrew}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Setting 2: Practice Mode vs. Graded Mode */}
          <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-2.5" dir="rtl">
            <div className="flex items-center justify-between" dir="rtl">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5 font-hebrew">
                <FileCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>2. מצב פעילות</span>
                <span className="text-muted-foreground font-normal font-sans" dir="ltr">(Mode)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMode("practice")}
                className={`p-3 sm:p-3.5 rounded-xl border text-right transition cursor-pointer flex items-center gap-3 ${
                  mode === "practice"
                    ? "border-primary bg-primary/10 shadow-2xs ring-1 ring-primary/40"
                    : "border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Target className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-medium text-foreground font-hebrew">אימון חופשי</h4>
                    <span className="text-[11px] text-muted-foreground font-sans" dir="ltr">Practice</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-hebrew">
                    תרגול עצמאי עם בדיקה מיידית ורמזים
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("graded")}
                className={`p-3 sm:p-3.5 rounded-xl border text-right transition cursor-pointer flex items-center gap-3 ${
                  mode === "graded"
                    ? "border-emerald-600 bg-emerald-500/10 shadow-2xs ring-1 ring-emerald-500/40"
                    : "border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-medium text-foreground font-hebrew">מטלה להגשה למורה</h4>
                    <span className="text-[11px] text-muted-foreground font-sans" dir="ltr">Assignment</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-hebrew">
                    מבחן לציון עם משוב רשמי מהמורה
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Setting 3: Choose Story or Generate with AI */}
          <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-3" dir="rtl">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5" dir="rtl">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5 font-hebrew">
                <BookMarked className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>3. בחירת קטע קריאה</span>
              </span>

              <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg" dir="rtl">
                <button
                  type="button"
                  onClick={() => setStorySourceTab("library")}
                  className={`px-3 py-1 rounded-md text-xs font-normal transition cursor-pointer font-hebrew ${
                    storySourceTab === "library"
                      ? "bg-card text-foreground shadow-2xs font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ספרייה ({levelStories.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStorySourceTab("ai_generator")}
                  className={`px-3 py-1 rounded-md text-xs font-normal transition cursor-pointer flex items-center gap-1 font-hebrew ${
                    storySourceTab === "ai_generator"
                      ? "bg-card text-foreground shadow-2xs font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>יצירה עם AI</span>
                </button>
              </div>
            </div>

            {/* Library Stories Grid */}
            {storySourceTab === "library" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
                {levelStories.map((story) => {
                  const isSelected = story.id === currentStory.id;
                  return (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => handleStorySelect(story.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-2xs ring-1 ring-primary/40"
                          : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-medium text-foreground truncate font-sans">{story.title}</h4>
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground truncate text-right rtl font-hebrew">
                        {story.hebrewTitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* AI Generator Tab */}
            {storySourceTab === "ai_generator" && (
              <div className="space-y-3 pt-1">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Input
                    type="text"
                    placeholder="נושא לקטע קריאה (למשל: ספורט, חלל, רובוטים...)"
                    value={aiTopicInput}
                    onChange={(e) => setAiTopicInput(e.target.value)}
                    className="text-xs h-9 text-right rtl font-hebrew"
                    disabled={isGeneratingAi}
                  />
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <Button
                      onClick={() => handleGenerateAiStory()}
                      disabled={isGeneratingAi || !aiTopicInput.trim()}
                      size="sm"
                      className="flex-1 sm:flex-none shrink-0 gap-1.5 cursor-pointer text-xs h-9 px-4 font-normal shadow-2xs font-hebrew"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{isGeneratingAi ? "יוצר קטע..." : "צור קטע קריאה"}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAiSettingsModal(true)}
                      className="h-9 px-2.5 cursor-pointer shrink-0 gap-1 text-xs"
                      title="הגדרת מפתחות AI"
                    >
                      <Key className="h-3.5 w-3.5 text-primary" />
                    </Button>
                  </div>
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TOPICS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      disabled={isGeneratingAi}
                      onClick={() => {
                        setAiTopicInput(t.value);
                        handleGenerateAiStory(t.value);
                      }}
                      className="text-xs px-2.5 py-1 rounded-full border border-border/80 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 transition cursor-pointer font-hebrew"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* AI Notice Banner */}
                {aiNotice && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                      aiNoticeType === "success"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-800 dark:text-amber-200 border border-amber-500/30"
                    }`}
                  >
                    {aiNoticeType === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    )}
                    <div className="flex-1 text-right rtl leading-relaxed font-hebrew">
                      <span>{aiNotice}</span>
                      {aiNoticeType === "error" && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAiSettingsModal(true)}
                            className="h-7 text-[11px] px-2.5 cursor-pointer gap-1"
                          >
                            <Key className="h-3 w-3" />
                            <span>פתח הגדרות מפתחות AI</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Generated AI Story Preview Card */}
                {currentStory.id.startsWith("ai-story") && (
                  <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-2.5 text-right rtl animate-in fade-in-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-[11px] font-normal font-sans">
                          AI Story • {currentStory.level}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleStartExercise}
                        className="cursor-pointer gap-1.5 font-normal shadow-2xs text-xs h-8 px-4 font-hebrew"
                      >
                        <span>התחלת תרגול</span>
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="text-sm font-medium text-foreground ltr text-left font-sans">{currentStory.title}</h3>
                      <p className="text-xs text-muted-foreground font-hebrew">{currentStory.hebrewTitle}</p>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 ltr text-left leading-relaxed font-sans">
                      {currentStory.paragraphs[0]}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Bar: Sticky on Mobile so it is NEVER lost */}
          <div className="sticky bottom-0 z-30 -mx-3 sm:mx-0 p-3 sm:p-4 bg-background/95 backdrop-blur-md border-t sm:border sm:rounded-2xl border-border/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3" dir="rtl">
            <div className="text-right rtl space-y-0.5 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-start">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-foreground font-sans truncate max-w-[150px] sm:max-w-none">{currentStory.title}</span>
                <span className="text-[11px] sm:text-xs text-muted-foreground truncate hidden sm:inline font-hebrew">({currentStory.hebrewTitle})</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] sm:text-xs text-muted-foreground font-hebrew">
                  <span className="font-sans">{selectedLevel}</span> &bull; 10 שאלות &bull;{" "}
                  <span className={mode === "graded" ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-primary font-medium"}>
                    {mode === "graded" ? "מטלה להגשה" : "אימון חופשי"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="default"
                onClick={() => setShowPrintModal(true)}
                className="hidden sm:inline-flex cursor-pointer gap-2 text-xs font-normal px-4 border-border/80 font-hebrew"
              >
                <Printer className="h-4 w-4 text-primary" />
                <span>הדפסת דף עבודה</span>
              </Button>
              <Button
                size="default"
                onClick={handleStartExercise}
                className={`flex-1 sm:flex-none cursor-pointer gap-2 text-xs sm:text-sm font-normal h-10 px-6 shadow-2xs font-hebrew ${
                  mode === "graded"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                <span>{mode === "graded" ? "התחלת מטלה להגשה" : "התחלת אימון חופשי"}</span>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      )}

      {stage === "exercise" && (
        <main className="container mx-auto flex-1 px-3 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-6xl print:hidden">
          {/* Active Context Ribbon */}
          <div className="flex flex-wrap items-center justify-between bg-card border border-border/60 rounded-xl p-2.5 sm:p-3 shadow-xs print:hidden gap-2.5">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => {
                  setStage("settings");
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                  }
                }}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">שנה הגדרות / בחר קטע אחר</span>
                <span className="sm:hidden">הגדרות</span>
              </button>
              <span className="text-muted-foreground">&bull;</span>
              <span className="text-xs text-muted-foreground font-medium shrink-0">{selectedLevel}</span>
              <span className="text-muted-foreground">&bull;</span>

              {/* Mode Switcher */}
              <div className="inline-flex items-center rounded-lg bg-muted/80 p-0.5 text-xs font-semibold border border-border/50">
                <button
                  type="button"
                  onClick={() => setMode("practice")}
                  className={`px-2 py-1 rounded-md text-[11px] transition cursor-pointer flex items-center gap-1 ${
                    mode === "practice"
                      ? "bg-background text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="בדיקת תשובות מיידית תוך כדי פתרון"
                >
                  <Target className="h-3 w-3 text-primary" />
                  <span>אימון חופשי</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("graded")}
                  className={`px-2 py-1 rounded-md text-[11px] transition cursor-pointer flex items-center gap-1 ${
                    mode === "graded"
                      ? "bg-emerald-600 text-white shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="מטלה להגשה למורה וחישוב ציון רשמי"
                >
                  <Send className="h-3 w-3" />
                  <span>מטלה להגשה למורה</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mr-auto sm:mr-0 shrink-0">
              {mode === "practice" && !isSubmitted && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsChangingTeacher(false);
                    if (user?.teacherId) {
                      setSelectedTeacherId(user.teacherId);
                    }
                    setShowSubmitModal(true);
                  }}
                  className="h-7 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 cursor-pointer gap-1"
                >
                  <Send className="h-3 w-3 text-emerald-600" />
                  <span>הגש למורה ({answeredCount}/10)</span>
                </Button>
              )}
              {isSubmitted ? (
                <Badge className="bg-emerald-600 text-white text-[11px] font-bold gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>הוגש למורה</span>
                </Badge>
              ) : mode === "graded" ? (
                <span className="font-semibold text-xs text-primary">{answeredCount}/10 נענו</span>
              ) : (
                <span className="text-[11px] sm:text-xs text-muted-foreground">שאלה {activeQuestionIndex + 1}/10</span>
              )}
            </div>
          </div>

          {/* Teacher Assignment Notification Banner */}
          {assignedNotice && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-3 text-xs text-purple-900 dark:text-purple-200" dir="rtl">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="font-semibold">{assignedNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setAssignedNotice(null)}
                className="text-purple-600 hover:text-purple-800 dark:hover:text-purple-100 p-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Mobile View Switcher (Passage vs. Questions) - Only visible on mobile (< lg) */}
          <div className="lg:hidden flex items-center p-1 rounded-xl bg-card border border-border/80 sticky top-16 z-30 shadow-xs backdrop-blur-md">
            <button
              type="button"
              onClick={() => setMobileTab("text")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileTab === "text"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>📖 קטע הקריאה</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileTab("questions")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileTab === "questions"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>❓ שאלות ({answeredCount}/10)</span>
              {userAnswers[activeQuestion?.id || ""] !== undefined && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          {/* Reading Passage (Left) + 10 Questions (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Reading Passage Column (7 Cols on desktop, conditioned on mobile) */}
            <div className={`lg:col-span-7 space-y-4 ${mobileTab === "text" ? "block" : "hidden lg:block"}`}>
              <Card className="border-border/60 shadow-xs">
                <CardHeader className="border-b border-border/50 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {currentStory.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        10 Questions • 100 Pts
                      </Badge>
                      {mode === "graded" && (
                        <Badge variant="destructive" className="text-[10px] animate-pulse">
                          Exam Mode
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 print:hidden">
                      {/* Font Scaling */}
                      <div className="flex items-center border border-border rounded-md text-xs overflow-hidden">
                        <button
                          onClick={() => setFontSize("sm")}
                          className={`px-2 py-1 ${fontSize === "sm" ? "bg-accent font-bold" : "hover:bg-muted"}`}
                        >
                          A-
                        </button>
                        <button
                          onClick={() => setFontSize("base")}
                          className={`px-2 py-1 ${fontSize === "base" ? "bg-accent font-bold" : "hover:bg-muted"}`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => setFontSize("lg")}
                          className={`px-2 py-1 ${fontSize === "lg" ? "bg-accent font-bold" : "hover:bg-muted"}`}
                        >
                          A+
                        </button>
                      </div>

                      {/* Speech TTS */}
                      <Button
                        variant={speech.isActive && speech.isPlaying ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (!speech.isActive) {
                            speech.startPlayer();
                          } else {
                            speech.togglePlayPause();
                          }
                        }}
                        className="cursor-pointer gap-1.5 text-xs font-semibold"
                        title={
                          speech.isActive
                            ? speech.isPlaying
                              ? "Pause dictation"
                              : "Resume dictation"
                            : "Listen to story with natural voice"
                        }
                      >
                        {speech.isActive && speech.isPlaying ? (
                          <>
                            <Pause className="h-3.5 w-3.5 fill-current animate-pulse" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3.5 w-3.5 text-primary" />
                            <span className="hidden sm:inline">
                              {speech.isActive ? "Resume" : "Listen"}
                            </span>
                          </>
                        )}
                      </Button>

                      {/* Print Booklet */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPrintModal(true)}
                        className="cursor-pointer gap-1 text-xs"
                        title="Print exam booklet"
                      >
                        <Printer className="h-3.5 w-3.5 text-primary" />
                        <span className="hidden sm:inline">Print</span>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <CardTitle className="text-xl font-bold tracking-tight notranslate" translate="no" lang="en">{currentStory.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{currentStory.hebrewTitle}</p>
                  </div>

                  <div className="p-2 rounded-lg bg-muted/40 text-[11px] text-muted-foreground flex items-center gap-2 mt-2 print:hidden">
                    <Info className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      💡 <strong>טיפ בלשים:</strong> לחצו על <strong>כל מילה</strong> בטקסט או בשאלות ובתשובות כדי לראות תרגום מיידי ולהוסיף לפנקס המילים האישי שלכם!
                    </span>
                  </div>
                </CardHeader>

                {/* Story Paragraphs */}
                <CardContent className="pt-4 space-y-4 notranslate" translate="no" lang="en">
                  {/* Floating Interactive Speech Dock */}
                  {speech.isActive && (
                    <UnseenAudioDock
                      isPlaying={speech.isPlaying}
                      isPaused={speech.isPaused}
                      currentSentenceIndex={speech.currentSentenceIndex}
                      totalSentences={speech.totalSentences}
                      rate={speech.rate}
                      voices={speech.voices}
                      selectedVoiceURI={speech.selectedVoiceURI}
                      onTogglePlayPause={speech.togglePlayPause}
                      onSkipBack={speech.skipBack}
                      onSkipForward={speech.skipForward}
                      onChangeRate={speech.changeRate}
                      onChangeVoice={speech.changeVoice}
                      onClose={speech.stop}
                    />
                  )}

                  {currentStory.paragraphs.map((para, pIdx) => {
                    const isHighlighted =
                      activeQuestion &&
                      (activeQuestion.paragraphIndex === pIdx ||
                        activeQuestion.paragraphIndex === -1 ||
                        activeQuestion.paragraphIndex >= currentStory.paragraphs.length);

                    const textSizeClass =
                      fontSize === "sm"
                        ? "text-sm leading-relaxed"
                        : fontSize === "lg"
                        ? "text-lg leading-loose"
                        : "text-base leading-relaxed";

                    const paraSentences = speech.sentences.filter((s) => s.paragraphIndex === pIdx);

                    return (
                      <div
                        key={pIdx}
                        className={`relative p-3.5 rounded-xl border transition-colors ${
                          isHighlighted
                            ? "border-primary/40 bg-primary/5 shadow-xs"
                            : "border-border/30 hover:border-border/60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            Paragraph [{pIdx + 1}]
                          </span>
                        </div>

                        <p className={`${textSizeClass} text-foreground/90 font-sans tracking-wide leading-relaxed`}>
                          {paraSentences.length > 0 ? (
                            paraSentences.map((sObj) => {
                              const isSpoken =
                                speech.isActive && speech.currentSentenceIndex === sObj.globalIndex;

                              return (
                                <span
                                  key={sObj.id}
                                  onClick={() => {
                                    if (speech.isActive) {
                                      speech.seekSentence(sObj.globalIndex);
                                    }
                                  }}
                                  className={`inline rounded transition-all duration-200 ${
                                    isSpoken
                                      ? "bg-primary/20 text-foreground font-semibold ring-2 ring-primary/50 px-1 py-0.5 rounded shadow-xs"
                                      : speech.isActive
                                      ? "hover:bg-primary/10 rounded px-0.5 cursor-pointer"
                                      : ""
                                  }`}
                                  title={speech.isActive ? "Click sentence to play from here" : undefined}
                                >
                                  <InteractiveEnglishText
                                    text={sObj.text}
                                    onWordClick={handleWordClick}
                                    stopEventPropagation
                                  />
                                  {" "}
                                </span>
                              );
                            })
                          ) : (
                            <InteractiveEnglishText
                              text={para}
                              onWordClick={handleWordClick}
                            />
                          )}
                        </p>
                      </div>
                    );
                  })}

                  {/* Vocabulary Hints footer */}
                  {currentStory.vocabularyHints && currentStory.vocabularyHints.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                        <BookMarked className="h-3.5 w-3.5 text-primary" />
                        <span>Vocabulary Helpers (אוצר מילים בטקסט):</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {currentStory.vocabularyHints.map((hint, hIdx) => (
                          <button
                            key={hIdx}
                            type="button"
                            onClick={() => handleWordClick(hint.word)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs hover:bg-primary/10 hover:text-primary transition cursor-pointer"
                          >
                            <span className="font-medium">{hint.word}</span>
                            <span className="text-muted-foreground">&bull;</span>
                            <span>{hint.translation}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mobile-only action button to jump to questions */}
              <div className="lg:hidden pt-1">
                <Button
                  onClick={() => setMobileTab("questions")}
                  className="w-full gap-2 font-bold text-xs h-10 cursor-pointer shadow-xs"
                >
                  <span>מעבר לשאלות ({activeQuestionIndex + 1}/10)</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 10 Questions Column (5 Cols on desktop, conditioned on mobile) */}
            <div className={`lg:col-span-5 print:hidden ${mobileTab === "questions" ? "block" : "hidden lg:block"}`}>
              <div className="lg:sticky lg:top-20 space-y-4 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1">
              {/* Mobile quick link to return to text */}
              <div className="lg:hidden flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => setMobileTab("text")}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>← חזרה לקטע הקריאה</span>
                </button>
                {activeQuestion?.linesHint && (
                  <span className="text-[11px] text-muted-foreground">
                    {activeQuestion.linesHint}
                  </span>
                )}
              </div>

              {/* Question Tabs Header (1 to 10) */}
              <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-primary" />
                    <span>Questions ({currentStory.questions.length})</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {mode === "graded" ? `${answeredCount}/10 נענו` : `שאלה ${activeQuestionIndex + 1} מתוך 10`}
                  </span>
                </div>

                {/* 10 Question Pills - Touch-friendly on mobile */}
                <div className="flex overflow-x-auto sm:grid sm:grid-cols-10 gap-1.5 pb-1 sm:pb-0 scrollbar-none">
                  {currentStory.questions.map((q, idx) => {
                    const isActive = idx === activeQuestionIndex;
                    const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== "";

                    let pillColor = "border-border/60 bg-muted/30 text-muted-foreground";
                    if (isActive) {
                      pillColor = "border-primary bg-primary text-primary-foreground font-bold shadow-xs";
                    } else if (isAnswered) {
                      pillColor = "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 font-semibold";
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setActiveQuestionIndex(idx)}
                        className={`h-9 min-w-[34px] sm:min-w-0 sm:h-8 rounded-lg border text-xs flex items-center justify-center transition cursor-pointer relative shrink-0 ${pillColor}`}
                      >
                        <span>{idx + 1}</span>
                        {isAnswered && !isActive && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Practice Completed Celebration Banner */}
              {mode === "practice" && isAllPracticeAnswered && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3 animate-in fade-in-0 shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl sm:text-2xl shrink-0">🎉</span>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                        <span>Well Done! כל הכבוד!</span>
                        <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-1.5 font-bold">הושלם</Badge>
                      </h4>
                      <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/90 truncate">
                        סיימת את כל {currentStory.questions.length} השאלות בתרגול.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setIsChangingTeacher(false);
                        if (user?.teacherId) {
                          setSelectedTeacherId(user.teacherId);
                        }
                        setShowSubmitModal(true);
                      }}
                      className="h-7 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 cursor-pointer gap-1"
                    >
                      <Send className="h-3 w-3" />
                      <span>הגש למורה</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowPracticeConfetti(true);
                        setShowPracticeCompleteModal(true);
                      }}
                      className="h-7 text-[11px] font-bold border-emerald-500/40 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0 cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3 text-amber-500 mr-1" />
                      <span>סיכום</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Active Question Card */}
              {activeQuestion && (
                <Card className="border-border/60 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                          שאלה {activeQuestion.number}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {activeQuestion.type === "mcq"
                            ? "בחירה מרובה"
                            : activeQuestion.type === "copy"
                            ? "העתקת משפט"
                            : "הבנה פתוחה"}
                        </Badge>
                      </div>
                      <span className="text-xs font-semibold text-primary">{activeQuestion.points} נקודות</span>
                    </div>

                    {activeQuestion.linesHint && (
                      <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Search className="h-3 w-3 text-primary" />
                        <span>מיקום בטקסט: {activeQuestion.linesHint}</span>
                      </p>
                    )}

                    <h3 className="text-sm font-semibold text-foreground mt-2 leading-relaxed notranslate" translate="no" lang="en">
                      <InteractiveEnglishText
                        text={activeQuestion.prompt}
                        onWordClick={handleWordClick}
                      />
                    </h3>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-3 notranslate" translate="no" lang="en">
                    {/* Multiple Choice Question */}
                    {activeQuestion.type === "mcq" && activeQuestion.options && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
                          <span>בחר את התשובה הנכונה:</span>
                          <span className="text-[10px] text-primary/80 flex items-center gap-1">
                            <span>💡 לחצו על מילה לתרגום</span>
                          </span>
                        </div>
                        {activeQuestion.options.map((option, optIdx) => {
                          const isSelected = userAnswers[activeQuestion.id] === optIdx;
                          const isChecked = checkedQuestions[activeQuestion.id];
                          const isCorrectOption = optIdx === activeQuestion.correctIndex;

                          let optStyle = "border-border/60 hover:bg-muted/40 hover:border-border";
                          if (mode === "practice" && isChecked) {
                            if (isCorrectOption) {
                              optStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold";
                            } else if (isSelected && !isCorrectOption) {
                              optStyle = "border-destructive bg-destructive/10 text-destructive font-medium";
                            }
                          } else if (isSelected) {
                            optStyle = "border-primary bg-primary/10 text-foreground font-semibold shadow-xs";
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => {
                                setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: optIdx }));
                                if (mode === "practice") {
                                  setCheckedQuestions((prev) => ({ ...prev, [activeQuestion.id]: true }));
                                } else {
                                  setCheckedQuestions((prev) => ({ ...prev, [activeQuestion.id]: false }));
                                }
                              }}
                              className={`w-full p-3 rounded-lg border text-left text-xs transition cursor-pointer flex items-start gap-2.5 ${optStyle}`}
                            >
                              <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1 leading-relaxed">
                                <InteractiveEnglishText
                                  text={option}
                                  onWordClick={handleWordClick}
                                  stopEventPropagation
                                />
                              </span>
                              {mode === "practice" && isChecked && isCorrectOption && (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Copy Sentence Question */}
                    {activeQuestion.type === "copy" && (
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground block">
                          הקלד את המשפט המדויק מתוך הפסקה:
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Type the exact sentence from the story..."
                          value={(userAnswers[activeQuestion.id] as string) || ""}
                          onChange={(e) =>
                            setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: e.target.value }))
                          }
                          spellCheck={false}
                          autoCorrect="off"
                          autoComplete="off"
                          className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                        />
                      </div>
                    )}

                    {/* Open Ended Question */}
                    {activeQuestion.type === "open" && (
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground block">
                          ענה באנגלית על פי המידע בטקסט:
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Write your answer in English..."
                          value={(userAnswers[activeQuestion.id] as string) || ""}
                          onChange={(e) =>
                            setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: e.target.value }))
                          }
                          spellCheck={false}
                          autoCorrect="off"
                          autoComplete="off"
                          className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                    )}

                    {/* Practice Mode Feedback Box */}
                    {mode === "practice" && checkedQuestions[activeQuestion.id] && (
                      <div className="p-3 rounded-lg bg-muted/60 border border-border/80 text-xs space-y-1.5 animate-in fade-in-0">
                        <div className="flex items-center gap-1.5 font-bold">
                          {activeQuestion.type === "mcq" && userAnswers[activeQuestion.id] === activeQuestion.correctIndex ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" /> תשובה נכונה! כל הכבוד! (+10 נקודות)
                            </span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <Info className="h-4 w-4" /> הסבר לתשובה:
                            </span>
                          )}
                        </div>

                        {activeQuestion.targetSentence && (
                          <p className="text-muted-foreground font-mono text-[11px]">
                            משפט היעד:{" "}
                            <span className="font-normal font-sans">
                              &ldquo;
                              <InteractiveEnglishText
                                text={activeQuestion.targetSentence}
                                onWordClick={handleWordClick}
                              />
                              &rdquo;
                            </span>
                          </p>
                        )}

                        {activeQuestion.modelAnswer && (
                          <p className="text-muted-foreground text-[11px]">
                            תשובה לדוגמה:{" "}
                            <span className="font-normal font-sans">
                              &ldquo;
                              <InteractiveEnglishText
                                text={activeQuestion.modelAnswer}
                                onWordClick={handleWordClick}
                              />
                              &rdquo;
                            </span>
                          </p>
                        )}

                        {practiceEvaluation[activeQuestion.id] && (
                          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-foreground space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span className="flex items-center gap-1 text-primary">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>הערכת התשובה שכתבת:</span>
                              </span>
                              <Badge variant={practiceEvaluation[activeQuestion.id].points >= 7 ? "default" : "secondary"} className="text-[10px]">
                                {practiceEvaluation[activeQuestion.id].points} / 10 נק׳
                              </Badge>
                            </div>
                            <p className="text-[11px] leading-relaxed">
                              {practiceEvaluation[activeQuestion.id].feedback}
                            </p>
                          </div>
                        )}

                        <p className="text-foreground/90 text-[11px] leading-relaxed text-right rtl">
                          {activeQuestion.explanationHebrew}
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activeQuestionIndex === 0}
                        onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                        className="cursor-pointer text-xs"
                      >
                        שאלה קודמת
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activeQuestionIndex === currentStory.questions.length - 1}
                        onClick={() =>
                          setActiveQuestionIndex((prev) => Math.min(currentStory.questions.length - 1, prev + 1))
                        }
                        className="cursor-pointer text-xs"
                      >
                        שאלה הבאה
                      </Button>
                    </div>

                    {mode === "practice" ? (
                      activeQuestion.type !== "mcq" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleCheckPracticeAnswer(activeQuestion.id)}
                          className="cursor-pointer gap-1.5 text-xs"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>בדוק תשובה</span>
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setIsChangingTeacher(false);
                          if (user?.teacherId) {
                            setSelectedTeacherId(user.teacherId);
                          }
                          setShowSubmitModal(true);
                        }}
                        className="cursor-pointer gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>הגש מבחן ({answeredCount}/10)</span>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )}

              {/* Graded Mode Summary Card */}
              {isSubmitted && gradedScore !== null && (
                <Card className="border-emerald-500/40 bg-emerald-500/5 shadow-md animate-in fade-in-0 space-y-4 p-5" dir="rtl">
                  <CardHeader className="p-0 text-center space-y-2">
                    <span className="text-4xl">🏆</span>
                    <CardTitle className="text-xl text-emerald-700 dark:text-emerald-300 font-black">
                      {submissionRecord?.encouragement || `ציון המבחן שלך: ${gradedScore} / 100`}
                    </CardTitle>
                    <div className="flex items-center justify-center gap-2">
                      <Badge
                        variant="default"
                        className={`text-base px-3.5 py-1 font-black ${
                          gradedScore >= 85
                            ? "bg-emerald-600 text-white"
                            : gradedScore >= 70
                            ? "bg-blue-600 text-white"
                            : gradedScore >= 55
                            ? "bg-amber-600 text-white"
                            : "bg-rose-600 text-white"
                        }`}
                      >
                        {gradedScore} / 100
                      </Badge>
                    </div>
                  </CardHeader>

                  {/* Teacher Personal Note */}
                  {submissionRecord?.teacherNote && (
                    <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1.5 text-right">
                      <div className="flex items-center gap-1.5 font-bold text-primary">
                        <GraduationCap className="h-4 w-4" />
                        <span>משוב פדגוגי אישי מהמורה:</span>
                      </div>
                      <p className="text-foreground/90 leading-relaxed text-[12px]">
                        {submissionRecord.teacherNote}
                      </p>
                    </div>
                  )}

                  {/* Strengths & Tips */}
                  {((submissionRecord?.strengths && submissionRecord.strengths.length > 0) ||
                    (submissionRecord?.tips && submissionRecord.tips.length > 0)) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-right">
                      {submissionRecord.strengths && submissionRecord.strengths.length > 0 && (
                        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>נקודות חוזק בבדיקה:</span>
                          </div>
                          <ul className="space-y-1 text-foreground/90 pr-1 list-disc list-inside text-[11px]">
                            {submissionRecord.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {submissionRecord.tips && submissionRecord.tips.length > 0 && (
                        <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-primary">
                            <Sparkles className="h-4 w-4 shrink-0" />
                            <span>טיפים לשיפור במבחן הבא:</span>
                          </div>
                          <ul className="space-y-1 text-foreground/90 pr-1 list-disc list-inside text-[11px]">
                            {submissionRecord.tips.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4-Pillar Reading Comprehension Rubric Cards */}
                  {submissionRecord?.unseenRubric && (
                    <div className="space-y-2.5 text-right">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        <span>פירוט ציונים לפי 4 עמודי התווך של משרד החינוך בהבנת הנקרא:</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {/* 1. Explicit Details */}
                        <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-foreground">איתור מידע מפורש (Explicit Details)</span>
                            <span className="text-primary font-mono text-[11px]">
                              {submissionRecord.unseenRubric.explicitDetails.score} / {submissionRecord.unseenRubric.explicitDetails.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (submissionRecord.unseenRubric.explicitDetails.score / submissionRecord.unseenRubric.explicitDetails.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {submissionRecord.unseenRubric.explicitDetails.commentHebrew}
                          </p>
                        </div>

                        {/* 2. Inference & Context */}
                        <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-foreground">הסקת מסקנות ורמזי הקשר (Inference)</span>
                            <span className="text-primary font-mono text-[11px]">
                              {submissionRecord.unseenRubric.inferenceAndContext.score} / {submissionRecord.unseenRubric.inferenceAndContext.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (submissionRecord.unseenRubric.inferenceAndContext.score / submissionRecord.unseenRubric.inferenceAndContext.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {submissionRecord.unseenRubric.inferenceAndContext.commentHebrew}
                          </p>
                        </div>

                        {/* 3. Global Understanding */}
                        <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-foreground">הבנה כוללת ורעיון מרכזי (Global)</span>
                            <span className="text-primary font-mono text-[11px]">
                              {submissionRecord.unseenRubric.globalUnderstanding.score} / {submissionRecord.unseenRubric.globalUnderstanding.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (submissionRecord.unseenRubric.globalUnderstanding.score / submissionRecord.unseenRubric.globalUnderstanding.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {submissionRecord.unseenRubric.globalUnderstanding.commentHebrew}
                          </p>
                        </div>

                        {/* 4. Language & Accuracy */}
                        <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-foreground">דיוק בניסוח ובהעתקת משפטים (Accuracy)</span>
                            <span className="text-primary font-mono text-[11px]">
                              {submissionRecord.unseenRubric.languageAndAccuracy.score} / {submissionRecord.unseenRubric.languageAndAccuracy.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (submissionRecord.unseenRubric.languageAndAccuracy.score / submissionRecord.unseenRubric.languageAndAccuracy.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {submissionRecord.unseenRubric.languageAndAccuracy.commentHebrew}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submission Receipt Box */}
                  {submissionRecord && (
                    <div className="p-4 rounded-xl border border-emerald-500/30 bg-card text-xs space-y-2.5 text-right">
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>המבחן נבדק והוגש בהצלחה למורה!</span>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                          ✓ הגשה מאושרת
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                        <div>
                          <span>תלמיד/ה: </span>
                          <strong className="text-foreground">{submissionRecord.studentName}</strong> ({submissionRecord.studentClass})
                        </div>
                        <div>
                          <span>מורה מקבל/ת: </span>
                          <strong className="text-foreground">{submissionRecord.teacherName}</strong>
                        </div>
                        <div className="col-span-2 flex items-center justify-between pt-1">
                          <span>
                            קוד אישור הגשה: <code className="font-mono font-bold text-foreground px-1.5 py-0.5 bg-muted rounded">{submissionRecord.receiptCode}</code>
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(submissionRecord.receiptCode);
                              setCopiedReceipt(true);
                              setTimeout(() => setCopiedReceipt(false), 2000);
                            }}
                            className="h-7 text-xs gap-1 cursor-pointer"
                          >
                            {copiedReceipt ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedReceipt ? "הועתק!" : "העתק קוד"}</span>
                          </Button>
                        </div>
                        {submissionRecord.generationPrompt && (
                          <div className="col-span-2 flex items-start gap-1.5 pt-2 border-t border-border/40 text-xs text-muted-foreground" dir="rtl">
                            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <span>פרומפט ששימש ליצירת הטקסט: </span>
                              <strong className="text-foreground font-sans" dir="auto">"{submissionRecord.generationPrompt}"</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReviewAnswers(!showReviewAnswers)}
                      className="cursor-pointer text-xs gap-1.5"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>{showReviewAnswers ? "הסתר פירוט תשובות" : "בדוק פירוט שאלות ותשובות נכונות"}</span>
                    </Button>

                    <Link href="/student">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer text-xs gap-1.5 font-bold"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>לדף העבודות והציונים שלי &rarr;</span>
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsSubmitted(false);
                        setGradedScore(null);
                        setUserAnswers({});
                        setCheckedQuestions({});
                        setSubmissionRecord(null);
                        setShowReviewAnswers(false);
                        setActiveQuestionIndex(0);
                        setStories((prev) =>
                          prev.map((s) =>
                            s.id === currentStory.id
                              ? { ...s, questions: randomizeQuestionsOptions(s.questions) }
                              : s
                          )
                        );
                      }}
                      className="cursor-pointer text-xs gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>התחל מבחן מחדש</span>
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setIsSubmitted(false);
                        setGradedScore(null);
                        setUserAnswers({});
                        setSubmissionRecord(null);
                        setShowReviewAnswers(false);
                        setStage("settings");
                      }}
                      className="cursor-pointer text-xs gap-1.5"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>בחר קטע קריאה נוסף</span>
                    </Button>
                  </div>

                  {/* Detailed Question Review Breakdown */}
                  {showReviewAnswers && submissionRecord?.questionsBreakdown && (
                    <div className="mt-4 border-t border-border/50 pt-4 space-y-3 text-right">
                      <h4 className="font-bold text-sm text-foreground">פירוט התשובות שלך במבחן:</h4>
                      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                        {submissionRecord.questionsBreakdown.map((q) => (
                          <div
                            key={q.id}
                            className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                              q.points >= 8
                                ? "border-emerald-500/30 bg-emerald-500/5"
                                : q.points >= 5
                                ? "border-amber-500/30 bg-amber-500/5"
                                : "border-destructive/30 bg-destructive/5"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground">
                                שאלה {q.number}:{" "}
                                <InteractiveEnglishText text={q.prompt} onWordClick={handleWordClick} />
                              </span>
                              <Badge
                                variant={q.points >= 8 ? "default" : q.points >= 5 ? "secondary" : "destructive"}
                                className="text-[10px]"
                              >
                                {q.points}/10 נק׳
                              </Badge>
                            </div>

                            <div className="text-muted-foreground" dir="ltr">
                              <span>התשובה שלך: </span>
                              <strong className={q.points >= 8 ? "text-emerald-600 dark:text-emerald-400" : q.points >= 5 ? "text-amber-600 dark:text-amber-400" : "text-destructive"}>
                                {q.type === "mcq" && q.options && typeof q.userAnswer === "number"
                                  ? q.options[q.userAnswer] || q.userAnswer
                                  : String(q.userAnswer || "לא נענה")}
                              </strong>
                            </div>

                            {q.points < 10 && (
                              <div className="text-muted-foreground" dir="ltr">
                                <span>תשובה נכונה: </span>
                                <strong className="text-foreground">
                                  {q.type === "mcq" && q.options && typeof q.correctAnswer === "number"
                                    ? q.options[q.correctAnswer]
                                    : String(q.correctAnswer || q.targetSentence || q.modelAnswer || "")}
                                </strong>
                              </div>
                            )}

                            {q.feedbackHebrew && (
                              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-[11px] text-foreground space-y-0.5" dir="rtl">
                                <span className="font-bold text-primary flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  <span>משוב פדגוגי על התשובה:</span>
                                </span>
                                <p className="leading-relaxed">{q.feedbackHebrew}</p>
                              </div>
                            )}

                            {q.explanationHebrew && !q.feedbackHebrew && (
                              <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/30" dir="rtl">
                                💡 {q.explanationHebrew}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Instant Translation Toast / Popup */}
      {clickedWord && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 animate-in fade-in-0 slide-in-from-bottom-4 print:hidden">
          <div className="bg-card/95 backdrop-blur border border-border/80 shadow-2xl rounded-2xl p-3.5 pr-4 pl-4 min-w-[280px] max-w-sm mx-auto flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-foreground capitalize">{clickedWord.word}</span>
                <button
                  type="button"
                  onClick={() => handleSpeak(clickedWord.word)}
                  className="p-1 text-muted-foreground hover:text-primary rounded cursor-pointer"
                  title="Speak pronunciation"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setClickedWord(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-right rtl pt-0.5">
              <span className="text-base font-bold text-primary">
                {clickedWord.loading ? "מתרגם..." : clickedWord.hebrew}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40 mt-1">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3 w-3" /> נוסף לפנקס המילים שלך!
              </span>
              <button
                type="button"
                onClick={() => {
                  setClickedWord(null);
                  setDrawerOpen(true);
                }}
                className="text-primary hover:underline cursor-pointer"
              >
                תרגול בפנקס &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Vocabulary Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs print:hidden animate-in fade-in-0">
          <div className="w-full max-w-md bg-card border-l border-border h-full p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base text-foreground">פנקס המילים שלי</h3>
                  <Badge variant="secondary" className="text-xs">
                    {savedWords.length}
                  </Badge>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                כל מילה שלחצת עליה במהלך קריאת האנסין נשמרה כאן אוטומטית לתרגול!
              </p>

              <div className="mt-4 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {savedWords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-xs">
                    עדיין לא נשמרו מילים. לחץ על מילים בטקסט כדי לראות תרגום ולהוסיף לפנקס!
                  </div>
                ) : (
                  savedWords.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.english)}
                          className="text-muted-foreground hover:text-primary cursor-pointer p-0.5"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-bold text-xs capitalize text-foreground">{item.english}</span>
                      </div>
                      <span className="text-xs font-semibold text-primary">{item.hebrew}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link
                href="/vocabulary"
                className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg text-center hover:bg-primary/90 transition"
              >
                עבור לאימון מלא באוצר מילים (כרטיסיות ומשחקים) &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Graded Exam Submission */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 print:hidden">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" dir="rtl">
              <div className="flex items-center gap-2.5 text-primary border-b border-border/50 pb-3">
                <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-black text-lg text-foreground">הגשת מבחן אנסין לבדיקה וציון</h3>
                  <p className="text-xs text-muted-foreground">{currentStory.hebrewTitle} &bull; {currentStory.title}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">מענה על שאלות:</span>
                <span className={`font-bold ${answeredCount === 10 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {answeredCount} מתוך 10 שאלות נענו
                </span>
              </div>
              {answeredCount < 10 && (
                <p className="text-[11px] text-amber-700 dark:text-amber-300 pt-1">
                  ⚠️ שים לב: ישנן שאלות ללא מענה. כל שאלה שלא נענתה תקבל 0 נקודות.
                </p>
              )}
            </div>

            {currentStory.generationPrompt && (
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-start gap-2 text-xs">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <span className="font-bold text-purple-900 dark:text-purple-200 block">
                    פרומפט ששימש ליצירת הטקסט:
                  </span>
                  <p className="text-foreground/90 font-medium font-sans" dir="auto">
                    "{currentStory.generationPrompt}"
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-1">
              {/* Student Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">שם התלמיד/ה:</label>
                <Input
                  type="text"
                  placeholder="שם מלא באנגלית או בעברית"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  className="h-9 text-xs font-bold"
                  required
                />
              </div>

              {/* Class & Teacher */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">כיתה:</label>
                  <Input
                    type="text"
                    placeholder="למשל: ז׳2"
                    value={studentClassInput}
                    onChange={(e) => setStudentClassInput(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">מורה בודק/ת:</label>
                    {selectedTeacher && !isChangingTeacher && (
                      <button
                        type="button"
                        onClick={() => setIsChangingTeacher(true)}
                        className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>החלף מורה</span>
                      </button>
                    )}
                    {isChangingTeacher && (
                      <button
                        type="button"
                        onClick={() => setIsChangingTeacher(false)}
                        className="text-[11px] text-muted-foreground hover:underline cursor-pointer"
                      >
                        ביטול
                      </button>
                    )}
                  </div>

                  {!isChangingTeacher && selectedTeacher ? (
                    <div className="h-9 px-2.5 rounded-md border border-primary/30 bg-primary/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <UserCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-bold text-foreground truncate">
                          {selectedTeacher.name}
                        </span>
                        {selectedTeacher.schoolName && (
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            &bull; {selectedTeacher.schoolName}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsChangingTeacher(true)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-foreground hover:bg-muted font-medium transition cursor-pointer shrink-0"
                        title="החלף מורה"
                      >
                        החלף
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedTeacherId}
                      onChange={(e) => {
                        setSelectedTeacherId(e.target.value);
                        setIsChangingTeacher(false);
                      }}
                      className="w-full h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                      autoFocus={isChangingTeacher}
                    >
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {formatTeacherDisplayName(t, teachers)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Optional note */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">הערה אישית למורה (אופציונלי):</label>
                <Input
                  type="text"
                  placeholder="למשל: היה לי מאתגר עם שאלה 5"
                  value={studentNoteInput}
                  onChange={(e) => setStudentNoteInput(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => setShowSubmitModal(false)}
                className="cursor-pointer text-xs"
              >
                חזור למבחן
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmitGradedExam}
                disabled={isSubmitting}
                className="cursor-pointer text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? "מעריך תשובות ומפיק משוב AI..." : "שלח למורה וחשב ציון"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Key Settings Modal */}
      {showAiSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 print:hidden">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2 text-primary">
                <Key className="h-5 w-5" />
                <h3 className="font-bold text-base text-foreground">הגדרת מפתחות AI ליצירת אנסין</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAiSettingsModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              מערכת האנסין משתמשת במודלי AI מתקדמים (Groq 120B ו-Google Gemini).
              המפתחות שהוגדרו בשרת פעילים אוטומטית. ניתן לעדכן או להזין מפתחות אישיים שנשמרים בדפדפן שלך:
            </p>

            <div className="space-y-3">
              {/* Groq Key */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Groq API Key (Llama 3.3 / 120B):</label>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary hover:underline"
                  >
                    קבלת מפתח חינם &larr;
                  </a>
                </div>
                <Input
                  type="password"
                  placeholder="gsk_..."
                  value={customGroqKey}
                  onChange={(e) => setCustomGroqKey(e.target.value)}
                  className="h-9 text-xs font-mono ltr text-left"
                />
              </div>

              {/* Gemini Key */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Google AI Studio (Gemini):</label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary hover:underline"
                  >
                    קבלת מפתח חינם &larr;
                  </a>
                </div>
                <Input
                  type="password"
                  placeholder="AIzaSy..."
                  value={customGeminiKey}
                  onChange={(e) => setCustomGeminiKey(e.target.value)}
                  className="h-9 text-xs font-mono ltr text-left"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/50 border border-border/50 text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>מנגנון מפל אוטומטי (Cascade)</span>
              </div>
              <p>
                אם מודל אחד עמוס או מגיע למגבלת קצב, המערכת תעבור באופן אוטומטי ושקוף למודל הבא ללא הפרעה.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAiSettingsModal(false)}
                className="cursor-pointer text-xs"
              >
                ביטול
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    if (customGroqKey.trim()) localStorage.setItem("ett_groq_api_key", customGroqKey.trim());
                    else localStorage.removeItem("ett_groq_api_key");

                    if (customGeminiKey.trim()) localStorage.setItem("ett_gemini_api_key", customGeminiKey.trim());
                    else localStorage.removeItem("ett_gemini_api_key");
                  }
                  setShowAiSettingsModal(false);
                  setAiNoticeType("success");
                  setAiNotice("המפתחות נשמרו בהצלחה!");
                }}
                className="cursor-pointer text-xs font-bold shadow-xs"
              >
                שמור הגדרות
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRINT EXAM BOOKLET MODAL (OPTIONS DIALOG)
          ========================================================================= */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 print:hidden">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2 text-primary">
                <Printer className="h-5 w-5" />
                <div>
                  <h3 className="font-bold text-base text-foreground">הדפסת מבחן / דף עבודה</h3>
                  <p className="text-xs text-muted-foreground">{currentStory.title} &bull; {currentStory.hebrewTitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scope Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">מה ברצונך להדפיס?</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPrintScope("full")}
                  className={`p-3 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                    printScope === "full"
                      ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30"
                      : "border-border/60 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold text-foreground">מבחן מלא</span>
                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">מומלץ</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    קטע קריאה + 10 שאלות מלאות
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPrintScope("text_only")}
                  className={`p-3 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                    printScope === "text_only"
                      ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30"
                      : "border-border/60 hover:bg-muted/40"
                  }`}
                >
                  <span className="text-xs font-bold text-foreground mb-1">קטע קריאה בלבד</span>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    הטקסט והפסקאות ללא שאלות
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPrintScope("questions_only")}
                  className={`p-3 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                    printScope === "questions_only"
                      ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/30"
                      : "border-border/60 hover:bg-muted/40"
                  }`}
                >
                  <span className="text-xs font-bold text-foreground mb-1">שאלות בלבד</span>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    10 שאלות לתרגול או מבחן
                  </p>
                </button>
              </div>
            </div>

            {/* Print Options */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <label className="text-xs font-bold text-foreground">התאמות דף הבחינה:</label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printIncludeHeader}
                    onChange={(e) => setPrintIncludeHeader(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <span>כלול כותרת מבחן רשמית (שורת שם תלמיד, כיתה, תאריך וציון)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printIncludeVocab}
                    onChange={(e) => setPrintIncludeVocab(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <span>כלול תיבת מילים שימושיות (Vocabulary Helpers)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printSeparatePages}
                    onChange={(e) => setPrintSeparatePages(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <span>התחל שאלות בעמוד נפרד (חלוקה קשיחה ל-2 עמודים)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printIncludeAnswers}
                    onChange={(e) => setPrintIncludeAnswers(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <span className="font-semibold text-foreground">כלול דף פתרונות ומחוון למורה בסוף הדפים</span>
                </label>
              </div>

              {/* Print Tip */}
              <div className="p-2.5 rounded-lg bg-muted/50 border border-border/40 text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">💡 טיפ להדפסה מושלמת:</span> בחלון ההדפסה של הדפדפן, ודא שהשוליים (Margins) מוגדרים כ-<strong>ברירת מחדל (Default)</strong> כדי שכל העמודים ישמרו על שוליים אחידים.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrintModal(false)}
                className="cursor-pointer text-xs"
              >
                ביטול
              </Button>
              <Button
                size="sm"
                onClick={handlePrintNow}
                className="cursor-pointer text-xs font-bold shadow-xs gap-1.5 bg-primary text-primary-foreground px-5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>הדפס עכשיו / שמור כ-PDF</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Practice Mode Completion Modal */}
      {showPracticeCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 print:hidden">
          <div className="bg-card border-2 border-emerald-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 text-center" dir="rtl">
            <div className="flex justify-end -mt-2 -mr-2">
              <button
                type="button"
                onClick={() => setShowPracticeCompleteModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-lg hover:bg-muted"
                aria-label="סגור"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-xs">
                🎉
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Well Done! כל הכבוד!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                סיימת את כל {currentStory.questions.length} השאלות בתרגול קטע הקריאה &ldquo;{currentStory.title}&rdquo;!
              </p>
            </div>

            {/* Practice summary card */}
            <div className="bg-muted/40 border border-border/80 rounded-xl p-3.5 space-y-2.5 text-right">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">שאלות שהושלמו:</span>
                <span className="text-foreground font-bold">{currentStory.questions.length} מתוך {currentStory.questions.length}</span>
              </div>
              {totalMcqs > 0 && (
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">תשובות נכונות (רב-ברירה):</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold text-xs">
                    {correctMcqCount} מתוך {totalMcqs} נכונות
                  </Badge>
                </div>
              )}
              {totalOpenOrCopy > 0 && (
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">שאלות פתוחות / ציטוט שהוזנו:</span>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30 font-bold text-xs">
                    {totalOpenOrCopy} שאלות נבדקו
                  </Badge>
                </div>
              )}
              <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
                💡 תרגול מעולה! תוכל כעת לסקור את התשובות וההסברים בעברית, לתרגל קטע נוסף, או להתחיל מחדש.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setShowPracticeCompleteModal(false);
                  setIsChangingTeacher(false);
                  if (user?.teacherId) {
                    setSelectedTeacherId(user.teacherId);
                  }
                  setShowSubmitModal(true);
                }}
                className="cursor-pointer text-xs font-bold gap-1.5 h-10 bg-emerald-600 hover:bg-emerald-700 text-white sm:col-span-2 shadow-xs"
              >
                <Send className="h-4 w-4" />
                <span>הגש תוצאות למורה לבדיקה ({answeredCount}/10)</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPracticeCompleteModal(false)}
                className="cursor-pointer text-xs font-semibold h-9"
              >
                <span>סקור תשובות</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setShowPracticeCompleteModal(false);
                  setShowPracticeConfetti(false);
                  setHasCelebratedPractice(false);
                  setUserAnswers({});
                  setCheckedQuestions({});
                  setActiveQuestionIndex(0);
                  setStories((prev) =>
                    prev.map((s) =>
                      s.id === currentStory.id
                        ? { ...s, questions: randomizeQuestionsOptions(s.questions) }
                        : s
                    )
                  );
                }}
                className="cursor-pointer text-xs font-bold gap-1.5 h-9"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>התחל תרגול מחדש</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowPracticeCompleteModal(false);
                  setShowPracticeConfetti(false);
                  setStage("settings");
                }}
                className="cursor-pointer text-xs font-semibold h-9 col-span-1 sm:col-span-2"
              >
                <Sliders className="h-3.5 w-3.5 mr-1" />
                <span>בחר קטע קריאה נוסף</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti Animation */}
      <Confetti active={showPracticeConfetti} onComplete={() => setShowPracticeConfetti(false)} />

      {/* =========================================================================
          DEDICATED PROFESSIONAL PRINT EXAM BOOKLET
          Visible ONLY during window.print() (hidden on screen)
          Structured into dedicated .print-page-sheet sections with standard 20mm Word margins
          ========================================================================= */}
      <div className="hidden print:block w-full bg-white text-slate-900 font-sans text-left ltr antialiased notranslate" translate="no" lang="en">
        <style dangerouslySetInnerHTML={{ __html: `
          @page {
            size: A4 portrait;
            margin: 20mm 20mm 20mm 20mm !important;
          }
          @media print {
            html, body {
              background: #ffffff !important;
              color: #1e293b !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print-page-sheet {
              display: block !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              box-sizing: border-box !important;
            }
            .print-break-before {
              break-before: page !important;
              page-break-before: always !important;
            }
            .print-avoid-break {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }
          }
        `}} />
        {/* SHEET 1: Reading Passage Page */}
        {(printScope === "full" || printScope === "text_only") && (
          <div className="print-page-sheet">
            {/* Student Exam Header */}
            {printIncludeHeader && (
              <div className="border border-slate-300 rounded-xl p-3.5 mb-5 print-avoid-break bg-slate-50/50">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800">English Exam</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-xs text-slate-600 font-medium">Reading Comprehension</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      Level: {currentStory.level}
                    </span>
                    <span className="text-xs font-bold text-slate-700">100 Points</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-y-3 gap-x-4 text-xs pt-0.5">
                  <div className="col-span-5 flex items-baseline gap-1.5">
                    <span className="font-semibold text-slate-700 shrink-0">Name:</span>
                    <span className="flex-1 border-b border-dotted border-slate-400 h-4"></span>
                  </div>
                  <div className="col-span-3 flex items-baseline gap-1.5">
                    <span className="font-semibold text-slate-700 shrink-0">Class:</span>
                    <span className="flex-1 border-b border-dotted border-slate-400 h-4"></span>
                  </div>
                  <div className="col-span-4 flex items-baseline gap-1.5">
                    <span className="font-semibold text-slate-700 shrink-0">Date:</span>
                    <span className="flex-1 border-b border-dotted border-slate-400 h-4"></span>
                  </div>
                  <div className="col-span-6 flex items-baseline gap-1.5">
                    <span className="font-semibold text-slate-700 shrink-0">Teacher:</span>
                    <span className="flex-1 border-b border-dotted border-slate-400 h-4"></span>
                  </div>
                  <div className="col-span-6 text-right">
                    <span className="inline-flex items-center gap-2 font-bold text-xs bg-white border border-slate-300 rounded-lg px-3 py-1">
                      <span>Score:</span>
                      <span className="text-slate-400 font-normal">________ / 100</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* PART I: Reading Passage */}
            <section className="space-y-4">
              {/* Passage Title */}
              <div className="text-center pb-2.5 border-b border-slate-200 mb-3.5">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {currentStory.title}
                </h1>
                {currentStory.hebrewTitle && (
                  <p className="text-xs font-medium text-slate-500 rtl mt-0.5">
                    ({currentStory.hebrewTitle})
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider pb-1">
                <span>Part I: Read the text below carefully</span>
                <span>Answer the questions according to the passage</span>
              </div>

              {/* Paragraphs with friendly circular badges & comfortable line height */}
              <div className="space-y-4 text-[13.5px] leading-[1.7] text-slate-800 text-justify">
                {currentStory.paragraphs.map((para, idx) => (
                  <div key={idx} className="print-avoid-break flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="m-0 flex-1">{para}</p>
                  </div>
                ))}
              </div>

              {/* Vocabulary Helpers (Clean 2 or 3-column pill grid) */}
              {printIncludeVocab && currentStory.vocabularyHints && currentStory.vocabularyHints.length > 0 && (
                <div className="mt-5 p-3 rounded-lg border border-slate-200 bg-slate-50/60 print-avoid-break">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Useful Words &middot; מילים שימושיות:
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-1.5 text-xs">
                    {currentStory.vocabularyHints.map((h, i) => (
                      <div key={i} className="flex items-baseline justify-between text-[11px] border-b border-dotted border-slate-200 pb-0.5">
                        <span className="font-semibold text-slate-800">{h.word}</span>
                        <span className="text-slate-600 rtl font-medium">{h.translation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* SHEET 2: Questions Page 1 (Questions 1 - 5) */}
        {(printScope === "full" || printScope === "questions_only") && (
          <div className={`print-page-sheet ${printScope === "full" && printSeparatePages ? "print-break-before" : ""}`}>
            <section className="space-y-3.5 pt-1">
              <div className="border-b border-slate-300 pb-2 mb-3.5">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                    Part II: Questions (Questions 1 &ndash; 5)
                  </h2>
                  <span className="text-xs text-slate-600 font-medium">10 questions &bull; 10 points each</span>
                </div>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  Answer all questions according to the passage. Circle the letter of the correct answer for multiple-choice questions.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {currentStory.questions.slice(0, 5).map((q, idx) => {
                  const qIdx = idx;
                  const letters = ["A", "B", "C", "D"];
                  return (
                    <div key={q.id || qIdx} className="print-avoid-break border-b border-slate-100 pb-3 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-bold text-slate-900 text-[12.5px] leading-snug">
                          <span className="text-slate-500 mr-1">{qIdx + 1}.</span>
                          <span>{q.prompt}</span>
                          {q.linesHint && (
                            <span className="text-slate-500 font-normal text-xs ml-1.5 italic">({q.linesHint})</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {q.points || 10} pts
                        </span>
                      </div>

                      {/* MCQ Options with friendly pill bubbles */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 pl-4">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-start gap-2 text-[11.5px] leading-snug text-slate-800">
                              <span className="w-4 h-4 rounded-full border border-slate-400 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {letters[oIdx]}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Ruled lines for open/copy type questions if any */}
                      {q.type !== "mcq" && (
                        <div className="pt-2 pl-4 space-y-2.5">
                          <div className="border-b border-dotted border-slate-400 h-4 w-full" />
                          <div className="border-b border-dotted border-slate-400 h-4 w-full" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* SHEET 3: Questions Page 2 (Questions 6 - 10) */}
        {(printScope === "full" || printScope === "questions_only") && currentStory.questions.length > 5 && (
          <div className="print-page-sheet print-break-before">
            <section className="space-y-3.5 pt-1">
              <div className="border-b border-slate-300 pb-2 mb-3.5">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                    Part II: Questions Continued (Questions 6 &ndash; {currentStory.questions.length})
                  </h2>
                  <span className="text-xs text-slate-600 font-medium">Continued from previous page</span>
                </div>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  Answer all questions according to the passage. Circle the letter of the correct answer for multiple-choice questions.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {currentStory.questions.slice(5).map((q, idx) => {
                  const qIdx = idx + 5;
                  const letters = ["A", "B", "C", "D"];
                  return (
                    <div key={q.id || qIdx} className="print-avoid-break border-b border-slate-100 pb-3 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-bold text-slate-900 text-[12.5px] leading-snug">
                          <span className="text-slate-500 mr-1">{qIdx + 1}.</span>
                          <span>{q.prompt}</span>
                          {q.linesHint && (
                            <span className="text-slate-500 font-normal text-xs ml-1.5 italic">({q.linesHint})</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {q.points || 10} pts
                        </span>
                      </div>

                      {/* MCQ Options with friendly pill bubbles */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 pl-4">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-start gap-2 text-[11.5px] leading-snug text-slate-800">
                              <span className="w-4 h-4 rounded-full border border-slate-400 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {letters[oIdx]}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Ruled lines for open/copy type questions if any */}
                      {q.type !== "mcq" && (
                        <div className="pt-2 pl-4 space-y-2.5">
                          <div className="border-b border-dotted border-slate-400 h-4 w-full" />
                          <div className="border-b border-dotted border-slate-400 h-4 w-full" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* Optional Teacher Answer Key Sheet */}
        {printIncludeAnswers && (
          <div className="print-page-sheet print-break-before">
            <section className="space-y-4 pt-1">
              <div className="border-b border-slate-300 pb-2 text-center">
                <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-900">
                  Teacher Answer Key & Explanations (מחוון למורה)
                </h2>
                <p className="text-xs text-slate-500">
                  {currentStory.title} &bull; {currentStory.level} &bull; Total Points: 100
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {currentStory.questions.map((q, qIdx) => {
                  const letters = ["A", "B", "C", "D"];
                  const correctLetter = letters[q.correctIndex || 0] || "A";

                  return (
                    <div key={qIdx} className="print-avoid-break p-2 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                      <div className="flex justify-between items-center font-bold text-slate-900 text-xs">
                        <span>
                          Question {qIdx + 1} ({q.linesHint || `Paragraph ${q.paragraphIndex + 1}`}):
                        </span>
                        {q.type === "mcq" ? (
                          <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[10px]">
                            Correct: ({correctLetter})
                          </span>
                        ) : q.type === "copy" ? (
                          <span className="bg-amber-700 text-white px-2 py-0.5 rounded text-[10px]">
                            Sentence Quote (ציטוט משפט)
                          </span>
                        ) : (
                          <span className="bg-blue-700 text-white px-2 py-0.5 rounded text-[10px]">
                            Open / Free typing (תשובה פתוחה)
                          </span>
                        )}
                      </div>

                      {q.type === "mcq" ? (
                        <p className="text-slate-800 text-xs font-medium pl-2">
                          &rarr; {q.options ? q.options[q.correctIndex || 0] : ""}
                        </p>
                      ) : q.type === "copy" ? (
                        <div className="text-slate-800 text-xs font-medium pl-2 space-y-0.5">
                          <p>&ldquo;{q.targetSentence || ""}&rdquo;</p>
                        </div>
                      ) : (
                        <div className="text-slate-800 text-xs font-medium pl-2 space-y-0.5">
                          <p className="font-semibold text-slate-900">דוגמת תשובה (Model Answer):</p>
                          <p className="italic text-slate-700">&ldquo;{q.modelAnswer || ""}&rdquo;</p>
                          {q.keywords && q.keywords.length > 0 && (
                            <p className="text-[11px] text-slate-500">
                              מילות מפתח נדרשות: {q.keywords.join(", ")}
                            </p>
                          )}
                        </div>
                      )}

                      {q.explanationHebrew && (
                        <p className="text-slate-600 text-[11px] rtl text-right border-t border-slate-200 pt-1 mt-1">
                          <strong>הסבר פדגוגי בעברית:</strong> {q.explanationHebrew}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
