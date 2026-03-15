'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import type { ConversionResult } from '@/lib/imageTypes'
import { formatBytes } from '@/lib/imageConversion'

interface Props {
  original: File
  result: ConversionResult
}

export default function ComparisonView({ original, result }: Props) {
  const t = useTranslations('image.shared')
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null)
  const [sliderPct, setSliderPct] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const url = URL.createObjectURL(original)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOriginalUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [original])

  useEffect(() => {
    const url = URL.createObjectURL(result.blob)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompressedUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [result.blob])

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    setSliderPct(pct)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updateSlider(e.clientX)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    updateSlider(e.clientX)
  }

  const onPointerUp = () => setDragging(false)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setSliderPct(p => Math.max(0, p - 5))
    if (e.key === 'ArrowRight') setSliderPct(p => Math.min(100, p + 5))
  }

  return (
    <div className="space-y-3">
      {/* Slider comparison */}
      {originalUrl && compressedUrl && (
        <div
          ref={containerRef}
          className="relative rounded-xl overflow-hidden select-none cursor-col-resize bg-zinc-100"
          style={{ maxHeight: 300 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Compressed (bottom layer — full width) */}
          <img
            src={compressedUrl}
            alt={t('compare.compressed')}
            className="w-full object-contain block"
            style={{ maxHeight: 300, userSelect: 'none', pointerEvents: 'none' }}
            draggable={false}
          />

          {/* Original (top layer — clipped to left of slider) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}
          >
            <img
              src={originalUrl}
              alt={t('compare.original')}
              className="w-full object-contain block"
              style={{ maxHeight: 300, userSelect: 'none', pointerEvents: 'none' }}
              draggable={false}
            />
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
            style={{ left: `${sliderPct}%` }}
          />

          {/* Drag handle */}
          <div
            role="slider"
            aria-valuenow={Math.round(sliderPct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('compare.sliderAriaLabel')}
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center cursor-col-resize focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ left: `${sliderPct}%` }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3L2 7L5 11M9 3L12 7L9 11" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Labels */}
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded font-medium pointer-events-none">
            {t('compare.original')}
          </div>
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded font-medium pointer-events-none">
            {t('compare.compressed')}
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-zinc-50 rounded-lg px-3 py-2">
          <span className="text-zinc-400 text-xs uppercase tracking-wide block">{t('compare.original')}</span>
          <span className="font-semibold text-zinc-700">{formatBytes(result.originalSize)}</span>
        </div>
        <div className="bg-zinc-50 rounded-lg px-3 py-2">
          <span className="text-zinc-400 text-xs uppercase tracking-wide block">{t('compare.compressed')}</span>
          <span className="font-semibold text-zinc-700">{formatBytes(result.compressedSize)}</span>
        </div>
      </div>

      {/* Savings banner */}
      <div
        className={`text-center py-3 rounded-lg font-semibold text-sm ${
          result.savings > 0
            ? 'bg-green-50 text-green-700 border border-green-100'
            : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
        }`}
      >
        {result.savings > 0
          ? t('compare.savings', { pct: result.savings, bytes: formatBytes(result.originalSize - result.compressedSize) })
          : t('compare.noSavings')}
      </div>

      <p className="text-xs text-zinc-400 text-center">{t('compare.dragHint')}</p>
    </div>
  )
}
