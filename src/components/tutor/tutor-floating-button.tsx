"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Bot, GraduationCap } from "lucide-react";

export function TutorFloatingButton() {
  const pathname = usePathname();

  // Don't show floating button on the /tutor page itself
  if (pathname === "/tutor") {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <Link href="/tutor">
        <button
          className="group flex items-center gap-3 bg-[#0d0e12] hover:bg-[#16181f] text-zinc-100 pl-4 pr-3.5 py-2.5 rounded-full shadow-2xl border border-white/10 hover:border-white/20 hover:shadow-primary/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer backdrop-blur-md"
          title="דוד (David) - המורה הפרטי האישי שלך לאנגלית"
          aria-label="פתח את המורה הפרטי דוד"
        >
          {/* Logo Badge */}
          <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Modern graduation cap + AI spark emblem */}
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>

            {/* Online Indicator Dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-[#0d0e12]" />
            </span>
          </div>

          {/* Text */}
          <div className="flex flex-col items-start leading-tight">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm tracking-tight text-white">
              <span>המורה הפרטי שלי</span>
              <span className="text-[10px] text-zinc-400 font-medium">(דוד)</span>
            </div>
            <span className="text-[10px] text-emerald-400/90 font-medium">
              זמין כעת לתרגול אישי
            </span>
          </div>

          <Sparkles className="h-3.5 w-3.5 text-amber-400/80 group-hover:text-amber-300 group-hover:rotate-12 transition-all ml-0.5" />
        </button>
      </Link>
    </div>
  );
}
