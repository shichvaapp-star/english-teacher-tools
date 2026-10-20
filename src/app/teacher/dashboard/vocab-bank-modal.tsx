"use client";

import React, { useState, useEffect } from "react";
import {
  TeacherVocabBank,
  TeacherVocabWord,
  VocabGrade,
  VocabStandardLevel,
  GRADE_LABELS,
  STANDARD_LEVEL_LABELS,
  COMMON_CUSTOM_LEVEL_PRESETS,
} from "@/types/vocab-bank";
import { parseVocabFile, parseRawText } from "@/lib/vocab-importer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  ClipboardPaste,
  Plus,
  Trash2,
  ArrowLeftRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
  BookA,
  X,
} from "lucide-react";

interface VocabBankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  bankToEdit?: TeacherVocabBank | null;
  onSave: (bank: TeacherVocabBank) => void;
}

export function VocabBankModal({
  open,
  onOpenChange,
  teacherId,
  bankToEdit,
  onSave,
}: VocabBankModalProps) {
  const [bankName, setBankName] = useState("");
  const [bankDescription, setBankDescription] = useState("");
  const [grade, setGrade] = useState<VocabGrade>("ז");
  const [levelType, setLevelType] = useState<"standard" | "custom">("standard");
  const [standardLevel, setStandardLevel] = useState<VocabStandardLevel>("א1");
  const [customLevelName, setCustomLevelName] = useState("");

  const [words, setWords] = useState<TeacherVocabWord[]>([]);
  const [sourceTab, setSourceTab] = useState<"upload" | "paste" | "manual">("upload");
  const [pasteText, setPasteText] = useState("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  // Manual new word row inputs
  const [newEng, setNewEng] = useState("");
  const [newHeb, setNewHeb] = useState("");
  const [newPos, setNewPos] = useState<"noun" | "verb" | "adjective" | "adverb" | "phrase">("noun");
  const [newExample, setNewExample] = useState("");

  // Populate form if editing
  useEffect(() => {
    if (bankToEdit) {
      setBankName(bankToEdit.name);
      setBankDescription(bankToEdit.description || "");
      setGrade((bankToEdit.grade as VocabGrade) || "ז");
      setLevelType(bankToEdit.levelType || "standard");
      setStandardLevel(bankToEdit.standardLevel || "א1");
      setCustomLevelName(bankToEdit.customLevelName || "");
      setWords(bankToEdit.words || []);
      setSourceTab("manual");
    } else {
      setBankName("");
      setBankDescription("");
      setGrade("ז");
      setLevelType("standard");
      setStandardLevel("א1");
      setCustomLevelName("");
      setWords([]);
      setSourceTab("upload");
      setPasteText("");
    }
    setImportWarnings([]);
    setFormError(null);
  }, [bankToEdit, open]);

  // Handle file drop / upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setImportWarnings([]);
    setFormError(null);

    try {
      const res = await parseVocabFile(file);
      if (res.words.length === 0) {
        setFormError("לא זוהו מילים בקובץ. אנא ודאו שהקובץ מכיל עמודת מילים באנגלית ועמודת תרגום.");
      } else {
        setWords((prev) => [...prev, ...res.words]);
        setImportWarnings(res.warnings);
        if (!bankName) {
          // Auto-derive bank name from file name without extension
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
          setBankName(cleanName);
        }
      }
    } catch (err: any) {
      setFormError(`שגיאה בפענוח הקובץ: ${err?.message || "אנא נסו קובץ אחר"}`);
    } finally {
      setIsProcessingFile(false);
      e.target.value = "";
    }
  };

  // Handle paste text parse
  const handleParsePaste = () => {
    if (!pasteText.trim()) {
      setFormError("אנא הדביקו טקסט או טבלה בתיבה.");
      return;
    }

    const res = parseRawText(pasteText);
    if (res.words.length === 0) {
      setFormError("לא זוהו מילים בטקסט. אנא ודאו שהטקסט מכיל מילה באנגלית ותרגום בעברית מופרדים בפסיק, טאב או מקף.");
      return;
    }

    setWords((prev) => [...prev, ...res.words]);
    setImportWarnings(res.warnings);
    setPasteText("");
    setFormError(null);
  };

  // Swap columns (English <-> Hebrew)
  const handleSwapColumns = () => {
    setWords((prev) =>
      prev.map((w) => ({
        ...w,
        english: w.hebrew,
        hebrew: w.english,
      }))
    );
  };

  // Add individual word manually
  const handleAddManualWord = () => {
    if (!newEng.trim() || !newHeb.trim()) {
      setFormError("אנא הזינו גם מילה באנגלית וגם תרגום לעברית.");
      return;
    }

    const item: TeacherVocabWord = {
      id: `tvw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      english: newEng.trim().toLowerCase(),
      hebrew: newHeb.trim(),
      partOfSpeech: newPos,
      example: newExample.trim(),
    };

    setWords((prev) => [item, ...prev]);
    setNewEng("");
    setNewHeb("");
    setNewExample("");
    setFormError(null);
  };

  const handleDeleteWord = (id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  const handleUpdateWord = (id: string, field: keyof TeacherVocabWord, val: string) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: val } : w))
    );
  };

  // Save the bank
  const handleSaveBank = () => {
    if (!bankName.trim()) {
      setFormError("אנא הזינו שם למאגר המילים.");
      return;
    }

    if (words.length === 0) {
      setFormError("מאגר המילים חייב להכיל לפחות מילה אחת.");
      return;
    }

    if (levelType === "custom" && !customLevelName.trim()) {
      setFormError("אנא הזינו שם לרמה המותאמת (לדוגמה: דוברי אנגלית).");
      return;
    }

    const bank: TeacherVocabBank = {
      id: bankToEdit?.id || `bank-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      teacherId,
      name: bankName.trim(),
      description: bankDescription.trim(),
      grade,
      levelType,
      standardLevel: levelType === "standard" ? standardLevel : undefined,
      customLevelName: levelType === "custom" ? customLevelName.trim() : undefined,
      words,
      createdAt: bankToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(bank);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto p-5 sm:p-7" dir="rtl">
        <DialogHeader className="text-right pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BookA className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {bankToEdit ? "עריכת מאגר מילים מותאם אישית" : "יצירת מאגר מילים חדש וייבוא מקובץ"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                העלו קבצי Word, Excel או CSV, מיין לפי שכבת גיל ורמה/הקבצה, והקצה בקלות לתלמידים.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {formError && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="space-y-5 pt-1">
          {/* Section 1: Bank Metadata & Level Organization */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3.5">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>פרטי המאגר ושיוך פדגוגי (שכבה והקבצה)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground block">
                  שם המאגר <span className="text-destructive">*</span>
                </label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="לדוגמה: Unit 3 - Science & Future, אוצר מילים למבחן חצי"
                  className="h-8.5 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground block">
                  תיאור קצר (אופציונלי)
                </label>
                <Input
                  value={bankDescription}
                  onChange={(e) => setBankDescription(e.target.value)}
                  placeholder="למשל: מילים מתוך ספר הלימוד עמ׳ 45-48"
                  className="h-8.5 text-xs"
                />
              </div>
            </div>

            {/* Grade & Level Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/50">
              {/* Grade Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>שכבת גיל (כיתה)</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as VocabGrade)}
                  className="w-full h-8.5 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground cursor-pointer"
                >
                  {Object.entries(GRADE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stream / Custom Level Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    הקבצה / רמת לימוד
                  </label>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setLevelType("standard")}
                      className={`px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors ${
                        levelType === "standard"
                          ? "bg-primary text-primary-foreground font-bold"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      הקבצה רגילה
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevelType("custom")}
                      className={`px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors ${
                        levelType === "custom"
                          ? "bg-primary text-primary-foreground font-bold"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      רמה מותאמת (דוברי אנגלית וכו׳)
                    </button>
                  </div>
                </div>

                {levelType === "standard" ? (
                  <select
                    value={standardLevel}
                    onChange={(e) => setStandardLevel(e.target.value as VocabStandardLevel)}
                    className="w-full h-8.5 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground cursor-pointer"
                  >
                    {Object.entries(STANDARD_LEVEL_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-1.5">
                    <Input
                      value={customLevelName}
                      onChange={(e) => setCustomLevelName(e.target.value)}
                      placeholder="הקלידו רמה מותאמת, לדוגמה: דוברי אנגלית כיתה ז׳"
                      className="h-8.5 text-xs font-medium"
                    />
                    {/* Common Custom Presets */}
                    <div className="flex flex-wrap gap-1">
                      {COMMON_CUSTOM_LEVEL_PRESETS.slice(0, 3).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setCustomLevelName(preset)}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Import & Word Addition Source */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <BookA className="h-3.5 w-3.5 text-primary" />
                <span>ייבוא מילים ({words.length} מילים במאגר)</span>
              </h4>

              {words.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSwapColumns}
                  className="h-7 text-[11px] gap-1 cursor-pointer hover:bg-primary/10 hover:text-primary border-primary/30"
                  title="החלף בין עמודת עברית לאנגלית אם הקובץ יובא הפוך"
                >
                  <ArrowLeftRight className="h-3 w-3" />
                  <span>החלף עמודות (Eng ↔ Heb)</span>
                </Button>
              )}
            </div>

            <Tabs value={sourceTab} onValueChange={(v) => setSourceTab(v as any)}>
              <TabsList className="grid grid-cols-3 h-8.5 p-1 w-full max-w-md">
                <TabsTrigger value="upload" className="text-xs gap-1.5">
                  <Upload className="h-3 w-3" />
                  <span>העלאת קובץ</span>
                </TabsTrigger>
                <TabsTrigger value="paste" className="text-xs gap-1.5">
                  <ClipboardPaste className="h-3 w-3" />
                  <span>הדבקה מהלוח</span>
                </TabsTrigger>
                <TabsTrigger value="manual" className="text-xs gap-1.5">
                  <Plus className="h-3 w-3" />
                  <span>הוספה ידנית</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: File Upload */}
              <TabsContent value="upload" className="pt-2">
                <label className="border-2 border-dashed border-border/80 hover:border-primary/50 bg-card hover:bg-muted/30 transition-all rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer text-center space-y-2 block">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.docx,.csv,.tsv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessingFile}
                  />
                  <div className="flex items-center gap-2 text-primary">
                    <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {isProcessingFile ? "מפענח את הקובץ..." : "לחצו כאן להעלאת קובץ Word, Excel או CSV"}
                  </span>
                  <span className="text-[11px] text-muted-foreground max-w-sm">
                    תמיכה מלאה בקבצי .xlsx, .docx, .csv. המערכת תזהה אוטומטית את עמודת האנגלית והתרגום לעברית!
                  </span>
                </label>
              </TabsContent>

              {/* Tab 2: Paste from Clipboard */}
              <TabsContent value="paste" className="pt-2 space-y-2">
                <Textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={`הדביקו כאן טבלה מ-Word/Excel או שורות מילים, למשל:
apple, תפוח, noun, I ate a red apple
banana - בננה
book: ספר`}
                  rows={4}
                  className="text-xs font-mono"
                  dir="ltr"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleParsePaste}
                  className="text-xs font-bold cursor-pointer bg-primary text-primary-foreground gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>פענח והוסף מילים</span>
                </Button>
              </TabsContent>

              {/* Tab 3: Manual Entry */}
              <TabsContent value="manual" className="pt-2">
                <div className="p-3 rounded-xl border border-border/70 bg-card space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <Input
                      value={newEng}
                      onChange={(e) => setNewEng(e.target.value)}
                      placeholder="מילה באנגלית (English)"
                      className="h-8 text-xs font-medium"
                      dir="ltr"
                    />
                    <Input
                      value={newHeb}
                      onChange={(e) => setNewHeb(e.target.value)}
                      placeholder="תרגום לעברית"
                      className="h-8 text-xs font-medium"
                      dir="rtl"
                    />
                    <select
                      value={newPos}
                      onChange={(e) => setNewPos(e.target.value as any)}
                      className="h-8 px-2 rounded-lg border border-border bg-background text-xs cursor-pointer"
                    >
                      <option value="noun">שם עצם (noun)</option>
                      <option value="verb">פועל (verb)</option>
                      <option value="adjective">תואר (adjective)</option>
                      <option value="adverb">תואר הפועל (adverb)</option>
                      <option value="phrase">ביטוי / ניב (phrase)</option>
                    </select>
                    <Input
                      value={newExample}
                      onChange={(e) => setNewExample(e.target.value)}
                      placeholder="משפט לדוגמה (אופציונלי)"
                      className="h-8 text-xs"
                      dir="ltr"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddManualWord}
                    className="text-xs font-bold cursor-pointer gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>הוסף מילה לרשימה</span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {importWarnings.length > 0 && (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] space-y-0.5">
                <span className="font-bold block">הערות יבוא:</span>
                {importWarnings.slice(0, 3).map((w, idx) => (
                  <p key={idx}>{w}</p>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Word List Preview & Table */}
          {words.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>טבלת מילים במאגר ({words.length} מילים)</span>
                <span className="text-[11px]">ניתן לערוך ישירות בכל תא או למחוק שורה</span>
              </div>

              <div className="max-h-60 overflow-y-auto rounded-xl border border-border bg-card">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="p-2.5 w-1/4">באנגלית</th>
                      <th className="p-2.5 w-1/4">בעברית</th>
                      <th className="p-2.5 w-1/6">חלק דיבר</th>
                      <th className="p-2.5 w-1/3">משפט לדוגמה</th>
                      <th className="p-2.5 w-10 text-center">הסר</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {words.map((w, idx) => (
                      <tr key={w.id || idx} className="hover:bg-muted/20">
                        <td className="p-1.5">
                          <input
                            type="text"
                            value={w.english}
                            onChange={(e) => handleUpdateWord(w.id, "english", e.target.value)}
                            className="w-full px-2 py-1 rounded bg-transparent border-none text-xs font-bold text-foreground focus:ring-1 focus:ring-primary focus:bg-background"
                            dir="ltr"
                          />
                        </td>
                        <td className="p-1.5">
                          <input
                            type="text"
                            value={w.hebrew}
                            onChange={(e) => handleUpdateWord(w.id, "hebrew", e.target.value)}
                            className="w-full px-2 py-1 rounded bg-transparent border-none text-xs font-bold text-primary focus:ring-1 focus:ring-primary focus:bg-background"
                            dir="rtl"
                          />
                        </td>
                        <td className="p-1.5">
                          <select
                            value={w.partOfSpeech || "noun"}
                            onChange={(e) => handleUpdateWord(w.id, "partOfSpeech", e.target.value)}
                            className="w-full px-1 py-1 rounded bg-transparent text-[11px] text-muted-foreground focus:bg-background"
                          >
                            <option value="noun">noun</option>
                            <option value="verb">verb</option>
                            <option value="adjective">adj</option>
                            <option value="adverb">adv</option>
                            <option value="phrase">phrase</option>
                          </select>
                        </td>
                        <td className="p-1.5">
                          <input
                            type="text"
                            value={w.example || ""}
                            onChange={(e) => handleUpdateWord(w.id, "example", e.target.value)}
                            placeholder="משפט לדוגמה..."
                            className="w-full px-2 py-1 rounded bg-transparent border-none text-[11px] italic text-muted-foreground focus:ring-1 focus:ring-primary focus:bg-background"
                            dir="ltr"
                          />
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteWord(w.id)}
                            className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
                            title="מחק מילה"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer"
          >
            ביטול
          </Button>

          <Button
            type="button"
            onClick={handleSaveBank}
            disabled={words.length === 0}
            className="text-xs font-bold cursor-pointer bg-primary text-primary-foreground gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{bankToEdit ? "עדכן מאגר מילים" : `שמור מאגר (${words.length} מילים)`}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
