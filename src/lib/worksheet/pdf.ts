// Turns a rendered worksheet (WorksheetSheet in the DOM) into an A4 PDF.
// The sheet is captured once as an image and cut into pages between its
// `data-ws-block` elements, so a question is never split across pages.
// Browser only; the libraries are loaded on demand.

const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const MARGIN_MM = 20;
const CONTENT_W_MM = PAGE_W_MM - 2 * MARGIN_MM;
const CONTENT_H_MM = PAGE_H_MM - 2 * MARGIN_MM;

/** Width (CSS px) to render the sheet at: A4 content width at 96 dpi. */
export const PDF_SHEET_WIDTH_PX = Math.round((CONTENT_W_MM / 25.4) * 96);

interface Block {
  top: number;
  bottom: number;
  pageBreak: boolean;
  keepNext: boolean;
}

function readBlocks(root: HTMLElement): Block[] {
  const origin = root.getBoundingClientRect().top;
  return Array.from(root.querySelectorAll<HTMLElement>("[data-ws-block]")).map((el) => {
    const r = el.getBoundingClientRect();
    return {
      top: r.top - origin,
      bottom: r.bottom - origin,
      pageBreak: el.hasAttribute("data-ws-break"),
      keepNext: el.hasAttribute("data-ws-keep-next"),
    };
  });
}

/** Page start offsets (px). Exported for testing. */
export function paginate(blocks: Block[], pageH: number): number[] {
  const starts = [0];
  let pageStart = 0;
  blocks.forEach((b, i) => {
    let next: number | null = null;
    if (b.pageBreak && b.top > pageStart + 1) {
      next = b.top;
    } else if (b.bottom - pageStart > pageH && b.top > pageStart + 1) {
      // Move the block (and the headings that must stay with it) to a new page.
      let j = i;
      while (j > 0 && blocks[j - 1].keepNext && blocks[j - 1].top > pageStart + 1) j--;
      next = blocks[j].top;
    }
    if (next !== null) {
      starts.push(next);
      pageStart = next;
    }
    // A single block taller than a page has to be cut.
    while (b.bottom - pageStart > pageH) {
      pageStart += pageH;
      starts.push(pageStart);
    }
  });
  return starts;
}

async function render(root: HTMLElement, pixelRatio: number, quality: number): Promise<Blob> {
  const [{ toCanvas }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
  if (document.fonts?.ready) await document.fonts.ready;

  const widthPx = root.offsetWidth;
  const totalPx = root.scrollHeight;
  const pageH = (widthPx * CONTENT_H_MM) / CONTENT_W_MM;
  const starts = paginate(readBlocks(root), pageH);

  const canvas = await toCanvas(root, { pixelRatio, backgroundColor: "#ffffff", width: widthPx, height: totalPx });
  const scale = canvas.width / widthPx;
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });

  starts.forEach((start, k) => {
    const end = Math.min(starts[k + 1] ?? totalPx, start + pageH, totalPx);
    const hPx = Math.max(1, end - start);
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = Math.round(hPx * scale);
    const g = slice.getContext("2d");
    if (!g) return;
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, slice.width, slice.height);
    g.drawImage(canvas, 0, Math.round(start * scale), canvas.width, slice.height, 0, 0, slice.width, slice.height);
    if (k > 0) pdf.addPage();
    pdf.addImage(slice.toDataURL("image/jpeg", quality), "JPEG", MARGIN_MM, MARGIN_MM, CONTENT_W_MM, (hPx * CONTENT_W_MM) / widthPx);
  });
  return pdf.output("blob");
}

/** Max PDF size we send (the server request limit is ~4.5 MB, base64 adds a third). */
export const MAX_PDF_BYTES = 3_000_000;

/** Renders the sheet element to a PDF, lowering the image quality if the file is too big. */
export async function sheetToPdf(root: HTMLElement): Promise<Blob> {
  const tries: [number, number][] = [
    [2, 0.82],
    [1.5, 0.7],
    [1.2, 0.6],
  ];
  let blob: Blob | null = null;
  for (const [ratio, quality] of tries) {
    blob = await render(root, ratio, quality);
    if (blob.size <= MAX_PDF_BYTES) return blob;
  }
  return blob!;
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
