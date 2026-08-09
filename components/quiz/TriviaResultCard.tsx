'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import confetti from 'canvas-confetti'
import { TriviaQuiz } from '@/lib/quizTypes'
import { TriviaResult } from '@/lib/triviaEngine'

interface TriviaResultCardProps {
  result: TriviaResult
  quiz: TriviaQuiz
  onRetake: () => void
}

const tierColors: Record<string, string> = {
  legend: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  expert: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  fan: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rookie: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

export default function TriviaResultCard({ result, quiz, onRetake }: TriviaResultCardProps) {
  const t = useTranslations('quiz')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const key = `confetti_shown_${quiz.id}_${result.tier.id}`
    if (!reduced && !sessionStorage.getItem(key)) {
      confetti({
        particleCount: 160,
        spread: 90,
        startVelocity: 45,
        origin: { y: 0.55 },
        colors: ['#a855f7', '#ec4899', '#6366f1', '#06b6d4', '#f59e0b'],
      })
      sessionStorage.setItem(key, '1')
    }
  }, [quiz.id, result.tier.id])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = result.tier.shareText

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
  }

  const tierColorClass = tierColors[result.tier.id] ?? tierColors.rookie
  const tierLabel = t(`trivia.tiers.${result.tier.id}` as Parameters<typeof t>[0])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6 text-center"
    >
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 space-y-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">{t('trivia.yourScore')}</div>

        <motion.div
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="space-y-1"
        >
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {t('trivia.outOf', { score: result.score, total: result.total })}
          </div>
          <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            {t('trivia.percentage', { percent: result.percent })}
          </div>
        </motion.div>

        <div className="flex justify-center pt-2">
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${tierColorClass}`}>
            {tierLabel}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-prose mx-auto">
          {result.tier.description}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('share')}:</p>
        <div className="flex justify-center gap-2 flex-wrap">
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
            className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Copy Link
          </button>
        </div>
      </div>

      <button
        onClick={onRetake}
        className="px-8 py-3 border-2 border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-card rounded-xl font-semibold hover:bg-gray-50 transition-colors"
      >
        {t('restart')}
      </button>

      <p className="text-xs text-gray-400 dark:text-gray-500">
        Quiz: {quiz.title} on ToolNotch.com
      </p>
    </motion.div>
  )
}
