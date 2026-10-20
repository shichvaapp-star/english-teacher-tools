import { TeacherVocabWord } from "@/types/vocab-bank";
import * as XLSX from "xlsx";
import mammoth from "mammoth";

export interface ParsedVocabResult {
  words: TeacherVocabWord[];
  warnings: string[];
  totalRowsProcessed: number;
}

const HEBREW_REGEX = /[\u0590-\u05FF]/;
const ENGLISH_REGEX = /[a-zA-Z]/;

function normalizePos(raw: string): "noun" | "verb" | "adjective" | "adverb" | "phrase" | undefined {
  const clean = raw.trim().toLowerCase();
  if (clean.includes("noun") || clean.includes("שם עצם") || clean === "n" || clean === "n.") return "noun";
  if (clean.includes("verb") || clean.includes("פועל") || clean === "v" || clean === "v.") return "verb";
  if (clean.includes("adj") || clean.includes("תואר") || clean === "a.") return "adjective";
  if (clean.includes("adv") || clean.includes("תואר הפועל")) return "adverb";
  if (clean.includes("phrase") || clean.includes("ביטוי") || clean.includes("ניב") || clean.includes("idiom")) return "phrase";
  return undefined;
}

/**
 * Given row cells [cell0, cell1, cell2, cell3...], determine which is English, which is Hebrew, POS, and Example
 */
function classifyRow(cells: string[], index: number): TeacherVocabWord | null {
  const cleanCells = cells.map((c) => (typeof c === "string" ? c.trim() : String(c || "").trim())).filter(Boolean);
  if (cleanCells.length === 0) return null;

  // Skip header rows like "Word", "Translation", "מילה", "תרגום"
  const rowText = cleanCells.join(" ").toLowerCase();
  if (
    index === 0 &&
    (rowText.includes("english") || rowText.includes("word") || rowText.includes("מילה") || rowText.includes("תרגום"))
  ) {
    return null;
  }

  let engCandidate = "";
  let hebCandidate = "";
  let posCandidate: "noun" | "verb" | "adjective" | "adverb" | "phrase" | undefined;
  let exampleCandidate = "";

  // Check each cell
  const unassigned: string[] = [];
  cleanCells.forEach((c) => {
    const hasHeb = HEBREW_REGEX.test(c);
    const hasEng = ENGLISH_REGEX.test(c);

    if (hasHeb && !hasEng && !hebCandidate) {
      hebCandidate = c;
    } else if (hasEng && !hasHeb && !engCandidate && c.length < 50) {
      // Possible English word
      engCandidate = c;
    } else {
      const pos = normalizePos(c);
      if (pos && !posCandidate) {
        posCandidate = pos;
      } else {
        unassigned.push(c);
      }
    }
  });

  // If we didn't find clear Hebrew/English by script alone, use order
  if (!engCandidate && cleanCells.length > 0) {
    engCandidate = cleanCells[0];
  }
  if (!hebCandidate && cleanCells.length > 1) {
    hebCandidate = cleanCells[1];
  }

  // Find example sentence from unassigned or leftover cells
  if (!exampleCandidate && unassigned.length > 0) {
    exampleCandidate = unassigned.join("; ");
  }

  if (!engCandidate || !hebCandidate) return null;

  return {
    id: `tvw-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
    english: engCandidate,
    hebrew: hebCandidate,
    partOfSpeech: posCandidate || "noun",
    example: exampleCandidate || "",
  };
}

/**
 * Parse plain text pasted from clipboard or text files (.txt, .csv, .tsv)
 */
export function parseRawText(text: string): ParsedVocabResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const words: TeacherVocabWord[] = [];
  const warnings: string[] = [];

  lines.forEach((line, idx) => {
    let cells: string[] = [];

    // Try tab separation
    if (line.includes("\t")) {
      cells = line.split("\t");
    } else if (line.includes(",")) {
      // Handle simple CSV
      cells = line.split(",");
    } else if (line.includes(" - ")) {
      cells = line.split(" - ");
    } else if (line.includes(":")) {
      cells = line.split(":");
    } else if (line.includes("=")) {
      cells = line.split("=");
    } else if (line.includes("-")) {
      cells = line.split("-");
    } else {
      // Single word or unsupported format
      cells = [line];
    }

    const item = classifyRow(cells, idx);
    if (item) {
      words.push(item);
    } else if (line.length > 3 && idx > 0) {
      warnings.push(`שורה ${idx + 1} לא פוענחה כהלכה: "${line.slice(0, 40)}..."`);
    }
  });

  return {
    words,
    warnings,
    totalRowsProcessed: lines.length,
  };
}

/**
 * Parse Excel files (.xlsx, .xls)
 */
export async function parseExcelFile(file: File): Promise<ParsedVocabResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    return { words: [], warnings: ["קובץ ה-Excel אינו מכיל גיליונות."], totalRowsProcessed: 0 };
  }

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

  const words: TeacherVocabWord[] = [];
  const warnings: string[] = [];

  rows.forEach((row, idx) => {
    if (!row || !Array.isArray(row) || row.length === 0) return;
    const stringCells = row.map((cell) => (cell !== undefined && cell !== null ? String(cell).trim() : ""));
    const item = classifyRow(stringCells, idx);
    if (item) {
      words.push(item);
    } else if (stringCells.filter(Boolean).length > 0 && idx > 0) {
      warnings.push(`שורה ${idx + 1} בגיליון לא הכילה מילה ותרגום תקינים.`);
    }
  });

  return {
    words,
    warnings,
    totalRowsProcessed: rows.length,
  };
}

/**
 * Parse Word documents (.docx)
 */
export async function parseWordFile(file: File): Promise<ParsedVocabResult> {
  const buffer = await file.arrayBuffer();
  
  // Convert docx to HTML to preserve table cells
  const htmlResult = await mammoth.convertToHtml({ arrayBuffer: buffer });
  const html = htmlResult.value;

  const words: TeacherVocabWord[] = [];
  const warnings: string[] = [];

  // Check if document contains tables
  if (html.includes("<table")) {
    if (typeof window !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const rows = Array.from(doc.querySelectorAll("tr"));

      rows.forEach((tr, idx) => {
        const cells = Array.from(tr.querySelectorAll("td, th")).map((td) => td.textContent?.trim() || "");
        const item = classifyRow(cells, idx);
        if (item) {
          words.push(item);
        }
      });

      if (words.length > 0) {
        return {
          words,
          warnings,
          totalRowsProcessed: rows.length,
        };
      }
    }
  }

  // Fallback to plain text extraction from Word document
  const rawTextResult = await mammoth.extractRawText({ arrayBuffer: buffer });
  const rawText = rawTextResult.value;
  return parseRawText(rawText);
}

/**
 * Generic entry point for any uploaded file
 */
export async function parseVocabFile(file: File): Promise<ParsedVocabResult> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "xlsx" || ext === "xls") {
    return parseExcelFile(file);
  }
  if (ext === "docx") {
    return parseWordFile(file);
  }
  if (ext === "csv" || ext === "tsv" || ext === "txt") {
    const text = await file.text();
    return parseRawText(text);
  }

  // Fallback try reading as text
  try {
    const text = await file.text();
    return parseRawText(text);
  } catch (err) {
    return {
      words: [],
      warnings: [`פורמט הקובץ .${ext} אינו נתמך. אנא השתמשו בקובץ Excel, Word, או CSV.`],
      totalRowsProcessed: 0,
    };
  }
}
