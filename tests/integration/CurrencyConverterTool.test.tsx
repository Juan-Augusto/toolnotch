import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CurrencyConverterClient from "@/app/[locale]/tools/convert/currency-converter/CurrencyConverterClient";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    const translations: Record<string, string> = {
      swap: "Inverter",
      result: "Resultado",
      copyResult: "Copiar",
      copied: "Copiado!",
      exchangeRate: "Taxa de Câmbio",
      inverseRate: "Taxa Inversa",
      lastUpdated: "Última atualização",
      fromLabel: "Moeda de Origem",
      toLabel: "Moeda de Destino",
      amountLabel: "Valor a Converter",
      amountPlaceholder: "0.00",
      loading: "Carregando...",
      staleWarning: "Aviso de cache",
      errorFetching: "Erro de conexão",
      ratesFooter: "Taxas de open.er-api.com",
    };
    return (key: string) => translations[key] || `${namespace ? namespace + "." : ""}${key}`;
  },
}));

// Mock currency API
jest.mock("@/lib/currency", () => ({
  getRates: jest.fn().mockImplementation((base: string) => {
    if (base === "USD") {
      return Promise.resolve({
        rates: { USD: 1, EUR: 0.85, BRL: 5.2, GBP: 0.75, JPY: 110, CAD: 1.25 },
        stale: false,
      });
    }
    if (base === "EUR") {
      return Promise.resolve({
        rates: { EUR: 1, USD: 1.176, BRL: 6.12, GBP: 0.88, JPY: 129, CAD: 1.47 },
        stale: false,
      });
    }
    return Promise.resolve({ rates: { USD: 1 }, stale: false });
  }),
}));

describe("CurrencyConverterClient", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  const dummyFaqs = [{ question: "De onde vêm as taxas?", answer: "Da API." }];
  const dummyRichContent = {
    whatIs: "Um conversor de moedas.",
    howToUse: ["Selecione a moeda de origem.", "Insira o valor."],
    whyItMatters: "Evitar taxas abusivas.",
    proTip: "Use cartões digitais.",
  };

  it("renders heading and high-contrast inputs", async () => {
    render(
      <CurrencyConverterClient
        title="Conversor de Moedas"
        description="Converta moedas ao vivo"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Conversor de Moedas" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Valor a Converter")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Moeda de Origem" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Moeda de Destino" })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("currency-conversion-result")).toHaveTextContent("0,85");
    });
  });

  it("updates converted amount when amount input changes", async () => {
    render(
      <CurrencyConverterClient
        title="Conversor de Moedas"
        description="Converta moedas ao vivo"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("currency-conversion-result")).toHaveTextContent("0,85");
    });

    const amountInput = screen.getByLabelText("Valor a Converter");
    fireEvent.change(amountInput, { target: { value: "100" } });

    await waitFor(() => {
      expect(screen.getByTestId("currency-conversion-result")).toHaveTextContent("85");
    });
  });

  it("swaps currencies when swap button is clicked", async () => {
    render(
      <CurrencyConverterClient
        title="Conversor de Moedas"
        description="Converta moedas ao vivo"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("currency-conversion-result")).toHaveTextContent("0,85");
    });

    const swapButton = screen.getByLabelText("Inverter");
    fireEvent.click(swapButton);

    await waitFor(() => {
      const fromSelect = screen.getByRole("combobox", { name: "Moeda de Origem" });
      const toSelect = screen.getByRole("combobox", { name: "Moeda de Destino" });
      expect(fromSelect).toHaveTextContent(/EUR/i);
      expect(toSelect).toHaveTextContent(/USD/i);
    });
  });

  it("copies result to clipboard when copy button is clicked", async () => {
    render(
      <CurrencyConverterClient
        title="Conversor de Moedas"
        description="Converta moedas ao vivo"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("currency-conversion-result")).toHaveTextContent("0,85");
    });

    const copyBtn = screen.getByRole("button", { name: /Copiar/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("0,85 EUR"));
      expect(screen.getByText("Copiado!")).toBeInTheDocument();
    });
  });
});
