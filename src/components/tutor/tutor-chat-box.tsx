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
import { Card, CardContent } from "@/components/ui/card";
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
  ArrowRight,
  BookOpen,
  BookA,
  PenTool,
  RotateCcw,
  Bot,
  User,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface TutorChatBoxProps {
  profile: StudentTutorProfile;
  onProfileUpdate: (newProfile: StudentTutorProfile) => void;
  studentName: string;
}

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

  // Diagnostic state inside chat
  const [diagnosticIndex, setDiagnosticIndex] = useState<number | null>(
    profile.diagnosticCompleted ? null : 0
  );
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<
    { questionIndex: number; selectedOption: string }[]
  >([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, diagnosticIndex]);

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
          ? `Hello ${studentName}! I'm David, your English tutor. Welcome back! We are currently working on ${profile.level} (${profile.vocabBand}). What would you like to practice today?`
          : `Hello ${studentName}! I'm David, your personal English tutor. I'm excited to help you succeed in English! Let's start with a quick 4-question check to tailor your learning plan. Ready? (בוא נתחיל במבדק אבחון קצרצר של 4 שאלות להתאמת תוכנית הלימודים האישית שלך)`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies: profile.diagnosticCompleted
          ? ["תן לי משימת קריאה (Unseen)", "תרגל אוצר מילים", "בוא נכתוב חיבור"]
          : ["בוא נתחיל במבדק!", "ספר לי עוד על דוד"],
      };

      setMessages([initialGreeting]);
      saveTutorChat([initialGreeting], profile.studentId);
    }
  }, [profile.studentId, profile.diagnosticCompleted]);

  // Text to Speech
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Remove hebrew annotations inside parentheses for cleaner English audio
      const cleanEnglish = text.replace(/\([^)]*[\u0590-\u05FF][^)]*\)/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanEnglish || text);
      utterance.lang = "en-US";
      utterance.rate = 0.95; // Slightly slower for clarity
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
    <Card className="flex flex-col h-[650px] sm:h-[700px] border border-border/60 bg-card/60 backdrop-blur-xs shadow-xs overflow-hidden">
      {/* Tutor Chat Header */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-border/40 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-base shadow-xs">
              👨‍🏫
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>

          <div>
            <div className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
              David (דוד)
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                AI Private Tutor
              </Badge>
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <span>מורה פרטי אישי לאנגלית</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">זמין כעת</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`h-8 w-8 rounded-lg ${speechEnabled ? "text-primary" : "text-muted-foreground"}`}
            title={speechEnabled ? "השתק הקראה קולית" : "הפעל הקראה קולית באנגלית"}
          >
            {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRestartDiagnostic}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            title="בצע מבדק אבחון מחדש"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Transcript */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "student" ? "items-end" : "items-start"}`}
          >
            <div
              className={`flex items-start gap-2.5 max-w-[85%] sm:max-w-[78%] ${
                msg.sender === "student" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-7 w-7 rounded-xl items-center justify-center text-xs shrink-0 mt-1 shadow-xs ${
                  msg.sender === "student"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border border-border/50"
                }`}
              >
                {msg.sender === "student" ? <User className="h-3.5 w-3.5" /> : "👨‍🏫"}
              </div>

              <div
                className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs leading-relaxed ${
                  msg.sender === "student"
                    ? "bg-primary text-primary-foreground rounded-tr-xs"
                    : "bg-muted/70 text-foreground border border-border/40 rounded-tl-xs"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.sender === "student" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>

            {/* Attached Actionable Task Card */}
            {msg.taskRecommendation && (
              <div className="mt-2.5 ml-9 max-w-[85%] sm:max-w-[75%]">
                <Card className="border-2 border-primary/40 bg-primary/5 p-3.5 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      {msg.taskRecommendation.type === "unseen" && <BookOpen className="h-3.5 w-3.5" />}
                      {msg.taskRecommendation.type === "vocab" && <BookA className="h-3.5 w-3.5" />}
                      {msg.taskRecommendation.type === "writing" && <PenTool className="h-3.5 w-3.5" />}
                      משימה מותאמת עבורך
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      {msg.taskRecommendation.level}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-sm text-foreground mb-1">
                    {msg.taskRecommendation.hebrewTitle}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {msg.taskRecommendation.descriptionHebrew}
                  </p>

                  <Link href={msg.taskRecommendation.targetUrl} className="block w-full">
                    <Button size="sm" className="w-full gap-2 font-bold h-8 text-xs">
                      <span>התחל משימה עכשיו</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </Card>
              </div>
            )}
          </div>
        ))}

        {/* Diagnostic Question Interactive Widget */}
        {diagnosticIndex !== null && DIAGNOSTIC_STEPS[diagnosticIndex] && (
          <div className="ml-9 max-w-[90%] sm:max-w-[82%] animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-2 border-primary/40 bg-card p-4 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-primary font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  מבדק התאמה אישי מדוד (שאלה {diagnosticIndex + 1} מתוך {DIAGNOSTIC_STEPS.length})
                </span>
                <span className="text-muted-foreground text-[11px]">
                  {Math.round(((diagnosticIndex + 1) / DIAGNOSTIC_STEPS.length) * 100)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${((diagnosticIndex + 1) / DIAGNOSTIC_STEPS.length) * 100}%` }}
                />
              </div>

              {DIAGNOSTIC_STEPS[diagnosticIndex].passage && (
                <div className="p-3 bg-muted/60 rounded-xl text-xs sm:text-sm font-serif italic text-foreground border border-border/40">
                  {DIAGNOSTIC_STEPS[diagnosticIndex].passage}
                </div>
              )}

              <div className="space-y-1">
                <div className="text-xs sm:text-sm font-semibold text-foreground whitespace-pre-line">
                  {DIAGNOSTIC_STEPS[diagnosticIndex].question}
                </div>
                <div className="text-xs text-muted-foreground">
                  {DIAGNOSTIC_STEPS[diagnosticIndex].questionHebrew}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {DIAGNOSTIC_STEPS[diagnosticIndex].options.map((opt, oIdx) => (
                  <Button
                    key={oIdx}
                    variant="outline"
                    onClick={() => handleDiagnosticOptionSelect(opt.value)}
                    className="justify-start text-left h-auto py-2.5 px-3 border-border/70 hover:border-primary hover:bg-primary/5 transition-all text-xs sm:text-sm flex flex-col items-start gap-0.5 whitespace-normal"
                  >
                    <span className="font-semibold text-foreground">{opt.text}</span>
                    {opt.textHebrew && (
                      <span className="text-[11px] text-muted-foreground">{opt.textHebrew}</span>
                    )}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Loading Indicator */}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground ml-9">
            <div className="flex h-7 w-7 rounded-xl items-center justify-center bg-muted text-foreground shrink-0 shadow-xs">
              👨‍🏫
            </div>
            <div className="bg-muted/60 px-3.5 py-2 rounded-2xl border border-border/40 flex items-center gap-1.5">
              <span className="animate-pulse">דוד כותב לך...</span>
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
        <div className="px-4 py-2 border-t border-border/30 bg-muted/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-muted-foreground shrink-0 font-medium">הצעות מהירות:</span>
          {messages[messages.length - 1].quickReplies?.map((reply, rIdx) => (
            <button
              key={rIdx}
              onClick={() => handleSendMessage(reply)}
              className="text-xs bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-border/50 text-foreground px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 sm:p-4 border-t border-border/40 bg-background flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleListening}
          className={`h-10 w-10 shrink-0 rounded-xl transition-colors ${
            isListening
              ? "bg-rose-500 text-white border-rose-500 animate-pulse"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={isListening ? "עצור הקלטה" : "דבר באנגלית עם דוד (Voice)"}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

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
          className="flex-1 text-xs sm:text-sm h-10 rounded-xl bg-muted/40"
          disabled={isSending}
        />

        <Button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isSending}
          size="icon"
          className="h-10 w-10 shrink-0 rounded-xl shadow-xs"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
