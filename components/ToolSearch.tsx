"use client";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface ToolSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function ToolSearch({
  searchQuery,
  setSearchQuery,
}: ToolSearchProps) {
  const t = useTranslations("home");
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <div className="relative mt-8 mb-12 max-w-xl mx-auto w-full px-4 sm:px-0">
      <form
        className="relative flex items-center w-full h-12 sm:h-14 rounded-full focus-within:shadow-lg focus-within:ring-2 focus-within:ring-neon bg-card border border-bd-base hover:border-gray-300 dark:hover:border-gray-600 overflow-hidden transition-all"
        onSubmit={handleSubmit}
      >
        <input
          className="w-full h-full outline-none text-sm sm:text-base border-transparent! placeholder-tx-secondary dark:placeholder-gray-500 pl-10 sm:pl-14 pr-24 sm:pr-36 bg-card!"
          type="text"
          id="search"
          placeholder={t("searchPlaceholder")}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />

        <div className="absolute left-0 top-0 bottom-0 grid place-items-center w-10 sm:w-14 text-tx-secondary pointer-events-none">
          <Search size={18} className="sm:w-5 sm:h-5" />
        </div>

        <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1 sm:gap-2 pr-1.5 sm:pr-2">
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 sm:p-2 text-tx-secondary cursor-pointer hover:text-tx-primary transition-colors shrink-0"
              aria-label="Clear search"
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          )}

          <button
            type="submit"
            className="bg-neon cursor-pointer hover:bg-emerald-500 transition-colors text-white dark:text-black text-xs sm:text-sm font-semibold py-1.5 px-4 sm:py-2.5 sm:px-6 rounded-full shadow-sm shrink-0"
          >
            {t("searchButton")}
          </button>
        </div>
      </form>
    </div>
  );
}
