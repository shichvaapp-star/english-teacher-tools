"use client";

import { useSyncExternalStore } from "react";

// localStorage-backed values. useSyncExternalStore keeps SSR + hydration in
// sync (the server snapshot is always null), and a custom event makes every
// hook reading the same key update when one of them writes it.

const STORAGE_EVENT = "ett-local-storage";

function subscribeStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(STORAGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(STORAGE_EVENT, cb);
  };
}

export function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeRaw(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable – value just won't persist */
  }
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

/** The raw stored string for `key` (null on the server, when unset, or when storage is blocked). */
export function useStoredRaw(key: string): string | null {
  return useSyncExternalStore(subscribeStorage, () => readRaw(key), () => null);
}
