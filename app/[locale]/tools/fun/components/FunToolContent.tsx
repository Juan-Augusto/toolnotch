"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Disc,
  Disc3,
  HelpCircle,
  Coins,
  Dice5,
  UserCheck,
  GraduationCap,
  Gift,
  Binary,
  Users,
  Keyboard,
} from "lucide-react";
import { AppAccordion, AppTip, AppCard } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import AppAffiliateOffers from "@/components/AppAffiliateOffers";
import AppAffiliateStickyBar from "@/components/AppAffiliateStickyBar";

export interface RichContent {
  whatIs?: string;
  howToUse?: string[];
  whyItMatters?: string;
  proTip?: string;
  sections?: { heading: string; body: string }[];
}

interface FunToolContentProps {
  currentToolSlug?: string;
  richContent?: RichContent;
  faqs?: FaqItem[];
  locale: string;
}

export default function FunToolContent({
  currentToolSlug,
  richContent,
  faqs = [],
  locale,
}: FunToolContentProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  const allTools = [
    {
      slug: "yes-or-no-wheel",
      title:
        locale === "pt"
          ? "Roleta Sim ou Não"
          : locale === "es"
            ? "Ruleta Sí o No"
            : "Yes or No Wheel",
      desc:
        locale === "pt"
          ? "Decisão aleatória instantânea entre Sim, Não ou Talvez com animação de giro"
          : locale === "es"
            ? "Decisión aleatoria instantánea entre Sí, No o Quizás con giro visual"
            : "Instant random decision between Yes, No, or Maybe with spin animation",
      href: `${prefix}/tools/fun/yes-or-no-wheel`,
      icon: <HelpCircle className="w-4 h-4 text-primary" />,
    },
    {
      slug: "spin-the-wheel",
      title:
        locale === "pt"
          ? "Girar a Roleta"
          : locale === "es"
            ? "Girar la Ruleta"
            : "Spin the Wheel",
      desc:
        locale === "pt"
          ? "Roleta personalizada para decisões aleatórias com salvamento e compartilhamento por URL"
          : locale === "es"
            ? "Ruleta personalizable para decisiones aleatorias con enlace para compartir"
            : "Customizable decision wheel saved to URL for effortless sharing",
      href: `${prefix}/tools/fun/spin-the-wheel`,
      icon: <Disc className="w-4 h-4 text-primary" />,
    },
    {
      slug: "wheel-of-names",
      title:
        locale === "pt"
          ? "Wheel of Names"
          : locale === "es"
            ? "Ruleta de Nombres"
            : "Wheel of Names",
      desc:
        locale === "pt"
          ? "Alternativa gratuita ao Wheel of Names para sorteios, aulas e decisões em grupo"
          : locale === "es"
            ? "Alternativa gratuita a Wheel of Names para sorteos, clases y eventos"
            : "Free Wheel of Names alternative for raffles, classrooms, and group picks",
      href: `${prefix}/tools/fun/wheel-of-names`,
      icon: <Disc3 className="w-4 h-4 text-primary" />,
    },
    {
      slug: "coin-flip",
      title:
        locale === "pt"
          ? "Cara ou Coroa"
          : locale === "es"
            ? "Cara o Cruz"
            : "Coin Flip",
      desc:
        locale === "pt"
          ? "Lançamento de moeda virtual realista com animação 3D e histórico de resultados"
          : locale === "es"
            ? "Lanzamiento de moneda virtual realista con animación 3D e historial"
            : "Realistic 3D virtual coin toss with live flip history and fair randomness",
      href: `${prefix}/tools/fun/coin-flip`,
      icon: <Coins className="w-4 h-4 text-primary" />,
    },
    {
      slug: "dice-roller",
      title:
        locale === "pt"
          ? "Rolador de Dados"
          : locale === "es"
            ? "Lanzador de Dados"
            : "Dice Roller",
      desc:
        locale === "pt"
          ? "Rolagem de dados 3D poliédricos (d4 a d100) com suporte a notação RPG avançada"
          : locale === "es"
            ? "Tirada de dados 3D poliédricos (d4 a d100) con soporte para notación de rol"
            : "Polyhedral 3D dice roller (d4 to d100) supporting custom RPG notation",
      href: `${prefix}/tools/fun/dice-roller`,
      icon: <Dice5 className="w-4 h-4 text-primary" />,
    },
    {
      slug: "random-name-picker",
      title:
        locale === "pt"
          ? "Sorteador de Nomes"
          : locale === "es"
            ? "Selector de Nombres"
            : "Random Name Picker",
      desc:
        locale === "pt"
          ? "Sorteie nomes aleatoriamente de uma lista com animação de roleta e opção sem repetição"
          : locale === "es"
            ? "Sortea nombres al azar con animación de carrete y opción sin repetición"
            : "Pick random names from any list with reel animation and without replacement",
      href: `${prefix}/tools/fun/random-name-picker`,
      icon: <UserCheck className="w-4 h-4 text-primary" />,
    },
    {
      slug: "classroom-name-picker",
      title:
        locale === "pt"
          ? "Sorteador Escolar"
          : locale === "es"
            ? "Sorteador para Clase"
            : "Classroom Name Picker",
      desc:
        locale === "pt"
          ? "Chame alunos de forma justa e sem repetições para participação em sala de aula"
          : locale === "es"
            ? "Llama a estudiantes de forma equitativa y sin repetición en el aula"
            : "Call on students fairly without repeats for engaging classroom participation",
      href: `${prefix}/tools/fun/classroom-name-picker`,
      icon: <GraduationCap className="w-4 h-4 text-primary" />,
    },
    {
      slug: "giveaway-picker",
      title:
        locale === "pt"
          ? "Sorteador de Prêmios"
          : locale === "es"
            ? "Sorteador de Premios"
            : "Giveaway Picker",
      desc:
        locale === "pt"
          ? "Sorteador imparcial e transparente de vencedores para sorteios e redes sociais"
          : locale === "es"
            ? "Selector imparcial y transparente de ganadores para sorteos en redes"
            : "Transparent and fair random winner picker for giveaways, streams, and contests",
      href: `${prefix}/tools/fun/giveaway-picker`,
      icon: <Gift className="w-4 h-4 text-primary" />,
    },
    {
      slug: "random-number-generator",
      title:
        locale === "pt"
          ? "Gerador de Números"
          : locale === "es"
            ? "Generador de Números"
            : "Random Number Generator",
      desc:
        locale === "pt"
          ? "Gere números aleatórios em qualquer intervalo, únicos ou com repetição e ordenação"
          : locale === "es"
            ? "Genera números aleatorios en cualquier rango, únicos o con duplicados"
            : "Generate random numbers in any custom range, with batch and sorting options",
      href: `${prefix}/tools/fun/random-number-generator`,
      icon: <Binary className="w-4 h-4 text-primary" />,
    },
    {
      slug: "random-team-generator",
      title:
        locale === "pt"
          ? "Gerador de Equipes"
          : locale === "es"
            ? "Generador de Equipos"
            : "Team Generator",
      desc:
        locale === "pt"
          ? "Distribua participantes em times equilibrados por número de grupos ou membros"
          : locale === "es"
            ? "Divide participantes en equipos equilibrados por número de grupos o tamaño"
            : "Equitably split any list of participants into balanced groups and teams",
      href: `${prefix}/tools/fun/random-team-generator`,
      icon: <Users className="w-4 h-4 text-primary" />,
    },
    {
      slug: "typing-test",
      title:
        locale === "pt"
          ? "Teste de Digitação"
          : locale === "es"
            ? "Test de Mecanografía"
            : "Typing Speed Test",
      desc:
        locale === "pt"
          ? "Meça sua velocidade em WPM e precisão com cronômetros de 15s, 30s, 60s ou 120s"
          : locale === "es"
            ? "Mide tu velocidad WPM y precisión con cronómetro de 15s, 30s, 60s o 120s"
            : "Test typing speed (WPM) and accuracy with 15s, 30s, 60s, or 120s challenges",
      href: `${prefix}/tools/fun/typing-test`,
      icon: <Keyboard className="w-4 h-4 text-primary" />,
    },
  ];

  const relatedTools = allTools
    .filter((t) => t.slug !== currentToolSlug)
    .slice(0, 3);

  return (
    <>
      <div className="max-w-4xl mx-auto w-full">
        <AppAffiliateOffers />

        {richContent && (
          <article className="space-y-6 sm:space-y-8 md:space-y-10 mb-6 sm:mb-8 md:mb-10 w-full">
            {richContent.howToUse && richContent.howToUse.length > 0 && (
              <section aria-labelledby="how-to-use-heading">
                <h2
                  id="how-to-use-heading"
                  className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground font-mono mb-2.5 sm:mb-3.5"
                >
                  {locale === "pt"
                    ? "Como Usar"
                    : locale === "es"
                      ? "Cómo Usar"
                      : "How to Use"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                  {richContent.howToUse.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 sm:p-3.5 md:p-4 bg-tertiary border border-border rounded-[2px] flex items-start gap-2.5 sm:gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-[2px] bg-primary text-background font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <p className="leading-relaxed text-label font-mono text-xs sm:text-sm">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {richContent.whatIs && (
              <section aria-labelledby="what-is-heading">
                <h2
                  id="what-is-heading"
                  className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground font-mono mb-2 sm:mb-3"
                >
                  {locale === "pt"
                    ? "O Que É Esta Ferramenta?"
                    : locale === "es"
                      ? "¿Qué Es Esta Herramienta?"
                      : "What Is This Tool?"}
                </h2>
                <p className="leading-relaxed text-label font-mono text-xs sm:text-sm">
                  {richContent.whatIs}
                </p>
              </section>
            )}

            {richContent.whyItMatters && (
              <section aria-labelledby="why-it-matters-heading">
                <h2
                  id="why-it-matters-heading"
                  className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground font-mono mb-2 sm:mb-3"
                >
                  {locale === "pt"
                    ? "Por Que Isso Importa?"
                    : locale === "es"
                      ? "¿Por Qué Importa?"
                      : "Why It Matters"}
                </h2>
                <p className="leading-relaxed text-label font-mono text-xs sm:text-sm">
                  {richContent.whyItMatters}
                </p>
              </section>
            )}

            {richContent.sections &&
              richContent.sections.map((sec, i) => (
                <section key={i}>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground font-mono mb-2 sm:mb-3">
                    {sec.heading}
                  </h2>
                  <p className="leading-relaxed text-label font-mono text-xs sm:text-sm">
                    {sec.body}
                  </p>
                </section>
              ))}

            {richContent.proTip && (
              <AppTip
                title={
                  locale === "pt"
                    ? "Dica Pro"
                    : locale === "es"
                      ? "Consejo Pro"
                      : "Pro Tip"
                }
              >
                {richContent.proTip}
              </AppTip>
            )}
          </article>
        )}

        {faqs && faqs.length > 0 && (
          <section
            aria-labelledby="faqs-heading"
            className="mb-6 sm:mb-8 md:mb-12 w-full"
          >
            <h2
              id="faqs-heading"
              className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground font-mono mb-3 sm:mb-4 md:mb-6"
            >
              {locale === "pt"
                ? "Perguntas Frequentes"
                : locale === "es"
                  ? "Preguntas Frecuentes"
                  : "Frequently Asked Questions"}
            </h2>
            <AppAccordion
              groups={faqs.map((faq, index) => ({
                id: `faq-${index}`,
                name: faq.question,
                content: (
                  <p className="leading-relaxed text-label font-mono text-xs sm:text-sm">
                    {faq.answer}
                  </p>
                ),
              }))}
            />
          </section>
        )}

        <section
          aria-labelledby="related-tools-heading"
          className="mb-6 sm:mb-8 md:mb-12 w-full font-mono"
        >
          <h2
            id="related-tools-heading"
            className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-3 sm:mb-4 md:mb-6"
          >
            {locale === "pt"
              ? "Ferramentas Relacionadas"
              : locale === "es"
                ? "Herramientas Relacionadas"
                : "Related Tools"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {relatedTools.map((tool, idx) => (
              <Link key={idx} href={tool.href} className="group block">
                <AppCard
                  border
                  cornerAccents={false}
                  className="p-3.5 sm:p-4 bg-tertiary group-hover:border-primary/60 transition-colors h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {tool.icon}
                      <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                    </div>
                    <p className="text-xs text-label leading-relaxed line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary font-semibold mt-3 pt-2 border-t border-border/50">
                    <span>
                      {locale === "pt"
                        ? "Acessar ferramenta"
                        : locale === "es"
                          ? "Ir a la herramienta"
                          : "Open tool"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </AppCard>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <AppAffiliateStickyBar />
    </>
  );
}
