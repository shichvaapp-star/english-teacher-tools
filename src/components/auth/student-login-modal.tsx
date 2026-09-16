"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, User, KeyRound, AlertCircle, CheckCircle2, School } from "lucide-react";

interface StudentLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentLoginModal({ open, onOpenChange }: StudentLoginModalProps) {
  const { teachers, loginStudent } = useAuth();

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [useCodeDirectly, setUseCodeDirectly] = useState(false);
  const [teacherCodeInput, setTeacherCodeInput] = useState("");
  const [studentName, setStudentName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const effectiveTeacherId = selectedTeacherId || (teachers.length > 0 ? teachers[0].id : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetTeacher = useCodeDirectly ? teacherCodeInput.trim() : effectiveTeacherId;
    if (!targetTeacher) {
      setError("Please select your teacher or type their teacher code.");
      return;
    }

    if (!studentName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (pin.trim().length < 4) {
      setError("Please enter a 4-digit PIN.");
      return;
    }

    setLoading(true);
    const res = await loginStudent({
      teacherId: targetTeacher,
      studentName,
      pin,
    });
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        setStudentName("");
        setPin("");
      }, 1000);
    } else {
      setError(res.error || "Login failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Student Classroom Portal</span>
          </div>
          <DialogTitle className="text-xl">Welcome, Student! 👋</DialogTitle>
          <DialogDescription>
            No email address needed. Select your teacher, write your name, and use a memorable 4-digit PIN.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-destructive bg-destructive/10 rounded-md">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 text-xs text-green-700 dark:text-green-300 bg-green-500/10 rounded-md">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Connected to your class! Loading your assignments...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Teacher Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <School className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Select Your Teacher (בחר מורה)</span>
              </label>
              <button
                type="button"
                onClick={() => setUseCodeDirectly(!useCodeDirectly)}
                className="text-[11px] text-primary hover:underline cursor-pointer"
              >
                {useCodeDirectly ? "Pick from list" : "Enter Code"}
              </button>
            </div>

            {useCodeDirectly ? (
              <Input
                type="text"
                placeholder="e.g. COHEN-26"
                value={teacherCodeInput}
                onChange={(e) => setTeacherCodeInput(e.target.value.toUpperCase())}
                className="uppercase tracking-wider font-mono text-sm"
              />
            ) : (
              <select
                value={effectiveTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} &bull; {t.schoolName} ({t.teacherCode})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Student Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Your Name (שם התלמיד/ה)</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Liam Levi / נועם לוי"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>

          {/* 4-digit PIN */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                <span>4-Digit PIN (קוד סודי אישי)</span>
              </label>
              <span className="text-[10px] text-muted-foreground">Pick 4 digits you remember</span>
            </div>
            <Input
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="font-mono text-center tracking-[0.5em] text-lg"
              required
            />
          </div>

          <div className="rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground">
            💡 <strong>Fast & Easy:</strong> Next time you return on this device, your teacher and answers will be saved automatically.
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full" disabled={loading || success}>
              {loading ? "Entering..." : "Enter Classroom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
