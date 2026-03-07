'use client'

import { useCallback } from 'react'
import type { SupportedFormat } from '@/lib/imageTypes'

interface Props {
  blob: Blob
  originalName: string
  format: SupportedFormat
}

export default function DownloadButton({ blob, originalName, format }: Props) {
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
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
    >
      Download Compressed Image
    </button>
  )
}
