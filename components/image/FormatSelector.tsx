'use client'

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
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Output Format</label>
        <div className="flex gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              onClick={() => onFormatChange(f.value)}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                format === f.value
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-zinc-300 text-zinc-700 hover:border-zinc-400 bg-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Quality: <span className="text-blue-600">{quality}%</span>
        </label>
        <input
          type="range"
          min={1}
          max={100}
          value={quality}
          onChange={(e) => onQualityChange(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-zinc-400 mt-1">
          <span>Smaller file</span>
          <span>Better quality</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Max Width <span className="text-zinc-400 font-normal">(px, optional)</span>
        </label>
        <input
          type="number"
          min={1}
          placeholder="Keep original size"
          value={maxWidth ?? ''}
          onChange={(e) =>
            onMaxWidthChange(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}
