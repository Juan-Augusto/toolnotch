/**
 * Cryptographic Hash and Checksum Generator utilities (MD5, SHA-1, SHA-256, SHA-512, CRC32, HMAC).
 */

// CRC-32 Lookup Table
const CRC32_TABLE = (() => {
  const table: number[] = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
})();

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

export function crc32(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? stringToUtf8Bytes(input) : input;
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ bytes[i]) & 0xff];
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0');
}

// Pure JS MD5 implementation for client-side / Node.js
export function md5(input: string | Uint8Array): string {
  const data = typeof input === 'string' ? stringToUtf8Bytes(input) : input;
  
  function rotateLeft(lValue: number, iShiftBits: number): number {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function addUnsigned(lX: number, lY: number): number {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }

  function F(x: number, y: number, z: number) { return (x & y) | ((~x) & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & (~z)); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | (~z)); }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  const nWords = (((data.length + 8) >>> 6) + 1) * 16;
  const words = new Int32Array(nWords);
  for (let i = 0; i < data.length; i++) {
    words[i >>> 2] |= (data[i] & 0xff) << ((i % 4) * 8);
  }
  words[data.length >>> 2] |= 0x80 << ((data.length % 4) * 8);
  words[nWords - 2] = (data.length * 8) & 0xffffffff;
  words[nWords - 1] = Math.floor((data.length * 8) / 0x100000000);

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < words.length; i += 16) {
    const AA = a; const BB = b; const CC = c; const DD = d;
    a = FF(a, b, c, d, words[i + 0], 7, -680876936);
    d = FF(d, a, b, c, words[i + 1], 12, -389564586);
    c = FF(c, d, a, b, words[i + 2], 17, 606105819);
    b = FF(b, c, d, a, words[i + 3], 22, -1044525330);
    a = FF(a, b, c, d, words[i + 4], 7, -176418897);
    d = FF(d, a, b, c, words[i + 5], 12, 1200080426);
    c = FF(c, d, a, b, words[i + 6], 17, -1473231341);
    b = FF(b, c, d, a, words[i + 7], 22, -45705983);
    a = FF(a, b, c, d, words[i + 8], 7, 1770035416);
    d = FF(d, a, b, c, words[i + 9], 12, -1958414417);
    c = FF(c, d, a, b, words[i + 10], 17, -42063);
    b = FF(b, c, d, a, words[i + 11], 22, -1990404162);
    a = FF(a, b, c, d, words[i + 12], 7, 1804603682);
    d = FF(d, a, b, c, words[i + 13], 12, -40341101);
    c = FF(c, d, a, b, words[i + 14], 17, -1502002290);
    b = FF(b, c, d, a, words[i + 15], 22, 1236535329);

    a = GG(a, b, c, d, words[i + 1], 5, -165796510);
    d = GG(d, a, b, c, words[i + 6], 9, -1069501632);
    c = GG(c, d, a, b, words[i + 11], 14, 643717713);
    b = GG(b, c, d, a, words[i + 0], 20, -373897302);
    a = GG(a, b, c, d, words[i + 5], 5, -701558691);
    d = GG(d, a, b, c, words[i + 10], 9, 38016083);
    c = GG(c, d, a, b, words[i + 15], 14, -660478335);
    b = GG(b, c, d, a, words[i + 4], 20, -405537848);
    a = GG(a, b, c, d, words[i + 9], 5, 568446438);
    d = GG(d, a, b, c, words[i + 14], 9, -1019803690);
    c = GG(c, d, a, b, words[i + 3], 14, -187363961);
    b = GG(b, c, d, a, words[i + 8], 20, 1163531501);
    a = GG(a, b, c, d, words[i + 13], 5, -1444681467);
    d = GG(d, a, b, c, words[i + 2], 9, -51403784);
    c = GG(c, d, a, b, words[i + 7], 14, 1735328473);
    b = GG(b, c, d, a, words[i + 12], 20, -1926607734);

    a = HH(a, b, c, d, words[i + 5], 4, -378558);
    d = HH(d, a, b, c, words[i + 8], 11, -2022574463);
    c = HH(c, d, a, b, words[i + 11], 16, 1839030562);
    b = HH(b, c, d, a, words[i + 14], 23, -35309556);
    a = HH(a, b, c, d, words[i + 1], 4, -1530992060);
    d = HH(d, a, b, c, words[i + 4], 11, 1272893353);
    c = HH(c, d, a, b, words[i + 7], 16, -155497632);
    b = HH(b, c, d, a, words[i + 10], 23, -1094730640);
    a = HH(a, b, c, d, words[i + 13], 4, 681279174);
    d = HH(d, a, b, c, words[i + 0], 11, -358537222);
    c = HH(c, d, a, b, words[i + 3], 16, -722521979);
    b = HH(b, c, d, a, words[i + 6], 23, 76029189);
    a = HH(a, b, c, d, words[i + 9], 4, -640364487);
    d = HH(d, a, b, c, words[i + 12], 11, -421815835);
    c = HH(c, d, a, b, words[i + 15], 16, 530742520);
    b = HH(b, c, d, a, words[i + 2], 23, -995338651);

    a = II(a, b, c, d, words[i + 0], 6, -198630844);
    d = II(d, a, b, c, words[i + 7], 10, 1126891415);
    c = II(c, d, a, b, words[i + 14], 15, -1416354905);
    b = II(b, c, d, a, words[i + 5], 21, -57434055);
    a = II(a, b, c, d, words[i + 12], 6, 1700485571);
    d = II(d, a, b, c, words[i + 3], 10, -1894986606);
    c = II(c, d, a, b, words[i + 10], 15, -1051523);
    b = II(b, c, d, a, words[i + 1], 21, -2054922799);
    a = II(a, b, c, d, words[i + 8], 6, 1873313359);
    d = II(d, a, b, c, words[i + 15], 10, -30611744);
    c = II(c, d, a, b, words[i + 6], 15, -1560198380);
    b = II(b, c, d, a, words[i + 13], 21, 1309151649);
    a = II(a, b, c, d, words[i + 4], 6, -145523070);
    d = II(d, a, b, c, words[i + 11], 10, -1120210379);
    c = II(c, d, a, b, words[i + 2], 15, 718787259);
    b = II(b, c, d, a, words[i + 9], 21, -343485551);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  function wordToHex(lValue: number): string {
    let result = '';
    for (let lCount = 0; lCount <= 3; lCount++) {
      const lByte = (lValue >>> (lCount * 8)) & 255;
      result += ('0' + lByte.toString(16)).slice(-2);
    }
    return result;
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

// Convert ArrayBuffer to Hex String
export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// Compute WebCrypto SHA Hashes (SHA-1, SHA-256, SHA-384, SHA-512)
export async function computeSubtleHash(
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512',
  input: string | Uint8Array | ArrayBuffer
): Promise<string> {
  const data = typeof input === 'string' ? stringToUtf8Bytes(input) : input;
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest(algorithm, data as BufferSource);
    return bufferToHex(hashBuffer);
  }

  // Fallback for Node.js environment without web crypto
  try {
    const nodeCrypto = await import('crypto');
    const hashName = algorithm.toLowerCase().replace('-', '');
    const hash = nodeCrypto.createHash(hashName);
    if (typeof input === 'string') {
      hash.update(input, 'utf-8');
    } else {
      hash.update(Buffer.from(data as Uint8Array));
    }
    return hash.digest('hex');
  } catch {
    throw new Error(`Algoritmo ${algorithm} indisponível no ambiente atual.`);
  }
}

// Compute HMAC
export async function computeHmac(
  algorithm: 'SHA-256' | 'SHA-512' | 'SHA-1',
  keyStr: string,
  messageStr: string
): Promise<string> {
  const keyBytes = stringToUtf8Bytes(keyStr);
  const messageBytes = stringToUtf8Bytes(messageStr);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes as BufferSource,
      { name: 'HMAC', hash: { name: algorithm } },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, messageBytes as BufferSource);
    return bufferToHex(signature);
  }

  try {
    const nodeCrypto = await import('crypto');
    const hashName = algorithm.toLowerCase().replace('-', '');
    const hmac = nodeCrypto.createHmac(hashName, keyStr);
    hmac.update(messageStr, 'utf-8');
    return hmac.digest('hex');
  } catch {
    throw new Error(`HMAC-${algorithm} indisponível.`);
  }
}

export interface GeneratedHashes {
  md5: string;
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
  crc32: string;
}

export async function generateAllHashes(input: string): Promise<GeneratedHashes> {
  const [sha1, sha256, sha384, sha512] = await Promise.all([
    computeSubtleHash('SHA-1', input),
    computeSubtleHash('SHA-256', input),
    computeSubtleHash('SHA-384', input),
    computeSubtleHash('SHA-512', input),
  ]);

  return {
    md5: md5(input),
    sha1,
    sha256,
    sha384,
    sha512,
    crc32: crc32(input),
  };
}
