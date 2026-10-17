"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot } from "lucide-react";
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import { useAuth } from "@/lib/auth-context";

export function TutorFloatingButton() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Only show to authenticated users and not on the /tutor page itself
  if (!user || pathname === "/tutor") {
    return null;
  }

  return (
    <div className="fixed bottom-16 left-4 sm:bottom-20 sm:left-6 z-40 print:hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <HeaderTooltip label="דוד (David) - המורה הפרטי האישי שלך לאנגלית">
        <Link
          href="/tutor"
          className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full border border-border/70 bg-card/85 hover:bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground shadow-md hover:shadow-lg backdrop-blur-md text-xs font-medium transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="פתח את המורה הפרטי דוד"
        >
          <Bot className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline text-[11px] font-normal tracking-tight">
            המורה הפרטי (דוד)
          </span>
        </Link>
      </HeaderTooltip>
    </div>
  );
}
