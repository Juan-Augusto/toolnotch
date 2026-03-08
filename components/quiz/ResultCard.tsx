'use client'
import { useEffect } from 'react'
import { QuizResult, Quiz } from '@/lib/quizTypes'
import confetti from 'canvas-confetti'

interface ResultCardProps {
  result: QuizResult
  quiz: Quiz
  onRetake: () => void
}

export default function ResultCard({ result, quiz, onRetake }: ResultCardProps) {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
  }, [])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = result.shareText

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
  }

  return (
    <div className="space-y-6 text-center">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
        <div className="text-sm text-gray-500 mb-2">Your result:</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{result.title}</h2>
        <p className="text-gray-600 text-sm leading-relaxed text-left max-w-prose mx-auto">
          {result.description}
        </p>
      </div>

      {result.traits.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {result.traits.map(trait => (
            <span key={trait} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {trait}
            </span>
          ))}
        </div>
      )}

      <div>
        <p className="text-sm text-gray-500 mb-2">Share your result:</p>
        <div className="flex justify-center gap-2 flex-wrap">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors"
          >
            Twitter / X
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            WhatsApp
          </a>
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Copy Link
          </button>
        </div>
      </div>

      <button
        onClick={onRetake}
        className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
      >
        Retake Quiz
      </button>

      <p className="text-xs text-gray-400">
        Quiz: {quiz.title} on ToolNotch.com
      </p>
    </div>
  )
}
