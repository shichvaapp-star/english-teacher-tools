"use client";

import React from "react";
import Link from "next/link";
import { removeWordFromBuilder, loadSavedWords, normalizeVocabWord } from "@/lib/vocab-storage";
import { Badge } from "@/components/ui/badge";
import {
  BookMarked,
  Volume2,
  X,
  Trash2,
} from "lucide-react";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenVocabDrawer({ c }: { c: UnseenPracticeController }) {
  const {
    clickedWord,
    drawerOpen,
    handleSpeak,
    saveUnseenReturnSnapshot,
    savedWords,
    setClickedWord,
    setDrawerOpen,
    setSavedWords,
    user,
  } = c;
  return (
    <>
      {/* Slide-out Vocabulary Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs print:hidden animate-in fade-in-0">
          <div className="w-full max-w-md bg-card border-l border-border h-full p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
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
                מילים שבחרת לשמור מתוך קטעי הקריאה והתרגולים מופיעות כאן לתרגול!
              </p>

              <div className="mt-4 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {savedWords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-xs">
                    עדיין לא נשמרו מילים. לחץ על מילים בטקסט כדי לראות תרגום ולהוסיף לפנקס!
                  </div>
                ) : (
                  savedWords.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.english)}
                          className="text-muted-foreground hover:text-primary cursor-pointer p-0.5 shrink-0"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-bold text-xs capitalize text-foreground truncate">{item.english}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold text-primary" dir="rtl">{item.hebrew}</span>
                        <button
                          type="button"
                          onClick={() => {
                            removeWordFromBuilder(item.id, user?.id);
                            const nextWords = loadSavedWords(user?.id);
                            setSavedWords(nextWords);
                            if (
                              clickedWord &&
                              normalizeVocabWord(clickedWord.word) === normalizeVocabWord(item.english)
                            ) {
                              setClickedWord((prev) => (prev ? { ...prev, saved: false } : null));
                            }
                          }}
                          className="text-muted-foreground/60 hover:text-destructive cursor-pointer p-0.5"
                          title="הסר מאוצר המילים"
                          aria-label="הסר מילה"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link
                href="/vocabulary?from=unseen"
                onClick={saveUnseenReturnSnapshot}
                className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg text-center hover:bg-primary/90 transition"
              >
                עבור לאימון מלא באוצר מילים (כרטיסיות ומשחקים) &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
