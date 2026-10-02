/**
 * JSON Formatter, Minifier, and Validator helpers.
 */

export interface JsonStats {
  sizeBytes: number;
  formattedSizeBytes: number;
  linesCount: number;
  keysCount: number;
  depth: number;
  rootType: "object" | "array" | "primitive" | "null";
}

export interface JsonValidationResult {
  isValid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
}

export type IndentType = 2 | 4 | "tab";

export function formatJson(
  input: string,
  indent: IndentType = 2
): { formatted: string; error?: string } {
  if (!input.trim()) {
    return { formatted: "" };
  }

  try {
    const parsed = JSON.parse(input);
    const space = indent === "tab" ? "\t" : indent;
    const formatted = JSON.stringify(parsed, null, space);
    return { formatted };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "JSON inválido";
    return { formatted: input, error: msg };
  }
}

export function minifyJson(input: string): { minified: string; error?: string } {
  if (!input.trim()) {
    return { minified: "" };
  }

  try {
    const parsed = JSON.parse(input);
    return { minified: JSON.stringify(parsed) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "JSON inválido";
    return { minified: input, error: msg };
  }
}

export function validateJson(input: string): JsonValidationResult {
  if (!input.trim()) {
    return { isValid: true };
  }

  try {
    JSON.parse(input);
    return { isValid: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro de sintaxe JSON";
    let line: number | undefined;
    let column: number | undefined;

    // Extract line/column if standard engine error matches "at position X"
    const posMatch = message.match(/position (\d+)/);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = input.slice(0, pos).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    // Node / Chrome V8 "line X column Y" format
    const lineColMatch = message.match(/line (\d+) column (\d+)/);
    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
    }

    return {
      isValid: false,
      error: {
        message,
        line,
        column,
      },
    };
  }
}

function getByteLength(str: string): number {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(str).length;
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.byteLength(str, "utf8");
  }
  return str.length;
}

export function calculateJsonStats(input: string): JsonStats | null {
  if (!input.trim()) return null;

  try {
    const parsed = JSON.parse(input);
    const sizeBytes = getByteLength(input);
    const formatted = JSON.stringify(parsed, null, 2);
    const formattedSizeBytes = getByteLength(formatted);
    const linesCount = formatted.split("\n").length;

    let keysCount = 0;
    let maxDepth = 0;

    function traverse(node: unknown, currentDepth: number) {
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
      }

      if (node && typeof node === "object") {
        if (Array.isArray(node)) {
          for (const item of node) {
            traverse(item, currentDepth + 1);
          }
        } else {
          const keys = Object.keys(node as Record<string, unknown>);
          keysCount += keys.length;
          for (const key of keys) {
            traverse((node as Record<string, unknown>)[key], currentDepth + 1);
          }
        }
      }
    }

    traverse(parsed, 1);

    let rootType: JsonStats["rootType"] = "primitive";
    if (parsed === null) {
      rootType = "null";
    } else if (Array.isArray(parsed)) {
      rootType = "array";
    } else if (typeof parsed === "object") {
      rootType = "object";
    }

    return {
      sizeBytes,
      formattedSizeBytes,
      linesCount,
      keysCount,
      depth: maxDepth,
      rootType,
    };
  } catch {
    return null;
  }
}

export function tryFixJson(input: string): string {
  let cleaned = input.trim();
  // Replace single quotes with double quotes
  cleaned = cleaned.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');
  // Remove trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
  // Wrap unquoted keys
  cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":');
  return cleaned;
}
