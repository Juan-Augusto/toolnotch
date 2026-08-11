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
        className="relative flex items-center w-full h-12 sm:h-14 rounded-full focus-within:shadow-lg focus-within:ring-2 focus-within:ring-neon bg-card border border-bd-base overflow-hidden transition-all"
        onSubmit={handleSubmit}
      >
        <div className="grid place-items-center h-full w-10 sm:w-14 text-gray-400 shrink-0">
          <Search size={18} className="sm:w-5 sm:h-5" />
        </div>

        <input
          className="peer h-full w-full outline-none text-sm sm:text-base bg-transparent pr-2 border-transparent! placeholder-gray-400 dark:placeholder-gray-500"
          type="text"
          id="search"
          placeholder={t("searchPlaceholder")}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />

        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 sm:p-2 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors mr-1 shrink-0"
            aria-label="Clear search"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        )}

        <div className="pr-1.5 sm:pr-2 h-full flex items-center shrink-0">
          <button
            type="submit"
            className="bg-neon cursor-pointer hover:bg-emerald-500 transition-colors text-white dark:text-black text-xs sm:text-sm font-semibold py-1.5 px-4 sm:py-2.5 sm:px-6 rounded-full shadow-sm"
          >
            {t("searchButton")}
          </button>
        </div>
      </form>
    </div>
  );
}
