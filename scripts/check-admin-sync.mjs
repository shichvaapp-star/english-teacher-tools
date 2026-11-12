// Fails if the admin email list in firestore.rules differs from src/config/admins.ts.
// Rules files can't import TypeScript, so the list has to live in both places.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

function emailsIn(text) {
  return [...new Set(text.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) ?? [])]
    .map((e) => e.toLowerCase())
    .sort();
}

const configSource = read("src/config/admins.ts");
const listMatch = configSource.match(/ADMIN_EMAILS[^=]*=\s*\[([\s\S]*?)\]/);
if (!listMatch) {
  console.error("check-admin-sync: could not find ADMIN_EMAILS in src/config/admins.ts");
  process.exit(1);
}
const configEmails = emailsIn(listMatch[1]);

const rulesSource = read("firestore.rules");
const rulesMatch = rulesSource.match(/request\.auth\.token\.email\s+in\s+\[([^\]]*)\]/);
if (!rulesMatch) {
  console.error("check-admin-sync: could not find the admin email list in firestore.rules");
  process.exit(1);
}
const rulesEmails = emailsIn(rulesMatch[1]);

if (JSON.stringify(configEmails) !== JSON.stringify(rulesEmails)) {
  console.error("check-admin-sync: admin emails differ.");
  console.error("  src/config/admins.ts:", configEmails.join(", "));
  console.error("  firestore.rules:     ", rulesEmails.join(", "));
  console.error("Update both files, then redeploy the rules (firebase deploy --only firestore:rules).");
  process.exit(1);
}

console.log(`check-admin-sync: OK (${configEmails.length} admin emails match)`);
