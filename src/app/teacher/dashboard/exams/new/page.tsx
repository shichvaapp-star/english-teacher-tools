"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { ExamForm } from "@/components/teacher-dashboard/exams/exam-form";
import { DASHBOARD_BASE } from "@/components/teacher-dashboard/shell/nav-items";

export default function NewExamPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="מבחן חדש" breadcrumb={<Link href={`${DASHBOARD_BASE}/exams`}>מבחנים</Link>} />
      <ExamForm />
    </div>
  );
}
