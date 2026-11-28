"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useTeacherSession } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { useConfirm } from "@/components/teacher-dashboard/shared-ui/confirm-dialog";
import { EmptyState } from "@/components/teacher-dashboard/shared-ui/empty-state";
import { DASHBOARD_BASE, examHref } from "@/components/teacher-dashboard/shell/nav-items";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExamStatusBadge } from "./exam-status-badge";
import { deleteExam, listTeacherExams } from "@/lib/exam/exam-storage";
import { cleanClass } from "@/lib/class-names";
import type { ExamDoc } from "@/types/exam";
import { ClipboardCheck, Pencil, Plus, Radio, SearchCheck, Trash2 } from "lucide-react";

export function ExamsList() {
  const { user } = useTeacherSession();
  const confirm = useConfirm();
  const [exams, setExams] = useState<ExamDoc[] | null>(null);

  const load = useCallback(() => {
    listTeacherExams(user.id)
      .then(setExams)
      .catch(() => {
        setExams([]);
        toast.error("לא ניתן לטעון את המבחנים");
      });
  }, [user.id]);

  useEffect(load, [load]);

  const handleDelete = async (exam: ExamDoc) => {
    const ok = await confirm({
      title: `למחוק את המבחן "${exam.title}"?`,
      description: "המבחן יימחק. עבודות שכבר נשלחו לבדיקה יישארו בהגשות.",
      confirmLabel: "מחק",
      destructive: true,
    });
    if (!ok) return;
    try {
      await deleteExam(exam);
      toast.success("המבחן נמחק");
      load();
    } catch {
      toast.error("המחיקה נכשלה");
    }
  };

  if (exams === null) return <Skeleton className="h-64 w-full rounded-xl" />;

  if (exams.length === 0) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        title="עוד אין מבחנים"
        description="צרו מבחן כתיבה למעבדת המחשבים: נושא, רשימת מילים בעברית, זמן ומפת ישיבה."
        action={
          <Link href={`${DASHBOARD_BASE}/exams/new`} className={buttonVariants()}>
            <Plus />
            מבחן חדש
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {exams.map((exam) => (
        <Card key={exam.id}>
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate font-bold">{exam.title}</div>
                <div className="text-xs text-muted-foreground">
                  {exam.targetClass ? `כיתה ${cleanClass(exam.targetClass)}` : "כל התלמידים"}
                  {exam.targetGroup ? ` · הקבצה ${exam.targetGroup}` : ""} · {exam.durationMin} דק׳ ·{" "}
                  {exam.vocabHebrew.length} מילים · {exam.variantKeys.length} נושאים
                </div>
              </div>
              <ExamStatusBadge status={exam.status} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={examHref(exam.id)} className={buttonVariants({ size: "sm" })}>
                <Radio />
                {exam.status === "draft" ? "פתיחה ולוח מעקב" : "לוח מעקב"}
              </Link>
              {exam.status === "draft" && (
                <Link href={`${examHref(exam.id)}/edit`} className={buttonVariants({ size: "sm", variant: "outline" })}>
                  <Pencil />
                  עריכה
                </Link>
              )}
              {exam.status === "closed" && (
                <Link href={`${examHref(exam.id)}/integrity`} className={buttonVariants({ size: "sm", variant: "outline" })}>
                  <SearchCheck />
                  בדיקת העתקות
                </Link>
              )}
              {exam.status !== "open" && (
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => void handleDelete(exam)}>
                  <Trash2 />
                  מחיקה
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
