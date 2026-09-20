"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Home,
  Car,
  DollarSign,
  PieChart,
  Percent,
  GraduationCap,
  Scale,
  RefreshCw,
  Zap,
  Landmark,
} from "lucide-react";
import { AppAccordion, AppTip, AppCard } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import AppAffiliateOffers from "@/components/AppAffiliateOffers";
import AppAffiliateStickyBar from "@/components/AppAffiliateStickyBar";

export interface RichContent {
  whatIs?: string;
  howToUse?: string[];
  whyItMatters?: string;
  proTip?: string;
  sections?: { heading: string; body: string }[];
}

interface FinanceToolContentProps {
  currentToolSlug?: string;
  richContent?: RichContent;
  faqs?: FaqItem[];
  locale: string;
}

export default function FinanceToolContent({
  currentToolSlug,
  richContent,
  faqs = [],
  locale,
}: FinanceToolContentProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  const allTools = [
    {
      slug: "loan-calculator",
      title:
        locale === "pt"
          ? "Calculadora de Empréstimo"
          : locale === "es"
            ? "Calculadora de Préstamos"
            : "Loan Calculator",
      desc:
        locale === "pt"
          ? "Parcelas mensais, juros totais e amortização para qualquer empréstimo"
          : locale === "es"
            ? "Cuotas mensuales, intereses totales y amortización para préstamos"
            : "Monthly payment, total interest, and amortization for any loan",
      href: `${prefix}/tools/finance/loan-calculator`,
      icon: <Calculator className="w-4 h-4 text-primary" />,
    },
    {
      slug: "mortgage-calculator",
      title:
        locale === "pt"
          ? "Financiamento Imobiliário"
          : locale === "es"
            ? "Hipoteca Inmobiliaria"
            : "Mortgage Calculator",
      desc:
        locale === "pt"
          ? "Simule financiamentos de imóveis com prazos de 15 a 30 anos"
          : locale === "es"
            ? "Simula hipotecas con plazos de 15 a 30 años"
            : "Calculate mortgage payments with 15 to 30 year terms",
      href: `${prefix}/tools/finance/mortgage-calculator`,
      icon: <Home className="w-4 h-4 text-primary" />,
    },
    {
      slug: "15-year-mortgage-calculator",
      title:
        locale === "pt"
          ? "Financiamento de 15 Anos"
          : locale === "es"
            ? "Hipoteca de 15 Años"
            : "15-Year Mortgage",
      desc:
        locale === "pt"
          ? "Parcelas e economia massiva de juros no prazo de 15 anos"
          : locale === "es"
            ? "Cuotas y gran ahorro en intereses a 15 años"
            : "Monthly payments and massive interest savings on a 15-year term",
      href: `${prefix}/tools/finance/15-year-mortgage-calculator`,
      icon: <Home className="w-4 h-4 text-primary" />,
    },
    {
      slug: "30-year-mortgage-calculator",
      title:
        locale === "pt"
          ? "Financiamento de 30 Anos"
          : locale === "es"
            ? "Hipoteca de 30 Años"
            : "30-Year Mortgage",
      desc:
        locale === "pt"
          ? "Simule a menor parcela mensal e o cronograma completo de 30 anos"
          : locale === "es"
            ? "Simula la menor cuota mensual y el cronograma a 30 años"
            : "Calculate lowest monthly payments and 30-year amortization schedule",
      href: `${prefix}/tools/finance/30-year-mortgage-calculator`,
      icon: <Home className="w-4 h-4 text-primary" />,
    },
    {
      slug: "car-loan-calculator",
      title:
        locale === "pt"
          ? "Financiamento de Veículos"
          : locale === "es"
            ? "Préstamo de Coche"
            : "Car Loan Calculator",
      desc:
        locale === "pt"
          ? "Descubra a parcela do financiamento automotivo e custo final"
          : locale === "es"
            ? "Descubre la cuota del préstamo automotriz y el coste final"
            : "Auto loan monthly payments, interest rates, and total cost",
      href: `${prefix}/tools/finance/car-loan-calculator`,
      icon: <Car className="w-4 h-4 text-primary" />,
    },
    {
      slug: "amortization-calculator",
      title:
        locale === "pt"
          ? "Tabela de Amortização"
          : locale === "es"
            ? "Tabla de Amortización"
            : "Amortization Calculator",
      desc:
        locale === "pt"
          ? "Cronograma detalhado mês a mês entre principal e juros"
          : locale === "es"
            ? "Calendario detallado mes a mes entre principal e intereses"
            : "Full payment schedule showing principal, interest, and balance",
      href: `${prefix}/tools/finance/amortization-calculator`,
      icon: <PieChart className="w-4 h-4 text-primary" />,
    },
    {
      slug: "home-affordability-calculator",
      title:
        locale === "pt"
          ? "Poder de Compra de Imóvel"
          : locale === "es"
            ? "Capacidad de Compra"
            : "Home Affordability",
      desc:
        locale === "pt"
          ? "Descubra o valor máximo de imóvel que cabe na sua renda (regra 28/36)"
          : locale === "es"
            ? "Descubre el valor máximo de inmueble según tus ingresos"
            : "How much house you can afford using standard debt-to-income rules",
      href: `${prefix}/tools/finance/home-affordability-calculator`,
      icon: <Scale className="w-4 h-4 text-primary" />,
    },
    {
      slug: "refinance-calculator",
      title:
        locale === "pt"
          ? "Calculadora de Refinanciamento"
          : locale === "es"
            ? "Refinanciación de Préstamo"
            : "Refinance Calculator",
      desc:
        locale === "pt"
          ? "Descubra se vale a pena refinanciar e o ponto de equilíbrio (break-even)"
          : locale === "es"
            ? "Calcula si conviene refinanciar y tu punto de equilibrio"
            : "Compare interest savings and calculate your refinance break-even point",
      href: `${prefix}/tools/finance/refinance-calculator`,
      icon: <RefreshCw className="w-4 h-4 text-primary" />,
    },
    {
      slug: "interest-calculator",
      title:
        locale === "pt"
          ? "Calculadora de Juros"
          : locale === "es"
            ? "Calculadora de Intereses"
            : "Interest Calculator",
      desc:
        locale === "pt"
          ? "Cálculo detalhado de juros simples e compostos ao longo do tempo"
          : locale === "es"
            ? "Cálculo detallado de intereses a lo largo del tiempo"
            : "Calculate total simple and compound interest over time",
      href: `${prefix}/tools/finance/interest-calculator`,
      icon: <Percent className="w-4 h-4 text-primary" />,
    },
    {
      slug: "debt-payoff-calculator",
      title:
        locale === "pt"
          ? "Quitação de Dívidas"
          : locale === "es"
            ? "Liquidación de Deudas"
            : "Debt Payoff Calculator",
      desc:
        locale === "pt"
          ? "Simule quitação acelerada com pagamentos extras e economia de juros"
          : locale === "es"
            ? "Simula pagos acelerados con aportes extras y ahorro de intereses"
            : "Calculate accelerated payoff with extra payments and interest saved",
      href: `${prefix}/tools/finance/debt-payoff-calculator`,
      icon: <Zap className="w-4 h-4 text-primary" />,
    },
    {
      slug: "personal-loan-calculator",
      title:
        locale === "pt"
          ? "Empréstimo Pessoal"
          : locale === "es"
            ? "Préstamo Personal"
            : "Personal Loan Calculator",
      desc:
        locale === "pt"
          ? "Cálculo de crédito pessoal e consolidação de dívidas"
          : locale === "es"
            ? "Cálculo de crédito personal y consolidación de deudas"
            : "Personal loan monthly payments and debt consolidation options",
      href: `${prefix}/tools/finance/personal-loan-calculator`,
      icon: <DollarSign className="w-4 h-4 text-primary" />,
    },
    {
      slug: "student-loan-calculator",
      title:
        locale === "pt"
          ? "Empréstimo Estudantil"
          : locale === "es"
            ? "Préstamo Estudiantil"
            : "Student Loan Calculator",
      desc:
        locale === "pt"
          ? "Simule o pagamento e quitação de financiamento educacional"
          : locale === "es"
            ? "Simula los pagos de tu préstamo estudiantil"
            : "Student loan repayment plans and payoff timeline",
      href: `${prefix}/tools/finance/student-loan-calculator`,
      icon: <GraduationCap className="w-4 h-4 text-primary" />,
    },
    {
      slug: "fha-loan-calculator",
      title:
        locale === "pt"
          ? "Empréstimo FHA"
          : locale === "es"
            ? "Préstamo FHA"
            : "FHA Loan Calculator",
      desc:
        locale === "pt"
          ? "Simule financiamentos FHA com entrada reduzida de 3,5%"
          : locale === "es"
            ? "Simula préstamos FHA con entrada baja del 3,5%"
            : "Calculate FHA loans with low 3.5% down payment options",
      href: `${prefix}/tools/finance/fha-loan-calculator`,
      icon: <Landmark className="w-4 h-4 text-primary" />,
    },
    {
      slug: "va-loan-calculator",
      title:
        locale === "pt"
          ? "Empréstimo VA"
          : locale === "es"
            ? "Préstamo VA"
            : "VA Loan Calculator",
      desc:
        locale === "pt"
          ? "Financiamentos sem entrada e sem seguro hipotecário para veteranos"
          : locale === "es"
            ? "Préstamos sin entrada y sin PMI para veteranos"
            : "Zero down payment and zero PMI mortgage calculations for veterans",
      href: `${prefix}/tools/finance/va-loan-calculator`,
      icon: <Landmark className="w-4 h-4 text-primary" />,
    },
  ];

  const relatedTools = allTools
    .filter((t) => t.slug !== currentToolSlug)
    .slice(0, 3);

  return (
    <>
      <div className="max-w-4xl mx-auto w-full">
        <AppAffiliateOffers />

        {richContent && (
          <article className="space-y-6 sm:space-y-8 md:space-y-10 mb-6 sm:mb-8 md:mb-10 w-full">
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
                    ? "O Que É Esta Ferramenta?"
                    : locale === "es"
                      ? "¿Qué Es Esta Herramienta?"
                      : "What Is This Tool?"}
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
                    ? "Por Que Isso Importa?"
                    : locale === "es"
                      ? "¿Por Qué Importa?"
                      : "Why It Matters"}
                </h2>
                <p className="leading-relaxed text-label font-mono text-xs sm:text-sm">
                  {richContent.whyItMatters}
                </p>
              </section>
            )}

            {richContent.sections &&
              richContent.sections.map((sec, i) => (
                <section key={i}>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground font-mono mb-2 sm:mb-3">
                    {sec.heading}
                  </h2>
                  <p className="leading-relaxed text-label font-mono text-xs sm:text-sm">
                    {sec.body}
                  </p>
                </section>
              ))}

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
          <section
            aria-labelledby="faqs-heading"
            className="mb-6 sm:mb-8 md:mb-12 w-full"
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

        <section
          aria-labelledby="related-tools-heading"
          className="mb-6 sm:mb-8 md:mb-12 w-full font-mono"
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
      </div>

      <AppAffiliateStickyBar />
    </>
  );
}
