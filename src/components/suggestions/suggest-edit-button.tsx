"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { SuggestEditDialog } from "./suggest-edit-dialog";
import { MessageSquarePlus } from "lucide-react";
import { HeaderTooltip } from "@/components/ui/header-tooltip";

export function SuggestEditButton() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // Visible ONLY to teachers
  if (!user || user.role !== "teacher") {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 z-40 print:hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
        <HeaderTooltip label="Suggest an edit or report a bug (הצעת עריכה או דיווח באג)">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full border border-border/70 bg-card/85 hover:bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground shadow-md hover:shadow-lg backdrop-blur-md text-xs font-medium transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Suggest an edit or report a bug"
          >
            <MessageSquarePlus className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-[11px] font-normal tracking-tight">
              Suggest Edit
            </span>
          </button>
        </HeaderTooltip>
      </div>

      <SuggestEditDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
