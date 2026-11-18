"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpenCheck, CircleHelp, Key } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import { Button } from "@/components/ui/button";
import type { GrammarPracticeController } from "@/components/grammar/use-grammar-practice";

export function GrammarHeader({ c }: { c: GrammarPracticeController }) {
  const inPractice = c.screen !== "topics" && c.topic;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
      <div className="container mx-auto flex h-14 items-center justify-between px-3 sm:px-8 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {inPractice ? (
            <HeaderTooltip label="חזרה לנושאים">
              <button
                type="button"
                onClick={c.backToTopics}
                className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition-colors shrink-0 cursor-pointer"
                aria-label="נושאים"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            </HeaderTooltip>
          ) : (
            <HeaderTooltip label="חזרה לדף הראשי">
              <Link
                href="/"
                className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition-colors shrink-0"
                aria-label="ראשי"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </HeaderTooltip>
          )}
          <div className="p-1.5 rounded-md bg-type-grammar/10 text-type-grammar shrink-0">
            <BookOpenCheck className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm sm:text-base truncate">
            {inPractice ? (c.assignment ? c.assignment.title : c.topic?.title) : "Grammar"}
            <span className="text-muted-foreground font-normal font-hebrew">
              {" "}· {inPractice ? (c.assignment ? c.assignment.hebrewTitle : c.topic?.titleHe) : "דקדוק"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {inPractice && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => c.setRuleOpen(true)}
              className="gap-1.5 font-bold cursor-pointer font-hebrew"
            >
              <CircleHelp className="h-4 w-4 text-type-grammar" />
              <span>כלל</span>
            </Button>
          )}
          {c.isTeacher && (
            <HeaderTooltip label="מפתחות AI">
              <button
                type="button"
                onClick={() => c.setAiSettingsOpen(true)}
                className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition-colors cursor-pointer"
                aria-label="מפתחות AI"
              >
                <Key className="h-4 w-4" />
              </button>
            </HeaderTooltip>
          )}
          <ThemeToggle />
          <div className="h-4 w-px bg-border hidden sm:block" />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
