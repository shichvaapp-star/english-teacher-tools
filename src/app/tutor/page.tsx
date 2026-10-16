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
import { HeaderTooltip } from "@/components/ui/header-tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  BookOpen,
  BookA,
  PenTool,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function PrivateTutorPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentTutorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>חזרה לדף הבית</span>
            </Link>

            <span className="text-border">|</span>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-xs">
                👨‍🏫
              </div>
              <span className="font-bold text-sm sm:text-base text-foreground">
                המורה הפרטי שלי (David)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/unseen" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                <span>אנסין</span>
              </Button>
            </Link>
            <Link href="/vocabulary" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                <BookA className="h-3.5 w-3.5 text-emerald-500" />
                <span>אוצר מילים</span>
              </Button>
            </Link>
            <Link href="/writing" className="hidden sm:inline-flex">
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

      {/* Main Workspace */}
      <main className="flex-1 container mx-auto px-3 sm:px-8 py-6 max-w-7xl">
        {isLoading || !profile ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">טוען את נתוני המורה הפרטי דוד...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Student Progress, Radar & Next Mission */}
            <div className="lg:col-span-4 order-2 lg:order-1 space-y-4">
              <TutorProgressCard
                profile={profile}
                onResetDiagnostic={handleResetDiagnostic}
              />
            </div>

            {/* Right Column: Interactive Tutor Chat with David */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <TutorChatBox
                profile={profile}
                onProfileUpdate={handleProfileUpdate}
                studentName={user?.name || "Student"}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
