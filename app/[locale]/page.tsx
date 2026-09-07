import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/i18nMeta";
import AppCard from "@/components/AppCard";
import AppButton from "@/components/AppButton";

interface Props {
  params: Promise<{ locale: string }>;
}

export interface ToolItem {
  href: string;
  label: string;
  desc: string;
}

export interface Tool {
  index: number;
  category: string;
  color: string;
  items: ToolItem[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const cards = [
    {
      title: t("cards.tools.title"),
      desc: t("cards.tools.desc"),
      color: "primary" as const,
      href: "/",
    },
    {
      title: t("cards.quizzes.title"),
      desc: t("cards.quizzes.desc"),
      color: "secondary" as const,
      href: "/quizzes",
    },
    {
      title: t("cards.blog.title"),
      desc: t("cards.blog.desc"),
      color: "primary" as const,
      href: "/blog",
    },
    {
      title: t("cards.interview.title"),
      desc: t("cards.interview.desc"),
      color: "secondary" as const,
      href: "/interview",
    },
  ];

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background py-8">
      <div className="w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pt-14 pb-20">
        <div className="flex-1 max-w-4xl space-y-5 sm:space-y-6">
          <p className="font-mono text-xs sm:text-sm tracking-wider text-secondary">
            {t("caption")}
          </p>

          <h1 className="font-mono text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground dark:text-foreground leading-[1.2]">
            {t.rich("heading", {
              highlight: (chunks) => (
                <span className="text-primary">{chunks}</span>
              ),
            })}
          </h1>

          <p className="font-mono text-xs sm:text-sm text-label/90 dark:text-[#A8A8A8] max-w-lg leading-relaxed">
            {t("subheading")}
          </p>
        </div>

        <div className="shrink-0 self-end md:self-end pb-1 pr-2 sm:pr-8 md:pr-14 select-none">
          <span className="font-mono font-black text-6xl sm:text-7xl md:text-9xl text-secondary leading-0 inline-block">
            *
          </span>
        </div>
      </div>

      <div className="w-full pb-8 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0">
          {cards.map((card) => (
            <AppCard
              key={card.title}
              className="flex flex-col justify-between p-6 sm:p-7 min-h-[330px]"
            >
              <div>
                <h2 className="font-mono text-sm sm:text-base tracking-wider text-foreground dark:text-foreground uppercase">
                  {card.title}
                </h2>
                <p className="font-mono text-xs sm:text-sm text-label/80 dark:text-label mt-3 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-8">
                <Link href={card.href} className="inline-block">
                  <AppButton color={card.color} withArrow small>
                    {t("cards.button")}
                  </AppButton>
                </Link>
              </div>
            </AppCard>
          ))}
        </div>
      </div>
    </main>
  );
}
