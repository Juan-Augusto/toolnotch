"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return;
    }
    orig.apply(console, args);
  };
}

export default function NotFoundPage() {
  const t = useTranslations("common");

  return (
    <main
      className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div className="relative max-w-md w-full text-center space-y-8 animate-fade-in-up">
        <div className="select-none pointer-events-none">
          <h1 className="text-[100px] sm:text-[140px] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neon to-emerald-600 leading-none drop-shadow-sm">
            404
          </h1>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">
            {t("notFoundTitle")}
          </h2>
          <p className="text-sm leading-relaxed max-w-xs mx-auto">
            {t("notFoundDescription")}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-neon hover:bg-emerald-500 active:scale-95 transition-all text-white dark:text-black text-sm font-semibold py-3 px-8 rounded-full cursor-pointer"
          >
            <Home size={16} />
            <span>{t("backToHome")}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
