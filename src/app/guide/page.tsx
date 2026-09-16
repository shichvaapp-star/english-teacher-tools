"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  BookOpen,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  Search,
  BookA,
  PenTool,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Share2,
  Volume2,
  Eye,
  Sparkles,
} from "lucide-react";

export default function TeacherGuidePage() {
  const [copiedStudentMsg, setCopiedStudentMsg] = useState(false);

  const studentInstructionEnglish = `👋 Hello Students & Parents!
Here is how to access our English Practice classroom platform:

1. Go to our school English website: [Insert App Link Here]
2. Click "Student Login" in the top-right corner.
3. Select my name ([Teacher Name]) from the dropdown list OR enter our Class Code: [TEACHER-CODE].
4. Type your full name and choose a 4-digit secret PIN (remember your PIN to log in next time!).
5. You're ready to practice Unseen reading, Vocabulary games, and Writing tasks!

*No email address or password registration required.* Happy learning! 🚀`;

  const studentInstructionHebrew = `👋 שלום לתלמידים ולהורים!
להלן הוראות כניסה קלות למרחב התרגול באנגלית:

1. היכנסו לקישור האתר: [קישור לאתר כאן]
2. לחצו על "Student Login" (כניסת תלמידים) בפינה העליונה.
3. בחרו את שם המורה מהרשימה או הזינו את קוד הכיתה: [קוד כיתה].
4. כתבו את שמכם המלא ובחרו קוד סודי בן 4 ספרות (זכרו אותו לכניסות הבאות).
5. זהו! אתם בפנים - מוכנים לתרגול אנסין, אוצר מילים ומשימות כתיבה.

*אין צורך בכתובת אימייל או בהרשמה מסובכת.* בהצלחה! 🚀`;

  const [langTab, setLangTab] = useState<"en" | "he">("en");

  const handleCopyStudentInstructions = () => {
    const textToCopy = langTab === "en" ? studentInstructionEnglish : studentInstructionHebrew;
    navigator.clipboard.writeText(textToCopy);
    setCopiedStudentMsg(true);
    setTimeout(() => setCopiedStudentMsg(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Top Navigation Bar (Hidden on print) */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground p-1.5 px-2.5 rounded-lg border border-border/70 hover:bg-muted/40 transition shadow-2xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight">Teacher & Classroom Guide</h1>
                <p className="text-[10px] text-muted-foreground hidden sm:block">
                  Step-by-step educator walkthrough & student instructions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold cursor-pointer border-border/80 shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5 text-primary" />
              <span>Print / Save PDF</span>
            </Button>
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Quick Jump Anchor Bar (Hidden on print) */}
      <nav aria-label="Guide Sections" className="border-b border-border/40 bg-muted/20 py-2.5 px-4 sm:px-8 print:hidden text-xs overflow-x-auto">
        <div className="container mx-auto flex items-center gap-2 whitespace-nowrap">
          <span className="text-muted-foreground font-semibold flex items-center gap-1 mr-1">
            Quick Jump:
          </span>
          <a
            href="#teacher-login"
            className="px-2.5 py-1 rounded-md hover:bg-card border border-transparent hover:border-border/60 transition text-muted-foreground hover:text-foreground font-medium"
          >
            1. Teacher Login & Class Code
          </a>
          <span className="text-border">&bull;</span>
          <a
            href="#student-login"
            className="px-2.5 py-1 rounded-md hover:bg-card border border-transparent hover:border-border/60 transition text-muted-foreground hover:text-foreground font-medium"
          >
            2. Student Onboarding
          </a>
          <span className="text-border">&bull;</span>
          <a
            href="#unseen"
            className="px-2.5 py-1 rounded-md hover:bg-card border border-transparent hover:border-border/60 transition text-muted-foreground hover:text-foreground font-medium"
          >
            3. Unseen Practice
          </a>
          <span className="text-border">&bull;</span>
          <a
            href="#vocabulary"
            className="px-2.5 py-1 rounded-md hover:bg-card border border-transparent hover:border-border/60 transition text-muted-foreground hover:text-foreground font-medium"
          >
            4. Vocabulary Trainer
          </a>
          <span className="text-border">&bull;</span>
          <a
            href="#writing"
            className="px-2.5 py-1 rounded-md hover:bg-card border border-transparent hover:border-border/60 transition text-muted-foreground hover:text-foreground font-medium"
          >
            5. Writing Workshop
          </a>
          <span className="text-border">&bull;</span>
          <a
            href="#tips"
            className="px-2.5 py-1 rounded-md hover:bg-card border border-transparent hover:border-border/60 transition text-muted-foreground hover:text-foreground font-medium"
          >
            6. Classroom Tips
          </a>
        </div>
      </nav>

      {/* Main Guide Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-8 space-y-12 max-w-5xl print:p-0 print:m-0 print:space-y-6">
        {/* Printable Header Banner */}
        <section className="text-center sm:text-left border-b border-border/60 pb-6 print:pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Educator Reference & User Guide</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                English Practice Platform Guide
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                A simple walkthrough for teachers: setting up your account, onboarding students without email hassles, and maximizing the Unseen, Vocabulary, and Writing modules.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end text-xs text-muted-foreground print:flex">
              <span className="font-semibold text-foreground">Ben Gurion Middle School</span>
              <span>Pedagogical Toolkit &bull; 2026 Edition</span>
            </div>
          </div>
        </section>

        {/* Platform Overview Hero Image */}
        <section className="space-y-3">
          <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-xs">
            <div className="p-2.5 bg-muted/40 border-b border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-primary" />
                Main Dashboard Overview
              </span>
              <span className="text-[11px]">Top bar contains Theme Toggle, Student Login, and Teacher Portal</span>
            </div>
            <div className="relative w-full aspect-16/9 max-h-[380px] bg-muted/20">
              <img
                src="/guide/hero-overview.png"
                alt="English Teacher Tools Main Homepage Overview"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </section>

        {/* SECTION 1: Teacher Login & Class Code */}
        <section id="teacher-login" className="space-y-6 scroll-mt-20 break-inside-avoid">
          <div className="flex items-center gap-2.5 border-b border-border/50 pb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
              1
            </div>
            <h2 className="text-xl font-bold tracking-tight">Teacher Account & Your Class Code</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4 text-sm">
              <p className="text-muted-foreground leading-relaxed">
                As a teacher, having an account gives you administrative oversight: reviewing student writing submissions, managing your class list, and viewing student activity.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border/80 bg-card">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    A
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Click "Teacher Portal"</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Located in the top-right corner of any page. If it is your first time, choose the <strong>"Create Teacher Account"</strong> tab.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-border/80 bg-card">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    B
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Register with Name & Email</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Enter your full name, school email, and choose a password. Your school name (e.g. Ben Gurion Middle School) helps identify you to your students.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-border/80 bg-card">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    C
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Find Your Unique "Class Code"</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Once logged in, click your name in the top right. Inside your profile dropdown, you will see your generated <strong>Class Code</strong> (e.g., <code className="px-1.5 py-0.5 bg-muted rounded font-mono font-bold text-primary">COHEN-26</code>). Students can use this code to join your class!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-xs">
                <div className="p-2 bg-muted/40 border-b border-border/60 text-xs font-medium text-muted-foreground">
                  Teacher Portal & Account Registration
                </div>
                <img
                  src="/guide/teacher-auth.png"
                  alt="Teacher Login and Registration Modal"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Student Login (Zero Friction) */}
        <section id="student-login" className="space-y-6 scroll-mt-20 break-inside-avoid">
          <div className="flex items-center gap-2.5 border-b border-border/50 pb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
              2
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Student Onboarding (No Email Needed!)</h2>
              <p className="text-xs text-muted-foreground">
                Designed to eliminate classroom onboarding friction: no forgotten passwords or email verification delays.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  Why This System is Classroom-Friendly:
                </h3>
                <ul className="list-disc list-inside text-xs text-emerald-900/80 dark:text-emerald-200/80 space-y-1">
                  <li>Middle school students often forget their email passwords or school SSO logins.</li>
                  <li>Here, students simply select their teacher and use a <strong>4-digit PIN</strong> of their choice.</li>
                  <li>Browser memory automatically remembers their session for subsequent visits on the same computer or tablet.</li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <h3 className="font-semibold text-foreground text-sm">How Students Connect:</h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Click "Student Login"</strong> in the top header or on the homepage banner.
                  </li>
                  <li>
                    <strong className="text-foreground">Select Teacher / Enter Code</strong>: The student picks your name from the dropdown or types your Class Code.
                  </li>
                  <li>
                    <strong className="text-foreground">Enter Name & 4-Digit PIN</strong>: The student writes their full name and enters any memorable 4-digit PIN (e.g. 1234, 7788).
                  </li>
                  <li>
                    <strong className="text-foreground">Enter Classroom</strong>: Their reading progress and submitted essays are linked directly to your roster.
                  </li>
                </ol>
              </div>

              {/* Ready-to-Send Student Handout Box */}
              <Card className="border-primary/25 bg-card/70 shadow-xs print:border-black">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                      <Share2 className="h-4 w-4 text-primary" />
                      Ready-to-Send Message for Students & Parents
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setLangTab("en")}
                        className={`px-2 py-0.5 text-[11px] rounded font-medium transition cursor-pointer ${
                          langTab === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setLangTab("he")}
                        className={`px-2 py-0.5 text-[11px] rounded font-medium transition cursor-pointer ${
                          langTab === "he" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        עברית
                      </button>
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    Copy and paste directly into WhatsApp, Google Classroom, or Mashov/Webtop:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div
                    className="p-3 bg-muted/40 rounded-lg text-xs font-mono whitespace-pre-wrap leading-relaxed border border-border/50 text-foreground"
                    dir={langTab === "he" ? "rtl" : "ltr"}
                  >
                    {langTab === "en" ? studentInstructionEnglish : studentInstructionHebrew}
                  </div>
                  <Button
                    onClick={handleCopyStudentInstructions}
                    size="sm"
                    className="w-full gap-1.5 text-xs font-bold cursor-pointer"
                  >
                    {copiedStudentMsg ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-300" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Message to Clipboard</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-xs">
                <div className="p-2 bg-muted/40 border-b border-border/60 text-xs font-medium text-muted-foreground">
                  Student Login Modal (No Email)
                </div>
                <img
                  src="/guide/student-auth.png"
                  alt="Student Login Interface"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Unseen Practice */}
        <section id="unseen" className="space-y-6 scroll-mt-20 break-inside-avoid">
          <div className="flex items-center gap-2.5 border-b border-border/50 pb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-white font-bold text-xs">
              3
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Unseen Practice & Reading Comprehension</h2>
              <p className="text-xs text-muted-foreground">
                Differentiated texts with click-to-translate assistance and 10 Bagrut-style questions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-xs">
              <div className="p-2 bg-muted/40 border-b border-border/60 text-xs font-medium text-muted-foreground flex justify-between">
                <span>Stage 1: Level & Mode Configuration</span>
                <span className="text-[11px] text-sky-500 font-semibold">Setup View</span>
              </div>
              <img
                src="/guide/unseen-practice.png"
                alt="Unseen Level and Mode Setup"
                className="w-full object-cover"
              />
            </div>

            <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-xs">
              <div className="p-2 bg-muted/40 border-b border-border/60 text-xs font-medium text-muted-foreground flex justify-between">
                <span>Stage 2: Active Reading & 10 Questions</span>
                <span className="text-[11px] text-sky-500 font-semibold">Exercise View</span>
              </div>
              <img
                src="/guide/unseen-exercise.png"
                alt="Active Reading Passage and Questions"
                className="w-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-border/80 bg-card space-y-1.5">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <span className="text-sky-500">🎯</span> 3 Differentiated Levels
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Level 1:</strong> Short sentences, high-frequency vocabulary for emerging readers.<br />
                <strong>Level 2:</strong> Grade-level descriptive texts matching Israeli middle school curriculum.<br />
                <strong>Level 3:</strong> Advanced passages for fluent & native speakers.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/80 bg-card space-y-1.5">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <span className="text-sky-500">💡</span> Instant Click-to-Translate
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Students can click <em>any word</em> in the reading passage to see its immediate Hebrew translation and part of speech, and save it to their <strong>Personal Wordbook</strong> with one tap.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/80 bg-card space-y-1.5">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <span className="text-sky-500">✨</span> AI Topic Generator
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Teachers or students can switch from the library to the <strong>AI Generator</strong> to generate custom passages about student passions (Gaming, Space, Football, Animals) with matched questions.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: Vocabulary Trainer */}
        <section id="vocabulary" className="space-y-6 scroll-mt-20 break-inside-avoid">
          <div className="flex items-center gap-2.5 border-b border-border/50 pb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
              4
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Vocabulary Trainer & Worksheets</h2>
              <p className="text-xs text-muted-foreground">
                Ministry Band word lists combined with personal unseen vocabulary for memorization and paper drills.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-xs">
                <div className="p-2 bg-muted/40 border-b border-border/60 text-xs font-medium text-muted-foreground flex justify-between">
                  <span>Interactive Flashcards with Audio Speech</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Vocab View</span>
                </div>
                <img
                  src="/guide/vocab-trainer.png"
                  alt="Vocabulary Flashcards and Study Modes"
                  className="w-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-border/80 bg-card space-y-1">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Volume2 className="h-4 w-4 text-emerald-600" />
                  Flashcards & Audio Pronunciation
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Cards flip with one click to reveal Hebrew meaning and contextual example sentences. The audio button plays natural English pronunciation.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/80 bg-card space-y-1">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  Speed Match & Quiz Modes
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gamified matching pairs against the clock, plus multiple-choice quizzes that test definitions, parts of speech, and sentence completion.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/80 bg-card space-y-1">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Printer className="h-4 w-4 text-emerald-600" />
                  One-Click Printable Worksheets
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Need an offline pop-quiz for class? Use the <strong>Print</strong> button in the Dictionary tab to generate an A4 paper drill with word banks and an answer key for grading.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Writing Workshop */}
        <section id="writing" className="space-y-6 scroll-mt-20 break-inside-avoid">
          <div className="flex items-center gap-2.5 border-b border-border/50 pb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs">
              5
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Writing Workshop & Submission Review</h2>
              <p className="text-xs text-muted-foreground">
                24 prompts (letters, opinion paragraphs, stories) with live linking words, AI feedback, and teacher submissions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-xs">
                <div className="p-2 bg-muted/40 border-b border-border/60 text-xs font-medium text-muted-foreground flex justify-between">
                  <span>Writing Editor, Word Monitor & Linking Words Bank</span>
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">Writing View</span>
                </div>
                <img
                  src="/guide/writing-workshop.png"
                  alt="Writing Workshop Editor and Linking Words Bank"
                  className="w-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-border/80 bg-card space-y-1">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <PenTool className="h-4 w-4 text-purple-600" />
                  Target Word Count & Prompts
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Structured specifically for 50–80 words (middle school target length). Prompts include personal letters, reviews, opinion paragraphs, and creative narratives.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/80 bg-card space-y-1">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Interactive Connectors (Linking Words)
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Clicking connectors (e.g. <em>First of all, In addition, However, Therefore</em>) inserts them directly into the student's text, reinforcing cohesive essay structure.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/80 bg-card space-y-1">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  Submission Receipts & Review
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  When students submit in <strong>"Submit to Teacher"</strong> mode, they receive a verified Receipt Code (e.g. <code className="px-1 py-0.2 bg-muted rounded font-mono font-bold">WR-8492</code>). Teachers can view all submitted essays in the "Previous Submissions" drawer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Classroom Tips & Cheat Sheet */}
        <section id="tips" className="space-y-4 scroll-mt-20 border-t border-border/60 pt-6 break-inside-avoid">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight">Teacher Pro-Tips & Best Practices</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
              <span className="font-bold text-foreground block text-sm">🌓 Comfort Reading Mode</span>
              <p className="text-muted-foreground leading-relaxed">
                Use the toggle in the top bar to switch between clean dark mode (reduces eye fatigue during long reading) and soft light mode for smartboard projector displays.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
              <span className="font-bold text-foreground block text-sm">🖨️ Clean Paper Printing</span>
              <p className="text-muted-foreground leading-relaxed">
                Pressing <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px]">Ctrl+P</kbd> or clicking "Print" removes all site headers and navigation, giving you pristine printable reading sheets and worksheets.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
              <span className="font-bold text-foreground block text-sm">🎲 Random Prompt Generator</span>
              <p className="text-muted-foreground leading-relaxed">
                In the Writing Workshop, click the 🎲 "Surprise Me with a Random Prompt" button for spontaneous 10-minute warm-up writing drills at the beginning of class.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
              <span className="font-bold text-foreground block text-sm">🔄 Switch View Anytime</span>
              <p className="text-muted-foreground leading-relaxed">
                You can switch between Teacher and Student view anytime from the user profile dropdown to preview exactly what your students see on their screens.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground print:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>English Practice &bull; Ben Gurion Middle School Pedagogical Toolkit</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/unseen" className="hover:text-foreground transition">Unseen</Link>
            <span>&bull;</span>
            <Link href="/vocabulary" className="hover:text-foreground transition">Vocabulary</Link>
            <span>&bull;</span>
            <Link href="/writing" className="hover:text-foreground transition">Writing</Link>
            <span>&bull;</span>
            <Link href="/" className="font-semibold text-primary hover:underline">Return to Home &rarr;</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
