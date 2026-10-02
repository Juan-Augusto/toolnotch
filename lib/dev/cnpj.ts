/**
 * CNPJ (Cadastro Nacional da Pessoa Jurídica) generation, validation,
 * and realistic company mock / live API data helpers.
 */

export interface CompanyDetails {
  cnpj: string;
  cnpjUnformatted: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  dataAbertura: string;
  situacaoCadastral: string;
  naturezaJuridica: string;
  regimeTributario: string;
  capitalSocial: string;
  cnaePrincipal: {
    codigo: string;
    descricao: string;
  };
  telefone: string;
  email: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
}

export interface CompanyDetailsWithQsa extends CompanyDetails {
  qsa?: { nome: string; qualificacao: string }[];
}

export const UF_CNPJ_LIST = [
  { uf: "ALL", name: "Todos os Estados" },
  { uf: "SP", name: "São Paulo (SP)" },
  { uf: "RJ", name: "Rio de Janeiro (RJ)" },
  { uf: "MG", name: "Minas Gerais (MG)" },
  { uf: "RS", name: "Rio Grande do Sul (RS)" },
  { uf: "PR", name: "Paraná (PR)" },
  { uf: "SC", name: "Santa Catarina (SC)" },
  { uf: "BA", name: "Bahia (BA)" },
  { uf: "PE", name: "Pernambuco (PE)" },
  { uf: "CE", name: "Ceará (CE)" },
  { uf: "DF", name: "Distrito Federal (DF)" },
  { uf: "GO", name: "Goiás (GO)" },
  { uf: "ES", name: "Espírito Santo (ES)" },
  { uf: "AM", name: "Amazonas (AM)" },
  { uf: "PA", name: "Pará (PA)" },
  { uf: "MT", name: "Mato Grosso (MT)" },
  { uf: "MS", name: "Mato Grosso do Sul (MS)" },
];

export const REAL_SEED_CNPJS: Record<string, string[]> = {
  SP: [
    "18.236.120/0001-58", // Nubank (Nu Pagamentos)
    "60.746.948/0001-12", // Bradesco
    "60.701.190/0001-04", // Itaú Unibanco
    "06.990.590/0001-23", // Google Brasil
    "47.960.950/0001-21", // Magazine Luiza
    "02.362.677/0001-55", // iFood
    "09.305.994/0001-29", // Azul Linhas Aéreas
    "61.532.644/0001-15", // Embraer
    "03.007.331/0001-41", // Mercado Livre Brasil
    "61.088.894/0001-08", // Ambev
    "08.561.701/0001-01", // 99 Tecnologia
    "07.272.636/0001-89", // Uber do Brasil
    "08.343.492/0001-20", // QuintoAndar
    "14.380.200/0001-21", // Creditas
    "01.438.784/0001-05", // Totvs
  ],
  RJ: [
    "33.000.167/0001-01", // Petrobras
    "33.592.510/0001-54", // Vale S.A.
    "33.041.260/0065-28", // Globo Comunicação
    "33.050.196/0001-88", // Ipiranga
    "02.429.144/0001-93", // Stone Pagamentos
    "33.000.118/0001-79", // Furnas Centrais Elétricas
    "02.558.157/0001-62", // TIM Brasil
  ],
  MG: [
    "17.155.730/0001-64", // Banco Inter
    "17.262.213/0001-94", // Localiza Rent a Car
    "16.624.611/0001-40", // Hotmart
    "19.877.371/0001-72", // MRV Engenharia
    "17.155.342/0001-80", // Cemig
    "17.361.642/0001-28", // Usiminas
  ],
  RS: [
    "92.693.019/0001-89", // Gerdau S.A.
    "92.754.738/0001-62", // Lojas Renner
    "92.798.735/0001-00", // Marcopolo
    "88.610.324/0001-92", // Taurus Armas
    "91.987.743/0001-81", // Lojas Colombo
  ],
  PR: [
    "76.483.817/0001-20", // O Boticário
    "04.884.082/0001-35", // Ebanx
    "04.368.865/0001-00", // MadeiraMadeira
    "76.535.764/0001-43", // Copel
    "76.492.255/0001-20", // Rumo Logística
  ],
  SC: [
    "84.429.695/0001-11", // WEG Equipamentos
    "82.637.109/0001-07", // Havan
    "82.640.558/0001-04", // Schulz Compressores
    "83.874.032/0001-80", // Tupy S.A.
    "08.887.892/0001-59", // RD Station
  ],
  DF: [
    "00.000.000/0001-91", // Banco do Brasil
    "00.360.305/0001-04", // Caixa Econômica Federal
    "34.028.316/0001-03", // Correios (ECT)
    "00.038.166/0001-05", // Banco Central do Brasil
    "00.512.777/0001-35", // Eletronorte
  ],
  BA: [
    "15.144.017/0001-90", // Suzano Papel e Celulose
    "15.139.629/0001-99", // Braskem
    "15.126.437/0001-43", // Coelba
  ],
  PE: [
    "10.572.071/0001-00", // Baterias Moura
    "10.500.884/0001-05", // Celpe Neoenergia
  ],
  CE: [
    "07.293.058/0001-60", // M. Dias Branco
    "07.654.314/0001-70", // Farmácias Pague Menos
    "06.977.747/0001-00", // Arce
  ],
  GO: [
    "02.916.265/0001-60", // JBS S.A.
    "01.052.830/0001-84", // Hypera Pharma
    "03.220.708/0001-21", // Caoa Montadora
  ],
};

const COMPANY_PREFIXES = [
  "Tech", "Nexus", "Global", "Alpha", "Prime", "Apex", "Vanguard", "Omni",
  "Meta", "Infinity", "Horizonte", "Nova Era", "Soluções", "Brasil", "Atlas",
  "Delta", "Titan", "Lúmina", "Quantum", "Solaris", "Conecta", "Valença", "Serra",
];

const COMPANY_SECTORS = [
  { term: "Tecnologia e Softwares", fantasia: "Tech", cnaeCode: "6201-5/01", cnaeDesc: "Desenvolvimento de programas de computador sob encomenda" },
  { term: "Logística e Transportes", fantasia: "Log", cnaeCode: "4930-2/02", cnaeDesc: "Transporte rodoviário de carga, intermunicipal e interestadual" },
  { term: "Engenharia e Construções", fantasia: "Engenharia", cnaeCode: "4120-4/00", cnaeDesc: "Construção de edifícios" },
  { term: "Comércio e Distribuição", fantasia: "Distribuidora", cnaeCode: "4693-1/00", cnaeDesc: "Comércio atacadista de mercadorias em geral" },
  { term: "Consultoria e Gestão", fantasia: "Consulting", cnaeCode: "7020-4/00", cnaeDesc: "Atividades de consultoria em gestão empresarial" },
  { term: "Alimentos e Bebidas", fantasia: "Foods", cnaeCode: "1099-6/99", cnaeDesc: "Fabricação de outros produtos alimentícios não especificados" },
  { term: "Saúde e Biotecnologia", fantasia: "Health", cnaeCode: "8630-5/03", cnaeDesc: "Atividade médica ambulatorial restrita a consultas" },
  { term: "Serviços Financeiros & Pagamentos", fantasia: "Pay", cnaeCode: "6619-3/02", cnaeDesc: "Correspondentes de instituições financeiras" },
  { term: "Marketing Digital & Mídia", fantasia: "Marketing", cnaeCode: "7311-4/00", cnaeDesc: "Agências de publicidade" },
  { term: "Energia & Renováveis", fantasia: "Energy", cnaeCode: "3511-5/01", cnaeDesc: "Geração de energia elétrica" },
];

const COMPANY_TYPES = ["Ltda", "S.A.", "Eireli", "ME"];

const REGIMES = ["Simples Nacional", "Lucro Presumido", "Lucro Real"];

const NATUREZAS_JURIDICAS = [
  "206-2 - Sociedade Empresária Limitada",
  "205-4 - Sociedade Anônima Fechada",
  "204-6 - Sociedade Anônima Aberta",
  "213-5 - Empresário Individual",
  "230-5 - Empresa Individual de Responsabilidade Limitada",
];

const SAMPLE_CITIES = [
  { cidade: "São Paulo", uf: "SP", ddd: "11", cepBase: "01310-000", bairro: "Bela Vista", logradouro: "Avenida Paulista" },
  { cidade: "Campinas", uf: "SP", ddd: "19", cepBase: "13010-000", bairro: "Centro", logradouro: "Rua Barão de Jaguara" },
  { cidade: "Rio de Janeiro", uf: "RJ", ddd: "21", cepBase: "20040-002", bairro: "Centro", logradouro: "Avenida Rio Branco" },
  { cidade: "Belo Horizonte", uf: "MG", ddd: "31", cepBase: "30130-000", bairro: "Savassi", logradouro: "Avenida Getúlio Vargas" },
  { cidade: "Curitiba", uf: "PR", ddd: "41", cepBase: "80020-000", bairro: "Batel", logradouro: "Avenida Sete de Setembro" },
  { cidade: "Porto Alegre", uf: "RS", ddd: "51", cepBase: "90010-000", bairro: "Moinhos de Vento", logradouro: "Rua Padre Chagas" },
  { cidade: "Florianópolis", uf: "SC", ddd: "48", cepBase: "88015-000", bairro: "Centro", logradouro: "Rua Felipe Schmidt" },
  { cidade: "Brasília", uf: "DF", ddd: "61", cepBase: "70070-000", bairro: "Asa Sul", logradouro: "Setor Comercial Sul (SCS)" },
  { cidade: "Salvador", uf: "BA", ddd: "71", cepBase: "40020-000", bairro: "Comércio", logradouro: "Avenida da França" },
  { cidade: "Recife", uf: "PE", ddd: "81", cepBase: "50030-000", bairro: "Recife Antigo", logradouro: "Rua do Bom Jesus" },
  { cidade: "Fortaleza", uf: "CE", ddd: "85", cepBase: "60160-000", bairro: "Aldeota", logradouro: "Avenida Santos Dumont" },
];

export function formatCnpj(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length !== 14) return cnpj;
  return digits.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
}

export function unformatCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}

export function validateCnpj(cnpj: string): { isValid: boolean; message?: string } {
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length !== 14) {
    return { isValid: false, message: "O CNPJ deve conter exatamente 14 dígitos." };
  }

  // Check for repeated sequences
  if (/^(\d)\1{13}$/.test(digits)) {
    return { isValid: false, message: "CNPJ inválido (todos os dígitos são iguais)." };
  }

  const nums = digits.split("").map(Number);

  // 1st digit check
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    sum1 += nums[i] * weights1[i];
  }
  const rem1 = sum1 % 11;
  const d1 = rem1 < 2 ? 0 : 11 - rem1;
  if (nums[12] !== d1) {
    return { isValid: false, message: "Primeiro dígito verificador inválido." };
  }

  // 2nd digit check
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum2 = 0;
  for (let i = 0; i < 13; i++) {
    sum2 += nums[i] * weights2[i];
  }
  const rem2 = sum2 % 11;
  const d2 = rem2 < 2 ? 0 : 11 - rem2;
  if (nums[13] !== d2) {
    return { isValid: false, message: "Segundo dígito verificador inválido." };
  }

  return { isValid: true };
}

export interface GenerateCnpjOptions {
  formatted?: boolean;
  branchNumber?: number;
  uf?: string;
}

export function generateSingleCnpj(options: GenerateCnpjOptions = {}): string {
  const { formatted = true, branchNumber = 1 } = options;
  const nums: number[] = [];

  // Generate first 8 base digits
  for (let i = 0; i < 8; i++) {
    nums.push(Math.floor(Math.random() * 10));
  }

  // Branch 4 digits (e.g. 0001)
  const branchDigits = String(branchNumber).padStart(4, "0").slice(-4).split("").map(Number);
  nums.push(...branchDigits);

  // Calculate 1st digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    sum1 += nums[i] * weights1[i];
  }
  const rem1 = sum1 % 11;
  const d1 = rem1 < 2 ? 0 : 11 - rem1;
  nums.push(d1);

  // Calculate 2nd digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum2 = 0;
  for (let i = 0; i < 13; i++) {
    sum2 += nums[i] * weights2[i];
  }
  const rem2 = sum2 % 11;
  const d2 = rem2 < 2 ? 0 : 11 - rem2;
  nums.push(d2);

  const raw = nums.join("");
  return formatted ? formatCnpj(raw) : raw;
}

export function generateMultipleCnpjs(
  count: number,
  options: GenerateCnpjOptions = {}
): string[] {
  const safeCount = Math.max(1, Math.min(count, 100));
  const results: string[] = [];
  for (let i = 0; i < safeCount; i++) {
    results.push(generateSingleCnpj(options));
  }
  return results;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCompanyDetails(options: GenerateCnpjOptions = {}): CompanyDetailsWithQsa {
  const formattedCnpj = generateSingleCnpj({ ...options, formatted: true });
  const rawCnpj = unformatCnpj(formattedCnpj);

  const prefix = randomItem(COMPANY_PREFIXES);
  const sector = randomItem(COMPANY_SECTORS);
  const companyType = randomItem(COMPANY_TYPES);
  
  let matchingCities = SAMPLE_CITIES;
  if (options.uf && options.uf !== "ALL") {
    const filtered = SAMPLE_CITIES.filter((c) => c.uf === options.uf);
    if (filtered.length > 0) matchingCities = filtered;
  }
  const cityInfo = randomItem(matchingCities);

  const razaoSocial = `${prefix} ${sector.term} ${companyType}`;
  const nomeFantasia = `${prefix} ${sector.fantasia}`;

  const year = 1995 + Math.floor(Math.random() * 30);
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
  const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");
  const dataAbertura = `${day}/${month}/${year}`;

  const capitalAmount = (Math.floor(Math.random() * 198) + 2) * 10000;
  const capitalSocial = `R$ ${capitalAmount.toLocaleString("pt-BR")},00`;

  const ieDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join("");
  const inscricaoEstadual = `${ieDigits.slice(0, 3)}.${ieDigits.slice(3, 6)}.${ieDigits.slice(6, 9)}`;

  const phoneSuffix = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("");
  const telefone = `(${cityInfo.ddd}) 3${phoneSuffix.slice(0, 3)}-${phoneSuffix.slice(3, 7)}`;
  const cleanPrefix = prefix.toLowerCase().replace(/[^a-z0-9]/g, "");
  const email = `contato@${cleanPrefix}${sector.fantasia.toLowerCase()}.com.br`;

  const streetNumber = String(Math.floor(Math.random() * 2500) + 10);

  return {
    cnpj: options.formatted === false ? rawCnpj : formattedCnpj,
    cnpjUnformatted: rawCnpj,
    razaoSocial,
    nomeFantasia,
    inscricaoEstadual,
    dataAbertura,
    situacaoCadastral: "ATIVA",
    naturezaJuridica: randomItem(NATUREZAS_JURIDICAS),
    regimeTributario: randomItem(REGIMES),
    capitalSocial,
    cnaePrincipal: {
      codigo: sector.cnaeCode,
      descricao: sector.cnaeDesc,
    },
    telefone,
    email,
    endereco: {
      logradouro: cityInfo.logradouro,
      numero: streetNumber,
      bairro: cityInfo.bairro,
      cidade: cityInfo.cidade,
      uf: cityInfo.uf,
      cep: cityInfo.cepBase,
    },
    qsa: [
      { nome: `${prefix} Capital Participações`, qualificacao: "Sócio-Administrador" },
      { nome: "Administrador Designado", qualificacao: "Diretor Executivo" },
    ],
  };
}

export async function fetchCompanyFromApi(cnpj: string): Promise<CompanyDetailsWithQsa> {
  const clean = unformatCnpj(cnpj);
  const res = await fetch(`/api/cnpj/${clean}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "CNPJ não encontrado nas bases oficiais da Receita Federal.");
  }
  const data = await res.json();
  return data;
}

export async function generateCompanyFromApi(
  options: GenerateCnpjOptions = {}
): Promise<CompanyDetailsWithQsa> {
  const { formatted = true } = options;
  // 100% randomly generated valid CNPJ
  const randomCnpj = generateSingleCnpj({ formatted: false });
  const formattedCnpj = formatted ? formatCnpj(randomCnpj) : randomCnpj;

  try {
    const data = await fetchCompanyFromApi(randomCnpj);
    if (!formatted) {
      data.cnpj = data.cnpjUnformatted;
    }
    return data;
  } catch {
    // If not registered in Receita Federal, return standard missing data fallback with "--"
    return {
      cnpj: formattedCnpj,
      cnpjUnformatted: randomCnpj,
      razaoSocial: "--",
      nomeFantasia: "--",
      inscricaoEstadual: "--",
      dataAbertura: "--",
      situacaoCadastral: "--",
      naturezaJuridica: "--",
      regimeTributario: "--",
      capitalSocial: "--",
      cnaePrincipal: {
        codigo: "--",
        descricao: "--",
      },
      telefone: "--",
      email: "--",
      endereco: {
        logradouro: "--",
        numero: "--",
        complemento: "--",
        bairro: "--",
        cidade: "--",
        uf: "--",
        cep: "--",
      },
      qsa: [],
    };
  }
}

export async function generateMultipleCompaniesFromApi(
  count: number,
  options: GenerateCnpjOptions = {}
): Promise<CompanyDetailsWithQsa[]> {
  const { formatted = true } = options;
  const safeCount = Math.max(1, Math.min(count, 50));

  // Generate 100% random valid CNPJs
  const randomCnpjs = generateMultipleCnpjs(safeCount, { formatted: false });

  const results = await Promise.all(
    randomCnpjs.map(async (cnpjStr) => {
      const formattedCnpj = formatted ? formatCnpj(cnpjStr) : cnpjStr;
      try {
        const data = await fetchCompanyFromApi(cnpjStr);
        if (!formatted) {
          data.cnpj = data.cnpjUnformatted;
        }
        return data;
      } catch {
        return {
          cnpj: formattedCnpj,
          cnpjUnformatted: cnpjStr,
          razaoSocial: "--",
          nomeFantasia: "--",
          inscricaoEstadual: "--",
          dataAbertura: "--",
          situacaoCadastral: "--",
          naturezaJuridica: "--",
          regimeTributario: "--",
          capitalSocial: "--",
          cnaePrincipal: {
            codigo: "--",
            descricao: "--",
          },
          telefone: "--",
          email: "--",
          endereco: {
            logradouro: "--",
            numero: "--",
            complemento: "--",
            bairro: "--",
            cidade: "--",
            uf: "--",
            cep: "--",
          },
          qsa: [],
        };
      }
    })
  );

  return results;
}
