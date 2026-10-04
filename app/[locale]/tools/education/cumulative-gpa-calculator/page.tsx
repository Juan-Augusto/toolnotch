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
import AppGpaCalculator from "@/components/education/AppGpaCalculator";
import EducationToolHeader from "../components/EducationToolHeader";
import EducationToolContent, {
  type RichContent,
} from "../components/EducationToolContent";

const PATH = "/tools/education/cumulative-gpa-calculator";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gpaCalculator" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywords =
    locale === "pt"
      ? [
          "calculadora de gpa acumulado",
          "gpa acumulado",
          "como calcular gpa acumulado",
          "media acumulada faculdade",
          "previsao de gpa",
          "adicionar novo semestre gpa",
        ]
      : locale === "es"
        ? [
            "calculadora de gpa acumulado",
            "promedio acumulado",
            "calcular promedio acumulado universidad",
            "proyectar gpa",
            "promedio ponderado acumulado",
          ]
        : [
            "cumulative gpa calculator",
            "calculate cumulative gpa",
            "overall gpa calculator",
            "projected gpa",
            "college cumulative grade point average",
            "add new semester gpa",
          ];

  return {
    title: t("cumulativeMetaTitle"),
    description: t("cumulativeMetaDescription"),
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
      title: `${t("cumulativeTitle")} | ToolNotch`,
      description: t("cumulativeMetaDescription"),
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("cumulativeTitle")} | ToolNotch`,
      description: t("cumulativeMetaDescription"),
    },
    category: "education",
  };
}

export default async function CumulativeGpaCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gpaCalculator" });
  const faqs = (t.raw("faqs") as FaqItem[]) || [];
  const richContent = (t.raw("richContent") as RichContent) || {};

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const educationLabel =
    locale === "pt" ? "Educação" : locale === "es" ? "Educación" : "Education";
  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const howToSteps = Array.isArray(richContent?.howToUse)
    ? richContent.howToUse.filter(
        (s) => typeof s === "string" && s.trim().length > 0,
      )
    : [];

  const howToJsonLd =
    howToSteps.length >= 2 ? howToSchema(t("cumulativeTitle"), howToSteps) : null;

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: educationLabel, url: localizedPath("/tools/education", locale) },
      { name: t("cumulativeTitle"), url: localizedUrl },
    ]),
    webAppSchema(
      t("cumulativeTitle"),
      PATH,
      t("cumulativeMetaDescription"),
      locale,
      "EducationalApplication",
    ),
    faqSchema(faqs),
    ...(howToJsonLd ? [howToJsonLd] : []),
  );

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full">
        <EducationToolHeader
          title={t("cumulativeTitle")}
          description={t("cumulativeDescription")}
          locale={locale}
        />

        <section aria-label={t("cumulativeTitle")} className="w-full">
          <AppGpaCalculator mode="cumulative" locale={locale} />
        </section>

        <EducationToolContent
          currentToolSlug="cumulative-gpa-calculator"
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}
