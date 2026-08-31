'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Copy, Check, CheckCircle2, XCircle, ShieldCheck, FileText, ListOrdered, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  generateCpf,
  generateBulkCpf,
  validateCpf,
  formatCpf,
  cleanCpf,
  CPF_REGIONS,
  CpfValidationResult,
} from '@/lib/developer/cpf'

export default function CpfGenerator() {
  const t = useTranslations('developer.cpfGenerator')

  // Tabs
  const [tab, setTab] = useState<'generate' | 'validate'>('generate')

  // Generator state
  const [formatted, setFormatted] = useState(true)
  const [regionCode, setRegionCode] = useState<number | 'all'>('all')
  const [quantity, setQuantity] = useState(1)
  const [generatedCpfs, setGeneratedCpfs] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  // Validator state
  const [cpfToValidate, setCpfToValidate] = useState('')
  const [copiedValid, setCopiedValid] = useState(false)

  const handleGenerate = () => {
    const reg = regionCode === 'all' ? undefined : regionCode
    const list = generateBulkCpf(quantity, formatted, reg)
    setGeneratedCpfs(list)
  }

  const copySingle = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(generatedCpfs.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  // Live validation
  const validationResult: CpfValidationResult | null = useMemo(() => {
    if (!cpfToValidate.trim()) return null
    return validateCpf(cpfToValidate)
  }, [cpfToValidate])

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
          onClick={() => setTab('validate')}
          className={`flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-md transition-all text-center cursor-pointer ${
            tab === 'validate'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-tx-secondary hover:text-tx-primary'
          }`}
        >
          {t('tabs.validate')}
        </button>
      </div>

      {/* GENERATOR TAB */}
      {tab === 'generate' && (
        <div className="space-y-6">
          <div className="bg-card border border-bd-base rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Format */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-tx-secondary">
                  {t('options.format')}
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-tx-primary font-medium">
                    <input
                      type="checkbox"
                      checked={formatted}
                      onChange={(e) => setFormatted(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-bd-base bg-surface"
                    />
                    <span>{t('options.withMask')}</span>
                  </label>
                </div>
              </div>

              {/* State / Region */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-tx-secondary">
                  {t('options.region')}
                </label>
                <select
                  value={regionCode}
                  onChange={(e) =>
                    setRegionCode(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="w-full px-3.5 py-2.5 border border-bd-base bg-surface text-tx-primary rounded-lg text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
                >
                  <option value="all">{t('options.allRegions')}</option>
                  {CPF_REGIONS.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.states.join(', ')} ({r.label})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-tx-secondary">
                  {t('options.quantity')}
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-bd-base bg-surface text-tx-primary rounded-lg text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
                >
                  <option value={1}>1 CPF</option>
                  <option value={5}>5 CPFs</option>
                  <option value={10}>10 CPFs</option>
                  <option value={20}>20 CPFs</option>
                  <option value={50}>50 CPFs</option>
                </select>
              </div>
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

          {/* Generated results */}
          {generatedCpfs.length > 0 && (
            <div className="bg-card border border-bd-base rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-bd-base">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-neon" />
                  <h3 className="font-bold text-base sm:text-lg text-tx-primary">
                    {t('results.title')} ({generatedCpfs.length})
                  </h3>
                </div>

                {generatedCpfs.length > 1 && (
                  <button
                    type="button"
                    onClick={copyAll}
                    className="px-3.5 py-1.5 text-sm font-semibold text-tx-primary hover:text-neon bg-elevated hover:bg-surface border border-bd-base hover:border-bd-neon/40 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    {copiedAll ? <Check size={16} className="text-neon" /> : <Copy size={16} />}
                    <span>{copiedAll ? t('results.copiedAll') : t('results.copyAll')}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {generatedCpfs.map((cpf, idx) => {
                  const info = validateCpf(cpf)
                  return (
                    <div
                      key={`${cpf}-${idx}`}
                      className="p-3.5 bg-surface border border-bd-base rounded-lg flex items-center justify-between gap-2.5 hover:border-bd-neon/40 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-base sm:text-lg text-tx-primary tracking-wide">
                          {cpf}
                        </span>
                        {info.region && (
                          <p className="text-xs text-tx-muted">
                            {info.region.states.join(', ')} ({info.region.label})
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => copySingle(cpf, idx)}
                        className="p-2 text-tx-secondary hover:text-neon bg-elevated hover:bg-card border border-bd-base rounded-md transition-colors cursor-pointer"
                        title={t('results.copy')}
                        aria-label={`Copiar CPF ${cpf}`}
                      >
                        {copiedIndex === idx ? (
                          <Check size={16} className="text-neon" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VALIDATOR TAB */}
      {tab === 'validate' && (
        <div className="bg-card border border-bd-base rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-tx-secondary">
              {t('validate.inputLabel')}
            </label>
            <input
              type="text"
              value={cpfToValidate}
              onChange={(e) => setCpfToValidate(e.target.value)}
              placeholder="000.000.000-00 ou 00000000000"
              maxLength={14}
              className="w-full px-4 py-3 border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-lg text-base sm:text-lg font-mono focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
            />
            <p className="text-xs sm:text-sm text-tx-muted">
              {t('validate.hint')}
            </p>
          </div>

          {/* Validation Result Box */}
          {validationResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 sm:p-5 rounded-xl border ${
                validationResult.valid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300'
              } space-y-3`}
            >
              <div className="flex items-center gap-2.5">
                {validationResult.valid ? (
                  <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                ) : (
                  <XCircle size={24} className="text-red-500 shrink-0" />
                )}
                <div>
                  <h4 className="font-bold text-base sm:text-lg">
                    {validationResult.valid
                      ? t('validate.validTitle')
                      : t('validate.invalidTitle')}
                  </h4>
                  {validationResult.errorMessage && (
                    <p className="text-sm opacity-90">{validationResult.errorMessage}</p>
                  )}
                </div>
              </div>

              {validationResult.valid && (
                <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-tx-primary">
                  <div>
                    <span className="text-tx-muted block text-xs">CPF Formatado:</span>
                    <span className="font-mono font-bold text-base">{validationResult.formatted}</span>
                  </div>
                  <div>
                    <span className="text-tx-muted block text-xs">CPF Limpo:</span>
                    <span className="font-mono font-bold text-base">{validationResult.clean}</span>
                  </div>
                  {validationResult.region && (
                    <div className="sm:col-span-2">
                      <span className="text-tx-muted block text-xs">Região Fiscal de Origem:</span>
                      <span className="font-medium text-base">
                        {validationResult.region.states.join(', ')} ({validationResult.region.label})
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
