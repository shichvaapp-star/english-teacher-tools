"use client";

import React from "react";
import { PrintedPassageText } from "@/components/unseen/unseen-helpers";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";
import {
  PrintAnswerKey,
  PrintBooklet,
  PrintExamHeader,
  PrintQuestionSheets,
  PrintVocabList,
} from "@/components/print/print-sheet-parts";
import { printLineSpacingClass } from "@/components/print/use-print-options";

/**
 * DEDICATED PROFESSIONAL PRINT EXAM BOOKLET
 * Visible ONLY during window.print() (hidden on screen).
 */
export function UnseenPrintSheets({ c }: { c: UnseenPracticeController }) {
  const { currentStory, passageSavedVocabWords, printOptions, savedVocabMap } = c;
  const {
    printIncludeAnswers,
    printIncludeHeader,
    printIncludeVocab,
    printLineSpacing,
    printScope,
    printSeparatePages,
  } = printOptions;

  return (
    <PrintBooklet>
      {/* SHEET 1: Reading Passage Page */}
      {(printScope === "full" || printScope === "text_only") && (
        <div className="print-page-sheet">
          {printIncludeHeader && (
            <PrintExamHeader level={currentStory.level} subject="Reading Comprehension" />
          )}

          <section className="space-y-4">
            <div className="text-center pb-2.5 border-b border-slate-200 mb-3.5">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                <PrintedPassageText text={currentStory.title} savedVocabMap={savedVocabMap} />
              </h1>
              {currentStory.hebrewTitle && (
                <p className="text-xs font-medium text-slate-500 rtl mt-0.5">
                  ({currentStory.hebrewTitle})
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider pb-1">
              <span>Part I: Read the text below carefully</span>
              <span>Answer the questions according to the passage</span>
            </div>

            <div
              className={`text-sm text-slate-800 text-justify ${printLineSpacingClass(
                printLineSpacing,
                passageSavedVocabWords.length > 0
              )}`}
            >
              {currentStory.paragraphs.map((para, idx) => (
                <div key={idx} className="print-avoid-break flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="m-0 flex-1">
                    <PrintedPassageText text={para} savedVocabMap={savedVocabMap} />
                  </p>
                </div>
              ))}
            </div>

            {printIncludeVocab && <PrintVocabList words={passageSavedVocabWords} />}
          </section>
        </div>
      )}

      {/* SHEETS 2+: Questions (5 per page) */}
      {(printScope === "full" || printScope === "questions_only") && (
        <PrintQuestionSheets
          questions={currentStory.questions}
          breakBeforeFirst={printScope === "full" && printSeparatePages}
          instructions="Answer all questions according to the passage. Circle the letter of the correct answer for multiple-choice questions."
        />
      )}

      {/* Optional Teacher Answer Key Sheet */}
      {printIncludeAnswers && (
        <PrintAnswerKey
          questions={currentStory.questions}
          title={currentStory.title}
          level={currentStory.level}
          getReference={(_q, idx) => `Paragraph ${(currentStory.questions[idx]?.paragraphIndex ?? 0) + 1}`}
        />
      )}
    </PrintBooklet>
  );
}
