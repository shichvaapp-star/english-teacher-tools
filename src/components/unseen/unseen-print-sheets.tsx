"use client";

import React from "react";
import { PrintedPassageText } from "@/components/unseen/unseen-helpers";
import { type UnseenPracticeController } from "@/components/unseen/use-unseen-practice";

export function UnseenPrintSheets({ c }: { c: UnseenPracticeController }) {
  const {
    currentStory,
    passageSavedVocabWords,
    printIncludeAnswers,
    printIncludeHeader,
    printIncludeVocab,
    printLineSpacing,
    printScope,
    printSeparatePages,
    savedVocabMap,
  } = c;
  return (
    <>
      {/* =========================================================================
          DEDICATED PROFESSIONAL PRINT EXAM BOOKLET
          Visible ONLY during window.print() (hidden on screen)
          Structured into dedicated .print-page-sheet sections with standard 20mm Word margins
          ========================================================================= */}
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
        {/* SHEET 1: Reading Passage Page */}
        {(printScope === "full" || printScope === "text_only") && (
          <div className="print-page-sheet">
            {/* Student Exam Header */}
            {printIncludeHeader && (
              <div className="border border-slate-300 rounded-xl p-3.5 mb-5 print-avoid-break bg-slate-50/50">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800">English Exam</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-xs text-slate-600 font-medium">Reading Comprehension</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      Level: {currentStory.level}
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
            )}

            {/* PART I: Reading Passage */}
            <section className="space-y-4">
              {/* Passage Title */}
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

              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider pb-1">
                <span>Part I: Read the text below carefully</span>
                <span>Answer the questions according to the passage</span>
              </div>

              {/* Paragraphs with friendly circular badges & configurable line spacing for handwritten notes */}
              <div
                className={`text-sm text-slate-800 text-justify ${
                  printLineSpacing === "spacious"
                    ? "print-line-spacing-spacious space-y-7"
                    : printLineSpacing === "double"
                    ? "print-line-spacing-double space-y-6"
                    : printLineSpacing === "comfortable"
                    ? "print-line-spacing-comfortable space-y-5"
                    : passageSavedVocabWords.length > 0
                    ? "print-line-spacing-comfortable space-y-4"
                    : "print-line-spacing-normal space-y-4"
                }`}
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

              {/* Saved Vocabulary Words from Passage (Only vocabulary words added by user) */}
              {printIncludeVocab && passageSavedVocabWords.length > 0 && (
                <div className="mt-5 p-3 rounded-lg border border-slate-200 bg-slate-50/60 print-avoid-break">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Vocabulary Words &middot; מילים מאוצר המילים:
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-1.5 text-xs">
                    {passageSavedVocabWords.map((item) => (
                      <div key={item.id} className="flex items-baseline justify-between text-[11px] border-b border-dotted border-slate-200 pb-0.5">
                        <span className="font-semibold text-slate-800">{item.english}</span>
                        <span className="text-slate-600 rtl font-medium">{item.hebrew}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* SHEET 2: Questions Page 1 (Questions 1 - 5) */}
        {(printScope === "full" || printScope === "questions_only") && (
          <div className={`print-page-sheet ${printScope === "full" && printSeparatePages ? "print-break-before" : ""}`}>
            <section className="space-y-3.5 pt-1">
              <div className="border-b border-slate-300 pb-2 mb-3.5">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                    Part II: Questions (Questions 1 &ndash; 5)
                  </h2>
                  <span className="text-xs text-slate-600 font-medium">10 questions &bull; 10 points each</span>
                </div>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  Answer all questions according to the passage. Circle the letter of the correct answer for multiple-choice questions.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {currentStory.questions.slice(0, 5).map((q, idx) => {
                  const qIdx = idx;
                  const letters = ["A", "B", "C", "D"];
                  return (
                    <div key={q.id || qIdx} className="print-avoid-break border-b border-slate-100 pb-3 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-bold text-slate-900 text-[12.5px] leading-snug">
                          <span className="text-slate-500 mr-1">{qIdx + 1}.</span>
                          <span>{q.prompt}</span>
                          {q.linesHint && (
                            <span className="text-slate-500 font-normal text-xs ml-1.5 italic">({q.linesHint})</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {q.points || 10} pts
                        </span>
                      </div>

                      {/* MCQ Options with friendly pill bubbles */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 pl-4">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-start gap-2 text-[11.5px] leading-snug text-slate-800">
                              <span className="w-4 h-4 rounded-full border border-slate-400 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {letters[oIdx]}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Ruled lines for open/copy type questions if any */}
                      {q.type !== "mcq" && (
                        <div className="pt-2 pl-4 space-y-2.5">
                          <div className="border-b border-dotted border-slate-400 h-4 w-full" />
                          <div className="border-b border-dotted border-slate-400 h-4 w-full" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* SHEET 3: Questions Page 2 (Questions 6 - 10) */}
        {(printScope === "full" || printScope === "questions_only") && currentStory.questions.length > 5 && (
          <div className="print-page-sheet print-break-before">
            <section className="space-y-3.5 pt-1">
              <div className="border-b border-slate-300 pb-2 mb-3.5">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                    Part II: Questions Continued (Questions 6 &ndash; {currentStory.questions.length})
                  </h2>
                  <span className="text-xs text-slate-600 font-medium">Continued from previous page</span>
                </div>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  Answer all questions according to the passage. Circle the letter of the correct answer for multiple-choice questions.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {currentStory.questions.slice(5).map((q, idx) => {
                  const qIdx = idx + 5;
                  const letters = ["A", "B", "C", "D"];
                  return (
                    <div key={q.id || qIdx} className="print-avoid-break border-b border-slate-100 pb-3 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-bold text-slate-900 text-[12.5px] leading-snug">
                          <span className="text-slate-500 mr-1">{qIdx + 1}.</span>
                          <span>{q.prompt}</span>
                          {q.linesHint && (
                            <span className="text-slate-500 font-normal text-xs ml-1.5 italic">({q.linesHint})</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {q.points || 10} pts
                        </span>
                      </div>

                      {/* MCQ Options with friendly pill bubbles */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 pl-4">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-start gap-2 text-[11.5px] leading-snug text-slate-800">
                              <span className="w-4 h-4 rounded-full border border-slate-400 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {letters[oIdx]}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Ruled lines for open/copy type questions if any */}
                      {q.type !== "mcq" && (
                        <div className="pt-2 pl-4 space-y-2.5">
                          <div className="border-b border-dotted border-slate-400 h-4 w-full" />
                          <div className="border-b border-dotted border-slate-400 h-4 w-full" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* Optional Teacher Answer Key Sheet */}
        {printIncludeAnswers && (
          <div className="print-page-sheet print-break-before">
            <section className="space-y-4 pt-1">
              <div className="border-b border-slate-300 pb-2 text-center">
                <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-900">
                  Teacher Answer Key & Explanations (מחוון למורה)
                </h2>
                <p className="text-xs text-slate-500">
                  {currentStory.title} &bull; {currentStory.level} &bull; Total Points: 100
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {currentStory.questions.map((q, qIdx) => {
                  const letters = ["A", "B", "C", "D"];
                  const correctLetter = letters[q.correctIndex || 0] || "A";

                  return (
                    <div key={qIdx} className="print-avoid-break p-2 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                      <div className="flex justify-between items-center font-bold text-slate-900 text-xs">
                        <span>
                          Question {qIdx + 1} ({q.linesHint || `Paragraph ${q.paragraphIndex + 1}`}):
                        </span>
                        {q.type === "mcq" ? (
                          <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[10px]">
                            Correct: ({correctLetter})
                          </span>
                        ) : q.type === "copy" ? (
                          <span className="bg-amber-700 text-white px-2 py-0.5 rounded text-[10px]">
                            Sentence Quote (ציטוט משפט)
                          </span>
                        ) : (
                          <span className="bg-blue-700 text-white px-2 py-0.5 rounded text-[10px]">
                            Open / Free typing (תשובה פתוחה)
                          </span>
                        )}
                      </div>

                      {q.type === "mcq" ? (
                        <p className="text-slate-800 text-xs font-medium pl-2">
                          &rarr; {q.options ? q.options[q.correctIndex || 0] : ""}
                        </p>
                      ) : q.type === "copy" ? (
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
        )}
      </div>
    </>
  );
}
