// One-off tidy-up: rewrites class names saved in old spellings ("ח'2", "2ח",
// "ח 2") to the canonical one ("ח׳2") in Firestore.
//
// The app already treats all spellings as the same class, so this is cosmetic
// and optional. It touches PRODUCTION data, so:
//   node --no-warnings scripts/normalize-classes.mjs            → dry run (reads only, prints changes)
//   node --no-warnings scripts/normalize-classes.mjs --write    → applies the changes
//
// Needs the service account JSON, either in FIREBASE_SERVICE_ACCOUNT_KEY or as a
// file path: --key=/path/to/service-account.json
// Reads one doc per student, submission and assignment (a few hundred reads).
import "./ts-loader.mjs";
import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const { canonicalClass } = await import("../src/lib/class-names.ts");

const write = process.argv.includes("--write");
const keyArg = process.argv.find((a) => a.startsWith("--key="));
const rawKey = keyArg ? readFileSync(keyArg.slice(6), "utf8") : process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!rawKey) {
  console.error("Missing service account: set FIREBASE_SERVICE_ACCOUNT_KEY or pass --key=/path/to/key.json");
  process.exit(1);
}
const sa = JSON.parse(rawKey);
const app = initializeApp({
  credential: cert({
    projectId: sa.project_id,
    clientEmail: sa.client_email,
    privateKey: sa.private_key.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);

// collection → class field. Students also keep classGrade/classNumber in sync.
const TARGETS = [
  { collection: "students", field: "fullClass" },
  { collection: "submissions", field: "studentClass" },
  { collection: "assignments", field: "targetClass" },
];

let totalChanges = 0;
for (const { collection, field } of TARGETS) {
  const snap = await db.collection(collection).select(field).get();
  const changes = [];
  const unparseable = new Map();
  for (const doc of snap.docs) {
    const value = doc.get(field);
    if (typeof value !== "string" || !value || value === "all") continue;
    const canon = canonicalClass(value);
    if (canon === null) unparseable.set(value, (unparseable.get(value) ?? 0) + 1);
    else if (canon !== value) changes.push({ ref: doc.ref, from: value, to: canon });
  }

  console.log(`\n${collection}.${field}: ${snap.size} docs, ${changes.length} to fix`);
  const summary = new Map();
  for (const c of changes) {
    const k = `"${c.from}" → "${c.to}"`;
    summary.set(k, (summary.get(k) ?? 0) + 1);
  }
  for (const [k, n] of summary) console.log(`  ${k}  ×${n}`);
  if (unparseable.size) {
    console.log("  Not a class (left as-is):");
    for (const [v, n] of unparseable) console.log(`    "${v}"  ×${n}`);
  }

  if (write && changes.length) {
    for (let i = 0; i < changes.length; i += 400) {
      const batch = db.batch();
      for (const c of changes.slice(i, i + 400)) {
        const update = { [field]: c.to };
        if (collection === "students") {
          update.classGrade = c.to[0];
          update.classNumber = Number(c.to.slice(2));
        }
        batch.update(c.ref, update);
      }
      await batch.commit();
    }
    console.log(`  ✓ updated ${changes.length}`);
  }
  totalChanges += changes.length;
}

console.log(write ? `\nDone: ${totalChanges} docs updated.` : `\nDry run: ${totalChanges} docs would change. Re-run with --write to apply.`);
