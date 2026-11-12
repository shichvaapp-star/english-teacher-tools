"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Sparkles,
  Mail,
  FileText,
  Dice5,
  GraduationCap,
  X,
  Compass,
  Target,
  FileCheck,
} from "lucide-react";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";

export function WritingSettingsStage({ c }: { c: WritingPracticeController }) {
  const {
    SUGGESTED_TOPICS,
    activeMode,
    aiNotice,
    assignedNotice,
    currentTask,
    customTopicInput,
    filteredTasks,
    handleGenerateAiTask,
    handleLevelSelect,
    handleRollRandom,
    handleStartWriting,
    isGeneratingAi,
    isRolling,
    randomNotice,
    selectedCategory,
    selectedLevel,
    selectedTaskId,
    setActiveMode,
    setAssignedNotice,
    setCustomTopicInput,
    setRandomNotice,
    setSelectedCategory,
    setSelectedTaskId,
    setTopicSourceTab,
    stage,
    topicSourceTab,
  } = c;
  return (
    <>
      {/* =========================================================================
          STAGE 1: SETTINGS / SETUP VIEW
          ========================================================================= */}
      {stage === "settings" && (
        <main className="container mx-auto flex-1 px-3 sm:px-8 py-4 sm:py-6 max-w-4xl space-y-4 sm:space-y-5 print:hidden">
          {/* Teacher Assignment Notification Banner */}
          {assignedNotice && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between gap-3 text-xs text-purple-900 dark:text-purple-200" dir="rtl">
              <div className="flex items-center gap-2 font-medium font-hebrew">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>{assignedNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setAssignedNotice(null)}
                className="text-purple-600 hover:text-purple-800 dark:hover:text-purple-100 p-1 cursor-pointer rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Random notice banner if generated */}
          {randomNotice && (
            <div
              className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-200 text-xs flex items-center justify-between animate-in fade-in"
              dir="rtl"
            >
              <div className="flex items-center gap-2 font-medium font-hebrew">
                <Sparkles className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
                <span>{randomNotice}</span>
              </div>
              <button
                onClick={() => setRandomNotice(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Settings Compact Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1 border-b border-border/50" dir="rtl">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-foreground font-hebrew">
                  הגדרות סדנת כתיבה
                </h2>
                <Badge variant="secondary" className="text-[11px] font-sans">
                  {currentTask.targetWords}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                Writing Workshop Setup • {currentTask.title}
              </p>
            </div>

            <Button
              size="default"
              onClick={handleStartWriting}
              className="cursor-pointer gap-2 text-xs sm:text-sm font-normal px-5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 font-hebrew"
            >
              <span>התחלת כתיבה</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Setting 1: Level Selection */}
          <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between" dir="rtl">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5 font-hebrew">
                <Target className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>1. רמת כתיבה</span>
                <span className="text-muted-foreground font-normal font-sans" dir="ltr">(Writing Level)</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {[
                { id: "Level 1" as const, hebrew: "משפטים בסיסיים" },
                { id: "Level 2" as const, hebrew: "פסקאות קצרות" },
                { id: "Level 3" as const, hebrew: "חיבור מלא" },
              ].map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleLevelSelect(lvl.id)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-2xs ring-1 ring-primary/40"
                        : "border-border/60 hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <span className="text-sm font-medium font-sans">{lvl.id}</span>
                    <span className="text-xs text-muted-foreground font-hebrew">{lvl.hebrew}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Setting 2: Practice Mode vs. Assignment Mode */}
          <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between" dir="rtl">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5 font-hebrew">
                <FileCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>2. מצב פעילות</span>
                <span className="text-muted-foreground font-normal font-sans" dir="ltr">(Mode)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" dir="rtl">
              <button
                type="button"
                onClick={() => setActiveMode("practice")}
                className={`p-3 sm:p-3.5 rounded-xl border text-right transition cursor-pointer flex items-center gap-3 ${
                  activeMode === "practice"
                    ? "border-primary bg-primary/10 shadow-2xs ring-1 ring-primary/40"
                    : "border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-medium text-foreground font-hebrew">אימון חופשי</h4>
                    <span className="text-[11px] text-muted-foreground font-sans" dir="ltr">Practice</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-hebrew">
                    כתיבה עצמאית עם בדיקת AI מיידית
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode("submit")}
                className={`p-3 sm:p-3.5 rounded-xl border text-right transition cursor-pointer flex items-center gap-3 ${
                  activeMode === "submit"
                    ? "border-purple-600 bg-purple-500/10 shadow-2xs ring-1 ring-purple-500/40"
                    : "border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-medium text-foreground font-hebrew">מטלה להגשה למורה</h4>
                    <span className="text-[11px] text-muted-foreground font-sans" dir="ltr">Assignment</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-hebrew">
                    הגשה ישירה לבדיקת המורה והפקת אישור
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Setting 3: Assignment Category (Type) */}
          <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between" dir="rtl">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5 font-hebrew">
                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>3. סוג המשימה</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" dir="rtl">
              {[
                { id: "all" as const, label: "כל הסוגים", icon: null },
                { id: "letter" as const, label: "מכתב / אימייל", icon: Mail },
                { id: "opinion" as const, label: "פסקת דעה", icon: FileText },
                { id: "description" as const, label: "תיאור ויומיום", icon: Compass },
                { id: "creative" as const, label: "סיפור יצירתי", icon: Sparkles },
              ].map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-normal border transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 font-hebrew ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-2xs font-medium"
                        : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Setting 4: Topic Selection */}
          <div className="bg-card border border-border/70 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-3" dir="rtl">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5" dir="rtl">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5 font-hebrew">
                <Compass className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>4. בחירת נושא לכתיבה</span>
              </span>

              {/* Tabs: Library vs AI Generator */}
              <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg" dir="rtl">
                <button
                  type="button"
                  onClick={() => setTopicSourceTab("library")}
                  className={`px-3 py-1 text-xs font-normal rounded-md transition-all cursor-pointer font-hebrew ${
                    topicSourceTab === "library"
                      ? "bg-card text-foreground shadow-2xs font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ספרייה ({filteredTasks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTopicSourceTab("ai_generator")}
                  className={`px-3 py-1 text-xs font-normal rounded-md transition-all cursor-pointer flex items-center gap-1 font-hebrew ${
                    topicSourceTab === "ai_generator"
                      ? "bg-card text-foreground shadow-2xs font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>יצירה עם AI</span>
                </button>
              </div>
            </div>

            {/* TAB A: Task Library */}
            {topicSourceTab === "library" && (
              <div className="space-y-3">
                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRollRandom}
                    disabled={isRolling}
                    className="h-7 text-xs gap-1.5 cursor-pointer border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 font-hebrew"
                  >
                    <Dice5 className={`h-3.5 w-3.5 ${isRolling ? "animate-spin" : ""}`} />
                    <span>בחירה אקראית</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {filteredTasks.map((t) => {
                    const isSelected = selectedTaskId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTaskId(t.id)}
                        className={`p-3 rounded-xl border text-right transition cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-2xs ring-1 ring-primary/40"
                            : "border-border/60 hover:bg-muted/40"
                        }`}
                      >
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="text-xs font-medium text-foreground truncate font-hebrew">
                              {t.hebrewTitle}
                            </h5>
                            <span className="text-[10px] text-muted-foreground shrink-0 font-sans">
                              {t.targetWords}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate ltr text-left font-sans">
                            {t.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB B: AI Generator for Custom Topics */}
            {topicSourceTab === "ai_generator" && (
              <div className="space-y-3 pt-1">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={customTopicInput}
                    onChange={(e) => setCustomTopicInput(e.target.value)}
                    placeholder="נושא לכתיבה (למשל: ספורט, חברים, טיול בחלל...)"
                    className="h-9 text-xs font-hebrew"
                  />
                  <Button
                    type="button"
                    onClick={handleGenerateAiTask}
                    disabled={isGeneratingAi || !customTopicInput.trim()}
                    className="h-9 text-xs font-normal px-4 gap-1.5 cursor-pointer shrink-0 bg-primary text-primary-foreground font-hebrew"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isGeneratingAi ? "יוצר משימה..." : "צור משימה"}</span>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TOPICS.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCustomTopicInput(item.label)}
                      className="text-xs px-2.5 py-1 rounded-full border border-border/80 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 transition cursor-pointer font-hebrew text-foreground"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {aiNotice && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in font-hebrew">
                    {aiNotice}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="sticky bottom-0 z-30 -mx-3 sm:mx-0 p-3 sm:p-4 bg-background/95 backdrop-blur-md border-t sm:border sm:rounded-2xl border-border/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3" dir="rtl">
            <div className="text-right rtl space-y-0.5 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-start">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-foreground font-hebrew truncate max-w-[150px] sm:max-w-none">{currentTask.hebrewTitle}</span>
                <span className="text-[11px] sm:text-xs text-muted-foreground truncate hidden sm:inline font-sans">({currentTask.title})</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] sm:text-xs text-muted-foreground font-hebrew">
                  <span className="font-sans">{selectedLevel}</span> &bull; {currentTask.targetWords} &bull;{" "}
                  <span className={activeMode === "submit" ? "text-purple-600 dark:text-purple-400 font-medium" : "text-primary font-medium"}>
                    {activeMode === "submit" ? "מטלה להגשה" : "אימון חופשי"}
                  </span>
                </p>
              </div>
            </div>

            <Button
              size="default"
              onClick={handleStartWriting}
              className={`w-full sm:w-auto h-10 px-6 text-xs sm:text-sm font-normal gap-2 shadow-2xs cursor-pointer font-hebrew ${
                activeMode === "submit"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              <span>{activeMode === "submit" ? "התחלת מטלה להגשה" : "התחלת כתיבה"}</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </main>
      )}
    </>
  );
}
