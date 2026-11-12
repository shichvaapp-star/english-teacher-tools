"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MessageSquare,
  BookMarked,
  Check,
  Sliders,
  Save,
  Clock,
} from "lucide-react";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";

export function ConversationHeader({ c }: { c: ConversationPracticeController }) {
  const {
    currentScenario,
    dialoguePlayer,
    draftStatus,
    handleSaveAndExit,
    lastSavedTimeText,
    savedWords,
    setShowVocabDrawer,
    setStage,
    stage,
  } = c;
  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {stage === "exercise" ? (
              <HeaderTooltip label="שינוי הגדרות / בחירת שיחה אחרת">
                <button
                  type="button"
                  onClick={() => {
                    dialoguePlayer.stop();
                    setStage("settings");
                  }}
                  className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition cursor-pointer shrink-0"
                  aria-label="הגדרות"
                >
                  <Sliders className="h-4 w-4" />
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

            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs sm:text-sm font-medium tracking-tight text-foreground truncate font-sans">
                    Conversation Practice
                  </h1>
                  <span className="text-2xs text-muted-foreground hidden sm:inline">
                    • שיחות מהחיים
                  </span>
                </div>
                <p className="text-2xs text-muted-foreground truncate hidden sm:block">
                  {stage === "settings"
                    ? "בחירת תרחיש שיחה מהחיים האמיתיים"
                    : `${currentScenario.title} • 10 שאלות`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {stage === "exercise" && (
              <>
                {draftStatus === "saving" ? (
                  <span className="text-2xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 animate-spin text-amber-500" />
                    <span className="hidden sm:inline">שומר טיוטה...</span>
                  </span>
                ) : draftStatus === "saved" ? (
                  <span className="text-2xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span className="hidden sm:inline">נשמר {lastSavedTimeText || ""}</span>
                  </span>
                ) : null}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAndExit}
                  className="h-8 text-xs font-bold gap-1 cursor-pointer border-border/80"
                >
                  <Save className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">שמור וצא</span>
                </Button>
              </>
            )}

            <HeaderTooltip label="פנקס מילים אישי">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowVocabDrawer(true)}
                className="relative h-9 w-9 cursor-pointer"
                aria-label="פנקס מילים"
              >
                <BookMarked className="h-4 w-4 text-primary" />
                {savedWords.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-primary text-primary-foreground text-3xs font-bold flex items-center justify-center">
                    {savedWords.length}
                  </span>
                )}
              </Button>
            </HeaderTooltip>

            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>
    </>
  );
}
