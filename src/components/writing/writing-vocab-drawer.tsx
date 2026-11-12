"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  X,
  BookMarked,
  Volume2,
  Plus,
} from "lucide-react";
import { type WritingPracticeController } from "@/components/writing/use-writing-practice";

export function WritingVocabDrawer({ c }: { c: WritingPracticeController }) {
  const {
    drawerOpen,
    handleInsertText,
    handleSpeak,
    savedWords,
    setDrawerOpen,
  } = c;
  return (
    <>
      {/* Slide-out Vocabulary Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs print:hidden animate-in fade-in-0">
          <div className="w-full max-w-md bg-card border-l border-border h-full p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200" dir="rtl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base text-foreground">פנקס המילים שלי</h3>
                  <Badge variant="secondary" className="text-xs">
                    {savedWords.length}
                  </Badge>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                מילים ששמרת לתרגול – תוכל להאזין להגייה שלהן או להכניס אותן ישירות לתוך החיבור שלך!
              </p>

              <div className="mt-4 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {savedWords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-xs space-y-2">
                    <BookMarked className="h-8 w-8 mx-auto text-muted-foreground/50" />
                    <p>עדיין לא נשמרו מילים בפנקס.</p>
                    <p className="text-[11px] text-muted-foreground/80">
                      ניתן לשמור מילים במהלך אימון האנסין ובמילון כדי להשתמש בהן כאן.
                    </p>
                  </div>
                ) : (
                  savedWords.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2" dir="ltr">
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.english)}
                          className="text-muted-foreground hover:text-primary cursor-pointer p-0.5"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-bold text-xs capitalize text-foreground">{item.english}</span>
                        <span className="text-xs font-semibold text-primary mr-1" dir="rtl">
                          ({item.hebrew})
                        </span>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          handleInsertText(item.english);
                        }}
                        className="h-6 text-[11px] gap-1 cursor-pointer text-primary hover:text-primary hover:bg-primary/10 px-2 shrink-0"
                        title="הוסף לחיבור"
                      >
                        <Plus className="h-3 w-3" />
                        <span>הוסף לחיבור</span>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link
                href="/vocabulary"
                className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg text-center hover:bg-primary/90 transition flex items-center justify-center gap-2"
              >
                <span>עבור לאימון מלא באוצר מילים (כרטיסיות ומשחקים)</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
