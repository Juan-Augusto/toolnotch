"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Percent, CalendarDays, Scale } from "lucide-react";
import { AppAccordion, AppTip } from "@/components/ui";
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

interface MathToolContentProps {
  currentToolSlug?: string;
  richContent?: RichContent;
  faqs?: FaqItem[];
  locale: string;
  extraContent?: React.ReactNode;
}

export default function MathToolContent({
  currentToolSlug = "age-calculator",
  richContent,
  faqs = [],
  locale,
  extraContent,
}: MathToolContentProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  const allTools = [
    {
      slug: "percentage-calculator",
      title:
        locale === "pt"
          ? "Calculadora de Porcentagem"
          : locale === "es"
            ? "Calculadora de Porcentaje"
            : "Percentage Calculator",
      desc:
        locale === "pt"
          ? "Calcule descontos, aumentos percentuais e variações relativas rapidamente"
          : locale === "es"
            ? "Calcula descuentos, aumentos porcentuales y variaciones relativas rápidamente"
            : "Calculate percentage increases, discounts, and relative variations instantly",
      href: `${prefix}/tools/convert/percentage-calculator`,
      icon: <Percent className="w-5 h-5 text-primary" />,
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
          ? "Planeje ciclos de sprint ágil com datas de planning, review e dias úteis"
          : locale === "es"
            ? "Planifica ciclos ágiles de sprint con fechas de planning, review y días hábiles"
            : "Plan agile sprint cycles with planning, review dates, and working days",
      href: `${prefix}/tools/agile/sprint-date-calculator`,
      icon: <CalendarDays className="w-5 h-5 text-primary" />,
    },
    {
      slug: "bmi-calculator",
      title:
        locale === "pt"
          ? "Calculadora de IMC"
          : locale === "es"
            ? "Calculadora de IMC"
            : "BMI Calculator",
      desc:
        locale === "pt"
          ? "Calcule seu Índice de Massa Corporal e veja a faixa recomendada pela OMS"
          : locale === "es"
            ? "Calcula tu Índice de Masa Corporal y descubre el rango recomendado por la OMS"
            : "Calculate your Body Mass Index and evaluate WHO classification standards",
      href: `${prefix}/tools/health/bmi-calculator`,
      icon: <Scale className="w-5 h-5 text-primary" />,
    },
  ];

  const relatedTools = allTools.filter((t) => t.slug !== currentToolSlug);

  return (
    <>
      <div className="max-w-4xl mx-auto w-full mt-10 sm:mt-14">
        <AppAffiliateOffers />

        {extraContent && (
          <div className="mb-8 sm:mb-10 w-full">{extraContent}</div>
        )}

        {richContent && (
          <article className="space-y-6 sm:space-y-8 md:space-y-10 mb-6 sm:mb-8 md:mb-10 w-full">
            {richContent.howToUse && richContent.howToUse.length > 0 && (
              <section aria-labelledby="how-to-use-heading">
                <h2
                  id="how-to-use-heading"
                  className="text-lg sm:text-xl font-bold uppercase text-foreground font-mono mb-3 sm:mb-4"
                >
                  {locale === "pt"
                    ? "Como Usar"
                    : locale === "es"
                      ? "Cómo Usar"
                      : "How to Use"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {richContent.howToUse.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 bg-tertiary rounded-[2px] flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-[2px] bg-primary text-background font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <p className="leading-relaxed text-foreground text-sm">
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
                  className="text-lg sm:text-xl font-bold uppercase text-foreground font-mono mb-2 sm:mb-3"
                >
                  {locale === "pt"
                    ? "O Que É Esta Ferramenta?"
                    : locale === "es"
                      ? "¿Qué Es Esta Herramienta?"
                      : "What Is This Tool?"}
                </h2>
                <p className="leading-relaxed text-label text-sm">
                  {richContent.whatIs}
                </p>
              </section>
            )}

            {richContent.whyItMatters && (
              <section aria-labelledby="why-it-matters-heading">
                <h2
                  id="why-it-matters-heading"
                  className="text-lg sm:text-xl font-bold uppercase text-foreground font-mono mb-2 sm:mb-3"
                >
                  {locale === "pt"
                    ? "Por Que Isso Importa?"
                    : locale === "es"
                      ? "¿Por Qué Importa?"
                      : "Why It Matters"}
                </h2>
                <p className="leading-relaxed text-label text-sm">
                  {richContent.whyItMatters}
                </p>
              </section>
            )}

            {richContent.sections &&
              richContent.sections.map((sec, i) => (
                <section key={i}>
                  <h2 className="text-lg sm:text-xl font-bold uppercase text-foreground font-mono mb-2 sm:mb-3">
                    {sec.heading}
                  </h2>
                  <p className="leading-relaxed text-label text-sm">
                    {sec.body}
                  </p>
                </section>
              ))}

            {richContent.proTip && (
              <AppTip
                title={
                  locale === "pt"
                    ? "Dica Útil"
                    : locale === "es"
                      ? "Consejo Útil"
                      : "Helpful Tip"
                }
              >
                <span className="text-sm leading-relaxed">
                  {richContent.proTip}
                </span>
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
              className="text-lg sm:text-xl font-bold uppercase text-foreground font-mono mb-3 sm:mb-4 md:mb-6"
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
                  <p className="leading-relaxed text-label text-sm">
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
            className="text-lg sm:text-xl font-bold uppercase text-foreground mb-3 sm:mb-4 md:mb-6"
          >
            {locale === "pt"
              ? "Ferramentas Relacionadas"
              : locale === "es"
                ? "Herramientas Relacionadas"
                : "Related Tools"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {relatedTools.map((tool, idx) => (
              <Link key={idx} href={tool.href} className="group block">
                <div className="p-4 sm:p-5 bg-tertiary hover:bg-tertiary/80 rounded-[2px] transition-colors h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      {tool.icon}
                      <h3 className="text-sm font-bold uppercase text-foreground group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-label leading-relaxed line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-primary font-semibold mt-3 pt-2">
                    <span>
                      {locale === "pt"
                        ? "Acessar ferramenta"
                        : locale === "es"
                          ? "Ir a la herramienta"
                          : "Open tool"}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <AppAffiliateStickyBar />
    </>
  );
}
