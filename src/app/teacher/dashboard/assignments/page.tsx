"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { AssignmentsByProgress } from "@/components/teacher-dashboard/assignments/assignments-by-progress";
import { useDashboard } from "@/components/teacher-dashboard/teacher-dashboard-context";

export default function AssignmentsPage() {
  const c = useDashboard();
  const totalPending = Array.from(c.assignmentProgress.values()).reduce((n, p) => n + p.pending, 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title="משימות"
        description={`${c.assignments.length} משימות שהוקצו${totalPending > 0 ? ` · ${totalPending} הגשות ממתינות לבדיקה` : ""}`}
        actions={
          <Button onClick={() => c.openAssignModal()} className="gap-1.5">
            <Plus className="size-4" />
            משימה חדשה
          </Button>
        }
      />
      <AssignmentsByProgress />
    </div>
  );
}
