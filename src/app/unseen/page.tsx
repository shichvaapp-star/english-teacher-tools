"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { SAMPLE_UNSEENS } from "@/data/unseen-samples";
import { UnseenPassage, BagrutModule, StudentAnswers, UnseenEvaluationResult } from "@/types/unseen";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  ArrowLeft,
  Printer,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  PlusCircle,
} from "lucide-react";

export default function UnseenPage() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const [passages, setPassages] = useState<UnseenPassage[]>(SAMPLE_UNSEENS);
  const [selectedPassageId, setSelectedPassageId] = useState<string>(SAMPLE_UNSEENS[0].id);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("all");

  // Reading ergonomics
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  // Student test state
  const [answers, setAnswers] = useState<StudentAnswers>({});
  const [evaluation, setEvaluation] = useState<UnseenEvaluationResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Teacher generator state
  const [genModule, setGenModule] = useState<BagrutModule>("Module E");
  const [genTopic, setGenTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const currentPassage = passages.find((p) => p.id === selectedPassageId) || passages[0];

  const filteredPassages = passages.filter((p) => {
    if (selectedModuleFilter === "all") return true;
    return p.module === selectedModuleFilter;
  });

  // Handle answering
  const handleAnswerChange = (questionId: string, val: string | number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  // Evaluate test
  const handleSubmitTest = () => {
    let earnedTotal = 0;
    const breakdown = currentPassage.questions.map((q) => {
      const studentVal = answers[q.id];
      let isCorrect = false;
      let earned = 0;
      let feedback = "";

      if (q.type === "multiple_choice") {
        isCorrect = Number(studentVal) === q.correctOptionIndex;
        earned = isCorrect ? q.points : 0;
        feedback = isCorrect
          ? "Correct! Exact match with the text."
          : `Incorrect. The correct option was (${String.fromCharCode(65 + (q.correctOptionIndex ?? 0))}).`;
      } else {
        // Open-ended evaluation heuristics
        const textAnswer = String(studentVal || "").trim().toLowerCase();
        if (!textAnswer) {
          isCorrect = false;
          earned = 0;
          feedback = "No answer provided.";
        } else {
          const matchedKeywords = (q.keywordsRequired || []).filter((kw) =>
            textAnswer.includes(kw.toLowerCase())
          );
          const ratio = (q.keywordsRequired?.length || 1) > 0 ? matchedKeywords.length / (q.keywordsRequired?.length || 1) : 0;
          if (ratio >= 0.5) {
            isCorrect = true;
            earned = q.points;
            feedback = "Well articulated! Essential points covered accurately.";
          } else if (ratio >= 0.25 || textAnswer.length > 20) {
            isCorrect = false;
            earned = Math.round(q.points * 0.5);
            feedback = "Partial credit: Good direction, but missing key supporting details.";
          } else {
            isCorrect = false;
            earned = 0;
            feedback = "Needs more detail matching the paragraph evidence.";
          }
        }
      }

      earnedTotal += earned;

      return {
        questionId: q.id,
        questionNumber: q.number,
        isCorrect,
        earnedPoints: earned,
        maxPoints: q.points,
        feedback,
        studentAnswer: studentVal !== undefined ? studentVal : "Not answered",
        correctAnswer:
          q.type === "multiple_choice"
            ? `${String.fromCharCode(65 + (q.correctOptionIndex ?? 0))}. ${q.options?.[q.correctOptionIndex ?? 0]}`
            : q.modelAnswer || "",
      };
    });

    const result: UnseenEvaluationResult = {
      score: earnedTotal,
      maxScore: currentPassage.totalPoints,
      percentage: Math.round((earnedTotal / currentPassage.totalPoints) * 100),
      breakdown,
    };

    setEvaluation(result);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setEvaluation(null);
    setIsSubmitted(false);
  };

  // Text-To-Speech
  const handleToggleTTS = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isReadingAloud) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${currentPassage.title}. ${currentPassage.paragraphs.join(" ")}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.onend = () => setIsReadingAloud(false);
      utterance.onerror = () => setIsReadingAloud(false);
      window.speechSynthesis.speak(utterance);
      setIsReadingAloud(true);
    }
  };

  // Print Exam
  const handlePrint = () => {
    window.print();
  };

  // Simulate Teacher AI Generation
  const handleCreatePassage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const topicName = genTopic.trim() || "The Role of Renewable Energy";
      const newPassage: UnseenPassage = {
        id: `unseen-custom-${Date.now()}`,
        title: topicName,
        module: genModule,
        levelDescription: `${genModule} Calibrated by Gemini Pro`,
        paragraphs: [
          `As global energy demands escalate, researchers are turning toward innovative decentralized renewable grids. Unlike traditional centralized power plants, localized solar and micro-wind installations empower municipalities to generate and distribute their own clean power.`,
          `Economic analysts project that adopting smart regional grids will mitigate electrical grid instability while significantly diminishing greenhouse emissions over the next decade.`,
          `Nevertheless, overcoming initial infrastructure costs remains the foremost challenge for emerging economies. International cooperative grants are progressively bridging this gap, demonstrating that sustainable energy independence is well within reach.`,
        ],
        wordCount: 140,
        totalPoints: 70,
        targetBands: ["Band II", "Band III"],
        questions: [
          {
            id: `q-gen-1`,
            number: 1,
            paragraphRef: 1,
            type: "multiple_choice",
            prompt: "What is the primary advantage of decentralized renewable grids over traditional plants?",
            options: [
              "They produce power only during daylight hours.",
              "They allow local communities to generate and manage their own power.",
              "They require zero maintenance.",
              "They completely eliminate the need for batteries.",
            ],
            correctOptionIndex: 1,
            points: 20,
          },
          {
            id: `q-gen-2`,
            number: 2,
            paragraphRef: 2,
            type: "open_ended",
            prompt: "According to paragraph 2, what two positive outcomes do economic analysts anticipate?",
            modelAnswer: "Decreased electrical grid instability and significantly reduced greenhouse emissions.",
            keywordsRequired: ["instability", "diminishing", "greenhouse", "emissions", "stability"],
            points: 25,
          },
          {
            id: `q-gen-3`,
            number: 3,
            paragraphRef: 3,
            type: "open_ended",
            prompt: "What is cited in paragraph 3 as the foremost obstacle to implementing these systems?",
            modelAnswer: "The initial infrastructure costs for emerging economies.",
            keywordsRequired: ["initial", "infrastructure", "costs", "challenge"],
            points: 25,
          },
        ],
      };

      setPassages([newPassage, ...passages]);
      setSelectedPassageId(newPassage.id);
      setIsGenerating(false);
      setGenTopic("");
      handleReset();
    }, 1200);
  };

  const fontClasses = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed",
    lg: "text-lg leading-loose",
    xl: "text-xl leading-loose",
  }[fontSize];

  return (
    <div className="flex flex-col min-h-screen bg-background print:bg-white print:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Hub</span>
            </Link>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm sm:text-base">Unseen Reading Engine</span>
              <Badge variant="outline" className="text-[10px] hidden md:inline-block">
                Bagrut Modules A–G
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 print:p-0 print:m-0">
        {/* Module Filter & Passage Selection Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden border-b border-border/60 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Filter by Module:</span>
            {["all", "Module C", "Module E", "Module G"].map((mod) => (
              <Button
                key={mod}
                variant={selectedModuleFilter === mod ? "default" : "outline"}
                size="sm"
                className="text-xs cursor-pointer h-7"
                onClick={() => setSelectedModuleFilter(mod)}
              >
                {mod === "all" ? "All Levels" : mod}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPassageId}
              onChange={(e) => {
                setSelectedPassageId(e.target.value);
                handleReset();
              }}
              className="h-8 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer max-w-[240px] truncate"
            >
              {filteredPassages.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.module}] {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls & Teacher Generator */}
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">
              {currentPassage.module}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {currentPassage.levelDescription}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {currentPassage.wordCount} words &bull; Total: {currentPassage.totalPoints} Points
            </span>
          </div>

          {/* Reading Tools & Print */}
          <div className="flex items-center gap-1.5">
            {/* Font size toggles */}
            <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/30 text-xs">
              <button
                type="button"
                onClick={() => setFontSize("sm")}
                className={`px-2 py-1 rounded cursor-pointer ${fontSize === "sm" ? "bg-background shadow-xs font-bold" : "text-muted-foreground"}`}
                title="Small text"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize("base")}
                className={`px-2 py-1 rounded cursor-pointer ${fontSize === "base" ? "bg-background shadow-xs font-bold" : "text-muted-foreground"}`}
                title="Standard text"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("lg")}
                className={`px-2 py-1 rounded cursor-pointer ${fontSize === "lg" ? "bg-background shadow-xs font-bold" : "text-muted-foreground"}`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* TTS Read Aloud */}
            <Button
              variant="outline"
              size="sm"
              className={`gap-1.5 text-xs cursor-pointer ${isReadingAloud ? "border-primary bg-primary/10 text-primary" : ""}`}
              onClick={handleToggleTTS}
              title="Text-to-speech read aloud"
            >
              {isReadingAloud ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isReadingAloud ? "Stop Audio" : "Read Aloud"}</span>
            </Button>

            {/* Print Official Exam Booklet */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs cursor-pointer"
              onClick={handlePrint}
              title="Print Ministry Exam Booklet"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Booklet</span>
            </Button>
          </div>
        </div>

        {/* Printable Header (Visible only when printing) */}
        <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">STATE OF ISRAEL &bull; MINISTRY OF EDUCATION</h1>
              <p className="text-sm">English Examination &bull; {currentPassage.module}</p>
            </div>
            <div className="text-right text-xs">
              <p>Student Name: ___________________________</p>
              <p className="mt-1">Date: ______________ Class: ___________</p>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Passage (Left) & Questions (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Passage Column */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="border border-border/80 shadow-xs print:border-none print:shadow-none">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-primary font-bold">
                    Part I: Access to Information from Written Texts
                  </span>
                  <Badge variant="secondary" className="text-[11px] print:hidden">
                    {currentPassage.totalPoints} Points
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground pt-1">
                  {currentPassage.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  Read the passage below carefully and answer the questions that follow.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 font-serif">
                {currentPassage.paragraphs.map((para, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-primary shrink-0 select-none mt-1 print:text-black">
                      [{idx + 1}]
                    </span>
                    <p className={`text-foreground/90 leading-relaxed ${fontClasses}`}>
                      {para}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Teacher AI Generator Panel (Teacher only) */}
            {isTeacher && (
              <Card className="border border-primary/20 bg-primary/5 print:hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                    <Sparkles className="h-4 w-4" />
                    <span>Teacher Cockpit &bull; Advanced AI Passage Generator</span>
                  </div>
                  <CardTitle className="text-base">Generate New Calibrated Unseen</CardTitle>
                  <CardDescription className="text-xs">
                    Uses high-reasoning Gemini Pro to generate authentic vocabulary, natural sentence rhythm, and Ministry-grade questions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreatePassage} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Target Bagrut Module</label>
                        <select
                          value={genModule}
                          onChange={(e) => setGenModule(e.target.value as BagrutModule)}
                          className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="Module A">Module A (3 Points - Foundation)</option>
                          <option value="Module C">Module C (3-4 Points - Intermediate)</option>
                          <option value="Module E">Module E (4-5 Points - Advanced)</option>
                          <option value="Module G">Module G (5 Points - High Level)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium">Topic / Theme</label>
                        <Input
                          placeholder="e.g. Clean Energy, Social Media, AI in Medicine"
                          value={genTopic}
                          onChange={(e) => setGenTopic(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    <Button type="submit" size="sm" className="w-full gap-1.5" disabled={isGenerating}>
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>{isGenerating ? "Synthesizing with Gemini Pro..." : "Generate Passage & Question Set"}</span>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Questions Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Score & Evaluation Banner if submitted */}
            {evaluation && (
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/10 space-y-2 print:hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-sm">Evaluation Complete!</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-foreground">
                      {evaluation.score}
                    </span>
                    <span className="text-xs text-muted-foreground"> / {evaluation.maxScore} pts</span>
                    <Badge variant="default" className="ml-2">
                      {evaluation.percentage}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">
                    Review your answers and teacher guidance below.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleReset} className="h-7 text-xs gap-1">
                    <RotateCcw className="h-3 w-3" />
                    <span>Try Again</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <h3 className="font-bold text-sm text-foreground">
                  Questions (Answer all questions according to the text)
                </h3>
                <span className="text-xs text-muted-foreground">
                  {currentPassage.questions.length} Questions
                </span>
              </div>

              {currentPassage.questions.map((q) => {
                const evalItem = evaluation?.breakdown.find((b) => b.questionId === q.id);

                return (
                  <Card
                    key={q.id}
                    className={`border transition-colors ${
                      evalItem
                        ? evalItem.isCorrect
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : evalItem.earnedPoints > 0
                          ? "border-amber-500/50 bg-amber-500/5"
                          : "border-destructive/40 bg-destructive/5"
                        : "border-border/80"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono font-bold">
                            Question {q.number}
                          </Badge>
                          {q.paragraphRef && (
                            <span className="text-[11px] text-muted-foreground">
                              (Paragraph [{q.paragraphRef}])
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {q.points} Points
                        </span>
                      </div>
                      <CardTitle className="text-sm font-semibold text-foreground pt-1.5 leading-snug">
                        {q.prompt}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-1">
                      {/* Multiple Choice Form */}
                      {q.type === "multiple_choice" && q.options && (
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = Number(answers[q.id]) === optIdx;
                            return (
                              <label
                                key={optIdx}
                                className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                  isChosen
                                    ? "border-primary bg-primary/10 font-medium text-foreground"
                                    : "border-border/60 hover:bg-muted/50 text-foreground/90"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  checked={isChosen}
                                  onChange={() => handleAnswerChange(q.id, optIdx)}
                                  disabled={isSubmitted}
                                  className="mt-0.5 accent-primary"
                                />
                                <span>
                                  <strong className="mr-1">{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Open-Ended Form */}
                      {q.type === "open_ended" && (
                        <div className="space-y-1.5">
                          <textarea
                            rows={3}
                            placeholder="Type your answer in English here..."
                            value={String(answers[q.id] || "")}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            disabled={isSubmitted}
                            className="w-full rounded-md border border-input bg-background p-2.5 text-xs leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-80"
                          />
                        </div>
                      )}

                      {/* Feedback breakdown if submitted */}
                      {evalItem && (
                        <div className="pt-2 border-t border-border/40 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold flex items-center gap-1">
                              {evalItem.isCorrect ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-destructive" />
                              )}
                              <span>Earned: {evalItem.earnedPoints} / {evalItem.maxPoints} pts</span>
                            </span>
                          </div>
                          <p className="text-muted-foreground">{evalItem.feedback}</p>
                          {!evalItem.isCorrect && (
                            <p className="text-[11px] text-foreground font-mono bg-muted/60 p-2 rounded">
                              <strong>Model Answer:</strong> {evalItem.correctAnswer}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Test Submission Footer */}
            <div className="pt-2 print:hidden">
              {!isSubmitted ? (
                <Button
                  onClick={handleSubmitTest}
                  className="w-full h-11 text-sm font-semibold cursor-pointer gap-2 shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Unseen for Instant Grading ({currentPassage.totalPoints} pts)</span>
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full h-11 text-sm font-semibold cursor-pointer gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset & Retake Test</span>
                  </Button>
                  <Button
                    onClick={() => {
                      const next = passages.find((p) => p.id !== selectedPassageId);
                      if (next) {
                        setSelectedPassageId(next.id);
                        handleReset();
                      }
                    }}
                    className="w-full h-11 text-sm font-semibold cursor-pointer gap-2"
                  >
                    <span>Next Passage</span>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
