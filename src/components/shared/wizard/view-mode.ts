"use client";

import { useCallback } from "react";
import { useStoredRaw, writeRaw } from "@/lib/use-stored-value";

/** "wizard" = one question per screen; "classic" = every option on one screen. */
export type ViewMode = "wizard" | "classic";

/** Which screens share one remembered choice. */
export type ViewModeScope = "assignTask" | "activitySetup" | "examSetup";

const storageKey = (scope: ViewModeScope) => `ett.viewMode.${scope}`;

/** The remembered view mode for these screens (step-by-step unless the user chose otherwise). */
export function useViewMode(scope: ViewModeScope): [ViewMode, (m: ViewMode) => void] {
  const raw = useStoredRaw(storageKey(scope));
  const mode: ViewMode = raw === "classic" ? "classic" : "wizard";
  const setMode = useCallback((m: ViewMode) => writeRaw(storageKey(scope), m), [scope]);
  return [mode, setMode];
}
