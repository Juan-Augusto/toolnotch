/**
 * Base64 Encoder / Decoder and Converter utilities (Text, Hex, URL-Safe, Data URL).
 */

export interface Base64Stats {
  inputChars: number;
  inputBytes: number;
  outputChars: number;
  outputBytes: number;
  ratio: number;
}

function stringToUtf8Bytes(str: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str);
  }
  if (typeof Buffer !== 'undefined') {
    return Uint8Array.from(Buffer.from(str, 'utf-8'));
  }
  const utf8: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    } else {
      i++;
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
  }
  return new Uint8Array(utf8);
}

function utf8BytesToString(bytes: Uint8Array): string {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder('utf-8').decode(bytes);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('utf-8');
  }
  return String.fromCharCode.apply(null, Array.from(bytes));
}

export function encodeBase64(input: string, urlSafe = false): string {
  if (!input) return '';
  let base64 = '';
  try {
    if (typeof Buffer !== 'undefined') {
      base64 = Buffer.from(input, 'utf-8').toString('base64');
    } else if (typeof btoa === 'function') {
      const bytes = stringToUtf8Bytes(input);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      base64 = btoa(binary);
    }
  } catch (err) {
    throw new Error('Erro ao codificar para Base64: ' + (err as Error).message);
  }

  if (urlSafe) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return base64;
}

export function decodeBase64(input: string): string {
  if (!input) return '';
  let base64 = input.trim();
  // Normalize URL-safe characters
  base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  try {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(base64, 'base64').toString('utf-8');
    } else if (typeof atob === 'function') {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return utf8BytesToString(bytes);
    }
    return '';
  } catch {
    throw new Error('String Base64 inválida ou corrompida.');
  }
}

export function hexToBase64(hex: string): string {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
  if (cleanHex.length % 2 !== 0) {
    throw new Error('Hexadecimal incompleto (deve conter um número par de dígitos).');
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(cleanHex, 'hex').toString('base64');
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToHex(base64: string): string {
  let clean = base64.trim().replace(/-/g, '+').replace(/_/g, '/');
  while (clean.length % 4 !== 0) {
    clean += '=';
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(clean, 'base64').toString('hex');
  }
  const binary = atob(clean);
  const hexArr: string[] = [];
  for (let i = 0; i < binary.length; i++) {
    const byte = binary.charCodeAt(i).toString(16).padStart(2, '0');
    hexArr.push(byte);
  }
  return hexArr.join('');
}

export function calculateBase64Stats(input: string, output: string): Base64Stats {
  const inputBytes = stringToUtf8Bytes(input).length;
  const outputBytes = stringToUtf8Bytes(output).length;
  const ratio = inputBytes > 0 ? Number(((outputBytes / inputBytes) * 100).toFixed(1)) : 100;

  return {
    inputChars: input.length,
    inputBytes,
    outputChars: output.length,
    outputBytes,
    ratio,
  };
}
