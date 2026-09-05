'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shuffle,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Building2,
  Search,
  Loader2,
  FileText,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  generateCnpj,
  generateBulkCnpj,
  validateCnpj,
  formatCnpj,
  cleanCnpj,
  fetchCnpjCompanyData,
  CnpjCompanyData,
} from '@/lib/developer/cnpj'

const SAMPLE_CNPJS = [
  { name: 'Banco do Brasil', cnpj: '00.000.000/0001-91' },
  { name: 'Petrobras', cnpj: '33.000.167/0001-01' },
  { name: 'Google Brasil', cnpj: '06.990.590/0001-23' },
  { name: 'Mercado Livre', cnpj: '03.361.252/0001-34' },
]

export default function CnpjGenerator() {
  const t = useTranslations('developer.cnpjGenerator')

  const [tab, setTab] = useState<'generate' | 'validate' | 'lookup'>('generate')

  // Generator state
  const [formatted, setFormatted] = useState(true)
  const [isBranch, setIsBranch] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [generatedCnpjs, setGeneratedCnpjs] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  // Validator state
  const [cnpjToValidate, setCnpjToValidate] = useState('')

  // Lookup state
  const [lookupCnpj, setLookupCnpj] = useState('')
  const [loadingLookup, setLoadingLookup] = useState(false)
  const [companyData, setCompanyData] = useState<CnpjCompanyData | null>(null)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [copiedCompany, setCopiedCompany] = useState(false)

  const handleGenerate = () => {
    const list = generateBulkCnpj(quantity, formatted, isBranch)
    setGeneratedCnpjs(list)
  }

  const copySingle = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(generatedCnpjs.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  // Live validation
  const validationResult = useMemo(() => {
    if (!cnpjToValidate.trim()) return null
    return validateCnpj(cnpjToValidate)
  }, [cnpjToValidate])

  // Lookup handler
  const handleLookup = async (cnpjQuery?: string) => {
    const target = cnpjQuery || lookupCnpj
    if (!target.trim()) return

    setLoadingLookup(true)
    setLookupError(null)
    setCompanyData(null)

    const res = await fetchCnpjCompanyData(target)
    setLoadingLookup(false)

    if (res.error) {
      setLookupError(res.error)
    } else if (res.data) {
      setCompanyData(res.data)
    }
  }

  const selectLookupFromGen = (cnpj: string) => {
    setLookupCnpj(cnpj)
    setTab('lookup')
    handleLookup(cnpj)
  }

  const copyCompanySummary = async () => {
    if (!companyData) return
    const text = [
      `Razão Social: ${companyData.razao_social}`,
      `Nome Fantasia: ${companyData.nome_fantasia || 'Não informado'}`,
      `CNPJ: ${formatCnpj(companyData.cnpj)}`,
      `Situação: ${companyData.situacao_cadastral}`,
      `Abertura: ${companyData.data_inicio_atividade || 'Não informada'}`,
      `CNAE Principal: ${companyData.cnae_fiscal_descricao || 'Não informado'}`,
      `Capital Social: R$ ${(companyData.capital_social || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      `Endereço: ${companyData.logradouro || ''}, ${companyData.numero || ''} - ${companyData.bairro || ''}, ${companyData.municipio || ''}/${companyData.uf || ''} - CEP ${companyData.cep || ''}`,
    ].join('\n')

    await navigator.clipboard.writeText(text)
    setCopiedCompany(true)
    setTimeout(() => setCopiedCompany(false), 2000)
  }

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
        <button
          type="button"
          onClick={() => setTab('lookup')}
          className={`flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-md transition-all text-center cursor-pointer ${
            tab === 'lookup'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-tx-secondary hover:text-tx-primary'
          }`}
        >
          {t('tabs.lookup')}
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

              {/* Establishment Type */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-tx-secondary">
                  {t('options.type')}
                </label>
                <select
                  value={isBranch ? 'branch' : 'headquarters'}
                  onChange={(e) => setIsBranch(e.target.value === 'branch')}
                  className="w-full px-3.5 py-2.5 border border-bd-base bg-surface text-tx-primary rounded-lg text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
                >
                  <option value="headquarters">{t('options.headquarters')}</option>
                  <option value="branch">{t('options.branch')}</option>
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
                  <option value={1}>1 CNPJ</option>
                  <option value={5}>5 CNPJs</option>
                  <option value={10}>10 CNPJs</option>
                  <option value={20}>20 CNPJs</option>
                  <option value={50}>50 CNPJs</option>
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

          {/* Results list */}
          {generatedCnpjs.length > 0 && (
            <div className="bg-card border border-bd-base rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-bd-base">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-neon" />
                  <h3 className="font-bold text-base sm:text-lg text-tx-primary">
                    {t('results.title')} ({generatedCnpjs.length})
                  </h3>
                </div>

                {generatedCnpjs.length > 1 && (
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
                {generatedCnpjs.map((cnpj, idx) => (
                  <div
                    key={`${cnpj}-${idx}`}
                    className="p-3.5 bg-surface border border-bd-base rounded-lg flex items-center justify-between gap-2.5 hover:border-bd-neon/40 transition-colors"
                  >
                    <span className="font-mono font-bold text-base sm:text-lg text-tx-primary tracking-wide">
                      {cnpj}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => selectLookupFromGen(cnpj)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-tx-secondary hover:text-blue-600 bg-elevated hover:bg-card border border-bd-base rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                        title="Consultar dados da empresa"
                      >
                        <Search size={13} />
                        <span className="hidden sm:inline">Consultar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => copySingle(cnpj, idx)}
                        className="p-2 text-tx-secondary hover:text-neon bg-elevated hover:bg-card border border-bd-base rounded-md transition-colors cursor-pointer"
                        title={t('results.copy')}
                        aria-label={`Copiar CNPJ ${cnpj}`}
                      >
                        {copiedIndex === idx ? (
                          <Check size={16} className="text-neon" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
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
              value={cnpjToValidate}
              onChange={(e) => setCnpjToValidate(e.target.value)}
              placeholder="00.000.000/0001-00 ou 00000000000100"
              maxLength={18}
              className="w-full px-4 py-3 border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-lg text-base sm:text-lg font-mono focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
            />
            <p className="text-xs sm:text-sm text-tx-muted">{t('validate.hint')}</p>
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
                    <span className="text-tx-muted block text-xs">CNPJ Formatado:</span>
                    <span className="font-mono font-bold text-base">{validationResult.formatted}</span>
                  </div>
                  <div>
                    <span className="text-tx-muted block text-xs">CNPJ Limpo:</span>
                    <span className="font-mono font-bold text-base">{validationResult.clean}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* LOOKUP (API) TAB */}
      {tab === 'lookup' && (
        <div className="space-y-6">
          <div className="bg-card border border-bd-base rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-tx-secondary">
                {t('lookup.inputLabel')}
              </label>
              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={lookupCnpj}
                  onChange={(e) => setLookupCnpj(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  placeholder="00.000.000/0001-00"
                  maxLength={18}
                  className="flex-1 px-4 py-2.5 border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-lg font-mono text-sm sm:text-base focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
                />
                <button
                  type="button"
                  onClick={() => handleLookup()}
                  disabled={loadingLookup || !lookupCnpj.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:not-disabled:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {loadingLookup ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}
                  <span>{t('lookup.searchButton')}</span>
                </button>
              </div>
            </div>

            {/* Quick samples */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-tx-muted">Exemplos rápidos:</span>
              {SAMPLE_CNPJS.map((s) => (
                <button
                  key={s.cnpj}
                  type="button"
                  onClick={() => {
                    setLookupCnpj(s.cnpj)
                    handleLookup(s.cnpj)
                  }}
                  className="px-2.5 py-1 bg-elevated hover:bg-surface border border-bd-base hover:border-bd-neon/40 text-tx-secondary hover:text-neon rounded-md transition-colors cursor-pointer"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {lookupError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm flex items-center gap-2.5">
              <AlertCircle size={20} className="shrink-0 text-red-500" />
              <span>{lookupError}</span>
            </div>
          )}

          {/* Company Data Card */}
          {companyData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-bd-base rounded-xl p-5 sm:p-6 shadow-xs space-y-6"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-bd-base">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-xl sm:text-2xl font-bold text-tx-primary">
                      {companyData.razao_social}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        companyData.situacao_cadastral === 'ATIVA'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {companyData.situacao_cadastral}
                    </span>
                  </div>
                  {companyData.nome_fantasia && (
                    <p className="text-sm font-medium text-tx-secondary">
                      Nome Fantasia: {companyData.nome_fantasia}
                    </p>
                  )}
                  <p className="font-mono text-sm text-neon font-bold">
                    CNPJ: {formatCnpj(companyData.cnpj)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyCompanySummary}
                  className="px-3.5 py-2 text-sm font-semibold text-tx-primary hover:text-neon bg-elevated hover:bg-surface border border-bd-base rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  {copiedCompany ? <Check size={16} className="text-neon" /> : <Copy size={16} />}
                  <span>{copiedCompany ? t('results.copied') : t('lookup.copyData')}</span>
                </button>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3.5 bg-surface border border-bd-base rounded-lg space-y-1">
                  <span className="text-xs text-tx-muted flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-blue-500" /> Data de Abertura
                  </span>
                  <p className="font-semibold text-tx-primary">
                    {companyData.data_inicio_atividade || 'Não informada'}
                  </p>
                </div>

                <div className="p-3.5 bg-surface border border-bd-base rounded-lg space-y-1">
                  <span className="text-xs text-tx-muted flex items-center gap-1.5 font-medium">
                    <DollarSign size={14} className="text-emerald-500" /> Capital Social
                  </span>
                  <p className="font-semibold text-tx-primary">
                    R${' '}
                    {(companyData.capital_social || 0).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="p-3.5 bg-surface border border-bd-base rounded-lg space-y-1">
                  <span className="text-xs text-tx-muted flex items-center gap-1.5 font-medium">
                    <Building2 size={14} className="text-purple-500" /> Porte da Empresa
                  </span>
                  <p className="font-semibold text-tx-primary">
                    {companyData.porte || 'Não informado'}
                  </p>
                </div>

                <div className="sm:col-span-2 md:col-span-3 p-3.5 bg-surface border border-bd-base rounded-lg space-y-1">
                  <span className="text-xs text-tx-muted flex items-center gap-1.5 font-medium">
                    <FileText size={14} className="text-amber-500" /> Atividade Principal (CNAE)
                  </span>
                  <p className="font-medium text-tx-primary">
                    {companyData.cnae_fiscal_descricao || 'Não informado'}
                  </p>
                </div>

                <div className="sm:col-span-2 md:col-span-3 p-3.5 bg-surface border border-bd-base rounded-lg space-y-1">
                  <span className="text-xs text-tx-muted flex items-center gap-1.5 font-medium">
                    <MapPin size={14} className="text-rose-500" /> Endereço Completo
                  </span>
                  <p className="font-medium text-tx-primary">
                    {companyData.logradouro || ''}, {companyData.numero || ''}
                    {companyData.complemento ? ` (${companyData.complemento})` : ''} -{' '}
                    {companyData.bairro || ''}, {companyData.municipio || ''}/
                    {companyData.uf || ''} - CEP {companyData.cep || ''}
                  </p>
                </div>
              </div>

              {/* Partners (QSA) */}
              {companyData.qsa && companyData.qsa.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-tx-primary">
                    <Users size={16} className="text-neon" />
                    <span>Quadro de Sócios e Administradores (QSA)</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neon/10 text-neon">
                      {companyData.qsa.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {companyData.qsa.map((partner, pIdx) => (
                      <div
                        key={`${partner.nome_socio}-${pIdx}`}
                        className="p-3 bg-surface border border-bd-base rounded-lg text-sm space-y-0.5"
                      >
                        <p className="font-semibold text-tx-primary truncate">
                          {partner.nome_socio}
                        </p>
                        <p className="text-xs text-tx-muted truncate">
                          {partner.qualificacao_socio}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
