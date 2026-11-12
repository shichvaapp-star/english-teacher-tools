/**
 * Built-in super-admin accounts.
 *
 * This is the single source of truth for the app. These accounts always get
 * admin access, even if the `isAdmin` checkbox on their teacher profile is
 * unticked, so nobody can lock themselves out. Any other teacher becomes an
 * admin by having `isAdmin: true` ticked in the teacher dashboard.
 *
 * `firestore.rules` cannot import this file, so it keeps its own copy of the
 * list inside `isAdmin()`. `npm run check:admins` (part of `npm run lint`)
 * fails if the two lists drift apart.
 */
export const ADMIN_EMAILS: readonly string[] = [
  "niroari@gmail.com",
  "shichva.app@gmail.com",
];

export function isBuiltInAdminEmail(email: string | null | undefined): boolean {
  const normalized = (email ?? "").trim().toLowerCase();
  if (!normalized) return false;
  return ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized);
}
