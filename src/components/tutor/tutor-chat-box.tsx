"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  TutorMessage,
  StudentTutorProfile,
  TutorTaskRecommendation,
  TutorTurnInPayload,
  TutorVocabReviewItem,
} from "@/types/tutor";
import {
  CONVERSATIONAL_ONBOARDING_TOTAL_TURNS,
  getInitialOnboardingGreeting,
  generateOnboardingTurnResponse,
  calculateDiagnosticPlacement,
  saveTutorProfile,
  getOrInitTutorProfile,
  generateNextMission,
  updateMissionTopic,
  syncMissionWithDatabase,
  loadTutorChat,
  saveTutorChat,
  consumePendingTurnIn,
  getPendingTeacherAssignmentsForStudent,
  generateTeacherAssignmentPrepMessage,
  DiagnosticAnswer,
} from "@/lib/tutor-engine";
import { useAuth } from "@/lib/auth-context";
import {
  saveWordToBuilder,
  MIDDLE_SCHOOL_EASY,
  MIDDLE_SCHOOL_MEDIUM,
  MIDDLE_SCHOOL_HARD,
} from "@/lib/vocab-storage";
import { getCuratedTutorVoices, TutorVoiceOption } from "@/lib/tutor-voice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  ArrowLeft,
  BookOpen,
  BookA,
  PenTool,
  RotateCcw,
  User,
  GraduationCap,
  Play,
  Settings2,
  Check,
  Flame,
  Award,
  MoreVertical,
  RefreshCw,
  Loader2,
  CheckCircle2,
  BookMarked,
  HelpCircle,
  Calendar,
  Lightbulb,
} from "lucide-react";

interface TutorChatBoxProps {
  profile: StudentTutorProfile;
  onProfileUpdate: (newProfile: StudentTutorProfile) => void;
  studentName: string;
  onOpenStats?: () => void;
}

const VOICE_STORAGE_KEY = "ett_tutor_selected_voice";

const ALL_DISTRACTOR_WORDS = [
  ...MIDDLE_SCHOOL_EASY,
  ...MIDDLE_SCHOOL_MEDIUM,
  ...MIDDLE_SCHOOL_HARD,
];

function TurnInLessonFlowCard({
  turnIn,
  studentId,
  onSpeak,
  onStartNextMission,
}: {
  turnIn: TutorTurnInPayload;
  studentId: string;
  onSpeak: (text: string) => void;
  onStartNextMission: () => void;
}) {
  const [step, setStep] = useState<"feedback" | "vocab" | "summary">("feedback");
  const [wordIndex, setWordIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [didNotKnow, setDidNotKnow] = useState(false);
  const [savedWordsMap, setSavedWordsMap] = useState<Record<string, boolean>>({});
  const [knownCount, setKnownCount] = useState(0);
  const [nextMissionTriggered, setNextMissionTriggered] = useState(false);

  const words = useMemo(() => {
    return (turnIn.vocabToReview || []).slice(0, 8);
  }, [turnIn.vocabToReview]);

  const currentWord: TutorVocabReviewItem | null = words[wordIndex] || null;

  const options = useMemo(() => {
    if (!currentWord) return [];
    const distractorCandidates = ALL_DISTRACTOR_WORDS.filter(
      (d) =>
        d.english.toLowerCase() !== currentWord.word.toLowerCase() &&
        d.hebrew.trim() !== currentWord.hebrew.trim()
    );
    const seed = currentWord.word.charCodeAt(0) + wordIndex * 7;
    const picked: string[] = [];
    for (let i = 0; i < distractorCandidates.length && picked.length < 3; i++) {
      const idx = (seed + i * 11) % distractorCandidates.length;
      const heb = distractorCandidates[idx].hebrew;
      if (!picked.includes(heb) && heb !== currentWord.hebrew) {
        picked.push(heb);
      }
    }
    const allOpts = [currentWord.hebrew, ...picked];
    return allOpts.sort((a, b) => {
      const scoreA = (a.charCodeAt(0) * 5 + seed) % 13;
      const scoreB = (b.charCodeAt(0) * 5 + seed) % 13;
      return scoreA - scoreB;
    });
  }, [currentWord, wordIndex]);

  const handleSaveCurrentWord = (wordObj: TutorVocabReviewItem) => {
    const key = wordObj.word.toLowerCase();
    saveWordToBuilder(
      {
        english: wordObj.word,
        hebrew: wordObj.hebrew,
        partOfSpeech:
          (wordObj.pos as "noun" | "verb" | "adjective" | "adverb" | "phrase") ||
          "noun",
        example:
          wordObj.exampleSentence ||
          `We practiced the word "${wordObj.word}" in our lesson with David.`,
        level: "Personal Word",
      },
      studentId && studentId !== "guest" ? studentId : undefined
    );
    setSavedWordsMap((prev) => ({ ...prev, [key]: true }));
  };

  const handleSelectOption = (choice: string) => {
    if (!currentWord || selectedChoice !== null || didNotKnow) return;
    setSelectedChoice(choice);
    const isCorrect = choice === currentWord.hebrew;
    if (isCorrect) {
      setKnownCount((c) => c + 1);
      onSpeak(`Correct! ${currentWord.word}`);
    } else {
      // Automatically add missed word to Personal Dictionary!
      handleSaveCurrentWord(currentWord);
      onSpeak(currentWord.word);
    }
  };

  const handleDontKnow = () => {
    if (!currentWord || selectedChoice !== null || didNotKnow) return;
    setDidNotKnow(true);
    // Automatically add unknown word to Personal Dictionary!
    handleSaveCurrentWord(currentWord);
    onSpeak(currentWord.word);
  };

  const handleNextWord = () => {
    if (wordIndex < words.length - 1) {
      const nextIdx = wordIndex + 1;
      setWordIndex(nextIdx);
      setSelectedChoice(null);
      setDidNotKnow(false);
      if (words[nextIdx]) {
        onSpeak(words[nextIdx].word);
      }
    } else {
      setStep("summary");
      onSpeak("Fantastic job completing the vocabulary check! You are ready for your next practice.");
    }
  };

  const savedWordsList = words.filter((w) => savedWordsMap[w.word.toLowerCase()]);

  return (
    <div className="mt-2.5 mr-11 max-w-[94%] sm:max-w-[88%] text-right font-sans">
      <Card className="border-2 border-indigo-500/40 bg-card p-4 sm:p-5 rounded-2xl shadow-md space-y-4">
        {/* Step Progress Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5">
              {step === "feedback" && "שלב 1 מתוך 3: משוב על העבודה שלך"}
              {step === "vocab" && `שלב 2 מתוך 3: מבדק אוצר מילים (${wordIndex + 1}/${words.length})`}
              {step === "summary" && "שלב 3 מתוך 3: סיכום ומעבר למשימה הבאה"}
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={`text-xs font-black px-2.5 py-0.5 ${
              turnIn.score >= 85
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : turnIn.score >= 70
                ? "border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                : "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300"
            }`}
          >
            ציון משימה: {turnIn.score}/100
          </Badge>
        </div>

        {/* STEP 1: WORK REVIEW */}
        {step === "feedback" && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div>
              <h4 className="font-bold text-base sm:text-lg text-foreground">
                סיכום ביצוע: {turnIn.taskTitleHebrew || turnIn.taskTitle}
              </h4>
              <p className="text-xs text-muted-foreground font-sans" dir="ltr">
                {turnIn.taskTitle}
              </p>
            </div>

            {turnIn.strengths && turnIn.strengths.length > 0 && (
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>נקודות חוזק בעבודה שלך:</span>
                </div>
                <ul className="space-y-1 text-xs sm:text-sm text-foreground/90 pr-4 list-disc">
                  {turnIn.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {turnIn.improvements && turnIn.improvements.length > 0 && (
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5">
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>תיקונים ודגשים חשובים מדוד:</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-foreground/90 pr-1">
                  {turnIn.improvements.map((imp, i) => (
                    <li key={i} className="p-2 rounded-lg bg-background/60 border border-border/50 space-y-0.5">
                      {imp.original && (
                        <div className="text-xs text-muted-foreground font-sans" dir="ltr">
                          <span className="line-through text-rose-500/80 mr-1.5">{imp.original}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            &rarr; {imp.suggestion}
                          </span>
                        </div>
                      )}
                      {!imp.original && imp.suggestion && (
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-sans" dir="ltr">
                          {imp.suggestion}
                        </div>
                      )}
                      <div className="text-xs text-foreground/90">{imp.explanationHebrew}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              type="button"
              onClick={() => {
                if (words.length > 0) {
                  setStep("vocab");
                  onSpeak(words[0].word);
                } else {
                  setStep("summary");
                }
              }}
              className="w-full h-11 text-sm sm:text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-2 cursor-pointer shadow-xs"
            >
              <BookA className="h-4 w-4" />
              <span>המשך לשלב 2: מבדק אוצר מילים ({words.length} מילים) 📚</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* STEP 2: 5-8 WORD VOCABULARY QUIZ + AUTO PERSONAL DICTIONARY */}
        {step === "vocab" && currentWord && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                מילה <strong className="text-foreground">{wordIndex + 1}</strong> מתוך{" "}
                <strong className="text-foreground">{words.length}</strong>
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                📌 מילה שלא תדע/י תישמר אוטומטית במילון האישי שלך!
              </span>
            </div>

            {/* Word Display Box */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border/70 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSpeak(currentWord.word)}
                className="h-9 px-3 gap-1.5 text-xs font-bold cursor-pointer shrink-0"
              >
                <Volume2 className="h-4 w-4 text-primary" />
                <span>השמע מילה</span>
              </Button>

              <div className="text-left" dir="ltr">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-sans">
                  {currentWord.word}
                </span>
                {currentWord.pos && (
                  <span className="ml-2 text-xs text-muted-foreground italic">
                    ({currentWord.pos})
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-bold text-foreground">
                מה הפירוש של המילה &ldquo;<span dir="ltr" className="font-sans">{currentWord.word}</span>&rdquo; בעברית?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((opt, idx) => {
                  const isAnswered = selectedChoice !== null || didNotKnow;
                  const isThisCorrect = opt === currentWord.hebrew;
                  const isThisSelected = selectedChoice === opt;

                  let btnStyle = "border-border/70 bg-card hover:border-primary/60 hover:bg-muted/40 text-foreground";
                  if (isAnswered) {
                    if (isThisCorrect) {
                      btnStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 font-bold";
                    } else if (isThisSelected) {
                      btnStyle = "border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-200";
                    } else {
                      btnStyle = "border-border/40 bg-muted/20 text-muted-foreground opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-3 rounded-xl border text-right text-sm transition-all flex items-center justify-between gap-2 ${btnStyle} ${
                        !isAnswered ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isThisCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explicit "I don't know - save to Personal Dictionary" button */}
              {selectedChoice === null && !didNotKnow && (
                <button
                  type="button"
                  onClick={handleDontKnow}
                  className="w-full mt-1 py-2 px-3 rounded-xl border border-dashed border-indigo-500/50 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>לא יודע/ת עדיין – הצג פירוש ושמור במילון האישי שלי 📌</span>
                </button>
              )}
            </div>

            {/* Post-Answer Feedback & Personal Dictionary Status */}
            {(selectedChoice !== null || didNotKnow) && (
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {selectedChoice === currentWord.hebrew ? (
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>תשובה נכונה! {currentWord.word} = {currentWord.hebrew} 🎉</span>
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      הפירוש הנכון: <strong dir="ltr">{currentWord.word}</strong> = <strong>{currentWord.hebrew}</strong>
                    </span>
                  )}

                  {savedWordsMap[currentWord.word.toLowerCase()] ? (
                    <Badge className="bg-emerald-600 text-white text-[11px] font-bold gap-1">
                      <BookMarked className="h-3 w-3" />
                      <span>נשמר אוטומטית במילון האישי שלך! 📌</span>
                    </Badge>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveCurrentWord(currentWord)}
                      className="h-7 text-[11px] font-bold gap-1 cursor-pointer border-primary/40 text-primary hover:bg-primary/10"
                    >
                      <BookMarked className="h-3 w-3" />
                      <span>➕ שמור במילון האישי</span>
                    </Button>
                  )}
                </div>

                {currentWord.exampleSentence && (
                  <p className="text-xs text-muted-foreground italic text-left font-sans" dir="ltr">
                    Example: &ldquo;{currentWord.exampleSentence}&rdquo;
                  </p>
                )}

                <Button
                  type="button"
                  onClick={handleNextWord}
                  className="w-full h-10 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 cursor-pointer"
                >
                  <span>
                    {wordIndex < words.length - 1
                      ? `למילה הבאה (${wordIndex + 2}/${words.length})`
                      : "סיכום אוצר מילים והמשך למשימה הבאה 🚀"}
                  </span>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: SUMMARY & NEXT PRACTICE LAUNCH */}
        {step === "summary" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-emerald-600" />
                  <span>סיימת את מבדק אוצר המילים!</span>
                </span>
                <Badge className="bg-emerald-600 text-white text-xs font-bold">
                  ידעת {knownCount} מתוך {words.length} מילים
                </Badge>
              </div>

              {savedWordsList.length > 0 ? (
                <div className="space-y-1.5 pt-1 border-t border-emerald-500/20">
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <BookMarked className="h-3.5 w-3.5 text-indigo-600" />
                    <span>
                      {savedWordsList.length} מילים חדשות נשמרו אוטומטית במילון האישי שלך לתרגול חוזר:
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {savedWordsList.map((sw, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-card border-indigo-500/30 text-xs font-semibold py-0.5 px-2"
                      >
                        <span dir="ltr" className="font-bold">{sw.word}</span>
                        <span className="mx-1 text-muted-foreground">=</span>
                        <span>{sw.hebrew}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  כל הכבוד! שלטת בכל המילים במבדק הזה.
                </p>
              )}
            </div>

            {!nextMissionTriggered ? (
              <Button
                type="button"
                onClick={() => {
                  setNextMissionTriggered(true);
                  onStartNextMission();
                }}
                className="w-full h-11 text-sm sm:text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>המשך לתרגול הבא עם דוד 🚀</span>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center py-1">
                ✓ המשימה הבאה מוכנה עבורך בהודעה למטה!
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export function TutorChatBox({
  profile,
  onProfileUpdate,
  studentName,
  onOpenStats,
}: TutorChatBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);

  // Voice Selection State
  const [availableVoices, setAvailableVoices] = useState<TutorVoiceOption[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  // Conversational onboarding turn index (0 to 3 when !profile.diagnosticCompleted, or null when completed)
  const [diagnosticIndex, setDiagnosticIndex] = useState<number | null>(
    profile.diagnosticCompleted ? null : 0
  );
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticAnswer[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close options menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Load and Curate Voices - Default silently to Google Natural UK
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const populateVoices = () => {
      const curated = getCuratedTutorVoices();
      if (curated.length > 0) {
        setAvailableVoices(curated);

        // Prioritize UK natural / Google UK voice
        const ukGoogle = curated.find(
          (c) =>
            c.accent === "UK" &&
            (c.voice.name.toLowerCase().includes("google") || c.voice.name.toLowerCase().includes("natural"))
        );
        const defaultChoice = ukGoogle || curated[0];

        const savedURI = localStorage.getItem(VOICE_STORAGE_KEY);
        if (savedURI && curated.some((c) => c.id === savedURI)) {
          setSelectedVoiceURI(savedURI);
          const found = curated.find((c) => c.id === savedURI);
          if (found) selectedVoiceRef.current = found.voice;
        } else {
          // Zero-setup: auto-set Google Natural (UK) as default
          setSelectedVoiceURI(defaultChoice.id);
          selectedVoiceRef.current = defaultChoice.voice;
          try {
            localStorage.setItem(VOICE_STORAGE_KEY, defaultChoice.id);
          } catch {}
        }
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Scroll to bottom on new message (only when conversation has progressed beyond the initial greeting)
  useEffect(() => {
    if (messages.length > 1 || isSending) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending]);

  // Load chat history or create clean initial greeting, and consume any pending turn-in from an assignment
  useEffect(() => {
    const saved = loadTutorChat(profile.studentId);
    let baseMessages: TutorMessage[] = [];

    if (saved && saved.length > 0 && profile.diagnosticCompleted) {
      baseMessages = saved.map((m) => {
        if (m.taskRecommendation) {
          return {
            ...m,
            taskRecommendation: syncMissionWithDatabase(m.taskRecommendation, profile.level),
          };
        }
        return m;
      });
      setDiagnosticIndex(null);
    } else if (profile.diagnosticCompleted) {
      const initialGreeting: TutorMessage = {
        id: `msg-${Date.now()}`,
        sender: "tutor",
        text: `Hello ${studentName}! 👋 איזה כיף לראות אותך!\nאנחנו מתרגלים יחד ברמת **${profile.level} (${profile.vocabBand})**. במה תרצה/י שנתמקד היום – קריאת סיפור קצר, אוצר מילים, או כתיבה?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies: [
          "🎲 דוד, בחר עבורי משהו קל",
          "תן לי משימת קריאה (Unseen) 📖",
          "תרגל אוצר מילים 📚",
          "בוא נכתוב חיבור ✍️",
        ],
      };
      baseMessages = [initialGreeting];
      setDiagnosticIndex(null);
    } else {
      const onboarding = getInitialOnboardingGreeting(studentName);
      const initialGreeting: TutorMessage = {
        id: `msg-${Date.now()}`,
        sender: "tutor",
        text: onboarding.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies: onboarding.quickReplies,
      };
      baseMessages = [initialGreeting];
      setDiagnosticIndex(0);
      setDiagnosticAnswers([]);
    }

    const pendingTurnIn = consumePendingTurnIn(profile.studentId);
    if (pendingTurnIn) {
      // Refresh profile from storage so currentMission and skill stats reflect the completed task
      getOrInitTutorProfile(
        profile.studentId === "guest" ? undefined : profile.studentId,
        studentName
      ).then((refreshedProfile: StudentTutorProfile) => {
        onProfileUpdate(refreshedProfile);
      });

      // Avoid duplicate turn-in message if already appended
      const alreadyAppended = baseMessages.some(
        (m) => m.turnInReview && m.turnInReview.id === pendingTurnIn.id
      );

      if (!alreadyAppended) {
        const teacherAck = pendingTurnIn.teacherName
          ? ` (משימה מהמורה ${pendingTurnIn.teacherName})`
          : "";
        const turnInMsg: TutorMessage = {
          id: `msg-turnin-${Date.now()}`,
          sender: "tutor",
          text: `Well done ${studentName}! 🎉 כל הכבוד! קיבלת **${pendingTurnIn.score}/100** במשימה "${pendingTurnIn.taskTitleHebrew || pendingTurnIn.taskTitle}"${teacherAck}.\n\nבוא/י נעבור יחד על המשוב שלך, נבדוק **${pendingTurnIn.vocabToReview.length} מילים חשובות** מהמשימה (כל מילה שלא תכיר/י תישמר אוטומטית במילון האישי שלך! 📌), ואז נמשיך לתרגול הבא:`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          turnInReview: pendingTurnIn,
          quickReplies: ["תן לי משימה חדשה 🚀", "תרגל אוצר מילים 📚"],
        };
        baseMessages = [...baseMessages, turnInMsg];
        setTimeout(() => {
          speakText(
            `Well done ${studentName}! You scored ${pendingTurnIn.score} out of 100. Let's review your work and test your vocabulary!`
          );
        }, 400);
      }

      if (typeof window !== "undefined" && window.location.search.includes("turnIn=1")) {
        window.history.replaceState({}, "", "/tutor");
      }
      setMessages(baseMessages);
      saveTutorChat(baseMessages, profile.studentId);
      return;
    }

    setMessages(baseMessages);
    saveTutorChat(baseMessages, profile.studentId);

    // If diagnostic is completed and no turn-in is in progress, check for pending teacher assignments!
    if (profile.diagnosticCompleted) {
      getPendingTeacherAssignmentsForStudent(user, profile.level).then(
        (teacherMissions) => {
          if (!teacherMissions || teacherMissions.length === 0) return;
          const topMission = teacherMissions[0];
          setMessages((prev) => {
            const alreadyShown = prev.some(
              (m) =>
                m.taskRecommendation &&
                m.taskRecommendation.assignmentId === topMission.assignmentId
            );
            if (alreadyShown) return prev;

            const tName = topMission.teacherName || "שלך";
            const typeHeb =
              topMission.type === "unseen" ? "הבנת הנקרא (Unseen)" : "כתיבה (Writing)";
            const teacherMsg: TutorMessage = {
              id: `msg-teacher-assign-${topMission.assignmentId}`,
              sender: "tutor",
              text: `היי ${studentName}! 🎓 המורה **${tName}** שלח/ה לך משימת ${typeHeb} חדשה בליווי שלי!${
                topMission.teacherInstructions
                  ? `\n📌 **הנחיית המורה:** "${topMission.teacherInstructions}"`
                  : ""
              }\n\nאפשר לעשות איתי הכנה מהירה של מילות מפתח וטיפים לפני שמתחילים, או לצלול ישר למשימה:`,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              taskRecommendation: topMission,
              quickReplies: [
                "💡 הכנה מהירה עם דוד",
                "🎲 דוד, בחר עבורי",
              ],
            };
            const nextMsgs = [...prev, teacherMsg];
            saveTutorChat(nextMsgs, profile.studentId);
            return nextMsgs;
          });
        }
      );
    }
  }, [profile.studentId, profile.diagnosticCompleted, user?.id]);

  // Pre-teach vocabulary and strategy tips for a teacher assignment
  const handlePrepTeacherAssignment = (mission: TutorTaskRecommendation) => {
    const studentReqMsg: TutorMessage = {
      id: `msg-prep-req-${Date.now()}`,
      sender: "student",
      text: "💡 דוד, אשמח להכנה מהירה לפני שאני מתחיל את משימת המורה!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const prepText = generateTeacherAssignmentPrepMessage(mission, studentName);
    const tutorPrepMsg: TutorMessage = {
      id: `msg-prep-res-${Date.now() + 1}`,
      sender: "tutor",
      text: prepText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      taskRecommendation: {
        ...mission,
        needsTopicSelection: false,
      },
      quickReplies: ["התחל עכשיו 🚀", "החלף נושא"],
    };

    const updatedMsgs = [...messages, studentReqMsg, tutorPrepMsg];
    setMessages(updatedMsgs);
    saveTutorChat(updatedMsgs, profile.studentId);
    speakText(
      `Great idea ${studentName}! Let's review the key vocabulary words and my top tip before you start your teacher's assignment.`
    );
  };

  // Launch Step 3 (Next Practice Mission) after completing Step 2 (Vocabulary Test)
  const handleStartNextMissionAfterTurnIn = (completedType: "unseen" | "writing" | "vocab") => {
    const nextSkill: "unseen" | "writing" = completedType === "unseen" ? "writing" : "unseen";
    const nextMission = generateNextMission(profile, nextSkill);

    const updatedProf: StudentTutorProfile = {
      ...profile,
      currentMission: nextMission,
    };
    onProfileUpdate(updatedProf);
    saveTutorProfile(updatedProf);

    const missionTypeHebrew = nextMission.type === "unseen" ? "קריאה (Unseen)" : "כתיבה (Writing)";
    const nextMsg: TutorMessage = {
      id: `msg-next-${Date.now()}`,
      sender: "tutor",
      text: `Awesome work on your vocabulary check! Now let's move to your next practice: a **${missionTypeHebrew}** task. Pick a topic below that interests you, or click 'דוד, בחר עבורי':`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      taskRecommendation: nextMission,
      quickReplies: [
        "🎲 דוד, בחר עבורי",
        ...(nextMission.availableTopics?.slice(0, 3).map((t) => `${t.emoji} ${t.nameHebrew}`) || []),
      ],
    };

    const updatedMsgs = [...messages, nextMsg];
    setMessages(updatedMsgs);
    saveTutorChat(updatedMsgs, profile.studentId);
    speakText(`Awesome work! Now let's move to your next practice. Pick a topic you like, or let me choose for you.`);
  };

  // Preview Voice Sample
  const handlePlayVoicePreview = (opt: TutorVoiceOption) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      setPreviewingVoiceId(opt.id);

      const utterance = new SpeechSynthesisUtterance("Hello! I am David, your personal English tutor.");
      utterance.voice = opt.voice;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onend = () => setPreviewingVoiceId(null);
      utterance.onerror = () => setPreviewingVoiceId(null);

      window.speechSynthesis.speak(utterance);
    } catch {
      setPreviewingVoiceId(null);
    }
  };

  // Select Voice
  const handleSelectVoice = (opt: TutorVoiceOption) => {
    setSelectedVoiceURI(opt.id);
    selectedVoiceRef.current = opt.voice;
    if (typeof window !== "undefined") {
      localStorage.setItem(VOICE_STORAGE_KEY, opt.id);
    }
    setShowVoiceDialog(false);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Excellent! I will speak with this voice.");
      utterance.voice = opt.voice;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanEnglish = text
        .replace(/\([^)]*[\u0590-\u05FF][^)]*\)/g, "")
        .replace(/\*+/g, "")
        .trim();

      if (!cleanEnglish) return;

      const utterance = new SpeechSynthesisUtterance(cleanEnglish);
      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  // Speech to Text (Web Speech API)
  const toggleListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Student selects a topic for their assigned mission
  const handleSelectMissionTopic = (messageId: string, topicId: string | "default") => {
    const msgIdx = messages.findIndex((m) => m.id === messageId);
    if (msgIdx === -1 || !messages[msgIdx].taskRecommendation) return;

    const currentRec = messages[msgIdx].taskRecommendation!;
    let updatedRec = currentRec;

    if (topicId === "default") {
      const firstTopic = currentRec.availableTopics?.[0];
      if (firstTopic) {
        updatedRec = updateMissionTopic(currentRec, firstTopic.id);
        updatedRec.selectedTopicId = "default";
        updatedRec.selectedTopicNameHebrew = "בחירת דוד";
      }
    } else {
      updatedRec = updateMissionTopic(currentRec, topicId);
    }
    updatedRec.needsTopicSelection = false;

    const topicLabel =
      topicId === "default"
        ? `בחירת דוד (${updatedRec.hebrewTitle})`
        : updatedRec.selectedTopicNameHebrew || updatedRec.hebrewTitle;

    const feedbackVoice =
      topicId === "default"
        ? `Great, leave it to me! I've chosen ${updatedRec.title} for you. Let's start!`
        : `Awesome choice! We'll practice ${updatedRec.selectedTopicNameHebrew || ""}. You are all set!`;

    const confirmationMsg: TutorMessage = {
      id: `msg-${Date.now()}`,
      sender: "tutor",
      text: `מעולה! בחרנו בנושא: **${topicLabel}**. המשימה מוכנה עבורך למטה – אפשר להתחיל!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      quickReplies: ["בוא נתחיל עכשיו 🚀", "בחר נושא אחר"],
    };

    const newMsgs = [...messages];
    newMsgs[msgIdx] = {
      ...newMsgs[msgIdx],
      taskRecommendation: updatedRec,
    };
    const finalMsgs = [...newMsgs, confirmationMsg];
    setMessages(finalMsgs);
    saveTutorChat(finalMsgs, profile.studentId);

    const updatedProfile: StudentTutorProfile = {
      ...profile,
      currentMission: updatedRec,
    };
    onProfileUpdate(updatedProfile);
    saveTutorProfile(updatedProfile);

    speakText(feedbackVoice);
  };

  // Reopen topic selection if student wants to change topic
  const handleReopenTopicSelection = (messageId: string) => {
    const msgIdx = messages.findIndex((m) => m.id === messageId);
    if (msgIdx === -1 || !messages[msgIdx].taskRecommendation) return;

    const currentRec = messages[msgIdx].taskRecommendation!;
    const syncedRec = syncMissionWithDatabase(currentRec, profile.level) || currentRec;
    const updatedRec: TutorTaskRecommendation = {
      ...syncedRec,
      needsTopicSelection: true,
    };

    const newMsgs = [...messages];
    newMsgs[msgIdx] = {
      ...newMsgs[msgIdx],
      taskRecommendation: updatedRec,
    };
    setMessages(newMsgs);
    saveTutorChat(newMsgs, profile.studentId);
  };

  // Send student message to David
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    setInputText("");

    if (text.includes("הכנה מהירה עם דוד")) {
      const lastTeacherMission = [...messages]
        .reverse()
        .find((m) => m.taskRecommendation)?.taskRecommendation;
      if (lastTeacherMission) {
        handlePrepTeacherAssignment(lastTeacherMission);
        return;
      }
    }

    const userMsg: TutorMessage = {
      id: `msg-${Date.now()}`,
      sender: "student",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Natural 4-Turn Conversational English Assessment
    if (diagnosticIndex !== null) {
      const currentTurn = diagnosticIndex;
      const nextTurnData = generateOnboardingTurnResponse(currentTurn, text, studentName);

      // If student said "אני לא מבין", asked what a word means, or answered in Hebrew on turns 0-2:
      // Stay on the current turn, explain warmly in Hebrew + simple English, and let them try again!
      if (!nextTurnData.advanceTurn) {
        const nextAnswers: DiagnosticAnswer[] = [
          ...diagnosticAnswers,
          { questionIndex: currentTurn, selectedOption: text, neededHelp: true },
        ];
        setDiagnosticAnswers(nextAnswers);

        const tutorHelpMsg: TutorMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "tutor",
          text: nextTurnData.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          quickReplies: nextTurnData.quickReplies,
        };

        const updatedMsgs = [...messages, userMsg, tutorHelpMsg];
        setMessages(updatedMsgs);
        saveTutorChat(updatedMsgs, profile.studentId);
        return;
      }

      if (currentTurn < CONVERSATIONAL_ONBOARDING_TOTAL_TURNS - 1) {
        const nextAnswers: DiagnosticAnswer[] = [
          ...diagnosticAnswers,
          { questionIndex: currentTurn, selectedOption: text },
        ];
        setDiagnosticAnswers(nextAnswers);

        const tutorFollowUp: TutorMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "tutor",
          text: nextTurnData.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          quickReplies: nextTurnData.quickReplies,
        };

        const updatedMsgs = [...messages, userMsg, tutorFollowUp];
        setMessages(updatedMsgs);
        saveTutorChat(updatedMsgs, profile.studentId);
        setDiagnosticIndex(currentTurn + 1);
        speakText(nextTurnData.text);
        return;
      }

      // Final Turn (Turn 3): Evaluate the student's natural English conversation behind the scenes
      const historyWithStudentReply = [...messages, userMsg];
      setMessages(historyWithStudentReply);
      saveTutorChat(historyWithStudentReply, profile.studentId);
      setIsSending(true);

      let writingScore = 75;
      let vocabScore: number | undefined = undefined;
      let writingStrengths: string[] = [];
      let writingTips: string[] = [];

      const combinedEnglishSample = [
        ...diagnosticAnswers.filter((a) => !a.neededHelp).map((a) => a.selectedOption),
        text,
      ].join(" ");

      try {
        const res = await fetch("/api/evaluate-writing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            essayText: combinedEnglishSample,
            taskTitle: "Conversational English Onboarding",
            prompt:
              "Introduce your hobbies, respond to a short story about baking a salty cake, and describe a dream destination or cool gadget in English.",
            category: "opinion",
            minWords: 8,
            maxWords: 120,
            level: "Level 2",
          }),
        });

        if (res.ok) {
          const evalData = await res.json();
          if (typeof evalData.score === "number") {
            writingScore = evalData.score;
          }
          if (typeof evalData.rubric?.vocabulary === "number") {
            vocabScore = evalData.rubric.vocabulary;
          }
          if (Array.isArray(evalData.strengths) && evalData.strengths.length > 0) {
            writingStrengths = evalData.strengths;
          }
          if (Array.isArray(evalData.tips) && evalData.tips.length > 0) {
            writingTips = evalData.tips;
          }
        }
      } catch (e) {
        console.warn("Conversational onboarding evaluation notice:", e);
      } finally {
        setIsSending(false);
      }

      const finalAnswers: DiagnosticAnswer[] = [
        ...diagnosticAnswers,
        {
          questionIndex: currentTurn,
          selectedOption: text,
          writingScore,
          vocabScore,
          writingStrengths,
          writingTips,
        },
      ];

      setDiagnosticAnswers(finalAnswers);
      setDiagnosticIndex(null);

      const updatedProfile = calculateDiagnosticPlacement(finalAnswers, profile);
      onProfileUpdate(updatedProfile);
      saveTutorProfile(updatedProfile);

      const mission = updatedProfile.currentMission;
      const isUnseenOrWriting =
        mission && (mission.type === "unseen" || mission.type === "writing");

      const completionMessage: TutorMessage = {
        id: `msg-${Date.now() + 2}`,
        sender: "tutor",
        text: `Thank you for chatting with me, ${studentName}! 🎉 (תודה על השיחה הנעימה שלנו! כל הכבוד על ההשתתפות! 👏)\n\nבניתי עבורך תוכנית תרגול אישית ומותאמת בדיוק לקצב שלך ברמת **${updatedProfile.level} (${updatedProfile.vocabBand})**. ${
          isUnseenOrWriting
            ? "הנה התרגול הראשון שהכנתי עבורך – בחר/י נושא שמעניין אותך מהרשימה למטה, או לחצ/י על **'🎲 דוד, בחר עבורי'**:"
            : "הנה משימת הפתיחה הקלה שהכנתי עבורך – בוא/י נתחיל יחד!"
        }`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        taskRecommendation: updatedProfile.currentMission,
        quickReplies:
          isUnseenOrWriting && mission?.availableTopics
            ? [
                "🎲 דוד, בחר עבורי",
                ...mission.availableTopics.slice(0, 3).map((t) => `${t.emoji} ${t.nameHebrew}`),
              ]
            : ["בוא נתחיל את המשימה! 🚀", "🎲 דוד, בחר עבורי", "תסביר לי איך מתחילים"],
      };

      const updatedMsgs = [...historyWithStudentReply, completionMessage];
      setMessages(updatedMsgs);
      saveTutorChat(updatedMsgs, profile.studentId);
      speakText(
        `Thank you for chatting with me in English, ${studentName}! Based on our conversation, you are starting at ${updatedProfile.level}. Pick a topic you like for your first practice!`
      );
      return;
    }

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    saveTutorChat(newHistory, profile.studentId);
    setIsSending(true);

    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          messages: newHistory,
          profile,
          userMessage: text,
        }),
      });

      const data = await res.json();
      const tutorText = data?.message || "Great question! Let's practice together.";
      const quickReplies = data?.quickReplies || ["בוא נמשיך", "תן לי משימה"];

      let attachedMission = undefined;
      const lower = text.toLowerCase();
      const isCoachingOrHelpQuery =
        lower.includes("איך מתחילים") ||
        lower.includes("קשה לי") ||
        lower.includes("מפחד") ||
        lower.includes("פוחד") ||
        lower.includes("מה זה") ||
        lower.includes("מה אומר") ||
        lower.includes("איך אומרים");

      const isAskingForMission =
        lower.includes("mission") ||
        lower.includes("משימה") ||
        lower.includes("תרגול") ||
        lower.includes("task") ||
        lower.includes("unseen") ||
        lower.includes("reading") ||
        lower.includes("אנסין") ||
        lower.includes("קריאה") ||
        lower.includes("writing") ||
        lower.includes("essay") ||
        lower.includes("כתיבה") ||
        lower.includes("חיבור");

      let finalTutorText = tutorText;
      let finalQuickReplies = quickReplies;

      const isAutoPickTopicRequest =
        lower.includes("תבחר אתה") ||
        lower.includes("בחר עבורי") ||
        lower.includes("תבחר לי") ||
        lower.includes("משהו קל") ||
        lower.includes("לא יודע איזה נושא") ||
        lower.includes("לא יודעת איזה נושא") ||
        lower.includes("תמליץ לי") ||
        lower.includes("choose for me") ||
        lower.includes("תבחר בשבילי") ||
        lower.includes("סמוך עליך");

      if (isAutoPickTopicRequest && !lower.includes("קריאה") && !lower.includes("כתיבה")) {
        const baseMission = profile.currentMission || generateNextMission(profile, "unseen");
        if (baseMission.availableTopics && baseMission.availableTopics.length > 0) {
          const firstTopic = baseMission.availableTopics[0];
          attachedMission = updateMissionTopic(baseMission, firstTopic.id);
          attachedMission.selectedTopicId = "default";
          attachedMission.selectedTopicNameHebrew = "בחירת דוד";
          attachedMission.needsTopicSelection = false;
        } else {
          attachedMission = { ...baseMission, needsTopicSelection: false };
        }
        const updatedProf = { ...profile, currentMission: attachedMission };
        onProfileUpdate(updatedProf);
        saveTutorProfile(updatedProf);
      } else if (
        lower.includes("בחר נושא אחר") ||
        lower.includes("החלף נושא") ||
        lower.includes("נושא אחר") ||
        lower.includes("change topic")
      ) {
        if (profile.currentMission) {
          attachedMission = { ...profile.currentMission, needsTopicSelection: true };
          finalTutorText = `בשמחה! איזה נושא תרצה/י לתרגל במקום? בחר/י מהאפשרויות למטה:`;
          finalQuickReplies = [
            "🎲 דוד, בחר עבורי",
            ...(attachedMission.availableTopics?.slice(0, 3).map((t) => `${t.emoji} ${t.nameHebrew}`) || []),
          ];
          const updatedProf = { ...profile, currentMission: attachedMission };
          onProfileUpdate(updatedProf);
          saveTutorProfile(updatedProf);
        }
      } else if (isAskingForMission) {
        if (lower.includes("unseen") || lower.includes("reading") || lower.includes("אנסין") || lower.includes("קריאה")) {
          attachedMission = generateNextMission(profile, "unseen");
        } else if (lower.includes("writing") || lower.includes("essay") || lower.includes("כתיבה") || lower.includes("חיבור")) {
          attachedMission = generateNextMission(profile, "writing");
        } else if (lower.includes("vocab") || lower.includes("words") || lower.includes("מילים") || lower.includes("אוצר")) {
          attachedMission = generateNextMission(profile, "vocab");
        } else {
          attachedMission = generateNextMission(profile);
        }

        if (attachedMission.needsTopicSelection && !isCoachingOrHelpQuery) {
          finalQuickReplies = [
            "🎲 דוד, בחר עבורי",
            ...(attachedMission.availableTopics?.slice(0, 3).map((t) => `${t.emoji} ${t.nameHebrew}`) || []),
          ];
        }

        const updatedProf = { ...profile, currentMission: attachedMission };
        onProfileUpdate(updatedProf);
        saveTutorProfile(updatedProf);
      } else {
        // Check if student responded to a pending topic choice:
        const candidateMission = profile.currentMission;
        if (candidateMission && candidateMission.needsTopicSelection && candidateMission.availableTopics) {
          const matchedTopic = candidateMission.availableTopics.find(
            (t) =>
              lower.includes(t.nameHebrew.toLowerCase()) ||
              lower.includes(t.nameEnglish.toLowerCase()) ||
              lower.includes(t.id.toLowerCase())
          );
          if (matchedTopic) {
            attachedMission = updateMissionTopic(candidateMission, matchedTopic.id);
            attachedMission.needsTopicSelection = false;
            finalTutorText = `בחירה מצוינת! הכנתי עבורך את המשימה בנושא "${matchedTopic.nameHebrew}". אפשר להתחיל עכשיו!`;
            finalQuickReplies = ["התחל עכשיו 🚀", "החלף נושא", "בוא נתרגל אוצר מילים"];
            const updatedProf = { ...profile, currentMission: attachedMission };
            onProfileUpdate(updatedProf);
            saveTutorProfile(updatedProf);
          }
        }
      }

      const tutorMsg: TutorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "tutor",
        text: finalTutorText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies: finalQuickReplies,
        taskRecommendation: attachedMission,
      };

      const finalHistory = [...newHistory, tutorMsg];
      setMessages(finalHistory);
      saveTutorChat(finalHistory, profile.studentId);
      speakText(finalTutorText);
    } catch {
      const errorMsg: TutorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "tutor",
        text: "I'm with you! Keep practicing on the site tools, and let me know whenever you need guidance. (אני כאן איתך! בחר באחד הכלים באתר כדי להמשיך לתרגל)",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies: ["פתח משימה מומלצת", "בוא נתרגל אוצר מילים"],
      };
      setMessages([...newHistory, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Reset Conversational Onboarding
  const handleRestartDiagnostic = () => {
    const onboarding = getInitialOnboardingGreeting(studentName);
    setDiagnosticIndex(0);
    setDiagnosticAnswers([]);
    const resetGreeting: TutorMessage = {
      id: `msg-${Date.now()}`,
      sender: "tutor",
      text: onboarding.text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      quickReplies: onboarding.quickReplies,
    };
    setMessages([resetGreeting]);
    saveTutorChat([resetGreeting], profile.studentId);
    speakText(onboarding.text);
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-125px)] min-h-[580px] max-h-[820px] border border-border/60 bg-card/90 shadow-sm overflow-hidden font-sans rounded-2xl" dir="rtl">
      {/* Sleek Minimalist Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 text-white shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="absolute bottom-0 left-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" title="דוד מחובר וזמין" />
          </div>

          <div className="text-right">
            <div className="font-bold text-base text-foreground flex items-center gap-1.5">
              <span>David (דוד)</span>
            </div>
            <div className="text-xs text-muted-foreground">
              המורה הפרטי שלך לאנגלית
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Level & Streak Pill - Click to open Progress Drawer */}
          {onOpenStats && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenStats}
              className="h-8 px-2.5 rounded-full text-xs font-semibold bg-muted/40 border-border/60 hover:bg-primary/10 hover:border-primary/40 gap-1.5 cursor-pointer transition-all"
              title="ההתקדמות והמיומנויות שלי"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{profile.level}</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                <Flame className="h-3.5 w-3.5 fill-amber-500" />
                {profile.streakDays}
              </span>
            </Button>
          )}

          {/* Quick Sound Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`h-8 w-8 rounded-full cursor-pointer transition-colors ${
              speechEnabled ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-muted"
            }`}
            title={speechEnabled ? "השתק הקראה קולית" : "הפעל הקראה קולית (Google Natural UK)"}
          >
            {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          {/* Options Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="אפשרויות נוספות"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showMenu && (
              <div className="absolute left-0 top-full mt-1.5 w-52 rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-lg z-50 p-1 text-right font-sans text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                {onOpenStats && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onOpenStats();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer text-right"
                  >
                    <Award className="h-4 w-4 text-primary shrink-0" />
                    <span>לוח התקדמות ומיומנויות</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowVoiceDialog(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer text-right"
                >
                  <Settings2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>בחירת קול ומבטא</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    handleRestartDiagnostic();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors cursor-pointer text-right"
                >
                  <RotateCcw className="h-4 w-4 shrink-0" />
                  <span>ביצוע מבדק רמה מחדש</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Selection Modal Dialog (Opens only when student explicitly requests it) */}
      <Dialog open={showVoiceDialog} onOpenChange={setShowVoiceDialog}>
        <DialogContent className="sm:max-w-md font-sans" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Volume2 className="h-5 w-5 text-primary" />
              בחירת קול ומבטא של דוד
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground text-right -mt-1">
            דוד משתמש כברירת מחדל בקול Google Natural בריטי איכותי. באפשרותך לבחור קול אחר:
          </p>
          <div className="space-y-2 max-h-72 overflow-y-auto pt-2">
            {availableVoices.map((v) => {
              const isSelected = selectedVoiceURI === v.id;
              return (
                <div
                  key={v.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs"
                      : "border-border/60 bg-card hover:border-border"
                  }`}
                >
                  <div className="flex flex-col text-right">
                    <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                      {v.titleHebrew}
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{v.subtitle}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePlayVoicePreview(v)}
                      className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                    >
                      <Play className={`h-3 w-3 ${previewingVoiceId === v.id ? "text-primary animate-pulse" : ""}`} />
                      <span>השמע</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleSelectVoice(v)}
                      className="h-7 px-2.5 text-[11px] font-bold cursor-pointer"
                    >
                      {isSelected ? "נבחר" : "בחר"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Messages Transcript */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "student" ? "items-end" : "items-start"}`}
          >
            <div
              className={`flex items-start gap-3 max-w-[90%] sm:max-w-[82%] ${
                msg.sender === "student" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-8 w-8 rounded-xl items-center justify-center text-xs shrink-0 mt-1 shadow-xs ${
                  msg.sender === "student"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 text-white"
                }`}
              >
                {msg.sender === "student" ? <User className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
              </div>

              <div
                className={`rounded-2xl px-5 py-3.5 text-base sm:text-lg shadow-xs leading-relaxed font-sans ${
                  msg.sender === "student"
                    ? "bg-primary text-primary-foreground rounded-tl-xs"
                    : "bg-muted/60 text-foreground border border-border/40 rounded-tr-xs"
                }`}
              >
                <p className="whitespace-pre-line text-right font-sans" dir="auto">{msg.text}</p>
                <span
                  className={`block text-[11px] mt-1.5 text-right ${
                    msg.sender === "student" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>

            {/* Post-Task 3-Step Review & 5-8 Word Vocabulary Test Card */}
            {msg.turnInReview && (
              <TurnInLessonFlowCard
                turnIn={msg.turnInReview}
                studentId={profile.studentId}
                onSpeak={speakText}
                onStartNextMission={() =>
                  handleStartNextMissionAfterTurnIn(msg.turnInReview!.type)
                }
              />
            )}

            {/* Attached Actionable Task Card */}
            {msg.taskRecommendation && (
              <div className="mt-2.5 mr-11 max-w-[92%] sm:max-w-[85%] text-right font-sans">
                <Card
                  className={`border-2 p-4 sm:p-5 rounded-2xl shadow-sm text-right space-y-3 ${
                    msg.taskRecommendation.assignmentId
                      ? "border-purple-500/50 bg-purple-500/5 dark:bg-purple-500/10"
                      : "border-primary/40 bg-card"
                  }`}
                >
                  {/* Teacher Mission Banner when assigned by a teacher */}
                  {msg.taskRecommendation.assignmentId && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-purple-500/20">
                      <Badge className="bg-purple-600 hover:bg-purple-600 text-white text-xs font-bold gap-1.5 px-2.5 py-0.5">
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>
                          משימה מהמורה {msg.taskRecommendation.teacherName || ""}
                        </span>
                      </Badge>
                      {msg.taskRecommendation.dueDate && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full">
                          <Calendar className="h-3 w-3" />
                          <span>הגשה עד: {msg.taskRecommendation.dueDate}</span>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary">
                      {msg.taskRecommendation.type === "unseen" && <BookOpen className="h-4 w-4" />}
                      {msg.taskRecommendation.type === "vocab" && <BookA className="h-4 w-4" />}
                      {msg.taskRecommendation.type === "writing" && <PenTool className="h-4 w-4" />}
                      {msg.taskRecommendation.needsTopicSelection
                        ? "שלב 1: בחירת נושא לתרגול"
                        : msg.taskRecommendation.assignmentId
                        ? "משימת כיתה בליווי דוד"
                        : "משימה מותאמת עבורך"}
                    </span>
                    <Badge variant="outline" className="text-xs py-0.5 px-2 bg-muted/40 border-border/70">
                      {msg.taskRecommendation.level}
                    </Badge>
                  </div>

                  {msg.taskRecommendation.needsTopicSelection ? (
                    /* Topic Selection Stage */
                    <div className="space-y-3 pt-1">
                      <div>
                        <h4 className="font-bold text-base sm:text-lg text-foreground font-sans">
                          {msg.taskRecommendation.type === "unseen"
                            ? "באיזה נושא תרצה/י לקרוא?"
                            : "באיזה נושא תרצה/י לכתוב?"}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          בחר/י נושא שמעניין אותך מתוך האפשרויות, או תן/י לדוד לבחור עבורך את ההמלצה הטובה ביותר:
                        </p>
                      </div>

                      {/* David Pick For Me prominent card */}
                      <button
                        type="button"
                        onClick={() => handleSelectMissionTopic(msg.id, "default")}
                        className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-primary/50 bg-primary/10 hover:bg-primary/20 text-foreground transition-all cursor-pointer font-sans text-right group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl group-hover:scale-110 transition-transform">🎲</span>
                          <div className="flex flex-col text-right">
                            <span className="font-bold text-sm text-foreground">דוד, בחר עבורי</span>
                            <span className="text-xs text-muted-foreground">התאמה אוטומטית של המשימה המומלצת ביותר לרמה שלך</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs font-semibold bg-primary/20 text-primary">
                          מומלץ
                        </Badge>
                      </button>

                      {/* Topic Choices Grid */}
                      {msg.taskRecommendation.availableTopics && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-xs font-semibold text-muted-foreground block text-right">
                            או בחרו נושא מהרשימה:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.taskRecommendation.availableTopics.map((top) => (
                              <button
                                key={top.id}
                                type="button"
                                onClick={() => handleSelectMissionTopic(msg.id, top.id)}
                                className="flex items-center gap-2.5 p-3 rounded-xl border border-border/70 bg-muted/20 hover:border-primary/60 hover:bg-muted/50 transition-all cursor-pointer text-right group"
                              >
                                <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{top.emoji}</span>
                                <div className="flex flex-col text-right overflow-hidden">
                                  <span className="font-bold text-xs sm:text-sm text-foreground truncate">{top.nameHebrew}</span>
                                  <span className="text-[11px] text-muted-foreground truncate">{top.nameEnglish}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pre-task coaching button even during topic selection for teacher assignments */}
                      {msg.taskRecommendation.assignmentId && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrepTeacherAssignment(msg.taskRecommendation!)}
                          className="w-full gap-2 font-bold text-xs sm:text-sm border-purple-500/40 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 cursor-pointer h-9"
                        >
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          <span>💡 הכנה מהירה עם דוד (מילים וטיפים לפני שמתחילים)</span>
                        </Button>
                      )}
                    </div>
                  ) : (
                    /* Topic Confirmed - Ready to Launch */
                    <div className="space-y-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h4 className="font-bold text-base sm:text-lg text-foreground font-sans">
                            {msg.taskRecommendation.hebrewTitle}
                          </h4>
                          {msg.taskRecommendation.selectedTopicNameHebrew && (
                            <Badge variant="secondary" className="text-[11px] font-semibold px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                              נושא: {msg.taskRecommendation.selectedTopicNameHebrew}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                          {msg.taskRecommendation.descriptionHebrew}
                        </p>
                      </div>

                      {/* Pre-task Coaching Button for Teacher Assignments */}
                      {msg.taskRecommendation.assignmentId && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrepTeacherAssignment(msg.taskRecommendation!)}
                          className="w-full gap-2 font-bold text-xs sm:text-sm border-purple-500/40 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 cursor-pointer h-9"
                        >
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          <span>💡 הכנה מהירה עם דוד (מילים וטיפים לפני שמתחילים)</span>
                        </Button>
                      )}

                      {/* Ready Action Button */}
                      <Link href={msg.taskRecommendation.targetUrl} className="block w-full pt-1">
                        <Button
                          size="sm"
                          className={`w-full gap-2 font-bold h-10 text-sm sm:text-base cursor-pointer shadow-xs ${
                            msg.taskRecommendation.assignmentId
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : ""
                          }`}
                        >
                          <span>
                            {msg.taskRecommendation.assignmentId
                              ? "התחל במשימת המורה עכשיו 🚀"
                              : "התחל משימה עכשיו 🚀"}
                          </span>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      </Link>

                      {/* Change Topic Link if topics exist */}
                      {msg.taskRecommendation.availableTopics && msg.taskRecommendation.availableTopics.length > 0 && (
                        <div className="text-center pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleReopenTopicSelection(msg.id)}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>רוצה להחליף נושא? לחץ/י כאן</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isSending && (
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground mr-11">
            <div className="flex h-8 w-8 rounded-xl items-center justify-center bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 text-white shrink-0 shadow-xs">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="bg-muted/60 px-4 py-2.5 rounded-2xl border border-border/40 flex items-center gap-2 text-sm">
              <span className="animate-pulse">
                {diagnosticIndex !== null ? "David is typing..." : "דוד מקליד תשובה..."}
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Replies Tray */}
      {messages.length > 0 && messages[messages.length - 1].quickReplies && !isSending && (
        <div
          className="px-4 sm:px-5 py-2 border-t border-border/20 bg-muted/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar font-sans"
          dir={diagnosticIndex !== null ? "ltr" : "rtl"}
        >
          <span className="text-xs text-muted-foreground shrink-0">
            {diagnosticIndex !== null ? "Ideas:" : "הצעות:"}
          </span>
          {messages[messages.length - 1].quickReplies?.map((reply, rIdx) => (
            <button
              key={rIdx}
              onClick={() => handleSendMessage(reply)}
              className="text-xs sm:text-sm bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-border/50 text-foreground px-3 py-1 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer font-sans"
              dir="auto"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Simple Clean Input Bar */}
      <div className="p-3 sm:p-3.5 border-t border-border/40 bg-background flex items-center gap-2" dir="rtl">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            diagnosticIndex !== null
              ? "Write your reply in English (or click the mic 🎤 to speak)..."
              : "כתבו הודעה או שאלה לדוד (באנגלית או בעברית)..."
          }
          className={`flex-1 text-sm sm:text-base h-11 rounded-xl bg-muted/30 font-sans border-border/60 ${
            diagnosticIndex !== null ? "text-left" : "text-right"
          }`}
          dir={diagnosticIndex !== null ? "ltr" : "auto"}
          disabled={isSending}
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleListening}
          className={`h-11 w-11 shrink-0 rounded-xl transition-colors cursor-pointer ${
            isListening
              ? "bg-rose-500 text-white border-rose-500 animate-pulse"
              : "text-muted-foreground hover:text-foreground border-border/60"
          }`}
          title={isListening ? "עצור הקלטה" : "דבר באנגלית עם דוד (Voice)"}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <Button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isSending}
          size="icon"
          className="h-11 w-11 shrink-0 rounded-xl shadow-xs cursor-pointer"
          title="שלח הודעה לדוד"
        >
          <Send className="h-5 w-5 rotate-180" />
        </Button>
      </div>
    </Card>
  );
}
