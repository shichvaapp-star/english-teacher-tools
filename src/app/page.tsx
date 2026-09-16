"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { TeacherAuthModal } from "@/components/auth/teacher-auth-modal";
import { StudentLoginModal } from "@/components/auth/student-login-modal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  BookOpen,
  BookA,
  PenTool,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Search,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  const sections = [
    {
      title: "בלשי האנסין (Unseen Practice)",
      englishTitle: "Reading Detective",
      description: "קטעי קריאה מרתקים המותאמים לכיתות ז׳, ח׳, ט׳. לחצו על כל מילה בטקסט כדי לקבל תרגום מיידי ולשמור אותה לפנקס אוצר המילים שלכם!",
      icon: Search,
      badge: "כיתות ז׳, ח׳, ט׳",
      badgeVariant: "default" as const,
      color: "text-sky-500 dark:text-sky-400",
      bgColor: "bg-sky-500/10",
      borderColor: "hover:border-sky-500/40",
      href: "/unseen",
      highlights: [
        "תרגול לפי רמות: קל (ז׳), בינוני (ח׳), מתקדם (ט׳)",
        "לחיצה על כל מילה בטקסט מציגה תרגום מיידי לעברית",
        "שאלות אמריקאיות, שאלות פתוחות והעתקת משפטים",
      ],
    },
    {
      title: "אימון אוצר מילים (Vocab Trainer)",
      englishTitle: "Word Mastery",
      description: "שינון ותרגול מילים נבחרות לחטיבת הביניים, יחד עם כל המילים ששמרתם מקטעי האנסין, באמצעות משחקים חווייתיים וכרטיסיות.",
      icon: BookA,
      badge: "כרטיסיות ומשחקים",
      badgeVariant: "secondary" as const,
      color: "text-emerald-500 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "hover:border-emerald-500/40",
      href: "/vocabulary",
      highlights: [
        "המילים ששמרתם מהאנסין מחכות לכם כאן לתרגול",
        "כרטיסיות חכמות עם היפוך ושמע הגייה באנגלית",
        "משחק התאמה מהיר (Speed Match) ובחנים אינטראקטיביים",
      ],
    },
    {
      title: "אימון כתיבה (Writing Practice)",
      englishTitle: "Guided Writing",
      description: "כתיבת מכתבים, אימיילים ופסקאות דעה קצרות (50–80 מילים) בסביבה תומכת, עם מילות קישור ומשוב מעודד ומדויק מבינה מלאכותית.",
      icon: PenTool,
      badge: "משוב מעודד",
      badgeVariant: "outline" as const,
      color: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "hover:border-purple-500/40",
      href: "/writing",
      highlights: [
        "מסלולי כתיבה: מכתב לחבר/מנהל או פסקת דעה קצרה",
        "בנק מילות קישור (קודם כל, בנוסף, אולם, לסיכום)",
        "משוב AI מיידי עם הצעות לשיפור שגיאות ואוצר מילים",
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
              <span className="text-xs text-muted-foreground font-medium block">
                Ben Gurion Middle School &bull; חטיבת ביניים בן גוריון
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <UserNav />
          </div>
        </div>
      </header>

      {/* User Session Bar (if logged in) */}
      {user && (
        <div className="bg-primary/5 border-b border-primary/15 py-2 px-4 sm:px-8 text-xs">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
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
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-muted/40 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>סביבת למידה ותרגול באנגלית לתלמידי בית הספר</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            English Practice
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            ברוכים הבאים למרחב התרגול באנגלית של חטיבת הביניים בן גוריון.
            <br />
            בחרו את אחד התחומים למטה כדי להתחיל לתרגל קריאה, אוצר מילים וכתיבה!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 3 Core Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Card
                key={sec.title}
                className={`flex flex-col justify-between border border-border/70 hover:shadow-lg transition-all duration-200 bg-card ${sec.borderColor}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${sec.bgColor} ${sec.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant={sec.badgeVariant} className="text-xs font-semibold">
                      {sec.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                    {sec.title}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed text-muted-foreground pt-1.5">
                    {sec.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="border-t border-border/50 pt-3.5 space-y-2">
                    {sec.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-foreground/85">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-3 border-t border-border/40">
                  <Link
                    href={sec.href}
                    className={buttonVariants({
                      className: "w-full justify-between font-semibold cursor-pointer shadow-xs",
                    })}
                  >
                    <span>התחל תרגול</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground bg-muted/20">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">English Practice</span>
            <span>&bull;</span>
            <span>Ben Gurion Middle School</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/unseen" className="hover:text-foreground">בלשי האנסין</Link>
            <Link href="/vocabulary" className="hover:text-foreground">אוצר מילים</Link>
            <Link href="/writing" className="hover:text-foreground">אימון כתיבה</Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TeacherAuthModal open={teacherModalOpen} onOpenChange={setTeacherModalOpen} />
      <StudentLoginModal open={studentModalOpen} onOpenChange={setStudentModalOpen} />
    </div>
  );
}
