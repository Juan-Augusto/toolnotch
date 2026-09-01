"use client";
import { useTranslations } from "next-intl";
import { UnitCategory } from "@/lib/unitTypes";

const CATEGORIES: UnitCategory[] = [
  "length",
  "weight",
  "temperature",
  "area",
  "volume",
  "speed",
  "time",
  "digital-storage",
  "pressure",
];

interface CategoryTabsProps {
  activeCategory: UnitCategory;
  onSelect: (cat: UnitCategory) => void;
}

export default function CategoryTabs({
  activeCategory,
  onSelect,
}: CategoryTabsProps) {
  const t = useTranslations("convert.categories");

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 border ${
            activeCategory === cat
              ? "bg-blue-500 text-white border-blue-500"
              : "border-bd-base bg-card  hover:bg-surface dark:hover:bg-card/50"
          }`}
        >
          {t(cat)}
        </button>
      ))}
    </div>
  );
}
