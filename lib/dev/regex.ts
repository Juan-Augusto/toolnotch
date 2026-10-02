/**
 * Regular Expression Tester, Group Inspector and Substitution utilities.
 */

export interface RegexMatchGroup {
  index: number;
  name?: string;
  value: string;
}

export interface RegexMatchItem {
  index: number;
  length: number;
  fullMatch: string;
  groups: RegexMatchGroup[];
}

export interface RegexTestResult {
  isValidPattern: boolean;
  error?: string;
  totalMatches: number;
  matches: RegexMatchItem[];
  replacedText?: string;
}

export interface RegexPreset {
  id: string;
  name: string;
  category: 'brazil' | 'web' | 'text' | 'security';
  pattern: string;
  flags: string;
  sampleText: string;
  description: string;
}

export function testRegex(
  pattern: string,
  flags: string,
  testText: string,
  replacement = ''
): RegexTestResult {
  if (!pattern) {
    return {
      isValidPattern: true,
      totalMatches: 0,
      matches: [],
      replacedText: testText,
    };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (err) {
    return {
      isValidPattern: false,
      error: (err as Error).message,
      totalMatches: 0,
      matches: [],
      replacedText: '',
    };
  }

  const matches: RegexMatchItem[] = [];
  const isGlobal = flags.includes('g');

  if (isGlobal) {
    let match: RegExpExecArray | null;
    let loopCount = 0;
    const maxLoops = 5000; // prevent runaway loops

    while ((match = regex.exec(testText)) !== null && loopCount < maxLoops) {
      loopCount++;
      const groups: RegexMatchGroup[] = [];

      // Extract indexed groups
      for (let i = 1; i < match.length; i++) {
        groups.push({
          index: i,
          value: match[i] ?? '',
        });
      }

      // Extract named groups if present
      if (match.groups) {
        Object.entries(match.groups).forEach(([name, value]) => {
          const existing = groups.find((g) => g.value === value);
          if (existing) {
            existing.name = name;
          } else {
            groups.push({
              index: groups.length + 1,
              name,
              value: value ?? '',
            });
          }
        });
      }

      matches.push({
        index: match.index,
        length: match[0].length,
        fullMatch: match[0],
        groups,
      });

      // Avoid infinite loop on zero-length matches
      if (match[0].length === 0) {
        regex.lastIndex++;
      }
    }
  } else {
    const match = regex.exec(testText);
    if (match) {
      const groups: RegexMatchGroup[] = [];
      for (let i = 1; i < match.length; i++) {
        groups.push({
          index: i,
          value: match[i] ?? '',
        });
      }
      if (match.groups) {
        Object.entries(match.groups).forEach(([name, value]) => {
          const existing = groups.find((g) => g.value === value);
          if (existing) {
            existing.name = name;
          } else {
            groups.push({
              index: groups.length + 1,
              name,
              value: value ?? '',
            });
          }
        });
      }
      matches.push({
        index: match.index,
        length: match[0].length,
        fullMatch: match[0],
        groups,
      });
    }
  }

  let replacedText = '';
  try {
    replacedText = testText.replace(regex, replacement);
  } catch {
    replacedText = testText;
  }

  return {
    isValidPattern: true,
    totalMatches: matches.length,
    matches,
    replacedText,
  };
}

export const REGEX_PRESETS: RegexPreset[] = [
  {
    id: 'cpf',
    name: 'CPF (com ou sem máscara)',
    category: 'brazil',
    pattern: '\\b(\\d{3})\\.?(\\d{3})\\.?(\\d{3})-?(\\d{2})\\b',
    flags: 'g',
    sampleText: 'Documentos para validação:\n1. 123.456.789-01 (formatado)\n2. 98765432100 (sem máscara)\n3. 000.111.222-33 (outro exemplo)',
    description: 'Captura CPFs com 11 dígitos com ou sem os separadores . e -.',
  },
  {
    id: 'cnpj',
    name: 'CNPJ (com ou sem máscara)',
    category: 'brazil',
    pattern: '\\b(\\d{2})\\.?(\\d{3})\\.?(\\d{3})\\/?(\\d{4})-?(\\d{2})\\b',
    flags: 'g',
    sampleText: 'Empresas cadastradas:\n- Google Brasil: 06.990.590/0001-23\n- Nubank: 18236120000158\n- Petrobras: 33.000.167/0001-01',
    description: 'Localiza números de CNPJ de 14 dígitos.',
  },
  {
    id: 'cep',
    name: 'CEP (Código Postal)',
    category: 'brazil',
    pattern: '\\b(\\d{5})-?(\\d{3})\\b',
    flags: 'g',
    sampleText: 'Endereços de entrega:\n- Av. Paulista: 01310-100\n- Copacabana: 22070001\n- Asa Sul: 70390-020',
    description: 'Identifica CEPs no formato 00000-000 ou 00000000.',
  },
  {
    id: 'phone-br',
    name: 'Telefone Celular / Fixo BR',
    category: 'brazil',
    pattern: '\\(?([1-9]{2})\\)?\\s?(?:(9\\d{4})|(\\d{4}))-?(\\d{4})',
    flags: 'g',
    sampleText: 'Telefones para contato:\n- (11) 98765-4321\n- 21912345678\n- (31) 3456-7890 (fixo)\n- 61 99999-8888',
    description: 'Captura números de celular e fixo com DDD do Brasil.',
  },
  {
    id: 'vehicle-plate',
    name: 'Placa de Veículo (Mercosul / Antiga)',
    category: 'brazil',
    pattern: '\\b[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}\\b',
    flags: 'g',
    sampleText: 'Veículos no estacionamento:\n- ABC-1234 (placa cinza antiga)\n- BRA2E19 (placa Mercosul carro)\n- RIO1A23 (placa Mercosul moto)',
    description: 'Reconhece placas de veículos no padrão Mercosul e padrão antigo.',
  },
  {
    id: 'email',
    name: 'Email (RFC 5322)',
    category: 'web',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'g',
    sampleText: 'Contatos da equipe:\n- Dev: dev.senior@toolnotch.com\n- Suporte: help-desk_2026@empresa.com.br\n- Invalido: @semusuario.com',
    description: 'Valida e extrai endereços de email padrão.',
  },
  {
    id: 'url',
    name: 'URL (HTTP / HTTPS)',
    category: 'web',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)',
    flags: 'gi',
    sampleText: 'Links úteis:\n- https://toolnotch.com/tools/dev\n- http://api.service.io/v1/health?check=true\n- https://sub.dominio.org/path#secao',
    description: 'Captura URLs web completas com protocolo, domínio, query params e hash.',
  },
  {
    id: 'date',
    name: 'Data (DD/MM/AAAA ou ISO)',
    category: 'text',
    pattern: '\\b(?:(\\d{2})\\/(\\d{2})\\/(\\d{4})|(\\d{4})-(\\d{2})-(\\d{2}))\\b',
    flags: 'g',
    sampleText: 'Agendamentos do sistema:\n- Reunião: 30/09/2026\n- Lançamento: 2026-12-31\n- Criação: 01/01/2025',
    description: 'Localiza datas tanto no formato brasileiro (DD/MM/AAAA) quanto no padrão ISO (AAAA-MM-DD).',
  },
  {
    id: 'time',
    name: 'Horário (24h / HH:MM:SS)',
    category: 'text',
    pattern: '\\b(?:[01]?\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?\\b',
    flags: 'g',
    sampleText: 'Horários de voos:\n- Embarque: 08:30\n- Decolagem: 09:15:00\n- Pouso: 23:59:45\n- Inválido: 25:99',
    description: 'Valida horários válidos no formato de 24 horas com ou sem segundos.',
  },
  {
    id: 'currency',
    name: 'Valor Monetário (R$ / $)',
    category: 'text',
    pattern: '(?:R\\$|\\$)\\s?\\d{1,3}(?:\\.\\d{3})*,\\d{2}|\\$\\d+(?:\\.\\d{2})?',
    flags: 'g',
    sampleText: 'Lista de preços:\n- Plano Básico: R$ 29,90\n- Plano Pro: R$ 1.450,00\n- Plano Enterprise: $ 199.99',
    description: 'Identifica quantias em reais (R$) com centavos e valores em dólares ($).',
  },
  {
    id: 'credit-card',
    name: 'Cartão de Crédito',
    category: 'security',
    pattern: '\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\\b',
    flags: 'g',
    sampleText: 'Exemplos de cartões de teste:\n- Visa: 4532015012345678\n- Mastercard: 5425233430109823\n- Amex: 378282246310005',
    description: 'Valida numerações das principais bandeiras de cartão (Visa, Mastercard, Amex, Discover).',
  },
  {
    id: 'jwt',
    name: 'Token JWT (Bearer)',
    category: 'security',
    pattern: '\\beyJ[A-Za-z0-9-_=]+\\.eyJ[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+/=]*\\b',
    flags: 'g',
    sampleText: 'Header de autorização:\nBearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Detecta JSON Web Tokens com cabeçalho (Header), carga (Payload) e assinatura.',
  },
  {
    id: 'ipv4',
    name: 'Endereço IPv4',
    category: 'web',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'g',
    sampleText: 'Servidores ativos: 192.168.1.1, 10.0.0.254, 127.0.0.1, 8.8.8.8 e 256.1.1.1 (inválido ignorado).',
    description: 'Localiza endereços IPv4 válidos entre 0.0.0.0 e 255.255.255.255.',
  },
  {
    id: 'ipv6',
    name: 'Endereço IPv6',
    category: 'web',
    pattern: '\\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\\b',
    flags: 'gi',
    sampleText: 'Rotas IPv6:\n- 2001:0db8:85a3:0000:0000:8a2e:0370:7334\n- fe80:0000:0000:0000:0204:61ff:fe9d:f156',
    description: 'Captura endereços IPv6 completos com 8 blocos hexadecimais.',
  },
  {
    id: 'uuid',
    name: 'UUID / GUID',
    category: 'text',
    pattern: '\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-7][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\b',
    flags: 'gi',
    sampleText: 'IDs de sessão gerados:\n- f47ac10b-58cc-4372-a567-0e02b2c3d479\n- 6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    description: 'Valida UUIDs universais (versões 1 a 7).',
  },
  {
    id: 'hexcolor',
    name: 'Cor Hexadecimal (#HEX)',
    category: 'web',
    pattern: '#(?:[0-9a-fA-F]{3,4}){1,2}\\b',
    flags: 'gi',
    sampleText: 'Paleta de cores CSS: #FF5733 (laranja), #00F (azul), #28a74580 (verde com alpha), #ffffff',
    description: 'Localiza cores HEX de 3, 4, 6 e 8 dígitos.',
  },
  {
    id: 'html-tags',
    name: 'Tags HTML',
    category: 'web',
    pattern: '<(\\/?[a-zA-Z][a-zA-Z0-9]*)\\b([^>]*)>',
    flags: 'gi',
    sampleText: 'Trecho HTML:\n<div class="container" id="main">\n  <h1 style="color:red">Título Principal</h1>\n  <p>Parágrafo com <a href="https://toolnotch.com">link</a> e <img src="logo.png" />.</p>\n</div>',
    description: 'Extrai tags HTML de abertura, fechamento e auto-fechamento.',
  },
  {
    id: 'hashes',
    name: 'Hash MD5 / SHA-256',
    category: 'security',
    pattern: '\\b(?:[a-fA-F0-9]{64}|[a-fA-F0-9]{32})\\b',
    flags: 'g',
    sampleText: 'Checksums de arquivos:\n- MD5: 5877f0a7ef2049f506e788eb504780db\n- SHA-256: bf5b8f6c3848b8159b3506ef89569e5d794ee7341ea2221b6c8e31a89c97b830',
    description: 'Encontra hashes criptográficos MD5 (32 hex) e SHA-256 (64 hex).',
  },
  {
    id: 'username-handle',
    name: 'Menção / Handle (@user)',
    category: 'text',
    pattern: '@([a-zA-Z0-9_]{3,20})\\b',
    flags: 'g',
    sampleText: 'Comentários da publicação:\n- Obrigado @juan_augusto e @dev_senior pela dica!\n- Falem com @suporte_24h se precisarem.',
    description: 'Captura menções de usuários em redes sociais com @.',
  },
  {
    id: 'url-slug',
    name: 'Slug de URL',
    category: 'web',
    pattern: '\\b[a-z0-9]+(?:-[a-z0-9]+)+\\b',
    flags: 'g',
    sampleText: 'Posts do blog:\n- /blog/como-aprender-regex-do-zero\n- /blog/melhores-ferramentas-dev-2026\n- /tools/dev/regex-tester',
    description: 'Encontra slugs amigáveis de URLs compostos por palavras separadas por hífens.',
  },
  {
    id: 'strong-password',
    name: 'Senha Forte (Validador)',
    category: 'security',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$',
    flags: 'gm',
    sampleText: 'Testes de senhas (1 por linha):\nSenhaForte@2026 (válida)\nfraca123 (sem maiúscula/símbolo)\nSENHA123! (sem minúscula)\nCurta@1 (menos de 8 caracteres)',
    description: 'Exige no mínimo 8 caracteres com pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 símbolo especial.',
  },
];
