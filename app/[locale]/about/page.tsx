import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Github, ArrowRight } from "lucide-react";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import { buildJsonLd, breadcrumbSchema, buildLocalizedUrl } from "@/lib/schema";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";

const PATH = "/about";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywordsByLocale = {
    pt: [
      "ToolNotch",
      "sobre o ToolNotch",
      "ferramentas online gratuitas",
      "Juan Soares",
      "ferramentas client-side",
      "privacidade online",
      "sem cadastro",
      "quizzes gratuitos",
      "desenvolvedor de software",
    ],
    es: [
      "ToolNotch",
      "sobre ToolNotch",
      "herramientas online gratis",
      "Juan Soares",
      "privacidad en el navegador",
      "sin registro",
      "quizzes interactivos",
      "desarrollador de software",
    ],
    en: [
      "ToolNotch",
      "about ToolNotch",
      "free online developer tools",
      "Juan Soares",
      "client-side privacy",
      "no sign-up tools",
      "interactive quizzes",
      "web utilities",
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

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
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
      "@type": "AboutPage",
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
      mainEntity: {
        "@type": "Organization",
        "@id": "https://toolnotch.com/#organization",
        name: "ToolNotch",
        url: "https://toolnotch.com",
        logo: "https://toolnotch.com/icon.svg",
        founder: {
          "@type": "Person",
          name: "Juan Soares",
          jobTitle: "Creator of ToolNotch",
          url: "https://github.com/Juan-Augusto",
          sameAs: ["https://github.com/Juan-Augusto"],
        },
        sameAs: ["https://github.com/Juan-Augusto"],
        knowsAbout: [
          "Developer Tools",
          "Client-Side Privacy",
          "PDF Utilities",
          "Data Conversion",
          "Interactive Quizzes",
          "Web Development",
          "WebAssembly",
          "Canvas API",
        ],
        publishingPrinciples: "https://toolnotch.com/about",
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
        aria-labelledby="about-heading"
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
              id="about-heading"
              className="text-2xl sm:text-3xl font-bold uppercase tracking-wide"
            >
              {t("title")}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-label mt-3">
              {t("subtitle")}
            </p>
          </header>

          <article className="space-y-10">
            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("whyTitle")}
              </h2>
              <div className="space-y-4">
                <p className="text-sm sm:text-base leading-relaxed text-label">{t("whyP1")}</p>
                <p className="text-sm sm:text-base leading-relaxed text-label">{t("whyP2")}</p>
                <p className="text-sm sm:text-base leading-relaxed text-label">{t("whyP3")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("believeTitle")}
              </h2>
              <div className="space-y-4">
                <p className="text-sm sm:text-base leading-relaxed text-label">{t("believeP1")}</p>
                <p className="text-sm sm:text-base leading-relaxed text-label">{t("believeP2")}</p>
              </div>
            </section>

            <AppCard
              border
              withCornerAccents={false}
              className="p-6 bg-tertiary flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <span className="font-bold text-secondary uppercase tracking-wider">
                  {t("founderBadge")}
                </span>
                <h3 className="text-lg sm:text-xl font-bold uppercase">
                  Juan Soares
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-label">{t("whoP1")}</p>
              </div>

              <div className="shrink-0">
                <a
                  href="https://github.com/Juan-Augusto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <AppButton
                    color="tertiary"
                    small
                    className="border border-border hover:border-foreground/30"
                  >
                    <Github className="w-4 h-4 mr-1.5" />
                    {t("githubButton")}
                  </AppButton>
                </a>
              </div>
            </AppCard>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("toolsTitle")}
              </h2>
              <div className="space-y-4">
                <p className="text-sm sm:text-base leading-relaxed text-label">{t("toolsP1")}</p>
                <p className="text-sm sm:text-base leading-relaxed text-label">{t("toolsP2")}</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold uppercase mb-4">
                {t("fundedTitle")}
              </h2>
              <div className="space-y-4">
                <p className="text-sm sm:text-base leading-relaxed text-label">{t("fundedP1")}</p>
                <p className="text-sm sm:text-base leading-relaxed text-label">{t("fundedP2")}</p>
                <div className="pt-1">
                  <Link
                    href={`${prefix}/privacy`}
                    className="text-secondary hover:underline inline-flex items-center gap-1.5 font-bold uppercase"
                  >
                    {locale === "pt"
                      ? "Política de Privacidade"
                      : locale === "es"
                        ? "Política de Privacidad"
                        : "Privacy Policy"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </section>

            <nav
              aria-label={
                locale === "pt"
                  ? "Explorar ToolNotch"
                  : locale === "es"
                    ? "Explorar ToolNotch"
                    : "Explore ToolNotch"
              }
              className="pt-6 border-t border-border flex flex-wrap gap-3"
            >
              <Link href={prefix || "/"}>
                <AppButton color="primary" small withArrow>
                  {t("exploreTools")}
                </AppButton>
              </Link>
              <Link href={`${prefix}/quizzes`}>
                <AppButton color="secondary" small>
                  {t("exploreQuizzes")}
                </AppButton>
              </Link>
            </nav>
          </article>
        </div>
      </main>
    </>
  );
}
