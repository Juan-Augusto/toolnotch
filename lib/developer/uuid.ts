export type UuidVersion = "v4" | "v1" | "v7";

export interface UuidOptions {
  uppercase?: boolean;
  hyphens?: boolean;
  braces?: boolean;
}

export interface UuidInspectionResult {
  valid: boolean;
  clean: string;
  version?: number;
  variant?: string;
  timestampIso?: string;
  errorMessage?: string;
}

/**
 * Generates a crypto-safe UUID v4
 */
export function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates UUID v1 (timestamp-based)
 */
let lastV1Time = 0;
let clockSeq = Math.floor(Math.random() * 0x3fff);

export function generateUuidV1(): string {
  let now = Date.now();
  if (now <= lastV1Time) {
    now = lastV1Time + 1;
  }
  lastV1Time = now;

  // Gregoria offset from 1582-10-15 in 100ns units
  const GREGORIAN_OFFSET = BigInt("122192928000000000");
  const timestamp = BigInt(now) * BigInt(10000) + GREGORIAN_OFFSET;

  const timeLow = Number(timestamp & BigInt(0xffffffff)).toString(16).padStart(8, "0");
  const timeMid = Number((timestamp >> BigInt(32)) & BigInt(0xffff)).toString(16).padStart(4, "0");
  const timeHiAndVersion = Number(((timestamp >> BigInt(48)) & BigInt(0x0fff)) | BigInt(0x1000))
    .toString(16)
    .padStart(4, "0");

  clockSeq = (clockSeq + 1) & 0x3fff;
  const clockSeqHiAndReserved = ((clockSeq >> 8) | 0x80).toString(16).padStart(2, "0");
  const clockSeqLow = (clockSeq & 0xff).toString(16).padStart(2, "0");

  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
  ).join("");

  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeqHiAndReserved}${clockSeqLow}-${node}`;
}

/**
 * Generates UUID v7 (RFC 9562 Unix Epoch time-ordered)
 */
export function generateUuidV7(): string {
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, "0");

  const randomBytes = new Uint8Array(10);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < 10; i++) randomBytes[i] = Math.floor(Math.random() * 256);
  }

  const ver = "7";
  const randA = ((randomBytes[0] & 0x0f) << 8) | randomBytes[1];
  const randAHex = randA.toString(16).padStart(3, "0");

  const varByte = (randomBytes[2] & 0x3f) | 0x80;
  const varHex = varByte.toString(16).padStart(2, "0");
  const randB = Array.from(randomBytes.slice(3))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const timeLow = timeHex.slice(0, 8);
  const timeMid = timeHex.slice(8, 12);
  const timeHi = `${ver}${randAHex}`;
  const clockAndNode = `${varHex}${randB}`;

  return `${timeLow}-${timeMid}-${timeHi}-${clockAndNode.slice(0, 4)}-${clockAndNode.slice(4)}`;
}

/**
 * Formats a standard UUID according to options.
 */
export function formatUuid(uuid: string, options?: UuidOptions): string {
  let result = uuid.toLowerCase();

  if (options?.hyphens === false) {
    result = result.replace(/-/g, "");
  }

  if (options?.uppercase) {
    result = result.toUpperCase();
  }

  if (options?.braces) {
    result = `{${result}}`;
  }

  return result;
}

/**
 * Generates a UUID with specified version and options.
 */
export function generateUuid(version: UuidVersion = "v4", options?: UuidOptions): string {
  let base: string;
  switch (version) {
    case "v1":
      base = generateUuidV1();
      break;
    case "v7":
      base = generateUuidV7();
      break;
    case "v4":
    default:
      base = generateUuidV4();
      break;
  }
  return formatUuid(base, options);
}

/**
 * Generates bulk UUIDs.
 */
export function generateBulkUuid(
  count: number,
  version: UuidVersion = "v4",
  options?: UuidOptions
): string[] {
  const safeCount = Math.min(Math.max(1, count), 100);
  const result: string[] = [];
  for (let i = 0; i < safeCount; i++) {
    result.push(generateUuid(version, options));
  }
  return result;
}

/**
 * Inspects and validates a UUID string.
 */
export function inspectUuid(uuidInput: string): UuidInspectionResult {
  const clean = uuidInput.trim().replace(/^\{|\}$/g, "");
  const normalized =
    clean.length === 32 && !clean.includes("-")
      ? `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`
      : clean;

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-8])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/i;
  const match = normalized.match(UUID_REGEX);

  if (!match) {
    return {
      valid: false,
      clean: normalized,
      errorMessage: "Formato de UUID inválido. Esperado formato RFC 4122 (ex: 123e4567-e89b-12d3-a456-426614174000).",
    };
  }

  const version = parseInt(match[1], 10);
  const variantChar = match[2].toLowerCase();
  let variant = "RFC 4122 / DCE 1.1";
  if (["8", "9", "a", "b"].includes(variantChar)) {
    variant = "RFC 4122 / IETF Standard";
  }

  let timestampIso: string | undefined;
  if (version === 7) {
    try {
      const timeHex = normalized.replace(/-/g, "").slice(0, 12);
      const timeMs = parseInt(timeHex, 16);
      if (!isNaN(timeMs)) {
        timestampIso = new Date(timeMs).toISOString();
      }
    } catch {
      // ignore
    }
  } else if (version === 1) {
    try {
      const parts = normalized.split("-");
      const timeHigh = parts[2].slice(1);
      const timeMid = parts[1];
      const timeLow = parts[0];
      const timeHex = `${timeHigh}${timeMid}${timeLow}`;
      const time100ns = BigInt(`0x${timeHex}`);
      const GREGORIAN_OFFSET = BigInt("122192928000000000");
      const unixTimeMs = Number((time100ns - GREGORIAN_OFFSET) / BigInt(10000));
      if (!isNaN(unixTimeMs)) {
        timestampIso = new Date(unixTimeMs).toISOString();
      }
    } catch {
      // ignore
    }
  }

  return {
    valid: true,
    clean: normalized,
    version,
    variant,
    timestampIso,
  };
}
