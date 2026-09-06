import type { FaqItem } from '@/lib/schema'

export interface InterviewDepthSection {
  heading: string
  body: string[]
}

export interface InterviewDepthList {
  heading: string
  ordered?: boolean
  items: string[]
}

interface Props {
  sections: InterviewDepthSection[]
  lists?: InterviewDepthList[]
  faqHeading: string
  faqs: FaqItem[]
}

/**
 * Server-rendered SEO depth block for the interview-prep pages. Plain prose,
 * optional ordered/unordered lists, and a topic FAQ rendered as native
 * <details> so the copy is present in raw HTML (no JS). No <h1> — the page /
 * quiz launcher above owns the page heading.
 */
export default function InterviewDepth({ sections, lists = [], faqHeading, faqs }: Props) {
  return (
    <section className="mx-auto max-w-[760px] px-5 pb-16 text-[color:var(--text-muted)]">
      {sections.map((s, i) => (
        <div key={`s${i}`} className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-[color:var(--text-primary)]">{s.heading}</h2>
          <div className="space-y-3">
            {s.body.map((p, j) => (
              <p key={j} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      ))}

      {lists.map((l, i) => {
        const items = l.items.map((it, j) => (
          <li key={j} className="leading-relaxed">
            {it}
          </li>
        ))
        return (
          <div key={`l${i}`} className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-[color:var(--text-primary)]">{l.heading}</h2>
            {l.ordered ? (
              <ol className="list-decimal space-y-2 pl-5">{items}</ol>
            ) : (
              <ul className="list-disc space-y-2 pl-5">{items}</ul>
            )}
          </div>
        )
      })}

      <div>
        <h2 className="mb-3 text-xl font-bold text-[color:var(--text-primary)]">{faqHeading}</h2>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="rounded-xl border border-[color:var(--base-border)] bg-[color:var(--base-surface)] px-5 py-3.5"
            >
              <summary className="cursor-pointer list-none font-medium text-[color:var(--text-primary)]">
                {f.question}
              </summary>
              <p className="mt-2 leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
