import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppToolsHub from "@/components/tools/AppToolsHub";
import type { ToolCardData } from "@/components/tools/toolsHubConfig";

const mockTools: ToolCardData[] = [
  {
    id: "imageCompressor",
    path: "/tools/image/image-compressor",
    labelKey: "imageCompressor",
    title: "Compressor de Imagem",
    description: "Comprimir JPG, PNG, WebP e AVIF com qualidade visual.",
    category: "image",
    featured: true,
  },
  {
    id: "mergePdf",
    path: "/tools/pdf/merge-pdf",
    labelKey: "mergePdf",
    title: "Mesclar PDF",
    description: "Combinar vários PDFs em um documento único.",
    category: "pdf",
  },
  {
    id: "unitConverter",
    path: "/tools/convert/unit-converter",
    labelKey: "unitConverter",
    title: "Conversor de Unidades",
    description: "Conversão instantânea de comprimento, peso e temperatura.",
    category: "convert",
  },
  {
    id: "wordCounter",
    path: "/tools/text/word-counter",
    labelKey: "wordCounter",
    title: "Contador de Palavras",
    description: "Contador de palavras, caracteres, frases e parágrafos.",
    category: "text",
  },
  {
    id: "loanCalculator",
    path: "/tools/finance/loan-calculator",
    labelKey: "loanCalculator",
    title: "Calculadora de Empréstimo",
    description: "Simule parcelas e juros totais de financiamento.",
    category: "finance",
  },
];

describe("AppToolsHub", () => {
  it("renders heading, subtitle, and category chips", () => {
    render(<AppToolsHub tools={mockTools} locale="pt" />);

    expect(screen.getByText("TODAS AS FERRAMENTAS")).toBeInTheDocument();
    expect(
      screen.getByText(/Calculadoras, utilitários, conversores/i),
    ).toBeInTheDocument();

    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThanOrEqual(2);
    expect(tabs.some((t) => t.textContent?.includes("TODOS"))).toBe(true);
    expect(tabs.some((t) => t.textContent?.includes("PDF"))).toBe(true);
    expect(tabs.some((t) => t.textContent?.includes("IMAGEM"))).toBe(true);
  });

  it("renders featured tool card and category sections in default view", () => {
    render(<AppToolsHub tools={mockTools} locale="pt" />);

    expect(screen.getByText("EM DESTAQUE")).toBeInTheDocument();
    expect(screen.getAllByText("Compressor de Imagem").length).toBeGreaterThanOrEqual(1);

    const pdfHeadings = screen.getAllByRole("heading", { name: "PDF" });
    expect(pdfHeadings.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Mesclar PDF")).toBeInTheDocument();
  });

  it("filters tools when clicking on a category chip", () => {
    render(<AppToolsHub tools={mockTools} locale="pt" />);

    const pdfTab = screen.getByRole("tab", { name: /PDF/i });
    fireEvent.click(pdfTab);

    expect(screen.getByText("Mesclar PDF")).toBeInTheDocument();
    expect(screen.queryByText("Contador de Palavras")).not.toBeInTheDocument();
    expect(screen.queryByText("Calculadora de Empréstimo")).not.toBeInTheDocument();
  });

  it("filters tools by search query in title or description", () => {
    render(<AppToolsHub tools={mockTools} locale="pt" />);

    const searchInput = screen.getByPlaceholderText("pesquisar...");
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "Contador" } });

    expect(screen.getByText("Contador de Palavras")).toBeInTheDocument();
    expect(screen.queryByText("Mesclar PDF")).not.toBeInTheDocument();
    expect(screen.queryByText("Calculadora de Empréstimo")).not.toBeInTheDocument();
  });

  it("clears search input when clicking clear button", () => {
    render(<AppToolsHub tools={mockTools} locale="pt" />);

    const searchInput = screen.getByPlaceholderText("pesquisar...");
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "PDF" } });
    const clearBtn = screen.getByLabelText("Clear search");
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(searchInput).toHaveValue("");
    expect(screen.getByText("Contador de Palavras")).toBeInTheDocument();
  });

  it("clears search input when pressing Escape key", () => {
    render(<AppToolsHub tools={mockTools} locale="pt" />);

    const searchInput = screen.getByPlaceholderText("pesquisar...");
    fireEvent.change(searchInput, { target: { value: "Empréstimo" } });
    expect(searchInput).toHaveValue("Empréstimo");

    fireEvent.keyDown(searchInput, { key: "Escape", code: "Escape" });
    expect(searchInput).toHaveValue("");
    expect(screen.getByText("Mesclar PDF")).toBeInTheDocument();
  });

  it("shows empty state when no tools match and allows resetting filters", () => {
    render(<AppToolsHub tools={mockTools} locale="pt" />);

    const searchInput = screen.getByPlaceholderText("pesquisar...");
    fireEvent.change(searchInput, { target: { value: "termo-inexistente-xyz" } });

    expect(
      screen.getByText("Nenhuma ferramenta encontrada para sua busca."),
    ).toBeInTheDocument();

    const resetBtn = screen.getByRole("button", { name: /Limpar filtros/i });
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(resetBtn);
    expect(searchInput).toHaveValue("");
    expect(screen.getByText("Mesclar PDF")).toBeInTheDocument();
  });

  it("renders with English labels when locale is en", () => {
    render(<AppToolsHub tools={mockTools} locale="en" />);

    expect(screen.getByText("ALL TOOLS")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("search...")).toBeInTheDocument();
    expect(screen.getByText("FEATURED")).toBeInTheDocument();
  });

  it("does not use font-mono class in hub container", () => {
    const { container } = render(<AppToolsHub tools={mockTools} locale="pt" />);
    const monoElements = container.querySelectorAll(".font-mono");
    expect(monoElements.length).toBe(0);
  });

  it("renders view mode toggle buttons and toggles between cards and 3-column list", () => {
    render(<AppToolsHub tools={mockTools} locale="pt" />);

    const cardsBtn = screen.getByTestId("view-mode-cards");
    const listBtn = screen.getByTestId("view-mode-list");

    expect(cardsBtn).toBeInTheDocument();
    expect(listBtn).toBeInTheDocument();
    expect(cardsBtn).toHaveAttribute("aria-pressed", "true");
    expect(listBtn).toHaveAttribute("aria-pressed", "false");

    // Click list button
    fireEvent.click(listBtn);
    expect(listBtn).toHaveAttribute("aria-pressed", "true");
    expect(cardsBtn).toHaveAttribute("aria-pressed", "false");

    // In list mode, category titles and all tools are listed in links
    expect(screen.getByText("Mesclar PDF")).toBeInTheDocument();
    expect(screen.getByText("Contador de Palavras")).toBeInTheDocument();
    expect(screen.getByText("Conversor de Unidades")).toBeInTheDocument();

    // Click cards button to switch back
    fireEvent.click(cardsBtn);
    expect(cardsBtn).toHaveAttribute("aria-pressed", "true");
    expect(listBtn).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("EM DESTAQUE")).toBeInTheDocument();
  });

  it("renders single category in list mode when filtered by tab", () => {
    render(<AppToolsHub tools={mockTools} locale="pt" />);

    const listBtn = screen.getByTestId("view-mode-list");
    fireEvent.click(listBtn);

    const pdfTab = screen.getByRole("tab", { name: /PDF/i });
    fireEvent.click(pdfTab);

    expect(screen.getByText("Mesclar PDF")).toBeInTheDocument();
    expect(screen.queryByText("Contador de Palavras")).not.toBeInTheDocument();
  });
});
