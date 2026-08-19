'use client'
import { useTranslations } from 'next-intl'
import { TextStats, getFleschLabel, getFleschColor } from '@/lib/textTypes'

interface ReadabilityPanelProps {
  stats: TextStats
}

export default function ReadabilityPanel({ stats }: ReadabilityPanelProps) {
  const t = useTranslations('text.stats')
  const label = getFleschLabel(stats.fleschEase)
  const color = getFleschColor(stats.fleschEase)

  const getFleschTranslation = (labelStr: string) => {
    const key = labelStr.replace(/\s+(.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (_, c) => c.toLowerCase());
    return t(`fleschLabels.${key}`);
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('readabilityScores')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">{t('fleschEase')}</div>
          <div className={`text-2xl font-bold ${color}`}>{stats.fleschEase}</div>
          <div className={`text-sm font-medium mt-1 ${color}`}>{getFleschTranslation(label)}</div>
          <div className="text-xs text-gray-400 mt-1">{t('higherEasier')}</div>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">{t('fleschGrade')}</div>
          <div className="text-2xl font-bold text-gray-800">{stats.fleschGrade}</div>
          <div className="text-sm text-gray-500 mt-1">{t('gradeLevel')}</div>
          <div className="text-xs text-gray-400 mt-1">{t('gradeEquivalent')}</div>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">{t('gunningFog')}</div>
          <div className="text-2xl font-bold text-gray-800">{stats.gunningFog}</div>
          <div className="text-sm text-gray-500 mt-1">{t('yearsEducation')}</div>
          <div className="text-xs text-gray-400 mt-1">{t('lowerAccessible')}</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-400">
        {t('syllableNote')}
      </div>
    </div>
  )
}
