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
import MathToolHeader from "../components/MathToolHeader";
import MathToolContent, {
  type RichContent,
} from "../components/MathToolContent";
import AppAgeCalculator from "@/components/math/AppAgeCalculator";

const PATH = "/tools/math/age-calculator";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ageCalculator" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywords =
    locale === "pt"
      ? [
          "calculadora de idade",
          "quantos anos eu tenho",
          "calcular idade exata",
          "calcular data de nascimento",
          "dias vividos",
          "proximo aniversario",
          "idade futura",
          "calculadora de anos",
        ]
      : locale === "es"
        ? [
            "calculadora de edad",
            "cuantos anos tengo",
            "calcular edad exacta",
            "calcular fecha de nacimiento",
            "dias vividos",
            "proximo cumpleanos",
            "edad futura",
            "calculadora de fecha",
          ]
        : [
            "age calculator",
            "how old am i",
            "calculate exact age",
            "date of birth calculator",
            "days lived",
            "next birthday countdown",
            "future age calculator",
            "chronological age calculator",
          ];

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
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
      title: `${t("title")} | ToolNotch`,
      description: t("metaDescription"),
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | ToolNotch`,
      description: t("metaDescription"),
    },
    category: "math",
  };
}

export default async function AgeCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ageCalculator" });
  const faqs = (t.raw("faqs") as FaqItem[]) || [];
  const richContent = (t.raw("richContent") as RichContent) || {};

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const mathLabel =
    locale === "pt"
      ? "Matemática & Cálculos"
      : locale === "es"
        ? "Matemáticas & Cálculos"
        : "Math & Calculations";
  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const howToSteps = Array.isArray(richContent.howToUse)
    ? richContent.howToUse.filter(
        (s) => typeof s === "string" && s.trim().length > 0,
      )
    : [];

  const howToJsonLd =
    howToSteps.length >= 2 ? howToSchema(t("title"), howToSteps) : null;

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: mathLabel, url: localizedPath("/tools", locale) },
      { name: t("title"), url: localizedUrl },
    ]),
    webAppSchema(
      t("title"),
      PATH,
      t("metaDescription"),
      locale,
      "WebApplication",
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
        <MathToolHeader
          title={t("title")}
          description={t("description")}
          locale={locale}
        />

        <section aria-label={t("title")} className="w-full">
          <AppAgeCalculator locale={locale} />
        </section>

        <MathToolContent
          currentToolSlug="age-calculator"
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}
