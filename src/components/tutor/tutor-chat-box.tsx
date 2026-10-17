"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TutorMessage, StudentTutorProfile, TutorTaskRecommendation } from "@/types/tutor";
import {
  DIAGNOSTIC_STEPS,
  calculateDiagnosticPlacement,
  saveTutorProfile,
  generateNextMission,
  updateMissionTopic,
  loadTutorChat,
  saveTutorChat,
} from "@/lib/tutor-engine";
import { getCuratedTutorVoices, TutorVoiceOption } from "@/lib/tutor-voice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

interface TutorChatBoxProps {
  profile: StudentTutorProfile;
  onProfileUpdate: (newProfile: StudentTutorProfile) => void;
  studentName: string;
  onOpenStats?: () => void;
}

const VOICE_STORAGE_KEY = "ett_tutor_selected_voice";

export function TutorChatBox({
  profile,
  onProfileUpdate,
  studentName,
  onOpenStats,
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

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, diagnosticIndex]);

  // Load chat history or create clean initial greeting
  useEffect(() => {
    const saved = loadTutorChat(profile.studentId);
    if (saved && saved.length > 0) {
      setMessages(saved);
    } else {
      const initialGreeting: TutorMessage = {
        id: `msg-${Date.now()}`,
        sender: "tutor",
        text: profile.diagnosticCompleted
          ? `Hello ${studentName}! I'm David, your English tutor. We are currently working on ${profile.level} (${profile.vocabBand}). What would you like to practice today?`
          : `Hello ${studentName}! I'm David, your personal English tutor. I'm excited to help you succeed in English! Let's do a quick, friendly 4-question check so I can tailor the best reading, writing, and vocabulary tasks for you. Ready?`,
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

  // Handle Diagnostic Option Click
  const handleDiagnosticOptionSelect = (optionValue: string) => {
    if (diagnosticIndex === null) return;

    const currentStep = DIAGNOSTIC_STEPS[diagnosticIndex];
    const newAnswers = [
      ...diagnosticAnswers,
      { questionIndex: diagnosticIndex, selectedOption: optionValue },
    ];
    setDiagnosticAnswers(newAnswers);

    const chosenOpt = currentStep.options.find((o) => o.value === optionValue);
    const studentReply: TutorMessage = {
      id: `msg-${Date.now()}`,
      sender: "student",
      text: chosenOpt?.text || optionValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (diagnosticIndex < DIAGNOSTIC_STEPS.length - 1) {
      const nextIdx = diagnosticIndex + 1;
      setDiagnosticIndex(nextIdx);

      const tutorFollowUp: TutorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "tutor",
        text: `Great! Here is question ${nextIdx + 1} of ${DIAGNOSTIC_STEPS.length}:`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updatedMsgs = [...messages, studentReply, tutorFollowUp];
      setMessages(updatedMsgs);
      saveTutorChat(updatedMsgs, profile.studentId);
    } else {
      setDiagnosticIndex(null);
      const updatedProfile = calculateDiagnosticPlacement(newAnswers, profile);
      onProfileUpdate(updatedProfile);
      saveTutorProfile(updatedProfile);

      const mission = updatedProfile.currentMission;
      const isUnseenOrWriting = mission && (mission.type === "unseen" || mission.type === "writing");

      const completionMessage: TutorMessage = {
        id: `msg-${Date.now() + 2}`,
        sender: "tutor",
        text: `Excellent job ${studentName}! I have calibrated your learning plan. You are starting at **${updatedProfile.level}** (${updatedProfile.vocabBand}). ${
          isUnseenOrWriting
            ? "I prepared your first assignment! Please pick a topic you'd like to practice from the options below, or click 'דוד, בחר עבורי': (בחר/י נושא לתרגול שמעניין אותך, או לחצ/י 'דוד, בחר עבורי')"
            : "I've picked a tailored mission for you! You are ready to start."
        }`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        taskRecommendation: updatedProfile.currentMission,
        quickReplies: isUnseenOrWriting && mission?.availableTopics
          ? ["🎲 דוד, בחר עבורי", ...mission.availableTopics.slice(0, 3).map((t) => `${t.emoji} ${t.nameHebrew}`)]
          : ["בוא נתחיל את המשימה!", "דוד, בחר עבורי", "שאל אותי שאלה נוספת"],
      };

      const updatedMsgs = [...messages, studentReply, completionMessage];
      setMessages(updatedMsgs);
      saveTutorChat(updatedMsgs, profile.studentId);
      speakText(completionMessage.text);
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
    const updatedRec: TutorTaskRecommendation = {
      ...currentRec,
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

      let attachedMission = undefined;
      const lower = text.toLowerCase();
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

      if (
        lower.includes("תבחר אתה") ||
        lower.includes("בחר עבורי") ||
        lower.includes("choose for me") ||
        lower.includes("תבחר בשבילי") ||
        lower.includes("סמוך עליך")
      ) {
        const baseMission = profile.currentMission || generateNextMission(profile);
        if (baseMission.availableTopics && baseMission.availableTopics.length > 0) {
          const firstTopic = baseMission.availableTopics[0];
          attachedMission = updateMissionTopic(baseMission, firstTopic.id);
          attachedMission.selectedTopicId = "default";
          attachedMission.selectedTopicNameHebrew = "בחירת דוד";
          attachedMission.needsTopicSelection = false;
        } else {
          attachedMission = { ...baseMission, needsTopicSelection: false };
        }
        finalTutorText = `סמוך עליי! בחרתי עבורך את המשימה המומלצת ביותר: "${attachedMission.hebrewTitle}". אפשר להתחיל עכשיו!`;
        finalQuickReplies = ["התחל עכשיו 🚀", "החלף נושא", "בוא נתרגל אוצר מילים"];
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

        if (attachedMission.needsTopicSelection) {
          const missionTypeHebrew = attachedMission.type === "unseen" ? "קריאה (Unseen)" : "כתיבה";
          finalTutorText = `בחרתי עבורך משימת ${missionTypeHebrew}! באיזה נושא תרצה/י לתרגל? בחר/י נושא מתוך האפשרויות למטה, או לחצ/י 'דוד, בחר עבורי':`;
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

  // Reset Diagnostic Check
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

            {/* Attached Actionable Task Card */}
            {msg.taskRecommendation && (
              <div className="mt-2.5 mr-11 max-w-[92%] sm:max-w-[85%] text-right font-sans">
                <Card className="border-2 border-primary/40 bg-card p-4 sm:p-5 rounded-2xl shadow-sm text-right space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary">
                      {msg.taskRecommendation.type === "unseen" && <BookOpen className="h-4 w-4" />}
                      {msg.taskRecommendation.type === "vocab" && <BookA className="h-4 w-4" />}
                      {msg.taskRecommendation.type === "writing" && <PenTool className="h-4 w-4" />}
                      {msg.taskRecommendation.needsTopicSelection
                        ? "שלב 1: בחירת נושא לתרגול"
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

                      {/* Ready Action Button */}
                      <Link href={msg.taskRecommendation.targetUrl} className="block w-full pt-1">
                        <Button size="sm" className="w-full gap-2 font-bold h-10 text-sm sm:text-base cursor-pointer shadow-xs">
                          <span>התחל משימה עכשיו 🚀</span>
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

        {/* Minimal Conversational Diagnostic Check */}
        {diagnosticIndex !== null && DIAGNOSTIC_STEPS[diagnosticIndex] && (
          <div className="mr-11 max-w-[92%] sm:max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 text-right">
            <Card className="border border-primary/30 bg-card p-4 sm:p-5 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>בדיקת רמה קצרה מדוד • שאלה {diagnosticIndex + 1} מתוך {DIAGNOSTIC_STEPS.length}</span>
              </div>

              {DIAGNOSTIC_STEPS[diagnosticIndex].passage && (
                <div className="p-3 bg-muted/50 rounded-xl text-sm font-serif italic text-foreground border-r-4 border-primary/60 text-left" dir="ltr">
                  "{DIAGNOSTIC_STEPS[diagnosticIndex].passage}"
                </div>
              )}

              <div className="space-y-1 text-right font-sans">
                <div className="text-sm sm:text-base font-semibold text-foreground whitespace-pre-line text-left leading-relaxed font-sans" dir="ltr">
                  {DIAGNOSTIC_STEPS[diagnosticIndex].question}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground text-right font-hebrew" dir="rtl">
                  {DIAGNOSTIC_STEPS[diagnosticIndex].questionHebrew}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1" dir="rtl">
                {DIAGNOSTIC_STEPS[diagnosticIndex].options.map((opt, oIdx) => (
                  <Button
                    key={oIdx}
                    variant="outline"
                    onClick={() => handleDiagnosticOptionSelect(opt.value)}
                    className="justify-start text-right h-auto py-2.5 px-3 border-border/70 hover:border-primary hover:bg-primary/5 transition-all text-sm flex flex-col items-start gap-0.5 whitespace-normal cursor-pointer rounded-xl"
                  >
                    <span className="font-semibold text-foreground text-left font-sans text-sm" dir="ltr">{opt.text}</span>
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
        <div className="px-4 sm:px-5 py-2 border-t border-border/20 bg-muted/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar font-sans" dir="rtl">
          <span className="text-xs text-muted-foreground shrink-0">הצעות:</span>
          {messages[messages.length - 1].quickReplies?.map((reply, rIdx) => (
            <button
              key={rIdx}
              onClick={() => handleSendMessage(reply)}
              className="text-xs sm:text-sm bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-border/50 text-foreground px-3 py-1 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer font-sans"
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
          placeholder="כתבו הודעה או שאלה לדוד (באנגלית או בעברית)..."
          className="flex-1 text-sm sm:text-base h-11 rounded-xl bg-muted/30 text-right font-sans border-border/60"
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
