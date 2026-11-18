// Lets the content validators import the TypeScript data directly (Node strips
// types); "@/..." and extensionless imports are resolved by the hook below.
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

registerHooks({
  resolve(specifier, context, nextResolve) {
    let target = null;
    if (specifier.startsWith("@/")) target = path.join(root, "src", specifier.slice(2));
    else if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) {
      target = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }
    if (target) {
      for (const cand of [target, `${target}.ts`, `${target}.tsx`, path.join(target, "index.ts")]) {
        if (existsSync(cand) && !cand.endsWith(path.sep)) {
          try {
            if (path.extname(cand)) return nextResolve(pathToFileURL(cand).href, context);
          } catch {
            /* try next */
          }
        }
      }
    }
    return nextResolve(specifier, context);
  },
});
