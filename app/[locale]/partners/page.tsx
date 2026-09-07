import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/i18nMeta";
import { buildJsonLd, breadcrumbSchema } from "@/lib/schema";
import { partnersByCategory } from "@/lib/affiliatePartners";

const PATH = "/partners";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "affiliate" });
  return {
    title: t("partners.metaTitle"),
    description: t("partners.metaDescription"),
    alternates: buildAlternates(PATH),
    openGraph: { title: t("partners.metaTitle"), url: PATH },
    // Transparency page — footer-linked and crawlable, but short by nature
    // (a curated list). Kept out of the index/sitemap until it carries enough
    // partners to stand on its own (WS-6 audit). Flip back when it does.
    robots: { index: false, follow: true },
  };
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "affiliate" });
  const groups = partnersByCategory();

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: t("partners.title"), url: PATH },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              &larr; {t("partners.backHome")}
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
            {t("partners.title")}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
            {t("partners.subtitle")}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-10">
            {t("partners.intro")}
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed mb-12">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {t("partners.howTitle")}
              </h2>
              <p className="mb-4">{t("partners.howP1")}</p>
              <p>{t("partners.howP2")}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {t("partners.independenceTitle")}
              </h2>
              <p>{t("partners.independenceP1")}</p>
            </section>
          </div>

          <div className="space-y-10">
            {groups.map(([category, partners]) => (
              <section key={category}>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {t(`partners.categories.${category}`)}
                </h2>
                <ul className="space-y-4">
                  {partners.map((p) => (
                    <li
                      key={p.key}
                      className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900"
                    >
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {t(`offers.${p.key}.name`)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3 leading-relaxed">
                        {t(`offers.${p.key}.blurb`)}
                      </p>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                        className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        {t(`offers.${p.key}.cta`)} &rarr;
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-500 mt-10">
            {t("disclosure")}
          </p>
        </div>
      </main>
    </>
  );
}
