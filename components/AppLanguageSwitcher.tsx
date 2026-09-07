"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";

const LANGS = [
  { code: "en", label: "English", short: "EN-US" },
  { code: "pt", label: "Português", short: "PT-BR" },
  { code: "es", label: "Español", short: "ES-ES" },
];

const ALL_LOCALE_PREFIXES = ["en", "pt", "es"];

function buildLocalePath(pathname: string, to: string): string {
  const segment = pathname.split("/")[1];
  const clean = ALL_LOCALE_PREFIXES.includes(segment)
    ? pathname.replace(`/${segment}`, "") || "/"
    : pathname;
  return to !== "en" ? `/${to}${clean}` : clean;
}

export default function AppLanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function switchTo(code: string) {
    setOpen(false);
    if (code === locale) return;
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`;
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = buildLocalePath(pathname, code);
  }

  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-label hover:text-foreground text-xs font-medium tracking-widest uppercase transition-colors"
      >
        {current.short}
        <Globe size={15} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-tertiary border border-border rounded-xl shadow-xl overflow-hidden min-w-[130px] z-50">
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchTo(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700
                ${
                  lang.code === locale
                    ? "font-semibold text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
