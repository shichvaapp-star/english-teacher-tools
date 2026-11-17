// Server-only Firebase Admin SDK access. Never import this from a Client Component:
// it reads the service account key, which must stay on the server.
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

interface ServiceAccountJson {
  project_id: string;
  client_email: string;
  private_key: string;
}

let cached: { app: App; auth: Auth; db: Firestore } | null = null;

/**
 * Returns the Admin SDK handles, or null when FIREBASE_SERVICE_ACCOUNT_KEY is missing.
 * The env var holds the service account JSON downloaded from the Firebase console
 * (Project settings → Service accounts → Generate new private key), pasted as-is.
 */
export function getFirebaseAdmin(): { app: App; auth: Auth; db: Firestore } | null {
  if (cached) return cached;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;

  let parsed: ServiceAccountJson;
  try {
    parsed = JSON.parse(raw) as ServiceAccountJson;
  } catch {
    console.error("FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON.");
    return null;
  }

  const app =
    getApps().length > 0
      ? getApp()
      : initializeApp({
          credential: cert({
            projectId: parsed.project_id,
            clientEmail: parsed.client_email,
            privateKey: parsed.private_key.replace(/\\n/g, "\n"),
          }),
        });

  cached = { app, auth: getAuth(app), db: getFirestore(app) };
  return cached;
}
