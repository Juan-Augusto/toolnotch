'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shuffle,
  Copy,
  Check,
  Download,
  Code2,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Fingerprint,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  generateUuid,
  generateBulkUuid,
  inspectUuid,
  UuidVersion,
  UuidInspectionResult,
} from '@/lib/developer/uuid'

export default function UuidGenerator() {
  const t = useTranslations('developer.uuidGenerator')

  const [tab, setTab] = useState<'generate' | 'inspect'>('generate')

  // Generator state
  const [version, setVersion] = useState<UuidVersion>('v4')
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [braces, setBraces] = useState(false)
  const [quantity, setQuantity] = useState(5)
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)

  // Inspector state
  const [uuidToInspect, setUuidToInspect] = useState('')

  const handleGenerate = () => {
    const list = generateBulkUuid(quantity, version, { uppercase, hyphens, braces })
    setGeneratedUuids(list)
  }

  const copySingle = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(generatedUuids.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  const copyAsJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(generatedUuids, null, 2))
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2000)
  }

  const downloadTxt = () => {
    const blob = new Blob([generatedUuids.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `uuids-${version}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Live inspection
  const inspectionResult: UuidInspectionResult | null = useMemo(() => {
    if (!uuidToInspect.trim()) return null
    return inspectUuid(uuidToInspect)
  }, [uuidToInspect])

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row w-full p-1 bg-elevated border border-bd-base rounded-lg gap-1">
        <button
          type="button"
          onClick={() => setTab('generate')}
          className={`flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-md transition-all text-center cursor-pointer ${
            tab === 'generate'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-tx-secondary hover:text-tx-primary'
          }`}
        >
          {t('tabs.generate')}
        </button>
        <button
          type="button"
          onClick={() => setTab('inspect')}
          className={`flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-md transition-all text-center cursor-pointer ${
            tab === 'inspect'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-tx-secondary hover:text-tx-primary'
          }`}
        >
          {t('tabs.inspect')}
        </button>
      </div>

      {/* GENERATOR TAB */}
      {tab === 'generate' && (
        <div className="space-y-6">
          <div className="bg-card border border-bd-base rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
            {/* Version & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-tx-secondary">
                  {t('options.version')}
                </label>
                <select
                  value={version}
                  onChange={(e) => setVersion(e.target.value as UuidVersion)}
                  className="w-full px-3.5 py-2.5 border border-bd-base bg-surface text-tx-primary rounded-lg text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon font-medium"
                >
                  <option value="v4">UUID v4 (Aleatório Seguro / Padrão)</option>
                  <option value="v7">UUID v7 (Time-Ordered / Ordenável)</option>
                  <option value="v1">UUID v1 (Baseado em Timestamp)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-tx-secondary">
                  {t('options.quantity')}
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-bd-base bg-surface text-tx-primary rounded-lg text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon font-medium"
                >
                  <option value={1}>1 UUID</option>
                  <option value={5}>5 UUIDs</option>
                  <option value={10}>10 UUIDs</option>
                  <option value={25}>25 UUIDs</option>
                  <option value={50}>50 UUIDs</option>
                  <option value={100}>100 UUIDs</option>
                </select>
              </div>
            </div>

            {/* Checkboxes Formatting */}
            <div className="flex flex-wrap gap-5 pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-tx-primary font-medium">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-bd-base bg-surface"
                >
                </input>
                <span>{t('options.uppercase')}</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-tx-primary font-medium">
                <input
                  type="checkbox"
                  checked={hyphens}
                  onChange={(e) => setHyphens(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-bd-base bg-surface"
                >
                </input>
                <span>{t('options.hyphens')}</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-tx-primary font-medium">
                <input
                  type="checkbox"
                  checked={braces}
                  onChange={(e) => setBraces(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-bd-base bg-surface"
                >
                </input>
                <span>{t('options.braces')}</span>
              </label>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full py-3.5 px-6 bg-blue-600 hover:not-disabled:bg-blue-700 text-white text-base sm:text-lg font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Shuffle size={20} />
              <span>{t('button.generate')}</span>
            </button>
          </div>

          {/* Results list */}
          {generatedUuids.length > 0 && (
            <div className="bg-card border border-bd-base rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-bd-base">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-neon" />
                  <h3 className="font-bold text-base sm:text-lg text-tx-primary">
                    {t('results.title')} ({generatedUuids.length})
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={copyAll}
                    className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-tx-primary hover:text-neon bg-elevated hover:bg-surface border border-bd-base rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedAll ? <Check size={14} className="text-neon" /> : <Copy size={14} />}
                    <span>{copiedAll ? t('results.copiedAll') : t('results.copyAll')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={copyAsJson}
                    className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-tx-primary hover:text-neon bg-elevated hover:bg-surface border border-bd-base rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedJson ? <Check size={14} className="text-neon" /> : <Code2 size={14} />}
                    <span>{copiedJson ? 'JSON Copiado!' : 'JSON Array'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadTxt}
                    className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-tx-primary hover:text-neon bg-elevated hover:bg-surface border border-bd-base rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download size={14} />
                    <span>.TXT</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {generatedUuids.map((uuid, idx) => (
                  <div
                    key={`${uuid}-${idx}`}
                    className="p-3 bg-surface border border-bd-base rounded-lg flex items-center justify-between gap-3 hover:border-bd-neon/40 transition-colors"
                  >
                    <span className="font-mono text-sm sm:text-base text-tx-primary font-medium break-all select-all">
                      {uuid}
                    </span>

                    <button
                      type="button"
                      onClick={() => copySingle(uuid, idx)}
                      className="p-2 text-tx-secondary hover:text-neon bg-elevated hover:bg-card border border-bd-base rounded-md transition-colors cursor-pointer shrink-0"
                      title={t('results.copy')}
                      aria-label={`Copiar UUID ${uuid}`}
                    >
                      {copiedIndex === idx ? (
                        <Check size={16} className="text-neon" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* INSPECTOR TAB */}
      {tab === 'inspect' && (
        <div className="bg-card border border-bd-base rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-tx-secondary">
              {t('inspect.inputLabel')}
            </label>
            <input
              type="text"
              value={uuidToInspect}
              onChange={(e) => setUuidToInspect(e.target.value)}
              placeholder="Cole um UUID (ex: 550e8400-e29b-41d4-a716-446655440000)"
              className="w-full px-4 py-3 border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-lg font-mono text-sm sm:text-base focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
            />
            <p className="text-xs sm:text-sm text-tx-muted">{t('inspect.hint')}</p>
          </div>

          {inspectionResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-xl border ${
                inspectionResult.valid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300'
              } space-y-4`}
            >
              <div className="flex items-center gap-2.5">
                {inspectionResult.valid ? (
                  <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                ) : (
                  <XCircle size={24} className="text-red-500 shrink-0" />
                )}
                <div>
                  <h4 className="font-bold text-base sm:text-lg">
                    {inspectionResult.valid ? t('inspect.validTitle') : t('inspect.invalidTitle')}
                  </h4>
                  {inspectionResult.errorMessage && (
                    <p className="text-sm opacity-90">{inspectionResult.errorMessage}</p>
                  )}
                </div>
              </div>

              {inspectionResult.valid && (
                <div className="pt-3 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-tx-primary">
                  <div className="p-3 bg-surface/80 border border-bd-base rounded-lg space-y-0.5">
                    <span className="text-xs text-tx-muted block">Versão:</span>
                    <span className="font-bold text-base text-neon">
                      UUID v{inspectionResult.version}
                    </span>
                  </div>

                  <div className="p-3 bg-surface/80 border border-bd-base rounded-lg space-y-0.5">
                    <span className="text-xs text-tx-muted block">Variante:</span>
                    <span className="font-semibold text-sm">{inspectionResult.variant}</span>
                  </div>

                  {inspectionResult.timestampIso && (
                    <div className="p-3 bg-surface/80 border border-bd-base rounded-lg space-y-0.5 sm:col-span-2 md:col-span-1">
                      <span className="text-xs text-tx-muted block flex items-center gap-1">
                        <Clock size={13} /> Data de Criação:
                      </span>
                      <span className="font-mono text-xs font-semibold">
                        {new Date(inspectionResult.timestampIso).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
