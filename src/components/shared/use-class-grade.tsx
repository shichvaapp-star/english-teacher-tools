"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { parseClassGrade, type ClassGrade } from "@/lib/levels";

const STORAGE_KEY = "ett.classGrade";

function readStored(): ClassGrade | null {
  try {
    return parseClassGrade(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

/**
 * The grade (7/8/9) whose content a section shows. Every user may switch it;
 * the default is, in order: a forced grade (assignment / ?grade=), the last
 * choice on this device, the student's class, then grade 7.
 */
export function useClassGrade(forced?: ClassGrade | null) {
  const { user } = useAuth();
  const classGrade = parseClassGrade(user?.classGrade);
  const [chosen, setChosen] = useState<ClassGrade | null>(null);

  useEffect(() => {
    // Read the saved choice after mount (localStorage is client-only).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChosen(readStored());
  }, []);

  const setGrade = useCallback((g: ClassGrade) => {
    setChosen(g);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(g));
    } catch {
      /* private mode – keep it in memory only */
    }
  }, []);

  const grade: ClassGrade = forced ?? chosen ?? classGrade ?? 7;
  return { grade, setGrade, classGrade, isLocked: Boolean(forced) };
}
