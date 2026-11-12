"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  X,
  Send,
  Loader2,
} from "lucide-react";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";

export function ConversationSubmitModal({ c }: { c: ConversationPracticeController }) {
  const {
    handleSubmitGradedExam,
    isSubmitting,
    setShowSubmitModal,
    setStudentClassInput,
    setStudentNameInput,
    setStudentNoteInput,
    showSubmitModal,
    studentClassInput,
    studentNameInput,
    studentNoteInput,
  } = c;
  return (
    <>
      {/* Submit Exam to Teacher Modal */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          dir="rtl"
        >
          <Card className="w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" />
                <span>הגשת תרגול שיחה לבדיקת AI ומורה</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">שם התלמיד/ה:</label>
                <Input
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  placeholder="הזינו שם מלא..."
                  className="text-xs"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">כיתה:</label>
                <Input
                  value={studentClassInput}
                  onChange={(e) => setStudentClassInput(e.target.value)}
                  placeholder="לדוגמה: ח׳2"
                  className="text-xs"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">הערה למורה (רשות):</label>
                <Input
                  value={studentNoteInput}
                  onChange={(e) => setStudentNoteInput(e.target.value)}
                  placeholder="איך הרגשתם בתרגול השיחה?"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSubmitModal(false)}
                className="text-xs cursor-pointer"
              >
                ביטול
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={handleSubmitGradedExam}
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>מבצע הערכת AI...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>בדוק ב-AI ושלח למורה</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
