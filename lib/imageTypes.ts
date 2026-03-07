export type SupportedFormat = 'jpg' | 'png' | 'webp' | 'avif'

export interface ImageJob {
  file: File
  format: SupportedFormat
  quality: number // 1–100
  maxWidth?: number
  maxHeight?: number
}

export interface ConversionResult {
  blob: Blob
  originalSize: number
  compressedSize: number
  savings: number // percentage saved (can be negative if output is larger)
}
