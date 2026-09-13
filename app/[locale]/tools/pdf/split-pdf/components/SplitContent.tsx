"use client";

import { AppAccordion, AppTip } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";

export interface RichContent {
  whatIs: string;
  howToUse: string[];
  whyItMatters: string;
  proTip: string;
}

interface SplitContentProps {
  richContent?: RichContent;
  faqs: FaqItem[];
  locale: string;
}

export default function SplitContent({
  richContent,
  faqs,
  locale,
}: SplitContentProps) {
  return (
    <>
      {richContent && (
        <article className="space-y-10 mb-12 max-w-4xl mx-auto">
          {richContent.howToUse && richContent.howToUse.length > 0 && (
            <section aria-labelledby="how-to-use-heading">
              <h2
                id="how-to-use-heading"
                className="text-lg sm:text-xl font-bold uppercase text-foreground font-mono mb-4"
              >
                {locale === "pt"
                  ? "Como Usar"
                  : locale === "es"
                    ? "Cómo Usar"
                    : "How to Use"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {richContent.howToUse.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-tertiary border border-border rounded-[2px] flex items-start gap-3.5"
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
                className="text-lg sm:text-xl font-bold uppercase text-foreground font-mono mb-3"
              >
                {locale === "pt"
                  ? "O que é Divisão de PDF?"
                  : locale === "es"
                    ? "¿Qué es la División de PDF?"
                    : "What Is PDF Splitting?"}
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
                className="text-lg sm:text-xl font-bold uppercase text-foreground font-mono mb-3"
              >
                {locale === "pt"
                  ? "Por que Isso Importa"
                  : locale === "es"
                    ? "Por Qué Es Importante"
                    : "Why It Matters"}
              </h2>
              <p className="leading-relaxed text-label font-mono text-xs sm:text-sm">
                {richContent.whyItMatters}
              </p>
            </section>
          )}

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
        <section aria-labelledby="faqs-heading" className="mb-12 mx-auto max-w-4xl">
          <h2
            id="faqs-heading"
            className="text-lg sm:text-xl font-bold uppercase text-foreground font-mono mb-6"
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
    </>
  );
}
