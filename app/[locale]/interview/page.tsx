import type { Metadata } from 'next'
import Link from 'next/link'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, breadcrumbSchema } from '@/lib/schema'

const PATH = '/interview'
const DESCRIPTION =
  'Free interactive interview prep quizzes for software engineers. Deep-dive into TypeScript with in-depth questions covering type inference, generics, conditional types, and more — every answer includes compiled JS output and industry best practices.'

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Interview Prep', url: PATH },
  ]),
)

export const metadata: Metadata = {
  title: 'Interview Preparation — TypeScript & More | ToolNotch',
  description: DESCRIPTION,
  alternates: buildAlternates(PATH),
  keywords: [
    'software engineer interview prep',
    'TypeScript interview questions',
    'frontend interview quiz',
    'JavaScript interview preparation',
    'technical interview practice',
  ],
  openGraph: {
    title: 'Interview Prep Quizzes for Software Engineers | ToolNotch',
    description: DESCRIPTION,
  },
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function InterviewHubPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        .interview-card {
          display: block;
          background: #1a1d27;
          border: 1px solid #2a2d3e;
          border-radius: 12px;
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s, transform 0.15s;
        }
        .interview-card:hover {
          border-color: #3178c6;
          transform: translateY(-2px);
        }
      `}</style>
    <main style={{ background: '#0f1117', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#e8eaf0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 1.25rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <span style={{ color: '#3178c6', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Interview Preparation
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.75rem', color: '#e8eaf0' }}>
          Interview Prep Quizzes
        </h1>
        <p style={{ color: '#8b9cb8', fontSize: '1rem', lineHeight: 1.65, marginBottom: '2.5rem', maxWidth: 540 }}>
          Interactive quizzes designed for software engineers preparing for technical interviews.
          Every answer explains <em>why</em>, what the compiler produces, and what industry professionals do.
        </p>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          <Link
            href={`/${locale}/interview/typescript`}
            className="interview-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <svg width="36" height="36" viewBox="0 0 256 256" fill="none">
                <rect width="256" height="256" rx="16" fill="#3178c6" />
                <path d="M150 200v-27c4.5 2.3 9.8 4 15.8 5.1 6 1 11.7 1.5 17.2 1.5 3.5 0 6.8-.3 9.7-.8 2.9-.6 5.4-1.4 7.4-2.5 2-.9 3.6-2.2 4.7-3.7 1.1-1.5 1.6-3.3 1.6-5.3 0-2.6-.7-4.8-2.2-6.7-1.4-1.9-3.4-3.6-5.8-5.2-2.4-1.6-5.3-3-8.5-4.4-3.2-1.4-6.7-2.8-10.3-4.4-8.8-3.8-15.5-8.3-20-13.6-4.5-5.3-6.8-12-6.8-20 0-6.2 1.3-11.6 3.8-16.1 2.5-4.5 5.9-8.2 10.3-11.2 4.4-3 9.4-5.2 15-6.7 5.6-1.5 11.6-2.2 17.9-2.2 6 0 11.4.3 16.3 1 4.9.7 9.2 1.7 12.9 3.1v25.4c-2.2-1.3-4.6-2.5-7.1-3.4-2.5-.9-5.1-1.7-7.7-2.3-2.6-.6-5.3-1-7.9-1.3-2.6-.3-5-.4-7.2-.4-3.2 0-6.1.3-8.7.9-2.6.6-4.9 1.5-6.7 2.6-1.9 1.1-3.4 2.4-4.4 4-1 1.5-1.6 3.3-1.6 5.1 0 2.2.6 4.2 1.7 5.9 1.2 1.7 2.8 3.3 5 4.7 2.1 1.4 4.7 2.8 7.8 4.1 3 1.3 6.5 2.7 10.3 4.2 4.5 1.8 8.7 3.8 12.4 6 3.8 2.2 7 4.7 9.7 7.5 2.7 2.8 4.8 6.1 6.3 9.8 1.5 3.7 2.2 8 2.2 12.8 0 6.7-1.3 12.4-4 17-2.7 4.6-6.2 8.4-10.7 11.2-4.5 2.8-9.7 4.9-15.6 6.1-5.9 1.2-12.1 1.8-18.7 1.8-6.6 0-12.8-.5-18.6-1.5-5.9-1-10.8-2.5-14.8-4.6zM128 118H88v82H60v-82H20V94h108v24z" fill="white" />
              </svg>
              <div>
                <div style={{ color: '#e8eaf0', fontWeight: 700, fontSize: '1.05rem' }}>TypeScript</div>
                <div style={{ color: '#8b9cb8', fontSize: '0.78rem' }}>30 questions · 3 levels</div>
              </div>
            </div>
            <p style={{ color: '#8b9cb8', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
              Type inference, generics, conditional types, mapped types, and TS 5.x features.
              Covers compilation output and best practices.
            </p>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                <span key={l} style={{
                  background: '#0f1117',
                  color: '#8b9cb8',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  border: '1px solid #2a2d3e',
                }}>{l}</span>
              ))}
            </div>
          </Link>
        </div>

        <p style={{ color: '#3a3f55', fontSize: '0.78rem', marginTop: '3rem' }}>
          More topics coming soon: JavaScript, React, System Design
        </p>
      </div>
    </main>
    </>
  )
}
