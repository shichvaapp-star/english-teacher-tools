"use client";

import React from "react";
import { type VocabItem } from "@/lib/vocab-storage";
import { PrintedPassageText } from "@/components/unseen/unseen-helpers";
import { type ConversationPracticeController } from "@/components/conversation/use-conversation-practice";
import {
  PrintAnswerKey,
  PrintBooklet,
  PrintExamHeader,
  PrintQuestionSheets,
  PrintVocabList,
} from "@/components/print/print-sheet-parts";
import { printLineSpacingClass } from "@/components/print/use-print-options";

/**
 * Print-only conversation worksheet: dialogue transcript + questions (+ optional answer key).
 * Hidden on screen; shown only during window.print().
 */
export function ConversationPrintSheets({ c }: { c: ConversationPracticeController }) {
  const { currentScenario, dialogueSavedVocabWords, printOptions, savedVocabMap } = c;
  const {
    printIncludeAnswers,
    printIncludeHeader,
    printIncludeVocab,
    printLineSpacing,
    printScope,
    printSeparatePages,
  } = printOptions;

  // Glossed (ruby) Hebrew only when the teacher chose to include vocabulary.
  const glossMap = printIncludeVocab ? savedVocabMap : new Map<string, VocabItem>();
  const speakerById = new Map(currentScenario.speakers.map((s) => [s.id, s]));

  return (
    <PrintBooklet>
      {/* SHEET 1: Dialogue Transcript */}
      {(printScope === "full" || printScope === "text_only") && (
        <div className="print-page-sheet">
          {printIncludeHeader && (
            <PrintExamHeader level={currentScenario.level} subject="Conversation Comprehension" />
          )}

          <section className="space-y-4">
            <div className="text-center pb-2.5 border-b border-slate-200 mb-3.5">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                <PrintedPassageText text={currentScenario.title} savedVocabMap={glossMap} />
              </h1>
              {currentScenario.hebrewTitle && (
                <p className="text-xs font-medium text-slate-500 rtl mt-0.5">
                  ({currentScenario.hebrewTitle})
                </p>
              )}
              {currentScenario.settingDescription && (
                <p className="text-xs italic text-slate-600 mt-1.5">{currentScenario.settingDescription}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider pb-1">
              <span>Part I: Read the conversation carefully</span>
              <span>Answer the questions according to the dialogue</span>
            </div>

            <div
              className={`text-sm text-slate-800 ${printLineSpacingClass(
                printLineSpacing,
                printIncludeVocab && dialogueSavedVocabWords.length > 0
              )}`}
            >
              {currentScenario.turns.map((turn, idx) => {
                const speaker = speakerById.get(turn.speakerId);
                return (
                  <div key={idx} className="print-avoid-break flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="m-0 flex-1">
                      <span className="font-bold text-slate-900">
                        {speaker ? speaker.name : turn.speakerId}
                        {speaker?.role ? (
                          <span className="font-normal text-slate-500 text-xs"> ({speaker.role})</span>
                        ) : null}
                        :
                      </span>{" "}
                      {turn.stageDirection && (
                        <span className="italic text-slate-500 text-xs">{turn.stageDirection} </span>
                      )}
                      <PrintedPassageText text={turn.text} savedVocabMap={glossMap} />
                    </p>
                  </div>
                );
              })}
            </div>

            {printIncludeVocab && <PrintVocabList words={dialogueSavedVocabWords} />}
          </section>
        </div>
      )}

      {/* SHEETS 2+: Questions (5 per page) */}
      {(printScope === "full" || printScope === "questions_only") && (
        <PrintQuestionSheets
          questions={currentScenario.questions}
          breakBeforeFirst={printScope === "full" && printSeparatePages}
          instructions="Answer all questions according to the conversation. Circle the letter of the correct answer for multiple-choice questions."
        />
      )}

      {/* Optional Teacher Answer Key Sheet */}
      {printIncludeAnswers && (
        <PrintAnswerKey
          questions={currentScenario.questions}
          title={currentScenario.title}
          level={currentScenario.level}
        />
      )}
    </PrintBooklet>
  );
}
