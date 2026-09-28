import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Scale, Flame, TrendingDown } from "lucide-react";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  webAppSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import { AppBreadcrumb, AppCard } from "@/components/ui";

const PATH = "/tools/health";

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
      ? "Ferramentas de Saúde & Fitness Online Gratuitas: IMC, TDEE e Déficit | ToolNotch"
      : locale === "es"
        ? "Herramientas de Salud & Fitness Online Gratuitas: IMC, TDEE y Déficit | ToolNotch"
        : "Free Online Health & Fitness Tools: BMI, TDEE & Calorie Deficit | ToolNotch";

  const description =
    locale === "pt"
      ? "Conjunto gratuito de calculadoras de saúde: cálculo de IMC com faixa de peso ideal da OMS, estimativa de gasto calórico TDEE (Mifflin-St Jeor) e planejador de déficit calórico para emagrecimento sustentável. 100% no navegador."
      : locale === "es"
        ? "Suite gratuita de herramientas de salud: cálculo de IMC con rango saludable OMS, gasto energético diario TDEE (Mifflin-St Jeor) y planificador de déficit calórico para perder peso de forma segura. 100% en el navegador."
        : "Complete suite of free health tools: WHO BMI calculator with ideal weight range, TDEE daily calorie expenditure (Mifflin-St Jeor), and calorie deficit planner for sustainable weight management. 100% in-browser.";

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

export default async function HealthToolsHubPage({ params }: Props) {
  const { locale } = await params;
  const prefix = locale === "en" ? "" : `/${locale}`;

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const healthLabel =
    locale === "pt" ? "Saúde & Fitness" : locale === "es" ? "Salud & Fitness" : "Health & Fitness";

  const tools = [
    {
      href: `${prefix}/tools/health/bmi-calculator`,
      title:
        locale === "pt"
          ? "Calculadora de IMC"
          : locale === "es"
            ? "Calculadora de IMC"
            : "BMI Calculator",
      desc:
        locale === "pt"
          ? "Descubra seu Índice de Massa Corporal com indicador visual de faixas da OMS e cálculo do peso ideal para sua altura."
          : locale === "es"
            ? "Calcula tu Índice de Masa Corporal con indicador visual de rangos OMS y peso saludable según tu estatura."
            : "Determine your Body Mass Index with WHO classification gauge and healthy weight range for your height.",
      specs:
        locale === "pt"
          ? ["Métrico e Imperial", "Faixa de Peso Saudável", "Diretrizes OMS"]
          : locale === "es"
            ? ["Métrico e Imperial", "Rango de Peso Saludable", "Criterios OMS"]
            : ["Metric & Imperial", "Ideal Weight Range", "WHO Guidelines"],
      icon: <Scale className="w-5 h-5 text-primary" />,
    },
    {
      href: `${prefix}/tools/health/tdee-calculator`,
      title:
        locale === "pt"
          ? "Calculadora de TDEE (Gasto Diário)"
          : locale === "es"
            ? "Calculadora de TDEE (Gasto Diario)"
            : "TDEE Calculator",
      desc:
        locale === "pt"
          ? "Calcule seu gasto energético total diário com a equação de Mifflin-St Jeor e descubra quantas calorias queima por dia."
          : locale === "es"
            ? "Calcula tu gasto energético diario total con la fórmula Mifflin-St Jeor y conoce tus necesidades calóricas reales."
            : "Calculate total daily energy expenditure using the Mifflin-St Jeor equation and your physical activity level.",
      specs:
        locale === "pt"
          ? ["Fórmula Mifflin-St Jeor", "5 Níveis de Atividade", "TMB + Gasto Total"]
          : locale === "es"
            ? ["Fórmula Mifflin-St Jeor", "5 Niveles de Actividad", "TMB + Gasto Total"]
            : ["Mifflin-St Jeor Formula", "5 Activity Tiers", "BMR + Total Burn"],
      icon: <Flame className="w-5 h-5 text-primary" />,
    },
    {
      href: `${prefix}/tools/health/calorie-deficit-calculator`,
      title:
        locale === "pt"
          ? "Calculadora de Déficit Calórico"
          : locale === "es"
            ? "Calculadora de Déficit Calórico"
            : "Calorie Deficit Calculator",
      desc:
        locale === "pt"
          ? "Defina uma meta calórica diária segura para perda de gordura sustentável sem colocar em risco sua massa muscular."
          : locale === "es"
            ? "Establece una meta calórica diaria segura para perder grasa corporal de manera constante y sin efecto rebote."
            : "Plan an optimal, sustainable daily caloric deficit for gradual fat loss while preserving lean body mass.",
      specs:
        locale === "pt"
          ? ["Déficit Moderado ou Agressivo", "Previsão Semanal de Peso", "Preservação Muscular"]
          : locale === "es"
            ? ["Déficit Moderado o Rápido", "Proyección Semanal de Peso", "Preservación Muscular"]
            : ["Moderate or Aggressive Deficit", "Weekly Weight Projection", "Muscle Preservation"],
      icon: <TrendingDown className="w-5 h-5 text-primary" />,
    },
  ];

  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: healthLabel, url: localizedUrl },
    ]),
    webAppSchema(
      healthLabel,
      PATH,
      locale === "pt"
        ? "Ferramentas gratuitas de saúde e nutrição: calculadoras de IMC, TDEE e déficit calórico."
        : locale === "es"
          ? "Herramientas gratuitas de salud y nutrición: calculadoras de IMC, TDEE y déficit calórico."
          : "Free health and nutrition tools: BMI, TDEE, and calorie deficit calculators.",
      locale,
      "HealthApplication"
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
              { label: healthLabel, current: true },
            ]}
          />
        </div>

        <header className="mb-6 sm:mb-8 pt-1 sm:pt-2 pb-3.5 sm:pb-5 border-b border-border/80">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono break-words">
            {locale === "pt"
              ? "Ferramentas de Saúde & Fitness"
              : locale === "es"
                ? "Herramientas de Salud & Fitness"
                : "Health & Fitness Tools"}
          </h1>
          <p className="leading-relaxed text-label mt-1.5 sm:mt-2 max-w-3xl text-xs sm:text-sm">
            {locale === "pt"
              ? "Calculadoras corporais, nutricionais e de gasto calórico baseadas em equações científicas validadas. Ferramentas rápidas, privadas e executadas 100% no seu navegador."
              : locale === "es"
                ? "Calculadoras corporales, nutricionales y de gasto energético basadas en ecuaciones científicas validadas. Herramientas rápidas y privadas ejecutadas 100% en tu navegador."
                : "Body composition, nutritional, and energy expenditure calculators based on validated scientific formulas. Fast, private, and calculated 100% in your browser."}
          </p>
        </header>

        <section aria-label="Health Tools" className="mb-10 sm:mb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group block h-full">
                <AppCard
                  border
                  cornerAccents
                  className="p-5 sm:p-6 bg-tertiary group-hover:border-primary/60 transition-colors h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        {tool.icon}
                        <h2 className="text-base sm:text-lg font-bold text-foreground font-mono group-hover:text-primary transition-colors">
                          {tool.title}
                        </h2>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-label group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <p className="text-xs sm:text-sm text-label leading-relaxed mb-4">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/60">
                    {tool.specs.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[11px] font-mono bg-background border border-border rounded-[2px] text-label"
                      >
                        {spec}
                      </span>
                    ))}
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
