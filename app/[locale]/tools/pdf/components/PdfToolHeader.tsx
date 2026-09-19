"use client";

import React from "react";
import { AppBreadcrumb, AppBadge } from "@/components/ui";

export interface ToolBadge {
  text: string;
  icon?: React.ReactNode;
  bg?: string;
  textColor?: string;
}

export interface PdfToolHeaderProps {
  title: string;
  description: string;
  locale?: string;
  badges?: ToolBadge[];
}

export default function PdfToolHeader({
  title,
  description,
  locale = "pt",
  badges = [],
}: PdfToolHeaderProps) {
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const pdfToolsLabel =
    locale === "pt"
      ? "Ferramentas PDF"
      : locale === "es"
        ? "Herramientas PDF"
        : "PDF Tools";
  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <>
      <div className="w-full pb-2 sm:pb-3">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: prefix || "/" },
            { label: toolsLabel, href: `${prefix}/tools` },
            { label: pdfToolsLabel, href: `${prefix}/tools/pdf` },
            { label: title, current: true },
          ]}
        />
      </div>

      <header className="mb-4 sm:mb-6 md:mb-8 pt-1 sm:pt-2 pb-3.5 sm:pb-5 border-b border-border/80 relative">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground break-words">
          {title}
        </h1>
        <p className="leading-relaxed text-label mt-1.5 sm:mt-2 max-w-3xl text-xs sm:text-sm">
          {description}
        </p>

        {badges.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3.5">
            {badges.map((badge, idx) => (
              <AppBadge
                key={idx}
                bg={badge.bg || "bg-primary"}
                text={badge.textColor || "text-background"}
                icon={badge.icon}
              >
                {badge.text}
              </AppBadge>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
