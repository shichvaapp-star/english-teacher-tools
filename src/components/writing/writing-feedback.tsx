"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CheckCircle2,
  Check,
  Send,
  Lightbulb,
  GraduationCap,
  AlertCircle,
  BookMarked,
  Plus,
  Award,
  ChevronDown,
} from "lucide-react";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";

export function WritingFeedback({ c }: { c: WritingPracticeController }) {
  const {
    activeMode,
    feedback,
    handleApplyCorrection,
    handleEvaluate,
    isEvaluating,
    isTurningInToDavid,
    selectedLevel,
    setActiveMode,
    setShowDetailedRubric,
    showDetailedRubric,
  } = c;
  return (
    <>
      {/* ACTION BUTTONS & FEEDBACK */}
      {activeMode === "practice" && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <Button
              onClick={handleEvaluate}
              disabled={isEvaluating || isTurningInToDavid}
              className="flex-1 h-11 text-xs sm:text-sm font-bold cursor-pointer gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isEvaluating ? "בודק את החיבור עם מורה AI..." : "בדיקת חיבור ומשוב AI מקדים ✨"}
              </span>
            </Button>

            <Button
              onClick={() => setActiveMode("submit")}
              variant="outline"
              className="flex-1 h-11 text-xs sm:text-sm font-bold cursor-pointer gap-2 border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-xs"
            >
              <Send className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>הגש למורה בכיתה 📤</span>
            </Button>
          </div>

          {/* AI Feedback Card - Clean, Progressive & Student-Friendly */}
          {feedback && (
            <div
              className="p-5 sm:p-6 rounded-2xl border border-primary/30 bg-card space-y-4 shadow-sm animate-in fade-in text-right font-sans"
              dir="rtl"
            >
              {/* 1. Header: Hero Score & Encouragement */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[11px] gap-1 border-primary/40 text-primary font-bold">
                      <Award className="h-3 w-3" />
                      <span>מחוון משרד החינוך</span>
                    </Badge>
                    <span className="text-xs text-muted-foreground font-semibold">
                      מותאם ל-{selectedLevel}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-foreground">
                    {feedback.encouragement}
                  </h4>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Badge
                    variant="default"
                    className={`text-base px-3.5 py-1 font-black ${
                      feedback.score >= 90
                        ? "bg-emerald-600 text-white"
                        : feedback.score >= 80
                        ? "bg-blue-600 text-white"
                        : feedback.score >= 65
                        ? "bg-amber-600 text-white"
                        : "bg-rose-600 text-white"
                    }`}
                  >
                    ציון: {feedback.score} / 100
                  </Badge>
                </div>
              </div>

              {/* 2. Warm Teacher's Personal Note */}
              {feedback.teacherNote && (
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs flex items-start gap-2.5">
                  <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-primary block text-[11px]">מכתב אישי מהמורה:</span>
                    <p className="text-foreground/90 leading-relaxed text-xs">
                      {feedback.teacherNote}
                    </p>
                  </div>
                </div>
              )}

              {/* Spam / Repetition warning */}
              {feedback.isSpamOrGibberish && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>שימו לב: כדאי להוסיף עוד מילים ומשפטים</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    החיבור קצר מאוד או מכיל חזרות. נסו להשתמש במשפטי הפתיחה כדי לפתח רעיון שלם.
                  </p>
                </div>
              )}

              {/* 3. Pedagogical Sandwich Slice 1: Key Strengths */}
              {feedback.strengths && feedback.strengths.length > 0 && (
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>נקודות חוזק בחיבור שלך:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-foreground/90 pr-4 list-disc">
                    {feedback.strengths.slice(0, 3).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 4. Pedagogical Sandwich Slice 2: Top Actionable Improvements */}
              {feedback.corrections && feedback.corrections.length > 0 && (
                <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      <span>דגשים ותיקונים מובילים ללמידה:</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">לחצו על &apos;החלף בחיבור&apos; לעדכון מיידי</span>
                  </div>

                  <div className="space-y-1.5">
                    {feedback.corrections.slice(0, 3).map((corr, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-background/80 border border-border/60 text-xs space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] ltr text-left">
                            <span className="line-through text-rose-500/90 bg-rose-500/10 px-2 py-0.5 rounded">
                              {corr.original}
                            </span>
                            <span className="text-muted-foreground">&rarr;</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                              {corr.suggestion}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {corr.category && (
                              <Badge
                                variant="outline"
                                className="text-[10px] py-0 px-1.5 font-bold border-border/70"
                              >
                                {corr.category === "capitalization"
                                  ? "אותיות גדולות"
                                  : corr.category === "hebrew_interference"
                                  ? "תרגום מעברית"
                                  : corr.category === "grammar"
                                  ? "דקדוק"
                                  : corr.category === "spelling"
                                  ? "איות"
                                  : "פיסוק"}
                              </Badge>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApplyCorrection(corr.original, corr.suggestion)}
                              className="h-6 text-[10px] gap-1 cursor-pointer text-primary hover:bg-primary/10 px-2"
                            >
                              <Check className="h-3 w-3" />
                              <span>החלף בחיבור</span>
                            </Button>
                          </div>
                        </div>
                        {corr.explanationHebrew && (
                          <p className="text-muted-foreground text-[11px] leading-snug">
                            💡 {corr.explanationHebrew}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Next Step Action Callout */}
              <div className="p-4 rounded-xl bg-purple-500/10 border-2 border-purple-500/35 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
                <div className="space-y-0.5">
                  <h5 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Send className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span>סיימת את החיבור? הגש/י אותו למורה בכיתה לקבלת ציון!</span>
                  </h5>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    החיבור יישלח למורה לאנגלית לבדיקה, ותוכל/י לראות את המשוב והציון באזור האישי שלך.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Button
                    size="sm"
                    onClick={() => setActiveMode("submit")}
                    className="flex-1 sm:flex-initial h-10 px-5 text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white shrink-0 cursor-pointer gap-1.5 shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>הגש למורה בכיתה 📤</span>
                  </Button>
                </div>
              </div>

              {/* 6. Progressive Disclosure: Toggle for Full MOE Rubric & Vocabulary Upgrades */}
              <div className="pt-2 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetailedRubric(!showDetailedRubric)}
                  className="w-full text-xs font-bold gap-2 text-muted-foreground hover:text-foreground h-9 cursor-pointer"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDetailedRubric ? "rotate-180" : ""}`} />
                  <span>{showDetailedRubric ? "הסתר ניתוח מחוון מעמיק ▴" : "צפה בפירוט מחוון משרד החינוך המלא ושדרוגי אוצר מילים ▾"}</span>
                </Button>
              </div>

              {showDetailedRubric && (
                <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                  {/* 4-Pillar Official MOE Rubric Cards */}
                  {feedback.rubric && (
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        <span>פירוט ציונים לפי 4 עמודי התווך של משרד החינוך:</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {/* 1. Content & Organization */}
                        <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-foreground">תוכן ומבנה (Content & Org.)</span>
                            <span className="text-primary font-mono text-[11px]">
                              {feedback.rubric.contentAndOrganization.score} / {feedback.rubric.contentAndOrganization.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (feedback.rubric.contentAndOrganization.score / feedback.rubric.contentAndOrganization.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {feedback.rubric.contentAndOrganization.commentHebrew}
                          </p>
                        </div>

                        {/* 2. Vocabulary */}
                        <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <div className="flex items-center gap-1.5">
                              <span className="text-foreground">אוצר מילים (Vocabulary)</span>
                              {feedback.rubric.vocabulary.bandLevelObserved && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                                  {feedback.rubric.vocabulary.bandLevelObserved}
                                </Badge>
                              )}
                            </div>
                            <span className="text-primary font-mono text-[11px]">
                              {feedback.rubric.vocabulary.score} / {feedback.rubric.vocabulary.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (feedback.rubric.vocabulary.score / feedback.rubric.vocabulary.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {feedback.rubric.vocabulary.commentHebrew}
                          </p>
                        </div>

                        {/* 3. Language & Grammar */}
                        <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-foreground">שפה ודקדוק (Language & Grammar)</span>
                            <span className="text-primary font-mono text-[11px]">
                              {feedback.rubric.languageAndGrammar.score} / {feedback.rubric.languageAndGrammar.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (feedback.rubric.languageAndGrammar.score / feedback.rubric.languageAndGrammar.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {feedback.rubric.languageAndGrammar.commentHebrew}
                          </p>
                        </div>

                        {/* 4. Mechanics & Spelling */}
                        <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-foreground">מכניקה ואיות (Mechanics & Spelling)</span>
                            <span className="text-primary font-mono text-[11px]">
                              {feedback.rubric.mechanicsAndSpelling.score} / {feedback.rubric.mechanicsAndSpelling.max}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (feedback.rubric.mechanicsAndSpelling.score / feedback.rubric.mechanicsAndSpelling.max) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {feedback.rubric.mechanicsAndSpelling.commentHebrew}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hebrew Interference Callout (if any) */}
                  {feedback.hebrewInterferenceNotes && feedback.hebrewInterferenceNotes.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
                        <Lightbulb className="h-4 w-4 shrink-0" />
                        <span>דגש לתלמידים דוברי עברית (Hebrew-English Transfer):</span>
                      </div>
                      <ul className="list-disc pl-5 pr-2 space-y-1 text-foreground/90 text-[11px]">
                        {feedback.hebrewInterferenceNotes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Vocabulary Upgrades (Band Elevation) */}
                  {feedback.vocabularyUpgrades && feedback.vocabularyUpgrades.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-border/60">
                      <span className="font-bold text-primary text-xs flex items-center gap-1.5">
                        <BookMarked className="h-3.5 w-3.5" />
                        <span>שדרוג אוצר מילים (Band Elevation) – מילים עשירות יותר:</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {feedback.vocabularyUpgrades.map((upg, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg border border-border/60 bg-muted/30 text-xs space-y-1.5">
                            <div className="flex items-center justify-between" dir="ltr">
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground line-through text-[11px]">{upg.original}</span>
                                <span>&rarr;</span>
                                <span className="font-bold text-primary text-xs">{upg.enriched}</span>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => handleApplyCorrection(upg.original, upg.enriched)}
                                className="h-5 text-[10px] gap-1 cursor-pointer text-primary hover:bg-primary/10 px-1.5 shrink-0"
                                title="החלף במילה עשירה יותר"
                              >
                                <Plus className="h-2.5 w-2.5" />
                                <span>שדרג</span>
                              </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground rtl text-right">
                              {upg.explanationHebrew}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
