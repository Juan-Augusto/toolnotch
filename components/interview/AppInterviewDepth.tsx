import React from "react";
import type { FaqItem } from "@/lib/schema";
import AppAccordion from "@/components/ui/AppAccordion";

export interface InterviewDepthSection {
  heading: string;
  body: string[];
}

export interface InterviewDepthList {
  heading: string;
  ordered?: boolean;
  items: string[];
}

interface Props {
  sections: InterviewDepthSection[];
  lists?: InterviewDepthList[];
  faqHeading: string;
  faqs: FaqItem[];
}

export default function AppInterviewDepth({
  sections,
  lists = [],
  faqHeading,
  faqs,
}: Props) {
  return (
    <section className="w-full pt-10 pb-16 space-y-12 border-t-dashed-5">
      {sections.map((s, i) => (
        <div key={`s${i}`} className="space-y-3">
          <h2 className="font-mono text-lg sm:text-xl font-bold uppercase  text-foreground">
            {s.heading}
          </h2>
          <div className="space-y-3 text-sm text-label leading-relaxed">
            {s.body.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
        </div>
      ))}

      {lists.map((l, i) => {
        const items = l.items.map((it, j) => (
          <li key={j} className="leading-relaxed">
            {it}
          </li>
        ));
        return (
          <div key={`l${i}`} className="space-y-3">
            <h2 className="font-mono text-lg sm:text-xl font-bold uppercase  text-foreground">
              {l.heading}
            </h2>
            {l.ordered ? (
              <ol className="list-decimal space-y-2 pl-5 text-sm text-label leading-relaxed">
                {items}
              </ol>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-sm text-label leading-relaxed">
                {items}
              </ul>
            )}
          </div>
        );
      })}

      <div className="space-y-4">
        <h2 className="font-mono text-lg sm:text-xl font-bold uppercase  text-foreground">
          {faqHeading}
        </h2>

        <AppAccordion
          groups={faqs.map((faq, i) => ({
            id: `interview-depth-faq-${i}`,
            name: faq.question,
            content: (
              <p className=" leading-relaxed text-label">{faq.answer}</p>
            ),
            defaultOpen: i === 0,
          }))}
          className="w-full"
        />
      </div>
    </section>
  );
}
