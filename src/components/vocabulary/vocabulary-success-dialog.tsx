"use client";

import React from "react";
import Link from "next/link";
import { Confetti } from "@/components/confetti";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Check,
  Copy,
} from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularySuccessDialog({ c }: { c: VocabularyPracticeController }) {
  const {
    activeAssignment,
    copiedReceipt,
    setCopiedReceipt,
    setSubmissionSuccessReceipt,
    showConfetti,
    submissionSuccessReceipt,
  } = c;
  return (
    <>
      {/* Submission Success Dialog with Confetti */}
      {submissionSuccessReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          {showConfetti && <Confetti active={true} durationMs={4000} />}
          <div
            className="w-full max-w-md bg-card border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-center text-xs animate-in zoom-in-95"
            dir="rtl"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-lg text-foreground">
                משימת אוצר המילים הוגשה בהצלחה! 🎉
              </h3>
              <p className="text-xs text-muted-foreground">
                התרגול שלך נשמר והועבר לבדיקת המורה {activeAssignment?.teacherName}.
              </p>
            </div>

            {/* Receipt Code Box */}
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
              <span className="text-2xs font-bold text-muted-foreground block">
                קוד אישור הגשה (Receipt Code):
              </span>
              <div className="flex items-center justify-center gap-2">
                <code className="text-sm font-mono font-black text-foreground tracking-wider bg-background px-3 py-1 rounded-lg border border-border">
                  {submissionSuccessReceipt}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-2xs gap-1 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(submissionSuccessReceipt);
                    setCopiedReceipt(true);
                    setTimeout(() => setCopiedReceipt(false), 2000);
                  }}
                >
                  {copiedReceipt ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedReceipt ? "הועתק!" : "העתק"}</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Link href="/student">
                <Button
                  size="sm"
                  className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground cursor-pointer"
                >
                  <span>מעבר לפורטל התלמידים</span>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSubmissionSuccessReceipt(null)}
                className="text-xs cursor-pointer"
              >
                סגור והמשך
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
