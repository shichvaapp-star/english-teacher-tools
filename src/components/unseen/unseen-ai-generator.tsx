"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Key,
  AlertCircle,
} from "lucide-react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenAiGenerator({ c }: { c: UnseenPracticeController }) {
  const {
    SUGGESTED_TOPICS,
    aiNotice,
    aiNoticeType,
    aiTopicInput,
    currentStory,
    handleGenerateAiStory,
    handleStartExercise,
    isGeneratingAi,
    setAiTopicInput,
    setShowAiSettingsModal,
    storySourceTab,
  } = c;
  return (
    <>
      {/* AI Generator Tab */}
      {storySourceTab === "ai_generator" && (
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Input
              type="text"
              placeholder="נושא לקטע קריאה (למשל: ספורט, חלל, רובוטים...)"
              value={aiTopicInput}
              onChange={(e) => setAiTopicInput(e.target.value)}
              className="text-xs h-9 text-right rtl font-hebrew"
              disabled={isGeneratingAi}
            />
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Button
                onClick={() => handleGenerateAiStory()}
                disabled={isGeneratingAi || !aiTopicInput.trim()}
                size="sm"
                className="flex-1 sm:flex-none shrink-0 gap-1.5 cursor-pointer text-xs h-9 px-4 font-normal shadow-2xs font-hebrew"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isGeneratingAi ? "יוצר קטע..." : "צור קטע קריאה"}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAiSettingsModal(true)}
                className="h-9 px-2.5 cursor-pointer shrink-0 gap-1 text-xs"
                title="הגדרת מפתחות AI"
              >
                <Key className="h-3.5 w-3.5 text-primary" />
              </Button>
            </div>
          </div>

          {/* Quick Chips */}
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_TOPICS.map((t) => (
              <button
                key={t.label}
                type="button"
                disabled={isGeneratingAi}
                onClick={() => {
                  setAiTopicInput(t.value);
                  handleGenerateAiStory(t.value);
                }}
                className="text-xs px-2.5 py-1 rounded-full border border-border/80 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 transition cursor-pointer font-hebrew"
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* AI Notice Banner */}
          {aiNotice && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                aiNoticeType === "success"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-800 dark:text-amber-200 border border-amber-500/30"
              }`}
            >
              {aiNoticeType === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              )}
              <div className="flex-1 text-right rtl leading-relaxed font-hebrew">
                <span>{aiNotice}</span>
                {aiNoticeType === "error" && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAiSettingsModal(true)}
                      className="h-7 text-[11px] px-2.5 cursor-pointer gap-1"
                    >
                      <Key className="h-3 w-3" />
                      <span>פתח הגדרות מפתחות AI</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Generated AI Story Preview Card */}
          {currentStory.id.startsWith("ai-story") && (
            <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-2.5 text-right rtl animate-in fade-in-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[11px] font-normal font-sans">
                    AI Story • {currentStory.level}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  onClick={handleStartExercise}
                  className="cursor-pointer gap-1.5 font-normal shadow-2xs text-xs h-8 px-4 font-hebrew"
                >
                  <span>התחלת תרגול</span>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-foreground ltr text-left font-sans">{currentStory.title}</h3>
                <p className="text-xs text-muted-foreground font-hebrew">{currentStory.hebrewTitle}</p>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 ltr text-left leading-relaxed font-sans">
                {currentStory.paragraphs[0]}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
