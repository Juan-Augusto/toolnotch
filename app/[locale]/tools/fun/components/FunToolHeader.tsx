"use client";

import React from "react";
import { AppBreadcrumb } from "@/components/ui";

export interface FunToolHeaderProps {
  title: string;
  description: string;
  locale?: string;
}

export default function FunToolHeader({
  title,
  description,
  locale = "pt",
}: FunToolHeaderProps) {
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const funLabel =
    locale === "pt"
      ? "Diversão & Aleatório"
      : locale === "es"
        ? "Diversión y Azar"
        : "Fun & Random";
  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <>
      <div className="w-full pb-2 sm:pb-3">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: prefix || "/" },
            { label: toolsLabel, href: `${prefix}/tools` },
            { label: funLabel, href: `${prefix}/tools/fun` },
            { label: title, current: true },
          ]}
        />
      </div>

      <header className="mb-4 sm:mb-6 md:mb-8 pt-1 sm:pt-2 pb-3.5 sm:pb-5 border-b border-border/80 relative">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono break-words">
          {title}
        </h1>
        <p className="leading-relaxed text-label mt-1.5 sm:mt-2 max-w-3xl text-xs sm:text-sm">
          {description}
        </p>
      </header>
    </>
  );
}
