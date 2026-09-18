import React from "react";
import { render, screen } from "@testing-library/react";

// Mock next-intl/server
jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn().mockImplementation(({ namespace }: { namespace: string }) => {
    if (namespace === "convert.hub") {
      const hubData: Record<string, string> = {
        title: "Conversores e Calculadoras de Medidas",
        description: "Converta entre mais de 200 unidades de medida",
        breadcrumb: "Conversores",
        badgeUnits: "200+ Unidades",
        badgeCurrencies: "150+ Moedas",
        badgeFree: "100% Grátis",
        badgePrivate: "Sem Cadastro",
        coreToolsTitle: "Ferramentas Principais",
        coreToolsSubtitle: "Escolha a ferramenta ideal",
        "tools.unitConverter.title": "Conversor de Unidades",
        "tools.unitConverter.desc": "Comprimento, peso, temperatura...",
        "tools.currencyConverter.title": "Conversor de Moedas",
        "tools.currencyConverter.desc": "Cotações de câmbio atualizadas...",
        "tools.percentageCalculator.title": "Calculadora de Porcentagem",
        "tools.percentageCalculator.desc": "3 modos de cálculo...",
        categoriesTitle: "Navegue por Categoria de Medida",
        popularTitle: "Conversões Mais Populares",
        guideTitle: "Por que a Precisão nas Conversões é Essencial?",
        guideP1: "A conversão de unidades e medidas é uma necessidade diária...",
        guideP2: "O sistema métrico organiza-se em potências de dez...",
        guideP3: "O ToolNotch reúne em um único lugar conversores...",
        whenToUseTitle: "Casos de Uso Comuns",
        "useCases.0.title": "Culinária & Gastronomia",
        "useCases.0.desc": "Adapte receitas estrangeiras...",
        "useCases.1.title": "Viagens Internacionais",
        "useCases.1.desc": "Calcule câmbio de moedas locais...",
        "useCases.2.title": "Construção & Marcenaria",
        "useCases.2.desc": "Traduza plantas e projetos...",
        "useCases.3.title": "Estudos & Ciências",
        "useCases.3.desc": "Converta unidades de pressão...",
        "faqs.0.question": "Os conversores de unidades funcionam sem internet?",
        "faqs.0.answer": "Sim! Todas as conversões de unidades funcionam inteiramente no seu navegador.",
        "faqs.1.question": "Com que frequência as taxas de câmbio são atualizadas?",
        "faqs.1.answer": "Aproximadamente a cada hora.",
        "faqs.2.question": "Qual é a precisão dos cálculos nos conversores?",
        "faqs.2.answer": "Até 8 algarismos significativos.",
        "faqs.3.question": "É necessário criar conta?",
        "faqs.3.answer": "Não. 100% gratuito.",
      };
      return (key: string) => hubData[key] ?? key;
    }
    if (namespace === "convert.categories") {
      const catMap: Record<string, string> = {
        length: "Comprimento",
        weight: "Peso",
        temperature: "Temperatura",
        area: "Área",
        volume: "Volume",
        speed: "Velocidade",
        time: "Tempo",
        "digital-storage": "Armazenamento",
        pressure: "Pressão",
      };
      return (key: string) => catMap[key] ?? key;
    }
    return (key: string) => key;
  }),
}));

import ConvertHubPage from "@/app/[locale]/tools/convert/page";

describe("ConvertHubPage", () => {
  it("renders heading, core tools, categories, and popular conversions", async () => {
    const jsx = await ConvertHubPage({
      params: Promise.resolve({ locale: "pt" }),
    });
    render(jsx);

    // Header & Badges
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Conversores e Calculadoras de Medidas",
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText("200+ Unidades").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("150+ Moedas").length).toBeGreaterThanOrEqual(1);

    // 3 Core Tools
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Conversor de Unidades",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Conversor de Moedas",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Calculadora de Porcentagem",
      })
    ).toBeInTheDocument();

    // Navigation Links
    expect(screen.getByText("Comprimento")).toBeInTheDocument();
    expect(screen.getByText("Peso")).toBeInTheDocument();
    expect(screen.getByText("Temperatura")).toBeInTheDocument();
    expect(screen.getByText("Moedas")).toBeInTheDocument();

    // Educational Guide & Use cases
    expect(
      screen.getByText("Por que a Precisão nas Conversões é Essencial?")
    ).toBeInTheDocument();
    expect(screen.getByText("Culinária & Gastronomia")).toBeInTheDocument();

    // Popular Conversions (Translated in PT)
    expect(screen.getByText("Conversor de Comprimento")).toBeInTheDocument();
    expect(screen.getByText("Pés para Metros")).toBeInTheDocument();
    expect(screen.queryByText("Length Converter")).not.toBeInTheDocument();
    expect(screen.queryByText("Feet to Meters")).not.toBeInTheDocument();

    // FAQs
    expect(
      screen.getByText("Os conversores de unidades funcionam sem internet?")
    ).toBeInTheDocument();
  });
});
