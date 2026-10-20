"use client";

import React, { useState, useMemo } from "react";
import {
  TeacherVocabBank,
  VocabGrade,
  GRADE_LABELS,
  STANDARD_LEVEL_LABELS,
} from "@/types/vocab-bank";
import { exportBankToCSV } from "@/lib/vocab-bank-storage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  BookA,
  Plus,
  Search,
  Filter,
  Send,
  Edit2,
  Trash2,
  Download,
  GraduationCap,
  Layers,
  Sparkles,
  Eye,
  FileSpreadsheet,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface CustomVocabBanksViewProps {
  banks: TeacherVocabBank[];
  onOpenCreateModal: () => void;
  onEditBank: (bank: TeacherVocabBank) => void;
  onDeleteBank: (bankId: string, bankName: string) => void;
  onAssignFromBank: (bank: TeacherVocabBank) => void;
}

export function CustomVocabBanksView({
  banks,
  onOpenCreateModal,
  onEditBank,
  onDeleteBank,
  onAssignFromBank,
}: CustomVocabBanksViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  // Preview full words modal state
  const [viewingBank, setViewingBank] = useState<TeacherVocabBank | null>(null);

  // Extract all unique custom level names for filter dropdown
  const uniqueLevels = useMemo(() => {
    const set = new Set<string>();
    banks.forEach((b) => {
      if (b.levelType === "custom" && b.customLevelName) {
        set.add(b.customLevelName);
      } else if (b.levelType === "standard" && b.standardLevel) {
        set.add(b.standardLevel);
      }
    });
    return Array.from(set);
  }, [banks]);

  // Total words across all banks
  const totalWordsCount = useMemo(() => {
    return banks.reduce((acc, b) => acc + (b.words?.length || 0), 0);
  }, [banks]);

  // Filtered banks
  const filteredBanks = useMemo(() => {
    return banks.filter((b) => {
      // Grade filter
      if (gradeFilter !== "all" && b.grade !== gradeFilter && b.grade !== "all") {
        return false;
      }

      // Level filter
      if (levelFilter !== "all") {
        if (b.levelType === "custom") {
          if (b.customLevelName !== levelFilter) return false;
        } else {
          if (b.standardLevel !== levelFilter) return false;
        }
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesDesc = b.description?.toLowerCase().includes(q);
        const matchesCustom = b.customLevelName?.toLowerCase().includes(q);
        const matchesWords = b.words?.some(
          (w) => w.english.toLowerCase().includes(q) || w.hebrew.includes(q)
        );
        if (!matchesName && !matchesDesc && !matchesCustom && !matchesWords) {
          return false;
        }
      }

      return true;
    });
  }, [banks, gradeFilter, levelFilter, searchQuery]);

  return (
    <div className="space-y-4" dir="rtl">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">מאגרי מילים מותאמים אישית</h3>
            <Badge variant="secondary" className="text-xs">
              {banks.length} מאגרים ({totalWordsCount} מילים סה״כ)
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            העלו רשימות מ-Word, Excel או CSV, מיינו לפי שכבה והקבצה/רמה מותאמת, והקצו משימות תרגול בלחיצת כפתור.
          </p>
        </div>

        <Button
          onClick={onOpenCreateModal}
          size="sm"
          className="text-xs font-bold gap-1.5 cursor-pointer bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span>+ ייבוא מאגר מקובץ / יצירה חדשה</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-muted/30 p-2.5 rounded-xl border border-border/70 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-3.5 w-3.5 absolute right-2.5 top-2.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חיפוש לפי שם מאגר או מילה..."
            className="h-8 pr-8 text-xs bg-background"
          />
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
            <GraduationCap className="h-3 w-3" />
            <span>שכבה:</span>
          </span>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-medium cursor-pointer"
          >
            <option value="all">כל השכבות</option>
            <option value="ז">כיתה ז׳</option>
            <option value="ח">כיתה ח׳</option>
            <option value="ט">כיתה ט׳</option>
            <option value="י">כיתה י׳</option>
            <option value="יא">כיתה י״א</option>
            <option value="יב">כיתה י״ב</option>
          </select>
        </div>

        {/* Level / Custom Stream Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
            <Layers className="h-3 w-3" />
            <span>רמה / הקבצה:</span>
          </span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-medium cursor-pointer max-w-[180px]"
          >
            <option value="all">כל הרמות וההקבצות</option>
            {uniqueLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {STANDARD_LEVEL_LABELS[lvl] || lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredBanks.length === 0 && (
        <div className="py-14 text-center max-w-md mx-auto space-y-3.5">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <BookA className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-foreground">
              {banks.length === 0
                ? "עדיין לא יצרת מאגרי מילים משלך"
                : "לא נמצאו מאגרים התואמים לסינון"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {banks.length === 0
                ? "תוכלו להעלות בקלות קבצי Word או Excel של רשימות מילים (למשל מתוך ספרי לימוד או מערכי שיעור) ולסווג אותם לפי כיתה והקבצה."
                : "נסו לשנות את הגדרות הסינון או לנקות את תיבת החיפוש."}
            </p>
          </div>
          {banks.length === 0 && (
            <Button
              onClick={onOpenCreateModal}
              size="sm"
              className="text-xs font-bold gap-1.5 cursor-pointer bg-primary text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>ייבא את מאגר המילים הראשון שלך עכשיו</span>
            </Button>
          )}
        </div>
      )}

      {/* Banks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredBanks.map((bank) => {
          const gradeLabel = GRADE_LABELS[bank.grade] || `כיתה ${bank.grade}`;
          const levelLabel =
            bank.levelType === "custom"
              ? bank.customLevelName || "מותאם אישית"
              : STANDARD_LEVEL_LABELS[bank.standardLevel || ""] || `הקבצה ${bank.standardLevel}`;

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
                      <CardDescription className="text-[11px] line-clamp-1">
                        {bank.description}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0 font-bold">
                    {bank.words?.length || 0} מילים
                  </Badge>
                </div>

                {/* Grade & Level Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                    <GraduationCap className="h-3 w-3" />
                    <span>{gradeLabel}</span>
                  </span>

                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    bank.levelType === "custom"
                      ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25"
                      : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                  }`}>
                    <Layers className="h-3 w-3" />
                    <span>{levelLabel}</span>
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1 space-y-3">
                {/* Words Chips Preview (First 5 words) */}
                <div className="flex flex-wrap gap-1 min-h-[50px] content-start">
                  {bank.words.slice(0, 5).map((w) => (
                    <span
                      key={w.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-[11px] text-foreground font-medium"
                    >
                      <span className="font-bold">{w.english}</span>
                      <span className="text-muted-foreground text-[10px]">({w.hebrew})</span>
                    </span>
                  ))}
                  {bank.words.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setViewingBank(bank)}
                      className="text-[10px] text-primary hover:underline font-bold px-1 py-0.5 cursor-pointer self-center"
                    >
                      +{bank.words.length - 5} נוספות...
                    </button>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-1.5">
                  {/* Primary: Assign Task */}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onAssignFromBank(bank)}
                    className="text-xs h-7.5 font-bold gap-1 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs flex-1"
                  >
                    <Send className="h-3 w-3" />
                    <span>הקצה משימה</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {/* View all words */}
                    <button
                      type="button"
                      onClick={() => setViewingBank(bank)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="הצג את כל המילים במאגר"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => onEditBank(bank)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="עריכת מאגר"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Export to CSV */}
                    <button
                      type="button"
                      onClick={() => exportBankToCSV(bank)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="ייצוא לקובץ CSV / Excel"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDeleteBank(bank.id, bank.name)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                      title="מחק מאגר"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View All Words Dialog */}
      {viewingBank && (
        <Dialog open={!!viewingBank} onOpenChange={() => setViewingBank(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto" dir="rtl">
            <DialogHeader className="text-right">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    {viewingBank.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {GRADE_LABELS[viewingBank.grade] || viewingBank.grade} •{" "}
                    {viewingBank.levelType === "custom"
                      ? viewingBank.customLevelName
                      : STANDARD_LEVEL_LABELS[viewingBank.standardLevel || ""]} •{" "}
                    {viewingBank.words.length} מילים
                  </DialogDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    const b = viewingBank;
                    setViewingBank(null);
                    onAssignFromBank(b);
                  }}
                  className="text-xs font-bold gap-1 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send className="h-3 w-3" />
                  <span>הקצה משימה ממאגר זה</span>
                </Button>
              </div>
            </DialogHeader>

            <div className="rounded-xl border border-border overflow-hidden bg-card mt-3">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="p-2.5 w-1/4">באנגלית</th>
                    <th className="p-2.5 w-1/4">בעברית</th>
                    <th className="p-2.5 w-1/6">חלק דיבר</th>
                    <th className="p-2.5 w-1/3">משפט לדוגמה</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {viewingBank.words.map((w) => (
                    <tr key={w.id} className="hover:bg-muted/20">
                      <td className="p-2.5 font-bold text-foreground capitalize">{w.english}</td>
                      <td className="p-2.5 font-bold text-primary">{w.hebrew}</td>
                      <td className="p-2.5 text-muted-foreground text-[11px]">{w.partOfSpeech || "noun"}</td>
                      <td className="p-2.5 text-muted-foreground italic text-[11px] font-sans" dir="ltr">
                        {w.example ? `"${w.example}"` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
