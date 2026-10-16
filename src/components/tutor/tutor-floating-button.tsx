"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, MessageSquare, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TutorFloatingButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Don't show floating button on the /tutor page itself
  if (pathname === "/tutor") {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2">
      {/* Speech bubble prompt */}
      {!hasPrompted && (
        <div className="relative bg-card text-foreground border border-border/80 rounded-2xl p-3 shadow-lg max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setHasPrompted(true)}
            className="absolute -top-2 -right-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground h-5 w-5 rounded-full flex items-center justify-center text-xs shadow-xs"
            title="סגור"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">👨‍🏫</span>
            <span className="font-bold text-xs text-primary">דוד (David) - המורה הפרטי</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            היי! רוצה משימת תרגול מותאמת אישית או עזרה באנגלית? בוא נתחיל!
          </p>
          <Link href="/tutor" onClick={() => setHasPrompted(true)}>
            <Button size="sm" className="w-full text-xs h-7 gap-1 font-bold">
              <span>דבר עם דוד עכשיו</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      )}

      {/* Floating launcher button */}
      <Link href="/tutor">
        <button
          className="group flex items-center gap-2.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-primary-foreground/20 cursor-pointer"
          title="פתח את המורה הפרטי דוד (David)"
        >
          <div className="relative flex items-center justify-center">
            <span className="text-lg">👨‍🏫</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <span className="font-bold text-xs sm:text-sm tracking-tight">
            המורה הפרטי שלי
          </span>
          <Sparkles className="h-3.5 w-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
        </button>
      </Link>
    </div>
  );
}
