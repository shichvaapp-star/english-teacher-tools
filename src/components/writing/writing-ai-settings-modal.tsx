"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, X, Sliders } from "lucide-react";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";

export function WritingAiSettingsModal({ c }: { c: WritingPracticeController }) {
  const {
    customGeminiKey,
    customGroqKey,
    setCustomGeminiKey,
    setCustomGroqKey,
    setHasAiKeys,
    setShowAiSettingsModal,
    showAiSettingsModal,
  } = c;
  return (
    <>
      {/* AI API Keys Settings Modal */}
      {showAiSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 print:hidden">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" />
                <h3 className="font-black text-base text-foreground">הגדרות מפתחות AI (מורה חכם)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAiSettingsModal(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              המערכת משתמשת באותם מפתחות AI המוגדרים באנסין ובכתיבה (נשמרים מקומית במכשיר שלך). המפתחות מאפשרים בדיקת חיבור מדויקת לפי מחוון משרד החינוך ויצירת נושאים מקוריים.
            </p>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground">מפתח Groq (מומלץ - מהיר וחזק):</label>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-primary hover:underline"
                  >
                    קבלת מפתח חינם &larr;
                  </a>
                </div>
                <Input
                  type="password"
                  placeholder="gsk_..."
                  value={customGroqKey}
                  onChange={(e) => setCustomGroqKey(e.target.value)}
                  className="h-9 text-xs font-mono ltr text-left"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground">מפתח Google Gemini:</label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-primary hover:underline"
                  >
                    קבלת מפתח חינם &larr;
                  </a>
                </div>
                <Input
                  type="password"
                  placeholder="AIzaSy..."
                  value={customGeminiKey}
                  onChange={(e) => setCustomGeminiKey(e.target.value)}
                  className="h-9 text-xs font-mono ltr text-left"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/50 border border-border/50 text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>מנגנון מפל אוטומטי (Cascade)</span>
              </div>
              <p>
                אם מודל אחד מגיע למגבלת עומס, המערכת תעבור באופן אוטומטי למודל הבא (Groq 120B &rarr; Gemini 2.5 &rarr; Llama 70B &rarr; מחוון פדגוגי מקומי).
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAiSettingsModal(false)}
                className="cursor-pointer text-xs"
              >
                ביטול
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    if (customGroqKey.trim()) localStorage.setItem("ett_groq_api_key", customGroqKey.trim());
                    else localStorage.removeItem("ett_groq_api_key");

                    if (customGeminiKey.trim()) localStorage.setItem("ett_gemini_api_key", customGeminiKey.trim());
                    else localStorage.removeItem("ett_gemini_api_key");

                    setHasAiKeys(Boolean(customGroqKey.trim() || customGeminiKey.trim()));
                  }
                  setShowAiSettingsModal(false);
                }}
                className="cursor-pointer text-xs font-bold shadow-xs"
              >
                שמור הגדרות
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
