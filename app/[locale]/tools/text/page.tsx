import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  faqSchema,
  webAppSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import { AppBreadcrumb, AppAccordion } from "@/components/ui";

const PATH = "/tools/text";

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
      ? "Ferramentas de Texto Gratuitas: Contador, Legibilidade e Tempo de Leitura | ToolNotch"
      : locale === "es"
        ? "Herramientas de Texto Gratuitas: Contador, Legibilidad y Tiempo de Lectura | ToolNotch"
        : "Free Online Text Tools: Word Counter, Readability & Reading Time | ToolNotch";

  const description =
    locale === "pt"
      ? "Conjunto completo de ferramentas de escrita e análise de texto: contador de palavras e caracteres com limites sociais, verificador de legibilidade Flesch, calculadora de tempo de leitura com Speed Reader e densidade de palavras-chave para SEO. 100% no navegador."
      : locale === "es"
        ? "Conjunto completo de herramientas de escritura y análisis de texto: contador de palabras y caracteres con límites sociales, verificador de legibilidad Flesch, calculadora de tiempo de lectura con Speed Reader y densidad de palabras clave para SEO. 100% en el navegador."
        : "Complete suite of text analysis and writing tools: word counter, character counter with social media limits, Flesch readability checker, reading time calculator with Speed Reader, and SEO keyword density analyzer. 100% in-browser.";

  return {
    title,
    description,
    alternates: buildAlternatesForLocale(PATH, locale),
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

export default async function TextToolsHubPage({ params }: Props) {
  const { locale } = await params;
  const prefix = locale === "en" ? "" : `/${locale}`;

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const textLabel =
    locale === "pt" ? "Texto" : locale === "es" ? "Texto" : "Text";

  const tools = [
    {
      href: `${prefix}/tools/text/word-counter`,
      title:
        locale === "pt"
          ? "Contador de Palavras"
          : locale === "es"
            ? "Contador de Palabras"
            : "Word Counter",
      desc:
        locale === "pt"
          ? "Contagem analítica de palavras, caracteres, frases, parágrafos, tempo de fala, metas de texto e conversões rápidas."
          : locale === "es"
            ? "Conteo analítico de palabras, caracteres, oraciones, párrafos, tiempo de voz, metas de texto y conversiones rápidas."
            : "Analytical count of words, characters, sentences, paragraphs, speaking time, word goals, and fast text transforms.",
      specs:
        locale === "pt"
          ? ["8 Métricas ao vivo", "Metas de palavras", "Flesch Reading Ease"]
          : locale === "es"
            ? ["8 Métricas en vivo", "Metas de palabras", "Flesch Reading Ease"]
            : ["8 Live metrics", "Word goals", "Flesch Reading Ease"],
    },
    {
      href: `${prefix}/tools/text/character-counter`,
      title:
        locale === "pt"
          ? "Contador de Caracteres"
          : locale === "es"
            ? "Contador de Caracteres"
            : "Character Counter",
      desc:
        locale === "pt"
          ? "Contagem precisa com medidores de progresso e limites em tempo real para Twitter/X, SMS, Instagram, LinkedIn e Meta Tags SEO."
          : locale === "es"
            ? "Conteo preciso con barras de progreso y límites en tiempo real para Twitter/X, SMS, Instagram, LinkedIn y Meta Tags SEO."
            : "Precise character count with real-time limits and meters for Twitter/X, SMS, Instagram, LinkedIn, and SEO Meta Tags.",
      specs:
        locale === "pt"
          ? ["Twitter / X (280)", "Meta Tags SEO", "SMS & Redes"]
          : locale === "es"
            ? ["Twitter / X (280)", "Meta Tags SEO", "SMS & Redes"]
            : ["Twitter / X (280)", "SEO Meta Tags", "SMS & Social"],
    },
    {
      href: `${prefix}/tools/text/reading-time-calculator`,
      title:
        locale === "pt"
          ? "Calculadora de Tempo de Leitura"
          : locale === "es"
            ? "Calculadora de Tiempo de Lectura"
            : "Reading Time Calculator",
      desc:
        locale === "pt"
          ? "Estimativa de leitura silenciosa e oratória com sliders WPM ajustáveis e leitor dinâmico RSVP (Speed Reader) integrado."
          : locale === "es"
            ? "Cálculo de tiempo de lectura y discurso con sliders WPM ajustables y Speed Reader RSVP integrado."
            : "Estimate silent reading and speaking duration with custom WPM sliders and integrated RSVP Speed Reader.",
      specs:
        locale === "pt"
          ? ["Velocidade WPM", "Tempo de fala", "Leitor RSVP"]
          : locale === "es"
            ? ["Velocidad WPM", "Tiempo de voz", "Lector RSVP"]
            : ["Custom WPM", "Speaking time", "RSVP Reader"],
    },
    {
      href: `${prefix}/tools/text/readability-checker`,
      title:
        locale === "pt"
          ? "Verificador de Legibilidade"
          : locale === "es"
            ? "Verificador de Legibilidad"
            : "Readability Checker",
      desc:
        locale === "pt"
          ? "Avalie a clareza e complexidade do seu texto com as métricas Flesch Reading Ease, Flesch-Kincaid Grade Level e Índice Gunning Fog."
          : locale === "es"
            ? "Evalúa la claridad y complejidad de tu texto con las métricas Flesch Reading Ease, Flesch-Kincaid Grade Level e Índice Gunning Fog."
            : "Assess clarity and lexical complexity with Flesch Reading Ease, Flesch-Kincaid Grade Level, and Gunning Fog Index.",
      specs:
        locale === "pt"
          ? ["Flesch Ease", "Flesch-Kincaid", "Gunning Fog"]
          : locale === "es"
            ? ["Flesch Ease", "Flesch-Kincaid", "Gunning Fog"]
            : ["Flesch Ease", "Flesch-Kincaid", "Gunning Fog"],
    },
    {
      href: `${prefix}/tools/text/keyword-density-checker`,
      title:
        locale === "pt"
          ? "Densidade de Palavras-Chave"
          : locale === "es"
            ? "Densidad de Palabras Clave"
            : "Keyword Density Checker",
      desc:
        locale === "pt"
          ? "Identifique repetições de termos simples e compostos (N-grams 1-3), filtre stopwords e evite penalidades por keyword stuffing."
          : locale === "es"
            ? "Identifica repeticiones de términos simples y compuestos (N-grams 1-3), filtra stopwords y evita sobreoptimización."
            : "Analyze single and multi-word phrase frequency (1-3 N-grams), filter stopwords, and avoid keyword stuffing penalties.",
      specs:
        locale === "pt"
          ? ["N-grams (1-3)", "Filtro Stopwords", "Alerta Stuffing"]
          : locale === "es"
            ? ["N-grams (1-3)", "Filtro Stopwords", "Alerta Stuffing"]
            : ["1-3 N-grams", "Stopword filter", "Stuffing alert"],
    },
  ];

  const faqs = [
    {
      question:
        locale === "pt"
          ? "O texto inserido nas ferramentas fica salvo em algum servidor?"
          : locale === "es"
            ? "¿El texto ingresado en las herramientas se guarda en algún servidor?"
            : "Is the text entered into the tools stored on any server?",
      answer:
        locale === "pt"
          ? "Não. Todas as ferramentas de texto do ToolNotch operam 100% no seu próprio navegador usando JavaScript do lado do cliente. Seu texto nunca é enviado, registrado ou processado em servidores externos."
          : locale === "es"
            ? "No. Todas las herramientas de texto de ToolNotch funcionan al 100% en tu propio navegador usando JavaScript del lado del cliente. Tu texto nunca se envía ni almacena en servidores externos."
            : "No. All ToolNotch text tools operate 100% inside your browser using client-side JavaScript. Your text is never transmitted, logged, or processed on remote servers.",
    },
    {
      question:
        locale === "pt"
          ? "Qual é a diferença entre contagem com e sem espaços?"
          : locale === "es"
            ? "¿Cuál es la diferencia entre el conteo con y sin espacios?"
            : "What is the difference between counting with and without spaces?",
      answer:
        locale === "pt"
          ? "A contagem total inclui todos os caracteres (letras, números, pontuação e espaços em branco). A contagem sem espaços descarta quebras de linha, tabulações e espaços, o que é exigido por alguns concursos e formulários de submissão acadêmica."
          : locale === "es"
            ? "El conteo total incluye todos los caracteres (letras, números, puntuación y espacios). El conteo sin espacios descarta saltos de línea y espacios, lo cual es requerido por algunas normativas académicas."
            : "The total character count includes all glyphs, punctuation, and white spaces. Character count without spaces removes spaces and line breaks, which is required by certain academic style guides.",
    },
    {
      question:
        locale === "pt"
          ? "O que é uma boa densidade de palavras-chave para SEO?"
          : locale === "es"
            ? "¿Qué es una buena densidad de palabras clave para SEO?"
            : "What is a healthy keyword density for SEO?",
      answer:
        locale === "pt"
          ? "Recomenda-se manter a palavra-chave principal entre 1% e 3% do volume total do texto. Densidades superiores a 3,5% podem ser interpretadas pelos algoritmos de busca como keyword stuffing (excesso de palavras-chave), prejudicando o ranqueamento."
          : locale === "es"
            ? "Se recomienda mantener la palabra clave principal entre 1% y 3% del total. Densidades superiores al 3.5% pueden interpretarse como sobreoptimización (keyword stuffing) y perjudicar el posicionamiento."
            : "A healthy primary keyword density typically sits between 1% and 3%. Densities exceeding 3.5% can be flagged by search engine algorithms as keyword stuffing, harming organic rankings.",
    },
    {
      question:
        locale === "pt"
          ? "Como o Speed Reader (RSVP) funciona?"
          : locale === "es"
            ? "¿Cómo funciona el Speed Reader (RSVP)?"
            : "How does the Speed Reader (RSVP) work?",
      answer:
        locale === "pt"
          ? "A tecnologia RSVP (Rapid Serial Visual Presentation) apresenta as palavras uma a uma em um ponto fixo da tela, destacando a letra focal (ORP) em vermelho. Isso elimina o movimento sacádico dos olhos e permite ler a velocidades de 250 a 400+ palavras por minuto com menos esforço."
          : locale === "es"
            ? "La tecnología RSVP presenta las palabras una a una en un punto fijo de la pantalla, destacando la letra focal (ORP) en rojo. Esto elimina el movimiento de los ojos y permite leer a velocidades de 250 a 400+ palabras por minuto."
            : "RSVP (Rapid Serial Visual Presentation) flashes words sequentially at a fixed visual focal point, highlighting the Optimal Recognition Point (ORP) in red. This reduces saccadic eye movements, allowing reading speeds of 250 to 400+ WPM with less fatigue.",
    },
  ];

  const guides = [
    {
      title:
        locale === "pt"
          ? "Escreva Primeiro, Analise Depois"
          : locale === "es"
            ? "Escribe Primero, Analiza Después"
            : "Draft First, Analyze Second",
      desc:
        locale === "pt"
          ? "Concentre-se no fluxo criativo durante o rascunho. Verifique contagem de palavras, legibilidade e densidade apenas na revisão final."
          : locale === "es"
            ? "Concéntrate en el flujo creativo durante el borrador. Revisa conteo, legibilidad y densidad solo en la corrección final."
            : "Focus on creative flow while drafting. Check word count, readability scores, and keyword density only during final polish.",
    },
    {
      title:
        locale === "pt"
          ? "Adequação ao Nível do Leitor"
          : locale === "es"
            ? "Adecuación al Nivel del Lector"
            : "Match Your Audience's Level",
      desc:
        locale === "pt"
          ? "Para artigos de blog e e-mails, mire em Flesch entre 60 e 70. Textos técnicos podem ser densos, mas parágrafos curtos facilitam a leitura."
          : locale === "es"
            ? "Para blogs y correos, apunta a un Flesch entre 60 y 70. Textos técnicos pueden ser densos, pero párrafos cortos facilitan la lectura."
            : "For blogs and emails, aim for Flesch scores between 60 and 70. Technical documents can be denser, but keep paragraphs short.",
    },
    {
      title:
        locale === "pt"
          ? "Controle de Limites por Canal"
          : locale === "es"
            ? "Control de Límites por Canal"
            : "Channel Limit Compliance",
      desc:
        locale === "pt"
          ? "Utilize o Contador de Caracteres para evitar cortes indesejados no Twitter (280), meta tags (160) e descrições de redes sociais."
          : locale === "es"
            ? "Usa el Contador de Caracteres para evitar cortes en Twitter (280), meta descripciones (160) y publicaciones en redes sociales."
            : "Use the Character Counter to avoid awkward cut-offs on Twitter (280), SEO meta descriptions (160), and social media bios.",
    },
    {
      title:
        locale === "pt"
          ? "Densidade Saudável (1% a 3%)"
          : locale === "es"
            ? "Densidad Saludable (1% a 3%)"
            : "Natural Keyword Density",
      desc:
        locale === "pt"
          ? "Evite forçar repetições da palavra-chave. Mecanismos de busca premiam relevância semântica e variedade de termos em vez de excesso artificial."
          : locale === "es"
          ? "Evita forzar repeticiones de la palabra clave. Los motores de búsqueda premian la variedad semántica frente a la repetición artificial."
          : "Avoid artificial keyword stuffing. Search engines favor contextual depth and semantic variety over high repetitive percentages.",
    },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://toolnotch.com";

  const hubDescription =
    locale === "pt"
      ? "Conjunto completo de ferramentas de escrita e análise de texto: contador de palavras e caracteres com limites sociais, verificador de legibilidade Flesch, calculadora de tempo de leitura com Speed Reader e densidade de palavras-chave para SEO. 100% no navegador."
      : locale === "es"
        ? "Conjunto completo de herramientas de escritura y análisis de texto: contador de palabras y caracteres con límites sociales, verificador de legibilidad Flesch, calculadora de tiempo de lectura con Speed Reader y densidad de palabras clave para SEO. 100% en el navegador."
        : "Complete suite of text analysis and writing tools: word counter, character counter with social media limits, Flesch readability checker, reading time calculator with Speed Reader, and SEO keyword density analyzer. 100% in-browser.";

  const jsonLd = buildJsonLd(
    webAppSchema(
      locale === "pt"
        ? "Ferramentas de Texto Gratuitas"
        : locale === "es"
          ? "Herramientas de Texto Gratuitas"
          : "Free Online Text Tools",
      PATH,
      hubDescription,
      locale,
      "UtilitiesApplication",
    ),
    {
      "@type": "ItemList",
      name:
        locale === "pt"
          ? "Ferramentas de Análise de Texto"
          : locale === "es"
            ? "Herramientas de Análisis de Texto"
            : "Text Analysis Tools",
      itemListElement: tools.map((tool, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: tool.title,
        description: tool.desc,
        url: `${baseUrl}${tool.href}`,
      })),
    },
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: textLabel, url: buildLocalizedUrl(PATH, locale) },
    ]),
    faqSchema(faqs),
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
              { label: textLabel, current: true },
            ]}
          />
        </div>

        <header className="mb-6 sm:mb-8 md:mb-10 pt-1 sm:pt-2 pb-4 sm:pb-6 border-b border-border/80">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
            {locale === "pt"
              ? "Ferramentas de Texto Gratuitas"
              : locale === "es"
                ? "Herramientas de Texto Gratuitas"
                : "Free Text Tools"}
          </h1>
          <p className="leading-relaxed text-label mt-2 max-w-3xl text-sm font-mono">
            {locale === "pt"
              ? "Contadores de palavras e caracteres, avaliadores de legibilidade, estimativas de leitura com Speed Reader e otimização de densidade de palavras-chave. Rápidas, privadas e executadas 100% no seu navegador."
              : locale === "es"
                ? "Contadores de palabras y caracteres, análisis de legibilidad, cálculo de tiempo de lectura con Speed Reader y optimización de palabras clave. Rápidas, privadas e executadas 100% en tu navegador."
                : "Word and character counters, readability evaluators, reading time estimation with Speed Reader, and keyword density optimization. Fast, private, and running 100% client-side in your browser."}
          </p>
        </header>

        <section aria-label="Ferramentas de Texto" className="mb-10 sm:mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {tools.map((tool, idx) => {
              const isHero = idx === 0;
              return (
                <Link
                  key={idx}
                  href={tool.href}
                  className={`group block select-none ${
                    isHero ? "md:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  <div className="h-full p-4 sm:p-5 bg-tertiary dark:bg-background border border-border rounded-[2px] group-hover:border-foreground/40 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h2 className="text-sm font-bold uppercase text-foreground font-mono group-hover:text-foreground transition-colors">
                          {tool.title}
                        </h2>

                        <ArrowUpRight className="w-4 h-4 text-label/60 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                      </div>

                      <p className="text-sm text-label leading-relaxed font-mono">
                        {tool.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center gap-1.5 font-mono text-xs">
                      {tool.specs.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-[2px] bg-background dark:bg-foreground/[0.04] text-label font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="guide-heading" className="mb-10 sm:mb-14 w-full">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2
              id="guide-heading"
              className="text-sm font-bold uppercase text-foreground font-mono"
            >
              {locale === "pt"
                ? "Diretrizes de Escrita & Boas Práticas"
                : locale === "es"
                  ? "Directrices de Escritura y Buenas Prácticas"
                  : "Writing Guidelines & Best Practices"}
            </h2>
            <span className="text-xs font-mono text-label hidden sm:inline">
              {locale === "pt"
                ? "Dicas Técnicas"
                : locale === "es"
                  ? "Consejos Técnicos"
                  : "Technical Tips"}
            </span>
          </div>

          <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {guides.map((item, idx) => (
              <div key={idx} className="p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs font-bold text-label mb-1.5">
                    {`0${idx + 1}`}
                  </div>
                  <h3 className="text-sm font-mono font-bold uppercase text-foreground mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm font-mono text-label leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="faqs-heading" className="mb-10 sm:mb-14 w-full">
          <h2
            id="faqs-heading"
            className="text-base font-bold uppercase text-foreground font-mono mb-3 sm:mb-4"
          >
            {locale === "pt"
              ? "Perguntas Frequentes"
              : locale === "es"
                ? "Preguntas Frecuentes"
                : "Frequently Asked Questions"}
          </h2>
          <AppAccordion
            groups={faqs.map((faq, index) => ({
              id: `text-hub-faq-${index}`,
              name: faq.question,
              content: (
                <p className="leading-relaxed text-label font-mono text-sm">
                  {faq.answer}
                </p>
              ),
            }))}
          />
        </section>
      </div>
    </main>
  );
}
