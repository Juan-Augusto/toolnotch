'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import DropZone from '@/components/image/DropZone'
import FormatSelector from '@/components/image/FormatSelector'
import ComparisonView from '@/components/image/ComparisonView'
import DownloadButton from '@/components/image/DownloadButton'
import ToolWrapper from '@/components/ToolWrapper'
import { compressImage } from '@/lib/imageConversion'
import type { SupportedFormat, ConversionResult } from '@/lib/imageTypes'
import type { FaqItem } from '@/components/FaqSection'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface Props {
  defaultFormat?: SupportedFormat
  title: string
  description: string
  faqs: FaqItem[]
  richContent?: RichContent
}

export default function ImageCompressorClient({
  defaultFormat = 'jpg',
  title,
  description,
  faqs,
  richContent,
}: Props) {
  const t = useTranslations('image.compressor')
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<SupportedFormat>(defaultFormat)
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback((f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
  }, [])

  const handleCompress = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    try {
      const res = await compressImage({ file, format, quality, maxWidth })
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Compression failed. Please try another image.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ToolWrapper
      title={title}
      description={description}
      breadcrumbLabel={title}
      faqs={faqs}
      adSlot="1234567890"
      richContent={richContent}
    >
      <div className="space-y-4">
        <DropZone onFile={handleFile} currentFile={file} />

        <FormatSelector
          format={format}
          quality={quality}
          maxWidth={maxWidth}
          onFormatChange={setFormat}
          onQualityChange={setQuality}
          onMaxWidthChange={setMaxWidth}
        />

        <button
          onClick={handleCompress}
          disabled={!file || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors text-base"
        >
          {isProcessing ? t('button.compressing') : t('button.compress')}
        </button>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {result && file && (
          <>
            <ComparisonView original={file} result={result} />
            <DownloadButton blob={result.blob} originalName={file.name} format={format} />
          </>
        )}
      </div>
    </ToolWrapper>
  )
}
