'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import AppButton from '@/components/AppButton'
import AppDropZone from '@/components/image/AppDropZone'
import AppFormatSelector from '@/components/image/AppFormatSelector'
import AppComparisonView from '@/components/image/AppComparisonView'
import AppDownloadButton from '@/components/image/AppDownloadButton'
import AppToolWrapper from '@/components/AppToolWrapper'
import { compressImage } from '@/lib/imageConversion'
import type { SupportedFormat, ConversionResult } from '@/lib/imageTypes'
import type { FaqItem } from '@/components/AppFaqSection'

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
    <AppToolWrapper
      title={title}
      description={description}
      breadcrumbLabel={title}
      faqs={faqs}
      richContent={richContent}
    >
      <div className="space-y-4">
        <AppDropZone onFile={handleFile} currentFile={file} />

        <AppFormatSelector
          format={format}
          quality={quality}
          maxWidth={maxWidth}
          onFormatChange={setFormat}
          onQualityChange={setQuality}
          onMaxWidthChange={setMaxWidth}
        />

        <AppButton onClick={handleCompress} disabled={!file || isProcessing}>
          {isProcessing ? t('button.compressing') : t('button.compress')}
        </AppButton>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {result && file && (
          <>
            <AppComparisonView original={file} result={result} />
            <AppDownloadButton blob={result.blob} originalName={file.name} format={format} />
          </>
        )}
      </div>
    </AppToolWrapper>
  )
}
