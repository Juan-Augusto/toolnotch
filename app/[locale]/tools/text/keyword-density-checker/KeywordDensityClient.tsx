"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { STOPWORDS } from "@/data/stopwords";
import AppTable, {
  AppTableHeader,
  AppTableBody,
  AppTableRow,
  AppTableHead,
  AppTableCell,
} from "@/components/ui/AppTable";
import { AppInput } from "@/components/ui";
import TextActionBar from "../components/TextActionBar";

const MULTILINGUAL_STOPWORDS = new Set([
  // English
  ...Array.from(STOPWORDS),
  // Portuguese
  "de", "a", "o", "que", "e", "do", "da", "em", "um", "para", "com", "nao", "não",
  "uma", "os", "no", "se", "na", "por", "mais", "as", "dos", "como", "mas", "foi",
  "ao", "ele", "das", "tem", "à", "seu", "sua", "ou", "ser", "quando", "muito",
  "ha", "há", "nos", "já", "está", "eu", "também", "tambem", "só", "pelo", "pela",
  "até", "isso", "ela", "entre", "era", "depois", "sem", "mesmo", "aos", "ter",
  "seus", "quem", "nas", "me", "esse", "eles", "estão", "você", "voce", "tinha",
  "foram", "essa", "num", "nem", "suas", "meu", "às", "minha", "têm", "numa",
  "pelos", "elas", "havia", "seja", "qual", "será", "nós", "tenho", "lhe", "deles",
  "essas", "esses", "pelas", "este", "fosse", "dele", "tu", "te", "vocês", "vos",
  // Spanish
  "el", "la", "los", "las", "un", "una", "unos", "unas", "y", "en", "de", "que",
  "es", "por", "para", "con", "no", "una", "su", "al", "lo", "como", "más", "pero",
  "sus", "le", "ya", "o", "este", "sí", "porque", "esta", "son", "entre", "está",
  "cuando", "muy", "sin", "sobre", "ser", "tiene", "también", "me", "hasta", "hay",
  "donde", "quien", "desde", "todo", "nos", "durante", "todos", "uno", "les", "ni",
  "contra", "otros", "ese", "eso", "ante", "ellos", "e", "esto", "mí", "antes",
  "algunos", "qué", "unos", "yo", "otro", "otras", "otra", "él", "tanto", "esa",
]);

interface KeywordDensityClientProps {
  locale?: string;
  placeholder?: string;
}

type PhraseLength = 1 | 2 | 3;

interface KeywordItem {
  keyword: string;
  count: number;
  density: number;
}

export default function KeywordDensityClient({
  locale = "pt",
  placeholder,
}: KeywordDensityClientProps) {
  const t = useTranslations("text");
  const [text, setText] = useState("");
  const [phraseLength, setPhraseLength] = useState<PhraseLength>(1);
  const [filterQuery, setFilterQuery] = useState("");
  const [ignoreStopwords, setIgnoreStopwords] = useState(true);

  const handleClear = useCallback(() => setText(""), []);
  const handleSample = useCallback(() => setText(t("sampleText")), [t]);

  // Limpeza de palavras
  const words = useMemo(() => {
    if (!text.trim()) return [];
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s']/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1);
  }, [text]);

  const totalWordsCount = words.length;

  // Cálculo de densidade por N-Gram
  const keywordStats = useMemo(() => {
    if (words.length === 0) return [];

    const freqMap: Record<string, number> = {};

    if (phraseLength === 1) {
      for (const word of words) {
        if (ignoreStopwords && MULTILINGUAL_STOPWORDS.has(word)) continue;
        freqMap[word] = (freqMap[word] ?? 0) + 1;
      }
    } else if (phraseLength === 2) {
      for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i];
        const w2 = words[i + 1];
        if (ignoreStopwords && (MULTILINGUAL_STOPWORDS.has(w1) && MULTILINGUAL_STOPWORDS.has(w2))) {
          continue;
        }
        const phrase = `${w1} ${w2}`;
        freqMap[phrase] = (freqMap[phrase] ?? 0) + 1;
      }
    } else if (phraseLength === 3) {
      for (let i = 0; i < words.length - 2; i++) {
        const w1 = words[i];
        const w2 = words[i + 1];
        const w3 = words[i + 2];
        if (
          ignoreStopwords &&
          MULTILINGUAL_STOPWORDS.has(w1) &&
          MULTILINGUAL_STOPWORDS.has(w2) &&
          MULTILINGUAL_STOPWORDS.has(w3)
        ) {
          continue;
        }
        const phrase = `${w1} ${w2} ${w3}`;
        freqMap[phrase] = (freqMap[phrase] ?? 0) + 1;
      }
    }

    const items: KeywordItem[] = Object.entries(freqMap)
      .map(([keyword, count]) => {
        const density = totalWordsCount > 0 ? (count / totalWordsCount) * 100 : 0;
        return {
          keyword,
          count,
          density: Math.round(density * 100) / 100,
        };
      })
      .sort((a, b) => b.count - a.count);

    return items;
  }, [words, phraseLength, ignoreStopwords, totalWordsCount]);

  // Filtro de busca do usuário
  const filteredKeywords = useMemo(() => {
    if (!filterQuery.trim()) return keywordStats.slice(0, 30);
    const q = filterQuery.toLowerCase().trim();
    return keywordStats.filter((item) => item.keyword.includes(q)).slice(0, 30);
  }, [keywordStats, filterQuery]);

  const uniqueWordsCount = useMemo(() => {
    return new Set(words).size;
  }, [words]);

  const topKeyword = keywordStats[0];

  const hasKeywordStuffingWarning = useMemo(() => {
    return keywordStats.some((item) => item.density > 3.5 && item.count >= 4);
  }, [keywordStats]);

  return (
    <section
      aria-label={t("keywordDensity.title")}
      className="mb-10 sm:mb-14 w-full space-y-4 sm:space-y-5"
    >
      <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] overflow-hidden focus-within:border-foreground/40 transition-colors">
        <textarea
          rows={12}
          className="w-full min-h-[280px] sm:min-h-[340px] h-72 sm:h-84 p-4 sm:p-5 bg-transparent border-none text-foreground placeholder:text-label/50 focus:outline-none transition-all font-sans resize-y leading-relaxed"
          placeholder={placeholder ?? t("keywordDensity.description")}
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
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
            {totalWordsCount.toLocaleString()}
          </div>
          <div className="text-xs font-mono uppercase font-medium tracking-wider text-foreground mt-1">
            {locale === "pt" ? "Total de Palavras" : locale === "es" ? "Total Palabras" : "Total Words"}
          </div>
        </div>

        <div className="p-3.5 sm:p-4 text-center border-b sm:border-b-0 sm:border-r border-border">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
            {uniqueWordsCount.toLocaleString()}
          </div>
          <div className="text-xs font-mono uppercase font-medium tracking-wider text-foreground mt-1">
            {locale === "pt" ? "Palavras Únicas" : locale === "es" ? "Palabras Únicas" : "Unique Words"}
          </div>
        </div>

        <div className="p-3.5 sm:p-4 text-center border-r border-border">
          <div className="text-lg sm:text-xl font-mono font-bold text-primary truncate">
            {topKeyword ? topKeyword.keyword : "-"}
          </div>
          <div className="text-xs font-mono uppercase font-medium tracking-wider text-foreground mt-1">
            {locale === "pt" ? "Termo Mais Frequente" : locale === "es" ? "Más Frecuente" : "Top Keyword"}
          </div>
        </div>

        <div className="p-3.5 sm:p-4 text-center">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
            {topKeyword ? `${topKeyword.density}%` : "0%"}
          </div>
          <div className="text-xs font-mono uppercase font-medium tracking-wider text-foreground mt-1">
            {locale === "pt" ? "Densidade Máxima" : locale === "es" ? "Densidad Máxima" : "Max Density"}
          </div>
        </div>
      </div>

      {hasKeywordStuffingWarning && (
        <div
          role="alert"
          className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-[2px] flex items-center gap-2.5 font-mono"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {locale === "pt"
              ? "Atenção: Alguns termos ultrapassam 3.5% de densidade. O excesso de repetição (keyword stuffing) pode prejudicar o SEO no Google."
              : locale === "es"
                ? "Atención: Algunos términos superan el 3.5% de densidad. La sobreoptimización (keyword stuffing) puede penalizar su SEO."
                : "Warning: Some terms exceed 3.5% density. Excessive keyword repetition (stuffing) can trigger search engine penalties."}
          </span>
        </div>
      )}

      <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] overflow-hidden">
        <div className="p-3.5 sm:p-4 bg-background/50 dark:bg-foreground/[0.03] border-b border-border space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setPhraseLength(len as PhraseLength)}
                  className={`px-3 py-1.5 font-mono rounded-[2px] border transition-colors cursor-pointer ${
                    phraseLength === len
                      ? "bg-foreground text-background border-foreground font-semibold"
                      : "bg-background border-border text-foreground/70 hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  {len}{" "}
                  {len === 1
                    ? locale === "pt"
                      ? "Palavra"
                      : locale === "es"
                        ? "Palabra"
                        : "Word"
                    : locale === "pt"
                      ? "Palavras"
                      : locale === "es"
                        ? "Palabras"
                        : "Words"}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 font-mono text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ignoreStopwords}
                onChange={(e) => setIgnoreStopwords(e.target.checked)}
                className="accent-primary rounded-[2px]"
              />
              <span>
                {locale === "pt"
                  ? "Ocultar Stopwords (de, o, a, in, the)"
                  : locale === "es"
                    ? "Ocultar Stopwords (de, el, la, in, the)"
                    : "Hide Stopwords (a, the, in, to)"}
              </span>
            </label>
          </div>

          <div>
            <AppInput
              id="keyword-search-filter"
              type="text"
              placeholder={
                locale === "pt"
                  ? "Filtrar por palavra ou termo específico..."
                  : locale === "es"
                    ? "Filtrar por palabra o término específico..."
                    : "Filter by keyword or phrase..."
              }
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              variant="background"
              prefix={<Search className="w-3.5 h-3.5 text-foreground/70" />}
              className="h-9 font-mono"
            />
          </div>
        </div>

        <div>
          <AppTable border={false} hoverable={true} aria-label="Tabela de Densidade de Palavras-Chave">
            <AppTableHeader>
              <AppTableRow hoverable={false}>
                <AppTableHead>
                  {locale === "pt"
                    ? "Palavra-Chave / Frase"
                    : locale === "es"
                      ? "Palabra Clave / Frase"
                      : "Keyword / Phrase"}
                </AppTableHead>
                <AppTableHead align="center">
                  {locale === "pt" ? "Ocorrências" : locale === "es" ? "Ocurrencias" : "Count"}
                </AppTableHead>
                <AppTableHead align="right">
                  {locale === "pt" ? "Densidade" : locale === "es" ? "Densidad" : "Density"}
                </AppTableHead>
                <AppTableHead align="right">
                  {locale === "pt" ? "Status SEO" : locale === "es" ? "Estado SEO" : "SEO Status"}
                </AppTableHead>
              </AppTableRow>
            </AppTableHeader>
            <AppTableBody>
              {filteredKeywords.length > 0 ? (
                filteredKeywords.map((item, idx) => {
                  const isHigh = item.density > 3.5;
                  const isOptimal = item.density >= 1.0 && item.density <= 3.0;

                  return (
                    <AppTableRow key={idx}>
                      <AppTableCell className="font-mono font-medium text-foreground">
                        {item.keyword}
                      </AppTableCell>
                      <AppTableCell align="center" className="font-mono text-foreground/70">
                        {item.count}
                      </AppTableCell>
                      <AppTableCell align="right" className="font-mono font-bold text-foreground">
                        {item.density}%
                      </AppTableCell>
                      <AppTableCell align="right">
                        {isHigh ? (
                          <span className="inline-flex items-center justify-end gap-1.5 font-mono text-xs font-medium text-red-600 dark:text-red-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {locale === "pt" ? "Excesso" : locale === "es" ? "Exceso" : "High"}
                          </span>
                        ) : isOptimal ? (
                          <span className="inline-flex items-center justify-end gap-1.5 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {locale === "pt" ? "Ideal" : locale === "es" ? "Ideal" : "Optimal"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-end gap-1.5 font-mono text-xs text-label">
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
                            {locale === "pt" ? "Baixa" : locale === "es" ? "Baja" : "Low"}
                          </span>
                        )}
                      </AppTableCell>
                    </AppTableRow>
                  );
                })
              ) : (
                <AppTableRow hoverable={false}>
                  <AppTableCell colSpan={4} align="center" className="py-8 text-foreground font-mono">
                    {text.trim()
                      ? locale === "pt"
                        ? "Nenhum termo encontrado com o filtro atual."
                        : locale === "es"
                          ? "Ningún término coincide con el filtro actual."
                          : "No terms match your search filter."
                      : locale === "pt"
                        ? "Digite ou cole um texto acima para analisar a densidade de palavras."
                        : locale === "es"
                          ? "Escribe o pega un texto arriba para analizar la densidad de palabras."
                          : "Enter or paste text above to analyze keyword density."}
                  </AppTableCell>
                </AppTableRow>
              )}
            </AppTableBody>
          </AppTable>
        </div>
      </div>
    </section>
  );
}
