import type { ImageJob, ConversionResult, SupportedFormat } from './imageTypes'

export async function renderToCanvas(
  file: File,
  maxWidth?: number,
  maxHeight?: number,
): Promise<HTMLCanvasElement> {
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

  return canvas
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: SupportedFormat,
  quality: number,
): Promise<Blob> {
  const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error(`Failed to encode image as ${format}`))
      },
      mimeType,
      quality / 100,
    )
  })
}

export async function convertFormat(
  file: File,
  format: SupportedFormat,
  quality: number,
  maxWidth?: number,
  maxHeight?: number,
): Promise<Blob> {
  const canvas = await renderToCanvas(file, maxWidth, maxHeight)
  return canvasToBlob(canvas, format, quality)
}

function isFormatMatching(file: File, format: SupportedFormat): boolean {
  const mime = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  if (format === 'jpg') {
    return (
      mime === 'image/jpeg' ||
      mime === 'image/jpg' ||
      /\.(jpe?g)$/i.test(name)
    )
  }
  if (format === 'png') {
    return mime === 'image/png' || /\.png$/i.test(name)
  }
  if (format === 'webp') {
    return mime === 'image/webp' || /\.webp$/i.test(name)
  }
  if (format === 'avif') {
    return mime === 'image/avif' || /\.avif$/i.test(name)
  }
  return false
}

export async function compressImage(job: ImageJob): Promise<ConversionResult> {
  const {
    file,
    format,
    quality,
    maxWidth,
    maxHeight,
    adaptiveQuality = true,
  } = job
  const originalSize = file.size

  let canvas: HTMLCanvasElement
  try {
    canvas = await renderToCanvas(file, maxWidth, maxHeight)
  } catch (err) {
    throw new Error(
      `Compression failed: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  const effectiveQuality = format === 'png' ? 100 : quality
  let resultBlob: Blob
  try {
    resultBlob = await canvasToBlob(canvas, format, effectiveQuality)
  } catch (err) {
    throw new Error(
      `Compression failed: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  let adaptedQuality: number | undefined

  // Se a codificação inicial resultou em arquivo maior ou igual ao original,
  // e o formato suporta perda de compressão, tentamos passos menores de qualidade
  if (adaptiveQuality && format !== 'png' && resultBlob.size >= originalSize) {
    const stepDowns = [
      quality - 5,
      quality - 10,
      quality - 15,
      quality - 20,
      70,
      60,
      50,
      40,
    ]
      .filter((q) => q < quality && q >= 35)
      .filter((q, idx, arr) => arr.indexOf(q) === idx)
      .sort((a, b) => b - a)

    for (const q of stepDowns) {
      try {
        const candidate = await canvasToBlob(canvas, format, q)
        if (candidate.size < originalSize) {
          resultBlob = candidate
          adaptedQuality = q
          break
        }
        if (candidate.size < resultBlob.size) {
          resultBlob = candidate
          adaptedQuality = q
        }
      } catch {
        // Ignora erro em tentativa individual
      }
    }
  }

  // Se mesmo assim o tamanho for >= originalSize e o formato/resolução não mudaram,
  // o arquivo original já estava melhor otimizado que o encoder nativo: preserva o original.
  const isMatching = isFormatMatching(file, format)
  const isResized =
    Boolean(maxWidth && maxWidth > 0) || Boolean(maxHeight && maxHeight > 0)

  if (
    adaptiveQuality &&
    isMatching &&
    !isResized &&
    resultBlob.size >= originalSize
  ) {
    resultBlob = file
    adaptedQuality = undefined
  }

  const compressedSize = resultBlob.size
  const savings =
    originalSize > 0
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0

  return { blob: resultBlob, originalSize, compressedSize, savings, adaptedQuality }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

