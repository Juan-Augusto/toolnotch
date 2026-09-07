"use client";

import Link from "next/link";
import AppMenu, { MenuGroup } from "@/components/ui/AppMenu";
import AppCard from "@/components/ui/AppCard";

export interface QuizCardData {
  id: string;
  title: string;
  description: string;
  category: "sports" | "personality" | "backend" | "civic";
  questionCount: number;
}

export interface AppQuizzesHubProps {
  quizzes: QuizCardData[];
  locale?: string;
}

const CATEGORY_CONFIG: Record<
  string,
  {
    name: Record<string, string>;
    badgeColor: string;
  }
> = {
  sports: {
    name: {
      pt: "ESPORTES",
      es: "DEPORTES",
      en: "SPORTS",
    },
    badgeColor: "bg-secondary",
  },
  personality: {
    name: {
      pt: "PERSONALIDADE",
      es: "PERSONALIDAD",
      en: "PERSONALITY",
    },
    badgeColor: "bg-primary",
  },
  backend: {
    name: {
      pt: "BACKEND",
      es: "BACKEND",
      en: "BACKEND",
    },
    badgeColor: "bg-secondary",
  },
  civic: {
    name: {
      pt: "CÍVICO & MÍDIA",
      es: "CÍVICO Y MEDIOS",
      en: "CIVIC & MEDIA LITERACY",
    },
    badgeColor: "bg-primary",
  },
};

const HEADING_BY_LOCALE: Record<string, string> = {
  pt: "TODOS OS QUIZZES",
  es: "TODOS LOS QUIZZES",
  en: "ALL QUIZZES",
};

export function AppQuizzesHub({ quizzes, locale = "pt" }: AppQuizzesHubProps) {
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const mainHeading = HEADING_BY_LOCALE[currentLocale] || HEADING_BY_LOCALE.en;

  const categoryKeys: ("sports" | "personality" | "backend" | "civic")[] = [
    "sports",
    "personality",
    "backend",
    "civic",
  ];

  const groupedCategories = categoryKeys
    .map((key) => {
      const config = CATEGORY_CONFIG[key];
      const categoryQuizzes = quizzes.filter((q) => q.category === key);
      return {
        id: key,
        name: config.name[currentLocale] || config.name.en,
        badgeColor: config.badgeColor,
        quizzes: categoryQuizzes,
      };
    })
    .filter((group) => group.quizzes.length > 0);

  const menuGroups: MenuGroup[] = groupedCategories.map((group) => ({
    name: group.name,
    items: group.quizzes.map((quiz) => ({
      name: quiz.title,
      link: `/quiz/${quiz.id}`,
    })),
  }));

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-background">
      <AppMenu
        groups={menuGroups}
        className="md:min-h-screen shrink-0 border-r-dashed-5"
      />

      <main className="flex-1 min-w-0 container-page py-10 md:py-16">
        <div className="flex items-center gap-2.5 mb-12 md:mb-16 select-none">
          <span className="font-mono text-base md:text-lg font-bold text-primary">
            ///
          </span>
          <h1 className="font-mono text-base md:text-lg font-bold uppercase tracking-wider text-foreground">
            {mainHeading}
          </h1>
        </div>

        <div className="space-y-16 md:space-y-20">
          {groupedCategories.map((group) => (
            <section key={group.id} id={`category-${group.id}`}>
              <div className="flex items-center gap-2.5 mb-8 select-none">
                <span className={`w-3.5 h-3.5 ${group.badgeColor} rounded-[1px]`} />
                <h2 className="font-mono text-sm md:text-base font-bold uppercase tracking-wider text-foreground">
                  {group.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 -space-x-px -space-y-px">
                {group.quizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/quiz/${quiz.id}`}
                    className="block group relative z-0 hover:z-10"
                  >
                    <AppCard className="h-full !p-8 md:!p-9 hover:bg-tertiary/40 transition-colors">
                      <h3 className="font-mono text-sm md:text-base font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors mb-3">
                        {quiz.title}
                      </h3>
                      <p className="font-mono text-sm text-label/80 leading-relaxed line-clamp-2">
                        {quiz.description}
                      </p>
                    </AppCard>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AppQuizzesHub;
