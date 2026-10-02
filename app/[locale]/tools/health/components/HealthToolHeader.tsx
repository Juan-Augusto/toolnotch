"use client";

import React from "react";
import { AppBreadcrumb, AppBadge } from "@/components/ui";

export interface ToolBadge {
  text: string;
  icon?: React.ReactNode;
  bg?: string;
  textColor?: string;
}

export interface HealthToolHeaderProps {
  title: string;
  description: string;
  locale?: string;
  badges?: ToolBadge[];
}

export default function HealthToolHeader({
  title,
  description,
  locale = "pt",
  badges = [],
}: HealthToolHeaderProps) {
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const healthLabel =
    locale === "pt" ? "Saúde & Fitness" : locale === "es" ? "Salud & Fitness" : "Health & Fitness";
  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <>
      <div className="w-full pb-2 sm:pb-3">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: prefix || "/" },
            { label: toolsLabel, href: `${prefix}/tools` },
            { label: healthLabel, href: `${prefix}/tools/health` },
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

        {badges.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3.5">
            {badges.map((b, i) => (
              <AppBadge
                key={i}
                bg={b.bg || "bg-tertiary"}
                text={b.textColor || "text-foreground"}
                icon={b.icon}
              >
                {b.text}
              </AppBadge>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
