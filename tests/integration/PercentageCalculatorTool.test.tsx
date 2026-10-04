import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PercentageCalculatorClient from "@/app/[locale]/tools/convert/percentage-calculator/PercentageCalculatorClient";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => {
    const translations: Record<string, string> = {
      copyResult: "Copiar",
      copied: "Copiado!",
      clear: "Limpar",
      "tabs.percentOf": "% de um Número",
      "tabs.whatPercent": "Qual % é",
      "tabs.percentChange": "Variação %",
      "percentOf.label1": "Porcentagem",
      "percentOf.label2": "Valor Total",
      "percentOf.resultPrefix": "Resultado:",
      "whatPercent.label1": "Parte",
      "whatPercent.label2": "Total",
      "whatPercent.resultPrefix": "Resultado:",
      "percentChange.label1": "De",
      "percentChange.label2": "Para",
      "percentChange.resultPrefix": "Variação:",
      "percentChange.increase": "aumento",
      "percentChange.decrease": "redução",
    };
    return (key: string) => translations[key] || key;
  },
}));

describe("PercentageCalculatorClient", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  const dummyFaqs = [{ question: "Como calcular?", answer: "Multiplique e divida por 100." }];
  const dummyRichContent = {
    whatIs: "Uma calculadora de porcentagem.",
    howToUse: ["Selecione o modo.", "Insira os valores."],
    whyItMatters: "Evite erros com descontos.",
    proTip: "10% é só mover a vírgula.",
  };

  it("renders heading, mode tabs and calculates default percentOf (15% of 200 = 30)", () => {
    render(
      <PercentageCalculatorClient
        title="Calculadora de Porcentagem"
        description="Calcule porcentagens instantaneamente"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Calculadora de Porcentagem" })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "% de um Número" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Qual % é" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Variação %" })).toBeInTheDocument();

    const result = screen.getByTestId("percentage-result");
    expect(result).toHaveTextContent("30");
  });

  it("updates result reactively when inputs change", () => {
    render(
      <PercentageCalculatorClient
        title="Calculadora de Porcentagem"
        description="Calcule porcentagens instantaneamente"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    const pctInput = screen.getByLabelText("Porcentagem (%)");
    fireEvent.change(pctInput, { target: { value: "25" } });

    const result = screen.getByTestId("percentage-result");
    expect(result).toHaveTextContent("50");
  });

  it("switches to whatPercent mode and calculates", () => {
    render(
      <PercentageCalculatorClient
        title="Calculadora de Porcentagem"
        description="Calcule porcentagens instantaneamente"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    const whatPercentTab = screen.getByRole("tab", { name: "Qual % é" });
    fireEvent.click(whatPercentTab);

    // Default wp: 30 is what % of 200 -> 15%
    const result = screen.getByTestId("percentage-result");
    expect(result).toHaveTextContent("15%");
  });

  it("switches to percentChange mode and calculates increase/decrease", () => {
    render(
      <PercentageCalculatorClient
        title="Calculadora de Porcentagem"
        description="Calcule porcentagens instantaneamente"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    const changeTab = screen.getByRole("tab", { name: "Variação %" });
    fireEvent.click(changeTab);

    // Default pc: from 100 to 150 -> 50% (aumento)
    const result = screen.getByTestId("percentage-result");
    expect(result).toHaveTextContent("50% (aumento)");

    // Change to 80 -> 20% (redução)
    const toInput = screen.getByLabelText("Para");
    fireEvent.change(toInput, { target: { value: "80" } });
    expect(screen.getByTestId("percentage-result")).toHaveTextContent("20% (redução)");
  });

  it("clears inputs when clear button is clicked", () => {
    render(
      <PercentageCalculatorClient
        title="Calculadora de Porcentagem"
        description="Calcule porcentagens instantaneamente"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    const clearBtn = screen.getByRole("button", { name: "Limpar" });
    fireEvent.click(clearBtn);

    const result = screen.getByTestId("percentage-result");
    expect(result).toHaveTextContent("—");
  });

  it("copies calculation result to clipboard", async () => {
    render(
      <PercentageCalculatorClient
        title="Calculadora de Porcentagem"
        description="Calcule porcentagens instantaneamente"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    const copyBtn = screen.getByRole("button", { name: /Copiar/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("30");
      expect(screen.getByText("Copiado!")).toBeInTheDocument();
    });
  });

  it("navigates tabs with keyboard arrow keys", () => {
    render(
      <PercentageCalculatorClient
        title="Calculadora de Porcentagem"
        description="Calcule porcentagens instantaneamente"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    const firstTab = screen.getByRole("tab", { name: "% de um Número" });
    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: "ArrowRight" });

    const secondTab = screen.getByRole("tab", { name: "Qual % é" });
    expect(secondTab).toHaveAttribute("aria-selected", "true");
  });
});
