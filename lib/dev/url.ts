/**
 * URL and Query String Parser, Parameter Builder and Encoder utilities.
 */

export interface QueryParamItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface ParsedUrlDetails {
  isValid: boolean;
  error?: string;
  original: string;
  protocol: string;
  origin: string;
  username: string;
  password: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: QueryParamItem[];
  cleanUrlWithoutTracking: string;
}

const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'fbclid',
  'msclkid',
  'dclid',
  'zanpid',
  'mc_eid',
  '_hsenc',
  '_hsmi',
  'yclid',
]);

export function parseUrl(rawUrl: string): ParsedUrlDetails {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Insira uma URL para analisar.',
      original: '',
      protocol: '',
      origin: '',
      username: '',
      password: '',
      host: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      params: [],
      cleanUrlWithoutTracking: '',
    };
  }

  // Auto-prepend https:// if protocol is missing to parse domain-based urls
  let urlToParse = trimmed;
  if (!/^https?:\/\//i.test(urlToParse) && !/^wss?:\/\//i.test(urlToParse) && !/^ftp:\/\//i.test(urlToParse)) {
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(urlToParse)) {
      urlToParse = `https://${urlToParse}`;
    }
  }

  try {
    const parsed = new URL(urlToParse);
    const params: QueryParamItem[] = [];

    parsed.searchParams.forEach((value, key) => {
      params.push({
        id: Math.random().toString(36).substring(2, 9),
        key,
        value,
        enabled: true,
      });
    });

    // Build URL without tracking parameters
    const cleanParsed = new URL(urlToParse);
    TRACKING_PARAMS.forEach((trackParam) => {
      cleanParsed.searchParams.delete(trackParam);
    });

    return {
      isValid: true,
      original: trimmed,
      protocol: parsed.protocol,
      origin: parsed.origin,
      username: parsed.username,
      password: parsed.password,
      host: parsed.host,
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? '443 (default)' : parsed.protocol === 'http:' ? '80 (default)' : ''),
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      params,
      cleanUrlWithoutTracking: cleanParsed.toString(),
    };
  } catch {
    return {
      isValid: false,
      error: 'Formato de URL inválido. Verifique o protocolo e a sintaxe (ex: https://exemplo.com/path?query=1).',
      original: trimmed,
      protocol: '',
      origin: '',
      username: '',
      password: '',
      host: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      params: [],
      cleanUrlWithoutTracking: '',
    };
  }
}

export function rebuildUrlFromParts(
  baseUrl: string,
  params: QueryParamItem[],
  hash = ''
): string {
  try {
    const url = new URL(baseUrl);
    const newSearchParams = new URLSearchParams();

    params.forEach((p) => {
      if (p.enabled && p.key.trim().length > 0) {
        newSearchParams.append(p.key.trim(), p.value);
      }
    });

    url.search = newSearchParams.toString();
    if (hash) {
      url.hash = hash.startsWith('#') ? hash : `#${hash}`;
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export const SAMPLE_URLS = {
  ecommerce:
    'https://loja.exemplo.com.br/busca?categoria=eletronicos&marca=Sony&preco_min=100&preco_max=2500&ordem=menor_preco&pagina=1&disponivel=true#produtos',
  oauth:
    'https://auth.provider.com/oauth/v2/authorize?client_id=app_892348a8f1&redirect_uri=https%3A%2F%2Fapp.toolnotch.com%2Fcallback&response_type=code&scope=openid+profile+email&state=xyz987secureState',
  tracking:
    'https://meusite.com/artigos/guia-dev?utm_source=newsletter&utm_medium=email&utm_campaign=black_friday_2026&utm_content=cta_banner&fbclid=IwAR2vX8qM8s1r9_fakeFbclidToken#comentarios',
};
