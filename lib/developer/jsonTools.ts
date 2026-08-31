export interface JsonSyntaxError {
  message: string;
  line?: number;
  column?: number;
  position?: number;
  snippet?: string;
}

export interface JsonStats {
  originalBytes: number;
  formattedBytes: number;
  minifiedBytes: number;
  compressionRatioPercent: number;
  keyCount: number;
  itemCount: number;
  depth: number;
  type: "object" | "array" | "primitive";
}

export interface JsonValidationResult {
  valid: boolean;
  error: JsonSyntaxError | null;
  stats?: JsonStats;
  parsed?: unknown;
}

function getByteLength(str: string): number {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(str).length;
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.byteLength(str, "utf8");
  }
  return encodeURIComponent(str).replace(/%[A-F\d]{2}/g, "U").length;
}

/**
 * Calculates key count and max depth recursively
 */
function inspectJsonObject(
  obj: unknown,
  currentDepth = 1
): { keyCount: number; itemCount: number; maxDepth: number } {
  if (obj === null || typeof obj !== "object") {
    return { keyCount: 0, itemCount: 1, maxDepth: currentDepth };
  }

  if (Array.isArray(obj)) {
    let keyCount = 0;
    let itemCount = obj.length;
    let maxDepth = currentDepth;

    for (const item of obj) {
      const sub = inspectJsonObject(item, currentDepth + 1);
      keyCount += sub.keyCount;
      if (sub.maxDepth > maxDepth) maxDepth = sub.maxDepth;
    }
    return { keyCount, itemCount, maxDepth };
  }

  const keys = Object.keys(obj as Record<string, unknown>);
  let keyCount = keys.length;
  let itemCount = 0;
  let maxDepth = currentDepth;

  for (const key of keys) {
    const val = (obj as Record<string, unknown>)[key];
    const sub = inspectJsonObject(val, currentDepth + 1);
    keyCount += sub.keyCount;
    itemCount += sub.itemCount;
    if (sub.maxDepth > maxDepth) maxDepth = sub.maxDepth;
  }

  return { keyCount, itemCount, maxDepth };
}

/**
 * Extracts line and column from JSON error message or position
 */
function extractJsonErrorDetails(input: string, error: Error): JsonSyntaxError {
  let line: number | undefined;
  let column: number | undefined;
  let position: number | undefined;

  const posMatch = error.message.match(/position\s+(\d+)/i);
  if (posMatch) {
    position = parseInt(posMatch[1], 10);
  }

  const lineColMatch = error.message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    column = parseInt(lineColMatch[2], 10);
  } else if (position !== undefined && position >= 0) {
    const textUpToPos = input.slice(0, position);
    const lines = textUpToPos.split("\n");
    line = lines.length;
    column = lines[lines.length - 1].length + 1;
  }

  let snippet: string | undefined;
  if (line !== undefined) {
    const allLines = input.split("\n");
    const errLine = allLines[line - 1] ?? "";
    snippet = errLine.trim();
  }

  return {
    message: error.message.replace(/^JSON\.parse:\s*/, ""),
    line,
    column,
    position,
    snippet,
  };
}

/**
 * Validates a JSON string and computes statistics.
 */
export function validateJson(input: string): JsonValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: { message: "O texto JSON está vazio." },
    };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const originalBytes = getByteLength(input);
    const minified = JSON.stringify(parsed);
    const minifiedBytes = getByteLength(minified);
    const formatted = JSON.stringify(parsed, null, 2);
    const formattedBytes = getByteLength(formatted);

    const { keyCount, itemCount, maxDepth } = inspectJsonObject(parsed);
    const type = Array.isArray(parsed)
      ? "array"
      : typeof parsed === "object" && parsed !== null
      ? "object"
      : "primitive";

    const compressionRatioPercent =
      originalBytes > minifiedBytes
        ? Math.round(((originalBytes - minifiedBytes) / originalBytes) * 100)
        : 0;

    return {
      valid: true,
      error: null,
      parsed,
      stats: {
        originalBytes,
        formattedBytes,
        minifiedBytes,
        compressionRatioPercent,
        keyCount,
        itemCount,
        depth: maxDepth,
        type,
      },
    };
  } catch (err) {
    const errorDetails = extractJsonErrorDetails(input, err as Error);
    return {
      valid: false,
      error: errorDetails,
    };
  }
}

/**
 * Formats JSON with customizable indentation.
 */
export function formatJson(
  input: string,
  indent: 2 | 4 | "tab" = 2
): { formatted: string; error: JsonSyntaxError | null } {
  const validation = validateJson(input);
  if (!validation.valid || validation.error) {
    return { formatted: "", error: validation.error };
  }

  const space = indent === "tab" ? "\t" : indent;
  const formatted = JSON.stringify(validation.parsed, null, space);
  return { formatted, error: null };
}

/**
 * Minifies JSON (compact single line).
 */
export function minifyJson(
  input: string
): { minified: string; error: JsonSyntaxError | null } {
  const validation = validateJson(input);
  if (!validation.valid || validation.error) {
    return { minified: "", error: validation.error };
  }

  const minified = JSON.stringify(validation.parsed);
  return { minified, error: null };
}
