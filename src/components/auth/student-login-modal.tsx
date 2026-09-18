"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { StudentProfile } from "@/types/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  User,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  School,
  UserPlus,
  LogIn,
  GraduationCap,
} from "lucide-react";

interface StudentLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentLoginModal({ open, onOpenChange }: StudentLoginModalProps) {
  const { teachers, registerStudent, loginStudent, getStudentsByTeacher } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  // Login form fields
  const [loginStudentName, setLoginStudentName] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [isManualName, setIsManualName] = useState(false);

  // Signup form fields
  const [signupName, setSignupName] = useState("");
  const [classGrade, setClassGrade] = useState<string>("ז");
  const [classNumber, setClassNumber] = useState<number>(1);
  const [signupPin, setSignupPin] = useState("");

  // Teacher's students list for login
  const [teacherStudents, setTeacherStudents] = useState<StudentProfile[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // Status & Feedback
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const effectiveTeacherId = selectedTeacherId || (teachers.length > 0 ? teachers[0].id : "");

  // Load students whenever selected teacher changes
  useEffect(() => {
    if (!effectiveTeacherId || !open) return;

    let isMounted = true;
    async function loadStudents() {
      setIsLoadingStudents(true);
      try {
        const students = await getStudentsByTeacher(effectiveTeacherId);
        if (isMounted) {
          setTeacherStudents(students);
          if (students.length > 0 && !loginStudentName) {
            setLoginStudentName(students[0].name);
            setIsManualName(false);
          }
        }
      } catch (err) {
        console.warn("Could not fetch students for teacher:", err);
      } finally {
        if (isMounted) setIsLoadingStudents(false);
      }
    }

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, [effectiveTeacherId, open]);

  // Handle Log In
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!effectiveTeacherId) {
      setError("Please select your teacher.");
      return;
    }

    const trimmedName = loginStudentName.trim();
    if (!trimmedName) {
      setError("Please select or enter your name.");
      return;
    }

    if (loginPin.trim().length < 4) {
      setError("Please enter your 4-digit PIN.");
      return;
    }

    setLoading(true);
    const res = await loginStudent({
      teacherId: effectiveTeacherId,
      studentName: trimmedName,
      pin: loginPin.trim(),
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Connected successfully! Loading your assignments...");
      setTimeout(() => {
        onOpenChange(false);
        setSuccessMsg(null);
        setLoginPin("");
      }, 1000);
    } else {
      setError(res.error || "Login failed");
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!effectiveTeacherId) {
      setError("Please select your teacher.");
      return;
    }

    const trimmedName = signupName.trim();
    if (!trimmedName) {
      setError("Please enter your full name in English.");
      return;
    }

    // Strict English validation
    const hasHebrew = /[\u0590-\u05FF]/.test(trimmedName);
    if (hasHebrew) {
      setError("Please write your name in English letters only (למשל: Liam Levi ולא בעברית).");
      return;
    }

    const englishRegex = /^[A-Za-z\s'-]+$/;
    if (!englishRegex.test(trimmedName)) {
      setError("Name must contain English letters only (A-Z).");
      return;
    }

    if (signupPin.trim().length < 4) {
      setError("Please choose a 4-digit PIN.");
      return;
    }

    setLoading(true);
    const res = await registerStudent({
      teacherId: effectiveTeacherId,
      studentName: trimmedName,
      classGrade,
      classNumber,
      pin: signupPin.trim(),
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`Welcome, ${trimmedName}! Account created and connected to your class.`);
      setTimeout(() => {
        onOpenChange(false);
        setSuccessMsg(null);
        setSignupName("");
        setSignupPin("");
      }, 1200);
    } else {
      setError(res.error || "Registration failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Student Classroom Portal
            </span>
          </div>
          <DialogTitle className="text-xl">
            {mode === "login" ? "Student Log In 👋" : "Student Sign Up 🎒"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Select your teacher, choose your name, and enter your 4-digit PIN."
              : "Register with your English name and class to submit work and view your grades."}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-muted/70 rounded-xl text-xs font-bold" dir="rtl">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all cursor-pointer ${
              mode === "login"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>כניסת תלמיד/ה (Log In)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>הרשמה ראשונה (Sign Up)</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-destructive bg-destructive/10 rounded-md">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 rounded-md">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* -------------------- LOG IN FORM -------------------- */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            {/* Teacher Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <School className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Select Your Teacher (בחרו את המורה שלכם)</span>
              </label>
              <select
                value={effectiveTeacherId}
                onChange={(e) => {
                  setSelectedTeacherId(e.target.value);
                  setLoginStudentName("");
                }}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                {teachers.length === 0 && <option value="">אין מורים רשומים עדיין</option>}
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} &bull; {t.schoolName} ({t.teacherCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Student Name Selector or Manual Entry */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Your Name (שם התלמיד/ה)</span>
                </label>
                {teacherStudents.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsManualName(!isManualName)}
                    className="text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    {isManualName ? "בחר מהרשימה" : "הקלד שם ידנית"}
                  </button>
                )}
              </div>

              {!isManualName && teacherStudents.length > 0 ? (
                <select
                  value={loginStudentName}
                  onChange={(e) => setLoginStudentName(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                >
                  <option value="">-- בחר/י את שמך מהרשימה --</option>
                  {teacherStudents.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} {s.fullClass ? `(${s.fullClass})` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type="text"
                  placeholder="e.g. Liam Cohen"
                  value={loginStudentName}
                  onChange={(e) => setLoginStudentName(e.target.value)}
                  required
                />
              )}

              {teacherStudents.length === 0 && !isLoadingStudents && (
                <p className="text-[11px] text-muted-foreground" dir="rtl">
                  טרם נרשמו תלמידים אצל מורה זה. אם זו הפעם הראשונה, עברו ללשונית <strong>הרשמה ראשונה</strong>.
                </p>
              )}
            </div>

            {/* 4-digit PIN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>4-Digit PIN (קוד סודי אישי)</span>
                </label>
              </div>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ""))}
                className="font-mono text-center tracking-[0.5em] text-lg"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" className="w-full font-bold" disabled={loading || !!successMsg}>
                {loading ? "מתחבר..." : "התחבר לכיתה (Log In)"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* -------------------- SIGN UP FORM -------------------- */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-4 pt-1">
            {/* Teacher Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <School className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Select Your Teacher (בחרו את המורה שלכם)</span>
              </label>
              <select
                value={effectiveTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                {teachers.length === 0 && <option value="">אין מורים רשומים עדיין</option>}
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} &bull; {t.schoolName} ({t.teacherCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Student Name in English */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Full Name in English (שם מלא באנגלית)</span>
                </label>
                <span className="text-[10px] text-muted-foreground">English letters only</span>
              </div>
              <Input
                type="text"
                placeholder="e.g. Maya Levi"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
              {/[\u0590-\u05FF]/.test(signupName) && (
                <p className="text-[11px] text-destructive font-medium" dir="rtl">
                  ⚠️ אנא כתבו את השם באותיות באנגלית בלבד (למשל Maya Levi).
                </p>
              )}
            </div>

            {/* Class Grade (ז׳, ח׳, ט׳) & Class Number (1-6) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Class (כיתה ומספר כיתה)</span>
              </label>
              <div className="grid grid-cols-2 gap-2" dir="rtl">
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">שכבה:</span>
                  <select
                    value={classGrade}
                    onChange={(e) => setClassGrade(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    <option value="ז">כיתה ז׳</option>
                    <option value="ח">כיתה ח׳</option>
                    <option value="ט">כיתה ט׳</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground block">מספר כיתה (1–6):</span>
                  <select
                    value={classNumber}
                    onChange={(e) => setClassNumber(Number(e.target.value))}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        כיתה {num} ({classGrade}׳{num})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 4-digit PIN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Choose a 4-Digit PIN (בחרו קוד אישי של 4 ספרות)</span>
                </label>
              </div>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                value={signupPin}
                onChange={(e) => setSignupPin(e.target.value.replace(/\D/g, ""))}
                className="font-mono text-center tracking-[0.5em] text-lg"
                required
              />
              <p className="text-[10px] text-muted-foreground text-center">
                הקוד ישמש אתכם לכניסה חוזרת מכל מחשב או טלפון.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full font-bold bg-primary hover:bg-primary/90"
                disabled={loading || !!successMsg}
              >
                {loading ? "רושם תלמיד/ה..." : "הרשם והתחבר לכיתה (Sign Up)"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
