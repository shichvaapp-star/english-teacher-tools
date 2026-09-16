"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, User, LogOut, ChevronDown, School, RefreshCw } from "lucide-react";
import { TeacherAuthModal } from "./teacher-auth-modal";
import { StudentLoginModal } from "./student-login-modal";

export function UserNav() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  if (!user) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStudentModalOpen(true)}
            className="cursor-pointer gap-1.5"
          >
            <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Student</span> Login
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setTeacherModalOpen(true)}
            className="cursor-pointer gap-1.5"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Teacher</span> Portal
          </Button>
        </div>

        <TeacherAuthModal open={teacherModalOpen} onOpenChange={setTeacherModalOpen} />
        <StudentLoginModal open={studentModalOpen} onOpenChange={setStudentModalOpen} />
      </>
    );
  }

  const isTeacher = user.role === "teacher";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent/50 text-foreground text-sm font-medium transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {isTeacher ? (
          <GraduationCap className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        )}
        <span className="max-w-[130px] truncate">{user.name}</span>
        <Badge variant={isTeacher ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
          {isTeacher ? "Teacher" : "Student"}
        </Badge>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-card border border-border/80 shadow-xl p-2 z-50 animate-in fade-in-0 zoom-in-95">
          <div className="px-3 py-2 border-b border-border/50">
            <div className="flex items-center justify-between gap-1">
              <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {isTeacher ? "Teacher" : "Student"}
              </span>
            </div>
            {isTeacher && user.email && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
            )}
            {isTeacher && user.teacherCode && (
              <div className="mt-2 p-1.5 bg-primary/5 rounded-md border border-primary/15 text-xs text-primary font-mono flex items-center justify-between">
                <span>Class Code:</span>
                <span className="font-bold tracking-wider">{user.teacherCode}</span>
              </div>
            )}
            {!isTeacher && user.teacherName && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <School className="h-3 w-3 shrink-0" /> Teacher: {user.teacherName}
              </p>
            )}
          </div>

          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                if (isTeacher) setStudentModalOpen(true);
                else setTeacherModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent rounded-lg transition text-left cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Switch to {isTeacher ? "Student" : "Teacher"} View</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition text-left cursor-pointer font-medium"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <TeacherAuthModal open={teacherModalOpen} onOpenChange={setTeacherModalOpen} />
      <StudentLoginModal open={studentModalOpen} onOpenChange={setStudentModalOpen} />
    </div>
  );
}
