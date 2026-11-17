"use client";

import React from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/confetti";
import { cn } from "@/lib/utils";
import { HeText } from "@/components/grammar/he-text";
import type { GrammarPracticeController } from "@/components/grammar/use-grammar-practice";

export function GrammarResultsScreen({ c }: { c: GrammarPracticeController }) {
  if (c.screen !== "results") return null;
  const missed = c.attempts.filter((a) => !a.grade.isCorrect);
  const pct = c.scorePct;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 font-hebrew" dir="rtl">
      {pct >= 80 && <Confetti />}
      <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-1">
        <p className={cn("text-5xl font-black tabular-nums", pct >= 80 ? "text-success" : pct >= 55 ? "text-warning" : "text-destructive")}>
          {pct}%
        </p>
        <p className="text-sm text-muted-foreground">
          {c.attempts.length - missed.length} מתוך {c.attempts.length} נכונים
        </p>
      </div>

      {missed.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-muted-foreground">כדאי לחזור על:</h2>
          <div className="divide-y divide-border/60 rounded-xl border border-border">
            {missed.map((a) => (
              <div key={a.item.id} className="px-4 py-3 space-y-1">
                <p className="text-sm font-semibold" dir="ltr">{a.grade.expected}</p>
                <p className="text-xs text-muted-foreground">
                  {c.ruleLang === "en" ? <span dir="ltr">{a.item.explanationEn}</span> : <HeText text={a.item.explanationHe} />}
                </p>
                {a.grade.needsReview && <p className="text-xs text-warning">ממתין לבדיקה</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Assignment turn-in */}
      {c.assignment && !c.isTeacher && (
        <div className="rounded-2xl border border-type-grammar/40 bg-type-grammar/5 p-4 text-center space-y-3">
          {c.receiptCode ? (
            <>
              <p className="font-bold text-success">✓ המשימה הוגשה למורה</p>
              <p className="text-sm text-muted-foreground">
                קוד אישור: <span className="font-mono font-semibold text-foreground" dir="ltr">{c.receiptCode}</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-sm">זו משימה מהמורה. אפשר לתרגל את הטעויות לפני ההגשה – ההגשה כוללת את הניסיון הראשון.</p>
              <Button
                size="lg"
                onClick={c.submitToTeacher}
                disabled={c.submitting || !c.canSubmit}
                className="h-11 px-6 font-bold cursor-pointer gap-2"
              >
                {c.submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                הגשה למורה
              </Button>
              {c.submitError && <p className="text-sm text-destructive">ההגשה נכשלה. בדקו את החיבור ונסו שוב.</p>}
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        {missed.length > 0 && (
          <Button size="lg" onClick={c.practiceMissed} className="h-11 px-5 font-bold cursor-pointer">
            תרגול הטעויות
          </Button>
        )}
        <Button size="lg" variant="outline" onClick={c.backToTopics} className="h-11 px-5 font-bold cursor-pointer">
          לנושאים
        </Button>
      </div>
    </div>
  );
}
