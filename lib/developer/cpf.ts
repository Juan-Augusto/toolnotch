export interface CpfStateInfo {
  code: number;
  label: string;
  states: string[];
}

export const CPF_REGIONS: CpfStateInfo[] = [
  { code: 1, label: "1ª Região Fiscal", states: ["DF", "GO", "MS", "MT", "TO"] },
  { code: 2, label: "2ª Região Fiscal", states: ["AC", "AM", "AP", "PA", "RO", "RR"] },
  { code: 3, label: "3ª Região Fiscal", states: ["CE", "MA", "PI"] },
  { code: 4, label: "4ª Região Fiscal", states: ["AL", "PB", "PE", "RN"] },
  { code: 5, label: "5ª Região Fiscal", states: ["BA", "SE"] },
  { code: 6, label: "6ª Região Fiscal", states: ["MG"] },
  { code: 7, label: "7ª Região Fiscal", states: ["ES", "RJ"] },
  { code: 8, label: "8ª Região Fiscal", states: ["SP"] },
  { code: 9, label: "9ª Região Fiscal", states: ["PR", "SC"] },
  { code: 0, label: "10ª Região Fiscal", states: ["RS"] },
];

export interface CpfValidationResult {
  valid: boolean;
  formatted: string;
  clean: string;
  region?: CpfStateInfo;
  errorMessage?: string;
}

/**
 * Calculates the CPF verification digit
 */
function calculateCpfDigit(digits: number[]): number {
  const factor = digits.length + 1;
  const sum = digits.reduce((acc, digit, idx) => acc + digit * (factor - idx), 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

/**
 * Formats a clean 11-digit CPF string into 000.000.000-00
 */
export function formatCpf(cpf: string): string {
  const clean = cpf.replace(/\D/g, "").slice(0, 11);
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)}.${clean.slice(3)}`;
  if (clean.length <= 9) return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`;
  return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9, 11)}`;
}

/**
 * Strips all non-digit characters
 */
export function cleanCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/**
 * Generates a valid CPF.
 * @param formatted Whether to return formatted (000.000.000-00) or clean digits.
 * @param regionCode Optional fiscal region code (0-9) for the 9th digit.
 */
export function generateCpf(formatted = true, regionCode?: number): string {
  const digits: number[] = [];

  // First 8 digits are random
  for (let i = 0; i < 8; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // 9th digit: fiscal region
  if (regionCode !== undefined && regionCode >= 0 && regionCode <= 9) {
    digits.push(regionCode);
  } else {
    digits.push(Math.floor(Math.random() * 10));
  }

  // Calculate 10th digit
  const d10 = calculateCpfDigit(digits);
  digits.push(d10);

  // Calculate 11th digit
  const d11 = calculateCpfDigit(digits);
  digits.push(d11);

  const raw = digits.join("");
  return formatted ? formatCpf(raw) : raw;
}

/**
 * Generates bulk CPFs.
 */
export function generateBulkCpf(
  count: number,
  formatted = true,
  regionCode?: number
): string[] {
  const safeCount = Math.min(Math.max(1, count), 100);
  const result: string[] = [];
  for (let i = 0; i < safeCount; i++) {
    result.push(generateCpf(formatted, regionCode));
  }
  return result;
}

/**
 * Validates a CPF string.
 */
export function validateCpf(cpfInput: string): CpfValidationResult {
  const clean = cleanCpf(cpfInput);

  if (clean.length !== 11) {
    return {
      valid: false,
      clean,
      formatted: formatCpf(clean),
      errorMessage: "O CPF deve conter exatamente 11 dígitos numéricos.",
    };
  }

  // All digits equal is invalid in Brazil (e.g. 111.111.111-11)
  if (/^(\d)\1{10}$/.test(clean)) {
    return {
      valid: false,
      clean,
      formatted: formatCpf(clean),
      errorMessage: "CPF com todos os dígitos repetidos é inválido.",
    };
  }

  const digits = clean.split("").map(Number);
  const first9 = digits.slice(0, 9);
  const d10 = calculateCpfDigit(first9);
  const d11 = calculateCpfDigit([...first9, d10]);

  if (digits[9] !== d10 || digits[10] !== d11) {
    return {
      valid: false,
      clean,
      formatted: formatCpf(clean),
      errorMessage: "Dígitos verificadores inválidos.",
    };
  }

  const originCode = digits[8];
  const region = CPF_REGIONS.find((r) => r.code === originCode);

  return {
    valid: true,
    clean,
    formatted: formatCpf(clean),
    region,
  };
}
