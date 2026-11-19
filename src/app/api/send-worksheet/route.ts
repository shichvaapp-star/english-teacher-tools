import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { MAX_PRINT_COPIES, PRINT_EMAIL, PRINT_PREFERENCES_HE } from "@/config/print-email";
import type { SendWorksheetReason, SendWorksheetRequest, SendWorksheetResponse } from "@/types/send-worksheet";

// "Send to print": emails a worksheet PDF to the school's print technician.
// Only signed-in teachers can send, the recipient is fixed on the server, and
// each teacher is rate-limited. Mail goes out through Gmail SMTP with an app
// password (env: GMAIL_USER, GMAIL_APP_PASSWORD).
//
// Test mode: outside production (Vercel preview / local), PRINT_EMAIL_TEST_TO
// redirects the email to a test address so trying the feature never reaches
// the print technician. Production always sends to PRINT_EMAIL.

const MAX_PDF_BYTES = 3_300_000;
const MAX_PER_HOUR = 10;
const sentAt = new Map<string, number[]>();

function reply(status: number, reason?: SendWorksheetReason, testMode = false) {
  return NextResponse.json<SendWorksheetResponse>(
    reason ? { success: false, reason } : { success: true, ...(testMode ? { testMode: true } : {}) },
    { status }
  );
}

/** The test address when not in production, else null. */
function testRecipient(): string | null {
  if (process.env.VERCEL_ENV === "production") return null;
  const to = process.env.PRINT_EMAIL_TEST_TO?.trim();
  return to && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) ? to : null;
}

const oneLine = (s: string, max: number) => s.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

function hebrewDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

const GRADE_HE: Record<number, string> = { 7: "ז׳", 8: "ח׳", 9: "ט׳" };

function rateLimited(uid: string): boolean {
  const now = Date.now();
  const recent = (sentAt.get(uid) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  if (recent.length >= MAX_PER_HOUR) {
    sentAt.set(uid, recent);
    return true;
  }
  sentAt.set(uid, [...recent, now]);
  return false;
}

export async function POST(request: Request) {
  const admin = getFirebaseAdmin();
  if (!admin) return reply(503, "server_not_configured");
  // Pasted values often carry stray spaces; Google shows app passwords as "abcd efgh ijkl mnop".
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!gmailUser || !gmailPass) return reply(503, "email_not_configured");

  // ── Who is sending ──
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!token) return reply(401, "not_signed_in");
  let uid: string;
  let email: string;
  try {
    const decoded = await admin.auth.verifyIdToken(token);
    if (decoded.role === "student" || !decoded.email) return reply(403, "not_teacher");
    uid = decoded.uid;
    email = decoded.email;
  } catch {
    return reply(401, "not_signed_in");
  }

  // ── What is being sent ──
  let body: Partial<SendWorksheetRequest>;
  try {
    body = (await request.json()) as Partial<SendWorksheetRequest>;
  } catch {
    return reply(400, "bad_request");
  }
  const copies = Number(body.copies);
  if (typeof body.pdfBase64 !== "string" || !Number.isInteger(copies) || copies < 1 || copies > MAX_PRINT_COPIES) {
    return reply(400, "bad_request");
  }
  const pdf = Buffer.from(body.pdfBase64, "base64");
  if (pdf.length > MAX_PDF_BYTES) return reply(413, "too_large");
  if (pdf.subarray(0, 5).toString("latin1") !== "%PDF-") return reply(400, "bad_request");

  const title = oneLine(typeof body.title === "string" ? body.title : "", 120) || "English Worksheet";
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 1000) : "";
  const neededBy = typeof body.neededBy === "string" ? hebrewDate(body.neededBy) : "";
  const versions = body.versions === true;
  const gradeHe = GRADE_HE[Number(body.grade)] ?? "";
  const level = [1, 2, 3].includes(Number(body.level)) ? Number(body.level) : null;

  if (rateLimited(uid)) return reply(429, "rate_limited");

  let teacherName = email;
  try {
    const snap = await admin.db.doc(`teachers/${uid}`).get();
    const name = snap.get("name");
    if (typeof name === "string" && name.trim()) teacherName = oneLine(name, 80);
  } catch {
    /* use the email */
  }

  const copiesLine = versions ? `${copies} עותקים מכל גרסה (גרסה א׳ וגרסה ב׳) – סה״כ ${copies * 2}` : `${copies} עותקים`;
  const rows: [string, string][] = [
    ["דף עבודה", title],
    ["מספר עותקים", copiesLine],
    ["אופן הדפסה", PRINT_PREFERENCES_HE],
    ...(neededBy ? [["נדרש עד", neededBy] as [string, string]] : []),
    ...(gradeHe ? [["שכבה", `${gradeHe}${level ? ` · רמה ${level}` : ""}`] as [string, string]] : []),
    ...(note ? [["הערה מהמורה", note] as [string, string]] : []),
  ];
  const testTo = testRecipient();
  const testLine = testTo ? `מייל בדיקה מאתר התצוגה המקדימה – באתר החי הוא נשלח אל ${PRINT_EMAIL}.` : "";
  const subject = oneLine(`${testTo ? "[בדיקה] " : ""}בקשת הדפסה: ${title} – ${copies}${versions ? "×2" : ""} עותקים${neededBy ? ` – עד ${neededBy}` : ""}`, 200);
  const text = [...(testLine ? [testLine, ``] : []), `שלום,`, ``, `${teacherName} (${email}) מבקש/ת להדפיס את דף העבודה המצורף.`, ``, ...rows.map(([k, v]) => `${k}: ${v}`), ``, `תודה!`].join("\n");
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">
${testLine ? `<p style="background:#fff3cd;padding:8px 12px;border-radius:6px"><b>${escapeHtml(testLine)}</b></p>` : ""}
<p>שלום,</p>
<p><b>${escapeHtml(teacherName)}</b> (${escapeHtml(email)}) מבקש/ת להדפיס את דף העבודה המצורף.</p>
<table style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0;font-weight:bold;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
    )
    .join("")}</table>
<p>תודה!</p>
</div>`;

  const fileName = `${title.replace(/[^\p{L}\p{N} _-]+/gu, "").trim().slice(0, 60) || "worksheet"}.pdf`;

  try {
    const transport = nodemailer.createTransport({ service: "gmail", auth: { user: gmailUser, pass: gmailPass } });
    await transport.sendMail({
      from: { name: "דפי עבודה – אנגלית", address: gmailUser },
      to: testTo ?? PRINT_EMAIL,
      replyTo: email,
      subject,
      text,
      html,
      attachments: [{ filename: fileName, content: pdf, contentType: "application/pdf" }],
    });
    return reply(200, undefined, testTo !== null);
  } catch (err) {
    console.error("send-worksheet: mail failed", err);
    // Let the teacher try again.
    sentAt.set(uid, (sentAt.get(uid) ?? []).slice(0, -1));
    return reply(502, "send_failed");
  }
}
