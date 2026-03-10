import { ImageResponse } from 'next/og'
import { Quiz } from '@/lib/quizTypes'
import careerQuizRaw from '@/data/quizzes/what-career-suits-you.json'
import programmingQuizRaw from '@/data/quizzes/which-programming-language-are-you.json'
import introvertQuizRaw from '@/data/quizzes/am-i-introverted-or-extroverted.json'
import travelerQuizRaw from '@/data/quizzes/what-type-of-traveler-are-you.json'
import decadeQuizRaw from '@/data/quizzes/which-decade-do-you-belong-in.json'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ALL_QUIZZES = [careerQuizRaw, programmingQuizRaw, introvertQuizRaw, travelerQuizRaw, decadeQuizRaw] as any[] as Quiz[]

export default async function QuizResultOgImage({ params }: { params: Promise<{ slug: string; resultId: string }> }) {
  const { slug, resultId } = await params
  const quiz = ALL_QUIZZES.find(q => q.id === slug)
  const result = quiz?.results.find(r => r.id === resultId)

  const title = result?.title ?? 'Quiz Result'
  const quizTitle = quiz?.title ?? 'Personality Quiz'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '24px', marginBottom: '16px', textAlign: 'center' }}>
          {quizTitle}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '28px', marginBottom: '24px' }}>
          I got:
        </div>
        <div
          style={{
            color: '#ffffff',
            fontSize: '72px',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '48px',
          }}
        >
          {title}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '20px' }}>
          toolnotch.com
        </div>
      </div>
    ),
    { ...size }
  )
}
