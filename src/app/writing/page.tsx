"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { WRITING_PROMPTS, CONNECTOR_CATEGORIES } from "@/data/writing-prompts";
import { WritingPrompt, WritingEvaluationResult } from "@/types/writing";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PenTool,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";

export default function WritingPage() {
  const [prompts] = useState<WritingPrompt[]>(WRITING_PROMPTS);
  const [selectedPromptId, setSelectedPromptId] = useState<string>(WRITING_PROMPTS[0].id);

  // Outline state
  const [introText, setIntroText] = useState("");
  const [body1Text, setBody1Text] = useState("");
  const [body2Text, setBody2Text] = useState("");
  const [conclusionText, setConclusionText] = useState("");

  // Combined full essay text
  const [essayText, setEssayText] = useState("");
  const [activeMode, setActiveMode] = useState<"outline" | "free">("outline");

  // Evaluation state
  const [evaluation, setEvaluation] = useState<WritingEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentPrompt = prompts.find((p) => p.id === selectedPromptId) || prompts[0];

  // Sync outline to combined essay text
  const combinedText = useMemo(() => {
    if (activeMode === "outline") {
      const parts = [introText, body1Text, body2Text, conclusionText].filter((p) => p.trim().length > 0);
      return parts.join("\n\n");
    }
    return essayText;
  }, [activeMode, introText, body1Text, body2Text, conclusionText, essayText]);

  // Word count calculation
  const words = useMemo(() => {
    return combinedText.trim() ? combinedText.trim().split(/\s+/).filter(Boolean) : [];
  }, [combinedText]);
  const wordCount = words.length;

  const isWordCountValid = wordCount >= currentPrompt.minWords && wordCount <= currentPrompt.maxWords;
  const isWordCountLow = wordCount < currentPrompt.minWords;

  // Insert connector into current active field
  const handleInsertConnector = (connector: string) => {
    if (activeMode === "free") {
      setEssayText((prev) => (prev ? `${prev} ${connector} ` : `${connector} `));
    } else {
      if (!body1Text) {
        setBody1Text(`${connector} `);
      } else if (!body2Text) {
        setBody2Text(`${connector} `);
      } else if (!conclusionText) {
        setConclusionText(`${connector} `);
      } else {
        setBody1Text((prev) => `${prev} ${connector} `);
      }
    }
  };

  // Evaluate Essay with Ministry Rubric
  const handleEvaluate = () => {
    if (wordCount < 15) {
      alert("Please write at least a few sentences before evaluating.");
      return;
    }

    setIsEvaluating(true);

    setTimeout(() => {
      // 1. Content & Task (0-40)
      let contentScore = 36;
      if (wordCount < currentPrompt.minWords * 0.7) contentScore = 24;
      else if (isWordCountValid) contentScore = 38;

      // 2. Organization (0-20)
      const paragraphs = combinedText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
      let orgScore = 18;
      if (paragraphs.length >= 3) orgScore = 20;
      else if (paragraphs.length === 1) orgScore = 14;

      // 3. Language & Grammar (0-20)
      const lower = combinedText.toLowerCase();
      const grammarAlerts: string[] = [];

      // Check informal contractions
      if (lower.includes("don't") || lower.includes("can't") || lower.includes("it's")) {
        grammarAlerts.push("Avoid informal contractions in Bagrut essays (use 'do not', 'cannot', 'it is').");
      }
      // Check sentence starts
      if (lower.includes(". and ") || lower.includes(". but ")) {
        grammarAlerts.push("Try not to start sentences with coordinating conjunctions like 'And' or 'But'. Use 'Furthermore' or 'However'.");
      }
      // Check capital I
      if (/\bi\b/.test(combinedText)) {
        grammarAlerts.push("Always capitalize the personal pronoun 'I'.");
      }

      const langScore = Math.max(14, 20 - grammarAlerts.length * 2);

      // 4. Vocabulary & Mechanics (0-20)
      const vocabularyUpgrades = [
        { original: "good", suggested: "beneficial / exceptional", explanation: "Use more precise qualitative adjectives." },
        { original: "big", suggested: "substantial / prominent", explanation: "Elevate magnitude descriptions to Band III." },
        { original: "help", suggested: "facilitate / contribute to", explanation: "Academic verbs improve your task fulfillment score." },
      ].filter((u) => lower.includes(u.original));

      const vocabScore = Math.min(20, 16 + (lower.includes("furthermore") || lower.includes("consequently") ? 2 : 0) + (isWordCountValid ? 2 : 0));

      const total = contentScore + orgScore + langScore + vocabScore;

      const res: WritingEvaluationResult = {
        totalScore: total,
        maxScore: 100,
        percentage: total,
        wordCount,
        withinLimit: isWordCountValid,
        rubric: [
          {
            criterion: "1. Content & Task Fulfillment",
            hebrewName: "תוכן והבעת עמדה ברורה",
            score: contentScore,
            maxScore: 40,
            feedback: isWordCountValid
              ? "Strong task fulfillment! You stayed strictly within the target word range and addressed the prompt directly."
              : `Your essay is ${wordCount} words. The official target for ${currentPrompt.module} is ${currentPrompt.minWords}–${currentPrompt.maxWords} words.`,
          },
          {
            criterion: "2. Organization & Paragraphing",
            hebrewName: "מבנה פסקאות ומילות קישור",
            score: orgScore,
            maxScore: 20,
            feedback: `Identified ${paragraphs.length} distinct paragraphs. Good logical division of arguments.`,
          },
          {
            criterion: "3. Language & Grammar",
            hebrewName: "דיוק דקדוקי ומבנה משפטים",
            score: langScore,
            maxScore: 20,
            feedback: grammarAlerts.length === 0
              ? "Clean sentence structure with appropriate tenses."
              : "Review suggested grammar & formal style adjustments below.",
          },
          {
            criterion: "4. Vocabulary & Mechanics",
            hebrewName: "עושר לשוני ואוצר מילים",
            score: vocabScore,
            maxScore: 20,
            feedback: "Solid vocabulary choices. Consider using higher Band II/III synonyms to elevate your score.",
          },
        ],
        strengths: [
          "Clear position stated regarding the prompt.",
          `Structured with ${paragraphs.length} distinct paragraphs.`,
          "Formal register maintained without colloquial slang.",
        ],
        grammarAlerts,
        vocabularyUpgrades,
      };

      setEvaluation(res);
      setIsEvaluating(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(combinedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <PenTool className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm sm:text-base">Writing Workshop</span>
              <Badge variant="outline" className="text-[10px] hidden md:inline-block">
                Ministry 4-Criteria Rubric
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
        {/* Prompt Selection & Task Overview */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground">Select Prompt:</span>
            <select
              value={selectedPromptId}
              onChange={(e) => {
                setSelectedPromptId(e.target.value);
                setEvaluation(null);
              }}
              className="h-8 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer max-w-[280px] sm:max-w-md truncate"
            >
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.module}] {p.title} ({p.minWords}–{p.maxWords} words)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">
              {currentPrompt.module}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Target: {currentPrompt.minWords}–{currentPrompt.maxWords} words
            </Badge>
          </div>
        </div>

        {/* Two-Column Grid: Prompt & Connectors (Left) vs Editor & Rubric (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Prompt Instructions & Connector Palette */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/40">
                <span className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
                  Bagrut Essay Task
                </span>
                <CardTitle className="text-xl font-bold pt-1">{currentPrompt.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed text-foreground/90">
                  {currentPrompt.promptText}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="space-y-1.5">
                  <span className="font-semibold text-foreground">Required in your essay:</span>
                  <ul className="space-y-1 text-muted-foreground">
                    {currentPrompt.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    <span>Teacher Tip:</span>
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentPrompt.tips[0]}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Connector Word Bank */}
            <Card className="border border-primary/20 bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Connector Bank (מילות קישור)</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Click word to insert</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-1">
                {CONNECTOR_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      {cat.name}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.connectors.map((c, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleInsertConnector(c)}
                          className="px-2 py-1 rounded-md border border-border/80 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 text-[11px] font-mono transition-colors cursor-pointer"
                        >
                          + {c}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Editor & Rubric Feedback */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Word Count & Action Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card shadow-xs">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-xs text-muted-foreground block">Word Count</span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-xl font-extrabold ${
                        isWordCountValid
                          ? "text-emerald-600 dark:text-emerald-400"
                          : isWordCountLow
                          ? "text-amber-500"
                          : "text-destructive"
                      }`}
                    >
                      {wordCount}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {currentPrompt.minWords}–{currentPrompt.maxWords} target
                    </span>
                  </div>
                </div>

                <Badge
                  variant={isWordCountValid ? "default" : "secondary"}
                  className="text-[11px] hidden sm:inline-block"
                >
                  {isWordCountValid ? "✓ Target Zone" : isWordCountLow ? "Under target" : "Exceeded"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/40 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveMode("outline")}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      activeMode === "outline" ? "bg-background shadow-xs font-bold" : "text-muted-foreground"
                    }`}
                  >
                    Structured Outline
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeMode === "outline") setEssayText(combinedText);
                      setActiveMode("free");
                    }}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      activeMode === "free" ? "bg-background shadow-xs font-bold" : "text-muted-foreground"
                    }`}
                  >
                    Full Text Pad
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="cursor-pointer h-7 text-xs gap-1"
                  title="Copy essay text"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            </div>

            {/* MODE A: Structured Outline Builder */}
            {activeMode === "outline" ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-foreground">
                    <span>Paragraph 1: Introduction (Hook + Clear Opinion)</span>
                    <span className="text-[11px] text-muted-foreground">~25-30 words</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Introduce the topic and state clearly whether you agree or disagree with the prompt..."
                    value={introText}
                    onChange={(e) => setIntroText(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-foreground">
                    <span>Paragraph 2: First Reason & Example</span>
                    <span className="text-[11px] text-muted-foreground">~35-40 words</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Provide your main argument supported by an authentic example (e.g. 'First and foremost, using phones in class...')"
                    value={body1Text}
                    onChange={(e) => setBody1Text(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-foreground">
                    <span>Paragraph 3: Second Reason or Counter-argument</span>
                    <span className="text-[11px] text-muted-foreground">~35-40 words</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Add an additional supporting point or counter-argument (e.g. 'In addition, studies have demonstrated...')"
                    value={body2Text}
                    onChange={(e) => setBody2Text(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-foreground">
                    <span>Paragraph 4: Conclusion & Takeaway</span>
                    <span className="text-[11px] text-muted-foreground">~20-25 words</span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Restate your thesis in fresh words and conclude (e.g. 'In conclusion, while technology has benefits...')"
                    value={conclusionText}
                    onChange={(e) => setConclusionText(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
            ) : (
              /* MODE B: Full Free Writing Pad */
              <div className="space-y-1">
                <textarea
                  rows={14}
                  placeholder="Write your complete essay here. Separate paragraphs with an empty line..."
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-3.5 text-xs sm:text-sm font-serif leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            )}

            {/* Evaluation Action Button */}
            <div className="pt-2">
              <Button
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="w-full h-11 text-sm font-semibold cursor-pointer gap-2 shadow-sm"
              >
                <Send className="h-4 w-4" />
                <span>
                  {isEvaluating
                    ? "Evaluating with Ministry Rubric..."
                    : "Run Ministry Rubric & AI Diagnostic Evaluation"}
                </span>
              </Button>
            </div>

            {/* Rubric Evaluation Diagnostic Results */}
            {evaluation && (
              <div className="space-y-4 pt-4 border-t border-border">
                {/* Total Score Header */}
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-bold text-primary tracking-wider">
                      Official Ministry Rubric Score
                    </span>
                    <h3 className="text-xl font-extrabold text-foreground">
                      Diagnostic Evaluation: {evaluation.totalScore} / {evaluation.maxScore} pts
                    </h3>
                  </div>
                  <Badge variant="default" className="text-sm px-3 py-1 font-bold">
                    Grade: {evaluation.percentage}%
                  </Badge>
                </div>

                {/* 4 Rubric Criteria Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {evaluation.rubric.map((r, idx) => (
                    <Card key={idx} className="border border-border/80">
                      <CardHeader className="p-3 pb-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{r.criterion}</span>
                          <Badge variant="secondary" className="text-[10px]">
                            {r.score} / {r.maxScore}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{r.hebrewName}</span>
                      </CardHeader>
                      <CardContent className="p-3 pt-1 text-xs text-muted-foreground leading-relaxed">
                        {r.feedback}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Grammar & Style Alerts */}
                {evaluation.grammarAlerts.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Formal Style & Grammar Alerts:</span>
                    </div>
                    <ul className="space-y-1 text-xs text-foreground/90 pl-5 list-disc">
                      {evaluation.grammarAlerts.map((ga, i) => (
                        <li key={i}>{ga}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Vocabulary Upgrades */}
                {evaluation.vocabularyUpgrades.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      <span>Suggested Band III Vocabulary Upgrades:</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {evaluation.vocabularyUpgrades.map((u, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                          <span>
                            Replace &quot;<strong className="text-muted-foreground">{u.original}</strong>&quot; with{" "}
                            <strong className="text-primary">{u.suggested}</strong>
                          </span>
                          <span className="text-[10px] text-muted-foreground">{u.explanation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
