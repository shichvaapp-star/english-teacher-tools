"use client";

import React from "react";
import { CONVERSATION_CATEGORIES } from "@/data/conversations";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  MessageSquare,
  Dice5,
  Sparkles,
  Info,
  Award,
  Target,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { InteractiveEnglishText } from "@/components/conversation/conversation-helpers";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";

export function ConversationSettingsStage({ c }: { c: ConversationPracticeController }) {
  const {
    aiNotice,
    aiNoticeType,
    aiTopicInput,
    expandedScenarioId,
    filteredScenarios,
    handleGenerateAiScenario,
    handleWordClick,
    isGeneratingAi,
    mode,
    scenarios,
    selectedCategory,
    selectedLevel,
    selectedScenarioId,
    setAiTopicInput,
    setExpandedScenarioId,
    setMode,
    setSelectedCategory,
    setSelectedLevel,
    setSelectedScenarioId,
    setStage,
  } = c;
  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6" dir="rtl">
        {/* Hero Intro */}
        <div className="text-center space-y-2">
          <Badge variant="secondary" className="text-xs px-3 py-1 gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
            <span>Real-Life English Conversations • שיחות מהחיים האמיתיים</span>
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            תרגול שיחות ומצבים מהחיים באנגלית
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            האזינו לשיחות מציאותיות בין שני דוברים (במסעדה, בשדה התעופה, בחנות, במרפאה או עם חברים), לחצו על כל מילה לתרגום מיידי, ותרגלו גם הבנה וגם שאלות <strong>&ldquo;מה הייתם אומרים?&rdquo;</strong> בזמן אמת!
          </p>
        </div>

        {/* Step 1: Level & Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 border-border/70 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Target className="h-4 w-4 text-primary" />
                <span>1. בחרו רמת קושי (Level)</span>
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["Level 1", "Level 2", "Level 3"] as const).map((lvl) => {
                const isSelected = selectedLevel === lvl;
                const labelHe =
                  lvl === "Level 1"
                    ? "רמה 1 • בסיסי"
                    : lvl === "Level 2"
                    ? "רמה 2 • שוטף"
                    : "רמה 3 • מתקדם";
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl);
                      setExpandedScenarioId(null);
                      const firstInLevel = scenarios.find(
                        (s) =>
                          s.level === lvl &&
                          (selectedCategory === "all" || s.category === selectedCategory)
                      );
                      if (firstInLevel) setSelectedScenarioId(firstInLevel.id);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground font-bold shadow-xs"
                        : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <div className="text-xs font-sans" dir="ltr">
                      {lvl}
                    </div>
                    <div className="text-2xs text-primary mt-0.5">{labelHe}</div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-4 border-border/70 bg-card space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Award className="h-4 w-4 text-primary" />
              <span>2. בחרו מצב תרגול (Mode)</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("practice")}
                className={`p-2.5 rounded-xl border text-right transition cursor-pointer ${
                  mode === "practice"
                    ? "border-emerald-500 bg-emerald-500/10 text-foreground font-bold shadow-xs"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="text-xs font-bold">אימון חופשי (Practice)</div>
                <div className="text-2xs text-muted-foreground mt-0.5">
                  בדיקה מיידית והסבר לכל שאלה בנפרד
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMode("graded")}
                className={`p-2.5 rounded-xl border text-right transition cursor-pointer ${
                  mode === "graded"
                    ? "border-purple-500 bg-purple-500/10 text-foreground font-bold shadow-xs"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="text-xs font-bold">מבחן והגשה (Graded)</div>
                <div className="text-2xs text-muted-foreground mt-0.5">
                  ציון מלא עם הערכת AI מפורטת והגשה למורה
                </div>
              </button>
            </div>
          </Card>
        </div>

        {/* Step 2: Real-World Category Filter */}
        <Card className="p-4 border-border/70 bg-card space-y-3">
          <h3 className="text-sm font-bold text-foreground">
            3. סננו לפי תחום מהחיים האמיתיים:
          </h3>
          <div className="flex flex-wrap gap-2">
            {CONVERSATION_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setExpandedScenarioId(null);
                    const match = scenarios.find(
                      (s) =>
                        s.level === selectedLevel &&
                        (cat.id === "all" || s.category === cat.id)
                    );
                    if (match) setSelectedScenarioId(match.id);
                  }}
                  className={`px-3 py-1.5 rounded-full border text-xs flex items-center gap-1.5 transition cursor-pointer ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                      : "border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.labelHebrew}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Step 3: Custom AI Real-Life Scenario Generator */}
        <Card className="p-4 border-amber-500/30 bg-amber-500/5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-foreground">
                מחולל שיחות AI מותאם אישית (בעברית או באנגלית)
              </h3>
            </div>
            <Badge variant="outline" className="text-2xs border-amber-500/40 text-amber-600 dark:text-amber-400">
              10 שאלות + הקראה בשני קולות
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={aiTopicInput}
              onChange={(e) => setAiTopicInput(e.target.value)}
              placeholder='לדוגמה: "קניית כרטיס סים בלונדון", "בקשת הארכת זמן מהמורה", "הזמנת גלידה"...'
              className="flex-1 text-xs"
            />
            <Button
              type="button"
              disabled={isGeneratingAi}
              onClick={() => handleGenerateAiScenario()}
              className="gap-1.5 text-xs font-bold cursor-pointer shrink-0"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>יוצר שיחה מהחיים...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>צור שיחה חדשה ב-AI</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isGeneratingAi}
              onClick={() =>
                handleGenerateAiScenario(
                  "a surprising and practical everyday conversation for middle school travelers"
                )
              }
              className="gap-1.5 text-xs cursor-pointer shrink-0"
            >
              <Dice5 className="h-4 w-4 text-primary" />
              <span>הפתע אותי</span>
            </Button>
          </div>
          {aiNotice && (
            <p
              className={`text-xs font-medium ${
                aiNoticeType === "error"
                  ? "text-destructive"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {aiNotice}
            </p>
          )}
        </Card>

        {/* Step 4: Scenario Cards (Collapsible by default) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                4. בחרו תרחיש שיחה ({filteredScenarios.length} זמינים ב-{selectedLevel}):
              </h3>
              <p className="text-2xs text-muted-foreground mt-0.5">
                לחצו על תרחיש שיחה כדי לפתוח את פרטי המצב, הדוברים ולהתחיל בתרגול
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {filteredScenarios.map((scen) => {
              const isExpanded = expandedScenarioId === scen.id;
              const isSelected = selectedScenarioId === scen.id;
              const categoryObj = CONVERSATION_CATEGORIES.find((c) => c.id === scen.category);

              return (
                <div
                  key={scen.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? "border-primary bg-card ring-2 ring-primary/20 shadow-md"
                      : isSelected
                      ? "border-primary/60 bg-card hover:border-primary/80"
                      : "border-border/70 bg-card hover:border-primary/50 hover:bg-muted/20"
                  }`}
                >
                  {/* Collapsed Header / Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedScenarioId(scen.id);
                      setExpandedScenarioId(isExpanded ? null : scen.id);
                    }}
                    className="w-full text-right p-3.5 sm:p-4.5 flex items-center justify-between gap-3 cursor-pointer focus:outline-hidden"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0 border border-primary/20">
                        {categoryObj?.emoji || "💬"}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-2xs font-normal">
                            {scen.categoryLabelHebrew}
                          </Badge>
                          <Badge variant="outline" className="text-2xs font-sans" dir="ltr">
                            {scen.level}
                          </Badge>
                          {scen.isAiGenerated && (
                            <Badge className="bg-amber-500 text-white text-3xs">AI</Badge>
                          )}
                          <span className="text-2xs text-muted-foreground hidden sm:inline-flex items-center gap-1">
                            <span>&bull;</span>
                            <span>
                              {scen.speakers[0]?.avatarEmoji} {scen.speakers[0]?.name.split(" ")[0]}
                            </span>
                            <span>&</span>
                            <span>
                              {scen.speakers[1]?.avatarEmoji} {scen.speakers[1]?.name.split(" ")[0]}
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                          <h4
                            className="font-bold text-sm sm:text-base text-foreground font-sans truncate"
                            dir="ltr"
                          >
                            {scen.title}
                          </h4>
                          <span className="text-xs text-primary font-medium truncate">
                            {scen.hebrewTitle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Question Badge & Expand Chevron */}
                    <div className="flex items-center gap-2 shrink-0 mr-1 sm:mr-2">
                      <Badge
                        variant="outline"
                        className="text-2xs hidden xs:inline-flex border-border/70"
                      >
                        10 שאלות
                      </Badge>
                      <div
                        className={`p-1.5 rounded-full border text-muted-foreground transition-transform duration-200 ${
                          isExpanded
                            ? "rotate-180 bg-primary/10 text-primary border-primary/30"
                            : "bg-muted/40 border-border/60"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details Section */}
                  {isExpanded && (
                    <div
                      className="px-4 pb-5 sm:px-5 sm:pb-5 border-t border-border/50 pt-4 space-y-4 animate-in fade-in-50 duration-200"
                      dir="rtl"
                    >
                      {/* Setting Description */}
                      <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1.5">
                        <div className="text-2xs font-bold text-muted-foreground flex items-center gap-1">
                          <Info className="h-3.5 w-3.5 text-primary" />
                          <span>תיאור התרחיש והסיטואציה מהחיים:</span>
                        </div>
                        <p
                          className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans"
                          dir="ltr"
                        >
                          <InteractiveEnglishText
                            text={scen.settingDescription}
                            onWordClick={handleWordClick}
                          />
                        </p>
                      </div>

                      {/* Characters / Roles Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {scen.speakers.map((spk) => (
                          <div
                            key={spk.id}
                            className="p-2.5 rounded-xl border border-border/60 bg-card flex items-center gap-2.5"
                            dir="ltr"
                          >
                            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-lg shrink-0">
                              {spk.avatarEmoji}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-foreground truncate">
                                {spk.name}
                              </div>
                              <div className="text-2xs text-muted-foreground truncate">
                                {spk.role}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Useful Phrases Preview */}
                      {scen.usefulPhrases && scen.usefulPhrases.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-2xs font-bold text-muted-foreground">
                            ביטויים שימושיים בשיחה זו:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {scen.usefulPhrases.slice(0, 3).map((ph, pIdx) => (
                              <span
                                key={pIdx}
                                className="text-2xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center gap-1"
                              >
                                <span className="font-semibold font-sans" dir="ltr">
                                  &ldquo;{ph.phrase}&rdquo;
                                </span>
                                <span className="text-muted-foreground">&bull;</span>
                                <span>{ph.translation}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Footer: Prominent Start Practice Button */}
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/40">
                        <div className="text-2xs text-muted-foreground flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          <span>
                            הקראה בשני קולות, תרגום מילים בלחיצה ו-10 שאלות הבנה ותגובה
                          </span>
                        </div>

                        <Button
                          type="button"
                          size="default"
                          onClick={() => {
                            setSelectedScenarioId(scen.id);
                            setStage("exercise");
                            window.scrollTo({ top: 0, behavior: "instant" });
                          }}
                          className="h-10 px-6 font-bold text-xs sm:text-sm gap-2 cursor-pointer shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <span>התחל תרגול שיחה</span>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
