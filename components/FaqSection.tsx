"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const t = useTranslations("faqSection");

  return (
    <section className="mt-12 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{t("heading")}</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-xl dark:border-gray-700 overflow-hidden transition-shadow duration-200 hover:shadow-sm">
            <button
              className="w-full text-left px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800 flex justify-between items-center transition-colors duration-200"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{faq.question}</span>
              {open === i ? (
                <ChevronUp size={16} className="text-gray-400 dark:text-gray-500 shrink-0 ml-2" />
              ) : (
                <ChevronDown size={16} className="text-gray-400 dark:text-gray-500 shrink-0 ml-2" />
              )}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-4 pb-3 text-gray-600 text-sm leading-relaxed dark:text-gray-400">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
