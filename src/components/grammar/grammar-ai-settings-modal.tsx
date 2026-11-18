"use client";

import React, { useState } from "react";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { GrammarPracticeController } from "@/components/grammar/use-grammar-practice";

const KEYS = [
  { id: "ett_groq_api_key", label: "Groq", placeholder: "gsk_…", href: "https://console.groq.com/keys" },
  { id: "ett_gemini_api_key", label: "Google Gemini", placeholder: "AIzaSy…", href: "https://aistudio.google.com/app/apikey" },
] as const;

function read(id: string): string {
  try {
    return localStorage.getItem(id) ?? "";
  } catch {
    return "";
  }
}

/** Personal AI keys (same storage as the other sections). Server keys work without this. */
export function GrammarAiSettingsModal({ c }: { c: GrammarPracticeController }) {
  return (
    <Dialog open={c.aiSettingsOpen} onOpenChange={c.setAiSettingsOpen}>
      {c.aiSettingsOpen && <KeysForm onDone={() => c.setAiSettingsOpen(false)} />}
    </Dialog>
  );
}

function KeysForm({ onDone }: { onDone: () => void }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(KEYS.map((k) => [k.id, read(k.id)]))
  );

  const save = () => {
    try {
      for (const k of KEYS) {
        const v = values[k.id]?.trim();
        if (v) localStorage.setItem(k.id, v);
        else localStorage.removeItem(k.id);
      }
    } catch {
      /* storage unavailable */
    }
    onDone();
  };

  return (
    <DialogContent className="sm:max-w-md font-hebrew" dir="rtl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Key className="h-4 w-4 text-type-grammar" /> מפתחות AI לבדיקת דקדוק
        </DialogTitle>
        <DialogDescription>
          הבדיקה החכמה עובדת אוטומטית עם המפתחות שמוגדרים בשרת. כאן אפשר להוסיף מפתחות אישיים שנשמרים רק בדפדפן הזה.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        {KEYS.map((k) => (
          <div key={k.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor={k.id} className="font-semibold">{k.label}</label>
              <a href={k.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                קבלת מפתח חינם
              </a>
            </div>
            <Input
              id={k.id}
              type="password"
              dir="ltr"
              placeholder={k.placeholder}
              value={values[k.id] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [k.id]: e.target.value }))}
              className="font-mono text-xs"
            />
          </div>
        ))}
      </div>
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onDone} className="cursor-pointer">ביטול</Button>
        <Button onClick={save} className="cursor-pointer font-bold">שמירה</Button>
      </DialogFooter>
    </DialogContent>
  );
}
