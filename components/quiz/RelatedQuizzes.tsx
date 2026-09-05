import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { QUIZ_REGISTRY } from "@/lib/quizRegistry";
import { TOOL_CATALOG } from "@/lib/toolCatalog";

interface Props {
  slug: string;
  locale: string;
}

/**
 * WS-5 item 1 — topical-sibling cross-links for quizzes that don't have the
 * bespoke WS-3 depth cluster. Server-rendered <a href>, locale-prefixed,
 * anchored with the quiz name. Picks siblings in the same registry category,
 * limited to quizzes that have a localised label in `home.tools.*`.
 */
export default async function RelatedQuizzes({ slug, locale }: Props) {
  const meta = QUIZ_REGISTRY.find((q) => q.id === slug);
  const t = await getTranslations({ locale, namespace: "home" });
  const prefix = locale === "en" ? "" : `/${locale}`;

  const labelled = new Map(
    TOOL_CATALOG.filter((e) => e.kind === "quiz" && e.path.startsWith("/quiz/")).map(
      (e) => [e.path, e.labelKey] as const,
    ),
  );

  const sameCategoryIds = meta
    ? QUIZ_REGISTRY.filter(
        (q) => q.category === meta.category && q.id !== slug,
      ).map((q) => q.id)
    : [];

  const picks: { href: string; label: string }[] = [];
  const consider = [
    ...sameCategoryIds.map((id) => `/quiz/${id}`),
    ...[...labelled.keys()],
  ];
  for (const path of consider) {
    if (picks.length >= 3) break;
    if (path === `/quiz/${slug}`) continue;
    const key = labelled.get(path);
    if (!key) continue;
    if (picks.some((p) => p.href.endsWith(path))) continue;
    picks.push({ href: `${prefix}${path}`, label: t(`tools.${key}.label`) });
  }

  if (picks.length < 2) return null;

  return (
    <nav
      aria-label="Related quizzes"
      className="max-w-2xl mx-auto px-4 pb-14"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {t("categories.quizzes")}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {picks.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="flex h-full flex-col rounded-xl border border-gray-200 bg-card p-4 text-sm font-medium text-gray-900 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-card dark:text-white dark:hover:border-blue-600"
            >
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
