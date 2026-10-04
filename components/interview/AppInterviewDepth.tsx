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
    <section className="w-full mt-10 sm:mt-16 pt-8 sm:pt-12 border-t-dashed-5">
      <div className="space-y-8 sm:space-y-10">
        {sections.map((s, i) => (
          <div key={`s${i}`} className="space-y-2 sm:space-y-3 max-w-3xl text-left">
            <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground">
              {s.heading}
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-label leading-relaxed">
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
            <div key={`l${i}`} className="space-y-2 sm:space-y-3 max-w-3xl text-left">
              <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground">
                {l.heading}
              </h2>
              {l.ordered ? (
                <ol className="list-decimal space-y-2 pl-5 text-xs sm:text-sm text-label leading-relaxed">
                  {items}
                </ol>
              ) : (
                <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm text-label leading-relaxed">
                  {items}
                </ul>
              )}
            </div>
          );
        })}

        <div className="space-y-3.5 sm:space-y-6 pt-2 sm:pt-4 max-w-3xl text-left">
          <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground">
            {faqHeading}
          </h2>

          <AppAccordion
            groups={faqs.map((faq, i) => ({
              id: `interview-depth-faq-${i}`,
              name: faq.question,
              content: (
                <p className="leading-relaxed text-xs sm:text-sm text-label">{faq.answer}</p>
              ),
              defaultOpen: i === 0,
            }))}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
