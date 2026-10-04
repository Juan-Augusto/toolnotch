import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, Calculator, Award, BookOpen } from "lucide-react";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  webAppSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import { AppBreadcrumb, AppCard } from "@/components/ui";

const PATH = "/tools/education";

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
      ? "Ferramentas Educacionais Online Gratuitas: Calculadoras de GPA e Citações | ToolNotch"
      : locale === "es"
        ? "Herramientas Educativas Online Gratuitas: Calculadoras de GPA y Citas | ToolNotch"
        : "Free Online Educational Tools: GPA Calculators & Citation Maker | ToolNotch";

  const description =
    locale === "pt"
      ? "Conjunto gratuito de ferramentas acadêmicas: calculadora de GPA semestral e acumulado nas escalas 4.0, 20 e 10, cálculo de nota para passar e gerador de citações ABNT, APA e MLA. 100% no navegador."
      : locale === "es"
        ? "Suite gratuita de herramientas académicas: calculadora de GPA semestral y acumulado en escalas 4.0, 20 y 10, cálculo de nota final y generador de citas APA, MLA y Chicago. 100% en el navegador."
        : "Complete suite of free academic tools: semester and cumulative GPA calculators across 4.0, 20, and 10 scales, final grade calculator, and APA, MLA & Chicago citation generator. 100% in-browser.";

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

export default async function EducationToolsHubPage({ params }: Props) {
  const { locale } = await params;
  const prefix = locale === "en" ? "" : `/${locale}`;

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const educationLabel =
    locale === "pt" ? "Educação" : locale === "es" ? "Educación" : "Education";

  const tools = [
    {
      href: `${prefix}/tools/education/gpa-calculator`,
      title:
        locale === "pt"
          ? "Calculadora de GPA"
          : locale === "es"
            ? "Calculadora de GPA"
            : "GPA Calculator",
      desc:
        locale === "pt"
          ? "Calcule seu GPA semestral ponderado por créditos com suporte às escalas americana (4.0), portuguesa (0–20) e espanhola (0–10)."
          : locale === "es"
            ? "Calcula tu GPA semestral ponderado por créditos con soporte para escalas de EE. UU. (4.0), Portugal (0–20) y España (0–10)."
            : "Calculate your credit-weighted semester GPA with support for US (4.0), Portuguese (0–20), and Spanish (0–10) scales.",
      specs:
        locale === "pt"
          ? ["Escala 4.0 / 20 / 10", "Ponderação por Créditos", "Tabela de Conversão BR"]
          : locale === "es"
            ? ["Escala 4.0 / 20 / 10", "Ponderación por Créditos", "Conversión Internacional"]
            : ["4.0 / 20 / 10 Scales", "Credit Weighted", "Grade Conversion"],
      icon: <GraduationCap className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/education/cumulative-gpa-calculator`,
      title:
        locale === "pt"
          ? "Calculadora de GPA Acumulado"
          : locale === "es"
            ? "Calculadora de GPA Acumulado"
            : "Cumulative GPA Calculator",
      desc:
        locale === "pt"
          ? "Projete sua média geral acumulada combinando seus créditos e GPA anteriores com as novas notas do semestre atual."
          : locale === "es"
            ? "Proyecta tu promedio general acumulado combinando tus créditos y GPA previos con las nuevas calificaciones del semestre."
            : "Project your overall cumulative average by combining prior GPA and credit hours with new semester grades.",
      specs:
        locale === "pt"
          ? ["Projeção Futura", "Créditos Históricos", "Cálculo Imediato"]
          : locale === "es"
            ? ["Proyección Futura", "Créditos Previos", "Cálculo Inmediato"]
            : ["Future Projection", "Prior Credits", "Instant Math"],
      icon: <Calculator className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/education/grade-calculator`,
      title:
        locale === "pt"
          ? "Calculadora de Nota Necessária"
          : locale === "es"
            ? "Calculadora de Nota Necesaria"
            : "Grade Calculator",
      desc:
        locale === "pt"
          ? "Descubra com precisão matemática a nota exata que você precisa obter no exame final para atingir sua meta de aprovação."
          : locale === "es"
            ? "Descubre con precisión matemática la calificación exacta que necesitas en el examen final para alcanzar tu meta de aprobación."
            : "Calculate the exact score needed on your final exam or coursework to secure your target passing grade.",
      specs:
        locale === "pt"
          ? ["Ponderação Percentual", "Meta de Aprovação", "Diagnóstico de Status"]
          : locale === "es"
            ? ["Ponderación Porcentual", "Meta de Aprobación", "Diagnóstico de Estado"]
            : ["Percentage Weighting", "Target Goal", "Status Diagnostic"],
      icon: <Award className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/education/citation-generator`,
      title:
        locale === "pt"
          ? "Gerador de Citações ABNT & APA"
          : locale === "es"
            ? "Generador de Citas APA & MLA"
            : "Citation Generator",
      desc:
        locale === "pt"
          ? "Gere referências bibliográficas automáticas e confiáveis para livros, sites, artigos e vídeos em conformidade com as normas ABNT, APA e MLA."
          : locale === "es"
            ? "Genera referencias bibliográficas automáticas y confiables para libros, sitios web, revistas y videos en estilos APA, MLA y Chicago."
            : "Generate reliable academic references for books, websites, journal articles, and videos in APA, MLA, and Chicago styles.",
      specs:
        locale === "pt"
          ? ["ABNT NBR 6023", "APA 7th & MLA 9th", "Múltiplos Autores"]
          : locale === "es"
            ? ["Estilo APA 7", "MLA 9 y Chicago", "Múltiples Autores"]
            : ["APA 7th Edition", "MLA 9th & Chicago", "Multiple Authors"],
      icon: <BookOpen className="w-5 h-5 text-secondary shrink-0" />,
    },
  ];

  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: educationLabel, url: localizedUrl },
    ]),
    webAppSchema(
      educationLabel,
      PATH,
      locale === "pt"
        ? "Ferramentas acadêmicas gratuitas: calculadoras de GPA e gerador de citações."
        : locale === "es"
          ? "Herramientas académicas gratuitas: calculadoras de GPA y generador de citas."
          : "Free academic tools: GPA calculators and citation generator.",
      locale,
      "EducationalApplication",
    ),
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
              { label: educationLabel, current: true },
            ]}
          />
        </div>

        <header className="mb-6 sm:mb-8 pt-1 sm:pt-2 pb-3.5 sm:pb-5 border-b border-border/80">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono break-words">
            {locale === "pt"
              ? "Ferramentas Educacionais & Acadêmicas"
              : locale === "es"
                ? "Herramientas Educativas y Académicas"
                : "Educational & Academic Tools"}
          </h1>
          <p className="leading-relaxed text-label mt-1.5 sm:mt-2 max-w-3xl text-xs sm:text-sm">
            {locale === "pt"
              ? "Calculadoras de desempenho acadêmico e gerador de citações bibliográficas. Ferramentas rápidas, precisas e executadas 100% no seu navegador sem envio de dados a servidores."
              : locale === "es"
                ? "Calculadoras de rendimiento académico y generador de citas bibliográficas. Herramientas rápidas, precisas y ejecutadas 100% en tu navegador sin envío de datos a servidores."
                : "Academic performance calculators and citation generator. Fast, accurate, and executed 100% in your browser with complete privacy."}
          </p>
        </header>

        <section aria-label="Education Tools" className="mb-10 sm:mb-14">
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
                      <h2 className="text-sm sm:text-base font-bold text-foreground font-mono group-hover:text-secondary transition-colors">
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
