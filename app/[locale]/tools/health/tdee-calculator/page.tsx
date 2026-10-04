import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
import AppTdeeCalculator from "@/components/health/AppTdeeCalculator";
import HealthToolHeader from "../components/HealthToolHeader";
import HealthToolContent, {
  type RichContent,
} from "../components/HealthToolContent";

const PATH = "/tools/health/tdee-calculator";

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
          "calculadora de tdee",
          "gasto energetico total diario",
          "calculadora de calorias diarias",
          "como calcular tdee",
          "taxa metabolica basal tmb",
          "mifflin st jeor",
          "calorias para manter o peso",
          "tdee calculator",
        ]
      : locale === "es"
        ? [
            "calculadora de tdee",
            "gasto energetico diario total",
            "calculadora de calorias diarias",
            "como calcular el tdee",
            "tasa metabolica basal tmb",
            "formula mifflin st jeor",
            "calorias para mantenimiento",
            "tdee calculator espanol",
          ]
        : [
            "tdee calculator",
            "total daily energy expenditure",
            "daily calorie needs calculator",
            "how to calculate tdee",
            "basal metabolic rate bmr",
            "mifflin st jeor equation",
            "maintenance calories calculator",
            "calorie burn calculator",
          ];

  return {
    title: t("tdeeMetaTitle"),
    description: t("tdeeMetaDescription"),
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
      title: `${t("tdeeTitle")} | ToolNotch`,
      description: t("tdeeMetaDescription"),
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("tdeeTitle")} | ToolNotch`,
      description: t("tdeeMetaDescription"),
    },
    category: "health",
  };
}

export default async function TdeeCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "healthCalculator" });
  const faqs = (t.raw("tdeeFaqs") as FaqItem[]) || [];
  const richContent = (t.raw("tdeeRichContent") as RichContent) || {};

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
      ? howToSchema(t("tdeeTitle"), howToSteps)
      : null;

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: healthLabel, url: localizedPath("/tools/health", locale) },
      { name: t("tdeeTitle"), url: localizedUrl },
    ]),
    webAppSchema(
      t("tdeeTitle"),
      PATH,
      t("tdeeMetaDescription"),
      locale,
      "HealthApplication"
    ),
    faqSchema(faqs),
    ...(howToJsonLd ? [howToJsonLd] : [])
  );

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full">
        <HealthToolHeader
          title={t("tdeeTitle")}
          description={t("tdeeDescription")}
          locale={locale}
        />

        <section aria-label={t("tdeeTitle")} className="w-full">
          <AppTdeeCalculator mode="maintain" locale={locale} />
        </section>

        <HealthToolContent
          currentToolSlug="tdee-calculator"
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}
