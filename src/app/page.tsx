"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { BookOpen, BookA, PenTool, Sparkles, ArrowRight, GraduationCap } from "lucide-react";

export default function Home() {
  const modules = [
    {
      title: "Unseen Practice",
      description: "Reading comprehension training with graded texts, comprehension questions, and instant answer keys.",
      icon: BookOpen,
      tag: "Reading",
      badgeVariant: "default" as const,
      features: ["Multi-level texts (A2 to C1 / Modules A-G)", "Question generation & parsing", "Printable student worksheets"],
      href: "/unseen",
    },
    {
      title: "Vocabulary Trainer",
      description: "Interactive word bank, Band I/II/III mastery drills, and flashcard quizzes.",
      icon: BookA,
      tag: "Vocabulary",
      badgeVariant: "secondary" as const,
      features: ["Ministry Band I, II, III wordlists", "Contextual fill-in-the-blanks", "Spaced repetition & quick quizzes"],
      href: "/vocabulary",
    },
    {
      title: "Writing Workshop",
      description: "Writing prompts, structured outlines, essay feedback, and rubric-based evaluations.",
      icon: PenTool,
      tag: "Writing",
      badgeVariant: "outline" as const,
      features: ["Opinion & informal essay prompts", "Rubric scoring (Content, Vocab, Grammar)", "Automated teacher feedback helpers"],
      href: "/writing",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-foreground text-lg">English Teacher Tools</span>
              <span className="ml-2 text-xs text-muted-foreground hidden sm:inline-block">Pedagogical Suite</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-12 md:py-16">
        <div className="max-w-3xl mb-12 space-y-4">
          <Badge variant="outline" className="gap-1.5 py-1 px-3 border-primary/30 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Standalone Teaching Environment
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Targeted English Mastery for Classrooms & Tutors
          </h1>
          <p className="text-lg text-muted-foreground">
            Focused exclusively on the three critical language learning pillars: Unseen comprehension, targeted vocabulary acquisition, and guided writing.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.title} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant={m.badgeVariant}>{m.tag}</Badge>
                  </div>
                  <CardTitle className="text-xl">{m.title}</CardTitle>
                  <CardDescription className="text-sm">{m.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {m.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-2">
                  <Link
                    href={m.href}
                    className={buttonVariants({ className: "w-full justify-between cursor-pointer" })}
                  >
                    <span>Open {m.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>English Teacher Tools &bull; Next.js 16 &bull; Tailwind CSS &bull; shadcn/ui</p>
      </footer>
    </div>
  );
}
