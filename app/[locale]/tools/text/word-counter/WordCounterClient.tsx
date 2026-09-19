"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Type,
  AlignLeft,
  Clock,
  Mic,
  Target,
  CheckCircle2,
  Scissors,
  FileText,
} from "lucide-react";
import { analyzeText } from "@/lib/textAnalysis";
import { TextStats } from "@/lib/textTypes";
import AppReadabilityPanel from "@/components/text-counter/AppReadabilityPanel";
import AppTopWordsChart from "@/components/text-counter/AppTopWordsChart";
import { AppCard, AppButton } from "@/components/ui";
import TextActionBar from "../components/TextActionBar";

const EMPTY_STATS: TextStats = {
  words: 0,
  characters: 0,
  charactersNoSpaces: 0,
  sentences: 0,
  paragraphs: 0,
  readingTime: 0,
  speakingTime: 0,
  fleschEase: 0,
  fleschGrade: 0,
  gunningFog: 0,
  avgWordsPerSentence: 0,
  avgSyllablesPerWord: 0,
  topWords: [],
};

interface GoalPreset {
  id: string;
  words: number;
  label: Record<string, string>;
}

const GOAL_PRESETS: GoalPreset[] = [
  { id: "free", words: 0, label: { pt: "Sem Meta", es: "Sin Meta", en: "No Goal" } },
  { id: "tweet", words: 50, label: { pt: "Tweet / X (50)", es: "Tweet / X (50)", en: "Tweet / X (50)" } },
  { id: "essay", words: 300, label: { pt: "Redação (300)", es: "Redacción (300)", en: "Essay (300)" } },
  { id: "blog", words: 800, label: { pt: "Blog Post (800)", es: "Blog Post (800)", en: "Blog Post (800)" } },
  { id: "article", words: 1500, label: { pt: "Artigo (1.500)", es: "Artículo (1.500)", en: "Article (1,500)" } },
];

interface WordCounterClientProps {
  locale?: string;
  placeholder?: string;
}

export default function WordCounterClient({
  locale = "pt",
  placeholder,
}: WordCounterClientProps) {
  const t = useTranslations("text");
  const [text, setText] = useState("");
  const [stats, setStats] = useState<TextStats>(EMPTY_STATS);
  const [targetWords, setTargetWords] = useState<number>(0);
  const [customTargetInput, setCustomTargetInput] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(analyzeText(text));
    }, 100);
    return () => clearTimeout(timer);
  }, [text]);

  const handleClear = useCallback(() => {
    setText("");
  }, []);

  const handleSample = useCallback(() => {
    setText(t("sampleText"));
  }, [t]);


  // Transformações de Texto
  const transformUppercase = useCallback(() => {
    setText((prev) => prev.toUpperCase());
  }, []);

  const transformLowercase = useCallback(() => {
    setText((prev) => prev.toLowerCase());
  }, []);

  const transformTitlecase = useCallback(() => {
    setText((prev) =>
      prev.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      )
    );
  }, []);

  const cleanExtraSpaces = useCallback(() => {
    setText((prev) =>
      prev
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s*\n/g, "\n\n")
        .trim()
    );
  }, []);

  // Formatador de tempo de leitura
  const formatReadingTime = useCallback((words: number) => {
    if (words === 0) return "0s";
    const minutes = Math.floor(words / 238);
    const seconds = Math.round((words % 238) / (238 / 60));
    if (minutes === 0) return `${seconds}s`;
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }, []);

  // Formatador de tempo de fala
  const formatSpeakingTime = useCallback((words: number) => {
    if (words === 0) return "0s";
    const minutes = Math.floor(words / 130);
    const seconds = Math.round((words % 130) / (130 / 60));
    if (minutes === 0) return `${seconds}s`;
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }, []);

  const lineCount = useMemo(() => {
    if (!text) return 0;
    return text.split("\n").length;
  }, [text]);

  return (
    <section aria-label={t("wordCounter.title")} className="mb-10 sm:mb-14 w-full space-y-4 sm:space-y-5">
      <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] grid grid-cols-2 lg:grid-cols-4 overflow-hidden">
        <div className="p-3.5 sm:p-4.5 flex flex-col justify-between border-b lg:border-b-0 border-r border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
              {t("stats.words")}
            </span>
            <FileText className="w-4 h-4 text-foreground/70" />
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-foreground tracking-tight">
            {stats.words.toLocaleString()}
          </div>
          <div className="font-mono text-label mt-2">
            {stats.sentences > 0
              ? `${stats.avgWordsPerSentence} pal/frase`
              : locale === "pt"
                ? "0 pal/frase"
                : locale === "es"
                  ? "0 pal/oración"
                  : "0 w/sent"}
          </div>
        </div>

        <div className="p-3.5 sm:p-4.5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
              {t("stats.characters")}
            </span>
            <AlignLeft className="w-4 h-4 text-foreground/70" />
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-foreground tracking-tight">
            {stats.characters.toLocaleString()}
          </div>
          <div className="font-mono text-label mt-2">
            {stats.charactersNoSpaces.toLocaleString()}{" "}
            {locale === "pt" ? "sem espaços" : locale === "es" ? "sin espacios" : "no spaces"}
          </div>
        </div>

        <div className="p-3.5 sm:p-4.5 flex flex-col justify-between border-r border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
              {t("stats.readingTime")}
            </span>
            <Clock className="w-4 h-4 text-foreground/70" />
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-foreground tracking-tight">
            {formatReadingTime(stats.words)}
          </div>
          <div className="font-mono text-label mt-2">
            238 ppm ({locale === "pt" ? "leitura" : locale === "es" ? "lectura" : "reading"})
          </div>
        </div>

        <div className="p-3.5 sm:p-4.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
              {t("stats.speakingTime")}
            </span>
            <Mic className="w-4 h-4 text-foreground/70" />
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-foreground tracking-tight">
            {formatSpeakingTime(stats.words)}
          </div>
          <div className="font-mono text-label mt-2">
            130 ppm ({locale === "pt" ? "discurso" : locale === "es" ? "discurso" : "speech"})
          </div>
        </div>
      </div>

      <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] overflow-hidden focus-within:border-foreground/40 transition-colors">
        <div className="px-3.5 py-2.5 bg-background/50 dark:bg-foreground/[0.03] border-b border-border space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-mono font-medium text-foreground">
              <Target className="w-4 h-4 text-foreground/70" />
              <span>{locale === "pt" ? "Meta de Palavras:" : locale === "es" ? "Meta de Palabras:" : "Word Goal:"}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {GOAL_PRESETS.map((preset) => {
                const active = targetWords === preset.words && !showCustomInput;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setTargetWords(preset.words);
                      setShowCustomInput(false);
                    }}
                    className={`px-2.5 py-1 font-mono text-xs rounded-[2px] border transition-colors cursor-pointer ${
                      active
                        ? "bg-secondary text-white dark:text-black border-secondary font-medium"
                        : "bg-background border-border text-label hover:text-foreground hover:border-foreground/40"
                    }`}
                  >
                    {preset.label[locale] || preset.label.pt}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={`px-2.5 py-1 font-mono text-xs rounded-[2px] border transition-colors cursor-pointer ${
                  showCustomInput
                    ? "bg-secondary text-white dark:text-black border-secondary font-medium"
                    : "bg-background border-border text-label hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {locale === "pt" ? "Personalizada" : locale === "es" ? "Personalizada" : "Custom"}
              </button>
            </div>
          </div>

          {showCustomInput && (
            <div className="flex items-center gap-2 pt-1 border-t border-border/60">
              <span className="font-mono text-label">
                {locale === "pt" ? "Definir meta:" : locale === "es" ? "Definir meta:" : "Set goal:"}
              </span>
              <input
                type="number"
                min="1"
                step="10"
                placeholder="Ex: 500"
                value={customTargetInput}
                onChange={(e) => {
                  setCustomTargetInput(e.target.value);
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val > 0) {
                    setTargetWords(val);
                  }
                }}
                className="w-24 px-2.5 py-1 bg-background border border-border rounded-[2px] font-mono text-foreground focus:outline-none focus:border-foreground"
              />
              <span className="font-mono text-label">
                {locale === "pt" ? "palavras" : locale === "es" ? "palabras" : "words"}
              </span>
            </div>
          )}

          {targetWords > 0 && (
            <div className="space-y-1.5 pt-1.5 border-t border-border/60">
              <div className="flex justify-between font-mono">
                <span className="text-label">
                  <span className="font-bold text-foreground">{stats.words.toLocaleString()}</span> / {targetWords.toLocaleString()}{" "}
                  {locale === "pt" ? "palavras" : locale === "es" ? "palabras" : "words"}
                </span>
                <span className="font-bold text-foreground">
                  {stats.words >= targetWords ? (
                    <span className="flex items-center gap-1 text-foreground">
                      <CheckCircle2 className="w-4 h-4 inline text-foreground/70" />
                      {locale === "pt" ? "Meta Atingida" : locale === "es" ? "Meta Lograda" : "Goal Reached"} (
                      {Math.round((stats.words / targetWords) * 100)}%)
                    </span>
                  ) : (
                    `${Math.round((stats.words / targetWords) * 100)}%`
                  )}
                </span>
              </div>
              <div className="w-full bg-background border border-border/60 h-2 rounded-[2px] overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all duration-300"
                  style={{ width: `${Math.min(100, (stats.words / targetWords) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-background/30 dark:bg-foreground/[0.02] border-b border-border">
          <div className="flex items-center gap-2 font-mono text-xs text-label">
            <span className="font-medium text-foreground uppercase tracking-wider">
              {locale === "pt" ? "Editor" : locale === "es" ? "Editor" : "Editor"}
            </span>
            <span className="text-border">|</span>
            <span>
              {lineCount} {locale === "pt" ? "linhas" : locale === "es" ? "líneas" : "lines"}
            </span>
            <span className="text-border">|</span>
            <span>
              {stats.paragraphs} {t("stats.paragraphs").toLowerCase()}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={transformUppercase}
              title={locale === "pt" ? "Transformar em MAIÚSCULAS" : locale === "es" ? "Convertir a MAYÚSCULAS" : "Uppercase"}
              className="px-2.5 py-1 font-mono text-label hover:text-foreground hover:bg-foreground/[0.04] rounded-[2px] border border-transparent hover:border-border transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowUpAZ className="w-4 h-4" />
              <span className="font-medium">AA</span>
            </button>
            <button
              type="button"
              onClick={transformLowercase}
              title={locale === "pt" ? "Transformar em minúsculas" : locale === "es" ? "Convertir a minúsculas" : "Lowercase"}
              className="px-2.5 py-1 font-mono text-label hover:text-foreground hover:bg-foreground/[0.04] rounded-[2px] border border-transparent hover:border-border transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowDownAZ className="w-4 h-4" />
              <span className="font-medium">aa</span>
            </button>
            <button
              type="button"
              onClick={transformTitlecase}
              title={locale === "pt" ? "Primeira Letra Maiúscula" : locale === "es" ? "Primera Letra Mayúscula" : "Title Case"}
              className="px-2.5 py-1 font-mono text-label hover:text-foreground hover:bg-foreground/[0.04] rounded-[2px] border border-transparent hover:border-border transition-colors cursor-pointer flex items-center gap-1"
            >
              <Type className="w-4 h-4" />
              <span className="font-medium">Aa</span>
            </button>
            <button
              type="button"
              onClick={cleanExtraSpaces}
              title={locale === "pt" ? "Limpar Espaços Extras" : locale === "es" ? "Limpiar Espacios Extras" : "Trim Extra Spaces"}
              className="px-2.5 py-1 font-mono text-label hover:text-foreground hover:bg-foreground/[0.04] rounded-[2px] border border-transparent hover:border-border transition-colors cursor-pointer flex items-center gap-1"
            >
              <Scissors className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Textarea do Editor */}
        <textarea
          rows={12}
          className="w-full min-h-[280px] sm:min-h-[340px] h-72 sm:h-84 p-4 sm:p-5 bg-transparent border-none text-foreground placeholder:text-label/50 focus:outline-none transition-all font-sans resize-y leading-relaxed"
          placeholder={placeholder ?? t("wordCounter.placeholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck
        />

        <TextActionBar
          text={text}
          onSample={handleSample}
          onClear={handleClear}
        />
      </div>

      <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] grid grid-cols-2 sm:grid-cols-4 overflow-hidden">
        <div className="p-3.5 sm:p-4 text-center border-b sm:border-b-0 border-r border-border">
          <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">
            {stats.sentences.toLocaleString()}
          </div>
          <div className="text-xs font-mono uppercase tracking-wider text-foreground font-medium mt-1.5">
            {t("stats.sentences")}
          </div>
        </div>
        <div className="p-3.5 sm:p-4 text-center border-b sm:border-b-0 sm:border-r border-border">
          <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">
            {stats.paragraphs.toLocaleString()}
          </div>
          <div className="text-xs font-mono uppercase tracking-wider text-foreground font-medium mt-1.5">
            {t("stats.paragraphs")}
          </div>
        </div>
        <div className="p-3.5 sm:p-4 text-center border-r border-border">
          <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">
            {stats.avgWordsPerSentence}
          </div>
          <div className="text-xs font-mono uppercase tracking-wider text-foreground font-medium mt-1.5">
            {t("stats.avgWordsPerSentence")}
          </div>
        </div>
        <div className="p-3.5 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">
            {stats.avgSyllablesPerWord}
          </div>
          <div className="text-xs font-mono uppercase tracking-wider text-foreground font-medium mt-1.5">
            {locale === "pt"
              ? "Sílabas / Palavra"
              : locale === "es"
                ? "Sílabas / Palabra"
                : "Syllables / Word"}
          </div>
        </div>
      </div>

      <AppReadabilityPanel stats={stats} />

      {stats.topWords.length > 0 && (
        <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] p-4 sm:p-5">
          <AppTopWordsChart topWords={stats.topWords} />
        </div>
      )}
    </section>
  );
}
