"use client";

import React from "react";
import { ConfirmProvider } from "@/components/teacher-dashboard/shared-ui/confirm-dialog";
import { TeacherDashboardProvider } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { DashboardFrame } from "@/components/teacher-dashboard/dashboard-frame";

export default function TeacherDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfirmProvider>
      <TeacherDashboardProvider>
        <DashboardFrame>{children}</DashboardFrame>
      </TeacherDashboardProvider>
    </ConfirmProvider>
  );
}
