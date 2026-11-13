"use client";

import React from "react";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { EmptyState } from "@/components/teacher-dashboard/shared-ui/empty-state";
import { useDashboard } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { ShieldCheck } from "lucide-react";
import { AdminTeachersView } from "../../admin-teachers-view";

export default function AdminTeachersPage() {
  const c = useDashboard();
  if (!c.user?.isAdmin) {
    return <EmptyState icon={ShieldCheck} title="אזור למנהלי מערכת בלבד" />;
  }
  return (
    <div className="space-y-6">
      <PageHeader title="ניהול מורים" description="מורים רשומים במערכת והרשאות ניהול." />
      <AdminTeachersView teachers={c.teachers} />
    </div>
  );
}
