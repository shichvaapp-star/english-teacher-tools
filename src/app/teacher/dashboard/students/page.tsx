"use client";

import React, { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Copy, Edit2, Eye, EyeOff, MoreHorizontal, Printer, Search, Send, Trash2, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/teacher-dashboard/shared-ui/page-header";
import { EmptyState } from "@/components/teacher-dashboard/shared-ui/empty-state";
import { FilterSelect, type FilterOption } from "@/components/teacher-dashboard/shared-ui/filter-select";
import { StudentAvatar } from "@/components/teacher-dashboard/shared-ui/student-avatar";
import { GradePill } from "@/components/teacher-dashboard/shared-ui/status-badge";
import { StudentSheet } from "@/components/teacher-dashboard/students/student-sheet";
import { useDashboard } from "@/components/teacher-dashboard/teacher-dashboard-context";
import { formatCompactTime } from "@/lib/submission-time";

const GROUP_OPTIONS: FilterOption[] = [
  { value: "all", label: "כל ההקבצות" },
  { value: "א1", label: "הקבצה א1" },
  { value: "א2", label: "הקבצה א2" },
  { value: "ב", label: "הקבצה ב" },
];

function StudentsContent() {
  const c = useDashboard();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sheetStudentId = searchParams.get("student");
  const sheetStudent = sheetStudentId ? c.students.find((s) => s.id === sheetStudentId) ?? null : null;

  const openSheet = (id: string | null) =>
    router.replace(id ? `${pathname}?student=${encodeURIComponent(id)}` : pathname, { scroll: false });

  const classOptions: FilterOption[] = useMemo(
    () => [
      { value: "all", label: `כל הכיתות (${c.students.length})` },
      ...c.availableClasses.map((cls) => ({
        value: cls,
        label: `כיתה ${cls} (${c.students.filter((s) => s.fullClass === cls || s.classGrade === cls).length})`,
      })),
    ],
    [c.availableClasses, c.students]
  );

  const rows = c.filteredStudents.map((s) => ({ student: s, stats: c.getStudentStats(s) }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="תלמידים"
        description={`${c.students.length} תלמידים רשומים`}
        actions={
          <>
            <Button onClick={c.handleOpenAddStudent} className="gap-1.5">
              <UserPlus className="size-4" />
              תלמיד/ה חדש/ה
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="אפשרויות נוספות" />}>
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => c.setShowPins(!c.showPins)}>
                  {c.showPins ? <EyeOff /> : <Eye />}
                  {c.showPins ? "הסתר קודי PIN" : "הצג קודי PIN"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer />
                  הדפס רשימה וקודי כניסה
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search className="absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={c.studentSearchQuery}
            onChange={(e) => c.setStudentSearchQuery(e.target.value)}
            placeholder="חיפוש לפי שם או כיתה…"
            className="h-8 pr-8 text-xs"
          />
        </div>
        <div className="flex gap-2">
          <FilterSelect aria-label="כיתה" value={c.studentClassFilter} onChange={c.setStudentClassFilter} options={classOptions} />
          <FilterSelect aria-label="הקבצה" value={c.studentGroupFilter} onChange={c.setStudentGroupFilter} options={GROUP_OPTIONS} />
        </div>
      </div>

      {c.isLoadingStudents && c.students.length === 0 ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title={c.students.length === 0 ? "עדיין אין תלמידים" : "לא נמצאו תלמידים תואמים"}
          description="הוסיפו תלמידים ידנית, או שהם יבחרו בך כמורה כשהם מתחברים."
          action={
            c.students.length === 0 ? (
              <Button onClick={c.handleOpenAddStudent} className="gap-1.5">
                <UserPlus className="size-4" />
                הוספת תלמיד/ה ראשון/ה
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-right">שם</TableHead>
                <TableHead className="text-right">כיתה</TableHead>
                <TableHead className="hidden text-right md:table-cell">PIN</TableHead>
                <TableHead className="text-right">הגשות</TableHead>
                <TableHead className="text-right">ממוצע</TableHead>
                <TableHead className="hidden text-right lg:table-cell">פעילות אחרונה</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ student, stats }) => {
                const copied = c.copiedPinStudentId === student.id;
                return (
                  <TableRow key={student.id} className="cursor-pointer" onClick={() => openSheet(student.id)}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <StudentAvatar name={student.name} className="size-7" />
                        <span className="truncate font-medium text-foreground" dir="ltr">
                          {student.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {student.fullClass || "—"}
                      {student.group && <span className="text-foreground/70"> · {student.group}</span>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => c.handleCopyPin(student)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-xs text-foreground hover:bg-muted"
                        aria-label="העתק PIN"
                        dir="ltr"
                      >
                        {c.showPins ? student.pin : "••••"}
                        {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3 text-muted-foreground" />}
                      </button>
                    </TableCell>
                    <TableCell className="text-xs tabular-nums">
                      {stats.total}
                      {stats.pending > 0 && <span className="mr-1.5 text-2xs text-warning-foreground dark:text-warning">({stats.pending} לבדיקה)</span>}
                    </TableCell>
                    <TableCell>
                      <GradePill grade={stats.average} />
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                      {stats.lastActivityTs ? formatCompactTime(new Date(stats.lastActivityTs).toISOString(), c.now) : "—"}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`פעולות עבור ${student.name}`} />}>
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => c.openAssignModal({ studentId: student.id })}>
                            <Send />
                            הקצה משימה
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => c.handleOpenEditStudent(student)}>
                            <Edit2 />
                            עריכה
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={() => c.handleDeleteStudent(student)}>
                            <Trash2 />
                            הסרה
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <StudentSheet student={sheetStudent} onOpenChange={(open) => !open && openSheet(null)} />
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <StudentsContent />
    </Suspense>
  );
}
