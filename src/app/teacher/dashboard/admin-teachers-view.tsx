"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TeacherProfile, StudentProfile } from "@/types/auth";
import { useAuth } from "@/lib/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  School,
  Mail,
  KeyRound,
  Calendar,
  Edit2,
  Trash2,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface AdminTeachersViewProps {
  teachers: TeacherProfile[];
  onRefresh?: () => void;
}

export function AdminTeachersView({ teachers }: AdminTeachersViewProps) {
  const {
    user,
    getStudentsByTeacher,
    deleteTeacherAccount,
    updateTeacherAccount,
    setTeacherAdminStatus,
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);

  // Edit Teacher Modal State
  const [editingTeacher, setEditingTeacher] = useState<TeacherProfile | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSchool, setEditSchool] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete / Merge Modal State
  const [deletingTeacher, setDeletingTeacher] = useState<TeacherProfile | null>(null);
  const [mergeTargetId, setMergeTargetId] = useState<string>("");
  const [shouldMerge, setShouldMerge] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load student count for each teacher
  useEffect(() => {
    let isMounted = true;
    async function fetchCounts() {
      setIsLoadingCounts(true);
      const counts: Record<string, number> = {};
      for (const t of teachers) {
        try {
          const list: StudentProfile[] = await getStudentsByTeacher(t.id);
          counts[t.id] = list.length;
        } catch {
          counts[t.id] = 0;
        }
      }
      if (isMounted) {
        setStudentCounts(counts);
        setIsLoadingCounts(false);
      }
    }
    fetchCounts();
    return () => {
      isMounted = false;
    };
  }, [teachers, getStudentsByTeacher]);

  // Filter teachers by search query
  const filteredTeachers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.schoolName.toLowerCase().includes(q) ||
        t.teacherCode.toLowerCase().includes(q)
    );
  }, [teachers, searchQuery]);

  // Statistics
  const totalTeachers = teachers.length;
  const totalAdmins = teachers.filter((t) => t.isAdmin).length;
  const totalStudents = Object.values(studentCounts).reduce((a, b) => a + b, 0);

  // Open Edit Modal
  const handleOpenEdit = (t: TeacherProfile) => {
    setEditingTeacher(t);
    setEditName(t.name);
    setEditEmail(t.email);
    setEditSchool(t.schoolName);
    setEditCode(t.teacherCode);
    setEditIsAdmin(!!t.isAdmin);
    setEditError(null);
  };

  // Submit Edit
  const handleSaveEdit = async () => {
    if (!editingTeacher) return;
    if (!editName.trim()) {
      setEditError("שם המורה אינו יכול להיות ריק.");
      return;
    }
    setIsSavingEdit(true);
    setEditError(null);

    const res = await updateTeacherAccount(editingTeacher.id, {
      name: editName.trim(),
      email: editEmail.trim(),
      schoolName: editSchool.trim(),
      teacherCode: editCode.trim().toUpperCase(),
      isAdmin: editIsAdmin,
    });

    setIsSavingEdit(false);
    if (!res.success) {
      setEditError(res.error || "שגיאה בעדכון פרטי המורה.");
    } else {
      setEditingTeacher(null);
      setSuccessToast(`פרטי המורה ${editName} עודכנו בהצלחה!`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  // Open Delete / Merge Modal
  const handleOpenDelete = (t: TeacherProfile) => {
    setDeletingTeacher(t);
    setDeleteError(null);
    // Suggest first other teacher as default merge target if available
    const otherTeachers = teachers.filter((other) => other.id !== t.id);
    if (otherTeachers.length > 0) {
      setMergeTargetId(otherTeachers[0].id);
      setShouldMerge(true);
    } else {
      setMergeTargetId("");
      setShouldMerge(false);
    }
  };

  // Confirm Delete / Merge
  const handleConfirmDelete = async () => {
    if (!deletingTeacher) return;
    setIsDeleting(true);
    setDeleteError(null);

    const res = await deleteTeacherAccount(deletingTeacher.id, {
      transferToTeacherId: shouldMerge && mergeTargetId ? mergeTargetId : undefined,
    });

    setIsDeleting(false);
    if (!res.success) {
      setDeleteError(res.error || "שגיאה במחיקת החשבון.");
    } else {
      const deletedName = deletingTeacher.name;
      setDeletingTeacher(null);
      setSuccessToast(
        shouldMerge && mergeTargetId
          ? `החשבון של ${deletedName} נמחק בהצלחה, וכל התלמידים והמשימות הועברו אל החשבון הנבחר!`
          : `החשבון של ${deletedName} נמחק בהצלחה.`
      );
      setTimeout(() => setSuccessToast(null), 5000);
    }
  };

  // Quick toggle admin status
  const handleToggleAdmin = async (t: TeacherProfile) => {
    const nextStatus = !t.isAdmin;
    const res = await setTeacherAdminStatus(t.id, nextStatus);
    if (res.success) {
      setSuccessToast(
        nextStatus
          ? `הרשאות מנהל מערכת הוענקו ל-${t.name}.`
          : `הרשאות מנהל הוסרו מ-${t.name}.`
      );
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Success Notification */}
      {successToast && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card className="border border-border/80 bg-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">סה״כ מורים רשומים</p>
            <p className="text-2xl font-black text-foreground">{totalTeachers}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
        </Card>

        <Card className="border border-border/80 bg-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">מנהלי מערכת (Admins)</p>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{totalAdmins}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </Card>

        <Card className="border border-border/80 bg-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">תלמידים משויכים</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {isLoadingCounts ? "..." : totalStudents}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Control Bar & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/70">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חיפוש לפי שם מורה, אימייל או קוד..."
            className="pr-9 text-xs"
          />
        </div>
        <p className="text-xs text-muted-foreground self-end sm:self-center">
          מציג <span className="font-bold text-foreground">{filteredTeachers.length}</span> מתוך {totalTeachers} מורים
        </p>
      </div>

      {/* Teachers List / Table */}
      <div className="space-y-3">
        {filteredTeachers.map((t) => {
          const isMe = user?.id === t.id;
          const count = studentCounts[t.id] ?? 0;

          return (
            <Card
              key={t.id}
              className={`border transition-all ${
                isMe
                  ? "border-primary/40 bg-primary/5 shadow-xs"
                  : "border-border/80 bg-card hover:border-border"
              }`}
            >
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left (RTL Right): Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{t.name}</span>
                    {isMe && (
                      <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                        אתה (מחובר כעת)
                      </Badge>
                    )}
                    {t.isAdmin && (
                      <Badge className="text-[10px] bg-purple-600 text-white font-bold flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      קוד מורה: {t.teacherCode || "ללא"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="font-mono">{t.email || "ללא אימייל"}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <School className="h-3.5 w-3.5" />
                      <span>{t.schoolName || "בית ספר"}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span className="font-semibold text-foreground">{count} תלמידים רשומים</span>
                    </span>
                    {t.createdAt && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                        <Calendar className="h-3 w-3" />
                        <span>נרשם: {new Date(t.createdAt).toLocaleDateString("he-IL")}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right (RTL Left): Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {/* Admin Rights Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAdmin(t)}
                    disabled={isMe}
                    title={t.isAdmin ? "בטל הרשאות מנהל" : "הפוך למנהל מערכת"}
                    className={`h-8 text-xs font-semibold cursor-pointer ${
                      t.isAdmin
                        ? "border-purple-500/40 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 ml-1" />
                    <span>{t.isAdmin ? "מנהל מערכת" : "הפוך למנהל"}</span>
                  </Button>

                  {/* Edit Profile */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(t)}
                    className="h-8 text-xs font-semibold cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5 ml-1 text-primary" />
                    <span>ערוך פרטים</span>
                  </Button>

                  {/* Delete / Merge Account */}
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isMe}
                    onClick={() => handleOpenDelete(t)}
                    className="h-8 text-xs font-semibold cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 ml-1" />
                    <span>מחק חשבון</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* -------------------------------------------------------------------
          MODAL: EDIT TEACHER DETAILS
          ------------------------------------------------------------------- */}
      <Dialog open={!!editingTeacher} onOpenChange={(open) => !open && setEditingTeacher(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Edit2 className="h-5 w-5 text-primary" />
              <span>עריכת פרטי מורה</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              עדכון פרטים, שם בית ספר או קוד מורה במערכת.
            </DialogDescription>
          </DialogHeader>

          {editError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {editError}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">שם מלא</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="שם המורה"
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">כתובת אימייל</label>
              <Input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="teacher@school.edu"
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">שם בית הספר</label>
              <Input
                value={editSchool}
                onChange={(e) => setEditSchool(e.target.value)}
                placeholder="שם בית הספר"
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">קוד מורה (לתלמידים)</label>
              <Input
                value={editCode}
                onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                placeholder="COHEN-26"
                className="text-xs font-mono"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={editIsAdmin}
                  onChange={(e) => setEditIsAdmin(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span>הענק הרשאות מנהל מערכת (Admin)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingTeacher(null)}
              disabled={isSavingEdit}
              className="cursor-pointer"
            >
              ביטול
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveEdit}
              disabled={isSavingEdit}
              className="cursor-pointer font-bold"
            >
              {isSavingEdit ? "שומר..." : "שמור שינויים"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------
          MODAL: DELETE / MERGE TEACHER (Solves Duplicate Accounts)
          ------------------------------------------------------------------- */}
      <Dialog open={!!deletingTeacher} onOpenChange={(open) => !open && setDeletingTeacher(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>מחיקת חשבון מורה: {deletingTeacher?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              ניהול מחיקה בטוחה ומיזוג חשבונות שנוצרו בטעות כפולים.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {deleteError}
            </div>
          )}

          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-xl bg-muted/70 border border-border text-xs space-y-1">
              <p className="font-bold text-foreground">פרטי החשבון למחיקה:</p>
              <p className="text-muted-foreground">אימייל: <span className="font-mono text-foreground">{deletingTeacher?.email}</span></p>
              <p className="text-muted-foreground">קוד מורה: <span className="font-mono text-foreground">{deletingTeacher?.teacherCode}</span></p>
              <p className="text-muted-foreground">
                תלמידים משויכים: <span className="font-bold text-foreground">{deletingTeacher ? studentCounts[deletingTeacher.id] || 0 : 0}</span>
              </p>
            </div>

            {/* Merge options */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-foreground">כיצד לטפל בתלמידים ובמשימות הקיימות?</p>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-primary/30 bg-primary/5 cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  checked={shouldMerge}
                  onChange={() => setShouldMerge(true)}
                  className="mt-0.5"
                />
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
                    <span>מזג והעבר את התלמידים והמשימות למורה אחר (מומלץ לחשבון כפול)</span>
                  </span>
                  <p className="text-muted-foreground text-[11px]">
                    התלמידים והמשימות ישויכו אוטומטית לחשבון הנבחר ולא יימחקו.
                  </p>

                  {shouldMerge && (
                    <div className="pt-2">
                      <label className="text-[11px] font-bold text-foreground block mb-1">
                        בחר את חשבון המורה היעד:
                      </label>
                      <select
                        value={mergeTargetId}
                        onChange={(e) => setMergeTargetId(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-border bg-card text-foreground"
                      >
                        {teachers
                          .filter((t) => t.id !== deletingTeacher?.id)
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.email}) - {t.schoolName}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border/80 bg-card cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  checked={!shouldMerge}
                  onChange={() => setShouldMerge(false)}
                  className="mt-0.5"
                />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-foreground">
                    מחק את חשבון המורה בלבד (ללא העברת תלמידים)
                  </span>
                  <p className="text-muted-foreground text-[11px]">
                    חשבון המורה יוסר לחלוטין ממאגר המורים.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingTeacher(null)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              ביטול
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting || (shouldMerge && !mergeTargetId)}
              className="cursor-pointer font-bold"
            >
              {isDeleting ? "מבצע מחיקה..." : "אישור מחיקה סופית"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
