"use client";

// Lab seat map: the teacher places students in a rows × columns grid. Seats are
// coloured by topic variant so neighbours (left/right, front/back) never share one.

import React, { useMemo, useState } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { seatVariantIndex } from "@/lib/exam/seat-plan";
import type { ExamSeatPlan } from "@/types/exam";
import { Eraser, ListOrdered } from "lucide-react";

export const VARIANT_STYLES = [
  "border-primary/50 bg-primary/10",
  "border-info/50 bg-info/15",
  "border-warning/50 bg-warning/15",
];

interface SeatStudent {
  id: string;
  name: string;
}

interface SeatPlanEditorProps {
  plan: ExamSeatPlan;
  onChange: (plan: ExamSeatPlan) => void;
  students: SeatStudent[];
  variantKeys: string[];
}

const clamp = (n: number) => Math.max(1, Math.min(10, Math.round(n) || 1));

export function SeatPlanEditor({ plan, onChange, students, variantKeys }: SeatPlanEditorProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const nameById = useMemo(() => new Map(students.map((s) => [s.id, s.name])), [students]);
  const seatAt = useMemo(() => {
    const m = new Map<string, string>();
    plan.seats.forEach((s) => m.set(`${s.row},${s.col}`, s.studentId));
    return m;
  }, [plan.seats]);
  const seated = new Set(plan.seats.map((s) => s.studentId));
  const unseated = students.filter((s) => !seated.has(s.id));

  const setSize = (rows: number, cols: number) =>
    onChange({ rows, cols, seats: plan.seats.filter((s) => s.row < rows && s.col < cols) });

  const clickSeat = (row: number, col: number) => {
    const occupant = seatAt.get(`${row},${col}`);
    if (occupant) {
      onChange({ ...plan, seats: plan.seats.filter((s) => s.studentId !== occupant) });
      setPicked(occupant);
      return;
    }
    const who = picked ?? unseated[0]?.id;
    if (!who) return;
    onChange({ ...plan, seats: [...plan.seats.filter((s) => s.studentId !== who), { row, col, studentId: who }] });
    setPicked(null);
  };

  const fillInOrder = () => {
    const seats = [...plan.seats];
    const queue = [...unseated];
    for (let r = 0; r < plan.rows && queue.length; r++) {
      for (let c = 0; c < plan.cols && queue.length; c++) {
        if (!seatAt.has(`${r},${c}`)) seats.push({ row: r, col: c, studentId: queue.shift()!.id });
      }
    }
    onChange({ ...plan, seats });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <label className="space-y-1 text-xs">
          <span className="text-muted-foreground">שורות</span>
          <Input
            type="number"
            min={1}
            max={10}
            value={plan.rows}
            onChange={(e) => setSize(clamp(Number(e.target.value)), plan.cols)}
            className="w-20"
          />
        </label>
        <label className="space-y-1 text-xs">
          <span className="text-muted-foreground">מחשבים בשורה</span>
          <Input
            type="number"
            min={1}
            max={10}
            value={plan.cols}
            onChange={(e) => setSize(plan.rows, clamp(Number(e.target.value)))}
            className="w-20"
          />
        </label>
        <Button variant="outline" size="sm" onClick={fillInOrder} disabled={unseated.length === 0}>
          <ListOrdered />
          הושבה לפי הסדר
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onChange({ ...plan, seats: [] })} disabled={plan.seats.length === 0}>
          <Eraser />
          ניקוי
        </Button>
      </div>

      <div className="rounded-lg bg-muted py-1 text-center text-xs font-medium text-muted-foreground">לוח / עמדת המורה</div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${plan.cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: plan.rows }).flatMap((_, row) =>
          Array.from({ length: plan.cols }).map((__, col) => {
            const occupant = seatAt.get(`${row},${col}`);
            const vi = seatVariantIndex(row, col, variantKeys.length);
            return (
              <button
                key={`${row}-${col}`}
                type="button"
                onClick={() => clickSeat(row, col)}
                className={cn(
                  "flex h-14 flex-col items-center justify-center rounded-lg border px-1 text-center text-xs transition-colors",
                  variantKeys.length > 1 ? VARIANT_STYLES[vi % VARIANT_STYLES.length] : "border-border bg-card",
                  !occupant && "border-dashed opacity-70 hover:opacity-100"
                )}
                title={occupant ? "לחיצה מוציאה את התלמיד/ה מהמקום" : "לחיצה מושיבה כאן את התלמיד/ה שנבחר/ה"}
              >
                <span className="line-clamp-2 font-medium">{occupant ? nameById.get(occupant) ?? "?" : "ריק"}</span>
                {variantKeys.length > 1 && <span className="text-3xs text-muted-foreground">נושא {variantKeys[vi]}</span>}
              </button>
            );
          })
        )}
      </div>

      {unseated.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs text-muted-foreground">
            לא הושבו ({unseated.length}) – בחרו תלמיד/ה ואז לחצו על מקום פנוי. מי שלא יושב/ת יקבל/תקבל נושא לסירוגין.
          </div>
          <div className="flex flex-wrap gap-1.5">
            {unseated.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setPicked(picked === s.id ? null : s.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  picked === s.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
