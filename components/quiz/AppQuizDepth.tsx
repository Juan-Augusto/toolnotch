import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { FaqItem } from "@/lib/schema";
import AppCard from "@/components/ui/AppCard";
import AppAccordion from "@/components/ui/AppAccordion";

// ── Types ────────────────────────────────────────────────────────────────────
export interface QuizDepthTable {
  heading: string;
  note?: string;
  cols: string[];
  rows: string[][];
}

export interface QuizDepthRelated {
  label: string;
  href: string;
  desc: string;
}

export interface QuizDepthResult {
  heading: string;
  body: string[];
}

export interface QuizDepthContent {
  metaTitle: string;
  metaDescription: string;
  about?: string;
  introHeading: string;
  intro: string[];
  table?: QuizDepthTable;
  faqHeading: string;
  faqs: FaqItem[];
  relatedHeading: string;
  related: QuizDepthRelated[];
  results?: Record<string, QuizDepthResult>;
}

/** Quiz slugs that have a rich `quizDepth.<key>` content block in the message files. */
export const QUIZ_DEPTH_KEYS: Record<string, string> = {
  "fifa-world-cup-winners": "fifaWorldCupWinners",
  "which-football-club-are-you": "whichFootballClub",
  "champions-league-trivia": "championsLeagueTrivia",
  "formula-1-trivia": "formula1Trivia",
  "which-f1-driver-are-you": "whichF1Driver",
  "what-is-your-love-language": "whatIsYourLoveLanguage",
};

/** Loads the locale-correct depth content for a quiz slug, or null when the slug has none. */
export async function getQuizDepthContent(
  slug: string,
  locale: string,
): Promise<QuizDepthContent | null> {
  const key = QUIZ_DEPTH_KEYS[slug];
  if (!key) return null;
  const t = await getTranslations({ locale, namespace: `quizDepth.${key}` });

  const localePrefix = locale === "en" ? "" : `/${locale}`;
  const related = (t.raw("related") as QuizDepthRelated[]).map((link) => ({
    ...link,
    href: link.href.startsWith("/") ? `${localePrefix}${link.href}` : link.href,
  }));

  const content: QuizDepthContent = {
    metaTitle: t("metaTitle"),
    metaDescription: t("metaDescription"),
    introHeading: t("introHeading"),
    intro: t.raw("intro") as string[],
    faqHeading: t("faqHeading"),
    faqs: t.raw("faqs") as FaqItem[],
    relatedHeading: t("relatedHeading"),
    related,
  };

  if (t.has("about")) content.about = t("about");
  if (t.has("table")) content.table = t.raw("table") as QuizDepthTable;
  if (t.has("results")) {
    content.results = t.raw("results") as Record<string, QuizDepthResult>;
  }

  return content;
}

// ── Component ────────────────────────────────────────────────────────────────
interface Props {
  content: QuizDepthContent;
  currentSlug: string;
}

/**
 * Server-rendered SEO depth block shown below the quiz player: intro prose,
 * an optional generic data table, a topic FAQ, and a cross-link cluster.
 * No H1 here: the quiz player renders the page H1.
 */
export default function AppQuizDepth({ content, currentSlug }: Props) {
  const { table } = content;

  return (
    <section className="w-full max-w-4xl mx-auto pb-16 space-y-12">
      {/* ── Intro Prose ── */}
      <div className="space-y-3">
        <h2 className=" text-lg sm:text-xl font-bold uppercase  text-foreground">
          {content.introHeading}
        </h2>

        <div className="space-y-3s text-label leading-loose">
          {content.intro.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* ── Optional Data Table (e.g. World Cup Winners 1930-2022) ── */}
      {table && (
        <div className="space-y-4">
          <h2 className=" text-lg sm:text-xl font-bold uppercase  text-foreground">
            {table.heading}
          </h2>

          <div className="overflow-x-auto rounded-[2px] border border-border/60 bg-card shadow-sm">
            <table className="w-full text-left border-collapse  ">
              <thead className="bg-tertiary/80 border-b border-border/60 text-foreground font-bold uppercase ">
                <tr>
                  {table.cols.map((col, idx) => (
                    <th
                      key={col}
                      scope="col"
                      className={`px-4 py-3 whitespace-nowrap ${idx === 0 ? "text-primary font-bold" : ""}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-foreground/90 divide-y divide-border/40">
                {table.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="even:bg-tertiary/20 hover:bg-tertiary/40 transition-colors"
                  >
                    {row.map((cell, ci) =>
                      ci === 0 ? (
                        <th
                          key={ci}
                          scope="row"
                          className="px-4 py-2.5 font-bold text-primary whitespace-nowrap"
                        >
                          {cell}
                        </th>
                      ) : (
                        <td
                          key={ci}
                          className={`px-4 py-2.5 whitespace-nowrap ${
                            ci === 2
                              ? "font-semibold text-foreground"
                              : "text-label"
                          }`}
                        >
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {table.note && (
            <p className=" text-xs text-label italic">{table.note}</p>
          )}
        </div>
      )}

      {/* ── Topic FAQ ── */}
      <div className="space-y-4">
        <h2 className=" text-lg sm:text-xl font-bold uppercase  text-foreground">
          {content.faqHeading}
        </h2>

        <AppAccordion
          groups={content.faqs.map((faq, i) => ({
            id: `depth-faq-${i}`,
            name: faq.question,
            content: (
              <p className="  leading-relaxed text-foreground/85">
                {faq.answer}
              </p>
            ),
            defaultOpen: i === 0,
          }))}
          className="w-full"
        />
      </div>

      <nav aria-label={content.relatedHeading} className="space-y-4">
        <h2 className=" text-lg sm:text-xl font-bold uppercase  text-foreground">
          {content.relatedHeading}
        </h2>

        <ul className="grid gap-3 sm:grid-cols-3">
          {content.related.map((link) => {
            const isCurrent = link.href.endsWith(`/${currentSlug}`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className="block group h-full select-none"
                >
                  <AppCard
                    hover
                    border
                    withCornerAccents={false}
                    className={`h-full flex flex-col justify-between p-5 transition-all ${
                      isCurrent ? "!border-primary bg-primary/10" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className=" text-[10px] text-primary font-bold uppercase">
                          QUIZ
                        </span>
                        {isCurrent && (
                          <span className=" text-[10px] text-background bg-primary px-1.5 py-0.5 rounded-[2px] font-bold">
                            ATUAL
                          </span>
                        )}
                      </div>
                      <span className=" font-bold  text-foreground uppercase group-hover:text-secondary transition-colors block">
                        {link.label}
                      </span>
                      <span className="mt-1.5  text-xs text-label leading-relaxed block">
                        {link.desc}
                      </span>
                    </div>
                  </AppCard>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
