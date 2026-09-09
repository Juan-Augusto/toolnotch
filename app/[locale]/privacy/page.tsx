import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import { buildJsonLd, breadcrumbSchema, buildLocalizedUrl } from "@/lib/schema";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";

const PATH = "/privacy";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywordsByLocale = {
    pt: [
      "ToolNotch privacidade",
      "política de privacidade",
      "ferramentas client-side",
      "processamento local",
      "segurança de dados",
      "sem cadastro",
      "LGPD privacidade",
    ],
    es: [
      "ToolNotch privacidad",
      "política de privacidad",
      "herramientas client-side",
      "procesamiento local",
      "seguridad de datos",
      "sin registro",
      "protección de datos",
    ],
    en: [
      "ToolNotch privacy",
      "privacy policy",
      "client-side tools",
      "in-browser processing",
      "data security",
      "no sign-up tools",
      "GDPR privacy",
    ],
  };

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: keywordsByLocale[currentLocale],
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: {
      title: `${t("metaTitle")} | ToolNotch`,
      description: t("metaDescription"),
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("metaTitle")} | ToolNotch`,
      description: t("metaDescription"),
    },
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const prefix = locale === "en" ? "" : `/${locale}`;
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: t("title"), url: localizedPath(PATH, locale) },
    ]),
    {
      "@type": "WebPage",
      "@id": `${localizedUrl}#webpage`,
      url: localizedUrl,
      name: t("title"),
      description: t("metaDescription"),
      inLanguage: locale,
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://toolnotch.com/#website",
        name: "ToolNotch",
        url: "https://toolnotch.com",
      },
      about: {
        "@type": "Thing",
        name: "Privacy Policy",
      },
    },
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        aria-labelledby="privacy-heading"
        className="container min-h-[calc(100vh-180px)] bg-background py-8"
      >
        <div className="max-w-3xl">
          <div className="w-full pb-4">
            <AppBreadcrumb
              items={[
                { label: homeLabel, href: prefix || "/" },
                { label: t("title"), current: true },
              ]}
            />
          </div>

          <header className="mb-10 pt-4 pb-6 border-b border-border">
            <h1
              id="privacy-heading"
              className="text-2xl sm:text-3xl font-bold uppercase tracking-wide"
            >
              {t("title")}
            </h1>
            <p className="leading-relaxed text-label mt-3">{t("subtitle")}</p>
            <p className="text-xs sm:text-sm text-label/80 mt-2 font-mono">
              {t("lastUpdated")}
            </p>
          </header>

          <AppCard
            border
            withCornerAccents={false}
            className="p-6 bg-tertiary mb-10"
          >
            <span className="font-bold text-secondary uppercase tracking-wider text-xs">
              {t("badge")}
            </span>
            <h3 className="text-lg sm:text-xl font-bold uppercase mt-2 mb-3">
              {t("highlightTitle")}
            </h3>
            <p className="leading-relaxed text-label">{t("highlightP1")}</p>
          </AppCard>

          <article className="space-y-10">
            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s1Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s1P1")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s2Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s2P1")}</p>
                <p className="leading-relaxed text-label">{t("s2P2")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s3Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s3P1")}</p>
                <p className="leading-relaxed text-label">
                  {t.rich("s3P2", {
                    optOutLink: (chunks) => (
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-foreground"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s4Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s4P1")}</p>
                <p className="leading-relaxed text-label">{t("s4P2")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s5Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s5P1")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s6Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s6P1")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s7Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s7P1")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s8Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s8P1")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s9Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s9P1")}</p>
                <div className="pt-1">
                  <Link
                    href={`${prefix}/contact`}
                    className="text-secondary hover:underline inline-flex items-center gap-1.5 font-bold uppercase text-sm"
                  >
                    {t("contactButton")}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </section>

            <nav
              aria-label={
                locale === "pt"
                  ? "Navegação rápida"
                  : locale === "es"
                    ? "Navegación rápida"
                    : "Quick navigation"
              }
              className="pt-6 border-t border-border flex flex-wrap gap-3"
            >
              <Link href={prefix || "/"}>
                <AppButton color="primary" small withArrow>
                  {t("exploreTools")}
                </AppButton>
              </Link>
              <Link href={`${prefix}/about`}>
                <AppButton color="secondary" small>
                  {t("aboutButton")}
                </AppButton>
              </Link>
            </nav>
          </article>
        </div>
      </main>
    </>
  );
}
