"use client";

import React from "react";
import Link from "next/link";
import { StudentTutorProfile } from "@/types/tutor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  BookOpen,
  BookA,
  PenTool,
  Flame,
  Award,
  ArrowRight,
  RotateCcw,
  Compass,
  CheckCircle2,
  Clock,
  GraduationCap,
} from "lucide-react";

interface TutorProgressCardProps {
  profile: StudentTutorProfile;
  onResetDiagnostic?: () => void;
}

export function TutorProgressCard({ profile, onResetDiagnostic }: TutorProgressCardProps) {
  const { skills, level, vocabBand, streakDays, totalTasksCompleted, currentMission } = profile;

  return (
    <div className="space-y-4">
      {/* Student Level & Badges Card */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-xs shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-5 border-b border-border/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 text-white shadow-xs shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base sm:text-lg flex items-center gap-2">
                  {profile.studentName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  לומד/ת עם דוד (David) המורה הפרטי
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-primary/15 text-primary border-primary/30 text-xs px-2.5 py-1">
                {level}
              </Badge>
              <Badge variant="outline" className="text-xs px-2.5 py-1 border-muted-foreground/30">
                {vocabBand}
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40">
              <Flame className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">רצף ימי תרגול</div>
                <div className="font-bold text-sm sm:text-base text-foreground">
                  {streakDays} ימים
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40">
              <Award className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">משימות שהושלמו</div>
                <div className="font-bold text-sm sm:text-base text-foreground">
                  {totalTasksCompleted} משימות
                </div>
              </div>
            </div>
          </div>

          {/* Skill Bars */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              מדד מיומנויות (Skill Mastery)
            </div>

            {/* Reading Comprehension */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                  הבנת הנקרא (Unseen)
                </span>
                <span className="font-bold text-sky-500">{skills.reading}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, skills.reading))}%` }}
                />
              </div>
            </div>

            {/* Vocabulary */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <BookA className="h-3.5 w-3.5 text-emerald-500" />
                  אוצר מילים (Vocabulary)
                </span>
                <span className="font-bold text-emerald-500">{skills.vocabulary}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, skills.vocabulary))}%` }}
                />
              </div>
            </div>

            {/* Writing Workshop */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <PenTool className="h-3.5 w-3.5 text-purple-500" />
                  סדנת כתיבה (Writing)
                </span>
                <span className="font-bold text-purple-500">{skills.writing}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, skills.writing))}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Recommended Mission Card */}
      {currentMission && (
        <Card className="border-2 border-primary/30 bg-primary/5 shadow-xs overflow-hidden">
          <CardHeader className="p-4 pb-2 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                המשימה המומלצת הבאה מדוד
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                כ-{currentMission.estimatedMinutes} דק׳
              </span>
            </div>
            <CardTitle className="text-base font-bold text-foreground mt-1">
              {currentMission.hebrewTitle}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 pt-3 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentMission.descriptionHebrew}
            </p>

            <Link href={currentMission.targetUrl} className="block w-full">
              <Button className="w-full gap-2 font-bold shadow-xs">
                <span>התחל משימה עכשיו</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Strengths & Focus Areas */}
      <Card className="border border-border/50 bg-card/40 p-4 space-y-3">
        {profile.strengths.length > 0 && (
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              נקודות חוזק (Strengths)
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              {profile.strengths.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {profile.weaknesses.length > 0 && (
          <div className="pt-2 border-t border-border/30">
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1.5 flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" />
              מוקדים לחיזוק (Focus Areas)
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              {profile.weaknesses.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {onResetDiagnostic && (
          <div className="pt-2 border-t border-border/30 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetDiagnostic}
              className="text-xs text-muted-foreground hover:text-foreground h-7 px-2 gap-1.5"
            >
              <RotateCcw className="h-3 w-3" />
              בצע מבדק רמה מחדש
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
