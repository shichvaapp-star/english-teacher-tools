"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";


import { type TeacherDashboardController } from "@/components/teacher-dashboard/use-teacher-dashboard";

export function TeacherDashboardHeader({ c }: { c: TeacherDashboardController }) {
  const {
    handleRefreshAll,
    isLoadingStudents,
    isLoadingSubmissions,
    user,
  } = c;
  // Only rendered after the page's teacher sign-in guard.
  if (!user) return null;
  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <HeaderTooltip label="חזרה לדף הראשי">
              <Link
                href="/"
                className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition-colors shrink-0"
                aria-label="ראשי"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </HeaderTooltip>
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-bold text-xs sm:text-base truncate flex items-center gap-1.5">
                <span>לוח מורה</span>
                <span className="hidden sm:inline"> &bull; {user.schoolName || "חטיבת ביניים"}</span>
                {user.isAdmin && (
                  <Badge className="text-[10px] bg-purple-600 text-white font-bold h-5 px-1.5 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            <HeaderTooltip label="רענון נתונים">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefreshAll}
                disabled={isLoadingSubmissions || isLoadingStudents}
                className="h-9 w-9 cursor-pointer border-border/80 shrink-0"
                aria-label="רענן"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isLoadingSubmissions || isLoadingStudents ? "animate-spin text-primary" : ""
                  }`}
                />
              </Button>
            </HeaderTooltip>

            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>
    </>
  );
}
