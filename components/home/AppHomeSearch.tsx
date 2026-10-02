"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { TOOL_CATALOG, type CatalogEntry } from "@/lib/toolCatalog";
import { localizedPath } from "@/lib/i18nMeta";

interface ToolSearchItem {
  path: string;
  label: string;
  desc: string;
  category: string;
}

interface Props {
  locale: string;
  toolsTranslations: Record<string, { label?: string; desc?: string }>;
  categoriesTranslations: Record<string, string>;
  placeholder?: string;
}

const CATEGORY_NAMES: Record<string, { pt: string; en: string; es: string }> = {
  dev: { pt: "Desenvolvimento", en: "Developer", es: "Desarrollo" },
  agile: { pt: "Ágil & Scrum", en: "Agile & Scrum", es: "Ágil y Scrum" },
  pdf: { pt: "PDF & Docs", en: "PDF & Docs", es: "PDF y Documentos" },
  image: { pt: "Imagens", en: "Images", es: "Imágenes" },
  convert: { pt: "Conversores", en: "Converters", es: "Conversores" },
  finance: { pt: "Finanças", en: "Finance", es: "Finanzas" },
  text: { pt: "Texto", en: "Text", es: "Texto" },
  education: { pt: "Educação", en: "Education", es: "Educación" },
  health: { pt: "Saúde", en: "Health", es: "Salud" },
  math: { pt: "Matemática", en: "Math", es: "Matemática" },
  fun: { pt: "Diversão", en: "Fun", es: "Diversión" },
  utilities: { pt: "Utilitários", en: "Utilities", es: "Utilidades" },
  interview: { pt: "Entrevistas", en: "Interviews", es: "Entrevistas" },
  quizzes: { pt: "Quizzes", en: "Quizzes", es: "Quizzes" },
  blog: { pt: "Blog", en: "Blog", es: "Blog" },
};

export default function AppHomeSearch({
  locale,
  toolsTranslations,
  categoriesTranslations,
  placeholder = "Pesquisar ferramentas...",
}: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchableTools = useMemo<ToolSearchItem[]>(() => {
    return TOOL_CATALOG.map((entry: CatalogEntry) => {
      const trans = toolsTranslations[entry.labelKey] || {};
      const catKey = entry.category;
      const catName =
        categoriesTranslations[catKey] ||
        CATEGORY_NAMES[catKey]?.[locale as "pt" | "en" | "es"] ||
        entry.category;

      return {
        path: entry.path,
        label: trans.label || entry.labelKey,
        desc: trans.desc || "",
        category: catName,
      };
    });
  }, [toolsTranslations, categoriesTranslations, locale]);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchableTools
      .filter(
        (tool) =>
          tool.label.toLowerCase().includes(q) ||
          tool.desc.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, searchableTools]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-xl relative">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-10 text-sm bg-tertiary border border-border hover:border-primary/50 focus:border-primary rounded-[2px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-0.5"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-tertiary border border-border rounded-[2px] shadow-lg z-50 overflow-hidden divide-y divide-border/60 max-h-[320px] overflow-y-auto">
          {filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <Link
                key={item.path}
                href={localizedPath(item.path, locale)}
                onClick={() => setIsOpen(false)}
                className="p-3 flex items-center justify-between gap-3 hover:bg-primary/5 transition-colors group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-[2px] bg-background border border-border text-muted-foreground">
                      {item.category}
                    </span>
                  </div>
                  {item.desc && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {item.desc}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-muted-foreground">
              {locale === "es"
                ? "No se encontraron herramientas."
                : locale === "en"
                  ? "No tools found."
                  : "Nenhuma ferramenta encontrada."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
