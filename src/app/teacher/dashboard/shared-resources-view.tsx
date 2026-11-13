"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TeacherVocabBank, GRADE_LABELS, STANDARD_LEVEL_LABELS } from "@/types/vocab-bank";
import { TeacherAssignment } from "@/types/assignment";
import { useAuth } from "@/lib/auth-context";
import { loadSharedVocabBanks, cloneVocabBankToMyBanks } from "@/lib/vocab-bank-storage";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Share2,
  BookA,
  Send,
  Search,
  CheckCircle2,
  Sparkles,
  User,
  GraduationCap,
  Layers,
  Eye,
  RefreshCw,
  FolderPlus,
} from "lucide-react";

interface SharedResourcesViewProps {
  onAssignFromBank: (bank: TeacherVocabBank) => void;
  onUseSharedAssignment: (assignment: TeacherAssignment) => void;
  onBankCloned?: () => void;
}

export function SharedResourcesView({
  onAssignFromBank,
  onUseSharedAssignment,
  onBankCloned,
}: SharedResourcesViewProps) {
  const { user } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<"banks" | "assignments">("banks");
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter] = useState<string>("all");

  // Shared Data
  const [sharedBanks, setSharedBanks] = useState<TeacherVocabBank[]>([]);
  const [sharedAssignments, setSharedAssignments] = useState<TeacherAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Preview Dialog State
  const [viewingBank, setViewingBank] = useState<TeacherVocabBank | null>(null);

  // Success Feedback
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [cloningId, setCloningId] = useState<string | null>(null);

  // Load shared resources
  const fetchSharedContent = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch shared vocab banks
      const banks = await loadSharedVocabBanks();
      setSharedBanks(banks);

      // 2. Fetch shared assignments from Firestore
      if (db) {
        try {
          const q = query(collection(db, "assignments"), where("isShared", "==", true));
          const snap = await getDocs(q);
          const assigns: TeacherAssignment[] = [];
          snap.forEach((d) => {
            assigns.push({ ...(d.data() as TeacherAssignment), id: d.id });
          });
          assigns.sort(
            (a, b) => new Date(b.sharedAt || b.createdAt || 0).getTime() - new Date(a.sharedAt || a.createdAt || 0).getTime()
          );
          setSharedAssignments(assigns);
        } catch (asErr) {
          console.warn("Firestore fetch shared assignments notice:", asErr);
        }
      }
    } catch (err) {
      console.warn("Error fetching shared resources:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedContent();
  }, []);

  // Filter shared vocab banks
  const filteredBanks = useMemo(() => {
    return sharedBanks.filter((bank) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        bank.name.toLowerCase().includes(q) ||
        (bank.description && bank.description.toLowerCase().includes(q)) ||
        (bank.teacherName && bank.teacherName.toLowerCase().includes(q)) ||
        bank.words.some((w) => w.english.toLowerCase().includes(q) || w.hebrew.includes(q));

      const matchesGrade = gradeFilter === "all" || bank.grade === gradeFilter;

      return matchesSearch && matchesGrade;
    });
  }, [sharedBanks, searchQuery, gradeFilter]);

  // Filter shared assignments
  const filteredAssignments = useMemo(() => {
    return sharedAssignments.filter((a) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.hebrewTitle && a.hebrewTitle.toLowerCase().includes(q)) ||
        (a.teacherName && a.teacherName.toLowerCase().includes(q)) ||
        (a.instructions && a.instructions.toLowerCase().includes(q));

      return matchesSearch;
    });
  }, [sharedAssignments, searchQuery]);

  // Handle clone bank to my banks
  const handleCloneBank = async (bank: TeacherVocabBank) => {
    if (!user) return;
    setCloningId(bank.id);
    try {
      await cloneVocabBankToMyBanks(bank, { id: user.id, name: user.name });
      setSuccessToast(`המאגר "${bank.name}" הועתק בהצלחה למאגרים האישיים שלך!`);
      if (onBankCloned) onBankCloned();
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error("Clone bank error:", err);
    } finally {
      setCloningId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Toast Notification */}
      {successToast && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-success/10 border border-success/30 text-success text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-admin/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary text-primary-foreground">
              <Share2 className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-black text-foreground">מאגר תוכן שיתופי למורים</h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl">
            מאגר משותף של מאגרי מילים ומשימות שהועלו ע״י מורים עמיתים. בלחיצה אחת תוכלו להעתיק למאגר שלכם או להקצות ישירות לכיתות שלכם.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchSharedContent}
          disabled={isLoading}
          className="shrink-0 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ml-1.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>רענן מאגר</span>
        </Button>
      </div>

      {/* Sub Tabs: Vocab Banks vs Assignments */}
      <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab("banks")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === "banks"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <BookA className="h-4 w-4" />
            <span>מאגרי מילים משותפים</span>
            <span className="px-2 py-0.2 rounded-full text-2xs font-bold bg-primary-foreground/20 text-primary-foreground">
              {sharedBanks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("assignments")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === "assignments"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>משימות משותפות</span>
            <span className="px-2 py-0.2 rounded-full text-2xs font-bold bg-primary-foreground/20 text-primary-foreground">
              {sharedAssignments.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-48 sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חיפוש לפי כותרת, מורה או מילים..."
            className="pr-8 text-xs h-8"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 text-center space-y-2">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">טוען משאבים משותפים...</p>
        </div>
      )}

      {/* -------------------------------------------------------------------
          SUB-TAB 1: SHARED VOCAB BANKS
          ------------------------------------------------------------------- */}
      {!isLoading && activeSubTab === "banks" && (
        <>
          {filteredBanks.length === 0 ? (
            <Card className="border-dashed border-border/80 bg-card p-10 text-center space-y-3">
              <BookA className="h-10 w-10 text-muted-foreground/60 mx-auto" />
              <div>
                <p className="font-bold text-sm text-foreground">עדיין אין מאגרי מילים משותפים</p>
                <p className="text-xs text-muted-foreground mt-1">
                  היו הראשונים לשתף מאגר מילים מתוך לשונית &quot;מאגרי מילים שלי&quot;!
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredBanks.map((bank) => {
                const gradeLabel = GRADE_LABELS[bank.grade] || `כיתה ${bank.grade}`;
                const levelLabel =
                  bank.levelType === "custom"
                    ? bank.customLevelName || "מותאם אישית"
                    : STANDARD_LEVEL_LABELS[bank.standardLevel || ""] || `הקבצה ${bank.standardLevel}`;

                const isMyBank = bank.teacherId === user?.id;

                return (
                  <Card
                    key={bank.id}
                    className="border border-border/80 bg-card hover:border-primary/40 transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs"
                  >
                    <CardHeader className="p-4 pb-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <CardTitle className="text-sm font-bold text-foreground line-clamp-1">
                            {bank.name}
                          </CardTitle>
                          {bank.description && (
                            <CardDescription className="text-2xs line-clamp-1">
                              {bank.description}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant="outline" className="text-3xs shrink-0 font-bold">
                          {bank.words?.length || 0} מילים
                        </Badge>
                      </div>

                      {/* Author badge */}
                      <div className="flex items-center gap-1.5 text-2xs text-muted-foreground pt-1">
                        <User className="h-3 w-3 text-primary" />
                        <span className="font-semibold text-foreground">
                          {bank.teacherName || "מורה"}
                        </span>
                        {bank.schoolName && <span>• {bank.schoolName}</span>}
                        {isMyBank && (
                          <span className="px-1.5 py-0.2 rounded-full text-3xs bg-primary/10 text-primary font-bold">
                            שלך
                          </span>
                        )}
                      </div>

                      {/* Grade & Level Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-3xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          <GraduationCap className="h-3 w-3" />
                          <span>{gradeLabel}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-3xs font-semibold bg-admin/10 text-admin border border-admin/25">
                          <Layers className="h-3 w-3" />
                          <span>{levelLabel}</span>
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-1 space-y-3">
                      {/* Words Chips Preview (First 4 words) */}
                      <div className="flex flex-wrap gap-1 min-h-[45px] content-start">
                        {bank.words.slice(0, 4).map((w) => (
                          <span
                            key={w.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-2xs text-foreground font-medium"
                          >
                            <span className="font-bold">{w.english}</span>
                            <span className="text-muted-foreground text-3xs">({w.hebrew})</span>
                          </span>
                        ))}
                        {bank.words.length > 4 && (
                          <button
                            type="button"
                            onClick={() => setViewingBank(bank)}
                            className="text-3xs text-primary hover:underline px-1 self-center cursor-pointer font-semibold"
                          >
                            +{bank.words.length - 4} נוספות...
                          </button>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-border/70">
                        {/* Preview button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingBank(bank)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                          title="תצוגה מקדימה של כל המילים"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Clone to My Banks */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCloneBank(bank)}
                          disabled={cloningId === bank.id}
                          className="flex-1 text-xs font-semibold h-8 cursor-pointer"
                        >
                          <FolderPlus className="h-3.5 w-3.5 ml-1 text-primary" />
                          <span>{cloningId === bank.id ? "מעתיק..." : "העתק למאגרים שלי"}</span>
                        </Button>

                        {/* Assign Directly */}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onAssignFromBank(bank)}
                          className="text-xs font-bold h-8 cursor-pointer"
                        >
                          <Send className="h-3.5 w-3.5 ml-1" />
                          <span>הקצה לכיתה</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* -------------------------------------------------------------------
          SUB-TAB 2: SHARED ASSIGNMENTS
          ------------------------------------------------------------------- */}
      {!isLoading && activeSubTab === "assignments" && (
        <>
          {filteredAssignments.length === 0 ? (
            <Card className="border-dashed border-border/80 bg-card p-10 text-center space-y-3">
              <Send className="h-10 w-10 text-muted-foreground/60 mx-auto" />
              <div>
                <p className="font-bold text-sm text-foreground">אין עדיין משימות משותפות</p>
                <p className="text-xs text-muted-foreground mt-1">
                  משימות שתסמנו כמשותפות בהקצאה יופיעו כאן לשימוש כלל המורים!
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredAssignments.map((a) => (
                <Card
                  key={a.id}
                  className="border border-border/80 bg-card hover:border-primary/40 transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs"
                >
                  <CardHeader className="p-4 pb-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-bold text-foreground line-clamp-1">
                          {a.title}
                        </CardTitle>
                        {a.hebrewTitle && (
                          <CardDescription className="text-2xs line-clamp-1">
                            {a.hebrewTitle}
                          </CardDescription>
                        )}
                      </div>
                      <Badge variant="outline" className="text-3xs shrink-0 font-bold uppercase">
                        {a.type}
                      </Badge>
                    </div>

                    {/* Author & School */}
                    <div className="flex items-center gap-1.5 text-2xs text-muted-foreground pt-1">
                      <User className="h-3 w-3 text-primary" />
                      <span className="font-semibold text-foreground">{a.teacherName}</span>
                      {a.authorSchoolName && <span>• {a.authorSchoolName}</span>}
                    </div>

                    {/* Badges: Level & Coach */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {a.level && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-3xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          {a.level}
                        </span>
                      )}
                      {a.coachWithDavid && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-3xs font-semibold bg-success/10 text-success border border-success/25">
                          <Sparkles className="h-3 w-3" />
                          <span>David AI Coach</span>
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-1 space-y-3">
                    {/* Instructions Preview */}
                    {a.instructions && (
                      <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/40 p-2 rounded-lg">
                        {a.instructions}
                      </p>
                    )}

                    {/* Focus Words Chips if available */}
                    {a.focusWords && a.focusWords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {a.focusWords.slice(0, 5).map((w, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-3xs bg-muted text-muted-foreground font-mono"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Use Button */}
                    <div className="pt-2 border-t border-border/70">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onUseSharedAssignment(a)}
                        className="w-full text-xs font-bold h-8 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5 ml-1" />
                        <span>השתמש במשימה זו בכיתה שלי</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* -------------------------------------------------------------------
          MODAL: VIEW FULL WORDS IN BANK
          ------------------------------------------------------------------- */}
      <Dialog open={!!viewingBank} onOpenChange={(open) => !open && setViewingBank(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <BookA className="h-5 w-5 text-primary" />
              <span>{viewingBank?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              נוצר ע״י {viewingBank?.teacherName} {viewingBank?.schoolName ? `• ${viewingBank.schoolName}` : ""} • סה״כ {viewingBank?.words?.length || 0} מילים
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto p-1">
              {viewingBank?.words.map((w, i) => (
                <div
                  key={w.id || i}
                  className="p-2.5 rounded-lg border border-border/70 bg-card flex flex-col justify-between text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm font-mono">{w.english}</span>
                    <span className="font-semibold text-primary">{w.hebrew}</span>
                  </div>
                  {w.example && (
                    <p className="text-2xs text-muted-foreground italic">&quot;{w.example}&quot;</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-4 border-t border-border mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewingBank(null)}
              className="cursor-pointer"
            >
              סגור
            </Button>
            {viewingBank && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleCloneBank(viewingBank);
                    setViewingBank(null);
                  }}
                  className="cursor-pointer text-xs font-semibold"
                >
                  <FolderPlus className="h-3.5 w-3.5 ml-1 text-primary" />
                  <span>העתק למאגרים שלי</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    onAssignFromBank(viewingBank);
                    setViewingBank(null);
                  }}
                  className="cursor-pointer text-xs font-bold"
                >
                  <Send className="h-3.5 w-3.5 ml-1" />
                  <span>הקצה לכיתה</span>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
