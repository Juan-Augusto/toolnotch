"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  Twitter,
  Search,
  MessageSquare,
  Instagram,
  Linkedin,
  Share2,
} from "lucide-react";
import TextActionBar from "../components/TextActionBar";

interface PlatformLimit {
  id: string;
  name: Record<string, string>;
  max: number;
  icon: React.ReactNode;
  category: "social" | "seo" | "messaging";
}

const PLATFORMS: PlatformLimit[] = [
  {
    id: "twitter",
    name: { pt: "X / Twitter", es: "X / Twitter", en: "X / Twitter" },
    max: 280,
    icon: <Twitter className="w-4 h-4 text-foreground/70" />,
    category: "social",
  },
  {
    id: "seo-title",
    name: { pt: "SEO Meta Title", es: "SEO Meta Title", en: "SEO Meta Title" },
    max: 60,
    icon: <Search className="w-4 h-4 text-foreground/70" />,
    category: "seo",
  },
  {
    id: "seo-description",
    name: { pt: "SEO Meta Description", es: "SEO Meta Description", en: "SEO Meta Description" },
    max: 160,
    icon: <Search className="w-4 h-4 text-foreground/70" />,
    category: "seo",
  },
  {
    id: "sms",
    name: { pt: "SMS (1 Segmento)", es: "SMS (1 Segmento)", en: "SMS (1 Segment)" },
    max: 160,
    icon: <MessageSquare className="w-4 h-4 text-foreground/70" />,
    category: "messaging",
  },
  {
    id: "instagram-bio",
    name: { pt: "Instagram Bio", es: "Instagram Bio", en: "Instagram Bio" },
    max: 150,
    icon: <Instagram className="w-4 h-4 text-foreground/70" />,
    category: "social",
  },
  {
    id: "instagram-caption",
    name: { pt: "Instagram Legenda", es: "Descripción de Instagram", en: "Instagram Caption" },
    max: 2200,
    icon: <Instagram className="w-4 h-4 text-foreground/70" />,
    category: "social",
  },
  {
    id: "linkedin",
    name: { pt: "LinkedIn Post", es: "LinkedIn Post", en: "LinkedIn Post" },
    max: 3000,
    icon: <Linkedin className="w-4 h-4 text-foreground/70" />,
    category: "social",
  },
  {
    id: "pinterest",
    name: { pt: "Pinterest Pin", es: "Pinterest Pin", en: "Pinterest Pin" },
    max: 500,
    icon: <Share2 className="w-4 h-4 text-foreground/70" />,
    category: "social",
  },
];

interface CharacterCounterClientProps {
  locale?: string;
  placeholder?: string;
}

export default function CharacterCounterClient({
  locale = "pt",
  placeholder,
}: CharacterCounterClientProps) {
  const t = useTranslations("text");
  const [text, setText] = useState("");

  const charCount = text.length;
  const charNoSpacesCount = text.replace(/\s/g, "").length;
  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter((w) => w.length > 0).length;
  }, [text]);

  const smsSegments = charCount === 0 ? 0 : Math.ceil(charCount / 160);

  const handleClear = useCallback(() => setText(""), []);
  const handleSample = useCallback(() => setText(t("sampleText")), [t]);

  return (
    <section
      aria-label={t("characterCounter.title")}
      className="mb-10 sm:mb-14 w-full space-y-4 sm:space-y-5"
    >
      <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] grid grid-cols-2 sm:grid-cols-4 overflow-hidden">
        <div className="p-3.5 sm:p-4.5 text-center border-b sm:border-b-0 border-r border-border">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
            {charCount.toLocaleString()}
          </div>
          <div className="text-xs font-mono uppercase font-medium text-foreground mt-1 tracking-wider">
            {locale === "pt"
              ? "Caracteres Totais"
              : locale === "es"
                ? "Caracteres Totales"
                : "Total Characters"}
          </div>
        </div>

        <div className="p-3.5 sm:p-4.5 text-center border-b sm:border-b-0 sm:border-r border-border">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
            {charNoSpacesCount.toLocaleString()}
          </div>
          <div className="text-xs font-mono uppercase font-medium text-foreground mt-1 tracking-wider">
            {locale === "pt"
              ? "Sem Espaços"
              : locale === "es"
                ? "Sin Espacios"
                : "No Spaces"}
          </div>
        </div>

        <div className="p-3.5 sm:p-4.5 text-center border-r border-border">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
            {wordCount.toLocaleString()}
          </div>
          <div className="text-xs font-mono uppercase font-medium text-foreground mt-1 tracking-wider">
            {locale === "pt"
              ? "Palavras"
              : locale === "es"
                ? "Palabras"
                : "Words"}
          </div>
        </div>

        <div className="p-3.5 sm:p-4.5 text-center">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
            {smsSegments}
          </div>
          <div className="text-xs font-mono uppercase font-medium text-foreground mt-1 tracking-wider">
            {locale === "pt"
              ? "Segmentos SMS"
              : locale === "es"
                ? "Segmentos SMS"
                : "SMS Segments"}
          </div>
        </div>
      </div>

      <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] overflow-hidden focus-within:border-foreground/40 transition-colors">
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

      <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-background/50 dark:bg-foreground/[0.03] border-b border-border">
          <h2 className="font-medium uppercase text-foreground font-mono">
            {locale === "pt"
              ? "Limites por Plataforma & Redes Sociais"
              : locale === "es"
                ? "Límites por Plataforma y Redes Sociales"
                : "Platform & Social Media Limits"}
          </h2>
          <span className="font-mono text-foreground font-medium">
            {charCount} {locale === "pt" ? "caracteres atuais" : locale === "es" ? "caracteres actuales" : "current chars"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 p-3.5 sm:p-4 gap-3">
          {PLATFORMS.map((platform) => {
            const remaining = platform.max - charCount;
            const isExceeded = remaining < 0;
            const isWarning = remaining >= 0 && remaining <= platform.max * 0.15;
            const percent = Math.min(100, (charCount / platform.max) * 100);

            let statusColor = "bg-emerald-500";
            if (isExceeded) {
              statusColor = "bg-red-500";
            } else if (isWarning) {
              statusColor = "bg-amber-500";
            }

            return (
              <div
                key={platform.id}
                className="bg-background rounded-[2px] border border-border p-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {platform.icon}
                    <span className="font-mono font-semibold text-foreground">
                      {platform.name[locale] ?? platform.name.en}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-foreground">
                    {charCount} / {platform.max}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-tertiary border border-border/50 rounded-full overflow-hidden my-1.5">
                  <div
                    className={`h-full transition-all duration-200 ${statusColor}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between font-mono mt-0.5 text-xs">
                  {isExceeded ? (
                    <span className="flex items-center gap-1 text-foreground font-medium">
                      <AlertTriangle className="w-3 h-3 text-label" />
                      {Math.abs(remaining)}{" "}
                      {locale === "pt"
                        ? "caracteres a mais"
                        : locale === "es"
                          ? "caracteres de más"
                          : "chars over limit"}
                    </span>
                  ) : (
                    <span className="text-label">
                      {remaining}{" "}
                      {locale === "pt"
                        ? "restantes"
                        : locale === "es"
                          ? "restantes"
                          : "remaining"}
                    </span>
                  )}

                  <span className="text-label">
                    {Math.round((charCount / platform.max) * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
