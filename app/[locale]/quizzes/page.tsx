import type { Metadata } from "next";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  faqSchema,
  breadcrumbSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import { QUIZ_REGISTRY } from "@/lib/quizRegistry";
import { getQuizBySlug } from "@/lib/content/quizRepository";
import AppQuizzesHub, {
  type QuizCardData,
} from "@/components/quiz/AppQuizzesHub";
import AppBreadcrumb from "@/components/AppBreadcrumb";

const PATH = "/quizzes";

const HUB_META = {
  pt: {
    title: "Quizzes Gratuitos: Testes de Personalidade e Trivia | ToolNotch",
    description:
      "Faça testes de personalidade e quizzes interativos gratuitos sobre futebol, tecnologia e cultura. Descubra qual time você é, teste conhecimentos da Champions League e mais.",
    faqs: [
      {
        question: "Os quizzes de personalidade são confiáveis?",
        answer:
          "Os quizzes são criados para entretenimento e autorreflexão, não para diagnósticos clínicos. Eles exploram traços e preferências reais de forma lúdica.",
      },
      {
        question: "Os quizzes de trivia de futebol são difíceis?",
        answer:
          "Os quizzes variam de níveis básicos a desafios para especialistas. Cada pergunta revela uma explicação detalhada com fontes oficiais.",
      },
      {
        question: "Preciso me cadastrar para jogar?",
        answer:
          "Não. Todos os quizzes são 100% gratuitos e funcionam direto no navegador, sem necessidade de cadastro ou download.",
      },
      {
        question: "Posso refazer um quiz?",
        answer:
          "Sim! Ao terminar, basta clicar em Jogar Novamente para reiniciar com perguntas e alternativas em ordens dinâmicas.",
      },
      {
        question: "Como compartilho meu resultado?",
        answer:
          "Você pode copiar o link direto, compartilhar no WhatsApp e Twitter/X ou baixar um card exclusivo formatado para Stories.",
      },
    ],
  },
  es: {
    title: "Quizzes Gratis: Tests de Personalidad y Trivia | ToolNotch",
    description:
      "Haz tests de personalidad y trivias interactivas gratis sobre fútbol, tecnología y cultura. Descubre qué equipo eres, pon a prueba tus conocimientos y más.",
    faqs: [
      {
        question: "¿Los tests de personalidad son precisos?",
        answer:
          "Están diseñados para entretenimiento y autorreflexión, sin fines diagnósticos clínicos.",
      },
      {
        question: "¿Son difíciles las trivias de fútbol?",
        answer:
          "Hay trivias para todos los niveles, desde principiantes hasta apasionados del deporte, siempre con explicaciones y fuentes verificadas.",
      },
      {
        question: "¿Necesito registrarme para jugar?",
        answer:
          "No, todos los quizzes son 100% gratuitos y no requieren registro ni instalación.",
      },
      {
        question: "¿Puedo repetir un quiz?",
        answer:
          "Sí, puedes jugarlo cuantas veces quieras con alternativas ordenadas aleatoriamente en cada partida.",
      },
      {
        question: "¿Cómo comparto mi resultado?",
        answer:
          "Puedes copiar el enlace, compartir en WhatsApp y X o descargar una imagen especial para Stories.",
      },
    ],
  },
  en: {
    title: "Free Quizzes: Personality & Sports Trivia | ToolNotch",
    description:
      "Take free personality and sports trivia quizzes. Test your football knowledge with our FIFA World Cup and Champions League quizzes, or discover your personality type.",
    faqs: [
      {
        question: "Are these personality quizzes accurate?",
        answer:
          "These quizzes are designed for entertainment and self-reflection, not clinical diagnosis. They are inspired by personality research but are not scientifically validated tests.",
      },
      {
        question: "Are the sports trivia quizzes hard?",
        answer:
          "The sports trivia quizzes range from straightforward to challenging. Each question has an explanation so you can learn even when you get something wrong.",
      },
      {
        question: "Do I need to sign up to take a quiz?",
        answer:
          "No. All quizzes are completely free with no account required. Just click and start answering.",
      },
      {
        question: "Can I retake a quiz?",
        answer:
          'Yes, click "Retake Quiz" on the result screen to start over with fresh answers.',
      },
      {
        question: "How do I share my result?",
        answer:
          "Use the WhatsApp or Copy Link buttons on the result screen to share your result with friends.",
      },
    ],
  },
} as const;

async function buildQuizCards(locale: string): Promise<QuizCardData[]> {
  return Promise.all(
    QUIZ_REGISTRY.map(async (meta) => {
      const quiz = await getQuizBySlug(meta.id, locale);
      return {
        id: meta.id,
        title: quiz?.title ?? meta.id,
        description: quiz?.description ?? "",
        category:
          meta.category === "sports"
            ? "sports"
            : meta.category === "backend"
              ? "backend"
              : meta.category === "civic"
                ? "civic"
                : "personality",
        questionCount: quiz?.questions.length ?? 0,
        type: meta.type,
      };
    }),
  );
}

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const meta = HUB_META[currentLocale];
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywordsByLocale = {
    pt: [
      "quizzes online",
      "testes de personalidade",
      "quiz de futebol",
      "trivia",
      "qual time você é",
      "testes online grátis",
      "quizzes interativos",
    ],
    es: [
      "quizzes online",
      "tests de personalidad",
      "trivias de fútbol",
      "trivia",
      "qué equipo eres",
      "tests online gratis",
      "quizzes interactivos",
    ],
    en: [
      "online quizzes",
      "personality tests",
      "sports trivia",
      "football quiz",
      "interactive trivia",
      "free quizzes",
      "ToolNotch",
    ],
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: keywordsByLocale[currentLocale],
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function QuizzesHubPage({ params }: Props) {
  const { locale } = await params;
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const meta = HUB_META[currentLocale];
  const quizCards = await buildQuizCards(locale);
  const prefix = locale === "en" ? "" : `/${locale}`;
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";

  const jsonLd = buildJsonLd(
    faqSchema([...meta.faqs]),
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: "Quizzes", url: localizedPath(PATH, locale) },
    ]),
  );

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full pb-2">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: prefix || "/" },
            { label: "Quizzes", current: true },
          ]}
        />
      </div>
      <AppQuizzesHub quizzes={quizCards} locale={locale} />
    </main>
  );
}
