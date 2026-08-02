import { ImageResponse } from 'next/og'
import { isTriviaQuiz } from '@/lib/quizTypes'
import { getQuizBySlug } from '@/lib/content/quizRepository'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function QuizResultOgImage({ params }: { params: Promise<{ slug: string; resultId: string }> }) {
  const { slug, resultId } = await params
  const quiz = await getQuizBySlug(slug, 'en')

  let title = 'Quiz Result'
  const quizTitle = quiz?.title ?? 'Personality Quiz'

  if (quiz) {
    if (isTriviaQuiz(quiz)) {
      const tier = quiz.tiers.find((t) => t.id === resultId)
      if (tier) title = tier.label
    } else {
      const result = quiz.results.find((r) => r.id === resultId)
      if (result) title = result.title
    }
  }

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
