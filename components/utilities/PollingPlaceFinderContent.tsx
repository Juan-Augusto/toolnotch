import PollingPlaceOutboundLink from './PollingPlaceOutboundLink'
import { TSE_POLLING_PLACE_LOOKUP_URL } from '@/lib/electionLinks'

interface TextSection {
  heading: string
  body: string[]
}

interface HowToStep {
  title: string
  body: string
}

interface HowToSection {
  heading: string
  intro: string
  steps: HowToStep[]
}

interface WhatToBringSection extends TextSection {
  documentList: string[]
}

interface Cta {
  label: string
  sublabel: string
}

export interface PollingPlaceFinderContentProps {
  intro: string
  sections: {
    whatIsPollingPlace: TextSection
    howToCheck: HowToSection
    lostTitle: TextSection
    movedCity: TextSection
    whatToBring: WhatToBringSection
  }
  cta: Cta
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="leading-relaxed mb-4 last:mb-0">
          {p}
        </p>
      ))}
    </>
  )
}

export default function PollingPlaceFinderContent({
  intro,
  sections,
  cta,
}: PollingPlaceFinderContentProps) {
  return (
    <div
      className="space-y-10"
      style={{ color: 'var(--text-secondary)' }}
    >
      <p className="leading-relaxed text-base" style={{ color: 'var(--text-primary)' }}>
        {intro}
      </p>

      <section>
        <h2 className="text-xl font-bold mb-3 section-heading">
          {sections.whatIsPollingPlace.heading}
        </h2>
        <Prose paragraphs={sections.whatIsPollingPlace.body} />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3 section-heading">
          {sections.howToCheck.heading}
        </h2>
        <p className="leading-relaxed mb-5">{sections.howToCheck.intro}</p>

        <div className="space-y-5">
          {sections.howToCheck.steps.map((step, i) => (
            <div key={i} className="card-neon p-4 sm:p-5">
              <h3
                className="text-sm font-bold mb-1.5 flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <span
                  className="inline-flex items-center justify-center rounded-full text-xs shrink-0"
                  style={{
                    width: '1.4rem',
                    height: '1.4rem',
                    background: 'var(--neon-dim)',
                    color: 'var(--neon)',
                    border: '1px solid var(--neon-border)',
                  }}
                >
                  {i + 1}
                </span>
                {step.title}
              </h3>
              <p className="leading-relaxed text-sm pl-[1.9rem]">{step.body}</p>
            </div>
          ))}
        </div>

        {/* Outbound CTA — primary conversion point for this page */}
        <div className="card-neon p-5 sm:p-6 mt-6 text-center">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            {cta.sublabel}
          </p>
          <PollingPlaceOutboundLink href={TSE_POLLING_PLACE_LOOKUP_URL} label={cta.label} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3 section-heading">
          {sections.lostTitle.heading}
        </h2>
        <Prose paragraphs={sections.lostTitle.body} />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3 section-heading">
          {sections.movedCity.heading}
        </h2>
        <Prose paragraphs={sections.movedCity.body} />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3 section-heading">
          {sections.whatToBring.heading}
        </h2>
        <Prose paragraphs={sections.whatToBring.body} />
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-sm">
          {sections.whatToBring.documentList.map((doc, i) => (
            <li key={i}>{doc}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
