"use client";

import React, { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type {
  ClozeTextItem,
  FindFixItem,
  MatchHalvesItem,
  SortItem,
  UnscrambleItem,
} from "@/types/grammar";
import {
  chipBase,
  inputBase,
  markClass,
  seededShuffle,
  type ExerciseProps,
} from "@/components/grammar/exercises/shared";

/**
 * "Build the sentence": tap words in order. Placed words can be reordered
 * without clearing the line – tap one to pick it up, then tap another placed
 * word to move it there (or the empty end of the line to move it last). Tap a
 * picked-up word again to send it back. On desktop, placed words can also be
 * dragged into place.
 */
export function UnscrambleExercise({ item, response, onChange, grade }: ExerciseProps<UnscrambleItem>) {
  // Use indexes so repeated words stay distinct.
  const pool = useMemo(
    () => seededShuffle(item.words.map((w, i) => ({ w, i })), item.id),
    [item.words, item.id]
  );
  const order = response?.type === "unscramble" ? response.order : [];
  // Map placed words back to pool indexes (cheap – a handful of words).
  const usedIdx: number[] = [];
  for (const word of order) {
    const hit = pool.find((p) => p.w === word && !usedIdx.includes(p.i));
    if (hit) usedIdx.push(hit.i);
  }
  const checked = grade !== null;
  const complete = order.length === item.words.length;

  // Index of the placed word that is "picked up" (tap-to-move).
  const [picked, setPicked] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);
  const activePick = picked !== null && picked < order.length && !checked ? picked : null;

  const set = (next: string[]) => onChange({ type: "unscramble", order: next });

  /** Move the word at `from` so it sits at `to` (to === order.length → last). */
  const move = (from: number, to: number) => {
    if (from === to) return;
    const next = [...order];
    const [w] = next.splice(from, 1);
    next.splice(from < to ? to - 1 : to, 0, w);
    set(next);
  };

  const tapPlaced = (k: number) => {
    if (activePick === null) {
      setPicked(k);
    } else if (activePick === k) {
      // Second tap on the same word → back to the pool.
      set(order.filter((_, j) => j !== k));
      setPicked(null);
    } else {
      move(activePick, activePick < k ? k + 1 : k);
      setPicked(null);
    }
  };

  return (
    <div className="space-y-3" dir="ltr">
      <div
        onClick={() => {
          if (activePick === null) return;
          move(activePick, order.length);
          setPicked(null);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (dragFrom.current !== null) move(dragFrom.current, order.length);
          dragFrom.current = null;
        }}
        className={cn(
          "min-h-14 flex flex-wrap items-center gap-2 rounded-xl border-2 border-dashed px-3 py-2",
          checked && grade?.isCorrect && "border-success bg-success/5",
          checked && !grade?.isCorrect && "border-destructive bg-destructive/5",
          !checked && "border-border",
          activePick !== null && "cursor-pointer"
        )}
      >
        {order.map((w, k) => (
          <button
            key={`${w}-${k}`}
            type="button"
            disabled={checked}
            draggable={!checked}
            onDragStart={(e) => {
              dragFrom.current = k;
              setPicked(null);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const from = dragFrom.current;
              dragFrom.current = null;
              if (from === null) return;
              // Dropping on a word to its right lands after it, to its left – before it.
              move(from, from < k ? k + 1 : k);
            }}
            onClick={(e) => {
              e.stopPropagation();
              tapPlaced(k);
            }}
            className={cn(chipBase, "bg-card", markClass(activePick === k ? "selected" : "idle"))}
          >
            {w}
          </button>
        ))}
        {/* Always show the end mark so students know if it's a question. */}
        <span
          className={cn(
            "ml-auto text-2xl font-bold leading-none",
            complete ? "text-foreground" : "text-muted-foreground/60"
          )}
          aria-label={item.ending === "?" ? "question" : undefined}
        >
          {item.ending}
        </span>
      </div>
      {!checked && order.length > 1 && (
        <p className="font-hebrew text-right text-sm text-muted-foreground" dir="rtl">
          {activePick === null
            ? "רוצים לשנות סדר? לחצו על מילה במשפט ואז על המקום החדש שלה."
            : "עכשיו לחצו על מילה אחרת כדי להעביר לשם, או שוב על אותה מילה כדי להחזיר אותה."}
        </p>
      )}
      <div className="flex flex-wrap gap-2 pt-3">
        {pool.map((p) => {
          const used = usedIdx.includes(p.i);
          return (
            <button
              key={p.i}
              type="button"
              disabled={checked || used}
              onClick={() => {
                setPicked(null);
                set([...order, p.w]);
              }}
              className={cn(chipBase, used ? "invisible" : markClass("idle"))}
            >
              {p.w}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** "Find & fix": tap the wrong word, then type the correction. */
export function FindFixExercise({ item, response, onChange, grade }: ExerciseProps<FindFixItem>) {
  const sel = response?.type === "find_fix" ? response.index : null;
  const value = response?.type === "find_fix" ? response.value : "";
  const checked = grade !== null;

  return (
    <div className="space-y-6" dir="ltr">
      <div className="flex flex-wrap gap-1.5 text-lg sm:text-xl">
        {item.tokens.map((tok, i) => {
          const state = checked
            ? i === item.wrongIndex
              ? sel === i
                ? "correct"
                : "wrong"
              : sel === i
                ? "wrong"
                : "idle"
            : sel === i
              ? "selected"
              : "idle";
          return (
            <button
              key={i}
              type="button"
              disabled={checked}
              onClick={() => onChange({ type: "find_fix", index: i, value: "" })}
              className={cn(
                "rounded-md border border-transparent px-1.5 py-0.5 transition-colors cursor-pointer disabled:cursor-default",
                state === "idle" ? "hover:bg-muted" : markClass(state)
              )}
            >
              {tok}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground line-through">{item.tokens[sel]}</span>
          <span className="text-muted-foreground">→</span>
          <input
            aria-label="correction"
            value={value}
            disabled={checked}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            onChange={(e) => onChange({ type: "find_fix", index: sel, value: e.target.value })}
            className={cn(
              inputBase,
              "w-48",
              checked && (grade?.isCorrect ? "border-success bg-success/10" : "border-destructive bg-destructive/10")
            )}
          />
        </div>
      )}
    </div>
  );
}

/** "Which group?": each entry gets one bucket (segmented buttons per row). */
export function SortExercise({ item, response, onChange, grade }: ExerciseProps<SortItem>) {
  const placement = response?.type === "sort" ? response.placement : {};
  const entries = useMemo(() => seededShuffle(item.entries, item.id), [item.entries, item.id]);
  const checked = grade !== null;

  return (
    <div className="space-y-2" dir="ltr">
      {entries.map((e) => (
        <div key={e.text} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2">
          <span className="text-base font-medium">{e.text}</span>
          <div className="flex gap-1">
            {item.buckets.map((b) => {
              const isSel = placement[e.text] === b;
              const state = checked
                ? b === e.bucket
                  ? isSel
                    ? "correct"
                    : "idle"
                  : isSel
                    ? "wrong"
                    : "dim"
                : isSel
                  ? "selected"
                  : "idle";
              return (
                <button
                  key={b}
                  type="button"
                  disabled={checked}
                  onClick={() => onChange({ type: "sort", placement: { ...placement, [e.text]: b } })}
                  className={cn(
                    chipBase,
                    "px-2.5 py-1 text-sm",
                    markClass(state),
                    checked && b === e.bucket && !isSel && "border-success border-dashed"
                  )}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/** "Match halves": pick the right ending for each beginning. */
export function MatchHalvesExercise({ item, response, onChange, grade }: ExerciseProps<MatchHalvesItem>) {
  const matches = response?.type === "match_halves" ? response.matches : {};
  const rights = useMemo(() => seededShuffle(item.pairs.map((p) => p.right), item.id), [item.pairs, item.id]);
  const checked = grade !== null;

  return (
    <div className="space-y-2" dir="ltr">
      {item.pairs.map((p, i) => {
        const chosen = matches[p.left] ?? "";
        const ok = checked && grade?.parts?.[i];
        return (
          <div key={p.left} className="flex flex-wrap items-center gap-2">
            <span className="min-w-24 text-base font-semibold">{p.left}</span>
            <select
              aria-label={`ending for ${p.left}`}
              value={chosen}
              disabled={checked}
              onChange={(e) => onChange({ type: "match_halves", matches: { ...matches, [p.left]: e.target.value } })}
              className={cn(
                inputBase,
                "flex-1 min-w-48 py-1.5 cursor-pointer",
                checked && (ok ? "border-success bg-success/10" : "border-destructive bg-destructive/10")
              )}
            >
              <option value="">…</option>
              {rights.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {checked && !ok && <span className="w-full text-sm text-success pl-26">{p.right}</span>}
          </div>
        );
      })}
    </div>
  );
}

/** "Short text": a paragraph with numbered inline blanks. */
export function ClozeTextExercise({ item, response, onChange, grade }: ExerciseProps<ClozeTextItem>) {
  const values = response?.type === "cloze_text" ? response.values : item.blanks.map(() => "");
  const checked = grade !== null;
  const parts = item.text.split(/\{(\d+)\}/);

  return (
    <div className="space-y-3" dir="ltr">
      {item.title && <h3 className="text-base font-bold">{item.title}</h3>}
      <p className="text-base sm:text-lg leading-[2.6]">
        {parts.map((chunk, k) => {
          if (k % 2 === 0) return <React.Fragment key={k}>{chunk}</React.Fragment>;
          const bi = Number(chunk) - 1;
          const blank = item.blanks[bi];
          if (!blank) return null;
          const ok = grade?.parts?.[bi];
          const v = values[bi] ?? "";
          return (
            <span key={k} className="inline-flex items-baseline gap-1 mx-0.5">
              <input
                aria-label={`blank ${bi + 1}`}
                value={v}
                disabled={checked}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                onChange={(e) => {
                  const next = [...values];
                  next[bi] = e.target.value;
                  onChange({ type: "cloze_text", values: next });
                }}
                className={cn(
                  inputBase,
                  "py-0.5 px-2 text-center",
                  checked && (ok ? "border-success bg-success/10" : "border-destructive bg-destructive/10")
                )}
                style={{ width: `${Math.max(8, v.length + 2)}ch` }}
              />
              <span className="text-sm text-muted-foreground">({blank.baseForm})</span>
              {checked && !ok && <span className="text-sm font-semibold text-success">{blank.answers[0]}</span>}
            </span>
          );
        })}
      </p>
    </div>
  );
}
