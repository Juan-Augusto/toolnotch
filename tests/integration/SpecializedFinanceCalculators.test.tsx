import React from "react";
import { render, screen } from "@testing-library/react";
import AppAffordabilityCalculator from "@/components/finance/calculator/AppAffordabilityCalculator";
import AppRefinanceCalculator from "@/components/finance/calculator/AppRefinanceCalculator";
import AppCompoundInterestCalculator from "@/components/finance/calculator/AppCompoundInterestCalculator";
import AppDebtPayoffCalculator from "@/components/finance/calculator/AppDebtPayoffCalculator";
import AppLoanCalculator from "@/components/finance/calculator/AppLoanCalculator";
import { CALCULATOR_VARIANTS } from "@/data/calculatorVariants";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => "/tools/finance/15-year-mortgage-calculator",
  useSearchParams: () => ({
    get: () => null,
  }),
}));

// Mock recharts ResponsiveContainer
jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="recharts-container">{children}</div>
    ),
  };
});

jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    const translations: Record<string, string> = {
      // finance.shared
      "finance.shared.principal": "Valor do Empréstimo",
      "finance.shared.annualRate": "Taxa de Juros Anual (%)",
      "finance.shared.termMonths": "Prazo (Meses)",
      "finance.shared.monthlyPayment": "Parcela Mensal",
      "finance.shared.totalInterest": "Juros Totais",
      "finance.shared.month": "Mês",
      "finance.shared.payment": "Parcela",
      // finance.car
      "finance.car.vehiclePrice": "Preço do Veículo",
      // finance.comparison
      "finance.comparison.title": "15 Anos vs. 30 Anos",
      "finance.comparison.subtitle": "Compare a parcela e os juros totais entre os dois prazos.",
      "finance.comparison.term15Title": "15 Anos",
      "finance.comparison.term30Title": "30 Anos",
      "finance.comparison.monthlyPayment": "Parcela Mensal",
      "finance.comparison.totalInterest": "Juros Totais",
      "finance.comparison.savingsBadge": "-{amount} em juros no prazo de 15 anos",
      "finance.comparison.switchTo30": "Ver calculadora de 30 anos →",
      "finance.comparison.switchTo15": "Ver calculadora de 15 anos →",
      // finance.affordability
      "finance.affordability.incomeLabel": "Renda Mensal Bruta",
      "finance.affordability.debtsLabel": "Dívidas Mensais Fixas",
      "finance.affordability.downPaymentLabel": "Entrada Disponível",
      "finance.affordability.annualRateLabel": "Taxa de Juros Anual (%)",
      "finance.affordability.termLabel": "Prazo do Financiamento",
      "finance.affordability.maxHomePrice": "Preço Máximo do Imóvel",
      "finance.affordability.maxLoan": "Valor Máximo Financiado",
      "finance.affordability.monthlyPayment": "Parcela Mensal Estimada",
      "finance.affordability.rule2836Title": "Análise da Regra 28/36",
      "finance.affordability.rule2836Desc": "Diretriz bancária de qualificação",
      "finance.affordability.frontEndLabel": "Limite Moradia (28%)",
      "finance.affordability.backEndLabel": "Limite com Dívidas (36%)",
      "finance.affordability.ltvLabel": "LTV (Empréstimo/Valor)",
      // finance.refinance
      "finance.refinance.currentSection": "Empréstimo Atual",
      "finance.refinance.newSection": "Novo Financiamento",
      "finance.refinance.currentBalance": "Saldo Devedor Atual",
      "finance.refinance.currentRate": "Taxa de Juros Atual (%)",
      "finance.refinance.currentTerm": "Prazo Restante",
      "finance.refinance.currentPayment": "Parcela Atual",
      "finance.refinance.newRate": "Nova Taxa de Juros (%)",
      "finance.refinance.newTerm": "Novo Prazo",
      "finance.refinance.closingCosts": "Custos de Fechamento / Taxas",
      "finance.refinance.monthlySavings": "Economia Mensal",
      "finance.refinance.lifetimeSavings": "Economia Total de Juros",
      "finance.refinance.breakEven": "Ponto de Equilíbrio (Break-Even)",
      "finance.refinance.breakEvenMonths": "{months} meses para recuperar custos",
      "finance.refinance.worthIt": "Refinanciamento Vantajoso!",
      // finance.compound
      "finance.compound.initialDeposit": "Depósito Inicial",
      "finance.compound.monthlyContribution": "Aporte Mensal",
      "finance.compound.annualRate": "Taxa Anual Estimada (%)",
      "finance.compound.years": "Período (Anos)",
      "finance.compound.endingBalance": "Patrimônio Futuro Acumulado",
      "finance.compound.totalPrincipal": "Total de Principal Investido",
      "finance.compound.totalInterest": "Total Ganho em Juros",
      "finance.compound.breakdownTitle": "Evolução Anual do Patrimônio",
      "finance.compound.year": "Ano",
      "finance.compound.principalInvested": "Principal Acumulado",
      "finance.compound.interestEarned": "Juros Acumulados",
      "finance.compound.totalBalance": "Saldo Total",
      // finance.debtPayoff
      "finance.debtPayoff.balance": "Saldo Total da Dívida",
      "finance.debtPayoff.rate": "Taxa de Juros Anual / APR (%)",
      "finance.debtPayoff.monthlyPayment": "Pagamento Mensal Atual",
      "finance.debtPayoff.extraPayment": "Pagamento Mensal Extra",
      "finance.debtPayoff.timeSaved": "Tempo Economizado",
      "finance.debtPayoff.interestSaved": "Juros Economizados",
      "finance.debtPayoff.debtFreeIn": "Dívida Quitada em",
      "finance.debtPayoff.standardPlan": "Plano Padrão",
      "finance.debtPayoff.acceleratedPlan": "Plano com Pagamento Extra",
      "finance.debtPayoff.monthsFaster": "{months} meses mais rápido",
      "finance.debtPayoff.totalInterest": "Juros Totais",
    };
    return (key: string, values?: Record<string, string | number>) => {
      let str = translations[`${namespace}.${key}`] || key;
      if (values) {
        Object.entries(values).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return str;
    };
  },
}));

describe("Specialized Finance Calculators Integration", () => {
  test("AppAffordabilityCalculator renders and computes rule 28/36 limits", () => {
    render(<AppAffordabilityCalculator />);

    expect(screen.getByLabelText("Renda Mensal Bruta")).toBeInTheDocument();
    expect(screen.getByLabelText("Dívidas Mensais Fixas")).toBeInTheDocument();
    expect(screen.getByLabelText("Entrada Disponível")).toBeInTheDocument();
    expect(screen.getByText("Análise da Regra 28/36")).toBeInTheDocument();

    // Result header should show estimated home price
    expect(screen.getByText("Preço Máximo do Imóvel")).toBeInTheDocument();
  });

  test("AppRefinanceCalculator computes monthly savings and break-even point", () => {
    render(<AppRefinanceCalculator />);

    expect(screen.getByText("Empréstimo Atual")).toBeInTheDocument();
    expect(screen.getByText("Novo Financiamento")).toBeInTheDocument();
    expect(screen.getByLabelText("Saldo Devedor Atual")).toBeInTheDocument();
    expect(screen.getByLabelText("Custos de Fechamento / Taxas")).toBeInTheDocument();

    // With 250k at 6.5% vs 5.0%, savings should be positive
    expect(screen.getByText("Refinanciamento Vantajoso!")).toBeInTheDocument();
    expect(screen.getByText("Economia Mensal")).toBeInTheDocument();
  });

  test("AppCompoundInterestCalculator computes future value and breakdown", () => {
    render(<AppCompoundInterestCalculator />);

    expect(screen.getByLabelText("Depósito Inicial")).toBeInTheDocument();
    expect(screen.getByLabelText("Aporte Mensal")).toBeInTheDocument();
    expect(screen.getByText("Patrimônio Futuro Acumulado")).toBeInTheDocument();
    expect(screen.getByText("Evolução Anual do Patrimônio")).toBeInTheDocument();
  });

  test("AppDebtPayoffCalculator computes time and interest saved", () => {
    render(<AppDebtPayoffCalculator />);

    expect(screen.getByLabelText("Saldo Total da Dívida")).toBeInTheDocument();
    expect(screen.getByLabelText("Pagamento Mensal Extra")).toBeInTheDocument();
    expect(screen.getByText("Juros Economizados")).toBeInTheDocument();
    expect(screen.getByText("Plano Padrão")).toBeInTheDocument();
    expect(screen.getByText("Plano com Pagamento Extra")).toBeInTheDocument();
  });

  test("AppLoanCalculator displays mortgage comparison card for 15-year variant", () => {
    const variant15 = CALCULATOR_VARIANTS.find((v) => v.slug === "15-year-mortgage-calculator")!;
    render(<AppLoanCalculator variant={variant15} />);

    expect(screen.getByText("15 Anos vs. 30 Anos")).toBeInTheDocument();
    expect(screen.getByText("15 Anos")).toBeInTheDocument();
    expect(screen.getByText("30 Anos")).toBeInTheDocument();
    expect(screen.getByText("Ver calculadora de 30 anos →")).toBeInTheDocument();
  });
});
