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
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{t("heading")}</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 flex justify-between items-center"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{faq.question}</span>
              {open === i ? (
                <ChevronUp size={16} className="text-gray-400 shrink-0 ml-2" />
              ) : (
                <ChevronDown size={16} className="text-gray-400 shrink-0 ml-2" />
              )}
            </button>
            {open === i && (
              <div className="px-4 pb-3 text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
