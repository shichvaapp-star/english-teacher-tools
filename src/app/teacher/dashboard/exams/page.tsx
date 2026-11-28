"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { ExamsList } from "@/components/teacher-dashboard/exams/exams-list";
import { DASHBOARD_BASE } from "@/components/teacher-dashboard/shell/nav-items";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="מבחנים ובחנים"
        description="מבחנים ובחנים במעבדת המחשבים: הבנת הנקרא, אוצר מילים, דקדוק וכתיבה – בלי שום עזרה, עם נעילה ביציאה מהמסך, גרסאות שונות לשכנים ובדיקת העתקות."
        actions={
          <Link href={`${DASHBOARD_BASE}/exams/new`} className={buttonVariants()}>
            <Plus />
            חדש
          </Link>
        }
      />
      <ExamsList />
    </div>
  );
}
