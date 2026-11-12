"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  Users,
  UserPlus,
  KeyRound,
  Edit2,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Send,
} from "lucide-react";


import { type TeacherDashboardController } from "@/components/teacher-dashboard/use-teacher-dashboard";

export function TeacherDashboardStudentsTab({ c }: { c: TeacherDashboardController }) {
  const {
    activeTab,
    availableClasses,
    copiedPinStudentId,
    filteredStudents,
    getStudentStats,
    handleCopyPin,
    handleDeleteStudent,
    handleOpenAddStudent,
    handleOpenEditStudent,
    setAssignModalOpen,
    setAssignPreselectedStudentId,
    setHistoryStudent,
    setShowPins,
    setStudentClassFilter,
    setStudentGroupFilter,
    setStudentSearchQuery,
    showPins,
    studentClassFilter,
    studentGroupFilter,
    studentSearchQuery,
    students,
  } = c;
  return (
    <>
      {/* -------------------------------------------------------------------
          TAB 3: STUDENTS ROSTER VIEW
          ------------------------------------------------------------------- */}
      {activeTab === "students" && (
        <div className="space-y-4 print:hidden" dir="rtl">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Class Filter */}
              <select
                value={studentClassFilter}
                onChange={(e) => setStudentClassFilter(e.target.value)}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-2xs cursor-pointer"
              >
                <option value="all">כל הכיתות ({students.length})</option>
                {availableClasses.map((cls) => {
                  const countInClass = students.filter(
                    (s) => s.fullClass === cls || s.classGrade === cls
                  ).length;
                  return (
                    <option key={cls} value={cls}>
                      כיתה {cls} ({countInClass})
                    </option>
                  );
                })}
              </select>

              {/* Grouping Filter */}
              <select
                value={studentGroupFilter}
                onChange={(e) => setStudentGroupFilter(e.target.value)}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs shadow-2xs cursor-pointer"
              >
                <option value="all">כל ההקבצות</option>
                <option value="א1">הקבצה א1</option>
                <option value="א2">הקבצה א2</option>
                <option value="ב">הקבצה ב</option>
              </select>

              {/* Show PINs Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPins(!showPins)}
                className="h-8 text-xs gap-1.5 cursor-pointer border-border/80"
              >
                {showPins ? <EyeOff className="h-3.5 w-3.5 text-primary" /> : <Eye className="h-3.5 w-3.5" />}
                <span>{showPins ? "הסתר קודי PIN" : "הצג קודי PIN"}</span>
              </Button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <Search className="h-3.5 w-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי שם או כיתה..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="h-8 pr-8 pl-3 text-xs w-full"
                dir="rtl"
              />
            </div>
          </div>

          {/* Students List */}
          {filteredStudents.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-border/80 bg-muted/20">
              <Users className="h-10 w-10 text-muted-foreground/50 mx-auto" />
              <h3 className="font-bold text-sm text-foreground">
                {students.length === 0 ? "טרם נרשמו תלמידים" : "לא נמצאו תלמידים תואמים"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                תוכל/י להוסיף תלמידים ידנית או שהם יתחברו ויבחרו בך כמורה שלהם.
              </p>
              {students.length === 0 && (
                <Button
                  size="sm"
                  onClick={handleOpenAddStudent}
                  className="gap-2 text-xs font-bold cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>הוסף תלמיד/ה ראשונ/ה</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredStudents.map((student) => {
                const stats = getStudentStats(student);
                const isCopied = copiedPinStudentId === student.id;

                return (
                  <div
                    key={student.id}
                    className="p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all shadow-2xs flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      {/* Top: Name, Class, Group & Actions */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-black text-sm text-foreground truncate" dir="ltr">
                            {student.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <Badge variant="outline" className="text-[10px] font-bold">
                              {student.fullClass || "כיתה"}
                            </Badge>

                            {student.group ? (
                              <Badge
                                variant="outline"
                                className="text-[10px] font-bold border-purple-500/40 text-purple-700 dark:text-purple-300 bg-purple-500/10"
                              >
                                הקבצה {student.group}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                                ללא הקבצה
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditStudent(student)}
                            className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                            title="ערוך פרטי תלמיד/ה והקבצה"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStudent(student)}
                            className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-destructive"
                            title="הסר תלמיד/ה"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* PIN Box */}
                      <div className="p-2 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground text-[11px]">קוד PIN:</span>
                          <span className="font-mono font-black text-foreground">
                            {showPins ? student.pin : "••••"}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyPin(student)}
                          className="h-6 px-2 text-[11px] gap-1 cursor-pointer"
                        >
                          {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          <span>{isCopied ? "הועתק!" : "העתק"}</span>
                        </Button>
                      </div>
                    </div>

                    {/* Submissions Count, Average & 1-Click Assign via David */}
                    <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setHistoryStudent(student)}
                          className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer font-bold text-[11px]"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>{stats.total > 0 ? `${stats.total} הגשות` : "אין הגשות"}</span>
                        </button>

                        {stats.average !== null ? (
                          <Badge className="text-[10px] bg-emerald-600 text-white font-black">
                            ממוצע: {stats.average}
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">טרם הוזן ציון</span>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAssignPreselectedStudentId(student.id);
                          setAssignModalOpen(true);
                        }}
                        className="h-7 px-2.5 text-[11px] font-bold gap-1 border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 cursor-pointer"
                        title={`הקצה משימה אישית עבור ${student.name}`}
                      >
                        <Send className="h-3 w-3 text-purple-500" />
                        <span>הקצה משימה</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
