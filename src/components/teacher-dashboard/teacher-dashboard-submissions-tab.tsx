"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";


import { TurnInsTable } from "@/app/teacher/dashboard/turn-ins-table";
import { type TeacherDashboardController } from "@/components/teacher-dashboard/use-teacher-dashboard";

export function TeacherDashboardSubmissionsTab({ c }: { c: TeacherDashboardController }) {
  const {
    activeTab,
    availableClasses,
    classFilter,
    filteredSubmissions,
    groupFilter,
    handleAiReview,
    handleDeleteSubmission,
    handleOpenReview,
    handleQuickSaveGrade,
    loadingAiSubId,
    pendingSubmissionsCount,
    reviewedSubmissionsCount,
    searchQuery,
    setClassFilter,
    setGroupFilter,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    statusFilter,
    totalSubmissionsCount,
    typeFilter,
  } = c;
  return (
    <>
      {/* -------------------------------------------------------------------
          TAB 1: SUBMISSIONS TABLE VIEW
          ------------------------------------------------------------------- */}
      {activeTab === "submissions" && (
        <div className="space-y-4 print:hidden" dir="rtl">
          {/* Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Segmented Tabs */}
              <div className="inline-flex rounded-lg p-0.5 bg-muted/60 border border-border/80 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer text-xs ${
                    statusFilter === "all" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  הכל ({totalSubmissionsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("submitted")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer text-xs ${
                    statusFilter === "submitted" ? "bg-amber-500/20 text-amber-800 dark:text-amber-200" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ממתין ({pendingSubmissionsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("reviewed")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer text-xs ${
                    statusFilter === "reviewed" ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-200" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  נבדקו ({reviewedSubmissionsCount})
                </button>
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as "all" | "writing" | "unseen" | "vocab")}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">כל המשימות</option>
                <option value="vocab">🔤 אוצר מילים</option>
                <option value="writing">✍️ כתיבה</option>
                <option value="unseen">📖 אנסין</option>
              </select>

              {/* Class Filter */}
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">כל הכיתות</option>
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    כיתה {cls}
                  </option>
                ))}
              </select>

              {/* Grouping Filter */}
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">כל ההקבצות</option>
                <option value="א1">הקבצה א1</option>
                <option value="א2">הקבצה א2</option>
                <option value="ב">הקבצה ב</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <Search className="h-3.5 w-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי תלמיד, משימה או קוד..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pr-8 pl-3 text-xs w-full"
                dir="rtl"
              />
            </div>
          </div>

          {/* Turn-ins Data Table */}
          <TurnInsTable
            submissions={filteredSubmissions}
            onOpenFullReview={handleOpenReview}
            onAiReview={handleAiReview}
            onDeleteSubmission={handleDeleteSubmission}
            onQuickSaveGrade={handleQuickSaveGrade}
            loadingAiSubId={loadingAiSubId}
          />
        </div>
      )}
    </>
  );
}
