/**
 * UUID / GUID generator supporting UUID v4, v7, and v1 with formatting options.
 */

export type UuidVersion = "v4" | "v7" | "v1";

export interface GenerateUuidOptions {
  version?: UuidVersion;
  uppercase?: boolean;
  hyphens?: boolean;
  braces?: boolean;
  urn?: boolean;
  quotes?: boolean;
}

/**
 * Generate UUID v4 (RFC 4122 random)
 */
export function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback RFC4122 v4
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  // Set version 4 (0100)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set variant 1 (10xx)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToUuid(bytes);
}

/**
 * Generate UUID v7 (RFC 9562 Unix Epoch Time-based, millisecond precision)
 */
export function generateUuidV7(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  const timestamp = Date.now();

  // 48 bits of timestamp
  bytes[0] = (timestamp / 0x10000000000) & 0xff;
  bytes[1] = (timestamp / 0x100000000) & 0xff;
  bytes[2] = (timestamp / 0x1000000) & 0xff;
  bytes[3] = (timestamp / 0x10000) & 0xff;
  bytes[4] = (timestamp / 0x100) & 0xff;
  bytes[5] = timestamp & 0xff;

  // Set version 7 (0111)
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // Set variant (10xx)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToUuid(bytes);
}

/**
 * Generate UUID v1 (Timestamp and simulated MAC / clock seq)
 */
let lastV1Time = 0;
let v1ClockSeq = Math.floor(Math.random() * 0x3fff);

export function generateUuidV1(): string {
  let now = Date.now();
  if (now <= lastV1Time) {
    v1ClockSeq = (v1ClockSeq + 1) & 0x3fff;
  }
  lastV1Time = now;

  // Gregorian timestamp offset (15 Oct 1582 to 1 Jan 1970 in 100ns intervals)
  const gregorianOffset = BigInt("122192928000000000");
  const intervals100ns = BigInt(now) * BigInt(10000) + gregorianOffset;

  const timeLow = Number(intervals100ns & BigInt("0xffffffff"));
  const timeMid = Number((intervals100ns >> BigInt(32)) & BigInt("0xffff"));
  const timeHiAndVersion = Number((intervals100ns >> BigInt(48)) & BigInt("0x0fff")) | 0x1000;

  const clockSeqHi = (v1ClockSeq >> 8) | 0x80;
  const clockSeqLow = v1ClockSeq & 0xff;

  // Simulated node ID (48 bits random)
  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  ).join("");

  const hexTimeLow = timeLow.toString(16).padStart(8, "0");
  const hexTimeMid = timeMid.toString(16).padStart(4, "0");
  const hexTimeHi = timeHiAndVersion.toString(16).padStart(4, "0");
  const hexClockSeq = (clockSeqHi.toString(16).padStart(2, "0") + clockSeqLow.toString(16).padStart(2, "0"));

  return `${hexTimeLow}-${hexTimeMid}-${hexTimeHi}-${hexClockSeq}-${node}`;
}

function bytesToUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

export function formatUuid(rawUuid: string, options: GenerateUuidOptions = {}): string {
  let uuid = rawUuid;

  if (options.hyphens === false) {
    uuid = uuid.replace(/-/g, "");
  }

  if (options.uppercase) {
    uuid = uuid.toUpperCase();
  } else {
    uuid = uuid.toLowerCase();
  }

  if (options.urn) {
    uuid = `urn:uuid:${uuid}`;
  }

  if (options.braces) {
    uuid = `{${uuid}}`;
  }

  if (options.quotes) {
    uuid = `"${uuid}"`;
  }

  return uuid;
}

export function generateSingleUuid(options: GenerateUuidOptions = {}): string {
  const version = options.version || "v4";
  let raw: string;
  switch (version) {
    case "v7":
      raw = generateUuidV7();
      break;
    case "v1":
      raw = generateUuidV1();
      break;
    case "v4":
    default:
      raw = generateUuidV4();
      break;
  }
  return formatUuid(raw, options);
}

export function generateMultipleUuids(
  count: number,
  options: GenerateUuidOptions = {}
): string[] {
  const safeCount = Math.max(1, Math.min(count, 500));
  const results: string[] = [];
  for (let i = 0; i < safeCount; i++) {
    results.push(generateSingleUuid(options));
  }
  return results;
}

export function validateUuid(uuidStr: string): { isValid: boolean; version?: number } {
  const clean = uuidStr.replace(/[{}"']/g, "").trim();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-8])[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const match = clean.match(uuidRegex);
  if (!match) {
    return { isValid: false };
  }
  const version = parseInt(match[1], 10);
  return { isValid: true, version };
}
