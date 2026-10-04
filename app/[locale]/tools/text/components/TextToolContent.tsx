"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Clock,
  Gauge,
  Search,
  Hash,
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

interface TextToolContentProps {
  currentToolSlug?: string;
  richContent?: RichContent;
  faqs?: FaqItem[];
  locale: string;
}

export default function TextToolContent({
  currentToolSlug,
  richContent,
  faqs = [],
  locale,
}: TextToolContentProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  const allTools = [
    {
      slug: "word-counter",
      title:
        locale === "pt"
          ? "Contador de Palavras"
          : locale === "es"
            ? "Contador de Palabras"
            : "Word Counter",
      desc:
        locale === "pt"
          ? "Contagem completa de palavras, caracteres, frases e tempo de leitura"
          : locale === "es"
            ? "Conteo completo de palabras, caracteres, frases y tiempo de lectura"
            : "Complete word, character, sentence, and reading time counter",
      href: `${prefix}/tools/text/word-counter`,
      icon: <FileText className="w-4 h-4 text-primary" />,
    },
    {
      slug: "character-counter",
      title:
        locale === "pt"
          ? "Contador de Caracteres"
          : locale === "es"
            ? "Contador de Caracteres"
            : "Character Counter",
      desc:
        locale === "pt"
          ? "Contagem de caracteres com limites para Twitter/X, SMS, Meta e Instagram"
          : locale === "es"
            ? "Conteo de caracteres con límites para Twitter/X, SMS, Meta e Instagram"
            : "Character count with limits for Twitter/X, SMS, Meta, and Instagram",
      href: `${prefix}/tools/text/character-counter`,
      icon: <Hash className="w-4 h-4 text-primary" />,
    },
    {
      slug: "reading-time-calculator",
      title:
        locale === "pt"
          ? "Calculadora de Leitura"
          : locale === "es"
            ? "Calculadora de Lectura"
            : "Reading Time Calculator",
      desc:
        locale === "pt"
          ? "Tempo estimado de leitura e oratória com Speed Reader interativo"
          : locale === "es"
            ? "Tiempo estimado de lectura y discurso con Speed Reader interactivo"
            : "Estimated reading and speaking time with interactive Speed Reader",
      href: `${prefix}/tools/text/reading-time-calculator`,
      icon: <Clock className="w-4 h-4 text-primary" />,
    },
    {
      slug: "readability-checker",
      title:
        locale === "pt"
          ? "Verificador de Legibilidade"
          : locale === "es"
            ? "Verificador de Legibilidad"
            : "Readability Checker",
      desc:
        locale === "pt"
          ? "Pontuações Flesch Reading Ease, Flesch-Kincaid e Índice Gunning Fog"
          : locale === "es"
            ? "Puntuaciones Flesch Reading Ease, Flesch-Kincaid e Índice Gunning Fog"
            : "Flesch Reading Ease, Flesch-Kincaid Grade, and Gunning Fog scores",
      href: `${prefix}/tools/text/readability-checker`,
      icon: <Gauge className="w-4 h-4 text-primary" />,
    },
    {
      slug: "keyword-density-checker",
      title:
        locale === "pt"
          ? "Densidade de Palavras-Chave"
          : locale === "es"
            ? "Densidad de Palabras Clave"
            : "Keyword Density Checker",
      desc:
        locale === "pt"
          ? "Análise de frequência, termos N-gram e alerta contra keyword stuffing"
          : locale === "es"
            ? "Análisis de frecuencia, términos N-gram y alertas de sobreoptimización"
            : "Frequency analysis, N-gram phrases, and keyword stuffing detection",
      href: `${prefix}/tools/text/keyword-density-checker`,
      icon: <Search className="w-4 h-4 text-primary" />,
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
