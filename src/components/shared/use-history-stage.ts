"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Marker stored on history entries this hook pushes: "the entry before me is this tool's base screen". */
const PUSHED_MARKER = "__ettStagePushed";

type HistoryStateRecord = Record<string, unknown> | null;

function readState(): HistoryStateRecord {
  const s: unknown = window.history.state;
  return s && typeof s === "object" ? (s as Record<string, unknown>) : null;
}

function urlWithParam(param: string, value: string | null): string {
  const url = new URL(window.location.href);
  if (value === null) url.searchParams.delete(param);
  else url.searchParams.set(param, value);
  return `${url.pathname}${url.search}${url.hash}`;
}

export interface SetStageOptions {
  /** Update the address without adding a history step (use for restoring state on page load). */
  replace?: boolean;
}

/**
 * Screen state for a multi-screen tool (settings → exercise → …) that is mirrored
 * into the URL as `?<param>=<screen>`, so the browser's Back/Forward buttons move
 * between the tool's screens instead of jumping out of the tool.
 *
 * - Leaving the base screen pushes a history entry.
 * - Returning to the base screen from in-app UI calls `history.back()` when this
 *   hook pushed the current entry, so the in-app and browser Back buttons agree.
 * - Moving between two non-base screens replaces the entry.
 * - Browser Back/Forward (popstate) re-reads the screen from the URL.
 */
export function useHistoryStage<T extends string>(param: string, base: T, screens: readonly T[]) {
  const [stage, setStageState] = useState<T>(base);
  const stageRef = useRef<T>(base);
  const screensRef = useRef(screens);

  const parse = useCallback(
    (value: string | null): T => {
      const match = screensRef.current.find((s) => s === value);
      return match ?? base;
    },
    [base],
  );

  useEffect(() => {
    const onPopState = () => {
      const next = parse(new URLSearchParams(window.location.search).get(param));
      stageRef.current = next;
      setStageState(next);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [param, parse]);

  const setStage = useCallback(
    (next: T, options: SetStageOptions = {}) => {
      const current = stageRef.current;
      stageRef.current = next;
      setStageState(next);
      if (typeof window === "undefined") return;

      const urlValue = new URLSearchParams(window.location.search).get(param);
      const target = next === base ? null : next;
      if (current === next && urlValue === target) return; // nothing to do

      const pushedHere = readState()?.[PUSHED_MARKER] === true;

      // Restoring state on load: describe it in the address, no new history step.
      if (options.replace) {
        window.history.replaceState({ [PUSHED_MARKER]: pushedHere }, "", urlWithParam(param, target));
        return;
      }

      if (next === base) {
        if (pushedHere) {
          window.history.back(); // the popstate listener settles the screen
        } else {
          window.history.replaceState({ [PUSHED_MARKER]: false }, "", urlWithParam(param, null));
        }
        return;
      }

      if (current === base) {
        // Drop a stale value left in the address (e.g. after a reload) before pushing.
        if (urlValue !== null) {
          window.history.replaceState({ [PUSHED_MARKER]: false }, "", urlWithParam(param, null));
        }
        window.history.pushState({ [PUSHED_MARKER]: true }, "", urlWithParam(param, next));
      } else {
        window.history.replaceState({ [PUSHED_MARKER]: pushedHere }, "", urlWithParam(param, next));
      }
    },
    [param, base],
  );

  return [stage, setStage] as const;
}
