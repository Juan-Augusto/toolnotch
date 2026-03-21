'use client'

import { useTranslations } from 'next-intl'
import type { SupportedFormat } from '@/lib/imageTypes'

interface Props {
  format: SupportedFormat
  quality: number
  maxWidth: number | undefined
  onFormatChange: (f: SupportedFormat) => void
  onQualityChange: (q: number) => void
  onMaxWidthChange: (w: number | undefined) => void
}

const FORMATS: { value: SupportedFormat; label: string }[] = [
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
  { value: 'avif', label: 'AVIF' },
]

export default function FormatSelector({
  format,
  quality,
  maxWidth,
  onFormatChange,
  onQualityChange,
  onMaxWidthChange,
}: Props) {
  const t = useTranslations('image.shared')

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-5 dark:bg-gray-800 dark:border-zinc-700">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('format.label')}</label>
        <div className="flex gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              onClick={() => onFormatChange(f.value)}
              className={`flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-colors ${
                format === f.value
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-zinc-300 text-zinc-700 hover:border-zinc-400 bg-white dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-zinc-500 dark:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('quality.label')}: <span className="text-blue-600 dark:text-blue-400">{quality}%</span>
        </label>
        <input
          type="range"
          min={1}
          max={100}
          value={quality}
          onChange={(e) => onQualityChange(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          <span>{t('quality.smaller')}</span>
          <span>{t('quality.better')}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('maxWidth.label')} <span className="text-zinc-400 dark:text-zinc-500 font-normal">({t('maxWidth.unit')})</span>
        </label>
        <input
          type="number"
          min={1}
          placeholder={t('maxWidth.placeholder')}
          value={maxWidth ?? ''}
          onChange={(e) =>
            onMaxWidthChange(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-full border border-zinc-300 dark:border-zinc-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  )
}
