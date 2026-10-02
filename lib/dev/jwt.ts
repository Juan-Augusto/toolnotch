/**
 * JWT (JSON Web Token) decoder and inspector utilities.
 */

export interface DecodedJwtHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

export interface DecodedJwtPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  roles?: string[];
  permissions?: string[];
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export interface JwtExpirationInfo {
  hasExp: boolean;
  expDate: Date | null;
  iatDate: Date | null;
  nbfDate: Date | null;
  isExpired: boolean;
  isValidYet: boolean;
  remainingMs: number;
  formattedExpLocal: string;
  formattedExpUtc: string;
  timeStatusLabel: string;
  statusType: 'valid' | 'expired' | 'not_yet_valid' | 'no_exp';
}

export interface DecodedJwtResult {
  isValidFormat: boolean;
  error?: string;
  header: DecodedJwtHeader | null;
  headerRaw: string;
  payload: DecodedJwtPayload | null;
  payloadRaw: string;
  signature: string;
  expiration: JwtExpirationInfo | null;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  try {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(base64, 'base64').toString('utf-8');
    }
    if (typeof atob === 'function') {
      const binaryStr = atob(base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    }
    return '';
  } catch {
    throw new Error('Falha ao decodificar Base64URL.');
  }
}

export function formatTimeDifference(ms: number, isPt = true): string {
  const absMs = Math.abs(ms);
  const seconds = Math.floor(absMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let diffStr = '';
  if (days > 0) {
    diffStr = isPt
      ? `${days} dia${days > 1 ? 's' : ''} e ${hours % 24} hora${hours % 24 > 1 ? 's' : ''}`
      : `${days} day${days > 1 ? 's' : ''} and ${hours % 24} hour${hours % 24 > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    diffStr = isPt
      ? `${hours} hora${hours > 1 ? 's' : ''} e ${minutes % 60} min`
      : `${hours} hour${hours > 1 ? 's' : ''} and ${minutes % 60} min`;
  } else if (minutes > 0) {
    diffStr = isPt
      ? `${minutes} minuto${minutes > 1 ? 's' : ''} e ${seconds % 60}s`
      : `${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds % 60}s`;
  } else {
    diffStr = isPt ? `${seconds} segundo${seconds !== 1 ? 's' : ''}` : `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  if (ms >= 0) {
    return isPt ? `Expira em ${diffStr}` : `Expires in ${diffStr}`;
  } else {
    return isPt ? `Expirado há ${diffStr}` : `Expired ${diffStr} ago`;
  }
}

export function decodeJwt(jwt: string, locale = 'pt'): DecodedJwtResult {
  const trimmed = jwt.trim();
  if (!trimmed) {
    return {
      isValidFormat: false,
      error: 'Cole um token JWT para decodificar.',
      header: null,
      headerRaw: '',
      payload: null,
      payloadRaw: '',
      signature: '',
      expiration: null,
    };
  }

  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    return {
      isValidFormat: false,
      error: `Formato inválido: um JWT deve conter 3 partes separadas por ponto (encontradas ${parts.length}).`,
      header: null,
      headerRaw: '',
      payload: null,
      payloadRaw: '',
      signature: '',
      expiration: null,
    };
  }

  let headerRaw = '';
  let payloadRaw = '';
  let header: DecodedJwtHeader | null = null;
  let payload: DecodedJwtPayload | null = null;

  try {
    headerRaw = base64UrlDecode(parts[0]);
    header = JSON.parse(headerRaw);
  } catch {
    return {
      isValidFormat: false,
      error: 'Cabeçalho (Header) inválido ou JSON malformado.',
      header: null,
      headerRaw: '',
      payload: null,
      payloadRaw: '',
      signature: parts[2] || '',
      expiration: null,
    };
  }

  try {
    payloadRaw = base64UrlDecode(parts[1]);
    payload = JSON.parse(payloadRaw);
  } catch {
    return {
      isValidFormat: false,
      error: 'Carga útil (Payload) inválida ou JSON malformado.',
      header,
      headerRaw,
      payload: null,
      payloadRaw: '',
      signature: parts[2] || '',
      expiration: null,
    };
  }

  // Parse expiration & timing claims
  let expiration: JwtExpirationInfo | null = null;
  if (payload) {
    const nowMs = Date.now();
    const hasExp = typeof payload.exp === 'number';
    const expDate = hasExp ? new Date((payload.exp as number) * 1000) : null;
    const iatDate = typeof payload.iat === 'number' ? new Date((payload.iat as number) * 1000) : null;
    const nbfDate = typeof payload.nbf === 'number' ? new Date((payload.nbf as number) * 1000) : null;

    const isExpired = expDate ? expDate.getTime() <= nowMs : false;
    const isValidYet = nbfDate ? nbfDate.getTime() <= nowMs : true;
    const remainingMs = expDate ? expDate.getTime() - nowMs : 0;

    let statusType: JwtExpirationInfo['statusType'] = 'no_exp';
    let timeStatusLabel = locale === 'pt' ? 'Sem expiração definida' : 'No expiration set';

    if (!isValidYet && nbfDate) {
      statusType = 'not_yet_valid';
      timeStatusLabel =
        locale === 'pt'
          ? `Token ainda não é válido (ativo a partir de ${nbfDate.toLocaleString(locale)})`
          : `Token not valid yet (active from ${nbfDate.toLocaleString(locale)})`;
    } else if (hasExp && expDate) {
      if (isExpired) {
        statusType = 'expired';
        timeStatusLabel = formatTimeDifference(remainingMs, locale === 'pt');
      } else {
        statusType = 'valid';
        timeStatusLabel = formatTimeDifference(remainingMs, locale === 'pt');
      }
    }

    expiration = {
      hasExp,
      expDate,
      iatDate,
      nbfDate,
      isExpired,
      isValidYet,
      remainingMs,
      formattedExpLocal: expDate ? expDate.toLocaleString(locale) : 'N/A',
      formattedExpUtc: expDate ? expDate.toUTCString() : 'N/A',
      timeStatusLabel,
      statusType,
    };
  }

  return {
    isValidFormat: true,
    header,
    headerRaw,
    payload,
    payloadRaw,
    signature: parts[2] || '',
    expiration,
  };
}

export const SAMPLE_JWTS = {
  standard:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpvw6NvIFNpbHZhIiwiZW1haWwiOiJqb2FvLnNpbHZhQGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciIsImRldmVsb3BlciJdLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTg5MzQ1NjAwMH0.sampleSignatureHashHere1234567890',
  admin:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFkbWluLWtleS0wMSJ9.eyJzdWIiOiJ1c3JfOWFmM2I0YzgiLCJuYW1lIjoiTWFyaWEgU2FudG9zIiwiZW1haWwiOiJtYXJpYUBjb21wYW55LmNvbS5iciIsInJvbGVzIjpbImFkbWluIiwiYmlsbGluZyIsIm1lbWJlciJdLCJvcmdfaWQiOiJvcmdfdG9vbG5vdGNoX3RlY2giLCJpYXQiOjE3MTAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.adminSampleSignatureXYZ987654321',
  expired:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfdGVzdF8wMDEiLCJuYW1lIjoiQ2FybG9zIEVkdWFyZG8iLCJlbWFpbCI6ImNhcmxvc0B0ZXN0LmNvbSIsImlhdCI6MTYwOTQ1OTIwMCwiZXhwIjoxNjA5NDYyODAwfQ.expiredSignatureABC123456',
};
