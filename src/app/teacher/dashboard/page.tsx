"use client";

import React from "react";


import { ReviewDialog } from "./review-dialog";
import { AssignTaskModal } from "./assign-task-modal";
import { AssignedTasksView } from "./assigned-tasks-view";
import { AdminSuggestionsView } from "./admin-suggestions-view";
import { CustomVocabBanksView } from "./custom-vocab-banks-view";
import { VocabBankModal } from "./vocab-bank-modal";
import { AdminTeachersView } from "./admin-teachers-view";
import { SharedResourcesView } from "./shared-resources-view";
import { useTeacherDashboard } from "@/components/teacher-dashboard/use-teacher-dashboard";
import { TeacherDashboardPrintSheet } from "@/components/teacher-dashboard/teacher-dashboard-print-sheet";
import { TeacherDashboardSignInGate } from "@/components/teacher-dashboard/teacher-dashboard-sign-in-gate";
import { TeacherDashboardHeader } from "@/components/teacher-dashboard/teacher-dashboard-header";
import { TeacherDashboardStudentHistory } from "@/components/teacher-dashboard/teacher-dashboard-student-history";
import { TeacherDashboardOverview } from "@/components/teacher-dashboard/teacher-dashboard-overview";
import { TeacherDashboardSubmissionsTab } from "@/components/teacher-dashboard/teacher-dashboard-submissions-tab";
import { TeacherDashboardStudentModal } from "@/components/teacher-dashboard/teacher-dashboard-student-modal";
import { TeacherDashboardTabs } from "@/components/teacher-dashboard/teacher-dashboard-tabs";
import { TeacherDashboardStudentsTab } from "@/components/teacher-dashboard/teacher-dashboard-students-tab";

export default function TeacherDashboardPage() {
  const c = useTeacherDashboard();
  const {
    activeTab,
    assignModalOpen,
    assignPreselectedStudentId,
    assignments,
    availableClasses,
    editingBank,
    fetchSuggestions,
    fetchVocabBanks,
    handleAiReview,
    handleArchiveAssignment,
    handleAssignFromBank,
    handleDeleteSuggestion,
    handleDeleteVocabBank,
    handleSaveGradeModal,
    handleSaveVocabBank,
    handleTaskAssigned,
    handleToggleAssignmentDavid,
    handleToggleShareBank,
    handleUpdateSuggestion,
    handleUseSharedAssignment,
    isEvaluatingAi,
    isLoadingSuggestions,
    preselectedBankForAssign,
    reviewItem,
    setAssignModalOpen,
    setAssignPreselectedStudentId,
    setEditingBank,
    setPreselectedBankForAssign,
    setReviewItem,
    setSharedTemplateForAssign,
    setVocabBankModalOpen,
    sharedTemplateForAssign,
    students,
    submissions,
    suggestions,
    teachers,
    user,
    vocabBankModalOpen,
    vocabBanks,
    writingAiResult,
  } = c;

  // AUTH GUARD
  if (!user || user.role !== "teacher") {
    return <TeacherDashboardSignInGate c={c} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground print:bg-white print:text-black overflow-x-hidden">
      <TeacherDashboardHeader c={c} />

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-3 sm:px-8 py-5 sm:py-7 space-y-5">
        <TeacherDashboardOverview c={c} />

        <TeacherDashboardTabs c={c} />

        <TeacherDashboardSubmissionsTab c={c} />

        {/* -------------------------------------------------------------------
            TAB 2: ASSIGNED TASKS VIEW
            ------------------------------------------------------------------- */}
        {activeTab === "assignments" && (
          <div className="print:hidden">
            <AssignedTasksView
              assignments={assignments}
              submissions={submissions}
              students={students}
              onArchiveAssignment={handleArchiveAssignment}
              onToggleDavid={handleToggleAssignmentDavid}
              onOpenAssignModal={() => setAssignModalOpen(true)}
            />
          </div>
        )}

        <TeacherDashboardStudentsTab c={c} />

        {/* -------------------------------------------------------------------
            TAB 4: CUSTOM VOCABULARY BANKS VIEW
            ------------------------------------------------------------------- */}
        {activeTab === "banks" && (
          <div className="print:hidden">
            <CustomVocabBanksView
              banks={vocabBanks}
              onOpenCreateModal={() => {
                setEditingBank(null);
                setVocabBankModalOpen(true);
              }}
              onEditBank={(bank) => {
                setEditingBank(bank);
                setVocabBankModalOpen(true);
              }}
              onDeleteBank={handleDeleteVocabBank}
              onAssignFromBank={handleAssignFromBank}
              onToggleShare={handleToggleShareBank}
            />
          </div>
        )}

        {/* -------------------------------------------------------------------
            TAB 5: SHARED COMMUNITY RESOURCES VIEW
            ------------------------------------------------------------------- */}
        {activeTab === "shared" && (
          <div className="print:hidden">
            <SharedResourcesView
              onAssignFromBank={(bank) => {
                setPreselectedBankForAssign(bank);
                setAssignModalOpen(true);
              }}
              onUseSharedAssignment={handleUseSharedAssignment}
              onBankCloned={fetchVocabBanks}
            />
          </div>
        )}

        {/* -------------------------------------------------------------------
            TAB 6: ADMIN TEACHERS MANAGEMENT VIEW
            ------------------------------------------------------------------- */}
        {activeTab === "adminTeachers" && user?.isAdmin && (
          <div className="print:hidden">
            <AdminTeachersView teachers={teachers} />
          </div>
        )}

        {/* -------------------------------------------------------------------
            TAB 7: SITE SUGGESTIONS & EDITS (ADMIN VIEW)
            ------------------------------------------------------------------- */}
        {activeTab === "suggestions" && user?.isAdmin && (
          <div className="print:hidden">
            <AdminSuggestionsView
              suggestions={suggestions}
              onRefresh={fetchSuggestions}
              isLoading={isLoadingSuggestions}
              onUpdateSuggestion={handleUpdateSuggestion}
              onDeleteSuggestion={handleDeleteSuggestion}
            />
          </div>
        )}
      </main>

      <TeacherDashboardStudentModal c={c} />

      <TeacherDashboardStudentHistory c={c} />

      {/* -------------------------------------------------------------------
          MODAL: FULL REVIEW & RUBRIC DIALOG
          ------------------------------------------------------------------- */}
      <ReviewDialog
        reviewItem={reviewItem}
        onClose={() => setReviewItem(null)}
        onSaveGrade={handleSaveGradeModal}
        onAiReview={handleAiReview}
        isEvaluatingAi={isEvaluatingAi}
        writingAiResult={writingAiResult}
      />

      {/* -------------------------------------------------------------------
          MODAL: ASSIGN TASK TO STUDENTS
          ------------------------------------------------------------------- */}
      <AssignTaskModal
        open={assignModalOpen}
        onOpenChange={(open) => {
          setAssignModalOpen(open);
          if (!open) {
            setAssignPreselectedStudentId(null);
            setPreselectedBankForAssign(null);
            setSharedTemplateForAssign(null);
          }
        }}
        teacherId={user.id}
        teacherName={user.name}
        students={students}
        availableClasses={availableClasses}
        onTaskAssigned={handleTaskAssigned}
        preselectedStudentId={assignPreselectedStudentId}
        customBanks={vocabBanks}
        preselectedVocabBank={preselectedBankForAssign}
        initialAssignmentTemplate={sharedTemplateForAssign}
      />

      {/* -------------------------------------------------------------------
          MODAL: CREATE / IMPORT VOCABULARY BANK
          ------------------------------------------------------------------- */}
      {vocabBankModalOpen && (
        <VocabBankModal
          open={vocabBankModalOpen}
          onOpenChange={(open) => {
            setVocabBankModalOpen(open);
            if (!open) setEditingBank(null);
          }}
          teacherId={user.id}
          bankToEdit={editingBank}
          onSave={handleSaveVocabBank}
        />
      )}

      <TeacherDashboardPrintSheet c={c} />
    </div>
  );
}
