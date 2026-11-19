/** Body of POST /api/send-worksheet (Authorization: Bearer <Firebase ID token>). */
export interface SendWorksheetRequest {
  pdfBase64: string;
  title: string;
  copies: number;
  /** YYYY-MM-DD, optional. */
  neededBy?: string;
  note?: string;
  /** Version A + B attached (copies are per version). */
  versions: boolean;
  grade: number;
  level: number;
}

export type SendWorksheetReason =
  | "not_signed_in"
  | "not_teacher"
  | "email_not_configured"
  | "server_not_configured"
  | "bad_request"
  | "too_large"
  | "rate_limited"
  | "send_failed";

export interface SendWorksheetResponse {
  success: boolean;
  reason?: SendWorksheetReason;
  /** Sent to the preview test address instead of the print technician. */
  testMode?: boolean;
}
