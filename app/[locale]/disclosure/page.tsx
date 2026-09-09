import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import { buildJsonLd, breadcrumbSchema, buildLocalizedUrl } from "@/lib/schema";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";

const PATH = "/disclosure";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "disclosure" });
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywordsByLocale = {
    pt: [
      "ToolNotch divulgação",
      "transparência afiliados",
      "links patrocinados",
      "política de afiliados",
      "publicidade e anúncios",
      "independência editorial",
      "ferramentas gratuitas imparciais",
    ],
    es: [
      "ToolNotch divulgación",
      "transparencia afiliados",
      "enlaces patrocinados",
      "política de afiliados",
      "publicidad y patrocinios",
      "independencia editorial",
      "herramientas gratuitas imparciales",
    ],
    en: [
      "ToolNotch disclosure",
      "affiliate transparency",
      "sponsored links",
      "affiliate policy",
      "advertising disclosure",
      "editorial independence",
      "unbiased free tools",
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

export default async function DisclosurePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "disclosure" });
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
        name: "Disclosure & Transparency",
      },
      publisher: {
        "@type": "Organization",
        "@id": "https://toolnotch.com/#organization",
        name: "ToolNotch",
        url: "https://toolnotch.com",
        logo: "https://toolnotch.com/icon.svg",
      },
      datePublished: "2024-01-01",
      dateModified: "2026-09-08",
    },
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        aria-labelledby="disclosure-heading"
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
              id="disclosure-heading"
              className="text-2xl sm:text-3xl font-bold uppercase tracking-wide"
            >
              {t("title")}
            </h1>
            <p className="leading-relaxed text-label mt-3">{t("subtitle")}</p>
            <p className="text-xs text-label/80 mt-2 font-mono">
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
            <h2 className="text-lg sm:text-xl font-bold uppercase mt-2 mb-3">
              {t("highlightTitle")}
            </h2>
            <p className="leading-relaxed text-label">{t("highlightP1")}</p>
          </AppCard>

          <article className="space-y-10">
            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s1Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s1P1")}</p>
                <p className="leading-relaxed text-label">
                  {t("s1P2")}{" "}
                  <Link
                    href={`${prefix}/partners`}
                    className="text-secondary hover:underline font-semibold"
                  >
                    {t("s1PartnersLink")}
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s2Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s2P1")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s3Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s3P1")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("s4Title")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">{t("s4P1")}</p>
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
                <p className="leading-relaxed text-label">
                  {t("s6P1")}{" "}
                  <Link
                    href={`${prefix}/contact`}
                    className="text-secondary hover:underline font-semibold"
                  >
                    {t("s6ContactLink")}
                  </Link>
                  .
                </p>
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
              <Link href={`${prefix}/partners`}>
                <AppButton color="secondary" small>
                  {t("partnersButton")}
                </AppButton>
              </Link>
              <Link href={`${prefix}/privacy`}>
                <AppButton color="secondary" small>
                  {t("privacyButton")}
                </AppButton>
              </Link>
              <Link href={`${prefix}/terms`}>
                <AppButton color="secondary" small>
                  {t("termsButton")}
                </AppButton>
              </Link>
            </nav>
          </article>
        </div>
      </main>
    </>
  );
}
