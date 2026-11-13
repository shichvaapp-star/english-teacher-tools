"use client";

import React from "react";
import { AlertCircle, Loader2, Shuffle } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StudentGroup } from "@/types/auth";
import { FilterSelect } from "./shared-ui/filter-select";
import { type TeacherDashboardController } from "./use-teacher-dashboard";

const GRADE_OPTIONS = [
  { value: "ז", label: "ז׳" },
  { value: "ח", label: "ח׳" },
  { value: "ט", label: "ט׳" },
  { value: "י", label: "י׳" },
  { value: "יא", label: "י״א" },
  { value: "יב", label: "י״ב" },
];
const NUMBER_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: String(n) }));
const GROUPS: { value: StudentGroup | "none"; label: string }[] = [
  { value: "א1", label: "א1" },
  { value: "א2", label: "א2" },
  { value: "ב", label: "ב" },
  { value: "none", label: "ללא" },
];

export function TeacherDashboardStudentModal({ c }: { c: TeacherDashboardController }) {
  const {
    editingStudent,
    handleGenerateRandomPin,
    handleSaveStudent,
    isSavingStudent,
    setStudentGradeInput,
    setStudentGroupInput,
    setStudentModalOpen,
    setStudentNameInput,
    setStudentNumberInput,
    setStudentPinInput,
    studentFormError,
    studentGradeInput,
    studentGroupInput,
    studentModalOpen,
    studentNameInput,
    studentNumberInput,
    studentPinInput,
  } = c;

  return (
    <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
      <DialogContent className="sm:max-w-md [&>[data-slot=dialog-close]]:right-auto [&>[data-slot=dialog-close]]:left-2" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle>{editingStudent ? `עריכת ${editingStudent.name}` : "תלמיד/ה חדש/ה"}</DialogTitle>
          <DialogDescription>שם באנגלית, כיתה, הקבצה וקוד PIN בן 4 ספרות לכניסה.</DialogDescription>
        </DialogHeader>

        <form id="student-form" onSubmit={handleSaveStudent} className="space-y-4">
          {studentFormError && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {studentFormError}
            </div>
          )}

          <Field label="שם מלא באנגלית" htmlFor="student-name">
            <Input
              id="student-name"
              placeholder="e.g. Maya Cohen"
              value={studentNameInput}
              onChange={(e) => setStudentNameInput(e.target.value)}
              dir="ltr"
              required
              autoFocus
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="שכבה">
              <FilterSelect aria-label="שכבה" value={studentGradeInput} onChange={setStudentGradeInput} options={GRADE_OPTIONS} className="h-8 w-full" />
            </Field>
            <Field label="מספר כיתה">
              <FilterSelect
                aria-label="מספר כיתה"
                value={String(studentNumberInput)}
                onChange={(v) => setStudentNumberInput(Number(v))}
                options={NUMBER_OPTIONS}
                className="h-8 w-full"
              />
            </Field>
          </div>

          <Field label="הקבצה באנגלית">
            <div className="grid grid-cols-4 gap-1 rounded-lg bg-muted p-1">
              {GROUPS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setStudentGroupInput(g.value)}
                  aria-pressed={studentGroupInput === g.value}
                  className={cn(
                    "h-7 cursor-pointer rounded-md text-xs font-medium transition-colors",
                    studentGroupInput === g.value ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label="קוד PIN"
            htmlFor="student-pin"
            aside={
              <button
                type="button"
                onClick={handleGenerateRandomPin}
                className="inline-flex cursor-pointer items-center gap-1 text-2xs text-muted-foreground hover:text-foreground"
              >
                <Shuffle className="size-3" />
                הגרל
              </button>
            }
          >
            <Input
              id="student-pin"
              inputMode="numeric"
              maxLength={4}
              placeholder="1234"
              value={studentPinInput}
              onChange={(e) => setStudentPinInput(e.target.value.replace(/\D/g, ""))}
              className="text-center font-mono tracking-[0.5em]"
              dir="ltr"
              required
            />
          </Field>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setStudentModalOpen(false)}>
            ביטול
          </Button>
          <Button type="submit" form="student-form" disabled={isSavingStudent}>
            {isSavingStudent && <Loader2 className="animate-spin" />}
            {editingStudent ? "שמור שינויים" : "הוסף תלמיד/ה"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  aside,
  children,
}: {
  label: string;
  htmlFor?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-xs font-medium text-foreground">
          {label}
        </label>
        {aside}
      </div>
      {children}
    </div>
  );
}
