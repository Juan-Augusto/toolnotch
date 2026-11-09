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
import AppEventLoopVisualizer from "@/components/dev/AppEventLoopVisualizer";
import DevToolHeader from "../components/DevToolHeader";
import DevToolContent, {
  type RichContent,
} from "../components/DevToolContent";

const PATH = "/tools/dev/node-event-loop";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "eventLoop" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywords =
    locale === "pt"
      ? [
          "event loop node",
          "event loop nodejs explicado",
          "visualizador event loop",
          "process.nextTick vs setImmediate",
          "microtasks e macrotasks",
          "entrevista node.js",
        ]
      : locale === "es"
        ? [
            "event loop node",
            "event loop nodejs explicado",
            "visualizador event loop",
            "process.nextTick vs setImmediate",
            "microtasks y macrotasks",
            "entrevista node.js",
          ]
        : [
            "node event loop",
            "node.js event loop visualizer",
            "event loop explained",
            "process.nextTick vs setImmediate",
            "microtasks vs macrotasks",
            "node.js interview questions",
          ];

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords,
    alternates: buildAlternatesForLocale(PATH, locale),
    robots: { index: true, follow: true },
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
    category: "dev",
  };
}

export default async function NodeEventLoopPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "eventLoop" });
  const faqs = (t.raw("faqs") as FaqItem[]) || [];
  const richContent = (t.raw("richContent") as RichContent) || {};

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const devLabel =
    locale === "pt" ? "Desenvolvedor" : locale === "es" ? "Desarrollador" : "Developer";
  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const howToSteps = Array.isArray(richContent.howToUse)
    ? richContent.howToUse.filter((s) => typeof s === "string" && s.trim().length > 0)
    : [];

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: devLabel, url: localizedPath("/tools/dev", locale) },
      { name: t("title"), url: localizedUrl },
    ]),
    webAppSchema(
      t("title"),
      PATH,
      t("metaDescription"),
      locale,
      "DeveloperApplication",
    ),
    faqSchema(faqs),
    ...(howToSteps.length >= 2 ? [howToSchema(t("title"), howToSteps)] : []),
  );

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full">
        <DevToolHeader
          title={t("title")}
          description={t("description")}
          locale={locale}
        />

        <section aria-label={t("title")} className="w-full">
          <AppEventLoopVisualizer locale={locale} />
        </section>

        <DevToolContent
          currentToolSlug="node-event-loop"
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}
