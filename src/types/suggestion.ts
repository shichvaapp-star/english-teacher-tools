export type SuggestionType = "edit" | "bug" | "feature" | "content" | "other";

export type SuggestionStatus = "new" | "planned" | "implemented" | "dismissed";

export interface SiteSuggestion {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  schoolName: string;
  type: SuggestionType;
  message: string;
  pageUrl: string;
  pageTitle?: string;
  status: SuggestionStatus;
  createdAt: string;
  adminNotes?: string;
}
