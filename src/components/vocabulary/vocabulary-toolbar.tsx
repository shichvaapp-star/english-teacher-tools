"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookA,
  Search,
  BookMarked,
  Plus,
} from "lucide-react";
import { type VocabularyPracticeController } from "@/components/vocabulary/use-vocabulary-practice";

export function VocabularyToolbar({ c }: { c: VocabularyPracticeController }) {
  const {
    activeAssignment,
    activeCategory,
    assignmentWords,
    filteredWords,
    savedUnseenWords,
    searchQuery,
    setActiveCategory,
    setCardIndex,
    setFormError,
    setSearchQuery,
    setShowAddModal,
    setStudyMode,
    studyMode,
    wordStats,
  } = c;
  return (
    <>
      {/* Category Picker & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4 print:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none w-full sm:w-auto" dir="rtl">
          <span className="text-xs font-semibold text-muted-foreground ml-1 shrink-0">מאגר:</span>

          {activeAssignment && (
            <Button
              variant={activeCategory === "assignment" ? "default" : "outline"}
              size="sm"
              className={`text-xs h-8 cursor-pointer gap-1.5 shrink-0 ${
                activeCategory === "assignment"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xs"
                  : "border-emerald-500/50 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 font-bold"
              }`}
              onClick={() => {
                setActiveCategory("assignment");
                setCardIndex(0);
              }}
            >
              <BookA className="h-3.5 w-3.5" />
              <span>משימת המורה ({assignmentWords.length})</span>
            </Button>
          )}

          <Button
            variant={activeCategory === "saved" ? "default" : "outline"}
            size="sm"
            className="text-xs h-8 cursor-pointer gap-1.5 shrink-0"
            onClick={() => {
              setActiveCategory("saved");
              setCardIndex(0);
            }}
          >
            <BookMarked className="h-3.5 w-3.5" />
            <span>אוצר המילים שלי ({savedUnseenWords.length})</span>
          </Button>

          <Button
            variant={activeCategory === "grade7" ? "default" : "outline"}
            size="sm"
            className="text-xs h-8 cursor-pointer shrink-0"
            onClick={() => {
              setActiveCategory("grade7");
              setCardIndex(0);
            }}
          >
            רמה 1
          </Button>

          <Button
            variant={activeCategory === "grade8" ? "default" : "outline"}
            size="sm"
            className="text-xs h-8 cursor-pointer shrink-0"
            onClick={() => {
              setActiveCategory("grade8");
              setCardIndex(0);
            }}
          >
            רמה 2
          </Button>

          <Button
            variant={activeCategory === "grade9" ? "default" : "outline"}
            size="sm"
            className="text-xs h-8 cursor-pointer shrink-0"
            onClick={() => {
              setActiveCategory("grade9");
              setCardIndex(0);
            }}
          >
            רמה 3
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              placeholder="חיפוש מילה או תרגום..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs w-full"
            />
          </div>

          <Button
            onClick={() => {
              setShowAddModal(true);
              setFormError(null);
            }}
            variant="outline"
            size="sm"
            className="h-8 text-xs font-bold gap-1 cursor-pointer border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 shrink-0"
            dir="rtl"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>הוסף מילה</span>
          </Button>
        </div>
      </div>

      {/* Study Mode Tabs */}
      <div className="flex items-center justify-between gap-2 print:hidden w-full overflow-x-auto pb-1">
        <Tabs
          value={studyMode}
          onValueChange={(v) => setStudyMode(v as "flashcards" | "match" | "quiz" | "bank")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full sm:max-w-md h-9 p-1">
            <TabsTrigger value="flashcards" className="text-[11px] sm:text-xs px-1 sm:px-3">
              כרטיסיות
            </TabsTrigger>
            <TabsTrigger value="match" className="text-[11px] sm:text-xs px-1 sm:px-3">
              התאמה
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-[11px] sm:text-xs px-1 sm:px-3">
              בחן עצמך
            </TabsTrigger>
            <TabsTrigger value="bank" className="text-[11px] sm:text-xs px-1 sm:px-3">
              מילון ({filteredWords.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <span className="text-xs text-muted-foreground hidden sm:inline shrink-0">
          {wordStats.starred > 0 && <span className="text-amber-500 font-semibold ml-2">⭐ {wordStats.starred} מועדפים</span>}
          {wordStats.learned} / {wordStats.total} מילים נלמדו ✓
        </span>
      </div>
    </>
  );
}
