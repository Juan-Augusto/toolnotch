"use client";
import Link from "next/link";
import { Tool } from "@/app/[locale]/page";
import CategoriesFilter from "./CategoriesFilter";
import ToolSearch from "./ToolSearch";
import { useState } from "react";
import { useTranslations } from "next-intl";

export const colorMap: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400",
  red: "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400",
  indigo:
    "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400",
  purple:
    "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400",
  green:
    "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400",
  orange:
    "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400",
  pink: "bg-pink-50 border-pink-200 text-pink-700 dark:bg-pink-900/30 dark:border-pink-800 dark:text-pink-400",
  violet:
    "bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-900/30 dark:border-violet-800 dark:text-violet-400",
};

export default function ToolsSection(props: {
  TOOLS: Tool[];
  freeLabel: string;
}) {
  const { TOOLS, freeLabel } = props;
  const t = useTranslations("home");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  let filteredTools =
    selectedCategories.length > 0
      ? TOOLS.filter((group) => selectedCategories.includes(group.index))
      : TOOLS;

  if (searchQuery.trim() !== "") {
    const lowerQuery = searchQuery.toLowerCase();
    filteredTools = filteredTools
      .map((group) => {
        const matchingItems = group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(lowerQuery) ||
            item.desc.toLowerCase().includes(lowerQuery),
        );
        return { ...group, items: matchingItems };
      })
      .filter((group) => group.items.length > 0);
  }

  const badgeMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    indigo:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    orange:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    pink: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    violet:
      "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  };

  return (
    <>
      <ToolSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoriesFilter
        TOOLS={TOOLS}
        setSelectedCategories={setSelectedCategories}
        selectedCategories={selectedCategories}
      />
      <div className="space-y-10">
        {filteredTools.map((group) => (
          <section key={group.category}>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colorMap[group.color]}`}
              >
                {group.category}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.items.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="block bg-card border border-bd-base rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all group dark:bg-card  dark:hover:border-gray-600"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${badgeMap[group.color]}`}
                    >
                      {freeLabel}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm dark:text-white dark:group-hover:text-blue-400">
                        {tool.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
        {filteredTools.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            {t("noResults")}
          </div>
        )}
      </div>
    </>
  );
}
