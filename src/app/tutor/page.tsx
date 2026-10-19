"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { StudentTutorProfile } from "@/types/tutor";
import { getOrInitTutorProfile, saveTutorProfile } from "@/lib/tutor-engine";
import { TutorChatBox } from "@/components/tutor/tutor-chat-box";
import { TutorProgressCard } from "@/components/tutor/tutor-progress-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  BookA,
  PenTool,
  Loader2,
  Award,
} from "lucide-react";

export default function PrivateTutorPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentTutorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

  // Load or initialize tutor profile
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getOrInitTutorProfile(user?.id, user?.name).then((prof) => {
      if (isMounted) {
        setProfile(prof);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleProfileUpdate = (updated: StudentTutorProfile) => {
    setProfile(updated);
    saveTutorProfile(updated);
  };

  const handleResetDiagnostic = () => {
    if (!profile) return;
    const resetProf: StudentTutorProfile = {
      ...profile,
      diagnosticCompleted: false,
    };
    setProfile(resetProf);
    saveTutorProfile(resetProf);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur-md" dir="rtl">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 gap-2">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" />
              <span className="hidden sm:inline">חזרה לבית</span>
            </Link>

            <span className="text-border">|</span>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden border border-indigo-500/30 bg-muted/20 shadow-xs shrink-0">
                <img src="/images/logos/david-logo.png" alt="David" className="h-full w-full object-cover object-top" />
              </div>
              <span className="font-bold text-sm sm:text-base text-foreground">
                המורה הפרטי שלי (David)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/unseen" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm" className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                <span>אנסין</span>
              </Button>
            </Link>
            <Link href="/vocabulary" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm" className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                <BookA className="h-3.5 w-3.5 text-emerald-500" />
                <span>אוצר מילים</span>
              </Button>
            </Link>
            <Link href="/writing" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm" className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                <PenTool className="h-3.5 w-3.5 text-purple-500" />
                <span>כתיבה</span>
              </Button>
            </Link>

            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Workspace - Distraction-Free Focused Single Column */}
      <main className="flex-1 container mx-auto px-3 sm:px-6 py-4 sm:py-6 max-w-4xl flex flex-col justify-center" dir="rtl">
        {isLoading || !profile ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">טוען את נתוני המורה הפרטי דוד...</p>
          </div>
        ) : (
          <div className="w-full">
            <TutorChatBox
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
              studentName={user?.name || "Student"}
              onOpenStats={() => setShowStatsDialog(true)}
            />

            {/* Student Stats & Mastery Dialog (Opened on demand from Level Pill) */}
            <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
              <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto font-sans p-5" dir="rtl">
                <DialogHeader className="text-right pb-2 border-b border-border/40">
                  <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                    <Award className="h-5 w-5 text-primary" />
                    <span>לוח התקדמות ומיומנויות</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="pt-2">
                  <TutorProgressCard
                    profile={profile}
                    onResetDiagnostic={() => {
                      setShowStatsDialog(false);
                      handleResetDiagnostic();
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </main>
    </div>
  );
}
