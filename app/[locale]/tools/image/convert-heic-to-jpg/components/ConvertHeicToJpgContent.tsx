"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Crop, Scaling, Sparkles } from "lucide-react";
import { AppAccordion, AppTip, AppCard } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";

export interface RichContent {
  whatIs: string;
  howToUse: string[];
  whyItMatters: string;
  proTip: string;
}

interface ConvertHeicToJpgContentProps {
  richContent?: RichContent;
  faqs: FaqItem[];
  locale: string;
}

export default function ConvertHeicToJpgContent({
  richContent,
  faqs,
  locale,
}: ConvertHeicToJpgContentProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  const relatedTools = [
    {
      title:
        locale === "pt"
          ? "Converter PNG para WebP"
          : locale === "es"
            ? "Convertir PNG a WebP"
            : "Convert PNG to WebP",
      desc:
        locale === "pt"
          ? "Otimize fotos e imagens para carregamento ultrarrápido em sites"
          : locale === "es"
            ? "Optimiza fotos e imágenes para carga ultrarrápida en sitios web"
            : "Optimize photos and pictures for blazing fast web page loading",
      href: `${prefix}/tools/image/convert-png-to-webp`,
      icon: <Sparkles className="w-4 h-4 text-primary" />,
    },
    {
      title:
        locale === "pt"
          ? "Redimensionar Imagem"
          : locale === "es"
            ? "Redimensionar Imagen"
            : "Image Resizer",
      desc:
        locale === "pt"
          ? "Redimensione fotos da câmera do iPhone por pixels ou porcentagem"
          : locale === "es"
            ? "Redimensiona fotos de la cámara del iPhone por píxeles o porcentaje"
            : "Resize high-resolution iPhone camera shots by pixels or percentage",
      href: `${prefix}/tools/image/image-resizer`,
      icon: <Scaling className="w-4 h-4 text-primary" />,
    },
    {
      title:
        locale === "pt"
          ? "Recortar Imagem"
          : locale === "es"
            ? "Recortar Imagen"
            : "Crop Image",
      desc:
        locale === "pt"
          ? "Recorte fotografias em proporções de redes sociais (1:1, 16:9, 9:16)"
          : locale === "es"
            ? "Recorta fotos para redes sociales en proporciones 1:1, 16:9 y 9:16"
            : "Crop photos for social media with 1:1, 16:9, and 9:16 ratios",
      href: `${prefix}/tools/image/crop-image`,
      icon: <Crop className="w-4 h-4 text-primary" />,
    },
  ];

  return (
    <>
      {richContent && (
        <article className="space-y-6 sm:space-y-8 md:space-y-10 mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto">
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
                  ? "O que é o Formato HEIC e por que converter para JPG?"
                  : locale === "es"
                    ? "¿Qué es el Formato HEIC y por qué convertir a JPG?"
                    : "What is HEIC Format and why convert to JPG?"}
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
                  ? "Compatibilidade Universal em Qualquer Aparelho"
                  : locale === "es"
                    ? "Compatibilidad Universal en Cualquier Dispositivo"
                    : "Universal Compatibility on Any Device"}
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
                  ? "Dica para iPhone"
                  : locale === "es"
                    ? "Consejo para iPhone"
                    : "iPhone Tip"
              }
            >
              {richContent.proTip}
            </AppTip>
          )}
        </article>
      )}

      {/* Perguntas Frequentes */}
      {faqs && faqs.length > 0 && (
        <section
          aria-labelledby="faqs-heading"
          className="mb-6 sm:mb-8 md:mb-12 mx-auto max-w-4xl"
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

      {/* Ferramentas Relacionadas */}
      <section
        aria-labelledby="related-tools-heading"
        className="mb-6 sm:mb-8 md:mb-12 mx-auto max-w-4xl font-mono"
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
    </>
  );
}
