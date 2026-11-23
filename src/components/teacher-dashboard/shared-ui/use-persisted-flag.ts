"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Map<string, Set<() => void>>();

function read(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/** A boolean UI preference kept per browser in localStorage (falls back to false). */
export function usePersistedFlag(key: string): [boolean, (next: boolean) => void] {
  const subscribe = useCallback(
    (cb: () => void) => {
      const set = listeners.get(key) ?? new Set<() => void>();
      set.add(cb);
      listeners.set(key, set);
      return () => set.delete(cb);
    },
    [key]
  );
  const value = useSyncExternalStore(subscribe, () => read(key), () => false);
  const setValue = useCallback(
    (next: boolean) => {
      try {
        window.localStorage.setItem(key, next ? "1" : "0");
      } catch {
        // Storage unavailable: the preference just won't persist
      }
      listeners.get(key)?.forEach((l) => l());
    },
    [key]
  );
  return [value, setValue];
}
