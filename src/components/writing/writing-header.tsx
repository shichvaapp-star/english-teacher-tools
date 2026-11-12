"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import { Button } from "@/components/ui/button";
import { loadSavedWords } from "@/lib/vocab-storage";
import {
  PenTool,
  ArrowLeft,
  ArrowRight,
  Check,
  History,
  Save,
  Clock,
  BookMarked,
  Sliders,
} from "lucide-react";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";

export function WritingHeader({ c }: { c: WritingPracticeController }) {
  const {
    currentTask,
    draftStatus,
    handleBackToSettings,
    handleOpenHistory,
    handleSaveAndExit,
    handleStartWriting,
    hasAiKeys,
    lastSavedTimeText,
    savedWords,
    selectedLevel,
    setDrawerOpen,
    setSavedWords,
    setShowAiSettingsModal,
    stage,
    user,
  } = c;
  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {stage === "writing" ? (
              <HeaderTooltip label="חזרה להגדרות המשימה">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleBackToSettings}
                  className="cursor-pointer h-9 w-9 border-border/70 shrink-0"
                  aria-label="שינוי הגדרות"
                >
                  <Sliders className="h-4 w-4 text-primary" />
                </Button>
              </HeaderTooltip>
            ) : (
              <HeaderTooltip label="חזרה לדף הראשי">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition-colors shrink-0"
                  aria-label="ראשי"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </HeaderTooltip>
            )}

            <div className="h-4 w-[1px] bg-border hidden sm:block" />

            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
                <PenTool className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs sm:text-sm font-medium tracking-tight text-foreground truncate font-sans">
                    Writing Practice
                  </h1>
                  <span className="text-[10px] text-muted-foreground font-hebrew hidden sm:inline">
                    • סדנת כתיבה
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate hidden sm:block font-hebrew">
                  {stage === "settings"
                    ? "הגדרות סדנה ובחירת משימה"
                    : `${currentTask.hebrewTitle} • ${selectedLevel}`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {stage === "writing" && (
              <>
                {draftStatus === "saving" ? (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-hebrew">
                    <Clock className="h-3 w-3 animate-spin text-amber-500" />
                    <span className="hidden sm:inline">שומר טיוטה...</span>
                  </span>
                ) : draftStatus === "saved" ? (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-hebrew">
                    <Check className="h-3 w-3" />
                    <span className="hidden sm:inline">נשמר {lastSavedTimeText || ""}</span>
                  </span>
                ) : null}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAndExit}
                  className="h-8 text-xs font-bold gap-1 cursor-pointer border-border/80 font-hebrew"
                  title="שמור טיוטה וחזור לאזור התלמיד"
                >
                  <Save className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">שמור וצא</span>
                </Button>
              </>
            )}

            {stage === "settings" && (
              <HeaderTooltip label="התחלת כתיבה">
                <Button
                  size="icon"
                  onClick={handleStartWriting}
                  className="cursor-pointer shadow-xs h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                  aria-label="התחל לכתוב"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </HeaderTooltip>
            )}

            {/* Vocab Notebook Button */}
            <HeaderTooltip label="פנקס מילים">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSavedWords(loadSavedWords(user?.id));
                  setDrawerOpen(true);
                }}
                className="h-9 w-9 cursor-pointer border-border/80 relative shrink-0"
                aria-label="פנקס מילים"
              >
                <BookMarked className="h-4 w-4 text-primary" />
                {savedWords.length > 0 && (
                  <span className="absolute -top-1 -right-1 px-1 min-w-4 h-4 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-[10px] font-bold leading-none">
                    {savedWords.length}
                  </span>
                )}
              </Button>
            </HeaderTooltip>

            {/* AI Settings Button */}
            <HeaderTooltip label="הגדרות מפתחות AI">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAiSettingsModal(true)}
                className="h-9 w-9 cursor-pointer border-border/80 relative shrink-0"
                aria-label="הגדרות AI"
              >
                <Sliders className="h-4 w-4 text-primary" />
                {hasAiKeys && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="AI מחובר" />
                )}
              </Button>
            </HeaderTooltip>

            <HeaderTooltip label="הצג הגשות קודמות">
              <Button
                variant="outline"
                size="icon"
                onClick={handleOpenHistory}
                className="h-9 w-9 cursor-pointer border-border/80 shrink-0"
                aria-label="הגשות קודמות"
              >
                <History className="h-4 w-4 text-muted-foreground" />
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
