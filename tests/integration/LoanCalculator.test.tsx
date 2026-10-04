import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppLoanCalculator from "@/components/finance/calculator/AppLoanCalculator";
import FinanceToolHeader from "@/app/[locale]/tools/finance/components/FinanceToolHeader";
import FinanceToolContent from "@/app/[locale]/tools/finance/components/FinanceToolContent";
import { CALCULATOR_VARIANTS } from "@/data/calculatorVariants";

// Mock next/navigation
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/tools/finance/loan-calculator",
  useSearchParams: () => ({
    get: (key: string) => (key === "amount" ? "10000" : key === "rate" ? "6.5" : key === "term" ? "60" : null),
  }),
}));

// Mock recharts ResponsiveContainer and AreaChart to avoid canvas/layout issues in jsdom
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
      "finance.shared.principal": "Valor do Empréstimo",
      "finance.shared.annualRate": "Taxa de Juros Anual (%)",
      "finance.shared.termMonths": "Prazo (Meses)",
      "finance.shared.calculate": "Calcular",
      "finance.shared.monthlyPayment": "Parcela Mensal",
      "finance.shared.totalInterest": "Juros Totais",
      "finance.shared.totalCost": "Custo Total",
      "finance.shared.amortizationSchedule": "Tabela de Amortização",
      "finance.shared.month": "Mês",
      "finance.shared.payment": "Parcela",
      "finance.shared.principal_col": "Principal",
      "finance.shared.interest": "Juros",
      "finance.shared.balance": "Saldo",
      "finance.affiliate.compareRates": "Comparar Taxas Atuais",
      "finance.affiliate.disclaimer": "As taxas exibidas são ilustrativas. Compare ofertas reais de instituições para encontrar sua melhor taxa.",
      "finance.affiliate.lendingTreeMortgage": "Comparar taxas de financiamento imobiliário no LendingTree →",
      "finance.affiliate.bankrateMortgage": "Comparar taxas no Bankrate →",
      "finance.affiliate.lendingTreeAuto": "Comparar taxas de financiamento automotivo no LendingTree →",
      "finance.affiliate.lendingTreePersonal": "Comparar taxas de empréstimo pessoal no LendingTree →",
    };
    return (key: string) => translations[`${namespace}.${key}`] || key;
  },
}));

describe("Loan Calculator Integration", () => {
  const variant = CALCULATOR_VARIANTS.find((v) => v.slug === "loan-calculator")!;

  test("renders header with breadcrumbs and title without badges", () => {
    render(
      <FinanceToolHeader
        title="Calculadora de Empréstimo"
        description="Calcule sua parcela mensal e juros totais."
        locale="pt"
      />
    );

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas")).toBeInTheDocument();
    expect(screen.getByText("Finanças")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Calculadora de Empréstimo" })
    ).toBeInTheDocument();
    expect(screen.queryByText("100% Gratuito")).not.toBeInTheDocument();
  });

  test("calculates and displays loan payments accurately for default inputs", () => {
    render(<AppLoanCalculator variant={variant} />);

    expect(screen.getByLabelText("Valor do Empréstimo")).toBeInTheDocument();
    expect(screen.getByLabelText("Taxa de Juros Anual (%)")).toBeInTheDocument();
    expect(screen.getByText("Prazo (Meses)")).toBeInTheDocument();

    // With principal=10000, rate=6.5, term=60 months:
    // monthly payment is ~$195.66
    expect(screen.getAllByText("$195.66")[0]).toBeInTheDocument();
    expect(screen.getAllByText("$1,739.69")[0]).toBeInTheDocument();
    expect(screen.getByText("$11,739.69")).toBeInTheDocument();
  });

  test("updates monthly payment dynamically when principal changes", () => {
    render(<AppLoanCalculator variant={variant} />);

    const principalInput = screen.getByLabelText("Valor do Empréstimo");
    fireEvent.change(principalInput, { target: { value: "20000" } });

    // With principal=20000, rate=6.5, term=60:
    // monthly payment is $391.32
    expect(screen.getAllByText("$391.32")[0]).toBeInTheDocument();
  });

  test("renders rich content, accordion FAQs and related finance tools", () => {
    const faqs = [
      {
        question: "Como funciona a amortização?",
        answer: "Cada parcela reduz o principal e paga juros.",
      },
    ];
    const richContent = {
      whatIs: "Uma calculadora de empréstimo calcula parcelas fixas.",
      howToUse: ["Digite o valor", "Selecione o prazo", "Analise o resultado"],
      whyItMatters: "Entender o CET economiza dinheiro.",
      proTip: "Prazos menores reduzem o total de juros.",
    };

    render(
      <FinanceToolContent
        currentToolSlug="loan-calculator"
        richContent={richContent}
        faqs={faqs}
        locale="pt"
      />
    );

    expect(screen.getByText("Como Usar")).toBeInTheDocument();
    expect(screen.getByText("Digite o valor")).toBeInTheDocument();
    expect(screen.getByText("O Que É Esta Ferramenta?")).toBeInTheDocument();
    expect(screen.getByText("Por Que Isso Importa?")).toBeInTheDocument();
    expect(screen.getByText("Dica Pro")).toBeInTheDocument();
    expect(screen.getByText("Como funciona a amortização?")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas Relacionadas")).toBeInTheDocument();
  });
});
