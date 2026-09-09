import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { QUIZ_REGISTRY } from "@/lib/quizRegistry";
import { TOOL_CATALOG } from "@/lib/toolCatalog";
import AppCard from "@/components/ui/AppCard";
import AppAccordion from "@/components/ui/AppAccordion";

interface Props {
  slug: string;
  locale: string;
}

const ABOUT_TEXT: Record<
  string,
  { heading: string; about: string; rulesHeading: string; rules: string[] }
> = {
  pt: {
    heading: "Sobre este quiz",
    about:
      "Este quiz interativo foi desenvolvido para oferecer uma experiência dinâmica, rápida e envolvente. Cada pergunta traz alternativas em ordem aleatória, e seu resultado é calculado imediatamente no final. Você pode refazer o teste quantas vezes desejar e compartilhar o resultado com seus amigos!",
    rulesHeading: "Destaques do quiz:",
    rules: [
      "100% gratuito e sem necessidade de cadastro",
      "Perguntas objetivas com feedback instantâneo",
      "Gere card personalizado e compartilhe seus resultados",
    ],
  },
  en: {
    heading: "About this quiz",
    about:
      "This interactive quiz is crafted to provide a quick, engaging, and dynamic experience. Questions feature randomized options and your final result is computed immediately upon completion. Retake anytime and share your score with friends!",
    rulesHeading: "Quiz highlights:",
    rules: [
      "100% free with no sign-up required",
      "Engaging questions with instant feedback",
      "Download custom story card and share with friends",
    ],
  },
  es: {
    heading: "Sobre este quiz",
    about:
      "Este quiz interactivo está diseñado para ofrecer una experiencia dinámica, rápida y entretenida. Las opciones se ordenan de manera aleatoria y tu resultado se calcula al instante al finalizar. ¡Puedes repetirlo cuantas veces quieras y compartirlo con tus amigos!",
    rulesHeading: "Puntos clave:",
    rules: [
      "100% gratis y sin registro",
      "Preguntas dinámicas con retroalimentación instantánea",
      "Descarga tu card personalizado y comparte en redes",
    ],
  },
};

export const FAQ_DATA: Record<
  string,
  { heading: string; items: { question: string; answer: string }[] }
> = {
  pt: {
    heading: "Perguntas frequentes",
    items: [
      {
        question: "Como funciona a pontuação do quiz?",
        answer:
          "Ao responder cada pergunta, o sistema calcula automaticamente suas preferências e escolhas para definir seu resultado final de forma precisa e instantânea.",
      },
      {
        question: "O quiz é totalmente gratuito?",
        answer:
          "Sim! 100% gratuito, sem necessidade de cadastro, download ou cartão de crédito.",
      },
      {
        question: "Posso refazer o quiz novamente?",
        answer:
          "Sim, você pode repetir o teste quantas vezes quiser. A cada tentativa, a ordem das opções de resposta é aleatória para garantir uma experiência dinâmica.",
      },
      {
        question: "Como compartilhar o resultado com amigos?",
        answer:
          "Ao finalizar o quiz, você pode copiar o link direto, compartilhar no WhatsApp e X (Twitter) ou baixar um card exclusivo com seu resultado formatado para Stories.",
      },
    ],
  },
  en: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "How is the quiz score computed?",
        answer:
          "As you answer each question, the engine calculates your traits and choices to generate your unique result instantly.",
      },
      {
        question: "Is this quiz completely free?",
        answer:
          "Yes! 100% free with no registration, download, or credit card required.",
      },
      {
        question: "Can I retake this quiz?",
        answer:
          "Yes, you can retake the quiz as many times as you like. Answer options are randomized on each attempt for a fresh experience.",
      },
      {
        question: "How can I share my result?",
        answer:
          "Upon completing the quiz, you can copy the link, share to WhatsApp and X, or download a custom story card.",
      },
    ],
  },
  es: {
    heading: "Preguntas frecuentes",
    items: [
      {
        question: "¿Cómo se calcula el resultado del quiz?",
        answer:
          "Al responder cada pregunta, el sistema procesa tus elecciones para determinar tu resultado de forma inmediata y precisa.",
      },
      {
        question: "¿El quiz es totalmente gratuito?",
        answer:
          "¡Sí! 100% gratuito, sin necesidad de registro ni tarjeta de crédito.",
      },
      {
        question: "¿Puedo repetir el quiz?",
        answer:
          "Sí, puedes repetir el test tantas veces como quieras. Las opciones se ordenan de forma aleatoria en cada intento.",
      },
      {
        question: "¿Cómo comparto mi resultado?",
        answer:
          "Al finalizar, puedes copiar el enlace directo, compartir en WhatsApp y X o descargar una imagen personalizada para Stories.",
      },
    ],
  },
};

/**
 * WS-5 item 1: topical-sibling cross-links for quizzes that don't have the
 * bespoke WS-3 depth cluster. Server-rendered <a href>, locale-prefixed,
 * anchored with the quiz name. Picks siblings in the same registry category,
 * limited to quizzes that have a localised label in `home.tools.*`.
 */
export default async function AppRelatedQuizzes({ slug, locale }: Props) {
  const meta = QUIZ_REGISTRY.find((q) => q.id === slug);
  const t = await getTranslations({ locale, namespace: "home" });
  const prefix = locale === "en" ? "" : `/${locale}`;
  const localizedAbout = ABOUT_TEXT[locale] ?? ABOUT_TEXT.en;
  const faqData = FAQ_DATA[locale] ?? FAQ_DATA.en;

  const labelled = new Map(
    TOOL_CATALOG.filter(
      (e) => e.kind === "quiz" && e.path.startsWith("/quiz/"),
    ).map((e) => [e.path, e.labelKey] as const),
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

  const faqGroups = faqData.items.map((item, idx) => ({
    id: `quiz-faq-${idx}`,
    name: item.question,
    content: (
      <p className=" text-xs sm:text-sm text-foreground/85 leading-relaxed">
        {item.answer}
      </p>
    ),
    defaultOpen: idx === 0,
  }));

  return (
    <section className="w-full pb-16 max-w-4xl mx-auto space-y-12">
      <div className="space-y-3">
        <h2 className=" text-lg sm:text-xl font-bold uppercase tracking-wider text-foreground">
          {localizedAbout.heading}
        </h2>

        <p className=" text-xs sm:text-sm text-label leading-relaxed">
          {localizedAbout.about}
        </p>

        <div className="pt-2">
          <span className="text-primary font-semibold uppercase block mb-2 tracking-wide">
            {localizedAbout.rulesHeading}
          </span>
          <ul className="space-y-1.5  text-label">
            {localizedAbout.rules.map((rule, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className=" text-lg sm:text-xl font-bold uppercase tracking-wider text-foreground">
          {faqData.heading}
        </h2>

        <AppAccordion groups={faqGroups} className="w-full" />
      </div>

      {picks.length >= 2 && (
        <nav aria-label="Related quizzes" className="space-y-4">
          <h2 className=" text-lg sm:text-xl font-bold uppercase tracking-wider text-foreground">
            {t("categories.quizzes")}
          </h2>

          <ul className="grid gap-3 sm:grid-cols-3">
            {picks.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="block group h-full select-none">
                  <AppCard
                    hover
                    border
                    withCornerAccents={false}
                    className="h-full flex flex-col justify-between p-5 transition-all"
                  >
                    <div>
                      <span className=" text-[10px] text-primary font-semibold tracking-wide uppercase mb-1.5 block">
                        QUIZ
                      </span>
                      <span className="font-semibold tracking-wide text-xs sm:text-sm text-foreground uppercase group-hover:text-secondary transition-colors block">
                        {p.label}
                      </span>
                    </div>
                  </AppCard>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
