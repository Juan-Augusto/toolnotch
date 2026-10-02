/**
 * CPF (Cadastro de Pessoas Físicas) generation and validation utilities.
 */

export const BRAZILIAN_STATES_BY_CPF_REGION: Record<string, { digit: number; name: string }> = {
  ALL: { digit: -1, name: "Qualquer estado / aleatório" },
  DF: { digit: 1, name: "Distrito Federal (DF)" },
  GO: { digit: 1, name: "Goiás (GO)" },
  MS: { digit: 1, name: "Mato Grosso do Sul (MS)" },
  MT: { digit: 1, name: "Mato Grosso (MT)" },
  TO: { digit: 1, name: "Tocantins (TO)" },
  AC: { digit: 2, name: "Acre (AC)" },
  AM: { digit: 2, name: "Amazonas (AM)" },
  AP: { digit: 2, name: "Amapá (AP)" },
  PA: { digit: 2, name: "Pará (PA)" },
  RO: { digit: 2, name: "Rondônia (RO)" },
  RR: { digit: 2, name: "Roraima (RR)" },
  CE: { digit: 3, name: "Ceará (CE)" },
  MA: { digit: 3, name: "Maranhão (MA)" },
  PI: { digit: 3, name: "Piauí (PI)" },
  AL: { digit: 4, name: "Alagoas (AL)" },
  PB: { digit: 4, name: "Paraíba (PB)" },
  PE: { digit: 4, name: "Pernambuco (PE)" },
  RN: { digit: 4, name: "Rio Grande do Norte (RN)" },
  BA: { digit: 5, name: "Bahia (BA)" },
  SE: { digit: 5, name: "Sergipe (SE)" },
  MG: { digit: 6, name: "Minas Gerais (MG)" },
  ES: { digit: 7, name: "Espírito Santo (ES)" },
  RJ: { digit: 7, name: "Rio de Janeiro (RJ)" },
  SP: { digit: 8, name: "São Paulo (SP)" },
  PR: { digit: 9, name: "Paraná (PR)" },
  SC: { digit: 9, name: "Santa Catarina (SC)" },
  RS: { digit: 0, name: "Rio Grande do Sul (RS)" },
};

export function formatCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function unformatCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export function validateCpf(cpf: string): { isValid: boolean; message?: string } {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) {
    return { isValid: false, message: "O CPF deve conter exatamente 11 dígitos." };
  }

  // Check for repeated sequences like 000.000.000-00, 111.111.111-11
  if (/^(\d)\1{10}$/.test(digits)) {
    return { isValid: false, message: "CPF inválido (todos os dígitos são iguais)." };
  }

  const nums = digits.split("").map(Number);

  // 1st digit check
  let sum1 = 0;
  for (let i = 0; i < 9; i++) {
    sum1 += nums[i] * (10 - i);
  }
  const rem1 = sum1 % 11;
  const d1 = rem1 < 2 ? 0 : 11 - rem1;
  if (nums[9] !== d1) {
    return { isValid: false, message: "Primeiro dígito verificador inválido." };
  }

  // 2nd digit check
  let sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum2 += nums[i] * (11 - i);
  }
  const rem2 = sum2 % 11;
  const d2 = rem2 < 2 ? 0 : 11 - rem2;
  if (nums[10] !== d2) {
    return { isValid: false, message: "Segundo dígito verificador inválido." };
  }

  return { isValid: true };
}

export interface GenerateCpfOptions {
  formatted?: boolean;
  stateCode?: string;
}

export function generateSingleCpf(options: GenerateCpfOptions = {}): string {
  const { formatted = true, stateCode = "ALL" } = options;
  const nums: number[] = [];

  for (let i = 0; i < 8; i++) {
    nums.push(Math.floor(Math.random() * 10));
  }

  // 9th digit corresponds to the state region if specified
  const stateConfig = BRAZILIAN_STATES_BY_CPF_REGION[stateCode];
  if (stateConfig && stateConfig.digit >= 0) {
    nums.push(stateConfig.digit);
  } else {
    nums.push(Math.floor(Math.random() * 10));
  }

  // 1st check digit
  let sum1 = 0;
  for (let i = 0; i < 9; i++) {
    sum1 += nums[i] * (10 - i);
  }
  const rem1 = sum1 % 11;
  const d1 = rem1 < 2 ? 0 : 11 - rem1;
  nums.push(d1);

  // 2nd check digit
  let sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum2 += nums[i] * (11 - i);
  }
  const rem2 = sum2 % 11;
  const d2 = rem2 < 2 ? 0 : 11 - rem2;
  nums.push(d2);

  const raw = nums.join("");
  return formatted ? formatCpf(raw) : raw;
}

export function generateMultipleCpfs(
  count: number,
  options: GenerateCpfOptions = {}
): string[] {
  const safeCount = Math.max(1, Math.min(count, 100));
  const results: string[] = [];
  for (let i = 0; i < safeCount; i++) {
    results.push(generateSingleCpf(options));
  }
  return results;
}
