import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternatesForLocale } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  faqSchema,
  buildLocalizedUrl,
  type FaqItem,
} from "@/lib/schema";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import AppInterviewHub from "@/components/interview/AppInterviewHub";
import AppInterviewDepth from "@/components/interview/AppInterviewDepth";
import { INTERVIEW_QUIZZES_DATA } from "@/components/interview/interviewHubConfig";

const PATH = "/interview";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "interview.hub" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternatesForLocale(PATH, locale),
    keywords: [
      "software engineer interview prep",
      "technical interview questions",
      "TypeScript interview quiz",
      "database design interview",
      "Kafka vs RabbitMQ interview",
      "system architecture interview",
      "Node.js interview questions",
      "Vue.js interview prep",
    ],
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function InterviewHubPage({ params }: Props) {
  const { locale } = await params;
  const lp = locale === "en" ? "" : `/${locale}`;
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const t = await getTranslations({ locale, namespace: "interview.hub" });

  const depthSections = [
    { heading: t("aboutHeading"), body: t.raw("about") as string[] },
    { heading: t("formatHeading"), body: t.raw("format") as string[] },
  ];
  const depthLists = [
    {
      heading: t("howHeading"),
      ordered: true,
      items: t.raw("how") as string[],
    },
  ];
  const depthFaqs = t.raw("faqs") as FaqItem[];

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: lp || "/" },
      { name: t("title"), url: localizedUrl },
    ]),
    {
      "@type": "ItemList",
      name: t("title"),
      description: t("metaDescription"),
      url: localizedUrl,
      numberOfItems: INTERVIEW_QUIZZES_DATA.length,
      itemListElement: INTERVIEW_QUIZZES_DATA.map((q, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name:
          locale === "pt"
            ? `${q.title} - Simulado Técnico`
            : locale === "es"
            ? `${q.title} - Simulador Técnico`
            : `${q.title} Interview Drill`,
        url: buildLocalizedUrl(`/interview/${q.slug}`, locale),
      })),
    },
    faqSchema(depthFaqs),
  );

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full pb-2">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: lp || "/" },
            { label: t("title"), current: true },
          ]}
        />
      </div>
      <AppInterviewHub locale={locale} />
      <AppInterviewDepth
        sections={depthSections}
        lists={depthLists}
        faqHeading={t("faqHeading")}
        faqs={depthFaqs}
      />
    </main>
  );
}
