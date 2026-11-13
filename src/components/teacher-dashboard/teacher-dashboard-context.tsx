"use client";

import React, { createContext, useContext } from "react";
import { useTeacherDashboard, type TeacherDashboardController } from "./use-teacher-dashboard";

const TeacherDashboardContext = createContext<TeacherDashboardController | null>(null);

/** Runs the dashboard data hook once (in the layout) so data and listeners survive route changes. */
export function TeacherDashboardProvider({ children }: { children: React.ReactNode }) {
  const controller = useTeacherDashboard();
  return <TeacherDashboardContext.Provider value={controller}>{children}</TeacherDashboardContext.Provider>;
}

export function useDashboard(): TeacherDashboardController {
  const ctx = useContext(TeacherDashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside <TeacherDashboardProvider>");
  return ctx;
}

/** Same as useDashboard, but with the signed-in teacher narrowed to non-null (pages render only after the gate). */
export function useTeacherSession() {
  const c = useDashboard();
  const { user } = c;
  if (!user || user.role !== "teacher") {
    throw new Error("useTeacherSession used before the teacher sign-in gate");
  }
  return { c, user };
}
