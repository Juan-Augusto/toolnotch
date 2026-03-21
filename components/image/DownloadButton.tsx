'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import type { SupportedFormat } from '@/lib/imageTypes'

interface Props {
  blob: Blob
  originalName: string
  format: SupportedFormat
}

export default function DownloadButton({ blob, originalName, format }: Props) {
  const t = useTranslations('image.shared')

  const handleDownload = useCallback(() => {
    const baseName = originalName.replace(/\.[^.]+$/, '')
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${baseName}-compressed.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }, [blob, originalName, format])

  return (
    <button
      onClick={handleDownload}
      className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm"
    >
      {t('download.label')}
    </button>
  )
}
