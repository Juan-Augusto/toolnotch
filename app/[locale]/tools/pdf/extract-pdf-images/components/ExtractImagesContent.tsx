"use client";

import React from "react";
import { AppAccordion, AppTip } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";

export interface RichContent {
  whatIs: string;
  howToUse: string[];
  whyItMatters: string;
  proTip: string;
}

interface ExtractImagesContentProps {
  richContent?: RichContent;
  faqs: FaqItem[];
  locale: string;
}

export default function ExtractImagesContent({
  richContent,
  faqs,
  locale,
}: ExtractImagesContentProps) {
  return (
    <>
      {richContent && (
        <article className="space-y-6 sm:space-y-8 md:space-y-10 mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto">
          {richContent.howToUse && richContent.howToUse.length > 0 && (
            <section aria-labelledby="how-to-use-heading">
              <h2
                id="how-to-use-heading"
                className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-2.5 sm:mb-3.5"
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
                    <div className="w-7 h-7 rounded-[2px] bg-primary text-background font-bold text-xs flex items-center justify-center shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <p className="leading-relaxed text-label text-xs sm:text-sm">
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
                className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-2 sm:mb-3"
              >
                {locale === "pt"
                  ? "O que é"
                  : locale === "es"
                    ? "Qué es"
                    : "What is it"}
              </h2>
              <p className="leading-relaxed text-label text-xs sm:text-sm">
                {richContent.whatIs}
              </p>
            </section>
          )}

          {richContent.whyItMatters && (
            <section aria-labelledby="why-it-matters-heading">
              <h2
                id="why-it-matters-heading"
                className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-2 sm:mb-3"
              >
                {locale === "pt"
                  ? "Por que é importante"
                  : locale === "es"
                    ? "Por qué es importante"
                    : "Why it matters"}
              </h2>
              <p className="leading-relaxed text-label text-xs sm:text-sm">
                {richContent.whyItMatters}
              </p>
            </section>
          )}

          {richContent.proTip && (
            <AppTip title={locale === "pt" ? "Dica Pro" : locale === "es" ? "Consejo Pro" : "Pro Tip"}>
              {richContent.proTip}
            </AppTip>
          )}
        </article>
      )}

      {faqs && faqs.length > 0 && (
        <section
          aria-labelledby="faq-heading"
          className="max-w-4xl mx-auto pt-4 sm:pt-6 border-t border-border/80"
        >
          <h2
            id="faq-heading"
            className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-3 sm:mb-4 md:mb-6"
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
                <p className="leading-relaxed text-label text-xs sm:text-sm">
                  {faq.answer}
                </p>
              ),
            }))}
          />
        </section>
      )}
    </>
  );
}
