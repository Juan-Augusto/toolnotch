"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, Home, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import AdUnit from "./AdUnit";
import FaqSection, { FaqItem } from "./FaqSection";
import { AD_SLOTS } from "@/lib/adSlots";

interface RichContent {
  whatIs: string;
  howToUse: string[];
  whyItMatters: string;
  proTip: string;
}

interface ToolWrapperProps {
  title: string;
  description: string;
  breadcrumbLabel: string;
  faqs: FaqItem[];
  adSlot?: string;
  richContent?: RichContent;
  children: React.ReactNode;
  maxWidth?: string;
  noCardWrapper?: boolean;
}

export default function ToolWrapper({
  title,
  description,
  breadcrumbLabel,
  faqs,
  adSlot,
  richContent,
  children,
  maxWidth,
  noCardWrapper,
}: ToolWrapperProps) {
  const t = useTranslations("toolWrapper");
  const tc = useTranslations("common");

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className={`${maxWidth ?? "max-w-3xl"} mx-auto px-4 py-8`}>
        {/* Breadcrumb + Back */}
        <div className="flex items-center justify-between mb-10 no-print">
          <nav
            className="flex items-center gap-1.5 text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
            >
              <Home size={13} />
              <span>{t("breadcrumb.home")}</span>
            </Link>
            <ChevronRight size={12} className="mt-1" />
            <span className="text-sm  ">{breadcrumbLabel}</span>
          </nav>

          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft size={13} />
            {t("allTools")}
          </Link>
        </div>

        {/* Header */}
        <header className="text-center mb-10 animate-fade-in-up no-print">
          <h1
            className="text-4xl font-bold tracking-tight mb-3"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            {title}
          </h1>
          <p
            className="leading-relaxed mb-5 max-w-lg mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
          <span className="badge-neon">
            <ShieldCheck size={14} />
            {tc("privacyBadge")}
          </span>
        </header>

        {/* Top Ad */}
        <div className="mb-6 no-print">
          <AdUnit slot={adSlot ?? AD_SLOTS.TOOL_TOP} />
        </div>

        {/* Tool card */}
        {noCardWrapper ? (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "60ms" }}
          >
            {children}
          </div>
        ) : (
          <div
            className="card-neon p-6 animate-fade-in-up"
            style={{ animationDelay: "60ms" }}
          >
            {children}
          </div>
        )}

        {/* Rich content */}
        {richContent && Array.isArray(richContent.howToUse) && (
          <div
            className="mt-12 space-y-8 animate-fade-in-up no-print"
            style={{
              color: "var(--text-secondary)",
              animationDelay: "120ms",
            }}
          >
            <section>
              <h2 className="text-xl font-bold mb-3 section-heading">
                {t("whatIs", { title })}
              </h2>
              <p className="leading-relaxed">{richContent.whatIs}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 section-heading">
                {t("howToUse")}
              </h2>
              <ol className="list-decimal list-inside space-y-2">
                {richContent.howToUse.map((step, i) => (
                  <li key={i} className="leading-relaxed pl-1">
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 section-heading">
                {t("whyItMatters")}
              </h2>
              <p className="leading-relaxed">{richContent.whyItMatters}</p>
            </section>

            <div className="protip-neon">
              <p
                className="text-xs font-bold mb-1.5 uppercase tracking-widest"
                style={{ color: "var(--neon)" }}
              >
                {t("proTip")}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {richContent.proTip}
              </p>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="no-print">
          <FaqSection faqs={faqs} />
        </div>
      </div>
    </main>
  );
}
