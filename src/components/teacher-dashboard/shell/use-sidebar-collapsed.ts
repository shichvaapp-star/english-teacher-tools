"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "ett_teacher_sidebar_collapsed";
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Persisted (per browser) collapsed state for the dashboard sidebar. */
export function useSidebarCollapsed(): [boolean, (next: boolean) => void] {
  const collapsed = useSyncExternalStore(subscribe, read, () => false);
  const set = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      // Storage unavailable: state just won't persist
    }
    listeners.forEach((l) => l());
  }, []);
  return [collapsed, set];
}
