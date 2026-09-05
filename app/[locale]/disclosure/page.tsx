import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/i18nMeta";
import { buildJsonLd, breadcrumbSchema } from "@/lib/schema";

const PATH = "/disclosure";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "disclosure" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates(PATH),
    openGraph: { title: t("metaTitle"), url: PATH },
  };
}

export default async function DisclosurePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "disclosure" });

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: t("title"), url: PATH },
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
              &larr; {t("backHome")}
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10">
            {t("subtitle")}
          </p>

          <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>{t("intro")}</p>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t("affiliateTitle")}
              </h2>
              <p className="mb-4">{t("affiliateP1")}</p>
              <p>
                {t("affiliateP2")}{" "}
                <Link
                  href="/partners"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("affiliatePartnersLink")}
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t("adsTitle")}
              </h2>
              <p>{t("adsP1")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t("editorialTitle")}
              </h2>
              <p>{t("editorialP1")}</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
