"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Gauge,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { analyzeText } from "@/lib/textAnalysis";
import { TextStats, getFleschKey, getFleschColor } from "@/lib/textTypes";
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

interface ReadabilityCheckerClientProps {
  locale?: string;
  placeholder?: string;
}

export default function ReadabilityCheckerClient({
  locale = "pt",
  placeholder,
}: ReadabilityCheckerClientProps) {
  const t = useTranslations("text");
  const tr = useTranslations("text.stats");
  const [text, setText] = useState("");
  const [stats, setStats] = useState<TextStats>(EMPTY_STATS);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(analyzeText(text));
    }, 150);
    return () => clearTimeout(timer);
  }, [text]);

  const handleClear = useCallback(() => setText(""), []);
  const handleSample = useCallback(() => setText(t("sampleText")), [t]);

  const fleschKey = getFleschKey(stats.fleschEase);
  const fleschLabel = tr(`fleschLabels.${fleschKey}`);
  const fleschColor = getFleschColor(stats.fleschEase);

  // Determinar interpretação qualitativa do Flesch
  const getFleschInterpretation = (ease: number) => {
    if (ease >= 90) {
      return {
        level: locale === "pt" ? "Muito Fácil (5º ano escolar)" : locale === "es" ? "Muy Fácil (5º grado escolar)" : "Very Easy (5th grade)",
        desc: locale === "pt" ? "Linguagem simples, conversacional e direta. Compreendida por praticamente qualquer leitor." : locale === "es" ? "Lenguaje simple y directo. Comprendido por casi cualquier lector." : "Simple, conversational language understood by nearly anyone.",
      };
    }
    if (ease >= 70) {
      return {
        level: locale === "pt" ? "Fácil a Acessível (6º a 7º ano)" : locale === "es" ? "Fácil a Accesible (6º a 7º grado)" : "Fairly Easy (6th-7th grade)",
        desc: locale === "pt" ? "Inglês/Português conversacional padrão. Ideal para a maioria dos blogs, landing pages e e-mails." : locale === "es" ? "Ideal para la mayoría de blogs, páginas web y correos." : "Ideal for most consumer blogs, landing pages, and email copy.",
      };
    }
    if (ease >= 60) {
      return {
        level: locale === "pt" ? "Padrão da Web (8º a 9º ano)" : locale === "es" ? "Estándar de la Web (8º a 9º grado)" : "Standard Web (8th-9th grade)",
        desc: locale === "pt" ? "Adequado para adultos em geral. Texto claro, sem jargões desnecessários." : locale === "es" ? "Adecuado para adultos en general. Texto claro sin jerga técnica." : "Clear text for general adult audiences without excessive jargon.",
      };
    }
    if (ease >= 50) {
      return {
        level: locale === "pt" ? "Razoavelmente Difícil (Ensino Médio)" : locale === "es" ? "Razonablemente Difícil (Bachillerato)" : "Fairly Difficult (High School)",
        desc: locale === "pt" ? "Exige atenção e vocabulário avançado. Comum em artigos jornalísticos densos e manuais." : locale === "es" ? "Exige atención y vocabulario avanzado. Típico de artículos de prensa seria." : "Requires focused attention. Common in investigative journalism and manuals.",
      };
    }
    if (ease >= 30) {
      return {
        level: locale === "pt" ? "Difícil (Nível Universitário)" : locale === "es" ? "Difícil (Nivel Universitario)" : "Difficult (College Level)",
        desc: locale === "pt" ? "Vocabulário técnico ou acadêmico denso. Frases longas com múltiplas orações subordinadas." : locale === "es" ? "Vocabulario técnico denso y oraciones largas." : "Dense technical or academic vocabulary with multi-clause sentences.",
      };
    }
    return {
      level: locale === "pt" ? "Muito Confuso / Pós-graduação" : locale === "es" ? "Muy Confuso / Posgrado" : "Very Confusing / Graduate",
      desc: locale === "pt" ? "Extremamente complexo. Recomendado para teses acadêmicas ou contratos jurídicos." : locale === "es" ? "Extremadamente complejo. Recomendado para tesis o contratos legales." : "Extremely dense. Typical of legal contracts or scientific papers.",
    };
  };

  const interpretation = getFleschInterpretation(stats.fleschEase);

  return (
    <section
      aria-label={t("readabilityChecker.title")}
      className="mb-10 sm:mb-14 w-full space-y-4 sm:space-y-5"
    >
      <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] overflow-hidden focus-within:border-foreground/40 transition-colors">
        <textarea
          rows={12}
          className="w-full min-h-[280px] sm:min-h-[340px] h-72 sm:h-84 p-4 sm:p-5 bg-transparent border-none text-foreground placeholder:text-label/50 focus:outline-none transition-all font-sans resize-y leading-relaxed"
          placeholder={placeholder ?? t("readabilityChecker.description")}
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

      <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
                {tr("fleschEase")}
              </span>
              <Gauge className="w-4 h-4 text-foreground/70" />
            </div>
            <div className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight ${fleschColor}`}>
              {stats.fleschEase} <span className="font-normal text-foreground/70">/ 100</span>
            </div>
            <div className={`font-mono font-medium mt-1 ${fleschColor}`}>
              {fleschLabel}
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="w-full bg-tertiary h-2 rounded-[2px] overflow-hidden border border-border/50">
              <div
                className="h-full transition-all duration-300 bg-primary"
                style={{ width: `${Math.min(100, Math.max(0, stats.fleschEase))}%` }}
              />
            </div>
            <div className="flex justify-between font-mono font-medium text-foreground">
              <span>0 ({locale === "pt" ? "Difícil" : locale === "es" ? "Difícil" : "Difficult"})</span>
              <span>60 (Web)</span>
              <span>100 ({locale === "pt" ? "Fácil" : locale === "es" ? "Fácil" : "Easy"})</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
                {tr("fleschGrade")}
              </span>
              <GraduationCap className="w-4 h-4 text-foreground/70" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-foreground">
              {stats.fleschGrade}
            </div>
            <div className="font-mono text-foreground mt-1">
              {tr("gradeLevel")}
            </div>
          </div>

          <div className="font-mono text-foreground mt-4">
            {locale === "pt"
              ? `Exige escolaridade equivalente ao ${stats.fleschGrade}º ano`
              : locale === "es"
                ? `Nivel escolar equivalente a ${stats.fleschGrade}º grado`
                : `Requires ${stats.fleschGrade}th grade education level`}
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
                {tr("gunningFog")}
              </span>
              <BookOpen className="w-4 h-4 text-foreground/70" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-foreground">
              {stats.gunningFog}
            </div>
            <div className="font-mono text-foreground mt-1">
              {tr("yearsEducation")}
            </div>
          </div>

          <div className="font-mono text-foreground mt-4">
            {locale === "pt"
              ? "Pontuação ideal entre 7 e 10 para público amplo"
              : locale === "es"
                ? "Puntuación ideal entre 7 y 10 para público general"
                : "Ideal score between 7 and 10 for web content"}
          </div>
        </div>
      </div>

      <div className="bg-tertiary dark:bg-background rounded-[2px] border border-border p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
            {locale === "pt" ? "Diagnóstico de Clareza" : locale === "es" ? "Diagnóstico de Claridad" : "Clarity Diagnosis"}
          </span>
        </div>
        <div className="font-mono font-bold text-foreground mb-1">
          {interpretation.level}
        </div>
        <p className="text-foreground leading-relaxed">
          {interpretation.desc}
        </p>
      </div>

      <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] grid grid-cols-2 sm:grid-cols-4 overflow-hidden">
        <div className="p-3.5 sm:p-4 text-center border-b sm:border-b-0 border-r border-border">
          <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-foreground">
            {stats.avgWordsPerSentence}
          </div>
          <div className="text-xs font-mono font-medium uppercase tracking-wider text-foreground mt-1">
            {tr("avgWordsPerSentence")}
          </div>
        </div>

        <div className="p-3.5 sm:p-4 text-center border-b sm:border-b-0 sm:border-r border-border">
          <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-foreground">
            {stats.avgSyllablesPerWord}
          </div>
          <div className="text-xs font-mono font-medium uppercase tracking-wider text-foreground mt-1">
            {locale === "pt" ? "Sílabas / Palavra" : locale === "es" ? "Sílabas / Palabra" : "Syllables / Word"}
          </div>
        </div>

        <div className="p-3.5 sm:p-4 text-center border-r border-border">
          <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-foreground">
            {stats.sentences}
          </div>
          <div className="text-xs font-mono font-medium uppercase tracking-wider text-foreground mt-1">
            {tr("sentences")}
          </div>
        </div>

        <div className="p-3.5 sm:p-4 text-center">
          <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-foreground">
            {stats.paragraphs}
          </div>
          <div className="text-xs font-mono font-medium uppercase tracking-wider text-foreground mt-1">
            {tr("paragraphs")}
          </div>
        </div>
      </div>
    </section>
  );
}
