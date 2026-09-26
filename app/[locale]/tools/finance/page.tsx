import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Calculator,
  Landmark,
  Car,
  Home,
  FileText,
  PieChart,
  Percent,
  Receipt,
  Scale,
  ArrowRight,
  TrendingDown,
  GraduationCap,
  Briefcase,
  Ship,
} from "lucide-react";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  webAppSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import { AppBreadcrumb, AppCard } from "@/components/ui";
import AppAffiliateStickyBar from "@/components/AppAffiliateStickyBar";

const PATH = "/tools/finance";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "finance.hub" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: {
      title: `${t("title")} | ToolNotch`,
      description: t("metaDescription"),
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | ToolNotch`,
      description: t("metaDescription"),
    },
  };
}

export default async function FinanceToolsHubPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "finance.hub" });

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const prefix = locale === "en" ? "" : `/${locale}`;

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: t("breadcrumb"), url: buildLocalizedUrl(PATH, locale) },
    ]),
    webAppSchema(
      t("title"),
      PATH,
      t("metaDescription"),
      locale,
      "FinanceApplication",
    ),
  );

  const calculators = [
    {
      href: `${prefix}/tools/finance/loan-calculator`,
      title:
        locale === "pt"
          ? "Calculadora de Empréstimo"
          : locale === "es"
            ? "Calculadora de Préstamos"
            : "Loan Calculator",
      desc:
        locale === "pt"
          ? "Parcela mensal e cronograma de amortização para qualquer empréstimo"
          : locale === "es"
            ? "Cuota mensual y tabla de amortización para cualquier préstamo"
            : "Monthly payment & full amortization schedule for any loan",
      icon: <Calculator className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/mortgage-calculator`,
      title:
        locale === "pt"
          ? "Financiamento Imobiliário"
          : locale === "es"
            ? "Calculadora de Hipotecas"
            : "Mortgage Calculator",
      desc:
        locale === "pt"
          ? "Simule parcelas de hipoteca, juros totais e prazo de quitação"
          : locale === "es"
            ? "Calcula la cuota de tu hipoteca, intereses y plazo total"
            : "Calculate mortgage payments, total interest, and payoff timeline",
      icon: <Home className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/car-loan-calculator`,
      title:
        locale === "pt"
          ? "Financiamento de Veículos"
          : locale === "es"
            ? "Préstamo de Coche"
            : "Car Loan Calculator",
      desc:
        locale === "pt"
          ? "Parcelas do financiamento automotivo, juros e custo final do veículo"
          : locale === "es"
            ? "Cuotas de préstamos para autos y coste total del vehículo"
            : "Calculate auto loan monthly payments and total vehicle cost",
      icon: <Car className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/personal-loan-calculator`,
      title:
        locale === "pt"
          ? "Empréstimo Pessoal"
          : locale === "es"
            ? "Préstamo Personal"
            : "Personal Loan Calculator",
      desc:
        locale === "pt"
          ? "Cálculo de parcelas para crédito pessoal e consolidação de dívidas"
          : locale === "es"
            ? "Cálculo de cuotas para préstamos personales y consolidación"
            : "Personal loan payments and debt consolidation calculator",
      icon: <Landmark className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/amortization-calculator`,
      title:
        locale === "pt"
          ? "Tabela de Amortização"
          : locale === "es"
            ? "Tabla de Amortización"
            : "Amortization Calculator",
      desc:
        locale === "pt"
          ? "Cronograma completo mês a mês entre pagamento de principal e juros"
          : locale === "es"
            ? "Calendario detallado mes a mes entre capital e intereses"
            : "Full payment schedule showing principal, interest, and balance",
      icon: <PieChart className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/home-affordability-calculator`,
      title:
        locale === "pt"
          ? "Capacidade de Compra"
          : locale === "es"
            ? "Capacidad de Compra"
            : "Home Affordability",
      desc:
        locale === "pt"
          ? "Descubra o valor máximo de imóvel que cabe na sua renda (regra 28/36)"
          : locale === "es"
            ? "Descubre el valor máximo de inmueble según tus ingresos"
            : "How much house can you afford using the standard 28/36 rule",
      icon: <Scale className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/15-year-mortgage-calculator`,
      title:
        locale === "pt"
          ? "Financiamento de 15 Anos"
          : locale === "es"
            ? "Hipoteca a 15 Años"
            : "15-Year Mortgage",
      desc:
        locale === "pt"
          ? "Simule parcelas e veja a economia de juros frente ao prazo de 30 anos"
          : locale === "es"
            ? "Compara el ahorro en intereses frente a hipotecas a 30 años"
            : "Compare 15-year vs. 30-year mortgage payments and interest savings",
      icon: <Home className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/30-year-mortgage-calculator`,
      title:
        locale === "pt"
          ? "Financiamento de 30 Anos"
          : locale === "es"
            ? "Hipoteca a 30 Años"
            : "30-Year Mortgage",
      desc:
        locale === "pt"
          ? "Simule o financiamento residencial de longo prazo mais popular"
          : locale === "es"
            ? "Calcula tu hipoteca a tipo fijo a 30 años"
            : "Calculate your 30-year fixed-rate residential mortgage payment",
      icon: <Home className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/refinance-calculator`,
      title:
        locale === "pt"
          ? "Calculadora de Refinanciamento"
          : locale === "es"
            ? "Refinanciación de Préstamo"
            : "Refinance Calculator",
      desc:
        locale === "pt"
          ? "Calcule se vale a pena refinanciar e encontre o ponto de equilíbrio"
          : locale === "es"
            ? "Descubre si conviene refinanciar y tu punto de equilibrio"
            : "Calculate if refinancing makes sense and your break-even point",
      icon: <TrendingDown className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/student-loan-calculator`,
      title:
        locale === "pt"
          ? "Empréstimo Estudantil"
          : locale === "es"
            ? "Préstamo Estudiantil"
            : "Student Loan Calculator",
      desc:
        locale === "pt"
          ? "Simule o pagamento do financiamento estudantil e plano de quitação"
          : locale === "es"
            ? "Calcula la amortización de préstamos estudiantiles y plazos"
            : "Student loan repayment calculator and payoff timeline",
      icon: <GraduationCap className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/debt-payoff-calculator`,
      title:
        locale === "pt"
          ? "Quitação de Dívidas"
          : locale === "es"
            ? "Liquidación de Deudas"
            : "Debt Payoff Calculator",
      desc:
        locale === "pt"
          ? "Planeje quanto tempo levará para zerar dívidas e reduzir juros"
          : locale === "es"
            ? "Calcula cuánto tardarás en pagar tus deudas y el interés total"
            : "Calculate how long to pay off debt and total interest saved",
      icon: <Percent className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/business-loan-calculator`,
      title:
        locale === "pt"
          ? "Empréstimo para Empresas"
          : locale === "es"
            ? "Préstamo para Empresas"
            : "Business Loan Calculator",
      desc:
        locale === "pt"
          ? "Simule financiamentos para capital de giro, expansão ou equipamentos"
          : locale === "es"
            ? "Simula préstamos comerciales para capital de trabajo o equipos"
            : "Commercial financing for working capital, expansion, or equipment",
      icon: <Briefcase className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/boat-loan-calculator`,
      title:
        locale === "pt"
          ? "Financiamento de Barcos"
          : locale === "es"
            ? "Préstamo para Barcos"
            : "Boat Loan Calculator",
      desc:
        locale === "pt"
          ? "Simule empréstimos náuticos com prazos estendidos de até 20 anos"
          : locale === "es"
            ? "Simula préstamos náuticos y costes de embarcaciones"
            : "Marine loans with extended terms up to 20 years and total cost",
      icon: <Ship className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/interest-calculator`,
      title:
        locale === "pt"
          ? "Calculadora de Juros"
          : locale === "es"
            ? "Calculadora de Intereses"
            : "Interest Calculator",
      desc:
        locale === "pt"
          ? "Calcule juros simples e compostos sobre poupança ou dívidas"
          : locale === "es"
            ? "Calcula interés simple y compuesto para ahorros o préstamos"
            : "Calculate simple and compound interest on savings or loans",
      icon: <Percent className="w-5 h-5 text-secondary shrink-0" />,
    },
  ];

  const invoices = [
    {
      href: `${prefix}/tools/finance/invoice-generator`,
      title:
        locale === "pt"
          ? "Gerador de Faturas Profissional"
          : locale === "es"
            ? "Generador de Facturas"
            : "Invoice Generator",
      desc:
        locale === "pt"
          ? "Faturas completas em PDF, sem marca d’água e prontas para envio imediato"
          : locale === "es"
            ? "Facturas gratuitas sin marca de agua y descarga en PDF"
            : "Free professional invoices — no watermark, no signup, PDF download",
      icon: <Receipt className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/invoice-generator-for-freelancers`,
      title:
        locale === "pt"
          ? "Fatura para Freelancers"
          : locale === "es"
            ? "Factura para Freelancers"
            : "Freelancer Invoice Generator",
      desc:
        locale === "pt"
          ? "Modelo ideal para autônomos, prestadores de serviço e liberais"
          : locale === "es"
            ? "Plantilla diseñada para trabajadores autónomos e independientes"
            : "Invoice template tailored for freelancers and self-employed professionals",
      icon: <FileText className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/invoice-generator-uk`,
      title:
        locale === "pt"
          ? "Fatura Reino Unido (VAT)"
          : locale === "es"
            ? "Factura Reino Unido (VAT)"
            : "UK Invoice Generator",
      desc:
        locale === "pt"
          ? "Faturas em Libras (GBP) com alíquota padrão de VAT de 20% pré-configurada"
          : locale === "es"
            ? "Facturas en GBP con IVA británico (VAT) al 20% preconfigurado"
            : "GBP invoices with UK VAT pre-configured at 20%",
      icon: <Receipt className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/invoice-generator-canada`,
      title:
        locale === "pt"
          ? "Fatura Canadá (GST/PST)"
          : locale === "es"
            ? "Factura Canadá (GST/PST)"
            : "Canadian Invoice Generator",
      desc:
        locale === "pt"
          ? "Faturas em Dólares Canadenses (CAD) com GST de 5% pré-configurado"
          : locale === "es"
            ? "Facturas en CAD con GST canadiense preconfigurado al 5%"
            : "CAD invoices with Canadian GST pre-configured at 5%",
      icon: <Receipt className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/finance/invoice-generator-australia`,
      title:
        locale === "pt"
          ? "Fatura Austrália (GST)"
          : locale === "es"
            ? "Factura Australia (GST)"
            : "Australian Invoice Generator",
      desc:
        locale === "pt"
          ? "Faturas em Dólares Australianos (AUD) com GST de 10% pré-configurado"
          : locale === "es"
            ? "Facturas en AUD con GST australiano preconfigurado al 10%"
            : "AUD invoices with Australian GST pre-configured at 10%",
      icon: <Receipt className="w-5 h-5 text-secondary shrink-0" />,
    },
  ];

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full pb-2 sm:pb-3">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: prefix || "/" },
            { label: toolsLabel, href: `${prefix}/tools` },
            { label: t("breadcrumb"), current: true },
          ]}
        />
      </div>

      <header className="mb-6 sm:mb-8 md:mb-10 pt-1 sm:pt-2 pb-4 sm:pb-6 border-b border-border/80 relative">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground font-mono break-words">
          {t("title")}
        </h1>
        <p className="leading-relaxed text-label mt-2 max-w-3xl text-xs sm:text-sm md:text-base">
          {t("description")}
        </p>
      </header>

      {/* Calculators Section */}
      <section className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-foreground font-mono">
            {t("calculatorsTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-label font-mono mt-1">
            {t("calculatorsSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {calculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group block h-full">
              <AppCard
                border
                cornerAccents={false}
                className="p-4 sm:p-5 bg-tertiary group-hover:border-secondary/60 transition-colors h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    {calc.icon}
                    <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-secondary transition-colors font-mono">
                      {calc.title}
                    </h3>
                  </div>
                  <p className="text-xs text-label leading-relaxed font-mono line-clamp-2">
                    {calc.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-secondary font-semibold mt-4 pt-3 border-t border-border/50 font-mono">
                  <span>
                    {locale === "pt"
                      ? "Acessar calculadora"
                      : locale === "es"
                        ? "Ir a la calculadora"
                        : "Open calculator"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </AppCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Invoice Generators Section */}
      <section className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-foreground font-mono">
            {t("invoicesTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-label font-mono mt-1">
            {t("invoicesSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {invoices.map((inv) => (
            <Link key={inv.href} href={inv.href} className="group block h-full">
              <AppCard
                border
                cornerAccents={false}
                className="p-4 sm:p-5 bg-tertiary group-hover:border-secondary/60 transition-colors h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    {inv.icon}
                    <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-secondary transition-colors font-mono">
                      {inv.title}
                    </h3>
                  </div>
                  <p className="text-xs text-label leading-relaxed font-mono line-clamp-2">
                    {inv.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-secondary font-semibold mt-4 pt-3 border-t border-border/50 font-mono">
                  <span>
                    {locale === "pt"
                      ? "Criar fatura"
                      : locale === "es"
                        ? "Crear factura"
                        : "Create invoice"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </AppCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Educational Guide Section */}
      <section className="mb-10 sm:mb-12 md:mb-16">
        <AppCard border cornerAccents className="p-6 sm:p-8 bg-tertiary font-mono">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-foreground mb-4">
            {t("guideTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
            <div className="p-4 bg-background border border-border rounded-[2px]">
              <h3 className="text-sm font-bold uppercase text-secondary mb-1.5">
                {t("terms.principalTitle")}
              </h3>
              <p className="text-xs text-label leading-relaxed">
                {t("terms.principalDesc")}
              </p>
            </div>
            <div className="p-4 bg-background border border-border rounded-[2px]">
              <h3 className="text-sm font-bold uppercase text-secondary mb-1.5">
                {t("terms.rateTitle")}
              </h3>
              <p className="text-xs text-label leading-relaxed">
                {t("terms.rateDesc")}
              </p>
            </div>
            <div className="p-4 bg-background border border-border rounded-[2px]">
              <h3 className="text-sm font-bold uppercase text-secondary mb-1.5">
                {t("terms.termTitle")}
              </h3>
              <p className="text-xs text-label leading-relaxed">
                {t("terms.termDesc")}
              </p>
            </div>
            <div className="p-4 bg-background border border-border rounded-[2px]">
              <h3 className="text-sm font-bold uppercase text-secondary mb-1.5">
                {t("terms.amortizationTitle")}
              </h3>
              <p className="text-xs text-label leading-relaxed">
                {t("terms.amortizationDesc")}
              </p>
            </div>
            <div className="p-4 bg-background border border-border rounded-[2px] md:col-span-2">
              <h3 className="text-sm font-bold uppercase text-secondary mb-1.5">
                {t("terms.downPaymentTitle")}
              </h3>
              <p className="text-xs text-label leading-relaxed">
                {t("terms.downPaymentDesc")}
              </p>
            </div>
          </div>
        </AppCard>
      </section>


      <AppAffiliateStickyBar />
    </main>
  );
}
