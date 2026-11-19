"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { ClassGrade, LevelNumber } from "@/lib/levels";
import { gradeUnits } from "@/data/vocab/cards";
import { buildWorksheet, defaultSettings, defaultVocabTypes, orderedParts } from "@/lib/worksheet/build";
import { grammarTopicsFor } from "@/lib/worksheet/grammar";
import type { PartKind, Worksheet, WorksheetContent, WorksheetLayout, WorksheetSection, WorksheetSettings } from "@/lib/worksheet/types";

// State of the worksheet wizard: the teacher's answers, the current step and
// (once they reach the preview) the built worksheet content. The draft is kept
// in localStorage so a refresh never loses work.

export type StepId = "grade" | "level" | "parts" | `topics-${PartKind}` | `amount-${PartKind}` | "layout" | "preview";

export interface WizardState {
  /** Saved worksheet id once saved (or when editing one). */
  id: string | null;
  createdAt: string | null;
  settings: WorksheetSettings;
  step: StepId;
  content: WorksheetContent | null;
  /** Settings (minus layout) the content was built from. */
  builtKey: string | null;
}

type PartConfigs = Pick<WorksheetSettings, PartKind>;

type Action =
  | { type: "grade"; grade: ClassGrade }
  | { type: "level"; level: LevelNumber }
  | { type: "togglePart"; part: PartKind }
  | { type: "patchPart"; part: PartKind; patch: Partial<PartConfigs[PartKind]> }
  | { type: "layout"; patch: Partial<WorksheetLayout> }
  | { type: "goto"; step: StepId }
  | { type: "build" }
  | { type: "sections"; sections: WorksheetSection[] }
  | { type: "saved"; id: string; createdAt: string }
  | { type: "load"; state: WizardState };

export function stepsFor(settings: WorksheetSettings): StepId[] {
  return [
    "grade",
    "level",
    "parts",
    ...orderedParts(settings.parts).flatMap((p): StepId[] => [`topics-${p}`, `amount-${p}`]),
    "layout",
    "preview",
  ];
}

export const contentKey = (s: WorksheetSettings) => JSON.stringify({ ...s, layout: null });

export function initialWizardState(): WizardState {
  return { id: null, createdAt: null, settings: defaultSettings(), step: "grade", content: null, builtKey: null };
}

/** Keep only the choices that still make sense for a new grade/level. */
function fitToGradeLevel(s: WorksheetSettings, grade: ClassGrade, level: LevelNumber): WorksheetSettings {
  const levelChanged = level !== s.level;
  const units = gradeUnits(grade);
  const topics = new Set(grammarTopicsFor(grade, level).map((t) => t.id));
  const d = defaultSettings(grade, level);
  return {
    ...s,
    grade,
    level,
    vocab: {
      ...s.vocab,
      units: grade === s.grade ? s.vocab.units.filter((u) => units.includes(u)) : [],
      types: levelChanged ? defaultVocabTypes(level) : s.vocab.types,
    },
    grammar: { ...s.grammar, topicIds: s.grammar.topicIds.filter((t) => topics.has(t)), types: levelChanged ? [] : s.grammar.types },
    reading: { ...s.reading, storyId: null },
    conversation: { ...s.conversation, scenarioId: null },
    writing: levelChanged ? d.writing : { ...s.writing, taskId: null },
    layout: levelChanged ? { ...s.layout, hebrewHelp: d.layout.hebrewHelp } : s.layout,
  };
}

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "grade":
      return { ...state, settings: fitToGradeLevel(state.settings, action.grade, state.settings.level) };
    case "level":
      return { ...state, settings: fitToGradeLevel(state.settings, state.settings.grade, action.level) };
    case "togglePart": {
      const has = state.settings.parts.includes(action.part);
      const parts = has ? state.settings.parts.filter((p) => p !== action.part) : [...state.settings.parts, action.part];
      return { ...state, settings: { ...state.settings, parts: orderedParts(parts) } };
    }
    case "patchPart":
      return {
        ...state,
        settings: { ...state.settings, [action.part]: { ...state.settings[action.part], ...action.patch } },
      };
    case "layout":
      return { ...state, settings: { ...state.settings, layout: { ...state.settings.layout, ...action.patch } } };
    case "goto": {
      if (action.step !== "preview") return { ...state, step: action.step };
      // Build (or rebuild) the content when the choices changed since the last build.
      const key = contentKey(state.settings);
      if (state.content && state.builtKey === key) return { ...state, step: "preview" };
      return { ...state, step: "preview", content: buildWorksheet(state.settings), builtKey: key };
    }
    case "build":
      return { ...state, content: buildWorksheet(state.settings), builtKey: contentKey(state.settings) };
    case "sections":
      return state.content ? { ...state, content: { ...state.content, sections: action.sections } } : state;
    case "saved":
      return { ...state, id: action.id, createdAt: action.createdAt };
    case "load":
      return action.state;
  }
}

/** A Hebrew reason the teacher can't move on from this step yet, or null. */
export function stepProblem(step: StepId, s: WorksheetSettings): string | null {
  switch (step) {
    case "parts":
      return s.parts.length ? null : "בחרו לפחות חלק אחד לדף";
    case "topics-grammar":
      return s.grammar.topicIds.length ? null : "בחרו לפחות נושא דקדוק אחד";
    case "amount-vocab":
      return s.vocab.types.length ? null : "בחרו לפחות סוג תרגיל אחד";
    case "amount-reading":
      return s.reading.types.length ? null : "בחרו לפחות סוג שאלה אחד";
    case "amount-conversation":
      return s.conversation.types.length ? null : "בחרו לפחות סוג שאלה אחד";
    default:
      return null;
  }
}

const draftKey = (teacherId: string) => `ett.worksheetDraft.${teacherId}`;

export function readDraft(teacherId: string): WizardState | null {
  try {
    const raw = localStorage.getItem(draftKey(teacherId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WizardState;
    return parsed?.settings && parsed.step ? parsed : null;
  } catch {
    return null;
  }
}

export function clearDraft(teacherId: string) {
  try {
    localStorage.removeItem(draftKey(teacherId));
  } catch {
    /* ignore */
  }
}

/** Wizard state for editing (same id) or copying (new id) a saved worksheet. */
export function stateFromWorksheet(w: Worksheet, copy: boolean): WizardState {
  const settings = copy ? { ...w.settings, layout: { ...w.settings.layout, title: `${w.settings.layout.title} (עותק)` } } : w.settings;
  return {
    id: copy ? null : w.id,
    createdAt: copy ? null : w.createdAt,
    settings,
    step: "preview",
    content: { settings, sections: w.sections, seed: w.seed },
    builtKey: contentKey(settings),
  };
}

export function useWorksheetWizard(teacherId: string, initial: WizardState) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    try {
      localStorage.setItem(draftKey(teacherId), JSON.stringify(state));
    } catch {
      /* storage blocked – the wizard still works */
    }
  }, [state, teacherId]);

  const steps = useMemo(() => stepsFor(state.settings), [state.settings]);
  const index = Math.max(0, steps.indexOf(state.step));
  const problem = stepProblem(state.step, state.settings);

  const next = useCallback(() => {
    if (problem) return;
    const target = steps[index + 1];
    if (target) dispatch({ type: "goto", step: target });
  }, [problem, steps, index]);

  const back = useCallback(() => {
    const target = steps[index - 1];
    if (target) dispatch({ type: "goto", step: target });
  }, [steps, index]);

  /** The content with the current layout (layout changes never need a rebuild). */
  const content: WorksheetContent | null = state.content ? { ...state.content, settings: state.settings } : null;

  return { state, dispatch, steps, index, problem, next, back, content };
}

export type WorksheetWizard = ReturnType<typeof useWorksheetWizard>;
