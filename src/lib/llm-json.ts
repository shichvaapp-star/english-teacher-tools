/**
 * Helpers for reading JSON replies from AI models.
 *
 * Model output is untrusted: it may be wrapped in ``` fences, have extra text
 * around it, or be missing fields. These helpers parse it into `JsonValue`
 * (instead of `any`) so every field has to be checked before it is used.
 */

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;
export type JsonObject = { [key: string]: JsonValue | undefined };

/**
 * Pull the JSON object out of a model reply and parse it.
 * Strips ``` / ```json fences and anything before the first `{` or after the last `}`.
 * Throws if the remaining text is not valid JSON (callers already wrap this in try/catch).
 */
export function extractJsonFromText(raw: string): JsonValue {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned) as JsonValue;
}

export function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Parse a model reply and return it only if it is a JSON object; otherwise null. */
export function extractJsonObject(raw: string): JsonObject | null {
  const parsed = extractJsonFromText(raw);
  return isJsonObject(parsed) ? parsed : null;
}

/** The value as an array, or an empty array if it is not one. */
export function jsonArray(value: JsonValue | undefined): JsonValue[] {
  return Array.isArray(value) ? value : [];
}

/** The object entries of an array value, skipping anything that is not an object. */
export function jsonObjects(value: JsonValue | undefined): JsonObject[] {
  return jsonArray(value).filter(isJsonObject);
}

/** The value if it is a non-empty string, else undefined. */
export function jsonString(value: JsonValue | undefined): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

/** The value as a finite number (numeric strings like "8" are accepted), else undefined. */
export function jsonNumber(value: JsonValue | undefined): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

/** The string entries of an array value. */
export function jsonStringArray(value: JsonValue | undefined): string[] {
  return jsonArray(value).filter((item): item is string => typeof item === "string");
}

/** The value as an object, or an empty object if it is not one. */
export function jsonObject(value: JsonValue | undefined): JsonObject {
  return isJsonObject(value) ? value : {};
}

/** Readable message from anything thrown. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return String(error);
}
