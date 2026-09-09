import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import { buildJsonLd, breadcrumbSchema, buildLocalizedUrl } from "@/lib/schema";
import { partnersByCategory } from "@/lib/affiliatePartners";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";

const PATH = "/partners";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "affiliate" });
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywordsByLocale = {
    pt: [
      "ToolNotch parceiros",
      "ferramentas recomendadas",
      "transparência afiliados",
      "parcerias éticas",
      "critérios de recomendação",
      "ferramentas online",
    ],
    es: [
      "ToolNotch socios",
      "herramientas recomendadas",
      "transparencia afiliados",
      "colaboraciones éticas",
      "criterios de recomendación",
      "herramientas online",
    ],
    en: [
      "ToolNotch partners",
      "recommended tools",
      "affiliate transparency",
      "ethical partnerships",
      "partner review standards",
      "online tools",
    ],
  };

  return {
    title: t("partners.metaTitle"),
    description: t("partners.metaDescription"),
    keywords: keywordsByLocale[currentLocale],
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: {
      title: `${t("partners.metaTitle")} | ToolNotch`,
      description: t("partners.metaDescription"),
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("partners.metaTitle")} | ToolNotch`,
      description: t("partners.metaDescription"),
    },
  };
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "affiliate" });
  const groups = partnersByCategory();
  const prefix = locale === "en" ? "" : `/${locale}`;
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: t("partners.title"), url: localizedPath(PATH, locale) },
    ]),
    {
      "@type": "WebPage",
      "@id": `${localizedUrl}#webpage`,
      url: localizedUrl,
      name: t("partners.title"),
      description: t("partners.metaDescription"),
      inLanguage: locale,
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://toolnotch.com/#website",
        name: "ToolNotch",
        url: "https://toolnotch.com",
      },
      about: {
        "@type": "Thing",
        name: "Partners & Affiliate Transparency",
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
        aria-labelledby="partners-heading"
        className="container min-h-[calc(100vh-180px)] bg-background py-8"
      >
        <div className="max-w-3xl">
          <div className="w-full pb-4">
            <AppBreadcrumb
              items={[
                { label: homeLabel, href: prefix || "/" },
                { label: t("partners.title"), current: true },
              ]}
            />
          </div>

          <header className="mb-10 pt-4 pb-6 border-b border-border">
            <h1
              id="partners-heading"
              className="text-2xl sm:text-3xl font-bold uppercase tracking-wide"
            >
              {t("partners.title")}
            </h1>
            <p className="leading-relaxed text-label mt-3">
              {t("partners.subtitle")}
            </p>
            <p className="text-xs text-label/80 mt-2 font-mono">
              {t("partners.lastUpdated")}
            </p>
          </header>

          <AppCard
            border
            withCornerAccents={false}
            className="p-6 bg-tertiary mb-10"
          >
            <span className="font-bold text-secondary uppercase tracking-wider text-xs">
              {t("partners.badge")}
            </span>
            <h2 className="text-lg sm:text-xl font-bold uppercase mt-2 mb-3">
              {t("partners.highlightTitle")}
            </h2>
            <p className="leading-relaxed text-label">
              {t("partners.highlightP1")}
            </p>
          </AppCard>

          <article className="space-y-10">
            <p className="leading-relaxed text-label">{t("partners.intro")}</p>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("partners.howTitle")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">
                  {t("partners.howP1")}
                </p>
                <p className="leading-relaxed text-label">
                  {t("partners.howP2")}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("partners.independenceTitle")}
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-label">
                  {t("partners.independenceP1")}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("partners.catalogTitle")}
              </h2>
              <div className="space-y-8">
                {groups.map(([category, partners]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="font-bold text-secondary uppercase tracking-wider text-xs">
                      {t(`partners.categories.${category}`)}
                    </h3>
                    <div className="grid gap-4">
                      {partners.map((p) => (
                        <AppCard
                          key={p.key}
                          border
                          withCornerAccents={false}
                          className="p-5 bg-card"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h4 className="font-bold text-foreground text-base">
                              {t(`offers.${p.key}.name`)}
                            </h4>
                            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground w-fit">
                              {p.brand}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-label mb-4">
                            {t(`offers.${p.key}.blurb`)}
                          </p>
                          <a
                            href={p.href}
                            target="_blank"
                            rel="sponsored nofollow noopener"
                            className="text-secondary hover:underline inline-flex items-center gap-1.5 font-bold uppercase text-xs"
                          >
                            {t(`offers.${p.key}.cta`)}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </AppCard>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <p className="text-xs text-label/80 font-mono pt-4 border-t border-border">
              {t("partners.disclosure")}
            </p>

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
                  {t("partners.exploreTools")}
                </AppButton>
              </Link>
              <Link href={`${prefix}/disclosure`}>
                <AppButton color="secondary" small>
                  {t("partners.disclosureButton")}
                </AppButton>
              </Link>
              <Link href={`${prefix}/privacy`}>
                <AppButton color="secondary" small>
                  {t("partners.privacyButton")}
                </AppButton>
              </Link>
              <Link href={`${prefix}/terms`}>
                <AppButton color="secondary" small>
                  {t("partners.termsButton")}
                </AppButton>
              </Link>
            </nav>
          </article>
        </div>
      </main>
    </>
  );
}
