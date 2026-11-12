"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserPlus,
  Edit2,
  Check,
  X,
  AlertCircle,
  Shuffle,
} from "lucide-react";

import { StudentGroup } from "@/types/auth";

import { type TeacherDashboardController } from "@/components/teacher-dashboard/use-teacher-dashboard";

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
    <>
      {/* -------------------------------------------------------------------
          MODAL: ADD / EDIT STUDENT (With Grouping Input)
          ------------------------------------------------------------------- */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  {editingStudent ? <Edit2 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-black text-base text-foreground">
                    {editingStudent ? `עריכת פרטי תלמיד/ה: ${editingStudent.name}` : "הוספת תלמיד/ה חדש/ה"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    הגדירו שם, כיתה, הקבצה באנגלית וקוד PIN לכניסה.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStudentModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3.5 text-xs">
              {studentFormError && (
                <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{studentFormError}</span>
                </div>
              )}

              {/* English Name */}
              <div className="space-y-1">
                <label className="font-bold text-foreground block">
                  שם מלא באנגלית (English Name) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Maya Cohen"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  className="h-9 text-xs"
                  dir="ltr"
                  required
                />
              </div>

              {/* Class Grade & Number */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground block">שכבה:</label>
                  <select
                    value={studentGradeInput}
                    onChange={(e) => setStudentGradeInput(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs cursor-pointer"
                  >
                    <option value="ז">שכבה ז׳</option>
                    <option value="ח">שכבה ח׳</option>
                    <option value="ט">שכבה ט׳</option>
                    <option value="י">שכבה י׳</option>
                    <option value="יא">שכבה י״א</option>
                    <option value="יב">שכבה י״ב</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground block">מספר כיתה:</label>
                  <select
                    value={studentNumberInput}
                    onChange={(e) => setStudentNumberInput(Number(e.target.value))}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs cursor-pointer"
                  >
                    <option value={1}>כיתה 1</option>
                    <option value={2}>כיתה 2</option>
                    <option value={3}>כיתה 3</option>
                    <option value={4}>כיתה 4</option>
                    <option value={5}>כיתה 5</option>
                    <option value={6}>כיתה 6</option>
                  </select>
                </div>
              </div>

              {/* English Grouping (הקבצה) */}
              <div className="space-y-1">
                <label className="font-bold text-foreground block">
                  הקבצה באנגלית (English Grouping):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["א1", "א2", "ב"] as StudentGroup[]).map((grp) => (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setStudentGroupInput(grp)}
                      className={`p-2 rounded-lg border text-center font-bold text-xs cursor-pointer transition-all ${
                        studentGroupInput === grp
                          ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300"
                          : "border-border hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      הקבצה {grp}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStudentGroupInput("none")}
                    className={`p-2 rounded-lg border text-center text-xs cursor-pointer transition-all ${
                      studentGroupInput === "none"
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    ללא
                  </button>
                </div>
              </div>

              {/* PIN Code */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground">
                    קוד PIN אישי (4 ספרות) <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPin}
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    <Shuffle className="h-3 w-3" />
                    <span>הגרל קוד</span>
                  </button>
                </div>
                <Input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={studentPinInput}
                  onChange={(e) => setStudentPinInput(e.target.value.replace(/\D/g, ""))}
                  className="h-9 text-xs font-mono tracking-widest text-center"
                  dir="ltr"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStudentModalOpen(false)}
                  className="text-xs cursor-pointer"
                >
                  ביטול
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSavingStudent}
                  className="text-xs font-bold gap-1.5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{isSavingStudent ? "שומר..." : editingStudent ? "שמור שינויים" : "הוסף תלמיד/ה"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
