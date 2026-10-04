import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppAgeCalculator from "@/components/math/AppAgeCalculator";
import MathToolHeader from "@/app/[locale]/tools/math/components/MathToolHeader";
import MathToolContent from "@/app/[locale]/tools/math/components/MathToolContent";

jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, values?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        title: "Calculadora de Idade",
        description: "Calcule sua idade exata em anos, meses e dias.",
        birthdate: "Data de Nascimento",
        targetDate: "Calcular idade em",
        useToday: "Usar data de hoje",
        today: "Hoje",
        youAre: "Você tem",
        yearsOld: "anos de idade",
        monthsWord: "meses",
        daysWord: "dias",
        and: "e",
        totalDays: `${values?.total ?? "{total}"} dias vividos no total`,
        totalMonths: "meses de vida",
        totalWeeks: "semanas de vida",
        totalHours: "horas de vida",
        lifeSummary: "Estatísticas de Vida",
        nextBirthday: "Próximo Aniversário",
        inDays: `Em ${values?.n ?? "{n}"} dias`,
        happyBirthday: "🎉 Feliz Aniversário! Parabéns!",
        futureAge: "Quantos anos terei em...",
        futureResult: `Em ${values?.date ?? "{date}"}, você terá ${values?.years ?? "{years}"} anos`,
        errorFutureDate: "A data de nascimento não pode ser posterior à data de cálculo",
        reset: "Limpar",
        copySummary: "Copiar resumo",
        copied: "Copiado!",
        emptyPrompt: "Informe sua data de nascimento para calcular sua idade exata.",
        birthParameters: "Dados de Nascimento",
        exactAge: "Sua Idade Exata",
        onDate: `Calculada em ${values?.date ?? "{date}"}`,
      };

      return translations[key] ?? key;
    };
  },
}));

jest.mock("@/components/AppAffiliateOffers", () => {
  return function MockAffiliateOffers() {
    return <div data-testid="mock-affiliate-offers" />;
  };
});

jest.mock("@/components/AppAffiliateStickyBar", () => {
  return function MockAffiliateStickyBar() {
    return <div data-testid="mock-affiliate-sticky" />;
  };
});

describe("Age Calculator Integration Tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-09-28T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders initial state with empty prompt and inputs", () => {
    render(<AppAgeCalculator locale="pt" />);

    expect(
      screen.getByText("Informe sua data de nascimento para calcular sua idade exata.")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Data de Nascimento")).toBeInTheDocument();
    expect(screen.getByText("Calcular idade em")).toBeInTheDocument();
  });

  it("calculates exact age and life metrics correctly for someone born on 2000-01-15", () => {
    render(<AppAgeCalculator locale="pt" />);

    const birthInput = screen.getByLabelText("Data de Nascimento");
    fireEvent.change(birthInput, { target: { value: "2000-01-15" } });

    // On 2026-09-28, born 2000-01-15: 26 years, 8 months, 13 days
    expect(screen.getByText("26")).toBeInTheDocument();
    expect(screen.getByText("anos de idade")).toBeInTheDocument();
    expect(screen.getByText(/8 meses e 13 dias/i)).toBeInTheDocument();
    expect(screen.getByText("Estatísticas de Vida")).toBeInTheDocument();
    expect(screen.getByText("Copiar resumo")).toBeInTheDocument();
  });

  it("calculates next birthday countdown accurately", () => {
    render(<AppAgeCalculator locale="pt" />);

    const birthInput = screen.getByLabelText("Data de Nascimento");
    // Birthday coming up on October 15
    fireEvent.change(birthInput, { target: { value: "2000-10-15" } });

    // From 2026-09-28 to 2026-10-15 = 17 days
    expect(screen.getByText("Próximo Aniversário")).toBeInTheDocument();
    expect(screen.getByText("Em 17 dias")).toBeInTheDocument();
  });

  it("shows celebration banner when today is the birthday", () => {
    render(<AppAgeCalculator locale="pt" />);

    const birthInput = screen.getByLabelText("Data de Nascimento");
    // Born on September 28
    fireEvent.change(birthInput, { target: { value: "1995-09-28" } });

    expect(
      screen.getByText("🎉 Feliz Aniversário! Parabéns!")
    ).toBeInTheDocument();
  });

  it("calculates age at a specific target date (past or future)", () => {
    render(<AppAgeCalculator locale="pt" />);

    const birthInput = screen.getByLabelText("Data de Nascimento");
    fireEvent.change(birthInput, { target: { value: "2000-01-01" } });

    // Change target date to 2030-01-01 (should be exactly 30 years)
    const targetInput = screen.getByDisplayValue("2026-09-28");
    fireEvent.change(targetInput, { target: { value: "2030-01-01" } });

    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Usar data de hoje")).toBeInTheDocument();

    // Click "Usar data de hoje" to revert back
    fireEvent.click(screen.getByText("Usar data de hoje"));
    expect(screen.getByText("26")).toBeInTheDocument();
  });

  it("shows error when birth date is after target date", () => {
    render(<AppAgeCalculator locale="pt" />);

    const birthInput = screen.getByLabelText("Data de Nascimento");
    fireEvent.change(birthInput, { target: { value: "2030-01-01" } });

    expect(
      screen.getByText("A data de nascimento não pode ser posterior à data de cálculo")
    ).toBeInTheDocument();
  });

  it("resets fields when clicking Limpar", () => {
    render(<AppAgeCalculator locale="pt" />);

    const birthInput = screen.getByLabelText("Data de Nascimento");
    fireEvent.change(birthInput, { target: { value: "1990-05-20" } });
    expect(screen.getByText("36")).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /limpar/i });
    fireEvent.click(resetButton);

    expect(birthInput).toHaveValue("");
    expect(
      screen.getByText("Informe sua data de nascimento para calcular sua idade exata.")
    ).toBeInTheDocument();
  });

  it("copies summary to clipboard", async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<AppAgeCalculator locale="pt" />);

    const birthInput = screen.getByLabelText("Data de Nascimento");
    fireEvent.change(birthInput, { target: { value: "1990-05-20" } });

    const copyBtn = screen.getByRole("button", { name: /copiar resumo/i });
    await waitFor(async () => {
      fireEvent.click(copyBtn);
    });

    expect(writeTextMock).toHaveBeenCalled();
  });

  describe("MathToolHeader", () => {
    it("renders breadcrumbs, title, and description", () => {
      render(
        <MathToolHeader
          title="Calculadora de Idade"
          description="Calcule sua idade exata."
          locale="pt"
        />
      );

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Calculadora de Idade"
      );
      expect(screen.getByText("Calcule sua idade exata.")).toBeInTheDocument();
      expect(screen.getByText("Matemática & Cálculos")).toBeInTheDocument();
    });
  });

  describe("MathToolContent", () => {
    it("renders rich content, FAQs, and related tools", () => {
      render(
        <MathToolContent
          currentToolSlug="age-calculator"
          locale="pt"
          richContent={{
            whatIs: "Uma calculadora de idade calcula a diferença exata.",
            whyItMatters: "A idade exata é importante em contextos legais.",
            howToUse: ["Insira sua data de nascimento", "Veja os resultados"],
            proTip: "Calcule a idade em datas futuras.",
          }}
          faqs={[
            {
              question: "Como funciona?",
              answer: "Calcula a diferença entre datas.",
            },
          ]}
        />
      );

      expect(screen.getByText("Como Usar")).toBeInTheDocument();
      expect(screen.getByText("Insira sua data de nascimento")).toBeInTheDocument();
      expect(screen.getByText("O Que É Esta Ferramenta?")).toBeInTheDocument();
      expect(screen.getByText("Por Que Isso Importa?")).toBeInTheDocument();
      expect(screen.getByText("Dica Útil")).toBeInTheDocument();
      expect(screen.getByText("Perguntas Frequentes")).toBeInTheDocument();
      expect(screen.getByText("Como funciona?")).toBeInTheDocument();
      expect(screen.getByText("Ferramentas Relacionadas")).toBeInTheDocument();
      expect(screen.getByText("Calculadora de Porcentagem")).toBeInTheDocument();
    });
  });
});
