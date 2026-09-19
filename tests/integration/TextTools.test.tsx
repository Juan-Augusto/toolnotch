import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WordCounterClient from "@/app/[locale]/tools/text/word-counter/WordCounterClient";
import CharacterCounterClient from "@/app/[locale]/tools/text/character-counter/CharacterCounterClient";
import ReadingTimeClient from "@/app/[locale]/tools/text/reading-time-calculator/ReadingTimeClient";
import ReadabilityCheckerClient from "@/app/[locale]/tools/text/readability-checker/ReadabilityCheckerClient";
import KeywordDensityClient from "@/app/[locale]/tools/text/keyword-density-checker/KeywordDensityClient";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    const translations: Record<string, string> = {
      sampleText: "The quick brown fox jumps over the lazy dog. A second sentence tests readability and word count.",
      "wordCounter.title": "Contador de Palavras",
      "wordCounter.placeholder": "Cole ou digite seu texto aqui...",
      "characterCounter.title": "Contador de Caracteres",
      "readingTime.title": "Calculadora de Tempo de Leitura",
      "readingTime.ui.speedReaderTitle": "Leitura Dinâmica (RSVP)",
      "readingTime.ui.startSpeedReader": "Iniciar Leitura Dinâmica",
      "readingTime.ui.closeSpeedReader": "Fechar",
      "readingTime.ui.estimatedReadingTime": "Tempo de Leitura",
      "readingTime.ui.estimatedSpeakingTime": "Tempo de Fala",
      "readingTime.ui.readingSpeedLabel": "Velocidade de Leitura",
      "readingTime.ui.speakingSpeedLabel": "Velocidade de Fala",
      "readingTime.ui.wordsPerMinute": "{wpm} ppm",
      "readingTime.ui.speedSlow": "Lento",
      "readingTime.ui.speedMedium": "Médio",
      "readingTime.ui.speedFast": "Rápido",
      "readingTime.ui.speedSuperFast": "Super Rápido",
      "readingTime.ui.complexityNote": "Nível de Complexidade",
      "readingTime.ui.complexityEasy": "Fácil de ler",
      "readingTime.ui.complexityAverage": "Complexidade média",
      "readingTime.ui.complexityHard": "Difícil de ler",
      "readingTime.ui.complexityVeryHard": "Muito difícil",
      "readingTime.ui.seconds": "{s}s",
      "readingTime.ui.minutesAndSeconds": "{m}m {s}s",
      "readingTime.ui.wordCounter": "{current} de {total}",
      "readingTime.ui.play": "Play",
      "readingTime.ui.pause": "Pause",
      "readingTime.ui.reset": "Reset",
      "readingTime.ui.done": "Concluído!",
      "readabilityChecker.title": "Verificador de Legibilidade",
      "readabilityChecker.description": "Analise a legibilidade do texto.",
      "keywordDensity.title": "Densidade de Palavras-Chave",
      "keywordDensity.description": "Analise a frequência de termos.",
      "buttons.sampleText": "Texto de Exemplo",
      "buttons.clear": "Limpar",
      "buttons.copy": "Copiar Texto",
      "buttons.copied": "Copiado!",
      words: "Palavras",
      characters: "Caracteres",
      charactersNoSpaces: "Sem Espaços",
      sentences: "Frases",
      paragraphs: "Parágrafos",
      readingTime: "Tempo de Leitura",
      speakingTime: "Tempo de Fala",
      avgWordsPerSentence: "Palavras / Frase",
      readabilityScores: "Índices de Legibilidade",
      "stats.readabilityScores": "Índices de Legibilidade",
      "stats.words": "Palavras",
      "stats.characters": "Caracteres",
      "stats.charactersNoSpaces": "Sem Espaços",
      "stats.sentences": "Frases",
      "stats.paragraphs": "Parágrafos",
      fleschEase: "Facilidade de Leitura Flesch",
      "stats.fleschEase": "Facilidade de Leitura Flesch",
      fleschGrade: "Grau Flesch-Kincaid",
      "stats.fleschGrade": "Grau Flesch-Kincaid",
      gunningFog: "Gunning Fog",
      "stats.gunningFog": "Gunning Fog",
      gradeLevel: "Nível Escolar",
      gradeEquivalent: "Grau escolar",
      yearsEducation: "Anos de estudo",
      higherEasier: "Maior = mais fácil",
      lowerAccessible: "Menor = mais acessível",
      topWords: "Palavras Mais Usadas",
      syllableNote: "Estimativa baseada em heurísticas de sílabas.",
      "fleschLabels.veryEasy": "Muito Fácil",
      "fleschLabels.easy": "Fácil",
      "fleschLabels.fairlyEasy": "Razoavelmente Fácil",
      "fleschLabels.standard": "Padrão Web",
      "fleschLabels.fairlyDifficult": "Razoavelmente Difícil",
      "fleschLabels.difficult": "Difícil",
      "fleschLabels.veryDifficult": "Muito Difícil",
      "fleschLabels.veryConfusing": "Muito Confuso",
      "stats.fleschLabels.veryEasy": "Muito Fácil",
      "stats.fleschLabels.easy": "Fácil",
      "stats.fleschLabels.fairlyEasy": "Razoavelmente Fácil",
      "stats.fleschLabels.standard": "Padrão Web",
      "stats.fleschLabels.fairlyDifficult": "Razoavelmente Difícil",
      "stats.fleschLabels.difficult": "Difícil",
      "stats.fleschLabels.veryDifficult": "Muito Difícil",
      "stats.fleschLabels.veryConfusing": "Muito Confuso",
      "readingTime.placeholder": "Cole ou digite seu texto aqui para calcular o tempo de leitura e fala...",
    };

    const fn = (key: string, values?: Record<string, any>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const strippedKey = fullKey.replace(/^text\./, "");
      let val = translations[fullKey] || translations[strippedKey] || translations[key] || fullKey;
      if (values) {
        Object.entries(values).forEach(([k, v]) => {
          val = val.replace(`{${k}}`, String(v));
        });
      }
      return val;
    };
    fn.raw = (key: string) => translations[key] || [];
    return fn;
  },
}));

describe("Text Tools Suite", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  describe("WordCounterClient", () => {
    it("renders textarea, sample button, and updates stats upon typing", async () => {
      render(<WordCounterClient locale="pt" />);
      const textarea = screen.getByPlaceholderText("Cole ou digite seu texto aqui...");
      expect(textarea).toBeInTheDocument();

      fireEvent.change(textarea, { target: { value: "Olá mundo teste de palavras." } });

      await waitFor(() => {
        expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(1);
      });
    });

    it("transforms text to uppercase and lowercase", () => {
      render(<WordCounterClient locale="pt" />);
      const textarea = screen.getByPlaceholderText("Cole ou digite seu texto aqui...") as HTMLTextAreaElement;

      fireEvent.change(textarea, { target: { value: "texto simples" } });

      const uppercaseBtn = screen.getByTitle("Transformar em MAIÚSCULAS");
      fireEvent.click(uppercaseBtn);
      expect(textarea.value).toBe("TEXTO SIMPLES");

      const lowercaseBtn = screen.getByTitle("Transformar em minúsculas");
      fireEvent.click(lowercaseBtn);
      expect(textarea.value).toBe("texto simples");
    });

    it("selects word goals and calculates progress percentage", async () => {
      render(<WordCounterClient locale="pt" />);
      const textarea = screen.getByPlaceholderText("Cole ou digite seu texto aqui...");

      // Select Tweet / X (50) preset
      const tweetBtn = screen.getByText("Tweet / X (50)");
      fireEvent.click(tweetBtn);

      fireEvent.change(textarea, { target: { value: "uma duas tres quatro cinco" } });

      await waitFor(() => {
        expect(screen.getByText(/10%/)).toBeInTheDocument();
      });
    });

    it("renders localized readability labels (Portuguese)", () => {
      render(<WordCounterClient locale="pt" />);
      expect(screen.getByText("Facilidade de Leitura Flesch")).toBeInTheDocument();
      expect(screen.getByText("Muito Difícil")).toBeInTheDocument();
    });
  });

  describe("CharacterCounterClient", () => {
    it("renders platform limits (Twitter/X, Meta Title, SMS)", () => {
      render(<CharacterCounterClient locale="pt" />);
      expect(screen.getByText("X / Twitter")).toBeInTheDocument();
      expect(screen.getByText("SEO Meta Title")).toBeInTheDocument();
      expect(screen.getByText("SMS (1 Segmento)")).toBeInTheDocument();
      expect(screen.getByText("Instagram Legenda")).toBeInTheDocument();
    });

    it("updates character counts and displays remaining limit", () => {
      render(<CharacterCounterClient locale="pt" />);
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "Teste com 22 caracteres" } });
      expect(screen.getAllByText("23").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("ReadingTimeClient", () => {
    it("renders reading and speaking estimations", () => {
      render(<ReadingTimeClient locale="pt" />);
      expect(screen.getByText("Tempo de Leitura")).toBeInTheDocument();
      expect(screen.getByText("Tempo de Fala")).toBeInTheDocument();
    });

    it("activates speed reader button when text is present", () => {
      render(<ReadingTimeClient locale="pt" />);
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "Exemplo para speed reading." } });

      const startSpeedBtn = screen.getByText("Iniciar Leitura Dinâmica");
      expect(startSpeedBtn).toBeInTheDocument();

      fireEvent.click(startSpeedBtn);
      expect(screen.getByText("Leitura Dinâmica (RSVP)")).toBeInTheDocument();
    });
  });

  describe("ReadabilityCheckerClient", () => {
    it("renders Flesch Reading Ease and Gunning Fog scores", async () => {
      render(<ReadabilityCheckerClient locale="pt" />);
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, {
        target: { value: "Simple sentences are easy to read. This is another clear sentence." },
      });

      await waitFor(() => {
        expect(screen.getByText("Facilidade de Leitura Flesch")).toBeInTheDocument();
        expect(screen.getByText("Grau Flesch-Kincaid")).toBeInTheDocument();
        expect(screen.getByText("Gunning Fog")).toBeInTheDocument();
      });
    });
  });

  describe("KeywordDensityClient", () => {
    it("calculates keyword frequency and switches phrase lengths", async () => {
      const { container } = render(<KeywordDensityClient locale="pt" />);
      const textarea = container.querySelector("textarea")!;

      fireEvent.change(textarea, {
        target: { value: "apple banana apple cherry apple banana orange" },
      });

      expect(screen.getAllByText("apple").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("banana").length).toBeGreaterThanOrEqual(1);

      // Switch to 2 Words
      const twoWordsBtn = screen.getByText("2 Palavras");
      fireEvent.click(twoWordsBtn);

      expect(screen.getAllByText("apple banana").length).toBeGreaterThanOrEqual(1);
    });
  });
});
