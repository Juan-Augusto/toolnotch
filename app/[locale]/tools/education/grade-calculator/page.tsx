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
import AppGradeCalculator from "@/components/education/AppGradeCalculator";
import EducationToolHeader from "../components/EducationToolHeader";
import EducationToolContent, {
  type RichContent,
} from "../components/EducationToolContent";

const PATH = "/tools/education/grade-calculator";

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
          "calculadora de nota",
          "que nota preciso para passar",
          "calculadora de nota final",
          "calcular nota do exame final",
          "media de aprovacao",
          "calculo de nota restante",
        ]
      : locale === "es"
        ? [
            "calculadora de notas",
            "que nota necesito para aprobar",
            "calculadora de examen final",
            "calcular calificacion necesaria",
            "promedio para aprobar examen",
          ]
        : [
            "grade calculator",
            "final exam grade calculator",
            "what grade do i need to pass",
            "class grade calculator",
            "weighted grade calculator",
            "test score calculator",
          ];

  return {
    title: t("gradeMetaTitle"),
    description: t("gradeMetaDescription"),
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
      title: `${t("gradeTitle")} | ToolNotch`,
      description: t("gradeMetaDescription"),
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("gradeTitle")} | ToolNotch`,
      description: t("gradeMetaDescription"),
    },
    category: "education",
  };
}

export default async function GradeCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gpaCalculator" });
  const faqs = (t.raw("faqs") as FaqItem[]) || [];
  const richContent = (t.raw("gradeRichContent") as RichContent) || {};

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
    howToSteps.length >= 2 ? howToSchema(t("gradeTitle"), howToSteps) : null;

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: educationLabel, url: localizedPath("/tools/education", locale) },
      { name: t("gradeTitle"), url: localizedUrl },
    ]),
    webAppSchema(
      t("gradeTitle"),
      PATH,
      t("gradeMetaDescription"),
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
          title={t("gradeTitle")}
          description={t("gradeDescription")}
          locale={locale}
        />

        <section aria-label={t("gradeTitle")} className="w-full">
          <AppGradeCalculator locale={locale} />
        </section>

        <EducationToolContent
          currentToolSlug="grade-calculator"
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}
