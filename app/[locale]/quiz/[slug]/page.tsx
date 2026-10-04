import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { QUIZ_REGISTRY, NOINDEX_QUIZ_IDS } from "@/lib/quizRegistry";
import { getQuizBySlug } from "@/lib/content/quizRepository";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  faqSchema,
  buildLocalizedUrl,
  quizDetailSchema,
} from "@/lib/schema";
import { AD_SLOTS } from "@/lib/adSlots";
import AppAdUnit from "@/components/AppAdUnit";
import AppQuiz from "@/components/quiz/AppQuiz";
import AppQuizDepth, {
  getQuizDepthContent,
} from "@/components/quiz/AppQuizDepth";
import AppRelatedQuizzes, {
  FAQ_DATA,
} from "@/components/quiz/AppRelatedQuizzes";
import AppBreadcrumb from "@/components/AppBreadcrumb";

export function generateStaticParams() {
  return QUIZ_REGISTRY.flatMap((q) =>
    locales.map((locale) => ({ locale, slug: q.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const quiz = await getQuizBySlug(slug, locale);
  if (!quiz) return {};

  const depth = await getQuizDepthContent(slug, locale);
  const title = depth
    ? `${depth.metaTitle} | ToolNotch`
    : `${quiz.title} | ToolNotch`;
  const description = depth ? depth.metaDescription : quiz.description;
  const canonicalPath = `/quiz/${slug}`;
  const localizedUrl = buildLocalizedUrl(canonicalPath, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const quizMeta = QUIZ_REGISTRY.find((q) => q.id === slug);
  const keywords = [
    quiz.title,
    locale === "pt"
      ? "quiz interativo"
      : locale === "es"
        ? "quiz interactivo"
        : "interactive quiz",
    locale === "pt"
      ? "teste online grátis"
      : locale === "es"
        ? "test online gratis"
        : "free online quiz",
    quizMeta?.category ?? "personality",
    "ToolNotch",
  ];

  return {
    title,
    description,
    keywords,
    alternates: buildAlternatesForLocale(canonicalPath, locale),
    openGraph: {
      title,
      description,
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(NOINDEX_QUIZ_IDS.has(slug)
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const quiz = await getQuizBySlug(slug, locale);
  if (!quiz) notFound();

  const depth = await getQuizDepthContent(slug, locale);
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";

  const breadcrumb = breadcrumbSchema([
    { name: homeLabel, url: localizedPath("/", locale) },
    { name: "Quizzes", url: localizedPath("/quizzes", locale) },
    { name: quiz.title, url: localizedPath(`/quiz/${slug}`, locale) },
  ]);

  const quizUrl = buildLocalizedUrl(`/quiz/${slug}`, locale);
  const quizEntity = quizDetailSchema(quiz, quizUrl, locale, depth?.about);

  const commonFaqs = FAQ_DATA[locale]?.items ?? FAQ_DATA.en.items;
  const faqsToUse = depth?.faqs ?? commonFaqs;
  const jsonLd = buildJsonLd(quizEntity, faqSchema(faqsToUse), breadcrumb);

  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <main className="min-h-[calc(100vh-180px)] bg-background text-foreground py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full pb-2 container">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: prefix || "/" },
            { label: "Quizzes", href: `${prefix}/quizzes` },
            {
              label: quiz.title,
              href: `${prefix}/quiz/${slug}`,
              current: true,
            },
          ]}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto my-3 min-h-[90px] flex justify-center">
        <AppAdUnit slot={AD_SLOTS.QUIZ_TOP} />
      </div>

      <div className="w-full max-w-4xl mx-auto pt-4 pb-4">
        <AppQuiz quiz={quiz} locale={locale} />
      </div>

      <section className="sr-only" aria-label="Quiz Overview">
        <h2>{quiz.title}</h2>
        <p>{quiz.description}</p>
        <ol>
          {quiz.questions.map((q, idx) => (
            <li key={q.id}>
              <h3>{`${idx + 1}. ${q.text}`}</h3>
              <ul>
                {q.options.map((opt) => (
                  <li key={opt.id}>{opt.text}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        {"results" in quiz && Array.isArray(quiz.results) && (
          <div>
            <h3>
              {locale === "pt"
                ? "Possíveis Resultados"
                : locale === "es"
                  ? "Posibles Resultados"
                  : "Possible Results"}
            </h3>
            <ul>
              {quiz.results.map((res) => (
                <li key={res.id}>
                  <strong>{res.title}</strong>: {res.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="w-full max-w-4xl mx-auto my-6 min-h-[90px] flex justify-center">
        <AppAdUnit slot={AD_SLOTS.QUIZ_BOTTOM} />
      </div>

      {depth && <AppQuizDepth content={depth} currentSlug={slug} />}
      {!depth && <AppRelatedQuizzes slug={slug} locale={locale} />}
    </main>
  );
}
