"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { resolveToolRelated, type RelatedLinkSpec } from "@/lib/relatedContent";
import { BLOG_SLUG_GROUPS } from "@/data/blog/slugTranslations";

/**
 * Contextual internal-linking block rendered inside ToolWrapper for every tool
 * page. Server-reachable <a href> links with descriptive, locale-correct
 * anchor text (tool names / article titles), locale-prefixed. Guarantees the
 * WS-5 minimum of >= 2 related-tool links + >= 1 blog-post link on every tool
 * page without touching the individual page files.
 */

const LOCALE_PREFIX = /^\/(pt|es)(?=\/|$)/;

function localize(path: string, locale: string): string {
  return locale === "en" ? path : `/${locale}${path}`;
}

export default function RelatedContent() {
  const pathname = usePathname() ?? "";
  const localeMatch = pathname.match(/^\/(pt|es)(?=\/|$)/);
  const locale = localeMatch ? localeMatch[1] : "en";
  const tHome = useTranslations("home");
  const tBlog = useTranslations("blog");
  const tSection = useTranslations("toolWrapper");

  const bare = pathname.replace(LOCALE_PREFIX, "");
  if (!bare.startsWith("/tools/")) return null;

  const { tools, posts } = resolveToolRelated(bare);
  if (tools.length < 2 || posts.length < 1) return null;

  const label = (spec: RelatedLinkSpec): string =>
    spec.labelNs === "homeTools"
      ? tHome(`tools.${spec.labelKey}.label`)
      : tBlog(`posts.${spec.labelKey}.title`);

  const href = (spec: RelatedLinkSpec): string => {
    if (spec.postGroup) {
      const group = BLOG_SLUG_GROUPS[spec.postGroup];
      const slug = group[locale as keyof typeof group] ?? group.en;
      return localize(`/blog/${slug}`, locale);
    }
    if (spec.postSlug) return localize(`/blog/${spec.postSlug}`, locale);
    return localize(spec.path ?? "/", locale);
  };

  const heading = tSection("relatedContentHeading");

  return (
    <div
      className="mt-12 animate-fade-in-up no-print"
      style={{ color: "var(--text-secondary)", animationDelay: "140ms" }}
    >
      <h2 className="text-xl font-bold mb-3 section-heading">{heading}</h2>
      <ul className="list-disc list-inside space-y-2">
        {tools.map((spec) => (
          <li key={`t-${spec.path}`} className="leading-relaxed pl-1">
            <Link
              href={href(spec)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {label(spec)}
            </Link>
          </li>
        ))}
        {posts.map((spec) => (
          <li
            key={`p-${spec.postSlug ?? spec.postGroup}`}
            className="leading-relaxed pl-1"
          >
            <Link
              href={href(spec)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {label(spec)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
