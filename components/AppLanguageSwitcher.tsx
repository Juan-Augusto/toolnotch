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
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`;
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = buildLocalePath(pathname, code);
  }

  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-label hover:text-foreground text-xs font-medium uppercase transition-colors cursor-pointer select-none"
      >
        <span>{current.short}</span>
        <Globe size={15} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 mt-2 bg-tertiary border border-border rounded-[2px] shadow-lg p-1.5 min-w-[160px] z-50 flex flex-col gap-0.5"
        >
          {LANGS.map((lang) => {
            const isSelected = lang.code === locale;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => switchTo(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-[2px] transition-colors cursor-pointer text-left select-none ${
                  isSelected
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-label hover:text-foreground hover:bg-background"
                }`}
              >
                <span>{lang.label}</span>
                <span className="text-xs uppercase font-mono tracking-wider opacity-60">
                  {lang.short}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
