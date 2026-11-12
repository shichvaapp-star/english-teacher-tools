"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import { TeacherAuthModal } from "@/components/auth/teacher-auth-modal";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowLeft, Lock } from "lucide-react";


import { type TeacherDashboardController } from "@/components/teacher-dashboard/use-teacher-dashboard";

/** Shown instead of the dashboard when nobody is signed in as a teacher. */
export function TeacherDashboardSignInGate({ c }: { c: TeacherDashboardController }) {
  const { authModalOpen, setAuthModalOpen } = c;
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <HeaderTooltip label="חזרה לדף הראשי">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg border border-border/60 hover:bg-muted/40 transition-colors"
              aria-label="חזרה לדף הראשי"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </HeaderTooltip>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border" />
            <UserNav />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border/80 shadow-lg text-center p-6 space-y-5" dir="rtl">
          <div className="p-3.5 rounded-2xl bg-destructive/10 text-destructive w-16 h-16 mx-auto flex items-center justify-center">
            <Lock className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-xl font-black text-foreground">
              אזור מורים בלבד (Teacher Portal)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground leading-relaxed">
              לוח הבקרה מיועד למורי אנגלית לצורך צפייה וניהול של הגשות תלמידים, הקצאת משימות ומתן משוב.
            </CardDescription>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              onClick={() => setAuthModalOpen(true)}
              className="w-full gap-2 text-xs font-bold cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <GraduationCap className="h-4 w-4" />
              <span>התחברות כמורה מורשה</span>
            </Button>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full text-xs cursor-pointer">
                חזרה לדף הבית
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      <TeacherAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
