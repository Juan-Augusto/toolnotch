"use client";

import React from "react";
import { AppBreadcrumb } from "@/components/ui";

export interface MathToolHeaderProps {
  title: string;
  description: string;
  locale?: string;
}

export default function MathToolHeader({
  title,
  description,
  locale = "pt",
}: MathToolHeaderProps) {
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const mathLabel =
    locale === "pt"
      ? "Matemática & Cálculos"
      : locale === "es"
        ? "Matemáticas & Cálculos"
        : "Math & Calculations";
  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <>
      <div className="w-full pb-2 sm:pb-3">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: prefix || "/" },
            { label: toolsLabel, href: `${prefix}/tools` },
            { label: mathLabel, href: `${prefix}/tools` },
            { label: title, current: true },
          ]}
        />
      </div>

      <header className="mb-4 sm:mb-6 md:mb-8 pt-1 sm:pt-2 pb-1 relative">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono break-words">
          {title}
        </h1>
        <p className="leading-relaxed text-label mt-2 max-w-3xl text-sm">
          {description}
        </p>
      </header>
    </>
  );
}
