"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";
import { GraduationCap, User, LogOut, ChevronDown, School } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TeacherAuthModal } from "./teacher-auth-modal";
import { StudentLoginModal } from "./student-login-modal";

export function UserNav() {
  const { user, logout } = useAuth();
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 cursor-pointer border-primary/20")}>
          {isTeacher ? (
            <GraduationCap className="h-4 w-4 text-primary" />
          ) : (
            <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          )}
          <span className="font-medium max-w-[130px] truncate">{user.name}</span>
          <Badge variant={isTeacher ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
            {isTeacher ? "Teacher" : "Student"}
          </Badge>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none">{user.name}</p>
              {isTeacher && user.email && (
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              )}
              {isTeacher && user.teacherCode && (
                <p className="text-[11px] font-mono text-primary mt-1">
                  Class Code: <strong>{user.teacherCode}</strong>
                </p>
              )}
              {!isTeacher && user.teacherName && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <School className="h-3 w-3" /> Teacher: {user.teacherName}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (isTeacher) setStudentModalOpen(true);
              else setTeacherModalOpen(true);
            }}
            className="cursor-pointer text-xs"
          >
            Switch to {isTeacher ? "Student" : "Teacher"} View
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-xs text-destructive flex items-center gap-2">
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TeacherAuthModal open={teacherModalOpen} onOpenChange={setTeacherModalOpen} />
      <StudentLoginModal open={studentModalOpen} onOpenChange={setStudentModalOpen} />
    </>
  );
}
