"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { StudentLoginModal } from "@/components/auth/student-login-modal";
import { TeacherAuthModal } from "@/components/auth/teacher-auth-modal";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Search,
  BookA,
  PenTool,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Users,
  BookOpen,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const modal = params.get("modal");
      if (modal === "teacher") setTeacherModalOpen(true);
      else if (modal === "student") setStudentModalOpen(true);
    }
  }, []);

  const sections = [
    {
      englishTitle: "Unseen Practice",
      hebrewTitle: "בלשי האנסין • קריאה והבנה",
      description:
        "קטעי קריאה מרתקים ב-3 רמות קושי: קוראים מתחילים, רמה שוטפת, ודוברי אנגלית. לחצו על כל מילה בטקסט כדי לקבל תרגום מיידי ולשמור אותה לפנקס אוצר המילים שלכם!",
      icon: Search,
      badge: "3 רמות קושי • 10 שאלות",
      badgeVariant: "default" as const,
      color: "text-sky-500 dark:text-sky-400",
      bgColor: "bg-sky-500/10",
      borderColor: "hover:border-sky-500/40",
      href: "/unseen",
      highlights: [
        "תרגול ב-3 רמות: קוראים מתחילים, רמה שוטפת ומתקדמים",
        "לחיצה על כל מילה בטקסט מציגה תרגום מיידי לעברית",
        "10 שאלות: בחירה מרובה, שאלות פתוחות והעתקת משפטים",
        "יצירת קטעי קריאה אישיים עם AI לפי תחומי עניין",
      ],
    },
    {
      englishTitle: "Vocab Trainer",
      hebrewTitle: "אימון אוצר מילים • כרטיסיות ומשחקים",
      description:
        "שינון ותרגול מילים נבחרות לחטיבת הביניים יחד עם המילים ששמרתם מקטעי האנסין, באמצעות משחקים אינטראקטיביים, כרטיסיות חכמות ובחנים.",
      icon: BookA,
      badge: "כרטיסיות ומשחקים",
      badgeVariant: "secondary" as const,
      color: "text-emerald-500 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "hover:border-emerald-500/40",
      href: "/vocabulary",
      highlights: [
        "שמירת מילים מהאנסין + הזנה ידנית של מילים עם משפט לדוגמה",
        "כרטיסיות חכמות עם היפוך ושמע הגייה באנגלית",
        "משחק התאמה מהיר (Speed Match) ובחנים אינטראקטיביים",
        "מילון אישי מלא ודפי עבודה להדפסה בלחיצה אחת",
      ],
    },
    {
      englishTitle: "Writing Practice",
      hebrewTitle: "אימון כתיבה • מכתבים, פסקאות דעה וסיפורים",
      description:
        "כתיבת מכתבים, פסקאות דעה וסיפורים יצירתיים (50–80 מילים) בסביבה מודרכת עם מילות קישור, משוב AI מעודד או הגשה ישירה למורה לבדיקה.",
      icon: PenTool,
      badge: "אימון AI או הגשה למורה",
      badgeVariant: "outline" as const,
      color: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "hover:border-purple-500/40",
      href: "/writing",
      highlights: [
        "24 נושאי כתיבה מגוונים וכפתור 🎲 'הפתע אותי עם נושא רנדומלי'",
        "בנק מילות קישור בלחיצה (סדר וארגון, ניגוד, הוספת מידע, סיבה)",
        "משוב AI מיידי עם ציון משוער, נקודות חוזק וטיפים לשיפור",
        "מצב הגשה ישירה למורה לבדיקה עם קוד אישור הגשה ותיעוד",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-foreground text-lg sm:text-xl">
                  English Practice
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium hidden sm:inline-block">
                  חטיבת ביניים
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-medium block" dir="rtl">
                חטיבת ביניים בן גוריון &bull; Ben Gurion Middle School
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            {user?.role === "teacher" && (
              <Link
                href="/teacher/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-xs font-bold text-purple-700 dark:text-purple-300 transition shadow-2xs"
                dir="rtl"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span>לוח בקרת מורה</span>
              </Link>
            )}

            <Link
              href="/guide"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 hover:border-primary/40 bg-card hover:bg-accent/60 text-xs font-medium text-foreground transition shadow-2xs"
            >
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>Teacher Guide</span>
            </Link>
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* User Session Bar (if logged in) */}
      {user && (
        <div className="bg-primary/5 border-b border-primary/15 py-2 px-4 sm:px-8 text-xs" dir="rtl">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-right">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>
                שלום <strong>{user.name}</strong> ({user.role === "teacher" ? "מורה מנהל/ת" : "תלמיד/ה"})
              </span>
              {user.role === "student" && user.teacherName && (
                <Badge variant="secondary" className="text-[10px]">
                  מורה: {user.teacherName}
                </Badge>
              )}
              {user.role === "teacher" && user.teacherCode && (
                <Badge variant="outline" className="text-[10px] font-mono">
                  קוד כיתה: {user.teacherCode}
                </Badge>
              )}
            </div>
            <span className="text-muted-foreground hidden sm:inline">
              ההתקדמות שלך נשמרת אוטומטית.
            </span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-muted/40 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span dir="rtl">סביבת למידה ותרגול באנגלית לתלמידי חטיבת הביניים</span>
          </div>

          {/* Large Title in English */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground font-sans">
            English Practice
          </h1>

          {/* Smaller Hebrew translation below */}
          <p className="text-lg sm:text-xl font-bold text-primary tracking-wide" dir="rtl">
            תרגול אנגלית • חטיבת ביניים בן גוריון
          </p>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed pt-1" dir="rtl">
            ברוכים הבאים למרחב התרגול באנגלית. בחרו באחד התחומים למטה כדי להתחיל לתרגל קריאת אנסין, שינון אוצר מילים וכתיבה!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4" dir="rtl">
            {!user ? (
              <>
                <Button
                  size="default"
                  onClick={() => setStudentModalOpen(true)}
                  className="cursor-pointer gap-2 font-semibold h-10 px-5"
                >
                  <Users className="h-4 w-4" />
                  <span>כניסת תלמידים (ללא אימייל)</span>
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setTeacherModalOpen(true)}
                  className="cursor-pointer gap-2 h-10 px-5"
                >
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>כניסת מורים</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="default"
                  onClick={() => router.push("/unseen")}
                  className="cursor-pointer gap-2 font-semibold h-10 px-5"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>התחלת תרגול</span>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 3 Core Cards with Clean English Header & Hebrew RTL body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Card
                key={sec.englishTitle}
                className={`flex flex-col justify-between border border-border/70 hover:shadow-lg transition-all duration-200 bg-card ${sec.borderColor}`}
              >
                <CardHeader className="pb-3 text-right" dir="rtl">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${sec.bgColor} ${sec.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant={sec.badgeVariant} className="text-xs font-semibold">
                      {sec.badge}
                    </Badge>
                  </div>

                  {/* Header Style: Large title in English, smaller Hebrew translation below */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-foreground font-sans tracking-tight text-left" dir="ltr">
                      {sec.englishTitle}
                    </h3>
                    <p className="text-xs font-bold text-primary mt-1 text-right" dir="rtl">
                      {sec.hebrewTitle}
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground pt-2 text-right" dir="rtl">
                    {sec.description}
                  </p>
                </CardHeader>

                <CardContent className="flex-1" dir="rtl">
                  <div className="border-t border-border/50 pt-3.5 space-y-2.5 text-right">
                    {sec.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/85">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{h}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-3 border-t border-border/40" dir="rtl">
                  <Link
                    href={sec.href}
                    className={buttonVariants({
                      className: "w-full justify-between font-semibold cursor-pointer shadow-xs",
                    })}
                  >
                    <span>התחל תרגול</span>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground bg-muted/20" dir="rtl">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground font-sans" dir="ltr">English Practice</span>
            <span>&bull;</span>
            <span>חטיבת ביניים בן גוריון</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/unseen" className="hover:text-foreground transition">
              בלשי האנסין
            </Link>
            <Link href="/vocabulary" className="hover:text-foreground transition">
              אוצר מילים
            </Link>
            <Link href="/writing" className="hover:text-foreground transition">
              סדנת כתיבה
            </Link>
          </div>
        </div>
      </footer>

      <StudentLoginModal open={studentModalOpen} onOpenChange={setStudentModalOpen} />
      <TeacherAuthModal open={teacherModalOpen} onOpenChange={setTeacherModalOpen} />
    </div>
  );
}
