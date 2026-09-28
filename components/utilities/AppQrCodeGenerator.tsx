'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import QRCode from 'qrcode'
import {
  Link as LinkIcon,
  FileText,
  Mail,
  Phone,
  Wifi,
  Globe,
  Eye,
  EyeOff,
  RotateCcw,
  Download,
  Copy,
  Check,
  QrCode,
} from 'lucide-react'
import AppButton from '@/components/ui/AppButton'
import {
  AppSegmentedControl,
  type SegmentOption,
} from '@/components/ui/form/AppSegmentedControl'
import { AppInput } from '@/components/ui/form/AppInput'
import { AppTextarea } from '@/components/ui/form/AppTextarea'
import { AppSelect, type SelectOption } from '@/components/ui/form/AppSelect'
import { AppCheckbox } from '@/components/ui/form/AppCheckbox'

export type QrType = 'url' | 'text' | 'email' | 'phone' | 'wifi'
export type WifiSecurity = 'WPA' | 'WEP' | 'none'
export type QrSize = 256 | 512 | 1024

export interface AppQrCodeGeneratorProps {
  locale?: string
}

export function buildQrString(
  type: QrType,
  data: Record<string, string>,
  wifiHidden = false
): string {
  switch (type) {
    case 'url':
      return data.url?.trim() || ''
    case 'text':
      return data.text?.trim() || ''
    case 'email': {
      if (!data.to?.trim()) return ''
      let str = `mailto:${data.to.trim()}`
      const params: string[] = []
      if (data.subject?.trim()) params.push(`subject=${encodeURIComponent(data.subject.trim())}`)
      if (data.body?.trim()) params.push(`body=${encodeURIComponent(data.body.trim())}`)
      if (params.length) str += `?${params.join('&')}`
      return str
    }
    case 'phone':
      return data.phone?.trim() ? `tel:${data.phone.trim()}` : ''
    case 'wifi':
      if (!data.ssid?.trim()) return ''
      return `WIFI:S:${data.ssid.trim()};T:${data.security || 'WPA'};P:${data.password || ''};${wifiHidden ? 'H:true;' : ''};`
    default:
      return ''
  }
}

export async function generateQrDataUrl(text: string, size: number): Promise<string> {
  if (!text) return ''
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  await QRCode.toCanvas(canvas, text, {
    width: size,
    errorCorrectionLevel: 'M',
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  })
  return canvas.toDataURL('image/png')
}

export async function generateSvgString(text: string): Promise<string> {
  if (!text) return ''
  return await QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  })
}

function downloadPng(dataUrl: string, size: number) {
  if (typeof document === 'undefined') return
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `toolnotch-qr-${size}px.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function downloadSvg(svgString: string) {
  if (typeof window === 'undefined') return
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'toolnotch-qr.svg'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function AppQrCodeGenerator({ locale: _locale }: AppQrCodeGeneratorProps) {
  const t = useTranslations('qrGenerator')

  const [activeType, setActiveType] = useState<QrType>('url')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [wifiSecurity, setWifiSecurity] = useState<WifiSecurity>('WPA')
  const [wifiHidden, setWifiHidden] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedSize, setSelectedSize] = useState<QrSize>(256)

  const [previewDataUrl, setPreviewDataUrl] = useState<string>('')
  const [svgString, setSvgString] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const typeOptions: SegmentOption<QrType>[] = [
    { value: 'url', label: t('typeUrl'), icon: <LinkIcon className="w-3.5 h-3.5 shrink-0" /> },
    { value: 'text', label: t('typeText'), icon: <FileText className="w-3.5 h-3.5 shrink-0" /> },
    { value: 'email', label: t('typeEmail'), icon: <Mail className="w-3.5 h-3.5 shrink-0" /> },
    { value: 'phone', label: t('typePhone'), icon: <Phone className="w-3.5 h-3.5 shrink-0" /> },
    { value: 'wifi', label: t('typeWifi'), icon: <Wifi className="w-3.5 h-3.5 shrink-0" /> },
  ]

  const sizeOptions: SegmentOption<QrSize>[] = [
    { value: 256, label: t('size256') },
    { value: 512, label: t('size512') },
    { value: 1024, label: t('size1024') },
  ]

  const securityOptions: SelectOption<WifiSecurity>[] = [
    { label: t('wifiWpa'), value: 'WPA' },
    { label: t('wifiWep'), value: 'WEP' },
    { label: t('wifiNone'), value: 'none' },
  ]

  const generateQr = useCallback(async () => {
    const data = { ...formData, security: wifiSecurity }
    const qrString = buildQrString(activeType, data, wifiHidden)
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
  }, [formData, activeType, wifiSecurity, wifiHidden])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      generateQr()
    }, 250)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [generateQr])

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  function handleField(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function handleTypeChange(type: QrType) {
    setActiveType(type)
    setFormData({})
  }

  function handleReset() {
    setFormData({})
    setWifiSecurity('WPA')
    setWifiHidden(false)
    setShowPassword(false)
    setPreviewDataUrl('')
    setSvgString('')
  }

  async function handleDownloadPng() {
    const data = { ...formData, security: wifiSecurity }
    const qrString = buildQrString(activeType, data, wifiHidden)
    if (!qrString) return
    const dataUrl = await generateQrDataUrl(qrString, selectedSize)
    downloadPng(dataUrl, selectedSize)
  }

  function handleDownloadSvg() {
    if (!svgString) return
    downloadSvg(svgString)
  }

  async function handleCopySvg() {
    if (!svgString) return
    try {
      await navigator.clipboard.writeText(svgString)
      setIsCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Input Form */}
      <div className="lg:col-span-7 space-y-5">
        {/* Type selection */}
        <div>
          <AppSegmentedControl<QrType>
            options={typeOptions}
            value={activeType}
            onChange={handleTypeChange}
            bordered
            fontWeight="medium"
            fullWidth
            size="sm"
          />
        </div>

        {/* Content Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-foreground">
              {t('contentSettings')}
            </h2>
            <AppButton
              type="button"
              color="tertiary"
              small
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              iconPosition="left"
              onClick={handleReset}
              className="text-xs"
            >
              {t('reset')}
            </AppButton>
          </div>

          {/* URL */}
          {activeType === 'url' && (
            <div>
              <AppInput
                label={t('urlLabel')}
                type="url"
                value={formData.url || ''}
                onChange={(e) => handleField('url', e.target.value)}
                placeholder={t('urlPlaceholder')}
                startAdornment={<Globe className="w-4 h-4 text-label" />}
                className="h-11 text-sm"
              />
            </div>
          )}

          {/* Text */}
          {activeType === 'text' && (
            <div>
              <AppTextarea
                label={t('textLabel')}
                value={formData.text || ''}
                onChange={(e) => handleField('text', e.target.value)}
                placeholder={t('textPlaceholder')}
                rows={4}
                className="text-sm"
              />
            </div>
          )}

          {/* Email */}
          {activeType === 'email' && (
            <div className="space-y-4">
              <AppInput
                label={t('emailTo')}
                type="email"
                value={formData.to || ''}
                onChange={(e) => handleField('to', e.target.value)}
                placeholder="user@example.com"
                startAdornment={<Mail className="w-4 h-4 text-label" />}
                className="h-11 text-sm"
              />
              <AppInput
                label={t('emailSubject')}
                type="text"
                value={formData.subject || ''}
                onChange={(e) => handleField('subject', e.target.value)}
                placeholder={t('emailSubject')}
                className="h-11 text-sm"
              />
              <AppTextarea
                label={t('emailBody')}
                value={formData.body || ''}
                onChange={(e) => handleField('body', e.target.value)}
                placeholder={t('emailBody')}
                rows={3}
                className="text-sm"
              />
            </div>
          )}

          {/* Phone */}
          {activeType === 'phone' && (
            <div>
              <AppInput
                label={t('phoneLabel')}
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleField('phone', e.target.value)}
                placeholder={t('phonePlaceholder')}
                startAdornment={<Phone className="w-4 h-4 text-label" />}
                className="h-11 text-sm"
              />
            </div>
          )}

          {/* WiFi */}
          {activeType === 'wifi' && (
            <div className="space-y-4">
              <AppInput
                label={t('wifiSsid')}
                type="text"
                value={formData.ssid || ''}
                onChange={(e) => handleField('ssid', e.target.value)}
                placeholder="WiFi Network Name"
                startAdornment={<Wifi className="w-4 h-4 text-label" />}
                className="h-11 text-sm"
              />
              <AppSelect<WifiSecurity>
                label={t('wifiSecurity')}
                options={securityOptions}
                value={wifiSecurity}
                onChange={(val) => setWifiSecurity(val)}
                searchable={false}
              />
              {wifiSecurity !== 'none' && (
                <AppInput
                  label={t('wifiPassword')}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password || ''}
                  onChange={(e) => handleField('password', e.target.value)}
                  placeholder="••••••••"
                  className="h-11 text-sm"
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-label hover:text-foreground transition-colors p-1"
                      aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                />
              )}
              <div className="pt-1">
                <AppCheckbox
                  label={t('hiddenNetwork')}
                  checked={wifiHidden}
                  onChange={(checked) => setWifiHidden(checked)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Preview + Actions */}
      <div className="lg:col-span-5 space-y-4">
        <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-foreground">
          {t('preview')}
        </h2>

        {/* QR Display Container */}
        <div className="flex flex-col items-center justify-center rounded-[2px] bg-tertiary border border-border p-6 min-h-[300px]">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : previewDataUrl ? (
            <div className="p-3 bg-white rounded-[2px] shadow-sm flex items-center justify-center">
              <img
                src={previewDataUrl}
                alt="QR Code Preview"
                className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-label">
              <QrCode className="w-12 h-12 text-label/40 mb-3" />
              <p className="text-sm max-w-xs">{t('emptyState')}</p>
            </div>
          )}
        </div>

        {/* Actions when QR is ready */}
        {previewDataUrl && (
          <div className="space-y-4 pt-1">
            {/* Size Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold uppercase text-label">
                {t('size')}
              </label>
              <AppSegmentedControl<QrSize>
                options={sizeOptions}
                value={selectedSize}
                onChange={(val) => setSelectedSize(val)}
                bordered
                fontWeight="medium"
                fullWidth
                size="sm"
              />
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <AppButton
                type="button"
                color="primary"
                icon={<Download className="w-4 h-4" />}
                iconPosition="left"
                onClick={handleDownloadPng}
                className="w-full text-sm font-semibold justify-center h-11"
              >
                {t('downloadPng')} ({selectedSize}px)
              </AppButton>

              <div className="grid grid-cols-2 gap-2">
                <AppButton
                  type="button"
                  color="tertiary"
                  icon={<Download className="w-4 h-4" />}
                  iconPosition="left"
                  onClick={handleDownloadSvg}
                  className="w-full text-xs font-semibold justify-center h-10"
                >
                  {t('downloadSvg')}
                </AppButton>
                <AppButton
                  type="button"
                  color="tertiary"
                  icon={
                    isCopied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )
                  }
                  iconPosition="left"
                  onClick={handleCopySvg}
                  className="w-full text-xs font-semibold justify-center h-10"
                >
                  {isCopied ? t('copied') : t('copySvg')}
                </AppButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
