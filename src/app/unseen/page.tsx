"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { MIDDLE_SCHOOL_UNSEENS, MSUnseenStory, MSUnseenQuestion } from "@/data/unseen-middle-school";
import { lookupBuiltInTranslation } from "@/data/built-in-dictionary";
import { saveWordToBuilder, VocabItem, loadSavedWords } from "@/lib/vocab-storage";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  BookMarked,
  Volume2,
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
} from "lucide-react";

export default function UnseenPracticePage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<MSUnseenStory[]>(MIDDLE_SCHOOL_UNSEENS);

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

  // Story selector tabs: "library" vs "ai_generator"
  const [storySourceTab, setStorySourceTab] = useState<"library" | "ai_generator">("library");

  // AI Story Generation State
  const [aiTopicInput, setAiTopicInput] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  // Active Question in 10-Question navigation
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const activeQuestion: MSUnseenQuestion = currentStory.questions[activeQuestionIndex] || currentStory.questions[0];

  // Answers & Checking
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});

  // Graded Mode Submission State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gradedScore, setGradedScore] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

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
      setSelectedStoryId(matching[0].id);
      setActiveQuestionIndex(0);
      setUserAnswers({});
      setCheckedQuestions({});
      setIsSubmitted(false);
      setGradedScore(null);
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
  };

  // Generate with AI
  const handleGenerateAiStory = async (customTopic?: string) => {
    const topicToUse = customTopic || aiTopicInput.trim();
    if (!topicToUse) return;

    setIsGeneratingAi(true);
    setAiNotice(null);

    try {
      const res = await fetch("/api/generate-unseen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: selectedLevel, topic: topicToUse }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.story) {
          const newStory: MSUnseenStory = data.story;
          setStories((prev) => [newStory, ...prev.filter((s) => s.id !== newStory.id)]);
          setSelectedStoryId(newStory.id);
          setActiveQuestionIndex(0);
          setUserAnswers({});
          setCheckedQuestions({});
          setIsSubmitted(false);
          setGradedScore(null);

          if (data.isFallback) {
            setAiNotice(data.message || "Loaded an exciting matching story from our curated library!");
          } else {
            setAiNotice("✨ Your customized AI story has been created!");
          }
          setStorySourceTab("library");
        }
      }
    } catch {
      setAiNotice("Could not connect to AI service. Please choose from our library below.");
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
      const res = await fetch("/api/translate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Text-to-Speech
  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Copy sentence into input
  const handleCopySentence = (sentence: string) => {
    if (!activeQuestion || activeQuestion.type !== "copy") return;
    setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: sentence.trim() }));
  };

  // Practice mode: check single answer
  const handleCheckPracticeAnswer = (qId: string) => {
    setCheckedQuestions((prev) => ({ ...prev, [qId]: true }));
  };

  // Graded mode: Submit all answers
  const handleSubmitGradedExam = () => {
    let earned = 0;
    currentStory.questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (q.type === "mcq") {
        if (ans === q.correctIndex) {
          earned += 10;
        }
      } else if (q.type === "copy") {
        if (typeof ans === "string" && q.targetSentence) {
          const cleanUser = ans.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
          const cleanTarget = q.targetSentence.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
          if (cleanUser === cleanTarget || cleanTarget.includes(cleanUser)) {
            earned += 10;
          }
        }
      } else if (q.type === "open") {
        if (typeof ans === "string" && ans.trim().length > 3) {
          const cleanUser = ans.toLowerCase();
          const matches = (q.keywords || []).filter((kw) => cleanUser.includes(kw.toLowerCase()));
          if (matches.length > 0 || ans.length > 10) {
            earned += 10;
          }
        }
      }
    });

    setGradedScore(earned);
    setIsSubmitted(true);
    setShowSubmitModal(false);
  };

  // Total answered questions count
  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] !== undefined && userAnswers[k] !== ""
  ).length;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔍</span>
              <div>
                <h1 className="text-sm font-semibold tracking-tight">בלשי האנסין</h1>
                <p className="text-[10px] text-muted-foreground">קריאה אינטראקטיבית • 10 שאלות לתרגול</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDrawerOpen(true)}
              className="cursor-pointer gap-1.5 text-xs border-primary/20 hover:border-primary/40 relative"
            >
              <BookMarked className="h-3.5 w-3.5 text-primary" />
              <span>פנקס מילים</span>
              {savedWords.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-primary text-primary-foreground rounded-full text-[10px] font-bold">
                  {savedWords.length}
                </span>
              )}
            </Button>
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto flex-1 px-4 sm:px-8 py-6 space-y-6 max-w-6xl">
        {/* Level Selector & Mode Selector Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 print:hidden">
          {/* Level Selector (9 Cols) */}
          <div className="lg:col-span-8 bg-card border border-border/60 rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-primary" />
                <span>Select Reading Level (בחר רמת קריאה)</span>
              </span>
              <span className="text-[11px] text-muted-foreground">10 שאלות לכל קטע קריאה</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: "Level 1" as const,
                  title: "רמה 1",
                  sub: "קוראים מתחילים",
                  desc: "Starting level English for beginner readers",
                  badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                },
                {
                  id: "Level 2" as const,
                  title: "רמה 2",
                  sub: "רמה שוטפת",
                  desc: "Satisfactory English, late elementary level",
                  badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                },
                {
                  id: "Level 3" as const,
                  title: "רמה 3",
                  sub: "מתקדמים ודוברי אנגלית",
                  desc: "Challenging texts for fluent English speakers",
                  badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
                },
              ].map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleLevelSelect(lvl.id)}
                    className={`p-3 rounded-lg border text-right transition cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                        : "border-border/60 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">{lvl.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${lvl.badgeColor}`}>
                        {lvl.sub}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Selector (4 Cols) */}
          <div className="lg:col-span-4 bg-card border border-border/60 rounded-xl p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-primary" />
                <span>Mode (מצב פעילות)</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 h-full">
              <button
                type="button"
                onClick={() => {
                  setMode("practice");
                  setIsSubmitted(false);
                }}
                className={`p-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  mode === "practice"
                    ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20 text-primary"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <Target className="h-4 w-4" />
                <span className="text-xs font-bold text-foreground">אימון חופשי</span>
                <span className="text-[10px] text-muted-foreground">בדיקה מיידית ורמזים</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("graded");
                  setCheckedQuestions({});
                }}
                className={`p-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  mode === "graded"
                    ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20 text-primary"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <Award className="h-4 w-4" />
                <span className="text-xs font-bold text-foreground">הגשה לציון</span>
                <span className="text-[10px] text-muted-foreground">מבחן ללא תשובות ביניים</span>
              </button>
            </div>
          </div>
        </div>

        {/* Story Selection / AI Generator Tabs */}
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-xs print:hidden space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStorySourceTab("library")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  storySourceTab === "library"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <BookMarked className="h-3.5 w-3.5" />
                <span>ספריית קטעים ({levelStories.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setStorySourceTab("ai_generator")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  storySourceTab === "ai_generator"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>יצירה אישית עם AI</span>
              </button>
            </div>

            <span className="text-xs text-muted-foreground hidden sm:inline">
              נושא נבחר: <strong>{currentStory.title}</strong>
            </span>
          </div>

          {/* Library Tab Content */}
          {storySourceTab === "library" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
              {levelStories.map((story, idx) => {
                const isSelected = story.id === currentStory.id;
                return (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => handleStorySelect(story.id)}
                    className={`p-2.5 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between h-20 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs"
                        : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] text-muted-foreground">טקסט {idx + 1}</span>
                      <h4 className="text-xs font-semibold text-foreground truncate">{story.title}</h4>
                    </div>
                    <span className="text-[11px] text-muted-foreground truncate text-right rtl">
                      {story.hebrewTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* AI Generator Tab Content */}
          {storySourceTab === "ai_generator" && (
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Input
                  type="text"
                  placeholder="כתוב נושא או תחום עניין (למשל: מיינקראפט, כדורגל, גורי כלבים, חלל...)"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  className="text-xs h-9 text-right rtl"
                  disabled={isGeneratingAi}
                />
                <Button
                  onClick={() => handleGenerateAiStory()}
                  disabled={isGeneratingAi || !aiTopicInput.trim()}
                  size="sm"
                  className="w-full sm:w-auto shrink-0 gap-1.5 cursor-pointer text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isGeneratingAi ? "יוצר אנסין מותאם..." : "צור קטע קריאה עם AI"}</span>
                </Button>
              </div>

              {/* Quick Suggestion Chips */}
              <div>
                <p className="text-[11px] text-muted-foreground mb-1.5">או בחר מתוך נושאים פופולריים:</p>
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
                      className="text-xs px-2.5 py-1 rounded-full border border-border/80 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 transition cursor-pointer"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {aiNotice && (
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{aiNotice}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Work Area: Reading Passage (Left) + Questions Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Reading Passage Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
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
                      variant="outline"
                      size="sm"
                      onClick={() => handleSpeak(currentStory.paragraphs.join(" "))}
                      className="cursor-pointer gap-1 text-xs"
                      title="Listen to story"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-primary" />
                      <span className="hidden sm:inline">Listen</span>
                    </Button>

                    {/* Print Booklet */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="cursor-pointer gap-1 text-xs"
                      title="Print exam booklet"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Print</span>
                    </Button>
                  </div>
                </div>

                <div className="mt-2">
                  <CardTitle className="text-xl font-bold tracking-tight">{currentStory.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">{currentStory.hebrewTitle}</p>
                </div>

                <div className="p-2 rounded-lg bg-muted/40 text-[11px] text-muted-foreground flex items-center gap-2 mt-2 print:hidden">
                  <Info className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    💡 <strong>טיפ בלשים:</strong> לחץ על <strong>כל מילה</strong> בטקסט כדי לראות תרגום מיידי ולהוסיף לפנקס המילים האישי שלך!
                  </span>
                </div>
              </CardHeader>

              {/* Story Paragraphs */}
              <CardContent className="pt-4 space-y-4">
                {currentStory.paragraphs.map((para, pIdx) => {
                  const isHighlighted =
                    activeQuestion &&
                    (activeQuestion.paragraphIndex === pIdx || activeQuestion.paragraphIndex === 3);

                  const textSizeClass =
                    fontSize === "sm" ? "text-sm leading-relaxed" : fontSize === "lg" ? "text-lg leading-loose" : "text-base leading-relaxed";

                  // Split paragraph into interactive clickable words
                  const tokens = para.split(/(\s+)/);

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

                        {activeQuestion?.type === "copy" && (
                          <span className="text-[10px] text-primary flex items-center gap-1 print:hidden">
                            <Copy className="h-3 w-3" />
                            <span>לחץ על משפט כדי להעתיק לתשובה</span>
                          </span>
                        )}
                      </div>

                      <p className={`${textSizeClass} text-foreground/90 font-sans tracking-wide`}>
                        {tokens.map((token, tIdx) => {
                          const isSpace = /^\s+$/.test(token);
                          if (isSpace) return <span key={tIdx}>{token}</span>;

                          return (
                            <span
                              key={tIdx}
                              onClick={() => handleWordClick(token)}
                              className="cursor-pointer hover:bg-primary/20 hover:text-primary rounded px-0.5 transition-colors underline decoration-dotted decoration-muted-foreground/30 hover:decoration-primary"
                              title={`Click to translate "${token}"`}
                            >
                              {token}
                            </span>
                          );
                        })}
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
          </div>

          {/* 10 Questions Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 print:hidden">
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

              {/* 10 Question Pills */}
              <div className="grid grid-cols-10 gap-1">
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
                      className={`h-8 rounded-md border text-xs flex items-center justify-center transition cursor-pointer relative ${pillColor}`}
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

                  <h3 className="text-sm font-semibold text-foreground mt-2 leading-relaxed">
                    {activeQuestion.prompt}
                  </h3>
                </CardHeader>

                <CardContent className="pt-4 space-y-3">
                  {/* Multiple Choice Question */}
                  {activeQuestion.type === "mcq" && activeQuestion.options && (
                    <div className="space-y-2">
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
                              setCheckedQuestions((prev) => ({ ...prev, [activeQuestion.id]: false }));
                            }}
                            className={`w-full p-3 rounded-lg border text-left text-xs transition cursor-pointer flex items-start gap-2.5 ${optStyle}`}
                          >
                            <span className="h-5 w-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1 leading-relaxed">{option}</span>
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
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground block">
                          הקלד את המשפט המדויק מהפסקה, או העתק אותו ישירות:
                        </label>
                        {activeQuestion.targetSentence && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCopySentence(activeQuestion.targetSentence || "")}
                            className="h-6 text-[11px] gap-1 cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            <span>הדבק משפט</span>
                          </Button>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Type the exact sentence from the story..."
                        value={(userAnswers[activeQuestion.id] as string) || ""}
                        onChange={(e) =>
                          setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: e.target.value }))
                        }
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
                          משפט היעד: <strong>&ldquo;{activeQuestion.targetSentence}&rdquo;</strong>
                        </p>
                      )}

                      {activeQuestion.modelAnswer && (
                        <p className="text-muted-foreground text-[11px]">
                          תשובה לדוגמה: <strong>&ldquo;{activeQuestion.modelAnswer}&rdquo;</strong>
                        </p>
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
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleCheckPracticeAnswer(activeQuestion.id)}
                      className="cursor-pointer gap-1.5 text-xs"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>בדוק תשובה</span>
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setShowSubmitModal(true)}
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
            {mode === "graded" && isSubmitted && gradedScore !== null && (
              <Card className="border-emerald-500/40 bg-emerald-500/5 shadow-md animate-in fade-in-0">
                <CardHeader className="pb-2 text-center">
                  <span className="text-3xl">🏆</span>
                  <CardTitle className="text-lg text-emerald-700 dark:text-emerald-300">
                    ציון המבחן שלך: {gradedScore} / 100
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {gradedScore >= 90
                      ? "מצוין! הפגנת שליטה יוצאת מן הכלל בטקסט!"
                      : gradedScore >= 70
                      ? "עבודה יפה מאוד! כל הכבוד על המאמץ!"
                      : "המשך לתרגל, כל אנסין משפר את אוצר המילים שלך!"}
                  </p>
                </CardHeader>
                <CardContent className="pt-2 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSubmitted(false);
                      setGradedScore(null);
                      setUserAnswers({});
                    }}
                    className="cursor-pointer text-xs gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>התחל מבחן מחדש</span>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Instant Translation Toast / Popup */}
      {clickedWord && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in-0 slide-in-from-bottom-4 print:hidden">
          <div className="bg-card/95 backdrop-blur border border-border/80 shadow-2xl rounded-2xl p-3.5 pr-4 pl-4 min-w-[280px] max-w-sm flex flex-col gap-1.5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in-0 print:hidden">
          <div className="bg-card border border-border rounded-xl p-5 max-w-sm w-full shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Award className="h-5 w-5" />
              <h3 className="font-bold text-base text-foreground">הגשת המבחן לקבלת ציון</h3>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              ענית על <strong>{answeredCount}</strong> מתוך <strong>10</strong> שאלות.
              {answeredCount < 10 && " שים לב: ישנן שאלות שטרם נענו. האם ברצונך להגיש כעת?"}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSubmitModal(false)}
                className="cursor-pointer text-xs"
              >
                חזור למבחן
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmitGradedExam}
                className="cursor-pointer text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                הגש וחשב ציון
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
