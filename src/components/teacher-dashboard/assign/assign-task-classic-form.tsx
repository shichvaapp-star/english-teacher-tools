"use client";

import React from "react";
import type { StudentGroup } from "@/types/auth";
import type { ExerciseLevel } from "@/types/assignment";
import { GrammarAssignPicker } from "@/components/grammar/grammar-assign-picker";
import { CLASS_GRADES, GRADE_LABELS as CLASS_GRADE_LABELS } from "@/lib/levels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  PenTool,
  BookOpen,
  Users,
  Layers,
  X,
  AlertCircle,
  Sparkles,
  BookA,
  BookOpenCheck,
  Search,
  Filter,
  User,
  Share2,
  MessageSquare,
} from "lucide-react";
import type { AssignTaskForm } from "@/components/teacher-dashboard/assign/use-assign-task-form";
import { VocabWordBuilder } from "@/components/teacher-dashboard/assign/vocab-word-builder";

/** The original "everything on one screen" layout of the assign-task dialog. */
export function AssignTaskClassicForm({ f, onCancel }: { f: AssignTaskForm; onCancel: () => void }) {
  const {
    students,
    classList,
    taskType,
    handleTypeChange,
    selectedGrade,
    handleGradeChange,
    selectedLevel,
    setSelectedLevel,
    handleLevelChange,
    coachWithDavid,
    selectionMode,
    setSelectionMode,
    selectedTaskId,
    setSelectedTaskId,
    availableWritingTasks,
    availableUnseens,
    availableConversations,
    grammarTopicIds,
    setGrammarTopicIds,
    grammarTypes,
    setGrammarTypes,
    grammarItemCount,
    setGrammarItemCount,
    targetType,
    setTargetType,
    classTargetScope,
    setClassTargetScope,
    selectedClass,
    setSelectedClass,
    selectedGroup,
    setSelectedGroup,
    selectedStudentIds,
    setSelectedStudentIds,
    studentFilterClass,
    setStudentFilterClass,
    studentSearchQuery,
    setStudentSearchQuery,
    classStudentsList,
    filteredIndividualStudents,
    matchingStudentsCount,
    handleStudentToggle,
    handleSelectAllFilteredStudents,
    handleDeselectAllFilteredStudents,
    instructions,
    setInstructions,
    dueDate,
    setDueDate,
    isShared,
    setIsShared,
    isSubmitting,
    error,
  } = f;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        f.submit();
      }}
      className="space-y-4 text-xs pt-2"
    >
      {error && (
        <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Task Type Switcher */}
      <div className="space-y-1.5">
        <label className="font-bold text-foreground block">סוג המשימה:</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange("writing")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
              taskType === "writing"
                ? "border-primary bg-primary/10 text-primary shadow-2xs"
                : "border-border hover:bg-muted/40 text-muted-foreground"
            }`}
          >
            <PenTool className="h-4 w-4 text-admin shrink-0" />
            <span>✍️ כתיבה</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("unseen")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
              taskType === "unseen"
                ? "border-primary bg-primary/10 text-primary shadow-2xs"
                : "border-border hover:bg-muted/40 text-muted-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4 text-info shrink-0" />
            <span>📖 אנסין</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("conversation")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
              taskType === "conversation"
                ? "border-warning bg-warning/15 text-warning-foreground dark:text-warning font-bold shadow-2xs ring-1 ring-warning/40"
                : "border-border hover:bg-muted/40 text-muted-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4 text-warning-foreground shrink-0" />
            <span>💬 שיחות</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("vocab")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
              taskType === "vocab"
                ? "border-success bg-success/15 text-success font-black shadow-2xs ring-1 ring-success/40"
                : "border-border hover:bg-muted/40 text-muted-foreground"
            }`}
          >
            <BookA className="h-4 w-4 text-success shrink-0" />
            <span>🔤 מילים</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("grammar")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
              taskType === "grammar"
                ? "border-type-grammar bg-type-grammar/15 text-type-grammar font-black shadow-2xs ring-1 ring-type-grammar/40"
                : "border-border hover:bg-muted/40 text-muted-foreground"
            }`}
          >
            <BookOpenCheck className="h-4 w-4 text-type-grammar shrink-0" />
            <span>📐 דקדוק</span>
          </button>
        </div>
      </div>

      {/* Content grade (textbook vocabulary) */}
      <div className="space-y-1.5 p-3 rounded-xl border border-border/80 bg-muted/20">
        <label className="font-bold text-foreground block">שכבה (לפי אוצר המילים של ספר הלימוד):</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(["all", ...CLASS_GRADES] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleGradeChange(g)}
              aria-pressed={selectedGrade === g}
              className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                selectedGrade === g
                  ? "border-primary bg-primary/10 text-primary font-black ring-1 ring-primary"
                  : "border-border text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <span className="text-xs font-bold">{g === "all" ? "כל תלמיד/ה" : CLASS_GRADE_LABELS[g].he}</span>
              <span className="text-3xs text-muted-foreground">
                {g === "all" ? "לפי הכיתה שלו/ה" : CLASS_GRADE_LABELS[g].en}
              </span>
            </button>
          ))}
        </div>
      </div>

      {taskType === "grammar" ? (
        <GrammarAssignPicker
          topicIds={grammarTopicIds}
          onTopicIdsChange={(ids) => {
            setGrammarTopicIds(ids);
            setSelectedTaskId(ids[0] ?? "");
          }}
          types={grammarTypes}
          onTypesChange={setGrammarTypes}
          itemCount={grammarItemCount}
          onItemCountChange={setGrammarItemCount}
          level={selectedLevel}
          onLevelChange={setSelectedLevel}
        />
      ) : taskType === "vocab" ? (
        /* Vocabulary Word Builder Section */
        <VocabWordBuilder f={f} />
      ) : (
        /* Exercise Level & Topic Selection Mode for Writing & Unseen */
        <>
          {/* 3. Exercise Level Selector */}
          <div className="space-y-1.5 p-3 rounded-xl border border-border/80 bg-muted/20">
            <div className="flex items-center justify-between">
              <label className="font-bold text-foreground block">רמת התרגיל (Level):</label>
              {selectedLevel !== "all" && (
                <Badge variant="secondary" className="text-3xs font-bold">
                  {selectedLevel === "Level 1"
                    ? "רמה 1 • מתחילים"
                    : selectedLevel === "Level 2"
                    ? "רמה 2 • מתקדמים"
                    : "רמה 3 • מיומנים"}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {[
                { id: "all", label: "כל הרמות", sub: "הכל", icon: "🌐" },
                { id: "Level 1", label: "רמה 1", sub: "מתחילים", icon: "🟢" },
                { id: "Level 2", label: "רמה 2", sub: "מתקדמים", icon: "🔵" },
                { id: "Level 3", label: "רמה 3", sub: "מיומנים", icon: "🟣" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleLevelChange(lvl.id as "all" | ExerciseLevel)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    selectedLevel === lvl.id
                      ? "border-primary bg-primary/10 text-primary font-black shadow-2xs ring-1 ring-primary"
                      : "border-border text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  <span className="text-xs font-bold">{lvl.icon} {lvl.label}</span>
                  <span className="text-3xs text-muted-foreground">{lvl.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Topic Selection Mode */}
          <div className="space-y-2">
            <label className="font-bold text-foreground block">בחירת נושא המשימה:</label>

            <div className={`grid grid-cols-1 ${coachWithDavid ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-2`}>
              <button
                type="button"
                onClick={() => setSelectionMode("specific")}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  selectionMode === "specific"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                    : "border-border text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Layers className="h-3.5 w-3.5 shrink-0" />
                  <span>משימה ספציפית מהמאגר</span>
                </div>
                <p className="text-3xs text-muted-foreground mt-1">
                  {taskType === "writing"
                    ? "בחירת נושא קבוע מהמאגר"
                    : taskType === "conversation"
                    ? "בחירת תרחיש שיחה מוגדר"
                    : "בחירת קטע אנסין מוגדר"}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectionMode("free_choice")}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  selectionMode === "free_choice"
                    ? "border-admin bg-admin/10 text-admin font-bold shadow-2xs"
                    : "border-border text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-admin shrink-0" />
                  <span>בחירה חופשית של התלמיד</span>
                </div>
                <p className="text-3xs text-muted-foreground mt-1">
                  {selectedLevel !== "all"
                    ? `התלמיד בוחר נושא ברמה ${selectedLevel}`
                    : "התלמיד בוחר נושא בעצמו או יוצר ב-AI"}
                </p>
              </button>
            </div>

            {/* Dropdown if specific topic, or info callout if adaptive / free choice */}
            {selectionMode === "specific" ? (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-2xs text-muted-foreground">
                  <label className="block">
                    {taskType === "writing"
                      ? "בחירת נושא החיבור מתוך המאגר:"
                      : taskType === "conversation"
                      ? "בחירת תרחיש שיחה מהמאגר:"
                      : "בחירת קטע קריאה (Unseen):"}
                  </label>
                  <span>
                    ({taskType === "writing"
                      ? availableWritingTasks.length
                      : taskType === "conversation"
                      ? availableConversations.length
                      : availableUnseens.length} זמינים)
                  </span>
                </div>
                {taskType === "writing" ? (
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    {availableWritingTasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.hebrewTitle} — {t.title} ({t.level})
                      </option>
                    ))}
                  </select>
                ) : taskType === "conversation" ? (
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    {availableConversations.map((s, idx) => (
                      <option key={s.id} value={s.id}>
                        #{idx + 1} {s.hebrewTitle} — {s.title} ({s.level})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    {selectedLevel === "all" ? (
                      <>
                        <optgroup label="רמה 1 - קוראים מתחילים (20 קטעים)">
                          {availableUnseens.filter((s) => s.level === "Level 1").map((s, idx) => (
                            <option key={s.id} value={s.id}>
                              #{idx + 1} {s.hebrewTitle} — {s.title}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="רמה 2 - קוראים מתקדמים (20 קטעים)">
                          {availableUnseens.filter((s) => s.level === "Level 2").map((s, idx) => (
                            <option key={s.id} value={s.id}>
                              #{idx + 1} {s.hebrewTitle} — {s.title}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="רמה 3 - קוראים מיומנים (20 קטעים)">
                          {availableUnseens.filter((s) => s.level === "Level 3").map((s, idx) => (
                            <option key={s.id} value={s.id}>
                              #{idx + 1} {s.hebrewTitle} — {s.title}
                            </option>
                          ))}
                        </optgroup>
                      </>
                    ) : (
                      availableUnseens.map((s, idx) => (
                        <option key={s.id} value={s.id}>
                          #{idx + 1} {s.hebrewTitle} — {s.title}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-admin/10 border border-admin/30 flex items-start gap-2.5 text-xs text-admin">
                <Sparkles className="h-4 w-4 text-admin shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">
                    {taskType === "writing"
                      ? `התלמידים יבחרו בעצמם על מה לכתוב${selectedLevel !== "all" ? ` (רמה ${selectedLevel})` : ""}`
                      : taskType === "conversation"
                      ? `התלמידים יבחרו בעצמם איזה תרחיש שיחה לתרגל${selectedLevel !== "all" ? ` (רמה ${selectedLevel})` : ""}`
                      : `התלמידים יבחרו בעצמם איזה קטע אנסין לקרוא${selectedLevel !== "all" ? ` (רמה ${selectedLevel})` : ""}`}
                  </span>
                  <p className="text-2xs text-muted-foreground leading-relaxed">
                    {taskType === "writing"
                      ? `התלמידים יוכלו לבחור כל נושא מתוך המאגר${selectedLevel !== "all" ? ` ברמה ${selectedLevel}` : ""}, לכתוב נושא חופשי או להיעזר ב-AI. המערכת תשייך את ההגשה למשימה זו.`
                      : taskType === "conversation"
                      ? `התלמידים יוכלו לבחור תרחיש שיחה${selectedLevel !== "all" ? ` ברמה ${selectedLevel}` : ""} או לחולל שיחה חדשה ב-AI. המערכת תשייך את ההגשה למשימה זו.`
                      : `התלמידים יוכלו לבחור קטע קריאה${selectedLevel !== "all" ? ` ברמה ${selectedLevel}` : ""} או לחולל קטע חדש ב-AI. המערכת תשייך את ההגשה למשימה זו.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* 5. Target Audience: Class vs All vs Individual Students */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-foreground block">קהל יעד להקצאת המשימה:</label>
          {matchingStudentsCount > 0 && (
            <span className="text-2xs text-muted-foreground font-medium">
              {matchingStudentsCount} תלמידים יקבלו את המשימה
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/60">
          <button
            type="button"
            onClick={() => setTargetType("class")}
            className={`h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
              targetType === "class"
                ? "bg-background text-primary shadow-xs border border-border/60 font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>כיתה והקבצה</span>
          </button>

          <button
            type="button"
            onClick={() => setTargetType("students")}
            className={`h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
              targetType === "students"
                ? "bg-background text-primary shadow-xs border border-border/60 font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="h-3.5 w-3.5 shrink-0" />
            <span>תלמידים בודדים</span>
          </button>

          <button
            type="button"
            onClick={() => setTargetType("all")}
            className={`h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
              targetType === "all"
                ? "bg-background text-primary shadow-xs border border-border/60 font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>כל התלמידים</span>
          </button>
        </div>

        {/* Target Options Details: Class AND Grouping */}
        {targetType === "class" && (
          <div className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. Select Class */}
              <div className="space-y-1">
                <label className="text-2xs font-bold text-foreground block">
                  1. בחירת כיתה:
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className={`w-full h-8 rounded-lg border bg-background px-2.5 text-xs cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                    !selectedClass ? "text-muted-foreground" : "text-foreground font-bold"
                  }`}
                >
                  <option value="" disabled>-- בחרו כיתה --</option>
                  {classList.map((cls) => (
                    <option key={cls} value={cls}>
                      כיתה {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Select Grouping */}
              <div className="space-y-1">
                <label className="text-2xs font-bold text-foreground block">
                  2. בחירת הקבצה באנגלית:
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(["א1", "א2", "ב"] as StudentGroup[]).map((grp) => (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setSelectedGroup(grp)}
                      className={`h-8 rounded-lg border text-center font-black text-xs cursor-pointer transition-all ${
                        selectedGroup === grp
                          ? "border-admin bg-admin/15 text-admin shadow-2xs ring-1 ring-admin"
                          : "border-border hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedGroup("all")}
                    className={`h-8 rounded-lg border text-center font-bold text-3xs cursor-pointer transition-all ${
                      selectedGroup === "all"
                        ? "border-primary bg-primary/10 text-primary shadow-2xs ring-1 ring-primary"
                        : "border-border hover:bg-muted/40 text-muted-foreground"
                    }`}
                    title="כל ההקבצות בכיתה זו"
                  >
                    כולן
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-toggle: All students in class vs Specific students in class */}
            {selectedClass && selectedGroup && (
              <div className="pt-1 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold text-foreground">היקף ההקצאה בכיתה:</span>
                  <div className="flex items-center gap-1 bg-background p-0.5 rounded-lg border border-border/80">
                    <button
                      type="button"
                      onClick={() => {
                        setClassTargetScope("all");
                        setSelectedStudentIds([]);
                      }}
                      className={`px-2 py-0.5 rounded text-2xs font-bold cursor-pointer transition-all ${
                        classTargetScope === "all"
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      כל תלמידי הכיתה
                    </button>
                    <button
                      type="button"
                      onClick={() => setClassTargetScope("custom")}
                      className={`px-2 py-0.5 rounded text-2xs font-bold cursor-pointer transition-all ${
                        classTargetScope === "custom"
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      תלמידים ספציפיים בלבד
                    </button>
                  </div>
                </div>

                {classTargetScope === "custom" && (
                  <div className="space-y-1.5 p-2 rounded-xl bg-background border border-border/70">
                    <div className="flex items-center justify-between text-2xs">
                      <span className="text-muted-foreground">
                        סמנו את התלמידים מתוך כיתה {selectedClass}:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectAllFilteredStudents(classStudentsList)}
                          className="text-3xs text-primary hover:underline font-bold"
                        >
                          בחר הכל ({classStudentsList.length})
                        </button>
                        <span className="text-muted-foreground">•</span>
                        <button
                          type="button"
                          onClick={() => handleDeselectAllFilteredStudents(classStudentsList)}
                          className="text-3xs text-muted-foreground hover:underline"
                        >
                          נקה
                        </button>
                      </div>
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1">
                      {classStudentsList.length === 0 ? (
                        <p className="text-2xs text-muted-foreground py-2 text-center">
                          לא נמצאו תלמידים רשומים בכיתה זו.
                        </p>
                      ) : (
                        classStudentsList.map((st) => {
                          const isChecked = selectedStudentIds.includes(st.id);
                          return (
                            <label
                              key={st.id}
                              className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                                isChecked
                                  ? "bg-primary/10 text-foreground font-bold"
                                  : "hover:bg-muted text-muted-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleStudentToggle(st.id)}
                                  className="rounded accent-primary"
                                />
                                <span dir="ltr">{st.name}</span>
                              </div>
                              {st.group && (
                                <Badge variant="outline" className="text-3xs py-0 px-1">
                                  {st.group}
                                </Badge>
                              )}
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live Match Summary Banner */}
            <div className="p-2 rounded-lg bg-background border border-border/80 flex items-center justify-between text-xs">
              {selectedClass && selectedGroup ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-foreground font-semibold">
                      יוקצה ל: <strong className="text-primary font-black">כיתה {selectedClass}</strong>
                      {selectedGroup !== "all" ? (
                        <> • <strong className="text-admin font-black">הקבצה {selectedGroup}</strong></>
                      ) : (
                        " • כל ההקבצות"
                      )}
                      {classTargetScope === "custom" && ` (${selectedStudentIds.length} תלמידים ספציפיים)`}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-3xs font-bold">
                    {matchingStudentsCount} תלמידים
                  </Badge>
                </>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground text-2xs">
                  <AlertCircle className="h-3.5 w-3.5 text-warning-foreground shrink-0" />
                  <span>נא לבחור כיתה והקבצה</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Target: Dedicated Individual Students Mode */}
        {targetType === "students" && (
          <div className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
            {/* Search and Class Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute right-2.5 top-2.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="חיפוש תלמיד/ה לפי שם..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="h-8 text-xs pr-8 bg-background"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <select
                  value={studentFilterClass}
                  onChange={(e) => setStudentFilterClass(e.target.value)}
                  className="w-full h-8 rounded-lg border bg-background px-2 text-xs cursor-pointer shadow-2xs"
                >
                  <option value="all">כל הכיתות ({students.length})</option>
                  {classList.map((cls) => (
                    <option key={cls} value={cls}>
                      כיתה {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Students Chips */}
            {selectedStudentIds.length > 0 && (
              <div className="space-y-1 p-2 rounded-lg bg-background border border-border/60">
                <div className="flex items-center justify-between text-3xs">
                  <span className="font-bold text-foreground">
                    תלמידים שנבחרו ({selectedStudentIds.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedStudentIds([])}
                    className="text-destructive hover:underline cursor-pointer"
                  >
                    נקה הכל
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pt-0.5">
                  {selectedStudentIds.map((id) => {
                    const st = students.find((s) => s.id === id);
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="text-3xs pl-1 pr-1.5 py-0.5 gap-1 bg-primary/10 text-primary border border-primary/20"
                      >
                        <span dir="ltr">{st?.name || id}</span>
                        {st?.fullClass && <span className="opacity-70 text-3xs">({st.fullClass})</span>}
                        <button
                          type="button"
                          onClick={() => handleStudentToggle(id)}
                          className="hover:text-destructive cursor-pointer rounded-full p-0.5"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selection list actions */}
            <div className="flex items-center justify-between text-2xs text-muted-foreground pt-0.5">
              <span>
                מוצגים {filteredIndividualStudents.length} תלמידים:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectAllFilteredStudents(filteredIndividualStudents)}
                  className="text-3xs text-primary hover:underline font-bold cursor-pointer"
                >
                  בחר את כל המוצגים
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleDeselectAllFilteredStudents(filteredIndividualStudents)}
                  className="text-3xs text-muted-foreground hover:underline cursor-pointer"
                >
                  בטל בחירה
                </button>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="max-h-44 overflow-y-auto border border-border/80 rounded-xl p-2 space-y-1 bg-background">
              {filteredIndividualStudents.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-4">
                  לא נמצאו תלמידים תואמים לחיפוש / לסינון.
                </p>
              ) : (
                filteredIndividualStudents.map((st) => {
                  const isChecked = selectedStudentIds.includes(st.id);
                  return (
                    <label
                      key={st.id}
                      className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-primary/10 text-foreground font-bold border border-primary/30"
                          : "hover:bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleStudentToggle(st.id)}
                          className="rounded accent-primary"
                        />
                        <span dir="ltr" className="truncate font-sans text-xs">
                          {st.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-3xs text-muted-foreground">{st.fullClass}</span>
                        {st.group && (
                          <Badge variant="outline" className="text-3xs py-0 px-1">
                            {st.group}
                          </Badge>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Teacher Focus Words for David's Vocabulary Quiz (only when David is enabled) */}
      {/* 5. Teacher Custom Instructions */}
      <div className="space-y-1">
        <label className="font-bold text-foreground block">
          הנחיות ודגשים מהמורה לתלמידים (אופציונלי):
        </label>
        <Textarea
          placeholder="למשל: נא לכתוב לפחות 60 מילים, להקפיד על שימוש באותיות גדולות (Capital Letters) ובמילות קישור שלמדנו השבוע."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="text-xs min-h-[70px] resize-none"
        />
      </div>

      {/* 6. Due Date */}
      <div className="space-y-1">
        <label className="font-bold text-foreground block">יעד להגשה (Due Date - אופציונלי):</label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-8 text-xs cursor-pointer"
        />
      </div>

      {/* 7. Community Share Toggle */}
      <div className="pt-1">
        <label className="flex items-center justify-between p-2.5 rounded-xl border border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-primary" />
              <span>שתף משימה זו במאגר המורים המשותף</span>
            </span>
            <p className="text-2xs text-muted-foreground">
              מורים עמיתים יוכלו לראות את המשימה הזו במאגר המשותף ולהקצות אותה לכיתות שלהם.
            </p>
          </div>
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
            className="rounded border-border text-primary focus:ring-primary h-4 w-4 mr-2"
          />
        </label>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="text-xs cursor-pointer"
        >
          ביטול
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="text-xs font-bold gap-1.5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Send className="h-3.5 w-3.5" />
          <span>{isSubmitting ? "מקצה משימה..." : "הקצה משימה עכשיו"}</span>
        </Button>
      </div>
    </form>
  );
}
