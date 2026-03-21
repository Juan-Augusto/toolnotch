"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import AdUnit from "./AdUnit";
import FaqSection, { FaqItem } from "./FaqSection";

interface ToolWrapperProps {
  title: string;
  description: string;
  breadcrumbLabel: string;
  faqs: FaqItem[];
  adSlot?: string;
  children: React.ReactNode;
}

export default function ToolWrapper({
  title,
  description,
  breadcrumbLabel,
  faqs,
  adSlot,
  children,
}: ToolWrapperProps) {
  const t = useTranslations("toolWrapper");
  const tc = useTranslations("common");

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb + Back */}
        <div className="flex items-center justify-between mb-6">
          <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <Home size={14} />
              <span>{t("breadcrumb.home")}</span>
            </Link>
            <ChevronRight size={14} className="text-gray-400 dark:text-gray-600" />
            <span className="text-gray-700 font-medium dark:text-gray-200">{breadcrumbLabel}</span>
          </nav>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={14} />
            {t("allTools")}
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 dark:text-white">{title}</h1>
          <p className="text-gray-600 leading-relaxed mb-3 dark:text-gray-400">{description}</p>
          <span className="inline-block bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200 transition-colors dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
            {tc("privacyBadge")}
          </span>
        </div>

        {/* Top Ad */}
        {adSlot && (
          <div className="mb-6">
            <AdUnit slot={adSlot} />
          </div>
        )}

        {/* Tool Content */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
          {children}
        </div>

        {/* FAQ */}
        <FaqSection faqs={faqs} />
      </div>
    </main>
  );
}
