"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";


import { type TeacherDashboardController } from "@/components/teacher-dashboard/use-teacher-dashboard";

export function TeacherDashboardOverview({ c }: { c: TeacherDashboardController }) {
  const {
    activeAssignmentsCount,
    activeTab,
    pendingSubmissionsCount,
    reviewedSubmissionsCount,
    setActiveTab,
    setAssignModalOpen,
    setStatusFilter,
    statusFilter,
    totalSubmissionsCount,
    user,
  } = c;
  // Only rendered after the page's teacher sign-in guard.
  if (!user) return null;
  return (
    <>
      {/* Minimalist Greeting & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden" dir="rtl">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-foreground">
            שלום, {user.name}! 👋
          </h1>
          <p className="text-xs text-muted-foreground">
            לוח הבקרה המרכזי למעקב אחר הגשות, מתן ציונים והקצאת משימות לתלמידים.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => setAssignModalOpen(true)}
            className="h-9 text-xs font-bold gap-1.5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs px-4"
          >
            <Send className="h-3.5 w-3.5" />
            <span>הקצה משימה חדשה</span>
          </Button>
        </div>
      </div>

      {/* Minimalist KPI Metrics Strip - Compact Single Row */}
      <div className="grid grid-cols-4 gap-2 print:hidden" dir="rtl">
        <button
          type="button"
          onClick={() => {
            setActiveTab("submissions");
            setStatusFilter("all");
          }}
          className={`py-1.5 px-3 rounded-lg border text-right transition-all cursor-pointer shadow-2xs flex items-center justify-between ${
            activeTab === "submissions" && statusFilter === "all"
              ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
              : "border-border/70 bg-card hover:border-primary/30 hover:bg-muted/30"
          }`}
        >
          <span className="text-[11px] text-muted-foreground font-medium">סה״כ הגשות</span>
          <span className="text-sm font-black text-foreground">{totalSubmissionsCount}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("submissions");
            setStatusFilter("submitted");
          }}
          className={`py-1.5 px-3 rounded-lg border text-right transition-all cursor-pointer shadow-2xs flex items-center justify-between ${
            activeTab === "submissions" && statusFilter === "submitted"
              ? "border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/30"
              : "border-border/70 bg-card hover:border-amber-500/30 hover:bg-muted/30"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground font-medium">ממתינות לבדיקה</span>
            {pendingSubmissionsCount > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <span className="text-sm font-black text-amber-600 dark:text-amber-400">
            {pendingSubmissionsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("submissions");
            setStatusFilter("reviewed");
          }}
          className={`py-1.5 px-3 rounded-lg border text-right transition-all cursor-pointer shadow-2xs flex items-center justify-between ${
            activeTab === "submissions" && statusFilter === "reviewed"
              ? "border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/30"
              : "border-border/70 bg-card hover:border-emerald-500/30 hover:bg-muted/30"
          }`}
        >
          <span className="text-[11px] text-muted-foreground font-medium">נבדקו וניתן ציון</span>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
            {reviewedSubmissionsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("assignments")}
          className={`py-1.5 px-3 rounded-lg border text-right transition-all cursor-pointer shadow-2xs flex items-center justify-between ${
            activeTab === "assignments"
              ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
              : "border-border/70 bg-card hover:border-primary/30 hover:bg-muted/30"
          }`}
        >
          <span className="text-[11px] text-muted-foreground font-medium">משימות שהוקצו</span>
          <span className="text-sm font-black text-foreground">
            {activeAssignmentsCount}
          </span>
        </button>
      </div>
    </>
  );
}
