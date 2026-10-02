const fs = require('fs');
const path = require('path');

const translations = {
  pt: {
    homeCategories: {
      devTools: "Ferramentas para Desenvolvedores",
    },
    homeTools: {
      cpfGenerator: {
        label: "Gerador de CPF",
        desc: "Gere CPFs válidos com pontuação, filtro por estado e em lote"
      },
      cnpjGenerator: {
        label: "Gerador de CNPJ",
        desc: "Gere CNPJs válidos e dados completos de empresas fictícias"
      },
      addressGenerator: {
        label: "Gerador de Endereço & CEP",
        desc: "Gere endereços brasileiros reais e completos com CEP e UF"
      },
      uuidGenerator: {
        label: "Gerador de UUID / GUID",
        desc: "Gere UUIDs v4, v7 e v1 em lote com opções avançadas"
      },
      jsonFormatter: {
        label: "Formatador de JSON",
        desc: "Formate, minifique e valide código JSON com diagnóstico de erros"
      },
    },
    cpfGenerator: {
      metaTitle: "Gerador de CPF Online Grátis — Válido com Pontuação e por Estado | ToolNotch",
      metaDescription: "Gere números de CPF válidos para testes de software, escolha a região fiscal/UF de origem, pontuação e gere em lote. 100% no navegador.",
      title: "Gerador de CPF Online",
      description: "Gere números de CPF matematicamente válidos (algoritmo Módulo 11) com pontuação, filtragem por estado de emissão e opção em lote para testes e desenvolvimento de software.",
      faqs: [
        {
          question: "Os CPFs gerados são válidos perante a Receita Federal?",
          answer: "Os CPFs gerados seguem a regra matemática oficial de validação dos dígitos verificadores (Módulo 11). Eles são números fictícios gerados aleatoriamente com propósito exclusivo de desenvolvimento, testes de formulários e QA, não possuindo vínculo cadastral com a Receita Federal."
        },
        {
          question: "Posso escolher o estado de origem do CPF?",
          answer: "Sim! No Brasil, o nono dígito do CPF identifica a Região Fiscal onde o documento foi emitido (por exemplo: 8 para São Paulo, 7 para Rio de Janeiro/ES, 6 para Minas Gerais). Basta selecionar a UF desejada no menu."
        },
        {
          question: "Como funciona a validação em lote?",
          answer: "Você pode selecionar a quantidade desejada (1 a 50 CPFs) e copiar a lista inteira de uma só vez ou clicar para copiar individualmente cada item."
        },
        {
          question: "Esta ferramenta salva algum dado gerado?",
          answer: "Não. A geração e a validação ocorrem 100% no seu navegador utilizando JavaScript local. Nenhum número ou informação é gravado ou enviado para servidores externos."
        }
      ],
      richContent: {
        whatIs: "O CPF (Cadastro de Pessoas Físicas) é o documento de identificação fiscal individual no Brasil composto por 11 dígitos decimais, no formato XXX.XXX.XXX-XX, onde os dois últimos dígitos são verificadores de integridade calculados por uma soma ponderada.",
        howToUse: [
          "Escolha o Estado/Região Fiscal desejado ou deixe em 'Qualquer estado'.",
          "Defina se deseja o CPF formatado com pontuação ou apenas números.",
          "Escolha a quantidade desejada (individual ou em lote até 50 CPFs).",
          "Clique em 'Gerar Novo CPF' e copie com um clique."
        ],
        whyItMatters: "Em desenvolvimento de software, e-commerces, sistemas bancários e formulários de cadastro no Brasil, a validação de CPF é um dos testes mais frequentes. Ter um gerador rápido e confiável acelera o processo de QA sem recorrer a dados reais de pessoas.",
        proTip: "Você também pode colar qualquer CPF no campo 'Validador em Tempo Real' abaixo do gerador para inspecionar instantaneamente se o número é matematicamente válido."
      }
    },
    cnpjGenerator: {
      metaTitle: "Gerador de CNPJ Online Grátis com Dados de Empresa | ToolNotch",
      metaDescription: "Gere CNPJs válidos com ou sem pontuação e gere dados fictícios completos de empresas (Razão Social, Nome Fantasia, IE, Endereço e CNAE). 100% no navegador.",
      title: "Gerador de CNPJ & Dados de Empresa",
      description: "Gere números de CNPJ matematicamente válidos e dados cadastrais realistas de pessoas jurídicas (Razão Social, Inscrição Estadual, Endereço, CNAE e Regime Tributário) para testes de software.",
      faqs: [
        {
          question: "Como os dados da empresa são gerados?",
          answer: "A ferramenta combina prefixos empresariais, setores de atividade reais, códigos de CNAE oficiais do IBGE, regras de Inscrição Estadual e endereços de capitais brasileiras para criar perfis fictícios de alta fidelidade para testes de ERPs e sistemas fiscais."
        },
        {
          question: "O CNPJ gerado é aceito em validadores de sistemas?",
          answer: "Sim. O CNPJ gerado respeita o algoritmo oficial de dois dígitos verificadores com os pesos decrescentes regulamentados pela Receita Federal."
        },
        {
          question: "Posso exportar os dados como JSON?",
          answer: "Sim! Ao ativar a opção de gerar com dados da empresa, você pode copiar os dados completos tanto em texto legível quanto em JSON pronto para mocks de API."
        }
      ],
      richContent: {
        whatIs: "O CNPJ (Cadastro Nacional da Pessoa Jurídica) é o registro fiscal emitido pela Receita Federal para empresas e organizações no Brasil, composto por 14 dígitos no formato XX.XXX.XXX/0001-XX.",
        howToUse: [
          "Mantenha a opção 'Gerar dados completos da empresa' ativa para obter Razão Social, IE e Endereço.",
          "Escolha se deseja o CNPJ formatado ou apenas dígitos.",
          "Clique em 'Gerar Nova Empresa / CNPJ' para sortear novos dados.",
          "Utilize os botões 'Copiar JSON' ou 'Copiar Texto' para usar no seu código."
        ],
        whyItMatters: "Testar fluxos B2B, emissão simulada de notas fiscais (NF-e), preenchimento de formulários de faturamento e integrações de pagamentos exige dados empresariais consistentes e completos.",
        proTip: "Use o botão 'Copiar JSON' para alimentar diretamente seus testes automatizados em Jest, Cypress, Playwright ou mocks de banco de dados."
      }
    },
    addressGenerator: {
      metaTitle: "Gerador de Endereço e CEP Brasileiro Online Grátis | ToolNotch",
      metaDescription: "Gere endereços brasileiros realistas e completos com CEP válido, logradouro, número, bairro, cidade, UF e DDD para testes. 100% no navegador.",
      title: "Gerador de Endereço & CEP Brasileiro",
      description: "Gere endereços completos e verossímeis de cidades brasileiras com CEPs válidos, logradouros, bairros, números, complementos e DDDs para homologação e testes de cadastro.",
      faqs: [
        {
          question: "Os CEPs e logradouros são reais?",
          answer: "Sim. O gerador utiliza uma base curada com logradouros, bairros e faixas de CEP reais das principais cidades de diversas regiões do Brasil, proporcionando máxima fidelidade para testes de geolocalização e frete."
        },
        {
          question: "Posso filtrar por estado específico?",
          answer: "Sim. Você pode escolher estados como SP, RJ, MG, RS, PR, SC, BA, PE, CE, DF ou selecionar 'Todos os Estados' para sorteio aleatório nacional."
        },
        {
          question: "Como usar em lote?",
          answer: "Selecione a quantidade no seletor (5, 10 ou 20 endereços) e copie a lista completa de linhas de endereço em um só clique."
        }
      ],
      richContent: {
        whatIs: "O gerador de endereços brasileiros produz dados de localização geográfica contendo CEP (Código de Endereçamento Postal de 8 dígitos), logradouro (rua/avenida), número predial, complemento opcional, bairro, município e unidade federativa (UF).",
        howToUse: [
          "Selecione o Estado/UF desejado no menu suspenso.",
          "Defina se deseja incluir complementos (como Apto, Sala ou Bloco).",
          "Escolha a quantidade desejada de endereços.",
          "Copie a linha de endereço formatada ou exporte os dados como JSON."
        ],
        whyItMatters: "O cálculo de fretes em e-commerce e o preenchimento de cadastros de entrega demandam CEPs válidos e estruturas de endereço compatíveis com os padrões dos Correios e transportadoras.",
        proTip: "Ao testar APIs de cálculo de frete, o campo CEP pode ser copiado individualmente clicando no ícone de cópia ao lado dele."
      }
    },
    uuidGenerator: {
      metaTitle: "Gerador de UUID / GUID Online Grátis — v4, v7 e v1 em Lote | ToolNotch",
      metaDescription: "Gere identificadores UUID v4 (aleatório), UUID v7 (RFC 9562 ordenado por tempo) e v1 em lote com opções de maiúsculas, hífens e chaves. 100% no navegador.",
      title: "Gerador de UUID / GUID Online",
      description: "Crie identificadores universalmente exclusivos (UUIDs / GUIDs) nos padrões v4, v7 (RFC 9562 time-ordered) e v1. Gere até 100 IDs por vez com suporte a maiúsculas, remoção de hífens e download em .TXT.",
      faqs: [
        {
          question: "Qual a diferença entre UUID v4 e UUID v7?",
          answer: "O UUID v4 é 100% aleatório criptográfico (ótimo para IDs não sequenciais). O UUID v7 (novo padrão RFC 9562 de 2024) combina timestamp Unix em milissegundos com entropia aleatória, sendo ideal para chaves primárias de bancos de dados relacionais e NoSQL porque mantém índices ordenados no disco sem fragmentação de B-Tree."
        },
        {
          question: "O que é UUID v1?",
          answer: "O UUID v1 é baseado na data/hora gregoriana de 100 nanossegundos e no endereço de nó (ou valor simulado), garantindo unicidade temporal."
        },
        {
          question: "Os UUIDs gerados são seguros para produção?",
          answer: "Sim. A ferramenta utiliza a Web Crypto API (crypto.randomUUID e crypto.getRandomValues) do seu próprio navegador para garantir entropia criptograficamente forte."
        }
      ],
      richContent: {
        whatIs: "UUID (Universally Unique Identifier) ou GUID (Globally Unique Identifier) é um identificador de 128 bits padronizado pela RFC 4122 e RFC 9562, projetado para permitir que sistemas distribuídos criem identificadores únicos sem coordenação central.",
        howToUse: [
          "Escolha a versão desejada: UUID v4 (aleatório), UUID v7 (ordenado por data) ou UUID v1.",
          "Configure as preferências: maiúsculas, com/sem hífens, chaves { }, prefixo URN ou aspas.",
          "Defina a quantidade de identificadores (de 1 até 100).",
          "Clique em 'Gerar Novo UUID' e copie ou baixe o arquivo .txt."
        ],
        whyItMatters: "UUIDs são o padrão da indústria para chaves primárias em bancos de dados (PostgreSQL, MySQL, MongoDB), IDs de transação de pagamento, tokens de sessão e rastreamento de microsserviços.",
        proTip: "Para chaves primárias em bancos de dados SQL (como PostgreSQL UUID), prefira o UUID v7 para obter até 30% a 50% mais desempenho de inserção em tabelas indexadas."
      }
    },
    jsonFormatter: {
      metaTitle: "Formatador e Validador de JSON Online Grátis | ToolNotch",
      metaDescription: "Formate, embeleze (beautify), minifique e valide código JSON online com detecção de erros por linha e coluna, estatísticas de árvore e auto-correção. 100% no navegador.",
      title: "Formatador e Validador de JSON",
      description: "Embeleze código JSON desordenado com recuo configurável (2 espaços, 4 espaços, tab), minifique para payloads compactos, valide sintaxe em tempo real e inspecione estatísticas de nós e tamanho.",
      faqs: [
        {
          question: "Meu código JSON é enviado para algum servidor?",
          answer: "Não. Toda a formatação, validação e cálculo de estatísticas é executada localmente no seu navegador via JavaScript. Seus dados e payloads confidenciais permanecem 100% privados."
        },
        {
          question: "O que a função 'Auto-Corrigir' faz?",
          answer: "Ela tenta corrigir automaticamente erros comuns de sintaxe cometidos por desenvolvedores, como aspas simples ao invés de duplas, vírgulas sobrando no final de objetos/arrays (trailing commas) e chaves sem aspas."
        },
        {
          question: "Qual a diferença entre Formatar e Minificar?",
          answer: "A formatação (beautify) organiza o código em múltiplas linhas com identação legível para humanos. A minificação remove todas as quebras de linha e espaços desnecessários, reduzindo o tamanho em bytes para tráfego em rede e APIs."
        }
      ],
      richContent: {
        whatIs: "JSON (JavaScript Object Notation) é o formato padrão aberto e independente de linguagem mais utilizado na web para troca de dados estruturados entre clientes, servidores e APIs REST/GraphQL.",
        howToUse: [
          "Cole seu código JSON na área de texto ou clique em 'Exemplo' para carregar um modelo.",
          "Clique em 'Formatar' para identar o código com 2 ou 4 espaços ou 'Minificar' para comprimir em uma linha.",
          "Verifique o painel inferior para identificar a validade do JSON e o diagnóstico de eventuais erros de sintaxe.",
          "Clique em 'Copiar' ou 'Baixar JSON' para salvar o arquivo resultante."
        ],
        whyItMatters: "Trabalhar com respostas de APIs minificadas ou arquivos de configuração complexos sem formatação visual torna o debug demorado. Um bom formatador identifica instantaneamente onde falta uma vírgula ou fecha-chave.",
        proTip: "Observe a barra de estatísticas para conferir o tamanho exato em bytes, a profundidade máxima da árvore e a quantidade total de propriedades do payload."
      }
    }
  },
  en: {
    homeCategories: {
      devTools: "Developer Tools",
    },
    homeTools: {
      cpfGenerator: {
        label: "CPF Generator",
        desc: "Generate valid Brazilian CPFs with mask, state filter, and bulk mode"
      },
      cnpjGenerator: {
        label: "CNPJ Generator",
        desc: "Generate valid Brazilian CNPJs and complete mock company data"
      },
      addressGenerator: {
        label: "Address Generator",
        desc: "Generate realistic Brazilian addresses with CEP postal codes and states"
      },
      uuidGenerator: {
        label: "UUID / GUID Generator",
        desc: "Generate UUID v4, v7, and v1 in bulk with custom casing and formats"
      },
      jsonFormatter: {
        label: "JSON Formatter",
        desc: "Format, minify, and validate JSON code with real-time error diagnostics"
      },
    },
    cpfGenerator: {
      metaTitle: "Free Online CPF Generator — Valid Brazilian Tax ID with Mask & State | ToolNotch",
      metaDescription: "Generate valid Brazilian CPF numbers for software testing, QA, and form validation. Choose tax region, formatting mask, and bulk generation. 100% in-browser.",
      title: "Online CPF Generator",
      description: "Generate mathematically valid Brazilian CPF numbers (Modulo 11 algorithm) with optional punctuation, state tax region filtering, and bulk generation for software development and QA.",
      faqs: [
        {
          question: "Are the generated CPFs officially registered?",
          answer: "The generated CPFs strictly follow the official mathematical checksum algorithm (Modulo 11). They are randomly generated synthetic numbers intended exclusively for software development, QA testing, and form validation."
        },
        {
          question: "Can I choose the state of origin?",
          answer: "Yes! In Brazil, the 9th digit of the CPF identifies the fiscal region of issuance (e.g. 8 for São Paulo, 7 for Rio de Janeiro). You can pick any state in the dropdown menu."
        },
        {
          question: "Is any generated data stored on servers?",
          answer: "No. All generation and validation happens 100% locally in your browser with JavaScript. Zero data leaves your computer."
        }
      ],
      richContent: {
        whatIs: "The CPF (Cadastro de Pessoas Físicas) is the Brazilian individual taxpayer registry number consisting of 11 decimal digits formatted as XXX.XXX.XXX-XX with two check digits calculated via weighted sums.",
        howToUse: [
          "Choose the desired State/Fiscal Region or keep 'Any state'.",
          "Toggle whether you want punctuation (dots and dash) or unformatted digits.",
          "Select the quantity (single or bulk up to 50 CPFs).",
          "Click 'Generate New CPF' and copy in one click."
        ],
        whyItMatters: "Testing Brazilian e-commerce checkouts, banking systems, and registration flows requires valid CPF numbers to pass input mask validation.",
        proTip: "You can also test any CPF in the real-time validator box beneath the generator to inspect its mathematical validity."
      }
    },
    cnpjGenerator: {
      metaTitle: "Free Online CNPJ Generator with Realistic Mock Company Data | ToolNotch",
      metaDescription: "Generate valid Brazilian CNPJ numbers with complete mock corporate profiles (Company Name, State Tax ID, Address, and CNAE). 100% in-browser.",
      title: "CNPJ & Company Data Generator",
      description: "Generate mathematically valid Brazilian CNPJ numbers and realistic corporate profiles (Trade Name, Legal Name, State Tax ID, Address, and CNAE) for software testing.",
      faqs: [
        {
          question: "How is company mock data generated?",
          answer: "The tool pairs business naming conventions, actual Brazilian economic activity sectors (CNAE), realistic State Tax IDs, and capital city addresses to create high-fidelity corporate test fixtures."
        },
        {
          question: "Can I export the data as JSON?",
          answer: "Yes! When generating full company data, you can copy the full object as JSON or clean text with a single click."
        }
      ],
      richContent: {
        whatIs: "The CNPJ (Cadastro Nacional da Pessoa Jurídica) is the official 14-digit tax identification number issued to Brazilian businesses and organizations in the format XX.XXX.XXX/0001-XX.",
        howToUse: [
          "Keep 'Generate full company data' enabled for complete company profiles.",
          "Toggle formatted or unformatted CNPJ numbers.",
          "Click 'Generate New Company / CNPJ' to create new test fixtures.",
          "Use 'Copy JSON' or 'Copy Text' for your mock database or test suites."
        ],
        whyItMatters: "Testing B2B invoicing, simulated invoice issuance (NF-e), and payment integrations requires valid corporate registration data.",
        proTip: "Use the 'Copy JSON' button to quickly paste mock objects directly into Jest, Cypress, or Playwright test suites."
      }
    },
    addressGenerator: {
      metaTitle: "Free Brazilian Address & CEP Generator Online | ToolNotch",
      metaDescription: "Generate complete, realistic Brazilian addresses with valid postal codes (CEP), street names, neighborhoods, cities, and states for testing. 100% in-browser.",
      title: "Brazilian Address & CEP Generator",
      description: "Generate realistic Brazilian addresses with valid postal codes (CEP), street names, house numbers, unit details, cities, and state abbreviations for checkout testing.",
      faqs: [
        {
          question: "Are the postal codes (CEPs) and street names real?",
          answer: "Yes. The generator uses a curated database of real postal codes, neighborhoods, and street names across major Brazilian metropolitan areas."
        },
        {
          question: "Can I filter by state?",
          answer: "Yes. You can select specific states like SP, RJ, MG, RS, PR, SC, BA, PE, CE, DF or select 'All States' for random nationwide generation."
        }
      ],
      richContent: {
        whatIs: "The Brazilian address generator outputs realistic geographical mock data formatted with standard 8-digit postal codes (CEP), street address, number, neighborhood (bairro), city, and state (UF).",
        howToUse: [
          "Select the target State/UF from the dropdown.",
          "Choose whether to include apartment or suite numbers.",
          "Select single or bulk generation.",
          "Copy the address line or export structured JSON."
        ],
        whyItMatters: "E-commerce shipping rate calculations and address verification APIs require valid Brazilian CEPs and street structures.",
        proTip: "Copy individual fields like CEP or street name by clicking the copy icon directly on each card."
      }
    },
    uuidGenerator: {
      metaTitle: "Free Online UUID / GUID Generator — v4, v7 & v1 in Bulk | ToolNotch",
      metaDescription: "Generate UUID v4 (random), UUID v7 (RFC 9562 time-ordered), and v1 in bulk with uppercase, hyphenation, and format options. 100% in-browser.",
      title: "Online UUID / GUID Generator",
      description: "Generate Universally Unique Identifiers (UUIDs / GUIDs) in v4 (random), v7 (RFC 9562 time-ordered), and v1 formats. Bulk generate up to 100 IDs with uppercase, no-hyphen, and .TXT export options.",
      faqs: [
        {
          question: "What is the difference between UUID v4 and UUID v7?",
          answer: "UUID v4 is completely random cryptographic entropy. UUID v7 (the new 2024 RFC 9562 standard) embeds a millisecond Unix timestamp before random bits, making it time-sortable and optimal for database primary keys."
        },
        {
          question: "Are the generated UUIDs cryptographically secure?",
          answer: "Yes. The tool utilizes the browser's native Web Crypto API (crypto.randomUUID and crypto.getRandomValues) for maximum entropy."
        }
      ],
      richContent: {
        whatIs: "A Universally Unique Identifier (UUID), also known as a GUID, is a 128-bit identifier standardized by RFC 4122 and RFC 9562 to guarantee uniqueness across distributed systems without central coordination.",
        howToUse: [
          "Select your desired version: UUID v4 (random), UUID v7 (time-ordered), or UUID v1.",
          "Configure styling options: UPPERCASE, hyphens, braces { }, URN prefix, or quotes.",
          "Choose the quantity (1 up to 100 IDs).",
          "Click 'Generate' and copy or download as a .TXT file."
        ],
        whyItMatters: "UUIDs are the industry standard for primary keys in databases (PostgreSQL, MySQL, MongoDB), API transaction IDs, and distributed tracing.",
        proTip: "For SQL database primary keys, switch to UUID v7 for up to 30%–50% better index write performance over random UUID v4."
      }
    },
    jsonFormatter: {
      metaTitle: "Free Online JSON Formatter, Minifier & Validator | ToolNotch",
      metaDescription: "Format, beautify, minify, and validate JSON code online with line/column syntax error detection, tree statistics, and auto-fix. 100% in-browser.",
      title: "JSON Formatter & Validator",
      description: "Beautify messy JSON with custom indentation (2 spaces, 4 spaces, tabs), minify for compact payloads, validate syntax in real time with line/column error detection, and inspect key statistics.",
      faqs: [
        {
          question: "Is my JSON payload sent to any server?",
          answer: "No. All formatting, minifying, and syntax validation happens 100% locally in your browser. Sensitive credentials and payload data remain completely private."
        },
        {
          question: "What does 'Auto-Fix' do?",
          answer: "It attempts to resolve common developer syntax errors like single quotes instead of double quotes, trailing commas in objects and arrays, and unquoted keys."
        }
      ],
      richContent: {
        whatIs: "JSON (JavaScript Object Notation) is the ubiquitous lightweight, text-based open standard format for structured data exchange across modern APIs, databases, and configuration files.",
        howToUse: [
          "Paste or type your JSON in the code editor, or click 'Sample' to load a demo.",
          "Click 'Format' to indent (2 or 4 spaces) or 'Minify' to compress into a single line.",
          "Check the status banner for real-time validation and error line/column coordinates.",
          "Click 'Copy' or 'Download JSON' to export the result."
        ],
        whyItMatters: "Debugging unformatted API payloads or locating broken commas in large JSON configs is tedious without automated syntax diagnostics.",
        proTip: "Check the statistics footer to see exact byte weight, nesting depth, and total key counts for your payload."
      }
    }
  },
  es: {
    homeCategories: {
      devTools: "Herramientas para Desarrolladores",
    },
    homeTools: {
      cpfGenerator: {
        label: "Generador de CPF",
        desc: "Genera CPFs válidos con puntuación, filtro por estado y en lote"
      },
      cnpjGenerator: {
        label: "Generador de CNPJ",
        desc: "Genera CNPJs válidos y datos completos de empresas ficticias"
      },
      addressGenerator: {
        label: "Generador de Direcciones",
        desc: "Genera direcciones brasileñas reales y completas con CEP y estado"
      },
      uuidGenerator: {
        label: "Generador de UUID / GUID",
        desc: "Genera UUIDs v4, v7 y v1 en lote con opciones avanzadas"
      },
      jsonFormatter: {
        label: "Formateador de JSON",
        desc: "Formatea, minifica y valida código JSON con diagnóstico de errores"
      },
    },
    cpfGenerator: {
      metaTitle: "Generador de CPF Brasileño Online Gratis — Válido con Puntuación | ToolNotch",
      metaDescription: "Genera números de CPF válidos para pruebas de software y QA en Brasil. Filtro por estado, puntuación y generación en lote. 100% en el navegador.",
      title: "Generador de CPF Online",
      description: "Genera números de CPF brasileños matemáticamente válidos (algoritmo Módulo 11) con puntuación opcional, filtro por estado fiscal y generación en lote para pruebas de software.",
      faqs: [
        {
          question: "¿Los CPFs generados son válidos en sistemas?",
          answer: "Sí. Cumplen con la fórmula matemática oficial de dígitos verificadores (Módulo 11) de la Receita Federal brasileña para pruebas de QA y validación de formularios."
        },
        {
          question: "¿Se envían datos al servidor?",
          answer: "No. Todo el procesamiento se realiza en tu navegador con JavaScript de forma 100% privada."
        }
      ],
      richContent: {
        whatIs: "El CPF (Cadastro de Pessoas Físicas) es el documento de identificación fiscal individual en Brasil compuesto por 11 dígitos en formato XXX.XXX.XXX-XX.",
        howToUse: [
          "Selecciona el estado fiscal deseado o 'Cualquier estado'.",
          "Elige si deseas formato con puntos y guion o solo números.",
          "Selecciona la cantidad de CPFs.",
          "Haz clic en 'Generar Nuevo CPF' y cópialo al instante."
        ],
        whyItMatters: "Probar formularios de registro, pasarelas de pago y sistemas brasileños requiere números de CPF válidos para superar validaciones.",
        proTip: "Usa el validador en tiempo real debajo del generador para comprobar cualquier CPF."
      }
    },
    cnpjGenerator: {
      metaTitle: "Generador de CNPJ y Datos de Empresas Brasileñas Gratis | ToolNotch",
      metaDescription: "Genera CNPJs válidos y perfiles completos de empresas ficticias brasileñas (Razón Social, Inscripción Estatal, Dirección y CNAE). 100% en el navegador.",
      title: "Generador de CNPJ & Datos de Empresa",
      description: "Genera números de CNPJ válidos y datos corporativos realistas (Razón Social, Nombre Fantasía, Inscripción Estatal, Dirección y CNAE) para pruebas de desarrollo.",
      faqs: [
        {
          question: "¿Cómo se generan los datos de la empresa?",
          answer: "La herramienta combina sectores de actividad reales, códigos CNAE oficiales y direcciones brasileñas para generar perfiles ficticios para pruebas."
        },
        {
          question: "¿Puedo exportar los datos como JSON?",
          answer: "Sí, puedes copiar los datos completos en texto legible o en JSON con un solo clic."
        }
      ],
      richContent: {
        whatIs: "El CNPJ (Cadastro Nacional da Pessoa Jurídica) es el registro fiscal empresarial en Brasil compuesto por 14 dígitos en formato XX.XXX.XXX/0001-XX.",
        howToUse: [
          "Activa 'Generar datos completos de la empresa' para obtener perfiles completos.",
          "Selecciona formato con puntuación o solo números.",
          "Haz clic en 'Generar Nueva Empresa / CNPJ'.",
          "Copia en JSON o texto plano."
        ],
        whyItMatters: "Las pruebas de facturación electrónica y flujos B2B requieren datos corporativos consistentes.",
        proTip: "Usa 'Copiar JSON' para alimentar directamente tus tests automatizados."
      }
    },
    addressGenerator: {
      metaTitle: "Generador de Direcciones y CEPs de Brasil Gratis | ToolNotch",
      metaDescription: "Genera direcciones brasileñas realistas con código postal (CEP) válido, calle, barrio, ciudad y estado para pruebas. 100% en el navegador.",
      title: "Generador de Direcciones & CEP Brasileño",
      description: "Genera direcciones completas de ciudades brasileñas con códigos postales (CEP) válidos, nombres de calle, números, barrios y códigos telefónicos (DDD).",
      faqs: [
        {
          question: "¿Los códigos postales (CEP) son reales?",
          answer: "Sí. La base de datos contiene calles y códigos postales de las principales capitales y ciudades de Brasil."
        },
        {
          question: "¿Puedo filtrar por estado?",
          answer: "Sí, puedes elegir estados como SP, RJ, MG, RS, PR, SC, BA, PE, DF o todos los estados."
        }
      ],
      richContent: {
        whatIs: "Generador de datos geográficos brasileños con CEP de 8 dígitos, calle, número, complemento, barrio, ciudad y estado (UF).",
        howToUse: [
          "Selecciona el estado deseado en el menú.",
          "Elige si incluir complemento (apartamento/oficina).",
          "Selecciona la cantidad de direcciones.",
          "Copia la dirección formateada o en JSON."
        ],
        whyItMatters: "Esencial para probar cotizaciones de envíos y formularios de entrega de e-commerce en Brasil.",
        proTip: "Haz clic en el icono de copia junto a cada campo para copiar solo el CEP o la calle."
      }
    },
    uuidGenerator: {
      metaTitle: "Generador de UUID / GUID Online Gratis — v4, v7 y v1 en Lote | ToolNotch",
      metaDescription: "Genera identificadores UUID v4 (aleatorio), UUID v7 (RFC 9562 ordenado por tiempo) y v1 en lote con mayúsculas y guiones. 100% en el navegador.",
      title: "Generador de UUID / GUID Online",
      description: "Genera identificadores universales únicos (UUID/GUID) en versiones v4, v7 (RFC 9562) y v1. Genera hasta 100 IDs por vez con opciones de formato y descarga en .TXT.",
      faqs: [
        {
          question: "¿Qué ventaja tiene UUID v7?",
          answer: "UUID v7 incorpora una marca de tiempo Unix antes de los bits aleatorios, lo que permite ordenar cronológicamente claves primarias en bases de datos con alto rendimiento de indexación."
        },
        {
          question: "¿Los UUIDs son criptográficamente seguros?",
          answer: "Sí. Utiliza la Web Crypto API del navegador para máxima entropía."
        }
      ],
      richContent: {
        whatIs: "Un UUID (Universally Unique Identifier) es un identificador de 128 bits estandarizado por RFC 4122 y RFC 9562 para garantizar unicidad global sin servidor central.",
        howToUse: [
          "Elige la versión: UUID v4 (aleatorio), UUID v7 (por tiempo) o UUID v1.",
          "Configura mayúsculas, guiones, llaves { } o comillas.",
          "Elige la cantidad deseada.",
          "Haz clic en 'Generar' y copia o descarga el archivo .TXT."
        ],
        whyItMatters: "Estándar de la industria para claves primarias en bases de datos e identificadores de transacciones de API.",
        proTip: "Usa UUID v7 en bases de datos SQL para optimizar las inserciones en índices B-Tree."
      }
    },
    jsonFormatter: {
      metaTitle: "Formateador y Validador de JSON Online Gratis | ToolNotch",
      metaDescription: "Formatea, embellece (beautify), minifica y valida código JSON con detección de errores por línea y columna, auto-corrección y estadísticas. 100% en el navegador.",
      title: "Formateador y Validador de JSON",
      description: "Embellece código JSON con indentación personalizada (2 espacios, 4 espacios, tab), minifica para payloads ligeros y valida la sintaxis en tiempo real con diagnóstico de errores.",
      faqs: [
        {
          question: "¿Mi código JSON se envía a servidores?",
          answer: "No. Todo el formateo y validación se realiza 100% en tu navegador de forma privada."
        },
        {
          question: "¿Qué hace 'Auto-Corregir'?",
          answer: "Intenta corregir comillas simples, comas sobrantes y claves sin comillas automáticamente."
        }
      ],
      richContent: {
        whatIs: "JSON (JavaScript Object Notation) es el formato estándar abierto más utilizado para intercambio de datos estructurados entre clientes y servidores.",
        howToUse: [
          "Pega tu código JSON o haz clic en 'Ejemplo'.",
          "Haz clic en 'Formatear' o 'Minificar'.",
          "Revisa el panel de estado para verificar la validez sintáctica.",
          "Copia o descarga el archivo JSON."
        ],
        whyItMatters: "Facilita la depuración de respuestas de APIs y archivos de configuración.",
        proTip: "Revisa la barra inferior para ver tamaño en bytes, niveles de profundidad y número de claves."
      }
    }
  }
};

['pt', 'en', 'es'].forEach((lang) => {
  const filePath = path.join(__dirname, '..', 'messages', `${lang}.json`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const data = translations[lang];

  // Update home.categories
  if (!json.home) json.home = {};
  if (!json.home.categories) json.home.categories = {};
  json.home.categories.devTools = data.homeCategories.devTools;

  // Update home.tools
  if (!json.home.tools) json.home.tools = {};
  Object.assign(json.home.tools, data.homeTools);

  // Update top-level namespaces
  json.cpfGenerator = data.cpfGenerator;
  json.cnpjGenerator = data.cnpjGenerator;
  json.addressGenerator = data.addressGenerator;
  json.uuidGenerator = data.uuidGenerator;
  json.jsonFormatter = data.jsonFormatter;

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Updated ${lang}.json successfully.`);
});
