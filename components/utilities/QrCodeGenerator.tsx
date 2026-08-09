'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import QRCode from 'qrcode'

type QrType = 'url' | 'text' | 'email' | 'phone' | 'wifi'
type WifiSecurity = 'WPA' | 'WEP' | 'none'

function buildQrString(type: QrType, data: Record<string, string>): string {
  switch (type) {
    case 'url':
      return data.url || ''
    case 'text':
      return data.text || ''
    case 'email': {
      if (!data.to) return ''
      let str = `mailto:${data.to}`
      const params: string[] = []
      if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`)
      if (data.body) params.push(`body=${encodeURIComponent(data.body)}`)
      if (params.length) str += `?${params.join('&')}`
      return str
    }
    case 'phone':
      return data.phone ? `tel:${data.phone}` : ''
    case 'wifi':
      if (!data.ssid) return ''
      return `WIFI:S:${data.ssid};T:${data.security || 'WPA'};P:${data.password || ''};;`
    default:
      return ''
  }
}

async function generateQrDataUrl(text: string, size: number): Promise<string> {
  if (!text) return ''
  const canvas = document.createElement('canvas')
  await QRCode.toCanvas(canvas, text, {
    width: size,
    errorCorrectionLevel: 'M',
    margin: 2,
  })
  return canvas.toDataURL('image/png')
}

async function generateSvgString(text: string): Promise<string> {
  return await QRCode.toString(text, { type: 'svg', errorCorrectionLevel: 'M' })
}

function downloadPng(dataUrl: string, size: number) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `toolnotch-qr-${size}px.png`
  a.click()
}

function downloadSvg(svgString: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'toolnotch-qr.svg'
  a.click()
  URL.revokeObjectURL(url)
}

export default function QrCodeGenerator() {
  const t = useTranslations('qrGenerator')

  const [activeType, setActiveType] = useState<QrType>('url')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [wifiSecurity, setWifiSecurity] = useState<WifiSecurity>('WPA')
  const [wifiHidden, setWifiHidden] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedSize, setSelectedSize] = useState<256 | 512 | 1024>(256)

  const [previewDataUrl, setPreviewDataUrl] = useState<string>('')
  const [svgString, setSvgString] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const qrTypes: { key: QrType; label: string }[] = [
    { key: 'url', label: t('typeUrl') },
    { key: 'text', label: t('typeText') },
    { key: 'email', label: t('typeEmail') },
    { key: 'phone', label: t('typePhone') },
    { key: 'wifi', label: t('typeWifi') },
  ]

  const generateQr = useCallback(async () => {
    const data = { ...formData, security: wifiSecurity }
    const qrString = buildQrString(activeType, data)
    if (!qrString) {
      setPreviewDataUrl('')
      setSvgString('')
      return
    }
    setIsGenerating(true)
    try {
      const [dataUrl, svg] = await Promise.all([
        generateQrDataUrl(qrString, 256),
        generateSvgString(qrString),
      ])
      setPreviewDataUrl(dataUrl)
      setSvgString(svg)
    } catch {
      setPreviewDataUrl('')
      setSvgString('')
    } finally {
      setIsGenerating(false)
    }
  }, [formData, activeType, wifiSecurity])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      generateQr()
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [generateQr])

  function handleField(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function handleTypeChange(type: QrType) {
    setActiveType(type)
    setFormData({})
  }

  async function handleDownloadPng() {
    const data = { ...formData, security: wifiSecurity }
    const qrString = buildQrString(activeType, data)
    if (!qrString) return
    const dataUrl = await generateQrDataUrl(qrString, selectedSize)
    downloadPng(dataUrl, selectedSize)
  }

  function handleDownloadSvg() {
    if (!svgString) return
    downloadSvg(svgString)
  }

  const inputClass =
    'w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-card dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
  const labelClass = 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Form */}
      <div className="space-y-5">
        {/* Type tabs */}
        <div className="flex flex-wrap gap-2">
          {qrTypes.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTypeChange(key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeType === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* URL */}
        {activeType === 'url' && (
          <div>
            <label className={labelClass}>{t('urlLabel')}</label>
            <input
              type="url"
              value={formData.url || ''}
              onChange={(e) => handleField('url', e.target.value)}
              placeholder={t('urlPlaceholder')}
              className={inputClass}
            />
          </div>
        )}

        {/* Text */}
        {activeType === 'text' && (
          <div>
            <label className={labelClass}>{t('textLabel')}</label>
            <textarea
              value={formData.text || ''}
              onChange={(e) => handleField('text', e.target.value)}
              placeholder={t('textPlaceholder')}
              rows={4}
              className={inputClass}
            />
          </div>
        )}

        {/* Email */}
        {activeType === 'email' && (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>{t('emailTo')}</label>
              <input
                type="email"
                value={formData.to || ''}
                onChange={(e) => handleField('to', e.target.value)}
                placeholder="user@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t('emailSubject')}</label>
              <input
                type="text"
                value={formData.subject || ''}
                onChange={(e) => handleField('subject', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t('emailBody')}</label>
              <textarea
                value={formData.body || ''}
                onChange={(e) => handleField('body', e.target.value)}
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* Phone */}
        {activeType === 'phone' && (
          <div>
            <label className={labelClass}>{t('phoneLabel')}</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleField('phone', e.target.value)}
              placeholder={t('phonePlaceholder')}
              className={inputClass}
            />
          </div>
        )}

        {/* WiFi */}
        {activeType === 'wifi' && (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>{t('wifiSsid')}</label>
              <input
                type="text"
                value={formData.ssid || ''}
                onChange={(e) => handleField('ssid', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t('wifiSecurity')}</label>
              <select
                value={wifiSecurity}
                onChange={(e) => setWifiSecurity(e.target.value as WifiSecurity)}
                className={inputClass}
              >
                <option value="WPA">{t('wifiWpa')}</option>
                <option value="WEP">{t('wifiWep')}</option>
                <option value="none">{t('wifiNone')}</option>
              </select>
            </div>
            {wifiSecurity !== 'none' && (
              <div>
                <label className={labelClass}>{t('wifiPassword')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => handleField('password', e.target.value)}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={wifiHidden}
                onChange={(e) => setWifiHidden(e.target.checked)}
                className="rounded"
              />
              Hidden network
            </label>
          </div>
        )}
      </div>

      {/* Right: Preview + Download */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('preview')}</p>
        <div className="flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-card dark:bg-neutral-900 p-6 min-h-[280px]">
          {isGenerating ? (
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : previewDataUrl ? (
            <img
              src={previewDataUrl}
              alt="QR Code Preview"
              className="w-[220px] h-[220px] object-contain"
            />
          ) : (
            <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center px-4">
              {t('emptyState')}
            </p>
          )}
        </div>

        {previewDataUrl && (
          <div className="space-y-3">
            {/* Size selector */}
            <div>
              <label className={labelClass}>{t('size')}</label>
              <div className="flex gap-2 flex-wrap">
                {([256, 512, 1024] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {t(`size${size}` as 'size256' | 'size512' | 'size1024')}
                  </button>
                ))}
              </div>
            </div>

            {/* Download buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleDownloadPng}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t('downloadPng')}
              </button>
              <button
                onClick={handleDownloadSvg}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t('downloadSvg')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
