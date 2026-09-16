"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { SubmissionItem } from "@/types/submission";
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
  const [studentSubmissions, setStudentSubmissions] = useState<SubmissionItem[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const modal = params.get("modal");
      if (modal === "teacher") setTeacherModalOpen(true);
      else if (modal === "student") setStudentModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== "student") return;

    let isMounted = true;
    setLoadingSubmissions(true);

    const loadData = async () => {
      let list: SubmissionItem[] = [];
      try {
        const localRaw = localStorage.getItem("ett_writing_submissions");
        if (localRaw) {
          const parsed: SubmissionItem[] = JSON.parse(localRaw);
          list = parsed.filter(
            (i) =>
              i.studentId === user.id ||
              i.studentName.trim().toLowerCase() === user.name.trim().toLowerCase()
          );
        }
      } catch {
        list = [];
      }

      if (db) {
        try {
          const snap = await getDocs(collection(db, "submissions"));
          const fbItems: SubmissionItem[] = [];
          snap.forEach((docSnap) => {
            const data = docSnap.data() as Omit<SubmissionItem, "id">;
            if (
              data.studentId === user.id ||
              data.studentName.trim().toLowerCase() === user.name.trim().toLowerCase()
            ) {
              fbItems.push({ id: docSnap.id, ...data });
            }
          });
          if (fbItems.length > 0) {
            const map = new Map<string, SubmissionItem>();
            list.forEach((i) => map.set(i.receiptCode || i.id, i));
            fbItems.forEach((i) => map.set(i.receiptCode || i.id, i));
            list = Array.from(map.values());
          }
        } catch (err) {
          console.warn("Firestore fetch student notice:", err);
        }
      }

      list.sort(
        (a, b) =>
          (new Date(b.submittedAt).getTime() || 0) - (new Date(a.submittedAt).getTime() || 0)
      );

      if (isMounted) {
        setStudentSubmissions(list);
        setLoadingSubmissions(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [user]);

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
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-8 gap-2">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs shrink-0 transition-transform group-hover:scale-105">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-foreground text-base sm:text-xl truncate">
                  English Practice
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium hidden sm:inline-block">
                  חטיבת ביניים
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-medium block truncate" dir="rtl">
                חטיבת ביניים בן גוריון &bull; Ben Gurion Middle School
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {user?.role === "teacher" && (
              <Link
                href="/teacher/dashboard"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-xs font-bold text-purple-700 dark:text-purple-300 transition shadow-2xs"
                dir="rtl"
                title="לוח בקרת מורה"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span className="hidden sm:inline">לוח בקרת מורה</span>
                <span className="sm:hidden">לוח מורה</span>
              </Link>
            )}

            {user?.role === "student" && (
              <Link
                href="/student"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-300 transition shadow-2xs"
                dir="rtl"
                title="העבודות והציונים שלי"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">ההגשות והציונים שלי</span>
                <span className="sm:hidden">ההגשות שלי</span>
              </Link>
            )}

            <Link
              href="/guide"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/70 hover:border-primary/40 bg-card hover:bg-accent/60 text-xs font-medium text-foreground transition shadow-2xs"
              title="Teacher Guide"
            >
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span className="hidden md:inline">Teacher Guide</span>
              <span className="md:hidden hidden sm:inline">Guide</span>
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
            {user.role === "student" ? (
              <Link
                href="/student"
                className="text-emerald-700 dark:text-emerald-300 font-bold hover:underline flex items-center gap-1"
              >
                <span>העבודות והציונים שלי</span>
                <ArrowLeft className="h-3 w-3" />
              </Link>
            ) : (
              <span className="text-muted-foreground hidden sm:inline">
                ההתקדמות שלך נשמרת אוטומטית.
              </span>
            )}
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
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="default"
                  onClick={() => router.push("/unseen")}
                  className="cursor-pointer gap-2 font-semibold h-10 px-5"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>התחלת תרגול</span>
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                {user.role === "student" && (
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => router.push("/student")}
                    className="cursor-pointer gap-2 font-bold h-10 px-5 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>העבודות והציונים שלי</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Student Submissions Status Section (When logged in as a student) */}
        {user?.role === "student" && (
          <div className="max-w-6xl mx-auto space-y-4" dir="rtl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  העבודות והמבחנים שהגשת לבדיקה
                </h2>
                {studentSubmissions.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {studentSubmissions.length} הגשות
                  </Badge>
                )}
              </div>

              <Link
                href="/student"
                className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
              >
                <span>צפה בכל ההגשות והציונים</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loadingSubmissions ? (
              <p className="text-xs text-muted-foreground text-center py-4">טוען נתוני הגשות...</p>
            ) : studentSubmissions.length === 0 ? (
              <Card className="p-6 text-center border-dashed border-border/80 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">עדיין לא הגשת עבודות לבדיקה.</p>
                <p>כאשר תגיש/י מבחן אנסין או חיבור, תוכלי לעקוב כאן אחר הציון ומשוב המורה בזמן אמת!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {studentSubmissions.slice(0, 3).map((sub) => {
                  const isReviewed = sub.status === "reviewed";
                  const displayGrade = sub.grade !== undefined ? sub.grade : sub.score;
                  return (
                    <Card
                      key={sub.id}
                      className="p-4 border-border/80 hover:border-emerald-500/40 transition-colors bg-card flex flex-col justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-[10px]">
                            {sub.type === "unseen" ? "📖 אנסין" : "✍️ כתיבה"}
                          </Badge>
                          {isReviewed ? (
                            <Badge className="text-[10px] bg-emerald-600 text-white font-bold">
                              ✓ נבדק (ציון: {displayGrade})
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] text-amber-600 border-amber-500/40 bg-amber-500/10 font-bold"
                            >
                              ⏳ ממתין לבדיקה
                            </Badge>
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-foreground">{sub.hebrewTitle}</h4>
                          <p className="text-xs text-muted-foreground" dir="ltr">
                            {sub.taskTitle}
                          </p>
                        </div>

                        {sub.teacherFeedback && (
                          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-950 dark:text-emerald-100">
                            <span className="font-bold block text-[11px]">משוב המורה:</span>
                            <p className="line-clamp-2 mt-0.5">{sub.teacherFeedback}</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{sub.submittedAt}</span>
                        <Link
                          href="/student"
                          className="font-bold text-primary hover:underline flex items-center gap-0.5"
                        >
                          <span>פרטים מלאים</span>
                          <ArrowLeft className="h-3 w-3" />
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

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
