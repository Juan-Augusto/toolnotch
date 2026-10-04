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
import AppBrGradeConversionTable, {
  type GradeConversionRow,
  type GradeConversionColumns,
} from "@/components/education/AppBrGradeConversionTable";
import EducationToolHeader from "../components/EducationToolHeader";
import EducationToolContent, {
  type RichContent,
} from "../components/EducationToolContent";
import { BLOG_SLUG_GROUPS, type BlogLocale } from "@/data/blog/slugTranslations";

const PATH = "/tools/education/gpa-calculator";

interface HowTo {
  name: string;
  steps: string[];
}

interface BrConversion {
  heading: string;
  intro: string;
  columns: GradeConversionColumns;
  rows: GradeConversionRow[];
  disclaimer: string;
  exampleHeading: string;
  exampleBody: string;
  ctaLabel: string;
}

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
          "calculadora de gpa",
          "como calcular gpa",
          "converter nota para gpa",
          "gpa 4.0 escala",
          "calculadora de media universitaria",
          "media semestral gpa",
          "gpa calculator",
          "conversao notas brasil eua",
        ]
      : locale === "es"
        ? [
            "calculadora de gpa",
            "como calcular el gpa",
            "convertir calificaciones a gpa",
            "promedio ponderado escolar",
            "calculadora de promedio universitario",
            "escala gpa 4.0",
            "gpa calculator espanol",
          ]
        : [
            "gpa calculator",
            "college gpa calculator",
            "how to calculate gpa",
            "semester gpa calculator",
            "4.0 gpa scale",
            "high school gpa calculator",
            "credit weighted gpa",
            "grade point average calculator",
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
    category: "education",
  };
}

export default async function GpaCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gpaCalculator" });
  const faqs = (t.raw("faqs") as FaqItem[]) || [];
  const richContent = (t.raw("richContent") as RichContent) || {};
  const howTo = (t.raw("howTo") as HowTo) || { name: "", steps: [] };
  const brConversion = (t.raw("brConversion") as BrConversion) || null;

  const guideSlug =
    BLOG_SLUG_GROUPS["gpa-brazilian-grades"][locale as BlogLocale] ??
    BLOG_SLUG_GROUPS["gpa-brazilian-grades"].en;
  const guideHref = localizedPath(`/blog/${guideSlug}`, locale);

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const educationLabel =
    locale === "pt" ? "Educação" : locale === "es" ? "Educación" : "Education";
  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const howToSteps = Array.isArray(howTo?.steps)
    ? howTo.steps.filter((s) => typeof s === "string" && s.trim().length > 0)
    : [];

  const howToJsonLd =
    howToSteps.length >= 2
      ? howToSchema(howTo.name || t("title"), howToSteps)
      : null;

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: educationLabel, url: localizedPath("/tools/education", locale) },
      { name: t("title"), url: localizedUrl },
    ]),
    webAppSchema(
      t("title"),
      PATH,
      t("metaDescription"),
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
          title={t("title")}
          description={t("description")}
          locale={locale}
        />

        <section aria-label={t("title")} className="w-full">
          <AppGpaCalculator mode="semester" locale={locale} />
        </section>

        <EducationToolContent
          currentToolSlug="gpa-calculator"
          richContent={richContent}
          faqs={faqs}
          locale={locale}
          extraContent={
            brConversion && (
              <AppBrGradeConversionTable
                heading={brConversion.heading}
                intro={brConversion.intro}
                columns={brConversion.columns}
                rows={brConversion.rows}
                disclaimer={brConversion.disclaimer}
                exampleHeading={brConversion.exampleHeading}
                exampleBody={brConversion.exampleBody}
                ctaLabel={brConversion.ctaLabel}
                ctaHref={guideHref}
              />
            )
          }
        />
      </div>
    </main>
  );
}
