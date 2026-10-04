'use client'
import { useTranslations } from 'next-intl'
import { TextStats, getFleschKey, getFleschColor } from '@/lib/textTypes'

interface ReadabilityPanelProps {
  stats: TextStats
  className?: string
}

export default function AppReadabilityPanel({ stats, className = '' }: ReadabilityPanelProps) {
  const t = useTranslations('text.stats')
  const fleschKey = getFleschKey(stats.fleschEase)
  const label = t(`fleschLabels.${fleschKey}`)
  const color = getFleschColor(stats.fleschEase)

  return (
    <div className={`bg-tertiary dark:bg-background border border-border rounded-[2px] overflow-hidden ${className}`}>
      {/* Header Integrado */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-background/50 dark:bg-foreground/[0.03] border-b border-border">
        <h3 className="font-mono font-medium uppercase tracking-wider text-foreground">
          {t('readabilityScores')}
        </h3>
        <span className="font-mono text-label">
          {t('syllableNote')}
        </span>
      </div>

      {/* Grid Consolidado com 3 Colunas Divididas */}
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {/* Flesch Ease */}
        <div className="p-4 sm:p-4.5 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-border">
          <div>
            <div className="text-xs font-mono font-medium uppercase tracking-wider text-foreground mb-1">{t('fleschEase')}</div>
            <div className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight ${color}`}>{stats.fleschEase}</div>
            <div className={`font-mono font-medium mt-1 ${color}`}>{label}</div>
          </div>
          <div className="font-mono text-label mt-3">{t('higherEasier')}</div>
        </div>

        {/* Flesch Grade */}
        <div className="p-4 sm:p-4.5 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-border">
          <div>
            <div className="text-xs font-mono font-medium uppercase tracking-wider text-foreground mb-1">{t('fleschGrade')}</div>
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-foreground">{stats.fleschGrade}</div>
            <div className="font-mono text-label mt-1">{t('gradeLevel')}</div>
          </div>
          <div className="font-mono text-label mt-3">{t('gradeEquivalent')}</div>
        </div>

        {/* Gunning Fog */}
        <div className="p-4 sm:p-4.5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-medium uppercase tracking-wider text-foreground mb-1">{t('gunningFog')}</div>
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-foreground">{stats.gunningFog}</div>
            <div className="font-mono text-label mt-1">{t('yearsEducation')}</div>
          </div>
          <div className="font-mono text-label mt-3">{t('lowerAccessible')}</div>
        </div>
      </div>
    </div>
  )
}
