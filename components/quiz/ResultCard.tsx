'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { QuizResult, Quiz } from '@/lib/quizTypes'
import confetti from 'canvas-confetti'

interface ResultCardProps {
  result: QuizResult
  quiz: Quiz
  onRetake: () => void
}

export default function ResultCard({ result, quiz, onRetake }: ResultCardProps) {
  const t = useTranslations('quiz')
  useEffect(() => {
    // Respect prefers-reduced-motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    // Only fire once per unique result (not on every navigation/mount)
    const sessionKey = `confetti_shown_${quiz.id}_${result.id}`
    if (sessionStorage.getItem(sessionKey)) return
    sessionStorage.setItem(sessionKey, '1')

    confetti({
      particleCount: 160,
      spread: 90,
      startVelocity: 45,
      origin: { y: 0.55 },
      colors: ['#a855f7', '#ec4899', '#6366f1', '#06b6d4', '#f59e0b'],
    })
  }, [quiz.id, result.id])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = result.shareText

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6 text-center"
    >
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8">
        <div className="text-sm text-gray-500 mb-2">{t('results')}:</div>
        <motion.h2
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          {result.title}
        </motion.h2>
        <p className="text-gray-600 text-sm leading-relaxed text-left max-w-prose mx-auto">
          {result.description}
        </p>
      </div>

      {result.traits.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
          className="flex flex-wrap justify-center gap-2"
        >
          {result.traits.map(trait => (
            <motion.span
              key={trait}
              variants={{ hidden: { opacity: 0, scale: 0.7 }, visible: { opacity: 1, scale: 1 } }}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
            >
              {trait}
            </motion.span>
          ))}
        </motion.div>
      )}

      <div>
        <p className="text-sm text-gray-500 mb-2">{t('share')}:</p>
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
        {t('restart')}
      </button>

      <p className="text-xs text-gray-400">
        Quiz: {quiz.title} on ToolNotch.com
      </p>
    </motion.div>
  )
}
