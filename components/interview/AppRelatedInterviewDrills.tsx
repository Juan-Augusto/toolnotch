import AppInterviewCardItem from "./AppInterviewCardItem";
import {
  INTERVIEW_QUIZZES_DATA,
  INTERVIEW_I18N_LABELS,
  type InterviewCardData,
} from "./interviewHubConfig";

interface Props {
  currentSlug: string;
  locale?: string;
}

const RELATED_MAP: Record<string, string[]> = {
  typescript: ["vue", "nodejs-fundamentals", "system-architecture"],
  vue: ["typescript", "nodejs-fundamentals", "system-architecture"],
  "nodejs-fundamentals": [
    "typescript",
    "system-architecture",
    "database-design",
  ],
  "database-design": [
    "database-indexing",
    "system-architecture",
    "nodejs-fundamentals",
  ],
  "database-indexing": [
    "database-design",
    "system-architecture",
    "messaging-sqs-kafka",
  ],
  "messaging-sqs-kafka": [
    "rabbitmq-concepts",
    "system-architecture",
    "database-design",
  ],
  "rabbitmq-concepts": [
    "messaging-sqs-kafka",
    "system-architecture",
    "nodejs-fundamentals",
  ],
  "system-architecture": [
    "messaging-sqs-kafka",
    "database-design",
    "typescript",
  ],
};

const SECTION_TITLES = {
  pt: {
    heading: "Simulados Relacionados",
    subtitle:
      "Aprofunde sua preparação com outros tópicos essenciais cobrados em entrevistas técnicas.",
  },
  en: {
    heading: "Related Interview Drills",
    subtitle:
      "Deepen your interview prep with other essential topics tested in engineering interviews.",
  },
  es: {
    heading: "Simuladores Relacionados",
    subtitle:
      "Profundiza tu preparación con otros temas clave evaluados en entrevistas técnicas.",
  },
};

export function AppRelatedInterviewDrills({
  currentSlug,
  locale = "pt",
}: Props) {
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const labels =
    INTERVIEW_I18N_LABELS[currentLocale] || INTERVIEW_I18N_LABELS.en;
  const sectionText =
    SECTION_TITLES[currentLocale as keyof typeof SECTION_TITLES] ||
    SECTION_TITLES.en;

  const candidateSlugs = RELATED_MAP[currentSlug] || [];
  const relatedQuizzes: InterviewCardData[] = [];

  for (const slug of candidateSlugs) {
    const item = INTERVIEW_QUIZZES_DATA.find((q) => q.slug === slug);
    if (item) relatedQuizzes.push(item);
  }

  // Fallback if needed
  if (relatedQuizzes.length < 3) {
    for (const q of INTERVIEW_QUIZZES_DATA) {
      if (
        q.slug !== currentSlug &&
        !relatedQuizzes.some((r) => r.slug === q.slug)
      ) {
        relatedQuizzes.push(q);
        if (relatedQuizzes.length >= 3) break;
      }
    }
  }

  if (relatedQuizzes.length === 0) return null;

  return (
    <section
      className="w-full pt-10 pb-12 border-t-dashed-5"
      aria-labelledby="related-drills-heading"
    >
      <div className="mb-6">
        <h2
          id="related-drills-heading"
          className="font-mono text-lg sm:text-xl font-bold uppercase text-foreground mb-1.5"
        >
          {sectionText.heading}
        </h2>
        <p className="font-mono text-xs sm:text-sm text-label/90 leading-relaxed">
          {sectionText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {relatedQuizzes.slice(0, 3).map((quiz) => (
          <AppInterviewCardItem
            key={quiz.id}
            quiz={quiz}
            currentLocale={currentLocale}
            labels={labels}
          />
        ))}
      </div>
    </section>
  );
}

export default AppRelatedInterviewDrills;
