export interface CnpjCompanyData {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  situacao_cadastral: string;
  data_situacao_cadastral?: string;
  data_inicio_atividade?: string;
  cnae_fiscal_descricao?: string;
  natureza_juridica?: string;
  capital_social?: number;
  porte?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  ddd_telefone_1?: string;
  email?: string;
  qsa?: Array<{
    nome_socio: string;
    qualificacao_socio: string;
    faixa_etaria?: string;
  }>;
}

export interface CnpjValidationResult {
  valid: boolean;
  formatted: string;
  clean: string;
  errorMessage?: string;
}

const WEIGHTS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const WEIGHTS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calculateCnpjDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, digit, idx) => acc + digit * weights[idx], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

/**
 * Formats a clean 14-digit CNPJ string into 00.000.000/0001-00
 */
export function formatCnpj(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, "").slice(0, 14);
  if (clean.length <= 2) return clean;
  if (clean.length <= 5) return `${clean.slice(0, 2)}.${clean.slice(2)}`;
  if (clean.length <= 8) return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5)}`;
  if (clean.length <= 12)
    return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8)}`;
  return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8, 12)}-${clean.slice(12, 14)}`;
}

/**
 * Strips all non-digit characters
 */
export function cleanCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}

/**
 * Generates a valid CNPJ.
 * @param formatted Whether to return formatted or clean digits.
 * @param isBranch If true, generates a random branch (0002, 0003...) instead of headquarters (0001).
 */
export function generateCnpj(formatted = true, isBranch = false): string {
  const digits: number[] = [];

  // First 8 digits are random (base registration)
  for (let i = 0; i < 8; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // Branch digits (0001 for headquarters or random for branch)
  if (!isBranch) {
    digits.push(0, 0, 0, 1);
  } else {
    const branchNum = Math.floor(Math.random() * 90) + 2; // e.g. 0002 to 0091
    const branchStr = String(branchNum).padStart(4, "0");
    branchStr.split("").forEach((c) => digits.push(Number(c)));
  }

  // First check digit
  const d1 = calculateCnpjDigit(digits, WEIGHTS_1);
  digits.push(d1);

  // Second check digit
  const d2 = calculateCnpjDigit(digits, WEIGHTS_2);
  digits.push(d2);

  const raw = digits.join("");
  return formatted ? formatCnpj(raw) : raw;
}

/**
 * Generates bulk CNPJs.
 */
export function generateBulkCnpj(
  count: number,
  formatted = true,
  isBranch = false
): string[] {
  const safeCount = Math.min(Math.max(1, count), 100);
  const result: string[] = [];
  for (let i = 0; i < safeCount; i++) {
    result.push(generateCnpj(formatted, isBranch));
  }
  return result;
}

/**
 * Validates a CNPJ string.
 */
export function validateCnpj(cnpjInput: string): CnpjValidationResult {
  const clean = cleanCnpj(cnpjInput);

  if (clean.length !== 14) {
    return {
      valid: false,
      clean,
      formatted: formatCnpj(clean),
      errorMessage: "O CNPJ deve conter exatamente 14 dígitos numéricos.",
    };
  }

  // All digits equal is invalid
  if (/^(\d)\1{13}$/.test(clean)) {
    return {
      valid: false,
      clean,
      formatted: formatCnpj(clean),
      errorMessage: "CNPJ com todos os dígitos repetidos é inválido.",
    };
  }

  const digits = clean.split("").map(Number);
  const base12 = digits.slice(0, 12);
  const d1 = calculateCnpjDigit(base12, WEIGHTS_1);
  const d2 = calculateCnpjDigit([...base12, d1], WEIGHTS_2);

  if (digits[12] !== d1 || digits[13] !== d2) {
    return {
      valid: false,
      clean,
      formatted: formatCnpj(clean),
      errorMessage: "Dígitos verificadores inválidos.",
    };
  }

  return {
    valid: true,
    clean,
    formatted: formatCnpj(clean),
  };
}

/**
 * Fetches real company data from BrasilAPI public API.
 */
export async function fetchCnpjCompanyData(
  cnpj: string
): Promise<{ data: CnpjCompanyData | null; error: string | null }> {
  const clean = cleanCnpj(cnpj);
  const validation = validateCnpj(clean);
  if (!validation.valid) {
    return { data: null, error: validation.errorMessage || "CNPJ inválido" };
  }

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (res.status === 404) {
      return {
        data: null,
        error: "CNPJ válido matematicamente, mas não encontrado na base pública da Receita Federal.",
      };
    }

    if (!res.ok) {
      return {
        data: null,
        error: `Erro na consulta da API BrasilAPI (Status ${res.status}).`,
      };
    }

    const data: CnpjCompanyData = await res.json();
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: "Falha na conexão com a API de consulta. Verifique sua rede e tente novamente.",
    };
  }
}
