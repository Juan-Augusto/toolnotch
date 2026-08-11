'use client'

import { useState, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'

interface Props {
  onFile: (file: File) => void
  currentFile: File | null
}

export default function DropZone({ onFile, currentFile }: Props) {
  const t = useTranslations('image.shared.dropZone')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        onFile(file)
      }
    },
    [onFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onFile(file)
    },
    [onFile],
  )

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors transition-transform duration-200 ${
        isDragging
          ? 'border-blue-500 bg-blue-50 scale-[1.01] dark:border-blue-400 dark:bg-blue-900/20'
          : 'border-zinc-300 hover:border-gray-400 bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:bg-card'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      {currentFile ? (
        <div className="space-y-1">
          <p className="font-medium text-zinc-800 dark:text-zinc-200">{currentFile.name}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {(currentFile.size / 1024).toFixed(1)} KB · {t('replace')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-4xl text-zinc-300 dark:text-zinc-600">↑</div>
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">{t('label')}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('hint')}</p>
        </div>
      )}
    </div>
  )
}
