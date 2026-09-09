import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isTriviaQuiz } from "@/lib/quizTypes";
import {
  QUIZ_REGISTRY,
  NOINDEX_QUIZ_IDS,
  NOINDEX_RESULT_QUIZ_IDS,
} from "@/lib/quizRegistry";
import { getQuizBySlug, getQuizResultIds } from "@/lib/content/quizRepository";
import { buildJsonLd, breadcrumbSchema } from "@/lib/schema";
import { buildAlternates } from "@/lib/i18nMeta";
import { getQuizDepthContent } from "@/components/quiz/AppQuizDepth";
import AppBreadcrumb from "@/components/AppBreadcrumb";

const TRIVIA_TIER_IDS = ["legend", "expert", "fan", "rookie"] as const;

// ── Static params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const params: { locale: string; slug: string; resultId: string }[] = [];
  for (const q of QUIZ_REGISTRY) {
    if (q.type === "trivia") {
      // Trivia quizzes: generate params for each locale + each tier
      for (const locale of q.locales) {
        for (const tierId of TRIVIA_TIER_IDS) {
          params.push({ locale, slug: q.id, resultId: tierId });
        }
      }
      continue;
    }
    // Personality quizzes: generate params from results in English JSON
    const resultIds = await getQuizResultIds(q.id);
    for (const resultId of resultIds) {
      for (const locale of ["en", "pt", "es"]) {
        params.push({ locale, slug: q.id, resultId });
      }
    }
  }
  return params;
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; resultId: string }>;
}): Promise<Metadata> {
  const { locale, slug, resultId } = await params;
  const quiz = await getQuizBySlug(slug, locale);
  if (!quiz) return {};

  const noindexMeta =
    NOINDEX_QUIZ_IDS.has(slug) || NOINDEX_RESULT_QUIZ_IDS.has(slug)
      ? { robots: { index: false, follow: true } as const }
      : {};

  if (isTriviaQuiz(quiz)) {
    const tier = quiz.tiers.find((t) => t.id === resultId);
    if (!tier) return {};
    return {
      title: `${tier.label}: ${quiz.title} | ToolNotch`,
      description: tier.description.slice(0, 155),
      alternates: buildAlternates(`/quiz/${slug}/result/${resultId}`),
      openGraph: {
        title: `${tier.label}: ${quiz.title}`,
        description: tier.description.slice(0, 155),
        url: `/quiz/${slug}/result/${resultId}`,
      },
      twitter: { card: "summary_large_image" },
      ...noindexMeta,
    };
  }

  const result = quiz.results.find((r) => r.id === resultId);
  if (!result) return {};
  return {
    title: `I got "${result.title}" on ${quiz.title} | ToolNotch`,
    description: result.description.slice(0, 155),
    alternates: { canonical: `/quiz/${slug}/result/${resultId}` },
    openGraph: {
      title: `I got "${result.title}" on ${quiz.title}`,
      description: result.description.slice(0, 155),
      url: `/quiz/${slug}/result/${resultId}`,
    },
    twitter: { card: "summary_large_image" },
    ...noindexMeta,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function QuizResultPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; resultId: string }>;
}) {
  const { locale, slug, resultId } = await params;
  const prefix = locale === "en" ? "" : `/${locale}`;
  const quiz = await getQuizBySlug(slug, locale);
  if (!quiz) notFound();

  // ── Trivia result ────────────────────────────────────────────────────────
  if (isTriviaQuiz(quiz)) {
    const tier = quiz.tiers.find((t) => t.id === resultId);
    if (!tier) notFound();

    const depth = await getQuizDepthContent(slug, locale);
    const tierDepth = depth?.results?.[resultId];

    const jsonLd = buildJsonLd(
      {
        "@type": "Article",
        headline: `${tier.label}: ${quiz.title} Result`,
        description: tier.description.slice(0, 155),
        url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://toolnotch.com"}/quiz/${slug}/result/${resultId}`,
      },
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Quizzes", url: "/quizzes" },
        { name: quiz.title, url: `/quiz/${slug}` },
        { name: tier.label, url: `/quiz/${slug}/result/${resultId}` },
      ]),
    );

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-8">
          <div className="w-full pb-2">
            <AppBreadcrumb
              items={[
                { label: "Home", href: prefix || "/" },
                { label: "Quizzes", href: `${prefix}/quizzes` },
                { label: quiz.title, href: `${prefix}/quiz/${slug}` },
                { label: tier.label, current: true },
              ]}
            />
          </div>
          <div className="w-full py-6">
            <div className="bg-card rounded-[2px] border border-border/60 p-8 mb-8">
              <div className="font-mono text-xs text-primary font-bold uppercase mb-1">
                {quiz.title}
              </div>
              <h1 className="font-mono text-2xl sm:text-3xl font-bold uppercase text-foreground mb-4">
                {tier.label}
              </h1>
              <p className="font-mono text-sm text-label leading-relaxed mb-6">
                {tier.description}
              </p>
              {tierDepth && (
                <div className="mb-6">
                  <h2 className="font-mono text-base font-bold uppercase text-foreground mb-3">
                    {tierDepth.heading}
                  </h2>
                  <div className="space-y-4">
                    {tierDepth.body.map((paragraph, i) => (
                      <p
                        key={i}
                        className="font-mono text-xs sm:text-sm text-label leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              <Link
                href={`${prefix}/quiz/${slug}`}
                className="inline-block px-6 py-3 bg-primary text-background rounded-[2px] font-mono font-bold text-sm uppercase hover:opacity-90 transition-opacity"
              >
                Take this quiz →
              </Link>
            </div>
            <div className="text-center">
              <Link
                href={`${prefix}/quizzes`}
                className="font-mono text-xs text-label hover:text-primary transition-colors"
              >
                Browse all quizzes →
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Personality result ───────────────────────────────────────────────────
  const result = quiz.results.find((r) => r.id === resultId);
  if (!result) notFound();

  const jsonLd = buildJsonLd(
    {
      "@type": "Article",
      headline: `${result.title}: ${quiz.title} Result`,
      description: result.description.slice(0, 155),
      url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://toolnotch.com"}/quiz/${slug}/result/${resultId}`,
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Quizzes", url: "/quizzes" },
      { name: quiz.title, url: `/quiz/${slug}` },
      { name: result.title, url: `/quiz/${slug}/result/${resultId}` },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-8">
        <div className="w-full pb-2">
          <AppBreadcrumb
            items={[
              { label: "Home", href: prefix || "/" },
              { label: "Quizzes", href: `${prefix}/quizzes` },
              { label: quiz.title, href: `${prefix}/quiz/${slug}` },
              { label: result.title, current: true },
            ]}
          />
        </div>
        <div className="w-full py-6">
          {/* Result detail: indexable content */}
          <div className="bg-card rounded-[2px] border border-border/60 p-8 mb-8">
            <div className="font-mono text-xs text-primary font-bold uppercase mb-1">
              {quiz.title}
            </div>
            <h1 className="font-mono text-2xl sm:text-3xl font-bold uppercase text-foreground mb-4">
              {result.title}
            </h1>
            <p className="font-mono text-sm text-label leading-relaxed mb-6">
              {result.description}
            </p>
            {result.traits.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {result.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-2.5 py-1 bg-tertiary border border-border/50 text-foreground font-mono rounded-[2px] text-xs font-medium"
                  >
                    #{trait}
                  </span>
                ))}
              </div>
            )}
            <Link
              href={`${prefix}/quiz/${slug}`}
              className="inline-block px-6 py-3 bg-primary text-background rounded-[2px] font-mono font-bold text-sm uppercase hover:opacity-90 transition-opacity"
            >
              Take this quiz →
            </Link>
          </div>

          {/* Other quizzes */}
          <div className="text-center">
            <Link
              href={`${prefix}/quizzes`}
              className="font-mono text-xs text-label hover:text-primary transition-colors"
            >
              Browse all quizzes →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
