"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Scale, Flame, TrendingDown } from "lucide-react";
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

interface HealthToolContentProps {
  currentToolSlug?: string;
  richContent?: RichContent;
  faqs?: FaqItem[];
  locale: string;
  extraContent?: React.ReactNode;
}

export default function HealthToolContent({
  currentToolSlug,
  richContent,
  faqs = [],
  locale,
  extraContent,
}: HealthToolContentProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  const allTools = [
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
          ? "Descubra se o seu peso corporal está na faixa considerada ideal pela Organização Mundial da Saúde (OMS)"
          : locale === "es"
            ? "Descubre si tu peso corporal está en el rango saludable según los criterios de la OMS"
            : "Determine if your body weight falls within a healthy range using WHO classification criteria",
      href: `${prefix}/tools/health/bmi-calculator`,
      icon: <Scale className="w-5 h-5 text-primary" />,
    },
    {
      slug: "tdee-calculator",
      title:
        locale === "pt"
          ? "Calculadora de TDEE (Gasto Diário)"
          : locale === "es"
            ? "Calculadora de TDEE (Gasto Diario)"
            : "TDEE Calculator",
      desc:
        locale === "pt"
          ? "Calcule seu gasto energético diário total com a fórmula de Mifflin-St Jeor para manter ou regular seu peso"
          : locale === "es"
            ? "Calcula tu gasto energético diario total con la fórmula Mifflin-St Jeor para regular tu peso"
            : "Calculate total daily calories burned based on Mifflin-St Jeor equation and lifestyle activity",
      href: `${prefix}/tools/health/tdee-calculator`,
      icon: <Flame className="w-5 h-5 text-primary" />,
    },
    {
      slug: "calorie-deficit-calculator",
      title:
        locale === "pt"
          ? "Calculadora de Déficit Calórico"
          : locale === "es"
            ? "Calculadora de Déficit Calórico"
            : "Calorie Deficit Calculator",
      desc:
        locale === "pt"
          ? "Descubra a meta exata de calorias para emagrecer com saúde de forma gradual e sem perder massa muscular"
          : locale === "es"
            ? "Descubre tu ingesta calórica diaria óptima para perder grasa de forma gradual y sostenible"
            : "Calculate the exact daily caloric deficit required to achieve sustainable fat loss without muscle wasting",
      href: `${prefix}/tools/health/calorie-deficit-calculator`,
      icon: <TrendingDown className="w-5 h-5 text-primary" />,
    },
  ];

  const relatedTools = allTools.filter((t) => t.slug !== currentToolSlug);

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
                      ? "¿Por Que Importa?"
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
                    ? "Dica de Saúde"
                    : locale === "es"
                      ? "Consejo de Salud"
                      : "Health Tip"
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
              ? "Ferramentas de Saúde Relacionadas"
              : locale === "es"
                ? "Herramientas de Salud Relacionadas"
                : "Related Health Tools"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {relatedTools.map((tool, idx) => (
              <Link key={idx} href={tool.href} className="group block">
                <div className="p-4 sm:p-5 bg-tertiary border border-border hover:border-foreground/20 hover:bg-tertiary/80 rounded-[2px] transition-colors h-full flex flex-col justify-between">
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
