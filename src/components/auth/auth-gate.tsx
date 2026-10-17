"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { StudentLoginModal } from "@/components/auth/student-login-modal";
import { TeacherAuthModal } from "@/components/auth/teacher-auth-modal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  Lock,
  LogIn,
  UserPlus,
  Search,
  BookA,
  PenTool,
  Bot,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  const [studentModalOpen, setStudentModalOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("modal") === "student";
  });
  const [studentModalMode, setStudentModalMode] = useState<"login" | "signup">("login");

  const [teacherModalOpen, setTeacherModalOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("modal") === "teacher";
  });
  const [teacherModalTab, setTeacherModalTab] = useState<"login" | "register">("login");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-3 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>טוען סביבת למידה...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  const openStudentModal = (mode: "login" | "signup") => {
    setStudentModalMode(mode);
    setStudentModalOpen(true);
  };

  const openTeacherModal = (tab: "login" | "register") => {
    setTeacherModalTab(tab);
    setTeacherModalOpen(true);
  };

  const lockedFeatures = [
    {
      title: "Unseen Practice",
      hebrew: "קריאה והבנת הנקרא",
      icon: Search,
      color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      title: "Personal Word Bank",
      hebrew: "בנק מילים אישי",
      icon: BookA,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Writing Practice",
      hebrew: "סדנת כתיבה ומשוב",
      icon: PenTool,
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "David AI Tutor",
      hebrew: "מורה פרטי אישי",
      icon: Bot,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs shrink-0">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-normal tracking-tight text-foreground text-sm sm:text-xl">
                  English Practice
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium hidden sm:inline-block">
                  חטיבת ביניים
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-medium hidden sm:block" dir="rtl">
                חטיבת ביניים בן גוריון &bull; Ben Gurion Middle School
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 text-xs py-1 px-2.5 hidden sm:inline-flex" dir="rtl">
              <Lock className="h-3 w-3 text-primary" />
              <span>גישה למשתמשים רשומים בלבד</span>
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-10 sm:py-14 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full space-y-8">
          {/* Hero Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium" dir="rtl">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>מרחב למידה סגור לתלמידים ומורים רשומים</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-foreground font-sans">
              English Practice Portal
            </h1>

            <p className="text-base sm:text-lg font-normal text-primary" dir="rtl">
              תרגול אנגלית • חטיבת ביניים בן גוריון
            </p>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto" dir="rtl">
              האתר פתוח לתלמידים ולמורים רשומים בלבד. אנא התחברו לחשבונכם או בצעו הרשמה קצרה כדי לגשת לתרגולי האנסין, אוצר המילים, סדנת הכתיבה והמורה הפרטי.
            </p>
          </div>

          {/* Login / Registration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" dir="rtl">
            {/* Student Card */}
            <Card className="p-6 sm:p-7 border-border/80 hover:border-emerald-500/40 transition-all bg-card flex flex-col justify-between gap-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal">
                    תלמידים • Students
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl font-semibold text-foreground">
                    כניסת תלמידים לכיתה
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    התחברו באמצעות בחירת המורה שלכם וקוד ה-PIN האישי (4 ספרות) ללא צורך באימייל, או הירשמו בפעם הראשונה.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <Button
                  size="lg"
                  onClick={() => openStudentModal("login")}
                  className="w-full cursor-pointer gap-2 font-semibold"
                >
                  <LogIn className="h-4 w-4" />
                  <span>כניסת תלמיד/ה רשום/ה (Log In)</span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => openStudentModal("signup")}
                  className="w-full cursor-pointer gap-2 font-normal"
                >
                  <UserPlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>הרשמת תלמיד/ה חדש/ה (Sign Up)</span>
                </Button>
              </div>
            </Card>

            {/* Teacher Card */}
            <Card className="p-6 sm:p-7 border-border/80 hover:border-primary/40 transition-all bg-card flex flex-col justify-between gap-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal">
                    סגל הוראה • Teachers
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl font-semibold text-foreground">
                    כניסת מורים וצוות הוראה
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    התחברו עם כתובת האימייל והסיסמה לניהול כיתות, שיוך משימות, מעקב אחר הגשות ומתן ציונים ומשוב.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => openTeacherModal("login")}
                  className="w-full cursor-pointer gap-2 font-semibold"
                >
                  <LogIn className="h-4 w-4" />
                  <span>כניסת מורים (Teacher Log In)</span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => openTeacherModal("register")}
                  className="w-full cursor-pointer gap-2 font-normal"
                >
                  <UserPlus className="h-4 w-4 text-primary" />
                  <span>פתיחת חשבון מורה חדש (Register)</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Locked Modules Preview */}
          <div className="pt-2 space-y-3">
            <p className="text-center text-xs text-muted-foreground" dir="rtl">
              הכלים הזמינים לאחר ההתחברות:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {lockedFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="flex flex-col items-center text-center p-3.5 rounded-xl border border-border/60 bg-card/60 gap-2 opacity-85"
                  >
                    <div className={`p-2 rounded-lg border ${feat.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{feat.title}</p>
                      <p className="text-[11px] text-muted-foreground" dir="rtl">
                        {feat.hebrew}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground bg-muted/20" dir="rtl">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="font-normal text-foreground font-sans" dir="ltr">
              English Practice
            </span>
            <span>&bull;</span>
            <span>חטיבת ביניים בן גוריון</span>
          </div>
          <span className="text-[11px]">השימוש במערכת מיועד לתלמידים ומורים רשומים בלבד</span>
        </div>
      </footer>

      <StudentLoginModal
        open={studentModalOpen}
        onOpenChange={setStudentModalOpen}
        initialMode={studentModalMode}
      />
      <TeacherAuthModal
        open={teacherModalOpen}
        onOpenChange={setTeacherModalOpen}
        initialTab={teacherModalTab}
      />
    </div>
  );
}
