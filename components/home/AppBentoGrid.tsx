"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import AppCard from "@/components/AppCard";
import AppButton from "@/components/ui/AppButton";
import { localizedPath } from "@/lib/i18nMeta";

export interface BentoTranslations {
  badge: string;
  slogan?: string;
  allToolsButton: string;
  dev: {
    tag: string;
    title: string;
    desc: string;
    action: string;
    tabs: {
      json: string;
      jwt: string;
      uuid: string;
      regex: string;
    };
  };
  privacy: {
    tag: string;
    title: string;
    desc: string;
    clientBadge: string;
    zeroUploads: string;
    stat: string;
    action: string;
  };
  pdf: {
    tag: string;
    title: string;
    desc: string;
    action: string;
    merged: string;
    sizeSaved: string;
  };
  image: {
    tag: string;
    title: string;
    desc: string;
    action: string;
    savedLabel: string;
    qualityLabel: string;
  };
  interview: {
    tag: string;
    title: string;
    desc: string;
    action: string;
    difficulty: string;
  };
  quizzes: {
    tag: string;
    title: string;
    desc: string;
    action: string;
    tierLabel: string;
  };
  finance: {
    tag: string;
    title: string;
    desc: string;
    action: string;
    savedMetric: string;
  };
  quickFilters?: {
    all: string;
    popular: string;
    json: string;
    pdf: string;
    image: string;
    jwt: string;
    loan: string;
    interview: string;
  };
  categorySection?: {
    title: string;
    viewAll: string;
    toolsCount: string;
  };
}

interface Props {
  locale: string;
  bento: BentoTranslations;
  searchSlot?: React.ReactNode;
}

export default function AppBentoGrid({ locale, bento, searchSlot }: Props) {
  const isPt = locale === "pt";
  const isEs = locale === "es";

  const devTools = [
    {
      label: isEs ? "Formateador JSON" : isPt ? "Formatador JSON" : "JSON Formatter",
      desc: isEs ? "Validar y formatear JSON" : isPt ? "Formatar e validar JSON" : "Format & validate JSON data",
      href: "/tools/dev/json-formatter",
    },
    {
      label: isEs ? "Decodificador JWT" : isPt ? "Decodificador JWT" : "JWT Decoder",
      desc: isEs ? "Inspeccionar header y payload" : isPt ? "Inspecionar header e payload" : "Inspect tokens & claims",
      href: "/tools/dev/jwt-decoder",
    },
    {
      label: isEs ? "Generador UUID" : isPt ? "Gerador UUID" : "UUID Generator",
      desc: isEs ? "Identificadores v4 y v7" : isPt ? "Identificadores v4 e v7" : "RFC-compliant unique IDs",
      href: "/tools/dev/uuid-generator",
    },
    {
      label: isEs ? "Probador Regex" : isPt ? "Testador Regex" : "Regex Tester",
      desc: isEs ? "Pruebas de expresiones regulares" : isPt ? "Testar expressões regulares" : "Pattern testing & debug",
      href: "/tools/dev/regex-tester",
    },
  ];

  const pdfTools = [
    { label: isEs ? "Unir PDF" : isPt ? "Juntar PDF" : "Merge PDF", href: "/tools/pdf/merge-pdf" },
    { label: isEs ? "Comprimir PDF" : isPt ? "Comprimir PDF" : "Compress PDF", href: "/tools/pdf/compress-pdf" },
    { label: isEs ? "Dividir PDF" : isPt ? "Dividir PDF" : "Split PDF", href: "/tools/pdf/split-pdf" },
    { label: isEs ? "PDF a JPG" : isPt ? "PDF para JPG" : "PDF to JPG", href: "/tools/pdf/pdf-to-jpg" },
  ];

  const imageTools = [
    { label: isEs ? "Comprimir Imagen" : isPt ? "Comprimir Imagem" : "Compress Image", href: "/tools/image/image-compressor" },
    { label: isEs ? "Recortar Imagen" : isPt ? "Recortar Imagem" : "Crop Image", href: "/tools/image/crop-image" },
    { label: isEs ? "Redimensionar" : isPt ? "Redimensionar" : "Resize Image", href: "/tools/image/image-resizer" },
    { label: isEs ? "Convertir a WebP" : isPt ? "Converter para WebP" : "Convert to WebP", href: "/tools/image/convert-png-to-webp" },
  ];

  const financeTools = [
    { label: isEs ? "Calculadora de Préstamos" : isPt ? "Simulador de Empréstimo" : "Loan Calculator", href: "/tools/finance/loan-calculator" },
    { label: isEs ? "Calculadora de Hipoteca" : isPt ? "Financiamento Imobiliário" : "Mortgage Calculator", href: "/tools/finance/mortgage-calculator" },
    { label: isEs ? "Generador de Facturas" : isPt ? "Gerador de Fatura PDF" : "Invoice Generator", href: "/tools/finance/invoice-generator" },
    { label: isEs ? "Calculadora de Intereses" : isPt ? "Calculadora de Juros" : "Interest Calculator", href: "/tools/finance/interest-calculator" },
  ];

  const interviewTopics = [
    {
      label: isEs ? "Arquitectura de Sistemas" : isPt ? "Arquitetura de Sistemas" : "System Architecture",
      href: "/interview/system-architecture",
    },
    {
      label: isEs ? "Indexación de Bases de Datos" : isPt ? "Indexação de Banco de Dados" : "Database Indexing",
      href: "/interview/database-indexing",
    },
    {
      label: isEs ? "Fundamentos de TypeScript" : isPt ? "Fundamentos de TypeScript" : "TypeScript Fundamentals",
      href: "/interview/typescript",
    },
  ];

  const quizTopics = [
    {
      label: isEs ? "Trivia de Fórmula 1" : isPt ? "Quiz de Fórmula 1" : "Formula 1 Trivia",
      href: "/quiz/formula-1-trivia",
    },
    { label: isEs ? "Copa del Mundo" : isPt ? "Copa do Mundo" : "World Cup Trivia", href: "/quiz/fifa-world-cup-winners" },
    { label: isEs ? "Perfil de Programación" : isPt ? "Perfil de Programação" : "Coding Persona Quiz", href: "/quiz/which-programming-language-are-you" },
  ];

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">

        {/* ========================================================= */}
        {/* 1. HERO BRAND & SEARCH (Col 12)                           */}
        {/* ========================================================= */}
        <AppCard
          border
          cornerAccents={false}
          className="col-span-12 p-6 sm:p-8 md:p-9 bg-tertiary relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-4 flex-1 max-w-2xl">
              <div className="flex items-start justify-between gap-4 sm:block">
                <div className="space-y-1.5">
                  <span className="text-sm sm:text-base font-mono font-bold text-primary uppercase tracking-wider">
                    toolnotch*
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                    {bento.slogan || (isEs ? "Simple. Rápido. Seguro." : isPt ? "Simples. Rápido. Seguro." : "Simple. Fast. Secure.")}
                  </h1>
                </div>

                {/* Mobile-only star */}
                <div className="sm:hidden shrink-0 pt-1 select-none">
                  <svg
                    viewBox="0 0 256 256"
                    className="w-7 h-7 text-secondary fill-current shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M 152 70.059 L 201.539 20.519 L 235.48 54.461 L 185.941 104 L 256 104 L 256 152 L 185.941 152 L 235.48 201.539 L 201.539 235.48 L 152 185.941 L 152 256 L 104 256 L 104 185.941 L 54.46 235.48 L 20.52 201.539 L 70.059 152 L 0 152 L 0 104 L 70.059 104 L 20.519 54.46 L 54.461 20.52 L 104 70.059 L 104 0 L 152 0 Z" />
                  </svg>
                </div>
              </div>

              {searchSlot && (
                <div className="w-full pt-1">
                  {searchSlot}
                </div>
              )}
            </div>

            {/* Tablet & Desktop star (reduced to half) */}
            <div className="hidden sm:flex shrink-0 items-center justify-center self-center pr-2 md:pr-6 select-none">
              <svg
                viewBox="0 0 256 256"
                className="w-14 h-14 md:w-[72px] md:h-[72px] lg:w-[88px] lg:h-[88px] text-secondary fill-current shrink-0"
                aria-hidden="true"
              >
                <path d="M 152 70.059 L 201.539 20.519 L 235.48 54.461 L 185.941 104 L 256 104 L 256 152 L 185.941 152 L 235.48 201.539 L 201.539 235.48 L 152 185.941 L 152 256 L 104 256 L 104 185.941 L 54.46 235.48 L 20.52 201.539 L 70.059 152 L 0 152 L 0 104 L 70.059 104 L 20.519 54.46 L 54.461 20.52 L 104 70.059 L 104 0 L 152 0 Z" />
              </svg>
            </div>
          </div>
        </AppCard>

        {/* ========================================================= */}
        {/* 2. DEVELOPER TOOLS (Col 8 / 12)                           */}
        {/* ========================================================= */}
        <AppCard
          border
          cornerAccents={false}
          className="col-span-12 lg:col-span-8 flex flex-col justify-between p-6 sm:p-7 bg-tertiary space-y-5"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {bento.dev.title}
              </h2>
              <span className="text-sm font-mono text-muted-foreground">
                {isEs ? "10 herramientas" : isPt ? "10 ferramentas" : "10 tools"}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              {bento.dev.desc}
            </p>

            {/* Featured Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {devTools.map((tool) => (
                <Link
                  key={tool.label}
                  href={localizedPath(tool.href, locale)}
                  className="p-3 bg-background border border-border hover:border-primary/60 transition-colors flex flex-col justify-center group"
                >
                  <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {tool.label}
                  </span>
                  <span className="text-sm text-muted-foreground mt-0.5">
                    {tool.desc}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link href={localizedPath("/tools/dev", locale)}>
              <AppButton color="primary-2" withArrow>
                {bento.dev.action}
              </AppButton>
            </Link>
          </div>
        </AppCard>

        {/* ========================================================= */}
        {/* 3. SECURITY & PRIVACY CARD (Col 4 / 12)                   */}
        {/* ========================================================= */}
        <AppCard
          border
          cornerAccents={false}
          className="col-span-12 lg:col-span-4 flex flex-col justify-between p-6 sm:p-7 !bg-primary text-white dark:text-black !border-primary"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-[2px] bg-white/20 dark:bg-black/15 flex items-center justify-center text-white dark:text-black">
              <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9" strokeWidth={2} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-black tracking-tight leading-snug">
                {bento.privacy.title}
              </h2>
              <p className="text-sm text-white/90 dark:text-black/85 leading-relaxed">
                {bento.privacy.desc}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href={localizedPath("/tools", locale)}
              className="text-sm font-bold text-white dark:text-black hover:underline"
            >
              {bento.privacy.action} →
            </Link>
          </div>
        </AppCard>

        {/* ========================================================= */}
        {/* 4. PDF & DOCUMENTOS (Col 4 / 12)                         */}
        {/* ========================================================= */}
        <AppCard
          border
          cornerAccents={false}
          className="col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col justify-between p-5 sm:p-6 bg-tertiary space-y-4"
        >
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {bento.pdf.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {bento.pdf.desc}
            </p>

            {/* Simple list of links */}
            <div className="space-y-1.5 pt-1 text-sm">
              {pdfTools.map((tool) => (
                <Link
                  key={tool.label}
                  href={localizedPath(tool.href, locale)}
                  className="block p-2.5 bg-background border border-border hover:border-primary/60 text-foreground hover:text-primary font-medium transition-colors"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={localizedPath("/tools/pdf", locale)}
              className="text-sm font-semibold text-secondary hover:underline"
            >
              {bento.pdf.action} →
            </Link>
          </div>
        </AppCard>

        {/* ========================================================= */}
        {/* 4. IMAGENS & MÍDIA (Col 4 / 12)                          */}
        {/* ========================================================= */}
        <AppCard
          border
          cornerAccents={false}
          className="col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col justify-between p-5 sm:p-6 bg-tertiary space-y-4"
        >
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {bento.image.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {bento.image.desc}
            </p>

            {/* Simple list of links */}
            <div className="space-y-1.5 pt-1 text-sm">
              {imageTools.map((tool) => (
                <Link
                  key={tool.label}
                  href={localizedPath(tool.href, locale)}
                  className="block p-2.5 bg-background border border-border hover:border-primary/60 text-foreground hover:text-primary font-medium transition-colors"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={localizedPath("/tools/image", locale)}
              className="text-sm font-semibold text-secondary hover:underline"
            >
              {bento.image.action} →
            </Link>
          </div>
        </AppCard>

        {/* ========================================================= */}
        {/* 5. FINANÇAS & CÁLCULOS (Col 4 / 12)                      */}
        {/* ========================================================= */}
        <AppCard
          border
          cornerAccents={false}
          className="col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col justify-between p-5 sm:p-6 bg-tertiary space-y-4"
        >
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {bento.finance.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {bento.finance.desc}
            </p>

            {/* Simple list of links */}
            <div className="space-y-1.5 pt-1 text-sm">
              {financeTools.map((tool) => (
                <Link
                  key={tool.label}
                  href={localizedPath(tool.href, locale)}
                  className="block p-2.5 bg-background border border-border hover:border-primary/60 text-foreground hover:text-primary font-medium transition-colors"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={localizedPath("/tools/finance", locale)}
              className="text-sm font-semibold text-secondary hover:underline"
            >
              {bento.finance.action} →
            </Link>
          </div>
        </AppCard>

        {/* ========================================================= */}
        {/* 6. CAREER PREP & QUIZZES (Wide Split Card: Col 12)       */}
        {/* ========================================================= */}
        <AppCard
          border
          cornerAccents={false}
          className="col-span-12 p-6 sm:p-7 bg-tertiary"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Left: Technical Interview */}
            <div className="flex flex-col justify-between md:pr-6">
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {bento.interview.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {bento.interview.desc}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-sm">
                  {interviewTopics.map((topic) => (
                    <Link
                      key={topic.label}
                      href={localizedPath(topic.href, locale)}
                      className="px-3 py-1.5 bg-background border border-border hover:border-primary/60 text-foreground hover:text-primary font-medium transition-colors"
                    >
                      {topic.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-auto">
                <Link
                  href={localizedPath("/interview", locale)}
                  className="text-sm font-semibold text-secondary hover:underline inline-block"
                >
                  {bento.interview.action} →
                </Link>
              </div>
            </div>

            {/* Right: Quizzes & Trivia */}
            <div className="flex flex-col justify-between pt-6 md:pt-0 md:pl-6">
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {bento.quizzes.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {bento.quizzes.desc}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-sm">
                  {quizTopics.map((quiz) => (
                    <Link
                      key={quiz.label}
                      href={localizedPath(quiz.href, locale)}
                      className="px-3 py-1.5 bg-background border border-border hover:border-primary/60 text-foreground hover:text-primary font-medium transition-colors"
                    >
                      {quiz.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-auto">
                <Link
                  href={localizedPath("/quizzes", locale)}
                  className="text-sm font-semibold text-secondary hover:underline inline-block"
                >
                  {bento.quizzes.action} →
                </Link>
              </div>
            </div>
          </div>
        </AppCard>

      </div>
    </section>
  );
}
