"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { TeacherAuthModal } from "@/components/auth/teacher-auth-modal";
import { StudentLoginModal } from "@/components/auth/student-login-modal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  BookA,
  PenTool,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  CheckCircle2,
  BrainCircuit,
  Printer,
  School,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  // Mini-demo interactive states for home page
  const [vocabCardFlipped, setVocabCardFlipped] = useState(false);
  const [demoSelectedOption, setDemoSelectedOption] = useState<number | null>(null);

  const modules = [
    {
      title: "Unseen Reading Engine",
      hebrewTitle: "אנסין והבנת הנקרא",
      description: "Authentic, calibrated reading comprehension texts with Bagrut-aligned questions, instant answer keys, and printable exam booklets.",
      icon: BookOpen,
      tag: "Modules A–G",
      badgeVariant: "default" as const,
      features: [
        "Advanced AI calibrated for Modules A through G (3, 4, 5 Points)",
        "Question sets: Multiple Choice, open-ended & sentence completion",
        "1-Click Printable PDF matching Israeli Ministry exam layout",
      ],
      href: "/unseen",
      accent: "from-blue-500/10 to-indigo-500/10 dark:from-blue-950/20 dark:to-indigo-950/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Vocabulary Trainer",
      hebrewTitle: "מאגר אוצר מילים (Bands)",
      description: "Master Ministry of Education Band I, II, and III vocabulary through interactive flashcards, Hebrew translation drills, and spaced repetition.",
      icon: BookA,
      tag: "Bands I, II, III",
      badgeVariant: "secondary" as const,
      features: [
        "Preloaded Core Band I, II, and III word lists with Hebrew definitions",
        "Interactive Speed Match & Contextual Fill-in-the-Blanks",
        "Custom wordlist assignments & student retention tracking",
      ],
      href: "/vocabulary",
      accent: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Writing Workshop",
      hebrewTitle: "סדנת כתיבה והערכת חיבורים",
      description: "Structured essay writing for Module C and Module G with real-time connectors guidance and official Ministry 4-criteria rubric feedback.",
      icon: PenTool,
      tag: "Rubric Feedback",
      badgeVariant: "outline" as const,
      features: [
        "Opinion essay & informal letter prompt library",
        "Interactive paragraph structure builder (Intro, Body, Conclusion)",
        "AI diagnostic rubric scoring (Content, Organization, Language, Vocab)",
      ],
      href: "/writing",
      accent: "from-purple-500/10 to-pink-500/10 dark:from-purple-950/20 dark:to-pink-950/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-foreground text-lg sm:text-xl block leading-tight">
                English Teacher Tools
              </span>
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <span>Shichva Education Suite</span>
                <span>&bull;</span>
                <span className="text-primary font-semibold">Bilingual & Bagrut Ready</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* User Session Banner (if logged in) */}
      {user && (
        <div className="bg-primary/5 border-b border-primary/15 py-2.5 px-4 sm:px-8">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-foreground">
                Logged in as <strong>{user.name}</strong> ({user.role === "teacher" ? "Teacher Admin" : "Student"})
              </span>
              {user.role === "teacher" && user.teacherCode && (
                <Badge variant="outline" className="text-[11px] font-mono bg-background">
                  Classroom Code: <strong>{user.teacherCode}</strong>
                </Badge>
              )}
              {user.role === "student" && user.teacherName && (
                <Badge variant="secondary" className="text-[11px]">
                  Assigned Teacher: {user.teacherName}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {user.role === "teacher" ? (
                <span className="text-muted-foreground">Students can join using your name or classroom code.</span>
              ) : (
                <span className="text-muted-foreground">Your work is synced with your teacher.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-12 md:py-16 space-y-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Dedicated Israeli Curriculum & CEFR Teaching Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Targeted English Mastery for Classrooms, Tutors & Students
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything your classroom needs in one cohesive workspace: high-caliber Unseen reading comprehension, Ministry Band I-III vocabulary, and rubric-guided writing evaluations.
          </p>

          {/* Dual Role Fast CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="gap-2 shadow-sm font-semibold cursor-pointer text-base px-6 h-12"
              onClick={() => {
                if (user) {
                  router.push("/unseen");
                } else {
                  setStudentModalOpen(true);
                }
              }}
            >
              <Users className="h-5 w-5" />
              <span>Student Classroom Access (כניסת תלמידים)</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 font-semibold cursor-pointer text-base px-6 h-12 border-primary/30 hover:bg-primary/5"
              onClick={() => {
                if (user) {
                  router.push("/unseen");
                } else {
                  setTeacherModalOpen(true);
                }
              }}
            >
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>Teacher / Admin Cockpit (כניסת מורים)</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>No email required for students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Ministry Bands I, II, III Preloaded</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Concurrent Classroom Scalability</span>
            </div>
          </div>
        </div>

        {/* The Three Pillars Section */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">The Three Pedagogical Pillars</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select any tool to start practicing or creating assignments immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Card
                  key={m.title}
                  className={`flex flex-col justify-between border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all duration-200 bg-gradient-to-b ${m.accent}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-xl bg-background shadow-xs ${m.iconColor}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant={m.badgeVariant} className="font-semibold text-xs">
                        {m.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl flex items-baseline justify-between">
                      <span>{m.title}</span>
                    </CardTitle>
                    <p className="text-xs font-medium text-muted-foreground">{m.hebrewTitle}</p>
                    <CardDescription className="text-sm pt-2 leading-relaxed text-muted-foreground">
                      {m.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="border-t border-border/50 pt-4 space-y-2.5">
                      {m.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-foreground/80">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-border/40">
                    <Link
                      href={m.href}
                      className={buttonVariants({
                        className: "w-full justify-between font-medium cursor-pointer shadow-xs",
                      })}
                    >
                      <span>Open {m.title}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Live Interactive Feature Showcase */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                <BrainCircuit className="h-4 w-4" />
                <span>Interactive Live Preview</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Experience the Tools in Action
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">
              Click any sample below to see how students and teachers interact with the suite.
            </span>
          </div>

          <Tabs defaultValue="unseen" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto sm:mx-0">
              <TabsTrigger value="unseen">1. Unseen Sample</TabsTrigger>
              <TabsTrigger value="vocab">2. Vocabulary Flip</TabsTrigger>
              <TabsTrigger value="writing">3. Writing Rubric</TabsTrigger>
            </TabsList>

            {/* Unseen Live Preview */}
            <TabsContent value="unseen" className="pt-4 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-3 p-4 rounded-xl bg-muted/40 border border-border/60">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-semibold">Module E (4-5 Points)</Badge>
                      <span className="text-xs text-muted-foreground">Paragraph 1 of 3</span>
                    </div>
                    <Badge variant="secondary" className="text-[11px] gap-1">
                      <Printer className="h-3 w-3" /> Printable Mode
                    </Badge>
                  </div>
                  <h4 className="font-bold text-base text-foreground">The Rise of Community Micro-Libraries</h4>
                  <p className="text-sm text-foreground/90 leading-relaxed font-sans">
                    <span className="font-semibold text-primary mr-1">[1]</span>
                    In recent years, small wooden boxes filled with free books have popped up on suburban sidewalks and street corners across the globe. Known as &quot;little free libraries,&quot; these grassroots initiatives operate on a simple yet profound premise: take a book, leave a book. What began as an individual tribute in 2009 has blossomed into an international literacy phenomenon with over 150,000 registered exchanges worldwide.
                  </p>
                </div>

                <div className="lg:col-span-5 space-y-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
                  <span className="text-xs font-semibold text-primary block">Sample Question 1 (7 Points)</span>
                  <p className="text-sm font-medium text-foreground">
                    What is the core rule that governs how little free libraries function?
                  </p>
                  <div className="space-y-2 pt-1">
                    {[
                      "Books must be returned within two weeks.",
                      "Visitors take a book and are encouraged to leave one.",
                      "Only registered members may borrow English literature.",
                      "A small donation is required for every hardback taken.",
                    ].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setDemoSelectedOption(i)}
                        className={`w-full text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                          demoSelectedOption === i
                            ? i === 1
                              ? "border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 font-semibold"
                              : "border-destructive bg-destructive/10 text-destructive"
                            : "border-border/60 hover:bg-background/80 text-foreground"
                        }`}
                      >
                        <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                  {demoSelectedOption !== null && (
                    <p className="text-xs text-muted-foreground pt-1">
                      {demoSelectedOption === 1 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          ✓ Correct! The text mentions &quot;take a book, leave a book&quot;.
                        </span>
                      ) : (
                        <span className="text-destructive font-semibold">
                          ✗ Re-read sentence 2 in paragraph [1].
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Vocabulary Flip Live Preview */}
            <TabsContent value="vocab" className="pt-4">
              <div className="max-w-md mx-auto text-center space-y-4">
                <p className="text-xs text-muted-foreground">
                  Click the flashcard to flip between English and Hebrew Ministry Band II/III definitions:
                </p>

                <div
                  onClick={() => setVocabCardFlipped(!vocabCardFlipped)}
                  className="h-48 w-full rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/5 to-muted/50 p-6 flex flex-col items-center justify-center cursor-pointer shadow-sm hover:scale-[1.02] transition-transform select-none"
                >
                  {!vocabCardFlipped ? (
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-[11px] mb-1">Band II &bull; Verb</Badge>
                      <h3 className="text-3xl font-extrabold text-foreground">Accomplish</h3>
                      <p className="text-xs text-muted-foreground italic">&quot;She worked hard to accomplish her goal.&quot;</p>
                      <span className="text-[11px] text-primary block mt-2 font-medium">Click to reveal Hebrew translation ↺</span>
                    </div>
                  ) : (
                    <div className="space-y-2" dir="rtl">
                      <Badge variant="secondary" className="text-[11px] mb-1">תרגום והגדרה</Badge>
                      <h3 className="text-3xl font-extrabold text-primary">להשיג, להשלים בהצלחה</h3>
                      <p className="text-xs text-muted-foreground">השלמת משימה או יעד לאחר מאמץ</p>
                      <span className="text-[11px] text-primary/80 block mt-2 font-medium">לחץ כדי להפוך חזרה ↺</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Link href="/vocabulary" className={buttonVariants({ size: "sm" })}>
                    Open Full Vocabulary Bank (Bands I, II, III)
                  </Link>
                </div>
              </div>
            </TabsContent>

            {/* Writing Rubric Live Preview */}
            <TabsContent value="writing" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                  { title: "1. Content & Task", score: "40 pts", desc: "Clarity of opinion, relevant supporting arguments, and addressing all prompt bullets." },
                  { title: "2. Organization", score: "20 pts", desc: "Paragraphing: introduction, reasons with examples, connectors, and conclusion." },
                  { title: "3. Language & Grammar", score: "20 pts", desc: "Accurate tenses, sentence structure variety, subject-verb agreement." },
                  { title: "4. Vocabulary", score: "20 pts", desc: "Rich usage of Band II & III vocabulary, correct collocations, accurate spelling." },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{item.title}</span>
                      <Badge variant="secondary" className="text-[10px]">{item.score}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="text-center pt-4">
                <Link href="/writing" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Launch Writing Workshop with Rubric Evaluation
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Class Concurrency & Reliability Info */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <BrainCircuit className="h-4 w-4" />
              <span>High-Capacity Classroom Architecture</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Built to Handle Full Classes Submitting Concurrently
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              When 30-40 students take an unseen or submit essays simultaneously during class, our intelligent Firestore caching and asynchronous evaluation engine prevent API throttles and keep tests running smoothly.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="default"
              onClick={() => {
                if (!user) setTeacherModalOpen(true);
                else router.push("/unseen");
              }}
              className="cursor-pointer gap-2 font-semibold"
            >
              <School className="h-4 w-4" />
              <span>{user ? "Go to Dashboard" : "Register as Teacher"}</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/20 py-8 text-center text-xs text-muted-foreground space-y-2">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">English Teacher Tools</span>
            <span>&bull;</span>
            <span>Shichva Education Suite</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/unseen" className="hover:text-foreground">Unseen Engine</Link>
            <Link href="/vocabulary" className="hover:text-foreground">Vocabulary Trainer</Link>
            <Link href="/writing" className="hover:text-foreground">Writing Workshop</Link>
          </div>

          <p className="text-[11px]">
            Connected with <span className="font-mono text-foreground">shichva.app</span> &bull; Israeli Bagrut & CEFR Curriculum
          </p>
        </div>
      </footer>

      {/* Modals */}
      <TeacherAuthModal open={teacherModalOpen} onOpenChange={setTeacherModalOpen} />
      <StudentLoginModal open={studentModalOpen} onOpenChange={setStudentModalOpen} />
    </div>
  );
}
