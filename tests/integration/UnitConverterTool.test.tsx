import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UnitConverterClient from "@/app/[locale]/tools/convert/unit-converter/UnitConverterClient";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    const translations: Record<string, string> = {
      swap: "Inverter",
      result: "Resultado",
      copyResult: "Copiar",
      copied: "Copiado!",
      categoryLabel: "Categoria",
      fromLabel: "De",
      toLabel: "Para",
      amountLabel: "Valor",
      length: "Comprimento",
      weight: "Peso",
      temperature: "Temperatura",
      area: "Área",
      volume: "Volume",
      speed: "Velocidade",
      time: "Tempo",
      "digital-storage": "Armazenamento",
      pressure: "Pressão",
      meter: "Metro (m)",
      kilometer: "Quilômetro (km)",
      centimeter: "Centímetro (cm)",
      foot: "Pé (ft)",
      inch: "Polegada (in)",
      kilogram: "Quilograma (kg)",
      gram: "Grama (g)",
    };
    const fn = (key: string) => translations[key] || `${namespace ? namespace + "." : ""}${key}`;
    fn.has = (key: string) => key in translations;
    return fn;
  },
}));

describe("UnitConverterClient", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  const dummyFaqs = [{ question: "Quantas unidades?", answer: "Mais de 200." }];
  const dummyRichContent = {
    whatIs: "Um conversor de unidades.",
    howToUse: ["Selecione a categoria.", "Insira o valor."],
    whyItMatters: "Precisão em medidas.",
    proTip: "Use aproximações mentais.",
  };

  it("renders heading, category tabs and initial conversion", () => {
    render(
      <UnitConverterClient
        title="Conversor de Unidades"
        description="Converta mais de 200 unidades"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Conversor de Unidades" })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Comprimento" })).toBeInTheDocument();
    expect(screen.getByLabelText("Valor")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "De" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Para" })).toBeInTheDocument();

    const result = screen.getByTestId("conversion-result");
    expect(result).toHaveTextContent("0.001");
  });

  it("updates converted result when input value changes", () => {
    render(
      <UnitConverterClient
        title="Conversor de Unidades"
        description="Converta mais de 200 unidades"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    const amountInput = screen.getByLabelText("Valor");
    fireEvent.change(amountInput, { target: { value: "1000" } });

    const result = screen.getByTestId("conversion-result");
    expect(result).toHaveTextContent("1");
  });

  it("switches category and updates unit choices", () => {
    render(
      <UnitConverterClient
        title="Conversor de Unidades"
        description="Converta mais de 200 unidades"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    const weightTab = screen.getByRole("tab", { name: "Peso" });
    fireEvent.click(weightTab);

    const fromSelect = screen.getByRole("combobox", { name: "De" });
    expect(fromSelect).toHaveTextContent(/Quilograma/i);
  });

  it("swaps units and updates input value", () => {
    render(
      <UnitConverterClient
        title="Conversor de Unidades"
        description="Converta mais de 200 unidades"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    const swapButton = screen.getByLabelText("Inverter");
    fireEvent.click(swapButton);

    const fromSelect = screen.getByRole("combobox", { name: "De" });
    const toSelect = screen.getByRole("combobox", { name: "Para" });
    expect(fromSelect).toHaveTextContent(/Quilômetro/i);
    expect(toSelect).toHaveTextContent(/Metro/i);
  });

  it("copies result to clipboard", async () => {
    render(
      <UnitConverterClient
        title="Conversor de Unidades"
        description="Converta mais de 200 unidades"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    const copyBtn = screen.getByRole("button", { name: /Copiar/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("0.001"));
      expect(screen.getByText("Copiado!")).toBeInTheDocument();
    });
  });

  it("properly populates selects when clicking shortcut pairs in area, volume, and speed", () => {
    render(
      <UnitConverterClient
        title="Conversor de Unidades"
        description="Converta mais de 200 unidades"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    // 1. Test Area shortcut pair
    const areaTab = screen.getByRole("tab", { name: "Área" });
    fireEvent.click(areaTab);
    const areaPairBtn = screen.getByRole("button", { name: "m² → ft²" });
    fireEvent.click(areaPairBtn);
    const fromSelectArea = screen.getByRole("combobox", { name: "De" });
    const toSelectArea = screen.getByRole("combobox", { name: "Para" });
    expect(fromSelectArea).not.toHaveTextContent(/^(\s*|Selecione\.\.\.)$/);
    expect(toSelectArea).not.toHaveTextContent(/^(\s*|Selecione\.\.\.)$/);

    // 2. Test Volume shortcut pair
    const volumeTab = screen.getByRole("tab", { name: "Volume" });
    fireEvent.click(volumeTab);
    const volPairBtn = screen.getByRole("button", { name: "L → gal" });
    fireEvent.click(volPairBtn);
    const fromSelectVol = screen.getByRole("combobox", { name: "De" });
    const toSelectVol = screen.getByRole("combobox", { name: "Para" });
    expect(fromSelectVol).not.toHaveTextContent(/^(\s*|Selecione\.\.\.)$/);
    expect(toSelectVol).not.toHaveTextContent(/^(\s*|Selecione\.\.\.)$/);

    // 3. Test Speed shortcut pair
    const speedTab = screen.getByRole("tab", { name: "Velocidade" });
    fireEvent.click(speedTab);
    const speedPairBtn = screen.getByRole("button", { name: "km/h → mph" });
    fireEvent.click(speedPairBtn);
    const fromSelectSpeed = screen.getByRole("combobox", { name: "De" });
    const toSelectSpeed = screen.getByRole("combobox", { name: "Para" });
    expect(fromSelectSpeed).not.toHaveTextContent(/^(\s*|Selecione\.\.\.)$/);
    expect(toSelectSpeed).not.toHaveTextContent(/^(\s*|Selecione\.\.\.)$/);
  });

  it("navigates category tabs with keyboard arrow keys", () => {
    render(
      <UnitConverterClient
        title="Conversor de Unidades"
        description="Converta mais de 200 unidades"
        faqs={dummyFaqs}
        richContent={dummyRichContent}
        locale="pt"
      />
    );

    const lengthTab = screen.getByRole("tab", { name: "Comprimento" });
    lengthTab.focus();
    fireEvent.keyDown(lengthTab, { key: "ArrowRight" });

    const weightTab = screen.getByRole("tab", { name: "Peso" });
    expect(weightTab).toHaveAttribute("aria-selected", "true");
  });
});
