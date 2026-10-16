"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TutorMessage, StudentTutorProfile } from "@/types/tutor";
import {
  DIAGNOSTIC_STEPS,
  calculateDiagnosticPlacement,
  saveTutorProfile,
  generateNextMission,
  loadTutorChat,
  saveTutorChat,
} from "@/lib/tutor-engine";
import { getCuratedTutorVoices, TutorVoiceOption } from "@/lib/tutor-voice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Clock,
  CheckCircle2,
  GraduationCap,
  Play,
  Settings2,
  Check,
} from "lucide-react";

interface TutorChatBoxProps {
  profile: StudentTutorProfile;
  onProfileUpdate: (newProfile: StudentTutorProfile) => void;
  studentName: string;
}

const VOICE_STORAGE_KEY = "ett_tutor_selected_voice";

export function TutorChatBox({
  profile,
  onProfileUpdate,
  studentName,
}: TutorChatBoxProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);

  // Voice Selection State
  const [availableVoices, setAvailableVoices] = useState<TutorVoiceOption[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const [isFirstVoiceInteraction, setIsFirstVoiceInteraction] = useState(false);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  // Diagnostic state inside chat
  const [diagnosticIndex, setDiagnosticIndex] = useState<number | null>(
    profile.diagnosticCompleted ? null : 0
  );
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<
    { questionIndex: number; selectedOption: string }[]
  >([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Load and Curate Voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const populateVoices = () => {
      const curated = getCuratedTutorVoices();
      if (curated.length > 0) {
        setAvailableVoices(curated);

        const savedURI = localStorage.getItem(VOICE_STORAGE_KEY);
        if (savedURI && curated.some((c) => c.id === savedURI)) {
          setSelectedVoiceURI(savedURI);
          const found = curated.find((c) => c.id === savedURI);
          if (found) selectedVoiceRef.current = found.voice;
          setIsFirstVoiceInteraction(false);
        } else {
          // First interaction: Ask the student to choose their voice!
          setSelectedVoiceURI(curated[0].id);
          selectedVoiceRef.current = curated[0].voice;
          setIsFirstVoiceInteraction(true);
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

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, diagnosticIndex, isFirstVoiceInteraction]);

  // Load chat history or create greeting
  useEffect(() => {
    const saved = loadTutorChat(profile.studentId);
    if (saved && saved.length > 0) {
      setMessages(saved);
    } else {
      // Initial Welcome Message
      const initialGreeting: TutorMessage = {
        id: `msg-${Date.now()}`,
        sender: "tutor",
        text: profile.diagnosticCompleted
          ? `Hello ${studentName}! I'm David, your English tutor. We are currently working on ${profile.level} (${profile.vocabBand}). What would you like to practice today?`
          : `Hello ${studentName}! I'm David, your personal English tutor. I'm excited to help you succeed in English! First, choose the voice you'd like me to speak in, and then let's do a quick 4-question check to tailor your learning plan. Ready?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies: profile.diagnosticCompleted
          ? ["תן לי משימת קריאה (Unseen)", "תרגל אוצר מילים", "בוא נכתוב חיבור"]
          : ["בוא נתחיל!", "ספר לי עוד על דוד"],
      };

      setMessages([initialGreeting]);
      saveTutorChat([initialGreeting], profile.studentId);
    }
  }, [profile.studentId, profile.diagnosticCompleted]);

  // Preview Voice Sample
  const handlePlayVoicePreview = (opt: TutorVoiceOption) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      setPreviewingVoiceId(opt.id);

      const utterance = new SpeechSynthesisUtterance("Hello! I am David, your personal English tutor.");
      utterance.voice = opt.voice;
      utterance.rate = 0.95;
      utterance.pitch = 1.05; // Lively, natural, warm

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
    setIsFirstVoiceInteraction(false);
    setShowVoiceDialog(false);

    // Warm confirmation in the new voice
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Excellent! I will speak with this voice. Let's do great things together!");
      utterance.voice = opt.voice;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Text to Speech with Natural Prosody
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Remove Hebrew in parentheses (בעברית) and markdown formatting
      const cleanEnglish = text
        .replace(/\([^)]*[\u0590-\u05FF][^)]*\)/g, "")
        .replace(/\*+/g, "")
        .trim();

      if (!cleanEnglish) return;

      const utterance = new SpeechSynthesisUtterance(cleanEnglish);
      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
      }
      utterance.rate = 0.95; // Natural ESL cadence
      utterance.pitch = 1.05; // Friendly, warm, non-robotic
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

  // Handle Diagnostic Option Click
  const handleDiagnosticOptionSelect = (optionValue: string) => {
    if (diagnosticIndex === null) return;

    const currentStep = DIAGNOSTIC_STEPS[diagnosticIndex];
    const newAnswers = [
      ...diagnosticAnswers,
      { questionIndex: diagnosticIndex, selectedOption: optionValue },
    ];
    setDiagnosticAnswers(newAnswers);

    // Add student's response message to chat
    const chosenOpt = currentStep.options.find((o) => o.value === optionValue);
    const studentReply: TutorMessage = {
      id: `msg-${Date.now()}`,
      sender: "student",
      text: chosenOpt?.text || optionValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (diagnosticIndex < DIAGNOSTIC_STEPS.length - 1) {
      // Proceed to next question
      const nextIdx = diagnosticIndex + 1;
      setDiagnosticIndex(nextIdx);

      const nextStep = DIAGNOSTIC_STEPS[nextIdx];
      const tutorFollowUp: TutorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "tutor",
        text: `Great choice! Here is question ${nextIdx + 1} of ${DIAGNOSTIC_STEPS.length}:`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updatedMsgs = [...messages, studentReply, tutorFollowUp];
      setMessages(updatedMsgs);
      saveTutorChat(updatedMsgs, profile.studentId);
    } else {
      // Diagnostic complete! Calculate placement
      setDiagnosticIndex(null);
      const updatedProfile = calculateDiagnosticPlacement(newAnswers, profile);
      onProfileUpdate(updatedProfile);
      saveTutorProfile(updatedProfile);

      const completionMessage: TutorMessage = {
        id: `msg-${Date.now() + 2}`,
        sender: "tutor",
        text: `Excellent job ${studentName}! I have calibrated your learning plan. You are starting at **${updatedProfile.level}** (${updatedProfile.vocabBand}). I've picked a tailored mission for you to start right now!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        taskRecommendation: updatedProfile.currentMission,
        quickReplies: ["בוא נתחיל את המשימה!", "איך מתקדמים לרמה 3?", "שאל אותי שאלה נוספת"],
      };

      const updatedMsgs = [...messages, studentReply, completionMessage];
      setMessages(updatedMsgs);
      saveTutorChat(updatedMsgs, profile.studentId);
      speakText(completionMessage.text);
    }
  };

  // Send student message to David
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    setInputText("");

    const userMsg: TutorMessage = {
      id: `msg-${Date.now()}`,
      sender: "student",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

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

      // Check if user asked for a new mission
      let attachedMission = undefined;
      if (
        text.toLowerCase().includes("mission") ||
        text.toLowerCase().includes("משימה") ||
        text.toLowerCase().includes("תרגול") ||
        text.toLowerCase().includes("task")
      ) {
        attachedMission = profile.currentMission || generateNextMission(profile);
      }

      const tutorMsg: TutorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "tutor",
        text: tutorText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies,
        taskRecommendation: attachedMission,
      };

      const finalHistory = [...newHistory, tutorMsg];
      setMessages(finalHistory);
      saveTutorChat(finalHistory, profile.studentId);
      speakText(tutorText);
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

  // Reset chat / Diagnostic
  const handleRestartDiagnostic = () => {
    setDiagnosticIndex(0);
    setDiagnosticAnswers([]);
    const resetGreeting: TutorMessage = {
      id: `msg-${Date.now()}`,
      sender: "tutor",
      text: `No problem, ${studentName}! Let's re-calibrate your level with our 4-question check. Let's start with question 1!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([resetGreeting]);
    saveTutorChat([resetGreeting], profile.studentId);
  };

  return (
    <Card className="flex flex-col h-[650px] sm:h-[720px] border border-border/60 bg-card/60 backdrop-blur-xs shadow-xs overflow-hidden font-sans" dir="rtl">
      {/* Tutor Chat Header */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-border/40 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 text-white shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="absolute bottom-0 left-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>

          <div className="text-right">
            <div className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
              David (דוד)
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                AI Private Tutor
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span>מורה פרטי אישי לאנגלית</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">קול טבעי פעיל</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Voice Selector Settings Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVoiceDialog(!showVoiceDialog)}
            className="h-8 px-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer gap-1"
            title="בחירת קול ומבטא של דוד"
          >
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">הגדרת קול</span>
          </Button>

          {/* Voice Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`h-8 w-8 rounded-lg cursor-pointer ${speechEnabled ? "text-primary" : "text-muted-foreground"}`}
            title={speechEnabled ? "השתק הקראה קולית" : "הפעל הקראה קולית באנגלית"}
          >
            {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          {/* Restart Diagnostic */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRestartDiagnostic}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            title="בצע מבדק אבחון מחדש"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Voice Customization Dialog Bar */}
      {showVoiceDialog && (
        <div className="p-3 bg-muted/70 border-b border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Volume2 className="h-4 w-4 text-primary" />
              בחרו את הקול והמבטא המועדף עליכם של דוד (Natural AI Voices):
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVoiceDialog(false)}
              className="h-6 px-2 text-[11px]"
            >
              סגור
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableVoices.map((v) => {
              const isSelected = selectedVoiceURI === v.id;
              return (
                <div
                  key={v.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs"
                      : "border-border/60 bg-card hover:border-border"
                  }`}
                >
                  <div className="flex flex-col text-right">
                    <span className="font-bold text-foreground text-sm flex items-center gap-1">
                      {v.titleHebrew}
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{v.subtitle}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePlayVoicePreview(v)}
                      className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                      title="השמע דוגמה"
                    >
                      <Play className={`h-3 w-3 ${previewingVoiceId === v.id ? "text-primary animate-pulse" : ""}`} />
                      <span>דוגמה</span>
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
        </div>
      )}

      {/* Messages Transcript */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* First Interaction: Voice Selection Card */}
        {isFirstVoiceInteraction && availableVoices.length > 0 && (
          <div className="mr-9 max-w-[95%] sm:max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-2 border-primary/50 bg-card p-4 sm:p-5 rounded-2xl shadow-md space-y-3">
              <div className="space-y-1 text-right">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  צעד ראשון: בחירת קול המורה דוד (Voice Selection)
                </span>
                <h4 className="font-bold text-base sm:text-lg text-foreground">
                  איזה קול של דוד נשמע לך הכי נעים ללמידה?
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  האזינו לדוגמה קצרה ובחרו את הקול והמבטא (אמריקאי או בריטי) שילווה אתכם בתרגול.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {availableVoices.slice(0, 4).map((v) => {
                  const isSelected = selectedVoiceURI === v.id;
                  return (
                    <div
                      key={v.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border/70 bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex flex-col text-right">
                        <span className="font-bold text-sm sm:text-base text-foreground flex items-center gap-1">
                          {v.titleHebrew}
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </span>
                        <span className="text-xs text-muted-foreground">{v.subtitle}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePlayVoicePreview(v)}
                          className="h-8 px-2 text-xs gap-1 cursor-pointer"
                        >
                          <Play className={`h-3.5 w-3.5 ${previewingVoiceId === v.id ? "text-primary animate-pulse" : ""}`} />
                          <span>השמע</span>
                        </Button>
                        <Button
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => handleSelectVoice(v)}
                          className="h-8 px-3 text-xs font-bold cursor-pointer"
                        >
                          {isSelected ? "נבחר" : "בחר"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "student" ? "items-end" : "items-start"}`}
          >
            <div
              className={`flex items-start gap-3 max-w-[88%] sm:max-w-[80%] ${
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
                    : "bg-muted/70 text-foreground border border-border/40 rounded-tr-xs"
                }`}
              >
                <p className="whitespace-pre-line text-right font-sans" dir="auto">{msg.text}</p>
                <span
                  className={`block text-xs mt-2 text-right ${
                    msg.sender === "student" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>

            {/* Attached Actionable Task Card */}
            {msg.taskRecommendation && (
              <div className="mt-2.5 mr-11 max-w-[88%] sm:max-w-[78%] text-right">
                <Card className="border-2 border-primary/40 bg-primary/5 p-4 rounded-xl shadow-xs text-right">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-primary">
                      {msg.taskRecommendation.type === "unseen" && <BookOpen className="h-4 w-4" />}
                      {msg.taskRecommendation.type === "vocab" && <BookA className="h-4 w-4" />}
                      {msg.taskRecommendation.type === "writing" && <PenTool className="h-4 w-4" />}
                      משימה מותאמת עבורך
                    </span>
                    <Badge variant="outline" className="text-xs py-0.5 px-2 bg-background">
                      {msg.taskRecommendation.level}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-base sm:text-lg text-foreground mb-1 font-sans">
                    {msg.taskRecommendation.hebrewTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed font-sans">
                    {msg.taskRecommendation.descriptionHebrew}
                  </p>

                  <Link href={msg.taskRecommendation.targetUrl} className="block w-full">
                    <Button size="sm" className="w-full gap-2 font-bold h-9 text-sm cursor-pointer">
                      <span>התחל משימה עכשיו</span>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </div>
            )}
          </div>
        ))}

        {/* Diagnostic Question Interactive Widget */}
        {diagnosticIndex !== null && DIAGNOSTIC_STEPS[diagnosticIndex] && (
          <div className="mr-11 max-w-[92%] sm:max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 text-right">
            <Card className="border-2 border-primary/40 bg-card p-4 sm:p-5 rounded-2xl shadow-sm space-y-3.5">
              <div className="flex items-center justify-between text-sm text-primary font-bold">
                <span className="flex items-center gap-1.5 font-sans">
                  <Sparkles className="h-4 w-4" />
                  מבדק התאמה אישי מדוד (שאלה {diagnosticIndex + 1} מתוך {DIAGNOSTIC_STEPS.length})
                </span>
                <span className="text-muted-foreground text-xs" dir="ltr">
                  {Math.round(((diagnosticIndex + 1) / DIAGNOSTIC_STEPS.length) * 100)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${((diagnosticIndex + 1) / DIAGNOSTIC_STEPS.length) * 100}%` }}
                />
              </div>

              {DIAGNOSTIC_STEPS[diagnosticIndex].passage && (
                <div className="p-3.5 bg-muted/60 rounded-xl text-sm sm:text-base font-serif italic text-foreground border border-border/40 text-left" dir="ltr">
                  {DIAGNOSTIC_STEPS[diagnosticIndex].passage}
                </div>
              )}

              <div className="space-y-1.5 text-right font-sans">
                <div className="text-sm sm:text-base font-semibold text-foreground whitespace-pre-line text-left leading-relaxed font-sans" dir="ltr">
                  {DIAGNOSTIC_STEPS[diagnosticIndex].question}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground text-right font-hebrew" dir="rtl">
                  {DIAGNOSTIC_STEPS[diagnosticIndex].questionHebrew}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1" dir="rtl">
                {DIAGNOSTIC_STEPS[diagnosticIndex].options.map((opt, oIdx) => (
                  <Button
                    key={oIdx}
                    variant="outline"
                    onClick={() => handleDiagnosticOptionSelect(opt.value)}
                    className="justify-start text-right h-auto py-3 px-3.5 border-border/70 hover:border-primary hover:bg-primary/5 transition-all text-sm sm:text-base flex flex-col items-start gap-1 whitespace-normal cursor-pointer"
                  >
                    <span className="font-semibold text-foreground text-left font-sans text-sm sm:text-base" dir="ltr">{opt.text}</span>
                    {opt.textHebrew && (
                      <span className="text-xs text-muted-foreground text-right font-hebrew" dir="rtl">{opt.textHebrew}</span>
                    )}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Loading Indicator */}
        {isSending && (
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground mr-11">
            <div className="flex h-8 w-8 rounded-xl items-center justify-center bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 text-white shrink-0 shadow-xs">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="bg-muted/60 px-4 py-2.5 rounded-2xl border border-border/40 flex items-center gap-2 text-sm">
              <span className="animate-pulse">דוד מקליד תשובה...</span>
              <span className="inline-block h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <span className="inline-block h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <span className="inline-block h-2 w-2 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Replies Tray */}
      {messages.length > 0 && messages[messages.length - 1].quickReplies && !isSending && (
        <div className="px-4 sm:px-5 py-2.5 border-t border-border/30 bg-muted/10 flex items-center gap-2 overflow-x-auto no-scrollbar font-sans" dir="rtl">
          <span className="text-xs text-muted-foreground shrink-0 font-medium">הצעות מהירות:</span>
          {messages[messages.length - 1].quickReplies?.map((reply, rIdx) => (
            <button
              key={rIdx}
              onClick={() => handleSendMessage(reply)}
              className="text-xs sm:text-sm bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-border/50 text-foreground px-3 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer font-sans"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3.5 sm:p-4 border-t border-border/40 bg-background flex items-center gap-2.5" dir="rtl">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="כתבו הודעה או שאלה לדוד (אפשר באנגלית או בעברית)..."
          className="flex-1 text-sm sm:text-base h-11 rounded-xl bg-muted/40 text-right font-sans"
          dir="rtl"
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
              : "text-muted-foreground hover:text-foreground"
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
