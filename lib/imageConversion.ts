import type { ImageJob, ConversionResult, SupportedFormat } from './imageTypes'

export async function convertFormat(
  file: File,
  format: SupportedFormat,
  quality: number,
  maxWidth?: number,
  maxHeight?: number,
): Promise<Blob> {
  const img = new Image()
  const objectUrl = URL.createObjectURL(file)
  try {
    img.src = objectUrl
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load image'))
    })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }

  let { width, height } = img
  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width)
    width = maxWidth
  }
  if (maxHeight && height > maxHeight) {
    width = Math.round((width * maxHeight) / height)
    height = maxHeight
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context not available')
  ctx.drawImage(img, 0, 0, width, height)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error(`Failed to encode image as ${format}`))
      },
      `image/${format}`,
      quality / 100,
    )
  })
}

export async function compressImage(job: ImageJob): Promise<ConversionResult> {
  const { file, format, quality, maxWidth, maxHeight } = job
  const originalSize = file.size

  let resultBlob: Blob
  try {
    resultBlob = await convertFormat(file, format, quality, maxWidth, maxHeight)
  } catch (err) {
    throw new Error(
      `Compression failed: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  const compressedSize = resultBlob.size
  const savings = Math.round(((originalSize - compressedSize) / originalSize) * 100)

  return { blob: resultBlob, originalSize, compressedSize, savings }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
