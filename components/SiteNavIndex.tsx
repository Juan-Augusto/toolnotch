import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  CATALOG_CATEGORY_ORDER,
  catalogByCategory,
} from "@/lib/toolCatalog";

interface Props {
  locale: string;
}

/**
 * WS-5 item 8 — flat, server-rendered navigation index.
 *
 * The site-wide crawl-depth floor: one compact <nav> in the footer linking
 * every indexable tool + every featured quiz + the blog hub, as real
 * locale-prefixed <a href> with descriptive anchors, reachable with no JS.
 * The contextual `RelatedContent` mesh sits on top of this as the per-page
 * layer.
 */
export default function SiteNavIndex({ locale }: Props) {
  const t = useTranslations("home");
  const tf = useTranslations("footer");
  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <nav
      aria-label={tf("siteIndexHeading")}
      className="w-full border-t border-[color:var(--base-border)] pt-8 mt-2 text-tx-secondary"
    >
      <h2 className="text-xs font-bold uppercase tracking-widest mb-4 text-center">
        {tf("siteIndexHeading")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-5 text-xs">
        {CATALOG_CATEGORY_ORDER.map(({ category, labelKey }) => {
          const entries = catalogByCategory(category);
          if (entries.length === 0) return null;
          return (
            <div key={category}>
              <p className="font-semibold mb-1.5 text-tx-primary">
                {t(`categories.${labelKey}`)}
              </p>
              <ul className="space-y-1">
                {entries.map((e) => (
                  <li key={e.path}>
                    <Link
                      href={`${prefix}${e.path}`}
                      className="link-hover"
                    >
                      {t(`tools.${e.labelKey}.label`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <div>
          <p className="font-semibold mb-1.5 text-tx-primary">
            {tf("links.blog")}
          </p>
          <ul className="space-y-1">
            <li>
              <Link href={`${prefix}/blog`} className="link-hover">
                {tf("links.blog")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
