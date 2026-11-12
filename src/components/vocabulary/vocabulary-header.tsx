"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import { Button } from "@/components/ui/button";
import {
  BookA,
  ArrowLeft,
  ArrowRight,
  Plus,
  Check,
  Send,
  Save,
  Clock,
} from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularyHeader({ c }: { c: VocabularyPracticeController }) {
  const {
    activeAssignment,
    cardIndex,
    draftStatus,
    handleSaveAndExit,
    lastSavedTimeText,
    masteredIds,
    quizIndex,
    returnToUnseen,
    setFormError,
    setShowAddModal,
    setTurnInModalOpen,
  } = c;
  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <HeaderTooltip label="חזרה לדף הראשי">
              <Link
                href="/"
                className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition-colors shrink-0"
                aria-label="ראשי"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </HeaderTooltip>
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <BookA className="h-4 w-4" />
              </div>
              <span className="font-bold text-xs sm:text-base truncate">
                <span>בנק מילים אישי ואימון אוצר מילים</span>
                <span className="hidden sm:inline"> &bull; חטיבת ביניים בן גוריון</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {returnToUnseen && (
              <Link
                href="/unseen?resumeFromVocab=1"
                className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0 font-hebrew"
                title={
                  returnToUnseen.hebrewTitle || returnToUnseen.storyTitle
                    ? `חזרה לתרגול האנסין: ${returnToUnseen.hebrewTitle || returnToUnseen.storyTitle}`
                    : "חזרה לתרגול האנסין שהיית בו"
                }
                dir="rtl"
              >
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                <span>חזרה לאנסין</span>
              </Link>
            )}

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

            {(cardIndex > 0 || masteredIds.size > 0 || quizIndex > 0) && (
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
            )}

            {activeAssignment && (
              <Button
                type="button"
                size="sm"
                onClick={() => setTurnInModalOpen(true)}
                className="h-9 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-1.5 shadow-xs shrink-0 animate-pulse"
                dir="rtl"
              >
                <Send className="h-3.5 w-3.5" />
                <span>הגש למורה</span>
              </Button>
            )}

            {/* Quick Add Word Button in Navbar */}
            <HeaderTooltip label="הוספת מילה חדשה לפנקס">
              <Button
                onClick={() => {
                  setShowAddModal(true);
                  setFormError(null);
                }}
                size="icon"
                className="h-9 w-9 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0"
                aria-label="הוספת מילה"
              >
                <Plus className="h-4 w-4" />
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
