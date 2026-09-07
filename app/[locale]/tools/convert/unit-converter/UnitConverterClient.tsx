"use client";
import { useState } from "react";
import { UnitCategory } from "@/lib/unitTypes";
import AppCategoryTabs from "@/components/converter/AppCategoryTabs";
import AppConversionWidget from "@/components/converter/AppConversionWidget";

export default function UnitConverterClient() {
  const [category, setCategory] = useState<UnitCategory>("length");

  return (
    <div>
      <AppCategoryTabs activeCategory={category} onSelect={setCategory} />
      <AppConversionWidget key={category} category={category} />
    </div>
  );
}
