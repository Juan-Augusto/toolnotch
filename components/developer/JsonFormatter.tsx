'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2,
  Copy,
  Check,
  Download,
  Trash2,
  Sparkles,
  Minimize2,
  Maximize2,
  AlertCircle,
  CheckCircle2,
  FileCode2,
  Zap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  validateJson,
  formatJson,
  minifyJson,
  JsonValidationResult,
} from '@/lib/developer/jsonTools'

const SAMPLE_JSON = `{
  "app": "ToolNotch",
  "version": "2.4.0",
  "developer": {
    "name": "Equipe ToolNotch",
    "role": "Engenharia de Software",
    "skills": ["TypeScript", "Next.js", "React", "Tailwind CSS"]
  },
  "features": [
    { "id": 1, "title": "Gerador de CPF", "active": true },
    { "id": 2, "title": "Gerador de CNPJ", "active": true },
    { "id": 3, "title": "Gerador de UUID", "active": true },
    { "id": 4, "title": "Formatador JSON", "active": true }
  ],
  "stats": {
    "users": 150000,
    "uptimePercent": 99.98,
    "privacyGuaranteed": true
  }
}`

export default function JsonFormatter() {
  const t = useTranslations('developer.jsonFormatter')

  const [inputJson, setInputJson] = useState('')
  const [indent, setIndent] = useState<2 | 4 | 'tab'>(2)
  const [copied, setCopied] = useState(false)

  // Real-time validation and stats
  const validation: JsonValidationResult = useMemo(() => {
    return validateJson(inputJson)
  }, [inputJson])

  const handleFormat = () => {
    if (!inputJson.trim()) return
    const res = formatJson(inputJson, indent)
    if (res.formatted) {
      setInputJson(res.formatted)
    }
  }

  const handleMinify = () => {
    if (!inputJson.trim()) return
    const res = minifyJson(inputJson)
    if (res.minified) {
      setInputJson(res.minified)
    }
  }

  const handleLoadSample = () => {
    setInputJson(SAMPLE_JSON)
  }

  const handleClear = () => {
    setInputJson('')
  }

  const handleCopy = async () => {
    if (!inputJson.trim()) return
    await navigator.clipboard.writeText(inputJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!inputJson.trim()) return
    const blob = new Blob([inputJson], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Card */}
      <div className="bg-card border border-bd-base rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-bd-base">
          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleFormat}
              disabled={!inputJson.trim() || !validation.valid}
              className="px-4 py-2 bg-blue-600 hover:not-disabled:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Maximize2 size={16} />
              <span>{t('button.format')}</span>
            </button>

            <button
              type="button"
              onClick={handleMinify}
              disabled={!inputJson.trim() || !validation.valid}
              className="px-4 py-2 bg-surface hover:not-disabled:bg-card border border-bd-base hover:not-disabled:border-bd-neon/40 text-tx-primary hover:not-disabled:text-neon disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Minimize2 size={16} />
              <span>{t('button.minify')}</span>
            </button>

            <div className="flex items-center gap-1 pl-2 border-l border-bd-base text-sm">
              <span className="text-xs text-tx-muted hidden sm:inline">Indentação:</span>
              <select
                value={indent}
                onChange={(e) =>
                  setIndent(e.target.value === 'tab' ? 'tab' : (Number(e.target.value) as 2 | 4))
                }
                className="px-2.5 py-1.5 bg-surface border border-bd-base text-tx-primary rounded-md text-xs sm:text-sm font-medium focus:outline-none focus:border-neon"
              >
                <option value={2}>2 espaços</option>
                <option value={4}>4 espaços</option>
                <option value="tab">Tab</option>
              </select>
            </div>
          </div>

          {/* Auxiliary actions */}
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-3 py-1.5 text-tx-secondary hover:text-neon hover:bg-elevated rounded-md transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-medium cursor-pointer"
            >
              <Sparkles size={15} />
              <span>{t('button.loadSample')}</span>
            </button>

            {inputJson.trim() && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-medium cursor-pointer"
              >
                <Trash2 size={15} />
                <span>{t('button.clear')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Textarea Editor */}
        <div className="relative">
          <textarea
            rows={14}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder={t('inputPlaceholder')}
            spellCheck={false}
            className="w-full p-4 font-mono text-sm sm:text-base border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-lg focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon leading-relaxed resize-y"
          />

          {/* Quick Copy / Download overlay buttons */}
          {inputJson.trim() && (
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 bg-elevated/90 hover:bg-surface border border-bd-base text-tx-secondary hover:text-neon rounded-lg shadow-sm backdrop-blur-xs transition-colors cursor-pointer"
                title={t('button.copy')}
                aria-label="Copiar JSON"
              >
                {copied ? <Check size={16} className="text-neon" /> : <Copy size={16} />}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="p-2 bg-elevated/90 hover:bg-surface border border-bd-base text-tx-secondary hover:text-neon rounded-lg shadow-sm backdrop-blur-xs transition-colors cursor-pointer"
                title={t('button.download')}
                aria-label="Baixar arquivo JSON"
              >
                <Download size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Validation Status & Stats Card */}
      {inputJson.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-bd-base rounded-xl p-5 shadow-xs space-y-4"
        >
          {/* Status Header */}
          <div className="flex items-center gap-2.5">
            {validation.valid ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                <CheckCircle2 size={20} />
                <span>{t('status.validJson')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-base">
                <AlertCircle size={20} />
                <span>{t('status.invalidJson')}</span>
              </div>
            )}
          </div>

          {/* Error display if invalid */}
          {!validation.valid && validation.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg space-y-1.5 text-sm text-red-800 dark:text-red-300">
              <p className="font-semibold">{validation.error.message}</p>
              {(validation.error.line !== undefined || validation.error.column !== undefined) && (
                <p className="text-xs opacity-90">
                  Localização: Linha {validation.error.line}, Coluna {validation.error.column}
                </p>
              )}
              {validation.error.snippet && (
                <div className="mt-2 p-2.5 bg-card border border-red-500/20 rounded font-mono text-xs text-tx-primary overflow-x-auto">
                  {validation.error.snippet}
                </div>
              )}
            </div>
          )}

          {/* Stats if valid */}
          {validation.valid && validation.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
              <div className="p-3 bg-surface border border-bd-base rounded-lg space-y-0.5">
                <span className="text-xs text-tx-muted block">Tamanho Original:</span>
                <span className="font-semibold text-tx-primary">
                  {validation.stats.originalBytes} bytes
                </span>
              </div>

              <div className="p-3 bg-surface border border-bd-base rounded-lg space-y-0.5">
                <span className="text-xs text-tx-muted block">Tamanho Minificado:</span>
                <span className="font-semibold text-tx-primary">
                  {validation.stats.minifiedBytes} bytes
                </span>
              </div>

              <div className="p-3 bg-surface border border-bd-base rounded-lg space-y-0.5">
                <span className="text-xs text-tx-muted block">Redução:</span>
                <span className="font-bold text-neon">
                  {validation.stats.compressionRatioPercent}%
                </span>
              </div>

              <div className="p-3 bg-surface border border-bd-base rounded-lg space-y-0.5">
                <span className="text-xs text-tx-muted block">Chaves / Propriedades:</span>
                <span className="font-semibold text-tx-primary">
                  {validation.stats.keyCount}
                </span>
              </div>

              <div className="p-3 bg-surface border border-bd-base rounded-lg space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-xs text-tx-muted block">Profundidade Máx:</span>
                <span className="font-semibold text-tx-primary">
                  {validation.stats.depth} níveis
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
