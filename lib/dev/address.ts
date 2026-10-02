/**
 * Brazilian Address / CEP generator helper with realistic dataset.
 */

export interface BrazilianAddress {
  cep: string;
  cepUnformatted: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  estadoNome: string;
  regiao: string;
  ddd: string;
}

interface CityAddressTemplate {
  cidade: string;
  uf: string;
  estadoNome: string;
  regiao: string;
  ddd: string;
  bairros: string[];
  logradouros: { tipo: string; nome: string; cepBase: string }[];
}

export const UF_LIST = [
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

const ADDRESS_DATA: CityAddressTemplate[] = [
  {
    cidade: "São Paulo",
    uf: "SP",
    estadoNome: "São Paulo",
    regiao: "Sudeste",
    ddd: "11",
    bairros: ["Bela Vista", "Pinheiros", "Moema", "Vila Mariana", "Itaim Bibi", "Tatuapé", "Santana", "Perdizes"],
    logradouros: [
      { tipo: "Avenida", nome: "Paulista", cepBase: "01310-100" },
      { tipo: "Rua", nome: "Augusta", cepBase: "01305-000" },
      { tipo: "Rua", nome: "Oscar Freire", cepBase: "01426-001" },
      { tipo: "Avenida", nome: "Faria Lima", cepBase: "01452-000" },
      { tipo: "Avenida", nome: "Brigadeiro Luís Antônio", cepBase: "01317-000" },
      { tipo: "Rua", nome: "Domingos de Morais", cepBase: "04010-000" },
      { tipo: "Alameda", nome: "Santos", cepBase: "01419-000" },
      { tipo: "Avenida", nome: "Rebouças", cepBase: "05401-000" },
    ],
  },
  {
    cidade: "Campinas",
    uf: "SP",
    estadoNome: "São Paulo",
    regiao: "Sudeste",
    ddd: "19",
    bairros: ["Cambuí", "Centro", "Taquaral", "Barão Geraldo", "Nova Campinas", "Guanabara"],
    logradouros: [
      { tipo: "Rua", nome: "Barão de Jaguara", cepBase: "13015-002" },
      { tipo: "Avenida", nome: "Francisco Glicério", cepBase: "13012-000" },
      { tipo: "Rua", nome: "Coronel Quirino", cepBase: "13025-001" },
      { tipo: "Avenida", nome: "José de Souza Campos", cepBase: "13025-320" },
    ],
  },
  {
    cidade: "Rio de Janeiro",
    uf: "RJ",
    estadoNome: "Rio de Janeiro",
    regiao: "Sudeste",
    ddd: "21",
    bairros: ["Copacabana", "Ipanema", "Botafogo", "Leblon", "Tijuca", "Barra da Tijuca", "Centro", "Flamengo"],
    logradouros: [
      { tipo: "Avenida", nome: "Atlântica", cepBase: "22070-000" },
      { tipo: "Avenida", nome: "Vieira Souto", cepBase: "22420-000" },
      { tipo: "Rua", nome: "Voluntários da Pátria", cepBase: "22270-000" },
      { tipo: "Avenida", nome: "Rio Branco", cepBase: "20040-002" },
      { tipo: "Avenida", nome: "das Américas", cepBase: "22640-100" },
      { tipo: "Rua", nome: "Conde de Bonfim", cepBase: "20520-050" },
    ],
  },
  {
    cidade: "Belo Horizonte",
    uf: "MG",
    estadoNome: "Minas Gerais",
    regiao: "Sudeste",
    ddd: "31",
    bairros: ["Savassi", "Lourdes", "Funcionários", "Belvedere", "Pampulha", "Centro"],
    logradouros: [
      { tipo: "Avenida", nome: "Afonso Pena", cepBase: "30130-005" },
      { tipo: "Avenida", nome: "do Contorno", cepBase: "30110-017" },
      { tipo: "Rua", nome: "da Bahia", cepBase: "30160-011" },
      { tipo: "Avenida", nome: "Getúlio Vargas", cepBase: "30112-020" },
      { tipo: "Avenida", nome: "Amazonas", cepBase: "30180-001" },
    ],
  },
  {
    cidade: "Curitiba",
    uf: "PR",
    estadoNome: "Paraná",
    regiao: "Sul",
    ddd: "41",
    bairros: ["Batel", "Bigorrilho", "Centro", "Água Verde", "Cabral", "Juvevê"],
    logradouros: [
      { tipo: "Avenida", nome: "Sete de Setembro", cepBase: "80060-070" },
      { tipo: "Rua", nome: "XV de Novembro", cepBase: "80020-310" },
      { tipo: "Avenida", nome: "Batel", cepBase: "80420-090" },
      { tipo: "Rua", nome: "Cândido de Abreu", cepBase: "80530-000" },
    ],
  },
  {
    cidade: "Porto Alegre",
    uf: "RS",
    estadoNome: "Rio Grande do Sul",
    regiao: "Sul",
    ddd: "51",
    bairros: ["Moinhos de Vento", "Menino Deus", "Bela Vista", "Centro Histórico", "Petrópolis"],
    logradouros: [
      { tipo: "Rua", nome: "Padre Chagas", cepBase: "90570-080" },
      { tipo: "Avenida", nome: "Ipiranga", cepBase: "90160-092" },
      { tipo: "Rua", nome: "dos Andradas", cepBase: "90020-001" },
      { tipo: "Avenida", nome: "Carlos Gomes", cepBase: "90480-003" },
    ],
  },
  {
    cidade: "Florianópolis",
    uf: "SC",
    estadoNome: "Santa Catarina",
    regiao: "Sul",
    ddd: "48",
    bairros: ["Centro", "Trindade", "Agronômica", "Itacorubi", "Jurerê Internacional", "Lagoa da Conceição"],
    logradouros: [
      { tipo: "Avenida", nome: "Beira-Mar Norte", cepBase: "88015-700" },
      { tipo: "Rua", nome: "Felipe Schmidt", cepBase: "88010-001" },
      { tipo: "Rua", nome: "Bocaiúva", cepBase: "88015-530" },
      { tipo: "Avenida", nome: "Madre Benvenuta", cepBase: "88035-001" },
    ],
  },
  {
    cidade: "Salvador",
    uf: "BA",
    estadoNome: "Bahia",
    regiao: "Nordeste",
    ddd: "71",
    bairros: ["Pituba", "Barra", "Rio Vermelho", "Graça", "Pelourinho", "Caminho das Árvores"],
    logradouros: [
      { tipo: "Avenida", nome: "Oceânica", cepBase: "40140-130" },
      { tipo: "Avenida", nome: "Manoel Dias da Silva", cepBase: "41830-001" },
      { tipo: "Avenida", nome: "Tancredo Neves", cepBase: "41820-021" },
      { tipo: "Rua", nome: "Chile", cepBase: "40020-000" },
    ],
  },
  {
    cidade: "Recife",
    uf: "PE",
    estadoNome: "Pernambuco",
    regiao: "Nordeste",
    ddd: "81",
    bairros: ["Boa Viagem", "Graças", "Espinheiro", "Casa Forte", "Recife Antigo"],
    logradouros: [
      { tipo: "Avenida", nome: "Boa Viagem", cepBase: "51020-001" },
      { tipo: "Avenida", nome: "Agamenon Magalhães", cepBase: "50050-290" },
      { tipo: "Rua", nome: "do Bom Jesus", cepBase: "50030-170" },
      { tipo: "Rua", nome: "da Aurora", cepBase: "50050-000" },
    ],
  },
  {
    cidade: "Fortaleza",
    uf: "CE",
    estadoNome: "Ceará",
    regiao: "Nordeste",
    ddd: "85",
    bairros: ["Meireles", "Aldeota", "Cocó", "Varjota", "Papicu", "Centro"],
    logradouros: [
      { tipo: "Avenida", nome: "Beira Mar", cepBase: "60165-121" },
      { tipo: "Avenida", nome: "Santos Dumont", cepBase: "60150-161" },
      { tipo: "Avenida", nome: "Dom Luís", cepBase: "60160-230" },
      { tipo: "Avenida", nome: "Washington Soares", cepBase: "60810-350" },
    ],
  },
  {
    cidade: "Brasília",
    uf: "DF",
    estadoNome: "Distrito Federal",
    regiao: "Centro-Oeste",
    ddd: "61",
    bairros: ["Asa Sul", "Asa Norte", "Sudoeste", "Noroeste", "Lago Sul", "Lago Norte"],
    logradouros: [
      { tipo: "Setor", nome: "Comercial Sul (SCS)", cepBase: "70300-500" },
      { tipo: "Setor", nome: "Bancário Norte (SBN)", cepBase: "70040-010" },
      { tipo: "Quadra", nome: "SQS 308 Bloco A", cepBase: "70355-010" },
      { tipo: "Avenida", nome: "W3 Sul", cepBase: "70330-000" },
    ],
  },
  {
    cidade: "Goiânia",
    uf: "GO",
    estadoNome: "Goiás",
    regiao: "Centro-Oeste",
    ddd: "62",
    bairros: ["Setor Bueno", "Setor Marista", "Setor Oeste", "Jardim Goiás", "Centro"],
    logradouros: [
      { tipo: "Avenida", nome: "85", cepBase: "74160-010" },
      { tipo: "Avenida", nome: "T-63", cepBase: "74230-100" },
      { tipo: "Avenida", nome: "República do Líbano", cepBase: "74115-030" },
      { tipo: "Avenida", nome: "Goiás", cepBase: "74010-010" },
    ],
  },
];

const COMPLEMENTOS = [
  "Apto 12", "Apto 45", "Apto 101", "Apto 304", "Bloco B - Apto 22",
  "Sala 501", "Conjunto 32", "Casa 2", "Fundos", "Térreo", ""
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const REAL_SEED_CEPS: Record<string, string[]> = {
  SP: [
    "01310100", "01305000", "01426001", "01452000", "01317000", "04010000", "01419000", "05401000",
    "13015002", "13012000", "13025001", "13025320", "14010060", "14025000", "11010001", "11065001",
    "18010000", "12245000", "09015000", "06010000", "07010000", "15010000", "19010000", "13480000"
  ],
  RJ: [
    "22070000", "22420000", "22270000", "20040002", "22640100", "20520050", "22210030", "22041001",
    "24020000", "24230000", "25620000", "28905000", "27910000", "28010000", "26210000", "25010000"
  ],
  MG: [
    "30130005", "30110017", "30160011", "30112020", "30180001", "30140071", "30170010", "31270901",
    "38400100", "38408100", "36010000", "36036000", "35010000", "35500000", "37002000", "32040000"
  ],
  RS: [
    "90570080", "90160092", "90020001", "90480003", "90035072", "90010150", "90560002", "90470340",
    "95020000", "96010000", "97010000", "93010000", "93310000", "99010000", "96810000", "98700000"
  ],
  PR: [
    "80060070", "80020310", "80420090", "80530000", "80250000", "80050540", "80410180", "80215090",
    "86010000", "86020000", "87013000", "87020000", "84010000", "85810000", "85010000", "83005000"
  ],
  SC: [
    "88015700", "88010001", "88015530", "88035001", "88062000", "88040000", "88015600", "88025000",
    "89201000", "89204000", "89010000", "89012000", "88301000", "88330000", "88801000", "88501000"
  ],
  BA: [
    "40140130", "41830001", "41820021", "40020000", "40170010", "41940000", "40070000", "40285000",
    "45600000", "44001000", "45000000", "48000000", "48600000", "42800000", "42700000", "45820000"
  ],
  PE: [
    "51020001", "50050290", "50030170", "50050000", "52011000", "52050000", "50070000", "51110000",
    "55002000", "53020000", "56302000", "54400000", "53401000", "55602000", "55290000", "56503000"
  ],
  CE: [
    "60165121", "60150161", "60160230", "60810350", "60175055", "60060000", "60135000", "60025001",
    "62010000", "63010000", "61600000", "61900000", "63800000", "62500000", "62800000", "63500000"
  ],
  DF: [
    "70300500", "70040010", "70355010", "70330000", "70710100", "70640000", "70832000", "71600000",
    "71900100", "72010000", "72110000", "72210000", "72300000", "72405000", "71500000", "70070000"
  ],
  GO: [
    "74160010", "74230100", "74115030", "74010010", "74150030", "74120050", "74810100", "74055010",
    "75020000", "75110000", "75901000", "74905000", "75800000", "75690000", "75701000", "73801000"
  ],
  ES: [
    "29010000", "29055000", "29101000", "29160000", "29140000", "29300000", "29700000", "29900000"
  ],
  AM: [
    "69005000", "69057000", "69010000", "69020000", "69050000", "69065000", "69100000", "69151000"
  ],
  PA: [
    "66010000", "66055000", "66035000", "66060000", "67000000", "68005000", "68500000", "68900000"
  ],
  MT: [
    "78005000", "78048000", "78015000", "78020000", "78110000", "78700000", "78550000", "78890000"
  ],
  MS: [
    "79002000", "79020000", "79004000", "79050000", "79800000", "79600000", "79200000", "79300000"
  ],
  RN: [
    "59010000", "59020000", "59064000", "59082000", "59600000", "59150000", "59290000", "59300000"
  ],
  PB: [
    "58010000", "58030000", "58045000", "58051000", "58400000", "58100000", "58300000", "58700000"
  ],
  AL: [
    "57010000", "57020000", "57035000", "57050000", "57300000", "57100000", "57600000", "57200000"
  ],
  SE: [
    "49010000", "49020000", "49025000", "49035000", "49500000", "49100000", "49400000", "49200000"
  ],
  MA: [
    "65010000", "65020000", "65075000", "65055000", "65900000", "65065000", "65600000", "65300000"
  ],
  PI: [
    "64000000", "64001000", "64049000", "64075000", "64200000", "64600000", "64800000", "64100000"
  ],
  RO: [
    "76801000", "76804000", "76820000", "76900000", "76960000", "76870000", "76980000", "76920000"
  ],
  AC: [
    "69900000", "69901000", "69914000", "69918000", "69980000", "69930000", "69925000", "69940000"
  ],
  AP: [
    "68900000", "68901000", "68906000", "68908000", "68925000", "68940000", "68980000", "68990000"
  ],
  RR: [
    "69301000", "69305000", "69312000", "69316000", "69380000", "69350000", "69340000", "69370000"
  ],
  TO: [
    "77001000", "77015000", "77020000", "77060000", "77800000", "77400000", "77600000", "77500000"
  ]
};

export interface GenerateAddressOptions {
  uf?: string;
  withComplement?: boolean;
}

export function generateSingleAddress(options: GenerateAddressOptions = {}): BrazilianAddress {
  const { uf = "ALL", withComplement = true } = options;

  let candidates = ADDRESS_DATA;
  if (uf && uf !== "ALL") {
    const filtered = ADDRESS_DATA.filter((item) => item.uf === uf);
    if (filtered.length > 0) candidates = filtered;
  }

  const city = randomChoice(candidates);
  const logradouroObj = randomChoice(city.logradouros);
  const bairro = randomChoice(city.bairros);
  const numero = String(Math.floor(Math.random() * 2800) + 10);
  const complemento = withComplement ? randomChoice(COMPLEMENTOS) : "";

  // Add random offset to last 3 digits of CEP for variety
  const [cepPrefix] = logradouroObj.cepBase.split("-");
  const suffixNum = Math.floor(Math.random() * 900) + 100;
  const cep = `${cepPrefix}-${String(suffixNum).padStart(3, "0")}`;
  const cepUnformatted = cep.replace("-", "");

  return {
    cep,
    cepUnformatted,
    logradouro: `${logradouroObj.tipo} ${logradouroObj.nome}`,
    numero,
    complemento: complemento || undefined,
    bairro,
    cidade: city.cidade,
    uf: city.uf,
    estadoNome: city.estadoNome,
    regiao: city.regiao,
    ddd: city.ddd,
  };
}

export function generateMultipleAddresses(
  count: number,
  options: GenerateAddressOptions = {}
): BrazilianAddress[] {
  const safeCount = Math.max(1, Math.min(count, 50));
  const addresses: BrazilianAddress[] = [];
  for (let i = 0; i < safeCount; i++) {
    addresses.push(generateSingleAddress(options));
  }
  return addresses;
}

export async function fetchAddressFromApi(cep: string): Promise<BrazilianAddress> {
  const cleanCep = (cep || "").replace(/\D/g, "");
  const res = await fetch(`/api/cep/${cleanCep}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "CEP não encontrado nas bases oficiais.");
  }
  const data = await res.json();

  return {
    cep: data.cep || "-",
    cepUnformatted: data.cepUnformatted || cleanCep,
    logradouro: data.logradouro || "-",
    numero: data.numero || "-",
    complemento: data.complemento || "-",
    bairro: data.bairro || "-",
    cidade: data.cidade || "-",
    uf: data.uf || "-",
    estadoNome: data.estadoNome || "-",
    regiao: data.regiao || "-",
    ddd: data.ddd || "-",
  };
}

export async function generateAddressFromApi(
  options: GenerateAddressOptions = {}
): Promise<BrazilianAddress> {
  const { uf = "ALL", withComplement = true } = options;
  let availableCeps: string[] = [];

  if (uf && uf !== "ALL" && REAL_SEED_CEPS[uf]) {
    availableCeps = REAL_SEED_CEPS[uf];
  } else {
    availableCeps = Object.values(REAL_SEED_CEPS).flat();
  }

  const randomCep = randomChoice(availableCeps);
  try {
    const addr = await fetchAddressFromApi(randomCep);
    const numero = String(Math.floor(Math.random() * 2500) + 10);
    const complemento = withComplement ? randomChoice(COMPLEMENTOS) : "-";
    return {
      ...addr,
      numero: addr.numero !== "-" ? addr.numero : numero,
      complemento: withComplement ? (addr.complemento !== "-" ? addr.complemento : complemento) : "-",
    };
  } catch {
    // Fallback to offline generator
    return generateSingleAddress(options);
  }
}

export async function generateMultipleAddressesFromApi(
  count: number,
  options: GenerateAddressOptions = {}
): Promise<BrazilianAddress[]> {
  const { uf = "ALL", withComplement = true } = options;
  const safeCount = Math.max(1, Math.min(count, 50));

  let pool: string[] = [];
  if (uf && uf !== "ALL" && REAL_SEED_CEPS[uf]) {
    pool = [...REAL_SEED_CEPS[uf]];
  } else {
    pool = Object.values(REAL_SEED_CEPS).flat();
  }

  // Shuffle pool
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selectedCeps = shuffled.slice(0, safeCount);

  // If we need more than available in slice, fill with random picks
  while (selectedCeps.length < safeCount) {
    selectedCeps.push(randomChoice(pool));
  }

  const results = await Promise.all(
    selectedCeps.map(async (c) => {
      try {
        const addr = await fetchAddressFromApi(c);
        const numero = String(Math.floor(Math.random() * 2500) + 10);
        const complemento = withComplement ? randomChoice(COMPLEMENTOS) : "-";
        return {
          ...addr,
          numero: addr.numero !== "-" ? addr.numero : numero,
          complemento: withComplement ? (addr.complemento !== "-" ? addr.complemento : complemento) : "-",
        };
      } catch {
        return generateSingleAddress(options);
      }
    })
  );

  return results;
}

export function formatAddressLine(addr: BrazilianAddress): string {
  const parts: string[] = [];

  const hasLogradouro = addr.logradouro && addr.logradouro !== "-";
  const hasNumero = addr.numero && addr.numero !== "-";
  const hasComplemento = addr.complemento && addr.complemento !== "-";

  if (hasLogradouro) {
    if (hasNumero) {
      const comp = hasComplemento ? ` (${addr.complemento})` : "";
      parts.push(`${addr.logradouro}, ${addr.numero}${comp}`);
    } else {
      const comp = hasComplemento ? ` (${addr.complemento})` : "";
      parts.push(`${addr.logradouro}${comp}`);
    }
  } else if (hasNumero) {
    const comp = hasComplemento ? ` (${addr.complemento})` : "";
    parts.push(`Nº ${addr.numero}${comp}`);
  }

  if (addr.bairro && addr.bairro !== "-") {
    parts.push(addr.bairro);
  }

  const hasCidade = addr.cidade && addr.cidade !== "-";
  const hasUf = addr.uf && addr.uf !== "-";
  if (hasCidade && hasUf) {
    parts.push(`${addr.cidade} - ${addr.uf}`);
  } else if (hasCidade) {
    parts.push(addr.cidade);
  } else if (hasUf) {
    parts.push(addr.uf);
  }

  if (addr.cep && addr.cep !== "-") {
    parts.push(`CEP ${addr.cep}`);
  }

  return parts.length > 0 ? parts.join(" - ") : "-";
}


