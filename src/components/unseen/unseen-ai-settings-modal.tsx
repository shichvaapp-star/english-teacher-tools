"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, X, Key } from "lucide-react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenAiSettingsModal({ c }: { c: UnseenPracticeController }) {
  const {
    customGeminiKey,
    customGroqKey,
    setAiNotice,
    setAiNoticeType,
    setCustomGeminiKey,
    setCustomGroqKey,
    setShowAiSettingsModal,
    showAiSettingsModal,
  } = c;
  return (
    <>
      {/* AI Key Settings Modal */}
      {showAiSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 print:hidden">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2 text-primary">
                <Key className="h-5 w-5" />
                <h3 className="font-bold text-base text-foreground">הגדרת מפתחות AI ליצירת אנסין</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAiSettingsModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              מערכת האנסין משתמשת במודלי AI מתקדמים (Groq 120B ו-Google Gemini).
              המפתחות שהוגדרו בשרת פעילים אוטומטית. ניתן לעדכן או להזין מפתחות אישיים שנשמרים בדפדפן שלך:
            </p>

            <div className="space-y-3">
              {/* Groq Key */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Groq API Key (Llama 3.3 / 120B):</label>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
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

              {/* Gemini Key */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Google AI Studio (Gemini):</label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
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
                אם מודל אחד עמוס או מגיע למגבלת קצב, המערכת תעבור באופן אוטומטי ושקוף למודל הבא ללא הפרעה.
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
                  }
                  setShowAiSettingsModal(false);
                  setAiNoticeType("success");
                  setAiNotice("המפתחות נשמרו בהצלחה!");
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
