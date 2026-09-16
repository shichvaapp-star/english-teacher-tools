"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

interface TeacherAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeacherAuthModal({ open, onOpenChange }: TeacherAuthModalProps) {
  const { loginTeacher, registerTeacher } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regSchool, setRegSchool] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail.trim()) {
      setError("Please enter your teacher email.");
      return;
    }

    setLoading(true);
    const res = await loginTeacher(loginEmail);
    setLoading(false);

    if (res.success) {
      onOpenChange(false);
      setLoginEmail("");
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!regName.trim() || !regEmail.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    setLoading(true);
    const res = await registerTeacher({
      name: regName,
      email: regEmail,
      schoolName: regSchool,
    });
    setLoading(false);

    if (res.success && res.teacher) {
      setSuccessMsg(`Teacher account created! Your teacher code is: ${res.teacher.teacherCode}`);
      setTimeout(() => {
        onOpenChange(false);
        setSuccessMsg(null);
        setRegName("");
        setRegEmail("");
        setRegSchool("");
      }, 2000);
    } else {
      setError(res.error || "Registration failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Teacher & Admin Portal</span>
          </div>
          <DialogTitle className="text-xl">Teacher Access</DialogTitle>
          <DialogDescription>
            Manage classroom assignments, generate Unseens with AI, and review student essays.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as "login" | "register"); setError(null); }}>
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="login">Teacher Log In</TabsTrigger>
            <TabsTrigger value="register">Create Teacher Account</TabsTrigger>
          </TabsList>

          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-destructive bg-destructive/10 rounded-md mb-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-green-700 dark:text-green-300 bg-green-500/10 rounded-md mb-3">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Teacher Email Address</label>
                <Input
                  type="email"
                  placeholder="e.g. sarah.cohen@school.edu.il"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  Demo account: <code>sarah.cohen@school.edu.il</code>
                </p>
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Enter Teacher Cockpit"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Full Name (English / Hebrew)</label>
                <Input
                  type="text"
                  placeholder="e.g. Rachel Levi / רחל לוי"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Teacher Email</label>
                <Input
                  type="email"
                  placeholder="e.g. rachel@school.edu.il"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">School / Institution (Optional)</label>
                <Input
                  type="text"
                  placeholder="e.g. Ironi Gimel / Private Tutor"
                  value={regSchool}
                  onChange={(e) => setRegSchool(e.target.value)}
                />
              </div>

              <div className="p-2.5 rounded-lg bg-muted/60 text-xs text-muted-foreground flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>You will automatically receive a unique Teacher Code (e.g. LEVI-26) to share with your students.</span>
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Registering..." : "Create Teacher Account"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
