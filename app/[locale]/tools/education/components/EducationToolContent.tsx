"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Calculator,
  Award,
  BookOpen,
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

interface EducationToolContentProps {
  currentToolSlug?: string;
  richContent?: RichContent;
  faqs?: FaqItem[];
  locale: string;
  extraContent?: React.ReactNode;
}

export default function EducationToolContent({
  currentToolSlug,
  richContent,
  faqs = [],
  locale,
  extraContent,
}: EducationToolContentProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  const allTools = [
    {
      slug: "gpa-calculator",
      title:
        locale === "pt"
          ? "Calculadora de GPA"
          : locale === "es"
            ? "Calculadora de GPA"
            : "GPA Calculator",
      desc:
        locale === "pt"
          ? "Calcule seu GPA semestral ponderado por créditos nas escalas 4.0, 20 e 10"
          : locale === "es"
            ? "Calcula tu GPA semestral ponderado por créditos en escalas 4.0, 20 y 10"
            : "Calculate your credit-weighted semester GPA across 4.0, 20, and 10 scales",
      href: `${prefix}/tools/education/gpa-calculator`,
      icon: <GraduationCap className="w-4 h-4 text-primary" />,
    },
    {
      slug: "cumulative-gpa-calculator",
      title:
        locale === "pt"
          ? "Calculadora de GPA Acumulado"
          : locale === "es"
            ? "Calculadora de GPA Acumulado"
            : "Cumulative GPA Calculator",
      desc:
        locale === "pt"
          ? "Combine seu GPA histórico com novas notas para prever sua média final acumulada"
          : locale === "es"
            ? "Combina tu GPA histórico con nuevas notas para proyectar tu promedio acumulado"
            : "Combine prior GPA with new grades to project your overall cumulative standing",
      href: `${prefix}/tools/education/cumulative-gpa-calculator`,
      icon: <Calculator className="w-4 h-4 text-primary" />,
    },
    {
      slug: "grade-calculator",
      title:
        locale === "pt"
          ? "Calculadora de Nota Necessária"
          : locale === "es"
            ? "Calculadora de Nota Necesaria"
            : "Grade Calculator",
      desc:
        locale === "pt"
          ? "Descubra a nota exata que você precisa tirar na prova final para atingir sua meta"
          : locale === "es"
            ? "Descubre la nota exacta que necesitas en el examen final para alcanzar tu meta"
            : "Find the exact final exam score required to secure your target course grade",
      href: `${prefix}/tools/education/grade-calculator`,
      icon: <Award className="w-4 h-4 text-primary" />,
    },
    {
      slug: "citation-generator",
      title:
        locale === "pt"
          ? "Gerador de Citações ABNT & APA"
          : locale === "es"
            ? "Generador de Citas APA & MLA"
            : "Citation Generator",
      desc:
        locale === "pt"
          ? "Formate referências bibliográficas para sites, livros e artigos em ABNT, APA e MLA"
          : locale === "es"
            ? "Formatea referencias de sitios, libros y revistas en estilos APA, MLA y Chicago"
            : "Format reliable references for websites, books, and journals in APA, MLA, and Chicago",
      href: `${prefix}/tools/education/citation-generator`,
      icon: <BookOpen className="w-4 h-4 text-primary" />,
    },
  ];

  const relatedTools = allTools
    .filter((t) => t.slug !== currentToolSlug)
    .slice(0, 3);

  return (
    <>
      <div className="max-w-4xl mx-auto w-full mt-10 sm:mt-14">
        <AppAffiliateOffers />

        {extraContent && (
          <div className="mb-8 sm:mb-10 w-full">
            {extraContent}
          </div>
        )}

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
                    ? "Dica Acadêmica"
                    : locale === "es"
                      ? "Consejo Académico"
                      : "Academic Tip"
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
              ? "Ferramentas Educacionais Relacionadas"
              : locale === "es"
                ? "Herramientas Educativas Relacionadas"
                : "Related Educational Tools"}
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
