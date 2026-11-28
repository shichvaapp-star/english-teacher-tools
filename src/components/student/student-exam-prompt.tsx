"use client";

// Shows open lab exams on the student's home page (one scoped query per visit).

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "cn";
import { useAuth } from "@/lib/auth-context";
import { findOpenExams } from "@/lib/exam/exam-storage";
import { isStudentTargeted } from "@/lib/exam/exam-targeting";
import { buttonVariants } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import type { ExamDoc } from "@/types/exam";

export function StudentExamPrompt({ className }: { className?: string }) {
  const { user } = useAuth();
  const [exams, setExams] = useState<ExamDoc[]>([]);

  useEffect(() => {
    if (!user || user.role !== "student" || !user.teacherId) return;
    let alive = true;
    findOpenExams(user.teacherId)
      .then((list) => alive && setExams(list.filter((e) => isStudentTargeted(e, user))))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [user]);

  if (exams.length === 0) return null;

  return (
    <div dir="rtl" className={cn("space-y-2", className)}>
      {exams.map((exam) => (
        <div
          key={exam.id}
          className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4"
        >
          <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <div className="font-bold">מבחן פתוח: {exam.title}</div>
            <div className="text-sm text-muted-foreground">
              {exam.durationMin} דקות · המבחן ייפתח במסך מלא
            </div>
          </div>
          <Link href={`/exam/${encodeURIComponent(exam.id)}`} className={buttonVariants({ size: "lg" })}>
            כניסה למבחן
            <ArrowLeft />
          </Link>
        </div>
      ))}
    </div>
  );
}
