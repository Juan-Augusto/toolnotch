"use client";
import { useState } from "react";
import { UnitCategory } from "@/lib/unitTypes";
import CategoryTabs from "@/components/converter/CategoryTabs";
import ConversionWidget from "@/components/converter/ConversionWidget";

export default function UnitConverterClient() {
  const [category, setCategory] = useState<UnitCategory>("length");

  return (
    <div>
      <CategoryTabs activeCategory={category} onSelect={setCategory} />
      <ConversionWidget key={category} category={category} />
    </div>
  );
}
