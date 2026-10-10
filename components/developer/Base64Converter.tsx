'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRightLeft,
  Copy,
  Check,
  Trash2,
  Sparkles,
  AlertCircle,
  FileCode2,
  Lock,
  Unlock,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { encodeBase64, decodeBase64, Base64Result } from '@/lib/developer/base64'

const SAMPLE_TEXT = `Olá, Mundo! 🚀 ToolNotch - Ferramentas Gratuitas para Desenvolvedores.`

export default function Base64Converter() {
  const t = useTranslations('developer.base64Converter')

  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')
  const [urlSafe, setUrlSafe] = useState(false)
  const [copied, setCopied] = useState(false)

  // Real-time conversion
  const result: Base64Result = useMemo(() => {
    if (!input.trim()) return { text: '', valid: true, bytesCount: 0 }
    return mode === 'encode' ? encodeBase64(input, urlSafe) : decodeBase64(input, urlSafe)
  }, [input, mode, urlSafe])

  const handleSwap = () => {
    if (result.valid && result.text) {
      setInput(result.text)
      setMode(mode === 'encode' ? 'decode' : 'encode')
    } else {
      setMode(mode === 'encode' ? 'decode' : 'encode')
    }
  }

  const handleLoadSample = () => {
    if (mode === 'encode') {
      setInput(SAMPLE_TEXT)
    } else {
      setInput(encodeBase64(SAMPLE_TEXT).text)
    }
  }

  const handleClear = () => {
    setInput('')
  }

  const handleCopy = async () => {
    if (!result.text) return
    await navigator.clipboard.writeText(result.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row w-full p-1 bg-elevated border border-bd-base rounded-lg gap-1">
        <button
          type="button"
          onClick={() => setMode('encode')}
          className={`flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-md transition-all text-center cursor-pointer flex items-center justify-center gap-2 ${
            mode === 'encode'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-tx-secondary hover:text-tx-primary'
          }`}
        >
          <Lock size={16} />
          <span>{t('tabs.encode')}</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('decode')}
          className={`flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-md transition-all text-center cursor-pointer flex items-center justify-center gap-2 ${
            mode === 'decode'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-tx-secondary hover:text-tx-primary'
          }`}
        >
          <Unlock size={16} />
          <span>{t('tabs.decode')}</span>
        </button>
      </div>

      {/* Editor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Input Card */}
        <div className="bg-card border border-bd-base rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-bd-base mb-3">
              <label className="font-bold text-sm sm:text-base text-tx-primary">
                {mode === 'encode' ? t('input.encodeLabel') : t('input.decodeLabel')}
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-xs font-medium text-tx-secondary hover:text-neon flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>Exemplo</span>
                </button>
                {input.trim() && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Limpar</span>
                  </button>
                )}
              </div>
            </div>

            <textarea
              rows={8}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? t('input.encodePlaceholder') : t('input.decodePlaceholder')}
              className="w-full p-3 font-mono text-sm border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-lg focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon leading-relaxed resize-y"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-tx-muted">
            <span>{input.length} caracteres</span>
            <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-tx-primary">
              <input
                type="checkbox"
                checked={urlSafe}
                onChange={(e) => setUrlSafe(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-bd-base bg-surface"
              />
              <span>Modo URL-Safe (- e _)</span>
            </label>
          </div>
        </div>

        {/* Output Card */}
        <div className="bg-card border border-bd-base rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-bd-base mb-3">
              <label className="font-bold text-sm sm:text-base text-tx-primary">
                {mode === 'encode' ? t('output.encodeLabel') : t('output.decodeLabel')}
              </label>

              {result.text && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-elevated hover:bg-surface border border-bd-base text-tx-primary hover:text-neon rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {copied ? <Check size={13} className="text-neon" /> : <Copy size={13} />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              )}
            </div>

            <textarea
              rows={8}
              readOnly
              value={result.text}
              placeholder="O resultado convertido aparecerá aqui em tempo real..."
              className="w-full p-3 font-mono text-sm border border-bd-base bg-surface/70 text-tx-primary rounded-lg focus:outline-none leading-relaxed resize-y select-all"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 text-xs text-tx-muted">
            <span>{result.text ? `${result.text.length} caracteres (${result.bytesCount || 0} bytes)` : 'Pronto'}</span>

            {result.text && (
              <button
                type="button"
                onClick={handleSwap}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowRightLeft size={13} />
                <span>Inverter e continuar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error message if invalid Base64 */}
      {!result.valid && result.errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-700 dark:text-red-300 text-sm flex items-center gap-2.5">
          <AlertCircle size={18} className="shrink-0 text-red-500" />
          <span>{result.errorMessage}</span>
        </div>
      )}
    </div>
  )
}
