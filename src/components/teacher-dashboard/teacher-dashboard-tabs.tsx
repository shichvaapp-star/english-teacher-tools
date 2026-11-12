"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  UserPlus,
  Printer,
  Send,
  Plus,
  MessageSquarePlus,
  BookA,
  ShieldCheck,
  Share2,
} from "lucide-react";


import { type TeacherDashboardController } from "@/components/teacher-dashboard/use-teacher-dashboard";

export function TeacherDashboardTabs({ c }: { c: TeacherDashboardController }) {
  const {
    activeTab,
    assignments,
    handleOpenAddStudent,
    pendingSubmissionsCount,
    setActiveTab,
    setEditingBank,
    setVocabBankModalOpen,
    students,
    suggestions,
    teachers,
    totalSubmissionsCount,
    user,
    vocabBanks,
  } = c;
  return (
    <>
      {/* Segmented Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-2.5 print:hidden" dir="rtl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("submissions")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "submissions"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>טבלת הגשות ובדיקה</span>
            <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
              activeTab === "submissions" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {totalSubmissionsCount}
            </span>
            {pendingSubmissionsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white">
                {pendingSubmissionsCount} להערכה
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("assignments")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "assignments"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>משימות שהוקצו</span>
            <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
              activeTab === "assignments" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {assignments.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "students"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>ניהול תלמידים רשומים</span>
            <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
              activeTab === "students" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {students.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("banks")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "banks"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <BookA className="h-4 w-4" />
            <span>מאגרי מילים שלי</span>
            <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
              activeTab === "banks" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {vocabBanks.length}
            </span>
          </button>

          {/* Shared Content Hub */}
          <button
            type="button"
            onClick={() => setActiveTab("shared")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "shared"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>מאגר משותף</span>
          </button>

          {/* Admin: Teachers Management */}
          {user?.isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab("adminTeachers")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "adminTeachers"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>ניהול מורים (Admin)</span>
              <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
                activeTab === "adminTeachers" ? "bg-white/20 text-white" : "bg-purple-500/20 text-purple-700 dark:text-purple-300"
              }`}>
                {teachers.length}
              </span>
            </button>
          )}

          {/* Admin: Suggestions */}
          {user?.isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab("suggestions")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "suggestions"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>הצעות ומשוב (Admin)</span>
              <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
                activeTab === "suggestions" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {suggestions.length}
              </span>
              {suggestions.filter((s) => s.status === "new").length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white">
                  {suggestions.filter((s) => s.status === "new").length} חדשות
                </span>
              )}
            </button>
          )}
        </div>

        {activeTab === "banks" && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => {
                setEditingBank(null);
                setVocabBankModalOpen(true);
              }}
              className="h-8 text-xs font-bold gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ ייבוא מאגר מקובץ / יצירה</span>
            </Button>
          </div>
        )}

        {activeTab === "students" && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleOpenAddStudent}
              className="h-8 text-xs font-bold gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>הוסף תלמיד/ה</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="h-8 text-xs gap-1.5 cursor-pointer border-border/80"
              title="הדפס כרטיסי תלמידים"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">הדפס רשימת כיתה</span>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
