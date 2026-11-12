"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookMarked, X } from "lucide-react";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";

export function ConversationWordBankDrawer({ c }: { c: ConversationPracticeController }) {
  const {
    handleOpenVocabPractice,
    savedWords,
    setShowVocabDrawer,
    showVocabDrawer,
  } = c;
  return (
    <>
      {/* Personal Word Bank Drawer Modal */}
      {showVocabDrawer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <Card className="w-full max-w-md p-5 space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base">פנקס המילים האישי ({savedWords.length})</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVocabDrawer(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {savedWords.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  לחצו על כל מילה או ביטוי בשיחה כדי לתרגם ולהוסיף לפנקס המילים שלכם!
                </p>
              ) : (
                savedWords.slice(0, 20).map((w) => (
                  <div
                    key={w.id}
                    className="p-2.5 rounded-lg border border-border/60 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold font-sans" dir="ltr">
                      {w.english}
                    </span>
                    <span className="text-primary font-medium">{w.hebrew}</span>
                  </div>
                ))
              )}
            </div>
            <div className="pt-2 border-t border-border flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowVocabDrawer(false)}
                className="text-xs cursor-pointer"
              >
                המשך בשיחה
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleOpenVocabPractice}
                className="text-xs font-bold cursor-pointer"
              >
                תרגול בפנקס המילים ←
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
