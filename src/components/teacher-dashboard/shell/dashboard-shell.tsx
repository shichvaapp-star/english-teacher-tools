"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Menu, PanelRightClose, PanelRightOpen, Plus, RefreshCw, ShieldCheck } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { useTeacherSession } from "../teacher-dashboard-context";
import { DashboardNav } from "./dashboard-nav";
import { GlobalSearch } from "./global-search";
import { useSidebarCollapsed } from "./use-sidebar-collapsed";
import type { NavKey } from "./nav-items";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { c, user } = useTeacherSession();
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);

  const newSuggestions = c.suggestions.filter((s) => s.status === "new").length;
  const counts: Partial<Record<NavKey, number>> = {
    turnIns: c.pendingSubmissionsCount,
    assignments: c.activeAssignmentsCount,
    students: c.students.length,
    banks: c.vocabBanks.length,
    adminTeachers: c.teachers.length,
    suggestions: newSuggestions,
  };
  const attention: Partial<Record<NavKey, boolean>> = { turnIns: true, suggestions: true };
  const isRefreshing = c.isLoadingSubmissions || c.isLoadingStudents;

  const brand = (compact: boolean) => (
    <Link href="/teacher/dashboard" className="flex min-w-0 items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <GraduationCap className="size-4" />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-sidebar-foreground">לוח מורה</span>
          <span className="block truncate text-2xs text-muted-foreground">{user.schoolName || "חטיבת ביניים"}</span>
        </span>
      )}
    </Link>
  );

  const nav = (compact: boolean, onNavigate?: () => void) => (
    <DashboardNav isAdmin={Boolean(user.isAdmin)} counts={counts} attention={attention} collapsed={compact} onNavigate={onNavigate} />
  );

  return (
    <div dir="rtl" className="flex min-h-screen w-full bg-background text-foreground print:hidden">
      {/* Desktop sidebar (right side in RTL) */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-l border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className={cn("flex h-14 items-center border-b border-sidebar-border px-3", collapsed && "justify-center px-0")}>
          {brand(collapsed)}
        </div>
        <div className="flex-1 overflow-y-auto p-2">{nav(collapsed)}</div>
        <div className={cn("flex flex-col gap-1 border-t border-sidebar-border p-2", collapsed && "items-center")}>
          <Link
            href="/"
            className={cn(
              "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              collapsed && "w-9 justify-center px-0"
            )}
          >
            <ArrowRight className="size-4" />
            {!collapsed && <span>חזרה לאתר</span>}
          </Link>
          <Button
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("h-9 justify-start gap-2.5 px-2.5 font-normal text-muted-foreground", collapsed && "w-9 justify-center px-0")}
            aria-label={collapsed ? "הרחב תפריט" : "כווץ תפריט"}
          >
            {collapsed ? <PanelRightOpen className="size-4" /> : <PanelRightClose className="size-4" />}
            {!collapsed && <span>כווץ תפריט</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" showCloseButton={false} className="w-72 gap-0 bg-sidebar p-0" dir="rtl">
          <SheetTitle className="sr-only">תפריט</SheetTitle>
          <div className="flex h-14 items-center border-b border-sidebar-border px-3">{brand(false)}</div>
          <div className="flex-1 overflow-y-auto p-2">{nav(false, () => setMobileOpen(false))}</div>
          <div className="border-t border-sidebar-border p-2">
            <Link href="/" className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent/60">
              <ArrowRight className="size-4" />
              <span>חזרה לאתר</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur sm:px-5">
          <Button variant="ghost" size="icon-lg" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="פתח תפריט">
            <Menu />
          </Button>
          <div className="lg:hidden">{brand(true)}</div>

          <GlobalSearch />

          <div className="flex-1" />

          {user.isAdmin && (
            <span className="hidden items-center gap-1 rounded-full bg-admin/10 px-2 py-0.5 text-2xs font-semibold text-admin sm:inline-flex">
              <ShieldCheck className="size-3" />
              Admin
            </span>
          )}

          <Button onClick={() => c.openAssignModal()} className="h-9 gap-1.5 px-3">
            <Plus className="size-4" />
            <span className="hidden sm:inline">משימה חדשה</span>
          </Button>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  onClick={c.handleRefreshAll}
                  disabled={isRefreshing}
                  aria-label="רענון נתונים"
                />
              }
            >
              <RefreshCw className={cn(isRefreshing && "animate-spin")} />
            </TooltipTrigger>
            <TooltipContent side="bottom">רענון נתונים</TooltipContent>
          </Tooltip>
          <ThemeToggle />
          <UserNav />
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
