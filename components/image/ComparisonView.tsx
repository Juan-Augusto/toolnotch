'use client'

import { useEffect, useState } from 'react'
import type { ConversionResult } from '@/lib/imageTypes'
import { formatBytes } from '@/lib/imageConversion'

interface Props {
  original: File
  result: ConversionResult
}

export default function ComparisonView({ original, result }: Props) {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(original)
    setOriginalUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [original])

  useEffect(() => {
    const url = URL.createObjectURL(result.blob)
    setCompressedUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [result.blob])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Original</p>
          {originalUrl && (
            <img
              src={originalUrl}
              alt="Original"
              className="w-full rounded-lg object-contain max-h-64 bg-zinc-100"
            />
          )}
          <p className="text-sm font-medium text-zinc-700">{formatBytes(result.originalSize)}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Compressed</p>
          {compressedUrl && (
            <img
              src={compressedUrl}
              alt="Compressed"
              className="w-full rounded-lg object-contain max-h-64 bg-zinc-100"
            />
          )}
          <p className="text-sm font-medium text-zinc-700">{formatBytes(result.compressedSize)}</p>
        </div>
      </div>

      <div
        className={`text-center py-3 rounded-lg font-semibold text-sm ${
          result.savings > 0
            ? 'bg-green-50 text-green-700 border border-green-100'
            : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
        }`}
      >
        {result.savings > 0
          ? `${result.savings}% smaller — saved ${formatBytes(result.originalSize - result.compressedSize)}`
          : 'File size unchanged or increased — try a lower quality or different format'}
      </div>
    </div>
  )
}
