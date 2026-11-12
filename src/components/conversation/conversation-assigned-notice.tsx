"use client";

import React from "react";
import { X } from "lucide-react";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";

export function ConversationAssignedNotice({ c }: { c: ConversationPracticeController }) {
  const {
    assignedNotice,
    setAssignedNotice,
  } = c;
  return (
    <>
      {/* Assigned Notice Banner */}
      {assignedNotice && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 text-xs" dir="rtl">
          <div className="container mx-auto flex items-center justify-between gap-2">
            <span className="font-medium text-foreground">{assignedNotice}</span>
            <button
              type="button"
              onClick={() => setAssignedNotice(null)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
