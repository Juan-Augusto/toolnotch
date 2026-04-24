"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const t = useTranslations("faqSection");

  return (
    <section className="mt-14 max-w-2xl mx-auto">
      <h2
        className="text-xl font-bold mb-6 section-heading"
        style={{ letterSpacing: "-0.02em" }}
      >
        {t("heading")}
      </h2>

      <div className="space-y-2">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{
                background: "var(--base-surface)",
                border: `1px solid ${isOpen ? "var(--neon-border)" : "var(--base-border)"}`,
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: isOpen ? "var(--neon-glow-sm)" : "none",
                transition: "border-color 220ms, box-shadow 220ms",
              }}
            >
              <button
                className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-3 transition-colors duration-200"
                style={{
                  color: isOpen ? "var(--text-primary)" : "var(--text-secondary)",
                  background: isOpen ? "var(--neon-dim)" : "transparent",
                }}
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span
                  className="font-medium text-sm leading-snug"
                  style={{ color: isOpen ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  size={15}
                  className="shrink-0 transition-transform duration-300"
                  style={{
                    transform: isOpen ? "rotate(-180deg)" : "rotate(0deg)",
                    color: isOpen ? "var(--neon)" : "var(--text-muted)",
                  }}
                />
              </button>

              <div
                style={{
                  maxHeight: isOpen ? "24rem" : "0",
                  opacity: isOpen ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms",
                }}
              >
                <div
                  className="px-5 pb-4 pt-1 text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
