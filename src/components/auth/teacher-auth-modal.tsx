"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, Lock } from "lucide-react";

interface TeacherAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeacherAuthModal({ open, onOpenChange }: TeacherAuthModalProps) {
  const { loginTeacher, registerTeacher } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
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
    if (!loginPassword) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const res = await loginTeacher(loginEmail, loginPassword);
    setLoading(false);

    if (res.success) {
      onOpenChange(false);
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setError(res.error || "Login failed. Please verify your email and password.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim() || !regEmail.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    if (!regPassword) {
      setError("Please create a password for your account.");
      return;
    }

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    const res = await registerTeacher({
      name: regName,
      email: regEmail,
      password: regPassword,
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
        setRegPassword("");
        setRegConfirmPassword("");
        setRegSchool("");
      }, 2000);
    } else {
      setError(res.error || "Registration failed. Please try again.");
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
            Log in with your teacher email and password to manage assignments and review student work.
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
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Teacher Email Address</label>
                <Input
                  type="email"
                  placeholder="e.g. sarah.cohen@school.edu.il"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                    <span>Password</span>
                  </label>
                </div>
                <div className="relative">
                  <Input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                    tabIndex={-1}
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Enter Teacher Portal"}
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
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-muted-foreground" />
                  <span>Password (Min. 6 characters)</span>
                </label>
                <div className="relative">
                  <Input
                    type={showRegPassword ? "text" : "password"}
                    placeholder="Choose a secure password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                    tabIndex={-1}
                  >
                    {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Confirm Password</label>
                <Input
                  type={showRegPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">School / Institution</label>
                <Input
                  type="text"
                  placeholder="e.g. Ben Gurion Middle School"
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
