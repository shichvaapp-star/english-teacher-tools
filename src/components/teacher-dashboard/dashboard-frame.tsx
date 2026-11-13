"use client";

import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { AssignTaskModal } from "@/app/teacher/dashboard/assign-task-modal";
import { VocabBankModal } from "@/app/teacher/dashboard/vocab-bank-modal";
import { useDashboard } from "./teacher-dashboard-context";
import { TeacherDashboardSignInGate } from "./teacher-dashboard-sign-in-gate";
import { TeacherDashboardStudentModal } from "./teacher-dashboard-student-modal";
import { TeacherDashboardPrintSheet } from "./teacher-dashboard-print-sheet";
import { DashboardShell } from "./shell/dashboard-shell";

/** Sign-in gate + app shell + the modals every dashboard route can open. */
export function DashboardFrame({ children }: { children: React.ReactNode }) {
  const c = useDashboard();
  const { user } = c;

  if (!user || user.role !== "teacher") {
    return <TeacherDashboardSignInGate c={c} />;
  }

  return (
    <>
      <DashboardShell>{children}</DashboardShell>

      <TeacherDashboardStudentModal c={c} />

      <AssignTaskModal
        open={c.assignModalOpen}
        onOpenChange={(open) => {
          c.setAssignModalOpen(open);
          if (!open) {
            c.setAssignPreselectedStudentId(null);
            c.setPreselectedBankForAssign(null);
            c.setSharedTemplateForAssign(null);
          }
        }}
        teacherId={user.id}
        teacherName={user.name}
        students={c.students}
        availableClasses={c.availableClasses}
        onTaskAssigned={c.handleTaskAssigned}
        preselectedStudentId={c.assignPreselectedStudentId}
        customBanks={c.vocabBanks}
        preselectedVocabBank={c.preselectedBankForAssign}
        initialAssignmentTemplate={c.sharedTemplateForAssign}
      />

      {c.vocabBankModalOpen && (
        <VocabBankModal
          open={c.vocabBankModalOpen}
          onOpenChange={(open) => {
            c.setVocabBankModalOpen(open);
            if (!open) c.setEditingBank(null);
          }}
          teacherId={user.id}
          bankToEdit={c.editingBank}
          onSave={c.handleSaveVocabBank}
        />
      )}

      <TeacherDashboardPrintSheet c={c} />
      <Toaster position="top-center" dir="rtl" richColors closeButton />
    </>
  );
}
