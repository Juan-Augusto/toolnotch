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

const PATH = "/tools/health/calorie-deficit-calculator";

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
          "calculadora de deficit calorico",
          "como calcular deficit calorico",
          "quantas calorias para emagrecer",
          "perder gordura corporal",
          "deficit calorico seguro",
          "calculadora de calorias para secar",
          "emagrecimento saudavel",
          "calorie deficit calculator",
        ]
      : locale === "es"
        ? [
            "calculadora de deficit calorico",
            "como calcular el deficit calorico",
            "cuantas calorias comer para adelgazar",
            "perder grasa corporal",
            "deficit calorico seguro",
            "calculadora para bajar de peso",
            "calorie deficit calculator espanol",
          ]
        : [
            "calorie deficit calculator",
            "how to calculate calorie deficit",
            "calories to lose weight calculator",
            "safe calorie deficit for fat loss",
            "weight loss calorie target",
            "daily caloric deficit planner",
            "fat loss calculator",
          ];

  return {
    title: t("deficitMetaTitle"),
    description: t("deficitMetaDescription"),
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
      title: `${t("deficitTitle")} | ToolNotch`,
      description: t("deficitMetaDescription"),
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("deficitTitle")} | ToolNotch`,
      description: t("deficitMetaDescription"),
    },
    category: "health",
  };
}

export default async function CalorieDeficitCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "healthCalculator" });
  const faqs = (t.raw("tdeeFaqs") as FaqItem[]) || [];
  const richContent = (t.raw("deficitRichContent") as RichContent) || {};

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
      ? howToSchema(t("deficitTitle"), howToSteps)
      : null;

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: healthLabel, url: localizedPath("/tools/health", locale) },
      { name: t("deficitTitle"), url: localizedUrl },
    ]),
    webAppSchema(
      t("deficitTitle"),
      PATH,
      t("deficitMetaDescription"),
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
          title={t("deficitTitle")}
          description={t("deficitDescription")}
          locale={locale}
        />

        <section aria-label={t("deficitTitle")} className="w-full">
          <AppTdeeCalculator mode="deficit" locale={locale} />
        </section>

        <HealthToolContent
          currentToolSlug="calorie-deficit-calculator"
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}
