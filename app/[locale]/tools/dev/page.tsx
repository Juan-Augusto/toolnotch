import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Hash,
  FileCode2,
} from "lucide-react";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  webAppSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import { AppBreadcrumb, AppCard } from "@/components/ui";

const PATH = "/tools/dev";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const title =
    locale === "pt"
      ? "Ferramentas para Desenvolvedores Online Gratuitas: CPF, CNPJ, Endereço, UUID, JSON | ToolNotch"
      : locale === "es"
        ? "Herramientas para Desarrolladores Online Gratuitas: CPF, CNPJ, Dirección, UUID, JSON | ToolNotch"
        : "Free Online Developer Tools: CPF, CNPJ, Address, UUID & JSON Formatter | ToolNotch";

  const description =
    locale === "pt"
      ? "Conjunto gratuito de utilitários para programadores e QA: gerador de CPF e CNPJ (com dados de empresa), gerador de endereço e CEP brasileiro, gerador de UUID v4/v7/v1 e formatador de JSON. 100% no navegador."
      : locale === "es"
        ? "Suite gratuita de herramientas para programadores: generadores de CPF, CNPJ (con datos de empresa), direcciones brasileñas, UUID v4/v7/v1 y formateador JSON. 100% en el navegador."
        : "Complete suite of free developer tools: Brazilian CPF & CNPJ mock data generator, realistic Brazilian address generator, UUID v4/v7/v1 generator, and JSON formatter & validator. 100% in-browser.";

  return {
    title,
    description,
    alternates: buildAlternatesForLocale(PATH, locale),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: localizedUrl,
      locale: ogLocale,
      siteName: "ToolNotch",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DevToolsHubPage({ params }: Props) {
  const { locale } = await params;
  const prefix = locale === "en" ? "" : `/${locale}`;

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const devLabel =
    locale === "pt" ? "Desenvolvedor" : locale === "es" ? "Desarrollador" : "Developer";

  const tools = [
    {
      href: `${prefix}/tools/dev/cpf-generator`,
      title:
        locale === "pt"
          ? "Gerador de CPF"
          : locale === "es"
            ? "Generador de CPF"
            : "CPF Generator",
      desc:
        locale === "pt"
          ? "Gere CPFs válidos com dígitos verificadores corretos, opção de máscara, filtro por estado/região fiscal e gerador em lote."
          : locale === "es"
            ? "Genera CPFs válidos con dígitos verificadores correctos, puntuación opcional, filtro por estado y en lote."
            : "Generate valid Brazilian CPFs with correct check digits, optional mask, state tax region filtering, and bulk support.",
      specs:
        locale === "pt"
          ? ["Algoritmo Módulo 11", "Filtro por UF", "Geração em Lote", "Validador"]
          : locale === "es"
            ? ["Algoritmo Módulo 11", "Filtro por Estado", "En Lote", "Validador"]
            : ["Modulo 11 Algorithm", "State Filter", "Bulk Generation", "Validator"],
      icon: <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/dev/cnpj-generator`,
      title:
        locale === "pt"
          ? "Gerador de CNPJ"
          : locale === "es"
            ? "Generador de CNPJ"
            : "CNPJ Generator",
      desc:
        locale === "pt"
          ? "Gere CNPJs válidos com opção de dados completos da empresa: Razão Social, Nome Fantasia, IE, Endereço e CNAE."
          : locale === "es"
            ? "Genera CNPJs válidos con datos empresariales realistas: Razón Social, IE, Dirección y CNAE."
            : "Generate valid Brazilian CNPJs with optional realistic company profiles: Company Name, State Tax ID, Address, and CNAE.",
      specs:
        locale === "pt"
          ? ["Dados de Empresa", "Exportar JSON / Texto", "Inscrição Estadual", "Validador"]
          : locale === "es"
            ? ["Datos de Empresa", "Exportar JSON / Texto", "Inscripción Estatal", "Validador"]
            : ["Company Mock Data", "JSON / Text Export", "State Tax ID", "Validator"],
      icon: <Building2 className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/dev/address-generator`,
      title:
        locale === "pt"
          ? "Gerador de Endereço & CEP"
          : locale === "es"
            ? "Generador de Direcciones & CEP"
            : "Address & CEP Generator",
      desc:
        locale === "pt"
          ? "Gere endereços brasileiros realistas e completos com CEP válido, rua, número, complemento, bairro, cidade, UF e DDD."
          : locale === "es"
            ? "Genera direcciones brasileñas completas con código postal (CEP), calle, número, barrio, ciudad y estado."
            : "Generate realistic Brazilian addresses complete with valid CEP postal codes, street, city, state, DDD, and region.",
      specs:
        locale === "pt"
          ? ["Base de CEPs Reais", "Filtro por Estado", "Exportação JSON", "Em Lote"]
          : locale === "es"
            ? ["Base de CEPs Reales", "Filtro por Estado", "Exportación JSON", "En Lote"]
            : ["Real Postal Codes", "State Filter", "JSON Export", "Bulk Mode"],
      icon: <MapPin className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/dev/uuid-generator`,
      title:
        locale === "pt"
          ? "Gerador de UUID / GUID"
          : locale === "es"
            ? "Generador de UUID / GUID"
            : "UUID / GUID Generator",
      desc:
        locale === "pt"
          ? "Gere identificadores únicos universais nos padrões UUID v4, UUID v7 (RFC 9562) e UUID v1 com suporte a maiúsculas e lotes."
          : locale === "es"
            ? "Genera identificadores universales UUID v4, UUID v7 y v1 en lote con opciones de formato."
            : "Generate UUID v4 (random), UUID v7 (RFC 9562 time-ordered), and UUID v1 in bulk with custom casing and hyphens.",
      specs:
        locale === "pt"
          ? ["UUID v4, v7, v1", "Até 100 por vez", "Inspetor de Versão", "Download .TXT"]
          : locale === "es"
            ? ["UUID v4, v7, v1", "Hasta 100 por vez", "Inspector de Versión", "Descarga .TXT"]
            : ["UUID v4, v7, v1", "Up to 100 IDs", "Version Inspector", "Download .TXT"],
      icon: <Hash className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/dev/json-formatter`,
      title:
        locale === "pt"
          ? "Formatador e Validador de JSON"
          : locale === "es"
            ? "Formateador y Validador de JSON"
            : "JSON Formatter & Validator",
      desc:
        locale === "pt"
          ? "Formate, embeleze (2/4 espaços/tabs), minifique, valide a sintaxe com indicação de linha/coluna e calcule estatísticas do seu JSON."
          : locale === "es"
            ? "Formatea, embellece, minifica, valida la sintaxis con indicador de línea/columna y calcula estadísticas de JSON."
            : "Beautify, minify, validate syntax with line/col error location, auto-fix, and calculate in-depth JSON tree statistics.",
      specs:
        locale === "pt"
          ? ["Beautify & Minify", "Diagnóstico de Erros", "Auto-Corretor", "Estatísticas"]
          : locale === "es"
            ? ["Beautify & Minify", "Diagnóstico de Errores", "Auto-Corrector", "Estadísticas"]
            : ["Beautify & Minify", "Error Diagnostics", "Auto-Fixer", "Tree Stats"],
      icon: <FileCode2 className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/dev/jwt-decoder`,
      title:
        locale === "pt"
          ? "Decodificador e Inspetor de JWT"
          : locale === "es"
            ? "Decodificador e Inspector de JWT"
            : "JWT Decoder & Inspector",
      desc:
        locale === "pt"
          ? "Analise tokens JWT, inspecione Header, Payload e Assinatura com contagem regressiva de expiração em tempo real."
          : locale === "es"
            ? "Analiza tokens JWT, inspecciona Header, Payload y Firma con cuenta regresiva de expiración en tiempo real."
            : "Decode and inspect JWT header, payload, and signature with live expiration countdown and timestamp parsing.",
      specs:
        locale === "pt"
          ? ["Decodificador Base64URL", "Status de Expiração", "Claims Padrão", "Tokens Exemplo"]
          : locale === "es"
            ? ["Decodificador Base64URL", "Estado de Expiración", "Claims Estándar", "Tokens Ejemplo"]
            : ["Base64URL Decoder", "Expiration Status", "Standard Claims", "Sample Tokens"],
      icon: <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/dev/base64-converter`,
      title:
        locale === "pt"
          ? "Conversor Base64 (Texto, Hex e Imagens)"
          : locale === "es"
            ? "Conversor Base64 (Texto, Hex e Imágenes)"
            : "Base64 Encoder & Decoder",
      desc:
        locale === "pt"
          ? "Converta textos UTF-8, hexadecimal e imagens para Base64 e Data URI com opção de formato URL-Safe."
          : locale === "es"
            ? "Convierte textos UTF-8, hex e imágenes a Base64 y Data URI con formato URL-Safe."
            : "Convert UTF-8 text, hexadecimal, and images to Base64 and Data URI with URL-safe encoding mode.",
      specs:
        locale === "pt"
          ? ["Texto ➔ Base64", "Base64 ➔ Texto", "Hexadecimal", "Imagem para Data URI"]
          : locale === "es"
            ? ["Texto ➔ Base64", "Base64 ➔ Texto", "Hexadecimal", "Imagen a Data URI"]
            : ["Text ➔ Base64", "Base64 ➔ Text", "Hexadecimal", "Image to Data URI"],
      icon: <FileCode2 className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/dev/hash-generator`,
      title:
        locale === "pt"
          ? "Gerador de Hashes & Checksums"
          : locale === "es"
            ? "Generador de Hashes & Checksums"
            : "Hash & Checksum Generator",
      desc:
        locale === "pt"
          ? "Calcule hashes MD5, SHA-1, SHA-256, SHA-512, CRC-32 e HMAC simultaneamente com verificador de integridade."
          : locale === "es"
            ? "Calcula hashes MD5, SHA-1, SHA-256, SHA-512, CRC-32 y HMAC con verificador de integridad de checksum."
            : "Compute MD5, SHA-1, SHA-256, SHA-512, CRC-32, and HMAC hashes with live checksum matcher.",
      specs:
        locale === "pt"
          ? ["SHA-256 & SHA-512", "MD5 & CRC-32", "HMAC com Secret", "Comparador de Hash"]
          : locale === "es"
            ? ["SHA-256 & SHA-512", "MD5 & CRC-32", "HMAC con Secret", "Comparador de Hash"]
            : ["SHA-256 & SHA-512", "MD5 & CRC-32", "HMAC with Secret", "Hash Comparator"],
      icon: <Hash className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/dev/url-parser`,
      title:
        locale === "pt"
          ? "Parser e Editor de URL / Query String"
          : locale === "es"
            ? "Analizador y Editor de URL / Query String"
            : "URL & Query String Parser",
      desc:
        locale === "pt"
          ? "Decomponha URLs, edite parâmetros de busca em tempo real em tabela interativa e remova tags UTM."
          : locale === "es"
            ? "Descompón URLs, edita parámetros de consulta en tabla interactiva y elimina tags UTM."
            : "Parse URLs into structured components, interactively edit query parameters, and strip UTM tags.",
      specs:
        locale === "pt"
          ? ["Editor de Query String", "Remover UTMs", "Decomposição de URL", "Encode / Decode"]
          : locale === "es"
            ? ["Editor de Query String", "Eliminar UTMs", "Desglose de URL", "Encode / Decode"]
            : ["Query String Editor", "Strip UTMs", "URL Breakdown", "Encode / Decode"],
      icon: <MapPin className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/dev/regex-tester`,
      title:
        locale === "pt"
          ? "Testador e Analisador de Regex"
          : locale === "es"
            ? "Probador y Analizador de Regex"
            : "Regex Tester & Matcher",
      desc:
        locale === "pt"
          ? "Teste expressões regulares em tempo real com realce de grupos de captura, ferramenta de substituição e presets."
          : locale === "es"
            ? "Prueba expresiones regulares en tiempo real con grupos de captura, reemplazo y biblioteca de presets."
            : "Test regular expressions with capture groups visualizer, pattern substitution, and ready preset library.",
      specs:
        locale === "pt"
          ? ["Grupos de Captura", "Flags g/i/m/s/u", "Substituição (Replace)", "Presets Brasileiros"]
          : locale === "es"
            ? ["Grupos de Captura", "Flags g/i/m/s/u", "Sustitución (Replace)", "Presets Brasileños"]
            : ["Capture Groups", "g/i/m/s/u Flags", "Substitution (Replace)", "Ready Presets"],
      icon: <FileCode2 className="w-5 h-5 text-secondary shrink-0" />,
    },
  ];

  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: devLabel, url: localizedUrl },
    ]),
    webAppSchema(
      devLabel,
      PATH,
      locale === "pt"
        ? "Ferramentas online gratuitas para desenvolvedores: gerador de CPF, CNPJ, endereços, UUIDs e formatador JSON."
        : locale === "es"
          ? "Herramientas gratuitas para desarrolladores: generadores de CPF, CNPJ, direcciones, UUID y JSON."
          : "Free developer tools: CPF, CNPJ, Brazilian address generator, UUID generator, and JSON formatter.",
      locale,
      "DeveloperApplication"
    )
  );

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full">
        <div className="w-full pb-2 sm:pb-3">
          <AppBreadcrumb
            items={[
              { label: homeLabel, href: prefix || "/" },
              { label: toolsLabel, href: `${prefix}/tools` },
              { label: devLabel, current: true },
            ]}
          />
        </div>

        <header className="mb-6 sm:mb-8 pt-1 sm:pt-2 pb-3.5 sm:pb-5 border-b border-border/80">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono break-words">
            {locale === "pt"
              ? "Ferramentas para Desenvolvedores"
              : locale === "es"
                ? "Herramientas para Desarrolladores"
                : "Developer Tools"}
          </h1>
          <p className="leading-relaxed text-label mt-1.5 sm:mt-2 max-w-3xl text-xs sm:text-sm">
            {locale === "pt"
              ? "Geradores de dados sintéticos para testes de software, formatadores de código e utilitários essenciais para o fluxo diário de programação. Rápidos, privados e executados 100% no seu navegador."
              : locale === "es"
                ? "Generadores de datos para pruebas de software, formateadores de código y utilidades esenciales para desarrollo. Rápidos, privados y ejecutados 100% en tu navegador."
                : "Synthetic data generators for software QA & testing, code formatters, and essential dev utilities. Fast, private, and calculated 100% in your browser."}
          </p>
        </header>

        <section aria-label="Developer Tools" className="mb-10 sm:mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group block h-full">
                <AppCard
                  border
                  cornerAccents={false}
                  className="p-4 sm:p-5 bg-tertiary group-hover:border-secondary/60 transition-colors h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      {tool.icon}
                      <h2 className="text-sm sm:text-base font-bold text-foreground group-hover:text-secondary transition-colors font-mono">
                        {tool.title}
                      </h2>
                    </div>
                    <p className="text-xs text-label leading-relaxed font-mono line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-secondary font-semibold mt-4 pt-3 border-t border-border/50 font-mono">
                    <span>
                      {locale === "pt"
                        ? "Acessar ferramenta"
                        : locale === "es"
                          ? "Abrir herramienta"
                          : "Open tool"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </AppCard>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
