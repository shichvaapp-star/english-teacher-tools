"use client";

import React from "react";
import { type VocabItem } from "@/lib/vocab-storage";

/**
 * Shared building blocks for the printed worksheet/exam booklets
 * (Unseen reading comprehension and Conversation practice).
 * Everything here renders ONLY on paper (wrapped in `hidden print:block`).
 */

const LETTERS = ["A", "B", "C", "D"];

/** Minimal question shape that both Unseen and Conversation questions satisfy. */
export interface PrintableQuestion {
  id?: string;
  type: string;
  prompt: string;
  linesHint?: string;
  situationContext?: string;
  options?: string[];
  correctIndex?: number;
  targetSentence?: string;
  modelAnswer?: string;
  keywords?: string[];
  explanationHebrew?: string;
  points?: number;
}

const isChoiceQuestion = (q: PrintableQuestion) => q.type === "mcq" || q.type === "reply_mcq";
const isCopyQuestion = (q: PrintableQuestion) => q.type === "copy";

/** Root wrapper for the print-only booklet, including page/ruby print styles. */
export function PrintBooklet({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden print:block w-full bg-white text-slate-900 font-sans text-left ltr antialiased notranslate" translate="no" lang="en">
      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: A4 portrait;
          margin: 20mm 20mm 20mm 20mm !important;
        }
        @media print {
          html, body {
            background: #ffffff !important;
            color: #1e293b !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-page-sheet {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          .print-break-before {
            break-before: page !important;
            page-break-before: always !important;
          }
          .print-avoid-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .ruby-vocab-print {
            ruby-position: over;
            ruby-align: center;
          }
          .ruby-vocab-print rt {
            font-size: 9px !important;
            line-height: 1.15 !important;
            font-weight: 700 !important;
            color: #334155 !important;
            padding-bottom: 1px !important;
            white-space: nowrap !important;
          }
        }
      `}} />
      {children}
    </div>
  );
}

/** Student exam header: Name / Class / Date / Teacher / Score. */
export function PrintExamHeader({ level, subject }: { level: string; subject: string }) {
  return (
    <div className="border border-slate-300 rounded-xl p-3.5 mb-5 print-avoid-break bg-slate-50/50">
      <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-800">English Exam</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-xs text-slate-600 font-medium">{subject}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
            Level: {level}
          </span>
          <span className="text-xs font-bold text-slate-700">100 Points</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-y-3 gap-x-4 text-xs pt-0.5">
        <div className="col-span-5 flex items-baseline gap-1.5">
          <span className="font-semibold text-slate-700 shrink-0">Name:</span>
          <span className="flex-1 border-b border-dotted border-slate-400 h-4"></span>
        </div>
        <div className="col-span-3 flex items-baseline gap-1.5">
          <span className="font-semibold text-slate-700 shrink-0">Class:</span>
          <span className="flex-1 border-b border-dotted border-slate-400 h-4"></span>
        </div>
        <div className="col-span-4 flex items-baseline gap-1.5">
          <span className="font-semibold text-slate-700 shrink-0">Date:</span>
          <span className="flex-1 border-b border-dotted border-slate-400 h-4"></span>
        </div>
        <div className="col-span-6 flex items-baseline gap-1.5">
          <span className="font-semibold text-slate-700 shrink-0">Teacher:</span>
          <span className="flex-1 border-b border-dotted border-slate-400 h-4"></span>
        </div>
        <div className="col-span-6 text-right">
          <span className="inline-flex items-center gap-2 font-bold text-xs bg-white border border-slate-300 rounded-lg px-3 py-1">
            <span>Score:</span>
            <span className="text-slate-400 font-normal">________ / 100</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/** Box listing the user's saved vocabulary words that appear in the text. */
export function PrintVocabList({ words }: { words: VocabItem[] }) {
  if (words.length === 0) return null;
  return (
    <div className="mt-5 p-3 rounded-lg border border-slate-200 bg-slate-50/60 print-avoid-break">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
        Vocabulary Words &middot; מילים מאוצר המילים:
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-1.5 text-xs">
        {words.map((item) => (
          <div key={item.id} className="flex items-baseline justify-between text-[11px] border-b border-dotted border-slate-200 pb-0.5">
            <span className="font-semibold text-slate-800">{item.english}</span>
            <span className="text-slate-600 rtl font-medium">{item.hebrew}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrintQuestionItem({ q, number }: { q: PrintableQuestion; number: number }) {
  return (
    <div className="print-avoid-break border-b border-slate-100 pb-3 space-y-2">
      <div className="flex justify-between items-start gap-2">
        <div className="font-bold text-slate-900 text-[12.5px] leading-snug">
          <span className="text-slate-500 mr-1">{number}.</span>
          <span>{q.prompt}</span>
          {q.linesHint && (
            <span className="text-slate-500 font-normal text-xs ml-1.5 italic">({q.linesHint})</span>
          )}
        </div>
        <span className="text-[10px] font-bold text-slate-600 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
          {q.points || 10} pts
        </span>
      </div>

      {q.situationContext && (
        <p className="text-[11.5px] text-slate-600 italic pl-4">{q.situationContext}</p>
      )}

      {/* MCQ Options with friendly pill bubbles */}
      {q.options && q.options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 pl-4">
          {q.options.map((opt, oIdx) => (
            <div key={oIdx} className="flex items-start gap-2 text-[11.5px] leading-snug text-slate-800">
              <span className="w-4 h-4 rounded-full border border-slate-400 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {LETTERS[oIdx]}
              </span>
              <span className="flex-1">{opt}</span>
            </div>
          ))}
        </div>
      )}

      {/* Ruled lines for open/copy type questions */}
      {!isChoiceQuestion(q) && (
        <div className="pt-2 pl-4 space-y-2.5">
          <div className="border-b border-dotted border-slate-400 h-4 w-full" />
          <div className="border-b border-dotted border-slate-400 h-4 w-full" />
        </div>
      )}
    </div>
  );
}

/**
 * Questions part of the booklet, split into sheets of 5 questions each
 * (each later sheet starts on a new page).
 */
export function PrintQuestionSheets({
  questions,
  breakBeforeFirst,
  instructions,
}: {
  questions: PrintableQuestion[];
  breakBeforeFirst: boolean;
  instructions: string;
}) {
  const PER_SHEET = 5;
  const chunks: PrintableQuestion[][] = [];
  for (let i = 0; i < questions.length; i += PER_SHEET) {
    chunks.push(questions.slice(i, i + PER_SHEET));
  }

  return (
    <>
      {chunks.map((chunk, chunkIdx) => {
        const start = chunkIdx * PER_SHEET;
        const end = start + chunk.length;
        const isFirst = chunkIdx === 0;
        return (
          <div
            key={chunkIdx}
            className={`print-page-sheet ${!isFirst || breakBeforeFirst ? "print-break-before" : ""}`}
          >
            <section className="space-y-3.5 pt-1">
              <div className="border-b border-slate-300 pb-2 mb-3.5">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                    {isFirst ? "Part II: Questions" : "Part II: Questions Continued"} (Questions {start + 1} &ndash; {end})
                  </h2>
                  <span className="text-xs text-slate-600 font-medium">
                    {isFirst
                      ? `${questions.length} questions • 10 points each`
                      : "Continued from previous page"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 italic mt-0.5">{instructions}</p>
              </div>

              <div className="space-y-4 text-xs">
                {chunk.map((q, idx) => (
                  <PrintQuestionItem key={q.id || start + idx} q={q} number={start + idx + 1} />
                ))}
              </div>
            </section>
          </div>
        );
      })}
    </>
  );
}

/** Teacher answer key sheet (always starts on a new page). */
export function PrintAnswerKey({
  questions,
  title,
  level,
  getReference,
}: {
  questions: PrintableQuestion[];
  title: string;
  level: string;
  /** Fallback reference text when a question has no linesHint. */
  getReference?: (q: PrintableQuestion, index: number) => string;
}) {
  return (
    <div className="print-page-sheet print-break-before">
      <section className="space-y-4 pt-1">
        <div className="border-b border-slate-300 pb-2 text-center">
          <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-900">
            Teacher Answer Key & Explanations (מחוון למורה)
          </h2>
          <p className="text-xs text-slate-500">
            {title} &bull; {level} &bull; Total Points: 100
          </p>
        </div>

        <div className="space-y-2 text-xs">
          {questions.map((q, qIdx) => {
            const correctLetter = LETTERS[q.correctIndex || 0] || "A";
            const reference = q.linesHint || getReference?.(q, qIdx);

            return (
              <div key={qIdx} className="print-avoid-break p-2 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex justify-between items-center font-bold text-slate-900 text-xs">
                  <span>
                    Question {qIdx + 1}{reference ? ` (${reference})` : ""}:
                  </span>
                  {isChoiceQuestion(q) ? (
                    <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[10px]">
                      Correct: ({correctLetter})
                    </span>
                  ) : isCopyQuestion(q) ? (
                    <span className="bg-amber-700 text-white px-2 py-0.5 rounded text-[10px]">
                      Sentence Quote (ציטוט משפט)
                    </span>
                  ) : (
                    <span className="bg-blue-700 text-white px-2 py-0.5 rounded text-[10px]">
                      Open / Free typing (תשובה פתוחה)
                    </span>
                  )}
                </div>

                {isChoiceQuestion(q) ? (
                  <p className="text-slate-800 text-xs font-medium pl-2">
                    &rarr; {q.options ? q.options[q.correctIndex || 0] : ""}
                  </p>
                ) : isCopyQuestion(q) ? (
                  <div className="text-slate-800 text-xs font-medium pl-2 space-y-0.5">
                    <p>&ldquo;{q.targetSentence || ""}&rdquo;</p>
                  </div>
                ) : (
                  <div className="text-slate-800 text-xs font-medium pl-2 space-y-0.5">
                    <p className="font-semibold text-slate-900">דוגמת תשובה (Model Answer):</p>
                    <p className="italic text-slate-700">&ldquo;{q.modelAnswer || ""}&rdquo;</p>
                    {q.keywords && q.keywords.length > 0 && (
                      <p className="text-[11px] text-slate-500">
                        מילות מפתח נדרשות: {q.keywords.join(", ")}
                      </p>
                    )}
                  </div>
                )}

                {q.explanationHebrew && (
                  <p className="text-slate-600 text-[11px] rtl text-right border-t border-slate-200 pt-1 mt-1">
                    <strong>הסבר פדגוגי בעברית:</strong> {q.explanationHebrew}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
