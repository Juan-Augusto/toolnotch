"use client";
import { Tool } from "@/app/[locale]/page";

export default function CategoriesFilter({
  TOOLS,
  setSelectedCategories,
  selectedCategories,
}: {
  TOOLS: Tool[];
  setSelectedCategories: (indices: number[]) => void;
  selectedCategories: number[];
}) {
  const filterToolsByCategory = (index: number) => {
    if (selectedCategories.includes(index)) {
      setSelectedCategories(selectedCategories.filter((i) => i !== index));
    } else {
      setSelectedCategories([...selectedCategories, index]);
    }
  };
  return (
    <section className="relative z-10 flex overflow-x-auto flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 mb-6 min-w-full pb-2 px-2 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {TOOLS.map((tool) => {
        return (
          <button
            type="button"
            key={tool.index}
            className={`
                  shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 border
                  ${
                    selectedCategories.includes(tool.index)
                      ? `bg-blue-500 text-white border-blue-500`
                      : " border-bd-base bg-card text-tx-secondary  hover:text-tx-primary  hover:bg-surface dark:hover:bg-card/50"
                  }
                `}
            onClick={() => filterToolsByCategory(tool.index)}
          >
            {tool.category}
          </button>
        );
      })}
    </section>
  );
}
