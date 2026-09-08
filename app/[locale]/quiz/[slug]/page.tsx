import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { QUIZ_REGISTRY, NOINDEX_QUIZ_IDS } from "@/lib/quizRegistry";
import { getQuizBySlug } from "@/lib/content/quizRepository";
import { buildAlternates } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  faqSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import AppQuiz from "@/components/quiz/AppQuiz";
import AppQuizDepth, {
  getQuizDepthContent,
} from "@/components/quiz/AppQuizDepth";
import AppRelatedQuizzes from "@/components/quiz/AppRelatedQuizzes";
import AppBreadcrumb from "@/components/AppBreadcrumb";

// ── Static params ─────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return QUIZ_REGISTRY.flatMap((q) =>
    locales.map((locale) => ({ locale, slug: q.id })),
  );
}

// ── Metadata ──────────────────────────────────────────────────────────────────
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

  return {
    title,
    description,
    alternates: buildAlternates(`/quiz/${slug}`),
    openGraph: { title, description },
    ...(NOINDEX_QUIZ_IDS.has(slug)
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const quiz = await getQuizBySlug(slug, locale);
  if (!quiz) notFound();

  const depth = await getQuizDepthContent(slug, locale);

  // Every quiz page carries exactly one primary entity (`Quiz`) + a
  // `BreadcrumbList`; the WS-3 depth pages add a topic `FAQPage` on top.
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Quizzes", url: "/quizzes" },
    { name: quiz.title, url: `/quiz/${slug}` },
  ]);
  const quizEntity = {
    "@type": "Quiz" as const,
    name: quiz.title,
    url: buildLocalizedUrl(`/quiz/${slug}`, locale),
    description: depth ? depth.metaDescription : quiz.description,
    educationalUse: "Assessment",
    ...(depth?.about ? { about: { "@type": "Thing", name: depth.about } } : {}),
  };
  const jsonLd = depth
    ? buildJsonLd(quizEntity, faqSchema(depth.faqs), breadcrumb)
    : buildJsonLd(quizEntity, breadcrumb);

  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <main className=" min-h-[calc(100vh-180px)] bg-background text-foreground py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full pb-2 container">
        <AppBreadcrumb
          items={[
            { label: "Home", href: prefix || "/" },
            { label: "Quizzes", href: `${prefix}/quizzes` },
            {
              label: quiz.title,
              href: `${prefix}/quiz/${slug}`,
              current: true,
            },
          ]}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto pt-6 pb-8 md:pb-12">
        <AppQuiz quiz={quiz} locale={locale} />
      </div>

      {depth && <AppQuizDepth content={depth} currentSlug={slug} />}
      {!depth && <AppRelatedQuizzes slug={slug} locale={locale} />}
    </main>
  );
}
