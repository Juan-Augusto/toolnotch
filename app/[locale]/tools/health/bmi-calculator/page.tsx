import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, BookOpen } from "lucide-react";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  webAppSchema,
  faqSchema,
  howToSchema,
  breadcrumbSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import type { FaqItem } from "@/components/AppFaqSection";
import AppBmiCalculator from "@/components/health/AppBmiCalculator";
import HealthToolHeader from "../components/HealthToolHeader";
import HealthToolContent, {
  type RichContent,
} from "../components/HealthToolContent";

const PATH = "/tools/health/bmi-calculator";

interface HowTo {
  name?: string;
  steps?: string[];
}

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "healthCalculator" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywords =
    locale === "pt"
      ? [
          "calculadora de imc",
          "como calcular imc",
          "tabela de imc oms",
          "indice de massa corporal",
          "peso ideal",
          "calculo peso ideal altura",
          "faixa de peso saudavel",
          "bmi calculator",
        ]
      : locale === "es"
        ? [
            "calculadora de imc",
            "como calcular el imc",
            "indice de masa corporal",
            "peso ideal segun estatura",
            "tabla imc oms",
            "rango de peso saludable",
            "bmi calculator espanol",
          ]
        : [
            "bmi calculator",
            "how to calculate bmi",
            "body mass index calculator",
            "ideal weight calculator",
            "who bmi categories",
            "healthy weight range",
            "metric bmi calculator",
            "imperial bmi calculator",
          ];

  return {
    title: t("bmiMetaTitle"),
    description: t("bmiMetaDescription"),
    keywords,
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
      title: `${t("bmiTitle")} | ToolNotch`,
      description: t("bmiMetaDescription"),
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("bmiTitle")} | ToolNotch`,
      description: t("bmiMetaDescription"),
    },
    category: "health",
  };
}

export default async function BmiCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "healthCalculator" });
  const faqs = (t.raw("bmiFaqs") as FaqItem[]) || [];
  const richContent = (t.raw("bmiRichContent") as RichContent) || {};

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const healthLabel =
    locale === "pt" ? "Saúde & Fitness" : locale === "es" ? "Salud & Fitness" : "Health & Fitness";
  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const howToSteps = Array.isArray(richContent.howToUse)
    ? richContent.howToUse.filter((s) => typeof s === "string" && s.trim().length > 0)
    : [];

  const howToJsonLd =
    howToSteps.length >= 2
      ? howToSchema(t("bmiTitle"), howToSteps)
      : null;

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: healthLabel, url: localizedPath("/tools/health", locale) },
      { name: t("bmiTitle"), url: localizedUrl },
    ]),
    webAppSchema(
      t("bmiTitle"),
      PATH,
      t("bmiMetaDescription"),
      locale,
      "HealthApplication"
    ),
    faqSchema(faqs),
    ...(howToJsonLd ? [howToJsonLd] : [])
  );

  const blogHref = localizedPath("/blog/bmi-vs-body-fat-percentage", locale);
  const blogLinkText =
    locale === "pt"
      ? "Artigo: IMC vs Percentual de Gordura Corporal: Qual a Diferença?"
      : locale === "es"
        ? "Artículo: IMC vs Porcentaje de Grasa Corporal: ¿Cuál es la Diferencia?"
        : "Article: BMI vs Body Fat Percentage: What is the Difference?";

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full">
        <HealthToolHeader
          title={t("bmiTitle")}
          description={t("bmiDescription")}
          locale={locale}
        />

        <section aria-label={t("bmiTitle")} className="w-full">
          <AppBmiCalculator locale={locale} />
        </section>

        <HealthToolContent
          currentToolSlug="bmi-calculator"
          richContent={richContent}
          faqs={faqs}
          locale={locale}
          extraContent={
            <div className="p-3 sm:p-4 bg-tertiary border border-border rounded-[2px] flex items-center justify-between gap-3 font-mono">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs sm:text-sm text-foreground">
                  {blogLinkText}
                </span>
              </div>
              <Link
                href={blogHref}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
              >
                <span>
                  {locale === "pt" ? "Ler guia" : locale === "es" ? "Leer guía" : "Read guide"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          }
        />
      </div>
    </main>
  );
}
