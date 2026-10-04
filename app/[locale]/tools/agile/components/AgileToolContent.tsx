"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Columns3,
  CalendarDays,
  CreditCard,
  FileText,
  Clock,
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

interface AgileToolContentProps {
  currentToolSlug?: string;
  richContent?: RichContent;
  faqs?: FaqItem[];
  locale: string;
}

export default function AgileToolContent({
  currentToolSlug,
  richContent,
  faqs = [],
  locale,
}: AgileToolContentProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  const allTools = [
    {
      slug: "retro-board",
      title:
        locale === "pt"
          ? "Quadro de Retrospectiva"
          : locale === "es"
            ? "Tablero de Retrospectiva"
            : "Sprint Retrospective Board",
      desc:
        locale === "pt"
          ? "Retrospectiva de sprint com 3 colunas, votos por notas e exportação em Markdown"
          : locale === "es"
            ? "Retrospectiva de sprint con 3 columnas, votos en notas y exportación a Markdown"
            : "3-column sprint retro board with note voting and instant Markdown export",
      href: `${prefix}/tools/agile/retro-board`,
      icon: <Columns3 className="w-4 h-4 text-primary" />,
    },
    {
      slug: "standup-generator",
      title:
        locale === "pt"
          ? "Gerador de Standup Diário"
          : locale === "es"
            ? "Generador de Standup Diario"
            : "Daily Standup Generator",
      desc:
        locale === "pt"
          ? "Formate ontem, hoje e bloqueios em um resumo limpo pronto para colar no Slack ou Teams"
          : locale === "es"
            ? "Formatea ayer, hoy y bloqueos en un resumen listo para copiar en Slack o Teams"
            : "Format yesterday, today, and blockers into a clean summary ready for Slack or Teams",
      href: `${prefix}/tools/agile/standup-generator`,
      icon: <Clock className="w-4 h-4 text-primary" />,
    },
    {
      slug: "planning-poker",
      title: "Planning Poker",
      desc:
        locale === "pt"
          ? "Estimativa ágil com sequência Fibonacci sem viés de ancoragem para story points"
          : locale === "es"
            ? "Estimación ágil con cartas Fibonacci y votación sin sesgo de anclaje"
            : "Agile Fibonacci card estimation to reach consensus without anchoring bias",
      href: `${prefix}/tools/agile/planning-poker`,
      icon: <CreditCard className="w-4 h-4 text-primary" />,
    },
    {
      slug: "user-story-writer",
      title:
        locale === "pt"
          ? "Escritor de User Story"
          : locale === "es"
            ? "Creador de Historias de Usuario"
            : "User Story Writer",
      desc:
        locale === "pt"
          ? "Gere histórias de usuário INVEST com critérios de aceitação no formato Dado/Quando/Então"
          : locale === "es"
            ? "Genera historias de usuario INVEST con criterios de aceptación Dado/Cuando/Entonces"
            : "Generate INVEST user stories with Given/When/Then acceptance criteria",
      href: `${prefix}/tools/agile/user-story-writer`,
      icon: <FileText className="w-4 h-4 text-primary" />,
    },
    {
      slug: "sprint-date-calculator",
      title:
        locale === "pt"
          ? "Calculadora de Datas de Sprint"
          : locale === "es"
            ? "Calculadora de Fechas de Sprint"
            : "Sprint Date Calculator",
      desc:
        locale === "pt"
          ? "Calcule datas exatas de planejamento, standups úteis, revisão e retrospectiva"
          : locale === "es"
            ? "Calcula fechas de planificación, standups, revisión y retrospectiva del sprint"
            : "Calculate exact sprint planning, daily standup, review, and retro ceremony dates",
      href: `${prefix}/tools/agile/sprint-date-calculator`,
      icon: <CalendarDays className="w-4 h-4 text-primary" />,
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
                      <p className="leading-relaxed text-label font-mono text-sm sm:text-base">
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
                <p className="leading-relaxed text-label font-mono text-sm sm:text-base">
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
                <p className="leading-relaxed text-label font-mono text-sm sm:text-base">
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
                  <p className="leading-relaxed text-label font-mono text-sm sm:text-base">
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
                  <p className="leading-relaxed text-label font-mono text-sm sm:text-base">
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
                  className="p-4 bg-tertiary group-hover:border-primary/60 transition-colors h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      {tool.icon}
                      <h3 className="text-sm sm:text-base font-bold uppercase text-foreground group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                    </div>
                    <p className="text-sm text-label leading-relaxed line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-primary font-semibold mt-3.5 pt-2.5 border-t border-border/50">
                    <span>
                      {locale === "pt"
                        ? "Acessar ferramenta"
                        : locale === "es"
                          ? "Ir a la herramienta"
                          : "Open tool"}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
