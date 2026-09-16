"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PenTool,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Mail,
  FileText,
  Copy,
  Check,
  Send,
  Lightbulb,
} from "lucide-react";

interface WritingTask {
  id: string;
  category: "letter" | "opinion";
  title: string;
  hebrewTitle: string;
  prompt: string;
  hebrewInstructions: string;
  targetWords: string;
  minWords: number;
  maxWords: number;
  starterTips: string[];
}

const MIDDLE_SCHOOL_TASKS: WritingTask[] = [
  {
    id: "task-letter-1",
    category: "letter",
    title: "Letter to a Friend about Summer Vacation",
    hebrewTitle: "מכתב לחבר על חופשת הקיץ",
    prompt:
      "Write a short letter in English to a friend describing your summer vacation. Tell them about what you did, places you visited, and how you felt. Ask them about their summer too.",
    hebrewInstructions: "כתבו מכתב לחבר/ה באנגלית. ספרו מה עשיתם, איפה ביקרתם ואיך הרגשתם. שאלו גם על החופשה שלהם.",
    targetWords: "50–70 מילים",
    minWords: 45,
    maxWords: 80,
    starterTips: [
      "פתחו בברכה: 'Dear [Name],' או 'Hi [Name],'",
      "ספרו לפחות 2 חוויות מהחופשה",
      "סיימו בברכה: 'Write back soon, [Your Name]'",
    ],
  },
  {
    id: "task-letter-2",
    category: "letter",
    title: "Thank-You Letter to a Relative",
    hebrewTitle: "מכתב תודה לאחר אירוח",
    prompt:
      "Write a warm thank-you letter to a relative or friend after spending a weekend at their house. Thank them for the food, hospitality, and activities you enjoyed together.",
    hebrewInstructions: "כתבו מכתב תודה חם לקרוב משפחה או חבר לאחר שהתארחתם אצלם בסוף שבוע.",
    targetWords: "50–70 מילים",
    minWords: 45,
    maxWords: 80,
    starterTips: [
      "פתחו ב: 'Dear Aunt Sarah / Dear Tom,'",
      "הודו על האירוח: 'Thank you so much for having me over...'",
      "ציינו פעילות אחת שממש נהניתם ממנה",
    ],
  },
  {
    id: "task-opinion-1",
    category: "opinion",
    title: "Should Phones be Allowed in School?",
    hebrewTitle: "שימוש בטלפונים בבית הספר",
    prompt:
      "Should middle-school students be allowed to use mobile phones during school breaks? Write a paragraph expressing your opinion. Provide at least two reasons to support your position.",
    hebrewInstructions: "האם יש לאפשר לתלמידי חטיבה להשתמש בטלפונים בהפסקות? כתבו פסקת דעה ונמקו בשתי סיבות.",
    targetWords: "50–80 מילים",
    minWords: 45,
    maxWords: 90,
    starterTips: [
      "התחילו בהבעת עמדה: 'In my opinion, students should / should not be allowed...'",
      "השתמשו במילות קישור: 'First of all,... In addition,...'",
      "סיימו בסיכום: 'In conclusion,...'",
    ],
  },
  {
    id: "task-opinion-2",
    category: "opinion",
    title: "Why Physical Exercise is Important",
    hebrewTitle: "חשיבות הפעילות הגופנית לנערים",
    prompt:
      "Explain why physical exercise is important for teenagers. Write an opinion paragraph discussing health benefits, energy, and mood improvement.",
    hebrewInstructions: "הסבירו מדוע פעילות גופנית חשובה לבני נוער. תארו יתרונות בריאותיים והרגשה טובה.",
    targetWords: "50–80 מילים",
    minWords: 45,
    maxWords: 90,
    starterTips: [
      "התחילו במשפט פתיחה: 'I believe that exercise is very important for teenagers because...'",
      "תנו דוגמה לספורט שאתם אוהבים",
      "סיימו במשפט סיכום מעודד",
    ],
  },
];

const MS_CONNECTORS = [
  {
    category: "סדר וארגון",
    items: [
      { text: "First of all, ", heb: "קודם כל" },
      { text: "Secondly, ", heb: "שנית" },
      { text: "Next, ", heb: "לאחר מכן" },
      { text: "Finally, ", heb: "לבסוף" },
      { text: "In conclusion, ", heb: "לסיכום" },
    ],
  },
  {
    category: "הוספת מידע",
    items: [
      { text: "In addition, ", heb: "בנוסף" },
      { text: "Furthermore, ", heb: "יתרה מכך" },
      { text: "Also, ", heb: "גם" },
    ],
  },
  {
    category: "הצגת ניגוד",
    items: [
      { text: "However, ", heb: "אולם, עם זאת" },
      { text: "On the other hand, ", heb: "מצד שני" },
      { text: "Although ", heb: "למרות ש-" },
    ],
  },
  {
    category: "סיבה ודוגמה",
    items: [
      { text: "Because ", heb: "בגלל ש-" },
      { text: "For example, ", heb: "לדוגמה" },
      { text: "As a result, ", heb: "כתוצאה מכך" },
    ],
  },
];

export default function WritingPracticePage() {
  const [tasks] = useState<WritingTask[]>(MIDDLE_SCHOOL_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(MIDDLE_SCHOOL_TASKS[0].id);
  const [essayText, setEssayText] = useState("");
  const [copied, setCopied] = useState(false);

  // Feedback state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    encouragement: string;
    strengths: string[];
    tips: string[];
  } | null>(null);

  const currentTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  // Word count calculation
  const wordList = useMemo(() => {
    return essayText.trim() ? essayText.trim().split(/\s+/).filter(Boolean) : [];
  }, [essayText]);
  const wordCount = wordList.length;

  const isWordCountGood = wordCount >= currentTask.minWords && wordCount <= currentTask.maxWords;

  // Insert connector into text
  const handleAddConnector = (connText: string) => {
    setEssayText((prev) => (prev ? `${prev} ${connText} ` : `${connText} `));
  };

  // Run friendly AI evaluation
  const handleEvaluate = () => {
    if (wordCount < 10) {
      alert("אנא כתבו לפחות משפט או שניים באנגלית לפני בדיקת החיבור.");
      return;
    }

    setIsEvaluating(true);

    setTimeout(() => {
      const lower = essayText.toLowerCase();
      const strengths: string[] = [];
      const tips: string[] = [];

      // Check task fulfillment
      if (wordCount >= currentTask.minWords) {
        strengths.push(`אורך מעולה! כתבת ${wordCount} מילים, בדיוק בטווח המבוקש לחטיבת הביניים.`);
      } else {
        tips.push(`החיבור קצת קצר (${wordCount} מילים). מומלץ להוסיף עוד משפט או שניים להשלמת היעד (${currentTask.targetWords}).`);
      }

      // Check connectors
      if (lower.includes("in addition") || lower.includes("first") || lower.includes("however") || lower.includes("because")) {
        strengths.push("שימוש יפה במילות קישור שמחברות את המשפטים ברצף הגיוני!");
      } else {
        tips.push("נסו לשלב מילת קישור אחת לפחות (כגון 'In addition' או 'Because') להעשרת המשפטים.");
      }

      // Check capitalization of 'I'
      if (/\bi\b/.test(essayText)) {
        tips.push("שימו לב: את מילת הגוף 'I' (אני) כותבים תמיד באות גדולה באנגלית!");
      } else {
        strengths.push("שימוש נכון באותיות גדולות בתחילת משפטים!");
      }

      // Encouraging friendly score
      const calcScore = Math.min(100, Math.max(75, 80 + (isWordCountGood ? 10 : 0) + (strengths.length * 3)));

      setFeedback({
        score: calcScore,
        encouragement: "עבודה נהדרת! המשך/י כך — תרגול כתיבה קבוע הוא הדרך המהירה ביותר לשלוט באנגלית!",
        strengths,
        tips,
      });

      setIsEvaluating(false);
    }, 900);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(essayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <span className="hidden sm:inline">חזרה לראשי</span>
            </Link>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <PenTool className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm sm:text-base">אימון כתיבה &bull; חטיבת ביניים בן גוריון</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Task Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4" dir="rtl">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground ml-1">בחרו משימת כתיבה:</span>
            <select
              value={selectedTaskId}
              onChange={(e) => {
                setSelectedTaskId(e.target.value);
                setFeedback(null);
              }}
              className="h-8 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer max-w-[320px] truncate"
            >
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.category === "letter" ? "מכתב" : "פסקת דעה"}] {t.hebrewTitle} ({t.title})
                </option>
              ))}
            </select>
          </div>

          <Badge variant="secondary" className="text-xs">
            יעד: {currentTask.targetWords}
          </Badge>
        </div>

        {/* Two-Column Grid: Task Guidance & Connectors (Left) vs Writing Area & AI Feedback (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Instructions & Connector Bank */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border border-border shadow-xs">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold">
                  {currentTask.category === "letter" ? <Mail className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  <span>{currentTask.category === "letter" ? "כתיבת מכתב אישי" : "כתיבת פסקת דעה"}</span>
                </div>
                <CardTitle className="text-lg font-bold pt-1">{currentTask.hebrewTitle}</CardTitle>
                <CardDescription className="text-xs text-foreground/90 leading-relaxed font-sans" dir="ltr">
                  {currentTask.prompt}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-3.5 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1" dir="rtl">
                  <span className="font-bold text-foreground">הנחיות לכתיבה:</span>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentTask.hebrewInstructions}
                  </p>
                </div>

                <div className="space-y-1.5" dir="rtl">
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span>טיפים מנצחים:</span>
                  </span>
                  <ul className="space-y-1 text-muted-foreground list-disc pl-4 pr-1">
                    {currentTask.starterTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Connectors Palette */}
            <Card className="border border-primary/20 bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>מילות קישור (לחצו כדי להוסיף לטקסט):</span>
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-1">
                {MS_CONNECTORS.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground block text-right" dir="rtl">
                      {cat.category}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddConnector(item.text)}
                          className="px-2.5 py-1 rounded-md border border-border bg-muted/40 hover:bg-primary/10 hover:border-primary/30 text-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="font-semibold text-foreground">{item.text}</span>
                          <span className="text-[10px] text-muted-foreground">({item.heb})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Writing Pad & Feedback */}
          <div className="lg:col-span-7 space-y-4">
            {/* Word Count Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">ספירת מילים:</span>
                <span
                  className={`font-extrabold text-base ${
                    isWordCountGood ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                  }`}
                >
                  {wordCount}
                </span>
                <span className="text-muted-foreground">/ {currentTask.targetWords}</span>
                {isWordCountGood && (
                  <Badge variant="default" className="text-[10px] bg-emerald-600 text-white">
                    ✓ אורך מצוין
                  </Badge>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-7 text-xs gap-1 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "הועתק" : "העתק טקסט"}</span>
              </Button>
            </div>

            {/* Textarea */}
            <textarea
              rows={12}
              placeholder="Start typing your letter or opinion paragraph in English here..."
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              className="w-full rounded-xl border border-input bg-card p-4 text-sm md:text-base leading-relaxed font-sans shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />

            {/* Check Button */}
            <Button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="w-full h-11 text-sm font-semibold cursor-pointer gap-2"
            >
              <Send className="h-4 w-4" />
              <span>{isEvaluating ? "בודק את החיבור עם מורה AI..." : "בדיקת חיבור וקבלת משוב מעודד"}</span>
            </Button>

            {/* AI Feedback Box */}
            {feedback && (
              <div className="p-5 rounded-2xl border border-primary/30 bg-card space-y-4 shadow-sm animate-in fade-in" dir="rtl">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <span className="text-xs text-muted-foreground block">הערכת מורה AI:</span>
                    <h4 className="text-xl font-black text-foreground">{feedback.encouragement}</h4>
                  </div>
                  <Badge variant="default" className="text-sm px-3 py-1 font-bold">
                    ציון משוער: {feedback.score}
                  </Badge>
                </div>

                {/* Strengths */}
                {feedback.strengths.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>נקודות חוזק בחיבור שלך:</span>
                    </span>
                    <ul className="space-y-1 text-foreground/90 pl-5 pr-2 list-disc">
                      {feedback.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tips */}
                {feedback.tips.length > 0 && (
                  <div className="space-y-1.5 text-xs pt-1">
                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4 shrink-0" />
                      <span>הצעות לשיפור לפעם הבאה:</span>
                    </span>
                    <ul className="space-y-1 text-foreground/90 pl-5 pr-2 list-disc">
                      {feedback.tips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
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
